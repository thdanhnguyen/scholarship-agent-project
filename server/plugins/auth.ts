import { createAuthPlugin } from "@agent-native/core/server";

const appTitle = "Scholarship Compass";

export default createAuthPlugin({
  workspaceAppPublicPaths: ["/"],
  marketing: {
    appName: appTitle,
    screenshotPath: "/auth-marketing/chat.webp",
    screenshotWidth: 914,
    screenshotHeight: 818,
    learnMoreUrl: "/discover",
    tagline:
      "Khảo sát hồ sơ và xây dựng danh sách học bổng phù hợp với mục tiêu du học của bạn.",
    features: [
      "Khảo sát từ bậc đại học đến tiến sĩ",
      "Top 10 gợi ý có giải thích và nguồn chính thức",
      "Trao đổi tiếp với cố vấn ngay trong cùng một ứng dụng",
    ],
  },
});
