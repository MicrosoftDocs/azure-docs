---
title: Build AI-powered applications with Azure App Service
description: Learn how to build applications with AI capabilities using Azure OpenAI, local small language models (SLMs), and other AI features in different programming languages and frameworks.
author: cephalin
ms.author: cephalin
ms.service: azure-app-service
ms.topic: overview
ms.date: 12/12/2025
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
- [Tutorial: Build a chatbot with Azure App Service and Azure OpenAI (.NET)](tutorial-ai-openai-chatbot-dotnet.md)
- [Tutorial: Build a retrieval augmented generation app in Azure App Service with Azure OpenAI and Azure AI Search (.NET)](tutorial-ai-openai-search-dotnet.md)
- [Deploy a .NET Blazor App Connected to Azure SQL and Azure OpenAI on Azure App Service](deploy-intelligent-apps-dotnet-to-azure-sql.md)

### [Java](#tab/java)
- [Tutorial: Build a chatbot with Azure App Service and Azure OpenAI (Spring Boot)](tutorial-ai-openai-chatbot-java.md)
- [Tutorial: Build a retrieval augmented generation app in Azure App Service with Azure OpenAI and Azure AI Search (Spring Boot)](tutorial-ai-openai-search-java.md)
- Sample: [SpringBoot-Petclinic-AI-Chat-on-App-Service](https://github.com/Azure-Samples/SpringBoot-Petclinic-AI-Chat-on-App-Service)

### [Node.js](#tab/nodejs)
- [Tutorial: Build a chatbot with Azure App Service and Azure OpenAI (Express.js)](tutorial-ai-openai-chatbot-node.md)
- [Tutorial: Build a retrieval augmented generation app in Azure App Service with Azure OpenAI and Azure AI Search (Express.js)](tutorial-ai-openai-search-nodejs.md)

### [Python](#tab/python)
- [Tutorial: Build a chatbot with Azure App Service and Azure OpenAI (Flask)](tutorial-ai-openai-chatbot-python.md)
- [Tutorial: Build a retrieval augmented generation app in Azure App Service with Azure OpenAI and Azure AI Search (FastAPI)](tutorial-ai-openai-search-python.md)
- [Microsoft Foundry tutorial: Deploy an enterprise chat web app](/azure/ai-foundry/tutorials/deploy-chat-web-app?toc=/azure/app-service/toc.json&bc=/azure/bread/toc.json)
-----

## Build agentic web applications

Transform your traditional CRUD web applications for the AI era by adding agentic capabilities with frameworks like Microsoft Semantic Kernel, LangGraph, or Foundry Agent Service. Instead of users navigating forms, textboxes, and dropdowns, you can offer a conversational interface that lets users "talk to an agent" that intelligently performs the same operations your app provides. This approach enables your web app to reason, plan, and take actions on behalf of users.

### [.NET](#tab/dotnet)
- [Tutorial: Build an agentic web app in Azure App Service with Microsoft Agent Framework or Foundry Agent Service (.NET)](tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet.md)
- Blog series: Build long-running AI agents with Microsoft Agent Framework
  - [Part 1: Build long-running AI agents on Azure App Service with Microsoft Agent Framework](https://techcommunity.microsoft.com/blog/appsonazureblog/build-long-running-ai-agents-on-azure-app-service-with-microsoft-agent-framework/4463159)
  - [Part 2: Build long-running AI agents on Azure App Service with Microsoft Agent Framework](https://techcommunity.microsoft.com/blog/appsonazureblog/part-2-build-long-running-ai-agents-on-azure-app-service-with-microsoft-agent-fr/4465825)
  - [Part 3: Client-side multi-agent orchestration on Azure App Service with Microsoft Agent Framework](https://techcommunity.microsoft.com/blog/appsonazureblog/part-3-client-side-multi-agent-orchestration-on-azure-app-service-with-microsoft/4466728)

### [Java](#tab/java)
- [Tutorial: Build an agentic web app in Azure App Service with Microsoft Semantic Kernel or Foundry Agent Service (Spring Boot)](tutorial-ai-agent-web-app-semantic-kernel-java.md)

### [Node.js](#tab/nodejs)
- [Tutorial: Build an agentic web app in Azure App Service with LangGraph or Foundry Agent Service (Node.js)](tutorial-ai-agent-web-app-langgraph-foundry-node.md)

### [Python](#tab/python)
- [Tutorial: Build an agentic web app in Azure App Service with LangGraph or Foundry Agent Service (Python)](tutorial-ai-agent-web-app-langgraph-foundry-python.md)
-----

## App Service as OpenAPI tool in Microsoft Foundry agent

Empower your existing web apps by exposing their capabilities to Foundry Agent Service using OpenAPI. Many web apps already provide REST APIs, making them ideal candidates for integration into agents that can call REST APIs as tools. By connecting Foundry Agent Service to these APIs, you can rapidly create powerful, feature-rich agents with little code.

### [.NET](#tab/dotnet)
- [Add an App Service app as a tool in Foundry Agent Service (.NET)](tutorial-ai-integrate-azure-ai-agent-dotnet.md)

### [Java](#tab/java)
- [Add an App Service app as a tool in Foundry Agent Service (Spring Boot)](tutorial-ai-integrate-azure-ai-agent-java.md)

### [Node.js](#tab/nodejs)
- [Add an App Service app as a tool in Foundry Agent Service (Node.js)](tutorial-ai-integrate-azure-ai-agent-node.md)

### [Python](#tab/python)
- [Add an App Service app as a tool in Foundry Agent Service (Python)](tutorial-ai-integrate-azure-ai-agent-python.md)
-----

## App Service as Model Context Protocol (MCP) servers

Integrate your web app as a [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) server to extend the capabilities of leading personal AI agents such as GitHub Copilot Chat, Cursor, and Winsurf. By exposing your app's APIs through MCP, you can supercharge these agents with the unique features and business logic your web app already provides, without major development effort or rearchitecture.

### [.NET](#tab/dotnet)
- [Integrate an App Service app as an MCP Server for GitHub Copilot Chat (.NET)](tutorial-ai-model-context-protocol-server-dotnet.md)
- Sample: [Host a .NET MCP server on Azure App Service](https://github.com/Azure-Samples/remote-mcp-webapp-dotnet)

### [Java](#tab/java)
- [Integrate an App Service app as an MCP Server for GitHub Copilot Chat (Spring Boot)](tutorial-ai-model-context-protocol-server-java.md)

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
- [Tutorial: Run chatbot in App Service with a Phi-4 sidecar extension (ASP.NET Core)](tutorial-ai-slm-dotnet.md)

### [Java](#tab/java)
- [Tutorial: Run chatbot in App Service with a Phi-4 sidecar extension (Spring Boot)](tutorial-ai-slm-spring-boot.md)

### [Node.js](#tab/nodejs)
- [Tutorial: Run chatbot in App Service with a Phi-4 sidecar extension (Express.js)](tutorial-ai-slm-expressjs.md)

### [Python](#tab/python)
- [Tutorial: Run chatbot in App Service with a Phi-4 sidecar extension (FastAPI)](tutorial-ai-slm-fastapi.md)
-----

## Authenticate tool calls to App Service

Secure your AI-powered applications with Microsoft Entra authentication and authorization. These guides show you how to protect your OpenAPI tools and MCP servers in Azure App Service so only authorized users and agents can access them.

- [Secure OpenAPI endpoints for Foundry Agent Service](configure-authentication-ai-foundry-openapi-tool.md) - Secure your App Service app when used as an OpenAPI tool in Foundry Agent Service with Microsoft Entra authentication
- [Configure built-in MCP server authorization (Preview)](configure-authentication-mcp.md) - Overview of authentication methods for MCP servers
- [Secure Model Context Protocol calls to Azure App Service from Visual Studio Code with Microsoft Entra authentication](configure-authentication-mcp-server-vscode.md) - Step-by-step guide to secure your MCP server for GitHub Copilot Chat in VS Code

## More resources

- [Azure OpenAI Service documentation](/azure/ai-services/openai/)
- [Semantic Kernel documentation](/semantic-kernel/)
