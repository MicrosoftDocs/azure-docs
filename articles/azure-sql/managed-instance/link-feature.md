---
title: The link feature
titleSuffix: Azure SQL Managed Instance
description: Learn about the link feature for Azure SQL Managed Instance to continuously replicate data from SQL Server to the cloud, or migrate your SQL Server databases with the best possible minimum downtime.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: data-movement
ms.custom: sqldbrb=1, ignite-fall-2021
ms.devlang: 
ms.topic: conceptual
author: danimir
ms.author: danil
ms.reviewer: mathoma, danil
ms.date: 03/21/2022
---
# Link feature for Azure SQL Managed Instance (preview)
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

The new link feature in Azure SQL Managed Instance connects your SQL Servers hosted anywhere to SQL Managed Instance, providing hybrid flexibility and database mobility. With an approach that uses near real-time data replication to the cloud, you can offload workloads to a read-only secondary in Azure to take advantage of Azure-only features, performance, and scale. 

After a disastrous event, you can continue running your read-only workloads on SQL Managed Instance in Azure. You can also choose to migrate one or more applications from SQL Server to SQL Managed Instance at the same time, at your own pace, and with the best possible minimum downtime compared to other solutions in Azure today.

To use the link feature, you'll need:

- SQL Server 2019 Enterprise Edition or Developer Edition with [CU15 (or above)](https://support.microsoft.com/en-us/topic/kb5008996-cumulative-update-15-for-sql-server-2019-4b6a8ee9-1c61-482d-914f-36e429901fb6) installed on-premises, or on an Azure VM.
- Network connectivity between your SQL Server and managed instance is required. If your SQL Server is running on-premises, use a VPN link or Express route. If your SQL Server is running on an Azure VM, either deploy your VM to the same subnet as your managed instance, or use global VNet peering to connect two separate subnets. 
- Azure SQL Managed Instance provisioned on any service tier.

> [!NOTE]
> SQL Managed Instance link feature is available in all public Azure regions. 
> National clouds are currently not supported.

## Overview

The underlying technology of near real-time data replication between SQL Server and SQL Managed Instance is based on distributed availability groups, part of the well-known and proven Always On availability group technology stack. Extend your SQL Server on-premises availability group to SQL Managed Instance in Azure in a safe and secure manner. 

There's no need to have an existing availability group or multiple nodes. The link supports single node SQL Server instances without existing availability groups, and also multiple-node SQL Server instances with existing availability groups. Through the link, you can use the modern benefits of Azure without migrating your entire SQL Server data estate to the cloud.

You can keep running the link for as long as you need it, for months and even years at a time. And for your modernization journey, if or when you're ready to migrate to Azure, the link enables a considerably-improved migration experience with the minimum possible downtime compared to all other options available today, providing a true online migration to SQL Managed Instance.

## Supported scenarios

Data replicated through the link feature from SQL Server to Azure SQL Managed Instance can be used with several scenarios, such as: 

- **Use Azure services without migrating to the cloud** 
- **Offload read-only workloads to Azure** 
- **Migrate to Azure**

![Managed Instance link main scenario](./media/managed-instance-link/mi-link-main-scenario.png)

### Use Azure services 

Use the link feature to leverage Azure services using SQL Server data without migrating to the cloud. Examples include reporting, analytics, backups, machine learning, and other jobs that send data to Azure. 

### Offload workloads to Azure 

You can also use the link feature to offload workloads to Azure. For example, an application could use SQL Server for read-write workloads, while offloading read-only workloads to SQL Managed Instance in any of Azure's 60+ regions worldwide. Once the link is established, the primary database on SQL Server is read/write accessible, while replicated data to SQL Managed Instance in Azure is read-only accessible. This allows for various scenarios where replicated databases on SQL Managed Instance can be used for read scale-out and offloading read-only workloads to Azure. SQL Managed Instance, in parallel, can also host independent read/write databases. This allows for copying the replicated database to another read/write database on the same managed instance for further data processing.

The link is database scoped (one link per one database), allowing for consolidation and deconsolidation of workloads in Azure. For example, you can replicate databases from multiple SQL Servers to a single SQL Managed Instance in Azure (consolidation), or replicate databases from a single SQL Server to multiple managed instances via a 1 to 1 relationship between a database and a managed instance -  to any of Azure's regions worldwide (deconsolidation). The latter provides you with an efficient way to quickly bring your workloads closer to your customers in any region worldwide, which you can use as read-only replicas.

### Migrate to Azure 

The link feature also facilitates migrating from SQL Server to SQL Managed Instance, enabling: 

- The most performant minimum downtime migration compared to all other solutions available today
- True online migration to SQL Managed Instance in any service tier 

Since the link feature enables minimum downtime migration, you can migrate to your managed instance while maintaining your primary workload online. While online migration was possible to achieve previously with other solutions when migrating to the general purpose service tier, the link feature now also allows for true online migrations to the business critical service tier as well. 

## How it works

The underlying technology behind the link feature for SQL Managed Instance is distributed availability groups. The solution supports single-node systems without existing availability groups, or multiple node systems with existing availability groups.  

![How does the link feature for SQL Managed Instance work](./media/managed-instance-link/mi-link-ag-dag.png)

Secure connectivity, such as VPN or Express Route is used between an on-premises network and Azure. If SQL Server is hosted on an Azure VM, the internal Azure backbone can be used between the VM and managed instance – such as, for example, global VNet peering. The trust between the two systems is established using certificate-based authentication, in which SQL Server and SQL Managed Instance exchange their public keys.

There could exist up to 100 links from the same, or various SQL Server sources to a single SQL Managed Instance. This limit is governed by the number of databases that could be hosted on a managed instance at this time. Likewise, a single SQL Server can establish multiple parallel database replication links with several managed instances in different Azure regions in a 1 to 1 relationship between a database and a managed instance . The feature requires CU13 or higher to be installed on SQL Server 2019.

## Use the link feature

To help with the initial environment setup, we have prepared the following online guide on how to setup your SQL Server environment to use with the link feature for Managed Instance:

* [Prepare environment for the link](managed-instance-link-preparation.md)

Once you have ensured the pre-requirements have been met, you can create the link using the automated wizard in SSMS, or you can choose to setup the link manually using scripts. Create the link using one of the following instructions:

* [Replicate database with link feature in SSMS](managed-instance-link-use-ssms-to-replicate-database.md), or alternatively
* [Replicate database with Azure SQL Managed Instance link feature with T-SQL and PowerShell scripts](managed-instance-link-use-scripts-to-replicate-database.md)

Once the link has been created, ensure that you follow the best practices for maintaining the link, by following instructions described at this page:

* [Best practices with link feature for Azure SQL Managed Instance](link-feature-best-practices.md)

If and when you are ready to migrate a database to Azure with a minimum downtime, you can do this using an automated wizard in SSMS, or you can choose to do this manually with scripts. Migrate database to Azure link using one of the following instructions:

* [Failover database with link feature in SSMS](managed-instance-link-use-ssms-to-failover-database.md), or alternatively
* [Failover (migrate) database with Azure SQL Managed Instance link feature with T-SQL and PowerShell scripts](managed-instance-link-use-scripts-to-failover-database.md)

## Limitations

This section describes the product’s functional limitations.

### General functional limitations

Managed Instance link has a set of general limitations, and those are listed in this section. Listed limitations are of a technical nature and are unlikely to be addressed in the foreseeable future.

- Only user databases can be replicated. Replication of system databases isn't supported.
- The solution doesn't replicate server level objects, agent jobs, nor user logins from SQL Server to Managed Instance.
- Only one database can be placed into a single Availability Group per one Distributed Availability Group link.
- Link can't be established between SQL Server and Managed Instance if functionality used on SQL Server isn't support on Managed Instance. 
  - File tables and file streams aren't supported for replication, as Managed Instance doesn't support this.
  - Replicating Databases using Hekaton (In-Memory OLTP) isn't supported on Managed Instance General Purpose service tier. Hekaton is only supported on Managed Instance Business Critical service tier.
  - For the full list of differences between SQL Server and Managed Instance, see [this article](./transact-sql-tsql-differences-sql-server.md).
- In case Change data capture (CDC), log shipping, or service broker are used with database replicated on the SQL Server, and in case of database migration to Managed Instance, on the failover to the Azure, clients will need to connect using instance name of the current global primary replica. you'll need to manually re-configure these settings.
- In case Transactional Replication is used with database replicated on the SQL Server, and in case of migration scenario, on failover to Azure, transactional replication on Azure SQL Managed instance won't continue. you'll need to manually re-configure Transactional Replication.
- In case distributed transactions are used with database replicated from the SQL Server, and in case of migration scenario, on the cutover to the cloud, the DTC capabilities won't be transferred. There will be no possibility for migrated database to get involved in distributed transactions with SQL Server, as Managed Instance doesn't support distributed transactions with SQL Server at this time. For reference, Managed Instance today supports distributed transactions only between other Managed Instances, see [this article](../database/elastic-transactions-overview.md#transactions-for-sql-managed-instance).
- Managed Instance link can replicate database of any size if it fits into chosen storage size of target Managed Instance.

### Preview limitations

Some Managed Instance link features and capabilities are limited **at this time**. Details can be found in the following list.
- SQL Server 2019, Enterprise Edition or Developer Edition, CU15 (or higher) on Windows or Linux host OS is supported.
- Private endpoint (VPN/VNET) is supported to connect Distributed Availability Groups to Managed Instance. Public endpoint can't be used to connect to Managed Instance.
- Managed Instance Link authentication between SQL Server instance and Managed Instance is certificate-based, available only through exchange of certificates. Windows authentication between instances isn't supported.
- Replication of user databases from SQL Server to Managed Instance is one-way. User databases from Managed Instance can't be replicated back to SQL Server.
- [Auto failover groups](auto-failover-group-sql-mi.md) replication to secondary Managed Instance can't be used in parallel while operating the Managed Instance link with SQL Server.
- Replicated R/O databases aren't part of auto-backup process on SQL Managed Instance.

## Next steps

If you're interested in using Link feature for Azure SQL Managed Instance with versions and editions that are currently not supported, sign-up [here](https://aka.ms/mi-link-signup).

For more information on the link feature, see the following:

- [Managed Instance link – connecting SQL Server to Azure reimagined](https://aka.ms/mi-link-techblog).
- [Prepare for SQL Managed Instance link](./managed-instance-link-preparation.md).
- [Use SQL Managed Instance link via SSMS to replicate database](./managed-instance-link-use-ssms-to-replicate-database.md).
- [Use SQL Managed Instance link via SSMS to migrate database](./managed-instance-link-use-ssms-to-failover-database.md).

For other replication scenarios, consider: 

- [Transactional replication with Azure SQL Managed Instance (Preview)](replication-transactional-overview.md)
