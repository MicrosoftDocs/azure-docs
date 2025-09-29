---
title: Handle Large Messages with Chunking
description: Learn how to handle large messages in workflows with chunking and what a large message means in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.topic: how-to
ms.date: 09/16/2025
#Customer intent: As an integration developer who works with Azure Logic Apps, I need to understand when and how to use chunking to support large messages.
---

# Handle large messages in workflows using chunking in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

Azure Logic Apps places different size limits on the message content that operations can handle in logic app workflows. These limits vary based on both the logic app resource type and the environment where a workflow runs. Limits also help reduce any overhead that results from storing and processing large messages. For more information about message size limits, see [Message limits in Azure Logic Apps](logic-apps-limits-and-config.md#messages).

If you use built-in HTTP actions or specific managed connector actions to work with messages larger than the default limits, you can enable *chunking*. This approach splits a large message into smaller messages, so you can still transfer large files under specific conditions.

For these built-in HTTP actions and specific managed connector actions, chunking is the only way that Azure Logic Apps can consume large messages. Either the underlying HTTP message exchange between Azure Logic Apps and other services must use chunking, or the connections created by the managed connectors must support chunking.

> [!NOTE]
>
> Due to increased overhead from exchanging multiple messages, Azure Logic Apps doesn't support chunking on triggers. Also, Azure Logic Apps implements chunking for HTTP actions using its own protocol, as described in this article. Even if your web site or web service supports chunking, they don't work with HTTP action chunking.
>
> To use HTTP action chunking with your web site or web service, implement the same protocol that's used by Azure Logic Apps. Otherwise, don't enable chunking on the HTTP action.

This article provides an overview about what large messages mean, how chunking works, and how to set up chunking on supported actions in Azure Logic Apps.

<a name="what-is-large-message"></a>

## What makes messages "large"?

Messages are *large* based on the service that handles those messages. The exact size limit on large messages differs across Azure Logic Apps and connector actions. Both Azure Logic Apps and connectors can't directly consume large messages without chunking.

For the Azure Logic Apps message size limit, see [Azure Logic Apps limits and configuration](logic-apps-limits-and-config.md). For each connector's message size limit, see [connector reference](/connectors/connector-reference/connector-reference-logicapps-connectors).

### Chunked message handling for Azure Logic Apps

Azure Logic Apps can't directly use outputs from chunked messages that are larger than the message size limit. Only actions that support chunking can access the message content in these outputs. An action that handles large messages must meet *either* of the following criteria:

- The action must natively support chunking when that action belongs to a connector.
- The action must have chunking support enabled in that action's runtime configuration.

Otherwise, you get a runtime error when you try to access large content output.

### Chunked message handling for connectors

Services that communicate with Azure Logic Apps can have their own message size limits. These limits are often smaller than the Azure Logic Apps limit. For example, if a connector supports chunking, a connector might consider a 30-MB message as large, while Azure Logic Apps doesn't. To comply with this connector's limit, Azure Logic Apps splits any message larger than 30 MB into smaller chunks.

For connectors that support chunking, the underlying chunking protocol is invisible to end users. Not all connectors support chunking. Connectors that don't support it generate runtime errors when incoming messages exceed the connector size limits.

For actions that support and are enabled for chunking, you can't use trigger bodies, variables, and expressions such as `triggerBody()?['Content']`. Using any of these inputs prevents the chunking operation from happening. Instead, use the [**Compose** action](../logic-apps/logic-apps-perform-data-operations.md#compose-action). Specifically, create a `body` field by using the **Compose** action to store the data output from the trigger body, variable, expression, and so on, for example:

```json
"Compose": {
    "inputs": {
        "body": "@variables('myVar1')"
    },
    "runAfter": {
        "Until": [
            "Succeeded"
        ]
    },
    "type": "Compose"
},
```

To reference the data, in the chunking action, use the expression `body('Compose')`, for example:

```json
"Create_file": {
    "inputs": {
        "body": "@body('Compose')",
        "headers": {
            "ReadFileMetadataFromServer": true
        },
        "host": {
            "connection": {
                "name": "@parameters('$connections')['sftpwithssh_1']['connectionId']"
            }
        },
        "method": "post",
        "path": "/datasets/default/files",
        "queries": {
            "folderPath": "/c:/test1/test1sub",
            "name": "tt.txt",
            "queryParametersSingleEncoded": true
        }
    },
    "runAfter": {
        "Compose": [
            "Succeeded"
        ]
    },
    "runtimeConfiguration": {
        "contentTransfer": {
            "transferMode": "Chunked"
        }
    },
    "type": "ApiConnection"
},
```

<a name="set-up-chunking"></a>

## Set up chunking over HTTP

In generic HTTP scenarios, you can split up large content downloads and uploads over HTTP so your workflow can exchange large messages with an external endpoint. You must chunk messages in the way that Azure Logic Apps expects.

If an external endpoint is set up to chunk downloads or uploads, the HTTP actions in your workflow automatically chunk large messages. Otherwise, you must set up chunking support on the endpoint. If you don't own or control the endpoint, you might not be able to set up chunking.

If an HTTP action doesn't already have chunking enabled, you must set up chunking through the action's `runTimeConfiguration` property. You can set up this property in the action definition by using the code view editor, as described later, or in the workflow designer as described here:

1. On the designer, select the HTTP action to open the action information pane, and then select **Settings**.

1. Under **Content transfer**, set **Allow chunking** to **On**.

   :::image type="content" source="./media/logic-apps-handle-large-messages/set-up-chunking.png" alt-text="Screenshot shows the settings for an HTTP action, with Allow chunking selected. Turn on chunking.":::

1. To finish setting up chunking for downloads or uploads, continue with the following sections.

<a name="download-chunks"></a>

## Download content in chunks

When you download content from an external endpoint by using an HTTP GET request, many external endpoints send large messages automatically in chunks. This behavior requires the endpoint to support partial content requests or *chunked downloads*. So, if an action in your workflow sends an HTTP GET request to download content from an external endpoint, and the endpoint responds with the **206 Partial Content** status code, the response contains chunked content.

Azure Logic Apps can't control whether an external endpoint supports partial content requests. When the requesting action in your workflow gets the first response with the **206 Partial Content** status code, that action automatically sends multiple requests to download all the content.

To check whether an external endpoint supports partial content, send an HTTP HEAD request, which asks for a response with only the status line and header section, omitting the response body. This request helps you determine whether the response contains the `Accept-Ranges` header.

If the endpoint supports partial content as chunked downloads but doesn't send chunked content, you can *suggest* this option by setting the `Range` header in your HTTP GET request.

The following steps describe the process that Azure Logic Apps uses to download chunked content from an external endpoint into your workflow:

1. In your workflow, an action sends an HTTP GET request to the endpoint.

   The request header can optionally include a `Range` field that describes a byte range for requesting content chunks.

1. The endpoint responds with the `206` status code and an HTTP message body.

    Details about the content in this chunk appear in the response's `Content-Range` header. These details include information that helps Azure Logic Apps determine the start and end for the chunk, plus the total size of the entire content before chunking.

1. The action automatically sends follow-up HTTP GET requests until all the content is retrieved.


For example, the following action definition shows an HTTP GET request that sets the `Range` header. The header *suggests* that the endpoint respond with chunked content:

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

The GET request sets the `Range` header to `bytes=0-1023` to specify the byte range. If the endpoint supports requests for partial content, the endpoint responds with a content chunk from the requested range. Based on the endpoint, the exact format for the `Range` header field can differ.

<a name="upload-chunks"></a>

## Upload content in chunks

To upload content in chunks from an HTTP action, you must set up chunking support by setting the action's `runtimeConfiguration` property. This setting permits the action to start the chunking protocol.

The action can then send an initial POST or PUT message to the external endpoint. After the endpoint responds with a suggested chunk size, the action follows up by sending HTTP PATCH requests that contain the content chunks.

The following steps describe the detailed process that Azure Logic Apps uses for uploading chunked content from an action in your workflow to an external endpoint:

1. In your workflow, an action sends an initial HTTP POST or PUT request with an empty message body.

   The request header includes the following information about the content that your logic app wants to upload in chunks:

   | Request header field | Value | Type | Description |
   |----------------------|-------|------|-------------|
   | **x-ms-transfer-mode** | chunked | String | Indicates that the content is uploaded in chunks |
   | **x-ms-content-length** | <*content-length*> | Integer | The entire content size in bytes before chunking |

1. The endpoint responds with `200` success status code and the following information:

   | Endpoint response header field | Type | Required | Description |
   |--------------------------------|------|----------|-------------|
   | **Location** | String | Yes | The URL location where to send the HTTP PATCH messages |
   | **x-ms-chunk-size** | Integer | No | The suggested chunk size in bytes |

1. The workflow action creates and sends follow-up HTTP PATCH messages, each with the following information:

   - A content chunk based on **x-ms-chunk-size** or some internally calculated size until all the content totaling **x-ms-content-length** is sequentially uploaded

   - The following header information about the content chunk sent in each PATCH message:

     | Request header field | Value | Type | Description |
     |----------------------|-------|------|-------------|
     | **Content-Range** | <*range*> | String | The byte range for the current content chunk, including the starting value, ending value, and the total content size, for example: `bytes=0-1023/10100` |
     | **Content-Type** | <*content-type*> | String | The type of chunked content |
     | **Content-Length** | <*content-length*> | String | The length of size in bytes of the current chunk |

1. After each PATCH request, the endpoint confirms the receipt for each chunk by responding with the `200` status code and the following response headers:

   | Endpoint response header field | Type | Required | Description |
   |--------------------------------|------|----------|-------------|
   | **Range** | String | Yes | The byte range for content received by the endpoint, for example: `bytes=0-1023` |
   | **x-ms-chunk-size** | Integer | No | The suggested chunk size in bytes |

For example, the following action definition shows an HTTP POST request for uploading chunked content to an endpoint. In the action's `runTimeConfiguration` property, the `contentTransfer` property sets `transferMode` to `chunked`:

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
