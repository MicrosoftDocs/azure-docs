---
title: Monitor the health of your backups using Azure Backup Metrics (preview)
description: In this article, learn about the metrics available for Azure Backup to monitor your backup health
ms.topic: overview
ms.date: 09/11/2024
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Monitor the health of your backups using Azure Backup Metrics (preview)

Azure Backup provides a set of built-in metrics via Azure Monitor that enable you to monitor the health of your backups. It also allows you to configure alert rules that trigger when the metrics exceed defined thresholds.

Azure Backup offers the following key capabilities:

* Ability to view out-of-the-box metrics related to back up and restore health of your backup items along with associated trends
* Ability to write custom alert rules on these metrics to efficiently monitor the health of your backup items
* Ability to route fired metric alerts to different notification channels supported by Azure Monitor, such as email, ITSM, webhook, logic apps, and so on.

[Learn more about Azure Monitor metrics](/azure/azure-monitor/essentials/data-platform-metrics).

## Supported scenarios

- Supports built-in metrics for the following workload types:

  - Azure VM, SQL databases in Azure VM
  - SAP HANA databases in Azure VM
  - Azure Files
  - Azure Blobs.

  Metrics for HANA instance workload type are currently not supported.

- Metrics can be viewed for all Recovery Services vaults in each region and subscription at a time. Viewing metrics for a larger scope in the Azure portal is currently not supported. The same limits are also applicable to configure metric alert rules.

## Supported metrics

Currently, Azure Backup supports the following metrics:

- **Backup Health Events**: The value of this metric represents the count of health events pertaining to backup job health, which were fired for the vault within a specific time. When a backup job completes, the Azure Backup service creates a backup health event. Based on the job status (such as succeeded or failed), the dimensions associated with the event vary.

- **Restore Health Events**: The value of this metric represents the count of health events pertaining to restore job health, which were fired for the vault within a specific time. When a restore job completes, the Azure Backup service creates a restore health event. Based on the job status (such as succeeded or failed), the dimensions associated with the event vary.

>[!Note]
>We support Restore Health Events only for Azure Blobs workload, as backups are continuous, and there's no notion of backup jobs here.

By default, the counts are surfaced at the vault level. To view the counts for a particular backup item and job status, you can filter the metrics on any of the supported dimensions.

The following table lists the dimensions that Backup Health Events and Restore Health Events metrics supports:
 
