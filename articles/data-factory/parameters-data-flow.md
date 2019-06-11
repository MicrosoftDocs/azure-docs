---
title: Azure Data Factory Mapping Data Flow Parameters
description: Learn how to parameterize a mapping data flow from data factory pipelines
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.topic: conceptual
ms.date: 06/10/2019
---

# Mapping data flow activity parameters

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

Mapping data flows in data factory support the use of parameters. You can define parameters inside of your data flow definition, which you can then use throughout your expressions. The parameters can then be set by the calling pipeline via the Execute Data Flow activity. You have three options to use to set the values in the data flow activity expressions:

* Use the pipeline control flow expression language to set a dynamic value
* Use the data flow expression language to set a dynamic value
* Use either expression language to set a static literal value

Use this capability to make your data flows general-purpose, flexible, and reusable.

> [!NOTE]
> To use pipeline control flow expressions, your data flow parameter must be of type string

![Data flow parameters 1](media/data-flow/params3.png "Data flow parameters 1")

* Add an Execute Data Flow activity to the pipeline canvas.
* If your data flow has parameters, you will see the list of available parameters in the Parameters tab.** Click on the text box next to each parameter to enter your parameter value.
* You can choose to create your parameter expression via the pipeline control flow expression language or data flow expressions.

## Parameters in data flow

To add parameters to your data flow, click on the blank portion of the data flow canvas to see the general properties. In the settings pane, you will see a tab called Parameters. Click the New button to generate new parameters which can be set from the pipeline, passing values into your data flow. Set the parameter name and data type for each parameter.

![Data flow parameters 2](media/data-flow/params1.png "Data flow parameters 2")

### Hash

Azure Data Factory will produce a hash of columns to produce uniform partitions such that rows with similar values will fall in the same partition. When using the Hash option, test for possible partition skew. You can set the number of physical partitions.

### Dynamic Range

Dynamic Range will use Spark dynamic ranges based on the columns or expressions that you provide. You can set the number of physical partitions. 

### Fixed Range

You must build an expression that provides a fixed range for values within your partitioned data columns. You should have a good understanding of your data before using this option in order to avoid partition skew. The value that enter for the expression will be used as part of a partition function. You can set the number of physical partitions.

### Key

If you have a good understanding of the cardinality of your data, key partitioning may be a good partition strategy. Key partitioning will create partitions for each unique value in your column. You cannot set the number of partitions because the number will be based on unique values in the data.

## Next steps

[Execute data flow activity](control-flow-execute-data-flow-activity.md)
[Control flow expressions](control-flow-expression-language-functions.md)
