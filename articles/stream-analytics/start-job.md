---
title: How to start an Azure Stream Analytics job
description: This article describes how to start a Stream Analytics job.
services: stream-analytics
author: mamccrea
ms.author: mamccrea
ms.reviewer: jasonh
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 03/12/2019
---

# How to start an Azure Stream Analytics job

You can start your Azure Stream Analytics job using the Azure portal, Visual Studio, and PowerShell. When you start a job, you select a time for the job to start creating output. Azure portal, Visual Studio, and PowerShell each have different methods for setting the start time. Those methods are described below.

## Azure portal

Navigate to your job in the Azure portal and select **Start** on the overview page. Select a **Job output start time** and then select **Start**.

There are three options for **Job output start time**: *Now*, *Custom*, and *When last stopped*. Selecting *Now* starts the job at the current time. Selecting *Custom* allows you to set a custom time in the past or the future for the job to begin. To resume a stopped job without losing data, choose *When last stopped*.

## Visual Studio

In the job view, select the green arrow button to start the job. Set the **Job Output Start Mode** and select **Start**. The job status will change to **Running**.

There are three options for **Job Output Start Mode**: *JobStartTime*, *CustomTime*, and *LastOutputEventTime*. If this property is absent, the default is *JobStartTime*.

*JobStartTime* makes the starting point of the output event stream the same as when the job is started.

*CustomTime* starts the output at a custom time that is specified in the *OutputStartTime* parameter.

*LastOutputEventTime* makes the starting point of the output event stream the same as the last event output time.

## PowerShell

Use the following cmdlet to start your job using PowerShell:

```powershell
Start-AzStreamAnalyticsJob `
  -ResourceGroupName $resourceGroup `
  -Name $jobName `
  -OutputStartMode 'JobStartTime'
```

There are three options for **OutputStartMode**: *JobStartTime*, *CustomTime*, and *LastOutputEventTime*. If this property is absent, the default is *JobStartTime*.

*JobStartTime* makes the starting point of the output event stream the same as when the job is started.

*CustomTime* starts the output at a custom time that is specified in the *OutputStartTime* parameter.

*LastOutputEventTime* makes the starting point of the output event stream the same as the last event output time.

For more information on the `Start-AzStreamAnalyitcsJob` cmdlet, view the [Start-AzStreamAnalyticsJob reference](/powershell/module/az.streamanalytics/start-azstreamanalyticsjob).

## Next steps

* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
* [Quickstart: Create a Stream Analytics job using Azure PowerShell](stream-analytics-quick-create-powershell.md)
* [Quickstart: Create a Stream Analytics job by using the Azure Stream Analytics tools for Visual Studio](stream-analytics-quick-create-vs.md)
