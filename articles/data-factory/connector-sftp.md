---
title: Copy and transform data in SFTP server using Azure Data Factory or Azure Synapse Analytics
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy data from and to SFTP server, and transform data in SFTP server using Azure Data Factory or Azure Synapse Analytics.
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 04/12/2023
---

# Copy and transform data in SFTP server using Azure Data Factory or Azure Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Copy Activity to copy data from and to the secure FTP (SFTP) server, and use Data Flow to transform data in SFTP server. To learn more read the introductory article for [Azure Data Factory](introduction.md) or [Azure Synapse Analytics](../synapse-analytics/overview-what-is.md).

## Supported capabilities

This SFTP connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/sink)|&#9312; &#9313;|
|[Mapping data flow](concepts-data-flow-overview.md) (source/sink)|&#9312; |
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|
|[GetMetadata activity](control-flow-get-metadata-activity.md)|&#9312; &#9313;|
|[Delete activity](delete-activity.md)|&#9312; &#9313;|

<small>*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*</small>

Specifically, the SFTP connector supports:

- Copying files from and to the SFTP server by using **Basic**, **SSH public key** or **multi-factor** authentication.
- Copying files as is or by parsing or generating files with the [supported file formats and compression codecs](supported-file-formats-and-compression-codecs.md).

## Prerequisites

[!INCLUDE [data-factory-v2-integration-runtime-requirements](includes/data-factory-v2-integration-runtime-requirements.md)]

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create an SFTP linked service using UI

Use the following steps to create an SFTP linked service in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for SFTP and select the SFTP connector.

    :::image type="content" source="media/connector-sftp/sftp-connector.png" alt-text="Screenshot of the SFTP connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-sftp/configure-sftp-linked-service.png" alt-text="Screenshot of configuration for an SFTP linked service.":::

## Connector configuration details

The following sections provide details about properties that are used to define entities specific to SFTP.

## Linked service properties

