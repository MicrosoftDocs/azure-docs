---
title: Datasets in Azure Data Factory | Microsoft Docs
description: 'Learn about datasets in Data Factory. Datasets represent input/output data.'
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

# Datasets in Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-create-datasets.md)
> * [Current version](concepts-datasets-linked-services.md)

This article describes what datasets are, how they are defined in JSON format, and how they are used in Azure Data Factory pipelines.

If you are new to Data Factory, see [Introduction to Azure Data Factory](introduction.md) for an overview.

## Overview
A data factory can have one or more pipelines. A **pipeline** is a logical grouping of **activities** that together perform a task. The activities in a pipeline define actions to perform on your data. Now, a **dataset** is a named view of data that simply points or references the data you want to use in your **activities** as inputs and outputs. Datasets identify data within different data stores, such as tables, files, folders, and documents. For example, an Azure Blob dataset specifies the blob container and folder in Blob storage from which the activity should read the data.

Before you create a dataset, you must create a [**linked service**](concepts-linked-services.md) to link your data store to the data factory. Linked services are much like connection strings, which define the connection information needed for Data Factory to connect to external resources. Think of it this way; the dataset represents the structure of the data within the linked data stores, and the linked service defines the connection to the data source. For example, an Azure Storage linked service links a storage account to the data factory. An Azure Blob dataset represents the blob container and the folder within that Azure storage account that contains the input blobs to be processed.

Here is a sample scenario. To copy data from Blob storage to a SQL database, you create two linked services: Azure Storage and Azure SQL Database. Then, create two datasets: Azure Blob dataset (which refers to the Azure Storage linked service) and Azure SQL Table dataset (which refers to the Azure SQL Database linked service). The Azure Storage and Azure SQL Database linked services contain connection strings that Data Factory uses at runtime to connect to your Azure Storage and Azure SQL Database, respectively. The Azure Blob dataset specifies the blob container and blob folder that contains the input blobs in your Blob storage. The Azure SQL Table dataset specifies the SQL table in your SQL database to which the data is to be copied.

The following diagram shows the relationships among pipeline, activity, dataset, and linked service in Data Factory:

![Relationship between pipeline, activity, dataset, linked services](media/concepts-datasets-linked-services/relationship-between-data-factory-entities.png)


## Dataset JSON
A dataset in Data Factory is defined in the following JSON format:

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

