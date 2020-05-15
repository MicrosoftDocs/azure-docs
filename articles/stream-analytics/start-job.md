---
title: How to start an Azure Stream Analytics job
description: This article describes how to start a Stream Analytics job from Azure portal, PowerShell, and Visual Studio.
author: mamccrea
ms.author: mamccrea
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 04/03/2019
---

# How to start an Azure Stream Analytics job

You can start your Azure Stream Analytics job using the Azure portal, Visual Studio, and PowerShell. When you start a job, you select a time for the job to start creating output. Azure portal, Visual Studio, and PowerShell each have different methods for setting the start time. Those methods are described below.

## Start options
The three following options are available to start a job. Note that all the times mentioned below are the ones specified in [TIMESTAMP BY](https://docs.microsoft.com/stream-analytics-query/timestamp-by-azure-stream-analytics). If TIMESTAMP BY is not specified, arrival time will be used.
* **Now**: Makes the starting point of the output event stream the same as when the job is started. If a temporal operator is used (e.g. time window, LAG or JOIN), Azure Stream Analytics will automatically look back at the data in the input source. For instance, if you start a job “Now” and if your query uses a 5-minutes Tumbling Window, Azure Stream Analytics will seek data from 5 minutes ago in the input.
The first possible output event would have a timestamp equal to or greater than the current time, and ASA guarantees that all input events that may logically contribute to the output has been accounted for. For example, no partial windowed aggregates are generated. It’s always the complete aggregated value.

* **Custom**: You can choose the starting point of the output. Similarly to the **Now** option, Azure Stream Analytics will automatically read the data prior to this time if a temporal operator is used 

* **When last stopped**. This option is available when the job was previously started, but was stopped manually or failed. When choosing this option Azure Stream Analytics will use the last output time to restart the job so no data is lost. Similarly to previous options, Azure Stream Analytics will automatically read the data prior to this time if a temporal operator is used. Since several input partitions may have different time, the earliest stop time of all partitions is used, as a result some duplicates may be seen in the output. More information about exactly-once processing are available on the page [Event Delivery Guarantees](https://docs.microsoft.com/stream-analytics-query/event-delivery-guarantees-azure-stream-analytics).


## Azure portal

Navigate to your job in the Azure portal and select **Start** on the overview page. Select a **Job output start time** and then select **Start**.

Choose one of the options for **Job output start time**. The options are *Now*, *Custom*, and, if the job was previously run,  *When last stopped*. See above for more information about these options.

## Visual Studio

In the job view, select the green arrow button to start the job. Set the **Job Output Start Mode** and select **Start**. The job status will change to **Running**.

There are three options for **Job Output Start Mode**: *JobStartTime*, *CustomTime*, and *LastOutputEventTime*. If this property is absent, the default is *JobStartTime*. See above for more information about these options.


## PowerShell

Use the following cmdlet to start your job using PowerShell:

```powershell
Start-AzStreamAnalyticsJob `
  -ResourceGroupName $resourceGroup `
  -Name $jobName `
  -OutputStartMode 'JobStartTime'
```

There are three options for **OutputStartMode**: *JobStartTime*, *CustomTime*, and *LastOutputEventTime*. If this property is absent, the default is *JobStartTime*. See above for more information about these options.

For more information on the `Start-AzStreamAnalyitcsJob` cmdlet, view the [Start-AzStreamAnalyticsJob reference](/powershell/module/az.streamanalytics/start-azstreamanalyticsjob).

## Next steps

* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
* [Quickstart: Create a Stream Analytics job using Azure PowerShell](stream-analytics-quick-create-powershell.md)
* [Quickstart: Create a Stream Analytics job by using the Azure Stream Analytics tools for Visual Studio](stream-analytics-quick-create-vs.md)
