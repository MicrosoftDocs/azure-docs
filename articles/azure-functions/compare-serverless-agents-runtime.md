---
title: Compare the Azure Functions serverless agents runtime with other Microsoft agent options
description: "Compare the Azure Functions serverless agents runtime with Foundry agents, Copilot Studio, and Microsoft Scout to choose the right option for your scenario."
ms.topic: concept-article
ms.date: 07/21/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
#Customer intent: As a developer, I want to compare the Azure Functions serverless agents runtime with other Microsoft agent options so that I can choose the right one for my scenario or combine them.
---

# Compare the serverless agents runtime with other Microsoft agent options

Microsoft offers several ways to build and run AI agents. This article compares the Azure Functions serverless agents runtime with other Microsoft agent options so that you can choose the option that fits a given agent, or combine more than one.

These options differ mainly in the authoring model, how agents start, where they run and bill, and who the primary user is. They also share building blocks: the developer options can call the same Azure OpenAI and Foundry models, several use [Microsoft Agent Framework](/agent-framework/overview/agent-framework-overview), and the Model Context Protocol (MCP) provides a common way to share tools across them.

[!INCLUDE [serverless-agents-runtime-preview](../../includes/functions-serverless-agents-runtime-preview.md)]

## Compare the options

The following table summarizes the key differences between the ways you can create and host your agents:

| Option | Authoring model | Hosting and cost | Best suited for... |
| --- | --- | --- | --- |
| [Serverless agents runtime](functions-serverless-agents-runtime.md) | Markdown `.agent.md` files plus Python app | Azure Functions hosted with scale-to-zero | Event-driven agents that react to triggers |
| [Foundry prompt agents](/azure/ai-foundry/agents/overview?view=foundry&preserve-view=true#agent-types) | Declarative config in portal or code | Managed by Foundry with no agent compute | Agents that don't include custom code or require custom hosting |
| [Foundry hosted agents](/azure/ai-foundry/agents/concepts/hosted-agents?view=foundry&preserve-view=true) | Your code (containerized) | Managed by Foundry (container compute) | Agents with custom code running in a managed container |
| [Copilot Studio](/microsoft-copilot-studio/fundamentals-what-is-copilot-studio) | Low-code designer and natural language | Microsoft-hosted (Copilot credits) | Conversational and autonomous agents for Microsoft 365 |
| [Microsoft Scout](/microsoft-scout/overview) | Natural-language prompts | Local (on a user device) | Personal task automation on a local device |

These options aren't mutually exclusive. For example, a serverless agents runtime app can expose tools through MCP that Foundry agents or Copilot Studio agents consume.

## Related content

+ [Serverless agents runtime in Azure Functions](functions-serverless-agents-runtime.md)
+ [Serverless agents runtime reference](functions-serverless-agents-runtime-reference.md)
+ [Build serverless agents using Azure Functions](scenario-serverless-agents-runtime.md)
+ [What is Microsoft Foundry Agent Service?](/azure/ai-foundry/agents/overview?view=foundry&preserve-view=true)
+ [What is Microsoft Copilot Studio?](/microsoft-copilot-studio/fundamentals-what-is-copilot-studio)
+ [What is Microsoft Scout?](/microsoft-scout/overview)
