import * as z from "zod";

export const contactFormSchema = z.object({
	name: z.string().min(2, "Введите больше 1 символа"),
	phone: z
		.string()
		.regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, "Некорректный номер телефона"),
	contactMethod: z.string().min(1, "Выберите способ связи"),
	message: z.string().optional(),
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;
