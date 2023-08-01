---
title: Capture changed data by using a change data capture resource
description: Get step-by-step instructions on how to capture changed data from Azure Data Lake Storage Gen2 to Azure SQL Database by using a change data capture resource.
author: n0elleli
ms.author: noelleli
ms.reviewer: 
ms.service: data-factory
ms.subservice:
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 06/06/2023
---

# Capture changed data from Azure Data Lake Storage Gen2 to Azure SQL Database by using a change data capture resource

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

In this article, you use the Azure Data Factory user interface to create a change data capture (CDC) resource. The resource picks up changed data from an Azure Data Lake Storage Gen2 source and adds it to Azure SQL Database in real time.

In this article, you learn how to:

* Create a CDC resource.
* Monitor CDC activity.

You can modify and expand the configuration pattern in this article.

## Prerequisites

Before you begin the procedures in this article, make sure that you have these resources:

* **Azure subscription**. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free).
* **SQL database**. You use Azure SQL Database as a source data store. If you don't have a SQL database, create one in the Azure portal.
* **Storage account**. You use Delta Lake stored in Azure Data Lake Storage Gen2 as a target data store. If you don't have a storage account, see [Create a storage account](/azure/storage/common/storage-account-create) for the steps to create one.

## Create a CDC artifact

1. Go to the **Author** pane in your data factory. Below **Pipelines**, a new top-level artifact called **Change Data Capture (preview)** appears.
  
   :::image type="content" source="media/adf-cdc/change-data-capture-resource-61.png" alt-text="Screenshot of a new top-level artifact for change data capture on the Factory Resources pane." lightbox="media/adf-cdc/change-data-capture-resource-61.png":::
  
1. Hover over **Change Data Capture (preview)** until you three dots appear. Then select **Change Data Capture (preview) Actions**.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-62.png" alt-text="Screenshot of Change Data Capture (preview) Actions after hovering over the new top-level artifact." lightbox="media/adf-cdc/change-data-capture-resource-62.png":::

1. Select **New CDC (preview)**. This step opens a flyout to begin the guided process.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-63.png" alt-text="Screenshot of a list of change data capture actions." lightbox="media/adf-cdc/change-data-capture-resource-63.png":::
  
1. You're prompted to name your CDC resource. By default, the name is "adfcdc" with a number that increments by 1. You can replace this default name with your own.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-64.png" alt-text="Screenshot of the text box to update the name of the resource.":::

1. Use the dropdown list to choose your data source. For this article, select **DelimitedText**.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-65.png" alt-text="Screenshot of the guided process flyout with source options in a dropdown list.":::

1. You're prompted to select a linked service. Create a new linked service or select an existing one.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-93.png" alt-text="Screenshot of the box to choose or create a linked service.":::
  
1. Use the **Source settings** area to optionally set advanced source configurations, including column and row delimiters.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-94.png" alt-text="Screenshot of advanced source settings to set delimiters.":::

   If you don't manually edit these source settings, they're set to the defaults.

1. Use the **Browse** button to select your source data folder.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-95.png" alt-text="Screenshot of a folder icon to browse for a folder path.":::

1. After you select a folder path, select **Continue** to set your data target.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-96.png" alt-text="Screenshot of the continue button in the guided process to proceed to select data targets.":::

   You can choose to add multiple source folders with the **+** button. The other sources must also use the same linked service that you've already selected.

1. Select a **Target type** using the drop-down selection. For this article, we select **Azure SQL Database**.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-69.png" alt-text="Screenshot of a drop-down selection menu of all data target types.":::

1. You are prompted to select a linked service. Create a new linked service or select an existing one.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-70.png" alt-text="Screenshot of the selection box to choose or create a new linked service to your data target.":::

1. Create new **Target table(s)** or select an existing **Target table(s)**. Under **Existing entities** use the checkbox to select an existing Target table(s) or Under **New entities** select **Edit new tables** to create new Target table(s). The **Preview** button allows you to view your table data.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-71.png" alt-text="Screenshot of the existing entities to choose tables for your target.":::

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-72.png" alt-text="Screenshot of the new entities tab to create new tables for your target.":::
  
   If there are existing tables at the Target with matching name(s), they will be selected by default under **Existing entities**. If not, new tables with matching names are created under **New entities**. Additionally, you can edit new tables by using the **Edit new tables** button.

1. Select **Continue** when you have finalized your selections.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-73.png" alt-text="Screenshot of the continue button in the guided process to proceed to the next step.":::

   You can choose multiple target tables from your SQL database. Use the check boxes to select all targets.

1. You automatically land in a new change data capture tab, where you can configure your new resource.

  :::image type="content" source="media/adf-cdc/change-data-capture-resource-74.png" alt-text="Screenshot of the change data capture studio." lightbox="media/adf-cdc/change-data-capture-resource-74.png":::

1. A new mapping will automatically be created for you. You can update the **Source** and **Target** selections for your mapping by using the drop-down selection lists.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-75.png" alt-text="Screenshot of the source to target mapping in the change data capture studio." lightbox="media/adf-cdc/change-data-capture-resource-75.png":::

