<properties 
	pageTitle="Move data from Cassandra | Azure Data Factory" 
	description="Learn about how to move data from an on-premises Cassandra database using Azure Data Factory." 
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

# Move data from an on-premises Cassandra database using Azure Data Factory
This article outlines how you can use the Copy Activity in an Azure data factory to copy data from an on-premises Cassandra database to any data store listed under Sink column in the [Supported Sources and Sinks](data-factory-data-movement-activities.md#supported-data-stores) section. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article which presents a general overview of data movement with copy activity and supported data store combinations.

Data factory currently supports only moving data from a Cassandra database to [supported sink data stores](data-factory-data-movement-activities.md#supported-data-stores), but not  moving data from other data stores to a Cassandra database.

## Prerequisites
For the Azure Data Factory service to be able to connect to your on-premises Cassandra database , you must install the following: 

- Data Management Gateway 2.0 or above on the same machine that hosts the database or on a separate machine to avoid competing for resources with the database. Data Management Gateway is a software that connects on-premises data sources to cloud services in a secure and managed way. See [Move data between on-premises and cloud](data-factory-move-data-between-onprem-and-cloud.md) article for details about Data Management Gateway.  

> [AZURE.NOTE] See [Gateway Troubleshooting](data-factory-move-data-between-onprem-and-cloud.md#gateway-troubleshooting) for tips on troubleshooting connection/gateway related issues. 

## Copy data wizard
The easiest way to create a pipeline that copies data from a Cassandra database to any of the supported sink data stores is to use the Copy data wizard. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough on creating a pipeline using the Copy data wizard. 

The following example provides sample JSON definitions that you can use to create a pipeline by using [Azure Portal](data-factory-copy-activity-tutorial-using-azure-portal.md) or [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md).   

## Sample: Copy data from Cassandra to Blob

The sample below shows:
The sample copies data from a Cassandra database to an Azure blob every hour. The JSON properties used in these samples are described in sections following the samples. Data can be copied directly to any of the sinks stated in the [Data Movement Activities](data-factory-data-movement-activities.md#supported-data-stores) article by using the Copy Activity in Azure Data Factory. 

1.	A linked service of type [OnPremisesCassandra](#onpremisescassandra-linked-service-properties).
2.	A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service-properties).
3.	An input [dataset](data-factory-create-datasets.md) of type [CassandraTable](#cassandratable-properties).
4.	An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties).
4.	A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [CassandraSource](#cassandrasource-type-properties) and [BlobSink](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties).

**Cassandra linked service**

This example uses the **Cassandra** linked service. See [Cassandra linked service](#onpremisescassandra-linked-service-properties) section for the properties supported by this linked service.  

	{
    	"name": "CassandraLinkedService",
    	"properties":
    	{
			"type": "OnPremisesCassandra",
			"typeProperties":
			{
				"authenticationType": "Basic",
				"host": "mycassandraserver",
				"port": "9042",
				"username": "user",
				"password": "password",
				"gatewayName": "mygateway"
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

**Cassandra input dataset**

	{
		"name": "CassandraInput",
		"properties": {
			"linkedServiceName": " CassandraLinkedService",
			"type": "CassandraTable",
			"typeProperties": {
				"tableName": "mytable",
				"keySpace": "mykeyspace" 
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

Setting **external**  to **true** informs the Data Factory service that the dataset is external to the data factory and is not produced by an activity in the data factory.

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
				"folderPath": "adfgetstarted/fromcassandra"
			},
			"availability":
			{
				"frequency": "Hour",
				"interval": 1
			}
		}
	}


**Pipeline with Copy activity**

The pipeline contains a Copy Activity that is configured to use the above input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **CassandraSource** and **sink** type is set to **BlobSink**. 

See [RelationalSource type properties](#cassandrasource-type-properties) for the list of properties supported by the RelationalSource. 
	
	{  
		"name":"SamplePipeline",
		"properties":{  
			"start":"2016-06-01T18:00:00",
			"end":"2016-06-01T19:00:00",
			"description":"pipeline with copy activity",
			"activities":[  
			{
				"name": "CassandraToAzureBlob",
				"description": "Copy from Cassandra to an Azure blob",
				"type": "Copy",
				"inputs": [
				{
					"name": "CassandraInput"
				}
				],
				"outputs": [
				{
					"name": "AzureBlobOutput"
				}
				],
				"typeProperties": {
					"source": {
						"type": "CassandraSource",
						"query": "select id, firstname, lastname from mykeyspace.mytable",				
						"consistencyLevel": "TWO" 										
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
## OnPremisesCassandra linked service properties

The following table provides description for JSON elements specific to Cassandra linked service.

| Property | Description | Required |
| -------- | ----------- | -------- | 
| type | The type property must be set to: **OnPremisesCassandra** | Yes |
| host | One or more IP addresses or host names of Cassandra servers.<br/><br/>Specify a comma-separated list of IP addresses or host names to connect to all servers concurrently. | Yes | 
| port | The TCP port that the Cassandra server uses to listen for client connections. | No, default value: 9042 |
| authenticationType | Basic, or Anonymous | Yes |
| username |Specify user name for the user account. | Yes, if authenticationType is set to Basic. |
| password | Specify password for the user account.  | Yes, if authenticationType is set to Basic. |
| gatewayName | The name of the gateway that will be used to connect to the on-premises Cassandra database. | Yes |
| encryptedCredential | Credential encrypted by the gateway. | No | 

## CassandraTable properties

For a full list of sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc...).

The **typeProperties** section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for dataset of type **CassandraTable** has the following properties

| Property | Description | Required |
| -------- | ----------- | -------- |
| keyspace | Name of the keyspace or schema in Cassandra database. | Yes (If **query** for **CassandraSource** is not defined). |
| tableName | Name of the table in Cassandra database. | Yes (If  **query** for **CassandraSource** is not defined). |


## CassandraSource type properties
For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, various policies etc. are available for all types of activities. 

Properties available in the typeProperties section of the activity on the other hand vary with each activity type and in case of Copy activity they vary depending on the types of sources and sinks.

In case of Copy Activity when source is of type **CassandraSource**, the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| query | Use the custom query to read data. | Should be SQL-92 queries expression or CQL operations.<br/><br/>See [CQL reference](https://docs.datastax.com/en/cql/3.1/cql/cql_reference/cqlReferenceTOC.html). | No (if tableName and keyspace on dataset are defined).  |
| consistencyLevel | The consistency level specifies how many replicas must respond to a read request before returning data to the client application. Cassandra checks the specified number of replicas for data to satisfy the read request. | ONE, TWO, THREE, QUORUM, ALL, LOCAL_QUORUM, EACH_QUORUM, LOCAL_ONE. See [Configuring data consistency](http://docs.datastax.com/en//cassandra/2.0/cassandra/dml/dml_config_consistency_c.html) for details. | No. Default value is ONE. |  


### Type mapping for Cassandra
Cassandra Type | .Net Based Type
--------------- | ---------------
ASCII |	String 
BIGINT | Int64
BLOB | Byte[]
BOOLEAN | Boolean
DECIMAL | Decimal
DOUBLE | Double
FLOAT | Single
INET | String
INT | Int32
TEXT | String
TIMESTAMP | DateTime
TIMEUUID | Guid
UUID | Guid
VARCHAR | String
VARINT | Decimal

> [AZURE.NOTE] Cassandra collection types (map, set, list ) and user-defined types are not supported. The length of Binary Column and String Column lengths cannot be greater than 4000. 

[AZURE.INCLUDE [data-factory-column-mapping](../../includes/data-factory-column-mapping.md)]
[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

## Performance and Tuning  
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.