Property | Description | Required |
-------- | ----------- | -------- |
name | Name of the dataset. See [Azure Data Factory - Naming rules](naming-rules.md). |  Yes |
type | Type of the dataset. Specify one of the types supported by Data Factory (for example: AzureBlob, AzureSqlTable). <br/><br/>For details, see [Dataset types](#dataset-type). | Yes |
structure | Schema of the dataset. For details, see [Dataset schema](#dataset-structure-or-schema). | No |
typeProperties | The type properties are different for each type (for example: Azure Blob, Azure SQL table). For details on the supported types and their properties, see [Dataset type](#dataset-type). | Yes |

### Data flow compatible dataset

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

See [supported dataset types](#dataset-type) for a list of dataset types that are [Data Flow](concepts-data-flow-overview.md) compatible. Datasets that are compatible for Data Flow require fine-grained dataset definitions for transformations. Thus, the JSON definition is slightly different. Instead of a _structure_ property, datasets that are Data Flow compatible have a _schema_ property.

In Data Flow, datasets are used in source and sink transformations. The datasets define the basic data schemas. If your data has no schema, you can use schema drift for your source and sink. The schema in the dataset represents the physical data type and shape.

By defining the schema from the dataset, you'll get the related data types, data formats, file location, and connection information from the associated Linked service. Metadata from the datasets appears in your source transformation as the source *projection*. The projection in the source transformation represents the Data Flow data with defined names and types.

When you import the schema of a Data Flow dataset, select the **Import Schema** button and choose to import from the source or from a local file. In most cases, you'll import the schema directly from the source. But if you already have a local schema file (a Parquet file or CSV with headers), you can direct Data Factory to base the schema on that file.


```json
{
    "name": "<name of dataset>",
    "properties": {
        "type": "<type of dataset: AzureBlob, AzureSql etc...>",
        "linkedServiceName": {
                "referenceName": "<name of linked service>",
                "type": "LinkedServiceReference",
        },
        "schema": [
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

Property | Description | Required |
-------- | ----------- | -------- |
name | Name of the dataset. See [Azure Data Factory - Naming rules](naming-rules.md). |  Yes |
type | Type of the dataset. Specify one of the types supported by Data Factory (for example: AzureBlob, AzureSqlTable). <br/><br/>For details, see [Dataset types](#dataset-type). | Yes |
schema | Schema of the dataset. For details, see [Data Flow compatible datasets](#dataset-type). | No |
typeProperties | The type properties are different for each type (for example: Azure Blob, Azure SQL table). For details on the supported types and their properties, see [Dataset type](#dataset-type). | Yes |


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

## Dataset type
There are many different types of datasets, depending on the data store you use. See the following table for a list of data stores supported by Data Factory. Click a data store to learn how to create a linked service and a dataset for that data store.

[!INCLUDE [data-factory-v2-supported-data-stores](../../includes/data-factory-v2-supported-data-stores-dataflow.md)]

In the example in the previous section, the type of the dataset is set to **AzureSqlTable**. Similarly, for an Azure Blob dataset, the type of the dataset is set to **AzureBlob**, as shown in the following JSON:

```json
{
    "name": "AzureBlobInput",
    "properties": {
        "type": "AzureBlob",
        "linkedServiceName": {
                "referenceName": "MyAzureStorageLinkedService",
                "type": "LinkedServiceReference",
        },

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

## Dataset structure or schema
The **structure** section or **schema** (Data Flow compatible) section datasets is optional. It defines the schema of the dataset by containing a collection of names and data types of columns. You use the structure section to provide type information that is used to convert types and map columns from the source to the destination.

Each column in the structure contains the following properties:

Property | Description | Required
-------- | ----------- | --------
name | Name of the column. | Yes
type | Data type of the column. Data Factory supports the following interim data types as allowed values: **Int16, Int32, Int64, Single, Double, Decimal, Byte[], Boolean, String, Guid, Datetime, Datetimeoffset, and Timespan** | No
culture | .NET-based culture to be used when the type is a .NET type: `Datetime` or `Datetimeoffset`. The default is `en-us`. | No
format | Format string to be used when the type is a .NET type: `Datetime` or `Datetimeoffset`. Refer to [Custom Date and Time Format Strings](https://docs.microsoft.com/dotnet/standard/base-types/custom-date-and-time-format-strings) on how to format datetime. | No

### Example
In the following example, suppose the source Blob data is in CSV format and contains three columns: userid, name, and lastlogindate. They are of type Int64, String, and Datetime with a custom datetime format using abbreviated French names for day of the week.

Define the Blob dataset structure as follows along with type definitions for the columns:

```json
"structure":
[
    { "name": "userid", "type": "Int64"},
    { "name": "name", "type": "String"},
    { "name": "lastlogindate", "type": "Datetime", "culture": "fr-fr", "format": "ddd-MM-YYYY"}
]
```

### Guidance

The following guidelines help you understand when to include structure information, and what to include in the **structure** section. Learn more on how data factory maps source data to sink and when to specify structure information from [Schema and type mapping](copy-activity-schema-and-type-mapping.md).

- **For strong schema data sources**, specify the structure section only if you want map source columns to sink columns, and their names are not the same. This kind of structured data source stores data schema and type information along with the data itself. Examples of structured data sources include SQL Server, Oracle, and Azure SQL Database.<br/><br/>As type information is already available for structured data sources, you should not include type information when you do include the structure section.
- **For no/weak schema data sources e.g. text file in blob storage**, include structure when the dataset is an input for a copy activity, and data types of source dataset should be converted to native types for the sink. And include structure when you want to map source columns to sink columns..

## Create datasets
You can create datasets by using one of these tools or SDKs: [.NET API](quickstart-create-data-factory-dot-net.md), [PowerShell](quickstart-create-data-factory-powershell.md), [REST API](quickstart-create-data-factory-rest-api.md), Azure Resource Manager Template, and Azure portal

## Current version vs. version 1 datasets

Here are some differences between Data Factory and Data Factory version 1 datasets:

- The external property is not supported in the current version. It's replaced by a [trigger](concepts-pipeline-execution-triggers.md).
- The policy and availability properties are not supported in the current version. The start time for a pipeline depends on [triggers](concepts-pipeline-execution-triggers.md).
- Scoped datasets (datasets defined in a pipeline) are not supported in the current version.

## Next steps
See the following tutorial for step-by-step instructions for creating pipelines and datasets by using one of these tools or SDKs.

- [Quickstart: create a data factory using .NET](quickstart-create-data-factory-dot-net.md)
- [Quickstart: create a data factory using PowerShell](quickstart-create-data-factory-powershell.md)
- [Quickstart: create a data factory using REST API](quickstart-create-data-factory-rest-api.md)
- [Quickstart: create a data factory using Azure portal](quickstart-create-data-factory-portal.md)
