<properties
	pageTitle="Move data to and from a file system | Microsoft Azure"
	description="Learn how to move data to and from an on-premises file system by using Azure Data Factory."
	services="data-factory"
	documentationCenter=""
	authors="linda33wj"
	manager="jhubbard"
	editor="monicar"/>

<tags
	ms.service="data-factory"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/01/2016"
	ms.author="jingwang"/>

# Move data to and from an on-premises file system by using Azure Data Factory

This article outlines how you can use Azure Data Factory Copy Activity to move data to and from an on-premises file system. See [Supported sources and sinks](data-factory-data-movement-activities.md#supported-data-stores) for a list of data stores that can be used as sources or sinks with the on-premises file system. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article, which presents a general overview of data movement with Copy Activity and supported data store combinations.

Data Factory supports connecting to and from an on-premises file system via Data Management Gateway. To learn about Data Management Gateway and for step-by-step instructions on setting up the gateway, see [Move data between on-premises sources and the cloud with Data Management Gateway](data-factory-move-data-between-onprem-and-cloud.md).

> [AZURE.NOTE]
> Apart from Data Management Gateway, no other binary files need to be installed to communicate to and from an on-premises file system.
>
> See [Troubleshoot gateway issues](data-factory-data-management-gateway.md#troubleshoot-gateway-issues) for tips on troubleshooting connection/gateway-related issues.

## Linux file share

Perform the following two steps to use a Linux file share with the File Server linked service:

- Install [Samba](https://www.samba.org/) on your Linux server.
- Install and configure Data Management Gateway on a Windows server. Installing Data Management Gateway on a Linux server is not supported.

## Copy Wizard
The easiest way to create a pipeline that copies data to and from an on-premises file system is to use the Copy Wizard. For a quick walkthrough, see [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md).

The following examples provide sample JSON definitions that you can use to create a pipeline by using the [Azure portal](data-factory-copy-activity-tutorial-using-azure-portal.md), [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md), or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md). They show how to copy data to and from an on-premises file system and Azure Blob storage. However, you can copy data *directly* from any of the sources to any of the sinks listed in [Supported sources and sinks](data-factory-data-movement-activities.md#supported-data-stores) by using Copy Activity in Azure Data Factory.


## Sample: Copy data from an on-premises file system to Azure Blob storage

This sample shows how to copy data from an on-premises file system to Azure Blob storage.

The sample has the following Data Factory entities:

- A linked service of type [OnPremisesFileServer](data-factory-onprem-file-system-connector.md#onpremisesfileserver-linked-service-properties).
- A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service-properties).
- An input [dataset](data-factory-create-datasets.md) of type [FileShare](data-factory-onprem-file-system-connector.md#on-premises-file-system-dataset-type-properties).
- An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties).
- The [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [FileSystemSource](data-factory-onprem-file-system-connector.md#file-share-copy-activity-type-properties) and [BlobSink](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties).

The following sample copies time-series data from an on-premises file system to Azure Blob storage every hour. The JSON properties that are used in these samples are described in the sections after the samples.

As a first step, set up Data Management Gateway as per the instructions in [Move data between on-premises sources and the cloud with Data Management Gateway](data-factory-move-data-between-onprem-and-cloud.md).

**On-Premises File Server linked service:**

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

We recommend using the **encryptedCredential** property instead the **userid** and **password** properties. See [File Server linked service](#onpremisesfileserver-linked-service-properties) for details about this linked service.

**Azure Storage linked service:**

	{
	  "name": "StorageLinkedService",
	  "properties": {
	    "type": "AzureStorage",
	    "typeProperties": {
	      "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
	    }
	  }
	}

**On-premises file system input dataset:**

Data is picked up from a new file every hour. The folderPath and fileName properties are determined based on the start time of the slice.  

Setting `"external": "true"` informs Data Factory that the dataset is external to the data factory and is not produced by an activity in the data factory.

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

**Azure Blob storage output dataset:**

Data is written to a new blob every hour (frequency: hour, interval: 1). The folder path for the blob is dynamically evaluated based on the start time of the slice that is being processed. The folder path uses the year, month, day, and hour parts of the start time.

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

**Copy activity:**

The pipeline contains a copy activity that is configured to use the input and output datasets, and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **FileSystemSource**, and **sink** type is set to **BlobSink**.

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

## Sample: Copy data from Azure SQL Database to an on-premises file system

The following sample shows:

- A linked service of type AzureSqlDatabase.
- A linked service of type OnPremisesFileServer.
- An input dataset of type AzureSqlTable.
- An output dataset of type FileShare.
- A pipeline with a copy activity that uses SqlSource and FileSystemSink.

The sample copies time-series data from an Azure SQL table to an on-premises file system every hour. The JSON properties that are used in these samples are described in sections after the samples.

**Azure SQL linked service:**

	{
	  "name": "AzureSqlLinkedService",
	  "properties": {
	    "type": "AzureSqlDatabase",
	    "typeProperties": {
	      "connectionString": "Server=tcp:<servername>.database.windows.net,1433;Database=<databasename>;User ID=<username>@<servername>;Password=<password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
	    }
	  }
	}

**On-Premises File Server linked service:**

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

We recommend using the **encryptedCredential** property instead of using the **userid** and **password** properties. See [File System linked service](#onpremisesfileserver-linked-service-properties) for details about this linked service.

**Azure SQL input dataset:**

The sample assumes that you've created a table “MyTable” in Azure SQL, and it contains a column called “timestampcolumn” for time-series data.

Setting ``“external”: ”true”`` informs Data Factory that the dataset is external to the data factory and is not produced by an activity in the data factory.

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

**On-premises file system output dataset:**

Data is copied to a new file every hour. The folderPath and fileName for the blob are determined based on the start time of the slice.

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

**Pipeline with a copy activity:**

The pipeline contains a copy activity that is configured to use the input and output datasets, and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **SqlSource**, and the **sink** type is set to **FileSystemSink**. The SQL query that is specified for the **SqlReaderQuery** property selects the data in the past hour to copy.


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

## On-Premises File Server linked service properties

You can link an on-premises file system to an Azure data factory with the On-Premises File Server linked service. The following table provides descriptions for JSON elements that are specific to the On-Premises File Server linked service.

Property | Description | Required
-------- | ----------- | --------
type | Ensure that the type property is set to **OnPremisesFileServer**. | Yes
host | Specifies the root path of the folder that you want to copy. Use the escape character ‘ \ ’ for special characters in the string. See [Sample linked service and dataset definitions](#sample-linked-service-and-dataset-definitions) for examples. | Yes
userid | Specify the ID of the user who has access to the server. | No (if you choose encryptedCredential)
password | Specify the password for the user (userid). | No (if you choose encryptedCredential
encryptedCredential | Specify the encrypted credentials that you can get by running the New-AzureRmDataFactoryEncryptValue cmdlet. | No (if you choose to specify userid and password in plain text)
gatewayName | Specifies the name of the gateway that Data Factory should use to connect to the on-premises file server. | Yes

See [Setting Credentials and Security](data-factory-move-data-between-onprem-and-cloud.md#set-credentials-and-security) for details about setting credentials for an on-premises File System data source.

### Sample linked service and dataset definitions
Scenario | Host in linked service definition | folderPath in dataset definition
-------- | --------------------------------- | --------------------- |
Local folder on Data Management Gateway machine: <br/><br/>Examples: D:\\\* or D:\folder\subfolder\\* | D:\\\\ (for Data Management Gateway 2.0 and later versions) <br/><br/> localhost (for earlier versions than Data Management Gateway 2.0) | .\\\\ or folder\\\\subfolder (for Data Management Gateway 2.0 and later versions) <br/><br/>D:\\\\ or D:\\\\folder\\\\subfolder (for gateway version below 2.0)
Remote shared folder: <br/><br/>Examples: \\\\myserver\\share\\\* or \\\\myserver\\share\\folder\\subfolder\\* | \\\\\\\\myserver\\\\share | .\\\\ or folder\\\\subfolder


**To find the version of a gateway:**

1. Launch [Data Management Gateway Configuration Manager](data-factory-data-management-gateway.md#data-management-gateway-configuration-manager) on your machine.
2. Switch to the **Help** tab.

> [AZURE.NOTE] We recommend that you [upgrade your gateway to Data Management Gateway 2.0 or later](data-factory-data-management-gateway.md#update-data-management-gateway) to take advantage of the latest features and fixes.

**Example: Using username and password in plain text**

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

**Example: Using encryptedcredential**

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

## On-premises file system dataset type properties

For a full list of sections and properties that are available for defining datasets, see [Creating datasets](data-factory-create-datasets.md). Sections such as structure, availability, and policy of a dataset JSON are similar for all dataset types.

The typeProperties section is different for each type of dataset. It provides information such as the location and format of the data in the data store. The typeProperties section for the dataset of type **FileShare** has the following properties:

Property | Description | Required
-------- | ----------- | --------
folderPath | Specifies the subpath to the folder. Use the escape character ‘\’ for special characters in the string. See [Sample linked service and dataset definitions](#sample-linked-service-and-dataset-definitions) for examples.<br/><br/>You can combine this property with **partitionBy** to have folder paths based on slice start/end date-times. | Yes
fileName | Specify the name of the file in the **folderPath** if you want the table to refer to a specific file in the folder. If you do not specify any value for this property, the table points to all files in the folder.<br/><br/>When fileName is not specified for an output dataset, the name of the generated file is in the following format: <br/><br/>`Data.<Guid>.txt` (Example: Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt) | No
partitionedBy | You can use partitionedBy to specify a dynamic folderPath/fileName for time-series data. An example is folderPath parameterized for every hour of data. | No
Format | The following format types are supported: **TextFormat**, **AvroFormat**, **JsonFormat**, **OrcFormat**, and **ParquetFormat**. Set the **type** property under Format to one of these values. See [Specifying TextFormat](#specifying-textformat), [Specifying AvroFormat](#specifying-avroformat), [Specifying JsonFormat](#specifying-jsonformat), [Specifying OrcFormat](#specifying-orcformat), and [Specifying ParquetFormat](#specifying-parquetformat) for details. If you want to copy files as-is between file-based stores (binary copy), you can skip the format section in both input and output dataset definitions. | No
fileFilter | Specify a filter to be used to select a subset of files in the folderPath rather than all files. <br/><br/>Allowed values are: `*` (multiple characters) and `?` (single character).<br/><br/>Example 1: "fileFilter": "*.log"<br/>Example 2: "fileFilter": 2014-1-?.txt"<br/><br/>Note that fileFilter is applicable for an input FileShare dataset. | No
| compression | Specify the type and level of compression for the data. Supported types are **GZip**, **Deflate**, and **BZip2**. Supported levels are **Optimal** and **Fastest**. Currently, compression settings are not supported for data in **AvroFormat** or **OrcFormat**. For more information, see the [Compression support](#compression-support) section. | No |


> [AZURE.NOTE] You cannot use fileName and fileFilter simultaneously.

### Using partitionedBy property

As mentioned in the previous section, you can specify a dynamic folderPath and fileName for time-series data with partitionedBy. You can do so with the Data Factory macros and the system variables SliceStart and SliceEnd, which indicate the logical time period for a given data slice.

To understand more details on time-series datasets, scheduling, and slices, see [Creating datasets](data-factory-create-datasets.md), [Scheduling and execution](data-factory-scheduling-and-execution.md), and [Creating pipelines](data-factory-create-pipelines.md).

#### Sample 1:

	"folderPath": "wikidatagateway/wikisampledataout/{Slice}",
	"partitionedBy":
	[
	    { "name": "Slice", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyyMMddHH" } },
	],

In this example, {Slice} is replaced with the value of the Data Factory system variable SliceStart in the format (YYYYMMDDHH). SliceStart refers to start time of the slice. The folderPath is different for each slice. For example: wikidatagateway/wikisampledataout/2014100103 or wikidatagateway/wikisampledataout/2014100104.

#### Sample 2:

	"folderPath": "wikidatagateway/wikisampledataout/{Year}/{Month}/{Day}",
	"fileName": "{Hour}.csv",
	"partitionedBy":
	 [
	    { "name": "Year", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyy" } },
	    { "name": "Month", "value": { "type": "DateTime", "date": "SliceStart", "format": "MM" } },
	    { "name": "Day", "value": { "type": "DateTime", "date": "SliceStart", "format": "dd" } },
	    { "name": "Hour", "value": { "type": "DateTime", "date": "SliceStart", "format": "hh" } }
	],

In this example, year, month, day, and time of SliceStart are extracted into separate variables that the folderPath and fileName properties use.

[AZURE.INCLUDE [data-factory-file-format](../../includes/data-factory-file-format.md)]   
[AZURE.INCLUDE [data-factory-compression](../../includes/data-factory-compression.md)]

## File share Copy Activity type properties

**FileSystemSource** supports the following properties:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| recursive | Indicates whether the data is read recursively from the subfolders or only from the specified folder. | True, False (default)| No |

**FileSystemSink** supports the following properties:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| copyBehavior | Defines the copy behavior when the source is BlobSource or FileSystem. | **PreserveHierarchy:** Preserves the file hierarchy in the target folder. That is, the relative path of the source file to the source folder is the same as the relative path of the target file to the target folder.<br/><br/>**FlattenHierarchy:** All files from the source folder are created in the first level of target folder. The target files are created with an autogenerated name.<br/><br/>**MergeFiles:** Merges all files from the source folder to one file. If the file name/blob name is specified, the merged file name is the specified name. Otherwise, it is an auto-generated file name. | No |

### recursive and copyBehavior examples
This section describes the resulting behavior of the Copy operation for different combinations of values for the recursive and copyBehavior properties.

recursive value | copyBehavior value | Resulting behavior
--------- | ------------ | --------
true | preserveHierarchy | For a source folder Folder1 with the following structure,<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target folder Folder1 is created with the same structure as the source:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5  
true | flattenHierarchy | For a source folder Folder1 with the following structure,<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target Folder1 is created with the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File5
true | mergeFiles | For a source folder Folder1 with the following structure,<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target Folder1 is created with the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1 + File2 + File3 + File4 + File 5 contents are merged into one file with an auto-generated file name.
false | preserveHierarchy | For a source folder Folder1 with the following structure,<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target folder Folder1 is created with the following structure:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/><br/>Subfolder1 with File3, File4, and File5 is not picked up.
false | flattenHierarchy | For a source folder Folder1 with the following structure,<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target folder Folder1 is created with the following structure:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File2<br/><br/>Subfolder1 with File3, File4, and File5 is not picked up.
false | mergeFiles | For a source folder Folder1 with the following structure,<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target folder Folder1 is created with the following structure:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1 + File2 contents are merged into one file with an auto-generated file name.<br/>&nbsp;&nbsp;&nbsp;&nbsp;Auto-generated name for File1<br/><br/>Subfolder1 with File3, File4, and File5 is not picked up.


[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

[AZURE.INCLUDE [data-factory-column-mapping](../../includes/data-factory-column-mapping.md)]

## Performance and tuning
 To learn about key factors that impact the performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it, see the [Copy Activity performance and tuning guide](data-factory-copy-activity-performance.md).
