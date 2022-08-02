---
title: Change Data Capture in Azure Data Factory & Azure Synapse Analytics
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about change data capture in Azure Data Factory and Azure Synapse Analytics.
author: kromerm
ms.author: makromer
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 07/26/2022
---

# Changed data capture in Azure Data Factory and Azure Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes change data capture (CDC) in Azure Data Factory.

To learn more read the introductory article for [Azure Data Factory](introduction.md) or [Azure Synapse](../synapse-analytics/overview-what-is.md).

## Overview

When performing data integration and ETL processes, your jobs can often perform much better and be more effective by only reading source data that has changed since the last time the pipeline ran, rather than always querying an entire dataset on aech run. Executing pipelines that only read the latest changed data is available in many of ADF's source connectors by simply enabling a checkbox property. Support for full-fidelity CDC, which inlcudes row markers for upserts, deletes, and updates, as well as rules for resetting the ADF-managed checkpoint are available in several connectors. Lastly, ADF supports patterns and templates for managing incremental pipelines with user-controlled checkpoints as well.

## CDC Connector support

| Connector   | Full CDC | Incremental CDC | Incremental pipeline pattern |
| :-------------------- | :--------------------------- | :--------------------------------- | :--------------------------- |
| [ADLS Gen1](load-azure-data-lake-store.md) | &nbsp; | ✓    |  &nbsp;    |
| [ADLS Gen2](load-azure-data-lake-storage-gen2.md) | &nbsp; | ✓    |  &nbsp;    |
| [Azure Blob Storage](connector-azure-blob-storage.md) | &nbsp;    | ✓    | &nbsp;   |   
| [Azure Cosmos DB (SQL API)](connector-azure-cosmos-db.md) | &nbsp; | ✓ | &nbsp; |
| [Azure Database for MySQL](connector-azure-database-for-mysql.md) | &nbsp; | ✓ | &nbsp; |
| [Azure Database for PostgreSQL](connector-azure-database-for-postgresql.md) | &nbsp; | ✓ | &nbsp; |
| [Azure SQL Database](connector-azure-sql-database.md) | &nbsp; | ✓ | [✓](tutorial-incremental-copy-portal.md) |
| [Azure SQL Managed Instance](connector-azure-sql-managed-instance.md) | &nbsp; | ✓ | [✓](tutorial-incremental-copy-change-data-capture-feature-portal.md) |
| [Azure SQL Server](connector-sql-server.md) | &nbsp; | ✓ | [✓](tutorial-incremental-copy-multiple-tables-portal.md) |
| [Common data model](format-common-data-model.md) | &nbsp; | ✓    | &nbsp;     |

The "Full CDC" and "Incremental CDC" features are available in ADF and Synapse data flows. In each of those options, ADF handles the checkpoint automatically for you. You can turn on the change data capture in the data flow source and reset the checkpoint in the data flow activity. To reset the checkpoint for your CDC pipeline, go into the data flow activity in your pipeline and override the checkpoint key.

## Next steps

- [Learn how to use the checkpoint key in the data flow activity](control-flow-execute-data-flow-activity.md).

