<properties
   pageTitle="Runbook execution in Azure Automation"
   description="Describes the details of how a runbook in Azure Automation is processed."
   services="automation"
   documentationCenter=""
   authors="mgoedtel"
   manager="stevenka"
   editor="tysonn" />
<tags
   ms.service="automation"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="03/21/2016"
   ms.author="bwren" />

# Runbook execution in Azure Automation


When you start a runbook in Azure Automation, a job is created. A job is a single execution instance of a runbook. An Azure Automation worker is assigned to run each job. While workers are shared by multiple Azure accounts, jobs from different Automation accounts are isolated from one another. You do not have control over which worker will service the request for your job.  A single runbook can have multiple jobs running at one time. When you view the list of runbooks in the Azure portal, it will list the status of the last job that was started for each runbook. You can view the list of jobs for each runbook in order to track the status of each. For a description of the different job statuses, see [Job Statuses](#job-statuses).

The following diagram shows the lifecycle of a runbook job for [Graphical runbooks](automation-runbook-types.md#graphical-runbooks) and [PowerShell Workflow runbooks](automation-runbook-types.md#powershell-workflow-runbooks).

![Job Statuses - PowerShell Workflow](./media/automation-runbook-execution/job-statuses.png)

The following diagram shows the lifecycle of a runbook job for [PowerShell runbooks](automation-runbook-types.md#powershell-runbooks).

![Job Statuses - PowerShell Script](./media/automation-runbook-execution/job-statuses-script.png)


Your jobs will have access to your Azure resources by making a connection to your Azure subscription. They will only have access to resources in your data center if those resources are accessible from the public cloud.

## Job statuses

The following table describes the different statuses that are possible for a job.

| Status| Description|
|:---|:---|
|Completed|The job completed successfully.|
|Failed| For [Graphical and PowerShell Workflow runbooks](automation-runbook-types.md), the runbook failed to compile.  For [PowerShell Script runbooks](automation-runbook-types.md), the runbook failed to start or the job encountered an exception. |
|Failed, waiting for resources|The job failed because it reached the [fair share](#fairshare) limit three times and started from the same checkpoint or from the start of the runbook each time.|
|Queued|The job is waiting for resources on an Automation worker to come available so that it can be started.|
|Starting|The job has been assigned to a worker, and the system is in the process of starting it.|
|Resuming|The system is in the process of resuming the job after it was suspended.|
|Running|The job is running.|
|Running, waiting for resources|The job has been unloaded because it reached the [fair share](#fairshare) limit. It will resume shortly from its last checkpoint.|
|Stopped|The job was stopped by the user before it was completed.|
|Stopping|The system is in the process of stopping the job.|
|Suspended|The job was suspended by the user, by the system, or by a command in the runbook. A job that is suspended can be started again and will resume from its last checkpoint or from the beginning of the runbook if it has no checkpoints. The runbook will only be suspended by the system in the case of an exception. By default, ErrorActionPreference is set to **Continue** meaning that the job will keep running on an error. If this preference variable is set to **Stop** then the job will suspend on an error.  Applies to [Graphical and PowerShell Workflow runbooks](automation-runbook-types.md) only.|
|Suspending|The system is attempting to suspend the job at the request of the user. The runbook must reach its next checkpoint before it can be suspended. If it has already passed its last checkpoint, then it will complete before it can be suspended.  Applies to [Graphical and PowerShell Workflow runbooks](automation-runbook-types.md) only.|

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

## Fair share

In order to share resources among all runbooks in the cloud, Azure Automation will temporarily unload any job after it has been running for 3 hours.    [Graphical](automation-runbook-types.md#graphical-runbooks) and [PowerShell Workflow](automation-runbook-types.md#powershell-workflow-runbooks) runbooks will be resumed from their last [checkpoint](http://technet.microsoft.com/library/dn469257.aspx#bk_Checkpoints). During this time, the job will show a status of Running, Waiting for Resources. If the runbook has no checkpoints or the job had not reached the first checkpoint before being unloaded, then it will restart from the beginning.  [PowerShell](automation-runbook-types.md#powershell-runbooks) runbooks are always restarted from the beginning since they don't support checkpoints.

>[AZURE.NOTE] The fair share limit is not applicable to runbook jobs executing on Hybrid Runbook Workers.

If the runbook restarts from the same checkpoint or from the beginning of the runbook three consecutive times, it will be terminated with a status of Failed, waiting for resources. This is to protect from runbooks running indefinitely without completing, as they are not able to make it to the next checkpoint without being unloaded again. In this case, you will receive the following exception with the failure.

*The job cannot continue running because it was repeatedly evicted from the same checkpoint. Please make sure your Runbook does not perform lengthy operations without persisting its state.*

When you create a runbook, you should ensure that the time to run any activities between two checkpoints will not exceed 3 hours. You may need to add checkpoints to your runbook to ensure that it does not reach this 3 hour limit or break up long running operations. For example, your runbook might perform a reindex on a large SQL database. If this single operation does not complete within the fair share limit, then the job will be unloaded and restarted from the beginning. In this case, you should break up the reindex operation into multiple steps, such as reindexing one table at a time, and then insert a checkpoint after each operation so that the job could resume after the last operation to complete.



## Next Steps

- [Starting a runbook in Azure Automation](automation-starting-a-runbook.md)
