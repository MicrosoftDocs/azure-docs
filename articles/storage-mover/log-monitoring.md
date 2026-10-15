---
title: Monitor copy, job run, and audit logs in Azure Storage Mover
description: Learn how to collect and query Azure Storage Mover copy logs, job run logs, and audit logs by using diagnostic settings and Log Analytics.
author: rajsinghmsa
ms.author: singra
ms.service: azure-storage-mover
ms.topic: how-to
ms.date: 10/06/2026
---

<!-- 
!########################################################
STATUS: DRAFT

CONTENT: 

REVIEW Stephen/Fabian: Reviewed
REVIEW Engineering: not reviewed
EDIT PASS: started

Initial doc score: 97 (1212 words and 2 issues)

!########################################################
-->

# How to enable Azure Storage Mover copy, job, and audit logs

When you use a migration tool to move your critical data from on-premises sources to Azure destination targets, you want to monitor operations for potential issues. Store the data relating to the operations you perform during your migration as either log entries or metrics. When configured, Azure Storage Mover can provide the following logs:

- **Copy logs** trace the migration result of individual files that fail to copy.
- **Job run logs** trace the result of each job run.
- **Audit logs** record the operations performed on your storage mover resource and its child resources.

Send all three log types to an Azure Log Analytics workspace. Analytics workspaces are storage units where Azure services store the log data they generate. Log Analytics is integrated into the Storage Mover portal experience. By using this integration, you can see the relevant logs for your storage mover within the same surface you use to manage it. More importantly, the integration also allows you to create and run log queries from multiple logs and interactively analyze their results.

> [!IMPORTANT]
> Before you can access your migration's log data, ensure that you create an Azure Log Analytics workspace and configure your Storage Mover instance to use it. You lose any logs generated prior to this configuration. You might be able to retrieve limited log information directly from the agent.

This article describes the steps involved in creating an analytics workspace, configuring a diagnostic setting within a storage mover resource, and querying the resulting copy, job run, and audit logs.

## Storage Mover log categories

Storage Mover exposes the following log categories in its diagnostic settings. Each category is stored in its own table in your Log Analytics workspace.

| Log category (portal) | Category groups | Log Analytics table | Description |
|--|--|--|--|
| **Copy logs - Failed** | `allLogs` | [StorageMoverCopyLogsFailed](/azure/azure-monitor/reference/tables/StorageMoverCopyLogsFailed) | Details of individual files that failed to copy during a job run. |
| **Job run logs** | `allLogs` | [StorageMoverJobRunLogs](/azure/azure-monitor/reference/tables/StorageMoverJobRunLogs) | Status and results of each job run. |
| **Audit Log** | `allLogs`, `AuditLog` | [StorageMoverAuditLogs](/azure/azure-monitor/reference/tables/StorageMoverAuditLogs) | Operations performed on the storage mover resource and its child resources. |

A category group is a predefined collection of log categories:

- **allLogs** collects every log category that Storage Mover supports, including copy logs, job run logs, and audit logs. The group automatically includes any log categories that are added to Storage Mover in the future.
- **AuditLog** collects only the **Audit Log** category.

## Configuring Azure Log Analytics and Storage Mover

This section briefly describes how to configure an Azure Monitor Log Analytics workspace and Storage Mover diagnostic settings. After completing the following steps, you can query the data provided by your Storage Mover resource.

### Create a Log Analytics workspace

Storage Mover collects copy, job run, and audit logs, and stores the information in an Azure Log Analytics workspace. After you create a workspace, you can configure Storage Mover to save its data there. If you don't have an existing workspace, you can create one in the Azure portal.

Enter **Log Analytics workspace** in the search box and select **Log Analytics workspace**. In the content pane, select either **Create** or **Create log analytics workspace** to create a workspace. Provide values for the **Subscription**, **Resource Group**, **Name**, and **Region** fields, and select **Review + Create**.

:::image type="content" source="media/log-monitoring/workspace-create-sml.png" lightbox="media/log-monitoring/workspace-create-lrg.png" alt-text="Screen capture illustrating the methods of creating an Azure Analytics Workspace." :::

You can get more detailed information about Log Analytics and its features by visiting the [Log Analytics overview](/azure/azure-monitor/logs/log-analytics-overview) article. If you prefer to view a tutorial, you can visit the [Log Analytics tutorial](/azure/azure-monitor/logs/log-analytics-tutorial) instead.

### Configure Storage Mover diagnostic settings

After an analytics workspace has been created, you can specify it as the destination in which Storage Mover logs and metrics can be displayed.

You have two options for configuring Storage Mover to send logs to your analytics workspace:

- **During deployment**: Select **Enable copy logs** on the **Monitoring** tab when you create your top-level Storage Mover resource. This option collects all Storage Mover log categories: copy logs, job run logs, and audit logs.
- **After deployment**: Add a diagnostic setting to an existing Storage Mover resource. Use this option if you want to choose individual log categories, such as collecting only audit logs.

#### Enable logs during deployment

The following example shows how to specify diagnostic settings in the Azure portal during Storage Mover resource creation. On the **Monitoring** tab, select **Enable copy logs** and select the **Log Analytics workspace** that should receive the logs.

:::image type="content" source="media/log-monitoring/monitoring-configure-sml.png" lightbox="media/log-monitoring/monitoring-configure-lrg.png" alt-text="Screen capture highlighting the ability to enable monitoring during initial deployment." :::

Although the option is labeled **Enable copy logs**, Storage Mover creates a diagnostic setting that uses the **allLogs** category group. As a result, copy logs, job run logs, and audit logs are all sent to the selected workspace. You can't select individual log categories on the **Monitoring** tab. To collect only specific log categories, modify the diagnostic setting after deployment as described in the next section.

#### Add or edit a diagnostic setting after deployment

You can also add a diagnostic setting to a Storage Mover resource after it's been deployed, or edit the diagnostic setting that you created during deployment. To add the diagnostic setting, go to the Storage Mover resource. In the menu pane, select **Diagnostic settings** and then select **Add diagnostic setting** as shown in the following example. To edit an existing diagnostic setting, select **Edit setting** next to the setting in the **Diagnostic settings** table.

:::image type="content" source="media/log-monitoring/diagnostic-settings-sml.png" lightbox="media/log-monitoring/diagnostic-settings-lrg.png" alt-text="Screen capture highlighting the ability to add a diagnostic setting after deployment." :::

In the **Diagnostic setting** pane, complete the following steps:

1. Enter a value for the **Diagnostic setting name**.
1. Within the **Logs** group, choose the logs to collect by using one of the following methods:
    - To collect all logs, including copy logs, job run logs, and audit logs, select the **allLogs** category group. When **allLogs** is selected, every category under **Categories** is selected automatically and can't be cleared individually.
    - To collect only audit logs, select the **AuditLog** category group, or select **Audit Log** under **Categories**.
    - To collect a specific combination of logs, clear **allLogs**, and then select one or more individual categories under **Categories**: **Copy logs - Failed**, **Job run logs**, or **Audit Log**.
1. Optionally, select the **Job runs** option within the **Metrics** group to view the results of your individual job runs.
1. Within the **Destination details** group, select **Send to Log Analytics workspace**, the name of your subscription, and the name of the Log Analytics workspace to collect your log data.
1. Select **Save** to add your new diagnostic setting.

The following image shows a diagnostic setting that uses the **allLogs** category group to collect copy logs, job run logs, and audit logs, and sends them to a Log Analytics workspace.

:::image type="content" source="media/log-monitoring/setting-add-sml.png" lightbox="media/log-monitoring/setting-add-lrg.png" alt-text="Screen capture of the Diagnostic setting pane showing the allLogs and AuditLog category groups, the Copy logs - Failed, Job run logs, and Audit Log categories, and the Send to Log Analytics workspace destination." :::

After your Storage Mover diagnostic setting has been saved, it will be reflected on the Diagnostic settings screen within the **Diagnostic settings** table.

> [!NOTE]
> Logs are collected only from the time you enable a category. If you add the **Audit Log** category to an existing diagnostic setting, operations performed before the change aren't available in the **StorageMoverAuditLogs** table.

## Analyzing logs

All resource logs in Azure Monitor have the same fields, and are followed by service-specific fields. The common schema is outlined in [Azure Monitor resource log schema](/azure/azure-monitor/essentials/resource-logs-schema).

Storage Mover generates three tables: **StorageMoverCopyLogsFailed**, **StorageMoverJobRunLogs**, and **StorageMoverAuditLogs**. The schema for each table is found in the following references:

- **StorageMoverCopyLogsFailed**: [Azure Storage Mover copy log data reference](/azure/azure-monitor/reference/tables/StorageMoverCopyLogsFailed)
- **StorageMoverJobRunLogs**: [Azure Storage Mover job run log data reference](/azure/azure-monitor/reference/tables/StorageMoverJobRunLogs)
- **StorageMoverAuditLogs**: [Azure Storage Mover audit log data reference](/azure/azure-monitor/reference/tables/StorageMoverAuditLogs)

### Query your logs

