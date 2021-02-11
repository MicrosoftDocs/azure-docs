---
title: Maintenance Window
description: Understand how the Azure SQL Database and Managed Instance maintenance window can be configured.
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.topic: reference
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: sstein
ms.custom: references_regions
ms.date: 02/11/2021
---

# Maintenance window (Preview)
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

The maintenance window feature allows for the configuration of predictable maintenance window schedules for [Azure SQL Database](sql-database-paas-overview.md) and [SQL managed instance](../managed-instance/sql-managed-instance-paas-overview.md). 

For more information on maintenance events, see [Plan for Azure maintenance events in Azure SQL Database and Azure SQL Managed Instance](planned-maintenance.md).

## Overview

Azure performs planned maintenance updates on Azure SQL Database and SQL Managed Instance resources periodically that often include updates to underlying hardware, software including underlying operating system (OS), and the SQL engine. During a maintenance update, resources are fully available and accessible but some of the maintenance updates require a failover as Azure takes instances offline for a short time to apply the maintenance updates (eight seconds in duration on average).  Planned maintenance updates occur once every 35 days on average, which means customer can expect approximately one planned maintenance event per month per Azure SQL Database or SQL managed instance, and only during the maintenance window slots selected by the customer.   

The maintenance window is intended for business workloads that are sensitive to the potential connectivity interruptions that can result from planned maintenance events during the default window.  

The maintenance window can be configured using the Azure portal, PowerShell, CLI, or Azure API. It can be configured on creation or for existing SQL databases and SQL managed instances.

### Gain more predictability with maintenance window

By default, all Azure SQL Databases and managed instance databases are updated only during 5PM to 8AM local times daily to avoid peak business hours interruptions. Local time is determined by the [Azure region](https://azure.microsoft.com/global-infrastructure/geographies/) that hosts the resource. You can further adjust the maintenance updates to a time suitable to your database by choosing from two additional maintenance window slots:

* **Default** window, 5PM to 8AM local time Mon-Sunday 
* Weekday window, 10PM to 6AM local time Monday – Thursday: **Requires customer opt-in** 
* Weekend window, 10PM to 6AM local time Friday - Sunday: **Requires customer opt-in**  

Once the maintenance window selection is made, all planned maintenance updates will only occur during the window of your choice.   

> [!Note]
> In addition to planned maintenance updates, in rare circumstances unplanned maintenance events can cause unavailability. 

### Cost

Choosing a maintenance window is free of charge for the following subscription [offer types](https://azure.microsoft.com/support/legal/offer-details/): Pay-As-You-Go, Cloud Solution Provider (CSP), Microsoft Enterprise, or Microsoft Customer Agreement.

> [!Note]
> An Azure offer is the type of the Azure subscription you have. For example, a subscription with [pay-as-you-go rates](https://azure.microsoft.com/offers/ms-azr-0003p/), [Azure in Open](https://azure.microsoft.com/en-us/offers/ms-azr-0111p/), and [Visual Studio Enterprise](https://azure.microsoft.com/en-us/offers/ms-azr-0063p/) are all Azure offers. Each offer or plan has different terms and benefits. Your offer or plan is shown on the subscription's Overview. For more information on switching your subscription to a different offer, see [Change your Azure subscription to a different offer](/azure/cost-management-billing/manage/switch-azure-offer).

## Advance notifications

Maintenance notifications can be configured to alert customers on upcoming planned maintenance events 24 hours in advance, at the time of maintenance, and when the maintenance window is complete. For more information, see [Advance Notifications](advance-notifications.md).

## Availability

### Supported service level objectives

Choosing a maintenance window other than the default is available on all SLOs **except for**:
* Hyperscale 
* Legacy Gen4 vCore
* DTU S0 and S1 

### Azure region support

Choosing a maintenance window other than the default is currently available in the following regions:

- Australia East
- Australia SouthEast
- Brazil South
- Canada Central
- Central US
- East US
- East US2
- Japan East
- NorthCentral US
- North Europe
- SouthCentral US
- SouthEast Asia
- UK South
- West Europe
- West US
- West US2

## Next steps

* [Configure maintenance window](maintenance-window-configure.md)
* [Advance notifications](advance-notifications.md)

## Learn more

* [Maintenance window FAQ](maintenance-window-faq.yml)
* [Azure SQL Database](sql-database-paas-overview.md) 
* [SQL Managed Instance](../managed-instance/sql-managed-instance-paas-overview.md)
* [Plan for Azure maintenance events in Azure SQL Database and Azure SQL Managed Instance](planned-maintenance.md)




