---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 03/30/2023
---

Log Analytics workspaces offer a high degree of reliability without any design decisions. Conditions where a temporary loss of access to the workspace can result in data loss are often mitigated by features of other Azure Monitor components such as data buffering with the Azure Monitor agent.

The reliability situations to consider for Log Analytics workspaces are availability of the workspace and protection of collected data in the rare case of failure of an Azure datacenter or region. There is currently no standard feature for failover between workspaces in different regions, but there are strategies that you can use if you have particular requirements for availability or compliance.

Some availability features require a dedicated cluster. Since this requires a commitment of at least 500 GB per day from all workspaces in the same region, reliability will not typically be your primary criteria for including dedicated clusters in your design.

### Design checklist

> [!div class="checklist"]
> - If you collect enough data for a dedicated cluster, create a dedicated cluster in an availability zone.
> - If you require the workspace to be available in the case of a region failure, or you don't collect enough data for a dedicated cluster, configure data collection to send critical data to multiple workspaces in different regions.
> - If you require data to be protected in the case of datacenter or region failure, configure data export from the workspace to save data in an alternate location.
> - Create a health status alert rule for your Log Analytics workspace.
 
### Configuration recommendations

| Recommendation | Benefit |
|:---|:---|
| If you collect enough data, create a dedicated cluster in a region that supports availability zones. | Workspaces linked to a [dedicated cluster](../logs/logs-dedicated-clusters.md) located in a region that supports [availability zones](../logs/availability-zones.md#data-resilience---supported-regions) remain available if a datacenter fails. |
| If you require the workspace to be available in the case of a region failure, or you don't collect enough data for a dedicated cluster, configure data collection to send critical data to multiple workspaces in different regions. | Configure your data sources to send to multiple workspaces in different regions. For example, configure DCRs for multiple workspaces for Azure Monitor agent running on virtual machines, and multiple diagnostic settings to collection resource logs from Azure resources. This configuration results in duplicate ingestion and retention charges so only use it for critical data.<br><br>Even though the data will be available in the alternate workspace in case of failure, resources that rely on the data such as alerts and workbooks wouldn't know to use this workspace. Consider storing ARM templates for critical resources with configuration for the alternate workspace in Azure DevOps or as disabled [policies](../../governance/policy/overview.md) that can quickly be enabled in a failover scenario. |
| If you require data to be protected in the case of datacenter or region failure, configure data export from the workspace to save data in an alternate location. | The [data export feature of Azure Monitor](../logs/logs-data-export.md) allows you to continuously export data sent to specific tables to Azure storage where it can be retained for extended periods. Use [Azure Storage redundancy options](../../storage/common/storage-redundancy.md#redundancy-in-a-secondary-region) including GRS and GZRS to replicate this data to other regions. If you require export of [tables that aren't supported by data export](../logs/logs-data-export.md?tabs=portal#limitations) then you can use other methods of exporting data including Logic apps to protect your data. This is primarily a solution to meet compliance for data retention since the data can be difficult to analyze and restore back to the workspace. |
| Create a health status alert rule for your Log Analytics workspace. | A [health status alert](../logs/log-analytics-workspace-health.md#view-log-analytics-workspace-health-and-set-up-health-status-alerts) will proactively notify you if a workspace becomes unavailable because of a datacenter or regional failure. |