Your log data is integrated into Storage Mover's Azure portal user interface (UI) experience. To access your log data, go to your top-level storage mover resource and select **Logs** from the **Monitoring** group in the navigation pane. Close the initial **Welcome to Log Analytics** window displayed in the main content pane as shown in the following example.

:::image type="content" source="media/log-monitoring/logs-splash-sml.png" lightbox="media/log-monitoring/logs-splash-lrg.png" alt-text="Screen capture illustrating the selections required to open the Logs pane and close the splash screen." :::

After you close the **Welcome** window, the **New Query** window appears. In the schema and filter pane, ensure that the **Tables** object is selected and that the **StorageMoverCopyLogsFailed**, **StorageMoverJobRunLogs**, and **StorageMoverAuditLogs** tables are visible. A table might not be visible until you enable its log category in a diagnostic setting and the service ingests the first records.

Using Kusto Query Language (KQL) queries, you can begin extracting log data from the tables displayed within the schema and filter pane. Enter your query into the query editing field and select **Run** as shown in the following screen capture. A simple query example is also provided to retrieve the 1,000 most recent failed copy operations.

:::image type="content" source="media/log-monitoring/logs-query-sml.png" lightbox="media/log-monitoring/logs-query-lrg.png" alt-text="Screen capture identifying the panes within the Log Analytics schema and filter page, with the StorageMoverAuditLogs, StorageMoverCopyLogsFailed, and StorageMoverJobRunLogs tables listed." :::

```kusto
StorageMoverCopyLogsFailed
| top 1000 by TimeGenerated desc
```

### Sample Kusto queries

After you send logs to Log Analytics, you can access those logs by using Azure Monitor log queries. For more information, see the [Log Analytics tutorial](/azure/azure-monitor/logs/log-analytics-tutorial).

The following sample queries provided can be entered in the **Log search** bar to help you monitor your migration. These queries work with the [new language](/azure/azure-monitor/logs/log-query-overview).

#### Copy log and job run log queries

- To list all the files that failed to copy from a specific job run within the last 30 days.

    ```kusto
    StorageMoverCopyLogsFailed
    | where TimeGenerated > ago(30d) and JobRunName == "[job run ID]"
    ```

- To list the 10 most common copy log error codes over the last seven days.

    ```kusto
    StorageMoverCopyLogsFailed
    | where TimeGenerated > ago(7d)
    | summarize count() by StatusCode
    | top 10 by count_ desc
    ```

- To list the 10 most recent job failure error codes over the last three days.

    ```kusto
    StorageMoverJobRunLogs
    | where TimeGenerated > ago(3d) and StatusCode != "AZSM0000"
    | summarize count() by StatusCode
    | top 10 by count_ desc
    ```

- To create a pie chart of failed copy operations grouped by job run over the last 30 days.

    ```kusto
    StorageMoverCopyLogsFailed
    | where TimeGenerated > ago(30d)
    | summarize count() by JobRunName
    | sort by count_ desc
    | render piechart
    ```

#### Audit log queries

- To list the audit log entries recorded within the last seven days, most recent first.

    ```kusto
    StorageMoverAuditLogs
    | where TimeGenerated > ago(7d)
    | project TimeGenerated, OperationName, ResType, Message, _ResourceId
    | sort by TimeGenerated desc
    ```

- To count audit log entries by operation and resource type over the last 30 days.

    ```kusto
    StorageMoverAuditLogs
    | where TimeGenerated > ago(30d)
    | summarize count() by OperationName, ResType
    | sort by count_ desc
    ```

- To list the audit log entries for a specific operation within the last 30 days.

    ```kusto
    StorageMoverAuditLogs
    | where TimeGenerated > ago(30d) and OperationName == "[operation name]"
    | project TimeGenerated, ResType, Message, _ResourceId
    | sort by TimeGenerated desc
    ```

- To create a daily time chart of audit log entries grouped by operation over the last 30 days.

    ```kusto
    StorageMoverAuditLogs
    | where TimeGenerated > ago(30d)
    | summarize count() by bin(TimeGenerated, 1d), OperationName
    | render timechart
    ```

## Next steps

Get started with any of these guides.

- [Log Analytics workspaces](/azure/azure-monitor/logs/log-analytics-workspace-overview)
- [Azure Monitor Logs overview](/azure/azure-monitor/logs/data-platform-logs)
- [Diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings?tabs=portal)
- [StorageMoverAuditLogs table reference](/azure/azure-monitor/reference/tables/StorageMoverAuditLogs)
- [Azure Storage Mover support bundle overview](troubleshooting.md)
- [Troubleshooting Storage Mover job run error codes](status-code.md)
