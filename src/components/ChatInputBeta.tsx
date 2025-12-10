import {
    HStack,
    InputGroup,
    Input,
    InputRightElement,
    Button,
    Icon
} from "@chakra-ui/react";
import { IoIosSend } from "react-icons/io";
import React, { useEffect, useState, useCallback } from "react";

interface ChatInputProps {
    inputRef: React.RefObject<HTMLInputElement | null>;  // <<— แก้ตรงนี้
    onSend: (text: string) => void;
    isLoading?: boolean;
    isWelcomeScreen?: boolean;
    autoFocus?: boolean;
}

const ChatInputBeta: React.FC<ChatInputProps> = ({
    inputRef,
    onSend,
    isLoading = false,
    autoFocus = false
}) => {

    const [localText, setLocalText] = useState("");

    // auto focus เมื่อหน้า mount (ครั้งแรกเท่านั้น)
    useEffect(() => {
        if (autoFocus && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [autoFocus, inputRef]);

    const handleSend = useCallback(() => {
        const t = localText.trim();
        if (!t || isLoading) return;
        onSend(t);
        setLocalText("");
    }, [localText, isLoading, onSend]);

    return (
        <HStack w="full" spacing={3} mx="auto">
            <InputGroup size="lg">
                <Input
                    ref={inputRef}  // <<--- ใช้ inputRef ที่ส่งมาจากพาเรนต์
                    placeholder="บอกความต้องการของคุณกับ AM AI 49 ได้เลย..."
                    value={localText}
                    onChange={(e) => setLocalText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                    }}
                    _focus={{
                        boxShadow: "none",
                        borderColor: "transparent"
                    }}
                    border={0}
                    pr="4.5rem"
                    isDisabled={isLoading}
                    autoFocus={false}  // <<--- ปิด autoFocus ในตัว input
                />
                <InputRightElement width="4.5rem">
                    <Button
                        borderRadius="full"
                        bg="white"
                        color="gray.500"
                        _hover={{ bg: "gray.100", color: "blue.600" }}
                        size="sm"
                        onClick={handleSend}
                        isDisabled={isLoading || !localText.trim()}
                        rightIcon={<Icon as={IoIosSend} w={5} h={5} />}
                    />
                </InputRightElement>
            </InputGroup>
        </HStack>
    );
};

export default React.memo(ChatInputBeta);
