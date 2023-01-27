---
title: Shared metadata model 
description: Azure Synapse Analytics allows the different workspace computational engines to share databases and tables between its serverless Apache Spark pools and serverless SQL pool. 
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: metadata
ms.date: 10/05/2021
author: juluczni
ms.author: juluczni
ms.reviewer: wiassaf
---

# Azure Synapse Analytics shared metadata

Azure Synapse Analytics allows the different workspace computational engines to share databases and tables between Apache Spark pools and serverless SQL pool.

The sharing supports the so-called modern data warehouse pattern and gives the workspace SQL engines access to databases and tables created with Spark. It also allows the SQL engines to create their own objects that aren't being shared with the other engines.

## Support the modern data warehouse

The shared metadata model supports the modern data warehouse pattern in the following way:

1. Data from the data lake is prepared and structured efficiently with Spark by storing the prepared data in (possibly partitioned) Parquet-backed tables contained in possibly several databases.

2. The Spark created databases and all their tables become visible in any of the Azure Synapse workspace Spark pool instances and can be used from any of the Spark jobs. This capability is subject to the [permissions](#security-model-at-a-glance) since all Spark pools in a workspace share the same underlying catalog meta store.

3. The Spark created databases and their Parquet-backed or CSV-backed tables become visible in the workspace serverless SQL pool. [Databases](database.md) are created automatically in the serverless SQL pool metadata, and both the [external and managed tables](table.md) created by a Spark job are made accessible as external tables in the serverless SQL pool metadata in the `dbo` schema of the corresponding database. 

<!--[INSERT PICTURE]-->

<!--__Figure 1 -__ Supporting the Modern Data Warehouse Pattern with shared metadata-->

Object synchronization occurs asynchronously. Objects will have a slight delay of a few seconds until they appear in the SQL context. Once they appear, they can be queried, but not updated nor changed by the SQL engines that have access to them.

## Shared metadata objects

Spark allows you to create databases, external tables, managed tables, and views. Since Spark views require a Spark engine to process the defining Spark SQL statement, and cannot be processed by a SQL engine, only databases and their contained external and managed tables that use the Parquet or CSV storage format are shared with the workspace SQL engine. Spark views are only shared among the Spark pool instances.

## Security model at a glance

The Spark databases and tables, along with their synchronized representations in the SQL engine, are secured at the underlying storage level. When the table is queried by any of the engines that the query submitter has the right to use, the query submitter's security principal is being passed through to the underlying files. Permissions are checked at the file system level.

For more information, see [Azure Synapse Analytics shared database](database.md).

## Change maintenance

If a metadata object is deleted or changed with Spark, the changes are picked up and propagated to the serverless SQL pool. Synchronization is asynchronous and changes are reflected in the SQL engine after a short delay.

## Next steps

- [Learn more about Azure Synapse Analytics' shared metadata Databases](database.md)
- [Learn more about Azure Synapse Analytics' shared metadata Tables](table.md)

