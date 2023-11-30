---
title: Copy data from Amazon Simple Storage Service (S3) Compatible Storage
description: Learn about how to copy data from Amazon S3 Compatible Storage to supported sink data stores using an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 10/20/2023
---

# Copy data from Amazon S3 Compatible Storage by using Azure Data Factory or Synapse Analytics


[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to copy data from Amazon Simple Storage Service (Amazon S3) Compatible Storage. To learn more, read the introductory articles for [Azure Data Factory](introduction.md) and [Synapse Analytics](../synapse-analytics/overview-what-is.md).

## Supported capabilities

This Amazon S3 Compatible Storage connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|
|[GetMetadata activity](control-flow-get-metadata-activity.md)|&#9312; &#9313;|
|[Delete activity](delete-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

Specifically, this Amazon S3 Compatible Storage connector supports copying files as is or parsing files with the [supported file formats and compression codecs](supported-file-formats-and-compression-codecs.md). The connector uses [AWS Signature Version 4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) to authenticate requests to S3. You can use this Amazon S3 Compatible Storage connector to copy data from any S3-compatible storage provider. Specify the corresponding service URL in the linked service configuration.

## Required permissions

To copy data from Amazon S3 Compatible Storage, make sure you've been granted the following permissions for Amazon S3 object operations: `s3:GetObject` and `s3:GetObjectVersion`.

If you use UI to author, additional `s3:ListAllMyBuckets` and `s3:ListBucket`/`s3:GetBucketLocation` permissions are required for operations like testing connection to linked service and browsing from root. If you don't want to grant these permissions, you can choose "Test connection to file path" or "Browse from specified path" options from the UI.

For the full list of Amazon S3 permissions, see [Specifying Permissions in a Policy](https://docs.aws.amazon.com/AmazonS3/latest/dev/using-with-s3-actions.html) on the AWS site.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Amazon S3 Compatible Storage using UI

Use the following steps to create a linked service to Amazon S3 Compatible Storage in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Create a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Create a new linked service with Azure Synapse UI.":::

2. Search for Amazon and select the Amazon S3 Compatible Storage connector.

   :::image type="content" source="media/connector-amazon-s3-compatible-storage/amazon-s3-compatible-storage-connector.png" alt-text="Select the Amazon S3 Compatible Storage connector.":::    


1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-amazon-s3-compatible-storage/configure-amazon-s3-compatible-storage-linked-service.png" alt-text="Configure a linked service to Amazon S3 Compatible Storage.":::

## Connector configuration details 

The following sections provide details about properties that are used to define entities specific to Amazon S3 Compatible Storage.

## Linked service properties

The following properties are supported for an Amazon S3 Compatible linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property must be set to **AmazonS3Compatible**. | Yes |
| accessKeyId | ID of the secret access key. |Yes |
| secretAccessKey | The secret access key itself. Mark this field as a **SecureString** to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |Yes |
| serviceUrl | Specify the custom S3 endpoint `https://<service url>`. | No |
| forcePathStyle | Indicates whether to use S3 [path-style access](https://docs.aws.amazon.com/AmazonS3/latest/dev/VirtualHosting.html#path-style-access) instead of virtual hosted-style access. Allowed values are: **false** (default), **true**.<br> Check each data store’s documentation on if path-style access is needed or not. |No |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use the Azure integration runtime or the self-hosted integration runtime (if your data store is in a private network). If this property isn't specified, the service uses the default Azure integration runtime. |No |



**Example:**

```json
{
    "name": "AmazonS3CompatibleLinkedService",
    "properties": {
        "type": "AmazonS3Compatible",
        "typeProperties": {
            "accessKeyId": "<access key id>",
            "secretAccessKey": {
                "type": "SecureString",
                "value": "<secret access key>"
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

[!INCLUDE [data-factory-v2-file-formats](includes/data-factory-v2-file-formats.md)] 

The following properties are supported for Amazon S3 Compatible under `location` settings in a format-based dataset:

| Property   | Description                                                  | Required |
| ---------- | ------------------------------------------------------------ | -------- |
| type       | The **type** property under `location` in a dataset must be set to **AmazonS3CompatibleLocation**. | Yes      |
| bucketName | The S3 Compatible Storage bucket name.                                          | Yes      |
| folderPath | The path to the folder under the given bucket. If you want to use a wildcard to filter the folder, skip this setting and specify that in the activity source settings. | No       |
| fileName   | The file name under the given bucket and folder path. If you want to use a wildcard to filter files, skip this setting and specify that in the activity source settings. | No       |
| version | The version of the S3 Compatible Storage object, if S3 Compatible Storage versioning is enabled. If it's not specified, the latest version will be fetched. |No |

**Example:**

```json
{
    "name": "DelimitedTextDataset",
    "properties": {
        "type": "DelimitedText",
        "linkedServiceName": {
            "referenceName": "<Amazon S3 Compatible Storage linked service name>",
            "type": "LinkedServiceReference"
        },
        "schema": [ < physical schema, optional, auto retrieved during authoring > ],
        "typeProperties": {
            "location": {
                "type": "AmazonS3CompatibleLocation",
                "bucketName": "bucketname",
                "folderPath": "folder/subfolder"
            },
            "columnDelimiter": ",",
            "quoteChar": "\"",
            "firstRowAsHeader": true,
            "compressionCodec": "gzip"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties that the Amazon S3 Compatible Storage source supports.

### Amazon S3 Compatible Storage as a source type

[!INCLUDE [data-factory-v2-file-formats](includes/data-factory-v2-file-formats.md)] 

The following properties are supported for Amazon S3 Compatible Storage under `storeSettings` settings in a format-based copy source:

| Property                 | Description                                                  | Required                                                    |
| ------------------------ | ------------------------------------------------------------ | ----------------------------------------------------------- |
| type                     | The **type** property under `storeSettings` must be set to **AmazonS3CompatibleReadSettings**. | Yes                                                         |
| ***Locate the files to copy:*** |  |  |
| OPTION 1: static path<br> | Copy from the given bucket or folder/file path specified in the dataset. If you want to copy all files from a bucket or folder, additionally specify `wildcardFileName` as `*`. |  |
| OPTION 2: S3 Compatible Storage prefix<br>- prefix | Prefix for the S3 Compatible Storage key name under the given bucket configured in a dataset to filter source S3 Compatible Storage files. S3 Compatible Storage keys whose names start with `bucket_in_dataset/this_prefix` are selected. It utilizes S3 Compatible Storage's service-side filter, which provides better performance than a wildcard filter.<br/><br/>When you use prefix and choose to copy to file-based sink with preserving hierarchy, note the sub-path after the last "/" in prefix will be preserved. For example, you have source  `bucket/folder/subfolder/file.txt`, and configure prefix as `folder/sub`, then the preserved file path is `subfolder/file.txt`. | No |
| OPTION 3: wildcard<br>- wildcardFolderPath | The folder path with wildcard characters under the given bucket configured in a dataset to filter source folders. <br>Allowed wildcards are: `*` (matches zero or more characters) and `?` (matches zero or single character). Use `^` to escape if your folder name has a wildcard or this escape character inside. <br>See more examples in [Folder and file filter examples](#folder-and-file-filter-examples). | No                                            |
| OPTION 3: wildcard<br>- wildcardFileName | The file name with wildcard characters under the given bucket and folder path (or wildcard folder path) to filter source files. <br>Allowed wildcards are: `*` (matches zero or more characters) and `?` (matches zero or single character). Use `^` to escape if your file name has a wildcard or this escape character inside.  See more examples in [Folder and file filter examples](#folder-and-file-filter-examples). | Yes |
| OPTION 4: a list of files<br>- fileListPath | Indicates to copy a given file set. Point to a text file that includes a list of files you want to copy, one file per line, which is the relative path to the path configured in the dataset.<br/>When you're using this option, do not specify a file name in the dataset. See more examples in [File list examples](#file-list-examples). |No |
| ***Additional settings:*** |  | |
| recursive | Indicates whether the data is read recursively from the subfolders or only from the specified folder. Note that when **recursive** is set to **true** and the sink is a file-based store, an empty folder or subfolder isn't copied or created at the sink. <br>Allowed values are **true** (default) and **false**.<br>This property doesn't apply when you configure `fileListPath`. |No |
| deleteFilesAfterCompletion | Indicates whether the binary files will be deleted from source store after successfully moving to the destination store. The file deletion is per file, so when copy activity fails, you will see some files have already been copied to the destination and deleted from source, while others are still remaining on source store. <br/>This property is only valid in binary files copy scenario. The default value: false. |No |
| modifiedDatetimeStart    | Files are filtered based on the attribute: last modified. <br>The files will be selected if their last modified time is greater than or equal to `modifiedDatetimeStart` and less than `modifiedDatetimeEnd`. The time is applied to a UTC time zone in the format of "2018-12-01T05:00:00Z". <br> The properties can be **NULL**, which means no file attribute filter will be applied to the dataset.  When `modifiedDatetimeStart` has a datetime value but `modifiedDatetimeEnd` is **NULL**, the files whose last modified attribute is greater than or equal to the datetime value will be selected.  When `modifiedDatetimeEnd` has a datetime value but `modifiedDatetimeStart` is **NULL**, the files whose last modified attribute is less than the datetime value will be selected.<br/>This property doesn't apply when you configure `fileListPath`. | No                                            |
| modifiedDatetimeEnd      | Same as above.                                               | No                                                          |
| enablePartitionDiscovery | For files that are partitioned, specify whether to parse the partitions from the file path and add them as additional source columns.<br/>Allowed values are **false** (default) and **true**. | No                                            |
| partitionRootPath | When partition discovery is enabled, specify the absolute root path in order to read partitioned folders as data columns.<br/><br/>If it is not specified, by default,<br/>- When you use file path in dataset or list of files on source, partition root path is the path configured in dataset.<br/>- When you use wildcard folder filter, partition root path is the sub-path before the first wildcard.<br/>- When you use prefix, partition root path is sub-path before the last "/". <br/><br/>For example, assuming you configure the path in dataset as "root/folder/year=2020/month=08/day=27":<br/>- If you specify partition root path as "root/folder/year=2020", copy activity will generate two more columns `month` and `day` with value "08" and "27" respectively, in addition to the columns inside the files.<br/>- If partition root path is not specified, no extra column will be generated. | No                                            |
| maxConcurrentConnections |The upper limit of concurrent connections established to the data store during the activity run. Specify a value only when you want to limit concurrent connections.| No                                                          |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromAmazonS3CompatibleStorage",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Delimited text input dataset name>",
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
                "type": "DelimitedTextSource",
                "formatSettings":{
                    "type": "DelimitedTextReadSettings",
                    "skipLineCount": 10
                },
                "storeSettings":{
                    "type": "AmazonS3CompatibleReadSettings",
                    "recursive": true,
                    "wildcardFolderPath": "myfolder*A",
                    "wildcardFileName": "*.csv"
                }
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

### Folder and file filter examples

This section describes the resulting behavior of the folder path and file name with wildcard filters.

| bucket | key | recursive | Source folder structure and filter result (files in bold are retrieved)|
|:--- |:--- |:--- |:--- |
| bucket | `Folder*/*` | false | bucket<br/>&nbsp;&nbsp;&nbsp;&nbsp;FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File2.json**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3.csv<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5.csv<br/>&nbsp;&nbsp;&nbsp;&nbsp;AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |
| bucket | `Folder*/*` | true | bucket<br/>&nbsp;&nbsp;&nbsp;&nbsp;FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File2.json**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File3.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File4.json**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File5.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |
| bucket | `Folder*/*.csv` | false | bucket<br/>&nbsp;&nbsp;&nbsp;&nbsp;FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File2.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3.csv<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5.csv<br/>&nbsp;&nbsp;&nbsp;&nbsp;AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |
| bucket | `Folder*/*.csv` | true | bucket<br/>&nbsp;&nbsp;&nbsp;&nbsp;FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File2.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File3.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File5.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |

### File list examples

This section describes the resulting behavior of using a file list path in a Copy activity source.

Assume that you have the following source folder structure and want to copy the files in bold:

| Sample source structure                                      | Content in FileListToCopy.txt                             | Configuration |
| ------------------------------------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------ |
| bucket<br/>&nbsp;&nbsp;&nbsp;&nbsp;FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File2.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File3.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File5.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;Metadata<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FileListToCopy.txt | File1.csv<br>Subfolder1/File3.csv<br>Subfolder1/File5.csv | **In dataset:**<br>- Bucket: `bucket`<br>- Folder path: `FolderA`<br><br>**In Copy activity source:**<br>- File list path: `bucket/Metadata/FileListToCopy.txt` <br><br>The file list path points to a text file in the same data store that includes a list of files you want to copy, one file per line, with the relative path to the path configured in the dataset. |


## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## GetMetadata activity properties

To learn details about the properties, check [GetMetadata activity](control-flow-get-metadata-activity.md). 

## Delete activity properties

To learn details about the properties, check [Delete activity](delete-activity.md).


## Next steps
For a list of data stores that the Copy activity supports as sources and sinks, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
