---
title: Copy data to/from Azure SQL Data Warehouse using Data Factory | Microsoft Docs
description: Learn how to copy data from supported source stores to Azure SQL Data Warehouse (or) from SQL Data Warehouse to supported sink stores by using Data Factory.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/06/2017
ms.author: jingwang

---
# Copy data to or from Azure SQL Data Warehouse by using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1 - GA](v1/data-factory-azure-sql-data-warehouse-connector.md)
> * [Version 2 - Preview](connector-azure-sql-data-warehouse.md)

This article outlines how to use the Copy Activity in Azure Data Factory to copy data to and from an Azure SQL Data Warehouse. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [Azure SQL Data Warehouse connector in V1](v1/data-factory-azure-sql-data-warehouse-connector.md).

## Supported scenarios

You can copy data from/to Azure SQL Data Warehouse to any supported sink data store, or copy data from any supported source data store to Azure SQL Data Warehouse. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this Azure SQL Data Warehouse connector supports:

- Copying data using SQL authentication.
- As source, retrieving data using SQL query or stored procedure.
- As sink, loading data using **PolyBase** or bulk insert. The former is **recommended** for better copy performance.

## Getting started
You can create a pipeline with copy activity using .NET SDK, Python SDK, Azure PowerShell, REST API, or Azure Resource Manager template. See [Copy activity tutorial](quickstart-create-data-factory-dot-net.md) for step-by-step instructions to create a pipeline with a copy activity.

The following sections provide details about properties that are used to define Data Factory entities specific to Azure SQL Data Warehouse connector.

## Linked service properties

The following properties are supported for Azure SQL Data Warehouse linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **AzureSqlDW** | Yes |
| connectionString |Specify information needed to connect to the Azure SQL Data Warehouse instance for the connectionString property. Only basic authentication is supported. |Yes |

