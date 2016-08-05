<properties 
	pageTitle="Move data from MongoDB using Data Factory | Microsoft Azure" 
	description="Learn about how to move data from MongoDB database using Azure Data Factory." 
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
	ms.date="08/04/2016" 
	ms.author="spelluru"/>

# Move data From MongoDB using Azure Data Factory

This article outlines how you can use the Copy Activity in an Azure data factory to move data from an on-premises MongoDB database to another data store. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article which presents a general overview of data movement with copy activity and the source/sink data store combinations that the copy activity supports.

Data Factory service supports connecting to on-premises MongoDB sources using the Data Management Gateway. See [Data Management Gateway](data-factory-data-management-gateway.md) article to learn about Data Management Gateway and [Move data from on-premises to cloud](data-factory-move-data-between-onprem-and-cloud.md) article for step-by-step instructions on setting up the gateway a data pipeline to move data. 

**Note:** You need to leverage the gateway to connect to MongoDB even if it is hosted in Azure IaaS VMs. If you are trying to connect to an instance of MongoDB hosted in cloud, you can also install the gateway instance in the IaaS VM.

Data Factory currently supports only moving data from MongoDB to other data stores, but not for moving data from other data stores to MongoDB.

## Prerequisites
For the Azure Data Factory service to be able to connect to your on-premises MongoDB database , you must install the following: 

- Data Management Gateway 2.0 or above on the same machine that hosts the database or on a separate machine to avoid competing for resources with the database. Data Management Gateway is a software that connects on-premises data sources to cloud services in a secure and managed way. See [Data Management Gateway](data-factory-data-management-gateway.md) article for details about Data Management Gateway.
  
	When you install the gateway, it automatically installs a Microsoft MongoDB ODBC driver used to connect to MongoDB. 

## Copy Data wizard
The easiest way to create a pipeline that copies data from a MongoDB database to any of the supported sink data stores is to use the Copy data wizard. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough on creating a pipeline using the Copy data wizard. 

The following example provides sample JSON definitions that you can use to create a pipeline by using [Azure Portal](data-factory-copy-activity-tutorial-using-azure-portal.md) or [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md).

## Sample: Copy data from MongoDB to Azure Blob
This sample shows how to copy data from an on-premises MongoDB database to an Azure Blob Storage. However, data can be copied **directly** to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores) using the Copy Activity in Azure Data Factory.  
 
The sample has the following data factory entities:

