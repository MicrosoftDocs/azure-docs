---
title: Build AI-powered applications with Azure App Service
description: Learn how to build applications with AI capabilities using Azure OpenAI, local small language models (SLMs), and other AI features in different programming languages and frameworks.
author: cephalin
ms.author: cephalin
ms.service: azure-app-service
ms.topic: overview
ms.date: 11/18/2025
ms.custom:
  - build-2025
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# Integrate AI into your Azure App Service applications


This article guides you to language-specific tutorials and resources to help you build intelligent applications with App Service.

Azure App Service makes it easy to integrate AI capabilities into your web applications across multiple programming languages and frameworks. Whether you want to use powerful Azure OpenAI models, deploy local small language models (SLMs) directly with your apps, build agentic web applications, expose your app as a tool for AI agents using OpenAPI, host Model Context Protocol (MCP) servers, or implement advanced patterns like retrieval augmented generation (RAG), App Service provides the flexible, secure platform you need for AI-powered applications.

App Service offers several advantages for developing and deploying AI-powered applications:

- **Native integration with Azure AI services** - Seamlessly connect to Azure OpenAI and other AI services using managed identities for secure, passwordless authentication
- **Local SLM support** - Use sidecar extensions to deploy smaller language models directly with your application
- **Enterprise-grade security** - Implement network isolation, end-to-end encryption, and role-based access control
- **Simplified DevOps with GitHub integration** - Streamline CI/CD pipelines using GitHub Actions, leverage GitHub Codespaces with integrated GitHub Copilot for AI-assisted development, and create end-to-end workflows from development to production deployment

## Build chatbots and RAG applications in App Service

Build intelligent web apps that use Azure OpenAI for chat or retrieval augmented generation (RAG). These tutorials show you how to integrate Azure OpenAI and (optionally) Azure AI Search to create chatbots and RAG solutions in your preferred language, using managed identities for secure authentication.

### [.NET](#tab/dotnet)
- [Build a chatbot with Azure OpenAI (Blazor)](tutorial-ai-openai-chatbot-dotnet.md)
- [Build a RAG application with Azure OpenAI and Azure AI Search (.NET)](tutorial-ai-openai-search-dotnet.md)
- [Build a RAG application with Azure OpenAI and Azure SQL](deploy-intelligent-apps-dotnet-to-azure-sql.md)

