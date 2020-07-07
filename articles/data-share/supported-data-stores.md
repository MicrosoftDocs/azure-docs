---
title: Supported data stores in Azure Data Share
description: Learn about the data stores that are supported for use Azure Data Share.
ms.service: data-share
author: joannapea
ms.author: joanpo
ms.topic: conceptual
ms.date: 10/30/2019
---
# Supported data stores in Azure Data Share

Azure Data Share provides open and flexible data sharing, including the ability to share from and to different data stores. Data providers can share data from one type of data store, and their data consumers can choose which data store to receive data into. 

In this article, you'll learn about the rich set of Azure data stores that are supported in Azure Data Share. You can also find information on the combinations of data stores that can be leveraged by data providers and data consumers. 

## What data stores are supported in Azure Data Share? 

The below table details the supported data sources for Azure Data Share. 

| Data store | Snapshot-based sharing | In-place sharing 
|:--- |:--- |:--- |:--- |:--- |:--- |
| Azure Blob storage |✓ | |
| Azure Data Lake Storage Gen1 |✓ | |
| Azure Data Lake Storage Gen2 |✓ ||
| Azure SQL Database |Public Preview | |
| Azure Synapse Analytics (formerly Azure SQL DW) |Public Preview | |
| Azure Data Explorer | |Public Preview |

## Data store support matrix

Azure Data Share offers data consumers flexibility when deciding on a data store to accept data in to. For example, data being shared from Azure SQL Database can be received into Azure Data Lake Store Gen2, Azure SQL Database or Azure Synapse Analytics. Customers can choose which format to receive data in when configuring a received data share. 

The below table details different combinations and choices that data consumers have when accepting and configuring their data share. For more information on how to configure dataset mappings, see [how to configure dataset mappings](how-to-configure-mapping.md).

|  | Azure Blob Storage | Azure Data Lake Storage Gen1 | Azure Data Lake Storage Gen2 | Azure SQL Database | Azure Synapse Analytics | Azure Data Explorer
|:--- |:--- |:--- |:--- |:--- |:--- |:--- |
| Azure Blob storage | ✓ || ✓ ||
| Azure Data Lake Storage Gen1 | ✓ | | ✓ ||
| Azure Data Lake Storage Gen2 | ✓ | | ✓ ||
| Azure SQL Database | ✓ | | ✓ | ✓ | ✓ ||
| Azure Synapse Analytics (formerly Azure SQL DW) | ✓ | | ✓ | ✓ | ✓ ||
| Azure Data Explorer |||||| ✓ |

## Share from a storage account
Azure Data Share supports sharing of files, folders and file systems from Azure Data Lake Gen1 and Azure Data Lake Gen2. It also supports sharing of blobs, folders and containers from Azure Blob Storage. Only block blob is currently supported. When file systems, containers or folders are shared in snapshot-based sharing, data consumer can choose to make a full copy of the share data, or leverage incremental snapshot capability to copy only new or updated files. Incremental snapshot is based on the last modified time of the files. Existing files with the same name will be overwritten.

## Share from a SQL-based source
Azure Data Share supports sharing of tables or views from Azure SQL Database and Azure Synapse Analytics (formerly Azure SQL DW). Data consumers can choose to accept the data into Azure Data Lake Store Gen2 or Azure Blob Storage as csv or parquet file. Note that by default, file formats are csv. The data consumer can elect to receive the data in parquet format if desired. This can be done in the dataset mapping settings when receiving the data. 

When accepting data into Azure Data Lake Store Gen2 or Azure Blob Storage, full snapshots overwrite the contents of the target file. 

A data consumer can choose to receive data into a table of their choice. In this scenario, if the target table does not already exist, Azure Data Share creates the SQL table with the source schema. If a destination table already exists with the same name, it will be dropped and overwritten with the latest full snapshot. When mapping the destination table, an alternative schema and table name can be specified. Incremental snapshots are not currently supported. 

Sharing from SQL-based sources has pre-requisites related to firewall rules and permissions. Please refer to the pre-requisites section of the [share your data](share-your-data.md) tutorial for details.

## Share from Azure Data Explorer
Azure Data Share supports the ability to share databases in-place from Azure Data Explorer clusters. Data provider can share at the database or cluster level. When shared at database level, data consumer will only be able to access the specific database(s) shared by the data provider. When shared at cluster level, data consumer can access all the databases from the provider's cluster, including any future databases created by the data provider.

To access shared databases, data consumer needs to have its own Azure Data Explorer cluster. Data consumer's Azure Data Explorer cluster needs to locate in the same Azure data center as the data provider's Azure Data Explorer cluster. When sharing relationship is established, Azure Data Share creates a symbolic link between the provider and consumer's Azure Data Explorer clusters.

Azure Data Explorer supports two modes of data ingestion: batch and streaming. Data received from batch in the shared database will appear between a few seconds to a few minutes on the data consumer side. Data received from streaming could take up to 24 hours to appear on the data consumer side. 

## Next steps

To learn how to start sharing data, continue to the [share your data](share-your-data.md) tutorial.
