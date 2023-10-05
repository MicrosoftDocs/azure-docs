---
title: Lookup activity
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to use the Lookup Activity in Azure Data Factory and Azure Synapse Analytics to look up a value from an external source. This output can be further referenced by succeeding activities. 
author: jianleishen
ms.author: jianleishen
ms.service: data-factory
ms.subservice: orchestration
ms.custom: synapse
ms.topic: conceptual
ms.date: 07/13/2023
---

# Lookup activity in Azure Data Factory and Azure Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Lookup activity can retrieve a dataset from any of the data sources supported by data factory and Synapse pipelines. You can use it to dynamically determine which objects to operate on in a subsequent activity, instead of hard coding the object name. Some object examples are files and tables.

Lookup activity reads and returns the content of a configuration file or table. It also returns the result of executing a query or stored procedure. The output can be a singleton value or an array of attributes, which can be consumed in a subsequent copy, transformation, or control flow activities like ForEach activity.

## Create a Lookup activity with UI

To use a Lookup activity in a pipeline, complete the following steps:

1. Search for _Lookup_ in the pipeline Activities pane, and drag a Lookup activity to the pipeline canvas.
1. Select the new Lookup activity on the canvas if it is not already selected, and its  **Settings** tab, to edit its details.

   :::image type="content" source="media/control-flow-lookup-activity/lookup-activity.png" alt-text="Shows the UI for a Lookup activity.":::

1. Choose an existing source dataset or select the **New** button to create a new one.
1. The options for identifying rows to include from the source dataset will vary based on the dataset type.  The example above shows the configuration options for a delimited text dataset.  Below are examples of configuration options for an Azure SQL table dataset and an OData dataset.

   :::image type="content" source="media/control-flow-lookup-activity/azure-sql-dataset.png" alt-text="Shows the configuration options in the Lookup activity for an Azure SQL table dataset.":::

   :::image type="content" source="media/control-flow-lookup-activity/odata-dataset.png" alt-text="Shows the configuration options in the Lookup activity for an OData dataset.":::

## Supported capabilities

Note the following:

- The Lookup activity can return up to **5000 rows**; if the result set contains more records, the first 5000 rows will be returned.
- The Lookup activity output supports up to **4 MB** in size, activity will fail if the size exceeds the limit. 
- The longest duration for Lookup activity before timeout is **24 hours**.

> [!Note]
> When you use query or stored procedure to lookup data, make sure to return one and exact one result set. Otherwise, Lookup activity fails.

The following data sources are supported for Lookup activity. 

[!INCLUDE [data-factory-v2-supported-data-stores](includes/data-factory-v2-supported-data-stores-for-lookup-activity.md)]

## Syntax

```json
{
    "name":"LookupActivity",
    "type":"Lookup",
    "typeProperties":{
        "source":{
            "type":"<source type>"
        },
        "dataset":{
            "referenceName":"<source dataset name>",
            "type":"DatasetReference"
        },
        "firstRowOnly":<true or false>
    }
}
```

## Type properties

Name | Description | Type | Required?
---- | ----------- | ---- | --------
dataset | Provides the dataset reference for the lookup. Get details from the **Dataset properties** section in each corresponding connector article. | Key/value pair | Yes
source | Contains dataset-specific source properties, the same as the Copy Activity source. Get details from the **Copy Activity properties** section in each corresponding connector article. | Key/value pair | Yes
firstRowOnly | Indicates whether to return only the first row or all rows. | Boolean | No. The default is `true`.

> [!NOTE]
> 
> * Source columns with **ByteArray** type aren't supported.
> * **Structure** isn't supported in dataset definitions. For text-format files, use the header row to provide the column name.
> * If your lookup source is a JSON file, the `jsonPathDefinition` setting for reshaping the JSON object isn't supported. The entire objects will be retrieved.

## Use the Lookup activity result

The lookup result is returned in the `output` section of the activity run result.

* **When `firstRowOnly` is set to `true` (default)**, the output format is as shown in the following code. The lookup result is under a fixed `firstRow` key. To use the result in subsequent activity, use the pattern of  `@{activity('LookupActivity').output.firstRow.table}`.

    ```json
    {
        "firstRow":
        {
            "Id": "1",
            "schema":"dbo",
            "table":"Table1"
        }
    }
    ```

