---
title: Availability zones in Azure Monitor
description: Learn about the data and service resilience benefits Azure Monitor availability zones provide to protect against datacenter failure. 
ms.subservice: logs
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 06/05/2023
ms.custom: references_regions

# Customer intent: As an IT manager, I want to understand the data and service resilience benefits Azure Monitor availability zones provide to ensure my data and services are sufficiently protected in the event of datacenter failure.
---
# Enhance data and service resilience in Azure Monitor Logs with availability zones

[Azure availability zones](../../reliability/availability-zones-overview.md) protect applications and data from datacenter failures and can enhance the resilience of Azure Monitor features that rely on a Log Analytics workspace. This article describes the data and service resilience benefits Azure Monitor availability zones provide by default to [dedicated clusters](logs-dedicated-clusters.md) in supported regions.

## Prerequisites

- A Log Analytics workspace linked to a [dedicated cluster](logs-dedicated-clusters.md).  

    > [!NOTE]
    > Application Insights resources can use availability zones only if they're workspace-based and the workspace uses a dedicated cluster. Classic Application Insights resources can't use availability zones.

## How availability zones enhance data and service resilience in Azure Monitor Logs

Each Azure region that supports availability zones is made of one or more datacenters, or zones, equipped with independent power, cooling, and networking infrastructure. 

Azure Monitor Logs availability zones are [zone-redundant](../../reliability/availability-zones-overview.md#zonal-and-zone-redundant-services), which means that Microsoft manages spreading service requests and replicating data across different zones in supported regions. If one zone is affected by an incident, Microsoft manages failover to a different availability zone in the region automatically. You don't need to take any action because switching between zones is seamless. 

A subset of the availability zones that support data resilience currently also support service resilience for Azure Monitor Logs, as listed in the [Service resilience - supported regions](#service-resilience---supported-regions) section. In regions that support service resilience, Azure Monitor Logs service operations - for example, log ingestion, queries, and alerts - can continue in the event of a zone failure. In regions that only support data resilience, your stored data is protected against zonal failures, but service operations might be impacted by regional incidents.

    
## Supported regions

Azure Monitor creates Log Analytics workspaces in a shared cluster, unless you [set up a dedicated cluster](../logs/logs-dedicated-clusters.md) for your workspaces.

All shared clusters in the following regions use availability zones. If your workspace is in one of these regions, Azure Monitor replicates your logs across the region-specific zones, as of January 2024.

When available in your region, Azure Monitor availability zones enhance your Azure Monitor service resilience automatically. Physical separation and independent infrastructure makes interruption of service availability in your Log Analytics workspace far less likely because the Log Analytics workspace can rely on resources from a different zone. 

> [!NOTE]
> Moving to a dedicated cluster in a region that supports availablility zones protects data ingested after the move, not historical data.


|	Region	|	Data resilience - Shared clusters (default)	|	Data resilience - Dedicated clusters	|	Service resilience	|
|	---	|	---	|	---	|	---	|
|	**Africa**	|		|		|		|
|	South Africa North	|		|	:white_check_mark:	|		|
|	**Americas**	|		|		|		|
|	Brazil South	|		|	:white_check_mark:	|		|
|	Canada Central	|	:white_check_mark:	|	:white_check_mark:	|		|
|	Central US	|		|	:white_check_mark:	|		|
|	East US	|		|	:white_check_mark:	|		|
|	East US 2	|		|	:white_check_mark:	|	:white_check_mark:	|
|	South Central US	|	:white_check_mark:	|	:white_check_mark:	|		|
|	West US 2	|		|	:white_check_mark:	|	:white_check_mark:	|
|	West US 3	|	:white_check_mark:	|	:white_check_mark:	|		|
|	**Asia Pacific**	|		|		|		|
|	Australia East	|	:white_check_mark:	|	:white_check_mark:	|		|
|	Central India	|	:white_check_mark:	|	:white_check_mark:	|		|
|	East Asia	|		|	:white_check_mark:	|		|
|	Japan East	|		|	:white_check_mark:	|		|
|	Korea Central	|		|	:white_check_mark:	|		|
|	Southeast Asia	|	:white_check_mark:	|	:white_check_mark:	|		|
|	**Europe**	|		|		|		|
|	France Central	|	:white_check_mark:	|	:white_check_mark:	|		|
|	Germany West Central	|		|	:white_check_mark:	|		|
|	Italy North	|	:white_check_mark:	|	:white_check_mark:	|	:white_check_mark:	|
|	North Europe	|	:white_check_mark:	|	:white_check_mark:	|		|
|	Norway East	|	:white_check_mark:	|	:white_check_mark:	|		|
|	Poland Central	|		|	:white_check_mark:	|		|
|	Sweden Central	|	:white_check_mark:	|	:white_check_mark:	|		|
|	Switzerland North	|		|	:white_check_mark:	|		|
|	UK South	|	:white_check_mark:	|	:white_check_mark:	|		|
|	West Europe	|		|	:white_check_mark:	|		|
|	**Middle East**	|		|		|		|
|	Israel Central	|	:white_check_mark:	|	:white_check_mark:	|	:white_check_mark:	|
|	Qatar Central	|		|	:white_check_mark:	|		|
|	UAE North	|	:white_check_mark:	|	:white_check_mark:	|		|


## Next steps

Learn more about how to:
- [Set up a dedicated cluster](logs-dedicated-clusters.md).
- [Migrate Log Analytics workspaces to availability zone support](../../availability-zones/migrate-monitor-log-analytics.md).
