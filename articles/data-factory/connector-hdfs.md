---
title: Copy data from HDFS using Azure Data Factory  | Microsoft Docs
description: Learn how to copy data from a cloud or on-premises HDFS source to supported sink data stores by using a copy activity in an Azure Data Factory pipeline.
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
# Copy data from HDFS using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-hdfs-connector.md)
> * [Current version](connector-hdfs.md)

This article outlines how to copy data from HDFS server. To learn about Azure Data Factory, read the [introductory article](introduction.md).

## Supported capabilities

This HDFS connector is supported for the following activities:

- [Copy activity](copy-activity-overview.md) with [supported source/sink matrix](copy-activity-overview.md)
- [Lookup activity](control-flow-lookup-activity.md)

Specifically, this HDFS connector supports:

- Copying files using **Windows** (Kerberos) or **Anonymous** authentication.
- Copying files using **webhdfs** protocol or **built-in DistCp** support.
- Copying files as-is or parsing/generating files with the [supported file formats and compression codecs](supported-file-formats-and-compression-codecs.md).

## Prerequisites

To copy data from an HDFS that is not publicly accessible, you need to set up a Self-hosted Integration Runtime. See [Self-hosted Integration Runtime](concepts-integration-runtime.md) article to learn details.

> [!NOTE]
> Make sure the Integration Runtime can access to **ALL** the [name node server]:[name node port] and [data node servers]:[data node port] of the Hadoop cluster. Default [name node port] is 50070, and default [data node port] is 50075.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to HDFS.

## Linked service properties

