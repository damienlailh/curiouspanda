(() => {
    const target = document.getElementById('footer');
    if (!target) return;

    // The loader lives in the site root, even when a page is nested several folders deep.
    const siteRoot = new URL('.', document.currentScript.src);
    fetch(new URL('components/footer.html', siteRoot))
        .then((response) => {
            if (!response.ok) throw new Error('Footer failed to load: ' + response.status);
            return response.text();
        })
        .then((html) => {
            const template = document.createElement('template');
            template.innerHTML = html;
            template.content.querySelectorAll('[href], [src]').forEach((element) => {
                ['href', 'src'].forEach((attribute) => {
                    const value = element.getAttribute(attribute);
                    if (value?.startsWith('/') && !value.startsWith('//')) {
                        element.setAttribute(attribute, new URL(value.slice(1), siteRoot).href);
                    }
                });
            });
            target.replaceChildren(template.content);
        })
        .catch((error) => console.error('Error loading footer:', error));
})();
