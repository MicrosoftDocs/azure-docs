---
title: Use App Service as an OpenAPI tool in Foundry agent
description: Empower your existing web apps by exposing their capabilities to Foundry Agent Service using OpenAPI. Connect Foundry Agent Service to REST APIs to create powerful, feature-rich agents.
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

# App Service as OpenAPI tool in Foundry agent

Empower your existing web apps by exposing their capabilities to Foundry Agent Service using OpenAPI. Many web apps already provide REST APIs, making them ideal candidates for integration into agents that can call REST APIs as tools. By connecting Foundry Agent Service to these APIs, you can rapidly create powerful, feature-rich agents with little code.

## Overview

OpenAPI specifications describe REST APIs in a standardized, machine-readable format. Foundry Agent Service can consume these specifications to automatically discover and invoke your web app's capabilities as tools within AI agents. This approach allows you to:

- **Leverage existing APIs**: Transform your current REST endpoints into AI-accessible tools without code changes
- **Maintain API standards**: Use industry-standard OpenAPI specs that serve both human and AI consumers
- **Enable rapid integration**: Add new capabilities to agents simply by updating your OpenAPI specification
- **Preserve business logic**: Keep your existing application code, security, and data access patterns unchanged
- **Scale with managed services**: Use Foundry Agent Service's built-in scalability and reliability

This pattern is particularly powerful because most modern web applications already expose REST APIs for their core functionality. By documenting these APIs with OpenAPI specs, you make them immediately available as building blocks for intelligent agents.

## When to use OpenAPI tools

Consider exposing your App Service app as an OpenAPI tool for Foundry agents when:

- **You have existing REST APIs**: Your application already provides well-defined HTTP endpoints
- **You want rapid agent development**: You need to create functional agents quickly with minimal custom code
- **You need declarative tool definitions**: You prefer describing capabilities through specifications rather than programming
- **You want to support multiple agents**: The same APIs can serve multiple agent scenarios with different orchestration
- **You require clear API contracts**: OpenAPI specs provide documentation and validation for both agents and human developers

This approach works especially well for line-of-business applications, internal tools, and microservices architectures where REST APIs form the natural boundary between components.

## How OpenAPI tools work with agents

The integration follows a straightforward flow:

1. **Define your API**: Create or generate an OpenAPI specification for your App Service REST endpoints
2. **Register as a tool**: Add your API to Foundry Agent Service, specifying the OpenAPI spec location
3. **Agent discovery**: The agent automatically understands available operations, parameters, and response formats
4. **Runtime invocation**: When users interact with the agent, it calls your App Service endpoints as needed
5. **Result processing**: The agent interprets API responses and incorporates results into the conversation

App Service provides built-in support for the authentication patterns required for secure tool invocation, including managed identities and Microsoft Entra ID integration.

## Get started with tutorials

## [.NET](#tab/dotnet)
- [Add an App Service app as a tool in Foundry Agent Service (.NET)](tutorial-ai-integrate-azure-ai-agent-dotnet.md)
- [Invoke a web app from Foundry agent](invoke-openapi-web-app-from-azure-ai-agent-service.md)

## [Java](#tab/java)
- [Add an App Service app as a tool in Foundry Agent Service (Java)](tutorial-ai-integrate-azure-ai-agent-java.md)

## [Node.js](#tab/nodejs)
- [Add an App Service app as a tool in Foundry Agent Service (Node.js)](tutorial-ai-integrate-azure-ai-agent-node.md)

## [Python](#tab/python)
- [Add an App Service app as a tool in Foundry Agent Service (Python)](tutorial-ai-integrate-azure-ai-agent-python.md)
-----

## Related content

- [Integrate AI into your Azure App Service applications](overview-ai-integration.md)
- [Authenticate Foundry tool calls](configure-authentication-ai-foundry-openapi-tool.md)
