// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { message } = req.body;

    try {
        const response = await axios.post(
            "https://n8n.anodaz.online/webhook/demo-chatbot-sale",
            {
                headers: {
                    "Authorization": `Bearer ${`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJpYXQiOjE3NjUxODA4NjgsImV4cCI6MTc2NTM5Njg2OH0.lOu1YeIyBkJheB8TRBXk_8xp_Su60KvuqHKcbsJY-u8`}`,
                },
                message
            },
            { timeout: 120000 } // 120s (ปรับได้)
        );

        return res.status(200).json(response.data);

    } catch (error: any) {
        console.error("API ERROR:", error);

        return res.status(500).json({
            error: "AI request failed",
            detail: error?.response?.data || error.message,
        });
    }
}
