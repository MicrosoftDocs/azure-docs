---
title: Copy data from Cassandra
description: Learn how to copy data from Cassandra to supported sink data stores using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
author: jianleishen
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 05/07/2025
ms.author: jianleishen
---
# Copy data from Cassandra using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in an Azure Data Factory or Synapse Analytics pipeline to copy data from a Cassandra database. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!IMPORTANT]
> The Cassandra connector version 2.0 provides improved native Cassandra support. If you are using Cassandra connector version 1.0 in your solution, please [upgrade the Cassandra connector](#upgrade-the-cassandra-connector) before **July 31, 2025**. Refer to this [section](#differences-between-cassandra-version-20-and-version-10) for details on the difference between version 2.0 and version 1.0.

## Supported capabilities

This Cassandra connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources/sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

Specifically, this Cassandra connector supports:

- Cassandra **versions 3.x.x and 4.x.x** for version 2.0. 
- Cassandra **versions 2.x and 3.x** for version 1.0. 
- Copying data using **Basic** or **Anonymous** authentication.

>[!NOTE]
>For activity running on Self-hosted Integration Runtime, Cassandra 3.x is supported since IR version 3.7 and above.

## Prerequisites

[!INCLUDE [data-factory-v2-integration-runtime-requirements](includes/data-factory-v2-integration-runtime-requirements.md)]

The Integration Runtime provides a built-in Cassandra driver, therefore you don't need to manually install any driver when copying data from/to Cassandra.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Cassandra using UI

Use the following steps to create a linked service to Cassandra in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Cassandra and select the Cassandra connector.

   :::image type="content" source="media/connector-cassandra/cassandra-connector.png" alt-text="Screenshot of the Cassandra connector.":::    


1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-cassandra/configure-cassandra-linked-service.png" alt-text="Screenshot of linked service configuration for Cassandra.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to Cassandra connector.

## Linked service properties

The following properties are supported for Cassandra linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type |The type property must be set to: **Cassandra** |Yes |
| version | The version that you specify. | Yes for version 2.0. |
| host |One or more IP addresses or host names of Cassandra servers.<br/>Specify a comma-separated list of IP addresses or host names to connect to all servers concurrently. |Yes |
| port |The TCP port that the Cassandra server uses to listen for client connections. |No (default is 9042) |
| authenticationType | Type of authentication used to connect to the Cassandra database.<br/>Allowed values are: **Basic**, and **Anonymous**. |Yes |
| username |Specify user name for the user account. |Yes, if authenticationType is set to Basic. |
| password |Specify password for the user account. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |Yes, if authenticationType is set to Basic. |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If not specified, it uses the default Azure Integration Runtime. |No |

>[!NOTE]
>Currently connection to Cassandra using TLS is not supported.

**Example: version 2.0**

```json
{
    "name": "CassandraLinkedService",
    "properties": {
        "type": "Cassandra",
        "version": "2.0", 
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

**Example: version 1.0**

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

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Cassandra dataset.

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
        "typeProperties": {
            "keySpace": "<keyspace name>",
            "tableName": "<table name>"
        },
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<Cassandra linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties


For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Cassandra source.

### Cassandra as source

If you use version 2.0 to copy data from Cassandra, set the source type in the copy activity to **CassandraSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **CassandraSource** | Yes |
| query |Use the custom query to read data. CQL query, see [CQL reference](https://docs.datastax.com/en/cql/3.1/cql/cql_reference/cqlReferenceTOC.html). |No (if "tableName" and "keyspace" in dataset are specified). |
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
                "query": "select id, firstname, lastname from mykeyspace.mytable",
                "consistencyLevel": "one"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

If you use version 1.0 to copy data from Cassandra, set the source type in the copy activity to **CassandraSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **CassandraSource** | Yes |
| query |Use the custom query to read data. SQL-92 query or CQL query. See [CQL reference](https://docs.datastax.com/en/cql/3.1/cql/cql_reference/cqlReferenceTOC.html). <br/><br/>When using SQL query, specify **keyspace name.table name** to represent the table you want to query. |No (if "tableName" and "keyspace" in dataset are specified). |
| consistencyLevel |The consistency level specifies how many replicas must respond to a read request before returning data to the client application. Cassandra checks the specified number of replicas for data to satisfy the read request. See [Configuring data consistency](https://docs.datastax.com/en/cassandra/2.1/cassandra/dml/dml_config_consistency_c.html) for details.<br/><br/>Allowed values are: **ONE**, **TWO**, **THREE**, **QUORUM**, **ALL**, **LOCAL_QUORUM**, **EACH_QUORUM**, and **LOCAL_ONE**. |No (default is `ONE`) |

## Data type mapping for Cassandra

When copying data from Cassandra, the following mappings are used from Cassandra data types to interim data types used internally within the service. See [Schema and data type mappings](copy-activity-schema-and-type-mapping.md) to learn about how copy activity maps the source schema and data type to the sink.

| Cassandra data type | Interim service data type (for version 2.0) | Interim service data type (for version 1.0) |
|:--- |:--- |:--- |
| ASCII |String |String |
| BIGINT |Int64 |Int64 |
| BLOB |Byte[] |Byte[] |
| BOOLEAN |Boolean |Boolean |
| DATE | DateTime | DateTime |
| DECIMAL |Decimal |Decimal |
| DOUBLE |Double |Double |
| FLOAT |Single |Single |
| INET |String |String |
| INT |Int32 |Int32 |
| SMALLINT | Short | Int16 |
| TEXT |String |String |
| TIMESTAMP |DateTime |DateTime |
| TIMEUUID |Guid |Guid |
| TINYINT | SByte | Int16 |
| UUID |Guid |Guid |
| VARCHAR |String |String |
| VARINT |Decimal |Decimal |

> [!NOTE]
> For collection types (map, set, list, etc.) under version 1.0, refer to [Work with Cassandra collection types using virtual table when using version 1.0](#work-with-collections-using-virtual-table-when-using-version-10) section.
>
> User-defined types are not supported.
>
> The length of Binary Column and String Column lengths cannot be greater than 4000.
>

## Work with collections when using version 2.0

When using version 2.0 to copy data from your Cassandra database, no virtual tables for collection types are created. You can copy a source table to the sink in its original type in JSON format.

### Example

For example, the following "ExampleTable" is a Cassandra database table that contains an integer primary key column named "pk_int", a text column named value, a list column, a map column, and a set column (named "StringSet").

| pk_int | Value | List | Map | StringSet |
| --- | --- | --- | --- | --- |
| 1 |"sample value 1" |["1", "2", "3"] |{"S1": "a", "S2": "b"} |{"A", "B", "C"} |
| 3 |"sample value 3" |["100", "101", "102", "105"] |{"S1": "t"} |{"A", "E"} |

The data can be directly read from a source table, and the column values are preserved in their original types in JSON format, as illustrated in the following table:

| pk_int | Value | List | Map | StringSet |
| --- | --- | --- | --- | --- |
| 1 |"sample value 1" |["1", "2", "3"] |{"S1": "a", "S2": "b"} |["A", "B", "C"] |
| 3 |"sample value 3" |["100", "101", "102", "105"] |{"S1": "t"} |["A", "E"] |

## Work with collections using virtual table when using version 1.0

The service uses a built-in ODBC driver to connect to and copy data from your Cassandra database. For collection types including map, set and list, the driver renormalizes the data into corresponding virtual tables. Specifically, if a table contains any collection columns, the driver generates the following virtual tables:

* A **base table**, which contains the same data as the real table except for the collection columns. The base table uses the same name as the real table that it represents.
* A **virtual table** for each collection column, which expands the nested data. The virtual tables that represent collections are named using the name of the real table, a separator "*vt*" and the name of the column.

Virtual tables refer to the data in the real table, enabling the driver to access the de-normalized data. See Example section for details. You can access the content of Cassandra collections by querying and joining the virtual tables.

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

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Upgrade the Cassandra connector

Here are steps that help you upgrade the Cassandra connector:

1. In **Edit linked service** page, select version 2.0 and configure the linked service by referring to [Linked service properties](#linked-service-properties).

2. In version 2.0, the `query` in the copy activity source supports only CQL query, not SQL-92 query. For more information, see [Cassandra as source](#cassandra-as-source).

3. The data type mapping for version 2.0 is different from that for version 1.0. To learn the latest data type mapping, see [Data type mapping for Cassandra](#data-type-mapping-for-cassandra). 

## Differences between Cassandra version 2.0 and version 1.0 

The Cassandra connector version 2.0 offers new functionalities and is compatible with most features of version 1.0. The table below shows the feature differences between version 2.0 and version 1.0. 

| Version 2.0 | Version 1.0 |
| --- | --- |
| Support CQL query. | Support SQL-92 query or CQL query. |
| Support specifying `keyspace` and `tableName` separately in dataset. | Support editing `keyspace` when you select enter manually table name in dataset. |
| No virtual tables are created for collection types. For more information, see [Work with collections when using version 2.0](#work-with-collections-when-using-version-20).  | Virtual tables are created for collection types. For more information, see [Work with Cassandra collection types using virtual table when using version 1.0](#work-with-collections-using-virtual-table-when-using-version-10). |
| The following mappings are used from Cassandra data types to interim service data type. <br><br> SMALLINT -> Short <br> TINYINT -> SByte | The following mappings are used from Cassandra data types to interim service data type. <br><br> SMALLINT -> Int16 <br> TINYINT -> Int16 | 

## Related content
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
