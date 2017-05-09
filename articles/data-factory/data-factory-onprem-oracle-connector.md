---
title: Move data to/from Oracle using Data Factory | Microsoft Docs
description: Learn how to move data to/from Oracle database that is on-premises using Azure Data Factory.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: monicar

ms.assetid: 3c20aa95-a8a1-4aae-9180-a6a16d64a109
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/29/2017
ms.author: jingwang

---
# Move data to/from on-premises Oracle using Azure Data Factory
This article explains how to use the Copy Activity in Azure Data Factory to move data to/from an on-premises Oracle database. It builds on the [Data Movement Activities](data-factory-data-movement-activities.md) article, which presents a general overview of data movement with the copy activity.

## Supported scenarios
You can copy data **from an Oracle database** to the following data stores:

[!INCLUDE [data-factory-supported-sink](../../includes/data-factory-supported-sinks.md)]

You can copy data from the following data stores **to an Oracle database**:

[!INCLUDE [data-factory-supported-sources](../../includes/data-factory-supported-sources.md)]

## Prerequisites
Data Factory supports connecting to on-premises Oracle sources using the Data Management Gateway. See [Data Management Gateway](data-factory-data-management-gateway.md) article to learn about Data Management Gateway and [Move data from on-premises to cloud](data-factory-move-data-between-onprem-and-cloud.md) article for step-by-step instructions on setting up the gateway a data pipeline to move data.

Gateway is required even if the Oracle is hosted in an Azure IaaS VM. You can install the gateway on the same IaaS VM as the data store or on a different VM as long as the gateway can connect to the database.

