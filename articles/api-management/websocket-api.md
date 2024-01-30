---
title: Import a WebSocket API to Azure API Management | Microsoft Docs
titleSuffix: 
description: Learn how API Management supports WebSocket, add a WebSocket API, and WebSocket limitations.
ms.service: api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 10/27/2022
ms.custom: template-how-to, ignite-fall-2021
---

# Import a WebSocket API

With API Management’s WebSocket API solution, API publishers can quickly add a WebSocket API in API Management via the Azure portal, Azure CLI, Azure PowerShell, and other Azure tools. 

You can secure WebSocket APIs by applying existing access control policies, like [JWT validation](validate-jwt-policy.md). You can also test WebSocket APIs using the API test consoles in both Azure portal and developer portal. Building on existing observability capabilities, API Management provides metrics and logs for monitoring and troubleshooting WebSocket APIs. 

In this article, you will:
> [!div class="checklist"]
> * Understand Websocket passthrough flow.
> * Add a WebSocket API to your API Management instance.
> * Test your WebSocket API.
> * View the metrics and logs for your WebSocket API.
> * Learn the limitations of WebSocket API.

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- A WebSocket API. 
- Azure CLI

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

#### [Portal](#tab/portal)

1. 1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, select **APIs** > **+ Add API**.
1. Under **Define a new API**, select **WebSocket**.
1. In the dialog box, select **Full** and complete the required form fields.

    | Field | Description |
    |----------------|-------|
    | Display name | The name by which your WebSocket API will be displayed. |
    | Name | Raw name of the WebSocket API. Automatically populates as you type the display name. |
    | WebSocket URL | The base URL with your websocket name. For example: *ws://example.com/your-socket-name* |
    | URL scheme | Accept the default |
    | API URL suffix| Add a URL suffix to identify this specific API in this API Management instance. It has to be unique in this APIM instance. |
    | Products | Associate your WebSocket API with a product to publish it. |
    | Gateways | Associate your WebSocket API with existing gateways. |
 
1. Click **Create**.

---

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

## View metrics and logs

Use standard API Management and Azure Monitor features to [monitor](api-management-howto-use-azure-monitor.md) WebSocket APIs:

* View API metrics in Azure Monitor
* Optionally enable diagnostic settings to collect and view API Management gateway logs, which include WebSocket API operations

For example, the following screenshot shows  recent WebSocket API responses with code `101` from the **ApiManagementGatewayLogs** table. These results indicate the successful switch of the requests from TCP to the WebSocket protocol.

:::image type="content" source="./media/websocket-api/query-gateway-logs.png" alt-text="Query logs for WebSocket API requests":::

## Limitations

Below are the current restrictions of WebSocket support in API Management:

* WebSocket APIs are not supported yet in the Consumption tier.
* WebSocket APIs support the following valid buffer types for messages: Close, BinaryFragment, BinaryMessage, UTF8Fragment, and UTF8Message.
* Currently, the [set-header](set-header-policy.md) policy doesn't support changing certain well-known headers, including `Host` headers, in onHandshake requests.
* During the TLS handshake with a WebSocket backend, API Management validates that the server certificate is trusted and that its subject name matches the hostname. With HTTP APIs, API Management validates that the certificate is trusted but doesn’t validate that hostname and subject match.

For WebSocket connection limits, see [API Management limits](../azure-resource-manager/management/azure-subscription-service-limits.md#api-management-limits).

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
> If you applied the policies at higher scopes (i.e., global or product) and they were inherited by a WebSocket API through the policy, they will be skipped at runtime.

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Next steps
> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)
