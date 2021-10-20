---
title: The link feature 
titleSuffix: Azure SQL Managed Instance 
description: Learn about the link feature for Azure SQL Managed Instance to continuously replicate data from SQL Server to the cloud, or migrate your SQL Server databases with the best possible minimum downtime.  
services: sql-database
ms.service: sql-managed-instance
ms.subservice: data-movement
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: danimir
ms.author: danil
ms.reviewer: mathoma, danil
ms.date: 11/02/2021
---
# Link feature for Azure SQL Managed Instance (limited preview)
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

The new link feature in Azure SQL Managed Instance connects your SQL Servers hosted anywhere to SQL Managed Instance, providing unprecedented hybrid flexibility and database mobility. With an approach that uses near real-time data replication to the cloud, you can offload workloads to read-only secondaries in Azure to take advantage of Azure-only features, performance, and scale. 

In the event of a disaster, you can continue running your on-premises workloads on SQL Managed Instance in Azure. You can also choose to migrate one or more applications from SQL Server to SQL Managed Instance at the same time, at your own pace, and with the best possible minimum downtime compared to other solutions in Azure today.

The link feature is released in limited public preview with support for only [SQL Server 2019 Enterprise Edition CU13 (or above)](https://support.microsoft.com/topic/kb5005679-cumulative-update-13-for-sql-server-2019-5c1be850-460a-4be4-a569-fe11f0adc535). [Sign-up now](https://aka.ms/mi-link-signup) to participate in the limited public preview. 

## Overview

The underlying technology of near real-time data replication between SQL Server and SQL Managed Instance is based on distributed availability groups, part of the well-known and proven Always On availability group technology stack. Extend your SQL Server on-premises availability group to SQL Managed Instance in Azure in a safe and secure manner. 

There is no need to have an existing availability group or multiple nodes. The link supports single node SQL Server instances without existing availability groups, and also multiple-node SQL Server instances with existing availability groups. Through the link, you can leverage the modern benefits of Azure without migrating your entire SQL Server data estate to the cloud.

You can keep running the link for as long as you need it, for months and even years at a time. And for your modernization journey, if/when you are ready to migrate to Azure, the link enables a considerably-improved migration experience with the minimum possible downtime compared to all other options available today, providing a true online migration to SQL Managed Instance Business Critical service tier.

## Supported scenarios

Data replicated through the link feature from SQL Server to Azure SQL Managed Instance can be used with a number of scenarios, such as: 

- **Use Azure services without migrating to the cloud** 
- **Offload read-only workloads** 
- **Migrating to Azure**
- **Disaster recovery**

![Managed Instance link main scenario](./media/managed-instance-link/mi-link-main-scenario.png)


### Using Azure services 

Use the link feature to leverage Azure services using SQL Server data without migrating to the cloud. Examples include reporting, analytics backups, machine learning, and other jobs that send data to Azure. 

### Offloading workloads to Azure 

You can also use the link feature to offload workloads to Azure. For example, an application that uses SQL Server for read / write workloads, while offloading read-only workloads to SQL Managed Instance in any of Azure's 60+ regions worldwide. Once the link is established, the primary database on SQL Server is read/write accessible, while replicated data to SQL Managed Instance in Azure is read-only accessible. This allows for various scenarios where replicated databases on SQL Managed Instance can be used for read scale-out and offloading read-only workloads to Azure. SQL Managed Instance, in parallel, can also host independent read/write databases. This allows for copying the replicated database to another read/write database on the same managed instance for further data processing.

The link is database scoped (one link per one database), allowing for consolidation and deconsolidation of workloads in Azure. For example, you can replicate data from multiple SQL Servers to a single SQL Managed Instance in Azure (consolidation), or replicate from a single SQL Server to multiple managed instances to any of Azure's regions worldwide (deconsolidation). The latter provides you with an efficient way to quickly bring your workloads closer to your customers in any region worldwide, which you can use as read-only replicas.

### Migration 

The link feature also enables migrating from SQL Server to SQL Managed Instance, enabling: 

- The most performant minimum downtime migration compared to all other solutions available today
- True online migration to SQL Managed Instance Business Critical service tier

### Disaster recovery 

In the event of a disaster on-premises, you can rely on SQL Managed Instance as your safe DR site for business continuity – either for read-only access to your on-premises data until the primary node is back online, or to a full read/write node in Azure in case you decide to failover to the cloud on-demand.

## How it works

The underlying technology behind the link feature for SQL Managed Instance is distributed availability groups. The solution supports single-node systems without existing availability groups, or multiple node systems with existing availability groups.  

![How does the link feature for SQL Managed Instance work](./media/managed-instance-link/mi-link-ag-dag.png)

Secure connectivity, such is VPN or Express Route is used between an on-premises network and Azure. If SQL Server is hosted on an Azure VM, the internal Azure backbone can be used between the VM and managed instance – such is, for example, global VNet peering. The trust between the two systems is established using certificate-based authentication, in which SQL Server and SQL Managed Instance exchange their public keys.

There could exist up to 100 links from the same, or various SQL Server sources to a single SQL Managed Instance. This limit is governed by the number of databases that could be hosted on a managed instance at this time. Likewise, a single SQL Server can establish multiple parallel database replication links with several managed instances in different Azure regions. The feature requires CU13 or higher to be installed on SQL Server 2019. The new SQL Server 2022 CTP1 can be used out of the box without any CUs required.

## Sign-up for link

To use the link feature, you will need:

-[ SQL Server 2019 Enterprise Edition with CU13 (or above)](https://support.microsoft.com/topic/kb5005679-cumulative-update-13-for-sql-server-2019-5c1be850-460a-4be4-a569-fe11f0adc535) installed on-premises or on an Azure VM.
- If SQL Server is running on-premises, a VPN link, or Express Route is required to connect on-premises network with Azure.
- SQL Managed Instance, either GP or BC service tier, provisioned in Azure.

Use the following link to sign-up for the limited preview of the link feature. Customers are on-boarded on a rolling basis as there is a limited number of seats currently available. You will be placed in a queue and on-boarded at the first available opportunity.

> [!div class="nextstepaction"]
> [Sign-up for Managed Instance link](https://aka.ms/mi-link-signup)

## Next steps

For more information on the link feature, see the following:

- [The link feature for SQL Managed Instance – data mobility between SQL Server and Azure reimagined](https://aka.ms/mi-link-techblog).

For other replication scenarios, consider: 

- [Transactional replication with Azure SQL Managed Instance (Preview)](replication-transactional-overview.md)
