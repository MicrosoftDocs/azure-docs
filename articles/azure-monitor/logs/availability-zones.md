---
title: Availability zones in Azure Monitor
description: Learn about the data and service resiliency benefits Azure Monitor availability zones provide by default to dedicated clusters in supported regions. 
ms.subservice: logs
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 08/18/2021
ms.custom: references_regions
---

# Availability zones in Azure Monitor

[Azure availability zones](../../availability-zones/az-overview.md) protect your applications and data from datacenter failures and can provide resilience for Azure Monitor features that rely on a Log Analytics workspace. This article describes the data and service resiliency benefits Azure Monitor availability zones provide by default to [dedicated clusters](logs-dedicated-clusters.md) in supported regions.

## Prerequisites

- A Log Analytics workspaces linked to a [dedicated cluster](logs-dedicated-clusters.md).  

    > [!NOTE]
    > Application Insights resources can use availability zones only if they're workspace-based and the workspace uses a dedicated cluster. Classic Application Insights resources can't use availability zones.
    
## Data resiliency - supported regions

Availability zones protect your data from datacenter failures by relying on datacenters in different physical locations, equipped with independent power, cooling, and networking. 

Azure Monitor currently supports data resiliency for availability-zone-enabled dedicated clusters in these regions:

  | Americas | Europe | Middle East | Africa | Asia Pacific |
  |---|---|---|---|---|
  | Brazil South | France Central | UAE North | South Africa North | Australia East |
  | Canada Central | Germany West Central | | | Central India |
  | Central US | North Europe | | | Japan East |
  | East US | Norway East | | | Korea Central |
  | East US 2 | UK South | | | Southeast Asia |
  | South Central US | West Europe | | | East Asia |
  | US Gov Virginia | Sweden Central | | | China North 3 |
  | West US 2 | Switzerland North | | | |
  | West US 3 | | | | |

## Service resiliency - supported regions

When available in your region, Azure Monitor availability zones enhance your Azure Monitor service resiliency automatically. Physical separation and independent infrastructure makes interruption of service availability in your Log Analytics workspace far less likely because the Log Analytics workspace can rely on resources from a different zone. 

Azure Monitor currently supports service resiliency for availability-zone-enabled dedicated clusters in these regions:

- East US 2
- West US 2
- Canada Central
- France Central
- Japan East

## Create dedicated cluster with availability zone
Move your workspace to an availability zone by [creating a new dedicated cluster](logs-dedicated-clusters.md#create-a-dedicated-cluster) in a region that supports availability zones. The cluster will automatically be enabled for availability zones. Then [link your workspace to the new cluster](logs-dedicated-clusters.md#link-a-workspace-to-a-cluster).

> [!IMPORTANT]
> Availability zone is defined on the cluster at creation time and can’t be modified.

Transitioning to a new cluster can be a gradual process. Don't remove the previous cluster until it has been purged of any data. For example, if your workspace retention is set 60 days, you may want to keep your old cluster running for that period before removing it. To learn more, see [Migrate Log Analytics workspaces to availability zone support](../../availability-zones/migrate-monitor-log-analytics.md).

Any queries against your workspace will query both clusters to provide you with a single, unified result set. This allows Azure Monitor experiences, such as workbooks and dashboards, to keep getting the full result set, based on data from both clusters.

## Next steps

- See [Using queries in Azure Monitor Log Analytics](queries.md) to see how users interact with query packs in Log Analytics.
- See [Migrate Log Analytics workspaces to availability zone support](../../availability-zones/migrate-monitor-log-analytics.md).
