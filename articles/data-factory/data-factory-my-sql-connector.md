<properties 
	pageTitle="MySQL Connector - Move Data From MySQL" 
	description="Learn about MySQL Connector for the Data Factory service that lets you move data from MySQL database" 
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

# MySQL Connector - Move Data From MySQL

This article outlines how you can use data factory copy activity to move data to from MySQL to another data store. This article builds on the [data movement activities](data-factory-data-movements.md) article which presents a general overview of data movement with copy activity and supported data store combinations.

Currently data factory supports connecting to on-premises MySQL sources via the Data Management Gateway. Please refer to [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article to learn about Data Management Gateway and step by step instructions on setting up the gateway. 

Note: Currently you need to leverage the gateway to connect to MySQL even if it is hosted in Azure IaaS VMs. If you are trying to connect to an instance of MySQL hosted in cloud you can also install the gateway instance in the IaaS VM.

Data factory currently only supports moving data from MySQL to other data stores as for now.

## Installation 
For Data Management Gateway to connect to the MySQL Database, you need to install the [MySQL Connector/Net 6.6.5 for Microsoft Windows](http://go.microsoft.com/fwlink/?LinkId=278885) on the same system as the Data Management Gateway.

## Sample: Copy data from MySQL to Azure Blob

The sample below shows:

1.	The linked service of type MySQL.
2.	The linked service of type Azure Storage.
3.	The input and output datasets.
4.	The pipeline with Copy activity.

The sample copies data from a query result in MySQL database to a blob every hour. For more information on various properties used in the sample below please refer to documentation on different properties in the sections following the samples.

As a first step please setup the data management gateway as per the instructions in the [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article. 

### MySQL linked service

	{
	    "name": "OnPremMySqlLinkedService",
	    "properties": {
	        "type": "OnPremisesMySqlLinkedService",
	        "server": "<server name>",
	        "database": "<database name>",
	        "schema": "<schema name>",
	        "authenticationType": "<authentication type>",
	        "userName": "<user name>",
	        "password": "<password>",
	        "gatewayName": "<gateway>"
	    }
	}

### Azure Blob storage linked service

	{
	  "name": "AzureStorageLinkedService",
	  "properties": {
	    "type": "AzureStorage",
	    "typeProperties": {
	      "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
	    }
	  }
	}

### MySQL input dataset

The sample assumes you have created a table “MyTable” in MySQL and it contains a column called “timestampcolumn” for time series data.

Setting “external”: ”true” and specifying externalData policy tells data factory that this is a table that is external to the data factory and not produced by an activity in the data factory.
	
	{
	  "name": "MySqlInput",
	  "properties": {
	    "type": "RelationalTableLocation",
	    "linkedServiceName": "OnPremMySqlLinkedService",
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

### Azure Blob output dataset

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

### Pipeline with Copy activity

Copy activity specifies the input, output dataset and is scheduled for runs every hour. The SQL query specified with query property selects the data in the past hour to copy.

	{  
	    "name":"SamplePipeline",
	    "properties":{  
	    "start":"2014-06-01T18:00:00",
	    "end":"2014-06-01T19:00:00",
	    "description":"pipeline for copy activity",
	    "activities":[  
	      {
	        "name": "MySQLtoBlob",
	        "description": "copy activity",
	        "type": "Copy",
	        "inputs": [
	          {
	            "name": "MySqlInput"
	          }
	        ],
	        "outputs": [
	          {
	            "name": "AzureBlobOutput"
	          }
	        ],
	        "typeProperties": {
	          "source": {
	            "type": "SqlSource",
	            "query": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd}\\'', SliceStart, SliceEnd)"
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

## MySQL Linked Service Properties

The following table provides description for JSON elements specific to MySQL linked service.

| Property | Description | Required |
| -------- | ----------- | -------- | 
| type | The type property must be set to: **OnPremisesMySqlLinkedService** | Yes |
| server | Name of the MySQL server. | Yes |
| database | Name of the MySQL database. | Yes | 
| schema  | Name of the schema in the database. | No | 
| authenticationType | Type of authentication used to connect to the MySQL database. Possible values are: Anonymous, Basic, and Windows. | Yes | 
| username | Specify user name if you are using Basic or Windows authentication. | No | 
| password | Specify password for the user account you specified for the username. | No | 
| gatewayName | Name of the gateway that the Data Factory service should use to connect to the on-premises MySQL database. | Yes |

## MySQL - Dataset Type Properties

For a full list of sections & properties available for defining datasets please refer to the [Creating datasets](data-factory-create-datasets) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc...).

The typeProperties section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for dataset of type **RelationalTableLocation** (which includes MySQL dataset) has the following properties

| Property | Description | Required |
| -------- | ----------- | -------- |
| tableName | Name of the table in the MySQL Database instance that linked service refers to. | Yes | 

## MySQL - Copy Activity Type Properties

For a full list of sections & properties available for defining activities please refer to the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, various policies etc. are available for all types of activities. 

Properties available in the typeProperties section of the activity on the other hand vary with each activity type and in case of Copy activity they vary depending on the types of sources and sinks.

In case of Copy Activity when source is of type **RelationalSource** (which includes MySQL) the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| query | Use the custom query to read data. | SQL query string. For example: select * from MyTable. | Yes | 

[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

## Type Mapping for MySQL

As mentioned in the [data movement activities](data-factory-data-movement-activities.md) article Copy activity performs automatic type conversions from automatic type conversions from source types to sink types with the following 2 step approach:

1. Convert from native source types to .NET type
2. Convert from .NET type to native sink type

When moving data to MySQL the following mappings will be used from MySQL type to .NET type.

| MySQL Database type | .NET Framework type |
| ------------------- | ------------------- | 
| bigint unsigned | Int64 (Decimal)? |
| bigint | Int64 |
| bit | Byte[] (Decimal)? |
| blob | Byte[] |
| bool |  Boolean | 
| char | String |
| date | Datetime |
| datetime | Datetime |
| decimal | Decimal |
| double precision | Double |
| double | Double |
| enum | String |
| float | Double (Single)? |
| int unsigned | Int64 |
| int | Int32 |
| integer unsigned | Int64 |
| integer | Int32 | 
| long varbinary | Byte[] |
| long varchar | String |
| longblob | Byte[] |
| longtext | String | 
| mediumblob | 	Byte[] | 
| mediumint unsigned | Int32 (System.Int64)? |
| mediumint | Int32 | 
| mediumtext | String |
| numeric | Decimal |
| real |  |
| set | String |
| smallint unsigned | Int32 |
| smallint | Int16 |
| text | String |
| time | String (TimeSpan)? |
| timestamp | Datetime |
| tinyblob | Byte[] |
| tinyint unsigned |  Int16 | 
| tinyint | Byte (SByte)? |
| tinytext | String | 
| varchar | String | 
| year | Datetime (Int?) | 
| bigint unsigned | Int64 (Decimal)? |


[AZURE.INCLUDE [data-factory-type-conversion-sample](../../includes/data-factory-type-conversion-sample.md)]


[AZURE.INCLUDE [data-factory-data-stores-with-rectangular-tables](../../includes/data-factory-data-stores-with-rectangular-tables.md)]



