---
title: Purview Connector Overview
description: This article outlines the different data stores and functionalities supported in Purview
author: chandrakavya
ms.author: kchandra
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 08/08/2021
---

# Supported data stores

Purview supports the following data stores. Click each data store to
learn the supported capabilities and the corresponding configurations in
details.

## Purview data sources

|**Category**|  **Data Store**  |**Metadata Extraction**|**Full Scan**|**Incremental Scan**|**Scoped Scan**|**Classification**|**Lineage**|
|---|---|---|---|---|---|---|---|
| Azure | [Azure Blob Storage](register-scan-azure-blob-storage-source.md)| Yes| Yes| Yes| Yes| Yes| Yes|
||[Azure Cosmos DB](register-scan-azure-cosmos-database.md)|Yes| Yes| Yes| Yes| Yes| Yes|
||[Azure Data Explorer](register-scan-azure-data-explorer.md)|Yes| Yes| Yes| Yes| Yes| Yes|
||[Azure Data Lake Storage Gen1](register-scan-adls-gen1.md)|Yes| Yes| Yes| Yes| Yes| Yes|
||[Azure Data Lake Storage Gen2](register-scan-adls-gen2.md)|Yes| Yes| Yes| Yes| Yes| Yes|
||[Azure SQL Database](register-scan-azure-sql-database.md)|Yes| Yes| No| Yes| Yes| Yes|
||[Azure SQL Database Managed Instance](register-scan-azure-sql-database-managed-instance.md)|Yes| Yes| No| Yes| Yes| Yes|
||[Azure Dedicated SQL pool (formerly SQL DW)](register-scan-azure-synapse-analytics.md)|Yes| Yes| No| Yes| Yes| Yes|
||[Azure Synapse Analytics (Workspace)](register-scan-synapse-workspace.md)|Yes| Yes| No| Yes| Yes| Yes|
|Database|[Cassandra](register-scan-cassandra-source.md)|Yes| Yes| No| No| No| Yes|
||[Google BigQuery](register-scan-google-bigquery-source.md)|Yes| Yes| No| No| No| Yes|
||[Hive Metastore DB](register-scan-oracle-source.md)|Yes| Yes| No| No| No| Yes|
||[Oracle DB](register-scan-oracle-source.md)|Yes| Yes| No| No| No| Yes|
||[SQL Server](register-scan-on-premises-sql-server.md)|Yes| Yes| No| Yes| Yes| Yes|
||[Teradata](register-scan-teradata-source.md)|Yes| Yes| No| No| No| Yes|
|Power BI|[Power BI](register-scan-power-bi-tenant.md)|Yes| Yes| No| No| No| Yes|
|Services and apps|[Erwin](register-scan-erwin-source.md)|Yes| Yes| No| No| No| Yes|
||[Looker](register-scan-looker-source.md)|Yes| Yes| No| No| No| Yes|
||[SAP ECC](register-scan-sapecc-source.md)|Yes| Yes| No| No| No| Yes|
||[SAP S4HANA](register-scan-saps4hana-source.md)|Yes| Yes| No| No| No| Yes|
|Multi-cloud|[Amazon RDS](register-scan-amazon-rds.md) )public preview) |Yes| Yes| Yes| Yes| Yes| Yes|
|Multi-cloud|[Amazon S3](register-scan-amazon-s3.md)|Yes| Yes| Yes| Yes| Yes| Yes|

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
