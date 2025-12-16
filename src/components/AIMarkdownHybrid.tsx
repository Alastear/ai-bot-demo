import { Text } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { splitMarkdown } from "@/utils/splitMarkdown";
import { useTypewriter } from "@/hooks/useTypewriter";

type Props = {
    content: string;
};

export default function AIMarkdownHybrid({ content }: Props) {
    const blocks = splitMarkdown(content);

    return (
        <>
            {blocks.map((block, i) => {
                if (block.type === "table") {
                    // ✅ ตาราง render ทีเดียว
                    return (
                        <ReactMarkdown key={i} remarkPlugins={[remarkGfm]}>
                            {block.content}
                        </ReactMarkdown>
                    );
                }

                // ✍️ text → typing
                return <TypingText key={i} text={block.content} />;
            })}
        </>
    );
}

function TypingText({ text }: { text: string }) {
    const { displayed, done } = useTypewriter(text, 12);

    return (
        <Text whiteSpace="pre-wrap">
            {displayed}
            {!done && "▍"}
        </Text>
    );
}
