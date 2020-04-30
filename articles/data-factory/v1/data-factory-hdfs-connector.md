---
title: Move data from on-premises HDFS 
description: Learn about how to move data from on-premises HDFS using Azure Data Factory.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: shwang


ms.assetid: 3215b82d-291a-46db-8478-eac1a3219614
ms.service: data-factory
ms.workload: data-services


ms.topic: conceptual
ms.date: 01/10/2018
ms.author: jingwang

robots: noindex
---
# Move data from on-premises HDFS using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](data-factory-hdfs-connector.md)
> * [Version 2 (current version)](../connector-hdfs.md)

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [HDFS connector in V2](../connector-hdfs.md).

This article explains how to use the Copy Activity in Azure Data Factory to move data from an on-premises HDFS. It builds on the [Data Movement Activities](data-factory-data-movement-activities.md) article, which presents a general overview of data movement with the copy activity.

You can copy data from HDFS to any supported sink data store. For a list of data stores supported as sinks by the copy activity, see the [Supported data stores](data-factory-data-movement-activities.md#supported-data-stores-and-formats) table. Data factory currently supports only moving data from an on-premises HDFS to other data stores, but not for moving data from other data stores to an on-premises HDFS.

> [!NOTE]
> Copy Activity does not delete the source file after it is successfully copied to the destination. If you need to delete the source file after a successful copy, create a custom activity to delete the file and use the activity in the pipeline. 

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Enabling connectivity
Data Factory service supports connecting to on-premises HDFS using the Data Management Gateway. See [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article to learn about Data Management Gateway and step-by-step instructions on setting up the gateway. Use the gateway to connect to HDFS even if it is hosted in an Azure IaaS VM.

> [!NOTE]
> Make sure the Data Management Gateway can access to **ALL** the [name node server]:[name node port] and [data node servers]:[data node port] of the Hadoop cluster. Default [name node port] is 50070, and default [data node port] is 50075.

While you can install gateway on the same on-premises machine or the Azure VM as the HDFS, we recommend that you install the gateway on a separate machine/Azure IaaS VM. Having gateway on a separate machine reduces resource contention and improves performance. When you install the gateway on a separate machine, the machine should be able to access the machine with the HDFS.

## Getting started
You can create a pipeline with a copy activity that moves data from a HDFS source by using different tools/APIs.

The easiest way to create a pipeline is to use the **Copy Wizard**. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough on creating a pipeline using the Copy data wizard.

You can also use the following tools to create a pipeline: **Azure portal**, **Visual Studio**, **Azure PowerShell**, **Azure Resource Manager template**, **.NET API**, and **REST API**. See [Copy activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for step-by-step instructions to create a pipeline with a copy activity.

Whether you use the tools or APIs, you perform the following steps to create a pipeline that moves data from a source data store to a sink data store:

1. Create **linked services** to link input and output data stores to your data factory.
2. Create **datasets** to represent input and output data for the copy operation.
3. Create a **pipeline** with a copy activity that takes a dataset as an input and a dataset as an output.

When you use the wizard, JSON definitions for these Data Factory entities (linked services, datasets, and the pipeline) are automatically created for you. When you use tools/APIs (except .NET API), you define these Data Factory entities by using the JSON format.  For a sample with JSON definitions for Data Factory entities that are used to copy data from a HDFS data store, see [JSON example: Copy data from on-premises HDFS to Azure Blob](#json-example-copy-data-from-on-premises-hdfs-to-azure-blob) section of this article.

The following sections provide details about JSON properties that are used to define Data Factory entities specific to HDFS:

## Linked service properties
A linked service links a data store to a data factory. You create a linked service of type **Hdfs** to link an on-premises HDFS to your data factory. The following table provides description for JSON elements specific to HDFS linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **Hdfs** |Yes |
| url |URL to the HDFS |Yes |
| authenticationType |Anonymous, or Windows. <br><br> To use **Kerberos authentication** for HDFS connector, refer to [this section](#use-kerberos-authentication-for-hdfs-connector) to set up your on-premises environment accordingly. |Yes |
| userName |Username for Windows authentication. For Kerberos authentication, specify `<username>@<domain>.com`. |Yes (for Windows Authentication) |
| password |Password for Windows authentication. |Yes (for Windows Authentication) |
| gatewayName |Name of the gateway that the Data Factory service should use to connect to the HDFS. |Yes |
| encryptedCredential |[New-AzDataFactoryEncryptValue](https://docs.microsoft.com/powershell/module/az.datafactory/new-azdatafactoryencryptvalue) output of the access credential. |No |

### Using Anonymous authentication

```JSON
{
    "name": "hdfs",
    "properties":
    {
        "type": "Hdfs",
        "typeProperties":
        {
            "authenticationType": "Anonymous",
            "userName": "hadoop",
            "url" : "http://<machine>:50070/webhdfs/v1/",
            "gatewayName": "mygateway"
        }
    }
}
```

### Using Windows authentication

```JSON
{
    "name": "hdfs",
    "properties":
    {
        "type": "Hdfs",
        "typeProperties":
        {
            "authenticationType": "Windows",
            "userName": "<username>@<domain>.com (for Kerberos auth)",
            "password": "password",
            "url" : "http://<machine>:50070/webhdfs/v1/",
            "gatewayName": "mygateway"
        }
    }
}
```
## Dataset properties
For a full list of sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections such as structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc.).

The **typeProperties** section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for dataset of type **FileShare** (which includes HDFS dataset) has the following properties

| Property | Description | Required |
| --- | --- | --- |
| folderPath |Path to the folder. Example: `myfolder`<br/><br/>Use escape character ‘ \ ’ for special characters in the string. For example: for folder\subfolder, specify folder\\\\subfolder and for d:\samplefolder, specify d:\\\\samplefolder.<br/><br/>You can combine this property with **partitionBy** to have folder paths based on slice start/end date-times. |Yes |
| fileName |Specify the name of the file in the **folderPath** if you want the table to refer to a specific file in the folder. If you do not specify any value for this property, the table points to all files in the folder.<br/><br/>When fileName is not specified for an output dataset, the name of the generated file would be in the following this format: <br/><br/>`Data.<Guid>.txt` (for example: : Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt |No |
| partitionedBy |partitionedBy can be used to specify a dynamic folderPath, filename for time series data. Example: folderPath parameterized for every hour of data. |No |
| format | The following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](data-factory-supported-file-and-compression-formats.md#text-format), [Json Format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro Format](data-factory-supported-file-and-compression-formats.md#avro-format), [Orc Format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections. <br><br> If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions. |No |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**. Supported levels are: **Optimal** and **Fastest**. For more information, see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No |

> [!NOTE]
> filename and fileFilter cannot be used simultaneously.

### Using partionedBy property
As mentioned in the previous section, you can specify a dynamic folderPath and filename for time series data with the **partitionedBy** property, [Data Factory functions, and the system variables](data-factory-functions-variables.md).

To learn more about time series datasets, scheduling, and slices, see [Creating Datasets](data-factory-create-datasets.md), [Scheduling & Execution](data-factory-scheduling-and-execution.md), and [Creating Pipelines](data-factory-create-pipelines.md) articles.

#### Sample 1:

```JSON
"folderPath": "wikidatagateway/wikisampledataout/{Slice}",
"partitionedBy":
[
    { "name": "Slice", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyyMMddHH" } },
],
```
In this example {Slice} is replaced with the value of Data Factory system variable SliceStart in the format (YYYYMMDDHH) specified. The SliceStart refers to start time of the slice. The folderPath is different for each slice. For example: wikidatagateway/wikisampledataout/2014100103 or wikidatagateway/wikisampledataout/2014100104.

#### Sample 2:

```JSON
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

Whereas, properties available in the typeProperties section of the activity vary with each activity type. For Copy activity, they vary depending on the types of sources and sinks.

For Copy Activity, when source is of type **FileSystemSource** the following properties are available in typeProperties section:

**FileSystemSource** supports the following properties:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| recursive |Indicates whether the data is read recursively from the sub folders or only from the specified folder. |True, False (default) |No |

## Supported file and compression formats
See [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md) article on details.

## JSON example: Copy data from on-premises HDFS to Azure Blob
This sample shows how to copy data from an on-premises HDFS to Azure Blob Storage. However, data can be copied **directly** to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores-and-formats) using the Copy Activity in Azure Data Factory.  

The sample provides JSON definitions for the following Data Factory entities. You can use these definitions to create a pipeline to copy data from HDFS to Azure Blob Storage by using [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md).

1. A linked service of type [OnPremisesHdfs](#linked-service-properties).
2. A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#linked-service-properties).
3. An input [dataset](data-factory-create-datasets.md) of type [FileShare](#dataset-properties).
4. An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#dataset-properties).
5. A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [FileSystemSource](#copy-activity-properties) and [BlobSink](data-factory-azure-blob-connector.md#copy-activity-properties).

The sample copies data from an on-premises HDFS to an Azure blob every hour. The JSON properties used in these samples are described in sections following the samples.

As a first step, set up the data management gateway. The instructions in the [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article.

**HDFS linked service:**
This example uses the Windows authentication. See [HDFS linked service](#linked-service-properties) section for different types of authentication you can use.

```JSON
{
    "name": "HDFSLinkedService",
    "properties":
    {
        "type": "Hdfs",
        "typeProperties":
        {
            "authenticationType": "Windows",
            "userName": "Administrator",
            "password": "password",
            "url" : "http://<machine>:50070/webhdfs/v1/",
            "gatewayName": "mygateway"
        }
    }
}
```

**Azure Storage linked service:**

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

**HDFS input dataset:**
This dataset refers to the HDFS folder DataTransfer/UnitTest/. The pipeline copies all the files in this folder to the destination.

Setting “external”: ”true” informs the Data Factory service that the dataset is external to the data factory and is not produced by an activity in the data factory.

```JSON
{
    "name": "InputDataset",
    "properties": {
        "type": "FileShare",
        "linkedServiceName": "HDFSLinkedService",
        "typeProperties": {
            "folderPath": "DataTransfer/UnitTest/"
        },
        "external": true,
        "availability": {
            "frequency": "Hour",
            "interval":  1
        }
    }
}
```

**Azure Blob output dataset:**

Data is written to a new blob every hour (frequency: hour, interval: 1). The folder path for the blob is dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, day, and hours parts of the start time.

```JSON
{
    "name": "OutputDataset",
    "properties": {
        "type": "AzureBlob",
        "linkedServiceName": "AzureStorageLinkedService",
        "typeProperties": {
            "folderPath": "mycontainer/hdfs/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}",
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

**A copy activity in a pipeline with File System source and Blob sink:**

The pipeline contains a Copy Activity that is configured to use these input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **FileSystemSource** and **sink** type is set to **BlobSink**. The SQL query specified for the **query** property selects the data in the past hour to copy.

```JSON
{
    "name": "pipeline",
    "properties":
    {
        "activities":
        [
            {
                "name": "HdfsToBlobCopy",
                "inputs": [ {"name": "InputDataset"} ],
                "outputs": [ {"name": "OutputDataset"} ],
                "type": "Copy",
                "typeProperties":
                {
                    "source":
                    {
                        "type": "FileSystemSource"
                    },
                    "sink":
                    {
                        "type": "BlobSink"
                    }
                },
                "policy":
                {
                    "concurrency": 1,
                    "executionPriorityOrder": "NewestFirst",
                    "retry": 1,
                    "timeout": "00:05:00"
                }
            }
        ],
        "start": "2014-06-01T18:00:00Z",
        "end": "2014-06-01T19:00:00Z"
    }
}
```

## Use Kerberos authentication for HDFS connector
There are two options to set up the on-premises environment so as to use Kerberos Authentication in HDFS connector. You can choose the one better fits your case.
* Option 1: [Join gateway machine in Kerberos realm](#kerberos-join-realm)
* Option 2: [Enable mutual trust between Windows domain and Kerberos realm](#kerberos-mutual-trust)

### <a name="kerberos-join-realm"></a>Option 1: Join gateway machine in Kerberos realm

#### Requirement:

* The gateway machine needs to join the Kerberos realm and can’t join any Windows domain.

#### How to configure:

**On gateway machine:**

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

#### Requirement:
*	The gateway machine must join a Windows domain.
*	You need permission to update the domain controller's settings.

#### How to configure:

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

        ![Config Encryption Types for Kerberos](media/data-factory-hdfs-connector/config-encryption-types-for-kerberos.png)

    4. Use **Ksetup** command to specify the encryption algorithm to be used on the specific REALM.

                C:> ksetup /SetEncTypeAttr REALM.COM DES-CBC-CRC DES-CBC-MD5 RC4-HMAC-MD5 AES128-CTS-HMAC-SHA1-96 AES256-CTS-HMAC-SHA1-96

4.	Create the mapping between the domain account and Kerberos principal, in order to use Kerberos principal in Windows Domain.

    1. Start the Administrative tools > **Active Directory Users and Computers**.

    2. Configure advanced features by clicking **View** > **Advanced Features**.

    3. Locate the account to which you want to create mappings, and right-click to view **Name Mappings** > click **Kerberos Names** tab.

    4. Add a principal from the realm.

        ![Map Security Identity](media/data-factory-hdfs-connector/map-security-identity.png)

**On gateway machine:**

* Run the following **Ksetup** commands to add a realm entry.

            C:> Ksetup /addkdc REALM.COM <your_kdc_server_address>
            C:> ksetup /addhosttorealmmap HDFS-service-FQDN REALM.COM

**In Azure Data Factory:**

* Configure the HDFS connector using **Windows authentication** together with either your Domain Account or Kerberos Principal to connect to the HDFS data source. Check [HDFS Linked Service properties](#linked-service-properties) section on configuration details.

> [!NOTE]
> To map columns from source dataset to columns from sink dataset, see [Mapping dataset columns in Azure Data Factory](data-factory-map-columns.md).


## Performance and Tuning
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.
