---
title: Create modular runbooks in Azure Automation
description: This article tells how to create a runbook that is called by another runbook.
services: automation
ms.subservice: process-automation
ms.date: 01/17/2019
ms.topic: conceptual
---
# Create modular runbooks

It is a recommended practice in Azure Automation to write reusable, modular runbooks with a discrete function that is called by other runbooks. A parent runbook often calls one or more child runbooks to perform required functionality. 

There are two ways to call a child runbook, and there are distinct differences that you should understand to be able to determine which is best for your scenarios. The following table summarizes the differences between the two ways to call one runbook from another.

|  | Inline | Cmdlet |
|:--- |:--- |:--- |
| Job |Child runbooks run in the same job as the parent. |A separate job is created for the child runbook. |
| Execution |Parent runbook waits for the child runbook to complete before continuing. |Parent runbook continues immediately after child runbook is started *or* parent runbook waits for the child job to finish. |
| Output |Parent runbook can directly get output from child runbook. |Parent runbook must retrieve output from child runbook job *or* parent runbook can directly get output from child runbook. |
| Parameters |Values for the child runbook parameters are specified separately and can use any data type. |Values for the child runbook parameters have to be combined into a single hashtable. This hashtable can only include simple, array, and object data types that use JSON serialization. |
| Automation Account |Parent runbook can only use child runbook in the same Automation account. |Parent runbooks can use a child runbook from any Automation account, from the same Azure subscription, and even from a different subscription to which you have a connection. |
| Publishing |Child runbook must be published before parent runbook is published. |Child runbook is published any time before parent runbook is started. |

## Invoke a child runbook using inline execution

To invoke a runbook inline from another runbook, use the name of the runbook and provide values for its parameters, just like you would use an activity or a cmdlet. All runbooks in the same Automation account are available to all others to be used in this manner. The parent runbook waits for the child runbook to complete before moving to the next line, and any output returns directly to the parent.

When you invoke a runbook inline, it runs in the same job as the parent runbook. There is no indication in the job history of the child runbook. Any exceptions and any stream outputs from the child runbook are associated with the parent. This behavior results in fewer jobs and makes them easier to track and to troubleshoot.

When a runbook is published, any child runbooks that it calls must already be published. The reason is that Azure Automation builds an association with any child runbooks when it compiles a runbook. If the child runbooks have not already been published, the parent runbook appears to publish properly but generates an exception when it is started. If this happens, you can republish the parent runbook to properly reference the child runbooks. You do not need to republish the parent runbook if any child runbook is changed because the association has already been created.

