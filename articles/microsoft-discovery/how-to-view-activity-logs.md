---
title: View activity logs for Microsoft Discovery resources
description: Learn how to view and filter Azure activity logs for Microsoft Discovery control plane operations including workspace, supercomputer, and bookshelf create, update, and delete events.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: how-to
ms.date: 04/15/2026

#CustomerIntent: As a Discovery platform administrator, I want to view activity logs for Microsoft Discovery resources so that I can audit control plane operations, investigate failures, and track configuration changes.
---

# View activity logs for Microsoft Discovery resources

Azure Activity Logs record all control plane operations performed on Microsoft Discovery resources through the Azure Resource Manager (ARM) API. These logs let you audit who made changes, what was changed, and when—covering operations such as creating a workspace, updating a supercomputer, or deleting a bookshelf.

Activity logs are available in **Azure Monitor** and are separate from the application logs that Discovery stores in MRG-based Log Analytics workspaces. For information on application logs, see [Observability in Microsoft Discovery](concept-observability.md).

## Prerequisites

- An Azure account with access to the subscription containing your Microsoft Discovery resources.
- **Reader** role (or higher) on the subscription or resource group.

## What activity logs capture

Activity logs record **control plane write and delete operations** on Discovery resources. Examples include:

| Operation | Description |
|---|---|
| `Microsoft.Discovery/workspaces/write` | Create or update a workspace |
| `Microsoft.Discovery/workspaces/delete` | Delete a workspace |
| `Microsoft.Discovery/supercomputers/write` | Create or update a supercomputer |
| `Microsoft.Discovery/supercomputers/delete` | Delete a supercomputer |
| `Microsoft.Discovery/bookshelves/write` | Create or update a bookshelf |
| `Microsoft.Discovery/bookshelves/delete` | Delete a bookshelf |
| `Microsoft.Discovery/tools/write` | Create or update a tool |
| `Microsoft.Discovery/tools/delete` | Delete a tool |
| `Microsoft.Discovery/storagecontainers/write` | Create or update a storage container |
| `Microsoft.Discovery/storagecontainers/delete` | Delete a storage container |
| `Microsoft.Discovery/storageassets/write` | Create or update a storage asset |
| `Microsoft.Discovery/storageassets/delete` | Delete a storage asset |


Activity logs also capture:

- The **identity** (user or service principal) that performed the operation.
- The **result** of the operation: `Succeeded`, `Failed`, or `Accepted`.
- The **timestamp** and **correlation ID** for the operation.
- The **request and response details** for the ARM API call.

> [!NOTE]
> Activity logs don't capture read operations (HTTP GET requests). They record write and delete operations only.

## View activity logs in the Azure portal

### View logs for a specific resource

1. In the [Azure portal](https://portal.azure.com), navigate to the Microsoft Discovery resource you want to audit (workspace, supercomputer, or bookshelf).
2. In the resource's left navigation pane, select **Activity log**.
3. The activity log displays all control plane operations for that resource.

### View logs for a resource group

1. In the [Azure portal](https://portal.azure.com), navigate to the resource group that contains your Discovery resources.
2. In the resource group's left navigation pane, select **Activity log**.
3. Use the **Resource type** filter to narrow results to Discovery resource types.

### View logs from Azure Monitor

1. In the [Azure portal](https://portal.azure.com), search for **Monitor** and select **Azure Monitor**.
2. In the left navigation pane, select **Activity log**.
3. Use the filters described in the following section to scope results to your Discovery resources.

## Filter activity logs

Use the following filters to narrow activity log results:

| Filter | Description |
|---|---|
| **Subscription** | Scope logs to the subscription containing your Discovery resources |
| **Resource group** | Scope logs to the resource group containing your Discovery resources |
| **Resource type** | Filter to `Microsoft.Discovery/workspaces`, `Microsoft.Discovery/supercomputers`, `Microsoft.Discovery/bookshelves`, `Microsoft.Discovery/tools`, `Microsoft.Discovery/storagecontainers`, or `Microsoft.Discovery/storageassets` |
| **Time range** | Set the time window for the query (default: last 6 hours, maximum: 90 days) |
| **Event severity** | Filter by `Critical`, `Error`, `Warning`, or `Informational` |
| **Event initiated by** | Filter by user, service principal, or application identity |

## Export activity logs for long-term retention

Activity logs are retained for **90 days** by default. To retain logs beyond 90 days or to query them with KQL, export them to a Log Analytics workspace or a storage account via diagnostic settings.

### Export to a Log Analytics workspace

1. In **Azure Monitor**, go to **Activity log** and select **Export Activity Logs**.
2. Select **Add diagnostic setting**.
3. Under **Destination details**, select **Send to Log Analytics workspace** and choose your Log Analytics workspace.
4. Under **Categories**, select the log categories you want to export (for example, **Administrative** for control plane operations).
5. Select **Save**.

After export is configured, activity logs appear in the `AzureActivity` table in the Log Analytics workspace. You can then query them with KQL:

```kql
AzureActivity
| where ResourceProviderValue == "MICROSOFT.DISCOVERY"
| where ActivityStatusValue == "Failure"
| order by TimeGenerated desc
```

### Filter to a specific resource type

```kql
AzureActivity
| where ResourceProviderValue == "MICROSOFT.DISCOVERY"
| where ResourceGroup == "<your-resource-group>"
| order by TimeGenerated desc
```

### Find failed operations

```kql
AzureActivity
| where ResourceProviderValue == "MICROSOFT.DISCOVERY"
| where ActivityStatusValue == "Failure"
| project TimeGenerated, OperationNameValue, Caller, ActivityStatusValue, Properties
| order by TimeGenerated desc
```

### Audit changes by user

```kql
AzureActivity
| where ResourceProviderValue == "MICROSOFT.DISCOVERY"
| where Caller == "<user-email-or-service-principal>"
| project TimeGenerated, OperationNameValue, ResourceGroup, ActivityStatusValue
| order by TimeGenerated desc
```

## Troubleshooting

### No activity log entries visible

| Cause | Resolution |
|---|---|
| Time range doesn't cover the operation | Extend the time range; activity logs support up to 90 days |
| Filtering by resource group that doesn't contain the resource | Verify the resource group and remove or update the filter |
| Operation was a read operation (HTTP GET) | Activity logs only capture write and delete operations |

### Operations show as Failed

Review the **Properties** column of the failed entry in the Azure portal or use the following KQL query to surface error details:

```kql
AzureActivity
| where ResourceProviderValue == "MICROSOFT.DISCOVERY"
| where ActivityStatusValue == "Failure"
| extend ErrorCode = tostring(parse_json(Properties).statusCode)
| extend ErrorMessage = tostring(parse_json(Properties).statusMessage)
| project TimeGenerated, OperationNameValue, Caller, ErrorCode, ErrorMessage
| order by TimeGenerated desc
```

## Related content

- [Observability in Microsoft Discovery](concept-observability.md)
- [Azure activity log documentation](/azure/azure-monitor/essentials/activity-log)
- [Azure Monitor diagnostic settings](/azure/azure-monitor/essentials/diagnostic-settings)
- [AzureActivity table reference](/azure/azure-monitor/reference/tables/azureactivity)
