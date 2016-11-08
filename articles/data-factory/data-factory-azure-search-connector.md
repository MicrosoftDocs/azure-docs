---
title: Push data to Search index by using Data Factory | Microsoft Azure | Microsoft Docs
description: 'Learn about how to push data to Azure Search Index by using Azure Data Factory.'
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: monicar

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/07/2016
ms.author: jingwang
---

# Push data to an Azure Search index by using Azure Data Factory
This article describes how to use the Copy Activity to push data from an on-premises data store supported by the Data Factory service to Azure Search index. Supported source data stores are listed in the Source column of the [supported sources and sinks](data-factory-data-movement-activities.md#supported-data-stores) table. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article, which presents a general overview of data movement with Copy Activity and supported data store combinations.

Azure Data Factory currently supports only moving data to Azure Search from [supported on-premises source data stores](data-factory-data-movement-activities.md#supported-data-stores). It does not support moving data from Azure Search to other data stores.

## Enabling connectivity
To allow Data Factory service connect to an on-premises data store, you install Data Management Gateway in your on-premises environment. You can install gateway on the same machine that hosts the source data store or on a separate machine to avoid competing for resources with the data store. 

Data Management Gateway connects on-premises data sources to cloud services in a secure and managed way. See [Move data between on-premises and cloud](data-factory-move-data-between-onprem-and-cloud.md) article for details about Data Management Gateway. 

## Copy Data wizard
The easiest way to create a pipeline that copies data to Azure Search from any of the supported source data stores is to use the Copy Data wizard. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough.

The following example provides sample JSON definitions that you can use to create a pipeline by using the [Azure portal](data-factory-copy-activity-tutorial-using-azure-portal.md), [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md), or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md). They show how to copy data from an on-premises SQL Server to an Azure Search index. However, data can be copied from any of the on-premises data stores stated [here](data-factory-data-movement-activities.md#supported-data-stores) using the Copy Activity in Azure Data Factory.   

## Sample: Copy data from on-premises SQL Server to Azure Search index

The following sample shows:

1.	A linked service of type [AzureSearch](#azure-search-linked-service-properties).
2.	A linked service of type [OnPremisesSqlServer](data-factory-sqlserver-connector.md#sql-server-linked-service-properties).
3.	An input [dataset](data-factory-create-datasets.md) of type [SqlServerTable](data-factory-sqlserver-connector.md#sql-server-dataset-type-properties).
4.	An output [dataset](data-factory-create-datasets.md) of type [AzureSearchIndex](#azure-search-index-dataset-properties).
4.	A [pipeline](data-factory-create-pipelines.md) with a Copy activity that uses [SqlSource](data-factory-sqlserver-connector.md#sql-server-copy-activity-type-properties) and [AzureSearchIndexSink](#azure-search-index-sink-properties).

The sample copies time-series data from an on-premises SQL Server database to an Azure Search index hourly. The JSON properties used in this sample are described in sections following the samples. 

As a first step, setup the data management gateway on your on-premises machine. The instructions are in the [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article.

**Azure Search linked service:**

	{	
		"name": "AzureSearchLinkedService",
	   	"properties": {
			"type": "AzureSearch",
	   		"typeProperties": {
				"url": "https://<service>.search.windows.net",
            	"key": "<AdminKey>"
			}
	   	}
	}


**SQL Server linked service**

	{
	  "Name": "SqlServerLinkedService",
	  "properties": {
	    "type": "OnPremisesSqlServer",
	    "typeProperties": {
	      "connectionString": "Data Source=<servername>;Initial Catalog=<databasename>;Integrated Security=False;User ID=<username>;Password=<password>;",
	      "gatewayName": "<gatewayname>"
	    }
	  }
	}

**SQL Server input dataset**

The sample assumes you have created a table “MyTable” in SQL Server and it contains a column called “timestampcolumn” for time series data. You can query over multiple tables within the same database using a single dataset, but a single table must be used for the dataset's tableName typeProperty.

Setting “external”: ”true” informs Data Factory service that the dataset is external to the data factory and is not produced by an activity in the data factory.

	{
	  "name": "SqlServerDataset",
	  "properties": {
	    "type": "SqlServerTable",
	    "linkedServiceName": "SqlServerLinkedService",
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

**Azure Search output dataset:**

The sample copies data to an Azure Search index named **products**. Data Factory does not create the index. To test the sample, create an index with this name. Create the Azure Search index with the same number of columns as in the input dataset. New entries are added to the Azure Search index every hour.

	{
		"name": "AzureSearchIndexDataset",
		"properties": {
			"type": "AzureSearchIndex",
			"linkedServiceName": "AzureSearchLinkedService",
         	"typeProperties" : {
				"indexName": "products",
			},
			"availability": {
				"frequency": "Minute",
				"interval": 15
			}
	   }
	}


**Pipeline with a Copy activity:**

The pipeline contains a Copy Activity that is configured to use the input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **SqlSource** and **sink** type is set to **AzureSearchIndexSink**. The SQL query specified for the **SqlReaderQuery** property selects the data in the past hour to copy.

	{  
	    "name":"SamplePipeline",
	    "properties":{  
	    "start":"2014-06-01T18:00:00",
	    "end":"2014-06-01T19:00:00",
	    "description":"pipeline for copy activity",
	    "activities":[  
	      {
	        "name": "SqlServertoAzureSearchIndex",
	        "description": "copy activity",
	        "type": "Copy",
	        "inputs": [
	          {
	            "name": " SqlServerInput"
	          }
	        ],
	        "outputs": [
	          {
	            "name": "AzureSearchIndexDataset"
	          }
	        ],
	        "typeProperties": {
	          "source": {
	            "type": "SqlSource",
	            "SqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd HH:mm}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd HH:mm}\\'', WindowStart, WindowEnd)"
	          },
	          "sink": {
	            "type": "AzureSearchIndexSink"
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



## Azure Search linked service properties

The following table provides descriptions for JSON elements that are specific to the Azure Search linked service.

| Property | Description | Required |
| -------- | ----------- | -------- |
| type | The type property must be set to: **AzureSearch**. | Yes |
| url | URL for the Azure Search service. | Yes |
| key | Admin key for the Azure Search service. | Yes |

## Azure Search Index dataset properties

For a full list of sections and properties that are available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections such as structure, availability, and policy of a dataset JSON are similar for all dataset types. The **typeProperties** section is different for each type of dataset. The typeProperties section for a dataset of the type **AzureSearchIndex** has the following properties:

| Property | Description | Required |
| -------- | ----------- | -------- |
| type | The type property must be set to **AzureSearchIndex**.| Yes |
| indexName | Name of the Azure Search index. Data Factory does not create the index. The index must exist in Azure Search. | Yes |


## Azure Search Index Sink properties
For a full list of sections and properties that are available for defining activities, see the [Creating pipelines](data-factory-create-pipelines.md) article. Properties such as name, description, input and output tables, and various policies are available for all types of activities. The properties that are available in the typeProperties section of the activity, on the other hand, vary with each activity type. For Copy Activity, they vary depending on the types of sources and sinks.

For Copy Activity, when the source is of the type **AzureSearchIndexSink**, the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| WriteBehavior | Specifies whether to merge or replace when a document already exists in the index. See the [WriteBehavior property](#writebehavior-property).| Merge (default)<br/>Upload| No | 
| WriteBatchSize | Uploads data into the Azure Search index when the buffer size reaches writeBatchSize. See the [WriteBatchSize property](#writebatchsize-property) for details. | 1 to 1,000. Default value is 1000. | No |

### WriteBehavior property
AzureSearchSink upserts when writing data. In other words, when writing a document, if the document key already exists in the Azure Search index, Azure Search updates the existing document rather than throwing a conflict exception.

The AzureSearchSink provides the following two upsert behaviors (by using AzureSearch SDK):

- **Merge**: combine all the columns in the new document with the existing one. For columns with null value in the new document, the value in the existing one is preserved.
- **Upload**: The new document replaces the existing one. For columns not specified in the new document, the value is set to null whether there is a non-null value in the existing document or not.

The default behavior is **Merge**.

### WriteBatchSize Property
Azure Search service supports writing documents as a batch. A batch can contain 1 to 1,000 Actions. An action handles one document to perform the upload/merge operation.

### Data type support 
The following table specifies whether an Azure Search data type is supported or not. 

| Azure Search data type | Supported in Azure Search Sink |
| ---------------------- | ------------------------------ |
| String | Y | 
| Int32 | Y |
| Int64 | Y |
| Double | Y |
| Boolean | Y |
| DataTimeOffset | Y | 
| String Array | N | 
| GeographyPoint | N |

## Specifying structure definition for rectangular datasets
The structure section in the datasets JSON is an **optional** section for rectangular tables (with rows & columns) and contains a collection of columns for the table. Use the structure section for either providing type information for type conversions or doing column mappings. The following sections describe these features in detail. 

Each column contains the following properties:

| Property | Description | Required |
| -------- | ----------- | -------- |
| name | Name of the column. | Yes |
| type | Data type of the column. For more information regarding when should you specify type information, see the [type conversions](#type-conversion-sample) section. | No |
| culture | .NET based culture to be used when type is specified and is .NET type `Datetime` or `Datetimeoffset`. Default is `en-us`.  | No |
| format | Format string to be used when type is specified and is .NET type `Datetime` or `Datetimeoffset`. | No |

The following sample shows the structure section JSON for a table that has three columns `userid`, `name`, and `lastlogindate`.

    "structure": 
    [
        { "name": "userid"},
        { "name": "name"},
        { "name": "lastlogindate"}
    ],

Use the following guidelines for when to include “structure” information and what to include in the **structure** section.

- **For structured data sources** that store data schema and type information along with the data itself (example: SQL Server, Oracle, Azure table etc.): specify the “structure” section only if you map specific source columns to specific columns in sink and their names are not the same. See details in the column mapping section. 

	As mentioned earlier, the type information is optional in “structure” section. For structured sources, type information is available as part of dataset definition in the data store, so you should not include type information when you do include the “structure” section.
- **For schema on read data sources (specifically Azure blob)**: you can choose to store data without storing any schema or type information with the data. For these types of data sources, you should include “structure” in the following two cases:
	- You map source columns to sink columns.
	- When the dataset is a source in a Copy activity, you can provide type information in “structure.” Data Factory uses this type information for conversion to native types for the sink. For more information, see [Move data to and from Azure Blob](../articles/data-factory/data-factory-azure-blob-connector.md) article.

### Supported .NET-based types 
Data Factory supports the following CLS-compliant .NET based type values for providing type information in “structure” for schema on read data sources like Azure blob.

- Int16
- Int32 
- Int64
- Single
- Double
- Decimal
- Bool
- String 
- Datetime
- Datetimeoffset
- Timespan 

For Datetime and Datetimeoffset, you can also optionally specify “culture” & “format” string to facilitate parsing of your custom Datetime string. See sample for type conversion in the following section:

[AZURE.INCLUDE [data-factory-type-conversion-sample](../../includes/data-factory-type-conversion-sample.md)]

[AZURE.INCLUDE [data-factory-column-mapping](../../includes/data-factory-column-mapping.md)]


## Performance and tuning  
See the [Copy Activity performance and tuning guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) and various ways to optimize it.