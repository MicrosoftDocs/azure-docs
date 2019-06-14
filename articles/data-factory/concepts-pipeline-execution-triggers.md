---
title: Pipeline execution and triggers in Azure Data Factory | Microsoft Docs
description: This article provides information about how to execute a pipeline in Azure Data Factory, either on-demand or by creating a trigger.
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 07/05/2018
ms.author: shlo

---

# Pipeline execution and triggers in Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of the Data Factory service that you're using:"]
> * [Version 1](v1/data-factory-scheduling-and-execution.md)
> * [Current version](concepts-pipeline-execution-triggers.md)

A _pipeline run_ in Azure Data Factory defines an instance of a pipeline execution. For example, say you have a pipeline that executes at 8:00 AM, 9:00 AM, and 10:00 AM. In this case, there are three separate runs of the pipeline, or pipeline runs. Each pipeline run has a unique pipeline run ID. A run ID is a GUID that uniquely defines that particular pipeline run.

Pipeline runs are typically instantiated by passing arguments to parameters that you define in the pipeline. You can execute a pipeline either manually or by using a _trigger_. This article provides details about both ways of executing a pipeline.

## Manual execution (on-demand)
The manual execution of a pipeline is also referred to as _on-demand_ execution.

For example, say you have a basic pipeline named **copyPipeline** that you want to execute. The pipeline has a single activity that copies from an Azure Blob storage source folder to a destination folder in the same storage. The following JSON definition shows this sample pipeline:

```json
{
    "name": "copyPipeline",
    "properties": {
        "activities": [
            {
                "type": "Copy",
                "typeProperties": {
                    "source": {
                        "type": "BlobSource"
                    },
                    "sink": {
                        "type": "BlobSink"
                    }
                },
                "name": "CopyBlobtoBlob",
                "inputs": [
                    {
                        "referenceName": "sourceBlobDataset",
                        "type": "DatasetReference"
                    }
                ],
                "outputs": [
                    {
                        "referenceName": "sinkBlobDataset",
                        "type": "DatasetReference"
                    }
                ]
            }
        ],
        "parameters": {
            "sourceBlobContainer": {
                "type": "String"
            },
            "sinkBlobContainer": {
                "type": "String"
            }
        }
    }
}
```

In the JSON definition, the pipeline takes two parameters: **sourceBlobContainer** and **sinkBlobContainer**. You pass values to these parameters at runtime.

You can manually run your pipeline by using one of the following methods:
- .NET SDK
- Azure PowerShell module
- REST API
- Python SDK

### REST API
The following sample command shows you how to manually run your pipeline by using the REST API:

```
POST
https://management.azure.com/subscriptions/mySubId/resourceGroups/myResourceGroup/providers/Microsoft.DataFactory/factories/myDataFactory/pipelines/copyPipeline/createRun?api-version=2017-03-01-preview
```

For a complete sample, see [Quickstart: Create a data factory by using the REST API](quickstart-create-data-factory-rest-api.md).

### Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

The following sample command shows you how to manually run your pipeline by using Azure PowerShell:

```powershell
Invoke-AzDataFactoryV2Pipeline -DataFactory $df -PipelineName "Adfv2QuickStartPipeline" -ParameterFile .\PipelineParameters.json
```

You pass parameters in the body of the request payload. In the .NET SDK, Azure PowerShell, and the Python SDK, you pass values in a dictionary that's passed as an argument to the call:

```json
{
  "sourceBlobContainer": "MySourceFolder",
  "sinkBlobContainer": "MySinkFolder"
}
```

The response payload is a unique ID of the pipeline run:

```json
{
  "runId": "0448d45a-a0bd-23f3-90a5-bfeea9264aed"
}
```

For a complete sample, see [Quickstart: Create a data factory by using Azure PowerShell](quickstart-create-data-factory-powershell.md).

### .NET SDK
The following sample call shows you how to manually run your pipeline by using the .NET SDK:

