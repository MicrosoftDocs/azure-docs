---
title: Pipeline execution and triggers in Azure Data Factory | Microsoft Docs
description: This article provides information about how to execute a pipeline in Azure Data Factory either on-demand or by creating a trigger. 
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 08/10/2017
ms.author: shlo

---

# Pipeline execution and triggers in Azure Data Factory 
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1 - GA](v1/data-factory-scheduling-and-execution.md)
> * [Version 2 - Preview](concepts-pipeline-execution-triggers.md)

A **pipeline run** is a term in Azure Data Factory Version 2 that defines an instance of a pipeline execution. For example, say you have a pipeline that executes at 8am, 9am, and 10am. There would be three separate runs of pipeline (pipeline runs) in this case. Each pipeline run has a unique pipeline run ID, which is a GUID that uniquely defines that particular pipeline run. Pipeline runs are typically instantiated by passing arguments to parameters defined in the pipelines. There are two ways to execute a pipeline: **manually** or via a **trigger**. This article provides details about both the ways of executing a pipeline. 

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [scheduling and execution in Data Factory V1](v1/data-factory-scheduling-and-execution.md).

## Run pipeline on-demand
In this method, you manually run your pipeline. It's also considered as an on-demand execution of a pipeline. 

For example, say you have a pipeline named **copyPipeline** that you want to execute. The pipeline is a simple pipeline with a single activity that copies from a source folder in Azure Blob Storage to a destination folder in the same storage. Here is the sample pipeline definition: 

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
The pipeline takes two parameters:  sourceBlobContainer and sinkBlobContainer as shown in the JSON definition. You pass values to these parameters at runtime. 

To run the pipeline manually, you can use one of the following ways: .NET, PowerShell, REST, and Python. 

### REST API
Here is a sample REST command:  

```
POST
https://management.azure.com/subscriptions/mySubId/resourceGroups/myResourceGroup/providers/Microsoft.DataFactory/factories/myDataFactory/pipelines/copyPipeline/createRun?api-version=2017-03-01-preview
```
See [Quickstart: create a data factory using REST API](quickstart-create-data-factory-rest-api.md) for a complete sample.

### PowerShell
Here is a sample PowerShell command: 

```powershell
Invoke-AzureRmDataFactoryV2PipelineRun -DataFactory $df -PipelineName "Adfv2QuickStartPipeline" -ParameterFile .\PipelineParameters.json
```

You pass parameters in the body in the request payload. In .NET, Powershell, and Python, you pass values in a dictionary passed as an argument to the call.

```json
{
  “sourceBlobContainer”: “MySourceFolder”,
  “sinkBlobCountainer”: “MySinkFolder”
}
```

The response payload is a unique ID of the pipeline run:

```json
{
  "runId": "0448d45a-a0bd-23f3-90a5-bfeea9264aed"
}
```


See [Quickstart: create a data factory using PowerShell](quickstart-create-data-factory-powershell.md) for a complete sample.

### .NET 
Here is a sample .NET call: 

```csharp
client.Pipelines.CreateRunWithHttpMessagesAsync(resourceGroup, dataFactoryName, pipelineName, parameters)
```

See [Quickstart: create a data factory using .NET](quickstart-create-data-factory-dot-net.md) for a complete sample.

> [!NOTE]
> You can use the .NET API to invoke Data Factory pipelines from Azure Functions, your own web services, etc.

## Triggers
Triggers provide the second way of executing a pipeline run. Triggers represent a unit of processing that determines when a pipeline execution needs to be kicked off. Currently, Data Factory supports a trigger that invokes a pipeline on a wall-clock schedule. It's called **Scheduler Trigger**. Currently, Data Factory does not support event-based triggers such as a trigger of a pipeline run on the event of a file-arrival.

Pipelines and triggers have an "n-m" relationship. Multiple triggers can kick off a single pipeline and the same trigger can kick off multiple pipelines. In the following JSON definition of a trigger, the **pipelines** property refers to a list of the pipelines that are triggered by the particular trigger, and values for pipeline parameters.

### Basic trigger definition: 
```json
    "properties": {
        "name": "MyTrigger",
        "type": "<type of trigger>",
        "typeProperties": {
            …
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
                    "<parameter 2 Name>" : "<parameter 2 Value>"
                }
            }
        ]
    }
```

