---
title: Set Variable Activity
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to use the Set Variable activity to set the value of an existing variable defined in an Azure Data Factory or Azure Synapse Analytics pipeline.
ms.service: data-factory
ms.subservice: orchestration
ms.custom: synapse
ms.topic: conceptual
ms.date: 04/07/2020
author: chez-charlie
ms.author: chez
ms.reviewer: jburchel
---
# Set Variable Activity in Azure Data Factory and Azure Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Use the Set Variable activity to set the value of an existing variable of type String, Bool, or Array defined in a Data Factory or Synapse pipeline.

## Type properties

Property | Description | Required
-------- | ----------- | --------
name | Name of the activity in pipeline | yes
description | Text describing what the activity does | no
type | Must be set to **SetVariable** | yes
value | String literal or expression object value that the variable is assigned to | yes
variableName | Name of the variable that is set by this activity | yes

## Incrementing a variable

A common scenario involving variables is using a variable as an iterator within an until or foreach activity. In a set variable activity you cannot reference the variable being set in the `value` field. To workaround this limitation, set a temporary variable and then create a second set variable activity. The second set variable activity sets the value of the iterator to the temporary variable. 

Below is an example of this pattern:

![Increment variable](media/control-flow-set-variable-activity/increment-variable.png "Increment variable")

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
