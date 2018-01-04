---
title: How to create triggers in Azure Data Factory | Microsoft Docs
description: Learn how to create a trigger in Azure Data Factory that runs a pipeline on a schedule.
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: jhubbard
editor:

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/03/2018
ms.author: shlo
---

# How to create a trigger that runs a pipeline on a tumbling window
This article provides steps to create, start, and monitor a trigger. For conceptual information about triggers, see [Pipeline execution and triggers](concepts-pipeline-execution-triggers.md).

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [get started with Data Factory version 1](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).

Tumbling window triggers are a type of trigger that fires at a periodic time interval from a specified start time, while retaining state. Tumbling windows are a series of fixed-sized, non-overlapping and contiguous time intervals. A tumbling window trigger is a 1:1 relationship with a pipeline and can only reference a singular pipeline.

## Tumbling Window Trigger Type Properties
```  
{
    "name": "MyTriggerName",
    "properties": {
        "type": "TumblingWindowTrigger",
        "runtimeState": "<<Started/Stopped/Disabled - readonly>>",
        "typeProperties": {
            "frequency": "<<Minute/Hour>>",
            "interval": <<int>>,
            "startTime": "<<datetime>>",
            "endTime: "<<datetime – optional>>"",
            "delay": "<<timespan – optional>>",
            “maxConcurrency”: <<int>> (required, max allowed: 50),
            "retryPolicy": {
                "count":  <<int - optional, default: 0>>,
                “intervalInSeconds”: <<int>>,
            }
        },
        "pipeline":
            {
                "pipelineReference": {
                    "type": "PipelineReference",
                    "referenceName": "MyPipelineName"
                },
                "parameters": {
                    "parameter1": {
                        "type": "Expression",
                        "value": "@{concat('output',formatDateTime(trigger().outputs.windowStartTime,'-dd-MM-yyyy-HH-mm-ss-ffff'))}"
                    },
                    "parameter2": {
                        "type": "Expression",
                        "value": "@{concat('output',formatDateTime(trigger().outputs.windowEndTime,'-dd-MM-yyyy-HH-mm-ss-ffff'))}"
                    },
                    "parameter3": "https://mydemo.azurewebsites.net/api/demoapi"
                }
            }
      }    
}
```  

The following table provides a high-level overview of the major elements related to recurrence and scheduling in a tumbling window trigger.

| **JSON name** | **Description** | **Allowed Values** | **Required** |
|:--- |:--- |:--- |:--- |
| **type** | Type of the trigger. This is fixed as "TumblingWindowTrigger." | String | Yes |
| **runtimeState** | <readOnly> Possible Values: Started, Stopped, Disabled | String | Yes, readOnly |
| **frequency** |The *frequency* string representing the frequency unit at which the trigger recurs. Supported values are "minute" and "hour." If the start time has date parts that are more granular than the frequency, they will be taken into consideration to compute the window boundaries. For ex: if the frequency is hourly and the start time is 2016-04-01T10:10:10Z, the first window is (2017-09-01T10:10:10Z, 2017-09-01T11:10:10Z.)  | String. Supported types "minute," "hour" | Yes |
| **interval** |The *interval* is a positive integer and denotes the interval for the *frequency* that determines how often the trigger will run. For example, if *interval* is 3 and *frequency* is "hour", the trigger recurs every 3 hours. | Integer | Yes |
| **startTime**|*startTime* is a Date-Time. *startTime* is the first occurrence and can be in the past. The first trigger interval will be (startTime, startTime + interval). | DateTime | Yes |
| **endTime**|*endTime* is a Date-Time. *endTime* is the last occurrence and can be in the past. | DateTime | Yes |
| **delay** | Specify the delay before data processing of the window starts. The pipeline run is started after the expected execution time + delay. Delay defines the how long the trigger waits past due time before triggering new run. It doesn’t alter window start time. | Timespan (Example: 00:10:00, implies delay of 10 mins) |  No. Default is "00:00:00" |
| **max concurrency** | Number of simultaneous trigger runs that are fired for windows that are ready. Example: if we are trying to backfill hourly for yesterday, that would be 24 windows. If concurrency = 10, trigger events are fired only for the first 10 windows (00:00-01:00 - 09:00-10:00). After the first 10 triggered pipeline runs are complete, trigger runs are fired for the next 10 (10:00-11:00 - 19:00-20:00). Continuing with example of concurrency = 10, if there are 10 windows ready, there will be 10 pipeline runs. If there is only 1 window ready, there will only be 1 pipeline run. | Integer | Yes. Possible values 1-50 |
| **retryPolicy: Count** | The number of retries before the pipeline run is marked as "Failed"  | Integer |  No. Default is 0 retries |
| **retryPolicy: intervalInSeconds** | The delay between retry attempts in seconds | Integer |  No. Default is 30 seconds |

