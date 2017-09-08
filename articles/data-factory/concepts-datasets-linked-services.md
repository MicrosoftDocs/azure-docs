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
A data factory can have one or more pipelines. A **pipeline** is a logical grouping of **activities** that together perform a task. The activities in a pipeline define actions to perform on your data. For example, you might use a copy activity to copy data from an on-premises SQL Server to Azure Blob storage. Then, you might use a Hive activity that runs a Hive script on an Azure HDInsight cluster to process data from Blob storage to produce output data. Finally, you might use a second copy activity to copy the output data to Azure SQL Data Warehouse, on top of which business intelligence (BI) reporting solutions are built. For more information about pipelines and activities, see [Pipelines and activities](concepts-pipelines-activities.md) in Azure Data Factory.

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

[!INCLUDE [data-factory-v2-supported-data-stores](../../includes/data-factory-v2-supported-data-stores.md)]

Data stores with * can be on-premises or on Azure infrastructure as a service (IaaS). These data stores require you to [install self-hosted integration runtime](create-self-hosted-integration-runtime.md).

In the example in the previous section, the type of the dataset is set to **AzureSqlTable**. Similarly, for an Azure Blob dataset, the type of the dataset is set to **AzureBlob**, as shown in the following JSON:

```json
{
    "name": "AzureBlobInput",
    "properties": {
        "type": "AzureBlob",
        "linkedServiceName": {
                "referenceName": "MyAzureStorageLinkedService",
                 "type": "LinkedServiceReference",
        }, copy-data-from-http-end-point.md
 
        "typeProperties": {
            "fileName": "input.log",
            "folderPath": "adfgetstarted/inputdata",
            "format": {
                "type": "TextFormat",
                "columnDelimiter": ","
            }
        }
    }
}
```
## Dataset structure
The **structure** section is optional. It defines the schema of the dataset by containing a collection of names and data types of columns. You use the structure section to provide type information that is used to convert types and map columns from the source to the destination. In the following example, the dataset has three columns: timestamp, projectname, and pageviews. They are of type String, String, and Decimal, respectively.

```json
[
    { "name": "timestamp", "type": "String"},
    { "name": "projectname", "type": "String"},
    { "name": "pageviews", "type": "Decimal"}
]
```

Each column in the structure contains the following properties:

Property | Description | Required
-------- | ----------- | --------
name | Name of the column. | Yes
type | Data type of the column. | No
culture | .NET-based culture to be used when the type is a .NET type: `Datetime` or `Datetimeoffset`. The default is `en-us`. | No
format | Format string to be used when the type is a .NET type: `Datetime` or `Datetimeoffset`. | No

The following guidelines help you determine when to include structure information, and what to include in the **structure** section.

- **For structured data sources**, specify the structure section only if you want map source columns to sink columns, and their names are not the same. This kind of structured data source stores data schema and type information along with the data itself. Examples of structured data sources include SQL Server, Oracle, and Azure table.<br/><br/>As type information is already available for structured data sources, you should not include type information when you do include the structure section.
- **For schema on read data sources (specifically Blob storage)**, you can choose to store data without storing any schema or type information with the data. For these types of data sources, include structure when you want to map source columns to sink columns. Also include structure when the dataset is an input for a copy activity, and data types of source dataset should be converted to native types for the sink.<br/><br/> Data Factory supports the following values for providing type information in structure: `Int16, Int32, Int64, Single, Double, Decimal, Byte[], Boolean, String, Guid, Datetime, Datetimeoffset, and Timespan`. These values are Common Language Specification (CLS)-compliant, .NET-based type values.

Data Factory automatically performs type conversions when moving data from a source data store to a sink data store.

## Create datasets
You can create datasets by using one of these tools or SDKs: .NET API, PowerShell, REST API, Azure Resource Manager Template, and Azure portal. 

See the following tutorial for step-by-step instructions for creating pipelines and datasets by using one of these tools or SDKs. 

- [Quickstart: create a data factory using .NET](quickstart-create-data-factory-dot-net.md)
- [Quickstart: create a data factory using PowerShell](quickstart-create-data-factory-powershell.md)
- [Quickstart: create a data factory using .NET](quickstart-create-data-factory-python.md)
- [Quickstart: create a data factory using .NET](quickstart-create-data-factory-rest-api.md)
- [Quickstart: create a data factory using .NET](quickstart-create-data-factory-portal.md)

## V1 vs. V2 datasets

Here are some differences between Data Factory v1 and v2 datasets: 

- The external property is not supported in v2. It's replaced by a [trigger](concepts-triggers.md).
- The policy and availability properties are not supported in V2. The start time for a pipeline depends on [triggers]((concepts-triggers.md)).
- Scoped datasets (datasets defined in a pipeline) are not supported in V2. 

## Next steps
