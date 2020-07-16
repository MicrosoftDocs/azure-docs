---
title: Copy data to and from Azure SQL Managed Instance
description: Learn how to move data to and from Azure SQL Managed Instance by using Azure Data Factory.
services: data-factory
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.author: jingwang
author: linda33wj
manager: shwang
ms.reviewer: douglasl
ms.custom: seo-lt-2019
ms.date: 05/29/2020
---

# Copy data to and from Azure SQL Managed Instance by using Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the copy activity in Azure Data Factory to copy data to and from Azure SQL Managed Instance. It builds on the [Copy activity overview](copy-activity-overview.md) article that presents a general overview of the copy activity.

## Supported capabilities

This SQL Managed Instance connector is supported for the following activities:

- [Copy activity](copy-activity-overview.md) with [supported source/sink matrix](copy-activity-overview.md)
- [Lookup activity](control-flow-lookup-activity.md)
- [GetMetadata activity](control-flow-get-metadata-activity.md)

You can copy data from SQL Managed Instance to any supported sink data store. You also can copy data from any supported source data store to the SQL Managed Instance. For a list of data stores that are supported as sources and sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this SQL Managed Instance connector supports:

- Copying data by using SQL authentication and Azure Active Directory (Azure AD) Application token authentication with a service principal or managed identities for Azure resources.
- As a source, retrieving data by using a SQL query or a stored procedure.
- As a sink, automatically creating destination table if not exists based on the source schema; appending data to a table or invoking a stored procedure with custom logic during copy.

