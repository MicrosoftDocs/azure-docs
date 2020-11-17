---
title: Purview Connector Overview
description: This article outlines the different data stores and functionalities supported in Purview
author: chandrakavya
ms.author: kchandra
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: overview
ms.date: 11/13/2020
---

# Supported data stores

Babylon supports the following data stores. Click each data store to
learn the supported capabilities and the corresponding configurations in
details.

|**Category**|  **Data Store**  |**Metadata Extraction**|**Full Scan**|**Incremental Scan**|**Scoped Scan**|**Classification**|**Lineage**|
|---|---|---|---|---|---|---|---|
| Azure | [Azure Blob Storage](https://github.com/MicrosoftDocs/azure-docs-pr/blob/release-preview-babylon/articles/purview/register-scan-azure-blob-storage-source.md)| &#9745;| &#9745;| &#9745;| &#9745;| &#9745;| &#9745;|
||[Azure Cosmos DB](https://github.com/MicrosoftDocs/azure-docs-pr/blob/release-preview-babylon/articles/purview/register-scan-azure-cosmos-database.md)|&#9745;| &#9745;| &#9745;| &#9745;| &#9745;| &#9745;|
||[Azure Data Explorer](https://github.com/MicrosoftDocs/azure-docs-pr/blob/release-preview-babylon/articles/purview/register-scan-azure-data-explorer.md)|&#9745;| &#9745;| &#9745;| &#9745;| &#9745;| &#9745;|
||[Azure Data Lake Storage Gen1](https://github.com/MicrosoftDocs/azure-docs-pr/blob/release-preview-babylon/articles/purview/register-scan-adls-gen1.md)|&#9745;| &#9745;| &#9745;| &#9745;| &#9745;| &#9745;|
||[Azure Data Lake Storage Gen2](https://github.com/MicrosoftDocs/azure-docs-pr/blob/release-preview-babylon/articles/purview/register-scan-adls-gen2.md)|&#9745;| &#9745;| &#9745;| &#9745;| &#9745;| &#9745;|
||[Azure SQL Database](https://github.com/MicrosoftDocs/azure-docs-pr/blob/release-preview-babylon/articles/purview/register-scan-azure-sql-database.md)|&#9745;| &#9745;| No| &#9745;| &#9745;| &#9745;|
||[Azure SQL Database Managed Instance](https://github.com/MicrosoftDocs/azure-docs-pr/blob/release-preview-babylon/articles/purview/register-scan-azure-sql-database-managed-instance.md)|&#9745;| &#9745;| No| &#9745;| &#9745;| &#9745;|
||[Azure Synapse Analytics](https://github.com/MicrosoftDocs/azure-docs-pr/blob/release-preview-babylon/articles/purview/register-scan-azure-synapse-analytics.md)|&#9745;| &#9745;| No| &#9745;| &#9745;| &#9745;|
|Database|[SQL Server](https://github.com/MicrosoftDocs/azure-docs-pr/blob/release-preview-babylon/articles/purview/register-scan-on-premises-sql-server.md)|&#9745;| &#9745;| No| &#9745;| &#9745;| &#9745;|
|Power BI|[Power BI](https://github.com/MicrosoftDocs/azure-docs-pr/blob/release-preview-babylon/articles/purview/register-scan-power-bi-tenant.md)|&#9745;| &#9745;| No| No| No| &#9745;|

## Next steps

- [Register and scan Azure Blob storage source](register-scan-azure-blob-storage-source.md)