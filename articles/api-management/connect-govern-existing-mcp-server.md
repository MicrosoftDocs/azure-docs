---
title: Connect and govern existing MCP server in API Management | Microsoft Docs
description: Learn how to connect and govern an existing Model Context Protocol (MCP) server in Azure API Management.
author: dlepow
ms.service: azure-api-management
ms.topic: how-to
ms.date: 07/14/2025
ms.author: danlep
ms.collection: ce-skilling-ai-copilot
ms.custom:
---

# Connect and govern an existing MCP server

[!INCLUDE [api-management-availability-premium-standard-basic-premiumv2-standardv2-basicv2](../../includes/api-management-availability-premium-standard-basic-premiumv2-standardv2-basicv2.md)]

This article shows how Azure API Management supports secure integration with existing MCP-compatible servers — tool servers hosted outside of API Management — through its built-in [AI gateway](genai-gateway-capabilities.md). 

Example scenarios include:

- Proxy [LangServe](https://langchain-ai.github.io/langserve/) or [LangChain](https://python.langchain.com/) tool servers through API Management with per-tool authentication and rate limits.
- Securely expose Azure Logic Apps–based tools to copilots using IP filtering and OAuth.
- Centralize MCP tools from Azure Functions and open-source runtimes into [Azure API Center](../api-center/register-discover-mcp-server.md).
- Enable GitHub Copilot, Claude by Anthropic, or ChatGPT to interact securely with tools across your enterprise.

API Management also supports MCP servers natively exposed in API Management from managed REST APIs. For more information, see [Expose a REST API as an MCP server](export-rest-mcp-server.md)

With support for existing and exposed MCP servers, API Management provides centralized control over authentication, authorization, and monitoring. It simplifies the management of MCP servers while helping to mitigate common security risks and ensuring scalability.

## Prerequisites

+ If you don't already have an API Management instance, complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md). Your API Management instance must be in one of the supported service tiers for preview: classic Basic, Standard, Premium, Basic v2, Standard v2, or Premium v2.
+ If your instance is in the classic Basic, Standard, or Premium tier, you must join the **AI Gateway Early** [update group](configure-service-update-settings.md) to access MCP server features. It can take up to 2 hours for the update to be applied.
- Access to an external MCP-compatible server (for example, hosted in Azure Logic Apps, Azure Functions, LangServe, or other platforms).
- Appropriate credentials to the MCP server (OAuth 2.0 client credentials or API keys) for secure access.
+ To test the MCP server, you can use Visual Studio Code with access to [GitHub Copilot](https://code.visualstudio.com/docs/copilot/setup).

## Connect an existing MCP Server

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left-hand menu, select **MCP servers** > **+ Create MCP server**.
1. Select **Connect existing MCP server**.
1. Enter the following details for the backend MCP server:
   - **Base URL** of the external MCP server.
   - **Metadata endpoint** (if available).
   - **Tool schema** describing the server’s capabilities.
1. Enter the following details for the frontend MCP server accessed through API Management:
   - **Display name** for the MCP server in API Management.
   - **Endpoint URL** where the MCP server will be accessible.

[!INCLUDE [api-management-configure-test-mcp-server](../../includes/api-management-configure-test-mcp-server.md)]


## Configure access and security Policies

1. Use **Credential Manager** to configure authentication:
   - Choose between **OAuth 2.0 client credentials** or **API key**.
   - Store secrets securely in **Azure Key Vault**.
2. Apply inbound policies to:
   - Inject or modify headers, tokens, and query parameters.
   - Validate requests before routing to the external server.
3. Set **rate limits and quotas** to prevent overuse and ensure fair access.

### Step 4: Enable Monitoring and Logging

1. Enable **Azure Monitor** integration to capture:
   - Diagnostic logs
   - Request/response traces
   - Usage metrics
2. Connect logs to your observability stack for auditing and analysis.

### Step 5: Validate the Connection

1. Use a compliant LLM agent (e.g., GitHub Copilot, Semantic Kernel, Copilot Studio) or a test client (e.g., Postman, curl) to call the APIM-hosted MCP endpoint.
2. Ensure the request includes appropriate headers and tokens.
3. Confirm successful routing and response from the external MCP server.


## Summary

With this enhancement, Azure API Management becomes the unified governance layer for both:
- APIs exposed as MCP servers natively in APIM
- External MCP servers hosted across various platforms

By integrating with Azure API Center, all your AI tools become discoverable, auditable, and reusable — regardless of their hosting environment.

