import { Box, VStack, Text, Select, Button, Divider, Flex, Image, Spacer } from "@chakra-ui/react";
import { IoCalendarOutline } from "react-icons/io5";
import { RiRobot3Line } from "react-icons/ri";
import { BiHome } from "react-icons/bi";
import { useRouter } from "next/router";
const SidebarAI = () => {
    // Mock AI models
    const router = useRouter();
    const aiModels = ["General AI", "HR Care", "Product Expert", "Market Expert"];

    // Mock chat history
    const chatHistory = [
        { id: 1, title: "Chat 1", snippet: "สอบถามเรื่องทั่วไป..." },
        { id: 2, title: "Chat 2", snippet: "จัดการพนักงาน..." },
        { id: 3, title: "Chat 3", snippet: "คำแนะนำผลิตภัณฑ์..." },
    ];

    return (
        <Box
            w={{ base: "full", md: "50px" }}
            bg={"#2254C526"}
            pt={4}
            minH="calc(100vh - 64px)"
            boxShadow="2px 0 5px rgba(0, 0, 0, 0.4)"
        >
            {/* 💡 เปลี่ยน VStack เป็น Flex container หลัก และกำหนด direction="column" */}
            <Flex direction="column" h="calc(100vh - 64px)">

                {/* 1. โลโก้ (อยู่ด้านบน) */}
                <Flex
                    align="center"
                    justifyContent="center"
                >
                    <Image
                        src="/amai-icon.png"
                        alt="AM AI Logo"
                        boxSize="30px"
                        maxH="30px"
                        mb={4}
                    />
                </Flex>
                
                {/* 2. Spacer (ดันไอคอนไปอยู่กึ่งกลาง/ล่าง) */}
                <Spacer />
                
                {/* 3. ไอคอน (อยู่กลางจอตามแนวตั้ง) */}
                <VStack
                    // flex="1" ถูกเอาออก และใช้ Spacer แทน
                    align="center" // จัดให้อยู่ตรงกลางตามแนวนอน
                    justifyContent="center" // ไม่จำเป็นต้องใช้ เพราะใช้ Spacer จัดตำแหน่งแล้ว
                    mb={4}
                    gap={2}
                    direction="column"
                    // h={"100%"} ถูกเอาออก เพื่อให้ Spacer ทำงาน
                >
                    <Box
                        p={2}
                        transition="all 0.2s ease-in-out"
                        rounded={"full"}
                        cursor={"pointer"}
                        onClick={() => router.push("/")}
                        _hover={{
                            transform: "translateY(-1px)",
                            bg: "white",
                            dropShadow: "0 4px 20px 0 rgba(59, 130, 246, 0.4)",
                        }}
                    >
                        <BiHome
                            size={24}
                            color="#5D5D5D"
                        />
                    </Box>
                    <Box
                        p={2}
                        transition="all 0.2s ease-in-out"
                        rounded={"full"}
                        cursor={"pointer"}
                        onClick={() => router.push("/ai-assistant")}
                        _hover={{
                            transform: "translateY(-1px)",
                            bg: "white",
                            dropShadow: "0 4px 20px 0 rgba(59, 130, 246, 0.4)",
                        }}
                    >
                        <RiRobot3Line
                            size={24}
                            color="#5D5D5D"
                        />
                    </Box>
                    <Box
                        p={2}
                        transition="all 0.2s ease-in-out"
                        rounded={"full"}
                        cursor={"pointer"}
                        onClick={() => router.push("/meeting-management")}
                        _hover={{
                            transform: "translateY(-1px)",
                            bg: "white",
                            dropShadow: "0 4px 20px 0 rgba(59, 130, 246, 0.4)",
                        }}
                    >
                        <IoCalendarOutline
                            size={24}
                            color="#5D5D5D"
                        />
                    </Box>

                </VStack>
                
                {/* 4. Spacer (ดันไอคอนที่อยู่ตรงกลางขึ้นไปอยู่ตรงกลางจริงๆ) */}
                <Spacer />

            </Flex>
        </Box>
    );
};

export default SidebarAI;