---
title: Move data From PostgreSQL using Azure Data Factory 
description: Learn about how to move data from PostgreSQL Database using Azure Data Factory.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: shwang


ms.assetid: 888d9ebc-2500-4071-b6d1-0f6bd1b5997c
ms.service: data-factory
ms.workload: data-services


ms.topic: conceptual
ms.date: 01/10/2018
ms.author: jingwang

robots: noindex
---
# Move data from PostgreSQL using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](data-factory-onprem-postgresql-connector.md)
> * [Version 2 (current version)](../connector-postgresql.md)

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [PostgreSQL connector in V2](../connector-postgresql.md).


This article explains how to use the Copy Activity in Azure Data Factory to move data from an on-premises PostgreSQL database. It builds on the [Data Movement Activities](data-factory-data-movement-activities.md) article, which presents a general overview of data movement with the copy activity.

You can copy data from an on-premises PostgreSQL data store to any supported sink data store. For a list of data stores supported as sinks by the copy activity, see [supported data stores](data-factory-data-movement-activities.md#supported-data-stores-and-formats). Data factory currently supports moving data from a PostgreSQL database to other data stores, but not for moving data from other data stores to an PostgreSQL database.

## Prerequisites

Data Factory service supports connecting to on-premises PostgreSQL sources using the Data Management Gateway. See [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article to learn about Data Management Gateway and step-by-step instructions on setting up the gateway.

Gateway is required even if the PostgreSQL database is hosted in an Azure IaaS VM. You can install gateway on the same IaaS VM as the data store or on a different VM as long as the gateway can connect to the database.

> [!NOTE]
> See [Troubleshoot gateway issues](data-factory-data-management-gateway.md#troubleshooting-gateway-issues) for tips on troubleshooting connection/gateway related issues.

## Supported versions and installation
For Data Management Gateway to connect to the PostgreSQL Database, install the [Ngpsql data provider for PostgreSQL](https://go.microsoft.com/fwlink/?linkid=282716) with version between 2.0.12 and 3.1.9 on the same system as the Data Management Gateway. PostgreSQL version 7.4 and above is supported.

## Getting started
You can create a pipeline with a copy activity that moves data from an on-premises PostgreSQL data store by using different tools/APIs.

- The easiest way to create a pipeline is to use the **Copy Wizard**. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough on creating a pipeline using the Copy data wizard.
- You can also use the following tools to create a pipeline:
  - Visual Studio
  - Azure PowerShell
  - Azure Resource Manager template
  - .NET API
  - REST API

    See [Copy activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for step-by-step instructions to create a pipeline with a copy activity.

Whether you use the tools or APIs, you perform the following steps to create a pipeline that moves data from a source data store to a sink data store:

1. Create **linked services** to link input and output data stores to your data factory.
2. Create **datasets** to represent input and output data for the copy operation.
3. Create a **pipeline** with a copy activity that takes a dataset as an input and a dataset as an output.

When you use the wizard, JSON definitions for these Data Factory entities (linked services, datasets, and the pipeline) are automatically created for you. When you use tools/APIs (except .NET API), you define these Data Factory entities by using the JSON format. For a sample with JSON definitions for Data Factory entities that are used to copy data from an on-premises PostgreSQL data store, see [JSON example: Copy data from PostgreSQL to Azure Blob](#json-example-copy-data-from-postgresql-to-azure-blob) section of this article.

The following sections provide details about JSON properties that are used to define Data Factory entities specific to a PostgreSQL data store:

## Linked service properties
The following table provides description for JSON elements specific to PostgreSQL linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **OnPremisesPostgreSql** |Yes |
| server |Name of the PostgreSQL server. |Yes |
| database |Name of the PostgreSQL database. |Yes |
| schema |Name of the schema in the database. The schema name is case-sensitive. |No |
| authenticationType |Type of authentication used to connect to the PostgreSQL database. Possible values are: Anonymous, Basic, and Windows. |Yes |
| username |Specify user name if you are using Basic or Windows authentication. |No |
| password |Specify password for the user account you specified for the username. |No |
| gatewayName |Name of the gateway that the Data Factory service should use to connect to the on-premises PostgreSQL database. |Yes |

## Dataset properties
For a full list of sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections such as structure, availability, and policy of a dataset JSON are similar for all dataset types.

The typeProperties section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for dataset of type **RelationalTable** (which includes PostgreSQL dataset) has the following properties:

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table in the PostgreSQL Database instance that linked service refers to. The tableName is case-sensitive. |No (if **query** of **RelationalSource** is specified) |

## Copy activity properties
For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties such as name, description, input and output tables, and policy are available for all types of activities.

Whereas, properties available in the typeProperties section of the activity vary with each activity type. For Copy activity, they vary depending on the types of sources and sinks.

When source is of type **RelationalSource** (which includes PostgreSQL), the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |SQL query string. For example: `"query": "select * from \"MySchema\".\"MyTable\""`. |No (if **tableName** of **dataset** is specified) |

> [!NOTE]
> Schema and table names are case-sensitive. Enclose them in `""` (double quotes) in the query.

**Example:**

 `"query": "select * from \"MySchema\".\"MyTable\""`

## JSON example: Copy data from PostgreSQL to Azure Blob
This example provides sample JSON definitions that you can use to create a pipeline by using [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md). They show how to copy data from PostgreSQL database to Azure Blob Storage. However, data can be copied to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores-and-formats) using the Copy Activity in Azure Data Factory.

> [!IMPORTANT]
> This sample provides JSON snippets. It does not include step-by-step instructions for creating the data factory. See [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article for step-by-step instructions.

The sample has the following data factory entities:

1. A linked service of type [OnPremisesPostgreSql](data-factory-onprem-postgresql-connector.md#linked-service-properties).
2. A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#linked-service-properties).
3. An input [dataset](data-factory-create-datasets.md) of type [RelationalTable](data-factory-onprem-postgresql-connector.md#dataset-properties).
4. An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#dataset-properties).
5. The [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [RelationalSource](data-factory-onprem-postgresql-connector.md#copy-activity-properties) and [BlobSink](data-factory-azure-blob-connector.md#copy-activity-properties).

The sample copies data from a query result in PostgreSQL database to a blob every hour. The JSON properties used in these samples are described in sections following the samples.

As a first step, set up the data management gateway. The instructions are in the [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article.

**PostgreSQL linked service:**

```json
{
    "name": "OnPremPostgreSqlLinkedService",
    "properties": {
        "type": "OnPremisesPostgreSql",
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
**Azure Blob storage linked service:**

```json
{
    "name": "AzureStorageLinkedService",
    "properties": {
        "type": "AzureStorage",
        "typeProperties": {
            "connectionString": "DefaultEndpointsProtocol=https;AccountName=<AccountName>;AccountKey=<AccountKey>"
        }
    }
}
```
**PostgreSQL input dataset:**

The sample assumes you have created a table “MyTable” in PostgreSQL and it contains a column called “timestamp” for time series data.

Setting `"external": true` informs the Data Factory service that the dataset is external to the data factory and is not produced by an activity in the data factory.

```json
{
    "name": "PostgreSqlDataSet",
    "properties": {
        "type": "RelationalTable",
        "linkedServiceName": "OnPremPostgreSqlLinkedService",
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

**Azure Blob output dataset:**

Data is written to a new blob every hour (frequency: hour, interval: 1). The folder path and file name for the blob are dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, day, and hours parts of the start time.

```json
{
    "name": "AzureBlobPostgreSqlDataSet",
    "properties": {
        "type": "AzureBlob",
        "linkedServiceName": "AzureStorageLinkedService",
        "typeProperties": {
            "folderPath": "mycontainer/postgresql/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}",
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

**Pipeline with Copy activity:**

The pipeline contains a Copy Activity that is configured to use the input and output datasets and is scheduled to run hourly. In the pipeline JSON definition, the **source** type is set to **RelationalSource** and **sink** type is set to **BlobSink**. The SQL query specified for the **query** property selects the data from the public.usstates table in the PostgreSQL database.

```json
{
    "name": "CopyPostgreSqlToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [
            {
                "type": "Copy",
                "typeProperties": {
                    "source": {
                        "type": "RelationalSource",
                        "query": "select * from \"public\".\"usstates\""
                    },
                    "sink": {
                        "type": "BlobSink"
                    }
                },
                "inputs": [
                    {
                        "name": "PostgreSqlDataSet"
                    }
                ],
                "outputs": [
                    {
                        "name": "AzureBlobPostgreSqlDataSet"
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
                "name": "PostgreSqlToBlob"
            }
        ],
        "start": "2014-06-01T18:00:00Z",
        "end": "2014-06-01T19:00:00Z"
    }
}
```
## Type mapping for PostgreSQL
As mentioned in the [data movement activities](data-factory-data-movement-activities.md) article Copy activity performs automatic type conversions from source types to sink types with the following 2-step approach:

1. Convert from native source types to .NET type
2. Convert from .NET type to native sink type

When moving data to PostgreSQL, the following mappings are used from PostgreSQL type to .NET type.

| PostgreSQL Database type | PostgresSQL aliases | .NET Framework type |
| --- | --- | --- |
| abstime | |Datetime |
| bigint |int8 |Int64 |
| bigserial |serial8 |Int64 |
| bit [(n)] | |Byte[], String |
| bit varying [ (n) ] |varbit |Byte[], String |
| boolean |bool |Boolean |
| box | |Byte[], String |
| bytea | |Byte[], String |
| character [(n)] |char [(n)] |String |
| character varying [(n)] |varchar [(n)] |String |
| cid | |String |
| cidr | |String |
| circle | |Byte[], String |
| date | |Datetime |
| daterange | |String |
| double precision |float8 |Double |
| inet | |Byte[], String |
| intarry | |String |
| int4range | |String |
| int8range | |String |
| integer |int, int4 |Int32 |
| interval [fields] [(p)] | |Timespan |
| json | |String |
| jsonb | |Byte[] |
| line | |Byte[], String |
| lseg | |Byte[], String |
| macaddr | |Byte[], String |
| money | |Decimal |
| numeric [(p, s)] |decimal [(p, s)] |Decimal |
| numrange | |String |
| oid | |Int32 |
| path | |Byte[], String |
| pg_lsn | |Int64 |
| point | |Byte[], String |
| polygon | |Byte[], String |
| real |float4 |Single |
| smallint |int2 |Int16 |
| smallserial |serial2 |Int16 |
| serial |serial4 |Int32 |
| text | |String |

## Map source to sink columns
To learn about mapping columns in source dataset to columns in sink dataset, see [Mapping dataset columns in Azure Data Factory](data-factory-map-columns.md).

## Repeatable read from relational sources
When copying data from relational data stores, keep repeatability in mind to avoid unintended outcomes. In Azure Data Factory, you can rerun a slice manually. You can also configure retry policy for a dataset so that a slice is rerun when a failure occurs. When a slice is rerun in either way, you need to make sure that the same data is read no matter how many times a slice is run. See [Repeatable read from relational sources](data-factory-repeatable-copy.md#repeatable-read-from-relational-sources).

## Performance and Tuning
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.
