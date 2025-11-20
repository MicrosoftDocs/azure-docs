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

The Azure Functions MCP extension allows you to use Azure Functions to create remote MCP servers. These servers can host MCP tool trigger functions, which MCP clients, such as language models and agents, can query and access to do specific tasks.

| Action | Type |
|---------|---------|
| Run a function from an MCP tool call request | [Trigger](./functions-bindings-mcp-trigger.md) |


[!INCLUDE [functions-mcp-extension-powershell-note](../../includes/functions-mcp-extension-powershell-note.md)]
## Prerequisites 

+ When you use the SSE transport, the MCP extension relies on Azure Queue storage provided by the [default host storage account](./storage-considerations.md) (`AzureWebJobsStorage`). When using identity-based connections, make sure that your function app has at least the equivalent of these role-based permissions in the host storage account: [Storage Queue Data Reader](/azure/role-based-access-control/built-in-roles#storage-queue-data-reader) and [Storage Queue Data Message Processor](/azure/role-based-access-control/built-in-roles#storage-queue-data-message-processor).
+ When running locally, the MCP extension requires version 4.0.7030 of the [Azure Functions Core Tools](functions-run-local.md), or a later version.
::: zone pivot="programming-language-csharp"
+ Requires version 2.1.0 or later of the `Microsoft.Azure.Functions.Worker` package.
+ Requires version 2.0.2 or later of the `Microsoft.Azure.Functions.Worker.Sdk` package.

## Install extension

>[!NOTE]  
>For C#, the Azure Functions MCP extension supports only the [isolated worker model](dotnet-isolated-process-guide.md). 

Add the extension to your project by installing this [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Mcp) in your preferred way:

`Microsoft.Azure.Functions.Worker.Extensions.Mcp`  
::: zone-end
::: zone pivot="programming-language-java"
+ Requires version 3.2.2 or later of the [`azure-functions-java-library` dependency](https://central.sonatype.com/artifact/com.microsoft.azure.functions/azure-functions-java-library).
+ Requires version 1.40.0 or later of the [`azure-functions-maven-plugin` dependency](https://central.sonatype.com/artifact/com.microsoft.azure/azure-functions-maven-plugin).
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"
+ Requires version 4.9.0 or later of the [`@azure/functions` dependency](https://www.npmjs.com/package/@azure/functions)
::: zone-end
::: zone pivot="programming-language-python"
+ Requires version 1.24.0 or later of the [`azure-functions` package](https://pypi.org/project/azure-functions/).
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-python,programming-language-java"

[!INCLUDE [functions-install-extension-bundle](../../includes/functions-install-extension-bundle.md)]

::: zone-end

## host.json settings

[!INCLUDE [functions-host-json-section-intro](../../includes/functions-host-json-section-intro.md)]

You can use the `extensions.mcp` section in `host.json` to define MCP server information.

```json
{
  "version": "2.0",
  "extensions": {
    "mcp": {
      "instructions": "Some test instructions on how to use the server",
      "serverName": "TestServer",
      "serverVersion": "2.0.0",
      "encryptClientState": true,
      "messageOptions": {
        "useAbsoluteUriForEndpoint": false
      },
      "system": {
        "webhookAuthorizationLevel": "System"
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
| **encryptClientState** | Determines if client state is encrypted. Defaults to true. Setting to false may be useful for debugging and test scenarios but isn't recommended for production. |
| **messageOptions** | Options object for the message endpoint in the SSE transport. |
| **messageOptions.UseAbsoluteUriForEndpoint** | Defaults to `false`. Only applicable to the server-sent events (SSE) transport; this setting doesn't affect the Streamable HTTP transport. If set to `false`, the message endpoint is provided as a relative URI during initial connections over the SSE transport. If set to `true`, the message endpoint is returned as an absolute URI. Using a relative URI isn't recommended unless you have a specific reason to do so.|
| **system** | Options object for system-level configuration. |
| **system.webhookAuthorizationLevel** | Defines the authorization level required for the webhook endpoint. Defaults to "System". Allowed values are "System" and "Anonymous". When you set the value to "Anonymous", an access key is no longer required for requests. Regardless of if a key is required or not, you can use [built-in MCP server authorization][authorization] as an identity-based access control layer.|

## Connect to your MCP server

To connect to the MCP server exposed by your function app, you need to provide an MCP client with the appropriate endpoint and transport information. The following table shows the transports supported by the Azure Functions MCP extension, along with their corresponding connection endpoint.

| Transport | Endpoint |
| ----- | ----- |
| Streamable HTTP | `/runtime/webhooks/mcp` |
| Server-Sent Events (SSE)<sup>1</sup> | `/runtime/webhooks/mcp/sse` |

<sup>1</sup> Newer protocol versions deprecated the Server-Sent Events transport. Unless your client specifically requires it, you should use the Streamable HTTP transport instead.

When hosted in Azure, by default, the endpoints exposed by the extension also require the [system key](./function-keys-how-to.md) named `mcp_extension`. If it isn't provided in the `x-functions-key` HTTP header or in the `code` query string parameter, your client receives a `401 Unauthorized` response. You can remove this requirement by setting the `system.webhookAuthorizationLevel` property in `host.json` to `Anonymous`. For more information, see the [host.json settings](#hostjson-settings) section.

You can retrieve the key using any of the methods described in [Get your function access keys](./function-keys-how-to.md#get-your-function-access-keys). The following example shows how to get the key with the Azure CLI:

```azurecli
az functionapp keys list --resource-group <RESOURCE_GROUP> --name <APP_NAME> --query systemKeys.mcp_extension --output tsv
```

MCP clients accept this configuration in various ways. Consult the documentation for your chosen client. The following example shows an `mcp.json` file like you might use to [configure MCP servers for GitHub Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/customization/mcp-servers#_configuration-format). The example sets up two servers, both using the Streamable HTTP transport. The first is for local testing with the Azure Functions Core Tools. The second is for a function app hosted in Azure. The configuration takes input parameters for which Visual Studio Code prompts you when you first run the remote server. Using inputs ensures that secrets like the system key aren't saved to the file and checked into source control.

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

- [Create a tool endpoint in your remote MCP server](./functions-bindings-mcp-trigger.md) 
- [Configure built-in MCP server authorization][authorization]

[authorization]: ../app-service/configure-authentication-mcp.md?toc=/azure/azure-functions/toc.json
