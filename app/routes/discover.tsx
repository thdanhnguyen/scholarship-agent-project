import { useActionMutation } from "@agent-native/core/client/hooks";
import { useMemo, useState } from "react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Profile = {
  degree: "undergraduate" | "masters" | "phd";
  field: string;
  specialization: string;
  nationality: string;
  continent: "any" | "europe" | "north-america" | "asia" | "oceania";
  preferredCountries: string;
  intakeYear: number;
  gpa: number;
  gpaScale: "4" | "10" | "100";
  classRankPercent: number;
  languageTest: "none" | "ielts" | "toefl" | "duolingo" | "other";
  languageScore: string;
  workExperienceYears: number;
  researchExperienceYears: number;
  publications: number;
  publicationLevel: "none" | "conference" | "journal" | "indexed" | "top-tier";
  awards: number;
  extracurricularLevel:
    | "none"
    | "participant"
    | "leader"
    | "national"
    | "international";
  leadershipYears: number;
  volunteerHours: number;
  recommendationLetters: number;
  statementReadiness: number;
  funding: "full" | "partial" | "any";
  annualBudget: number;
  primaryPriority:
    | "cost"
    | "career"
    | "quality-of-life"
    | "ranking"
    | "research";
};

const steps = [
  "Mục tiêu",
  "Điểm đến",
  "Học thuật",
  "Ngoại ngữ",
  "Kinh nghiệm & nghiên cứu",
  "Ngoại khóa",
  "Tài chính",
] as const;

const initialProfile: Profile = {
  degree: "masters",
  field: "Khoa học dữ liệu",
  specialization: "",
  nationality: "Việt Nam",
  continent: "any",
  preferredCountries: "",
  intakeYear: 2027,
  gpa: 8,
  gpaScale: "10",
  classRankPercent: 0,
  languageTest: "ielts",
  languageScore: "6.5",
  workExperienceYears: 0,
  researchExperienceYears: 0,
  publications: 0,
  publicationLevel: "none",
  awards: 0,
  extracurricularLevel: "participant",
  leadershipYears: 0,
  volunteerHours: 0,
  recommendationLetters: 2,
  statementReadiness: 3,
  funding: "full",
  annualBudget: 10000,
  primaryPriority: "cost",
};

const degreeLabels: Record<Profile["degree"], string> = {
  undergraduate: "Đại học",
  masters: "Thạc sĩ",
  phd: "Tiến sĩ",
};

export function meta() {
  return [
    { title: "Đánh giá hồ sơ — Scholarship Compass" },
    {
      name: "description",
      content:
        "Phân tích chi tiết khả năng nhận học bổng và Top 10 trường phù hợp.",
    },
  ];
}

