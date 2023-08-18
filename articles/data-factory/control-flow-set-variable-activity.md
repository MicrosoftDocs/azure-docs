---
title: Set Variable Activity
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to use the Set Variable activity to set the value of an existing variable defined in an Azure Data Factory or Azure Synapse Analytics pipeline or to set a pipeline return value. 
ms.service: data-factory
ms.subservice: orchestration
ms.custom: synapse
ms.topic: conceptual
ms.date: 02/16/2023
author: chez-charlie
ms.author: chez
ms.reviewer: jburchel
---

# Set Variable Activity in Azure Data Factory and Azure Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Use the Set Variable activity to set the value of an existing variable of type String, Bool, or Array defined in a Data Factory or Synapse pipeline or use the Set Variable activity to set a pipeline return value (preview).

## Create a Set Variable activity with UI

To use a Set Variable activity in a pipeline, complete the following steps:

1. Select the background of the pipeline canvas and use the Variables tab to add a variable:

:::image type="content" source="media/control-flow-activities-common/add-pipeline-array-variable.png" alt-text="Screenshot of an empty pipeline canvas with the Variables tab selected with an array type variable named TestVariable.":::

2. Search for _Set Variable_ in the pipeline Activities pane, and drag a Set Variable activity to the pipeline canvas.

3. Select the Set Variable activity on the canvas if it isn't already selected, and then select the **Settings** tab to edit its details.

4. Select **Pipeline variable** for your **Variable type**.

5. Select the variable for the Name property.

6. Enter an expression to set the value for the variables. This expression can be a literal string expression, or any combination of dynamic [expressions, functions](control-flow-expression-language-functions.md), [system variables](control-flow-system-variables.md), or [outputs from other activities](how-to-expression-language-functions.md#examples-of-using-parameters-in-expressions).

:::image type="content" source="media/control-flow-set-variable-activity/set-variable-activity.png" alt-text="Screenshot of the UI for a Set variable activity.":::
    
## Setting a pipeline return value with UI

We have expanded Set Variable activity to include a special system variable, named _Pipeline Return Value_, allowing communication from the child pipeline to the calling pipeline, in the following scenario. 

You don't need to define the variable, before using it. For more information, see [Pipeline Return Value](tutorial-pipeline-return-value.md)


:::image type="content" source="media/pipeline-return-value/pipeline-return-value-00-paradigm.png" alt-text="Screenshot with ExecutePipeline Activity.":::

## Type properties

Property | Description | Required
-------- | ----------- | --------
name | Name of the activity in pipeline | yes
description | Text describing what the activity does | no
type | Must be set to **SetVariable** | yes
variableName | Name of the variable that is set by this activity | yes
value | String literal or expression object value that the variable is assigned to | yes


## Incrementing a variable

A common scenario involving variable is to use a variable as an iterator within an **Until** or **ForEach** activity. In a **Set variable** activity, you can't reference the variable being set in the `value` field, that is, no self-referencing. To work around this limitation, set a temporary variable and then create a second **Set variable** activity. The second **Set variable** activity sets the value of the iterator to the temporary variable. Here's an example of this pattern:

* First you define two variables: one for the iterator, and one for temporary storage.

:::image type="content" source="media/control-flow-set-variable-activity/set-variable-integer.png" alt-text="Screenshot shows defining variables.":::

* Then you use two activities to increment values

:::image type="content" source="media/control-flow-set-variable-activity/increment-variable.png" alt-text="Screenshot shows increment variable.":::

``` json
{
    "name": "pipeline1",
    "properties": {
        "activities": [
            {
                "name": "Increment J",
                "type": "SetVariable",
                "dependsOn": [],
                "policy": {
                    "secureOutput": false,
                    "secureInput": false
                },
                "userProperties": [],
                "typeProperties": {
                    "variableName": "temp_j",
                    "value": {
                        "value": "@add(variables('counter_i'),1)",
                        "type": "Expression"
                    }
                }
            },
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
                "policy": {
                    "secureOutput": false,
                    "secureInput": false
                },
                "userProperties": [],
                "typeProperties": {
                    "variableName": "counter_i",
                    "value": {
                        "value": "@variables('temp_j')",
                        "type": "Expression"
                    }
                }
            }
        ],
        "variables": {
            "counter_i": {
                "type": "Integer",
                "defaultValue": 0
            },
            "temp_j": {
                "type": "Integer",
                "defaultValue": 0
            }
        },
        "annotations": []
    }
}
```

Variables are scoped at the pipeline level. This means that they're not thread safe and can cause unexpected and undesired behavior if they're accessed from within a parallel iteration activity such as a ForEach loop, especially when the value is also being modified within that foreach activity.


## Next steps
Learn about another related control flow activity: 
- [Append Variable Activity](control-flow-append-variable-activity.md)

