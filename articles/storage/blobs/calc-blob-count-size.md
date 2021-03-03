---
title: Calculate blob count and total size per container
description: Learn how to calculate the count and total size of blobs per container.
services: storage
author: mhopkins-msft

ms.author: mhopkins
ms.date: 03/03/2021
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
---

# Calculate the count and total size of blobs per container

This article uses the Azure Blob Storage inventory feature and Azure Synapse to calculate the blob count and total size of blobs per container. These values are useful when estimating storage billing costs.

> [!NOTE]
> Blob metadata is not included in this method. The Azure Blob Storage inventory feature uses the [List Blobs](/rest/api/storageservices/list-blobs) REST API with default parameters. So, the example doesn’t support snapshots, '$' containers, and so on.

## Enable inventory reports

The first step in this method is to [enable inventory reports](blob-inventory.md#enable-inventory-reports) on your storage account.

## Create a Synapse workspace

Next, [create a Synapse workspace](/azure/synapse-analytics/get-started-create-workspace) where you will execute a SQL query to report the inventory results.

## Create the SQL query

After you create your Synapse workspace, navigate to [https://web.azuresynapse.net](https://web.azuresynapse.net).

## Run the SQL query

Run the following SQL query in your Azure Synapse workspace to [read the inventory CSV file](/azure/synapse-analytics/sql/query-single-csv-file#read-a-csv-file). For the `bulk` parameter, use the URL to the inventory report CSV file that you would like to analyze.

```sql
SELECT LEFT(Name, CHARINDEX('/', Name) - 1) AS Container, SUM(Content_Length) As TotalBlobSize, COUNT(*) As TotalBlobCount
FROM openrowset(
    bulk '<URL to your inventory CSV file>',
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

The blob count and total size per container are reported in the **Results** pane.

:::image type="content" source="media/calc-blob-count-size/output.jpg" alt-text="Output from running the script to calculate blob count and total size.":::

## Next steps

- [Use Azure Storage blob inventory to manage blob data](blob-inventory.md)
- [Calculate the total billing size of a blob container](../scripts/storage-blobs-container-calculate-billing-size-powershell.md)
