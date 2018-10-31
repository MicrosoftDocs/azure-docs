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
ms.devlang: na
ms.topic: conceptual
ms.date: 09/12/2018
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
| connectionString |Specify connectionString information needed to connect to the SQL Server database using either SQL authentication or Windows authentication. Refer to the following sample. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |Yes |
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

**Example 2: using Windows authentication**

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

To copy data from/to SQL Server database, set the type property of the dataset to **SqlServerTable**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **SqlServerTable** | Yes |
| tableName |Name of the table or view in the SQL Server database instance that linked service refers to. | Yes |

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
- When you use **sqlReaderStoredProcedureName**, you still need to specify a dummy **tableName** property in the dataset JSON.

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

To copy data to SQL Server, set the sink type in the copy activity to **SqlSink**. The following properties are supported in the copy activity **sink** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity sink must be set to: **SqlSink** | Yes |
| writeBatchSize |Inserts data into the SQL table when the buffer size reaches writeBatchSize.<br/>Allowed values are: integer (number of rows). |No (default: 10000) |
| writeBatchTimeout |Wait time for the batch insert operation to complete before it times out.<br/>Allowed values are: timespan. Example: “00:30:00” (30 minutes). |No |
| preCopyScript |Specify a SQL query for Copy Activity to execute before writing data into SQL Server. It will only be invoked once per copy run. You can use this property to clean up the pre-loaded data. |No |
| sqlWriterStoredProcedureName |Name of the stored procedure that defines how to apply source data into target table, e.g. to do upserts or transform using your own business logic. <br/><br/>Note this stored procedure will be **invoked per batch**. If you want to do operation that only runs once and has nothing to do with source data e.g. delete/truncate, use `preCopyScript` property. |No |
| storedProcedureParameters |Parameters for the stored procedure.<br/>Allowed values are: name/value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. |No |
| sqlWriterTableType |Specify a table type name to be used in the stored procedure. Copy activity makes the data being moved available in a temp table with this table type. Stored procedure code can then merge the data being copied with existing data. |No |

> [!TIP]
> When copying data to SQL Server, the copy activity appends data to the sink table by default. To perform an UPSERT or additional business logic, use the stored procedure in SqlSink. Learn more details from [Invoking stored procedure for SQL Sink](#invoking-stored-procedure-for-sql-sink).

**Example 1: appending data**

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

**Example 2: invoking a stored procedure during copy for upsert**

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

## Identity columns in the target database

This section provides an example that copies data from a source table with no identity column to a destination table with an identity column.

**Source table:**

```sql
create table dbo.SourceTbl
(
       name varchar(100),
       age int
)
```

**Destination table:**

```sql
create table dbo.TargetTbl
(
       identifier int identity(1,1),
       name varchar(100),
       age int
)
```

Notice that the target table has an identity column.

**Source dataset JSON definition**

```json
{
    "name": "SampleSource",
    "properties": {
        "type": " SqlServerTable",
        "linkedServiceName": {
            "referenceName": "TestIdentitySQL",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "tableName": "SourceTbl"
        }
    }
}
```

**Destination dataset JSON definition**

```json
{
    "name": "SampleTarget",
    "properties": {
        "structure": [
            { "name": "name" },
            { "name": "age" }
        ],
        "type": "SqlServerTable",
        "linkedServiceName": {
            "referenceName": "TestIdentitySQL",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "tableName": "TargetTbl"
        }
    }
}
```

Notice that as your source and target table have different schema (target has an additional column with identity). In this scenario, you need to specify **structure** property in the target dataset definition, which doesn’t include the identity column.

## <a name="invoking-stored-procedure-for-sql-sink"></a> Invoke stored procedure from SQL sink

When copying data into SQL Server database, a user specified stored procedure could be configured and invoked with additional parameters.

A stored procedure can be used when built-in copy mechanisms do not serve the purpose. It is typically used when upsert (insert + update) or extra processing (merging columns, looking up additional values, insertion into multiple tables, etc.) needs to be done before the final insertion of source data in the destination table.

The following sample shows how to use a stored procedure to do an upsert into a table in the SQL Server database. Assuming input data and the sink "Marketing" table each has three columns: ProfileID, State, and Category. Perform upsert based on the “ProfileID” column and only apply for a specific category.

**Output dataset**

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

Define the SqlSink section in copy activity as follows.

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

In your database, define the stored procedure with the same name as SqlWriterStoredProcedureName. It handles input data from your specified source, and merge into the output table. The parameter name of the table type in the stored procedure should be the same as the "tableName" defined in dataset.

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
      VALUES (source.ProfileID, source.State, source.Category)
END
```

In your database, define the table type with the same name as sqlWriterTableType. Notice that the schema of the table type should be same as the schema returned by your input data.

```sql
CREATE TYPE [dbo].[MarketingType] AS TABLE(
    [ProfileID] [varchar](256) NOT NULL,
    [State] [varchar](256) NOT NULL，
    [Category] [varchar](256) NOT NULL，
)
```

The stored procedure feature takes advantage of [Table-Valued Parameters](https://msdn.microsoft.com/library/bb675163.aspx).

>[!NOTE]
>If you write to Money/Smallmoney data type by invoking Stored Procedure, values may be rounded. Specify the corresponding data type in TVP as Decimal instead of Money/Smallmoney to mitigate. 

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
| sql_variant |Object * |
| text |String, Char[] |
| time |TimeSpan |
| timestamp |Byte[] |
| tinyint |Int16 |
| uniqueidentifier |Guid |
| varbinary |Byte[] |
| varchar |String, Char[] |
| xml |Xml |

## Troubleshooting connection issues

1. Configure your SQL Server to accept remote connections. Launch **SQL Server Management Studio**, right-click **server**, and click **Properties**. Select **Connections** from the list and check **Allow remote connections to the server**.

    ![Enable remote connections](media/copy-data-to-from-sql-server/AllowRemoteConnections.png)

    See [Configure the remote access Server Configuration Option](https://msdn.microsoft.com/library/ms191464.aspx) for detailed steps.

2. Launch **SQL Server Configuration Manager**. Expand **SQL Server Network Configuration** for the instance you want, and select **Protocols for MSSQLSERVER**. You should see protocols in the right-pane. Enable TCP/IP by right-clicking **TCP/IP** and clicking **Enable**.

    ![Enable TCP/IP](./media/copy-data-to-from-sql-server/EnableTCPProptocol.png)

    See [Enable or Disable a Server Network Protocol](https://msdn.microsoft.com/library/ms191294.aspx) for details and alternate ways of enabling TCP/IP protocol.

3. In the same window, double-click **TCP/IP** to launch **TCP/IP Properties** window.
4. Switch to the **IP Addresses** tab. Scroll down to see **IPAll** section. Note down the **TCP Port **(default is **1433**).
5. Create a **rule for the Windows Firewall** on the machine to allow incoming traffic through this port.  
6. **Verify connection**: To connect to the SQL Server using fully qualified name, use SQL Server Management Studio from a different machine. For example: `"<machine>.<domain>.corp.<company>.com,1433"`.


## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md##supported-data-stores-and-formats).
