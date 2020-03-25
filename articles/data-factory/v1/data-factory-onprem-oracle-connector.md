---
title: Copy data to or from Oracle by using Data Factory 
description: Learn how to copy data to or from an on-premises Oracle database by using Azure Data Factory.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: shwang

ms.assetid: 3c20aa95-a8a1-4aae-9180-a6a16d64a109
ms.service: data-factory
ms.workload: data-services


ms.topic: conceptual
ms.date: 05/15/2018
ms.author: jingwang

robots: noindex
---
# Copy data to or from Oracle on-premises by using Azure Data Factory

> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](data-factory-onprem-oracle-connector.md)
> * [Version 2 (current version)](../connector-oracle.md)

> [!NOTE]
> This article applies to version 1 of Azure Data Factory. If you're using the current version of the Azure Data Factory service, see [Oracle connector in V2](../connector-oracle.md).


This article explains how to use Copy Activity in Azure Data Factory to move data to or from an on-premises Oracle database. The article builds on [Data movement activities](data-factory-data-movement-activities.md), which presents a general overview of data movement by using Copy Activity.

## Supported scenarios

You can copy data *from an Oracle database* to the following data stores:

[!INCLUDE [data-factory-supported-sink](../../../includes/data-factory-supported-sinks.md)]

You can copy data from the following data stores *to an Oracle database*:

[!INCLUDE [data-factory-supported-sources](../../../includes/data-factory-supported-sources.md)]

## Prerequisites

Data Factory supports connecting to on-premises Oracle sources by using Data Management Gateway. See [Data Management Gateway](data-factory-data-management-gateway.md) to learn more about Data Management Gateway. For step-by-step instructions on how to set up the gateway in a data pipeline to move data, see [Move data from on-premises to cloud](data-factory-move-data-between-onprem-and-cloud.md).

The gateway is required even if the Oracle is hosted in an Azure infrastructure as a service (IaaS) VM. You can install the gateway on the same IaaS VM as the data store or on a different VM, as long as the gateway can connect to the database.

