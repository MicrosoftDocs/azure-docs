---
title: Enable audit logging for Microsoft Discovery resources
description: Learn how to configure Azure Monitor diagnostic settings to export audit logs from Microsoft Discovery workspaces, bookshelves, and supercomputers to an Azure Storage account or Log Analytics workspace for compliance and long-term retention.
author: anzaman
ms.author: alzam
ms.service: azure
ms.topic: how-to
ms.date: 04/15/2026

#CustomerIntent: As a Discovery platform administrator, I want to enable audit logging for Microsoft Discovery resources so that I can export logs to a storage account or Log Analytics workspace for compliance, auditing, and long-term retention.
---

# Enable audit logging for Microsoft Discovery resources

Microsoft Discovery supports **customer-configurable audit logging** through Azure Monitor diagnostic settings. When enabled, audit and platform logs are exported from Discovery resources to an Azure Storage account or a Log Analytics workspace that you control, where they can be retained for compliance, security auditing, and long-term analysis.

Audit logs are distinct from the application logs that Discovery automatically collects in Managed Resource Group (MRG) Log Analytics workspaces. Audit logs must be explicitly enabled by you and are written to a destination in your own subscription. For an overview of all log types, see [Observability in Microsoft Discovery](concept-observability.md).

## Supported resource types and log destinations

You can enable audit logging on the following Microsoft Discovery resource types:

| Resource type | Resource provider path |
|---|---|
| Workspace | `Microsoft.Discovery/workspaces` |
| Bookshelf | `Microsoft.Discovery/bookshelves` |
| Supercomputer | `Microsoft.Discovery/supercomputers` |

The following destinations are supported for audit log export:

- **Azure Storage Account** - Archive logs for compliance, auditing, and long-term retention.
- **Log Analytics workspace** - Query logs with KQL and integrate with Azure Monitor alerts and workbooks.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- The [Azure Az PowerShell module](/powershell/azure/install-azure-powershell) installed.
- **Monitoring Contributor** role or higher on the Discovery resource.
- For storage account destination: **Storage Account Contributor** role or higher, and an [Azure Storage account](/azure/storage/common/storage-account-create) to receive the logs.
- For Log Analytics workspace destination: **Log Analytics Contributor** role or higher, and a [Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace) to receive the logs.

## Connect to Azure

Sign in to Azure PowerShell and set the subscription context:

```azurepowershell
Connect-AzAccount
Set-AzContext -SubscriptionId "<subscription-id>"
```

## Configure the log category

Before you create a diagnostic setting, define which log categories to collect. You can export all available log categories or audit logs only.

### [All logs](#tab/all-logs)

To collect all available log categories:

```azurepowershell
$log = New-AzDiagnosticSettingLogSettingsObject `
    -Enabled $true `
    -CategoryGroup "allLogs"
```

### [Audit logs only](#tab/audit-logs)

To collect only audit logs:

```azurepowershell
$log = New-AzDiagnosticSettingLogSettingsObject `
    -Enabled $true `
    -CategoryGroup "audit"
```

---

## Export to a storage account

Use the `New-AzDiagnosticSetting` cmdlet to create a diagnostic setting that sends logs to a storage account. Select the tab for your Discovery resource type and replace the `<placeholder>` values with your resource information.

### [Workspace](#tab/workspace)

```azurepowershell
New-AzDiagnosticSetting `
    -Name "<diagnostic-setting-name>" `
    -ResourceId "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Discovery/workspaces/<workspace-name>" `
    -StorageAccountId "/subscriptions/<subscription-id>/resourceGroups/<storage-resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>" `
    -Log $log
```

### [Bookshelf](#tab/bookshelf)

```azurepowershell
New-AzDiagnosticSetting `
    -Name "<diagnostic-setting-name>" `
    -ResourceId "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Discovery/bookshelves/<bookshelf-name>" `
    -StorageAccountId "/subscriptions/<subscription-id>/resourceGroups/<storage-resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>" `
    -Log $log
```

### [Supercomputer](#tab/supercomputer)

