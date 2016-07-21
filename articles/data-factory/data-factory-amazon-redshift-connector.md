<properties 
	pageTitle="Move data from Amazon Redshift using Data Factory | Microsoft Azure" 
	description="Learn about how to move data from Amazon Redshift using Azure Data Factory." 
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
	ms.date="07/21/2016" 
	ms.author="spelluru"/>

# Move data From Amazon Redshift using Azure Data Factory

This article outlines how you can use the Copy Activity in an Azure data factory to move data to from Amazon Redshift to another data store. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article which presents a general overview of data movement with copy activity and provides a list of data stores that can be used as sources or sinks with the copy activity.  

Data factory currently supports only moving data from Amazon Redshift to other data stores, but not for moving data from other data stores to Amazon Redshift.

## Prerequisites

- Grant Azure or Data Management Gateway the access to Amazon Redshift cluster. See [Authorize access to the cluster](http://docs.aws.amazon.com/redshift/latest/gsg/rs-gsg-authorize-cluster-access.html) for instructions.  
- 

## Sample: Copy data from Amazon Redshift to Azure Blob
This sample shows how to copy data from a Amazon Redshift database to an Azure Blob Storage. However, data can be copied **directly** to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores) using the Copy Activity in Azure Data Factory.  
 
The sample has the following data factory entities:

- A linked service of type [AmazonRedshift](#linked-service-properties).
- A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service-properties).
- An input [dataset](data-factory-create-datasets.md) of type [RelationalTable](#dataset-type-properties).
- An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties).
- A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [RelationalSource](#copy-activity-type-properties) and [BlobSink](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties).

The sample copies data from a query result in Amazon Redshift to a blob every hour. The JSON properties used in these samples are described in sections following the samples. 

**Amazon Redshift linked service**

	{
	    "name": "AmazonRedshiftLinkedService",
	    "properties":
	    {
	        "type": "AmazonRedshift",
	        "typeProperties":
	        {
	            "server": "< The IP address or host name of the Amazon Redshift server >",
	            "port": "<The number of the TCP port that the Amazon Redshift server uses to listen for client connections.>",
	            "database": "<The database name of the Amazon Redshift database>",
	            "username": "<username>",
	            "password": "<password>",
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

**Amazon Redshift input dataset**

Setting **"external": true** informs the Data Factory service that the dataset is external to the data factory and is not produced by an activity in the data factory. You must set this property to true on an input dataset that is not produced by an activity in the pipeline.

	{
	    "name": "AmazonRedshiftInputDataset",
	    "properties": {
	        "type": "RelationalTable",
	        "linkedServiceName": "AmazonRedshiftLinkedService",
	        "typeProperties": {
	            "tableName  ": "<Table name>",
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
	            "folderPath": "mycontainer/fromamazonredshift/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}",
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

The pipeline contains a Copy Activity that is configured to use the above input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **RelationalSource** and **sink** type is set to **BlobSink**. The SQL query specified for the **query** property selects the data in the past hour to copy.
	
	{
	    "name": "CopyAmazonRedshiftToBlob",
	    "properties": {
	        "description": "pipeline for copy activity",
	        "activities": [
	            {
	                "type": "Copy",
	                "typeProperties": {
	                    "source": {
	                        "type": "RelationalSource",
	                        "query": "$$Text.Format('select * from MyTable where timestamp >= \\'{0:yyyy-MM-ddTHH:mm:ss}\\' AND timestamp < \\'{1:yyyy-MM-ddTHH:mm:ss}\\'', WindowStart, WindowEnd)"
	                    },
	                    "sink": {
	                        "type": "BlobSink",
	                        "writeBatchSize": 0,
	                        "writeBatchTimeout": "00:00:00"
	                    }
	                },
	                "inputs": [
	                    {
	                        "name": "AmazonRedshiftInputDataset"
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
	                "name": "AmazonRedshiftToBlob"
	            }
	        ],
	        "start": "2014-06-01T18:00:00Z",
	        "end": "2014-06-01T19:00:00Z"
	    }
	}



## Linked service properties

The following table provides description for JSON elements specific to Amazon Redshift linked service.

| Property | Description | Required |
| -------- | ----------- | -------- | 
| type | The type property must be set to: **AmazonRedshift**. | Yes |
| server | IP address or host name of the Amazon Redshift server. | Yes |
| port | The number of the TCP port that the Amazon Redshift server uses to listen for client connections. | No, default value: 5439 |
| database | Name of the Amazon Redshift database. | Yes |
| username | Name of user who has access to the database.| Yes |
| password | Password for the user account.| Yes |

See [Setting Credentials and Security](data-factory-data-management-gateway.md#set-credentials-and-security) for details about setting credentials for an on-premises Amazon Redshift data source.

## Dataset type properties

For a full list of sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc...).

The **typeProperties** section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for dataset of type **RelationalTable** (which includes Amazon Redshift dataset) has the following properties

| Property | Description | Required |
| -------- | ----------- | -------- |
| tableName | Name of the table in the Amazon Redshift database that linked service refers to. | No (if **query** of **RelationalSource** is specified) | 

## Copy activity type properties

For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, various policies etc. are available for all types of activities. 

Properties available in the **typeProperties** section of the activity on the other hand vary with each activity type and in case of Copy activity they vary depending on the types of sources and sinks.

In case of Copy Activity when source is of type **RelationalSource** (which includes Amazon Redshift) the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| query | Use the custom query to read data. | SQL query string. For example: select * from MyTable. | No (if **tableName** of **dataset** is specified) | 

[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

### Type mapping for Amazon Redshift

As mentioned in the [data movement activities](data-factory-data-movement-activities.md) article, Copy activity performs automatic type conversions from source types to sink types with the following 2 step approach:

1. Convert from native source types to .NET type
2. Convert from .NET type to native sink type

When moving data to Amazon Redshift the following mappings will be used from Amazon Redshift types to .NET types.

Amazon Redshift Type | .NET Based Type
-------------------- | ---------------
SMALLINT | Int16
INTEGER | Int32
BIGINT | Int64
DECIMAL | Decimal
REAL | Single
DOUBLE PRECISION | Double
BOOLEAN | String
CHAR | String
VARCHAR | String
DATE | DateTime
TIMESTAMP | DateTime
TEXT | String



[AZURE.INCLUDE [data-factory-column-mapping](../../includes/data-factory-column-mapping.md)]

[AZURE.INCLUDE [data-factory-type-repeatability-for-relational-sources](../../includes/data-factory-type-repeatability-for-relational-sources.md)]

## Performance and Tuning  
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.

## Next Steps
See the following articles: 
- [Copy Activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for step-by-step instructions for creating a pipeline with a Copy Activity. 