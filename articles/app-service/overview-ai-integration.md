---
title: Build AI-powered applications with Azure App Service
description: Learn how to build applications with AI capabilities using Azure OpenAI, local small language models (SLMs), and other AI features in different programming languages and frameworks.
author: cephalin
ms.author: cephalin
ms.service: azure-app-service
ms.topic: overview
ms.date: 01/29/2026
ms.custom:
  - build-2025
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# Integrate AI into your Azure App Service applications

Azure App Service makes it easy to integrate AI capabilities into your web applications across multiple programming languages and frameworks. Whether you want to use powerful Azure OpenAI models, deploy local small language models (SLMs) directly with your apps, build agentic web applications, expose your app as a tool for AI agents using OpenAPI, host Model Context Protocol (MCP) servers, or implement advanced patterns like retrieval augmented generation (RAG), App Service provides the flexible, secure platform you need for AI-powered applications.

## Why App Service for AI applications?

App Service offers several advantages for developing and deploying AI-powered applications:

- **Native integration with Azure AI services** - Seamlessly connect to Azure OpenAI and other AI services using managed identities for secure, passwordless authentication
- **Local SLM support** - Use sidecar extensions to deploy smaller language models directly with your application
- **Enterprise-grade security** - Implement network isolation, end-to-end encryption, and role-based access control
- **Simplified DevOps with GitHub integration** - Streamline CI/CD pipelines using GitHub Actions, leverage GitHub Codespaces with integrated GitHub Copilot for AI-assisted development, and create end-to-end workflows from development to production deployment

## AI scenarios in App Service

Explore these scenarios to find the right approach for your AI-powered application:

| Scenario | Description | Learn more |
|----------|-------------|------------|
| **Chatbots and RAG applications** | Build intelligent chatbots and RAG-powered web apps with Azure OpenAI (and optional Azure AI Search) for grounded, context-aware responses directly in App Service. | [Get started](scenario-ai-chatbot-retrieval-augmented-generation.md) |
| **Agentic web applications** | Add autonomous, reasoning AI agents to your existing CRUD web apps using frameworks like Semantic Kernel, LangGraph, or Foundry Agent Service to enable planning, multi-step actions, and natural language interactions. | [Get started](scenario-ai-agentic-web-apps.md) |
| **OpenAPI tools for Foundry agents** | Expose your App Service REST APIs as secure, callable tools via OpenAPI specs so Foundry Agent Service agents can discover and invoke them for real-world actions and data access. | [Get started](scenario-ai-openapi-tool.md) |
| **Model Context Protocol servers** | Host your App Service app as an MCP server to extend AI coding assistants like GitHub Copilot Chat, Cursor, and Winsurf with your custom business logic, APIs, and data context via the Model Context Protocol. | [Get started](scenario-ai-model-context-protocol-server.md) |
| **Local small language models** | Run small language models (e.g., Phi-3/Phi-4) entirely locally as sidecar containers in App Service for full data privacy, zero-latency inference, offline capability, and no external API calls or dependencies. | [Get started](scenario-ai-local-small-language-model.md) |
| **Secure AI applications** | Secure your OpenAPI tools, MCP servers, and AI endpoints in App Service using Microsoft Entra ID authentication, managed identities, and built-in authorization to ensure only authorized users and agents can access them. | [Get started](scenario-ai-authentication.md) |

## More resources

- [Azure OpenAI Service documentation](/azure/ai-services/openai/)
- [Semantic Kernel documentation](/semantic-kernel/)
- [Model Context Protocol](https://modelcontextprotocol.io/introduction)
