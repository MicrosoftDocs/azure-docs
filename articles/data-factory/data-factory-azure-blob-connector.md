<properties 
	pageTitle="Move data to and from Azure Blob | Azure Data Factory" 
	description="Learn how to move data to/from Azure Blob Storage using Azure Data Factory" 
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
	ms.date="09/25/2015" 
	ms.author="spelluru"/>

# Move data to and from Azure Blob using Azure Data Factory
This article outlines how you can use the Copy Activity in an Azure data factory to move data to Azure Blob from another data store and move data from another data store to Azure Blob. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article which presents a general overview of data movement with the copy activity and the supported data store combinations.

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
	            "type": "BlobSource",
	            "blobColumnSeparators": ","
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

## Azure Storage Linked Service properties

You can link an Azure storage account to an Azure data factory using an Azure Storage linked service. The following table provides description for JSON elements specific to Azure Storage linked service.

| Property | Description | Required |
| -------- | ----------- | -------- |
| type | The type property must be set to: **AzureStorage** | Yes |
| connectionString | Specify information needed to connect to Azure storage for the connectionString property. You can get the connectionString for the Azure storage from the Azure Portal. | Yes |

## Azure Blob Dataset type properties

For a full list of JSON sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc...).

The **typeProperties** section is different for each type of dataset and provides information about the location, format etc. of the data in the data store. The typeProperties section for dataset of type **AzureBlob** dataset has the following properties.

