---
title: Troubleshoot errors with Azure Automation Runbooks
description: Learn how to troubleshoot issues with Azure Automation runbooks
services: automation
author: bobbytreed
ms.author: robreed
ms.date: 01/24/2019
ms.topic: conceptual
ms.service: automation
manager: carmonm
---

# Troubleshoot errors with runbooks

## Authentication errors when working with Azure Automation runbooks

### <a name="sign-in-failed"></a>Scenario: Sign in to Azure Account failed

#### Issue

You receive the following error when working with the `Add-AzureAccount` or `Connect-AzureRmAccount` cmdlets.
:

```error
Unknown_user_type: Unknown User Type
```

#### Cause

This error occurs if the credential asset name isn't valid. This error may also occur if the username and password that you used to set up the Automation credential asset aren't valid.

#### Resolution

To determine what's wrong, take the following steps:  

1. Make sure that you don’t have any special characters. These characters include the **\@** character in the Automation credential asset name that you're using to connect to Azure.  
2. Check that you can use the username and password that stored in the Azure Automation credential in your local PowerShell ISE editor. You can do check the username and password are correct by running the following cmdlets in the PowerShell ISE:  

   ```powershell
   $Cred = Get-Credential  
   #Using Azure Service Management
   Add-AzureAccount –Credential $Cred  
   #Using Azure Resource Manager  
   Connect-AzureRmAccount –Credential $Cred
   ```

