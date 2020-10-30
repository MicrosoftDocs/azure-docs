---
title: Sources and scans
description: This article provides conceptual details about sources and scans in Babylon.
author: viseshag
ms.author: viseshag
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 10/30/2020
---

# Introduction
This article covers details regarding sources and scanning.

## Supported sources

Azure Babylon supports the following sources:

| Store type | Supported auth type | Set up scans via UX/PowerShell |
| ---------- | ------------------- | ------------------------------ |
| On-premises SQL Server                   | SQL Auth                        | PowerShell                                |
| Azure Synapse Analytics (formerly SQL DW)            | SQL Auth, Service Principal, MSI               | UX/PowerShell                             |
| Azure SQL Database (DB)                  | SQL Auth, Service Principal, MSI               | UX/PowerShell/Managed Scanning PowerShell |
| Azure SQL Database Managed Instance      | SQL Auth, Service Principal, MSI               | UX    |
| Azure Blob Storage                       | Account Key; SAS Token; Service Principal, MSI | UX/Managed Scanning PowerShell            |
| Azure Data Explorer                      | Service Principal                              | UX/Managed Scanning PowerShell            |
| Azure Data Lake Storage Gen1 (ADLS Gen1) | Service Principal                              | UX/Managed Scanning PowerShell            |
| Azure Data Lake Storage Gen2 (ADLS Gen2) | Account Key; Service Principal, MSI            | UX/Managed Scanning PowerShell            |
| Cosmos DB                                 | Account Key                                    | UX/Managed Scanning PowerShell            |
| Azure File Storage                       | Account Key                                    | UX/PowerShell

## File types supported for scanning
Structured file formats supported by extension: AVRO, ORC, PARQUET, CSV, JSON, PSV, SSV, TSV, TXT, XML
Document file formats supported by extension: DOC, DOCM, DOCX, DOT, ODP, ODS, ODT, PDF, POT, PPS, PPSX, PPT, PPTM, PPTX, XLC, XLS, XLSB, XLSM, XLSX, XLT
We also support custom file extensions and custom parsers.

### Sampling within a file
For all structured file formats (AVRO, ORC, PARQUET, CSV, JSON, PSV, SSV, TSV, TXT, XML)
- Scanner samples 128 rows in each column or 1 MB, whichever is lower.
For document file formats (DOC, DOCM, DOCX, DOT, ODP, ODS, ODT, PDF, POT, PPS, PPSX, PPT, PPTM, PPTX, XLC, XLS, XLSB, XLSM, XLSX, XLT)
- Scanner samples 20 MB of each file.
- If a file > 20MB, then it is not subject to a deep scan (subject to classification), we capture only basic meta data like file name, FQDN, etc.

* CosmosDB collection sampling *

## Resource set file sampling
If we detect a folder or partition file group to be considered a resource set (it matched with a system resource set policy or a customer defined resource set policy), then we subject each folder to sampling
### Delimited files (CSV, PSV, SSV, TSV)
1 in 100 files are sampled (L3 scan) within a folder or group of partition files that are considered a 'Resource set'

### Data lake file types (Parquet, Avro, Orc)
1 in 18446744073709551615 (long max) files are sampled (L3 scan) within a folder or group of partition files that are considered a 'Resource set'

### Other structured file types (JSON, XML, TXT)
1 in 100 files are sampled (L3 scan) within a folder or group of partition files that are considered a 'Resource set'

### SQL objects and CosmosDB entities
Each file is L3 scanned.

### Document file types
 Each file is L3 scanned. Resource set patterns don't apply to these file types.

## Classification
All 105 system classification rules apply to Structured file formats supported. Only the MCE classification rules apply to document fie types (Not the data scan native regex patterns, bloom filter-based detection)
