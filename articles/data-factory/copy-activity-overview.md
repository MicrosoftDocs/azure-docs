---
title: Copy activity in Azure Data Factory 
description: Learn about the Copy activity in Azure Data Factory. You can use it to copy data from a supported source data store to a supported sink data store.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: shwang
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.date: 03/25/2020
ms.author: jingwang

---
# Copy activity in Azure Data Factory

> [!div class="op_single_selector" title1="Select the version of Data Factory that you're using:"]
> * [Version 1](v1/data-factory-data-movement-activities.md)
> * [Current version](copy-activity-overview.md)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

In Azure Data Factory, you can use the Copy activity to copy data among data stores located on-premises and in the cloud. After you copy the data, you can use other activities to further transform and analyze it. You can also use the Copy activity to publish transformation and analysis results for business intelligence (BI) and application consumption.

![The role of the Copy activity](media/copy-activity-overview/copy-activity.png)

The Copy activity is executed on an [integration runtime](concepts-integration-runtime.md). You can use different types of integration runtimes for different data copy scenarios:

* When you're copying data between two data stores that are publicly accessible through the internet from any IP, you can use the Azure integration runtime for the copy activity. This integration runtime is secure, reliable, scalable, and [globally available](concepts-integration-runtime.md#integration-runtime-location).
* When you're copying data to and from data stores that are located on-premises or in a network with access control (for example, an Azure virtual network), you need to set up a self-hosted integration runtime.

