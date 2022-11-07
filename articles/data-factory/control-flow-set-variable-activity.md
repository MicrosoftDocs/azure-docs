---
title: Set Variable Activity
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to use the Set Variable activity to set the value of an existing variable defined in an Azure Data Factory or Azure Synapse Analytics pipeline.
ms.service: data-factory
ms.subservice: orchestration
ms.custom: synapse
ms.topic: conceptual
ms.date: 10/24/2022
author: chez-charlie
ms.author: chez
ms.reviewer: jburchel
---

# Set Variable Activity in Azure Data Factory and Azure Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Use the Set Variable activity to set the value of an existing variable of type String, Bool, or Array defined in a Data Factory or Synapse pipeline.

## Create an Append Variable activity with UI

To use a Set Variable activity in a pipeline, complete the following steps:
1. Select the background of the pipeline canvas and use the Variables tab to add a variable:
:::image type="content" source="media/control-flow-activities-common/add-pipeline-array-variable.png" alt-text="Screenshot shows an empty pipeline canvas with the variables tab selected having an array type variable named TestVariable.":::

1. Search for _Set Variable_ in the pipeline Activities pane, and drag a Set Variable activity to the pipeline canvas.
1. Select the Set Variable activity on the canvas if it is not already selected, and its **Variables** tab, to edit its details.
1. Select the variable for the Name property.
1. Enter an expression to set the value for the variables. This expression can be a literal string expression, or any combination of dynamic [expressions, functions](control-flow-expression-language-functions.md), [system variables](control-flow-system-variables.md), or [outputs from other activities](how-to-expression-language-functions.md#examples-of-using-parameters-in-expressions).
:::image type="content" source="media/control-flow-set-variable-activity/set-variable-activity.png" alt-text="Screenshot shows the ui for a set variable activity.":::

## Type properties

Property | Description | Required
-------- | ----------- | --------
name | Name of the activity in pipeline | yes
description | Text describing what the activity does | no
type | Must be set to **SetVariable** | yes
value | String literal or expression object value that the variable is assigned to | yes
variableName | Name of the variable that is set by this activity | yes

## Incrementing a variable

A common scenario involving variables is using a variable as an iterator within an until or foreach activity. In a set variable activity, you cannot reference the variable being set in the `value` field. To work around this limitation, set a temporary variable and then create a second set variable activity. The second set variable activity sets the value of the iterator to the temporary variable. 
Below is an example of this pattern:
:::image type="content" source="media/control-flow-set-variable-activity/increment-variable.png" alt-text="Screenshot shows increment variable.":::

``` json
{
    "name": "pipeline3",
    "properties": {
        "activities": [
            {
                "name": "Set I",
                "type": "SetVariable",
                "dependsOn": [
                    {
                        "activity": "Increment J",
                        "dependencyConditions": [
                            "Succeeded"
                        ]
                    }
                ],
                "userProperties": [],
                "typeProperties": {
                    "variableName": "i",
                    "value": {
                        "value": "@variables('j')",
                        "type": "Expression"
                    }
                }
            },
            {
                "name": "Increment J",
                "type": "SetVariable",
                "dependsOn": [],
                "userProperties": [],
                "typeProperties": {
                    "variableName": "j",
                    "value": {
                        "value": "@string(add(int(variables('i')), 1))",
                        "type": "Expression"
                    }
                }
            }
        ],
        "variables": {
            "i": {
                "type": "String",
                "defaultValue": "0"
            },
            "j": {
                "type": "String",
                "defaultValue": "0"
            }
        },
        "annotations": []
    }
}
```

Variables are currently scoped at the pipeline level. This means that they are not thread safe and can cause unexpected and undesired behavior if they are accessed from within a parallel iteration activity such as a foreach loop, especially when the value is also being modified within that foreach activity.

## Next steps
Learn about another related control flow activity: 

- [Append Variable Activity](control-flow-append-variable-activity.md)

