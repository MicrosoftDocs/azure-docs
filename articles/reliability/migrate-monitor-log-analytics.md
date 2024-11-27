---
title: Migrate Log Analytics Dedicated Cluster  workspaces to availability zone support 
description: Learn how to migrate Log Analytics Dedicated Cluster  workspaces to availability zone support.
author: anaharris-ms
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 09/19/2024
ms.author: noakuper
ms.custom: references_regions, subject-reliability
ms.subservice: logs
---

# Migrate Log Analytics Dedicated Cluster workspaces to availability zone support
 
This guide describes how to migrate dedicated cluster Log Analytics Dedicated Cluster workspaces from non-availability zone support to availability support. 

> [!NOTE]
> Application Insights resources can also use availability zones, but only if they are workspace-based and the workspace uses a dedicated cluster. Classic (non-workspace-based) Application Insights resources cannot use availability zones.


## Prerequisites

- This article applies to workspaces that use dedicated clusters. If your workspace isn’t using a dedicated cluster, it’s using a shared cluster, which is managed by the Log Analytics service. In regions that have availability zones, shared clusters use availability zones or are being migrated to use them. For more details, see [Log Analytics - Supported regions](/azure/azure-monitor/logs/availability-zones#supported-regions).

- Make sure that the region to which you wish to move is a region that supports availability zones. To see which regions support availability zones, see [supported regions](/azure/azure-monitor/logs/availability-zones#supported-regions).

## Downtime requirements

There are no downtime requirements.

## Migration process: Moving to a dedicated cluster

### Step 1: Determine the current cluster for your workspace

To determine the current workspace link status for your workspace, use [CLI, PowerShell, or REST](/azure/azure-monitor/logs/logs-dedicated-clusters#check-workspace-link-status) to retrieve the [cluster details](/azure/azure-monitor/logs/logs-dedicated-clusters#check-cluster-provisioning-status). If the cluster uses an availability zone, then it has a property called `isAvailabilityZonesEnabled` with a value of `true`. Once a cluster is created, this property cannot be altered.

### Step 2: Create a dedicated cluster with availability zone support

Move your workspace to an availability zone by [creating a new dedicated cluster](/azure/azure-monitor/logs/logs-dedicated-clusters#create-a-dedicated-cluster) in a region that supports availability zones. The cluster is automatically enabled for availability zones. Then [link your workspace to the new cluster](/azure/azure-monitor/logs/logs-dedicated-clusters#link-a-workspace-to-a-cluster).

> [!IMPORTANT]
> Availability zone is defined on the cluster at creation time and can’t be modified.

Transitioning to a new cluster can be a gradual process. Don't remove the previous cluster until it is purged of any data. For example, if your workspace retention is set 60 days, you may want to keep your old cluster running for that period before removing it.

Any queries against your workspace queries both clusters as required to provide you with a single, unified result set. As a result, all Azure Monitor features that rely on the workspace, such as workbooks and dashboards, continue to receive the full, unified result set based on data from both clusters.

## Billing
[Dedicated clusters](/azure/azure-monitor/logs/logs-dedicated-clusters#create-a-dedicated-cluster) require a commitment tier starting at 100 GB per day.

The new cluster isn’t billed during its first day to avoid double billing during configuration. Only the data ingested before the migration completes would still be billed on the date of migration. 


## Related content

Learn more about:

- [Relocate Log Analytics workspaces to another region](../operational-excellence/relocation-log-analytics.md)

- [Azure Monitor Logs Dedicated Clusters](/azure/azure-monitor/logs/logs-dedicated-clusters)

- [Azure services with availability zones](availability-zones-service-support.md)

- [Azure regions with availability zones](availability-zones-region-support.md)
