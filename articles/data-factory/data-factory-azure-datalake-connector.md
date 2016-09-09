<properties
	pageTitle="Move data to/from Azure Data Lake Store | Azure Data Factory"
	description="Learn how to move data to/from Azure Data Lake Store using Azure Data Factory"
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

# Move data to and from Azure Data Lake Store using Azure Data Factory
This article outlines how you can use the Copy Activity in an Azure data factory to move data to Azure Data Lake Store from another data store and move data from Azure Data Lake Store to another data store. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article which presents a general overview of data movement with the copy activity and the supported data store combinations.

> [AZURE.NOTE]
> You must create an Azure Data Lake Store account before creating a pipeline with a Copy Activity to move data to/from an Azure Data Lake store. To learn about Azure Data Lake Store, please see [Get started with Azure Data Lake Store](../data-lake-store/data-lake-store-get-started-portal.md).
>  
> Please review the [Build your first pipeline tutorial](data-factory-build-your-first-pipeline.md) for detailed steps to create a data factory, linked services, datasets, and a pipeline. Use the JSON snippets with Data Factory Editor or Visual Studio or Azure PowerShell to create the Data Factory entities.

## Copy data wizard
The easiest way to create a pipeline that copies data to/from Azure Azure Data Lake Store is to use the Copy data wizard. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough on creating a pipeline using the Copy data wizard. 

The following examples provide sample JSON definitions that you can use to create a pipeline by using [Azure Portal](data-factory-copy-activity-tutorial-using-azure-portal.md) or [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md). They show how to copy data to and from Azure Data Lake Store and Azure Blob Storage. However, data can be copied **directly** from any of sources to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores) using the Copy Activity in Azure Data Factory.  


## Sample: Copy data from Azure Blob to Azure Data Lake Store
The sample below shows:

