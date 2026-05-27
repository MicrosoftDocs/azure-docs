---
title: "Quickstart: Create a hosted MCP server in Azure Connector Namespace"
description: Learn how to create a hosted MCP server in an Azure Connector Namespace and connect it to AI agents and MCP-aware clients.
author: lilyjma
ms.author: jiayma
ms.reviewer: glenga
ms.date: 05/21/2026
ms.topic: quickstart
ms.service: azure-logic-apps
ms.custom: ai-assisted
# Customer intent: As a developer, I want to create a hosted MCP server in my connector namespace so that AI agents and MCP-aware clients can discover and call tools without managing infrastructure.
---

# Quickstart: Create a hosted MCP server in Azure Connector Namespace (preview)

> [!IMPORTANT]
>
> This preview feature is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this quickstart, you create a hosted MCP server in Azure Connector Namespace and connect it to MCP clients. 

## Connector Namespace and hosted MCP server

Azure Connector Namespace is a fully managed service that hosts connectors, connections, triggers, and MCP servers. Within a namespace, an *MCP server* is a first-class resource that exposes tools to AI agents over the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/).

When you create a [hosted MCP servers](./connector-namespace-hosted-mcp.md) in Connector Namespace, the platform runs a pre-built image of the server in dedicated compute that it provisions. You control server configuration, environment variables, and parameters, while the namespace handles hosting, scaling, and credential management. AI agents like Copilot, custom agents, or any MCP-aware client discover and call the server's tools using the namespace's connection model.  

Hosted MCP servers differ from [managed MCP servers](./connector-namespace-overview.md#mcp-server), which are platform-managed implementations built on connectors. The namespace handles tool definitions and configuration for managed servers.

## Prerequisites

- An Azure account and subscription. If you don't have one, [create a free Azure account](https://azure.microsoft.com/free/).

- [Visual Studio Code](https://code.visualstudio.com/).

- [Azure CLI](/cli/azure/install-azure-cli) installed. 

- An existing Connector Namespace resource. If you don't have one, [create a connector namespace](create-connector-namespace.md).

- An existing Application Insights resource. If you don't have one, [create an application insights](../..).

## Create a hosted MCP server

This quickstart uses Playwright as the example, but the process is generally the same for other hosted MCP servers. A few servers require additional configuration artifacts during deployment. For details, see [Server deployment requirements](connector-namespace-hosted-mcp.md#server-deployment-requirements).

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your **Connector Namespace** resource.

1. Select **Connect to Namespace** to open the connector namespace portal in a new browser tab.

1. When redirected, sign in by using your Microsoft account associated with the connector namespace.

1. In the namespace instance, select **Create MCP connector**. 

1. Search for **Playwright**.

1. Wait for the required connection and server to be provisioned and deployed.

Don't close the pop-up. You'll set up an application insights resource to collect telemetry from your server. 

### Enable monitoring on the server

1. Open another tab to get the connection string of your application insights resource on Azure portal.

1. Go back to the namespace portal and click **Enable monitoring**.

1. Paste the connection string into the box and click **Enable**.

1. Click **Done** when app insights is configured.  

### Get server endpoint

1. Go to the **MCP Connectors** tab on the left menu.

1. Click the name of the server you deployed.

1. Copy the endpoint from the top.

### Connect from GitHub Copilot in Visual Studio Code

1. To connect your hosted MCP server to GitHub Copilot in VS Code, add the server configuration to your MCP settings:

   ```json
   {
     "servers": {
       "my-hosted-server": {
         "url": "<your-mcp-endpoint-url>",
         "type": "http"
       }
     }
   }
   ```

   Replace `<your-mcp-endpoint-url>` with the endpoint URL you copied from the server details page. 

1. Select **Start** above the server name. You're asked to authenticate with Microsoft. Sign in with the email you used to sign in to the Azure portal.

1. You should see the number of tools available above the server name.

1. Open Copilot agent mode, ask "What is the closest pizzeria to 11 Times Square?" 

### Connect from MCP Inspector 

1. From the terminal, run: 

   ```bash
   az login
   ```

   You'll get access token from your `az login` session to connect to the server. 

1. Get access token:

   ```bash
   MCP_TOKEN=$(az account get-access-token --resource https://apihub.azure.com --query accessToken -o tsv)
   ```

1. Connect to server:

   ```bash
   npx @modelcontextprotocol/inspector --cli \
   "<your-mcp-endpoint-url>" \
   --transport http \
   --method tools/list \
   --header "Authorization: Bearer $MCP_TOKEN"
   ```

   You should see the list of tools this server supports. 

1. Call a specific tool. For example, the following calls the `browser_navigate` tool: 

   ```bash
   npx @modelcontextprotocol/inspector --cli \
   "<your-mcp-endpoint-url>" \
   --transport http \
   --method tools/call \
   --tool-name browser_navigate \
   --tool-arg url="https://www.google.com/search?q=pizza+near+11+Times+Square+New+York" \
   --header "Authorization: Bearer $MCP_TOKEN"
   ```

> [!IMPORTANT]
> Manually passing access tokens is suitable only for local development and testing. For production scenarios, use managed identities or OAuth flows to acquire tokens automatically.

## Viewing server logs 

1. Go to the Azure portal and find the application insights resource you configured with the MCP server. 

1. On the left menu, find **Investigate -> Search**. 

1. Set the **Local Time** filter on the top to the last 30 minutes. 

## Related articles

- [What is Azure Connector Namespace?](connector-namespace-overview.md)
- [Create and manage connector namespaces](create-connector-namespace.md)