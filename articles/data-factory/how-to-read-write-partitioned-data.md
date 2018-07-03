---
title: How to read or write partitioned data in Azure Data Factory | Microsoft Docs
description: Learn how to read or write partitioned data in Azure Data Factory. 
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: craigg
editor: 

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/15/2018
ms.author: shlo

---
# How to read or write partitioned data in Azure Data Factory
In version 1, Azure Data Factory supported reading or writing partitioned data by using SliceStart/SliceEnd/WindowStart/WindowEnd system variables. In the current version of Data Factory, you can achieve this behavior by using a pipeline parameter and trigger's start time/scheduled time as a value of the parameter. 

## Use a pipeline parameter 
In version 1, you could use the partitionedBy property and SliceStart system variable as shown in the following example: 

```json
"folderPath": "adfcustomerprofilingsample/logs/marketingcampaigneffectiveness/{Year}/{Month}/{Day}/",
"partitionedBy": [
    { "name": "Year", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyy" } },
    { "name": "Month", "value": { "type": "DateTime", "date": "SliceStart", "format": "%M" } },
    { "name": "Day", "value": { "type": "DateTime", "date": "SliceStart", "format": "%d" } }
],
```

For more information about the partitonedBy property, see [version 1 Azure Blob connector](v1/data-factory-azure-blob-connector.md#dataset-properties) article. 

In the current version of Data Factory, a way to achieve this behavior is to do the following actions: 

1. Define a **pipeline parameter** of type string. In the following example, name of the pipeline parameter is **windowStartTime**. 
2. Set **folderPath** in the dataset definition to reference the value of pipeline parameter. 
3. Pass the actual value for the parameter when invoking the pipeline on-demand, or pass a trigger's start time/scheduled time dynamically at runtime. 

```json
"folderPath": {
      "value": "adfcustomerprofilingsample/logs/marketingcampaigneffectiveness/@{formatDateTime(pipeline().parameters.windowStartTime, 'yyyy/MM/dd')}/",
      "type": "Expression"
},
```

## Pass in value from a trigger
In the following tumbling window trigger definition, window start time of the trigger is passed as a value for the pipeline parameter  **windowStartTime**: 

```json
{
    "name": "MyTrigger",
    "properties": {
        "type": "TumblingWindowTrigger",
		"typeProperties": {
            "frequency": "Hour",
            "interval": "1",
            "startTime": "2018-05-15T00:00:00Z",
            "delay": "00:10:00",
            "maxConcurrency": 10
        },
        "pipeline": {
            "pipelineReference": {
                "type": "PipelineReference",
                "referenceName": "MyPipeline"
            },
            "parameters": {
                "windowStartTime": "@trigger().outputs.windowStartTime"
            }
        }
    }
}
```

## Example

Here is a sample dataset definition:

```json
{
  "name": "SampleBlobDataset",
  "type": "AzureBlob",
  "typeProperties": {
    "folderPath": {
      "value": "adfcustomerprofilingsample/logs/marketingcampaigneffectiveness/@{formatDateTime(pipeline().parameters.windowStartTime, 'yyyy/MM/dd')}/",
      "type": "Expression"
    },
    "format": {
      "type": "TextFormat",
      "columnDelimiter": ","
    }
  },
  "structure": [
    { "name": "ProfileID", "type": "String" },
    { "name": "SessionStart", "type": "String" },
    { "name": "Duration", "type": "Int32" },
    { "name": "State", "type": "String" },
    { "name": "SrcIPAddress", "type": "String" },
    { "name": "GameType", "type": "String" },
    { "name": "Multiplayer", "type": "String" },
    { "name": "EndRank", "type": "String" },
    { "name": "WeaponsUsed", "type": "Int32" },
    { "name": "UsersInteractedWith", "type": "String" },
    { "name": "Impressions", "type": "String" }
  ],
  "linkedServiceName": {
    "referenceName": "churnStorageLinkedService",
    "type": "LinkedServiceReference"
  }
}
```

Pipeline definition: 

```json
{
	"properties": {
		"activities": [{
			"type": "HDInsightHive",
			"typeProperties": {
				"scriptPath": {
					"value": "@concat(pipeline().parameters.blobContainer, '/scripts/', pipeline().parameters.partitionHiveScriptFile)",
					"type": "Expression"
				},
				"scriptLinkedService": {
					"referenceName": "churnStorageLinkedService",
					"type": "LinkedServiceReference"
				},
				"defines": {
					"RAWINPUT": {
						"value": "@concat('wasb://', pipeline().parameters.blobContainer, '@', pipeline().parameters.blobStorageAccount, '.blob.core.windows.net/logs/', pipeline().parameters.inputRawLogsFolder, '/')",
						"type": "Expression"
					},
					"Year": {
						"value": "@formatDateTime(pipeline().parameters.windowStartTime, 'yyyy')",
						"type": "Expression"
					},
					"Month": {
						"value": "@formatDateTime(pipeline().parameters.windowStartTime, 'MM')",
						"type": "Expression"
					},
					"Day": {
						"value": "@formatDateTime(pipeline().parameters.windowStartTime, 'dd')",
						"type": "Expression"
					}
				}
			},
			"linkedServiceName": {
				"referenceName": "HdiLinkedService",
				"type": "LinkedServiceReference"
			},
			"name": "HivePartitionGameLogs"
		}],
		"parameters": {
			"windowStartTime": {
				"type": "String"
			},
			"blobStorageAccount": {
				"type": "String"
			},
			"blobContainer": {
				"type": "String"
			},
			"inputRawLogsFolder": {
				"type": "String"
			}
		}
	}
}
```

## Next steps
For a complete walkthrough of creating a data factory with a pipeline, see [Quickstart: create a data factory](quickstart-create-data-factory-powershell.md). 
