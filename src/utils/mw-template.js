function parseTemplate(elementName, content) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const template = doc.head.firstChild;
    if (window.ShadyCSS) {
        ShadyCSS.prepareTemplate(template, elementName);
    }

    return template;
}

export { parseTemplate };
