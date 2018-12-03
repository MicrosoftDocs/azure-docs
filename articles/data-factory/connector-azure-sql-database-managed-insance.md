---
title: Copy data to/from Azure SQL Database Managed Instance using Azure Data Factory | Microsoft Docs
description: Learn about how to move data to/from Azure SQL Database Managed Instance using Azure Data Factory.
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
ms.date: 11/15/2018
ms.author: jingwang

---
# Copy data to and from Azure SQL Database Managed Instance using Azure Data Factory

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from and to an Azure SQL Database Managed Instance. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities

You can copy data from Azure SQL Database Managed Instance to any supported sink data store, or copy data from any supported source data store to the Managed Instance. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this Azure SQL Database Managed Instance connector supports:

- Copying data using **SQL** or **Windows** authentication.
- As source, retrieving data using SQL query or stored procedure.
- As sink, appending data to destination table or invoking a stored procedure with custom logic during copy.

## Prerequisites

To use copy data from an Azure SQL Database Managed Instance which is located in VNET, you need to set up a Self-hosted Integration Runtime in the same VNET that can access the database. See [Self-hosted Integration Runtime](create-self-hosted-integration-runtime.md) article for details.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to Azure SQL Database Managed Instance connector.

## Linked service properties

The following properties are supported for Azure SQL Database Managed Instance linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **SqlServer** | Yes |
| connectionString |Specify connectionString information needed to connect to the Managed Instance using either SQL authentication or Windows authentication. Refer to the following sample. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |Yes |
| userName |Specify user name if you are using Windows Authentication. Example: **domainname\\username**. |No |
| password |Specify password for the user account you specified for the userName. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |No |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. Provision the Self-hosted Integration Runtime in the same VNET as your Managed Instance. |Yes |

>[!TIP]
>If you hit error with error code as "UserErrorFailedToConnectToSqlServer" and message like "The session limit for the database is XXX and has been reached.", add `Pooling=false` to your connection string and try again.

**Example 1: Using SQL authentication**

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

**Example 2: Using Windows authentication**

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

For a full list of sections and properties available for defining datasets, see the datasets article. This section provides a list of properties supported by Azure SQL Database Managed Instance dataset.

To copy data from/to Azure SQL Database Managed Instance, set the type property of the dataset to **SqlServerTable**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **SqlServerTable** | Yes |
| tableName |Name of the table or view in the database instance that linked service refers to. | No for source, Yes for sink |

**Example**

```json
{
    "name": "SQLServerDataset",
    "properties":
    {
        "type": "SqlServerTable",
        "linkedServiceName": {
            "referenceName": "<Managed Instance linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "tableName": "MyTable"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Azure SQL Database Managed Instance source and sink.

### Azure SQL Database Managed Instance as source

To copy data from Azure SQL Database Managed Instance, set the source type in the copy activity to **SqlSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **SqlSource** | Yes |
| sqlReaderQuery |Use the custom SQL query to read data. Example: `select * from MyTable`. |No |
| sqlReaderStoredProcedureName |Name of the stored procedure that reads data from the source table. The last SQL statement must be a SELECT statement in the stored procedure. |No |
| storedProcedureParameters |Parameters for the stored procedure.<br/>Allowed values are: name/value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. |No |

**Points to note**

- If the **sqlReaderQuery** is specified for the SqlSource, the Copy Activity runs this query against the Managed Instance source to get the data. Alternatively, you can specify a stored procedure by specifying the **sqlReaderStoredProcedureName** and **storedProcedureParameters** (if the stored procedure takes parameters).
- If you do not specify either "sqlReaderQuery" or "sqlReaderStoredProcedureName" property, the columns defined in the "structure" section of the dataset JSON are used to construct a query (`select column1, column2 from mytable`) to run against the Managed Instance. If the dataset definition does not have the "structure", all columns are selected from the table.

**Example: Using a SQL query**

```json
"activities":[
    {
        "name": "CopyFromSQLServer",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Managed Instance input dataset name>",
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

**Example: Using a stored procedure**

```json
"activities":[
    {
        "name": "CopyFromSQLServer",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Managed Instance input dataset name>",
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

### Azure SQL Database Managed Instance as sink

To copy data to Azure SQL Database Managed Instance, set the sink type in the copy activity to **SqlSink**. The following properties are supported in the copy activity **sink** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity sink must be set to: **SqlSink** | Yes |
| writeBatchSize |Inserts data into the SQL table when the buffer size reaches writeBatchSize.<br/>Allowed values are: integer (number of rows). |No (default: 10000) |
| writeBatchTimeout |Wait time for the batch insert operation to complete before it times out.<br/>Allowed values are: timespan. Example: “00:30:00” (30 minutes). |No |
| preCopyScript |Specify a SQL query for Copy Activity to execute before writing data into Managed Instance. It will only be invoked once per copy run. You can use this property to clean up the pre-loaded data. |No |
| sqlWriterStoredProcedureName |Name of the stored procedure that defines how to apply source data into target table, e.g. to do upserts or transform using your own business logic. <br/><br/>Note this stored procedure will be **invoked per batch**. If you want to do operation that only runs once and has nothing to do with source data e.g. delete/truncate, use `preCopyScript` property. |No |
| storedProcedureParameters |Parameters for the stored procedure.<br/>Allowed values are: name/value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. |No |
| sqlWriterTableType |Specify a table type name to be used in the stored procedure. Copy activity makes the data being moved available in a temp table with this table type. Stored procedure code can then merge the data being copied with existing data. |No |

> [!TIP]
> When copying data to Azure SQL Database Managed Instance, the copy activity appends data to the sink table by default. To perform an UPSERT or additional business logic, use the stored procedure in SqlSink. Learn more details from [Invoking stored procedure for SQL Sink](#invoking-stored-procedure-for-sql-sink).

**Example 1: Appending data**

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
                "referenceName": "<Managed Instance output dataset name>",
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

**Example 2: Invoking a stored procedure during copy for upsert**

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
                "referenceName": "<Managed Instance output dataset name>",
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

**Source table**

```sql
create table dbo.SourceTbl
(
       name varchar(100),
       age int
)
```

**Destination table**

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

When copying data into Azure SQL Database Managed Instance, a user specified stored procedure could be configured and invoked with additional parameters.

A stored procedure can be used when built-in copy mechanisms do not serve the purpose. It is typically used when upsert (insert + update) or extra processing (merging columns, looking up additional values, insertion into multiple tables, etc.) needs to be done before the final insertion of source data in the destination table.

The following sample shows how to use a stored procedure to do an upsert into a table in the Managed Instance. Assuming input data and the sink "Marketing" table each has three columns: ProfileID, State, and Category. Perform upsert based on the “ProfileID” column and only apply for a specific category.

**Output dataset**

```json
{
    "name": "SQLServerDataset",
    "properties":
    {
        "type": "SqlServerTable",
        "linkedServiceName": {
            "referenceName": "<Managed Instance linked service name>",
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

## Data type mapping for Azure SQL Database Managed Instance

When copying data from/to Azure SQL Database Managed Instance, the following mappings are used from Managed Instance data types to Azure Data Factory interim data types. See [Schema and data type mappings](copy-activity-schema-and-type-mapping.md) to learn about how copy activity maps the source schema and data type to the sink.

| Azure SQL Database Managed Instance data type | Data factory interim data type |
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

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md##supported-data-stores-and-formats).
