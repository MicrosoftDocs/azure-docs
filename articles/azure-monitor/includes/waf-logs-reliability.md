---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 08/24/2023
---

Log Analytics workspaces offer a high degree of reliability. The ingestion pipeline, which sends collected data to the Log Analytics workspace, validates that the Log Analytics workspace successfully processes each log record before it removes the record from the pipe. If the ingestion pipeline isn’t available, the agents that send the data buffer and retry sending the logs for many hours.


### Azure Monitor Logs features that enhance resilience

Azure Monitor Logs offers a number of features that can make your workspaces more resilient against various types of issues. These features complement one another, so you can use all of them, or none, based on your needs. Some are in-region solutions, and others provide cross-regional redundancy; some are applied automatically and others require manual triggering.  

This video provides an overview of reliability and resilience options available for Log Analytics workspaces:

> [!VIDEO https://www.youtube.com/embed/CYspm1Yevx8?cc_load_policy=1&cc_lang_pref=auto]

#### In-region protection using availability zones

[!INCLUDE [logs-availability-zones](../includes/logs-availability-zones.md)]

#### Backup of data from specific tables using continuous export 

You can [continuously export data sent to specific tables in your Log Analytics workspace](../logs/logs-data-export.md) to Azure storage accounts. 

The destination storage account you export data to must be in the same region as your Log Analytics workspace, but you can replicate the storage account to another region, so your ingested logs remain safe and available even if the workspace region is down.  

The export mechanism doesn’t provide protection from incidents impacting the ingestion pipeline or the export process itself. 

> [!NOTE]
> You can access data in a storage account from Azure Monitor Logs using the [externaldata operator](/kusto/query/externaldata-operator?view=azure-monitor). However, the exported data is stored in five-minute blobs and analyzing data spanning multiple blobs can be cumbersome. Therefore, exporting data to a storage account is a good data backup mechanism, but having the backed up data in a storage account is not ideal if you need in for analysis in Azure Monitor Logs. You can query a large volumes of blob data using [Azure Data Explorer](/azure/data-explorer/query-exported-azure-monitor-data), [Azure Data Factory](/azure/data-factory/introduction#connect-and-collect), or any other storage access tool. 

#### Protection against regional failure using workspace replication (preview) 

Workspace replication (preview) is the most extensive resilience solution as it replicates the Log Analytics workspace and incoming logs to another region. 

This lets you switch from the primary workspace location to the secondary without extra configuration to any of your agents or other clients.  Workspace replication protects both your logs and the service operations, and allows you to continue monitoring your systems in the event of region-wide incidents, regardless of whether they stem from the infrastructure or the application layer. 

When workspace replication is enabled, an empty copy of your workspace is created on another region, with the same configuration as your main, primary workspace. Any changes to your workspace configuration are automatically synced to the secondary workspaces. Note that you can’t manage or directly access the secondary workspace, which is why we sometimes refer to it as “shadow workspace”. It’s only used for resiliency purposes. 

### Design checklist

> [!div class="checklist"]
> - Service and data resilience to region-wide incidents - To ensure that your workspace continues working and your logs remain available in the event of an incident that impacts the entire region, enable workspace replication. This is a paid feature, so consider whether your want to replicate all of your incoming logs, or only some data streams. 
> - In-region protection against datacenter failure – Create your workspace in a region that supports data resilience. 
> - Cross-regional backup of data in specific tables - Use the continuous export feature to export data from specific tables to a zone-redundant storage account. 
> - Monitor the health of your Log Analytics workspaces.
 
### Configuration recommendations

| Recommendation | Benefit |
|:---|:---|
| Enable workspace replication |**Cross-regional resilience for workspace data and service operations.** <br><br>[Workspace replication (preview)](../logs/workspace-replication.md) ensures high availability by creating a secondary instance of your workspace in another region and ingesting your logs to both workspaces.<br>When needed, switch to your secondary workspace until the issues impacting your primary workspace are resolved. You can continue ingesting logs, querying data, using dashboards, alerts, and Sentinel in your secondary workspace. You also have access to logs ingested before the region switch.<br>This is a paid feature. You can change workspace configuration or schema when running on the secondary workspace.  |
| Create your workspace in a region that has Azure Monitor service-level availability zone protection  | **In-region resilience of workspace data and service operations in the event of datacenter issues.** <br><br>Availability zones that support service resilience also support data resilience. This means that even if an entire datacenter becomes unavailable, the redundancy between zones allows Azure Monitor service operations, like ingestion and querying, to continue to work, and your ingested logs to remain available. <br>Availability zones provide in-region protection, but don't protect against issues that impact the entire region.  |
| Create your workspace in a region that supports data resilience | **In-region protection against loss of the logs in your workspace in the event of datacenter issues.** <br><br>Placing your workspace (and dedicated cluster if needed) in a region that leverages availability zones for Azure Monitor data resilience means that even if an entire datacenter becomes unavailable, the redundancy between zones keeps your ingested logs safe. <br>Note that while the data is safe, if the service is unable to run queries, you won’t be able to view the logs until the issue is resolved. |
| Configure data export from the workspace to a storage account that is replicated across regions (such as RA-GRS).  | **Maintain a backup copy of your log data in a different region.**<br><br>The [data export feature of Azure Monitor](../logs/logs-data-export.md) allows you to continuously export data sent to specific tables to Azure storage where it can be retained for extended periods. Use a geo-redundant storage (GRS) or geo-zone-redundant storage (GZRS) account to keep your data safe even if an entire region becomes unavailable. To make your data readable from the other regions, configure your storage account for read access to the secondary region. For more information see [Azure Storage redundancy on a secondary region](/azure/storage/common/storage-redundancy#redundancy-in-a-secondary-region) and [Azure Storage read access to data in the secondary region](/azure/storage/common/storage-redundancy#read-access-to-data-in-the-secondary-region).<br><br>For [tables that don't supported continuous data export](../logs/logs-data-export.md?tabs=portal#limitations), you can use other methods of exporting data, including Logic Apps, to protect your data. This is primarily a solution to meet compliance for data retention since the data can be difficult to analyze and restore to the workspace.<br><br> Data export is susceptible to regional incidents because it relies on the stability of the Azure Monitor ingestion pipeline in your region. It doesn't provide resiliency against incidents impacting the regional ingestion pipeline.|
| Monitor the health of your Log Analytics workspaces. | Use [Log Analytics workspace insights](../logs/workspace-design.md) to track failed queries and create [health status alert](../logs/log-analytics-workspace-health.md#view-log-analytics-workspace-health-and-set-up-health-status-alerts) to proactively notify you if a workspace becomes unavailable because of a datacenter or regional failure. |

#### Compare Azure Monitor Logs resilience features

| Feature                | Service resilience | Data backup | High availability | Scope of protection  | Setup                     | Cost    |
|------------------------|--------------------|-------------|-------------------|-------------------|--------------------------|------------------------------------------------------------------------------|
| Workspace replication     | :white_check_mark:            | :white_check_mark: |  :white_check_mark:           | Cross-region protection against region-wide incidents                                                       | Enable replication of the workspace and related data collection rules. Switch between regions as needed.                                               | Based on the amount of replicated GBs and region.  |
| Availability zones     | :white_check_mark: <br>In supported regions           |  :white_check_mark: |  :white_check_mark:           | In-region protection against datacenter issues                                                     |    Automatically enabled on dedicated clusters in supported regions.                                              | No cost |
| Continuous data export |                              | :white_check_mark:  |  |  Protection from regional failure <sup>1</sup>                                 | Enable per table.                                           | Cost of data export + Storage blob or Event Hubs |


<sup>1</sup> Data export provides cross-region protection if you export logs to a different region. In the event of an incident, previously exported data is backed up and readily available; however, further export might fail, depending on the nature of the incident.