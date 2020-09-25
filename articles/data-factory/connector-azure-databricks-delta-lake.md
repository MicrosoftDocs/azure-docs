---
title: Copy data to and from Azure Databricks Delta Lake
description: Learn how to copy data to and from Azure Databricks Delta Lake by using a copy activity in an Azure Data Factory pipeline.
services: data-factory
ms.author: jingwang
author: linda33wj
manager: shwang
ms.reviewer: douglasl
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 09/24/2020
---

# Copy data to and from Azure Databricks Delta Lake by using Azure Data Factory

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This article outlines how to use the Copy activity in Azure Data Factory to copy data to and from Azure Databricks Delta Lake. It builds on the [Copy activity in Azure Data Factory](copy-activity-overview.md) article, which presents a general overview of copy activity.

## Supported capabilities

This Azure Databricks Delta Lake connector is supported for the following activities:

- [Copy activity](copy-activity-overview.md) with a [supported source/sink matrix](copy-activity-overview.md) table
- [Lookup activity](control-flow-lookup-activity.md)

For the Copy activity, this Azure Databricks Delta Lake connector supports the following functions:

- copy to/from
- use cluster

Data flow vs copy

## Prerequisites

To use this Azure Databricks Delta Lake connector, you neet to set up a cluster in Azure Databricks for data integration need. Azure Data Factory copy activity submits job to Azure Databricks cluster to read data from Azure Storage, which is either your original source or a staging area where Data Factory writes the source data to.

The Databricks cluster needs to have access to an Azure Blob or Azure Data Lake Storage Gen2. To secure access to data in Azure Storage, you can use an account access key or an Azure Active Directory service principal authentication.

### Use an Azure storage account access key

