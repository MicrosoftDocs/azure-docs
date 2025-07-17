---
title: Connect and govern existing MCP server in API Management | Microsoft Docs
description: Learn how to expose and govern an existing Model Context Protocol (MCP) server in Azure API Management.
author: dlepow
ms.service: azure-api-management
ms.topic: how-to
ms.date: 07/14/2025
ms.author: danlep
ms.collection: ce-skilling-ai-copilot
ms.custom:
---

# Expose and govern an existing MCP server

[!INCLUDE [api-management-availability-premium-standard-basic-premiumv2-standardv2-basicv2](../../includes/api-management-availability-premium-standard-basic-premiumv2-standardv2-basicv2.md)]

This article shows how Azure API Management supports secure integration with existing MCP-compatible servers - tool servers hosted outside of API Management - through its built-in [AI gateway](genai-gateway-capabilities.md). 

Example scenarios include:

- Proxy [LangChain](https://python.langchain.com/) or [LangServe](https://python.langchain.com/docs/langserve/) tool servers through API Management with per-server authentication and rate limits.
- Securely expose Azure Logic Apps–based tools to copilots using IP filtering and OAuth.
- Centralize MCP server tools from Azure Functions and open-source runtimes into [Azure API Center](../api-center/register-discover-mcp-server.md).
- Enable GitHub Copilot, Claude by Anthropic, or ChatGPT to interact securely with tools across your enterprise.

API Management also supports MCP servers natively exposed in API Management from managed REST APIs. For more information, see [Expose a REST API as an MCP server](export-rest-mcp-server.md)

API Management provides centralized control over MCP server authentication, authorization, and monitoring. It simplifies the management of MCP servers while helping to mitigate common security risks and ensuring scalability.

[!INCLUDE [preview-callout-mcp-servers](includes/preview/preview-callout-mcp-servers.md)]

In this article, you learn how to:

* Connect API Management to an existing MCP server
* Configure policies for the MCP server
* Secure access to the MCP server
* Monitor the MCP server
* Validate and use the MCP server

[!INCLUDE [about-mcp-servers](../api-center/includes/about-mcp-servers.md)]

## Prerequisites

+ If you don't already have an API Management instance, complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md). 
    + Your API Management instance must be in one of the supported service tiers for preview: classic Basic, Standard, Premium, Basic v2, Standard v2, or Premium v2.
    + If your instance is in the classic Basic, Standard, or Premium tier, you must join the **AI Gateway Early** [update group](configure-service-update-settings.md) to access MCP server features. It can take up to 2 hours for the update to be applied.
+ Access to an external MCP-compatible server (for example, hosted in Azure Logic Apps, Azure Functions, LangServe, or other platforms).
+ Appropriate credentials to the MCP server (OAuth 2.0 client credentials or API keys) for secure access.
+ To test the MCP server, you can use Visual Studio Code with access to [GitHub Copilot](https://code.visualstudio.com/docs/copilot/setup).

## Expose an existing MCP Server

Follow these steps to expose an existing MCP server to API Management:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left-hand menu, select **MCP servers** > **+ Create MCP server**.
1. Select **Connect existing MCP server**.
1. In **Backend API**:
    1. Enter the existing **MCP server base URL**.
    1. Select a **Transport type**:
         - **Streamable HTTP** (default) - Server delivers data continuously over HTTP as it becomes available
         - **Server-sent events (SSE)** - Server pushes real-time updates to clients. When selected, optionally enter the following paths:
             - `/sse` - path for streaming responses
             - `/messages` - path for receiving tool requests from agents
1. In **New MCP server**:
    1. Enter a **Name** and optional **Description** for the MCP server in API Management.
    1. In **Base path**, enter a route prefix for tools. 
    1. In **Base URL**, configure the final URL where the MCP server will be accessible in API Management.
1. Select **Create**.

:::image type="content" source="media/expose-existing-mcp-server/create-mcp-server.png" alt-text="Screenshot of creating an MCP server in the portal." :::

The MCP server is connected and is listed in the **MCP servers** pane. The **URL** column shows the MCP server URL that you can call for testing or within a client application.

> [!NOTE]
> API Management doesn't display tools from the existing MCP server. All tool registration and configuration must be done on the existing remote MCP server.

[!INCLUDE [api-management-configure-test-mcp-server](../../includes/api-management-configure-test-mcp-server.md)]

