---
title: Copy and transform data in Azure Database for PostgreSQL
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy and transform data in Azure Database for PostgreSQL using Azure Data Factory and Synapse Analytics.
ms.author: jianleishen
author: jianleishen
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 04/29/2025
---

# Copy and transform data in Azure Database for PostgreSQL using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Copy Activity in Azure Data Factory and Synapse Analytics pipelines to copy data from and to Azure Database for PostgreSQL. And, how to use Data Flow to transform data in Azure Database for PostgreSQL. To learn more, read the introductory articles for [Azure Data Factory](introduction.md) and [Synapse Analytics](../synapse-analytics/overview-what-is.md).

> [!IMPORTANT]
> The Azure Database for PostgreSQL version 2.0 provides improved native Azure Database for PostgreSQL support. If you're using the Azure Database for PostgreSQL version 1.0 in your solution, you're recommended to [upgrade your Azure Database for PostgreSQL connector](#upgrade-the-azure-database-for-postgresql-connector) at your earliest convenience.

This connector is specialized for the [Azure Database for PostgreSQL service](/azure/postgresql/overview). To copy data from a generic PostgreSQL database located on-premises or in the cloud, use the [PostgreSQL connector](connector-postgresql.md).

## Supported capabilities

This Azure Database for PostgreSQL connector is supported for the following capabilities:

| Supported capabilities|IR | Managed private endpoint|
|---------| --------| --------|
|[Copy activity](copy-activity-overview.md) (source/sink)|&#9312; &#9313;|✓ |
|[Mapping data flow](concepts-data-flow-overview.md) (source/sink)|&#9312; |✓ |
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|✓ |

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

The three activities work on Azure Database for PostgreSQL [Single Server](/azure/postgresql/single-server/), [Flexible Server](/azure/postgresql/flexible-server/), and [Azure Cosmos DB for PostgreSQL](/azure/postgresql/hyperscale/).

> [!IMPORTANT]
> Azure Database for PostgreSQL Single Server will be retired on March 28, 2025. Migrate to Flexible Server by that date. You can refer to this [article](/azure/postgresql/migrate/migration-service/overview-migration-service-postgresql) and [FAQ](/azure/postgresql/migrate/whats-happening-to-postgresql-single-server) for the migration guidance.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Azure Database for PostgreSQL using UI

Use the following steps to create a linked service to Azure database for PostgreSQL in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then select New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Create a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Create a new linked service with Azure Synapse UI.":::

2. Search for PostgreSQL and select the Azure database for PostgreSQL connector.

    :::image type="content" source="media/connector-azure-database-for-postgresql/azure-database-for-postgresql-connector.png" alt-text="Select the Azure database for PostgreSQL connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-azure-database-for-postgresql/configure-azure-database-for-postgresql-linked-service.png" alt-text="Configure a linked service to Azure database for PostgreSQL.":::

## Connector configuration details

The following sections offer details about properties that are used to define Data Factory entities specific to Azure Database for PostgreSQL connector.

## Linked service properties

The Azure Database for PostgreSQL connector version **2.0** supports Transport Layer Security (TLS) 1.3 and multiple Secured Socket Layer (SSL) modes. Refer to this [section](#upgrade-the-azure-database-for-postgresql-connector) to upgrade your Azure SQL Database connector version from version 1.0. For the property details, see the corresponding sections.

- [Version 2.0](#version-20)
- [Version 1.0](#version-10)

### Version 2.0

The following properties are supported for the Azure Database for PostgreSQL linked service when you apply version 2.0:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **AzurePostgreSql**. | Yes |
| version | The version that you specify. The value is `2.0`. | Yes |
| authenticationType | Select from basic,  service principal, system-assigned managed identity or user-assigned managed identity authentication types | Yes |
| server | Specifies the host name and optionally port on which Azure Database for PostgreSQL is running. | Yes |
| port |The TCP port of the Azure Database for PostgreSQL server. The default value is `5432`. |No |
| database| The name of the Azure Database for PostgreSQL database to connect to. |Yes |
| sslMode | Controls whether SSL is used, depending on server support. <br/>- **Disable**: SSL is disabled. If the server requires SSL, the connection fails.<br/>- **Allow**: Prefer non-SSL connections if the server allows them, but allow SSL connections.<br/>- **Prefer**: Prefer SSL connections if the server allows them, but allow connections without SSL.<br/>- **Require**: The connection fails if the server doesn't support SSL.<br/>- **Verify-ca**: The connection fails if the server doesn't support SSL. Also verifies server certificate.<br/>- **Verify-full**: The connection fails if the server doesn't support SSL. Also verifies server certificate with host's name. <br/>Options: Disable (0) / Allow (1) / Prefer (2) **(Default)** / Require (3) / Verify-ca (4) / Verify-full (5) | No |
| connectVia | This property represents the [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Azure Integration Runtime or Self-hosted Integration Runtime (if your data store is located in private network). If not specified, it uses the default Azure Integration Runtime.|No|
| ***Additional connection properties:*** |  |  |
| schema | Sets the schema search path. | No |
| pooling | Whether connection pooling should be used. | No |
| connectionTimeout | The time to wait (in seconds) while trying to establish a connection before terminating the attempt and generating an error. | No |
| commandTimeout | The time to wait (in seconds) while trying to execute a command before terminating the attempt and generating an error. Set to zero for infinity. | No |
| trustServerCertificate | Whether to trust the server certificate without validating it. | No |
| readBufferSize | Determines the size of the internal buffer Npgsql uses when reading. Increasing may improve performance if transferring large values from the database. | No |
| timezone | Gets or sets the session timezone. | No |
| encoding | Gets or sets the .NET encoding for encoding/decoding PostgreSQL string data. | No |

### Basic authentication

| Property | Description | Required |
|:--- |:--- |:--- |
| username | The username to connect with. Not required if using IntegratedSecurity. | Yes |
| password | The password to connect with. Not required if using IntegratedSecurity. Mark this field as **SecureString** to store it securely. Or, you can  [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |

**Example**:

```json
{
    "name": "AzurePostgreSqlLinkedService",
    "properties": {
        "type": "AzurePostgreSql",
        "version": "2.0",
        "typeProperties": {
            "server": "<server name>",
            "port": "5432",
            "database": "<database name>",
            "sslMode": 2,
            "username": "<user name>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
            }
        }
    }
}
```
**Example**:

***Store password in Azure Key Vault***

```json
{
    "name": "AzurePostgreSqlLinkedService",
    "properties": {
        "type": "AzurePostgreSql",
        "version": "2.0",
        "typeProperties": {
            "server": "<server name>",
            "port": "5432",
            "database": "<database name>",
            "sslMode": 2,
            "username": "<user name>",
            "password": { 
                "type": "AzureKeyVaultSecret", 
                "store": { 
                    "referenceName": "<Azure Key Vault linked service name>", 
                    "type": "LinkedServiceReference" 
                }, 
                "secretName": "<secretName>" 
            }
        }
    }
}
``` 

### System-assigned managed identity authentication

A data factory or Synapse workspace can be associated with a [System-assigned managed identity](/azure/data-factory/data-factory-service-identity#system-assigned-managed-identity) that represents the service when authenticating to other resources in Azure. You can use this managed identity for Azure database for PostgreSQL authentication. The designated factory or Synapse workspace can access and copy data from or to your database by using this identity.

To use System-assigned managed identity, follow the steps:

1. A data factory or Synapse workspace can be associated with a system-assigned managed identity. Learn More, [Generate system-assigned managed identity](/azure/data-factory/data-factory-service-identity#generate-managed-identity)

1. The Azure data for PostgreSQL with System assigned managed identity **On**.

    :::image type="content" source="media/connector-azure-database-for-postgresql/system-managed-identity-configuration.png" alt-text="Screenshot of the system assigned managed identity configuration in the Azure database for PostgreSQL server." lightbox="media/connector-azure-database-for-postgresql/system-managed-identity-configuration.png":::

1.  In your Azure Database for PostgreSQL resource under **Security**
    1. Select **Authentication**
    1. Select either **Microsoft Entra authentication only** or **PostgreSQL and Microsoft Entra authentication** Authentication method.
    1. Select **+ Add Microsoft Entra administrators**
    1. Add the system-assigned managed identity for the Azure Data Factory resource as one of the **Microsoft Entra Administrators** 
        
       :::image type="content" source="media/connector-azure-database-for-postgresql/system-assigned-managed-identity-adding-access.png" alt-text="Screenshot of adding system assigned managed identity in the Azure Database for PostgreSQL configuration." lightbox="media/connector-azure-database-for-postgresql/system-assigned-managed-identity-adding-access.png":::

1. Configure an Azure database for PostgreSQL linked service.

Example:
```json
{
    "name": "AzurePostgreSqlLinkedService",
    "type": "Microsoft.DataFactory/factories/linkedservices",
    "properties": {
        "annotations": [],
        "type": "AzurePostgreSql",
        "version": "2.0",
        "typeProperties": {
            "server": "<server name>",
            "port": 5432,
            "database": "<database name>",
            "sslMode": 2,
            "authenticationType": "SystemAssignedManagedIdentity"
        }
    }
}
```

### User-assigned managed identity authentication

A data factory or Synapse workspace can be associated with a [User-assigned managed identity](/azure/data-factory/data-factory-service-identity#user-assigned-managed-identity) that represents the service when authenticating to other resources in Azure. You can use this managed identity for Azure database for PostgreSQL authentication. The designated factory or Synapse workspace can access and copy data from or to your database by using this identity.

To use user-assigned managed identity authentication, in addition to the generic properties that are described in the preceding section, specify the following properties:

| Property | Description | Required |
|:--- |:--- |:--- |
| credential | Specify the user-assigned managed identity as the credential object. | Yes |

You also need to follow the steps:

1. Make sure to create on **User-assigned Managed Identity** resource on Azure portal. To learn more, go to [Manage user-assigned managed identities](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp)
1. Assign the **User-assigned Managed Identity** to your Azure database for PostgreSQL resource
    1. In your Azure database for PostgreSQL server resource, under **Security**
    1. Select **Authentication**
    1. Verify if Authentication method is **Microsoft Entra authentication only** or **PostgreSQL and Microsoft Entra authentication**
    1. Select **+ Add Microsoft Entra administrators** link and select your user-assigned managed identity

        :::image type="content" source="media/connector-azure-database-for-postgresql/user-managed-identity-postgresql-configuration.png" alt-text="Screenshot of the user-assigned managed identity configuration in the Azure database for PostgreSQL server." lightbox="media/connector-azure-database-for-postgresql/user-managed-identity-postgresql-configuration.png":::

1. Assign the **User-assigned Managed Identity** to your Azure Data Factory resource
    1. Select **Settings** and then **Managed Identities**
    1. Under the **User assigned** tab. Select the **+ Add** link and select your user-managed identity

        :::image type="content" source="media/connector-azure-database-for-postgresql/data-factory-user-identity-configuration.png" alt-text="Screenshot of the user-assigned managed identity configuration in the Azure Data Factory resource." lightbox="media/connector-azure-database-for-postgresql/data-factory-user-identity-configuration.png":::

1. Configure an Azure database for PostgreSQL linked service.

Example:
```json
{
    "name": "AzurePostgreSqlLinkedService",
    "type": "Microsoft.DataFactory/factories/linkedservices",
    "properties": {
        "annotations": [],
        "type": "AzurePostgreSql",
        "version": "2.0",
        "typeProperties": {
            "server": "<server name>",
            "port": 5432,
            "database": "<database name>",
            "sslMode": 2,
            "authenticationType": "UserAssignedManagedIdentity",
            "credential": {
                "referenceName": "<your credential>",
                "type": "CredentialReference"
            }
        }
    }
}
```

### Service principal authentication

| Property | Description | Required |
|:--- |:--- |:--- |
| username | The display name of the service principal | Yes |
| tenant | The tenant which the Azure Database for PostgreSQL server is located |Yes |
| servicePrincipalId | Application ID of service principal |Yes |
| servicePrincipalCredentialType | Select if service principal certificate or service principal key is desired authentication method<br/>- **ServicePrincipalCert**: Set to service principal certificate for service principal certificate.<br/>- **ServicePrincipalKey**: Set to service principal key for service principal key authentication. | Yes |
| servicePrincipalKey | Client secret value. Used when service principal key is selected | Yes |
| azureCloudType | Select the Azure cloud type of your Azure Database for PostgreSQL server | Yes |
| servicePrincipalEmbeddedCert | Service principal certificate file | Yes |
| servicePrincipalEmbeddedCertPassword | Service principal certificate password if necessary | No |

**Example**:

**Service principal key**
```json
{
    "name": "AzurePostgreSqlLinkedService",
    "type": "Microsoft.DataFactory/factories/linkedservices",
    "properties": {
        "annotations": [],
        "type": "AzurePostgreSql",
        "version": "2.0",
        "typeProperties": {
            "server": "<server name>",
            "port": 5432,
            "database": "<database name>",
            "sslMode": 2,
            "username": "<service principal name>",
            "authenticationType": "<authentication type>",
            "tenant": "<tenant>",
            "servicePrincipalId": "<service principal ID>",
            "azureCloudType": "<azure cloud type>",
            "servicePrincipalCredentialType": "<service principal type>",
            "servicePrincipalKey": "<service principal key>"
        }
    }
}
```

**Example**:

**Service principal certificate**
```json
{
    "name": "AzurePostgreSqlLinkedService",
    "type": "Microsoft.DataFactory/factories/linkedservices",
    "properties": {
        "annotations": [],
        "type": "AzurePostgreSql",
        "version": "2.0",
        "typeProperties": {
            "server": "<server name>",
            "port": 5432,
            "database": "<database name>",
            "sslMode": 2,
            "username": "<service principal name>",
            "authenticationType": "<authentication type>",
            "tenant": "<tenant>",
            "servicePrincipalId": "<service principal ID>",
            "azureCloudType": "<azure cloud type>",
            "servicePrincipalCredentialType": "<service principal type>",
            "servicePrincipalEmbeddedCert": "<service principal certificate>",
            "servicePrincipalEmbeddedCertPassword": "<service principal embedded certificate password>"
        }
    }
}
```




### Version 1.0

The following properties are supported for the Azure Database for PostgreSQL linked service when you apply version 1.0:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **AzurePostgreSql**. | Yes |
| version | The version that you specify. The value is `1.0`. | Yes |
| connectionString |A Npgsql connection string to connect to Azure Database for PostgreSQL.<br/>You can also put a password in Azure Key Vault and pull the `password` configuration out of the connection string. See the following samples and [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) for more details. | Yes |
| connectVia | This property represents the [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Azure Integration Runtime or Self-hosted Integration Runtime (if your data store is located in private network). If not specified, it uses the default Azure Integration Runtime. |No |

A typical connection string is `host=<server>.postgres.database.azure.com;database=<database>;port=<port>;uid=<username>;password=<password>`. Here are more properties you can set per your case:

| Property | Description | Options | Required |
|:--- |:--- |:--- |:--- |
| EncryptionMethod (EM)| The method the driver uses to encrypt data sent between the driver and the database server. For example,  `EncryptionMethod=<0/1/6>;`| 0 (No Encryption) **(Default)** / 1 (SSL) / 6 (RequestSSL) | No |
| ValidateServerCertificate (VSC) | Determines whether the driver validates the certificate that's sent by the database server when SSL encryption is enabled (Encryption Method=1). For example,  `ValidateServerCertificate=<0/1>;`| 0 (Disabled) **(Default)** / 1 (Enabled) | No |

**Example**:

```json
{
    "name": "AzurePostgreSqlLinkedService",
    "properties": {
        "type": "AzurePostgreSql",
        "version": "1.0",
        "typeProperties": {
            "connectionString": "host=<server>.postgres.database.azure.com;database=<database>;port=<port>;uid=<username>;password=<password>"
        }
    }
}
```

**Example**:

***Store password in Azure Key Vault***

```json
{
    "name": "AzurePostgreSqlLinkedService",
    "properties": {
        "type": "AzurePostgreSql",
        "version": "1.0",
        "typeProperties": {
            "connectionString": "host=<server>.postgres.database.azure.com;database=<database>;port=<port>;uid=<username>;",
            "password": { 
                "type": "AzureKeyVaultSecret", 
                "store": { 
                    "referenceName": "<Azure Key Vault linked service name>", 
                    "type": "LinkedServiceReference" 
                }, 
                "secretName": "<secretName>" 
            }
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see [Datasets](concepts-datasets-linked-services.md). This section provides a list of properties that Azure Database for PostgreSQL  supports in datasets.

To copy data from Azure Database for PostgreSQL, set the type property of the dataset to **AzurePostgreSqlTable**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to **AzurePostgreSqlTable**. | Yes |
| schema | Name of the schema. | No (if "query" in activity source is specified) |
| table | Name of the table/view. | No (if "query" in activity source is specified) |
| tableName | Name of the table. This property is supported for backward compatibility. For new workload, use `schema` and `table`. | No (if "query" in activity source is specified) |

**Example**:

```json
{
    "name": "AzurePostgreSqlDataset",
    "properties": {
        "type": "AzurePostgreSqlTable",
        "linkedServiceName": {
            "referenceName": "<AzurePostgreSql linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "schema": "<schema_name>",
            "table": "<table_name>"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see [Pipelines and activities](concepts-pipelines-activities.md). This section provides a list of properties supported by an Azure Database for PostgreSQL source.

### Azure Database for PostgreSql as source

To copy data from Azure Database for PostgreSQL, set the source type in the copy activity to **AzurePostgreSqlSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to **AzurePostgreSqlSource** | Yes |
| query | Use the custom SQL query to read data. For example: `SELECT * FROM mytable` or `SELECT * FROM "MyTable"`. Note in PostgreSQL, the entity name is treated as case-insensitive if not quoted. | No (if the tableName property in the dataset is specified) |
| queryTimeout | The wait time before terminating the attempt to execute a command and generating an error, default is 120 minutes. If parameter is set for this property, allowed values are timespan, such as "02:00:00" (120 minutes). For more information, see [CommandTimeout](https://www.npgsql.org/doc/api/Npgsql.NpgsqlCommand.html#Npgsql_NpgsqlCommand_CommandTimeout). | No |
| partitionOptions | Specifies the data partitioning options used to load data from Azure SQL Database. <br>Allowed values are: **None** (default), **PhysicalPartitionsOfTable**, and **DynamicRange**.<br>When a partition option is enabled (that is, not `None`), the degree of parallelism to concurrently load data from an Azure SQL Database is controlled by the [`parallelCopies`](copy-activity-performance-features.md#parallel-copy) setting on the copy activity. | No |
| partitionSettings | Specify the group of the settings for data partitioning. <br>Apply when the partition option isn't `None`. | No |
| ***Under `partitionSettings`:*** | | |
| partitionNames | The list of physical partitions that needs to be copied. <br>Apply when the partition option is `PhysicalPartitionsOfTable`. If you use a query to retrieve the source data, hook `?AdfTabularPartitionName` in the WHERE clause. For an example, see the [Parallel copy from Azure Database for PostgreSQL](#parallel-copy-from-azure-database-for-postgresql) section. | No |
| partitionColumnName | Specify the name of the source column **in integer or  date/datetime type** (`int`, `smallint`, `bigint`, `date`, `timestamp without time zone`, `timestamp with time zone` or `time without time zone`) that will be used by range partitioning for parallel copy. If not specified, the primary key of the table is auto-detected and used as the partition column.<br>Apply when the partition option is `DynamicRange`. If you use a query to retrieve the source data, hook  `?AdfRangePartitionColumnName ` in the WHERE clause. For an example, see the [Parallel copy from Azure Database for PostgreSQL](#parallel-copy-from-azure-database-for-postgresql) section. | No |
| partitionUpperBound | The maximum value of the partition column to copy out data. <br>Apply when the partition option is `DynamicRange`. If you use a query to retrieve the source data, hook `?AdfRangePartitionUpbound` in the WHERE clause. For an example, see the [Parallel copy from Azure Database for PostgreSQL](#parallel-copy-from-azure-database-for-postgresql) section. | No |
| partitionLowerBound | The minimum value of the partition column to copy out data. <br>Apply when the partition option is `DynamicRange`. If you use a query to retrieve the source data, hook `?AdfRangePartitionLowbound` in the WHERE clause. For an example, see the [Parallel copy from Azure Database for PostgreSQL](#parallel-copy-from-azure-database-for-postgresql) section. | No |

**Example**:

```json
"activities":[
    {
        "name": "CopyFromAzurePostgreSql",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<AzurePostgreSql input dataset name>",
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
                "type": "AzurePostgreSqlSource",
                "query": "<custom query e.g. SELECT * FROM mytable>",
                "queryTimeout": "00:10:00"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

### Azure Database for PostgreSQL as sink

To copy data to Azure Database for PostgreSQL, the following properties are supported in the copy activity **sink** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity sink must be set to **AzurePostgreSqlSink**. | Yes |
| preCopyScript | Specify a SQL query for the copy activity to execute before you write data into Azure Database for PostgreSQL in each run. You can use this property to clean up the preloaded data. | No |
| writeMethod | The method used to write data into Azure Database for PostgreSQL.<br>Allowed values are: **CopyCommand** (default, which is more performant), **BulkInsert**. | No |
| writeBatchSize | The number of rows loaded into Azure Database for PostgreSQL per batch.<br>Allowed value is an integer that represents the number of rows. | No (default is 1,000,000) |
| writeBatchTimeout | Wait time for the batch insert operation to complete before it times out.<br>Allowed values are Timespan strings. An example is 00:30:00 (30 minutes). | No (default is 00:30:00) |

**Example**:

```json
"activities":[
    {
        "name": "CopyToAzureDatabaseForPostgreSQL",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<Azure PostgreSQL output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "AzurePostgreSqlSink",
                "preCopyScript": "<custom SQL script>",
                "writeMethod": "CopyCommand",
                "writeBatchSize": 1000000
            }
        }
    }
]
```

## Parallel copy from Azure Database for PostgreSQL

The Azure Database for PostgreSQL connector in copy activity provides built-in data partitioning to copy data in parallel. You can find data partitioning options on the **Source** tab of the copy activity.

![Screenshot of partition options](.\media\connector-azure-database-for-postgresql/connector-postgresql-partition-options.png)

When you enable partitioned copy, copy activity runs parallel queries against your Azure Database for PostgreSQL source to load data by partitions. The parallel degree is controlled by the [`parallelCopies`](copy-activity-performance-features.md#parallel-copy) setting on the copy activity. For example, if you set `parallelCopies` to four, the service concurrently generates and runs four queries based on your specified partition option and settings, and each query retrieves a portion of data from your Azure Database for PostgreSQL.

You're suggested to enable parallel copy with data partitioning especially when you load large amount of data from your Azure Database for PostgreSQL. The following are suggested configurations for different scenarios. When copying data into file-based data store, the recommendation is to write to a folder as multiple files (only specify folder name), in which case the performance is better than writing to a single file.

| Scenario                                                     | Suggested settings                                           |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Full load from large table, with physical partitions.        | **Partition option**: Physical partitions of table. <br><br/>During execution, the service automatically detects the physical partitions, and copies data by partitions. |
| Full load from large table, without physical partitions, while with an integer column for data partitioning. | **Partition options**: Dynamic range partition.<br>**Partition column**: Specify the column used to partition data. If not specified, the primary key column is used. |
| Load a large amount of data by using a custom query, with physical partitions. | **Partition option**: Physical partitions of table.<br>**Query**: `SELECT * FROM ?AdfTabularPartitionName WHERE <your_additional_where_clause>`.<br>**Partition name**: Specify one or more partition names to copy data from. If not specified, the service automatically detects the physical partitions on the table you specified in the PostgreSQL dataset.<br><br>During execution, the service replaces `?AdfTabularPartitionName` with the actual partition name, and sends to Azure Database for PostgreSQL. |
| Load a large amount of data by using a custom query, without physical partitions, while with an integer column for data partitioning. | **Partition options**: Dynamic range partition.<br>**Query**: `SELECT * FROM ?AdfTabularPartitionName WHERE ?AdfRangePartitionColumnName <= ?AdfRangePartitionUpbound AND ?AdfRangePartitionColumnName >= ?AdfRangePartitionLowbound AND <your_additional_where_clause>`.<br>**Partition column**: Specify the column used to partition data. You can partition against the column with integer or date/datetime data type.<br>**Partition upper bound** and **partition lower bound**: Specify if you want to filter against partition column to retrieve data only between the lower and upper range.<br><br>During execution, the service replaces `?AdfRangePartitionColumnName`, `?AdfRangePartitionUpbound`, and `?AdfRangePartitionLowbound` with the actual column name and value ranges for each partition, and sends to Azure Database for PostgreSQL. <br>For example, if your partition column "ID" is set with the lower bound as 1 and the upper bound as 80, with parallel copy set as 4, the service retrieves data by four partitions. Their IDs are between [1,20], [21, 40], [41, 60], and [61, 80], respectively. |

Best practices to load data with partition option:

1. Choose distinctive column as partition column (like primary key or unique key) to avoid data skew. 
2. If the table has built-in partition, use partition option "Physical partitions of table" to get better performance.    
3. If you use Azure Integration Runtime to copy data, you can set larger "[Data Integration Units (DIU)](copy-activity-performance-features.md#data-integration-units)" (>4) to utilize more computing resource. Check the applicable scenarios there.
4. "[Degree of copy parallelism](copy-activity-performance-features.md#parallel-copy)" control the partition numbers, setting this number too large sometime hurts the performance. Recommend setting this number as (DIU or number of Self-hosted IR nodes) * (2 to 4).

**Example: full load from large table with physical partitions**

```json
"source": {
    "type": "AzurePostgreSqlSource",
    "partitionOption": "PhysicalPartitionsOfTable"
}
```

**Example: query with dynamic range partition**

```json
"source": {
    "type": "AzurePostgreSqlSource",
    "query": "SELECT * FROM <TableName> WHERE ?AdfDynamicRangePartitionCondition AND <your_additional_where_clause>",
    "partitionOption": "DynamicRange",
    "partitionSettings": {
        "partitionColumnName": "<partition_column_name>",
        "partitionUpperBound": "<upper_value_of_partition_column (optional) to decide the partition stride, not as data filter>",
        "partitionLowerBound": "<lower_value_of_partition_column (optional) to decide the partition stride, not as data filter>"
    }
}
```

## Mapping data flow properties

When transforming data in mapping data flow, you can read and write to tables from Azure Database for PostgreSQL. For more information, see the [source transformation](data-flow-source.md) and [sink transformation](data-flow-sink.md) in mapping data flows. You can choose to use an Azure Database for PostgreSQL dataset or an [inline dataset](data-flow-source.md#inline-datasets) as source and sink type.

### Source transformation

The below table lists the properties supported by Azure Database for PostgreSQL source. You can edit these properties in the **Source options** tab.

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Table | If you select Table as input, data flow fetches all the data from the table specified in the dataset. | No | - |*(for inline dataset only)*<br>tableName |
| Query | If you select Query as input, specify a SQL query to fetch data from source, which overrides any table you specify in dataset. Using queries is a great way to reduce rows for testing or lookups.<br><br>**Order By** clause isn't supported, but you can set a full SELECT FROM statement. You can also use user-defined table functions. **select * from udfGetData()** is a UDF in SQL that returns a table that you can use in data flow.<br>Query example: `select * from mytable where customerId > 1000 and customerId < 2000` or `select * from "MyTable"`. Note in PostgreSQL, the entity name is treated as case-insensitive if not quoted.| No | String | query |
| Schema name | If you select Stored procedure as input, specify a schema name of the stored procedure, or select Refresh to ask the service to discover the schema names.| No | String | schemaName |
| Stored procedure | If you select Stored procedure as input, specify a name of the stored procedure to read data from the source table, or select Refresh to ask the service to discover the procedure names.| Yes (if you select Stored procedure as input) | String | procedureName |
| Procedure parameters | If you select Stored procedure as input, specify any input parameters for the stored procedure in the order set in the procedure, or select Import to import all procedure parameters using the form `@paraName`. | No | Array | inputs |
| Batch size | Specify a batch size to chunk large data into batches. | No | Integer | batchSize |
| Isolation Level | Choose one of the following isolation levels:<br>- Read Committed<br>- Read Uncommitted (default)<br>- Repeatable Read<br>- Serializable<br>- None (ignore isolation level) | No | READ_COMMITTED<br/>READ_UNCOMMITTED<br/>REPEATABLE_READ<br/>SERIALIZABLE<br/>NONE |isolationLevel |

#### Azure Database for PostgreSQL source script example

When you use Azure Database for PostgreSQL as source type, the associated data flow script is:

```
source(allowSchemaDrift: true,
    validateSchema: false,
    isolationLevel: 'READ_UNCOMMITTED',
    query: 'select * from mytable',
    format: 'query') ~> AzurePostgreSQLSource
```

### Sink transformation

The below table lists the properties supported by Azure Database for PostgreSQL sink. You can edit these properties in the **Sink options** tab.

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Update method | Specify what operations are allowed on your database destination. The default is to only allow inserts.<br>To update, upsert, or delete rows, an [Alter row transformation](data-flow-alter-row.md) is required to tag rows for those actions. | Yes | `true` or `false` | deletable <br/>insertable <br/>updateable <br/>upsertable |
| Key columns | For updates, upserts and deletes, key columns must be set to determine which row to alter.<br>The column name that you pick as the key is used as part of the subsequent update, upsert, delete. Therefore, you must pick a column that exists in the Sink mapping. | No | Array | keys |
| Skip writing key columns | If you wish to not write the value to the key column, select "Skip writing key columns". | No | `true` or `false` | skipKeyWrites |
| Table action | Determines whether to recreate or remove all rows from the destination table before writing.<br>- **None**: No action is done to the table.<br>- **Recreate**: The table gets dropped and recreated. Required if creating a new table dynamically.<br>- **Truncate**: All rows from the target table get removed. | No | `true` or `false` | recreate<br/>truncate |
| Batch size | Specify how many rows are being written in each batch. Larger batch sizes improve compression and memory optimization, but risk out of memory exceptions when caching data. | No | Integer | batchSize |
| Select user DB schema | By default, a temporary table is created under the sink schema as staging. You can alternatively uncheck the **Use sink schema** option and instead, specify a schema name under which Data Factory creates a staging table to load upstream data and automatically clean them up upon completion. Make sure you have create table permission in the database and alter permission on the schema. | No | String | stagingSchemaName |
| Pre and Post SQL scripts | Specify multi-line SQL scripts that will execute before (preprocessing) and after (post-processing) data is written to your Sink database. | No | String | preSQLs<br>postSQLs |

> [!TIP]
> 1. Split Single batch scripts with multiple commands into multiple batches.
> 2. Only Data Definition Language (DDL) and Data Manipulation Language (DML) statements that return a simple update count can be run as part of a batch. Learn more from [Performing batch operations](/sql/connect/jdbc/performing-batch-operations)


* Enable incremental extract: Use this option to tell ADF to only process rows that changed since the last time that the pipeline executed.

* Incremental column: When using the incremental extract feature, you must choose the date/time or numeric column that you wish to use as the watermark in your source table.

* Start reading from beginning: Setting this option with incremental extract instructs ADF to read all rows on first execution of a pipeline with incremental extract turned on.

#### Azure Database for PostgreSQL sink script example

When you use Azure Database for PostgreSQL as sink type, the associated data flow script is:

```
IncomingStream sink(allowSchemaDrift: true,
    validateSchema: false,
    deletable:false,
    insertable:true,
    updateable:true,
    upsertable:true,
    keys:['keyColumn'],
    format: 'table',
    skipDuplicateMapInputs: true,
    skipDuplicateMapOutputs: true) ~> AzurePostgreSqlSink
```

## Lookup activity properties

For more information about the properties, see [Lookup activity](control-flow-lookup-activity.md).


## Upgrade the Azure Database for PostgreSQL connector

In **Edit linked service** page, select **2.0** under **Version** and configure the linked service by referring to [Linked service properties version 2.0](#version-20).

## Related content
For a list of data stores supported as sources and sinks by the copy activity, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
