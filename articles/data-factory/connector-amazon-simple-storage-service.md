---
title: Copy data from Amazon Simple Storage Service using Azure Data Factory | Microsoft Docs
description: Learn about how to copy data from Amazon Simple Storage Service (S3) to supported sink data stores by using Azure Data Factory.
services: data-factory
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.topic: article
ms.date: 08/30/2017
ms.author: jingwang

---
# Copy data from Amazon Simple Storage Service using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1 - GA](v1/data-factory-amazon-simple-storage-service-connector.md)
> * [Version 2 - Preview](connector-amazon-simple-storage-service.md)

This article outlines how to use the Copy Activity in Azure Data Factory to copy data to and from Azure Blob Storage. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [Amazon S3 connnector in V1](v1/data-factory-amazon-simple-storage-service-connector.md).

## Supported scenarios

You can copy data from any supported source data store to Azure Data Lake Store, or copy data from Azure Data Lake Store to any supported sink data store. For a list of data stores that are supported as sources or sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this Amazon S3 connector supports copying files as-is or parsing files with the [supported file formats and compression codecs](supported-file-formats-and-compression-codecs.md).

## Required permissions

To copy data from Amazon S3, make sure you have been granted the following permissions:

- `s3:GetObject` and `s3:GetObjectVersion` for Amazon S3 Object Operations.
- `s3:ListBucket` for Amazon S3 Bucket Operations. If you are using the Data Factory Copy Wizard, `s3:ListAllMyBuckets` is also required.

For details about the full list of Amazon S3 permissions, see [Specifying Permissions in a Policy](http://docs.aws.amazon.com/amazons3/latest/dev/using-with-s3-actions.html).

## Getting started
You can create a pipeline with copy activity using .NET SDK, Python SDK, Azure PowerShell, REST API, or Azure Resource Manager template. See [Copy activity tutorial](quickstart-create-data-factory-dot-net.md) for step-by-step instructions to create a pipeline with a copy activity. 

The following sections provide details about properties that are used to define Data Factory entities specific to Amazon S3.

## Linked service properties

The following properties are supported for Amazon S3 linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **AmazonS3**. | Yes |
| accessKeyID | ID of the secret access key. |Yes |
| secretAccessKey | The secret access key itself. |Yes |

Here is an example:

```json
{
    "name": "AmazonS3LinkedService",
    "properties": {
        "type": "AmazonS3",
        "typeProperties": {
            "accessKeyId": "<access key id>",
            "secretAccessKey": {
                    "type": "SecureString",
                    "value": "<secret access key>"
            }
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Amazon S3 dataset.

To copy data from Amazon S3, set the type property of the dataset to **AmazonS3Object**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **AmazonS3Object** |Yes |
| bucketName | The S3 bucket name. |Yes |
| key | The S3 object key. Applies only when prefix is not specified. |No |
| prefix | Prefix for the S3 object key. Objects whose keys start with this prefix are selected. Applies only when key is not specified. |No |
| version | The version of the S3 object, if S3 versioning is enabled. |No |
| format | If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions.<br/><br/>If you want to parse or generate files with a specific format, the following file format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](supported-file-formats-and-compression-codecs.md#text-format), [Json Format](supported-file-formats-and-compression-codecs.md#json-format), [Avro Format](supported-file-formats-and-compression-codecs.md#avro-format), [Orc Format](supported-file-formats-and-compression-codecs.md#orc-format), and [Parquet Format](supported-file-formats-and-compression-codecs.md#parquet-format) sections. |No (only for binary copy scenario) |
| compression | Specify the type and level of compression for the data. For more information, see [Supported file formats and compression codecs](supported-file-formats-and-compression-codecs.md#compression-support).<br/>Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**.<br/>Supported levels are: **Optimal** and **Fastest**. |No |

> [!NOTE]
> **bucketName + key** specifies the location of the S3 object, where bucket is the root container for S3 objects, and key is the full path to the S3 object.

**Example: using prefix**

```json
{
    "name": "AmazonS3Dataset",
    "properties": {
        "type": "AmazonS3Object",
        "linkedServiceName": {
            "referenceName": "<Amazon S3 linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "bucketName": "testbucket",
            "prefix": "testFolder/test",
            "format": {
                "type": "TextFormat",
                "columnDelimiter": ",",
                "rowDelimiter": "\n"
            },
            "compression": {
                "type": "GZip",
                "level": "Optimal"
            }
        }
    }
}
```

**Example: using key and version (optional)**

```json
{
    "name": "AmazonS3Dataset",
    "properties": {
        "type": "AmazonS3",
        "linkedServiceName": {
            "referenceName": "<Amazon S3 linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "bucketName": "testbucket",
            "key": "testFolder/testfile.csv.gz",
            "version": "XXXXXXXXXczm0CJajYkHf0_k6LhBmkcL",
            "format": {
                "type": "TextFormat",
                "columnDelimiter": ",",
                "rowDelimiter": "\n"
            },
            "compression": {
                "type": "GZip",
                "level": "Optimal"
            }
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Azure Data Lake source and sink.

### Amazon S3 as source

To copy data from Amazon S3, set the source type in the copy activity to **FileSystemSource** (which includes Amazon S3). The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **FileSystemSource** |Yes |
| recursive | Indicates whether the data is read recursively from the sub folders or only from the specified folder.<br/>Allowed values are: **true** (default), **false** | No |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromAmazonS3",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Amazon S3 input dataset name>",
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
                "type": "FileSystemSource",
                "recursive": true
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```
## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md##supported-data-stores-and-formats).