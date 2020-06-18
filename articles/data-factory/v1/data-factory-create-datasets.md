---
title: Create datasets in Azure Data Factory 
description: Learn how to create datasets in Azure Data Factory, with examples that use properties such as offset and anchorDateTime.
services: data-factory
documentationcenter: ''
author: djpmsft
ms.author: daperlov
manager: jroth
ms.reviewer: maghan
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.date: 01/10/2018
---

# Datasets in Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](data-factory-create-datasets.md)
> * [Version 2 (current version)](../concepts-datasets-linked-services.md)

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [Datasets in V2](../concepts-datasets-linked-services.md).

This article describes what datasets are, how they are defined in JSON format, and how they are used in Azure Data Factory pipelines. It provides details about each section (for example, structure, availability, and policy) in the dataset JSON definition. The article also provides examples for using the **offset**, **anchorDateTime**, and **style** properties in a dataset JSON definition.

> [!NOTE]
> If you are new to Data Factory, see [Introduction to Azure Data Factory](data-factory-introduction.md) for an overview. If you do not have hands-on experience with creating data factories, you can gain a better understanding by reading the [data transformation tutorial](data-factory-build-your-first-pipeline.md) and the [data movement tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).

## Overview
A data factory can have one or more pipelines. A **pipeline** is a logical grouping of **activities** that together perform a task. The activities in a pipeline define actions to perform on your data. For example, you might use a copy activity to copy data from a SQL Server database to Azure Blob storage. Then, you might use a Hive activity that runs a Hive script on an Azure HDInsight cluster to process data from Blob storage to produce output data. Finally, you might use a second copy activity to copy the output data to Azure SQL Data Warehouse, on top of which business intelligence (BI) reporting solutions are built. For more information about pipelines and activities, see [Pipelines and activities in Azure Data Factory](data-factory-create-pipelines.md).

An activity can take zero or more input **datasets**, and produce one or more output datasets. An input dataset represents the input for an activity in the pipeline, and an output dataset represents the output for the activity. Datasets identify data within different data stores, such as tables, files, folders, and documents. For example, an Azure Blob dataset specifies the blob container and folder in Blob storage from which the pipeline should read the data.

Before you create a dataset, create a **linked service** to link your data store to the data factory. Linked services are much like connection strings, which define the connection information needed for Data Factory to connect to external resources. Datasets identify data within the linked data stores, such as SQL tables, files, folders, and documents. For example, an Azure Storage linked service links a storage account to the data factory. An Azure Blob dataset represents the blob container and the folder that contains the input blobs to be processed.

Here is a sample scenario. To copy data from Blob storage to a SQL database, you create two linked services: Azure Storage and Azure SQL Database. Then, create two datasets: Azure Blob dataset (which refers to the Azure Storage linked service) and Azure SQL Table dataset (which refers to the Azure SQL Database linked service). The Azure Storage and Azure SQL Database linked services contain connection strings that Data Factory uses at runtime to connect to your Azure Storage and Azure SQL Database, respectively. The Azure Blob dataset specifies the blob container and blob folder that contains the input blobs in your Blob storage. The Azure SQL Table dataset specifies the SQL table in your SQL database to which the data is to be copied.

The following diagram shows the relationships among pipeline, activity, dataset, and linked service in Data Factory:

![Relationship between pipeline, activity, dataset, linked services](media/data-factory-create-datasets/relationship-between-data-factory-entities.png)

## Dataset JSON
A dataset in Data Factory is defined in JSON format as follows:

```json
{
    "name": "<name of dataset>",
    "properties": {
        "type": "<type of dataset: AzureBlob, AzureSql etc...>",
        "external": "<boolean flag to indicate external data. only for input datasets>",
        "linkedServiceName": "<Name of the linked service that refers to a data store.>",
        "structure": [
            {
                "name": "<Name of the column>",
                "type": "<Name of the type>"
            }
        ],
        "typeProperties": {
            "<type specific property>": "<value>",
            "<type specific property 2>": "<value 2>",
        },
        "availability": {
            "frequency": "<Specifies the time unit for data slice production. Supported frequency: Minute, Hour, Day, Week, Month>",
            "interval": "<Specifies the interval within the defined frequency. For example, frequency set to 'Hour' and interval set to 1 indicates that new data slices should be produced hourly>"
        },
        "policy":
        {
        }
    }
}
```

