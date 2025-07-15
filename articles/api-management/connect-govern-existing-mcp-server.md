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

Azure API Management now supports secure integration with external MCP-compatible servers — tool servers hosted outside of API Management — through its built-in [AI gateway](genai-gateway-capabilities.md). This capability adds to existing support for MCP servers [natively exposed in API Management](export-rest-mcp-server.md) from managed REST APIs. Wit this enhancement, organizations can apply consistent governance, security, and observability to all MCP tools, regardless of where they are hosted. 

This capability is essential for enterprises building AI agents and copilots that rely on tools distributed across cloud services, open-source runtimes, and internal platforms. With API Management, you can now centralize access, enforce policies, and monitor usage across your entire AI tool ecosystem.

### Example scenarios

- Proxy LangServe or LangChain tool servers through API Management with per-tool authentication and rate limits.
- Securely expose Logic App–based tools to copilots using IP filtering and OAuth.
- Centralize tools from Azure Functions and open-source runtimes into Azure API Center.
- Enable GitHub Copilot, Claude, or ChatGPT to interact securely with tools across your enterprise.


## Prerequisites

- An Azure API Management instance with the AI Gateway feature enabled.
- Access to an external MCP-compatible server (for example, hosted in Azure Logic Apps, Azure Functions, LangServe, or other platforms).
- Appropriate credentials to the MCP server (OAuth 2.0 client credentials or API keys) for secure access.



## Connect an existing MCP Server

1. Navigate to your Azure API Management instance in the Azure portal.
2. In the left-hand menu, select **MCP servers** > **+ Create MCP server**.
2. Choose **Connect existing MCP server**.
3. Enter the following details:
   - **Base URL** of the external MCP server.
   - **Metadata endpoint** (if available).
   - **Tool schema** describing the server’s capabilities.

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

## Related content

* [Python sample: Secure remote MCP servers using Azure API Management (experimental)](https://github.com/Azure-Samples/remote-mcp-apim-functions-python)

* [MCP client authorization lab](https://github.com/Azure-Samples/AI-Gateway/tree/main/labs/mcp-client-authorization)

* [Use the Azure API Management extension for VS Code to import and manage APIs](visual-studio-code-tutorial.md)

* [Register and discover remote MCP servers in Azure API Center](../api-center/register-discover-mcp-server.md)

