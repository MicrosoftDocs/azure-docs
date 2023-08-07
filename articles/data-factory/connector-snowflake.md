---
title: Copy and transform data in Snowflake
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy and transform data in Snowflake using Data Factory or Azure Synapse Analytics.
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 08/07/2023
---

# Copy and transform data in Snowflake using Azure Data Factory or Azure Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy activity in Azure Data Factory and Azure Synapse pipelines to copy data from and to Snowflake, and use Data Flow to transform data in Snowflake. For more information, see the introductory article for [Data Factory](introduction.md) or [Azure Synapse Analytics](../synapse-analytics/overview-what-is.md).

## Supported capabilities

This Snowflake connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/sink)|&#9312; &#9313;|
|[Mapping data flow](concepts-data-flow-overview.md) (source/sink)|&#9312; |
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|
|[Script activity](transform-data-using-script.md)|&#9312; &#9313;|

<small>*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*</small>

For the Copy activity, this Snowflake connector supports the following functions:

- Copy data from Snowflake that utilizes Snowflake's [COPY into [location]](https://docs.snowflake.com/en/sql-reference/sql/copy-into-location.html) command to achieve the best performance.
- Copy data to Snowflake that takes advantage of Snowflake's [COPY into [table]](https://docs.snowflake.com/en/sql-reference/sql/copy-into-table.html) command to achieve the best performance. It supports Snowflake on Azure.
- If a proxy is required to connect to Snowflake from a self-hosted Integration Runtime, you must configure the environment variables for HTTP_PROXY and HTTPS_PROXY on the Integration Runtime host. 

## Prerequisites

If your data store is located inside an on-premises network, an Azure virtual network, or Amazon Virtual Private Cloud, you need to configure a [self-hosted integration runtime](create-self-hosted-integration-runtime.md) to connect to it. Make sure to add the IP addresses that the self-hosted integration runtime uses to the allowed list. 

If your data store is a managed cloud data service, you can use the Azure Integration Runtime. If the access is restricted to IPs that are approved in the firewall rules, you can add [Azure Integration Runtime IPs](azure-integration-runtime-ip-addresses.md) to the allowed list.

The Snowflake account that is used for Source or Sink should have the necessary `USAGE` access on the database and read/write access on schema and the tables/views under it. In addition, it should also have `CREATE STAGE` on the schema to be able to create the External stage with SAS URI.

The following Account properties values must be set

| Property         | Description                                                  | Required | Default
| :--------------- | :----------------------------------------------------------- | :------- | :-------
| REQUIRE_STORAGE_INTEGRATION_FOR_STAGE_CREATION             | Specifies whether to require a storage integration object as cloud credentials when creating a named external stage (using CREATE STAGE) to access a private cloud storage location.             | FALSE      | FALSE
| REQUIRE_STORAGE_INTEGRATION_FOR_STAGE_OPERATION            | Specifies whether to require using a named external stage that references a storage integration object as cloud credentials when loading data from or unloading data to a private cloud storage location. | FALSE | FALSE

For more information about the network security mechanisms and options supported by Data Factory, see [Data access strategies](data-access-strategies.md).

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Snowflake using UI

Use the following steps to create a linked service to Snowflake in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Snowflake and select the Snowflake connector.

    :::image type="content" source="media/connector-snowflake/snowflake-connector.png" alt-text="Screenshot of the Snowflake connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-snowflake/configure-snowflake-linked-service.png" alt-text="Screenshot of linked service configuration for Snowflake.":::

## Connector configuration details

The following sections provide details about properties that define entities specific to a Snowflake connector.

## Linked service properties

This Snowflake connector supports the following authentication types. See the corresponding sections for details. 

 

