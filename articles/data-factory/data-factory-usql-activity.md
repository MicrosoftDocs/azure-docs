<properties 
	pageTitle="Invoke U-SQL script from Azure Data Factory" 
	description="Learn how to process data by running U-SQL scripts on Azure Data Lake Analytics compute." 
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
	ms.date="09/28/2015" 
	ms.author="spelluru"/>

# Invoke U-SQL script from Data Factory
This article describes how to run a **U-SQL** script on an Azure Data Lake Analytics compute from an Azure Data Factory pipeline by using the **U-SQL Activity**. 

## Introduction 
A pipeline in an Azure data factory processes data in linked storage services by using linked compute services. It contains a sequence of activities where each activity performs a specific processing operation. This article describes using the U-SQL Activity.

## Azure Data Lake Analytics Linked Service
You create an Azure Data Lake Analytics linked service to link an Azure Data Lake Analytics compute service to an Azure data factory.

### Example

	{
	    "name": "AzureDataLakeAnalyticsLinkedService",
	    "properties": {
	        "type": "AzureBigAnalytics",
	        "typeProperties": {
	            "accountName": "adftestaccount",
	            "bigAnalyticsUri": "datalakeanalyticscompute.net",
	            "authorization": "<authcode>",
				"sessionId": "<session ID> 
	            "subscriptionId": "<subscription id>",
	            "resourceGroupName": "<resource group name>"
	        }
	    }
	}


### Properties

Property | Description | Required
-------- | ----------- | --------
Type | The type property should be set to: **AzureBigAnalytics**. | Yes
accountName | Azure Big Analytics Account Name. | Yes
bigAnalyticsUri | Azure Big Analytics URI. Enter ‘datalakeanalyticscompute.net’. |  No 
authorization | Authorization code is automatically retrieved after clicking ‘Authorize’ and completing the OAuth login. | Yes 
subscriptionId | Azure subscription id | No (If not specified, subscription of the data factory is used). 
resourceGroupName | Azure resource group name |  No (If not specified, resource group of the data factory is used).
sessionId | OAuth session id from the oauth authorization session. Each session id is unique and may only be used once. | Yes   
 
## JSON for U-SQL Activity 

The following JSON snippet defines a pipeline with a U-SQL Activity.  
 
 

		{
		    "name": "ComputeEventsByRegionPipeline",
		    "properties": {
		        "description": "This is a pipeline to compute events by region.",
		        "activities": [
		            {
		                "type": "BigAnalyticsU-SQL",
		                "typeProperties": {
		                    "scriptPath": "scripts/biganalytics/LogProcessing.txt",
		                    "scriptLinkedService": "StorageLinkedService",
		                    "degreeOfParallelism": 3,
		                    "priority": 100,
		                    "parameters": {
		                        "in": "$$Text.Format('/datalake/input/yearno={0:yyyy}/monthno={0:MM}/dayno={0:dd}/SearchLog.tsv', SliceStart)",
		                        "out": "$$Text.Format('/datalake/output/yearno={0:yyyy}/monthno={0:MM}/dayno={0:dd}/result.tsv', SliceStart)"
		                    }
		                },
		                "inputs": [
		                    {
		                        "name": "DataLakeTable"
		                    },
		                    {
		                        "name": "DummyBlobDemoTable"
		                    }
		                ],
		                "outputs": [
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
		                "linkedServiceName": "BigAnalyticsLinkedService"
		            }
		        ],
		        "start": "2015-08-08T00:00:00Z",
		        "end": "2015-08-08T01:00:00Z",
		        "isPaused": false
		    }
		}

The following table describes names and descriptions of properties that are specific to this activity. 

Property | Description
-------- | -----------
type | The type property must be set to **BigAnalyticsU-SQL**.
scriptPath | Path to folder that contains the U-SQL script. 
scriptLinkedService | Linked service that links the storage that contains the script to the data factory
degreeOfParallelism | The maximum number of nodes that will be used simultaneously to run the job.
priority | Determines which jobs out of all that are queued should be selected to run first. The lower the number, the higher the priority.


