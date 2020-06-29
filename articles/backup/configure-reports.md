---
title: Configure Azure Backup reports
description: Configure and view reports for Azure Backup by using Log Analytics and Azure workbooks
ms.topic: conceptual
ms.date: 02/10/2020
---
# Configure Azure Backup reports

A common requirement for backup admins is to obtain insights on backups based on data that spans a long period of time. Use cases for such a solution include:

- Allocating and forecasting of cloud storage consumed.
- Auditing of backups and restores.
- Identifying key trends at different levels of granularity.

Today, Azure Backup provides a reporting solution that uses [Azure Monitor logs](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal) and [Azure workbooks](https://docs.microsoft.com/azure/azure-monitor/platform/workbooks-overview). These resources help you get rich insights on your backups across your entire backup estate. This article explains how to configure and view Azure Backup reports.

## Supported scenarios

- Backup reports are supported for Azure VMs, SQL in Azure VMs, SAP HANA in Azure VMs, Microsoft Azure Recovery Services (MARS) agent, Microsoft Azure Backup Server (MABS), and System Center Data Protection Manager (DPM). For Azure File Share backup, data is displayed for all records created on or after Jun 1, 2020.
- For DPM workloads, Backup reports are supported for DPM Version 5.1.363.0 and above and Agent Version 2.0.9127.0 and above.
- For MABS workloads, Backup reports are supported for MABS Version 13.0.415.0 and above and Agent Version 2.0.9170.0 and above.
- Backup reports can be viewed across all backup items, vaults, subscriptions, and regions as long as their data is being sent to a Log Analytics workspace that the user has access to. To view reports for a set of vaults, you only need to have reader access to the Log Analytics workspace to which the vaults are sending their data. You don't need to have access to the individual vaults.
- If you're an [Azure Lighthouse](https://docs.microsoft.com/azure/lighthouse/) user with delegated access to your customers' subscriptions, you can use these reports with Azure Lighthouse to view reports across all your tenants.
- Currently, data can be viewed in Backup Reports across a maximum of 100 Log Analytics Workspaces (across tenants).
- Data for log backup jobs currently isn't displayed in the reports.

## Get started

Follow these steps to start using the reports.

### 1. Create a Log Analytics workspace or use an existing one

Set up one or more Log Analytics workspaces to store your Backup reporting data. The location and subscription where this Log Analytics workspace can be created is independent of the location and subscription where your vaults exist.

To set up a Log Analytics workspace, see [Create a Log Analytics workspace in the Azure portal](https://docs.microsoft.com/azure/azure-monitor/learn/quick-create-workspace).

By default, the data in a Log Analytics workspace is retained for 30 days. To see data for a longer time horizon, change the retention period of the Log Analytics workspace. To change the retention period, see [Manage usage and costs with Azure Monitor logs](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage).

### 2. Configure diagnostics settings for your vaults

Azure Resource Manager resources, such as Recovery Services vaults, record information about scheduled operations and user-triggered operations as diagnostics data.

In the monitoring section of your Recovery Services vault, select **Diagnostics settings** and specify the target for the Recovery Services vault's diagnostic data. To learn more about using diagnostic events, see [Use diagnostics settings for Recovery Services vaults](https://docs.microsoft.com/azure/backup/backup-azure-diagnostic-events).

![Diagnostics settings pane](./media/backup-azure-configure-backup-reports/resource-specific-blade.png)

Azure Backup also provides a built-in Azure Policy definition, which automates the configuration of diagnostics settings for all vaults in a given scope. To learn how to use this policy, see [Configure vault diagnostics settings at scale](https://docs.microsoft.com/azure/backup/azure-policy-configure-diagnostics).

> [!NOTE]
> After you configure diagnostics, it might take up to 24 hours for the initial data push to complete. After data starts flowing into the Log Analytics workspace, you might not see data in the reports immediately because data for the current partial day isn't shown in the reports. For more information, see [Conventions used in Backup reports](https://docs.microsoft.com/azure/backup/configure-reports#conventions-used-in-backup-reports). We recommend that you start viewing the reports two days after you configure your vaults to send data to Log Analytics.

#### 3. View reports in the Azure portal

After you've configured your vaults to send data to Log Analytics, view your Backup reports by going to any vault's pane and selecting **Backup Reports**.

![Vault dashboard](./media/backup-azure-configure-backup-reports/vault-dashboard.png)

Select this link to open up the Backup report workbook.

> [!NOTE]
>
> - Currently, the initial load of the report might take up to 1 minute.
> - The Recovery Services vault is merely an entry point for Backup reports. After the Backup report workbook opens up from a vault's pane, select the appropriate set of Log Analytics workspaces to see data aggregated across all your vaults.

The report contains various tabs:

- **Summary**: Use this tab to get a high-level overview of your backup estate. You can get a quick glance of the total number of backup items, total cloud storage consumed, the number of protected instances, and the job success rate per workload type. For more detailed information about a specific backup artifact type, go to the respective tabs.

   ![Summary tab](./media/backup-azure-configure-backup-reports/summary.png)

- **Backup Items**: Use this tab to see information and trends on cloud storage consumed at a Backup-item level. For example, if you use SQL in an Azure VM backup, you can see the cloud storage consumed for each SQL database that's being backed up. You can also choose to see data for backup items of a particular protection status. For example, selecting the **Protection Stopped** tile at the top of the tab filters all the widgets underneath to show data only for Backup items in the Protection Stopped state.

   ![Backup Items tab](./media/backup-azure-configure-backup-reports/backup-items.png)

- **Usage**: Use this tab to view key billing parameters for your backups. The information shown on this tab is at a billing entity (protected container) level. For example, in the case of a DPM server being backed up to Azure, you can view the trend of protected instances and cloud storage consumed for the DPM server. Similarly, if you use SQL in Azure Backup or SAP HANA in Azure Backup, this tab gives you usage-related information at the level of the virtual machine in which these databases are contained.

   ![Usage tab](./media/backup-azure-configure-backup-reports/usage.png)

> [!NOTE]
> For DPM workloads, users might see a slight difference (of the order of 20 MB per DPM server) between the usage values shown in the reports as compared to the aggregate usage value as shown in the Recovery services vault overview tab. This difference is accounted for by the fact that every DPM server being registered for backup has an associated 'metadata' datasource which is not surfaced as an artifact for reporting.

- **Jobs**: Use this tab to view long-running trends on jobs, such as the number of failed jobs per day and the top causes of job failure. You can view this information at both an aggregate level and at a Backup-item level. Select a particular Backup item in a grid to view detailed information on each job that was triggered on that Backup item in the selected time range.

   ![Jobs tab](./media/backup-azure-configure-backup-reports/jobs.png)

- **Policies**: Use this tab to view information on all of your active policies, such as the number of associated items and the total cloud storage consumed by items backed up under a given policy. Select a particular policy to view information on each of its associated Backup items.

   ![Policies tab](./media/backup-azure-configure-backup-reports/policies.png)

## Export to Excel

Select the down arrow button in the upper right of any widget, like a table or chart, to export the contents of that widget as an Excel sheet as-is with existing filters applied. To export more rows of a table to Excel, you can increase the number of rows displayed on the page by using the **Rows Per Page** drop-down arrow at the top of each grid.

## Pin to dashboard

Select the pin button at the top of each widget to pin the widget to your Azure portal dashboard. This feature helps you create customized dashboards tailored to display the most important information that you need.

## Cross-tenant reports

If you use [Azure Lighthouse](https://docs.microsoft.com/azure/lighthouse/) with delegated access to subscriptions across multiple tenant environments, you can use the default subscription filter. Select the filter button in the upper-right corner of the Azure portal to choose all the subscriptions for which you want to see data. Doing so lets you select Log Analytics workspaces across your tenants to view multitenanted reports.

## Conventions used in Backup reports

- Filters work from left to right and top to bottom on each tab. That is, any filter only applies to all those widgets that are positioned either to the right of that filter or below that filter.
- Selecting a colored tile filters the widgets below the tile for records that pertain to the value of that tile. For example, selecting the **Protection Stopped** tile on the **Backup Items** tab filters the grids and charts below to show data for backup items in the Protection Stopped state.
- Tiles that aren't colored aren't clickable.
- Data for the current partial day isn't shown in the reports. So, when the selected value of **Time Range** is **Last 7 days**, the report shows records for the last seven completed days. The current day isn't included.
- The report shows details of jobs (apart from log jobs) that were *triggered* in the selected time range.
- The values shown for **Cloud Storage** and **Protected Instances** are at the *end* of the selected time range.
- The Backup items displayed in the reports are those items that exist at the *end* of the selected time range. Backup items that were deleted in the middle of the selected time range aren't displayed. The same convention applies for Backup policies as well.

## Query load times

The widgets in the Backup report are powered by Kusto queries, which run on the user's Log Analytics workspaces. These queries typically involve the processing of large amounts of data, with multiple joins to enable richer insights. As a result, the widgets might not load instantaneously when the user views reports across a large backup estate. This table provides a rough estimate of the time that different widgets can take to load, based on the number of Backup items and the time range for which the report is being viewed.

| **# Data sources**                         | **Time horizon** | **Approximate load times**                                              |
| --------------------------------- | ------------- | ------------------------------------------------------------ |
| ~5 K                       | 1 month          | Tiles: 5-10 secs <br> Grids: 5-10 secs <br> Charts: 5-10 secs <br> Report-level filters: 5-10 secs|
| ~5 K                       | 3 months          | Tiles: 5-10 secs <br> Grids: 5-10 secs <br> Charts: 5-10 secs <br> Report-level filters: 5-10 secs|
| ~10 K                       | 3 months          | Tiles: 15-20 secs <br> Grids: 15-20 secs <br> Charts: 1-2 mins <br> Report-level filters: 25-30 secs|
| ~15 K                       | 1 month          | Tiles: 15-20 secs <br> Grids: 15-20 secs <br> Charts: 50-60 secs <br> Report-level filters: 20-25 secs|
| ~15 K                       | 3 months          | Tiles: 20-30 secs <br> Grids: 20-30 secs <br> Charts: 2-3 mins <br> Report-level filters: 50-60 secs |

## What happened to the Power BI reports?

- The earlier Power BI template app for reporting, which sourced data from an Azure storage account, is on a deprecation path. We recommend that you start sending vault diagnostic data to Log Analytics to view reports.

- In addition, the [V1 schema](https://docs.microsoft.com/azure/backup/backup-azure-diagnostics-mode-data-model#v1-schema-vs-v2-schema) of sending diagnostics data to a storage account or an LA Workspace is also on a deprecation path. This means that if you have written any custom queries or automations based on the V1 schema, you are advised to update these queries to use the currently supported V2 schema.

## Next steps

[Learn more about monitoring and reporting with Azure Backup](https://docs.microsoft.com/azure/backup/backup-azure-monitor-alert-faq)
