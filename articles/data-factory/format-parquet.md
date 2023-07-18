---
title: Parquet format
titleSuffix: Azure Data Factory & Azure Synapse
description: This topic describes how to deal with Parquet format in Azure Data Factory and Azure Synapse Analytics pipelines.
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.custom: synapse, contperf-fy22q2
ms.topic: conceptual
ms.date: 07/17/2023
ms.author: jianleishen
---

# Parquet format in Azure Data Factory and Azure Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Follow this article when you want to **parse the Parquet files or write the data into Parquet format**. 

Parquet format is supported for the following connectors: 

- [Amazon S3](connector-amazon-simple-storage-service.md)
- [Amazon S3 Compatible Storage](connector-amazon-s3-compatible-storage.md)
- [Azure Blob](connector-azure-blob-storage.md)
- [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md)
- [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md)
- [Azure Files](connector-azure-file-storage.md)
- [File System](connector-file-system.md)
- [FTP](connector-ftp.md)
- [Google Cloud Storage](connector-google-cloud-storage.md)
- [HDFS](connector-hdfs.md)
- [HTTP](connector-http.md)
- [Oracle Cloud Storage](connector-oracle-cloud-storage.md)
- [SFTP](connector-sftp.md)

For a list of supported features for all available connectors, visit the [Connectors Overview](connector-overview.md) article.

## Using Self-hosted Integration Runtime

> [!IMPORTANT]
> For copy empowered by Self-hosted Integration Runtime e.g. between on-premises and cloud data stores, if you are not copying Parquet files **as-is**, you need to install the **64-bit JRE 8 (Java Runtime Environment) or OpenJDK** on your IR machine. Check the following paragraph with more details.

For copy running on Self-hosted IR with Parquet file serialization/deserialization, the service locates the Java runtime by firstly checking the registry *`(SOFTWARE\JavaSoft\Java Runtime Environment\{Current Version}\JavaHome)`* for JRE, if not found, secondly checking system variable *`JAVA_HOME`* for OpenJDK.

