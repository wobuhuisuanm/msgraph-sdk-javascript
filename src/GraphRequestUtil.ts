/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module GraphRequestUtil
 */

/**
 * To hold list of OData query params
 */
export const oDataQueryNames = ["$select", "$expand", "$orderby", "$filter", "$top", "$skip", "$skipToken", "$count"];

/**
 * To construct the URL by appending the segments with "/"
 * @param {string[]} urlSegments - The array of strings
 * @returns The constructed URL string
 */
export const urlJoin = (urlSegments: string[]): string => {
	const removePostSlash = (s) => s.replace(/\/+$/, "");
	const removePreSlash = (s) => s.replace(/^\/+/, "");
	const joiner = (pre, cur) => [removePostSlash(pre), removePreSlash(cur)].join("/");
	const parts = Array.prototype.slice.call(urlSegments);
	return parts.reduce(joiner);
};

/**
 * Serializes the content
 * @param {any} content - The content value that needs to be serialized
 * @returns The serialized content
 *
 * Note:
 * This conversion is required due to the following reasons:
 * Body parameter of Request method of isomorphic-fetch only accepts Blob, ArrayBuffer, FormData, TypedArrays string.
 * Node.js platform does not support Blob, FormData. Javascript File object inherits from Blob so it is also not supported in node. Therefore content of type Blob, File, FormData will only come from browsers.
 * Parallel to ArrayBuffer in javascript, node provides Buffer interface. Node's Buffer is able to send the arbitrary binary data to the server successfully for both Browser and Node platform. Whereas sending binary data via ArrayBuffer or TypedArrays was only possible using Browser. To support both Node and Browser, `serializeContent` converts TypedArrays or ArrayBuffer to `Node Buffer`.
 * If the data received is in JSON format, `serializeContent` converts the JSON to string.
 */

export const serializeContent = (content: any): any => {
	const className: string = content.constructor.name;
	if (className === "Buffer" || className === "Blob" || className === "File" || className === "FormData" || typeof content === "string") {
		return content;
	}
	if (className === "ArrayBuffer") {
		content = Buffer.from(content);
	} else if (className === "Int8Array" || className === "Int16Array" || className === "Int32Array" || className === "Uint8Array" || className === "Uint16Array" || className === "Uint32Array" || className === "Uint8ClampedArray" || className === "Float32Array" || className === "Float64Array" || className === "DataView") {
		content = Buffer.from(content.buffer);
	} else {
		try {
			content = JSON.stringify(content);
		} catch (error) {
			throw new Error("Unable to stringify the content");
		}
	}
	return content;
};

export class PathUtils {
	private static hostRe = /([a-z]+.microsoft.[a-z]+)/g;
	private static versionRe = /(beta|v1.0)/g;
	private static fullPathRe = /((v1.0|beta).*?(?=\?|$))/g;
	private static shortPathRe = /(.*?)((?=\?|$))/g;
	private static queryRe = /\?.*/g;

	public static getHostFrom(url: string): string {
		const host = url.match(PathUtils.hostRe);

		if (!host) {
			return "graph.microsoft.com";
		}

		return host.shift();
	}

	public static getVersionFrom(url: string): string {
		const version = url.match(PathUtils.versionRe);

		if (!version) {
			return "v1.0";
		}

		return version.shift();
	}

	public static getPathFrom(url: string) {
		const isFullPath: boolean = url.includes("microsoft");

		if (isFullPath) {
			return PathUtils.getPathFromFullPath(url);
		} else {
			return PathUtils.getPathFromShortPath(url);
		}
	}

	public static getPathFromFullPath(url: string): string {
		const version = PathUtils.getVersionFrom(url);
		const path = url.match(PathUtils.fullPathRe);
		if (!path) {
			return;
		}

		return path.shift().replace(version, "");
	}

	public static getPathFromShortPath(url: string) {
		const path = url.match(PathUtils.shortPathRe);

		if (!path) {
			return;
		}

		return path.shift();
	}

	public static getQueryStringFrom(url: string): string {
		const queryString = url.match(PathUtils.queryRe);

		if (!queryString) {
			return;
		}
		return queryString.shift().replace("?", "");
	}
}
