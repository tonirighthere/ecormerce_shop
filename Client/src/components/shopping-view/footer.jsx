import { FaFacebookF, FaYoutube, FaTiktok } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

function Footer() {
  return (
    <footer className="bg-black text-white pt-8 pb-4 mt-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold mb-2">TỔNG ĐÀI HỖ TRỢ</h3>
          <p>
            Tư vấn mua hàng (miễn phí): <span className="text-red-500 font-bold">1800.6229</span> (08h30 - 21h30)
          </p>
          <p>
            Khiếu nại - Góp ý: <span className="text-red-500 font-bold">088.99999.33</span> (09h00 - 18h00)
          </p>
          <p>
            Bán hàng doanh nghiệp B2B: <span className="text-red-500 font-bold">088.99999.22</span> (08h30 - 21h00)
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-2">HỖ TRỢ KHÁCH HÀNG</h3>
          <ul>
            <li>Mua hàng trả góp</li>
            <li>Chính sách kiểm hàng</li>
            <li>Mua hàng online</li>
            <li>Chính sách bảo hành</li>
            <li>Chính sách đổi trả</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">VỀ CHÚNG TÔI</h3>
          <ul>
            <li>Giới thiệu về D2 Smart Phone</li>
            <li>Tuyển dụng</li>
            <li>Quy chế hoạt động</li>
            <li>Dự án Doanh nghiệp</li>
            <li>Tin tức khuyến mại</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">KẾT NỐI QUA</h3>
          <div className="flex gap-3 mt-2">
            <a href="https://www.facebook.com/profile.php?id=100088094500366" className="bg-white p-2 rounded"  target="_blank" aria-label="Facebook">
              <FaFacebookF size={24} color="#1877F3" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=100088094500366" className="bg-white p-2 rounded" target="_blank" aria-label="Zalo">
              <SiZalo size={24} color="#1877F3" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=100088094500366" className="bg-white p-2 rounded" target="_blank" aria-label="Youtube">
              <FaYoutube size={24} color="#FF0000" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=100088094500366" className="bg-white p-2 rounded" target="_blank" aria-label="Tiktok">
              <FaTiktok size={24} color="#000000" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400 text-sm">
        Copyright © 2025 D2 Smart Phone
      </div>
      <div className="pt-4 text-center text-gray-400 text-xs italic">
        Designed by tonirighthere
      </div>
    </footer>
  );
}

export default Footer;