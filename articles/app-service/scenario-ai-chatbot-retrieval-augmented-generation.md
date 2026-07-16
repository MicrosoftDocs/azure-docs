---
title: Build chatbots and RAG applications in Azure App Service
description: Learn how to build intelligent web apps using Azure OpenAI for chat or retrieval augmented generation (RAG). Integrate Azure OpenAI and Azure AI Search to create chatbots and RAG solutions in your preferred language.
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

# Build chatbots and RAG applications in App Service

Build intelligent web apps that use Azure OpenAI for chat or retrieval augmented generation (RAG). These tutorials show you how to integrate Azure OpenAI and (optionally) Azure AI Search to create chatbots and RAG solutions in your preferred language, using managed identities for secure authentication.

## Overview

Chatbots and Retrieval Augmented Generation (RAG) applications represent two of the most popular AI integration patterns in modern web applications. A chatbot uses a large language model to engage in natural conversations with users, while RAG enhances these conversations by grounding responses in your own data sources, reducing hallucinations and providing more accurate, contextual answers.

Azure App Service provides a comprehensive platform for hosting these intelligent applications with built-in support for:

- **Azure OpenAI integration**: Seamless connection to the latest Azure OpenAI models using managed identities
- **Azure AI Search connectivity**: Optional integration with Azure AI Search for vector search and document retrieval
- **Secure authentication**: Built-in support for managed identities eliminates the need for API keys
- **Scalability**: Automatic scaling to handle varying workloads
- **Multiple language support**: Deploy chatbots in .NET, Java, Node.js, or Python

## When to use chatbots and RAG

Consider building a chatbot or RAG application when you want to:

- **Provide conversational interfaces**: Replace traditional form-based UIs with natural language interactions
- **Enable intelligent document search**: Allow users to query large document repositories using natural language
- **Create customer support assistants**: Build AI-powered help desks that understand context and provide accurate responses
- **Develop knowledge bases**: Transform static documentation into interactive Q&A systems
- **Build internal tools**: Create employee-facing assistants that can access and explain company data

RAG is particularly valuable when you need to ensure your AI responses are grounded in specific, up-to-date information from your organization's data sources, such as product catalogs, documentation, policies, or customer records.

## Get started with tutorials

## [.NET](#tab/dotnet)
- [Build a chatbot with Azure OpenAI (Blazor)](tutorial-ai-openai-chatbot-dotnet.md)
- [Build a RAG application with Azure OpenAI and Azure AI Search (.NET)](tutorial-ai-openai-search-dotnet.md)
- [Build a RAG application with Azure OpenAI and Azure SQL](deploy-intelligent-apps-dotnet-to-azure-sql.md)

## [Java](#tab/java)
- [Build a chatbot with Azure OpenAI (Spring Boot)](tutorial-ai-openai-chatbot-java.md)
- [Build a RAG application with Azure OpenAI and Azure AI Search (Java)](tutorial-ai-openai-search-java.md)
- Sample: [SpringBoot-Petclinic-AI-Chat-on-App-Service](https://github.com/Azure-Samples/SpringBoot-Petclinic-AI-Chat-on-App-Service)

## [Node.js](#tab/nodejs)
- [Build a chatbot with Azure OpenAI (Express.js)](tutorial-ai-openai-chatbot-node.md)
- [Build a RAG application with Azure OpenAI and Azure AI Search (Node.js)](tutorial-ai-openai-search-nodejs.md)

## [Python](#tab/python)
- [Build a chatbot with Azure OpenAI (Flask)](tutorial-ai-openai-chatbot-python.md)
- [Build a RAG application with Azure OpenAI and Azure AI Search (Python)](tutorial-ai-openai-search-python.md)
- [Microsoft Foundry tutorial: Deploy an enterprise chat web app](/azure/ai-foundry/tutorials/deploy-chat-web-app?toc=/azure/app-service/toc.json&bc=/azure/bread/toc.json)
-----

## Related content

- [Integrate AI into your Azure App Service applications](overview-ai-integration.md)
- [Azure OpenAI Service documentation](/azure/ai-services/openai/)
