---
title: Azure SRE Agent MCP Server Overview
description: Learn how to use Azure SRE Agent MCP Server to discover resources, start investigation threads, and manage agents from MCP clients.
ms.topic: overview
ms.service: azure-sre-agent
ms.date: 05/26/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: mcp, model context protocol, azure mcp server, copilot, claude code, sre agent
#customer intent: As an SRE, I want to understand how MCP clients can connect to Azure SRE Agent so that I can investigate and manage agents from my development tools.
---

# SRE Agent Model Context Protocol (MCP) server overview

The SRE Agent tools in Azure MCP Server let MCP clients discover Azure SRE Agent resources, open investigation threads, send follow-up messages, and manage agent configuration from an agentic development environment. Use this experience when you're working with SRE Agent from GitHub Copilot CLI, Claude Code, VS Code, or another MCP-capable client.

For more information on how to work with the Azure MCP server, see [Get started with the Azure MCP Server](/azure/developer/azure-mcp-server/get-started).

## What is the SRE Agent MCP server experience?

The SRE Agent MCP server experience is a set of SRE Agent tools exposed through [Azure MCP Server](/azure/developer/azure-mcp-server/). Azure MCP Server implements the Model Context Protocol (MCP), so MCP clients can call Azure tools through natural language prompts.

For SRE Agent, the MCP tools help you:

- Discover SRE Agent resources in a subscription.
- Get the data-plane endpoint for an agent.
- Create an investigation thread.
- Send messages to an existing thread.
- Run an autonomous investigation loop.
- Manage agent configuration such as skills, connectors, hooks, subagents, scheduled tasks, common prompts, and incident-response integrations.

## How it works

The following flow shows how an MCP client reaches SRE Agent through Azure MCP Server:

1. You create an SRE Agent resource in Azure. The resource is a `Microsoft.App/agents` resource and includes an agent endpoint.
1. You install Azure MCP Server in an MCP client or host.
1. The MCP client starts Azure MCP Server locally or connects to a hosted server.
1. Azure MCP Server authenticates by using the Azure identity available on the host.
1. The client asks Azure MCP Server to discover SRE Agent resources.
1. Azure MCP Server resolves the SRE Agent endpoint through Azure Resource Graph.
1. Azure MCP Server proxies thread and task requests to the selected SRE Agent endpoint.

## Supported clients

Azure MCP Server supports multiple MCP hosts and installation methods. Common clients for SRE Agent include:

| Client or host | Typical setup |
|---|---|
| VS Code with GitHub Copilot | Install the Azure MCP Server extension and sign in to Azure. |
| GitHub Copilot CLI | Add Azure MCP Server with `/mcp add`, then verify with `/mcp show`. |
| Claude Code | Add Azure MCP Server to your user or project MCP configuration. |
| Claude Desktop | Install the Azure MCP Server MCPB bundle, or configure a local server command. |
| Other MCP clients | Configure Azure MCP Server by using `npx`, `dnx`, `uvx`, Docker, or another supported package method. |

For installation details and client-specific configuration, see [Azure MCP Server](/azure/developer/azure-mcp-server/).

## Authentication and permissions

Azure MCP Server uses the Azure authentication context available on the host. Supported authentication methods include Azure CLI sign-in, VS Code Azure sign-in, Azure PowerShell sign-in, environment credentials, and managed identity.

The MCP server doesn't grant new permissions. SRE Agent operations run within the caller's existing Azure permissions and SRE Agent access. If the caller lacks permission to list resources, open a thread, or change agent configuration, the operation fails with an authorization error.

> [!IMPORTANT]
> Interactive authentication fallback is suppressed when Azure MCP Server runs in server mode. Sign in before you start the server, or configure a noninteractive credential such as managed identity or environment credentials.

Set `AZURE_TOKEN_CREDENTIALS` to pin the credential type when multiple credential sources are available.

## Connection workflow

Use this high-level workflow to connect an MCP client to SRE Agent:

