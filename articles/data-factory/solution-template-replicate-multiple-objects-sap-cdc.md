---
title: Replicate multiple objects from SAP via SAP CDC
description: Learn how to use a solution template to replicate multiple objects from SAP via SAP CDC in Azure Data Factory.
author: dearandyxu
ms.author: yexu
ms.service: data-factory
ms.subservice: tutorials
ms.topic: conceptual
ms.date: 11/28/2022
---

# Replicate multiple objects from SAP via SAP CDC

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes a solution template that you can use to replicate multiple ODP objects from SAP via SAP CDC connector to Azure Data Lake Gen2 in Delta format with key partition.

## About this solution template

This template reads an external control file in csv format on your storage store, which contains your SAP ODP contexts, SAP ODP objects and key columns from SAP source system as well as your containers, folders and partitions from Azure Data Lake Gen2 destination store. It then copies each of the SAP ODP object from SAP system to Azure Data Lake Gen2 in Delta format.

The template contains three activities:
- **Lookup** retrieves the SAP ODP objects list to be loaded and the destination store path from an external control file on your Azure Data Lake Gen2 store.
- **ForEach** gets the SAP ODP objects list from the Lookup activity and iterates each object to the mapping dataflow activity.
- **Mapping dataflow** replicates each SAP ODP object from SAP system to Azure Data Lake Gen2 in Delta format. It will do initial full load in the first run and then do incremental load in the subsequent runs automatically. It will merge the changes to Azure Data Lake Gen2 in Delta format.

An external control file in csv format is required for in this template. The schema for the control file is as below.
- *context* is your SAP ODP context from the source SAP system. You can get more details [here](sap-change-data-capture-prepare-linked-service-source-dataset.md#set-up-the-source-dataset).
- *object* is your SAP ODP object name to be loaded from the SAP system. You can get more details [here](sap-change-data-capture-prepare-linked-service-source-dataset.md#set-up-the-source-dataset).
- *keys* are your key column names from SAP ODP objects used to do the dedupe in mapping dataflow.
- *container* is your container name in the Azure Data Lake Gen2 as the destination store.
- *folder* is your folder name in the Azure Data Lake Gen2 as the destination store. 
- *partition* is your column name used to create partitions for each unique value in such column to write data into Delta format on Azure Data Lake Gen2 via Spark cluster used by mapping dataflow. You can get more details [here](concepts-data-flow-performance.md#key)
	
	:::image type="content" source="media/solution-template-replicate-multiple-objects-sap-cdc/sap-cdc-template-control-file.png" alt-text="Screenshot of SAP CDC control file.":::
	   

## How to use this solution template

1. Create and upload a control file into CSV format to your Azure Data Lake Gen2 as the destination store. The default container to store the control file is **demo** and default control file name is **SAP2DeltaLookup.csv**.

	:::image type="content" source="media/solution-template-replicate-multiple-objects-sap-cdc/sap-cdc-template-control-file.png" alt-text="Screenshot of SAP CDC control file.":::
	
2. Go to the **Replicate multiple tables from SAP ODP to Azure Data Lake Storage Gen2 in Delta format** template and **click** it. 

	:::image type="content" source="media/solution-template-replicate-multiple-objects-sap-cdc/sap-cdc-template-search-template.png" alt-text="Screenshot of SAP CDC search template.":::
	
3. Click **Continue** and input your linked service connected to SAP system as source, and the linked service connected to Azure Data Lake Gen2 as the destination. You can get more details about SAP CDC linked service from [here](sap-change-data-capture-prepare-linked-service-source-dataset.md#set-up-a-linked-service). Be aware that your external control file should be uploaded to the same account of Azure Data Lake Gen2.

	:::image type="content" source="media/solution-template-replicate-multiple-objects-sap-cdc/sap-cdc-template-use-template.png" alt-text="Screenshot of SAP CDC use template.":::
	
4. Click **Use this template** and your will see the pipeline has been ready to use.

	:::image type="content" source="media/solution-template-replicate-multiple-objects-sap-cdc/sap-cdc-template-pipeline.png" alt-text="Screenshot of SAP CDC pipeline.":::
	   
## Next steps

- [Azure Data Factory SAP CDC](sap-change-data-capture-introduction-architecture.md)
- [Azure Data Factory change data capture](concepts-change-data-capture.md)
