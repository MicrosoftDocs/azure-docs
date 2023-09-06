---
title: Binary format
titleSuffix: Azure Data Factory & Azure Synapse
description: This topic describes how to deal with Binary format in Azure Data Factory and Synapse Analytics.
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 07/17/2023
ms.author: jianleishen
---

# Binary format in Azure Data Factory and Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Binary format is supported for the following connectors: [Amazon S3](connector-amazon-simple-storage-service.md), [Amazon S3 Compatible Storage](connector-amazon-s3-compatible-storage.md), [Azure Blob](connector-azure-blob-storage.md), [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md), [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md), [Azure Files](connector-azure-file-storage.md), [File System](connector-file-system.md), [FTP](connector-ftp.md), [Google Cloud Storage](connector-google-cloud-storage.md), [HDFS](connector-hdfs.md), [HTTP](connector-http.md), [Oracle Cloud Storage](connector-oracle-cloud-storage.md) and [SFTP](connector-sftp.md).

You can use Binary dataset in [Copy activity](copy-activity-overview.md), [GetMetadata activity](control-flow-get-metadata-activity.md), or [Delete activity](delete-activity.md). When using Binary dataset, the service does not parse file content but treat it as-is. 

>[!NOTE]
>When using Binary dataset in copy activity, you can only copy from Binary dataset to Binary dataset.

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by the Binary dataset.

| Property         | Description                                                  | Required |
| ---------------- | ------------------------------------------------------------ | -------- |
| type             | The type property of the dataset must be set to **Binary**. | Yes      |
| location         | Location settings of the file(s). Each file-based connector has its own location type and supported properties under `location`. **See details in connector article -> Dataset properties section**. | Yes      |
| compression | Group of properties to configure file compression. Configure this section when you want to do compression/decompression during activity execution. | No |
| type | The compression codec used to read/write binary files. <br>Allowed values are **bzip2**, **gzip**, **deflate**, **ZipDeflate**, **Tar**, or **TarGzip**. <br>**Note** when using copy activity to decompress **ZipDeflate**/**TarGzip**/**Tar** file(s) and write to file-based sink data store, by default files are extracted to the folder:`<path specified in dataset>/<folder named as source compressed file>/`, use `preserveZipFileNameAsFolder`/`preserveCompressionFileNameAsFolder` on [copy activity source](#binary-as-source) to control whether to preserve the name of the compressed file(s) as folder structure.| No       |
| level | The compression ratio. Apply when dataset is used in Copy activity sink.<br>Allowed values are **Optimal** or **Fastest**.<br>- **Fastest:** The compression operation should complete as quickly as possible, even if the resulting file is not optimally compressed.<br>- **Optimal**: The compression operation should be optimally compressed, even if the operation takes a longer time to complete. For more information, see [Compression Level](/dotnet/api/system.io.compression.compressionlevel) topic. | No       |

Below is an example of Binary dataset on Azure Blob Storage:

```json
{
    "name": "BinaryDataset",
    "properties": {
        "type": "Binary",
        "linkedServiceName": {
            "referenceName": "<Azure Blob Storage linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "location": {
                "type": "AzureBlobStorageLocation",
                "container": "containername",
                "folderPath": "folder/subfolder",
            },
            "compression": {
                "type": "ZipDeflate"
            }
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by the Binary source and sink.

>[!NOTE]
>When using Binary dataset in copy activity, you can only copy from Binary dataset to Binary dataset.

### Binary as source

The following properties are supported in the copy activity ***\*source\**** section.

| Property      | Description                                                  | Required |
| ------------- | ------------------------------------------------------------ | -------- |
| type          | The type property of the copy activity source must be set to **BinarySource**. | Yes      |
| formatSettings | A group of properties. Refer to **Binary read settings** table below. | No       |
| storeSettings | A group of properties on how to read data from a data store. Each file-based connector has its own supported read settings under `storeSettings`. **See details in connector article -> Copy activity properties section**. | No       |

Supported **binary read settings** under `formatSettings`:

| Property      | Description                                                  | Required |
| ------------- | ------------------------------------------------------------ | -------- |
| type          | The type of formatSettings must be set to **BinaryReadSettings**. | Yes      |
| compressionProperties | A group of properties on how to decompress data for a given compression codec. | No       |
| preserveZipFileNameAsFolder<br>(*under `compressionProperties`->`type` as `ZipDeflateReadSettings`*) | Applies when input dataset is configured with **ZipDeflate** compression. Indicates whether to preserve the source zip file name as folder structure during copy.<br>- When set to **true (default)**, The service writes unzipped files to `<path specified in dataset>/<folder named as source zip file>/`.<br>- When set to **false**, the service writes unzipped files directly to `<path specified in dataset>`. Make sure you don't have duplicated file names in different source zip files to avoid racing or unexpected behavior.  | No |
| preserveCompressionFileNameAsFolder<br>(*under `compressionProperties`->`type` as `TarGZipReadSettings` or `TarReadSettings`*) | Applies when input dataset is configured with **TarGzip**/**Tar** compression. Indicates whether to preserve the source compressed file name as folder structure during copy.<br>- When set to **true (default)**, the service writes decompressed files to `<path specified in dataset>/<folder named as source compressed file>/`. <br>- When set to **false**, the service writes decompressed files directly to `<path specified in dataset>`. Make sure you don't have duplicated file names in different source files to avoid racing or unexpected behavior. | No |

```json
"activities": [
    {
        "name": "CopyFromBinary",
        "type": "Copy",
        "typeProperties": {
            "source": {
                "type": "BinarySource",
                "storeSettings": {
                    "type": "AzureBlobStorageReadSettings",
                    "recursive": true,
                    "deleteFilesAfterCompletion": true
                },
                "formatSettings": {
                    "type": "BinaryReadSettings",
                    "compressionProperties": {
                        "type": "ZipDeflateReadSettings",
                        "preserveZipFileNameAsFolder": false
                    }
                }
            },
            ...
        }
        ...
    }
]
```

### Binary as sink

The following properties are supported in the copy activity ***\*sink\**** section.

| Property      | Description                                                  | Required |
| ------------- | ------------------------------------------------------------ | -------- |
| type          | The type property of the copy activity source must be set to **BinarySink**. | Yes      |
| storeSettings | A group of properties on how to write data to a data store. Each file-based connector has its own supported write settings under `storeSettings`. **See details in connector article -> Copy activity properties section**. | No       |

## Next steps

- [Copy activity overview](copy-activity-overview.md)
- [GetMetadata activity](control-flow-get-metadata-activity.md)
- [Delete activity](delete-activity.md)