> [!NOTE]
> See [Troubleshoot gateway issues](data-factory-data-management-gateway.md#troubleshooting-gateway-issues) for tips on troubleshooting connection/gateway related issues.

## Supported versions and installation
This Oracle connector support two versions of drivers:

- **Microsoft driver for Oracle (recommended)**: starting from Data Management Gateway version 2.7, a Microsoft driver for Oracle is automatically installed along with the gateway, so you don't need to additionally handle the driver in order to establish connectivity to Oracle, and you can also experience better copy performance using this driver. Oracle Database version 10g Release 2 or later are supported.

    > [!IMPORTANT]
    > Currently Microsoft driver for Oracle only supports copying data from Oracle but not writing to Oracle. And note the test connection capability in Data Management Gateway Diagnostics tab does not support this driver. Alternatively, you can use the copy wizard to validate the connectivity.
    >

- **Oracle Data Provider for .NET:** you can also choose to use Oracle Data Provider to copy data from/to Oracle. This component is included in [Oracle Data Access Components for Windows](http://www.oracle.com/technetwork/topics/dotnet/downloads/). Install the appropriate version (32/64 bit) on the machine where the gateway is installed. [Oracle Data Provider .NET 12.1](http://docs.oracle.com/database/121/ODPNT/InstallSystemRequirements.htm#ODPNT149) can access to Oracle Database 10g Release 2 or later.

	If you choose “XCopy Installation”, follow steps in the readme.htm. We recommend you choose the installer with UI (non-XCopy one).

	After installing the provider, **restart** the Data Management Gateway host service on your machine using Services applet (or) Data Management Gateway Configuration Manager.  

If you use copy wizard to author the copy pipeline, the driver type will be auto-determined. Microsoft driver will be used by default, unless your gateway version is lower than 2.7 or you choose Oracle as sink.

## Getting started
You can create a pipeline with a copy activity that moves data to/from an on-premises Oracle database by using different tools/APIs.

The easiest way to create a pipeline is to use the **Copy Wizard**. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough on creating a pipeline using the Copy data wizard.

You can also use the following tools to create a pipeline: **Azure portal**, **Visual Studio**, **Azure PowerShell**, **Azure Resource Manager template**, **.NET API**, and **REST API**. See [Copy activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for step-by-step instructions to create a pipeline with a copy activity.

Whether you use the tools or APIs, you perform the following steps to create a pipeline that moves data from a source data store to a sink data store:

1. Create a **data factory**. A data factory may contain one or more pipelines. 
2. Create **linked services** to link input and output data stores to your data factory. For example, if you are copying data from an Oralce database to an Azure blob storage, you create two linked services to link your Oracle database and Azure storage account to your data factory. For linked service properties that are specific to Oracle, see [linked service properties](#linked-service-properties) section.
3. Create **datasets** to represent input and output data for the copy operation. In the example mentioned in the last step, you create a dataset to specify the table in your Oracle database that contains the input data. And, you create another dataset to specify the blob container and the folder that holds the data copied from the Oracle database. For dataset properties that are specific to Oracle, see [dataset properties](#dataset-properties) section.
4. Create a **pipeline** with a copy activity that takes a dataset as an input and a dataset as an output. In the example mentioned earlier, you use OracleSource as a source and BlobSink as a sink for the copy activity. Similarly, if you are copying from Azure Blob Storage to Oracle Database, you use BlobSource and OracleSink in the copy activity. For copy activity properties that are specific to Oracle database, see [copy activity properties](#copy-activity-properties) section. For details on how to use a data store as a source or a sink, click the link in the previous section for your data store. 

When you use the wizard, JSON definitions for these Data Factory entities (linked services, datasets, and the pipeline) are automatically created for you. When you use tools/APIs (except .NET API), you define these Data Factory entities by using the JSON format.  For samples with JSON definitions for Data Factory entities that are used to copy data to/from an on-premises Oracle database, see [JSON examples](#json-examples-for-copying-data-to-and-from-oracle-database) section of this article.

The following sections provide details about JSON properties that are used to define Data Factory entities:

## Linked service properties
The following table provides description for JSON elements specific to Oracle linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **OnPremisesOracle** |Yes |
| driverType | Specify which driver to use to copy data from/to Oracle Database. Allowed values are **Microsoft** or **ODP** (default). See [Supported version and installation](#supported-versions-and-installation) section on driver details. | No |
| connectionString | Specify information needed to connect to the Oracle Database instance for the connectionString property. | Yes |
| gatewayName | Name of the gateway that that is used to connect to the on-premises Oracle server |Yes |

**Example: using Microsoft driver:**
```json
{
    "name": "OnPremisesOracleLinkedService",
    "properties": {
        "type": "OnPremisesOracle",
        "typeProperties": {
            "driverType": "Microsoft",
            "connectionString":"Host=<host>;Port=<port>;Sid=<sid>;User Id=<username>;Password=<password>;",
            "gatewayName": "<gateway name>"
        }
    }
}
```

**Example: using ODP driver**

Refer to [this site](https://www.connectionstrings.com/oracle-data-provider-for-net-odp-net/) for the allowed formats.

```json
{
    "name": "OnPremisesOracleLinkedService",
    "properties": {
        "type": "OnPremisesOracle",
        "typeProperties": {
            "connectionString": "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=<hostname>)(PORT=<port number>))(CONNECT_DATA=(SERVICE_NAME=<SID>)));
User Id=<username>;Password=<password>;",
            "gatewayName": "<gateway name>"
        }
    }
}
```

## Dataset properties
For a full list of sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections such as structure, availability, and policy of a dataset JSON are similar for all dataset types (Oracle, Azure blob, Azure table, etc.).

The typeProperties section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for the dataset of type OracleTable has the following properties:

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table in the Oracle Database that the linked service refers to. |No (if **oracleReaderQuery** of **OracleSource** is specified) |

## Copy activity properties
For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties such as name, description, input and output tables, and policy are available for all types of activities.

> [!NOTE]
> The Copy Activity takes only one input and produces only one output.

Whereas, properties available in the typeProperties section of the activity vary with each activity type. For Copy activity, they vary depending on the types of sources and sinks.

### OracleSource
In Copy activity, when the source is of type **OracleSource** the following properties are available in **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| oracleReaderQuery |Use the custom query to read data. |SQL query string. For example: select * from MyTable <br/><br/>If not specified, the SQL statement that is executed: select * from MyTable |No (if **tableName** of **dataset** is specified) |

### OracleSink
**OracleSink** supports the following properties:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| writeBatchTimeout |Wait time for the batch insert operation to complete before it times out. |timespan<br/><br/> Example: 00:30:00 (30 minutes). |No |
| writeBatchSize |Inserts data into the SQL table when the buffer size reaches writeBatchSize. |Integer (number of rows) |No (default: 100) |
| sqlWriterCleanupScript |Specify a query for Copy Activity to execute such that data of a specific slice is cleaned up. |A query statement. |No |
| sliceIdentifierColumnName |Specify column name for Copy Activity to fill with auto generated slice identifier, which is used to clean up data of a specific slice when rerun. |Column name of a column with data type of binary(32). |No |

## JSON examples for copying data to and from Oracle database
The following example provides sample JSON definitions that you can use to create a pipeline by using [Azure portal](data-factory-copy-activity-tutorial-using-azure-portal.md) or [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md). They show how to copy data from/to an Oracle database to/from Azure Blob Storage. However, data can be copied to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores-and-formats) using the Copy Activity in Azure Data Factory.   

## Example: Copy data from Oracle to Azure Blob

The sample has the following data factory entities:

1. A linked service of type [OnPremisesOracle](data-factory-onprem-oracle-connector.md#linked-service-properties).
2. A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#linked-service-properties).
3. An input [dataset](data-factory-create-datasets.md) of type [OracleTable](data-factory-onprem-oracle-connector.md#dataset-properties).
4. An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#dataset-properties).
5. A [pipeline](data-factory-create-pipelines.md) with Copy activity that uses [OracleSource](data-factory-onprem-oracle-connector.md#copy-activity-properties) as source and [BlobSink](data-factory-azure-blob-connector.md#copy-activity-properties) as sink.

The sample copies data from a table in an on-premises Oracle database to a blob hourly. For more information on various properties used in the sample, see documentation in sections following the samples.

**Oracle linked service:**

```json
{
    "name": "OnPremisesOracleLinkedService",
    "properties": {
        "type": "OnPremisesOracle",
        "typeProperties": {
            "driverType": "Microsoft",
            "connectionString":"Host=<host>;Port=<port>;Sid=<sid>;User Id=<username>;Password=<password>;",
            "gatewayName": "<gateway name>"
        }
    }
}
```

**Azure Blob storage linked service:**

```json
{
    "name": "StorageLinkedService",
    "properties": {
        "type": "AzureStorage",
        "typeProperties": {
            "connectionString": "DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<Account key>"
        }
    }
}
```

**Oracle input dataset:**

The sample assumes you have created a table “MyTable” in Oracle and it contains a column called “timestampcolumn” for time series data.

Setting “external”: ”true” informs the Data Factory service that the dataset is external to the data factory and is not produced by an activity in the data factory.

```json
{
    "name": "OracleInput",
    "properties": {
        "type": "OracleTable",
        "linkedServiceName": "OnPremisesOracleLinkedService",
        "typeProperties": {
            "tableName": "MyTable"
        },
        "external": true,
        "availability": {
            "offset": "01:00:00",
            "interval": "1",
            "anchorDateTime": "2014-02-27T12:00:00",
            "frequency": "Hour"
        },
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
    "name": "AzureBlobOutput",
    "properties": {
        "type": "AzureBlob",
        "linkedServiceName": "StorageLinkedService",
        "typeProperties": {
            "folderPath": "mycontainer/myfolder/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}",
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
            ],
            "format": {
                "type": "TextFormat",
                "columnDelimiter": "\t",
                "rowDelimiter": "\n"
            }
        },
        "availability": {
            "frequency": "Hour",
            "interval": 1
        }
    }
}
```

**Pipeline with Copy activity:**

The pipeline contains a Copy Activity that is configured to use the input and output datasets and is scheduled to run hourly. In the pipeline JSON definition, the **source** type is set to **OracleSource** and **sink** type is set to **BlobSink**.  The SQL query specified with **oracleReaderQuery** property selects the data in the past hour to copy.

```json
{  
    "name":"SamplePipeline",
    "properties":{  
        "start":"2014-06-01T18:00:00",
        "end":"2014-06-01T19:00:00",
        "description":"pipeline for copy activity",
        "activities":[  
            {
                "name": "OracletoBlob",
                "description": "copy activity",
                "type": "Copy",
                "inputs": [
                    {
                        "name": " OracleInput"
                    }
                ],
                "outputs": [
                    {
                        "name": "AzureBlobOutput"
                    }
                ],
                "typeProperties": {
                    "source": {
                        "type": "OracleSource",
                        "oracleReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd HH:mm}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd HH:mm}\\'', WindowStart, WindowEnd)"
                    },
                    "sink": {
                        "type": "BlobSink"
                    }
                },
                "scheduler": {
                    "frequency": "Hour",
                    "interval": 1
                },
                "policy": {
                    "concurrency": 1,
                    "executionPriorityOrder": "OldestFirst",
                    "retry": 0,
                    "timeout": "01:00:00"
                }
            }
        ]
    }
}
```

## Example: Copy data from Azure Blob to Oracle
This sample shows how to copy data from an Azure Blob Storage to an on-premises Oracle database. However, data can be copied **directly** from any of the sources stated [here](data-factory-data-movement-activities.md#supported-data-stores-and-formats) using the Copy Activity in Azure Data Factory.  

The sample has the following data factory entities:

1. A linked service of type [OnPremisesOracle](data-factory-onprem-oracle-connector.md#linked-service-properties).
2. A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#linked-service-properties).
3. An input [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#dataset-properties).
4. An output [dataset](data-factory-create-datasets.md) of type [OracleTable](data-factory-onprem-oracle-connector.md#dataset-properties).
5. A [pipeline](data-factory-create-pipelines.md) with Copy activity that uses [BlobSource](data-factory-azure-blob-connector.md#copy-activity-properties) as source [OracleSink](data-factory-onprem-oracle-connector.md#copy-activity-properties) as sink.

The sample copies data from a blob to a table in an on-premises Oracle database every hour. For more information on various properties used in the sample, see documentation in sections following the samples.

**Oracle linked service:**
```json
{
    "name": "OnPremisesOracleLinkedService",
    "properties": {
        "type": "OnPremisesOracle",
        "typeProperties": {
            "connectionString": "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=<hostname>)(PORT=<port number>))(CONNECT_DATA=(SERVICE_NAME=<SID>)));
            User Id=<username>;Password=<password>;",
            "gatewayName": "<gateway name>"
        }
    }
}
```

**Azure Blob storage linked service:**
```json
{
    "name": "StorageLinkedService",
    "properties": {
        "type": "AzureStorage",
        "typeProperties": {
            "connectionString": "DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<Account key>"
        }
    }
}
```

**Azure Blob input dataset**

Data is picked up from a new blob every hour (frequency: hour, interval: 1). The folder path and file name for the blob are dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, and day part of the start time and file name uses the hour part of the start time. “external”: “true” setting informs the Data Factory service that this table is external to the data factory and is not produced by an activity in the data factory.

```json
{
    "name": "AzureBlobInput",
    "properties": {
        "type": "AzureBlob",
        "linkedServiceName": "StorageLinkedService",
        "typeProperties": {
            "folderPath": "mycontainer/myfolder/yearno={Year}/monthno={Month}/dayno={Day}",
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
                }
            ],
            "format": {
                "type": "TextFormat",
                "columnDelimiter": ",",
                "rowDelimiter": "\n"
            }
        },
        "external": true,
        "availability": {
            "frequency": "Day",
            "interval": 1
        },
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

**Oracle output dataset:**

The sample assumes you have created a table “MyTable” in Oracle. Create the table in Oracle with the same number of columns as you expect the Blob CSV file to contain. New rows are added to the table every hour.

```json
{
    "name": "OracleOutput",
    "properties": {
        "type": "OracleTable",
        "linkedServiceName": "OnPremisesOracleLinkedService",
        "typeProperties": {
            "tableName": "MyTable"
        },
        "availability": {
            "frequency": "Day",
            "interval": "1"
        }
    }
}
```

**Pipeline with Copy activity:**

The pipeline contains a Copy Activity that is configured to use the input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **BlobSource** and the **sink** type is set to **OracleSink**.  

```json
{  
    "name":"SamplePipeline",
    "properties":{  
        "start":"2014-06-01T18:00:00",
        "end":"2014-06-05T19:00:00",
        "description":"pipeline with copy activity",
        "activities":[  
            {
                "name": "AzureBlobtoOracle",
                "description": "Copy Activity",
                "type": "Copy",
                "inputs": [
                    {
                        "name": "AzureBlobInput"
                    }
                ],
                "outputs": [
                    {
                        "name": "OracleOutput"
                    }
                ],
                "typeProperties": {
                    "source": {
                        "type": "BlobSource"
                    },
                    "sink": {
                        "type": "OracleSink"
                    }
                },
                "scheduler": {
                    "frequency": "Day",
                    "interval": 1
                },
                "policy": {
                    "concurrency": 1,
                    "executionPriorityOrder": "OldestFirst",
                    "retry": 0,
                    "timeout": "01:00:00"
                }
            }
        ]
    }
}
```


## Troubleshooting tips
### Problem 1: .NET Framework Data Provider

You see the following **error message**:

    Copy activity met invalid parameters: 'UnknownParameterName', Detailed message: Unable to find the requested .Net Framework Data Provider. It may not be installed”.  

**Possible causes:**

1. The .NET Framework Data Provider for Oracle was not installed.
2. The .NET Framework Data Provider for Oracle was installed to .NET Framework 2.0 and is not found in the .NET Framework 4.0 folders.

**Resolution/Workaround:**

1. If you haven't installed the .NET Provider for Oracle, [install it](http://www.oracle.com/technetwork/topics/dotnet/downloads/) and retry the scenario.
2. If you get the error message even after installing the provider, do the following steps:
   1. Open machine config of .NET 2.0 from the folder: <system disk>:\Windows\Microsoft.NET\Framework64\v2.0.50727\CONFIG\machine.config.
   2. Search for **Oracle Data Provider for .NET**, and you should be able to find an entry as shown in the following sample under **system.data** -> **DbProviderFactories**:
           “<add name="Oracle Data Provider for .NET" invariant="Oracle.DataAccess.Client" description="Oracle Data Provider for .NET" type="Oracle.DataAccess.Client.OracleClientFactory, Oracle.DataAccess, Version=2.112.3.0, Culture=neutral, PublicKeyToken=89b483f429c47342" />”
3. Copy this entry to the machine.config file in the following v4.0 folder: <system disk>:\Windows\Microsoft.NET\Framework64\v4.0.30319\Config\machine.config, and change the version to 4.xxx.x.x.
4. Install “<ODP.NET Installed Path>\11.2.0\client_1\odp.net\bin\4\Oracle.DataAccess.dll” into the global assembly cache (GAC) by running `gacutil /i [provider path]`.## Troubleshooting tips

### Problem 2: datetime formatting

You see the following **error message**:

    Message=Operation failed in Oracle Database with the following error: 'ORA-01861: literal does not match format string'.,Source=,''Type=Oracle.DataAccess.Client.OracleException,Message=ORA-01861: literal does not match format string,Source=Oracle Data Provider for .NET,'.

**Resolution/Workaround:**

You may need to adjust the query string in your copy activity based on how dates are configured in your Oracle database, as shown in the following sample (using the to_date function):

    "oracleReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= to_date(\\'{0:MM-dd-yyyy HH:mm}\\',\\'MM/DD/YYYY HH24:MI\\')  AND timestampcolumn < to_date(\\'{1:MM-dd-yyyy HH:mm}\\',\\'MM/DD/YYYY HH24:MI\\') ', WindowStart, WindowEnd)"


### Type mapping for Oracle
As mentioned in the [data movement activities](data-factory-data-movement-activities.md) article Copy activity performs automatic type conversions from source types to sink types with the following 2-step approach:

1. Convert from native source types to .NET type
2. Convert from .NET type to native sink type

When moving data from Oracle, the following mappings are used from Oracle data type to .NET type and vice versa.

| Oracle data type | .NET Framework data type |
| --- | --- |
| BFILE |Byte[] |
| BLOB |Byte[] |
| CHAR |String |
| CLOB |String |
| DATE |DateTime |
| FLOAT |Decimal |
| INTEGER |Decimal |
| INTERVAL YEAR TO MONTH |Int32 |
| INTERVAL DAY TO SECOND |TimeSpan |
| LONG |String |
| LONG RAW |Byte[] |
| NCHAR |String |
| NCLOB |String |
| NUMBER |Decimal |
| NVARCHAR2 |String |
| RAW |Byte[] |
| ROWID |String |
| TIMESTAMP |DateTime |
| TIMESTAMP WITH LOCAL TIME ZONE |DateTime |
| TIMESTAMP WITH TIME ZONE |DateTime |
| UNSIGNED INTEGER |Number |
| VARCHAR2 |String |
| XML |String |

> [!NOTE]
> Data type **INTERVAL YEAR TO MONTH** and **INTERVAL DAY TO SECOND** are not supported when using Microsoft driver.

## Map source to sink columns
To learn about mapping columns in source dataset to columns in sink dataset, see [Mapping dataset columns in Azure Data Factory](data-factory-map-columns.md).

## Repeatable read from relational sources
When copying data from relational data stores, keep repeatability in mind to avoid unintended outcomes. In Azure Data Factory, you can rerun a slice manually. You can also configure retry policy for a dataset so that a slice is rerun when a failure occurs. When a slice is rerun in either way, you need to make sure that the same data is read no matter how many times a slice is run. See [Repeatable read from relational sources](data-factory-repeatable-copy.md#repeatable-read-from-relational-sources).

## Performance and Tuning
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.
