import { defineAction } from "@agent-native/core/action";
import { z } from "zod";

import type { StudyField } from "../server/data/scholarships.js";
import { scholarships } from "../server/data/scholarships.js";

const fieldKeywords: Record<StudyField, string[]> = {
  business: [
    "business",
    "kinh doanh",
    "finance",
    "tài chính",
    "marketing",
    "management",
    "quản trị",
    "economics",
    "kinh tế",
  ],
  "computer-science": [
    "computer",
    "máy tính",
    "software",
    "phần mềm",
    "data",
    "dữ liệu",
    "ai",
    "artificial intelligence",
    "cyber",
    "information technology",
  ],
  engineering: [
    "engineering",
    "kỹ thuật",
    "mechanical",
    "cơ khí",
    "electrical",
    "điện",
    "civil",
    "xây dựng",
    "chemical",
    "automation",
  ],
  health: [
    "health",
    "y",
    "medical",
    "medicine",
    "biomedical",
    "dược",
    "pharmacy",
    "nursing",
    "public health",
    "sinh học",
  ],
  "social-sciences": [
    "social",
    "xã hội",
    "law",
    "luật",
    "education",
    "giáo dục",
    "policy",
    "chính sách",
    "psychology",
    "tâm lý",
    "international relations",
  ],
  arts: [
    "art",
    "nghệ thuật",
    "humanities",
    "nhân văn",
    "design",
    "thiết kế",
    "language",
    "ngôn ngữ",
    "media",
    "truyền thông",
  ],
};

const destinationProfiles: Record<
  string,
  { livingCost: string; review: string }
> = {
  "Nhiều quốc gia Châu Âu": {
    livingCost: "900–1.600 USD/tháng",
    review:
      "Môi trường đa quốc gia; chi phí chênh lệch đáng kể giữa các thành phố.",
  },
  Đức: {
    livingCost: "950–1.400 USD/tháng",
    review:
      "Hạ tầng tốt và thế mạnh kỹ thuật; nhà ở tại thành phố lớn khá cạnh tranh.",
  },
  "Vương quốc Anh": {
    livingCost: "1.200–2.000 USD/tháng",
    review:
      "Chương trình sau đại học cô đọng và mạng lưới trường mạnh; chi phí đô thị cao.",
  },
  Hungary: {
    livingCost: "650–1.000 USD/tháng",
    review:
      "Chi phí tương đối dễ tiếp cận trong EU và cộng đồng sinh viên quốc tế phát triển.",
  },
  "Nhật Bản": {
    livingCost: "800–1.400 USD/tháng",
    review:
      "An toàn, giao thông tốt và mạnh về công nghệ; tiếng Nhật giúp tăng cơ hội hòa nhập.",
  },
  "Hàn Quốc": {
    livingCost: "750–1.250 USD/tháng",
    review:
      "Hệ sinh thái công nghệ năng động; nhịp học tập và làm việc thường khá cao.",
  },
  Singapore: {
    livingCost: "1.200–2.200 USD/tháng",
    review:
      "Trung tâm giáo dục châu Á, dùng tiếng Anh rộng rãi; nhà ở là khoản chi lớn.",
  },
  "Hoa Kỳ": {
    livingCost: "1.500–2.800 USD/tháng",
    review:
      "Lựa chọn ngành và nghiên cứu rộng; chi phí và bảo hiểm cần được lập kế hoạch kỹ.",
  },
  Canada: {
    livingCost: "1.200–2.200 USD/tháng",
    review:
      "Đa văn hóa và chất lượng sống cao; nhà ở tại các đô thị lớn chịu nhiều áp lực.",
  },
  Úc: {
    livingCost: "1.400–2.400 USD/tháng",
    review:
      "Trường nghiên cứu mạnh và dịch vụ sinh viên tốt; mức thuê nhà tại thành phố lớn cao.",
  },
  "New Zealand": {
    livingCost: "1.100–1.900 USD/tháng",
    review:
      "Môi trường sống yên bình; thị trường việc làm nhỏ hơn các điểm đến lớn.",
  },
};

const rankingProfiles: Record<string, string> = {
  "University of Oxford": "#4 thế giới · QS 2026 tham khảo",
  "University of Cambridge": "#6 thế giới · QS 2026 tham khảo",
  "Stanford University": "#3 thế giới · QS 2026 tham khảo",
  "University of Toronto": "Top 30 thế giới · QS 2026 tham khảo",
  "University of British Columbia": "Top 50 thế giới · QS 2026 tham khảo",
  "National University of Singapore": "#8 thế giới · QS 2026 tham khảo",
  "University of Melbourne": "Top 20 thế giới · QS 2026 tham khảo",
  "Monash University": "Top 40 thế giới · QS 2026 tham khảo",
};

