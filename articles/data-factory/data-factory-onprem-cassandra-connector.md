<properties 
	pageTitle="Move data from Cassandra using Data Factory | Microsoft Azure" 
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
  
	When you install the gateway, it automatically installs a Microsoft Cassandra ODBC driver used to connect to Cassandra database. 

> [AZURE.NOTE] See [Troubleshoot gateway issues](data-factory-data-management-gateway.md#troubleshoot-gateway-issues) for tips on troubleshooting connection/gateway related issues. 

## Copy data wizard
The easiest way to create a pipeline that copies data from a Cassandra database to any of the supported sink data stores is to use the Copy data wizard. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough on creating a pipeline using the Copy data wizard. 

The following example provides sample JSON definitions that you can use to create a pipeline by using [Azure Portal](data-factory-copy-activity-tutorial-using-azure-portal.md) or [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md).   

## Sample: Copy data from Cassandra to Blob
The sample copies data from a Cassandra database to an Azure blob every hour. The JSON properties used in these samples are described in sections following the samples. Data can be copied directly to any of the sinks stated in the [Data Movement Activities](data-factory-data-movement-activities.md#supported-data-stores) article by using the Copy Activity in Azure Data Factory. 

- A linked service of type [OnPremisesCassandra](#onpremisescassandra-linked-service-properties).
- A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service-properties).
- An input [dataset](data-factory-create-datasets.md) of type [CassandraTable](#cassandratable-properties).
- An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties).
- A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [CassandraSource](#cassandrasource-type-properties) and [BlobSink](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties).

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
				"port": 9042,
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
			"linkedServiceName": "CassandraLinkedService",
			"type": "CassandraTable",
			"typeProperties": {
				"tableName": "mytable",
				"keySpace": "mykeyspace" 
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
						"query": "select id, firstname, lastname from mykeyspace.mytable"
		
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
| query | Use the custom query to read data. | SQL-92 query or CQL query. See [CQL reference](https://docs.datastax.com/en/cql/3.1/cql/cql_reference/cqlReferenceTOC.html). <br/><br/>When using SQL query, specify **keyspace name.table name** to represent the table you want to query. | No (if tableName and keyspace on dataset are defined).  |
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

> [AZURE.NOTE]  
> For collection types (map, set, list, etc...), refer to [Work with Cassandra collection types using virtual table](#work-with-collections-using-virtual-table) section. 
> 
> User-defined types are not supported.
> 
> The length of Binary Column and String Column lengths cannot be greater than 4000. 

## Work with collections using virtual table
Azure Data Factory uses a built-in ODBC driver to connect to and copy data from your Cassandra database. For collection types including map, set and list, the driver will renormalize the data into corresponding virtual tables. Specifically, if a table contains any collection columns, the driver generates the following virtual tables:

-	A **base table**, which contains the same data as the real table except for the collection columns. The base table uses the same name as the real table that it represents.
-	A **virtual table** for each collection column, which expands the nested data. The virtual tables that represent collections are named using the name of the real table, a separator “_vt_” and the name of the column.

Virtual tables refer to the data in the real table, enabling the driver to access the denormalized data. See Example section below for details. You can access the content of Cassandra collections by querying and joining the virtual tables.

You can leverage the [Copy Wizard](data-factory-data-movement-activities.md#data-factory-copy-wizard) to intuitively view the list of tables in Cassandra database including the virtual tables, and preview the data inside. You can also construct a query in the Copy Wizard and validate to see the result.

### Example
For example, “ExampleTable” below is a Cassandra database table that contains an integer primary key column named “pk_int”, a text column named value, a list column, a map column, and a set column (named “StringSet”).

pk_int | Value | List | Map |	StringSet
------ | ----- | ---- | --- | --------
1 | "sample value 1" | ["1", "2", "3"]	| {"S1": "a", "S2": "b"} | {"A", "B", "C"}
3 | "sample value 3" | ["100", "101", "102", "105"] | {"S1": "t"} | {"A", "E"}

The driver would generate multiple virtual tables to represent this single table. The foreign key columns in the virtual tables reference the primary key columns in the real table, and indicate which real table row the virtual table row corresponds to. 

The first virtual table is the base table named “ExampleTable”, shown below. The base table contains the same data as the original database table except for the collections, which are omitted from this table and expanded in other virtual tables.

pk_int | Value
------ | -----
1 | "sample value 1"
3 | "sample value 3"

The following tables show the virtual tables that renormalize the data from the List, Map, and StringSet columns. The columns with names that end with “_index” or “_key” indicate the position of the data within the original list or map. The columns with names that end with “_value” contain the expanded data from the collection.

#### Table “ExampleTable_vt_List”:
pk_int | List_index | List_value
------ | ---------- | ----------
1 | 0 | 1
1 | 1 | 2
1 | 2 | 3
3 | 0 | 100
3 | 1 | 101
3 | 2 | 102
3 | 3 | 103

#### Table “ExampleTable_vt_Map”:
pk_int | Map_key | Map_value
------ | ------- | ---------
1 | S1 | A
1 | S2 | b
3 | S1 | t

#### Table “ExampleTable_vt_StringSet”:
pk_int | StringSet_value
------ | ---------------
1 | A
1 | B
1 | C
3 | A
3 | E





[AZURE.INCLUDE [data-factory-column-mapping](../../includes/data-factory-column-mapping.md)]
[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

## Performance and Tuning  
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.
