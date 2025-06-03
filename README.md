# Web E-commerce Shop

Dự án hệ thống thương mại điện tử gồm hai phần: **Frontend (ReactJS)** và **Backend (NodeJS/Express)**. Hệ thống hỗ trợ quản lý sản phẩm, đơn hàng, người dùng, slider, và nhiều tính năng dành cho admin.

---

## 🚀 Tính năng nổi bật

- Đăng nhập/Đăng xuất người dùng và admin
- Quản lý sản phẩm, đơn hàng, người dùng, slider
- Giao diện responsive cho cả desktop và mobile
- Tìm kiếm, lọc, phân trang sản phẩm
- Xử lý xác thực, phân quyền
- API RESTful cho backend

---

## 📦 Cài đặt & Khởi chạy

### 1. Clone repository

```bash
git clone https://github.com/tonirighthere/ecormerce_shop.git
cd ecormerce_shop
```

### 2. Cài đặt backend

```bash
cd Server
npm install
npm run dev
```

### 3. Cài đặt frontend

```bash
cd ../Client
npm install
npm run dev
```

- Frontend mặc định chạy ở: `http://localhost:5173`
- Backend mặc định chạy ở: `http://localhost:5000` 

---

## 🛠️ Công nghệ sử dụng

### Frontend

- ReactJS
- Redux Toolkit
- React Router
- Lucide-react
- TailwindCSS

### Backend

- NodeJS
- ExpressJS
- MongoDB (Mongoose)
- JWT (xác thực)
- dotenv

---

## 📁 Cấu trúc thư mục

```
ecormerce_shop/
├── Client/           # Frontend React
│   ├── src/
│   │   ├── components/
│   │   ├── store/
│   │   └── ...
│   └── package.json
├── Server/           # Backend NodeJS
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── README.md
└── ...
```

---

## 👤 Đóng góp

1. Fork repo
2. Tạo nhánh mới (`git checkout -b feature/ten-tinh-nang`)
3. Commit và push
4. Tạo Pull Request

---

## 📸 Demo

![Giao diện trang user](./Client/src/assets/screenshots/user.png)
![Giao diện trang admin](./Client/src/assets/screenshots/admin.png)
---

## 📄 License

MIT

---

## 🔗 Badge

![GitHub last commit](https://img.shields.io/github/last-commit/tonirighthere/ecormerce_shop)
![GitHub license](https://img.shields.io/github/license/tonirighthere/ecormerce_shop)