```csharp
client.Pipelines.CreateRunWithHttpMessagesAsync(resourceGroup, dataFactoryName, pipelineName, parameters)
```

For a complete sample, see [Quickstart: Create a data factory by using the .NET SDK](quickstart-create-data-factory-dot-net.md).

> [!NOTE]
> You can use the .NET SDK to invoke Data Factory pipelines from Azure Functions, from your own web services, and so on.

<h2 id="triggers">Trigger execution</h2>
Triggers are another way that you can execute a pipeline run. Triggers represent a unit of processing that determines when a pipeline execution needs to be kicked off. Currently, Data Factory supports three types of triggers:

- Schedule trigger: A trigger that invokes a pipeline on a wall-clock schedule.

- Tumbling window trigger: A trigger that operates on a periodic interval, while also retaining state.

- Event-based trigger: A trigger that responds to an event.

Pipelines and triggers have a many-to-many relationship. Multiple triggers can kick off a single pipeline, or a single trigger can kick off multiple pipelines. In the following trigger definition, the **pipelines** property refers to a list of pipelines that are triggered by the particular trigger. The property definition includes values for the pipeline parameters.

### Basic trigger definition

```json
{
    "properties": {
        "name": "MyTrigger",
        "type": "<type of trigger>",
        "typeProperties": {...},
        "pipelines": [
            {
                "pipelineReference": {
                    "type": "PipelineReference",
                    "referenceName": "<Name of your pipeline>"
                },
                "parameters": {
                    "<parameter 1 Name>": {
                        "type": "Expression",
                        "value": "<parameter 1 Value>"
                    },
                    "<parameter 2 Name>": "<parameter 2 Value>"
                }
            }
        ]
    }
}
```

## Schedule trigger
A schedule trigger runs pipelines on a wall-clock schedule. This trigger supports periodic and advanced calendar options. For example, the trigger supports intervals like "weekly" or "Monday at 5:00 PM and Thursday at 9:00 PM." The schedule trigger is flexible because the dataset pattern is agnostic, and the trigger doesn't discern between time-series and non-time-series data.

For more information about schedule triggers and for examples, see [Create a schedule trigger](how-to-create-schedule-trigger.md).

## Schedule trigger definition
When you create a schedule trigger, you specify scheduling and recurrence by using a JSON definition.

To have your schedule trigger kick off a pipeline run, include a pipeline reference of the particular pipeline in the trigger definition. Pipelines and triggers have a many-to-many relationship. Multiple triggers can kick off a single pipeline. A single trigger can kick off multiple pipelines.

```json
{
  "properties": {
    "type": "ScheduleTrigger",
    "typeProperties": {
      "recurrence": {
        "frequency": <<Minute, Hour, Day, Week, Year>>,
        "interval": <<int>>, // How often to fire
        "startTime": <<datetime>>,
        "endTime": <<datetime>>,
        "timeZone": "UTC",
        "schedule": { // Optional (advanced scheduling specifics)
          "hours": [<<0-24>>],
          "weekDays": [<<Monday-Sunday>>],
          "minutes": [<<0-60>>],
          "monthDays": [<<1-31>>],
          "monthlyOccurrences": [
            {
              "day": <<Monday-Sunday>>,
              "occurrence": <<1-5>>
            }
          ]
        }
      }
    },
  "pipelines": [
    {
      "pipelineReference": {
        "type": "PipelineReference",
        "referenceName": "<Name of your pipeline>"
      },
      "parameters": {
        "<parameter 1 Name>": {
          "type": "Expression",
          "value": "<parameter 1 Value>"
        },
        "<parameter 2 Name>": "<parameter 2 Value>"
      }
    }
  ]}
}
```

> [!IMPORTANT]
> The **parameters** property is a mandatory property of the **pipelines** element. If your pipeline doesn't take any parameters, you must include an empty JSON definition for the **parameters** property.

