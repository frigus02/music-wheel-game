function prepareTemplate(elementName, template) {
    if (window.ShadyCSS) {
        ShadyCSS.prepareTemplate(template, elementName);
    }

    return template;
}

function html(strings, ...values) {
    const content = `
        <template>
            ${String.raw(strings, ...values)}
        </template>
    `;
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    return doc.head.firstChild;
}

export { html, prepareTemplate };
