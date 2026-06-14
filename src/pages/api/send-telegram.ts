export const prerender = false;

import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
	try {
		const formData = await request.formData();
		const name = formData.get("name");
		const phone = formData.get("phone");
		const message = formData.get("message");

		const text = `
🆕 **Новая заявка с сайта!**
👤 **Имя:** ${name}
📞 **Телефон:** ${phone}
💬 **Сообщение:** ${message}
    `.trim();

		const token = import.meta.env.TELEGRAM_BOT_TOKEN;
		const chatId = import.meta.env.TELEGRAM_CHAT_ID;

		if (!token || !chatId) {
			return new Response(
				JSON.stringify({ error: "Сервер не настроен (нет токенов)" }),
				{ status: 500 },
			);
		}

		const url = `https://api.telegram.org/bot${token}/sendMessage`;

		const response = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				chat_id: chatId,
				text: text,
				parse_mode: "Markdown",
			}),
		});

		if (!response.ok) throw new Error("Ошибка отправки в Telegram");

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error: any) {
		return new Response(JSON.stringify({ error: error.message || error }), {
			status: 500,
		});
	}
};
