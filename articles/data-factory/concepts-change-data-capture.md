---
title: Change Data Capture
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about change data capture in Azure Data Factory and Azure Synapse Analytics.
author: kromerm
ms.author: makromer
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 10/14/2022
---

# Change data capture in Azure Data Factory and Azure Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes change data capture (CDC) in Azure Data Factory.

To learn more, see [Azure Data Factory overview](introduction.md) or [Azure Synapse overview](../synapse-analytics/overview-what-is.md).

## Overview

When you perform data integration and ETL processes in the cloud, your jobs can perform much better and be more effective when you only read the source data that has changed since the last time the pipeline ran, rather than always querying an entire dataset on each run. Executing pipelines that only read the latest changed data is available in many of ADF's source connectors by simply enabling a checkbox property inside the source transformation. Support for full-fidelity CDC, which includes row markers for inserts, upserts, deletes, and updates, as well as rules for resetting the ADF-managed checkpoint are available in several ADF connectors. To easily capture changes and deltas, ADF supports patterns and templates for managing incremental pipelines with user-controlled checkpoints as well, which you'll find in the table below.

## CDC Connector support

| Connector   | Full CDC | Incremental CDC | Incremental pipeline pattern |
| :-------------------- | :--------------------------- | :--------------------------------- | :--------------------------- |
| [ADLS Gen1](load-azure-data-lake-store.md) | &nbsp; | ✓    |  &nbsp;    |
| [ADLS Gen2](load-azure-data-lake-storage-gen2.md) | &nbsp; | ✓    |  &nbsp;    |
| [Azure Blob Storage](connector-azure-blob-storage.md) | &nbsp;    | ✓    | &nbsp;   |   
| [Azure Cosmos DB (SQL API)](connector-azure-cosmos-db.md) | ✓ | ✓ | &nbsp; |
| [Azure Database for MySQL](connector-azure-database-for-mysql.md) | &nbsp; | ✓ | &nbsp; |
| [Azure Database for PostgreSQL](connector-azure-database-for-postgresql.md) | &nbsp; | ✓ | &nbsp; |
| [Azure SQL Database](connector-azure-sql-database.md) | ✓ | ✓ | [✓](tutorial-incremental-copy-portal.md) |
| [Azure SQL Managed Instance](connector-azure-sql-managed-instance.md) | ✓ | ✓ | [✓](tutorial-incremental-copy-change-data-capture-feature-portal.md) |
| [Azure SQL Server](connector-sql-server.md) | ✓ | ✓ | [✓](tutorial-incremental-copy-multiple-tables-portal.md) |
| [Common data model](format-common-data-model.md) | &nbsp; | ✓    | &nbsp;     |
| [SAP CDC](connector-sap-change-data-capture.md) | ✓ | ✓ | ✓ |


ADF makes it super-simple to enable and use CDC. Many of the connectors listed above will enable a checkbox similar to the one shown below from the data flow source transformation.

:::image type="content" source="media/data-flow/cdc.png" alt-text="Change data capture":::

The "Full CDC" and "Incremental CDC" features are available in both ADF and Synapse data flows and pipelines. In each of those options, ADF manages the checkpoint automatically for you. You can turn on the change data capture feature in the data flow source and you can also reset the checkpoint in the data flow activity. To reset the checkpoint for your CDC pipeline, go into the data flow activity in your pipeline and override the checkpoint key. Connectors in ADF that support "full CDC" also provide automatic tagging of rows as update, insert, delete.

## Next steps

- [Learn how to use the checkpoint key in the data flow activity](control-flow-execute-data-flow-activity.md).
