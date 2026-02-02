---
title: Build agentic web applications in Azure App Service
description: Transform traditional CRUD web applications for the AI era by adding agentic capabilities with frameworks like Microsoft Semantic Kernel, LangGraph, or Foundry Agent Service.
author: cephalin
ms.author: cephalin
ms.service: azure-app-service
ms.topic: how-to
ms.date: 01/29/2026
ms.custom:
  - build-2025
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# Build agentic web applications

Transform your traditional CRUD web applications for the AI era by adding agentic capabilities with frameworks like Microsoft Semantic Kernel, LangGraph, or Foundry Agent Service. Instead of users navigating forms, textboxes, and dropdowns, you can offer a conversational interface that lets users "talk to an agent" that intelligently performs the same operations your app provides. This approach enables your web app to reason, plan, and take actions on behalf of users.

## Overview

Agentic web applications represent a paradigm shift from traditional web interfaces. Rather than requiring users to understand and navigate your application's structure, agentic apps use AI to understand user intent, plan multi-step actions, and execute complex workflows autonomously.

Key characteristics of agentic web applications include:

- **Conversational interfaces**: Users express goals in natural language rather than clicking through forms
- **Autonomous reasoning**: Agents break down complex requests into executable steps
- **Multi-step planning**: Agents chain multiple operations to accomplish sophisticated tasks
- **Tool usage**: Agents call your existing APIs and functions as needed to complete user requests
- **Context awareness**: Agents maintain conversation history and application state across interactions
- **Error handling**: Agents recover from failures and adapt their approach based on results

Frameworks like Semantic Kernel, LangGraph, and Foundry Agent Service provide the orchestration layer that connects large language models with your application's business logic, enabling these agentic capabilities in your App Service applications.

## When to build agentic web applications

Consider adding agentic capabilities when:

- **Complex workflows are common**: Users frequently need to perform multi-step operations that could be simplified through conversation
- **Domain expertise is required**: Your application requires specialized knowledge that an AI agent can learn and apply
- **User experience matters**: You want to reduce training time and make your application more intuitive
- **Data exploration is important**: Users need to query, analyze, and visualize data in flexible ways
- **Task automation is valuable**: Repetitive or time-consuming workflows could benefit from AI-assisted completion

Agentic patterns work especially well for enterprise applications, data analysis tools, content management systems, and administrative interfaces where the combination of natural language understanding and automated workflows provides significant productivity gains.

## Choosing an agent framework

App Service supports any agent framework that runs on your chosen language stack. You have complete flexibility to use the tools and frameworks that best fit your needs. Popular options include:

- **Semantic Kernel**: Microsoft's cross-platform SDK for .NET, Python, and Java, ideal for building custom agents with full control
- **LangGraph**: Python and JavaScript framework for building stateful, multi-agent systems with complex workflows
- **Foundry Agent Service**: Managed service for hosting production-ready agents with built-in monitoring and scalability
- **Custom frameworks**: Any other agentic framework supported by your language (e.g., AutoGen, CrewAI, or proprietary solutions)

## Get started with tutorials

## [.NET](#tab/dotnet)
- [Tutorial: Build an agentic web app in Azure App Service with Microsoft Semantic Kernel or Foundry Agent Service (.NET)](tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet.md)
- Blog series: Build long-running AI agents with Microsoft Agent Framework
  - [Part 1: Build long-running AI agents on Azure App Service with Microsoft Agent Framework](https://techcommunity.microsoft.com/blog/appsonazureblog/build-long-running-ai-agents-on-azure-app-service-with-microsoft-agent-framework/4463159)
  - [Part 2: Build long-running AI agents on Azure App Service with Microsoft Agent Framework](https://techcommunity.microsoft.com/blog/appsonazureblog/part-2-build-long-running-ai-agents-on-azure-app-service-with-microsoft-agent-fr/4465825)
  - [Part 3: Client-side multi-agent orchestration on Azure App Service with Microsoft Agent Framework](https://techcommunity.microsoft.com/blog/appsonazureblog/part-3-client-side-multi-agent-orchestration-on-azure-app-service-with-microsoft/4466728)

## [Java](#tab/java)
- [Tutorial: Build an agentic web app in Azure App Service with Microsoft Semantic Kernel (Spring Boot)](tutorial-ai-agent-web-app-semantic-kernel-java.md)

## [Node.js](#tab/nodejs)
- [Tutorial: Build an agentic web app in Azure App Service with LangGraph or Foundry Agent Service (Node.js)](tutorial-ai-agent-web-app-langgraph-foundry-node.md)

## [Python](#tab/python)
- [Tutorial: Build an agentic web app in Azure App Service with LangGraph or Foundry Agent Service (Python)](tutorial-ai-agent-web-app-langgraph-foundry-python.md)
-----

## Related content

- [Integrate AI into your Azure App Service applications](overview-ai-integration.md)
- [Semantic Kernel documentation](/semantic-kernel/)
