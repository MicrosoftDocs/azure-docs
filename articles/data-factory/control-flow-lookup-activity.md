---
title: Lookup activity in Azure Data Factory | Microsoft Docs
description: Learn how to use the Lookup Activity to look up a value from an external source. This output can further be referenced by succeeding activities. 
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: jhubbard
editor: shlo

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/12/2017
ms.author: spelluru

---
# Lookup activity in Azure Data Factory
Lookup Activity can be used to read or look up a record/ table name/ value from any external source. This output can further be referenced by succeeding activities. 

Lookup activity is helpful when you want to dynamically retrieve a list of files/ records/tables from a configuration file or a data source. The output from the activity can be further used by other activities to perform specific processing on those items only.

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [Data Factory V1 documentation](v1/data-factory-introduction.md).

## Supported capabilities

The following data sources are currently supported for Lookup:
- JSON file in Azure Blob
- JSON file in File System
- Azure SQL Database (JSON data converted from query)
- Azure SQL Data Warehouse (JSON data converted from query)
- SQL Server (JSON data converted from query)
- Azure Table Storage (JSON data converted from query)

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
Name | Description | Type | Required
---- | ----------- | ---- | --------
dataset | The dataset attribute is to provide the dataset reference for the lookup. Currently, the supported dataset types are:<ul><li>`AzureBlobDataset` for [Azure Blob Storage](connector-azure-blob-storage.md#dataset-properties) as source</li><li>`FileShareDataset` for [File System](connector-file-system.md#dataset-properties) as source</li><li>`AzureSqlTableDataset` for [Azure SQL Database](connector-azure-sql-database.md#dataset-properties) or [Azure SQL Data Warehouse](connector-azure-sql-data-warehouse.md#dataset-properties) as source</li><li>`SqlServerTable` for [SQL Server](connector-sql-server.md#dataset-properties) as source</li><li>`AzureTableDataset` for [Azure Table Storage](connector-azure-table-storage.md#dataset-properties) as source</li> | key/value pair | Yes
source | Dataset-specific source properties, same as copy activity source. Learn details from the "Copy activity properties" section in each corresponding connector article. | Key/value pair | Yes
firstRowOnly | Indicate whether to return only the first row or all rows. | boolean | No. Default is `ture`.

## Use Lookup activity result in subsequent activity

The Lookup result is returned in the `output` section in the activity run result.

**When `firstRowOnly` is set to `true` (default)**, the output format is as follows. The lookup result is under a fixed `firstRow` key. To use the result in subsequent activity, use the pattern of `@{activity('MyLookupActivity').output.firstRow.TableName}`.

```json
{
    "firstRow":
    {
        "Id": "1",
        "TableName" : "Table1"
    }
}
```

**When `firstRowOnly` is set to `false`**, the output format is as follows. A `count` field indicates how many records are returned, and detailed values are under a fixed `value` array. In such case, the Lookup activity is usually followed by a [Foreach activity](control-flow-for-each-activity.md), you can pass the `value` array to ForEach activity `items` field using the pattern of `@activity('MyLookupActivity').output.value`. To access elements in the `value`, use the following syntax: `@{activity('lookupActivity').output.value[zero based index].propertyname}`. Here is an example: `@{activity('lookupActivity').output.value[0].tablename}`

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

## Example
In this example, the copy activity copies data from a SQL table in Azure SQL database to Azure Blob Storage. The name of the SQL table is stored in a JSON file in the Blob Storage. The Lookup activity looks up the table name at runtime. This approach allows JSON to be modified dynamically without redeploying pipelines/datasets. 

This example demonstrates look up first row only. For look up all rows and chain with ForEach activity, refer to [Tutorial - Copy data in bulk](tutorial-bulk-copy.md) sample.

### Pipeline
This pipeline contains two activities: **Look up** and **Copy**. 

- The Lookup activity is configured to use the LookupDataset, which refers to a location in an Azure Blob Storage. The lookup activity reads the name of the SQL table from a JSON file in this location. 
- The Copy activity uses the output of the lookup activity (name of the SQL table). The tableName in the source dataset (SourceDataset) is configured to use the output from the lookup activity. The copy activity copies data from the SQL table to a location in Azure Blob Storage that is specified by the SinkDataset. 


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
The lookup dataset refers to the sourcetable.json file in the lookup folder in the Azure Storage specified by AzureStorageLinkedService. 

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

### Source dataset for the copy activity
The source dataset uses the output of the lookup activity, which is the name of the SQL table. The copy activity copies data from this SQL table to a location in the Azure Blob Storage specified by the sink dataset. 

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

### Sink dataset for the copy activity
The copy activity copies data from the SQL table to filebylookup.csv file in the csv folder in the Azure Storage specified by the AzureStorageLinkedService. 

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

### Azure Storage Linked Service
This storage account contains the JSON file with the names of SQL tables. 

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
This Azure SQL database contains the data to be copied to the blob storage. 

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
  "tableName": "Table1",
}
{
   "Id": "2",
  "tableName": "Table2",
}
```

#### Array of objects

```json
[ 
    {
        "Id": "1",
          "tableName": "Table1",
    }
    {
        "Id": "2",
        "tableName": "Table2",
    }
]
```

## Next steps
See other control flow activities supported by Data Factory: 

- [Execute Pipeline Activity](control-flow-execute-pipeline-activity.md)
- [For Each Activity](control-flow-for-each-activity.md)
- [Get Metadata Activity](control-flow-get-metadata-activity.md)
- [Web Activity](control-flow-web-activity.md)
