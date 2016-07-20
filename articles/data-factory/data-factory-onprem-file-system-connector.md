<properties 
	pageTitle="Move data to and from File System | Azure Data Factory" 
	description="Learn how to move data to/from on-premises File System using Azure Data Factory." 
	services="data-factory" 
	documentationCenter="" 
	authors="spelluru" 
	manager="jhubbard" 
	editor="monicar"/>

<tags 
	ms.service="data-factory" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/13/2016" 
	ms.author="spelluru"/>

# Move data to and from On-premises file system using Azure Data Factory

This article outlines how you can use data factory copy activity to move data to and from on-premises file system.  See [Supported sources and sinks](data-factory-data-movement-activities.md#supported-data-stores) for a list of data stores that can be used as sources or sinks with the on-premises file system.  This article builds on the [data movement activities](data-factory-data-movement-activities.md) article which presents a general overview of data movement with copy activity and supported data store combinations.

Data factory supports connecting to and from on-premises File System via the Data Management Gateway. See [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article to learn about Data Management Gateway and step by step instructions on setting up the gateway. 

> [AZURE.NOTE] 
> Apart from the Data Management Gateway no other binaries need to be installed to communicate to and from on-premises File System.
> 
> See [Gateway Troubleshooting](data-factory-move-data-between-onprem-and-cloud.md#gateway-troubleshooting) for tips on troubleshooting connection/gateway related issues. 

## Linux file share 

Perform the following two steps to use a Linux file share with the File Server Linked Service:

- Install [Samba](https://www.samba.org/) on your Linux Server.
- Install and configure Data Management Gateway on a Windows server. Installing gateway on a Linux server is not supported. 
 
## Sample: Copy data from on-premises file system to Azure Blob

This sample shows how to copy data from an on-premises file system to an Azure Blob Storage. However, data can be copied **directly** to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores) using the Copy Activity in Azure Data Factory.  
 
The sample has the following data factory entities:

- A linked service of type [OnPremisesFileServer](data-factory-onprem-file-system-connector.md#onpremisesfileserver-linked-service-properties).
- A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service-properties)
- An input [dataset](data-factory-create-datasets.md) of type [FileShare](data-factory-onprem-file-system-connector.md#on-premises-file-system-dataset-type-properties).
- An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties).
- The [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [FileSystemSource](data-factory-onprem-file-system-connector.md#file-share-copy-activity-type-properties) and [BlobSink](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties). 

The sample below copies data belonging to a time series from on-premises file system to Azure blob every hour. The JSON properties used in these samples are described in sections following the samples. 

As a first step, do setup the data management gateway as per the instructions in the [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article. 

**On-premises File Server linked service:**

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

For host, you can specify **Local** or **localhost** if the file share is on the gateway machine itself. And, we recommend using the **encryptedCredential** property instead of using the **userid** and **password** properties.  See [File System Linked Service](#onpremisesfileserver-linked-service-properties) for details about this linked service. 

**Azure Blob storage linked service:**

	{
	  "name": "StorageLinkedService",
	  "properties": {
	    "type": "AzureStorage",
	    "typeProperties": {
	      "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
	    }
	  }
	}

**On-premises File System input dataset:**

Data is picked up from a new file every hour with the path & filename reflecting the specific datetime with hour granularity. 

Setting “external”: ”true” and specifying externalData policy informs the Azure Data Factory service that the table is external to the data factory and not produced by an activity in the data factory.

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
	            "format": "%M"
	          }
	        },
	        {
	          "name": "Day",
	          "value": {
	            "type": "DateTime",
	            "date": "SliceStart",
	            "format": "%d"
	          }
	        },
	        {
	          "name": "Hour",
	          "value": {
	            "type": "DateTime",
	            "date": "SliceStart",
	            "format": "%H"
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

**Azure Blob output dataset:**

Data is written to a new blob every hour (frequency: hour, interval: 1). The folder path for the blob is dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, day, and hours parts of the start time. 

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
	            "format": "%M"
	          }
	        },
	        {
	          "name": "Day",
	          "value": {
	            "type": "DateTime",
	            "date": "SliceStart",
	            "format": "%d"
	          }
	        },
	        {
	          "name": "Hour",
	          "value": {
	            "type": "DateTime",
	            "date": "SliceStart",
	            "format": "%HH"
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

The pipeline contains a Copy Activity that is configured to use the above input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **FileSystemSource** and **sink** type is set to **BlobSink**. 
	
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

##Sample: Copy data from Azure SQL to on-premises file system 

The sample below shows:

- A linked service of type AzureSqlDatabase.
- A linked service of type OnPremisesFileServer.
- An input dataset of type AzureSqlTable.
- An output dataset of type FileShare.
- A pipeline with Copy activity that uses SqlSource and FileSystemSink.

The sample copies data belonging to a time series from a table in Azure SQL database to a On-premises File System every hour. The JSON properties used in these samples are described in sections following the samples. 

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

**On-premises File Server linked service:**

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

For host, you can specify **Local** or **localhost** if the file share is on the gateway machine itself. And, we recommend using the **encryptedCredential** property instead of using the **userid** and **password** properties.  See [File System Linked Service](#onpremisesfileserver-linked-service-properties) for details about this linked service. 

**Azure SQL input dataset:**

The sample assumes you have created a table “MyTable” in Azure SQL and it contains a column called “timestampcolumn” for time series data. 

Setting “external”: ”true” and specifying externalData policy informs the Data Factory service that  the table is external to the data factory and is not produced by an activity in the data factory.

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

**On-premises File System output dataset:**

Data is copied to a new file every hour with the path for the blob reflecting the specific datetime with hour granularity.

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
	            "format": "%M"
	          }
	        },
	        {
	          "name": "Day",
	          "value": {
	            "type": "DateTime",
	            "date": "SliceStart",
	            "format": "%d"
	          }
	        },
	        {
	          "name": "Hour",
	          "value": {
	            "type": "DateTime",
	            "date": "SliceStart",
	            "format": "%HH"
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

**Pipeline with a Copy activity:**
The pipeline contains a Copy Activity that is configured to use the above input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **SqlSource** and **sink** type is set to **FileSystemSink**. The SQL query specified for the **SqlReaderQuery** property selects the data in the past hour to copy.

	
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

## OnPremisesFileServer linked service properties

You can link an On-premises File System to an Azure Data Factory with On-Premises File Server Linked Service. The following table provides description for JSON elements specific to On-Premises File Server Linked Service. 

Property | Description | Required
-------- | ----------- | --------
type | The type property should be set to **OnPremisesFileServer** | Yes 
host | Root path of the folder you want to copy. Use escape character ‘ \ ’ for special characters in the string. See [Sample linked service and dataset definitions](#sample-linked-service-and-dataset-definitions) for examples. | Yes
userid  | Specify the ID of the user who has access to the server | No (if you choose encryptedCredential)
password | Specify the password for the user (userid) | No (if you choose encryptedCredential 
encryptedCredential | Specify the encrypted credentials that you can get by running the New-AzureRmDataFactoryEncryptValue cmdlet<br/><br/>**Note:** You must use the Azure PowerShell of version 0.8.14 or higher to use cmdlets such as New-AzureRmDataFactoryEncryptValue with type parameter set to OnPremisesFileSystemLinkedService | No (if you choose to specify userid and password in plain text)
gatewayName | Name of the gateway that the Data Factory service should use to connect to the on-premises file server | Yes

See [Setting Credentials and Security](data-factory-move-data-between-onprem-and-cloud.md#set-credentials-and-security) for details about setting credentials for an on-premises File System data source.

### Sample linked service and dataset definitions 
Scenario | Host in linked service definition | folderPath in dataset definition
-------- | --------------------------------- | --------------------- |
Local folder on Data Management Gateway machine: <br/><br/>e.g. D:\\\* or D:\folder\subfolder\\* | D:\\\\ (for gateway version 2.0 and above) <br/><br/> localhost (for gateway version below 2.0) | .\\\\ or folder\\\\subfolder (for gateway version 2.0 and above) <br/><br/>D:\\\\ or D:\\\\folder\\\\subfolder (for gateway version below 2.0)
Remote shared folder: <br/><br/>e.g. \\\\myserver\\share\\\*  or \\\\myserver\\share\\folder\\subfolder\\* | \\\\\\\\myserver\\\\share | .\\\\ or folder\\\\subfolder

You can find the **version** of the gateway installed by launching [Data Management Gateway Configuration Manager](data-factory-data-management-gateway.md#data-management-gateway-configuration-manager) on your machine and switching to the **Help** tab. 

> [AZURE.NOTE] For local folder scenario, by specifying “host” property as “localhost”, your copy activity run will still work with any gateway version, but you cannot use Copy Wizard to set up the copy. You are suggested to [upgrade your gateway to version 2.0 or above](data-factory-data-management-gateway.md#update-data-management-gateway), then you can use above new configurations through both JSON and Copy Wizard to make your scenario work.

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
	      "host": "localhost",
	      "encryptedCredential": "WFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5xxxxxxxxxxxxxxxxx",
	      "gatewayName": "mygateway"
	    }
	  }
	}

## On-premises file system dataset type properties

For a full list of sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure Blob, Azure Table, On-premises File System, etc...). 

The typeProperties section is different for each type of dataset and provides information about the location, format etc. of the data in the data store. The typeProperties section for dataset of type **FileShare** dataset has the following properties.

Property | Description | Required
-------- | ----------- | --------
folderPath | Sub path to the folder. Use escape character ‘ \ ’ for special characters in the string. See [Sample linked service and dataset definitions](#sample-linked-service-and-dataset-definitions) for examples.<br/><br/>You can combine this with **partitionBy** to have folder paths based on slice start/end date-times. | Yes
fileName | Specify the name of the file in the **folderPath** if you want the table to refer to a specific file in the folder. If you do not specify any value for this property, the table points to all files in the folder.<br/><br/>When fileName is not specified for an output dataset, the name of the generated file would be in the following this format: <br/><br/>Data.<Guid>.txt (for example: : Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt | No
partitionedBy | partitionedBy can be leveraged to specify a dynamic folderPath, filename for time series data. For example folderPath parameterized for every hour of data. | No
Format | The following format types are supported: **TextFormat**, **AvroFormat**,  **JsonFormat**, and **OrcFormat**. You need to set the **type** property under format to one of these values. See [Specifying TextFormat](#specifying-textformat), [Specifying AvroFormat](#specifying-avroformat), [Specifying JsonFormat](#specifying-jsonformat), and [Specifying OrcFormat](#specifying-orcformat) sections for details. If you want to copy files as-is between file-based stores (binary copy), you can skip the format section in both input and output dataset definitions. | No
fileFilter | Specify a filter to be used to select a subset of files in the folderPath rather than all files. <br/><br/>Allowed values are: * (multiple characters) and ? (single character).<br/><br/>Examples 1: "fileFilter": "*.log"<br/>Example 2: "fileFilter": 2014-1-?.txt"<br/><br/>**Note**: fileFilter is applicable for an input FileShare dataset | No
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, and **BZip2** and supported levels are: **Optimal** and **Fastest**. Note that compression settings are not supported for data in **AvroFormat** or **OrcFormat** at this time. See [Compression support](#compression-support) section for more details.  | No |

> [AZURE.NOTE] filename and fileFilter cannot be used simultaneously.

### Leveraging partionedBy property

As mentioned above, you can specify a dynamic folderPath, filename for time series data with partitionedBy. You can do so with the Data Factory macros and the system variable SliceStart, SliceEnd that indicate the logical time period for a given data slice. 

See [Creating Datasets](data-factory-create-datasets.md), [Scheduling & Execution](data-factory-scheduling-and-execution.md), and [Creating Pipelines](data-factory-create-pipelines.md) articles to understand more details on time series datasets, scheduling and slices.

#### Sample 1:

	"folderPath": "wikidatagateway/wikisampledataout/{Slice}",
	"partitionedBy": 
	[
	    { "name": "Slice", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyyMMddHH" } },
	],

In the above example {Slice} is replaced with the value of Data Factory system variable SliceStart in the format (YYYYMMDDHH) specified. The SliceStart refers to start time of the slice. The folderPath is different for each slice. For example: wikidatagateway/wikisampledataout/2014100103 or wikidatagateway/wikisampledataout/2014100104.

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

In the above example, year, month, day, and time of SliceStart are extracted into separate variables that are used by folderPath and fileName properties.

[AZURE.INCLUDE [data-factory-file-format](../../includes/data-factory-file-format.md)]   
[AZURE.INCLUDE [data-factory-compression](../../includes/data-factory-compression.md)]

## File Share copy activity type properties

**FileSystemSource** supports the following properties:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| recursive | Indicates whether the data is read recursively from the sub folders or only from the specified folder. | True, False (default)| No | 

The **FileSystemSink** supports the following properties:  

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| copyBehavior | Defines the copy behavior when the source is BlobSource or FileSystem. | **PreserveHierarchy:** preserves the file hierarchy in the target folder, i.e., the relative path of source file to source folder is identical to the relative path of target file to target folder.<br/><br/>**FlattenHierarchy:** all files from the source folder will be in the first level of target folder. The target files will have auto generated name.<br/><br/>**MergeFiles:** merges all files from the source folder to one file. If the File/Blob Name is specified, the merged file name would be the specified name; otherwise, would be auto-generated file name.  | No |

### recursive and copyBehavior examples
This section describes the resulting behavior of the Copy operation for different combinations of recursive and copyBehavior values. 

recursive | copyBehavior | Resulting behavior
--------- | ------------ | --------
true | preserveHierarchy | For a source folder Folder1 with the following structure:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target folder Folder1 will have the same structure as the source<br/><br/>>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5.  
true | flattenHierarchy | For a source folder Folder1 with the following structure:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target Folder1 will have the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File5
true | mergeFiles | For a source folder Folder1 with the following structure:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target Folder1 will have the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1 + File2 + File3 + File4 + File 5 contents will be merged into one file with auto-generated file name<
false | preserveHierarchy | For a source folder Folder1 with the following structure:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target folder Folder1 will have the following structure<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/><br/>Subfolder1 with File3, File4, and File5 are not picked up..
false | flattenHierarchy | For a source folder Folder1 with the following structure:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target folder Folder1 will have the following structure<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File2<br/><br/>Subfolder1 with File3, File4, and File5 are not picked up.<
false | mergeFiles | For a source folder Folder1 with the following structure:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target folder Folder1 will have the following structure<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1 + File2 contents will be merged into one file with auto-generated file name. auto-generated name for File1<br/><br/>Subfolder1 with File3, File4, and File5 are not picked up.


[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

[AZURE.INCLUDE [data-factory-column-mapping](../../includes/data-factory-column-mapping.md)]

## Performance and Tuning  
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.






 
