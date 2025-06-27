---
title: Expose REST API in API Management as MCP server | Microsoft Docs
description: Learn how to expose a REST API in Azure API Management as an MCP server, enabling API operations as tools accessible via the Model Context Protocol (MCP).
author: dlepow
ms.service: azure-api-management
ms.topic: how-to
ms.date: 06/27/2025
ms.author: danlep
ms.collection: ce-skilling-ai-copilot
ms.custom:
  - build-2025
---

# Expose REST API in API Management as an MCP server

[!INCLUDE [api-management-premium-standard-basic](../../includes/api-management-availability-premium-standard-basic.md)]


In API Management, you can expose a REST API managed in API Management as a remote [Model Context Protocol (MCP)](https://www.anthropic.com/news/model-context-protocol) server. Expose one or more of the API operations as tools that MCP clients can call using the MCP protocol. 

Using API Management to expose remote MCP servers provides centralized control over authentication, authorization, and monitoring. It simplifies the process of exposing APIs as MCP servers while helping to mitigate common security risks and ensuring scalability.

> [!IMPORTANT]
> This feature is being introduced in preview in the classic Basic, Standard, and Premium tiers. It's being released first to the **AI Gateway Early** [update group](configure-service-update-settings.md). After joining the group, it can take 2 hours to access MCP server features.

In this article, you learn how to:

* Expose a REST API in API Management as an MCP server
* Configure policies for the MCP server
* Test the generated MCP server from an MCP client

[!INCLUDE [about-mcp-servers](../api-center/includes/about-mcp-servers.md)]

## Prerequisites

+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md). Currently only the **Premium**, **Standard**, and **Basic** tiers of API Management support MCP servers.
+ Make sure that your instance manages a REST API that you'd like to expose as an MCP server. To import a sample API, see [Import and publish your first API](import-and-publish.md).
    > [!NOTE]
    > Only HTTP APIs from API Management can be exposed as MCP servers.
