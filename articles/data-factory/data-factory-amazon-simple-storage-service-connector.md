<properties 
	pageTitle="Move data from Amazon Simple Storage Service using Data Factory | Microsoft Azure" 
	description="Learn about how to move data from Amazon Simple Storage Service (S3) using Azure Data Factory." 
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
	ms.date="08/08/2016" 
	ms.author="spelluru"/>

# Move data From Amazon Simple Storage Service using Azure Data Factory

This article outlines how you can use the Copy Activity in an Azure data factory to move data to from Amazon Simple Storage Service (S3) to another data store. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article which presents a general overview of data movement with copy activity and provides a list of data stores that can be used as sources or sinks with the copy activity.  

Data factory currently supports only moving data from Amazon S3 to other data stores, but not for moving data from other data stores to Amazon S3.

## Sample: Copy data from Amazon S3 to Azure Blob
This sample shows how to copy data from a Amazon S3 to an Azure Blob Storage. However, data can be copied **directly** to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores) using the Copy Activity in Azure Data Factory.  
 
The sample has the following data factory entities:

- A linked service of type [AwsAccessKey](#linked-service-properties).
- A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service-properties).
- An input [dataset](data-factory-create-datasets.md) of type [AmazonS3](#dataset-type-properties).
- An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties).
- A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [FileSystemSource](#copy-activity-type-properties) and [BlobSink](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties).

The sample copies data from a query result in Amazon S3 to an Azure blob every hour. The JSON properties used in these samples are described in sections following the samples. 

**Amazon S3 linked service**

	{
	    "name": "AmazonS3LinkedService",
	    "properties": {
	        "type": "AwsAccessKey",
	        "typeProperties": {
	            "accessKeyId": "<access key id>",
	            "secretAccessKey": "<secret access key>"
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

**Amazon S3 input dataset**

Setting **"external": true** informs the Data Factory service that the dataset is external to the data factory and is not produced by an activity in the data factory. You must set this property to true on an input dataset that is not produced by an activity in the pipeline.

	{
	    "name": "AmazonS3InputDataset",
	    "properties": {
	        "type": "AmazonS3",
	        "linkedServiceName": "AmazonS3LinkedService",
	        "typeProperties": {
	            "key": "testFolder/test.orc",
	            "bucketName": "testbucket",
	            "format": {
	                "type": "OrcFormat"
	            }
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
	            "folderPath": "mycontainer/fromamazons3/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}",
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

The pipeline contains a Copy Activity that is configured to use the above input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **FileSystemSource** and **sink** type is set to **BlobSink**. The SQL query specified for the **query** property selects the data in the past hour to copy.
	
	{
	    "name": "CopyAmazonS3ToBlob",
	    "properties": {
	        "description": "pipeline for copy activity",
	        "activities": [
	            {
	                "type": "Copy",
	                "typeProperties": {
	                    "source": {
                        	"type": "FileSystemSource",
                        	"recursive": true
	                    },
	                    "sink": {
	                        "type": "BlobSink",
	                        "writeBatchSize": 0,
	                        "writeBatchTimeout": "00:00:00"
	                    }
	                },
	                "inputs": [
	                    {
	                        "name": "AmazonS3InputDataset"
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
	                "name": "AmazonS3ToBlob"
	            }
	        ],
	        "start": "2014-06-01T18:00:00Z",
	        "end": "2014-06-01T19:00:00Z"
	    }
	}



## Linked service properties

The following table provides description for JSON elements specific to Amazon S3 (**AwsAccessKey**) linked service.

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------- | ------- |  
| accessKeyID | The id of the secret access key, just like storage account name. | string | Yes |
| secretAccessKey | The secret access key itself. | Encrypted secret string | Yes | 


## Dataset type properties

For a full list of sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc...).

The **typeProperties** section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for dataset of type **AmazonS3** (which includes Amazon S3 dataset) has the following properties

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------- | ------ | 
| bucketName | The S3 bucket name. | String | Yes |
| key | The S3 object key. | String | No | 
| prefix | Prefix of the S3 object to match objects whose key start with this prefix. Applies only when key is empty. | String | No | 
| version | The version of S3 object if S3 versioning is enabled. | String | No |  

> [AZURE.NOTE] Bucket + Key is the location of a S3 object. Bucket is the Root container for S3 objects and key is the full path to S3 object, start without Bucket.

## Copy activity type properties

For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, various policies etc. are available for all types of activities. 

Properties available in the **typeProperties** section of the activity on the other hand vary with each activity type and in case of Copy activity they vary depending on the types of sources and sinks.

In case of Copy Activity when source is of type **FileSystemSource** (which includes Amazon S3) the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- | 
| recursive | Specifies whether to recursively list S3 objects under the directory | true/false | No | 

[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

[AZURE.INCLUDE [data-factory-column-mapping](../../includes/data-factory-column-mapping.md)]

[AZURE.INCLUDE [data-factory-type-repeatability-for-relational-sources](../../includes/data-factory-type-repeatability-for-relational-sources.md)]

## Performance and Tuning  
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.

## Next Steps
See the following articles: 
- [Copy Activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for step-by-step instructions for creating a pipeline with a Copy Activity. 