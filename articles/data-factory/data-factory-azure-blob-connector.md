<properties 
	pageTitle="Azure Blob Connector - Move Data To and From Azure Blob" 
	description="Learn about Azure Blob Connector for the Data Factory service that lets you move data to/from Azure Blob Storage" 
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
	ms.date="07/24/2015" 
	ms.author="spelluru"/>

# Azure Blob Connector - Move Data To and From Azure Blob
This article outlines how you can use data factory Copy Activity to move data to Azure Blob from another data store and move data from another data store to Azure Blob. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article which presents a general overview of data movement with the copy activity and supported data store combinations.

## Sample: Copy data from Azure Blob to Azure SQL
The sample below shows:

1.	The linked service of type AzureSqlDatabase.
2.	The linked service of type AzureStorage.
3.	The input dataset of type AzureBlob.
4.	The output dataset of type AzureSqlTable.
4.	The pipeline with a Copy activity that uses BlobSource as source and SqlSink as sink.

The sample copies data belonging to a time series from an Azure blob to a table in an Azure SQL database every hour. For more information on various properties used in the sample below please refer to the sections that follow the Sample section in this article.

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

**Azure Blob input dataset:**

Data is picked up from a new blob every hour with the folder path & file name for the blob for the specific date-time with hour granularity. “external”: “true” setting informs the Data Factory service that this table is external to the data factory and not produced by an activity in the data factory.

	{
	  "name": "AzureBlobInput",
	  "properties": {
	    "type": "AzureBlob",
	    "linkedServiceName": "StorageLinkedService",
	    "typeProperties": {
	      "folderPath": "MyContainer/MyFolder/yearno={Year}/monthno={Month}/dayno={Day}",
	      "filename": "{Hour}.csv",
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

Copy activity specifies the input and output datasets and is scheduled to run every hour.

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

1.	The linked service of type AzureSqlDatabase.
2.	The linked service of type AzureStorage.
3.	The input dataset of type AzureSqlTable.
4.	and output dataset of type AzureBlob.
4.	The pipeline with Copy activity that uses SqlSource as source and BlobSink as sink.

The sample copies data belonging to a time series from a table in Azure SQL database to a blob every hour. For more information on various properties used in the sample below please refer to documentation on different properties in the sections following the samples.

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

**Azure SQL input dataset:**

The sample assumes you have created a table “MyTable” in Azure SQL and it contains a column called “timestampcolumn” for time series data. 

Setting “external”: ”true” and specifying externalData policy tells data factory that this is a table that is external to the data factory and not produced by an activity in the data factory.

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

Data is copied to a new blob every hour with the path for the blob reflecting the specific date-time with hour granularity.
	
	{
	  "name": "AzureBlobOutput",
	  "properties": {
	    "type": "AzureBlob",
	    "linkedServiceName": "StorageLinkedService",
	    "typeProperties": {
	      "folderPath": "MyContainer/MyFolder/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}",
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

**Pipeline with the Copy activity:**

Copy activity specifies the input and output datasets and is scheduled to run every hour. The SQL query specified with SqlReaderQuery property selects the data in the past hour to copy.

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
	            "SqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd}\\'', SliceStart, SliceEnd)"
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

## Azure Storage Linked Service Properties

You can link an Azure storage account to an Azure data factory using an Azure Storage linked service. The following table provides description for JSON elements specific to Azure Storage linked service.

| Property | Description | Required |
| -------- | ----------- | -------- |
| type | The type property must be set to: **AzureStorage** | Yes |
| connectionString | Specify information needed to connect to Azure storage for the connectionString property. You can get the connectionString for the Azure storage from the Azure Portal. | Yes |

## Azure Blob Dataset Type Properties

For a full list of sections & properties available for defining datasets, please refer to the [Creating datasets](data-factory-create-datasets.md) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc...).

The **typeProperties** section is different for each type of dataset and provides information about the location, format etc. of the data in the data store. The typeProperties section for dataset of type **AzureBlob** dataset has the following properties.

| Property | Description | Required |
| -------- | ----------- | -------- | 
| folderPath | Path to the container and folder in the blob storage. Example: myblobcontainer\myblobfolder\ | Yes |
| fileName | <p>Name of the blob. fileName is optional. </p><p>If you specify a filename the activity (including Copy) works on the specific Blob.</p><p>When fileName is not specified Copy will include all Blobs in the folderPath for input dataset.</p><p>When fileName is not specified for an output dataset, the name of the generated file would be in the following this format: Data.<Guid>.txt (for example: : Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt</p> | No |
| partitionedBy | partitionedBy is an optional property. You can use it to specify a dynamic folderPath and filename for time series data. For example, folderPath can be parameterized for every hour of data. Please refer to the [Leverage partitionedBy prperty](#leveraging-partionedby-property) section below for details and examples. | No
| format | Two formats types are supported: **TextFormat**, **AvroFormat**. You need to set the type property under format to either of these values. When the format is TextFormat you can specify additional optional properties for format. Please refer to the [Specifying TextFormat](#specifying-textformat) section below for more details. | No

## Leveraging partionedBy property
As mentioned above, you can specify a dynamic folderPath, filename for time series data with partitionedBy. You can do that with data factory macros and the system variable SliceStart, SliceEnd that indicate the logical time period for a given data slice.

Please refer to [Creating Datasets](data-factory-create-datasets.md) and [Scheduling & Execution](data-factory-scheduling-and-execution.md) articles to understand more details on time series datasets, scheduling and slices.

### Sample 1

	folderPath: "wikidatagateway/wikisampledataout/{Slice}",
	partitionedBy: 
	[
	    { name: "Slice", value: { type: "DateTime", date: "SliceStart", format: "yyyyMMddHH" } },
	],

In the above example {Slice} is replaced with the value of Data Factory system variable SliceStart in the format (YYYYMMDDHH) specified. The SliceStart refers to start time of the slice. The folderPath is different for each slice. For example: wikidatagateway/wikisampledataout/2014100103 or wikidatagateway/wikisampledataout/2014100104

### Sample 2

	folderPath: "wikidatagateway/wikisampledataout/{Year}/{Month}/{Day}",
	fileName: "{Hour}.csv",
	partitionedBy: 
	 [
	    { name: "Year", value: { type: "DateTime", date: "SliceStart", format: "yyyy" } },
	    { name: "Month", value: { type: "DateTime", date: "SliceStart", format: "MM" } }, 
	    { name: "Day", value: { type: "DateTime", date: "SliceStart", format: "dd" } }, 
	    { name: "Hour", value: { type: "DateTime", date: "SliceStart", format: "hh" } } 
	],

In the above example, year, month, day, and time of SliceStart are extracted into separate variables that are used by folderPath and fileName properties.

## Specifying TextFormat

If the format is set to **TextFormat**, you can specify the following **optional** properties in the **Format** section within the Location section.

| Property | Description | Required |
| -------- | ----------- | -------- |
| columnDelimiter | The character(s) used as a column separator in a file.This tag is optional. The default value is comma (,). | No |
| rowDelimiter | The character(s) used as a raw separator in file. This tag is optional. The default value is any of the following: [“\r\n”, “\r”,” \n”]. | No |
| escapeChar | <p>The special character used to escape column delimiter shown in content. This tag is optional. No default value. You must specify no more than one character for this property.</p><p>For example, if you have comma (,) as the column delimiter but you want have comma character in the text (example: “Hello, world”), you can define ‘$’ as the escape character and use string “Hello$, world” in the source.</p><p>Note that you cannot specify both escapeChar and quoteChar for a table.</p> | No | 
| quoteChar | <p>The special character is used to quote the string value. The column and row delimiters inside of the quote characters would be treated as part of the string value. This tag is optional. No default value. You must specify no more than one character for this property.</p><p>For example, if you have comma (,) as the column delimiter but you want have comma character in the text (example: <Hello, world>), you can define ‘"’ as the quote character and use string <"Hello, world"> in the source. This property is applicable to both input and output tables.</p><p>Note that you cannot specify both escapeChar and quoteChar for a table.</p> | No |
| nullValue | <p>The character(s) used to represent null value in blob file content. This tag is optional. The default value is “\N”.</p><p>For example, based on above sample, “NaN” in blob will be translated as null value while copied into e.g. SQL Server.</p> | No |
| encodingName | Specify the encoding name. For the list of valid encoding names, see: [Encoding.EncodingName Property](https://msdn.microsoft.com/library/system.text.encoding.aspx). For example: windows-1250 or shift_jis. The default value is: UTF-8. | No | 

### Samples
The following sample shows some of the format properties for TextFormat.

	"typeProperties":
	{
	    "folderPath": "MyContainer/MySubFolder",
	    "fileName": "MyBlobName"
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

## Specifying AvroFormat
If the format is set to AvroFormat, you do not need to specify any properties in the Format section within the Location section. Example:

	"format":
	{
	    "type": "AvroFormat",
	}

To use Avro format in a Hive table, you can refer to [Apache Hive’s tutorial](https://cwiki.apache.org/confluence/display/Hive/AvroSerDe).

## Copy Activity Type Properties for Azure Blob 
For a full list of sections & properties available for defining activities please refer to the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, various policies etc are available for all types of activities.

Properties available in the typeProperties section of the activity on the other hand vary with each activity type and in case of Copy activity they vary depending on the types of sources and sinks

**BlobSource** supports the following properties in **typeProperties** section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- | 
| treatEmptyAsNull | Specifies whether to treat null or empty string as null value. | TRUE, FALSE | No |
| skipHeaderLineCount | Indicate how many lines need be skipped. It is applicable only when input dataset is using **TextFormat**. | Integer from 0 to Max. | No | 


**BlobSink** supports the following properties **typeProperties** section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| blobWriterAddHeader | Specifies whether to add header of column definitions. | TRUE, FALSE (default) | No |

[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

[AZURE.INCLUDE [data-factory-data-stores-with-rectangular-tables](../../includes/data-factory-data-stores-with-rectangular-tables.md)]















