<properties 
	pageTitle="Learn to copy/move Azure Blob Datasets | Azure Data Factory" 
	description="Learn how to copy blob data in Azure Data Factory. Use our sample: How to copy data to and from Azure Blob Storage and Azure SQL Database." 
    keywords="blob data, azure blob copy"
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
	ms.date="06/06/2016" 
	ms.author="spelluru"/>

# Move data to and from Azure Blob using Azure Data Factory
This article explains how to use the Copy Activity in Azure Data Factory to move data to and from Azure Blob by sourcing blob data from another data store. This article builds on the data movement activities article which presents a general overview of data movement with the copy activity and the supported data store combinations.

> [AZURE.NOTE] This Azure Blob connector currently only supports copying from/to block blobs. And it supports both general purpose Azure Storage and Hot/Cool Blob Storage.

## Copy data wizard
The easiest way to create a pipeline that copies data to/from Azure Blob Storage is to use the Copy data wizard. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough on creating a pipeline using the Copy data wizard. 

The following examples provide sample JSON definitions that you can use to create a pipeline by using [Azure Portal](data-factory-copy-activity-tutorial-using-azure-portal.md) or [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md). They show how to copy data to and from Azure Blob Storage and Azure SQL Database. However, data can be copied **directly** from any of sources to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores) using the Copy Activity in Azure Data Factory.

## Sample: Copy data from Azure Blob to Azure SQL
 

The sample below shows:

1.	A linked service of type [AzureSqlDatabase](data-factory-azure-sql-connector.md#azure-sql-linked-service-properties).
2.	A linked service of type [AzureStorage](#azure-storage-linked-service-properties).
3.	An input [dataset](data-factory-create-datasets.md) of type [AzureBlob](#azure-blob-dataset-type-properties).
4.	An output [dataset](data-factory-create-datasets.md) of type [AzureSqlTable](data-factory-azure-sql-connector.md#azure-sql-dataset-type-properties).
4.	A [pipeline](data-factory-create-pipelines.md) with a Copy activity that uses [BlobSource](#azure-blob-copy-activity-type-properties) and [SqlSink](data-factory-azure-sql-connector.md#azure-sql-copy-activity-type-properties).

The sample copies data belonging to a time series from an Azure blob to a table in an Azure SQL database every hour. The JSON properties used in these samples are described in sections following the samples. 

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

Azure Data Factory supports two types of Azure Storage linked services: **AzureStorage** and **AzureStorageSas**. For the first one, you specify the connection string that includes the account key and for the later one, you specify the Shared Access Signature (SAS) Uri.   See [Linked Services](#linked-services) section for details.  

**Azure Blob input dataset:**

Data is picked up from a new blob every hour (frequency: hour, interval: 1). The folder path and file name for the blob are dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, and day part of the start time and file name uses the hour part of the start time. “external”: “true” setting informs the Data Factory service that this table is external to the data factory and not produced by an activity in the data factory.

	{
	  "name": "AzureBlobInput",
	  "properties": {
	    "type": "AzureBlob",
	    "linkedServiceName": "StorageLinkedService",
	    "typeProperties": {
	      "folderPath": "mycontainer/myfolder/yearno={Year}/monthno={Month}/dayno={Day}/",
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
	      ],
	      "format": {
	        "type": "TextFormat",
	        "columnDelimiter": ",",
	        "rowDelimiter": "\n"
	      }
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

**Azure SQL output dataset:**

The sample copies data to a table named “MyTable” in an Azure SQL database. You should create the table in your Azure SQL database with the same number of columns as you expect the Blob CSV file to contain. New rows are added to the table every hour.

	{
	  "name": "AzureSqlOutput",
	  "properties": {
	    "type": "AzureSqlTable",
	    "linkedServiceName": "AzureSqlLinkedService",
	    "typeProperties": {
	      "tableName": "MyOutputTable"
	    },
	    "availability": {
	      "frequency": "Hour",
	      "interval": 1
	    }
	  }
	}

**Pipeline with a Copy activity:**

The pipeline contains a Copy Activity that is configured to use the above input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **BlobSource** and **sink** type is set to **SqlSink**. 

	{  
	    "name":"SamplePipeline",
	    "properties":{  
	    "start":"2014-06-01T18:00:00",
	    "end":"2014-06-01T19:00:00",
	    "description":"pipeline with copy activity",
	    "activities":[  
	      {
	        "name": "AzureBlobtoSQL",
	        "description": "Copy Activity",
	        "type": "Copy",
	        "inputs": [
	          {
	            "name": "AzureBlobInput"
	          }
	        ],
	        "outputs": [
	          {
	            "name": "AzureSqlOutput"
	          }
	        ],
	        "typeProperties": {
	          "source": {
	            "type": "BlobSource"
	          },
	          "sink": {
	            "type": "SqlSink"
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

## Sample: Copy data from Azure SQL to Azure Blob
The sample below shows:

1.	A linked service of type [AzureSqlDatabase](data-factory-azure-sql-connector.md#azure-sql-linked-service-properties).
2.	A linked service of type [AzureStorage](#azure-storage-linked-service-properties).
3.	An input [dataset](data-factory-create-datasets.md) of type [AzureSqlTable](data-factory-azure-sql-connector.md#azure-sql-dataset-type-properties).
4.	An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](#azure-blob-dataset-type-properties).
4.	A [pipeline](data-factory-create-pipelines.md) with Copy activity that uses [SqlSource](data-factory-azure-sql-connector.md#azure-sql-copy-activity-type-properties) and [BlobSink](#azure-blob-copy-activity-type-properties).


The sample copies data belonging to a time series from a table in Azure SQL database to a blob every hour. The JSON properties used in these samples are described in sections following the samples. 

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

Azure Data Factory supports two types of Azure Storage linked services: **AzureStorage** and **AzureStorageSas**. For the first one, you specify the connection string that includes the account key and for the later one, you specify the Shared Access Signature (SAS) Uri.   See [Linked Services](#linked-services) section for details.  


**Azure SQL input dataset:**

The sample assumes you have created a table “MyTable” in Azure SQL and it contains a column called “timestampcolumn” for time series data. 

Setting “external”: ”true” and specifying externalData policy informs the Azure Data Factory service that this is a table that is external to the data factory and not produced by an activity in the data factory.

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


**Azure Blob output dataset:**

Data is written to a new blob every hour (frequency: hour, interval: 1). The folder path for the blob is dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, day, and hours parts of the start time.

	
	{
	  "name": "AzureBlobOutput",
	  "properties": {
	    "type": "AzureBlob",
	    "linkedServiceName": "StorageLinkedService",
	    "typeProperties": {
	      "folderPath": "mycontainer/myfolder/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}/",
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

**Pipeline with the Copy activity:**

The pipeline contains a Copy Activity that is configured to use the above input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **SqlSource** and **sink** type is set to **BlobSink**. The SQL query specified for the **SqlReaderQuery** property selects the data in the past hour to copy.


	{  
	    "name":"SamplePipeline",
	    "properties":{  
	    	"start":"2014-06-01T18:00:00",
	    	"end":"2014-06-01T19:00:00",
	    	"description":"pipeline for copy activity",
	    	"activities":[  
	      		{
	        		"name": "AzureSQLtoBlob",
		    	    "description": "copy activity",
		    	    "type": "Copy",
		    	    "inputs": [
		    	      {
		    	        "name": "AzureSQLInput"
		    	      }
		    	    ],
		    	    "outputs": [
		    	      {
		    	        "name": "AzureBlobOutput"
		    	      }
		    	    ],
		    	    "typeProperties": {
		    	    	"source": {
		            		"type": "SqlSource",
			            	"SqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd HH:mm}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd HH:mm}\\'', WindowStart, WindowEnd)"
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

## Linked Services
There are two types of linked services you can use to link an Azure blob storage to an Azure data factory. They are: **AzureStorage** linked service and **AzureStorageSas** linked service. The Azure Storage linked service provides the data factory with global access to the Azure Storage. Whereas, The Azure Storage SAS (Shared Access Signature) linked service provides the data factory with restricted/time-bound access to the Azure Storage. There are no other differences between these two linked services. Choose the linked service that suits your needs. The following sections provide more details on these two linked services.

[AZURE.INCLUDE [data-factory-azure-storage-linked-services](../../includes/data-factory-azure-storage-linked-services.md)]

## Azure Blob Dataset type properties

For a full list of JSON sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc...).

The **typeProperties** section is different for each type of dataset and provides information about the location, format etc. of the data in the data store. The typeProperties section for dataset of type **AzureBlob** dataset has the following properties.

| Property | Description | Required |
| -------- | ----------- | -------- | 
| folderPath | Path to the container and folder in the blob storage. Example: myblobcontainer\myblobfolder\ | Yes |
| fileName | Name of the blob. fileName is optional and case-sensitive.<br/><br/>If you specify a filename, the activity (including Copy) works on the specific Blob.<br/><br/>When fileName is not specified Copy will include all Blobs in the folderPath for input dataset.<br/><br/>When fileName is not specified for an output dataset, the name of the generated file would be in the following this format: Data.<Guid>.txt (for example: : Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt | No |
| partitionedBy | partitionedBy is an optional property. You can use it to specify a dynamic folderPath and filename for time series data. For example, folderPath can be parameterized for every hour of data. See the [Leveraging partitionedBy property section](#Leveraging-partitionedBy-property) below for details and examples. | No
| format | The following format types are supported: **TextFormat**, **AvroFormat**,  **JsonFormat**, and **OrcFormat**. You need to set the **type** property under format to one of these values. See [Specifying TextFormat](#specifying-textformat), [Specifying AvroFormat](#specifying-avroformat), [Specifying JsonFormat](#specifying-jsonformat), and [Specifying OrcFormat](#specifying-orcformat) sections for details. If you want to copy files as-is between file-based stores (binary copy), you can skip the format section in both input and output dataset definitions.| No
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, and **BZip2** and supported levels are: **Optimal** and **Fastest**. Note that compression settings are not supported for data in **AvroFormat** or **OrcFormat** at this time. See [Compression support](#compression-support) section for more details.  | No |

### Leveraging partitionedBy property
As mentioned above, you can specify a dynamic folderPath and filename for time series data with the **partitionedBy** section, Data Factory macros and the system variables: SliceStart and SliceEnd, which indicate start and end times for a given data slice.

See [Data Factory System Variables](data-factory-scheduling-and-execution.md#data-factory-system-variables) and [Data Factory Functions Reference](data-factory-scheduling-and-execution.md#data-factory-functions-reference) to learn about Data Factory system variables and functions that you can use in the partitionedBy section.   

See [Creating Datasets](data-factory-create-datasets.md) and [Scheduling & Execution](data-factory-scheduling-and-execution.md) articles for more details on time series datasets, scheduling and slices.

#### Sample 1

	"folderPath": "wikidatagateway/wikisampledataout/{Slice}",
	"partitionedBy": 
	[
	    { "name": "Slice", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyyMMddHH" } },
	],

In the above example {Slice} is replaced with the value of Data Factory system variable SliceStart in the format (YYYYMMDDHH) specified. The SliceStart refers to start time of the slice. The folderPath is different for each slice. For example: wikidatagateway/wikisampledataout/2014100103 or wikidatagateway/wikisampledataout/2014100104

#### Sample 2

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


## Azure Blob Copy Activity type properties  
For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, various policies etc are available for all types of activities.

Properties available in the typeProperties section of the activity on the other hand vary with each activity type and in case of Copy activity they vary depending on the types of sources and sinks

**BlobSource** supports the following properties in the **typeProperties** section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- | 
| treatEmptyAsNull | Specifies whether to treat null or empty string as null value. <br/><br/>Note that when the **quoteChar** property is specified, a quoted empty string can also be treated as null with this property. | TRUE(default) <br/>FALSE | No |
| skipHeaderLineCount | Indicates how many lines need be skipped. It is applicable only when input dataset is using **TextFormat**. | Integer from 0 to Max. | No | 
| recursive | Indicates whether the data is read recursively from the sub folders or only from the specified folder. | True (default value), False | No | 


**BlobSink** supports the following properties **typeProperties** section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| blobWriterAddHeader | Specifies whether to add header of column definitions. | TRUE<br/>FALSE (default) | No |
| copyBehavior | Defines the copy behavior when the source is BlobSource or FileSystem. | **PreserveHierarchy:** preserves the file hierarchy in the target folder, i.e., the relative path of source file to source folder is identical to the relative path of target file to target folder.<br/><br/>**FlattenHierarchy:** all files from the source folder will be in the first level of target folder. The target files will have auto generated name. <br/><br/>**MergeFiles: (default)** merges all files from the source folder to one file. If the File/Blob Name is specified, the merged file name would be the specified name; otherwise, would be auto-generated file name. | No |

### recursive and copyBehavior examples
This section describes the resulting behavior of the Copy operation for different combinations of recursive and copyBehavior values. 

recursive | copyBehavior | Resulting behavior
--------- | ------------ | --------
true | preserveHierarchy | For a source folder Folder1 with the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target folder Folder1 will have the same structure as the source<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5.  
true | flattenHierarchy | For a source folder Folder1 with the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target Folder1 will have the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File5
true | mergeFiles | For a source folder Folder1 with the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target Folder1 will have the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1 + File2 + File3 + File4 + File 5 contents will be merged into one file with auto-generated file name
false | preserveHierarchy | For a source folder Folder1 with the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target folder Folder1 will have the following structure<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/><br/><br/>Subfolder1 with File3, File4, and File5 are not picked up..
false | flattenHierarchy | For a source folder Folder1 with the following structure:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target folder Folder1 will have the following structure<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File2<br/><br/><br/>Subfolder1 with File3, File4, and File5 are not picked up.
false | mergeFiles | For a source folder Folder1 with the following structure:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target folder Folder1 will have the following structure<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1 + File2 contents will be merged into one file with auto-generated file name. auto-generated name for File1<br/><br/>Subfolder1 with File3, File4, and File5 are not picked up.

  


[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

[AZURE.INCLUDE [data-factory-type-conversion-sample](../../includes/data-factory-type-conversion-sample.md)]

[AZURE.INCLUDE [data-factory-column-mapping](../../includes/data-factory-column-mapping.md)]

## Performance and Tuning  
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.

