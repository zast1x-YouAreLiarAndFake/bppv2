interface HTMLScriptElement extends HTMLElement {
    async: boolean;
    src: string;
    tagName: string;
    textContent: string;
    type: string;
}

export default async function softRefresh() {
    document.open()
    let dom: Document = new DOMParser().parseFromString(await (await fetch(document.location.href)).text(), "text/html");
    const scripts = [...dom.head.getElementsByTagName("script")].map(x => x.cloneNode());
    [...dom.head.children].forEach(x => {
        if (x.tagName === "SCRIPT") x.remove();
    });
    document.write(dom.documentElement.innerHTML);
    document.close();
    for (let x of scripts) {
        let script = x as HTMLScriptElement;
        if (script.nodeType !== 1) continue;
        if (script.tagName !== "SCRIPT") continue;
        const code = await (await fetch(script.src)).text();
        const s = document.createElement("script");
        s.type = 'module';
        s.textContent = code;
        s.async = true;
        document.head.append(s);
    }
}