> [!IMPORTANT]
> Configure [Azure SQL Data Warehouse Firewall](https://msdn.microsoft.com/library/azure/ee621782.aspx#ConnectingFromAzure) and the database server to [allow Azure Services to access the server](https://msdn.microsoft.com/library/azure/ee621782.aspx#ConnectingFromAzure). Additionally, if you are copying data to Azure SQL Data Warehouse from outside Azure including from on-premises data sources with data factory gateway, configure appropriate IP address range for the machine that is sending data to Azure SQL Data Warehouse.

**Example:**

```json
{
    "name": "AzureSqlDWLinkedService",
    "properties": {
        "type": "AzureSqlDW",
        "typeProperties": {
            "connectionString": {
                "type": "SecureString",
                "value": "Server=tcp:<servername>.database.windows.net,1433;Database=<databasename>;User ID=<username>@<servername>;Password=<password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
            }
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Azure SQL Data Warehouse dataset.

To copy data from/to Azure SQL Data Warehouse, set the type property of the dataset to **AzureSqlDWTable**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **AzureSqlDWTable** | Yes |
| tableName |Name of the table or view in the Azure SQL Data Warehouse instance that linked service refers to. | Yes |

**Example:**

```json
{
    "name": "AzureSQLDWDataset",
    "properties":
    {
        "type": "AzureSqlDWTable",
        "linkedServiceName": {
            "referenceName": "<Azure SQL Data Warehouse linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "tableName": "MyTable"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Azure SQL Data Warehouse source and sink.

### Azure SQL Data Warehouse as source

To copy data from Azure SQL Data Warehouse, set the source type in the copy activity to **SqlDWSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **SqlDWSource** | Yes |
| sqlReaderQuery |Use the custom SQL query to read data. Example: `select * from MyTable`. |No |
| sqlReaderStoredProcedureName |Name of the stored procedure that reads data from the source table. The last SQL statement must be a SELECT statement in the stored procedure. |No |
| storedProcedureParameters |Parameters for the stored procedure.<br/>Allowed values are: name/value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. |No |

**Points to note:**

- If the **sqlReaderQuery** is specified for the SqlSource, the Copy Activity runs this query against the Azure SQL Data Warehouse source to get the data. Alternatively, you can specify a stored procedure by specifying the **sqlReaderStoredProcedureName** and **storedProcedureParameters** (if the stored procedure takes parameters).
- If you do not specify either "sqlReaderQuery" or "sqlReaderStoredProcedureName", the columns defined in the "structure" section of the dataset JSON are used to construct a query (`select column1, column2 from mytable`) to run against the Azure SQL Data Warehouse. If the dataset definition does not have the "structure", all columns are selected from the table.
- When you use **sqlReaderStoredProcedureName**, you still need to specify a dummy **tableName** property in the dataset JSON.

**Example: using SQL query**

```json
"activities":[
    {
        "name": "CopyFromAzureSQLDW",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Azure SQL DW input dataset name>",
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

**Example: using stored procedure**

```json
"activities":[
    {
        "name": "CopyFromAzureSQLDW",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Azure SQL DW input dataset name>",
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

### Azure SQL Data Warehouse as sink

To copy data to Azure SQL Data Warehouse, set the sink type in the copy activity to **SqlDWSink**. The following properties are supported in the copy activity **sink** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **SqlDWSink** | Yes |
| allowPolyBase |Indicates whether to use PolyBase (when applicable) instead of BULKINSERT mechanism. <br/><br/> **Using PolyBase is the recommended way to load data into SQL Data Warehouse.** See [Use PolyBase to load data into Azure SQL Data Warehouse](#use-polybase-to-load-data-into-azure-sql-data-warehouse) section for constraints and details.<br/><br/>Allowed values are: **True** (default), and **False**.  |No |
| polyBaseSettings |A group of properties that can be specified when the **allowPolybase** property is set to **true**. |No |
| rejectValue |Specifies the number or percentage of rows that can be rejected before the query fails.<br/><br/>Learn more about the PolyBase’s reject options in the **Arguments** section of [CREATE EXTERNAL TABLE (Transact-SQL)](https://msdn.microsoft.com/library/dn935021.aspx) topic. <br/><br/>Allowed values are: 0 (default), 1, 2, … |No |
| rejectType |Specifies whether the rejectValue option is specified as a literal value or a percentage.<br/><br/>Allowed values are: **Value** (default), and **Percentage**. |No |
| rejectSampleValue |Determines the number of rows to retrieve before the PolyBase recalculates the percentage of rejected rows.<br/><br/>Allowed values are: 1, 2, … |Yes, if **rejectType** is **percentage** |
| useTypeDefault |Specifies how to handle missing values in delimited text files when PolyBase retrieves data from the text file.<br/><br/>Learn more about this property from the Arguments section in [CREATE EXTERNAL FILE FORMAT (Transact-SQL)](https://msdn.microsoft.com/library/dn935026.aspx).<br/><br/>Allowed values are: **True**, **False** (default). |No |
| writeBatchSize |Inserts data into the SQL table when the buffer size reaches writeBatchSize. Applies only when PolyBase is not used.<br/><br/>Allowed values are: integer (number of rows). |No (default is 10000) |
| writeBatchTimeout |Wait time for the batch insert operation to complete before it times out. Applies only when PolyBase is not used.<br/><br/>Allowed values are: timespan. Example: “00:30:00” (30 minutes). |No |
| preCopyScript |Specify a SQL query for Copy Activity to execute before writing data into Azure SQL Data Warehouse in each run. You can use this property to clean up the pre-loaded data. |No |(#repeatability-during-copy). |A query statement. |No |

**Example:**

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

Learn more on how to use PolyBase to load into SQL Data Warehouse efficiently from next section.

## Use PolyBase to load data into Azure SQL Data Warehouse

Using **[PolyBase](https://docs.microsoft.com/sql/relational-databases/polybase/polybase-guide)** is an efficient way of loading large amount of data into Azure SQL Data Warehouse with high throughput. You can see a large gain in the throughput by using PolyBase instead of the default BULKINSERT mechanism. See [copy performance reference number](copy-activity-performance.md#performance-reference) with detailed comparison. For a walkthrough with a use case, see [Load 1 TB into Azure SQL Data Warehouse under 15 minutes with Azure Data Factory](connector-azure-sql-data-warehouse.md).

* If your source data is in **Azure Blob or Azure Data Lake Store**, and the format is compatible with PolyBase, you can directly copy to Azure SQL Data Warehouse using PolyBase. See **[Direct copy using PolyBase](#direct-copy-using-polybase)** with details.
* If your source data store and format is not originally supported by PolyBase, you can use the **[Staged Copy using PolyBase](#staged-copy-using-polybase)** feature instead. It also provides you better throughput by automatically converting the data into PolyBase-compatible format and storing the data in Azure Blob storage. It then loads data into SQL Data Warehouse.

### Direct copy using PolyBase

SQL Data Warehouse PolyBase directly support Azure Blob and Azure Data Lake Store (using service principal) as source and with specific file format requirements. If your source data meets the criteria described in this section, you can directly copy from source data store to Azure SQL Data Warehouse using PolyBase. Otherwise, you can use [Staged Copy using PolyBase](#staged-copy-using-polybase).

> [!TIP]
> To copy data from Data Lake Store to SQL Data Warehouse efficiently, learn more from [Azure Data Factory makes it even easier and convenient to uncover insights from data when using Data Lake Store with SQL Data Warehouse](https://blogs.msdn.microsoft.com/azuredatalake/2017/04/08/azure-data-factory-makes-it-even-easier-and-convenient-to-uncover-insights-from-data-when-using-data-lake-store-with-sql-data-warehouse/).

If the requirements are not met, Azure Data Factory checks the settings and automatically falls back to the BULKINSERT mechanism for the data movement.

1. **Source linked service** is of type: **AzureStorage** or **AzureDataLakeStore**.
2. The **input dataset** is of type: **AzureBlob** or **AzureDataLakeStoreFile**, and the format type under `type` properties is **OrcFormat**, or **TextFormat** with the following configurations:

   1. `rowDelimiter` must be **\n**.
   2. `nullValue` is set to **empty string** (""), or `treatEmptyAsNull` is set to **true**.
   3. `encodingName` is set to **utf-8**, which is **default** value.
   4. `escapeChar`, `quoteChar`, `firstRowAsHeader`, and `skipLineCount` are not specified.
   5. `compression` can be **no compression**, **GZip**, or **Deflate**.

	```json
	"typeProperties": {
	   "folderPath": "<blobpath>",
	   "format": {
	       "type": "TextFormat",
	       "columnDelimiter": "<any delimiter>",
	       "rowDelimiter": "\n",
	       "nullValue": "",
	       "encodingName": "utf-8"
	   },
	   "compression": {
	       "type": "GZip",
	       "level": "Optimal"
	   }
	},
	```

3. There is no `skipHeaderLineCount` setting under **BlobSource** or **AzureDataLakeStore** for the Copy activity in the pipeline.
4. There is no `sliceIdentifierColumnName` setting under **SqlDWSink** for the Copy activity in the pipeline. (PolyBase guarantees that all data is updated or nothing is updated in a single run. To achieve **repeatability**, you could use `sqlWriterCleanupScript`).
5. There is no `columnMapping` being used in the associated in Copy activity.

```json
"activities":[
    {
        "name": "CopyFromAzureBlobToSQLDataWarehouseViaPolyBase",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "BlobDataset",
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
                "type": "BlobSource",
            },
            "sink": {
                "type": "SqlDwSink",
                "allowPolyBase": true
            }
        }
    }
]
```

### Staged Copy using PolyBase

When your source data doesn’t meet the criteria introduced in the previous section, you can enable copying data via an interim staging Azure Blob Storage (cannot be Premium Storage). In this case, Azure Data Factory automatically performs transformations on the data to meet data format requirements of PolyBase, then use PolyBase to load data into SQL Data Warehouse, and then clean-up your temp data from the Blob storage. See [Staged Copy](copy-activity-performance.md#staged-copy) for details on how copying data via a staging Azure Blob works in general.

> [!NOTE]
> When copying data from an on-prem data store into Azure SQL Data Warehouse using PolyBase and staging, if your Data Management Gateway version is below 2.4, JRE (Java Runtime Environment) is required on your gateway machine that is used to transform your source data into proper format. Suggest you upgrade your gateway to the latest to avoid such dependency.
>

To use this feature, create an [Azure Storage linked service](connector-azure-blob-storage.md#linked-service-properties) that refers to the Azure Storage Account that has the interim blob storage, then specify the `enableStaging` and `stagingSettings` properties for the Copy Activity as shown in the following code:

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
                "type": "SqlDwSink",
                "allowPolyBase": true
            },
            "enableStaging": true,
            "stagingSettings": {
                "linkedServiceName": "MyStagingBlob"
            }
        }
    }
]
```

## Best practices when using PolyBase

The following sections provide additional best practices to the ones that are mentioned in [Best practices for Azure SQL Data Warehouse](../sql-data-warehouse/sql-data-warehouse-best-practices.md).

### Required database permission

To use PolyBase, it requires the user being used to load data into SQL Data Warehouse has the ["CONTROL" permission](https://msdn.microsoft.com/library/ms191291.aspx) on the target database. One way to achieve that is to add that user as a member of "db_owner" role. Learn how to do that by following [this section](../sql-data-warehouse/sql-data-warehouse-overview-manage-security.md#authorization).

### Row size and data type limitation

Polybase loads are limited to loading rows both smaller than **1 MB** and cannot load to VARCHR(MAX), NVARCHAR(MAX) or VARBINARY(MAX). Refer to [here](../sql-data-warehouse/sql-data-warehouse-service-capacity-limits.md#loads).

If you have source data with rows of size greater than 1 MB, you may want to split the source tables vertically into several small ones where the largest row size of each of them does not exceed the limit. The smaller tables can then be loaded using PolyBase and merged together in Azure SQL Data Warehouse.

### SQL Data Warehouse resource class

To achieve best possible throughput, consider to assign larger resource class to the user being used to load data into SQL Data Warehouse via PolyBase. Learn how to do that by following [Change a user resource class example](../sql-data-warehouse/sql-data-warehouse-develop-concurrency.md#changing-user-resource-class-example).

### tableName in Azure SQL Data Warehouse

The following table provides examples on how to specify the **tableName** property in dataset JSON for various combinations of schema and table name.

| DB Schema | Table name | tableName JSON property |
| --- | --- | --- |
| dbo |MyTable |MyTable or dbo.MyTable or [dbo].[MyTable] |
| dbo1 |MyTable |dbo1.MyTable or [dbo1].[MyTable] |
| dbo |My.Table |[My.Table] or [dbo].[My.Table] |
| dbo1 |My.Table |[dbo1].[My.Table] |

If you see the following error, it could be an issue with the value you specified for the tableName property. See the table for the correct way to specify values for the tableName JSON property.

```
Type=System.Data.SqlClient.SqlException,Message=Invalid object name 'stg.Account_test'.,Source=.Net SqlClient Data Provider
```

### Columns with default values

Currently, PolyBase feature in Data Factory only accepts the same number of columns as in the target table. Say, you have a table with four columns and one of them is defined with a default value. The input data should still contain four columns. Providing a 3-column input dataset would yield an error similar to the following message:

```
All columns of the table must be specified in the INSERT BULK statement.
```

NULL value is a special form of default value. If the column is nullable, the input data (in blob) for that column could be empty (cannot be missing from the input dataset). PolyBase inserts NULL for them in the Azure SQL Data Warehouse.

## Data type mapping for Azure SQL Data Warehouse

When copying data from/to Azure SQL Data Warehouse, the following mappings are used from Azure SQL Data Warehouse data types to Azure Data Factory interim data types. See [Schema and data type mappings](copy-activity-schema-and-type-mapping.md) to learn about how copy activity maps the source schema and data type to the sink.

| Azure SQL Data Warehouse data type | Data factory interim data type |
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
| tinyint |Byte |
| uniqueidentifier |Guid |
| varbinary |Byte[] |
| varchar |String, Char[] |
| xml |Xml |

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md##supported-data-stores-and-formats).