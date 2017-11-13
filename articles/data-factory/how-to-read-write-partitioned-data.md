---
title: How to read or write partitioned data in Azure Data Factory | Microsoft Docs
description: Learn how to read or write partitioned data in Azure Data Factory version 2. 
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: jhubbard
editor: 

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/09/2017
ms.author: shlo

---
# How to read or write partitioned data in Azure Data Factory version 2
In version 1, Azure Data Factory supported reading or writing partitioned data by using SliceStart/SliceEnd/WindowStart/WindowEnd system variables. In version 2, you can achieve this behavior by using a pipeline parameter and trigger's start time/scheduled time as a value of the parameter. 

## Use a pipeline parameter 
In version 1, you could use the partitionedBy property and SliceStart system variable as shown in the following example: 

```json
"folderPath": "adfcustomerprofilingsample/logs/marketingcampaigneffectiveness/yearno={Year}/monthno={Month}/dayno={Day}/",
"partitionedBy": [
    { "name": "Year", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyy" } },
    { "name": "Month", "value": { "type": "DateTime", "date": "SliceStart", "format": "%M" } },
    { "name": "Day", "value": { "type": "DateTime", "date": "SliceStart", "format": "%d" } }
],
```

For more information about the partitonedBy property, see [version 1 Azure Blob connector](v1/data-factory-azure-blob-connector.md#dataset-properties) article. 

In version 2, a way to achieve this behavior is to do the following actions: 

1. Define a **pipeline parameter** of type string. In the following example, name of the pipeline parameter is **ScheduledRunTime**. 
2. Set **folderPath** in the dataset definition to the value of pipeline parameter for as shown in the example. 
3. Pass a hardcoded value for the parameter before running the pipeline. Or, pass a trigger's start time or scheduled time dynamically at runtime. 

```json
"folderPath": {
      "value": "@concat(pipeline().parameters.blobContainer, '/logs/marketingcampaigneffectiveness/yearno=', formatDateTime(pipeline().parameters.ScheduledRunTime, 'yyyy'), '/monthno=', formatDateTime(pipeline().parameters.ScheduledRunTime, '%M'), '/dayno=', formatDateTime(pipeline().parameters.ScheduledRunTime, '%d'), '/')",
      "type": "Expression"
},
```

## Pass in value from a trigger
In the following trigger definition, scheduled time of the trigger is passed as a value for the ScheduledRunTime pipeline parameter: 

```json
{
    "name": "MyTrigger",
    "properties": {
       ...
        },
        "pipeline": {
            "pipelineReference": {
                "type": "PipelineReference",
                "referenceName": "MyPipeline"
            },
            "parameters": {
                "ScheduledRunTime": "@trigger().scheduledTime"
            }
        }
    }
}
```

## Example

Here is a sample dataset definition (that uses a parameter named: `date`):

```json
{
  "type": "AzureBlob",
  "typeProperties": {
    "folderPath": {
      "value": "@concat(pipeline().parameters.blobContainer, '/logs/marketingcampaigneffectiveness/yearno=', formatDateTime(pipeline().parameters.scheduledTime, 'yyyy'), '/monthno=', formatDateTime(pipeline().parameters.scheduledTime, '%M'), '/dayno=', formatDateTime(pipeline().parameters.scheduledTime, '%d'), '/')",
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
					"PARTITIONEDOUTPUT": {
						"value": "@concat('wasb://', pipeline().parameters.blobContainer, '@', pipeline().parameters.blobStorageAccount, '.blob.core.windows.net/logs/partitionedgameevents/')",
						"type": "Expression"
					},
					"Year": {
						"value": "@formatDateTime(pipeline().parameters.scheduledTime, 'yyyy')",
						"type": "Expression"
					},
					"Month": {
						"value": "@formatDateTime(pipeline().parameters.scheduledTime, '%M')",
						"type": "Expression"
					},
					"Day": {
						"value": "@formatDateTime(pipeline().parameters.scheduledTime, '%d')",
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
			"date": {
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
			},
			"partitionHiveScriptFile": {
				"type": "String"
			}
		}
	}
}
```

## Next steps
For a complete walkthrough of creating a data factory with a pipeline, see [Quickstart: create a data factory](quickstart-create-data-factory-powershell.md). 