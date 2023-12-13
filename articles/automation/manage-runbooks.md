---
title: Manage runbooks in Azure Automation
description: This article tells how to manage runbooks in Azure Automation.
services: automation
ms.subservice: process-automation
ms.date: 08/28/2023
ms.topic: conceptual
ms.custom: devx-track-azurepowershell
---

# Manage runbooks in Azure Automation

You can add a runbook to Azure Automation by either creating a new one or importing an existing one from a file or the [Runbook Gallery](automation-runbook-gallery.md). This article provides information for managing a runbook and recommended patterns and best practices with runbook design. You can find all the details of accessing community runbooks and modules in [Runbook and module galleries for Azure Automation](automation-runbook-gallery.md).

## Create a runbook

Create a new runbook in Azure Automation using the Azure portal or PowerShell. Once the runbook has been created, you can edit it using information in:

* [Edit textual runbook in Azure Automation](automation-edit-textual-runbook.md)
* [Learn key PowerShell Workflow concepts for Automation runbooks](automation-powershell-workflow.md)
* [Manage Python 2 packages in Azure Automation](python-packages.md)
* [Manage Python 3 packages (preview) in Azure Automation](python-3-packages.md)

### Create a runbook in the Azure portal

1. Sign in to the Azure [portal](https://portal.azure.com).
1. Search for and select **Automation Accounts**.
1. On the **Automation Accounts** page, select your Automation account from the list.
1. From the Automation account, select **Runbooks** under **Process Automation** to open the list of runbooks.
1. Click **Create a runbook**.
    1. Name the runbook.
    1. From the **Runbook type** drop-down. Select its [type](automation-runbook-types.md). The runbook name must start with a letter and can contain letters, numbers, underscores, and dashes
    1. Select the **Runtime version**
    1. Enter applicable **Description**
1. Click **Create** to create the runbook.

### Create a runbook with PowerShell

Use the [New-AzAutomationRunbook](/powershell/module/az.automation/new-azautomationrunbook) cmdlet to create an empty runbook. Use the `Type` parameter to specify one of the runbook types defined for `New-AzAutomationRunbook`.

The following example shows how to create a new empty runbook.

```azurepowershell-interactive
$params = @{
    AutomationAccountName = 'MyAutomationAccount'
    Name                  = 'NewRunbook'
    ResourceGroupName     = 'MyResourceGroup'
    Type                  = 'PowerShell'
}
New-AzAutomationRunbook @params
```

## Import a runbook

You can import a PowerShell or PowerShell Workflow (**.ps1**) script, a graphical runbook (**.graphrunbook**), or a Python 2 or Python 3 script (**.py**) to make your own runbook. You specify the [type of runbook](automation-runbook-types.md) that is created during import, taking into account the following considerations.

* You can import a **.ps1** file that doesn't contain a workflow into either a [PowerShell runbook](automation-runbook-types.md#powershell-runbooks) or a [PowerShell Workflow runbook](automation-runbook-types.md#powershell-workflow-runbooks). If you import it into a PowerShell Workflow runbook, it is converted to a workflow. In this case, comments are included in the runbook to describe the changes made.

* You can import only a **.ps1** file containing a PowerShell Workflow into a [PowerShell Workflow runbook](automation-runbook-types.md#powershell-workflow-runbooks). If the file contains multiple PowerShell workflows, the import fails. You have to save each workflow to its own file and import each separately.

* Do not import a **.ps1** file containing a PowerShell Workflow into a [PowerShell runbook](automation-runbook-types.md#powershell-runbooks), as the PowerShell script engine can't recognize it.

* Only import a **.graphrunbook** file into a new [graphical runbook](automation-runbook-types.md#graphical-runbooks).

### Import a runbook from the Azure portal

You can use the following procedure to import a script file into Azure Automation.

> [!NOTE]
> You can only import a **.ps1** file into a PowerShell Workflow runbook using the portal.

1. In the Azure portal, search for and select **Automation Accounts**.
1. On the **Automation Accounts** page, select your Automation account from the list.
1. From the Automation account, select **Runbooks** under **Process Automation** to open the list of runbooks.
1. Click **Import a runbook**. You can select either of the following options:
    1. **Browse for file** - selects a file from your local machine.
    1. **Browse from Gallery** - You can browse and select an existing runbook from gallery.
1. Select the file.
1. If the **Name** field is enabled, you have the option of changing the runbook name. The name must start with a letter and can contain letters, numbers, underscores, and dashes.
1. The [**Runbook type**](automation-runbook-types.md) is automatically populated, but you can change the type after taking the applicable restrictions into account.
1. The **Runtime version** is either auto-populated or pick the version from the drop-down list.
1. Click **Import**. The new runbook appears in the list of runbooks for the Automation account.
1. You have to [publish the runbook](#publish-a-runbook) before you can run it.

> [!NOTE]
> After you import a graphical runbook, you can convert it to another type. However, you can't convert a graphical runbook to a textual runbook.

### Import a runbook with PowerShell

Use the [Import-AzAutomationRunbook](/powershell/module/az.automation/import-azautomationrunbook) cmdlet to import a script file as a draft runbook. If the runbook already exists, the import fails unless you use the `Force` parameter with the cmdlet.

The following example shows how to import a script file into a runbook.

```azurepowershell-interactive
$params = @{
    AutomationAccountName = 'MyAutomationAccount'
    Name                  = 'Sample_TestRunbook'
    ResourceGroupName     = 'MyResourceGroup'
    Type                  = 'PowerShell'
    Path                  = 'C:\Runbooks\Sample_TestRunbook.ps1'
}
Import-AzAutomationRunbook @params
```

## Handle resources

If your runbook creates a [resource](automation-runbook-execution.md#resources), the script should check to see if the resource already exists before attempting to create it. Here's a basic example.

```powershell
$vmName = 'WindowsVM1'
$rgName = 'MyResourceGroup'
$myCred = Get-AutomationPSCredential 'MyCredential'

$vmExists = Get-AzResource -Name $vmName -ResourceGroupName $rgName
if (-not $vmExists) {
    Write-Output "VM $vmName does not exist, creating"
    New-AzVM -Name $vmName -ResourceGroupName $rgName -Credential $myCred
} else {
    Write-Output "VM $vmName already exists, skipping"
}
```

## Retrieve details from Activity log

You can retrieve runbook details, such as the person or account that started a runbook, from the [Activity log](automation-runbook-execution.md#activity-logging) for the Automation account. The following PowerShell example provides the last user to run the specified runbook.

```powershell-interactive
$rgName = 'MyResourceGroup'
$accountName = 'MyAutomationAccount'
$runbookName = 'MyRunbook'
$startTime = (Get-Date).AddDays(-1)

$params = @{
    ResourceGroupName = $rgName
    StartTime         = $startTime
}
$JobActivityLogs = (Get-AzLog @params).Where( { $_.Authorization.Action -eq 'Microsoft.Automation/automationAccounts/jobs/write' })

$JobInfo = @{}
foreach ($log in $JobActivityLogs) {
    # Get job resource
    $JobResource = Get-AzResource -ResourceId $log.ResourceId

    if ($null -eq $JobInfo[$log.SubmissionTimestamp] -and $JobResource.Properties.Runbook.Name -eq $runbookName) {
        # Get runbook
        $jobParams = @{
            ResourceGroupName     = $rgName
            AutomationAccountName = $accountName
            Id                    = $JobResource.Properties.JobId
        }
        $Runbook = Get-AzAutomationJob @jobParams | Where-Object RunbookName -EQ $runbookName

        # Add job information to hashtable
        $JobInfo.Add($log.SubmissionTimestamp, @($Runbook.RunbookName, $Log.Caller, $JobResource.Properties.jobId))
    }
}
$JobInfo.GetEnumerator() | Sort-Object Key -Descending | Select-Object -First 1
```

## Track progress

It's a good practice to author your runbooks to be modular in nature, with logic that can be reused and restarted easily. Tracking progress in a runbook ensures that the runbook logic executes correctly if there are issues.

You can track the progress of a runbook by using an external source, such as a storage account, a database, or shared files. Create logic in your runbook to first check the state of the last action taken. Then, based on the results of the check, the logic can either skip or continue specific tasks in the runbook.

## Prevent concurrent jobs

Some runbooks behave strangely if they run across multiple jobs at the same time. In this case, it's important for a runbook to implement logic to determine if there is already a running job. Here's a basic example.

```powershell
# Ensures you do not inherit an AzContext in your runbook
Disable-AzContextAutosave -Scope Process

# Connect to Azure with system-assigned managed identity 
$AzureContext = (Connect-AzAccount -Identity).context

# set and store context 
$AzureContext = Set-AzContext -SubscriptionName $AzureContext.Subscription -DefaultProfile $AzureContext

# Check for already running or new runbooks 
$runbookName = "runbookName" 
$resourceGroupName = "resourceGroupName" 
$automationAccountName = "automationAccountName"

$jobs = Get-AzAutomationJob -ResourceGroupName $resourceGroupName -AutomationAccountName $automationAccountName -RunbookName $runbookName -DefaultProfile $AzureContext

# Ranking all the active jobs
$activeJobs = $jobs | where {$_.status -eq 'Running' -or $_.status -eq 'Queued' -or $_.status -eq 'New' -or $_.status -eq 'Activating' -or $_.status -eq 'Resuming'} | Sort-Object -Property CreationTime 
$jobRanking = @() 
$rank = 0 
ForEach($activeJob in $activeJobs) 
{         
    $rank = $rank + 1 
    $activeJob | Add-Member -MemberType NoteProperty -Name jobRanking -Value $rank -Force 
    $jobRanking += $activeJob 
}
    
$AutomationJobId = $PSPrivateMetadata.JobId.Guid 
$currentJob = $activeJobs | where {$_.JobId -eq $AutomationJobId} 
$currentJobRank = $currentJob.jobRanking 

# Only allow the Job with Rank = 1 to start processing. 
If($currentJobRank -ne "1") 
{ 
    Write-Output "$(Get-Date -Format yyyy-MM-dd-hh-mm-ss.ffff) Concurrency check failed as Current Job Ranking is not 1 but $($currentJobRank) therefore exiting..." 
    Exit 
} Else
{
    Write-Output "$(Get-Date -Format yyyy-MM-dd-hh-mm-ss.ffff) Concurrency check passed. Start processing.." 
} 
```

If you want the runbook to execute with the system-assigned managed identity, leave the code as-is. If you prefer to use a user-assigned managed identity, then:

1. From line 5, remove `$AzureContext = (Connect-AzAccount -Identity).context`,
1. Replace it with `$AzureContext = (Connect-AzAccount -Identity -AccountId <ClientId>).context`, and
1. Enter the Client ID.

## Handle transient errors in a time-dependent script

Your runbooks must be robust and capable of handling [errors](automation-runbook-execution.md#errors), including transient errors that can cause them to restart or fail. If a runbook fails, Azure Automation retries it.

If your runbook normally runs within a time constraint, have the script implement logic to check the execution time. This check ensures the running of operations such as startup, shutdown, or scale-out only during specific times.

> [!NOTE]
> The local time on the Azure sandbox process is set to UTC. Calculations for date and time in your runbooks must take this fact into consideration.

## Retry logic in runbook to avoid transient failures

Runbooks often make calls to remote systems such as Azure via ARM, Azure Resource Graph, SQL services and other web services.
When the system that the runbooks are calling is busy, temporary unavailable or implementing throttling under load, the calls are vulnerable to have runtime errors. To build resiliency in the runbooks, you must implement retry logic when making the calls so that the runbooks can handle a transient problem without failing. 

For more information, refer [Retry pattern](/azure/architecture/patterns/retry) and [General REST and retry guidelines](/azure/architecture/best-practices/retry-service-specific#general-rest-and-retry-guidelines).

### Example 1: If your runbook makes only one or two calls

```powershell
$searchServiceURL = "https://$searchServiceName.search.windows.net"
$resource = Get-AzureRmResource -ResourceType "Microsoft.Search/searchServices" -ResourceGroupName $searchResourceGroupName -ResourceName  $searchServiceName -ApiVersion 2015-08-19
$searchAPIKey = (Invoke-AzureRmResourceAction -Action listAdminKeys -ResourceId $resource.ResourceId -ApiVersion 2015-08-19 -Force).PrimaryKey
```
When you call `Invoke-AzureRmResourceAction`, you may observe transient failures. In such scenario, we recommend that you implement the following basic pattern around the call to the cmdlet.

```powershell
$searchServiceURL = "https://$searchServiceName.search.windows.net"
$resource = Get-AzureRmResource -ResourceType "Microsoft.Search/searchServices" -ResourceGroupName $searchResourceGroupName -ResourceName  $searchServiceName -ApiVersion 2015-08-19

    # Adding in a retry
    $Stoploop = $false
    $Retrycount = 0
 
    do {
        try   {
               $searchAPIKey = (Invoke-AzureRmResourceAction -Action listAdminKeys -ResourceId $resource.ResourceId -ApiVersion 2015-08-19 -Force).PrimaryKey
               write-verbose "Invoke-AzureRmResourceAction on $resource.ResourceId completed"
               $Stoploop = $true
              }
        catch {
               if ($Retrycount -gt 3)
                 {
                  Write-verbose "Could not Invoke-AzureRmResourceAction on $resource.ResourceId after 3 retrys."
                  $Stoploop = $true
                 }
               else  
                 {
                  Write-verbose "Could not Invoke-AzureRmResourceAction on $resource.ResourceId retrying in 30 seconds..."
                  Start-Sleep -Seconds 30
                  $Retrycount = $Retrycount + 1
                 }
               }
        }
    While ($Stoploop -eq $false)
```
>[!NOTE]
>The attempt to retry the call is up to three times, sleeping for 30 seconds each time.

### Example 2 : If the runbook is making frequent remote calls

If the runbook is making frequent remote calls then it could experience transient runtime issues. Create a function that implements the retry logic for each call that is made and pass the call to be made in as a script block to execute.

```powershell
Function ResilientRemoteCall {

         param(
               $scriptblock
               )
        
         $Stoploop = $false
         $Retrycount = 0
 
         do {
             try   {
                    Invoke-Command -scriptblock $scriptblock 
                    write-verbose "Invoked $scriptblock completed"
                    $Stoploop = $true
                   }
             catch {
                    if ($Retrycount -gt 3)
                      {
                       Write-verbose "Invoked $scriptblock failed 3 times and we will not try again."
                       $Stoploop = $true
                      }
                    else  
                      {
                       Write-verbose "Invoked $scriptblock failed  retrying in 30 seconds..."
                       Start-Sleep -Seconds 30
                       $Retrycount = $Retrycount + 1
                      }
                    }
             }
         While ($Stoploop -eq $false)
}
```

You can then pass each remote call into the function as </br>

`ResilientRemoteCall { Get-AzVm }` </br> or </br>

`ResilientRemoteCall { $searchAPIKey = (Invoke-AzureRmResourceAction -Action listAdminKeys -ResourceId $resource.ResourceId -ApiVersion 2015-08-19 -Force).PrimaryKey}`


## Work with multiple subscriptions

Your runbook must be able to work with [subscriptions](automation-runbook-execution.md#subscriptions). For example, to handle multiple subscriptions, the runbook uses the [Disable-AzContextAutosave](/powershell/module/Az.Accounts/Disable-AzContextAutosave) cmdlet. This cmdlet ensures that the authentication context isn't retrieved from another runbook running in the same sandbox. 

```powershell
# Ensures you do not inherit an AzContext in your runbook
Disable-AzContextAutosave -Scope Process

# Connect to Azure with system-assigned managed identity
$AzureContext = (Connect-AzAccount -Identity).context

# set and store context
$AzureContext = Set-AzContext -SubscriptionName $AzureContext.Subscription `
    -DefaultProfile $AzureContext

$childRunbookName = 'childRunbookDemo'
$resourceGroupName = "resourceGroupName"
$automationAccountName = "automationAccountName"

$startParams = @{
    ResourceGroupName     = $resourceGroupName
    AutomationAccountName = $automationAccountName
    Name                  = $childRunbookName
    DefaultProfile        = $AzureContext
}
Start-AzAutomationRunbook @startParams
```

If you want the runbook to execute with the system-assigned managed identity, leave the code as-is. If you prefer to use a user-assigned managed identity, then:

1. From line 5, remove `$AzureContext = (Connect-AzAccount -Identity).context`,
1. Replace it with `$AzureContext = (Connect-AzAccount -Identity -AccountId <ClientId>).context`, and
1. Enter the Client ID.

## Work with a custom script

> [!NOTE]
> You can't normally run custom scripts and runbooks on the host with a Log Analytics agent installed.

To use a custom script:

1. Create an Automation account.
2. Deploy the [Hybrid Runbook Worker](automation-hybrid-runbook-worker.md) role.
3. If on a Linux machine, you need elevated privileges. Sign in to [turn off signature checks](automation-linux-hrw-install.md#turn-off-signature-validation).

## Test a runbook

When you test a runbook, the [Draft version](#publish-a-runbook) is executed and any actions that it performs are completed. No job history is created, but the [output](automation-runbook-output-and-messages.md#use-the-output-stream) and [warning and error](automation-runbook-output-and-messages.md#working-with-message-streams) streams are displayed in the **Test output** pane. Messages to the [verbose stream](automation-runbook-output-and-messages.md#write-output-to-verbose-stream) are displayed in the Output pane only if the [VerbosePreference](automation-runbook-output-and-messages.md#work-with-preference-variables) variable is set to `Continue`.

Even though the Draft version is being run, the runbook still executes normally and performs any actions against resources in the environment. For this reason, you should only test runbooks on non-production resources.

> [!NOTE]
> All runbook execution actions are logged in the **Activity Log** of the automation account with the operation name **Create an Azure Automation job**. However, runbook execution in a test pane where the draft version of the runbook is executed would be logged in the activity logs with the operation name **Write an Azure Automation runbook draft**. Select **Operation** and **JSON** tab to see the scope ending with *../runbooks/(runbook name)/draft/testjob*.

The procedure to test each [type of runbook](automation-runbook-types.md) is the same. There's no difference in testing between the textual editor and the graphical editor in the Azure portal.

1. Open the Draft version of the runbook in either the [textual editor](automation-edit-textual-runbook.md) or the [graphical editor](automation-graphical-authoring-intro.md).
1. Click **Test** to open the **Test** page.
1. If the runbook has parameters, they're listed in the left pane, where you can provide values to be used for the test.
1. If you want to run the test on a [Hybrid Runbook Worker](automation-hybrid-runbook-worker.md), change **Run Settings** to **Hybrid Worker** and select the name of the target group. Otherwise, keep the default **Azure** to run the test in the cloud.
1. Click **Start** to begin the test.
1. You can use the buttons under the **Output** pane to stop or suspend a [PowerShell Workflow](automation-runbook-types.md#powershell-workflow-runbooks) or [graphical](automation-runbook-types.md#graphical-runbooks) runbook while it's being tested. When you suspend the runbook, it completes the current activity before being suspended. Once the runbook is suspended, you can stop it or restart it.
1. Inspect the output from the runbook in the **Output** pane.

## Publish a runbook

When you create or import a new runbook, you have to publish it before you can run it. Each runbook in Azure Automation has a Draft version and a Published version. Only the Published version is available to be run, and only the Draft version can be edited. The Published version is unaffected by any changes to the Draft version. When the Draft version should be made available, you publish it, overwriting the current Published version with the Draft version.

### Publish a runbook in the Azure portal

1. In the Azure portal, search for and select **Automation Accounts**.
1. On the **Automation Accounts** page, select your Automation account from the list.
1. Open the runbook in your Automation account.
1. Click **Edit**.
1. Click **Publish** and then select **Yes** in response to the verification message.

### Publish a runbook using PowerShell

Use the [Publish-AzAutomationRunbook](/powershell/module/Az.Automation/Publish-AzAutomationRunbook) cmdlet to publish your runbook. 

```azurepowershell-interactive
$accountName = "MyAutomationAccount"
$runbookName = "Sample_TestRunbook"
$rgName = "MyResourceGroup"

$publishParams = @{
    AutomationAccountName = $accountName
    ResourceGroupName     = $rgName
    Name                  = $runbookName
}
Publish-AzAutomationRunbook @publishParams
```

## Schedule a runbook in the Azure portal

When your runbook has been published, you can schedule it for operation:

1. In the Azure portal, search for and select **Automation Accounts**.
1. On the **Automation Accounts** page, select your Automation account from the list.
1. Select the runbook from your list of runbooks.
1. Select **Schedules** under **Resources**.
1. Select **Add a schedule**.
1. In the **Schedule Runbook** pane, select **Link a schedule to your runbook**.
1. Choose **Create a new schedule** in the **Schedule** pane.
1. Enter a name, description, and other parameters in the **New schedule** pane.
1. Once the schedule is created, highlight it and click **OK**. It should now be linked to your runbook.
1. Look for an email in your mailbox to notify you of the runbook status.

## Obtain job statuses

### View statuses in the Azure portal

Details of job handling in Azure Automation are provided in [Jobs](automation-runbook-execution.md#jobs). When you are ready to see your runbook jobs, use Azure portal and access your Automation account. On the right, you can see a summary of all the runbook jobs in **Job Statistics**.

![Job Statistics tile](./media/manage-runbooks/automation-account-job-status-summary.png)

The summary displays a count and graphical representation of the job status for each job executed.

Clicking the tile presents the Jobs page, which includes a summarized list of all jobs executed. This page shows the status, runbook name, start time, and completion time for each job.

:::image type="content" source="./media/manage-runbooks/automation-account-jobs-status-blade.png" alt-text="Screenshot of the Jobs page.":::

You can filter the list of jobs by selecting **Filter jobs**. Filter on a specific runbook, job status, or a choice from the dropdown list, and provide the time range for the search.

![Filter job status](./media/manage-runbooks/automation-account-jobs-filter.png)

Alternatively, you can view job summary details for a specific runbook by selecting that runbook from the Runbooks page in your Automation account and then selecting **Jobs**. This action presents the Jobs page. From here, you can click a job record to view its details and output.

:::image type="content" source="./media/manage-runbooks/automation-runbook-job-summary-blade.png" alt-text="Screenshot of the Jobs page with the Errors button highlighted.":::

### Retrieve job statuses using PowerShell

Use the [Get-AzAutomationJob](/powershell/module/Az.Automation/Get-AzAutomationJob) cmdlet to retrieve the jobs created for a runbook and the details of a particular job. If you start a runbook using `Start-AzAutomationRunbook`, it returns the resulting job. Use [Get-AzAutomationJobOutput](/powershell/module/Az.Automation/Get-AzAutomationJobOutput) to retrieve job output.

The following example gets the last job for a sample runbook and displays its status, the values provided for the runbook parameters, and the job output.

```azurepowershell-interactive
$getJobParams = @{
    AutomationAccountName = 'MyAutomationAccount'
    ResourceGroupName     = 'MyResourceGroup'
    Runbookname           = 'Test-Runbook'
}
$job = (Get-AzAutomationJob @getJobParams | Sort-Object LastModifiedDate -Desc)[0]
$job | Select-Object JobId, Status, JobParameters

$getOutputParams = @{
    AutomationAccountName = 'MyAutomationAccount'
    ResourceGroupName     = 'MyResourceGroup'
    Id                    = $job.JobId
    Stream                = 'Output'
}
Get-AzAutomationJobOutput @getOutputParams
```

The following example retrieves the output for a specific job and returns each record. If there's an [exception](automation-runbook-execution.md#exceptions) for one of the records, the script writes the exception instead of the value. This behavior is useful since exceptions can provide additional information that might not be logged normally during output.

```azurepowershell-interactive
$params = @{
    AutomationAccountName = 'MyAutomationAccount'
    ResourceGroupName     = 'MyResourceGroup'
    Stream                = 'Any'
}
$output = Get-AzAutomationJobOutput @params

foreach ($item in $output) {
    $jobOutParams = @{
        AutomationAccountName = 'MyAutomationAccount'
        ResourceGroupName     = 'MyResourceGroup'
        Id                    = $item.StreamRecordId
    }
    $fullRecord = Get-AzAutomationJobOutputRecord @jobOutParams

    if ($fullRecord.Type -eq 'Error') {
        $fullRecord.Value.Exception
    } else {
        $fullRecord.Value
    }
}
```

## Next steps

* For sample queries, see [Sample queries for job logs and job streams](automation-manage-send-joblogs-log-analytics.md#job-streams)
* To learn details of runbook management, see [Runbook execution in Azure Automation](automation-runbook-execution.md).
* To prepare a PowerShell runbook, see [Edit textual runbooks in Azure Automation](automation-edit-textual-runbook.md).
* To troubleshoot issues with runbook execution, see [Troubleshoot runbook issues](troubleshoot/runbooks.md).
