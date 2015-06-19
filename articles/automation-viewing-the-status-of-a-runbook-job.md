<properties 
   pageTitle="Viewing the status of a runbook job in Azure Automation"
   description="When you start a runbook in Azure Automation, a job is created. This article provides information on how to track each job and view its current status."
   services="automation"
   documentationCenter=""
   authors="bwren"
   manager="stevenka"
   editor="tysonn" />
<tags 
   ms.service="automation"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="03/30/2015"
   ms.author="bwren" />

# Viewing the status of a runbook job in Azure Automation


When you start a runbook in Azure Automation, a job is created. A job is a single execution instance of a runbook. A single runbook may have multiple jobs, each with their own set of values for the runbook’s parameters. There are multiple ways to check the status of a particular job and all of the jobs for one or more runbooks.

## Job statuses

The following table describes the different statuses that are possible for a job.

| Status| Description|
|:---|:---|
|Completed|The job completed successfully.|
|Failed|The job ended with an error.|
|Failed, waiting for resources|The job failed because it reached the [fair share](http://msdn.microsoft.com/library/azure/3179b655-ab39-407a-9169-33571f958325#fairshare) limit three times and started from the same checkpoint or from the start of the runbook each time.|
|Queued|The job is waiting for resources on an Automation worker to come available so that it can be started.|
|Starting|The job has been assigned to a worker, and the system is in the process of starting it.|
|Resuming|The system is in the process of resuming the job after it was suspended.|
|Running|The job is running.|
|Running, waiting for resources|The job has been unloaded because it reached the [fair share](http://msdn.microsoft.com/library/azure/3179b655-ab39-407a-9169-33571f958325#fairshare) limit. It will resume shortly from its last checkpoint.|
|Stopped|The job was stopped by the user before it was completed.|
|Stopping|The system is in the process of stopping the job.|
|Suspended|The job was suspended by the user, by the system, or by a command in the runbook. A job that is suspended can be started again and will resume from its last checkpoint or from the beginning of the runbook if it has no checkpoints. The runbook will only be suspended by the system in the case of an exception. By default, ErrorActionPreference is set to **Continue** meaning that the job will keep running on an error. If this preference variable is set to **Stop** then the job will suspend on an error.|
|Suspending|The system is attempting to suspend the job at the request of the user. The runbook must reach its next checkpoint before it can be suspended. If it has already passed its last checkpoint, then it will complete before it can be suspended.|

## Viewing job status using the Azure Management Portal

### Automation Dashboard

The Automation Dashboard shows a summary of all of the runbooks for a particular automation account. It also includes a Usage Overview for the account. The summary graph shows the number of total jobs for all runbooks that entered each status over a given number of days or hours. You can select the time range on the top right corner of the graph. The time axis of the chart will change according to the type of time range that you select. You can choose whether to display the line for a particular status by clicking on it at the top of screen.

You can use the following steps to display the Automation Dashboard.

1. In the Azure Management Portal, select **Automation** and then then click the name of an automation account.
1. Select the **Dashboard** tab.

### Runbook Dashboard

The Runbook Dashboard shows a summary for a single runbook. The summary graph shows the number of total jobs for the runbook that entered each status over a given number of days or hours. You can select the time range on the top right corner of the graph. The time axis of the chart will change according to the type of time range that you select. You can choose whether to display the line for a particular status by clicking on it at the top of screen.

You can use the following steps to display the Runbook Dashboard.

1. In the Azure Management Portal, select **Automation** and then then click the name of an automation account.
1. Click the name of a runbook.
1. Select the **Dashboard** tab.

### Job Summary

You can view a list of all of the jobs that have been created for a particular runbook and their most recent status. You can filter this list by job status and the range of dates for the last change to the job. Click on the name of a job to view its detailed information and its output. The detailed view of the job includes the values for the runbook parameters that were provided to that job.

You can use the following steps to view the jobs for a runbook.

1. In the Azure Management Portal, select **Automation** and then then click the name of an automation account.
1. Click the name of a runbook.
1. Select the **Jobs** tab.
1. Click on the **Job Created** column for a job to view its detail and output.

## Retrieving job status using Windows PowerShell

You can use the [Get-AzureAutomationJob](http://msdn.microsoft.com/library/azure/dn690263.aspx) to retrieve the jobs created for a runbook and the details of a particular job. If you start a runbook with Windows PowerShell using [Start-AzureAutomationRunbook](http://msdn.microsoft.com/library/azure/dn690259.aspx), then it will return the resulting job. Use [Get-AzureAutomationJob](http://msdn.microsoft.com/library/azure/dn690263.aspx)Output to get a job’s output.

The following sample commands retrieves the last job for a sample runbook and displays it’s status, the values provide for the runbook parameters, and the output from the job.

	$job = (Get-AzureAutomationJob –AutomationAccountName "MyAutomationAccount" –Name "Test-Runbook" | sort LastModifiedDate –desc)[0]
	$job.Status
	$job.JobParameters
	Get-AzureAutomationJobOutput –AutomationAccountName "MyAutomationAccount" -Id $job.Id –Stream Output

## Related articles

- [Starting a Runbook in Azure Automation](automation-starting-a-runbook.md)