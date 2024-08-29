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

#### In-region protection using availability zones

[!INCLUDE [logs-availability-zones](../includes/logs-availability-zones.md)]

#### Backup of data from specific tables using continuous export 

You can [continuously export data sent to specific tables in your Log Analytics workspace](../logs/logs-data-export.md) to Azure storage accounts or Azure Event Hubs. 

The destination storage account you export data to must be in the same region as your Log Analytics workspace, but you can replicate the storage account to another region, so your ingested logs remain safe and available even if the workspace region is down. 

We recommend that you use a geo-redundant storage (GRS) or geo-zone-redundant storage (GZRS) account to keep your data safe even if an entire region becomes unavailable. To make your data readable from the other regions, configure your storage account for read access to the secondary region. For more information see [Azure Storage redundancy on a secondary region](/azure/storage/common/storage-redundancy#redundancy-in-a-secondary-region) and [Azure Storage read access to data in the secondary region](/azure/storage/common/storage-redundancy#read-access-to-data-in-the-secondary-region). 

The export mechanism doesn’t provide protection from incidents impacting the ingestion pipeline or the export process itself. 

You can access data in a storage account from Azure Monitor Logs using the [externaldata operator](/kusto/query/externaldata-operator?view=azure-monitor). However, the exported data is stored in five-minute blobs and analyzing data spanning multiple blobs can be cumbersome. Therefore, exporting data to a storage account is a good data backup mechanism, but having the backed up data in a storage account is not ideal if you need in for analysis in Azure Monitor Logs. You can query a large volumes of blob data using [Azure Data Explorer](/azure/data-explorer/query-exported-azure-monitor-data), [Azure Data Factory](/azure/data-factory/introduction#connect-and-collect), or any other storage access tool. 

#### Protection against regional failure using workspace replication (preview) 

Workspace replication (preview) is the most extensive resilience solution as it replicates the Log Analytics workspace and incoming logs to another region. 

This lets you switch from the primary workspace location to the secondary without extra configuration to any of your agents or other clients.  Workspace replication protects both your logs and the service operations, and allows you to continue monitoring your systems in the event of region-wide incidents, regardless of whether they stem from the infrastructure or the application layer. 

When workspace replication is enabled, an empty copy of your workspace is created on another region, with the same configuration as your main, primary workspace. Any changes to your workspace configuration are automatically synced to the secondary workspaces. Note that you can’t manage or directly access the secondary workspace, which is why we sometimes refer to it as “shadow workspace”. It’s only used for resiliency purposes. 

#### Compare Azure Monitor Logs resilience features

| Feature                | Service resilience | Data backup | High availability | Scope of protection  | Setup                     | Cost    |
|------------------------|--------------------|-------------|-------------------|-------------------|--------------------------|------------------------------------------------------------------------------|
| Workspace replication     | :white_check_mark:            | :white_check_mark: |  :white_check_mark:           | Cross-region protection against region-wide incidents                                                       | 1. Enable on the workspace and related data collection rules (DCRs).<br>2. Switch between regions as needed.                                               | Based on the amount of replicated GBs and region.  |
| Availability zones     | :white_check_mark: <br>In supported regions           |  :white_check_mark: |  :white_check_mark:           | In-region                                                      |    Automatically enabled on dedicated clusters in supported regions.                                              | No cost |
| Continuous data export |                              | :white_check_mark:  |  |  Protection from regional failure <sup>1</sup>                                 | Enable per table.                                           | Cost of data export + Storage blob or Event Hubs |


<sup>1</sup> Data export provides cross-region protection if you export logs to a different region. In the event of an incident, previously exported data is backed up and readily available; however, further export might fail, depending on the nature of the incident.

### Design checklist

> [!div class="checklist"]
> - If you require data to be protected in the case of datacenter or region failure, configure data export from the workspace to save data in an alternate location.
> - Monitor the health of your Log Analytics workspaces.
 
### Configuration recommendations

| Recommendation | Benefit |
|:---|:---|
| If you collect enough data, create a dedicated cluster in a region that supports availability zones. | Workspaces linked to a [dedicated cluster](../logs/logs-dedicated-clusters.md) located in a region that supports [availability zones](../logs/availability-zones.md#supported-regions) remain available if a datacenter fails.<br><br> A dedicated cluster requires a commitment of at least 100 GB per day from all workspaces in the same region. If you don't collect this much data, then you need to weight the cost of this commitment with reliability features that it provides. |
| If you require data in your workspace to be available in the event of a region failure, send critical data to multiple workspaces in different regions. | Send data to multiple workspaces in different regions. For example, configure DCRs to send data to multiple workspaces from Azure Monitor Agent running on virtual machines, and configure multiple diagnostic settings to collect resource logs from Azure resources to multiple workspaces. <br><br>Even though the data will be available in the alternate workspace in case of failure, resources that rely on the data, such as alerts and workbooks, won't know to use the alternate workspace. Consider storing ARM templates for critical resources with configuration for the alternate workspace in Azure DevOps or as disabled [policies](../../governance/policy/overview.md) that can quickly be enabled in a failover scenario.<br><br>Tradeoff: This configuration results in duplicate ingestion and retention charges so only use it for critical data. |
| For mission-critical workloads requiring high availability, consider implementing a federated workspace model that uses multiple workspaces to provide high availability in the case of regional failure. | [Mission-critical](/azure/well-architected/mission-critical/mission-critical-overview) provides prescriptive best practice guidance for architecting highly reliable applications on Azure. The design methodology includes a federated workspace model with multiple Log Analytics workspaces to deliver [high availability](/azure/well-architected/mission-critical/mission-critical-design-methodology#select-a-reliability-tier) in the case of multiple failures, including the failure of an Azure region.<br><br> This strategy eliminates egress costs across regions and remains operational with a region failure, but it requires additional complexity that you must manage with configuration and processes described in [Health modeling and observability of mission-critical workloads on Azure](/azure/well-architected/mission-critical/mission-critical-health-modeling).|
| If you require data to be protected in the case of datacenter or region failure, configure data export from the workspace to save data in an alternate location. | The [data export feature of Azure Monitor](../logs/logs-data-export.md) allows you to continuously export data sent to specific tables to Azure storage where it can be retained for extended periods. Use [Azure Storage redundancy options](../../storage/common/storage-redundancy.md#redundancy-in-a-secondary-region), including GRS and GZRS, to replicate this data to other regions. If you require export of [tables that aren't supported by data export](../logs/logs-data-export.md?tabs=portal#limitations), you can use other methods of exporting data, including Logic apps, to protect your data. This is primarily a solution to meet compliance for data retention since the data can be difficult to analyze and restore to the workspace.<br><br>This option is similar to the previous option of multicasting the data to different workspaces, but has a lower cost because the extra data is written to storage.<br><br> Data export is susceptible to regional incidents because it relies on the stability of the Azure Monitor ingestion pipeline in your region. It doesn't provide resiliency against incidents impacting the regional ingestion pipeline.|
| Monitor the health of your Log Analytics workspaces. | Use [Log Analytics workspace insights](../logs/workspace-design.md) to track failed queries and create [health status alert](../logs/log-analytics-workspace-health.md#view-log-analytics-workspace-health-and-set-up-health-status-alerts) to proactively notify you if a workspace becomes unavailable because of a datacenter or regional failure. |

