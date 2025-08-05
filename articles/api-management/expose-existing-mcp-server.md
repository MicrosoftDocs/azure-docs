---
title: Connect and govern existing MCP server in Azure API Management 
description: Learn how to expose and govern an existing Model Context Protocol (MCP) server in Azure API Management.
author: dlepow
ms.service: azure-api-management
ms.topic: how-to
ms.date: 08/04/2025
ms.author: danlep
ms.collection: ce-skilling-ai-copilot
ms.custom:
---

# Expose and govern an existing MCP server

[!INCLUDE [api-management-availability-premium-standard-basic-premiumv2-standardv2-basicv2](../../includes/api-management-availability-premium-standard-basic-premiumv2-standardv2-basicv2.md)]

This article shows how to use API Management to expose and govern an existing remote [Model Context Protocol (MCP)](https://www.anthropic.com/news/model-context-protocol) server - a tool server hosted outside of API Management. Expose and govern the server's tools through API Management so that MCP clients can call them using the MCP protocol. 

[!INCLUDE [preview-callout-mcp-servers](includes/preview/preview-callout-mcp-servers.md)]

Example scenarios include:

- Proxy [LangChain](https://python.langchain.com/) or [LangServe](https://python.langchain.com/docs/langserve/) tool servers through API Management with per-server authentication and rate limits.
- Securely expose Azure Logic Apps–based tools to copilots using IP filtering and OAuth.
- Centralize MCP server tools from Azure Functions and open-source runtimes into [Azure API Center](../api-center/register-discover-mcp-server.md).
- Enable GitHub Copilot, Claude by Anthropic, or ChatGPT to interact securely with tools across your enterprise.

API Management also supports MCP servers natively exposed in API Management from managed REST APIs. For more information, see [Expose a REST API as an MCP server](export-rest-mcp-server.md).

Learn more about:

* [MCP server support in API Management](mcp-server-overview.md)
* [AI gateway capabilities](genai-gateway-capabilities.md)

## Limitations

The following limitations apply to this preview. Preview features are subject to change, so check back for updates.

* The external MCP server must conform to MCP version `2025-06-18` or later. The server must support:
    * Either no authorization, or authorization protocols that comply with the following standards: [https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization#standards-compliance](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization#standards-compliance) 
    * Streamable HTTP transport

    > [!IMPORTANT]
    > Servers conforming to older MCP versions or using only SSE transport are not supported.

* API Management supports MCP server tool capabilities, but not MCP resources or prompts.
* MCP server capabilities aren't supported in API Management [workspaces](workspaces-overview.md).

## Prerequisites

+ If you don't already have an API Management instance, complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md). 
    + The following service tiers are supported for preview: classic Basic, Standard, Premium, Basic v2, Standard v2, or Premium v2.
    + In the classic Basic, Standard, or Premium tier, you must join the **AI Gateway Early** [update group](configure-service-update-settings.md) to access MCP server features. Allow up to 2 hours for the update to be applied.

+ Access to an external MCP-compatible server (for example, hosted in Azure Logic Apps, Azure Functions, LangServe, or other platforms).

+ Appropriate credentials to the MCP server (such as OAuth 2.0 client credentials or API keys, depending on the server) for secure access.

+ If you’ve enabled diagnostic logging via Application Insights or Azure Monitor at the global scope (All APIs) for your API Management service instance, ensure that the **Number of payload bytes to log** setting for Frontend Response is set to 0. This prevents unintended logging of response bodies across all APIs and helps ensure proper functioning of MCP servers. To log payloads selectively for specific APIs, configure the setting individually at the API scope, allowing targeted control over response logging.

+ To test the MCP server, you can use Visual Studio Code with access to [GitHub Copilot](https://code.visualstudio.com/docs/copilot/setup).

## Expose an existing MCP server

Follow these steps to expose an existing MCP server is API Management:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left-hand menu, under **APIs**, select **MCP servers** > **+ Create MCP server**.
1. Select **Expose an existing MCP server**.
1. In **Backend MCP server**:
    1. Enter the existing **MCP server base URL**. Example: `https://learn.microsoft.com/api/mcp` for the Microsoft Learn MCP server
    1. In**Transport type**, **Streamable HTTP** is selected by default.
1. In **New MCP server**:
    1. Enter a **Name** the MCP server in API Management.
    1. In **Base path**, enter a route prefix for tools. Example: `mytools`
    1. Optionally, enter a **Description** for the MCP server. 
1. Select **Create**.

:::image type="content" source="media/expose-existing-mcp-server/create-mcp-server.png" alt-text="Screenshot of creating an MCP server in the portal." :::

* The MCP server is created and the remote server's operations are exposed as tools. 
* The MCP server is listed in the **MCP Servers** pane. The **Server URL** column shows the MCP server URL to call for testing or within a client application.

:::image type="content" source="media/expose-existing-mcp-server/mcp-server-list.png" alt-text="Screenshot of the MCP server list in the portal." lightbox="media/expose-existing-mcp-server/mcp-server-list-large.png":::

> [!IMPORTANT]
> Currently, API Management doesn't display tools from the existing MCP server. All tool registration and configuration must be done on the existing remote MCP server.

[!INCLUDE [api-management-configure-test-mcp-server](../../includes/api-management-configure-test-mcp-server.md)]

