---
title: XML format
titleSuffix: Azure Data Factory & Azure Synapse
description: This topic describes how to deal with XML format in Azure Data Factory and Synapse Analytics pipelines.
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 07/17/2023
ms.author: jianleishen
---

# XML format in Azure Data Factory and Synapse Analytics pipelines

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Follow this article when you want to **parse the XML files**. 

XML format is supported for the following connectors: [Amazon S3](connector-amazon-simple-storage-service.md), [Amazon S3 Compatible Storage](connector-amazon-s3-compatible-storage.md), [Azure Blob](connector-azure-blob-storage.md), [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md), [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md), [Azure Files](connector-azure-file-storage.md), [File System](connector-file-system.md), [FTP](connector-ftp.md), [Google Cloud Storage](connector-google-cloud-storage.md), [HDFS](connector-hdfs.md), [HTTP](connector-http.md),  [Oracle Cloud Storage](connector-oracle-cloud-storage.md) and [SFTP](connector-sftp.md). It is supported as source but not sink.

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by the XML dataset.

| Property         | Description                                                  | Required |
| ---------------- | ------------------------------------------------------------ | -------- |
| type             | The type property of the dataset must be set to **Xml**. | Yes      |
| location         | Location settings of the file(s). Each file-based connector has its own location type and supported properties under `location`. **See details in connector article -> Dataset properties section**. | Yes      |
| encodingName     | The encoding type used to read/write test files. <br>Allowed values are as follows: "UTF-8", "UTF-16", "UTF-16BE", "UTF-32", "UTF-32BE", "US-ASCII", "UTF-7", "BIG5", "EUC-JP", "EUC-KR", "GB2312", "GB18030", "JOHAB", "SHIFT-JIS", "CP875", "CP866", "IBM00858", "IBM037", "IBM273", "IBM437", "IBM500", "IBM737", "IBM775", "IBM850", "IBM852", "IBM855", "IBM857", "IBM860", "IBM861", "IBM863", "IBM864", "IBM865", "IBM869", "IBM870", "IBM01140", "IBM01141", "IBM01142", "IBM01143", "IBM01144", "IBM01145", "IBM01146", "IBM01147", "IBM01148", "IBM01149", "ISO-2022-JP", "ISO-2022-KR", "ISO-8859-1", "ISO-8859-2", "ISO-8859-3", "ISO-8859-4", "ISO-8859-5", "ISO-8859-6", "ISO-8859-7", "ISO-8859-8", "ISO-8859-9", "ISO-8859-13", "ISO-8859-15", "WINDOWS-874", "WINDOWS-1250", "WINDOWS-1251", "WINDOWS-1252", "WINDOWS-1253", "WINDOWS-1254", "WINDOWS-1255", "WINDOWS-1256", "WINDOWS-1257", "WINDOWS-1258".| No       |
| nullValue | Specifies the string representation of null value.<br/>The default value is **empty string**. | No |
| compression | Group of properties to configure file compression. Configure this section when you want to do compression/decompression during activity execution. | No |
| type<br>(*under `compression`*) | The compression codec used to read/write XML files. <br>Allowed values are **bzip2**, **gzip**, **deflate**, **ZipDeflate**, **TarGzip**, **Tar**, **snappy**, or **lz4**. Default is not compressed.<br>**Note** currently Copy activity doesn't support "snappy" & "lz4", and mapping data flow doesn't support "ZipDeflate", "TarGzip" and "Tar".<br>**Note** when using copy activity to decompress **ZipDeflate**/**TarGzip**/**Tar** file(s) and write to file-based sink data store, by default files are extracted to the folder:`<path specified in dataset>/<folder named as source compressed file>/`, use `preserveZipFileNameAsFolder`/`preserveCompressionFileNameAsFolder` on [copy activity source](#xml-as-source) to control whether to preserve the name of the compressed file(s) as folder structure. | No.  |
| level<br/>(*under `compression`*) | The compression ratio. <br>Allowed values are **Optimal** or **Fastest**.<br>- **Fastest:** The compression operation should complete as quickly as possible, even if the resulting file is not optimally compressed.<br>- **Optimal**: The compression operation should be optimally compressed, even if the operation takes a longer time to complete. For more information, see [Compression Level](/dotnet/api/system.io.compression.compressionlevel) topic. | No       |

Below is an example of XML dataset on Azure Blob Storage:

```json
{
    "name": "XMLDataset",
    "properties": {
        "type": "Xml",
        "linkedServiceName": {
            "referenceName": "<Azure Blob Storage linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "location": {
                "type": "AzureBlobStorageLocation",
                "container": "containername",
                "folderPath": "folder/subfolder",
            },
            "compression": {
                "type": "ZipDeflate"
            }
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by the XML source.

Learn about how to map XML data and sink data store/format from [schema mapping](copy-activity-schema-and-type-mapping.md). When previewing XML files, data is shown with JSON hierarchy, and you use JSON path to point to the fields.

### XML as source

The following properties are supported in the copy activity ***\*source\**** section. Learn more from [XML connector behavior](#xml-connector-behavior).

| Property      | Description                                                  | Required |
| ------------- | ------------------------------------------------------------ | -------- |
| type          | The type property of the copy activity source must be set to **XmlSource**. | Yes      |
| formatSettings | A group of properties. Refer to **XML read settings** table below. | No       |
| storeSettings | A group of properties on how to read data from a data store. Each file-based connector has its own supported read settings under `storeSettings`. **See details in connector article -> Copy activity properties section**. | No       |

Supported **XML read settings** under `formatSettings`:

| Property      | Description                                                  | Required |
| ------------- | ------------------------------------------------------------ | -------- |
| type          | The type of formatSettings must be set to **XmlReadSettings**. | Yes      |
| validationMode | Specifies whether to validate the XML schema.<br>Allowed values are **none** (default, no validation), **xsd** (validate using XSD), **dtd** (validate using DTD). | No |
| namespaces | Whether to enable namespace when parsing the XML files. Allowed values are: **true** (default), **false**. | No |
| namespacePrefixes | Namespace URI to prefix mapping, which is used to name fields when parsing the xml file.<br/>If an XML file has namespace and namespace is enabled, by default, the field name is the same as it is in the XML document.<br>If there is an item defined for the namespace URI in this map, the field name is `prefix:fieldName`. | No |
| detectDataType | Whether to detect integer, double, and Boolean data types. Allowed values are: **true** (default), **false**.| No |
| compressionProperties | A group of properties on how to decompress data for a given compression codec. | No       |
| preserveZipFileNameAsFolder<br>(*under `compressionProperties`->`type` as `ZipDeflateReadSettings`*)  | Applies when input dataset is configured with **ZipDeflate** compression. Indicates whether to preserve the source zip file name as folder structure during copy.<br>- When set to **true (default)**, the service writes unzipped files to `<path specified in dataset>/<folder named as source zip file>/`.<br>- When set to **false**, the service writes unzipped files directly to `<path specified in dataset>`. Make sure you don't have duplicated file names in different source zip files to avoid racing or unexpected behavior.  | No |
| preserveCompressionFileNameAsFolder<br>(*under `compressionProperties`->`type` as `TarGZipReadSettings` or `TarReadSettings`*) | Applies when input dataset is configured with **TarGzip**/**Tar** compression. Indicates whether to preserve the source compressed file name as folder structure during copy.<br>- When set to **true (default)**, the service writes decompressed files to `<path specified in dataset>/<folder named as source compressed file>/`. <br>- When set to **false**, the service writes decompressed files directly to `<path specified in dataset>`. Make sure you don't have duplicated file names in different source files to avoid racing or unexpected behavior. | No |

## Mapping data flow properties

In mapping data flows, you can read XML format in the following data stores: [Azure Blob Storage](connector-azure-blob-storage.md#mapping-data-flow-properties), [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md#mapping-data-flow-properties), [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md#mapping-data-flow-properties), [Amazon S3](connector-amazon-simple-storage-service.md#mapping-data-flow-properties) and [SFTP](connector-sftp.md#mapping-data-flow-properties). You can point to XML files either using XML dataset or using an [inline dataset](data-flow-source.md#inline-datasets).

### Source properties

The below table lists the properties supported by an XML source. You can edit these properties in the **Source options** tab. Learn more from [XML connector behavior](#xml-connector-behavior). When using inline dataset, you will see additional file settings, which are the same as the properties described in [dataset properties](#dataset-properties) section. 

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Wild card paths | All files matching the wildcard path will be processed. Overrides the folder and file path set in the dataset. | No | String[] | wildcardPaths |
| Partition root path | For file data that is partitioned, you can enter a partition root path in order to read partitioned folders as columns | No | String | partitionRootPath |
| List of files | Whether your source is pointing to a text file that lists files to process | No | `true` or `false` | fileList |
| Column to store file name | Create a new column with the source file name and path | No | String | rowUrlColumn |
| After completion | Delete or move the files after processing. File path starts from the container root | No | Delete: `true` or `false` <br> Move: `['<from>', '<to>']` | purgeFiles <br>moveFiles |
| Filter by last modified | Choose to filter files based upon when they were last altered | No | Timestamp | modifiedAfter <br>modifiedBefore |
| Validation mode | Specifies whether to validate the XML schema. | No | `None` (default, no validation)<br>`xsd` (validate using XSD)<br>`dtd` (validate using DTD). | validationMode |
| Namespaces | Whether to enable namespace when parsing the XML files. | No | `true` (default) or `false` | namespaces |
| Namespace prefix pairs | Namespace URI to prefix mapping, which is used to name fields when parsing the xml file.<br/>If an XML file has namespace and namespace is enabled, by default, the field name is the same as it is in the XML document.<br>If there is an item defined for the namespace URI in this map, the field name is `prefix:fieldName`. | No | Array with pattern`['URI1'->'prefix1','URI2'->'prefix2']` | namespacePrefixes |
| Allow no files found | If true, an error is not thrown if no files are found | no | `true` or `false` | ignoreNoFilesFound |

### XML source script example

The below script is an example of an XML source configuration in mapping data flows using dataset mode.

```
source(allowSchemaDrift: true,
    validateSchema: false,
    validationMode: 'xsd',
    namespaces: true) ~> XMLSource
```

The below script is an example of an XML source configuration using inline dataset mode.

```
source(allowSchemaDrift: true,
    validateSchema: false,
    format: 'xml',
    fileSystem: 'filesystem',
    folderPath: 'folder',
    validationMode: 'xsd',
    namespaces: true) ~> XMLSource
```

## XML connector behavior

Note the following when using XML as source.

- XML attributes:

    - Attributes of an element are parsed as the subfields of the element in the hierarchy.
    - The name of the attribute field follows the pattern `@attributeName`.

- XML schema validation:

    - You can choose to not validate schema, or validate schema using XSD or DTD.
    - When using XSD or DTD to validate XML files, the XSD/DTD must be referred inside the XML files through relative path.

- Namespace handling:

    - Namespace can be disabled when using data flow, in which case the attributes that defines the namespace will be parsed as normal attributes.
    - When namespace is enabled, the names of the element and attributes follow the pattern       `namespaceUri,elementName` and `namespaceUri,@attributeName` by default. You can define namespace prefix for each namespace URI in source, in which case the names of the element and attributes follow the pattern `definedPrefix:elementName` or `definedPrefix:@attributeName` instead.

- Value column:

    - If an XML element has both simple text value and attributes/child elements, the simple text value       is parsed as the value of a "value column" with built-in field name `_value_`. And it inherits the namespace of the element as well if applies.

## Next steps

- [Copy activity overview](copy-activity-overview.md)
- [Mapping data flow](concepts-data-flow-overview.md)
- [Lookup activity](control-flow-lookup-activity.md)
- [GetMetadata activity](control-flow-get-metadata-activity.md)
