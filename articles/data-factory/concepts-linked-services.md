---
title: Linked services in Azure Data Factory | Microsoft Docs
description: 'Learn about linked services in Data Factory. Linked services link compute/data stores to data factory.'
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: craigg
ms.reviewer: craigg

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 04/25/2019
ms.author: shlo

---

# Linked services in Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-create-datasets.md)
> * [Current version](concepts-datasets-linked-services.md)

This article describes what linked services are, how they are defined in JSON format, and how they are used in Azure Data Factory pipelines.

If you are new to Data Factory, see [Introduction to Azure Data Factory](introduction.md) for an overview.

## Overview
A data factory can have one or more pipelines. A **pipeline** is a logical grouping of **activities** that together perform a task. The activities in a pipeline define actions to perform on your data. For example, you might use a copy activity to copy data from an on-premises SQL Server to Azure Blob storage. Then, you might use a Hive activity that runs a Hive script on an Azure HDInsight cluster to process data from Blob storage to produce output data. Finally, you might use a second copy activity to copy the output data to Azure SQL Data Warehouse, on top of which business intelligence (BI) reporting solutions are built. For more information about pipelines and activities, see [Pipelines and activities](concepts-pipelines-activities.md) in Azure Data Factory.

Now, a **dataset** is a named view of data that simply points or references the data you want to use in your **activities** as inputs and outputs.

Before you create a dataset, you must create a **linked service** to link your data store to the data factory. Linked services are much like connection strings, which define the connection information needed for Data Factory to connect to external resources. Think of it this way; the dataset represents the structure of the data within the linked data stores, and the linked service defines the connection to the data source. For example, an Azure Storage linked service links a storage account to the data factory. An Azure Blob dataset represents the blob container and the folder within that Azure storage account that contains the input blobs to be processed.

Here is a sample scenario. To copy data from Blob storage to a SQL database, you create two linked services: Azure Storage and Azure SQL Database. Then, create two datasets: Azure Blob dataset (which refers to the Azure Storage linked service) and Azure SQL Table dataset (which refers to the Azure SQL Database linked service). The Azure Storage and Azure SQL Database linked services contain connection strings that Data Factory uses at runtime to connect to your Azure Storage and Azure SQL Database, respectively. The Azure Blob dataset specifies the blob container and blob folder that contains the input blobs in your Blob storage. The Azure SQL Table dataset specifies the SQL table in your SQL database to which the data is to be copied.

The following diagram shows the relationships among pipeline, activity, dataset, and linked service in Data Factory:

![Relationship between pipeline, activity, dataset, linked services](media/concepts-datasets-linked-services/relationship-between-data-factory-entities.png)

## Linked service JSON
A linked service in Data Factory is defined in JSON format as follows:

```json
{
    "name": "<Name of the linked service>",
    "properties": {
        "type": "<Type of the linked service>",
        "typeProperties": {
              "<data store or compute-specific type properties>"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

The following table describes properties in the above JSON:

Property | Description | Required |
-------- | ----------- | -------- |
name | Name of the linked service. See [Azure Data Factory - Naming rules](naming-rules.md). |  Yes |
type | Type of the linked service. For example: AzureStorage (data store) or AzureBatch (compute). See the description for typeProperties. | Yes |
typeProperties | The type properties are different for each data store or compute. <br/><br/> For the supported data store types and their type properties, see the [dataset type](concepts-datasets-linked-services.md#dataset-type) table in this article. Navigate to the data store connector article to learn about type properties specific to a data store. <br/><br/> For the supported compute types and their type properties, see [Compute linked services](compute-linked-services.md). | Yes |
connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Azure Integration Runtime or Self-hosted Integration Runtime (if your data store is located in a private network). If not specified, it uses the default Azure Integration Runtime. | No

## Linked service example
The following linked service is an Azure Storage linked service. Notice that the type is set to AzureStorage. The type properties for the Azure Storage linked service include a connection string. The Data Factory service uses this connection string to connect to the data store at runtime.

```json
{
    "name": "AzureStorageLinkedService",
    "properties": {
        "type": "AzureStorage",
        "typeProperties": {
            "connectionString": {
                "type": "SecureString",
                "value": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

## Create linked services
You can create linked services by using one of these tools or SDKs: [.NET API](quickstart-create-data-factory-dot-net.md), [PowerShell](quickstart-create-data-factory-powershell.md), [REST API](quickstart-create-data-factory-rest-api.md), Azure Resource Manager Template, and Azure portal

## Data store linked services
Connecting to data stores can be found in our [supported data stores and formats](copy-activity-overview.md#supported-data-stores-and-formats). Reference the list for specific connection properties needed for different stores.

## Compute linked services
Reference [compute environments supported](compute-linked-services.md) for details about different compute environments you can connect to from your data factory as well as the different configurations.

## Next steps
See the following tutorial for step-by-step instructions for creating pipelines and datasets by using one of these tools or SDKs.

- [Quickstart: create a data factory using .NET](quickstart-create-data-factory-dot-net.md)
- [Quickstart: create a data factory using PowerShell](quickstart-create-data-factory-powershell.md)
- [Quickstart: create a data factory using REST API](quickstart-create-data-factory-rest-api.md)
- [Quickstart: create a data factory using Azure portal](quickstart-create-data-factory-portal.md)
