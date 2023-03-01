---
title: Understanding resource sets
description: This article explains what resource sets are and how Microsoft Purview creates them.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 02/17/2023
---

# Understanding resource sets

This article helps you understand how Microsoft Purview uses resource sets to map data assets to logical resources.

## Background info

At-scale data processing systems typically store a single table in storage as multiple files. In the Microsoft Purview Data Catalog, this concept is represented by using resource sets. A resource set is a single object in the catalog that represents a large number of assets in storage.

For example, suppose your Spark cluster has persisted a DataFrame into an Azure Data Lake Storage (ADLS) Gen2 data source. Although in Spark the table looks like a single logical resource, on the disk there are likely thousands of Parquet files, each of which represents a partition of the total DataFrame's contents. IoT data and web log data have the same challenge. Imagine you have a sensor that outputs log files several times a second. It won't take long until you have hundreds of thousands of log files from that single sensor.

## How Microsoft Purview detects resource sets

Microsoft Purview supports detecting resource sets in Azure Blob Storage, ADLS Gen1, ADLS Gen2, Azure Files, and Amazon S3.

Microsoft Purview automatically detects resource sets when scanning. This feature looks at all of the data that's ingested via scanning and compares it to a set of defined patterns.

For example, suppose you scan a data source whose URL is `https://myaccount.blob.core.windows.net/mycontainer/machinesets/23/foo.parquet`. Microsoft Purview looks at the path segments and determines if they match any built-in patterns. It has built-in patterns for GUIDs, numbers, date formats, localization codes (for example, en-us), and so on. In this case, the number pattern matches *23*. Microsoft Purview assumes that this file is part of a resource set named `https://myaccount.blob.core.windows.net/mycontainer/machinesets/{N}/foo.parquet`.

Or, for a URL like `https://myaccount.blob.core.windows.net/mycontainer/weblogs/en_au/23.json`, Microsoft Purview matches both the localization pattern and the number pattern, producing a resource set named `https://myaccount.blob.core.windows.net/mycontainer/weblogs/{LOC}/{N}.json`.

Using this strategy, Microsoft Purview would map the following resources to the same resource set, `https://myaccount.blob.core.windows.net/mycontainer/weblogs/{LOC}/{N}.json`:

- `https://myaccount.blob.core.windows.net/mycontainer/weblogs/cy_gb/1004.json`
- `https://myaccount.blob.core.windows.net/mycontainer/weblogs/cy_gb/234.json`
- `https://myaccount.blob.core.windows.net/mycontainer/weblogs/de_Ch/23434.json`

### File types that Microsoft Purview will not detect as resource sets

Microsoft Purview intentionally doesn't try to classify most document file types like Word, Excel, or PDF as Resource Sets. The exception is CSV format since that is a common partitioned file format.

## How Microsoft Purview scans resource sets

When Microsoft Purview detects resources that it thinks are part of a resource set, it switches from a full scan to a sample scan. A sample scan opens only a subset of the files that it thinks are in the resource set. For each file it opens, it uses its schema and runs its classifiers. Microsoft Purview then finds the newest resource among the opened resources and uses that resource's schema and classifications in the entry for the entire resource set in the catalog.

## Advanced resource sets

Microsoft Purview can customize and further enrich your resource set assets through the **Advanced Resource Sets** capability. Advanced resource sets allow Microsoft Purview to understand the underlying partitions of data ingested and enables the creation of [resource set pattern rules](how-to-resource-set-pattern-rules.md) that customize how Microsoft Purview groups resource sets during scanning. 
 
When Advanced Resource Sets are enabled, Microsoft Purview runs extra aggregations to compute the following information about resource set assets:

- A sample path from a file that comprises the resource set.
- A partition count that shows how many files make up the resource set. 
- The total size of all files that comprise the resource set. 

These properties can be found on the asset details page of the resource set.

:::image type="content" source="media/concept-resource-sets/resource-set-properties.png" alt-text="The properties computed when advanced resource sets is on" border="true":::

### Turning on advanced resource sets

Advanced resource sets are off by default in all new Microsoft Purview instances. Advanced resource sets can be enabled from **Account information** in the management hub. Only those users who are added to the Data Curator role at root collection, can manage Advanced Resource Sets settings.

:::image type="content" source="media/concept-resource-sets/advanced-resource-set-toggle.png" alt-text="Turn on Advanced resource set." border="true":::

After enabling advanced resource sets, the additional enrichments will occur on all newly ingested assets. The Microsoft Purview team recommends waiting an hour before scanning in new data lake data after toggling on the feature.

> [!IMPORTANT]
> Enabling advanced resource sets will impact the refresh rate of asset and classification insights. When advanced resource sets are on, asset and classification insights will only update twice a day.

## Built-in resource set patterns

Microsoft Purview supports the following resource set patterns. These patterns can appear as a name in a directory or as part of a file name.
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


## How resource sets are displayed in the Microsoft Purview Data Catalog

When Microsoft Purview matches a group of assets into a resource set, it attempts to extract the most useful information to use as a display name in the catalog. Some examples of the default naming convention applied: 

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

When scanning a storage account, Microsoft Purview uses a set of defined patterns to determine if a group of assets is a resource set. In some cases, Microsoft Purview's resource set grouping may not accurately reflect your data estate. These issues can include:

- Incorrectly marking an asset as a resource set
- Putting an asset into the wrong resource set
- Incorrectly marking an asset as not being a resource set

To customize or override how Microsoft Purview detects which assets are grouped as resource sets and how they're displayed within the catalog, you can define pattern rules in the management center. For step-by-step instructions and syntax, see [resource set pattern rules](how-to-resource-set-pattern-rules.md).

## Known limitations with resource sets

- By default, resource set assets will only be deleted by a scan if [Advanced Resource sets](#advanced-resource-sets) are enabled. If this capability is off, resource set assets can only be deleted manually or via API.

## Next steps

To get started with Microsoft Purview, see [Quickstart: Create a Microsoft Purview account](create-catalog-portal.md).
