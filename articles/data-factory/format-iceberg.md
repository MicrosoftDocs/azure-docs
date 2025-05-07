---
title: Iceberg format in Azure Data Factory
titleSuffix: Azure Data Factory & Azure Synapse
description: This topic describes how to deal with Iceberg format in Azure Data Factory and Azure Synapse Analytics.
author: jianleishen
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 09/12/2024
ms.author: jianleishen
---

# Iceberg format in Azure Data Factory and Azure Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Follow this article when you want to **write the data into Iceberg format**. 

Iceberg format is supported for the following connectors: 

- [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md)

You can use Iceberg dataset in [Copy activity](copy-activity-overview.md).

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by the Iceberg format dataset.

| Property         | Description                                                  | Required |
| ---------------- | ------------------------------------------------------------ | -------- |
| type             | The type property of the dataset must be set to **Iceberg**. | Yes      |
| location         | Location settings of the file(s). Each file-based connector has its own location type and supported properties under `location`.  | Yes      |

Below is an example of Iceberg dataset on Azure Data Lake Storage Gen2:

```json
{
    "name": "IcebergDataset",
    "properties": {
        "type": "Iceberg",
        "linkedServiceName": {
            "referenceName": "<Azure Data Lake Storage Gen2 linked service name>",
            "type": "LinkedServiceReference"
        },
        "schema": [ < physical schema, optional, auto retrieved during authoring >
        ],
        "typeProperties": {
            "location": {
                "type": "AzureBlobFSLocation",
                "fileSystem": "filesystemname",
                "folderPath": "folder/subfolder",
            }
        }
    }
}

```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by the Iceberg sink.

### Iceberg as sink

The following properties are supported in the copy activity ***\*sink\**** section.

| Property       | Description                                                  | Required |
| -------------- | ------------------------------------------------------------ | -------- |
| type           | The type property of the copy activity source must be set to **IcebergSink**. | Yes      |
| formatSettings | A group of properties. Refer to **Iceberg write settings** table below. |    No      |
| storeSettings  | A group of properties on how to write data to a data store. Each file-based connector has its own supported write settings under `storeSettings`.  | No       |

Supported **Iceberg write settings** under `formatSettings`:

| Property      | Description                                                  | Required                                              |
| ------------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| type          | The type of formatSettings must be set to **IcebergWriteSettings**. | Yes                                                   |

## Related connectors and formats

Here are some common connectors and formats related to the delimited text format:

- [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md)
- [Binary format](format-binary.md)
- [Delta format](format-delta.md)
- [Excel format](format-excel.md)
- [JSON format](format-json.md)
- [Parquet format](format-parquet.md)

## Related content

- [Data type mapping in dataset schemas](copy-activity-schema-and-type-mapping.md#data-type-mapping)
- [Copy activity overview](copy-activity-overview.md)