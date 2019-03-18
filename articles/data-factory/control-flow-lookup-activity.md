---
title: Lookup activity in Azure Data Factory | Microsoft Docs
description: Learn how to use Lookup activity to look up a value from an external source. This output can be further referenced by succeeding activities. 
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: craigg
editor: 

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 06/15/2018
ms.author: shlo

---
# Lookup activity in Azure Data Factory

Lookup activity can retrieve a dataset from any of the Azure Data Factory-supported data sources. Use it in the following scenario:
- Dynamically determine which objects to operate on in a subsequent activity, instead of hard coding the object name. Some object examples are files and tables.

Lookup activity reads and returns the content of a configuration file or table. It also returns the result of executing a query or stored procedure. The output from Lookup activity can be used in a subsequent copy or transformation activity if it's a singleton value. The output can be used in a ForEach activity if it's an array of attributes.

## Supported capabilities

The following data sources are supported for Lookup activity. The largest number of rows that can be returned by Lookup activity is 5,000, up to 2 MB in size. Currently, the longest duration for Lookup activity before timeout is one hour.

[!INCLUDE [data-factory-v2-supported-data-stores](../../includes/data-factory-v2-supported-data-stores-for-lookup-activity.md)]

## Syntax

```json
{
    "name": "LookupActivity",
    "type": "Lookup",
    "typeProperties": {
        "source": {
            "type": "<source type>"
            <additional source specific properties (optional)>
        },
        "dataset": { 
            "referenceName": "<source dataset name>",
            "type": "DatasetReference"
        },
        "firstRowOnly": false
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
    "name": "LookupPipelineDemo",
    "properties": {
        "activities": [
            {
                "name": "LookupActivity",
                "type": "Lookup",
                "typeProperties": {
                    "source": {
                        "type": "BlobSource"
                    },
                    "dataset": { 
                        "referenceName": "LookupDataset", 
                        "type": "DatasetReference" 
                    }
                }
            },
            {
                "name": "CopyActivity",
                "type": "Copy",
                "typeProperties": {
                    "source": { 
                        "type": "SqlSource", 
                        "sqlReaderQuery": "select * from @{activity('LookupActivity').output.firstRow.tableName}" 
                    },
                    "sink": { 
                        "type": "BlobSink" 
                    }
                },                
                "dependsOn": [ 
                    { 
                        "activity": "LookupActivity", 
                        "dependencyConditions": [ "Succeeded" ] 
                    }
                 ],
                "inputs": [ 
                    { 
                        "referenceName": "SourceDataset", 
                        "type": "DatasetReference" 
                    } 
                ],
                "outputs": [ 
                    { 
                        "referenceName": "SinkDataset", 
                        "type": "DatasetReference" 
                    } 
                ]
            }
        ]
	}
}
```

### Lookup dataset
The **lookup** dataset is the **sourcetable.json** file in the Azure Storage lookup folder specified by the **AzureStorageLinkedService** type. 

```json
{
	"name": "LookupDataset",
	"properties": {
		"type": "AzureBlob",
		"typeProperties": {
			"folderPath": "lookup",
			"fileName": "sourcetable.json",
			"format": {
				"type": "JsonFormat",
				"filePattern": "SetOfObjects"
			}
		},
		"linkedServiceName": {
			"referenceName": "AzureStorageLinkedService",
			"type": "LinkedServiceReference"
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
		"type": "AzureSqlTable",
		"typeProperties":{
			"tableName": "@{activity('LookupActivity').output.firstRow.tableName}"
		},
		"linkedServiceName": {
			"referenceName": "AzureSqlLinkedService",
			"type": "LinkedServiceReference"
		}
	}
}
```

### **Sink** dataset for Copy Activity
Copy Activity copies data from the SQL table to the **filebylookup.csv** file in the **csv** folder in Azure Storage. The file is specified by the **AzureStorageLinkedService** property. 

```json
{
	"name": "SinkDataset",
	"properties": {
		"type": "AzureBlob",
		"typeProperties": {
			"folderPath": "csv",
			"fileName": "filebylookup.csv",
			"format": {
				"type": "TextFormat"                                                                    
			}
		},
		"linkedServiceName": {
			"referenceName": "AzureStorageLinkedService",
			"type": "LinkedServiceReference"
		}
	}
}
```

### Azure Storage linked service
This storage account contains the JSON file with the names of the SQL tables. 

```json
{
    "properties": {
        "type": "AzureStorage",
        "typeProperties": {
            "connectionString": {
                "value": "DefaultEndpointsProtocol=https;AccountName=<StorageAccountName>;AccountKey=<StorageAccountKey>",
                "type": "SecureString"
            }
        }
    },
        "name": "AzureStorageLinkedService"
}
```

### Azure SQL Database linked service
This Azure SQL Database instance contains the data to be copied to Blob storage. 

```json
{
    "name": "AzureSqlLinkedService",
    "properties": {
        "type": "AzureSqlDatabase",
        "description": "",
		"typeProperties": {
			"connectionString": {
				"value": "Server=<server>;Initial Catalog=<database>;User ID=<user>;Password=<password>;",
				"type": "SecureString"
			}
		}
	}
}
```

### sourcetable.json

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