1. **Provision SRE Agent.** Create the SRE Agent resource by using the Azure portal, ARM, or Bicep. This step creates the `Microsoft.App/agents` resource and its agent endpoint.

1. **Install Azure MCP Server:** Use a supported method such as the VS Code extension, `npx`, `dnx`, `uvx`, Docker, MCPB, or a client-specific installer.

1. **Register Azure MCP Server with your MCP client:** Choose a tool exposure mode. The default mode groups tools by namespace.

1. **Authenticate to Azure:** Sign in on the host or provide a managed identity or environment credential.

1. **Discover agents:** Ask the MCP client to list SRE Agent resources in a subscription.

1. **Start an investigation:** Ask the client to create a thread or run an investigation against a selected agent.

1. **Manage the agent:** Use the management tools to configure skills, connectors, hooks, subagents, scheduled tasks, prompts, and incident-response integrations.

## Example prompts

After the client connects and authenticates, ask SRE Agent questions in natural language. The client chooses the relevant Azure MCP Server tools.

To help select the agent you want to work with, you can begin with a prompt to list available agents in your subscription.

```text
List my SRE Agent resources in subscription <SUBSCRIPTION_ID>.
```

```text
Create an SRE Agent thread for <agent-name> and investigate why the production API has elevated latency.
```

```text
Continue the investigation thread and check whether recent deployments or PagerDuty incidents are related.
```

For clients that expose raw tool calls, the SRE Agent tools use consolidated intents. Common operations include:

| Operation | Tool and intent |
|---|---|
| List SRE Agent resources | `get_azure_sre_agent_resources` with `intent: agents_list` |
| Create a thread | `interact_with_azure_sre_agent_threads_and_tasks` with `intent: threads_create` |
| Send a follow-up message | `interact_with_azure_sre_agent_threads_and_tasks` with `intent: threads_send-message` |
| Run an autonomous investigation | `interact_with_azure_sre_agent_threads_and_tasks` with `intent: threads_investigate-with-agent` |

The autonomous investigation loop supports configurable iteration and timeout settings. The default maximum iteration count is 20, and the default timeout is 600 seconds.

## What you can do

Use the SRE Agent MCP server experience for the following scenarios:

- **Find agents quickly:** List available SRE Agent resources by subscription and see each agent's name, resource group, location, provisioning state, and data-plane endpoint.

- **Investigate from your development environment:** Start an incident investigation from Copilot CLI, Claude Code, or another MCP-capable client.

- **Continue investigations:** Send follow-up messages to an existing SRE Agent thread without leaving your MCP client.

- **Automate common setup:** Configure agent skills, connectors, hooks, subagents, scheduled tasks, prompts, and incident-response integrations when you have write permissions.

- **Use existing Azure security boundaries:** Keep operations constrained by the caller's Azure RBAC and SRE Agent permissions.

## Limitations

Keep these limitations in mind when using the MCP server:

- You must create the SRE Agent resource before Azure MCP Server can discover or operate on it.

- Azure MCP Server doesn't elevate permissions. You need to already have the permissions required for the requested operation.

- Client setup differs across MCP hosts. Validate the configuration format for your client before publishing a team-wide setup guide.

## SRE Agent MCP server compared to MCP connectors

SRE Agent uses MCP in two different directions:

| Capability | Direction | When to use |
|---|---|---|
| SRE Agent MCP server tools in Azure MCP Server | Your MCP client calls SRE Agent | You want Copilot CLI, Claude Code, VS Code, or another client to discover agents and run investigations. |
| [MCP connectors](mcp-connectors.md) | SRE Agent calls external MCP servers | You want your agent to use tools from GitHub, Datadog, Splunk, New Relic, or a custom MCP server during investigations. |

## Related content

- [Overview of Azure SRE Agent](overview.md)
- [MCP connectors and tools in Azure SRE Agent](mcp-connectors.md)
- [Threads](threads.md)
- [Permissions](permissions.md)
