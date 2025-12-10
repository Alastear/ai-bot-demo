// components/Navbar.tsx
import {
  Box,
  Flex,
  Text,
  Spacer,
  Avatar,
  Grid,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { HamburgerIcon } from "@chakra-ui/icons";

const NavbarAI = () => {
  const router = useRouter();
  const path = router.pathname;

  // แปลง path → display name
  const pageMap: Record<string, string> = {
    "/": "Home",
    "/ai-chat": "AI Chat",
    "/schedule-meeting": "Schedule Meeting",
    "/meeting-management": "Meeting Management",
  };

  const pageName =
    pageMap[path] ||
    path.replace("/", "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Flex align="center" boxShadow="md">
      <Box
        mt={4}
        px={4}
        position="absolute"
        top={1}
        right={4}
        zIndex={1}
      >
        <Avatar name="Piriwit" size="sm" />
      </Box>
    </Flex>
  );
};

export default NavbarAI;
