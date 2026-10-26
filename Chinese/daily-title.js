(() => {
    const banner = document.querySelector('.chinese-section [data-chinese-daily-title]');
    const titleLink = banner?.querySelector('[data-daily-title-link]');
    if (!titleLink) return;

    const storageKey = 'curiouspanda.chinese.last-title.v1';
    const siteRoot = new URL('../', document.currentScript.src);
    const listingUrl = new URL('chinese.html', siteRoot);
    const articlePrefix = new URL('Chinese/', siteRoot).pathname;

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

    const chooseTitle = (titles) => {
        let previous = null;
        try {
            previous = sessionStorage.getItem(storageKey);
        } catch {
            // Random selection still works when browser storage is unavailable.
        }

        // Avoid repeating the previous title on a reload when another is available.
        const alternatives = titles.filter((entry) => entry.href !== previous);
        const choices = alternatives.length ? alternatives : titles;
        const selected = choices[Math.floor(Math.random() * choices.length)];

        try {
            sessionStorage.setItem(storageKey, selected.href);
        } catch {
            // Storage is optional; keep the selected title even if it cannot be saved.
        }
        return selected;
    };

    getTitles().then((titles) => {
        if (!titles.length) return; // Keep the readable static banner as a fallback.

        const selected = chooseTitle(titles);
        // Spaces in a title mark explicit line breaks in the quote banner.
        const lines = selected.title.split(/\s+/);
        titleLink.textContent = lines.join('\n');
        titleLink.classList.toggle('chinese-daily-title-multiline', lines.length > 1);
        titleLink.setAttribute('href', selected.href);
    }).catch(() => {
        // The static linked title remains usable if the article list cannot load.
    });
})();
