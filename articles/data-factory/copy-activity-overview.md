---
title: Copy activity in Azure Data Factory | Microsoft Docs
description: Learn about the copy activity in Azure Data Factory. You can use it to copy data from a supported source data store to a supported sink data store.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 08/12/2019
ms.author: jingwang

---
# Copy activity in Azure Data Factory

## Overview

> [!div class="op_single_selector" title1="Select the version of Data Factory that you're using:"]
> * [Version 1](v1/data-factory-data-movement-activities.md)
> * [Current version](copy-activity-overview.md)

In Azure Data Factory, you can use the copy activity to copy data among data stores located on-premises and in the cloud. After you copy the data, you can use other activities to further transform and analyze it. You can also use copy activity to publish transformation and analysis results for business intelligence (BI) and application consumption.

![The role of the copy activity](media/copy-activity-overview/copy-activity.png)

The copy activity is executed on an [integration runtime](concepts-integration-runtime.md). You can use different types of integration runtimes for different data copy scenarios:

* When you're copying data between two data stores that are publicly accessible through the internet from any IP, you can use the Azure integration runtime for the copy activity. This integration runtime is secure, reliable, scalable, and [globally available](concepts-integration-runtime.md#integration-runtime-location).
* When you're copying data to and from data stores that are located on-premises or in a network with access control (for example, an Azure virtual network), you need to set up a self-hosted integration runtime.

