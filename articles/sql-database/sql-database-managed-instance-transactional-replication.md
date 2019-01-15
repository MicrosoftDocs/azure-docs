---
title: Transactional replication with Azure SQL Logical Server and Azure SQL Managed Instance | Microsoft Docs"
description: Learn about using SQL Server transactional replication with Azure SQL Database Logical Servers and SQL Managed Instance. 
services: sql-database
ms.service: sql-database
ms.subservice: data-movement
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: MashaMSFT
ms.author:  mathoma
ms.reviewer: carlrab
manager: craigg
ms.date: 01/08/2019
---
# Transactional replication with Azure SQL Logical Server and Azure SQL Managed Instance

Transactional Replication is a feature of Azure SQL Database, Managed Instance and SQL Server that enables you to replicate data from a table in Azure SQL Database or SQL Server to the tables placed on remote databases. This feature allows you to synchronize multiple tables in different databases.

## Overview 
The key components in transactional replication are shown in the following picture:  

![replication with SQL Database](media/replication-to-sql-database/replication-to-sql-database.png)


The **Publisher** is an instance or server that publishes changes made on some tables (articles) by sending the updates to the Distributor. Publishing to an Azure SQL Database from an on-premises SQL Server is supported on the following versions of SQL Server:
    - SQL Server 2019 (preview)
    - SQL Server 2016 to SQL 2017
    - SQL Server 2014 SP1 CU3 or greater (12.00.4427)
    - SQL Server 2014 RTM CU10 (12.00.2556)
    - SQL Server 2012 SP3 or greater (11.0.6020)
    - SQL Server 2012 SP2 CU8 (11.0.5634.0)
    - For other versions of SQL Server that do not support publishing to objects in Azure, it is possible to utilize the [republishing data](https://docs.microsoft.com/sql/relational-databases/replication/republish-data) method to move data to newer versions of SQL Server. 

The **Distributor** is an instance or server that collects changes in the articles from a Publisher and distributes them to the Subscribers. The Distributor can be either Azure SQL Database Managed Instance or SQL Server (any version as long it is equal to or higher than the Publisher version). 

The **Subscriber** is an instance or server that is receiving the changes made on the Publisher. Subscribers can be either Azure SQL Database Logical Server/Managed Instance or SQL Server. A Subscriber on a Logical Server must be configured as push-subscriber. 

| Role | Logical Server | Managed Instance |
| :----| :------------- | :--------------- |
| **Publisher** | No | Yes | 
| **Distributor** | No | Yes|
| **Pull subscriber** | No | Yes|
| **Push Subscriber**| Yes | Yes|
| &nbsp; | &nbsp; | &nbsp; |

There are different [types of replication](https://docs.microsoft.com/sql/relational-databases/replication/types-of-replication?view=sql-server-2017):


| Replication | Logical Server | Managed Instance |
| :----| :------------- | :--------------- |
| [**Transactional**](https://docs.microsoft.com/sql/relational-databases/replication/transactional/transactional-replication) | Yes (only as subscriber) | Yes | 
| [**Snapshot**](https://docs.microsoft.com/sql/relational-databases/replication/snapshot-replication) | Yes (only as subscriber) | Yes|
| [**Merge replication**](https://docs.microsoft.com/sql/relational-databases/replication/merge/merge-replication) | No | No|
| [**Peer-to-peer**](https://docs.microsoft.com/sql/relational-databases/replication/transactional/peer-to-peer-transactional-replication) | No | No|
| **One-way** | Yes | Yes|
| [**Bidirectional**](https://docs.microsoft.com/sql/relational-databases/replication/transactional/bidirectional-transactional-replication) | No | Yes|
| [**Updatable subscriptions**](https://docs.microsoft.com/sql/relational-databases/replication/transactional/updatable-subscriptions-for-transactional-replication) | No | No|
| &nbsp; | &nbsp; | &nbsp; |

  >[!NOTE]
  > - Attempting to configure replication using an older version can result in error number MSSQL_REPL20084 (The process could not connect to Subscriber.) and MSSQ_REPL40532 (Cannot open server <name> requested by the login. The login failed.)
  > - To use all the features of Azure SQL Database, you must be using the latest versions of [SQL Server Management Studio (SSMS)](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-2017) and [SQL Server Data Tools (SSDT)](https://docs.microsoft.com/sql/ssdt/download-sql-server-data-tools-ssdt?view=sql-server-2017).

## Requirements
- Connectivity uses SQL Authentication between replication participants. 
- An Azure Storage Account share for the working directory used by replication. 
- Port 445 (TCP outbound) needs to be open in the security rules of the Managed  Instance subnet to access the Azure file share. 
- Port 1433 (TCP outbound) needs to be opened if the Publisher/Distributor are on a Managed Instance and the subscriber is on-premises. 

## Common configurations
In general, the publisher and the distributor must be either in the cloud or on-premises. The following configurations are supported: 

### Publisher with local Distributor on a Managed Instance

![Single instance as Publisher and Distributor ](media/replication-with-sql-database-managed-instance/01-single-instance-asdbmi-pubdist.png)

Publisher and distributor are configured within a single Managed Instance. 

### Publisher with remote distributor on a Managed Instance

![Separate instances for Publisher and Distributor](media/replication-with-sql-database-managed-instance/02-separate-instances-asdbmi-pubdist.png)

Publisher and distributor are configured on two Managed Instances. In this configuration

- Both Managed Instances are on the same vNet.
- Both Managed Instances are in the same location. 

### Publisher and distributor on-premises with a subscriber on a Managed Instance or Logical Server 

![Azure SQL DB as subscriber](media/replication-with-sql-database-managed-instance/03-azure-sql-db-subscriber.png)
 
In this configuration, an Azure SQL Database (Managed Instance or Logical Server) is a subscriber. This configuration supports migration from on-premises to Azure. If a subscriber is on Logical Server it must be in push mode.  

## Next steps
1. [Configure transactional replication for a Managed Instance](https://docs.microsoft.com/azure/sql-database/replication-with-sql-database-managed-instance#configure-publishing-and-distribution-example). 
1. [Create a publication](https://docs.microsoft.com/sql/relational-databases/replication/publish/create-a-publication).
1. [Create a push subscription](https://docs.microsoft.com/sql/relational-databases/replication/create-a-push-subscription) by using the Azure SQL Database logical server name as the subscriber (for example `N'azuresqldbdns.database.windows.net` and the Azure SQL Database name as the destination database (for example **Adventureworks**. )


## See Also  

- [Replication to SQL Database](replication-to-sql-database.md)
- [Replication to Managed Instance](replication-with-sql-database-managed-instance.md)
- [Create a Publication](https://docs.microsoft.com/sql/relational-databases/replication/publish/create-a-publication)
- [Create a Push Subscription](https://docs.microsoft.com/sql/relational-databases/replication/create-a-push-subscription/)
- [Types of Replication](https://docs.microsoft.com/sql/relational-databases/replication/types-of-replication)
- [Monitoring (Replication)](https://docs.microsoft.com/sql/relational-databases/replication/monitor/monitoring-replication)
- [Initialize a Subscription](https://docs.microsoft.com/sql/relational-databases/replication/initialize-a-subscription)  