An integration runtime needs to be associated with each source and sink data store. For information about how the Copy activity determines which integration runtime to use, see [Determining which IR to use](concepts-integration-runtime.md#determining-which-ir-to-use).

To copy data from a source to a sink, the service that runs the Copy activity performs these steps:

1. Reads data from a source data store.
2. Performs serialization/deserialization, compression/decompression, column mapping, and so on. It performs these operations based on the configuration of the input dataset, output dataset, and Copy activity.
3. Writes data to the sink/destination data store.

![Copy activity overview](media/copy-activity-overview/copy-activity-overview.png)

## Supported data stores and formats

[!INCLUDE [data-factory-v2-supported-data-stores](../../includes/data-factory-v2-supported-data-stores.md)]

### Supported file formats

[!INCLUDE [data-factory-v2-file-formats](../../includes/data-factory-v2-file-formats.md)] 

You can use the Copy activity to copy files as-is between two file-based data stores, in which case the data is copied efficiently without any serialization or deserialization. In addition, you can also parse or generate files of a given format, for example, you can perform the following:

* Copy data from a SQL Server database and write to Azure Data Lake Storage Gen2 in Parquet format.
* Copy files in text (CSV) format from an on-premises file system and write to Azure Blob storage in Avro format.
* Copy zipped files from an on-premises file system, decompress them on-the-fly, and write extracted files to Azure Data Lake Storage Gen2.
* Copy data in Gzip compressed-text (CSV) format from Azure Blob storage and write it to Azure SQL Database.
* Many more activities that require serialization/deserialization or compression/decompression.

## Supported regions

The service that enables the Copy activity is available globally in the regions and geographies listed in [Azure integration runtime locations](concepts-integration-runtime.md#integration-runtime-location). The globally available topology ensures efficient data movement that usually avoids cross-region hops. See [Products by region](https://azure.microsoft.com/regions/#services) to check the availability of Data Factory and data movement in a specific region.

## Configuration

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

In general, to use the Copy activity in Azure Data Factory, you need to:

1. **Create linked services for the source data store and the sink data store.** You can find the list of supported connectors in the [Supported data stores and formats](#supported-data-stores-and-formats) section of this article. Refer to the connector article's "Linked service properties" section for configuration information and supported properties. 
2. **Create datasets for the source and sink.** Refer to the "Dataset properties" sections of the source and sink connector articles for configuration information and supported properties.
3. **Create a pipeline with the Copy activity.** The next section provides an example.

### Syntax

The following template of a Copy activity contains a complete list of supported properties. Specify the ones that fit your scenario.

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
| type | For a Copy activity, set to `Copy` | Yes |
| inputs | Specify the dataset that you created that points to the source data. The Copy activity supports only a single input. | Yes |
| outputs | Specify the dataset that you created that points to the sink data. The Copy activity supports only a single output. | Yes |
| typeProperties | Specify properties to configure the Copy activity. | Yes |
| source | Specify the copy source type and the corresponding properties for retrieving data.<br/>For more information, see the "Copy activity properties" section in the connector article listed in [Supported data stores and formats](#supported-data-stores-and-formats). | Yes |
| sink | Specify the copy sink type and the corresponding properties for writing data.<br/>For more information, see the "Copy activity properties" section in the connector article listed in [Supported data stores and formats](#supported-data-stores-and-formats). | Yes |
| translator | Specify explicit column mappings from source to sink. This property applies when the default copy behavior doesn't meet your needs.<br/>For more information, see [Schema mapping in copy activity](copy-activity-schema-and-type-mapping.md). | No |
| dataIntegrationUnits | Specify a measure that represents the amount of power that the [Azure integration runtime](concepts-integration-runtime.md) uses for data copy. These units were formerly known as cloud Data Movement Units (DMU). <br/>For more information, see [Data Integration Units](copy-activity-performance-features.md#data-integration-units). | No |
| parallelCopies | Specify the parallelism that you want the Copy activity to use when reading data from the source and writing data to the sink.<br/>For more information, see [Parallel copy](copy-activity-performance-features.md#parallel-copy). | No |
| preserve | Specify whether to preserve metadata/ACLs during data copy. <br/>For more information, see [Preserve metadata](copy-activity-preserve-metadata.md). |No |
| enableStaging<br/>stagingSettings | Specify whether to stage the interim data in Blob storage instead of directly copying data from source to sink.<br/>For information about useful scenarios and configuration details, see [Staged copy](copy-activity-performance-features.md#staged-copy). | No |
| enableSkipIncompatibleRow<br/>redirectIncompatibleRowSettings| Choose how to handle incompatible rows when you copy data from source to sink.<br/>For more information, see [Fault tolerance](copy-activity-fault-tolerance.md). | No |

## Monitoring

You can monitor the Copy activity run in the Azure Data Factory both visually and programmatically. For details, see [Monitor copy activity](copy-activity-monitoring.md).

## Incremental copy

Data Factory enables you to incrementally copy delta data from a source data store to a sink data store. For details, see [Tutorial: Incrementally copy data](tutorial-incremental-copy-overview.md).

## Performance and tuning

The [copy activity monitoring](copy-activity-monitoring.md) experience shows you the copy performance statistics for each of your activity run. The [Copy activity performance and scalability guide](copy-activity-performance.md) describes key factors that affect the performance of data movement via the Copy activity in Azure Data Factory. It also lists the performance values observed during testing and discusses how to optimize the performance of the Copy activity.

## Resume from last failed run

Copy activity supports resume from last failed run when you copy large size of files as-is with binary format between file-based stores and choose to preserve the folder/file hierarchy from source to sink, e.g. to migrate data from Amazon S3 to Azure Data Lake Storage Gen2. It applies to the following file-based connectors: [Amazon S3](connector-amazon-simple-storage-service.md), [Azure Blob](connector-azure-blob-storage.md), [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md), [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md), [Azure File Storage](connector-azure-file-storage.md), [File System](connector-file-system.md), [FTP](connector-ftp.md), [Google Cloud Storage](connector-google-cloud-storage.md), [HDFS](connector-hdfs.md), and [SFTP](connector-sftp.md).

You can leverage the copy activity resume in the following two ways:

- **Activity level retry:** You can set retry count on copy activity. During the pipeline execution, if this copy activity run fails, the next automatic retry will start from last trial's failure point.
- **Rerun from failed activity:** After pipeline execution completion, you can also trigger a rerun from the failed activity in the ADF UI monitoring view or programmatically. If the failed activity is a copy activity, the pipeline will not only rerun from this activity, but also resume from the previous run's failure point.

    ![Copy resume](media/copy-activity-overview/resume-copy.png)

Few points to note:

- Resume happens at file level. If copy activity fails when copying a file, in next run, this specific file will be re-copied.
- For resume to work properly, do not change the copy activity settings between the reruns.
- When you copy data from Amazon S3, Azure Blob, Azure Data Lake Storage Gen2 and Google Cloud Storage, copy activity can resume from arbitrary number of copied files. While for the rest of file-based connectors as source, currently copy activity supports resume from a limited number of files, usually at the range of tens of thousands and varies depending on the length of the file paths; files beyond this number will be re-copied during reruns.

For other scenarios than binary file copy, copy activity rerun starts from the beginning.

## Preserve metadata along with data

While copying data from source to sink, in scenarios like data lake migration, you can also choose to preserve the metadata and ACLs along with data using copy activity. See [Preserve metadata](copy-activity-preserve-metadata.md) for details.

## Schema and data type mapping

See [Schema and data type mapping](copy-activity-schema-and-type-mapping.md) for information about how the Copy activity maps your source data to your sink.

## Add additional columns during copy

In addition to copying data from source data store to sink, you can also configure to add additional data columns to copy along to sink. For example:

- When copy from file-based source, store the relative file path as an additional column to trace from which file the data comes from.
- Add a column with ADF expression, to attach ADF system variables like pipeline name/pipeline id, or store other dynamic value from upstream activity's output.
- Add a column with static value to meet your downstream consumption need.

You can find the following configuration on copy activity source tab: 

![Add additional columns in copy activity](./media/copy-activity-overview/copy-activity-add-additional-columns.png)

>[!TIP]
>This feature works with the latest dataset model. If you don't see this option from the UI, try creating a new dataset.

To configure it programmatically, add the `additionalColumns` property in your copy activity source:

| Property | Description | Required |
| --- | --- | --- |
| additionalColumns | Add additional data columns to copy to sink.<br><br>Each object under the `additionalColumns` array represents an extra column. The `name` defines the column name, and the `value` indicates the data value of that column.<br><br>Allowed data values are:<br>- **`$$FILEPATH`** - a reserved variable indicates to store the source files' relative path to the folder path specified in dataset. Apply to file-based source.<br>- **Expression**<br>- **Static value** | No |

**Example:**

```json
"activities":[
    {
        "name": "CopyWithAdditionalColumns",
        "type": "Copy",
        "inputs": [...],
        "outputs": [...],
        "typeProperties": {
            "source": {
                "type": "<source type>",
                "additionalColumns": [
                    {
                        "name": "filePath",
                        "value": "$$FILEPATH"
                    },
                    {
                        "name": "pipelineName",
                        "value": {
                            "value": "@pipeline().Pipeline",
                            "type": "Expression"
                        }
                    },
                    {
                        "name": "staticValue",
                        "value": "sampleValue"
                    }
                ],
                ...
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Fault tolerance

By default, the Copy activity stops copying data and returns a failure when source data rows are incompatible with sink data rows. To make the copy succeed, you can configure the Copy activity to skip and log the incompatible rows and copy only the compatible data. See [Copy activity fault tolerance](copy-activity-fault-tolerance.md) for details.

## Next steps
See the following quickstarts, tutorials, and samples:

- [Copy data from one location to another location in the same Azure Blob storage account](quickstart-create-data-factory-dot-net.md)
- [Copy data from Azure Blob storage to Azure SQL Database](tutorial-copy-data-dot-net.md)
- [Copy data from a SQL Server database to Azure](tutorial-hybrid-copy-powershell.md)
