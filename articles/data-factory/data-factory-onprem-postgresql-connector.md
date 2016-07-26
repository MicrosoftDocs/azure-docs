<properties 
	pageTitle="Move data From PostgreSQL | Azure Data Factory" 
	description="Learn about how to move data from PostgreSQL Database using Azure Data Factory." 
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
	ms.date="07/05/2016" 
	ms.author="spelluru"/>

# Move data from PostgreSQL using Azure Data Factory

This article outlines how you can use the Copy Activity in an Azure data factory to move data from PostgreSQL to another data store. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article which presents a general overview of data movement with copy activity and supported data store combinations.

Data Factory service supports connecting to on-premises PostgreSQL sources using the Data Management Gateway. See [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article to learn about Data Management Gateway and step-by-step instructions on setting up the gateway. 

**Note:** You need to leverage the gateway to connect to PostgreSQL even if it is hosted in Azure IaaS VMs. If you are trying to connect to an instance of PostgreSQL hosted in cloud, you can also install the gateway instance in the IaaS VM.

Data factory only supports moving data from PostgreSQL to other data stores, not from other data stores to PostgreSQL.

## Installation 

For Data Management Gateway to connect to the PostgreSQL Database, you need to install the [Ngpsql data provider for PostgreSQL](http://go.microsoft.com/fwlink/?linkid=282716) on the same system as the Data Management Gateway.

> [AZURE.NOTE] See [Gateway Troubleshooting](data-factory-move-data-between-onprem-and-cloud.md#gateway-troubleshooting) for tips on troubleshooting connection/gateway related issues. 

## Sample: Copy data from PostgreSQL to Azure Blob

This sample shows how to copy data from a PostgreSQL database to an Azure Blob Storage. However, data can be copied **directly** to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores) using the Copy Activity in Azure Data Factory.  
 
The sample has the following data factory entities:

1.	A linked service of type [OnPremisesPostgreSql](data-factory-onprem-postgresql-connector.md#postgresql-linked-service-properties).
2.	A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service-properties).
3.	An input [dataset](data-factory-create-datasets.md) of type [RelationalTable](data-factory-onprem-postgresql-connector.md#postgresql-dataset-type-properties).
4.	An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties).
4.	The [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [RelationalSource](data-factory-onprem-postgresql-connector.md#postgresql-copy-activity-type-properties) and [BlobSink](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties). 

The sample copies data from a query result in PostgreSQL database to a blob every hour. The JSON properties used in these samples are described in sections following the samples. 

As a first step, setup the data management gateway as per the instructions in the [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article.

**PostgreSQL linked service:**

	{
	    "name": "OnPremPostgreSqlLinkedService",
	    "properties": {
	        "type": "OnPremisesPostgreSql",
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
	    "type": "AzureStorage",
	    "typeProperties": {
	      "connectionString": "DefaultEndpointsProtocol=https;AccountName=<AccountName>;AccountKey=<AccountKey>"
	    }
	  }
	}

**PostgreSQL input dataset:**

The sample assumes you have created a table “MyTable” in PostgreSQL and it contains a column called “timestamp” for time series data.

Setting “external”: true and specifying externalData policy tells data factory that this is a table that is external to the data factory and not produced by an activity in the data factory.

	{
	    "name": "PostgreSqlDataSet",
	    "properties": {
	        "type": "RelationalTable",
	        "linkedServiceName": "OnPremPostgreSqlLinkedService",
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

Data is written to a new blob every hour (frequency: hour, interval: 1). The folder path and file name for the blob are dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, day, and hours parts of the start time.

	{
	    "name": "AzureBlobPostgreSqlDataSet",
	    "properties": {
	        "type": "AzureBlob",
	        "linkedServiceName": "AzureStorageLinkedService",
	        "typeProperties": {
	            "folderPath": "mycontainer/postgresql/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}",
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


**Copy activity:**

The pipeline contains a Copy Activity that is configured to use the above input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **RelationalSource** and **sink** type is set to **BlobSink**. The SQL query specified for the **query** property selects the data from the public.usstates table in the PostgreSQL database.
	
	{
	    "name": "CopyPostgreSqlToBlob",
	    "properties": {
	        "description": "pipeline for copy activity",
	        "activities": [
	            {
	                "type": "Copy",
	                "typeProperties": {
	                    "source": {
	                        "type": "RelationalSource",
	                        "query": "select * from \"public\".\"usstates\""
	                    },
	                    "sink": {
	                        "type": "BlobSink"
	                    }
	                },
	                "inputs": [
	                    {
	                        "name": "PostgreSqlDataSet"
	                    }
	                ],
	                "outputs": [
	                    {
	                        "name": "AzureBlobPostgreSqlDataSet"
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
	                "name": "PostgreSqlToBlob"
	            }
	        ],
	        "start": "2014-06-01T18:00:00Z",
	        "end": "2014-06-01T19:00:00Z"
	    }
	}


## PostgreSQL linked service properties

The following table provides description for JSON elements specific to PostgreSQL linked service.

Property | Description | Required
-------- | ----------- | --------
type | The type property must be set to: **OnPremisesPostgreSql** | Yes
server | Name of the PostgreSQL server. | Yes 
database | Name of the PostgreSQL database. | Yes 
schema | Name of the schema in the database. The schema name is case sensitive. | No 
authenticationType | Type of authentication used to connect to the PostgreSQL database. Possible values are: Anonymous, Basic, and Windows. | Yes 
username | Specify user name if you are using Basic or Windows authentication. | No 
password | Specify password for the user account you specified for the username. | No 
gatewayName | Name of the gateway that the Data Factory service should use to connect to the on-premises PostgreSQL database. | Yes 

See [Setting Credentials and Security](data-factory-move-data-between-onprem-and-cloud.md#set-credentials-and-security) for details about setting credentials for an on-premises PostgreSQL data source.

## PostgreSQL dataset type properties

For a full list of sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc...).

The typeProperties section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for dataset of type **RelationalTable** (which includes PostgreSQL dataset) has the following properties.

Property | Description | Required
-------- | ----------- | --------
tableName | Name of the table in the PostgreSQL Database instance that linked service refers to. The tableName is case sensitive. | No (if **query** of **RelationalSource** is specified) 

## PostgreSQL copy activity type properties

For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, various policies etc. are available for all types of activities. 

Properties available in the typeProperties section of the activity on the other hand vary with each activity type and in case of Copy activity they vary depending on the types of sources and sinks.

In case of Copy Activity when source is of type **RelationalSource** (which includes PostgreSQL) the following properties are available in typeProperties section:

Property | Description | Allowed values | Required
-------- | ----------- | -------------- | --------
query | Use the custom query to read data. | SQL query string. For example: "query": "select * from \"MySchema\".\"MyTable\"". | No (if **tableName** of **dataset** is specified)

> [AZURE.NOTE] Schema and table names are case sensitive and they have to enclosed in "" (double quotes) in the query.  

**Example:**

 "query": "select * from \"MySchema\".\"MyTable\""

[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

## Type mapping for PostgreSQL

As mentioned in the [data movement activities](data-factory-data-movement-activities.md) article Copy activity performs automatic type conversions from automatic type conversions from source types to sink types with the following 2 step approach:

1. Convert from native source types to .NET type
1. Convert from .NET type to native sink type

When moving data to PostgreSQL the following mappings will be used from PostgreSQL type to .NET type.

PostgreSQL Database type |	PostgresSQL aliases | .NET Framework type
------------------------ | -------------------- | ---------------------
abstime	|  | Datetime
bigint | int8 | Int64
bigserial | serial8 | Int64
bit [ (n) ] |  | Byte[], String
bit varying [ (n) ]	| varbit | Byte[], String
boolean | bool | Boolean
box |  | Byte[], String
bytea |  | Byte[], String
character [ (n) ] | char [ (n) ] | String
character varying [ (n) ] | varchar [ (n) ] | String
cid |  | String
cidr | | String
circle | | Byte[], String
date | | Datetime
daterange | | String
double precision| float8 | Double
inet | | Byte[], String
intarry | | String
int4range | | String
int8range | | String
integer	| int, int4 | Int32
interval [ fields ] [ (p) ] | | Timespan
json | | String
jsonb | | Byte[]
line | | Byte[], String
lseg | | Byte[], String
macaddr | | Byte[], String
money | | Decimal
numeric [ (p, s) ] | decimal [ (p, s) ] | Decimal
numrange | | String
oid | | Int32
path | | Byte[], String
pg_lsn | | Int64
point | | Byte[], String
polygon | | Byte[], String
real | float4 | Single
smallint | int2 | Int16
smallserial | serial2 | Int16
serial | serial4 | Int32
text | | String


[AZURE.INCLUDE [data-factory-column-mapping](../../includes/data-factory-column-mapping.md)]

[AZURE.INCLUDE [data-factory-type-repeatability-for-relational-sources](../../includes/data-factory-type-repeatability-for-relational-sources.md)]

## Performance and Tuning  
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.