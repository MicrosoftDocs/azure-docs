---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 03/30/2023
---

Log Analytics workspaces offer a high degree of reliability without any design decisions. Conditions where a temporary loss of access to the workspace can result in data loss are often mitigated by features such as data buffering with the Azure Monitor agent and protection mechanisms built into the ingestion pipeline.

The resiliency features described in this section provide different solutions that can complement each other. Some focus on keeping your ingested logs safe, and other also provide business continuity (keeping service functions operational - log ingestion, queries, alerts etc.); some provide in-region solutions, and others provide cross-regional redundancy; some are applied automatically and others require user triggering. The below table summarizes and compares these features. 

Some availability features require a dedicated cluster, which currently requires a commitment of at least 500 GB per day from all workspaces linked to this cluster (aggregated).

### Best Practice: Colocation of data
If your resources are located in multiple regions, we recommend creating a workspace in each region so that each resource would send logs to its local workspace. That way, you minimize cross-region dependencies and avoid paying extra fees for sending data between regions (egress). There are no charges associated with creating a workspace.
While co-location is a good practice that minimizes risk and spares costs, it should be complemented by other solutions to provide resiliency against regional outages. The rest of this document outlines the capabilities you can use to increase data and service resiliency.

### Design checklist

> [!div class="checklist"]
> - If you collect enough data for a dedicated cluster, create a dedicated cluster in an availability zone.
> - If you require the workspace to be available in the case of a full region failure, or you don't collect enough data for a dedicated cluster, configure Workspace Replication to another region (feature in private preview). Alternatively, you can configure Agest dual homing to send critical data to multiple workspaces in different regions.
> - If you only require that your data (ingested logs) be protected and available in the case of datacenter or region failure, configure data export from the workspace to save data in an alternate location, such as a GRS/RA-GRS storage account.
> - Check which of the resiliency features below is available in your region.
> - Create health status alert rules for your Log Analytics workspace.

## Resiliency features review and comparison
### Availability zones
Azure regions are made up of datacenters. Some Azure regions have [availability zones](../../reliability/availability-zones-overview.md) - each zone is made of one or more datacenters equipped with independent power, cooling, and networking infrastructure. Availability zones are designed so that if one zone is affected by an incident, the regional services, capacity, and high availability are supported by the other zones in the region.
Azure Monitor Log Analytics workspaces can use Availability zones to remain available and operational in the face of infrastructure incidents impacting the underlying datacenter. Once enabled, you won't need to take any action to benefit from the resilience of availability zones, as switching between zones is seamless. 
To use Availability Zones, Azure Monitor currently requires that the Log Analytics workspace be linked to an [Azure Monitor dedicated cluster](../logs/logs-dedicated-clusters.md), and run in a supported region. See [Availability Zones in Azure Monitor](../logs/availability-zones.md) for more details. There are no additional costs related to using Availability zones.

#### Note: Availability zone protection applied to your data vs. to service operations 
In some regions, you may be able to use a dedicated cluster supporting availability zones, which protects your stored data against zonal failures. Yet, if the Azure Monitor service doesn't have availability zone support in this region, the service operations (log ingestion, queries etc.) will not have the same level of resiliency, hence they may be impacted by such incidents.

### Data export
As data is being ingested to your Log Analytics workspace, you can [continuously export](../logs/logs-data-export.md) it to Azure Storage accounts or to Azure Event Hubs. Export is done data type (table), so you can choose which data types to export and thus control the related costs. While the export destinations must be in the same region as the exporting Log Analytics workspace, you can still use export for cross-regional resiliency as explained below. This can significantly increase the resilience and availability of your ingested logs even in the face of a region-wide incident. Note that the export mechanism doesn't provide protection from incidents impacting the ingestion pipeline or the export process itself, but rather creates another copy of your data, stored in another location.

