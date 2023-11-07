---
title: Bulk copy from files to database
description: Learn how to use a solution template to copy data in bulk from Azure Data Lake Storage Gen2 to Azure Synapse Analytics / Azure SQL Database.
titleSuffix: Azure Data Factory & Azure Synapse
author: jianleishen
ms.author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 07/20/2023
---

# Bulk copy from files to database

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes a solution template that you can use to copy data in bulk from Azure Data Lake Storage Gen2 to Azure Synapse Analytics / Azure SQL Database.

## About this solution template

This template retrieves files from Azure Data Lake Storage Gen2 source. Then it iterates over each file in the source and copies the file to the destination data store. 

Currently this template only supports copying data in **DelimitedText** format. Files in other data formats can also be retrieved from source data store, but can not be copied to the destination data store.  

The template contains three activities:
- **Get Metadata** activity retrieves files from Azure Data Lake Storage Gen2, and passes them to subsequent *ForEach* activity.
- **ForEach** activity gets files from the *Get Metadata* activity and iterates each file to the *Copy* activity.
- **Copy** activity resides in *ForEach* activity to copy each file from the source data store to the destination data store.

The template defines the following two parameters:
- *SourceContainer* is the root container path where the data is copied from in your Azure Data Lake Storage Gen2. 
- *SourceDirectory* is the directory path under the root container where the data is copied from in your Azure Data Lake Storage Gen2.

## How to use this solution template

1. Open the Azure Data Factory Studio and select the **Author** tab with the pencil icon.
1. Hover over the **Pipelines** section and select the ellipsis that appears to the right side.  Select **Pipeline from template** then.
   :::image type="content" source="media/how-to-send-notifications-to-teams/pipeline-from-template.png" alt-text="Screenshot of the data factory user interface showing the Pipeline from template button.":::
1. Select the **Bulk Copy from Files to Database** template, then select **Continue**. 
   :::image type="content" source="media/solution-template-bulk-copy-from-files-to-database/bulk-copy-files-to-database-template.png" alt-text="Screenshot of the Bulk copy files to database template in the template browser.":::
1. Create a **New** connection to the source Gen2 store as your source, and one to the database for your sink. Then select **Use this template**.

    :::image type="content" source="media/solution-template-bulk-copy-from-files-to-database/select-source-and-sink.png" alt-text="Screenshot of the template editor with source and sink data sources highlighted.":::  
  
1. A new pipeline is created as shown in the following example:

    :::image type="content" source="media/solution-template-bulk-copy-from-files-to-database/new-pipeline.png" alt-text="Review the pipeline":::

1. Select **Debug**, enter the **Parameters**, and then select **Finish**.

    :::image type="content" source="media/solution-template-bulk-copy-from-files-to-database/debug-run.png" alt-text="Click **Debug**":::

1. When the pipeline run completes successfully, you will see results similar to the following example:

    :::image type="content" source="media/solution-template-bulk-copy-from-files-to-database/run-succeeded.png" alt-text="Review the result":::

       
## Next steps

- [Introduction to Azure Data Factory](introduction.md)
