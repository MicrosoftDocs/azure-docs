---
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: include
ms.date: 09/15/2021
---

### Copy activity support

| Data store | Supported | 
| ------------------- | ------------------- | 
| Azure Blob Storage | Yes |
| Azure Cognitive Search | Yes | 
| Azure Cosmos DB (SQL API) \* | Yes | 
| Azure Cosmos DB's API for MongoDB \* | Yes |
| Azure Data Explorer \* | Yes | 
| Azure Data Lake Storage Gen1 | Yes | 
| Azure Data Lake Storage Gen2 | Yes | 
| Azure Database for Maria DB \* | Yes | 
| Azure Database for MySQL \* | Yes | 
| Azure Database for PostgreSQL \* | Yes |
| Azure Files | Yes | 
| Azure SQL Database \* | Yes | 
| Azure SQL Managed Instance \* | Yes | 
| Azure Synapse Analytics \* | Yes | 
| Azure Table Storage | Yes |
| Amazon S3 | Yes | 
| Hive \* | Yes | 
| SAP Table *(when connecting to SAP ECC or SAP S/4HANA)* | Yes |
| SQL Server \* | Yes | 
| Teradata \* | Yes |

*\* Azure Purview currently doesn't support query or stored procedure for lineage or scanning. Lineage is limited to table and view sources only.*

#### Known limitations on copy activity lineage

Currently, if you use the following copy activity features, the lineage is not yet supported:

- Copy data into Azure Data Lake Storage Gen1 using Binary format.
- Copy data into Azure Synapse Analytics using PolyBase or COPY statement.
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
| Azure Cosmos DB (SQL API) \* | Yes | 
| Azure Data Lake Storage Gen1 | Yes |
| Azure Data Lake Storage Gen2 | Yes |
| Azure Database for MySQL \* | Yes | 
| Azure Database for PostgreSQL \* | Yes |
| Azure SQL Database \* | Yes |
| Azure SQL Managed Instance \* | Yes | 
| Azure Synapse Analytics \* | Yes |

*\* Azure Purview currently doesn't support query or stored procedure for lineage or scanning. Lineage is limited to table and view sources only.*