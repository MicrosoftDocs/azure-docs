---
title: Understanding resource sets
description: This article explains what resource sets are and how Azure Purview creates them.
author: djpmsft
ms.author: daperlov
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 02/03/2021
---

# Understanding resource sets

This article helps you understand how Azure Purview uses resource sets to map data assets to logical resources.
## Background info

At-scale data processing systems typically store a single table on a disk as multiple files. This concept is represented in Azure Purview by using resource sets. A resource set is a single object in the catalog that represents a large number of assets in storage.

For example, suppose your Spark cluster has persisted a DataFrame into an Azure Data Lake Storage (ADLS) Gen2 data source. Although in Spark the table looks like a single logical resource, on the disk there are likely thousands of Parquet files, each of which represents a partition of the total DataFrame's contents. IoT data and web log data have the same challenge. Imagine you have a sensor that outputs log files several times a second. It won't take long until you have hundreds of thousands of log files from that single sensor.

To address the challenge of mapping large numbers of data assets to a single logical resource, Azure Purview uses resource sets.

## How Azure Purview detects resource sets

Azure Purview supports detecting resource sets in Azure Blob Storage, ADLS Gen1, and ADLS Gen2.

Azure Purview automatically detects resource sets when scanning. This feature looks at all of the data that's ingested via scanning and compares it to a set of defined patterns.

For example, suppose you scan a data source whose URL is `https://myaccount.blob.core.windows.net/mycontainer/machinesets/23/foo.parquet`. Azure Purview looks at the path segments and determines if they match any built-in patterns. It has built-in patterns for GUIDs, numbers, date formats, localization codes (for example, en-us), and so on. In this case, the number pattern matches *23*. Azure Purview assumes that this file is part of a resource set named `https://myaccount.blob.core.windows.net/mycontainer/machinesets/{N}/foo.parquet`.

Or, for a URL like `https://myaccount.blob.core.windows.net/mycontainer/weblogs/en_au/23.json`, Azure Purview matches both the localization pattern and the number pattern, producing a resource set named `https://myaccount.blob.core.windows.net/mycontainer/weblogs/{LOC}/{N}.json`.

Using this strategy, Azure Purview would map the following resources to the same resource set, `https://myaccount.blob.core.windows.net/mycontainer/weblogs/{LOC}/{N}.json`:

- `https://myaccount.blob.core.windows.net/mycontainer/weblogs/cy_gb/1004.json`
- `https://myaccount.blob.core.windows.net/mycontainer/weblogs/cy_gb/234.json`
- `https://myaccount.blob.core.windows.net/mycontainer/weblogs/de_Ch/23434.json`

## File types that Azure Purview will not detect as resource sets

Purview intentionally doesn't try to classify most document file types like Word, Excel, or PDF as Resource Sets. The exception is CSV format since that is a common partitioned file format.

## How Azure Purview scans resource sets

When Azure Purview detects resources that it thinks are part of a resource set, it switches from a full scan to a sample scan. In a sample scan, it opens only a subset of the files that it thinks are in the resource set. For each file it does open, it uses its schema and runs its classifiers. Azure Purview then finds the newest resource among the opened resources and uses that resource's schema and classifications in the entry for the entire resource set in the catalog.

## What Azure Purview stores about resource sets

In addition to single schema and classifications, Azure Purview stores the following information about resource sets:

- Data from the latest partition resource it deep scanned.
- Aggregate information about the partition resources that make up the resource set.
- A partition count that shows how many partition resources it found.
- A schema count that shows how many unique schemas it found in the sample set it did deep scans on. This value is either a number between 1–5, or for values greater than 5, 5+.
- A list of partition types when more than a single partition type is included in the resource set. For example, an IoT sensor might output both XML and JSON files, although both are logically part of the same resource set.

## Built-in resource set patterns

Azure Purview supports the following resource set patterns. These patterns can appear as a name in a directory or as part of a file name.
### Regex-based patterns

| Pattern Name | Display Name | Description |
|--------------|--------------|-------------|
| Guid         | {GUID}       | A globally unique identifier as defined in [RFC 4122](https://tools.ietf.org/html/rfc4122) |
| Number       | {N}          | One or more digits |
| Date/Time Formats | {Year}{Month}{Day}{N}     | We support various date/time formats but all are represented with {Year}[delimiter]{Month}[delimiter]{Day} or series of {N}s. |
| 4ByteHex     | {HEX}        | A 4-digit HEX number. |
| Localization | {LOC}        | A language tag as defined in [BCP 47](https://tools.ietf.org/html/bcp47), both - and _ names are supported (for example, en_ca and en-ca) |

### Complex patterns

| Pattern Name | Display Name | Description |
|--------------|--------------|-------------|
| SparkPath    | {SparkPartitions} | Spark partition file identifier |
| Date(yyyy/mm/dd)InPath  | {Year}/{Month}/{Day} | Year/month/day pattern spanning multiple folders |


## How resource sets are displayed in the Azure Purview Catalog

When Azure Purview matches a group of assets into a resource set, it attempts to extract the most useful information to use as a display name in the catalog. Some examples of the default naming convention applied: 

### Example 1

Qualified name: `https://myblob.blob.core.windows.net/sample-data/name-of-spark-output/{SparkPartitions}`

Display name: "name of spark output"

### Example 2

Qualified name: `https://myblob.blob.core.windows.net/my-partitioned-data/{Year}-{Month}-{Day}/{N}-{N}-{N}-{N}/{GUID}`

Display name: "my partitioned data"

### Example 3

Qualified name: `https://myblob.blob.core.windows.net/sample-data/data{N}.csv`

Display name: "data"

## Customizing resource set grouping using pattern rules

hen scanning a storage account, Azure Purview uses a set of defined patterns to determine if a group of assets is a resource set. In some cases, Azure Purview's resource set grouping may not accurately reflect your data estate. These issues can include:

- Incorrectly marking an asset as a resource set
- Putting an asset into the wrong resource set
- Incorrectly marking an asset as not being a resource set

To customize or override how Azure Purview detects which assets are grouped as resource sets and how they are displayed within the catalog, you can define pattern rules in the management center. For step-by-step instructions and syntax, please see [resource set pattern rules](how-to-resource-set-pattern-rules.md).
## Next steps

To get started with Azure Purview, see [Quickstart: Create an Azure Purview account](create-catalog-portal.md).
