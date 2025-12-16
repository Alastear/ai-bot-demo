export type MarkdownBlock =
    | { type: "text"; content: string }
    | { type: "table"; content: string };

export function splitMarkdown(md: string): MarkdownBlock[] {
    const lines = md.split("\n");
    const blocks: MarkdownBlock[] = [];

    let buffer: string[] = [];
    let inTable = false;

    const flushText = () => {
        if (buffer.length) {
            blocks.push({
                type: "text",
                content: buffer.join("\n").trim(),
            });
            buffer = [];
        }
    };

    for (const line of lines) {
        const isTableLine =
            line.trim().startsWith("|") &&
            line.includes("|");

        if (isTableLine) {
            if (!inTable) {
                flushText();
                inTable = true;
            }
            buffer.push(line);
        } else {
            if (inTable) {
                blocks.push({
                    type: "table",
                    content: buffer.join("\n"),
                });
                buffer = [];
                inTable = false;
            }
            buffer.push(line);
        }
    }

    if (buffer.length) {
        blocks.push({
            type: inTable ? "table" : "text",
            content: buffer.join("\n"),
        });
    }

    return blocks.filter(b => b.content.trim());
}