The parameters of a child runbook called inline can be of any data type, including complex objects. There is no [JSON serialization](start-runbooks.md#work-with-runbook-parameters), as there is when you start the runbook using the Azure portal or with the [Start-AzAutomationRunbook](/powershell/module/Az.Automation/Start-AzAutomationRunbook) cmdlet.

### Runbook types

Which runbook types can call each other?

* A [PowerShell runbook](automation-runbook-types.md#powershell-runbooks) and a [graphical runbook](automation-runbook-types.md#graphical-runbooks) can call each other inline, as both are PowerShell-based.
* A [PowerShell Workflow runbook](automation-runbook-types.md#powershell-workflow-runbooks) and a graphical PowerShell Workflow runbook can call each other inline, as both are PowerShell Workflow-based.
* The PowerShell types and the PowerShell Workflow types can't call each other inline, and must use `Start-AzAutomationRunbook`.

When does publish order matter?

The publish order of runbooks only matters for PowerShell Workflow and graphical PowerShell Workflow runbooks.

When your runbook calls a graphical or PowerShell Workflow child runbook using inline execution, it uses the name of the runbook. The name must start with `.\\` to specify that the script is located in the local directory.

### Example

The following example starts a test child runbook that accepts a complex object, an integer value, and a boolean value. The output of the child runbook is assigned to a variable. In this case, the child runbook is a PowerShell Workflow runbook.

```azurepowershell-interactive
$vm = Get-AzVM –ResourceGroupName "LabRG" –Name "MyVM"
$output = PSWF-ChildRunbook –VM $vm –RepeatCount 2 –Restart $true
```

Here is the same example using a PowerShell runbook as the child.

```azurepowershell-interactive
$vm = Get-AzVM –ResourceGroupName "LabRG" –Name "MyVM"
$output = .\PS-ChildRunbook.ps1 –VM $vm –RepeatCount 2 –Restart $true
```

## Start a child runbook using a cmdlet

> [!IMPORTANT]
> If your runbook invokes a child runbook with the `Start-AzAutomationRunbook` cmdlet with the `Wait` parameter and the child runbook produces an object result, the operation might encounter an error. To work around the error, see [Child runbooks with object output](troubleshoot/runbooks.md#child-runbook-object) to learn how to implement the logic to poll for the results using the [Get-AzAutomationJobOutputRecord](/powershell/module/az.automation/get-azautomationjoboutputrecord) cmdlet.

You can use `Start-AzAutomationRunbook` to start a runbook as described in [To start a runbook with Windows PowerShell](start-runbooks.md#start-a-runbook-with-powershell). There are two modes of use for this cmdlet. In one mode, the cmdlet returns the job ID when the job is created for the child runbook. In the other mode, which your script enables by specifying the *Wait* parameter, the cmdlet waits until the child job finishes and returns the output from the child runbook.

The job from a child runbook started with a cmdlet runs separately from the parent runbook job. This behavior results in more jobs than starting the runbook inline, and makes the jobs more difficult to track. The parent can start more than one child runbook asynchronously without waiting for each to complete. For this parallel execution calling the child runbooks inline, the parent runbook must use the [parallel keyword](automation-powershell-workflow.md#use-parallel-processing).

Child runbook output does not return to the parent runbook reliably because of timing. In addition, variables such as `$VerbosePreference`, `$WarningPreference`, and others might not be propagated to the child runbooks. To avoid these issues, you can start the child runbooks as separate Automation jobs using `Start-AzAutomationRunbook` with the `Wait` parameter. This technique blocks the parent runbook until the child runbook is complete.

If you don't want the parent runbook to be blocked on waiting, you can start the child runbook using `Start-AzAutomationRunbook` without the `Wait` parameter. In this case, your runbook must use [Get-AzAutomationJob](/powershell/module/az.automation/get-azautomationjob) to wait for job completion. It must also use [Get-AzAutomationJobOutput](/powershell/module/az.automation/get-azautomationjoboutput) and [Get-AzAutomationJobOutputRecord](/powershell/module/az.automation/get-azautomationjoboutputrecord) to retrieve the results.

Parameters for a child runbook started with a cmdlet are provided as a hashtable, as described in [Runbook parameters](start-runbooks.md#work-with-runbook-parameters). Only simple data types can be used. If the runbook has a parameter with a complex data type, then it must be called inline.

The subscription context might be lost when starting child runbooks as separate jobs. For the child runbook to execute Az module cmdlets against a specific Azure subscription, the child must authenticate to this subscription independently of the parent runbook.

If jobs within the same Automation account work with more than one subscription, selecting a subscription in one job can change the currently selected subscription context for other jobs. To avoid this situation, use `Disable-AzContextAutosave –Scope Process` at the beginning of each runbook. This action only saves the context to that runbook execution.

### Example

The following example starts a child runbook with parameters and then waits for it to complete using the `Start-AzAutomationRunbook` cmdlet with the `Wait` parameter. Once completed, the example collects cmdlet output from the child runbook. To use `Start-AzAutomationRunbook`, the script must authenticate to your Azure subscription.

```azurepowershell-interactive
# Ensure that the runbook does not inherit an AzContext
Disable-AzContextAutosave –Scope Process

# Connect to Azure with Run As account
$ServicePrincipalConnection = Get-AutomationConnection -Name 'AzureRunAsConnection'

Connect-AzAccount `
    -ServicePrincipal `
    -Tenant $ServicePrincipalConnection.TenantId `
    -ApplicationId $ServicePrincipalConnection.ApplicationId `
    -CertificateThumbprint $ServicePrincipalConnection.CertificateThumbprint

$AzureContext = Get-AzSubscription -SubscriptionId $ServicePrincipalConnection.SubscriptionID

$params = @{"VMName"="MyVM";"RepeatCount"=2;"Restart"=$true}

Start-AzAutomationRunbook `
    –AutomationAccountName 'MyAutomationAccount' `
    –Name 'Test-ChildRunbook' `
    -ResourceGroupName 'LabRG' `
    -AzContext $AzureContext `
    –Parameters $params –Wait
```

## Next steps

* To run run your runbook, see [Start a runbook in Azure Automation](start-runbooks.md).
* For monitoring of runbook operation, see [Runbook output and messages in Azure Automation](automation-runbook-output-and-messages.md).