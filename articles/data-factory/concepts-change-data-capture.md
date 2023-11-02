---
title: Change data capture
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about change data capture in Azure Data Factory and Azure Synapse Analytics.
author: kromerm
ms.author: makromer
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 08/08/2023
---

# Change data capture in Azure Data Factory and Azure Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes change data capture (CDC) in Azure Data Factory.

To learn more, see [Azure Data Factory overview](introduction.md) or [Azure Synapse overview](../synapse-analytics/overview-what-is.md).

## Overview

When you perform data integration and ETL processes in the cloud, your jobs can perform better and be more effective when you only read the source data that has changed since the last time the pipeline ran, rather than always querying an entire dataset on each run. ADF provides multiple different ways for you to easily get delta data only from the last run.

### Change Data Capture factory resource

The easiest and quickest way to get started in data factory with CDC is through the factory level Change Data Capture resource. From the main pipeline designer, click on **New** under Factory Resources to create a new Change Data Capture. The CDC factory resource provides a configuration walk-through experience where you can select your sources and destinations, apply optional transformations, and then click start to begin your data capture. With the CDC resource, you do not need to design pipelines or data flow activities. You are also only billed for four cores of General Purpose data flows while your data in being processed. You can set a preferred latency, which ADF will use to wake up and look for changed data. That is the only time you will be billed. The top-level CDC resource is also the ADF method of running your processes continuously. Pipelines in ADF are batch only, but the CDC resource can run continuously.

### Native change data capture in mapping data flow

The changed data including inserted, updated and deleted rows can be automatically detected and extracted by ADF mapping data flow from the source databases.  No timestamp or ID columns are required to identify the changes since it uses the native change data capture technology in the databases.  By simply chaining a source transform and a sink transform reference to a database dataset in a mapping data flow, you can see the changes happened on the source database to be automatically applied to the target database, so that you can easily synchronize data between two tables.  You can also add any transformations in between for any business logic to process the delta data. When defining your sink data destination, you can set insert, update, upsert, and delete operations in your sink without the need of an Alter Row transformation because ADF is able to automatically detect the row makers.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE5bkg2]

**Supported connectors**
-   [SAP CDC](connector-sap-change-data-capture.md)
-   [Azure SQL Database](connector-azure-sql-database.md)
-   [SQL Server](connector-sql-server.md)
-   [Azure SQL Managed Instance](connector-azure-sql-managed-instance.md)
-   [Azure Cosmos DB (SQL API)](connector-azure-cosmos-db.md)
-   [Azure Cosmos DB analytical store](../cosmos-db/analytical-store-introduction.md)
-   [Snowflake](connector-snowflake.md)

### Auto incremental extraction in mapping data flow

The newly updated rows or updated files can be automatically detected and extracted by ADF mapping data flow from the source stores. When you want to get delta data from the databases, the incremental column is required to identify the changes. When you want to load new files or updated files only from a storage store, ADF mapping data flow just works through files’ last modify time. 

**Supported connectors**
-   [Azure Blob Storage](connector-azure-blob-storage.md)
-   [ADLS Gen2](load-azure-data-lake-storage-gen2.md)
-   [ADLS Gen1](load-azure-data-lake-store.md)
-   [Azure SQL Database](connector-azure-sql-database.md)
-   [SQL Server](connector-sql-server.md)
-   [Azure SQL Managed Instance](connector-azure-sql-managed-instance.md)
-   [Azure Database for MySQL](connector-azure-database-for-mysql.md)
-   [Azure Database for PostgreSQL](connector-azure-database-for-postgresql.md)
-   [Common data model](format-common-data-model.md)

### Customer managed delta data extraction in pipeline

You can always build your own delta data extraction pipeline for all ADF supported data stores including using lookup activity to get the watermark value stored in an external control table, copy activity or mapping data flow activity to query the delta data against timestamp or ID column, and SP activity to write the new watermark value back to your external control table for the next run.  When you want to load new files only from a storage store, you can either delete files every time after they have been moved to the destination successfully, or leverage the time partitioned folder or file names or last modified time to identify the new files. 


## Best Practices

**Change data capture from databases**

-   Native change data capture is always recommended as the simplest way for you to get change data. It also brings much less burden on your source database when ADF extracts the change data for further processing. 
-   If your database stores are not part of the ADF connector list with native change data capture support, we recommend you to check the auto incremental extraction option where you only need to input incremental column to capture the changes. ADF will take care of the rest including creating a dynamic query for delta loading and managing the checkpoint for each activity run. 
-   Customer managed delta data extraction in pipeline covers all the ADF supported databases and give you the flexibility to control everything by yourself. 

**Change files capture from file based storages**

-   When you want to load data from Azure Blob Storage, Azure Data Lake Storage Gen2 or Azure Data Lake Storage Gen1, mapping data flow provides you with the opportunity to get new or updated files only by simple one click. It is the simplest and recommended way for you to achieve delta load from these file based storages in mapping data flow. 
-   You can get more [best practices](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/best-practices-of-how-to-use-adf-copy-activity-to-copy-new-files/ba-p/1532484). 


## Checkpoint

When you enable native change data capture or auto incremental extraction options in ADF mapping data flow, ADF helps you to manage the checkpoint to make sure each activity run will automatically only read the source data that has changed since the last time the pipeline run.  By default, the checkpoint is coupled with your pipeline and activity name.  If you change your pipeline name or activity name, the checkpoint will be reset, which leads you to start from beginning or get changes from now in the next run. If you do want to change the pipeline name or activity name but still keep the checkpoint to get changed data from the last run automatically, please use your own [Checkpoint key](control-flow-execute-data-flow-activity.md#checkpoint-key) in data flow activity to achieve that. The [naming rule](naming-rules.md) of your own checkpoint key is same as linked services, datasets, pipelines and data flows. 

When you debug the pipeline, this feature works the same. The checkpoint will be reset when you refresh your browser during the debug run. After you are satisfied with the pipeline result from debug run, you can go ahead to publish and trigger the pipeline. At the moment when you first time trigger your published pipeline, it automatically restarts from the beginning or gets changes from now on.

In the monitoring section, you always have the chance to rerun a pipeline. When you are doing so, the changed data is always captured from the previous checkpoint of your selected pipeline run.

## Tutorials

The followings are the tutorials to start the change data capture in Azure Data Factory and Azure Synapse Analytics.

- [SAP CDC tutorial in ADF](sap-change-data-capture-introduction-architecture.md#sap-cdc-capabilities)
- [Incrementally copy data from a source data store to a destination data store tutorials](tutorial-incremental-copy-overview.md)

## Templates

The followings are the templates to use the change data capture in Azure Data Factory and Azure Synapse Analytics.

- [Replicate multiple objects from SAP via SAP CDC](solution-template-replicate-multiple-objects-sap-cdc.md)


## Next steps

- [Learn how to use the checkpoint key in the data flow activity](control-flow-execute-data-flow-activity.md).
- [Learn about the ADF Change Data Capture resource](concepts-change-data-capture-resource.md).
- [Walk through building a top-level CDC artifact](how-to-change-data-capture-resource.md).
