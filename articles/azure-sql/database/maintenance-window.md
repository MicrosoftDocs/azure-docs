---
title: Maintenance Window
description: Understand how the Azure SQL Database and managed instance maintenance window can be configured.
services: sql-database
ms.service: sql-db-mi
ms.subservice: service
ms.topic: conceptual
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: sstein
ms.custom: references_regions
ms.date: 03/23/2021
---

# Maintenance window (Preview)
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

The maintenance window feature allows you to configure maintenance schedule for [Azure SQL Database](sql-database-paas-overview.md) and [Azure SQL managed instance](../managed-instance/sql-managed-instance-paas-overview.md) resources making impactful maintenance events predictable and less disruptive for your workload. 

> [!Note]
> Maintenance window feature does not protect from unplanned events, like hardware failures, that may cause short connection interruptions.

## Overview

Azure periodically performs [planned maintenance](planned-maintenance.md) of SQL Database and SQL managed instance resources. During Azure SQL maintenance event, databases are fully available but can be subject to short reconfigurations within respective availability SLAs for [SQL Database](https://azure.microsoft.com/support/legal/sla/sql-database) and [SQL managed instance](https://azure.microsoft.com/support/legal/sla/azure-sql-sql-managed-instance).

Maintenance window is intended for production workloads that are not resilient to database or instance reconfigurations and cannot absorb short connection interruptions caused by planned maintenance events. By choosing a maintenance window you prefer, you can minimize the impact of planned maintenance as it will be occurring outside of your peak business hours. Resilient workloads and non-production workloads may rely on Azure SQL's default maintenance policy.

The maintenance window can be configured on creation or for existing Azure SQL resources. It can be configured using the Azure portal, PowerShell, CLI, or Azure API.

> [!Important]
> Configuring maintenance window is a long running asynchronous operation, similar to changing the service tier of the Azure SQL resource. The resource is available during the operation, except a short reconfiguration that happens at the end of the operation and typically lasts up to 8 seconds even in case of interrupted long-running transactions. To minimize the impact of the reconfiguration you should perform the operation outside of the peak hours.

### Gain more predictability with maintenance window

By default, Azure SQL maintenance policy blocks impactful updates during the period **8AM to 5PM local time every day** to avoid any disruptions during typical peak business hours. Local time is determined by the location of [Azure region](https://azure.microsoft.com/global-infrastructure/geographies/) that hosts the resource and may observe daylight saving time in accordance with local time zone definition. 

You can further adjust the maintenance updates to a time suitable to your Azure SQL resources by choosing from two additional maintenance window slots:
 
* Weekday window, 10PM to 6AM local time Monday - Thursday
* Weekend window, 10PM to 6AM local time Friday - Sunday

Once the maintenance window selection is made and service configuration completed, planned maintenance will occur only during the window of your choice.   

> [!Important]
> In very rare circumstances where any postponement of action could cause serious impact, like applying critical security patch, configured maintenance window may be temporarily overriden. 

### Cost and eligibility

Configuring and using maintenance window is free of charge for all eligible [offer types](https://azure.microsoft.com/support/legal/offer-details/): Pay-As-You-Go, Cloud Solution Provider (CSP), Microsoft Enterprise Agreement, or Microsoft Customer Agreement.

> [!Note]
> An Azure offer is the type of the Azure subscription you have. For example, a subscription with [pay-as-you-go rates](https://azure.microsoft.com/offers/ms-azr-0003p/), [Azure in Open](https://azure.microsoft.com/offers/ms-azr-0111p/), and [Visual Studio Enterprise](https://azure.microsoft.com/offers/ms-azr-0063p/) are all Azure offers. Each offer or plan has different terms and benefits. Your offer or plan is shown on the subscription's Overview. For more information on switching your subscription to a different offer, see [Change your Azure subscription to a different offer](/azure/cost-management-billing/manage/switch-azure-offer).

## Advance notifications

Maintenance notifications can be configured to alert you on upcoming planned maintenance events for your Azure SQL Database 24 hours in advance, at the time of maintenance, and when the maintenance is complete. For more information, see [Advance Notifications](advance-notifications.md).

## Availability

### Supported service level objectives

Choosing a maintenance window other than the default is available on all SLOs **except for**:
* Hyperscale 
* Instance pools
* Legacy Gen4 vCore
* Basic, S0 and S1 
* DC, Fsv2, M-series

### Azure region support

Choosing a maintenance window other than the default is currently available in the following regions:

- Australia East
- Australia SouthEast
- Brazil South
- Canada Central
- Central US
- East US
- East US2
- East Asia
- Japan East
- NorthCentral US
- North Europe
- SouthCentral US
- SouthEast Asia
- UK South
- West Europe
- West US
- West US2

## Gateway maintenance for Azure SQL Database

To get the maximum benefit from maintenance windows, make sure your client applications are using the redirect connection policy. Redirect is the recommended connection policy, where clients establish connections directly to the node hosting the database, leading to reduced latency and improved throughput.  

* In Azure SQL Database, any connections using the proxy connection policy could be affected by both the chosen maintenance window and a gateway node maintenance window. However, client connections using the recommended redirect connection policy are unaffected by a gateway node maintenance reconfiguration. 

* In Azure SQL managed instance, the gateway nodes are hosted [within the virtual cluster](../../azure-sql/managed-instance/connectivity-architecture-overview.md#virtual-cluster-connectivity-architecture) and have the same maintenance window as the managed instance, but using the redirect connection policy is still recommended to minimize number of disruptions during the maintenance event.

For more on the client connection policy in Azure SQL Database, see [Azure SQL Database Connection policy](../database/connectivity-architecture.md#connection-policy). 

For more on the client connection policy in Azure SQL managed instance see [Azure SQL managed instance connection types](../../azure-sql/managed-instance/connection-types-overview.md).

## Considerations for Azure SQL managed instance

Azure SQL managed instance consists of service components hosted on a dedicated set of isolated virtual machines that run inside the customer's virtual network subnet. These virtual machines form [virtual cluster(s)](/azure/azure-sql/managed-instance/connectivity-architecture-overview#high-level-connectivity-architecture) that can host multiple managed instances. Maintenance window configured on instances of one subnet can influence the number of virtual clusters within the subnet and distribution of instances among virtual clusters. This may require a consideration of few effects.

### Maintenance window configuration is long running operation 
All instances hosted in a virtual cluster share the maintenance window. By default, all managed instances are hosted in the virtual cluster with the default maintenance window. Specifying another maintenance window for managed instance during its creation or afterwards means that it must be placed in virtual cluster with corresponding maintenance window. If there is no such virtual cluster in the subnet, a new one must be created first to accommodate the instance. Accommodating additional instance in the existing virtual cluster may require cluster resize. Both operations contribute to the duration of configuring maintenance window for a managed instance.
Expected duration of configuring maintenance window on managed instance can be calculated using [estimated duration of instance management operations](/azure/azure-sql/managed-instance/management-operations-overview#duration).

> [!Important]
> A short reconfiguration happens at the end of the maintenance operation and typically lasts up to 8 seconds even in case of interrupted long-running transactions. To minimize the impact of the reconfiguration you should schedule the operation outside of the peak hours.

### IP address space requirements
Each new virtual cluster in subnet requires additional IP addresses according to the [virtual cluster IP address allocation](/azure/azure-sql/managed-instance/vnet-subnet-determine-size#determine-subnet-size). Changing maintenance window for existing managed instance also requires [temporary additional IP capacity](/azure/azure-sql/managed-instance/vnet-subnet-determine-size#address-requirements-for-update-scenarios) as in scaling vCores scenario for corresponding service tier.

### IP address change
Configuring and changing maintenance window causes change of the IP address of the instance, within the IP address range of the subnet.

> [!Important]
>  Make sure that NSG and firewall rules won't block data traffic after IP address change. 

## Next steps

* [Advance notifications](advance-notifications.md)
* [Configure maintenance window](maintenance-window-configure.md)

## Learn more

* [Maintenance window FAQ](maintenance-window-faq.yml)
* [Azure SQL Database](sql-database-paas-overview.md) 
* [SQL managed instance](../managed-instance/sql-managed-instance-paas-overview.md)
* [Plan for Azure maintenance events in Azure SQL Database and Azure SQL managed instance](planned-maintenance.md)





