<properties 
	pageTitle="Move data to and from Azure Table | Azure Data Factory" 
	description="Learn how to move data to/from Azure Table Storage using Azure Data Factory." 
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
	ms.date="10/06/2015" 
	ms.author="spelluru"/>

# Move data to and from Azure Table using Azure Data Factory

This article outlines how you can use the Copy Activity in an Azure data factory to move data from another data store to Azure Table and move data from Azure Table to another data store. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article which presents a general overview of data movement with copy activity and supported data store combinations.

## Sample: Copy data from Azure Table to Azure Blob

The sample below shows:

1.	A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service-properties) (used for both table & blob).
2.	An input [dataset](data-factory-create-datasets.md) of type [AzureTable](#azure-table-dataset-type-properties).
3.	An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties). 
3.	The [pipeline](data-factory-create-pipelines.md) with Copy activity that uses [AzureTableSource](#azure-table-copy-activity-type-properties) and [BlobSink](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties). 

The sample copies data belonging to the default partition in an Azure Table to a blob every hour. The JSON properties used in these samples are described in sections following the samples.

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

Azure Data Factory supports two types of Azure Storage linked services: **AzureStorage** and **AzureStorageSas**. For the first one, you specify the connection string that includes the account key and for the later one, you specify the Shared Access Signature (SAS) Uri.   See [Linked Services](#linked-services) section for details.  

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

Data is written to a new blob every hour (frequency: hour, interval: 1). The folder path for the blob is dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, day, and hours parts of the start time. 

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

The pipeline contains a Copy Activity that is configured to use the above input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **AzureTableSource** and **sink** type is set to **BlobSink**. The SQL query specified with **AzureTableSourceQuery** property selects the data from the default partition every hour to copy.

	{  
	    "name":"SamplePipeline",
	    "properties":{  
	    	"start":"2014-06-01T18:00:00",
		    "end":"2014-06-01T19:00:00",
	    	"description":"pipeline for copy activity",
	    	"activities":[  
				{
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
		        	}
				}
		     ]	
		}
	}

## Sample: Copy data from Azure Blob to Azure Table

The sample below shows:

1.	A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service-properties) (used for both table & blob)
3.	An input [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties).
4.	An output [dataset](data-factory-create-datasets.md) of type [AzureTable](#azure-table-dataset-type-properties). 
4.	The [pipeline](data-factory-create-pipelines.md) with Copy activity that uses [BlobSource](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties) and [AzureTableSink](#azure-table-copy-activity-type-properties). 


The sample copies data belonging to a time series from Azure blob to a table in Azure Table database every hour. The JSON properties used in these samples are described in sections following the samples.

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

Azure Data Factory supports two types of Azure Storage linked services: **AzureStorage** and **AzureStorageSas**. For the first one, you specify the connection string that includes the account key and for the later one, you specify the Shared Access Signature (SAS) Uri.   See [Linked Services](#linked-services) section for details. 

**Azure Blob input dataset:**

Data is picked up from a new blob every hour (frequency: hour, interval: 1). The folder path and file name for the blob are dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, and day part of the start time and file name uses the hour part of the start time. “external”: “true” setting informs the Data Factory service that this table is external to the data factory and not produced by an activity in the data factory.
	
	{
	  "name": "AzureBlobInput",
	  "properties": {
	    "type": "AzureBlob",
	    "linkedServiceName": "StorageLinkedService",
	    "typeProperties": {
	      "folderPath": "mycontainer/myfolder/yearno={Year}/monthno={Month}/dayno={Day}",
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

The pipeline contains a Copy Activity that is configured to use the above input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **BlobSource** and **sink** type is set to **AzureTableSink**. 


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

## Linked Services
There are two types of linked services you can use to link an Azure blob storage to an Azure data factory. They are: **AzureStorage** linked service and **AzureStorageSas** linked service. The Azure Storage linked service provides the data factory with global access to the Azure Storage. Whereas, The Azure Storage SAS (Shared Access Signature) linked service provides the data factory with restricted/time-bound access to the Azure Storage. There are no other differences between these two linked services. Choose the linked service that suits your needs. The following sections provide more details on these two linked services.

## Azure Storage Linked Service properties

The **Azure Storage linked service** allows you to link an Azure storage account to an Azure data factory by using the **account key**. This provides the data factory with global access to the Azure Storage. The following table provides description for JSON elements specific to Azure Storage linked service.

| Property | Description | Required |
| :-------- | :----------- | :-------- |
| type | The type property must be set to: **AzureStorage** | Yes |
| connectionString | Specify information needed to connect to Azure storage for the connectionString property. | Yes |

See the following article for steps to view/copy the account key for an Azure Storage: [View, copy, and regenerate storage access keys](../storage/storage-create-storage-account.md#view-copy-and-regenerate-storage-access-keys).

**Example:**  
  
	{  
		"name": "StorageLinkedService",  
		"properties": {  
			"type": "AzureStorage",  
			"typeProperties": {  
				"connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"  
			}  
		}  
	}  


### Azure Storage SAS Linked Service  
A shared access signature (SAS) provides delegated access to resources in your storage account. This means that you can grant a client limited permissions to objects in your storage account for a specified period of time and with a specified set of permissions, without having to share your account access keys. The SAS is a URI that encompasses in its query parameters all of the information necessary for authenticated access to a storage resource. To access storage resources with the SAS, the client only needs to pass in the SAS to the appropriate constructor or method. For detailed information about SAS, see [Shared Access Signatures: Understanding the SAS Model](../storage/storage-dotnet-shared-access-signature-part-1/)
  
The Azure Storage SAS linked service allows you to link an Azure Storage Account to an Azure data factory by using a Shared Access Signature (SAS). This provides the data factory with restricted/time-bound access to all/specific resources (blob/container) in the storage. The following table provides description for JSON elements specific to Azure Storage SAS linked service.  

| Property | Description | Required | 
| :------- | :---------- | :------- |
| type | The type property must be set to: **AzureStorageSas** | Yes |
| sasUri | Shared Access Signature (SAS) URI to the Azure Storage resource (blob, container, or, table). See the notes below for details. | Yes |
  

**Example:**
  
	{  
		"name": "StorageSASLinkedService",  
		"properties": {  
			"type": "AzureStorageSas",  
			"typeProperties": {  
				"sasUri": "<storageUri>?<sasToken>"   
			}  
		}  
	}  

When creating an **SAS URI**, considering the following:  

- Azure Data Factory supports only **Service SAS**, not Account SAS. See [Types of Shared Access Signatures](../storage/storage-dotnet-shared-access-signature-part-1.md#types-of-shared-access-signatures) for details about these two types.
- Appropriate read/write **permissions** need to be set on objects based on how the linked service (read, write, read/write) will be used in your data factory.
- **Expiry time** needs to be set appropriately. Make sure that the access to Azure Storage objects does not expire within the active period of the pipeline.
- Uri should be created at the right container/blob or Table level based on the need. A SAS Uri to an Azure blob allows the Data Factory service to access that particular blob. A SAS Uri to an Azure blob container allows the Data Factory service to iterate through blobs in that container. If you need to provide access more/fewer objects later, or update the SAS URI, remember to update the linked service with the new URI.   


## Azure Table Dataset type properties

For a full list of sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc...).  

The typeProperties section is different for each type of dataset and provides information about the location of the data in the data store. The **typeProperties** section for the dataset of type **AzureTable** has the following properties.

| Property | Description | Required |
| -------- | ----------- | -------- |
| tableName | Name of the table in the Azure Table Database instance that linked service refers to. | Yes

## Azure Table Copy Activity type properties

For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, various policies etc are available for all types of activities. 

Properties available in the typeProperties section of the activity on the other hand vary with each activity type and in case of Copy activity they vary depending on the types of sources and sinks.

**AzureTableSource** supports the following properties in typeProperties section:

Property | Description | Allowed values | Required
-------- | ----------- | -------------- | -------- 
azureTableSourceQuery | Use the custom query to read data. | <p>Azure table query string.</p>**Examples:**<br/> "azureTableSourceQuery": "PartitionKey eq 'DefaultPartitionKey'" <br/><br/>"azureTableSourceQuery": "$$Text.Format('PartitionKey ge \\'{0:yyyyMMddHH00_0000}\\' and PartitionKey le \\'{0:yyyyMMddHH00_9999}\\')', SliceStart)" | No
azureTableSourceIgnoreTableNotFound | Indicate whether swallow the exception of table not exist. | TRUE<br/>FALSE | No |

**AzureTableSink** supports the following properties in typeProperties section:


Property | Description | Allowed values | Required  
-------- | ----------- | -------------- | -------- 
azureTableDefaultPartitionKeyValue | Default partition key value that can be used by the sink. | A string value. | No 
azureTablePartitionKeyName | User specified column name, whose column values are used as partition key. If not specified, AzureTableDefaultPartitionKeyValue is used as the partition key. | A column name. | No |
azureTableRowKeyName | User specified column name, whose column values are used as row key. If not specified, use a GUID for each row. | A column name. | No  
azureTableInsertType | The mode to insert data into Azure table. | merge<br/>replace | No 
writeBatchSize | Inserts data into the Azure table when the writeBatchSize or writeBatchTimeout is hit. | Integer from 1 to 100 (unit = Row Count) | No (Default = 100) 
writeBatchTimeout | Inserts data into the Azure table when the writeBatchSize or writeBatchTimeout is hit | (Unit = timespan)Sample: “00:20:00” (20 minutes) | No (Default to storage client default timeout value 90 sec)

### azureTablePartitionKeyName
You will need to map a source column to a destination column using the translator JSON property before you can use the destination column as the azureTablePartitionKeyName.

In the following example, source column DivisionID is mapped to the destination column: DivisionID.  

	"translator": {
		"type": "TabularTranslator",
		"columnMappings": "DivisionID: DivisionID, FirstName: FirstName, LastName: LastName"
	} 

The EmpID is specifies as the partition key. 

	"sink": {
		"type": "AzureTableSink",
		"azureTablePartitionKeyName": "DivisionID",
		"writeBatchSize": 100,
		"writeBatchTimeout": "01:00:00"
	}


[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

### Type Mapping for Azure Table

As mentioned in the [data movement activities](data-factory-data-movement-activities.md) article, Copy activity performs automatic type conversions from automatic type conversions from source types to sink types with the following 2 step approach.

1. Convert from native source types to .NET type
2. Convert from .NET type to native sink type

When moving data to & from Azure Table, the following [mappings defined by Azure Table service](https://msdn.microsoft.com/library/azure/dd179338.aspx) will be used from Azure Table OData types to .NET type and vice versa. 

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

### Type Conversion Sample

The following sample is for copying data from an Azure Blob to Azure Table with type conversions. 

Suppose the Blob dataset is in CSV format and contains 3 columns. One of them is a datetime column with a custom datetime format using abbreviated French names for day of the week. 

You will define the Blob Source dataset as follows along with type definitions for the columns.
	
	{
	    "name": " AzureBlobInput",
	    "properties":
	    {
	         "structure": 
	          [
	                { "name": "userid", "type": "Int64"},
	                { "name": "name", "type": "String"},
	                { "name": "lastlogindate", "type": "Datetime", "culture": "fr-fr", "format": "ddd-MM-YYYY"}
	          ],
	        "type": "AzureBlob",
	        "linkedServiceName": "StorageLinkedService",
	        "typeProperties": {
	            "folderPath": "mycontainer/myfolder",
	            "fileName":"myfile.csv",
	            "format":
	            {
	                "type": "TextFormat",
	                "columnDelimiter": ","
	            }
	        },
	        "external": true,
	        "availability":
	        {
	            "frequency": "Hour",
	            "interval": 1,
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

Given the type mapping from Azure Table OData type to .NET type above you would define the table in Azure Table with the following schema. 

**Azure Table schema:**

Column name | Type
----------- | --------
userid | Edm.Int64
name | Edm.String 
lastlogindate | Edm.DateTime

Next, you will define the Azure Table dataset as follows. You do not need to specify “structure” section with the type information since the type information is already specified in the underlying data store.

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

In this case data factory will automatically do the type conversions including the Datetime field with the custom datetime format using the fr-fr culture when moving data from Blob to Azure Table.



[AZURE.INCLUDE [data-factory-column-mapping](../../includes/data-factory-column-mapping.md)]









