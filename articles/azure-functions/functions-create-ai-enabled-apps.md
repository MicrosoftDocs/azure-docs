---
title: AI Integration Options for Azure Functions
description: "Compare Azure Functions options for hosted skills, Model Context Protocol (MCP) tools, agentic workflows, Microsoft Foundry agents, and AI frameworks."
ms.topic: concept-article
ms.date: 09/18/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2025
ms.collection: 
  - ce-skilling-ai-copilot 
zone_pivot_groups: programming-languages-set-functions-no-go
#Customer intent: As a developer, I want to learn how I can use AI models, tools, and other resources so that my function executions can take advantage of Azure AI-related resources.
---

# Use AI tools and models in Azure Functions

Azure Functions provides serverless compute resources that integrate with AI and Azure services to help you build cloud-hosted intelligent applications. This article surveys AI-related scenarios, integrations, and resources that you can use in your function apps.

Use the following table to choose an integration based on how work starts and how other components consume it:

| Option | Best fit | Invocation model | Key considerations |
| --- | --- | --- | --- |
| [Azure Functions hosted skills](#azure-functions-hosted-skills) | Add AI reasoning to event-driven workloads by using declarative instructions and tools. | Functions triggers or optional built-in HTTP and MCP endpoints | Preview |
| [Agent bindings for Python](#agent-bindings-for-python) | Add bounded Agent reasoning to a Python function while retaining code-driven control of validation, branching, errors, and outputs. | A standard Functions trigger invokes Python code, which calls an injected Microsoft Agent Framework `Agent` object | Preview; Python only |
| [Model Context Protocol (MCP) endpoint implementations](#choose-how-to-expose-an-mcp-endpoint) | Expose synchronous, reusable tools to Microsoft Foundry agents and other MCP clients. | Streamable HTTP | Choose among hosted skills, the generally available MCP extension, and preview SDK-based hosting. |
| [Queue-based Azure Functions tools](#choose-queue-based-azure-functions-tools-for-microsoft-foundry-agent-service) | Run asynchronous background tools for Microsoft Foundry agents. | Azure Queue Storage input and output queues | Foundry-specific; requires a Foundry agent with the standard setup. |
| [Agentic workflows](#agentic-workflows) | Coordinate long-running or multistep AI work that must survive restarts and waits. | Durable orchestrations started by application events | Choose direct Durable Functions orchestration or hosted-skills dynamic workflows. |

This article is language-specific, so make sure you choose your programming language at the [top of the page](#top).

## Azure Functions hosted skills

Azure Functions hosted skills is a programming model for building cloud-hosted, event-driven intelligent capabilities on Azure Functions. You define behavior with Markdown, natural-language instructions, and declarative configuration. The runtime discovers `.agent.md` files, registers triggers and endpoints, and runs hosted skills when events fire.

[!INCLUDE [functions-hosted-skills-preview](../../includes/functions-hosted-skills-preview.md)]

You don't need to write Python code to define a hosted skill. You define its behavior, triggers, and configured tools in Markdown and configuration files. If you need custom app logic beyond these configured capabilities, you can add custom Python tools.

Use Azure Functions hosted skills when you want to add intelligent behavior to an event-driven application in response to an HTTP request, schedule, message, data change, an event from a [managed connector](functions-connectors-overview.md), or other event. You can also enable an optional [built-in MCP endpoint](functions-hosted-skills-reference.md#built-in-endpoints) that exposes each hosted skill as an AI-powered tool for other applications, agents, or agent harnesses.

To get started, see these articles:

+ [Overview: Azure Functions hosted skills](functions-hosted-skills.md)
+ [Get started: Build an event-driven AI app with Azure Functions hosted skills](scenario-hosted-skills.md)
+ [Reference: Azure Functions hosted skills configuration](functions-hosted-skills-reference.md)

## Agent bindings for Python

[!INCLUDE [functions-agent-bindings-preview](../../includes/functions-agent-bindings-preview.md)]

Agent bindings add a configured Microsoft Agent Framework `Agent` object to a standard Python function invocation. The function keeps control of its trigger and deterministic application logic, and its handler decides whether, when, and how to invoke the Agent.

Use Agent bindings when the Python function is the primary execution model and Agent reasoning is one bounded part of its work. Use [Azure Functions hosted skills](#azure-functions-hosted-skills) instead when a declaratively defined hosted skill is the application's primary execution model. Use the Microsoft Agent Framework SDK directly when your code must control the complete Agent lifecycle rather than receive a configured Agent through a binding.

Agent bindings also support replay-safe Agent calls from Durable Functions orchestrations. To learn more and get started, see [Agent bindings for Python in Azure Functions](functions-agent-bindings.md).

## Tools and MCP servers

AI models and agents use _function calling_ to request external resources known as _tools_. By using function calling, models and agents can dynamically invoke specific functionality based on the context of a conversation or task.

Functions is particularly well-suited for implementing function calling in agentic workflows because it efficiently scales to handle demand and provides [binding extensions](./functions-triggers-bindings.md) that simplify connecting agents with remote Azure services. When you build or host AI tools in Functions, you also get serverless pricing models and platform security features.

MCP is the industry standard for interacting with remote servers. It provides a standardized way for AI models and agents to communicate with external systems. By using an MCP server, these AI clients can efficiently determine the tools and capabilities of an external system.

Azure Functions currently supports exposing your function code by using these types of tools: 

| Tool type | Description |
| ------ | ----- |
| [Built-in MCP endpoint for hosted skills](#azure-functions-hosted-skills) | Expose hosted skills that apply AI reasoning as tools through a built-in MCP endpoint. |
| [Remote MCP server](#choose-how-to-expose-an-mcp-endpoint) | Create deterministic MCP tools or host SDK-based MCP servers for synchronous tool calls. |
| [Queue-based Azure Functions tool](#choose-queue-based-azure-functions-tools-for-microsoft-foundry-agent-service) | Use the Microsoft Foundry-specific tool for asynchronous function calling through message queues. |

## Choose how to expose an MCP endpoint

Functions supports these options for exposing capabilities through MCP:

+ Enable the built-in MCP endpoint for Azure Functions hosted skills to expose AI-powered tools defined in `.agent.md` files. _Hosted skills are currently in preview._
+ Use the [MCP binding extension](./functions-bindings-mcp.md) to create and host deterministic MCP tools as you would any other function app.
+ Self-host MCP servers created by using the official MCP SDKs. _This hosting option is currently in preview._

Here's a comparison of the current MCP endpoint options provided by Functions:

| Feature | [Built-in MCP endpoint for hosted skills](functions-hosted-skills-reference.md#built-in-endpoints) | [MCP binding extension] | [Self-hosted MCP servers](self-hosted-mcp-servers.md) |
| --- | --- | --- | --- |
| Best fit | Expose an AI-powered hosted skill as an MCP tool. | Build deterministic MCP tools with Functions triggers and bindings. | Host an existing server built with an official MCP SDK. |
| Current support level | Preview | Generally available | Preview<sup>*</sup> |
| Programming model | `.agent.md` hosted skill | [Functions triggers and bindings](./functions-triggers-bindings.md) | Standard MCP SDKs |
| Stateful execution | Session history supported | Supported | Not currently supported |
| Custom code languages | Python (optional custom tools) | C# (isolated process)<br/>Python<br/>TypeScript<br/>JavaScript<br/>Java | C# (isolated process)<br/>Python<br/>TypeScript<br/>Java |
| Hosting plan | Flex Consumption<br/>Premium<br/>Dedicated (App Service) | Supported Azure Functions hosting plans | Flex Consumption only |
| Other requirements | Enable `builtin_endpoints.mcp` in the hosted skill | None | Stateless server that uses Streamable HTTP transport |
| How implemented | Built-in MCP endpoint in the hosted-skills runtime | [MCP binding extension] | [Custom handlers](./functions-custom-handlers.md) |

<sup>*</sup>Configuration details for self-hosted MCP servers change during the preview. 

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-typescript,programming-language-python"
Use the following language-specific resources to get started with remote MCP servers in Functions:
::: zone-end  
::: zone pivot="programming-language-csharp" 

For C#, compare these resources for the MCP extension and SDK-based hosting:

| Options | MCP binding extension | Self-hosted MCP servers |
| --- | --- | --- |
| Documentation | [MCP binding extension](./functions-bindings-mcp.md?pivots=programming-language-csharp) | Not applicable |
| Samples | [Remote custom MCP server](https://github.com/Azure-Samples/remote-mcp-functions-dotnet) | [Weather server](https://github.com/Azure-Samples/mcp-sdk-functions-hosting-dotnet) |
| Templates | [HelloTool](https://github.com/Azure/azure-functions-templates/tree/dev/Functions.Templates/Templates/McpToolTrigger-CSharp-Isolated) | Not applicable |

::: zone-end  
::: zone pivot="programming-language-python"  

For Python, compare these resources for the MCP extension and SDK-based hosting:

| Options | MCP binding extension | Self-hosted MCP servers |
| --- | --- | --- |
| Documentation | [MCP binding extension](./functions-bindings-mcp.md?pivots=programming-language-python) | Not applicable |
| Samples | [Remote custom MCP server](https://github.com/Azure-Samples/remote-mcp-functions-python) | [Weather server](https://github.com/Azure-Samples/mcp-sdk-functions-hosting-python) |

::: zone-end  
::: zone pivot="programming-language-typescript"  

For TypeScript, compare these resources for the MCP extension and SDK-based hosting:

| Options | MCP binding extension | Self-hosted MCP servers |
| --- | --- | --- |
| Documentation | [MCP binding extension](./functions-bindings-mcp.md?pivots=programming-language-typescript) | Not applicable |
| Samples | [Remote custom MCP server](https://github.com/Azure-Samples/remote-mcp-functions-typescript) | [Weather server](https://github.com/Azure-Samples/mcp-sdk-functions-hosting-node) |

::: zone-end  
::: zone pivot="programming-language-javascript"  

For JavaScript, use the MCP extension resources. SDK-based hosting is supported, but a JavaScript quickstart isn't currently available.

| Options | MCP binding extension | Self-hosted MCP servers |
| --- | --- | --- |
| Documentation | [MCP binding extension](./functions-bindings-mcp.md?pivots=programming-language-javascript) | Not applicable |
| Samples | Not yet available | Not yet available |

::: zone-end  
::: zone pivot="programming-language-java"  

For Java, use the MCP extension documentation. Language-specific samples aren't currently available.

| Options | MCP binding extension | Self-hosted MCP servers |
| --- | --- | --- |
| Documentation | [MCP binding extension](./functions-bindings-mcp.md?pivots=programming-language-java) | Not applicable |
| Samples | Not yet available | Not yet available |

::: zone-end  
::: zone pivot="programming-language-powershell"  
PowerShell isn't currently supported for either MCP server hosting option.
::: zone-end  

## Choose queue-based Azure Functions tools for Microsoft Foundry Agent Service

Microsoft Foundry Agent Service also provides an Azure Functions-specific tool for asynchronous function calling. The agent places a request in an Azure Queue Storage input queue. A queue-triggered function processes the request and returns the result through an output queue.

Use this Foundry-specific integration for background operations that don't require an immediate response and benefit from reliable message delivery and retries. For synchronous interactions or tools that you want to reuse with other AI clients, use an MCP server instead.

Queue-based Azure Functions tools require a Foundry agent with the standard setup. To review supported SDKs and build a tool, see [Use Azure Functions with Foundry Agent Service](/azure/foundry/agents/how-to/tools/azure-functions).

## Agentic workflows

Use [Durable Functions](../durable-task/common/what-is-durable-task.md) when your application code defines a reliable sequence of agent calls, model calls, approvals, and other work. Durable Functions preserves orchestration state across waits and restarts and supports common patterns such as function chaining, fan-out/fan-in, and human interaction.

If you use Azure Functions hosted skills, [dynamic workflows](functions-hosted-skills-dynamic-workflows.md) provide a preview option in which a model creates a structured plan of tool calls, subagent tasks, and waits. The hosted-skills runtime executes that plan as a Durable Functions orchestration. Use direct tool calling when work can finish in one interaction, and use a dynamic workflow when work must run beyond a single turn, fan out, wait, or survive restarts.

| Option | Who defines the workflow | Best fit | Key considerations |
| --- | --- | --- | --- |
| Direct Durable Functions orchestration | Application code | Predictable workflows with explicit control flow, retries, waits, and approvals | Use the Durable Functions programming model for your language. |
| Hosted-skills dynamic workflow | AI model | Adaptive workflows that plan tool calls, subagent tasks, waits, and fan-out at runtime | Preview; requires Azure Functions hosted skills. |

For implementation guidance, see [Application patterns](../durable-task/common/durable-task-sequence.md) and [Create and run dynamic workflows](functions-hosted-skills-dynamic-workflows-how-to.md).

## AI tools and frameworks for Azure Functions

With Functions, you can build apps in your preferred language and use your favorite libraries. Because of this flexibility, you can use a wide range of AI libraries and frameworks in your AI-enabled function apps.

These Microsoft AI platforms and frameworks support different application architectures:

| Platform or framework | Best fit | How it works with Azure Functions |
| --- | --- | --- |
| [Microsoft Agent Framework](/agent-framework/overview/agent-framework-overview) | Code-first agent logic and workflows that run in your application | Run the framework SDKs in your function code. |
| [Microsoft Foundry Agent Service](/azure/foundry/agents/overview) | Managed agents that use Functions-hosted tools | Create and manage agents as a hosted service. Foundry agents can call tools hosted by Functions through MCP, queues, or OpenAPI. |
| [Microsoft Foundry SDKs](/azure/foundry/) | Direct model and service calls that don't require a managed agent | Call Foundry models and services directly from your function code. |

In Functions, your apps can also reference third-party libraries and frameworks, so you can use all of your favorite AI tools and libraries in your AI-enabled functions.

## Related articles

+ [Azure Functions scenarios](functions-scenarios.md)
+ [Use connectors in Azure Functions](functions-connectors-overview.md)

[MCP binding extension]: functions-bindings-mcp.md
