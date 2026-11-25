---
title: Azure Developer CLI (azd) templates for Azure Container Apps
description: Find Microsoft and community-authored Azure Developer CLI (AZD) templates for Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: landing-page
ms.date: 10/27/2026
ms.author: cshoe
ai-usage: ai-generated
---

# Azure Developer CLI (azd) templates for Azure Container Apps

The [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/overview) streamlines the process of building, deploying, and managing applications on Azure. The following templates help you get started with [Azure Container Apps](./overview.md) across a variety of languages, frameworks, and architectural patterns.

Most templates can be initialized with the following command. For the Java enterprise-data and Rock Paper Orleans templates, use the project-directory instructions under [Initialization notes](#initialization-notes).

```bash
azd init -t <REPO_URL>
```

Templates marked with **✓** after the author name are Microsoft-authored. All other templates are community-authored.

## Overview

| Category | Microsoft | Community | Total |
|----------|-----------|-----------|-------|
| [MCP servers and AI agents](#mcp-servers-and-ai-agents) | 3 | 5 | 8 |
| [AI and intelligent apps](#ai-and-intelligent-apps) | 18 | 5 | 23 |
| [Microservices (Dapr)](#microservices-dapr) | 9 | 0 | 9 |
| [Quickstarts and samples](#quickstarts-and-samples) | 1 | 0 | 1 |
| [Web Applications](#web-applications) | 1 | 12 | 13 |
| [General](#general) | 1 | 7 | 8 |
| **Total** | **33** | **29** | **62** |

## MCP servers and AI agents

Templates for building [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) servers and AI agent orchestration on Azure Container Apps.

| Template | Author | Language | Azure Services | IaC |
|----------|--------|----------|----------------|-----|
| [Agentic Azure Architecture Document and Diagram Generator with MCP Validation](https://github.com/passadis/ai-architect-webapp) | Konstantinos Passadis | Python, JavaScript, Node.js | Azure AI Service, Azure OpenAI Service, Azure Cosmos DB, Azure Log Analytics, Azure Managed Identity, Azure Key Vault, Azure AI Foundry | Terraform |
| [AI Travel Agents - Multi-Agent MCP Orchestration with LangChain.js, LlamaIndex.TS, and Microsoft Agent Framework](https://github.com/Azure-Samples/azure-ai-travel-agents) | Microsoft DevRel ✓ | Node.js, JavaScript, TypeScript, Python, Java, .NET/C# | Azure AI Service, Azure AI Foundry, Azure OpenAI Service, Azure Monitor, Azure Managed Identity | Bicep |
| [Azure Cosmos DB MCP Toolkit](https://github.com/AzureCosmosDB/MCPToolKit) | Azure Cosmos DB | .NET/C# | Azure AI Foundry, Azure Cosmos DB, Azure Service Principal | Bicep |
| [MCP Server with OAuth 2.1 and On-Behalf-Of Flow](https://github.com/jsburckhardt/mcp-obo-aca) | jsburckhardt | Python | Azure Key Vault, Azure Log Analytics, Azure Managed Identity | Bicep |
| [MCP Server written in C# running in Azure Container Apps](https://github.com/powergentic/azd-mcp-csharp) | Powergentic | .NET/C# | — | Bicep |
| [MCP Server written in TypeScript running in Azure Container Apps](https://github.com/powergentic/azd-mcp-ts) | Powergentic | Node.js, TypeScript | — | Bicep |
| [Remote self-hosted Azure MCP Server with managed identity for Copilot Studio integration](https://github.com/Azure-Samples/azmcp-copilot-studio-aca-mi) | Chunan Ye ✓ | — | Azure Managed Identity | Bicep |
| [Remote self-hosted Azure MCP Server with managed identity for Microsoft Foundry integration](https://github.com/Azure-Samples/azmcp-foundry-aca-mi) | Anu Thomas ✓ | — | Azure Managed Identity | Bicep |

## AI and intelligent apps

Templates for AI-powered applications including RAG, ChatGPT-style experiences, and intelligent agents using Azure OpenAI and other AI services.

| Template | Author | Language | Azure Services | IaC |
|----------|--------|----------|----------------|-----|
| [.NET Redis OutputCache with Azure OpenAI](https://github.com/CawaMS/OutputCacheOpenAI) | Catherine Wang | .NET/C# | Azure Cache for Redis, Azure OpenAI Service | — |
| [Azure Container Apps dynamic sessions with a custom container and Microsoft Agent Framework](https://github.com/Azure-Samples/dynamic-sessions-custom-container) | Jeff Martinez ✓ | Python | Azure Managed Identity, Azure OpenAI Service | Bicep |
| [Azure Container Apps dynamic sessions with a Python code interpreter](https://github.com/Azure-Samples/aca-python-code-interpreter-session) | Jeff Martinez ✓ | Python | Azure Managed Identity, Azure OpenAI Service | Bicep |
| [Azure OpenAI RAG with Java, LangChain4j and Quarkus](https://github.com/Azure-Samples/azure-openai-rag-workshop-java) | Sandra Ahlgrimm ✓ | Java | Azure Managed Identity, Azure OpenAI Service, Azure Monitor | Bicep |
| [Building a Multi-Agent Support Triage System with AZD and Azure AI Foundry](https://github.com/daverendon/azd-multiagent) | Dave Rendon | — | Azure AI Service, Azure AI Foundry, Azure OpenAI Service | — |
| [Chat + Vision using Azure OpenAI](https://github.com/Azure-Samples/openai-chat-vision-quickstart) | Azure Content Team ✓ | Python | Azure Managed Identity, Azure AI Service | — |
| [ChatGPT + Enterprise Data with Azure OpenAI and AI Search](https://github.com/Azure-Samples/azure-search-openai-demo-csharp) | Azure Content Team ✓ | .NET/C# | Azure Kubernetes Service, Azure AI Search, Azure OpenAI Service, Azure Cache for Redis | Bicep |
| [Containerized A2A Translation Service with Azure AI Translator](https://github.com/passadis/azure-a2a-translation) | Konstantinos Passadis | Python, JavaScript | Azure AI Foundry, Azure OpenAI Service, Azure AI Service, Azure Storage, Azure Blob Storage, Azure Log Analytics, Azure Managed Identity | Terraform |
| [Deploy Phoenix to Azure](https://github.com/Arize-ai/phoenix-on-azure) | Arize AI Team | Python | — | Bicep |
| [Getting Started with AI Agents Using Azure AI Foundry](https://github.com/Azure-Samples/get-started-with-ai-agents) | Azure Content Team ✓ | Python | Azure AI Foundry, Azure AI Search, Azure Application Insights, Azure Blob Storage | Bicep |
| [Java - ChatGPT + Enterprise data with Azure OpenAI and AI Search](https://github.com/Azure-Samples/azure-search-openai-demo-java) | Davide Antelmo ✓ | Java | Azure OpenAI Service, Azure App Service, Azure AI Search | Bicep |
| [Java Spring Apps with Azure OpenAI](https://github.com/Azure-Samples/app-templates-java-openai-springapps) | Pierre Malarme ✓ | Java | Azure OpenAI Service, Azure Spring Apps, Azure PostgreSQL, Azure Monitor | Bicep |
| [LiteLLM in Azure Container Apps with PostgreSQL database](https://github.com/Build5Nines/azd-litellm) | Build5Nines | Python | Azure OpenAI Service, Azure PostgreSQL | Bicep |
| [LlamaIndex RAG chat app with Azure OpenAI and Azure AI Search (JavaScript)](https://github.com/Azure-Samples/llama-index-vector-search-javascript) | Wassim Chegham ✓ | JavaScript, TypeScript, Node.js | Azure AI Service, Azure Managed Identity, Azure OpenAI Service | Bicep |
| [RAG on PostgreSQL](https://github.com/Azure-Samples/rag-postgres-openai-python) | Azure Content Team ✓ | Python | Azure OpenAI Service, Azure PostgreSQL | Bicep |
| [RAG using Kernel Memory on Azure](https://github.com/microsoft/kernel-memory) | Kernel Memory Team ✓ | .NET/C# | Azure OpenAI Service, Azure AI Search, Azure AI Service, Azure Managed Identity, Azure Blob Storage, Azure Application Gateway, Azure Storage, Azure Application Insights, Azure Virtual Networks | Bicep |
| [Semantic image search](https://github.com/Azure-Samples/image-search-aisearch) | Azure Content Team ✓ | Python, TypeScript, Node.js | Azure OpenAI Service, Azure AI Search, Azure Blob Storage | Bicep |
| [Serverless Azure OpenAI Quick Start with LlamaIndex (JavaScript)](https://github.com/Azure-Samples/llama-index-javascript) | Wassim Chegham ✓ | JavaScript, Node.js | Azure OpenAI Service | Bicep |
| [Serverless Azure OpenAI Quick Start with LlamaIndex (Python)](https://github.com/Azure-Samples/llama-index-python) | Marlene Mhangami ✓ | Python | Azure OpenAI Service, Azure Managed Identity | Bicep |
| [Simple Chat Application using Azure OpenAI](https://github.com/Azure-Samples/chatgpt-quickstart) | Azure Content Team ✓ | Python | Azure OpenAI Service | Bicep |
| [Simple Chat Application using Azure OpenAI (Python)](https://github.com/Azure-Samples/openai-chat-app-quickstart) | Azure Content Team ✓ | Python | Azure OpenAI Service | Bicep |
| [Spring Petclinic Microservices with AI on Azure Container Apps](https://github.com/Azure-Samples/java-on-aca) | Songbo Wang ✓ | Java | Azure MySQL, Azure Monitor, Azure Managed Identity, Azure Key Vault, Azure Application Insights, Azure OpenAI Service | Bicep |
| [VoiceRAG: RAG + Voice Using Azure AI Search and GPT-4o Realtime API](https://github.com/Azure-Samples/aisearch-openai-rag-audio) | Azure Content Team ✓ | Python, TypeScript, JavaScript | Azure OpenAI Service, Azure AI Search | Bicep |

## Microservices (Dapr)

Templates demonstrating microservice patterns with [Dapr](https://dapr.io/) on Azure Container Apps, including pub/sub, service invocation, and bindings.

| Template | Author | Language | Azure Services | IaC |
|----------|--------|----------|----------------|-----|
| [Microservices App - Dapr Bindings Cron C# ACA PostgreSQL](https://github.com/Azure-Samples/bindings-dapr-csharp-cron-postgres) | Azure Content Team ✓ | .NET/C# | Azure PostgreSQL | — |
| [Microservices App - Dapr Bindings Cron Node.js ACA PostgreSQL](https://github.com/Azure-Samples/bindings-dapr-nodejs-cron-postgres) | Azure Content Team ✓ | Node.js, JavaScript | Azure PostgreSQL | — |
| [Microservices App - Dapr Bindings Cron Python ACA PostgreSQL](https://github.com/Azure-Samples/bindings-dapr-python-cron-postgres) | Azure Content Team ✓ | Python | Azure PostgreSQL | — |
| [Microservices App - Dapr PubSub C# ACA ServiceBus](https://github.com/Azure-Samples/pubsub-dapr-csharp-servicebus) | Azure Content Team ✓ | .NET/C# | Azure Service Bus | Bicep |
| [Microservices App - Dapr PubSub Node.js ACA ServiceBus](https://github.com/Azure-Samples/pubsub-dapr-nodejs-servicebus) | Azure Content Team ✓ | JavaScript, Node.js | Azure Service Bus | Bicep |
| [Microservices App - Dapr PubSub Python ACA ServiceBus](https://github.com/Azure-Samples/pubsub-dapr-python-servicebus) | Azure Content Team ✓ | Python | Azure Service Bus | Bicep |
| [Microservices App - Dapr Service Invoke C# ACA](https://github.com/Azure-Samples/svc-invoke-dapr-csharp) | Azure Content Team ✓ | .NET/C# | — | — |
| [Microservices App - Dapr Service Invoke Node.js ACA](https://github.com/Azure-Samples/svc-invoke-dapr-nodejs) | Azure Content Team ✓ | Node.js | — | — |
| [Microservices App - Dapr Service Invoke Python ACA](https://github.com/Azure-Samples/svc-invoke-dapr-python) | Azure Content Team ✓ | Python | — | — |

## Quickstarts and samples

Starter templates and quickstart samples to help you get up and running with Azure Container Apps.

| Template | Author | Language | Azure Services | IaC |
|----------|--------|----------|----------------|-----|
| [Hello AZD](https://github.com/Azure-Samples/hello-azd) | Azure Content Team ✓ | .NET/C# | Azure Blob Storage, Azure Cosmos DB, Azure Managed Identity | Bicep |

## Web Applications

Full-stack and server-side web application templates running on Azure Container Apps.

| Template | Author | Language | Azure Services | IaC |
|----------|--------|----------|----------------|-----|
| [Aspire with Key Vault + App Config + Service Bus/RabbitMQ](https://github.com/fabio-marini/azd-aspire-basic) | Fabio Marini | .NET/C# | Azure Key Vault, Azure App Configuration, Azure Service Bus, Azure Service Principal, Azure Log Analytics, Azure Managed Identity | Bicep |
| [FastAPI Membership API Template for Azure Container Apps](https://github.com/EstopaceMA/fastapi-postgres-aca) | Mark Anthony Estopace | Python | Azure PostgreSQL, Azure Key Vault, Azure Virtual Networks | Terraform |
| [FastAPI on Azure Container Apps](https://github.com/pamelafox/simple-fastapi-container) | Pamela Fox | Python | — | Bicep |
| [Flask API on Azure Container Apps](https://github.com/pamelafox/simple-flask-api-container) | Pamela Fox | Python | — | Bicep |
| [Flask Chart API on ACA and CDN](https://github.com/pamelafox/flask-charts-api-container-app) | Pamela Fox | Python | Azure CDN | — |
| [Flask Container with CDN](https://github.com/pamelafox/flask-gallery-container-app) | Pamela Fox | Python | Azure CDN | — |
| [Flask Surveys Container App](https://github.com/pamelafox/flask-surveys-container-app) | Pamela Fox | Python | Azure Key Vault, Azure PostgreSQL | — |
| [Java Quarkus Apps on Azure Container Apps](https://github.com/Azure-Samples/java-on-aca-quarkus) | Jianguo Ma ✓ | Java | Azure PostgreSQL, Azure MySQL, Azure Monitor, Azure Managed Identity | Bicep |
| [Jupyter Notebooks Web App on Azure Container Apps](https://github.com/savannahostrowski/jupyter-mercury-aca) | Savannah Ostrowski | Python | — | Bicep |
| [Next.js on Container Apps](https://github.com/CMeeg/nextjs-aca) | Chris Meagher | TypeScript, Node.js | Azure CDN, Azure Application Insights | Bicep |
| [Quarkus Todo API Template for Azure Container Apps](https://github.com/EstopaceMA/quarkus-postgres-aca) | Mark Anthony Estopace | Java | Azure PostgreSQL | Terraform |
| [Remix on Container Apps](https://github.com/CMeeg/remix-aca) | Chris Meagher | TypeScript, Node.js | Azure CDN, Azure Application Insights | Bicep |
| [Sample Ruby on Rails app deployed (Bicep) on Azure Container App with PostgreSQL](https://github.com/dbroeglin/azure-rails-starter) | Dominique Broeglin | Ruby | Azure PostgreSQL, Azure Monitor | Bicep |

## General

Additional Azure Container Apps templates covering infrastructure, DevOps, and other patterns.

| Template | Author | Language | Azure Services | IaC |
|----------|--------|----------|----------------|-----|
| [Aspire Azure Storage Demo](https://github.com/FBoucher/AspireAzStorage) | Frank Boucher | .NET/C# | — | Bicep |
| [Deploy DeepSeek-R1 on Azure Container Apps with Serverless GPUs.](https://github.com/daverendon/azd-deepseek-r1-on-azure-container-apps) | Dave Rendon | — | Azure Log Analytics | — |
| [Docusaurus with Azure Container Apps](https://github.com/jsburckhardt/docusaurus-aca) | Juan Burckhardt | JavaScript | — | Bicep |
| [Emulated Firewall sending Syslog to linux VM](https://github.com/koenraadhaedens/azd-firewall-send-syslog-messages) | Koenraad Haedens | — | Azure Sentinel | — |
| [EShopOnWeb ACAPPS Architecture](https://github.com/maartenvandiemen/AZD-ACA-Demo) | Maarten van Diemen | — | Azure Managed Identity | — |
| [Real time game leaderboard with Azure Container Apps and Redis Cache](https://github.com/CawaMS/GameLeaderboard) | Catherine Wang | .NET/C# | Azure Cache for Redis | — |
| [Rock, Paper, Orleans (RPO) - Distributed .NET](https://github.com/bradygaster/RockPaperOrleans) | Brady Gaster | .NET/C# | Azure Cosmos DB | Bicep |
| [WordPress with Azure Container Apps](https://github.com/Azure-Samples/apptemplate-wordpress-on-ACA) | Konstantinos Pantos ✓ | PHP, JavaScript | Azure Application Gateway, Azure Cache for Redis, Azure Monitor, Azure Key Vault | Bicep |

## Initialization notes

The following repositories keep their azd configuration below the repository root.
Clone the repository and initialize from the specified project directory.

### Java - ChatGPT + Enterprise data with Azure OpenAI and AI Search

```shell
git clone https://github.com/Azure-Samples/azure-search-openai-demo-java
cd azure-search-openai-demo-java\deploy\aca
azd init
```

### Rock, Paper, Orleans (RPO) - Distributed .NET

```shell
git clone https://github.com/bradygaster/RockPaperOrleans
cd RockPaperOrleans\src\AppHost
azd init
```
