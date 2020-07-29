---
title: Move data from an FTP server by using Azure Data Factory 
description: Learn about how to move data from an FTP server using Azure Data Factory.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: shwang


ms.assetid: eea3bab0-a6e4-4045-ad44-9ce06229c718
ms.service: data-factory
ms.workload: data-services


ms.topic: conceptual
ms.date: 05/02/2018
ms.author: jingwang

robots: noindex
---
# Move data from an FTP server by using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](data-factory-ftp-connector.md)
> * [Version 2 (current version)](../connector-ftp.md)

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [FTP connector in V2](../connector-ftp.md).

This article explains how to use the copy activity in Azure Data Factory to move data from an FTP server. It builds on the [Data movement activities](data-factory-data-movement-activities.md) article, which presents a general overview of data movement with the copy activity.

You can copy data from an FTP server to any supported sink data store. For a list of data stores supported as sinks by the copy activity, see the [supported data stores](data-factory-data-movement-activities.md#supported-data-stores-and-formats) table. Data Factory currently supports only moving data from an FTP server to other data stores, but not moving data from other data stores to an FTP server. It supports both on-premises and cloud FTP servers.

> [!NOTE]
> The copy activity does not delete the source file after it is successfully copied to the destination. If you need to delete the source file after a successful copy, create a custom activity to delete the file, and use the activity in the pipeline.

## Enable connectivity
If you are moving data from an **on-premises** FTP server to a cloud data store (for example, to Azure Blob storage), install and use Data Management Gateway. The Data Management Gateway is a client agent that is installed on your on-premises machine, and it allows cloud services to connect to an on-premises resource. For details, see [Data Management Gateway](data-factory-data-management-gateway.md). For step-by-step instructions on setting up the gateway and using it, see [Moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md). You use the gateway to connect to an FTP server, even if the server is on an Azure infrastructure as a service (IaaS) virtual machine (VM).

It is possible to install the gateway on the same on-premises machine or IaaS VM as the FTP server. However, we recommend that you install the gateway on a separate machine or IaaS VM to avoid resource contention, and for better performance. When you install the gateway on a separate machine, the machine should be able to access the FTP server.

## Get started
You can create a pipeline with a copy activity that moves data from an FTP source by using different tools or APIs.

The easiest way to create a pipeline is to use the **Data Factory Copy Wizard**. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough.

You can also use the following tools to create a pipeline: **Visual Studio**, **PowerShell**, **Azure Resource Manager template**, **.NET API**, and **REST API**. See [Copy activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for step-by-step instructions to create a pipeline with a copy activity.

Whether you use the tools or APIs, perform the following steps to create a pipeline that moves data from a source data store to a sink data store:

1. Create **linked services** to link input and output data stores to your data factory.
2. Create **datasets** to represent input and output data for the copy operation.
3. Create a **pipeline** with a copy activity that takes a dataset as an input and a dataset as an output.

When you use the wizard, JSON definitions for these Data Factory entities (linked services, datasets, and the pipeline) are automatically created for you. When you use tools or APIs (except .NET API), you define these Data Factory entities by using the JSON format. For a sample with JSON definitions for Data Factory entities that are used to copy data from an FTP data store, see the [JSON example: Copy data from FTP server to Azure blob](#json-example-copy-data-from-ftp-server-to-azure-blob) section of this article.

> [!NOTE]
> For details about supported file and compression formats to use, see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md).

The following sections provide details about JSON properties that are used to define Data Factory entities specific to FTP.

## Linked service properties
The following table describes JSON elements specific to an FTP linked service.

| Property | Description | Required | Default |
| --- | --- | --- | --- |
| type |Set this to FtpServer. |Yes |&nbsp; |
| host |Specify the name or IP address of the FTP server. |Yes |&nbsp; |
| authenticationType |Specify the authentication type. |Yes |Basic, Anonymous |
| username |Specify the user who has access to the FTP server. |No |&nbsp; |
| password |Specify the password for the user (username). |No |&nbsp; |
| encryptedCredential |Specify the encrypted credential to access the FTP server. |No |&nbsp; |
| gatewayName |Specify the name of the gateway in Data Management Gateway to connect to an on-premises FTP server. |No |&nbsp; |
| port |Specify the port on which the FTP server is listening. |No |21 |
| enableSsl |Specify whether to use FTP over an SSL/TLS channel. |No |true |
| enableServerCertificateValidation |Specify whether to enable server TLS/SSL certificate validation when you are using FTP over SSL/TLS channel. |No |true |

>[!NOTE]
>The FTP connector supports accessing FTP server with either no encryption or explicit SSL/TLS encryption; it doesn’t support implicit SSL/TLS encryption.

### Use Anonymous authentication

```JSON
{
    "name": "FTPLinkedService",
    "properties": {
        "type": "FtpServer",
        "typeProperties": {
            "authenticationType": "Anonymous",
              "host": "myftpserver.com"
        }
    }
}
```

### Use username and password in plain text for basic authentication

```JSON
{
    "name": "FTPLinkedService",
    "properties": {
    "type": "FtpServer",
        "typeProperties": {
            "host": "myftpserver.com",
            "authenticationType": "Basic",
            "username": "Admin",
            "password": "123456"
        }
    }
}
```

### Use port, enableSsl, enableServerCertificateValidation

```JSON
{
    "name": "FTPLinkedService",
    "properties": {
        "type": "FtpServer",
        "typeProperties": {
            "host": "myftpserver.com",
            "authenticationType": "Basic",
            "username": "Admin",
            "password": "123456",
            "port": "21",
            "enableSsl": true,
            "enableServerCertificateValidation": true
        }
    }
}
```

### Use encryptedCredential for authentication and gateway

```JSON
{
    "name": "FTPLinkedService",
    "properties": {
        "type": "FtpServer",
        "typeProperties": {
            "host": "myftpserver.com",
            "authenticationType": "Basic",
            "encryptedCredential": "xxxxxxxxxxxxxxxxx",
            "gatewayName": "mygateway"
        }
    }
}
```

## Dataset properties
For a full list of sections and properties available for defining datasets, see [Creating datasets](data-factory-create-datasets.md). Sections such as structure, availability, and policy of a dataset JSON are similar for all dataset types.

The **typeProperties** section is different for each type of dataset. It provides information that is specific to the dataset type. The **typeProperties** section for a dataset of type **FileShare** has the following properties:

| Property | Description | Required |
| --- | --- | --- |
| folderPath |Subpath to the folder. Use escape character ‘ \ ’ for special characters in the string. See Sample linked service and dataset definitions for examples.<br/><br/>You can combine this property with **partitionBy** to have folder paths based on slice start and end date-times. |Yes |
| fileName |Specify the name of the file in the **folderPath** if you want the table to refer to a specific file in the folder. If you do not specify any value for this property, the table points to all files in the folder.<br/><br/>When **fileName** is not specified for an output dataset, the name of the generated file is in the following format: <br/><br/>`Data.<Guid>.txt` (Example: Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt) |No |
| fileFilter |Specify a filter to be used to select a subset of files in the **folderPath**, rather than all files.<br/><br/>Allowed values are: `*` (multiple characters) and `?` (single character).<br/><br/>Example 1: `"fileFilter": "*.log"`<br/>Example 2: `"fileFilter": 2014-1-?.txt"`<br/><br/> **fileFilter** is applicable for an input FileShare dataset. This property is not supported with Hadoop Distributed File System (HDFS). |No |
| partitionedBy |Used to specify a dynamic **folderPath** and **fileName** for time series data. For example, you can specify a **folderPath** that is parameterized for every hour of data. |No |
| format | The following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see the [Text Format](data-factory-supported-file-and-compression-formats.md#text-format), [Json Format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro Format](data-factory-supported-file-and-compression-formats.md#avro-format), [Orc Format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections. <br><br> If you want to copy files as they are between file-based stores (binary copy), skip the format section in both input and output dataset definitions. |No |
| compression | Specify the type and level of compression for the data. Supported types are **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**, and supported levels are **Optimal** and **Fastest**. For more information, see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No |
| useBinaryTransfer |Specify whether to use the binary transfer mode. The values are true for binary mode (this is the default value), and false for ASCII. This property can only be used when the associated linked service type is of type: FtpServer. |No |

> [!NOTE]
> **fileName** and **fileFilter** cannot be used simultaneously.

### Use the partionedBy property
As mentioned in the previous section, you can specify a dynamic **folderPath** and **fileName** for time series data with the **partitionedBy** property.

To learn about time series datasets, scheduling, and slices, see [Creating datasets](data-factory-create-datasets.md), [Scheduling and execution](data-factory-scheduling-and-execution.md), and [Creating pipelines](data-factory-create-pipelines.md).

#### Sample 1

```json
"folderPath": "wikidatagateway/wikisampledataout/{Slice}",
"partitionedBy":
[
    { "name": "Slice", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyyMMddHH" } },
],
```
In this example, {Slice} is replaced with the value of Data Factory system variable SliceStart, in the format specified (YYYYMMDDHH). The SliceStart refers to start time of the slice. The folder path is different for each slice. (For example, wikidatagateway/wikisampledataout/2014100103 or wikidatagateway/wikisampledataout/2014100104.)

#### Sample 2

```json
"folderPath": "wikidatagateway/wikisampledataout/{Year}/{Month}/{Day}",
"fileName": "{Hour}.csv",
"partitionedBy":
[
    { "name": "Year", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyy" } },
    { "name": "Month", "value": { "type": "DateTime", "date": "SliceStart", "format": "MM" } },
    { "name": "Day", "value": { "type": "DateTime", "date": "SliceStart", "format": "dd" } },
    { "name": "Hour", "value": { "type": "DateTime", "date": "SliceStart", "format": "hh" } }
],
```
In this example, the year, month, day, and time of SliceStart are extracted into separate variables that are used by the **folderPath** and **fileName** properties.

## Copy activity properties
For a full list of sections and properties available for defining activities, see [Creating pipelines](data-factory-create-pipelines.md). Properties such as name, description, input and output tables, and policies are available for all types of activities.

Properties available in the **typeProperties** section of the activity, on the other hand, vary with each activity type. For the copy activity, the type properties vary depending on the types of sources and sinks.

In copy activity, when the source is of type **FileSystemSource**, the following property is available in **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| recursive |Indicates whether the data is read recursively from the subfolders, or only from the specified folder. |True, False (default) |No |

## JSON example: Copy data from FTP server to Azure Blob
This sample shows how to copy data from an FTP server to Azure Blob storage. However, data can be copied directly to any of the sinks stated in the [supported data stores and formats](data-factory-data-movement-activities.md#supported-data-stores-and-formats), by using the copy activity in Data Factory.

The following examples provide sample JSON definitions that you can use to create a pipeline by using [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md), or [PowerShell](data-factory-copy-activity-tutorial-using-powershell.md):

* A linked service of type [FtpServer](#linked-service-properties)
* A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#linked-service-properties)
* An input [dataset](data-factory-create-datasets.md) of type [FileShare](#dataset-properties)
* An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#dataset-properties)
* A [pipeline](data-factory-create-pipelines.md) with copy activity that uses [FileSystemSource](#copy-activity-properties) and [BlobSink](data-factory-azure-blob-connector.md#copy-activity-properties)

The sample copies data from an FTP server to an Azure blob every hour. The JSON properties used in these samples are described in sections following the samples.

### FTP linked service

This example uses basic authentication, with the user name and password in plain text. You can also use one of the following ways:

* Anonymous authentication
* Basic authentication with encrypted credentials
* FTP over SSL/TLS (FTPS)

See the [FTP linked service](#linked-service-properties) section for different types of authentication you can use.

```JSON
{
    "name": "FTPLinkedService",
    "properties": {
        "type": "FtpServer",
        "typeProperties": {
            "host": "myftpserver.com",
            "authenticationType": "Basic",
            "username": "Admin",
            "password": "123456"
        }
    }
}
```
### Azure Storage linked service

```JSON
{
  "name": "AzureStorageLinkedService",
  "properties": {
    "type": "AzureStorage",
    "typeProperties": {
      "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
    }
  }
}
```
### FTP input dataset

This dataset refers to the FTP folder `mysharedfolder` and file `test.csv`. The pipeline copies the file to the destination.

Setting **external** to **true** informs the Data Factory service that the dataset is external to the data factory, and is not produced by an activity in the data factory.

```JSON
{
  "name": "FTPFileInput",
  "properties": {
    "type": "FileShare",
    "linkedServiceName": "FTPLinkedService",
    "typeProperties": {
      "folderPath": "mysharedfolder",
      "fileName": "test.csv",
      "useBinaryTransfer": true
    },
    "external": true,
    "availability": {
      "frequency": "Hour",
      "interval": 1
    }
  }
}
```

### Azure Blob output dataset

Data is written to a new blob every hour (frequency: hour, interval: 1). The folder path for the blob is dynamically evaluated, based on the start time of the slice that is being processed. The folder path uses the year, month, day, and hours parts of the start time.

```JSON
{
    "name": "AzureBlobOutput",
    "properties": {
        "type": "AzureBlob",
        "linkedServiceName": "AzureStorageLinkedService",
        "typeProperties": {
            "folderPath": "mycontainer/ftp/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}",
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


### A copy activity in a pipeline with file system source and blob sink

The pipeline contains a copy activity that is configured to use the input and output datasets, and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **FileSystemSource**, and the **sink** type is set to **BlobSink**.

```JSON
{
    "name": "pipeline",
    "properties": {
        "activities": [{
            "name": "FTPToBlobCopy",
            "inputs": [{
                "name": "FtpFileInput"
            }],
            "outputs": [{
                "name": "AzureBlobOutput"
            }],
            "type": "Copy",
            "typeProperties": {
                "source": {
                    "type": "FileSystemSource"
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
                "executionPriorityOrder": "NewestFirst",
                "retry": 1,
                "timeout": "00:05:00"
            }
        }],
        "start": "2016-08-24T18:00:00Z",
        "end": "2016-08-24T19:00:00Z"
    }
}
```
> [!NOTE]
> To map columns from source dataset to columns from sink dataset, see [Mapping dataset columns in Azure Data Factory](data-factory-map-columns.md).

## Next steps
See the following articles:

* To learn about key factors that impact performance of data movement (copy activity) in Data Factory, and various ways to optimize it, see the [Copy activity performance and tuning guide](data-factory-copy-activity-performance.md).

* For step-by-step instructions for creating a pipeline with a copy activity, see the [Copy activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).