1.	A linked service of type [OnPremisesMongoDb](#linked-service-properties).
2.	A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service-properties).
3.	An input [dataset](data-factory-create-datasets.md) of type [MongoDbCollection](#dataset-type-properties).
4.	An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties).
4.	A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [MongoDbSource](#copy-activity-type-properties) and [BlobSink](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties).

The sample copies data from a query result in MongoDB database to a blob every hour. The JSON properties used in these samples are described in sections following the samples. 

As a first step, please setup the data management gateway as per the instructions in the [Data Management Gateway](data-factory-data-management-gateway.md) article. 

**MongoDB linked service**

	{ 
	    "name": "OnPremisesMongoDbLinkedService", 
	    "properties": 
	    { 
	        "type": "OnPremisesMongoDb", 
	        "typeProperties": 
	        { 
	            "authenticationType": "<Basic or Anonymous>", 
	            "server": "< The IP address or host name of the MongoDB server >",  
				"port": "<The number of the TCP port that the MongoDB server uses to listen for client connections.>", 
	            "username": "<username>", 
	            "password": "<password>",
	           "authSource": "< The database that you want to use to check your credentials for authentication. >",
	            "databaseName": "<database name>",
	            "gatewayName": "<mygateway>"
	        } 
		}
	} 


**Azure Storage linked service**

	{
	  "name": "AzureStorageLinkedService",
	  "properties": {
	    "type": "AzureStorage",
	    "typeProperties": {
	      "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
	    }
	  }
	}

**MongoDB input dataset**
Setting “external”: ”true” informs the Data Factory service that the table is external to the data factory and is not produced by an activity in the data factory.
	
	{
	     "name":  "MongoDbInputDataset",
	    "properties": { 
	        "type": "MongoDbCollection ", 
	        "linkedServiceName": "OnPremisesMongoDbLinkedService", 
	        "typeProperties": { 
	            "collectionName": "<Collection name>"	
	        }, 
	        "availability": {
	            "frequency": "Hour",
	            "interval": 1
	        },
			"external": true
	    } 
	}



**Azure Blob output dataset**

Data is written to a new blob every hour (frequency: hour, interval: 1). The folder path for the blob is dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, day, and hours parts of the start time.

	{
	    "name": "AzureBlobOutputDataSet",
	    "properties": {
	        "type": "AzureBlob",
	        "linkedServiceName": "AzureStorageLinkedService",
	        "typeProperties": {
	            "folderPath": "mycontainer/frommongodb/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}",
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
	        "availability": {
	            "frequency": "Hour",
	            "interval": 1
	        }
	    }
	}



**Pipeline with Copy activity**

The pipeline contains a Copy Activity that is configured to use the above input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **MongoDbSource** and **sink** type is set to **BlobSink**. The SQL query specified for the **query** property selects the data in the past hour to copy.
	
	{
	    "name": "CopyMongoDBToBlob",
	    "properties": {
	        "description": "pipeline for copy activity",
	        "activities": [
	            {
	                "type": "Copy",
	                "typeProperties": {
	                    "source": {
	                        "type": "MongoDbSource",
	                        "query": "$$Text.Format('select * from  MyTable where LastModifiedDate >= {{ts\'{0:yyyy-MM-dd HH:mm:ss}\'}} AND LastModifiedDate < {{ts\'{1:yyyy-MM-dd HH:mm:ss}\'}}', WindowStart, WindowEnd)"
	                    },
	                    "sink": {
	                        "type": "BlobSink",
	                        "writeBatchSize": 0,
	                        "writeBatchTimeout": "00:00:00"
	                    }
	                },
	                "inputs": [
	                    {
	                        "name": "MongoDbInputDataset"
	                    }
	                ],
	                "outputs": [
	                    {
	                        "name": "AzureBlobOutputDataSet"
	                    }
	                ],
	                "policy": {
	                    "timeout": "01:00:00",
	                    "concurrency": 1
	                },
	                "scheduler": {
	                    "frequency": "Hour",
	                    "interval": 1
	                },
	                "name": "MongoDBToAzureBlob"
	            }
	        ],
	        "start": "2016-06-01T18:00:00Z",
	        "end": "2016-06-01T19:00:00Z"
	    }
	}


## Linked service properties

The following table provides description for JSON elements specific to **OnPremisesMongoDB** linked service.

| Property | Description | Required |
| -------- | ----------- | -------- | 
| type | The type property must be set to: **OnPremisesMongoDb** | Yes |
| server | IP address or host name of the MongoDB server. | Yes | 
| port | TCP port that the MongoDB server uses to listen for client connections. | Optional, default value: 27017 |
| authenticationType | Basic, or Anonymous. | Yes | 
| username | User account to access MongoDB. | Yes (if basic authentication is used).|
| password | Password for the user. |	Yes (if basic authentication is used). | 
| authSource | Name of the MongoDB database that you want to use to check your credentials for authentication. | Optional (if basic authentication is used). default: uses the admin account and the database specified using databaseName property. |  
| databaseName | Name of the MongoDB database that you want to access. | Yes |
| gatewayName | Name of the gateway that accesses the data store. | Yes | 
| encryptedCredential | Credential encrypted by gateway. | Optional |


See [Setting Credentials and Security](data-factory-move-data-between-onprem-and-cloud.md#set-credentials-and-security) for details about setting credentials for an on-premises MongoDB data source.

## Dataset type properties

For a full list of sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc...).

The **typeProperties** section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for dataset of type **MongoDbCollection** has the following properties:

| Property | Description | Required |
| -------- | ----------- | -------- |
| collectionName | Name of the collection in MongoDB database. | Yes | 

## Copy activity type properties

For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, various policies etc. are available for all types of activities. 

Properties available in the **typeProperties** section of the activity on the other hand vary with each activity type and in case of Copy activity they vary depending on the types of sources and sinks.

In case of Copy Activity when source is of type **MongoDbSource** the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| query | Use the custom query to read data. | SQL-92 query string. For example: select * from MyTable. | No (if **collectionName** of **dataset** is specified) | 

## Schema by Data Factory
Azure Data Factory service infers schema from a MongoDB collection by using the latest 100 documents in the collection. If these 100 documents do not contain full schema, some columns may be ignored during the copy operation. 

## Type mapping for MongoDB

As mentioned in the [data movement activities](data-factory-data-movement-activities.md) article, Copy activity performs automatic type conversions from source types to sink types with the following 2 step approach:

1. Convert from native source types to .NET type
2. Convert from .NET type to native sink type

When moving data to MongoDB the following mappings will be used from MongoDB types to .NET types.

| MongoDB type | .NET Framework type |
| ------------------- | ------------------- | 
| Binary | Byte[] |
| Boolean | Boolean |
| Date | DateTime |
| NumberDouble | Double |
| NumberInt | Int32 |
| NumberLong | Int64 |
| ObjectID | String |
| String | String |
| UUID | Guid | 
| Object | Renormalized into flatten columns with “_” as nested separator |

> [AZURE.NOTE]  
> To learn about support for arrays using virtual tables, refer to [Support for complex types using virtual tables](#support-for-complex-types-using-virtual-tables) section below. 

The following MongoDB data types are not supported at this time:DBPointer, JavaScript, Max/Min key, Regular Expression, Symbol, Timestamp, Undefined

## Support for complex types using virtual tables
Azure Data Factory uses a built-in ODBC driver to connect to and copy data from your MongoDB database. For complex types such as arrays or objects with different types across the documents, the driver will re-normalize data into corresponding virtual tables. Specifically, if a table contains such columns, the driver generates the following virtual tables:

-	A **base table**, which contains the same data as the real table except for the complex type columns. The base table uses the same name as the real table that it represents.
-	A **virtual table** for each complex type column, which expands the nested data. The virtual tables are named using the name of the real table, a separator “_” and the name of the array or object.

Virtual tables refer to the data in the real table, enabling the driver to access the denormalized data. See Example section below details. You can access the content of MongoDB arrays by querying and joining the virtual tables.

You can leverage the [Copy Wizard](data-factory-data-movement-activities.md#data-factory-copy-wizard) to intuitively view the list of tables in MongoDB database including the virtual tables, and preview the data inside. You can also construct a query in the Copy Wizard and validate to see the result.

### Example

For example, “ExampleTable” below is a MongoDB table that has one column with an array of Objects in each cell – Invoices, and one column with an array of Scalar types – Ratings. 

_id | Customer Name | Invoices | Service Level | Ratings
--- | ------------- | -------- | ------------- | -------
1111 | ABC | [{invoice_id:”123”, item:”toaster”, price:”456”, discount:”0.2”}, {invoice_id:”124”, item:”oven”,price: ”1235”,discount: ”0.2”}] | Silver | [5,6]
2222 | XYZ | [{invoice_id:”135”, item:”fridge”,price: ”12543”,discount: ”0.0”}] | Gold | [1,2]

The driver would generate multiple virtual tables to represent this single table. The first virtual table is the base table named “ExampleTable”, shown below. The base table contains all of the data of the original table, but the data from the arrays has been omitted and will be expanded in the virtual tables.

_id | Customer Name | Service Level
--- | ------------- | -------------
1111 | ABC | Silver
2222 | XYZ | Gold

The following tables show the virtual tables that represent the original arrays in the example. Each of these tables contain the following

- A reference back to the original primary key column corresponding to the row of the original array (via the _id column)
- An indication of the position of the data within the original array (using the ExampleTable_Invoices_dim1_idx and ExampleTable_Ratings_dim1_idx columns)
- The expanded data for each element within the array

Table “ExampleTable_Invoices”:

_id | ExampleTable_Invoices_dim1_idx | invoice_id | item | price | Discount
--- | -------------- | ---------- | ---- | ----- | --------
1111 | 0 | 123 | toaster | 456 | 0.2
1111 | 1 | 124 | oven | 1235 | 0.2
2222 | 0 | 135 | fridge | 12543 | 0.0

Table “ExampleTable_Ratings”:

_id | ExampleTable_Ratings_dim1_idx | ExampleTable_Ratingse
--- | ------------- | -------------
1111 | 0 | 5
1111 | 1 | 6
2222 | 0 | 1
2222 | 1 | 2

[AZURE.INCLUDE [data-factory-column-mapping](../../includes/data-factory-column-mapping.md)]

[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

## Performance and Tuning  
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.

## Next Steps
See [Move data between on-premises and cloud](data-factory-move-data-between-onprem-and-cloud.md) article for step-by-step instructions for creating a data pipeline that moves data from an on-premises data store to an Azure data store. 

