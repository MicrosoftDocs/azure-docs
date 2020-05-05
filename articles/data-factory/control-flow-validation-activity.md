---
title: Validation activity in Azure Data Factory 
description: The Validation activity does not continue execution of the pipeline until it validates the attached dataset with certain criteria the user specifies.
services: data-factory
documentationcenter: ''
author: djpmsft
ms.author: daperlov
manager: jroth
ms.reviewer: maghan
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.date: 03/25/2019
---

# Validation activity in Azure Data Factory
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

You can use a Validation in a pipeline to ensure the pipeline only continues execution once it has validated the attached dataset reference exists, that it meets the specified criteria, or timeout has been reached.


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
        "timeout": "7.00:00:00",
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
        "timeout": "7.00:00:00",
        "sleep": 10,
        "childItems": true
    }
}

```


## Type properties

Property | Description | Allowed values | Required
-------- | ----------- | -------------- | --------
name | Name of the 'Validation' activity | String | Yes |
type | Must be set to  **Validation**. | String | Yes |
dataset | Activity will block execution until it has validated this dataset reference exists and that it meets the specified criteria, or timeout has been reached. Dataset provided should support "MinimumSize" or "ChildItems" property. | Dataset reference | Yes |
timeout | Specifies the timeout for the activity to run. If no value is specified, default value is 7 days ("7.00:00:00"). Format is d.hh:mm:ss | String | No |
sleep | A delay in seconds between validation attempts. If no value is specified, default value is 10 seconds. | Integer | No |
childItems | Checks if the folder has child items. Can be set to-true : Validate that the folder exists and that it has items. Blocks until at least one item is present in the folder or timeout value is reached.-false: Validate that the folder exists and that it is empty. Blocks until folder is empty or until timeout value is reached. If no value is specified, activity will block until the folder exists or until timeout is reached. | Boolean | No |
minimumSize | Minimum size of a file in bytes. If no value is specified, default value is 0 bytes | Integer | No |


## Next steps
See other control flow activities supported by Data Factory:

- [If Condition Activity](control-flow-if-condition-activity.md)
- [Execute Pipeline Activity](control-flow-execute-pipeline-activity.md)
- [For Each Activity](control-flow-for-each-activity.md)
- [Get Metadata Activity](control-flow-get-metadata-activity.md)
- [Lookup Activity](control-flow-lookup-activity.md)
- [Web Activity](control-flow-web-activity.md)
- [Until Activity](control-flow-until-activity.md)
