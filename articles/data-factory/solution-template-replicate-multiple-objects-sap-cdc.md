---
title: Replicate multiple objects from SAP via SAP CDC
description: Learn how to use a solution template to replicate multiple objects from SAP via SAP CDC in Azure Data Factory.
author: dearandyxu
ms.author: yexu
ms.service: data-factory
ms.subservice: tutorials
ms.topic: conceptual
ms.date: 10/20/2023
---

# Replicate multiple objects from SAP via SAP CDC

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes a solution template that you can use to replicate multiple ODP objects from SAP via SAP CDC connector to Azure Data Lake Gen2 in Delta format with key partition.

## About this solution template

This template reads an external control file in json format on your storage store, which contains your SAP ODP contexts, SAP ODP objects and key columns from SAP source system as well as your containers, folders and partitions from Azure Data Lake Gen2 destination store. It then copies each of the SAP ODP object from SAP system to Azure Data Lake Gen2 in Delta format.

The template contains three activities:
- **Lookup** retrieves the SAP ODP objects list to be loaded and the destination store path from an external control file on your Azure Data Lake Gen2 store.
- **ForEach** gets the SAP ODP objects list from the Lookup activity and iterates each object to the mapping dataflow activity.
- **Mapping dataflow** replicates each SAP ODP object from SAP system to Azure Data Lake Gen2 in Delta format. It will do initial full load in the first run and then do incremental load in the subsequent runs automatically. It will merge the changes to Azure Data Lake Gen2 in Delta format.

An external control file in json format is required in this template. The schema for the control file is as below.
- *checkPointKey* is your custom key to manage the checkpoint of your changed data capture in ADF. You can get more details [here](concepts-change-data-capture.md#checkpoint).
- *sapContext* is your SAP ODP context from the source SAP system. You can get more details [here](sap-change-data-capture-prepare-linked-service-source-dataset.md#set-up-the-source-dataset).
- *sapObjectName* is your SAP ODP object name to be loaded from the SAP system. You can get more details [here](sap-change-data-capture-prepare-linked-service-source-dataset.md#set-up-the-source-dataset).
- *sapRunMode* is to determine how you want to load SAP object. It can be fullLoad, incrementalLoad or fullAndIncrementalLoad.
- *sapKeyColumns* are your key column names from SAP ODP objects used to do the dedupe in mapping dataflow.
- *sapPartitions* are list of partition conditions leading to separate extraction processes in the connected SAP system.
- *deltaContainer* is your container name in the Azure Data Lake Gen2 as the destination store.
- *deltaFolder* is your folder name in the Azure Data Lake Gen2 as the destination store. 
- *deltaKeyColumns* are your columns used to determine if a row from the source matches a row from the sink when you want to update or delete a row.
- *deltaPartition* is your column used to create partitions for each unique value in such column to write data into Delta format on Azure Data Lake Gen2 via Spark cluster used by mapping dataflow. You can get more details [here](concepts-data-flow-performance.md#key)

A sample control file is as below:
```json
[
  {
    "checkPointKey":"CheckPointFor_ZPERFCDPOS$F",
    "sapContext": "ABAP_CDS",
    "sapObjectName": "ZPERFCDPOS$F",
    "sapRunMode": "fullAndIncrementalLoad",
    "sapKeyColumns": [
      "TABKEY"
    ],
    "sapPartitions": [
	[{
        "fieldName": "TEXTCASE",
        "sign": "I",
        "option": "EQ",
        "low": "1"
       },
       {
        "fieldName": "TEXTCASE",
        "sign": "I",
        "option": "EQ",
        "low": "X"
      }]
    ],
    "deltaContainer":"delta",
    "deltaFolder":"ZPERFCDPOS",
    "deltaKeyColumns":["TABKEY"],
    "deltaPartition":"TEXTCASE",
    "stagingStorageFolder":"stagingcontainer/stagingfolder"
  },
  {
    "checkPointKey":"CheckPointFor_Z0131",
    "sapContext": "SAPI",
    "sapObjectName": "Z0131",
    "sapRunMode": "incrementalLoad",
    "sapKeyColumns": [
      "ID"
    ],
    "sapPartitions": [],
    "deltaContainer":"delta",
    "deltaFolder":"Z0131",
    "deltaKeyColumns":["ID"],
    "deltaPartition":"COMPANY",
    "stagingStorageFolder":"stagingcontainer/stagingfolder"
  }
]
```   

## How to use this solution template

1. Create and upload a control file into json format to your Azure Data Lake Gen2 as the destination store. The default container to store the control file is **demo** and default control file name is **SapToDeltaParameters.json**.

	
2. Go to the **Replicate multiple tables from SAP ODP to Azure Data Lake Storage Gen2 in Delta format** template and **click** it. 

	:::image type="content" source="media/solution-template-replicate-multiple-objects-sap-cdc/sap-cdc-template-search-template.png" alt-text="Screenshot of SAP CDC search template.":::
	
3. Click **Continue** and input your linked service connected to SAP system as source, and the linked service connected to Azure Data Lake Gen2 as the destination. You can get more details about SAP CDC linked service from [here](sap-change-data-capture-prepare-linked-service-source-dataset.md#set-up-a-linked-service). Be aware that your external control file should be uploaded to the same account of Azure Data Lake Gen2.

	:::image type="content" source="media/solution-template-replicate-multiple-objects-sap-cdc/sap-cdc-template-use-template.png" alt-text="Screenshot of SAP CDC use template.":::
	
4. Click **Use this template** and your will see the pipeline has been ready to use.

	:::image type="content" source="media/solution-template-replicate-multiple-objects-sap-cdc/sap-cdc-template-pipeline.png" alt-text="Screenshot of SAP CDC pipeline.":::
	   
## Next steps

- [Azure Data Factory SAP CDC](sap-change-data-capture-introduction-architecture.md)
- [Azure Data Factory change data capture](concepts-change-data-capture.md)
