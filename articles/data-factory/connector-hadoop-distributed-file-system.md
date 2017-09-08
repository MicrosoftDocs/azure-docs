---
title: Copy data from HDFS using Azure Data Factory  | Microsoft Docs
description: Learn how to copy data from a cloud or on-premises HDFS source to supported sink data stores by using a copy activity in an Azure Data Factory pipeline.
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
ms.date: 08/10/2017
ms.author: jingwang

---
# Copy data from and to HDFS using Azure Data Factory

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from and to HDFS. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported scenarios

You can copy data from HDFS to any supported sink data store. For a list of data stores supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this HDFS connector supports:

- Copying files using **Windows** (Kerberos) or **Anonymous** authentication.
- Copying files using **webhdfs** protocol or **built-in DistCp** support.
- Copying files as-is or parsing/generating files with the [supported file formats and compression codecs](supported-file-formats-and-compression-codecs.md).

## Prerequisites

To copy data from/to an HDFS that is not publicly accessible, you need to set up a self-hosted Integration Runtime. See [Self-hosted Integration Runtime](concepts-integration-runtime.md) article to learn details.

## Getting started
You can create a pipeline with copy activity using .NET SDK, Python SDK, Azure PowerShell, REST API, or Azure Resource Manager template. See [Copy activity tutorial](quickstart-create-data-factory-dot-net.md) for step-by-step instructions to create a pipeline with a copy activity.

The following sections provide details about properties that are used to define Data Factory entities specific to HDFS.

## Linked service properties

