export const prerender = false;

import type { APIRoute } from "astro";
import { ZodError } from "astro/zod";
import { contactFormSchema } from "../../lib/schemas/contact";

export const POST: APIRoute = async ({ request }) => {
	try {
		const formData = await request.formData();
		const data = {
			name: formData.get("name"),
			phone: formData.get("phone"),
			contactMethod: formData.get("contact_method"),
			message: formData.get("message"),
		};

		await contactFormSchema.parseAsync(data);

		const text = `
✨ <b>Новая заявка с сайта</b>

<b>👤 Имя</b> — <code>${data.name}</code>

<b>📞 Телефон</b> — ${data.phone}

<b>📱 Способ связи</b> — ${data.contactMethod}

<b>💬 Сообщение</b>
<blockquote>${data.message || "—"}</blockquote>

<i>⏱ ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}</i>
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
				text,
				parse_mode: "HTML",
			}),
		});

		if (!response.ok) throw new Error("Ошибка отправки в Telegram");

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error: any) {
		if (error instanceof ZodError)
			return new Response(JSON.stringify(error.issues), { status: 400 });

		return new Response(JSON.stringify({ error: error.message || error }), {
			status: 500,
		});
	}
};
