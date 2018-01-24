---
title: Handle Large Messages in Logic Apps | Microsoft Docs
description: Methods for handling large message sizes with logic apps.
services: logic-apps
documentationcenter: .net,nodejs,java
author: shhurst
manager: bshyam
editor: ''

ms.assetid: e50ab2f2-1fdc-4d2a-be40-995a6cc5a0d4
ms.service: logic-apps
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: integration
ms.date: 1/17/2018
ms.author: LADocs; shhurst

---
# Handle Large Messages in Logic Apps

Logic Apps limits the maximum size of the messages that it can handle. In situations where a message contains content that is outside of these limits, Logic Apps can allow the message content to be transferred using chunking. See [Logic Apps limits and configuration](../logic-apps/logic-apps-limits-and-config.md) for more information on the message size limitations within Logic Apps.

## Content Transfer using Chunking

Logic Apps supports the concept of chunking as a solution for handling large messages. Chunking content means that instead of sending a single HTTP message, that message is split or **chunked** into multiple smaller HTTP messages. This method of chunking allows you to handle large files with Logic Apps under certain circumstances.

Chunking can be used to either split up the download or upload of large content over HTTP. The endpoints that receive HTTP requests to upload or download chunked messages need to be configured to correctly handle Logic Apps' version of chunking. As a user not an owner of an endpoint or connector it may not be possible for that resource to support chunking. For both downloads and uploads the protocol Logic Apps uses for chunking is described below.

### Chunked Downloads

When downloading content from an endpoint using an HTTP GET request if that endpoint responds with status code 206, then the response contains chunked content. Logic Apps cannot control if the endpoint supports partial requests, but once the 206 partial content response is received multiple requests will automatically be sent by Logic Apps to download the complete content.

   > [!NOTE]
   > To use chunking to handle large messages in Logic Apps the endpoint must support partial content requests and therefore chunked download.

   > [!TIP]
   > One method to potentially check if an endpoint supports partial content is to send a HEAD request and determine if the response contains the header `Accept-Ranges`.
   > If chunked download is supported, but chunks aren't being sent by the endpoint, you can suggest it by setting the `Range` header in your request.

1. Logic Apps sends an HTTP GET request optionally containing a header field for the `Range` of the chunked content it is requesting.
2. The endpoint responds with status code 206 and the HTTP message body contains the chunk of requested content based on the range or some default chunk size.
3. Logic Apps automatically sends follow up HTTP GET requests with the next range of content it needs to sequentially get the complete content.

Here is an example workflow definition using an HTTP GET action to download content from an endpoint that supports partial content chunked downloads. This illustrates setting the `Range` header on request so that **if** the endpoint supports partial content requests, the response will contain the chunk of content in this range. Additionally, the exact format of the range header field could differ by endpoint.

```json
"getAction":
{
    "inputs": {
        "headers": {
            "Range": "0-1024"
        },
        "method": "GET",
        "uri": "http://myAPIendpoint/api/action",
    },
    "runAfter": {},
    "type": "Http"
}
```
### Chunked Uploads

Uploading content as chunked requires that the Logic Apps operation have the proper **Runtime Configuration** set to allow chunking. The Logic Apps protocol for uploading chunked content is to send an initiating empty POST or PUT message and then follow up PATCH messages containing chunks of the content.

1. Logic Apps sends an initiating HTTP POST or PUT request with a header information about the content and an empty body. Follow up messages will then be able to use the information in the response from this initial request.

    | Request Header Field | Value | Description |
    | -------------------- | ----- | ----------- |
    | x-ms-transfer-mode | chunked | Indicates the response should contain the desired length and size of the chunks |
    | x-ms-content-length | _*varies_ | The total size in bytes of the content before it is split into chunks. |

2. The endpoints' response can contain a suggested chunk size. Logic Apps can then use that size to create the follow up HTTP PATCH requests that will be sent to the `Location` uri.

    | Response Header Field | Required | Description |
    | --------------------- | -------- | ----------- |
    | x-ms-chunk-size | No | The number for the suggested chunk size in bytes. |
    | Location | No | The uri location where the PATCH messages will be sent. |

3. Logic Apps sends chunks in HTTP PATCH messages of x-ms-chunk-size or an internally calculated size until the entire content of x-ms-content-length has been sequentially uploaded. These PATCH requests each contain header information about the content they contain.

    | Request Header Field | Value | Description |
    | -------------------- | ----- | ----------- |
    | Range |  _*varies_ | The from and to values representing the range of the content in this chunk. For example bytes=0-1023. |
    | Content-Type |  _*varies_ | The type of the chunked content. |

4. The endpoint responds to each PATCH request with status code 200 to confirm the receipt of every chunk.

This example shows the definition for an action that will upload chunked content. If chunking is applicable to an operation, the runtime configuration needs to allow chunking for this protocol to be initiated. This can be done in the Logic Apps Designer under **Settings** and **Content Transfer** or in code view by including the **chunked** runtime configuration shown below.

```json
"postAction":
{
    "runtimeConfiguration": { "contentTransfer": { "transferMode": "chunked"}},
    "inputs": {
        "method": "POST",
        "uri": "http://myAPIendpoint/api/action",
        "body": "@body('getAction')",
    },
    "runAfter": { "getAction": ["succeeded"]},
    "type": "Http"
}
```

   > [!NOTE]
   > Here the content that was downloaded as chunked is also being uploaded as chunked, but that does not have to be the case. Regular, non-chunk downloaded content can also be
   > uploaded in chunks. This is helpful when dealing with connectors that have smaller message size limitations than Logic Apps.