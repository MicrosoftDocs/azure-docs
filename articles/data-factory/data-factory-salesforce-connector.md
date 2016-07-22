<properties
	pageTitle="Move data from Salesforce by using Data Factory | Microsoft Azure"
	description="Learn about how to move data from Salesforce by using Azure Data Factory."
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
	ms.date="07/07/2016"
	ms.author="spelluru"/>

# Move data from Salesforce by using Azure Data Factory
This article outlines how you can use Copy Activity in an Azure data factory to copy data from Salesforce to any data store that is listed under the Sink column in the [supported sources and sinks](data-factory-data-movement-activities.md#supported-data-stores) table. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article, which presents a general overview of data movement with Copy Activity and supported data store combinations.

Azure Data Factory currently supports only moving data from Salesforce to [supported sink data stores]((data-factory-data-movement-activities.md#supported-data-stores), but does not support moving data from other data stores to Salesforce.

## Prerequisites
- You must use one of the following editions of Salesforce: Developer Edition, Professional Edition, Enterprise Edition, or Unlimited Edition.
- API permission must be enabled. See [How do I enable API access in Salesforce by permission set?](https://www.data2crm.com/migration/faqs/enable-api-access-salesforce-permission-set/)
- To copy data from Salesforce to on-premises data stores, you must have at least Data Management Gateway 2.0 installed in your on-premises environment.

## Copy Data wizard
The easiest way to create a pipeline that copies data from Salesforce to any of the supported sink data stores is to use the Copy Data wizard. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough on creating a pipeline by using the Copy Data wizard.

The following example provides sample JSON definitions that you can use to create a pipeline by using the [Azure portal](data-factory-copy-activity-tutorial-using-azure-portal.md), [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md), or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md).   

## Sample: Copy data from Salesforce to an Azure blob
This sample copies data from Salesforce to an Azure blob every hour. The JSON properties that are used in these examples are described in sections after the examples. You can copy data directly to any of the sinks that are listed in the [data movement activities](data-factory-data-movement-activities.md#supported-data-stores) article by using Copy Activity in Azure Data Factory.

- A linked service of the type [Salesforce](#salesforce-linked-service-properties)
- A linked service of the type [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service-properties)
- An input [dataset](data-factory-create-datasets.md) of the type [RelationalTable](#salesforce-dataset-properties)
- An output [dataset](data-factory-create-datasets.md) of the type [AzureBlob](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties)
- A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [RelationalSource](#relationalsource-type-properties) and [BlobSink](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties)

**Salesforce linked service**

This example uses the **Salesforce** linked service. See the [Salesforce linked service](#salesforce-linked-service-properties) section for the properties that are supported by this linked service.  See [Get security token](https://help.salesforce.com/apex/HTViewHelpDoc?id=user_security_token.htm) for instructions on how to reset/get the security token.

	{
		"name": "SalesforceLinkedService",
		"properties":
		{
			"type": "Salesforce",
			"typeProperties":
			{
				"username": "<user name>",
				"password": "<password>",
				"securityToken": "<security token>"
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
		"name": "SalesforceInput",
		"properties": {
			"linkedServiceName": "SalesforceLinkedService",
			"type": "RelationalTable",
			"typeProperties": {
				"tableName": "AllDataType__c"  
			},
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

Setting **external** to **true** informs the Data Factory service that the dataset is external to the data factory and is not produced by an activity in the data factory.

> [AZURE.IMPORTANT] The "__c" part of the API Name is needed for any custom object.

![Data Factory - Salesforce connection - API name](media/data-factory-salesforce-connector/data-factory-salesforce-api-name.png)

**Azure blob output dataset**

Data is written to a new blob every hour (frequency: hour, interval: 1).

	{
	    "name": "AzureBlobOutput",
	    "properties":
	    {
	        "type": "AzureBlob",
	        "linkedServiceName": "AzureStorageLinkedService",
	        "typeProperties":
	        {
	            "folderPath": "adfgetstarted/alltypes_c"
	        },
	        "availability":
	        {
	            "frequency": "Hour",
	            "interval": 1
	        }
	    }
	}


**Pipeline with Copy Activity**

The pipeline contains Copy Activity, which is configured to use the above input and output datasets, and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **RelationalSource**, and the **sink** type is set to **BlobSink**.

See [RelationalSource type properties](#relationalsource-type-properties) for the list of properties that are supported by the RelationalSource.

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
						"query": "SELECT Id, Col_AutoNumber__c, Col_Checkbox__c, Col_Currency__c, Col_Date__c, Col_DateTime__c, Col_Email__c, Col_Number__c, Col_Percent__c, Col_Phone__c, Col_Picklist__c, Col_Picklist_MultiSelect__c, Col_Text__c, Col_Text_Area__c, Col_Text_AreaLong__c, Col_Text_AreaRich__c, Col_URL__c, Col_Text_Encrypt__c, Col_Lookup__c FROM AllDataType__c"				
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

> [AZURE.IMPORTANT] The "__c" part of the API Name is needed for any custom object.

![Data Factory - Salesforce connection - API name](media/data-factory-salesforce-connector/data-factory-salesforce-api-name-2.png)

## Salesforce linked service properties

The following table provides descriptions for JSON elements that are specific to the Salesforce linked service.

| Property | Description | Required |
| -------- | ----------- | -------- |
| type | The type property must be set to: **Salesforce**. | Yes |
| username |Specify a user name for the user account. | Yes |
| password | Specify a password for the user account.  | Yes |
| securityToken | Specify a security token for the user account. See [Get security token](https://help.salesforce.com/apex/HTViewHelpDoc?id=user_security_token.htm) for instructions on how to reset/get a security token. To learn about security tokens in general, see [Security and the API](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_concepts_security.htm).  | Yes |

## Salesforce dataset properties

For a full list of sections and properties that are available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections like the structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, and so on).

The **typeProperties** section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for a dataset of the type **RelationalTable** has the following properties:

| Property | Description | Required |
| -------- | ----------- | -------- |
| tableName | Name of the table in Salesforce. | No (if a **query** of **RelationalSource** is specified) |

> [AZURE.IMPORTANT]  The "__c" part of the API Name is needed for any custom object.

![Data Factory - Salesforce connection - API name](media/data-factory-salesforce-connector/data-factory-salesforce-api-name.png)

## RelationalSource type properties
For a full list of sections and properties that are available for defining activities, see the [Creating pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, and various policies are available for all types of activities.

The properties that are available in the typeProperties section of the activity, on the other hand, vary with each activity type--and in the case of Copy Activity, they vary depending on the types of sources and sinks.

In the case of Copy Activity, when the source is of the type **RelationalSource** (which includes Salesforce), the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| query | Use the custom query to read data. | A SQL-92 query or [Salesforce Object Query Language (SOQL)](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql.htm) query. For example:  select * from MyTable__c. | No (if the **tableName** of the **dataset** is specified) |

> [AZURE.IMPORTANT] The "__c" part of the API Name is needed for any custom object.<br>
When you specify a query that includes the **where** clause on the DateTime column, use SOQL. For example: $$Text.Format('SELECT Id, Type, Name, BillingCity, BillingCountry FROM Account WHERE LastModifiedDate >= {0:yyyy-MM-ddTHH:mm:ssZ} AND LastModifiedDate < {1:yyyy-MM-ddTHH:mm:ssZ}', WindowStart, WindowEnd).

![Data Factory - Salesforce connection - API name](media/data-factory-salesforce-connector/data-factory-salesforce-api-name-2.png)

## Salesforce request limits
Salesforce has limits for both total API requests and concurrent API requests. See the "API Request Limits" section in the [Salesforce Developer Limits](http://resources.docs.salesforce.com/200/20/en-us/sfdc/pdf/salesforce_app_limits_cheatsheet.pdf) article for details.

If the number of concurrent requests exceeds the limit, throttling occurs and you will see random failures. If the total number of requests exceeds the limit, the Salesforce account will be blocked for 24 hours. You might also receive the “REQUEST_LIMIT_EXCEEDED“ error in both scenarios.  


[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

### Type mapping for Salesforce
Salesforce type | .NET-based Type
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

## Performance and tuning  
See the [Copy Activity performance and tuning guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.