* **When `firstRowOnly` is set to `false`**, the output format is as shown in the following code. A `count` field indicates how many records are returned. Detailed values are displayed under a fixed `value` array. In such a case, the Lookup activity is followed by a [Foreach activity](control-flow-for-each-activity.md). You pass the `value` array to the ForEach activity `items` field by using the pattern of `@activity('MyLookupActivity').output.value`. To access elements in the `value` array, use the following syntax: `@{activity('lookupActivity').output.value[zero based index].propertyname}`. An example is `@{activity('lookupActivity').output.value[0].schema}`.

    ```json
    {
        "count": "2",
        "value": [
            {
                "Id": "1",
                "schema":"dbo",
                "table":"Table1"
            },
            {
                "Id": "2",
                "schema":"dbo",
                "table":"Table2"
            }
        ]
    } 
    ```

## Example

In this example, the pipeline contains two activities: **Lookup** and **Copy**. The Copy Activity copies data from a SQL table in your Azure SQL Database instance to Azure Blob storage. The name of the SQL table is stored in a JSON file in Blob storage. The Lookup activity looks up the table name at runtime. JSON is modified dynamically by using this approach. You don't need to redeploy pipelines or datasets. 

This example demonstrates lookup for the first row only. For lookup for all rows and to chain the results with ForEach activity, see the samples in [Copy multiple tables in bulk](tutorial-bulk-copy.md).


### Pipeline

- The Lookup activity is configured to use **LookupDataset**, which refers to a location in Azure Blob storage. The Lookup activity reads the name of the SQL table from a JSON file in this location. 
- The Copy Activity uses the output of the Lookup activity, which is the name of the SQL table. The **tableName** property in the **SourceDataset** is configured to use the output from the Lookup activity. Copy Activity copies data from the SQL table to a location in Azure Blob storage. The location is specified by the **SinkDataset** property. 

```json
{
    "name": "LookupPipelineDemo",
    "properties": {
        "activities": [
            {
                "name": "LookupActivity",
                "type": "Lookup",
                "dependsOn": [],
                "policy": {
                    "timeout": "7.00:00:00",
                    "retry": 0,
                    "retryIntervalInSeconds": 30,
                    "secureOutput": false,
                    "secureInput": false
                },
                "userProperties": [],
                "typeProperties": {
                    "source": {
                        "type": "JsonSource",
                        "storeSettings": {
                            "type": "AzureBlobStorageReadSettings",
                            "recursive": true
                        },
                        "formatSettings": {
                            "type": "JsonReadSettings"
                        }
                    },
                    "dataset": {
                        "referenceName": "LookupDataset",
                        "type": "DatasetReference"
                    },
                    "firstRowOnly": true
                }
            },
            {
                "name": "CopyActivity",
                "type": "Copy",
                "dependsOn": [
                    {
                        "activity": "LookupActivity",
                        "dependencyConditions": [
                            "Succeeded"
                        ]
                    }
                ],
                "policy": {
                    "timeout": "7.00:00:00",
                    "retry": 0,
                    "retryIntervalInSeconds": 30,
                    "secureOutput": false,
                    "secureInput": false
                },
                "userProperties": [],
                "typeProperties": {
                    "source": {
                        "type": "AzureSqlSource",
                        "sqlReaderQuery": {
                            "value": "select * from [@{activity('LookupActivity').output.firstRow.schema}].[@{activity('LookupActivity').output.firstRow.table}]",
                            "type": "Expression"
                        },
                        "queryTimeout": "02:00:00",
                        "partitionOption": "None"
                    },
                    "sink": {
                        "type": "DelimitedTextSink",
                        "storeSettings": {
                            "type": "AzureBlobStorageWriteSettings"
                        },
                        "formatSettings": {
                            "type": "DelimitedTextWriteSettings",
                            "quoteAllText": true,
                            "fileExtension": ".txt"
                        }
                    },
                    "enableStaging": false,
                    "translator": {
                        "type": "TabularTranslator",
                        "typeConversion": true,
                        "typeConversionSettings": {
                            "allowDataTruncation": true,
                            "treatBooleanAsNumber": false
                        }
                    }
                },
                "inputs": [
                    {
                        "referenceName": "SourceDataset",
                        "type": "DatasetReference",
                        "parameters": {
                            "schemaName": {
                                "value": "@activity('LookupActivity').output.firstRow.schema",
                                "type": "Expression"
                            },
                            "tableName": {
                                "value": "@activity('LookupActivity').output.firstRow.table",
                                "type": "Expression"
                            }
                        }
                    }
                ],
                "outputs": [
                    {
                        "referenceName": "SinkDataset",
                        "type": "DatasetReference",
                        "parameters": {
                            "schema": {
                                "value": "@activity('LookupActivity').output.firstRow.schema",
                                "type": "Expression"
                            },
                            "table": {
                                "value": "@activity('LookupActivity').output.firstRow.table",
                                "type": "Expression"
                            }
                        }
                    }
                ]
            }
        ],
        "annotations": [],
        "lastPublishTime": "2020-08-17T10:48:25Z"
    }
}
```

