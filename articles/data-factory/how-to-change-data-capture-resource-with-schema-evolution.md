---
title: Capture changed data with schema evolution using change data capture resource
description: This tutorial provides step-by-step instructions on how to capture changed data with schema evolution from Azure SQL DB to Delta sink using a change data capture resource.
author: KrishnakumarRukmangathan
ms.author: krirukm
ms.reviewer: 
ms.service: data-factory
ms.subservice:
ms.topic: conceptual
ms.custom: 
ms.date: 07/21/2023
---

# How to capture changed data with schema evolution from Azure SQL DB to Delta sink using a Change Data Capture (CDC) resource
[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

In this tutorial, you will use the Azure Data Factory user interface (UI) to create a new Change Data Capture (CDC) resource that picks up changed data from an Azure SQL Database source to Delta Lake stored in Azure Data Lake Storage (ADLS) Gen2 in real-time showcasing the support of schema evolution. The configuration pattern in this tutorial can be modified and expanded upon.

In this tutorial, you follow these steps:
* Create a Change Data Capture resource.
* Make dynamic schema changes to source table.
* Validate schema changes at target Delta sink.

## Prerequisites

* **Azure subscription.** If you don't have an Azure subscription, create a free Azure account before you begin.
* **Azure SQL Database.** You use Azure SQL DB as a source data store. If you don’t have an Azure SQL DB, create one in the Azure portal first before continuing the tutorial. 
* **Azure storage account.** You use delta lake stored in ADLS Gen 2 storage as a target data store. If you don't have a storage account, see Create an Azure storage account for steps to create one.

## Create a change data capture artifact


1.	Navigate to the **Author** blade in your data factory. You see a new top-level artifact below **Pipelines** called **Change Data Capture (preview)**.
  
  :::image type="content" source="media/adf-cdc/change-data-capture-resource-100.png" alt-text="Screenshot of new top level artifact shown under Factory resources panel." lightbox="media/adf-cdc/change-data-capture-resource-100.png":::
  
2.	To create a new **Change Data Capture**, hover over **Change Data Capture (preview)** until you see 3 dots appear. Select on the **Change Data Capture (preview) Actions**.

  :::image type="content" source="media/adf-cdc/change-data-capture-resource-101.png" alt-text="Screenshot of Change Data Capture (preview) Actions after hovering on the new top-level artifact." lightbox="media/adf-cdc/change-data-capture-resource-101.png":::

3.	Select **New CDC (preview)**. This opens a flyout to begin the guided process. 

  :::image type="content" source="media/adf-cdc/change-data-capture-resource-102.png" alt-text="Screenshot of a list of Change Data Capture actions." lightbox="media/adf-cdc/change-data-capture-resource-102.png":::
  
4.	You are prompted to name your CDC resource. By default, the name is set to “adfcdc” and continue to increment up by 1. You can replace this default name with your own. 

  :::image type="content" source="media/adf-cdc/change-data-capture-resource-103.png" alt-text="Screenshot of the text box to update the name of the resource.":::
  
5.	 Use the drop-down selection list to choose your data source. For this tutorial, we use **Azure SQL Database**. 

  :::image type="content" source="media/adf-cdc/change-data-capture-resource-104.png" alt-text="Screenshot of the guided process flyout with source options in a drop-down selection menu."::: 

6.	You will then be prompted to select a linked service. Create a new linked service or select an existing one. 

  :::image type="content" source="media/adf-cdc/change-data-capture-resource-105.png" alt-text="Screenshot of the selection box to choose or create a new linked service.":::

7.	Once the linked service is selected, you will be prompted for selection of the source table. Use the checkbox to select the source table(s) then select the **Incremental column** using the drop-down selection. 

  :::image type="content" source="media/adf-cdc/change-data-capture-resource-106.png" alt-text="Screenshot of the selection box to choose source table(s) and selection of incremental column.":::

> [!NOTE]
> Only table(s) with supported incremental column data types are listed here.

> [!NOTE]
> To enable Change Data Capture (CDC) with schema evolution in SQL Azure Database source, we should choose watermark column-based tables rather than native SQL CDC enabled tables.

8.	Once you’ve selected the source table(s), select **Continue** to set your data target.
   
     :::image type="content" source="media/adf-cdc/change-data-capture-resource-107.png" alt-text="Screenshot of the continue button in the guided process to proceed to select data targets.":::

9.	Then, select a **Target type** using the drop-down selection. For this tutorial, we select **Delta**. 

  :::image type="content" source="media/adf-cdc/change-data-capture-resource-108.png" alt-text="Screenshot of a drop-down selection menu of all data target types.":::

10.	You are prompted to select a linked service. Create a new linked service or select an existing one. 
 
  :::image type="content" source="media/adf-cdc/change-data-capture-resource-109.png" alt-text="Screenshot of the selection box to choose or create a new linked service to your data target.":::

11. Use the **Browse** button to select your target data folder.
    
  :::image type="content" source="media/adf-cdc/change-data-capture-resource-110.png" alt-text="Screenshot of a folder icon to browse for a folder path.":::

> [!NOTE]
> You can either use **Browse** button under Target base path which helps you to auto-populate the browse path for all the new table(s) selected for source (or) use **Browse** button outside to individually select the folder path.

12.	Once you’ve selected a folder path, select **Continue** button.

  :::image type="content" source="media/adf-cdc/change-data-capture-resource-111.png" alt-text="Screenshot of the continue button in the guided process to proceed to next step.":::

13.	You automatically land in a new change data capture tab, where you can configure your new resource. 

  :::image type="content" source="media/adf-cdc/change-data-capture-resource-112.png" alt-text="Screenshot of the change data capture studio." lightbox="media/adf-cdc/change-data-capture-resource-112.png":::
  
14.	A new mapping will automatically be created for you. You can update the **Source** and **Target** selections for your mapping by using the drop-down selection lists. 

  :::image type="content" source="media/adf-cdc/change-data-capture-resource-113.png" alt-text="Screenshot of the source to target mapping in the change data capture studio." lightbox="media/adf-cdc/change-data-capture-resource-113.png":::

15.	Once you’ve selected your tables, you should see that their columns are auto mapped by default with the **Auto map** toggle on. Auto map automatically maps the columns by name in the sink, picks up new column changes when source schema evolves and flows this to the supported sink types.

  :::image type="content" source="media/adf-cdc/change-data-capture-resource-114.png" alt-text="Screenshot of default Auto map toggle set to on." lightbox="media/adf-cdc/change-data-capture-resource-114.png":::

> [!NOTE]
> Schema evolution works with Auto map toggle set to on only. If you want to know how to edit column mappings or include transformations, please refer [Capture changed data with a change data capture resource](how-to-change-data-capture-resource.md)

16.	You can click the **Keys** link and select the Keys column to be used for tracking the delete operations.

  :::image type="content" source="media/adf-cdc/change-data-capture-resource-115.png" alt-text="Screenshot of Keys link to enable Keys column selection." lightbox="media/adf-cdc/change-data-capture-resource-115.png":::

  :::image type="content" source="media/adf-cdc/change-data-capture-resource-116.png" alt-text="Screenshot of selecting a Keys column for the selected source.":::

17. Once your mappings are complete, set your CDC latency using the **Set Latency** button. 

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-117.png" alt-text="Screenshot of the set frequency button at the top of the canvas." lightbox="media/adf-cdc/change-data-capture-resource-117.png":::
   
18.	Select the latency of your CDC and select **Apply** to make the changes. By default, it is set to **15 minutes**. For this tutorial, we select the **Real-time** latency. Real-time latency will continuously keep picking up changes in your source data in a less than 1-minute interval.

    For other latencies, say if you select 15 minutes, every 15 minutes, your change data capture will process your source data and pick up any changed data since the last processed time.

:::image type="content" source="media/adf-cdc/change-data-capture-resource-118.png" alt-text="Screenshot of the set frequency selection menu.":::

19.	Once everything has been finalized, select the **Publish All** to publish your changes. 

:::image type="content" source="media/adf-cdc/change-data-capture-resource-119.png" alt-text="Screenshot of the publish button at the top of the canvas." lightbox="media/adf-cdc/change-data-capture-resource-119.png":::

> [!NOTE] 
> If you do not publish your changes, you will not be able to start your CDC resource. The start button will be greyed out. 

20.	Select **Start** to start running your **Change Data Capture**. 

  :::image type="content" source="media/adf-cdc/change-data-capture-resource-120.png" alt-text="Screenshot of the start button at the top of the canvas." lightbox="media/adf-cdc/change-data-capture-resource-120.png":::

21. Using monitoring page, you can see how many changes (insert/update/delete) were read and written and other diagnostic information. 

  :::image type="content" source="media/adf-cdc/change-data-capture-resource-121.png" alt-text="Screenshot of the monitoring page of a selected change data capture." lightbox="media/adf-cdc/change-data-capture-resource-121.png":::

  :::image type="content" source="media/adf-cdc/change-data-capture-resource-122.png" alt-text="Screenshot of the monitoring page of a selected change data capture with detailed view." lightbox="media/adf-cdc/change-data-capture-resource-122.png":::

22.	You can validate that the change data has landed onto the Delta Lake stored in Azure Data Lake Storage (ADLS) Gen2 in delta format

  :::image type="content" source="media/adf-cdc/change-data-capture-resource-123.png" alt-text="Screenshot of the target delta folder." lightbox="media/adf-cdc/change-data-capture-resource-123.png":::
  
23. You can validate schema of the change data that has landed. 

  :::image type="content" source="media/adf-cdc/change-data-capture-resource-124.png" alt-text="Screenshot of actual delta file." lightbox="media/adf-cdc/change-data-capture-resource-124.png":::

## Make dynamic schema changes at source

1.	Now you can proceed to make schema level changes to the source tables. For this tutorial, we will use the Alter table T-SQL to add a new column "PersonalEmail" to the source table.  

  :::image type="content" source="media/adf-cdc/change-data-capture-resource-125.png" alt-text="Screenshot of Alter command in Azure Data Studio.":::

2.	You can validate that the new column "PersonalEmail" has been added to the existing table. 

  :::image type="content" source="media/adf-cdc/change-data-capture-resource-126.png" alt-text="Screenshot of the new table design.":::
  
## Validate schema changes at target Delta

1.	Validate change data with schema changes have landed at the Delta sink. For this tutorial, you can see the new column "PersonalEmail" has been added to the sink. 

   :::image type="content" source="media/adf-cdc/change-data-capture-resource-128.png" alt-text="Screenshot of actual Delta file with schema change." lightbox="media/adf-cdc/change-data-capture-resource-128.png":::

## Next steps
- [Learn more about the change data capture resource](concepts-change-data-capture-resource.md)
  
