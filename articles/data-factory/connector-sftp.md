---
title: Copy data from and to SFTP server
description: Learn how to copy data from and to SFTP server by using Azure Data Factory.
services: data-factory
documentationcenter: ''
ms.author: jingwang
author: linda33wj
manager: shwang
ms.reviewer: douglasl
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 06/12/2020
---

# Copy data from and to the SFTP server by using Azure Data Factory

> [!div class="op_single_selector" title1="Select the version of the Data Factory service that you are using:"]
> * [Version 1](v1/data-factory-sftp-connector.md)
> * [Current version](connector-sftp.md)
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to copy data from and to the secure FTP (SFTP) server. To learn about Azure Data Factory, read the [introductory article](introduction.md).

## Supported capabilities

The SFTP connector is supported for the following activities:

- [Copy activity](copy-activity-overview.md) with [supported source/sink matrix](copy-activity-overview.md)
- [Lookup activity](control-flow-lookup-activity.md)
- [GetMetadata activity](control-flow-get-metadata-activity.md)
- [Delete activity](delete-activity.md)

Specifically, the SFTP connector supports:

- Copying files from and to the SFTP server by using *Basic* or *SshPublicKey* authentication.
- Copying files as is or by parsing or generating files with the [supported file formats and compression codecs](supported-file-formats-and-compression-codecs.md).

## Prerequisites

[!INCLUDE [data-factory-v2-integration-runtime-requirements](../../includes/data-factory-v2-integration-runtime-requirements.md)]

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to SFTP.

## Linked service properties

