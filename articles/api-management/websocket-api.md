---
title: WebSocket and API Management
description: Learn how API Management supports WebSocket, add a WebSocket API, and understand onHandshake operation and WebSocket limitations.
ms.service: api-management
author: v-hhunter
ms.author: v-hhunter
ms.topic: how-to
ms.date: 04/26/2021
ms.custom: template-how-to 
---

# WebSocket and API Management

Alongside REST and SOAP APIs, API Management provides native support for managing, protecting, observing, adn exposing your WebSocket APIs. 

With API Management’s new solution, customers can now manage both WebSocket and REST APIs with API Management and provide a central hub for discovering and consuming all APIs. API publishers can quickly add a WebSocket API in API Management via:
* A simple gesture in the Azure portal or API Management Visual Studio Code extension, and 
* The management API and Azure Resource Manager. 

You can secure WebSocket APIs by applying existing access control policies, like JWT validation. You can also test WebSocket APIs using the API test consoles in both Azure portal and developer portal. Building on existing observability capabilities, API Management provides metrics and logs for monitoring and troubleshooting WebSocket APIs. 

In this article, you will learn how to:
> [!div class="checklist"]
> * Add a WebSocket API to you API Management instance.
> * Understand and apply policies to onHandshake operation.
> * Test a WebSocket API using test consoles in Azure portal or developer portal.
> * View metrics and logs of WebSocket API.
> * Learn the limitations of WebSocket API.

## Prerequisites

- An existing API management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- A WebSocket subscription.

## Add a WebSocket API

1. Navigate to your API Management instance.
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

## onHandshake operation

Built into the WebSocket protocol, onHandshake streamlines client and server communication. The WebSocket connection is established and an onHandshake `GET` request is sent. onHandshake is immutable, so you can't delete the request, but you can intercept it and apply management policies and tokens.

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
