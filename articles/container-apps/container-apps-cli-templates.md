---
title: Azure Developer CLI (azd) templates for Azure Container Apps
description: Find Microsoft and community-authored Azure Developer CLI (AZD) templates for Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: landing-page
ms.date: 03/20/2026
ms.author: cshoe
ai-usage: ai-generated
---

# Azure Developer CLI (azd) templates for Azure Container Apps

The [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/overview) streamlines the process of building, deploying, and managing applications on Azure. The following templates help you get started with [Azure Container Apps](./overview.md) across a variety of languages, frameworks, and architectural patterns.

Each template is a complete, deployable project you can initialize with a single command:

```bash
azd init -t <REPO_URL>
```

Templates marked with **✓** after the author name are Microsoft-authored. All other templates are community-authored.

## Overview

| Category | Microsoft | Community | Total |
|----------|-----------|-----------|-------|
| [MCP servers and AI agents](#mcp-servers-and-ai-agents) | 5 | 5 | 10 |
| [AI and intelligent apps](#ai-and-intelligent-apps) | 23 | 7 | 30 |
| [Microservices (Dapr)](#microservices-dapr) | 9 | 0 | 9 |
| [Quickstarts and samples](#quickstarts-and-samples) | 13 | 0 | 13 |
| [Web Applications](#web-applications) | 5 | 13 | 18 |
| [General](#general) | 2 | 8 | 10 |
| **Total** | **57** | **33** | **90** |

## MCP servers and AI agents

Templates for building [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) servers and AI agent orchestration on Azure Container Apps.

| Template | Author | Language | Azure Services | IaC |
|----------|--------|----------|----------------|-----|
| [.NET OpenAI MCP Agent](https://github.com/Azure-Samples/openai-mcp-agent-dotnet) | Justin Yoo ✓ | .NET/C# | Azure AI Service, Azure OpenAI Service, Azure Log Analytics, Azure Managed Identity, Azure Application Insights, Azure Diagnostic Settings | Bicep |
| [Agentic Azure Architecture Document and Diagram Generator with MCP Validation](https://github.com/passadis/ai-architect-webapp) | Konstantinos Passadis | Python, JavaScript, Node.js | Azure AI Service, Azure OpenAI Service, Azure Cosmos DB, Azure Log Analytics, Azure Managed Identity, Azure Key Vault, Azure AI Foundry | Terraform |
| [AI Travel Agents - Multi-Agent MCP Orchestration with LangChain.js, LlamaIndex.TS, and Microsoft Agent Framework](https://github.com/Azure-Samples/azure-ai-travel-agents) | Microsoft DevRel ✓ | Node.js, JavaScript, TypeScript, Python, Java, .NET/C# | Azure AI Service, Azure AI Foundry, Azure OpenAI Service, Azure Monitor, Azure Managed Identity | Bicep |
| [Azure Cosmos DB MCP Toolkit](https://github.com/AzureCosmosDB/MCPToolKit) | Azure Cosmos DB | .NET/C# | Azure AI Foundry, Azure Cosmos DB, Azure Service Principal | Bicep |
| [MCP Container TS - Model Context Protocol in TypeScript](https://github.com/Azure-Samples/mcp-container-ts) | Microsoft DevRel ✓ | Node.js, TypeScript, JavaScript | Azure AI Service, Azure AI Foundry, Azure OpenAI Service, Azure Monitor, Azure Managed Identity | Bicep |
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
| [Advanced multi agent application based on Autogen and Azure Open AI](https://github.com/Azure-Samples/dream-team) | Yaniv Vaknin ✓ | Python | Azure Managed Identity, Azure OpenAI Service, Azure Key Vault, Azure Log Analytics, Azure Application Insights | Bicep |
| [Agentic Voice Assistant based on Azure Container Apps, Azure OpenAI and Azure Logic Apps](https://github.com/Azure-Samples/agentic-voice-assistant) | Evgeny Minkevich | Python | Azure Cosmos DB, Azure Application Insights, Azure Storage | Bicep |
| [Azure Container Apps dynamic sessions with a custom container and Microsoft Agent Framework](https://github.com/Azure-Samples/dynamic-sessions-custom-container) | Jeff Martinez ✓ | Python | Azure Managed Identity, Azure OpenAI Service | Bicep |
| [Azure Container Apps dynamic sessions with a Python code interpreter](https://github.com/Azure-Samples/aca-python-code-interpreter-session) | Jeff Martinez ✓ | Python | Azure Managed Identity, Azure OpenAI Service | Bicep |
| [Azure OpenAI priority-based load balancer with Azure Container Apps](https://github.com/Azure-Samples/openai-aca-lb) | Andre Dewes ✓ | .NET/C# | Azure OpenAI Service | Bicep |
| [Azure OpenAI RAG with Java, LangChain4j and Quarkus](https://github.com/Azure-Samples/azure-openai-rag-workshop-java) | Sandra Ahlgrimm ✓ | Java | Azure Managed Identity, Azure OpenAI Service, Azure Monitor | Bicep |
| [Building a Multi-Agent Support Triage System with AZD and Azure AI Foundry](https://github.com/daverendon/azd-multiagent) | Dave Rendon | — | Azure AI Service, Azure AI Foundry, Azure OpenAI Service | — |
| [Chat + Vision using Azure OpenAI](https://github.com/Azure-Samples/openai-chat-vision-quickstart) | Azure Content Team ✓ | Python | Azure Managed Identity, Azure AI Service | — |
| [ChatGPT + Enterprise Data with Azure OpenAI and AI Search](https://github.com/Azure-Samples/azure-search-openai-demo-csharp) | Azure Content Team ✓ | .NET/C# | Azure Kubernetes Service, Azure AI Search, Azure OpenAI Service, Azure Cache for Redis | Bicep |
| [Containerized A2A Translation Service with Azure AI Translator](https://github.com/passadis/azure-a2a-translation) | Konstantinos Passadis | Python, JavaScript | Azure AI Foundry, Azure OpenAI Service, Azure AI Service, Azure Storage, Azure Blob Storage, Azure Log Analytics, Azure Managed Identity | Terraform |
| [Copilot SDK Service — Chat API with React UI on Azure Container Apps](https://github.com/Azure-Samples/copilot-sdk-service) | Jon Gallant ✓ | TypeScript, JavaScript, Node.js | Azure Key Vault, Azure Monitor, Azure OpenAI Service | Bicep |
| [Deploy Phoenix to Azure](https://github.com/Arize-ai/phoenix-on-azure) | Arize AI Team | Python | — | Bicep |
| [Getting Started with AI Agents Using Azure AI Foundry](https://github.com/Azure-Samples/get-started-with-ai-agents) | Azure Content Team ✓ | Python | Azure AI Foundry, Azure AI Search, Azure Application Insights, Azure Blob Storage | Bicep |
| [Java - ChatGPT + Enterprise data with Azure OpenAI and AI Search](https://github.com/Azure-Samples/azure-search-openai-demo-java) | Davide Antelmo ✓ | Java | Azure OpenAI Service, Azure App Service, Azure AI Search | Bicep |
| [Java Spring Apps with Azure OpenAI](https://github.com/Azure-Samples/app-templates-java-openai-springapps) | Pierre Malarme ✓ | Java | Azure OpenAI Service, Azure Spring Apps, Azure PostgreSQL, Azure Monitor | Bicep |
| [LiteLLM in Azure Container Apps with PostgreSQL database](https://github.com/Build5Nines/azd-litellm) | Build5Nines | Python | Azure OpenAI Service, Azure PostgreSQL | Bicep |
| [LlamaIndex RAG chat app with Azure OpenAI and Azure AI Search (JavaScript)](https://github.com/Azure-Samples/llama-index-vector-search-javascript) | Wassim Chegham ✓ | JavaScript, TypeScript, Node.js | Azure AI Service, Azure Managed Identity, Azure OpenAI Service | Bicep |
| [Pinecone RAG Demo](https://github.com/pinecone-io/pinecone-rag-demo-azd) | Pinecone Team | TypeScript | — | Bicep |
| [Process Automation: Speech to Text and Summarization with AI Studio](https://github.com/Azure-Samples/summarization-openai-python-promptflow) | Azure Content Team ✓ | Python | Azure OpenAI Service, Azure Speech Services | Bicep |
| [RAG on PostgreSQL](https://github.com/Azure-Samples/rag-postgres-openai-python) | Azure Content Team ✓ | Python | Azure OpenAI Service, Azure PostgreSQL | Bicep |
| [RAG using Kernel Memory on Azure](https://github.com/microsoft/kernel-memory) | Kernel Memory Team ✓ | .NET/C# | Azure OpenAI Service, Azure AI Search, Azure AI Service, Azure Managed Identity, Azure Blob Storage, Azure Application Gateway, Azure Storage, Azure Application Insights, Azure Virtual Networks | Bicep |
| [Semantic image search](https://github.com/Azure-Samples/image-search-aisearch) | Azure Content Team ✓ | Python, TypeScript, Node.js | Azure OpenAI Service, Azure AI Search, Azure Blob Storage | Bicep |
| [Serverless Azure OpenAI Quick Start with LlamaIndex (JavaScript)](https://github.com/Azure-Samples/llama-index-javascript) | Wassim Chegham ✓ | JavaScript, Node.js | Azure OpenAI Service | Bicep |
| [Serverless Azure OpenAI Quick Start with LlamaIndex (Python)](https://github.com/Azure-Samples/llama-index-python) | Marlene Mhangami ✓ | Python | Azure OpenAI Service, Azure Managed Identity | Bicep |
| [Simple Chat Application using Azure OpenAI](https://github.com/Azure-Samples/chatgpt-quickstart) | Azure Content Team ✓ | Python | Azure OpenAI Service | Bicep |
| [Simple Chat Application using Azure OpenAI (Python)](https://github.com/Azure-Samples/openai-chat-app-quickstart) | Azure Content Team ✓ | Python | Azure OpenAI Service | Bicep |
| [Spring Petclinic Microservices with AI on Azure Container Apps](https://github.com/Azure-Samples/java-on-aca) | Songbo Wang ✓ | Java | Azure MySQL, Azure Monitor, Azure Managed Identity, Azure Key Vault, Azure Application Insights, Azure OpenAI Service | Bicep |
| [Sprint Petclinic AI application on Azure Container Apps](https://github.com/Azure-Samples/spring-petclinic-ai) | Songbo Wang ✓ | Java | Azure Managed Identity, Azure OpenAI Service | Bicep |
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
| [Azure Cosmos DB for NoSQL Quickstart - .NET](https://github.com/azure-samples/cosmos-db-nosql-dotnet-quickstart) | Azure Cosmos DB Content Team ✓ | .NET/C# | Azure Cosmos DB, Azure Managed Identity | Bicep |
| [Azure Cosmos DB for NoSQL Quickstart - Go](https://github.com/azure-samples/cosmos-db-nosql-go-quickstart) | Azure Cosmos DB Content Team ✓ | Go | Azure Cosmos DB, Azure Managed Identity | Bicep |
| [Azure Cosmos DB for NoSQL Quickstart - Java](https://github.com/azure-samples/cosmos-db-nosql-java-quickstart) | Azure Cosmos DB Content Team ✓ | Java | Azure Cosmos DB, Azure Managed Identity | Bicep |
| [Azure Cosmos DB for NoSQL Quickstart - Node.js](https://github.com/azure-samples/cosmos-db-nosql-nodejs-quickstart) | Azure Cosmos DB Content Team ✓ | Node.js | Azure Cosmos DB, Azure Managed Identity | Bicep |
| [Azure Cosmos DB for NoSQL Quickstart - Python](https://github.com/azure-samples/cosmos-db-nosql-python-quickstart) | Azure Cosmos DB Content Team ✓ | Python | Azure Cosmos DB, Azure Managed Identity | Bicep |
| [Azure Cosmos DB for Table Quickstart - .NET](https://github.com/azure-samples/cosmos-db-table-dotnet-quickstart) | Azure Cosmos DB Content Team ✓ | .NET/C# | Azure Cosmos DB, Azure Managed Identity | Bicep |
| [Azure Cosmos DB for Table Quickstart - Go](https://github.com/azure-samples/cosmos-db-table-go-quickstart) | Azure Cosmos DB Content Team ✓ | Go | Azure Cosmos DB, Azure Managed Identity | Bicep |
| [Azure Cosmos DB for Table Quickstart - Java](https://github.com/azure-samples/cosmos-db-table-java-quickstart) | Azure Cosmos DB Content Team ✓ | Java | Azure Cosmos DB, Azure Managed Identity | Bicep |
| [Azure Cosmos DB for Table Quickstart - Node.js](https://github.com/azure-samples/cosmos-db-table-nodejs-quickstart) | Azure Cosmos DB Content Team ✓ | Node.js | Azure Cosmos DB, Azure Managed Identity | Bicep |
| [Azure Cosmos DB for Table Quickstart - Python](https://github.com/azure-samples/cosmos-db-table-python-quickstart) | Azure Cosmos DB Content Team ✓ | Python | Azure Cosmos DB, Azure Managed Identity | Bicep |
| [Data API builder Quickstart - Azure Cosmos DB for NoSQL](https://github.com/azure-samples/dab-azure-cosmos-db-nosql-quickstart) | Azure Cosmos DB Content Team ✓ | .NET/C# | Azure Cosmos DB, Azure Managed Identity | Bicep |
| [Data API builder Quickstart - Azure SQL](https://github.com/azure-samples/dab-azure-sql-quickstart) | Azure SQL Content Team ✓ | .NET/C# | Azure SQL, Azure Managed Identity | Bicep |
| [Hello AZD](https://github.com/Azure-Samples/hello-azd) | Azure Content Team ✓ | .NET/C# | Azure Blob Storage, Azure Cosmos DB, Azure Managed Identity | Bicep |

## Web Applications

Full-stack and server-side web application templates running on Azure Container Apps.

| Template | Author | Language | Azure Services | IaC |
|----------|--------|----------|----------------|-----|
| [Aspire with Key Vault + App Config + Service Bus/RabbitMQ](https://github.com/fabio-marini/azd-aspire-basic) | Fabio Marini | .NET/C# | Azure Key Vault, Azure App Configuration, Azure Service Bus, Azure Service Principal, Azure Log Analytics, Azure Managed Identity | Bicep |
| [Containerized React Web App with Java API and MongoDB](https://github.com/Azure-Samples/todo-java-mongo-aca) | Azure Dev ✓ | Java, TypeScript | Azure Cosmos DB, Azure Key Vault, Azure Monitor | Bicep |
| [Containerized React Web App with Node.js API and MongoDB](https://github.com/Azure-Samples/todo-nodejs-mongo-aca) | Azure Dev ✓ | Node.js, TypeScript, JavaScript | Azure App Service, Azure Cosmos DB, Azure Monitor, Azure Key Vault | Bicep |
| [Containerized React Web App with Python API and MongoDB](https://github.com/Azure-Samples/todo-python-mongo-aca) | Azure Dev ✓ | Python, TypeScript, JavaScript | Azure Cosmos DB, Azure Monitor, Azure Key Vault | Bicep |
| [FastAPI Membership API Template for Azure Container Apps](https://github.com/EstopaceMA/fastapi-postgres-aca) | Mark Anthony Estopace | Python | Azure PostgreSQL, Azure Key Vault, Azure Virtual Networks | Terraform |
| [FastAPI on Azure Container Apps](https://github.com/pamelafox/simple-fastapi-container) | Pamela Fox | Python | — | Bicep |
| [Flask API on Azure Container Apps](https://github.com/pamelafox/simple-flask-api-container) | Pamela Fox | Python | — | Bicep |
| [Flask Chart API on ACA and CDN](https://github.com/pamelafox/flask-charts-api-container-app) | Pamela Fox | Python | Azure CDN | — |
| [Flask Container with CDN](https://github.com/pamelafox/flask-gallery-container-app) | Pamela Fox | Python | Azure CDN | — |
| [Flask Surveys Container App](https://github.com/pamelafox/flask-surveys-container-app) | Pamela Fox | Python | Azure Key Vault, Azure PostgreSQL | — |
| [Intelligent App on Azure Container Apps and GitHub Models](https://github.com/xuhaoruins/marketingwriter) | Hao Xu | Python | — | Bicep |
| [Java Quarkus Apps on Azure Container Apps](https://github.com/Azure-Samples/java-on-aca-quarkus) | Jianguo Ma ✓ | Java | Azure PostgreSQL, Azure MySQL, Azure Monitor, Azure Managed Identity | Bicep |
| [Jupyter Notebooks Web App on Azure Container Apps](https://github.com/savannahostrowski/jupyter-mercury-aca) | Savannah Ostrowski | Python | — | Bicep |
| [Next.js on Container Apps](https://github.com/CMeeg/nextjs-aca) | Chris Meagher | TypeScript, Node.js | Azure CDN, Azure Application Insights | Bicep |
| [Python (Django) Web App with PostgreSQL via Azure Container Apps](https://github.com/Azure-Samples/azure-django-postgres-aca) | Azure Content Team ✓ | Python | Azure PostgreSQL | Bicep |
| [Quarkus Todo API Template for Azure Container Apps](https://github.com/EstopaceMA/quarkus-postgres-aca) | Mark Anthony Estopace | Java | Azure PostgreSQL | Terraform |
| [Remix on Container Apps](https://github.com/CMeeg/remix-aca) | Chris Meagher | TypeScript, Node.js | Azure CDN, Azure Application Insights | Bicep |
| [Sample Ruby on Rails app deployed (Bicep) on Azure Container App with PostgreSQL](https://github.com/dbroeglin/azure-rails-starter) | Dominique Broeglin | Ruby | Azure PostgreSQL, Azure Monitor | Bicep |

## General

Additional Azure Container Apps templates covering infrastructure, DevOps, and other patterns.

| Template | Author | Language | Azure Services | IaC |
|----------|--------|----------|----------------|-----|
| [.NET Aspire Azure Storage Demo](https://github.com/FBoucher/AspireAzStorage) | Frank Boucher | .NET/C# | — | Bicep |
| [Deploy DeepSeek-R1 on Azure Container Apps with Serverless GPUs.](https://github.com/daverendon/azd-deepseek-r1-on-azure-container-apps) | Dave Rendon | — | Azure Log Analytics | — |
| [Deploy Label Studio directly from Docker Hub on Azure Container Apps](https://github.com/bderusha/azd-label-studio) | Bill DeRusha | — | Azure Blob Storage, Azure Application Insights, Azure Log Analytics, Azure Managed Identity | Bicep |
| [Docusaurus with Azure Container Apps](https://github.com/jsburckhardt/docusaurus-aca) | Juan Burckhardt | JavaScript | — | Bicep |
| [Emulated Firewall sending Syslog to linux VM](https://github.com/koenraadhaedens/azd-firewall-send-syslog-messages) | Koenraad Haedens | — | Azure Sentinel | — |
| [EShopOnWeb ACAPPS Architecture](https://github.com/maartenvandiemen/AZD-ACA-Demo) | Maarten van Diemen | — | Azure Managed Identity | — |
| [Real time game leaderboard with Azure Container Apps and Redis Cache](https://github.com/CawaMS/GameLeaderboard) | Catherine Wang | .NET/C# | Azure Cache for Redis | — |
| [Rock, Paper, Orleans (RPO) - Distributed .NET](https://github.com/bradygaster/RockPaperOrleans) | Brady Gaster | .NET/C# | Azure Cosmos DB | Bicep |
| [URL Shortener using Microsoft Orleans and Azure for hosting and data](https://github.com/azure-samples/orleans-url-shortener) | Azure Cosmos DB Content Team ✓ | .NET/C# | Azure Cosmos DB | Bicep |
| [WordPress with Azure Container Apps](https://github.com/Azure-Samples/apptemplate-wordpress-on-ACA) | Konstantinos Pantos ✓ | PHP, JavaScript | Azure Application Gateway, Azure Cache for Redis, Azure Monitor, Azure Key Vault | Bicep |
