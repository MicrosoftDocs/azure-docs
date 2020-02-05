---
title: Copy data to/from a file system using Azure Data Factory 
description: Learn how to copy data to and from an on-premises file system by using Azure Data Factory.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: shwang


ms.assetid: ce19f1ae-358e-4ffc-8a80-d802505c9c84
ms.service: data-factory
ms.workload: data-services


ms.topic: conceptual
ms.date: 04/13/2018
ms.author: jingwang

robots: noindex
---
# Copy data to and from an on-premises file system by using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](data-factory-onprem-file-system-connector.md)
> * [Version 2 (current version)](../connector-file-system.md)

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [File System connector in V2](../connector-file-system.md).


This article explains how to use the Copy Activity in Azure Data Factory to copy data to/from an on-premises file system. It builds on the [Data Movement Activities](data-factory-data-movement-activities.md) article, which presents a general overview of data movement with the copy activity.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Supported scenarios
You can copy data **from an on-premises file system** to the following data stores:

[!INCLUDE [data-factory-supported-sink](../../../includes/data-factory-supported-sinks.md)]

You can copy data from the following data stores **to an on-premises file system**:

[!INCLUDE [data-factory-supported-sources](../../../includes/data-factory-supported-sources.md)]

> [!NOTE]
> Copy Activity does not delete the source file after it is successfully copied to the destination. If you need to delete the source file after a successful copy, create a custom activity to delete the file and use the activity in the pipeline.

## Enabling connectivity
Data Factory supports connecting to and from an on-premises file system via **Data Management Gateway**. You must install the Data Management Gateway in your on-premises environment for the Data Factory service to connect to any supported on-premises data store including file system. To learn about Data Management Gateway and for step-by-step instructions on setting up the gateway, see [Move data between on-premises sources and the cloud with Data Management Gateway](data-factory-move-data-between-onprem-and-cloud.md). Apart from Data Management Gateway, no other binary files need to be installed to communicate to and from an on-premises file system. You must install and use the Data Management Gateway even if the file system is in Azure IaaS VM. For detailed information about the gateway, see [Data Management Gateway](data-factory-data-management-gateway.md).

