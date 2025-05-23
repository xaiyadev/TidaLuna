import { type IncomingHttpHeaders, type IncomingMessage } from "http";
import type { Readable } from "stream";

import type { TidalManifest } from "@triton/lib";

import { requestStream, type ExtendedRequestOptions } from "./requestStream.native";

export type RequestProgress = { total: number; downloaded: number; percent: number };
type OnProgress = (progress: RequestProgress) => void;
export interface FetchyOptions {
	onProgress?: OnProgress;
	bytesWanted?: number;
	manifest?: TidalManifest;
	requestOptions?: ExtendedRequestOptions;
	poke?: true;
}

export const requestJson = <T>(...args: Parameters<typeof requestStream>) =>
	requestStream(...args)
		.then(rejectNotOk)
		.then(toJson<T>);

export const rejectNotOk = (res: IncomingMessage) => {
	const OK = res.statusCode !== undefined && res.statusCode >= 200 && res.statusCode < 300;
	if (!OK) throw new Error(`Status code is ${res.statusCode}`);
	return res;
};
export const toJson = <T>(res: IncomingMessage): Promise<T> => toBuffer(res).then((buffer) => JSON.parse(buffer.toString()));
export const toBuffer = (stream: Readable) =>
	new Promise<Buffer>((resolve, reject) => {
		const chunks: Buffer[] = [];
		stream.on("data", (chunk) => chunks.push(chunk));
		stream.on("end", () => resolve(Buffer.concat(chunks as unknown as Uint8Array[])));
		stream.on("error", reject);
	});
export const toBlob = (stream: Readable) =>
	new Promise<Blob>((resolve, reject) => {
		const chunks: Buffer[] = [];
		stream.on("data", (chunk) => chunks.push(chunk));
		stream.on("end", () => resolve(new Blob(chunks)));
		stream.on("error", reject);
	});

export const parseTotal = (headers: IncomingHttpHeaders) => {
	if (headers["content-range"]) {
		// Server supports byte range, parse total file size from header
		const match = /\/(\d+)$/.exec(headers["content-range"]);
		if (match) return parseInt(match[1], 10);
	} else {
		if (headers["content-length"] !== undefined) return parseInt(headers["content-length"], 10);
	}
	return -1;
};
