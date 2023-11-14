---
title: Copy and transform data in Amazon Simple Storage Service (S3)
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy data from Amazon Simple Storage Service (S3), and transform data in Amazon Simple Storage Service (S3) using Azure Data Factory or Azure Synapse Analytics pipelines.
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 06/05/2023
---

# Copy and transform data in Amazon Simple Storage Service using Azure Data Factory or Azure Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Copy Activity to copy data from Amazon Simple Storage Service (Amazon S3), and use Data Flow to transform data in Amazon S3. To learn more, read the introductory articles for [Azure Data Factory](introduction.md) and [Synapse Analytics](../synapse-analytics/overview-what-is.md).

>[!TIP]
>To learn more about the data migration scenario from Amazon S3 to Azure Storage, see [Migrate data from Amazon S3 to Azure Storage](data-migration-guidance-s3-azure-storage.md).

## Supported capabilities

This Amazon S3 connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Mapping data flow](concepts-data-flow-overview.md) (source/sink)|&#9312; |
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|
|[GetMetadata activity](control-flow-get-metadata-activity.md)|&#9312; &#9313;|
|[Delete activity](delete-activity.md)|&#9312; &#9313;|

<small>*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*</small>

Specifically, this Amazon S3 connector supports copying files as is or parsing files with the [supported file formats and compression codecs](supported-file-formats-and-compression-codecs.md). You can also choose to [preserve file metadata during copy](#preserve-metadata-during-copy). The connector uses [AWS Signature Version 4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) to authenticate requests to S3.

>[!TIP]
>If you want to copy data from *any S3-compatible storage provider*, see [Amazon S3 Compatible Storage](connector-amazon-s3-compatible-storage.md).

## Required permissions

To copy data from Amazon S3, make sure you've been granted the following permissions for Amazon S3 object operations: `s3:GetObject` and `s3:GetObjectVersion`.

If you use Data Factory UI to author, additional `s3:ListAllMyBuckets` and `s3:ListBucket`/`s3:GetBucketLocation` permissions are required for operations like testing connection to linked service and browsing from root. If you don't want to grant these permissions, you can choose "Test connection to file path" or "Browse from specified path" options from the UI.

For the full list of Amazon S3 permissions, see [Specifying Permissions in a Policy](https://docs.aws.amazon.com/AmazonS3/latest/dev/using-with-s3-actions.html) on the AWS site.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)] 

## Create an Amazon Simple Storage Service (S3) linked service using UI

Use the following steps to create an Amazon S3 linked service in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Amazon and select the Amazon S3 connector.

    :::image type="content" source="media/connector-amazon-simple-storage-service/amazon-simple-storage-service-connector.png" alt-text="Screenshot of the Amazon S3 connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-amazon-simple-storage-service/configure-amazon-simple-storage-service-linked-service.png" alt-text="Screenshot of configuration for an Amazon S3 linked service.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to Amazon S3.

## Linked service properties

The following properties are supported for an Amazon S3 linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property must be set to **AmazonS3**. | Yes |
| authenticationType | Specify the authentication type used to connect to Amazon S3. You can choose to use access keys for an AWS Identity and Access Management (IAM) account, or [temporary security credentials](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html).<br>Allowed values are: `AccessKey` (default) and `TemporarySecurityCredentials`. |No |
| accessKeyId | ID of the secret access key. |Yes |
| secretAccessKey | The secret access key itself. Mark this field as a **SecureString** to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |Yes |
| sessionToken | Applicable when using [temporary security credentials](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html) authentication. Learn how to [request temporary security credentials](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_request.html#api_getsessiontoken) from AWS.<br>Note AWS temporary credential expires between 15 minutes to 36 hours based on settings. Make sure your credential is valid when activity executes， especially for operationalized workload - for example, you can refresh it periodically and store it in Azure Key Vault.<br>Mark this field as a **SecureString** to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |No |
| serviceUrl | Specify the custom S3 endpoint `https://<service url>`.<br>Change it only if you want to try a different service endpoint or want to switch between https and http.| No |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use the Azure integration runtime or the self-hosted integration runtime (if your data store is in a private network). If this property isn't specified, the service uses the default Azure integration runtime. |No |


**Example: using access key authentication**

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
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

**Example: using temporary security credential authentication**

```json
{
    "name": "AmazonS3LinkedService",
    "properties": {
        "type": "AmazonS3",
        "typeProperties": {
            "authenticationType": "TemporarySecurityCredentials",
            "accessKeyId": "<access key id>",
            "secretAccessKey": {
                "type": "SecureString",
                "value": "<secret access key>"
            },
            "sessionToken": {
                "type": "SecureString",
                "value": "<session token>"
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

The following properties are supported for Amazon S3 under `location` settings in a format-based dataset:

| Property   | Description                                                  | Required |
| ---------- | ------------------------------------------------------------ | -------- |
| type       | The **type** property under `location` in a dataset must be set to **AmazonS3Location**. | Yes      |
| bucketName | The S3 bucket name.                                          | Yes      |
| folderPath | The path to the folder under the given bucket. If you want to use a wildcard to filter the folder, skip this setting and specify that in the activity source settings. | No       |
| fileName   | The file name under the given bucket and folder path. If you want to use a wildcard to filter files, skip this setting and specify that in the activity source settings. | No       |
| version | The version of the S3 object, if S3 versioning is enabled. If it's not specified, the latest version will be fetched. |No |

**Example:**

```json
{
    "name": "DelimitedTextDataset",
    "properties": {
        "type": "DelimitedText",
        "linkedServiceName": {
            "referenceName": "<Amazon S3 linked service name>",
            "type": "LinkedServiceReference"
        },
        "schema": [ < physical schema, optional, auto retrieved during authoring > ],
        "typeProperties": {
            "location": {
                "type": "AmazonS3Location",
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

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties that the Amazon S3 source supports.

### Amazon S3 as a source type

[!INCLUDE [data-factory-v2-file-formats](includes/data-factory-v2-file-formats.md)] 

The following properties are supported for Amazon S3 under `storeSettings` settings in a format-based copy source:

| Property                 | Description                                                  | Required                                                    |
| ------------------------ | ------------------------------------------------------------ | ----------------------------------------------------------- |
| type                     | The **type** property under `storeSettings` must be set to **AmazonS3ReadSettings**. | Yes                                                         |
| ***Locate the files to copy:*** |  |  |
| OPTION 1: static path<br> | Copy from the given bucket or folder/file path specified in the dataset. If you want to copy all files from a bucket or folder, additionally specify `wildcardFileName` as `*`. |  |
| OPTION 2: S3 prefix<br>- prefix | Prefix for the S3 key name under the given bucket configured in a dataset to filter source S3 files. S3 keys whose names start with `bucket_in_dataset/this_prefix` are selected. It utilizes S3's service-side filter, which provides better performance than a wildcard filter.<br/><br/>When you use prefix and choose to copy to file-based sink with preserving hierarchy, note the sub-path after the last "/" in prefix will be preserved. For example, you have source  `bucket/folder/subfolder/file.txt`, and configure prefix as `folder/sub`, then the preserved file path is `subfolder/file.txt`. | No |
| OPTION 3: wildcard<br>- wildcardFolderPath | The folder path with wildcard characters under the given bucket configured in a dataset to filter source folders. <br>Allowed wildcards are: `*` (matches zero or more characters) and `?` (matches zero or single character). Use `^` to escape if your folder name has a wildcard or this escape character inside. <br>See more examples in [Folder and file filter examples](#folder-and-file-filter-examples). | No                                            |
| OPTION 3: wildcard<br>- wildcardFileName | The file name with wildcard characters under the given bucket and folder path (or wildcard folder path) to filter source files. <br>Allowed wildcards are: `*` (matches zero or more characters) and `?` (matches zero or single character). Use `^` to escape if your file name has a wildcard or this escape character inside.  See more examples in [Folder and file filter examples](#folder-and-file-filter-examples). | Yes |
| OPTION 4: a list of files<br>- fileListPath | Indicates to copy a given file set. Point to a text file that includes a list of files you want to copy, one file per line, which is the relative path to the path configured in the dataset.<br/>When you're using this option, do not specify a file name in the dataset. See more examples in [File list examples](#file-list-examples). |No |
| ***Additional settings:*** |  | |
| recursive | Indicates whether the data is read recursively from the subfolders or only from the specified folder. Note that when **recursive** is set to **true** and the sink is a file-based store, an empty folder or subfolder isn't copied or created at the sink. <br>Allowed values are **true** (default) and **false**.<br>This property doesn't apply when you configure `fileListPath`. |No |
| deleteFilesAfterCompletion | Indicates whether the binary files will be deleted from source store after successfully moving to the destination store. The file deletion is per file, so when copy activity fails, you will see some files have already been copied to the destination and deleted from source, while others are still remaining on source store. <br/>This property is only valid in binary files copy scenario. The default value: false. |No |
| modifiedDatetimeStart    | Files are filtered based on the attribute: last modified. <br>The files will be selected if their last modified time is  greater than or equal to `modifiedDatetimeStart` and less than `modifiedDatetimeEnd`. The time is applied to a UTC time zone in the format of "2018-12-01T05:00:00Z". <br> The properties can be **NULL**, which means no file attribute filter will be applied to the dataset.  When `modifiedDatetimeStart` has a datetime value but `modifiedDatetimeEnd` is **NULL**, the files whose last modified attribute is greater than or equal to the datetime value will be selected.  When `modifiedDatetimeEnd` has a datetime value but `modifiedDatetimeStart` is **NULL**, the files whose last modified attribute is less than the datetime value will be selected.<br/>This property doesn't apply when you configure `fileListPath`. | No                                            |
| modifiedDatetimeEnd      | Same as above.                                               | No                                                          |
| enablePartitionDiscovery | For files that are partitioned, specify whether to parse the partitions from the file path and add them as additional source columns.<br/>Allowed values are **false** (default) and **true**. | No                                            |
| partitionRootPath | When partition discovery is enabled, specify the absolute root path in order to read partitioned folders as data columns.<br/><br/>If it is not specified, by default,<br/>- When you use file path in dataset or list of files on source, partition root path is the path configured in dataset.<br/>- When you use wildcard folder filter, partition root path is the sub-path before the first wildcard.<br/>- When you use prefix, partition root path is sub-path before the last "/". <br/><br/>For example, assuming you configure the path in dataset as "root/folder/year=2020/month=08/day=27":<br/>- If you specify partition root path as "root/folder/year=2020", copy activity will generate two more columns `month` and `day` with value "08" and "27" respectively, in addition to the columns inside the files.<br/>- If partition root path is not specified, no extra column will be generated. | No                                            |
| maxConcurrentConnections |The upper limit of concurrent connections established to the data store during the activity run. Specify a value only when you want to limit concurrent connections.| No                                                          |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromAmazonS3",
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
                    "type": "AmazonS3ReadSettings",
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

## Preserve metadata during copy

When you copy files from Amazon S3 to Azure Data Lake Storage Gen2 or Azure Blob storage, you can choose to preserve the file metadata along with data. Learn more from [Preserve metadata](copy-activity-preserve-metadata.md#preserve-metadata).

## Mapping data flow properties

When you're transforming data in mapping data flows, you can read files from Amazon S3 in the following formats:

- [Avro](format-avro.md#mapping-data-flow-properties)
- [Delimited text](format-delimited-text.md#mapping-data-flow-properties)
- [Delta](format-delta.md#mapping-data-flow-properties)
- [Excel](format-excel.md#mapping-data-flow-properties)
- [JSON](format-json.md#mapping-data-flow-properties)
- [Parquet](format-parquet.md#mapping-data-flow-properties)

Format specific settings are located in the documentation for that format. For more information, see [Source transformation in mapping data flow](data-flow-source.md).

### Source transformation

In source transformation, you can read from a container, folder, or individual file in Amazon S3. Use the **Source options** tab to manage how the files are read. 

:::image type="content" source="media/data-flow/source-options-1.png" alt-text="Screenshot of Source options.":::

**Wildcard paths:** Using a wildcard pattern will instruct the service to loop through each matching folder and file in a single source transformation. This is an effective way to process multiple files within a single flow. Add multiple wildcard matching patterns with the plus sign that appears when you hover over your existing wildcard pattern.

From your source container, choose a series of files that match a pattern. Only a container can be specified in the dataset. Your wildcard path must therefore also include your folder path from the root folder.

Wildcard examples:

- `*` Represents any set of characters.
- `**` Represents recursive directory nesting.
- `?` Replaces one character.
- `[]` Matches one or more characters in the brackets.

- `/data/sales/**/*.csv` Gets all .csv files under /data/sales.
- `/data/sales/20??/**/` Gets all files in the 20th century.
- `/data/sales/*/*/*.csv` Gets .csv files two levels under /data/sales.
- `/data/sales/2004/*/12/[XY]1?.csv` Gets all .csv files in December 2004 starting with X or Y prefixed by a two-digit number.

**Partition root path:** If you have partitioned folders in your file source with  a `key=value` format (for example, `year=2019`), then you can assign the top level of that partition folder tree to a column name in your data flow's data stream.

First, set a wildcard to include all paths that are the partitioned folders plus the leaf files that you want to read.

:::image type="content" source="media/data-flow/part-file-2.png" alt-text="Screenshot of partition source file settings.":::

Use the **Partition root path** setting to define what the top level of the folder structure is. When you view the contents of your data via a data preview, you'll see that the service will add the resolved partitions found in each of your folder levels.

:::image type="content" source="media/data-flow/partfile1.png" alt-text="Screenshot of partition root path.":::

**List of files:** This is a file set. Create a text file that includes a list of relative path files to process. Point to this text file.

**Column to store file name:** Store the name of the source file in a column in your data. Enter a new column name here to store the file name string.

**After completion:** Choose to do nothing with the source file after the data flow runs, delete the source file, or move the source file. The paths for the move are relative.

To move source files to another location post-processing, first select "Move" for file operation. Then, set the "from" directory. If you're not using any wildcards for your path, then the "from" setting will be the same folder as your source folder.

If you have a source path with wildcard, your syntax will look like this:

`/data/sales/20??/**/*.csv`

You can specify "from" as:

`/data/sales`

And you can specify "to" as:

`/backup/priorSales`

In this case, all files that were sourced under `/data/sales` are moved to `/backup/priorSales`.

> [!NOTE]
> File operations run only when you start the data flow from a pipeline run (a pipeline debug or execution run) that uses the Execute Data Flow activity in a pipeline. File operations *do not* run in Data Flow debug mode.

**Filter by last modified:** You can filter which files you process by specifying a date range of when they were last modified. All datetimes are in UTC. 

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## GetMetadata activity properties

To learn details about the properties, check [GetMetadata activity](control-flow-get-metadata-activity.md). 

## Delete activity properties

To learn details about the properties, check [Delete activity](delete-activity.md).

## Legacy models

>[!NOTE]
>The following models are still supported as is for backward compatibility. We suggest that you use the new model mentioned earlier. The authoring UI has switched to generating the new model.

### Legacy dataset model

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the dataset must be set to **AmazonS3Object**. |Yes |
| bucketName | The S3 bucket name. The wildcard filter is not supported. |Yes for the Copy or Lookup activity, no for the GetMetadata activity |
| key | The name or wildcard filter of the S3 object key under the specified bucket. Applies only when the **prefix** property is not specified. <br/><br/>The wildcard filter is supported for both the folder part and the file name part. Allowed wildcards are: `*` (matches zero or more characters) and `?` (matches zero or single character).<br/>- Example 1: `"key": "rootfolder/subfolder/*.csv"`<br/>- Example 2: `"key": "rootfolder/subfolder/???20180427.txt"`<br/>See more example in [Folder and file filter examples](#folder-and-file-filter-examples). Use `^` to escape if your actual folder or file name has a wildcard or this escape character inside. |No |
| prefix | Prefix for the S3 object key. Objects whose keys start with this prefix are selected. Applies only when the **key** property is not specified. |No |
| version | The version of the S3 object, if S3 versioning is enabled. If a version is not specified, the latest version will be fetched. |No |
| modifiedDatetimeStart | Files are filtered based on the attribute: last modified. The files will be selected if their last modified time is greater than or equal to `modifiedDatetimeStart` and less than `modifiedDatetimeEnd`. The time is applied to the UTC time zone in the format of "2018-12-01T05:00:00Z". <br/><br/> Be aware that enabling this setting will affect the overall performance of data movement when you want to filter huge amounts of files. <br/><br/> The properties can be **NULL**, which means no file attribute filter will be applied to the dataset.  When `modifiedDatetimeStart` has a datetime value but `modifiedDatetimeEnd` is **NULL**, the files whose last modified attribute is greater than or equal to the datetime value will be selected.  When `modifiedDatetimeEnd` has a datetime value but `modifiedDatetimeStart` is NULL, the files whose last modified attribute is less than the datetime value will be selected.| No |
| modifiedDatetimeEnd | Files are filtered based on the attribute: last modified. The files will be selected if their last modified time is greater than or equal to `modifiedDatetimeStart` and less than `modifiedDatetimeEnd`. The time is applied to the UTC time zone in the format of "2018-12-01T05:00:00Z". <br/><br/> Be aware that enabling this setting will affect the overall performance of data movement when you want to filter huge amounts of files. <br/><br/> The properties can be **NULL**, which means no file attribute filter will be applied to the dataset.  When `modifiedDatetimeStart` has a datetime value but `modifiedDatetimeEnd` is **NULL**, the files whose last modified attribute is greater than or equal to the datetime value will be selected.  When `modifiedDatetimeEnd` has a datetime value but `modifiedDatetimeStart` is **NULL**, the files whose last modified attribute is less than the datetime value will be selected.| No |
| format | If you want to copy files as is between file-based stores (binary copy), skip the format section in both input and output dataset definitions.<br/><br/>If you want to parse or generate files with a specific format, the following file format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under **format** to one of these values. For more information, see the [Text format](supported-file-formats-and-compression-codecs-legacy.md#text-format), [JSON format](supported-file-formats-and-compression-codecs-legacy.md#json-format), [Avro format](supported-file-formats-and-compression-codecs-legacy.md#avro-format), [Orc format](supported-file-formats-and-compression-codecs-legacy.md#orc-format), and [Parquet format](supported-file-formats-and-compression-codecs-legacy.md#parquet-format) sections. |No (only for binary copy scenario) |
| compression | Specify the type and level of compression for the data. For more information, see [Supported file formats and compression codecs](supported-file-formats-and-compression-codecs-legacy.md#compression-support).<br/>Supported types are **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**.<br/>Supported levels are **Optimal** and **Fastest**. |No |

>[!TIP]
>To copy all files under a folder, specify **bucketName** for the bucket and **prefix** for the folder part.
>
>To copy a single file with a given name, specify **bucketName** for the bucket and **key** for the folder part plus file name.
>
>To copy a subset of files under a folder, specify **bucketName** for the bucket and **key** for the folder part plus wildcard filter.

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
            "modifiedDatetimeStart": "2018-12-01T05:00:00Z",
            "modifiedDatetimeEnd": "2018-12-01T06:00:00Z",
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

### Legacy source model for the Copy activity

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the Copy activity source must be set to **FileSystemSource**. |Yes |
| recursive | Indicates whether the data is read recursively from the subfolders or only from the specified folder. Note that when **recursive** is set to **true** and the sink is a file-based store, an empty folder or subfolder will not be copied or created at the sink.<br/>Allowed values are **true** (default) and **false**. | No |
| maxConcurrentConnections |The upper limit of concurrent connections established to the data store during the activity run. Specify a value only when you want to limit concurrent connections.| No |

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
For a list of data stores that the Copy activity supports as sources and sinks, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
