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

# Handle large messages through chunking with Logic Apps

Logic Apps limits the maximum size of messages that it will handle. When a message has content that exceeds this size limit, Logic Apps *chunks* this large message into multiple smaller messages. That way, you can still transfer large files with logic apps under specific circumstances. Content that exceeds the message size limit can only be consumed by Logic Apps if it has been chunked. This means the connector used to consume the content must support chunking, or the underlying HTTP message exchange between Logic Apps and the service is chunked.

## Understanding large messages

The classification of a message as *large* is relative to the service that is handling that message. Large messages can add extra overhead to a service because they require more space to store and time to process. Because Logic Apps' communicate with a variety of services via connectors and HTTP, what is considered a large message can vary based on service-specific constraints. For this reason, there can be multiple qualifications that could make a message *large*. Here you can learn more about the [message size limits for logic apps](../logic-apps/logic-apps-limits-and-config.md) specifically. For Logic Apps and connectors, *large* messages cannot be directly consumed, and instead must be *chunked*.

### Using large chunked messages within Logic Apps

Within Logic Apps, messages ingested in chunks and with size greater than the Logic Apps message size limit, cannot have their outputs accessed directly. These types of messages can only have their outputs used by other actions that support chunked transfer. If you reference large message output in an action that does not support chunking, or does not have chunking enabled in the runtime configuration a runtime error occurs.

### Using large chunked messages with connectors

Often, connectors have smaller content size limits than the Logic Apps engine. For this reason a connector may consider a 30 MB message as large, even though Logic Apps would not. In this case, behind the scenes Logic Apps splits up content greater than 30 MB into smaller chunks so the connector size limit is not exceeded. However, not all connectors support chunking. Connectors that do not support chunking, raise runtime errors whenever incoming messages exceed that connectors' size limit. See [connector information](../connectors/apis-list.md) to help determine large message size limits for specific connectors. When, chunking is handled via connectors the underlying chunked protocol is invisible to the user. For generic HTTP scenarios, the following sections describe the underlying chunked protocol.

## Logic Apps chunked transfer protocol

If you want an endpoint to be able to exchange large content with Logic Apps, then that content must be chunked in the manner Logic Apps expects. You can use chunking to split large content downloads or uploads over HTTP. For endpoints that receive HTTP requests to download or upload messages, make sure that you correctly set up those endpoints to support chunking. However, if you don't own the endpoint or connector, you might not have the option to set up that resource for chunking.

Here's the description for the protocol that Logic Apps uses for chunking both downloads and uploads:

### Download chunks

When you download content from an endpoint with an HTTP GET request, and that endpoint responds with a "206" status code, that response contains chunked content. Logic Apps can't control whether the endpoint supports partial requests. However, after receiving a "206" partial content response, Logic Apps automatically sends multiple requests to download all the content. To handle large messages by using chunking, an endpoint must support partial content requests, and thus, chunked download.

> [!TIP]
> One method to potentially check if an endpoint supports partial content is to send a HEAD request and determine if the response contains the header `Accept-Ranges`.
> If chunked download is supported, but chunks aren't being sent by the endpoint, you can suggest it by setting the `Range` header in your request.

First, Logic Apps sends an HTTP GET request optionally containing a header field for the `Range` of the chunked content it is requesting. Next the endpoint responds with status code 206 and the HTTP message body contains the chunk of requested content based on the range or some default chunk size. Then, Logic Apps automatically sends follow-up HTTP GET requests with the next range of content it needs to sequentially get the complete content.

Here is a workflow definition using an HTTP GET action to download content from an endpoint that supports partial content chunked downloads. This example illustrates setting the `Range` header on request so that *if* the endpoint supports partial content requests, the response contains the chunk of content in this range. Additionally, the exact format of the range header field could differ by endpoint.

```json
"getAction":
{
    "inputs": {
        "headers": {
            "Range": "bytes=0-1023"
        },
        "method": "GET",
        "uri": "http://myAPIendpoint/api/downloadContent"
    },
    "runAfter": {},
    "type": "Http"
}
```
### Upload chunks

To upload content in chunks, actions must correctly set the *Runtime Configuration* to permit chunking. The protocol is to send an initial empty POST or PUT message, and then follow up with PATCH messages that contain the content chunks.

First, Logic Apps sends an initiating HTTP POST or PUT request with header information about the content it will send and an empty body. Logic Apps will then be able to use information in the response to this initiating message to form the follow up requests.

| Logic Apps Request Header Field | Value | Description |
| ------------------------------- | ----- | ----------- |
| x-ms-transfer-mode | chunked | Indicates the response should contain the desired length and size of the chunks |
| x-ms-content-length | *content-length* | The total size in bytes of the content before it is split into chunks |

The endpoints' response can contain a suggested chunk size. Logic Apps can then use that size to create the follow-up HTTP PATCH requests that are sent to the `Location` uri.

| Endpoint Response Header Field | Required | Description |
| ------------------------------ | -------- | ----------- |
| x-ms-chunk-size | No | The number for the suggested chunk size in bytes |
| Location | No | The uri location where the PATCH messages will be sent |

Logic Apps sends chunks in HTTP PATCH messages of x-ms-chunk-size or an internally calculated size until the entire content of x-ms-content-length has been sequentially uploaded. These PATCH requests include header information about the content they contain.

| Logic Apps Request Header Field | Value | Description |
| ------------------------------- | ----- | ----------- |
| Range |  *range* | The "from" and "to" values for the range of content in this chunk. For example, bytes=0-1023 |
| Content-Type |  *content-type* | The type of the chunked content |

After each PATCH request, to confirm the receipt of every chunk, the endpoint responds with status code "200."

This example shows the definition for an action that uploads chunked content. If chunking applies to an operation, the runtime configuration must permit chunking for initiating this protocol. You can specify this setting in the Logic Apps Designer under *Settings* > *Content Transfer*, or in code view by including the *chunked* runtime configuration as shown here:

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