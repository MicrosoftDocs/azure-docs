---
title: Log Analytics & Application Insights connectors in Azure SRE Agent
description: Add Log Analytics and Application Insights connectors for faster, more token-efficient queries against workspaces your agent accesses frequently.
ms.topic: feature-guide
ms.service: azure-sre-agent
ms.date: 04/28/2026
author: dchelupati
ms.author: dchelupati
ms.ai-usage: ai-assisted
ms.custom: log-analytics, application-insights, azure-monitor, KQL, connectors, workspaces
#customer intent: As an SRE, I want to connect my agent to specific Log Analytics workspaces so it can query them faster and with fewer tokens than the built-in observability path.
---

# Log Analytics and Application Insights connectors in Azure SRE Agent

Your agent can already query Log Analytics and Application Insights through [built-in Azure observability](diagnose-azure-observability.md) without any setup. These connectors are an optional optimization: add one when your team queries the same workspaces frequently and you want lower latency and reduced token consumption.

## Built-in observability vs. connectors

Without a connector, the agent uses `az cli`, Resource Graph, and raw KQL to discover and query any Azure Monitor resource on the fly. This approach works well for ad-hoc investigations, but it costs more tokens because the agent must locate the workspace and construct query parameters each time.

A connector gives the agent preconfigured access parameters (workspace ID, resource group, and subscription) so it can skip the discovery step and query directly. Authentication is handled automatically through the connector mapping, and RBAC roles are assigned when you save.

| | Built-in (no connector) | With connector |
|---|---|---|
| **Discovery** | Agent finds workspaces via Resource Graph | Agent targets a preconfigured workspace |
| **Token usage** | Higher because the agent constructs parameters on its own | Lower because parameters are preset |
| **Latency** | Higher due to discovery before each query | Lower with immediate query execution |
| **Auth** | Managed identity; permissions resolved at query time | Preconfigured at setup time |
| **RBAC** | Managed manually per resource | Autoassigned on save |

## How it works

1. **Add a connector**: Select Log Analytics or Application Insights from the connector picker.
1. **Select a resource**: Choose a workspace or resource from the autodiscovered list.
1. **Save**: The agent automatically assigns the required RBAC roles to its managed identity.
1. **Query**: Ask your agent about your logs in natural language.

### Capabilities

After you configure a connector, the agent can:

- List available tables in connected workspaces.
- Run KQL queries against connected workspaces or Application Insights resources.
- Correlate log data with other data sources during investigations.
- Display query results as tables in chat.

## Example

During an incident investigation, your agent detects elevated error rates. By using a connected Log Analytics workspace, you ask:

```text
Show me failed sign-in events from the last 24 hours grouped by user principal name
```

The agent queries your `SigninLogs` table through KQL, identifies a pattern of failed MFA attempts from a single IP range, and surfaces the finding in its investigation timeline, all without you leaving the chat.

## Related content

- [Set up a Log Analytics connector](setup-log-analytics-connector.md)
- [Kusto tools](kusto-tools.md) for deterministic, parameterized KQL queries against ADX clusters
- [Diagnose with Azure observability](diagnose-azure-observability.md) for built-in monitoring queries
- [Scheduled tasks](scheduled-tasks.md) to automate recurring log queries