See Data Export pricing details [here](../logs/logs-data-export.md#pricing-model). In addition, there are costs associated with the Storage accounts or Event hubs you may choose to export to (see storage accounts pricing [here](https://azure.microsoft.com/en-us/pricing/details/storage/blobs/)).

##### Note: Continuous export advantages and limits in a nutshell
Continuously exporting your data is useful.
 * Data backup - your data is replicated and can be accessed through storage account or event hub.
 * Controlling costs - if your need to keep some of your logs for future auditing purposes or to comply with regulations, exporting the data can allow you to control your costs by:
     * Exporting only the data types (table), records and fields you need, instead of your entire data set. 
     * Storing your exported logs in a "cold" storage instead of setting a long retention period on your Log Analytics workspace.
Yet, data export is susceptible to regional incidents since it relies on the stability of the Azure Monitor ingestion pipeline in your region. It doesn't provide resiliency against incidents impacting the regional ingestion pipeline.

> [!NOTE]
> 
> Custom logs
> 
> Data export can be used to export custom logs v2 (custom logs sent through a [DCR](../logs/logs-ingestion-api-overview.md)) and not CLv1 (custom logs sent through the deprecated [HTTP Data Collector API](../logs/data-collector-api.md)).

#### Export to a storage account
Export is performed on data as it arrives at the ingestion pipeline. The exported data is stored in 5-minute buckets, in one or more blobs (depending on the volume of exported data). For resiliency purposes we recommend that you use a GRS/GZRS storage account which by definition is replicated across regions, hence keeping your data safe even if an entire region becomes unavailable. To make your data readable from the other regions, use RA-GRS/RA-GZRS storage accounts. See [Redundancy on a secondary region](../../storage/common/storage-redundancy.md#redundancy-in-a-secondary-region) and [Read access to data in the secondary region](../../storage/common/storage-redundancy.md#read-access-to-data-in-the-secondary-region) for more details.

#### Accessing data exported to a storage account
The data exported to storage accounts can be accessed from Log Analytics using the [externaldata operator](/azure/data-explorer/kusto/query/externaldata-operator?pivots=azuremonitor). Since the exported data is split to 5-minute blobs, analyzing data spanning multiple blobs can be cumbersome. This means that exporting data to a storage account is a good backup mechanism , but not intended specifically for analyzing it through Log Analytics - while the blogs can be accessed through Log Analytics [externaldata operator](/azure/data-explorer/kusto/query/externaldata-operator?pivots=azuremonitor) and therefore can be analyzed, analyzing data spanning multiple blobs can be cumbersome. If you wish to query high volumes of data you can [query the exported blobs through ADX](/azure/data-explorer/query-exported-azure-monitor-data), use [Azure Data Factory](/azure/data-factory/introduction#connect-and-collect) or any other storage access tool.

#### Export to Event Hub
-- TBD --

### Workspace replication (in private preview)
Workspace replication is a new capability, allowing you to replicate your workspace and future logs to a second region. You can choose your second region from a list of options, typically containing regions in the same or adjacent geographies. The original region of your workspace is referred to as the Primary region, and the region you choose to replicate to is referred to as Secondary region.
When workspace replication is enabled, a "shadow" copy of your workspace is created on the secondary region, with the same configuration as your main, primary workspace. Any changes to your workspace configuration are automatically synced to the secondary region. Note that you can't manage or directly access the secondary workspace, which is why we refer to it as "shadow workspace". It's only used for resiliency purposes.
Once Workspace replication is enabled, all logs ingested to your primary workspace are also sent (replicated at ingestion time) to your secondary region. Note that logs already ingested to your primary workspace before enabling this capability are not copied over.

In case an outage impacts Log Analytics on your primary region, you can trigger failover, which will make your secondary region active, instead of the primary. This means that all ingestion and query requests are rerouted to your secondary region. During the failover period, Log Analytics still attempts to ingest logs to both regions - primary and secondary. If the primary region isn't available, the logs will be buffered on the secondary region until the primary region can process them (up to 11 days).

Once the outage has been mitigated, you can trigger failback and return to their primary region.

Compared to [Agent dual homing](#agent-dual-homing), Workspace replication is likely a better resiliency capability:
 * Workspace replication handles all logs ingested to your workspace, regardless of their source (agents, APIs, custom logs, diagnostic logs etc.). Agent dual homing only handles logs sent from your agents.
 * Workspace replication doesn't require your agents or your queries to be updated, configured or aware of the replication or failover processes. Agent dual homing requires that you configure each agent to ingest to more than one workspace, and that you query both workspaces explicitly.
 * Workspace replication isn't free, but is significantly less costly than Agent dual homing.
 * Workspace replication provides better integration with partnering experiences and services. During failover:
     * Any querying client is completely unaware of the change and should continue working smoothly (e.g., alerts, query packs, dashboards, etc.)
     * Sentinel continues working against the secondary region.
 * Most Azure portal monitoring experiences will continue working. Note that when in failover mode, workspace management operations are intentionally blocked.

### Agent dual homing
The monitoring agents you use can target more than one workspace, which means you can actually send your data to different workspaces, located in different regions. This practice is called dual/multi-homing. It provides high availability, yet it also means you pay more since you ingest more data to your workspaces, in total.
The new Azure Monitor Agent (AMA) has offers better capabilities when it comes to dual homing, compared with the classic Microsoft Monitoring Agent (MMA):
 * Both Linux and Windows versions of AMA can be configured to target multiple workspaces, while the legacy MMA supports dual homing only on Windows.
 * Cost control and efficiency - instead of dual-ingesting all your data, you can:
     * Configure AMA to send only some data types to a second workspace.
     * Use [data collection transformations](../essentials/data-collection-transformations.md) to remove fields or filter out records you don't want to ingest to a second workspace (see [cost for transformations](../essentials/data-collection-transformations.md#cost-for-transformations) for more details). You can use transformations even if you don't use AMA.

Note that while it provides high availability, integration with other services and products is managed separately for each workspace. You may want to:
 * Create the same dashboards, queries, workbooks, alerts etc. in each of the regions.
 * Use queries that target both workspaces (using cross-workspace queries that [union with the isfuzzy=true option](/azure/data-explorer/kusto/query/unionoperator?pivots=azuremonitor)) and de-duplicate the results, because you'll get the same records twice when querying both workspaces, which can be quite cumbersome.
 
    Alternatively, you may prefer to use queries that target only a single workspace. If one of the regions is down, you'll still be able to use your queries through the second region. Note that resource-centric queries (log queries on a specific Azure resource, not targeting a specific workspace) will always return data from both workspace, which means you will need to de-duplicate the results.



### Configuration recommendations

| Recommendation | Benefit |
|:---|:---|
| If you collect enough data, create a dedicated cluster in a region that supports availability zones. | Workspaces linked to a [dedicated cluster](../logs/logs-dedicated-clusters.md) located in a region that supports [availability zones](../logs/availability-zones.md#data-resilience---supported-regions) remain available if a datacenter fails. |
| If you require the workspace to be available in the case of a region failure, or you don't collect enough data for a dedicated cluster, configure data collection to send critical data to multiple workspaces in different regions. | Configure your data sources to send to multiple workspaces in different regions. For example, configure DCRs for multiple workspaces for Azure Monitor agent running on virtual machines, and multiple diagnostic settings to collection resource logs from Azure resources. This configuration results in duplicate ingestion and retention charges so only use it for critical data.<br><br>Even though the data will be available in the alternate workspace in case of failure, resources that rely on the data such as alerts and workbooks wouldn't know to use this workspace. Consider storing ARM templates for critical resources with configuration for the alternate workspace in Azure DevOps or as disabled [policies](../../governance/policy/overview.md) that can quickly be enabled in a failover scenario. |
| If you require data to be protected in the case of datacenter or region failure, configure data export from the workspace to save data in an alternate location. | The [data export feature of Azure Monitor](../logs/logs-data-export.md) allows you to continuously export data sent to specific tables to Azure storage where it can be retained for extended periods. Use [Azure Storage redundancy options](../../storage/common/storage-redundancy.md#redundancy-in-a-secondary-region) including GRS and GZRS to replicate this data to other regions. If you require export of [tables that aren't supported by data export](../logs/logs-data-export.md?tabs=portal#limitations) then you can use other methods of exporting data including Logic apps to protect your data. This is primarily a solution to meet compliance for data retention since the data can be difficult to analyze and restore back to the workspace. |
| Create a health status alert rule for your Log Analytics workspace. | A [health status alert](../logs/log-analytics-workspace-health.md#view-log-analytics-workspace-health-and-set-up-health-status-alerts) will proactively notify you if a workspace becomes unavailable because of a datacenter or regional failure. |