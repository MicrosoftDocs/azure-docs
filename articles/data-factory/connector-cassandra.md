---
title: Copy data from Cassandra using Azure Data Factory | Microsoft Docs
description: Learn how to copy data from Cassandra to supported sink data stores by using a copy activity in an Azure Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 06/07/2018
ms.author: jingwang

---
# Copy data from Cassandra using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-onprem-cassandra-connector.md)
> * [Current version](connector-cassandra.md)

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from a Cassandra database. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities

You can copy data from Cassandra database to any supported sink data store. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this Cassandra connector supports:

- Cassandra **versions 2.x and 3.x**.
- Copying data using **Basic** or **Anonymous** authentication.

>[!NOTE]
>For activity running on Self-hosted Integration Runtime, Cassandra 3.x is supported since IR version 3.7 and above.

## Prerequisites

To copy data from a Cassandra database that is not publicly accessible, you need to set up a Self-hosted Integration Runtime. See [Self-hosted Integration Runtime](create-self-hosted-integration-runtime.md) article to learn details. The Integration Runtime provides a built-in Cassandra driver, therefore you don't need to manually install any driver when copying data from/to Cassandra.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to Cassandra connector.

## Linked service properties

The following properties are supported for Cassandra linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type |The type property must be set to: **Cassandra** |Yes |
| host |One or more IP addresses or host names of Cassandra servers.<br/>Specify a comma-separated list of IP addresses or host names to connect to all servers concurrently. |Yes |
| port |The TCP port that the Cassandra server uses to listen for client connections. |No (default is 9042) |
| authenticationType | Type of authentication used to connect to the Cassandra database.<br/>Allowed values are: **Basic**, and **Anonymous**. |Yes |
| username |Specify user name for the user account. |Yes, if authenticationType is set to Basic. |
| password |Specify password for the user account. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |Yes, if authenticationType is set to Basic. |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Self-hosted Integration Runtime or Azure Integration Runtime (if your data store is publicly accessible). If not specified, it uses the default Azure Integration Runtime. |No |

>[!NOTE]
>Currently connection to Cassandra using SSL is not supported.

**Example:**

```json
{
    "name": "CassandraLinkedService",
    "properties": {
        "type": "Cassandra",
        "typeProperties": {
            "host": "<host>",
            "authenticationType": "Basic",
            "username": "<username>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the datasets article. This section provides a list of properties supported by Cassandra dataset.

To copy data from Cassandra, set the type property of the dataset to **CassandraTable**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **CassandraTable** | Yes |
| keyspace |Name of the keyspace or schema in Cassandra database. |No (if "query" for "CassandraSource" is specified) |
| tableName |Name of the table in Cassandra database. |No (if "query" for "CassandraSource" is specified) |

**Example:**

```json
{
    "name": "CassandraDataset",
    "properties": {
        "type": "CassandraTable",
        "linkedServiceName": {
            "referenceName": "<Cassandra linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "keySpace": "<keyspace name>",
            "tableName": "<table name>"
        }
    }
}
```

## Copy activity properties


For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Cassandra source.

### Cassandra as source

To copy data from Cassandra, set the source type in the copy activity to **CassandraSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **CassandraSource** | Yes |
| query |Use the custom query to read data. SQL-92 query or CQL query. See [CQL reference](https://docs.datastax.com/en/cql/3.1/cql/cql_reference/cqlReferenceTOC.html). <br/><br/>When using SQL query, specify **keyspace name.table name** to represent the table you want to query. |No (if "tableName" and "keyspace" in dataset are specified). |
| consistencyLevel |The consistency level specifies how many replicas must respond to a read request before returning data to the client application. Cassandra checks the specified number of replicas for data to satisfy the read request. See [Configuring data consistency](https://docs.datastax.com/en/cassandra/2.1/cassandra/dml/dml_config_consistency_c.html) for details.<br/><br/>Allowed values are: **ONE**, **TWO**, **THREE**, **QUORUM**, **ALL**, **LOCAL_QUORUM**, **EACH_QUORUM**, and **LOCAL_ONE**. |No (default is `ONE`) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromCassandra",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Cassandra input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "CassandraSource",
                "query": "select id, firstname, lastname from mykeyspace.mytable"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Data type mapping for Cassandra

When copying data from Cassandra, the following mappings are used from Cassandra data types to Azure Data Factory interim data types. See [Schema and data type mappings](copy-activity-schema-and-type-mapping.md) to learn about how copy activity maps the source schema and data type to the sink.

| Cassandra data type | Data factory interim data type |
|:--- |:--- |
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

## Work with collections using virtual table

Azure Data Factory uses a built-in ODBC driver to connect to and copy data from your Cassandra database. For collection types including map, set and list, the driver renormalizes the data into corresponding virtual tables. Specifically, if a table contains any collection columns, the driver generates the following virtual tables:

* A **base table**, which contains the same data as the real table except for the collection columns. The base table uses the same name as the real table that it represents.
* A **virtual table** for each collection column, which expands the nested data. The virtual tables that represent collections are named using the name of the real table, a separator "*vt*" and the name of the column.

Virtual tables refer to the data in the real table, enabling the driver to access the denormalized data. See Example section for details. You can access the content of Cassandra collections by querying and joining the virtual tables.

### Example

For example, the following "ExampleTable" is a Cassandra database table that contains an integer primary key column named "pk_int", a text column named value, a list column, a map column, and a set column (named "StringSet").

| pk_int | Value | List | Map | StringSet |
| --- | --- | --- | --- | --- |
| 1 |"sample value 1" |["1", "2", "3"] |{"S1": "a", "S2": "b"} |{"A", "B", "C"} |
| 3 |"sample value 3" |["100", "101", "102", "105"] |{"S1": "t"} |{"A", "E"} |

The driver would generate multiple virtual tables to represent this single table. The foreign key columns in the virtual tables reference the primary key columns in the real table, and indicate which real table row the virtual table row corresponds to.

The first virtual table is the base table named "ExampleTable" is shown in the following table: 

| pk_int | Value |
| --- | --- |
| 1 |"sample value 1" |
| 3 |"sample value 3" |

The base table contains the same data as the original database table except for the collections, which are omitted from this table and expanded in other virtual tables.

The following tables show the virtual tables that renormalize the data from the List, Map, and StringSet columns. The columns with names that end with "_index" or "_key" indicate the position of the data within the original list or map. The columns with names that end with "_value" contain the expanded data from the collection.

**Table "ExampleTable_vt_List":**

| pk_int | List_index | List_value |
| --- | --- | --- |
| 1 |0 |1 |
| 1 |1 |2 |
| 1 |2 |3 |
| 3 |0 |100 |
| 3 |1 |101 |
| 3 |2 |102 |
| 3 |3 |103 |

**Table "ExampleTable_vt_Map":**

| pk_int | Map_key | Map_value |
| --- | --- | --- |
| 1 |S1 |A |
| 1 |S2 |b |
| 3 |S1 |t |

**Table "ExampleTable_vt_StringSet":**

| pk_int | StringSet_value |
| --- | --- |
| 1 |A |
| 1 |B |
| 1 |C |
| 3 |A |
| 3 |E |

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md##supported-data-stores-and-formats).
