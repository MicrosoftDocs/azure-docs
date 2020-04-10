---
title: Azure Synapse Analytics shared metadata model 
description: Azure Synapse Analytics allows the different workspace computational engines to share databases and tables between its Spark pools (preview), SQL on-demand engine (preview), and SQL pools. 
services: synapse-analytics
author: MikeRys 
ms.service: synapse-analytics
ms.topic: overview
ms.subservice:
ms.date: 02/24/2020
ms.author: mrys
ms.reviewer: jrasnick
---

# Azure Synapse Analytics shared metadata

Azure Synapse Analytics allows the different workspace computational engines to share databases and tables between its Spark pools (preview), SQL on-demand engine (preview), and SQL pools.

[!INCLUDE [preview](../includes/note-preview.md)]



The sharing supports the so-called modern data warehouse pattern and gives the workspace SQL engines access to databases and tables created with Spark. It also allows the SQL engines to create their own objects that aren't being shared with the other engines.

## Support the modern data warehouse

The shared metadata model supports the modern data warehouse pattern in the following way:

1. Data from the data lake is prepared and structured efficiently with Spark by storing the prepared data in (possibly partitioned) Parquet-backed tables contained in possibly several databases.

2. The Spark created databases and all their tables become visible in any of the Azure Synapse workspace Spark pool instances and can be used from any of the Spark jobs. This capability is subject to the [permissions](#security-model-at-a-glance) since all Spark pools in a workspace share the same underlying catalog meta store.

3. The Spark created databases and their Parquet-backed tables become visible in the workspace SQL on-demand engine. [Databases](database.md) are created automatically in the SQL on-demand metadata, and both the [external and managed tables](table.md) created by a Spark job are made accessible as external tables in the SQL on-demand metadata in the `dbo` schema of the corresponding database. <!--For more details, see [ADD LINK].-->

4. If there are SQL pool instances in the workspace that have their metadata synchronization enabled <!--[ADD LINK]--> or if a new SQL pool instance is created with the metadata synchronization enabled, the Spark created databases and their Parquet-backed tables will be mapped automatically into the SQL pool database as described in [Azure Synapse Analytics shared database](database.md).

<!--[INSERT PICTURE]-->

<!--__Figure 1 -__ Supporting the Modern Data Warehouse Pattern with shared metadata-->

Object synchronization occurs asynchronously. Objects will have a slight delay of a few seconds until they appear in the SQL context. Once they appear, they can be queried, but not updated nor changed by the SQL engines that have access to them.

## Which metadata objects are shared

[!INCLUDE [synapse-analytics-preview-features](../../../includes/synapse-analytics-preview-features.md)]

Spark allows you to create databases, external tables, managed tables, and views. Since Spark views require a Spark engine to process the defining Spark SQL statement, and cannot be processed by a SQL engine, only databases and their contained external and managed tables that use the Parquet storage format are shared with the workspace SQL engines. Spark views are only shared among the Spark pool instances.

## Security model at a glance

[!INCLUDE [synapse-analytics-preview-features](../../../includes/synapse-analytics-preview-features.md)]

The Spark databases and tables, along with their synchronized representations in the SQL engines, are secured at the underlying storage level. When the table is queried by any of the engines that the query submitter has the right to use, the query submitter's security principal is being passed through to the underlying files. Permissions are checked at the file system level.

For more information, see [Azure Synapse Analytics shared database](database.md).

## Change maintenance

If a metadata object is deleted or changed with Spark, the changes are picked up and propagated to the SQL on-demand engine and the SQL pools that have the objects synchronized. Synchronization is asynchronous and changes are reflected in the SQL engines after a short delay.

## Next steps

- [Learn more about Azure Synapse Analytics' shared metadata Databases](database.md)
- [Learn more about Azure Synapse Analytics' shared metadata Tables](table.md)

