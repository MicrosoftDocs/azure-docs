<properties 
	pageTitle="Move data from Salesforce | Azure Data Factory" 
	description="Learn about how to move data from Salesforce using Azure Data Factory." 
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
	ms.date="06/24/2016" 
	ms.author="spelluru"/>

# Move data from Salesforce using Azure Data Factory
This article outlines how you can use the Copy Activity in an Azure data factory to copy data from Salesforce to any data store listed under Sink column in [Supported Sources and Sinks](data-factory-data-movement-activities.md#supported-data-stores). This article builds on the [data movement activities](data-factory-data-movement-activities.md) article which presents a general overview of data movement with copy activity and supported data store combinations.

Data factory currently supports only moving data from Salesforce to [supported sink data stores]((data-factory-data-movement-activities.md#supported-data-stores), but not  moving data from other data stores to Salesforce.

## Sample: Copy data from Salesforce to Azure Blob

The sample below shows:

1.	A linked service of type [Salesforce](#salesforce-linked-service-properties).
2.	A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service-properties).
3.	An input [dataset](data-factory-create-datasets.md) of type [RelationalTable](#salesforce-dataset-properties).
4.	An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties).
4.	A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [RelationalSource](#salesforce-copy-activity-type-properties) and [BlobSink](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties).

The sample copies data from Salesforce to an Azure blob every hour. The JSON properties used in these samples are described in sections following the samples. Data can be copied directly to any of the sinks stated in the [Data Movement Activities](data-factory-data-movement-activities.md#supported-data-stores) article by using the Copy Activity in Azure Data Factory. 

**Salesforce linked service**

This example uses the **Salesforce** linked service. See [Salesforce linked service](#salesforce-linked-service-properties) section for the properties supported by this linked service. 

	{
		"name": "SalesforceLinkedService",
		"properties":
		{
			"type": "Salesforce",
			"typeProperties":
			{
				"userName": "<user name>",
				"password": "<password>",
				"securityToken": "<security token>",
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

**Salesforce input dataset**

	{
		"name": "SalesforceDataSet",
		"properties": {
			"linkedServiceName": " SalesforceLinkedService ",
			"type": "RelationalTable",
			"typeProperties": {
				"tableName": "customer__c"  
		}
			"availability": {
				"frequency": "Hour",
				"interval": 1
			},
			"external": true,
			"policy": {
				"externalData": {
					"retryInterval": "00:01:00",
					"retryTimeout": "00:10:00",
					"maximumRetry": 3
				}
			}
		}
	}

Setting **external**  to **true** and specifying **externalData** policy (optional) informs the Data Factory service that the dataset is external to the data factory and is not produced by an activity in the data factory.
**Azure Blob output dataset**

Data is written to a new blob every hour (frequency: hour, interval: 1). 

	{
	    "name": "AzureBlobOutput",
	    "properties":
	    {
	        "type": "AzureBlob",
	        "linkedServiceName": "AzureStorageLinkedService",
	        "typeProperties":
	        {
	            "folderPath": "adfgetstarted/employees"
	        },
	        "availability":
	        {
	            "frequency": "Hour",
	            "interval": 1
	        }
	    }
	}




**Pipeline with Copy activity**

The pipeline contains a Copy Activity that is configured to use the above input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **RelationalSource** and **sink** type is set to **BlobSink**. 

See [RelationalSource type properties](#relationalsource-copy-activity-type-properties) for the list of properties supported by the RelationalSource. 
	
	{  
		"name":"SamplePipeline",
		"properties":{  
			"start":"2016-06-01T18:00:00",
			"end":"2016-06-01T19:00:00",
			"description":"pipeline with copy activity",
			"activities":[  
			{
				"name": "SaleforceToAzureBlob",
				"description": "Copy from Salesforce to an Azure blob",
				"type": "Copy",
				"inputs": [
				{
					"name": "SalesforceInput"
				}
				],
				"outputs": [
				{
					"name": "AzureBlobOutput"
				}
				],
				"typeProperties": {
					"source": {
						"type": "RelationalSource",
						"query": "SELECT Id, Col_AutoNumber__c, Col_Checkbox__c, Col_Currency__c, Col_Date__c, Col_DateTime__c, Col_Email__c, Col_Number__c, Col_Percent__c, Col_Phone__c, Col_Picklist__c, Col_Picklist_MultiSelect__c, Col_Text__c, Col_Text_Area__c, Col_Text_AreaLong__c, Col_Text_AreaRich__c, Col_URL__c, Col_Text_Encrypt__c, Col_Lookup__c FROM AllDataType__c",				
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


## Salesforce Linked Service properties

The following table provides description for JSON elements specific to Salesforce linked service.

| Property | Description | Required |
| -------- | ----------- | -------- | 
| type | The type property must be set to: **Salesforce** | Yes | 
| userName |Specify user name for the user account. | Yes |
| password | Specify password for the user account.  | Yes |
| securityToken | Specify security token for the user account. | Yes | 

## Salesforce dataset properties

For a full list of sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc...).

The **typeProperties** section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for dataset of type **RelationalTable** has the following properties

| Property | Description | Required |
| -------- | ----------- | -------- |
| tableName | Name of the table in Salesforce. | No (if **query** of **RelationalSource** is specified) | 

## RelationalSource - Copy Activity type properties
For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, various policies etc. are available for all types of activities. 

Properties available in the typeProperties section of the activity on the other hand vary with each activity type and in case of Copy activity they vary depending on the types of sources and sinks.

In case of Copy Activity when source is of type **RelationalSource** (which includes Salesforce) the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| query | Use the custom query to read data. | SQL query string. For example: select * from MyTable. | No (if **tableName** of **dataset** is specified) | 

[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

### Type mapping for Salesforce
Salesforce Type | .Net Based Type
--------------- | ---------------
Auto Number | String
Checkbox | Boolean
Currency | Double
Date | DateTime
Date/Time | DateTime
Email | String
Id | String
Lookup Relationship | String
Multi-Select Picklist | String
Number | Double
Percent | Double
Phone | String
Picklist | String
Text | String
Text Area | String
Text Area (Long) | String
Text Area (Rich) | String
Text (Encrypted) | String
URL | String

[AZURE.INCLUDE [data-factory-column-mapping](../../includes/data-factory-column-mapping.md)]
[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

## Performance and Tuning  
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.
