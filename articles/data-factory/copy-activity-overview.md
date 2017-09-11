---
title: Copy Activity in Azure Data Factory | Microsoft Docs
description: Learn about the copy activity in Azure Data Factory that you can use to copy data from a supported source data store to a supported sink data store. 
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: 
ms.date: 09/08/2017
ms.author: shlo

---
# Copy Activity in Azure Data Factory

## Overview

In Azure Data Factory, you can use Copy Activity to copy data among data stores located on-premises and in the cloud. After the data is copied, it can be further transformed and analyzed. You can also use Copy Activity to publish transformation and analysis results for business intelligence (BI) and application consumption.

![Role of Copy Activity](media/copy-activity-overview/copy-activity.png)

> [!NOTE]
> If you are new to Azure Data Factory, read through [Introduction to Azure Data Factory](introduction.md) before reading this article.
> To learn about pipeline and activities in general, see [Pipelines and activities in Azure Data Factory](concepts-pipelines-activities.md).

Copy Activity is executed on an [Integration Runtime](concepts-integration-runtime.md). For different data copy scenario, you can choose different flavor of Integration Runtime:

* When copying data between data stores that both are publicly accessible, copy activity can be empowered by **managed-elastic Integration Runtime**, which is secure, reliable, scalable, and [globally available](concepts-integration-runtime.md).
* When copying data from/to data stores located on-premises or in a network with access control (for example, Azure Virtual Network), you need to set up a **self-hosted Integrated Runtime** to empower data copy.

Copy Activity goes through the following stages to copy data from a source to a sink. The service that powers Copy Activity:

1. Reads data from a source data store.
2. Performs serialization/deserialization, compression/decompression, column mapping, etc. It does these operations based on the configurations of the input dataset, output dataset, and Copy Activity.
3. Writes data to the sink/destination data store.

![Copy Activity Overview](media/copy-activity-overview/copy-activity-overview.png)

## Supported data stores and formats

[!INCLUDE [data-factory-v2-supported-data-stores](../../includes/data-factory-v2-supported-data-stores.md)]

### Supported file formats

You can use Copy Activity to **copy files as-is** between two file-based data stores, in which case the data is copied efficiently without any serialization/deserialization.

Copy Activity also supports reading from and writing to files in specified formats: **Text, JSON, Avro, ORC, and Parquet**, and compression codec **GZip, Deflate, BZip2, and ZipDeflate** are supported. See [Supported file and compression formats](supported-file-formats-and-compression-codecs.md) with details.

For example, you can do the following copy activities:

* Copy data in on-premises SQL Server and write to Azure Data Lake Store in ORC format.
* Copy files in text (CSV) format from on-premises File System and write to Azure Blob in Avro format.
* Copy zipped files from on-premises File System and decompress then land to Azure Data Lake Store.
* Copy data in GZip compressed text (CSV) format from Azure Blob and write to Azure SQL Database.

## Configuration

To use copy activity in Azure Data Factory, you need to:

1. **Create linked services for source data store and sink data store.** Refer to the connector article's "Linked service properties" section on how to configure and the supported properties. You can find the supported connector list in [Supported data stores and formats](#supported-data-stores-and-formats) section.
2. **Create datasets for source and sink.** Refer to the source and sink connector articles' "Dataset properties" section on how to configure and the supported properties.
3. **Create a pipeline with copy activity.** The next section provides an example.  

### Syntax

The following template of a copy activity lists exhausted supported properties. Specify the ones fits your scenario.

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
                "ColumnMappings": "<column mapping>"
            },
            "cloudDataMovementUnits": <number>,
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

### Syntax details

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of a copy activity must be set to: **Copy** | Yes |
| inputs | Specify the dataset you created which points to the source data. Copy activity supports only a single input. | Yes |
| outputs | Specify the dataset you created which points to the sink data. Copy activity supports only a single output. | Yes |
| typeProperties | A group of properties to configure copy activity. | Yes |
| source | Specify the copy source type and the corresponding properties on how to retrieve data.<br/><br/>Learn details from the "Copy activity properties" section in connector article listed in [Supported data stores and formats](#supported-data-stores-and-formats). | Yes |
| sink | Specify the copy sink type and the corresponding properties on how to write data.<br/><br/>Learn details from the "Copy activity properties" section in connector article listed in [Supported data stores and formats](#supported-data-stores-and-formats). | Yes |
| translator | Specify explicit column mappings from source to sink. Applies when the default copy behavior cannot fulfill your need.<br/><br/>Learn details from [Schema and data type mapping](copy-activity-schema-and-type-mapping.md). | No |
| cloudDataMovementUnits | Specify the powerfulness of managed-elastic [Integration Runtime](concepts-integration-runtime.md) to empower data copy.<br/><br/>Learn details from [Cloud data movement units](copy-activity-performance.md). | No |
| parallelCopies | Specify the parallelism that you want Copy Activity to use when reading data from source and writing data to sink.<br/><br/>Learn details from [Parallel copy](copy-activity-performance.md#parallel-copy). | No |
| enableStaging<br/>stagingSettings | Choose to stage the interim data in aa blob storage instead of directly copy data from source to sink.<br/><br/>Learn the useful scenarios and configuration details from [Staged copy](copy-activity-performance.md#staged-copy). | No |
| enableSkipIncompatibleRow<br/>redirectIncompatibleRowSettings| Choose how to handle incompatible rows when copying data from source to sink.<br/><br/>Learn details from [Fault tolerance](copy-activity-fault-tolerance.md). | No |

## Schema and data type mapping

See the [Schema and data type mapping](copy-activity-schema-and-type-mapping.md), which describes how copy activity maps your source data to sink.

## Fault tolerance

By default, copy activity stops copying data and return failure when encounter incompatible data between source and sink; while you can explicitly configure to skip and log the incompatible rows and only copy those compatible data to make the copy succeeded. See the [Copy Activity fault tolerance](copy-activity-fault-tolerance.md) on more details.

## Performance and tuning

See the [Copy Activity performance and tuning guide](copy-activity-performance.md), which describes key factors that affect the performance of data movement (Copy Activity) in Azure Data Factory. It also lists the observed performance during internal testing and discusses various ways to optimize the performance of Copy Activity.

## Security considerations

See the [Security considerations](copy-activity-security-considerations.md) article, which describes security infrastructure that data movement services in Azure Data Factory use to secure your data.

## Next steps
See the following quickstarts, tutorials, and samples:

- [Copy data from one location to another location in the same Azure Blob Storage](quickstart-create-data-factory-dot-net.md)
- [Copy data from Azure Blob Storage to Azure SQL Database](tutorial-copy-data-dot-net.md)
- [Copy data from on-premises SQL Server to Azure](tutorial-copy-onprem-data-to-cloud-powershell.md)