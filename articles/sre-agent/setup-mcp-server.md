---
title: "Set Up the SRE Agent MCP Server in Azure"
description: "Learn how to set up the SRE Agent MCP server to connect VS Code, Cursor, or Claude to your Azure SRE Agent. Follow step-by-step instructions to configure permissions and start investigations."
ms.topic: how-to
ms.service: azure-sre-agent
ms.date: 06/02/2026
author: dchelupati
ms.author: dchelupati
ms.reviewer: cshoe
ms.ai-usage: ai-assisted
---

# Set up the SRE Agent MCP server

You set up a working connection between your MCP client (VS Code, Copilot CLI, Cursor, or Claude) and your SRE Agent. After setup, you can list agents, run investigations, manage connectors, and search knowledge in natural language. For more information, see [SRE Agent MCP server](mcp-server.md).

## Prerequisites

- An [SRE Agent resource](create-agent.md) in Azure (provisioning state: **Succeeded**)
- [Node.js LTS](https://nodejs.org/) installed
- [Azure CLI](/cli/azure/install-azure-cli) installed
- An MCP-compatible client: VS Code with GitHub Copilot, Copilot CLI, Cursor, Claude Code, or Claude Desktop

## Sign in to Azure

```bash
az login
```

If you have multiple subscriptions, set a default:

```bash
az account set --subscription <subscription-id>
```

> [!NOTE]
> If your SRE Agent is in a different tenant from your workstation, specify the tenant:
>
> ```bash
> az login --tenant <agent-tenant-id>
> ```
>
> This command changes credential context for all subsequent CLI operations in the session. After finishing MCP work, run `az login` without `--tenant` to return to your default tenant.

## Assign permissions for SRE Agent

You need the **Reader** role (control-plane) and the **SRE Agent Administrator** role (data-plane) on the SRE Agent resource. For details on what each role enables, see [SRE Agent MCP server](mcp-server.md).

> [!NOTE]
> Assign roles at the narrowest scope possible, preferably the individual agent resource. Subscription-scope Reader grants read access to all resources in the subscription, not just your agent.

```bash
# Find your object ID
az ad signed-in-user show --query id -o tsv

# Control-plane access (list and get agents, connectors)
az role assignment create \
  --assignee <your-upn-or-object-id> \
  --role "Reader" \
  --scope /subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.App/agents/<agentName>

# Data-plane access (threads, memories, tasks, prompts, workflows)
az role assignment create \
  --assignee <your-upn-or-object-id> \
  --role "SRE Agent Administrator" \
  --scope /subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.App/agents/<agentName>
```

## Register the Azure MCP server with your client

### [VS Code](#tab/vscode)

Install the **Azure MCP Server** extension from the VS Code marketplace. Sign in to your Azure account when prompted.

The extension registers the MCP server automatically. After installation, SRE Agent tools are available in the Copilot Chat sidebar.

### [Copilot CLI](#tab/copilot-cli)

From within Copilot CLI, run:

```
/mcp add
```

Follow the prompts:

- **Name:** `azure`
- **Command:** `npx`
- **Args:** `-y @azure/mcp@latest server start`

Or add manually to `~/.copilot/mcp.json`:

```json
{
  "mcpServers": {
    "azure": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@azure/mcp@latest", "server", "start"]
    }
  }
}
```

Restart Copilot CLI after saving.

### [Cursor](#tab/cursor)

Add the Azure MCP Server to your Cursor MCP configuration. See [Cursor MCP documentation](https://docs.cursor.com/context/model-context-protocol) for the configuration file location.

```json
{
  "mcpServers": {
    "azure": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@azure/mcp@latest", "server", "start"]
    }
  }
}
```

### [Claude Code](#tab/claude-code)

Add to your project's `.mcp.json` or user MCP configuration:

```json
{
  "mcpServers": {
    "azure": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@azure/mcp@latest", "server", "start"]
    }
  }
}
```

### [Claude Desktop](#tab/claude-desktop)

Install the Azure MCP Server MCPB bundle, or add a local server command to your Claude Desktop MCP settings:

```json
{
  "mcpServers": {
    "azure": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@azure/mcp@latest", "server", "start"]
    }
  }
}
```

---

## Verify the MCP server connection

Ask your client:

> "List my SRE agents in subscription `<subscription-id>`"

You should see your agents listed with their names, resource groups, locations, and status.

If `sreagent_*` tools appear and return results, the connection is working.

## Start an SRE Agent investigation

> "Create a thread on agent `<agent-name>` and investigate why the production API has elevated latency"

Your agent creates a thread, investigates the issue, and returns findings inline.

## Explore SRE Agent operations

Try these prompts:

```text
"Search memories on agent <agent-name> for 'deployment failures'"
"List scheduled tasks on agent <agent-name>"
"Create a Kusto connector named prod-logs pointing at cluster https://help.kusto.windows.net, database Samples"
"List active incidents on agent <agent-name>"
"Pause the nightly health check on agent <agent-name>"
```

## Keep the Azure MCP server up to date

The `@latest` tag pulls the newest version on each launch, but `npx` caches aggressively. To force an update, run:

```bash
rm -rf ~/.npm/_npx
```

For version stability, pin an exact version:

```json
"args": ["-y", "@azure/mcp@1.2.3", "server", "start"]
```

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `sreagent_*` tools don't show up | Stale npx cache | Run `rm -rf ~/.npm/_npx`, restart client |
| "SRE Agent resource not found" | Wrong tenant or subscription | Run `az login --tenant <id>`, set correct subscription. |
| 401/403 on data-plane calls | Missing SRE Agent Administrator role | Assign the role at the agent scope. |
| 403 on ARM calls | Missing Reader role | Assign Reader at subscription, RG, or agent scope. |
| "No agent endpoint" | Agent not fully provisioned | Check provisioningState in the Azure portal. |
| Wrong tenant errors | Credentials from a different tenant | Run `az login --tenant <id>`, restart client. |

## Related content

- [SRE Agent MCP server](mcp-server.md)
- [MCP connectors and tools](mcp-connectors.md)
- [Threads](threads.md)
- [Scheduled tasks](scheduled-tasks.md)
