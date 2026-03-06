---
title: Choose an Azure service for your MCP server
description: Compare Azure Container Apps, App Service, and Azure Functions for hosting MCP servers and pick the best fit for your workload.
#customer intent: As a developer, I want to understand how Azure hosting options compare for MCP servers so that I can pick the right service for my workload.
ms.topic: conceptual
ms.service: azure-container-apps
ms.collection: ce-skilling-ai-copilot
ms.custom: cross-service
ms.date: 02/19/2026
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
---

# Choose an Azure service for your MCP server

You can use several Azure services to host Model Context Protocol (MCP) servers. This guide helps you choose the right service based on your workload requirements, team expertise, and operational needs.

> [!NOTE]
> This article compares multiple Azure services to help you make a hosting decision. For Container Apps-specific details, see [MCP servers on Azure Container Apps](mcp-overview.md).

## Hosting options overview

Azure provides four ways to host an MCP server. Each option targets a different mix of flexibility, simplicity, and isolation.

### Azure Container Apps (standalone)

Deploy any MCP server you build as a container with HTTP ingress. Container Apps gives you full control over the runtime, supports any language with an MCP SDK, and includes features like autoscaling with scale-to-zero, Dapr integration, and service-to-service networking.

### Azure Container Apps dynamic sessions

Use platform-managed session pools with built-in MCP tooling for sandboxed code execution. You don't write or deploy MCP server code. The platform provides predefined tools for Python and shell environments, with Hyper-V isolation between sessions.

### Azure App Service

Add an MCP endpoint to an existing or new web app. App Service supports code-based deployment without a Dockerfile and integrates with Microsoft Entra ID for authentication.

### Azure Functions

Map function triggers to MCP tools by using the [Azure Functions MCP extension](/azure/azure-functions/scenario-custom-remote-mcp-server). Azure Functions is optimized for stateless, event-driven tool execution with per-invocation pricing.

## Compare hosting options

The following table summarizes the key differences between hosting options.

| Consideration | Container Apps (standalone) | Container Apps (sessions) | App Service | Azure Functions |
|---|---|---|---|---|
| **Custom tools** | Yes | No (platform-defined only) | Yes | Yes |
| **Language support** | Any (containerized) | Python and shell only | .NET, Python, Node.js, Java | .NET, Python, Node.js, Java |
| **MCP transport** | Streamable HTTP | JSON-RPC over HTTP | Streamable HTTP | MCP extension or self-hosted |
| **Authentication** | Built-in auth (Microsoft Entra ID) or custom | API key (`x-ms-apikey`) | App Service auth (Microsoft Entra ID) | Function keys or Microsoft Entra ID |
| **Isolation** | Container-level | Hyper-V per session | App-level | Function-level |
| **Scaling** | Revision autoscale, scale-to-zero | Per-session, pool-managed | App Service Plan | Consumption or Premium plan |
| **Cold start** | Yes (mitigate with min replicas) | Subsecond (prewarmed pool) | Depends on plan | Yes (Consumption plan) |
| **Microservices** | Native (environments, Dapr) | No | Limited | Limited |
| **Operational overhead** | Medium (Dockerfile, registry) | Low (platform-managed) | Low (code deployment) | Low (function deployment) |
| **Pricing model** | Per vCPU-second, per GiB-second | Per session (consumption) | App Service Plan | Per execution |

## Choose by scenario

Use the following guidance to narrow your decision based on common workload patterns.

### Build a custom MCP server with Azure

**Recommended: Azure Container Apps (standalone) or Azure App Service**

Both services let you build an MCP server with any official MCP SDK and expose it over streamable HTTP. Choose between them based on your deployment model and feature needs.

- **Container Apps**: Prefer containers, need autoscaling with scale-to-zero, want Dapr integration, or are building a microservices architecture with multiple MCP servers. For interactive MCP clients (like GitHub Copilot), set a minimum replica count of 1 to avoid cold-start latency.
- **App Service**: Prefer code-based deployment without a Dockerfile, have an existing App Service Plan, or want the simplicity of `az webapp up`.