- [Basic authentication](#basic-authentication)

### Basic authentication 

The following properties are supported for a Snowflake linked service when using **Basic** authentication. 

| Property         | Description                                                  | Required |
| :--------------- | :----------------------------------------------------------- | :------- |
| type             | The type property must be set to **Snowflake**.              | Yes      |
| connectionString | Specifies the information needed to connect to the Snowflake instance. You can choose to put password or entire connection string in Azure Key Vault. Refer to the examples below the table, and the [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) article, for more details.<br><br>Some typical settings:<br>- **Account name:** The  [full account name](https://docs.snowflake.net/manuals/user-guide/connecting.html#your-snowflake-account-name) of your Snowflake account (including additional segments that identify the region and cloud platform), e.g. xy12345.east-us-2.azure.<br/>- **User name:** The login name of the user for the connection.<br>- **Password:** The password for the user.<br>- **Database:** The default database to use once connected. It should be an existing database for which the specified role has privileges.<br>- **Warehouse:** The virtual warehouse to use once connected. It should be an existing warehouse for which the specified role has privileges.<br>- **Role:** The default access control role to use in the Snowflake session. The specified role should be an existing role that has already been assigned to the specified user. The default role is PUBLIC. | Yes      |
| authenticationType  | Set this property to **Basic**. | Yes    | 
| connectVia       | The [integration runtime](concepts-integration-runtime.md) that is used to connect to the data store. You can use the Azure integration runtime or a self-hosted integration runtime (if your data store is located in a private network). If not specified, it uses the default Azure integration runtime. | No       |

**Example:**

```json
{
    "name": "SnowflakeLinkedService",
    "properties": {
        "type": "Snowflake",
        "typeProperties": {
            "authenticationType": "Basic",
            "connectionString": "jdbc:snowflake://<accountname>.snowflakecomputing.com/?user=<username>&password=<password>&db=<database>&warehouse=<warehouse>&role=<myRole>"
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
    "name": "SnowflakeLinkedService",
    "properties": {
        "type": "Snowflake",
        "typeProperties": {
            "authenticationType": "Basic",
            "connectionString": "jdbc:snowflake://<accountname>.snowflakecomputing.com/?user=<username>&db=<database>&warehouse=<warehouse>&role=<myRole>",
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

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. 

The following properties are supported for the Snowflake dataset.

| Property  | Description                                                  | Required                    |
| :-------- | :----------------------------------------------------------- | :-------------------------- |
| type      | The type property of the dataset must be set to **SnowflakeTable**. | Yes                         |
| schema | Name of the schema. Note the schema name is case-sensitive. |No for source, yes for sink  |
| table | Name of the table/view. Note the table name is case-sensitive. |No for source, yes for sink  |

**Example:**

```json
{
    "name": "SnowflakeDataset",
    "properties": {
        "type": "SnowflakeTable",
        "typeProperties": {
            "schema": "<Schema name for your Snowflake database>",
            "table": "<Table name for your Snowflake database>"
        },
        "schema": [ < physical schema, optional, retrievable during authoring > ],
        "linkedServiceName": {
            "referenceName": "<name of linked service>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by the Snowflake source and sink.

### Snowflake as the source

Snowflake connector utilizes Snowflake’s [COPY into [location]](https://docs.snowflake.com/en/sql-reference/sql/copy-into-location.html) command to achieve the best performance.

If sink data store and format are natively supported by the Snowflake COPY command, you can use the Copy activity to directly copy from Snowflake to sink. For details, see [Direct copy from Snowflake](#direct-copy-from-snowflake). Otherwise, use built-in [Staged copy from Snowflake](#staged-copy-from-snowflake).

To copy data from Snowflake, the following properties are supported in the Copy activity **source** section.

| Property                     | Description                                                  | Required |
| :--------------------------- | :----------------------------------------------------------- | :------- |
| type                         | The type property of the Copy activity source must be set to **SnowflakeSource**. | Yes      |
| query          | Specifies the SQL query to read data from Snowflake. If the names of the schema, table and columns contain lower case, quote the object identifier in query e.g. `select * from "schema"."myTable"`.<br>Executing stored procedure is not supported. | No       |
| exportSettings | Advanced settings used to retrieve data from Snowflake. You can configure the ones supported by the COPY into command that the service will pass through when you invoke the statement. | Yes       |
| ***Under `exportSettings`:*** |  |  |
| type | The type of export command, set to **SnowflakeExportCopyCommand**. | Yes |
| additionalCopyOptions | Additional copy options, provided as a dictionary of key-value pairs. Examples: MAX_FILE_SIZE, OVERWRITE. For more information, see [Snowflake Copy Options](https://docs.snowflake.com/en/sql-reference/sql/copy-into-location.html#copy-options-copyoptions). | No |
| additionalFormatOptions | Additional file format options that are provided to COPY command as a dictionary of key-value pairs. Examples: DATE_FORMAT, TIME_FORMAT, TIMESTAMP_FORMAT. For more information, see [Snowflake Format Type Options](https://docs.snowflake.com/en/sql-reference/sql/copy-into-location.html#format-type-options-formattypeoptions). | No |

>[!Note]
> Make sure you have permission to execute the following command and access the schema *INFORMATION_SCHEMA* and the table *COLUMNS*.
>
>- `COPY INTO <location>`

#### Direct copy from Snowflake

If your sink data store and format meet the criteria described in this section, you can use the Copy activity to directly copy from Snowflake to sink. The service checks the settings and fails the Copy activity run if the following criteria is not met:

- The **sink linked service** is [**Azure Blob storage**](connector-azure-blob-storage.md) with **shared access signature** authentication. If you want to directly copy data to Azure Data Lake Storage Gen2 in the following supported format, you can create an Azure Blob linked service with SAS authentication against your ADLS Gen2 account, to avoid using [staged copy from Snowflake](#staged-copy-from-snowflake).

- The **sink data format** is of **Parquet**, **delimited text**, or **JSON** with the following configurations:

    - For **Parquet** format, the compression codec is **None**, **Snappy**, or **Lzo**.
    - For **delimited text** format:
        - `rowDelimiter` is **\r\n**, or any single character.
        - `compression` can be **no compression**, **gzip**, **bzip2**, or **deflate**.
        - `encodingName` is left as default or set to **utf-8**.
        - `quoteChar` is **double quote**, **single quote**, or **empty string** (no quote char).
    - For **JSON** format, direct copy only supports the case that source Snowflake table or query result only has single column and the data type of this column is **VARIANT**, **OBJECT**, or **ARRAY**.
        - `compression` can be **no compression**, **gzip**, **bzip2**, or **deflate**.
        - `encodingName` is left as default or set to **utf-8**.
        - `filePattern` in copy activity sink is left as default or set to **setOfObjects**.
- In copy activity source, `additionalColumns` is not specified.
- Column mapping is not specified.

**Example:**

```json
"activities":[
    {
        "name": "CopyFromSnowflake",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Snowflake input dataset name>",
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
                "type": "SnowflakeSource",
                "sqlReaderQuery": "SELECT * FROM MYTABLE",
                "exportSettings": {
                    "type": "SnowflakeExportCopyCommand",
                    "additionalCopyOptions": {
                        "MAX_FILE_SIZE": "64000000",
                        "OVERWRITE": true
                    },
                    "additionalFormatOptions": {
                        "DATE_FORMAT": "'MM/DD/YYYY'"
                    }
                }
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

#### Staged copy from Snowflake

When your sink data store or format is not natively compatible with the Snowflake COPY command, as mentioned in the last section, enable the built-in staged copy using an interim Azure Blob storage instance. The staged copy feature also provides you with better throughput. The service exports data from Snowflake into staging storage, then copies the data to sink, and finally cleans up your temporary data from the staging storage. See [Staged copy](copy-activity-performance-features.md#staged-copy) for details about copying data by using staging.

To use this feature, create an [Azure Blob storage linked service](connector-azure-blob-storage.md#linked-service-properties) that refers to the Azure storage account as the interim staging. Then specify the `enableStaging` and `stagingSettings` properties in the Copy activity.

> [!NOTE]
> The staging Azure Blob storage linked service must use shared access signature authentication, as required by the Snowflake COPY command. Make sure you grant proper access permission to Snowflake in the staging Azure Blob storage. To learn more about this, see this [article](https://docs.snowflake.com/en/user-guide/data-load-azure-config.html#option-2-generating-a-sas-token). 

**Example:**

```json
"activities":[
    {
        "name": "CopyFromSnowflake",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Snowflake input dataset name>",
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
                "type": "SnowflakeSource",               
                "sqlReaderQuery": "SELECT * FROM MyTable",
                "exportSettings": {
                    "type": "SnowflakeExportCopyCommand"
                }
            },
            "sink": {
                "type": "<sink type>"
            },
            "enableStaging": true,
            "stagingSettings": {
                "linkedServiceName": {
                    "referenceName": "MyStagingBlob",
                    "type": "LinkedServiceReference"
                },
                "path": "mystagingpath"
            }
        }
    }
]
```

### Snowflake as sink

Snowflake connector utilizes Snowflake’s [COPY into [table]](https://docs.snowflake.com/en/sql-reference/sql/copy-into-table.html) command to achieve the best performance. It supports writing data to Snowflake on Azure.

If source data store and format are natively supported by Snowflake COPY command, you can use the Copy activity to directly copy from source to Snowflake. For details, see [Direct copy to Snowflake](#direct-copy-to-snowflake). Otherwise, use built-in [Staged copy to Snowflake](#staged-copy-to-snowflake).

To copy data to Snowflake, the following properties are supported in the Copy activity **sink** section.

| Property          | Description                                                  | Required                                      |
| :---------------- | :----------------------------------------------------------- | :-------------------------------------------- |
| type              | The type property of the Copy activity sink, set to **SnowflakeSink**. | Yes                                           |
| preCopyScript     | Specify a SQL query for the Copy activity to run before writing data into Snowflake in each run. Use this property to clean up the preloaded data. | No                                            |
| importSettings | Advanced settings used to write data into Snowflake. You can configure the ones supported by the COPY into command that the service will pass through when you invoke the statement. | Yes |
| ***Under `importSettings`:*** |                                                              |  |
| type | The type of import command, set to **SnowflakeImportCopyCommand**. | Yes |
| additionalCopyOptions | Additional copy options, provided as a dictionary of key-value pairs. Examples: ON_ERROR, FORCE, LOAD_UNCERTAIN_FILES. For more information, see [Snowflake Copy Options](https://docs.snowflake.com/en/sql-reference/sql/copy-into-table.html#copy-options-copyoptions). | No |
| additionalFormatOptions | Additional file format options provided to the COPY command, provided as a dictionary of key-value pairs. Examples: DATE_FORMAT, TIME_FORMAT, TIMESTAMP_FORMAT. For more information, see [Snowflake Format Type Options](https://docs.snowflake.com/en/sql-reference/sql/copy-into-table.html#format-type-options-formattypeoptions). | No |

>[!Note]
> Make sure you have permission to execute the following command and access the schema *INFORMATION_SCHEMA* and the table *COLUMNS*.
>
>- `SELECT CURRENT_REGION()`
>- `COPY INTO <table>`
>- `SHOW REGIONS`
>- `CREATE OR REPLACE STAGE`
>- `DROP STAGE`

#### Direct copy to Snowflake

If your source data store and format meet the criteria described in this section, you can use the Copy activity to directly copy from source to Snowflake. The service checks the settings and fails the Copy activity run if the following criteria is not met:

- The **source linked service** is [**Azure Blob storage**](connector-azure-blob-storage.md) with **shared access signature** authentication. If you want to directly copy data from Azure Data Lake Storage Gen2 in the following supported format, you can create an Azure Blob linked service with SAS authentication against your ADLS Gen2 account, to avoid using  [staged copy to Snowflake](#staged-copy-to-snowflake).

- The **source data format** is **Parquet**, **Delimited text**, or **JSON** with the following configurations:

    - For **Parquet** format, the compression codec is **None**, or **Snappy**.

    - For **delimited text** format:
        - `rowDelimiter` is **\r\n**, or any single character. If row delimiter is not “\r\n”, `firstRowAsHeader` need to be **false**, and `skipLineCount` is not specified.
        - `compression` can be **no compression**, **gzip**, **bzip2**, or **deflate**.
        - `encodingName` is left as default or set to "UTF-8", "UTF-16", "UTF-16BE", "UTF-32", "UTF-32BE", "BIG5", "EUC-JP", "EUC-KR", "GB18030", "ISO-2022-JP", "ISO-2022-KR", "ISO-8859-1", "ISO-8859-2", "ISO-8859-5", "ISO-8859-6", "ISO-8859-7", "ISO-8859-8", "ISO-8859-9", "WINDOWS-1250", "WINDOWS-1251", "WINDOWS-1252", "WINDOWS-1253", "WINDOWS-1254", "WINDOWS-1255".
        - `quoteChar` is **double quote**, **single quote**, or **empty string** (no quote char).
    - For **JSON** format, direct copy only supports the case that sink Snowflake table only has single column and the data type of this column is **VARIANT**, **OBJECT**, or **ARRAY**.
        - `compression` can be **no compression**, **gzip**, **bzip2**, or **deflate**.
        - `encodingName` is left as default or set to **utf-8**.
        - Column mapping is not specified.

- In the Copy activity source: 

   -  `additionalColumns` is not specified.
   - If your source is a folder, `recursive` is set to true.
   - `prefix`, `modifiedDateTimeStart`, `modifiedDateTimeEnd`, and `enablePartitionDiscovery` are not specified.

**Example:**

```json
"activities":[
    {
        "name": "CopyToSnowflake",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<Snowflake output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "SnowflakeSink",
                "importSettings": {
                    "type": "SnowflakeImportCopyCommand",
                    "copyOptions": {
                        "FORCE": "TRUE",
                        "ON_ERROR": "SKIP_FILE"
                    },
                    "fileFormatOptions": {
                        "DATE_FORMAT": "YYYY-MM-DD"
                    }
                }
            }
        }
    }
]
```

#### Staged copy to Snowflake

When your source data store or format is not natively compatible with the Snowflake COPY command, as mentioned in the last section, enable the built-in staged copy using an interim Azure Blob storage instance. The staged copy feature also provides you with better throughput. The service automatically converts the data to meet the data format requirements of Snowflake. It then invokes the COPY command to load data into Snowflake. Finally, it cleans up your temporary data from the blob storage. See [Staged copy](copy-activity-performance-features.md#staged-copy) for details about copying data using staging.

To use this feature, create an [Azure Blob storage linked service](connector-azure-blob-storage.md#linked-service-properties) that refers to the Azure storage account as the interim staging. Then specify the `enableStaging` and `stagingSettings` properties in the Copy activity.

> [!NOTE]
> The staging Azure Blob storage linked service need to use shared access signature authentication as required by the Snowflake COPY command.

**Example:**

```json
"activities":[
    {
        "name": "CopyToSnowflake",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<Snowflake output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "SnowflakeSink",
                "importSettings": {
                    "type": "SnowflakeImportCopyCommand"
                }
            },
            "enableStaging": true,
            "stagingSettings": {
                "linkedServiceName": {
                    "referenceName": "MyStagingBlob",
                    "type": "LinkedServiceReference"
                },
                "path": "mystagingpath"
            }
        }
    }
]
```

## Mapping data flow properties

When transforming data in mapping data flow, you can read from and write to tables in Snowflake. For more information, see the [source transformation](data-flow-source.md) and [sink transformation](data-flow-sink.md) in mapping data flows. You can choose to use a Snowflake dataset or an [inline dataset](data-flow-source.md#inline-datasets) as source and sink type.

### Source transformation

The below table lists the properties supported by Snowflake source. You can edit these properties in the **Source options** tab. The connector utilizes Snowflake [internal data transfer](https://docs.snowflake.com/en/user-guide/spark-connector-overview.html#internal-data-transfer).

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Table | If you select Table as input, data flow will fetch all the data from the table specified in the Snowflake dataset or in the source options when using inline dataset. | No | String | *(for inline dataset only)*<br>tableName<br>schemaName |
| Query | If you select Query as input, enter a query to fetch data from Snowflake. This setting overrides any table that you've chosen in dataset.<br>If the names of the schema, table and columns contain lower case, quote the object identifier in query e.g. `select * from "schema"."myTable"`. | No | String | query |
| Enable incremental extract (Preview) | Use this option to tell ADF to only process rows that have changed since the last time that the pipeline executed. | No | Boolean | enableCdc |
| Incremental Column | When using the incremental extract feature, you must choose the date/time/numeric column that you wish to use as the watermark in your source table. | No | String | waterMarkColumn |
| Enable Snowflake Change Tracking (Preview) | This option enables ADF to leverage Snowflake change data capture technology to process only the delta data since the previous pipeline execution. This option automatically loads the delta data with row insert, update and deletion operations without requiring any incremental column. | No | Boolean | enableNativeCdc |
| Net Changes | When using snowflake change tracking, you can use this option to get deduped changed rows or exhaustive changes. Deduped changed rows will show only the latest versions of the rows that have changed since a given point in time, while exhaustive changes will show you all the versions of each row that has changed, including the ones that were deleted or updated. For example, if you update a row, you will see a delete version and an insert version in exhaustive changes, but only the insert version in deduped changed rows. Depending on your use case, you can choose the option that suits your needs. The default option is false, which means exhaustive changes. | No | Boolean | netChanges |
| Include system Columns | When using snowflake change tracking, you can use the systemColumns option to control whether the metadata stream columns provided by Snowflake are included or excluded in the change tracking output. By default, systemColumns is set to true, which means the metadata stream columns are included. You can set systemColumns to false if you want to exclude them. | No | Boolean | systemColumns |
| Start reading from beginning | Setting this option with incremental extract and change tracking will instruct ADF to read all rows on first execution of a pipeline with incremental extract turned on. | No | Boolean | skipInitialLoad |

#### Snowflake source script examples

When you use Snowflake dataset as source type, the associated data flow script is:

```
source(allowSchemaDrift: true,
	validateSchema: false,
	query: 'select * from MYTABLE',
	format: 'query') ~> SnowflakeSource
```

If you use inline dataset, the associated data flow script is:

```
source(allowSchemaDrift: true,
	validateSchema: false,
	format: 'query',
	query: 'select * from MYTABLE',
	store: 'snowflake') ~> SnowflakeSource
```
### Native Change Tracking

Azure Data Factory now supports a native feature in Snowflake known as change tracking, which involves tracking changes in the form of logs. This feature of snowflake allows us to track the changes in the data over time making it useful for incremental data loading and auditing purpose. To utilize this feature, when you enable Change data capture and select the Snowflake Change Tracking, we create a Stream object for the source table that enables change tracking on source snowflake table. Subsequently, we use the CHANGES clause in our query to fetch only the new or updated data from source table. Also, it is recommended to schedule pipeline such that changes are consumed within interval of [data retention time](https://docs.snowflake.com/en/sql-reference/parameters#label-data-retention-time-in-days) set for snowflake source table else user might see inconsistent behavior in captured changes.


### Sink transformation

The below table lists the properties supported by Snowflake sink. You can edit these properties in the **Settings** tab. When using inline dataset, you will see additional settings, which are the same as the properties described in [dataset properties](#dataset-properties) section. The connector utilizes Snowflake [internal data transfer](https://docs.snowflake.com/en/user-guide/spark-connector-overview.html#internal-data-transfer).

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Update method | Specify what operations are allowed on your Snowflake destination.<br>To update, upsert, or delete rows, an [Alter row transformation](data-flow-alter-row.md) is required to tag rows for those actions. | Yes | `true` or `false` | deletable <br/>insertable <br/>updateable <br/>upsertable |
| Key columns | For updates, upserts and deletes, a key column or columns must be set to determine which row to alter. | No | Array | keys |
| Table action | Determines whether to recreate or remove all rows from the destination table prior to writing.<br>- **None**: No action will be done to the table.<br>- **Recreate**: The table will get dropped and recreated. Required if creating a new table dynamically.<br>- **Truncate**: All rows from the target table will get removed. | No | `true` or `false` | recreate<br/>truncate |

#### Snowflake sink script examples

When you use Snowflake dataset as sink type, the associated data flow script is:

```
IncomingStream sink(allowSchemaDrift: true,
	validateSchema: false,
	deletable:true,
	insertable:true,
	updateable:true,
	upsertable:false,
	keys:['movieId'],
	format: 'table',
	skipDuplicateMapInputs: true,
	skipDuplicateMapOutputs: true) ~> SnowflakeSink
```

If you use inline dataset, the associated data flow script is:

```
IncomingStream sink(allowSchemaDrift: true,
	validateSchema: false,
	format: 'table',
	tableName: 'table',
	schemaName: 'schema',
	deletable: true,
	insertable: true,
	updateable: true,
	upsertable: false,
	store: 'snowflake',
	skipDuplicateMapInputs: true,
	skipDuplicateMapOutputs: true) ~> SnowflakeSink
```
#### Query Pushdown optimization
By setting the pipeline Logging Level to None, we exclude the transmission of intermediate transformation metrics, preventing potential hindrances to Spark optimizations and enabling query pushdown optimization provided by Snowflake. This pushdown optimization allows substantial performance enhancements for large Snowflake tables with extensive datasets.


> [!NOTE]
> We don’t support temporary tables in Snowflake, as they are local to the session or user who creates them, making them inaccessible to other sessions and prone to being overwritten as regular tables by Snowflake. While Snowflake offers transient tables as an alternative, which are accessible globally, they require manual deletion, contradicting our primary objective of using Temp tables which is to avoid any delete operations in source schema.

## Lookup activity properties

For more information about the properties, see [Lookup activity](control-flow-lookup-activity.md).

## Next steps

For a list of data stores supported as sources and sinks by Copy activity, see [supported data stores and formats](copy-activity-overview.md#supported-data-stores-and-formats).