1.	A linked service of type [AzureStorage](#azure-storage-linked-service-properties).
2.	A linked service of type [AzureDataLakeStore](#azure-data-lake-linked-service-properties).
3.	An input [dataset](data-factory-create-datasets.md) of type [AzureBlob](#azure-blob-dataset-type-properties).
4.	An output [dataset](data-factory-create-datasets.md) of type [AzureDataLakeStore](#azure-data-lake-dataset-type-properties).
4.	A [pipeline](data-factory-create-pipelines.md) with a Copy activity that uses [BlobSource](#azure-blob-copy-activity-type-properties) and [AzureDataLakeStoreSink](#azure-data-lake-copy-activity-type-properties).

The sample copies data belonging to a time series from an Azure Blob Storage to Azure Data Lake  Store every hour. The JSON properties used in these samples are described in sections following the samples.


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

**Azure Data Lake linked service:**

	{
	    "name": "AzureDataLakeStoreLinkedService",
	    "properties": {
	        "type": "AzureDataLakeStore",
	        "typeProperties": {
	            "dataLakeStoreUri": "https://<accountname>.azuredatalakestore.net/webhdfs/v1",
				"sessionId": "<session ID>",
	            "authorization": "<authorization URL>"
	        }
	    }
	}

### To create Azure Data Lake Linked Service using Data Factory Editor
The following procedure provides steps for creating an Azure Data Lake Store linked service using the Data Factory Editor.

1. Click **New data store** on the command bar and select **Azure Data Lake Store**.
2. In the JSON editor, for the **dataLakeStoreUri** property, enter the URI for the data lake.
3. Click **Authorize** button on the command bar. You should see a pop up window.

	![Authorize button](./media/data-factory-azure-data-lake-connector/authorize-button.png)

4. Use your credentials to sign-in and the **authorization** property in the JSON should be assigned to a value now.
5. (optional) Specify values for optional parameters such as **accountName**, **subscriptionID** and **resourceGroupName** in the JSON (or) delete these properties from the JSON.
6. Click **Deploy** on the command bar to deploy the linked service.

> [AZURE.IMPORTANT] The authorization code you generated by using the **Authorize** button expires after sometime. You will need to **reauthorize** using the **Authorize** button when the **token expires** and redeploy the linked service. See [Azure Data Lake Store Linked Service](#azure-data-lake-store-linked-service-properties) section for details. 



**Azure Blob input dataset:**

Data is picked up from a new blob every hour (frequency: hour, interval: 1). The folder path and file name for the blob are dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, and day part of the start time and file name uses the hour part of the start time. “external”: “true” setting informs the Data Factory service that this table is external to the data factory and not produced by an activity in the data factory.

	{
	  "name": "AzureBlobInput",
	  "properties": {
	    "type": "AzureBlob",
	    "linkedServiceName": "StorageLinkedService",
	    "typeProperties": {
	      "Path": "mycontainer/myfolder/yearno={Year}/monthno={Month}/dayno={Day}",
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


**Azure Data Lake output dataset:**

The sample copies data to an Azure Data Lake store. New data is copies to Data Lake store every hour.

	{
		"name": "AzureDataLakeStoreOutput",
	  	"properties": {
			"type": "AzureDataLakeStore",
		    "linkedServiceName": "AzureDataLakeStoreLinkedService",
		    "typeProperties": {
				"folderPath": "datalake/output/"
		    },
	    	"availability": {
	      		"frequency": "Hour",
	      		"interval": 1
	    	}
	  	}
	}



**Pipeline with a Copy activity:**

The pipeline contains a Copy Activity that is configured to use the above input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **BlobSource** and **sink** type is set to **AzureDataLakeStoreSink**.

	{  
	    "name":"SamplePipeline",
	    "properties":
		{  
	    	"start":"2014-06-01T18:00:00",
	    	"end":"2014-06-01T19:00:00",
	    	"description":"pipeline with copy activity",
	    	"activities":
			[  
	      		{
	        		"name": "AzureBlobtoDataLake",
		        	"description": "Copy Activity",
		        	"type": "Copy",
		        	"inputs": [
		          	{
			            "name": "AzureBlobInput"
		          	}
		        	],
		        	"outputs": [
		          	{
			            "name": "AzureDataLakeStoreOutput"
		          	}
		        	],
		        	"typeProperties": {
			        	"source": {
		            		"type": "BlobSource",
			    			"treatEmptyAsNull": true,
		            		"blobColumnSeparators": ","
		          		},
		          		"sink": {
		            		"type": "AzureDataLakeStoreSink"
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

## Sample: Copy data from Azure Data Lake Store to Azure Blob
The sample below shows:

1.	A linked service of type [AzureDataLakeStore](#azure-data-lake-linked-service-properties).
2.	A linked service of type [AzureStorage](#azure-storage-linked-service-properties).
3.	An input [dataset](data-factory-create-datasets.md) of type [AzureDataLakeStore](#azure-data-lake-dataset-type-properties).
4.	An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](#azure-blob-dataset-type-properties).
5.	A [pipeline](data-factory-create-pipelines.md) with a Copy activity that uses [AzureDataLakeStoreSource](#azure-data-lake-copy-activity-type-properties) and [BlobSink](#azure-blob-copy-activity-type-properties)

The sample copies data belonging to a time series from an Azure Data Lake store to an Azure blob every hour. The JSON properties used in these samples are described in sections following the samples.

**Azure Data Lake Store linked service:**

	{
	    "name": "AzureDataLakeStoreLinkedService",
	    "properties": {
	        "type": "AzureDataLakeStore",
	        "typeProperties": {
	            "dataLakeStoreUri": "https://<accountname>.azuredatalakestore.net/webhdfs/v1",
				"sessionId": "<session ID>",
	            "authorization": "<authorization URL>"
	        }
	    }
	}

> [AZURE.NOTE] See the steps in the previous sample to obtain authorization URL.  

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

**Azure Data Lake input dataset:**

Setting **"external": true** and specifying **externalData** policy informs the Azure Data Factory service that this is a table that is external to the data factory and not produced by an activity in the data factory.

	{
		"name": "AzureDataLakeStoreInput",
	  	"properties":
		{
	    	"type": "AzureDataLakeStore",
	    	"linkedServiceName": "AzureDataLakeStoreLinkedService",
		    "typeProperties": {
				"folderPath": "datalake/input/",
            	"fileName": "SearchLog.tsv",
            	"format": {
                	"type": "TextFormat",
	                "rowDelimiter": "\n",
    	            "columnDelimiter": "\t"
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

The pipeline contains a Copy Activity that is configured to use the above input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **AzureDataLakeStoreSource** and **sink** type is set to **BlobSink**.


	{  
	    "name":"SamplePipeline",
	    "properties":{  
	    	"start":"2014-06-01T18:00:00",
	    	"end":"2014-06-01T19:00:00",
	    	"description":"pipeline for copy activity",
	    	"activities":[  
	      		{
	        		"name": "AzureDakeLaketoBlob",
		    	    "description": "copy activity",
		    	    "type": "Copy",
		    	    "inputs": [
		    	      {
		    	        "name": "AzureDataLakeStoreInput"
		    	      }
		    	    ],
		    	    "outputs": [
		    	      {
		    	        "name": "AzureBlobOutput"
		    	      }
		    	    ],
		    	    "typeProperties": {
		    	    	"source": {
		            		"type": "AzureDataLakeStoreSource",
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


## Azure Data Lake Store Linked Service properties

You can link an Azure storage account to an Azure data factory using an Azure Storage linked service. The following table provides description for JSON elements specific to Azure Storage linked service.

| Property | Description | Required |
| :-------- | :----------- | :-------- |
| type | The type property must be set to: **AzureDataLakeStore** | Yes |
| dataLakeStoreUri | Specify information about the Azure Data Lake Store account. It is in the following format: https://<Azure Data Lake account name>.azuredatalakestore.net/webhdfs/v1 | Yes |
| authorization | Click **Authorize** button in the **Data Factory Editor** and enter your credentials, which assigns the auto-generated authorization URL to this property.  | Yes |
| sessionId | OAuth session id from the oauth authorization session. Each session id is unique and may only be used once. This is automatically generated when you use Data Factory Editor. | Yes |  
| accountName | Data lake account name | No |
| subscriptionId | Azure subscription Id. | No (If not specified, subscription of the data factory is used). |
| resourceGroupName |  Azure resource group name | No (If not specified, resource group of the data factory is used). |

## Token expiration 
The authorization code you generate by using the **Authorize** button expires after sometime. See the following table for the expiration times for different types of user accounts. You may see the following error message when the authentication **token expires**: "Credential operation error: invalid_grant - AADSTS70002: Error validating credentials. AADSTS70008: The provided access grant is expired or revoked. Trace ID: d18629e8-af88-43c5-88e3-d8419eb1fca1 Correlation ID: fac30a0c-6be6-4e02-8d69-a776d2ffefd7 Timestamp: 2015-12-15 21-09-31Z".


| User type | Expires after |
| :-------- | :----------- | 
| User accounts NOT managed by Azure Active Directory (@hotmail.com, @live.com, etc.) | 12 hours |
| Users accounts managed by Azure Active Directory (AAD) | 14 days after the last slice run. <br/><br/>90 days, if a slice based on OAuth-based linked service runs at least once every 14 days. |

Note that if you change your password before this token expiration time, the token will expire immediately and you will see the error mentioned above. 

To avoid/resolve this error, you will need to reauthorize using the **Authorize** button when the **token expires** and redeploy the linked service. You can also generate values for **sessionId** and **authorization** properties programmatically using code in the following section. 

### To programmatically generate sessionId and authorization values 

    if (linkedService.Properties.TypeProperties is AzureDataLakeStoreLinkedService ||
        linkedService.Properties.TypeProperties is AzureDataLakeAnalyticsLinkedService)
    {
        AuthorizationSessionGetResponse authorizationSession = this.Client.OAuth.Get(this.ResourceGroupName, this.DataFactoryName, linkedService.Properties.Type);

        WindowsFormsWebAuthenticationDialog authenticationDialog = new WindowsFormsWebAuthenticationDialog(null);
        string authorization = authenticationDialog.AuthenticateAAD(authorizationSession.AuthorizationSession.Endpoint, new Uri("urn:ietf:wg:oauth:2.0:oob"));

        AzureDataLakeStoreLinkedService azureDataLakeStoreProperties = linkedService.Properties.TypeProperties as AzureDataLakeStoreLinkedService;
        if (azureDataLakeStoreProperties != null)
        {
            azureDataLakeStoreProperties.SessionId = authorizationSession.AuthorizationSession.SessionId;
            azureDataLakeStoreProperties.Authorization = authorization;
        }

        AzureDataLakeAnalyticsLinkedService azureDataLakeAnalyticsProperties = linkedService.Properties.TypeProperties as AzureDataLakeAnalyticsLinkedService;
        if (azureDataLakeAnalyticsProperties != null)
        {
            azureDataLakeAnalyticsProperties.SessionId = authorizationSession.AuthorizationSession.SessionId;
            azureDataLakeAnalyticsProperties.Authorization = authorization;
        }
    }

See [AzureDataLakeStoreLinkedService Class](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.azuredatalakestorelinkedservice.aspx), [AzureDataLakeAnalyticsLinkedService Class](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.azuredatalakeanalyticslinkedservice.aspx), and [AuthorizationSessionGetResponse Class](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.authorizationsessiongetresponse.aspx) topics for details about the Data Factory classes used in the code. You need to add a reference to **2.9.10826.1824** version of  **Microsoft.IdentityModel.Clients.ActiveDirectory.WindowsForms.dll** for the WindowsFormsWebAuthenticationDialog class used in the code. 
 

## Azure Data Lake Dataset type properties

For a full list of JSON sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc...).

The **typeProperties** section is different for each type of dataset and provides information about the location, format etc. of the data in the data store. The typeProperties section for dataset of type **AzureDataLakeStore** dataset has the following properties.

| Property | Description | Required |
| :-------- | :----------- | :-------- |
| folderPath | Path to the container and folder in the Azure Data Lake store. | Yes |
| fileName | Name of the file in the Azure Data Lake store. fileName is optional and case-sensitive. <br/><br/>If you specify a filename, the activity (including Copy) works on the specific file.<br/><br/>When fileName is not specified Copy will include all files in the folderPath for input dataset.<br/><br/>When fileName is not specified for an output dataset, the name of the generated file would be in the following this format: Data.<Guid>.txt (for example: : Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt | No |
| partitionedBy | partitionedBy is an optional property. You can use it to specify a dynamic folderPath and filename for time series data. For example, folderPath can be parameterized for every hour of data. See the Leveraging partitionedBy property section below for details and examples. | No |
| format | The following format types are supported: **TextFormat**, **AvroFormat**, **JsonFormat**, and **OrcFormat**. You need to set the **type** property under format to one of these values. See [Specifying TextFormat](#specifying-textformat), [Specifying AvroFormat](#specifying-avroformat), [Specifying JsonFormat](#specifying-jsonformat), [Specifying OrcFormat](#specifying-orcformat) sections for details. If you want to copy files as-is between file-based stores (binary copy), you can skip the format section in both input and output dataset definitions.| No
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, and **BZip2** and supported levels are: **Optimal** and **Fastest**. Note that compression settings are not supported for data in  **AvroFormat** or **OrcFormat** at this time. See [Compression support](#compression-support) section for more details.  | No |

### Leveraging partitionedBy property
As mentioned above, you can specify a dynamic folderPath and filename for time series data with the **partitionedBy** section, Data Factory macros and the system variables: SliceStart and SliceEnd, which indicate start and end times for a given data slice.

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

[AZURE.INCLUDE [data-factory-file-format](../../includes/data-factory-file-format.md)]
 

### Compression support  
Processing large data sets can cause I/O and network bottlenecks. Therefore, compressed data in stores can not only speed up data transfer across the network and save disk space, but also bring significant performance improvements in processing big data. At this time, compression is supported for file-based data stores such as Azure Blob or On-premises File System.  

To specify compression for a dataset, use the **compression** property in the dataset JSON as in the following example:   

	{  
		"name": "AzureDatalakeStoreDataSet",  
	  	"properties": {  
	    	"availability": {  
	    		"frequency": "Day",  
	    	  	"interval": 1  
	    	},  
	    	"type": "AzureDatalakeStore",  
	    	"linkedServiceName": "DataLakeStoreLinkedService",  
	    	"typeProperties": {  
	    		"fileName": "pagecounts.csv.gz",  
	    	  	"folderPath": "compression/file/",  
	    	  	"compression": {  
	    	    	"type": "GZip",  
	    	    	"level": "Optimal"  
	    	  	}  
    		}  
	  	}  
	}  
 
Note that the **compression** section has two properties:  
  
- **Type:** the compression codec, which can be **GZIP**, **Deflate** or **BZIP2**.  
- **Level:** the compression ratio, which can be **Optimal** or **Fastest**. 
	- **Fastest:** The compression operation should complete as quickly as possible, even if the resulting file is not optimally compressed. 
	- **Optimal**: The compression operation should be optimally compressed, even if the operation takes a longer time to complete. 
	
	See [Compression Level](https://msdn.microsoft.com/library/system.io.compression.compressionlevel.aspx) topic for more information. 

Suppose the above sample dataset is used as the output of a copy activity, the copy activity will compresses the output data with GZIP codec using optimal ratio and then write the compressed data into a file named pagecounts.csv.gz in the Azure Data Lake store.   

When you specify compression property in an input dataset JSON, the pipeline can read compressed data from the source and when you specify the property in an output dataset JSON, the copy activity can write compressed data to the destination. Here are a few sample scenarios: 

- Read GZIP compressed data from an Azure Data Lake Store, decompress it, and write result data to an Azure SQL database. You define the input Azure Data Lake Store dataset with the compression JSON property in this case. 
- Read data from a plain-text file from on-premises File System, compress it using GZip format, and write the compressed data to an Azure Data Lake Store. You define an output Azure Data Lake dataset with the compression JSON property in this case.  
- Read a GZIP-compressed data from an Azure Data Lake Store, decompress it, compress it using BZIP2, and write result data to an Azure Data Lake Store. You define the input Azure Data Lake Store dataset with compression type set to GZIP and the output dataset with compression type set to BZIP2 in this case.   


## Azure Data Lake Copy Activity type properties  
For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, various policies etc are available for all types of activities.

Properties available in the typeProperties section of the activity on the other hand vary with each activity type and in case of Copy activity they vary depending on the types of sources and sinks

**AzureDataLakeStoreSource** supports the following properties **typeProperties** section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| recursive | Indicates whether the data is read recursively from the sub folders or only from the specified folder. | True (default value), False | No |



**AzureDataLakeStoreSink** supports the following properties **typeProperties** section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| copyBehavior | Specifies the copy behavior. | **PreserveHierarchy:** preserves the file hierarchy in the target folder, i.e., the relative path of source file to source folder is identical to the relative path of target file to target folder.<br/><br/>**FlattenHierarchy:** all files from the source folder will be in the first level of target folder. The target files will have auto generated name.<br/><br/>**MergeFiles:** merges all files from the source folder to one file. If the File/Blob Name is specified, the merged file name would be the specified name; otherwise, would be auto-generated file name. | No |


[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

[AZURE.INCLUDE [data-factory-type-conversion-sample](../../includes/data-factory-type-conversion-sample.md)]

[AZURE.INCLUDE [data-factory-column-mapping](../../includes/data-factory-column-mapping.md)]

## Performance and Tuning  
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.
