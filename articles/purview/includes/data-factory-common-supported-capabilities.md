---
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-catalog
ms.custom: ignite-2022
ms.topic: include
ms.date: 11/01/2021
---

### Copy activity support

| Data store | Supported | 
| ------------------- | ------------------- | 
| Azure Blob Storage | Yes |
| Azure Cognitive Search | Yes | 
| Azure Cosmos DB for NoSQL \* | Yes | 
| Azure Cosmos DB for MongoDB \* | Yes |
| Azure Data Explorer \* | Yes | 
| Azure Data Lake Storage Gen1 | Yes | 
| Azure Data Lake Storage Gen2 | Yes | 
| Azure Database for MariaDB \* | Yes | 
| Azure Database for MySQL \* | Yes | 
| Azure Database for PostgreSQL \* | Yes |
| Azure Files | Yes | 
| Azure SQL Database \* | Yes | 
| Azure SQL Managed Instance \* | Yes | 
| Azure Synapse Analytics \* | Yes | 
| Azure Dedicated SQL pool (formerly SQL DW) \* | Yes | 
| Azure Table Storage | Yes |
| Amazon S3 | Yes | 
| Hive \* | Yes | 
| Oracle \* | Yes |
| SAP Table *(when connecting to SAP ECC or SAP S/4HANA)* | Yes |
| SQL Server \* | Yes | 
| Teradata \* | Yes |

*\* Microsoft Purview currently doesn't support query or stored procedure for lineage or scanning. Lineage is limited to table and view sources only.*

If you use Self-hosted Integration Runtime, note the minimal version with lineage support for:

- Any use case: version 5.9.7885.3 or later
- Copying data from Oracle: version 5.10 or later
- Copying data into Azure Synapse Analytics via COPY command or PolyBase: version 5.10 or later

#### Limitations on copy activity lineage

Currently, if you use the following copy activity features, the lineage is not yet supported:

- Copy data into Azure Data Lake Storage Gen1 using Binary format.
- Compression setting for Binary, delimited text, Excel, JSON, and XML files.
- Source partition options for Azure SQL Database, Azure SQL Managed Instance, Azure Synapse Analytics, SQL Server, and SAP Table.
- Copy data to file-based sink with setting of max rows per file.

In additional to lineage, the data asset schema (shown in Asset -> Schema tab) is reported for the following connectors:

- CSV and Parquet files on Azure Blob, Azure Files, ADLS Gen1, ADLS Gen2, and Amazon S3
- Azure Data Explorer, Azure SQL Database, Azure SQL Managed Instance, Azure Synapse Analytics, SQL Server, Teradata

### Data Flow support

| Data store | Supported |
| ------------------- | ------------------- | 
| Azure Blob Storage | Yes |
| Azure Cosmos DB for NoSQL \* | Yes | 
| Azure Data Lake Storage Gen1 | Yes |
| Azure Data Lake Storage Gen2 | Yes |
| Azure Database for MySQL \* | Yes | 
| Azure Database for PostgreSQL \* | Yes |
| Azure SQL Database \* | Yes |
| Azure SQL Managed Instance \* | Yes | 
| Azure Synapse Analytics \* | Yes |
| Azure Dedicated SQL pool (formerly SQL DW) \* | Yes | 

*\* Microsoft Purview currently doesn't support query or stored procedure for lineage or scanning. Lineage is limited to table and view sources only.*

#### Limitations on data flow lineage

Currently, data flow lineage doesn't integrate with Microsoft Purview [resource set](../concept-resource-sets.md).
