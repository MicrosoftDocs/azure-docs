---
title: Set Pipeline Return Value
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to use the Set Variable activity to send information from child pipeline to main pipeline
ms.service: data-factory
ms.subservice: orchestration
ms.custom: synapse
ms.topic: conceptual
ms.date: 2/12/2022
author: chez-charlie
ms.author: chez
ms.reviewer: jburchel
---

# Set Pipeline Return Value in Azure Data Factory and Azure Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

In the calling pipeline-child pipeline paradigm, you can use the [Set Variable activity](control-flow-set-variable-activity.md) to return values from the child pipeline to the calling pipeline. In the following scenario, we have a child pipeline through [Execute Pipeline Activity](control-flow-execute-pipeline-activity.md). And we want to __retrieve information from the child pipeline__, to be sebsequently used in the calling pipeline.

:::image type="content" source="media/pipeline-return-value/pipeline-return-value-00-paradigm.png" alt-text="Screenshot with ExecutePipeline Activity.":::

Introduce pipeline return value, a dictionary of key value pairs, that allows communications between child pipelines and parent pipeline.

## Pre-requesite - Calling a Child Pipeline

The pre-requesite of the use case, is that you have an [Execute Pipeline Activity](control-flow-execute-pipeline-activity.md), calling a child pipeline. It is important that we enabled _Wait on Completion_ for the activity

:::image type="content" source="media/pipeline-return-value/pipeline-return-value-01-execute-pipeline-setting.png" alt-text="Screenshot setting ExecutePipeline Activity to wait for completion.":::


## Configure Pipeline Return Value in Child Pipeline

We have expanded the [Set Variable activity](control-flow-set-variable-activity.md) to include system variables _Pipeline Return Value_. You do not need to define them at pipeline level (as opposed to any other variables you use in the pipeline).

1. Search for _Set Variable_ in the pipeline Activities pane, and drag a Set Variable activity to the pipeline canvas.
1. Select the Set Variable activity on the canvas if it is not already selected, and then its **Variables** tab, to edit its details.
1. Choose _Pipeline return value_ for variable type.
1. Click _New_ to add a new key value pair.
1. You can add resonable ammount of key value pairs, bounded by size limit of returning json.

:::image type="content" source="media/pipeline-return-value/pipeline-return-value-02-child-pipeline.png" alt-text="Screenshot shows the ui for pipeline return value.":::

There are a few options for value types, including

Type Name | Description
-------- | ----------- 
String | The most straight forward of all. It expects a string value.
Expression | It allows you to reference output from previous activities.
Array | It expects an array of _string values_. Press "enter" key to separate values in the array
Boolean | True or False
Null | Signal place holder status; the value will be constant _null_
Int | It expects a numerical value of integer type
Float | It expects a numerical value of float type
Object | __Warning__ very complicated use cases only. It allows you to embed a list of key value pairs type, i.e. json, for the value

Object Type are defined as follows:

``` json
[{"key": "myKey1", "value": {"type": "String", "content": "hello world"}}, 
 {"key": "myKey2", "value": {"type": "String", "content": "hi"}}
]
```

## Retrieving Value in Calling Pipeline

The pipeline return value of the child pipeline will become the activity output of the Execute Pipeline Activity. You can retrieve the information with _@activity('Execute Pipeline1').output.pipelineReturnValue.keyName_. The use case is limitless. 

For instance, you may use an _int_ value from child pipeline to define the wait period for a [wait activity](control-flow-wait-activity.md), or a _sting_ value to definet the URL for the [Web activity](control-flow-web-activity.md), or _expression_ payload to a [script activity](transform-data-using-script.md) for logging purposes.

:::image type="content" source="media/pipeline-return-value/pipeline-return-value-03-calling-pipeline.png" alt-text="Screenshot shows the ui for pipeline return value.":::

There are 2 noticeable call outs in referencing the pipeline return values. 

1.  With _Object_ type, you may further expand into the nested json object, such as _@activity('Execute Pipeline1').output.pipelineReturnValue.keyName.nextLevelKey_
1.  With _Array_ type, you can specify the index in the list, with _@activity('Execute Pipeline1').output.pipelineReturnValue.keyName[0]_. The number is zero indexed, meaning that it starts with 0.

> [!NOTE]
> Please make sure that the _keyName_ you are referencing exists in your child pipeline. ADF expression builder can _not_ confirm the referential check for you.
> Pipeline will fail if the key referenced is missing in the payload

## Special Considerations

You may have multiple Set Pipeline Return value activities in a pipeline. However, please ensure that only one gets to run in a pipeline.

:::image type="content" source="media/pipeline-return-value/pipeline-return-value-04-multiple.png" alt-text="Screenshot with Pipeline Return Value and Branching.":::

To avoid missing key nissing situation in the calling pipeline, described above, we encourage you to have the same list of keys for all branches in child pipeline. Please consider using _null_ types for keys that doesn't have values, in a specific branch.

## Next steps
Learn about another related control flow activity: 
- [Set Variable Activity](control-flow-set-variable-activity.md)
- [Append Variable Activity](control-flow-append-variable-activity.md)