```azurepowershell
New-AzDiagnosticSetting `
    -Name "<diagnostic-setting-name>" `
    -ResourceId "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Discovery/supercomputers/<supercomputer-name>" `
    -StorageAccountId "/subscriptions/<subscription-id>/resourceGroups/<storage-resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>" `
    -Log $log
```

---

## Export to a Log Analytics workspace

Use the `New-AzDiagnosticSetting` cmdlet to create a diagnostic setting that sends logs to a Log Analytics workspace. Select the tab for your Discovery resource type and replace the `<placeholder>` values with your resource information.

### [Workspace](#tab/workspace-law)

```azurepowershell
New-AzDiagnosticSetting `
    -Name "<diagnostic-setting-name>" `
    -ResourceId "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Discovery/workspaces/<workspace-name>" `
    -WorkspaceId "/subscriptions/<subscription-id>/resourceGroups/<log-analytics-resource-group>/providers/Microsoft.OperationalInsights/workspaces/<log-analytics-workspace-name>" `
    -Log $log
```

### [Bookshelf](#tab/bookshelf-law)

```azurepowershell
New-AzDiagnosticSetting `
    -Name "<diagnostic-setting-name>" `
    -ResourceId "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Discovery/bookshelves/<bookshelf-name>" `
    -WorkspaceId "/subscriptions/<subscription-id>/resourceGroups/<log-analytics-resource-group>/providers/Microsoft.OperationalInsights/workspaces/<log-analytics-workspace-name>" `
    -Log $log
```

### [Supercomputer](#tab/supercomputer-law)

```azurepowershell
New-AzDiagnosticSetting `
    -Name "<diagnostic-setting-name>" `
    -ResourceId "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Discovery/supercomputers/<supercomputer-name>" `
    -WorkspaceId "/subscriptions/<subscription-id>/resourceGroups/<log-analytics-resource-group>/providers/Microsoft.OperationalInsights/workspaces/<log-analytics-workspace-name>" `
    -Log $log
```

---

## Parameter reference

| Placeholder | Description |
|---|---|
| `<diagnostic-setting-name>` | A descriptive name for the diagnostic setting. |
| `<subscription-id>` | The Azure subscription ID that contains the Discovery resource. |
| `<resource-group>` | The resource group of the Discovery resource. |
| `<workspace-name>` | The name of the Microsoft Discovery workspace. |
| `<bookshelf-name>` | The name of the Microsoft Discovery bookshelf. |
| `<supercomputer-name>` | The name of the Microsoft Discovery supercomputer. |
| `<storage-resource-group>` | The resource group of the destination storage account. |
| `<storage-account-name>` | The name of the destination Azure Storage account. |
| `<log-analytics-resource-group>` | The resource group of the destination Log Analytics workspace. |
| `<log-analytics-workspace-name>` | The name of the destination Log Analytics workspace. |

## Verify the diagnostic setting

To confirm that the diagnostic setting was created successfully:

```azurepowershell
Get-AzDiagnosticSetting `
    -ResourceId "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Discovery/<resource-type>/<resource-name>"
```

Replace `<resource-type>` with `workspaces`, `bookshelves`, or `supercomputers`, and `<resource-name>` with the name of your resource.

A successful response returns the diagnostic setting name, the configured destination, and the enabled log categories.

> [!NOTE]
> Audit logs can take several minutes to appear in the destination after you create the diagnostic setting.

## Manage log retention

To control how long audit logs are retained, use the following approaches based on your destination:

- **Storage account** - Configure a [lifecycle management policy](/azure/storage/blobs/lifecycle-management-overview) on the destination storage account to automatically expire or archive log blobs.
- **Log Analytics workspace** - Configure the [data retention settings](/azure/azure-monitor/logs/data-retention-configure) on the Log Analytics workspace to set the retention period for ingested tables.

## Related content

- [Observability in Microsoft Discovery](concept-observability.md)
- [Azure Monitor diagnostic settings](/azure/azure-monitor/essentials/diagnostic-settings)
- [Azure Monitor resource logs](/azure/azure-monitor/essentials/resource-logs)
- [Create a storage account](/azure/storage/common/storage-account-create)
- [Create a Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace)
- [Install Azure PowerShell](/powershell/azure/install-azure-powershell)
