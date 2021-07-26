---
title: Copy data to and from Azure Databricks Delta Lake
description: Learn how to copy data to and from Azure Databricks Delta Lake by using a copy activity in an Azure Data Factory pipeline.
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 06/16/2021
---

# Copy data to and from Azure Databricks Delta Lake by using Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy activity in Azure Data Factory to copy data to and from Azure Databricks Delta Lake. It builds on the [Copy activity in Azure Data Factory](copy-activity-overview.md) article, which presents a general overview of copy activity.

## Supported capabilities

This Azure Databricks Delta Lake connector is supported for the following activities:

- [Copy activity](copy-activity-overview.md) with a [supported source/sink matrix](copy-activity-overview.md) table
- [Lookup activity](control-flow-lookup-activity.md)

In general, Azure Data Factory supports Delta Lake with the following capabilities to meet your various needs.

- Copy activity supports Azure Databricks Delta Lake connector to copy data from any supported source data store to Azure Databricks delta lake table, and from delta lake table to any supported sink data store. It leverages your Databricks cluster to perform the data movement, see details in [Prerequisites section](#prerequisites).
- [Mapping Data Flow](concepts-data-flow-overview.md) supports generic [Delta format](format-delta.md) on Azure Storage as source and sink to read and write Delta files for code-free ETL, and runs on managed Azure Integration Runtime.
- [Databricks activities](transform-data-databricks-notebook.md) supports orchestrating your code-centric ETL or machine learning workload on top of delta lake.

## Prerequisites

To use this Azure Databricks Delta Lake connector, you need to set up a cluster in Azure Databricks.

- To copy data to delta lake, Copy activity invokes Azure Databricks cluster to read data from an Azure Storage, which is either your original source or a staging area to where Data Factory firstly writes the source data via built-in staged copy. Learn more from [Delta lake as the sink](#delta-lake-as-sink).
- Similarly, to copy data from delta lake, Copy activity invokes Azure Databricks cluster to write data to an Azure Storage, which is either your original sink or a staging area from where Data Factory continues to write data to final sink via built-in staged copy. Learn more from [Delta lake as the source](#delta-lake-as-source).

The Databricks cluster needs to have access to Azure Blob or Azure Data Lake Storage Gen2 account, both the storage container/file system used for source/sink/staging and the container/file system where you want to write the Delta Lake tables.

- To use **Azure Data Lake Storage Gen2**, you can configure a **service principal** on the Databricks cluster as part of the Apache Spark configuration. Follow the steps in [Access directly with service principal](/azure/databricks/data/data-sources/azure/azure-datalake-gen2#--access-directly-with-service-principal-and-oauth-20).

- To use **Azure Blob storage**, you can configure a **storage account access key** or **SAS token** on the Databricks cluster as part of the Apache Spark configuration. Follow the steps in [Access Azure Blob storage using the RDD API](/azure/databricks/data/data-sources/azure/azure-storage#access-azure-blob-storage-using-the-rdd-api).

During copy activity execution, if the cluster you configured has been terminated, Data Factory automatically starts it. If you author pipeline using Data Factory authoring UI, for operations like data preview, you need to have a live cluster, Data Factory won't start the cluster on your behalf.

#### Specify the cluster configuration

1. In the **Cluster Mode** drop-down, select **Standard**.

2. In the **Databricks Runtime Version** drop-down, select a Databricks runtime version.

3. Turn on [Auto Optimize](/azure/databricks/delta/optimizations/auto-optimize) by adding the following properties to your [Spark configuration](/azure/databricks/clusters/configure#spark-config):

   ```
   spark.databricks.delta.optimizeWrite.enabled true
   spark.databricks.delta.autoCompact.enabled true
   ```

4. Configure your cluster depending on your integration and scaling needs.

For cluster configuration details, see [Configure clusters](/azure/databricks/clusters/configure).

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that define Data Factory entities specific to an Azure Databricks Delta Lake connector.

## Linked service properties

The following properties are supported for an Azure Databricks Delta Lake linked service.

| Property    | Description                                                  | Required |
| :---------- | :----------------------------------------------------------- | :------- |
| type        | The type property must be set to **AzureDatabricksDeltaLake**. | Yes      |
| domain      | Specify the Azure Databricks workspace URL, e.g. `https://adb-xxxxxxxxx.xx.azuredatabricks.net`. |          |
| clusterId   | Specify the cluster ID of an existing cluster. It should be an already created Interactive Cluster. <br>You can find the Cluster ID of an Interactive Cluster on Databricks workspace -> Clusters -> Interactive Cluster Name -> Configuration -> Tags. [Learn more](/azure/databricks/clusters/configure#cluster-tags). |          |
| accessToken | Access token is required for Data Factory to authenticate to Azure Databricks. Access token needs to be generated from the databricks workspace. More detailed steps to find the access token can be found [here](/azure/databricks/dev-tools/api/latest/authentication#generate-token). |          |
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
| table | Name of the delta table. |No for source, yes for sink  |

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

### Delta lake as source

To copy data from Azure Databricks Delta Lake, the following properties are supported in the Copy activity **source** section.

| Property                     | Description                                                  | Required |
| :--------------------------- | :----------------------------------------------------------- | :------- |
| type                         | The type property of the Copy activity source must be set to **AzureDatabricksDeltaLakeSource**. | Yes      |
| query          | Specify the SQL query to read data. For the time travel control, follow the below pattern:<br>- `SELECT * FROM events TIMESTAMP AS OF timestamp_expression`<br>- `SELECT * FROM events VERSION AS OF version` | No       |
| exportSettings | Advanced settings used to retrieve data from delta table. | No       |
| ***Under `exportSettings`:*** |  |  |
| type | The type of export command, set to **AzureDatabricksDeltaLakeExportCommand**. | Yes |
| dateFormat | Format date type to string with a date format. Custom date formats follow the formats at [datetime pattern](https://spark.apache.org/docs/latest/sql-ref-datetime-pattern.html). If not specified, it uses the default value `yyyy-MM-dd`. | No |
| timestampFormat | Format timestamp type to string with a timestamp format. Custom date formats follow the formats at [datetime pattern](https://spark.apache.org/docs/latest/sql-ref-datetime-pattern.html). If not specified, it uses the default value `yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]`. | No |

#### Direct copy from delta lake

If your sink data store and format meet the criteria described in this section, you can use the Copy activity to directly copy from Azure Databricks Delta table to sink. Data Factory checks the settings and fails the Copy activity run if the following criteria is not met:

- The **sink linked service** is [Azure Blob storage](connector-azure-blob-storage.md) or [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md). The account credential should be pre-configured in Azure Databricks cluster configuration, learn more from [Prerequisites](#prerequisites).

- The **sink data format** is of **Parquet**, **delimited text**, or **Avro** with the following configurations, and points to a folder instead of file.

    - For **Parquet** format, the compression codec is **none**, **snappy**, or **gzip**.
    - For **delimited text** format:
        - `rowDelimiter` is any single character.
        - `compression` can be **none**, **bzip2**, **gzip**.
        - `encodingName` UTF-7 is not supported.
    - For **Avro** format, the compression codec is **none**, **deflate**, or **snappy**.

- In the Copy activity source, `additionalColumns` is not specified.
- If copying data to delimited text, in copy activity sink, `fileExtension` need to be ".csv".
- In the Copy activity mapping, type conversion is not enabled.

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
| preCopyScript | Specify a SQL query for the Copy activity to run before writing data into Databricks delta table in each run. Example : `VACUUM eventsTable DRY RUN` You can use this property to clean up the preloaded data, or add a truncate table or Vacuum statement. | No       |
| importSettings | Advanced settings used to write data into delta table. | No |
| ***Under `importSettings`:*** |                                                              |  |
| type | The type of import command, set to **AzureDatabricksDeltaLakeImportCommand**. | Yes |
| dateFormat | Format string to date type with a date format. Custom date formats follow the formats at [datetime pattern](https://spark.apache.org/docs/latest/sql-ref-datetime-pattern.html). If not specified, it uses the default value `yyyy-MM-dd`. | No |
| timestampFormat | Format string to timestamp type with a timestamp format. Custom date formats follow the formats at [datetime pattern](https://spark.apache.org/docs/latest/sql-ref-datetime-pattern.html). If not specified, it uses the default value `yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]`. | No |

#### Direct copy to delta lake

If your source data store and format meet the criteria described in this section, you can use the Copy activity to directly copy from source to Azure Databricks Delta Lake. Azure Data Factory checks the settings and fails the Copy activity run if the following criteria is not met:

- The **source linked service** is [Azure Blob storage](connector-azure-blob-storage.md) or [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md). The account credential should be pre-configured in Azure Databricks cluster configuration, learn more from [Prerequisites](#prerequisites).

- The **source data format** is of **Parquet**, **delimited text**, or **Avro** with the following configurations, and points to a folder instead of file.

    - For **Parquet** format, the compression codec is **none**, **snappy**, or **gzip**.
    - For **delimited text** format:
        - `rowDelimiter` is default, or any single character.
        - `compression` can be **none**, **bzip2**, **gzip**.
        - `encodingName` UTF-7 is not supported.
    - For **Avro** format, the compression codec is **none**, **deflate**, or **snappy**.

- In the Copy activity source: 

    - `wildcardFileName` only contains wildcard `*` but not `?`, and `wildcardFolderName` is not specified.
    - `prefix`, `modifiedDateTimeStart`, `modifiedDateTimeEnd`, and `enablePartitionDiscovery` are not specified.
    - `additionalColumns` is not specified.

- In the Copy activity mapping, type conversion is not enabled.

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
                "type": "AzureDatabricksDeltaLakeSink",
                "sqlReadrQuery": "VACUUM eventsTable DRY RUN"
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

## Monitoring

Azure Data Factory provides the same [copy activity monitoring experience](copy-activity-monitoring.md) as other connectors. In addition, because loading data from/to delta lake is running on your Azure Databricks cluster, you can further [view detailed cluster logs](/azure/databricks/clusters/clusters-manage#--view-cluster-logs) and [monitor performance](/azure/databricks/clusters/clusters-manage#--monitor-performance).

## Lookup activity properties

For more information about the properties, see [Lookup activity](control-flow-lookup-activity.md).

## Next steps

For a list of data stores supported as sources and sinks by Copy activity in Data Factory, see [supported data stores and formats](copy-activity-overview.md#supported-data-stores-and-formats).
