---
title: Azure Synapse Analytics shared metadata model 
description: Azure Synapse Analytics provides a shared metadata model where creating a database or table in Spark will make it accessible from its SQL Analytics and SQL Pool engines without duplicating the data or requiring user action. 
services: synapse-analytics
author: MikeRys 
ms.service: synapse-analytics
ms.topic: overview
ms.subservice:
ms.date: 01/16/2020
ms.author: mrys
ms.reviewer: jrasnick
---

# Azure Synapse Analytics shared metadata 

Azure Synapse Analytics allows the different computational engines of a workspace to share databases and tables between its Apache Spark pools, SQL on-demand engine and SQL pools. 

[!INCLUDE [synapse-analytics-preview-terms](../../includes/synapse-analytics-preview-terms.md)]

The sharing supports the so-called modern data warehouse pattern and gives the workspace SQL engines access to databases and tables created with Spark. It also allows the SQL engines to create their own objects that are not being shared with the other engines.

## Support the modern data warehouse

The shared metadata model supports the modern data warehouse pattern in the following ways:

* Data from the data lake is prepared and structured efficiently with Spark by storing the prepared data in (possibly partitioned) tables contained in possibly several databases.

* The Spark created databases and their tables become visible in any of the Azure Synapse workspace Spark pool instances and can be used from any of the Spark jobs. This is subject to the [permissions](#security-model-at-a-glance) since all Spark pools in a workspace share the same underlying catalog meta store. 

* The Spark created databases and their tables become visible in the workspace SQL on-demand engine. [Databases](metadata-database.md) are created automatically in the SQL on-demand metadata, and both the [external and managed tables](metadata-table.md) created by a Spark job are made accessible as external tables in the SQL on-demand metadata in the `dbo` schema of the corresponding database. <!--For more details, see [ADD LINK].-->

* If there are SQL pool instances in the workspace that have their metadata synchronization enabled <!--[ADD LINK]--> or if a new SQL pool instance is created with the metadata synchronization enabled, the Spark created databases and their tables will be mapped automatically into the SQL pool database as described in [Azure Synapse Analytics shared database](metadata-database.md).

<!--For more details, see [ADD LINK].-->

<!--[INSERT PICTURE]-->

<!--__Figure 1 -__ Supporting the Modern Data Warehouse Pattern with Shared metadata-->

The object synchronization occurs asynchronously. Objects will have a slight delay of a few seconds until they appear. Once they appear, they can be queried, but not updated nor changed by the SQL engines that have access to them. 

## Which metadata Objects are shared?

Spark allows you to create databases, external and managed tables as well as views. However, since Spark views require a Spark engine to process the defining Spark SQL statement and cannot be processed by a SQL engine, only databases and their contained external and managed tables are being shared with the workspace SQL engines. Spark views are only shared among the Spark pool instances.

## Security model at a glance

[!INCLUDE [synapse-analytics-preview-features](../../includes/synapse-analytics-preview-features.md)]

The Spark databases and tables, as well as their synchronized representations in the SQL engines are secured at the underlying storage level. When the table is queried by any of the engines that the query submitter has the right to use, the query submitter's security principal is being passed through, down to the underlying files, and permissions are checked at the file system level.

<!-- For more details, see [ADD LINK].-->

## Change maintenance

If a metadata object gets deleted or changed with Spark, the changes will be picked up and propagated to the workspace SQL on-demand engine as well as the workspace SQL pools that have the objects synchronized. As with the initial synchronization, this will occur asynchronously and be reflected in the SQL engines after a short delay.

## Handling of name conflicts

If a Spark database name is the same as an existing SQL on-demand database name, Synapse Analytics adds a suffix to the name to distinguish between the database. The suffix follows this pattern `_<workspace name>-ondemand-DefaultSparkConnector`. 

For example, if a Spark database called `mydb` gets created in the Azure Synapse workspace `myws` and a SQL on-demand database with that name already exists, then the Spark database in SQL on-demand will have to be referenced using the name `mydb_myws-ondemand-DefaultSparkConnector`.

## Next steps

- [Learn more about Azure Synapse Analytics' shared metadata Databases](metadata-database.md)
- [Learn more about Azure Synapse Analytics' shared metadata Tables](metadata-table.md)
- [Learn more about the Synchronization with SQL Analytics On-Demand](metadata-overview.md)
- [Learn more about the Synchronization with SQL Analytics Pools](metadata-overview.md)

