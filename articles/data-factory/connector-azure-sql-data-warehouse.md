---
title: Copy data to and from Azure SQL Data Warehouse by using Azure Data Factory | Microsoft Docs
description: Learn how to copy data from supported source stores to Azure SQL Data Warehouse or from SQL Data Warehouse to supported sink stores by using Data Factory.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 05/24/2019
ms.author: jingwang

---
# Copy data to or from Azure SQL Data Warehouse by using Azure Data Factory 
> [!div class="op_single_selector" title1="Select the version of Data Factory service you're using:"]
> * [Version1](v1/data-factory-azure-sql-data-warehouse-connector.md)
> * [Current version](connector-azure-sql-data-warehouse.md)

This article outlines how to copy data to and from Azure SQL Data Warehouse. To learn about Azure Data Factory, read the [introductory article](introduction.md).

## Supported capabilities

This Azure Blob connector is supported for the following activities:

- [Copy activity](copy-activity-overview.md) with [supported source/sink matrix](copy-activity-overview.md) table
- [Mapping data flow](concepts-data-flow-overview.md)
- [Lookup activity](control-flow-lookup-activity.md)
- [GetMetadata activity](control-flow-get-metadata-activity.md)

Specifically, this Azure SQL Data Warehouse connector supports these functions:

- Copy data by using SQL authentication and Azure Active Directory (Azure AD) Application token authentication with a service principal or managed identities for Azure resources.
- As a source, retrieve data by using a SQL query or stored procedure.
- As a sink, load data by using PolyBase or a bulk insert. We recommend PolyBase for better copy performance.