3. If your authentication fails locally, it means that you haven’t set up your Azure Active Directory credentials properly. Refer to [Authenticating to Azure using Azure Active Directory](https://azure.microsoft.com/blog/azure-automation-authenticating-to-azure-using-azure-active-directory/) blog post to get the Azure Active Directory account set up correctly.  

4. If it looks like a transient error, try adding retry logic to your authentication routine to make authenticating more robust.

   ```powershell
   # Get the connection "AzureRunAsConnection"
   $connectionName = "AzureRunAsConnection"
   $servicePrincipalConnection = Get-AutomationConnection -Name $connectionName

   $logonAttempt = 0
   $logonResult = $False

   while(!($connectionResult) -And ($logonAttempt -le 10))
   {
   $LogonAttempt++
   # Logging in to Azure...
   $connectionResult = Connect-AzureRmAccount `
      -ServicePrincipal `
      -TenantId $servicePrincipalConnection.TenantId `
      -ApplicationId $servicePrincipalConnection.ApplicationId `
      -CertificateThumbprint $servicePrincipalConnection.CertificateThumbprint

   Start-Sleep -Seconds 30
   }
   ```

### <a name="unable-to-find-subscription"></a>Scenario: Unable to find the Azure subscription

#### Issue

You receive the following error when working with the `Select-AzureSubscription` or `Select-AzureRmSubscription` cmdlets:

```error
The subscription named <subscription name> cannot be found.
```

#### Error

This error may occur if:

* The subscription name isn't valid

* The Azure Active Directory user who is trying to get the subscription details isn't configured as an admin of the subscription.

#### Resolution

Take the following steps to determine if you've authenticated to Azure and have access to the subscription you're trying to select:  

1. To make sure it works stand-alone, test your script outside of Azure Automation.
2. Make sure that you run the `Add-AzureAccount` cmdlet before running the `Select-AzureSubscription` cmdlet. 
3. Add `Disable-AzureRmContextAutosave –Scope Process` to the beginning of your runbook. This cmdlet ensures that any credentials apply only to the execution of the current runbook.
4. If you still see this error message, modify your code by adding the **AzureRmContext** parameter following the `Add-AzureAccount` cmdlet and then execute the code.

   ```powershell
   Disable-AzureRmContextAutosave –Scope Process

   $Conn = Get-AutomationConnection -Name AzureRunAsConnection
   Connect-AzureRmAccount -ServicePrincipal -Tenant $Conn.TenantID -ApplicationID $Conn.ApplicationID -CertificateThumbprint $Conn.CertificateThumbprint

   $context = Get-AzureRmContext

   Get-AzureRmVM -ResourceGroupName myResourceGroup -AzureRmContext $context
    ```

### <a name="auth-failed-mfa"></a>Scenario: Authentication to Azure failed because multi-factor authentication is enabled

#### Issue

You receive the following error when authenticating to Azure with your Azure username and password:

```error
Add-AzureAccount: AADSTS50079: Strong authentication enrollment (proof-up) is required
```

#### Cause

If you have multi-factor authentication on your Azure account, you can't use an Azure Active Directory user to authenticate to Azure. Instead, you need to use a certificate or a service principal to authenticate to Azure.

#### Resolution

To use a certificate with the Azure classic deployment model cmdlets, refer to [creating and adding a certificate to manage Azure services.](https://blogs.technet.com/b/orchestrator/archive/2014/04/11/managing-azure-services-with-the-microsoft-azure-automation-preview-service.aspx) To use a service principal with Azure Resource Manager cmdlets, refer to [creating service principal using Azure portal](../../active-directory/develop/howto-create-service-principal-portal.md) and [authenticating a service principal with Azure Resource Manager.](../../active-directory/develop/howto-authenticate-service-principal-powershell.md)

## Common errors when working with runbooks

### <a name="child-runbook-object"></a>Child runbook returns error when the output stream contains objects rather than simple data types

#### Issue

You receive the following error when invoking a child runbook with the `-Wait` switch and the output stream contains and object:

```error
Object reference not set to an instance of an object
```

#### Cause

There is a known issue where the [Start-AzureRmAutomationRunbook](/powershell/module/AzureRM.Automation/Start-AzureRmAutomationRunbook) does not handle the output stream correctly if it contains objects.

#### Resolution

To resolve this it is recommended that you instead implement a polling logic and use the [Get-AzureRmAutomationJobOutput](/powershell/module/azurerm.automation/get-azurermautomationjoboutput) cmdlet to retrieve the output. A sample of this logic is defined in the following example.

```powershell
$automationAccountName = "ContosoAutomationAccount"
$runbookName = "ChildRunbookExample"
$resourceGroupName = "ContosoRG"

function IsJobTerminalState([string] $status) {
    return $status -eq "Completed" -or $status -eq "Failed" -or $status -eq "Stopped" -or $status -eq "Suspended"
}

$job = Start-AzureRmAutomationRunbook -AutomationAccountName $automationAccountName -Name $runbookName -ResourceGroupName $resourceGroupName
$pollingSeconds = 5
$maxTimeout = 10800
$waitTime = 0
while((IsJobTerminalState $job.Status) -eq $false -and $waitTime -lt $maxTimeout) {
   Start-Sleep -Seconds $pollingSeconds
   $waitTime += $pollingSeconds
   $job = $job | Get-AzureRmAutomationJob
}

$jobResults | Get-AzureRmAutomationJobOutput | Get-AzureRmAutomationJobOutputRecord | Select-Object -ExpandProperty Value
```

### <a name="get-serializationsettings"></a>Scenario: You see an error in your job streams about the get_SerializationSettings Method

#### Issue

You see in your error in your job streams for a runbook with the following message:

```error
Connect-AzureRMAccount : Method 'get_SerializationSettings' in type 
'Microsoft.Azure.Management.Internal.Resources.ResourceManagementClient' from assembly 
'Microsoft.Azure.Commands.ResourceManager.Common, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35' 
does not have an implementation.
At line:16 char:1
+ Connect-AzureRMAccount -ServicePrincipal -Tenant $Conn.TenantID -Appl ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (:) [Connect-AzureRmAccount], TypeLoadException
    + FullyQualifiedErrorId : System.TypeLoadException,Microsoft.Azure.Commands.Profile.ConnectAzureRmAccountCommand
```

#### Cause

This error is caused by using both AzureRM and Az cmdlets in a runbook. It occurs when you import `Az` before importing `AzureRM`.

#### Resolution

Az and AzureRM cmdlets can not be imported and used in the same runbook, to learn more about Az support in Azure Automation, see [Az module support in Azure Automation](../az-modules.md).

### <a name="task-was-cancelled"></a>Scenario: The runbook fails with the error: A task was canceled

#### Issue

Your runbook fails with an error similar to the following example:

```error
Exception: A task was canceled.
```

#### Cause

This error can be caused by using outdated Azure modules.

#### Resolution

This error can be resolved by updating your Azure modules to the latest version.

In your Automation Account, click **Modules**, and click **Update Azure modules**. The update takes roughly 15 minutes, once complete rerun the runbook that was failing. To learn more about updating your modules, see [Update Azure modules in Azure Automation](../automation-update-azure-modules.md).

### <a name="runbook-auth-failure"></a>Scenario: Runbooks fail when dealing with multiple subscriptions

#### Issue

When executing runbooks with `Start-AzureRmAutomationRunbook`, the runbook fails to manage Azure resources.

#### Cause

The runbook isn't using the correct context when running.

#### Resolution

When working with multiple subscriptions, the subscription context might be lost when invoking runbooks. To ensure that the subscription context is passed to the runbooks, add the `AzureRmContext` parameter to the cmdlet and pass the context to it. It is also recommended to use the `Disable-AzureRmContextAutosave` cmdlet with the **Process** scope to ensure that the credentials you use are only used for the current runbook.

```azurepowershell-interactive
# Ensures that any credentials apply only to the execution of this runbook
Disable-AzureRmContextAutosave –Scope Process

# Connect to Azure with RunAs account
$ServicePrincipalConnection = Get-AutomationConnection -Name 'AzureRunAsConnection'

Add-AzureRmAccount `
    -ServicePrincipal `
    -TenantId $ServicePrincipalConnection.TenantId `
    -ApplicationId $ServicePrincipalConnection.ApplicationId `
    -CertificateThumbprint $ServicePrincipalConnection.CertificateThumbprint

$AzureContext = Select-AzureRmSubscription -SubscriptionId $ServicePrincipalConnection.SubscriptionID

$params = @{"VMName"="MyVM";"RepeatCount"=2;"Restart"=$true}

Start-AzureRmAutomationRunbook `
    –AutomationAccountName 'MyAutomationAccount' `
    –Name 'Test-ChildRunbook' `
    -ResourceGroupName 'LabRG' `
    -AzureRmContext $AzureContext `
    –Parameters $params –wait
```

### <a name="not-recognized-as-cmdlet"></a>Scenario: The runbook fails because of a missing cmdlet

#### Issue

Your runbook fails with an error similar to the following example:

```error
The term 'Connect-AzureRmAccount' is not recognized as the name of a cmdlet, function, script file, or operable program.  Check the spelling of the name, or if the path was included verify that the path is correct and try again.
```

#### Cause

This error can happen based on one the following reasons:

1. The module containing the cmdlet isn't imported into the automation account
2. The module containing the cmdlet is imported but is out of date

#### Resolution

This error can be resolved by completing one of the following tasks:

If the module is an Azure module, see [How to update Azure PowerShell modules in Azure Automation](../automation-update-azure-modules.md) to learn how to update your modules in your automation account.

If it's a separate module, make sure the module in imported in your Automation Account.

### <a name="job-attempted-3-times"></a>Scenario: The runbook job start was attempted three times, but it failed to start each time

#### Issue

Your runbook fails with the error:

```error
The job was tried three times but it failed
```

#### Cause

This error occurs due to one of the following issues:

1. Memory Limit. The documented limits on how much memory is allocated to a Sandbox is found at [Automation service limits](../../azure-subscription-service-limits.md#automation-limits). A job may fail it if it's using more than 400 MB of memory.

2. Network Sockets. Azure sandboxes are limited to 1000 concurrent network sockets as described at [Automation service limits](../../azure-subscription-service-limits.md#automation-limits).

3. Module Incompatible. This error can occur if module dependencies aren't correct and if they aren't, your runbook typically returns a "Command not found" or "Cannot bind parameter" message.

4. Your runbook attempted to call an executable or subprocess in a runbook that runs in an Azure sandbox. This scenario is not supported in Azure sandboxes.

5. Your runbook attempted to write too much exception data to the output stream.

#### Resolution

Any of the following solutions fix the problem:

* Suggested methods to work within the memory limit are to split the workload between multiple runbooks, not process as much data in memory, not to write unnecessary output from your runbooks, or consider how many checkpoints you write into your PowerShell Workflow runbooks. You can use the clear method, such as `$myVar.clear()` to clear out the variable and use `[GC]::Collect()` to run garbage collection immediately. These actions reduce the memory footprint of your runbook during runtime.

* Update your Azure modules by following the steps [How to update Azure PowerShell modules in Azure Automation](../automation-update-azure-modules.md).  

* Another solution is to run the runbook on a [Hybrid Runbook Worker](../automation-hrw-run-runbooks.md). Hybrid Workers aren't limited by the memory and network limits that Azure sandboxes are.

* If you need to call a process (such as .exe or subprocess.call) in a runbook, you'll need to run the runbook on a [Hybrid Runbook Worker](../automation-hrw-run-runbooks.md).

* There is a 1MB limit on the job output stream. Ensure that you enclose calls to an executable or subprocess in a try/catch block. If they throw an exception, write the message from that exception into an Automation variable. This will prevent it from being written into the job output stream.

### <a name="fails-deserialized-object"></a>Scenario: Runbook fails because of deserialized object

#### Issue

Your runbook fails with the error:

```error
Cannot bind parameter <ParameterName>.

Cannot convert the <ParameterType> value of type Deserialized <ParameterType> to type <ParameterType>.
```

#### Cause

If your runbook is a PowerShell Workflow, it stores complex objects in a deserialized format to persist your runbook state if the workflow is suspended.

#### Resolution

Any of the following three solutions fix this problem:

1. If you're piping complex objects from one cmdlet to another, wrap these cmdlets in an InlineScript.
2. Pass the name or value that you need from the complex object instead of passing the entire object.
3. Use a PowerShell runbook instead of a PowerShell Workflow runbook.

### <a name="runbook-fails"></a>Scenario: My Runbook fails but works when ran locally

#### Issue

Your script fails when ran as a runbook but it works when ran locally.

#### Cause

Your script may fail when running as a runbook for one of the following reasons:

1. Authentication issues
2. Required modules are not imported or out of date.
3. Your script may be prompting for user interaction.
4. Some modules make assumptions about libraries that are present on Windows computers. These libraries may not be present on a sandbox.
5. Some modules rely on a .NET version that is different from the one available on the sandbox.

#### Resolution

Any of the following solutions may fix this problem:

1. Verify you are properly [authenticating to Azure](../manage-runas-account.md).
2. Ensure your [Azure modules are imported and up to date](../automation-update-azure-modules.md).
3. Verify that none of your cmdlets are prompting for information. This behavior is not supported in runbooks.
4. Check whether anything that is part of your module has a dependency on something that isn't included in the module.
5. Azure sandboxes use .NET Framework 4.7.2, if a module uses a higher version it won't work. In this case, you should use a [Hybrid Runbook Worker](../automation-hybrid-runbook-worker.md)

If none of these solutions solve your problemReview the [job logs](../automation-runbook-execution.md#viewing-job-status-from-the-azure-portal) for specific details in to why your runbook may have failed.

### <a name="quota-exceeded"></a>Scenario: Runbook job failed because the allocated quota exceeded

#### Issue

Your runbook job fails with the error:

```error
The quota for the monthly total job run time has been reached for this subscription
```

#### Cause

This error occurs when the job execution exceeds the 500-minute free quota for your account. This quota applies to all types of job execution tasks. Some of these tasks may be testing a job, starting a job from the portal, executing a job by using webhooks, or scheduling a job to execute by using either the Azure portal or in your datacenter. To learn more about pricing for Automation, see [Automation pricing](https://azure.microsoft.com/pricing/details/automation/).

#### Resolution

If you want to use more than 500 minutes of processing per month, you need to change your subscription from the Free tier to the Basic tier. You can upgrade to the Basic tier by taking the following steps:  

1. Sign in to your Azure subscription  
2. Select the Automation account you wish to upgrade  
3. Click **Settings** > **Pricing**.
4. Click **Enable** on page bottom to upgrade your account to the **Basic** tier.

### <a name="cmdlet-not-recognized"></a>Scenario: Cmdlet not recognized when executing a runbook

#### Issue

Your runbook job fails with the error:

```error
<cmdlet name>: The term <cmdlet name> is not recognized as the name of a cmdlet, function, script file, or operable program.
```

#### Cause

This error is caused when the PowerShell engine can't find the cmdlet you're using in your runbook. This error could be because the module containing the cmdlet is missing from the account, there's a name conflict with a runbook name, or the cmdlet also exists in another module and Automation can't resolve the name.

#### Resolution

Any of the following solutions fix the problem:  

* Check that you've entered the cmdlet name correctly.  
* Make sure the cmdlet exists in your Automation account and that there are no conflicts. To verify if the cmdlet is present, open a runbook in edit mode and search for the cmdlet you want to find in the library or run `Get-Command <CommandName>`. Once you've validated that the cmdlet is available to the account, and that there are no name conflicts with other cmdlets or runbooks, add it to the canvas and make sure that you're using a valid parameter set in your runbook.  
* If you do have a name conflict and the cmdlet is available in two different modules, you can resolve this issue by using the fully qualified name for the cmdlet. For example, you can use **ModuleName\CmdletName**.  
* If you're executing the runbook on-premises in a hybrid worker group, then make sure that the module and cmdlet is installed on the machine that hosts the hybrid worker.

### <a name="long-running-runbook"></a>Scenario: A long running runbook fails to complete

#### Issue

Your runbook shows in a **Stopped** state after running for 3 hours. You may also receive the error:

```error
The job was evicted and subsequently reached a Stopped state. The job cannot continue running
```

This behavior is by design in Azure sandboxes because of the "Fair Share" monitoring of processes within Azure Automation. If it executes longer than three hours, Fair Share automatically stops a runbook. The status of a runbook that goes past the fair-share time limit differs by runbook type. PowerShell and Python runbooks are set to a **Stopped** status. PowerShell Workflow runbooks are set to **Failed**.

#### Cause

The runbook ran over the 3 hour limit allowed by fair share in an Azure Sandbox.

#### Resolution

One recommended solution is to run the runbook on a [Hybrid Runbook Worker](../automation-hrw-run-runbooks.md).

Hybrid Workers aren't limited by the [fair share](../automation-runbook-execution.md#fair-share) 3 hour runbook limit that Azure sandboxes are. Runbooks ran on Hybrid Runbook Workers should be developed to support restart behaviors if there are unexpected local infrastructure issues.

Another option is to optimize the runbook by creating [child runbooks](../automation-child-runbooks.md). If your runbook loops through the same function on several resources, such as a database operation on several databases, you can move that function to a child runbook. Each of these child runbooks executes in parallel in separate processes. This behavior decreases the total amount of time for the parent runbook to complete.

The PowerShell cmdlets that enable the child runbook scenario are:

[Start-AzureRMAutomationRunbook](/powershell/module/AzureRM.Automation/Start-AzureRmAutomationRunbook) - This cmdlet allows you to start a runbook and pass parameters to the runbook

[Get-AzureRmAutomationJob](/powershell/module/azurerm.automation/get-azurermautomationjob) - If there are operations that need to be performed after the child runbook completes, this cmdlet allows you to check the job status for each child.

### <a name="expired webhook"></a>Scenario: Status: 400 Bad Request when calling a webhook

#### Issue

When you try invoke a webhook for an Azure Automation runbook, you receive the following error:

```error
400 Bad Request : This webhook has expired or is disabled
```

#### Cause

The webhook that you're trying to call is either disabled or is expired.

#### Resolution

If the webhook is disabled, you can re-enable the webhook through the Azure portal. when a webhook is expired, the webhook needs to be deleted and recreated. You can only [renew a webhook](../automation-webhooks.md#renew-webhook) if it hasn't already expired.

### <a name="429"></a>Scenario: 429: The request rate is currently too large. Please try again

#### Issue

You receive the following error message when running the `Get-AzureRmAutomationJobOutput` cmdlet:

```error
429: The request rate is currently too large. Please try again
```

#### Cause

This error may occur when retrieving job output from a runbook that has many [verbose streams](../automation-runbook-output-and-messages.md#verbose-stream).

#### Resolution

There are two ways to resolve this error:

* Edit the runbook, and reduce the number of job streams that it emits​.
* Reduce the number of streams to be retrieved when running the cmdlet. To follow this behavior, you can specify the `-Stream Output` parameter to the `Get-AzureRmAutomationJobOutput` cmdlet to retrieve only output streams. ​

### <a name="cannot-invoke-method"></a>Scenario: PowerShell job fails with error: Cannot invoke method

#### Issue

You receive the following error message when starting a PowerShell Job in a runbook running in Azure:

```error
Exception was thrown - Cannot invoke method. Method invocation is supported only on core types in this language mode.
```

#### Cause

This error may occur when you start a PowerShell job in a runbook ran in Azure. This behavior may occur because runbooks ran in an Azure sandbox may not run in the [Full language mode](/powershell/module/microsoft.powershell.core/about/about_language_modes)).

#### Resolution

There are two ways to resolve this error:

* Instead of using `Start-Job`, use `Start-AzureRmAutomationRunbook` to start a runbook
* If your runbook has this error message, run it on a Hybrid Runbook Worker

To learn more about this behavior and other behaviors of Azure Automation Runbooks, see [Runbook behavior](../automation-runbook-execution.md#runbook-behavior).

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/)
* Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
* If you need more help, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