### Schema overview
The following table provides a high-level overview of the major schema elements that are related to recurrence and scheduling a trigger:

| JSON property | Description |
|:--- |:--- |
| **startTime** | A date-time value. For basic schedules, the value of the **startTime** property applies to the first occurrence. For complex schedules, the trigger starts no sooner than the specified **startTime** value. |
| **endTime** | The end date and time for the trigger. The trigger doesn't execute after the specified end date and time. The value for the property can't be in the past. <!-- This property is optional. --> |
| **timeZone** | The time zone. Currently, only the UTC time zone is supported. |
| **recurrence** | A recurrence object that specifies the recurrence rules for the trigger. The recurrence object supports the **frequency**, **interval**, **endTime**, **count**, and **schedule** elements. When a recurrence object is defined, the **frequency** element is required. The other elements of the recurrence object are optional. |
| **frequency** | The unit of frequency at which the trigger recurs. The supported values include "minute", "hour", "day", "week", and "month". |
| **interval** | A positive integer that denotes the interval for the **frequency** value. The **frequency** value determines how often the trigger runs. For example, if the **interval** is 3 and the **frequency** is "week", the trigger recurs every three weeks. |
| **schedule** | The recurrence schedule for the trigger. A trigger with a specified **frequency** value alters its recurrence based on a recurrence schedule. The **schedule** property contains modifications for the recurrence that are based on minutes, hours, week days, month days, and week number.

### Schedule trigger example

```json
{
	"properties": {
		"name": "MyTrigger",
		"type": "ScheduleTrigger",
		"typeProperties": {
			"recurrence": {
				"frequency": "Hour",
				"interval": 1,
				"startTime": "2017-11-01T09:00:00-08:00",
				"endTime": "2017-11-02T22:00:00-08:00"
			}
		},
		"pipelines": [{
				"pipelineReference": {
					"type": "PipelineReference",
					"referenceName": "SQLServerToBlobPipeline"
				},
				"parameters": {}
			},
			{
				"pipelineReference": {
					"type": "PipelineReference",
					"referenceName": "SQLServerToAzureSQLPipeline"
				},
				"parameters": {}
			}
		]
	}
}
```

### Schema defaults, limits, and examples

| JSON property | Type | Required | Default value | Valid values | Example |
|:--- |:--- |:--- |:--- |:--- |:--- |
| **startTime** | string | Yes | None | ISO 8601 date-times | `"startTime" : "2013-01-09T09:30:00-08:00"` |
| **recurrence** | object | Yes | None | A recurrence object | `"recurrence" : { "frequency" : "monthly", "interval" : 1 }` |
| **interval** | number | No | 1 | 1 to 1000 | `"interval":10` |
| **endTime** | string | Yes | None | A date-time value that represents a time in the future | `"endTime" : "2013-02-09T09:30:00-08:00"` |
| **schedule** | object | No | None | A schedule object | `"schedule" : { "minute" : [30], "hour" : [8,17] }` |

### startTime property
The following table shows you how the **startTime** property controls a trigger run:

| startTime value | Recurrence without schedule | Recurrence with schedule |
|:--- |:--- |:--- |
| **Start time is in the past** | Calculates the first future execution time after the start time, and runs at that time.<br /><br />Runs subsequent executions calculated from the last execution time.<br /><br />See the example that follows this table. | The trigger starts _no sooner than_ the specified start time. The first occurrence is based on the schedule,  calculated from the start time.<br /><br />Runs subsequent executions based on the recurrence schedule. |
| **Start time is in the future or the current time** | Runs once at the specified start time.<br /><br />Runs subsequent executions calculated from the last execution time. | The trigger starts _no sooner_ than the specified start time. The first occurrence is based on the schedule, calculated from the start time.<br /><br />Runs subsequent executions based on the recurrence schedule. |

