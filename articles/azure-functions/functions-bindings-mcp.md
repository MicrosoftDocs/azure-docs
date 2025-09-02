---
title: Model context protocol bindings for Azure Functions
description: Learn how you can expose your functions as model context protocol (MCP) tools using bindings in Azure Functions.
ms.topic: reference
ms.date: 08/29/2025
ms.update-cycle: 180-days
ms.custom: 
  - build-2025
ai-usage: ai-assisted
ms.collection: 
  - ce-skilling-ai-copilot
zone_pivot_groups: programming-languages-set-functions
---

# Model Context Protocol bindings for Azure Functions overview

The [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol) is a client-server protocol intended to enable language models and agents to more efficiently discover and use external data sources and tools. 

[!INCLUDE [functions-mcp-extension-preview-note](../../includes/functions-mcp-extension-preview-note.md)]

The Azure Functions MCP extension allows you to use Azure Functions to create remote MCP servers. These servers can host MCP tool trigger functions, which MCP clients, such as language models and agents, can query and access to do specific tasks.

| Action | Type |
|---------|---------|
| Run a function from an MCP tool call request | [Trigger](./functions-bindings-mcp-trigger.md) |


[!INCLUDE [functions-mcp-extension-powershell-note](../../includes/functions-mcp-extension-powershell-note.md)]
## Prerequisites 

+ The MCP extension relies on Azure Queue storage provided by the [default host storage account](./storage-considerations.md) (`AzureWebJobsStorage`). When using identity-based connections, make sure that your function app has at least the equivalent of these role-based permissions in the host storage account: [Storage Queue Data Reader](/azure/role-based-access-control/built-in-roles#storage-queue-data-reader) and [Storage Queue Data Message Processor](/azure/role-based-access-control/built-in-roles#storage-queue-data-message-processor).   
+ When running locally, the MCP extension requires version 4.0.7030 of the [Azure Functions Core Tools](functions-run-local.md), or a later version.
::: zone pivot="programming-language-csharp"
+ Requires version 2.0.2 or later of the `Microsoft.Azure.Functions.Worker.Sdk` package.  

## Install extension

>[!NOTE]  
>For C#, the Azure Functions MCP extension supports only the [isolated worker model](dotnet-isolated-process-guide.md). 

Add the extension to your project by installing this [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Mcp) in your preferred way:

`Microsoft.Azure.Functions.Worker.Extensions.Mcp`
::: zone-end  

::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-python,programming-language-java"  
[!INCLUDE [functions-install-extension-bundle](../../includes/functions-install-extension-bundle.md)]
::: zone-end

## host.json settings

[!INCLUDE [functions-host-json-section-intro](../../includes/functions-host-json-section-intro.md)]

> [!NOTE]
> Until the extension is no longer in preview, the JSON schema for `host.json` isn't updated, and specific properties and behaviors might change. During the preview period, you might see warnings in your editor that say the `mcp` section isn't recognized. You can safely ignore these warnings.

You can use `host.json` to define MCP server information.

```json
{
  "version": "2.0",
  "extensions": {
    "mcp": {
      "instructions": "Some test instructions on how to use the server",
      "serverName": "TestServer",
      "serverVersion": "2.0.0",
      "messageOptions": {
        "useAbsoluteUriForEndpoint": false
      }
    }    
  }
}
```

| Property | Description |
| ----- | ----- |
| **instructions** | Describes to clients how to access the remote MCP server. |
| **serverName** | A friendly name for the remote MCP server. |
| **serverVersion** | Current version of the remote MCP server. |
| **messageOptions** | Options object for the message endpoint in the SSE transport. |
| **messageOptions.UseAbsoluteUriForEndpoint** | Defaults to `false`. Only applicable to the server-sent events (SSE) transport; this setting doesn't affect the Streamable HTTP transport. If set to `false`, the message endpoint is provided as a relative URI during initial connections over the SSE transport. If set to `true`, the message endpoint is returned as an absolute URI. Using a relative URI isn't recommended unless you have a specific reason to do so.|

## Connect to your MCP server

To connect to the MCP server exposed by your function app, you need to provide an MCP client with the appropriate endpoint and transport information. The following table shows the transports supported by the Azure Functions MCP extension, along with their corresponding connection endpoint.

| Transport | Endpoint |
| ----- | ----- |
| Streamable HTTP | `/runtime/webhooks/mcp` |
| Server-Sent Events (SSE)<sup>1</sup> | `/runtime/webhooks/mcp/sse` |

<sup>1</sup> Newer protocol versions have deprecated the Server-Sent Events transport. Unless your client specifically requires it, you should use the Streamable HTTP transport instead.

When hosted in Azure, the endpoints exposed by the extension also require the [system key](./function-keys-how-to.md) named `mcp_extension`. If it isn't provided in the `x-functions-key` HTTP header, your client receives a `401 Unauthorized` response. You can retrieve the key using any of the methods described in [Get your function access keys](./function-keys-how-to.md#get-your-function-access-keys). The following example shows how to get the key with the Azure CLI:

```azurecli
az functionapp keys list --resource-group <RESOURCE_GROUP> --name <APP_NAME> --query systemKeys.mcp_extension --output tsv
```

MCP clients accept this configuration in various ways. Consult the documentation for your chosen client. The following example shows an `mcp.json` file like you might use to [configure MCP servers for GitHub Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/customization/mcp-servers#_configuration-format). The example sets up two servers, both using the Streamable HTTP transport. The first is for local testing with the Azure Functions Core Tools. The second is for a function app hosted in Azure. The configuration takes input parameters for which VS Code prompts you when you first run the remote server. Using inputs ensures that secrets like the system key aren't saved to the file and checked into source control.

```json
{
    "inputs": [
        {
            "type": "promptString",
            "id": "functions-mcp-extension-system-key",
            "description": "Azure Functions MCP Extension System Key",
            "password": true
        },
        {
            "type": "promptString",
            "id": "functionapp-host",
            "description": "The host domain of the function app."
        }
    ],
    "servers": {
        "local-mcp-function": {
            "type": "http",
            "url": "http://localhost:7071/runtime/webhooks/mcp"
        },
        "remote-mcp-function": {
            "type": "http",
            "url": "https://${input:functionapp-host}/runtime/webhooks/mcp",
            "headers": {
                "x-functions-key": "${input:functions-mcp-extension-system-key}"
            }
        }
    }
}
```

## Related articles

[Create a tool endpoint in your remote MCP server](./functions-bindings-mcp-trigger.md) 


[extension bundle]: ./extension-bundles.md