### Lookup dataset

The **lookup** dataset is the **sourcetable.json** file in the Azure Storage lookup folder specified by the **AzureBlobStorageLinkedService** type. 

```json
{
    "name": "LookupDataset",
    "properties": {
        "linkedServiceName": {
            "referenceName": "AzureBlobStorageLinkedService",
            "type": "LinkedServiceReference"
        },
        "annotations": [],
        "type": "Json",
        "typeProperties": {
            "location": {
                "type": "AzureBlobStorageLocation",
                "fileName": "sourcetable.json",
                "container": "lookup"
            }
        }
    }
}
```

### **Source** dataset for Copy Activity

The **source** dataset uses the output of the Lookup activity, which is the name of the SQL table. Copy Activity copies data from this SQL table to a location in Azure Blob storage. The location is specified by the **sink** dataset. 

```json
{
    "name": "SourceDataset",
    "properties": {
        "linkedServiceName": {
            "referenceName": "AzureSqlDatabase",
            "type": "LinkedServiceReference"
        },
        "parameters": {
            "schemaName": {
                "type": "string"
            },
            "tableName": {
                "type": "string"
            }
        },
        "annotations": [],
        "type": "AzureSqlTable",
        "schema": [],
        "typeProperties": {
            "schema": {
                "value": "@dataset().schemaName",
                "type": "Expression"
            },
            "table": {
                "value": "@dataset().tableName",
                "type": "Expression"
            }
        }
    }
}
```

### **Sink** dataset for Copy Activity

Copy Activity copies data from the SQL table to the **filebylookup.csv** file in the **csv** folder in Azure Storage. The file is specified by the **AzureBlobStorageLinkedService** property. 

```json
{
    "name": "SinkDataset",
    "properties": {
        "linkedServiceName": {
            "referenceName": "AzureBlobStorageLinkedService",
            "type": "LinkedServiceReference"
        },
        "parameters": {
            "schema": {
                "type": "string"
            },
            "table": {
                "type": "string"
            }
        },
        "annotations": [],
        "type": "DelimitedText",
        "typeProperties": {
            "location": {
                "type": "AzureBlobStorageLocation",
                "fileName": {
                    "value": "@{dataset().schema}_@{dataset().table}.csv",
                    "type": "Expression"
                },
                "container": "csv"
            },
            "columnDelimiter": ",",
            "escapeChar": "\\",
            "quoteChar": "\""
        },
        "schema": []
    }
}
```

### sourcetable.json

You can use following two kinds of formats for **sourcetable.json** file.

#### Set of objects

```json
{
   "Id":"1",
   "schema":"dbo",
   "table":"Table1"
}
{
   "Id":"2",
   "schema":"dbo",
   "table":"Table2"
}
```

#### Array of objects

```json
[ 
    {
        "Id": "1",
        "schema":"dbo",
        "table":"Table1"
    },
    {
        "Id": "2",
        "schema":"dbo",
        "table":"Table2"
    }
]
```

## Limitations and workarounds

Here are some limitations of the Lookup activity and suggested workarounds.

| Limitation | Workaround |
|---|---|
| The Lookup activity has a maximum of 5,000 rows, and a maximum size of 4 MB. | Design a two-level pipeline where the outer pipeline iterates over an inner pipeline, which retrieves data that doesn't exceed the maximum rows or size. |
| | |

## Next steps
See other control flow activities supported by Azure Data Factory and Synapse pipelines: 

- [Execute Pipeline activity](control-flow-execute-pipeline-activity.md)
- [ForEach activity](control-flow-for-each-activity.md)
- [GetMetadata activity](control-flow-get-metadata-activity.md)
- [Web activity](control-flow-web-activity.md)
