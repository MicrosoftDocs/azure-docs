---
title: Configure Azure Diagnostic Logs
titleSuffix: Microsoft Dev Box
description: Learn how to use Azure diagnostic logs to see an audit history for your dev center.
services: dev-box
ms.service: dev-box
ms.topic: how-to
author: delvissantos
ms.author: delvissantos
ms.date: 04/28/2023
---

# Configure Azure diagnostic logs for a dev center 

With Azure diagnostic logs for DevCenter, you can view audit logs for dataplane operations in your dev center. These logs can be routed to any of the following destinations:

* Azure Storage account
* Log Analytics workspace

This feature is available on all dev centers. 

Diagnostics logs allow you to export basic usage information from your dev center to different kinds sources so that you can consume them in a customized way. The dataplane audit logs expose information around CRUD operations for dev boxes within your dev center. Including, for example, start and stop commands executed on dev boxes. Some sample ways you can choose to export this data:

* Export data to blob storage, export to CSV.
* Export data to Azure Monitor logs and view and query data in your own Log Analytics workspace 

A dev center is required for the following step.

## Enable logging with the Azure portal

Follow these steps enable logging for your Azure DevCenter resource:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the Azure portal, navigate to **All resources** -> **your-devcenter**

3. Select **Diagnostics settings** in the **Monitoring** section.

4. Select **Add diagnostic setting** in the open page.


### Enable logging with Azure Storage

To use a storage account to store the logs, follow these steps:

 >[!NOTE] 
 >A storage account in the same region as your dev center is required to complete these steps. Refer to: **[Create an Azure Storage account](../storage/common/storage-account-create.md?tabs=azure-portal&toc=%2fazure%2fstorage%2fblobs%2ftoc.json)** for more information.
	
1. For **Diagnostic setting name**, enter a name for your diagnostic log settings.
 
2. Select **Archive to a storage account**, then select **Dataplane audit logs**. 

3. For **Retention (days)**, choose the number of retention days. A retention of zero days stores the logs indefinitely. 

4. Select the subscription and storage account for the logs.

3. Select **Save**.

### Send to Log Analytics

To use Log Analytics for the logs, follow these steps:

>[!NOTE] 
>A log analytics workspace is required to complete these steps. Refer to: **[Create a Log Analytics workspace in the Azure portal](../azure-monitor/logs/quick-create-workspace.md)** for more information.
	
1. For **Diagnostic setting name**, enter a name for your diagnostic log settings.

2. Select **Send to Log Analytics**, then select **Dataplane audit logs**. 

3. Select the subscription and Log Analytics workspace for the logs.

4. Select **Save**.

## Enable logging with PowerShell

The following example shows how to enable diagnostic logs via the Azure PowerShell Cmdlets.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

### Enable diagnostic logs in a storage account

1. Sign in to Azure PowerShell:

    ```azurepowershell-interactive
    Connect-AzAccount 
    ```

2. To enable Diagnostic Logs in a storage account, enter these commands. Replace the variables with your values:

    ```azurepowershell-interactive
    $rg = <your-resource-group-name>
    $devcenterid = <your-devcenter-ARM-resource-id>
    $storageacctid = <your-storage-account-resource-id>
    $diagname = <your-diagnostic-setting-name>

    $log = New-AzDiagnosticSettingLogSettingsObject -Enabled $true -Category DataplaneAuditEvent -RetentionPolicyDay 7 -RetentionPolicyEnabled $true

    New-AzDiagnosticSetting -Name $diagname -ResourceId $devcenterid -StorageAccountId $storageacctid -Log $log
    ```

### Enable diagnostics logs for Log Analytics workspace

1. Sign in to Azure PowerShell:

    ```azurepowershell-interactive
    Connect-AzAccount 
    ```
2. To enable Diagnostic Logs for a Log Analytics workspace, enter these commands. Replace the variables with your values:

    ```azurepowershell-interactive
    $rg = <your-resource-group-name>
    $devcenterid = <your-devcenter-ARM-resource-id>
    $workspaceid = <your-log-analytics-workspace-resource-id>
    $diagname = <your-diagnostic-setting-name>

    $log = New-AzDiagnosticSettingLogSettingsObject -Enabled $true -Category DataplaneAuditEvent -RetentionPolicyDay 7 -RetentionPolicyEnabled $true

    New-AzDiagnosticSetting -Name $diagname -ResourceId $devcenterid -WorkspaceId $workspaceid -Log $log
    ```

## Analyzing Logs
This section describes existing tables for DevCenter diagnostic logs and how to query them.

All resource logs in Azure Monitor have the same fields followed by service-specific fields. The common schema is outlined in [Common and service-specific schemas for Azure resource logs](../azure-monitor/essentials/resource-logs-schema.md#top-level-common-schema).

DevCenter stores data in the following tables.

| Table | Description |
|:---|:---|
| DevCenterDiagnosticLogs | Table used to store dataplane request/response information on dev box or environments within the dev center.  |


### Sample Kusto Queries
After enabling diagnostic settings on your dev center, you should be able to view audit logs for the tables within a log analytics workspace.

Here are some queries that you can enter into Log search to help your monitor your dev boxes.

To query for all data-plane logs from DevCenter:

```kusto
DevCenterDiagnosticLogs
```

To query for a filtered list of data-plane logs, specific to a single devbox:

```kusto
DevCenterDiagnosticLogs
| where TargetResourceId contains "<devbox-name>"
```

To generate a chart for data-plane logs, grouped by operation result status:

```kusto
DevCenterDiagnosticLogs
| summarize count() by OperationResult
| render piechart
```

These examples are just a small sample of the rich queries that can be performed in Monitor using the Kusto Query Language. For more information, see [samples for Kusto queries](/azure/data-explorer/kusto/query/samples?pivots=azuremonitor).

## Next steps

To learn more about Azure logs, see the following articles:

* [Azure Diagnostic logs](../azure-monitor/essentials/platform-logs-overview.md)
* [Azure Monitor logs](../azure-monitor/logs/log-query-overview.md)
* [Azure Log Analytics REST API](/rest/api/loganalytics)
