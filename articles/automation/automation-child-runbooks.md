---
title: Child runbooks in Azure Automation
description: Describes the different methods for starting a runbook in Azure Automation from another runbook and sharing information between them.
services: automation
ms.service: automation
ms.subservice: process-automation
author: bobbytreed
ms.author: robreed
ms.date: 01/17/2019
ms.topic: conceptual
manager: carmonm
---
# Child runbooks in Azure Automation

It is a recommended practice in Azure Automation to write reusable, modular runbooks with a discrete function that is by other runbooks. A parent runbook often calls one or more child runbooks to perform required functionality. There are two ways to call a child runbook, and each has distinct differences that you should understand so that you can determine which is best for your different scenarios.

## Invoking a child runbook using inline execution

To invoke a runbook inline from another runbook, you use the name of the runbook and provide values for its parameters exactly like you would use an activity or cmdlet.  All runbooks in the same Automation account are available to all others to be used in this manner. The parent runbook will wait for the child runbook to complete before moving to the next line, and any output is returned directly to the parent.

When you invoke a runbook inline, it runs in the same job as the parent runbook. There is no indication in the job history of the child runbook that it ran. Any exceptions and any stream output from the child runbook is associated with the parent. This behavior results in fewer jobs and makes them easier to track and to troubleshoot since any exceptions thrown by the child runbook and any of its stream outputs are associated with the parent job.

When a runbook is published, any child runbooks that it calls must already be published. This is because Azure Automation builds an association with any child runbooks when a runbook is compiled. If they aren’t, the parent runbook appears to publish properly, but will generate an exception when it’s started. If this happens, you can republish the parent runbook to properly reference the child runbooks. You do not need to republish the parent runbook if any of the child runbooks are changed because the association has already been created.

