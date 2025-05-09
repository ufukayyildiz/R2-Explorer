import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import type { AppContext } from "../../types";

export class DeleteObject extends OpenAPIRoute {
	schema = {
		operationId: "post-bucket-delete-object",
		tags: ["Buckets"],
		summary: "Delete object",
		request: {
			params: z.object({
				bucket: z.string(),
			}),
			body: {
				content: {
					"application/json": {
						schema: z.object({
							key: z.string().describe("base64 encoded file key"),
						}),
					},
				},
			},
		},
	};

	async handle(c: AppContext) {
		const data = await this.getValidatedData<typeof this.schema>();

		const bucket = c.env[data.params.bucket];
		const key = decodeURIComponent(escape(atob(data.body.key)));

		await bucket.delete(key);

		return { success: true };
	}
}
