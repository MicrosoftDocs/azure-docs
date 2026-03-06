---
title: Host MCP servers on Azure Container Apps
description: Learn how to host MCP servers on Azure Container Apps as standalone container apps or with dynamic sessions.
#customer intent: As a developer, I want to deploy an MCP server as a standalone container app so that I can expose custom tools and connect to backend services.
ms.topic: conceptual
ms.service: azure-container-apps
ms.collection: ce-skilling-ai-copilot
ms.date: 02/19/2026
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
---

# Host MCP servers on Azure Container Apps

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is an open standard that connects AI applications to external data sources and tools. By using MCP, AI clients like GitHub Copilot can discover and invoke capabilities you expose, turning your APIs, databases, and business logic into tools an AI agent can use through natural language.

Azure Container Apps supports two hosting models for MCP servers:

| Hosting model | Description |
|---|---|
| **Standalone container app** | Deploy any MCP server you build as a container with HTTP ingress. |
| **Dynamic sessions** | Use platform-managed session pools with built-in MCP tooling for sandboxed code execution. |

## What is Model Context Protocol (MCP)?

An MCP server exposes three types of capabilities to clients:

| Capability | Description | Example |
|---|---|---|
| **Tools** | Functions the AI model can invoke (with user approval) | `createTask`, `listTasks`, `deleteTask` |
| **Resources** | Read-only data the client can fetch | Configuration files, database schemas |
| **Prompts** | Prewritten templates for common tasks | "Summarize all open tasks" |

