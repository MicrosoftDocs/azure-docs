---
title: Availability zones in Azure Monitor
description: Availability zones in Azure Monitor 
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 08/16/2021

---

# Availability zones in Azure Monitor

[Azure Availability Zones](../availability-zones/az-overview.md) protect your applications and data from datacenter failures. Azure regions are made of datacenters, inter-connected through a regional low-latency network. Availability zones are datacenters in separate physical locations and equipped with independent power, cooling, and networking. This independent infrastructure and physical separation of zones makes an incident far less likely since the workspace can rely on the resources from any of the zones. 

In Azure Monitor, Availability Zones can provide resilience to your Log Analytics workspaces. Azure Monitor is made of various services and resources, enabling the ingestion and analysis of logs and metrics. Supporting Availability Zones means Azure Monitor remains active and operational even if a specific zone is malfunctioning or completely down, by relying on the availability of other zones in the region. 

## Regions
See [Regions and Availability Zones in Azure](https://azure.microsoft.com/global-infrastructure/geographies/#geographies) for the Azure regions that have Availability Zones.

Azure Monitor currently supports the following regions. Additional regions will gradually support availability zones in coming months.

- East US 2
- West US 2


## What should I do in case of an incident?
You don’t need to do anything in order to switch to an alternative zone, or even be aware of the incident. The process is done automatically and seamlessly.

## Dedicated clusters
Azure Monitor support for Availability Zones requires a Log Analytics workspace linked to an [Azure Monitor Logs Dedicated Cluster](logs-dedicated-clusters.md). By default, workspaces use shared clusters. Dedicated Clusters are a deployment option that enables advanced capabilities for Azure Monitor Logs. 

Not all dedicated clusters can use Availability Zones. Dedicated clusters created after mid-October 2020 can be set to support Availability Zones when they are created. New clusters created after that date default to be Availability Zone-enabled in regions where Azure Monitor supports them.


> [!NOTE]
> Application Insights resources can use Availability Zones only if they are workspace-based and the workspace uses a dedicated cluster. Classic Application Insights resources cannot use Availability Zones.

## Determine current cluser for your workspace
Use [CLI, PowerShell or REST](logs-dedicated-clusters.md#check-workspace-link-status) to retrieve the [cluster details](logs-dedicated-clusters.md#check-cluster-provisioning-status) for your workspace. to determine the current workspace link status for your workspace.

To check which cluster your workspace is linked to,  get the workspace object via CLI, PowerShell or REST. Then, get the cluster details. 
Workspaces that use shared clusters or dedicated clusters created not supporting AZ, should create a new dedicated cluster and connect to it as explained here. 

## Move to an Availabilty Zone dedicated cluster
Implement Availability Zones for your workspace by creating a new dedicated cluster or 

### New dedicated cluster
When you create a [new dedicated cluster](logs-dedicated-clusters.md#creating-a-cluster) in a region that supports Availability Zones, it will automatically be enaled 

. The cluster you create will default to be AZ-enabled, meaning it’s isAvailabilityZonesEnabled property will be set to True in regions where Azure Data Explorer support Availability Zones. Once the cluster is created, this property cannot be altered.

After the cluster creation is done, link your workspace to the new cluster. At this stage new data ingested to the workspaces will be stored on the new cluster while old data remains as is on the old cluster. At the moment, there is no migration mechanism to move data between the clusters. 



Transitioning to a new cluster can be a gradual process. If you wish to keep accessing data that’s been ingested to the old cluster (be it shared or dedicated) it must remain alive. For example, if your workspace retention is 60 days, you may wish to keep your old cluster running for that period.

Querying data from both clusters is done seamlessly – queries running on your workspace will query both clusters as needed (according to the queried time range) and stitch the data to provide you with a single, unified result set. That means that all experiences relying on your workspace (such as workbooks, dashboards etc.) will keep getting the full, unified result set based on data from both clusters.

## Pricing
If you already have a dedicated cluster and choose to keep it alive to access the data it stores, you’ll be charged for both dedicated clusters. Starting August 4, 2021, the minimum required capacity reservation for dedicated clusters will be reduced to 500GB/Daily, so we’d recommend applying that minimum to your old cluster to reduce charges.

The new cluster isn’t billed during the first day to avoid double-billing. As a result, only the data ingested before the migration completes would still be billed on the date of migration. 

There is a [cost for using a dedicated cluster](logs-dedicated-clusters.md#creating-a-cluster). It requires a daily capacity reservation of 1000 GB. This will be reduced on August 4th, 2021 to 500 GB. 


## Next steps

- See [Using queries in Azure Monitor Log Analytics](queries.md) to see how users interact with query packs in Log Analytics.


A cluster created with an Availability Zone is indicated with `isAvailabilityZonesEnabled`: `true` and your data is stored protected in ZRS storage type. Availability Zone is defined in the cluster at creation time and this setting can’t be modified. To have a cluster in Availability Zone, you need to create a new cluster in supported regions.