### [Java](#tab/java)
- [Build a chatbot with Azure OpenAI (Spring Boot)](tutorial-ai-openai-chatbot-java.md)
- [Build a RAG application with Azure OpenAI and Azure AI Search (Java)](tutorial-ai-openai-search-java.md)
- Sample: [SpringBoot-Petclinic-AI-Chat-on-App-Service](https://github.com/Azure-Samples/SpringBoot-Petclinic-AI-Chat-on-App-Service)

### [Node.js](#tab/nodejs)
- [Build a chatbot with Azure OpenAI (Express.js)](tutorial-ai-openai-chatbot-node.md)
- [Build a RAG application with Azure OpenAI and Azure AI Search (Node.js)](tutorial-ai-openai-search-nodejs.md)

### [Python](#tab/python)
- [Build a chatbot with Azure OpenAI (Flask)](tutorial-ai-openai-chatbot-python.md)
- [Build a RAG application with Azure OpenAI and Azure AI Search (Python)](tutorial-ai-openai-search-python.md)
- [Azure AI Foundry tutorial: Deploy an enterprise chat web app](/azure/ai-foundry/tutorials/deploy-chat-web-app?toc=/azure/app-service/toc.json&bc=/azure/bread/toc.json)
-----

## Build agentic web applications

Transform your traditional CRUD web applications for the AI era by adding agentic capabilities with frameworks like Microsoft Semantic Kernel, LangGraph, or Azure AI Foundry Agent Service. Instead of users navigating forms, textboxes, and dropdowns, you can offer a conversational interface that lets users "talk to an agent" that intelligently performs the same operations your app provides. This approach enables your web app to reason, plan, and take actions on behalf of users.

### [.NET](#tab/dotnet)
- [Tutorial: Build an agentic web app in Azure App Service with Microsoft Semantic Kernel or Azure AI Foundry Agent Service (.NET)](tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet.md)

### [Java](#tab/java)
- [Tutorial: Build an agentic web app in Azure App Service with Microsoft Semantic Kernel (Spring Boot)](tutorial-ai-agent-web-app-semantic-kernel-java.md)

### [Node.js](#tab/nodejs)
- [Tutorial: Build an agentic web app in Azure App Service with LangGraph or Azure AI Foundry Agent Service (Node.js)](tutorial-ai-agent-web-app-langgraph-foundry-node.md)

### [Python](#tab/python)
- [Tutorial: Build an agentic web app in Azure App Service with LangGraph or Azure AI Foundry Agent Service (Python)](tutorial-ai-agent-web-app-langgraph-foundry-python.md)
-----

## App Service as OpenAPI tool in Azure AI Foundry Agent

Empower your existing web apps by exposing their capabilities to Azure AI Foundry Agent Service using OpenAPI. Many web apps already provide REST APIs, making them ideal candidates for integration into agents that can call REST APIs as tools. By connecting Azure AI Foundry Agent Service to these APIs, you can rapidly create powerful, feature-rich agents with little code.

### [.NET](#tab/dotnet)
- [Add an App Service app as a tool in Azure AI Foundry Agent Service (.NET)](tutorial-ai-integrate-azure-ai-agent-dotnet.md)
- [Invoke a web app from Azure AI Foundry Agent](invoke-openapi-web-app-from-azure-ai-agent-service.md)

### [Java](#tab/java)
- [Add an App Service app as a tool in Azure AI Foundry Agent Service (Java)](tutorial-ai-integrate-azure-ai-agent-java.md)

### [Node.js](#tab/nodejs)
- [Add an App Service app as a tool in Azure AI Foundry Agent Service (Node.js)](tutorial-ai-integrate-azure-ai-agent-node.md)

### [Python](#tab/python)
- [Add an App Service app as a tool in Azure AI Foundry Agent Service (Python)](tutorial-ai-integrate-azure-ai-agent-python.md)
-----

## App Service as Model Context Protocol (MCP) servers

Integrate your web app as a [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) server to extend the capabilities of leading personal AI agents such as GitHub Copilot Chat, Cursor, and Winsurf. By exposing your app's APIs through MCP, you can supercharge these agents with the unique features and business logic your web app already provides, without major development effort or rearchitecture.

### [.NET](#tab/dotnet)
- [Integrate an App Service app as an MCP Server for GitHub Copilot Chat (.NET)](tutorial-ai-model-context-protocol-server-dotnet.md)
- Sample: [Host a .NET MCP server on Azure App Service](https://github.com/Azure-Samples/remote-mcp-webapp-dotnet)

### [Java](#tab/java)
- [Integrate an App Service app as an MCP Server for GitHub Copilot Chat (Java)](tutorial-ai-model-context-protocol-server-java.md)

### [Node.js](#tab/nodejs)
- [Integrate an App Service app as an MCP Server for GitHub Copilot Chat (Node.js)](tutorial-ai-model-context-protocol-server-node.md)
- Sample: [Host a Node.js MCP server on Azure App Service](https://github.com/Azure-Samples/remote-mcp-webapp-node)

### [Python](#tab/python)
- [Integrate an App Service app as an MCP Server for GitHub Copilot Chat (Python)](tutorial-ai-model-context-protocol-server-python.md)
- Sample: [Host a Python MCP server on Azure App Service](https://github.com/Azure-Samples/remote-mcp-webapp-python)
- Sample: [Host a Python MCP server with key-based authorization on Azure App Service](https://github.com/Azure-Samples/remote-mcp-webapp-python-auth)
- Sample: [Host a Python MCP server with OAuth 2.0 authorization on Azure App Service](https://github.com/Azure-Samples/remote-mcp-webapp-python-auth-oauth) - Deploy an MCP server with Python and [Open Authorization (OAuth) 2.0 authorization with Microsoft Entra ID](/entra/architecture/auth-oauth2).
-----

## Use a local SLM (sidecar container)

Deploy a web app with a local small language model (SLM) as a sidecar container to run AI models entirely within your App Service environment. No outbound calls or external AI service dependencies required. This approach is ideal if you have strict data privacy or compliance requirements, as all AI processing and data remain local to your app. App Service offers high-performance, memory-optimized pricing tiers needed for running SLMs in sidecars.

### [.NET](#tab/dotnet)
- [Run a chatbot with a local SLM sidecar extension](tutorial-ai-slm-dotnet.md)

### [Java](#tab/java)
- [Run a chatbot with a local SLM (Spring Boot)](tutorial-ai-slm-spring-boot.md)

### [Node.js](#tab/nodejs)
- [Run a chatbot with a local SLM (Express.js)](tutorial-ai-slm-expressjs.md)

### [Python](#tab/python)
- [Run a chatbot with a local SLM (FastAPI)](tutorial-ai-slm-fastapi.md)
-----

## More resources

- [Azure OpenAI Service documentation](/azure/ai-services/openai/)
- [Semantic Kernel documentation](/semantic-kernel/)
