---
title: Copy data from/to Snowflake
description: Learn how to copy data from and to Snowflake by using Data Factory.
services: data-factory
ms.author: jingwang
author: linda33wj
manager: shwang
ms.reviewer: douglasl
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 05/15/2020
---

# Copy data from and to Snowflake by using Azure Data Factory

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This article outlines how to use Copy Activity in Azure Data Factory to copy data from and to Snowflake. To learn about Azure Data Factory, read the [introductory article](introduction.md).

## Supported capabilities

This Snowflake connector is supported for the following activities:

- [Copy activity](copy-activity-overview.md) with [supported source/sink matrix](copy-activity-overview.md) table
- [Lookup activity](control-flow-lookup-activity.md)

For Copy activity, this Snowflake connector supports these functions:

- Copy data from Snowflake which utilizes Snowflake’s [COPY into [location]](https://docs.snowflake.com/en/sql-reference/sql/copy-into-location.html) command to achieve the best performance.
- Copy data into Snowflake which takes advantage of Snowflake’s [COPY into [table]](https://docs.snowflake.com/en/sql-reference/sql/copy-into-table.html) command to achieve the best performance. It supports Snowflake on Azure.

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that define Data Factory entities specific to an Snowflake connector.

## Linked service properties

The following properties are supported for an Snowflake linked service:

| Property         | Description                                                  | Required |
| :--------------- | :----------------------------------------------------------- | :------- |
| type             | The type property must be set to **Snowflake**.              | Yes      |
| connectionString | Configure the [full account name](https://docs.snowflake.net/manuals/user-guide/connecting.html#your-snowflake-account-name) (including additional segments that identify the region and cloud platform), user name, password, database and warehouse. Specify the JDBC connection string to connect to the Snowflake instance. You can also put password in Azure Key Vault. Refer to the examples below the table and [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) article with more details.| Yes      |
| connectVia       | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Azure Integration Runtime or a self-hosted integration runtime (if your data store is located in a private network). If not specified, it uses the default Azure Integration Runtime. | No       |

**Example:**

```json
{
    "name": "SnowflakeLinkedService",
    "properties": {
        "type": "Snowflake",
        "typeProperties": {
            "connectionString": "jdbc:snowflake://<accountname>.snowflakecomputing.com/?user=<username>&password=<password>&db=<database>&warehouse=<warehouse>(optional)"
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
            "connectionString": "jdbc:snowflake://<accountname>.snowflakecomputing.com/?user=<username>&db=<database>&warehouse=<warehouse>(optional)",
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

The following properties are supported for Snowflake dataset:

| Property  | Description                                                  | Required                    |
| :-------- | :----------------------------------------------------------- | :-------------------------- |
| type      | The type property of the dataset must be set to **SnowflakeTable**. | Yes                         |
| schema | Name of the schema. |No for source, Yes for sink  |
| table | Name of the table/view. |No for source, Yes for sink  |

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

## Copy Activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by the Snowflake source and sink.

### Snowflake as the source

Snowflake connector utilizes Snowflake’s [COPY into [location]](https://docs.snowflake.com/en/sql-reference/sql/copy-into-location.html) command underneath to achieve the best performance.

* If sink data store and format are natively supported by Snowflake COPY command, you can use copy activity to directly copy from Snowflake to sink. For details, see [Direct copy from Snowflake](#direct-copy-from-snowflake).
* Otherwise, use built-in [Staged copy from Snowflake](#staged-copy-from-snowflake).

To copy data from Snowflake, the following properties are supported in the Copy Activity **source** section:

| Property                     | Description                                                  | Required |
| :--------------------------- | :----------------------------------------------------------- | :------- |
| type                         | The type property of the Copy Activity source must be set to **SnowflakeSource**. | Yes      |
| query          | Specifies the SQL query to read data from Snowflake.<br>Executing stored procedure is not supported. | No       |
| exportSettings | Advanced settings used to retrieve data from Snowflake. You can configure the ones supported by COPY into command that ADF will pass through when invoke the statement. | No       |
| ***Under `exportSettings`:*** |  |  |
| type | The type of export command, set to **SnowflakeExportCopyCommand**. | Yes |
| additionalCopyOptions | Additional copy options, provided as a dictionary of key-value pairs. Examples: MAX_FILE_SIZE, OVERWRITE. Learn more from [Snowflake Copy Options](https://docs.snowflake.com/en/sql-reference/sql/copy-into-location.html#copy-options-copyoptions). | No |
| additionalFormatOptions | Additional file format options provided to COPY command, provided as a a dictionary of key-value pairs. Examples: DATE_FORMAT, TIME_FORMAT, TIMESTAMP_FORMAT. Learn more from [Snowflake Format Type Options](https://docs.snowflake.com/en/sql-reference/sql/copy-into-location.html#format-type-options-formattypeoptions). | No |

#### Direct copy from Snowflake

If your sink data store and format meet the criteria described in this section, you can use copy activity to directly copy from Snowflake to sink. Azure Data Factory checks the settings and fails the copy activity run if the criteria is not met.

1. The **sink linked service** is [**Azure Blob**](connector-azure-blob-storage.md) type with **shared access signature** authentication.

2. The **sink data format** is of **Parquet** or **delimited text**, with the following configurations:

   - For **Parquet** format, the compression codec is **None**, **Snappy**, or **Lzo**.
   - For **delimited text** format:
     - `rowDelimiter` is **\r\n**, or any single character.
     - `compression` can be **no compression**, **gzip**, **bzip2**, or **deflate**.
     - `encodingName` is left as default or set to **utf-8**.
     - `quoteChar` is **double quote**, **single quote** or **empty string** (no quote char).
3. In copy activity source, `additionalColumns` is not specified.
4. Column mapping is not specified.

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

When your sink data store or format is not natively compatible with Snowflake COPY command as mentioned in the last section, enable the built-in staged copy via an interim Azure Blob storage instance. The staged copy feature also provides you better throughput - Data Factory exports data from Snowflake into staging storage, then copy data to sink, finally cleans up your temporary data from the staging storage. See [Staged copy](copy-activity-performance-features.md#staged-copy) for details about copying data via a staging.

To use this feature, create an [Azure Blob Storage linked service](connector-azure-blob-storage.md#linked-service-properties) that refers to the Azure storage account as the interim staging. Then specify the `enableStaging` and `stagingSettings` properties in Copy Activity.

> [!NOTE]
>
> The staging Azure Blob linked service need to use shared access signature authentication as required by Snowflake COPY command. 

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
                "sqlReaderQuery": "SELECT * FROM MyTable"
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

Snowflake connector utilizes Snowflake’s [COPY into [table]](https://docs.snowflake.com/en/sql-reference/sql/copy-into-table.html) command underneath to achieve the best performance. It supports writing data to Snowflake on Azure.

* If source data store and format are natively supported by Snowflake COPY command, you can use copy activity to directly copy from source to Snowflake. For details, see [Direct copy to Snowflake](#direct-copy-to-snowflake).
* Otherwise, use built-in [Staged copy to Snowflake](#staged-copy-to-snowflake).

To copy data to Snowflake, the following properties are supported in the Copy Activity **sink** section:

| Property          | Description                                                  | Required                                      |
| :---------------- | :----------------------------------------------------------- | :-------------------------------------------- |
| type              | The type property of the Copy Activity sink must be set to **SnowflakeSink**. | Yes                                           |
| preCopyScript     | Specify a SQL query for Copy Activity to run before writing data into Snowflake in each run. Use this property to clean up the preloaded data. | No                                            |
| importSettings | *Advanced settings used to write data into Snowflake. You can configure the ones supported by COPY into command that ADF will pass through when invoke the statement.* | *No* |
| ***Under `importSettings`:*** |                                                              |  |
| type | The type of import command, set to **SnowflakeImportCopyCommand**. | Yes |
| additionalCopyOptions | Additional copy options, provided as a dictionary of key-value pairs. Examples: ON_ERROR, FORCE, LOAD_UNCERTAIN_FILES. Learn more from [Snowflake Copy Options](https://docs.snowflake.com/en/sql-reference/sql/copy-into-table.html#copy-options-copyoptions). | No |
| additionalFormatOptions | Additional file format options provided to COPY command, provided as a dictionary of key-value pairs. Examples: DATE_FORMAT, TIME_FORMAT, TIMESTAMP_FORMAT. Learn more from [Snowflake Format Type Options](https://docs.snowflake.com/en/sql-reference/sql/copy-into-table.html#format-type-options-formattypeoptions). | No |

#### Direct copy to Snowflake

If your source data store and format meet the criteria described in this section, you can use copy activity to directly copy from source to Snowflake. Azure Data Factory checks the settings and fails the copy activity run if the criteria is not met.

1. The **source linked service** is [**Azure Blob**](connector-azure-blob-storage.md) type with **shared access signature** authentication.

2. The **source data format** is **Parquet** or **Delimited text** with the following configurations:

   - For **Parquet** format, the compression codec is **None**, or **Snappy**.

   - For **delimited text** format:
     - `rowDelimiter` is **\r\n**, or any single character. If row delimiter is not “\r\n”, `firstRowAsHeader` need to be **false**, and `skipLineCount` is not specified.
     - `compression` can be **no compression**, **gzip**, **bzip2**, or **deflate**.
     - `encodingName` is left as default or set to "UTF-8", "UTF-16", "UTF-16BE", "UTF-32", "UTF-32BE", "BIG5", "EUC-JP", "EUC-KR", "GB18030", "ISO-2022-JP", "ISO-2022-KR", "ISO-8859-1", "ISO-8859-2", "ISO-8859-5", "ISO-8859-6", "ISO-8859-7", "ISO-8859-8", "ISO-8859-9", "WINDOWS-1250", "WINDOWS-1251", "WINDOWS-1252", "WINDOWS-1253", "WINDOWS-1254", "WINDOWS-1255".
     - `quoteChar` is **double quote**, **single quote** or **empty string** (no quote char).

3. In copy activity source, 

   -  `additionalColumns` is not specified.
   - If your source is a folder, `recursive` must be set to true.
   - `prefix`, `modifiedDateTimeStart`, `modifiedDateTimeEnd` are not specified.

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
                        "ON_ERROR": "SKIP_FILE",
                    },
                    "fileFormatOptions": {
                        "DATE_FORMAT": "YYYY-MM-DD",
                    }
                }
            }
        }
    }
]
```

#### Staged copy to Snowflake

When your sink data store or format is not natively compatible with Snowflake COPY command as mentioned in the last section, enable the built-in staged copy via an interim Azure Blob storage instance. The staged copy feature also provides you better throughput - Data Factory automatically converts the data to meet the data format requirements of Snowflake. Then it invokes COPY command to load data into Snowflake. Finally, it cleans up your temporary data from the blob storage. See [Staged copy](copy-activity-performance-features.md#staged-copy) for details about copying data via a staging.

To use this feature, create an [Azure Blob Storage linked service](connector-azure-blob-storage.md#linked-service-properties) that refers to the Azure storage account as the interim staging. Then specify the `enableStaging` and `stagingSettings` properties in Copy Activity.

> [!NOTE]
>
> The staging Azure Blob linked service need to use shared access signature authentication as required by Snowflake COPY command.

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
                "type": "SnowflakeSink"
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


## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Next steps

For a list of data stores supported as sources and sinks by Copy Activity in Azure Data Factory, see [supported data stores and formats](copy-activity-overview.md#supported-data-stores-and-formats).
