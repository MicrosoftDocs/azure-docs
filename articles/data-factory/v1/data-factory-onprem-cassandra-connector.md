---
title: Move data from Cassandra using Data Factory 
description: Learn about how to move data from an on-premises Cassandra database using Azure Data Factory.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: shwang


ms.assetid: 085cc312-42ca-4f43-aa35-535b35a102d5
ms.service: data-factory
ms.workload: data-services


ms.topic: conceptual
ms.date: 06/07/2018
ms.author: jingwang

robots: noindex
---
# Move data from an on-premises Cassandra database using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](data-factory-onprem-cassandra-connector.md)
> * [Version 2 (current version)](../connector-cassandra.md)

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [Cassandra connector in V2](../connector-cassandra.md).

This article explains how to use the Copy Activity in Azure Data Factory to move data from an on-premises Cassandra database. It builds on the [Data Movement Activities](data-factory-data-movement-activities.md) article, which presents a general overview of data movement with the copy activity.

You can copy data from an on-premises Cassandra data store to any supported sink data store. For a list of data stores supported as sinks by the copy activity, see the [Supported data stores](data-factory-data-movement-activities.md#supported-data-stores-and-formats) table. Data factory currently supports only moving data from a Cassandra data store to other data stores, but not for moving data from other data stores to a Cassandra data store.

## Supported versions
The Cassandra connector supports the following versions of Cassandra: 2.x and 3.x. For activity running on Self-hosted Integration Runtime, Cassandra 3.x is supported since IR version 3.7 and above.

## Prerequisites
For the Azure Data Factory service to be able to connect to your on-premises Cassandra database, you must install a Data Management Gateway on the same machine that hosts the database or on a separate machine to avoid competing for resources with the database. Data Management Gateway is a component that connects on-premises data sources to cloud services in a secure and managed way. See [Data Management Gateway](data-factory-data-management-gateway.md) article for details about Data Management Gateway. See [Move data from on-premises to cloud](data-factory-move-data-between-onprem-and-cloud.md) article for step-by-step instructions on setting up the gateway a data pipeline to move data.

You must use the gateway to connect to a Cassandra database even if the database is hosted in the cloud, for example, on an Azure IaaS VM. Y You can have the gateway on the same VM that hosts the database or on a separate VM as long as the gateway can connect to the database.

When you install the gateway, it automatically installs a Microsoft Cassandra ODBC driver used to connect to Cassandra database. Therefore, you don't need to manually install any driver on the gateway machine when copying data from the Cassandra database.

> [!NOTE]
> See [Troubleshoot gateway issues](data-factory-data-management-gateway.md#troubleshooting-gateway-issues) for tips on troubleshooting connection/gateway related issues.

## Getting started
You can create a pipeline with a copy activity that moves data from an on-premises Cassandra data store by using different tools/APIs.

- The easiest way to create a pipeline is to use the **Copy Wizard**. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough on creating a pipeline using the Copy data wizard.
- You can also use the following tools to create a pipeline: **Visual Studio**, **Azure PowerShell**, **Azure Resource Manager template**, **.NET API**, and **REST API**. See [Copy activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for step-by-step instructions to create a pipeline with a copy activity.

Whether you use the tools or APIs, you perform the following steps to create a pipeline that moves data from a source data store to a sink data store:

1. Create **linked services** to link input and output data stores to your data factory.
2. Create **datasets** to represent input and output data for the copy operation.
3. Create a **pipeline** with a copy activity that takes a dataset as an input and a dataset as an output.

When you use the wizard, JSON definitions for these Data Factory entities (linked services, datasets, and the pipeline) are automatically created for you. When you use tools/APIs (except .NET API), you define these Data Factory entities by using the JSON format. For a sample with JSON definitions for Data Factory entities that are used to copy data from an on-premises Cassandra data store, see [JSON example: Copy data from Cassandra to Azure Blob](#json-example-copy-data-from-cassandra-to-azure-blob) section of this article.

The following sections provide details about JSON properties that are used to define Data Factory entities specific to a Cassandra data store:

## Linked service properties
The following table provides description for JSON elements specific to Cassandra linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **OnPremisesCassandra** |Yes |
| host |One or more IP addresses or host names of Cassandra servers.<br/><br/>Specify a comma-separated list of IP addresses or host names to connect to all servers concurrently. |Yes |
| port |The TCP port that the Cassandra server uses to listen for client connections. |No, default value: 9042 |
| authenticationType |Basic, or Anonymous |Yes |
| username |Specify user name for the user account. |Yes, if authenticationType is set to Basic. |
| password |Specify password for the user account. |Yes, if authenticationType is set to Basic. |
| gatewayName |The name of the gateway that is used to connect to the on-premises Cassandra database. |Yes |
| encryptedCredential |Credential encrypted by the gateway. |No |

>[!NOTE]
>Currently connection to Cassandra using TLS is not supported.

## Dataset properties
For a full list of sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections such as structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc.).

The **typeProperties** section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for dataset of type **CassandraTable** has the following properties

| Property | Description | Required |
| --- | --- | --- |
| keyspace |Name of the keyspace or schema in Cassandra database. |Yes (If **query** for **CassandraSource** is not defined). |
| tableName |Name of the table in Cassandra database. |Yes (If **query** for **CassandraSource** is not defined). |

## Copy activity properties
For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties such as name, description, input and output tables, and policy are available for all types of activities.

Whereas, properties available in the typeProperties section of the activity vary with each activity type. For Copy activity, they vary depending on the types of sources and sinks.

When source is of type **CassandraSource**, the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |SQL-92 query or CQL query. See [CQL reference](https://docs.datastax.com/en/cql/3.1/cql/cql_reference/cqlReferenceTOC.html). <br/><br/>When using SQL query, specify **keyspace name.table name** to represent the table you want to query. |No (if tableName and keyspace on dataset are defined). |
| consistencyLevel |The consistency level specifies how many replicas must respond to a read request before returning data to the client application. Cassandra checks the specified number of replicas for data to satisfy the read request. |ONE, TWO, THREE, QUORUM, ALL, LOCAL_QUORUM, EACH_QUORUM, LOCAL_ONE. See [Configuring data consistency](https://docs.datastax.com/en/cassandra/2.1/cassandra/dml/dml_config_consistency_c.html) for details. |No. Default value is ONE. |

## JSON example: Copy data from Cassandra to Azure Blob
This example provides sample JSON definitions that you can use to create a pipeline by using [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md). It shows how to copy data from an on-premises Cassandra database to an Azure Blob Storage. However, data can be copied to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores-and-formats) using the Copy Activity in Azure Data Factory.

> [!IMPORTANT]
> This sample provides JSON snippets. It does not include step-by-step instructions for creating the data factory. See [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article for step-by-step instructions.

The sample has the following data factory entities:

* A linked service of type [OnPremisesCassandra](#linked-service-properties).
* A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#linked-service-properties).
* An input [dataset](data-factory-create-datasets.md) of type [CassandraTable](#dataset-properties).
* An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#dataset-properties).
* A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [CassandraSource](#copy-activity-properties) and [BlobSink](data-factory-azure-blob-connector.md#copy-activity-properties).

**Cassandra linked service:**

This example uses the **Cassandra** linked service. See [Cassandra linked service](#linked-service-properties) section for the properties supported by this linked service.

```json
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
```

**Azure Storage linked service:**

```json
{
    "name": "AzureStorageLinkedService",
    "properties": {
        "type": "AzureStorage",
        "typeProperties": {
            "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
        }
    }
}
```

**Cassandra input dataset:**

```json
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
```

Setting **external** to **true** informs the Data Factory service that the dataset is external to the data factory and is not produced by an activity in the data factory.

**Azure Blob output dataset:**

Data is written to a new blob every hour (frequency: hour, interval: 1).

```json
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
```

**Copy activity in a pipeline with Cassandra source and Blob sink:**

The pipeline contains a Copy Activity that is configured to use the input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **CassandraSource** and **sink** type is set to **BlobSink**.

See [RelationalSource type properties](#copy-activity-properties) for the list of properties supported by the RelationalSource.

```json
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
```

### Type mapping for Cassandra
| Cassandra Type | .NET Based Type |
| --- | --- |
| ASCII |String |
| BIGINT |Int64 |
| BLOB |Byte[] |
| BOOLEAN |Boolean |
| DECIMAL |Decimal |
| DOUBLE |Double |
| FLOAT |Single |
| INET |String |
| INT |Int32 |
| TEXT |String |
| TIMESTAMP |DateTime |
| TIMEUUID |Guid |
| UUID |Guid |
| VARCHAR |String |
| VARINT |Decimal |

> [!NOTE]
> For collection types (map, set, list, etc.), refer to [Work with Cassandra collection types using virtual table](#work-with-collections-using-virtual-table) section.
>
> User-defined types are not supported.
>
> The length of Binary Column and String Column lengths cannot be greater than 4000.
>
>

## Work with collections using virtual table
Azure Data Factory uses a built-in ODBC driver to connect to and copy data from your Cassandra database. For collection types including map, set and list, the driver renormalizes the data into corresponding virtual tables. Specifically, if a table contains any collection columns, the driver generates the following virtual tables:

* A **base table**, which contains the same data as the real table except for the collection columns. The base table uses the same name as the real table that it represents.
* A **virtual table** for each collection column, which expands the nested data. The virtual tables that represent collections are named using the name of the real table, a separator “*vt*” and the name of the column.

Virtual tables refer to the data in the real table, enabling the driver to access the denormalized data. See Example section for details. You can access the content of Cassandra collections by querying and joining the virtual tables.

You can use the [Copy Wizard](data-factory-data-movement-activities.md#create-a-pipeline-with-copy-activity) to intuitively view the list of tables in Cassandra database including the virtual tables, and preview the data inside. You can also construct a query in the Copy Wizard and validate to see the result.

### Example
For example, the following “ExampleTable” is a Cassandra database table that contains an integer primary key column named “pk_int”, a text column named value, a list column, a map column, and a set column (named “StringSet”).

| pk_int | Value | List | Map | StringSet |
| --- | --- | --- | --- | --- |
| 1 |"sample value 1" |["1", "2", "3"] |{"S1": "a", "S2": "b"} |{"A", "B", "C"} |
| 3 |"sample value 3" |["100", "101", "102", "105"] |{"S1": "t"} |{"A", "E"} |

The driver would generate multiple virtual tables to represent this single table. The foreign key columns in the virtual tables reference the primary key columns in the real table, and indicate which real table row the virtual table row corresponds to.

The first virtual table is the base table named “ExampleTable” is shown in the following table. The base table contains the same data as the original database table except for the collections, which are omitted from this table and expanded in other virtual tables.

| pk_int | Value |
| --- | --- |
| 1 |"sample value 1" |
| 3 |"sample value 3" |

The following tables show the virtual tables that renormalize the data from the List, Map, and StringSet columns. The columns with names that end with “_index” or “_key” indicate the position of the data within the original list or map. The columns with names that end with “_value” contain the expanded data from the collection.

#### Table “ExampleTable_vt_List”:
| pk_int | List_index | List_value |
| --- | --- | --- |
| 1 |0 |1 |
| 1 |1 |2 |
| 1 |2 |3 |
| 3 |0 |100 |
| 3 |1 |101 |
| 3 |2 |102 |
| 3 |3 |103 |

#### Table “ExampleTable_vt_Map”:
| pk_int | Map_key | Map_value |
| --- | --- | --- |
| 1 |S1 |A |
| 1 |S2 |b |
| 3 |S1 |t |

#### Table “ExampleTable_vt_StringSet”:
| pk_int | StringSet_value |
| --- | --- |
| 1 |A |
| 1 |B |
| 1 |C |
| 3 |A |
| 3 |E |

## Map source to sink columns
To learn about mapping columns in source dataset to columns in sink dataset, see [Mapping dataset columns in Azure Data Factory](data-factory-map-columns.md).

## Repeatable read from relational sources
When copying data from relational data stores, keep repeatability in mind to avoid unintended outcomes. In Azure Data Factory, you can rerun a slice manually. You can also configure retry policy for a dataset so that a slice is rerun when a failure occurs. When a slice is rerun in either way, you need to make sure that the same data is read no matter how many times a slice is run. See [Repeatable read from relational sources](data-factory-repeatable-copy.md#repeatable-read-from-relational-sources).

## Performance and Tuning
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.