- **To use JRE**: The 64-bit IR requires 64-bit JRE. You can find it from [here](https://go.microsoft.com/fwlink/?LinkId=808605).
- **To use OpenJDK**: It's supported since IR version 3.13. Package the jvm.dll with all other required assemblies of OpenJDK into Self-hosted IR machine, and set system environment variable JAVA_HOME accordingly, and then restart Self-hosted IR for taking effect immediately.

> [!TIP]
> If you copy data to/from Parquet format using Self-hosted Integration Runtime and hit error saying "An error occurred when invoking java, message: **java.lang.OutOfMemoryError:Java heap space**", you can add an environment variable `_JAVA_OPTIONS` in the machine that hosts the Self-hosted IR to adjust the min/max heap size for JVM to empower such copy, then rerun the pipeline.

:::image type="content" source="./media/supported-file-formats-and-compression-codecs/set-jvm-heap-size-on-selfhosted-ir.png" alt-text="Set JVM heap size on Self-hosted IR":::

Example: set variable `_JAVA_OPTIONS` with value `-Xms256m -Xmx16g`. The flag `Xms` specifies the initial memory allocation pool for a Java Virtual Machine (JVM), while `Xmx` specifies the maximum memory allocation pool. This means that JVM will be started with `Xms` amount of memory and will be able to use a maximum of `Xmx` amount of memory. By default, the service uses min 64 MB and max 1G.


## Dataset properties

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by the Parquet dataset.

| Property         | Description                                                  | Required |
| ---------------- | ------------------------------------------------------------ | -------- |
| type             | The type property of the dataset must be set to **Parquet**. | Yes      |
| location         | Location settings of the file(s). Each file-based connector has its own location type and supported properties under `location`. **See details in connector article -> Dataset properties section**. | Yes      |
| compressionCodec | The compression codec to use when writing to Parquet files. When reading from Parquet files, Data Factories automatically determine the compression codec based on the file metadata.<br>Supported types are "**none**", "**gzip**", "**snappy**" (default), and "**lzo**". Note currently Copy activity doesn't support LZO when read/write Parquet files. | No       |

> [!NOTE]
> White space in column name is not supported for Parquet files.

Below is an example of Parquet dataset on Azure Blob Storage:

```json
{
    "name": "ParquetDataset",
    "properties": {
        "type": "Parquet",
        "linkedServiceName": {
            "referenceName": "<Azure Blob Storage linked service name>",
            "type": "LinkedServiceReference"
        },
        "schema": [ < physical schema, optional, retrievable during authoring > ],
        "typeProperties": {
            "location": {
                "type": "AzureBlobStorageLocation",
                "container": "containername",
                "folderPath": "folder/subfolder",
            },
            "compressionCodec": "snappy"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by the Parquet source and sink.

### Parquet as source

The following properties are supported in the copy activity ***\*source\**** section.

| Property      | Description                                                  | Required |
| ------------- | ------------------------------------------------------------ | -------- |
| type          | The type property of the copy activity source must be set to **ParquetSource**. | Yes      |
| storeSettings | A group of properties on how to read data from a data store. Each file-based connector has its own supported read settings under `storeSettings`. **See details in connector article -> Copy activity properties section**. | No       |

### Parquet as sink

The following properties are supported in the copy activity ***\*sink\**** section.

| Property      | Description                                                  | Required |
| ------------- | ------------------------------------------------------------ | -------- |
| type          | The type property of the copy activity sink must be set to **ParquetSink**. | Yes      |
| formatSettings | A group of properties. Refer to **Parquet write settings** table below. |    No      |
| storeSettings | A group of properties on how to write data to a data store. Each file-based connector has its own supported write settings under `storeSettings`. **See details in connector article -> Copy activity properties section**. | No       |

Supported **Parquet write settings** under `formatSettings`:

| Property      | Description                                                  | Required                                              |
| ------------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| type          | The type of formatSettings must be set to **ParquetWriteSettings**. | Yes                                                   |
| maxRowsPerFile | When writing data into a folder, you can choose to write to multiple files and specify the max rows per file.  | No |
| fileNamePrefix | Applicable when `maxRowsPerFile` is configured.<br> Specify the file name prefix when writing data to multiple files, resulted in this pattern: `<fileNamePrefix>_00000.<fileExtension>`. If not specified, file name prefix will be auto generated. This property does not apply when source is file-based store or [partition-option-enabled data store](copy-activity-performance-features.md).  | No |

## Mapping data flow properties

In mapping data flows, you can read and write to parquet format in the following data stores: [Azure Blob Storage](connector-azure-blob-storage.md#mapping-data-flow-properties), [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md#mapping-data-flow-properties), [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md#mapping-data-flow-properties) and [SFTP](connector-sftp.md#mapping-data-flow-properties), and you can read parquet format in [Amazon S3](connector-amazon-simple-storage-service.md#mapping-data-flow-properties).

### Source properties

The below table lists the properties supported by a parquet source. You can edit these properties in the **Source options** tab.

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Format | Format must be `parquet` | yes | `parquet` | format |
| Wild card paths | All files matching the wildcard path will be processed. Overrides the folder and file path set in the dataset. | no | String[] | wildcardPaths |
| Partition root path | For file data that is partitioned, you can enter a partition root path in order to read partitioned folders as columns | no | String | partitionRootPath |
| List of files | Whether your source is pointing to a text file that lists files to process | no | `true` or `false` | fileList |
| Column to store file name | Create a new column with the source file name and path | no | String | rowUrlColumn |
| After completion | Delete or move the files after processing. File path starts from the container root | no | Delete: `true` or `false` <br> Move: `[<from>, <to>]` | purgeFiles <br> moveFiles |
| Filter by last modified | Choose to filter files based upon when they were last altered | no | Timestamp | modifiedAfter <br> modifiedBefore |
| Allow no files found | If true, an error is not thrown if no files are found | no | `true` or `false` | ignoreNoFilesFound |

### Source example

The below image is an example of a parquet source configuration in mapping data flows.

:::image type="content" source="media/data-flow/parquet-source.png" alt-text="Parquet source":::

The associated data flow script is:

```
source(allowSchemaDrift: true,
    validateSchema: false,
    rowUrlColumn: 'fileName',
    format: 'parquet') ~> ParquetSource
```

### Sink properties

The below table lists the properties supported by a parquet sink. You can edit these properties in the **Settings** tab.

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Format | Format must be `parquet` | yes | `parquet` | format |
| Clear the folder | If the destination folder is cleared prior to write | no | `true` or `false` | truncate |
| File name option | The naming format of the data written. By default, one file per partition in format `part-#####-tid-<guid>` | no | Pattern: String <br> Per partition: String[] <br> As data in column: String <br> Output to single file: `['<fileName>']` | filePattern <br> partitionFileNames <br> rowUrlColumn <br> partitionFileNames |

### Sink example

The below image is an example of a parquet sink configuration in mapping data flows.

:::image type="content" source="media/data-flow/parquet-sink.png" alt-text="Parquet sink":::

The associated data flow script is:

```
ParquetSource sink(
    format: 'parquet',
    filePattern:'output[n].parquet',
    truncate: true,
    allowSchemaDrift: true,
    validateSchema: false,
    skipDuplicateMapInputs: true,
    skipDuplicateMapOutputs: true) ~> ParquetSink
```

## Data type support

Parquet complex data types (e.g. MAP, LIST, STRUCT) are currently supported only in Data Flows, not in Copy Activity. To use complex types in data flows, do not import the file schema in the dataset, leaving schema blank in the dataset. Then, in the Source transformation, import the projection.

## Next steps

- [Copy activity overview](copy-activity-overview.md)
- [Mapping data flow](concepts-data-flow-overview.md)
- [Lookup activity](control-flow-lookup-activity.md)
- [GetMetadata activity](control-flow-get-metadata-activity.md)
