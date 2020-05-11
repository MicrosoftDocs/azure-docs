---
title: Switch activity in Azure Data Factory 
description: The Switch activity allows you to control the processing flow based on a condition.
services: data-factory
author: djpmsft
ms.author: daperlov
ms.reviewer: maghan
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.date: 10/08/2019
---

# Switch activity in Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

The Switch activity provides the same functionality that a switch statement provides in programming languages. It evaluates a set of activities corresponding to a case that matches the condition evaluation.

## Syntax

```json

{
   "name": "<Name of the activity>",
    "type": "Switch",
    "typeProperties": {
        "expression": {
            "value": "<expression that evaluates to some string value>",
            "type": "Expression"
        },
        "cases": [
            {
                "value": "<string value that matches expression evaluation>",
                "activities": [
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
        ],
        "defaultActivities": [
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
name | Name of the switch activity. | String | Yes
type | Must be set to *Switch** | String | Yes
expression | Expression that must evaluate to string value | Expression with result type string | Yes
cases | Set of cases that contain a value and a set of activities to execute when the value matches the expression evaluation. Must provide at least one case. There's a max limit of 25 cases. | Array of Case Objects | Yes
defaultActivities | Set of activities that are executed when the expression evaluation isn't satisfied. | Array of Activities | Yes

## Example

The pipeline in this example copies data from an input folder to an output folder. The output folder is determined by the value of pipeline parameter: routeSelection.

> [!NOTE]
> This section provides JSON definitions and sample PowerShell commands to run the pipeline. For a walkthrough with step-by-step instructions to create a Data Factory pipeline by using Azure PowerShell and JSON definitions, see [tutorial: create a data factory by using Azure PowerShell](quickstart-create-data-factory-powershell.md).

### Pipeline with Switch activity (Adfv2QuickStartPipeline.json)

```json
{
    "name": "Adfv2QuickStartPipeline",
    "properties": {
        "activities": [
            {
                "name": "MySwitch",
                "type": "Switch",
                "typeProperties": {
                    "expression": {
                        "value": "@pipeline().parameters.routeSelection",
                        "type": "Expression"
                    },
                    "cases": [
                        {
                            "value": "1",
                            "activities": [
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
                                                "path": "@pipeline().parameters.outputPath1",
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
                        },
                        {
                            "value": "2",    
                                "activities": [
                                    {
                                        "name": "CopyFromBlobToBlob2",
                                        "type": "Copy",
                                        "inputs": [
                                            {
                                                "referenceName": "BlobDataset",
                                                "parameters": {
                                                    "path": "@pipeline().parameters.inputPath",
                                                },
                                                "type": "DatasetReference"
                                            }
                                        ],
                                        "outputs": [
                                            {
                                                "referenceName": "BlobDataset",
                                                "parameters": {
                                                    "path": "@pipeline().parameters.outputPath2",
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
                            },
                            {
                                "value": "3",
                                "activities": [
                                    {
                                        "name": "CopyFromBlobToBlob3",
                                        "type": "Copy",
                                        "inputs": [
                                                {
                                                "referenceName": "BlobDataset",
                                                "parameters": {
                                                    "path": "@pipeline().parameters.inputPath",
                                                },
                                                "type": "DatasetReference"
                                            }
                                        ],
                                        "outputs": [
                                            {
                                                "referenceName": "BlobDataset",
                                                "parameters": {
                                                    "path": "@pipeline().parameters.outputPath3",
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
                        },
                    ],
                    "defaultActivities": []
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
            "outputPath3": {
                "type": "String"
            },
            "routeSelection": {
                "type": "String"
            }
        }
    }
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
    "outputPath1": "adftutorial/outputCase1",
    "outputPath2": "adftutorial/outputCase2",
    "outputPath2": "adftutorial/outputCase3",
    "routeSelection": "1"
}
```

### PowerShell commands

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

These commands assume that you've saved the JSON files into the folder: C:\ADF. 

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

See other control flow activities supported by Data Factory: 

- [If Condition Activity](control-flow-if-condition-activity.md)
- [Execute Pipeline Activity](control-flow-execute-pipeline-activity.md)
- [For Each Activity](control-flow-for-each-activity.md)
- [Get Metadata Activity](control-flow-get-metadata-activity.md)
- [Lookup Activity](control-flow-lookup-activity.md)
- [Web Activity](control-flow-web-activity.md)
