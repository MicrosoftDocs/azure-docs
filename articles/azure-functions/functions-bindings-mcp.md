---
title: MCP tool bindings for Azure Functions
description: Learn how you can expose your functions as model context protocol (MCP) tools using bindings in Azure Functions.
ms.topic: reference
ms.date: 05/03/2025
ms.custom: 
  - build-2025
ai-usage: ai-assisted
ms.collection: 
  - ce-skilling-ai-copilot
zone_pivot_groups: programming-languages-set-functions
---


# MCP tool bindings for Azure Functions overview

The [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol) is a client-server protocol intended to enable language models and agents to more efficiently discover and use external data sources and tools. 

[!INCLUDE [functions-mcp-extension-preview-note](../../includes/functions-mcp-extension-preview-note.md)]

The Azure Functions MCP extension allows you to use Azure Functions to create remote MCP servers. Your function app implements a remote MCP server by exposing a set of endpoints that are implemented as MCP tool trigger functions. MCP clients, such as language models and agents, can query and access these tools to do specific tasks, such as storing or accessing code snippets. MCP clients can also subscribe to your app to receive notifications about changes to the exposed tools. 

[!INCLUDE [functions-mcp-extension-powershell-note](../../includes/functions-mcp-extension-powershell-note.md)]
## Prerequisites 

+ The MCP tool trigger relies on Azure Queue storage provided by the [default host storage account](./storage-considerations.md) (`AzureWebJobsStorage`). When using managed identities, make sure that your function app has at least the equivalent of these role-based permissions in the host storage account: [Storage Queue Data Reader](/azure/role-based-access-control/built-in-roles#storage-queue-data-reader) and [Storage Queue Data Message Processor](/azure/role-based-access-control/built-in-roles#storage-queue-data-message-processor).   
+ When running locally, the MCP extension requires version 4.0.7030 of the [Azure Functions Core Tools](functions-run-local.md), or a later version.
::: zone pivot="programming-language-csharp"
+ Requires version 2.0.2 or later of the `Microsoft.Azure.Functions.Worker.Sdk` package.  

## Install extension

>[!TIP]  
>The Azure Functions MCP extension supports only the [isolated worker model](dotnet-isolated-process-guide.md). 

Add the extension to your project by installing this [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Mcp) in your preferred way:

`Microsoft.Azure.Functions.Worker.Extensions.Mcp`  
::: zone-end  

::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-python,programming-language-java"  

## Install bundle    

The MCP extension preview is part of an experimental [extension bundle], which is specified in your host.json project file. 

To use this experimental bundle in your app, replace the existing `extensionBundle` object in your project's host.json file with this JSON object:

```json
"extensionBundle": {
  "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
  "version": "[4.*, 5.0.0)"
}
```

::: zone-end

## host.json settings

[!INCLUDE [functions-host-json-section-intro](../../includes/functions-host-json-section-intro.md)]

```json
{
  "version": "2.0",
  "extensions": {
    "mcp": {
      "instructions": "Some test instructions on how to use the server",
      "serverName": "TestServer",
      "serverVersion": "2.0.0"
    }
  }
}
```

| Property | Description |
| ----- | ----- |
| **instructions** | Describes to clients how to access the remote MCP server. |
| **serverName** | A friendly name for the remote MCP server. |
| **serverVersion** | Current version of the remote MCP server. |


## Related articles

[Create a tool endpoint in your remote MCP server](./functions-bindings-mcp-trigger.md) 


[extension bundle]: ./extension-bundles.md
