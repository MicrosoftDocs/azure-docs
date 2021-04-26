---
title: Purview Connector Overview
description: This article outlines the different data stores and functionalities supported in Purview
author: chandrakavya
ms.author: kchandra
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 11/13/2020
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
||[Azure Synapse Analytics (formerly SQL DW)](register-scan-azure-synapse-analytics.md)|Yes| Yes| No| Yes| Yes| Yes|
|Database|[Oracle DB](register-scan-oracle-source.md)|Yes| Yes| No| No| No| Yes|
||[SQL Server](register-scan-on-premises-sql-server.md)|Yes| Yes| No| Yes| Yes| Yes|
||[Teradata](register-scan-teradata-source.md)|Yes| Yes| No| No| No| Yes|
|Power BI|[Power BI](register-scan-power-bi-tenant.md)|Yes| Yes| No| No| No| Yes|
|Services and apps|[SAP ECC](register-scan-sapecc-source.md)|Yes| Yes| No| Yes| Yes| Yes|
||[SAP S4HANA](register-scan-saps4hana-source.md)|Yes| Yes| No| Yes| Yes| Yes|

## Next steps

- [Register and scan Azure Blob storage source](register-scan-azure-blob-storage-source.md)