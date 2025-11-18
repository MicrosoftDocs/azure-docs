---
title: Import an A2A Agent API (Preview) - Azure API Management
description: Import and manage A2A agent APIs in Azure API Management. Follow detailed steps to configure, secure, and test your AI agent APIs.
ms.service: azure-api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 11/14/2025
ms.update-cycle: 180-days
ms.collection: ce-skilling-ai-copilot
ms.custom: 
    - template-how-to
    - ignite-2025
---

# Import an A2A agent API (preview)

[!INCLUDE [api-management-availability-basicv2-standardv2-premiumv2](../../includes/api-management-availability-basicv2-standardv2-premiumv2.md)]

API Management supports managing AI agent APIs compatible with the [Agent2Agent (A2A) protocol specification](https://a2a-protocol.org/dev/specification/). The A2A protocol is an open client-server standard that enables different AI agent systems to communicate and work together using a shared interaction model. With the A2A agent API support in API Management, you can manage and govern agent APIs alongside other API types, including AI model APIs, Model Context Protocol (MCP) tools, and traditional APIs such as REST, SOAP, and GraphQL.  

> [!NOTE]
> This feature is in preview and has some [limitations](#limitations). 

Learn more about managing AI APIs in API Management:

* [AI gateway capabilities in Azure API Management](genai-gateway-capabilities.md)

## Key capabilities

When you import an A2A agent API, API Management provides the following capabilities:
* Mediates JSON-RPC runtime operations to the A2A backend. 
    * Enables governance and traffic control using policies.
    * When observability through Application Insights is enabled, adds the following A2A-specific attributes to comply with the [OpenTelemetry GenAI semantic convention](https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/):
        * `genai.agent.id` - Set to the agent ID configured in the API settings
        * `genai.agent.name`- Set to the API name in the API settings 
* Exposes the [agent card](https://a2a-protocol.org/dev/specification/#5-agent-discovery-the-agent-card) with the following transformations:  
    * Replaces the hostname with API Management instance's hostname.
    * Sets the preferred transport protocol to JSON-RPC.
    * Removes all other interfaces in `additionalInterfaces`.    
    * Rewrites security requirements to include the API Management subscription key requirement. 

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).

- An existing A2A agent with JSON-RPC operations and an agent card.

## Import A2A agent API using the portal

Use the following steps to import an A2A agent API to API Management. 

1. In the [Azure portal](https://portal.azure.com), go to your API Management instance.
1. In the left menu, under **APIs**, select **APIs** > **+ Add API**.
1. Select the **A2A Agent** tile.

    :::image type="content" source="media/agent-to-agent-api/agent-to-agent-tile.png" alt-text="Screenshot of selecting A2A agent API tile in the portal." :::

1. Under **Agent card**, enter the **URL** that points to the agent card JSON document. Select **Next**.
1. On the **Create an A2A agent API** page, configure the API settings.
    1. If the **Runtime URL** and **Agent ID** aren't automatically configured based on the agent card, then provide the runtime URL of JSON-RPC operations to your agent and the agent ID used in OpenTelemetry traces emitted by the agent (`gen_ai.agent.id` attribute).
    1. Under **General API settings**, enter a **Display name** of your choice in the API Management instance, and optionally enter a **Description**.
    1. Under **URL**, enter a **Base path** that your API Management instance uses to access the A2A agent API. API Management displays a **Base URL** that clients can use to access the JSON-RPC API, and an **Agent card URL** to access the agent card through API Management.
1. Select **Create** to create the API.

:::image type="content" source="media/agent-to-agent-api/create-agent-api.png" alt-text="Screenshot of creating an A2A agent-compatible API in the portal." lightbox="media/agent-to-agent-api/create-agent-api.png":::

## Configure policies for the A2A agent API

Configure one or more API Management [policies](api-management-howto-policies.md) to help manage the A2A agent API. 

To configure policies for your A2A agent API:

1. In the [Azure portal](https://portal.azure.com), go to your API Management instance.
1. In the left-hand menu, under **APIs**, select your A2A agent API.
1. In the left menu, under **A2A**, select **Policies**.
1. In the policy editor, add or edit the policies you want to apply to the A2A agent API. The policies are defined in XML format. 

> [!NOTE]
> API Management evaluates policies configured at the global (all APIs) scope before policies at the A2A agent API scope.

## Configure subscription key authentication

In the A2A API settings, you can optionally configure subscription key authentication through API Management. [Learn more about subscription key authentication](api-management-subscriptions.md).

1. Select the API you created in the previous step.
1. On the **Settings** page, under **Subscription**, select (enable) **Subscription required**.

If you enable subscription key authentication, clients must include a valid subscription key in the `Ocp-Apim-Subscription-Key` header or `subscription-key` query parameter when calling the A2A agent API or accessing the agent card.

## Test the A2A agent API

To make sure your A2A agent API works as expected, call the backend through API Management:

1. Select the API you created in the previous step.
1. On the **Overview** page, copy the **Runtime base URL**. Use this URL to call the A2A agent API through API Management. 
1. Configure a test client or use a tool such as [curl](https://curl.se/) to make a `POST` request to the agent. If subscription key authentication is enabled, include a valid subscription key header or query parameter in the request.

> [!TIP]
> Similarly, access the agent card through API Management by making a `GET` request to the **Agent card URL** displayed on the **Overview** page of your A2A agent API.

## Limitations

* This feature is currently available only in API Management instances in the v2 tiers.
* Only JSON-RPC-based A2A agent APIs are supported.
* Deserialization of outgoing response bodies isn't supported.

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]
