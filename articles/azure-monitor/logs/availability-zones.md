---
title: Availability zones in Azure Monitor
description: Learn about the data and service resilience benefits Azure Monitor availability zones provide to protect against datacenter failure. 
ms.subservice: logs
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 06/05/2023
ms.custom: references_regions

#customer-intent: As an IT manager, I want to understand the data and service resilience benefits Azure Monitor availability zones provide so that can ensure my data and services are sufficiently protected in the event of datacenter failure.
---
# Enhance data and service resilience in Azure Monitor Logs with availability zones

[Azure availability zones](../../availability-zones/az-overview.md) protect applications and data from datacenter failures and can enhance the resilience of Azure Monitor features that rely on a Log Analytics workspace. This article describes the data and service resilience benefits Azure Monitor availability zones provide by default to [dedicated clusters](logs-dedicated-clusters.md) in supported regions.

## Prerequisites

- A Log Analytics workspace linked to a [dedicated cluster](logs-dedicated-clusters.md).  

    > [!NOTE]
    > Application Insights resources can use availability zones only if they're workspace-based and the workspace uses a dedicated cluster. Classic Application Insights resources can't use availability zones.
    
## Data resilience - supported regions

Availability zones protect your data from datacenter failures by relying on datacenters in different physical locations, equipped with independent power, cooling, and networking. 

Azure Monitor currently supports data resilience for availability-zone-enabled dedicated clusters in these regions:

  | Americas | Europe | Middle East | Africa | Asia Pacific |
  |---|---|---|---|---|
  | Brazil South | France Central | Qatar Central | South Africa North | Australia East |
  | Canada Central | Germany West Central | UAE North | | Central India | 
  | Central US | North Europe | | | Japan East |
  | East US | Norway East | | | Korea Central |
  | East US 2 | UK South | | | Southeast Asia |
  | South Central US | West Europe | | | East Asia |
  | West US 2 | Sweden Central | | |  |
  | West US 3 | Switzerland North | | |  |
  |  | Poland Central | | | |

## Service resilience - supported regions

When available in your region, Azure Monitor availability zones enhance your Azure Monitor service resilience automatically. Physical separation and independent infrastructure makes interruption of service availability in your Log Analytics workspace far less likely because the Log Analytics workspace can rely on resources from a different zone. 

Azure Monitor currently supports service resilience for availability-zone-enabled dedicated clusters in these regions:

- East US 2
- West US 2
- North Europe

## Next steps

Learn more about how to:
- [Set up a dedicated cluster](logs-dedicated-clusters.md).
- [Migrate Log Analytics workspaces to availability zone support](../../availability-zones/migrate-monitor-log-analytics.md).
