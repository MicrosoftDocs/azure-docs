---
title: API reference for Azure SRE Agent
description: REST API reference for control plane (ARM) and data plane operations, authentication, RBAC roles, and examples.
ms.topic: reference
ms.service: azure-sre-agent
ms.date: 05/12/2026
author: dchelupati
ms.author: dchelupati
ms.ai-usage: ai-assisted
ms.custom: api, rest, arm, data-plane, authentication, rbac, automation, ci-cd
#customer intent: As a developer, I want to use REST APIs to manage Azure SRE Agent programmatically so I can automate and integrate with external systems.
---

# API reference for Azure SRE Agent

REST API operations for managing and interacting with Azure SRE Agent programmatically.

## Overview

Azure SRE Agent provides REST APIs at two layers. Use the **control plane (ARM)** to create, configure, and delete agents and their sub-resources. Use the **data plane** for runtime operations like chat, repo management, and knowledge uploads.

| Plane | Base URL | Auth | Use for |
|-------|----------|------|---------|
| Control plane | `management.azure.com` | Standard Azure RBAC | Create, update, delete agents and config |
| Data plane | Per-agent endpoint | `azuresre.dev` audience | Chat, repos, hooks, knowledge, triggers |

## Authentication

### Control plane (ARM)

Standard Azure authentication - Azure CLI, service principal, or managed identity:

```bash
# Interactive login
az login

# Service principal
az login --service-principal -u $APP_ID -p $SECRET --tenant $TENANT_ID

# Managed identity (from Azure VM or Container App)
az login --identity
```

### Data plane

The data plane requires a separate token with audience `https://azuresre.dev`:

```bash
# Step 1: Get the agent's data plane endpoint
ENDPOINT=$(az rest -m GET \
  --url "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.App/agents/{agentName}?api-version=2025-05-01-preview" \
  --query properties.agentEndpoint -o tsv)

# Step 2: Get a data plane token
TOKEN=$(az account get-access-token \
  --resource https://azuresre.dev \
  --query accessToken -o tsv)

# Step 3: Call the data plane
curl -H "Authorization: Bearer $TOKEN" "$ENDPOINT/api/v1/threads"
```

> [!NOTE]
> The agent endpoint is unique per agent. It follows the pattern `https://{name}--{id}.{hash}.{region}.azuresre.ai` and the ARM GET operation returns this endpoint in `properties.agentEndpoint`.

## RBAC roles

| Role | Description | Scope |
|--|--|--|
| **SRE Agent Administrator** | Full control over agent configuration and operations | Agent resource |
| **SRE Agent User** | Chat, approve actions, manage threads | Agent resource |
| **SRE Agent Reader** | Read-only access to agent configuration and threads | Agent resource |

Assign roles by using the Azure portal, CLI, or ARM API:

```bash
az role assignment create \
  --assignee {userOrServicePrincipalId} \
  --role "SRE Agent Administrator" \
  --scope "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.App/agents/{name}"
```

## Control plane (ARM) operations

### API version

```
2025-05-01-preview
```

> [!NOTE]
> Both the control plane and data plane APIs are currently in **preview**. Endpoint paths, request and response schemas, and behavior might change before general availability. Pin your integrations to this API version and test after upgrades.

### Base URL

```
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.App/agents/{agentName}
```

Append the path suffix from the operations table, then add `?api-version=2025-05-01-preview` as a query parameter. For example: `.../agents/{agentName}/start?api-version=2025-05-01-preview`.

### Agent resource operations

| Operation | Method | Path suffix |
|-----------|--------|-------------|
| Create or update | `PUT` | (none) |
| Get | `GET` | (none) |
| Delete | `DELETE` | (none) |
| Start | `POST` | `/start` |
| Stop | `POST` | `/stop` |
| Get usages | `GET` | `/usages` |
| Get daily usages | `GET` | `/dailyusages` |

### Agent properties

