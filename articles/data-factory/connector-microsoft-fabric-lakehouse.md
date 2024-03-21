---
title: Copy and transform data in Microsoft Fabric Lakehouse 
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy and transform data in Microsoft Fabric Lakehouse using Azure Data Factory or Azure Synapse Analytics pipelines.
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 03/07/2024
---

# Copy and transform data in Microsoft Fabric Lakehouse using Azure Data Factory or Azure Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Microsoft Fabric Lakehouse is a data architecture platform for storing, managing, and analyzing structured and unstructured data in a single location. In order to achieve seamless data access across all compute engines in Microsoft Fabric, go to [Lakehouse and Delta Tables](/fabric/data-engineering/lakehouse-and-delta-tables) to learn more. By default, data is written to Lakehouse Table in V-Order, and you can go to [Delta Lake table optimization and V-Order](/fabric/data-engineering/delta-optimization-and-v-order?tabs=sparksql#what-is-v-order) for more information.

This article outlines how to use Copy activity to copy data from and to Microsoft Fabric Lakehouse and use Data Flow to transform data in Microsoft Fabric Lakehouse. To learn more, read the introductory article for [Azure Data Factory](introduction.md) or [Azure Synapse Analytics](../synapse-analytics/overview-what-is.md).


## Supported capabilities

This Microsoft Fabric Lakehouse connector is supported for the following capabilities:

