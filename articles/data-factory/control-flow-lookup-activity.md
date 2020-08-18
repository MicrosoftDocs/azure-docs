---
title: Lookup activity in Azure Data Factory 
description: Learn how to use Lookup activity to look up a value from an external source. This output can be further referenced by succeeding activities. 
services: data-factory
documentationcenter: ''
author: djpmsft
ms.author: daperlov
manager: jroth
ms.reviewer: douglasl
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.date: 08/17/2020
---

# Lookup activity in Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Lookup activity can retrieve a dataset from any of the Azure Data Factory-supported data sources. Use it in the following scenario:
- Dynamically determine which objects to operate on in a subsequent activity, instead of hard coding the object name. Some object examples are files and tables.

Lookup activity reads and returns the content of a configuration file or table. It also returns the result of executing a query or stored procedure. The output from Lookup activity can be used in a subsequent copy or transformation activity if it's a singleton value. The output can be used in a ForEach activity if it's an array of attributes.

## Supported capabilities

The following data sources are supported for Lookup activity. The largest number of rows that can be returned by Lookup activity is 5,000, up to 2 MB in size. Currently, the longest duration for Lookup activity before timeout is one hour.

[!INCLUDE [data-factory-v2-supported-data-stores](../../includes/data-factory-v2-supported-data-stores-for-lookup-activity.md)]

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

## Use the Lookup activity result in a subsequent activity

The lookup result is returned in the `output` section of the activity run result.

* **When `firstRowOnly` is set to `true` (default)**, the output format is as shown in the following code. The lookup result is under a fixed `firstRow` key. To use the result in subsequent activity, use the pattern of `@{activity('MyLookupActivity').output.firstRow.TableName}`.

    ```json
    {
        "firstRow":
        {
            "Id": "1",
            "TableName" : "Table1"
        }
    }
    ```

* **When `firstRowOnly` is set to `false`**, the output format is as shown in the following code. A `count` field indicates how many records are returned. Detailed values are displayed under a fixed `value` array. In such a case, the Lookup activity is followed by a [Foreach activity](control-flow-for-each-activity.md). You pass the `value` array to the ForEach activity `items` field by using the pattern of `@activity('MyLookupActivity').output.value`. To access elements in the `value` array, use the following syntax: `@{activity('lookupActivity').output.value[zero based index].propertyname}`. An example is `@{activity('lookupActivity').output.value[0].tablename}`.

    ```json
    {
        "count": "2",
        "value": [
            {
                "Id": "1",
                "TableName" : "Table1"
            },
            {
                "Id": "2",
                "TableName" : "Table2"
            }
        ]
    } 
    ```

### Copy Activity example
In this example, Copy Activity copies data from a SQL table in your Azure SQL Database instance to Azure Blob storage. The name of the SQL table is stored in a JSON file in Blob storage. The Lookup activity looks up the table name at runtime. JSON is modified dynamically by using this approach. You don't need to redeploy pipelines or datasets. 

This example demonstrates lookup for the first row only. For lookup for all rows and to chain the results with ForEach activity, see the samples in [Copy multiple tables in bulk by using Azure Data Factory](tutorial-bulk-copy.md).

### Pipeline
This pipeline contains two activities: Lookup and Copy. 

- The Lookup activity is configured to use **LookupDataset**, which refers to a location in Azure Blob storage. The Lookup activity reads the name of the SQL table from a JSON file in this location. 
- Copy Activity uses the output of the Lookup activity, which is the name of the SQL table. The **tableName** property in the **SourceDataset** is configured to use the output from the Lookup activity. Copy Activity copies data from the SQL table to a location in Azure Blob storage. The location is specified by the **SinkDataset** property. 

