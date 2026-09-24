import { Navigate } from "react-router";

const SEO_TITLE = "Scholarship Compass — Tìm học bổng phù hợp";
const SEO_DESCRIPTION =
  "Khảo sát hồ sơ và nhận danh sách 10 học bổng, trường phù hợp nhất.";

export function meta() {
  return [
    { title: SEO_TITLE },
    { name: "description", content: SEO_DESCRIPTION },
    { property: "og:title", content: SEO_TITLE },
    { property: "og:description", content: SEO_DESCRIPTION },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: SEO_TITLE },
    { name: "twitter:description", content: SEO_DESCRIPTION },
  ];
}

export default function MarketingHomeRoute() {
  return <Navigate to="/discover" replace />;
}
