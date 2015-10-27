<properties 
	pageTitle="Run U-SQL script on Azure Data Lake Analytics from Azure Data Factory" 
	description="Learn how to process data by running U-SQL scripts on Azure Data Lake Analytics compute service." 
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
	ms.date="10/27/2015" 
	ms.author="spelluru"/>

# Run U-SQL script on Azure Data Lake Analytics from Azure Data Factory 
A pipeline in an Azure data factory processes data in linked storage services by using linked compute services. It contains a sequence of activities where each activity performs a specific processing operation. This article describes the **Data Lake Analytics U-SQL Activity** that runs a  **U-SQL** script on an **Azure Data Lake Analytics** compute linked service. 

> [AZURE.NOTE] 
> You must create an Azure Data Lake Analytics account before creating a pipeline with a Data Lake Analytics U-SQL Activity. To learn about Azure Data Lake Analytics, please see [Get started with Azure Data Lake Analytics](../data-lake-analytics/data-lake-analytics-get-started-portal.md).
>  
> Please review the [Build your first pipeline tutorial](data-factory-build-your-first-pipeline.md) for detailed steps to create a data factory, linked services, datasets, and a pipeline. Use the JSON snippets with Data Factory Editor or Visual Studio or Azure PowerShell to create the Data Factory entities.

## Azure Data Lake Analytics Linked Service
You create an **Azure Data Lake Analytics** linked service to link an Azure Data Lake Analytics compute service to an Azure data factory before using the Data Lake Analytics U-SQL activity in a pipeline. 

The following example provides JSON definition for an Azure Data Lake Analytics linked service. 

	{
	    "name": "AzureDataLakeAnalyticsLinkedService",
	    "properties": {
	        "type": "AzureDataLakeAnalytics",
	        "typeProperties": {
	            "accountName": "adftestaccount",
	            "dataLakeAnalyticsUri": "datalakeanalyticscompute.net",
	            "authorization": "<authcode>",
				"sessionId": "<session ID>", 
	            "subscriptionId": "<subscription id>",
	            "resourceGroupName": "<resource group name>"
	        }
	    }
	}


The following table provides descriptions for the properties used in the JSON definition. 

Property | Description | Required
-------- | ----------- | --------
Type | The type property should be set to: **AzureDataLakeAnalytics**. | Yes
accountName | Azure Data Lake Analytics Account Name. | Yes
dataLakeAnalyticsUri | Azure Data Lake Analytics URI. |  No 
authorization | Authorization code is automatically retrieved after clicking **Authorize** button in the Data Factory Editor and completing the OAuth login. | Yes 
subscriptionId | Azure subscription id | No (If not specified, subscription of the data factory is used). 
resourceGroupName | Azure resource group name |  No (If not specified, resource group of the data factory is used).
sessionId | session id from the OAuth authorization session. Each session id is unique and may only be used once. This is auto-generated in the Data Factory Editor. | Yes

   
 
## Data Lake Analytics U-SQL Activity 

The following JSON snippet defines a pipeline with a Data Lake Analytics U-SQL Activity. The activity definition has a reference to the Azure Data Lake Analytics linked service you created earlier.   
  

	{
    	"name": "ComputeEventsByRegionPipeline",
    	"properties": {
        	"description": "This is a pipeline to compute events for en-gb locale and date less than 2012/02/19.",
        	"activities": 
			[
            	{
            	    "type": "DataLakeAnalyticsU-SQL",
                	"typeProperties": {
                    	"scriptPath": "scripts\\kona\\SearchLogProcessing.txt",
	                    "scriptLinkedService": "StorageLinkedService",
    	                "degreeOfParallelism": 3,
    	                "priority": 100,
    	                "parameters": {
    	                    "in": "/datalake/input/SearchLog.tsv",
    	                    "out": "/datalake/output/Result.tsv"
    	                }
    	            },
    	            "inputs": [
	    				{
	                        "name": "DataLakeTable"
	                    }
	                ],
	                "outputs": 
					[
	                    {
                    	    "name": "EventsByRegionTable"
                    	}
                	],
                	"policy": {
                    	"timeout": "06:00:00",
	                    "concurrency": 1,
    	                "executionPriorityOrder": "NewestFirst",
    	                "retry": 1
    	            },
    	            "scheduler": {
    	                "frequency": "Day",
    	                "interval": 1
    	            },
    	            "name": "EventsByRegion",
    	            "linkedServiceName": "AzureDataLakeAnalyticsLinkedService"
    	        }
    	    ],
    	    "start": "2015-08-08T00:00:00Z",
    	    "end": "2015-08-08T01:00:00Z",
    	    "isPaused": false
    	}
	}


The following table describes names and descriptions of properties that are specific to this activity. 

Property | Description | Required
:-------- | :----------- | :--------
type | The type property must be set to **DataLakeAnalyticsU-SQL**. | Yes
scriptPath | Path to folder that contains the U-SQL script. | No (if you use script)
scriptLinkedService | Linked service that links the storage that contains the script to the data factory | No (if you use script)
script | Specifiy inline script instread of specifying scriptPath and scriptLinkedService. For example: "script" : "CREATE DATABASE test". | No (if you use scriptPath and scriptLinkedService)
degreeOfParallelism | The maximum number of nodes that will be used simultaneously to run the job. | No
priority | Determines which jobs out of all that are queued should be selected to run first. The lower the number, the higher the priority. | No 
parameters | Parameters for the U-SQL script | No 
runtimeVersion | Runtime version of U-SQL engine to use. | No
compilationMode | Compilation mode of U-SQL. Must be one of the following values: <ul><li>**Semantic** - perform semantic checks and necessary sanity checks only.</li><li>**Full** - Perform the full compilation, including syntax check, optimization, code-gen, etc.</li><li>**SingleBox** - Perform the full compilation.</li></ul> | No


### Sample input and output datasets

#### Input dataset
In this example, the input data resides in an Azure Data Lake Store (SearchLog.tsv file in the datalake/input folder). 

	{
    	"name": "DataLakeTable",
	    "properties": {
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
    	    "availability": {
    	        "frequency": "Day",
    	        "interval": 1
    	    }
    	}
	}	

#### Output dataset
In this example, the output data produced by the U-SQL script is stored in an Azure Data Lake Store (datalake/output folder). 

	{
	    "name": "EventsByRegionTable",
	    "properties": {
	        "type": "AzureDataLakeStore",
	        "linkedServiceName": "AzureDataLakeStoreLinkedService",
	        "typeProperties": {
	            "folderPath": "datalake/output/"
	        },
	        "availability": {
	            "frequency": "Day",
	            "interval": 1
	        }
	    }
	}

#### Sample Azure Data Lake Store Linked Service
Here is the definition of the sample Azure Data Lake Store linked service used by the above input/output datasets. 

	{
	    "name": "AzureDataLakeStoreLinkedService",
	    "properties": {
	        "type": "AzureDataLakeStore",
	        "typeProperties": {
	            "dataLakeUri": "https://<accountname>.azuredatalake.net/webhdfs/v1",
				"sessionId": "<session ID>",
	            "authorization": "<authorization URL>"
	        }
	    }
	}

See [Move data to and from Azure Data Lake Store](data-factory-azure-datalake-connector.md) for descriptions of JSON properties in the above Azure Data Lake Store linked service and data set JSON snippets. 
