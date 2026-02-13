// ============================================
// 🔧 Admin Panel - Valentine Gold Miner
// ============================================

const STORAGE_KEY = 'valentine_gold_miner_config';
const LEVEL_NAMES = ['Level 1: Tình yêu nảy nở 🌱', 'Level 2: Yêu thương lớn dần 🌸', 'Level 3: Tình yêu bất diệt 💖'];

function getConfig() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch { }
    return {
        password: 'love2026',
        gifts: [
            { name: '', desc: '', msg: '', img: '' },
            { name: '', desc: '', msg: '', img: '' },
            { name: '', desc: '', msg: '', img: '' }
        ]
    };
}

function saveConfig(cfg) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

function showToast(text) {
    const t = document.getElementById('toast');
    t.textContent = text || 'Đã lưu!';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
}

function renderGifts(config) {
    const container = document.getElementById('gifts-container');
    container.innerHTML = '';
    config.gifts.forEach((gift, i) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
      <h3>🎁 ${LEVEL_NAMES[i]}</h3>
      <label>Tên quà</label>
      <input type="text" data-idx="${i}" data-field="name" value="${gift.name || ''}" placeholder="Ví dụ: Một bó hoa hồng...">
      <label>Mô tả</label>
      <textarea data-idx="${i}" data-field="desc" placeholder="Mô tả chi tiết về phần quà...">${gift.desc || ''}</textarea>
      <label>Lời nhắn yêu thương 💌</label>
      <textarea data-idx="${i}" data-field="msg" placeholder="Lời nhắn dành cho người yêu...">${gift.msg || ''}</textarea>
      <label>URL hình ảnh (tùy chọn)</label>
      <input type="text" data-idx="${i}" data-field="img" value="${gift.img || ''}" placeholder="https://...">
    `;
        container.appendChild(card);
    });
}

function collectGifts() {
    const gifts = [{}, {}, {}];
    document.querySelectorAll('[data-idx]').forEach(el => {
        const i = parseInt(el.dataset.idx);
        const f = el.dataset.field;
        gifts[i][f] = el.value.trim();
    });
    return gifts;
}

document.addEventListener('DOMContentLoaded', () => {
    let config = getConfig();

    // Password check
    const pwScreen = document.getElementById('pw-screen');
    const adminPanel = document.getElementById('admin-panel');
    const pwInput = document.getElementById('pw-input');
    const pwError = document.getElementById('pw-error');

    document.getElementById('pw-btn').onclick = () => {
        if (pwInput.value === config.password) {
            pwScreen.classList.remove('active');
            adminPanel.classList.add('active');
            renderGifts(config);
        } else {
            pwError.style.display = 'block';
            pwInput.value = '';
            setTimeout(() => pwError.style.display = 'none', 2000);
        }
    };
    pwInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') document.getElementById('pw-btn').click();
    });

    // Save
    document.getElementById('save-btn').onclick = () => {
        config.gifts = collectGifts();
        const newPw = document.getElementById('new-pw').value.trim();
        if (newPw) config.password = newPw;
        saveConfig(config);
        showToast('💾 Đã lưu thành công!');
    };

    // Reset
    document.getElementById('reset-btn').onclick = () => {
        if (confirm('Bạn có chắc muốn xóa tất cả cài đặt?')) {
            localStorage.removeItem(STORAGE_KEY);
            config = getConfig();
            renderGifts(config);
            document.getElementById('new-pw').value = '';
            showToast('🗑️ Đã reset!');
        }
    };
});
