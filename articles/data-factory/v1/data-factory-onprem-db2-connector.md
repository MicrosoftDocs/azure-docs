---
title: Move data from DB2 by using Azure Data Factory | Microsoft Docs
description: Learn how to move data from an on-premises DB2 database by using Azure Data Factory Copy Activity
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg


ms.assetid: c1644e17-4560-46bb-bf3c-b923126671f1
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 01/10/2018
ms.author: jingwang

robots: noindex
---
# Move data from DB2 by using Azure Data Factory Copy Activity
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](data-factory-onprem-db2-connector.md)
> * [Version 2 (current version)](../connector-db2.md)

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [DB2 connector in V2](../connector-db2.md).


This article describes how you can use Copy Activity in Azure Data Factory to copy data from an on-premises DB2 database to a data store. You can copy data to any store that is listed as a supported sink in the [Data Factory data movement activities](data-factory-data-movement-activities.md#supported-data-stores-and-formats) article. This topic builds on the Data Factory article, which presents an overview of data movement by using Copy Activity and lists the supported data store combinations. 

Data Factory currently supports only moving data from a DB2 database to a [supported sink data store](data-factory-data-movement-activities.md#supported-data-stores-and-formats). Moving data from other data stores to a DB2 database is not supported.

## Prerequisites
Data Factory supports connecting to an on-premises DB2 database by using the [data management gateway](data-factory-data-management-gateway.md). For step-by-step instructions to set up the gateway data pipeline to move your data, see the [Move data from on-premises to cloud](data-factory-move-data-between-onprem-and-cloud.md) article.

A gateway is required even if the DB2 is hosted on Azure IaaS VM. You can install the gateway on the same IaaS VM as the data store. If the gateway can connect to the database, you can install the gateway on a different VM.

The data management gateway provides a built-in DB2 driver, so you don't need to manually install a driver to copy data from DB2.

> [!NOTE]
> For tips on troubleshooting connection and gateway issues, see the [Troubleshoot gateway issues](data-factory-data-management-gateway.md#troubleshooting-gateway-issues) article.


## Supported versions
The Data Factory DB2 connector supports the following IBM DB2 platforms and versions with Distributed Relational Database Architecture (DRDA) SQL Access Manager versions 9, 10, and 11:

* IBM DB2 for z/OS version 11.1
* IBM DB2 for z/OS version 10.1
* IBM DB2 for i (AS400) version 7.2
* IBM DB2 for i (AS400) version 7.1
* IBM DB2 for Linux, UNIX, and Windows (LUW) version 11
* IBM DB2 for LUW version 10.5
* IBM DB2 for LUW version 10.1

> [!TIP]
> If you receive the error message "The package corresponding to an SQL statement execution request was not found. SQLSTATE=51002 SQLCODE=-805," the reason is a necessary package is not created for the normal user on the OS. To resolve this issue, follow these instructions for your DB2 server type:
> - DB2 for i (AS400): Let a power user create the collection for the normal user before running Copy Activity. To create the collection, use the command: `create collection <username>`
> - DB2 for z/OS or LUW: Use a high privilege account--a power user or admin that has package authorities and BIND, BINDADD, GRANT EXECUTE TO PUBLIC permissions--to run the copy once. The necessary package is automatically created during the copy. Afterward, you can switch back to the normal user for your subsequent copy runs.

## Getting started
You can create a pipeline with a copy activity to move data from an on-premises DB2 data store by using different tools and APIs: 

- The easiest way to create a pipeline is to use the Azure Data Factory Copy Wizard. For a quick walkthrough on creating a pipeline by using the Copy Wizard, see the [Tutorial: Create a pipeline by using the Copy Wizard](data-factory-copy-data-wizard-tutorial.md). 
- You can also use tools to create a pipeline, including Visual Studio, Azure PowerShell, an Azure Resource Manager template, the .NET API, and the REST API. For step-by-step instructions to create a pipeline with a copy activity, see the [Copy Activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md). 

Whether you use the tools or APIs, you perform the following steps to create a pipeline that moves data from a source data store to a sink data store:

1. Create linked services to link input and output data stores to your data factory.
2. Create datasets to represent input and output data for the copy operation. 
3. Create a pipeline with a copy activity that takes a dataset as an input and a dataset as an output. 

When you use the Copy Wizard, JSON definitions for the Data Factory linked services, datasets, and pipeline entities are automatically created for you. When you use tools or APIs (except the .NET API), you define the Data Factory entities by using the JSON format. The JSON example: Copy data from DB2 to Azure Blob storage shows the JSON definitions for the Data Factory entities that are used to copy data from an on-premises DB2 data store.

The following sections provide details about the JSON properties that are used to define the Data Factory entities that are specific to a DB2 data store.

## DB2 linked service properties
The following table lists the JSON properties that are specific to a DB2 linked service.

| Property | Description | Required |
| --- | --- | --- |
| **type** |This property must be set to **OnPremisesDb2**. |Yes |
| **server** |The name of the DB2 server. |Yes |
| **database** |The name of the DB2 database. |Yes |
| **schema** |The name of the schema in the DB2 database. This property is case-sensitive. |No |
| **authenticationType** |The type of authentication that is used to connect to the DB2 database. The possible values are: Anonymous, Basic, and Windows. |Yes |
| **username** |The name for the user account if you use Basic or Windows authentication. |No |
| **password** |The password for the user account. |No |
| **gatewayName** |The name of the gateway that the Data Factory service should use to connect to the on-premises DB2 database. |Yes |

## Dataset properties
For a list of the sections and properties that are available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections, such as **structure**, **availability**, and the **policy** for a dataset JSON, are similar for all dataset types (Azure SQL, Azure Blob storage, Azure Table storage, and so on).

The **typeProperties** section is different for each type of dataset and provides information about the location of the data in the data store. The **typeProperties** section for a dataset of type **RelationalTable**, which includes the DB2 dataset, has the following property:

| Property | Description | Required |
| --- | --- | --- |
| **tableName** |The name of the table in the DB2 database instance that the linked service refers to. This property is case-sensitive. |No (if the **query** property of a copy activity of type **RelationalSource** is specified) |

## Copy Activity properties
For a list of the sections and properties that are available for defining copy activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Copy Activity properties, such as **name**, **description**, **inputs** table, **outputs** table, and **policy**, are available for all types of activities. The properties that are available in the **typeProperties** section of the activity vary for each activity type. For Copy Activity, the properties vary depending on the types of data sources and sinks.

For Copy Activity, when the source is of type **RelationalSource** (which includes DB2), the following properties are available in the **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| **query** |Use the custom query to read the data. |SQL query string. For example: `"query": "select * from "MySchema"."MyTable""` |No (if the **tableName** property of a dataset is specified) |

> [!NOTE]
> Schema and table names are case-sensitive. In the query statement, enclose property names by using "" (double quotes).

## JSON example: Copy data from DB2 to Azure Blob storage
This example provides sample JSON definitions that you can use to create a pipeline by using the [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md), or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md). The example shows you how to copy data from a DB2 database to Blob storage. However, data can be copied to [any supported data store sink type](data-factory-data-movement-activities.md#supported-data-stores-and-formats) by using Azure Data Factory Copy Activity.

The sample has the following Data Factory entities:

- A DB2 linked service of type [OnPremisesDb2](data-factory-onprem-db2-connector.md)
- An Azure Blob storage linked service of type [AzureStorage](data-factory-azure-blob-connector.md#linked-service-properties)
- An input [dataset](data-factory-create-datasets.md) of type [RelationalTable](data-factory-onprem-db2-connector.md#dataset-properties)
- An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#dataset-properties)
- A [pipeline](data-factory-create-pipelines.md) with a copy activity that uses the [RelationalSource](data-factory-onprem-db2-connector.md#copy-activity-properties) and [BlobSink](data-factory-azure-blob-connector.md#copy-activity-properties) properties

The sample copies data from a query result in a DB2 database to an Azure blob hourly. The JSON properties that are used in the sample are described in the sections that follow the entity definitions.

As a first step, install and configure a data gateway. Instructions are in the [Moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article.

**DB2 linked service**

```json
{
    "name": "OnPremDb2LinkedService",
    "properties": {
        "type": "OnPremisesDb2",
        "typeProperties": {
            "server": "<server>",
            "database": "<database>",
            "schema": "<schema>",
            "authenticationType": "<authentication type>",
            "username": "<username>",
            "password": "<password>",
            "gatewayName": "<gatewayName>"
        }
    }
}
```

**Azure Blob storage linked service**

```json
{
    "name": "AzureStorageLinkedService",
    "properties": {
        "type": "AzureStorageLinkedService",
        "typeProperties": {
            "connectionString": "DefaultEndpointsProtocol=https;AccountName=<AccountName>;AccountKey=<AccountKey>"
        }
    }
}
```

**DB2 input dataset**

The sample assumes that you have created a table in DB2 named "MyTable" that has a column labeled "timestamp" for the time series data.

The **external** property is set to "true." This setting informs the Data Factory service that this dataset is external to the data factory and is not produced by an activity in the data factory. Notice that the **type** property is set to **RelationalTable**.


```json
{
    "name": "Db2DataSet",
    "properties": {
        "type": "RelationalTable",
        "linkedServiceName": "OnPremDb2LinkedService",
        "typeProperties": {},
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true,
        "policy": {
            "externalData": {
                "retryInterval": "00:01:00",
                "retryTimeout": "00:10:00",
                "maximumRetry": 3
            }
        }
    }
}
```

**Azure Blob output dataset**

Data is written to a new blob every hour by setting the **frequency** property to "Hour" and the **interval** property to 1. The **folderPath** property for the blob is dynamically evaluated based on the start time of the slice that is being processed. The folder path uses the year, month, day, and hour parts of the start time.

```json
{
    "name": "AzureBlobDb2DataSet",
    "properties": {
        "type": "AzureBlob",
        "linkedServiceName": "AzureStorageLinkedService",
        "typeProperties": {
            "folderPath": "mycontainer/db2/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}",
            "format": {
                "type": "TextFormat",
                "rowDelimiter": "\n",
                "columnDelimiter": "\t"
            },
            "partitionedBy": [
                {
                    "name": "Year",
                    "value": {
                        "type": "DateTime",
                        "date": "SliceStart",
                        "format": "yyyy"
                    }
                },
                {
                    "name": "Month",
                    "value": {
                        "type": "DateTime",
                        "date": "SliceStart",
                        "format": "MM"
                    }
                },
                {
                    "name": "Day",
                    "value": {
                        "type": "DateTime",
                        "date": "SliceStart",
                        "format": "dd"
                    }
                },
                {
                    "name": "Hour",
                    "value": {
                        "type": "DateTime",
                        "date": "SliceStart",
                        "format": "HH"
                    }
                }
            ]
        },
        "availability": {
            "frequency": "Hour",
            "interval": 1
        }
    }
}
```

**Pipeline for the copy activity**

The pipeline contains a copy activity that is configured to use specified input and output datasets and which is scheduled to run every hour. In the JSON definition for the pipeline, the **source** type is set to **RelationalSource** and the **sink** type is set to **BlobSink**. The SQL query specified for the **query** property selects the data from the "Orders" table.

```json
{
    "name": "CopyDb2ToBlob",
    "properties": {
        "description": "pipeline for the copy activity",
        "activities": [
            {
                "type": "Copy",
                "typeProperties": {
                    "source": {
                        "type": "RelationalSource",
                        "query": "select * from \"Orders\""
                    },
                    "sink": {
                        "type": "BlobSink"
                    }
                },
                "inputs": [
                    {
                        "name": "Db2DataSet"
                    }
                ],
                "outputs": [
                    {
                        "name": "AzureBlobDb2DataSet"
                    }
                ],
                "policy": {
                    "timeout": "01:00:00",
                    "concurrency": 1
                },
                "scheduler": {
                    "frequency": "Hour",
                    "interval": 1
                },
                "name": "Db2ToBlob"
            }
        ],
        "start": "2014-06-01T18:00:00Z",
        "end": "2014-06-01T19:00:00Z"
    }
}
```

## Type mapping for DB2
As mentioned in the [data movement activities](data-factory-data-movement-activities.md) article, Copy Activity performs automatic type conversions from source type to sink type by using the following two-step approach:

1. Convert from a native source type to a .NET type
2. Convert from a .NET type to a native sink type

The following mappings are used when Copy Activity converts the data from a DB2 type to a .NET type:

| DB2 database type | .NET Framework type |
| --- | --- |
| SmallInt |Int16 |
| Integer |Int32 |
| BigInt |Int64 |
| Real |Single |
| Double |Double |
| Float |Double |
| Decimal |Decimal |
| DecimalFloat |Decimal |
| Numeric |Decimal |
| Date |DateTime |
| Time |TimeSpan |
| Timestamp |DateTime |
| Xml |Byte[] |
| Char |String |
| VarChar |String |
| LongVarChar |String |
| DB2DynArray |String |
| Binary |Byte[] |
| VarBinary |Byte[] |
| LongVarBinary |Byte[] |
| Graphic |String |
| VarGraphic |String |
| LongVarGraphic |String |
| Clob |String |
| Blob |Byte[] |
| DbClob |String |
| SmallInt |Int16 |
| Integer |Int32 |
| BigInt |Int64 |
| Real |Single |
| Double |Double |
| Float |Double |
| Decimal |Decimal |
| DecimalFloat |Decimal |
| Numeric |Decimal |
| Date |DateTime |
| Time |TimeSpan |
| Timestamp |DateTime |
| Xml |Byte[] |
| Char |String |

## Map source to sink columns
To learn how to map columns in the source dataset to columns in the sink dataset, see [Mapping dataset columns in Azure Data Factory](data-factory-map-columns.md).

## Repeatable reads from relational sources
When you copy data from a relational data store, keep repeatability in mind to avoid unintended outcomes. In Azure Data Factory, you can rerun a slice manually. You can also configure the retry **policy** property for a dataset to rerun a slice when a failure occurs. Make sure that the same data is read no matter how many times the slice is rerun, and regardless of how you rerun the slice. For more information, see [Repeatable reads from relational sources](data-factory-repeatable-copy.md#repeatable-read-from-relational-sources).

## Performance and tuning
Learn about key factors that affect the performance of Copy Activity and ways to optimize performance in the [Copy Activity Performance and Tuning Guide](data-factory-copy-activity-performance.md).
