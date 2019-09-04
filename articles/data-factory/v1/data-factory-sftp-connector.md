---
title: Move data from SFTP server using Azure Data Factory | Microsoft Docs
description: Learn about how to move data from an on-premises or a cloud SFTP server using Azure Data Factory.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg


ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 02/12/2018
ms.author: jingwang

robots: noindex
---
# Move data from an SFTP server using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](data-factory-sftp-connector.md)
> * [Version 2 (current version)](../connector-sftp.md)

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [SFTPconnector in V2](../connector-sftp.md).

This article outlines how to use the Copy Activity in Azure Data Factory to move data from an on-premises/cloud SFTP server to a supported sink data store. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article that presents a general overview of data movement with copy activity and the list of data stores supported as sources/sinks.

Data factory currently supports only moving data from an SFTP server to other data stores, but not for moving data from other data stores to an SFTP server. It supports both on-premises and cloud SFTP servers.

> [!NOTE]
> Copy Activity does not delete the source file after it is successfully copied to the destination. If you need to delete the source file after a successful copy, create a custom activity to delete the file and use the activity in the pipeline.

## Supported scenarios and authentication types
You can use this SFTP connector to copy data from **both cloud SFTP servers and on-premises SFTP servers**. **Basic** and **SshPublicKey** authentication types are supported when connecting to the SFTP server.

