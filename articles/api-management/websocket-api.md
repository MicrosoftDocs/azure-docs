---
title: WebSocket and API Management
description: Learn how API Management supports WebSocket, add a WebSocket API, and understand onHandshake operation and WebSocket limitations.
ms.service: api-management
author: v-hhunter
ms.author: v-hhunter
ms.topic: how-to
ms.date: 04/28/2021
ms.custom: template-how-to 
---

# WebSocket and API Management

Alongside REST and SOAP APIs, API Management (APIM) provides native support for managing, protecting, observing, adn exposing your WebSocket APIs. 

With APIM’s new solution, you can now manage both WebSocket and REST APIs with APIM and provide a central hub for discovering and consuming all APIs. API publishers can quickly add a WebSocket API in APIM via:
* A simple gesture in the Azure portal or APIM Visual Studio Code extension, and 
* The management API and Azure Resource Manager. 

You can secure WebSocket APIs by applying existing access control policies, like JWT validation. You can also test WebSocket APIs using the API test consoles in both Azure portal and developer portal. Building on existing observability capabilities, APIM provides metrics and logs for monitoring and troubleshooting WebSocket APIs. 

In this article, you will:
> [!div class="checklist"]
> * Understand Websocket passthrough flow.
> * Add a WebSocket API to you APIM instance.
> * Test a WebSocket API using test consoles in Azure portal or developer portal.
> * View metrics and logs of WebSocket API.
> * Learn the limitations of WebSocket API.

## Prerequisites

- An existing APIM instance. [Create one if you haven't already](get-started-create-service-instance.md).
- A WebSocket subscription.

## WebSocket passthrough

APIM supports WebSocket with WebSocket passthrough. During the WebSocket passthrough the client application establishes a WebSocket connection with the APIM Gateway, which then establishes a connection with the corresponding backend services. APIM then proxies WebSocket client-server messages.

:::image type="content" source="./media/websocket-api/websocket-api-passthru.png" alt-text="Visual illustration of WebSocket passthrough flow":::

1. The client application sends a WebSocket handshake request to APIM gateway, invoking onHandshake operation.
1. APIM gateway sends WebSocket handshake request to the corresponding backend service(s). 
1. The backend service(s) upgrades a connection to WebSocket.
1. APIM gateway upgrades the corresponding connection to WebSocket. 
1. The client application sends message to APIM gateway. 
1. APIM gateway forwards the message to the backend service.
1. The backend service(s) sends a message to APIM gateway.
1. APIM gateway forwards the message to the client application. 
1. Once the connection pair is established, APIM will broker messages back and forth between the client application and backend service(s). 
1. When either side disconnects, APIM terminates the corresponding connection. 

> [!NOTE]
> The client-side and backend-side connections consist of one-to-one mapping. 

## onHandshake operation

Per the WebSocket protocol, when a client application tries to establish a WebSocket connection with a backend service, it will first send an opening handshake request. The onHandshake operation enables API publishers to intercept these handshake requests and apply APIM policies to them.

## Add a WebSocket API

1. Navigate to your APIM instance.
1. From the side navigation menu, under the **API** section, select **APIs**.
1. Under **Define a new API**, select the **WebSocket** icon.
1. In the dialog box, select **Full** and complete the required form fields.

    | Field | Description |
    |----------------|-------|
    | Display name | The name by which your WebSocket API will be displayed. |
    | Name | Raw name of the WebSocket API. Automatically populates as you type the display name. |
    | WebSocket URL | The base URL with your websocket name. For example: ws://example.com/your-socket-name |
    | Products | Associate your WebSocket API with a product to publish it. |
    | Gateways | Associate your WebSocket API with existing gateway(s). |
 
1. Click **Create**.

## Test your WebSocket API
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## View WebSocket API metrics and logs


## Limitations

WebSocket APIs are available through Azure portal and Management API. They are not currently supported in the following:
* Consumption tier
* Self-hosted gateway
* Azure CLI, PowerShell, and SDK

## Next steps
