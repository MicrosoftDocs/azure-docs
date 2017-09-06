---
title: Datasets and linked services in Azure Data Factory | Microsoft Docs
description: 'Learn about datasets and linked services in Data Factory. Linked services link compute/data stores to data factory. Datasets represent input/output data.'
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: 
ms.date: 09/05/2017
ms.author: shlo

---

# Datasets and linked services in Azure Data Factory 
This article describes what datasets are, how they are defined in JSON format, and how they are used in Azure Data Factory V2 pipelines. 

> [!NOTE]
> If you are new to Data Factory, see [Introduction to Azure Data Factory](introduction.md) for an overview. 

## Overview
A data factory can have one or more pipelines. A **pipeline** is a logical grouping of **activities** that together perform a task. The activities in a pipeline define actions to perform on your data. For example, you might use a copy activity to copy data from an on-premises SQL Server to Azure Blob storage. Then, you might use a Hive activity that runs a Hive script on an Azure HDInsight cluster to process data from Blob storage to produce output data. Finally, you might use a second copy activity to copy the output data to Azure SQL Data Warehouse, on top of which business intelligence (BI) reporting solutions are built. For more information about pipelines and activities, see [Pipelines and activities](concepts-pipelines-activities) in Azure Data Factory.

Now, a **dataset** is a named view of data which simply points or references the data you want to use in your **activities** as inputs and outputs. Datasets identify data within different data stores, such as tables, files, folders, and documents. For example, an Azure Blob dataset specifies the blob container and folder in Blob storage from which the activity should read the data.

Before you create a dataset, you must create a **linked service** to link your data store to the data factory. Linked services are much like connection strings, which define the connection information needed for Data Factory to connect to external resources. Think of it this way; the dataset represents the structure of the data within the linked data stores, and the linked service defines the connection to the data source. For example, an Azure Storage linked service links a storage account to the data factory. An Azure Blob dataset represents the blob container and the folder within that Azure storage account that contains the input blobs to be processed.

Here is a sample scenario. To copy data from Blob storage to a SQL database, you create two linked services: Azure Storage and Azure SQL Database. Then, create two datasets: Azure Blob dataset (which refers to the Azure Storage linked service) and Azure SQL Table dataset (which refers to the Azure SQL Database linked service). The Azure Storage and Azure SQL Database linked services contain connection strings that Data Factory uses at runtime to connect to your Azure Storage and Azure SQL Database, respectively. The Azure Blob dataset specifies the blob container and blob folder that contains the input blobs in your Blob storage. The Azure SQL Table dataset specifies the SQL table in your SQL database to which the data is to be copied.

The following diagram shows the relationships among pipeline, activity, dataset, and linked service in Data Factory:

![Relationship between pipeline, activity, dataset, linked services](media/concepts-datasets-linked-services/relationship-between-data-factory-entities.png)

## Dataset JSON
A dataset in Data Factory is defined in JSON format as follows:

```json
{
    "name": "<name of dataset>",
    "properties": {
        "type": "<type of dataset: AzureBlob, AzureSql etc...>",
        "linkedServiceName": {
                "referenceName": "<name of linked service>",
                 "type": "LinkedServiceReference",
        },
        "structure": [
            {
                "name": "<Name of the column>",
                "type": "<Name of the type>"
            }
        ],
        "typeProperties": {
            "<type specific property>": "<value>",
            "<type specific property 2>": "<value 2>",
        }
    }
}

```
The following table describes properties in the above JSON:

Property | Description | Required | Default
-------- | ----------- | -------- | -------
name | Name of the dataset. | See [Azure Data Factory - Naming rules](naming-rules.md). | Yes | NA
type | Type of the dataset. | Specify one of the types supported by Data Factory (for example: AzureBlob, AzureSqlTable). <br/><br/>For details, see [Dataset types](#dataset-types). | Yes | NA
structure | Schema of the dataset. | For details, see [Dataset structure](#dataset-structure). | No | NA
typeProperties | The type properties are different for each type (for example: Azure Blob, Azure SQL table). For details on the supported types and their properties, see [Dataset type](#dataset-type). | Yes | NA

## Dataset example
In the following example, the dataset represents a table named MyTable in a SQL database.

```json
{
    "name": "DatasetSample",
    "properties": {
        "type": "AzureSqlTable",
        "linkedServiceName": {
                "referenceName": "MyAzureSqlLinkedService",
                 "type": "LinkedServiceReference",
        },
        "typeProperties":
        {
            "tableName": "MyTable"
        },
    }
}

```
Note the following points:

- type is set to AzureSqlTable.
- tableName type property (specific to AzureSqlTable type) is set to MyTable.
- linkedServiceName refers to a linked service of type AzureSqlDatabase, which is defined in the next JSON snippet.

## Linked service example
AzureSqlLinkedService is defined as follows:

```json
{
    "name": "AzureSqlLinkedService",
    "properties": {
        "type": "AzureSqlDatabase",
        "description": "",
        "typeProperties": {
            "connectionString": "Data Source=tcp:<servername>.database.windows.net,1433;Initial Catalog=<databasename>;User ID=<username>@<servername>;Password=<password>;Integrated Security=False;Encrypt=True;Connect Timeout=30"
        }
    }
}
```
In the preceding JSON snippet:

- **type** is set to AzureSqlDatabase.
- **connectionString** type property specifies information to connect to a SQL database.

As you can see, the linked service defines how to connect to a SQL database. The dataset defines what table is used as an input and output for the activity in a pipeline.

## Dataset type
There are many different types of datasets, depending on the data store you use. See the following table for a list of data stores supported by Data Factory. Click a data store to learn how to create a linked service and a dataset for that data store.