## Scheduler trigger
Scheduler trigger runs pipelines on a wall-clock schedule. This trigger supports periodic and advanced calendar options (weekly, Monday at 5PM, and Thursday at 9PM). It is flexible by being dataset-pattern agnostic with no discern between time-series and non time-series data.

### Scheduler trigger JSON definition
When you create a scheduler trigger, you can specify scheduling and recurrence using JSON as shown in the example in this section. 

To have your scheduler trigger kick off a pipeline run, include a pipeline reference of the particular pipeline in the trigger definition. Pipelines and triggers have a "n-m" relationship. Multiple triggers can kick off a single pipeline. The same trigger can kick off multiple pipelines.

```json
{
  "properties": {
    "type": "ScheduleTrigger",
    "typeProperties": {
      "recurrence": {
        "frequency": <<Minute, Hour, Day, Week, Year>>,
        "interval": <<int>>,             // optional, how often to fire (default to 1)
        "startTime": <<datetime>>,
        "endTime": <<datetime>>,
        "timeZone": <<default UTC>>
        "schedule": {                    // optional (advanced scheduling specifics)
          "hours": [<<0-24>>],
          "weekDays": ": [<<Monday-Sunday>>],
          "minutes": [<<0-60>>],
          "monthDays": [<<1-31>>],
          "monthlyOccurences": [
               {
                    "day": <<Monday-Sunday>>,
                    "occurrence": <<1-5>>
               }
           ] 
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
                    "<parameter 2 Name> : "<parameter 2 Value>"
                }
           }
      ]
  }
}
```

### Overview: scheduler trigger schema
The following table provides a high-level overview of the major elements related to recurrence and scheduling in a trigger:

JSON property | 	Description
------------- | -------------
startTime | startTime is a Date-Time. For simple schedules, startTime is the first occurrence. For complex schedules, the trigger starts no sooner than startTime.
recurrence | The recurrence object specifies recurrence rules for the trigger. The recurrence object supports the elements: frequency, interval, endTime, count, and schedule. If recurrence is defined, frequency is required; the other elements of recurrence are optional.
frequency | Represents the unit of frequency at which the trigger recurs. Supported values are: `minute`, `hour`, `day`, `week`, or `month`.
interval | The interval is a positive integer. It denotes the interval for the frequency that determines how often the trigger runs. For example, if interval is 3 and frequency is "week", the trigger recurs every 3 weeks.
endTime | Specifies the end date-time for the trigger. The trigger does not execute after this time. It is not valid to have an endTime in the past.
schedule | A trigger with a specified frequency alters its recurrence based on a recurrence schedule. A schedule contains modifications based on minutes, hours, weekdays, month days, and week number.

### Overview: scheduler trigger schema defaults, limits, and examples

JSON name | Value type | Required? | Default value | Valid values | Example
--------- | ---------- | --------- | ------------- | ------------ | -------
startTime | String | Yes | None | ISO-8601 Date-Times | ```"startTime" : "2013-01-09T09:30:00-08:00"```
recurrence | Object | Yes | None | Recurrence object | ```"recurrence" : { "frequency" : "monthly", "interval" : 1 }```
interval | Number | No | 1 | 1 to 1000. | ```"interval":10```
endTime | String | Yes | None | Date-Time value representing a time in the future | `"endTime" : "2013-02-09T09:30:00-08:00"`
schedule | Object | No | None | Schedule object | `"schedule" : { "minute" : [30], "hour" : [8,17] }`

### Deep dive: startTime
The following table captures how startTime controls how a trigger is run:

startTime value | Recurrence without schedule | Recurrence with schedule
--------------- | --------------------------- | ------------------------
Start time in past | Calculates first future execution time after start time, and runs at that time.<p>Runs subsequent executions based on calculating from last execution time.</p><p>See the example that follows this table.</p> | Trigger starts _no sooner than_ the specified start time. The first occurrence is based on the schedule calculated from the start time. <p>Run subsequent executions based on recurrence schedule</p>
Start time in future or at present | Runs once at specified start time. <p>Run subsequent executions based on calculating from last execution time.</p> | Trigger starts _no sooner_ than the specified start time. The first occurrence is based on the schedule calculated from the start time.<p>Run subsequent executions based on recurrence schedule.</p>

