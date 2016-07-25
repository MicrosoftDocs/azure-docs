<properties 
	pageTitle="Move data from DB2 | Azure Data Factory" 
	description="Learn about how move data from DB2 Database using Azure Data Factory" 
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
	ms.date="06/16/2016" 
	ms.author="spelluru"/>

# Move data from DB2 using Azure Data Factory
This article outlines how you can use the Copy Activity in an Azure data factory to move data to from DB2 to another data store. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article which presents a general overview of data movement with copy activity and supported data store combinations.

Data factory supports connecting to on-premises DB2 sources using the Data Management Gateway. See [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article to learn about Data Management Gateway and step-by-step instructions on setting up the gateway. 

**Note:** You need to leverage the gateway to connect to DB2 even if it is hosted in Azure IaaS VMs. If you are trying to connect to an instance of DB2 hosted in cloud you can also install the gateway instance in the IaaS VM.

Data factory currently supports only moving data from DB2 to other data stores, not from other data stores to DB2. 

> [AZURE.NOTE] This DB2 connector currently support DB2 for LUW (Linux, UNIX, Windows). To copy data from DB2 for z/OS or DB2 for AS/400, consider to use generic ODBC connector and install the corresponding ODBC driver on the gateway machine. For example, to ingest data from DB2 for AS/400, you can use iSeries Access ODBC Driver and refer to [ODBC data sources on-premises/Azure IaaS](data-factory-odbc-connector.md) to set up the copy activity.

## Installation 

For Data Management Gateway to connect to the DB2 Database, you need to install [IBM DB2 Data Server Driver](http://go.microsoft.com/fwlink/p/?LinkID=274911) on the same system as the Data Management Gateway.

There are known issues reported by IBM on installing the IBM DB2 Data Server Driver on Windows 8, where additional installation steps are needed. For more information about the IBM DB2 Data Server Driver on Windows 8, see [http://www-01.ibm.com/support/docview.wss?uid=swg21618434](http://www-01.ibm.com/support/docview.wss?uid=swg21618434).

> [AZURE.NOTE] See [Gateway Troubleshooting](data-factory-move-data-between-onprem-and-cloud.md#gateway-troubleshooting) for tips on troubleshooting connection/gateway related issues. 


## Sample: Copy data from DB2 to Azure Blob

This sample shows how to copy data from an on-premises DB2 database to an Azure Blob Storage. However, data can be copied **directly** to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores) using the Copy Activity in Azure Data Factory.  
 
The sample has the following data factory entities:

1.	A linked service of type [OnPremisesDb2](data-factory-onprem-db2-connector.md#db2-linked-service-properties).
2.	A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service-properties). 
3.	An input [dataset](data-factory-create-datasets.md) of type [RelationalTable](data-factory-onprem-db2-connector.md#db2-dataset-type-properties).
4.	An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties). 
5.	A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [RelationalSource](data-factory-onprem-db2-connector.md#db2-copy-activity-type-properties) and [BlobSink](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties). 

The sample copies data from a query result in DB2 database to a blob every hour. The JSON properties used in these samples are described in sections following the samples. 

As a first step, please setup the data management gateway as per the instructions in the [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article.

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

Setting “external”: true and specifying externalData policy tells data factory that this is a table that is external to the data factory and not produced by an activity in the data factory. Note that the **type** is set to **RelationalTable**. 

	{
	    "name": "Db2DataSet",
	    "properties": {
	        "type": "RelationalTable",
	        "linkedServiceName": "OnPremDb2LinkedService",
	        "typeProperties": {},
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


**Azure Blob output dataset:**

Data is written to a new blob every hour (frequency: hour, interval: 1). The folder path for the blob is dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, day, and hours parts of the start time.

	{
	    "name": "AzureBlobDb2DataSet",
	    "properties": {
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

**Pipeline with Copy activity:**

The pipeline contains a Copy Activity that is configured to use the above input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **RelationalSource** and **sink** type is set to **BlobSink**. The SQL query specified for the **query** property selects the data from the Orders table.

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
	                        "query": "select * from \"Orders\""
	                    },
	                    "sink": {
	                        "type": "BlobSink"
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
	                "scheduler": {
	                    "frequency": "Hour",
	                    "interval": 1
	                },
	                "name": "Db2ToBlob"
	            }
	        ],
	        "start": "2014-06-01T18:00:00Z",
	        "end": "2014-06-01T19:00:00Z"
	    }
	}


## DB2 linked service properties

The following table provides description for JSON elements specific to DB2 linked service. 

| Property | Description | Required |
| -------- | ----------- | -------- | 
| type | The type property must be set to: **OnPremisesDB2** | Yes |
| server | Name of the DB2 server. | Yes |
| database | Name of the DB2 database. | Yes |
| schema | Name of the schema in the database. The schema name is case sensitive. | No |
| authenticationType | Type of authentication used to connect to the DB2 database. Possible values are: Anonymous, Basic, and Windows. | Yes |
| username | Specify user name if you are using Basic or Windows authentication. | No |
| password | Specify password for the user account you specified for the username. | No |
| gatewayName | Name of the gateway that the Data Factory service should use to connect to the on-premises DB2 database. | Yes |

See [Setting Credentials and Security](data-factory-move-data-between-onprem-and-cloud.md#set-credentials-and-security) for details about setting credentials for an on-premises DB2 data source. 


## DB2 dataset type properties

For a full list of sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc...).

The typeProperties section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for dataset of type RelationalTable (which includes DB2 dataset) has the following properties.

| Property | Description | Required |
| -------- | ----------- | -------- | 
| tableName | Name of the table in the DB2 Database instance that linked service refers to. The tableName is case sensitive. | No (if **query** of **RelationalSource** is specified) |

## DB2 copy activity type properties

For a full list of sections & properties available for defining activities please see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, various policies etc. are available for all types of activities. 

Properties available in the typeProperties section of the activity on the other hand vary with each activity type and in case of Copy activity they vary depending on the types of sources and sinks.

In case of Copy Activity when source is of type **RelationalSource** (which includes DB2) the following properties are available in typeProperties section:


| Property | Description | Allowed values | Required |
| -------- | ----------- | -------- | -------------- |
| query | Use the custom query to read data. | SQL query string. For example: "query": "select * from \"MySchema\".\"MyTable\"". | No (if **tableName** of **dataset** is specified)|

> [AZURE.NOTE] Schema and table names are case sensitive and they have to enclosed in "" (double quotes) in the query.  

**Example:**

 "query": "select * from \"DB2ADMIN\".\"Customers\""


[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

## Type mapping for DB2
As mentioned in the [data movement activities](data-factory-data-movement-activities.md) article, the  Copy activity performs automatic type conversions from automatic type conversions from source types to sink types with the following 2 step approach:

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


[AZURE.INCLUDE [data-factory-column-mapping](../../includes/data-factory-column-mapping.md)]


[AZURE.INCLUDE [data-factory-type-repeatability-for-relational-sources](../../includes/data-factory-type-repeatability-for-relational-sources.md)]

## Performance and Tuning  
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.


