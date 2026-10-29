(() => {
    const library = document.querySelector('[data-chemistry-library]');
    if (!library) return;

    const search = library.querySelector('#chemistry-search');
    const count = library.querySelector('[data-chemistry-count]');
    const empty = library.querySelector('[data-chemistry-empty]');
    const normalize = (value) => value.toLowerCase().replace(/[\u2010-\u2015-]/g, ' ').replace(/\s+/g, ' ').trim();
    const topics = Array.from(library.querySelectorAll('.chemistry-card')).map((card) => ({
        card,
        text: normalize(`${card.querySelector('h2').textContent} ${card.querySelector('.chemistry-description').textContent} ${card.dataset.searchKeywords || ''}`)
    }));

    const update = () => {
        const words = normalize(search.value).split(' ').filter(Boolean);
        let visible = 0;
        topics.forEach(({ card, text }) => {
            card.hidden = !words.every((word) => text.includes(word));
            if (!card.hidden) visible += 1;
        });
        count.textContent = `${visible} ${visible === 1 ? 'topic' : 'topics'}`;
        empty.hidden = visible !== 0;
    };

    // Blank PDF paths are safe placeholders. Filling in href enables a resource
    // on the next page load, with no other attributes or code to update.
    library.querySelectorAll('.chemistry-download').forEach((link) => {
        if (!link.getAttribute('href')?.trim()) {
            link.setAttribute('aria-disabled', 'true');
            link.setAttribute('tabindex', '-1');
        }
        link.addEventListener('click', (event) => {
            if (!link.getAttribute('href')?.trim()) event.preventDefault();
        });
    });

    search.addEventListener('input', update);
    library.querySelector('[data-chemistry-reset]').addEventListener('click', () => {
        search.value = '';
        update();
        search.focus();
    });
    library.querySelector('[data-chemistry-controls]').hidden = false;
    update();
})();
