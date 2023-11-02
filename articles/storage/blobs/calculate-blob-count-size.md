---
title: Calculate blob count and size using Azure Storage inventory
description: Learn how to calculate the count and total size of blobs per container.
services: storage
author: normesta

ms.author: normesta
ms.date: 12/02/2022
ms.service: azure-blob-storage
ms.topic: how-to
ms.custom: subject-rbac-steps
---

# Calculate blob count and total size per container using Azure Storage inventory

This article uses the Azure Blob Storage inventory feature and Azure Synapse to calculate the blob count and total size of blobs per container. These values are useful when optimizing blob usage per container.

## Enable inventory reports

The first step in this method is to [enable inventory reports](blob-inventory.md#enabling-inventory-reports) on your storage account. You may have to wait up to 24 hours after enabling inventory reports for your first report to be generated.

When you have an inventory report to analyze, grant yourself read access to the container where the report CSV file resides by assigning yourself the **Storage Blob Data Reader** role. Be sure to use the email address of the account you're using to run the report. To learn how to assign an Azure role to a user with Azure role-based access control (Azure RBAC), follow the instructions provided in [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

> [!NOTE]
> To calculate the blob size from the inventory report, make sure to include the **Content-Length** schema field in your rule definition.

## Create an Azure Synapse workspace

Next, [create an Azure Synapse workspace](../../synapse-analytics/get-started-create-workspace.md) where you will execute a SQL query to report the inventory results.

## Create the SQL query

After you create your Azure Synapse workspace, do the following steps.

1. Navigate to [https://web.azuresynapse.net](https://web.azuresynapse.net).
1. Select the **Develop** tab on the left edge.
1. Select the large plus sign (+) to add an item.
1. Select **SQL script**.

    :::image type="content" source="media/calculate-blob-count-size/synapse-sql-script.png" alt-text="Select SQL script to create a new query":::

## Run the SQL query

1. Add the following SQL query in your Azure Synapse workspace to [read the inventory CSV file](../../synapse-analytics/sql/query-single-csv-file.md#read-a-csv-file).

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
- [Tutorial: Calculate container statistics by using Databricks](storage-blob-calculate-container-statistics-databricks.md)
- [Calculate the total billing size of a blob container](../scripts/storage-blobs-container-calculate-billing-size-powershell.md)
