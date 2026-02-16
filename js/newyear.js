/* ============================================
   🌸 CHÚC MỪNG NĂM MỚI 2026 — Interactive JS
   Cherry blossom particles, typewriter, carousel
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ---- 1. CHERRY BLOSSOM PARTICLE SYSTEM ----
    const petalCanvas = document.getElementById('petal-canvas');
    const pCtx = petalCanvas.getContext('2d');
    let petals = [];

    function resizePetalCanvas() {
        petalCanvas.width = petalCanvas.offsetWidth;
        petalCanvas.height = petalCanvas.offsetHeight;
    }
    resizePetalCanvas();
    window.addEventListener('resize', resizePetalCanvas);

    class Petal {
        constructor(W, H) {
            this.x = Math.random() * W;
            this.y = -20 - Math.random() * 100;
            this.size = 8 + Math.random() * 10;
            this.speedY = 30 + Math.random() * 40;
            this.speedX = -10 + Math.random() * 20;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 2;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = 0.5 + Math.random() * 1;
            this.alpha = 0.4 + Math.random() * 0.5;
            this.color = ['#FFB7C5', '#FF9FB5', '#FFD4DE', '#FFC0CB', '#FF8FA8'][Math.floor(Math.random() * 5)];
            this.W = W; this.H = H;
        }

        update(dt) {
            this.y += this.speedY * dt;
            this.x += this.speedX * dt + Math.sin(this.wobble) * 15 * dt;
            this.wobble += this.wobbleSpeed * dt;
            this.rotation += this.rotSpeed * dt;
            if (this.y > this.H + 30) {
                this.y = -20;
                this.x = Math.random() * this.W;
            }
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            // Draw petal shape
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size * 0.5, this.size, 0, 0, Math.PI * 2);
            ctx.fill();
            // Small inner highlight
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.beginPath();
            ctx.ellipse(-this.size * 0.1, -this.size * 0.2, this.size * 0.15, this.size * 0.3, 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function initPetals() {
        petals = [];
        const count = Math.min(40, Math.floor(petalCanvas.width * petalCanvas.height / 12000));
        for (let i = 0; i < count; i++) {
            const p = new Petal(petalCanvas.width, petalCanvas.height);
            p.y = Math.random() * petalCanvas.height; // scatter initially
            petals.push(p);
        }
    }
    initPetals();

    let lastT = performance.now();
    function animatePetals(now) {
        const dt = Math.min((now - lastT) / 1000, 0.05);
        lastT = now;
        pCtx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
        petals.forEach(p => { p.update(dt); p.draw(pCtx); });
        requestAnimationFrame(animatePetals);
    }
    requestAnimationFrame(animatePetals);


    // ---- 2. TYPEWRITER EFFECT FOR LOVE LETTER ----
    const letterBody = document.getElementById('letter-body');
    const letterSign = document.getElementById('letter-sign');
    const fullText = letterBody.getAttribute('data-text');
    let charIdx = 0;
    let typeStarted = false;

    function typeWriter() {
        if (charIdx <= fullText.length) {
            letterBody.innerHTML = fullText.substring(0, charIdx) + '<span class="cursor"></span>';
            charIdx++;
            const delay = fullText[charIdx - 1] === '.' ? 300 :
                fullText[charIdx - 1] === ',' ? 150 :
                    fullText[charIdx - 1] === '!' ? 200 : 25;
            setTimeout(typeWriter, delay);
        } else {
            letterBody.innerHTML = fullText;
            letterSign.classList.add('visible');
        }
    }


    // ---- 3. SCROLL REVEAL (IntersectionObserver) ----
    const revealElements = document.querySelectorAll('.reveal, .wish-card');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.dataset.delay || 0;
                setTimeout(() => el.classList.add('visible'), delay);
                revealObs.unobserve(el);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObs.observe(el));

    // Observe letter section to start typewriter
    const letterSection = document.querySelector('.letter-section');
    const letterObs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !typeStarted) {
            typeStarted = true;
            setTimeout(typeWriter, 400);
            letterObs.unobserve(letterSection);
        }
    }, { threshold: 0.3 });
    letterObs.observe(letterSection);


    // ---- 4. GALLERY CAROUSEL ----
    const carousel = document.querySelector('.gallery-carousel');
    const dots = document.querySelectorAll('.gallery-dot');
    const items = document.querySelectorAll('.gallery-item');

    if (carousel && dots.length > 0 && items.length > 0) {
        carousel.addEventListener('scroll', () => {
            const scrollLeft = carousel.scrollLeft;
            const itemWidth = items[0].offsetWidth + 16; // gap
            const idx = Math.round(scrollLeft / itemWidth);
            dots.forEach((d, i) => d.classList.toggle('active', i === idx));
        });

        // Tap dot to scroll
        dots.forEach((d, i) => {
            d.addEventListener('click', () => {
                const itemWidth = items[0].offsetWidth + 16;
                carousel.scrollTo({ left: itemWidth * i, behavior: 'smooth' });
            });
        });
    }


    // ---- 5. LÌ XÌ LUCKY ENVELOPE ----
    const envelope = document.getElementById('lixi-envelope');
    const lixiResult = document.getElementById('lixi-result');
    const resultEmoji = document.getElementById('lixi-result-emoji');
    const resultMsg = document.getElementById('lixi-result-msg');
    const resultSub = document.getElementById('lixi-result-sub');
    const againBtn = document.getElementById('lixi-again');

    const luckyMessages = [
        { emoji: '💰', msg: 'Phát Tài Phát Lộc!', sub: 'Năm mới làm gì cũng ra tiền, ví lúc nào cũng căng phồng nha công chúa!' },
        { emoji: '💕', msg: 'Tình Yêu Viên Mãn!', sub: 'Anh và em mãi bên nhau, yêu nhau mỗi ngày một nhiều hơn! 💝' },
        { emoji: '🌟', msg: 'Toả Sáng Rực Rỡ!', sub: 'Nhung Công Chúa sẽ toả sáng như ngôi sao, đi đâu cũng được yêu thương!' },
        { emoji: '🎊', msg: 'Vạn Sự Như Ý!', sub: 'Mọi điều em mong ước đều sẽ thành hiện thực trong năm mới!' },
        { emoji: '✨', msg: 'Xinh Đẹp Mãi Mãi!', sub: 'Năm mới da đẹp, tóc mượt, nhan sắc ngày càng lên hương!' },
        { emoji: '🧧', msg: 'Lộc Xuân Đầy Nhà!', sub: 'May mắn, hạnh phúc, bình an tràn ngập mỗi ngày bên em!' },
        { emoji: '🎯', msg: 'Thăng Tiến Vượt Bậc!', sub: 'Sự nghiệp năm mới thăng hoa, thành công vang dội, sếp thương đồng nghiệp quý!' },
        { emoji: '💪', msg: 'Khoẻ Re Khoẻ Khoắn!', sub: 'Sức khoẻ dồi dào, năng lượng tràn đầy, ăn gì cũng không béo! 😄' },
    ];

    if (envelope) {
        envelope.addEventListener('click', () => {
            const lucky = luckyMessages[Math.floor(Math.random() * luckyMessages.length)];
            resultEmoji.textContent = lucky.emoji;
            resultMsg.textContent = lucky.msg;
            resultSub.textContent = lucky.sub;

            // Animate
            envelope.style.transition = 'all 0.5s ease';
            envelope.style.transform = 'scale(0.8) rotateY(90deg)';
            envelope.style.opacity = '0';

            if (navigator.vibrate) navigator.vibrate([50, 30, 100]);

            setTimeout(() => {
                envelope.style.display = 'none';
                lixiResult.classList.add('visible');
            }, 400);
        });
    }

    if (againBtn) {
        againBtn.addEventListener('click', () => {
            lixiResult.classList.remove('visible');
            envelope.style.display = 'block';
            envelope.style.transform = 'scale(1) rotateY(0)';
            envelope.style.opacity = '1';
        });
    }


    // ---- 6. FLOATING DECORATIONS (falling petals in wishes section) ----
    const wishSection = document.querySelector('.wishes-section');
    if (wishSection) {
        for (let i = 0; i < 8; i++) {
            const petal = document.createElement('div');
            petal.textContent = ['🌸', '🏵️', '✨', '🎋'][Math.floor(Math.random() * 4)];
            petal.style.cssText = `
        position: absolute;
        font-size: ${14 + Math.random() * 16}px;
        opacity: ${0.1 + Math.random() * 0.15};
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        pointer-events: none;
        animation: floatDecor ${5 + Math.random() * 5}s ease-in-out infinite;
        animation-delay: ${Math.random() * 3}s;
      `;
            wishSection.appendChild(petal);
        }

        // Add float keyframes
        const style = document.createElement('style');
        style.textContent = `
      @keyframes floatDecor {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-15px) rotate(10deg); }
      }
    `;
        document.head.appendChild(style);
    }
});
