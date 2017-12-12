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
ms.date: 12/11/2017
ms.author: shlo
---

# How to create a trigger that runs a pipeline on a schedule
This article provides steps to create, start, and monitor a trigger. For conceptual information about triggers, see [Pipeline execution and triggers](concepts-pipeline-execution-triggers.md).

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [get started with Data Factory version 1](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).


## Use Azure PowerShell
This section shows you how to use PowerShell to create, start, and monitor a trigger. You create a trigger for the pipeline from the quickstart. If you want to see this code working, first go through the [quickstart for creating a data factory using Azure PowerShell](quickstart-create-data-factory-powershell.md). 

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
    - The **frequency** is set to **Minute** and **interval** is set to **15**, so the trigger runs the pipeline every 15 minutes between the start and end times. 
    - The **endTime** is one hour after the **startTime**, so the trigger runs the pipeline 15 minutes, 30 minutes, and 45 minutes after the startTime. Do not forget to update the startTime to the current UTC time and endTime to one hour after the startTime.  
    - The trigger is associated with the **Adfv2QuickStartPipeline** pipeline. To associate multiple pipelines with a trigger, add more pipelineReference sections. 
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
6.  Get trigger runs using PowerShell by using the **Get-AzureRmDataFactoryV2TriggerRun** cmdlet. To get the information about trigger runs, run the following command periodically: Update TriggerRunStartedAfter and TriggerRunStartedBefore values to match the values in the trigger definition. 

    ```powershell
    Get-AzureRmDataFactoryV2TriggerRun -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -TriggerName "MyTrigger" -TriggerRunStartedAfter "2017-12-06" -TriggerRunStartedBefore "2017-12-09"
    ```

    To monitor trigger runs/pipeline runs in the Azure portal, see [Monitor pipeline runs](quickstart-create-data-factory-resource-manager-template.md#monitor-the-pipeline)

## Use .NET SDK
This section shows you how to use .NET SDK to create, start, and monitor a trigger. If you want to see this code working, first go through the [quickstart for creating a data factory using .NET SDK](quickstart-create-data-factory-dot-net.md). Then, add the following code to the main method, which creates and starts a schedule trigger that runs every 15 minutes. 

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
    tr_properties = ScheduleTrigger(description='My schedule trigger', pipelines = pipelines_to_run, recurrence=scheduler_recurrence)    
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