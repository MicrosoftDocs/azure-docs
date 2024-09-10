---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 08/24/2023
---

Log Analytics workspaces offer a high degree of reliability. The ingestion pipeline, which sends collected data to the Log Analytics workspace, validates that the Log Analytics workspace successfully processes each log record before it removes the record from the pipe. If the ingestion pipeline isn’t available, the agents that send the data buffer and retry sending the logs for many hours.


### Azure Monitor Logs features that enhance resilience

Azure Monitor Logs offers several features that enhance workspaces resilience to various types of issues. You can use these features individually or in combination, depending on your needs.  

This video provides an overview of reliability and resilience options available for Log Analytics workspaces:

> [!VIDEO https://www.youtube.com/embed/CYspm1Yevx8?cc_load_policy=1&cc_lang_pref=auto]

#### In-region protection using availability zones

[!INCLUDE [logs-availability-zones](../includes/logs-availability-zones.md)]

#### Backup of data from specific tables using continuous export 

You can [continuously export data sent to specific tables in your Log Analytics workspace](../logs/logs-data-export.md) to Azure storage accounts. 

The storage account you export data to must be in the same region as your Log Analytics workspace. To protect and have access to your ingested logs, even if the workspace region is down, use a geo-redundant storage account, as explained in [Configuration recommendations](#configuration-recommendations).    

The export mechanism doesn’t provide protection from incidents impacting the ingestion pipeline or the export process itself. 

> [!NOTE]
> You can access data in a storage account from Azure Monitor Logs using the [externaldata operator](/kusto/query/externaldata-operator?view=azure-monitor). However, the exported data is stored in five-minute blobs and analyzing data spanning multiple blobs can be cumbersome. Therefore, exporting data to a storage account is a good data backup mechanism, but having the backed up data in a storage account is not ideal if you need it for analysis in Azure Monitor Logs. You can query large volumes of blob data using [Azure Data Explorer](/azure/data-explorer/query-exported-azure-monitor-data), [Azure Data Factory](/azure/data-factory/introduction#connect-and-collect), or any other storage access tool. 

#### Cross-regional data protection and service resilience using workspace replication (preview) 

Workspace replication (preview) is the most extensive resilience solution as it replicates the Log Analytics workspace and incoming logs to another region. 

Workspace replication protects both your logs and the service operations, and allows you to continue monitoring your systems in the event of infrastructure or application-related region-wide incidents.

In contrast with availability zones, which Microsoft manages end-to-end, you need to monitor your primary workspace's health and decide when to switch over to the workspace in the secondary region and back. 


### Design checklist

> [!div class="checklist"]
> - To ensure service and data resilience to region-wide incidents, enable workspace replication. 
> - To ensure in-region protection against datacenter failure, create your workspace in a region that supports availability zones. 
> - For cross-regional backup of data in specific tables, use the continuous export feature to send data to a geo-replicated storage account. 
> - Monitor the health of your Log Analytics workspaces.
 
### Configuration recommendations

| Recommendation | Benefit |
|:---|:---|
| To ensure the greatest degree of resilience, enable workspace replication. |**Cross-regional resilience for workspace data and service operations.** <br><br>[Workspace replication (preview)](../logs/workspace-replication.md) ensures high availability by creating a secondary instance of your workspace in another region and ingesting your logs to both workspaces.<br><br>When needed, switch to your secondary workspace until the issues impacting your primary workspace are resolved. You can continue ingesting logs, querying data, using dashboards, alerts, and Sentinel in your secondary workspace. You also have access to logs ingested before the region switch.<br><br>This is a paid feature, so consider whether you want to replicate all of your incoming logs, or only some data streams. |
| If possible, create your workspace in a region that supports Azure Monitor service-resilience. | **In-region resilience of workspace data and service operations in the event of datacenter issues.** <br><br>Availability zones that support service resilience also support data resilience. This means that even if an entire datacenter becomes unavailable, the redundancy between zones allows Azure Monitor service operations, like ingestion and querying, to continue to work, and your ingested logs to remain available.<br><br>Availability zones provide in-region protection, but don't protect against issues that impact the entire region.<br><br>For information about which regions support data resilience, see [Enhance data and service resilience in Azure Monitor Logs with availability zones](../logs/availability-zones.md).   |
| Create your workspace in a region that supports data resilience. | **In-region protection against loss of the logs in your workspace in the event of datacenter issues.** <br><br>Creating your workspace in a region that supports data resilience means that even if the entire datacenter becomes unavailable, your ingested logs are safe. <br>If the service is unable to run queries, you can't view the logs until the issue is resolved.<br><br>For information about which regions support data resilience, see [Enhance data and service resilience in Azure Monitor Logs with availability zones](../logs/availability-zones.md). |
| Configure data export from specific tables to a storage account that's replicated across regions.  | **Maintain a backup copy of your log data in a different region.**<br><br>The [data export feature of Azure Monitor](../logs/logs-data-export.md) allows you to continuously export data sent to specific tables to Azure storage where it can be retained for extended periods. Use a geo-redundant storage (GRS) or geo-zone-redundant storage (GZRS) account to keep your data safe even if an entire region becomes unavailable. To make your data readable from the other regions, configure your storage account for read access to the secondary region. For more information, see [Azure Storage redundancy on a secondary region](/azure/storage/common/storage-redundancy#redundancy-in-a-secondary-region) and [Azure Storage read access to data in the secondary region](/azure/storage/common/storage-redundancy#read-access-to-data-in-the-secondary-region).<br><br>For [tables that don't supported continuous data export](../logs/logs-data-export.md?tabs=portal#limitations), you can use other methods of exporting data, including Logic Apps, to protect your data. This is primarily a solution to meet compliance for data retention since the data can be difficult to analyze and restore to the workspace.<br><br> Data export is susceptible to regional incidents because it relies on the stability of the Azure Monitor ingestion pipeline in your region. It doesn't provide resiliency against incidents impacting the regional ingestion pipeline.|
| Monitor the health of your Log Analytics workspaces. | Use [Log Analytics workspace insights](../logs/workspace-design.md) to track failed queries and create [health status alert](../logs/log-analytics-workspace-health.md#view-log-analytics-workspace-health-and-set-up-health-status-alerts) to proactively notify you if a workspace becomes unavailable because of a datacenter or regional failure. |

#### Compare Azure Monitor Logs resilience features

| Feature                | Service resilience | Data backup | High availability | Scope of protection  | Setup                     | Cost    |
|------------------------|--------------------|-------------|-------------------|-------------------|--------------------------|------------------------------------------------------------------------------|
| Workspace replication     | :white_check_mark:            | :white_check_mark: |  :white_check_mark:           | Cross-region protection against region-wide incidents                                                       | Enable replication of the workspace and related data collection rules. Switch between regions as needed.                                               | Based on the number of replicated GBs and region.  |
| Availability zones     | :white_check_mark: <br>In supported regions           |  :white_check_mark: |  :white_check_mark:           | In-region protection against datacenter issues                                                     |    Automatically enabled in supported regions.                                              | No cost |
| Continuous data export |                              | :white_check_mark:  |  |  Protection from data loss because of a regional failure <sup>1</sup>                                 | Enable per table.                                           | Cost of data export + Storage blob or Event Hubs |


<sup>1</sup> Data export provides cross-region protection if you export logs to a geo-replicated storage account. In the event of an incident, previously exported data is backed up and readily available; however, further export might fail, depending on the nature of the incident.