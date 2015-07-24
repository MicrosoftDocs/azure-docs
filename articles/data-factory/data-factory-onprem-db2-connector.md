<properties 
	pageTitle="DB2 Connector - Move Data From DB2" 
	description="Learn about DB2 Connector for the Data Factory service that lets you move data from DB2 Database" 
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
	ms.date="07/24/2015" 
	ms.author="spelluru"/>

# DB2 Connector - Move data from DB2
This article outlines how you can use data factory copy activity to move data to from DB2 to another data store. This article builds on the [data movement activities](data-factory-data-movements.md) article which presents a general overview of data movement with copy activity and supported data store combinations.

Currently data factory supports connecting to on-premises DB2 sources via the Data Management Gateway. Please refer to [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article to learn about Data Management Gateway and step by step instructions on setting up the gateway. 

**Note:** Currently you need to leverage the gateway to connect to DB2 even if it is hosted in Azure IaaS VMs. If you are trying to connect to an instance of DB2 hosted in cloud you can also install the gateway instance in the IaaS VM.

Data factory currently only supports moving data from DB2 to other data stores as for now.

## Installation 

For Data Management Gateway to connect to the DB2 Database, you need to install [IBM DB2 Data Server Driver](http://go.microsoft.com/fwlink/p/?LinkID=274911) on the same system as the Data Management Gateway.

There are known issues reported by IBM installing the IBM DB2 Data Server Driver on Windows 8, where additional installation steps are needed. For more information about the IBM DB2 Data Server Driver on Windows 8, see [http://www-01.ibm.com/support/docview.wss?uid=swg21618434](http://www-01.ibm.com/support/docview.wss?uid=swg21618434).

## Sample: Copy data from DB2 to Azure Blob

The sample below shows:
1.	The linked service of type DB2.
2.	The linked service of type Azure Storage.
3.	The input and output Datasets.
4.	The pipeline with Copy Activity

The sample copies data from a query result in DB2 database to a blob every hour. For more information on various properties used in the sample below please refer to documentation on different properties in the sections following the samples.

As a first step please setup the data management gateway as per the instructions in the [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article.

**DB2 linked service:**

	{
	    "name": "OnPremDb2LinkedService",
	    "properties": {
	        "type": "OnPremisesDb2",
	        "typeProperties": {
	            "server": "<server>",
	            "database": "<database>",
	            "schema": "<schema>",
	            "authenticationType": "<authentication type>",
	            "username": "<username>",
	            "password": "<password>",
	            "gatewayName": "<gatewayName>"
	        }
	    }
	}

**Azure Blob storage linked service:**

	{
	    "name": "AzureStorageLinkedService",
	    "properties": {
	        "type": "AzureStorageLinkedService",
			"typeProperties": {
	        	"connectionString": "DefaultEndpointsProtocol=https;AccountName=<AccountName>;AccountKey=<AccountKey>"
			}
	    }
	}

**DB2 input dataset:**

The sample assumes you have created a table “MyTable” in DB2 and it contains a column called “timestamp” for time series data.

Setting “external”: true and specifying externalData policy tells data factory that this is a table that is external to the data factory and not produced by an activity in the data factory.

	{
	    "name": "Db2DataSet",
	    "properties": {
	        "published": false,
	        "type": "RelationalTable",
	        "linkedServiceName": "OnPremDb2LinkedService",
	        "typeProperties": {
	            "tableName": "MyTable"
	        },
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

Data is copied to a new blob every hour with the path for the blob reflecting the specific datetime with hour granularity.

	{
	  "name": "AzureBlobDb2DataSet",
	  "properties": {
	    "published": false,
	    "type": "AzureBlob",
	    "linkedServiceName": "AzureStorageLinkedService",
	    "typeProperties": {
	      "folderPath": "mycontainer/db2/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}",
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
	            "format": "%HH"
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

**Copy activity:**

Copy activity specifies the input, output dataset and is scheduled for runs every hour. The SQL query specified with query property selects the data in the past hour to copy.

	{
	    "name": "CopyDb2ToBlob",
	    "properties": {
	        "description": "pipeline for copy activity",
	        "activities": [
	            {
	                "type": "Copy",
	                "typeProperties": {
	                    "source": {
	                        "type": "RelationalSource",
	                        "query": "$$Text.Format('select * from MyTable where timestamp >= \\'{0:yyyy-MM-ddTHH:mm:ss}\\' AND timestamp < \\'{1:yyyy-MM-ddTHH:mm:ss}\\'', SliceStart, SliceEnd)"
	                    },
	                    "sink": {
	                        "type": "BlobSink",
	                        "writeBatchSize": 0,
	                        "writeBatchTimeout": "00:00:00"
	                    }
	                },
	                "inputs": [
	                    {
	                        "name": "Db2DataSet"
	                    }
	                ],
	                "outputs": [
	                    {
	                        "name": "AzureBlobDb2DataSet"
	                    }
	                ],
	                "policy": {
	                    "timeout": "01:00:00",
	                    "concurrency": 1
	                },
	                "name": "Db2ToBlob"
	            }
	        ],
	        "start": "2014-06-01T18:00:00Z",
	        "end": "2014-06-01T19:00:00Z",
	        "isPaused": false
	    }
	}

## DB2 Linked Service Properties

The following table provides description for JSON elements specific to DB2 linked service. 

| Property | Description | Required |
| -------- | ----------- | -------- | 
| type | The type property must be set to: **OnPremisesDB2** | Yes |
| server | Name of the DB2 server. | Yes |
| database | Name of the DB2 database. | Yes |
| schema | Name of the schema in the database. | No |
| authenticationType | Type of authentication used to connect to the DB2 database. Possible values are: Anonymous, Basic, and Windows. | Yes |
| username | Specify user name if you are using Basic or Windows authentication. | No |
| password | Specify password for the user account you specified for the username. | No |
| gatewayName | Name of the gateway that the Data Factory service should use to connect to the on-premises DB2 database. | Yes |

## DB2 Dataset Type Properties

For a full list of sections & properties available for defining datasets please refer to the [Creating datasets](data-factory-create-datasets.md) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc...).

The typeProperties section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for dataset of type RelationalTable (which includes DB2 dataset) has the following properties.

| Property | Description | Required |
| -------- | ----------- | -------- | 
| tableName | Name of the table in the DB2 Database instance that linked service refers to. | Yes |

## DB2 Copy Activity Type Properties

For a full list of sections & properties available for defining activities please refer to the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, various policies etc. are available for all types of activities. 

Properties available in the typeProperties section of the activity on the other hand vary with each activity type and in case of Copy activity they vary depending on the types of sources and sinks.

In case of Copy Activity when source is of type **RelationalSource** (which includes DB2) the following properties are available in typeProperties section:


| Property | Description | Allowed values | Required |
| -------- | ----------- | -------- | -------------- |
| query | Use the custom query to read data. | SQL query string. For example: select * from MyTable. | No |

[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

## Type mapping for DB2
As mentioned in the [data movement activities](data-factory-data-movements.md) article Copy activity performs automatic type conversions from automatic type conversions from source types to sink types with the following 2 step approach:

1. Convert from native source types to .NET type
2. Convert from .NET type to native sink type

When moving data to DB2 the following mappings will be used from DB2 type to .NET type.

DB2 Database type | .NET Framework type 
----------------- | ------------------- 
SmallInt | Int16
Integer | Int32
BigInt | Int64
Real | Single
Double | Double
Float | Double
Decimal | Decimal
DecimalFloat | Decimal
Numeric | Decimal
Date | Datetime
Time | TimeSpan
Timestamp | DateTime
Xml | Byte[]
Char | String
VarChar | String
LongVarChar | String
DB2DynArray | String
Binary | Byte[]
VarBinary | Byte[]
LongVarBinary | Byte[]
Graphic | String
VarGraphic | String
LongVarGraphic | String
Clob | String
Blob | Byte[]
DbClob | String
SmallInt | Int16
Integer | Int32
BigInt | Int64
Real | Single
Double | Double
Float | Double
Decimal | Decimal
DecimalFloat | Decimal
Numeric | Decimal
Date | Datetime
Time | TimeSpan
Timestamp | DateTime
Xml | Byte[]
Char | String


[AZURE.INCLUDE [data-factory-data-stores-with-rectangular-tables](../../includes/data-factory-data-stores-with-rectangular-tables.md)]


[AZURE.INCLUDE [data-factory-type-repetability-for-relational-sources](../../includes/data-factory-type-repetability-for-relational-sources.md)]