| Supported capabilities|IR | 
|---------| --------| 
|[Copy activity](copy-activity-overview.md) (source/sink)|&#9312; &#9313;|
|[Mapping data flow](concepts-data-flow-overview.md) (source/sink)|&#9312; |
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|
|[GetMetadata activity](control-flow-get-metadata-activity.md)|&#9312; &#9313;|
|[Delete activity](delete-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime  &#9313; Self-hosted integration runtime*

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a Microsoft Fabric Lakehouse linked service using UI

Use the following steps to create a Microsoft Fabric Lakehouse linked service in the Azure portal UI.

1. Browse to the **Manage** tab in your Azure Data Factory or Synapse workspace and select Linked Services, then select New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

1. Search for Microsoft Fabric Lakehouse and select the connector.

    :::image type="content" source="media/connector-microsoft-fabric-lakehouse/microsoft-fabric-lakehouse-connector.png" alt-text="Screenshot showing select Microsoft Fabric Lakehouse connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-microsoft-fabric-lakehouse/configure-microsoft-fabric-lakehouse-linked-service.png" alt-text="Screenshot of configuration for Microsoft Fabric Lakehouse linked service.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to Microsoft Fabric Lakehouse.

## Linked service properties

The Microsoft Fabric Lakehouse connector supports the following authentication types. See the corresponding sections for details:

- [Service principal authentication](#service-principal-authentication)

### Service principal authentication

To use service principal authentication, follow these steps.

1. [Register an application with the Microsoft Identity platform](../active-directory/develop/quickstart-register-app.md) and [add a client secret](../active-directory/develop/quickstart-register-app.md#add-a-client-secret). Afterwards, make note of these values, which you use to define the linked service:

    - Application (client) ID, which is the service principal ID in the linked service.
    - Client secret value, which is the service principal key in the linked service.
    - Tenant ID

2. Grant the service principal at least the **Contributor** role in Microsoft Fabric workspace. Follow these steps:
    1. Go to your Microsoft Fabric workspace, select **Manage access** on the top bar. Then select **Add people or groups**.
    
        :::image type="content" source="media/connector-microsoft-fabric-lakehouse/fabric-workspace-manage-access.png" alt-text="Screenshot shows selecting Fabric workspace Manage access."::: 

        :::image type="content" source="media/connector-microsoft-fabric-lakehouse/manage-access-pane.png" alt-text=" Screenshot shows Fabric workspace Manage access pane."::: 
    
    1. In **Add people** pane, enter your service principal name, and select your service principal from the drop-down list.
    
    1. Specify the role as **Contributor** or higher (Admin, Member), then select **Add**.
        
        :::image type="content" source="media/connector-microsoft-fabric-lakehouse/select-workspace-role.png" alt-text="Screenshot shows adding Fabric workspace role."::: 

    1. Your service principal is displayed on **Manage access** pane.
    
These properties are supported for the linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **Lakehouse**. |Yes |
| workspaceId | The Microsoft Fabric workspace ID. | Yes |
| artifactId | The Microsoft Fabric Lakehouse object ID. | Yes |
| tenant | Specify the tenant information (domain name or tenant ID) under which your application resides. Retrieve it by hovering the mouse in the upper-right corner of the Azure portal. | Yes |
| servicePrincipalId | Specify the application's client ID. | Yes |
| servicePrincipalCredentialType | The credential type to use for service principal authentication. Allowed values are **ServicePrincipalKey** and **ServicePrincipalCert**. | Yes |
| servicePrincipalCredential | The service principal credential. <br/> When you use **ServicePrincipalKey** as the credential type, specify the application's client secret value. Mark this field as **SecureString** to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). <br/> When you use **ServicePrincipalCert** as the credential, reference a certificate in Azure Key Vault, and ensure the certificate content type is **PKCS #12**.| Yes |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use the Azure integration runtime or a self-hosted integration runtime if your data store is in a private network. If not specified, the default Azure integration runtime is used. |No |

**Example: using service principal key authentication**

You can also store service principal key in Azure Key Vault.

```json
{
    "name": "MicrosoftFabricLakehouseLinkedService",
    "properties": {
        "type": "Lakehouse",
        "typeProperties": {
            "workspaceId": "<Microsoft Fabric workspace ID>",
            "artifactId": "<Microsoft Fabric Lakehouse object ID>",
            "tenant": "<tenant info, e.g. microsoft.onmicrosoft.com>",
            "servicePrincipalId": "<service principal id>",
            "servicePrincipalCredentialType": "ServicePrincipalKey",
            "servicePrincipalCredential": {
                "type": "SecureString",
                "value": "<service principal key>"
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

Microsoft Fabric Lakehouse connector supports two types of datasets, which are Microsoft Fabric Lakehouse Files dataset
and Microsoft Fabric Lakehouse Table dataset. See the corresponding sections for details.

- [Microsoft Fabric Lakehouse Files dataset](#microsoft-fabric-lakehouse-files-dataset)
- [Microsoft Fabric Lakehouse Table dataset](#microsoft-fabric-lakehouse-table-dataset)

For a full list of sections and properties available for defining datasets, see [Datasets](concepts-datasets-linked-services.md). 

### Microsoft Fabric Lakehouse Files dataset

Microsoft Fabric Lakehouse connector supports the following file formats. Refer to each article for format-based settings.

- [Avro format](format-avro.md)
- [Binary format](format-binary.md)
- [Delimited text format](format-delimited-text.md)
- [JSON format](format-json.md)
- [ORC format](format-orc.md)
- [Parquet format](format-parquet.md)

The following properties are supported under `location` settings in the format-based Microsoft Fabric Lakehouse Files dataset:

| Property   | Description                                                  | Required |
| ---------- | ------------------------------------------------------------ | -------- |
| type       | The type property under `location` in the dataset must be set to **LakehouseLocation**. | Yes      |
| folderPath | The path to a folder. If you want to use a wildcard to filter folders, skip this setting and specify it in activity source settings. | No       |
| fileName   | The file name under the given folderPath. If you want to use a wildcard to filter files, skip this setting and specify it in activity source settings. | No       |

**Example:**

```json
{
    "name": "DelimitedTextDataset",
    "properties": {
        "type": "DelimitedText",
        "linkedServiceName": {
            "referenceName": "<Microsoft Fabric Lakehouse linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "location": {
                "type": "LakehouseLocation",
                "fileName": "<file name>",
                "folderPath": "<folder name>"
            },
            "columnDelimiter": ",",
            "compressionCodec": "gzip",
            "escapeChar": "\\",
            "firstRowAsHeader": true,
            "quoteChar": "\""
        },
        "schema": [ < physical schema, optional, auto retrieved during authoring > ]
    }
}
```

### Microsoft Fabric Lakehouse Table dataset

The following properties are supported for Microsoft Fabric Lakehouse Table dataset:

| Property  | Description                                                  | Required                    |
| :-------- | :----------------------------------------------------------- | :-------------------------- |
| type      | The **type** property of the dataset must be set to **LakehouseTable**. | Yes                         |
| table | The name of your table. | Yes |

**Example:**

```json
{ 
    "name": "LakehouseTableDataset", 
    "properties": {
        "type": "LakehouseTable",
        "linkedServiceName": { 
            "referenceName": "<Microsoft Fabric Lakehouse linked service name>", 
            "type": "LinkedServiceReference" 
        }, 
        "typeProperties": { 
            "table": "<table_name>"   
        }, 
        "schema": [< physical schema, optional, retrievable during authoring >] 
    } 
}
```

## Copy activity properties

The copy activity properties for Microsoft Fabric Lakehouse Files dataset and Microsoft Fabric Lakehouse Table dataset are different. See the corresponding sections for details.

- [Microsoft Fabric Lakehouse Files in Copy activity](#microsoft-fabric-lakehouse-files-in-copy-activity)
- [Microsoft Fabric Lakehouse Table in Copy activity](#microsoft-fabric-lakehouse-table-in-copy-activity)

For a full list of sections and properties available for defining activities, see [Copy activity configurations](copy-activity-overview.md#configuration) and [Pipelines and activities](concepts-pipelines-activities.md).

### Microsoft Fabric Lakehouse Files in Copy activity

To use Microsoft Fabric Lakehouse Files dataset type as a source or sink in Copy activity, go to the following sections for the detailed configurations.

#### Microsoft Fabric Lakehouse Files as a source type

Microsoft Fabric Lakehouse connector supports the following file formats. Refer to each article for format-based settings.

- [Avro format](format-avro.md)
- [Binary format](format-binary.md)
- [Delimited text format](format-delimited-text.md)
- [JSON format](format-json.md)
- [ORC format](format-orc.md)
- [Parquet format](format-parquet.md)

You have several options to copy data from Microsoft Fabric Lakehouse using the Microsoft Fabric Lakehouse Files dataset:

- Copy from the given path specified in the dataset.
- Wildcard filter against folder path or file name, see `wildcardFolderPath` and `wildcardFileName`.
- Copy the files defined in a given text file as file set, see `fileListPath`.

The following properties are under `storeSettings` settings in format-based copy source when using Microsoft Fabric Lakehouse Files dataset:

| Property                 | Description                                                  | Required                                      |
| ------------------------ | ------------------------------------------------------------ | --------------------------------------------- |
| type                     | The type property under `storeSettings` must be set to **LakehouseReadSettings**. | Yes                                           |
| ***Locate the files to copy:*** |  |  |
| OPTION 1: static path<br> | Copy from the folder/file path specified in the dataset. If you want to copy all files from a folder, additionally specify `wildcardFileName` as `*`. |  |
| OPTION 2: wildcard<br>- wildcardFolderPath | The folder path with wildcard characters to filter source folders. <br>Allowed wildcards are: `*` (matches zero or more characters) and `?` (matches zero or single character); use `^` to escape if your actual folder name has wildcard or this escape char inside. <br>See more examples in [Folder and file filter examples](#folder-and-file-filter-examples). | No                                            |
| OPTION 2: wildcard<br>- wildcardFileName | The file name with wildcard characters under the given folderPath/wildcardFolderPath to filter source files. <br>Allowed wildcards are: `*` (matches zero or more characters) and `?` (matches zero or single character); use `^` to escape if your actual file name has wildcard or this escape char inside.  See more examples in [Folder and file filter examples](#folder-and-file-filter-examples). | Yes |
| OPTION 3: a list of files<br>- fileListPath | Indicates to copy a given file set. Point to a text file that includes a list of files you want to copy, one file per line, which is the relative path to the path configured in the dataset.<br/>When using this option, don't specify file name in dataset. See more examples in [File list examples](#file-list-examples). |No |
| ***Additional settings:*** |  | |
| recursive | Indicates whether the data is read recursively from the subfolders or only from the specified folder. When recursive is set to true and the sink is a file-based store, an empty folder or subfolder isn't copied or created at the sink. <br>Allowed values are **true** (default) and **false**.<br>This property doesn't apply when you configure `fileListPath`. |No |
| deleteFilesAfterCompletion | Indicates whether the binary files will be deleted from source store after successfully moving to the destination store. The file deletion is per file, so when copy activity fails, you see some files have already been copied to the destination and deleted from source, while others are still remaining on source store. <br/>This property is only valid in binary files copy scenario. The default value: false. |No |
| modifiedDatetimeStart    | Files filter based on the attribute: Last Modified. <br>The files will be selected if their last modified time is greater than or equal to `modifiedDatetimeStart` and less than `modifiedDatetimeEnd`. The time is applied to UTC time zone in the format of "2018-12-01T05:00:00Z". <br> The properties can be NULL, which means no file attribute filter is applied to the dataset.  When `modifiedDatetimeStart` has datetime value but `modifiedDatetimeEnd` is NULL, it means the files whose last modified attribute is greater than or equal with the datetime value will be selected.  When `modifiedDatetimeEnd` has datetime value but `modifiedDatetimeStart` is NULL, it means the files whose last modified attribute is less than the datetime value will be selected.<br/>This property doesn't apply when you configure `fileListPath`. | No                                            |
| modifiedDatetimeEnd      | Same as above.                                               | No                                            |
| enablePartitionDiscovery | For files that are partitioned, specify whether to parse the partitions from the file path and add them as another source columns.<br/>Allowed values are **false** (default) and **true**. | No                                            |
| partitionRootPath | When partition discovery is enabled, specify the absolute root path in order to read partitioned folders as data columns.<br/><br/>If it isn't specified, by default,<br/>- When you use file path in dataset or list of files on source, partition root path is the path configured in dataset.<br/>- When you use wildcard folder filter, partition root path is the subpath before the first wildcard.<br/><br/>For example, assuming you configure the path in dataset as "root/folder/year=2020/month=08/day=27":<br/>- If you specify partition root path as "root/folder/year=2020", copy activity generates two more columns `month` and `day` with value "08" and "27" respectively, in addition to the columns inside the files.<br/>- If partition root path isn't specified, no extra column is generated. | No                                            |
| maxConcurrentConnections | The upper limit of concurrent connections established to the data store during the activity run. Specify a value only when you want to limit concurrent connections.| No                                            |

**Example:**

```json
"activities": [
    {
        "name": "CopyFromLakehouseFiles",
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
                "storeSettings": {
                    "type": "LakehouseReadSettings",
                    "recursive": true,
                    "enablePartitionDiscovery": false
                },
                "formatSettings": {
                    "type": "DelimitedTextReadSettings"
                }
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```


#### Microsoft Fabric Lakehouse Files as a sink type

Microsoft Fabric Lakehouse connector supports the following file formats. Refer to each article for format-based settings.

- [Avro format](format-avro.md)
- [Binary format](format-binary.md)
- [Delimited text format](format-delimited-text.md)
- [JSON format](format-json.md)
- [ORC format](format-orc.md)
- [Parquet format](format-parquet.md)

The following properties are under `storeSettings` settings in format-based copy sink when using Microsoft Fabric Lakehouse Files dataset:

| Property                 | Description                                                  | Required |
| ------------------------ | ------------------------------------------------------------ | -------- |
| type                     | The type property under `storeSettings` must be set to **LakehouseWriteSettings**. | Yes      |
| copyBehavior             | Defines the copy behavior when the source is files from a file-based data store.<br/><br/>Allowed values are:<br/><b>- PreserveHierarchy (default)</b>: Preserves the file hierarchy in the target folder. The relative path of the source file to the source folder is identical to the relative path of the target file to the target folder.<br/><b>- FlattenHierarchy</b>: All files from the source folder are in the first level of the target folder. The target files have autogenerated names. <br/><b>- MergeFiles</b>: Merges all files from the source folder to one file. If the file name is specified, the merged file name is the specified name. Otherwise, it's an autogenerated file name. | No       |
| blockSizeInMB | Specify the block size in MB used to write data to Microsoft Fabric Lakehouse. Learn more [about Block Blobs](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs#about-block-blobs). <br/>Allowed value is **between 4 MB and 100 MB**. <br/>By default, ADF automatically determines the block size based on your source store type and data. For nonbinary copy into Microsoft Fabric Lakehouse, the default block size is 100 MB so as to fit in at most approximately 4.75-TB data. It might be not optimal when your data isn't large, especially when you use Self-hosted Integration Runtime with poor network resulting in operation timeout or performance issue. You can explicitly specify a block size, while ensure blockSizeInMB*50000 is large enough to store the data, otherwise copy activity run fails. | No |
| maxConcurrentConnections | The upper limit of concurrent connections established to the data store during the activity run. Specify a value only when you want to limit concurrent connections.| No       |
| metadata |Set custom metadata when copy to sink. Each object under the `metadata` array represents an extra column. The `name` defines the metadata key name, and the `value` indicates the data value of that key. If [preserve attributes feature](./copy-activity-preserve-metadata.md#preserve-metadata) is used, the specified metadata will union/overwrite with the source file metadata.<br/><br/>Allowed data values are:<br/>- `$$LASTMODIFIED`: a reserved variable indicates to store the source files' last modified time. Apply to file-based source with binary format only.<br/><b>- Expression<b><br/>- <b>Static value<b>| No       |

**Example:**

```json
"activities": [
    {
        "name": "CopyToLakehouseFiles",
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
                "storeSettings": {
                    "type": "LakehouseWriteSettings",
                    "copyBehavior": "PreserveHierarchy",
                    "metadata": [
                        {
                            "name": "testKey1",
                            "value": "value1"
                        },
                        {
                            "name": "testKey2",
                            "value": "value2"
                        }
                    ]
                },
                "formatSettings": {
                    "type": "ParquetWriteSettings"
                }
            }
        }
    }
]
```

#### Folder and file filter examples

This section describes the resulting behavior of the folder path and file name with wildcard filters.

| folderPath | fileName | recursive | Source folder structure and filter result (files in **bold** are retrieved)|
|:--- |:--- |:--- |:--- |
| `Folder*` | (Empty, use default) | false | FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File2.json**<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3.csv<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5.csv<br/>AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |
| `Folder*` | (Empty, use default) | true | FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File2.json**<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File3.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File4.json**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File5.csv**<br/>AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |
| `Folder*` | `*.csv` | false | FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3.csv<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5.csv<br/>AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |
| `Folder*` | `*.csv` | true | FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File3.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File5.csv**<br/>AnotherFolderB<br/>&nbsp;&nbsp;&nbsp;&nbsp;File6.csv |

#### File list examples

This section describes the resulting behavior of using file list path in copy activity source.

Assuming you have the following source folder structure and want to copy the files in bold:

| Sample source structure                                      | Content in FileListToCopy.txt                             | ADF configuration                                            |
| ------------------------------------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------ |
| filesystem<br/>&nbsp;&nbsp;&nbsp;&nbsp;FolderA<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File1.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File2.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File3.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4.json<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**File5.csv**<br/>&nbsp;&nbsp;&nbsp;&nbsp;Metadata<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FileListToCopy.txt | File1.csv<br>Subfolder1/File3.csv<br>Subfolder1/File5.csv | **In dataset:**<br>- Folder path: `FolderA`<br><br>**In copy activity source:**<br>- File list path: `Metadata/FileListToCopy.txt` <br><br>The file list path points to a text file in the same data store that includes a list of files you want to copy, one file per line with the relative path to the path configured in the dataset. |


#### Some recursive and copyBehavior examples

This section describes the resulting behavior of the copy operation for different combinations of recursive and copyBehavior values.

| recursive | copyBehavior | Source folder structure | Resulting target |
|:--- |:--- |:--- |:--- |
| true |preserveHierarchy | Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5 | The target Folder1 is created with the same structure as the source:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5 |
| true |flattenHierarchy | Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5 | The target Folder1 is created with the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;autogenerated name for File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;autogenerated name for File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;autogenerated name for File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;autogenerated name for File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;autogenerated name for File5 |
| true |mergeFiles | Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5 | The target Folder1 is created with the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1 + File2 + File3 + File4 + File5 contents are merged into one file with an autogenerated file name. |
| false |preserveHierarchy | Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5 | The target Folder1 is created with the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/><br/>Subfolder1 with File3, File4, and File5 isn't picked up. |
| false |flattenHierarchy | Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5 | The target Folder1 is created with the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;autogenerated name for File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;autogenerated name for File2<br/><br/>Subfolder1 with File3, File4, and File5 isn't picked up. |
| false |mergeFiles | Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5 | The target Folder1 is created with the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1 + File2 contents are merged into one file with an autogenerated file name. autogenerated name for File1<br/><br/>Subfolder1 with File3, File4, and File5 isn't picked up. |


### Microsoft Fabric Lakehouse Table in Copy activity

To use Microsoft Fabric Lakehouse Table dataset as a source or sink dataset in Copy activity, go to the following sections for the detailed configurations.

#### Microsoft Fabric Lakehouse Table as a source type

To copy data from Microsoft Fabric Lakehouse using Microsoft Fabric Lakehouse Table dataset, set the **type** property in the Copy activity source to **LakehouseTableSource**. The following properties are supported in the Copy activity **source** section:

| Property                     | Description                                                  | Required |
| :--------------------------- | :----------------------------------------------------------- | :------- |
| type                         | The **type** property of the Copy Activity source must be set to **LakehouseTableSource**. | Yes      |
| timestampAsOf                      | 	The timestamp to query an older snapshot. | No      |
| versionAsOf                       | The version to query an older snapshot. | No     |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromLakehouseTable",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Microsoft Fabric Lakehouse Table input dataset name>",
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
                "type": "LakehouseTableSource",
                "timestampAsOf": "2023-09-23T00:00:00.000Z",
                "versionAsOf": 2
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

#### Microsoft Fabric Lakehouse Table as a sink type

To copy data to Microsoft Fabric Lakehouse using Microsoft Fabric Lakehouse Table dataset, set the **type** property in the Copy Activity sink to **LakehouseTableSink**. The following properties are supported in the Copy activity **sink** section:

| Property                     | Description                                                  | Required |
| :--------------------------- | :----------------------------------------------------------- | :------- |
| type                         | The **type** property of the Copy Activity source must be set to **LakehouseTableSink**. | Yes      |

>[!Note]
> Data is written to Lakehouse Table in V-Order by default. For more information, go to [Delta Lake table optimization and V-Order](/fabric/data-engineering/delta-optimization-and-v-order?tabs=sparksql#what-is-v-order).

**Example:**

```json
"activities":[
    {
        "name": "CopyToLakehouseTable",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<Microsoft Fabric Lakehouse Table output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "LakehouseTableSink",
                "tableActionOption ": "Append"
            }
        }
    }
]
```

## Mapping data flow properties

When transforming data in mapping data flow, you can read and write to files or tables in Microsoft Fabric Lakehouse. See the corresponding sections for details.

- [Microsoft Fabric Lakehouse Files in mapping data flow](#microsoft-fabric-lakehouse-files-in-mapping-data-flow)
- [Microsoft Fabric Lakehouse Table in mapping data flow](#microsoft-fabric-lakehouse-table-in-mapping-data-flow)

For more information, see the [source transformation](data-flow-source.md) and [sink transformation](data-flow-sink.md) in mapping data flows.

### Microsoft Fabric Lakehouse Files in mapping data flow

To use Microsoft Fabric Lakehouse Files dataset as a source or sink dataset in mapping data flow, go to the following sections for the detailed configurations.

#### Microsoft Fabric Lakehouse Files as a source or sink type

Microsoft Fabric Lakehouse connector supports the following file formats. Refer to each article for format-based settings.

- [Avro format](format-avro.md)
- [Delimited text format](format-delimited-text.md)
- [JSON format](format-json.md)
- [ORC format](format-orc.md)
- [Parquet format](format-parquet.md)
  
To use Fabric Lakehouse file-based connector in inline dataset type, you need to choose the right Inline dataset type for your data. You can use DelimitedText, Avro, JSON, ORC, or Parquet depending on your data format.

### Microsoft Fabric Lakehouse Table in mapping data flow

To use Microsoft Fabric Lakehouse Table dataset as a source or sink dataset in mapping data flow, go to the following sections for the detailed configurations.

#### Microsoft Fabric Lakehouse Table as a source type

There are no configurable properties under source options.
> [!NOTE]
> CDC support for Lakehouse table source is currently not available.

#### Microsoft Fabric Lakehouse Table as a sink type

The following properties are supported in the Mapping Data Flows **sink** section:

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Update method | When you select "Allow insert" alone or when you write to a new delta table, the target receives all incoming rows regardless of the Row policies set. If your data contains rows of other Row policies, they need to be excluded using a preceding Filter transform. <br><br> When all Update methods are selected a Merge is performed, where rows are inserted/deleted/upserted/updated as per the Row Policies set using a preceding Alter Row transform. | yes | `true` or `false` | insertable <br> deletable <br> upsertable <br> updateable  |
| Optimized Write | Achieve higher throughput for write operation via optimizing internal shuffle in Spark executors. As a result, you might notice fewer partitions and files that are of a larger size | no | `true` or `false` | optimizedWrite: true |
| Auto Compact | After any write operation has completed, Spark will automatically execute the ```OPTIMIZE``` command to reorganize the data, resulting in more partitions if necessary, for better reading performance in the future | no | `true` or `false` |    autoCompact: true | 
| Merge Schema | Merge schema option allows schema evolution, that is, any columns that are present in the current incoming stream but not in the target Delta table is automatically added to its schema. This option is supported across all update methods. | no | `true` or `false` |    mergeSchema: true | 

**Example: Microsoft Fabric Lakehouse Table sink**

```
sink(allowSchemaDrift: true, 
    validateSchema: false, 
    input( 
        CustomerID as string,
        NameStyle as string, 
        Title as string, 
        FirstName as string, 
        MiddleName as string,
        LastName as string, 
        Suffix as string, 
        CompanyName as string,
        SalesPerson as string, 
        EmailAddress as string, 
        Phone as string, 
        PasswordHash as string, 
        PasswordSalt as string, 
        rowguid as string, 
        ModifiedDate as string 
    ), 
    deletable:false, 
    insertable:true, 
    updateable:false, 
    upsertable:false, 
    optimizedWrite: true, 
    mergeSchema: true, 
    autoCompact: true, 
    skipDuplicateMapInputs: true, 
    skipDuplicateMapOutputs: true) ~> CustomerTable

```
For Fabric Lakehouse table-based connector in inline dataset type, you only need to use Delta as dataset type. This will allow you to read and write data from Fabric Lakehouse tables.

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## GetMetadata activity properties

To learn details about the properties, check [GetMetadata activity](control-flow-get-metadata-activity.md) 

## Delete activity properties

To learn details about the properties, check [Delete activity](delete-activity.md)

## Related content

For a list of data stores supported as sources and sinks by the copy activity, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
