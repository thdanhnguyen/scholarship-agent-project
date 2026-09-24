import { Link } from "react-router";

const featuredScholarships = [
  {
    name: "Erasmus Mundus Joint Masters",
    provider: "Liên minh Châu Âu",
    destination: "Nhiều quốc gia Châu Âu",
    degree: "Thạc sĩ",
    funding: "Toàn phần",
    coverage: "Học phí, sinh hoạt phí và hỗ trợ đi lại",
    url: "https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters",
  },
  {
    name: "Chevening Scholarships",
    provider: "UK Government",
    destination: "Vương quốc Anh",
    degree: "Thạc sĩ",
    funding: "Toàn phần",
    coverage: "Học phí, sinh hoạt phí và vé máy bay",
    url: "https://www.chevening.org/scholarships/",
  },
  {
    name: "MEXT Scholarship",
    provider: "Chính phủ Nhật Bản",
    destination: "Nhật Bản",
    degree: "Đại học · Thạc sĩ · Tiến sĩ",
    funding: "Toàn phần",
    coverage: "Học phí, trợ cấp hàng tháng và vé máy bay",
    url: "https://www.studyinjapan.go.jp/en/planning/scholarships/mext-scholarships/",
  },
  {
    name: "Global Korea Scholarship",
    provider: "Government of Korea",
    destination: "Hàn Quốc",
    degree: "Đại học · Sau đại học",
    funding: "Toàn phần",
    coverage: "Học phí, sinh hoạt phí, ngôn ngữ và đi lại",
    url: "https://www.studyinkorea.go.kr/",
  },
  {
    name: "Fulbright Foreign Student Program",
    provider: "U.S. Department of State",
    destination: "Hoa Kỳ",
    degree: "Thạc sĩ · Tiến sĩ",
    funding: "Toàn phần",
    coverage: "Học phí, sinh hoạt phí và bảo hiểm",
    url: "https://foreign.fulbrightonline.org/",
  },
  {
    name: "Australia Awards Scholarships",
    provider: "Australian Government",
    destination: "Úc",
    degree: "Đại học · Sau đại học",
    funding: "Toàn phần",
    coverage: "Học phí, vé máy bay, sinh hoạt phí và bảo hiểm",
    url: "https://www.dfat.gov.au/people-to-people/australia-awards",
  },
];

export function meta() {
  return [
    { title: "Scholarship Compass — Đánh giá cơ hội học bổng" },
    {
      name: "description",
      content:
        "Khám phá học bổng nổi bật và đánh giá chi tiết khả năng nhận học bổng theo hồ sơ cá nhân.",
    },
  ];
}

export default function MarketingHomeRoute() {
  return (
    <div className="public-site">
      <header className="public-nav">
        <Link to="/" className="scholar-brand">
          <span className="scholar-brand-mark">S</span>
          <span>Scholarship Compass</span>
        </Link>
        <nav aria-label="Điều hướng chính">
          <a href="#featured">Học bổng nổi bật</a>
          <a href="#how-it-works">Cách hoạt động</a>
          <Link to="/discover" className="public-nav-cta">
            Đánh giá hồ sơ
          </Link>
        </nav>
      </header>

      <main>
        <section className="public-hero">
          <div className="public-hero-copy">
            <p className="scholar-kicker">
              Tư vấn dựa trên dữ liệu và nguồn chính thức
            </p>
            <h1>Biết hồ sơ của bạn có thể đạt học bổng nào.</h1>
            <p>
              Điền hồ sơ học thuật, nghiên cứu, ngoại khóa và tài chính để nhận
              danh sách trường, mức tài trợ và xác suất phù hợp có giải thích.
            </p>
            <div className="public-hero-actions">
              <Link to="/discover" className="public-primary-button">
                Bắt đầu đánh giá miễn phí
              </Link>
              <a href="#featured" className="public-secondary-link">
                Xem học bổng tiêu biểu
              </a>
            </div>
            <dl className="public-trust-row">
              <div>
                <dt>10+</dt>
                <dd>tiêu chí hồ sơ</dd>
              </div>
              <div>
                <dt>Top 10</dt>
                <dd>cơ hội phù hợp</dd>
              </div>
              <div>
                <dt>Nguồn gốc</dt>
                <dd>được dẫn link rõ ràng</dd>
              </div>
            </dl>
          </div>
          <aside
            className="public-score-card"
            aria-label="Ví dụ kết quả đánh giá"
          >
            <p>Ví dụ báo cáo</p>
            <h2>Hồ sơ Data Science · Thạc sĩ</h2>
            <div className="public-score-value">
              <strong>78%</strong>
              <span>mức phù hợp cao</span>
            </div>
            <ul>
              <li>GPA và IELTS đạt nhóm cạnh tranh</li>
              <li>Kinh nghiệm nghiên cứu tạo lợi thế</li>
              <li>Nên bổ sung một thư giới thiệu học thuật</li>
            </ul>
          </aside>
        </section>

        <section className="featured-section" id="featured">
          <div className="public-section-heading">
            <div>
              <p className="scholar-kicker">Cơ hội tiêu biểu</p>
              <h2>Học bổng nổi bật để bạn khám phá trước</h2>
            </div>
            <p>
              Thông tin tổng quan giúp định hướng. Điều kiện và hạn nộp luôn cần
              được kiểm tra lại trên nguồn chính thức.
            </p>
          </div>
          <div className="featured-grid">
            {featuredScholarships.map((item, index) => (
              <article className="featured-card" key={item.name}>
                <div className="featured-card-index">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <p className="featured-provider">{item.provider}</p>
                <h3>{item.name}</h3>
                <dl>
                  <div>
                    <dt>Điểm đến</dt>
                    <dd>{item.destination}</dd>
                  </div>
                  <div>
                    <dt>Bậc học</dt>
                    <dd>{item.degree}</dd>
                  </div>
                  <div>
                    <dt>Tài trợ</dt>
                    <dd>{item.funding}</dd>
                  </div>
                </dl>
                <p className="featured-coverage">{item.coverage}</p>
                <a href={item.url} target="_blank" rel="noreferrer">
                  Xem nguồn chính thức
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="public-section-heading">
            <div>
              <p className="scholar-kicker">Không chỉ là bộ lọc</p>
              <h2>Hồ sơ được phân tích theo từng lớp</h2>
            </div>
          </div>
          <ol>
            <li>
              <span>01</span>
              <h3>Hiểu mục tiêu</h3>
              <p>
                Bậc học, ngành tự do, điểm đến, kỳ nhập học và nhu cầu tài
                chính.
              </p>
            </li>
            <li>
              <span>02</span>
              <h3>Đọc toàn bộ hồ sơ</h3>
              <p>
                Học thuật, ngoại ngữ, công việc, nghiên cứu, bài báo, giải
                thưởng và ngoại khóa.
              </p>
            </li>
            <li>
              <span>03</span>
              <h3>Đối chiếu cơ hội</h3>
              <p>
                Agent kiểm tra điều kiện, nguồn, độ mới và mức tài trợ trước khi
                xếp hạng.
              </p>
            </li>
            <li>
              <span>04</span>
              <h3>Chỉ ra khoảng trống</h3>
              <p>
                Báo cáo nêu rõ lợi thế, điểm còn thiếu và hành động nên làm tiếp
                theo.
              </p>
            </li>
          </ol>
        </section>
      </main>

      <footer className="public-footer">
        <span>Scholarship Compass</span>
        <p>Kết quả là ước tính định hướng, không phải cam kết trúng tuyển.</p>
      </footer>
    </div>
  );
}