When copying data from an on-premises SFTP server, you need install a Data Management Gateway in the on-premises environment/Azure VM. See [Data Management Gateway](data-factory-data-management-gateway.md) for details on the gateway. See [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article for step-by-step instructions on setting up the gateway and using it.

## Getting started
You can create a pipeline with a copy activity that moves data from an SFTP source by using different tools/APIs.

- The easiest way to create a pipeline is to use the **Copy Wizard**. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough on creating a pipeline using the Copy data wizard.

- You can also use the following tools to create a pipeline: **Visual Studio**, **Azure PowerShell**, **Azure Resource Manager template**, **.NET API**, and **REST API**. See [Copy activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for step-by-step instructions to create a pipeline with a copy activity. For JSON samples to copy data from SFTP server to Azure Blob Storage, see [JSON Example: Copy data from SFTP server to Azure blob](#json-example-copy-data-from-sftp-server-to-azure-blob) section of this article.

## Linked service properties
The following table provides description for JSON elements specific to FTP linked service.

| Property | Description | Required |
| --- | --- | --- |
| type | The type property must be set to `Sftp`. |Yes |
| host | Name or IP address of the SFTP server. |Yes |
| port |Port on which the SFTP server is listening. The default value is: 21 |No |
| authenticationType |Specify authentication type. Allowed values: **Basic**, **SshPublicKey**. <br><br> Refer to [Using basic authentication](#using-basic-authentication) and [Using SSH public key authentication](#using-ssh-public-key-authentication) sections on more properties and JSON samples respectively. |Yes |
| skipHostKeyValidation | Specify whether to skip host key validation. | No. The default value: false |
| hostKeyFingerprint | Specify the finger print of the host key. | Yes if the `skipHostKeyValidation` is set to false.  |
| gatewayName |Name of the Data Management Gateway to connect to an on-premises SFTP server. | Yes if copying data from an on-premises SFTP server. |
| encryptedCredential | Encrypted credential to access the SFTP server. Auto-generated when you specify basic authentication (username + password) or SshPublicKey authentication (username + private key path or content) in copy wizard or the ClickOnce popup dialog. | No. Apply only when copying data from an on-premises SFTP server. |

### Using basic authentication

To use basic authentication, set `authenticationType` as `Basic`, and specify the following properties besides the SFTP connector generic ones introduced in the last section:

| Property | Description | Required |
| --- | --- | --- |
| username | User who has access to the SFTP server. |Yes |
| password | Password for the user (username). | Yes |

#### Example: Basic authentication
```json
{
    "name": "SftpLinkedService",
    "properties": {
        "type": "Sftp",
        "typeProperties": {
            "host": "mysftpserver",
            "port": 22,
            "authenticationType": "Basic",
            "username": "xxx",
            "password": "xxx",
            "skipHostKeyValidation": false,
            "hostKeyFingerPrint": "ssh-rsa 2048 xx:00:00:00:xx:00:x0:0x:0x:0x:0x:00:00:x0:x0:00",
            "gatewayName": "mygateway"
        }
    }
}
```

#### Example: Basic authentication with encrypted credential

```JSON
{
    "name": "SftpLinkedService",
    "properties": {
        "type": "Sftp",
        "typeProperties": {
            "host": "mysftpserver",
            "port": 22,
            "authenticationType": "Basic",
            "username": "xxx",
            "encryptedCredential": "xxxxxxxxxxxxxxxxx",
            "skipHostKeyValidation": false,
            "hostKeyFingerPrint": "ssh-rsa 2048 xx:00:00:00:xx:00:x0:0x:0x:0x:0x:00:00:x0:x0:00",
            "gatewayName": "mygateway"
        }
      }
}
```

### Using SSH public key authentication

To use SSH public key authentication, set `authenticationType` as `SshPublicKey`, and specify the following properties besides the SFTP connector generic ones introduced in the last section:

| Property | Description | Required |
| --- | --- | --- |
| username |User who has access to the SFTP server |Yes |
| privateKeyPath | Specify absolute path to the private key file that gateway can access. | Specify either the `privateKeyPath` or `privateKeyContent`. <br><br> Apply only when copying data from an on-premises SFTP server. |
| privateKeyContent | A serialized string of the private key content. The Copy Wizard can read the private key file and extract the private key content automatically. If you are using any other tool/SDK, use the privateKeyPath property instead. | Specify either the `privateKeyPath` or `privateKeyContent`. |
| passPhrase | Specify the pass phrase/password to decrypt the private key if the key file is protected by a pass phrase. | Yes if the private key file is protected by a pass phrase. |

> [!NOTE]
> SFTP connector supports RSA/DSA OpenSSH key. Make sure your key file content starts with "-----BEGIN [RSA/DSA] PRIVATE KEY-----". If the private key file is a ppk-format file, please use Putty tool to convert from .ppk to OpenSSH format.

#### Example: SshPublicKey authentication using private key filePath

```json
{
    "name": "SftpLinkedServiceWithPrivateKeyPath",
    "properties": {
        "type": "Sftp",
        "typeProperties": {
            "host": "mysftpserver",
            "port": 22,
            "authenticationType": "SshPublicKey",
            "username": "xxx",
            "privateKeyPath": "D:\\privatekey_openssh",
            "passPhrase": "xxx",
            "skipHostKeyValidation": true,
            "gatewayName": "mygateway"
        }
    }
}
```

#### Example: SshPublicKey authentication using private key content

```json
{
    "name": "SftpLinkedServiceWithPrivateKeyContent",
    "properties": {
        "type": "Sftp",
        "typeProperties": {
            "host": "mysftpserver.westus.cloudapp.azure.com",
            "port": 22,
            "authenticationType": "SshPublicKey",
            "username": "xxx",
            "privateKeyContent": "<base64 string of the private key content>",
            "passPhrase": "xxx",
            "skipHostKeyValidation": true
        }
    }
}
```

## Dataset properties
For a full list of sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections such as structure, availability, and policy of a dataset JSON are similar for all dataset types.

The **typeProperties** section is different for each type of dataset. It provides information that is specific to the dataset type. The typeProperties section for a dataset of type **FileShare** dataset has the following properties:

| Property | Description | Required |
| --- | --- | --- |
| folderPath |Sub path to the folder. Use escape character ‘ \ ’ for special characters in the string. See Sample linked service and dataset definitions for examples.<br/><br/>You can combine this property with **partitionBy** to have folder paths based on slice start/end date-times. |Yes |
| fileName |Specify the name of the file in the **folderPath** if you want the table to refer to a specific file in the folder. If you do not specify any value for this property, the table points to all files in the folder.<br/><br/>When fileName is not specified for an output dataset, the name of the generated file would be in the following this format: <br/><br/>`Data.<Guid>.txt` (Example: Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt |No |
| fileFilter |Specify a filter to be used to select a subset of files in the folderPath rather than all files.<br/><br/>Allowed values are: `*` (multiple characters) and `?` (single character).<br/><br/>Examples 1: `"fileFilter": "*.log"`<br/>Example 2: `"fileFilter": 2014-1-?.txt"`<br/><br/> fileFilter is applicable for an input FileShare dataset. This property is not supported with HDFS. |No |
| partitionedBy |partitionedBy can be used to specify a dynamic folderPath, filename for time series data. For example, folderPath parameterized for every hour of data. |No |
| format | The following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](data-factory-supported-file-and-compression-formats.md#text-format), [Json Format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro Format](data-factory-supported-file-and-compression-formats.md#avro-format), [Orc Format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections. <br><br> If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions. |No |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**. Supported levels are: **Optimal** and **Fastest**. For more information, see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No |
| useBinaryTransfer |Specify whether use Binary transfer mode. True for binary mode and false ASCII. Default value: True. This property can only be used when associated linked service type is of type: FtpServer. |No |

> [!NOTE]
> filename and fileFilter cannot be used simultaneously.

### Using partionedBy property
As mentioned in the previous section, you can specify a dynamic folderPath, filename for time series data with partitionedBy. You can do so with the Data Factory macros and the system variable SliceStart, SliceEnd that indicate the logical time period for a given data slice.

To learn about time series datasets, scheduling, and slices, See [Creating Datasets](data-factory-create-datasets.md), [Scheduling & Execution](data-factory-scheduling-and-execution.md), and [Creating Pipelines](data-factory-create-pipelines.md) articles.

#### Sample 1:

```json
"folderPath": "wikidatagateway/wikisampledataout/{Slice}",
"partitionedBy":
[
    { "name": "Slice", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyyMMddHH" } },
],
```
In this example {Slice} is replaced with the value of Data Factory system variable SliceStart in the format (YYYYMMDDHH) specified. The SliceStart refers to start time of the slice. The folderPath is different for each slice. Example: wikidatagateway/wikisampledataout/2014100103 or wikidatagateway/wikisampledataout/2014100104.

#### Sample 2:

```json
"folderPath": "wikidatagateway/wikisampledataout/{Year}/{Month}/{Day}",
"fileName": "{Hour}.csv",
"partitionedBy":
[
    { "name": "Year", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyy" } },
    { "name": "Month", "value": { "type": "DateTime", "date": "SliceStart", "format": "MM" } },
    { "name": "Day", "value": { "type": "DateTime", "date": "SliceStart", "format": "dd" } },
    { "name": "Hour", "value": { "type": "DateTime", "date": "SliceStart", "format": "hh" } }
],
```
In this example, year, month, day, and time of SliceStart are extracted into separate variables that are used by folderPath and fileName properties.

## Copy activity properties
For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties such as name, description, input and output tables, and policies are available for all types of activities.

Whereas, the properties available in the typeProperties section of the activity vary with each activity type. For Copy activity, the type properties vary depending on the types of sources and sinks.

[!INCLUDE [data-factory-file-system-source](../../../includes/data-factory-file-system-source.md)]

## Supported file and compression formats
See [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md) article on details.

## JSON Example: Copy data from SFTP server to Azure blob
The following example provides sample JSON definitions that you can use to create a pipeline by using [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md). They show how to copy data from SFTP source to Azure Blob Storage. However, data can be copied **directly** from any of sources to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores-and-formats) using the Copy Activity in Azure Data Factory.

> [!IMPORTANT]
> This sample provides JSON snippets. It does not include step-by-step instructions for creating the data factory. See [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article for step-by-step instructions.

The sample has the following data factory entities:

* A linked service of type [sftp](#linked-service-properties).
* A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#linked-service-properties).
* An input [dataset](data-factory-create-datasets.md) of type [FileShare](#dataset-properties).
* An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#dataset-properties).
* A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [FileSystemSource](#copy-activity-properties) and [BlobSink](data-factory-azure-blob-connector.md#copy-activity-properties).

The sample copies data from an SFTP server to an Azure blob every hour. The JSON properties used in these samples are described in sections following the samples.

**SFTP linked service**

This example uses the basic authentication with user name and password in plain text. You can also use one of the following ways:

* Basic authentication with encrypted credentials
* SSH public key authentication

See [FTP linked service](#linked-service-properties) section for different types of authentication you can use.

```JSON

{
    "name": "SftpLinkedService",
    "properties": {
        "type": "Sftp",
        "typeProperties": {
            "host": "mysftpserver",
            "port": 22,
            "authenticationType": "Basic",
            "username": "myuser",
            "password": "mypassword",
            "skipHostKeyValidation": false,
            "hostKeyFingerPrint": "ssh-rsa 2048 xx:00:00:00:xx:00:x0:0x:0x:0x:0x:00:00:x0:x0:00",
            "gatewayName": "mygateway"
        }
    }
}
```
**Azure Storage linked service**

```JSON
{
  "name": "AzureStorageLinkedService",
  "properties": {
    "type": "AzureStorage",
    "typeProperties": {
      "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
    }
  }
}
```
**SFTP input dataset**

This dataset refers to the SFTP folder `mysharedfolder` and file `test.csv`. The pipeline copies the file to the destination.

Setting "external": "true" informs the Data Factory service that the dataset is external to the data factory and is not produced by an activity in the data factory.

```JSON
{
  "name": "SFTPFileInput",
  "properties": {
    "type": "FileShare",
    "linkedServiceName": "SftpLinkedService",
    "typeProperties": {
      "folderPath": "mysharedfolder",
      "fileName": "test.csv"
    },
    "external": true,
    "availability": {
      "frequency": "Hour",
      "interval": 1
    }
  }
}
```

**Azure Blob output dataset**

Data is written to a new blob every hour (frequency: hour, interval: 1). The folder path for the blob is dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, day, and hours parts of the start time.

```JSON
{
    "name": "AzureBlobOutput",
    "properties": {
        "type": "AzureBlob",
        "linkedServiceName": "AzureStorageLinkedService",
        "typeProperties": {
            "folderPath": "mycontainer/sftp/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}",
            "format": {
                "type": "TextFormat",
                "rowDelimiter": "\n",
                "columnDelimiter": "\t"
            },
            "partitionedBy": [
                {
                    "name": "Year",
                    "value": {
                        "type": "DateTime",
                        "date": "SliceStart",
                        "format": "yyyy"
                    }
                },
                {
                    "name": "Month",
                    "value": {
                        "type": "DateTime",
                        "date": "SliceStart",
                        "format": "MM"
                    }
                },
                {
                    "name": "Day",
                    "value": {
                        "type": "DateTime",
                        "date": "SliceStart",
                        "format": "dd"
                    }
                },
                {
                    "name": "Hour",
                    "value": {
                        "type": "DateTime",
                        "date": "SliceStart",
                        "format": "HH"
                    }
                }
            ]
        },
        "availability": {
            "frequency": "Hour",
            "interval": 1
        }
    }
}
```

**Pipeline with Copy activity**

The pipeline contains a Copy Activity that is configured to use the input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **FileSystemSource** and **sink** type is set to **BlobSink**.

```JSON
{
    "name": "pipeline",
    "properties": {
        "activities": [{
            "name": "SFTPToBlobCopy",
            "inputs": [{
                "name": "SFTPFileInput"
            }],
            "outputs": [{
                "name": "AzureBlobOutput"
            }],
            "type": "Copy",
            "typeProperties": {
                "source": {
                    "type": "FileSystemSource"
                },
                "sink": {
                    "type": "BlobSink"
                }
            },
            "scheduler": {
                "frequency": "Hour",
                "interval": 1
            },
            "policy": {
                "concurrency": 1,
                "executionPriorityOrder": "NewestFirst",
                "retry": 1,
                "timeout": "00:05:00"
            }
        }],
        "start": "2017-02-20T18:00:00Z",
        "end": "2017-02-20T19:00:00Z"
    }
}
```

## Performance and Tuning
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.

## Next Steps
See the following articles:

* [Copy Activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for step-by-step instructions for creating a pipeline with a Copy Activity.
