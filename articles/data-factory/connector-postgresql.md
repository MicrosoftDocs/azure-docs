---
title: Copy data From PostgreSQL
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy data from PostgreSQL to supported sink data stores by using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 03/07/2024
ms.author: jianleishen
---
# Copy data from PostgreSQL using Azure Data Factory or Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in Azure Data Factory and Synapse Analytics pipelines to copy data from a PostgreSQL database. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

>[!IMPORTANT]
>The new PostgreSQL connector provides improved native PostgreSQL support and better performance. If you are using the legacy PostgreSQL connector in your solution, supported as-is for backward compatibility only, refer to [PostgreSQL connector (legacy)](connector-postgresql-legacy.md) article.

## Supported capabilities

This PostgreSQL connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this PostgreSQL connector supports PostgreSQL **version 7.4 and above**.

## Prerequisites

[!INCLUDE [data-factory-v2-integration-runtime-requirements](includes/data-factory-v2-integration-runtime-requirements.md)]

The Integration Runtime provides a built-in PostgreSQL driver starting from version 3.7, therefore you don't need to manually install any driver.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to PostgreSQL using UI

Use the following steps to create a linked service to PostgreSQL in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Create a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Create a new linked service with Azure Synapse UI.":::

2. Search for Postgre and select the PostgreSQL connector.

    :::image type="content" source="media/connector-postgresql/postgresql-connector.png" alt-text="Select the PostgreSQL connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-postgresql/configure-postgresql-linked-service.png" alt-text="Configure a linked service to PostgreSQL.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to PostgreSQL connector.

## Linked service properties

The following properties are supported for PostgreSQL linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **PostgreSqlV2** | Yes |
| server | Specifies the host name - and optionally port - on which PostgreSQL is running. | Yes |
| port | The TCP port of the PostgreSQL server.| No |
| database | The PostgreSQL database to connect to. | Yes |
| username | The username to connect with. Not required if using IntegratedSecurity. | Yes |
| password | The password to connect with. Not required if using IntegratedSecurity. | Yes |
| sslMode | Controls whether SSL is used, depending on server support. <br/>- **Disable**: SSL is disabled. If the server requires SSL, the connection will fail.<br/>- **Allow**: Prefer non-SSL connections if the server allows them, but allow SSL connections.<br/>- **Prefer**: Prefer SSL connections if the server allows them, but allow connections without SSL.<br/>- **Require**: Fail the connection if the server doesn't support SSL.<br/>- **Verify-ca**: Fail the connection if the server doesn't support SSL. Also verifies server certificate.<br/>- **Verify-full**: Fail the connection if the server doesn't support SSL. Also verifies server certificate with host's name. <br/>Options: Disable (0) / Allow (1) / Prefer (2) **(Default)** / Require (3) / Verify-ca (4) / Verify-full (5) | No |
| authenticationType | Authentication type for connecting to the database. Only supports **Basic**. | Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If not specified, it uses the default Azure Integration Runtime. |No |
| ***Additional connection properties:*** |  |  |
| schema | Sets the schema search path. | No |
| pooling | Whether connection pooling should be used. | No |
| connectionTimeout | The time to wait (in seconds) while trying to establish a connection before terminating the attempt and generating an error. | No |
| commandTimeout | The time to wait (in seconds) while trying to execute a command before terminating the attempt and generating an error. Set to zero for infinity. | No |
| trustServerCertificate | Whether to trust the server certificate without validating it. | No |
| sslCertificate | Location of a client certificate to be sent to the server. | No |
| sslKey | Location of a client key for a client certificate to be sent to the server. | No |
| sslPassword | Password for a key for a client certificate. | No |
| readBufferSize | Determines the size of the internal buffer Npgsql uses when reading. Increasing may improve performance if transferring large values from the database. | No |
| logParameters | When enabled, parameter values are logged when commands are executed. | No |
| timezone | Gets or sets the session timezone. | No |
| encoding | Gets or sets the .NET encoding that will be used to encode/decode PostgreSQL string data. | No |

> [!NOTE]
> In order to have full SSL verification via the ODBC connection when using the Self Hosted Integration Runtime you must use an ODBC type connection instead of the PostgreSQL connector explicitly, and complete the following configuration:
>
> 1. Set up the DSN on any SHIR servers.
> 1. Put the proper certificate for PostgreSQL in C:\Windows\ServiceProfiles\DIAHostService\AppData\Roaming\postgresql\root.crt on the SHIR servers. This is where the ODBC driver looks > for the SSL cert to verify when it connects to the database.
> 1. In your data factory connection, use an ODBC type connection, with your connection string pointing to the DSN you created on your SHIR servers.

**Example:**

