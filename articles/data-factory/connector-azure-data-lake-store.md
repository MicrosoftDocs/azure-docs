---
title: Copy data to or from Azure Data Lake Storage Gen1 using Data Factory | Microsoft Docs
description: Learn how to copy data from supported source data stores to Azure Data Lake Store, or from Data Lake Store to supported sink stores, by using Data Factory.
services: data-factory
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: conceptual
ms.date: 07/02/2019
ms.author: jingwang

---
# Copy data to or from Azure Data Lake Storage Gen1 using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Azure Data Factory that you're using:"]
> * [Version 1](v1/data-factory-azure-datalake-connector.md)
> * [Current version](connector-azure-data-lake-store.md)

This article outlines how to copy data to and from Azure Data Lake Storage Gen1. To learn about Azure Data Factory, read the [introductory article](introduction.md).

## Supported capabilities

This Azure Data Lake Storage Gen1 connector is supported for the following activities:

- [Copy activity](copy-activity-overview.md) with [supported source or sink matrix](copy-activity-overview.md)
- [Mapping data flow](concepts-data-flow-overview.md)
- [Lookup activity](control-flow-lookup-activity.md)
- [GetMetadata activity](control-flow-get-metadata-activity.md)

Specifically, with this connector you can:

- Copy files by using one of the following methods of authentication: service principal or managed identities for Azure resources.
- Copy files as is or parse or generate files with the [supported file formats and compression codecs](supported-file-formats-and-compression-codecs.md).

> [!IMPORTANT]
> If you copy data by using the self-hosted integration runtime, configure the corporate firewall to allow outbound traffic to `<ADLS account name>.azuredatalakestore.net` and `login.microsoftonline.com/<tenant>/oauth2/token` on port 443. The latter is the Azure Security Token Service that the integration runtime needs to communicate with to get the access token.

## Get started

> [!TIP]
> For a walk-through of how to use the Azure Data Lake Store connector, see [Load data into Azure Data Lake Store](load-azure-data-lake-store.md).

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide information about properties that are used to define Data Factory entities specific to Azure Data Lake Store.

## Linked service properties

The following properties are supported for the Azure Data Lake Store linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The `type` property must be set to **AzureDataLakeStore**. | Yes |
| dataLakeStoreUri | Information about the Azure Data Lake Store account. This information takes one of the following formats: `https://[accountname].azuredatalakestore.net/webhdfs/v1` or `adl://[accountname].azuredatalakestore.net/`. | Yes |
| subscriptionId | The Azure subscription ID to which the Data Lake Store account belongs. | Required for sink |
| resourceGroupName | The Azure resource group name to which the Data Lake Store account belongs. | Required for sink |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use the Azure integration runtime or a self-hosted integration runtime if your data store is located in a private network. If this property isn't specified, the default Azure integration runtime is used. |No |

### Use service principal authentication

To use service principal authentication, register an application entity in Azure Active Directory and grant it access to Data Lake Store. For detailed steps, see [Service-to-service authentication](../data-lake-store/data-lake-store-authenticate-using-active-directory.md). Make note of the following values, which you use to define the linked service:

- Application ID
- Application key
- Tenant ID