The following properties are supported for the SFTP linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to *Sftp*. |Yes |
| host | The name or IP address of the SFTP server. |Yes |
| port | The port on which the SFTP server is listening.<br/>The allowed value is an integer, and the default value is *22*. |No |
| skipHostKeyValidation | Specify whether to skip host key validation.<br/>Allowed values are *true* and *false* (default).  | No |
| hostKeyFingerprint | Specify the fingerprint of the host key. | Yes, if the "skipHostKeyValidation" is set to false.  |
| authenticationType | Specify the authentication type.<br/>Allowed values are *Basic* and *SshPublicKey*. For more properties, see the [Use basic authentication](#use-basic-authentication) section. For JSON examples, see the [Use SSH public key authentication](#use-ssh-public-key-authentication) section. |Yes |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. To learn more, see the [Prerequisites](#prerequisites) section. If the integration runtime isn't specified, the service uses the default Azure Integration Runtime. |No |

### Use basic authentication

To use basic authentication, set the *authenticationType* property to *Basic*, and specify the following properties in addition to the SFTP connector generic properties that were introduced in the preceding section:

| Property | Description | Required |
|:--- |:--- |:--- |
| userName | The user who has access to the SFTP server. |Yes |
| password | The password for the user (userName). Mark this field as a SecureString to store it securely in your data factory, or [reference a secret stored in an Azure key vault](store-credentials-in-key-vault.md). | Yes |

**Example:**

```json
{
    "name": "SftpLinkedService",
    "type": "linkedservices",
    "properties": {
        "type": "Sftp",
        "typeProperties": {
            "host": "<sftp server>",
            "port": 22,
            "skipHostKeyValidation": false,
            "hostKeyFingerPrint": "ssh-rsa 2048 xx:00:00:00:xx:00:x0:0x:0x:0x:0x:00:00:x0:x0:00",
            "authenticationType": "Basic",
            "userName": "<username>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
            }
        },
        "connectVia": {
            "referenceName": "<name of integration runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

### Use SSH public key authentication

To use SSH public key authentication, set "authenticationType" property as **SshPublicKey**, and specify the following properties besides the SFTP connector generic ones introduced in the last section:

| Property | Description | Required |
|:--- |:--- |:--- |
| userName | The user who has access to the SFTP server. |Yes |
| privateKeyPath | Specify the absolute path to the private key file that the integration runtime can access. This applies only when the self-hosted type of integration runtime is specified in "connectVia." | Specify either `privateKeyPath` or `privateKeyContent`.  |
| privateKeyContent | Base64 encoded SSH private key content. SSH private key should be OpenSSH format. Mark this field as a SecureString to store it securely in your data factory, or [reference a secret stored in an Azure key vault](store-credentials-in-key-vault.md). | Specify either `privateKeyPath` or `privateKeyContent`. |
| passPhrase | Specify the pass phrase or password to decrypt the private key if the key file is protected by a pass phrase. Mark this field as a SecureString to store it securely in your data factory, or [reference a secret stored in an Azure key vault](store-credentials-in-key-vault.md). | Yes, if the private key file is protected by a pass phrase. |

> [!NOTE]
> The SFTP connector supports an RSA/DSA OpenSSH key. Make sure that your key file content starts with "-----BEGIN [RSA/DSA] PRIVATE KEY-----". If the private key file is a PPK-format file, use the PuTTY tool to convert from PPK to OpenSSH format. 

**Example 1: SshPublicKey authentication using private key filePath**

```json
{
    "name": "SftpLinkedService",
    "type": "Linkedservices",
    "properties": {
        "type": "Sftp",
        "typeProperties": {
            "host": "<sftp server>",
            "port": 22,
            "skipHostKeyValidation": true,
            "authenticationType": "SshPublicKey",
            "userName": "xxx",
            "privateKeyPath": "D:\\privatekey_openssh",
            "passPhrase": {
                "type": "SecureString",
                "value": "<pass phrase>"
            }
        },
        "connectVia": {
            "referenceName": "<name of integration runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

**Example 2: SshPublicKey authentication using private key content**

```json
{
    "name": "SftpLinkedService",
    "type": "Linkedservices",
    "properties": {
        "type": "Sftp",
        "typeProperties": {
            "host": "<sftp server>",
            "port": 22,
            "skipHostKeyValidation": true,
            "authenticationType": "SshPublicKey",
            "userName": "<username>",
            "privateKeyContent": {
                "type": "SecureString",
                "value": "<base64 string of the private key content>"
            },
            "passPhrase": {
                "type": "SecureString",
                "value": "<pass phrase>"
            }
        },
        "connectVia": {
            "referenceName": "<name of integration runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties that are available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. 

[!INCLUDE [data-factory-v2-file-formats](../../includes/data-factory-v2-file-formats.md)] 

The following properties are supported for SFTP under `location` settings in the format-based dataset:

| Property   | Description                                                  | Required |
| ---------- | ------------------------------------------------------------ | -------- |
| type       | The *type* property under `location` in dataset must be set to *SftpLocation*. | Yes      |
| folderPath | The path to the folder. If you want to use a wildcard to filter the folder, skip this setting and specify the path in activity source settings. | No       |
| fileName   | The file name under the specified folderPath. If you want to use a wildcard to filter files, skip this setting and specify the file name in activity source settings. | No       |

**Example:**

```json
{
    "name": "DelimitedTextDataset",
    "properties": {
        "type": "DelimitedText",
        "linkedServiceName": {
            "referenceName": "<SFTP linked service name>",
            "type": "LinkedServiceReference"
        },
        "schema": [ < physical schema, optional, auto retrieved during authoring > ],
        "typeProperties": {
            "location": {
                "type": "SftpLocation",
                "folderPath": "root/folder/subfolder"
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

For a full list of sections and properties that are available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties that are supported by the SFTP source.

### SFTP as source

[!INCLUDE [data-factory-v2-file-formats](../../includes/data-factory-v2-file-formats.md)] 

The following properties are supported for SFTP under the `storeSettings` settings in the format-based Copy source:

| Property                 | Description                                                  | Required                                      |
| ------------------------ | ------------------------------------------------------------ | --------------------------------------------- |
| type                     | The *type* property under `storeSettings` must be set to *SftpReadSettings*. | Yes                                           |
| ***Locate the files to copy*** |  |  |
| OPTION 1: static path<br> | Copy from the folder/file path that's specified in the dataset. If you want to copy all files from a folder, additionally specify `wildcardFileName` as `*`. |  |
| OPTION 2: wildcard<br>- wildcardFolderPath | The folder path with wildcard characters to filter source folders. <br>Allowed wildcards are `*` (matches zero or more characters) and `?` (matches zero or a single character); use `^` to escape if your actual folder name has a wildcard or this escape char inside. <br>For more examples, see [Folder and file filter examples](#folder-and-file-filter-examples). | No                                            |
| OPTION 2: wildcard<br>- wildcardFileName | The file name with wildcard characters under the specified folderPath/wildcardFolderPath to filter source files. <br>Allowed wildcards are `*` (matches zero or more characters) and `?` (matches zero or a single character); use `^` to escape if your actual folder name has wildcard or this escape char inside.  For more examples, see [Folder and file filter examples](#folder-and-file-filter-examples). | Yes |
| OPTION 3: a list of files<br>- fileListPath | Indicates to copy a specified file set. Point to a text file that includes a list of files you want to copy (one file per line, with the relative path to the path configured in the dataset).<br/>When you use this option, don't specify the file name in the dataset. For more examples, see [File list examples](#file-list-examples). |No |
| ***Additional settings*** |  | |
| recursive | Indicates whether the data is read recursively from the subfolders or only from the specified folder. When recursive is set to true and the sink is a file-based store, an empty folder or subfolder isn't copied or created at the sink. <br>Allowed values are *true* (default) and *false*.<br>This property doesn't apply when you configure `fileListPath`. |No |
| deleteFilesAfterCompletion | Indicates whether the binary files will be deleted from source store after successfully moving to the destination store. The file deletion is per file, so when copy activity fails, you will see some files have already been copied to the destination and deleted from source, while others are still remaining on source store. <br/>This property is only valid in binary copy scenario, where data source stores are Blob, ADLS Gen1, ADLS Gen2, S3, Google Cloud Storage, File, Azure File, SFTP, or FTP. The default value: false. |No |
| modifiedDatetimeStart    | Files are filtered based on the attribute *Last Modified*. <br>The files are selected if their last modified time is within the range of `modifiedDatetimeStart` to `modifiedDatetimeEnd`. The time is applied to the UTC time zone in the format of *2018-12-01T05:00:00Z*. <br> The properties can be NULL, which means that no file attribute filter is applied to the dataset.  When `modifiedDatetimeStart` has a datetime value but `modifiedDatetimeEnd` is NULL, it means that the files whose last modified attribute is greater than or equal to the datetime value are selected.  When `modifiedDatetimeEnd` has a datetime value but `modifiedDatetimeStart` is NULL, it means that the files whose last modified attribute is less than the datetime value are selected.<br/>This property doesn't apply when you configure `fileListPath`. | No                                            |
| modifiedDatetimeEnd      | Same as above.                                               | No                                            |
| maxConcurrentConnections | The number of connections that can connect to the storage store concurrently. Specify a value only when you want to limit the concurrent connection to the data store. | No                                            |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromSFTP",
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
                    "type": "SftpReadSettings",
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

### SFTP as a sink

[!INCLUDE [data-factory-v2-file-formats](../../includes/data-factory-v2-file-formats.md)] 

The following properties are supported for SFTP under `storeSettings` settings in a format-based Copy sink:

| Property                 | Description                                                  | Required |
| ------------------------ | ------------------------------------------------------------ | -------- |
| type                     | The *type* property under `storeSettings` must be set to *SftpWriteSettings*. | Yes      |
| copyBehavior             | Defines the copy behavior when the source is files from a file-based data store.<br/><br/>Allowed values are:<br/><b>- PreserveHierarchy (default)</b>: Preserves the file hierarchy in the target folder. The relative path of the source file to the source folder is identical to the relative path of the target file to the target folder.<br/><b>- FlattenHierarchy</b>: All files from the source folder are in the first level of the target folder. The target files have autogenerated names. <br/><b>- MergeFiles</b>: Merges all files from the source folder to one file. If the file name is specified, the merged file name is the specified name. Otherwise, it's an autogenerated file name. | No       |
| maxConcurrentConnections | The number of connections that can connect to the storage store concurrently. Specify a value only when you want to limit the concurrent connection to the data store. | No       |
| useTempFileRename | Indicate whether to upload to temporary files and rename them, or directly write to the target folder or file location. By default, Azure Data Factory first writes to temporary files and then renames them when the upload is finished. This sequence helps to (1) avoid conflicts that might result in a corrupted file if you have other processes writing to the same file, and (2) ensure that the original version of the file exists during the transfer. If your SFTP server doesn't support a rename operation, disable this option and make sure that you don't have a concurrent write to the target file. For more information, see the troubleshooting tip at the end of this table. | No. Default value is *true*. |
| operationTimeout | The wait time before each write request to SFTP server times out. Default value is 60 min (01:00:00).|No |

>[!TIP]
>If you receive the error "UserErrorSftpPathNotFound," "UserErrorSftpPermissionDenied," or "SftpOperationFail" when you're writing data into SFTP, and the SFTP user you use *does* have the proper permissions, check to see whether your SFTP server support file rename operation is working. If it isn't, disable the **Upload with temp file** (`useTempFileRename`) option and try again. To learn more about this property, see the preceding table. If you use a self-hosted integration runtime for the Copy activity, be sure to use version 4.6 or later.

**Example:**

```json
"activities":[
    {
        "name": "CopyToSFTP",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
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
                "type": "<source type>"
            },
            "sink": {
                "type": "BinarySink",
                "storeSettings":{
                    "type": "SftpWriteSettings",
                    "copyBehavior": "PreserveHierarchy"
                }
            }
        }
    }
]
```

### Folder and file filter examples

This section describes the behavior that results from using wildcard filters with folder paths and file names.

| folderPath | fileName | recursive | Source folder structure and filter result (files in **bold** are retrieved)|
|:--- |:--- |:--- |:--- |
| `Folder*` | (empty, use default) | false | FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File2.json**<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3.csv<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5.csv<br/>AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |
| `Folder*` | (empty, use default) | true | FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File2.json**<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File3.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File4.json**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File5.csv**<br/>AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |
| `Folder*` | `*.csv` | false | FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3.csv<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5.csv<br/>AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |
| `Folder*` | `*.csv` | true | FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File3.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File5.csv**<br/>AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |

### File list examples

This table describes the behavior that results from using a file list path in the Copy activity source. It assumes that you have the following source folder structure and want to copy the files that are in bold type:

| Sample source structure                                      | Content in FileListToCopy.txt                             | Azure Data Factory configuration                                            |
| ------------------------------------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------ |
| root<br/>&nbsp;&nbsp;&nbsp;&nbsp;FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File2.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File3.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File5.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;Metadata<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FileListToCopy.txt | File1.csv<br>Subfolder1/File3.csv<br>Subfolder1/File5.csv | **In the dataset:**<br>- Folder path: `root/FolderA`<br><br>**In the Copy activity source:**<br>- File list path: `root/Metadata/FileListToCopy.txt` <br><br>The file list path points to a text file in the same data store that includes a list of files you want to copy (one file per line, with the relative path to the path configured in the dataset). |

## Lookup activity properties

For information about Lookup activity properties, see [Lookup activity in Azure Data Factory](control-flow-lookup-activity.md).

## GetMetadata activity properties

For information about GetMetadata activity properties, see [GetMetadata activity in Azure Data Factory](control-flow-get-metadata-activity.md). 

## Delete activity properties

For information about Delete activity properties, see [Delete activity in Azure Data Factory](delete-activity.md).

## Legacy models

>[!NOTE]
>The following models are still supported as is for backward compatibility. We recommend that you use the previously discussed new model, because the Azure Data Factory authoring UI has switched to generating the new model.

### Legacy dataset model

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The *type* property of the dataset must be set to *FileShare*. |Yes |
| folderPath | The path to the folder. A wildcard filter is supported. Allowed wildcards are `*` (matches zero or more characters) and `?` (matches zero or a single character); use `^` to escape if your actual file name has a wildcard or this escape char inside. <br/><br/>Examples: rootfolder/subfolder/, see more examples in [Folder and file filter examples](#folder-and-file-filter-examples). |Yes |
| fileName |  **Name or wildcard filter** for the files under the specified "folderPath". If you don't specify a value for this property, the dataset points to all files in the folder. <br/><br/>For filter, the allowed wildcards are `*` (matches zero or more characters) and `?` (matches zero or a single character).<br/>- Example 1: `"fileName": "*.csv"`<br/>- Example 2: `"fileName": "???20180427.txt"`<br/>Use `^` to escape if your actual folder name has wildcard or this escape char inside. |No |
| modifiedDatetimeStart | Files are filtered based on the attribute *Last Modified*. The files are selected if their last modified time is within the range of `modifiedDatetimeStart` to `modifiedDatetimeEnd`. The time is applied to UTC time zone in the format of *2018-12-01T05:00:00Z*. <br/><br/> The overall performance of data movement will be affected by enabling this setting when you want to do file filter from large numbers of files. <br/><br/> The properties can be NULL, which means that no file attribute filter is applied to the dataset.  When `modifiedDatetimeStart` has a datetime value but `modifiedDatetimeEnd` is NULL, it means that the files whose last modified attribute is greater than or equal to the datetime value are selected.  When `modifiedDatetimeEnd` has a datetime value but `modifiedDatetimeStart` is NULL, it means that the files whose last modified attribute is less than the datetime value are selected.| No |
| modifiedDatetimeEnd | Files are filtered based on the attribute *Last Modified*. The files are selected if their last modified time is within the range of `modifiedDatetimeStart` to `modifiedDatetimeEnd`. The time is applied to UTC time zone in the format of *2018-12-01T05:00:00Z*. <br/><br/> The overall performance of data movement will be affected by enabling this setting when you want to do file filter from large numbers of files. <br/><br/> The properties can be NULL, which means that no file attribute filter is applied to the dataset.  When `modifiedDatetimeStart` has a datetime value but `modifiedDatetimeEnd` is NULL, it means that the files whose last modified attribute is greater than or equal to the datetime value are selected.  When `modifiedDatetimeEnd` has a datetime value but `modifiedDatetimeStart` is NULL, it means that the files whose last modified attribute is less than the datetime value are selected.| No |
| format | If you want to copy files as is between file-based stores (binary copy), skip the format section in both input and output dataset definitions.<br/><br/>If you want to parse files with a specific format, the following file format types are supported: *TextFormat*, *JsonFormat*, *AvroFormat*, *OrcFormat*, and *ParquetFormat*. Set the *type* property under format to one of these values. For more information, see [Text format](supported-file-formats-and-compression-codecs-legacy.md#text-format), [Json format](supported-file-formats-and-compression-codecs-legacy.md#json-format), [Avro format](supported-file-formats-and-compression-codecs-legacy.md#avro-format), [Orc format](supported-file-formats-and-compression-codecs-legacy.md#orc-format), and [Parquet format](supported-file-formats-and-compression-codecs-legacy.md#parquet-format) sections. |No (only for binary copy scenario) |
| compression | Specify the type and level of compression for the data. For more information, see [Supported file formats and compression codecs](supported-file-formats-and-compression-codecs-legacy.md#compression-support).<br/>Supported types are *GZip*, *Deflate*, *BZip2*, and *ZipDeflate*.<br/>Supported levels are *Optimal* and *Fastest*. |No |

>[!TIP]
>To copy all files under a folder, specify *folderPath* only.<br>To copy a single file with a specified name, specify *folderPath* with the folder part and *fileName* with the file name.<br>To copy a subset of files under a folder, specify *folderPath* with the folder part and *fileName* with the wildcard filter.

>[!NOTE]
>If you were using *fileFilter* property for the file filter, it is still supported as is, but we recommend that you use the new filter capability added to *fileName* from now on.

**Example:**

```json
{
    "name": "SFTPDataset",
    "type": "Datasets",
    "properties": {
        "type": "FileShare",
        "linkedServiceName":{
            "referenceName": "<SFTP linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "folderPath": "folder/subfolder/",
            "fileName": "*",
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

### Legacy Copy activity source model

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The *type* property of the Copy activity source must be set to *FileSystemSource* |Yes |
| recursive | Indicates whether the data is read recursively from the subfolders or only from the specified folder. When recursive is set to *true* and the sink is a file-based store, empty folders and subfolders won't be copied or created at the sink.<br/>Allowed values are *true* (default) and *false* | No |
| maxConcurrentConnections | The number of connections that can connect to a storage store concurrently. Specify a number only when you want to limit the concurrent connections to the data store. | No |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromSFTP",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<SFTP input dataset name>",
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
For a list of data stores that are supported as sources and sinks by the Copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
