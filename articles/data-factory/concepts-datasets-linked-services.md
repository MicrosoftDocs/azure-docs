---
title: Datasets
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about datasets in Azure Data Factory and Azure Synapse Analytics pipelines. Datasets represent input/output data.
author: dcstwh
ms.author: weetok
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 02/08/2023
---

# Datasets in Azure Data Factory and Azure Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]


This article describes what datasets are, how they’re defined in JSON format, and how they’re used in Azure Data Factory and Synapse pipelines.

If you’re new to Data Factory, see [Introduction to Azure Data Factory](introduction.md) for an overview.  For more information about Azure Synapse, see [What is Azure Synapse](../synapse-analytics/overview-what-is.md)

## Overview
An Azure Data Factory or Synapse workspace can have one or more pipelines. A **pipeline** is a logical grouping of **activities** that together perform a task. The activities in a pipeline define actions to perform on your data. Now, a **dataset** is a named view of data that simply points or references the data you want to use in your **activities** as inputs and outputs. Datasets identify data within different data stores, such as tables, files, folders, and documents. For example, an Azure Blob dataset specifies the blob container and folder in Blob Storage from which the activity should read the data.

Before you create a dataset, you must create a [**linked service**](concepts-linked-services.md) to link your data store to the service. Linked services are much like connection strings, which define the connection information needed for the service to connect to external resources. Think of it this way; the dataset represents the structure of the data within the linked data stores, and the linked service defines the connection to the data source. For example, an Azure Storage linked service links a storage account. An Azure Blob dataset represents the blob container and the folder within that Azure Storage account that contains the input blobs to be processed.

Here’s a sample scenario. To copy data from Blob storage to a SQL Database, you create two linked services: Azure Blob Storage and Azure SQL Database. Then, create two datasets: Delimited Text dataset (which refers to the Azure Blob Storage linked service, assuming you have text files as source) and Azure SQL Table dataset (which refers to the Azure SQL Database linked service). The Azure Blob Storage and Azure SQL Database linked services contain connection strings that the service uses at runtime to connect to your Azure Storage and Azure SQL Database, respectively. The Delimited Text dataset specifies the blob container and blob folder that contains the input blobs in your Blob Storage, along with format-related settings. The Azure SQL Table dataset specifies the SQL table in your SQL Database to which the data is to be copied.

The following diagram shows the relationships among pipeline, activity, dataset, and linked services:

:::image type="content" source="media/concepts-datasets-linked-services/relationship-between-data-factory-entities.png" alt-text="Relationship between pipeline, activity, dataset, linked services":::

## Create a dataset with UI

# [Azure Data Factory](#tab/data-factory)

To create a dataset with the Azure Data Factory Studio, select the Author tab (with the pencil icon), and then the plus sign icon, to choose **Dataset**.

:::image type="content" source="media/concepts-datasets-linked-services/create-dataset.png" alt-text="Shows the Author tab of the Azure Data Factory Studio with the new dataset button selected.":::

You’ll see the new dataset window to choose any of the connectors available in Azure Data Factory, to set up an existing or new linked service.

:::image type="content" source="media/concepts-datasets-linked-services/choose-dataset-source.png" alt-text="Shows the new dataset window where you can choose the type of linked service to any of the supported data factory connectors.":::

Next you’ll be prompted to choose the dataset format.

:::image type="content" source="media/concepts-datasets-linked-services/choose-dataset-format.png" alt-text="Shows the dataset format window allowing you to choose a format for the new dataset.":::

Finally, you can choose an existing linked service of the type you selected for the dataset, or create a new one if one isn’t already defined.

:::image type="content" source="media/concepts-datasets-linked-services/choose-or-define-linked-service.png" alt-text="Shows the set properties window where you can choose an existing dataset of the type selected previously, or create a new one.":::

Once you create the dataset, you can use it within any pipelines in the Azure Data Factory.

# [Synapse Analytics](#tab/synapse-analytics)

To create a dataset with the Synapse Studio, select the Data tab, and then the plus sign icon, to choose **Integration dataset**.

:::image type="content" source="media/concepts-datasets-linked-services/create-dataset-synapse.png" alt-text="Shows the Author tab of Synapse Studio with the new integration dataset button selected.":::

You’ll see the new integration dataset window to choose any of the connectors available in Azure Synapse, to set up an existing or new linked service.

:::image type="content" source="media/concepts-datasets-linked-services/choose-dataset-source-synapse.png" alt-text="Shows the new integration dataset window where you can choose the type of linked service to any of the supported Azure Synapse connectors.":::

