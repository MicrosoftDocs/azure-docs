---
title: Wait activity
titleSuffix: Azure Data Factory & Azure Synapse
description: The Wait activity in Azure Data Factory and Synapse Analytics pauses the execution of a pipeline for a specified period. 
author: chez-charlie
ms.author: chez
ms.service: data-factory
ms.subservice: orchestration
ms.custom: synapse
ms.topic: conceptual
ms.date: 10/24/2022
---

# Execute Wait activity in Azure Data Factory and Synapse Analytics
When you use a Wait activity in a pipeline, the pipeline waits for the specified period of time before continuing with execution of subsequent activities. 

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

## Create a Wait activity with UI

To use a Wait activity in a pipeline, complete the following steps:

1. Search for _Wait_ in the pipeline Activities pane, and drag a Wait activity to the pipeline canvas.
1. Select the new Wait activity on the canvas if it is not already selected, and its  **Settings** tab, to edit its details.

   :::image type="content" source="media/control-flow-wait-activity/wait-activity.png" alt-text="Shows the UI for a Wait activity.":::

1. Enter a number of seconds for the activity to wait. This can be a literal number, or any combination of dynamic [expressions, functions](control-flow-expression-language-functions.md), [system variables](control-flow-system-variables.md), or [outputs from other activities](how-to-expression-language-functions.md#examples-of-using-parameters-in-expressions).

## Syntax

```json
{
    "name": "MyWaitActivity",
    "type": "Wait",
    "typeProperties": {
        "waitTimeInSeconds": 1
    }
}

```

## Type properties

Property | Description | Allowed values | Required
-------- | ----------- | -------------- | --------
name | Name of the `Wait` activity. | String | Yes
type | Must be set to **Wait**. | String | Yes
waitTimeInSeconds | The number of seconds that the pipeline waits before continuing with the processing. | Integer | Yes

## Example

> [!NOTE]
> This section provides JSON definitions and sample PowerShell commands to run the pipeline. For a walkthrough with step-by-step instructions to create a pipeline by using Azure PowerShell and JSON definitions, see [tutorial: create a data factory by using Azure PowerShell](quickstart-create-data-factory-powershell.md).

### Pipeline with Wait activity
In this example, the pipeline has two activities: **Until** and **Wait**. The Wait activity is configured to wait for one second. The pipeline runs the Web activity in a loop with one second waiting time between each run. 

```json
{
    "name": "DoUntilPipeline",
    "properties": {
        "activities": [
            {
                "type": "Until",
                "typeProperties": {
                    "expression": {
                        "value": "@equals('Failed', coalesce(body('MyUnauthenticatedActivity')?.status, actions('MyUnauthenticatedActivity')?.status, 'null'))",
                        "type": "Expression"
                    },
                    "timeout": "00:00:01",
                    "activities": [
                        {
                            "name": "MyUnauthenticatedActivity",
                            "type": "WebActivity",
                            "typeProperties": {
                                "method": "get",
                                "url": "https://www.fake.com/",
                                "headers": {
                                    "Content-Type": "application/json"
                                }
                            },
                            "dependsOn": [
                                {
                                    "activity": "MyWaitActivity",
                                    "dependencyConditions": [ "Succeeded" ]
                                }
                            ]
                        },
                        {
                            "type": "Wait",
                            "typeProperties": {
                                "waitTimeInSeconds": 1
                            },
                            "name": "MyWaitActivity"
                        }
                    ]
                },
                "name": "MyUntilActivity"
            }
        ]
    }
}

```

## Next steps
See other supported control flow activities: 

- [If Condition Activity](control-flow-if-condition-activity.md)
- [Execute Pipeline Activity](control-flow-execute-pipeline-activity.md)
- [For Each Activity](control-flow-for-each-activity.md)
- [Get Metadata Activity](control-flow-get-metadata-activity.md)
- [Lookup Activity](control-flow-lookup-activity.md)
- [Web Activity](control-flow-web-activity.md)
- [Until Activity](control-flow-until-activity.md)
