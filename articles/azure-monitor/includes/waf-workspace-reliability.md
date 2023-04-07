---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 03/30/2023
---

### Design checklist

> [!div class="checklist"]
> - Create a dedicated cluster in an availability zone to keep workspace available in the case of a datacenter failure.
> - Configure data collection to send critical data to multiple workspaces in different regions.
> - Configure data export from the workspace to protect data in the workspace in the case of datacenter or region failure.

### Configuration recommendations

| Recommendation | Benefit |
|:---|:---|
| Create a dedicated cluster in an availability zone to keep workspace available in the case of a datacenter failure. | Workspaces linked to a [dedicated cluster](../logs/logs-dedicated-clusters.md) located in an [availability zone](../logs/availability-zones.md#data-resilience---supported-regions) remain available if a datacenter fails.<br><br>A dedicated cluster requires a minimum of 500 GB per day, although this data can be spread across multiple workspaces linked to the cluster. If you aren't able to commit to this level of collection, then you can still use other methods to at least protect your data in the case of datacenter failure. |
| Configure data collection to send critical data to multiple workspaces in different regions if you require the workspace to be available in the case of a region failure. | This strategy requires you to configure your data sources to send to multiple workspaces in different regions. For example, configure multiple DCRs for Azure Monitor agent running on virtual machines, and multiple diagnostic settings toll collection resource logs from Azure resources.<br><br>Use this strategy only for critical data since it would result in duplicate ingestion and retention charges. Also, even though the data will be available in the alternate workspace in the case of region failure, resources that rely on the data such as alerts and workbooks would not know to use this workspace. |
| If you don't collect enough data for a dedicated cluster, configure data export from the workspace to protect data in the workspace in the case of datacenter or region failure. | The [data export feature of Azure Monitor](../logs/logs-data-export.md) allows you to continuously export data sent to specific tables to Azure storage where it can be retained for extended periods. Use [Azure Storage redundancy options](../../storage/common/storage-redundancy.md#redundancy-in-a-secondary-region) including GRS and GZRS to replicate this data to other regions.<br><br>Data export only supports [specific tables](../logs/logs-data-export.md?tabs=portal#supported-tables). If you require export of other tables, including custom tables, then you can use other methods of exporting data including Logic apps to protect your data. |
