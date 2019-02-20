---
title: Filter activity in Azure Data Factory | Microsoft Docs
description: The Filter activity filters the inputs. 
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 05/04/2018
ms.author: shlo

---
# Filter activity in Azure Data Factory
You can use a Filter activity in a pipeline to apply a filter expression to an input array. 

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

## Type properties

Property | Description | Allowed values | Required
-------- | ----------- | -------------- | --------
name | Name of the `Filter` activity. | String | Yes
type | Must be set to **filter**. | String | Yes
condition | Condition to be used for filtering the input. | Expression | Yes
items | Input array on which filter should be applied. | Expression | Yes

## Example

In this example, the pipeline has two activities: **Filter** and **ForEach**. The Filter activity is configured to filter the input array for items with a value greater than 3. The ForEach activity then iterates over the filtered values and waits for the number of seconds specified by the current value.

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
				"typeProperties": {
					"isSequential": "false",
					"batchCount": 1,
					"items": "@activity('MyFilterActivity').output.value",
					"activities": [{
						"type": "Wait",
						"typeProperties": {
							"waitTimeInSeconds": "@item()"
						},
						"name": "MyWaitActivity"
					}]
				},
				"dependsOn": [{
					"activity": "MyFilterActivity",
					"dependencyConditions": ["Succeeded"]
				}]
			}
		],
		"parameters": {
			"inputs": {
				"type": "Array",
				"defaultValue": [1, 2, 3, 4, 5, 6]
			}
		}
	}
}
```

## Next steps
See other control flow activities supported by Data Factory: 

- [If Condition Activity](control-flow-if-condition-activity.md)
- [Execute Pipeline Activity](control-flow-execute-pipeline-activity.md)
- [For Each Activity](control-flow-for-each-activity.md)
- [Get Metadata Activity](control-flow-get-metadata-activity.md)
- [Lookup Activity](control-flow-lookup-activity.md)
- [Web Activity](control-flow-web-activity.md)
- [Until Activity](control-flow-until-activity.md)