The parameters of a child runbook called inline can be any data type including complex objects. There is no [JSON serialization](start-runbooks.md#runbook-parameters) as there is when you start the runbook using the Azure portal or with the Start-AzureRmAutomationRunbook cmdlet.

### Runbook types

Which types can call each other:

* A [PowerShell runbook](automation-runbook-types.md#powershell-runbooks) and [Graphical runbooks](automation-runbook-types.md#graphical-runbooks) can call each other inline (both are PowerShell based).
* A [PowerShell Workflow runbook](automation-runbook-types.md#powershell-workflow-runbooks) and Graphical PowerShell Workflow runbooks can call each other inline (both are PowerShell Workflow based)
* The PowerShell types and the PowerShell Workflow types can’t call each other inline, and must use Start-AzureRmAutomationRunbook.

When does publish order matter:

* The publish order of runbooks only matters for PowerShell Workflow and Graphical PowerShell Workflow runbooks.

When you call a Graphical or PowerShell Workflow child runbook using inline execution, you use the name of the runbook.  When you call a PowerShell child runbook, you must start its name with *.\\* to specify that the script is located in the local directory.

### Example

The following example starts a test child runbook that accepts three parameters, a complex object, an integer, and a boolean. The output of the child runbook is assigned to a variable.  In this case, the child runbook is a PowerShell Workflow runbook.

```azurepowershell-interactive
$vm = Get-AzureRmVM –ResourceGroupName "LabRG" –Name "MyVM"
$output = PSWF-ChildRunbook –VM $vm –RepeatCount 2 –Restart $true
```

Following is the same example using a PowerShell runbook as the child.

```azurepowershell-interactive
$vm = Get-AzureRmVM –ResourceGroupName "LabRG" –Name "MyVM"
$output = .\PS-ChildRunbook.ps1 –VM $vm –RepeatCount 2 –Restart $true
```

## Starting a child runbook using cmdlet

> [!IMPORTANT]
> If you are invoking a child runbook with the `Start-AzureRmAutomationRunbook` cmdlet with the `-Wait` switch and the results of the child runbook is an object, you may encounter errors. To work around the error, see [Child runbooks with object output](troubleshoot/runbooks.md#child-runbook-object) to learn how to implement the logic to poll for the results and use the [Get-AzureRmAutomationJobOutputRecord](/powershell/module/azurerm.automation/get-azurermautomationjoboutputrecord)

You can use the [Start-AzureRmAutomationRunbook](/powershell/module/AzureRM.Automation/Start-AzureRmAutomationRunbook) cmdlet to start a runbook as described in [To start a runbook with Windows PowerShell](start-runbooks.md#start-a-runbook-with-powershell). There are two modes of use for this cmdlet.  In one mode, the cmdlet returns the job id when the child job is created for the child runbook.  In the other mode, which you enable by specifying the **-wait** parameter, the cmdlet waits until the child job finishes and returns the output from the child runbook.

The job from a child runbook started with a cmdlet runs in a separate job from the parent runbook. This behavior results in more jobs than starting the runbook inline and makes them more difficult to track. The parent can start more than one child runbook asynchronously without waiting for each to complete. For that same kind of parallel execution calling the child runbooks inline, the parent runbook would need to use the [parallel keyword](automation-powershell-workflow.md#parallel-processing).

The output of child runbooks aren't returned to the parent runbook reliably because of timing. Also certain variables like $VerbosePreference, $WarningPreference, and others may not be propagated to the child runbooks. To avoid these issues, you can start the child runbooks as separate Automation jobs using the `Start-AzureRmAutomationRunbook` cmdlet with the `-Wait` switch. This blocks the parent runbook until the child runbook is complete.

If you don’t want the parent runbook to be blocked on waiting, you can start the child runbook using `Start-AzureRmAutomationRunbook` cmdlet without the `-Wait` switch. You would then need to use `Get-AzureRmAutomationJob` to wait for job completion, and `Get-AzureRmAutomationJobOutput` and `Get-AzureRmAutomationJobOutputRecord` to retrieve the results.

Parameters for a child runbook started with a cmdlet are provided as a hashtable as described in [Runbook Parameters](start-runbooks.md#runbook-parameters). Only simple data types can be used. If the runbook has a parameter with a complex data type, then it must be called inline.

The subscription context might be lost when starting child runbooks as separate jobs. In order for the child runbook to execute Azure RM cmdlets against a specific Azure subscription, the child runbook must authenticate to this subscription independently of the parent runbook.

If jobs within the same Automation account work with more than one subscription, selecting a subscription in one job may change the currently selected subscription context for other jobs. To avoid this problem, use `Disable-AzureRmContextAutosave –Scope Processsave` at the beginning of each runbook. This action only saves the context to that runbook execution.

### Example

The following example starts a child runbook with parameters and then waits for it to complete using the Start-AzureRmAutomationRunbook -wait parameter. Once completed, its output is collected from the child runbook. To use `Start-AzureRmAutomationRunbook`, you must authenticate to your Azure subscription.

```azurepowershell-interactive
# Ensures you do not inherit an AzureRMContext in your runbook
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
    -AzureRMContext $AzureContext `
    –Parameters $params –wait
```

## Comparison of methods for calling a child runbook

The following table summarizes the differences between the two methods for calling a runbook from another runbook.

|  | Inline | Cmdlet |
|:--- |:--- |:--- |
| Job |Child runbooks run in the same job as the parent. |A separate job is created for the child runbook. |
| Execution |Parent runbook waits for the child runbook to complete before continuing. |Parent runbook continues immediately after child runbook is started *or* parent runbook waits for the child job to finish. |
| Output |Parent runbook can directly get output from child runbook. |Parent runbook must retrieve output from child runbook job *or* parent runbook can directly get output from child runbook. |
| Parameters |Values for the child runbook parameters are specified separately and can use any data type. |Values for the child runbook parameters have to be combined into a single hashtable. This hashtable can only include simple, array, and object data types that use JSON serialization. |
| Automation Account |Parent runbook can only use child runbook in the same automation account. |Parent runbooks can use a child runbook from any automation account from the same Azure subscription and even a different subscription that you have a connection to. |
| Publishing |Child runbook must be published before parent runbook is published. |Child runbook must be published anytime before parent runbook is started. |

## Next steps

* [Starting a runbook in Azure Automation](start-runbooks.md)
* [Runbook output and messages in Azure Automation](automation-runbook-output-and-messages.md)

