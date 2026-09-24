import { useActionMutation } from "@agent-native/core/client/hooks";
import { useMemo, useState } from "react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const degreeOptions = [
  { value: "undergraduate", label: "Đại học" },
  { value: "masters", label: "Thạc sĩ" },
  { value: "phd", label: "Tiến sĩ" },
] as const;

const fundingOptions = [
  { value: "full", label: "Cần học bổng toàn phần" },
  { value: "partial", label: "Có thể nhận học bổng một phần" },
  { value: "any", label: "Linh hoạt theo cơ hội" },
] as const;

const fieldLabels: Record<string, string> = {
  business: "Kinh doanh & Quản trị",
  "computer-science": "Khoa học máy tính",
  engineering: "Kỹ thuật",
  health: "Sức khỏe & Y sinh",
  "social-sciences": "Khoa học xã hội",
  arts: "Nghệ thuật & Nhân văn",
};

const continentLabels: Record<string, string> = {
  any: "Mở cho mọi châu lục",
  europe: "Châu Âu",
  "north-america": "Bắc Mỹ",
  asia: "Châu Á",
  oceania: "Châu Đại Dương",
};

const degreeLabels: Record<string, string> = {
  undergraduate: "Đại học",
  masters: "Thạc sĩ",
  phd: "Tiến sĩ",
};

const steps = ["Hướng học", "Điểm đến", "Năng lực", "Tài chính"] as const;

type Profile = {
  degree: "undergraduate" | "masters" | "phd";
  field:
    | "business"
    | "computer-science"
    | "engineering"
    | "health"
    | "social-sciences"
    | "arts";
  continent: "any" | "europe" | "north-america" | "asia" | "oceania";
  nationality: string;
  intakeYear: number;
  gpa: number;
  language: "none" | "ielts-5-5" | "ielts-6-0" | "ielts-6-5" | "ielts-7-plus";
  funding: "full" | "partial" | "any";
  annualBudget: number;
};

const initialProfile: Profile = {
  degree: "masters",
  field: "computer-science",
  continent: "any",
  nationality: "Việt Nam",
  intakeYear: 2027,
  gpa: 8,
  language: "ielts-6-5",
  funding: "full",
  annualBudget: 10000,
};

export function meta() {
  return [
    { title: "Khảo sát hồ sơ — Scholarship Compass" },
    {
      name: "description",
      content: "Hoàn thành khảo sát để nhận Top 10 học bổng và trường phù hợp.",
    },
  ];
}