function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  hint,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}) {
  return (
    <div className="survey-field">
      <Label>{label}</Label>
      <Input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}

export default function DiscoverRoute() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const recommendation = useActionMutation("recommend-scholarships");
  const results = recommendation.data?.recommendations ?? [];

  const canContinue = useMemo(() => {
    if (step === 0) return profile.field.trim().length >= 2;
    if (step === 1) return profile.nationality.trim().length >= 2;
    if (step === 2)
      return profile.gpa >= 0 && profile.gpa <= Number(profile.gpaScale);
    if (step === 3)
      return (
        profile.languageTest === "none" ||
        profile.languageScore.trim().length > 0
      );
    return true;
  }, [profile, step]);

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function restartSurvey() {
    recommendation.reset();
    setStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (results.length > 0) {
    return (
      <div className="assessment-site">
        <header className="public-nav assessment-nav">
          <Link to="/" className="scholar-brand">
            <span className="scholar-brand-mark">S</span>
            <span>Scholarship Compass</span>
          </Link>
          <Button variant="outline" onClick={restartSurvey}>
            Đánh giá lại
          </Button>
        </header>
        <main className="assessment-results">
          <section className="assessment-result-intro">
            <p className="scholar-kicker">Báo cáo hồ sơ cá nhân</p>
            <h1>Top 10 cơ hội dành cho {profile.field}</h1>
            <p>{recommendation.data?.methodology}</p>
            <div className="profile-facts">
              <span>{degreeLabels[profile.degree]}</span>
              <span>
                GPA {profile.gpa}/{profile.gpaScale}
              </span>
              <span>{profile.nationality}</span>
              <span>Kỳ {profile.intakeYear}</span>
            </div>
          </section>
          <section
            className="recommendation-grid"
            aria-label="Top 10 học bổng và trường phù hợp"
          >
            {results.map((item) => (
              <article className="recommendation-card" key={item.id}>
                <div className="recommendation-rank">#{item.rank}</div>
                <div className="recommendation-card-main">
                  <div className="recommendation-heading">
                    <div>
                      <p>
                        {item.provider} · {item.country}
                      </p>
                      <h2>{item.name}</h2>
                    </div>
                    <div className="probability-score">
                      <strong>{item.matchScore}%</strong>
                      <span>độ phù hợp ước tính</span>
                    </div>
                  </div>
                  <div className="recommendation-metrics">
                    <div>
                      <span>Mức tài trợ</span>
                      <strong>{item.fundingEstimate}</strong>
                    </div>
                    <div>
                      <span>Ranking</span>
                      <strong>{item.universityRanking}</strong>
                    </div>
                    <div>
                      <span>Chi phí sống</span>
                      <strong>{item.livingCost}</strong>
                    </div>
                  </div>
                  <p className="coverage-line">
                    <strong>Quyền lợi:</strong> {item.coverage}
                  </p>
                  <div className="evidence-columns">
                    <div>
                      <h3>Lợi thế hồ sơ</h3>
                      <ul>
                        {item.reasons.map((reason) => (
                          <li key={reason}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3>Cần cải thiện</h3>
                      <ul>
                        {item.gaps.length ? (
                          item.gaps.map((gap) => <li key={gap}>{gap}</li>)
                        ) : (
                          <li>
                            Chưa phát hiện khoảng trống lớn trong dữ liệu đã
                            nhập
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                  <p className="destination-note">{item.destinationReview}</p>
                  <div className="recommendation-footer">
                    <span>{item.dataStatus}</span>
                    <a href={item.officialUrl} target="_blank" rel="noreferrer">
                      Nguồn chính thức
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </section>
          <p className="result-disclaimer">{recommendation.data?.disclaimer}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="assessment-site">
      <header className="public-nav assessment-nav">
        <Link to="/" className="scholar-brand">
          <span className="scholar-brand-mark">S</span>
          <span>Scholarship Compass</span>
        </Link>
        <span className="assessment-step-label">
          Bước {step + 1}/{steps.length}
        </span>
      </header>
      <main className="assessment-shell">
        <aside className="assessment-progress">
          <p className="scholar-kicker">Đánh giá hồ sơ</p>
          <h1>Càng chi tiết, kết quả càng hữu ích.</h1>
          <p>
            Không có câu trả lời hoàn hảo. Những mục chưa có sẽ trở thành gợi ý
            cải thiện.
          </p>
          <ol>
            {steps.map((label, index) => (
              <li
                key={label}
                className={
                  index === step ? "active" : index < step ? "done" : ""
                }
              >
                <span>{index + 1}</span>
                {label}
              </li>
            ))}
          </ol>
        </aside>

        <section className="assessment-form-card">
          {step === 0 ? (
            <>
              <p className="scholar-kicker">Mục tiêu học tập</p>
              <h2>Bạn muốn đi đến đâu trong hành trình học thuật?</h2>
              <div className="option-row" role="group" aria-label="Bậc học">
                {Object.entries(degreeLabels).map(([value, label]) => (
                  <button
                    type="button"
                    key={value}
                    className={profile.degree === value ? "selected" : ""}
                    onClick={() => update("degree", value as Profile["degree"])}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="survey-field">
                <Label htmlFor="field">Ngành học mong muốn</Label>
                <Input
                  id="field"
                  value={profile.field}
                  onChange={(e) => update("field", e.target.value)}
                  placeholder="Ví dụ: Luật thương mại quốc tế, Kiến trúc, AI..."
                />
                <small>
                  Nhập tự do, không giới hạn trong danh sách ngành cố định.
                </small>
              </div>
              <div className="survey-field">
                <Label htmlFor="specialization">
                  Chuyên ngành/hướng nghiên cứu cụ thể
                </Label>
                <Input
                  id="specialization"
                  value={profile.specialization}
                  onChange={(e) => update("specialization", e.target.value)}
                  placeholder="Ví dụ: Computer Vision trong chẩn đoán hình ảnh"
                />
              </div>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <p className="scholar-kicker">Điểm đến</p>
              <h2>Quốc gia nào phù hợp với kế hoạch của bạn?</h2>
              <div className="survey-grid">
                <div className="survey-field">
                  <Label>Châu lục ưu tiên</Label>
                  <select
                    value={profile.continent}
                    onChange={(e) =>
                      update(
                        "continent",
                        e.target.value as Profile["continent"],
                      )
                    }
                  >
                    <option value="any">Mở cho mọi châu lục</option>
                    <option value="europe">Châu Âu</option>
                    <option value="north-america">Bắc Mỹ</option>
                    <option value="asia">Châu Á</option>
                    <option value="oceania">Châu Đại Dương</option>
                  </select>
                </div>
                <div className="survey-field">
                  <Label>Quốc tịch</Label>
                  <Input
                    value={profile.nationality}
                    onChange={(e) => update("nationality", e.target.value)}
                  />
                </div>
              </div>
              <div className="survey-field">
                <Label>Quốc gia cụ thể đang quan tâm</Label>
                <Input
                  value={profile.preferredCountries}
                  onChange={(e) => update("preferredCountries", e.target.value)}
                  placeholder="Đức, Hà Lan, Anh..."
                />
              </div>
              <NumberField
                label="Năm nhập học dự kiến"
                value={profile.intakeYear}
                min={2026}
                max={2032}
                onChange={(value) => update("intakeYear", value)}
              />
            </>
          ) : null}

          {step === 2 ? (
            <>
              <p className="scholar-kicker">Nền tảng học thuật</p>
              <h2>Cho chúng tôi biết vị trí học thuật hiện tại.</h2>
              <div className="survey-grid">
                <NumberField
                  label="GPA hiện tại"
                  value={profile.gpa}
                  max={Number(profile.gpaScale)}
                  step={0.01}
                  onChange={(value) => update("gpa", value)}
                />
                <div className="survey-field">
                  <Label>Thang GPA</Label>
                  <select
                    value={profile.gpaScale}
                    onChange={(e) =>
                      update("gpaScale", e.target.value as Profile["gpaScale"])
                    }
                  >
                    <option value="4">Thang 4</option>
                    <option value="10">Thang 10</option>
                    <option value="100">Thang 100</option>
                  </select>
                </div>
              </div>
              <NumberField
                label="Bạn thuộc top bao nhiêu % của lớp?"
                value={profile.classRankPercent}
                max={100}
                onChange={(value) => update("classRankPercent", value)}
                hint="Nhập 0 nếu trường không cung cấp xếp hạng."
              />
            </>
          ) : null}

          {step === 3 ? (
            <>
              <p className="scholar-kicker">Ngoại ngữ</p>
              <h2>Chứng chỉ gần nhất của bạn là gì?</h2>
              <div className="survey-grid">
                <div className="survey-field">
                  <Label>Loại chứng chỉ</Label>
                  <select
                    value={profile.languageTest}
                    onChange={(e) =>
                      update(
                        "languageTest",
                        e.target.value as Profile["languageTest"],
                      )
                    }
                  >
                    <option value="none">Chưa có chứng chỉ</option>
                    <option value="ielts">IELTS</option>
                    <option value="toefl">TOEFL iBT</option>
                    <option value="duolingo">Duolingo English Test</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div className="survey-field">
                  <Label>Điểm số</Label>
                  <Input
                    value={profile.languageScore}
                    disabled={profile.languageTest === "none"}
                    onChange={(e) => update("languageScore", e.target.value)}
                    placeholder="Ví dụ: 7.0"
                  />
                </div>
              </div>
            </>
          ) : null}

          {step === 4 ? (
            <>
              <p className="scholar-kicker">Kinh nghiệm & nghiên cứu</p>
              <h2>Những bằng chứng chuyên môn nào đang có trong hồ sơ?</h2>
              <div className="survey-grid">
                <NumberField
                  label="Số năm kinh nghiệm làm việc"
                  value={profile.workExperienceYears}
                  max={40}
                  step={0.5}
                  onChange={(value) => update("workExperienceYears", value)}
                />
                <NumberField
                  label="Số năm kinh nghiệm nghiên cứu"
                  value={profile.researchExperienceYears}
                  max={20}
                  step={0.5}
                  onChange={(value) => update("researchExperienceYears", value)}
                />
              </div>
              <div className="survey-grid">
                <NumberField
                  label="Số bài báo/công bố"
                  value={profile.publications}
                  max={100}
                  onChange={(value) => update("publications", value)}
                />
                <div className="survey-field">
                  <Label>Cấp độ công bố cao nhất</Label>
                  <select
                    value={profile.publicationLevel}
                    onChange={(e) =>
                      update(
                        "publicationLevel",
                        e.target.value as Profile["publicationLevel"],
                      )
                    }
                  >
                    <option value="none">Chưa có</option>
                    <option value="conference">Hội nghị</option>
                    <option value="journal">Tạp chí</option>
                    <option value="indexed">Scopus/ISI</option>
                    <option value="top-tier">Top-tier/Q1-Q2</option>
                  </select>
                </div>
              </div>
              <NumberField
                label="Số giải thưởng học thuật/chuyên môn"
                value={profile.awards}
                max={100}
                onChange={(value) => update("awards", value)}
              />
            </>
          ) : null}

          {step === 5 ? (
            <>
              <p className="scholar-kicker">Ngoại khóa & lãnh đạo</p>
              <h2>Hồ sơ của bạn tạo ảnh hưởng ngoài lớp học như thế nào?</h2>
              <div className="survey-field">
                <Label>Mức độ hoạt động ngoại khóa nổi bật nhất</Label>
                <select
                  value={profile.extracurricularLevel}
                  onChange={(e) =>
                    update(
                      "extracurricularLevel",
                      e.target.value as Profile["extracurricularLevel"],
                    )
                  }
                >
                  <option value="none">Chưa có hoạt động đáng kể</option>
                  <option value="participant">
                    Thành viên/tham gia thường xuyên
                  </option>
                  <option value="leader">Trưởng nhóm/ban tổ chức</option>
                  <option value="national">Thành tích cấp quốc gia</option>
                  <option value="international">Thành tích cấp quốc tế</option>
                </select>
              </div>
              <div className="survey-grid">
                <NumberField
                  label="Số năm giữ vai trò lãnh đạo"
                  value={profile.leadershipYears}
                  max={20}
                  step={0.5}
                  onChange={(value) => update("leadershipYears", value)}
                />
                <NumberField
                  label="Tổng giờ tình nguyện/cộng đồng"
                  value={profile.volunteerHours}
                  max={10000}
                  onChange={(value) => update("volunteerHours", value)}
                />
              </div>
              <div className="survey-grid">
                <NumberField
                  label="Số thư giới thiệu có thể chuẩn bị"
                  value={profile.recommendationLetters}
                  max={5}
                  onChange={(value) => update("recommendationLetters", value)}
                />
                <NumberField
                  label="Mức sẵn sàng của bài luận (1–5)"
                  value={profile.statementReadiness}
                  min={1}
                  max={5}
                  onChange={(value) => update("statementReadiness", value)}
                />
              </div>
            </>
          ) : null}

          {step === 6 ? (
            <>
              <p className="scholar-kicker">Tài chính & ưu tiên</p>
              <h2>
                Một cơ hội phù hợp phải giải quyết điều gì quan trọng nhất?
              </h2>
              <div className="option-row" role="group" aria-label="Mức tài trợ">
                <button
                  type="button"
                  className={profile.funding === "full" ? "selected" : ""}
                  onClick={() => update("funding", "full")}
                >
                  Toàn phần
                </button>
                <button
                  type="button"
                  className={profile.funding === "partial" ? "selected" : ""}
                  onClick={() => update("funding", "partial")}
                >
                  Một phần
                </button>
                <button
                  type="button"
                  className={profile.funding === "any" ? "selected" : ""}
                  onClick={() => update("funding", "any")}
                >
                  Linh hoạt
                </button>
              </div>
              <NumberField
                label="Ngân sách tự chi trả tối đa mỗi năm (USD)"
                value={profile.annualBudget}
                max={200000}
                step={500}
                onChange={(value) => update("annualBudget", value)}
              />
              <div className="survey-field">
                <Label>Ưu tiên quan trọng nhất</Label>
                <select
                  value={profile.primaryPriority}
                  onChange={(e) =>
                    update(
                      "primaryPriority",
                      e.target.value as Profile["primaryPriority"],
                    )
                  }
                >
                  <option value="cost">Chi phí sống thấp</option>
                  <option value="career">Cơ hội việc làm</option>
                  <option value="quality-of-life">Chất lượng sống</option>
                  <option value="ranking">Ranking của trường</option>
                  <option value="research">Môi trường nghiên cứu</option>
                </select>
              </div>
            </>
          ) : null}

          {recommendation.error ? (
            <p className="survey-error">
              Không thể phân tích hồ sơ. Vui lòng kiểm tra dữ liệu và thử lại.
            </p>
          ) : null}
          <div className="assessment-actions">
            {step > 0 ? (
              <Button
                variant="outline"
                onClick={() => setStep((current) => current - 1)}
              >
                Quay lại
              </Button>
            ) : (
              <Link to="/" className="public-secondary-link">
                Về trang chủ
              </Link>
            )}
            {step < steps.length - 1 ? (
              <Button
                disabled={!canContinue}
                onClick={() => setStep((current) => current + 1)}
              >
                Tiếp tục
              </Button>
            ) : (
              <Button
                disabled={recommendation.isPending}
                onClick={() => recommendation.mutate(profile)}
              >
                {recommendation.isPending
                  ? "Đang phân tích hồ sơ..."
                  : "Nhận báo cáo Top 10"}
              </Button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
