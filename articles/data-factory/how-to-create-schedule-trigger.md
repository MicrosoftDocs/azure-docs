---
title: How to create schedule triggers in Azure Data Factory | Microsoft Docs
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
ms.date: 12/11/2017
ms.author: shlo
---

# How to create a trigger that runs a pipeline on a schedule
This article provides information about the schedule trigger and steps to create, start, and monitor a trigger. For other types of triggers, see [Pipeline execution and triggers](concepts-pipeline-execution-triggers.md).

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [get started with Data Factory version 1](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).

### Schedule trigger JSON definition
When you create a schedule trigger, you can specify scheduling and recurrence using JSON as shown in the example in this section.

To have your schedule trigger kick off a pipeline run, include a pipeline reference of the particular pipeline in the trigger definition. Pipelines and triggers have a many-to-many relationship. Multiple triggers can kick off a single pipeline. A single trigger can kick off multiple pipelines.

```json
{
  "properties": {
    "type": "ScheduleTrigger",
    "typeProperties": {
      "recurrence": {
        "frequency": <<Minute, Hour, Day, Week, Month>>,
        "interval": <<int>>,             // optional, how often to fire (default to 1)
        "startTime": <<datetime>>,
        "endTime": <<datetime - optional>>,
        "timeZone": "UTC"
        "schedule": {                    // optional (advanced scheduling specifics)
          "hours": [<<0-23>>],
          "weekDays": : [<<Monday-Sunday>>],
          "minutes": [<<0-59>>],
          "monthDays": [<<1-31>>],
          "monthlyOccurences": [
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
                    "<parameter 2 Name>" : "<parameter 2 Value>"
                }
           }
      ]
  }
}
```

> [!IMPORTANT]
>  The **parameters** property is a mandatory property inside **pipelines**. Even if your pipeline does not take any parameters, include an empty json for parameters, as the property must exist.


### Overview: Schedule trigger schema
The following table provides a high-level overview of the major elements related to recurrence and scheduling in a trigger:

JSON property | 	Description
------------- | -------------
startTime | startTime is a Date-Time. For simple schedules, startTime is the first occurrence. For complex schedules, the trigger starts no sooner than startTime.
endTime | Specifies the end date-time for the trigger. The trigger does not execute after this time. It is not valid to have an endTime in the past. This is an optional property.
timeZone | Currently, only UTC is supported.
recurrence | The recurrence object specifies recurrence rules for the trigger. The recurrence object supports the elements: frequency, interval, endTime, count, and schedule. If recurrence is defined, frequency is required; the other elements of recurrence are optional.
frequency | Represents the unit of frequency at which the trigger recurs. Supported values are: `minute`, `hour`, `day`, `week`, or `month`.
interval | The interval is a positive integer. It denotes the interval for the frequency that determines how often the trigger runs. For example, if interval is 3 and frequency is "week", the trigger recurs every 3 weeks.
schedule | A trigger with a specified frequency alters its recurrence based on a recurrence schedule. A schedule contains modifications based on minutes, hours, weekdays, month days, and week number.


### Overview: Schedule trigger schema defaults, limits, and examples

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

Whereas, a schedule can also expand the number of trigger executions. For example, if a trigger with a "month" frequency has a schedule that runs on month days 1 and 2, the trigger runs on the 1st and 2nd days of the month instead of once a month.

If multiple schedule elements are specified, the order of evaluation is from the largest to smallest – week number, month day, weekday, hour, and minute.

The following table describes schedule elements in detail:


JSON name | Description | Valid Values
--------- | ----------- | ------------
minutes | Minutes of the hour at which the trigger runs. | <ul><li>Integer</li><li>Array of integers</li></ul>
hours | Hours of the day at which the trigger runs. | <ul><li>Integer</li><li>Array of integers</li></ul>
weekDays | Days of the week the trigger runs. Can only be specified with a weekly frequency. | <ul><li>Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, or Sunday</li><li>Array of any of the values (max array size 7)</li></p>Not case-sensitive</p>
monthlyOccurrences | Determines which days of the month the trigger runs. Can only be specified with a monthly frequency. | Array of monthlyOccurence objects: `{ "day": day,  "occurrence": occurence }`. <p> The day is the day of the week the trigger runs, for example, `{Sunday}` is every Sunday of the month. Required.<p>Occurrence is occurrence of the day during the month, for example, `{Sunday, -1}` is the last Sunday of the month. Optional.
monthDays | Day of the month the trigger runs. Can only be specified with a monthly frequency. | <ul><li>Any value <= -1 and >= -31</li><li>Any value >= 1 and <= 31</li><li>An array of values</li>


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


