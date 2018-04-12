---
title: Handle large messages with chunking - Azure Logic Apps | Microsoft Docs
description: How to handle large message sizes with chunking in logic apps.
services: logic-apps
documentationcenter:
author: shae-hurst
manager: bshyam
editor: ''

ms.assetid:
ms.service: logic-apps
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: integration
ms.date: 1/17/2018
ms.author: LADocs; shhurst

---
# Handle large messages through chunking with logic apps

Logic Apps limits the maximum size on messages that the service can handle. When a message has content that exceeds this limit, Logic Apps **chunks** large messages into smaller messages. Learn more about [message size limits for logic apps.](../logic-apps/logic-apps-limits-and-config.md)

-	What is a large message?
-	What is the difference between large messages in the engine versus a large message in a connector?
-	What can I do with a large (chunked) message? (e.g. can’t access content of a large message (from the engine’s point of view)).
-	How does the engine handle message when the message sizes are between an engine large message (i.e. 100MB) and a connector large message (i.e. 50MB)?
-	What happens if I turned off chunked on an action and a large message is read?

## Why
Individual connectors have size limitations as well.

## Transfer content in chunks

To handle large messages, Logic Apps can transfer that content in chunks. So, rather than send a single large HTTP message, Logic Apps splits the message into smaller HTTP messages. That way, you can still transfer large files with logic apps under specific circumstances.

You can use chunking to split large content downloads or uploads over HTTP. For endpoints that receive HTTP requests to download or upload messages, make sure that you correctly set up those endpoints to support chunking in Logic Apps. However, if you don't own the endpoint or connector, you might not have the option to set up that resource for chunking.

Here's the description for the protocol that Logic Apps uses for chunking both downloads and uploads:

### Download chunks

When you download content from an endpoint with an HTTP GET request, and that endpoint responds with a "206" status code, that response contains chunked content. Logic Apps can't control whether the endpoint supports partial requests. However, after receiving a "206" partial content response, Logic Apps automatically sends multiple requests to download all the content. To handle large messages by using chunking, an endpoint must support partial content requests, and thus, chunked download.

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
        "uri": "http://myAPIendpoint/api/action"
    },
    "runAfter": {},
    "type": "Http"
}
```
### Upload Chunks

To upload content in chunks, Logic Apps operations must correctly set the **Runtime Configuration** to permit chunking. The protocol is to send an initial empty POST or PUT message, and then follow up with PATCH messages that contain the content chunks.

1. Logic Apps sends an initiating HTTP POST or PUT request with a header information about the content and an empty body. Follow up messages will then be able to use the information in the response from this initial request.

    | Request Header Field | Value | Description |
    | -------------------- | ----- | ----------- |
    | x-ms-transfer-mode | chunked | Indicates the response should contain the desired length and size of the chunks |
    | x-ms-content-length | <content-length> | The total size in bytes of the content before it is split into chunks |

2. The endpoints' response can contain a suggested chunk size. Logic Apps can then use that size to create the follow-up HTTP PATCH requests that are sent to the `Location` uri.

    | Response Header Field | Required | Description |
    | --------------------- | -------- | ----------- |
    | x-ms-chunk-size | No | The number for the suggested chunk size in bytes |
    | Location | No | The uri location where the PATCH messages will be sent |

3. Logic Apps sends chunks in HTTP PATCH messages of x-ms-chunk-size or an internally calculated size until the entire content of x-ms-content-length has been sequentially uploaded. These PATCH requests each contain header information about the content they contain.

    | Request Header Field | Value | Description |
    | -------------------- | ----- | ----------- |
    | Range |  <range> | The "from" and "to" values for the range of content in this chunk. For example, bytes=0-1023 |
    | Content-Type |  <content-type> | The type of the chunked content |

4. To confirm the receipt of every chunk, the endpoint responds with status code "200" to each PATCH request.

This example shows the definition for an action that uploads chunked content. If chunking applies to an operation, the runtime configuration must permit chunking for initiating this protocol. You can specify this setting in the Logic Apps Designer under **Settings** > **Content Transfer**, or in code view by including the **chunked** runtime configuration as shown here:

```json
"postAction":
{
    "runtimeConfiguration": { "contentTransfer": { "transferMode": "chunked"}},
    "inputs": {
        "method": "POST",
        "uri": "http://myAPIendpoint/api/action",
        "body": "@body('getAction')"
    },
    "runAfter": { "getAction": ["succeeded"]},
    "type": "Http"
}
```

> [!NOTE]
> Here, content that's downloaded in chunks is also uploaded in chunks.
> However, you can also upload content that's not chunked,
> which is useful when you use connectors with message size limits that are smaller than Logic Apps.