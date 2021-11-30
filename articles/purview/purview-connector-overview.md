---
title: Purview Connector Overview
description: This article outlines the different data stores and functionalities supported in Purview
author: chandrakavya
ms.author: kchandra
ms.service: purview
ms.subservice: purview-data-map
ms.topic: conceptual
ms.date: 11/02/2021
ms.custom: ignite-fall-2021
---

# Supported data stores

Purview supports the following data stores. Select each data store to
learn the supported capabilities and the corresponding configurations in
details.

## Purview data sources

|**Category**|  **Data Store**  |**Metadata Extraction**|**Full Scan**|**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|
|---|---|---|---|---|---|---|---|---|
| Azure | [Azure Blob Storage](register-scan-azure-blob-storage-source.md)| [Yes](register-scan-azure-blob-storage-source.md#register) | [Yes](register-scan-azure-blob-storage-source.md#scan)|[Yes](register-scan-azure-blob-storage-source.md#scan) | [Yes](register-scan-azure-blob-storage-source.md#scan)|[Yes](register-scan-azure-blob-storage-source.md#scan)| Yes | No|
||[Azure Cosmos DB](register-scan-azure-cosmos-database.md)| [Yes](register-scan-azure-cosmos-database.md#register) | [Yes](register-scan-azure-cosmos-database.md#scan)|[Yes](register-scan-azure-cosmos-database.md#scan) | [Yes](register-scan-azure-cosmos-database.md#scan)|[Yes](register-scan-azure-cosmos-database.md#scan)|No|No|
||[Azure Data Explorer](register-scan-azure-data-explorer.md)| [Yes](register-scan-azure-data-explorer.md#register) | [Yes](register-scan-azure-data-explorer.md#scan) | [Yes](register-scan-azure-data-explorer.md#scan) | [Yes](register-scan-azure-data-explorer.md#scan)| [Yes](register-scan-azure-data-explorer.md#scan)| No | No |
||[Azure Data Lake Storage Gen1](register-scan-adls-gen1.md)| [Yes](register-scan-adls-gen1.md#register) | [Yes](register-scan-adls-gen1.md#scan)|[Yes](register-scan-adls-gen1.md#scan) | [Yes](register-scan-adls-gen1.md#scan)|[Yes](register-scan-adls-gen1.md#scan)| No |[Data Factory Lineage](how-to-link-azure-data-factory.md) |
||[Azure Data Lake Storage Gen2](register-scan-adls-gen2.md)| [Yes](register-scan-adls-gen2.md#register) | [Yes](register-scan-adls-gen2.md#scan)|[Yes](register-scan-adls-gen2.md#scan) | [Yes](register-scan-adls-gen2.md#scan)|[Yes](register-scan-adls-gen2.md#scan)| Yes | [Data Factory Lineage](how-to-link-azure-data-factory.md) |
||[Azure Dedicated SQL pool (formerly SQL DW)](register-scan-azure-synapse-analytics.md)| [Yes](register-scan-azure-synapse-analytics.md#register) | [Yes](register-scan-azure-synapse-analytics.md#scan)| [Yes](register-scan-azure-synapse-analytics.md#scan)| [Yes](register-scan-azure-synapse-analytics.md#scan)| [Yes](register-scan-azure-synapse-analytics.md#scan)| No | No|
||[Azure Files](register-scan-azure-files-storage-source.md)|[Yes](register-scan-azure-files-storage-source.md#register) | [Yes](register-scan-azure-files-storage-source.md#scan) | [Yes](register-scan-azure-files-storage-source.md#scan) | [Yes](register-scan-azure-files-storage-source.md#scan) | [Yes](register-scan-azure-files-storage-source.md#scan) | No | No |
||[Azure SQL Database](register-scan-azure-sql-database.md)| [Yes](register-scan-azure-sql-database.md#register) | [Yes](register-scan-azure-sql-database.md#scan)|[Yes](register-scan-azure-sql-database.md#scan) | [Yes](register-scan-azure-sql-database.md#scan)|[Yes](register-scan-azure-sql-database.md#scan)| No |[Data Factory Lineage](how-to-link-azure-data-factory.md)|
||[Azure SQL Database Managed Instance](register-scan-azure-sql-database-managed-instance.md)| [Yes](register-scan-azure-sql-database-managed-instance.md#register) | [Yes](register-scan-azure-sql-database-managed-instance.md#scan)| [Yes](register-scan-azure-sql-database-managed-instance.md#scan) | [Yes](register-scan-azure-sql-database-managed-instance.md#scan) | [Yes](register-scan-azure-sql-database-managed-instance.md#scan) | No | [Data Factory Lineage](how-to-link-azure-data-factory.md) |
||[Azure Synapse Analytics (Workspace)](register-scan-synapse-workspace.md)| [Yes](register-scan-synapse-workspace.md#register) | [Yes](register-scan-synapse-workspace.md#scan)| [Yes](register-scan-synapse-workspace.md#scan) | [Yes](register-scan-synapse-workspace.md#scan)| [Yes](register-scan-synapse-workspace.md#scan)| No| [Yes](how-to-lineage-azure-synapse-analytics.md)|
||[Azure Database for MySQL](register-scan-azure-mysql-database.md)| [Yes](register-scan-azure-mysql-database.md#register) | [Yes](register-scan-azure-mysql-database.md#scan)| [Yes*](register-scan-azure-mysql-database.md#scan) | [Yes](register-scan-azure-mysql-database.md#scan) | [Yes](register-scan-azure-mysql-database.md#scan) | No | [Data Factory Lineage](how-to-link-azure-data-factory.md) |
||[Azure Database for PostgreSQL](register-scan-azure-postgresql.md)| [Yes](register-scan-azure-postgresql.md#register) | [Yes](register-scan-azure-postgresql.md#scan)| [Yes](register-scan-azure-postgresql.md#scan) | [Yes](register-scan-azure-postgresql.md#scan) | [Yes](register-scan-azure-postgresql.md#scan) | No | [Data Factory Lineage](how-to-link-azure-data-factory.md) |
|Database|[Cassandra](register-scan-cassandra-source.md)|[Yes](register-scan-cassandra-source.md#register) | [Yes](register-scan-cassandra-source.md#scan)| No | No | No | No| [Yes](how-to-lineage-cassandra.md)|
||[Google BigQuery](register-scan-google-bigquery-source.md)| [Yes](register-scan-google-bigquery-source.md#register)| [Yes](register-scan-google-bigquery-source.md#scan)| No | No | No | No| [Yes](how-to-lineage-google-bigquery.md)|
||[Hive Metastore DB](register-scan-hive-metastore-source.md)| [Yes](register-scan-hive-metastore-source.md#register)| [Yes](register-scan-hive-metastore-source.md#scan)| No | No | No | No| Yes |
||[Oracle DB](register-scan-oracle-source.md)| [Yes](register-scan-oracle-source.md#register)| [Yes](register-scan-oracle-source.md#scan)| No | No | No | No| [Yes](how-to-lineage-oracle.md)|
||[SQL Server](register-scan-on-premises-sql-server.md)| [Yes](register-scan-on-premises-sql-server.md#register) | [Yes](register-scan-on-premises-sql-server.md#scan) | [Yes](register-scan-on-premises-sql-server.md#scan) | [Yes](register-scan-on-premises-sql-server.md#scan) | [Yes](register-scan-on-premises-sql-server.md#scan) | No| [Data Factory Lineage](how-to-link-azure-data-factory.md) |
||[Teradata](register-scan-teradata-source.md)| [Yes](register-scan-teradata-source.md#register)| [Yes](register-scan-teradata-source.md#scan)| No | No | No | No| [Yes](how-to-lineage-teradata.md)|
|File|[Amazon S3](register-scan-amazon-s3.md)|[Yes](register-scan-amazon-s3.md)| [Yes](register-scan-amazon-s3.md)| [Yes](register-scan-amazon-s3.md)| [Yes](register-scan-amazon-s3.md)| [Yes](register-scan-amazon-s3.md)| No| Yes|
|Services and apps|[Erwin](register-scan-erwin-source.md)| [Yes](register-scan-erwin-source.md#register)| [Yes](register-scan-erwin-source.md#scan)| No | No | No | No| [Yes](how-to-lineage-erwin.md)|
||[Looker](register-scan-looker-source.md)| [Yes](register-scan-looker-source.md#register)| [Yes](register-scan-looker-source.md#scan)| No | No | No | No| [Yes](how-to-lineage-looker.md)|
||[Power BI](register-scan-power-bi-tenant.md)| [Yes](register-scan-power-bi-tenant.md#register)| [Yes](register-scan-power-bi-tenant.md#scan)| No | No | No | No| [Yes](how-to-lineage-powerbi.md)|
||[SAP ECC](register-scan-sapecc-source.md)| [Yes](register-scan-sapecc-source.md#register)| [Yes](register-scan-sapecc-source.md#scan)| No | No | No | No| [Yes](how-to-lineage-sapecc.md)|
||[SAP S4HANA](register-scan-saps4hana-source.md)| [Yes](register-scan-saps4hana-source.md#register)| [Yes](register-scan-saps4hana-source.md#scan)| No | No | No | No| [Yes](how-to-lineage-sapecc.md)|

\* Purview relies on UPDATE_TIME metadata from Azure Database for MySQL for incremental scans. In some cases, this field might not persist in the database and a full scan is performed. For more information, see [The INFORMATION_SCHEMA TABLES Table](https://dev.mysql.com/doc/refman/5.7/en/information-schema-tables-table.html) for MySQL. 

> [!NOTE]
> Currently, Purview can't scan an asset that has `/`, `\`, or `#` in its name. To scope your scan and avoid scanning assets that have those characters in the asset name, use the example in [Register and scan an Azure SQL Database](register-scan-azure-sql-database.md#creating-the-scan).

\* Purview relies on UPDATE_TIME metadata from Azure Database for MySQL for incremental scans. In some cases, this field might not persist in the database and a full scan is performed. For more information, see [The INFORMATION_SCHEMA TABLES Table](https://dev.mysql.com/doc/refman/5.7/en/information-schema-tables-table.html) for MySQL. 

> [!NOTE]
> Currently, Purview can't scan an asset that has `/`, `\`, or `#` in its name. To scope your scan and avoid scanning assets that have those characters in the asset name, use the example in [Register and scan an Azure SQL Database](register-scan-azure-sql-database.md#creating-the-scan).

## Scan regions
The following is a list of all the Azure data source (data center) regions where the Purview scanner runs. If your Azure data source is in a region outside of this list, the scanner will run in the region of your Purview instance.
 
### Purview scanner regions

- EastUs
- EastUs2 
- SouthCentralUS
- WestUs
- WestUs2
- SoutheastAsia
- WestEurope
- NorthEurope
- UkSouth
- AustraliaEast
- CanadaCentral
- BrazilSouth
- CentralIndia
- JapanEast
- SouthAfricaNorth
- FranceCentral
- KoreaCentral
- CentralUS
- NorthCentralUS
- EastAsia
- WestCentralUS
- AustraliaSoutheast

## Next steps

- [Register and scan Azure Blob storage source](register-scan-azure-blob-storage-source.md)
