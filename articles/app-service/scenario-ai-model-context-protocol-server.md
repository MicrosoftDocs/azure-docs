---
title: Use App Service as a Model Context Protocol (MCP) server
description: Integrate your web app as a Model Context Protocol (MCP) server to extend the capabilities of leading personal AI agents such as GitHub Copilot Chat, Cursor, and Winsurf.
author: cephalin
ms.author: cephalin
ms.service: azure-app-service
ms.topic: how-to
ms.date: 05/08/2026
ms.custom:
  - build-2025
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# App Service as Model Context Protocol (MCP) servers

Integrate your web app as a [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) server to extend the capabilities of leading personal AI agents such as GitHub Copilot Chat, Cursor, and Winsurf. By exposing your app's APIs through MCP, you can supercharge these agents with the unique features and business logic your web app already provides, without major development effort or rearchitecture.

## Overview

MCP is an open standard that enables AI coding assistants and agents to interact with external tools and data sources. By hosting your App Service application as an MCP server, you make your web app's functionality available to AI agents as callable tools with structured inputs and outputs.

This integration allows developers to:

- **Extend AI assistants**: Add custom capabilities to GitHub Copilot Chat, Cursor, Winsurf, and other MCP-compatible agents
- **Expose existing APIs**: Turn your current REST APIs into AI-accessible tools without rewriting code
- **Provide context**: Give AI agents access to your application's business logic and data
- **Enable automation**: Allow agents to perform complex workflows by chaining your app's operations
- **Maintain control**: Keep full control over authentication, authorization, and data access

## When to use App Service as an MCP server

Consider implementing your App Service app as an MCP server when you want to:

- **Empower developer tools**: Let developers use AI agents that can directly interact with your APIs during coding
- **Create custom copilot experiences**: Build specialized AI assistants with deep knowledge of your application domain
- **Automate workflows**: Enable AI agents to perform multi-step operations in your application
- **Improve developer productivity**: Reduce context switching by bringing your app's functionality into the IDE
- **Leverage existing infrastructure**: Use your deployed App Service apps as agent tools without separate deployments

If you're evaluating where to host an MCP server in Azure, compare App Service with other options in [Choose an Azure service for hosting MCP servers](/azure/container-apps/mcp-choosing-azure-service) before selecting your deployment target.

MCP is particularly valuable for line-of-business applications, internal tools, and developer-focused services where making functionality easily accessible to AI agents can dramatically improve productivity.

## How MCP works with App Service

Your App Service application implements the MCP protocol by exposing a set of tools (functions) that agents can discover and invoke. When an AI agent needs to perform an action:

1. The agent queries your MCP server to discover available tools
2. The agent selects the appropriate tool based on user intent
3. Your App Service app processes the request and returns structured results
4. The agent interprets the results and presents them to the user

App Service provides built-in support for the authentication and security features required for production MCP servers, including Microsoft Entra ID integration and managed identities.

## Two ways to host an MCP server on App Service

App Service supports two patterns for hosting an MCP server. Pick the one that matches your starting point.

### Bring your own MCP server

Add an MCP SDK to your application code, expose an MCP endpoint alongside your existing routes, and deploy the app the same way you deploy any other code to App Service. This method is the right choice when you want full control over tool definitions, when your tools don't map 1:1 to REST operations, or when you want to expose MCP [resources](https://modelcontextprotocol.io/specification/2025-06-18/server/resources) or [prompts](https://modelcontextprotocol.io/specification/2025-06-18/server/prompts) in addition to tools. The following language-specific tutorials cover this pattern.

### App Service built-in MCP (Preview)

If your app is an existing REST API with an OpenAPI 3.x specification, App Service can host an MCP server for you with no code changes. You point the platform at your OpenAPI spec, and each operation becomes an MCP tool served over streamable HTTP. Authentication, protocol negotiation, tool discovery, and hot-reload of the spec are handled by the platform.

Built-in MCP is a good fit when you want to expose an existing API to MCP clients quickly, when you want the platform to keep up with MCP protocol updates, or when you want to integrate with [App Service Authentication](overview-authentication-authorization.md) without writing OAuth code.

For configuration steps, supported limits, and the management surface, see [Configure App Service built-in MCP](configure-built-in-mcp.md).

## Get started with tutorials

## [.NET](#tab/dotnet)
- [Integrate an App Service app as an MCP Server for GitHub Copilot Chat (.NET)](tutorial-ai-model-context-protocol-server-dotnet.md)

## [Java](#tab/java)
- [Integrate an App Service app as an MCP Server for GitHub Copilot Chat (Java)](tutorial-ai-model-context-protocol-server-java.md)

## [Node.js](#tab/nodejs)
- [Integrate an App Service app as an MCP Server for GitHub Copilot Chat (Node.js)](tutorial-ai-model-context-protocol-server-node.md)

## [Python](#tab/python)
- [Integrate an App Service app as an MCP Server for GitHub Copilot Chat (Python)](tutorial-ai-model-context-protocol-server-python.md)

-----

## Related content

- [Configure App Service built-in MCP (Preview)](configure-built-in-mcp.md)
- [Integrate AI into your Azure App Service applications](overview-ai-integration.md)
- [Secure a Model Context Protocol server in Azure App Service](configure-authentication-mcp.md)
- [Secure Model Context Protocol calls to Azure App Service from Visual Studio Code with Microsoft Entra authentication](configure-authentication-mcp-server-vscode.md)