The following table describes properties in the above JSON:

| Property | Description | Required | Default |
| --- | --- | --- | --- |
| name |Name of the dataset. See [Azure Data Factory - Naming rules](data-factory-naming-rules.md) for naming rules. |Yes |NA |
| type |Type of the dataset. Specify one of the types supported by Data Factory (for example: AzureBlob, AzureSqlTable). <br/><br/>For details, see [Dataset type](#Type). |Yes |NA |
| structure |Schema of the dataset.<br/><br/>For details, see [Dataset structure](#Structure). |No |NA |
| typeProperties | The type properties are different for each type (for example: Azure Blob, Azure SQL table). For details on the supported types and their properties, see [Dataset type](#Type). |Yes |NA |
| external | Boolean flag to specify whether a dataset is explicitly produced by a data factory pipeline or not. If the input dataset for an activity is not produced by the current pipeline, set this flag to true. Set this flag to true for the input dataset of the first activity in the pipeline.  |No |false |
| availability | Defines the processing window (for example, hourly or daily) or the slicing model for the dataset production. Each unit of data consumed and produced by an activity run is called a data slice. If the availability of an output dataset is set to daily (frequency - Day, interval - 1), a slice is produced daily. <br/><br/>For details, see Dataset availability. <br/><br/>For details on the dataset slicing model, see the [Scheduling and execution](data-factory-scheduling-and-execution.md) article. |Yes |NA |
| policy |Defines the criteria or the condition that the dataset slices must fulfill. <br/><br/>For details, see the [Dataset policy](#Policy) section. |No |NA |

## Dataset example
In the following example, the dataset represents a table named **MyTable** in a SQL database.

```json
{
    "name": "DatasetSample",
    "properties": {
        "type": "AzureSqlTable",
        "linkedServiceName": "AzureSqlLinkedService",
        "typeProperties":
        {
            "tableName": "MyTable"
        },
        "availability":
        {
            "frequency": "Day",
            "interval": 1
        }
    }
}
```

Note the following points:

* **type** is set to AzureSqlTable.
* **tableName** type property (specific to AzureSqlTable type) is set to MyTable.
* **linkedServiceName** refers to a linked service of type AzureSqlDatabase, which is defined in the next JSON snippet.
* **availability frequency** is set to Day, and **interval** is set to 1. This means that the dataset slice is produced daily.

**AzureSqlLinkedService** is defined as follows:

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

* **type** is set to AzureSqlDatabase.
* **connectionString** type property specifies information to connect to a SQL database.

As you can see, the linked service defines how to connect to a SQL database. The dataset defines what table is used as an input and output for the activity in a pipeline.

> [!IMPORTANT]
> Unless a dataset is being produced by the pipeline, it should be marked as **external**. This setting generally applies to inputs of first activity in a pipeline.

## <a name="Type"></a> Dataset type
The type of the dataset depends on the data store you use. See the following table for a list of data stores supported by Data Factory. Click a data store to learn how to create a linked service and a dataset for that data store.

[!INCLUDE [data-factory-supported-data-stores](../../../includes/data-factory-supported-data-stores.md)]

> [!NOTE]
> Data stores with * can be on-premises or on Azure infrastructure as a service (IaaS). These data stores require you to install [Data Management Gateway](data-factory-data-management-gateway.md).

In the example in the previous section, the type of the dataset is set to **AzureSqlTable**. Similarly, for an Azure Blob dataset, the type of the dataset is set to **AzureBlob**, as shown in the following JSON:

```json
{
    "name": "AzureBlobInput",
    "properties": {
        "type": "AzureBlob",
        "linkedServiceName": "AzureStorageLinkedService",
        "typeProperties": {
            "fileName": "input.log",
            "folderPath": "adfgetstarted/inputdata",
            "format": {
                "type": "TextFormat",
                "columnDelimiter": ","
            }
        },
        "availability": {
            "frequency": "Month",
            "interval": 1
        },
        "external": true,
        "policy": {}
    }
}
```

## <a name="Structure"></a>Dataset structure
The **structure** section is optional. It defines the schema of the dataset by containing a collection of names and data types of columns. You use the structure section to provide type information that is used to convert types and map columns from the source to the destination. In the following example, the dataset has three columns: `slicetimestamp`, `projectname`, and `pageviews`. They are of type String, String, and Decimal, respectively.

```json
structure:
[
    { "name": "slicetimestamp", "type": "String"},
    { "name": "projectname", "type": "String"},
    { "name": "pageviews", "type": "Decimal"}
]
```

Each column in the structure contains the following properties:

| Property | Description | Required |
| --- | --- | --- |
| name |Name of the column. |Yes |
| type |Data type of the column.  |No |
| culture |.NET-based culture to be used when the type is a .NET type: `Datetime` or `Datetimeoffset`. The default is `en-us`. |No |
| format |Format string to be used when the type is a .NET type: `Datetime` or `Datetimeoffset`. |No |

The following guidelines help you determine when to include structure information, and what to include in the **structure** section.

* **For structured data sources**, specify the structure section only if you want map source columns to sink columns, and their names are not the same. This kind of structured data source stores data schema and type information along with the data itself. Examples of structured data sources include SQL Server, Oracle, and Azure table.
  
    As type information is already available for structured data sources, you should not include type information when you do include the structure section.
* **For schema on read data sources (specifically Blob storage)**, you can choose to store data without storing any schema or type information with the data. For these types of data sources, include structure when you want to map source columns to sink columns. Also include structure when the dataset is an input for a copy activity, and data types of source dataset should be converted to native types for the sink.
	
	Data Factory supports the following values for providing type information in structure: **Int16, Int32, Int64, Single, Double, Decimal, Byte[], Boolean, String, Guid, Datetime, Datetimeoffset, and Timespan**. These values are Common Language Specification (CLS)-compliant, .NET-based type values.

Data Factory automatically performs type conversions when moving data from a source data store to a sink data store.

## Dataset availability
The **availability** section in a dataset defines the processing window (for example, hourly, daily, or weekly) for the dataset. For more information about activity windows, see [Scheduling and execution](data-factory-scheduling-and-execution.md).

The following availability section specifies that the output dataset is either produced hourly, or the input dataset is available hourly:

```json
"availability":
{
    "frequency": "Hour",
    "interval": 1
}
```

If the pipeline has the following start and end times:

```json
	"start": "2016-08-25T00:00:00Z",
    "end": "2016-08-25T05:00:00Z",
```

The output dataset is produced hourly within the pipeline start and end times. Therefore, there are five dataset slices produced by this pipeline, one for each activity window (12 AM - 1 AM, 1 AM - 2 AM, 2 AM - 3 AM, 3 AM - 4 AM, 4 AM - 5 AM).

The following table describes properties you can use in the availability section:

| Property | Description | Required | Default |
| --- | --- | --- | --- |
| frequency |Specifies the time unit for dataset slice production.<br/><br/><b>Supported frequency</b>: Minute, Hour, Day, Week, Month |Yes |NA |
| interval |Specifies a multiplier for frequency.<br/><br/>"Frequency x interval" determines how often the slice is produced. For example, if you need the dataset to be sliced on an hourly basis, you set <b>frequency</b> to <b>Hour</b>, and <b>interval</b> to <b>1</b>.<br/><br/>Note that if you specify **frequency** as **Minute**, you should set the interval to no less than 15. |Yes |NA |
| style |Specifies whether the slice should be produced at the start or end of the interval.<ul><li>StartOfInterval</li><li>EndOfInterval</li></ul>If **frequency** is set to **Month**, and **style** is set to **EndOfInterval**, the slice is produced on the last day of month. If **style** is set to **StartOfInterval**, the slice is produced on the first day of month.<br/><br/>If **frequency** is set to **Day**, and **style** is set to **EndOfInterval**, the slice is produced in the last hour of the day.<br/><br/>If **frequency** is set to **Hour**, and **style** is set to **EndOfInterval**, the slice is produced at the end of the hour. For example, for a slice for the 1 PM - 2 PM period, the slice is produced at 2 PM. |No |EndOfInterval |
| anchorDateTime |Defines the absolute position in time used by the scheduler to compute dataset slice boundaries. <br/><br/>Note that if this property has date parts that are more granular than the specified frequency, the more granular parts are ignored. For example, if the **interval** is **hourly** (frequency: hour and interval: 1), and the **anchorDateTime** contains **minutes and seconds**, then the minutes and seconds parts of **anchorDateTime** are ignored. |No |01/01/0001 |
| offset |Timespan by which the start and end of all dataset slices are shifted. <br/><br/>Note that if both **anchorDateTime** and **offset** are specified, the result is the combined shift. |No |NA |

### offset example
By default, daily (`"frequency": "Day", "interval": 1`) slices start at 12 AM (midnight) Coordinated Universal Time (UTC). If you want the start time to be 6 AM UTC time instead, set the offset as shown in the following snippet:

```json
"availability":
{
    "frequency": "Day",
    "interval": 1,
    "offset": "06:00:00"
}
```
### anchorDateTime example
In the following example, the dataset is produced once every 23 hours. The first slice starts at the time specified by **anchorDateTime**, which is set to `2017-04-19T08:00:00` (UTC).

```json
"availability":
{
    "frequency": "Hour",
    "interval": 23,
    "anchorDateTime":"2017-04-19T08:00:00"
}
```

### offset/style example
The following dataset is monthly, and is produced on the 3rd of every month at 8:00 AM (`3.08:00:00`):

```json
"availability": {
	"frequency": "Month",
	"interval": 1,
	"offset": "3.08:00:00",	
	"style": "StartOfInterval"
}
```

## <a name="Policy"></a>Dataset policy
The **policy** section in the dataset definition defines the criteria or the condition that the dataset slices must fulfill.

### Validation policies
| Policy name | Description | Applied to | Required | Default |
| --- | --- | --- | --- | --- |
| minimumSizeMB |Validates that the data in **Azure Blob storage** meets the minimum size requirements (in megabytes). |Azure Blob storage |No |NA |
| minimumRows |Validates that the data in an **Azure SQL database** or an **Azure table** contains the minimum number of rows. |<ul><li>Azure SQL database</li><li>Azure table</li></ul> |No |NA |

#### Examples
**minimumSizeMB:**

```json
"policy":

{
    "validation":
    {
        "minimumSizeMB": 10.0
    }
}
```

**minimumRows:**

```json
"policy":
{
    "validation":
    {
        "minimumRows": 100
    }
}
```

### External datasets
External datasets are the ones that are not produced by a running pipeline in the data factory. If the dataset is marked as **external**, the **ExternalData** policy may be defined to influence the behavior of the dataset slice availability.

Unless a dataset is being produced by Data Factory, it should be marked as **external**. This setting generally applies to the inputs of first activity in a pipeline, unless activity or pipeline chaining is being used.

| Name | Description | Required | Default value |
| --- | --- | --- | --- |
| dataDelay |The time to delay the check on the availability of the external data for the given slice. For example, you can delay an hourly check by using this setting.<br/><br/>The setting only applies to the present time. For example, if it is 1:00 PM right now and this value is 10 minutes, the validation starts at 1:10 PM.<br/><br/>Note that this setting does not affect slices in the past. Slices with **Slice End Time** + **dataDelay** < **Now** are processed without any delay.<br/><br/>Times greater than 23:59 hours should be specified by using the `day.hours:minutes:seconds` format. For example, to specify 24 hours, don't use 24:00:00. Instead, use 1.00:00:00. If you use 24:00:00, it is treated as 24 days (24.00:00:00). For 1 day and 4 hours, specify 1:04:00:00. |No |0 |
| retryInterval |The wait time between a failure and the next attempt. This setting applies to present time. If the previous try failed, the next try is after the **retryInterval** period. <br/><br/>If it is 1:00 PM right now, we begin the first try. If the duration to complete the first validation check is 1 minute and the operation failed, the next retry is at 1:00 + 1min (duration) + 1min (retry interval) = 1:02 PM. <br/><br/>For slices in the past, there is no delay. The retry happens immediately. |No |00:01:00 (1 minute) |
| retryTimeout |The timeout for each retry attempt.<br/><br/>If this property is set to 10 minutes, the validation should be completed within 10 minutes. If it takes longer than 10 minutes to perform the validation, the retry times out.<br/><br/>If all attempts for the validation time out, the slice is marked as **TimedOut**. |No |00:10:00 (10 minutes) |
| maximumRetry |The number of times to check for the availability of the external data. The maximum allowed value is 10. |No |3 |


## Create datasets
You can create datasets by using one of these tools or SDKs:

- Copy Wizard
- Visual Studio
- PowerShell
- Azure Resource Manager template
- REST API
- .NET API

See the following tutorials for step-by-step instructions for creating pipelines and datasets by using one of these tools or SDKs:

- [Build a pipeline with a data transformation activity](data-factory-build-your-first-pipeline.md)
- [Build a pipeline with a data movement activity](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md)

After a pipeline is created and deployed, you can manage and monitor your pipelines by using the Azure portal blades, or the Monitoring and Management app. See the following topics for step-by-step instructions:

- [Monitor and manage pipelines by using Azure portal blades](data-factory-monitor-manage-pipelines.md)
- [Monitor and manage pipelines by using the Monitoring and Management app](data-factory-monitor-manage-app.md)

## Scoped datasets
You can create datasets that are scoped to a pipeline by using the **datasets** property. These datasets can only be used by activities within this pipeline, not by activities in other pipelines. The following example defines a pipeline with two datasets (InputDataset-rdc and OutputDataset-rdc) to be used within the pipeline.

> [!IMPORTANT]
> Scoped datasets are supported only with one-time pipelines (where **pipelineMode** is set to **OneTime**). See [Onetime pipeline](data-factory-create-pipelines.md#onetime-pipeline) for details.
>
>

```json
{
    "name": "CopyPipeline-rdc",
    "properties": {
        "activities": [
            {
                "type": "Copy",
                "typeProperties": {
                    "source": {
                        "type": "BlobSource",
                        "recursive": false
                    },
                    "sink": {
                        "type": "BlobSink",
                        "writeBatchSize": 0,
                        "writeBatchTimeout": "00:00:00"
                    }
                },
                "inputs": [
                    {
                        "name": "InputDataset-rdc"
                    }
                ],
                "outputs": [
                    {
                        "name": "OutputDataset-rdc"
                    }
                ],
                "scheduler": {
                    "frequency": "Day",
                    "interval": 1,
                    "style": "StartOfInterval"
                },
                "name": "CopyActivity-0"
            }
        ],
        "start": "2016-02-28T00:00:00Z",
        "end": "2016-02-28T00:00:00Z",
        "isPaused": false,
        "pipelineMode": "OneTime",
        "expirationTime": "15.00:00:00",
        "datasets": [
            {
                "name": "InputDataset-rdc",
                "properties": {
                    "type": "AzureBlob",
                    "linkedServiceName": "InputLinkedService-rdc",
                    "typeProperties": {
                        "fileName": "emp.txt",
                        "folderPath": "adftutorial/input",
                        "format": {
                            "type": "TextFormat",
                            "rowDelimiter": "\n",
                            "columnDelimiter": ","
                        }
                    },
                    "availability": {
                        "frequency": "Day",
                        "interval": 1
                    },
                    "external": true,
                    "policy": {}
                }
            },
            {
                "name": "OutputDataset-rdc",
                "properties": {
                    "type": "AzureBlob",
                    "linkedServiceName": "OutputLinkedService-rdc",
                    "typeProperties": {
                        "fileName": "emp.txt",
                        "folderPath": "adftutorial/output",
                        "format": {
                            "type": "TextFormat",
                            "rowDelimiter": "\n",
                            "columnDelimiter": ","
                        }
                    },
                    "availability": {
                        "frequency": "Day",
                        "interval": 1
                    },
                    "external": false,
                    "policy": {}
                }
            }
        ]
    }
}
```

## Next steps
- For more information about pipelines, see [Create pipelines](data-factory-create-pipelines.md).
- For more information about how pipelines are scheduled and executed, see [Scheduling and execution in Azure Data Factory](data-factory-scheduling-and-execution.md).
