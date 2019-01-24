/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/**
 * @module GraphErrorHandler
 */
import { GraphError } from "./GraphError";
import { GraphRequestCallback } from "./IGraphRequestCallback";
/**
 * @class
 * Class for GraphErrorHandler
 */
export declare class GraphErrorHandler {
    /**
     * @private
     * @static
     * Populates the GraphError instance with Error instance values
     * @param {Error} error - The error returned by graph service or some native error
     * @param {number} [statusCode] - The status code of the response
     * @returns The GraphError instance
     */
    private static constructError;
    /**
     * @private
     * @static
     * Populates the GraphError instance from the Error returned by graph service
     * @param {any} error - The error returned by graph service or some native error
     * @param {number} statusCode - The status code of the response
     * @returns The GraphError instance
     *
     * Example error for https://graph.microsoft.com/v1.0/me/events?$top=3&$search=foo
     * {
     *      "error": {
     *          "code": "SearchEvents",
     *          "message": "The parameter $search is not currently supported on the Events resource.",
     *          "innerError": {
     *              "request-id": "b31c83fd-944c-4663-aa50-5d9ceb367e19",
     *              "date": "2016-11-17T18:37:45"
     *          }
     *      }
     *  }
     */
    private static constructErrorFromResponse;
    /**
     * @public
     * @static
     * To get the GraphError object
     * @param {any} [error = null] - The error returned by graph service or some native error
     * @param {number} [statusCode = -1] - The status code of the response
     * @param {GraphRequestCallback} [callback] - The graph request callback function
     * @returns The GraphError instance
     */
    static getError(error?: any, statusCode?: number, callback?: GraphRequestCallback): GraphError;
}