An integration runtime needs to be associated with each source and sink data store. For information about how the copy activity determines which integration runtime to use, see [Determining which IR to use](concepts-integration-runtime.md#determining-which-ir-to-use).

To copy data from a source to a sink, the service that runs the copy activity performs these steps:

1. Reads data from a source data store.
2. Performs serialization/deserialization, compression/decompression, column mapping, and so on. It does these operations based on the configurations of the input dataset, output dataset, and copy activity.
3. Writes data to the sink/destination data store.

![Copy activity overview](media/copy-activity-overview/copy-activity-overview.png)

## Supported data stores and formats

[!INCLUDE [data-factory-v2-supported-data-stores](../../includes/data-factory-v2-supported-data-stores.md)]

### Supported file formats

You can use the copy activity to copy files as is between two file-based data stores. In this case, the data is copied efficiently without any serialization or deserialization.

The copy activity can also read from and write to files in these formats:
- Text
- JSON
- Avro
- ORC
- Parquet

The copy activity can compress and decompress files with these codecs: 
- Gzip
- Deflate
- Bzip2
- ZipDeflate
For more information, see [Supported file and compression formats](supported-file-formats-and-compression-codecs.md).

For example, you can do the following copy activities:

* Copy data from an on-premises SQL Server database and write the data to Azure Data Lake Storage Gen2 in Parquet format.
* Copy files in text (CSV) format from an on-premises file system and write to Azure Blob storage in Avro format.
* Copy zipped files from an on-premises file system, decompress them, and write them to Azure Data Lake Storage Gen2.
* Copy data in Gzip compressed-text (CSV) format from Azure Blob storage and write it to Azure SQL Database.
* Many more activities that require serialization/deserialization or compression/decompression.

## Supported regions

The service that enables the copy activity is available globally in the regions and geographies listed in [Azure integration runtime locations](concepts-integration-runtime.md#integration-runtime-location). The globally available topology ensures efficient data movement that usually avoids cross-region hops. See [Products by region](https://azure.microsoft.com/regions/#services) to check the availability of Data Factory and data movement in a specific region.

## Configuration

To use the copy activity in Azure Data Factory, you need to:

1. **Create linked services for the source data store and the sink data store.** Refer to the connector article's "Linked service properties" section for configuration information and supported properties. You can find the list of supported connectors in the [Supported data stores and formats](#supported-data-stores-and-formats) section of this article.
2. **Create datasets for the source and sink.** Refer to the "Dataset properties" sections of the source and sink connector articles for configuration information and supported properties.
3. **Create a pipeline with the copy activity.** The next section provides an example.

### Syntax

The following template of a copy activity contains a complete list of supported properties. Specify the ones that fit your scenario.

```json
"activities":[
    {
        "name": "CopyActivityTemplate",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<source dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<sink dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>",
                <properties>
            },
            "sink": {
                "type": "<sink type>"
                <properties>
            },
            "translator":
            {
                "type": "TabularTranslator",
                "columnMappings": "<column mapping>"
            },
            "dataIntegrationUnits": <number>,
            "parallelCopies": <number>,
            "enableStaging": true/false,
            "stagingSettings": {
                <properties>
            },
            "enableSkipIncompatibleRow": true/false,
            "redirectIncompatibleRowSettings": {
                <properties>
            }
        }
    }
]
```

#### Syntax details

| Property | Description | Required? |
|:--- |:--- |:--- |
| type | For a copy activity, set to `Copy` | Yes |
| inputs | Specify the dataset that you created that points to the source data. The copy activity supports only a single input. | Yes |
| outputs | Specify the dataset that you created that points to the sink data. The copy activity supports only a single output. | Yes |
| typeProperties | Specify properties to configure the copy activity. | Yes |
| source | Specify the copy source type and the corresponding properties for retrieving data.<br/><br/>For more information, see the "Copy activity properties" section in the connector article listed in [Supported data stores and formats](#supported-data-stores-and-formats). | Yes |
| sink | Specify the copy sink type and the corresponding properties for writing data.<br/><br/>For more information, see the "Copy activity properties" section in the connector article listed in [Supported data stores and formats](#supported-data-stores-and-formats). | Yes |
| translator | Specify explicit column mappings from source to sink. This property applies when the default copy behavior doesn't meet your needs.<br/><br/>For more information, see [Schema mapping in copy activity](copy-activity-schema-and-type-mapping.md). | No |
| dataIntegrationUnits | Specify a measure that represents the amount of power that [Azure integration runtime](concepts-integration-runtime.md) uses for data copy. These units were formerly known as cloud Data Movement Units (DMU). <br/><br/>For more information, see [Data Integration Units](copy-activity-performance.md#data-integration-units). | No |
| parallelCopies | Specify the parallelism that you want the copy activity to use when reading data from the source and writing data to the sink.<br/><br/>For more information, see [Parallel copy](copy-activity-performance.md#parallel-copy). | No |
| enableStaging<br/>stagingSettings | Specify whether to stage the interim data in Blob storage instead of directly copying data from source to sink.<br/><br/>For information about useful scenarios and configuration details, see [Staged copy](copy-activity-performance.md#staged-copy). | No |
| enableSkipIncompatibleRow<br/>redirectIncompatibleRowSettings| Choose how to handle incompatible rows when you copy data from source to sink.<br/><br/>For more information, see [Fault tolerance](copy-activity-fault-tolerance.md). | No |

## Monitoring

You can monitor the copy activity run in the Azure Data Factory **Author & Monitor** UI or programmatically. You can then compare the performance and configuration of your scenario to Copy Activity's [performance reference](copy-activity-performance.md#performance-reference) from in-house testing.

### Monitor visually

To visually monitor the copy activity run, go to your data factory -> **Author & Monitor** -> **Monitor tab**, you see a list of pipeline runs with a "View Activity Runs" link in the **Actions** column.

![Monitor pipeline runs](./media/load-data-into-azure-data-lake-store/monitor-pipeline-runs.png)

Click to see the list of activities in this pipeline run. In the **Actions** column, you have links to the copy activity input, output, errors (if copy activity run fails), and details.

![Monitor activity runs](./media/load-data-into-azure-data-lake-store/monitor-activity-runs.png)

Click the "**Details**" link under **Actions** to see copy activity's execution details and performance characteristics. It shows you information including volume/rows/files of data copied from source to sink, throughput, steps it goes through with corresponding duration and used configurations for your copy scenario.

>[!TIP]
>For some scenarios, you will also see "**Performance tuning tips**" on top of the copy monitoring page,  which tells you the bottleneck identified and guides you on what to change so as to boost copy throughput, see an example with details [here](#performance-and-tuning).

**Example: copy from Amazon S3 to Azure Data Lake Store**
![Monitor activity run details](./media/copy-activity-overview/monitor-activity-run-details-adls.png)

**Example: copy from Azure SQL Database to Azure SQL Data Warehouse using staged copy**
![Monitor activity run details](./media/copy-activity-overview/monitor-activity-run-details-sql-dw.png)

### Monitor programmatically

Copy activity execution details and performance characteristics are also returned in the Copy Activity run result -> Output section. Below is an exhaustive list; only the applicable ones to your copy scenario will show up. Learn how to monitor activity run from [quickstart monitoring section](quickstart-create-data-factory-dot-net.md#monitor-a-pipeline-run).

| Property name  | Description | Unit |
|:--- |:--- |:--- |
| dataRead | Data size read from source | Int64 value in **bytes** |
| dataWritten | Data size written to sink | Int64 value in **bytes** |
| filesRead | Number of files being copied when copying data from file storage. | Int64 value (no unit) |
| filesWritten | Number of files being copied when copying data to file storage. | Int64 value (no unit) |
| sourcePeakConnections | Number of max concurrent connections established to source data store during the copy activity run. | Int64 value (no unit) |
| sinkPeakConnections | Number of max concurrent connections established to sink data store during the copy activity run. | Int64 value (no unit) |
| rowsRead | Number of rows being read from source (not applicable for binary copy). | Int64 value (no unit) |
| rowsCopied | Number of rows being copied to sink (not applicable for binary copy). | Int64 value (no unit) |
| rowsSkipped | Number of incompatible rows being skipped. You can turn on the feature by set "enableSkipIncompatibleRow" to true. | Int64 value (no unit) |
| copyDuration | The duration of the copy. | Int32 value in seconds |
| throughput | Ratio at which data are transferred. | Floating point number in **KB/s** |
| sourcePeakConnections | Peak number of concurrent connections established to the source data store during copy. | Int32 value |
| sinkPeakConnections| Peak number of concurrent connections established to the sink data store during copy.| Int32 value |
| sqlDwPolyBase | If PolyBase is used when copying data into SQL Data Warehouse. | Boolean |
| redshiftUnload | If UNLOAD is used when copying data from Redshift. | Boolean |
| hdfsDistcp | If DistCp is used when copying data from HDFS. | Boolean |
| effectiveIntegrationRuntime | Show which Integration Runtime(s) is used to empower the activity run, in the format of `<IR name> (<region if it's Azure IR>)`. | Text (string) |
| usedDataIntegrationUnits | The effective Data Integration Units during copy. | Int32 value |
| usedParallelCopies | The effective parallelCopies during copy. | Int32 value |
| redirectRowPath | Path to the log of skipped incompatible rows in the blob storage you configure under "redirectIncompatibleRowSettings". See below example. | Text (string) |
| executionDetails | More details on the stages copy activity goes through, and the corresponding steps, duration, used configurations, etc. It's not recommended to parse this section as it may change.<br/><br/>ADF also reports the detailed durations (in seconds) spent on respective steps under `detailedDurations`. The durations of these steps are exclusive and only those that apply to the given copy activity run would show up:<br/>- **Queuing duration** (`queuingDuration`): The elapsed time until the copy activity actually starts on the integration runtime. If you use Self-hosted IR and this value is large, suggest to check the IR capacity and usage, and scale up/out according to your workload. <br/>- **Pre-copy script duration** (`preCopyScriptDuration`): The elapsed time between copy activity starting on IR and copy activity finishing executing the pre-copy script in sink data store. Apply when you configure the pre-copy script. <br/>- **Time-to-first-byte** (`timeToFirstByte`): The elapsed time between the end of the previous step and the IR receiving the first byte from the source data store. Apply to non-file-based source. If this value is large, suggest to check and optimize the query or server.<br/>- **Transfer duration** (`transferDuration`): The elapsed time between the end of the previous step and the IR transferring all the data from source to sink. | Array |
| perfRecommendation | Copy performance tuning tips. See [Performance and tuning](#performance-and-tuning) section on details. | Array |

```json
"output": {
    "dataRead": 6198358,
    "dataWritten": 19169324,
    "filesRead": 1,
    "sourcePeakConnections": 1,
    "sinkPeakConnections": 2,
    "rowsRead": 39614,
    "rowsCopied": 39614,
    "copyDuration": 1325,
    "throughput": 4.568,
    "errors": [],
    "effectiveIntegrationRuntime": "DefaultIntegrationRuntime (West US)",
    "usedDataIntegrationUnits": 4,
    "usedParallelCopies": 1,
    "executionDetails": [
        {
            "source": {
                "type": "AzureBlobStorage"
            },
            "sink": {
                "type": "AzureSqlDatabase"
            },
            "status": "Succeeded",
            "start": "2019-08-06T01:01:36.7778286Z",
            "duration": 1325,
            "usedDataIntegrationUnits": 4,
            "usedParallelCopies": 1,
            "detailedDurations": {
                "queuingDuration": 2,
                "preCopyScriptDuration": 12,
                "transferDuration": 1311
            }
        }
    ],
    "perfRecommendation": [
        {
            "Tip": "Sink Azure SQL Database: The DTU utilization was high during the copy activity run. To achieve better performance, you are suggested to scale the database to a higher tier than the current 1600 DTUs.",
            "ReferUrl": "https://go.microsoft.com/fwlink/?linkid=2043368",
            "RuleName": "AzureDBTierUpgradePerfRecommendRule"
        }
    ]
}
```

## Schema and data type mapping

See the [Schema and data type mapping](copy-activity-schema-and-type-mapping.md), which describes how copy activity maps your source data to sink.

## Fault tolerance

By default, copy activity stops copying data and returns a failure when it encounters incompatible data between source and sink. You can explicitly configure to skip and log the incompatible rows and only copy those compatible data to make the copy succeeded. See the [Copy Activity fault tolerance](copy-activity-fault-tolerance.md) on more details.

## Performance and tuning

See the [Copy Activity performance and tuning guide](copy-activity-performance.md), which describes key factors that affect the performance of data movement (Copy Activity) in Azure Data Factory. It also lists the observed performance during internal testing and discusses various ways to optimize the performance of Copy Activity.

In some cases, when you execute a copy activity in ADF, you will directly see "**Performance tuning tips**" on top of the [copy activity monitoring page](#monitor-visually) as shown in the following example. It not only tells you the bottleneck identified for the given copy run, but also guides you on what to change so as to boost copy throughput. The performance tuning tips currently provide suggestions like to use PolyBase when copying data into Azure SQL Data Warehouse, to increase Azure Cosmos DB RU or Azure SQL DB DTU when the resource on data store side is the bottleneck, to remove the unnecessary staged copy, etc. The performance tuning rules will be gradually enriched as well.

**Example: copy into Azure SQL DB with performance tuning tips**

In this sample, during copy run, ADF notices that the sink Azure SQL DB reaches a high DTU utilization which slows down the write operations, so the suggestion is to increase the Azure SQL DB tier with more DTU.

![Copy monitoring with performance tuning tips](./media/copy-activity-overview/copy-monitoring-with-performance-tuning-tips.png)

## Incremental copy
Data Factory supports scenarios for incrementally copying delta data from a source data store to a sink data store. See [Tutorial: incrementally copy data](tutorial-incremental-copy-overview.md).

## Read and write partitioned data
In version 1, Azure Data Factory supported reading or writing partitioned data by using SliceStart/SliceEnd/WindowStart/WindowEnd system variables. In the current version, you can achieve this behavior by using a pipeline parameter and trigger's start time/scheduled time as a value of the parameter. For more information, see [How to read or write partitioned data](how-to-read-write-partitioned-data.md).

## Next steps
See the following quickstarts, tutorials, and samples:

- [Copy data from one location to another location in the same Azure Blob Storage](quickstart-create-data-factory-dot-net.md)
- [Copy data from Azure Blob Storage to Azure SQL Database](tutorial-copy-data-dot-net.md)
- [Copy data from on-premises SQL Server to Azure](tutorial-hybrid-copy-powershell.md)
