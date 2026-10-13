(() => {
    const banner = document.querySelector('.chinese-section [data-chinese-daily-title]');
    const titleLink = banner?.querySelector('[data-daily-title-link]');
    if (!titleLink) return;

    const storageKey = 'curiouspanda.chinese.daily-title.v1';
    const siteRoot = new URL('../', document.currentScript.src);
    const listingUrl = new URL('chinese.html', siteRoot);
    const articlePrefix = new URL('Chinese/', siteRoot).pathname;

    const localDay = () => {
        const now = new Date();
        return [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, '0'),
            String(now.getDate()).padStart(2, '0')
        ].join('-');
    };

    const collectTitles = (source) => {
        const entries = new Map();
        source.querySelectorAll('[data-chinese-collection] .article-grid .card h2 a').forEach((link) => {
            const title = link.textContent.trim();
            const href = link.getAttribute('href');
            if (!title || !href) return;
            try {
                const url = new URL(href, listingUrl);
                if (url.origin !== listingUrl.origin || !url.pathname.startsWith(articlePrefix)
                    || !url.pathname.endsWith('.html')) return;
                entries.set(url.pathname, { title, href: url.pathname });
            } catch {
                // Ignore an incomplete card while it is being edited.
            }
        });
        return [...entries.values()];
    };

    const getTitles = async () => {
        if (document.querySelector('[data-chinese-collection]')) {
            return collectTitles(document);
        }
        const response = await fetch(listingUrl.href);
        if (!response.ok) throw new Error('Chinese article list unavailable');
        const source = new DOMParser().parseFromString(await response.text(), 'text/html');
        return collectTitles(source);
    };

    // A stable daily fallback also works with browser storage disabled.
    const fallbackTitle = (titles, day) => {
        const hash = [...day].reduce((value, character) => (
            (Math.imul(value, 31) + character.charCodeAt(0)) >>> 0
        ), 0);
        return titles[hash % titles.length];
    };

    const chooseTitle = (titles, day) => {
        try {
            let saved = null;
            try {
                saved = JSON.parse(localStorage.getItem(storageKey));
            } catch {
                // A damaged saved value can be replaced with a fresh choice.
            }
            const previous = saved?.day === day
                ? titles.find((entry) => entry.href === saved.href)
                : null;
            if (previous) return previous;

            const selected = titles[Math.floor(Math.random() * titles.length)];
            localStorage.setItem(storageKey, JSON.stringify({ day, href: selected.href }));
            return selected;
        } catch {
            return fallbackTitle(titles, day);
        }
    };

    getTitles().then((titles) => {
        if (!titles.length) return; // Keep the readable static banner as a fallback.

        let midnightTimer;
        const refresh = () => {
            const selected = chooseTitle(titles, localDay());
            titleLink.textContent = selected.title;
            titleLink.setAttribute('href', selected.href);

            clearTimeout(midnightTimer);
            const now = new Date();
            const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            midnightTimer = setTimeout(refresh, midnight.getTime() - now.getTime() + 100);
        };

        refresh();
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) refresh();
        });
    }).catch(() => {
        // The static linked title remains usable if the article list cannot load.
    });
})();
