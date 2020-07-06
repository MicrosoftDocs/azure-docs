---
title: ORC format in Azure Data Factory 
description: 'This topic describes how to deal with ORC format in Azure Data Factory.'
author: linda33wj
manager: shwang
ms.reviewer: craigg

ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.date: 10/24/2019
ms.author: jingwang

---

# ORC format in Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Follow this article when you want to **parse the ORC files or write the data into ORC format**. 

ORC format is supported for the following connectors: [Amazon S3](connector-amazon-simple-storage-service.md), [Azure Blob](connector-azure-blob-storage.md), [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md), [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md), [Azure File Storage](connector-azure-file-storage.md), [File System](connector-file-system.md), [FTP](connector-ftp.md), [Google Cloud Storage](connector-google-cloud-storage.md), [HDFS](connector-hdfs.md), [HTTP](connector-http.md), and [SFTP](connector-sftp.md).

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by the ORC dataset.

| Property         | Description                                                  | Required |
| ---------------- | ------------------------------------------------------------ | -------- |
| type             | The type property of the dataset must be set to **Orc**. | Yes      |
| location         | Location settings of the file(s). Each file-based connector has its own location type and supported properties under `location`. **See details in connector article -> Dataset properties section**. | Yes      |

Below is an example of ORC dataset on Azure Blob Storage:

```json
{
    "name": "ORCDataset",
    "properties": {
        "type": "Orc",
        "linkedServiceName": {
            "referenceName": "<Azure Blob Storage linked service name>",
            "type": "LinkedServiceReference"
        },
        "schema": [ < physical schema, optional, retrievable during authoring > ],
        "typeProperties": {
            "location": {
                "type": "AzureBlobStorageLocation",
                "container": "containername",
                "folderPath": "folder/subfolder",
            }
        }
    }
}
```

Note the following points:

* Complex data types are not supported (STRUCT, MAP, LIST, UNION).
* White space in column name is not supported.
* ORC file has three [compression-related options](https://hortonworks.com/blog/orcfile-in-hdp-2-better-compression-better-performance/): NONE, ZLIB, SNAPPY. Data Factory supports reading data from ORC file in any of these compressed formats. It uses the compression codec is in the metadata to read the data. However, when writing to an ORC file, Data Factory chooses ZLIB, which is the default for ORC. Currently, there is no option to override this behavior.

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by the ORC source and sink.

### ORC as source

The following properties are supported in the copy activity ***\*source\**** section.

| Property      | Description                                                  | Required |
| ------------- | ------------------------------------------------------------ | -------- |
| type          | The type property of the copy activity source must be set to **OrcSource**. | Yes      |
| storeSettings | A group of properties on how to read data from a data store. Each file-based connector has its own supported read settings under `storeSettings`. **See details in connector article -> Copy activity properties section**. | No       |

### ORC as sink

The following properties are supported in the copy activity ***\*sink\**** section.

| Property      | Description                                                  | Required |
| ------------- | ------------------------------------------------------------ | -------- |
| type          | The type property of the copy activity source must be set to **OrcSink**. | Yes      |
| storeSettings | A group of properties on how to write data to a data store. Each file-based connector has its own supported write settings under `storeSettings`. **See details in connector article -> Copy activity properties section**. | No       |

## Using Self-hosted Integration Runtime

> [!IMPORTANT]
> For copy empowered by Self-hosted Integration Runtime e.g. between on-premises and cloud data stores, if you are not copying ORC files **as-is**, you need to install the **64-bit JRE 8 (Java Runtime Environment) or OpenJDK** and **Microsoft Visual C++ 2010 Redistributable Package** on your IR machine. Check the following paragraph with more details.

For copy running on Self-hosted IR with ORC file serialization/deserialization, ADF locates the Java runtime by firstly checking the registry *`(SOFTWARE\JavaSoft\Java Runtime Environment\{Current Version}\JavaHome)`* for JRE, if not found, secondly checking system variable *`JAVA_HOME`* for OpenJDK.

- **To use JRE**: The 64-bit IR requires 64-bit JRE. You can find it from [here](https://go.microsoft.com/fwlink/?LinkId=808605).
- **To use OpenJDK**: It's supported since IR version 3.13. Package the jvm.dll with all other required assemblies of OpenJDK into Self-hosted IR machine, and set system environment variable JAVA_HOME accordingly.
- **To install Visual C++ 2010 Redistributable Package**: Visual C++ 2010 Redistributable Package is not installed with self-hosted IR installations. You can find it from [here](https://www.microsoft.com/download/details.aspx?id=14632).

> [!TIP]
> If you copy data to/from ORC format using Self-hosted Integration Runtime and hit error saying "An error occurred when invoking java, message: **java.lang.OutOfMemoryError:Java heap space**", you can add an environment variable `_JAVA_OPTIONS` in the machine that hosts the Self-hosted IR to adjust the min/max heap size for JVM to empower such copy, then rerun the pipeline.

![Set JVM heap size on Self-hosted IR](./media/supported-file-formats-and-compression-codecs/set-jvm-heap-size-on-selfhosted-ir.png)

Example: set variable `_JAVA_OPTIONS` with value `-Xms256m -Xmx16g`. The flag `Xms` specifies the initial memory allocation pool for a Java Virtual Machine (JVM), while `Xmx` specifies the maximum memory allocation pool. This means that JVM will be started with `Xms` amount of memory and will be able to use a maximum of `Xmx` amount of memory. By default, ADF use min 64 MB and max 1G.

## Next steps

- [Copy activity overview](copy-activity-overview.md)
- [Lookup activity](control-flow-lookup-activity.md)
- [GetMetadata activity](control-flow-get-metadata-activity.md)
