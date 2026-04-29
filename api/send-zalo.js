export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, msg, time } = req.body;
  const ZALO_BOT_TOKEN = process.env.ZALO_BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!ZALO_BOT_TOKEN || !CHAT_ID) {
    console.error('[Zalo] Thiếu biến môi trường ZALO_BOT_TOKEN hoặc CHAT_ID');
    return res.status(500).json({ success: false, message: 'Chưa cấu hình ZALO_BOT_TOKEN hoặc CHAT_ID' });
  }

  // Format URL đúng theo tài liệu chính thức Zalo Bot Platform
  const API_URL = `https://bot-api.zaloplatforms.com/bot${ZALO_BOT_TOKEN}/sendMessage`;
  const text = `💌 Lời chúc mới!\n👤 Từ: ${name}\n💬 Nội dung: "${msg}"\n🕒 Thời gian: ${time}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text })
    });

    const data = await response.json();
    console.log('[Zalo API response]', JSON.stringify(data));

    // Zalo Bot API trả về { "ok": true, "result": {...} } khi thành công
    if (!data.ok) {
      return res.status(400).json({ success: false, error_zalo: data });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('[Zalo] Lỗi kết nối:', error.message);
    return res.status(500).json({ message: 'Lỗi kết nối Zalo API', error: error.message });
  }
}
