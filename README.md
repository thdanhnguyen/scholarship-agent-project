# Scholarship Compass

Website tư vấn học bổng có Agent chạy phía sau để chuẩn hóa nguồn, đánh giá hồ
sơ và xếp hạng Top 10 cơ hội. Trang chủ giới thiệu học bổng nổi bật; khảo sát
chuyên sâu bao gồm học thuật, ngoại ngữ, công việc, nghiên cứu, công bố, giải
thưởng, ngoại khóa, lãnh đạo và tài chính. Ngành học là trường nhập tự do.
Trải nghiệm public không yêu cầu đăng ký hoặc đăng nhập: người dùng duyệt landing
page trước và chỉ vào khảo sát khi chủ động chọn một nút kêu gọi hành động.

## Chạy dự án

Yêu cầu Node.js `>=22.22.0` và pnpm `10.29.1`.

```powershell
corepack enable
pnpm install
Copy-Item .env.example .env
pnpm dev
```

Mở `/` để xem landing page và `/discover` để thực hiện khảo sát.

## Kiểm tra chất lượng

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm agent-native:doctor
```

## Kiến trúc chính

- `app/routes/_index.tsx`: landing page có tìm kiếm và lọc học bổng nổi bật.
- `app/routes/discover.tsx`: khảo sát bảy bước và màn hình Top 10.
- `actions/recommend-scholarships.ts`: action xếp hạng dùng chung cho UI và agent.
- `server/data/scholarships.ts`: dữ liệu mẫu có đường dẫn nguồn chính thức.
- `supabase/migrations/`: schema Supabase cho catalog, hồ sơ, recommendation và crawl jobs.
- `app/scholarship.css`: design system xanh, responsive cho landing và khảo sát.
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
