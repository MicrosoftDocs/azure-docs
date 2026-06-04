---
title: SRE Agent MCP server in Azure SRE Agent
description: Manage and operate your SRE Agent from VS Code, Copilot CLI, Cursor, Claude Desktop, or any MCP-compatible client through the Azure MCP Server.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 06/02/2026
author: dchelupati
ms.author: dchelupati
ms.reviewer: cshoe
ms.ai-usage: ai-assisted
ms.custom: mcp, model-context-protocol, ide, vscode, copilot, cursor, claude, terminal, cli, azure-mcp-server
#customer intent: As an SRE, I want to manage my SRE Agent from my IDE or terminal so that I can investigate incidents without switching tools.
---

# SRE Agent MCP server in Azure SRE Agent

Your SRE Agent builds deep context about your services over time: incident patterns, architecture details, operational expertise. With the SRE Agent MCP Server, that knowledge is available directly in your IDE, terminal, or AI assistant.

During coding, debugging, or incident response, ask your agent a question, start an investigation, or configure a connector without switching tools. Your development environment and your agent's operational intelligence connect through the same natural language interface you already use.

## Connect to the SRE Agent MCP server

The SRE Agent tools are part of the [Azure MCP Server](/azure/developer/azure-mcp-server/), which implements the [Model Context Protocol](https://modelcontextprotocol.io/) (MCP). You install the Azure MCP Server in your MCP client, and the SRE Agent tools become available alongside other Azure tools. The server runs locally via `npx` and handles authentication, endpoint resolution, and API calls on your behalf.

Two API layers handle different operations:

| Layer | What it handles | Authentication |
|-------|----------------|----------------|
| **Control plane (ARM)** | Agent resources, connectors | Reader role via Azure Resource Manager |
| **Data plane** | Threads, memories, tasks, skills, incidents | SRE Agent Administrator role via agent endpoint (`*.azuresre.ai`) |

The server resolves agent endpoints automatically through Azure Resource Graph. You provide a subscription and agent name, and the server finds the endpoint.

Tools appear with the `sreagent_` prefix in your MCP client (for example, `sreagent_agents_list`, `sreagent_threads_create`).

## Permissions

Two Azure RBAC roles on the `Microsoft.App/agents` resource:

| Role | Scope | What it enables |
|------|-------|----------------|
| **Reader** | Control plane (ARM) | List and get agents, connectors |
| **SRE Agent Administrator** | Data plane | Threads, memories, scheduled tasks, skills, hooks, prompts, incidents, workflows |

## Supported clients

| Client | Installation method |
|--------|-------------------|
| **VS Code with GitHub Copilot** | Install the Azure MCP Server extension, sign in to Azure |
| **GitHub Copilot CLI** | Use `/mcp add` or manually configure `~/.copilot/mcp.json` |
| **Cursor** | Add to MCP configuration |
| **Claude Code** | Add to user or project MCP configuration |
| **Claude Desktop** | Install MCPB bundle or configure local server command |
| **Other MCP clients** | Configure by using `npx`, `dotnet`, `uvx`, Docker, or other supported methods |

## Available operations and example prompts

Key capability areas, each accessible through natural language prompts:

| Area | Operations | Example prompt |
|------|-----------|---------------|
| **Manage agents** | List, get details, create, and delete sub-agents | "List my SRE agents in subscription X" |
| **Configure connectors** | Create Kusto and MCP connectors, test, and delete | "Create a Kusto connector named prod-logs on agent Y" |
| **Run investigations** | Create threads, send messages, autonomous investigation | "Investigate why production API has elevated latency" |
| **Schedule work** | Create, pause, resume, and delete scheduled tasks | "Pause the nightly scheduled task on agent Y" |
| **Manage incidents** | List active incidents, set up PagerDuty and ServiceNow | "List active incidents on agent Y" |
| **Knowledge and prompts** | Search and upload memories, manage common prompts | "Search memories for 'deployment failures'" |
| **Author workflows** | Generate, validate, apply YAML workflows | "Generate a workflow for automated rollback" |

### Autonomous investigation

The `investigate` command runs a multistep investigation loop. Your agent reasons about the problem, requests data, forms hypotheses, and follows up automatically.

- **Default limits:** 20 iterations, 10-minute timeout (both configurable via `--max-iterations` and `--timeout-seconds`)
- **Standard mode:** Pauses at approval gates for human confirmation
- **Auto-approval mode (`investigate_yolo`):** Continues through all gates autonomously

> [!WARNING]
> The `investigate_yolo` command auto-approves **all** approval gates, including actions that modify your infrastructure (pod deletion, Kubernetes YAML application, scaling, incident state changes). There's no read-only restriction. The agent can invoke any tool its managed identity permits. Don't use this command in production unless you accept fully autonomous infrastructure modification.

## SRE Agent MCP server compared to MCP connectors

These two options use the same protocol but work in opposite directions:

| Feature | Direction | Use case |
|---------|-----------|----------|
| **SRE Agent MCP server** (this article) | Your IDE or CLI calls **into** SRE Agent | Manage and operate agents from your development environment |
| **MCP connectors** | SRE Agent calls **out to** external MCP servers | Extend your agent with Datadog, GitHub, Splunk tools |

## Safety guardrails

| Protection | Description |
|-----------|-------------|
| **Destructive confirmation** | Delete operations require `--confirm true`. No accidental teardowns. |
| **Approval gates** | Write operations require human approval in standard mode. In auto-approval mode (`investigate_yolo`), all gates are bypassed. |
| **Secret redaction** | Common credential patterns, including bearer tokens, API keys, and passwords, are stripped from responses before reaching your client. |
| **Error sanitization** | Upstream error bodies are scrubbed for credentials and truncated. |
| **Endpoint pinning** | Data-plane calls are restricted to allowed Azure SRE domains (HTTPS only). |
| **Third-party host validation** | ServiceNow restricted to `.service-now.com`; PagerDuty subdomains validated. |
| **MCP connector secrets** | Environment values must use `${env:NAME}` syntax. Literal secrets are rejected. |