### Using System Variables: WindowStart and WindowEnd

If you wish to use WindowStart and WindowEnd of the tumbling window trigger in your **pipeline** definition (i.e. for part of a query), you must pass the variables as parameters to your pipeline in the **trigger** definition, like so:
```  
{
    "name": "MyTriggerName",
    "properties": {
        "type": "TumblingWindowTrigger",
            ...
        "pipeline":
            {
                "pipelineReference": {
                    "type": "PipelineReference",
                    "referenceName": "MyPipelineName"
                },
                "parameters": {
                    "MyWindowStart": {
                        "type": "Expression",
                        "value": "@{concat('output',formatDateTime(trigger().outputs.windowStartTime,'-dd-MM-yyyy-HH-mm-ss-ffff'))}"
                    },
                    "MyWindowEnd": {
                        "type": "Expression",
                        "value": "@{concat('output',formatDateTime(trigger().outputs.windowEndTime,'-dd-MM-yyyy-HH-mm-ss-ffff'))}"
                    }
                }
            }
      }    
}
```  

Then, in the pipeline definition, to use the WindowStart and WindowEnd values, use your parameters accordingly of "MyWindowStart" and "MyWindowEnd"

### Notes on Backfill
When there are multiple windows up for execution (esp. in backfill scenario), the order of execution of windows is deterministic and will be from oldest to newest intervals. There is no way to control this behavior.

### Updating an Existing TriggerResource
* If frequency (or window size) of the trigger is changed, the state of windows already processed will *not* be reset. The trigger will continue firing for the windows from the last one it executed using the new window size.
* If end time of the trigger changes (added or updated), the state of windows already processed will *not* be reset. The trigger will simply honor the new end time. If the end time is before the windows already executed, the trigger will stop. Otherwise, it will stop when the new end time is encountered.

# Sample using Azure PowerShell
This section shows you how to use Azure PowerShell to create, start, and monitor a trigger. If you want to see this sample working, first go through the [quickstart: create a data factory using Azure PowerShell](quickstart-create-data-factory-powershell.md). Then, add the following code to the main method, which creates and starts a schedule trigger that runs every 15 minutes. The trigger is associated with a pipeline (**Adfv2QuickStartPipeline**) that you create as part of the quickstart.

1. Create a JSON file named MyTrigger.json in the C:\ADFv2QuickStartPSH\ folder with the following content:

    > [!IMPORTANT]
    > Set **startTime** to the current UTC time and **endTime** to one hour past the current UTC time before saving the JSON file.

    ```json   
{
  "name": "PerfTWTrigger",
  "properties": {
    "type": "TumblingWindowTrigger",
    "typeProperties": {
      "frequency": "Minute",
      "interval": "15",
      "startTime": "2017-09-08T05:30:00Z",
      "delay": "00:00:01",
      "retryPolicy": {
        "count": 2,
        "intervalInSeconds": 30
      },
      "maxConcurrency": 50
    },
    "pipeline": {
      "pipelineReference": {
        "type": "PipelineReference",
        "referenceName": "DynamicsToBlobPerfPipeline"
      },
      "parameters": {
        "windowStart": "@trigger().outputs.windowStartTime",
        "windowEnd": "@trigger().outputs.windowEndTime"
      }
    },
    "runtimeState": "Started"
  }
}
```  

3. Confirm that the status of the trigger is **Stopped** by using the **Get-AzureRmDataFactoryV2Trigger** cmdlet.

```powershell
Get-AzureRmDataFactoryV2Trigger -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -Name "MyTrigger"
```
4. Start the trigger by using the **Start-AzureRmDataFactoryV2Trigger** cmdlet:

```powershell
Start-AzureRmDataFactoryV2Trigger -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -Name "MyTrigger"
```
5. Confirm that the status of the trigger is **Started** by using the **Get-AzureRmDataFactoryV2Trigger** cmdlet.

```powershell
Get-AzureRmDataFactoryV2Trigger -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -Name "MyTrigger"
```
6.  Get trigger runs using PowerShell by using the **Get-AzureRmDataFactoryV2TriggerRun** cmdlet. To get the information about trigger runs, run the following command periodically: Update **TriggerRunStartedAfter** and **TriggerRunStartedBefore** values to match the values in the trigger definition.

```powershell
Get-AzureRmDataFactoryV2TriggerRun -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -TriggerName "MyTrigger" -TriggerRunStartedAfter "2017-12-08T00:00:00" -TriggerRunStartedBefore "2017-12-08T01:00:00"
```

To monitor trigger runs/pipeline runs in the Azure portal, see [Monitor pipeline runs](quickstart-create-data-factory-resource-manager-template.md#monitor-the-pipeline)

## Next steps
For detailed information about triggers, see [Pipeline execution and triggers](concepts-pipeline-execution-triggers.md#triggers).
