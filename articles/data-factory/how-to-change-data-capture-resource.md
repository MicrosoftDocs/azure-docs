---
title: Capture changed data by using a change data capture resource
description: Get step-by-step instructions on how to capture changed data from Azure Data Lake Storage Gen2 to Azure SQL Database by using a change data capture (CDC) resource.
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
  
1. Hover over **Change Data Capture (preview)** until three dots appear. Then select **Change Data Capture (preview) Actions**.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-62.png" alt-text="Screenshot of the button for change data capture actions appearing over the new top-level artifact." lightbox="media/adf-cdc/change-data-capture-resource-62.png":::

1. Select **New CDC (preview)**. This step opens a flyout to begin the guided process.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-63.png" alt-text="Screenshot of a list of change data capture actions." lightbox="media/adf-cdc/change-data-capture-resource-63.png":::
  
1. You're prompted to name your CDC resource. By default, the name is "adfcdc" with a number that increments by 1. You can replace this default name with a name that you choose.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-64.png" alt-text="Screenshot of the text box to update the name of a resource.":::

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

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-96.png" alt-text="Screenshot of the Continue button in the guided process to select data targets.":::

   You can choose to add multiple source folders by using the plus (**+**) button. The other sources must also use the same linked service that you already selected.

1. Select a **Target type** value by using the dropdown list. For this article, select **Azure SQL Database**.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-69.png" alt-text="Screenshot of a dropdown menu of all data target types.":::

1. You're prompted to select a linked service. Create a new linked service or select an existing one.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-70.png" alt-text="Screenshot of the box to choose or create a linked service to your data target.":::

1. For **Target tables**, you can create a new target table or select an existing one:

   * To create a target table, select the **New entities** tab, and then select **Edit new tables**.

     :::image type="content" source="media/adf-cdc/change-data-capture-resource-72.png" alt-text="Screenshot of the tab to create new tables for your target.":::

   * To select an existing table, select the **Existing entities** tab, and then use the checkbox to choose a table. Use the **Preview** button to view your table data.

     :::image type="content" source="media/adf-cdc/change-data-capture-resource-71.png" alt-text="Screenshot of the tab to choose tables for your target.":::

   If existing tables at the target have matching names, they're selected by default under **Existing entities**. If not, new tables with matching names are created under **New entities**. Additionally, you can edit new tables by using the **Edit new tables** button.

1. You can use the checkboxes to choose multiple target tables from your SQL database. After you finish choosing target tables, select **Continue**.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-73.png" alt-text="Screenshot of the Continue button in the guided process to proceed to the next step.":::

1. A new tab for capturing change data appears. This tab is the CDC studio, where you can configure your new resource.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-74.png" alt-text="Screenshot of the change data capture studio." lightbox="media/adf-cdc/change-data-capture-resource-74.png":::

   A new mapping is automatically created for you. You can update the **Source Table** and **Target Table** selections for your mapping by using the dropdown lists.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-75.png" alt-text="Screenshot of the source-to-target mapping in the change data capture studio." lightbox="media/adf-cdc/change-data-capture-resource-75.png":::

1. After you select your tables, their columns are mapped by default with the **Auto map** toggle turned on. **Auto map** automatically maps the columns by name in the sink, picks up new column changes when the source schema evolves, and flows this information to the supported sink types.

   If you want to use **Auto map** and not change any column mappings, go directly to step 18.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-76.png" alt-text="Screenshot of the toggle for automatic mapping turned on." lightbox="media/adf-cdc/change-data-capture-resource-76.png":::

   If you want to enable the column mappings, select the mappings and turn off the **Auto map** toggle. Then, select the **Column mappings** button to view the mappings.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-77.png" alt-text="Screenshot of mapping selection, the toggle for automatic mapping turned off, and the button for column mappings." lightbox="media/adf-cdc/change-data-capture-resource-77.png":::
  
   You can switch back to automatic mapping anytime by turning on the **Auto map** toggle.
  
1. View your column mappings. Use the dropdown lists to edit your column mappings for **Mapping method**, **Source column**, and **Target column**.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-78.png" alt-text="Screenshot of the page for editing column mappings." lightbox="media/adf-cdc/change-data-capture-resource-78.png":::

   From this page, you can:

   * Add more column mappings by using the **New mapping** button. Use the dropdown lists to make selections for **Mapping method**, **Source column**, and **Target column**.
   * Select the **Keys** column if you want to track the delete operation for supported sink types.
   * Select the **Refresh** button under **Data preview** to visualize how the data looks at the target.
  
   :::image type="content" source="media/adf-cdc/change-data-capture-resource-79.png" alt-text="Screenshot of the button for adding column mappings, the dropdown list for mapping methods, the Keys column, and the Refresh button." lightbox="media/adf-cdc/change-data-capture-resource-79.png":::