The following properties are supported for HDFS linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Hdfs**. | Yes |
| url |URL to the HDFS |Yes |
| authenticationType | Allowed values are: **Anonymous**, or **Windows**. <br><br> To use **Kerberos authentication** for HDFS connector, refer to [this section](#use-kerberos-authentication-for-hdfs-connector) to set up your on-premises environment accordingly. |Yes |
| userName |Username for Windows authentication. For Kerberos authentication, specify `<username>@<domain>.com`. |Yes (for Windows Authentication) |
| password |Password for Windows authentication. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |Yes (for Windows Authentication) |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Self-hosted Integration Runtime or Azure Integration Runtime (if your data store is publicly accessible). If not specified, it uses the default Azure Integration Runtime. |No |

**Example: using Anonymous authentication**

```json
{
    "name": "HDFSLinkedService",
    "properties": {
        "type": "Hdfs",
        "typeProperties": {
            "url" : "http://<machine>:50070/webhdfs/v1/",
            "authenticationType": "Anonymous",
            "userName": "hadoop"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

**Example: using Windows authentication**

```json
{
    "name": "HDFSLinkedService",
    "properties": {
        "type": "Hdfs",
        "typeProperties": {
            "url" : "http://<machine>:50070/webhdfs/v1/",
            "authenticationType": "Windows",
            "userName": "<username>@<domain>.com (for Kerberos auth)",
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

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. 

- For **Parquet and delimited text format**, refer to [Parquet and delimited text format dataset](#parquet-and-delimited-text-format-dataset) section.
- For other formats like **ORC/Avro/JSON/Binary format**, refer to [Other format dataset](#other-format-dataset) section.

### Parquet and delimited text format dataset

To copy data from HDFS in **Parquet or delimited text format**, refer to [Parquet format](format-parquet.md) and [Delimited text format](format-delimited-text.md) article on format-based dataset and supported settings. The following properties are supported for HDFS under `location` settings in format-based dataset:

| Property   | Description                                                  | Required |
| ---------- | ------------------------------------------------------------ | -------- |
| type       | The type property under `location` in dataset must be set to **HdfsLocation**. | Yes      |
| folderPath | The path to folder. If you want to use wildcard to filter folder, skip this setting and specify in activity source settings. | No       |
| fileName   | The file name under the given folderPath. If you want to use wildcard to filter files, skip this setting and specify in activity source settings. | No       |

> [!NOTE]
> **FileShare** type dataset with Parquet/Text format mentioned in next section is still supported as-is for Copy/Lookup activity for backward compatibility. You are suggested to use this new model going forward, and the ADF authoring UI has switched to generating these new types.

**Example:**

```json
{
    "name": "DelimitedTextDataset",
    "properties": {
        "type": "DelimitedText",
        "linkedServiceName": {
            "referenceName": "<HDFS linked service name>",
            "type": "LinkedServiceReference"
        },
        "schema": [ < physical schema, optional, auto retrieved during authoring > ],
        "typeProperties": {
            "location": {
                "type": "HdfsLocation",
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

To copy data from HDFS in **ORC/Avro/JSON/Binary format**, the following properties are supported:

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

**Example:**

```json
{
    "name": "HDFSDataset",
    "properties": {
        "type": "FileShare",
        "linkedServiceName":{
            "referenceName": "<HDFS linked service name>",
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

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by HDFS source.

### HDFS as source

- For copy from **Parquet and delimited text format**, refer to [Parquet and delimited text format source](#parquet-and-delimited-text-format-source) section.
- For copy from other formats like **ORC/Avro/JSON/Binary format**, refer to [Other format source](#other-format-source) section.

#### Parquet and delimited text format source

To copy data from HDFS in **Parquet or delimited text format**, refer to [Parquet format](format-parquet.md) and [Delimited text format](format-delimited-text.md) article on format-based copy activity source and supported settings. The following properties are supported for HDFS under `storeSettings` settings in format-based copy source:

| Property                 | Description                                                  | Required                                      |
| ------------------------ | ------------------------------------------------------------ | --------------------------------------------- |
| type                     | The type property under `storeSettings` must be set to **HdfsReadSetting**. | Yes                                           |
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
        "name": "CopyFromHDFS",
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
                    "type": "HdfsReadSetting",
                    "recursive": true
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

To copy data from HDFS in **ORC/Avro/JSON/Binary format**, the following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **HdfsSource** |Yes |
| recursive | Indicates whether the data is read recursively from the sub folders or only from the specified folder. Note when recursive is set to true and sink is file-based store, empty folder/sub-folder will not be copied/created at sink.<br/>Allowed values are: **true** (default), **false** | No |
| distcpSettings | Property group when using HDFS DistCp. | No |
| resourceManagerEndpoint | The Yarn Resource Manager endpoint | Yes if using DistCp |
| tempScriptPath | A folder path used to store temp DistCp command script. The script file is generated by Data Factory and will be removed after Copy job finished. | Yes if using DistCp |
| distcpOptions | Additional options provided to DistCp command. | No |
| maxConcurrentConnections | The number of the connections to connect to storage store concurrently. Specify only when you want to limit the concurrent connection to the data store. | No |

**Example: HDFS source in copy activity using DistCp**

```json
"source": {
    "type": "HdfsSource",
    "distcpSettings": {
        "resourceManagerEndpoint": "resourcemanagerendpoint:8088",
        "tempScriptPath": "/usr/hadoop/tempscript",
        "distcpOptions": "-m 100"
    }
}
```

Learn more on how to use DistCp to copy data from HDFS efficiently from the next section.

### Folder and file filter examples

This section describes the resulting behavior of the folder path and file name with wildcard filters.

| folderPath | fileName             | recursive | Source folder structure and filter result (files in **bold** are retrieved) |
| :--------- | :------------------- | :-------- | :----------------------------------------------------------- |
| `Folder*`  | (empty, use default) | false     | FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File2.json**<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3.csv<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5.csv<br/>AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |
| `Folder*`  | (empty, use default) | true      | FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File2.json**<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File3.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File4.json**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File5.csv**<br/>AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |
| `Folder*`  | `*.csv`              | false     | FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3.csv<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5.csv<br/>AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |
| `Folder*`  | `*.csv`              | true      | FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File3.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File5.csv**<br/>AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |

## Use DistCp to copy data from HDFS

[DistCp](https://hadoop.apache.org/docs/current3/hadoop-distcp/DistCp.html) is a Hadoop native command-line tool to do distributed copy in a Hadoop cluster. When run a Distcp command, it will first list all the files to be copied, create several Map jobs into the Hadoop cluster, and each Map job will do binary copy from source to sink.

Copy Activity support using DistCp to copy files as-is into Azure Blob (including [staged copy](copy-activity-performance.md)) or Azure Data Lake Store, in which case it can fully leverage your cluster's power instead of running on the Self-hosted Integration Runtime. It will provide better copy throughput especially if your cluster is very powerful. Based on your configuration in Azure Data Factory, Copy activity automatically construct a distcp command, submit to your Hadoop cluster, and monitor the copy status.

### Prerequisites

To use DistCp to copy files as-is from HDFS to Azure Blob (including staged copy) or Azure Data Lake Store, make sure your Hadoop cluster meets below requirements:

1. MapReduce and Yarn services are enabled.
2. Yarn version is 2.5 or above.
3. HDFS server is integrated with your target data store - Azure Blob or Azure Data Lake Store:

    - Azure Blob FileSystem is natively supported since Hadoop 2.7. You only need to specify jar path in Hadoop env config.
    - Azure Data Lake Store FileSystem is packaged starting from Hadoop 3.0.0-alpha1. If your Hadoop cluster is lower than that version, you need to manually import ADLS related jar packages (azure-datalake-store.jar) into cluster from [here](https://hadoop.apache.org/releases.html), and specify jar path in Hadoop env config.

4. Prepare a temp folder in HDFS. This temp folder is used to store DistCp shell script, so it will occupy KB-level space.
5. Make sure the user account provided in HDFS Linked Service have permission to a) submit application in Yarn; b) have the permission to create subfolder, read/write files under above temp folder.

### Configurations

See DistCp related configurations and examples in [HDFS as source](#hdfs-as-source) section.

## Use Kerberos authentication for HDFS connector

There are two options to set up the on-premises environment so as to use Kerberos Authentication in HDFS connector. You can choose the one better fits your case.
* Option 1: [Join Self-hosted Integration Runtime machine in Kerberos realm](#kerberos-join-realm)
* Option 2: [Enable mutual trust between Windows domain and Kerberos realm](#kerberos-mutual-trust)

### <a name="kerberos-join-realm"></a>Option 1: Join Self-hosted Integration Runtime machine in Kerberos realm

#### Requirements

* The Self-hosted Integration Runtime machine needs to join the Kerberos realm and can’t join any Windows domain.

#### How to configure

**On Self-hosted Integration Runtime machine:**

1.	Run the **Ksetup** utility to configure the Kerberos KDC server and realm.

    The machine must be configured as a member of a workgroup since a Kerberos realm is different from a Windows domain. This can be achieved by setting the Kerberos realm and adding a KDC server as follows. Replace *REALM.COM* with your own respective realm as needed.

            C:> Ksetup /setdomain REALM.COM
            C:> Ksetup /addkdc REALM.COM <your_kdc_server_address>

	**Restart** the machine after executing these 2 commands.

2.	Verify the configuration with **Ksetup** command. The output should be like:

            C:> Ksetup
            default realm = REALM.COM (external)
            REALM.com:
                kdc = <your_kdc_server_address>

**In Azure Data Factory:**

* Configure the HDFS connector using **Windows authentication** together with your Kerberos principal name and password to connect to the HDFS data source. Check [HDFS Linked Service properties](#linked-service-properties) section on configuration details.

### <a name="kerberos-mutual-trust"></a>Option 2: Enable mutual trust between Windows domain and Kerberos realm

#### Requirements

*	The Self-hosted Integration Runtime machine must join a Windows domain.
*	You need permission to update the domain controller's settings.

#### How to configure

> [!NOTE]
> Replace REALM.COM and AD.COM in the following tutorial with your own respective realm and domain controller as needed.

**On KDC server:**

1. Edit the KDC configuration in **krb5.conf** file to let KDC trust Windows Domain referring to the following configuration template. By default, the configuration is located at **/etc/krb5.conf**.

           [logging]
            default = FILE:/var/log/krb5libs.log
            kdc = FILE:/var/log/krb5kdc.log
            admin_server = FILE:/var/log/kadmind.log
            
           [libdefaults]
            default_realm = REALM.COM
            dns_lookup_realm = false
            dns_lookup_kdc = false
            ticket_lifetime = 24h
            renew_lifetime = 7d
            forwardable = true
            
           [realms]
            REALM.COM = {
             kdc = node.REALM.COM
             admin_server = node.REALM.COM
            }
           AD.COM = {
            kdc = windc.ad.com
            admin_server = windc.ad.com
           }
            
           [domain_realm]
            .REALM.COM = REALM.COM
            REALM.COM = REALM.COM
            .ad.com = AD.COM
            ad.com = AD.COM
            
           [capaths]
            AD.COM = {
             REALM.COM = .
            }

   **Restart** the KDC service after configuration.

2. Prepare a principal named **krbtgt/REALM.COM\@AD.COM** in KDC server with the following command:

           Kadmin> addprinc krbtgt/REALM.COM@AD.COM

3. In **hadoop.security.auth_to_local** HDFS service configuration file, add `RULE:[1:$1@$0](.*\@AD.COM)s/\@.*//`.

**On domain controller:**

1.	Run the following **Ksetup** commands to add a realm entry:

            C:> Ksetup /addkdc REALM.COM <your_kdc_server_address>
            C:> ksetup /addhosttorealmmap HDFS-service-FQDN REALM.COM

2.	Establish trust from Windows Domain to Kerberos Realm. [password] is the password for the principal **krbtgt/REALM.COM\@AD.COM**.

            C:> netdom trust REALM.COM /Domain: AD.COM /add /realm /passwordt:[password]

3.	Select encryption algorithm used in Kerberos.

    1. Go to Server Manager > Group Policy Management > Domain > Group Policy Objects > Default or Active Domain Policy, and Edit.

    2. In the **Group Policy Management Editor** popup window, go to Computer Configuration > Policies > Windows Settings > Security Settings > Local Policies > Security Options, and configure **Network security: Configure Encryption types allowed for Kerberos**.

    3. Select the encryption algorithm you want to use when connect to KDC. Commonly, you can simply select all the options.

        ![Config Encryption Types for Kerberos](media/connector-hdfs/config-encryption-types-for-kerberos.png)

    4. Use **Ksetup** command to specify the encryption algorithm to be used on the specific REALM.

                C:> ksetup /SetEncTypeAttr REALM.COM DES-CBC-CRC DES-CBC-MD5 RC4-HMAC-MD5 AES128-CTS-HMAC-SHA1-96 AES256-CTS-HMAC-SHA1-96

4.	Create the mapping between the domain account and Kerberos principal, in order to use Kerberos principal in Windows Domain.

    1. Start the Administrative tools > **Active Directory Users and Computers**.

    2. Configure advanced features by clicking **View** > **Advanced Features**.

    3. Locate the account to which you want to create mappings, and right-click to view **Name Mappings** > click **Kerberos Names** tab.

    4. Add a principal from the realm.

        ![Map Security Identity](media/connector-hdfs/map-security-identity.png)

**On Self-hosted Integration Runtime machine:**

* Run the following **Ksetup** commands to add a realm entry.

            C:> Ksetup /addkdc REALM.COM <your_kdc_server_address>
            C:> ksetup /addhosttorealmmap HDFS-service-FQDN REALM.COM

**In Azure Data Factory:**

* Configure the HDFS connector using **Windows authentication** together with either your Domain Account or Kerberos Principal to connect to the HDFS data source. Check [HDFS Linked Service properties](#linked-service-properties) section on configuration details.


## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