const schema = z.object({
  degree: z.enum(["undergraduate", "masters", "phd"]),
  field: z
    .string()
    .trim()
    .min(2)
    .max(140)
    .describe("Free-text intended field of study"),
  specialization: z.string().trim().max(180).default(""),
  nationality: z.string().trim().min(2).max(80),
  continent: z.enum(["any", "europe", "north-america", "asia", "oceania"]),
  preferredCountries: z.string().trim().max(240).default(""),
  intakeYear: z.coerce.number().int().min(2026).max(2032),
  gpa: z.coerce.number().min(0).max(100),
  gpaScale: z.enum(["4", "10", "100"]),
  classRankPercent: z.coerce.number().min(0).max(100).default(0),
  languageTest: z.enum(["none", "ielts", "toefl", "duolingo", "other"]),
  languageScore: z.string().trim().max(20).default(""),
  workExperienceYears: z.coerce.number().min(0).max(40),
  researchExperienceYears: z.coerce.number().min(0).max(20),
  publications: z.coerce.number().int().min(0).max(100),
  publicationLevel: z.enum([
    "none",
    "conference",
    "journal",
    "indexed",
    "top-tier",
  ]),
  awards: z.coerce.number().int().min(0).max(100),
  extracurricularLevel: z.enum([
    "none",
    "participant",
    "leader",
    "national",
    "international",
  ]),
  leadershipYears: z.coerce.number().min(0).max(20),
  volunteerHours: z.coerce.number().min(0).max(10000),
  recommendationLetters: z.coerce.number().int().min(0).max(5),
  statementReadiness: z.coerce.number().int().min(1).max(5),
  funding: z.enum(["full", "partial", "any"]),
  annualBudget: z.coerce.number().min(0).max(200000),
  primaryPriority: z.enum([
    "cost",
    "career",
    "quality-of-life",
    "ranking",
    "research",
  ]),
});

function inferField(value: string): StudyField | null {
  const normalized = value.toLocaleLowerCase("vi");
  const match = Object.entries(fieldKeywords).find(([, keywords]) =>
    keywords.some((keyword) => normalized.includes(keyword)),
  );
  return (match?.[0] as StudyField | undefined) ?? null;
}

function languageStrength(test: string, rawScore: string): number {
  const score = Number.parseFloat(rawScore.replace(",", "."));
  if (!Number.isFinite(score) || test === "none") return 0;
  if (test === "ielts")
    return score >= 7.5
      ? 8
      : score >= 7
        ? 6
        : score >= 6.5
          ? 4
          : score >= 6
            ? 2
            : 0;
  if (test === "toefl")
    return score >= 105
      ? 8
      : score >= 95
        ? 6
        : score >= 85
          ? 4
          : score >= 75
            ? 2
            : 0;
  if (test === "duolingo")
    return score >= 135
      ? 8
      : score >= 125
        ? 6
        : score >= 115
          ? 4
          : score >= 105
            ? 2
            : 0;
  return 3;
}