Let's look at an example of what happens when the start time is in the past, with a recurrence, but no schedule. Assume that the current time is 2017-04-08 13:00, the start time is 2017-04-07 14:00, and the recurrence is every two days. (The **recurrence** value is defined by setting the **frequency** property to "day" and the **interval** property to 2.) Notice that the **startTime** value is in the past and occurs before the current time.

Under these conditions, the first execution is 2017-04-09 at 14:00. The Scheduler engine calculates execution occurrences from the start time. Any instances in the past are discarded. The engine uses the next instance that occurs in the future. In this scenario, the start time is 2017-04-07 at 2:00 PM. The next instance is two days from that time, which is on 2017-04-09 at 2:00 PM.

The first execution time is the same even whether **startTime** is 2017-04-05 14:00 or 2017-04-01 14:00. After the first execution, subsequent executions are calculated by using the schedule. Therefore, the subsequent executions are on 2017-04-11 at 2:00 PM, then on 2017-04-13 at 2:00 PM, then on 2017-04-15 at 2:00 PM, and so on.

Finally, when hours or minutes aren’t set in the schedule for a trigger, the hours or minutes of the first execution are used as defaults.

### schedule property
You can use **schedule** to *limit* the number of trigger executions. For example, if a trigger with a monthly frequency is scheduled to run only on day 31, the trigger runs only in those months that have a thirty-first day.

You can also use **schedule** to *expand* the number of trigger executions. For example, a trigger with a monthly frequency that's scheduled to run on month days 1 and 2, runs on the first and second days of the month, rather than once a month.

If multiple **schedule** elements are specified, the order of evaluation is from the largest to the smallest schedule setting: week number, month day, week day, hour, minute.

The following table describes the **schedule** elements in detail:

| JSON element | Description | Valid values |
|:--- |:--- |:--- |
| **minutes** | Minutes of the hour at which the trigger runs. |- Integer<br />- Array of integers|
| **hours** | Hours of the day at which the trigger runs. |- Integer<br />- Array of integers|
| **weekDays** | Days of the week the trigger runs. The value can be specified only with a weekly frequency.|<br />- Monday<br />- Tuesday<br />- Wednesday<br />- Thursday<br />- Friday<br />- Saturday<br />- Sunday<br />- Array of day values (maximum array size is 7)<br /><br />Day values are not case-sensitive|
| **monthlyOccurrences** | Days of the month on which the trigger runs. The value can be specified with a monthly frequency only. |- Array of **monthlyOccurrence** objects: `{ "day": day, "occurrence": occurrence }`<br />- The **day** attribute is the day of the week on which the trigger runs. For example, a **monthlyOccurrences** property with a **day** value of `{Sunday}` means every Sunday of the month. The **day** attribute is required.<br />- The **occurrence** attribute is the occurrence of the specified **day** during the month. For example, a **monthlyOccurrences** property with **day** and **occurrence** values of `{Sunday, -1}` means the last Sunday of the month. The **occurrence** attribute is optional.|
| **monthDays** | Day of the month on which the trigger runs. The value can be specified with a monthly frequency only. |- Any value <= -1 and >= -31<br />- Any value >= 1 and <= 31<br />- Array of values|

## Tumbling window trigger
Tumbling window triggers are a type of trigger that fires at a periodic time interval from a specified start time, while retaining state. Tumbling windows are a series of fixed-sized, non-overlapping, and contiguous time intervals.

For more information about tumbling window triggers and for examples, see [Create a tumbling window trigger](how-to-create-tumbling-window-trigger.md).

## Event-based trigger

An event-based trigger runs pipelines in response to an event, such as the arrival of a file, or the deletion of a file, in Azure Blob Storage.

For more information about event-based triggers, see [Create a trigger that runs a pipeline in response to an event](how-to-create-event-trigger.md).

## Examples of trigger recurrence schedules
This section provides examples of recurrence schedules. It focuses on the **schedule** object and its elements.

