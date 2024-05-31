---
title: Migrate Log Analytics workspaces to availability zone support 
description: Learn how to migrate Log Analytics workspaces to availability zone support.
author: anaharris-ms
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 05/19/2024
ms.author: noakuper
ms.custom: references_regions, subject-reliability
---

# Migrate Log Analytics workspaces to availability zone support
 
This guide describes how to migrate Log Analytics workspaces from non-availability zone support to availability support. 

> [!NOTE]
> Application Insights resources can also use availability zones, but only if they are workspace-based and the workspace uses a dedicated cluster. Classic (non-workspace-based) Application Insights resources cannot use availability zones.


## Prerequisites

For availability zone support, your workspace must be located in one of the following supported regions:

- East US 2
- West US 2

## Dedicated clusters

Azure Monitor support for availability zones requires a Log Analytics workspace linked to an [Azure Monitor dedicated cluster](../azure-monitor/logs/logs-dedicated-clusters.md). Dedicated clusters are a deployment option that enables advanced capabilities for Azure Monitor Logs including availability zones.

Not all dedicated clusters can use availability zones. Dedicated clusters created after mid-October 2020 can be set to support availability zones when they are created. New clusters created after that date default to be enabled for availability zones in regions where Azure Monitor supports them.

## Downtime requirements

There are no downtime requirements.

## Migration process: Moving to a dedicated cluster

### Step 1: Determine the current cluster for your workspace

To determine the current workspace link status for your workspace, use [CLI, PowerShell, or REST](../azure-monitor/logs/logs-dedicated-clusters.md#check-workspace-link-status) to retrieve the [cluster details](../azure-monitor/logs/logs-dedicated-clusters.md#check-cluster-provisioning-status). If the cluster uses an availability zone, then it has a property called `isAvailabilityZonesEnabled` with a value of `true`. Once a cluster is created, this property cannot be altered.

### Step 2: Create a dedicated cluster with availability zone support

Move your workspace to an availability zone by [creating a new dedicated cluster](../azure-monitor/logs/logs-dedicated-clusters.md#create-a-dedicated-cluster) in a region that supports availability zones. The cluster is automatically enabled for availability zones. Then [link your workspace to the new cluster](../azure-monitor/logs/logs-dedicated-clusters.md#link-a-workspace-to-a-cluster).

> [!IMPORTANT]
> Availability zone is defined on the cluster at creation time and can’t be modified.

Transitioning to a new cluster can be a gradual process. Don't remove the previous cluster until it is purged of any data. For example, if your workspace retention is set 60 days, you may want to keep your old cluster running for that period before removing it.

Any queries against your workspace queries both clusters as required to provide you with a single, unified result set. As a result, all Azure Monitor features that rely on the workspace, such as workbooks and dashboards, continue to receive the full, unified result set based on data from both clusters.

## Billing
[Dedicated clustrs](../azure-monitor/logs/logs-dedicated-clusters.md#create-a-dedicated-cluster) require a commitment tier starting at 100 GB per day.

The new cluster isn’t billed during its first day to avoid double billing during configuration. Only the data ingested before the migration completes would still be billed on the date of migration. 


## Related content

Learn more about:

- [Relocate Log Analytics workspaces to another region](../operational-excellence/relocation-log-analytics.md)

- [Azure Monitor Logs Dedicated Clusters](../azure-monitor/logs/logs-dedicated-clusters.md)

- [Azure Services that support Availability Zones](availability-zones-service-support.md)