The following properties are supported for the SFTP linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to *Sftp*. |Yes |
| host | The name or IP address of the SFTP server. |Yes |
| port | The port on which the SFTP server is listening.<br/>The allowed value is an integer, and the default value is *22*. |No |
| skipHostKeyValidation | Specify whether to skip host key validation.<br/>Allowed values are *true* and *false* (default).  | No |
| hostKeyFingerprint | Specify the fingerprint of the host key. | Yes, if the "skipHostKeyValidation" is set to false.  |
| authenticationType | Specify the authentication type.<br/>Allowed values are *Basic*, *SshPublicKey* and *MultiFactor*. For more properties, see the [Use basic authentication](#use-basic-authentication) section. For JSON examples, see the [Use SSH public key authentication](#use-ssh-public-key-authentication) section. |Yes |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. To learn more, see the [Prerequisites](#prerequisites) section. If the integration runtime isn't specified, the service uses the default Azure Integration Runtime. |No |

### Use basic authentication

To use basic authentication, set the *authenticationType* property to *Basic*, and specify the following properties in addition to the SFTP connector generic properties that were introduced in the preceding section:

| Property | Description | Required |
|:--- |:--- |:--- |
| userName | The user who has access to the SFTP server. |Yes |
| password | The password for the user (userName). Mark this field as a SecureString to store it securely, or [reference a secret stored in an Azure key vault](store-credentials-in-key-vault.md). | Yes |

**Example:**

```json
{
    "name": "SftpLinkedService",
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
| privateKeyContent | Base64 encoded SSH private key content. SSH private key should be OpenSSH format. Mark this field as a SecureString to store it securely, or [reference a secret stored in an Azure key vault](store-credentials-in-key-vault.md). | Specify either `privateKeyPath` or `privateKeyContent`. |
| passPhrase | Specify the pass phrase or password to decrypt the private key if the key file or the key content is protected by a pass phrase. Mark this field as a SecureString to store it securely, or [reference a secret stored in an Azure key vault](store-credentials-in-key-vault.md). | Yes, if the private key file or the key content is protected by a pass phrase. |

> [!NOTE]
> The SFTP connector supports an RSA/DSA OpenSSH key. Make sure that your key file content starts with "-----BEGIN [RSA/DSA] PRIVATE KEY-----". If the private key file is a PPK-format file, use the PuTTY tool to convert from PPK to OpenSSH format. 

**Example 1: SshPublicKey authentication using private key filePath**

```json
{
    "name": "SftpLinkedService",
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

### Use multi-factor authentication

To use multi-factor authentication which is a combination of basic and SSH public key authentications, specify the user name, password and the private key info described in above sections.

**Example: multi-factor authentication**

```json
{
    "name": "SftpLinkedService",
    "properties": {
        "type": "Sftp",
        "typeProperties": {
            "host": "<host>",
            "port": 22,
            "authenticationType": "MultiFactor",
            "userName": "<username>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
            },
            "privateKeyContent": {
                "type": "SecureString",
                "value": "<base64 encoded private key content>"
            },
            "passPhrase": {
                "type": "SecureString",
                "value": "<passphrase for private key>"
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

[!INCLUDE [data-factory-v2-file-formats](includes/data-factory-v2-file-formats.md)] 

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

[!INCLUDE [data-factory-v2-file-formats](includes/data-factory-v2-file-formats.md)] 

The following properties are supported for SFTP under the `storeSettings` settings in the format-based Copy source:

| Property                 | Description                                                  | Required                                      |
| ------------------------ | ------------------------------------------------------------ | --------------------------------------------- |
| type                     | The *type* property under `storeSettings` must be set to *SftpReadSettings*. | Yes                                           |
| ***Locate the files to copy*** |  |  |
| OPTION 1: static path<br> | Copy from the folder/file path that's specified in the dataset. If you want to copy all files from a folder, additionally specify `wildcardFileName` as `*`. |  |
| OPTION 2: wildcard<br>- wildcardFolderPath | The folder path with wildcard characters to filter source folders. <br>Allowed wildcards are `*` (matches zero or more characters) and `?` (matches zero or a single character); use `^` to escape if your actual folder name has a wildcard or this escape char inside. <br>For more examples, see [Folder and file filter examples](#folder-and-file-filter-examples). | No                                            |
| OPTION 2: wildcard<br>- wildcardFileName | The file name with wildcard characters under the specified folderPath/wildcardFolderPath to filter source files. <br>Allowed wildcards are `*` (matches zero or more characters) and `?` (matches zero or a single character); use `^` to escape if your actual file name has wildcard or this escape char inside.  For more examples, see [Folder and file filter examples](#folder-and-file-filter-examples). | Yes |
| OPTION 3: a list of files<br>- fileListPath | Indicates to copy a specified file set. Point to a text file that includes a list of files you want to copy (one file per line, with the relative path to the path configured in the dataset).<br/>When you use this option, don't specify the file name in the dataset. For more examples, see [File list examples](#file-list-examples). |No |
| ***Additional settings*** |  | |
| recursive | Indicates whether the data is read recursively from the subfolders or only from the specified folder. When recursive is set to true and the sink is a file-based store, an empty folder or subfolder isn't copied or created at the sink. <br>Allowed values are *true* (default) and *false*.<br>This property doesn't apply when you configure `fileListPath`. |No |
| deleteFilesAfterCompletion | Indicates whether the binary files will be deleted from source store after successfully moving to the destination store. The file deletion is per file, so when copy activity fails, you will see some files have already been copied to the destination and deleted from source, while others are still remaining on source store. <br/>This property is only valid in binary files copy scenario. The default value: false. |No |
| modifiedDatetimeStart    | Files are filtered based on the attribute *Last Modified*. <br>The files are selected if their last modified time is greater than or equal to `modifiedDatetimeStart` and less than `modifiedDatetimeEnd`. The time is applied to the UTC time zone in the format of *2018-12-01T05:00:00Z*. <br> The properties can be NULL, which means that no file attribute filter is applied to the dataset.  When `modifiedDatetimeStart` has a datetime value but `modifiedDatetimeEnd` is NULL, it means that the files whose last modified attribute is greater than or equal to the datetime value are selected.  When `modifiedDatetimeEnd` has a datetime value but `modifiedDatetimeStart` is NULL, it means that the files whose last modified attribute is less than the datetime value are selected.<br/>This property doesn't apply when you configure `fileListPath`. | No                                            |
| modifiedDatetimeEnd      | Same as above.                                               | No                                            |
| enablePartitionDiscovery | For files that are partitioned, specify whether to parse the partitions from the file path and add them as additional source columns.<br/>Allowed values are **false** (default) and **true**. | No                                            |
| partitionRootPath | When partition discovery is enabled, specify the absolute root path in order to read partitioned folders as data columns.<br/><br/>If it is not specified, by default,<br/>- When you use file path in dataset or list of files on source, partition root path is the path configured in dataset.<br/>- When you use wildcard folder filter, partition root path is the sub-path before the first wildcard.<br/><br/>For example, assuming you configure the path in dataset as "root/folder/year=2020/month=08/day=27":<br/>- If you specify partition root path as "root/folder/year=2020", copy activity will generate two more columns `month` and `day` with value "08" and "27" respectively, in addition to the columns inside the files.<br/>- If partition root path is not specified, no extra column will be generated. | No                                            |
| maxConcurrentConnections | The upper limit of concurrent connections established to the data store during the activity run. Specify a value only when you want to limit concurrent connections.| No                                            |
| disableChunking | When copying data from SFTP, the service tries to get the file length first, then divide the file into multiple parts and read them in parallel. Specify whether your SFTP server supports getting file length or seeking to read from a certain offset. <br/>Allowed values are **false** (default), **true**. | No |

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
                    "wildcardFileName": "*.csv",
                    "disableChunking": false
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

[!INCLUDE [data-factory-v2-file-sink-formats](includes/data-factory-v2-file-sink-formats.md)]

The following properties are supported for SFTP under `storeSettings` settings in a format-based Copy sink:

| Property                 | Description                                                  | Required |
| ------------------------ | ------------------------------------------------------------ | -------- |
| type                     | The *type* property under `storeSettings` must be set to *SftpWriteSettings*. | Yes      |
| copyBehavior             | Defines the copy behavior when the source is files from a file-based data store.<br/><br/>Allowed values are:<br/><b>- PreserveHierarchy (default)</b>: Preserves the file hierarchy in the target folder. The relative path of the source file to the source folder is identical to the relative path of the target file to the target folder.<br/><b>- FlattenHierarchy</b>: All files from the source folder are in the first level of the target folder. The target files have autogenerated names. <br/><b>- MergeFiles</b>: Merges all files from the source folder to one file. If the file name is specified, the merged file name is the specified name. Otherwise, it's an autogenerated file name. | No       |
| maxConcurrentConnections | The upper limit of concurrent connections established to the data store during the activity run. Specify a value only when you want to limit concurrent connections. | No       |
| useTempFileRename | Indicate whether to upload to temporary files and rename them, or directly write to the target folder or file location. By default, the service first writes to temporary files and then renames them when the upload is finished. This sequence helps to (1) avoid conflicts that might result in a corrupted file if you have other processes writing to the same file, and (2) ensure that the original version of the file exists during the transfer. If your SFTP server doesn't support a rename operation, disable this option and make sure that you don't have a concurrent write to the target file. For more information, see the troubleshooting tip at the end of this table. | No. Default value is *true*. |
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

## Mapping data flow properties

When you're transforming data in mapping data flows, you can read and write files from SFTP in the following formats:

- [Avro](format-avro.md#mapping-data-flow-properties)
- [Delimited text](format-delimited-text.md#mapping-data-flow-properties)
- [Excel](format-excel.md#mapping-data-flow-properties)
- [JSON](format-json.md#mapping-data-flow-properties)
- [ORC](format-orc.md#mapping-data-flow-properties)
- [Parquet](format-parquet.md#mapping-data-flow-properties)
- [XML](format-xml.md#mapping-data-flow-properties)

Format specific settings are located in the documentation for that format. For more information, see [Source transformation in mapping data flow](data-flow-source.md) and [Sink transformation in mapping data flow](data-flow-sink.md).

> [!Note]
> SSH host key validation is not supported in mapping data flow now.

> [!Note]
> To access on premise SFTP sever, you need to use Azure Data Factory or Synapse workspace [Managed Virtual Network](managed-virtual-network-private-endpoint.md) using a private endpoint. Refer to this [tutorial](tutorial-managed-virtual-network-on-premise-sql-server.md) for detailed steps. 

### Source transformation

The below table lists the properties supported by SFTP source. You can edit these properties in the **Source options** tab. When using inline dataset, you will see additional settings, which are the same as the properties described in [dataset properties](#dataset-properties) section. 

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Wildcard path | Using a wildcard pattern will instruct ADF to loop through each matching folder and file in a single source transformation. This is an effective way to process multiple files within a single flow. | No | String[] | wildcardPaths  |
| Partition Root Path | If you have partitioned folders in your file source with  a ```key=value``` format (for example, `year=2019`), then you can assign the top level of that partition folder tree to a column name in your data flow data stream.  | No | String | partitionRootPath  |
| Allow no files found |If true, an error is not thrown if no files are found. | No | `true` or `false` | ignoreNoFilesFound  |
| List of files |This is a file set. Create a text file that includes a list of relative path files to process. Point to this text file.  | No | `true` or `false` | fileList  |
| Column to store file name | Store the name of the source file in a column in your data. Enter a new column name here to store the file name string.  | No | String | rowUrlColumn |
| After completion | Choose to do nothing with the source file after the data flow runs, delete the source file, or move the source file. The paths for the move are relative. | No | Delete: `true` or `false` <br> Move: `['<from>', '<to>']` | purgeFiles<br/>moveFiles |
| Filter by last modified | You can filter which files you process by specifying a date range of when they were last modified. All date-times are in UTC. | No | Timestamp | modifiedAfter<br/> modifiedBefore |

#### SFTP source script example

When you use SFTP dataset as source type, the associated data flow script is:

```
source(allowSchemaDrift: true,
	validateSchema: false,
	ignoreNoFilesFound: true,
	purgeFiles: true,
	fileList: true,
	modifiedAfter: (toTimestamp(1647388800000L)),
	modifiedBefore: (toTimestamp(1647561600000L)),
	partitionRootPath: 'partdata',
	wildcardPaths:['partdata/**/*.csv']) ~> SFTPSource
```

### Sink transformation

The below table lists the properties supported by SFTP sink. You can edit these properties in the **Settings** tab. When using inline dataset, you will see additional settings, which are the same as the properties described in [dataset properties](#dataset-properties) section. 

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Clear the folder |Determines whether or not the destination folder gets cleared before the data is written. | No | `true` or `false` | truncate |
| File name option | The naming format of the data written. By default, one file per partition in format `part-#####-tid-<guid>`. | No | Pattern: String <br> Per partition: String[] <br> Name file as column data: String <br> Name folder as column data: String <br>Output to single file: `['<fileName>']`  | filePattern <br> partitionFileNames <br> rowUrlColumn <br> rowFolderUrlColumn<br> partitionFileNames |
| Quote all | Determines whether to enclose all values in quotes. | No | `true` or `false` | quoteAll |

#### SFTP sink script example

When you use SFTP dataset as sink type, the associated data flow script is:

```
IncomingStream sink(allowSchemaDrift: true,
	validateSchema: false,
	filePattern:'loans[n].csv',
	truncate: true,
	skipDuplicateMapInputs: true,
	skipDuplicateMapOutputs: true) ~> SFTPSink
```

## Lookup activity properties

For information about Lookup activity properties, see [Lookup activity](control-flow-lookup-activity.md).

## GetMetadata activity properties

For information about GetMetadata activity properties, see [GetMetadata activity](control-flow-get-metadata-activity.md). 

## Delete activity properties

For information about Delete activity properties, see [Delete activity](delete-activity.md).

## Legacy models

>[!NOTE]
>The following models are still supported as is for backward compatibility. We recommend that you use the previously discussed new model, because the authoring UI has switched to generating the new model.

### Legacy dataset model

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The *type* property of the dataset must be set to *FileShare*. |Yes |
| folderPath | The path to the folder. A wildcard filter is supported. Allowed wildcards are `*` (matches zero or more characters) and `?` (matches zero or a single character); use `^` to escape if your actual file name has a wildcard or this escape char inside. <br/><br/>Examples: rootfolder/subfolder/, see more examples in [Folder and file filter examples](#folder-and-file-filter-examples). |Yes |
| fileName |  **Name or wildcard filter** for the files under the specified "folderPath". If you don't specify a value for this property, the dataset points to all files in the folder. <br/><br/>For filter, the allowed wildcards are `*` (matches zero or more characters) and `?` (matches zero or a single character).<br/>- Example 1: `"fileName": "*.csv"`<br/>- Example 2: `"fileName": "???20180427.txt"`<br/>Use `^` to escape if your actual folder name has wildcard or this escape char inside. |No |
| modifiedDatetimeStart | Files are filtered based on the attribute *Last Modified*. The files are selected if their last modified time is greater than or equal to `modifiedDatetimeStart` and less than `modifiedDatetimeEnd`. The time is applied to UTC time zone in the format of *2018-12-01T05:00:00Z*. <br/><br/> The overall performance of data movement will be affected by enabling this setting when you want to do file filter from large numbers of files. <br/><br/> The properties can be NULL, which means that no file attribute filter is applied to the dataset.  When `modifiedDatetimeStart` has a datetime value but `modifiedDatetimeEnd` is NULL, it means that the files whose last modified attribute is greater than or equal to the datetime value are selected.  When `modifiedDatetimeEnd` has a datetime value but `modifiedDatetimeStart` is NULL, it means that the files whose last modified attribute is less than the datetime value are selected.| No |
| modifiedDatetimeEnd | Files are filtered based on the attribute *Last Modified*. The files are selected if their last modified time is greater than or equal to `modifiedDatetimeStart` and less than `modifiedDatetimeEnd`. The time is applied to UTC time zone in the format of *2018-12-01T05:00:00Z*. <br/><br/> The overall performance of data movement will be affected by enabling this setting when you want to do file filter from large numbers of files. <br/><br/> The properties can be NULL, which means that no file attribute filter is applied to the dataset.  When `modifiedDatetimeStart` has a datetime value but `modifiedDatetimeEnd` is NULL, it means that the files whose last modified attribute is greater than or equal to the datetime value are selected.  When `modifiedDatetimeEnd` has a datetime value but `modifiedDatetimeStart` is NULL, it means that the files whose last modified attribute is less than the datetime value are selected.| No |
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
| maxConcurrentConnections |The upper limit of concurrent connections established to the data store during the activity run. Specify a value only when you want to limit concurrent connections.| No |

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
For a list of data stores that are supported as sources and sinks by the Copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
