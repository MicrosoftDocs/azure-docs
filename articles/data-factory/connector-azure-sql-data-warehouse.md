---
title: Copy data to and from Azure SQL Data Warehouse by using Data Factory | Microsoft Docs
description: Learn how to copy data from supported source stores to Azure SQL Data Warehouse or from SQL Data Warehouse to supported sink stores by using Data Factory.
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
ms.date: 05/28/2018
ms.author: jingwang

---
# Copy data to or from Azure SQL Data Warehouse by using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using."]
> * [Version 1: GA](v1/data-factory-azure-sql-data-warehouse-connector.md)
> * [Version 2: Preview](connector-azure-sql-data-warehouse.md)

This article explains how to use the Copy Activity in Azure Data Factory to copy data to and from Azure SQL Data Warehouse. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you use version 1 of the Data Factory service, which is generally available (GA), see [Azure SQL Data Warehouse connector in V1](v1/data-factory-azure-sql-data-warehouse-connector.md).

## Supported capabilities

You can copy data from Azure SQL Data Warehouse to any supported sink data store. And you can copy data from any supported source data store to Azure SQL Data Warehouse. For a list of data stores that are supported as sources or sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this Azure SQL Data Warehouse connector supports the following functions:

- Copy data by using **SQL authentication** and **Azure Active Directory Application token authentication** with Service Principal or Managed Service Identity (MSI).
- As a source, retrieve data by using a SQL query or stored procedure.
- As a sink, load data uby sing **PolyBase** or a bulk insert. The former is **recommended** for better copy performance.

> [!IMPORTANT]
> Note that PolyBase only supports SQL authentcation but not Azure Active Directory authentication.

