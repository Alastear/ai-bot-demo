import { Text } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTypewriter } from "@/hooks/useTypewriter";

type Props = {
    content: string;
};

export default function AITypingMessage({ content }: Props) {
    const { displayed, done } = useTypewriter(content, 10);

    // ⏳ ระหว่างพิมพ์ → text ธรรมดา
    if (!done) {
        return (
            <Text whiteSpace="pre-wrap">
                {displayed}
                <span className="cursor">▍</span>
            </Text>
        );
    }

    // ✅ พิมพ์เสร็จ → render markdown เต็มรูปแบบ
    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
        </ReactMarkdown>
    );
}