> [!IMPORTANT]
> If you copy data by using Azure Data Factory Integration Runtime, configure an [Azure SQL server firewall](https://msdn.microsoft.com/library/azure/ee621782.aspx#ConnectingFromAzure) so that Azure services can access the server.
> If you copy data by using a self-hosted integration runtime, configure the Azure SQL server firewall to allow the appropriate IP range. This range includes the machine's IP that is used to connect to Azure SQL Database.

## Get started

> [!TIP]
> To achieve best performance, use PolyBase to load data into Azure SQL Data Warehouse. The [Use PolyBase to load data into Azure SQL Data Warehouse](#use-polybase-to-load-data-into-azure-sql-data-warehouse) section has details. For a walkthrough with a use case, see [Load 1 TB into Azure SQL Data Warehouse under 15 minutes with Azure Data Factory](load-azure-sql-data-warehouse.md).

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that define Data Factory entities specific to an Azure SQL Data Warehouse connector.

## Linked service properties

The following properties are supported for an Azure SQL Data Warehouse linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **AzureSqlDW**. | Yes |
| connectionString | Specify the information needed to connect to the Azure SQL Data Warehouse instance for the **connectionString** property. <br/>Mark this field as a SecureString to store it securely in Data Factory. You can also put password/service principal key in Azure Key Vault，and if it's SQL authentication pull the `password` configuration out of the connection string. See the JSON example below the table and [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) article with more details. | Yes |
| servicePrincipalId | Specify the application's client ID. | Yes, when you use Azure AD authentication with a service principal. |
| servicePrincipalKey | Specify the application's key. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes, when you use Azure AD authentication with a service principal. |
| tenant | Specify the tenant information (domain name or tenant ID) under which your application resides. You can retrieve it by hovering the mouse in the top-right corner of the Azure portal. | Yes, when you use Azure AD authentication with a service principal. |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Azure Integration Runtime or a self-hosted integration runtime (if your data store is located in a private network). If not specified, it uses the default Azure Integration Runtime. | No |

For different authentication types, refer to the following sections on prerequisites and JSON samples, respectively:

- [SQL authentication](#sql-authentication)
- Azure AD application token authentication: [Service principal](#service-principal-authentication)
- Azure AD application token authentication: [Managed identities for Azure resources](#managed-identity)

>[!TIP]
>If you hit error with error code as "UserErrorFailedToConnectToSqlServer" and message like "The session limit for the database is XXX and has been reached.", add `Pooling=false` to your connection string and try again.

### SQL authentication

#### Linked service example that uses SQL authentication

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

**Password in Azure Key Vault:**

```json
{
    "name": "AzureSqlDWLinkedService",
    "properties": {
        "type": "AzureSqlDW",
        "typeProperties": {
            "connectionString": {
                "type": "SecureString",
                "value": "Server=tcp:<servername>.database.windows.net,1433;Database=<databasename>;User ID=<username>@<servername>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
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

### Service principal authentication

To use service principal-based Azure AD application token authentication, follow these steps:

1. **[Create an Azure Active Directory application](../active-directory/develop/howto-create-service-principal-portal.md#create-an-azure-active-directory-application)** from the Azure portal. Make note of the application name and the following values that define the linked service:

    - Application ID
    - Application key
    - Tenant ID

2. **[Provision an Azure Active Directory administrator](../sql-database/sql-database-aad-authentication-configure.md#provision-an-azure-active-directory-administrator-for-your-azure-sql-database-server)** for your Azure SQL server on the Azure portal if you haven't already done so. The Azure AD administrator can be an Azure AD user or Azure AD group. If you grant the group with managed identity an admin role, skip steps 3 and 4. The administrator will have full access to the database.

3. **[Create contained database users](../sql-database/sql-database-aad-authentication-configure.md#create-contained-database-users-in-your-database-mapped-to-azure-ad-identities)** for the service principal. Connect to the data warehouse from or to which you want to copy data by using tools like SSMS, with an Azure AD identity that has at least ALTER ANY USER permission. Run the following T-SQL:
  
    ```sql
    CREATE USER [your application name] FROM EXTERNAL PROVIDER;
    ```

4. **Grant the service principal needed permissions** as you normally do for SQL users or others. Run the following code, or refer to more options [here](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-addrolemember-transact-sql?view=sql-server-2017). If you want to use PolyBase to load the data, learn the [required database permission](#required-database-permission).

    ```sql
    EXEC sp_addrolemember db_owner, [your application name];
    ```

5. **Configure an Azure SQL Data Warehouse linked service** in Azure Data Factory.


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

### <a name="managed-identity"></a> Managed identities for Azure resources authentication

A data factory can be associated with a [managed identity for Azure resources](data-factory-service-identity.md) that represents the specific factory. You can use this managed identity for Azure SQL Data Warehouse authentication. The designated factory can access and copy data from or to your data warehouse by using this identity.

To use managed identity authentication, follow these steps:

1. **[Provision an Azure Active Directory administrator](../sql-database/sql-database-aad-authentication-configure.md#provision-an-azure-active-directory-administrator-for-your-azure-sql-database-server)** for your Azure SQL server on the Azure portal if you haven't already done so. The Azure AD administrator can be an Azure AD user or Azure AD group. If you grant the group with managed identity an admin role, skip steps 3 and 4. The administrator will have full access to the database.

2. **[Create contained database users](../sql-database/sql-database-aad-authentication-configure.md#create-contained-database-users-in-your-database-mapped-to-azure-ad-identities)** for the Data Factory Managed Identity. Connect to the data warehouse from or to which you want to copy data by using tools like SSMS, with an Azure AD identity that has at least ALTER ANY USER permission. Run the following T-SQL. 
  
    ```sql
    CREATE USER [your Data Factory name] FROM EXTERNAL PROVIDER;
    ```

3. **Grant the Data Factory Managed Identity needed permissions** as you normally do for SQL users and others. Run the following code, or refer to more options [here](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-addrolemember-transact-sql?view=sql-server-2017). If you want to use PolyBase to load the data, learn the [required database permission](#required-database-permission).

    ```sql
    EXEC sp_addrolemember db_owner, [your Data Factory name];
    ```

5. **Configure an Azure SQL Data Warehouse linked service** in Azure Data Factory.

**Example:**

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

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by the Azure SQL Data Warehouse dataset.

To copy data from or to Azure SQL Data Warehouse, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the dataset must be set to **AzureSqlDWTable**. | Yes |
| tableName | The name of the table or view in the Azure SQL Data Warehouse instance that the linked service refers to. | No for source, Yes for sink |

#### Dataset properties example

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
        "schema": [ < physical schema, optional, retrievable during authoring > ],
        "typeProperties": {
            "tableName": "MyTable"
        }
    }
}
```

## Copy Activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by the Azure SQL Data Warehouse source and sink.

### Azure SQL Data Warehouse as the source

To copy data from Azure SQL Data Warehouse, set the **type** property in the Copy Activity source to **SqlDWSource**. The following properties are supported in the Copy Activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the Copy Activity source must be set to **SqlDWSource**. | Yes |
| sqlReaderQuery | Use the custom SQL query to read data. Example: `select * from MyTable`. | No |
| sqlReaderStoredProcedureName | The name of the stored procedure that reads data from the source table. The last SQL statement must be a SELECT statement in the stored procedure. | No |
| storedProcedureParameters | Parameters for the stored procedure.<br/>Allowed values are name or value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. | No |

### Points to note

- If the **sqlReaderQuery** is specified for the **SqlSource**, the Copy Activity runs this query against the Azure SQL Data Warehouse source to get the data. Or you can specify a stored procedure. Specify the **sqlReaderStoredProcedureName** and **storedProcedureParameters** if the stored procedure takes parameters.
- If you don't specify either **sqlReaderQuery** or **sqlReaderStoredProcedureName**, the columns defined in the **structure** section of the dataset JSON are used to construct a query. `select column1, column2 from mytable` runs against Azure SQL Data Warehouse. If the dataset definition doesn't have the **structure**, all columns are selected from the table.

#### SQL query example

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

#### Stored procedure example

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

### <a name="azure-sql-data-warehouse-as-sink"></a> Azure SQL Data Warehouse as sink

To copy data to Azure SQL Data Warehouse, set the sink type in Copy Activity to **SqlDWSink**. The following properties are supported in the Copy Activity **sink** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the Copy Activity sink must be set to **SqlDWSink**. | Yes |
| allowPolyBase | Indicates whether to use PolyBase, when applicable, instead of the BULKINSERT mechanism. <br/><br/> We recommend that you load data into SQL Data Warehouse by using PolyBase. See the [Use PolyBase to load data into Azure SQL Data Warehouse](#use-polybase-to-load-data-into-azure-sql-data-warehouse) section for constraints and details.<br/><br/>Allowed values are **True** and **False** (default).  | No |
| polyBaseSettings | A group of properties that can be specified when the **allowPolybase** property is set to **true**. | No |
| rejectValue | Specifies the number or percentage of rows that can be rejected before the query fails.<br/><br/>Learn more about PolyBase’s reject options in the Arguments section of [CREATE EXTERNAL TABLE (Transact-SQL)](https://msdn.microsoft.com/library/dn935021.aspx). <br/><br/>Allowed values are 0 (default), 1, 2, etc. |No |
| rejectType | Specifies whether the **rejectValue** option is a literal value or a percentage.<br/><br/>Allowed values are **Value** (default) and **Percentage**. | No |
| rejectSampleValue | Determines the number of rows to retrieve before PolyBase recalculates the percentage of rejected rows.<br/><br/>Allowed values are 1, 2, etc. | Yes, if the **rejectType** is **percentage**. |
| useTypeDefault | Specifies how to handle missing values in delimited text files when PolyBase retrieves data from the text file.<br/><br/>Learn more about this property from the Arguments section in [CREATE EXTERNAL FILE FORMAT (Transact-SQL)](https://msdn.microsoft.com/library/dn935026.aspx).<br/><br/>Allowed values are **True** and **False** (default).<br><br>**See [troubleshooting tips](#polybase-troubleshooting) related to this setting.** | No |
| writeBatchSize | Number of rows to inserts into the SQL table **per batch**. Applies only when PolyBase isn't used.<br/><br/>The allowed value is **integer** (number of rows). By default, Data Factory dynamically determine the appropriate batch size based on the row size. | No |
| writeBatchTimeout | Wait time for the batch insert operation to finish before it times out. Applies only when PolyBase isn't used.<br/><br/>The allowed value is **timespan**. Example: “00:30:00” (30 minutes). | No |
| preCopyScript | Specify a SQL query for Copy Activity to run before writing data into Azure SQL Data Warehouse in each run. Use this property to clean up the preloaded data. | No |

#### SQL Data Warehouse sink example

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

Learn more about how to use PolyBase to efficiently load SQL Data Warehouse in the next section.

## Use PolyBase to load data into Azure SQL Data Warehouse

Using [PolyBase](https://docs.microsoft.com/sql/relational-databases/polybase/polybase-guide) is an efficient way to load a large amount of data into Azure SQL Data Warehouse with high throughput. You'll see a large gain in the throughput by using PolyBase instead of the default BULKINSERT mechanism. See [Performance reference](copy-activity-performance.md#performance-reference) for a detailed comparison. For a walkthrough with a use case, see [Load 1 TB into Azure SQL Data Warehouse](v1/data-factory-load-sql-data-warehouse.md).

* If your source data is in **Azure Blob, Azure Data Lake Storage Gen1 or Azure Data Lake Storage Gen2**, and the **format is PolyBase compatible**, you can use copy activity to directly invoke PolyBase to let Azure SQL Data Warehouse pull the data from source. For details, see **[Direct copy by using PolyBase](#direct-copy-by-using-polybase)**.
* If your source data store and format isn't originally supported by PolyBase, use the **[Staged copy by using PolyBase](#staged-copy-by-using-polybase)** feature instead. The staged copy feature also provides you better throughput. It automatically converts the data into PolyBase-compatible format. And it stores the data in Azure Blob storage. It then loads the data into SQL Data Warehouse.

>[!TIP]
>Learn more on [Best practices for using PolyBase](#best-practices-for-using-polybase).

### Direct copy by using PolyBase

SQL Data Warehouse PolyBase directly supports Azure Blob, Azure Data Lake Storage Gen1 and Azure Data Lake Storage Gen2. If your source data meets the criteria described in this section, use PolyBase to copy directly from the source data store to Azure SQL Data Warehouse. Otherwise, use [Staged copy by using PolyBase](#staged-copy-by-using-polybase).

> [!TIP]
> To copy data efficiently to SQL Data Warehouse, learn more from [Azure Data Factory makes it even easier and convenient to uncover insights from data when using Data Lake Store with SQL Data Warehouse](https://blogs.msdn.microsoft.com/azuredatalake/2017/04/08/azure-data-factory-makes-it-even-easier-and-convenient-to-uncover-insights-from-data-when-using-data-lake-store-with-sql-data-warehouse/).

If the requirements aren't met, Azure Data Factory checks the settings and automatically falls back to the BULKINSERT mechanism for the data movement.

1. The **source linked service** is with the following types and authentication methods:

    | Supported source data store type | Supported source authentication type |
    |:--- |:--- |
    | [Azure Blob](connector-azure-blob-storage.md) | Account key authentication, managed identity authentication |
    | [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md) | Service principal authentication |
    | [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md) | Account key authentication, managed identity authentication |

    >[!IMPORTANT]
    >If your Azure Storage is configured with VNet service endpoint, you must use managed identity authentication - refer to [Impact of using VNet Service Endpoints with Azure storage](../sql-database/sql-database-vnet-service-endpoint-rule-overview.md#impact-of-using-vnet-service-endpoints-with-azure-storage). Learn the required configurations in Data Factory from [Azure Blob - managed identity authentication](connector-azure-blob-storage.md#managed-identity) and [Azure Data Lake Storage Gen2 - managed identity authentication](connector-azure-data-lake-storage.md#managed-identity) section respectively.

2. The **source data format** is of **Parquet**, **ORC**, or **Delimited text**, with the following configurations:

   1. Folder path don't contain wildcard filter.
   2. File name points to a single file or is `*` or `*.*`.
   3. `rowDelimiter` must be **\n**.
   4. `nullValue` is either set to **empty string** ("") or left as default, and `treatEmptyAsNull` is left as default or set to true.
   5. `encodingName` is set to **utf-8**, which is the default value.
   6. `quoteChar`, `escapeChar`, and `skipLineCount` aren't specified. PolyBase support skip header row which can be configured as `firstRowAsHeader` in ADF.
   7. `compression` can be **no compression**, **GZip**, or **Deflate**.

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

When your source data doesn’t meet the criteria in the previous section, enable data copying via an interim staging Azure Blob storage instance. It can't be Azure Premium Storage. In this case, Azure Data Factory automatically runs transformations on the data to meet the data format requirements of PolyBase. Then it uses PolyBase to load data into SQL Data Warehouse. Finally, it cleans up your temporary data from the blob storage. See [Staged copy](copy-activity-performance.md#staged-copy) for details about copying data via a staging Azure Blob storage instance.

To use this feature, create an [Azure Blob Storage linked service](connector-azure-blob-storage.md#linked-service-properties) that refers to the Azure storage account with the interim blob storage. Then specify the `enableStaging` and `stagingSettings` properties for the Copy Activity as shown in the following code.

>[!IMPORTANT]
>If your staging Azure Storage is configured with VNet service endpoint, you must use managed identity authentication - refer to [Impact of using VNet Service Endpoints with Azure storage](../sql-database/sql-database-vnet-service-endpoint-rule-overview.md#impact-of-using-vnet-service-endpoints-with-azure-storage). Learn the required configurations in Data Factory from [Azure Blob - managed identity authentication](connector-azure-blob-storage.md#managed-identity).

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

To use PolyBase, the user that loads data into SQL Data Warehouse must have ["CONTROL" permission](https://msdn.microsoft.com/library/ms191291.aspx) on the target database. One way to achieve that is to add the user as a member of the **db_owner** role. Learn how to do that in the [SQL Data Warehouse overview](../sql-data-warehouse/sql-data-warehouse-overview-manage-security.md#authorization).

### Row size and data type limits

PolyBase loads are limited to rows smaller than 1 MB. It cannot be used to load to VARCHR(MAX), NVARCHAR(MAX), or VARBINARY(MAX). For more information, see [SQL Data Warehouse service capacity limits](../sql-data-warehouse/sql-data-warehouse-service-capacity-limits.md#loads).

When your source data has rows greater than 1 MB, you might want to vertically split the source tables into several small ones. Make sure that the largest size of each row doesn't exceed the limit. The smaller tables can then be loaded by using PolyBase and merged together in Azure SQL Data Warehouse.

Alternatively, for data with such wide columns, you can use non-PolyBase to load the data using ADF, by turning off "allow PolyBase" setting.

### PolyBase troubleshooting

**Loading to Decimal column**

If your source data is in text format or other non-PolyBase compatible stores (using staged copy and PolyBase), and it contains empty value to be loaded into SQL Data Warehouse Decimal column, you may hit the following error:

```
ErrorCode=FailedDbOperation, ......HadoopSqlException: Error converting data type VARCHAR to DECIMAL.....Detailed Message=Empty string can't be converted to DECIMAL.....
```

The solution is to unselect "**Use type default**" option (as false) in copy activity sink -> PolyBase settings. "[USE_TYPE_DEFAULT](https://docs.microsoft.com/sql/t-sql/statements/create-external-file-format-transact-sql?view=azure-sqldw-latest#arguments
)" is a PolyBase native configuration which specifies how to handle missing values in delimited text files when PolyBase retrieves data from the text file. 

**Others**

For more known PolyBase issues, refer to [Troubleshooting Azure SQL Data Warehouse PolyBase load](../sql-data-warehouse/sql-data-warehouse-troubleshoot.md#polybase).

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

Currently, the PolyBase feature in Data Factory accepts only the same number of columns as in the target table. An example is a table with four columns where one of them is defined with a default value. The input data still needs to have four columns. A three-column input dataset yields an error similar to the following message:

```
All columns of the table must be specified in the INSERT BULK statement.
```

The NULL value is a special form of the default value. If the column is nullable, the input data in the blob for that column might be empty. But it can't be missing from the input dataset. PolyBase inserts NULL for missing values in Azure SQL Data Warehouse.

## Mapping Data Flow properties

Learn details from [source transformation](data-flow-source.md) and [sink transformation](data-flow-sink.md) in Mapping Data Flow.

## Data type mapping for Azure SQL Data Warehouse

When you copy data from or to Azure SQL Data Warehouse, the following mappings are used from Azure SQL Data Warehouse data types to Azure Data Factory interim data types. See [schema and data type mappings](copy-activity-schema-and-type-mapping.md) to learn how Copy Activity maps the source schema and data type to the sink.

>[!TIP]
>Refer to [Table data types in Azure SQL Data Warehouse](../sql-data-warehouse/sql-data-warehouse-tables-data-types.md) article on SQL DW supported data types and the workarounds for unsupported ones.

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
| numeric | Decimal |
| nvarchar | String, Char[] |
| real | Single |
| rowversion | Byte[] |
| smalldatetime | DateTime |
| smallint | Int16 |
| smallmoney | Decimal |
| time | TimeSpan |
| tinyint | Byte |
| uniqueidentifier | Guid |
| varbinary | Byte[] |
| varchar | String, Char[] |

## Next steps
For a list of data stores supported as sources and sinks by Copy Activity in Azure Data Factory, see [supported data stores and formats](copy-activity-overview.md##supported-data-stores-and-formats).
