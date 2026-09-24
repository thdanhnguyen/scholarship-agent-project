# Scholarship Compass

Ứng dụng Agent-Native giúp người học hoàn thành khảo sát hồ sơ và nhận danh
sách Top 10 học bổng/trường phù hợp. MVP hỗ trợ bậc đại học, thạc sĩ và tiến
sĩ; lọc theo châu lục, ngành học, GPA, ngoại ngữ, ngân sách và mức tài trợ.

## Chạy dự án

Yêu cầu Node.js `>=22.22.0` và pnpm `10.29.1`.

```powershell
corepack enable
pnpm install
Copy-Item .env.example .env
pnpm dev
```

Mở `/discover` để dùng khảo sát và `/home` để trao đổi trong giao diện cố vấn.

## Kiểm tra chất lượng

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm agent-native:doctor
```

## Kiến trúc chính

- `app/routes/discover.tsx`: khảo sát bốn bước và màn hình Top 10.
- `actions/recommend-scholarships.ts`: action xếp hạng dùng chung cho UI và agent.
- `server/data/scholarships.ts`: dữ liệu mẫu có đường dẫn nguồn chính thức.
- `app/global.css`: design tokens và giao diện xanh responsive.
- `DESIGN.md`: hợp đồng thiết kế của sản phẩm.

## Dữ liệu và bảo mật

Dữ liệu hiện tại là bộ mẫu để kiểm thử luồng sản phẩm. Trước khi phát hành,
cần bổ sung pipeline crawl/API, lịch cập nhật, kiểm duyệt và lưu thời điểm xác
minh từng nguồn. Kết quả chỉ là shortlist; người dùng phải kiểm tra điều kiện
và hạn nộp trên trang chính thức.

Không đặt API key, token hoặc mật khẩu trong mã nguồn. Sao chép
`.env.example` thành `.env` để cấu hình cục bộ; `.env` đã được Git bỏ qua.
Biến bí mật chỉ được đọc ở server/action và nên chuyển sang secret manager của
môi trường triển khai khi lên production.