The examples assume that the **interval** value is 1, and that the **frequency** value is correct according to the schedule definition. For example, you can't have a **frequency** value of "day" and also have a **monthDays** modification in the **schedule** object. These kinds of restrictions are described in the table in the preceding section.

| Example | Description |
|:--- |:--- |
| `{"hours":[5]}` | Run at 5:00 AM every day. |
| `{"minutes":[15], "hours":[5]}` | Run at 5:15 AM every day. |
| `{"minutes":[15], "hours":[5,17]}` | Run at 5:15 AM and 5:15 PM every day. |
| `{"minutes":[15,45], "hours":[5,17]}` | Run at 5:15 AM, 5:45 AM, 5:15 PM, and 5:45 PM every day. |
| `{"minutes":[0,15,30,45]}` | Run every 15 minutes. |
| `{hours":[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]}` | Run every hour.<br /><br />This trigger runs every hour. The minutes are controlled by the **startTime** value, when a value is specified. If a value isn't specified, the minutes are controlled by the creation time. For example, if the start time or creation time (whichever applies) is 12:25 PM, the trigger runs at 00:25, 01:25, 02:25, ..., and 23:25.<br /><br />This schedule is equivalent to having a trigger with a **frequency** value of "hour", an **interval** value of 1, and no **schedule**. This schedule can be used with different **frequency** and **interval** values to create other triggers. For example, when the **frequency** value is "month", the schedule runs only once a month, rather than every day when the **frequency** value is "day". |
| `{"minutes":[0]}` | Run every hour on the hour.<br /><br />This trigger runs every hour on the hour starting at 12:00 AM, 1:00 AM, 2:00 AM, and so on.<br /><br />This schedule is equivalent to a trigger with a **frequency** value of "hour" and a **startTime** value of zero minutes, and no **schedule** but a **frequency** value of "day". If the **frequency** value is "week" or "month", the schedule executes one day a week or one day a month only, respectively. |
| `{"minutes":[15]}` | Run at 15 minutes past every hour.<br /><br />This trigger runs every hour at 15 minutes past the hour starting at 00:15 AM, 1:15 AM, 2:15 AM, and so on, and ending at 11:15 PM. |
| `{"hours":[17], "weekDays":["saturday"]}` | Run at 5:00 PM on Saturdays every week. |
| `{"hours":[17], "weekDays":["monday", "wednesday", "friday"]}` | Run at 5:00 PM on Monday, Wednesday, and Friday every week. |
| `{"minutes":[15,45], "hours":[17], "weekDays":["monday", "wednesday", "friday"]}` | Run at 5:15 PM and 5:45 PM on Monday, Wednesday, and Friday every week. |
| `{"minutes":[0,15,30,45], "weekDays":["monday", "tuesday", "wednesday", "thursday", "friday"]}` | Run every 15 minutes on weekdays. |
| `{"minutes":[0,15,30,45], "hours": [9, 10, 11, 12, 13, 14, 15, 16] "weekDays":["monday", "tuesday", "wednesday", "thursday", "friday"]}` | Run every 15 minutes on weekdays between 9:00 AM and 4:45 PM. |
| `{"weekDays":["tuesday", "thursday"]}` | Run on Tuesdays and Thursdays at the specified start time. |
| `{"minutes":[0], "hours":[6], "monthDays":[28]}` | Run at 6:00 AM on the twenty-eighth day of every month (assuming a **frequency** value of "month"). |
| `{"minutes":[0], "hours":[6], "monthDays":[-1]}` | Run at 6:00 AM on the last day of the month.<br /><br />To run a trigger on the last day of a month, use -1 instead of day 28, 29, 30, or 31. |
| `{"minutes":[0], "hours":[6], "monthDays":[1,-1]}` | Run at 6:00 AM on the first and last day of every month. |
| `{monthDays":[1,14]}` | Run on the first and fourteenth day of every month at the specified start time. |
| `{"minutes":[0], "hours":[5], "monthlyOccurrences":[{"day":"friday", "occurrence":1}]}` | Run on the first Friday of every month at 5:00 AM. |
| `{"monthlyOccurrences":[{"day":"friday", "occurrence":1}]}` | Run on the first Friday of every month at the specified start time. |
| `{"monthlyOccurrences":[{"day":"friday", "occurrence":-3}]}` | Run on the third Friday from the end of the month, every month, at the specified start time. |
| `{"minutes":[15], "hours":[5], "monthlyOccurrences":[{"day":"friday", "occurrence":1},{"day":"friday", "occurrence":-1}]}` | Run on the first and last Friday of every month at 5:15 AM. |
| `{"monthlyOccurrences":[{"day":"friday", "occurrence":1},{"day":"friday", "occurrence":-1}]}` | Run on the first and last Friday of every month at the specified start time. |
| `{"monthlyOccurrences":[{"day":"friday", "occurrence":5}]}` | Run on the fifth Friday of every month at the specified start time.<br /><br />When there's no fifth Friday in a month, the pipeline doesn't run. To run the trigger on the last occurring Friday of the month, consider using -1 instead of 5 for the **occurrence** value. |
| `{"minutes":[0,15,30,45], "monthlyOccurrences":[{"day":"friday", "occurrence":-1}]}` | Run every 15 minutes on the last Friday of the month. |
| `{"minutes":[15,45], "hours":[5,17], "monthlyOccurrences":[{"day":"wednesday", "occurrence":3}]}` | Run at 5:15 AM, 5:45 AM, 5:15 PM, and 5:45 PM on the third Wednesday of every month. |

