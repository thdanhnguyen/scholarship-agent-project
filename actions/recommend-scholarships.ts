import { defineAction } from "@agent-native/core/action";
import { z } from "zod";

import { scholarships } from "../server/data/scholarships.js";

const degree = z.enum(["undergraduate", "masters", "phd"]);
const field = z.enum([
  "business",
  "computer-science",
  "engineering",
  "health",
  "social-sciences",
  "arts",
]);
const continent = z.enum(["any", "europe", "north-america", "asia", "oceania"]);

export default defineAction({
  description:
    "Rank the ten best scholarship and university opportunities for a student profile using the current vetted MVP catalog.",
  schema: z.object({
    degree: degree.describe("Target degree: undergraduate, masters, or phd"),
    field: field.describe("Primary field of study"),
    continent: continent.describe("Preferred continent, or any"),
    nationality: z.string().min(2).max(80).describe("Applicant nationality"),
    intakeYear: z.coerce
      .number()
      .int()
      .min(2026)
      .max(2030)
      .describe("Target intake year"),
    gpa: z.coerce
      .number()
      .min(0)
      .max(10)
      .describe("Current GPA on a 10-point scale"),
    language: z
      .enum(["none", "ielts-5-5", "ielts-6-0", "ielts-6-5", "ielts-7-plus"])
      .describe("Current English proficiency band"),
    funding: z
      .enum(["full", "partial", "any"])
      .describe("Preferred funding level"),
    annualBudget: z.coerce
      .number()
      .min(0)
      .max(100000)
      .describe("Maximum annual self-funded budget in USD"),
  }),
  http: { method: "POST" },
  readOnly: true,
  run: async (profile) => {
    const ranked = scholarships
      .map((item) => {
        let score = 42;
        const reasons: string[] = [];

        if (item.degrees.includes(profile.degree)) {
          score += 22;
          reasons.push("Đúng bậc học bạn đang tìm");
        } else {
          score -= 18;
        }

        if (
          profile.continent === "any" ||
          item.continent === profile.continent
        ) {
          score += profile.continent === "any" ? 7 : 16;
          reasons.push(
            profile.continent === "any"
              ? "Phù hợp với phạm vi điểm đến mở"
              : "Nằm trong châu lục ưu tiên",
          );
        }

        if (
          item.fields.includes("all") ||
          item.fields.includes(profile.field)
        ) {
          score += 10;
          reasons.push("Có chương trình liên quan đến ngành đã chọn");
        }

        if (profile.funding === "any" || item.fundingType === profile.funding) {
          score += 8;
          reasons.push("Mức hỗ trợ phù hợp mục tiêu tài chính");
        }

        if (profile.gpa >= item.referenceGpa) {
          score += 8;
          reasons.push("GPA đạt mức tham chiếu của dữ liệu MVP");
        } else if (item.referenceGpa - profile.gpa > 1) {
          score -= 8;
        }

        if (profile.annualBudget <= 10000 && item.fundingType === "full")
          score += 5;
        if (profile.language === "ielts-7-plus") score += 3;

        return {
          id: item.id,
          name: item.name,
          provider: item.provider,
          country: item.country,
          continent: item.continent,
          degrees: item.degrees,
          fundingType: item.fundingType,
          coverage: item.coverage,
          officialUrl: item.officialUrl,
          matchScore: Math.max(35, Math.min(98, score)),
          reasons: reasons.slice(0, 3),
        };
      })
      .sort(
        (a, b) => b.matchScore - a.matchScore || a.name.localeCompare(b.name),
      )
      .slice(0, 10)
      .map((item, index) => ({ ...item, rank: index + 1 }));

    return {
      profile,
      recommendations: ranked,
      disclaimer:
        "Danh sách dùng dữ liệu mẫu của MVP. Điều kiện và thời hạn cần được xác minh tại nguồn chính thức trước khi nộp.",
      generatedAt: new Date().toISOString(),
    };
  },
});
