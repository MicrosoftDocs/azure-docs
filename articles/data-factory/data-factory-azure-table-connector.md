<properties 
	pageTitle="Azure Table Connector - Move Data To and From Azure Table" 
	description="Learn about Azure Table Connector for the Data Factory service that lets you move data to/from Azure Table Storage" 
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
	ms.date="07/22/2015" 
	ms.author="spelluru"/>

# Azure Table Connector - Move Data To and From Azure Table

This article outlines how you can use data factory copy activity to move data to Azure Table from another data store and move data from another data store to Azure Table. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article which presents a general overview of data movement with copy activity and supported data store combinations.

## Sample: Copy data from Azure Table to Azure Blob

The sample below shows:

1.	The linked service of type AzureStorage (Used for both table & blob).
2.	The input and output datasets.
3.	The pipeline with Copy activity.

The sample copies data belonging to the default partition a table in Azure Table to a blob every hour. For more information on various properties used in the sample below please refer to documentation on different properties in the sections following the samples.

**Azure storage linked service:**

	{
	  "name": "StorageLinkedService",
	  "properties": {
	    "type": "AzureStorage",
	    "typeProperties": {
	      "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
	    }
	  }
	}

**Azure Table input dataset:**

The sample assumes you have created a table “MyTable” in Azure Table.
 