## Use Azure PowerShell
This section shows you how to use Azure PowerShell to create, start, and monitor a scheduler trigger. If you want to see this sample working, first go through the [quickstart: create a data factory using Azure PowerShell](quickstart-create-data-factory-powershell.md). Then, add the following code to the main method, which creates and starts a schedule trigger that runs every 15 minutes. The trigger is associated with a pipeline (**Adfv2QuickStartPipeline**) that you create as part of the quickstart.

1. Create a JSON file named MyTrigger.json in the C:\ADFv2QuickStartPSH\ folder with the following content:

    > [!IMPORTANT]
    > Set **startTime** to the current UTC time and **endTime** to one hour past the current UTC time before saving the JSON file.

    ```json   
    {
        "properties": {
            "name": "MyTrigger",
            "type": "ScheduleTrigger",
            "typeProperties": {
                "recurrence": {
                    "frequency": "Minute",
                    "interval": 15,
                    "startTime": "2017-12-08T00:00:00",
                    "endTime": "2017-12-08T01:00:00"
                }
            },
            "pipelines": [{
                    "pipelineReference": {
                        "type": "PipelineReference",
                        "referenceName": "Adfv2QuickStartPipeline"
                    },
                    "parameters": {
                        "inputPath": "adftutorial/input",
                        "outputPath": "adftutorial/output"
                    }
                }
            ]
        }
    }
    ```

    In the JSON snippet:
    - The **type** of the trigger is set to **ScheduleTrigger**.
    - The **frequency** is set to **Minute** and **interval** is set to **15**. Therefore, the trigger runs the pipeline every 15 minutes between the start and end times.
    - The **endTime** is one hour after the **startTime**, so the trigger runs the pipeline 15 minutes, 30 minutes, and 45 minutes after the startTime. Do not forget to update the startTime to the current UTC time and endTime to one hour past the startTime.  
    - The trigger is associated with the **Adfv2QuickStartPipeline** pipeline. To associate multiple pipelines with a trigger, add more **pipelineReference** sections.
    - The pipeline in the quickstart takes two **parameters**. Therefore, you pass values for those parameters from the trigger.
2. Create a trigger by using the **Set-AzureRmDataFactoryV2Trigger** cmdlet.

    ```powershell
    Set-AzureRmDataFactoryV2Trigger -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -Name "MyTrigger" -DefinitionFile "C:\ADFv2QuickStartPSH\MyTrigger.json"
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

## Use .NET SDK
This section shows you how to use .NET SDK to create, start, and monitor a trigger. If you want to see this code working, first go through the [quickstart for creating a data factory using .NET SDK](quickstart-create-data-factory-dot-net.md). Then, add the following code to the main method, which creates and starts a schedule trigger that runs every 15 minutes. The trigger is associated with a pipeline (**Adfv2QuickStartPipeline**) that you create as part of the quickstart.

```csharp
            //create the trigger
            Console.WriteLine("Creating the trigger");

            // set the start time to the current UTC time
            DateTime startTime = DateTime.UtcNow;

            // specify values for the inputPath and outputPath parameters
            Dictionary<string, object> pipelineParameters = new Dictionary<string, object>();
            pipelineParameters.Add("inputPath", "adftutorial/input");
            pipelineParameters.Add("outputPath", "adftutorial/output");

            // create a schedule trigger
            string triggerName = "MyTrigger";
            ScheduleTrigger myTrigger = new ScheduleTrigger()
            {
                Pipelines = new List<TriggerPipelineReference>()
                {
                    // associate the Adfv2QuickStartPipeline pipeline with the trigger
                    new TriggerPipelineReference()
                    {
                        PipelineReference = new PipelineReference(pipelineName),
                        Parameters = pipelineParameters,
                    }
                },
                Recurrence = new ScheduleTriggerRecurrence()
                {
                    // set the start time to current UTC time and the end time to be one hour after.
                    StartTime = startTime,
                    TimeZone = "UTC",
                    EndTime = startTime.AddHours(1),
                    Frequency = RecurrenceFrequency.Minute,
                    Interval = 15,
                }
            };

            // now, create the trigger by invoking CreateOrUpdate method.
            TriggerResource triggerResource = new TriggerResource()
            {
                Properties = myTrigger
            };
            client.Triggers.CreateOrUpdate(resourceGroup, dataFactoryName, triggerName, triggerResource);

            //start the trigger
            Console.WriteLine("Starting the trigger");
            client.Triggers.Start(resourceGroup, dataFactoryName, triggerName);