>[!NOTE]
> SQL Managed Instance [Always Encrypted](https://docs.microsoft.com/sql/relational-databases/security/encryption/always-encrypted-database-engine?view=azuresqldb-mi-current) isn't supported by this connector now. To work around, you can use a [generic ODBC connector](connector-odbc.md) and a SQL Server ODBC driver via a self-hosted integration runtime. Learn more from [Using Always Encrypted](#using-always-encrypted) section. 

## Prerequisites

To access the SQL Managed Instance [public endpoint](../azure-sql/managed-instance/public-endpoint-overview.md), you can use an Azure Data Factory managed Azure integration runtime. Make sure that you enable the public endpoint and also allow public endpoint traffic on the network security group so that Azure Data Factory can connect to your database. For more information, see [this guidance](../azure-sql/managed-instance/public-endpoint-configure.md).

To access the SQL Managed Instance private endpoint, set up a [self-hosted integration runtime](create-self-hosted-integration-runtime.md) that can access the database. If you provision the self-hosted integration runtime in the same virtual network as your managed instance, make sure that your integration runtime machine is in a different subnet than your managed instance. If you provision your self-hosted integration runtime in a different virtual network than your managed instance, you can use either a virtual network peering or a virtual network to virtual network connection. For more information, see [Connect your application to SQL Managed Instance](../azure-sql/managed-instance/connect-application-instance.md).

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Azure Data Factory entities specific to the SQL Managed Instance connector.

## Linked service properties

The following properties are supported for the SQL Managed Instance linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **AzureSqlMI**. | Yes |
| connectionString |This property specifies the **connectionString** information that's needed to connect to SQL Managed Instance by using SQL authentication. For more information, see the following examples. <br/>The default port is 1433. If you're using SQL Managed Instance with a public endpoint, explicitly specify port 3342.<br> You also can put a password in Azure Key Vault. If it's SQL authentication, pull the `password` configuration out of the connection string. For more information, see the JSON example following the table and [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md). |Yes |
| servicePrincipalId | Specify the application's client ID. | Yes, when you use Azure AD authentication with a service principal |
| servicePrincipalKey | Specify the application's key. Mark this field as **SecureString** to store it securely in Azure Data Factory or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes, when you use Azure AD authentication with a service principal |
| tenant | Specify the tenant information, like the domain name or tenant ID, under which your application resides. Retrieve it by hovering the mouse in the upper-right corner of the Azure portal. | Yes, when you use Azure AD authentication with a service principal |
| connectVia | This [integration runtime](concepts-integration-runtime.md) is used to connect to the data store. You can use a self-hosted integration runtime or an Azure integration runtime if your managed instance has a public endpoint and allows Azure Data Factory to access it. If not specified, the default Azure integration runtime is used. |Yes |

For different authentication types, refer to the following sections on prerequisites and JSON samples, respectively:

- [SQL authentication](#sql-authentication)
- [Azure AD application token authentication: Service principal](#service-principal-authentication)
- [Azure AD application token authentication: Managed identities for Azure resources](#managed-identity)

### SQL authentication

**Example 1: use SQL authentication**

```json
{
    "name": "AzureSqlMILinkedService",
    "properties": {
        "type": "AzureSqlMI",
        "typeProperties": {
            "connectionString": "Data Source=<hostname,port>;Initial Catalog=<databasename>;Integrated Security=False;User ID=<username>;Password=<password>;"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

**Example 2: use SQL authentication with a password in Azure Key Vault**

```json
{
    "name": "AzureSqlMILinkedService",
    "properties": {
        "type": "AzureSqlMI",
        "typeProperties": {
            "connectionString": "Data Source=<hostname,port>;Initial Catalog=<databasename>;Integrated Security=False;User ID=<username>;",
            "password": { 
                "type": "AzureKeyVaultSecret", 
                "store": { 
                    "referenceName": "<Azure Key Vault linked service name>", 
                    "type": "LinkedServiceReference" 
                }, 
                "secretName": "<secretName>" 
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

To use a service principal-based Azure AD application token authentication, follow these steps:

1. Follow the steps to [Provision an Azure Active Directory administrator for your Managed Instance](../azure-sql/database/authentication-aad-configure.md#provision-azure-ad-admin-sql-managed-instance).

2. [Create an Azure Active Directory application](../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal) from the Azure portal. Make note of the application name and the following values that define the linked service:

    - Application ID
    - Application key
    - Tenant ID

3. [Create logins](https://docs.microsoft.com/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-mi-current) for the Azure Data Factory managed identity. In SQL Server Management Studio (SSMS), connect to your managed instance using a SQL Server account that is a **sysadmin**. In **master** database, run the following T-SQL:

    ```sql
    CREATE LOGIN [your application name] FROM EXTERNAL PROVIDER
    ```

4. [Create contained database users](../azure-sql/database/authentication-aad-configure.md#create-contained-users-mapped-to-azure-ad-identities) for the Azure Data Factory managed identity. Connect to the database from or to which you want to copy data, run the following T-SQL: 
  
    ```sql
    CREATE USER [your application name] FROM EXTERNAL PROVIDER
    ```

5. Grant the Data Factory managed identity needed permissions as you normally do for SQL users and others. Run the following code. For more options, see [this document](https://docs.microsoft.com/sql/t-sql/statements/alter-role-transact-sql?view=azuresqldb-mi-current).

    ```sql
    ALTER ROLE [role name e.g. db_owner] ADD MEMBER [your application name]
    ```

6. Configure a SQL Managed Instance linked service in Azure Data Factory.

**Example: use service principal authentication**

```json
{
    "name": "AzureSqlDbLinkedService",
    "properties": {
        "type": "AzureSqlMI",
        "typeProperties": {
            "connectionString": "Data Source=<hostname,port>;Initial Catalog=<databasename>;",
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

### <a name="managed-identity"></a> Managed identities for Azure resources authentication

A data factory can be associated with a [managed identity for Azure resources](data-factory-service-identity.md) that represents the specific data factory. You can use this managed identity for SQL Managed Instance authentication. The designated factory can access and copy data from or to your database by using this identity.

To use managed identity authentication, follow these steps.

1. Follow the steps to [Provision an Azure Active Directory administrator for your Managed Instance](../azure-sql/database/authentication-aad-configure.md#provision-azure-ad-admin-sql-managed-instance).

2. [Create logins](https://docs.microsoft.com/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-mi-current) for the Azure Data Factory managed identity. In SQL Server Management Studio (SSMS), connect to your managed instance using a SQL Server account that is a **sysadmin**. In **master** database, run the following T-SQL:

    ```sql
    CREATE LOGIN [your Data Factory name] FROM EXTERNAL PROVIDER
    ```

3. [Create contained database users](../azure-sql/database/authentication-aad-configure.md#create-contained-users-mapped-to-azure-ad-identities) for the Azure Data Factory managed identity. Connect to the database from or to which you want to copy data, run the following T-SQL: 
  
    ```sql
    CREATE USER [your Data Factory name] FROM EXTERNAL PROVIDER
    ```

4. Grant the Data Factory managed identity needed permissions as you normally do for SQL users and others. Run the following code. For more options, see [this document](https://docs.microsoft.com/sql/t-sql/statements/alter-role-transact-sql?view=azuresqldb-mi-current).

    ```sql
    ALTER ROLE [role name e.g. db_owner] ADD MEMBER [your Data Factory name]
    ```

5. Configure a SQL Managed Instance linked service in Azure Data Factory.

**Example: uses managed identity authentication**

```json
{
    "name": "AzureSqlDbLinkedService",
    "properties": {
        "type": "AzureSqlMI",
        "typeProperties": {
            "connectionString": "Data Source=<hostname,port>;Initial Catalog=<databasename>;"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for use to define datasets, see the datasets article. This section provides a list of properties supported by the SQL Managed Instance dataset.

To copy data to and from SQL Managed Instance, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to **AzureSqlMITable**. | Yes |
| schema | Name of the schema. |No for source, Yes for sink  |
| table | Name of the table/view. |No for source, Yes for sink  |
| tableName | Name of the table/view with schema. This property is supported for backward compatibility. For new workload, use `schema` and `table`. | No for source, Yes for sink |

**Example**

```json
{
    "name": "AzureSqlMIDataset",
    "properties":
    {
        "type": "AzureSqlMITable",
        "linkedServiceName": {
            "referenceName": "<SQL Managed Instance linked service name>",
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

## Copy activity properties

For a full list of sections and properties available for use to define activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by the SQL Managed Instance source and sink.

### SQL Managed Instance as a source

To copy data from SQL Managed Instance, the following properties are supported in the copy activity source section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to **SqlMISource**. | Yes |
| sqlReaderQuery |This property uses the custom SQL query to read data. An example is `select * from MyTable`. |No |
| sqlReaderStoredProcedureName |This property is the name of the stored procedure that reads data from the source table. The last SQL statement must be a SELECT statement in the stored procedure. |No |
| storedProcedureParameters |These parameters are for the stored procedure.<br/>Allowed values are name or value pairs. The names and casing of the parameters must match the names and casing of the stored procedure parameters. |No |
| isolationLevel | Specifies the transaction locking behavior for the SQL source. The allowed values are: **ReadCommitted** (default), **ReadUncommitted**, **RepeatableRead**, **Serializable**, **Snapshot**. Refer to [this doc](https://docs.microsoft.com/dotnet/api/system.data.isolationlevel) for more details. | No |

**Note the following points:**

- If **sqlReaderQuery** is specified for **SqlMISource**, the copy activity runs this query against the SQL Managed Instance source to get the data. You also can specify a stored procedure by specifying **sqlReaderStoredProcedureName** and **storedProcedureParameters** if the stored procedure takes parameters.
- If you don't specify either the **sqlReaderQuery** or **sqlReaderStoredProcedureName** property, the columns defined in the "structure" section of the dataset JSON are used to construct a query. The query `select column1, column2 from mytable` runs against the SQL Managed Instance. If the dataset definition doesn't have "structure," all columns are selected from the table.

**Example: Use a SQL query**

```json
"activities":[
    {
        "name": "CopyFromAzureSqlMI",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<SQL Managed Instance input dataset name>",
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
                "type": "SqlMISource",
                "sqlReaderQuery": "SELECT * FROM MyTable"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

**Example: Use a stored procedure**

```json
"activities":[
    {
        "name": "CopyFromAzureSqlMI",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<SQL Managed Instance input dataset name>",
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
                "type": "SqlMISource",
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

**The stored procedure definition**

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

### SQL Managed Instance as a sink

> [!TIP]
> Learn more about the supported write behaviors, configurations, and best practices from [Best practice for loading data into SQL Managed Instance](#best-practice-for-loading-data-into-sql-managed-instance).

To copy data to SQL Managed Instance, the following properties are supported in the copy activity sink section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity sink must be set to **SqlMISink**. | Yes |
| preCopyScript |This property specifies a SQL query for the copy activity to run before writing data into SQL Managed Instance. It's invoked only once per copy run. You can use this property to clean up preloaded data. |No |
| tableOption | Specifies whether to automatically create the sink table if not exists based on the source schema. Auto table creation is not supported when sink specifies stored procedure or staged copy is configured in copy activity. Allowed values are: `none` (default), `autoCreate`. |No |
| sqlWriterStoredProcedureName | The name of the stored procedure that defines how to apply source data into a target table. <br/>This stored procedure is *invoked per batch*. For operations that run only once and have nothing to do with source data, for example, delete or truncate, use the `preCopyScript` property.<br>See example from [Invoke a stored procedure from a SQL sink](#invoke-a-stored-procedure-from-a-sql-sink). | No |
| storedProcedureTableTypeParameterName |The parameter name of the table type specified in the stored procedure.  |No |
| sqlWriterTableType |The table type name to be used in the stored procedure. The copy activity makes the data being moved available in a temp table with this table type. Stored procedure code can then merge the data that's being copied with existing data. |No |
| storedProcedureParameters |Parameters for the stored procedure.<br/>Allowed values are name and value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. | No |
| writeBatchSize |Number of rows to insert into the SQL table *per batch*.<br/>Allowed values are integers for the number of rows. By default, Azure Data Factory dynamically determines the appropriate batch size based on the row size.  |No |
| writeBatchTimeout |This property specifies the wait time for the batch insert operation to complete before it times out.<br/>Allowed values are for the timespan. An example is “00:30:00,” which is 30 minutes. |No |

**Example 1: Append data**

```json
"activities":[
    {
        "name": "CopyToAzureSqlMI",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<SQL Managed Instance output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "SqlMISink",
                "tableOption": "autoCreate",
                "writeBatchSize": 100000
            }
        }
    }
]
```

**Example 2: Invoke a stored procedure during copy**

Learn more details from [Invoke a stored procedure from a SQL MI sink](#invoke-a-stored-procedure-from-a-sql-sink).

```json
"activities":[
    {
        "name": "CopyToAzureSqlMI",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<SQL Managed Instance output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "SqlMISink",
                "sqlWriterStoredProcedureName": "CopyTestStoredProcedureWithParameters",
                "storedProcedureTableTypeParameterName": "MyTable",
                "sqlWriterTableType": "MyTableType",
                "storedProcedureParameters": {
                    "identifier": { "value": "1", "type": "Int" },
                    "stringData": { "value": "str1" }
                }
            }
        }
    }
]
```

## Best practice for loading data into SQL Managed Instance

When you copy data into SQL Managed Instance, you might require different write behavior:

- [Append](#append-data): My source data has only new records.
- [Upsert](#upsert-data): My source data has both inserts and updates.
- [Overwrite](#overwrite-the-entire-table): I want to reload the entire dimension table each time.
- [Write with custom logic](#write-data-with-custom-logic): I need extra processing before the final insertion into the destination table. 

See the respective sections for how to configure in Azure Data Factory and best practices.

### Append data

Appending data is the default behavior of the SQL Managed Instance sink connector. Azure Data Factory does a bulk insert to write to your table efficiently. You can configure the source and sink accordingly in the copy activity.

### Upsert data

**Option 1:** When you have a large amount of data to copy, you can bulk load all records into a staging table by using the copy activity, then run a stored procedure activity to apply a [MERGE](https://docs.microsoft.com/sql/t-sql/statements/merge-transact-sql?view=azuresqldb-mi-current) or INSERT/UPDATE statement in one shot. 

Copy activity currently doesn't natively support loading data into a database temporary table. There is an advanced way to set it up with a combination of multiple activities, refer to [Optimize SQL Database Bulk Upsert scenarios](https://github.com/scoriani/azuresqlbulkupsert). Below shows a sample of using a permanent table as staging.

As an example, in Azure Data Factory, you can create a pipeline with a **Copy activity** chained with a **Stored Procedure activity**. The former copies data from your source store into an Azure SQL Managed Instance staging table, for example, **UpsertStagingTable**, as the table name in the dataset. Then the latter invokes a stored procedure to merge source data from the staging table into the target table and clean up the staging table.

![Upsert](./media/connector-azure-sql-database/azure-sql-database-upsert.png)

In your database, define a stored procedure with MERGE logic, like the following example, which is pointed to from the previous stored procedure activity. Assume that the target is the **Marketing** table with three columns: **ProfileID**, **State**, and **Category**. Do the upsert based on the **ProfileID** column.

```sql
CREATE PROCEDURE [dbo].[spMergeData]
AS
BEGIN
	MERGE TargetTable AS target
	USING UpsertStagingTable AS source
	ON (target.[ProfileID] = source.[ProfileID])
	WHEN MATCHED THEN
		UPDATE SET State = source.State
    WHEN NOT matched THEN
    	INSERT ([ProfileID], [State], [Category])
      VALUES (source.ProfileID, source.State, source.Category);
    
    TRUNCATE TABLE UpsertStagingTable
END
```

**Option 2:** You can choose to [invoke a stored procedure within the copy activity](#invoke-a-stored-procedure-from-a-sql-sink). This approach runs each batch (as governed by the `writeBatchSize` property) in the source table instead of using bulk insert as the default approach in the copy activity.

### Overwrite the entire table

You can configure the **preCopyScript** property in a copy activity sink. In this case, for each copy activity that runs, Azure Data Factory runs the script first. Then it runs the copy to insert the data. For example, to overwrite the entire table with the latest data, specify a script to first delete all the records before you bulk load the new data from the source.

### Write data with custom logic

The steps to write data with custom logic are similar to those described in the [Upsert data](#upsert-data) section. When you need to apply extra processing before the final insertion of source data into the destination table, you can load to a staging table then invoke stored procedure activity, or invoke a stored procedure in copy activity sink to apply data.

## <a name="invoke-a-stored-procedure-from-a-sql-sink"></a> Invoke a stored procedure from a SQL sink

When you copy data into SQL Managed Instance, you also can configure and invoke a user-specified stored procedure with additional parameters on each batch of the source table. The stored procedure feature takes advantage of [table-valued parameters](https://msdn.microsoft.com/library/bb675163.aspx).

You can use a stored procedure when built-in copy mechanisms don't serve the purpose. An example is when you want to apply extra processing before the final insertion of source data into the destination table. Some extra processing examples are when you want to merge columns, look up additional values, and insert into more than one table.

The following sample shows how to use a stored procedure to do an upsert into a table in the SQL Server database. Assume that the input data and the sink **Marketing** table each have three columns: **ProfileID**, **State**, and **Category**. Do the upsert based on the **ProfileID** column, and only apply it for a specific category called "ProductA".

1. In your database, define the table type with the same name as **sqlWriterTableType**. The schema of the table type is the same as the schema returned by your input data.

    ```sql
    CREATE TYPE [dbo].[MarketingType] AS TABLE(
        [ProfileID] [varchar](256) NOT NULL,
        [State] [varchar](256) NOT NULL,
        [Category] [varchar](256) NOT NULL
    )
    ```

2. In your database, define the stored procedure with the same name as **sqlWriterStoredProcedureName**. It handles input data from your specified source and merges into the output table. The parameter name of the table type in the stored procedure is the same as **tableName** defined in the dataset.

    ```sql
    CREATE PROCEDURE spOverwriteMarketing @Marketing [dbo].[MarketingType] READONLY, @category varchar(256)
    AS
    BEGIN
    MERGE [dbo].[Marketing] AS target
    USING @Marketing AS source
    ON (target.ProfileID = source.ProfileID and target.Category = @category)
    WHEN MATCHED THEN
        UPDATE SET State = source.State
    WHEN NOT MATCHED THEN
        INSERT (ProfileID, State, Category)
        VALUES (source.ProfileID, source.State, source.Category);
    END
    ```

3. In Azure Data Factory, define the **SQL MI sink** section in the copy activity as follows:

    ```json
    "sink": {
        "type": "SqlMISink",
        "sqlWriterStoredProcedureName": "spOverwriteMarketing",
        "storedProcedureTableTypeParameterName": "Marketing",
        "sqlWriterTableType": "MarketingType",
        "storedProcedureParameters": {
            "category": {
                "value": "ProductA"
            }
        }
    }
    ```

## Data type mapping for SQL Managed Instance

When data is copied to and from SQL Managed Instance, the following mappings are used from SQL Managed Instance data types to Azure Data Factory interim data types. To learn how the copy activity maps from the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

| SQL Managed Instance data type | Azure Data Factory interim data type |
|:--- |:--- |
| bigint |Int64 |
| binary |Byte[] |
| bit |Boolean |
| char |String, Char[] |
| date |DateTime |
| Datetime |DateTime |
| datetime2 |DateTime |
| Datetimeoffset |DateTimeOffset |
| Decimal |Decimal |
| FILESTREAM attribute (varbinary(max)) |Byte[] |
| Float |Double |
| image |Byte[] |
| int |Int32 |
| money |Decimal |
| nchar |String, Char[] |
| ntext |String, Char[] |
| numeric |Decimal |
| nvarchar |String, Char[] |
| real |Single |
| rowversion |Byte[] |
| smalldatetime |DateTime |
| smallint |Int16 |
| smallmoney |Decimal |
| sql_variant |Object |
| text |String, Char[] |
| time |TimeSpan |
| timestamp |Byte[] |
| tinyint |Int16 |
| uniqueidentifier |Guid |
| varbinary |Byte[] |
| varchar |String, Char[] |
| xml |Xml |

>[!NOTE]
> For data types that map to the Decimal interim type, currently Copy activity supports precision up to 28. If you have data that requires precision larger than 28, consider converting to a string in a SQL query.

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## GetMetadata activity properties

To learn details about the properties, check [GetMetadata activity](control-flow-get-metadata-activity.md) 

## Using Always Encrypted

When you copy data from/to Azure SQL Managed Instance with [Always Encrypted](https://docs.microsoft.com/sql/relational-databases/security/encryption/always-encrypted-database-engine?view=azuresqldb-mi-current), use [generic ODBC connector](connector-odbc.md) and SQL Server ODBC driver via Self-hosted Integration Runtime. This Azure SQL Managed Instance connector does not support Always Encrypted now. 

More specifically:

1. Set up a Self-hosted Integration Runtime if you don't have one. See [Self-hosted Integration Runtime](create-self-hosted-integration-runtime.md) article for details.

2. Download the 64-bit ODBC driver for SQL Server from [here](https://docs.microsoft.com/sql/connect/odbc/download-odbc-driver-for-sql-server?view=azuresqldb-mi-current), and install on the Integration Runtime machine. Learn more about how this driver works from [Using Always Encrypted with the ODBC Driver for SQL Server](https://docs.microsoft.com/sql/connect/odbc/using-always-encrypted-with-the-odbc-driver?view=azuresqldb-mi-current#using-the-azure-key-vault-provider).

3. Create linked service with ODBC type to connect to your SQL database, refer to the following samples:

    - To use **SQL authentication**: Specify the ODBC connection string as below, and select **Basic** authentication to set the user name and password.

        ```
        Driver={ODBC Driver 17 for SQL Server};Server=<serverName>;Database=<databaseName>;ColumnEncryption=Enabled;KeyStoreAuthentication=KeyVaultClientSecret;KeyStorePrincipalId=<servicePrincipalKey>;KeyStoreSecret=<servicePrincipalKey>
        ```

    - To use **Data Factory Managed Identity authentication**: 

        1. Follow the same [prerequisites](#managed-identity) to create database user for the managed identity and grant the proper role in your database.
        2. In linked service, specify the ODBC connection string as below, and select **Anonymous** authentication as the connection string itself indicates`Authentication=ActiveDirectoryMsi`.

        ```
        Driver={ODBC Driver 17 for SQL Server};Server=<serverName>;Database=<databaseName>;ColumnEncryption=Enabled;KeyStoreAuthentication=KeyVaultClientSecret;KeyStorePrincipalId=<servicePrincipalKey>;KeyStoreSecret=<servicePrincipalKey>; Authentication=ActiveDirectoryMsi;
        ```

4. Create dataset and copy activity with ODBC type accordingly. Learn more from [ODBC connector](connector-odbc.md) article.

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