> [!NOTE]
> For tips on troubleshooting issues that are related to connection and the gateway, see [Troubleshoot gateway issues](data-factory-data-management-gateway.md#troubleshooting-gateway-issues).

## Supported versions and installation

This Oracle connector support two versions of drivers:

- **Microsoft driver for Oracle (recommended)**: Beginning in Data Management Gateway version 2.7, a Microsoft driver for Oracle is automatically installed with the gateway. You don't need to install or update the driver to establish connectivity to Oracle. You can also experience better copy performance by using this driver. These versions of Oracle databases are supported:
  - Oracle 12c R1 (12.1)
  - Oracle 11g R1, R2 (11.1, 11.2)
  - Oracle 10g R1, R2 (10.1, 10.2)
  - Oracle 9i R1, R2 (9.0.1, 9.2)
  - Oracle 8i R3 (8.1.7)

    > [!NOTE]
    > Oracle proxy server isn't supported.

    > [!IMPORTANT]
    > Currently, the Microsoft driver for Oracle supports only copying data from Oracle. The driver doesn't support writing to Oracle. The test connection capability on the Data Management Gateway **Diagnostics** tab doesn't support this driver. Alternatively, you can use the Copy wizard to validate connectivity.
    >

- **Oracle Data Provider for .NET**: You can use Oracle Data Provider to copy data from or to Oracle. This component is included in [Oracle Data Access Components for Windows](https://www.oracle.com/technetwork/topics/dotnet/downloads/). Install the relevant version (32-bit or 64-bit) on the machine where the gateway is installed. [Oracle Data Provider .NET 12.1](https://docs.oracle.com/database/121/ODPNT/InstallSystemRequirements.htm#ODPNT149) can access Oracle Database 10g Release 2 and later versions.

	If you select **XCopy Installation**, complete the steps that are described in the readme.htm file. We recommend selecting the installer that has the UI (not the XCopy installer).

	After you install the provider, restart the Data Management Gateway host service on your machine by using the Services applet or Data Management Gateway Configuration Manager.

If you use the Copy wizard to author the copy pipeline, the driver type is autodetermined. The Microsoft driver is used by default, unless your gateway version is earlier than version 2.7 or you select Oracle as the sink.

## Get started

You can create a pipeline that has a copy activity. The pipeline moves data to or from an on-premises Oracle database by using different tools or APIs.

The easiest way to create a pipeline is to use the Copy wizard. See [Tutorial: Create a pipeline by using the Copy wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough on creating a pipeline by using the Copy Data wizard.

You can also use one of the following tools to create a pipeline: **Visual Studio**, **Azure PowerShell**, an **Azure Resource Manager template**, the **.NET API**, or the **REST API**. See the [Copy Activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for step-by-step instructions on how to create a pipeline that has a copy activity.

Whether you use the tools or APIs, complete the following steps to create a pipeline that moves data from a source data store to a sink data store:

1. Create a **data factory**. A data factory can contain one or more pipelines.
2. Create **linked services** to link input and output data stores to your data factory. For example, if you are copying data from an Oracle database to Azure Blob storage, create two linked services to link your Oracle database and Azure storage account to your data factory. For linked service properties that are specific to Oracle, see [Linked service properties](#linked-service-properties).
3. Create **datasets** to represent input and output data for the copy operation. In the example in the preceding step, you create a dataset to specify the table in your Oracle database that contains the input data. You create another dataset to specify the blob container and the folder that holds the data copied from the Oracle database. For dataset properties that are specific to Oracle, see [Dataset properties](#dataset-properties).
4. Create a **pipeline** that has a copy activity that takes a dataset as an input and a dataset as an output. In the preceding example, you use **OracleSource** as a source and **BlobSink** as a sink for the copy activity. Similarly, if you are copying from Azure Blob storage to an Oracle database, you use **BlobSource** and **OracleSink** in the copy activity. For Copy Activity properties that are specific to an Oracle database, see [Copy Activity properties](#copy-activity-properties). For details about how to use a data store as a source or sink, select the link for your data store in the preceding section.

When you use the wizard, JSON definitions for these Data Factory entities are automatically created for you: linked services, datasets, and the pipeline. When you use tools or APIs (except for the .NET API), you define these Data Factory entities by using the JSON format. For samples that have JSON definitions for Data Factory entities that you use to copy data to or from an on-premises Oracle database, see JSON examples.

The following sections provide details about JSON properties that you use to define Data Factory entities.

## Linked service properties

The following table describes JSON elements that are specific to the Oracle linked service:

| Property | Description | Required |
| --- | --- | --- |
| type |The **type** property must be set to **OnPremisesOracle**. |Yes |
| driverType | Specify which driver to use to copy data from or to an Oracle database. Allowed values are **Microsoft** and **ODP** (default). See [Supported version and installation](#supported-versions-and-installation) for driver details. | No |
| connectionString | Specify the information that's needed to connect to the Oracle database instance for the **connectionString** property. | Yes |
| gatewayName | The name of the gateway that's used to connect to the on-premises Oracle server. |Yes |

**Example: Using the Microsoft driver**

> [!TIP]
> If you see an error that says "ORA-01025: UPI parameter out of range" and your Oracle is version 8i, add `WireProtocolMode=1` to your connection string and try again:

```json
{
    "name": "OnPremisesOracleLinkedService",
    "properties": {
        "type": "OnPremisesOracle",
        "typeProperties": {
            "driverType": "Microsoft",
            "connectionString":"Host=<host>;Port=<port>;Sid=<service ID>;User Id=<user name>;Password=<password>;",
            "gatewayName": "<gateway name>"
        }
    }
}
```

**Example: Using the ODP driver**

To learn about allowed formats, see [Oracle data provider for .NET ODP](https://www.connectionstrings.com/oracle-data-provider-for-net-odp-net/).

```json
{
    "name": "OnPremisesOracleLinkedService",
    "properties": {
        "type": "OnPremisesOracle",
        "typeProperties": {
            "connectionString": "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=<host name>)(PORT=<port number>))(CONNECT_DATA=(SERVICE_NAME=<service ID>))); User Id=<user name>;Password=<password>;",
            "gatewayName": "<gateway name>"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties that are available for defining datasets, see [Creating datasets](data-factory-create-datasets.md).

The sections of a dataset JSON file, such as structure, availability, and policy, are similar for all dataset types (for example, for Oracle, Azure Blob storage, and Azure Table storage).

The **typeProperties** section is different for each type of dataset and provides information about the location of the data in the data store. The **typeProperties** section for the dataset of type **OracleTable** has the following properties:

| Property | Description | Required |
| --- | --- | --- |
| tableName |The name of the table in the Oracle database that the linked service refers to. |No (if **oracleReaderQuery** or **OracleSource** is specified) |

## Copy Activity properties

For a full list of sections and properties that are available for defining activities, see [Creating pipelines](data-factory-create-pipelines.md).

Properties like name, description, input and output tables, and policy are available for all types of activities.

> [!NOTE]
> Copy Activity takes only one input and produces only one output.

Properties that are available in the **typeProperties** section of the activity vary with each activity type. Copy Activity properties vary depending on the type of source and sink.

### OracleSource

In Copy Activity, when the source is the **OracleSource** type, the following properties are available in the **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| oracleReaderQuery |Use the custom query to read data. |A SQL query string. For example, "select \* from **MyTable**". <br/><br/>If not specified, this SQL statement is executed: "select \* from **MyTable**" |No<br />(if **tableName** of **dataset** is specified) |

### OracleSink

**OracleSink** supports the following properties:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| writeBatchTimeout |The wait time for the batch insert operation to complete before it times out. |**timespan**<br/><br/> Example: 00:30:00 (30 minutes) |No |
| writeBatchSize |Inserts data into the SQL table when the buffer size reaches the value of **writeBatchSize**. |Integer (number of rows) |No (default: 100) |
| sqlWriterCleanupScript |Specifies a query for Copy Activity to execute so that the data of a specific slice is cleaned up. |A query statement. |No |
| sliceIdentifierColumnName |Specifies the column name for Copy Activity to fill with an autogenerated slice identifier. The value for **sliceIdentifierColumnName** is used to clean up data of a specific slice when rerun. |The column name of a column that has data type of **binary(32)**. |No |

## JSON examples for copying data to and from the Oracle database

The following examples provide sample JSON definitions that you can use to create a pipeline by using [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md). The examples show how to copy data from or to an Oracle database and to or from Azure Blob storage. However, data can be copied to any of the sinks listed in [Supported data stores and formats](data-factory-data-movement-activities.md#supported-data-stores-and-formats) by using Copy Activity in Azure Data Factory.

**Example: Copy data from Oracle to Azure Blob storage**

The sample has the following Data Factory entities:

* A linked service of type [OnPremisesOracle](data-factory-onprem-oracle-connector.md#linked-service-properties).
* A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#linked-service-properties).
* An input [dataset](data-factory-create-datasets.md) of type [OracleTable](data-factory-onprem-oracle-connector.md#dataset-properties).
* An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#dataset-properties).
* A [pipeline](data-factory-create-pipelines.md) with a copy activity that uses [OracleSource](data-factory-onprem-oracle-connector.md#copy-activity-properties) as source and [BlobSink](data-factory-azure-blob-connector.md#copy-activity-properties) as sink.

The sample copies data from a table in an on-premises Oracle database to a blob hourly. For more information about various properties that are used in the sample, see the sections that follow the samples.

**Oracle linked service**

```json
{
    "name": "OnPremisesOracleLinkedService",
    "properties": {
        "type": "OnPremisesOracle",
        "typeProperties": {
            "driverType": "Microsoft",
            "connectionString":"Host=<host>;Port=<port>;Sid=<service ID>;User Id=<username>;Password=<password>;",
            "gatewayName": "<gateway name>"
        }
    }
}
```

**Azure Blob storage linked service**

```json
{
    "name": "StorageLinkedService",
    "properties": {
        "type": "AzureStorage",
        "typeProperties": {
            "connectionString": "DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<account key>"
        }
    }
}
```

**Oracle input dataset**

The sample assumes that you have created a table named **MyTable** in Oracle. It contains a column called **timestampcolumn** for time series data.

Setting **external**: **true** informs the Data Factory service that the dataset is external to the data factory and that the dataset isn't produced by an activity in the data factory.

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

**Azure Blob output dataset**

Data is written to a new blob every hour (**frequency**: **hour**, **interval**: **1**). The folder path and file name for the blob are dynamically evaluated based on the start time of the slice that's being processed. The folder path uses the year, month, day, and hour part of the start time.

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

**Pipeline with a copy activity**

The pipeline contains a copy activity that's configured to use the input and output datasets and scheduled to run hourly. In the pipeline JSON definition, the **source** type is set to **OracleSource** and the **sink** type is set to **BlobSink**. The SQL query that you specify by using the **oracleReaderQuery** property selects the data in the past hour to copy.

```json
{
    "name":"SamplePipeline",
    "properties":{
        "start":"2014-06-01T18:00:00",
        "end":"2014-06-01T19:00:00",
        "description":"pipeline for a copy activity",
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

**Example: Copy data from Azure Blob storage to Oracle**

This sample shows how to copy data from an Azure Blob storage account to an on-premises Oracle database. However, you can copy data *directly* from any of the sources listed in [Supported data stores and formats](data-factory-data-movement-activities.md#supported-data-stores-and-formats) by using Copy Activity in Azure Data Factory.

The sample has the following Data Factory entities:

* A linked service of type [OnPremisesOracle](data-factory-onprem-oracle-connector.md#linked-service-properties).
* A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#linked-service-properties).
* An input [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#dataset-properties).
* An output [dataset](data-factory-create-datasets.md) of type [OracleTable](data-factory-onprem-oracle-connector.md#dataset-properties).
* A [pipeline](data-factory-create-pipelines.md) that has a copy activity that uses [BlobSource](data-factory-azure-blob-connector.md#copy-activity-properties) as source [OracleSink](data-factory-onprem-oracle-connector.md#copy-activity-properties) as sink.

The sample copies data from a blob to a table in an on-premises Oracle database every hour. For more information about various properties that are used in the sample, see the sections that follow the samples.

**Oracle linked service**

```json
{
    "name": "OnPremisesOracleLinkedService",
    "properties": {
        "type": "OnPremisesOracle",
        "typeProperties": {
            "connectionString": "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=<host name>)(PORT=<port number>))(CONNECT_DATA=(SERVICE_NAME=<service ID>)));
            User Id=<username>;Password=<password>;",
            "gatewayName": "<gateway name>"
        }
    }
}
```

**Azure Blob storage linked service**

```json
{
    "name": "StorageLinkedService",
    "properties": {
        "type": "AzureStorage",
        "typeProperties": {
            "connectionString": "DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<account key>"
        }
    }
}
```

**Azure blob input dataset**

Data is picked up from a new blob every hour (**frequency**: **hour**, **interval**: **1**). The folder path and file name for the blob are dynamically evaluated based on the start time of the slice that's being processed. The folder path uses the year, month, and day part of the start time. The file name uses the hour part of the start time. The setting **external**: **true** informs the Data Factory service that this table is external to the data factory and is not produced by an activity in the data factory.

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

**Oracle output dataset**

The sample assumes you have created a table named **MyTable** in Oracle. Create the table in Oracle with the same number of columns that you expect the blob CSV file to contain. New rows are added to the table every hour.

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

**Pipeline with a copy activity**

The pipeline contains a copy activity that's configured to use the input and output datasets and scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **BlobSource** and the **sink** type is set to **OracleSink**.

```json
{
    "name":"SamplePipeline",
    "properties":{
        "start":"2014-06-01T18:00:00",
        "end":"2014-06-05T19:00:00",
        "description":"pipeline with a copy activity",
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

**Error message**

    Copy activity met invalid parameters: 'UnknownParameterName', Detailed message: Unable to find the requested .NET Framework Data Provider. It may not be installed.

**Possible causes**

* The .NET Framework Data Provider for Oracle wasn't installed.
* The .NET Framework Data Provider for Oracle was installed to .NET Framework 2.0 and isn't found in the .NET Framework 4.0 folders.

**Resolution**

* If you haven't installed the .NET Provider for Oracle, [install it](https://www.oracle.com/technetwork/topics/dotnet/downloads/), and then retry the scenario.
* If you see the error message even after you install the provider, complete the following steps:
    1. Open the machine config file for .NET 2.0 from the folder <system disk\>:\Windows\Microsoft.NET\Framework64\v2.0.50727\CONFIG\machine.config.
    2. Search for **Oracle Data Provider for .NET**. You should be able to find an entry as shown in the following sample under **system.data** > **DbProviderFactories**:
        `<add name="Oracle Data Provider for .NET" invariant="Oracle.DataAccess.Client" description="Oracle Data Provider for .NET" type="Oracle.DataAccess.Client.OracleClientFactory, Oracle.DataAccess, Version=2.112.3.0, Culture=neutral, PublicKeyToken=89b483f429c47342" />`
* Copy this entry to the machine.config file in the following .NET 4.0 folder: <system disk\>:\Windows\Microsoft.NET\Framework64\v4.0.30319\Config\machine.config. Then, change the version to 4.xxx.x.x.
* Install <ODP.NET Installed Path\>\11.2.0\client_1\odp.net\bin\4\Oracle.DataAccess.dll in the global assembly cache (GAC) by running **gacutil /i [provider path]**.

### Problem 2: Date/time formatting

**Error message**

    Message=Operation failed in Oracle Database with the following error: 'ORA-01861: literal does not match format string'.,Source=,''Type=Oracle.DataAccess.Client.OracleException,Message=ORA-01861: literal does not match format string,Source=Oracle Data Provider for .NET,'.

**Resolution**

You might need to adjust the query string in your copy activity based on how dates are configured in your Oracle database. Here's an example (using the **to_date** function):

    "oracleReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= to_date(\\'{0:MM-dd-yyyy HH:mm}\\',\\'MM/DD/YYYY HH24:MI\\') AND timestampcolumn < to_date(\\'{1:MM-dd-yyyy HH:mm}\\',\\'MM/DD/YYYY HH24:MI\\') ', WindowStart, WindowEnd)"


## Type mapping for Oracle

As mentioned in [Data movement activities](data-factory-data-movement-activities.md), Copy Activity performs automatic type conversions from source types to sink types by using the following two-step approach:

1. Convert from native source types to the .NET type.
2. Convert from the .NET type to the native sink type.

When you move data from Oracle, the following mappings are used from the Oracle data type to the .NET type and vice versa:

| Oracle data type | .NET Framework data type |
| --- | --- |
| BFILE |Byte[] |
| BLOB |Byte[]<br/>(only supported on Oracle 10g and later versions when you use a Microsoft driver) |
| CHAR |String |
| CLOB |String |
| DATE |DateTime |
| FLOAT |Decimal, String (if precision > 28) |
| INTEGER |Decimal, String (if precision > 28) |
| INTERVAL YEAR TO MONTH |Int32 |
| INTERVAL DAY TO SECOND |TimeSpan |
| LONG |String |
| LONG RAW |Byte[] |
| NCHAR |String |
| NCLOB |String |
| NUMBER |Decimal, String (if precision > 28) |
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
> Data types **INTERVAL YEAR TO MONTH** and **INTERVAL DAY TO SECOND** aren't supported when you use a Microsoft driver.

## Map source to sink columns

To learn more about mapping columns in the source dataset to columns in the sink dataset, see [Mapping dataset columns in Data Factory](data-factory-map-columns.md).

## Repeatable read from relational sources

When you copy data from relational data stores, keep repeatability in mind to avoid unintended outcomes. In Azure Data Factory, you can manually rerun a slice. You can also configure a retry policy for a dataset so that a slice is rerun when a failure occurs. When a slice is rerun, either manually or by a retry policy, make sure that the same data is read no matter how many times a slice is run. For more information, see [Repeatable read from relational sources](data-factory-repeatable-copy.md#repeatable-read-from-relational-sources).

## Performance and tuning

See the [Copy Activity performance and tuning guide](data-factory-copy-activity-performance.md) to learn about key factors that affect the performance of data movement (Copy Activity) in Azure Data Factory. You can also learn about various ways to optimize it.
