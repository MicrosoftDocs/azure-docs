---
title: Calculate blob count and total size per container
description: Learn how to calculate the count and total size of blobs per container.
services: storage
author: mhopkins-msft

ms.author: mhopkins
ms.date: 02/25/2021
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
---

# Calculate the count and total size of blobs per container

Calculating the blob count and total size of blobs per container is difficult. The following example leverages the Azure Blob Storage inventory feature and Azure Synapse to calculate these values.

> [!NOTE]
> Metadata is not included in this method. Inventory uses list blobs API with default parameters, so it doesn’t support snapshots, $ containers etc yet (we are requesting). And due to complexity of snapshot effective size, it can’t support even snapshots can be listed. Query Acceleration doesn’t help for the missing functions on string and groupby, especially the later one doesn’t align with the improvement strategy.

## Enable inventory reports

[Enable inventory reports](blob-inventory.md#enable-inventory-reports) on your storage account

## Create a Synapse workspace

[Create a Synapse workspace](azure/synapse-analytics/get-started-create-workspace)

## Run a SQL query

Run the following SQL query in your Azure Synapse workspace to [read the inventory CSV file](azure/synapse-analytics/sql/query-single-csv-file#read-a-csv-file). For the `bulk` parameter, use the URL to the inventory report CSV file that you would like to analyze.

```sql
SELECT LEFT(Name, CHARINDEX('/', Name) - 1) AS Container, SUM(Content_Length) As TotalBlobSize, COUNT(*) As TotalBlobCount
FROM openrowset(
    bulk 'https://demo2francecentral.blob.core.windows.net/inventory/2021/01/25/19-27-36/DefaultRule-AllBlobs.csv',
    format = 'csv', parser_version = '2.0', firstrow = 2
    )
WITH (
    [Name] VARCHAR (1024) COLLATE Latin1_General_100_CI_AI_SC_UTF8,
    [Creation_Time] VARCHAR (100) COLLATE Latin1_General_100_CI_AI_SC_UTF8,
    [Last_Modified] VARCHAR (100) COLLATE Latin1_General_100_CI_AI_SC_UTF8,
    [Content_Length] bigint,
    [Content_MD5] VARCHAR(100) COLLATE Latin1_General_100_CI_AI_SC_UTF8,
    [BlobType] VARCHAR(100) COLLATE Latin1_General_100_CI_AI_SC_UTF8,
    [AccessTier] VARCHAR(100) COLLATE Latin1_General_100_CI_AI_SC_UTF8,
    [AccessTierChangeTime] VARCHAR(100) COLLATE Latin1_General_100_CI_AI_SC_UTF8
) AS Source
GROUP BY LEFT(Name, CHARINDEX('/', Name) - 1)
```

## Output

See the blob count and total size per container

:::image type="content" source="media/calculate-blob-count-size/output.jpg" alt-text="Output from running the script to calculate blob count and total size.":::

## Next steps

- [Use Azure Storage blob inventory to manage blob data](blob-inventory.md)
- [Calculate the total billing size of a blob container](../scripts/storage-blobs-container-calculate-billing-size-powershell)
