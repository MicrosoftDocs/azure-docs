---
title: Maintenance Window
description: Understand how the Azure SQL Database and managed instance maintenance window can be configured.
services: sql-database
ms.service: sql-db-mi
ms.subservice: service-overview
ms.topic: conceptual
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: kendralittle, mathoma, urosmil
ms.custom: references_regions
ms.date: 04/04/2022
---

# Maintenance window
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

The maintenance window feature allows you to configure maintenance schedule for [Azure SQL Database](sql-database-paas-overview.md) and [Azure SQL Managed Instance](../managed-instance/sql-managed-instance-paas-overview.md) resources making impactful maintenance events predictable and less disruptive for your workload. 

> [!Note]
> The maintenance window feature only protects from planned impact from upgrades or scheduled maintenance. It does not protect from all failover causes; exceptions that may cause short connection interruptions outside of a maintenance window include hardware failures, cluster load balancing, and database reconfigurations due to events like a change in database Service Level Objective. 

[Advance notifications (Preview)](advance-notifications.md) are available for databases configured to use a non-default maintenance window. Advance notifications enable customers to configure notifications to be sent up to 24 hours in advance of any planned event. 

## Overview

Azure periodically performs [planned maintenance](planned-maintenance.md) of SQL Database and SQL managed instance resources. During Azure SQL maintenance event, databases are fully available but can be subject to short reconfigurations within respective availability SLAs for [SQL Database](https://azure.microsoft.com/support/legal/sla/azure-sql-database) and [SQL managed instance](https://azure.microsoft.com/support/legal/sla/azure-sql-sql-managed-instance).

Maintenance window is intended for production workloads that are not resilient to database or instance reconfigurations and cannot absorb short connection interruptions caused by planned maintenance events. By choosing a maintenance window you prefer, you can minimize the impact of planned maintenance as it will be occurring outside of your peak business hours. Resilient workloads and non-production workloads may rely on Azure SQL's default maintenance policy.

The maintenance window is free of charge and can be configured on creation or for existing Azure SQL resources. It can be configured using the Azure portal, PowerShell, CLI, or Azure API.

> [!Important]
> Configuring maintenance window is a long running asynchronous operation, similar to changing the service tier of the Azure SQL resource. The resource is available during the operation, except a short reconfiguration that happens at the end of the operation and typically lasts up to 8 seconds even in case of interrupted long-running transactions. To minimize the impact of the reconfiguration you should perform the operation outside of the peak hours.

### Gain more predictability with maintenance window

By default, Azure SQL maintenance policy blocks most impactful updates during the period **8AM to 5PM local time every day** to avoid any disruptions during typical peak business hours. Local time is determined by the location of [Azure region](https://azure.microsoft.com/global-infrastructure/geographies/) that hosts the resource and may observe daylight saving time in accordance with local time zone definition. 

You can further adjust the maintenance updates to a time suitable to your Azure SQL resources by choosing from two additional maintenance window slots:
 
* **Weekday** window: 10:00 PM to 6:00 AM local time, Monday - Thursday
* **Weekend** window: 10:00 PM to 6:00 AM local time, Friday - Sunday

Maintenance window days listed indicate the starting day of each eight-hour maintenance window. For example, "10:00 PM to 6:00 AM local time, Monday – Thursday" means that the maintenance windows start at 10:00 PM local time on each day (Monday through Thursday) and complete at 6:00 AM local time the following day (Tuesday through Friday).

Once the maintenance window selection is made and service configuration completed, planned maintenance will occur only during the window of your choice. While maintenance events typically complete within a single window, some of them may span two or more adjacent windows.   

> [!Important]
> In very rare circumstances where any postponement of action could cause serious impact, like applying critical security patch, configured maintenance window may be temporarily overriden. 

## Advance notifications

Maintenance notifications can be configured to alert you of upcoming planned maintenance events for your Azure SQL Database and Azure SQL Managed Instance. The alerts arrive 24 hours in advance, at the time of maintenance, and when the maintenance is complete. For more information, see [Advance Notifications](advance-notifications.md).

## Feature availability

### Supported subscription types

Configuring and using maintenance window is available for the following [offer types](https://azure.microsoft.com/support/legal/offer-details/): Pay-As-You-Go, Cloud Solution Provider (CSP), Microsoft Enterprise Agreement, or Microsoft Customer Agreement.  

Offers restricted to dev/test usage only are not eligible (like Pay-As-You-Go Dev/Test or Enterprise Dev/Test as examples).

> [!Note]
> An Azure offer is the type of the Azure subscription you have. For example, a subscription with [pay-as-you-go rates](https://azure.microsoft.com/offers/ms-azr-0003p/), [Azure in Open](https://azure.microsoft.com/offers/ms-azr-0111p/), and [Visual Studio Enterprise](https://azure.microsoft.com/offers/ms-azr-0063p/) are all Azure offers. Each offer or plan has different terms and benefits. Your offer or plan is shown on the subscription's Overview. For more information on switching your subscription to a different offer, see [Change your Azure subscription to a different offer](../../cost-management-billing/manage/switch-azure-offer.md).

### Supported service level objectives

Choosing a maintenance window other than the default is available on all SLOs **except for**:
* Instance pools
* Legacy Gen4 vCore
* Basic, S0 and S1 
* DC, Fsv2, M-series

### Azure region support

Choosing a maintenance window other than the default is currently available in the following regions:

| Azure Region | SQL Managed Instance | SQL Database | SQL Database in an [Azure Availability Zone](high-availability-sla.md) | 
|:---|:---|:---|:---|
| Australia Central 1 | Yes | | |
| Australia Central 2 | Yes | | |
| Australia East | Yes | Yes | Yes |
| Australia Southeast | Yes | Yes | |
| Brazil South | Yes | Yes |  |
| Brazil Southeast | Yes | Yes |  |
| Canada Central | Yes | Yes | Yes |
| Canada East | Yes | Yes | |
| Central India | Yes | Yes | |
| Central US | Yes | Yes | Yes |
| China East 2 |Yes | Yes ||
| China North 2 |Yes|Yes ||
| East US | Yes | Yes | Yes |
| East US 2 | Yes | Yes | Yes |
| East Asia | Yes | Yes | |
| France Central | Yes | Yes | |
| France South | Yes | Yes | |
| Germany West Central | Yes | Yes |  |
| Germany North | Yes |  |  |
| Japan East | Yes | Yes | Yes |
| Japan West | Yes | Yes | |
| Korea Central | Yes | | |
| Korea South | Yes | | |
| North Central US | Yes | Yes | |
| North Europe | Yes | Yes | Yes |
| Norway East | Yes | | |
| Norway West | Yes | | |
| South Africa North | Yes | | | 
| South Africa West | Yes | | | 
| South Central US | Yes | Yes | Yes |
| South India | Yes | Yes | |
| Southeast Asia | Yes | Yes | Yes |
| Switzerland North | Yes | Yes | |
| Switzerland West | Yes | | |
| UAE Central | Yes | | |
| UAE North | Yes | | |
| UK South | Yes | Yes | Yes |
| UK West | Yes | Yes | |
| US Gov Arizona | Yes | | |
| US Gov Texas| Yes | Yes | | 
| US Gov Virginia | Yes | Yes | | 
| West Central US | Yes | Yes | |
| West Europe | Yes | Yes | Yes |
| West India | Yes | | |
| West US | Yes | Yes |  |
| West US 2 | Yes | Yes | Yes |
| West US 3 | Yes | | |


## Gateway maintenance

To get the maximum benefit from maintenance windows, make sure your client applications are using the redirect connection policy. Redirect is the recommended connection policy, where clients establish connections directly to the node hosting the database, leading to reduced latency and improved throughput.  

* In Azure SQL Database, any connections using the proxy connection policy could be affected by both the chosen maintenance window and a gateway node maintenance window. However, client connections using the recommended redirect connection policy are unaffected by a gateway node maintenance reconfiguration. 

* In Azure SQL Managed Instance, the gateway nodes are hosted [within the virtual cluster](../../azure-sql/managed-instance/connectivity-architecture-overview.md#virtual-cluster-connectivity-architecture) and have the same maintenance window as the managed instance, but using the redirect connection policy is still recommended to minimize number of disruptions during the maintenance event.

For more on the client connection policy in Azure SQL Database, see [Azure SQL Database Connection policy](../database/connectivity-architecture.md#connection-policy). 

For more on the client connection policy in Azure SQL Managed Instance, see [Azure SQL Managed Instance connection types](../../azure-sql/managed-instance/connection-types-overview.md).

## Considerations for Azure SQL Managed Instance

Azure SQL Managed Instance consists of service components hosted on a dedicated set of isolated virtual machines that run inside the customer's virtual network subnet. These virtual machines form [virtual cluster(s)](../managed-instance/connectivity-architecture-overview.md#high-level-connectivity-architecture) that can host multiple managed instances. Maintenance window configured on instances of one subnet can influence the number of virtual clusters within the subnet, distribution of instances among virtual clusters, and virtual cluster management operations. This may require a consideration of few effects.

### Maintenance window configuration is a long running operation 
All instances hosted in a virtual cluster share the maintenance window. By default, all managed instances are hosted in the virtual cluster with the default maintenance window. Specifying another maintenance window for managed instance during its creation or afterwards means that it must be placed in virtual cluster with corresponding maintenance window. If there is no such virtual cluster in the subnet, a new one must be created first to accommodate the instance. Accommodating additional instance in the existing virtual cluster may require cluster resize. Both operations contribute to the duration of configuring maintenance window for a managed instance.
Expected duration of configuring maintenance window on managed instance can be calculated using [estimated duration of instance management operations](../managed-instance/management-operations-overview.md#duration).

> [!Important]
> A short reconfiguration happens at the end of the operation of configuring maintenance window  and typically lasts up to 8 seconds even in case of interrupted long-running transactions. To minimize the impact of the reconfiguration, initiate the operation outside of the peak hours.

### IP address space requirements
Each new virtual cluster in subnet requires additional IP addresses according to the [virtual cluster IP address allocation](../managed-instance/vnet-subnet-determine-size.md#determine-subnet-size). Changing maintenance window for existing managed instance also requires [temporary additional IP capacity](../managed-instance/vnet-subnet-determine-size.md#update-scenarios) as in scaling vCores scenario for corresponding service tier.

### IP address change
Configuring and changing maintenance window causes change of the IP address of the instance, within the IP address range of the subnet.

> [!Important]
>  Make sure that NSG and firewall rules won't block data traffic after IP address change. 

### Serialization of virtual cluster management operations

Operations affecting the virtual cluster, like service upgrades and virtual cluster resize (adding new or removing unneeded compute nodes) are serialized. In other words, a new virtual cluster management operation cannot start until the previous one is completed. In case that maintenance window closes before the ongoing service upgrade or maintenance operation is completed, any other virtual cluster management operations submitted in the meantime will be put on hold until next maintenance window opens and service upgrade or maintenance operation completes. It is not common for a maintenance operation to take longer than a single window per virtual cluster, but it can happen in case of very complex maintenance operations.

The serialization of virtual cluster management operations is general behavior that applies to the default maintenance policy as well. With a maintenance window schedule configured, the period between two adjacent windows can be few days long. Submitted operations can also be on hold for few days if the maintenance operation spans two windows. That is very rare case, but creation of new instances or resize of the existing instances (if additional compute nodes are needed) may be blocked during this period.

## Retrieving list of maintenance events

[Azure Resource Graph](../../governance/resource-graph/overview.md) is an Azure service designed to extend Azure Resource Management. The Azure Resource Graph Explorer provides efficient and performant resource exploration with the ability to query at scale across a given set of subscriptions so that you can effectively govern your environment. 

You can use the Azure Resource Graph Explorer to query for maintenance events. For an introduction on how to run these queries, see [Quickstart: Run your first Resource Graph query using Azure Resource Graph Explorer](../../governance/resource-graph/first-query-portal.md).

To check for the maintenance events for all SQL databases in your subscription, use the following sample query in Azure Resource Graph Explorer:

```kusto
servicehealthresources
| where type =~ 'Microsoft.ResourceHealth/events'
| extend impact = properties.Impact
| extend impactedService = parse_json(impact[0]).ImpactedService
| where  impactedService =~ 'SQL Database'
| extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = todatetime(tolong(properties.ImpactStartTime)), impactMitigationTime = todatetime(tolong(properties.ImpactMitigationTime))
| where eventType == 'PlannedMaintenance'
| order by impactStartTime desc
```

To check for the maintenance events for all managed instances in your subscription, use the following sample query in Azure Resource Graph Explorer:

```kusto
servicehealthresources
| where type =~ 'Microsoft.ResourceHealth/events'
| extend impact = properties.Impact
| extend impactedService = parse_json(impact[0]).ImpactedService
| where  impactedService =~ 'SQL Managed Instance'
| extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = todatetime(tolong(properties.ImpactStartTime)), impactMitigationTime = todatetime(tolong(properties.ImpactMitigationTime))
| where eventType == 'PlannedMaintenance'
| order by impactStartTime desc
```

For the full reference of the sample queries and how to use them across tools like PowerShell or Azure CLI, visit [Azure Resource Graph sample queries for Azure Service Health](../../service-health/resource-graph-samples.md). 

## Next steps

* [Configure maintenance window](maintenance-window-configure.md)
* [Advance notifications](advance-notifications.md)

## Learn more

* [Maintenance window FAQ](maintenance-window-faq.yml)
* [Azure SQL Database](sql-database-paas-overview.md) 
* [Azure SQL Managed Instance](../managed-instance/sql-managed-instance-paas-overview.md)
* [Plan for Azure maintenance events in Azure SQL Database and Azure SQL Managed Instance](planned-maintenance.md)
