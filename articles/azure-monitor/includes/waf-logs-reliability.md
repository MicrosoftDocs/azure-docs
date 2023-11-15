---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 08/24/2023
---

Log Analytics workspaces offer a high degree of reliability. Conditions where a temporary loss of access to the workspace can result in data loss are often mitigated by features such as data buffering with the Azure Monitor Agent and protection mechanisms built into the ingestion pipeline.

The resiliency features described in this section can provide additional protection from data loss and business continuity. Some are in-region solutions, and others provide cross-regional redundancy; some are applied automatically and others require manual triggering. The table below summarizes and compares these features. 

Some availability features require a dedicated cluster, which currently requires a commitment of at least 500 GB per day from all workspaces linked to this cluster (aggregated).

### Design checklist

> [!div class="checklist"]
> - If you collect enough data for a dedicated cluster, create a dedicated cluster in an availability zone.
> - If you require the workspace to be available in the case of a region failure, or you don't collect enough data for a dedicated cluster, configure data collection to send critical data to multiple workspaces in different regions.
> - If you require data to be protected in the case of datacenter or region failure, configure data export from the workspace to save data in an alternate location.
> - For mission-critical workloads requiring high availability, consider implementing a federated workspace model.
> - Monitor the health of your Log Analytics workspaces.
 
### Configuration recommendations

| Recommendation | Benefit |
|:---|:---|
| If you collect enough data, create a dedicated cluster in a region that supports availability zones. | Workspaces linked to a [dedicated cluster](../logs/logs-dedicated-clusters.md) located in a region that supports [availability zones](../logs/availability-zones.md#data-resilience---supported-regions) remain available if a datacenter fails.<br><br> A dedicated cluster requires a commitment of at least 500 GB per day from all workspaces in the same region. If you don't collect this much data, then you need to weight the cost of this commitment with reliability features that it provides. |
| If you require data in your workspace to be available in the case of a region failure, send critical data to multiple workspaces in different regions. | Send data to multiple workspaces in different regions. For example, configure DCRs to send data to multiple workspaces from Azure Monitor Agent running on virtual machines, and configure multiple diagnostic settings to collect resource logs from Azure resources to multiple workspaces. <br><br>Even though the data will be available in the alternate workspace in case of failure, resources that rely on the data, such as alerts and workbooks, won't know to use the alternate workspace. Consider storing ARM templates for critical resources with configuration for the alternate workspace in Azure DevOps or as disabled [policies](../../governance/policy/overview.md) that can quickly be enabled in a failover scenario.<br><br>Tradeoff: This configuration results in duplicate ingestion and retention charges so only use it for critical data. |
| For mission-critical workloads requiring high availability, consider implementing a federated workspace model that uses multiple workspaces to provide high availability in the case of regional failure. | [Mission-critical](/azure/well-architected/mission-critical/mission-critical-overview) provides prescriptive best practice guidance for architecting highly reliable applications on Azure. The design methodology includes a federated workspace model with multiple Log Analytics workspaces to deliver [high availability](/azure/well-architected/mission-critical/mission-critical-design-methodology#select-a-reliability-tier) in the case of multiple failures, including the failure of an Azure region.<br><br> This strategy eliminates egress costs across regions and remains operational with a region failure, but it requires additional complexity that you must manage with configuration and processes described in [Health modeling and observability of mission-critical workloads on Azure](/azure/well-architected/mission-critical/mission-critical-health-modeling).|
| If you require data to be protected in the case of datacenter or region failure, configure data export from the workspace to save data in an alternate location. | The [data export feature of Azure Monitor](../logs/logs-data-export.md) allows you to continuously export data sent to specific tables to Azure storage where it can be retained for extended periods. Use [Azure Storage redundancy options](../../storage/common/storage-redundancy.md#redundancy-in-a-secondary-region), including GRS and GZRS, to replicate this data to other regions. If you require export of [tables that aren't supported by data export](../logs/logs-data-export.md?tabs=portal#limitations), you can use other methods of exporting data, including Logic apps, to protect your data. This is primarily a solution to meet compliance for data retention since the data can be difficult to analyze and restore to the workspace.<br><br>This option is similar to the previous option of multicasting the data to different workspaces, but has a lower cost because the extra data is written to storage.<br><br> Data export is susceptible to regional incidents because it relies on the stability of the Azure Monitor ingestion pipeline in your region. It doesn't provide resiliency against incidents impacting the regional ingestion pipeline.|
| Monitor the health of your Log Analytics workspaces. | Use [Log Analytics workspace insights](../logs/workspace-design.md) to track failed queries and create [health status alert](../logs/log-analytics-workspace-health.md#view-log-analytics-workspace-health-and-set-up-health-status-alerts) to proactively notify you if a workspace becomes unavailable because of a datacenter or regional failure. |

### Compare resilience features and capabilities

| Feature                | Service resilience | Data backup | High availability | Scope of protection  | Setup                     | Cost    |
|------------------------|------------------------------|------------------|-----|---------------------------------|--------------------------|------------------------------------------------------------------------------|--------------------------------------------------|---------|
| Availability zones     | :white_check_mark: <br>In supported regions           |  :white_check_mark: |  :white_check_mark:           | In-region                                                      |    Automatically enabled on dedicated clusters in supported regions.                                              | No cost |
| Continuous data export |                              | :white_check_mark:  |  |  Protection from regional failure <sup>1</sup>                                 | Enable per table.                                           | Cost of data export + Storage blob or Event Hubs |
| Dual ingestion         | :white_check_mark:           | :white_check_mark:   |  :white_check_mark: | Protection from regional failure                                                                       | Enable per monitored resource.         | Up to twice the cost of retention (depending on how much data you dual ingest) + egress charges. |


<sup>1</sup> Data export provides cross-region protection if you export logs to a different region. In the event of an incident, previously exported data is backed up and readily available; however, further export might fail, depending on the nature of the incident.