Let's see an example of what happens where startTime is in the past, with recurrence but no schedule. Assume that the current time is `2017-04-08 13:00`, startTime is `2017-04-07 14:00`, and recurrence is every two days (defined with frequency: day and interval: 2.) Notice that the startTime is in the past, and occurs before the current time.

Under these conditions, the first execution is at `2017-04-09 at 14:00`. The Scheduler engine calculates execution occurrences from the start time. Any instances in the past are discarded. The engine uses the next instance that occurs in the future. So in this case, startTime is `2017-04-07 at 2:00pm`, so the next instance is two days from that time, which is `2017-04-09 at 2:00pm`.

The first execution time is the same even if the startTime `2017-04-05 14:00` or `2017-04-01 14:00`. After the first execution, subsequent executions are calculated using the schedule. Therefore, they are at `2017-04-11 at 2:00pm`, then `2017-04-13 at 2:00pm`, then `2017-04-15 at 2:00pm`, etc.

Finally, when a trigger has a schedule, if hours and/or minutes aren’t set in the schedule, they default to the hours and/or minutes of the first execution, respectively.

### Deep Dive: schedule
On one hand, a schedule can limit the number of trigger executions. For example, if a trigger with a "month" frequency has a schedule that runs on only on day 31, the trigger runs in only those months that have a 31st day.

On the other hand, a schedule can also expand the number of trigger executions. For example, if a trigger with a "month" frequency has a schedule that runs on month days 1 and 2, the trigger runs on the 1st and 2nd days of the month instead of once a month.

If multiple schedule elements are specified, the order of evaluation is from the largest to smallest – week number, month day, weekday, hour, and minute.

The following table describes schedule elements in detail:


JSON name | Description | Valid Values
--------- | ----------- | ------------
minutes | Minutes of the hour at which the trigger runs. | <ul><li>Integer</li><li>Array of integers</li></ul>
hours | Hours of the day at which the trigger runs. | <ul><li>Integer</li><li>Array of integers</li></ul>
weekDays | Days of the week the trigger runs. Can only be specified with a weekly frequency. | <ul><li>Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, or Sunday</li><li>Array of any of the above values (max array size 7)</li></p>Not case-sensitive</p>
monthlyOccurrences | Determines which days of the month the trigger runs. Can only be specified with a monthly frequency. | Array of monthlyOccurence objects: `{ "day": day,  "occurrence": occurence }`. <p> The day is the day of the week the trigger runs, for example, `{Sunday}` is every Sunday of the month. Required.<p>Occurrence is occurrence of the day during the month, for example, `{Sunday, -1}` is the last Sunday of the month. Optional.
monthDays | Day of the month the trigger runs. Can only be specified with a monthly frequency. | <ul><li>Any value <= -1 and >= -31</li><li>Any value >= 1 and <= 31</li><li>An array of above values</li>


## Examples: recurrence schedules
This section provides examples of recurrence schedules – focusing on the schedule object and its subelements.

The example schedules assume that the interval is set to 1. Also, assume the right frequency in accordance to what is in the schedule – for example, you can't use frequency "day" and have a "monthDays" modification in the schedule. These restrictions are mentioned in the table in the previous section. 