Setting “external”: ”true” and specifying externalData policy tells data factory that this is a table that is external to the data factory and not produced by an activity in the data factory.

	{
	  "name": "AzureTableInput",
	  "properties": {
	    "type": "AzureTable",
	    "linkedServiceName": "StorageLinkedService",
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

Data is copied to a new blob every hour with the path for the blob reflecting the specific datetime with hour granularity.

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

Copy activity specifies the input, output dataset and is scheduled for runs every hour. The SQL query specified with AzureTableSourceQuery property selects the data from the default partition every hour to copy.

	{  
	    "name":"SamplePipeline",
	    "properties":{  
	    "start":"2014-06-01T18:00:00",
	    "end":"2014-06-01T19:00:00",
	    "description":"pipeline for copy activity",
	    "activities":[  
	        "name": "AzureTabletoBlob",
	        "description": "copy activity",
	        "type": "Copy",
	        "inputs": [
	          {
	            "name": "AzureTableInput"
	          }
	        ],
	        "outputs": [
	          {
	            "name": "AzureBlobOutput"
	          }
	        ],
	        "typeProperties": {
	          "source": {
	            "type": "AzureTableSource",
	            "AzureTableSourceQuery": "PartitionKey eq 'DefaultPartitionKey'"
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
	        }     ]
	   }
	}

## Sample: Copy data from Azure Blob to Azure Table

The sample below shows:

1.	The linked service of type AzureSqlDatabase.
2.	The linked service of type AzureStorage.
3.	The input and output datasets.
4.	The pipeline with Copy activity.

The sample copies data belonging to a time series from Azure blob to a table in Azure Table database every hour. For more information on various properties used in the sample below please refer to documentation on different properties in the sections following the samples.

**Azure storage (for both Azure Table & Blob) linked service:**

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

Data is picked up from a new blob every hour with the path & filename for the blob reflecting the specific datetime with hour granularity. “external”: “true” tells data factory that this is a table that is external to the data factory and not produced by an activity in the data factory.
	
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

**Azure Table output dataset:**

The sample copies data to a table named “MyTable” in Azure Table. You should create the table in Azure Table with the same number of columns as you expect the Blob CSV file to contain. New rows are added to the table every hour. 

	{
	  "name": "AzureTableOutput",
	  "properties": {
	    "type": "AzureTable",
	    "linkedServiceName": "StorageLinkedService",
	    "typeProperties": {
	      "tableName": "MyOutputTable"
	    },
	    "availability": {
	      "frequency": "Hour",
	      "interval": 1
	    }
	  }
	}

**Pipeline with the Copy activity:**

Copy activity specifies the input, output dataset and is scheduled for runs every hour.

	{  
	    "name":"SamplePipeline",
	    "properties":{  
	    "start":"2014-06-01T18:00:00",
	    "end":"2014-06-01T19:00:00",
	    "description":"pipeline with copy activity",
	    "activities":[  
	      {
	        "name": "AzureBlobtoTable",
	        "description": "Copy Activity",
	        "type": "Copy",
	        "inputs": [
	          {
	            "name": "AzureBlobInput"
	          }
	        ],
	        "outputs": [
	          {
	            "name": "AzureTableOutput"
	          }
	        ],
	        "typeProperties": {
	          "source": {
	            "type": "BlobSource",
	            "blobColumnSeparators": ","
	          },
	          "sink": {
	            "type": "AzureTableSink",
	            "writeBatchSize": 100,
	            "writeBatchTimeout": "01:00:00"
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

You can link an Azure storage account to an Azure data factory with Azure Storage linked service. The following table provides description for JSON elements specific to Azure Storage linked service.

| Property | Description | Required |
| -------- | ----------- | -------- |
| type | The type property must be set to: AzureStorage | Yes |
| connectionString | Specify information needed to connect to Azure storage for the connectionString property. You can get the connectionString for the Azure storage from the Azure Portal. | Yes |

## Azure Table - Dataset Type Properties

For a full list of sections & properties available for defining datasets please refer to the [Creating datasets](data-factory-create-datasets.md) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc...).  

The typeProperties section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for the dataset of type AzureTable has the following properties.

| Property | Description | Required |
| -------- | ----------- | -------- |
| tableName | Name of the table in the Azure Table Database instance that linked service refers to. | Yes

## Azure Table - Copy Activity Type Properties

For a full list of sections & properties available for defining activities please refer to the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, various policies etc are available for all types of activities. 

Properties available in the typeProperties section of the activity on the other hand vary with each activity type and in case of Copy activity they vary depending on the types of sources and sinks.

**AzureTableSource** supports the following properties in typeProperties section:

| Property | Description | Allowed values | Required | 
| -------- | ----------- | -------------- | -------- | 
| azureTableSourceQuery | Use the custom query to read data. | Azure table query string.Sample: “ColumnA eq ValueA” | No |
| azureTableSourceIgnoreTableNotFound | Indicate whether swallow the exception of table not exist. | TRUE, FALSE | No |

**AzureTableSink** supports the following properties in typeProperties section:


| Property | Description | Allowed values | Required | 
| -------- | ----------- | -------------- | -------- |
| azureTableDefaultPartitionKeyValue | Default partition key value that can be used by the sink. | A string value. | No |
| azureTablePartitionKeyName | User specified column name, whose column values are used as partition key. If not specified, AzureTableDefaultPartitionKeyValue is used as the partition key. | A column name. | No |
| azureTableRowKeyName | User specified column name, whose column values are used as row key. If not specified, use a GUID for each row. | A column name. | No | 
| azureTableInsertType | The mode to insert data into Azure table. | “merge”, “replace” | No |
| writeBatchSize | Inserts data into the Azure table when the writeBatchSize or writeBatchTimeout is hit. | Integer from 1 to 100 (unit = Row Count) | No (Default = 100) |
| writeBatchTimeout | Inserts data into the Azure table when the writeBatchSize or writeBatchTimeout is hit | (Unit = timespan)Sample: “00:20:00” (20 minutes) | No (Default to storage client default timeout value 90 sec) |

[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

### Type Mapping for Azure Table

As mentioned in the [data movement activities](data-factory-data-movement-activities.md) article Copy activity performs automatic type conversions from automatic type conversions from source types to sink types with the following 2 step approach.

1. Convert from native source types to .NET type
2. Convert from .NET type to native sink type

When moving data to & from Azure Table the following [mappings defined by Azure Table service](https://msdn.microsoft.com/library/azure/dd179338.aspx) will be used from Azure Table OData types to .NET type and vice versa. 

| OData Data Type | .NET Type | Details |
| --------------- | --------- | ------- |
| Edm.Binary | byte[] | An array of bytes up to 64 KB in size. |
| Edm.Boolean | bool | A Boolean value. |
| Edm.DateTime | DateTime | A 64-bit value expressed as Coordinated Universal Time (UTC). The supported DateTime range begins from 12:00 midnight, January 1, 1601 A.D. (C.E.), UTC. The range ends at December 31, 9999. |
| Edm.Double | double | A 64-bit floating point value. |
| Edm.Guid | Guid | A 128-bit globally unique identifier. |
| Edm.Int32 | Int32 or int | A 32-bit integer. |
| Edm.Int64 | Int64 or long |  A 64-bit integer. |
| Edm.String | String | A UTF-16-encoded value. String values may be up to 64 KB in size. |


[AZURE.INCLUDE [data-factory-type-conversion-sample](../../includes/data-factory-type-conversion-sample.md)]


[AZURE.INCLUDE [data-factory-data-stores-with-rectangular-tables](../../includes/data-factory-data-stores-with-rectangular-tables.md)]