| Property | Description | Required |
| -------- | ----------- | -------- | 
| folderPath | Path to the container and folder in the blob storage. Example: myblobcontainer\myblobfolder\ | Yes |
| fileName | <p>Name of the blob. fileName is optional. </p><p>If you specify a filename, the activity (including Copy) works on the specific Blob.</p><p>When fileName is not specified Copy will include all Blobs in the folderPath for input dataset.</p><p>When fileName is not specified for an output dataset, the name of the generated file would be in the following this format: Data.<Guid>.txt (for example: : Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt</p> | No |
| partitionedBy | partitionedBy is an optional property. You can use it to specify a dynamic folderPath and filename for time series data. For example, folderPath can be parameterized for every hour of data. See the [Leveraging partitionedBy property section](#Leveraging-partitionedBy-property) below for details and examples. | No
| format | Two formats types are supported: **TextFormat**, **AvroFormat**. You need to set the type property under format to either of these values. When the format is TextFormat you can specify additional optional properties for format. See the [Specifying TextFormat](#specifying-textformat) section below for more details. | No
| compression | Specify the type and level of compression for the data. Supported types are: GZip, Deflate, and BZip2 and supported levels are: Optimal and Fastest. See [Compression support](#compression-support) section for more details.  | No |

### Leveraging partitionedBy property
As mentioned above, you can specify a dynamic folderPath and filename for time series data with the **partitionedBy** section, Data Factory macros and the system variables: SliceStart and SliceEnd, which indicate start and end times for a given data slice.

See [Data Factory System Variables](data-factory-scheduling-and-execution.md#data-factory-system-variables) and [Data Factory Functions Reference](data-factory-scheduling-and-execution.md#data-factory-functions-reference) to learn about Data Factory system variables and functions that you can use in the partitionedBy section.   

See [Creating Datasets](data-factory-create-datasets.md) and [Scheduling & Execution](data-factory-scheduling-and-execution.md) articles to understand more details on time series datasets, scheduling and slices.

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

### Specifying TextFormat

If the format is set to **TextFormat**, you can specify the following **optional** properties in the **Format** section.

| Property | Description | Required |
| -------- | ----------- | -------- |
| columnDelimiter | The character(s) used as a column separator in a file.This tag is optional. The default value is comma (,). | No |
| rowDelimiter | The character(s) used as a raw separator in file. This tag is optional. The default value is any of the following: [“\r\n”, “\r”,” \n”]. | No |
| escapeChar | <p>The special character used to escape column delimiter shown in content. This tag is optional. No default value. You must specify no more than one character for this property.</p><p>For example, if you have comma (,) as the column delimiter but you want have comma character in the text (example: “Hello, world”), you can define ‘$’ as the escape character and use string “Hello$, world” in the source.</p><p>Note that you cannot specify both escapeChar and quoteChar for a table.</p> | No | 
| quoteChar | <p>The special character is used to quote the string value. The column and row delimiters inside of the quote characters would be treated as part of the string value. This tag is optional. No default value. You must specify no more than one character for this property.</p><p>For example, if you have comma (,) as the column delimiter but you want have comma character in the text (example: <Hello, world>), you can define ‘"’ as the quote character and use string <"Hello, world"> in the source. This property is applicable to both input and output tables.</p><p>Note that you cannot specify both escapeChar and quoteChar for a table.</p> | No |
| nullValue | <p>The character(s) used to represent null value in blob file content. This tag is optional. The default value is “\N”.</p><p>For example, based on above sample, “NaN” in blob will be translated as null value while copied into e.g. SQL Server.</p> | No |
| encodingName | Specify the encoding name. For the list of valid encoding names, see: [Encoding.EncodingName Property](https://msdn.microsoft.com/library/system.text.encoding.aspx). For example: windows-1250 or shift_jis. The default value is: UTF-8. | No | 

#### Samples
The following sample shows some of the format properties for TextFormat.

	"typeProperties":
	{
	    "folderPath": "mycontainer/myfolder",
	    "fileName": "myblobname"
	    "format":
	    {
	        "type": "TextFormat",
	        "columnDelimiter": ",",
	        "rowDelimiter": ";",
	        "quoteChar": "\"",
	        "NullValue": "NaN"
	    }
	},

To use an escapeChar instead of quoteChar, replace the line with quoteChar with the following:

	"escapeChar": "$",

### Specifying AvroFormat
If the format is set to AvroFormat, you do not need to specify any properties in the Format section within the typeProperties section. Example:

	"format":
	{
	    "type": "AvroFormat",
	}

To use Avro format in a Hive table, you can refer to [Apache Hive’s tutorial](https://cwiki.apache.org/confluence/display/Hive/AvroSerDe).

[AZURE.INCLUDE [data-factory-compression](../../includes/data-factory-compression.md)]


## Azure Blob Copy Activity type properties  
For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, various policies etc are available for all types of activities.

Properties available in the typeProperties section of the activity on the other hand vary with each activity type and in case of Copy activity they vary depending on the types of sources and sinks

**BlobSource** supports the following properties in the **typeProperties** section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- | 
| treatEmptyAsNull | Specifies whether to treat null or empty string as null value. | TRUE<br/>FALSE | No |
| skipHeaderLineCount | Indicates how many lines need be skipped. It is applicable only when input dataset is using **TextFormat**. | Integer from 0 to Max. | No | 
| recursive | Indicates whether the data is read recursively from the sub folders or only from the specified folder. | True (default value), False | No | 


**BlobSink** supports the following properties **typeProperties** section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| blobWriterAddHeader | Specifies whether to add header of column definitions. | TRUE<br/>FALSE (default) | No |
| copyBehavior | Defines the copy behavior when the source is BlobSource or FileSystem. | <p>There are three possible values for the copyBehavior property. </p><ul><li>**PreserveHierarchy:** preserves the file hierarchy in the target folder, i.e., the relative path of source file to source folder is identical to the relative path of target file to target folder.</li><li>**FlattenHierarchy:** all files from the source folder will be in the first level of target folder. The target files will have auto generated name. </li><li>**MergeFiles: (default)** merges all files from the source folder to one file. If the File/Blob Name is specified, the merged file name would be the specified name; otherwise, would be auto-generated file name.</li></ul> | No |

### recursive and copyBehavior examples
This section describes the resulting behavior of the Copy operation for different combinations of recursive and copyBehavior values. 

recursive | copyBehavior | Resulting behavior
--------- | ------------ | --------
true | preserveHierarchy | <p>For a source folder Folder1 with the following structure:</p> <p>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5</p>the target folder Folder1 will have the same structure as the source<p>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5</p>.  
true | flattenHierarchy | <p>For a source folder Folder1 with the following structure:</p> <p>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5</p>the target Folder1 will have the following structure: <p>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File5</p>
true | mergeFiles | <p>For a source folder Folder1 with the following structure:</p> <p>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5</p>the target Folder1 will have the following structure: <p>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1 + File2 + File3 + File4 + File 5 contents will be merged into one file with auto-generated file name</p>
false | preserveHierarchy | <p>For a source folder Folder1 with the following structure:</p> <p>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5</p>the target folder Folder1 will have the following structure<p>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/></p><p>Subfolder1 with File3, File4, and File5 are not picked up.</p>.
false | flattenHierarchy | <p>For a source folder Folder1 with the following structure:</p> <p>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5</p>the target folder Folder1 will have the following structure<p>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File2<br/></p><p>Subfolder1 with File3, File4, and File5 are not picked up.</p>.
false | mergeFiles | <p>For a source folder Folder1 with the following structure:</p> <p>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5</p>the target folder Folder1 will have the following structure<p>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1 + File2 contents will be merged into one file with auto-generated file name. auto-generated name for File1</p><p>Subfolder1 with File3, File4, and File5 are not picked up.</p>.

  


[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

[AZURE.INCLUDE [data-factory-type-conversion-sample](../../includes/data-factory-type-conversion-sample.md)]

[AZURE.INCLUDE [data-factory-column-mapping](../../includes/data-factory-column-mapping.md)]



## Send Feedback
We would really appreciate your feedback on this article. Please take a few minutes to submit your feedback via [email](mailto:adfdocfeedback@microsoft.com?subject=data-factory-azure-blob-connector.md).












