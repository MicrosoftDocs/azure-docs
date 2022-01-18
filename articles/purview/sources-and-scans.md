---
title: Supported data sources and file types
description: This article provides conceptual details about supported data sources and file types in Azure Purview.
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-map
ms.topic: conceptual
ms.date: 09/27/2021
ms.custom: references_regions 
---
# Supported data sources and file types in Azure Purview

This article discusses supported data sources, file types and scanning concepts in Azure Purview.

## Supported data sources

Azure Purview supports all the data sources listed [here](purview-connector-overview.md).

## File types supported for scanning

The following file types are supported for scanning, for schema extraction and classification where applicable:

- Structured file formats supported by extension: AVRO, ORC, PARQUET, CSV, JSON, PSV, SSV, TSV, TXT, XML, GZIP
 > [!Note]
 > * Azure Purview scanner only supports schema extraction for the structured file types listed above.
 > * For AVRO, ORC, and PARQUET file types, Azure Purview scanner does not support schema extraction for files that contain complex data types (for example, MAP, LIST, STRUCT). 
 > * Azure Purview scanner supports scanning snappy compressed PARQUET types for schema extraction and classification. 
 > * For GZIP file types, the GZIP must be mapped to a single csv file within. 
 > Gzip files are subject to System and Custom Classification rules. We currently don't support scanning a gzip file mapped to multiple files within, or any file type other than csv. 
 > * For delimited file types(CSV, PSV, SSV, TSV, TXT), we do not support data type detection. The data type will be listed as "string" for all columns. 
- Document file formats supported by extension: DOC, DOCM, DOCX, DOT, ODP, ODS, ODT, PDF, POT, PPS, PPSX, PPT, PPTM, PPTX, XLC, XLS, XLSB, XLSM, XLSX, XLT
- Azure Purview also supports custom file extensions and custom parsers.

## Sampling within a file

In Azure Purview terminology,
- L1 scan: Extracts basic information and meta data like file name, size and fully qualified name
- L2 scan: Extracts schema for structured file types and database tables
- L3 scan: Extracts schema where applicable and subjects the sampled file to system and custom classification rules

For all structured file formats, Azure Purview scanner samples files in the following way:

- For structured file types, it samples the top 128 rows in each column or the first 1 MB, whichever is lower.
- For document file formats, it samples the first 20 MB of each file.
    - If a document file is larger than 20 MB, then it is not subject to a deep scan (subject to classification). In that case, Azure Purview captures only basic meta data like file name and fully qualified name.
- For **tabular data sources(SQL, CosmosDB)**, it samples the top 128 rows. 

## Resource set file sampling

A folder or group of partition files is detected as a *resource set* in Azure Purview, if it matches with a system resource set policy or a customer defined resource set policy. If a resource set is detected, then Azure Purview will sample each folder that it contains. Learn more about resource sets [here](concept-resource-sets.md).

File sampling for resource sets by file types:

- **Delimited files (CSV, PSV, SSV, TSV)** - 1 in 100 files are sampled (L3 scan) within a folder or group of partition files that are considered a 'Resource set'
- **Data Lake file types (Parquet, Avro, Orc)** - 1 in 18446744073709551615 (long max) files are sampled (L3 scan) within a folder or group of partition files that are considered a *resource set*
- **Other structured file types (JSON, XML, TXT)** - 1 in 100 files are sampled (L3 scan) within a folder or group of partition files that are considered a 'Resource set'
- **SQL objects and CosmosDB entities** - Each file is L3 scanned.
- **Document file types** - Each file is L3 scanned. Resource set patterns don't apply to these file types.

## Classification

All 206 system classification rules apply to structured file formats. Only the MCE classification rules apply to document file types (Not the data scan native regex patterns, bloom filter-based detection). For more information on supported classifications, see [Supported classifications in Azure Purview](supported-classifications.md).

## Next steps

- [Scans and ingestion in Azure Purview](concept-scans-and-ingestion.md)
- [Manage data sources in Azure Purview](manage-data-sources.md)