Next you’ll be prompted to choose the dataset format.

:::image type="content" source="media/concepts-datasets-linked-services/choose-dataset-format.png" alt-text="Shows the dataset format window allowing you to choose a format for the new dataset.":::

Finally, you can choose an existing linked service of the type you selected for the dataset, or create a new one if one isn’t already defined.

:::image type="content" source="media/concepts-datasets-linked-services/choose-or-define-linked-service.png" alt-text="Shows the set properties window where you can choose an existing dataset of the type selected previously, or create a new one.":::

Once you create the dataset, you can use it within any pipelines within the Synapse workspace.

---

## Dataset JSON
A dataset is defined in the following JSON format:

```json
{
    "name": "<name of dataset>",
    "properties": {
        "type": "<type of dataset: DelimitedText, AzureSqlTable etc...>",
        "linkedServiceName": {
                "referenceName": "<name of linked service>",
                "type": "LinkedServiceReference",
        },
        "schema":[

        ],
        "typeProperties": {
            "<type specific property>": "<value>",
            "<type specific property 2>": "<value 2>",
        }
    }
}
```
The following table describes properties in the above JSON:

Property | Description | Required |
-------- | ----------- | -------- |
name | Name of the dataset. See [Naming rules](naming-rules.md). |  Yes |
type | Type of the dataset. Specify one of the types supported by Data Factory (for example: DelimitedText, AzureSqlTable). <br/><br/>For details, see [Dataset types](#dataset-type). | Yes |
schema | Schema of the dataset, represents the physical data type and shape. | No |
typeProperties | The type properties are different for each type. For details on the supported types and their properties, see [Dataset type](#dataset-type). | Yes |

When you import the schema of dataset, select the **Import Schema** button and choose to import from the source or from a local file. In most cases, you'll import the schema directly from the source. But if you already have a local schema file (a Parquet file or CSV with headers), you can direct the service to base the schema on that file.

In copy activity, datasets are used in source and sink. Schema defined in dataset is optional as reference. If you want to apply column/field mapping between source and sink, refer to [Schema and type mapping](copy-activity-schema-and-type-mapping.md).

In Data Flow, datasets are used in source and sink transformations. The datasets define the basic data schemas. If your data has no schema, you can use schema drift for your source and sink. Metadata from the datasets appears in your source transformation as the source projection. The projection in the source transformation represents the Data Flow data with defined names and types.

## Dataset type

The service supports many different types of datasets, depending on the data stores you use. You can find the list of supported data stores from [Connector overview](connector-overview.md) article. Select a data store to learn how to create a linked service and a dataset for it.

For example, for a Delimited Text dataset, the dataset type is set to **DelimitedText** as shown in the following JSON sample:

```json
{
    "name": "DelimitedTextInput",
    "properties": {
        "linkedServiceName": {
            "referenceName": "AzureBlobStorage",
            "type": "LinkedServiceReference"
        },
        "annotations": [],
        "type": "DelimitedText",
        "typeProperties": {
            "location": {
                "type": "AzureBlobStorageLocation",
                "fileName": "input.log",
                "folderPath": "inputdata",
                "container": "adfgetstarted"
            },
            "columnDelimiter": ",",
            "escapeChar": "\\",
            "quoteChar": "\""
        },
        "schema": []
    }
}
```

## Create datasets
You can create datasets by using one of these tools or SDKs: [.NET API](quickstart-create-data-factory-dot-net.md), [PowerShell](quickstart-create-data-factory-powershell.md), [REST API](quickstart-create-data-factory-rest-api.md), Azure Resource Manager Template, and Azure portal

## Current version vs. version 1 datasets

Here are some differences between datasets in Data Factory current version (and Azure Synapse), and the legacy Data Factory version 1:

- The external property isn’t supported in the current version. It's replaced by a [trigger](concepts-pipeline-execution-triggers.md).
- The policy and availability properties aren’t supported in the current version. The start time for a pipeline depends on [triggers](concepts-pipeline-execution-triggers.md).
- Scoped datasets (datasets defined in a pipeline) aren’t supported in the current version.

## Next steps
See the following tutorial for step-by-step instructions for creating pipelines and datasets by using one of these tools or SDKs.

- [Quickstart: create a data factory using .NET](quickstart-create-data-factory-dot-net.md)
- [Quickstart: create a data factory using PowerShell](quickstart-create-data-factory-powershell.md)
- [Quickstart: create a data factory using REST API](quickstart-create-data-factory-rest-api.md)
- [Quickstart: create a data factory using Azure portal](quickstart-create-data-factory-portal.md)
