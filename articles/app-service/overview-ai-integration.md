---
title: Build AI-powered applications with Azure App Service
description: Learn how to build applications with AI capabilities using Azure OpenAI, local small language models (SLMs), and other AI features in different programming languages and frameworks.
author: cephalin
ms.author: cephalin
ms.service: azure-app-service
ms.topic: overview
ms.date: 06/06/2025
ms.custom:
  - build-2025
---

# Integrate AI into your Azure App Service applications

This article guides you to language-specific tutorials and resources to help you build intelligent applications with App Service.

Azure App Service makes it easy to integrate AI capabilities into your web applications across multiple programming languages and frameworks. Whether you want to use powerful Azure OpenAI models, deploy local small language models (SLMs) directly with your apps, host Model Context Protocol (MCP) servers or implement advanced patterns like retrieval augmented generation (RAG), App Service provides the flexible, secure platform you need for AI-powered applications.

App Service offers several advantages for developing and deploying AI-powered applications:

- **Native integration with Azure AI services** - Seamlessly connect to Azure OpenAI and other AI services using managed identities for secure, passwordless authentication
- **Local SLM support** - Use sidecar extensions to deploy smaller language models directly with your application
- **Enterprise-grade security** - Implement network isolation, end-to-end encryption, and role-based access control
- **Simplified DevOps with GitHub integration** - Streamline CI/CD pipelines using GitHub Actions, leverage GitHub Codespaces with integrated GitHub Copilot for AI-assisted development, and create end-to-end workflows from development to production deployment

## .NET applications

Build AI-powered .NET applications with these tutorials:

- [Build a chatbot with Azure OpenAI (Blazor)](tutorial-ai-openai-chatbot-dotnet.md) - Create a Blazor web app that connects to Azure OpenAI to generate TLDR summaries using Semantic Kernel.
- [Build a RAG application with Azure OpenAI and Azure AI Search (.NET)](tutorial-ai-openai-search-dotnet.md) - Implement RAG to enable your AI models to access and use your organization's data.
- [Build a RAG application with Azure OpenAI and Azure SQL](deploy-intelligent-apps-dotnet-to-azure-sql.md) - Use Azure SQL as a vector database for RAG applications.
- [Run a chatbot with a local SLM sidecar extension](tutorial-ai-slm-dotnet.md) - Deploy a chatbot that uses a local SLM without requiring an external AI service.
- [Invoke OpenAPI web app from Azure AI Agent](invoke-openapi-web-app-from-azure-ai-agent-service.md) - Make your web API available to AI agents.

## Java applications

Integrate AI capabilities into your Java applications:

- [Build a chatbot with Azure OpenAI (Spring Boot)](tutorial-ai-openai-chatbot-java.md) - Create a Spring Boot application that connects to Azure OpenAI using managed identity.
- [Build a RAG application with Azure OpenAI and Azure AI Search (Java)](tutorial-ai-openai-search-java.md) - Implement RAG to search through your own documents with Java.
- [Run a chatbot with a local SLM (Spring Boot)](tutorial-ai-slm-spring-boot.md) - Deploy a Spring Boot application with a local SLM sidecar.

Samples:

- [SpringBoot-Petclinic-AI-Chat-on-App-Service](https://github.com/Azure-Samples/SpringBoot-Petclinic-AI-Chat-on-App-Service)

## Node.js applications

Add AI features to your Node.js web applications:

- [Build a chatbot with Azure OpenAI (Express.js)](tutorial-ai-openai-chatbot-node.md) - Create an Express.js application that connects to Azure OpenAI using managed identity.
- [Build a RAG application with Azure OpenAI and Azure AI Search (Node.js)](tutorial-ai-openai-search-nodejs.md) - Build a RAG application with Node.js.
- [Run a chatbot with a local SLM (Express.js)](tutorial-ai-slm-expressjs.md) - Deploy an Express.js application with a local SLM sidecar.

## Python applications

Implement AI capabilities in your Python web applications:

- [Build a chatbot with Azure OpenAI (Flask)](tutorial-ai-openai-chatbot-python.md) - Create a Flask application that connects to Azure OpenAI using managed identity.
- [Build a RAG application with Azure OpenAI and Azure AI Search (Python)](tutorial-ai-openai-search-python.md) - Implement RAG with Python.
- [Run a chatbot with a local SLM (FastAPI)](tutorial-ai-slm-fastapi.md) - Deploy a FastAPI application with a local SLM sidecar.
- [Azure AI Foundry tutorial: Deploy an enterprise chat web app](/azure/ai-foundry/tutorials/deploy-chat-web-app?toc=/azure/app-service/toc.json&bc=/azure/bread/toc.json) - Deploy fully integrated AI web app straight from your deployment in Azure AI Foundry. 

## Model Context Protocol (MCP) servers

Host [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) in your web applications:

- [Host a .NET MCP server on Azure App Service](https://github.com/Azure-Samples/remote-mcp-webapp-dotnet) - Deploy an MCP server with .NET.
- [Host a Node.js MCP server on Azure App Service](https://github.com/Azure-Samples/remote-mcp-webapp-node) - Deploy an MCP server with Node.js.
- [Host a Python MCP server on Azure App Service](https://github.com/Azure-Samples/remote-mcp-webapp-python) - Deploy an MCP server with Python.
- [Host a Pyton MCP server with key-based authorization on Azure App Service](https://github.com/Azure-Samples/remote-mcp-webapp-python-auth) - Deploy an MCP server with Python and key-based authorization.
- [Host a Pyton MCP server with OAuth 2.0 authorization on Azure App Service](https://github.com/Azure-Samples/remote-mcp-webapp-python-auth-oauth) - Deploy an MCP server with Python and [Open Authorization (OAuth) 2.0 authorization with Micrososft Entra ID](/entra/architecture/auth-oauth2).

## More resources

- [Azure OpenAI Service documentation](/azure/ai-services/openai/)
- [Semantic Kernel documentation](/semantic-kernel/)