```json
{
    "name":"LookupPipelineDemo",
    "properties":{
        "activities":[
            {
                "name":"LookupActivity",
                "type":"Lookup",
                "dependsOn":[

                ],
                "policy":{
                    "timeout":"7.00:00:00",
                    "retry":0,
                    "retryIntervalInSeconds":30,
                    "secureOutput":false,
                    "secureInput":false
                },
                "userProperties":[

                ],
                "typeProperties":{
                    "source":{
                        "type":"JsonSource",
                        "storeSettings":{
                            "type":"AzureBlobStorageReadSettings",
                            "recursive":true
                        },
                        "formatSettings":{
                            "type":"JsonReadSettings"
                        }
                    },
                    "dataset":{
                        "referenceName":"LookupDataset",
                        "type":"DatasetReference"
                    },
                    "firstRowOnly":false
                }
            },
            {
                "name":"CopyActivity",
                "type":"Copy",
                "dependsOn":[
                    {
                        "activity":"LookupActivity",
                        "dependencyConditions":[
                            "Succeeded"
                        ]
                    }
                ],
                "policy":{
                    "timeout":"7.00:00:00",
                    "retry":0,
                    "retryIntervalInSeconds":30,
                    "secureOutput":false,
                    "secureInput":false
                },
                "userProperties":[

                ],
                "typeProperties":{
                    "source":{
                        "type":"AzureSqlSource",
                        "sqlReaderQuery":{
                            "value":"select * from @{activity('LookupActivity').output.firstRow.tableName}",
                            "type":"Expression"
                        },
                        "queryTimeout":"02:00:00",
                        "partitionOption":"None"
                    },
                    "sink":{
                        "type":"DelimitedTextSink",
                        "storeSettings":{
                            "type":"AzureBlobStorageWriteSettings"
                        },
                        "formatSettings":{
                            "type":"DelimitedTextWriteSettings",
                            "quoteAllText":true,
                            "fileExtension":".txt"
                        }
                    },
                    "enableStaging":false,
                    "translator":{
                        "type":"TabularTranslator",
                        "typeConversion":true,
                        "typeConversionSettings":{
                            "allowDataTruncation":true,
                            "treatBooleanAsNumber":false
                        }
                    }
                },
                "inputs":[
                    {
                        "referenceName":"SourceDataset",
                        "type":"DatasetReference"
                    }
                ],
                "outputs":[
                    {
                        "referenceName":"SinkDataset",
                        "type":"DatasetReference"
                    }
                ]
            }
        ],
        "annotations":[

        ],
        "lastPublishTime":"2020-08-17T02:33:35Z"
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
        "annotations": [],
        "type": "AzureSqlTable",
        "schema": [],
        "typeProperties": {
            "table": {
                "value": "@('LookupActivity').output.firstRow.tableName",
                "type": "Expression"
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
        "annotations": [],
        "type": "DelimitedText",
        "typeProperties": {
            "location": {
                "type": "AzureBlobStorageLocation",
                "fileName": "filebylookup.csv",
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

You can use following format for **sourcetable.json**.

#### Set of objects

```json
{
  "Id": "1",
  "tableName": "Table1"
}
{
   "Id": "2",
  "tableName": "Table2"
}
```

#### Array of objects

```json
[ 
    {
        "Id": "1",
        "tableName": "Table1"
    },
    {
        "Id": "2",
        "tableName": "Table2"
    }
]
```

## Limitations and workarounds

Here are some limitations of the Lookup activity and suggested workarounds.

| Limitation | Workaround |
|---|---|
| The Lookup activity has a maximum of 5,000 rows, and a maximum size of 2 MB. | Design a two-level pipeline where the outer pipeline iterates over an inner pipeline, which retrieves data that doesn't exceed the maximum rows or size. |
| | |

## Next steps
See other control flow activities supported by Data Factory: 

- [Execute Pipeline activity](control-flow-execute-pipeline-activity.md)
- [ForEach activity](control-flow-for-each-activity.md)
- [GetMetadata activity](control-flow-get-metadata-activity.md)
- [Web activity](control-flow-web-activity.md)