To use a Linux file share, install [Samba](https://www.samba.org/) on your Linux server, and install Data Management Gateway on a Windows server. Installing Data Management Gateway on a Linux server is not supported.

## Getting started
You can create a pipeline with a copy activity that moves data to/from a file system by using different tools/APIs.

The easiest way to create a pipeline is to use the **Copy Wizard**. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough on creating a pipeline using the Copy data wizard.

You can also use the following tools to create a pipeline: **Visual Studio**, **Azure PowerShell**, **Azure Resource Manager template**, **.NET API**, and **REST API**. See [Copy activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for step-by-step instructions to create a pipeline with a copy activity.

Whether you use the tools or APIs, you perform the following steps to create a pipeline that moves data from a source data store to a sink data store:

1. Create a **data factory**. A data factory may contain one or more pipelines.
2. Create **linked services** to link input and output data stores to your data factory. For example, if you are copying data from an Azure blob storage to an on-premises file system, you create two linked services to link your on-premises file system and Azure storage account to your data factory. For linked service properties that are specific to an on-premises file system, see [linked service properties](#linked-service-properties) section.
3. Create **datasets** to represent input and output data for the copy operation. In the example mentioned in the last step, you create a dataset to specify the blob container and folder that contains the input data. And, you create another dataset to specify the folder and file name (optional) in your file system. For dataset properties that are specific to on-premises file system, see [dataset properties](#dataset-properties) section.
4. Create a **pipeline** with a copy activity that takes a dataset as an input and a dataset as an output. In the example mentioned earlier, you use BlobSource as a source and FileSystemSink as a sink for the copy activity. Similarly, if you are copying from on-premises file system to Azure Blob Storage, you use FileSystemSource and BlobSink in the copy activity. For copy activity properties that are specific to on-premises file system, see [copy activity properties](#copy-activity-properties) section. For details on how to use a data store as a source or a sink, click the link in the previous section for your data store.

When you use the wizard, JSON definitions for these Data Factory entities (linked services, datasets, and the pipeline) are automatically created for you. When you use tools/APIs (except .NET API), you define these Data Factory entities by using the JSON format.  For samples with JSON definitions for Data Factory entities that are used to copy data to/from a file system, see [JSON examples](#json-examples-for-copying-data-to-and-from-file-system) section of this article.

The following sections provide details about JSON properties that are used to define Data Factory entities specific to file system:

## Linked service properties
You can link an on-premises file system to an Azure data factory with the **On-Premises File Server** linked service. The following table provides descriptions for JSON elements that are specific to the On-Premises File Server linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |Ensure that the type property is set to **OnPremisesFileServer**. |Yes |
| host |Specifies the root path of the folder that you want to copy. Use the escape character ‘ \ ’ for special characters in the string. See [Sample linked service and dataset definitions](#sample-linked-service-and-dataset-definitions) for examples. |Yes |
| userid |Specify the ID of the user who has access to the server. |No (if you choose encryptedCredential) |
| password |Specify the password for the user (userid). |No (if you choose encryptedCredential |
| encryptedCredential |Specify the encrypted credentials that you can get by running the New-AzDataFactoryEncryptValue cmdlet. |No (if you choose to specify userid and password in plain text) |
| gatewayName |Specifies the name of the gateway that Data Factory should use to connect to the on-premises file server. |Yes |


### Sample linked service and dataset definitions
| Scenario | Host in linked service definition | folderPath in dataset definition |
| --- | --- | --- |
| Local folder on Data Management Gateway machine: <br/><br/>Examples: D:\\\* or D:\folder\subfolder\\\* |D:\\\\ (for Data Management Gateway 2.0 and later versions) <br/><br/> localhost (for earlier versions than Data Management Gateway 2.0) |.\\\\ or folder\\\\subfolder (for Data Management Gateway 2.0 and later versions) <br/><br/>D:\\\\ or D:\\\\folder\\\\subfolder (for gateway version below 2.0) |
| Remote shared folder: <br/><br/>Examples: \\\\myserver\\share\\\* or \\\\myserver\\share\\folder\\subfolder\\\* |\\\\\\\\myserver\\\\share |.\\\\ or folder\\\\subfolder |

>[!NOTE]
>When authoring via UI, you don't need to input double backslash (`\\`) to escape like you do via JSON, specify single backslash.

### Example: Using username and password in plain text

```JSON
{
  "Name": "OnPremisesFileServerLinkedService",
  "properties": {
    "type": "OnPremisesFileServer",
    "typeProperties": {
      "host": "\\\\Contosogame-Asia",
      "userid": "Admin",
      "password": "123456",
      "gatewayName": "mygateway"
    }
  }
}
```

### Example: Using encryptedcredential

```JSON
{
  "Name": " OnPremisesFileServerLinkedService ",
  "properties": {
    "type": "OnPremisesFileServer",
    "typeProperties": {
      "host": "D:\\",
      "encryptedCredential": "WFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5xxxxxxxxxxxxxxxxx",
      "gatewayName": "mygateway"
    }
  }
}
```

## Dataset properties
For a full list of sections and properties that are available for defining datasets, see [Creating datasets](data-factory-create-datasets.md). Sections such as structure, availability, and policy of a dataset JSON are similar for all dataset types.

The typeProperties section is different for each type of dataset. It provides information such as the location and format of the data in the data store. The typeProperties section for the dataset of type **FileShare** has the following properties:

| Property | Description | Required |
| --- | --- | --- |
| folderPath |Specifies the subpath to the folder. Use the escape character '\' for special characters in the string. Wildcard filter is not supported. See [Sample linked service and dataset definitions](#sample-linked-service-and-dataset-definitions) for examples.<br/><br/>You can combine this property with **partitionBy** to have folder paths based on slice start/end date-times. |Yes |
| fileName |Specify the name of the file in the **folderPath** if you want the table to refer to a specific file in the folder. If you do not specify any value for this property, the table points to all files in the folder.<br/><br/>When **fileName** is not specified for an output dataset and **preserveHierarchy** is not specified in activity sink, the name of the generated file is in the following format: <br/><br/>`Data.<Guid>.txt` (Example: Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt) |No |
| fileFilter |Specify a filter to be used to select a subset of files in the folderPath rather than all files. <br/><br/>Allowed values are: `*` (multiple characters) and `?` (single character).<br/><br/>Example 1: "fileFilter": "*.log"<br/>Example 2: "fileFilter": 2014-1-?.txt"<br/><br/>Note that fileFilter is applicable for an input FileShare dataset. |No |
| partitionedBy |You can use partitionedBy to specify a dynamic folderPath/fileName for time-series data. An example is folderPath parameterized for every hour of data. |No |
| format | The following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](data-factory-supported-file-and-compression-formats.md#text-format), [Json Format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro Format](data-factory-supported-file-and-compression-formats.md#avro-format), [Orc Format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections. <br><br> If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions. |No |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**. Supported levels are: **Optimal** and **Fastest**. see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No |

> [!NOTE]
> You cannot use fileName and fileFilter simultaneously.

### Using partitionedBy property
As mentioned in the previous section, you can specify a dynamic folderPath and filename for time series data with the **partitionedBy** property, [Data Factory functions, and the system variables](data-factory-functions-variables.md).

To understand more details on time-series datasets, scheduling, and slices, see [Creating datasets](data-factory-create-datasets.md), [Scheduling and execution](data-factory-scheduling-and-execution.md), and [Creating pipelines](data-factory-create-pipelines.md).

#### Sample 1:

```JSON
"folderPath": "wikidatagateway/wikisampledataout/{Slice}",
"partitionedBy":
[
    { "name": "Slice", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyyMMddHH" } },
],
```

In this example, {Slice} is replaced with the value of the Data Factory system variable SliceStart in the format (YYYYMMDDHH). SliceStart refers to start time of the slice. The folderPath is different for each slice. For example: wikidatagateway/wikisampledataout/2014100103 or wikidatagateway/wikisampledataout/2014100104.

#### Sample 2:

```JSON
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

In this example, year, month, day, and time of SliceStart are extracted into separate variables that the folderPath and fileName properties use.

## Copy activity properties
For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties such as name, description, input and output datasets, and policies are available for all types of activities. Whereas, properties available in the **typeProperties** section of the activity vary with each activity type.

For Copy activity, they vary depending on the types of sources and sinks. If you are moving data from an on-premises file system, you set the source type in the copy activity to **FileSystemSource**. Similarly, if you are moving data to an on-premises file system, you set the sink type in the copy activity to **FileSystemSink**. This section provides a list of properties supported by FileSystemSource and FileSystemSink.

**FileSystemSource** supports the following properties:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| recursive |Indicates whether the data is read recursively from the subfolders or only from the specified folder. |True, False (default) |No |

**FileSystemSink** supports the following properties:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| copyBehavior |Defines the copy behavior when the source is BlobSource or FileSystem. |**PreserveHierarchy:** Preserves the file hierarchy in the target folder. That is, the relative path of the source file to the source folder is the same as the relative path of the target file to the target folder.<br/><br/>**FlattenHierarchy:** All files from the source folder are created in the first level of target folder. The target files are created with an autogenerated name.<br/><br/>**MergeFiles:** Merges all files from the source folder to one file. If the file name/blob name is specified, the merged file name is the specified name. Otherwise, it is an auto-generated file name. |No |

### recursive and copyBehavior examples
This section describes the resulting behavior of the Copy operation for different combinations of values for the recursive and copyBehavior properties.

| recursive value | copyBehavior value | Resulting behavior |
| --- | --- | --- |
| true |preserveHierarchy |For a source folder Folder1 with the following structure,<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target folder Folder1 is created with the same structure as the source:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5 |
| true |flattenHierarchy |For a source folder Folder1 with the following structure,<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target Folder1 is created with the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File5 |
| true |mergeFiles |For a source folder Folder1 with the following structure,<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target Folder1 is created with the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1 + File2 + File3 + File4 + File 5 contents are merged into one file with an auto-generated file name. |
| false |preserveHierarchy |For a source folder Folder1 with the following structure,<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target folder Folder1 is created with the following structure:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/><br/>Subfolder1 with File3, File4, and File5 is not picked up. |
| false |flattenHierarchy |For a source folder Folder1 with the following structure,<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target folder Folder1 is created with the following structure:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File2<br/><br/>Subfolder1 with File3, File4, and File5 is not picked up. |
| false |mergeFiles |For a source folder Folder1 with the following structure,<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target folder Folder1 is created with the following structure:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1 + File2 contents are merged into one file with an auto-generated file name.<br/>&nbsp;&nbsp;&nbsp;&nbsp;Auto-generated name for File1<br/><br/>Subfolder1 with File3, File4, and File5 is not picked up. |

## Supported file and compression formats
See [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md) article on details.

## JSON examples for copying data to and from file system
The following examples provide sample JSON definitions that you can use to create a pipeline by using [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md). They show how to copy data to and from an on-premises file system and Azure Blob storage. However, you can copy data *directly* from any of the sources to any of the sinks listed in [Supported sources and sinks](data-factory-data-movement-activities.md#supported-data-stores-and-formats) by using Copy Activity in Azure Data Factory.

### Example: Copy data from an on-premises file system to Azure Blob storage
This sample shows how to copy data from an on-premises file system to Azure Blob storage. The sample has the following Data Factory entities:

* A linked service of type [OnPremisesFileServer](#linked-service-properties).
* A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#linked-service-properties).
* An input [dataset](data-factory-create-datasets.md) of type [FileShare](#dataset-properties).
* An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#dataset-properties).
* A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [FileSystemSource](#copy-activity-properties) and [BlobSink](data-factory-azure-blob-connector.md#copy-activity-properties).

The following sample copies time-series data from an on-premises file system to Azure Blob storage every hour. The JSON properties that are used in these samples are described in the sections after the samples.

As a first step, set up Data Management Gateway as per the instructions in [Move data between on-premises sources and the cloud with Data Management Gateway](data-factory-move-data-between-onprem-and-cloud.md).

**On-Premises File Server linked service:**

```JSON
{
  "Name": "OnPremisesFileServerLinkedService",
  "properties": {
    "type": "OnPremisesFileServer",
    "typeProperties": {
      "host": "\\\\Contosogame-Asia.<region>.corp.<company>.com",
      "userid": "Admin",
      "password": "123456",
      "gatewayName": "mygateway"
    }
  }
}
```

We recommend using the **encryptedCredential** property instead the **userid** and **password** properties. See [File Server linked service](#linked-service-properties) for details about this linked service.

**Azure Storage linked service:**

```JSON
{
  "name": "StorageLinkedService",
  "properties": {
    "type": "AzureStorage",
    "typeProperties": {
      "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
    }
  }
}
```

**On-premises file system input dataset:**

Data is picked up from a new file every hour. The folderPath and fileName properties are determined based on the start time of the slice.

Setting `"external": "true"` informs Data Factory that the dataset is external to the data factory and is not produced by an activity in the data factory.

```JSON
{
  "name": "OnpremisesFileSystemInput",
  "properties": {
    "type": " FileShare",
    "linkedServiceName": " OnPremisesFileServerLinkedService ",
    "typeProperties": {
      "folderPath": "mysharedfolder/yearno={Year}/monthno={Month}/dayno={Day}",
      "fileName": "{Hour}.csv",
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
    "external": true,
    "availability": {
      "frequency": "Hour",
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

**Azure Blob storage output dataset:**

Data is written to a new blob every hour (frequency: hour, interval: 1). The folder path for the blob is dynamically evaluated based on the start time of the slice that is being processed. The folder path uses the year, month, day, and hour parts of the start time.

```JSON
{
  "name": "AzureBlobOutput",
  "properties": {
    "type": "AzureBlob",
    "linkedServiceName": "StorageLinkedService",
    "typeProperties": {
      "folderPath": "mycontainer/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}",
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

**A copy activity in a pipeline with File System source and Blob sink:**

The pipeline contains a copy activity that is configured to use the input and output datasets, and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **FileSystemSource**, and **sink** type is set to **BlobSink**.

```JSON
{
  "name":"SamplePipeline",
  "properties":{
    "start":"2015-06-01T18:00:00",
    "end":"2015-06-01T19:00:00",
    "description":"Pipeline for copy activity",
    "activities":[
      {
        "name": "OnpremisesFileSystemtoBlob",
        "description": "copy activity",
        "type": "Copy",
        "inputs": [
          {
            "name": "OnpremisesFileSystemInput"
          }
        ],
        "outputs": [
          {
            "name": "AzureBlobOutput"
          }
        ],
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
          "executionPriorityOrder": "OldestFirst",
          "retry": 0,
          "timeout": "01:00:00"
        }
      }
    ]
  }
}
```

### Example: Copy data from Azure SQL Database to an on-premises file system
The following sample shows:

* A linked service of type [AzureSqlDatabase.](data-factory-azure-sql-connector.md#linked-service-properties)
* A linked service of type [OnPremisesFileServer](#linked-service-properties).
* An input dataset of type [AzureSqlTable](data-factory-azure-sql-connector.md#dataset-properties).
* An output dataset of type [FileShare](#dataset-properties).
* A pipeline with a copy activity that uses [SqlSource](data-factory-azure-sql-connector.md#copy-activity-properties) and [FileSystemSink](#copy-activity-properties).

The sample copies time-series data from an Azure SQL table to an on-premises file system every hour. The JSON properties that are used in these samples are described in sections after the samples.

**Azure SQL Database linked service:**

```JSON
{
  "name": "AzureSqlLinkedService",
  "properties": {
    "type": "AzureSqlDatabase",
    "typeProperties": {
      "connectionString": "Server=tcp:<servername>.database.windows.net,1433;Database=<databasename>;User ID=<username>@<servername>;Password=<password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
    }
  }
}
```

**On-Premises File Server linked service:**

```JSON
{
  "Name": "OnPremisesFileServerLinkedService",
  "properties": {
    "type": "OnPremisesFileServer",
    "typeProperties": {
      "host": "\\\\Contosogame-Asia.<region>.corp.<company>.com",
      "userid": "Admin",
      "password": "123456",
      "gatewayName": "mygateway"
    }
  }
}
```

We recommend using the **encryptedCredential** property instead of using the **userid** and **password** properties. See [File System linked service](#linked-service-properties) for details about this linked service.

**Azure SQL input dataset:**

The sample assumes that you've created a table “MyTable” in Azure SQL, and it contains a column called “timestampcolumn” for time-series data.

Setting ``“external”: ”true”`` informs Data Factory that the dataset is external to the data factory and is not produced by an activity in the data factory.

```JSON
{
  "name": "AzureSqlInput",
  "properties": {
    "type": "AzureSqlTable",
    "linkedServiceName": "AzureSqlLinkedService",
    "typeProperties": {
      "tableName": "MyTable"
    },
    "external": true,
    "availability": {
      "frequency": "Hour",
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

**On-premises file system output dataset:**

Data is copied to a new file every hour. The folderPath and fileName for the blob are determined based on the start time of the slice.

```JSON
{
  "name": "OnpremisesFileSystemOutput",
  "properties": {
    "type": "FileShare",
    "linkedServiceName": " OnPremisesFileServerLinkedService ",
    "typeProperties": {
      "folderPath": "mysharedfolder/yearno={Year}/monthno={Month}/dayno={Day}",
      "fileName": "{Hour}.csv",
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
    "external": true,
    "availability": {
      "frequency": "Hour",
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

**A copy activity in a pipeline with SQL source and File System sink:**

The pipeline contains a copy activity that is configured to use the input and output datasets, and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **SqlSource**, and the **sink** type is set to **FileSystemSink**. The SQL query that is specified for the **SqlReaderQuery** property selects the data in the past hour to copy.

```JSON
{
  "name":"SamplePipeline",
  "properties":{
    "start":"2015-06-01T18:00:00",
    "end":"2015-06-01T20:00:00",
    "description":"pipeline for copy activity",
    "activities":[
      {
        "name": "AzureSQLtoOnPremisesFile",
        "description": "copy activity",
        "type": "Copy",
        "inputs": [
          {
            "name": "AzureSQLInput"
          }
        ],
        "outputs": [
          {
            "name": "OnpremisesFileSystemOutput"
          }
        ],
        "typeProperties": {
          "source": {
            "type": "SqlSource",
            "SqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd}\\'', WindowStart, WindowEnd)"
          },
          "sink": {
            "type": "FileSystemSink"
          }
        },
       "scheduler": {
          "frequency": "Hour",
          "interval": 1
        },
        "policy": {
          "concurrency": 1,
          "executionPriorityOrder": "OldestFirst",
          "retry": 3,
          "timeout": "01:00:00"
        }
      }
    ]
  }
}
```

You can also map columns from source dataset to columns from sink dataset in the copy activity definition. For details, see [Mapping dataset columns in Azure Data Factory](data-factory-map-columns.md).

## Performance and tuning
 To learn about key factors that impact the performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it, see the [Copy Activity performance and tuning guide](data-factory-copy-activity-performance.md).