1. When your mapping is complete, select the arrow button to return to the main CDC canvas.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-80.png" alt-text="Screenshot of the button to go back to the table mapping page." lightbox="media/adf-cdc/change-data-capture-resource-80.png":::

1. You can add more source-to-target mappings in one CDC artifact. Use the **Edit** button to add more data sources and targets. Then, select **New mapping** and use the drop-down lists to set a new source and target. You can turn **Auto map** on or off for each of these mappings independently.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-81.png" alt-text="Screenshot of the button to add new sources and the button to set a new source-to-target mapping." lightbox="media/adf-cdc/change-data-capture-resource-81.png":::

1. After your mappings are complete, set your CDC latency by using the **Set Latency** button.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-82.png" alt-text="Screenshot of the Set Latency button at the top of the canvas." lightbox="media/adf-cdc/change-data-capture-resource-82.png":::
  
1. Select the latency of your CDC, and then select **Apply** to make the changes.

   By default, latency is set to **15 minute**. The example in this article uses the **Real-time** option for latency. Real-time latency continuously picks up changes in your source data in intervals of less than 1 minute.

   For other latencies (for example, if you select 15 minutes), your change data capture will process your source data and pick up any changed data since the last processed time.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-83.png" alt-text="Screenshot of the options for setting latency.":::

   > [!NOTE]
   > If support is extended to streaming data integration (Azure Event Hubs and Kafka data sources), the latency will be set to **Real-time** by default.

1. After you finish configuring your CDC, select **Publish all** to publish your changes.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-84.png" alt-text="Screenshot of the publish button at the top of the canvas." lightbox="media/adf-cdc/change-data-capture-resource-84.png":::

   > [!NOTE]
   > If you don't publish your changes, you won't be able to start your CDC resource. The **Start** button in the next step will be unavailable.

1. Select **Start** to start running your change data capture.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-85.png" alt-text="Screenshot of the Start button at the top of the canvas." lightbox="media/adf-cdc/change-data-capture-resource-85.png":::

## Monitor your change data capture

1. Open the **Monitor** pane by using either of these methods:

   * Select **Monitor** in the Azure portal.

     :::image type="content" source="media/adf-cdc/change-data-capture-resource-86.png" alt-text="Screenshot of the Monitor button in the Azure portal.":::

   * Select the monitoring icon from the CDC designer.

     :::image type="content" source="media/adf-cdc/change-data-capture-resource-87.png" alt-text="Screenshot of the monitoring icon at the top of the CDC canvas." lightbox="media/adf-cdc/change-data-capture-resource-87.png":::

1. Select **Change Data Capture (preview)** to view your CDC resources.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-88.png" alt-text="Screenshot of the Change Data Capture button.":::

   The **Change Data Capture** pane shows the **Source**, **Target**, **Status**, and **Last processed** information for your change data capture.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-89.png" alt-text="Screenshot of an overview of the change data capture monitoring page." lightbox="media/adf-cdc/change-data-capture-resource-89.png":::

1. Select the name of your CDC to see more details. You can see how many changes (insert, update, or delete) were read and written, along with other diagnostic information.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-90.png" alt-text="Screenshot of the detailed monitoring of a selected change data capture." lightbox="media/adf-cdc/change-data-capture-resource-90.png":::

   If you set up multiple mappings in your change data capture, each mapping appears as a different color. Select the bar to see specific details for each mapping, or use the diagnostics information at the bottom of the pane.

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-91.png" alt-text="Screenshot of the detailed monitoring information for a change data capture with multiple source-to-target mappings." lightbox="media/adf-cdc/change-data-capture-resource-91.png":::
  
   :::image type="content" source="media/adf-cdc/change-data-capture-resource-92.png" alt-text="Screenshot of a detailed breakdown of each mapping in a change data capture artifact." lightbox="media/adf-cdc/change-data-capture-resource-92.png":::
  
## Next steps

* [Learn more about the CDC resource](concepts-change-data-capture-resource.md)
