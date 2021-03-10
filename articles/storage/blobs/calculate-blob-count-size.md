---
title: Calculate blob count and size using Azure Storage inventory
description: Learn how to calculate the count and total size of blobs per container.
services: storage
author: mhopkins-msft

ms.author: mhopkins
ms.date: 03/10/2021
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
---

# Calculate blob count and total size per container using Azure Storage inventory

This article uses the Azure Blob Storage inventory feature and Azure Synapse to calculate the blob count and total size of blobs per container. These values are useful when optimizing blob usage per container.

Blob metadata is not included in this method. The Azure Blob Storage inventory feature uses the [List Blobs](/rest/api/storageservices/list-blobs) REST API with default parameters. So, the example doesn’t support snapshots, '$' containers, and so on.

> [!IMPORTANT]
> Blob inventory is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Enable inventory reports

The first step in this method is to [enable inventory reports](blob-inventory.md#enable-inventory-reports) on your storage account. You may have to wait up to 24 hours after enabling inventory reports for your first report to be generated.

When you have an inventory report to analyze, grant yourself blob read access to the container where the report CSV file resides.

1. Navigate to the container with the inventory CSV report file.
1. Select **Access Control (IAM)**, then **Add role assignments**

    :::image type="content" source="media/calculate-blob-count-size/access.png" alt-text="Select add role assignments":::

1. Select **Storage Blob Data Reader** from the **Role** dropdown list.

    :::image type="content" source="media/calculate-blob-count-size/add-role-assignment.png" alt-text="Add the Storage Blob Data Reader role from the dropdown":::

1. Enter the email address of the account you're using to run the report in the **Select** field.

## Create an Azure Synapse workspace

Next, [create an Azure Synapse workspace](/azure/synapse-analytics/get-started-create-workspace) where you will execute a SQL query to report the inventory results.

## Create the SQL query

After you create your Azure Synapse workspace, do the following steps.

1. Navigate to [https://web.azuresynapse.net](https://web.azuresynapse.net).
1. Select the **Develop** tab on the left edge.
1. Select the large plus sign (+) to add an item.
1. Select **SQL script**.

    :::image type="content" source="media/calculate-blob-count-size/synapse-sql-script.png" alt-text="Select SQL script to create a new query":::

## Run the SQL query

1. Add the following SQL query in your Azure Synapse workspace to [read the inventory CSV file](/azure/synapse-analytics/sql/query-single-csv-file#read-a-csv-file).

    For the `bulk` parameter, use the URL of the inventory report CSV file that you want to analyze.

    ```sql
    SELECT LEFT([Name], CHARINDEX('/', [Name]) - 1) AS Container, 
            COUNT(*) As TotalBlobCount,
            SUM([Content-Length]) As TotalBlobSize
    FROM OPENROWSET(
        bulk '<URL to your inventory CSV file>',
        format='csv', parser_version='2.0', header_row=true
    ) AS Source
    GROUP BY LEFT([Name], CHARINDEX('/', [Name]) - 1)
    ```

1. Name your SQL query in the properties pane on the right.

1. Publish your SQL query by pressing CTRL+S or selecting the **Publish all** button.

1. Select the **Run** button to execute the SQL query. The blob count and total size per container are reported in the **Results** pane.

    :::image type="content" source="media/calculate-blob-count-size/output.png" alt-text="Output from running the script to calculate blob count and total size.":::

## Next steps

- [Use Azure Storage blob inventory to manage blob data](blob-inventory.md)
- [Calculate the total billing size of a blob container](../scripts/storage-blobs-container-calculate-billing-size-powershell.md)
