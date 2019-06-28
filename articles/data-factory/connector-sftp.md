---
title: Copy data from SFTP server using Azure Data Factory | Microsoft Docs
description: Learn about MySQL connector in Azure Data Factory that lets you copy data from an SFTP server to a data store supported as a sink.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 04/29/2019
ms.author: jingwang

---
# Copy data from SFTP server using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-sftp-connector.md)
> * [Current version](connector-sftp.md)

This article outlines how to copy data from SFTP server. To learn about Azure Data Factory, read the [introductory article](introduction.md).

## Supported capabilities

This SFTP connector is supported for the following activities:

- [Copy activity](copy-activity-overview.md) with [supported source/sink matrix](copy-activity-overview.md)
- [Lookup activity](control-flow-lookup-activity.md)
- [GetMetadata activity](control-flow-get-metadata-activity.md)

Specifically, this SFTP connector supports:

- Copying files using **Basic** or **SshPublicKey** authentication.
- Copying files as-is or parsing files with the [supported file formats and compression codecs](supported-file-formats-and-compression-codecs.md).

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to SFTP.

## Linked service properties

The following properties are supported for SFTP linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Sftp**. |Yes |
| host | Name or IP address of the SFTP server. |Yes |
| port | Port on which the SFTP server is listening.<br/>Allowed values are: integer, default value is **22**. |No |
| skipHostKeyValidation | Specify whether to skip host key validation.<br/>Allowed values are: **true**, **false** (default).  | No |
| hostKeyFingerprint | Specify the finger print of the host key. | Yes if the "skipHostKeyValidation" is set to false.  |
| authenticationType | Specify authentication type.<br/>Allowed values are: **Basic**, **SshPublicKey**. Refer to [Using basic authentication](#using-basic-authentication) and [Using SSH public key authentication](#using-ssh-public-key-authentication) sections on more properties and JSON samples respectively. |Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Azure Integration Runtime or Self-hosted Integration Runtime (if your data store is located in private network). If not specified, it uses the default Azure Integration Runtime. |No |

### Using basic authentication

To use basic authentication, set "authenticationType" property to **Basic**, and specify the following properties besides the SFTP connector generic ones introduced in the last section:

| Property | Description | Required |
|:--- |:--- |:--- |
| userName | User who has access to the SFTP server. |Yes |
| password | Password for the user (userName). Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |

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
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

### Using SSH public key authentication

To use SSH public key authentication, set "authenticationType" property as **SshPublicKey**, and specify the following properties besides the SFTP connector generic ones introduced in the last section:

| Property | Description | Required |
|:--- |:--- |:--- |
| userName | User who has access to the SFTP server |Yes |
| privateKeyPath | Specify absolute path to the private key file that Integration Runtime can access. Applies only when Self-hosted type of Integration Runtime is specified in "connectVia". | Specify either the `privateKeyPath` or `privateKeyContent`.  |
| privateKeyContent | Base64 encoded SSH private key content. SSH private key should be OpenSSH format. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Specify either the `privateKeyPath` or `privateKeyContent`. |
| passPhrase | Specify the pass phrase/password to decrypt the private key if the key file is protected by a pass phrase. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes if the private key file is protected by a pass phrase. |

> [!NOTE]
> SFTP connector supports RSA/DSA OpenSSH key. Make sure your key file content starts with "-----BEGIN [RSA/DSA] PRIVATE KEY-----". If the private key file is a ppk-format file, please use Putty tool to convert from .ppk to OpenSSH format. 

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
            "referenceName": "<name of Integration Runtime>",
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
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. 

- For **Parquet and delimited text format**, refer to [Parquet and delimited text format dataset](#parquet-and-delimited-text-format-dataset) section.
- For other formats like **ORC/Avro/JSON/Binary format**, refer to [Other format dataset](#other-format-dataset) section.

### Parquet and delimited text format dataset

To copy data from SFTP in **Parquet or delimited text format**, refer to [Parquet format](format-parquet.md) and [Delimited text format](format-delimited-text.md) article on format-based dataset and supported settings. The following properties are supported for SFTP under `location` settings in format-based dataset:

| Property   | Description                                                  | Required |
| ---------- | ------------------------------------------------------------ | -------- |
| type       | The type property under `location` in dataset must be set to **SftpLocation**. | Yes      |
| folderPath | The path to folder. If you want to use wildcard to filter folder, skip this setting and specify in activity source settings. | No       |
| fileName   | The file name under the given folderPath. If you want to use wildcard to filter files, skip this setting and specify in activity source settings. | No       |

> [!NOTE]
> **FileShare** type dataset with Parquet/Text format mentioned in next section is still supported as-is for Copy/Lookup/GetMetadata activity for backward compatibility. You are suggested to use this new model going forward, and the ADF authoring UI has switched to generating these new types.

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

### Other format dataset

To copy data from SFTP in **ORC/Avro/JSON/Binary format**, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **FileShare** |Yes |
| folderPath | Path to the folder. Wildcard filter is supported, allowed wildcards are: `*` (matches zero or more characters) and `?` (matches zero or single character); use `^` to escape if your actual file name has wildcard or this escape char inside. <br/><br/>Examples: rootfolder/subfolder/, see more examples in [Folder and file filter examples](#folder-and-file-filter-examples). |Yes |
| fileName |  **Name or wildcard filter** for the file(s) under the specified "folderPath". If you don't specify a value for this property, the dataset points to all files in the folder. <br/><br/>For filter, allowed wildcards are: `*` (matches zero or more characters) and `?` (matches zero or single character).<br/>- Example 1: `"fileName": "*.csv"`<br/>- Example 2: `"fileName": "???20180427.txt"`<br/>Use `^` to escape if your actual folder name has wildcard or this escape char inside. |No |
| modifiedDatetimeStart | Files filter based on the attribute: Last Modified. The files will be selected if their last modified time are within the time range between `modifiedDatetimeStart` and `modifiedDatetimeEnd`. The time is applied to UTC time zone in the format of "2018-12-01T05:00:00Z". <br/><br/> Be aware the overall performance of data movement will be impacted by enabling this setting when you want to do file filter from huge amounts of files. <br/><br/> The properties can be NULL that mean no file attribute filter will be applied to the dataset.  When `modifiedDatetimeStart` has datetime value but `modifiedDatetimeEnd` is NULL, it means the files whose last modified attribute is greater than or equal with the datetime value will be selected.  When `modifiedDatetimeEnd` has datetime value but `modifiedDatetimeStart` is NULL, it means the files whose last modified attribute is less than the datetime value will be selected.| No |
| modifiedDatetimeEnd | Files filter based on the attribute: Last Modified. The files will be selected if their last modified time are within the time range between `modifiedDatetimeStart` and `modifiedDatetimeEnd`. The time is applied to UTC time zone in the format of "2018-12-01T05:00:00Z". <br/><br/> Be aware the overall performance of data movement will be impacted by enabling this setting when you want to do file filter from huge amounts of files. <br/><br/> The properties can be NULL that mean no file attribute filter will be applied to the dataset.  When `modifiedDatetimeStart` has datetime value but `modifiedDatetimeEnd` is NULL, it means the files whose last modified attribute is greater than or equal with the datetime value will be selected.  When `modifiedDatetimeEnd` has datetime value but `modifiedDatetimeStart` is NULL, it means the files whose last modified attribute is less than the datetime value will be selected.| No |
| format | If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions.<br/><br/>If you want to parse files with a specific format, the following file format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](supported-file-formats-and-compression-codecs.md#text-format), [Json Format](supported-file-formats-and-compression-codecs.md#json-format), [Avro Format](supported-file-formats-and-compression-codecs.md#avro-format), [Orc Format](supported-file-formats-and-compression-codecs.md#orc-format), and [Parquet Format](supported-file-formats-and-compression-codecs.md#parquet-format) sections. |No (only for binary copy scenario) |
| compression | Specify the type and level of compression for the data. For more information, see [Supported file formats and compression codecs](supported-file-formats-and-compression-codecs.md#compression-support).<br/>Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**.<br/>Supported levels are: **Optimal** and **Fastest**. |No |

>[!TIP]
>To copy all files under a folder, specify **folderPath** only.<br>To copy a single file with a given name, specify **folderPath** with folder part and **fileName** with file name.<br>To copy a subset of files under a folder, specify **folderPath** with folder part and **fileName** with wildcard filter.

>[!NOTE]
>If you were using "fileFilter" property for file filter, it is still supported as-is, while you are suggested to use the new filter capability added to "fileName" going forward.

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

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by SFTP source.

### SFTP as source

- For copy from **Parquet and delimited text format**, refer to [Parquet and delimited text format source](#parquet-and-delimited-text-format-source) section.
- For copy from other formats like **ORC/Avro/JSON/Binary format**, refer to [Other format source](#other-format-source) section.

#### Parquet and delimited text format source

To copy data from SFTP in **Parquet or delimited text format**, refer to [Parquet format](format-parquet.md) and [Delimited text format](format-delimited-text.md) article on format-based copy activity source and supported settings. The following properties are supported for SFTP under `storeSettings` settings in format-based copy source:

| Property                 | Description                                                  | Required                                      |
| ------------------------ | ------------------------------------------------------------ | --------------------------------------------- |
| type                     | The type property under `storeSettings` must be set to **SftpReadSetting**. | Yes                                           |
| recursive                | Indicates whether the data is read recursively from the subfolders or only from the specified folder. Note that when recursive is set to true and the sink is a file-based store, an empty folder or subfolder isn't copied or created at the sink. Allowed values are **true** (default) and **false**. | No                                            |
| wildcardFolderPath       | The folder path with wildcard characters to filter source folders. <br>Allowed wildcards are: `*` (matches zero or more characters) and `?` (matches zero or single character); use `^` to escape if your actual folder name has wildcard or this escape char inside. <br>See more examples in [Folder and file filter examples](#folder-and-file-filter-examples). | No                                            |
| wildcardFileName         | The file name with wildcard characters under the given folderPath/wildcardFolderPath to filter source files. <br>Allowed wildcards are: `*` (matches zero or more characters) and `?` (matches zero or single character); use `^` to escape if your actual folder name has wildcard or this escape char inside.  See more examples in [Folder and file filter examples](#folder-and-file-filter-examples). | Yes if `fileName` is not specified in dataset |
| modifiedDatetimeStart    | Files filter based on the attribute: Last Modified. The files will be selected if their last modified time are within the time range between `modifiedDatetimeStart` and `modifiedDatetimeEnd`. The time is applied to UTC time zone in the format of "2018-12-01T05:00:00Z". <br> The properties can be NULL which mean no file attribute filter will be applied to the dataset.  When `modifiedDatetimeStart` has datetime value but `modifiedDatetimeEnd` is NULL, it means the files whose last modified attribute is greater than or equal with the datetime value will be selected.  When `modifiedDatetimeEnd` has datetime value but `modifiedDatetimeStart` is NULL, it means the files whose last modified attribute is less than the datetime value will be selected. | No                                            |
| modifiedDatetimeEnd      | Same as above.                                               | No                                            |
| maxConcurrentConnections | The number of the connections to connect to storage store concurrently. Specify only when you want to limit the concurrent connection to the data store. | No                                            |

> [!NOTE]
> For Parquet/delimited text format, **FileSystemSource** type copy activity source mentioned in next section is still supported as-is for backward compatibility. You are suggested to use this new model going forward, and the ADF authoring UI has switched to generating these new types.

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
                    "type": "DelimitedTextReadSetting",
                    "skipLineCount": 10
                },
                "storeSettings":{
                    "type": "SftpReadSetting",
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

#### Other format source

To copy data from SFTP in **ORC/Avro/JSON/Binary format**, the following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **FileSystemSource** |Yes |
| recursive | Indicates whether the data is read recursively from the sub folders or only from the specified folder. Note when recursive is set to true and sink is file-based store, empty folder/sub-folder will not be copied/created at sink.<br/>Allowed values are: **true** (default), **false** | No |
| maxConcurrentConnections | The number of the connections to connect to storage store concurrently. Specify only when you want to limit the concurrent connection to the data store. | No |

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

### Folder and file filter examples

This section describes the resulting behavior of the folder path and file name with wildcard filters.

| folderPath | fileName | recursive | Source folder structure and filter result (files in **bold** are retrieved)|
|:--- |:--- |:--- |:--- |
| `Folder*` | (empty, use default) | false | FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File2.json**<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3.csv<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5.csv<br/>AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |
| `Folder*` | (empty, use default) | true | FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File2.json**<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File3.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File4.json**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File5.csv**<br/>AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |
| `Folder*` | `*.csv` | false | FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3.csv<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5.csv<br/>AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |
| `Folder*` | `*.csv` | true | FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File3.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File5.csv**<br/>AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md##supported-data-stores-and-formats).