1. After you select your tables, you should see that their columns are auto mapped by default with the **Auto map** toggle on. Auto map automatically maps the columns by name in the sink, picks up new column changes when source schema evolves and flows this to the supported sink types. If you would want to retain Auto map and not change any column mappings, proceed to **Step 19** directly.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-76.png" alt-text="Screenshot of default Auto map toggle set to on." lightbox="media/adf-cdc/change-data-capture-resource-76.png":::

1. If you would want to enable the column mappings, select the mappings and switch the **Auto map** toggle off, and then select the **Column mappings** button to view the column mappings.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-77.png" alt-text="Screenshot of mapping selection, Auto map toggle set to off and column mapping button." lightbox="media/adf-cdc/change-data-capture-resource-77.png":::
  
   You can switch back to the default Auto mapping anytime by switching the **Auto map** toggle on.
  
1. Here you can view your column mappings. Use the drop-down lists to edit your column mappings for Mapping method, Source column, and Target column.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-78.png" alt-text="Screenshot of the column mapping page to allow users to editing column mappings." lightbox="media/adf-cdc/change-data-capture-resource-78.png":::

   You can add more column mappings using the **New mapping** button. Use the drop-down lists to select the **Mapping method**, **Source column**, and **Target** column. Also, if you want to track the delete operation for supported sink types, you can select the **Keys** column. You can select **Data Preview - Refresh** button to visualize how the data looks at the target.
  
   :::image type="content" source="media/adf-cdc/change-data-capture-resource-79.png" alt-text="Screenshot of the Add new mapping icon to add new column mappings, drop down with mapping methods, select Keys column and Data preview refresh button for allowing users to visualize data at target." lightbox="media/adf-cdc/change-data-capture-resource-79.png":::

1. When your mapping is complete, select the back arrow to return to the main CDC canvas.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-80.png" alt-text="Screenshot of back button to go back to table mapping page." lightbox="media/adf-cdc/change-data-capture-resource-80.png":::

1. You can add more source to target mappings in one CDC artifact. Use the Edit button to add more data sources and targets. Then, select **New mapping** and use the drop-down lists to set a new source and target mapping. Also Auto map can be set on or off for each of these mappings independently.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-81.png" alt-text="Screenshot of the edit button to add new sources and new mapping button to set a new source to target mapping." lightbox="media/adf-cdc/change-data-capture-resource-81.png":::

1. After your mappings are complete, set your CDC latency using the **Set Latency** button.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-82.png" alt-text="Screenshot of the set frequency button at the top of the canvas." lightbox="media/adf-cdc/change-data-capture-resource-82.png":::
  
1. Select the latency of your CDC and select **Apply** to make the changes. By default, it is set to **15 minutes**. For this article, we select the **Real-time** latency. Real-time latency will continuously keep picking up changes in your source data in a less than 1-minute interval.

   For other latencies, say if you select 15 minutes, every 15 minutes, your change data capture will process your source data and pick up any changed data since the last processed time.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-83.png" alt-text="Screenshot of the set frequency selection menu.":::

   > [!NOTE]
   > Support for **streaming data integration** (EventHub & Kafka data sources) is coming soon. When available the latency will be set to Real-time by default.

1. After everything has been finalized, select the **Publish All** to publish your changes.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-84.png" alt-text="Screenshot of the publish button at the top of the canvas." lightbox="media/adf-cdc/change-data-capture-resource-84.png":::

   > [!NOTE]
   > If you don't publish your changes, you won't be able to start your CDC resource. The start button will be unavailable.

1. Select **Start** to start running your **Change Data Capture**.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-85.png" alt-text="Screenshot of the start button at the top of the canvas." lightbox="media/adf-cdc/change-data-capture-resource-85.png":::

## Monitor your Change data capture

1. To monitor your change data capture, go to the **Monitor** blade or select the monitoring icon from the CDC designer.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-86.png" alt-text="Screenshot of the monitoring blade.":::

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-87.png" alt-text="Screenshot of the monitoring button at the top of the CDC canvas." lightbox="media/adf-cdc/change-data-capture-resource-87.png":::

1. Select **Change Data Capture (preview)** to view your CDC resources.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-88.png" alt-text="Screenshot of the Change Data Capture monitoring section.":::

1. Here you can see the **Source**, **Target**, **Status**, and **Last processed** time of your change data capture.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-89.png" alt-text="Screenshot of an overview of the change data capture monitoring page." lightbox="media/adf-cdc/change-data-capture-resource-89.png":::

1. Select the name of your CDC to see more details. You can see how many changes (insert/update/delete) were read and written and other diagnostic information.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-90.png" alt-text="Screenshot of the detailed monitoring of a selected change data capture." lightbox="media/adf-cdc/change-data-capture-resource-90.png":::

   If you have multiple mappings set up in your Change data capture, each mapping will show as a different color. Click on the bar to see specific details for each mapping or use the Diagnostics at the bottom of the screen.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-91.png" alt-text="Screenshot of the detailed monitoring page of a change data capture with multiple sources to target mappings." lightbox="media/adf-cdc/change-data-capture-resource-91.png":::
  
   :::image type="content" source="media/adf-cdc/change-data-capture-resource-92.png" alt-text="Screenshot of a detailed breakdown of each mapping in the change data capture artifact." lightbox="media/adf-cdc/change-data-capture-resource-92.png":::
  
## Next steps

* [Learn more about the change data capture resource](concepts-change-data-capture-resource.md)
