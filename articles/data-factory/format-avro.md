---
title: Avro format
titleSuffix: Azure Data Factory & Azure Synapse
description: This topic describes how to deal with Avro format in Azure Data Factory and Synapse Analytics.
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 07/17/2023
ms.author: jianleishen
---

# Avro format in Azure Data Factory and Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Follow this article when you want to **parse Avro files or write the data into Avro format**. 

Avro format is supported for the following connectors: [Amazon S3](connector-amazon-simple-storage-service.md), [Amazon S3 Compatible Storage](connector-amazon-s3-compatible-storage.md), [Azure Blob](connector-azure-blob-storage.md), [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md), [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md), [Azure Files](connector-azure-file-storage.md), [File System](connector-file-system.md), [FTP](connector-ftp.md), [Google Cloud Storage](connector-google-cloud-storage.md), [HDFS](connector-hdfs.md), [HTTP](connector-http.md), [Oracle Cloud Storage](connector-oracle-cloud-storage.md) and [SFTP](connector-sftp.md).

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by the Avro dataset.

| Property         | Description                                                  | Required |
| ---------------- | ------------------------------------------------------------ | -------- |
| type             | The type property of the dataset must be set to **Avro**. | Yes      |
| location         | Location settings of the file(s). Each file-based connector has its own location type and supported properties under `location`. **See details in connector article -> Dataset properties section**. | Yes      |
| avroCompressionCodec | The compression codec to use when writing to Avro files. When reading from Avro files, the service automatically determines the compression codec based on the file metadata.<br>Supported types are "**none**" (default), "**deflate**", "**snappy**". Note currently Copy activity doesn't support Snappy when read/write Avro files. | No       |

> [!NOTE]
> White space in column name is not supported for Avro files.

Below is an example of Avro dataset on Azure Blob Storage:

```json
{
    "name": "AvroDataset",
    "properties": {
        "type": "Avro",
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
            "avroCompressionCodec": "snappy"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by the Avro source and sink.

### Avro as source

The following properties are supported in the copy activity ***\*source\**** section.

| Property      | Description                                                  | Required |
| ------------- | ------------------------------------------------------------ | -------- |
| type          | The type property of the copy activity source must be set to **AvroSource**. | Yes      |
| storeSettings | A group of properties on how to read data from a data store. Each file-based connector has its own supported read settings under `storeSettings`. **See details in connector article -> Copy activity properties section**. | No       |

### Avro as sink

The following properties are supported in the copy activity ***\*sink\**** section.

| Property      | Description                                                  | Required |
| ------------- | ------------------------------------------------------------ | -------- |
| type          | The type property of the copy activity source must be set to **AvroSink**. | Yes      |
| formatSettings          | A group of properties. Refer to **Avro write settings** table below.| No      |
| storeSettings | A group of properties on how to write data to a data store. Each file-based connector has its own supported write settings under `storeSettings`. **See details in connector article -> Copy activity properties section**. | No       |

Supported **Avro write settings** under `formatSettings`:

| Property      | Description                                                  | Required                                              |
| ------------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| type          | The type of formatSettings must be set to **AvroWriteSettings**. | Yes                                                   |
| maxRowsPerFile | When writing data into a folder, you can choose to write to multiple files and specify the max rows per file.  | No |
| fileNamePrefix | Applicable when `maxRowsPerFile` is configured.<br> Specify the file name prefix when writing data to multiple files, resulted in this pattern: `<fileNamePrefix>_00000.<fileExtension>`. If not specified, file name prefix will be auto generated. This property does not apply when source is file-based store or [partition-option-enabled data store](copy-activity-performance-features.md).  | No |

## Mapping data flow properties

In mapping data flows, you can read and write to avro format in the following data stores: [Azure Blob Storage](connector-azure-blob-storage.md#mapping-data-flow-properties), [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md#mapping-data-flow-properties), [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md#mapping-data-flow-properties) and [SFTP](connector-sftp.md#mapping-data-flow-properties), and you can read avro format in [Amazon S3](connector-amazon-simple-storage-service.md#mapping-data-flow-properties).

### Source properties

The below table lists the properties supported by an avro source. You can edit these properties in the **Source options** tab.

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Wild card paths | All files matching the wildcard path will be processed. Overrides the folder and file path set in the dataset. | no | String[] | wildcardPaths |
| Partition root path | For file data that is partitioned, you can enter a partition root path in order to read partitioned folders as columns | no | String | partitionRootPath |
| List of files | Whether your source is pointing to a text file that lists files to process | no | `true` or `false` | fileList |
| Column to store file name | Create a new column with the source file name and path | no | String | rowUrlColumn |
| After completion | Delete or move the files after processing. File path starts from the container root | no | Delete: `true` or `false` <br> Move: `['<from>', '<to>']` | purgeFiles <br> moveFiles |
| Filter by last modified | Choose to filter files based upon when they were last altered | no | Timestamp | modifiedAfter <br> modifiedBefore |
| Allow no files found | If true, an error is not thrown if no files are found | no | `true` or `false` | ignoreNoFilesFound |

### Sink properties

The below table lists the properties supported by an avro sink. You can edit these properties in the **Settings** tab.

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Clear the folder | If the destination folder is cleared prior to write | no | `true` or `false` | truncate |
| File name option | The naming format of the data written. By default, one file per partition in format `part-#####-tid-<guid>` | no | Pattern: String <br> Per partition: String[] <br> As data in column: String <br> Output to single file: `['<fileName>']`  | filePattern <br> partitionFileNames <br> rowUrlColumn <br> partitionFileNames |
| Quote all | Enclose all values in quotes | no | `true` or `false` | quoteAll |

## Data type support

### Copy activity
Avro [complex data types](https://avro.apache.org/docs/current/spec.html#schema_complex) are not supported (records, enums, arrays, maps, unions, and fixed) in Copy Activity.

### Data flows
When working with Avro files in data flows, you can read and write complex data types, but be sure to clear the physical schema from the dataset first. In data flows, you can set your logical projection and derive columns that are complex structures, then auto-map those fields to an Avro file.

## Next steps

- [Copy activity overview](copy-activity-overview.md)
- [Lookup activity](control-flow-lookup-activity.md)
- [GetMetadata activity](control-flow-get-metadata-activity.md)
