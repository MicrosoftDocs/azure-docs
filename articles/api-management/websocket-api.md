---
title: Import a WebSocket API using the Azure portal | Microsoft Docs
titleSuffix: 
description: Learn how API Management supports WebSocket, add a WebSocket API, and WebSocket limitations.
ms.service: api-management
author: v-hhunter
ms.author: v-hhunter
ms.topic: how-to
ms.date: 06/02/2021
ms.custom: template-how-to 
---

# Import a WebSocket API (preview)

With API Management’s WebSocket API solution, you can now manage, protect, observe, and expose both WebSocket and REST APIs with API Management and provide a central hub for discovering and consuming all APIs. API publishers can quickly add a WebSocket API in API Management via:
* A simple gesture in the Azure portal, and 
* The Management API and Azure Resource Manager. 

You can secure WebSocket APIs by applying existing access control policies, like [JWT validation](./api-management-access-restriction-policies.md#ValidateJWT). You can also test WebSocket APIs using the API test consoles in both Azure portal and developer portal. Building on existing observability capabilities, API Management provides metrics and logs for monitoring and troubleshooting WebSocket APIs. 

[!INCLUDE [preview](./includes/preview/preview-callout-websocket-api.md)]

In this article, you will:
> [!div class="checklist"]
> * Understand Websocket passthrough flow.
> * Add a WebSocket API to your API Management instance.
> * Test your WebSocket API.
> * View the metrics and logs for your WebSocket API.
> * Learn the limitations of WebSocket API.

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- A [WebSocket API](https://www.websocket.org/echo.html).

## WebSocket passthrough

API Management supports WebSocket passthrough. 

:::image type="content" source="./media/websocket-api/websocket-api-passthrough.png" alt-text="Visual illustration of WebSocket passthrough flow":::

During the WebSocket passthrough the client application establishes a WebSocket connection with the API Management Gateway, which then establishes a connection with the corresponding backend services. API Management then proxies WebSocket client-server messages.

1. The client application sends a WebSocket handshake request to APIM gateway, invoking onHandshake operation.
1. APIM gateway sends WebSocket handshake request to the corresponding backend service.
1. The backend service upgrades a connection to WebSocket.
1. APIM gateway upgrades the corresponding connection to WebSocket.
1. Once the connection pair is established, APIM will broker messages back and forth between the client application and backend service.
1. The client application sends message to APIM gateway.
1. APIM gateway forwards the message to the backend service.
1. The backend service sends a message to APIM gateway.
1. APIM gateway forwards the message to the client application.
1. When either side disconnects, APIM terminates the corresponding connection.

> [!NOTE]
> The client-side and backend-side connections consist of one-to-one mapping. 

## onHandshake operation

Per the [WebSocket protocol](https://tools.ietf.org/html/rfc6455), when a client application tries to establish a WebSocket connection with a backend service, it will first send an [opening handshake request](https://tools.ietf.org/html/rfc6455#page-6). Each WebSocket API in API Management has an onHandshake operation. onHandshake is an immutable, unremovable, automatically created system operation. The onHandshake operation enables API publishers to intercept these handshake requests and apply API Management policies to them.

:::image type="content" source="./media/websocket-api/onhandshake-screen.png" alt-text="onHandshake screen example":::

## Add a WebSocket API

1. Navigate to your API Management instance.
1. From the side navigation menu, under the **APIs** section, select **APIs**.
1. Under **Define a new API**, select the **WebSocket** icon.
1. In the dialog box, select **Full** and complete the required form fields.

    | Field | Description |
    |----------------|-------|
    | Display name | The name by which your WebSocket API will be displayed. |
    | Name | Raw name of the WebSocket API. Automatically populates as you type the display name. |
    | WebSocket URL | The base URL with your websocket name. For example: ws://example.com/your-socket-name |
    | Products | Associate your WebSocket API with a product to publish it. |
    | Gateways | Associate your WebSocket API with existing gateways. |
 
1. Click **Create**.

## Test your WebSocket API

1. Navigate to your WebSocket API.
1. Within your WebSocket API, select the onHandshake operation.
1. Select the **Test** tab to access the Test console. 
1. Optionally, provide query string parameters required for the WebSocket handshake.

    :::image type="content" source="./media/websocket-api/test-websocket-api.png" alt-text="test API example":::

1. Click **Connect**.
1. View connection status in **Output**.
1. Enter value in **Payload**. 
1. Click **Send**.
1. View received messages in **Output**.
1. Repeat preceding steps to test different payloads.
1. When testing is complete, select **Disconnect**.

## Limitations

WebSocket APIs are available and supported in public preview through Azure portal, Management API, and Azure Resource Manager. Below are the current restrictions of WebSocket support in API Management:

* WebSocket APIs are not supported in the Consumption tier.
* WebSocket APIs are not supported in the [self-hosted gateway](./how-to-deploy-self-hosted-gateway-azure-arc.md).
* Azure CLI, PowerShell, and SDK do not support management operations of WebSocket APIs.

### Unsupported policies

The following policies are not supported by and cannot be applied to the onHandshake operation:
* Mock response
* Get from cache
* Store to cache
* Allow cross-domain calls
* CORS
* JSONP
* Set request method
* Set body
* Convert XML to JSON
* Convert JSON to XML
* Transform XML using XSLT
* Validate content
* Validate parameters
* Validate headers
* Validate status code

> [!NOTE]
> If you applied the policies at higher scopes (i.e., global or product) and they were inherited by a WebSocket API through the policy, they will be skipped at run time.

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Next steps
> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)