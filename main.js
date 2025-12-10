// 0. ふわっと
  window.addEventListener("load", () => {
    document.body.classList.add("show");
  });

// 1. スクロールヘッダー
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// 2. FV ロゴ表示
document.addEventListener("DOMContentLoaded", () => {
    const logo = document.querySelector('.fv-logo');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                logo.classList.add('appear');
            }
        });
    });

    observer.observe(logo);
});

// ==================================
// 3.すべてのフェードインを共通で処理
// ==================================
document.addEventListener("DOMContentLoaded", () => {

    // 対象をまとめる
    const fadeTargets = [
        ...document.querySelectorAll(".fadein-up"),
        ...document.querySelectorAll(".fade-up"),
        ...document.querySelectorAll(".work-card")
    ];

    fadeTargets.forEach(el => {
        if (el.classList.contains("work-card")) {
            el.classList.add("fade-work"); // work専用スタイル
        }
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show", "visible");
                observer.unobserve(entry.target);  // 1回のみ
            }
        });
    }, { threshold: 0.15 });

    fadeTargets.forEach(el => observer.observe(el));
});

// 4. 紙飛行機
const isMobile = window.innerWidth < 768;

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

// キーフレーム生成
function generateRandomKeyframes(name) {
    const endY = rand(isMobile ? -20 : -18, isMobile ? -35 : -28);
    const tilt = rand(-20, 20);

    const style = document.createElement("style");
    style.innerHTML = `
    @keyframes ${name} {
        0% { transform: translate(0,0) rotate(0deg) scale(1); opacity: 0; }
        10% { opacity: 1; }
        100% { transform: translate(100vw, ${endY}vh) rotate(${tilt}deg) scale(1); opacity: 0; }
    }`;
    document.head.appendChild(style);
}

let currentPlane = null;

// 飛行機生成
function createPaperPlaneFor(container) {
    if (!container || currentPlane) return;

    const plane = document.createElement("div");
    plane.classList.add("paper-plane");

    const scale = rand(isMobile ? 0.7 : 0.8, isMobile ? 1.2 : 1.4);
    plane.style.transform = `scale(${scale})`;

    const animName = "flyPlane" + Math.floor(Math.random() * 100000);
    generateRandomKeyframes(animName);

    const duration = rand(6, 12);
    plane.style.animation = `${animName} ${duration}s linear forwards`;

    container.appendChild(plane);
    currentPlane = plane;

    plane.addEventListener("animationend", () => {
        plane.remove();
        currentPlane = null;
    });
}

// ランダム発射
function startRandomPlanes(container, min = 4000, max = 11000) {
    if (!container) return;

    function launch() {
        createPaperPlaneFor(container);
        setTimeout(launch, rand(min, max));
    }
    launch();
}

// =========================
// intro：Observer で1回発射
// =========================
function observeAndLaunchOnce(container) {
    if (!container) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    createPaperPlaneFor(container);
                    observer.unobserve(container);
                }
            });
        },
        {
            threshold: 0.3,
        }
    );

    observer.observe(container);
}

// =========================
// footer：スクロール位置で 1 回発射（確実に動く）
// =========================
function scrollTriggerFooter(container) {
    if (!container) return;

    let done = false;

    window.addEventListener("scroll", () => {
        if (done) return;

        const footerRect = container.getBoundingClientRect();

        // 画面に 20% 以上入ったら発射
        if (footerRect.top < window.innerHeight * 0.8) {
            createPaperPlaneFor(container);
            done = true;
        }
    });
}

// 実行
document.addEventListener("DOMContentLoaded", () => {
    const layers = document.querySelectorAll(".paper-plane-layer");

    // intro
    if (layers[0]) {
        observeAndLaunchOnce(layers[0]);
        startRandomPlanes(layers[0], 4000, 11000);
    }

    // footer（必ず飛ぶ）
    if (layers[1]) {
        scrollTriggerFooter(layers[1]);
        startRandomPlanes(layers[1], 6000, 14000);
    }
});


// 5. フッターのアーチ
window.addEventListener("scroll", () => {
    const archTop = document.querySelector(".footer-arch-wrapper").getBoundingClientRect().top;
    if (archTop < window.innerHeight) {
        document.body.classList.add("scrolled");
    } else {
        document.body.classList.remove("scrolled");
    }
});

// 6. 戻るボタン
const button = document.querySelector('.page-top');

button.addEventListener('click', () => {
  window.scroll({ 
    top: 0, 
    behavior: "smooth"
  });
});

window.addEventListener('scroll', () => {
  if(window.scrollY > 100){
    button.classList.add('is-active');
  }else{
    button.classList.remove('is-active');
  }
});


// 7. WORKSナビ
document.addEventListener("DOMContentLoaded", () => {
    const menuLinks = document.querySelectorAll(".left-fixed-menu a");
    const sections = [];

    menuLinks.forEach(link => {
        const id = link.dataset.target;
        const section = document.getElementById(id);
        if (section) {
            sections.push({
                id: id,
                element: section
            });
        }
    });

    window.addEventListener("scroll", () => {
        let current = "";

        sections.forEach(sec => {
            const rect = sec.element.getBoundingClientRect();

            // 画面中央より少し上（150px）に入ったら active
            if (rect.top <= 150 && rect.bottom >= 150) {
                current = sec.id;
            }
        });

        menuLinks.forEach(link => {
            link.classList.remove("active");
            if (link.dataset.target === current) {
                link.classList.add("active");
            }
        });
    });
});

// 8. イラスト部分
document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll("#illust .fade-item");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, {
        threshold: 0.2
    });

    items.forEach(item => observer.observe(item));
});

// 9. お問い合わせで左ナビをフェードアウト
document.addEventListener("DOMContentLoaded", () => {
    const leftMenu = document.querySelector(".left-fixed-menu");
    const contactSection = document.getElementById("contact");

    if (!leftMenu || !contactSection) return;

    function toggleLeftMenu() {
        const rect = contactSection.getBoundingClientRect();

        if (rect.top < window.innerHeight * 0.3) {
            // お問い合わせセクションが画面の下 30% に入ったら消す
            leftMenu.classList.add("hide");
        } else {
            // 上に戻ったら表示
            leftMenu.classList.remove("hide");
        }
    }

    // 初回チェック
    toggleLeftMenu();

    // スクロールでチェック
    window.addEventListener("scroll", toggleLeftMenu);
    window.addEventListener("resize", toggleLeftMenu); // リサイズ時も安定
});

// 10. ハンバーガーメニュー
document.addEventListener("DOMContentLoaded", function () {

    // ▼ ハンバーガーメニュー
    const ham = document.querySelector(".hamburger");
    const nav = document.querySelector(".nav-wrapper");

    ham.addEventListener("click", () => {
        ham.classList.toggle("active");
        nav.classList.toggle("show");
    });

    // ▼ スマホでのサブメニュー開閉
    const hasSub = document.querySelector(".has-sub > a");
    const parentLi = document.querySelector(".has-sub");

    hasSub.addEventListener("click", (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault(); // ページ内リンクを止める
            parentLi.classList.toggle("open");
        }
    });

});