Example | Description
------- | -----------
`{"hours":[5]}` | Runs at 5AM Every Day
`{"minutes":[15], "hours":[5]}` | Runs at 5:15AM Every Day
`{"minutes":[15], "hours":[5,17]}` | Runs at 5:15 AM and 5:15 PM Every Day
`{"minutes":[15,45], "hours":[5,17]}` | Runs at 5:15AM, 5:45AM, 5:15PM, and 5:45PM Every Day
`{"minutes":[0,15,30,45]}` | Runs Every 15 Minutes
`{hours":[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]}` | Runs Every Hour. This trigger runs every hour. The minute is controlled by the startTime, if one is specified, or if none is specified, by the creation time. For example, if the start time or creation time (whichever applies) is 12:25 PM, the trigger is run at 00:25, 01:25, 02:25, …, 23:25. The schedule is equivalent to having a trigger with frequency of "hour", an interval of 1, and no schedule. The difference is that this schedule could be used with different frequency and interval to create other triggers too. For example, if the frequency were "month", the schedule would run only once a month instead of every day if frequency were "day."
`{"minutes":[0]}` | Runs every hour on the hour. This trigger also runs every hour, but on the hour (for example, 12AM, 1AM, 2AM, etc.). This setting is equivalent to a trigger with frequency of "hour", a startTime with zero minutes, and no schedule if the frequency were "day", but if the frequency were "week" or "month," the schedule would execute only one day a week or one day a month, respectively.
`{"minutes":[15]}` | Runs at 15 minutes past every hour. Runs every hour, starting at 00:15AM, 1:15AM, 2:15AM, etc. and ending at 10:15PM and 11:15PM.
`{"hours":[17], "weekDays":["saturday"]}` | Runs at 5PM on Saturdays every week
`{"hours":[17], "weekDays":["monday", "wednesday", "friday"]}` | Runs at 5PM on Monday, Wednesday, and Friday Every Week
`{"minutes":[15,45], "hours":[17], "weekDays":["monday", "wednesday", "friday"]}` | Runs at 5:15PM and 5:45PM on Monday, Wednesday, and Friday Every Week
`{"minutes":[0,15,30,45], "weekDays":["monday", "tuesday", "wednesday", "thursday", "friday"]}` | Run Every 15 Minutes on Weekdays
`{"minutes":[0,15,30,45], "hours": [9, 10, 11, 12, 13, 14, 15, 16] "weekDays":["monday", "tuesday", "wednesday", "thursday", "friday"]}` | Runs every 15 Minutes on Weekdays between 9AM and 4:45PM
`{"weekDays":["tuesday", "thursday"]}` | Runs on Tuesdays and Thursdays at the specified start time.
`{"minutes":[0], "hours":[6], "monthDays":[28]}` | Runs at 6AM on the 28th Day of Every Month (assuming frequency of month)
`{"minutes":[0], "hours":[6], "monthDays":[-1]}` | Runs at 6AM on the last day of the month. If you'd like to run a trigger on the last day of a month, use -1 instead of day 28, 29, 30, or 31.
`{"minutes":[0], "hours":[6], "monthDays":[1,-1]}` | Runs at 6AM on the First and Last Day of Every Month
`{monthDays":[1,14]}` | Runs on the first and fourteenth Day of every month at the specified start time.
`{"minutes":[0], "hours":[5], "monthlyOccurrences":[{"day":"friday", "occurrence":1}]}` | Runs on first Friday of every Month at 5AM
`{"monthlyOccurrences":[{"day":"friday", "occurrence":1}]}`	| Runs on first Friday of every month at the specified start time.
`{"monthlyOccurrences":[{"day":"friday", "occurrence":-3}]}` | Runs on Third Friday from End of Month, Every Month, at Start Time
`{"minutes":[15], "hours":[5], "monthlyOccurrences":[{"day":"friday", "occurrence":1},{"day":"friday", "occurrence":-1}]}` | Runs on First and Last Friday of Every Month at 5:15AM
`{"monthlyOccurrences":[{"day":"friday", "occurrence":1},{"day":"friday", "occurrence":-1}]}` | Runs on first and last Friday of every month at the specified start time
`{"monthlyOccurrences":[{"day":"friday", "occurrence":5}]}` | Runs on Fifth Friday of Every Month at Start Time. If there is no fifth Friday in a month, the pipeline does not run, since it's scheduled to run on only fifth Fridays.  If you want to run the trigger on the last occurring Friday of the month, consider using -1 instead of 5 for the occurrence.
`{"minutes":[0,15,30,45], "monthlyOccurrences":[{"day":"friday", "occurrence":-1}]}` | Runs every 15 minutes on last Friday of the month.
`{"minutes":[15,45], "hours":[5,17], "monthlyOccurrences":[{"day":"wednesday", "occurrence":3}]}` | Runs at 5:15AM, 5:45AM, 5:15PM, and 5:45PM on the third Wednesday of every month.




## Next steps
See the following tutorials: 

- [Quickstart: create a data factory using .NET](quickstart-create-data-factory-dot-net.md)
