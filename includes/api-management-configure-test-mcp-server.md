---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 11/13/2025
ms.author: danlep
---
## Configure policies for the MCP server

Configure one or more API Management [policies](../articles/api-management/api-management-howto-policies.md) to help manage the MCP server. The policies apply to all API operations exposed as tools in the MCP server. Use these policies to control access, authentication, and other aspects of the tools.

Learn more about configuring policies:

* [Policies in API Management](../articles/api-management/api-management-howto-policies.md)
* [Transform and protect your API](../articles/api-management/transform-api.md)
* [Set and edit policies](../articles/api-management/set-edit-policies.md)
* [Secure access to MCP server](../articles/api-management/secure-mcp-servers.md)

> [!CAUTION]
> Don't access the response body by using the `context.Response.Body` variable within MCP server policies. Doing so triggers response buffering, which interferes with the streaming behavior required by MCP servers and might cause them to malfunction.

To configure policies for the MCP server, follow these steps: 

1. In the [Azure portal](https://portal.azure.com), go to your API Management instance.
1. In the left-hand menu, under **APIs**, select **MCP Servers**.
1. Select an MCP server from the list.
1. In the left menu, under **MCP**, select **Policies**.
1. In the policy editor, add or edit the policies you want to apply to the MCP server's tools. Define the policies in XML format. 

    For example, you can add a policy to limit calls to the MCP server's tools (in this example, one call per 60 seconds per MCP session).

    ```xml
    <!-- Rate limit tool calls by Mcp-Session-Id header -->
    <set-variable name="body" value="@(context.Request.Body.As<string>(preserveContent: true))" />
    <choose>
        <when condition="@(
            Newtonsoft.Json.Linq.JObject.Parse((string)context.Variables["body"])["method"] != null 
            && Newtonsoft.Json.Linq.JObject.Parse((string)context.Variables["body"])["method"].ToString() == "tools/call"
        )">
        <rate-limit-by-key 
            calls="1" 
            renewal-period="60" 
            counter-key="@(
                context.Request.Headers.GetValueOrDefault("Mcp-Session-Id", "unknown")
            )" />
        </when>
    </choose>
    ```

    :::image type="content" source="../articles/api-management/media/export-rest-mcp-server/mcp-server-policies-small.png" alt-text="Screenshot of the policy editor for an MCP server." lightbox="../articles/api-management/media/export-rest-mcp-server/mcp-server-policies.png":::

> [!NOTE]
> API Management evaluates policies configured at the global (all APIs) scope before it evaluates policies at the MCP server scope.

## Validate and use the MCP server

Use a compliant LLM agent (such as GitHub Copilot, Semantic Kernel, or Copilot Studio) or a test client (such as `curl`) to call the API Management-hosted MCP endpoint. Ensure that the request includes appropriate headers or tokens, and confirm successful routing and response from the MCP server.

> [!TIP]
> If you use the [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector) to test an MCP server managed by API Management, use version 0.9.0.

### Add the MCP server in Visual Studio Code

In Visual Studio Code, use GitHub Copilot chat in agent mode to add the MCP server and use the tools. For background about MCP servers in Visual Studio Code, see [Use MCP Servers in VS Code](https://code.visualstudio.com/docs/copilot/chat/mcp-servers).

To add the MCP server in Visual Studio Code:

1. Use the **MCP: Add Server** command from the Command Palette. 
1. When prompted, select the server type: **HTTP (HTTP or Server Sent Events)**.
1. Enter the **Server URL** of the MCP server in API Management. For example, `https://<apim-service-name>.azure-api.net/<api-name>-mcp/mcp` for the MCP endpoint.
1. Enter a **Server ID** of your choice.
1. Select whether to save the configuration to your **workspace settings** or **user settings**. 
    * **Workspace settings** - The server configuration is saved to a `.vscode/mcp.json` file only available in the current workspace.

    * **User settings** - The server configuration is added to your global `settings.json` file and is available in all workspaces. The configuration looks similar to the following:

    :::image type="content" source="../articles/api-management/media/export-rest-mcp-server/mcp-servers-visual-studio-code.png" alt-text="Screenshot of MCP servers configured in Visual Studio Code.":::
        
Add fields to the JSON configuration for settings such as authentication header. The following example shows the configuration for an API Management subscription key passed in a header as in input value. Learn more about the [configuration format](https://code.visualstudio.com/docs/copilot/chat/mcp-servers#_configuration-format)   

:::image type="content" source="../articles/api-management/media/export-rest-mcp-server/mcp-server-with-header-visual-studio-code.png" alt-text="Screenshot of authentication header configuration for an MCP server":::

### Use tools in agent mode

After adding an MCP server in Visual Studio Code, you can use tools in agent mode.

1. In GitHub Copilot chat, select **Agent** mode and select the **Tools** button to see available tools.

    :::image type="content" source="../articles/api-management/media/export-rest-mcp-server/tools-button-visual-studio-code.png" alt-text="Screenshot of Tools button in chat.":::

1. Select one or more tools from the MCP server to be available in the chat.

    :::image type="content" source="../articles/api-management/media/export-rest-mcp-server/select-tools-visual-studio-code.png" alt-text="Screenshot of selecting tools in Visual Studio Code.":::

1. Enter a prompt in the chat to invoke the tool. For example, if you selected a tool to get information about an order, you can ask the agent about an order. 

    ```copilot-prompt
    Get information for order 2
    ```

    Select **Continue** to see the results. The agent uses the tool to call the MCP server and returns the results in the chat.
    
    :::image type="content" source="../articles/api-management/media/export-rest-mcp-server/chat-results-visual-studio-code.png" alt-text="Screenshot of chat results in Visual Studio Code.":::

## Troubleshooting and known issues

| **Problem**                                | **Cause**                                 | **Solution**                                           |
|-------------------------------------------|-------------------------------------------|--------------------------------------------------------|
| `401 Unauthorized` error from backend           | Authorization header not forwarded        | If necessary, use `set-header` policy to manually attach token         |
| API call works in API Management but fails in agent | Incorrect base URL or missing token       | Double-check security policies and endpoint            |
| MCP server streaming fails when diagnostic logs are enabled | Logging of response body or accessing response body through policy interferes with MCP transport        | Disable response body logging at the All APIs scope - see [Prerequisites](#prerequisites) |

## Related content

* [Sample: MCP Servers authorization with Protected Resource Metadata (PRM)](https://github.com/blackchoey/remote-mcp-apim-oauth-prm/)

* [Sample: Secure remote MCP servers using Azure API Management (experimental)](https://github.com/Azure-Samples/remote-mcp-apim-functions-python)

* [MCP client authorization lab](https://github.com/Azure-Samples/AI-Gateway/tree/main/labs/mcp-client-authorization)

* [Use the Azure API Management extension for VS Code to import and manage APIs](../articles/api-management/visual-studio-code-tutorial.md)

* [Register and discover remote MCP servers in Azure API Center](../articles/api-center/register-discover-mcp-server.md)

* [Expose REST API in API Management as an MCP server](../articles/api-management/export-rest-mcp-server.md)

* [Expose and govern existing MCP server](../articles/api-management/expose-existing-mcp-server.md)