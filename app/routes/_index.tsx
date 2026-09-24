import {
  IconArrowRight,
  IconArrowUpRight,
  IconChartBar,
  IconCheck,
  IconClipboardCheck,
  IconGlobe,
  IconSearch,
  IconSchool,
  IconShieldCheck,
  IconWallet,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

type DegreeFilter = "all" | "undergraduate" | "masters" | "phd";

const degreeFilters: Array<{ value: DegreeFilter; label: string }> = [
  { value: "all", label: "Tất cả" },
  { value: "undergraduate", label: "Đại học" },
  { value: "masters", label: "Thạc sĩ" },
  { value: "phd", label: "Tiến sĩ" },
];

const featuredScholarships = [
  {
    name: "Erasmus Mundus Joint Masters",
    shortName: "EMJM",
    provider: "Liên minh Châu Âu",
    destination: "Nhiều quốc gia Châu Âu",
    region: "Châu Âu",
    degrees: ["masters"] as DegreeFilter[],
    degreeLabel: "Thạc sĩ",
    funding: "Toàn phần",
    coverage: "Học phí, sinh hoạt phí và hỗ trợ đi lại",
    url: "https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters",
    tone: "blue",
  },
  {
    name: "Chevening Scholarships",
    shortName: "CH",
    provider: "Chính phủ Vương quốc Anh",
    destination: "Vương quốc Anh",
    region: "Châu Âu",
    degrees: ["masters"] as DegreeFilter[],
    degreeLabel: "Thạc sĩ",
    funding: "Toàn phần",
    coverage: "Học phí, sinh hoạt phí và vé máy bay",
    url: "https://www.chevening.org/scholarships/",
    tone: "navy",
  },
  {
    name: "MEXT Scholarship",
    shortName: "MEXT",
    provider: "Chính phủ Nhật Bản",
    destination: "Nhật Bản",
    region: "Châu Á",
    degrees: ["undergraduate", "masters", "phd"] as DegreeFilter[],
    degreeLabel: "Đại học · Thạc sĩ · Tiến sĩ",
    funding: "Toàn phần",
    coverage: "Học phí, trợ cấp hàng tháng và vé máy bay",
    url: "https://www.studyinjapan.go.jp/en/planning/scholarships/mext-scholarships/",
    tone: "red",
  },
  {
    name: "Global Korea Scholarship",
    shortName: "GKS",
    provider: "Chính phủ Hàn Quốc",
    destination: "Hàn Quốc",
    region: "Châu Á",
    degrees: ["undergraduate", "masters", "phd"] as DegreeFilter[],
    degreeLabel: "Đại học · Sau đại học",
    funding: "Toàn phần",
    coverage: "Học phí, sinh hoạt phí, ngôn ngữ và đi lại",
    url: "https://www.studyinkorea.go.kr/",
    tone: "sky",
  },
  {
    name: "Fulbright Foreign Student Program",
    shortName: "FB",
    provider: "U.S. Department of State",
    destination: "Hoa Kỳ",
    region: "Bắc Mỹ",
    degrees: ["masters", "phd"] as DegreeFilter[],
    degreeLabel: "Thạc sĩ · Tiến sĩ",
    funding: "Toàn phần",
    coverage: "Học phí, sinh hoạt phí và bảo hiểm",
    url: "https://foreign.fulbrightonline.org/",
    tone: "indigo",
  },
  {
    name: "Australia Awards Scholarships",
    shortName: "AAS",
    provider: "Chính phủ Úc",
    destination: "Úc",
    region: "Châu Đại Dương",
    degrees: ["undergraduate", "masters", "phd"] as DegreeFilter[],
    degreeLabel: "Đại học · Sau đại học",
    funding: "Toàn phần",
    coverage: "Học phí, vé máy bay, sinh hoạt phí và bảo hiểm",
    url: "https://www.dfat.gov.au/people-to-people/australia-awards",
    tone: "cobalt",
  },
];

const profileSignals = [
  "Học thuật và GPA",
  "Ngoại ngữ",
  "Nghiên cứu và công bố",
  "Ngoại khóa và lãnh đạo",
  "Ngân sách và điểm đến",
];

export function meta() {
  return [
    { title: "Scholarship Compass — Tìm học bổng phù hợp với hồ sơ" },
    {
      name: "description",
      content:
        "Khám phá học bổng nổi bật và đánh giá chi tiết mức độ phù hợp theo hồ sơ cá nhân, không cần đăng ký.",
    },
  ];
}

export default function MarketingHomeRoute() {
  const [degreeFilter, setDegreeFilter] = useState<DegreeFilter>("all");
  const [query, setQuery] = useState("");

  const visibleScholarships = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("vi");
    return featuredScholarships.filter((item) => {
      const matchesDegree =
        degreeFilter === "all" || item.degrees.includes(degreeFilter);
      const searchable =
        `${item.name} ${item.provider} ${item.destination} ${item.region}`.toLocaleLowerCase(
          "vi",
        );
      return (
        matchesDegree &&
        (!normalizedQuery || searchable.includes(normalizedQuery))
      );
    });
  }, [degreeFilter, query]);

  return (
    <div className="public-site">
      <a className="skip-link" href="#main-content">
        Bỏ qua điều hướng
      </a>
      <header className="public-nav-wrap">
        <div className="public-nav">
          <Link
            to="/"
            className="scholar-brand"
            aria-label="Scholarship Compass"
          >
            <span className="scholar-brand-mark" aria-hidden="true">
              S
            </span>
            <span className="scholar-brand-copy">
              <strong>Scholarship Compass</strong>
              <small>Find your best-fit scholarship</small>
            </span>
          </Link>
          <nav aria-label="Điều hướng chính">
            <a href="#scholarships">Học bổng</a>
            <a href="#method">Cách đánh giá</a>
            <a href="#about">Về nền tảng</a>
            <Link to="/discover" className="public-nav-cta">
              Làm khảo sát
              <IconArrowRight size={17} stroke={2} aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className="public-hero">
          <div className="public-hero-copy">
            <div className="hero-eyebrow">
              <IconShieldCheck size={17} stroke={2} aria-hidden="true" />
              Không cần đăng ký · Kết quả có giải thích
            </div>
            <h1>
              Đừng tìm học bổng <span>một cách mơ hồ.</span>
            </h1>
            <p className="hero-lead">
              Hiểu hồ sơ của bạn đang ở đâu, phù hợp với trường nào và cần cải
              thiện điều gì trước khi nộp đơn.
            </p>
            <div className="public-hero-actions">
              <Link to="/discover" className="public-primary-button">
                Đánh giá hồ sơ miễn phí
                <IconArrowRight size={19} stroke={2.2} aria-hidden="true" />
              </Link>
              <a href="#scholarships" className="public-secondary-link">
                Khám phá học bổng
              </a>
            </div>
            <div className="hero-assurance" aria-label="Cam kết trải nghiệm">
              <span>
                <IconCheck size={16} aria-hidden="true" /> Khoảng 5–8 phút
              </span>
              <span>
                <IconCheck size={16} aria-hidden="true" /> Không yêu cầu tài
                khoản
              </span>
              <span>
                <IconCheck size={16} aria-hidden="true" /> Dẫn nguồn chính thức
              </span>
            </div>
          </div>

          <div className="hero-report" aria-label="Ví dụ báo cáo đánh giá">
            <div className="hero-report-topline">
              <span>Báo cáo mẫu</span>
              <span className="report-status">Hồ sơ mạnh</span>
            </div>
            <div className="hero-report-profile">
              <div className="report-avatar" aria-hidden="true">
                DS
              </div>
              <div>
                <strong>Data Science · Thạc sĩ</strong>
                <span>GPA 8.4/10 · IELTS 7.0</span>
              </div>
            </div>
            <div className="report-score-row">
              <div className="report-score-ring">
                <strong>82</strong>
                <span>/100</span>
              </div>
              <div>
                <strong>Mức phù hợp cao</strong>
                <p>So với nhóm điều kiện của 24 chương trình</p>
              </div>
            </div>
            <div className="report-bars" aria-label="Các nhóm tiêu chí mẫu">
              {[
                ["Học thuật", "88%"],
                ["Ngoại ngữ", "81%"],
                ["Nghiên cứu", "72%"],
              ].map(([label, score]) => (
                <div key={label}>
                  <span>{label}</span>
                  <div>
                    <i style={{ width: score }} />
                  </div>
                  <strong>{score}</strong>
                </div>
              ))}
            </div>
            <div className="report-footer">
              <span>Top gợi ý</span>
              <strong>Erasmus Mundus · Chevening · MEXT</strong>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Giá trị nền tảng">
          <div>
            <strong>10+</strong>
            <span>nhóm dữ liệu hồ sơ</span>
          </div>
          <div>
            <strong>Top 10</strong>
            <span>cơ hội được xếp hạng</span>
          </div>
          <div>
            <strong>3 bậc</strong>
            <span>Đại học đến Tiến sĩ</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>link nguồn có thể kiểm tra</span>
          </div>
        </section>

        <section className="featured-section" id="scholarships">
          <div className="public-section-heading">
            <div>
              <p className="scholar-kicker">Danh mục nổi bật</p>
              <h2>Bắt đầu từ những học bổng uy tín</h2>
            </div>
            <p>
              Duyệt thông tin tổng quan trước khi khảo sát. Điều kiện và thời
              hạn cần được kiểm tra lại trên trang chính thức.
            </p>
          </div>

          <div className="scholarship-toolbar">
            <div className="scholarship-search">
              <IconSearch size={18} aria-hidden="true" />
              <label className="sr-only" htmlFor="scholarship-search">
                Tìm học bổng
              </label>
              <input
                id="scholarship-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm theo tên, quốc gia hoặc khu vực..."
              />
            </div>
            <div
              className="degree-filters"
              role="group"
              aria-label="Lọc theo bậc học"
            >
              {degreeFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  aria-pressed={degreeFilter === filter.value}
                  className={degreeFilter === filter.value ? "active" : ""}
                  onClick={() => setDegreeFilter(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="featured-grid" aria-live="polite">
            {visibleScholarships.map((item) => (
              <article className="featured-card" key={item.name}>
                <div
                  className={`scholarship-monogram tone-${item.tone}`}
                  aria-hidden="true"
                >
                  {item.shortName}
                </div>
                <div className="featured-card-heading">
                  <p className="featured-provider">{item.provider}</p>
                  <h3>{item.name}</h3>
                  <span>
                    <IconGlobe size={15} aria-hidden="true" />{" "}
                    {item.destination}
                  </span>
                </div>
                <div className="scholarship-tags">
                  <span>{item.degreeLabel}</span>
                  <span>{item.funding}</span>
                </div>
                <p className="featured-coverage">{item.coverage}</p>
                <a href={item.url} target="_blank" rel="noreferrer">
                  Xem nguồn chính thức
                  <IconArrowUpRight size={16} aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
          {visibleScholarships.length === 0 ? (
            <div className="scholarship-empty">
              <IconSearch size={24} aria-hidden="true" />
              <strong>Chưa tìm thấy học bổng phù hợp bộ lọc.</strong>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setDegreeFilter("all");
                }}
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : null}
        </section>

        <section className="method-section" id="method">
          <div className="method-copy">
            <p className="scholar-kicker">Đánh giá toàn diện</p>
            <h2>Một con số là chưa đủ. Bạn cần biết lý do phía sau.</h2>
            <p>
              Báo cáo không chỉ xếp hạng cơ hội. Mỗi gợi ý đều chỉ ra mức tài
              trợ, chi phí sống, lợi thế hồ sơ và khoảng trống cần cải thiện.
            </p>
            <ul>
              {profileSignals.map((signal) => (
                <li key={signal}>
                  <IconCheck size={17} aria-hidden="true" /> {signal}
                </li>
              ))}
            </ul>
            <Link to="/discover" className="inline-cta">
              Bắt đầu với hồ sơ của tôi{" "}
              <IconArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="method-grid">
            {[
              {
                icon: IconClipboardCheck,
                number: "01",
                title: "Điền hồ sơ",
                text: "Trả lời từng nhóm câu hỏi theo từng bước, có thể để trống phần chưa có.",
              },
              {
                icon: IconChartBar,
                number: "02",
                title: "Đối chiếu điều kiện",
                text: "Hồ sơ được chấm theo học thuật, kinh nghiệm, tài chính và ưu tiên cá nhân.",
              },
              {
                icon: IconSchool,
                number: "03",
                title: "Nhận Top 10",
                text: "Xem trường, học bổng, mức tài trợ và ranking tham khảo theo thứ tự phù hợp.",
              },
              {
                icon: IconWallet,
                number: "04",
                title: "Lập kế hoạch",
                text: "Biết khoản tự chi trả dự kiến và những phần hồ sơ nên cải thiện tiếp theo.",
              },
            ].map((step) => (
              <article key={step.number}>
                <div className="method-icon">
                  <step.icon size={22} stroke={1.8} aria-hidden="true" />
                </div>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="public-final-cta" id="about">
          <div>
            <p className="scholar-kicker">Sẵn sàng bắt đầu?</p>
            <h2>Biến một hồ sơ dài thành kế hoạch ứng tuyển rõ ràng.</h2>
          </div>
          <div>
            <p>
              Không đăng ký. Không cần nhập email. Kết quả xuất hiện ngay sau
              khi hoàn thành khảo sát.
            </p>
            <Link to="/discover" className="public-primary-button">
              Làm khảo sát ngay <IconArrowRight size={19} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="public-footer">
        <div className="scholar-brand footer-brand">
          <span className="scholar-brand-mark" aria-hidden="true">
            S
          </span>
          <span className="scholar-brand-copy">
            <strong>Scholarship Compass</strong>
            <small>Scholarship advisory platform</small>
          </span>
        </div>
        <p>Kết quả là ước tính định hướng, không phải cam kết trúng tuyển.</p>
        <a href="#scholarships">Danh mục học bổng</a>
      </footer>
    </div>
  );
}
