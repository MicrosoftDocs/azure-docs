---
title: If Condition activity
titleSuffix: Azure Data Factory & Azure Synapse
description: The If Condition activity allows you to control the processing flow based on a condition in an Azure Data Factory or Synapse Analytics pipeline.
author: chez-charlie
ms.author: chez
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: orchestration
ms.topic: conceptual
ms.date: 10/20/2023
ms.custom: devx-track-azurepowershell, synapse
---

# If Condition activity in Azure Data Factory and Synapse Analytics pipelines
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

The If Condition activity provides the same functionality that an if statement provides in programming languages. It executes a set of activities when the condition evaluates to `true` and another set of activities when the condition evaluates to `false`. 

## Create an If Condition activity with UI

To use an If Condition activity in a pipeline, complete the following steps:

1. Search for _If_ in the pipeline Activities pane, and drag an If Condition activity to the pipeline canvas.
1. Select the new If Condition activity on the canvas if it is not already selected, and its  **Activities** tab, to edit its details.

   :::image type="content" source="media/control-flow-if-condition-activity/if-condition-activity.png" alt-text="Shows the UI for an If Condition activity.":::

1. Enter an expression that returns a boolean true or false value. This can be any combination of dynamic [expressions, functions](control-flow-expression-language-functions.md), [system variables](control-flow-system-variables.md), or [outputs from other activities](how-to-expression-language-functions.md#examples-of-using-parameters-in-expressions).
1. Select the Edit Activities buttons on the Activities tab for the If Condition, or directly from the If Condition on the pipeline canvas, to add activities that will be executed when the expression evaluates to `true` or `false`.

## Syntax

```json

{
    "name": "<Name of the activity>",
    "type": "IfCondition",
    "typeProperties": {
		    "expression": {
            "value": "<expression that evaluates to true or false>",
            "type": "Expression"
		    },

		    "ifTrueActivities": [
            {
                "<Activity 1 definition>"
            },
            {
                "<Activity 2 definition>"
            },
            {
                "<Activity N definition>"
            }
        ],

        "ifFalseActivities": [
            {
                "<Activity 1 definition>"
            },
            {
                "<Activity 2 definition>"
            },
            {
                "<Activity N definition>"
            }
		    ]
    }
}
```

## Type properties

Property | Description | Allowed values | Required
-------- | ----------- | -------------- | --------
name | Name of the if-condition activity. | String | Yes
type | Must be set to **IfCondition** | String | Yes
expression | Expression that must evaluate to true or false | Expression with result type boolean | Yes
ifTrueActivities | Set of activities that are executed when the expression evaluates to `true`. | Array | Yes
ifFalseActivities | Set of activities that are executed when the expression evaluates to `false`. | Array | Yes

## Example
The pipeline in this example copies data from an input folder to an output folder. The output folder is determined by the value of pipeline parameter: routeSelection. If the value of routeSelection is true, the data is copied to outputPath1. And, if the value of routeSelection is false, the data is copied to outputPath2. 

> [!NOTE]
> This section provides JSON definitions and sample PowerShell commands to run the pipeline. For a walkthrough with step-by-step instructions to create a pipeline by using Azure PowerShell and JSON definitions, see [tutorial: create a data factory by using Azure PowerShell](quickstart-create-data-factory-powershell.md).

### Pipeline with IF-Condition activity (Adfv2QuickStartPipeline.json)

```json
{
    "name": "Adfv2QuickStartPipeline",
    "properties": {
        "activities": [
            {
                "name": "MyIfCondition",
                "type": "IfCondition",
                "typeProperties": {
                    "expression":  {
                        "value":  "@bool(pipeline().parameters.routeSelection)", 
                        "type": "Expression"
                     },
                                           
                    "ifTrueActivities": [
                        {
                            "name": "CopyFromBlobToBlob1",
                            "type": "Copy",
                            "inputs": [
                                {
                                    "referenceName": "BlobDataset",
                                    "parameters": {
                                        "path": "@pipeline().parameters.inputPath"
                                    },
                                    "type": "DatasetReference"
                                }
                            ],
                            "outputs": [
                                {
                                    "referenceName": "BlobDataset",
                                    "parameters": {
                                        "path": "@pipeline().parameters.outputPath1"
                                    },
                                    "type": "DatasetReference"
                                }
                            ],
                            "typeProperties": {
                                "source": {
                                    "type": "BlobSource"
                                },
                                "sink": {
                                    "type": "BlobSink"
                                }
                            }
                        }                                   
                    ],
                    "ifFalseActivities": [
                        {
                            "name": "CopyFromBlobToBlob2",
                            "type": "Copy",
                            "inputs": [
                                {
                                    "referenceName": "BlobDataset",
                                    "parameters": {
                                        "path": "@pipeline().parameters.inputPath"
                                    },
                                    "type": "DatasetReference"
                                }
                            ],
                            "outputs": [
                                {
                                    "referenceName": "BlobDataset",
                                    "parameters": {
                                        "path": "@pipeline().parameters.outputPath2"
                                    },
                                    "type": "DatasetReference"
                                }
                            ],
                            "typeProperties": {
                                "source": {
                                    "type": "BlobSource"
                                },
                                "sink": {
                                    "type": "BlobSink"
                                }
                            }
                        }
                    ]                    
                }
            }
        ],
        "parameters": {
            "inputPath": {
                "type": "String"
            },
            "outputPath1": {
                "type": "String"
            },
            "outputPath2": {
                "type": "String"
            },
            "routeSelection": {
                "type": "String"
            }                        
        }
    }
}
```

Another example for expression is: 

```json
"expression":  {
    "value":  "@equals(pipeline().parameters.routeSelection,1)", 
    "type": "Expression"
}
```


### Azure Storage linked service (AzureStorageLinkedService.json)

```json
{
    "name": "AzureStorageLinkedService",
    "properties": {
        "type": "AzureStorage",
        "typeProperties": {
            "connectionString": "DefaultEndpointsProtocol=https;AccountName=<Azure Storage account name>;AccountKey=<Azure Storage account key>"
        }
    }
}
```

### Parameterized Azure Blob dataset (BlobDataset.json)
The pipeline sets the **folderPath** to the value of either **outputPath1** or **outputPath2** parameter of the pipeline. 

```json
{
    "name": "BlobDataset",
    "properties": {
        "type": "AzureBlob",
        "typeProperties": {
            "folderPath": {
                "value": "@{dataset().path}",
                "type": "Expression"
            }
        },
        "linkedServiceName": {
            "referenceName": "AzureStorageLinkedService",
            "type": "LinkedServiceReference"
        },
        "parameters": {
            "path": {
                "type": "String"
            }
        }
    }
}
```

### Pipeline parameter JSON (PipelineParameters.json)

```json
{
    "inputPath": "adftutorial/input",
    "outputPath1": "adftutorial/outputIf",
    "outputPath2": "adftutorial/outputElse",
    "routeSelection": "false"
}
```

### PowerShell commands

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

These commands assume that you have saved the JSON files into the folder: C:\ADF. 

```powershell
Connect-AzAccount
Select-AzSubscription "<Your subscription name>"

$resourceGroupName = "<Resource Group Name>"
$dataFactoryName = "<Data Factory Name. Must be globally unique>";
Remove-AzDataFactoryV2 $dataFactoryName -ResourceGroupName $resourceGroupName -force


Set-AzDataFactoryV2 -ResourceGroupName $resourceGroupName -Location "East US" -Name $dataFactoryName
Set-AzDataFactoryV2LinkedService -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -Name "AzureStorageLinkedService" -DefinitionFile "C:\ADF\AzureStorageLinkedService.json"
Set-AzDataFactoryV2Dataset -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -Name "BlobDataset" -DefinitionFile "C:\ADF\BlobDataset.json"
Set-AzDataFactoryV2Pipeline -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -Name "Adfv2QuickStartPipeline" -DefinitionFile "C:\ADF\Adfv2QuickStartPipeline.json"
$runId = Invoke-AzDataFactoryV2Pipeline -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -PipelineName "Adfv2QuickStartPipeline" -ParameterFile C:\ADF\PipelineParameters.json
while ($True) {
    $run = Get-AzDataFactoryV2PipelineRun -ResourceGroupName $resourceGroupName -DataFactoryName $DataFactoryName -PipelineRunId $runId

    if ($run) {
        if ($run.Status -ne 'InProgress') {
            Write-Host "Pipeline run finished. The status is: " $run.Status -foregroundcolor "Yellow"
            $run
            break
        }
        Write-Host  "Pipeline is running...status: InProgress" -foregroundcolor "Yellow"
    }

    Start-Sleep -Seconds 30
}
Write-Host "Activity run details:" -foregroundcolor "Yellow"
$result = Get-AzDataFactoryV2ActivityRun -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -PipelineRunId $runId -RunStartedAfter (Get-Date).AddMinutes(-30) -RunStartedBefore (Get-Date).AddMinutes(30)
$result

Write-Host "Activity 'Output' section:" -foregroundcolor "Yellow"
$result.Output -join "`r`n"

Write-Host "\nActivity 'Error' section:" -foregroundcolor "Yellow"
$result.Error -join "`r`n"
```

## Next steps
See other supported control flow activities: 

- [Execute Pipeline Activity](control-flow-execute-pipeline-activity.md)
- [For Each Activity](control-flow-for-each-activity.md)
- [Get Metadata Activity](control-flow-get-metadata-activity.md)
- [Lookup Activity](control-flow-lookup-activity.md)
- [Web Activity](control-flow-web-activity.md)
