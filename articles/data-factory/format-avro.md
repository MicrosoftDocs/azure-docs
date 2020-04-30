---
title: Avro format in Azure Data Factory 
description: 'This topic describes how to deal with Avro format in Azure Data Factory.'
author: linda33wj
manager: shwang
ms.reviewer: craigg

ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.date: 03/03/2020

ms.author: jingwang

---

# Avro format in Azure Data Factory
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Follow this article when you want to **parse the Avro files or write the data into Avro format**. 

Avro format is supported for the following connectors: [Amazon S3](connector-amazon-simple-storage-service.md), [Azure Blob](connector-azure-blob-storage.md), [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md), [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md), [Azure File Storage](connector-azure-file-storage.md), [File System](connector-file-system.md), [FTP](connector-ftp.md), [Google Cloud Storage](connector-google-cloud-storage.md), [HDFS](connector-hdfs.md), [HTTP](connector-http.md), and [SFTP](connector-sftp.md).

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by the Avro dataset.

| Property         | Description                                                  | Required |
| ---------------- | ------------------------------------------------------------ | -------- |
| type             | The type property of the dataset must be set to **Avro**. | Yes      |
| location         | Location settings of the file(s). Each file-based connector has its own location type and supported properties under `location`. **See details in connector article -> Dataset properties section**. | Yes      |
| avroCompressionCodec | The compression codec to use when writing to Avro files. When reading from Avro files, Data Factory automatically determine the compression codec based on the file metadata.<br>Supported types are "**none**" (default), "**deflate**", "**snappy**". Note currently Copy activity doesn't support Snappy when read/write Avro files. | No       |

> [!NOTE]
> White space in column name is not supported for Avro files.

Below is an example of Avro dataset on Azure Blob Storage:

```json
{
    "name": "AvroDataset",
    "properties": {
        "type": "Avro",
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
            },
            "avroCompressionCodec": "snappy"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by the Avro source and sink.

### Avro as source

The following properties are supported in the copy activity ***\*source\**** section.

| Property      | Description                                                  | Required |
| ------------- | ------------------------------------------------------------ | -------- |
| type          | The type property of the copy activity source must be set to **AvroSource**. | Yes      |
| storeSettings | A group of properties on how to read data from a data store. Each file-based connector has its own supported read settings under `storeSettings`. **See details in connector article -> Copy activity properties section**. | No       |

### Avro as sink

The following properties are supported in the copy activity ***\*sink\**** section.

| Property      | Description                                                  | Required |
| ------------- | ------------------------------------------------------------ | -------- |
| type          | The type property of the copy activity source must be set to **AvroSink**. | Yes      |
| storeSettings | A group of properties on how to write data to a data store. Each file-based connector has its own supported write settings under `storeSettings`. **See details in connector article -> Copy activity properties section**. | No       |

## Data type support

### Copy activity
Avro [complex data types](https://avro.apache.org/docs/current/spec.html#schema_complex) are not supported (records, enums, arrays, maps, unions, and fixed) in Copy Activity.

### Data flows
When working with Avro files in data flows, you can read and write complex data types, but be sure to clear the physical schema from the dataset first. In data flows, you can set your logical projection and derive columns that are complex structures, then auto-map those fields to an Avro file.

## Next steps

- [Copy activity overview](copy-activity-overview.md)
- [Lookup activity](control-flow-lookup-activity.md)
- [GetMetadata activity](control-flow-get-metadata-activity.md)
