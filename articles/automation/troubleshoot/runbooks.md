---
title: Troubleshoot errors with Azure Automation Runbooks
description: Learn how to troubleshoot and resolve issues you might encounter with Azure Automation runbooks.
services: automation
author: mgoedtel
ms.author: magoedte
ms.date: 01/24/2019
ms.topic: conceptual
ms.service: automation
manager: carmonm
---

# Troubleshoot errors with runbooks

When you have errors executing runbooks in Azure Automation, you can use the following steps to help diagnose the issues.

1. **Ensure that your runbook script executes successfully on your local machine.** 

    Refer to the [PowerShell Docs](/powershell/scripting/overview) or [Python Docs](https://docs.python.org/3/) for language reference and learning modules. Executing your script locally can discover and resolve common errors, such as:

      * Missing modules
      * Syntax errors
      * Logic errors

2. **Investigate runbook [error streams](https://docs.microsoft.com/azure/automation/automation-runbook-output-and-messages#runbook-output).**

    Look at these streams for specific messages and compare them to the errors documented in this article.

3. **Ensure that your nodes and Automation workspace have the required modules.** 

    If your runbook imports any modules, verify that they are available to your Automation account using the steps listed in [Import modules](../shared-resources/modules.md#importing-modules). Update your modules to the latest version by following the instructions at [Update Azure modules in Azure Automation](..//automation-update-azure-modules.md). For more troubleshooting information, see [Troubleshoot modules](shared-resources.md#modules).

4. **Do if your runbook is suspended or unexpectedly fails.**

    * [Check job statuses](https://docs.microsoft.com/azure/automation/automation-runbook-execution#job-statuses) defines runbook statuses and some possible causes.
    * [Add additional output](https://docs.microsoft.com/azure/automation/automation-runbook-output-and-messages#message-streams) to the runbook to identify what happens before the runbook is suspended.
    * [Handle any exceptions](https://docs.microsoft.com/azure/automation/automation-runbook-execution#handling-exceptions) that are thrown by your job.

## <a name="login-azurerm"></a>Scenario: Run Login-AzureRMAccount to log in

### Issue

You receive the following error when executing a runbook:

```error
Run Login-AzureRMAccount to login.
```

### Cause

This error can occur when you are not using a Run As account or the Run As account has expired. See [Manage Azure Automation Run As accounts](https://docs.microsoft.com/azure/automation/manage-runas-account).

This error has two primary causes:

* There are different versions of the AzureRM or Az module.
* You're trying to access resources in a separate subscription.

### Resolution

If you receive this error after updating one AzureRM or Az module, you should update all your modules to the same version.

If you're trying to access resources in another subscription, you can follow the steps below to configure permissions.

1. Go to the Automation Run As account and copy the application ID and thumbprint.
  ![Copy Application ID and Thumbprint](../media/troubleshoot-runbooks/collect-app-id.png)
1. Go to the subscription's Access Control where the Automation account is NOT hosted, and add a new role assignment.
  ![Access control](../media/troubleshoot-runbooks/access-control.png)
1. Add the application ID collected earlier. Select Contributor permissions.
   ![Add role assignment](../media/troubleshoot-runbooks/add-role-assignment.png)
1. Copy the name of the subscription.
1. You can now use the following runbook code to test the permissions from your Automation account to the other subscription. Replace `"\<CertificateThumbprint\>"` with the value you copied in step 1. Replace `"\<SubscriptionName\>"` with the value you copied in step 4.

    ```powershell
    $Conn = Get-AutomationConnection -Name AzureRunAsConnection
    Connect-AzureRmAccount -ServicePrincipal -Tenant $Conn.TenantID -ApplicationId $Conn.ApplicationID -CertificateThumbprint "<CertificateThumbprint>"
    #Select the subscription you want to work with
    Select-AzureRmSubscription -SubscriptionName '<YourSubscriptionNameGoesHere>'

    #Test and get outputs of the subscriptions you granted access.
    $subscriptions = Get-AzureRmSubscription
    foreach($subscription in $subscriptions)
    {
        Set-AzureRmContext $subscription
        Write-Output $subscription.Name
    }
    ```

## <a name="unable-to-find-subscription"></a>Scenario: Unable to find the Azure subscription

### Issue

You receive the following error when working with the `Select-AzureSubscription` or `Select-AzureRmSubscription` cmdlet:

```error
The subscription named <subscription name> cannot be found.
```

### Error

This error can occur if:

* The subscription name isn't valid.
* The Azure Active Directory user who is trying to get the subscription details isn't configured as an administrator of the subscription.

### Resolution

Follow the steps below to determine if you have authenticated to Azure and have access to the subscription that you're trying to select.

1. To make sure that your script works standalone, test it outside of Azure Automation.
2. Make sure that your script runs the `Add-AzureAccount` cmdlet before running the `Select-AzureSubscription` cmdlet.
3. Add `Disable-AzureRmContextAutosave –Scope Process` to the beginning of your runbook. This cmdlet call ensures that any credentials apply only to the execution of the current runbook.
4. If you still see this error message, modify your code by adding the `AzureRmContext` parameter for the `Add-AzureAccount` cmdlet, and then execute the code.

   ```powershell
   Disable-AzureRmContextAutosave –Scope Process

   $Conn = Get-AutomationConnection -Name AzureRunAsConnection
   Connect-AzureRmAccount -ServicePrincipal -Tenant $Conn.TenantID -ApplicationId $Conn.ApplicationID -CertificateThumbprint $Conn.CertificateThumbprint

   $context = Get-AzureRmContext

   Get-AzureRmVM -ResourceGroupName myResourceGroup -AzureRmContext $context
    ```

## <a name="auth-failed-mfa"></a>Scenario: Authentication to Azure failed because multi-factor authentication is enabled

### Issue

You receive the following error when authenticating to Azure with your Azure username and password:

```error
Add-AzureAccount: AADSTS50079: Strong authentication enrollment (proof-up) is required
```

### Cause

If you have multi-factor authentication on your Azure account, you can't use an Azure Active Directory user to authenticate to Azure. Instead, you need to use a certificate or a service principal to authenticate.

### Resolution

To use a certificate with Azure classic deployment model cmdlets, refer to [Creating and adding a certificate to manage Azure services](https://blogs.technet.com/b/orchestrator/archive/2014/04/11/managing-azure-services-with-the-microsoft-azure-automation-preview-service.aspx). To use a service principal with Azure Resource Manager cmdlets, see [Creating service principal using Azure portal](../../active-directory/develop/howto-create-service-principal-portal.md) and [Authenticating a service principal with Azure Resource Manager](../../active-directory/develop/howto-authenticate-service-principal-powershell.md).

## <a name="get-serializationsettings"></a>Scenario: You see an error in your job streams about the get_SerializationSettings method

### Issue

You see the following error in your job streams for a runbook:

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

### Cause

This error is caused by using both AzureRM and Az module cmdlets in a runbook. It occurs when you import the Az module before importing the AzureRM module.

### Resolution

Az and AzureRM cmdlets can't be imported and used in the same runbook. To learn more about Az cmdlets in Azure Automation, see [Az module support in Azure Automation](../az-modules.md).

## <a name="task-was-cancelled"></a>Scenario: The runbook fails with the error: A task was canceled

### Issue

Your runbook fails with an error similar to the following example:

```error
Exception: A task was canceled.
```

### Cause

This error can be caused by using outdated Azure modules.

### Resolution

You can resolve this error by updating your Azure modules to the latest version. 

1. In your Automation account, click **Modules**, then **Update Azure modules**. 
2. The update takes roughly 15 minutes. Once it is complete, rerun the runbook that failed.

To learn more about updating your modules, see [Update Azure modules in Azure Automation](../automation-update-azure-modules.md).

## <a name="runbook-auth-failure"></a>Scenario: Runbooks fail when dealing with multiple subscriptions

### Issue

When executing runbooks, the runbook fails to manage Azure resources.

### Cause

The runbook isn't using the correct context when running.

### Resolution

The subscription context might be lost when a runbook invokes multiple runbooks. To ensure that the subscription context is passed to the runbooks, have the client runbook pass the context to the `Start-AzureRmAutomationRunbook` cmdlet in the `AzureRmContext` parameter. Use the `Disable-AzureRmContextAutosave` cmdlet with the `Scope` parameter set to `Process` to ensure that the specified credentials are only used for the current runbook. For more information, see [Working with multiple subscriptions](../automation-runbook-execution.md#working-with-multiple-subscriptions).

```azurepowershell-interactive
# Ensures that any credentials apply only to the execution of this runbook
Disable-AzureRmContextAutosave –Scope Process

# Connect to Azure with Run As account
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

## <a name="not-recognized-as-cmdlet"></a>Scenario: Term not recognized as the name of a cmdlet, function, script

### Issue

Your runbook fails with an error similar to the following example:

```error
The term 'Connect-AzureRmAccount' is not recognized as the name of a cmdlet, function, script file, or operable program. Check the spelling of the name, or if the path was included verify that the path is correct and try again.
```

### Cause

This error can happen for the following reasons:

* The module containing the cmdlet isn't imported into the Automation account.
* The module containing the cmdlet is imported but is out of date.

### Resolution

Do one of the following tasks to resolve this error. 

* For an Azure module, see [How to update Azure PowerShell modules in Azure Automation](../automation-update-azure-modules.md) to learn how to update your modules in your Automation account.

* For a non-Azure module, make sure that the module in imported into your Automation account.

## <a name="job-attempted-3-times"></a>Scenario: The runbook job start was attempted three times, but failed to start each time

### Issue

Your runbook fails with the following error:

```error
The job was tried three times but it failed
```

### Cause

This error occurs because of one of the following issues:

* Memory Limit. A job might fail if it's using more than 400 MB of memory. The documented limits on memory allocated to a sandbox are found at [Automation service limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#automation-limits). 

* Network Sockets. Azure sandboxes are limited to 1000 concurrent network sockets. See [Automation service limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#automation-limits).

* Module Incompatible. Module dependencies might not be correct. In this case, your runbook typically returns a `Command not found` or `Cannot bind parameter` message.

* No Authentication with Active Directory for sandbox. Your runbook attempted to call an executable or subprocess that runs in an Azure sandbox. Configuring runbooks to authenticate with Azure AD using the Azure Active Directory Authentication Library (ADAL) is not supported.

* Too Much Exception Data. Your runbook attempted to write too much exception data to the output stream.

### Resolution

* Memory Limit, Network Sockets. Suggested ways to work within the memory limits are to split the workload among multiple runbooks, process less data in memory, avoid writing unnecessary output from your runbooks, and consider how many checkpoints are written into your PowerShell workflow runbooks. Use the clear method, such as `$myVar.clear`, to clear out variables and use `[GC]::Collect` to run garbage collection immediately. These actions reduce the memory footprint of your runbook during runtime.

* Module Incompatible. Update your Azure modules by following the steps in [How to update Azure PowerShell modules in Azure Automation](../automation-update-azure-modules.md).

* No Authentication with Active Directory for Sandbox. When authenticating to Azure AD with a runbook, ensure that the Azure AD module is available in your Automation account. Be sure to grant the Run As account the necessary permissions to perform the tasks that the runbook automates.

  If your runbook can't call an executable or subprocess running in an Azure sandbox, use the runbook on a [Hybrid Runbook Worker](../automation-hrw-run-runbooks.md). Hybrid workers aren't limited by the memory and network limits that Azure sandboxes have.

* Too Much Exception Data. There is a 1MB limit on the job output stream. Ensure that your runbook encloses calls to an executable or subprocess using `try` and `catch` blocks. If the operations throw an exception, have the code write the message from the exception into an Automation variable. This technique prevents the message from being written into the job output stream.

## <a name="sign-in-failed"></a>Scenario: Sign-in to Azure account failed

### Issue

You receive one of the following errors when working with the `Add-AzureAccount` or `Connect-AzureRmAccount` cmdlet:

```error
Unknown_user_type: Unknown User Type
```

```error
No certificate was found in the certificate store with thumbprint
```

### Cause

These errors occur if the credential asset name isn't valid. They might also occur if the username and password that you used to set up the Automation credential asset aren't valid.

### Resolution

To determine what's wrong, take the following steps:

1. Make sure that you don't have any special characters. These characters include the `\@` character in the Automation credential asset name that you're using to connect to Azure.
2. Check to see if you can use the username and password that are stored in the Azure Automation credential in your local PowerShell ISE editor. Run the following cmdlets in the PowerShell ISE.

   ```powershell
   $Cred = Get-Credential
   #Using Azure Service Management
   Add-AzureAccount –Credential $Cred
   #Using Azure Resource Manager
   Connect-AzureRmAccount –Credential $Cred
   ```

3. If your authentication fails locally, you haven't set up your Azure Active Directory credentials properly. Refer to the [Authenticating to Azure using Azure Active Directory](https://azure.microsoft.com/blog/azure-automation-authenticating-to-azure-using-azure-active-directory/) blog post to get the Azure Active Directory account set up correctly.

4. If the error appears to be transient, try adding retry logic to your authentication routine to make authenticating more robust.

   ```powershell
   # Get the connection "AzureRunAsConnection"
   $connectionName = "AzureRunAsConnection"
   $servicePrincipalConnection = Get-AutomationConnection -Name $connectionName

   $logonAttempt = 0
   $logonResult = $False

   while(!($connectionResult) -And ($logonAttempt -le 10))
   {
       $LogonAttempt++
       #Logging in to Azure...
       $connectionResult = Connect-AzureRmAccount `
                              -ServicePrincipal `
                              -TenantId $servicePrincipalConnection.TenantId `
                              -ApplicationId $servicePrincipalConnection.ApplicationId `
                              -CertificateThumbprint $servicePrincipalConnection.CertificateThumbprint

       Start-Sleep -Seconds 30
   }
   ```

## <a name="child-runbook-object"></a>Scenario: Object reference not set to an instance of an object

### Issue

You receive the following error when invoking a child runbook with the `Wait` parameter and the Output stream contains an object:

```error
Object reference not set to an instance of an object
```

### Cause

`Start-AzureRmAutomationRunbook` does not handle the Output stream correctly if the stream contains objects.

### Resolution

It is recommended to implement a polling logic and use the [Get-AzureRmAutomationJobOutput](/powershell/module/azurerm.automation/get-azurermautomationjoboutput) cmdlet to retrieve the output. A sample of this logic is defined below.

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

## <a name="fails-deserialized-object"></a>Scenario: Runbook fails because of deserialized object

### Issue

Your runbook fails with the error:

```error
Cannot bind parameter <ParameterName>.

Cannot convert the <ParameterType> value of type Deserialized <ParameterType> to type <ParameterType>.
```

### Cause

If your runbook is a PowerShell Workflow, it stores complex objects in a deserialized format to persist your runbook state if the workflow is suspended.

### Resolution

Use any of the following solutions to fix this problem.

* If you're piping complex objects from one cmdlet to another, wrap these cmdlets in an `InlineScript` activity.
* Pass the name or value that you need from the complex object instead of passing the entire object.
* Use a PowerShell runbook instead of a PowerShell Workflow runbook.

## <a name="quota-exceeded"></a>Scenario: Runbook job fails because allocated quota exceeded

### Issue

Your runbook job fails with the error:

```error
The quota for the monthly total job run time has been reached for this subscription
```

### Cause

This error occurs when the job execution exceeds the 500-minute free quota for your account. This quota applies to all types of job execution tasks. Some of these tasks are testing a job, starting a job from the portal, executing a job by using webhooks, or scheduling a job to execute using either the Azure portal or your datacenter. To learn more about pricing for Automation, see [Automation pricing](https://azure.microsoft.com/pricing/details/automation/).

### Resolution

If you want to use more than 500 minutes of processing per month, change your subscription from the Free tier to the Basic tier.

1. Sign in to your Azure subscription.
2. Select the Automation account to upgrade.
3. Click **Settings**, then **Pricing**.
4. Click **Enable** on the page bottom to upgrade your account to the Basic tier.

## <a name="cmdlet-not-recognized"></a>Scenario: Cmdlet not recognized when executing a runbook

### Issue

Your runbook job fails with the error:

```error
<cmdlet name>: The term <cmdlet name> is not recognized as the name of a cmdlet, function, script file, or operable program.
```

### Cause

This error is caused when the PowerShell engine can't find the cmdlet you're using in your runbook. It's possible that the module containing the cmdlet is missing from the account, there's a name conflict with a runbook name, or the cmdlet also exists in another module and Automation can't resolve the name.

### Resolution

Use any of the following solutions to fix the problem.

* Make sure that you've entered the cmdlet name correctly.
* Ensure that the cmdlet exists in your Automation account and that there are no conflicts. To verify if the cmdlet is present, open a runbook in edit mode and search for the cmdlet you want to find in the library, or run `Get-Command <CommandName>`. Once you've validated that the cmdlet is available to the account, and that there are no name conflicts with other cmdlets or runbooks, add the cmdlet to the canvas and make sure that you're using a valid parameter set in your runbook.
* If you do have a name conflict and the cmdlet is available in two different modules, resolve the issue by using the fully qualified name for the cmdlet. For example, you can use `ModuleName\CmdletName`.
* If you're executing the runbook on-premises in a hybrid worker group, ensure that the module and cmdlet are installed on the machine that hosts the hybrid worker.

## <a name="long-running-runbook"></a>Scenario: A long-running runbook fails to complete

### Issue

Your runbook shows in a Stopped state after running for 3 hours. You might also receive this error:

```error
The job was evicted and subsequently reached a Stopped state. The job cannot continue running.
```

This behavior is by design in Azure sandboxes because of the [fair share](../automation-runbook-execution.md#fair-share) monitoring of processes within Azure Automation. If a process executes longer than three hours, fair share automatically stops a runbook. The status of a runbook that goes past the fair share time limit differs by runbook type. PowerShell and Python runbooks are set to a Stopped status. PowerShell Workflow runbooks are set to Failed.

### Cause

The runbook ran over the 3-hour limit allowed by fair share in an Azure sandbox.

### Resolution

One recommended solution is to run the runbook on a [Hybrid Runbook Worker](../automation-hrw-run-runbooks.md). Hybrid Workers aren't limited by the 3-hour fair share runbook limit that Azure sandboxes have. Runbooks run on Hybrid Runbook Workers should be developed to support restart behaviors if there are unexpected local infrastructure issues.

Another solution is to optimize the runbook by creating [child runbooks](../automation-child-runbooks.md). If your runbook loops through the same function on several resources, for example, in a database operation on several databases, you can move the function to a child runbook. Each child runbook executes in parallel in a separate process. This behavior decreases the total amount of time for the parent runbook to complete.

The PowerShell cmdlets that enable the child runbook scenario are:

* [Start-AzureRMAutomationRunbook](/powershell/module/AzureRM.Automation/Start-AzureRmAutomationRunbook). This cmdlet allows you to start a runbook and pass parameters to the runbook.

* [Get-AzureRmAutomationJob](/powershell/module/azurerm.automation/get-azurermautomationjob). If there are operations that need to be performed after the child runbook completes, this cmdlet allows you to check the job status for each child.

## <a name="expired webhook"></a>Scenario: Status: 400 Bad Request when calling a webhook

### Issue

When you try to invoke a webhook for an Azure Automation runbook, you receive the following error:

```error
400 Bad Request : This webhook has expired or is disabled
```

### Cause

The webhook that you're trying to call is either disabled or is expired.

### Resolution

If the webhook is disabled, you can re-enable the webhook through the Azure portal. If the webhook has expired, you must delete and then recreate it. You can only [renew a webhook](../automation-webhooks.md#renew-webhook) if it hasn't already expired.

## <a name="429"></a>Scenario: 429: The request rate is currently too large...

### Issue

You receive the following error message when running the `Get-AzureRmAutomationJobOutput` cmdlet:

```error
429: The request rate is currently too large. Please try again
```

### Cause

This error can occur when retrieving job output from a runbook that has many [Verbose streams](../automation-runbook-output-and-messages.md#verbose-stream).

### Resolution

Do one of the following to resolve this error.

* Edit the runbook, and reduce the number of job streams that it emits​.

* Reduce the number of streams to be retrieved when running the cmdlet. To do this, you can set the value of the `Stream` parameter for the `Get-AzureRmAutomationJobOutput` cmdlet to retrieve only Output streams. ​

## <a name="cannot-invoke-method"></a>Scenario: PowerShell job fails with error: Cannot invoke method

### Issue

You receive the following error message when starting a PowerShell job in a runbook running in Azure:

```error
Exception was thrown - Cannot invoke method. Method invocation is supported only on core types in this language mode.
```

### Cause

This error might indicate that runbooks executing in an Azure sandbox can't run in the [Full language mode](/powershell/module/microsoft.powershell.core/about/about_language_modes).

### Resolution

There are two ways to resolve this error.

* Instead of using `Start-Job`, use `Start-AzureRmAutomationRunbook` to start the runbook.
* Try running the runbook on a Hybrid Runbook Worker.

To learn more about this behavior and other behaviors of Azure Automation runbooks, see [Runbook behavior](../automation-runbook-execution.md#runbook-behavior).

## Scenario: Linux Hybrid Runbook Worker receives a prompt for a password when signing a runbook

### Issue

Running the `sudo` command for a Linux Hybrid Runbook Worker retrieves an unexpected prompt for a password.

### Cause

The **nxautomationuser** account for the Log Analytics agent for Linux is not correctly configured in the **sudoers** file. The Hybrid Runbook Worker needs the appropriate configuration of account permissions and other data so that it can sign runbooks on the Linux Runbook Worker.

### Resolution

* Ensure that the Hybrid Runbook Worker has the GnuPG (GPG) executable on the machine.

* Verify the configuration of the **nxautomationuser** account in the **sudoers** file. See [Running runbooks on a Hybrid Runbook Worker](../automation-hrw-run-runbooks.md)

## Scenario: Cmdlet failing in PnP PowerShell runbook on Azure Automation

### Issue

When a runbook writes a PnP PowerShell-generated object to the Azure Automation output directly, cmdlet output can't stream back to Automation.

### Cause

This issue most commonly occurs when Azure Automation processes runbooks that invoke PnP PowerShell cmdlets, for example, `add-pnplistitem`, without catching the return objects.

### Resolution

Edit your scripts to assign any return values to variables so that the cmdlets do not attempt to write whole objects to the standard output. A script can redirect the output stream to a cmdlet as shown below.

```azurecli
  $null = add-pnplistitem
```

If your script parses cmdlet output, the script must store the output in a variable and manipulate the variable instead of simply streaming the output.

```azurecli
$SomeVariable = add-pnplistitem ....
if ($SomeVariable.someproperty -eq ....
```

## <a name="other"></a>My problem isn't listed above

The sections below list other common errors and provide supporting documentation to help you resolve your issue.

### Hybrid runbook worker doesn't run jobs or isn't responding

If you are running jobs on a Hybrid Runbook Worker instead of in Azure Automation, you might need to [troubleshoot the hybrid worker itself](https://docs.microsoft.com/azure/automation/troubleshoot/hybrid-runbook-worker).

### Runbook fails with No permission or some variation

Run As accounts might not have the same permissions against Azure resources as your current account. Ensure that your Run As account has [permissions to access any resources](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal) used in your script.

### Issues passing parameters into webhooks

For help with passing parameters into webhooks, see [Start a runbook from a webhook](../automation-webhooks.md#parameters-used-when-the-webhook-starts-a-runbook).

### Issues using Az modules

Using Az modules and AzureRM modules in the same Automation account is not supported. See [Az modules in runbooks](https://docs.microsoft.com/azure/automation/az-modules) for more details.

### Inconsistent behavior in runbooks

Follow the guidance in [Runbook execution](https://docs.microsoft.com/azure/automation/automation-runbook-execution#runbook-behavior) to avoid issues with concurrent jobs, resources being created multiple times, or other timing-sensitive logic in runbooks.

### Runbook fails with the error No permission, Forbidden (403), or some variation

Run As accounts might not have the same permissions against Azure resources as your current account. Ensure that your Run As account has [permissions to access any resources](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal) used in your script.

### Runbooks were working, but suddenly stopped

* Ensure that the Run As account has not expired. See [certification renewal](https://docs.microsoft.com/azure/automation/manage-runas-account#cert-renewal).
* If you're using a [webhook](https://docs.microsoft.com/azure/automation/automation-webhooks#renew-webhook) to start a runbook, ensure that webhook has not expired.

### Passing parameters into webhooks

For help with passing parameters into webhooks, see [Start a runbook from a webhook](https://docs.microsoft.com/azure/automation/automation-webhooks#parameters-used-when-the-webhook-starts-a-runbook).

### Using Az modules

Using Az modules and AzureRM modules in the same Automation account is not supported. See [Az modules in runbooks](https://docs.microsoft.com/azure/automation/az-modules).

### Using self-signed certificates

To use self-signed certificates, see [Creating a new certificate](https://docs.microsoft.com/azure/automation/shared-resources/certificates#creating-a-new-certificate).

### Access denied when using Azure sandbox for a runbook

The Azure sandbox prevents access to all out-of-process COM servers. For example, a sandboxed application or runbook can't call into Windows Management Instrumentation (WMI), or into the Windows Installer service (msiserver.exe). For details about the use of the sandbox, see [Runbook execution in Azure Automation](https://docs.microsoft.com/azure/automation/automation-runbook-execution).

## Recommended Documents

* [Starting a runbook in Azure Automation](https://docs.microsoft.com/azure/automation/automation-starting-a-runbook)
* [Runbook execution in Azure Automation](https://docs.microsoft.com/azure/automation/automation-runbook-execution)

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/).
* Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
* If you need more help, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
