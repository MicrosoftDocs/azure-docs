---
title: Copy data from MySQL
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about MySQL connector in Azure Data Factory and Synapse Analytics that lets you copy data from a MySQL database to a data store supported as a sink.
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 05/22/2024
ms.author: jianleishen
---

# Copy data from MySQL using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in Azure Data Factory and Synapse Analytics pipelines to copy data from a MySQL database. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

>[!NOTE]
>To copy data from or to [Azure Database for MySQL](../mysql/overview.md) service, use the specialized [Azure Database for MySQL connector](connector-azure-database-for-mysql.md).

>[!IMPORTANT]
>MySQL connector using the recommended driver version provides improved native MySQL support. If you are using it with the legacy driver version, please [upgrade your driver version](#upgrade-the-mysql-driver-version) before **October 31, 2024**. Refer to this [section](#differences-between-the-recommended-and-the-legacy-driver-version) for details on the difference between the legacy and recommended version. 

## Supported capabilities

This MySQL connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

This connector supports MySQL version 5.5, 5.6, 5.7, 8.0, 8.1 and 8.2 under the recommended new driver version v2 and 5.6, 5.7 and 8.0 for the legacy driver version.

## Prerequisites

[!INCLUDE [data-factory-v2-integration-runtime-requirements](includes/data-factory-v2-integration-runtime-requirements.md)]

The Integration Runtime provides a built-in MySQL driver starting from version 3.7, therefore you don't need to manually install any driver.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to MySQL using UI

Use the following steps to create a linked service to MySQL in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Create a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Create a new linked service with Azure Synapse UI.":::

2. Search for MySQL and select the MySQL connector.

    :::image type="content" source="media/connector-mysql/mysql-connector.png" alt-text="Select the MySQL connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-mysql/configure-mysql-linked-service.png" alt-text="Configure a linked service to MySQL.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to MySQL connector.

## Linked service properties

If you use the recommended driver version，the following properties are supported for MySQL linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **MySql** | Yes |
| driverVersion | The driver version when you select the recommended driver version. The value is v2. | Yes |
| server | The name of your MySQL Server. | Yes |
| port | The port number to connect to the MySQL server. |No|
| database | Your MySQL database name. |Yes|
| username | Your user name.|Yes|
| password | The password for the user name. Mark this field as SecureString to store it securely. Or, you can [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |  
| sslMode | This option specifies whether the driver uses TLS encryption and verification when connecting to MySQL. E.g., `SSLMode=<0/1/2/3/4>`.<br/>Options: DISABLED (0) / PREFERRED (1) **(Default)** / REQUIRED (2) / VERIFY_CA (3) / VERIFY_IDENTITY (4) | Yes |
| useSystemTrustStore | This option specifies whether to use a CA certificate from the system trust store, or from a specified PEM file. E.g. `UseSystemTrustStore=<0/1>`;<br/>Options: Enabled (1) / Disabled (0) **(Default)** | No |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If not specified, it uses the default Azure Integration Runtime. |No |

**Example:**

```json
{
    "name": "MySQLLinkedService",
    "properties": {
        "type": "MySql",
        "typeProperties": {
             "server": "<server>",
             "port": 3306,
             "database": "<database>",
             "username": "<username>",
             "password": {
                "type": "SecureString",
                "value": "<password>"
             },
             "sslmode": <sslmode>,
             "usesystemtruststore": <UseSystemTrustStore>,
             "driverVersion": "v2"
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
    "name": "MySQLLinkedService",
    "properties": {
        "type": "MySql",
        "typeProperties": {
            "server": "<server>",
            "port": 3306,
            "database": "<database>",
            "username": "<username>",
            "sslmode": <sslmode>,
            "usesystemtruststore": <UseSystemTrustStore>,
            "password": { 
                "type": "AzureKeyVaultSecret", 
                "store": { 
                    "referenceName": "<Azure Key Vault linked service name>", 
                    "type": "LinkedServiceReference" 
                }, 
                "secretName": "<secretName>" 
            },
            "driverVersion": "v2"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

If you use the legacy driver version, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **MySql** | Yes |
| connectionString | Specify information needed to connect to the Azure Database for MySQL instance.<br/> You can also put password in Azure Key Vault and pull the `password` configuration out of the connection string. Refer to the following samples and [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) article with more details. | Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If not specified, it uses the default Azure Integration Runtime. | No |

A typical connection string is `Server=<server>;Port=<port>;Database=<database>;UID=<username>;PWD=<password>`. More properties you can set per your case:

| Property | Description | Required |
|:--- |:--- |:--- |
| sslMode | This option specifies whether the driver uses TLS encryption and verification when connecting to MySQL. E.g., `SSLMode=<0/1/2/3/4>`.<br/>Options: DISABLED (0) / PREFERRED (1) **(Default)** / REQUIRED (2) / VERIFY_CA (3) / VERIFY_IDENTITY (4) | Yes |
| SSLCert | The full path and name of a .pem file containing the SSL certificate used for proving the identity of the client. <br/> To specify a private key for encrypting this certificate before sending it to the server, use the `SSLKey` property.| Yes, if using two-way SSL verification. |
| SSLKey | The full path and name of a file containing the private key used for encrypting the client-side certificate during two-way SSL verification.| Yes, if using two-way SSL verification. |
| useSystemTrustStore | This option specifies whether to use a CA certificate from the system trust store, or from a specified PEM file. E.g. `UseSystemTrustStore=<0/1>`;<br/>Options: Enabled (1) / Disabled (0) **(Default)** | No |

**Example:**

```json
{
    "name": "MySQLLinkedService",
    "properties": {
        "type": "MySql",
        "typeProperties": {
            "connectionString": "Server=<server>;Port=<port>;Database=<database>;UID=<username>;PWD=<password>"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by MySQL dataset.

To copy data from MySQL, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **MySqlTable** | Yes |
| tableName | Name of the table in the MySQL database. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "MySQLDataset",
    "properties":
    {
        "type": "MySqlTable",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<MySQL linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

If you were using `RelationalTable` typed dataset, it is still supported as-is, while you are suggested to use the new one going forward.

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by MySQL source.

### MySQL as source

To copy data from MySQL, the following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **MySqlSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM MyTable"`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromMySQL",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<MySQL input dataset name>",
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
                "type": "MySqlSource",
                "query": "SELECT * FROM MyTable"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

If you were using `RelationalSource` typed source, it is still supported as-is, while you are suggested to use the new one going forward.

## Data type mapping for MySQL

When copying data from MySQL, the following mappings are used from MySQL data types to interim data types used by the service internally. See [Schema and data type mappings](copy-activity-schema-and-type-mapping.md) to learn about how copy activity maps the source schema and data type to the sink.

| MySQL data type | Interim service data type | Interim service data type (for the legacy driver version) |
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

## Upgrade the MySQL driver version

Here are steps that help you upgrade your MySQL driver version: 

1. In **Edit linked service** page, select **Recommended** under **Driver version** and configure the linked service by referring to [Linked service properties](connector-mysql.md#linked-service-properties).  

1. The data type mapping for the latest MySQL linked service is different from that for the legacy version. To learn the latest data type mapping, see [Data type mapping for MySQL](connector-mysql.md#data-type-mapping-for-mysql).

1. The latest driver version v2 supports more MySQL versions. For more information, see [Supported capabilities](connector-mysql.md#supported-capabilities).

## Differences between the recommended and the legacy driver version

The table below shows the data type mapping differences between MySQL using the recommended and the legacy driver version.

|MySQL data type |Interim service data type (using the recommended driver version) |Interim service data type (using the legacy driver version)|
|:---|:---|:---|
|bit(1)| UInt64|Boolean|
|bit(M), M>1|UInt64|Byte[]|
|bool|Boolean|Int16|
|JSON|String|Byte[]|

## Related content

For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
