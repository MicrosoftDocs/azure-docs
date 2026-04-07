---
title: Log Analytics and Application Insights connectors in Azure SRE Agent
description: Connect your agent to Azure Log Analytics workspaces and Application Insights resources for direct KQL queries during investigations.
ms.topic: feature-guide
ms.service: azure-sre-agent
ms.date: 04/06/2026
author: dchelupati
ms.author: dchelupati
ms.ai-usage: ai-assisted
ms.custom: log-analytics, application-insights, azure-monitor, kql, connectors, workspaces, mcp
#customer intent: As an SRE, I want to connect my agent to Log Analytics workspaces so that it can query my operational logs during incident investigations.
---

# Log Analytics and Application Insights connectors in Azure SRE Agent

> [!WARNING]
> This feature is in preview behind the **EnableMonitorClient** feature flag. To enable it, go to **Settings > Experimental Settings**, add `EnableMonitorClient`, and toggle it on.

> [!TIP]
> - **Query Log Analytics workspaces** directly from chat—no Kusto cluster required.
> - **Connect Application Insights** resources for app-level diagnostics.
> - **Multi-select workspaces** in a single connector—one setup covers all your data.
> - **RBAC auto-assigned**—the agent grants itself the right permissions on save.

## The problem

Most Azure teams store operational data in Log Analytics workspaces—VM performance, security events, custom logs. When an incident hits, you open the Azure portal, navigate to your workspace, and write KQL queries manually. Your SRE Agent is investigating the same incident but can't see your logs unless you set up a Kusto connector pointing at the underlying ADX cluster—which most teams don't have direct access to.

Application Insights holds your app-level telemetry—request traces, exceptions, dependencies. Same gap: the agent can't query it natively.

## What these connectors solve

Log Analytics and App Insights connectors give your agent direct access to your monitoring data through the Azure Monitor MCP backend. No Kusto cluster setup, no manual RBAC configuration.

| Before | After |
|--------|-------|
| Agent can't see your Log Analytics data | Agent queries workspaces directly via KQL |
| App Insights requires Kusto cluster access | Agent connects to App Insights resources natively |
| Manual RBAC role assignments on each resource group | Roles auto-assigned on save |
| One workspace per connector | Multi-select workspaces in a single connector |

## How it works

1. **Enable**—Turn on `EnableMonitorClient` in Experimental Settings.
1. **Add connector**—Select the **Telemetry** tab, then select Log Analytics or App Insights from the connector picker.
1. **Select resources**—Multi-select workspaces or resources from an auto-discovered list.
1. **Save**—RBAC roles are automatically assigned to your agent's managed identity.
1. **Query**—Ask your agent about your logs in natural language.

Behind the scenes, the agent creates a MonitorClient MCP connector that uses Azure MCP Server's monitor namespace—read-only, managed-identity-authenticated, with results rendered as tables in chat.

### RBAC roles auto-assigned

When you save a connector, the agent assigns these roles to its managed identity on each resource group that contains a selected workspace or resource:

- **Log Analytics Reader**—read access to log data and workspace configuration
- **Monitoring Reader**—read access to monitoring metrics
- **Reader**—read access to resource metadata in the resource group

You don't need to configure Azure resource scope or subscription access separately. The agent discovers workspaces from the subscription it already has scope over, and the roles are assigned automatically to the resource groups where your selected workspaces live.

### What the agent can do

Once connected, the agent can:

- **List available tables** in your workspaces
- **Run KQL queries** against connected workspaces or App Insights resources
- **Correlate log data** with other data sources during investigations
- **Display results as tables** in chat

## Example

During an incident investigation, your agent detects elevated error rates. With a connected Log Analytics workspace, it runs:

```text
Show me failed sign-in events from the last 24 hours grouped by user principal name
```

The agent queries your `SigninLogs` table via KQL, finds a pattern of failed MFA attempts from a single IP range, and surfaces the finding in its investigation timeline—all without you leaving the chat.

## Related content

- [Azure Data Explorer connector](kusto-connector.md)
- [Log Analytics and Application Insights](log-analytics-app-insights.md)
- [Diagnose Azure observability issues](diagnose-azure-observability.md)
