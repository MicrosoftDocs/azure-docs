---
title: Copy and transform data in Azure Synapse Analytics
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy data to and from Azure Synapse Analytics, and transform data in Azure Synapse Analytics by using Data Factory.
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 04/20/2023
---

# Copy and transform data in Azure Synapse Analytics by using Azure Data Factory or Synapse pipelines

> [!div class="op_single_selector" title1="Select the version of Data Factory service you're using:"]
>
> - [Version1](v1/data-factory-azure-sql-data-warehouse-connector.md)
> - [Current version](connector-azure-sql-data-warehouse.md)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Copy Activity in Azure Data Factory or Synapse pipelines to copy data from and to Azure Synapse Analytics, and use Data Flow to transform data in Azure Data Lake Storage Gen2. To learn about Azure Data Factory, read the [introductory article](introduction.md).

## Supported capabilities

This Azure Synapse Analytics connector is supported for the following capabilities:

| Supported capabilities|IR | Managed private endpoint|
|---------| --------| --------|
|[Copy activity](copy-activity-overview.md) (source/sink)|&#9312; &#9313;|✓ |
|[Mapping data flow](concepts-data-flow-overview.md) (source/sink)|&#9312; |✓ |
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|✓ |
|[GetMetadata activity](control-flow-get-metadata-activity.md)|&#9312; &#9313;|✓ |
|[Script activity](transform-data-using-script.md)|&#9312; &#9313;|✓ |
|[Stored procedure activity](transform-data-using-stored-procedure.md)|&#9312; &#9313;|✓ |

<small>*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*</small>

For Copy activity, this Azure Synapse Analytics connector supports these functions:

- Copy data by using SQL authentication and Microsoft Entra Application token authentication with a service principal or managed identities for Azure resources.
- As a source, retrieve data by using a SQL query or stored procedure. You can also choose to parallel copy from an Azure Synapse Analytics source, see the [Parallel copy from Azure Synapse Analytics](#parallel-copy-from-azure-synapse-analytics) section for details.
- As a sink, load data by using [COPY statement](#use-copy-statement) or [PolyBase](#use-polybase-to-load-data-into-azure-synapse-analytics) or bulk insert. We recommend COPY statement or PolyBase for better copy performance. The connector also supports automatically creating destination table with DISTRIBUTION = ROUND_ROBIN if not exists based on the source schema.

> [!IMPORTANT]
> If you copy data by using an Azure Integration Runtime, configure a [server-level firewall rule](/azure/azure-sql/database/firewall-configure) so that Azure services can access the [logical SQL server](/azure/azure-sql/database/logical-servers).
> If you copy data by using a self-hosted integration runtime, configure the firewall to allow the appropriate IP range. This range includes the machine's IP that is used to connect to Azure Synapse Analytics.
## Get started

> [!TIP]
> To achieve best performance, use PolyBase or COPY statement to load data into Azure Synapse Analytics. The [Use PolyBase to load data into Azure Synapse Analytics](#use-polybase-to-load-data-into-azure-synapse-analytics) and [Use COPY statement to load data into Azure Synapse Analytics](#use-copy-statement) sections have details. For a walkthrough with a use case, see [Load 1 TB into Azure Synapse Analytics under 15 minutes with Azure Data Factory](load-azure-sql-data-warehouse.md).

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create an Azure Synapse Analytics linked service using UI

Use the following steps to create an Azure Synapse Analytics linked service in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Synapse and select the Azure Synapse Analytics connector.

    :::image type="content" source="media/connector-azure-sql-data-warehouse/azure-sql-data-warehouse-connector.png" alt-text="Screenshot of the Azure Synapse Analytics connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-azure-sql-data-warehouse/configure-azure-sql-data-warehouse-linked-service.png" alt-text="Screenshot of configuration for an Azure Synapse Analytics linked service.":::

## Connector configuration details

The following sections provide details about properties that define Data Factory and Synapse pipeline entities specific to an Azure Synapse Analytics connector.

## Linked service properties

These generic properties are supported for an Azure Synapse Analytics linked service:

| Property            | Description                                                  | Required                                                     |
| :------------------ | :----------------------------------------------------------- | :----------------------------------------------------------- |
| type                | The type property must be set to **AzureSqlDW**.             | Yes                                                          |
| connectionString    | Specify the information needed to connect to the Azure Synapse Analytics instance for the **connectionString** property. <br/>Mark this field as a SecureString to store it securely. You can also put password/service principal key in Azure Key Vault，and if it's SQL authentication pull the `password` configuration out of the connection string. See the JSON example below the table and [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) article with more details. | Yes                                                          |
| azureCloudType | For service principal authentication, specify the type of Azure cloud environment to which your Microsoft Entra application is registered. <br/> Allowed values are `AzurePublic`, `AzureChina`, `AzureUsGovernment`, and `AzureGermany`. By default, the data factory or Synapse pipeline's cloud environment is used. | No |
| connectVia          | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Azure Integration Runtime or a self-hosted integration runtime (if your data store is located in a private network). If not specified, it uses the default Azure Integration Runtime. | No                                                           |

For different authentication types, refer to the following sections on specific properties, prerequisites and JSON samples, respectively:

- [SQL authentication](#sql-authentication)
- [Service principal authentication](#service-principal-authentication)
- [System-assigned managed identity authentication](#managed-identity)
- [User-assigned managed identity authentication](#user-assigned-managed-identity-authentication)

>[!TIP]
>When creating linked service for a **serverless** SQL pool in Azure Synapse from the Azure portal:
> 1. For **Account Selection Method**, choose **Enter manually**.
> 1. Paste the **fully qualified domain name** of the serverless endpoint. You can find this in the Azure portal Overview page for your Synapse workspace, in the properties under **Serverless SQL endpoint**. For example, `myserver-ondemand.sql-azuresynapse.net`.
> 1. For **Database name**, provide the database name in the serverless SQL pool.

>[!TIP]
>If you hit error with error code as "UserErrorFailedToConnectToSqlServer" and message like "The session limit for the database is XXX and has been reached.", add `Pooling=false` to your connection string and try again.

### SQL authentication

To use SQL authentication authentication type, specify the generic properties that are described in the preceding section.

#### Linked service example that uses SQL authentication

```json
{
    "name": "AzureSqlDWLinkedService",
    "properties": {
        "type": "AzureSqlDW",
        "typeProperties": {
            "connectionString": "Server=tcp:<servername>.database.windows.net,1433;Database=<databasename>;User ID=<username>@<servername>;Password=<password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

**Password in Azure Key Vault:**

```json
{
    "name": "AzureSqlDWLinkedService",
    "properties": {
        "type": "AzureSqlDW",
        "typeProperties": {
            "connectionString": "Server=tcp:<servername>.database.windows.net,1433;Database=<databasename>;User ID=<username>@<servername>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30",
            "password": {
                "type": "AzureKeyVaultSecret",
                "store": {
                    "referenceName": "<Azure Key Vault linked service name>",
                    "type": "LinkedServiceReference"
                },
                "secretName": "<secretName>"
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

### Service principal authentication

To use service principal authentication, in addition to the generic properties that are described in the preceding section, specify the following properties:

| Property            | Description                                                  | Required                                                     |
| :------------------ | :----------------------------------------------------------- | :----------------------------------------------------------- |
| servicePrincipalId  | Specify the application's client ID.                         | Yes |
| servicePrincipalKey | Specify the application's key. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| tenant              | Specify the tenant information (domain name or tenant ID) under which your application resides. You can retrieve it by hovering the mouse in the top-right corner of the Azure portal. | Yes |

You also need to follow the steps below:

1. **[Create a Microsoft Entra application](../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal)** from the Azure portal. Make note of the application name and the following values that define the linked service:

   - Application ID
   - Application key
   - Tenant ID

2. **[Provision a Microsoft Entra administrator](/azure/azure-sql/database/authentication-aad-configure#provision-azure-ad-admin-sql-database)** for your server in the Azure portal if you haven't already done so. The Microsoft Entra administrator can be a Microsoft Entra user or Microsoft Entra group. If you grant the group with managed identity an admin role, skip steps 3 and 4. The administrator will have full access to the database.

3. **[Create contained database users](/azure/azure-sql/database/authentication-aad-configure#create-contained-users-mapped-to-azure-ad-identities)** for the service principal. Connect to the data warehouse from or to which you want to copy data by using tools like SSMS, with a Microsoft Entra identity that has at least ALTER ANY USER permission. Run the following T-SQL:
  
    ```sql
    CREATE USER [your_application_name] FROM EXTERNAL PROVIDER;
    ```

4. **Grant the service principal needed permissions** as you normally do for SQL users or others. Run the following code, or refer to more options [here](/sql/relational-databases/system-stored-procedures/sp-addrolemember-transact-sql). If you want to use PolyBase to load the data, learn the [required database permission](#required-database-permission).

    ```sql
    EXEC sp_addrolemember db_owner, [your application name];
    ```

5. **Configure an Azure Synapse Analytics linked service** in an Azure Data Factory or Synapse workspace.

#### Linked service example that uses service principal authentication

```json
{
    "name": "AzureSqlDWLinkedService",
    "properties": {
        "type": "AzureSqlDW",
        "typeProperties": {
            "connectionString": "Server=tcp:<servername>.database.windows.net,1433;Database=<databasename>;Connection Timeout=30",
            "servicePrincipalId": "<service principal id>",
            "servicePrincipalKey": {
                "type": "SecureString",
                "value": "<service principal key>"
            },
            "tenant": "<tenant info, e.g. microsoft.onmicrosoft.com>"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

### <a name="managed-identity"></a> System-assigned managed identities for Azure resources authentication

A data factory or Synapse workspace can be associated with a [system-assigned managed identity for Azure resources](data-factory-service-identity.md#system-assigned-managed-identity) that represents the resource. You can use this managed identity for Azure Synapse Analytics authentication. The designated resource can access and copy data from or to your data warehouse by using this identity.

To use system-assigned managed identity authentication, specify the generic properties that are described in the preceding section, and follow these steps.

1. **[Provision a Microsoft Entra administrator](/azure/azure-sql/database/authentication-aad-configure#provision-azure-ad-admin-sql-database)** for your server on the Azure portal if you haven't already done so. The Microsoft Entra administrator can be a Microsoft Entra user or Microsoft Entra group. If you grant the group with system-assigned managed identity an admin role, skip steps 3 and 4. The administrator will have full access to the database.

2. **[Create contained database users](/azure/azure-sql/database/authentication-aad-configure#create-contained-users-mapped-to-azure-ad-identities)** for the system-assigned managed identity. Connect to the data warehouse from or to which you want to copy data by using tools like SSMS, with a Microsoft Entra identity that has at least ALTER ANY USER permission. Run the following T-SQL.
  
    ```sql
    CREATE USER [your_resource_name] FROM EXTERNAL PROVIDER;
    ```

3. **Grant the system-assigned managed identity needed permissions** as you normally do for SQL users and others. Run the following code, or refer to more options [here](/sql/relational-databases/system-stored-procedures/sp-addrolemember-transact-sql). If you want to use PolyBase to load the data, learn the [required database permission](#required-database-permission).

    ```sql
    EXEC sp_addrolemember db_owner, [your_resource_name];
    ```

4. **Configure an Azure Synapse Analytics linked service**.

**Example:**

```json
{
    "name": "AzureSqlDWLinkedService",
    "properties": {
        "type": "AzureSqlDW",
        "typeProperties": {
            "connectionString": "Server=tcp:<servername>.database.windows.net,1433;Database=<databasename>;Connection Timeout=30"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```
### User-assigned managed identity authentication

A data factory or Synapse workspace can be associated with a [user-assigned managed identities](data-factory-service-identity.md#user-assigned-managed-identity) that represents the resource. You can use this managed identity for Azure Synapse Analytics authentication. The designated resource can access and copy data from or to your data warehouse by using this identity.

To use user-assigned managed identity authentication, in addition to the generic properties that are described in the preceding section, specify the following properties:

| Property            | Description                                                  | Required         |
| :------------------ | :----------------------------------------------------------- | :--------------- |
| credentials | Specify the user-assigned managed identity as the credential object. | Yes              |

You also need to follow the steps below:

1. **[Provision a Microsoft Entra administrator](/azure/azure-sql/database/authentication-aad-configure#provision-azure-ad-admin-sql-database)** for your server on the Azure portal if you haven't already done so. The Microsoft Entra administrator can be a Microsoft Entra user or Microsoft Entra group. If you grant the group with user-assigned managed identity an admin role, skip steps 3. The administrator will have full access to the database.

2. **[Create contained database users](/azure/azure-sql/database/authentication-aad-configure#create-contained-users-mapped-to-azure-ad-identities)** for the user-assigned managed identity. Connect to the data warehouse from or to which you want to copy data by using tools like SSMS, with a Microsoft Entra identity that has at least ALTER ANY USER permission. Run the following T-SQL.
  
    ```sql
    CREATE USER [your_resource_name] FROM EXTERNAL PROVIDER;
    ```

3. [Create one or multiple user-assigned managed identities](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md) and **grant the user-assigned managed identity needed permissions** as you normally do for SQL users and others. Run the following code, or refer to more options [here](/sql/relational-databases/system-stored-procedures/sp-addrolemember-transact-sql). If you want to use PolyBase to load the data, learn the [required database permission](#required-database-permission).

    ```sql
    EXEC sp_addrolemember db_owner, [your_resource_name];
    ```
4. Assign one or multiple user-assigned managed identities to your data factory and [create credentials](credentials.md) for each user-assigned managed identity. 

5. **Configure an Azure Synapse Analytics linked service**.

**Example:**

```json
{
    "name": "AzureSqlDWLinkedService",
    "properties": {
        "type": "AzureSqlDW",
        "typeProperties": {
            "connectionString": "Server=tcp:<servername>.database.windows.net,1433;Database=<databasename>;Connection Timeout=30",
            "credential": {
                "referenceName": "credential1",
                "type": "CredentialReference"
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

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article.

The following properties are supported for Azure Synapse Analytics dataset:

| Property  | Description                                                  | Required                    |
| :-------- | :----------------------------------------------------------- | :-------------------------- |
| type      | The **type** property of the dataset must be set to **AzureSqlDWTable**. | Yes                         |
| schema | Name of the schema. |No for source, Yes for sink  |
| table | Name of the table/view. |No for source, Yes for sink  |
| tableName | Name of the table/view with schema. This property is supported for backward compatibility. For new workload, use `schema` and `table`. | No for source, Yes for sink |

### Dataset properties example

```json
{
    "name": "AzureSQLDWDataset",
    "properties":
    {
        "type": "AzureSqlDWTable",
        "linkedServiceName": {
            "referenceName": "<Azure Synapse Analytics linked service name>",
            "type": "LinkedServiceReference"
        },
        "schema": [ < physical schema, optional, retrievable during authoring > ],
        "typeProperties": {
            "schema": "<schema_name>",
            "table": "<table_name>"
        }
    }
}
```

## Copy Activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by the Azure Synapse Analytics source and sink.

### Azure Synapse Analytics as the source

>[!TIP]
>To load data from Azure Synapse Analytics efficiently by using data partitioning, learn more from [Parallel copy from Azure Synapse Analytics](#parallel-copy-from-azure-synapse-analytics).

To copy data from Azure Synapse Analytics, set the **type** property in the Copy Activity source to **SqlDWSource**. The following properties are supported in the Copy Activity **source** section:

| Property                     | Description                                                  | Required |
| :--------------------------- | :----------------------------------------------------------- | :------- |
| type                         | The **type** property of the Copy Activity source must be set to **SqlDWSource**. | Yes      |
| sqlReaderQuery               | Use the custom SQL query to read data. Example: `select * from MyTable`. | No       |
| sqlReaderStoredProcedureName | The name of the stored procedure that reads data from the source table. The last SQL statement must be a SELECT statement in the stored procedure. | No       |
| storedProcedureParameters    | Parameters for the stored procedure.<br/>Allowed values are name or value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. | No       |
| isolationLevel | Specifies the transaction locking behavior for the SQL source. The allowed values are: **ReadCommitted**, **ReadUncommitted**, **RepeatableRead**, **Serializable**, **Snapshot**. If not specified, the database's default isolation level is used. For more information, see [system.data.isolationlevel](/dotnet/api/system.data.isolationlevel). | No |
| partitionOptions | Specifies the data partitioning options used to load data from Azure Synapse Analytics. <br>Allowed values are: **None** (default), **PhysicalPartitionsOfTable**, and **DynamicRange**.<br>When a partition option is enabled (that is, not `None`), the degree of parallelism to concurrently load data from an Azure Synapse Analytics is controlled by the [`parallelCopies`](copy-activity-performance-features.md#parallel-copy) setting on the copy activity. | No |
| partitionSettings | Specify the group of the settings for data partitioning. <br>Apply when the partition option isn't `None`. | No |
| ***Under `partitionSettings`:*** | | |
| partitionColumnName | Specify the name of the source column **in integer or  date/datetime type** (`int`, `smallint`, `bigint`, `date`, `smalldatetime`, `datetime`, `datetime2`, or `datetimeoffset`) that will be used by range partitioning for parallel copy. If not specified, the index or the primary key of the table is detected automatically and used as the partition column.<br>Apply when the partition option is `DynamicRange`. If you use a query to retrieve the source data, hook  `?AdfDynamicRangePartitionCondition ` in the WHERE clause. For an example, see the [Parallel copy from SQL database](#parallel-copy-from-azure-synapse-analytics) section. | No |
| partitionUpperBound | The maximum value of the partition column for partition range splitting. This value is used to decide the partition stride, not for filtering the rows in table. All rows in the table or query result will be partitioned and copied. If not specified, copy activity auto detect the value.  <br>Apply when the partition option is `DynamicRange`. For an example, see the [Parallel copy from SQL database](#parallel-copy-from-azure-synapse-analytics) section. | No |
| partitionLowerBound | The minimum value of the partition column for partition range splitting. This value is used to decide the partition stride, not for filtering the rows in table. All rows in the table or query result will be partitioned and copied. If not specified, copy activity auto detect the value.<br>Apply when the partition option is `DynamicRange`. For an example, see the [Parallel copy from SQL database](#parallel-copy-from-azure-synapse-analytics) section. | No |

**Note the following point:**

- When using stored procedure in source to retrieve data, note if your stored procedure is designed as returning different schema when different parameter value is passed in, you may encounter failure or see unexpected result when importing schema from UI or when copying data to SQL database with auto table creation.

#### Example: using SQL query

```json
"activities":[
    {
        "name": "CopyFromAzureSQLDW",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Azure Synapse Analytics input dataset name>",
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
                "type": "SqlDWSource",
                "sqlReaderQuery": "SELECT * FROM MyTable"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

#### Example: using stored procedure

```json
"activities":[
    {
        "name": "CopyFromAzureSQLDW",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Azure Synapse Analytics input dataset name>",
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
                "type": "SqlDWSource",
                "sqlReaderStoredProcedureName": "CopyTestSrcStoredProcedureWithParameters",
                "storedProcedureParameters": {
                    "stringData": { "value": "str3" },
                    "identifier": { "value": "$$Text.Format('{0:yyyy}', <datetime parameter>)", "type": "Int"}
                }
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

#### Sample stored procedure:

```sql
CREATE PROCEDURE CopyTestSrcStoredProcedureWithParameters
(
    @stringData varchar(20),
    @identifier int
)
AS
SET NOCOUNT ON;
BEGIN
    select *
    from dbo.UnitTestSrcTable
    where dbo.UnitTestSrcTable.stringData != stringData
    and dbo.UnitTestSrcTable.identifier != identifier
END
GO
```

### <a name="azure-sql-data-warehouse-as-sink"></a> Azure Synapse Analytics as sink

Azure Data Factory and Synapse pipelines support three ways to load data into Azure Synapse Analytics.

- [Use COPY statement](#use-copy-statement)
- [Use PolyBase](#use-polybase-to-load-data-into-azure-synapse-analytics)
- Use bulk insert

The fastest and most scalable way to load data is through the [COPY statement](/sql/t-sql/statements/copy-into-transact-sql) or the [PolyBase](/sql/relational-databases/polybase/polybase-guide).

To copy data to Azure Synapse Analytics, set the sink type in Copy Activity to **SqlDWSink**. The following properties are supported in the Copy Activity **sink** section:

| Property          | Description                                                  | Required                                      |
| :---------------- | :----------------------------------------------------------- | :-------------------------------------------- |
| type              | The **type** property of the Copy Activity sink must be set to **SqlDWSink**. | Yes                                           |
| allowPolyBase     | Indicates whether to use PolyBase to load data into Azure Synapse Analytics. `allowCopyCommand` and `allowPolyBase` cannot be both true. <br/><br/>See [Use PolyBase to load data into Azure Synapse Analytics](#use-polybase-to-load-data-into-azure-synapse-analytics) section for constraints and details.<br/><br/>Allowed values are **True** and **False** (default). | No.<br/>Apply when using PolyBase.     |
| polyBaseSettings  | A group of properties that can be specified when the `allowPolybase` property is set to **true**. | No.<br/>Apply  when using PolyBase. |
| allowCopyCommand | Indicates whether to use [COPY statement](/sql/t-sql/statements/copy-into-transact-sql) to load data into Azure Synapse Analytics. `allowCopyCommand` and `allowPolyBase` cannot be both true. <br/><br/>See [Use COPY statement to load data into Azure Synapse Analytics](#use-copy-statement) section for constraints and details.<br/><br/>Allowed values are **True** and **False** (default). | No.<br>Apply  when using COPY. |
| copyCommandSettings | A group of properties that can be specified when `allowCopyCommand` property is set to TRUE. | No.<br/>Apply  when using COPY. |
| writeBatchSize    | Number of rows to inserts into the SQL table **per batch**.<br/><br/>The allowed value is **integer** (number of rows). By default, the service dynamically determines the appropriate batch size based on the row size. | No.<br/>Apply  when using bulk insert.     |
| writeBatchTimeout | Wait time for the batch insert operation to finish before it times out.<br/><br/>The allowed value is **timespan**. Example: "00:30:00" (30 minutes). | No.<br/>Apply  when using bulk insert.        |
| preCopyScript     | Specify a SQL query for Copy Activity to run before writing data into Azure Synapse Analytics in each run. Use this property to clean up the preloaded data. | No                                            |
| tableOption | Specifies whether to [automatically create the sink table](copy-activity-overview.md#auto-create-sink-tables) if not exists based on the source schema. Allowed values are: `none` (default), `autoCreate`. |No |
| disableMetricsCollection | The service collects metrics such as Azure Synapse Analytics DWUs for copy performance optimization and recommendations, which introduce additional master DB access. If you are concerned with this behavior, specify `true` to turn it off. | No (default is `false`) |
| maxConcurrentConnections |The upper limit of concurrent connections established to the data store during the activity run. Specify a value only when you want to limit concurrent connections.| No |
| WriteBehavior | Specify the write behavior for copy activity to load data into Azure SQL Database. <br/> The allowed value is **Insert** and **Upsert**. By default, the service uses insert to load data. | No |
| upsertSettings | Specify the group of the settings for write behavior. <br/> Apply when the WriteBehavior option is `Upsert`. | No |
| ***Under `upsertSettings`:*** | | |
| keys | Specify the column names for unique row identification. Either a single key or a series of keys can be used. If not specified, the primary key is used. | No |
| interimSchemaName | Specify the interim schema for creating interim table. Note: user need to have the permission for creating and deleting table. By default, interim table will share the same schema as sink table. | No |

#### Example 1: Azure Synapse Analytics sink

```json
"sink": {
    "type": "SqlDWSink",
    "allowPolyBase": true,
    "polyBaseSettings":
    {
        "rejectType": "percentage",
        "rejectValue": 10.0,
        "rejectSampleValue": 100,
        "useTypeDefault": true
    }
}
```

#### Example 2: Upsert data

```json
"sink": {
    "type": "SqlDWSink",
    "writeBehavior": "Upsert",
    "upsertSettings": {
        "keys": [
             "<column name>"
        ],
        "interimSchemaName": "<interim schema name>"
    },
}
```

## Parallel copy from Azure Synapse Analytics

The Azure Synapse Analytics connector in copy activity provides built-in data partitioning to copy data in parallel. You can find data partitioning options on the **Source** tab of the copy activity.

:::image type="content" source="./media/connector-sql-server/connector-sql-partition-options.png" alt-text="Screenshot of partition options":::

When you enable partitioned copy, copy activity runs parallel queries against your Azure Synapse Analytics source to load data by partitions. The parallel degree is controlled by the [`parallelCopies`](copy-activity-performance-features.md#parallel-copy) setting on the copy activity. For example, if you set `parallelCopies` to four, the service concurrently generates and runs four queries based on your specified partition option and settings, and each query retrieves a portion of data from your Azure Synapse Analytics.

You are suggested to enable parallel copy with data partitioning especially when you load large amount of data from your Azure Synapse Analytics. The following are suggested configurations for different scenarios. When copying data into file-based data store, it's recommended to write to a folder as multiple files (only specify folder name), in which case the performance is better than writing to a single file.

| Scenario                                                     | Suggested settings                                           |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Full load from large table, with physical partitions.        | **Partition option**: Physical partitions of table. <br><br/>During execution, the service automatically detects the physical partitions, and copies data by partitions. <br><br/>To check if your table has physical partition or not, you can refer to [this query](#sample-query-to-check-physical-partition). |
| Full load from large table, without physical partitions, while with an integer or datetime column for data partitioning. | **Partition options**: Dynamic range partition.<br>**Partition column** (optional): Specify the column used to partition data. If not specified, the index or primary key column is used.<br/>**Partition upper bound** and **partition lower bound** (optional): Specify if you want to determine the partition stride. This is not for filtering the rows in table, all rows in the table will be partitioned and copied. If not specified, copy activity auto detect the values.<br><br>For example, if your partition column "ID" has values range from 1 to 100, and you set the lower bound as 20 and the upper bound as 80, with parallel copy as 4, the service retrieves data by 4 partitions - IDs in range <=20, [21, 50], [51, 80], and >=81, respectively. |
| Load a large amount of data by using a custom query, without physical partitions, while with an integer or date/datetime column for data partitioning. | **Partition options**: Dynamic range partition.<br>**Query**: `SELECT * FROM <TableName> WHERE ?AdfDynamicRangePartitionCondition AND <your_additional_where_clause>`.<br>**Partition column**: Specify the column used to partition data.<br>**Partition upper bound** and **partition lower bound** (optional): Specify if you want to determine the partition stride. This is not for filtering the rows in table, all rows in the query result will be partitioned and copied. If not specified, copy activity auto detect the value.<br><br>During execution, the service replaces `?AdfRangePartitionColumnName` with the actual column name and value ranges for each partition, and sends to Azure Synapse Analytics. <br>For example, if your partition column "ID" has values range from 1 to 100, and you set the lower bound as 20 and the upper bound as 80, with parallel copy as 4, the service retrieves data by 4 partitions- IDs in range <=20, [21, 50], [51, 80], and >=81, respectively. <br><br>Here are more sample queries for different scenarios:<br> 1. Query the whole table: <br>`SELECT * FROM <TableName> WHERE ?AdfDynamicRangePartitionCondition`<br> 2. Query from a table with column selection and additional where-clause filters: <br>`SELECT <column_list> FROM <TableName> WHERE ?AdfDynamicRangePartitionCondition AND <your_additional_where_clause>`<br> 3. Query with subqueries: <br>`SELECT <column_list> FROM (<your_sub_query>) AS T WHERE ?AdfDynamicRangePartitionCondition AND <your_additional_where_clause>`<br> 4. Query with partition in subquery: <br>`SELECT <column_list> FROM (SELECT <your_sub_query_column_list> FROM <TableName> WHERE ?AdfDynamicRangePartitionCondition) AS T`
|

Best practices to load data with partition option:

1. Choose distinctive column as partition column (like primary key or unique key) to avoid data skew. 
2. If the table has built-in partition, use partition option "Physical partitions of table" to get better performance.
3. If you use Azure Integration Runtime to copy data, you can set larger "[Data Integration Units (DIU)](copy-activity-performance-features.md#data-integration-units)" (>4) to utilize more computing resource. Check the applicable scenarios there.
4. "[Degree of copy parallelism](copy-activity-performance-features.md#parallel-copy)" control the partition numbers, setting this number too large sometime hurts the performance, recommend setting this number as (DIU or number of Self-hosted IR nodes) * (2 to 4).
5. Note Azure Synapse Analytics can execute a maximum of 32 queries at a moment, setting "Degree of copy parallelism" too large may cause a Synapse throttling issue.

**Example: full load from large table with physical partitions**

```json
"source": {
    "type": "SqlDWSource",
    "partitionOption": "PhysicalPartitionsOfTable"
}
```

**Example: query with dynamic range partition**

```json
"source": {
    "type": "SqlDWSource",
    "query": "SELECT * FROM <TableName> WHERE ?AdfDynamicRangePartitionCondition AND <your_additional_where_clause>",
    "partitionOption": "DynamicRange",
    "partitionSettings": {
        "partitionColumnName": "<partition_column_name>",
        "partitionUpperBound": "<upper_value_of_partition_column (optional) to decide the partition stride, not as data filter>",
        "partitionLowerBound": "<lower_value_of_partition_column (optional) to decide the partition stride, not as data filter>"
    }
}
```

### Sample query to check physical partition

```sql
SELECT DISTINCT s.name AS SchemaName, t.name AS TableName, c.name AS ColumnName, CASE WHEN c.name IS NULL THEN 'no' ELSE 'yes' END AS HasPartition
FROM sys.tables AS t
LEFT JOIN sys.objects AS o ON t.object_id = o.object_id
LEFT JOIN sys.schemas AS s ON o.schema_id = s.schema_id
LEFT JOIN sys.indexes AS i ON t.object_id = i.object_id
LEFT JOIN sys.index_columns AS ic ON ic.partition_ordinal > 0 AND ic.index_id = i.index_id AND ic.object_id = t.object_id
LEFT JOIN sys.columns AS c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
LEFT JOIN sys.types AS y ON c.system_type_id = y.system_type_id
WHERE s.name='[your schema]' AND t.name = '[your table name]'
```

If the table has physical partition, you would see "HasPartition" as "yes".

## <a name="use-copy-statement"></a> Use COPY statement to load data into Azure Synapse Analytics

Using [COPY statement](/sql/t-sql/statements/copy-into-transact-sql) is a simple and flexible way to load data into Azure Synapse Analytics with high throughput. To learn more details, check [Bulk load data using the COPY statement](../synapse-analytics/sql-data-warehouse/quickstart-bulk-load-copy-tsql.md)


- If your source data is in **Azure Blob or Azure Data Lake Storage Gen2**, and the **format is COPY statement compatible**, you can use copy activity to directly invoke COPY statement to let Azure Synapse Analytics pull the data from source. For details, see **[Direct copy by using COPY statement](#direct-copy-by-using-copy-statement)**.
- If your source data store and format isn't originally supported by COPY statement, use the **[Staged copy by using COPY statement](#staged-copy-by-using-copy-statement)** feature instead. The staged copy feature also provides you better throughput. It automatically converts the data into COPY statement compatible format, stores the data in Azure Blob storage, then calls COPY statement to load data into Azure Synapse Analytics.

>[!TIP]
>When using COPY statement with Azure Integration Runtime, effective [Data Integration Units (DIU)](copy-activity-performance-features.md#data-integration-units) is always 2. Tuning the DIU doesn't impact the performance, as loading data from storage is powered by the Azure Synapse engine.

### Direct copy by using COPY statement

Azure Synapse Analytics COPY statement directly supports Azure Blob, Azure Data Lake Storage Gen1 and Azure Data Lake Storage Gen2. If your source data meets the criteria described in this section, use COPY statement to copy directly from the source data store to Azure Synapse Analytics. Otherwise, use [Staged copy by using COPY statement](#staged-copy-by-using-copy-statement). the service checks the settings and fails the copy activity run if the criteria is not met.

1. The **source linked service and format** are with the following types and authentication methods:

    | Supported source data store type                             | Supported format           | Supported source authentication type                         |
    | :----------------------------------------------------------- | -------------------------- | :----------------------------------------------------------- |
    | [Azure Blob](connector-azure-blob-storage.md)                | [Delimited text](format-delimited-text.md)             | Account key authentication, shared access signature authentication, service principal authentication, system-assigned managed identity authentication |
    | &nbsp;                                                       | [Parquet](format-parquet.md)                    | Account key authentication, shared access signature authentication |
    | &nbsp;                                                       | [ORC](format-orc.md)                        | Account key authentication, shared access signature authentication |
    | [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md) | [Delimited text](format-delimited-text.md)<br/>[Parquet](format-parquet.md)<br/>[ORC](format-orc.md) | Account key authentication, service principal authentication, system-assigned managed identity authentication |

    >[!IMPORTANT]
    >- When you use managed identity authentication for your storage linked service, learn the needed configurations for [Azure Blob](connector-azure-blob-storage.md#managed-identity) and [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md#managed-identity) respectively.
    >- If your Azure Storage is configured with VNet service endpoint, you must use managed identity authentication with "allow trusted Microsoft service" enabled on storage account, refer to [Impact of using VNet Service Endpoints with Azure storage](/azure/azure-sql/database/vnet-service-endpoint-rule-overview#impact-of-using-virtual-network-service-endpoints-with-azure-storage).

2. Format settings are with the following:

   1. For **Parquet**: `compression` can be **no compression**, **Snappy**, or **``GZip``**.
   2. For **ORC**: `compression` can be **no compression**, **```zlib```**, or **Snappy**.
   3. For **Delimited text**:
      1. `rowDelimiter` is explicitly set as **single character** or "**\r\n**", the default value is not supported.
      2. `nullValue` is left as default or set to **empty string** ("").
      3. `encodingName` is left as default or set to **utf-8 or utf-16**.
      4. `escapeChar` must be same as `quoteChar`, and is not empty.
      5. `skipLineCount` is left as default or set to 0.
      6. `compression` can be **no compression** or **``GZip``**.

3. If your source is a folder, `recursive` in copy activity must be set to true, and `wildcardFilename` need to be `*` or `*.*`. 

4. `wildcardFolderPath` , `wildcardFilename` (other than `*`or `*.*`), `modifiedDateTimeStart`, `modifiedDateTimeEnd`, `prefix`, `enablePartitionDiscovery` and `additionalColumns` are not specified.

The following COPY statement settings are supported under `allowCopyCommand` in copy activity:

| Property          | Description                                                  | Required                                      |
| :---------------- | :----------------------------------------------------------- | :-------------------------------------------- |
| defaultValues | Specifies the default values for each target column in Azure Synapse Analytics.  The default values in the property overwrite the DEFAULT constraint set in the data warehouse, and identity column cannot have a default value. | No |
| additionalOptions | Additional options that will be passed to an Azure Synapse Analytics COPY statement directly in "With" clause in [COPY statement](/sql/t-sql/statements/copy-into-transact-sql). Quote the value as needed to align with the COPY statement requirements. | No |

```json
"activities":[
    {
        "name": "CopyFromAzureBlobToSQLDataWarehouseViaCOPY",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "ParquetDataset",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "AzureSQLDWDataset",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "ParquetSource",
                "storeSettings":{
                    "type": "AzureBlobStorageReadSettings",
                    "recursive": true
                }
            },
            "sink": {
                "type": "SqlDWSink",
                "allowCopyCommand": true,
                "copyCommandSettings": {
                    "defaultValues": [
                        {
                            "columnName": "col_string",
                            "defaultValue": "DefaultStringValue"
                        }
                    ],
                    "additionalOptions": {
                        "MAXERRORS": "10000",
                        "DATEFORMAT": "'ymd'"
                    }
                }
            },
            "enableSkipIncompatibleRow": true
        }
    }
]
```

### Staged copy by using COPY statement

When your source data is not natively compatible with COPY statement, enable data copying via an interim staging Azure Blob or Azure Data Lake Storage Gen2 (it can't be Azure Premium Storage). In this case, the service automatically converts the data to meet the data format requirements of COPY statement. Then it invokes COPY statement to load data into Azure Synapse Analytics. Finally, it cleans up your temporary data from the storage. See [Staged copy](copy-activity-performance-features.md#staged-copy) for details about copying data via a staging.

To use this feature, create an [Azure Blob Storage linked service](connector-azure-blob-storage.md#linked-service-properties) or [Azure Data Lake Storage Gen2 linked service](connector-azure-data-lake-storage.md#linked-service-properties) with **account key or system-managed identity authentication** that refers to the Azure storage account as the interim storage.

>[!IMPORTANT]
>- When you use managed identity authentication for your staging linked service, learn the needed configurations for [Azure Blob](connector-azure-blob-storage.md#managed-identity) and [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md#managed-identity) respectively. You also need to grant permissions to your Azure Synapse Analytics workspace managed identity in your staging Azure Blob Storage or Azure Data Lake Storage Gen2 account. To learn how to grant this permission, see [Grant permissions to workspace managed identity](/azure/synapse-analytics/security/how-to-grant-workspace-managed-identity-permissions).
>- If your staging Azure Storage is configured with VNet service endpoint, you must use managed identity authentication with "allow trusted Microsoft service" enabled on storage account, refer to [Impact of using VNet Service Endpoints with Azure storage](/azure/azure-sql/database/vnet-service-endpoint-rule-overview#impact-of-using-virtual-network-service-endpoints-with-azure-storage). 

>[!IMPORTANT]
>If your staging Azure Storage is configured with Managed Private Endpoint and has the storage firewall enabled, you must use managed identity authentication and grant Storage Blob Data Reader permissions to the Synapse SQL Server to ensure it can access the staged files during the COPY statement load.

```json
"activities":[
    {
        "name": "CopyFromSQLServerToSQLDataWarehouseViaCOPYstatement",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "SQLServerDataset",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "AzureSQLDWDataset",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "SqlSource",
            },
            "sink": {
                "type": "SqlDWSink",
                "allowCopyCommand": true
            },
            "stagingSettings": {
                "linkedServiceName": {
                    "referenceName": "MyStagingStorage",
                    "type": "LinkedServiceReference"
                }
            }
        }
    }
]
```

## Use PolyBase to load data into Azure Synapse Analytics

Using [PolyBase](/sql/relational-databases/polybase/polybase-guide) is an efficient way to load a large amount of data into Azure Synapse Analytics with high throughput. You'll see a large gain in the throughput by using PolyBase instead of the default BULKINSERT mechanism. For a walkthrough with a use case, see [Load 1 TB into Azure Synapse Analytics](v1/data-factory-load-sql-data-warehouse.md).

- If your source data is in **Azure Blob, Azure Data Lake Storage Gen1 or Azure Data Lake Storage Gen2**, and the **format is PolyBase compatible**, you can use copy activity to directly invoke PolyBase to let Azure Synapse Analytics pull the data from source. For details, see **[Direct copy by using PolyBase](#direct-copy-by-using-polybase)**.
- If your source data store and format isn't originally supported by PolyBase, use the **[Staged copy by using PolyBase](#staged-copy-by-using-polybase)** feature instead. The staged copy feature also provides you better throughput. It automatically converts the data into PolyBase-compatible format, stores the data in Azure Blob storage, then calls PolyBase to load data into Azure Synapse Analytics.

> [!TIP]
> Learn more on [Best practices for using PolyBase](#best-practices-for-using-polybase). When using PolyBase with Azure Integration Runtime, effective [Data Integration Units (DIU)](copy-activity-performance-features.md#data-integration-units) for direct or staged storage-to-Synapse is always 2. Tuning the DIU doesn't impact the performance, as loading data from storage is powered by Synapse engine.

The following PolyBase settings are supported under `polyBaseSettings` in copy activity:

| Property          | Description                                                  | Required                                      |
| :---------------- | :----------------------------------------------------------- | :-------------------------------------------- |
| rejectValue       | Specifies the number or percentage of rows that can be rejected before the query fails.<br/><br/>Learn more about PolyBase's reject options in the Arguments section of [CREATE EXTERNAL TABLE (Transact-SQL)](/sql/t-sql/statements/create-external-table-transact-sql). <br/><br/>Allowed values are 0 (default), 1, 2, etc. | No                                            |
| rejectType        | Specifies whether the **rejectValue** option is a literal value or a percentage.<br/><br/>Allowed values are **Value** (default) and **Percentage**. | No                                            |
| rejectSampleValue | Determines the number of rows to retrieve before PolyBase recalculates the percentage of rejected rows.<br/><br/>Allowed values are 1, 2, etc. | Yes, if the **rejectType** is **percentage**. |
| useTypeDefault    | Specifies how to handle missing values in delimited text files when PolyBase retrieves data from the text file.<br/><br/>Learn more about this property from the Arguments section in [CREATE EXTERNAL FILE FORMAT (Transact-SQL)](/sql/t-sql/statements/create-external-file-format-transact-sql).<br/><br/>Allowed values are **True** and **False** (default).<br><br> | No                                            |

### Direct copy by using PolyBase

Azure Synapse Analytics PolyBase directly supports Azure Blob, Azure Data Lake Storage Gen1 and Azure Data Lake Storage Gen2. If your source data meets the criteria described in this section, use PolyBase to copy directly from the source data store to Azure Synapse Analytics. Otherwise, use [Staged copy by using PolyBase](#staged-copy-by-using-polybase).

> [!TIP]
> To copy data efficiently to Azure Synapse Analytics, learn more from [Azure Data Factory makes it even easier and convenient to uncover insights from data when using Data Lake Store with Azure Synapse Analytics](/archive/blogs/azuredatalake/azure-data-factory-makes-it-even-easier-and-convenient-to-uncover-insights-from-data-when-using-data-lake-store-with-sql-data-warehouse).

If the requirements aren't met, the service checks the settings and automatically falls back to the BULKINSERT mechanism for the data movement.

1. The **source linked service** is with the following types and authentication methods:

    | Supported source data store type                             | Supported source authentication type                        |
    | :----------------------------------------------------------- | :---------------------------------------------------------- |
    | [Azure Blob](connector-azure-blob-storage.md)                | Account key authentication, system-assigned managed identity authentication |
    | [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md) | Service principal authentication                            |
    | [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md) | Account key authentication, system-assigned managed identity authentication |

    >[!IMPORTANT]
    >- When you use managed identity authentication for your storage linked service, learn the needed configurations for [Azure Blob](connector-azure-blob-storage.md#managed-identity) and [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md#managed-identity) respectively.
    >- If your Azure Storage is configured with VNet service endpoint, you must use managed identity authentication with "allow trusted Microsoft service" enabled on storage account, refer to [Impact of using VNet Service Endpoints with Azure storage](/azure/azure-sql/database/vnet-service-endpoint-rule-overview#impact-of-using-virtual-network-service-endpoints-with-azure-storage).

2. The **source data format** is of **Parquet**, **ORC**, or **Delimited text**, with the following configurations:

   1. Folder path doesn't contain wildcard filter.
   2. File name is empty, or points to a single file. If you specify wildcard file name in copy activity, it can only be `*` or `*.*`.
   3. `rowDelimiter` is **default**, **\n**, **\r\n**, or **\r**.
   4. `nullValue` is left as default or set to **empty string** (""), and `treatEmptyAsNull` is left as default or set to true.
   5. `encodingName` is left as default or set to **utf-8**.
   6. `quoteChar`, `escapeChar`, and `skipLineCount` aren't specified. PolyBase support skip header row, which can be configured as `firstRowAsHeader`.
   7. `compression` can be **no compression**, **``GZip``**, or **Deflate**.

3. If your source is a folder, `recursive` in copy activity must be set to true.

4. `wildcardFolderPath` , `wildcardFilename`, `modifiedDateTimeStart`, `modifiedDateTimeEnd`, `prefix`, `enablePartitionDiscovery`, and `additionalColumns` are not specified.

>[!NOTE]
>If your source is a folder, note PolyBase retrieves files from the folder and all of its subfolders, and it doesn't retrieve data from files for which the file name begins with an underline (_) or a period (.), as documented [here - LOCATION argument](/sql/t-sql/statements/create-external-table-transact-sql#arguments-2).

```json
"activities":[
    {
        "name": "CopyFromAzureBlobToSQLDataWarehouseViaPolyBase",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "ParquetDataset",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "AzureSQLDWDataset",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "ParquetSource",
                "storeSettings":{
                    "type": "AzureBlobStorageReadSettings",
                    "recursive": true
                }
            },
            "sink": {
                "type": "SqlDWSink",
                "allowPolyBase": true
            }
        }
    }
]
```

### Staged copy by using PolyBase

When your source data is not natively compatible with PolyBase, enable data copying via an interim staging Azure Blob or Azure Data Lake Storage Gen2 (it can't be Azure Premium Storage). In this case, the service automatically converts the data to meet the data format requirements of PolyBase. Then it invokes PolyBase to load data into Azure Synapse Analytics. Finally, it cleans up your temporary data from the storage. See [Staged copy](copy-activity-performance-features.md#staged-copy) for details about copying data via a staging.

To use this feature, create an [Azure Blob Storage linked service](connector-azure-blob-storage.md#linked-service-properties) or [Azure Data Lake Storage Gen2 linked service](connector-azure-data-lake-storage.md#linked-service-properties) with **account key or managed identity authentication** that refers to the Azure storage account as the interim storage.

>[!IMPORTANT]
>- When you use managed identity authentication for your staging linked service, learn the needed configurations for [Azure Blob](connector-azure-blob-storage.md#managed-identity) and [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md#managed-identity) respectively. You also need to grant permissions to your Azure Synapse Analytics workspace managed identity in your staging Azure Blob Storage or Azure Data Lake Storage Gen2 account. To learn how to grant this permission, see [Grant permissions to workspace managed identity](/azure/synapse-analytics/security/how-to-grant-workspace-managed-identity-permissions).
>- If your staging Azure Storage is configured with VNet service endpoint, you must use managed identity authentication with "allow trusted Microsoft service" enabled on storage account, refer to [Impact of using VNet Service Endpoints with Azure storage](/azure/azure-sql/database/vnet-service-endpoint-rule-overview#impact-of-using-virtual-network-service-endpoints-with-azure-storage). 

>[!IMPORTANT]
>If your staging Azure Storage is configured with Managed Private Endpoint and has the storage firewall enabled, you must use managed identity authentication and grant Storage Blob Data Reader permissions to the Synapse SQL Server to ensure it can access the staged files during the PolyBase load.

```json
"activities":[
    {
        "name": "CopyFromSQLServerToSQLDataWarehouseViaPolyBase",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "SQLServerDataset",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "AzureSQLDWDataset",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "SqlSource",
            },
            "sink": {
                "type": "SqlDWSink",
                "allowPolyBase": true
            },
            "enableStaging": true,
            "stagingSettings": {
                "linkedServiceName": {
                    "referenceName": "MyStagingStorage",
                    "type": "LinkedServiceReference"
                }
            }
        }
    }
]
```

### Best practices for using PolyBase

The following sections provide best practices in addition to those practices mentioned in [Best practices for Azure Synapse Analytics](../synapse-analytics/sql/best-practices-dedicated-sql-pool.md).

#### Required database permission

To use PolyBase, the user that loads data into Azure Synapse Analytics must have ["CONTROL" permission](/sql/relational-databases/security/permissions-database-engine) on the target database. One way to achieve that is to add the user as a member of the **db_owner** role. Learn how to do that in the [Azure Synapse Analytics overview](../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-manage-security.md#authorization).

#### Row size and data type limits

PolyBase loads are limited to rows smaller than 1 MB. It cannot be used to load to VARCHR(MAX), NVARCHAR(MAX), or VARBINARY(MAX). For more information, see [Azure Synapse Analytics service capacity limits](../synapse-analytics/sql-data-warehouse/sql-data-warehouse-service-capacity-limits.md#loads).

When your source data has rows greater than 1 MB, you might want to vertically split the source tables into several small ones. Make sure that the largest size of each row doesn't exceed the limit. The smaller tables can then be loaded by using PolyBase and merged together in Azure Synapse Analytics.

Alternatively, for data with such wide columns, you can use non-PolyBase to load the data by turning off "allow PolyBase" setting.

#### Azure Synapse Analytics resource class

To achieve the best possible throughput, assign a larger resource class to the user that loads data into Azure Synapse Analytics via PolyBase.

#### PolyBase troubleshooting

#### Loading to Decimal column

If your source data is in text format or other non-PolyBase compatible stores (using staged copy and PolyBase), and it contains empty value to be loaded into Azure Synapse Analytics Decimal column, you may get the following error:

```output
ErrorCode=FailedDbOperation, ......HadoopSqlException: Error converting data type VARCHAR to DECIMAL.....Detailed Message=Empty string can't be converted to DECIMAL.....
```

The solution is to unselect "**Use type default**" option (as false) in copy activity sink -> PolyBase settings. "[USE_TYPE_DEFAULT](/sql/t-sql/statements/create-external-file-format-transact-sql#arguments)" is a PolyBase native configuration, which specifies how to handle missing values in delimited text files when PolyBase retrieves data from the text file.

#### Check the tableName property in Azure Synapse Analytics

The following table gives examples of how to specify the **tableName** property in the JSON dataset. It shows several combinations of schema and table names.

| DB Schema | Table name | **tableName** JSON property               |
| --------- | ---------- | ----------------------------------------- |
| dbo       | MyTable    | MyTable or dbo.MyTable or [dbo].[MyTable] |
| dbo1      | MyTable    | dbo1.MyTable or [dbo1].[MyTable]          |
| dbo       | My.Table   | [My.Table] or [dbo].[My.Table]            |
| dbo1      | My.Table   | [dbo1].[My.Table]                         |

If you see the following error, the problem might be the value you specified for the **tableName** property. See the preceding table for the correct way to specify values for the **tableName** JSON property.

```output
Type=System.Data.SqlClient.SqlException,Message=Invalid object name 'stg.Account_test'.,Source=.Net SqlClient Data Provider
```

#### Columns with default values

Currently, the PolyBase feature accepts only the same number of columns as in the target table. An example is a table with four columns where one of them is defined with a default value. The input data still needs to have four columns. A three-column input dataset yields an error similar to the following message:

```output
All columns of the table must be specified in the INSERT BULK statement.
```

The NULL value is a special form of the default value. If the column is nullable, the input data in the blob for that column might be empty. But it can't be missing from the input dataset. PolyBase inserts NULL for missing values in Azure Synapse Analytics.

#### External file access failed

If you receive the following error, ensure that you are using managed identity authentication and have granted Storage Blob Data Reader permissions to the Azure Synapse workspace's managed identity.

```output
Job failed due to reason: at Sink '[SinkName]': shaded.msdataflow.com.microsoft.sqlserver.jdbc.SQLServerException: External file access failed due to internal error: 'Error occurred while accessing HDFS: Java exception raised on call to HdfsBridge_IsDirExist. Java exception message:\r\nHdfsBridge::isDirExist 
```

For more information, see [Grant permissions to managed identity after workspace creation](../synapse-analytics/security/how-to-grant-workspace-managed-identity-permissions.md#grant-permissions-to-managed-identity-after-workspace-creation).

## Mapping data flow properties

When transforming data in mapping data flow, you can read and write to tables from Azure Synapse Analytics. For more information, see the [source transformation](data-flow-source.md) and [sink transformation](data-flow-sink.md) in mapping data flows.

### Source transformation

Settings specific to Azure Synapse Analytics are available in the **Source Options** tab of the source transformation.

**Input** Select whether you point your source at a table (equivalent of ```Select * from <table-name>```) or enter a custom SQL query.

**Enable Staging** It is highly recommended that you use this option in production workloads with Azure Synapse Analytics sources. When you execute a [data flow activity](control-flow-execute-data-flow-activity.md) with Azure Synapse Analytics sources from a pipeline, you will be prompted for a staging location storage account and will use that for staged data loading. It is the fastest mechanism to load data from Azure Synapse Analytics.

- When you use managed identity authentication for your storage linked service, learn the needed configurations for [Azure Blob](connector-azure-blob-storage.md#managed-identity) and [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md#managed-identity) respectively.
- If your Azure Storage is configured with VNet service endpoint, you must use managed identity authentication with "allow trusted Microsoft service" enabled on storage account, refer to [Impact of using VNet Service Endpoints with Azure storage](/azure/azure-sql/database/vnet-service-endpoint-rule-overview#impact-of-using-virtual-network-service-endpoints-with-azure-storage).
- When you use Azure Synapse **serverless** SQL pool as source, enable staging is not supported.

**Query**: If you select Query in the input field, enter a SQL query for your source. This setting overrides any table that you've chosen in the dataset. **Order By** clauses aren't supported here, but you can set a full SELECT FROM statement. You can also use user-defined table functions. **select * from udfGetData()** is a UDF in SQL that returns a table. This query will produce a source table that you can use in your data flow. Using queries is also a great way to reduce rows for testing or for lookups.

SQL Example: ```Select * from MyTable where customerId > 1000 and customerId < 2000```

**Batch size**: Enter a batch size to chunk large data into reads. In data flows, this setting will be used to set Spark columnar caching. This is an option field, which will use Spark defaults if it is left blank.

**Isolation Level**: The default for SQL sources in mapping data flow is read uncommitted. You can change the isolation level here to one of these values:

- Read Committed
- Read Uncommitted
- Repeatable Read
- Serializable
- None (ignore isolation level)

:::image type="content" source="media/data-flow/isolationlevel.png" alt-text="Isolation Level":::

### Sink transformation

Settings specific to Azure Synapse Analytics are available in the **Settings** tab of the sink transformation.

**Update method:** Determines what operations are allowed on your database destination. The default is to only allow inserts. To update, upsert, or delete rows, an alter-row transformation is required to tag rows for those actions. For updates, upserts and deletes, a key column or columns must be set to determine which row to alter.

**Table action:** Determines whether to recreate or remove all rows from the destination table prior to writing.

- None: No action will be done to the table.
- Recreate: The table will get dropped and recreated. Required if creating a new table dynamically.
- Truncate: All rows from the target table will get removed.

**Enable staging:** This enables loading into Azure Synapse Analytics SQL Pools using the copy command and is recommended for most Synapse sinks. The staging storage is configured in [Execute Data Flow activity](control-flow-execute-data-flow-activity.md). 

- When you use managed identity authentication for your storage linked service, learn the needed configurations for [Azure Blob](connector-azure-blob-storage.md#managed-identity) and [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md#managed-identity) respectively.
- If your Azure Storage is configured with VNet service endpoint, you must use managed identity authentication with "allow trusted Microsoft service" enabled on storage account, refer to [Impact of using VNet Service Endpoints with Azure storage](/azure/azure-sql/database/vnet-service-endpoint-rule-overview#impact-of-using-virtual-network-service-endpoints-with-azure-storage).

**Batch size**: Controls how many rows are being written in each bucket. Larger batch sizes improve compression and memory optimization, but risk out of memory exceptions when caching data.

**Use sink schema**: By default, a temporary table will be created under the sink schema as staging. You can alternatively uncheck the **Use sink schema** option and instead, in **Select user DB schema**, specify a schema name under which Data Factory will create a staging table to load upstream data and automatically clean them up upon completion. Make sure you have create table permission in the database and alter permission on the schema.

:::image type="content" source="media/data-flow/use-sink-schema.png" alt-text="Screenshot showing the data flow 'Use sink schema'.":::

**Pre and Post SQL scripts**: Enter multi-line SQL scripts that will execute before (pre-processing) and after (post-processing) data is written to your Sink database

:::image type="content" source="media/data-flow/synapse-pre-post-sql-scripts.png" alt-text="Screenshot showing pre and post SQL processing scripts in Azure Synapse Analytics data flow.":::

> [!TIP]
> 1. It's recommended to break single batch scripts with multiple commands into multiple batches.
> 2. Only Data Definition Language (DDL) and Data Manipulation Language (DML) statements that return a simple update count can be run as part of a batch. Learn more from [Performing batch operations](/sql/connect/jdbc/performing-batch-operations)

### Error row handling

When writing to Azure Synapse Analytics, certain rows of data may fail due to constraints set by the destination. Some common errors include:

*    String or binary data would be truncated in table
*    Cannot insert the value NULL into column
*    Conversion failed when converting the value to data type

By default, a data flow run will fail on the first error it gets. You can choose to **Continue on error** that allows your data flow to complete even if individual rows have errors. The service provides different options for you to handle these error rows.

**Transaction Commit:** Choose whether your data gets written in a single transaction or in batches. Single transaction will provide better performance and no data written will be visible to others until the transaction completes. Batch transactions have worse performance but can work for large datasets.

**Output rejected data:** If enabled, you can output the error rows into a csv file in Azure Blob Storage or an Azure Data Lake Storage Gen2 account of your choosing. This will write the error rows with three additional columns: the SQL operation like INSERT or UPDATE, the data flow error code, and the error message on the row.

**Report success on error:** If enabled, the data flow will be marked as a success even if error rows are found. 

:::image type="content" source="media/data-flow/sql-error-row-handling.png" alt-text="Diagram that shows the error row handling in mapping data flow sink transformation.":::

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## GetMetadata activity properties

To learn details about the properties, check [GetMetadata activity](control-flow-get-metadata-activity.md)

## Data type mapping for Azure Synapse Analytics

When you copy data from or to Azure Synapse Analytics, the following mappings are used from Azure Synapse Analytics data types to Azure Data Factory interim data types. These mappings are also used when copying data from or to Azure Synapse Analytics using Synapse pipelines, since pipelines also implement Azure Data Factory within Azure Synapse. See [schema and data type mappings](copy-activity-schema-and-type-mapping.md) to learn how Copy Activity maps the source schema and data type to the sink.

>[!TIP]
>Refer to [Table data types in Azure Synapse Analytics](../synapse-analytics/sql/develop-tables-data-types.md) article on Azure Synapse Analytics supported data types and the workarounds for unsupported ones.

| Azure Synapse Analytics data type    | Data Factory interim data type |
| :------------------------------------ | :----------------------------- |
| bigint                                | Int64                          |
| binary                                | Byte[]                         |
| bit                                   | Boolean                        |
| char                                  | String, Char[]                 |
| date                                  | DateTime                       |
| Datetime                              | DateTime                       |
| datetime2                             | DateTime                       |
| Datetimeoffset                        | DateTimeOffset                 |
| Decimal                               | Decimal                        |
| FILESTREAM attribute (varbinary(max)) | Byte[]                         |
| Float                                 | Double                         |
| image                                 | Byte[]                         |
| int                                   | Int32                          |
| money                                 | Decimal                        |
| nchar                                 | String, Char[]                 |
| numeric                               | Decimal                        |
| nvarchar                              | String, Char[]                 |
| real                                  | Single                         |
| rowversion                            | Byte[]                         |
| smalldatetime                         | DateTime                       |
| smallint                              | Int16                          |
| smallmoney                            | Decimal                        |
| time                                  | TimeSpan                       |
| tinyint                               | Byte                           |
| uniqueidentifier                      | Guid                           |
| varbinary                             | Byte[]                         |
| varchar                               | String, Char[]                 |

## Next steps

For a list of data stores supported as sources and sinks by Copy Activity, see [supported data stores and formats](copy-activity-overview.md#supported-data-stores-and-formats).
