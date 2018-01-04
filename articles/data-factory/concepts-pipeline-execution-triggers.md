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
ms.date: 01/03/2018
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
Invoke-AzureRmDataFactoryV2Pipeline -DataFactory $df -PipelineName "Adfv2QuickStartPipeline" -ParameterFile .\PipelineParameters.json
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
Triggers provide the second way of executing a pipeline run. Triggers represent a unit of processing that determines when a pipeline execution needs to be kicked off. Currently, Data Factory supports two types of triggers: 1)**Scheduler Trigger**, a trigger that invokes a pipeline on a wall-clock schedule 2)**Tumbling Window Trigger**: for triggers that operate on a periodic interval while retaining state. Currently, Data Factory does not support event-based triggers such as a trigger of a pipeline run on the event of a file-arrival.

Pipelines and triggers have a many-to-many relationship. Multiple triggers can kick off a single pipeline or a single trigger can kick off multiple pipelines. In the following JSON definition of a trigger, the **pipelines** property refers to a list of the pipelines that are triggered by the particular trigger, and values for pipeline parameters.

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

## Schedule trigger
Schedule trigger runs pipelines on a wall-clock schedule. This trigger supports periodic and advanced calendar options (weekly, Monday at 5PM, and Thursday at 9PM). It is flexible by being dataset-pattern agnostic with no discern between time-series and non time-series data.

For more specific information about Schedule Triggers and an examples, see [How to: Create a Schedule Trigger](how-to-create-schedule-trigger.md)

## Tumbling Window trigger
Tumbling window triggers are a type of trigger that fires at a periodic time interval from a specified start time, while retaining state. Tumbling windows are a series of fixed-sized, non-overlapping and contiguous time intervals.

## Tumbling Window Trigger vs. Scheduler Trigger
Given the tumbling window trigger and the schedule trigger both operate on time heartbeats, what makes them different?
For the tumbling window trigger:
* **Backfill scenarios**: will be supported, being able to schedule runs for windows in the past. More details under header *Notes on Backfill*
* **Reliability:** It will schedule pipeline runs for all windows from a start date without gaps with 100% reliability
* **Retry**: Failed pipeline runs have a default retry policy of 0 or one specified by user as part of the trigger definition. More details here with *Tumbling Window Type Properties* on how to specify custom retry policies. It will also retry automatically on instances when runs fail because of concurrency/server/throttling limits i.e. this includes status code 400 (User Error), 429 (Too many requests), 500 (Internal Server error).
* **Concurrency**: Users can explicitly set concurrency limits for the trigger (1-50 max concurrent triggered pipeline runs)
* **Window Start & Window End Variables**: Users can access triggerOutputs().windowStartTime and triggerOutputs().windowEndTime as trigger system variables in the trigger definition, that will be the window start and window end times, respectively. See *Using WindowStart and WindowEnd* for more details on using the system variables. For example, if you have a tumbling window trigger running every hour, for the window 1am-2am, the triggerOutputs().WindowStartTime = 2017-09-01T01:00:00Z and triggerOutputs().WindowEndTime = 2017-09-01T02:00:00Z.
* **Pipeline to Trigger Relationship**: Scheduler triggers have a n:m relationship with pipelines. A scheduler trigger can trigger multiple pipelines. Tumbling Window triggers have a 1:1 relationship with pipelines. A tumbling window trigger can only trigger one pipeline.

For more specific information about Tumbling Window triggers and examples, see [How to: Create a Tumbling Window Trigger](how-to-create-tumbling-window-trigger.md)

## Next steps
See the following tutorials:

- [Quickstart: create a data factory using .NET](quickstart-create-data-factory-dot-net.md)
- [How to: Create a Schedule Trigger](how-to-create-schedule-trigger.md)
- [How to: Create a Tumbling Window Trigger](how-to-create-tumbling-window-trigger.md)