export default function DiscoverRoute() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const recommendation = useActionMutation("recommend-scholarships");
  const results = recommendation.data?.recommendations ?? [];

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(profile.degree && profile.field);
    if (step === 1) return profile.nationality.trim().length >= 2;
    if (step === 2) return profile.gpa >= 0 && profile.gpa <= 10;
    return profile.annualBudget >= 0;
  }, [profile, step]);

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function nextStep() {
    if (!canContinue) return;
    setStep((current) => Math.min(steps.length - 1, current + 1));
  }

  function submitSurvey() {
    if (!canContinue) return;
    recommendation.mutate(profile);
  }

  function restartSurvey() {
    recommendation.reset();
    setStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (results.length > 0) {
    return (
      <div className="scholar-page">
        <header className="scholar-topbar">
          <Link
            to="/discover"
            className="scholar-brand"
            onClick={restartSurvey}
          >
            <span className="scholar-brand-mark">S</span>
            <span>Scholarship Compass</span>
          </Link>
          <Link to="/home" className="scholar-text-link">
            Tư vấn thêm
          </Link>
        </header>

        <div className="scholar-results-layout">
          <aside className="scholar-profile-summary">
            <p className="scholar-kicker">Hồ sơ đã phân tích</p>
            <h1>Top 10 dành cho bạn</h1>
            <dl>
              <div>
                <dt>Bậc học</dt>
                <dd>{degreeLabels[profile.degree]}</dd>
              </div>
              <div>
                <dt>Ngành</dt>
                <dd>{fieldLabels[profile.field]}</dd>
              </div>
              <div>
                <dt>Khu vực</dt>
                <dd>{continentLabels[profile.continent]}</dd>
              </div>
              <div>
                <dt>GPA</dt>
                <dd>{profile.gpa.toFixed(1)} / 10</dd>
              </div>
            </dl>
            <Button
              variant="outline"
              className="w-full"
              onClick={restartSurvey}
            >
              Làm lại khảo sát
            </Button>
            <p className="scholar-disclaimer">
              {recommendation.data?.disclaimer}
            </p>
          </aside>

          <section
            className="scholar-result-list"
            aria-label="Top 10 học bổng phù hợp"
          >
            {results.map((item) => (
              <article className="scholar-result-row" key={item.id}>
                <div className="scholar-rank" aria-label={`Hạng ${item.rank}`}>
                  {String(item.rank).padStart(2, "0")}
                </div>
                <div className="scholar-result-main">
                  <div className="scholar-result-heading">
                    <div>
                      <h2>{item.name}</h2>
                      <p>
                        {item.provider} · {item.country}
                      </p>
                    </div>
                    <strong>{item.matchScore}%</strong>
                  </div>
                  <div className="scholar-result-details">
                    <span>
                      {item.fundingType === "full" ? "Toàn phần" : "Một phần"}
                    </span>
                    <span>{item.coverage}</span>
                  </div>
                  <ul>
                    {item.reasons.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                  <a href={item.officialUrl} target="_blank" rel="noreferrer">
                    Xem nguồn chính thức
                  </a>
                </div>
              </article>
            ))}
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="scholar-page scholar-survey-page">
      <header className="scholar-topbar">
        <Link to="/discover" className="scholar-brand">
          <span className="scholar-brand-mark">S</span>
          <span>Scholarship Compass</span>
        </Link>
        <span className="scholar-step-count">
          Bước {step + 1} / {steps.length}
        </span>
      </header>

      <main className="scholar-survey-shell">
        <div
          className="scholar-progress"
          aria-label={`Tiến độ ${step + 1} trên ${steps.length}`}
        >
          {steps.map((label, index) => (
            <div key={label} className={index <= step ? "is-active" : ""}>
              <span></span>
              <small>{label}</small>
            </div>
          ))}
        </div>

        <Card className="scholar-survey-card">
          <CardHeader>
            <CardTitle>{stepTitle(step)}</CardTitle>
          </CardHeader>
          <CardContent>
            {step === 0 ? (
              <div className="scholar-form-stack">
                <fieldset>
                  <legend>Bậc học bạn muốn theo đuổi</legend>
                  <div className="scholar-choice-grid scholar-choice-grid-3">
                    {degreeOptions.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={
                          profile.degree === option.value
                            ? "default"
                            : "outline"
                        }
                        onClick={() => update("degree", option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </fieldset>
                <div className="scholar-field">
                  <Label htmlFor="field">Ngành học chính</Label>
                  <select
                    id="field"
                    className="scholar-select"
                    value={profile.field}
                    onChange={(event) =>
                      update("field", event.target.value as Profile["field"])
                    }
                  >
                    {Object.entries(fieldLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="scholar-form-stack">
                <div className="scholar-field">
                  <Label htmlFor="continent">Châu lục ưu tiên</Label>
                  <select
                    id="continent"
                    className="scholar-select"
                    value={profile.continent}
                    onChange={(event) =>
                      update(
                        "continent",
                        event.target.value as Profile["continent"],
                      )
                    }
                  >
                    {Object.entries(continentLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="scholar-two-columns">
                  <div className="scholar-field">
                    <Label htmlFor="nationality">Quốc tịch</Label>
                    <Input
                      id="nationality"
                      value={profile.nationality}
                      onChange={(event) =>
                        update("nationality", event.target.value)
                      }
                      aria-invalid={profile.nationality.trim().length < 2}
                    />
                  </div>
                  <div className="scholar-field">
                    <Label htmlFor="intake">Năm nhập học dự kiến</Label>
                    <select
                      id="intake"
                      className="scholar-select"
                      value={profile.intakeYear}
                      onChange={(event) =>
                        update("intakeYear", Number(event.target.value))
                      }
                    >
                      {[2026, 2027, 2028, 2029, 2030].map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="scholar-form-stack">
                <div className="scholar-field">
                  <Label htmlFor="gpa">GPA hiện tại (thang 10)</Label>
                  <Input
                    id="gpa"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={profile.gpa}
                    onChange={(event) =>
                      update("gpa", Number(event.target.value))
                    }
                    aria-invalid={profile.gpa < 0 || profile.gpa > 10}
                  />
                </div>
                <div className="scholar-field">
                  <Label htmlFor="language">Trình độ tiếng Anh gần nhất</Label>
                  <select
                    id="language"
                    className="scholar-select"
                    value={profile.language}
                    onChange={(event) =>
                      update(
                        "language",
                        event.target.value as Profile["language"],
                      )
                    }
                  >
                    <option value="none">Chưa có chứng chỉ</option>
                    <option value="ielts-5-5">Tương đương IELTS 5.5</option>
                    <option value="ielts-6-0">Tương đương IELTS 6.0</option>
                    <option value="ielts-6-5">Tương đương IELTS 6.5</option>
                    <option value="ielts-7-plus">Tương đương IELTS 7.0+</option>
                  </select>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="scholar-form-stack">
                <fieldset>
                  <legend>Mức hỗ trợ mong muốn</legend>
                  <div className="scholar-choice-grid">
                    {fundingOptions.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={
                          profile.funding === option.value
                            ? "default"
                            : "outline"
                        }
                        onClick={() => update("funding", option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </fieldset>
                <div className="scholar-field">
                  <Label htmlFor="budget">
                    Ngân sách tự chi trả tối đa mỗi năm (USD)
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    min="0"
                    max="100000"
                    step="500"
                    value={profile.annualBudget}
                    onChange={(event) =>
                      update("annualBudget", Number(event.target.value))
                    }
                    aria-invalid={profile.annualBudget < 0}
                  />
                </div>
              </div>
            ) : null}

            {recommendation.error ? (
              <p className="scholar-error" role="alert">
                Chưa thể tạo danh sách. Vui lòng kiểm tra thông tin và thử lại.
              </p>
            ) : null}

            <div className="scholar-form-actions">
              {step > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep((current) => current - 1)}
                >
                  Quay lại
                </Button>
              ) : (
                <span />
              )}
              {step < steps.length - 1 ? (
                <Button
                  type="button"
                  disabled={!canContinue}
                  onClick={nextStep}
                >
                  Tiếp tục
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={!canContinue || recommendation.isPending}
                  onClick={submitSurvey}
                >
                  {recommendation.isPending
                    ? "Đang xếp hạng…"
                    : "Xem Top 10 phù hợp"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function stepTitle(step: number) {
  if (step === 0) return "Bạn đang hướng đến chương trình nào?";
  if (step === 1) return "Bạn muốn học ở đâu và khi nào?";
  if (step === 2) return "Hồ sơ học tập hiện tại của bạn";
  return "Mức hỗ trợ nào phù hợp với bạn?";
}