```json
{
    "name": "PostgreSqlLinkedService",
    "properties": {
        "type": "PostgreSqlV2",
        "typeProperties": {
            "server": "<server>",
            "port": 5432,
            "database": "<database>",
            "username": "<username>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
            },
            "sslmode": <sslmode>,
            "authenticationType": "Basic"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

**Example: store password in Azure Key Vault**

```json
{
    "name": "PostgreSqlLinkedService",
    "properties": {
        "type": "PostgreSqlV2",
        "typeProperties": {
            "server": "<server>",
            "port": 5432,
            "database": "<database>",
            "username": "<username>",
            "password": {
                "type": "AzureKeyVaultSecret",
                "store": { 
                    "referenceName": "<Azure Key Vault linked service name>",
                    "type": "LinkedServiceReference"
                },
                "secretName": "<secretName>"
            }
            "sslmode": <sslmode>,
            "authenticationType": "Basic"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by PostgreSQL dataset.

To copy data from PostgreSQL, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **PostgreSqlV2Table** | Yes |
| schema | Name of the schema. |No (if "query" in activity source is specified)  |
| table | Name of the table. |No (if "query" in activity source is specified)  |

**Example**

```json
{
    "name": "PostgreSQLDataset",
    "properties":
    {
        "type": "PostgreSqlV2Table",
        "linkedServiceName": {
            "referenceName": "<PostgreSQL linked service name>",
            "type": "LinkedServiceReference"
        },
        "annotations": [],
        "schema": [],
        "typeProperties": {
            "schema": "<schema name>",
            "table": "<table name>"
        }
    }
}
```

If you were using `RelationalTable` typed dataset, it's still supported as-is, while you are suggested to use the new one going forward.

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by PostgreSQL source.

### PostgreSQL as source

To copy data from PostgreSQL, the following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **PostgreSqlV2Source** | Yes |
| query | Use the custom SQL query to read data. For example: `"query": "SELECT * FROM \"MySchema\".\"MyTable\""`. | No (if "tableName" in dataset is specified) |

> [!NOTE]
> Schema and table names are case-sensitive. Enclose them in `""` (double quotes) in the query.

**Example:**

```json
"activities":[
    {
        "name": "CopyFromPostgreSQL",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<PostgreSQL input dataset name>",
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
                "type": "PostgreSqlV2Source",
                "query": "SELECT * FROM \"MySchema\".\"MyTable\""
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

If you were using `RelationalSource` typed source, it is still supported as-is, while you are suggested to use the new one going forward.

## Data type mapping for PostgreSQL

When copying data from PostgreSQL, the following mappings are used from PostgreSQL data types to interim data types used by the service internally. See [Schema and data type mappings](copy-activity-schema-and-type-mapping.md) to learn about how copy activity maps the source schema and data type to the sink.

|PostgreSql data type | Interim service data type | Interim service data type (for the legacy driver version) |
|:---|:---|:---|
|`SmallInt`|`Int16`|`Int16`|
|`Integer`|`Int32`|`Int32`|
|`BigInt`|`Int64`|`Int64`|
|`Decimal` (Precision <= 28)|`Decimal`|`Decimal`|
|`Decimal` (Precision > 28)|Unsupport |`String`|
|`Numeric`|`Decimal`|`Decimal`|
|`Real`|`Single`|`Single`|
|`Double`|`Double`|`Double`|
|`SmallSerial`|`Int16`|`Int16`|
|`Serial`|`Int32`|`Int32`|
|`BigSerial`|`Int64`|`Int64`|
|`Money`|`Decimal`|`String`|
|`Char`|`String`|`String`|
|`Varchar`|`String`|`String`|
|`Text`|`String`|`String`|
|`Bytea`|`Byte[]`|`Byte[]`|
|`Timestamp`|`DateTime`|`DateTime`|
|`Timestamp with time zone`|`DateTime`|`String`|
|`Date`|`DateTime`|`DateTime`|
|`Time`|`TimeSpan`|`TimeSpan`|
|`Time with time zone`|`DateTimeOffset`|`String`|
|`Interval`|`TimeSpan`|`String`|
|`Boolean`|`Boolean`|`Boolean`|
|`Point`|`String`|`String`|
|`Line`|`String`|`String`|
|`Iseg`|`String`|`String`|
|`Box`|`String`|`String`|
|`Path`|`String`|`String`|
|`Polygon`|`String`|`String`|
|`Circle`|`String`|`String`|
|`Cidr`|`String`|`String`|
|`Inet`|`String`|`String`|
|`Macaddr`|`String`|`String`|
|`Macaddr8`|`String`|`String`|
|`Tsvector`|`String`|`String`|
|`Tsquery`|`String`|`String`|
|`UUID`|`Guid`|`Guid`|
|`Json`|`String`|`String`|
|`Jsonb`|`String`|`String`|
|`Array`|`String`|`String`|
|`Bit`|`Byte[]`|`Byte[]`|
|`Bit varying`|`Byte[]`|`Byte[]`|
|`XML`|`String`|`String`|
|`IntArray`|`String`|`String`|
|`TextArray`|`String`|`String`|
|`NumbericArray`|`String`|`String`|
|`DateArray`|`String`|`String`|
|`Range`|`String`|`String`|
|`Bpchar`|`String`|`String`|

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Upgrade the PostgreSQL linked service

Here are steps that help you upgrade your PostgreSQL linked service:

1. Create a new PostgreSQL linked service and configure it by referring to [Linked service properties](#linked-service-properties).

1. The data type mapping for the latest PostgreSQL linked service is different from that for the legacy version. To learn the latest data type mapping, see [Data type mapping for PostgreSQL](#data-type-mapping-for-postgresql).

## Related content
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
