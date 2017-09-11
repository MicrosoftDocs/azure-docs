---
title: Copy data from SFTP server using Azure Data Factory | Microsoft Docs
description: Learn about MySQL connector in Azure Data Factory that lets you copy data from an SFTP server to a data store supported as a sink.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/30/2017
ms.author: jingwang

---
# Copy data from SFTP server using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1 - GA](v1/data-factory-sftp-connector.md)
> * [Version 2 - Preview](connector-sftp.md)

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from an SFTP server. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [SFTP connector in V1](v1/data-factory-sftp-connector.md).

## Supported scenarios

You can copy data from SFTP server to any supported sink data store. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this SFTP connector supports:

- Copying files using **Basic** or **SshPublicKey** authentication.
- Copying files as-is or parsing files with the [supported file formats and compression codecs](supported-file-formats-and-compression-codecs.md).

## Get started
You can create a pipeline with copy activity using .NET SDK, Python SDK, Azure PowerShell, REST API, or Azure Resource Manager template. See [Copy activity tutorial](quickstart-create-data-factory-dot-net.md) for step-by-step instructions to create a pipeline with a copy activity.

The following sections provide details about properties that are used to define Data Factory entities specific to SFTP.

## Linked service properties

The following properties are supported for SFTP linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Sftp**. |Yes |
| host | Name or IP address of the SFTP server. |Yes |
| port | Port on which the SFTP server is listening.<br/>Allowed values are: integer, defualt value is **22**. |No |
| skipHostKeyValidation | Specify whether to skip host key validation.<br/>Allowed values are: **true**, **false** (default).  | No |
| hostKeyFingerprint | Specify the finger print of the host key. | Yes if the "skipHostKeyValidation" is set to false.  |
| authenticationType | Specify authentication type.<br/>Allowed values are: **Basic**, **SshPublicKey**. Refer to [Using basic authentication](#using-basic-authentication) and [Using SSH public key authentication](#using-ssh-public-key-authentication) sections on more properties and JSON samples respectively. |Yes |

### Using basic authentication

To use basic authentication, set "authenticationType" property to **Basic**, and specify the following properties besides the SFTP connector generic ones introduced in the last section:

| Property | Description | Required |
|:--- |:--- |:--- |
| username | User who has access to the SFTP server. |Yes |
| password | Password for the user (username). | Yes |

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
            "username": "<username>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
            }
        }
    }
}
```

### Using SSH public key authentication

To use SSH public key authentication, set "authenticationType" property as **SshPublicKey**, and specify the following properties besides the SFTP connector generic ones introduced in the last section:

| Property | Description | Required |
|:--- |:--- |:--- |
| username | User who has access to the SFTP server |Yes |
| privateKeyPath | Specify absolute path to the private key file that Integration Runtime can access. Applies only when self-hosted type of Integration Runtime is specified in "connectVia". | Specify either the `privateKeyPath` or `privateKeyContent`.  |
| privateKeyContent | Base64 encoded SSH private key content. SSH private key should be OpenSSH format. | Specify either the `privateKeyPath` or `privateKeyContent`. |
| passPhrase | Specify the pass phrase/password to decrypt the private key if the key file is protected by a pass phrase. | Yes if the private key file is protected by a pass phrase. |

> [!NOTE]
> SFTP connector supports only OpenSSH key. Make sure your key file is in the proper format. You can use Putty tool to convert from .ppk to OpenSSH format.

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
            "username": "xxx",
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
    "properties": {
        "type": "Sftp",
        "typeProperties": {
            "host": "<sftp server>",
            "port": 22,
            "skipHostKeyValidation": true,
            "authenticationType": "SshPublicKey",
            "username": "<username>",
            "privateKeyContent": {
                "type": "SecureString",
                "value": "<base64 string of the private key content>"
            },
            "passPhrase": {
                "type": "SecureString",
                "value": "<pass phrase>"
            }
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by SFTP dataset.

To copy data from SFTP, set the type property of the dataset to **FileShare**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **FileShare** |Yes |
| folderPath | Path to the folder. For example: folder/subfolder/ |Yes |
| fileName | Specify the name of the file in the **folderPath** if you want to copy from a specific file. If you do not specify any value for this property, the dataset points to all files in the folder as source. |No |
| fileFilter | Specify a filter to be used to select a subset of files in the folderPath rather than all files. Applies only when fileName is not specified. <br/><br/>Allowed wildcards are: `*` (multiple characters) and `?` (single character).<br/>- Example 1: `"fileFilter": "*.log"`<br/>- Example 2: `"fileFilter": 2017-09-??.txt"` |No |
| format | If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions.<br/><br/>If you want to parse files with a specific format, the following file format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](supported-file-formats-and-compression-codecs.md#text-format), [Json Format](supported-file-formats-and-compression-codecs.md#json-format), [Avro Format](supported-file-formats-and-compression-codecs.md#avro-format), [Orc Format](supported-file-formats-and-compression-codecs.md#orc-format), and [Parquet Format](supported-file-formats-and-compression-codecs.md#parquet-format) sections. |No (only for binary copy scenario) |
| compression | Specify the type and level of compression for the data. For more information, see [Supported file formats and compression codecs](supported-file-formats-and-compression-codecs.md#compression-support).<br/>Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**.<br/>Supported levels are: **Optimal** and **Fastest**. |No |

**Example:**

```json
{
    "name": "SFTPDataset",
    "properties": {
        "type": "FileShare",
        "linkedServiceName":{
            "referenceName": "<SFTP linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "folderPath": "folder/subfolder/",
            "fileName": "myfile.csv.gz",
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

To copy data from SFTP, set the source type in the copy activity to **FileSystemSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **FileSystemSource** |Yes |
| recursive | Indicates whether the data is read recursively from the sub folders or only from the specified folder.<br/>Allowed values are: **true** (default), **false** | No |

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
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md##supported-data-stores-and-formats).