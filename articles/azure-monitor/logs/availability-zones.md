---
title: Availability zones in Azure Monitor
description: Availability zones in Azure Monitor 
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 08/18/2021
ms.custom: references_regions
---

# Availability zones in Azure Monitor

[Azure availability zones](../../availability-zones/az-overview.md) protect your applications and data from datacenter failures and can provide resilience for Azure Monitor features such as Application Insights and any other feature that relies on a Log Analytics workspace. When a workspace is linked to an availability zone, it remains active and operational even if a specific datacenter is malfunctioning or completely down, by relying on the availability of other zones in the region. You don’t need to do anything in order to switch to an alternative zone, or even be aware of the incident. 


## Regions
Azure Monitor currently supports the following regions:
- East US 2
- West US 2

## Dedicated clusters
Azure Monitor support for availability zones requires a Log Analytics workspace linked to an [Azure Monitor dedicated cluster](logs-dedicated-clusters.md). Dedicated Clusters are a deployment option that enables advanced capabilities for Azure Monitor Logs including availability zones.

Not all dedicated clusters can use availability zones. Dedicated clusters created after mid-October 2020 can be set to support availability zones when they are created. New clusters created after that date default to be enabled for availability zones in regions where Azure Monitor supports them.


> [!NOTE]
> Application Insights resources can use availability zones only if they are workspace-based and the workspace uses a dedicated cluster. Classic Application Insights resources cannot use availability zones.


## Determine current cluster for your workspace
To determine the current workspace link status for your workspace, use [CLI, PowerShell or REST](logs-dedicated-clusters.md#check-workspace-link-status) to retrieve the [cluster details](logs-dedicated-clusters.md#check-cluster-provisioning-status). If the cluster uses an availability zone, then it will have a property called `isAvailabilityZonesEnabled` with a value of `true`. Once a cluster is created, this property cannot be altered.

## Create dedicated cluster with availability zone
Move your workspace to an availability zone by [creating a new dedicated cluster](logs-dedicated-clusters.md#create-a-dedicated-cluster) in a region that supports availability zones. The cluster will automatically be enabled for availability zones. Then [link your workspace to the new cluster](logs-dedicated-clusters.md#link-a-workspace-to-a-cluster).

> [!IMPORTANT]
> Availability zone is defined on the cluster at creation time and can’t be modified.

Transitioning to a new cluster can be a gradual process. Don't remove the previous cluster until it has been purged of any data. For example, if your workspace retention is set 60 days, you may want to keep your old cluster running for that period before removing it.

Any queries against your workspace will query both clusters as required to provide you with a single, unified result set. That means that all Azure Monitor features relying on the workspace such as workbooks and dashboards will keep getting the full, unified result set based on data from both clusters.

## Billing
There is a [cost for using a dedicated cluster](logs-dedicated-clusters.md#create-a-dedicated-cluster). It requires a daily capacity reservation of 500 GB. 

If you already have a dedicated cluster and choose to retain it to access its data, you’ll be charged for both dedicated clusters. Starting August 4, 2021, the minimum required capacity reservation for dedicated clusters is reduced from 1000GB/Daily to 500GB/Daily, so we’d recommend applying that minimum to your old cluster to reduce charges.

The new cluster isn’t billed during its first day to avoid double billing during configuration. Only the data ingested before the migration completes would still be billed on the date of migration. 


## Next steps

- See [Using queries in Azure Monitor Log Analytics](queries.md) to see how users interact with query packs in Log Analytics.

