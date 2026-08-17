---
title: Build chatbots and RAG applications in Azure App Service
description: Learn how to build grounded agent applications in Azure App Service by using Foundry Agent Service and a Foundry IQ knowledge base.
author: cephalin
ms.author: cephalin
ms.service: azure-app-service
ms.topic: how-to
ms.date: 08/11/2026
ms.custom:
  - build-2025
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# Build chatbots and RAG applications in App Service

Retrieval augmented generation (RAG) grounds an AI application's responses in enterprise knowledge. For web apps hosted in Azure App Service, the recommended architecture uses [Foundry Agent Service](/azure/foundry/agents/overview) to host the agent and a [Foundry IQ knowledge base](/azure/foundry/agents/concepts/what-is-foundry-iq) to provide grounded retrieval and citations.

## Overview

In this architecture, the App Service web app invokes a Foundry agent. The agent uses a Foundry IQ knowledge base to retrieve relevant information from connected enterprise knowledge sources and ground its response.

```text
App Service web app
  -> Foundry Agent Service
  -> Foundry IQ knowledge base
  -> enterprise knowledge sources
```

The web app continues to invoke the same agent by name through its Foundry client. Foundry Agent Service hosts the knowledge tool, so the application doesn't need to query Azure AI Search directly or act as a Model Context Protocol (MCP) client. If the application displays sources, it can process the citation annotations returned by the agent.

Azure AI Search underpins Foundry IQ, but Search indexing and knowledge-base configuration are managed in Foundry rather than in the App Service application. For configuration details, see [Connect a Foundry IQ knowledge base to an agent](/azure/foundry/agents/how-to/foundry-iq-connect).

Foundry IQ can also be consumed by other supported clients. It isn't exclusive to Foundry Agent Service. For this App Service scenario, Foundry Agent Service is the recommended integration because it hosts the agent and its managed knowledge tool while the web app remains focused on the user experience.

## When to use chatbots and RAG

Consider building a chatbot or RAG application when you want to:

- **Provide conversational interfaces**: Replace traditional form-based UIs with natural language interactions
- **Enable intelligent document search**: Allow users to query large document repositories using natural language
- **Create customer support assistants**: Build AI-powered help desks that understand context and provide accurate responses
- **Develop knowledge bases**: Transform static documentation into interactive Q&A systems
- **Build internal tools**: Create employee-facing assistants that can access and explain company data

RAG is particularly valuable when responses must be grounded in specific, up-to-date information from your organization's data sources, such as product catalogs, documentation, policies, or customer records.

## Get started with tutorials

Choose your language and follow the **Foundry Agent Service** path in the tutorial. After the agent works with the App Service application, [connect a Foundry IQ knowledge base to the agent](/azure/foundry/agents/how-to/foundry-iq-connect). The application continues to invoke the same agent after you add knowledge.

## [.NET](#tab/dotnet)
- [Build a chatbot with Azure OpenAI (Blazor)](tutorial-ai-openai-chatbot-dotnet.md)
- [Build an agentic web app with Microsoft Agent Framework or Foundry Agent Service (.NET)](tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet.md)
- [Build a RAG application with Azure OpenAI and Azure SQL](deploy-intelligent-apps-dotnet-to-azure-sql.md)

## [Java](#tab/java)
- [Build a chatbot with Azure OpenAI (Spring Boot)](tutorial-ai-openai-chatbot-java.md)
- [Build an agentic web app with Semantic Kernel or Foundry Agent Service (Java)](tutorial-ai-agent-web-app-semantic-kernel-java.md)
- Sample: [SpringBoot-Petclinic-AI-Chat-on-App-Service](https://github.com/Azure-Samples/SpringBoot-Petclinic-AI-Chat-on-App-Service)

## [Node.js](#tab/nodejs)
- [Build a chatbot with Azure OpenAI (Express.js)](tutorial-ai-openai-chatbot-node.md)
- [Build an agentic web app with LangGraph or Foundry Agent Service (Node.js)](tutorial-ai-agent-web-app-langgraph-foundry-node.md)

## [Python](#tab/python)
- [Build a chatbot with Azure OpenAI (Flask)](tutorial-ai-openai-chatbot-python.md)
- [Build an agentic web app with LangGraph or Foundry Agent Service (Python)](tutorial-ai-agent-web-app-langgraph-foundry-python.md)
- [Microsoft Foundry tutorial: Deploy an enterprise chat web app](/azure/ai-foundry/tutorials/deploy-chat-web-app?toc=/azure/app-service/toc.json&bc=/azure/bread/toc.json)
-----

## Related content

- [Integrate AI into your Azure App Service applications](overview-ai-integration.md)
- [What is Foundry IQ?](/azure/foundry/agents/concepts/what-is-foundry-iq)
- [What is Foundry Agent Service?](/azure/foundry/agents/overview)
