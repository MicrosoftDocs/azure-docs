---
title: Programmatically monitor an Azure Data Factory 
description: Learn how to monitor a pipeline in a data factory by using different software development kits (SDKs).
ms.service: data-factory
ms.subservice: monitoring
ms.topic: conceptual
ms.date: 07/20/2023
author: nabhishek
ms.author: abnarain
ms.custom: devx-track-python, devx-track-dotnet
---
# Programmatically monitor an Azure Data Factory

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This article describes how to monitor a pipeline in a data factory by using different software development kits (SDKs). 

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Data range

Data Factory only stores pipeline run data for 45 days. When you query programmatically for data about Data Factory pipeline runs - for example, with the PowerShell command `Get-AzDataFactoryV2PipelineRun` - there are no maximum dates for the optional `LastUpdatedAfter` and `LastUpdatedBefore` parameters. But if you query for data for the past year, for example, you won't get an error but only pipeline run data from the last 45 days.

If you want to keep pipeline run data for more than 45 days, set up your own diagnostic logging with [Azure Monitor](monitor-using-azure-monitor.md).

## Pipeline run information

For pipeline run properties, refer to [PipelineRun API reference](/rest/api/datafactory/pipelineruns/get#pipelinerun). A pipeline run has different status during its lifecycle, the possible values of run status are listed below:

* Queued
* InProgress
* Succeeded
* Failed
* Canceling
* Cancelled

## .NET
For a complete walk-through of creating and monitoring a pipeline using .NET SDK, see [Create a data factory and pipeline using .NET](quickstart-create-data-factory-dot-net.md).

1. Add the following code to continuously check the status of the pipeline run until it finishes copying the data.

    ```csharp
    // Monitor the pipeline run
    Console.WriteLine("Checking pipeline run status...");
    PipelineRun pipelineRun;
    while (true)
    {
        pipelineRun = client.PipelineRuns.Get(resourceGroup, dataFactoryName, runResponse.RunId);
        Console.WriteLine("Status: " + pipelineRun.Status);
        if (pipelineRun.Status == "InProgress" || pipelineRun.Status == "Queued")
            System.Threading.Thread.Sleep(15000);
        else
            break;
    }
    ```

2. Add the following code to that retrieves copy activity run details, for example, size of the data read/written.

    ```csharp
    // Check the copy activity run details
    Console.WriteLine("Checking copy activity run details...");

    RunFilterParameters filterParams = new RunFilterParameters(
        DateTime.UtcNow.AddMinutes(-10), DateTime.UtcNow.AddMinutes(10));
    ActivityRunsQueryResponse queryResponse = client.ActivityRuns.QueryByPipelineRun(
        resourceGroup, dataFactoryName, runResponse.RunId, filterParams);
    if (pipelineRun.Status == "Succeeded")
        Console.WriteLine(queryResponse.Value.First().Output);
    else
        Console.WriteLine(queryResponse.Value.First().Error);
    Console.WriteLine("\nPress any key to exit...");
    Console.ReadKey();
    ```

For complete documentation on .NET SDK, see [Data Factory .NET SDK reference](/dotnet/api/microsoft.azure.management.datafactory).

## Python
For a complete walk-through of creating and monitoring a pipeline using Python SDK, see [Create a data factory and pipeline using Python](quickstart-create-data-factory-python.md).

To monitor the pipeline run, add the following code:

```python
# Monitor the pipeline run
time.sleep(30)
pipeline_run = adf_client.pipeline_runs.get(
    rg_name, df_name, run_response.run_id)
print("\n\tPipeline run status: {}".format(pipeline_run.status))
filter_params = RunFilterParameters(
    last_updated_after=datetime.now() - timedelta(1), last_updated_before=datetime.now() + timedelta(1))
query_response = adf_client.activity_runs.query_by_pipeline_run(
    rg_name, df_name, pipeline_run.run_id, filter_params)
print_activity_run_details(query_response.value[0])
```

For complete documentation on Python SDK, see [Data Factory Python SDK reference](/python/api/overview/azure/datafactory).

## REST API
For a complete walk-through of creating and monitoring a pipeline using REST API, see [Create a data factory and pipeline using REST API](quickstart-create-data-factory-rest-api.md).
 
1. Run the following script to continuously check the pipeline run status until it finishes copying the data.

    ```powershell
    $request = "https://management.azure.com/subscriptions/${subsId}/resourceGroups/${resourceGroup}/providers/Microsoft.DataFactory/factories/${dataFactoryName}/pipelineruns/${runId}?api-version=${apiVersion}"
    while ($True) {
        $response = Invoke-RestMethod -Method GET -Uri $request -Header $authHeader
        Write-Host  "Pipeline run status: " $response.Status -foregroundcolor "Yellow"

        if ( ($response.Status -eq "InProgress") -or ($response.Status -eq "Queued") ) {
            Start-Sleep -Seconds 15
        }
        else {
            $response | ConvertTo-Json
            break
        }
    }
    ```
2. Run the following script to retrieve copy activity run details, for example, size of the data read/written.

    ```powershell
    $request = "https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DataFactory/factories/${factoryName}/pipelineruns/${runId}/queryActivityruns?api-version=${apiVersion}&startTime="+(Get-Date).ToString('yyyy-MM-dd')+"&endTime="+(Get-Date).AddDays(1).ToString('yyyy-MM-dd')+"&pipelineName=Adfv2QuickStartPipeline"
    $response = Invoke-RestMethod -Method POST -Uri $request -Header $authHeader
    $response | ConvertTo-Json
    ```

For complete documentation on REST API, see [Data Factory REST API reference](/rest/api/datafactory/).

## PowerShell
For a complete walk-through of creating and monitoring a pipeline using PowerShell, see [Create a data factory and pipeline using PowerShell](quickstart-create-data-factory-powershell.md).

1. Run the following script to continuously check the pipeline run status until it finishes copying the data.

    ```powershell
    while ($True) {
        $run = Get-AzDataFactoryV2PipelineRun -ResourceGroupName $resourceGroupName -DataFactoryName $DataFactoryName -PipelineRunId $runId

        if ($run) {
            if ( ($run.Status -ne "InProgress") -and ($run.Status -ne "Queued") ) {
                Write-Output ("Pipeline run finished. The status is: " +  $run.Status)
                $run
                break
            }
            Write-Output ("Pipeline is running...status: " + $run.Status)
        }

        Start-Sleep -Seconds 30
    }
    ```
2. Run the following script to retrieve copy activity run details, for example, size of the data read/written.

    ```powershell
    Write-Host "Activity run details:" -foregroundcolor "Yellow"
    $result = Get-AzDataFactoryV2ActivityRun -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -PipelineRunId $runId -RunStartedAfter (Get-Date).AddMinutes(-30) -RunStartedBefore (Get-Date).AddMinutes(30)
    $result
    
    Write-Host "Activity 'Output' section:" -foregroundcolor "Yellow"
    $result.Output -join "`r`n"
    
    Write-Host "\nActivity 'Error' section:" -foregroundcolor "Yellow"
    $result.Error -join "`r`n"
    ```

For complete documentation on PowerShell cmdlets, see [Data Factory PowerShell cmdlet reference](/powershell/module/az.datafactory).

## Next steps
See [Monitor pipelines using Azure Monitor](monitor-using-azure-monitor.md) article to learn about using Azure Monitor to monitor Data Factory pipelines.
