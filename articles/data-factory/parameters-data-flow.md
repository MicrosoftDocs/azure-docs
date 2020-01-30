---
title: Parameterizing mapping data flows
description: Learn how to parameterize a mapping data flow from data factory pipelines
author: kromerm
ms.author: makromer
ms.reviewer: daperlov
ms.service: data-factory
ms.topic: conceptual
ms.date: 01/07/2020
---

# Parameterizing mapping data flows

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)] 

Mapping data flows in Azure Data Factory support the use of parameters. You can define parameters inside of your data flow definition, which you can then use throughout your expressions. The parameter values can be set by the calling pipeline via the Execute Data Flow activity. You have three options for setting the values in the data flow activity expressions:

* Use the pipeline control flow expression language to set a dynamic value
* Use the data flow expression language to set a dynamic value
* Use either expression language to set a static literal value

Use this capability to make your data flows general-purpose, flexible, and reusable. You can parameterize data flow settings and expressions with these parameters.

## Create parameters in a mapping data flow

To add parameters to your data flow, click on the blank portion of the data flow canvas to see the general properties. In the settings pane, you will see a tab called **Parameter**. Select **New** to generate a new parameter. For each parameter, you must assign a name, select a type, and optionally set a default value.

![Create Data Flow parameters](media/data-flow/create-params.png "Create Data Flow parameters")

## Use parameters in a mapping data flow 

Parameters can be referenced in any data flow expression. Parameters begin with $ and are immutable. You will find the list of available parameters inside of the Expression Builder under the **Parameters** tab.

![Data flow parameter expression](media/data-flow/parameter-expression.png "Data flow parameter expression")

You can quickly add additional parameters by selecting **New parameter** and specifying the name and type.

![Data flow parameter expression](media/data-flow/new-parameter-expression.png "Data flow parameter expression")

### Passing in a column name as a parameter

A common pattern is to pass in a column name as a parameter value. To reference the column associated with the parameter, use the `byName()` function. Remember to cast the column to its appropriate type with a casting function such as `toString()`.

For example, if you wanted to map a string column based upon a parameter `columnName`, you can add a derived column transformation equal to `toString(byName($columnName))`.

![Passing in a column name as a parameter](media/data-flow/parameterize-column-name.png "Passing in a column name as a paramete")

## Assign parameter values from a pipeline

Once you've created your data flow with parameters, you can execute it from a pipeline with the Execute Data Flow Activity. After you add the activity to your pipeline canvas, you will be presented with the available data flow parameters in the activity's **Parameters** tab.

![Setting a Data Flow parameter](media/data-flow/parameter-assign.png "Setting a Data Flow parameter")

If your parameter data type is string, when you click the text box to set parameter values, you can choose to enter either a pipeline or a data flow expression. If you choose pipeline expression, you will be presented with the pipeline expression panel. Make sure to include pipeline functions inside string interpolation syntax using `'@{<expression>}'`, for example:

```'@{pipeline().RunId}'```

If your parameter is not of type string, you will always be presented with the Data Flow Expression Builder. Here, you can enter any expression or literal values that you wish that matches the data type of the parameter. Below are examples of data flow expression and a literal string from the expression builder:

* ```toInteger(Role)```
* ```'this is my static literal string'```

Each mapping data flow can have any combination of pipeline and data flow expression parameters. 

![Data flow parameters sample](media/data-flow/parameter-example.png "Data flow parameters sample")



## Next steps
* [Execute data flow activity](control-flow-execute-data-flow-activity.md)
* [Control flow expressions](control-flow-expression-language-functions.md)
