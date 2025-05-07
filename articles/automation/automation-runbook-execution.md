---
title: Runbook execution in Azure Automation
description: This article provides an overview of the processing of runbooks in Azure Automation.
services: automation
ms.subservice: process-automation
ms.date: 09/09/2024
ms.topic: overview
ms.custom:
ms.service: azure-automation
---

# Runbook execution in Azure Automation

Process automation in Azure Automation allows you to create and manage PowerShell, PowerShell Workflow, and graphical runbooks. For details, see [Azure Automation runbooks](automation-runbook-types.md). 

Automation executes your runbooks based on the logic defined inside them. If a runbook is interrupted, it restarts at the beginning. This behavior requires you to write runbooks that support being restarted if transient issues occur.

Starting a runbook in Azure Automation creates a job, which is a single execution instance of the runbook. Each job accesses Azure resources by making a connection to your Azure subscription. The job can only access resources in your datacenter if those resources are accessible from the public cloud.

Azure Automation assigns a worker to run each job during runbook execution. While workers are shared by many Automation accounts, jobs from different Automation accounts are isolated from one another. You can't control which worker services your job requests.

When you view the list of runbooks in the Azure portal, it shows the status of each job that has been started for each runbook. Azure Automation stores job logs for a maximum of 30 days.

The following diagram shows the lifecycle of a runbook job for [PowerShell runbooks](automation-runbook-types.md#powershell-runbooks), [PowerShell Workflow runbooks](automation-runbook-types.md#powershell-workflow-runbooks), and [graphical runbooks](automation-runbook-types.md#graphical-runbooks).

![Job Statuses - PowerShell Workflow](./media/automation-runbook-execution/job-statuses.png)

[!INCLUDE [GDPR-related guidance](~/reusable-content/ce-skilling/azure/includes/gdpr-dsr-and-stp-note.md)]

## Runbook execution environment

Runbooks in Azure Automation can run on either an Azure sandbox or a [Hybrid Runbook Worker](automation-hybrid-runbook-worker.md). 

When runbooks are designed to authenticate and run against resources in Azure, they run in an Azure sandbox. Azure Automation assigns a worker to run each job during runbook execution in the sandbox. While workers are shared by many Automation accounts, jobs from different Automation accounts are isolated from one another.  Jobs using the same sandbox are bound by the resource limitations of the sandbox. The Azure sandbox environment doesn't support interactive operations. It prevents access to all out-of-process COM servers, and it doesn't support making [WMI calls](/windows/win32/wmisdk/wmi-architecture) to the Win32 provider in your runbook.  These scenarios are only supported by running the runbook on a Windows Hybrid Runbook Worker.

You can also use a [Hybrid Runbook Worker](automation-hybrid-runbook-worker.md) to run runbooks directly on the computer that hosts the role and against local resources in the environment. Azure Automation stores and manages runbooks and then delivers them to one or more assigned computers.

Enabling the Azure Firewall on [Azure Storage](../storage/common/storage-network-security.md), [Azure Key Vault](/azure/key-vault/general/network-security), or [Azure SQL](/azure/azure-sql/database/firewall-configure) blocks access from Azure Automation runbooks for those services. Access will be blocked even when the firewall exception to allow trusted Microsoft services is enabled, as Automation isn't a part of the trusted services list. With an enabled firewall, access can only be made by using a Hybrid Runbook Worker and a [virtual network service endpoint](../virtual-network/virtual-network-service-endpoints-overview.md).

>[!NOTE]
>- To run on a Linux Hybrid Runbook Worker, your scripts must be signed and the worker configured accordingly. Alternatively, [signature validation must be turned off](automation-linux-hrw-install.md#turn-off-signature-validation).
>- Runbook execution shouldn't depend on timezone of the sandbox.

The following table lists some runbook execution tasks with the recommended execution environment listed for each.

|Task|Recommendation|Notes|
|---|---|---|
|Integrate with Azure resources|Azure Sandbox|Hosted in Azure, authentication is simpler. If you're using a Hybrid Runbook Worker on an Azure VM, you can [use runbook authentication with managed identities](automation-hrw-run-runbooks.md#runbook-auth-managed-identities).|
|Obtain optimal performance to manage Azure resources|Azure Sandbox|Script is run in the same environment, which has less latency.|
|Minimize operational costs|Azure Sandbox|There's no compute overhead and no need for a VM.|
|Execute long-running script|Hybrid Runbook Worker|Azure sandboxes have [resource limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-automation-limits).|
|Interact with local services|Hybrid Runbook Worker|Directly access the host machine, or resources in other cloud environments or the on-premises environment. |
|Require third-party software and executables|Hybrid Runbook Worker|You manage the operating system and can install software.|
|Monitor a file or folder with a runbook|Hybrid Runbook Worker|Use a [Watcher task](./automation-scenario-using-watcher-task.md) on a Hybrid Runbook Worker.|
|Run a resource-intensive script|Hybrid Runbook Worker| Azure sandboxes have [resource limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-automation-limits).|
|Use modules with specific requirements| Hybrid Runbook Worker|Some examples are:</br> WinSCP - dependency on winscp.exe </br> IIS administration - dependency on enabling or managing IIS|
|Install a module with an installer|Hybrid Runbook Worker|Modules for sandbox must support copying.|
|Use runbooks or modules that require .NET Framework version different from 4.7.2|Hybrid Runbook Worker|Azure sandboxes support .NET Framework 4.7.2, and upgrading to a different version isn't supported.|
|Run scripts that require elevation|Hybrid Runbook Worker|Sandboxes don't allow elevation. With a Hybrid Runbook Worker, you can turn off UAC and use [Invoke-Command](/powershell/module/microsoft.powershell.core/invoke-command) when running the command that requires elevation.|
|Run scripts that require access to Windows Management Instrumentation (WMI)|Hybrid Runbook Worker|Jobs running in sandboxes in the cloud can't access WMI provider. |

## Temporary storage in a sandbox

If you need to create temporary files as part of your runbook logic, you can use the Temp folder (that is, `$env:TEMP`) in the Azure sandbox for runbooks running in Azure. The only limitation is you can't use more than 1 GB of disk space, which is the quota for each sandbox. When working with PowerShell workflows, this scenario can cause a problem because PowerShell workflows use checkpoints and the script could be retried in a different sandbox.

With the hybrid sandbox, you can use `C:\temp` based on the availability of storage on a Hybrid Runbook Worker. However, per Azure VM recommendations, you shouldn't use the [temporary disk](/azure/virtual-machines/managed-disks-overview#temporary-disk) on Windows or Linux for data that needs to be persisted.

## Resources

Your runbooks must include logic to deal with [resources](/rest/api/resources/resources), for example, VMs, the network, and resources on the network. Resources are tied to an Azure subscription, and runbooks require appropriate credentials to access any resource. For an example of handling resources in a runbook, see [Handle resources](manage-runbooks.md#handle-resources).

## Security

Azure Automation uses the [Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction) to provide security for your resources and detect compromise in Linux systems. Security is provided across your workloads, whether resources are in Azure or not. See 
[Introduction to authentication in Azure Automation](automation-security-overview.md).

Defender for Cloud places constraints on users who can run any scripts, either signed or unsigned, on a VM. If you're a user with root access to a VM, you must explicitly configure the machine with a digital signature or turn it off. Otherwise, you can only run a script to apply operating system updates after creating an Automation account and enabling the appropriate feature.

## Subscriptions

An Azure [subscription](/office365/enterprise/subscriptions-licenses-accounts-and-tenants-for-microsoft-cloud-offerings) is an agreement with Microsoft to use one or more cloud-based services, for which you are charged. For Azure Automation, each subscription is linked to an Azure Automation account, and you can [create multiple subscriptions](manage-runbooks.md#work-with-multiple-subscriptions) in the account.

## Credentials

A runbook requires appropriate [credentials](shared-resources/credentials.md) to access any resource, whether for Azure or third-party systems. These credentials are stored in Azure Automation, Key Vault, etc.  

## Azure Monitor

Azure Automation makes use of [Azure Monitor](/azure/azure-monitor/overview) for monitoring its machine operations. The operations require a Log Analytics workspace and a [Log Analytics agent](/azure/azure-monitor/agents/log-analytics-agent).

### Log Analytics agent for Windows

The [Log Analytics agent for Windows](/azure/azure-monitor/agents/agent-windows) works with Azure Monitor to manage Windows VMs and physical computers. The machines can be running either in Azure or in a non-Azure environment, such as a local datacenter.

>[!NOTE]
>The Log Analytics agent for Windows was previously known as the Microsoft Monitoring Agent (MMA).

### Log Analytics agent for Linux

The [Log Analytics agent for Linux](/azure/azure-monitor/agents/agent-linux) works similarly to the agent for Windows, but connects Linux computers to Azure Monitor. The agent is installed with certain service accounts that execute commands requiring root permissions. For more information, see [Service accounts](./automation-hrw-run-runbooks.md#service-accounts).

The Log Analytics agent log is located at `/var/opt/microsoft/omsagent/log/omsagent.log`.

## Runbook permissions

A runbook needs permissions for authentication to Azure, through credentials. See [Azure Automation authentication overview](automation-security-overview.md).

## Modules

Azure Automation includes the following PowerShell modules:

* Orchestrator.AssetManagement.Cmdlets - contains several internal cmdlets that are only available when you execute runbooks in the Azure sandbox environment or on a Windows Hybrid Runbook Worker. These cmdlets are designed to be used instead of Azure PowerShell cmdlets to interact with your Automation account resources.
* Az.Automation - the recommended PowerShell module for interacting with Azure Automation that replaces the AzureRM Automation module. The Az.Automation module is not automatically included when you create an Automation account and you need to import them manually. 
* AzureRM.Automation - installed by default when you create an Automation account. 

Also supported are installable modules, based on the cmdlets that your runbooks and DSC configurations require. For details of the modules that are available for your runbooks and DSC configurations, see [Manage modules in Azure Automation](shared-resources/modules.md).

## Certificates

Azure Automation uses [certificates](shared-resources/certificates.md) for authentication to Azure or adds them to Azure or third-party resources. The certificates are stored securely for access by runbooks and DSC configurations.

Your runbooks can use self-signed certificates, which are not signed by a certificate authority (CA). See [Create a new certificate](shared-resources/certificates.md#create-a-new-certificate).

## Jobs

Azure Automation supports an environment to run jobs from the same Automation account. A single runbook can have many jobs running at one time. The more jobs you run at the same time, the more often they can be dispatched to the same sandbox. A maximum of 10 jobs can run in a sandbox. A sandbox will be removed when no jobs are executing in it; hence, it shouldn't be used to save files.

Jobs running in the same sandbox process can affect each other. One example is running the [Disconnect-AzAccount](/powershell/module/az.accounts/disconnect-azaccount) cmdlet. Execution of this cmdlet disconnects each runbook job in the shared sandbox process. For an example of working with this scenario, see [Prevent concurrent jobs](manage-runbooks.md#prevent-concurrent-jobs).

>[!NOTE]
>PowerShell jobs started from a runbook that runs in an Azure sandbox might not run in the full [PowerShell language mode](/powershell/module/microsoft.powershell.core/about/about_language_modes).

### Job statuses

The following table describes the statuses that are possible for a job. You can view a status summary for all runbook jobs or drill into details of a specific runbook job in the Azure portal. You can also configure integration with your Log Analytics workspace to forward runbook job status and job streams. For more information about integrating with Azure Monitor logs, see [Forward job status and job streams from Automation to Azure Monitor logs](automation-manage-send-joblogs-log-analytics.md). See also [Obtain job statuses](manage-runbooks.md#obtain-job-statuses) for an example of working with statuses in a runbook.

| Status | Description |
|:--- |:--- |
| Activating |The job is being activated. |
| Completed |The job completed successfully. |
| Failed |A graphical or PowerShell Workflow runbook failed to compile. A PowerShell runbook failed to start or the job had an exception. See [Azure Automation runbook types](automation-runbook-types.md).|
| Failed, waiting for resources |The job failed because it reached the [fair share](#fair-share) limit three times and started from the same checkpoint or from the start of the runbook each time. |
| Queued |The job is waiting for resources on an Automation worker to become available so that it can be started. |
| Resuming |The system is resuming the job after it was suspended. |
| Running |The job is running. |
| Running, waiting for resources |The job has been unloaded because it reached the fair share limit. It will resume shortly from its last checkpoint. |
| Starting |The job has been assigned to a worker, and the system is starting it. |
| Stopped |The job was stopped by the user before it was completed. |
| Stopping |The system is stopping the job. |
| Suspended |Applies to [graphical and PowerShell Workflow runbooks](automation-runbook-types.md) only. The job was suspended by the user, by the system, or by a command in the runbook. If a runbook doesn't have a checkpoint, it starts from the beginning. If it has a checkpoint, it can start again and resume from its last checkpoint. The system only suspends the runbook when an exception occurs. By default, the `ErrorActionPreference` variable is set to Continue, indicating that the job keeps running on an error. If the preference variable is set to Stop, the job suspends on an error.  |
| Suspending |Applies to [graphical and PowerShell Workflow runbooks](automation-runbook-types.md) only. The system is trying to suspend the job at the request of the user. The runbook must reach its next checkpoint before it can be suspended. If it has already passed its last checkpoint, it completes before it can be suspended. |
| New | The job has been submitted recently but is not yet activated.|

## Activity logging

Execution of runbooks in Azure Automation writes details in an activity log for the Automation account. For details of using the log, see [Retrieve details from Activity log](manage-runbooks.md#retrieve-details-from-activity-log).

## Exceptions

This section describes some ways to handle exceptions or intermittent issues in your runbooks. An example is a WebSocket exception. Correct exception handling prevents transient network failures from causing your runbooks to fail.

### ErrorActionPreference

The [ErrorActionPreference](/powershell/module/microsoft.powershell.core/about/about_preference_variables#erroractionpreference) variable determines how PowerShell responds to a non-terminating error. Terminating errors always terminate and are not affected by `ErrorActionPreference`.

When the runbook uses `ErrorActionPreference`, a normally non-terminating error such as `PathNotFound` from the [Get-ChildItem](/powershell/module/microsoft.powershell.management/get-childitem) cmdlet stops the runbook from completing. The following example shows the use of `ErrorActionPreference`. The final [Write-Output](/powershell/module/microsoft.powershell.utility/write-output) command never executes, as the script stops.

```powershell-interactive
$ErrorActionPreference = 'Stop'
Get-ChildItem -path nofile.txt
Write-Output "This message will not show"
```

### Try Catch Finally

[Try Catch Finally](/powershell/module/microsoft.powershell.core/about/about_try_catch_finally) is used in PowerShell scripts to handle terminating errors. The script can use this mechanism to catch specific exceptions or general exceptions. The `catch` statement should be used to track or try to handle errors. The following example tries to download a file that doesn't exist. It catches the `System.Net.WebException` exception and returns the last value for any other exception.

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

### Throw

[Throw](/powershell/module/microsoft.powershell.core/about/about_throw) can be used to generate a terminating error. This mechanism can be useful when defining your own logic in a runbook. If the script meets a criterion that should stop it, it can use the `throw` statement to stop. The following example uses this statement to show a required function parameter.

```powershell-interactive
function Get-ContosoFiles
{
  param ($path = $(throw "The Path parameter is required."))
  Get-ChildItem -Path $path\*.txt -recurse
}
```

## Errors

Your runbooks must handle errors. Azure Automation supports two types of PowerShell errors, terminating and non-terminating. 

Terminating errors stop runbook execution when they occur. The runbook stops with a job status of Failed.

Non-terminating errors allow a script to continue even after they occur. An example of a non-terminating error is one that occurs when a runbook uses the `Get-ChildItem` cmdlet with a path that doesn't exist. PowerShell sees that the path doesn't exist, throws an error, and continues to the next folder. The error in this case doesn't set the runbook job status to Failed, and the job might even be completed. To force a runbook to stop on a non-terminating error, you can use `ErrorAction Stop` on the cmdlet.

## Calling processes

Runbooks that run in Azure sandboxes don't support calling processes, such as executables (**.exe** files) or subprocesses. The reason for this is that an Azure sandbox is a shared process run in a container that might not be able to access all the underlying APIs. For scenarios requiring third-party software or calls to subprocesses, you should execute a runbook on a [Hybrid Runbook Worker](automation-hybrid-runbook-worker.md).

## Device and application characteristics

Runbook jobs in Azure sandboxes can't access any device or application characteristics. The most common API used to query performance metrics on Windows is WMI, with some of the common metrics being memory and CPU usage. However, it doesn't matter what API is used, as jobs running in the cloud can't access the Microsoft implementation of Web-Based Enterprise Management (WBEM). This platform is built on the Common Information Model (CIM), providing the industry standards for defining device and application characteristics.

## Webhooks

External services, for example, Azure DevOps Services and GitHub, can start a runbook in Azure Automation. To do this type of startup, the service uses a [webhook](automation-webhooks.md) via a single HTTP request. Use of a webhook allows runbooks to be started without implementation of a full Azure Automation feature.

## <a name="fair-share"></a>Shared resources

To share resources among all runbooks in the cloud, Azure uses a concept called fair share. Using fair share, Azure temporarily unloads or stops any job that has run for more than three hours. Jobs for [PowerShell runbooks](automation-runbook-types.md#powershell-runbooks) and [Python runbooks](automation-runbook-types.md#python-runbooks) are stopped and not restarted, and the job status becomes Stopped.

For long-running Azure Automation tasks, it's recommended to use a [Hybrid Runbook Worker](automation-hybrid-runbook-worker.md). Hybrid Runbook Workers aren't limited by fair share, and don't have a limitation on how long a runbook can execute. The other job [limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-automation-limits) apply to both Azure sandboxes and Hybrid Runbook Workers. While Hybrid Runbook Workers aren't limited by the three-hour fair share limit, you should develop runbooks to run on the workers that support restarts from unexpected local infrastructure issues.

Another option is to optimize a runbook by using child runbooks. For example, your runbook might loop through the same function on several resources, for example, with a database operation on several databases. You can move this function to a [child runbook](automation-child-runbooks.md) and have your runbook call it using [Start-AzAutomationRunbook](/powershell/module/az.automation/start-azautomationrunbook). Child runbooks execute in parallel in separate processes.

Using child runbooks decreases the total amount of time for the parent runbook to complete. Your runbook can use the [Get-AzAutomationJob](/powershell/module/az.automation/get-azautomationjob) cmdlet to check the job status for a child runbook if it still has more operations after the child completes.

## Next steps

* To get started with a PowerShell runbook, see [Tutorial: Create a PowerShell runbook](./learn/powershell-runbook-managed-identity.md).
* To work with runbooks, see [Manage runbooks in Azure Automation](manage-runbooks.md).
* For details of PowerShell, see [PowerShell Docs](/powershell/scripting/overview).
* For a PowerShell cmdlet reference, see [Az.Automation](/powershell/module/az.automation#automation).
