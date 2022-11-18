---
title: Filter activity
titleSuffix: Azure Data Factory & Azure Synapse
description: The Filter activity filters the inputs to Azure Data Factory and Synapse Analytics pipelines. 
author: chez-charlie
ms.author: chez
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: orchestration
ms.custom: synapse
ms.topic: conceptual
ms.date: 10/25/2022
---

# Filter activity in Azure Data Factory and Synapse Analytics pipelines
You can use a Filter activity in a pipeline to apply a filter expression to an input array. 
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

## Syntax

```json
{
    "name": "MyFilterActivity",
    "type": "filter",
    "typeProperties": {
        "condition": "<condition>",
        "items": "<input array>"
    }
}
```
## Create a Filter activity with UI

To use a Filter activity in a pipeline, complete the following steps:

1. You can use any array type variable or [outputs from other activities](how-to-expression-language-functions.md#examples-of-using-parameters-in-expressions) as the input for your filter condition.  To create an array variable, select the background of the pipeline canvas and then select the **Variables** tab to add an array type variable as shown below.

   :::image type="content" source="media/control-flow-activities-common/pipeline-array-variable.png" alt-text="Shows an empty pipeline canvas with an array type variable added to the pipeline.":::

1. Search for _Filter_ in the pipeline Activities pane, and drag a Filter activity to the pipeline canvas.
1. Select the new Filter activity on the canvas if it is not already selected, and its  **Settings** tab, to edit its details.

   :::image type="content" source="media/control-flow-filter-activity/filter-activity.png" alt-text="Shows the UI for a Filter activity.":::

1. Select the **Items** field and then select the **Add dynamic content** link to open the dynamic content editor pane.

   :::image type="content" source="media/control-flow-filter-activity/add-dynamic-content-link.png" alt-text="Shows the &nbsp;Add dynamic content&nbsp; link for the Items property.":::

1. Select your input array to be filtered in the dynamic content editor.  In this example, we select the variable created in the first step.

   :::image type="content" source="media/control-flow-activities-common/add-dynamic-content-pane.png" alt-text="Shows the dynamic content editor with the variable created in the first step selected":::

1. Use the dynamic content editor again to specify a filter condition for the Condition property, as shown above.
1. You can use the output from the Filter activity as an input to other activities like the [ForEach activity](control-flow-for-each-activity.md).

## Type properties

Property | Description | Allowed values | Required
-------- | ----------- | -------------- | --------
name | Name of the `Filter` activity. | String | Yes
type | Must be set to **filter**. | String | Yes
condition | Condition to be used for filtering the input. | Expression | Yes
items | Input array on which filter should be applied. | Expression | Yes

## Example

In this example, the pipeline has two activities: **Filter** and **ForEach**. The Filter activity is configured to filter the input array for items with a value greater than 3. The ForEach activity then iterates over the filtered values and sets the variable **test** to the current value.

```json
{
    "name": "PipelineName",
    "properties": {
        "activities": [{
                "name": "MyFilterActivity",
                "type": "filter",
                "typeProperties": {
                    "condition": "@greater(item(),3)",
                    "items": "@pipeline().parameters.inputs"
                }
            },
            {
            "name": "MyForEach",
            "type": "ForEach",
            "dependsOn": [
                {
                    "activity": "MyFilterActivity",
                    "dependencyConditions": [
                        "Succeeded"
                    ]
                }
            ],
            "userProperties": [],
            "typeProperties": {
                "items": {
                    "value": "@activity('MyFilterActivity').output.value",
                    "type": "Expression"
                },
                "isSequential": "false",
                "batchCount": 1,
                "activities": [
                    {
                        "name": "Set Variable1",
                        "type": "SetVariable",
                        "dependsOn": [],
                        "userProperties": [],
                        "typeProperties": {
                            "variableName": "test",
                            "value": {
                                "value": "@string(item())",
                                "type": "Expression"
                            }
                        }
                    }
                ]
            }
        }],
        "parameters": {
            "inputs": {
                "type": "Array",
                "defaultValue": [1, 2, 3, 4, 5, 6]
            }
        },
        "variables": {
            "test": {
                "type": "String"
            }
        },
        "annotations": []
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
