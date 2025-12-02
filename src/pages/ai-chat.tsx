// pages/ai-chat.tsx
import {
  Box,
  Button,
  Flex,
  Input,
  VStack,
  HStack,
  Text,
  Icon,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { FaDownload } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import SidebarAI from "../components/SidebarAI";

interface Message {
  type?: "text" | "link"; // เพิ่ม type เพื่อตรวจสอบประเภทข้อความ
  role: "user" | "ai";
  text?: string;
  content: string; // เปลี่ยนเป็น content เพื่อความยืดหยุ่น
  id: string;
  fileName?: string; // เพิ่ม fileName สำหรับเก็บชื่อไฟล์เมื่อ type เป็น link
}

const uuid = () => crypto.randomUUID();

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]); // scroll ทุกครั้งที่ messages เปลี่ยน


  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");

    // user message bubble
    const userId = uuid();
    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", content: userMessage },
    ]);

    // thinking bubble
    const thinkingId = uuid();
    setMessages((prev) => [
      ...prev,
      { id: thinkingId, role: "ai", content: "กำลังประมวลผล..." },
    ]);

    try {
      // ❗ ไม่มี timeout — fetch จะรอไปเรื่อย ๆ
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      console.log('data', data);

      // 1. 🗑️ ลบ Thinking Bubble ออกก่อน
      setMessages(prev => prev.filter(m => m.id !== thinkingId));

      let replies: any[] = [];

      if (Array.isArray(data)) {
        // ถ้า data เป็น Array (มีหลายการตอบกลับ)
        replies = data;
      } else if (data.reply) {
        // ถ้า data เป็น Object ธรรมดาที่มี key 'reply' (ข้อความเดียว)
        replies = [{ type: "text", text: data.reply }];
      } else {
        // ไม่มีข้อมูลตอบกลับที่ถูกต้อง
        replies = [{ type: "text", text: "AI ไม่มีข้อความตอบกลับ" }];
      }

      // 2. ➕ เพิ่มข้อความทั้งหมดเข้าใน state
      setMessages(prev => {
        const newMessages: Message[] = replies.map(replyData => ({
          id: uuid(), // สร้าง ID ใหม่สำหรับแต่ละข้อความ
          role: "ai",
          content: replyData.url || replyData.text || "",
          type: replyData.type || "text",
          fileName: replyData.fileName,
        }));

        return [...prev, ...newMessages];
      });

    } catch (err) {
      console.error("AI fetch error:", err);

      // 3. ⚠️ จัดการข้อผิดพลาด: แทนที่ Thinking Bubble ด้วยข้อความ Error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === thinkingId
            ? { ...msg, content: "เกิดข้อผิดพลาดในการเชื่อมต่อ AI", type: "text" }
            : msg
        )
      );
    }
  };

  // *** 💡 ฟังก์ชัน Download Helper ***
  const handleDownload = (url: string, fileName: string) => {
    // ในแอปพลิเคชันจริง คุณอาจจะต้องใช้ fetch หรือสร้าง <a> element 
    // และ trigger click เพื่อจัดการ CORS หรือการดาวน์โหลดไฟล์อย่างถูกต้อง

    // สำหรับตัวอย่างนี้ เราจะใช้การเปิดหน้าต่างใหม่เพื่อ trigger download
    window.open(url, '_blank');

    // ถ้าต้องการให้ดาวน์โหลดทันทีโดยเปลี่ยนชื่อไฟล์ คุณอาจต้องใช้ไลบรารีหรือเทคนิคที่ซับซ้อนกว่า
    console.log(`Attempting to download ${fileName} from ${url}`);
  };

  return (
    <Box>
      <Navbar />
      <Flex>
        <SidebarAI />

        <Flex
          flex="1"
          direction="column"
          p={6}
          // 👇 เปลี่ยนเป็น h เพื่อกำหนดความสูงแน่นอน
          h="calc(100vh - 64px)" // 100vh - ความสูงของ Navbar (สมมติ 64px)
          position="relative" // เพื่อให้ Box ของ input bar วางตำแหน่งได้ง่าย
        >
          {/* Chat container */}
          <Box
            ref={chatContainerRef}
            flex="1" // ขยายเต็มพื้นที่ที่เหลือ
            overflowY="auto"
            mb={4}
            p={4}
            bg="gray.50"
            borderRadius="md"
            boxShadow="sm"
          >
            <VStack spacing={4} align="stretch">
              {messages.map((msg: Message) => { // 👈 ใช้ Message interface ที่ปรับปรุงแล้ว

                // 3. 🖼️ สร้าง Component สำหรับ Link/Download
                if (msg.role === "ai" && msg.type === "link") {
                  const url = msg.content;
                  // const displayFileName = msg.fileName || url.substring(url.lastIndexOf('/') + 1) || "ไฟล์ดาวน์โหลด";
                  const getCleanFileName = (url: string, fallbackName: string): string => {
                    // 1. หาตำแหน่งสุดท้ายของ '/' เพื่อแยกเอาส่วนชื่อไฟล์ออกมา
                    let fileNamePart = url.substring(url.lastIndexOf('/') + 1);

                    // 2. หาตำแหน่งของ '?' (query string)
                    const queryIndex = fileNamePart.indexOf('?');

                    if (queryIndex !== -1) {
                      // 3. ถ้าเจอ '?' ให้ตัด query string ออก
                      fileNamePart = fileNamePart.substring(0, queryIndex);
                    }

                    // 4. ถ้าชื่อไฟล์ยังคงมี query string (เช่น "?filename=") 
                    //    เราจะลองดึงชื่อไฟล์จากพารามิเตอร์ query แทน
                    if (url.includes('?filename=')) {
                      try {
                        const urlObj = new URL(url);
                        // ดึงค่าของพารามิเตอร์ 'filename'
                        const filenameParam = urlObj.searchParams.get('filename');

                        if (filenameParam) {
                          // 5. ใช้ decodeURIComponent เพื่อแปลง %20 เป็น space และจัดการ encoding อื่น ๆ
                          return decodeURIComponent(filenameParam);
                        }
                      } catch (e) {
                        console.error("Invalid URL format:", e);
                      }
                    }

                    // 5. ถ้าชื่อไฟล์ที่ได้ยังเป็นค่าว่าง หรือไม่ตรงตามที่ต้องการ ให้ใช้ decodeURIComponent และ fallback
                    if (fileNamePart) {
                      return decodeURIComponent(fileNamePart);
                    }

                    return fallbackName;
                  };
                  const displayFileName = getCleanFileName(url, "ไฟล์ดาวน์โหลด");
                  return (
                    <Box
                      key={msg.id}
                      alignSelf="flex-start"
                      bg="gray.100" // พื้นหลังสำหรับกล่อง link พิเศษ
                      px={4}
                      py={3}
                      borderRadius="lg"
                      maxW="70%"
                      boxShadow="md"
                    >
                      <Text mb={2} fontWeight="bold" color="blue.700">
                        {displayFileName}
                      </Text>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        w="full"
                        leftIcon={<Icon as={FaDownload} />}
                        onClick={() => handleDownload(url, displayFileName)}
                      >
                        ดาวน์โหลด
                      </Button>
                    </Box>
                  );
                }

                // 4. 💬 ข้อความธรรมดา (Text Bubble)
                return (
                  <Box
                    key={msg.id}
                    alignSelf={msg.role === "user" ? "flex-end" : "flex-start"}
                    bg={msg.role === "user" ? "blue.800" : "gray.200"}
                    color={msg.role === "user" ? "white" : "black"}
                    px={4}
                    py={2}
                    borderRadius="md"
                    maxW="70%"
                    whiteSpace="pre-wrap"
                    wordBreak="break-word"
                  >
                    {/* ลบ logic เก่าที่จัดการ link ในข้อความธรรมดาออก */}
                    {msg.content}
                  </Box>
                );
              })}
            </VStack>
          </Box>

          {/* Input bar ติดด้านล่าง */}
          <Box>
            <HStack>
              <Input
                placeholder="พิมพ์ข้อความ..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
              <Button bgGradient="linear(to-r, blue.800, purple.600)" _hover={{ bgGradient: "linear(to-r, blue.600, purple.400)" }} textColor="white" onClick={sendMessage}>
                ส่ง
              </Button>
            </HStack>
          </Box>
        </Flex>

      </Flex>
    </Box >
  );
}
