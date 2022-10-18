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
ms.date: 10/18/2022
---

# Change data capture in Azure Data Factory and Azure Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes change data capture (CDC) in Azure Data Factory.

To learn more, see [Azure Data Factory overview](introduction.md) or [Azure Synapse overview](../synapse-analytics/overview-what-is.md).

## Overview

When you perform data integration and ETL processes in the cloud, your jobs can perform much better and be more effective when you only read the source data that has changed since the last time the pipeline ran, rather than always querying an entire dataset on each run. 

ADF provides multiple different approaches for you to easily get delta data only from the last run.

1. **Native change data capture in mapping dataflow**

The changed data including row insert, update and deletion can be automatically detected and extracted by ADF mapping dataflow from the source databases below.  No timestamp or ID columns are required to identify the changes since it leverages the native change data capture technology from the databases.  By simply chaining a source transform and a sink transform reference to a database dataset in a mapping dataflow, you will see the changes happened on the source database to be automatically applied to the target database, so that you can easily synchronize data between 2 databases.  You can also add any transformations in between for any custom logic to process the delta data.

-   [SAP CDC](connector-sap-change-data-capture.md)
-   [Azure SQL Database](connector-azure-sql-database.md)
-   [Azure SQL Server](connector-sql-server.md)
-   [Azure SQL Managed Instance](connector-azure-sql-managed-instance.md)
-   [Azure Cosmos DB (SQL API)](connector-azure-cosmos-db.md)

2. **Auto incremental extraction in mapping dataflow**

The newly updated rows or updated files can be automatically detected and extracted by ADF mapping dataflow from the source stores below. When you want to get delta data from the databases, the incremental column is required to identify the changes. When you want to load new files or updated files only from a storage store, ADF mapping dataflow just works through files’ last modify time. 

-   [Azure Blob Storage](connector-azure-blob-storage.md)
-   [ADLS Gen2](load-azure-data-lake-storage-gen2.md)
-   [ADLS Gen1](load-azure-data-lake-store.md)
-   [Azure SQL Database](connector-azure-sql-database.md)
-   [Azure SQL Server](connector-sql-server.md)
-   [Azure SQL Managed Instance](connector-azure-sql-managed-instance.md)
-   [Azure Database for MySQL](connector-azure-database-for-mysql.md)
-   [Azure Database for PostgreSQL](connector-azure-database-for-postgresql.md)
-   [Common data model](format-common-data-model.md)

3. **Customer managed dela data extraction in pipeline**

You can always build your own delta data extraction pipeline for all ADF supported data stores including using lookup activity to get the watermark value stored in an external control table, copy activity or mapping dataflow activity to query the delta data against timestamp or ID column, and SP activity to write the new watermark value back to your external control table for the next run.  When you want to load new files only from a storage store, you can either delete files every time after they have been moved to the destination successfully, or leverage the time partitioned folder or file names or last modified time to identify the new files. 


## Best Practices

**Delta data load from databases**

-   Native change data capture is always recommended as the simplest way for you to get delta data. It also brings much less burden on your source database when ADF extracts the changed data for further processing. 
-   If your database stores are not part of the ADF connector list with native change data capture support, we recommend you to check the auto incremental extraction option where you only need to input incremental column to capture the changes. ADF will take care of the rest including coming up with the query on delta loading as well as managing the checkpoint for each run. 
-   Customer managed dela data extraction covers all the ADF supported databases and give you the flexibility to control everything by yourself. 

**Delta data load from file based storage**

-   When you want to load data from Azure Blob, Azure data lake gen2 or Azure data lake gen1, mapping data flow provides you the opportunity to get new or updated files only by simple one click. It is the simplest and recommended way for you to achieve delta load from these file based storages in mapping data flow. 
-   You can also get other [best practices](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/best-practices-of-how-to-use-adf-copy-activity-to-copy-new-files/ba-p/1532484). 


## Checkpoint

When you enable native change data capture or auto incremental extraction options in ADF mapping dataflow, ADF helps you to manage the checkpoint to make sure each activity run will automatically only read the source data that has changed since the last time the pipeline run.  By default, the checkpoint is coupled with your pipeline and activity name.  If you change your pipeline name or activity name, the checkpoint will be reset, which leads you to start from beginning or get changes from now in the next run. If you do want to change the pipeline name or activity name but still keep the checkpoint to get changed data from the last run automatically, please use your own Checkpoint key in dataflow activity to achieve that. 

When you debug the pipeline, this feature works the same. The checkpoint will be reset when you refresh your browser during the debug run. After you are satisfied with the pipeline result from debug run, you can go ahead to publish and trigger the pipeline. At the moment when you first time trigger your published pipeline, it automatically restarts from the beginning or gets changes from now on.

In the monitoring section, you always have the chance to rerun a pipeline. When you are doing so, the changed data is always captured from the previous checkpoint of your selected pipeline run.

## How to start

The followings are a list of tutorials to get start the change data capture in Azure Data Factory and Azure Synapse Analytics.

[SAP CDC tutorial in ADF](sap-change-data-capture-introduction-architecture.md)

[Incrementally copy data from a source data store to a destination data store tutorial](tutorial-incremental-copy-overview.md)


## Next steps

- [Learn how to use the checkpoint key in the data flow activity](control-flow-execute-data-flow-activity.md).
