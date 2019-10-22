---
title: SQL-based sharing for Azure Data Share   
description: SQL-based sharing for Azure Data Share    
author: joannapea

ms.service: data-share
ms.topic: conceptual
ms.date: 07/10/2019
ms.author: joanpo
---

# Snapshot-based sharing from SQL-based sources

This article describes how snapshot-based sharing works for SQL-based sources such as Azure SQL Database and Azure SQL Data Warehouse.

## Data Sharing from SQL-based sources
Azure Data Share supports the ability to share tables and views from Azure SQL Database and Azure SQL Data Warehouse. Data providers can add tables and views from existing SQL Servers to a data share. Data consumers can receive data in a variety of data sources including Azure Data Lake Store Gen2, Azure Storage, Azure SQL Database or Azure SQL Data Warehouse. 

Data shared from SQL-based sources contains schema and data only. Azure Data Share does not preserve any pre-existing constraints defined on a table or view. Data is shared as a snapshot of the table or view at the time that a trigger is generated. Azure Data Share does not support incremental copy.

Scheduled incremental copies are not supported for SQL-based sharing. If a snapshot is scheduled, a snapshot of the table as it exists on the originators SQL Server is generated at each scheduled or manual trigger.

### Receiving SQL-based data in Azure Data Lake Store Gen2 or Azure Storage
Data consumers are able to receive SQL-based data into Azure Data Lake Store Gen2 or Azure Storage. By default, Azure Data Share enables customers to specify a storage location into which they will receive data into. Data is copied into a storage location specified by the data consumer when configuring the data share. The contents of the origin table are copied into a format chosen by the data consumer. Azure Data Share currently supports receiving data in CSV or Parquet format. 

Detailed instructions on how to share and receive data into Azure Data Lake Store Gen2 or Azure Storage can be found here. 

### Receiving SQL-based data in Azure SQL Database or Azure SQL Data Warehouse
Data consumers can choose to receive data shared with them from the data provider directly into an Azure SQL Server table or view. When a data consumer triggers a snapshot to receive data shared with them, the table or view is created into the database that was selected at the time of configuration. If the table does not already exist, it will be created with the original schema (no constraints). If the table already exists, and the schema is consistent with the original schema of the table being shared, data will be appended to the existing table. If the table already exists with a different schema, the table will not be overwritten and the trigger will fail. 

The table generated on the data consumers SQL Server will have the same name as the original table name. 

Detailed instructions on how to share and receive data into Azure SQL Database or Azure SQL Data Warehouse can be found here. 

## Next steps

- Learn how to share data from Azure SQL Database or Azure SQL Data Warehouse - [SQL-based sharing](share-your-sql-data.md)

