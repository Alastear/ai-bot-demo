import {
    HStack,
    InputGroup,
    Input,
    InputRightElement,
    Button,
    Icon,
} from "@chakra-ui/react";
import { IoIosSend } from "react-icons/io";
import React, { useRef, useEffect } from "react";

interface ChatInputProps {
    input: string;
    setInput: (value: string) => void;
    sendMessage: () => void;
    isLoading: boolean;
    isWelcomeScreen: boolean;
    autoFocus?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
    input,
    setInput,
    sendMessage,
    isLoading,
    isWelcomeScreen,
    autoFocus,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // กัน input หลุด focus เวลาที่หน้า ChatScreen re-render
    useEffect(() => {
        if (!isWelcomeScreen && inputRef.current) {
            inputRef.current.focus();
        }
        // 👇 ใส่ dependency ว่าง เพื่อให้รันแค่ครั้งแรก
    }, []);

    return (
        <HStack w="full" spacing={3} mx="auto">
            <InputGroup size="lg">
                <Input
                    ref={inputRef}
                    placeholder="บอกความต้องการของคุณกับ AM AI 49 ได้เลย..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") sendMessage();
                    }}
                    _focus={{
                        boxShadow: "none",
                        borderColor: "transparent",
                    }}
                    border={0}
                    pr="4.5rem"
                    isDisabled={isLoading}

                    // ✔ ปรับ autoFocus ป้องกันหลุดโฟกัส
                    autoFocus={autoFocus}
                />
                <InputRightElement width="4.5rem">
                    <Button
                        borderRadius="full"
                        bg="white"
                        color="gray.500"
                        _hover={{ bg: "gray.100", color: "blue.600" }}
                        size="sm"
                        onClick={sendMessage}
                        isDisabled={isLoading || !input.trim()}
                        rightIcon={<Icon as={IoIosSend} w={5} h={5} />}
                    />
                </InputRightElement>
            </InputGroup>
        </HStack>
    );
};

export default React.memo(ChatInput);