Tutorials:

- [Deploy an MCP server to Container Apps (.NET)](tutorial-mcp-server-dotnet.md)
- [Deploy an MCP server to Container Apps (Python)](tutorial-mcp-server-python.md)
- [Deploy an MCP server to Container Apps (Node.js)](tutorial-mcp-server-nodejs.md)
- [Deploy an MCP server to Container Apps (Java)](tutorial-mcp-server-java.md)

### Run sandboxed code for an AI agent

**Recommended: Azure Container Apps dynamic sessions**

Session pools with MCP enabled provide Hyper-V-isolated environments for running untrusted or LLM-generated code. The platform manages the MCP server, so you don't write or deploy server code. The built-in tools cover code execution scenarios without custom development:

- `launchShell`: Creates a new environment
- `runShellCommandInRemoteEnvironment`: Executes shell commands
- `runPythonCodeInRemoteEnvironment`: Executes Python code

Dynamic sessions maintain prewarmed instances, so you don't experience cold-start latency.

Tutorials:

- [Use MCP with dynamic sessions (shell)](sessions-tutorial-shell-mcp.md)
- [Use MCP with dynamic sessions (Python)](sessions-tutorial-python-mcp.md)

### Add MCP to an existing web app

**Recommended: Azure App Service**

If your app already runs on App Service, add the MCP SDK to your existing codebase, mount the MCP endpoint alongside your existing routes, and redeploy.

- [Integrate an App Service app as an MCP server (.NET)](/azure/app-service/tutorial-ai-model-context-protocol-server-dotnet)
- [Integrate an App Service app as an MCP server (Python)](/azure/app-service/tutorial-ai-model-context-protocol-server-python)

If your existing app runs on Container Apps, follow the [standalone tutorials](#build-a-custom-mcp-server-with-azure).

### Create lightweight, event-driven tool endpoints

**Recommended: Azure Functions**

The Azure Functions [MCP extension](/azure/azure-functions/scenario-custom-remote-mcp-server) maps function triggers to MCP tools. Azure Functions is a good fit when:

- Each tool is independent and stateless.
- You want per-invocation pricing.
- You're integrating with [Foundry Agent Service](/azure/azure-functions/functions-mcp-foundry-tools).

For interactive MCP clients, use a Functions Premium plan to avoid cold-start latency on the Consumption plan.

### Run multiple MCP servers with service-to-service communication

**Recommended: Azure Container Apps (standalone)**

Container Apps environments support internal service discovery, Dapr sidecars, and managed identities for service-to-service calls. Deploy multiple MCP servers as separate container apps within the same environment and let them communicate securely without exposing internal endpoints to the internet. Container Apps gives you full control over the runtime and dependencies for each server, but you manage a Dockerfile and container images for each one.

## Quick decision guide

Use these questions to narrow your choice:

1. **Do you need sandboxed code execution for untrusted or LLM-generated code?** Use Azure Container Apps dynamic sessions.
1. **Do you already have a web app running on App Service?** Add MCP to your existing Azure App Service app.
1. **Do you need event-driven, per-invocation tool execution?** Use Azure Functions.
1. **Do you need full container control, custom languages, or a microservices architecture?** Use Azure Container Apps (standalone).
1. **Not sure where to start?** Begin with Azure Container Apps (standalone), which is the most flexible default.

## Related content

- [MCP servers on Azure Container Apps](mcp-overview.md)
- [Azure Container Apps overview](overview.md)
- [Dynamic sessions in Azure Container Apps](sessions.md)
- [Azure App Service overview](/azure/app-service/overview)
- [Azure Functions overview](/azure/azure-functions/functions-overview)
- [Connect an MCP server on Azure Functions to a Foundry Agent Service agent](/azure/azure-functions/functions-mcp-foundry-tools)
