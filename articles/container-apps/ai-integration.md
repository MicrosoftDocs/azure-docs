---
title: AI integration with Azure Container Apps
description: Examples for running AI workloads in Azure Container Apps, including GPU-powered inference, dynamic sessions, and deploying Azure AI Foundry models.
author: jefmarti
ms.author: jefmarti
ms.service: azure-container-apps
ms.date: 10/03/2025
ms.topic: article
---

# AI integration with Azure Container Apps

Azure Container Apps is a serverless container platform that simplifies the deployment and scaling of microservices and AI-powered applications. With native support for GPU workloads, seamless integration with Azure AI services, and flexible deployment options, it is an ideal platform for building intelligent, cloud-native solutions.


## GPU-powered inference

Use GPU accelerated workload profiles to meet a variety of your AI workload needs, including:

- **[Serverless GPUs](./gpu-serverless-overview.md)**: Ideal for variable traffic scenarios and cost-sensitive inference workloads.
- **Dedicated GPUs**: best for continuous, low-latency inference scenarios.
- **Scale to zero**: automatically scale down idle GPU resources to minimize costs.

## Dynamic sessions for AI-generated code

Dynamic sessions provide a secure, isolated environment for executing AI-generated code. Perfect for scenarios like sandboxed execution, code evaluation, and AI agents.

Supported session types include:
- **[Platform managed built-in containers](./sessions-code-interpreter.md)**: a platform-managed container that supports executing code in Python and Node.js.
- **[Custom containers](./sessions-custom-container.md)**: create a sessions pool using a custom container for specialized workloads or additional language support.

## Deploying Azure AI Foundry models

Azure Container Apps integrates with Azure AI Foundry, which enables you to deploy curated AI models directly into your containerized environments. This integration simplifies model deployment and management, making it easier to build intelligent applications on Container Apps.

### Sample projects

The following are a few examples that demonstrate AI integration with Azure Container Apps. These samples showcase various AI capabilities, including OpenAI integration, multi-agent coordination, and retrieval-augmented generation (RAG) using Azure AI Search. For more samples, visit the [template library](https://azure-sdk.github.io/awesome-azd/?name=azure+container+apps).

| Sample | Description |
|--------|-------------|
| [Chat app with Azure OpenAI](https://github.com/Azure-Samples/container-apps-openai) | ChatGPT-like apps using OpenAI, LangChain, ChromaDB, and Chainlit deployed to ACA using Terraform. |
| [Host an MCP server](https://github.com/Azure-Samples/azure-container-apps-ai-mcp) | Demonstrates multi-agent coordination using the MCP protocol with Azure OpenAI and GitHub models in Container Apps. |
| [MCP client and server](https://github.com/Azure-Samples/openai-mcp-agent-dotnet) | .NET-based MCP agent app using Azure OpenAI with a TypeScript MCP server, both hosted on ACA. |
| [Remote MCP server](https://github.com/Azure-Samples/mcp-container-ts) | TypeScript-based MCP server template for Container Apps, ideal for building custom AI toolchains. |
| [Dynamic session Python code interpreter](https://github.com/Azure-Samples/aca-python-code-interpreter-session) | Dynamic session for executing Python code in a secure environment. |

## Related content
- [Multiple-agent workflow automation](/azure/architecture/ai-ml/idea/multiple-agent-workflow-automation)