export default defineAction({
  description:
    "Estimate scholarship fit, likely funding, strengths, gaps, and the ten best current catalog opportunities for a detailed candidate profile.",
  schema,
  http: { method: "POST" },
  // This is the single public action used by the account-free assessment.
  // It is read-only and accepts only the validated scholarship profile schema.
  requiresAuth: false,
  readOnly: true,
  run: async (profile) => {
    const normalizedGpa = (profile.gpa / Number(profile.gpaScale)) * 10;
    const inferredField = inferField(
      `${profile.field} ${profile.specialization}`,
    );
    const researchScore = Math.min(
      10,
      profile.researchExperienceYears * 2 + profile.publications * 1.5,
    );
    const experienceScore = Math.min(7, profile.workExperienceYears * 1.4);
    const extracurricularScore = {
      none: 0,
      participant: 2,
      leader: 5,
      national: 7,
      international: 9,
    }[profile.extracurricularLevel];
    const preparationScore = Math.min(
      7,
      profile.recommendationLetters * 1.2 + profile.statementReadiness * 0.8,
    );

    const ranked = scholarships
      .filter((item) => item.degrees.includes(profile.degree))
      .map((item) => {
        let score = 28;
        const reasons: string[] = ["Đúng bậc học mục tiêu"];
        const gaps: string[] = [];

        if (
          profile.continent === "any" ||
          item.continent === profile.continent
        ) {
          score += profile.continent === "any" ? 5 : 12;
          if (profile.continent !== "any") reasons.push("Đúng khu vực ưu tiên");
        } else score -= 10;

        if (
          item.fields.includes("all") ||
          (inferredField && item.fields.includes(inferredField))
        ) {
          score += 12;
          reasons.push(
            inferredField
              ? "Có chương trình gần với ngành đã nhập"
              : "Chấp nhận đa dạng ngành học",
          );
        } else if (inferredField) score -= 5;

        const gpaGap = normalizedGpa - item.referenceGpa;
        if (gpaGap >= 0.8) {
          score += 14;
          reasons.push("GPA nằm trong nhóm cạnh tranh");
        } else if (gpaGap >= 0) {
          score += 9;
          reasons.push("GPA đạt mức tham chiếu");
        } else {
          score -= Math.min(14, Math.abs(gpaGap) * 6);
          gaps.push("GPA thấp hơn mức tham chiếu của cơ hội này");
        }

        score += languageStrength(profile.languageTest, profile.languageScore);
        score +=
          profile.degree === "phd" ? researchScore : researchScore * 0.55;
        score += experienceScore;
        score +=
          extracurricularScore *
          (profile.degree === "undergraduate" ? 1 : 0.55);
        score += preparationScore;
        if (profile.publications > 0)
          reasons.push(
            `${profile.publications} công bố/bài báo tạo thêm lợi thế`,
          );
        if (profile.leadershipYears > 0)
          reasons.push("Có trải nghiệm lãnh đạo và hoạt động cộng đồng");

        if (profile.languageTest === "none")
          gaps.push("Chưa có chứng chỉ ngoại ngữ để xác minh điều kiện");
        if (profile.recommendationLetters < 2)
          gaps.push("Nên chuẩn bị ít nhất hai thư giới thiệu phù hợp");
        if (profile.degree === "phd" && profile.researchExperienceYears < 1)
          gaps.push("Hồ sơ tiến sĩ cần thêm bằng chứng nghiên cứu");
        if (profile.degree === "phd" && profile.publications === 0)
          gaps.push(
            "Công bố khoa học không luôn bắt buộc nhưng sẽ tăng sức cạnh tranh",
          );

        if (profile.funding === "full" && item.fundingType === "full")
          score += 7;
        if (profile.funding === "partial" && item.fundingType === "partial")
          score += 7;
        if (profile.annualBudget <= 10000 && item.fundingType === "full")
          score += 4;

        const matchScore = Math.round(Math.max(28, Math.min(94, score)));
        const fundingEstimate =
          item.fundingType === "full"
            ? "Có thể đạt 80–100% nếu vượt qua tuyển chọn"
            : "Ước tính 25–75% tùy hồ sơ và chương trình";

        return {
          id: item.id,
          name: item.name,
          provider: item.provider,
          country: item.country,
          continent: item.continent,
          degrees: item.degrees,
          fundingType: item.fundingType,
          fundingEstimate,
          coverage: item.coverage,
          universityRanking:
            rankingProfiles[item.provider] ??
            "Nhiều trường/không áp dụng một thứ hạng duy nhất",
          livingCost:
            destinationProfiles[item.country]?.livingCost ??
            "Cần xác minh theo thành phố",
          destinationReview:
            destinationProfiles[item.country]?.review ??
            "Agent sẽ bổ sung khi nguồn điểm đến được xác minh.",
          officialUrl: item.officialUrl,
          matchScore,
          reasons: [...new Set(reasons)].slice(0, 4),
          gaps: [...new Set(gaps)].slice(0, 3),
          dataStatus: "Nguồn chính thức · cần xác minh hạn nộp hiện hành",
        };
      })
      .sort(
        (a, b) => b.matchScore - a.matchScore || a.name.localeCompare(b.name),
      )
      .slice(0, 10)
      .map((item, index) => ({ ...item, rank: index + 1 }));

    return {
      profile: { ...profile, normalizedGpa },
      recommendations: ranked,
      methodology:
        "Ước tính dựa trên độ phù hợp điều kiện, học thuật, ngoại ngữ, kinh nghiệm, nghiên cứu, ngoại khóa, mức tài trợ và khu vực. Đây không phải xác suất trúng tuyển thống kê.",
      disclaimer:
        "Kết quả dùng danh mục MVP và mô hình chấm điểm định hướng. Hãy xác minh điều kiện, ranking và hạn nộp trên nguồn chính thức trước khi ứng tuyển.",
      generatedAt: new Date().toISOString(),
    };
  },
});
