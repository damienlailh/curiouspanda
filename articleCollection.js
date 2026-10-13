// Reusable section listing: themes come from the visible badges on each card.
document.querySelectorAll('[data-article-collection]').forEach((collection) => {
    const search = collection.querySelector('[data-article-search]');
    const filters = collection.querySelector('[data-theme-filters]');
    const status = collection.querySelector('[data-collection-status]');
    const empty = collection.querySelector('[data-collection-empty]');
    const normalize = (value) => value.trim().toLowerCase().replace(/\s+/g, ' ');
    const articles = Array.from(collection.querySelectorAll('.article-grid .card')).map((card) => ({
        card,
        themes: Array.from(card.querySelectorAll('.article-theme')).map((badge) => badge.textContent.trim()),
        text: normalize(card.textContent)
    }));
    const primaryThemes = ['Social Commentary'];
    const availableThemes = [...new Set(articles.flatMap((article) => article.themes))];
    const themes = [
        ...primaryThemes.filter((theme) => availableThemes.includes(theme)),
        ...availableThemes.filter((theme) => !primaryThemes.includes(theme)).sort((a, b) => a.localeCompare(b))
    ];
    const selectedThemes = new Set();
    const buttons = new Map();

    const update = () => {
        const words = normalize(search.value).split(' ').filter(Boolean);
        let count = 0;
        articles.forEach((article) => {
            const matches = [...selectedThemes].every((theme) => article.themes.includes(theme))
                && words.every((word) => article.text.includes(word));
            article.card.hidden = !matches;
            if (matches) count += 1;
        });
        status.textContent = `${count} ${count === 1 ? 'article' : 'articles'} found`;
        empty.hidden = count !== 0;
        buttons.forEach((button, theme) => {
            button.setAttribute('aria-pressed', String(theme === null ? selectedThemes.size === 0 : selectedThemes.has(theme)));
        });
    };

    [...themes, null].forEach((theme) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = primaryThemes.includes(theme) ? 'theme-filter theme-filter-primary' : 'theme-filter';
        button.textContent = theme === null ? 'All themes' : theme;
        button.addEventListener('click', () => {
            if (theme === null) {
                selectedThemes.clear();
            } else if (selectedThemes.has(theme)) {
                selectedThemes.delete(theme);
            } else {
                selectedThemes.add(theme);
            }
            update();
        });
        buttons.set(theme, button);
        filters.append(button);
    });

    search.addEventListener('input', update);
    collection.querySelector('[data-collection-controls]').hidden = false;
    update();
});
