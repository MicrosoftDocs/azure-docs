---
title: "Tutorial: Connect to Log Analytics & Application Insights in Azure SRE Agent"
description: Set up Log Analytics and Application Insights connectors so your agent can query your workspaces directly with fewer tokens.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 04/28/2026
author: dchelupati
ms.author: dchelupati
ms.ai-usage: ai-assisted
ms.custom: log-analytics, application-insights, connectors, tutorial
#customer intent: As an SRE, I want to connect my agent to my Log Analytics workspaces so it can query log data directly during investigations.
---

# Tutorial: Connect to Log Analytics and Application Insights in Azure SRE Agent

In this tutorial, you connect your agent to a Log Analytics workspace so it can query log data directly with lower latency and fewer tokens. The same flow works for Application Insights, and differences are noted inline.

For background on why you'd add a connector when built-in observability already works, see [Log Analytics & Application Insights connectors](log-analytics-app-insights.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Add a Log Analytics connector in the Builder
> - Select a workspace from the auto-discovered list
> - Verify the connection by querying logs in chat

## Prerequisites

- An agent in **Running** state.
- At least one Log Analytics workspace or Application Insights resource in the agent's subscription.

You don't need to configure subscription scope or resource group access separately. The agent discovers workspaces from its existing subscription scope and assigns RBAC roles to the relevant resource groups automatically.

## Add the connector

1. Go to **Builder** > **Connectors**.
1. Select **Add connector**.
1. Select **Log Analytics Workspace** (or **Application Insights** for App Insights resources).

## Select a workspace

The form auto-discovers workspaces in the agent's subscription. Fill in the following fields:

| Field | Description |
|---|---|
| **Name** | A descriptive name for this connector (for example, `production-logs`). |
| **Log Analytics workspace** | Select a workspace from the dropdown. Each option shows the workspace name and resource group. To connect multiple workspaces, create a separate connector for each. |
| **Managed identity** | The identity the agent uses to authenticate (system-assigned or user-assigned). |

After you select a workspace, a hint shows which resource groups receive RBAC role assignments.

> [!NOTE]
> If no workspaces appear in the dropdown, your subscription might not contain Log Analytics workspaces, or your account might lack Resource Graph read permissions. You can add a workspace manually by entering:
>
> - **ARM resource ID**: `/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.OperationalInsights/workspaces/{name}`
> - **Workspace name**: The display name.
> - **Customer ID**: The workspace's unique identifier (found in the Azure portal under the workspace's **Properties** tab).
>
> For Application Insights, the manual form requires the ARM resource ID (`Microsoft.Insights/components/{name}`) and the resource name.

## Save and verify

1. Select **Add**. The agent assigns the required RBAC roles to its managed identity and creates the connection.
1. Confirm the connector appears in **Builder** > **Connectors** with a **Connected** status.
1. Go to **Chat** and test the connection:

```text
What tables are available in my Log Analytics workspace?
```

Try a more specific query:

```text
Show me the top 10 errors from SigninLogs in the last 24 hours
```

Results appear as formatted tables with an Azure Monitor badge. The agent can now include this log data in incident investigations.

## Troubleshooting

| Issue | Solution |
|---|---|
| **No workspaces in dropdown** | Verify your subscription contains Log Analytics workspaces and that you have Resource Graph read permissions. Use the manual ARM resource ID input as a fallback. |
| **RBAC assignment fails** | You need **Owner** or **User Access Administrator** on the target resource groups. Ask your admin to grant access or pre-assign the roles. |
| **Queries return 403** | The managed identity might be missing **Log Analytics Reader** or **Monitoring Reader** on the target resource group. Check role assignments in the Azure portal. |
| **Connector type not in picker** | Refresh the page. If the issue persists, verify the agent's subscription scope. |

## Related content

- [Log Analytics & Application Insights connectors](log-analytics-app-insights.md): Capability overview
- [Create a scheduled task](create-scheduled-task.md): Automate recurring log queries
- [Kusto tools](kusto-tools.md): Deterministic, parameterized queries against ADX clusters
- [Diagnose with Azure observability](diagnose-azure-observability.md): Built-in monitoring queries
