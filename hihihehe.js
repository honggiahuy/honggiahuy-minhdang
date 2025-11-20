
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

document.addEventListener('gesturechange', function (e) {
    e.preventDefault();
});

document.addEventListener('gestureend', function (e) {
    e.preventDefault();
});

// Ngăn double-tap zoom
let lastTouchEnd = 0;
document.addEventListener('touchend', function (e) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Ngăn pinch zoom
document.addEventListener('touchmove', function (e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

// Ngăn zoom bằng Ctrl + scroll (Desktop)
document.addEventListener('wheel', function (e) {
    if (e.ctrlKey) {
        e.preventDefault();
    }
}, { passive: false });

// Ngăn zoom bằng phím tắt (Desktop)
document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) &&
        (e.key === '+' || e.key === '-' || e.key === '0')) {
        e.preventDefault();
    }
});



const teachers = [
    { name: "Nguyễn Thị Bích Hồng", color: "#ff6b6b", orbitRadius: 160, size: 50, speed: 1, angle: 0, image: "./cuttedavatar/cropped-Nguyễn Thị Bích Hồng- Tổ Toán.png" },
    { name: "Nguyễn Thị Phương Thảo", color: "#4ecdc4", orbitRadius: 200, size: 47, speed: 0.8, angle: 51, image: "Nguyễn Thị Phương Thảo.png" },
    { name: "Trịnh Thu Vân", color: "#95e1d3", orbitRadius: 240, size: 49, speed: 0.6, angle: 103, image: "./cuttedavatar/cropped-Trịnh Thu Vân Toán.png" },
    { name: "Nguyễn Thu Trang", color: "#f38181", orbitRadius: 280, size: 52, speed: 0.5, angle: 154, image: "./cuttedavatar/cropped-Nguyễn Thu Trang Toán.png" },
    { name: "Phạm Thu Trang", color: "#a8e6cf", orbitRadius: 220, size: 90, speed: 0.9, angle: 206, image: "./cuttedavatar/cropped-Phạm Thu Trang Tổ TOÁN.png" },
    { name: "Đỗ Phương Anh", color: "#ffd93d", orbitRadius: 260, size: 54, speed: 0.7, angle: 257, image: "./picofteacher/Đỗ Phương Anh Tổ Toán.png" },
    { name: "Nguyễn Thị Hồng", color: "#c77dff", orbitRadius: 300, size: 56, speed: 0.4, angle: 309, image: "./cuttedavatar/Nguyễn Thị Hồng cropped Toán.png" }
];

let rotation = 0;
const planetsContainer = document.getElementById('planets');
let planetElements = [];

// Create stars
const starsContainer = document.getElementById('stars');
for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.width = (Math.random() * 3 + 1) + 'px';
    star.style.height = star.style.width;
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 10 + 's';
    star.style.animationDuration = (Math.random() * 5 + 5) + 's';
    starsContainer.appendChild(star);
}

function getPosition(orbitRadius, angle) {
    const radian = (angle * Math.PI) / 180;
    return {
        x: 400 + orbitRadius * Math.cos(radian),
        y: 400 + orbitRadius * Math.sin(radian)
    };
}

function initPlanets() {
    teachers.forEach(t => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
        const patternId = 'img-' + t.name.replace(/\s/g, '');
        pattern.setAttribute('id', patternId);
        pattern.setAttribute('width', '1');
        pattern.setAttribute('height', '1');
        pattern.setAttribute('patternUnits', 'objectBoundingBox');

        const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        image.setAttribute('href', t.image);
        image.setAttribute('width', t.size * 2);
        image.setAttribute('height', t.size * 2);
        image.setAttribute('preserveAspectRatio', 'xMidYMid slice');

        pattern.appendChild(image);
        defs.appendChild(pattern);
        g.appendChild(defs);

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', t.size);
        circle.setAttribute('fill', `url(#${patternId})`);
        circle.setAttribute('stroke', t.color);
        circle.setAttribute('stroke-width', '3');
        circle.classList.add('planet');
        circle.style.color = t.color;

        const labelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        labelGroup.classList.add('label-group');

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', '140');
        rect.setAttribute('height', '30');
        rect.setAttribute('fill', 'rgba(0,0,0,0.9)');
        rect.setAttribute('rx', '8');
        rect.style.filter = `drop-shadow(0 0 15px ${t.color})`;

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '14');
        text.setAttribute('font-weight', 'bold');
        text.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
        text.textContent = t.name;

        labelGroup.appendChild(rect);
        labelGroup.appendChild(text);

        g.appendChild(circle);
        g.appendChild(labelGroup);

        g.addEventListener('mouseenter', () => labelGroup.classList.add('show'));
        g.addEventListener('mouseleave', () => labelGroup.classList.remove('show'));

        planetsContainer.appendChild(g);

        planetElements.push({ teacher: t, circle, rect, text, labelGroup });
    });
}

function updatePlanets() {
    planetElements.forEach(({ teacher, circle, rect, text }) => {
        const pos = getPosition(teacher.orbitRadius, teacher.angle + rotation * teacher.speed);
        circle.setAttribute('cx', pos.x);
        circle.setAttribute('cy', pos.y);
        rect.setAttribute('x', pos.x - 70);
        rect.setAttribute('y', pos.y + teacher.size + 10);
        text.setAttribute('x', pos.x);
        text.setAttribute('y', pos.y + teacher.size + 30);
    });
}

function animate() {
    rotation = (rotation + 0.2) % 360;
    updatePlanets();
    requestAnimationFrame(animate);
}

initPlanets();
animate();
const teacherCards = document.querySelectorAll('.teacher-card');
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const teacherObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

teacherCards.forEach(card => teacherObserver.observe(card));
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, {
    threshold: 0.2
});

document.querySelectorAll('.card').forEach(card => {
    cardObserver.observe(card);
});
function go(monhoc) {
    window.location.href = "20thang11.html?monhoc=" + monhoc;
}

console.log('Trang đã tải xong - Ngày Nhà Giáo Việt Nam 20/11');
(function () {
    // Intersection Observer Options
    var leadershipObserverOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    // Observer for Header Animation
    var leadershipHeaderObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, leadershipObserverOptions);

    // Observe Header Element
    var leadershipHeader = document.getElementById('leadership-header');
    if (leadershipHeader) {
        leadershipHeaderObserver.observe(leadershipHeader);
    }

    // Observer for Card Animations
    var leadershipCardObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, leadershipObserverOptions);

    // Observe All Leadership Cards
    var leadershipCards = document.querySelectorAll('.leadership-card');
    leadershipCards.forEach(function (card) {
        leadershipCardObserver.observe(card);
    });
})();