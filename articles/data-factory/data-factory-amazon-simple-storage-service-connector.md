<properties 
	pageTitle="Move data from Amazon Simple Storage Service using Data Factory | Microsoft Azure" 
	description="Learn about how to move data from Amazon Simple Storage Service (S3) using Azure Data Factory." 
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
	ms.date="08/25/2016" 
	ms.author="jingwang"/>

# Move data From Amazon Simple Storage Service using Azure Data Factory

This article outlines how you can use the Copy Activity in an Azure data factory to move data to from Amazon Simple Storage Service (S3) to another data store. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article that presents a general overview of data movement, and a list of supported source/sink data stores with copy activity.  

Data factory currently supports only moving data from Amazon S3 to other data stores, but not for moving data from other data stores to Amazon S3.

## Copy data wizard
The easiest way to create a pipeline that copies data from Amazon S3 is to use the Copy data wizard. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough on creating a pipeline using the Copy data wizard. 

The following example provides sample JSON definitions that you can use to create a pipeline by using [Azure portal](data-factory-copy-activity-tutorial-using-azure-portal.md) or [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md). It shows you how to copy data from Amazon S3 to Azure Blob Storage. However, data can be copied to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores).

## Sample: Copy data from Amazon S3 to Azure Blob
This sample shows how to copy data from an Amazon S3 to an Azure Blob Storage. However, data can be copied **directly** to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores) using the Copy Activity in Azure Data Factory.  
 
The sample has the following data factory entities:

- A linked service of type [AwsAccessKey](#linked-service-properties).
- A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service-properties).
- An input [dataset](data-factory-create-datasets.md) of type [AmazonS3](#dataset-type-properties).
- An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties).
- A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [FileSystemSource](#copy-activity-type-properties) and [BlobSink](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties).

The sample copies data from Amazon S3 to an Azure blob every hour. The JSON properties used in these samples are described in sections following the samples. 

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

Setting **"external": true** informs the Data Factory service that the dataset is external to the data factory and is not produced by an activity in the data factory. Set this property to true on an input dataset that is not produced by an activity in the pipeline.

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
	        "availability": {
	            "frequency": "Hour",
	            "interval": 1
	        }
	    }
	}



**Pipeline with Copy activity**

The pipeline contains a Copy Activity that is configured to use the input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **FileSystemSource** and **sink** type is set to **BlobSink**. 
	
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
	        "start": "2014-08-08T18:00:00Z",
	        "end": "2014-08-08T19:00:00Z"
	    }
	}



## Linked service properties

The following table provides description for JSON elements specific to Amazon S3 (**AwsAccessKey**) linked service.

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------- | ------- |  
| accessKeyID | ID of the secret access key. | string | Yes |
| secretAccessKey | The secret access key itself. | Encrypted secret string | Yes | 


## Dataset type properties

For a full list of sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections such as structure, availability, and policy are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc.).

The **typeProperties** section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for dataset of type **AmazonS3** (which includes Amazon S3 dataset) has the following properties

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------- | ------ | 
| bucketName | The S3 bucket name. | String | Yes |
| key | The S3 object key. | String | No | 
| prefix | Prefix for the S3 object key. Objects whose keys start with this prefix are selected. Applies only when key is empty. | String | No | 
| version | The version of S3 object if S3 versioning is enabled. | String | No |  
| format | The following format types are supported: **TextFormat**, **AvroFormat**, **JsonFormat**, and **OrcFormat**. Set the **type** property under format to one of these values. See [Specifying TextFormat](#specifying-textformat), [Specifying AvroFormat](#specifying-avroformat), [Specifying JsonFormat](#specifying-jsonformat), and [Specifying OrcFormat](#specifying-orcformat) sections for details. If you want to copy files as-is between file-based stores (binary copy), you can skip the format section in both input and output dataset definitions.| No
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, and **BZip2** and supported levels are: **Optimal** and **Fastest**. Currently, the compression settings are not supported for data in **AvroFormat** or **OrcFormat**. See [Compression support](#compression-support) section for more details.  | No |

> [AZURE.NOTE] bucketName + key specifies the location of the S3 object where bucket is the root container for S3 objects and key is the full path to S3 object.

### Sample dataset with prefix

	{
	    "name": "dataset-s3",
	    "properties": {
	        "type": "AmazonS3",
	        "linkedServiceName": "link- testS3",
	        "typeProperties": {
	            "prefix": "testFolder/test",
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

### Sample data set (with version)

	{
	    "name": "dataset-s3",
	    "properties": {
	        "type": "AmazonS3",
	        "linkedServiceName": "link- testS3",
	        "typeProperties": {
	            "key": "testFolder/test.orc",
	            "bucketName": "testbucket",
	            "version": "WBeMIxQkJczm0CJajYkHf0_k6LhBmkcL",
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


### Dynamic paths for S3

In the sample, we use fixed values for key and bucketName properties in the Amazon S3 dataset. 

	"key": "testFolder/test.orc",
	"bucketName": "testbucket",

You can have Data Factory calculate the key and bucketName dynamically at runtime by using system variables such as SliceStart.

	"key": "$$Text.Format('{0:MM}/{0:dd}/test.orc', SliceStart)"
	"bucketName": "$$Text.Format('{0:yyyy}', SliceStart)"

You can do the same for the prefix property of an Amazon S3 dataset. See [Data Factory functions and system variables](data-factory-functions-variables.md) for a list of supported functions and variables. 


[AZURE.INCLUDE [data-factory-file-format](../../includes/data-factory-file-format.md)]
[AZURE.INCLUDE [data-factory-compression](../../includes/data-factory-compression.md)]


## Copy activity type properties

For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties such as name, description, input and output tables, and policies are available for all types of activities. 

Properties available in the **typeProperties** section of the activity on the other hand vary with each activity type. For Copy activity, they vary depending on the types of sources and sinks.

When source in copy activity is of type **FileSystemSource** (which includes Amazon S3), the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- | 
| recursive | Specifies whether to recursively list S3 objects under the directory. | true/false | No | 

[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

[AZURE.INCLUDE [data-factory-column-mapping](../../includes/data-factory-column-mapping.md)]

[AZURE.INCLUDE [data-factory-type-repeatability-for-relational-sources](../../includes/data-factory-type-repeatability-for-relational-sources.md)]

## Performance and Tuning  
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.

## Next Steps
See the following articles: 
- [Copy Activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for step-by-step instructions for creating a pipeline with a Copy Activity. 