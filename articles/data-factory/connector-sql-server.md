---
title: Copy data to/from SQL Server using Azure Data Factory | Microsoft Docs
description: Learn about how to move data to/from SQL Server database that is on-premises or in an Azure VM using Azure Data Factory.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 06/13/2019
ms.author: jingwang

---
# Copy data to and from SQL Server using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-sqlserver-connector.md)
> * [Current version](connector-sql-server.md)

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from and to an SQL Server database. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities

You can copy data from/to SQL Server database to any supported sink data store, or copy data from any supported source data store to SQL Server database. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this SQL Server connector supports:

- SQL Server version 2016, 2014, 2012, 2008 R2, 2008, and 2005
- Copying data using **SQL** or **Windows** authentication.
- As source, retrieving data using SQL query or stored procedure.
- As sink, appending data to destination table or invoking a stored procedure with custom logic during copy.

>[!NOTE]
>SQL Server **[Always Encrypted](https://docs.microsoft.com/sql/relational-databases/security/encryption/always-encrypted-database-engine?view=sql-server-2017)** is not supported by this connector now. To woraround, you can use [generic ODBC connector](connector-odbc.md) and SQL Server ODBC driver. Follow [this guidance](https://docs.microsoft.com/sql/connect/odbc/using-always-encrypted-with-the-odbc-driver?view=sql-server-2017) with ODBC driver download and connection string configurations.

## Prerequisites

To use copy data from a SQL Server database that is not publicly accessible, you need to set up a Self-hosted Integration Runtime. See [Self-hosted Integration Runtime](create-self-hosted-integration-runtime.md) article for details. The Integration Runtime provides a built-in SQL Server database driver, therefore you don't need to manually install any driver when copying data from/to SQL Server database.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to SQL Server database connector.

## Linked service properties

The following properties are supported for SQL Server linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **SqlServer** | Yes |
| connectionString |Specify connectionString information needed to connect to the SQL Server database using either SQL authentication or Windows authentication. Refer to the following samples.<br/>Mark this field as a SecureString to store it securely in Data Factory. You can also put password in Azure Key Vault，and if it's SQL authentication pull the `password` configuration out of the connection string. See the JSON example below the table and [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) article with more details. |Yes |
| userName |Specify user name if you are using Windows Authentication. Example: **domainname\\username**. |No |
| password |Specify password for the user account you specified for the userName. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |No |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Self-hosted Integration Runtime or Azure Integration Runtime (if your data store is publicly accessible). If not specified, it uses the default Azure Integration Runtime. |No |

>[!TIP]
>If you hit error with error code as "UserErrorFailedToConnectToSqlServer" and message like "The session limit for the database is XXX and has been reached.", add `Pooling=false` to your connection string and try again.

**Example 1: using SQL authentication**

```json
{
    "name": "SqlServerLinkedService",
    "properties": {
        "type": "SqlServer",
        "typeProperties": {
            "connectionString": {
                "type": "SecureString",
                "value": "Data Source=<servername>\\<instance name if using named instance>;Initial Catalog=<databasename>;Integrated Security=False;User ID=<username>;Password=<password>;"
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

**Example 2: using SQL authentication with password in Azure Key Vault**

```json
{
    "name": "SqlServerLinkedService",
    "properties": {
        "type": "SqlServer",
        "typeProperties": {
            "connectionString": {
                "type": "SecureString",
                "value": "Data Source=<servername>\\<instance name if using named instance>;Initial Catalog=<databasename>;Integrated Security=False;User ID=<username>;"
            },
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

**Example 3: using Windows authentication**

```json
{
    "name": "SqlServerLinkedService",
    "properties": {
        "type": "SqlServer",
        "typeProperties": {
            "connectionString": {
                "type": "SecureString",
                "value": "Data Source=<servername>\\<instance name if using named instance>;Initial Catalog=<databasename>;Integrated Security=True;"
            },
            "userName": "<domain\\username>",
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

For a full list of sections and properties available for defining datasets, see the datasets article. This section provides a list of properties supported by SQL Server dataset.

To copy data from/to SQL Server database, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **SqlServerTable** | Yes |
| tableName |Name of the table or view in the SQL Server database instance that linked service refers to. | No for source, Yes for sink |

**Example:**

```json
{
    "name": "SQLServerDataset",
    "properties":
    {
        "type": "SqlServerTable",
        "linkedServiceName": {
            "referenceName": "<SQL Server linked service name>",
            "type": "LinkedServiceReference"
        },
        "schema": [ < physical schema, optional, retrievable during authoring > ],
        "typeProperties": {
            "tableName": "MyTable"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by SQL Server source and sink.

### SQL Server as source

To copy data from SQL Server, set the source type in the copy activity to **SqlSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **SqlSource** | Yes |
| sqlReaderQuery |Use the custom SQL query to read data. Example: `select * from MyTable`. |No |
| sqlReaderStoredProcedureName |Name of the stored procedure that reads data from the source table. The last SQL statement must be a SELECT statement in the stored procedure. |No |
| storedProcedureParameters |Parameters for the stored procedure.<br/>Allowed values are: name/value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. |No |

**Points to note:**

- If the **sqlReaderQuery** is specified for the SqlSource, the Copy Activity runs this query against the SQL Server source to get the data. Alternatively, you can specify a stored procedure by specifying the **sqlReaderStoredProcedureName** and **storedProcedureParameters** (if the stored procedure takes parameters).
- If you do not specify either "sqlReaderQuery" or "sqlReaderStoredProcedureName", the columns defined in the "structure" section of the dataset JSON are used to construct a query (`select column1, column2 from mytable`) to run against the SQL Server. If the dataset definition does not have the "structure", all columns are selected from the table.

**Example: using SQL query**

```json
"activities":[
    {
        "name": "CopyFromSQLServer",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<SQL Server input dataset name>",
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
                "type": "SqlSource",
                "sqlReaderQuery": "SELECT * FROM MyTable"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

**Example: using stored procedure**

```json
"activities":[
    {
        "name": "CopyFromSQLServer",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<SQL Server input dataset name>",
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
                "type": "SqlSource",
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

**The stored procedure definition:**

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

### SQL Server as sink

> [!TIP]
> Learn more on the supported write behaviors, configurations and best practice from [Best practice for loading data into SQL Server](#best-practice-for-loading-data-into-sql-server).

To copy data to SQL Server, set the sink type in the copy activity to **SqlSink**. The following properties are supported in the copy activity **sink** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity sink must be set to: **SqlSink** | Yes |
| writeBatchSize |Number of rows to inserts into the SQL table **per batch**.<br/>Allowed values are: integer (number of rows). By default, Data Factory dynamically determine the appropriate batch size based on the row size. |No |
| writeBatchTimeout |Wait time for the batch insert operation to complete before it times out.<br/>Allowed values are: timespan. Example: “00:30:00” (30 minutes). |No |
| preCopyScript |Specify a SQL query for Copy Activity to execute before writing data into SQL Server. It will only be invoked once per copy run. You can use this property to clean up the pre-loaded data. |No |
| sqlWriterStoredProcedureName |Name of the stored procedure that defines how to apply source data into target table.<br/>Note this stored procedure will be **invoked per batch**. If you want to do operation that only runs once and has nothing to do with source data e.g. delete/truncate, use `preCopyScript` property. |No |
| storedProcedureParameters |Parameters for the stored procedure.<br/>Allowed values are: name/value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. |No |
| sqlWriterTableType |Specify a table type name to be used in the stored procedure. Copy activity makes the data being moved available in a temp table with this table type. Stored procedure code can then merge the data being copied with existing data. |No |

**Example 1: append data**

```json
"activities":[
    {
        "name": "CopyToSQLServer",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<SQL Server output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "SqlSink",
                "writeBatchSize": 100000
            }
        }
    }
]
```

**Example 2: invoke a stored procedure during copy**

Learn more details from [Invoking stored procedure for SQL Sink](#invoking-stored-procedure-for-sql-sink).

```json
"activities":[
    {
        "name": "CopyToSQLServer",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<SQL Server output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "SqlSink",
                "sqlWriterStoredProcedureName": "CopyTestStoredProcedureWithParameters",
                "sqlWriterTableType": "CopyTestTableType",
                "storedProcedureParameters": {
                    "identifier": { "value": "1", "type": "Int" },
                    "stringData": { "value": "str1" }
                }
            }
        }
    }
]
```

## Best practice for loading data into SQL Server

When you copy data into SQL Server, you may require different write behavior:

- **[Append](#append-data)**: my source data only has new records;
- **[Upsert](#upsert-data)**: my source data has both inserts and updates;
- **[Overwrite](#overwrite-entire-table)**: I want to reload entire dimension table each time;
- **[Write with custom logic](#write-data-with-custom-logic)**: I need extra processing before the final insertion into the destination table.

Refer to the respectively sections on how to configure in ADF and the best practices.

### Append data

This is the default behavior of this SQL Server sink connector, and ADF do **bulk insert** to write to your table efficiently. You can simply configure the source and sink accordingly in Copy activity.

### Upsert data

**Option I** (suggested especially when you have large data to copy): the **most performant approach** to do upsert is the following: 

- Firstly, leverage a [temporary table](https://docs.microsoft.com/sql/t-sql/statements/create-table-transact-sql?view=sql-server-2017#temporary-tables) to bulk load all records using Copy activity. As operations against temporary tables are not logged, you can load millions of records in seconds.
- Execute a Stored Procedure activity in ADF to apply a [MERGE](https://docs.microsoft.com/sql/t-sql/statements/merge-transact-sql?view=azuresqldb-current) (or INSERT/UPDATE) statement, and use the temp table as source to perform all updates or inserts as a single transaction, reducing the amount of roundtrips and log operations. At the end of the Stored Procedure activity , temp table can be truncated to be ready for the next upsert cycle. 

As an example, in Azure Data Factory, you can create a pipeline with a **Copy activity** chained with a **Stored Procedure activity** on success. The former copies data from your source store into an database temporary table, say "**##UpsertTempTable**" as table name in dataset, then the latter invokes a Stored Procedure to merge source data from the temp table into target table, and clean up temp table.

![Upsert](./media/connector-azure-sql-database/azure-sql-database-upsert.png)

In your database, define a Stored Procedure with MERGE logic, like the following, which is pointed to from the above Stored Procedure activity. Assuming target **Marketing** table with three columns: **ProfileID**, **State**, and **Category**, and do the upsert based on the **ProfileID** column.

```sql
CREATE PROCEDURE [dbo].[spMergeData]
AS
BEGIN
	MERGE TargetTable AS target
	USING ##UpsertTempTable AS source
	ON (target.[ProfileID] = source.[ProfileID])
	WHEN MATCHED THEN
		UPDATE SET State = source.State
    WHEN NOT matched THEN
    	INSERT ([ProfileID], [State], [Category])
      VALUES (source.ProfileID, source.State, source.Category);
    
    TRUNCATE TABLE ##UpsertTempTable
END
```

**Option II:** alternatively, you can choose to [Invoke stored procedure within Copy activity](#invoking-stored-procedure-for-sql-sink), while note this approach is executed for each row in the source table instead of leveraging bulk insert as the default approach in Copy activity, thus it doesn't fit for large scale upsert.

### Overwrite entire table

You can configure **preCopyScript** property in Copy activity sink, in which case for each Copy activity run, ADF executes the script first, then run the copy to insert the data. For example, to overwrite the entire table with the latest data, you can specify a script to first delete all records before bulk-loading the new data from the source.

### Write data with custom logic

Similar as described in [Upsert data](#upsert-data) section, when you need to apply extra processing before the final insertion of source data into the destination table, you can a) for large scale, load to a temporary table then invoke a stored procedure, or b) invoking a stored procedure during copy.

## <a name="invoking-stored-procedure-for-sql-sink"></a> Invoke stored procedure from SQL sink

When copying data into SQL Server database, you can also configure and invoke a user-specified stored procedure with additional parameters.

> [!TIP]
> Invoking stored procedure processes the data row-by-row instead of bulk operation, which is not suggested for large scale copy. Learn more from [Best practice for loading data into SQL Server](#best-practice-for-loading-data-into-sql-server).

You can use a stored procedure when built-in copy mechanisms don't serve the purpose, e.g. apply extra processing before the final insertion of source data into the destination table. Some extra processing examples are merge columns, look up additional values, and insertion into more than one table.

The following sample shows how to use a stored procedure to do an upsert into a table in the SQL Server database. Assume that input data and the sink **Marketing** table each have three columns: **ProfileID**, **State**, and **Category**. Do the upsert based on the **ProfileID** column, and only apply it for a specific category.

**Output dataset:** the "tableName" should be the same table type parameter name in your stored procedure (see below stored procedure script).

```json
{
    "name": "SQLServerDataset",
    "properties":
    {
        "type": "SqlServerTable",
        "linkedServiceName": {
            "referenceName": "<SQL Server linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "tableName": "Marketing"
        }
    }
}
```

Define the **SQL sink** section in copy activity as follows.

```json
"sink": {
    "type": "SqlSink",
    "SqlWriterTableType": "MarketingType",
    "SqlWriterStoredProcedureName": "spOverwriteMarketing",
    "storedProcedureParameters": {
        "category": {
            "value": "ProductA"
        }
    }
}
```

In your database, define the stored procedure with the same name as the **SqlWriterStoredProcedureName**. It handles input data from your specified source and merges into the output table. The parameter name of the table type in the stored procedure should be the same as the **tableName** defined in the dataset.

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

In your database, define the table type with the same name as sqlWriterTableType. Notice that the schema of the table type should be same as the schema returned by your input data.

```sql
CREATE TYPE [dbo].[MarketingType] AS TABLE(
    [ProfileID] [varchar](256) NOT NULL,
    [State] [varchar](256) NOT NULL，
    [Category] [varchar](256) NOT NULL
)
```

The stored procedure feature takes advantage of [Table-Valued Parameters](https://msdn.microsoft.com/library/bb675163.aspx).

## Data type mapping for SQL server

When copying data from/to SQL Server, the following mappings are used from SQL Server data types to Azure Data Factory interim data types. See [Schema and data type mappings](copy-activity-schema-and-type-mapping.md) to learn about how copy activity maps the source schema and data type to the sink.

| SQL Server data type | Data factory interim data type |
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
> For data types maps to Decimal interim type, currently ADF support precision up to 28. If you have data with precision larger than 28, consider to convert to string in SQL query.

## Troubleshooting connection issues

1. Configure your SQL Server to accept remote connections. Launch **SQL Server Management Studio**, right-click **server**, and click **Properties**. Select **Connections** from the list and check **Allow remote connections to the server**.

    ![Enable remote connections](media/copy-data-to-from-sql-server/AllowRemoteConnections.png)

    See [Configure the remote access Server Configuration Option](https://msdn.microsoft.com/library/ms191464.aspx) for detailed steps.

2. Launch **SQL Server Configuration Manager**. Expand **SQL Server Network Configuration** for the instance you want, and select **Protocols for MSSQLSERVER**. You should see protocols in the right-pane. Enable TCP/IP by right-clicking **TCP/IP** and clicking **Enable**.

    ![Enable TCP/IP](./media/copy-data-to-from-sql-server/EnableTCPProptocol.png)

    See [Enable or Disable a Server Network Protocol](https://msdn.microsoft.com/library/ms191294.aspx) for details and alternate ways of enabling TCP/IP protocol.

3. In the same window, double-click **TCP/IP** to launch **TCP/IP Properties** window.
4. Switch to the **IP Addresses** tab. Scroll down to see **IPAll** section. Note down the **TCP Port** (default is **1433**).
5. Create a **rule for the Windows Firewall** on the machine to allow incoming traffic through this port.  
6. **Verify connection**: To connect to the SQL Server using fully qualified name, use SQL Server Management Studio from a different machine. For example: `"<machine>.<domain>.corp.<company>.com,1433"`.

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md##supported-data-stores-and-formats).