Clients communicate with MCP servers over HTTP by using the [streamable HTTP transport](https://modelcontextprotocol.io/docs/learn/architecture#transport-layer). The client sends JSON-RPC 2.0 requests. The server responds with tool results, resource content, or prompt templates.

The request flow follows this pattern:

1. The **MCP client** (GitHub Copilot, Claude, or a custom client) sends an HTTPS request containing a JSON-RPC 2.0 message to the server.

1. The **MCP server** (your container app) processes the request and calls any backend services it needs, such as a database or API.

1. The server returns a JSON-RPC 2.0 response with tool results, resource content, or prompt templates.

## Standalone container app

You build an MCP server by using an [official MCP SDK](https://modelcontextprotocol.io/docs/sdk) (available for .NET, Python, TypeScript, Java, Go, Kotlin, and others), then containerize and deploy it to Azure Container Apps.

In this model, Container Apps has no MCP-specific awareness. The platform provides:

- **HTTPS ingress** with automatic TLS termination
- **Autoscaling**, including scale-to-zero (a minimum of one replica is recommended for interactive MCP use)
- **CORS policy** to allow cross-origin requests from VS Code and browser-based clients
- **Built-in authentication** with Microsoft Entra ID (optional)
- **Custom domains**, traffic splitting, Dapr, service-to-service networking, managed identity, and all other standard Container Apps features

### Request flow

When you deploy an MCP server as a standalone container app, client requests flow through Container Apps ingress to your container, where your MCP endpoint processes the JSON-RPC message and returns results.

1. An MCP client sends an HTTPS request to the container app's FQDN.
1. Container Apps ingress terminates TLS and forwards the request to your container on the configured target port (for example, 8080).
1. Your web framework (ASP.NET, FastAPI, Express, Spring Boot) routes the request to the MCP endpoint (typically `/mcp`).
1. Your MCP server processes the request, calls any backend services, and returns a JSON-RPC 2.0 response.

### When to use

Use a standalone container app if you want to build custom MCP tools in any language, integrate with backend services, and use standard Container Apps features.

- You want full control over tool definitions, middleware, and business logic.
- Your MCP server is written in any language with an MCP SDK.
- You need to connect to backend databases, APIs, or Azure services.
- You want to use Container Apps features like Dapr, service-to-service networking, or managed identity.

## Dynamic sessions (platform-managed MCP)

[Azure Container Apps dynamic sessions](/azure/container-apps/sessions) provide sandboxed environments for running code in isolation. When you enable MCP on a session pool, the platform exposes a JSON-RPC endpoint that clients can use to launch shell or Python environments and execute commands remotely.

In this model, the platform manages the MCP server. You don't write or deploy MCP server code. The platform provides the following predefined tools:

| Tool | Description |
|---|---|
| `launchShell` | Creates a new environment and returns an `environmentId` |
| `runShellCommandInRemoteEnvironment` | Executes a shell command in an existing environment |
| `runPythonCodeInRemoteEnvironment` | Executes Python code in an existing environment |

> [!NOTE]
> The platform-managed MCP server exposes all three tools regardless of the session pool's `containerType`. Use `launchShell` to create an environment for both shell and Python pools.

### Request flow

When you deploy an MCP server by using dynamic sessions, the platform manages the server and provides a JSON-RPC endpoint that clients use to execute shell or Python code in sandboxed environments.

1. An MCP client sends an HTTPS request to the session pool's `/mcp` endpoint with an `x-ms-apikey` header for authentication.
1. The platform reverse proxy validates the API key and routes the request to the appropriate Hyper-V sandboxed session.
1. The session executes the requested shell command or Python code inside the sandbox.
1. The platform returns a JSON-RPC 2.0 response containing execution results.

### When to use

- You need sandboxed code execution for untrusted or LLM-generated code.
- Your use case is Python or shell scripting and no custom tools are needed.
- You want Hyper-V isolation between sessions for security.
- You don't want to build or maintain an MCP server application.

### Authentication

Dynamic sessions MCP uses API key authentication through the `x-ms-apikey` header. This mechanism is distinct from the bearer-token authentication used by standard session pool APIs.

Retrieve the API key by using the Azure CLI:

```azurecli
az rest --method POST \
    --uri "https://management.azure.com/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP_NAME>/providers/Microsoft.App/sessionPools/<POOL_NAME>/fetchMCPServerCredentials" \
    --uri-parameters api-version=2025-02-02-preview \
    --query "apiKey" -o tsv
```

### Protocol details

The platform-managed MCP server for dynamic sessions implements the following protocol specifications:

| Property | Value |
|---|---|
| MCP protocol version | `2025-03-26` |
| Server name | `Microsoft Container Apps MCP Server` |
| Transport | JSON-RPC 2.0 over HTTP |
| API version | `2025-02-02-preview` |
| Supported methods | `initialize`, `tools/list`, `tools/call` |

> [!IMPORTANT]
> The platform-managed MCP feature for dynamic sessions is in **preview**. The API version `2025-02-02-preview` and `mcpServerSettings` Azure Resource Manager (ARM) properties are subject to change.

## Ingress and networking

The Container Apps ingress `transport` field supports `auto`, `http`, `http2`, and `tcp`. The MCP streamable HTTP transport runs inside your container over standard HTTP, so set `transport` to `auto` or `http` (the default). There's no special MCP transport value.

You must configure a [CORS policy](/azure/container-apps/cors) if VS Code or browser-based clients access your MCP server. At minimum, allow the origins, methods, and headers required by your MCP client.

## Compare hosting options

The following table compares the two hosting models.

| Consideration | Standalone container app | Dynamic sessions (managed MCP) |
|---|---|---|
| Custom tools | Yes, define any tools you want | No, platform-defined tools only |
| Languages | Any language with an MCP SDK | Python and shell execution only |
| MCP transport | Streamable HTTP (inside container) | JSON-RPC over HTTP (platform-managed) |
| Authentication | Built-in auth (Microsoft Entra ID) | API key (`x-ms-apikey`) |
| Isolation | Container-level | Hyper-V per session |
| Scaling | Revision-based autoscale | Per-session, pool-managed |
| Use case | General-purpose MCP servers | Sandboxed code execution |

For a broader comparison that includes App Service and Azure Functions, see [Choosing an Azure service for your MCP server](mcp-choosing-azure-service.md).

## Next step

> [!div class="nextstepaction"]
> [Deploy an MCP server to Container Apps](tutorial-mcp-server-dotnet.md)
