---
title: Sync data (Preview) | Microsoft Docs
description: This overview introduces Azure SQL Data Sync (Preview).
services: sql-database
documentationcenter: ''
author: douglaslms
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: sql-database
ms.custom: load & move data
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/27/2017
ms.author: douglasl

---
# Sync data across multiple cloud and on-premises databases with SQL Data Sync

Data Sync is a service built on SQL Database that lets you synchronize the data you select bi-directionally across multiple Azure SQL databases and SQL Server instance.

Data Sync is based around the concept of a Sync Group. A Sync Group is a group of databases that the user wants to synchronize.

The Sync Group has several properties including:

-   The **Sync Schema** describes which data is being synchronized.

-   The **Sync Direction** can be bi-directional or can flow in only one direction. That is, the Sync Direction can be *Hub to Member* or *Member to Hub*, or both.

-   The **Sync Interval** is how often synchronization occurs.

-   The **Conflict Resolution Policy** is a group level policy, which can be *Hub wins* or *Member wins*.

Data Sync uses a hub and spoke topology to synchronize data. The user must define one of the databases in the group as the Hub Database. The rest of the databases are member databases. Sync occurs only between the Hub and a member.
-   The **Hub Database** must be an Azure SQL Database.
-   The **member databases** can be either Azure SQL Databases, on-premises SQL Server Databases, or Azure virtual machines.
-   The **Sync Database** contains the metadata and log for Data Sync. The Sync Database has to be an Azure SQL Database located in the same region as the Hub Database. The Sync Database is customer created and customer owned.

> [!NOTE]
> If you're using an on premises database, you have to [configure a local agent.](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-get-started-sql-data-sync)

![Sync data between databases](media/sql-database-sync-data/sync-data-overview.png)

## When to use Data Sync

Data Sync is useful in cases where data needs to be kept up to date across several Azure SQL Databases or SQL Server databases. Here are the main use cases for Data Sync:

-   **Hybrid Data Synchronization:** With Data Sync, you can keep data synchronized between your on-premises databases and Azure SQL Databases to enable hybrid applications with their data tier in SQL. This capability may appeal to customers who are considering moving to the cloud and would like to put some of their application in Azure.

-   **Distributed Applications:** In some cases, it's beneficial to separate different workloads across different databases. For example, if you have a large production database, but need to run a reporting or analytics workload on this data, it's helpful to have a second database to use for this workload. This approach minimizes the performance impact on your production workload. Data Sync can be used to keep these two databases synchronized.

-   **Globally Distributed Applications:** Many businesses span several regions and even several countries. To minimize network latency, it's best to have your data in a region close to you. With Data Sync, you can easily keep databases in regions around the world synchronized.

We don't recommend Data Sync for the following scenarios:

-   Disaster Recovery

-   Read Scale

-   ETL (OLTP to OLAP)

-   Migration from on-premises SQL Server to Azure SQL Database

## How does Data Sync work? 

-   **Tracking data changes:** Data Sync tracks changes using insert, update, and delete triggers. The changes are recorded in a side table in the user database.

-   **Synchronizing data:** Data Sync is designed in a Hub and Spoke model. The Hub syncs with each member individually. Changes from the Hub are downloaded to the member and then changes from the member are uploaded to the Hub.

-   **Resolving conflicts:** Data Sync provides two options for conflict resolution, *Hub wins* or *Member wins*.
    -   If you select *Hub wins*, the changes in the hub always overwrite changes in the member.
    -   If you select *Member wins*, the changes in the member overwrite changes in the hub. If there's more than one member, the final value depends on which member is synced first.

## Limitations and Considerations

### Performance Impact
Data Sync uses insert, update, and delete triggers to track changes. It creates side tables in the user database. These activities have an impact on your database workload, so assess your service tier and upgrade if needed.

### Eventual Consistency
Since Data Sync is trigger-based, transactional consistency is not guaranteed. Microsoft guarantees that all changes are made eventually and that Data Sync does not cause data loss.

### Unsupported data types

-   FileStream

-   SQL/CLR UDT

-   XMLSchemaCollection (XML supported)

-   Cursor, Timestamp, Hierarchyid

### Requirements

-   Each table must have a primary key

-   A table cannot have identity columns that are not the primary key

-   A database name cannot contain special characters

### Limitations on service or database dimensions

|                                                                 |                        |                             |
|-----------------------------------------------------------------|------------------------|-----------------------------|
| **Dimensions**                                                      | **Limit**              | **Workaround**              |
| Maximum number of sync groups any database can belong to.       | 5                      |                             |
| Maximum number of endpoints in a single sync group              | 30                     | Create multiple sync groups |
| Maximum number of on-premises endpoints in a single sync group. | 5                      | Create multiple sync groups |
| Database, table, schema, and column names                       | 50 characters per name |                             |
| Tables in a sync group                                          | 500                    | Create multiple sync groups |
| Columns in a table in a sync group                              | 1000                   |                             |
| Data row size on a table                                        | 24 Mb                  |                             |
| Minimum Sync interval                                           | 5 Minutes              |                             |

## Next Steps

For more info about SQL Database and SQL Data Sync, see:+

-   [Getting Started with SQL Data Sync](sql-database/sql-database-get-started-sql-data-sync)

-   [Download the complete SQL Data Sync technical documentation](https://github.com/Microsoft/sql-server-samples/raw/master/samples/features/sql-data-sync/Data_Sync_Preview_full_documentation.pdf?raw=true)

-   [Download the SQL Data Sync REST API documentation](https://github.com/Microsoft/sql-server-samples/raw/master/samples/features/sql-data-sync/Data_Sync_Preview_REST_API.pdf?raw=true)

-   [SQL Database Overview](sql-database-technical-overview)

-   [Database Lifecycle Management](https://msdn.microsoft.com/library/jj907294.aspx)