+ To test the MCP server, you can use Visual Studio Code with access to [GitHub Copilot](https://code.visualstudio.com/docs/copilot/setup).


## Expose API as an MCP server


1. In the Azure portal, access the MCP server preview at the following URL:

    ```
    https://portal.azure.com/?Microsoft_Azure_ApiManagement=mcp
    ```
1. Navigate to your API Management instance.
1. In the left menu, select **APIs** > **MCP Servers** > **+ Create new MCP Server**.
1. In **API**, select a REST API to expose as an MCP server. 
1. Select one or more **API Operations** to expose as tools. You can select all operations or only specific operations.
1. Select **Create**.

:::image type="content" source="media/export-rest-mcp-server/create-mcp-server-small.png" alt-text="Screenshot of creating an MCP server in the portal." lightbox="media/export-rest-mcp-server/create-mcp-server.png":::

The MCP server is created and the API operations are exposed as tools. The MCP server is listed in the **MCP Servers** pane. The **URL** column shows the endpoint of the MCP server that you can call for testing or within a client application.


:::image type="content" source="media/export-rest-mcp-server/mcp-server-list.png" alt-text="Screenshot of the MCP server list in the portal.":::

## Configure policies for the MCP server

Configure one or more API Management [policies](api-management-howto-policies.md) to help manage the MCP server. The policies are applied to all API operations exposed as tools in the MCP server and can be used to control access, authentication, and other aspects of the tools.

For a tutorial on how to configure policies, see [Transform and protect your API](transform-api.md).

To configure policies for the MCP server:

1. In the portal, under **APIs**, select **MCP Servers**.
1. Select the MCP server you created.
1. In the left menu, under **MCP**, select **Policies**.
1. In the policy editor, add or edit the policies you want to apply to the MCP server's tools. The policies are defined in XML format. For example, you can add a policy to limit calls to the MCP server's tools (in this example, 5 calls per 30 second per client IP address).

    ```xml
	<rate-limit-by-key calls="5" renewal-period="30" counter-key="@(context.Request.IpAddress)" remaining-calls-variable-name="remainingCallsPerIP" />
    ```

    :::image type="content" source="media/export-rest-mcp-server/mcp-server-policies-small.png" alt-text="Screenshot of the policy editor for an MCP server." lightbox="media/export-rest-mcp-server/mcp-server-policies.png":::

## Test and use the MCP server

To verify that the MCP server is working, you can use Visual Studio Code to send requests to the MCP server tools.

In Visual Studio Code, use GitHub Copilot chat in agent mode (preview) to add the MCP server and use the tools. For background about MCP servers in Visual Studio Code, see [Use MCP Servers in VS Code (Preview)](https://code.visualstudio.com/docs/copilot/chat/mcp-servers).

> [!TIP]
> If you use the [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector) to test an MCP server created by API Management, we recommend using version 0.9.0.

### Add the MCP server in Visual Studio Code

To add the MCP server in Visual Studio Code:

1. Use the **MCP: Add Server** command from the Command Palette. 

1. When prompted, select the server type: **HTTP (HTTP or Server Sent Events)**.
1. Enter the **URL of the MCP server** in API Management. Example: `https://<apim-service-name>.azure-api.net/<api-name>-mcp/sse` (for SSE endpoint) or `https://<apim-service-name>.azure-api.net/<api-name>-mcp/mcp` (for MCP endpoint)
1. Enter a **server ID** of your choice.
1. Select whether to save the configuration to your **workspace settings** or **user settings**. 
    * **Workspace settings** - The server configuration is saved to a `.vscode/mcp.json` file only available in the current workspace.

    * **User settings** - The server configuration is added to your global `settings.json` file and is available in all workspaces. The configuration looks similar to the following:

    :::image type="content" source="media/export-rest-mcp-server/mcp-servers-visual-studio-code.png" alt-text="Screenshot of MCP servers configured in Visual Studio Code.":::
        
Add fields to the JSON configuration for settings such as authentication header. The following example shows the configuration for an API Management subscription key passed in a header as in input value. Learn more about the [configuration format](https://code.visualstudio.com/docs/copilot/chat/mcp-servers#_configuration-format)   

:::image type="content" source="media/export-rest-mcp-server/mcp-server-with-header-visual-studio-code.png" alt-text="Screenshot of authentication header configuration for an MCP server":::

### Use tools in agent mode

After adding an MCP server, you can use tools in agent mode.

1. In GitHub Copilot chat, select **Agent** mode and select the **Tools** button to see available tools.

    :::image type="content" source="media/export-rest-mcp-server/tools-button-visual-studio-code.png" alt-text="Screenshot of Tools button in chat.":::

1. Select one or more tools from the MCP server to be available in the chat.

    :::image type="content" source="media/export-rest-mcp-server/select-tools-visual-studio-code.png" alt-text="Screenshot of selecting tools in Visual Studio Code.":::

1. Enter a prompt in the chat to invoke the tool. For example, if you selected a tool to get information about an order, you can ask the agent about an order. 

    ```copilot-prompt
    Get information for order 2
    ```

    Select **Continue** to see the results. The agent uses the tool to call the MCP server and returns the results in the chat.
    
    :::image type="content" source="media/export-rest-mcp-server/chat-results-visual-studio-code.png" alt-text="Screenshot of chat results in Visual Studio Code.":::

## Related content

* [Python sample: Secure remote MCP servers using Azure API Management (experimental)](https://github.com/Azure-Samples/remote-mcp-apim-functions-python)

* [MCP client authorization lab](https://github.com/Azure-Samples/AI-Gateway/tree/main/labs/mcp-client-authorization)

* [Use the Azure API Management extension for VS Code to import and manage APIs](visual-studio-code-tutorial.md)

* [Register and discover remote MCP servers in Azure API Center](../api-center/register-discover-mcp-server.md)

