---
title: Handle large messages - Azure Logic Apps | Microsoft Docs
description: Learn how to handle large message sizes with chunking in Azure Logic Apps
services: logic-apps
documentationcenter:
author: shae-hurst
manager: jeconnoc
editor:

ms.assetid:
ms.service: logic-apps
ms.workload: logic-apps
ms.devlang:
ms.tgt_pltfrm: 
ms.topic: article
ms.date: 4/27/2018
ms.author: shhurst
---

# Handle large messages with chunking in Azure Logic Apps

When handling messages, Logic Apps limits message content to a maximum size. 
This limit helps reduce overhead created by storing and processing large messages. 
To handle messages larger than this limit, Logic Apps can *chunk* a large 
message into smaller messages. That way, you can still transfer large 
files using Logic Apps under specific conditions. 
When communicating with other services through connectors or HTTP, 
Logic Apps can consume large messages but *only* in chunks. 
This condition means connectors must also support chunking, or the underlying 
HTTP message exchange between Logic Apps and these services must use chunking.

This article shows how you can set up chunking for actions handling messages that are 
larger than the limit. Logic App  triggers don't 
support chunking because of the increased overhead of exchanging multiple messages. 

## What makes messages "large"?

Messages are "large" based on the service handling those messages. 
The exact size limit on large messages differs across Logic Apps and connectors. 
Both Logic Apps and connectors can't directly consume large messages, 
which must be chunked. For the Logic Apps message size limit, 
see [Logic Apps limits and configuration](../logic-apps/logic-apps-limits-and-config.md).
For each connector's message size limit, see the 
[connector's specific technical details](../connectors/apis-list.md).

### Chunked message handling for Logic Apps

Logic Apps can't directly use outputs from chunked 
messages that are larger than the message size limit. 
Only actions that support chunking can access the message content in these outputs. 
So, an action that handles large messages must meet *either* these criteria:

* Natively support chunking when that action belongs to a connector. 
* Have chunking support enabled in that action's runtime configuration. 

Otherwise, you get a runtime error when you try to access large content output. 
To enable chunking, see [Set up chunking support](#set-up-chunking).

### Chunked message handling for connectors

Services that communicate with Logic Apps can have their own message size limits. 
These limits are often smaller than the Logic Apps limit. For example, assuming that 
a connector supports chunking, a connector might consider a 30-MB message as large, 
while Logic Apps does not. To comply with this connector's limit, 
Logic Apps splits any message larger than 30 MB into smaller chunks.

For connectors that support chunking, the underlying chunking protocol is invisible to end users. 
However, not all connectors support chunking, so these connectors generate runtime 
errors when incoming messages exceed the connectors' size limits.

<a name="set-up-chunking"></a>

## Set up chunking over HTTP

In generic HTTP scenarios, you can split up large content downloads and uploads over HTTP, 
so that your logic app and an endpoint can exchange large messages. However, 
you must chunk messages in the way that Logic Apps expects. 

If an endpoint has enabled chunking for downloads or uploads, 
the HTTP actions in your logic app automatically chunk large messages. Otherwise, 
you must set up chunking support on the endpoint. If you don't own or control 
the endpoint or connector, you might not have the option to set up chunking.

Also, if an HTTP action doesn't already enable chunking, 
you must also set up chunking in the action's `runTimeConfiguration` property. 
You can set this property inside the action, either directly in the code view 
editor as described later, or in the Logic Apps Designer as described here:

1. In the HTTP action's upper-right corner, 
choose the ellipsis button (**...**), 
and then choose **Settings**.

   ![On the action, open the settings menu](./media/logic-apps-handle-large-messages/http-settings.png)

2. Under **Content Transfer**, set **Allow chunking** to **On**.

   ![Turn on chunking](./media/logic-apps-handle-large-messages/set-up-chunking.png)

3. To continue setting up chunking for downloads or uploads, 
continue with the following sections.

<a name="download-chunks"></a>

## Download content in chunks

Many endpoints automatically send large messages 
in chunks when downloaded through an HTTP GET request. 
To download chunked messages from an endpoint over HTTP, 
the endpoint must support partial content requests, 
or *chunked downloads*. When your logic app sends an HTTP GET 
request to an endpoint for downloading content, 
and the endpoint responds with a "206" status code, 
the response contains chunked content. 
Logic Apps can't control whether an endpoint supports partial requests. 
However, when your logic app gets the first "206" response, 
your logic app automatically sends multiple requests to download all the content.

To check whether an endpoint can support partial content, 
send a HEAD request. This request helps you determine 
whether the response contains the `Accept-Ranges` header. 
That way, if the endpoint supports chunked downloads but 
doesn't send chunked content, you can *suggest* 
this option by setting the `Range` header in your HTTP GET request. 

These steps describe the detailed process Logic Apps uses for 
downloading chunked content from an endpoint to your logic app:

1. Your logic app sends an HTTP GET request to the endpoint.

   The request header can optionally include a `Range` field that
   describes a byte range for requesting content chunks.

2. The endpoint responds with the "206" status code and an HTTP message body.

    Details about the content in this chunk appear in the response's `Content-Range` header,
    including information that helps Logic Apps determine the start and end for the chunk,
    plus the total size of the entire content before chunking.

3. Your logic app automatically sends follow-up HTTP GET requests.

    Your logic app sends follow-up GET requests until the entire content is retrieved.

For example, this action definition shows an HTTP GET request that sets the `Range` header. 
The header *suggests* that the endpoint should respond with chunked content:

```json
"getAction": {
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

The GET request sets the "Range" header to "bytes=0-1023", 
which is the range of bytes. If the endpoint supports 
requests for partial content, the endpoint responds 
with a content chunk from the requested range. 
Based on the endpoint, the exact format for the "Range" header field can differ.

<a name="upload-chunks"></a>

## Upload content in chunks

To upload chunked content from an HTTP action, the action must have enabled 
chunking support through the action's `runtimeConfiguration` property. 
This setting permits the action to start the chunking protocol. 
Your logic app can then send an initial POST or PUT message to the target endpoint. 
After the endpoint responds with a suggested chunk size, your logic app follows 
up by sending HTTP PATCH requests that contain the content chunks.

These steps describe the detailed process Logic Apps uses for uploading 
chunked content from your logic app to an endpoint:

1. Your logic app sends an initial HTTP POST or PUT request 
with an empty message body. The request header, 
includes this information about the content that your logic app wants to upload in chunks:

   | Logic Apps request header field | Value | Type | Description |
   |---------------------------------|-------|------|-------------|
   | **x-ms-transfer-mode** | chunked | String | Indicates that the content is uploaded in chunks |
   | **x-ms-content-length** | <*content-length*> | Integer | The entire content size in bytes before chunking |
   ||||

2. The endpoint responds with "200" success status code and this optional information:

   | Endpoint response header field | Type | Required | Description |
   |--------------------------------|------|----------|-------------|
   | **x-ms-chunk-size** | Integer | No | The suggested chunk size in bytes |
   | **Location** | String | No | The URL location where to send the HTTP PATCH messages |
   ||||

3. Your logic app creates and sends follow-up HTTP PATCH messages - each with this information:

   * A content chunk based on **x-ms-chunk-size** or some internally calculated
   size until all the content totaling **x-ms-content-length** is sequentially uploaded

   * These header details about the content chunk sent in each PATCH message:

     | Logic Apps request header field | Value | Type | Description |
     |---------------------------------|-------|------|-------------|
     | **Content-Range** | <*range*> | String | The byte range for the current content chunk, including the starting value, ending value, and the total content size, for example: "bytes=0-1023/10100" |
     | **Content-Type** | <*content-type*> | String | The type of chunked content |
     | **Content-Length** | <*content-length*> | String | The length of size in bytes of the current chunk |
     |||||

4. After each PATCH request, the endpoint confirms the receipt 
for each chunk by responding with the "200" status code.

For example, this action definition shows an HTTP POST 
request for uploading chunked content to an endpoint. 
In the action's `runTimeConfiguration` property, 
the `contentTransfer` property sets `transferMode` to `chunked`:

```json
"postAction": {
    "runtimeConfiguration": {
        "contentTransfer": {
    	    "transferMode": "chunked"
    	}
    },
    "inputs": {
        "method": "POST",
        "uri": "http://myAPIendpoint/api/action",
        "body": "@body('getAction')"
    },
    "runAfter": {
	"getAction": ["Succeeded"]
    },
    "type": "Http"
}
```