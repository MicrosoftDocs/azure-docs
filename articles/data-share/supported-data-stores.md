---
title: Supported data stores in Azure Data Share
description: Learn about the data stores that are supported for use in Azure Data Share.
ms.service: data-share
author:  sidontha
ms.author: sidontha
ms.topic: conceptual
ms.date: 10/27/2022
---
# Supported data stores in Azure Data Share

Azure Data Share provides open and flexible data sharing, including the ability to share from and to different data stores. Data providers can share data from one type of data store, and data consumers can choose a data store to receive the data. 

In this article, you'll learn about the set of Azure data stores that Azure Data Share supports. You'll also learn about how data providers and data consumers can combine different data stores. 

## Supported data stores 

The following table explains the data stores that Azure Data Share supports. 

| Data store | Sharing based on full snapshots | Sharing based on incremental snapshots | Sharing in place |
|:--- |:--- |:--- |:--- |
| Azure Blob Storage |✓ |✓ | |
| Azure Data Lake Storage Gen1 |✓ |✓ | |
| Azure Data Lake Storage Gen2 |✓ |✓ ||
| Azure SQL Database |✓ | | |
| Azure Synapse Analytics (formerly Azure SQL Data Warehouse) |✓ | | |
| Azure Synapse Analytics (workspace) dedicated SQL pool |✓ | | |
| Azure Data Explorer | | |✓ |

## Data store support matrix

Azure Data Share lets data consumers choose a data store to accept data. For example, data that's shared from Azure SQL Database can be received into Azure Data Lake Storage Gen2, Azure SQL Database, or Azure Synapse Analytics. When customers set up a receiving data share, they can choose the format to receive the data. 

The following table explains the combinations and options that data consumers can choose when they accept and configure a data share. For more information, see [Configure a dataset mapping](how-to-configure-mapping.md).

| Data store | Blob Storage | Data Lake Storage Gen1 | Data Lake Storage Gen2 | SQL Database | Synapse Analytics (formerly SQL Data Warehouse) | Synapse Analytics (workspace) dedicated SQL pool | Data Explorer
|:--- |:--- |:--- |:--- |:--- |:--- |:--- | :--- |
| Blob Storage | ✓ || ✓ |||
| Data Lake Storage Gen1 | ✓ | | ✓ |||
| Data Lake Storage Gen2 | ✓ | | ✓ |||
| SQL Database | ✓ | | ✓ | ✓ | ✓ | ✓ ||
| Synapse Analytics (formerly SQL Data Warehouse) | ✓ | | ✓ | ✓ | ✓ | ✓ ||
| Synapse Analytics (workspace) dedicated SQL pool | ✓ | | ✓ | ✓ | ✓ | ✓ ||
| Data Explorer ||||||| ✓ |

## Share from a storage account

Azure Data Share supports the sharing of files, folders, and file systems from Azure Data Lake Storage Gen1 and Azure Data Lake Storage Gen2. It also supports the sharing of blobs, folders, and containers from Azure Blob Storage. You can share block, append, or page blobs, and they're received as block blobs.

When file systems, containers, or folders are shared in snapshot-based sharing, data consumers can choose to make a full copy of the shared data. Or they can use the incremental snapshot capability to copy only new files or updated files. 

An incremental snapshot is based on the last-modified time of the files. Existing files that have the same name as files in the received data are overwritten in a snapshot. Files that are deleted from the source aren't deleted on the target. 

If a snapshot is interrupted and fails, for example, due to a cancel action, networking issue, or disaster, the next incremental snapshot copies files that have a last-modified time greater than the time of the last successful snapshot.

For more information, see: [share and receive data from Azure Blob Storage and Azure Data Lake Storage](how-to-share-from-storage.md).

## Share from a SQL-based source

Azure Data Share supports the sharing of both tables and views from Azure SQL Database and Azure Synapse Analytics (formerly Azure SQL Data Warehouse). It supports the sharing of tables from Azure Synapse Analytics (workspace) dedicated SQL pool. Sharing from Azure Synapse Analytics (workspace) serverless SQL pool isn't currently supported.

Data consumers can choose to accept the data into Azure Data Lake Storage Gen2 or Azure Blob Storage as a CSV file or parquet file. They can also accept data as tables into Azure SQL Database and Azure Synapse Analytics.

When consumers accept data into Azure Data Lake Storage Gen2 or Azure Blob Storage, full snapshots overwrite the contents of the target file if the file already exists. When data is received into a table and the target table doesn't already exist, Azure Data Share creates an SQL table by using the source schema. If a target table already exists and it has the same name, it's dropped and overwritten with the latest full snapshot. Incremental snapshots aren't currently supported.

If a snapshot is interrupted and fails, for example, due to a cancel action, networking issue, or disaster, the next snapshot copies the entire table or view again.

For more information, see: [share and receive data from Azure SQL Database and Azure Synapse Analytics](how-to-share-from-sql.md).

## Share from Data Explorer

Azure Data Share supports the ability to share databases in-place from Azure Data Explorer clusters. A data provider can share at the level of the database or the cluster. If you're using Data Share API to share data, you can also share specific tables.  

When data is shared at the database level, data consumers can access only the databases that the data provider shared. When a provider shares data at the cluster level, data consumers can access all of the databases from the provider's cluster, including any future databases that the data provider creates.

To access shared databases, data consumers need their own Azure Data Explorer cluster. Their cluster must be in the same Azure datacenter as the data provider's Azure Data Explorer cluster. 

When a sharing relationship is established, Azure Data Share creates a symbolic link between the provider's cluster and the consumer's cluster. Data that's ingested into the source cluster by using batch mode appears on the target cluster within a few minutes.

For more information, see: [share and receive data from Azure Data Explorer](/azure/data-explorer/data-share). 

## Next steps

To learn how to start sharing data, continue to the [Share your data](share-your-data.md) tutorial.
