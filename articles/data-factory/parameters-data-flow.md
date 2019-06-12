---
title: Azure Data Factory Mapping Data Flow Parameters
description: Learn how to parameterize a mapping data flow from data factory pipelines
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.topic: conceptual
ms.date: 06/10/2019
---

# Mapping data flow parameters

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

Mapping data flows in data factory support the use of parameters. You can define parameters inside of your data flow definition, which you can then use throughout your expressions. The parameters can then be set by the calling pipeline via the Execute Data Flow activity. You have three options to use to set the values in the data flow activity expressions:

* Use the pipeline control flow expression language to set a dynamic value
* Use the data flow expression language to set a dynamic value
* Use either expression language to set a static literal value

Use this capability to make your data flows general-purpose, flexible, and reusable. You can parameterize data flow settings and expressions with these parameters.

> [!NOTE]
> To use pipeline control flow expressions, your data flow parameter must be of type string

![Data flow parameters 1](media/data-flow/params3.png "Data flow parameters 1")

* Add an Execute Data Flow activity to the pipeline canvas.
* If your data flow has parameters, you will see the list of available parameters in the Parameters tab.** Click on the text box next to each parameter to enter your parameter value.
* You can choose to create your parameter expression via the pipeline control flow expression language or data flow expressions.

## Parameters in data flow

To add parameters to your data flow, click on the blank portion of the data flow canvas to see the general properties. In the settings pane, you will see a tab called Parameters. Click the New button to generate new parameters, which can then be set from the pipeline, passing values into your data flow. Enter a parameter name and select the data type for each parameter.

Inside of your data flow expressions, you can utilize the parameters using the values set from the pipeline. Parameters begin with $ and are immutable. You will also find the list of your available parameters inside of the Expression Builder under the Parameters tab. You can use these values within your expressions, although you may not assign new values to the parameters.

![Data flow parameters 2](media/data-flow/params1.png "Data flow parameters 2")

## Set data flow parameters from pipeline

![Data flow parameters activity](media/data-flow/params3.png "Data flow parameters activity")


![Data flow parameters expression language](media/data-flow/params4.png "Data flow parameters expression language")


## Next steps

[Execute data flow activity](control-flow-execute-data-flow-activity.md)
[Control flow expressions](control-flow-expression-language-functions.md)
