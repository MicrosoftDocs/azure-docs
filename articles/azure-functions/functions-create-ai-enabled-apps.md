---
title: Use AI tools and models in Azure Functions  
description: Describes the ways in which Azure Functions supports the use of AI in your function code executions, including LLMs, RAG, agentic workflows, and other AI-related frameworks. 
ms.topic: conceptual
ms.date: 04/29/2025
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

Azure Functions provides serverless compute resources that integrate with AI and Azure services to streamline the process of building cloud-hosted intelligent applications. This article provides a survey of the breadth of AI-related scenarios, integrations, and other AI resources that you can use in your function apps. 

Some of the inherent benefits of using Azure Functions as a compute resource for your AI-integrated tasks include:

+ **Rapid, event-driven scaling**: you have compute resources available when you need it. With certain plans, your app scales back to zero when it's not needed. For more information, see [Event-driven scaling in Azure Functions](event-driven-scaling.md).  
+ **Built-in support for Azure OpenAI**: the [OpenAI binding extension] greatly simplifies the process of interacting with Azure OpenAI for working with agents, assistants, and retrieval-augmented generation (RAG) workflows.
+ **Broad language and library support**: Functions lets you interact with AI using your [choice of programming language](./supported-languages.md), plus you're able to use a broad variety of [AI frameworks and libraries](#ai-tools-and-frameworks). 
+ **Orchestration capabilities**: while function executions are inherently stateless, the [Durable Functions extension](./durable/durable-functions-overview.md) lets you create the kind of complex workflows required by your AI agents.  

This article is language-specific, so make sure you choose your programming language at the [top of the page](#top).

## Core AI integration scenarios 

The combination of built-in bindings and broad support for external libraries provides you with a wide range of potential scenarios for augmenting your apps and solutions with the power of AI. These are some key AI integration scenarios supported by Functions.   

### Retrieval-augmented generation

Because Functions is able to handle multiple events from various data sources simultaneously, it's an effective solution for real-time AI scenarios, like RAG systems that require fast data retrieval and processing. Rapid event-driven scaling reduces the latency experienced by your customers, even in high-demand situations. 

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
> For RAG, you can use SDKs, including but not limited to Azure Open AI and Azure SDKs to build out your scenarios. This reference sample uses the [OpenAI binding extension] to highlight OpenAI RAG with Azure AI Search.

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

### Assistant function calling

Assistant function calling gives your AI assistant or agent the ability to invoke specific functions or APIs dynamically based on the context of a conversation or task. These behaviors enable assistants to interact with external systems, retrieve data, and perform other actions.

Functions is ideal for implementing assistant function calling in agentic workflows. In addition to scaling efficiently to handle demand,  [binding extensions](./functions-triggers-bindings.md) simplify the process of using Functions to connect assistants with remote Azure services. If there's no binding for your data source or you need full control over SDK behaviors, you can always manage your own client SDK connections in your app.

::: zone pivot="programming-language-java,programming-language-typescript,programming-language-powershell"
Here are some reference samples for assistant function calling scenarios:
::: zone-end
::: zone pivot="programming-language-csharp"  
**[Assistants function calling (OpenAI bindings)](https://github.com/Azure-Samples/azure-functions-assistants-openai-dotnet)**
::: zone-end
::: zone pivot="programming-language-python"  
**[Assistants function calling (OpenAI bindings)](https://github.com/Azure-Samples/azure-functions-assistants-python)**
::: zone-end
::: zone pivot="programming-language-csharp,programming-language-python"  
> Uses the [OpenAI binding extension] to enable calling custom functions with the assistant skill trigger.
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
> Uses function calling features for agents in Azure AI SDKs to implement custom functions calling.  
::: zone-end
### Remote MCP servers

The Model Context Protocol (MCP) provides a standardized way for AI models to communicate with external systems to determine their capabilities and how they can best be used by AI assistants and agents. An MCP server enables an AI model (client) to more efficiently make these determinations. 

Functions provides an MCP binding extension that simplifies the process of creating custom MCP servers in Azure. 

::: zone pivot="programming-language-java,programming-language-javascript,programming-language-powershell"
Here's an example of such a custom MCP server project: 
::: zone-end
::: zone pivot="programming-language-csharp"  
**[Remote MCP servers](https://github.com/Azure-Samples/remote-mcp-functions-dotnet)**
::: zone-end
::: zone pivot="programming-language-python"  
**[Remote MCP servers](https://github.com/Azure-Samples/remote-mcp-functions-python)**
::: zone-end
::: zone pivot="programming-language-typescript"  
**[Remote MCP servers](https://github.com/Azure-Samples/remote-mcp-functions-typescript)**
::: zone-end
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript"  
> Provides an MCP server template along with several function tool endpoints, which can be run locally and also deployed to Azure.
::: zone-end
### Agentic workflows

While it's common for AI-driven processes to autonomously determine how to interact with models and other AI assets, there are many cases where a higher level of predicability is required or where the required steps are well-defined. These directed agentic workflows are composed of an orchestration of separate tasks or interactions that agents are required to follow. 

The [Durable Functions extension](durable/durable-functions-overview.md) helps you take advantage of the strengths of Functions to create multi-step, long-running operations with built-in fault tolerance. These workflows are perfect for your directed agentic workflows. For example, a trip planning solution might first gather requirements from the user, search for plan options, obtain user approval, and finally make required bookings. In this scenario, you can build an agent for each step and then coordinate their actions as a workflow using Durable Functions. 

For more workflow scenario ideas, see [Application patterns](durable/durable-functions-overview.md#application-patterns) in Durable Functions. 

## AI tools and frameworks

Because Functions lets you build apps in your preferred language and using your favorite libraries, there's a wide range of flexibility in what AI libraries and frameworks you can use in your AI-enabled function apps. 

Here are some of the key Microsoft AI frameworks of which you should be aware:

| Framework/library | Description |
| ----- | ----- |
| [Azure AI Services SDKs](/azure/developer/ai/azure-ai-for-developers) | By working directly with client SDKs, you can use the full breadth of Azure AI services functionality directly in your function code. |
| [OpenAI binding extension] | Easily integrate the power of Azure OpenAI in your functions and let Functions manage the service integration. |
| [Semantic Kernel](/semantic-kernel/overview) | Enables you to easily build AI agents and models. |

Functions also enables your apps to reference third-party libraries and frameworks, which means that you can also use all of your favorite AI tools and libraries in your AI-enabled functions.  

## Related articles

+ [Azure Functions scenarios](functions-scenarios.md)
+ [Tutorial: Add Azure OpenAI text completion hints to your functions in Visual Studio Code](functions-add-openai-text-completion.md)

[OpenAI binding extension]: functions-bindings-openai.md
 

 