>[!IMPORTANT]
> Grant the service principal proper permission in Data Lake Store:
>- **As source**: In **Data explorer** > **Access**, grant at least **Read + Execute** permission to list and copy the files in folders and subfolders. Or, you can grant **Read** permission to copy a single file. You can choose to add to **This folder and all children** for recursive, and add as **an access permission and a default permission entry**. There's no requirement on account-level access control (IAM).
>- **As sink**: In **Data explorer** > **Access**, grant at least **Write + Execute** permission to create child items in the folder. You can choose to add to **This folder and all children** for recursive, and add as **an access permission and a default permission entry**. If you use an Azure integration runtime to copy (both source and sink are in the cloud), in IAM, grant at least the **Reader** role in order to let Data Factory detect the region for Data Lake Store. If you want to avoid this IAM role, explicitly [create an Azure integration runtime](create-azure-integration-runtime.md#create-azure-ir) with the location of Data Lake Store. For example, if your Data Lake Store is in West Europe, create an Azure integration runtime with location set to "West Europe." Associate them in the Data Lake Store linked service as shown in the following example.

>[!NOTE]
>To list folders starting from the root, you must set the permission of the service principal being granted to **at root level with "Execute" permission**. This is true when you use the:
>- **Copy data tool** to author copy pipeline.
>- **Data Factory UI** to test connection and navigating folders during authoring.
>If you have concerns about granting permission at root level, during authoring, skip testing connection, and input a paraent path with permission granted then choose to browse from that specified path. Copy activity works as long as the service principal is granted with proper permission at the files to be copied.

The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| servicePrincipalId | Specify the application's client ID. | Yes |
| servicePrincipalKey | Specify the application's key. Mark this field as a `SecureString` to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| tenant | Specify the tenant information, such as domain name or tenant ID, under which your application resides. You can retrieve it by hovering the mouse in the upper-right corner of the Azure portal. | Yes |

**Example:**

```json
{
    "name": "AzureDataLakeStoreLinkedService",
    "properties": {
        "type": "AzureDataLakeStore",
        "typeProperties": {
            "dataLakeStoreUri": "https://<accountname>.azuredatalakestore.net/webhdfs/v1",
            "servicePrincipalId": "<service principal id>",
            "servicePrincipalKey": {
                "type": "SecureString",
                "value": "<service principal key>"
            },
            "tenant": "<tenant info, e.g. microsoft.onmicrosoft.com>",
            "subscriptionId": "<subscription of ADLS>",
            "resourceGroupName": "<resource group of ADLS>"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

### <a name="managed-identity"></a> Use managed identities for Azure resources authentication

A data factory can be associated with a [managed identity for Azure resources](data-factory-service-identity.md), which represents this specific data factory. You can directly use this managed identity for Data Lake Store authentication, similar to using your own service principal. It allows this designated factory to access and copy data to or from Data Lake Store.

To use managed identities for Azure resources authentication:

1. [Retrieve the data factory managed identity information](data-factory-service-identity.md#retrieve-managed-identity) by copying the value of the "Service Identity Application ID" generated along with your factory.
2. Grant the managed identity access to Data Lake Store, the same way you do for service principal, following these notes.

>[!IMPORTANT]
> Make sure you grant the data factory managed identity proper permission in Data Lake Store:
>- **As source**: In **Data explorer** > **Access**, grant at least **Read + Execute** permission to list and copy the files in folders and subfolders. Or, you can grant **Read** permission to copy a single file. You can choose to add to **This folder and all children** for recursive, and add as **an access permission and a default permission entry**. There's no requirement on account-level access control (IAM).
>- **As sink**: In **Data explorer** > **Access**, grant at least **Write + Execute** permission to create child items in the folder. You can choose to add to **This folder and all children** for recursive, and add as **an access permission and a default permission entry**. If you use an Azure integration runtime to copy (both source and sink are in the cloud), in IAM, grant at least the **Reader** role in order to let Data Factory detect the region for Data Lake Store. If you want to avoid this IAM role, explicitly [create an Azure integration runtime](create-azure-integration-runtime.md#create-azure-ir) with the location of Data Lake Store. Associate them in the Data Lake Store linked service as shown in the following example.

>[!NOTE]
>To list folders starting from the root, you must set the permission of the managed identity being granted to **at root level with "Execute" permission**. This is true when you use the:
>- **Copy data tool** to author copy pipeline.
>- **Data Factory UI** to test connection and navigating folders during authoring.
>If you have concerns about granting permission at root level, during authoring, skip testing connection, and input a parent path with permission granted then choose to browse from that specified path. Copy activity works as long as the service principal is granted with proper permission at the files to be copied.

In Azure Data Factory, you don't need to specify any properties besides the general Data Lake Store information in the linked service.

**Example:**

```json
{
    "name": "AzureDataLakeStoreLinkedService",
    "properties": {
        "type": "AzureDataLakeStore",
        "typeProperties": {
            "dataLakeStoreUri": "https://<accountname>.azuredatalakestore.net/webhdfs/v1",
            "subscriptionId": "<subscription of ADLS>",
            "resourceGroupName": "<resource group of ADLS>"
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

- For the parquet and delimited text format, see the [Parquet and delimited text format dataset](#parquet-and-delimited-text-format-dataset) section.
- For other formats like ORC, Avro, JSON, or binary format, see the [Other format dataset](#other-format-dataset) section.

### Parquet and delimited text format dataset

To copy data to and from Azure Data Lake Store Gen1 in parquet or delimited text format, see the [Parquet format](format-parquet.md) and [Delimited text format](format-delimited-text.md) articles on format-based dataset and supported settings. The following properties are supported for Azure Data Lake Store Gen1 under `location` settings in the format-based dataset:

| Property   | Description                                                  | Required |
| ---------- | ------------------------------------------------------------ | -------- |
| type       | The type property under `location` in the dataset must be set to **AzureDataLakeStoreLocation**. | Yes      |
| folderPath | The path to a folder. If you want to use a wildcard to filter folders, skip this setting and specify it in activity source settings. | No       |
| fileName   | The file name under the given folderPath. If you want to use a wildcard to filter files, skip this setting and specify it in activity source settings. | No       |

> [!NOTE]
>
> The **AzureDataLakeStoreFile** type dataset with parquet or text format mentioned in the following section is still supported as is for copy, lookup, and GetMetadata activity for backward compatibility. But it doesn't work with the mapping data flow feature. We recommend that you use this new model going forward. The Data Factory authoring UI generates these new types.

**Example:**

```json
{
    "name": "DelimitedTextDataset",
    "properties": {
        "type": "DelimitedText",
        "linkedServiceName": {
            "referenceName": "<ADLS Gen1 linked service name>",
            "type": "LinkedServiceReference"
        },
        "schema": [ < physical schema, optional, auto retrieved during authoring > ],
        "typeProperties": {
            "location": {
                "type": "AzureDataLakeStoreLocation",
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

To copy data to and from Azure Data Lake Store Gen1 in ORC, Avro, JSON, or binary format, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to **AzureDataLakeStoreFile**. |Yes |
| folderPath | Path to the folder in Data Lake Store. If not specified, it points to the root. <br/><br/>Wildcard filter is supported. Allowed wildcards are `*` (matches zero or more characters) and `?` (matches zero or single character). Use `^` to escape if your actual folder name has a wildcard or this escape char inside. <br/><br/>For example: rootfolder/subfolder/. See more examples in [Folder and file filter examples](#folder-and-file-filter-examples). |No |
| fileName | Name or wildcard filter for the files under the specified "folderPath". If you don't specify a value for this property, the dataset points to all files in the folder. <br/><br/>For filter, the wildcards allowed are `*` (matches zero or more characters) and `?` (matches zero or single character).<br/>- Example 1: `"fileName": "*.csv"`<br/>- Example 2: `"fileName": "???20180427.txt"`<br/>Use `^` to escape if your actual file name has a wildcard or this escape char inside.<br/><br/>When fileName isn't specified for an output dataset and **preserveHierarchy** isn't specified in the activity sink, the copy activity automatically generates the file name with the following pattern: "*Data.[activity run ID GUID].[GUID if FlattenHierarchy].[format if configured].[compression if configured]*", for example, "Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt.gz". If you copy from a tabular source by using a table name instead of a query, the name pattern is "*[table name].[format].[compression if configured]*", for example, "MyTable.csv". |No |
| modifiedDatetimeStart | Files filter based on the attribute Last Modified. The files are selected if their last modified time is within the time range between `modifiedDatetimeStart` and `modifiedDatetimeEnd`. The time is applied to the UTC time zone in the format of "2018-12-01T05:00:00Z". <br/><br/> The overall performance of data movement is affected by enabling this setting when you want to do file filter with huge amounts of files. <br/><br/> The properties can be NULL, which means no file attribute filter is applied to the dataset. When `modifiedDatetimeStart` has a datetime value but `modifiedDatetimeEnd` is NULL, it means the files whose last modified attribute is greater than or equal to the datetime value are selected. When `modifiedDatetimeEnd` has a datetime value but `modifiedDatetimeStart` is NULL, it means the files whose last modified attribute is less than the datetime value are selected.| No |
| modifiedDatetimeEnd | Files filter based on the attribute Last Modified. The files are selected if their last modified time is within the time range between `modifiedDatetimeStart` and `modifiedDatetimeEnd`. The time is applied to the UTC time zone in the format of "2018-12-01T05:00:00Z". <br/><br/> The overall performance of data movement is affected by enabling this setting when you want to do file filter with huge amounts of files. <br/><br/> The properties can be NULL, which means no file attribute filter is applied to the dataset. When `modifiedDatetimeStart` has a datetime value but `modifiedDatetimeEnd` is NULL, it means the files whose last modified attribute is greater than or equal to the datetime value are selected. When `modifiedDatetimeEnd` has a datetime value but `modifiedDatetimeStart` is NULL, it means the files whose last modified attribute is less than the datetime value are selected.| No |
| format | If you want to copy files as is between file-based stores (binary copy), skip the format section in both input and output dataset definitions.<br/><br/>If you want to parse or generate files with a specific format, the following file format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, and **ParquetFormat**. Set the **type** property under **format** to one of these values. For more information, see the [Text format](supported-file-formats-and-compression-codecs.md#text-format), [JSON format](supported-file-formats-and-compression-codecs.md#json-format), [Avro format](supported-file-formats-and-compression-codecs.md#avro-format), [Orc format](supported-file-formats-and-compression-codecs.md#orc-format), and [Parquet format](supported-file-formats-and-compression-codecs.md#parquet-format) sections. |No (only for binary copy scenario) |
| compression | Specify the type and level of compression for the data. For more information, see [Supported file formats and compression codecs](supported-file-formats-and-compression-codecs.md#compression-support).<br/>Supported types are **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**.<br/>Supported levels are **Optimal** and **Fastest**. |No |


>[!TIP]
>To copy all files under a folder, specify **folderPath** only.<br>To copy a single file with a particular name, specify **folderPath** with a folder part and **fileName** with a file name.<br>To copy a subset of files under a folder, specify **folderPath** with a folder part and **fileName** with a wildcard filter. 

**Example:**

```json
{
    "name": "ADLSDataset",
    "properties": {
        "type": "AzureDataLakeStoreFile",
        "linkedServiceName":{
            "referenceName": "<ADLS linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "folderPath": "datalake/myfolder/",
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

For a full list of sections and properties available for defining activities, see [Pipelines](concepts-pipelines-activities.md). This section provides a list of properties supported by Azure Data Lake Store source and sink.

### Azure Data Lake Store as source

- To copy from parquet or delimited text format, see the [Parquet and delimited text format source](#parquet-and-delimited-text-format-source) section.
- To copy from other formats like ORC, Avro, JSON, or binary format, see the [Other format source](#other-format-source) section.

#### Parquet and delimited text format source

To copy data from Azure Data Lake Store Gen1 in parquet or delimited text format, see the [Parquet format](format-parquet.md) and [Delimited text format](format-delimited-text.md) articles on format-based copy activity source and supported settings. The following properties are supported for Azure Data Lake Store Gen1 under `storeSettings` settings in the format-based copy source:

| Property                 | Description                                                  | Required                                      |
| ------------------------ | ------------------------------------------------------------ | --------------------------------------------- |
| type                     | The type property under `storeSettings` must be set to **AzureDataLakeStoreReadSetting**. | Yes                                           |
| recursive                | Indicates whether the data is read recursively from the subfolders or only from the specified folder. When recursive is set to true and the sink is a file-based store, an empty folder or subfolder isn't copied or created at the sink. Allowed values are **true** (default) and **false**. | No                                            |
| wildcardFolderPath       | The folder path with wildcard characters to filter source folders. <br>Allowed wildcards are `*` (matches zero or more characters) and `?` (matches zero or single character). Use `^` to escape if your actual folder name has a wildcard or this escape char inside. <br>See more examples in [Folder and file filter examples](#folder-and-file-filter-examples). | No                                            |
| wildcardFileName         | The file name with wildcard characters under the given folderPath/wildcardFolderPath to filter source files. <br>Allowed wildcards are `*` (matches zero or more characters) and `?` (matches zero or single character). Use `^` to escape if your actual folder name has a wildcard or this escape char inside. See more examples in [Folder and file filter examples](#folder-and-file-filter-examples). | Yes if `fileName` isn't specified in dataset |
| modifiedDatetimeStart    | Files filter based on the attribute Last Modified. The files are selected if their last modified time is within the time range between `modifiedDatetimeStart` and `modifiedDatetimeEnd`. The time is applied to the UTC time zone in the format of "2018-12-01T05:00:00Z". <br> The properties can be NULL, which means no file attribute filter is applied to the dataset. When `modifiedDatetimeStart` has a datetime value but `modifiedDatetimeEnd` is NULL, it means the files whose last modified attribute is greater than or equal to the datetime value are selected. When `modifiedDatetimeEnd` has a datetime value but `modifiedDatetimeStart` is NULL, it means the files whose last modified attribute is less than the datetime value are selected. | No                                            |
| modifiedDatetimeEnd      | Same as above.                                               | No                                            |
| maxConcurrentConnections | The number of connections to connect to storage store concurrently. Specify only when you want to limit the concurrent connection to the data store. | No                                            |

> [!NOTE]
> For parquet or delimited text format, the **AzureDataLakeStoreSource** type copy activity source mentioned in the following section is still supported as is for backward compatibility. We recommend that you use this new model going forward. The Data Factory authoring UI generates these new types.

**Example:**

```json
"activities":[
    {
        "name": "CopyFromADLSGen1",
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
                    "type": "AzureDataLakeStoreReadSetting",
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

To copy data from Azure Data Lake Store Gen1 in ORC, Avro, JSON, or binary format, the following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The `type` property of the copy activity source must be set to **AzureDataLakeStoreSource**. |Yes |
| recursive | Indicates whether the data is read recursively from the subfolders or only from the specified folder. When `recursive` is set to true and the sink is a file-based store, an empty folder or subfolder isn't copied or created at the sink. Allowed values are **true** (default) and **false**. | No |
| maxConcurrentConnections | The number of connections to connect to the data store concurrently. Specify only when you want to limit the concurrent connection to the data store. | No |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromADLSGen1",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<ADLS Gen1 input dataset name>",
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
                "type": "AzureDataLakeStoreSource",
                "recursive": true
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

### Azure Data Lake Store as sink

- To copy to parquet and delimited text format, see the [Parquet and delimited text format sink](#parquet-and-delimited-text-format-sink) section.
- To copy to other formats like ORC, Avro, JSON, or binary format, see the [Other format sink](#other-format-sink) section.

#### Parquet and delimited text format sink

To copy data to Azure Data Lake Store Gen1 in parquet or delimited text format, see the [Parquet format](format-parquet.md) and [Delimited text format](format-delimited-text.md) articles on format-based copy activity sink and supported settings. The following properties are supported for Azure Data Lake Store Gen1 under `storeSettings` settings in the format-based copy sink:

| Property                 | Description                                                  | Required |
| ------------------------ | ------------------------------------------------------------ | -------- |
| type                     | The type property under `storeSettings` must be set to **AzureDataLakeStoreWriteSetting**. | Yes      |
| copyBehavior             | Defines the copy behavior when the source is files from a file-based data store.<br/><br/>Allowed values are:<br/><b>- PreserveHierarchy (default)</b>: Preserves the file hierarchy in the target folder. The relative path of the source file to the source folder is identical to the relative path of the target file to the target folder.<br/><b>- FlattenHierarchy</b>: All files from the source folder are in the first level of the target folder. The target files have autogenerated names. <br/><b>- MergeFiles</b>: Merges all files from the source folder to one file. If the file name is specified, the merged file name is the specified name. Otherwise, it's an autogenerated file name. | No       |
| maxConcurrentConnections | The number of connections to connect to the data store concurrently. Specify only when you want to limit the concurrent connection to the data store. | No       |

> [!NOTE]
> For parquet or delimited text format, the **AzureDataLakeStoreSink** type copy activity sink mentioned in the following section is still supported as is for backward compatibility. We recommend that you use this new model going forward. The Data Factory authoring UI generates these new types.

**Example:**

```json
"activities":[
    {
        "name": "CopyToADLSGen1",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<Parquet output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "ParquetSink",
                "storeSettings":{
                    "type": "AzureDataLakeStoreWriteSetting",
                    "copyBehavior": "PreserveHierarchy"
                }
            }
        }
    }
]
```

#### Other format sink

To copy data to Azure Data Lake Store Gen1 in ORC, Avro, JSON, or binary format, the following properties are supported in the **sink** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The `type` property of the copy activity sink must be set to **AzureDataLakeStoreSink**. |Yes |
| copyBehavior | Defines the copy behavior when the source is files from a file-based data store.<br/><br/>Allowed values are:<br/><b>- PreserveHierarchy (default)</b>: Preserves the file hierarchy in the target folder. The relative path of the source file to the source folder is identical to the relative path of the target file to the target folder.<br/><b>- FlattenHierarchy</b>: All files from the source folder are in the first level of the target folder. The target files have autogenerated names. <br/><b>- MergeFiles</b>: Merges all files from the source folder to one file. If the file name is specified, the merged file name is the specified name. Otherwise, the file name is autogenerated. | No |
| maxConcurrentConnections | The number of connections to connect to the data store concurrently. Specify only when you want to limit the concurrent connection to the data store. | No |

**Example:**

```json
"activities":[
    {
        "name": "CopyToADLSGen1",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<ADLS Gen1 output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "AzureDataLakeStoreSink",
                "copyBehavior": "PreserveHierarchy"
            }
        }
    }
]
```

### Folder and file filter examples

This section describes the resulting behavior of the folder path and file name with wildcard filters.

| folderPath | fileName | recursive | Source folder structure and filter result (files in **bold** are retrieved)|
|:--- |:--- |:--- |:--- |
| `Folder*` | (Empty, use default) | false | FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File2.json**<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3.csv<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5.csv<br/>AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |
| `Folder*` | (Empty, use default) | true | FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File2.json**<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File3.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File4.json**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File5.csv**<br/>AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |
| `Folder*` | `*.csv` | false | FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3.csv<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5.csv<br/>AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |
| `Folder*` | `*.csv` | true | FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File3.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File5.csv**<br/>AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |

### Examples of behavior of the copy operation

This section describes the resulting behavior of the copy operation for different combinations of `recursive` and `copyBehavior` values.

| recursive | copyBehavior | Source folder structure | Resulting target |
|:--- |:--- |:--- |:--- |
| true |preserveHierarchy | Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5 | The target Folder1 is created with the same structure as the source:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5. |
| true |flattenHierarchy | Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5 | The target Folder1 is created with the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;autogenerated name for File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;autogenerated name for File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;autogenerated name for File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;autogenerated name for File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;autogenerated name for File5 |
| true |mergeFiles | Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5 | The target Folder1 is created with the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1 + File2 + File3 + File4 + File5 contents are merged into one file, with an autogenerated file name. |
| false |preserveHierarchy | Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5 | The target Folder1 is created with the following structure:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/><br/>Subfolder1 with File3, File4, and File5 aren't picked up. |
| false |flattenHierarchy | Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5 | The target Folder1 is created with the following structure:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;autogenerated name for File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;autogenerated name for File2<br/><br/>Subfolder1 with File3, File4, and File5 aren't picked up. |
| false |mergeFiles | Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5 | The target Folder1 is created with the following structure:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1 + File2 contents are merged into one file with autogenerated file name. autogenerated name for File1<br/><br/>Subfolder1 with File3, File4, and File5 aren't picked up. |

## Preserve ACLs to Data Lake Storage Gen2

If you want to replicate the access control lists (ACLs) along with data files when you upgrade from Data Lake Storage Gen1 to Data Lake Storage Gen2, see [Preserve ACLs from Data Lake Storage Gen1](connector-azure-data-lake-storage.md#preserve-acls-from-data-lake-storage-gen1).

## Mapping data flow properties

Learn more about [source transformation](data-flow-source.md) and [sink transformation](data-flow-sink.md) in the mapping data flow feature.

## Next steps

For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md##supported-data-stores-and-formats).