| Property | Type | Description |
|----------|------|-------------|
| `provisioningState` | string | `Succeeded`, `Failed`, `InProgress`, `Canceled`, `Deleting` (read-only) |
| `agentEndpoint` | string | Data plane URL (read-only) |
| `powerState` | string | `Running` or `Stopped` (read-only) |
| `outboundIpAddresses` | string[] | Outbound IPs for allow list (read-only) |
| `actionConfiguration.mode` | string | `Review`, `Automatic`, or `ReadOnly` |
| `actionConfiguration.accessLevel` | string | `Low` or `High` |
| `defaultModel.provider` | string | `Anthropic` or `MicrosoftFoundry` (Open AI) |
| `defaultModel.name` | string | Model name (for example, `Automatic`) |
| `upgradeChannel` | string | `Stable` or `Preview` |
| `monthlyAgentUnitLimit` | number | Monthly active flow AAU cap (doesn't include always-on flow) |
| `knowledgeGraphConfiguration.identity` | string | Managed identity resource ID |
| `knowledgeGraphConfiguration.managedResources` | string[] | Resource group IDs the agent can access |
| `logConfiguration` | object | Application Insights configuration |
| `incidentManagementConfiguration.type` | string | `PagerDuty`, `AzMonitor`, `ServiceNow`, or `None` |
| `mcpServers` | string[] | MCP server URLs |
| `vnetConfiguration.subnetResourceId` | string | VNet injection subnet |
| `experimentalSettings` | object | Feature flag overrides |

### Sub-resources

| Sub-resource | ARM type | Path |
|--------------|----------|------|
| Connectors | `Microsoft.App/agents/DataConnectors` | `/DataConnectors/{name}` |
| Skills | `Microsoft.App/agents/skills` | `/skills/{name}` |
| Subagents | `Microsoft.App/agents/subagents` | `/subagents/{name}` |
| Tools | `Microsoft.App/agents/tools` | `/tools/{name}` |
| Scheduled tasks | `Microsoft.App/agents/scheduledTasks` | `/scheduledTasks/{name}` |
| Incident filters | `Microsoft.App/agents/incidentFilters` | `/incidentFilters/{name}` |
| Hooks | `Microsoft.App/agents/hooks` | `/hooks/{name}` |
| Common prompts | `Microsoft.App/agents/commonPrompts` | `/commonPrompts/{name}` |

All sub-resources support `PUT` (create/update), `GET`, and `DELETE` operations.

### Sub-resource body formats

**Connectors** use direct properties:

```bash
az rest -m PUT \
  --url "https://management.azure.com/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.App/agents/{agent}/DataConnectors/my-kusto?api-version=2025-05-01-preview" \
  --body '{
    "properties": {
      "name": "my-kusto",
      "dataConnectorType": "Kusto",
      "dataSource": "https://mycluster.eastus2.kusto.windows.net",
      "identity": "system"
    }
  }'
```

**Other sub-resources** (skills, subagents, tools, and so on) use a base64-encoded envelope:

```bash
# The spec is base64-encoded inside properties.value
SPEC='{"name":"my-tool","description":"Query Azure Resource Graph"}'
ENCODED=$(echo -n "$SPEC" | base64)

az rest -m PUT \
  --url "...Microsoft.App/agents/{agent}/tools/my-tool?api-version=2025-05-01-preview" \
  --body "{\"properties\":{\"value\":\"$ENCODED\"}}"
```

### Connector types

| Type | Value | Use case |
|------|-------|----------|
| Azure Data Explorer | `Kusto` | Query ADX clusters |
| Application Insights | `Kusto` | Query App Insights |
| Log Analytics | `Kusto` | Query Log Analytics |
| MCP | `Mcp` | MCP-compatible connectors (Datadog, Splunk, etc.) |
| PagerDuty | `Mcp` | PagerDuty incidents |
| ServiceNow | `Mcp` | ServiceNow incidents |
| Outlook | `Outlook` | Email notifications |
| Teams | `Teams` | Teams channel notifications |

## Data plane operations

Use the data plane API to interact with a running agent, including sending messages, managing approvals, uploading knowledge, and configuring repos, hooks, and triggers.

### Base URL

Get from ARM:

```bash
ENDPOINT=$(az rest -m GET \
  --url "...Microsoft.App/agents/{name}?api-version=2025-05-01-preview" \
  --query properties.agentEndpoint -o tsv)
```

All data plane paths start with `$ENDPOINT/api/...`.

### Threads and chat

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/threads` | List conversation threads |
| `GET` | `/api/v1/threads/{threadId}` | Get a specific thread |
| `POST` | `/api/v1/threads/{threadId}/messages` | Send a message (start a conversation) |
| `GET` | `/api/v1/threads/{threadId}/messages` | Get messages in a thread |

### Approvals

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/approvals/{threadId}` | List pending approvals |
| `POST` | `/api/v1/approvals/{threadId}/{id}/decision` | Approve or reject an action |

### Code repos

| Method | Path | Description |
|--------|------|-------------|
| `PUT` | `/api/v2/repos/{repoName}` | Add a code repository |
| `GET` | `/api/v2/repos` | List repositories |
| `GET` | `/api/v2/repos/{repoName}` | Get repo details |
| `DELETE` | `/api/v2/repos/{repoName}` | Remove a repository |
| `POST` | `/api/v2/repos/{repoName}/test` | Test repo connectivity |

### Knowledge (agent memory)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/agentmemory/upload` | Upload documents (multipart, max 100 MB total, 16 MB per file) |
| `GET` | `/api/v1/agentmemory/status` | Check memory status |
| `DELETE` | `/api/v1/agentmemory/document/{fileName}` | Delete a document |
| `DELETE` | `/api/v1/agentmemory/documents` | Bulk delete documents |
| `GET` | `/api/v1/agentmemory/indexer-status` | Check indexer progress |

### HTTP triggers

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/httptriggers/create` | Create an HTTP trigger |
| `GET` | `/api/v1/httptriggers` | List triggers |
| `POST` | `/api/v1/httptriggers/{triggerId}/execute` | Execute a trigger |
| `POST` | `/api/v1/httptriggers/trigger/{triggerId}` | Public webhook endpoint (no auth required) |

### Hooks

| Method | Path | Description |
|--------|------|-------------|
| `PUT` | `/api/v2/extendedAgent/hooks/{hookName}` | Create or update a hook |
| `GET` | `/api/v2/extendedAgent/hooks` | List hooks |
| `DELETE` | `/api/v2/extendedAgent/hooks/{hookName}` | Delete a hook |

### Extended agent configuration

Manage subagents, tools, connectors, skills, prompts, and plugins through the data plane:

| Resource | Path pattern |
|----------|-------------|
| Subagents | `/api/v2/extendedAgent/agents/{name}` |
| Tools | `/api/v2/extendedAgent/tools/{name}` |
| Connectors | `/api/v2/extendedAgent/connectors/{name}` |
| Skills | `/api/v2/extendedAgent/skills/{name}` |
| Common prompts | `/api/v2/extendedAgent/commonprompts/{name}` |
| Scheduled tasks | `/api/v2/extendedAgent/scheduledtasks/{name}` |
| Plugins | `/api/v2/extendedAgent/plugins/{name}` |

All resources support `PUT`, `GET`, `PATCH`, and `DELETE` methods.

### Real-time streaming

The agent uses **SignalR** for real-time chat streaming:

| Hub | Path | Purpose |
|-----|------|---------|
| AgentHub | `/agentHub` | Real-time message streaming and thread updates |

Connect by using the SignalR client library with the same bearer token.

## Examples

### Get agent properties

```bash
az rest -m GET \
  --url "https://management.azure.com/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.App/agents/{name}?api-version=2025-05-01-preview" \
  -o json
```

### List all connectors

```bash
az rest -m GET \
  --url "https://management.azure.com/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.App/agents/{name}/DataConnectors?api-version=2025-05-01-preview" \
  -o json
```

### List threads via data plane

```bash
TOKEN=$(az account get-access-token --resource https://azuresre.dev --query accessToken -o tsv)
ENDPOINT="https://{agentEndpoint}"

curl -s -H "Authorization: Bearer $TOKEN" "$ENDPOINT/api/v1/threads"
```

### Add a code repo via data plane

```bash
curl -X PUT \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "$ENDPOINT/api/v2/repos/my-repo" \
  -d '{
    "properties": {
      "url": "https://github.com/myorg/myrepo",
      "type": "GitHub"
    }
  }'
```

## Related content

- [ARM template reference](/azure/templates/microsoft.app/agents): Full property schema on Microsoft Learn
- [Deploy with Infrastructure as Code](deploy-iac.md): Automate agent deployment using Bicep, Terraform, or PowerShell
- [Network requirements](network-requirements.md): Firewall allow list for API endpoints
- [Pricing and billing](pricing-billing.md): Costs for API-driven operations
