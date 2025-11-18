---
title: Self-hosted remote MCP server on Azure Functions (public preview)
description: Discover how to use Azure Functions to host stateless MCP servers with streamable HTTP transport. Includes setup guides and supported SDKs.
author: lilyjma
ms.author: jiayma
ms.topic: how-to
ms.date: 10/30/2025
ms.update-cycle: 180-days
ms.custom: 
  - ignite-2025
ai-usage: ai-assisted
ms.collection: 
  - ce-skilling-ai-copilot 
zone_pivot_groups: programming-languages-set-functions

#customer intent: As a developer, I want to understand how to host a self-hosted MCP server on Azure Functions so that I can leverage the platform's capabilities for my application.
---

# Self-hosted remote MCP server on Azure Functions (public preview)

Azure Functions provides two ways of hosting remote MCP servers:

- MCP servers created with the [Functions MCP extension](functions-bindings-mcp.md)
- MCP servers built with the [official MCP SDKs](https://modelcontextprotocol.io/docs/sdk)

With the first approach, you can use the Azure Functions programming model with triggers and bindings to build the MCP server. Then, you can host the server remotely by deploying it to a Function app. 

If you already have an MCP server created with the official MCP SDKs and just want to host it remotely, the second approach likely suits your needs. You don't need to make any code changes to the server to host it on Azure Functions. Instead, you can add the required Functions artifacts, and the server is ready to be deployed. As such, these servers are referred to as _self-hosted MCP servers_. 

:::image type="content" source="./media/functions-mcp/function-hosting.png" alt-text="Diagram showing hosting of Function app and custom handler apps.":::

This article provides an overview of self-hosted MCP servers and links to relevant articles and samples. 

## Custom handlers 

Self-hosted MCP servers deploy to the Azure Functions platform as _custom handlers_. Custom handlers are lightweight web servers that receive events from the Functions host. They provide a way to run on the Functions platform applications built with frameworks different from the Functions programming model or in languages not supported out-of-the-box. For more information, see [Azure Functions custom handlers](./functions-custom-handlers.md). 

When you deploy an MCP SDK based server to Azure Functions, you must include a _host.json_ in your project. The minimal _host.json_ looks like this: 

::: zone pivot="programming-language-python"  
```json
{
   "version": "2.0",
    "configurationProfile": "mcp-custom-handler",
    "customHandler": {
        "description": {
            "defaultExecutablePath": "python",
            "arguments": ["Path to main script file, e.g. hello_world.py"] 
        },
        "port": "<MCP server port>"
    }
}
```
::: zone-end  
::: zone pivot="programming-language-typescript,programming-language-javascript"  
```json
{
   "version": "2.0",
    "configurationProfile": "mcp-custom-handler",
    "customHandler": {
        "description": {
            "defaultExecutablePath": "npm",
            "arguments": ["run", "start"] 
        },
        "port": "<MCP server port>"
    }
}
```
::: zone-end  
::: zone pivot="programming-language-csharp"  
```json
{
   "version": "2.0",
    "configurationProfile": "mcp-custom-handler",
    "customHandler": {
        "description": {
            "defaultExecutablePath": "dotnet",
            "arguments": ["Path to the compiled DLL, e.g. HelloWorld.dll"] 
        },
        "port": "<MCP server port>"
    }
}
```

> [!NOTE]
> Because the payload deployed to Azure Functions is the content of the `bin/output` directory, the path to the compiled DLL is relative to that directory, _not_ to the project root. 

::: zone-end
::: zone pivot="programming-language-java,programming-language-powershell" 
Example not yet available.
::: zone-end  
Using a `configuration Profile` value of `mcp-custom-handler` automatically configures these Functions host settings, which are required for running your MCP server in Azure Functions: 

* `http.enableProxying` to `true`
* `http.routes` to `[{ "route": "{*route}" }]`
* `extensions.http.routePrefix` to `""`

This example shows a host.json file with extra custom handler properties set equivalent to using the `mcp-custom-handler` profile: 

```json
{
    "version": "2.0",
    "extensions": {
        "http": {
            "routePrefix": ""
        }
    },
    "customHandler": {
        "description": {
            "defaultExecutablePath": "",
            "arguments": [""]
        },
        "http": {
            "enableProxying": true, 
            "defaultAuthorizationLevel": "anonymous", 
            "routes": [ 
                {
                    "route": "{*route}",
                    // Default authorization level is `defaultAuthorizationLevel`
                },
                {
                    "route": "admin/{*route}",
                    "authorizationLevel": "admin"
                }
            ]
        }
    }
}
```

This table explains the properties of `customHandler.http`, along with default values:

| Property | What it does | Default value |
|----------|----------|----------|
| `enableProxying`   | Controls how the Azure Functions host handles HTTP requests to custom handlers. When `enableProxying` is set to `true`, the Functions host acts as a reverse proxy and forwards the entire HTTP request (including headers, body, query parameters) directly to the custom handler. This setting gives the custom handler full access to the original HTTP request details. </br> <br>When `enableProxying` is `false`, the Functions host processes the request first and transforms it into the Azure Functions request/response format before passing it to the custom handler.</br>| `false`   |
| `defaultAuthorizationLevel`   | Controls the authentication requirement for accessing custom handler endpoints. For example, `function` requires a function-specific API key to access. For more information, see [authorization levels](./functions-bindings-http-webhook-trigger.md#http-auth).  | `function`    |
| `route`    | Specifies the URL path pattern that the custom handler responds to. `{*route}` matches any URL path (such as `/`, `/mcp`, `/api/tools`, or `/anything/nested/path`) and forwards the request to the custom handler. | `{*route}` |

## Built-in server authentication

OAuth-based authentication and authorization provided by the App Service platform implements the requirements of the [MCP authorization specification](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization), such as issuing 401 challenge and exposing the Protected Resource Metadata (PRM) document. When you enable built-in authentication, clients attempting to access the server are redirected to identity providers like Microsoft Entra ID for authentication before connecting.

For more information, see [Configure built-in server authorization (preview)](../app-service/configure-authentication-mcp.md) and [Hosting MCP servers on Azure Functions](./functions-mcp-tutorial.md).

## Azure AI Foundry agent integrations

Agents in Azure AI Foundry can be [configured to use tools](./functions-mcp-tutorial.md#configure-azure-ai-foundry-agent-to-use-your-tools) in MCP servers hosted in Azure Functions. <!-- Re-add this link after the release branch is published: For more information, see [Build and register a Model Context Protocol (MCP) server](/azure/ai-foundry/mcp/build-your-own-mcp-server).-->

## Register your server in Azure API Center 

When you register your MCP server in Azure API Center, you create a private organizational tool catalog. This approach is recommended for sharing MCP servers across your organization with consistent governance and discoverability. For more information, see [Register MCP servers hosted in Azure Functions in Azure API Center](register-mcp-server-api-center.md). 

## Public preview support  

The ability to host your own SDK-based MCP servers in Functions is currently in preview and supports these features:

* **Stateless** servers that use the **streamable-http** transport. If you need your server to be stateful, consider using the Functions MCP extension. 
* Servers implemented with the Python, TypeScript, C#, or Java MCP SDKs.
* When running the project locally, you must use the Azure Functions Core Tools (`func start` command). You can't currently use `F5` to start running with the debugger.  
* Servers must be hosted as [Flex Consumption plan](./flex-consumption-plan.md) apps.

## Samples 

::: zone pivot="programming-language-python" 
+ [Quickstart](https://github.com/Azure-Samples/mcp-sdk-functions-hosting-python)
+ [Tutorial](./functions-mcp-tutorial.md)  
::: zone-end  
::: zone pivot="programming-language-typescript,programming-language-javascript"   
+ [Quickstart](https://github.com/Azure-Samples/mcp-sdk-functions-hosting-node) 
+ [Tutorial](./functions-mcp-tutorial.md) 
::: zone-end  
::: zone pivot="programming-language-csharp" 
+ [Quickstart](https://github.com/Azure-Samples/mcp-sdk-functions-hosting-dotnet)
+ [Tutorial](./functions-mcp-tutorial.md) 
::: zone-end  
::: zone pivot="programming-language-java"
Not yet available.
::: zone-end 

## Related articles

[Azure Functions custom handlers](functions-custom-handlers.md)



