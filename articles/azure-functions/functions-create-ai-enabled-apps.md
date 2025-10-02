---
title: Use AI tools and models in Azure Functions  
description: "Learn how Azure Functions supports AI integration in your applications, including LLMs, RAG, agentic workflows, and AI frameworks. Build scalable AI-powered serverless solutions."
ms.topic: conceptual
ms.date: 09/28/2025
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2025
ms.collection: 
  - ce-skilling-ai-copilot 
zone_pivot_groups: programming-languages-set-functions
#Customer intent: As a developer, I want to learn how I can leverage AI models, tools, and other resourtcers so that my function executions can take full advantage of all of the AI-related resources available to an Azure service.
---

# Use AI tools and models in Azure Functions

Azure Functions provides serverless compute resources that integrate with AI and Azure services to streamline building cloud-hosted intelligent applications. This article provides a survey of the breadth of AI-related scenarios, integrations, and other AI resources that you can use in your function apps. 

Some of the inherent benefits of using Azure Functions as a compute resource for your AI-integrated tasks include:

+ **Rapid, event-driven scaling**: you have compute resources available when you need them. With certain plans, your app scales back to zero when no longer needed. For more information, see [Event-driven scaling in Azure Functions](event-driven-scaling.md). 
+ **Model Context Protocol (MCP) servers**: Functions enables you to easily [create and deploy remote MCP servers](#remote-mcp-servers) to make your data and functions available to AI agents and large language models (LLMs).    
+ **Built-in support for Azure OpenAI**: the [OpenAI binding extension] greatly simplifies interacting with Azure OpenAI for both retrieval-augmented generation (RAG) and agentic workflows.
+ **Broad language and library support**: Functions lets you interact with AI using your [choice of programming language](./supported-languages.md), plus you're able to use a broad variety of [AI frameworks and libraries](#ai-tools-and-frameworks-for-azure-functions). 
+ **Orchestration capabilities**: while function executions are inherently stateless, the [Durable Functions extension](./durable/durable-functions-overview.md) lets you create complex workflows that your AI agents require.
+ 
This article is language-specific, so make sure you choose your programming language at the [top of the page](#top).

The combination of built-in bindings and broad support for external libraries provides you with a wide range of potential scenarios for augmenting your apps and solutions with the power of AI. 

The following sections introduce some key AI integration scenarios supported by Functions.   

## Retrieval-augmented generation

Because Functions can handle multiple events from various data sources simultaneously, it's an effective solution for real-time AI scenarios, like RAG systems that require fast data retrieval and processing. Rapid event-driven scaling reduces the latency your customers experience, even in high-demand situations. 

Here are some reference samples for RAG-based scenarios:

::: zone pivot="programming-language-csharp"   
**[RAG with Azure AI Search](https://github.com/Azure-Samples/azure-functions-openai-aisearch-dotnet)**
::: zone-end  
::: zone pivot="programming-language-python"   
**[RAG with Azure AI Search](https://github.com/Azure-Samples/azure-functions-openai-aisearch-python)**
::: zone-end  
::: zone pivot="programming-language-java,programming-language-typescript,programming-language-powershell"    
**[RAG with Azure AI Search](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/rag-aisearch)**
::: zone-end  
::: zone pivot="programming-language-javascript"   
**[RAG with Azure AI Search](https://github.com/Azure-Samples/azure-functions-openai-aisearch-node)**
::: zone-end  
> For RAG, you can use SDKs, including Azure Open AI and Azure SDKs, to build your scenarios.
::: zone-end  

::: zone pivot="programming-language-csharp"   
**[Custom chat bot](https://github.com/Azure-Samples/function-dotnet-ai-openai-chatgpt/)**
::: zone-end  
::: zone pivot="programming-language-python"   
**[Custom chat bot](https://github.com/Azure-Samples/function-python-ai-openai-chatgpt)**
::: zone-end   
::: zone pivot="programming-language-java,programming-language-typescript,programming-language-powershell"   
**[Custom chat bot](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/chat)**
::: zone-end   
::: zone pivot="programming-language-javascript"   
**[Custom chat bot](https://github.com/Azure-Samples/function-javascript-ai-openai-chatgpt)**
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-python" 
> Shows you how to create a friendly chat bot that issues simple prompts, receives text completions, and sends messages, all in a stateful session using the [OpenAI binding extension].
::: zone-end

## Remote MCP servers

The Model Context Protocol (MCP) provides a standardized way for AI models and agents to communicate with external systems to determine how to best make use of their capabilities. An MCP server lets an AI model or agent (client) make these determinations more efficiently. You can use an MCP server to publicly expose specific resources as tools, which are then called by agents to accomplish specific tasks. 

When you build or host your remote MCP servers in Azure Functions, you get dynamic scaling, serverless pricing models, and platform security features.

Functions supports these options for creating and hosting remote MCP servers:

+ Use the [MCP binding extension](./functions-bindings-mcp.md) to create and host custom MCP servers as you would any other function app. 
+ Self host MCP servers created using the official MCP SDKs. This hosting option is currently in preview.

Here's a comparison of the current MCP server hosting options provided by Functions:

| Feature  | [MCP binding extension] | Self-hosted MCP servers |
| ---- | ----- | ----- |
| Current support level |  GA |Preview<sup>*</sup> |
| Programming model | [Functions triggers and bindings](./functions-triggers-bindings.md) | Standard MCP SDKs |
| Stateful execution | Supported | Not currently supported | 
| Languages currently supported | C# (isolated process)<br/>Python<br/>TypeScript<br/>JavaScript<br/>Java  | C# (isolated process)<br/>Python<br/>TypeScript<br/>JavaScript<br/>Java |
| Other requirements | None | Streamable HTTP transport |
| How implemented | [MCP binding extension] | [Custom handlers](./functions-custom-handlers.md) |

<sup>*</sup>Configuration details for self-hosted MCP servers will change during the preview. 

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-typescript,programming-language-python"
Here are some options to help you get started hosting MCP servers in Functions:  
::: zone-end  
::: zone pivot="programming-language-csharp" 
 
| Options  | MCP binding extensions | Self-hosted MCP servers |
| ---- | ----- | ----- |
| Documentation | [MCP binding extension](./functions-bindings-mcp.md?pivots=programming-language-csharp)  | n/a |
| Samples | [Remote custom MCP server](https://github.com/Azure-Samples/remote-mcp-functions-dotnet) | [Weather server](https://github.com/Azure-Samples/mcp-sdk-functions-hosting-dotnet)  |
| Copilot prompts<br/>(Visual Studio Code)| n/a | [Setup prompt](https://github.com/Azure-Samples/mcp-sdk-functions-hosting-dotnet/blob/main/ExistingServer.md)<sup>†</sup>  |
| Templates | [HelloTool](https://github.com/Azure/azure-functions-templates/tree/dev/Functions.Templates/Templates/McpToolTrigger-CSharp-Isolated)  | n/a |

::: zone-end  
::: zone pivot="programming-language-python"  
 
| Options  | MCP binding extensions | Self-hosted MCP servers |
| ---- | ----- | ----- |
| Documentation | [MCP binding extensions](./functions-bindings-mcp.md?pivots=programming-language-python)  | n/a |
| Samples | [Remote custom MCP server](https://github.com/Azure-Samples/remote-mcp-functions-python) | [Weather server](https://github.com/Azure-Samples/mcp-sdk-functions-hosting-python)  |
| Copilot prompts<br/>(Visual Studio Code)| n/a | [Setup prompt](https://github.com/Azure-Samples/mcp-sdk-functions-hosting-python/blob/main/ExistingServer.md)<sup>†</sup>  |

::: zone-end  
::: zone pivot="programming-language-typescript"  
 
| Options  | MCP binding extensions | Self-hosted MCP servers |
| ---- | ----- | ----- |
| Documentation | [MCP binding extensions](./functions-bindings-mcp.md?pivots=programming-language-typescript)  | n/a |
| Samples | [Remote custom MCP server](https://github.com/Azure-Samples/remote-mcp-functions-typescript) | [Weather server](https://github.com/Azure-Samples/mcp-sdk-functions-hosting-node)  |
| Copilot prompts<br/>(Visual Studio Code)| n/a | [Setup prompt](https://github.com/Azure-Samples/mcp-sdk-functions-hosting-node/blob/main/ExistingServer.md)<sup>†</sup>  |

::: zone-end  
::: zone pivot="programming-language-javascript"  
 
| Options  | MCP binding extensions | Self-hosted MCP servers |
| ---- | ----- | ----- |
| Documentation | [MCP binding extensions](./functions-bindings-mcp.md?pivots=programming-language-javascript)  | n/a |
| Samples | n/a | [Weather server](https://github.com/Azure-Samples/mcp-sdk-functions-hosting-node)  |

::: zone-end  
::: zone pivot="programming-language-java"  

| Options  | MCP binding extensions | Self-hosted MCP servers |
| ---- | ----- | ----- |
| Documentation | [MCP binding extensions](./functions-bindings-mcp.md?pivots=programming-language-java)  | n/a |
| Samples | Not yet available | Not yet available |

::: zone-end  
::: zone pivot="programming-language-powershell"  
PowerShell isn't currently supported for either MCP server hosting options.  
::: zone-end  

<sup>†</sup>Currently consider the deployment helper chat prompt _experimental_.

## Function calling

Function calling gives your AI agent the ability to dynamically invoke specific AI tools or APIs based on the context of a conversation or task. These MCP-enabled behaviors let your agents interact with external systems, retrieve data, and perform other actions.

Functions is ideal for implementing function calling in agentic workflows. In addition to scaling efficiently to handle demand, [binding extensions](./functions-triggers-bindings.md) simplify the process of using Functions to connect agents with remote Azure services. If there's no binding for your data source or you need full control over SDK behaviors, you can manage your own client SDK connections in your app.

::: zone pivot="programming-language-java,programming-language-typescript,programming-language-powershell"
Here are some reference samples for function calling scenarios:
::: zone-end
::: zone pivot="programming-language-csharp"  
**[Agent Service function calling](https://github.com/Azure-Samples/foundry-agent-service-remote-mcp-dotnet)**
::: zone-end
::: zone pivot="programming-language-python"  
**[Agent Service function calling](https://github.com/Azure-Samples/foundry-agent-service-remote-mcp-python)**
::: zone-end
::: zone pivot="programming-language-javascript"  
**[Agent Service function calling](https://github.com/Azure-Samples/foundry-agent-service-remote-mcp-javascript)**
::: zone-end
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-javascript"  
> Uses an [Azure AI Foundry Agent Service](/azure/ai-foundry/agents/) client to call a custom remote MCP server implemented using Azure Functions.
::: zone-end
::: zone pivot="programming-language-csharp"  
**[Agents function calling (Azure AI SDKs)](https://github.com/Azure-Samples/azure-functions-ai-services-agent-dotnet)**
::: zone-end
::: zone pivot="programming-language-python"  
**[Agents function calling (Azure AI SDKs)](https://github.com/Azure-Samples/azure-functions-ai-services-agent-python)**
::: zone-end
::: zone pivot="programming-language-javascript"  
**[Agents function calling (Azure AI SDKs)](https://github.com/Azure-Samples/azure-functions-ai-services-agent-javascript)**
::: zone-end
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-javascript"  
> Uses function calling features for agents in Azure AI SDKs to implement custom function calling.  
::: zone-end

## Agentic workflows

It's common for AI-driven processes to autonomously determine how to interact with models and other AI assets. However, there are many cases where you need a higher level of predictability or where the steps are well defined. These directed agentic workflows are composed of an orchestration of separate tasks or interactions that agents are required to follow. 

The [Durable Functions extension](durable/durable-functions-overview.md) helps you take advantage of the strengths of Functions to create multi-step, long-running operations with built-in fault tolerance. These workflows work well for your directed agentic workflows. For example, a trip planning solution might first gather requirements from the user, search for plan options, obtain user approval, and finally make required bookings. In this scenario, you can build an agent for each step and then coordinate their actions as a workflow using Durable Functions. 

For more workflow scenario ideas, see [Application patterns](durable/durable-functions-overview.md#application-patterns) in Durable Functions. 

## AI tools and frameworks for Azure Functions

Functions lets you build apps in your preferred language and using your favorite libraries. Because of this flexibility, you use a wide range of AI libraries and frameworks in your AI-enabled function apps. 

Here are some of the key Microsoft AI frameworks of which you should be aware:

| Framework/library | Description |
| ----- | ----- |
| [Azure AI Foundry Agent Service](/azure/ai-foundry/agents/overview) | A fully managed service for building, deploying, and scaling AI agents with enterprise-grade security, built-in tools, and seamless integration with Azure Functions. |
| [Azure AI Services SDKs](/azure/developer/ai/azure-ai-for-developers) | By working directly with client SDKs, you can use the full breadth of Azure AI services functionality directly in your function code. |
| [OpenAI binding extension] | Easily integrate the power of Azure OpenAI in your functions and let Functions manage the service integration. |
| [Semantic Kernel](/semantic-kernel/overview) | Lets you easily build AI agents and models. |

Functions also lets your apps reference third-party libraries and frameworks, which means that you can use all of your favorite AI tools and libraries in your AI-enabled functions.  

## Related articles

+ [Azure Functions scenarios](functions-scenarios.md)
+ [Tutorial: Add Azure OpenAI text completion hints to your functions in Visual Studio Code](functions-add-openai-text-completion.md)

[OpenAI binding extension]: functions-bindings-openai.md
[MCP binding extension]: functions-bindings-mcp.md