The following properties are supported for HDFS linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Hdfs**. | Yes |
| url |URL to the HDFS |Yes |
| authenticationType | Allowed values are: **Anonymous**, or **Windows**. <br><br> To use **Kerberos authentication** for HDFS connector, refer to [this section](#use-kerberos-authentication-for-hdfs-connector) to set up your on-premises environment accordingly. |Yes |
| userName |Username for Windows authentication. |Yes (for Windows Authentication) |
| password |Password for Windows authentication. |Yes (for Windows Authentication) |

**Example: using Anonymous authentication**

```json
{
    "name": "HDFSLinkedService",
    "properties":
    {
        "type": "Hdfs",
        "typeProperties":
        {
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
    "properties":
    {
        "type": "Hdfs",
        "typeProperties":
        {
            "url" : "http://<machine>:50070/webhdfs/v1/",
            "authenticationType": "Windows",
            "userName": "<domain>\\<user>",
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

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by HDFS dataset.

To copy data from HDFS, set the type property of the dataset to **FileShare**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **FileShare** |Yes |
| folderPath | Path to the folder. For example: folder/subfolder/ |Yes |
| fileName | Specify the name of the file in the **folderPath** if you want to copy from a specific file. If you do not specify any value for this property, the dataset points to all files in the folder as source. |No |
| format | If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions.<br/><br/>If you want to parse files with a specific format, the following file format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](supported-file-formats-and-compression-codecs.md#text-format), [Json Format](supported-file-formats-and-compression-codecs.md#json-format), [Avro Format](supported-file-formats-and-compression-codecs.md#avro-format), [Orc Format](supported-file-formats-and-compression-codecs.md#orc-format), and [Parquet Format](supported-file-formats-and-compression-codecs.md#parquet-format) sections. |No (only for binary copy scenario) |
| compression | Specify the type and level of compression for the data. For more information, see [Supported file formats and compression codecs](supported-file-formats-and-compression-codecs.md#compression-support).<br/>Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**.<br/>Supported levels are: **Optimal** and **Fastest**. |No |

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

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by HDFS source and sink.

### HDFS as source

To copy data from HDFS, set the source type in the copy activity to **HdfsSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **HdfsSource** |Yes |
| recursive | Indicates whether the data is read recursively from the sub folders or only from the specified folder.<br/>Allowed values are: **true** (default), **false** | No |
| distcpSettings | Property group when using HDFS DistCp. | No |
| resourceManagerEndpoint | The Yarn ResourceManager endpoint | Yes if using DistCp |
| tempScriptPath | A folder path used to store temp DistCp command script. The script file is generated by ADF and will be removed after Copy job finished. | Yes if using DistCp |
| distcpOptions | Additional options provided to DistCp command. | No |

**Example: HDFS source in copy activity using UNLOAD**

```json
"source": {
    "type": "HdfsSource",
    "distcpSettings": {
        "resourceManagerEndpoint": "resourcemanagerendpoint:8088",
        "tempScriptPath": "/usr/hadoop/tempscript",
        "distcpOptions": "-strategy dynamic -map 100"
    }
}
```

Learn more on how to use DistCp to copy data from HDFS efficiently from the next section.

## Use DistCp to copy data from HDFS

[DistCp](https://hadoop.apache.org/docs/current3/hadoop-distcp/DistCp.html) is a Hadoop native command-line tool to do distributed copy in a Hadoop cluster. When run a Distcp command, it will first list all the files to be copied, create several Map jobs into the Hadoop cluster, and each Map job will do binary copy from source to sink.

Copy Activity support using DistCp to copy files as-is into Azure Blob (including [staged copy](copy-activity-performance.md) or Azure Data Lake Store, in which case it can fully leverage your cluster's power instead of running on the self-hosted Integration Runtime. It will provide better copy throughput especially if your cluster is very powerful. Based on your configuration in Azure Data Factory, Copy activity automatically construct a distcp command, submit to your Hadoop cluster, and monitor the copy status.

### Prerequsites

To use DistCp to copy files as-is from HDFS to Azure Blob (including staged copy) or Azure Data Lake Store, make sure your Hadoop cluster meets below requirements:

1. MapReduce and Yarn services are enabled.
2. Yarn version is 2.5 or above.
3. HDFS server is integrated with your target data store - Azure Blob or Azure Data Lake Store:

    - Azure Blob FileSystem is natively supported since Hadoop 2.7. You only need to specify jar path in Hadoop env config.
    - Azure Data Lake Store FileSystem is packaged starting from Hadoop 3.0.0-alpha1. If your Hadoop cluster is lower than that version, you need to manually import ADLS related jar packages (azure-datalake-store.jar) into cluster from [here](https://hadoop.apache.org/releases.html), and specify jar path in Hadoop env config.

4. Prepare a temp folder in HDFS. This temp folder is used to store DistCp shell script, so it will occupy KB-level space.
5. Make sure the user account provided in HDFS Linked Service have permission to a) submit application in Yarn; b) have the permission to create subfolder, read/write files under above temp folder.

### Configurations

Below is an example of copy activity configuration to copy data from HDFS to Azure Blob using DistCp:

**Example:**

```json
"activities":[
    {
        "name": "CopyFromHDFSToBlob",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "HDFSDataset",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "BlobDataset",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "HdfsSource",
                "distcpSettings": {
                    "resourceManagerEndpoint": "resourcemanagerendpoint:8088",
                    "tempScriptPath": "/usr/hadoop/tempscript",
                    "distcpOptions": "-strategy dynamic -map 100"
                }
            },
            "sink": {
                "type": "BlobSink"
            }
        }
    }
]
```

## Use Kerberos authentication for HDFS connector

There are two options to set up the on-premises environment so as to use Kerberos Authentication in HDFS connector. You can choose the one better fits your case.
* Option 1: [Join self-hosted Integration Runtime machine in Kerberos realm](#kerberos-join-realm)
* Option 2: [Enable mutual trust between Windows domain and Kerberos realm](#kerberos-mutual-trust)

### <a name="kerberos-join-realm"></a>Option 1: Join self-hosted Integration Runtime machine in Kerberos realm

#### Requirements

* The self-hosted Integration Runtime machine needs to join the Kerberos realm and can’t join any Windows domain.

#### How to configure

**On self-hosted Integration Runtime machine:**

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

*	The self-hosted Integration Runtime machine must join a Windows domain.
*	You need permission to update the domain controller's settings.

#### How to configure

> [!NOTE]
> Replace REALM.COM and AD.COM in the following tutorial with your own respective realm and domain controller as needed.

**On KDC server:**

1.	Edit the KDC configuration in **krb5.conf** file to let KDC trust Windows Domain referring to the following configuration template. By default, the configuration is located at **/etc/krb5.conf**.

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

2.	Prepare a principal named **krbtgt/REALM.COM@AD.COM** in KDC server with the following command:

            Kadmin> addprinc krbtgt/REALM.COM@AD.COM

3.	In **hadoop.security.auth_to_local** HDFS service configuration file, add `RULE:[1:$1@$0](.*@AD.COM)s/@.*//`.

**On domain controller:**

1.	Run the following **Ksetup** commands to add a realm entry:

            C:> Ksetup /addkdc REALM.COM <your_kdc_server_address>
            C:> ksetup /addhosttorealmmap HDFS-service-FQDN REALM.COM

2.	Establish trust from Windows Domain to Kerberos Realm. [password] is the password for the principal **krbtgt/REALM.COM@AD.COM**.

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

**On self-hosted Integration Runtime machine:**

* Run the following **Ksetup** commands to add a realm entry.

            C:> Ksetup /addkdc REALM.COM <your_kdc_server_address>
            C:> ksetup /addhosttorealmmap HDFS-service-FQDN REALM.COM

**In Azure Data Factory:**

* Configure the HDFS connector using **Windows authentication** together with either your Domain Account or Kerberos Principal to connect to the HDFS data source. Check [HDFS Linked Service properties](#linked-service-properties) section on configuration details.


## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md##supported-data-stores-and-formats).