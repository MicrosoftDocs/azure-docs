---
title: Runbook execution in Azure Automation
description: Describes the details of how a runbook in Azure Automation is processed.
services: automation
ms.service: automation
ms.subservice: process-automation
author: bobbytreed
ms.author: robreed
ms.date: 04/04/2019
ms.topic: conceptual
manager: carmonm
---
# Runbook execution in Azure Automation

When you start a runbook in Azure Automation, a job is created. A job is a single execution instance of a runbook. An Azure Automation worker is assigned to run each job. While workers are shared by many Azure accounts, jobs from different Automation accounts are isolated from one another. You don't have control over which worker services the request for your job. A single runbook can have many jobs running at one time. The execution environment for jobs from the same Automation Account may be reused. The more jobs you run at the same time, the more often they can be dispatched to the same sandbox. Jobs running in the same sandbox process can affect each other, one example is running the `Disconnect-AzureRMAccount` cmdlet. Running this cmdlet would disconnect each runbook job in the shared sandbox process. When you view the list of runbooks in the Azure portal, it lists the status of all jobs that were started for each runbook. You can view the list of jobs for each runbook to track the status of each. Job logs are stored for a max of 30 days. For a description of the different job statuses [Job Statuses](#job-statuses).

[!INCLUDE [GDPR-related guidance](../../includes/gdpr-dsr-and-stp-note.md)]