You can configure a storage account access key on the integration cluster as part of the Apache Spark configuration. Ensure that the storage account has access to the storage container and file system used for staging data and the storage container and file system where you want to write the Delta Lake tables. To configure the integration cluster to use the key, follow the steps in [Access Azure Blob with storage key]() or [Access ADLS Gen2 with storage key](../databricks/data/data-sources/azure/azure-datalake-gen2.md#adls-gen2-access-key).

### Use an Azure service principal

You can configure a service principal on the Azure Databricks integration cluster as part of the Apache Spark configuration. Ensure that the service principal has access to the storage container used for staging data and the storage container where you want to write the Delta tables. To configure the integration cluster to use the service principal, follow the steps in [Access Azure Blob with service principal]() or [Access ADLS Gen2 with service principal](../databricks/data/data-sources/azure/azure-datalake-gen2.md#adls-gen2-oauth-2).

### Specify the cluster configuration

1. In the **Cluster Mode** drop-down, select **Standard**.

2. In the **Databricks Runtime Version** drop-down, select a Databricks runtime version.

3. Turn on [Auto Optimize](https://docs.microsoft.com/en-us/azure/databricks/delta/optimizations/auto-optimize) by adding the following properties to your [Spark configuration](https://docs.microsoft.com/en-us/azure/databricks/clusters/configure#spark-config):

   iniCopy

   ```
   spark.databricks.delta.optimizeWrite.enabled true
   spark.databricks.delta.autoCompact.enabled true
   ```

4. Configure your cluster depending on your integration and scaling needs.

For cluster configuration details, see [Configure clusters](https://docs.microsoft.com/en-us/azure/databricks/clusters/configure).

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that define Data Factory entities specific to a Azure Databricks Delta Lake connector.

## Linked service properties

The following properties are supported for a Azure Databricks Delta Lake linked service.

| Property    | Description                                                  | Required |
| :---------- | :----------------------------------------------------------- | :------- |
| type        | The type property must be set to **AzureDatabricksDeltaLake**. | Yes      |
| domain      | Specify the Azure Databricks workspace URL, e.g. `https://adb-xxxxxxxxx.xx.azuredatabricks.net`. |          |
| clusterId   | Specify the cluster ID of an existing cluster. It should be an already created Interactive Cluster. <br>You can find the Cluster ID of an Interactive Cluster on Databricks workspace -> Clusters -> Interactive Cluster Name -> Configuration -> Tags. [More details](https://docs.databricks.com/user-guide/clusters/tags.html) |          |
| accessToken | Access token is required for Data Factory to authenticate to Azure Databricks. Access token needs to be generated from the databricks workspace. More detailed steps to find the access token can be found [here](https://docs.azuredatabricks.net/api/latest/authentication.html#generate-token). |          |
| connectVia  | The [integration runtime](concepts-integration-runtime.md) that is used to connect to the data store. You can use the Azure integration runtime or a self-hosted integration runtime (if your data store is located in a private network). If not specified, it uses the default Azure integration runtime. | No       |

**Example:**

```json
{
    "name": "AzureDatabricksDeltaLakeLinkedService",
    "properties": {
        "type": "AzureDatabricksDeltaLake",
        "typeProperties": {
            "domain": "https://adb-xxxxxxxxx.xx.azuredatabricks.net",
            "clusterId": "<cluster id>",
            "accessToken": {
            	"type": "SecureString", 
            	"value": "<access token>"
          	}
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. 

The following properties are supported for the Azure Databricks Delta Lake dataset.

| Property  | Description                                                  | Required                    |
| :-------- | :----------------------------------------------------------- | :-------------------------- |
| type      | The type property of the dataset must be set to **AzureDatabricksDeltaLakeDataset**. | Yes                         |
| database | Name of the database. |No for source, yes for sink  |
| table | Name of the detla table. |No for source, yes for sink  |

**Example:**

```json
{
    "name": "AzureDatabricksDeltaLakeDataset",
    "properties": {
        "type": "AzureDatabricksDeltaLakeDataset",
        "typeProperties": {
            "database": "<database name>",
            "table": "<delta table name>"
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

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by the Azure Databricks Delta Lake source and sink.

### Delta lake as the source

To copy data from Azure Databricks Delta Lake, the following properties are supported in the Copy activity **source** section.

| Property                     | Description                                                  | Required |
| :--------------------------- | :----------------------------------------------------------- | :------- |
| type                         | The type property of the Copy activity source must be set to **AzureDatabricksDeltaLakeSource**. | Yes      |
| query          | Specify the SQL query to read data. For the time travel control, follow the below pattern:<br>- `SELECT * FROM events TIMESTAMP AS OF timestamp_expression`<br>- `SELECT * FROM events VERSION AS OF version` | No       |
| exportSettings | Advanced settings used to retrieve data from delta table. | No       |
| ***Under `exportSettings`:*** |  |  |
| type | The type of export command, set to **AzureDatabricksDeltaLakeExportCommand**. | Yes |
| dateFormat | Sets the string that indicates a date format. Custom date formats follow the formats at [datetime pattern](https://spark.apache.org/docs/latest/sql-ref-datetime-pattern.html). This applies to date type. If not specified, it uses the default value `yyyy-MM-dd`. | No |
| timestampFormat | Sets the string that indicates a timestamp format. Custom date formats follow the formats at [datetime pattern](https://spark.apache.org/docs/latest/sql-ref-datetime-pattern.html). This applies to timestamp type. If not specified, it uses the default value `yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]`. | No |

#### Direct copy from delta lake

If your sink data store and format meet the criteria described in this section, you can use the Copy activity to directly copy from Azure Databricks Delta table to sink. Data Factory checks the settings and fails the Copy activity run if the following criteria is not met:

- The **sink linked service** is [Azure Blob storage](connector-azure-blob.md) or [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md). The account credential should be pre-configured in Azure Databricks cluster configuration, learn more from [Prerequisites](#prerequisites).

- The **sink data format** is of **Parquet**, **delimited text**, or **Avro** with the following configurations, and points to a folder instead of file.

    - For **Parquet** format, the compression codec is **none**, **snappy**, or **gzip**.
    - For **delimited text** format:
        - `rowDelimiter` is any single character.
        - `compression` can be **none**, **bzip2**, **gzip**.
        - `encodingName` UTF-7 is not supported.
    - For **Avro** format, the compression codec is **none**, **deflate**, or **snappy**.

- In copy activity source, `additionalColumns` is not specified.
- If copying data to delimited text, in copy activity sink, `fileExtension` need to be ".csv".
- Type conversion is not specified.

**Example:**

```json
"activities":[
    {
        "name": "CopyFromDeltaLake",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Delta lake input dataset name>",
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
                "type": "AzureDatabricksDeltaLakeSource",
                "sqlReaderQuery": "SELECT * FROM events TIMESTAMP AS OF timestamp_expression"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

#### Staged copy from delta lake

When your sink data store or format does not match the direct copy criteria, as mentioned in the last section, enable the built-in staged copy using an interim Azure storage instance. The staged copy feature also provides you better throughput. Data Factory exports data from Azure Databricks Delta Lake into staging storage, then copies the data to sink, and finally cleans up your temporary data from the staging storage. See [Staged copy](copy-activity-performance-features.md#staged-copy) for details about copying data by using staging.

To use this feature, create an [Azure Blob storage linked service](connector-azure-blob-storage.md#linked-service-properties) or [Azure Data Lake Storage Gen2 linked service](connector-azure-data-lake-storage.md#linked-service-properties) that refers to the storage account as the interim staging. Then specify the `enableStaging` and `stagingSettings` properties in the Copy activity.

>[!NOTE]
>The staging storage account credential should be pre-configured in Azure Databricks cluster configuration, learn more from [Prerequisites](#prerequisites).

**Example:**

```json
"activities":[
    {
        "name": "CopyFromDeltaLake",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Delta lake input dataset name>",
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
                "type": "AzureDatabricksDeltaLakeSource",
                "sqlReaderQuery": "SELECT * FROM events TIMESTAMP AS OF timestamp_expression"
            },
            "sink": {
                "type": "<sink type>"
            },
            "enableStaging": true,
            "stagingSettings": {
                "linkedServiceName": {
                    "referenceName": "MyStagingStorage",
                    "type": "LinkedServiceReference"
                },
                "path": "mystagingpath"
            }
        }
    }
]
```

### Delta lake as sink

To copy data to Azure Databricks Delta Lake, the following properties are supported in the Copy activity **sink** section.

| Property      | Description                                                  | Required |
| :------------ | :----------------------------------------------------------- | :------- |
| type          | The type property of the Copy activity sink, set to **AzureDatabricksDeltaLakeSink**. | Yes      |
| preCopyScript | Specify a SQL query for the Copy activity to run before writing data into Databricks Delta table in each run. You can use this property to clean up the preloaded data, or add a truncate table or Vacuum statement. | No       |
| importSettings | Advanced settings used to write data into delta table. | No |
| ***Under `importSettings`:*** |                                                              |  |
| type | The type of import command, set to **AzureDatabricksDeltaLakeImportCommand**. | Yes |
| dateFormat |  | No |
| timestampFormat |  | No |

#### Direct copy to delta lake

If your source data store and format meet the criteria described in this section, you can use the Copy activity to directly copy from source to Azure Databricks Delta Lake. Azure Data Factory checks the settings and fails the Copy activity run if the following criteria is not met:

- The **source linked service** is [Azure Blob storage](connector-azure-blob.md) or [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md). The account credential should be pre-configured in Azure Databricks cluster configuration, learn more from [Prerequisites](#prerequisites).

- The **source data format** is of **Parquet**, **delimited text**, or **Avro** with the following configurations, and points to a folder instead of file.

    - For **Parquet** format, the compression codec is **none**, **snappy**, or **gzip**.
    - For **delimited text** format:
        - `rowDelimiter` is default, or any single character.
        - `compression` can be **none**, **bzip2**, **gzip**.
        - `encodingName` UTF-7 is not supported.
    - For **Avro** format, the compression codec is **none**, **deflate**, or **snappy**.

- In the Copy activity source: 

    -  `additionalColumns` is not specified.
    - `prefix`, `modifiedDateTimeStart`, `modifiedDateTimeEnd`, and `enablePartitionDiscovery` are not specified.
    - `wildcardFileName` one of the following: "*", "*.*", "*.fileextension", and `wildcardFolderName` is not specified.

**Example:**

```json
"activities":[
    {
        "name": "CopyToDeltaLake",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<Delta lake output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "AzureDatabricksDeltaLakeSink"
            }
        }
    }
]
```

#### Staged copy to delta lake

When your source data store or format does not match the direct copy criteria, as mentioned in the last section, enable the built-in staged copy using an interim Azure storage instance. The staged copy feature also provides you better throughput. Data Factory automatically converts the data to meet the data format requirements into staging storage, then load data into delta lake from there. Finally, it cleans up your temporary data from the storage. See [Staged copy](copy-activity-performance-features.md#staged-copy) for details about copying data using staging.

To use this feature, create an [Azure Blob storage linked service](connector-azure-blob-storage.md#linked-service-properties) or [Azure Data Lake Storage Gen2 linked service](connector-azure-data-lake-storage.md#linked-service-properties) that refers to the storage account as the interim staging. Then specify the `enableStaging` and `stagingSettings` properties in the Copy activity.

>[!NOTE]
>The staging storage account credential should be pre-configured in Azure Databricks cluster configuration, learn more from [Prerequisites](#prerequisites).

**Example:**

```json
"activities":[
    {
        "name": "CopyToDeltaLake",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<Delta lake output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "AzureDatabricksDeltaLakeSink"
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

For more information about the properties, see [Lookup activity](control-flow-lookup-activity.md).

## Next steps

For a list of data stores supported as sources and sinks by Copy activity in Data Factory, see [supported data stores and formats](copy-activity-overview.md#supported-data-stores-and-formats).
