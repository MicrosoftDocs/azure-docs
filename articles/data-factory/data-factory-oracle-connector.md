<properties 
	pageTitle="Oracle Connector - Move data to and from Oracle" 
	description="Learn about Oracle Connector for the Data Factory service that lets you move data to/from Oracle database that is on-premises." 
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
	ms.date="07/23/2015" 
	ms.author="spelluru"/>

# Oracle Connector - Move data to on-premises Oracle 

This article outlines how you can use data factory copy activity to move data from Oracle to another data store. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article which presents a general overview of data movement with copy activity and supported data store combinations.

## Sample: Copy data from Oracle to Azure Blob

The sample below shows:

1.	A linked service of type OnPremisesOracle
2.	A linked service of type AzureStorage.
3.	An input dataset of type OracleTable. 
4.	An output dataset of type AzureBlob.
5.	A pipeline with Copy activity that uses OracleSource as source and BlobSink as sink.

The sample copies data from a table in an on-premises Oracle database to a blob every hour. For more information on various properties used in the sample below please refer to documentation on different properties in the sections following the samples.

**Oracle linked service:**

	{
	  "name": "OnPremisesOracleLinkedService",
	  "properties": {
	    "type": "OnPremisesOracle",
	    "typeProperties": {
	      "ConnectionString": "data source=<data source>;User Id=<User Id>;Password=<Password>;",
	      "gatewayName": "<gateway name>"
	    }
	  }
	}

**Azure Blob storage linked service:**

	{
	  "name": "StorageLinkedService",
	  "properties": {
	    "type": "AzureStorage",
	    "typeProperties": {
	      "connectionString": "DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<Account key>"
	    }
	  }
	}

**Oracle input dataset:**

The sample assumes you have created a table “MyTable” in Oracle and it contains a column called “timestampcolumn” for time series data. 

Setting “external”: ”true” and specifying externalData policy tells data factory that this is a table that is external to the data factory and not produced by an activity in the data factory.

	{
	    "name": "OracleInput",
	    "properties": {
	        "type": "OracleTable",
	        "linkedServiceName": "OnPremisesOracleLinkedService",
	        "typeProperties": {
	            "tableName": "MyTable"
	        },
	        "availability": {
	            "offset": "01:00:00",
	            "interval": "1",
	            "anchorDateTime": "2014-02-27T12:00:00",
	            "frequency": "Hour"
	        }
	    }
	}

**Azure Blob output dataset:**

Data is copied to a new blob every hour with the path for the blob reflecting the specific datetime with hour granularity.
	
	{
	  "name": "AzureBlobOutput",
	  "properties": {
	    "type": "AzureBlob",
	    "linkedServiceName": "StorageLinkedService",
	    "typeProperties": {
	      "folderPath": "MyContainer/MyFolder/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}",
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
	            "format": "%HH"
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


**Pipeline with Copy activity:**

Copy activity specifies the input, output dataset and is scheduled for runs every hour. The SQL query specified with OracleReaderQuery property selects the data in the past hour to copy.

	
	{  
	    "name":"SamplePipeline",
	    "properties":{  
	    "start":"2014-06-01T18:00:00",
	    "end":"2014-06-01T19:00:00",
	    "description":"pipeline for copy activity",
	    "activities":[  
	      {
	        "name": "AzureSQLtoBlob",
	        "description": "copy activity",
	        "type": "Copy",
	        "inputs": [
	          {
	            "name": " OracleInput"
	          }
	        ],
	        "outputs": [
	          {
	            "name": "AzureBlobOutput"
	          }
	        ],
	        "typeProperties": {
	          "source": {
	            "type": "OracleSource",
	            "oracleReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd-HH\\' AND timestampcolumn < \\'{1:yyyy-MM-dd-HH\\'', SliceStart, SliceEnd)"
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

## Oracle Linked Service properties

The following table provides description for JSON elements specific to Oracle linked service. 

Property | Description | Required
-------- | ----------- | --------
type | The type property must be set to: **OnPremisesOracle** | Yes
connectionString | Specify information needed to connect to the Oracle Database instance for the connectionString property. | Yes 
gatewayName | Name of the gateway that will be used to connect to the onpremises Oracle server | Yes

## Oracle Dataset type properties

For a full list of sections & properties available for defining datasets please refer to the [Creating datasets](data-factory-create-datasets.md) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (Oracle, Azure blob, Azure table, etc...).
 
The typeProperties section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for the dataset of type OracleTable has the following properties.

Property | Description | Required
-------- | ----------- | --------
tableName | Name of the table in the Oracle Database that the linked service refers to. | Yes

## Oracle Source/Sink type properties in Copy Activity

For a full list of sections & properties available for defining activities please refer to the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, various policies etc are available for all types of activities. 

**Note:** The Copy Activity takes only one input and produces only one output.

Properties available in the typeProperties section of the activity on the other hand vary with each activity type and in case of Copy activity they vary depending on the types of sources and sinks.

In case of Copy activity when source is of type SqlSource the following properties are available in typeProperties section:

Property | Description |Allowed values | Required
-------- | ----------- | ------------- | --------
oracleReaderQuery | Use the custom query to read data. | SQL query string. 
For example: select * from MyTable <p>If not specified, the SQL statement that is executed: select * from MyTable</p> | No



