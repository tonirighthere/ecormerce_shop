# Web E-commerce Shop

Dự án hệ thống thương mại điện tử gồm hai phần: **Frontend (ReactJS)** và **Backend (NodeJS/Express)**. Hệ thống hỗ trợ quản lý sản phẩm, đơn hàng, người dùng, slider, và nhiều tính năng dành cho admin.

---

##  Tính năng nổi bật

- Đăng nhập/Đăng xuất người dùng và admin
- Quản lý sản phẩm, đơn hàng, người dùng, slider
- Giao diện responsive cho cả desktop và mobile
- Tìm kiếm, lọc, phân trang sản phẩm
- Xử lý xác thực, phân quyền
- API RESTful cho backend

---

##  Cài đặt & Khởi chạy

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

##  Cấu trúc thư mục

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

##  Demo

![Giao diện trang user](https://res.cloudinary.com/dg0udrlmx/image/upload/v1748942003/0a9a7a66-0d62-459a-b27e-6cc76ba212f2.png)
![Giao diện trang admin](https://res.cloudinary.com/dg0udrlmx/image/upload/v1748941959/1454129b-6e3f-4603-8c7a-b7d9bbb76fe1.png)
---


## 🔗 Badge

![GitHub last commit](https://img.shields.io/github/last-commit/tonirighthere/ecormerce_shop)
![GitHub license](https://img.shields.io/github/license/tonirighthere/ecormerce_shop)
