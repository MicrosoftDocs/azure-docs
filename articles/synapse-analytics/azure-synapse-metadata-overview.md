---
title: Azure Synapse Analytics shared metadata model 
description: Azure Synapse Analytics provides a shared meta data model where creating a database or table in Spark will make it accessible from its SQL Analytics and SQL Pool engines without duplicating the data or requiring user action. 
services: synapse-analytics
author: MikeRys 
ms.service: synapse-analytics
ms.topic: overview
ms.subservice:
ms.date: 01/16/2020
ms.author: mrys
ms.reviewer: jrasnick
---

# What is Azure Synapse Analytics' shared meta data model? 

Azure Synapse Analytics allows the different computational engines of a workspace to share databases and tables between its Apache Spark pools, SQL on-demand engine and SQL pools. 

In the current public preview, the sharing is designed to support the so-called modern data warehouse pattern and gives the workspace's SQL engines access to databases and tables created with Spark while also allowing the SQL engines to create their own objects that are not being shared with the other engines.

## Supporting the modern data warehouse pattern with shared meta data

The shared meta data model supports the modern data warehouse pattern as shown in Figure 1 below:

1. Data from the data lake is being prepared and structured efficiently with Spark by storing the prepared data in (possibly partitioned) tables contained in possibly several databases.

2. The Spark created databases and their tables will become visible in any of the Azure Synapse workspace's Spark pool instances and can be used from any of the Spark jobs, subject to the [permissions](#security-model-at-a-glance) since all Spark pools in a workspace share the same underlying catalog meta store. 

3. The Spark created databases and their tables will also become visible in the workspace's SQL on-demand engine. [Databases](azure-synapse-metadata-database.md) are being created automatically in the SQL on-demand meta data, and both the [external and managed tables](azure-synapse-metadata-table.md) created by a Spark job will be made accessible as external tables in the SQL on-demand meta data in the `dbo` schema of the corresponding database. <!--For more details, see [ADD LINK].-->

4. If there are SQL pool instances in the workspace that have their metadata  synchronization enabled [ADD LINK] or if a new SQL pool instance is being created with the meta data synchronization enabled, the Spark created databases and their tables will be mapped automatically into the SQL pool's database as follows: The databases generated in Spark are mapped to special schemas inside the SQL pool's database. Each such schema is named after the Spark database name with an additional `$` prefix. Both the external and managed tables in the Spark generated database are exposed as external tables in the corresponding special schema. <!--For more details, see [ADD LINK].-->

[INSERT PICTURE]

__Figure 1 -__ Supporting the Modern Data Warehouse Pattern with Shared Meta Data

The object synchronization will occur asynchronously, and thus the objects will have a slight delay of a few seconds until they appear. Once they appear, they can be queried (but not updated nor changed) by the SQL engines that have access to them. 

## Which Meta Data Objects are shared?

Spark allows you to create databases, external and managed tables as well as views. However, since Spark views require a Spark engine to process the defining Spark SQL statement and cannot be processed by a SQL engine, only databases and their contained external and managed tables are being shared with the workspace's SQL engines. Spark views are only shared among the Spark pool instances.

## Security model at a glance

In the current public preview, the Spark databases and tables, as well as their synchronized representations in the SQL engines will be secured at the underlying storage level. When the table is being queried by any of the engines that the query submitter has the right to use, the query submitter's security principal is being passed through, down to the underlying files, and permissions are checked at the file system level.

<!-- For more details, see [ADD LINK].-->

## Change maintenance

If a meta data object gets deleted or changed with Spark, the changes will be picked up and propagated to the workspace's SQL on-demand engine as well as the workspace's SQL pools that have the objects synchronized. As with the initial synchronization, this will occur asynchronously and be reflected in the SQL engines after a short delay.

## Handling of name conflicts

During public preview, it can happen that the name of a Spark database can conflict with the name of an existing SQL on-demand database. In this case, the Spark database will be exposed in SQL on-demand with a different name, that got created by adding a post-fix of the form `_<workspace name>-ondemand-DefaultSparkConnector` to the Spark database name. 

For example, if a Spark database called `mydb` gets created in the Azure Synapse workspace `myws` and a SQL on-demand database with that name already exists, then the Spark database in SQL on-demand will have to be referenced using the name `mydb_myws-ondemand-DefaultSparkConnector`.

Note that this behavior may change in a future release by raising an error during creation of a database with a conflicting name. 

## Next steps

- [Learn more about Azure Synapse Analytics' shared Meta Data Databases](azure-synapse-metadata-database.md)
- [Learn more about Azure Synapse Analytics' shared Meta Data Tables](azure-synapse-metadata-table.md)
- [Learn more about the Synchronization with SQL Analytics On-Demand]()
- [Learn more about the Synchronization with SQL Analyiics Pools]()

