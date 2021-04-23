---
title: Supported data sources and file types
description: This article provides conceptual details about supported data sources and file types in Purview.
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 11/24/2020
ms.custom: references_regions 
---
# Supported data sources and file types in Azure Purview

This article discusses supported data sources, file types and scanning concepts in Purview.

## Supported data sources

Azure Purview supports the following sources:

| Store type | Supported auth type | Set up scans via UX/PowerShell |
| ---------- | ------------------- | ------------------------------ |
| On-premises SQL Server                   | SQL Auth                        | UX                                |
| Azure Synapse Analytics (formerly SQL DW)            | SQL Auth, Service Principal, MSI               | UX                             |
| Azure SQL Database (DB)                  | SQL Auth, Service Principal, MSI               | UX |
| Azure SQL Database Managed Instance      | SQL Auth, Service Principal, MSI               | UX    |
| Azure Blob Storage                       | Account Key, Service Principal, MSI | UX            |
| Azure Data Explorer                      | Service Principal                              | UX            |
| Azure Data Lake Storage Gen1 (ADLS Gen1) | Service Principal, MSI                              | UX            |
| Azure Data Lake Storage Gen2 (ADLS Gen2) | Account Key, Service Principal, MSI            | UX            |
| Azure Cosmos DB                          | Account Key                                    | UX            |


> [!Note]
> Azure Data Lake Storage Gen2 is now generally available. We recommend that you start using it today. For more information, see the [product page](https://azure.microsoft.com/en-us/services/storage/data-lake-storage/).

## File types supported for scanning

The following file types are supported for scanning, for schema extraction and classification where applicable:

- Structured file formats supported by extension: AVRO, ORC, PARQUET, CSV, JSON, PSV, SSV, TSV, TXT, XML, GZIP
- Document file formats supported by extension: DOC, DOCM, DOCX, DOT, ODP, ODS, ODT, PDF, POT, PPS, PPSX, PPT, PPTM, PPTX, XLC, XLS, XLSB, XLSM, XLSX, XLT
- Purview also supports custom file extensions and custom parsers.
 
> [!Note]
> Every Gzip file must be mapped to a single csv file within. Gzip files are subject to System and Custom Classification rules. We currently don't support scanning a gzip file mapped to multiple files within, or any file type other than csv. 

## Sampling within a file

In Purview terminology,
- L1 scan: Extracts basic information and meta data like file name, size and fully qualified name
- L2 scan: Extracts schema for structured file types and database tables
- L3 scan: Extracts schema where applicable and subjects the sampled file to system and custom classification rules

For all structured file formats, Purview scanner samples files in the following way:

- For structured file types, it samples 128 rows in each column or 1 MB, whichever is lower.
- For document file formats, it samples 20 MB of each file.
    - If a document file is larger than 20 MB, then it is not subject to a deep scan (subject to classification). In that case, Purview captures only basic meta data like file name and fully qualified name.

## Resource set file sampling

A folder or group of partition files is detected as a *resource set* in Purview, if it matches with a system resource set policy or a customer defined resource set policy. If a resource set is detected, then Purview will sample each folder that it contains. Learn more about resource sets [here](concept-resource-sets.md).

File sampling for resource sets by file types:

- **Delimited files (CSV, PSV, SSV, TSV)** - 1 in 100 files are sampled (L3 scan) within a folder or group of partition files that are considered a 'Resource set'
- **Data Lake file types (Parquet, Avro, Orc)** - 1 in 18446744073709551615 (long max) files are sampled (L3 scan) within a folder or group of partition files that are considered a *resource set*
- **Other structured file types (JSON, XML, TXT)** - 1 in 100 files are sampled (L3 scan) within a folder or group of partition files that are considered a 'Resource set'
- **SQL objects and CosmosDB entities** - Each file is L3 scanned.
- **Document file types** - Each file is L3 scanned. Resource set patterns don't apply to these file types.

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

## Classification

All 105 system classification rules apply to structured file formats. Only the MCE classification rules apply to document file types (Not the data scan native regex patterns, bloom filter-based detection). For more information on supported classifications, see [Supported classifications in Azure Purview](supported-classifications.md).

## Next steps

- [Tutorial: Run the starter kit and scan data](tutorial-scan-data.md)
- [Manage data sources in Azure Purview (Preview)](manage-data-sources.md)