```

To monitor a trigger run, add the following code before the last `Console.WriteLine` statement:

```csharp
            // Check the trigger runs every 15 minutes
            Console.WriteLine("Trigger runs. You see the output every 15 minutes");

            for (int i = 0; i < 3; i++)
            {
                System.Threading.Thread.Sleep(TimeSpan.FromMinutes(15));
                List<TriggerRun> triggerRuns = client.Triggers.ListRuns(resourceGroup, dataFactoryName, triggerName, DateTime.UtcNow.AddMinutes(-15 * (i + 1)), DateTime.UtcNow.AddMinutes(2)).ToList();
                Console.WriteLine("{0} trigger runs found", triggerRuns.Count);

                foreach (TriggerRun run in triggerRuns)
                {
                    foreach (KeyValuePair<string, string> triggeredPipeline in run.TriggeredPipelines)
                    {
                        PipelineRun triggeredPipelineRun = client.PipelineRuns.Get(resourceGroup, dataFactoryName, triggeredPipeline.Value);
                        Console.WriteLine("Pipeline run ID: {0}, Status: {1}", triggeredPipelineRun.RunId, triggeredPipelineRun.Status);
                        List<ActivityRun> runs = client.ActivityRuns.ListByPipelineRun(resourceGroup, dataFactoryName, triggeredPipelineRun.RunId, run.TriggerRunTimestamp.Value, run.TriggerRunTimestamp.Value.AddMinutes(20)).ToList();
                    }
                }
            }
```

To monitor trigger runs/pipeline runs in the Azure portal, see [Monitor pipeline runs](quickstart-create-data-factory-resource-manager-template.md#monitor-the-pipeline)

## Use Python SDK
This section shows you how to use Python SDK to create, start, and monitor a trigger. If you want to see this code working, first go through the [quickstart for creating a data factory using Python SDK](quickstart-create-data-factory-python.md). Then, add the following code block after the "monitor the pipeline run" code block in the python script. This code creates a schedule trigger that runs every 15 minutes between the specified start and end times. Update the start_time to the current UTC time and the end_time to one hour past the current UTC time.

```python
    # Create a trigger
    tr_name = 'mytrigger'
    scheduler_recurrence = ScheduleTriggerRecurrence(frequency='Minute', interval='15',start_time='2017-12-12T04:00:00', end_time='2017-12-12T05:00:00', time_zone='UTC')
    pipeline_parameters = {'inputPath':'adftutorial/input', 'outputPath':'adftutorial/output'}
    pipelines_to_run = []
    pipeline_reference = PipelineReference('copyPipeline')
    pipelines_to_run.append(TriggerPipelineReference(pipeline_reference, pipeline_parameters))
    tr_properties = ScheduleTrigger(description='My scheduler trigger', pipelines = pipelines_to_run, recurrence=scheduler_recurrence)    
    adf_client.triggers.create_or_update(rg_name, df_name, tr_name, tr_properties)

    # start the trigger
    adf_client.triggers.start(rg_name, df_name, tr_name)
```
To monitor trigger runs/pipeline runs in the Azure portal, see [Monitor pipeline runs](quickstart-create-data-factory-resource-manager-template.md#monitor-the-pipeline)

## Use Resource Manager template
You can use an Azure Resource Manager template to create a trigger. For step-by-step instructions, see [Create an Azure data factory using Resource Manager template](quickstart-create-data-factory-resource-manager-template.md).  

## Pass the trigger start time to a pipeline
In version 1, Azure Data Factory supported reading or writing partitioned data by using SliceStart/SliceEnd/WindowStart/WindowEnd system variables. In version 2, you can achieve this behavior by using a pipeline parameter and trigger's start time/scheduled time as a value of the parameter. In the following example, the trigger's scheduled time is passed as a value to the pipeline parameter scheduledRunTime.

```json
"parameters": {
    "scheduledRunTime": "@trigger().scheduledTime"
}
```    
For more information, see [How to read or write partitioned data](how-to-read-write-partitioned-data.md).

## Next steps
For detailed information about triggers, see [Pipeline execution and triggers](concepts-pipeline-execution-triggers.md#triggers).