The following diagram shows the lifecycle of a runbook job for [PowerShell runbooks](automation-runbook-types.md#powershell-runbooks), [Graphical runbooks](automation-runbook-types.md#graphical-runbooks) and [PowerShell Workflow runbooks](automation-runbook-types.md#powershell-workflow-runbooks).

![Job Statuses - PowerShell Workflow](./media/automation-runbook-execution/job-statuses.png)

Your jobs have access to your Azure resources by making a connection to your Azure subscription. They only have access to resources in your data center if those resources are accessible from the public cloud.

## Where to run your runbooks

Runbooks in Azure Automation can run on either a sandbox in Azure or a [Hybrid Runbook Worker](automation-hybrid-runbook-worker.md). A sandbox is a shared environment in Azure that can be used by multiple jobs. Jobs using the same sandbox are bound by the resource limitations of the sandbox. Hybrid Runbook Workers can run runbooks directly on the computer that's hosting the role and against resources in the environment to manage those local resources. Runbooks are stored and managed in Azure Automation and then delivered to one or more assigned computers. Most runbooks can easily be run in the Azure sandboxes. There are specific scenarios where choosing a Hybrid Runbook over an Azure sandbox to execute your runbook may be recommended. See the following table for a list of some example scenarios:

|Task|Best Choice|Notes|
|---|---|---|
|Integrate with Azure resources|Azure Sandbox|Hosted in azure, authentication is simpler. If you are using a Hybrid Runbook Worker on an Azure VM, you can use [managed identities for Azure resources](automation-hrw-run-runbooks.md#managed-identities-for-azure-resources)|
|Optimal performance to manage azure resources|Azure Sandbox|Script is run in the same environment, which in turn has less latency|
|Minimize operational costs|Azure Sandbox|There is no compute overhead, no need for a VM|
|Long running script|Hybrid Runbook Worker|Azure sandboxes have [limitation on resources](../azure-subscription-service-limits.md#automation-limits)|
|Interact with Local services|Hybrid Runbook Worker|Can have access directly to host machine|
|Require 3rd party software and executables|Hybrid Runbook Worker|You manage the OS and can install software|
|Monitor a file or folder with a runbook|Hybrid Runbook Worker|Use a [Watcher task](automation-watchers-tutorial.md) on a Hybrid Runbook worker|
|Resource intensive script|Hybrid Runbook Worker| Azure sandboxes have [limitation on resources](../azure-subscription-service-limits.md#automation-limits)|
|Using modules with specific requirements| Hybrid Runbook Worker|Some examples are:</br> **WinSCP** - dependency on winscp.exe </br> **IISAdministration** - Needs IIS to be enabled|
|Install module that requires installer|Hybrid Runbook Worker|Modules for sandbox must be copiable|
|Using runbooks or modules that require .NET Framework different from 4.7.2|Hybrid Runbook Worker|Automation sandboxes have .NET Framework 4.7.2, and there is no way to upgrade it|
|Scripts that require elevation|Hybrid Runbook Worker|Sandboxes do not allow elevation. To solve this, use a Hybrid Runbook Worker and you can turn off UAC and use `Invoke-Command` when running the command that requires elevation|
|Scripts that require access to WMI|Hybrid Runbook Worker|Jobs running in sandboxes in the cloud [do not have access to the WMI](#device-and-application-characteristics)|

## Runbook behavior

Runbooks execute based on the logic that is defined inside them. If a runbook is interrupted, the runbook restarts at the beginning. This behavior requires runbooks to be written in a way where they support being restarted if there were transient issues.

PowerShell jobs started from a Runbook ran in an Azure sandbox may not run in the Full language mode. To learn more about PowerShell language modes, see [PowerShell language modes](/powershell/module/microsoft.powershell.core/about/about_language_modes). For additional details on how to interact with jobs in Azure Automation, see [Retrieving job status with PowerShell](#retrieving-job-status-using-powershell)

### Creating resources

If your script creates resources, you should check to see if the resource already exists before attempting to create it again. A basic example is shown in the following example:

```powershell
$vmName = "WindowsVM1"
$resourceGroupName = "myResourceGroup"
$myCred = Get-AutomationPSCredential "MyCredential"
$vmExists = Get-AzureRmResource -Name $vmName -ResourceGroupName $resourceGroupName

if(!$vmExists)
    {
    Write-Output "VM $vmName does not exists, creating"
    New-AzureRmVM -Name $vmName -ResourceGroupName $resourceGroupName -Credential $myCred
    }
else
    {
    Write-Output "VM $vmName already exists, skipping"
    }
```

### Time dependant scripts

Careful consideration should be made when authoring runbooks. As mentioned earlier, runbooks need to be authored in a way that they're robust and can handle transient errors that may cause the runbook to restart or fail. If a runbook fails, it is retried. If a runbook normally runs within a time constraint, logic to check the execution time should be implemented in the runbook to ensure operations like start up, shut down or scale out are run only during specific times.

> [!NOTE]
> The local time on the Azure sandbox process is set to UTC time. Calculations for date and time in your runbooks need to take this into consideration.

### Tracking progress

It is a good practice to author runbooks to be modular in nature. This means structuring the logic in the runbook such that it can be reused and restarted easily. Tracking progress in a runbook is a good way to ensure that the logic in a runbook executes correctly if there were issues. Some possible ways to track the progress of the runbook is by using an external source such as storage accounts, a database, or shared files. By tracking the state externally, you can create logic in your runbook to first check the state of the last action the runbook took. Then based off the results, either skip or continue specific tasks in the runbook.

### Prevent concurrent jobs

Some runbooks may behave strangely if they are running across multiple jobs at the same time. In this case, it's important to implement logic to check to see if a runbook already has a running job. A basic example of how you may do this behavior is shown in the following example:

```powershell
# Authenticate to Azure
$connection = Get-AutomationConnection -Name AzureRunAsConnection
Connect-AzureRmAccount -ServicePrincipal -Tenant $connection.TenantID `
-ApplicationID $connection.ApplicationID -CertificateThumbprint $connection.CertificateThumbprint

$AzureContext = Select-AzureRmSubscription -SubscriptionId $connection.SubscriptionID

# Check for already running or new runbooks
$runbookName = "<RunbookName>"
$rgName = "<ResourceGroupName>"
$aaName = "<AutomationAccountName>"
$jobs = Get-AzureRmAutomationJob -ResourceGroupName $rgName -AutomationAccountName $aaName -RunbookName $runbookName -AzureRmContext $AzureContext

# If then check to see if it is already running
$runningCount = ($jobs | ? {$_.Status -eq "Running"}).count

If (($jobs.status -contains "Running" -And $runningCount -gt 1 ) -Or ($jobs.Status -eq "New")) {
    # Exit code
    Write-Output "Runbook is already running"
    Exit 1
} else {
    # Insert Your code here
}
```

### Working with multiple subscriptions

When authoring runbooks that deal with multiple subscriptions, your runbook needs use the [Disable-AzureRmContextAutosave](/powershell/module/azurerm.profile/disable-azurermcontextautosave) cmdlet to ensure that your authentication context is not retrieved from another runbook that may be running in the same sandbox. You then need to use the `-AzureRmContext` parameter on your `AzureRM` cmdlets and pass it your proper context.

```powershell
# Ensures you do not inherit an AzureRMContext in your runbook
Disable-AzureRmContextAutosave –Scope Process

$Conn = Get-AutomationConnection -Name AzureRunAsConnection
Connect-AzureRmAccount -ServicePrincipal `
-Tenant $Conn.TenantID `
-ApplicationID $Conn.ApplicationID `
-CertificateThumbprint $Conn.CertificateThumbprint

$context = Get-AzureRmContext

$ChildRunbookName = 'ChildRunbookDemo'
$AutomationAccountName = 'myAutomationAccount'
$ResourceGroupName = 'myResourceGroup'

Start-AzureRmAutomationRunbook `
    -ResourceGroupName $ResourceGroupName `
    -AutomationAccountName $AutomationAccountName `
    -Name $ChildRunbookName `
    -DefaultProfile $context
```

### Handling exceptions

When authoring scripts, it is important to be able to handle exceptions and potential intermittent failures. The following are some different ways to handle exceptions or intermittent issues with your runbooks:

#### $ErrorActionPreference

The [$ErrorActionPreference](/powershell/module/microsoft.powershell.core/about/about_preference_variables#erroractionpreference) preference variable determines how PowerShell responds to a non-terminating error. Terminating errors are not affected by `$ErrorActionPreference`, they always terminate. By using `$ErrorActionPreference`, a normally non-terminating error like `PathNotFound` from the `Get-ChildItem` cmdlet will stop the runbook from completing. The following example shows using `$ErrorActionPreference`. The final `Write-Output` line will never execute as the script will stop.

```powershell-interactive
$ErrorActionPreference = 'Stop'
Get-Childitem -path nofile.txt
Write-Output "This message will not show"
```

#### Try Catch Finally

[Try Catch](/powershell/module/microsoft.powershell.core/about/about_try_catch_finally) is used in PowerShell scripts to help you handle terminating errors. By using Try Catch, you can catch specific exceptions or general exceptions. The Catch statement should be used to track errors or used to try to handle the error. The following example tries to download a file that does not exist. It catches the `System.Net.WebException` exception, if there was another exception the last value is returned.

```powershell-interactive
try
{
   $wc = new-object System.Net.WebClient
   $wc.DownloadFile("http://www.contoso.com/MyDoc.doc")
}
catch [System.Net.WebException]
{
    "Unable to download MyDoc.doc from http://www.contoso.com."
}
catch
{
    "An error occurred that could not be resolved."
}
```

#### Throw

[Throw](/powershell/module/microsoft.powershell.core/about/about_throw) can be used to generate a terminating error. This can be useful when defining your own logic in a runbook. If a certain criteria is met that should stop the script, you can use `throw` to stop the script. The following example shows machine a function parameter required by using `throw`.

```powershell-interactive
function Get-ContosoFiles
{
  param ($path = $(throw "The Path parameter is required."))
  Get-ChildItem -Path $path\*.txt -recurse
}
```

### Using executables or calling processes

Runbooks run in Azure sandboxes do not support calling processes (such as an .exe or subprocess.call). This is because Azure sandboxes are shared processes run in containers, which may not have access to all the underlying APIs. For scenarios where you require 3rd party software or calling of sub processes, it is recommended you execute the runbook on a [Hybrid Runbook Worker](automation-hybrid-runbook-worker.md).

### Device and application characteristics

Runbook jobs run in Azure sandboxes do not have access to any device or application characteristics. The most common API used to query performance metrics on Windows is WMI. Some of these common metrics are memory and CPU usage. However, it does not matter what API is used. Jobs running in the cloud do not have access to the Microsoft implementation of Web Based Enterprise Management (WBEM), which is built on the Common Information Model (CIM), which are the industry standards for defining device and application characteristics.

## Job statuses

The following table describes the different statuses that are possible for a job. PowerShell has two types of errors, terminating and non-terminating errors. Terminating errors set the runbook status to **Failed** if they occur. Non-terminating errors allow the script to continue even after they occur. An example of a non-terminating error is using the `Get-ChildItem` cmdlet with a path that doesn't exist. PowerShell sees that the path doesn't exist, throws an error, and continues to the next folder. This error wouldn't set the runbook status to **Failed** and could be marked as **Completed**. To force a runbook to stop on a non-terminating error, you can use `-ErrorAction Stop` on the cmdlet.

| Status | Description |
|:--- |:--- |
| Completed |The job completed successfully. |
| Failed |For [Graphical and PowerShell Workflow runbooks](automation-runbook-types.md), the runbook failed to compile. For [PowerShell Script runbooks](automation-runbook-types.md), the runbook failed to start or the job had an exception. |
| Failed, waiting for resources |The job failed because it reached the [fair share](#fair-share) limit three times and started from the same checkpoint or from the start of the runbook each time. |
| Queued |The job is waiting for resources on an Automation worker to come available so that it can be started. |
| Starting |The job has been assigned to a worker, and the system is starting it. |
| Resuming |The system is resuming the job after it was suspended. |
| Running |The job is running. |
| Running, waiting for resources |The job has been unloaded because it reached the [fair share](#fair-share) limit. It resumes shortly from its last checkpoint. |
| Stopped |The job was stopped by the user before it was completed. |
| Stopping |The system is stopping the job. |
| Suspended |The job was suspended by the user, by the system, or by a command in the runbook. If a runbook doesn't have a checkpoint, it starts from the beginning of the runbook. If it has a checkpoint, it can start again and resume from its last checkpoint. The runbook is only suspended by the system when an exception occurs. By default, ErrorActionPreference is set to **Continue**, meaning that the job keeps running on an error. If this preference variable is set to **Stop**, then the job suspends on an error. Applies to [Graphical and PowerShell Workflow runbooks](automation-runbook-types.md) only. |
| Suspending |The system is trying to suspend the job at the request of the user. The runbook must reach its next checkpoint before it can be suspended. If it already passed its last checkpoint, then it completes before it can be suspended. Applies to [Graphical and PowerShell Workflow runbooks](automation-runbook-types.md) only. |

## Viewing job status from the Azure portal

You can view a summarized status of all runbook jobs or drill into details of a specific runbook job in the Azure portal. You can also configure integration with your Log Analytics workspace to forward runbook job status and job streams. For more information about integrating with Azure Monitor logs, see [Forward job status and job streams from Automation to Azure Monitor logs](automation-manage-send-joblogs-log-analytics.md).

### Automation runbook jobs summary

On the right of your selected Automation account, you can see a summary of all the runbook jobs under **Job Statistics** tile.

![Job Statistics tile](./media/automation-runbook-execution/automation-account-job-status-summary.png)

This tile displays a count and graphical representation of the job status for all jobs executed.

Clicking the tile presents the **Jobs** page, which includes a summarized list of all jobs executed. This page shows the status, start times, and completion times.

![Automation account Jobs page](./media/automation-runbook-execution/automation-account-jobs-status-blade.png)

You can filter the list of jobs by selecting **Filter jobs**  and filter on a specific runbook, job status, or from the drop-down list, and the time range to search within.

![Filter Job status](./media/automation-runbook-execution/automation-account-jobs-filter.png)

Alternatively, you can view job summary details for a specific runbook by selecting that runbook from the **Runbooks** page in your Automation account, and then select the **Jobs** tile. This action presents the **Jobs** page, and from there you can click the job record to view its detail and output.

![Automation account Jobs page](./media/automation-runbook-execution/automation-runbook-job-summary-blade.png)

### Job Summary

You can view a list of all the jobs that have been created for a particular runbook and their most recent status. You can filter this list by job status and the range of dates for the last change to the job. To view its detailed information and output, click the name of a job. The detailed view of the job includes the values for the runbook parameters that were provided to that job.

You can use the following steps to view the jobs for a runbook.

1. In the Azure portal, select **Automation** and then select the name of an Automation account.
2. From the hub, select **Runbooks** and then on the **Runbooks** page select a runbook from the list.
3. On the page for the selected runbook, click the **Jobs** tile.
4. Click one of the jobs in the list and on the runbook job details page you can view its detail and output.

## Retrieving job status using PowerShell

You can use the [Get-AzureRmAutomationJob](https://docs.microsoft.com/powershell/module/azurerm.automation/get-azurermautomationjob) to retrieve the jobs created for a runbook and the details of a particular job. If you start a runbook with PowerShell using [Start-AzureRmAutomationRunbook](https://docs.microsoft.com/powershell/module/azurerm.automation/start-azurermautomationrunbook), then it returns the resulting job. Use [Get-AzureRmAutomationJobOutput](https://docs.microsoft.com/powershell/module/azurerm.automation/get-azurermautomationjoboutput) to get a job’s output.

The following sample commands retrieve the last job for a sample runbook and display its status, the values provided for the runbook parameters, and the output from the job.

```azurepowershell-interactive
$job = (Get-AzureRmAutomationJob –AutomationAccountName "MyAutomationAccount" `
–RunbookName "Test-Runbook" -ResourceGroupName "ResourceGroup01" | sort LastModifiedDate –desc)[0]
$job.Status
$job.JobParameters
Get-AzureRmAutomationJobOutput -ResourceGroupName "ResourceGroup01" `
–AutomationAccountName "MyAutomationAcct" -Id $job.JobId –Stream Output
```

The following sample retrieves the output for a specific job, and returns each record. In the case that there was an exception for one of the records, the exception is written out instead of the value. This behavior is useful as exceptions can provide additional information, which may not be logged normally during output.

```azurepowershell-interactive
$output = Get-AzureRmAutomationJobOutput -AutomationAccountName <AutomationAccountName> -Id <jobID> -ResourceGroupName <ResourceGroupName> -Stream "Any"
foreach($item in $output)
{
    $fullRecord = Get-AzureRmAutomationJobOutputRecord -AutomationAccountName <AutomationAccountName> -ResourceGroupName <ResourceGroupName> -JobId <jobID> -Id $item.StreamRecordId
    if ($fullRecord.Type -eq "Error")
    {
        $fullRecord.Value.Exception
    }
    else
    {
    $fullRecord.Value
    }
}
```

## Get details from Activity log

Other details such as the person or account that started the runbook can be retrieved from the Activity log for the automation account. The following PowerShell example provides the last user to run the runbook in question:

```powershell-interactive
$SubID = "00000000-0000-0000-0000-000000000000"
$AutomationResourceGroupName = "MyResourceGroup"
$AutomationAccountName = "MyAutomationAccount"
$RunbookName = "MyRunbook"
$StartTime = (Get-Date).AddDays(-1)
$JobActivityLogs = Get-AzureRmLog -ResourceGroupName $AutomationResourceGroupName -StartTime $StartTime `
                                | Where-Object {$_.Authorization.Action -eq "Microsoft.Automation/automationAccounts/jobs/write"}

$JobInfo = @{}
foreach ($log in $JobActivityLogs)
{
    # Get job resource
    $JobResource = Get-AzureRmResource -ResourceId $log.ResourceId

    if ($JobInfo[$log.SubmissionTimestamp] -eq $null -and $JobResource.Properties.runbook.name -eq $RunbookName)
    { 
        # Get runbook
        $Runbook = Get-AzureRmAutomationJob -ResourceGroupName $AutomationResourceGroupName -AutomationAccountName $AutomationAccountName `
                                            -Id $JobResource.Properties.jobId | ? {$_.RunbookName -eq $RunbookName}

        # Add job information to hash table
        $JobInfo.Add($log.SubmissionTimestamp, @($Runbook.RunbookName,$Log.Caller, $JobResource.Properties.jobId))
    }
}
$JobInfo.GetEnumerator() | sort key -Descending | Select-Object -First 1
```

## Fair share

To share resources among all runbooks in the cloud, Azure Automation temporarily unloads or stops any job that has run for more than three hours. Jobs for [PowerShell-based runbooks](automation-runbook-types.md#powershell-runbooks) and [Python runbooks](automation-runbook-types.md#python-runbooks) are stopped and not restarted, and the job status shows Stopped.

For long running tasks, it's recommended to use a [Hybrid Runbook Worker](automation-hrw-run-runbooks.md#job-behavior). Hybrid Runbook Workers aren't limited by fair share, and don't have a limitation on how long a runbook can execute. The other job [limits](../azure-subscription-service-limits.md#automation-limits) apply to both Azure sandboxes and Hybrid Runbook Workers. While Hybrid Runbook Workers aren't limited by the 3 hour fair share limit, runbooks run on them should be developed to support restart behaviors from unexpected local infrastructure issues.

Another option is to optimize the runbook by using child runbooks. If your runbook loops through the same function on several resources, such as a database operation on several databases, you can move that function to a [child runbook](automation-child-runbooks.md) and call it with the [Start-AzureRMAutomationRunbook](/powershell/module/azurerm.automation/start-azurermautomationrunbook) cmdlet. Each of these child runbooks executes in parallel in separate processes. This behavior decreases the total amount of time for the parent runbook to complete. You can use the [Get-AzureRmAutomationJob](/powershell/module/azurerm.automation/Get-AzureRmAutomationJob) cmdlet in your runbook to check the job status for each child if there are operations that perform after the child runbook completes.

## Next steps

* To learn more about the different methods that can be used to start a runbook in Azure Automation, see [Starting a runbook in Azure Automation](automation-starting-a-runbook.md)