> [!IMPORTANT]
> If you copy data using Azure Integration Runtime, configure [Azure SQL Server Firewall](https://msdn.microsoft.com/library/azure/ee621782.aspx#ConnectingFromAzure) to [allow Azure Services to access the server](https://msdn.microsoft.com/library/azure/ee621782.aspx#ConnectingFromAzure). 
> If you copy data by using Self-hosted Integration Runtime, configure the Azure SQL Server firewall to allow the appropriate IP range. This range includes the machine's IP that is used to connect to Azure SQL Database.

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to Azure SQL Data Warehouse connector.

## Linked service properties

The following properties are supported for Azure SQL Data Warehouse linked service.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **AzureSqlDW**. | Yes |
| connectionString | Specify information needed to connect to the Azure SQL Data Warehouse instance for the connectionString property. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| servicePrincipalId | Specify the application's client ID. | Yes, when using Azure AD authentication with Service Principal. |
| servicePrincipalKey | Specify the application's key. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes, when using Azure AD authentication with Service Principal. |
| tenant | Specify the tenant information (domain name or tenant ID) under which your application resides. You can retrieve it by hovering the mouse in the top-right corner of the Azure portal. | Yes, when using Azure AD authentication with Service Principal. |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Azure Integration Runtime or Self-hosted Integration Runtime (if your data store is located in a private network). If not specified, it uses the default Azure Integration Runtime. | No |

For different authentication types, refer to the following sections on prerequisites and JSON samples, respectively.

- [Using SQL authentication](#using-sql-authentication).
- [Using Azure AD Application token authentication: service principal](#using-service-principal-authentication).
- [Using Azure AD Application token authentication: Managed Service Identity](#using-managed-service-identity-authentication).

### Using SQL authentication

**Linked service example using SQL authentication**

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
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

### Using service principal authentication

To use service principal-based Azure AD application token authentication, follow these steps.

1. **[Create an Azure Active Directory application from Azure portal](../azure-resource-manager/resource-group-create-service-principal-portal.md#create-an-azure-active-directory-application).** Make note of the application name and the following values that you use to define the linked service:

    - Application ID
    - Application key
    - Tenant ID

2. **[Provision an Azure Active Directory administrator](../sql-database/sql-database-aad-authentication-configure.md#provision-an-azure-active-directory-administrator-for-your-azure-sql-database-server)** for your Azure SQL Server on Azure portal if you haven't already done so. The Azure AD administrator can be an Azure AD user or Azure AD group. If you grant the group with MSI an admin role, skip steps 3 and 4. The administrator will have full access to the database.

3. **Create a contained database user for the service principal**. Connect to the data warehouse from or to which you want to copy data by using tools like SSMS. Use an Azure AD identity that has at least ALTER ANY USER permission. Run the following T-SQL. Learn more on contained database users from [Create contained database users](../sql-database/sql-database-aad-authentication-configure.md#create-contained-database-users-in-your-database-mapped-to-azure-ad-identities).
    
    ```sql
    CREATE USER [your application name] FROM EXTERNAL PROVIDER;
    ```

4. **Grant the service principal needed permissions** as you normally do for SQL users or others. Run the following code.

    ```sql
    EXEC sp_addrolemember [role name], [your application name];
    ```

5. In Azure Data Factory, configure an Azure SQL Data Warehouse linked service.


#### Linked service example that uses service principal authentication

```json
{
    "name": "AzureSqlDWLinkedService",
    "properties": {
        "type": "AzureSqlDW",
        "typeProperties": {
            "connectionString": {
                "type": "SecureString",
                "value": "Server=tcp:<servername>.database.windows.net,1433;Database=<databasename>;Connection Timeout=30"
            },
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

### Managed service identity authentication

A data factory can be associated with a [Managed Service Identity](data-factory-service-identity.md) that represents this specific data factory. You can use this service identity for Azure SQL Data Warehouse authentication. This identity allows the designated factory to access and copy data from or to your data warehouse.

> [!IMPORTANT]
> Note that PolyBase isn't currently supported for MSI authentcation.

To use MSI-based Azure AD application token authentication, follow these steps.

1. **Create a group in Azure AD. Make the factory MSI a member of the group**.

    a. Find the data factory service identity from the Azure portal. Go to your data factory > **Properties**. Copy the **SERVICE IDENTITY ID**.

    b. Install the [Azure AD PowerShell](https://docs.microsoft.com/powershell/azure/active-directory/install-adv2) module. Sign in by using the `Connect-AzureAD` command. Run the following commands to create a group and add the data factory MSI as a member.
    ```powershell
    $Group = New-AzureADGroup -DisplayName "<your group name>" -MailEnabled $false -SecurityEnabled $true -MailNickName "NotSet"
    Add-AzureAdGroupMember -ObjectId $Group.ObjectId -RefObjectId "<your data factory service identity ID>"
    ```

2. **[Provision an Azure Active Directory administrator](../sql-database/sql-database-aad-authentication-configure.md#provision-an-azure-active-directory-administrator-for-your-azure-sql-database-server)** for your Azure SQL Server on the Azure portal if you haven't already done so.

3. **Create a contained database user for the Azure AD group**. Connect to the data warehouse from or to which you want to copy data using by tools like SSMS. Use an Azure AD identity that has at least ALTER ANY USER permission. Run the following T-SQL. Learn more on contained database user from [Create contained database users](../sql-database/sql-database-aad-authentication-configure.md#create-contained-database-users-in-your-database-mapped-to-azure-ad-identities).
    
    ```sql
    CREATE USER [your AAD group name] FROM EXTERNAL PROVIDER;
    ```

4. **Grant the Azure AD group needed permissions** as you normally do for SQL users and others. Run the following code.

    ```sql
    EXEC sp_addrolemember [role name], [your AAD group name];
    ```

5. In ADF, configure an Azure SQL Data Warehouse linked service.

**Linked service example that uses MSI authentication:**

```json
{
    "name": "AzureSqlDWLinkedService",
    "properties": {
        "type": "AzureSqlDW",
        "typeProperties": {
            "connectionString": {
                "type": "SecureString",
                "value": "Server=tcp:<servername>.database.windows.net,1433;Database=<databasename>;Connection Timeout=30"
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

For a full list of sections and properties available for defining datasets, see the datasets article. This section provides a list of properties supported by Azure SQL Data Warehouse dataset.

To copy data from or to Azure SQL Data Warehouse, set the type property of the dataset to **AzureSqlDWTable**. The following properties are supported.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to **AzureSqlDWTable**. | Yes |
| tableName | Name of the table or view in the Azure SQL Data Warehouse instance that the linked service refers to. | Yes |

### Dataset properties example

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

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by the Azure SQL Data Warehouse source and sink.

### Azure SQL Data Warehouse as the source

To copy data from Azure SQL Data Warehouse, set the source type in the copy activity to **SqlDWSource**. The following properties are supported in the copy activity **source** section.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to **SqlDWSource**. | Yes |
| sqlReaderQuery | Use the custom SQL query to read data. Example: `select * from MyTable`. | No |
| sqlReaderStoredProcedureName | Name of the stored procedure that reads data from the source table. The last SQL statement must be a SELECT statement in the stored procedure. | No |
| storedProcedureParameters | Parameters for the stored procedure.<br/>Allowed values are name or value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. | No |

### Points to note

- If the **sqlReaderQuery** is specified for the **SqlSource**, the Copy Activity runs this query against the Azure SQL Data Warehouse source to get the data. Alternatively, you can specify a stored procedure. Specify the **sqlReaderStoredProcedureName** and **storedProcedureParameters**, if the stored procedure takes parameters.
- If you don't specify either **sqlReaderQuery** or **sqlReaderStoredProcedureName**, the columns defined in the **structure** section of the dataset JSON are used to construct a query. `select column1, column2 from mytable` runs against the Azure SQL Data Warehouse. If the dataset definition doesn't have the **structure**, all columns are selected from the table.
- When you use **sqlReaderStoredProcedureName**, you still need to specify a dummy **tableName** property in the dataset JSON.

### SQL query example

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

### Stored procedure definition

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

### Azure SQL Data Warehouse as a sink

To copy data to Azure SQL Data Warehouse, set the sink type in the copy activity to **SqlDWSink**. The following properties are supported in the copy activity **sink** section.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the copy activity sink must be set to **SqlDWSink**. | Yes |
| allowPolyBase | Indicates whether to use PolyBase (when applicable) instead of the BULKINSERT mechanism. <br/><br/> **Using PolyBase is the recommended way to load data into SQL Data Warehouse.** See the [Use PolyBase to load data into Azure SQL Data Warehouse](#use-polybase-to-load-data-into-azure-sql-data-warehouse) section for constraints and details.<br/><br/>Allowed values are **True**, and **False** (default).  | No |
| polyBaseSettings | A group of properties that can be specified when the **allowPolybase** property is set to **true**. | No |
| rejectValue | Specifies the number or percentage of rows that can be rejected before the query fails.<br/><br/>Learn more about PolyBase’s reject options in the **Arguments** section of [CREATE EXTERNAL TABLE (Transact-SQL)](https://msdn.microsoft.com/library/dn935021.aspx) topic. <br/><br/>Allowed values are 0 (default), 1, 2, etc. |No |
| rejectType | Specifies whether the **rejectValue** option is specified as a literal value or a percentage.<br/><br/>Allowed values are **Value** (default) and **Percentage**. | No |
| rejectSampleValue | Determines the number of rows to retrieve before PolyBase recalculates the percentage of rejected rows.<br/><br/>Allowed values are: 1, 2, etc. | Yes, if the **rejectType** is **percentage**. |
| useTypeDefault | Specifies how to handle missing values in delimited text files when PolyBase retrieves data from the text file.<br/><br/>Learn more about this property from the Arguments section in [CREATE EXTERNAL FILE FORMAT (Transact-SQL)](https://msdn.microsoft.com/library/dn935026.aspx).<br/><br/>Allowed values are **True** and **False** (default). | No |
| writeBatchSize | Inserts data into the SQL table when the buffer size reaches **writeBatchSize**. Applies only when PolyBase isn't used.<br/><br/>The allowed value is **integer** (number of rows). | No (default is 10000) |
| writeBatchTimeout | Wait time for the batch insert operation to complete before it times out. Applies only when PolyBase isn't used.<br/><br/>The allowed value is **timespan**. Example: “00:30:00” (30 minutes). | No |
| preCopyScript | Specify a SQL query for Copy Activity to run before writing data into Azure SQL Data Warehouse in each run. Use this property to clean up the preloaded data. | No | (#repeatability-during-copy). | A query statement. | No |

#### Example SQL Data Warehouse sink

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

Learn more about how to use PolyBase to load efficiently SQL Data Warehouse in the next section.

## Use PolyBase to load data into Azure SQL Data Warehouse

Using [PolyBase](https://docs.microsoft.com/sql/relational-databases/polybase/polybase-guide) is an efficient way to load a large amount of data into Azure SQL Data Warehouse with high throughput. You'll see a large gain in the throughput by using PolyBase instead of the default BULKINSERT mechanism. See [copy performance reference number](copy-activity-performance.md#performance-reference) for a detailed comparison. For a walkthrough with a use case, see [Load 1 TB into Azure SQL Data Warehouse in less than 15 minutes with Azure Data Factory](connector-azure-sql-data-warehouse.md).

* If your source data is in Azure Blob or Azure Data Lake Store, and the format is compatible with PolyBase, copy direct to Azure SQL Data Warehouse by using PolyBase. For details, see **[Direct copy using PolyBase](#direct-copy-using-polybase)**.
* If your source data store and format isn't originally supported by PolyBase, use the **[Staged copy using PolyBase](#staged-copy-using-polybase)** feature instead. The staged copy feature also provides you better throughput. It automatically converts the data into PolyBase-compatible format. And it stores the data in Azure Blob storage. It then loads the data into SQL Data Warehouse.

> [!IMPORTANT]
> Note that PolyBase isn't currently supported for MSI-based Azure AD Application token authentcation.

### Direct copy using PolyBase

SQL Data Warehouse PolyBase directly supports Azure Blob and Azure Data Lake Store. It uses service principal as a source and has specific file format requirements. If your source data meets the criteria described in this section, copy direct from the source data store to Azure SQL Data Warehouse using PolyBase. Otherwise, use [Staged copy using PolyBase](#staged-copy-using-polybase).

> [!TIP]
> To copy data from Data Lake Store to SQL Data Warehouse efficiently, learn more from [Azure Data Factory makes it even easier and convenient to uncover insights from data when using Data Lake Store with SQL Data Warehouse](https://blogs.msdn.microsoft.com/azuredatalake/2017/04/08/azure-data-factory-makes-it-even-easier-and-convenient-to-uncover-insights-from-data-when-using-data-lake-store-with-sql-data-warehouse/).

If the requirements aren't met, Azure Data Factory checks the settings and automatically falls back to the BULKINSERT mechanism for the data movement.

1. The **Source linked service** type is **AzureStorage** or **AzureDataLakeStore** with service principal authentication.
2. The **input dataset** type is **AzureBlob** or **AzureDataLakeStoreFile**. The format type under `type` properties is **OrcFormat**, **ParquetFormat**, or **TextFormat**, with the following configurations:

   1. `rowDelimiter` must be **\n**.
   2. `nullValue` is set to **empty string** (""), or `treatEmptyAsNull` is set to **true**.
   3. `encodingName` is set to **utf-8**, which is the **default** value.
   4. `escapeChar`, `quoteChar`, `firstRowAsHeader`, and `skipLineCount` aren't specified.
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

3. There is no `skipHeaderLineCount` setting under **BlobSource** or **AzureDataLakeStore** for the copy activity in the pipeline.
4. There is no `sliceIdentifierColumnName` setting under **SqlDWSink** for the copy activity in the pipeline. PolyBase guarantees that all data is updated, or nothing is updated in a single run. To achieve **repeatability**, use `sqlWriterCleanupScript`.

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
                "type": "SqlDWSink",
                "allowPolyBase": true
            }
        }
    }
]
```

### Staged copy by using PolyBase

When your source data doesn’t meet the criteria in the previous section, you can enable copying data via an interim staging Azure Blob Storage instance. It can't be Premium Storage. In this case, Azure Data Factory automatically performs transformations on the data to meet data format requirements of PolyBase. Then it uses PolyBase to load data into SQL Data Warehouse. And then it cleans up your temporary data from the blob storage. See [Staged copy](copy-activity-performance.md#staged-copy) for details about copying data via a staging Azure Blob instance.

To use this feature, create an [Azure Storage linked service](connector-azure-blob-storage.md#linked-service-properties) that refers to the Azure Storage Account that has the interim blob storage. Then specify the `enableStaging` and `stagingSettings` properties for the Copy Activity as shown in the following code:

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
                    "referenceName": "MyStagingBlob",
                    "type": "LinkedServiceReference"
                }
            }
        }
    }
]
```

## Best practices for using PolyBase

The following sections provide best practices in addition to those mentioned in [Best practices for Azure SQL Data Warehouse](../sql-data-warehouse/sql-data-warehouse-best-practices.md).

### Required database permission

To use PolyBase, the user that loads data into SQL Data Warehouse must have ["CONTROL" permission](https://msdn.microsoft.com/library/ms191291.aspx) on the target database. One way to achieve that is to add that the user as a member of the **db_owner** role. Learn how to do that in the [SQL Data Warehouse overview](../sql-data-warehouse/sql-data-warehouse-overview-manage-security.md#authorization).

### Row size and data type limitation

Polybase loads are limited to rows smaller than **1 MB**. They can't load to VARCHR(MAX), NVARCHAR(MAX), or VARBINARY(MAX). For more information, see [SQL data warehouse service capacity limits](../sql-data-warehouse/sql-data-warehouse-service-capacity-limits.md#loads).

If you have source data with rows greater than 1 MB, you might want to split the source tables vertically into several small ones. Make sure that the largest size of each row doesn't exceed the limit. The smaller tables can then be loaded by using PolyBase and merged together in Azure SQL Data Warehouse.

### SQL Data Warehouse resource class

To achieve the best possible throughput, assign a larger resource class to the user that loads data into SQL Data Warehouse via PolyBase.

### **tableName** in Azure SQL Data Warehouse

The following table gives examples of how to specify the **tableName** property in the JSON dataset. It shows several combinations of schema and table names.

| DB Schema | Table name | **tableName** JSON property |
| --- | --- | --- |
| dbo | MyTable | MyTable or dbo.MyTable or [dbo].[MyTable] |
| dbo1 | MyTable | dbo1.MyTable or [dbo1].[MyTable] |
| dbo | My.Table | [My.Table] or [dbo].[My.Table] |
| dbo1 | My.Table | [dbo1].[My.Table] |

If you see the following error, the problem might be the value you specified for the **tableName** property. See the preceding table for the correct way to specify values for the **tableName** JSON property.

```
Type=System.Data.SqlClient.SqlException,Message=Invalid object name 'stg.Account_test'.,Source=.Net SqlClient Data Provider
```

### Columns with default values

Currently, the PolyBase feature in Data Factory accepts only the same number of columns as in the target table. An example is a table with four columns where one of them is defined with a default value. The input data should still contain four columns. A three-column input dataset would yield an error similar to the following message:

```
All columns of the table must be specified in the INSERT BULK statement.
```

The NULL value is a special form of the default value. If the column is nullable, the input data, in the blob, for that column might be empty. But it can't be missing from the input dataset. PolyBase inserts NULL for those values in the Azure SQL Data Warehouse.

## Data type mapping for Azure SQL Data Warehouse

When you copy data from or to Azure SQL Data Warehouse, the following mappings are used from Azure SQL Data Warehouse data types to Azure Data Factory interim data types. See [Schema and data type mappings](copy-activity-schema-and-type-mapping.md) to learn how copy activity maps the source schema and data type to the sink.

| Azure SQL Data Warehouse data type | Data Factory interim data type |
|:--- |:--- |
| bigint | Int64 |
| binary | Byte[] |
| bit | Boolean |
| char | String, Char[] |
| date | DateTime |
| Datetime | DateTime |
| datetime2 | DateTime |
| Datetimeoffset | DateTimeOffset |
| Decimal | Decimal |
| FILESTREAM attribute (varbinary(max)) | Byte[] |
| Float | Double |
| image | Byte[] |
| int | Int32 |
| money | Decimal |
| nchar | String, Char[] |
| ntext | String, Char[] |
| numeric | Decimal |
| nvarchar | String, Char[] |
| real | Single |
| rowversion | Byte[] |
| smalldatetime | DateTime |
| smallint | Int16 |
| smallmoney | Decimal |
| sql_variant | Object * |
| text | String, Char[] |
| time | TimeSpan |
| timestamp | Byte[] |
| tinyint | Byte |
| uniqueidentifier | Guid |
| varbinary | Byte[] |
| varchar | String, Char[] |
| xml | Xml |

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md##supported-data-stores-and-formats).
