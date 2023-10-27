---
title: Validation activity
titleSuffix: Azure Data Factory & Azure Synapse
description: The Validation activity in Azure Data Factory and Synapse Analytics delays execution of the pipeline until a dataset is validated with user-defined criteria.
author: chez-charlie
ms.author: chez
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: orchestration
ms.custom: synapse
ms.topic: conceptual
ms.date: 10/20/2023
---

# Validation activity in Azure Data Factory and Synapse Analytics pipelines
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

You can use a Validation in a pipeline to ensure the pipeline only continues execution once it has validated the attached dataset reference exists, that it meets the specified criteria, or timeout has been reached.

## Create a Validation activity with UI

To use a Validation activity in a pipeline, complete the following steps:

1. Search for _Validation_ in the pipeline Activities pane, and drag a Validation activity to the pipeline canvas.
1. Select the new Validation activity on the canvas if it is not already selected, and its  **Settings** tab, to edit its details.
:::image type="content" source="media/control-flow-validation-activity/validation-activity.png" alt-text="Screenshot shows the UI for a Validation activity.":::
1. Select a dataset, or define a new one by selecting the New button.  For file based datasets like the delimited text example above, you can select either a specific file, or a folder.  When a folder is selected, the Validation activity allows you to ignore validation of the existence of child items in the folder, or require whether child items exist or not.
1. The output of the Validation activity can be used as an input to any other activities, and referenced within those activities for any of their properties using dynamic expressions.

## Syntax


```json

{
"name": "Validation_Activity",
"type": "Validation",
"typeProperties": {
"dataset": {
"referenceName": "Storage_File",
"type": "DatasetReference"
},
"timeout": "0.12:00:00",
"sleep": 10,
"minimumSize": 20
}
},
{
"name": "Validation_Activity_Folder",
"type": "Validation",
"typeProperties": {
"dataset": {
"referenceName": "Storage_Folder",
"type": "DatasetReference"
},
"timeout": "0.12:00:00",
"sleep": 10,
"childItems": true
}
}

```
## Type properties

|Property | Description | Allowed values | Required|
|-------- | ----------- | -------------- | --------|
|name | Name of the 'Validation' activity | String | Yes |
|type | Must be set to  **Validation**. | String | Yes |
|dataset | Activity will block execution until it has validated this dataset reference exists and that it meets the specified criteria, or timeout has been reached. Dataset provided should support "MinimumSize" or "ChildItems" property. | Dataset reference | Yes |
|timeout | Specifies the timeout for the activity to run. If no value is specified, default value is 12 hours ("0.12:00:00"). Format is d.hh:mm:ss | String | No |
|sleep | A delay in seconds between validation attempts. If no value is specified, default value is 10 seconds. | Integer | No |
|childItems | Checks if the folder has child items. Can be set to-true : Validate that the folder exists and that it has items. Blocks until at least one item is present in the folder or timeout value is reached.-false: Validate that the folder exists and that it is empty. Blocks until folder is empty or until timeout value is reached. If no value is specified, activity will block until the folder exists or until timeout is reached. | Boolean | No |
|minimumSize | Minimum size of a file in bytes. If no value is specified, default value is 0 bytes | Integer | No |


## Next steps
See other supported control flow activities:

- [If Condition Activity](control-flow-if-condition-activity.md)
- [Execute Pipeline Activity](control-flow-execute-pipeline-activity.md)
- [For Each Activity](control-flow-for-each-activity.md)
- [Get Metadata Activity](control-flow-get-metadata-activity.md)
- [Lookup Activity](control-flow-lookup-activity.md)
- [Web Activity](control-flow-web-activity.md)
- [Until Activity](control-flow-until-activity.md)