| **Dimension Name**        | **Description**   | 
| ----------------------------| ----------------- |
| Datasource ID               | The unique ID of the [datasource](azure-backup-glossary.md#datasource) associated with the job. <br><br> <ul><li> For Azure resources, such as VMs and Files, this contains the Azure Resource Manager ID (ARM ID) of the resource. <br> For example, `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.Compute/virtualMachines/testVM` </li><br><br> <li> For SQL/HANA databases inside VMs, this contains the ARM ID of the VM followed by details of the database. <br> For example, `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.Compute/virtualMachines/testVM/providers/Microsoft.RecoveryServices/backupProtectedItem/SQLDataBase;mssqlserver;msdb` </li></ul>  <br><br> For SQL AG database backup, the **Datasource ID** field is empty as there is no datasource (VM) in such scenarios. To view metrics for a particular database within an AG, use the **Backup Instance ID** field.|
| Datasource Type             | The type of the [datasource](azure-backup-glossary.md#datasource) associated with the job. Following are the supported datasource types: <br><br> <ul><li> Microsoft.Compute/virtualMachines (Azure Virtual Machines)</li> <br><br> <li> Microsoft.Storage/storageAccounts/fileServices/shares (Azure Files) </li>  <br><br> <li> SQLDatabase (SQL in Azure VM) </li><br><br> <li> SAPHANADataBase (SAP HANA in Azure VM)</li></ul>   |
| Backup Instance ID          | The ARM ID of the [backup instance](azure-backup-glossary.md#backup-instance--backup-item) associated with the job. <br><br> For example, `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.RecoveryServices/vaults/testVault/backupFabrics/Azure/protectionContainers/IaasVMContainer;iaasvmcontainerv2;testRG;testVM/protectedItems/VM;iaasvmcontainerv2;testRG;testVM` |
| Backup Instance Name        | Friendly name of the backup instance for easy readability. It's of the format `{protectedContainerName};{backupItemFriendlyName}`. <br><br> For example, `testStorageAccount;testFileShare`      |
| Health Status               | Represents the health of the backup item after the job had completed. It can take one of the following values: Healthy, Transient Unhealthy, Persistent Unhealthy, Transient Degraded, Persistent Degraded. <br> <br> <ul> <li> When a backup/restore job is successful, a health event with status _Healthy_ appears. </li><br><br><li>_Unhealthy_ appears to job failures due to service errors, and _Degraded_ appears to failures due to user errors. </li> <br><br><li> When the same error happens for the same backup item repeatedly, the state changes from _Transient Unhealthy/Degraded_ to _Persistent Unhealthy/Degraded_. </li></ul> |

## View metrics in the Azure portal

To view metrics in the Azure portal, follow the below steps:

1. In the [Azure portal](https://ms.portal.azure.com/), go to the **Business Continuity Center** > **Monitoring + Reporting** > **Metrics**.

   Alternatively, you can go to the **Recovery Services vault** or **Azure Monitor**, and select **Metrics**.

1. To filter the metrics, select the following data type:

   - **Scope**
   - **Subscription** (only 1 can be selected at a time)
   - **Recovery Services vault**/ **Backup vault** as the resource type
   - **Location**

   >[!Note]
   >- If you go to **Metrics** from **Recovery Services vault**/ **Backup vault**, the metric scope is preselected.
   >- Selection of the **Recovery Services vault**/ **Backup vault** as the resource type allows you to track the backup related built-in metrics - **Backup health events** and **Restore health events**.
   >- Currently, the scope to view metrics is available for all Recovery Services vaults in a particular subscription and region. For example, all Recovery Services vaults in East US in TestSubscription1.
   
1. Select a vault or a group of vaults for which you want to view metrics.

   Currently, the maximum scope for which you can view metrics is: All Recovery Services vaults in a particular subscription and region. For example, All Recovery Services vaults in East US in _TestSubscription1_.

1. **Select a metric** to view _Backup Health Events or Restore Health Events_.

   This renders a chart which shows the count of health events for the vault(s). You can adjust the time range and aggregation granularity by using the filters at the top of the screen.

   :::image type="content" source="./media/metrics-overview/metrics-chart-inline.png" alt-text="Screenshot showing the process to select a metric." lightbox="./media/metrics-overview/metrics-chart-expanded.png":::

1. To filter metrics by different dimensions, click the **Add Filter** button and select the relevant dimension values. 

   - For example, if you wish to see health event counts only for Azure VM backups, add a filter `Datasource Type = Microsoft.Compute/virtualMachines`. 
   - To view health events for a particular datasource or backup instance within the vault, use the datasource ID/backup instance ID filters.
   - To view health events only for failed backups, use a filter on HealthStatus, by selecting the values corresponding to unhealthy or degraded health state.

   :::image type="content" source="./media/metrics-overview/metrics-filters-inline.png" alt-text="Screenshot showing the process to filter metrics by different dimensions." lightbox="./media/metrics-overview/metrics-filters-expanded.png":::

## Manage Alerts

To view your fired metric alerts, follow these steps:

1. In the [Azure portal](https://ms.portal.azure.com/), go to the **Business Continuity Center** > **Monitoring + Reporting** > **Alerts**.
1. Filtering for **Signal Type** = **Metric** and **Alert Type** = **Configured**.
1. Click an alert to view more details about the alert and change its state.

>[!NOTE]
>The alert has two fields - **Monitor condition (fired/resolved)** and **Alert State (New/Ack/Closed)**.
>- **Alert state**: You can edit this field (as shown in below screenshot).
>- **Monitor condition**: You can't edit this field. This field is used more in scenarios where the service itself resolves the alert. For example, auto-resolution behavior in metric alerts uses the **Monitor condition** field to resolve an alert.


#### Datasource alerts and Global alerts

Based on the alert rules configuration, the fired alert appears on the **Alerts** blade in the **Business Continuity Center**.

[Learn how to view and filter alerts](../business-continuity-center/tutorial-monitor-alerts-metrics.md#monitor-alerts).

>[!Note]
>Currently, in case of blob restore alerts, alerts appear under datasource alerts only if you select both the dimensions - *datasourceId* and *datasourceType* while creating the alert rule. If any dimensions aren't selected, the alerts appear under global alerts.

### Accessing metrics programmatically

You can use the different programmatic clients, such as PowerShell, CLI, or REST API, to access the metrics functionality. See [Azure Monitor REST API documentation](/azure/azure-monitor/essentials/rest-api-walkthrough) for more details.

### Sample alert scenarios

#### Fire a single alert if all triggered backups for a vault were successful in last 24 hours

**Alert Rule: Fire an alert if Backup Health Events < 1 in last 24 hours for**:

Dimensions["HealthStatus"] != "Healthy"
	 
#### Fire an alert after every failed backup job

**Alert Rule: Fire an alert if Backup Health Events > 0 in last 5 minutes for**:
 
- Dimensions["HealthStatus"]!= "Healthy"
- Dimensions["DatasourceId"]= "All current and future values"

#### Fire an alert if there were consecutive backup failures for the same item in last 24 hours

**Alert Rule: Fire an alert if Backup Health Events > 1 in last 24 hours for**:

- Dimensions["HealthStatus"]!= "Healthy"
- Dimensions["DatasourceId"]= "All current and future values"
	 
#### Fire an alert if no backup job was executed for an item in last 24 hours

**Alert Rule: Fire an alert if Backup Health Events < 1 in the last 24 hours for**:

Dimensions["DatasourceId"]= "All current and future values"

## Next steps

- [Learn more about monitoring and reporting in Azure Backup](monitoring-and-alerts-overview.md).
- [Learn more about Azure Monitor metrics](/azure/azure-monitor/essentials/data-platform-metrics).
- [Learn more about Azure alerts](/azure/azure-monitor/alerts/alerts-overview).