---
title: Copy data from MariaDB
description: Learn how to copy data from MariaDB to supported sink data stores using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
author: jianleishen
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 04/14/2025
ms.author: jianleishen
---

# Copy data from MariaDB using Azure Data Factory or Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in an Azure Data Factory or Synapse Analytics pipeline to copy data from MariaDB. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!IMPORTANT]
> The MariaDB connector version 2.0 provides improved native MariaDB support. If you are using MariaDB connector version 1.0 in your solution, please [upgrade your MariaDB connector](#upgrade-the-mariadb-driver-version) as version 1.0 is at [End of Support stage](connector-deprecation-plan.md). Your pipeline will fail after **September 30, 2025** (Disabled date) if not upgraded. Refer to this [section](#differences-between-the-recommended-and-the-legacy-driver-version) for details on the difference between version 2.0 and version 1.0.

## Supported capabilities

This MariaDB connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

The service provides a built-in driver to enable connectivity, therefore you don't need to manually install any driver using this connector.

This connector currently supports MariaDB of version 10.x, 11.x under the MariaDB connector version 2.0 and 10.0 to 10.5 for version 1.0.

## Prerequisites

[!INCLUDE [data-factory-v2-integration-runtime-requirements](includes/data-factory-v2-integration-runtime-requirements.md)]

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to MariaDB using UI

Use the following steps to create a linked service to MariaDB in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Maria and select the MariaDB connector.

   :::image type="content" source="media/connector-mariadb/mariadb-connector.png" alt-text="Screenshot of the MariaDB connector.":::

1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-mariadb/configure-mariadb-linked-service.png" alt-text="Screenshot of linked service configuration for MariaDB.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to MariaDB connector.

## Linked service properties

If you use version 2.0, the following properties are supported for MariaDB linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **MariaDB** | Yes |
| driverVersion | The driver version when you select version 2.0. The value is v2. | Yes |
| server | The name of your MariaDB Server. | Yes |
| port | The port number to connect to the MariaDB server. | No |
| database | Your MariaDB database name. | Yes |
| username | Your user name. | Yes |
| password | The password for the user name. Mark this field as SecureString to store it securely. Or, you can [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| sslMode | This option specifies whether the driver uses TLS encryption and verification when connecting to MariaDB. E.g., `SSLMode=<0/1/2/3/4>`.<br/>Options: DISABLED (0) / PREFERRED (1) / REQUIRED (2) / VERIFY_CA (3) / VERIFY_IDENTITY (4) **(Default)** | Yes |
| useSystemTrustStore | This option specifies whether to use a CA certificate from the system trust store, or from a specified PEM file. E.g. `UseSystemTrustStore=<0/1>`;<br/>Options: Enabled (1) / Disabled (0) **(Default)** | No |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If not specified, it uses the default Azure Integration Runtime. |No |

> [!NOTE]
> The MariaDB connector version 2.0 defaults to the highest TLS encryption and verification with sslMode=VERIFY_IDENTITY (4). Based on your server’s TLS configuration, please adjust the sslMode as needed.

**Example:**

```json
{
    "name": "MariaDBLinkedService",
    "properties": {
        "type": "MariaDB",
        "typeProperties": {
            "server": "<server>",
            "port": "<port>",
            "database": "<database>",
            "username": "<username>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
            },
            "driverVersion": "v2",
            "sslMode": <sslmode>,
            "useSystemTrustStore": <UseSystemTrustStore>
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
    "name": "MariaDBLinkedService",
    "properties": {
        "type": "MariaDB",
        "typeProperties": {
            "server": "<server>",
            "port": "<port>",
            "database": "<database>",
            "username": "<username>",
            "password": {
                "type": "AzureKeyVaultSecret",
                "store": {
                    "referenceName": "<Azure Key Vault linked service name>",
                    "type": "LinkedServiceReference"
                },
                "secretName": "<secretName>"
            },
            "driverVersion": "v2",
            "sslMode": <sslmode>,
            "useSystemTrustStore": <UseSystemTrustStore>
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

If you use version 1.0, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **MariaDB** | Yes |
| connectionString | An ODBC connection string to connect to MariaDB. <br/>You can also put password in Azure Key Vault and pull the `pwd` configuration out of the connection string. Refer to the following samples and [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) article with more details. | Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If not specified, it uses the default Azure Integration Runtime. |No |

**Example:**

```json
{
    "name": "MariaDBLinkedService",
    "properties": {
        "type": "MariaDB",
        "typeProperties": {
            "connectionString": "Server=<host>;Port=<port>;Database=<database>;UID=<user name>;PWD=<password>"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by MariaDB dataset.

To copy data from MariaDB, set the type property of the dataset to **MariaDBTable**. There is no additional type-specific property in this type of dataset.

**Example**

```json
{
    "name": "MariaDBDataset",
    "properties": {
        "type": "MariaDBTable",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<MariaDB linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by MariaDB source.

### MariaDB as source

To copy data from MariaDB, set the source type in the copy activity to **MariaDBSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **MariaDBSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM MyTable"`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromMariaDB",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<MariaDB input dataset name>",
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
                "type": "MariaDBSource",
                "query": "SELECT * FROM MyTable"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Data type mapping for MariaDB

When copying data from MariaDB, the following mappings are used from MariaDB data types to interim data types used by the service internally. See [Schema and data type mappings](copy-activity-schema-and-type-mapping.md) to learn about how copy activity maps the source schema and data type to the sink.

| MariaDB data type | Interim service data type (for version 2.0) | Interim service data type (for version 1.0) |
|:--- |:--- |:--- |
| `bigint` |`Int64` |`Int64` |
| `bigint unsigned` |`Decimal` |`Decimal` |
| `bit(1)` |`UInt64` |`Boolean` |
| `bit(M), M>1`|`UInt64`|`Byte[]`|
| `blob` |`Byte[]` |`Byte[]` |
| `bool` |`Boolean` <br/>(If TreatTinyAsBoolean=false, it is mapped as `SByte`. TreatTinyAsBoolean is true by default ) |`Int16` |
| `char` |`String` |`String` |
| `date` |`Datetime` |`Datetime` |
| `datetime` |`Datetime` |`Datetime` |
| `decimal` |`Decimal` |`Decimal, String` |
| `double` |`Double` |`Double` |
| `double precision` |`Double` |`Double` |
| `enum` |`String` |`String` |
| `float` |`Single` |`Single` |
| `int` |`Int32` |`Int32` |
| `int unsigned` |`Int64`|`Int64`|
| `integer` |`Int32` |`Int32` |
| `integer unsigned` |`Int64` |`Int64` |
| `JSON` |`String` |-|
| `long varbinary` |`Byte[]` |`Byte[]` |
| `long varchar` |`String` |`String` |
| `longblob` |`Byte[]` |`Byte[]` |
| `longtext` |`String` |`String` |
| `mediumblob` |`Byte[]` |`Byte[]` |
| `mediumint` |`Int32` |`Int32` |
| `mediumint unsigned` |`Int64` |`Int64` |
| `mediumtext` |`String` |`String` |
| `numeric` |`Decimal` |`Decimal` |
| `real` |`Double` |`Double` |
| `set` |`String` |`String` |
| `smallint` |`Int16` |`Int16` |
| `smallint unsigned` |`Int32` |`Int32` |
| `text` |`String` |`String` |
| `time` |`TimeSpan` |`TimeSpan` |
| `timestamp` |`Datetime` |`Datetime` |
| `tinyblob` |`Byte[]` |`Byte[]` |
| `tinyint` |`SByte` |`Int16` |
| `tinyint unsigned` |`Int16` |`Int16` |
| `tinytext` |`String` |`String` |
| `varchar` |`String` |`String` |
| `year` |`Int` |`Int` |

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## <a name="upgrade-the-mariadb-driver-version"></a> Upgrade the MariaDB connector

Here are steps that help you upgrade your MariaDB connector: 

1. In **Edit linked service** page, select **2.0** under **Version** and configure the linked service by referring to [Linked service properties](connector-mariadb.md#linked-service-properties).

1. The data type mapping for version 2.0 is different from that for version 1.0. To learn the version 2.0 data type mapping, see [Data type mapping for MariaDB](connector-mariadb.md#data-type-mapping-for-mariadb).

1. The latest driver version v2 supports more MariaDB versions. For more information, see [Supported capabilities](connector-mariadb.md#supported-capabilities). 

## <a name="differences-between-the-recommended-and-the-legacy-driver-version"></a> Differences between MariaDB version 2.0 and version 1.0

The table below shows the data type mapping differences between MariaDB version 2.0 and version 1.0.

|MariaDB data type |Interim service data type (using version 2.0) |Interim service data type (using version 1.0)|
|:---|:---|:---|
|bit(1)| UInt64|Boolean|
|bit(M), M>1|UInt64|Byte[]|
|bool|Boolean|Int16|
|JSON|String|Byte[]|

## Related content

For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
