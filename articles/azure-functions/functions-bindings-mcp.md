---
title: MCP bindings for Azure Functions
description: Learn how you can expose your functions as a model content protocol (MCP) server using bindings in Azure Functions.
ms.topic: reference
ms.date: 05/03/2025
ms.custom: 
  - build-2025
ai-usage: ai-assisted
ms.collection: 
  - ce-skilling-ai-copilot
zone_pivot_groups: programming-languages-set-functions
---


# MCP bindings for Azure Functions overview

The [Model Content Protocol (MCP)](https://github.com/modelcontextprotocol) is a client-server protocol intended to enable language models and agents to more efficiently discover and leverage external data sources and tools. 

[!INCLUDE [functions-mcp-extension-preview-note](../../includes/functions-mcp-extension-preview-note.md)]

The Azure Functions MCP extension allows you to use Azure Functions to create custom MCP servers. When acting as an MCP server, your function app defines a set of function endpoints that are MCP triggers, which LLMs and agents can access to do specific tasks, such as storing or accessing code snippets. These MCP clients can also subscribe to your MCP server app to receive notifications about changes to the exposed APIs. 

[!INCLUDE [functions-mcp-extension-powershell-note](../../includes/functions-mcp-extension-powershell-note.md)]
::: zone pivot="programming-language-csharp"
## Prerequisites 

+ Requires version 2.0.2 or later of the `Microsoft.Azure.Functions.Worker.Sdk` package.  

## Install extension

>[!TIP]  
>The Azure Functions MCP extension supports only the [isolated worker model](dotnet-isolated-process-guide.md). 

Add the extension to your project by installing this [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Mcp) in your preferred way:

`Microsoft.Azure.Functions.Worker.Extensions.Mcp`  
::: zone-end  

::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java"  

## Install bundle    

The MCP extension preview is part of an experimental [extension bundle], which is specified in your host.json project file. 

To use this experimental bundle in your app, replace the existing `extensionBundle` object in your project's host.json file with this JSON object:

```json
"extensionBundle": {
  "id": "Microsoft.Azure.Functions.ExtensionBundle.Experimental",
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
| **instructions** | Decribes to clients how to access the server. |
| **serverName** | A friendly name for the server. |
| **serverVersion** | Current version of the server. |


## Related articles

[Create a tool endpoint in your MCP server](./functions-bindings-mcp-trigger.md) 


[extension bundle]: ./functions-bindings-register.md#extension-bundles
