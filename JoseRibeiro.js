/* =========================================================
   José Ribeiro — Portfolio interactions
   ========================================================= */

(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Theme ---------- */

    var root = document.documentElement;
    var themeToggle = document.getElementById('themeToggle');
    var storedTheme = null;

    try { storedTheme = localStorage.getItem('jr-theme'); } catch (e) { /* private mode */ }

    if (storedTheme === 'light' || storedTheme === 'dark') {
        root.setAttribute('data-theme', storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        root.setAttribute('data-theme', 'light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem('jr-theme', next); } catch (e) { /* ignore */ }
        });
    }

    /* ---------- Header, nav, scroll progress ---------- */

    var header = document.getElementById('siteHeader');
    var nav = document.getElementById('siteNav');
    var navToggle = document.getElementById('navToggle');
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
    var progressBar = document.querySelector('.scroll-progress span');
    var topBtn = document.getElementById('scrollToTopBtn');

    function closeNav() {
        if (!nav) return;
        nav.classList.remove('is-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }

    if (navToggle) {
        navToggle.addEventListener('click', function () {
            var open = nav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', closeNav);
    });

    function onScroll() {
        var y = window.pageYOffset || document.documentElement.scrollTop;

        if (header) header.classList.toggle('is-stuck', y > 20);
        if (topBtn) topBtn.classList.toggle('is-visible', y > 500);

        if (progressBar) {
            var max = document.documentElement.scrollHeight - window.innerHeight;
            var pct = max > 0 ? (y / max) * 100 : 0;
            progressBar.style.width = pct + '%';
        }
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
            onScroll();
            ticking = false;
        });
    }, { passive: true });
    onScroll();

    if (topBtn) {
        topBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    }

    /* ---------- Scroll spy ---------- */

    var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));

    if ('IntersectionObserver' in window && sections.length) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var id = entry.target.id;
                navLinks.forEach(function (link) {
                    link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

        sections.forEach(function (section) { spy.observe(section); });
    }

    /* ---------- Reveal on scroll ---------- */

    var revealItems = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
        var revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var siblings = Array.prototype.slice.call(entry.target.parentNode.children)
                    .filter(function (el) { return el.classList.contains('reveal'); });
                var index = siblings.indexOf(entry.target);
                entry.target.style.setProperty('--delay', Math.min(index, 6) * 80 + 'ms');
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

        revealItems.forEach(function (el) { revealObserver.observe(el); });
    }

    /* ---------- Hero: rotating role ---------- */

    var rotator = document.getElementById('roleRotator');
    var roles = ['Unity', 'Unreal Engine', 'AR / VR', 'Android & Kotlin', '3D & Games'];

    if (rotator) {
        if (reduceMotion) {
            rotator.textContent = roles.join(' · ');
        } else {
            var roleIndex = 0;
            var charIndex = 0;
            var deleting = false;

            var typeLoop = function () {
                var word = roles[roleIndex];
                charIndex += deleting ? -1 : 1;
                rotator.textContent = word.slice(0, charIndex);

                var delay = deleting ? 45 : 85;

                if (!deleting && charIndex === word.length) {
                    deleting = true;
                    delay = 1600;
                } else if (deleting && charIndex === 0) {
                    deleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    delay = 300;
                }

                window.setTimeout(typeLoop, delay);
            };

            window.setTimeout(typeLoop, 600);
        }
    }

    /* ---------- Hero: counters ---------- */

    var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));

    function runCounter(el) {
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var plain = el.getAttribute('data-plain') === 'true';

        if (reduceMotion) {
            el.textContent = plain ? String(target) : target + '+';
            return;
        }

        var duration = 1200;
        var start = null;

        var step = function (timestamp) {
            if (start === null) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var value = Math.round(target * eased);
            el.textContent = plain ? String(value) : value + (progress === 1 ? '+' : '');
            if (progress < 1) window.requestAnimationFrame(step);
        };

        window.requestAnimationFrame(step);
    }

    if (counters.length) {
        if ('IntersectionObserver' in window) {
            var counterObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    runCounter(entry.target);
                    observer.unobserve(entry.target);
                });
            }, { threshold: 0.5 });
            counters.forEach(function (el) { counterObserver.observe(el); });
        } else {
            counters.forEach(runCounter);
        }
    }

    /* ---------- Hero: particle canvas ---------- */

    var canvas = document.getElementById('heroCanvas');

    if (canvas && !reduceMotion) {
        var ctx = canvas.getContext('2d');
        var particles = [];
        var width = 0;
        var height = 0;
        var pointer = { x: -999, y: -999 };
        var rafId = null;
        var running = true;

        function accent() {
            return root.getAttribute('data-theme') === 'light'
                ? { r: 20, g: 151, b: 184 }
                : { r: 63, g: 208, b: 238 };
        }

        function resize() {
            var ratio = Math.min(window.devicePixelRatio || 1, 2);
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

            var count = Math.min(Math.round((width * height) / 16000), 90);
            particles = [];
            for (var i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.28,
                    vy: (Math.random() - 0.5) * 0.28,
                    r: Math.random() * 1.6 + 0.6
                });
            }
        }

        function draw() {
            if (!running) return;

            var c = accent();
            ctx.clearRect(0, 0, width, height);

            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',0.55)';
                ctx.fill();

                for (var j = i + 1; j < particles.length; j++) {
                    var q = particles[j];
                    var dx = p.x - q.x;
                    var dy = p.y - q.y;
                    var dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + (0.16 * (1 - dist / 130)) + ')';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }

                var mdx = p.x - pointer.x;
                var mdy = p.y - pointer.y;
                var mdist = Math.sqrt(mdx * mdx + mdy * mdy);

                if (mdist < 160) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(pointer.x, pointer.y);
                    ctx.strokeStyle = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + (0.28 * (1 - mdist / 160)) + ')';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            rafId = window.requestAnimationFrame(draw);
        }

        resize();
        draw();

        var resizeTimer = null;
        window.addEventListener('resize', function () {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(resize, 200);
        });

        canvas.parentNode.addEventListener('pointermove', function (event) {
            var rect = canvas.getBoundingClientRect();
            pointer.x = event.clientX - rect.left;
            pointer.y = event.clientY - rect.top;
        });
        canvas.parentNode.addEventListener('pointerleave', function () {
            pointer.x = -999;
            pointer.y = -999;
        });

        // Pause the animation when the hero is off screen or the tab is hidden.
        function setRunning(value) {
            if (value === running) return;
            running = value;
            if (running) {
                rafId = window.requestAnimationFrame(draw);
            } else if (rafId) {
                window.cancelAnimationFrame(rafId);
            }
        }

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                setRunning(entries[0].isIntersecting && !document.hidden);
            }, { threshold: 0 }).observe(canvas);
        }

        document.addEventListener('visibilitychange', function () {
            setRunning(!document.hidden);
        });
    }

    /* ---------- Project cards: spotlight + filters ---------- */

    var cards = Array.prototype.slice.call(document.querySelectorAll('.project-card'));

    cards.forEach(function (card) {
        card.addEventListener('pointermove', function (event) {
            var rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', (event.clientX - rect.left) + 'px');
            card.style.setProperty('--my', (event.clientY - rect.top) + 'px');
        });
    });

    var filters = document.getElementById('projectFilters');

    if (filters) {
        filters.addEventListener('click', function (event) {
            var button = event.target.closest('.chip');
            if (!button) return;

            var filter = button.getAttribute('data-filter');

            Array.prototype.forEach.call(filters.querySelectorAll('.chip'), function (chip) {
                chip.classList.toggle('is-active', chip === button);
            });

            cards.forEach(function (card) {
                var tags = (card.getAttribute('data-tags') || '').split(',');
                var match = filter === 'all' || tags.indexOf(filter) !== -1;
                card.classList.toggle('is-hidden', !match);
            });
        });
    }

    /* ---------- Project modal ---------- */

    var modal = document.getElementById('projectModal');
    var modalTitle = document.getElementById('modalTitle');
    var modalTags = document.getElementById('modalTags');
    var modalDesc = document.getElementById('modalDesc');
    var modalLink = document.getElementById('modalLink');
    var modalVideo = document.getElementById('modalVideo');
    var modalWatch = document.getElementById('modalWatch');
    var modalImage = document.getElementById('modalImage');
    var modalThumbs = document.getElementById('modalThumbs');
    var galleryCounter = document.getElementById('galleryCounter');
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.modal-tabs .tab'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('.tab-panel'));

    var gallery = [];
    var galleryIndex = 0;
    var lastFocused = null;

    function showTab(name) {
        tabs.forEach(function (tab) {
            tab.classList.toggle('is-active', tab.getAttribute('data-tab') === name);
        });
        panels.forEach(function (panel) {
            panel.classList.toggle('is-active', panel.getAttribute('data-panel') === name);
        });
    }

    function showImage(index) {
        if (!gallery.length) return;
        galleryIndex = (index + gallery.length) % gallery.length;
        modalImage.src = gallery[galleryIndex];
        galleryCounter.textContent = (galleryIndex + 1) + ' / ' + gallery.length;

        Array.prototype.forEach.call(modalThumbs.children, function (thumb, i) {
            thumb.classList.toggle('is-active', i === galleryIndex);
        });

        var active = modalThumbs.children[galleryIndex];
        if (active && active.scrollIntoView) {
            active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
    }

    function openModal(card) {
        if (!modal) return;

        lastFocused = document.activeElement;

        modalTitle.textContent = card.getAttribute('data-title') || '';

        modalTags.innerHTML = '';
        (card.getAttribute('data-tags') || '').split(',').forEach(function (tag) {
            if (!tag) return;
            var li = document.createElement('li');
            li.textContent = tag.trim();
            modalTags.appendChild(li);
        });

        var full = card.querySelector('.card-full');
        var desc = card.querySelector('.card-desc');
        modalDesc.innerHTML = full ? full.innerHTML : (desc ? '<p>' + desc.textContent + '</p>' : '');

        var link = card.getAttribute('data-link');
        if (link) {
            modalLink.href = link;
            modalLink.textContent = card.getAttribute('data-link-label') || 'Open link';
            modalLink.hidden = false;
        } else {
            modalLink.hidden = true;
        }

        var videoId = card.getAttribute('data-video');
        var videoTab = tabs.filter(function (t) { return t.getAttribute('data-tab') === 'video'; })[0];

        modalVideo.innerHTML = '';
        if (videoId) {
            var iframe = document.createElement('iframe');
            iframe.src = 'https://www.youtube.com/embed/' + videoId + '?rel=0';
            iframe.title = modalTitle.textContent + ' — video';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;
            modalVideo.appendChild(iframe);
            if (modalWatch) modalWatch.href = 'https://www.youtube.com/watch?v=' + videoId;
            if (videoTab) videoTab.hidden = false;
        } else if (videoTab) {
            videoTab.hidden = true;
        }

        try {
            gallery = JSON.parse(card.getAttribute('data-gallery') || '[]');
        } catch (e) {
            gallery = [];
        }

        modalThumbs.innerHTML = '';
        gallery.forEach(function (src, i) {
            var thumb = document.createElement('img');
            thumb.src = src;
            thumb.alt = 'Screenshot ' + (i + 1);
            thumb.loading = 'lazy';
            thumb.addEventListener('click', function () { showImage(i); });
            modalThumbs.appendChild(thumb);
        });

        showImage(0);
        showTab(videoId ? 'video' : 'gallery');

        modal.hidden = false;
        document.body.classList.add('no-scroll');
        modal.querySelector('.modal-close').focus();
    }

    function closeModal() {
        if (!modal || modal.hidden) return;
        modal.hidden = true;
        modalVideo.innerHTML = '';
        document.body.classList.remove('no-scroll');
        if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    cards.forEach(function (card) {
        card.addEventListener('click', function () { openModal(card); });
        card.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openModal(card);
            }
        });
    });

    if (modal) {
        modal.addEventListener('click', function (event) {
            if (event.target.hasAttribute('data-close')) closeModal();
        });

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () { showTab(tab.getAttribute('data-tab')); });
        });

        var prev = modal.querySelector('.gallery-nav.prev');
        var next = modal.querySelector('.gallery-nav.next');
        if (prev) prev.addEventListener('click', function () { showImage(galleryIndex - 1); });
        if (next) next.addEventListener('click', function () { showImage(galleryIndex + 1); });
    }

    /* ---------- Lightbox ---------- */

    var lightbox = document.getElementById('lightbox');
    var lightboxImage = document.getElementById('lightboxImage');
    var lightboxClose = document.getElementById('lightboxClose');

    if (modalImage && lightbox) {
        modalImage.addEventListener('click', function () {
            lightboxImage.src = modalImage.src;
            lightbox.hidden = false;
        });
        lightbox.addEventListener('click', function (event) {
            if (event.target === lightbox || event.target === lightboxClose) {
                lightbox.hidden = true;
            }
        });
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', function () { lightbox.hidden = true; });
    }

    /* ---------- Keyboard ---------- */

    document.addEventListener('keydown', function (event) {
        if (lightbox && !lightbox.hidden) {
            if (event.key === 'Escape') lightbox.hidden = true;
            return;
        }

        if (!modal || modal.hidden) return;

        if (event.key === 'Escape') {
            closeModal();
        } else if (event.key === 'ArrowRight') {
            showImage(galleryIndex + 1);
        } else if (event.key === 'ArrowLeft') {
            showImage(galleryIndex - 1);
        }
    });

    /* ---------- Footer year ---------- */

    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
})();
