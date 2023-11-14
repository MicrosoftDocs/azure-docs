---
title: Append Variable Activity
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to set the Append Variable activity to add a value to an existing array variable defined in a Data Factory or Synapse Analytics pipeline.
ms.service: data-factory
ms.subservice: orchestration
ms.custom: synapse
ms.topic: conceptual
author: chez-charlie
ms.author: chez
ms.reviewer: jburchel
ms.date: 10/20/2023
---

# Append Variable activity in Azure Data Factory and Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]
Use the Append Variable activity to add a value to an existing array variable defined in a Data Factory or Synapse Analytics pipeline.

## Create an Append Variable activity with UI

To use a Append Variable activity in a pipeline, complete the following steps:

1. Select the background of the pipeline canvas and use the Variables tab to add an array type variable:

   :::image type="content" source="media/control-flow-activities-common/add-pipeline-array-variable.png" alt-text="Shows an empty pipeline canvas with the Variables tab selected having an array type variable named TestVariable.":::

2. Search for _Append Variable_ in the pipeline Activities pane, and drag an Append Variable activity to the pipeline canvas.
1. Select the Append Variable activity on the canvas if it is not already selected, and its  **Variables** tab, to edit its details.
1. Select the variable for the Name property.
1. Enter an expression for the value, which will be appended to the array in the variable.  This can be a literal string expression, or any combination of dynamic [expressions, functions](control-flow-expression-language-functions.md), [system variables](control-flow-system-variables.md), or [outputs from other activities](how-to-expression-language-functions.md#examples-of-using-parameters-in-expressions).

   :::image type="content" source="media/control-flow-append-variable-activity/append-variable.png" alt-text="Shows the UI for an Append Variable activity.":::

> [!NOTE]
> The appended variable value does not appear in debug output unless you use a [Set Variable activity](control-flow-set-variable-activity.md) to explicitly set a new variable with its value.

## Type properties

Property | Description | Required
-------- | ----------- | --------
Name | Name of the activity in pipeline | Yes
Description | Text describing what the activity does | No
Type | Activity Type is AppendVariable | Yes
Value | String literal or expression object value used to append into specified variable | Yes
VariableName | Name of the variable that will be modified by activity, the variable must be of type ‘Array’ | Yes

## Next steps
Learn about a related control flow activity: 

- [Set Variable Activity](control-flow-set-variable-activity.md)
