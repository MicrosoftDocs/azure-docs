---
title: Runbook execution in Azure Automation
description: Describes the details of how a runbook in Azure Automation is processed.
services: automation
ms.subservice: process-automation
ms.date: 04/04/2019
ms.topic: conceptual
---
# Runbook execution in Azure Automation

Runbooks execute based on the logic defined inside them. If a runbook is interrupted, the runbook restarts at the beginning. This behavior requires you to write runbooks that support being restarted if transient issues occur.

Starting a runbook in Azure Automation creates a job, which is a single execution instance of the runbook. Each job has access to Azure resources by making a connection to your Azure subscription. The job only has access to resources in your datacenter if those resources are accessible from the public cloud.

Azure Automation assigns a worker to run each job during runbook execution. While workers are shared by many Azure accounts, jobs from different Automation accounts are isolated from one another. You don't have control over which worker services your job request.

When you view the list of runbooks in the Azure portal, it shows the status of each job that has been started for each runbook. Azure Automation stores job logs for a maximum of 30 days. 

The following diagram shows the lifecycle of a runbook job for [PowerShell runbooks](automation-runbook-types.md#powershell-runbooks), [graphical runbooks](automation-runbook-types.md#graphical-runbooks), and [PowerShell Workflow runbooks](automation-runbook-types.md#powershell-workflow-runbooks).

![Job Statuses - PowerShell Workflow](./media/automation-runbook-execution/job-statuses.png)

[!INCLUDE [GDPR-related guidance](../../includes/gdpr-dsr-and-stp-note.md)]

>[!NOTE]
>This article has been updated to use the new Azure PowerShell Az module. You can still use the AzureRM module, which will continue to receive bug fixes until at least December 2020. To learn more about the new Az module and AzureRM compatibility, see [Introducing the new Azure PowerShell Az module](https://docs.microsoft.com/powershell/azure/new-azureps-module-az?view=azps-3.5.0). For Az module installation instructions on your Hybrid Runbook Worker, see [Install the Azure PowerShell Module](https://docs.microsoft.com/powershell/azure/install-az-ps?view=azps-3.5.0). For your Automation account, you can update your modules to the latest version using [How to update Azure PowerShell modules in Azure Automation](automation-update-azure-modules.md).

## Where to run your runbooks

Runbooks in Azure Automation can run on either an Azure sandbox or a [Hybrid Runbook Worker](automation-hybrid-runbook-worker.md). Most runbooks can easily be run in an Azure sandbox, a shared environment that multiple jobs can use. Jobs using the same sandbox are bound by the resource limitations of the sandbox.

You can use a Hybrid Runbook Worker to run runbooks directly on the computer that hosts the role and against local resources in the environment. Azure Automation stores and manages runbooks and then delivers them to one or more assigned computers.

The following table lists some runbook execution tasks with the recommended execution environment listed for each.

|Task|Best Choice|Notes|
|---|---|---|
|Integrate with Azure resources|Azure Sandbox|Hosted in Azure, authentication is simpler. If you are using a Hybrid Runbook Worker on an Azure VM, you can use [managed identities for Azure resources](automation-hrw-run-runbooks.md#managed-identities-for-azure-resources).|
|Obtain optimal performance to manage Azure resources|Azure Sandbox|Script is run in the same environment, which has less latency.|
|Minimize operational costs|Azure Sandbox|There is no compute overhead and no need for a VM.|
|Execute long-running script|Hybrid Runbook Worker|Azure sandboxes have [limitations on resources](../azure-resource-manager/management/azure-subscription-service-limits.md#automation-limits).|
|Interact with Local Services|Hybrid Runbook Worker|Can have access directly to host machine.|
|Require third-party software and executables|Hybrid Runbook Worker|You manage the operating system and can install software.|
|Monitor a file or folder with a runbook|Hybrid Runbook Worker|Use a [Watcher task](automation-watchers-tutorial.md) on a Hybrid Runbook Worker.|
|Run a resource-intensive script|Hybrid Runbook Worker| Azure sandboxes have [limitations on resources](../azure-resource-manager/management/azure-subscription-service-limits.md#automation-limits).|
|Use modules with specific requirements| Hybrid Runbook Worker|Some examples are:</br> WinSCP - dependency on winscp.exe </br> IISAdministration - dependency on enabling of IIS.|
|Install a module with an installer|Hybrid Runbook Worker|Modules for sandbox must support copying.|
|Use runbooks or modules that require .NET Framework version different from 4.7.2|Hybrid Runbook Worker|Automation sandboxes have .NET Framework 4.7.2, and there is no way to upgrade it.|
|Run scripts that require elevation|Hybrid Runbook Worker|Sandboxes do not allow elevation. With a Hybrid Runbook Worker, you can turn off UAC and use **Invoke-Command** when running the command that requires elevation.|
|Run scripts that require access to WMI|Hybrid Runbook Worker|Jobs running in sandboxes in the cloud do not have access to WMI. |

## Runbook behavior

### Creating resources

If your runbook creates a resource, the script should check to see if the resource already exists before attempting to create it. Here's a basic example.

```powershell
$vmName = "WindowsVM1"
$resourceGroupName = "myResourceGroup"
$myCred = Get-AutomationPSCredential "MyCredential"
$vmExists = Get-AzResource -Name $vmName -ResourceGroupName $resourceGroupName

if(!$vmExists)
    {
    Write-Output "VM $vmName does not exist, creating"
    New-AzureRMVM -Name $vmName -ResourceGroupName $resourceGroupName -Credential $myCred
    }
else
    {
    Write-Output "VM $vmName already exists, skipping"
    }
```

### Supporting time-dependent scripts

Your runbooks must be robust and capable of handling transient errors that can cause them to restart or fail. If a runbook fails, Azure Automation retries it.

If your runbook normally runs within a time constraint, have the script implement logic to check the execution time. This check ensures the running of operations such as startup, shutdown, or scale-out only during specific times.

> [!NOTE]
> The local time on the Azure sandbox process is set to UTC. Calculations for date and time in your runbooks must take this fact into consideration.

### Tracking progress

It is a good practice to author your runbooks to be modular in nature, structuring runbook logic so that it can be reused and restarted easily. Tracking progress in a runbook is a good way to ensure that the runbook logic executes correctly if there are issues. It's possible to track the progress of a runbook by using an external source, such as a storage account, a database, or shared files. You can create logic in your runbook to first check the state of the last action taken. Then, based on the result of the check, the logic can either skip or continue specific tasks in the runbook.

### Preventing concurrent jobs

Some runbooks behave strangely if they run across multiple jobs at the same time. In this case, it's important for a runbook to implement logic to determine if there is already a running job. Here's a basic example.

```powershell
# Authenticate to Azure
$connection = Get-AutomationConnection -Name AzureRunAsConnection
Connect-AzAccount -ServicePrincipal -Tenant $connection.TenantID `
-ApplicationId $connection.ApplicationID -CertificateThumbprint $connection.CertificateThumbprint

$AzContext = Select-AzSubscription -SubscriptionId $connection.SubscriptionID

# Check for already running or new runbooks
$runbookName = "<RunbookName>"
$rgName = "<ResourceGroupName>"
$aaName = "<AutomationAccountName>"
$jobs = Get-AzAutomationJob -ResourceGroupName $rgName -AutomationAccountName $aaName -RunbookName $runbookName -AzContext $AzureContext

# Check to see if it is already running
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

To deal with multiple subscriptions, your runbook must use the [Disable-AzContextAutosave](https://docs.microsoft.com/powershell/module/Az.Accounts/Disable-AzContextAutosave?view=azps-3.5.0) cmdlet to ensure that the authentication context is not retrieved from another runbook running in the same sandbox. The runbook also uses the`AzContext` parameter on the Az module cmdlets and passes it the proper context.

```powershell
# Ensures that you do not inherit an AzContext in your runbook
Disable-AzContextAutosave –Scope Process

$Conn = Get-AutomationConnection -Name AzureRunAsConnection
Connect-AzAccount -ServicePrincipal `
-Tenant $Conn.TenantID `
-ApplicationId $Conn.ApplicationID `
-CertificateThumbprint $Conn.CertificateThumbprint

$context = Get-AzContext

$ChildRunbookName = 'ChildRunbookDemo'
$AutomationAccountName = 'myAutomationAccount'
$ResourceGroupName = 'myResourceGroup'

Start-AzAutomationRunbook `
    -ResourceGroupName $ResourceGroupName `
    -AutomationAccountName $AutomationAccountName `
    -Name $ChildRunbookName `
    -DefaultProfile $context
```

### Handling exceptions

This section describes some ways to handle exceptions or intermittent issues in your runbooks.

#### ErrorActionPreference

The [ErrorActionPreference](/powershell/module/microsoft.powershell.core/about/about_preference_variables#erroractionpreference) variable determines how PowerShell responds to a non-terminating error. Terminating errors always terminate and are not affected by *ErrorActionPreference*.

When the runbook uses `ErrorActionPreference`, a normally non-terminating error such as **PathNotFound** from the `Get-ChildItem` cmdlet stops the runbook from completing. The following example shows the use of `ErrorActionPreference`. The final `Write-Output` command never executes, as the script stops.

```powershell-interactive
$ErrorActionPreference = 'Stop'
Get-Childitem -path nofile.txt
Write-Output "This message will not show"
```

#### Try Catch Finally

[Try Catch Finally](/powershell/module/microsoft.powershell.core/about/about_try_catch_finally) is used in PowerShell scripts to handle terminating errors. The script can use this mechanism to catch specific exceptions or general exceptions. The `catch` statement should be used to track or try to handle errors. The following example tries to download a file that does not exist. It catches the `System.Net.WebException` exception and returns the last value for any other exception.

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

[Throw](/powershell/module/microsoft.powershell.core/about/about_throw) can be used to generate a terminating error. This mechanism can be useful when defining your own logic in a runbook. If the script meets a criterion that should stop it, it can use the `throw` statement to stop. The following example uses this statement to show a required function parameter.

```powershell-interactive
function Get-ContosoFiles
{
  param ($path = $(throw "The Path parameter is required."))
  Get-ChildItem -Path $path\*.txt -recurse
}
```

### Using executables or calling processes

Runbooks that run in Azure sandboxes do not support calling processes, such as executables (**.exe** files) or subprocesses.  The reason for this is that an Azure sandbox is a shared process run in a container that might not have access to all the underlying APIs. For scenarios requiring third-party software or calls to subprocesses, it is recommended to execute a runbook on a [Hybrid Runbook Worker](automation-hybrid-runbook-worker.md).

### Accessing device and application characteristics

Runbook jobs that run in Azure sandboxes don't have access to any device or application characteristics. The most common API used to query performance metrics on Windows is WMI, with some of the common metrics being memory and CPU usage. However, it doesn't matter what API is used, as jobs running in the cloud don't have access to the Microsoft implementation of Web-Based Enterprise Management (WBEM). This platform is built on the Common Information Model (CIM), providing the industry standards for defining device and application characteristics.

## Handling errors

Your runbooks must be capable of handling errors. PowerShell has two types of errors, terminating and non-terminating. Terminating errors stop runbook execution when they occur. The runbook stops with a job status of Failed.

Non-terminating errors allow a script to continue even after they occur. An example of a non-terminating error is one that occurs when a runbook uses the `Get-ChildItem` cmdlet with a path that doesn't exist. PowerShell sees that the path doesn't exist, throws an error, and continues to the next folder. The error in this case doesn't set runbook job status status to Failed, and the job might even be completed. To force a runbook to stop on a non-terminating error, you can use `-ErrorAction Stop` on the cmdlet.

## Handling jobs

You can reuse the execution environment for jobs from the same Automation account. A single runbook can have many jobs running at one time. The more jobs you run at the same time, the more often they can be dispatched to the same sandbox.

Jobs running in the same sandbox process can affect each other. One example is running the `Disconnect-AzAccount` cmdlet. Execution of this cmdlet disconnects each runbook job in the shared sandbox process.

PowerShell jobs started from a runbook that runs in an Azure sandbox might not run in the full language mode. To learn more about PowerShell language modes, see [PowerShell language modes](/powershell/module/microsoft.powershell.core/about/about_language_modes). For additional details on interacting with jobs in Azure Automation, see [Retrieving job status with PowerShell](#retrieving-job-status-using-powershell).

### Job statuses

The following table describes the statuses that are possible for a job.

| Status | Description |
|:--- |:--- |
| Completed |The job completed successfully. |
| Failed |A graphical or PowerShell Workflow runbook failed to compile. A PowerShell script runbook failed to start or the job had an exception. See [Azure Automation runbook types](automation-runbook-types.md).|
| Failed, waiting for resources |The job failed because it reached the [fair share](#fair-share) limit three times and started from the same checkpoint or from the start of the runbook each time. |
| Queued |The job is waiting for resources on an Automation worker to become available so that it can be started. |
| Starting |The job has been assigned to a worker, and the system is starting it. |
| Resuming |The system is resuming the job after it was suspended. |
| Running |The job is running. |
| Running, waiting for resources |The job has been unloaded because it reached the fair share limit. It will resume shortly from its last checkpoint. |
| Stopped |The job was stopped by the user before it was completed. |
| Stopping |The system is stopping the job. |
| Suspended |Applies to [graphical and PowerShell Workflow runbooks](automation-runbook-types.md) only. The job was suspended by the user, by the system, or by a command in the runbook. If a runbook doesn't have a checkpoint, it starts from the beginning. If it has a checkpoint, it can start again and resume from its last checkpoint. The system only suspends the runbook when an exception occurs. By default, the `ErrorActionPreference` variable is set to Continue, indicating that the job keeps running on an error. If the preference variable is set to Stop, the job suspends on an error.  |
| Suspending |Applies to [graphical and PowerShell Workflow runbooks](automation-runbook-types.md) only. The system is trying to suspend the job at the request of the user. The runbook must reach its next checkpoint before it can be suspended. If it has already passed its last checkpoint, it completes before it can be suspended. |

### Viewing job status from the Azure portal

You can view a summarized status of all runbook jobs or drill into details of a specific runbook job in the Azure portal. You can also configure integration with your Log Analytics workspace to forward runbook job status and job streams. For more information about integrating with Azure Monitor logs, see [Forward job status and job streams from Automation to Azure Monitor logs](automation-manage-send-joblogs-log-analytics.md).

On the right of your selected Automation account, you can see a summary of all the runbook jobs under the **Job Statistics** tile.

![Job Statistics tile](./media/automation-runbook-execution/automation-account-job-status-summary.png)

This tile displays a count and graphical representation of the job status for each job executed.

Clicking the tile presents the Jobs page, which includes a summarized list of all jobs executed. This page shows the status, runbook name, start time, and completion time for each job.

![Automation account Jobs page](./media/automation-runbook-execution/automation-account-jobs-status-blade.png)

You can filter the list of jobs by selecting **Filter jobs**. Filter on a specific runbook, job status, or a choice from the dropdown list, and provide the time range for the search.

![Filter job status](./media/automation-runbook-execution/automation-account-jobs-filter.png)

Alternatively, you can view job summary details for a specific runbook by selecting that runbook from the Runbooks page in your Automation account, and then selecting the **Jobs** tile. This action presents the Jobs page. From here, you can click the job record to view its details and output.

![Automation account Jobs page](./media/automation-runbook-execution/automation-runbook-job-summary-blade.png)

### Viewing the job summary

The job summary described above allows you to look at a list of all the jobs that have been created for a particular runbook and their most recent status. To see detailed information and output for a job, click its name in the list. The detailed view of the job includes the values for the runbook parameters that have been provided to that job.

You can use the following steps to view the jobs for a runbook.

1. In the Azure portal, select **Automation** and then select the name of an Automation account.
2. From the hub, select **Runbooks** under **Process Automation**.
3. On the Runbooks page, select a runbook from the list.
3. On the page for the selected runbook, click the **Jobs** tile.
4. Click one of the jobs in the list and view its details and output on the runbook job details page.

### Retrieving job status using PowerShell

Use the `Get-AzAutomationJob` cmdlet to retrieve the jobs created for a runbook and the details of a particular job. If you start a runbook with PowerShell using `Start-AzAutomationRunbook`, it returns the resulting job. Use [Get-AzAutomationJobOutput](https://docs.microsoft.com/powershell/module/Az.Automation/Get-AzAutomationJobOutput?view=azps-3.5.0) to retrieve job output.

The following example gets the last job for a sample runbook and displays its status, the values provided for the runbook parameters, and the job output.

```azurepowershell-interactive
$job = (Get-AzAutomationJob –AutomationAccountName "MyAutomationAccount" `
–RunbookName "Test-Runbook" -ResourceGroupName "ResourceGroup01" | sort LastModifiedDate –desc)[0]
$job.Status
$job.JobParameters
Get-AzAutomationJobOutput -ResourceGroupName "ResourceGroup01" `
–AutomationAccountName "MyAutomationAcct" -Id $job.JobId –Stream Output
```

The following example retrieves the output for a specific job and returns each record. If there is an exception for one of the records, the script writes the exception instead of the value. This behavior is useful, as exceptions can provide additional information that might not be logged normally during output.

```azurepowershell-interactive
$output = Get-AzAutomationJobOutput -AutomationAccountName <AutomationAccountName> -Id <jobID> -ResourceGroupName <ResourceGroupName> -Stream "Any"
foreach($item in $output)
{
    $fullRecord = Get-AzAutomationJobOutputRecord -AutomationAccountName <AutomationAccountName> -ResourceGroupName <ResourceGroupName> -JobId <jobID> -Id $item.StreamRecordId
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

## Getting details from the Activity log

You can retrieve runbook details, such as the person or account that started the runbook, from the Activity log for the Automation account. The following PowerShell example provides the last user to run the specified runbook.

```powershell-interactive
$SubID = "00000000-0000-0000-0000-000000000000"
$AutomationResourceGroupName = "MyResourceGroup"
$AutomationAccountName = "MyAutomationAccount"
$RunbookName = "MyRunbook"
$StartTime = (Get-Date).AddDays(-1)
$JobActivityLogs = Get-AzLog -ResourceGroupName $AutomationResourceGroupName -StartTime $StartTime `
                                | Where-Object {$_.Authorization.Action -eq "Microsoft.Automation/automationAccounts/jobs/write"}

$JobInfo = @{}
foreach ($log in $JobActivityLogs)
{
    # Get job resource
    $JobResource = Get-AzResource -ResourceId $log.ResourceId

    if ($JobInfo[$log.SubmissionTimestamp] -eq $null -and $JobResource.Properties.runbook.name -eq $RunbookName)
    {
        # Get runbook
        $Runbook = Get-AzAutomationJob -ResourceGroupName $AutomationResourceGroupName -AutomationAccountName $AutomationAccountName `
                                            -Id $JobResource.Properties.jobId | ? {$_.RunbookName -eq $RunbookName}

        # Add job information to hashtable
        $JobInfo.Add($log.SubmissionTimestamp, @($Runbook.RunbookName,$Log.Caller, $JobResource.Properties.jobId))
    }
}
$JobInfo.GetEnumerator() | sort key -Descending | Select-Object -First 1
```

## <a name="fair-share"></a>Sharing resources among runbooks

To share resources among all runbooks in the cloud, Azure Automation temporarily unloads or stops any job that has run for more than three hours. Jobs for [PowerShell runbooks](automation-runbook-types.md#powershell-runbooks) and [Python runbooks](automation-runbook-types.md#python-runbooks) are stopped and not restarted, and the job status becomes Stopped.

For long-running tasks, it's recommended to use a Hybrid Runbook Worker. Hybrid Runbook Workers aren't limited by fair share, and don't have a limitation on how long a runbook can execute. The other job [limits](../azure-resource-manager/management/azure-subscription-service-limits.md#automation-limits) apply to both Azure sandboxes and Hybrid Runbook Workers. While Hybrid Runbook Workers aren't limited by the 3-hour fair share limit, you should develop runbooks to run on the workers that support restarts from unexpected local infrastructure issues.

Another option is to optimize a runbook by using child runbooks. For example, your runbook might loop through the same function on several resources, such as a database operation on several databases. You can move this function to a [child runbook](automation-child-runbooks.md) and have your runbook call it using `Start-AzAutomationRunbook`. Child runbooks execute in parallel in separate processes.

Using child runbooks decreases the total amount of time for the parent runbook to complete. Your runbook can use the `Get-AzAutomationJob` cmdlet to check the job status for a child runbook if it still has operations to perform after the child completes.

## Next steps

* To learn more about the methods that can be used to start a runbook in Azure Automation, see [Starting a runbook in Azure Automation](automation-starting-a-runbook.md).
* For more information on PowerShell, including language reference and learning modules, refer to the [PowerShell Docs](https://docs.microsoft.com/powershell/scripting/overview).
