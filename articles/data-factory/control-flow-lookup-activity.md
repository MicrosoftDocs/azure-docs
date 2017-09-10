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
ms.date: 08/31/2017
ms.author: spelluru

---
# Lookup activity in Azure Data Factory
Lookup Activity can be used to read or look up a record/ table name/ value from any external source. This output can further be referenced by succeeding activities. 

The following data sources are currently supported for Lookup:
- JSON file in Azure Blob
- On-premises JSON file
- Azure SQL Database (JSON data converted from query)
- Azure Table Storage (JSON data converted from query)

Lookup activity is helpful when you want to dynamically retrieve a list of files/ records/tables from a configuration file or a data source. The output from the activity can be further used by other activities to perform specific processing on those items only.

## Example
In this example, the copy activity copies data from a SQL table in Azure SQL database to  Azure Blob Storage. The name of the SQL table is stored in a JSON file in the Blob Storage. The lookup activity looks up the table name at runtime. This approach allows JSON to be modified dynamically without redeploying pipelines/datasets. 

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
                        "sqlReaderQuery": "select * from @{activity('LookupActivity').output.tableName}" 
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
			"tableName": "@{activity('LookupActivity').output.tableName}"
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



## Type properties
Name | Description | Type | Required
---- | ----------- | ---- | --------
dataset | The dataset attribute is to provide the dataset reference for the lookup. Currently, the supported dataset types are:<ul><li>FileShareDataset</li><li>AzureBlobDataset</li><li>AzureSqlTableDataset</li><li>AzureTableDataset</li> | key/value pair | Yes
source | Dataset-specific source properties, same as copy activity source | Key/value pair | No
firstRowOnly | Returns first row or all rows. | boolean | No

## Next steps
See other control flow activities supported by Data Factory: 

- [Do Until Activity](control-flow-do-until-activity.md)
- [Execute Pipeline Activity](control-flow-execute-pipeline-activity.md)
- [For Each Activity](control-flow-for-each-activity.md)
- [Get Metadata Activity](control-flow-get-metadata-activity.md)
- [If Condition](control-flow-if-condition.md)
- [Web Activity](control-flow-web-activity.md)