## Trigger type comparison
The tumbling window trigger and the schedule trigger both operate on time heartbeats. How are they different?

The following table provides a comparison of the tumbling window trigger and schedule trigger:

|  | Tumbling window trigger | Schedule trigger |
|:--- |:--- |:--- |
| **Backfill scenarios** | Supported. Pipeline runs can be scheduled for windows in the past. | Not supported. Pipeline runs can be executed only on time periods from the current time and the future. |
| **Reliability** | 100% reliability. Pipeline runs can be scheduled for all windows from a specified start date without gaps. | Less reliable. |
| **Retry capability** | Supported. Failed pipeline runs have a default retry policy of 0, or a policy that's specified by the user in the trigger definition. Automatically retries when pipeline runs fail due to concurrency/server/throttling limits (that is, status codes 400: User Error, 429: Too many requests, and 500: Internal Server error). | Not supported. |
| **Concurrency** | Supported. Users can explicitly set concurrency limits for the trigger. Allows between 1 and 50 concurrent triggered pipeline runs. | Not supported. |
| **System variables** | Supports the use of the **WindowStart** and **WindowEnd** system variables. Users can access `triggerOutputs().windowStartTime` and `triggerOutputs().windowEndTime` as trigger system variables in the trigger definition. The values are used as the window start time and window end time, respectively. For example, for a tumbling window trigger that runs every hour, for the window 1:00 AM to 2:00 AM, the definition is `triggerOutputs().WindowStartTime = 2017-09-01T01:00:00Z` and `triggerOutputs().WindowEndTime = 2017-09-01T02:00:00Z`. | Not supported. |
| **Pipeline-to-trigger relationship** | Supports a one-to-one relationship. Only one pipeline can be triggered. | Supports many-to-many relationships. Multiple triggers can kick off a single pipeline. A single trigger can kick off multiple pipelines. |

## Next steps
See the following tutorials:

- [Quickstart: Create a data factory by using the .NET SDK](quickstart-create-data-factory-dot-net.md)
- [Create a schedule trigger](how-to-create-schedule-trigger.md)
- [Create a tumbling window trigger](how-to-create-tumbling-window-trigger.md)
