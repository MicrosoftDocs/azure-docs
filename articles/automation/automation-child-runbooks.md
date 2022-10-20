---
title: Create modular runbooks in Azure Automation
description: This article explains how to create a runbook that another runbook calls.
services: automation
ms.subservice: process-automation
ms.date: 10/16/2022
ms.topic: how-to 
ms.custom: devx-track-azurepowershell
#Customer intent: As a developer, I want create modular runbooks so that I can be more efficient.
---

# Create modular runbooks in Automation

It's a good practice in Azure Automation to write reusable, modular runbooks with a discrete function that other runbooks call. A parent runbook often calls one or more child runbooks to perform required functionality. 

There are two ways to call a child runbook: inline or through a cmdlet. The following table summarizes the differences to help you decide which way is better for your scenarios.

|  | Inline | Cmdlet |
|:--- |:--- |:--- |
| **Job** |Child runbooks run in the same job as the parent. |A separate job is created for the child runbook. |
| **Execution** |The parent runbook waits for the child runbook to finish before continuing. |The parent runbook continues immediately after the child runbook is started, *or* the parent runbook waits for the child job to finish. |
| **Output** |The parent runbook can directly get output from the child runbook. |The parent runbook must retrieve output from the child runbook job, *or* the parent runbook can directly get output from the child runbook. |
| **Parameters** |Values for the child runbook parameters are specified separately and can use any data type. |Values for the child runbook parameters have to be combined into a single hashtable. This hashtable can include only simple, array, and object data types that use JSON serialization. |
| **Automation Account** |The parent runbook can use only a child runbook in the same Automation account. |Parent runbooks can use a child runbook from any Automation account, from the same Azure subscription, and even from a different subscription to which you have a connection. |
| **Publishing** |A child runbook must be published before the parent runbook is published. |A child runbook is published anytime before the parent runbook is started. |

## Call a child runbook by using inline execution

To call a runbook inline from another runbook, use the name of the runbook and provide values for its parameters, just like you would use an activity or a cmdlet. All runbooks in the same Automation account are available to all others to be used in this way. The parent runbook waits for the child runbook to finish before moving to the next line, and any output returns directly to the parent.

When you call a runbook inline, it runs in the same job as the parent runbook. There's no indication in the job history of the child runbook. Any exceptions and any stream outputs from the child runbook are associated with the parent. This behavior results in fewer jobs and makes them easier to track and to troubleshoot.

When a runbook is published, any child runbooks that it calls must already be published. The reason is that Azure Automation builds an association with any child runbooks when it compiles a runbook. If the child runbooks haven't already been published, the parent runbook appears to publish properly but generates an exception when it's started. 

If you get an exception, you can republish the parent runbook to properly reference the child runbooks. You don't need to republish the parent runbook if any child runbook is changed because the association has already been created.

The parameters of a child runbook called inline can be of any data type, including complex objects. There's no [JSON serialization](start-runbooks.md#work-with-runbook-parameters), as there is when you start the runbook by using the Azure portal or by using the [Start-AzAutomationRunbook](/powershell/module/Az.Automation/Start-AzAutomationRunbook) cmdlet.

### Runbook types

Currently, PowerShell 5.1 is supported and only certain runbook types can call each other:

* A [PowerShell runbook](automation-runbook-types.md#powershell-runbooks) and a [graphical runbook](automation-runbook-types.md#graphical-runbooks) can call each other inline, because both are PowerShell based.
* A [PowerShell Workflow runbook](automation-runbook-types.md#powershell-workflow-runbooks) and a graphical PowerShell Workflow runbook can call each other inline, because both are PowerShell Workflow based.
* The PowerShell types and the PowerShell Workflow types can't call each other inline. They must use `Start-AzAutomationRunbook`.

> [!IMPORTANT]
> Executing child scripts using `.\child-runbook.ps1` is not supported in PowerShell 7.1 and PowerShell 7.2 (preview). 
  **Workaround**: Use `Start-AutomationRunbook` (internal cmdlet) or `Start-AzAutomationRunbook` (from *Az.Automation* module) to start another runbook from parent runbook.

The publish order of runbooks matters only for PowerShell Workflow and graphical PowerShell Workflow runbooks.

When your runbook calls a graphical or PowerShell Workflow child runbook by using inline execution, it uses the name of the runbook. The name must start with `.\\` to specify that the script is in the local directory.

### Example

The following example starts a test child runbook that accepts a complex object, an integer value, and a Boolean value. The output of the child runbook is assigned to a variable. In this case, the child runbook is a PowerShell Workflow runbook.

```powershell
$vm = Get-AzVM -ResourceGroupName "LabRG" -Name "MyVM"
$output = PSWF-ChildRunbook -VM $vm -RepeatCount 2 -Restart $true
```

Here's the same example but using a PowerShell runbook as the child.

```powershell
$vm = Get-AzVM -ResourceGroupName "LabRG" -Name "MyVM"
$output = .\PS-ChildRunbook.ps1 -VM $vm -RepeatCount 2 -Restart $true
```

## Start a child runbook by using a cmdlet

> [!IMPORTANT]
> If your runbook calls a child runbook by using the `Start-AzAutomationRunbook` cmdlet with the `Wait` parameter and the child runbook produces an object result, the operation might encounter an error. To work around the error, see [Child runbooks with object output](troubleshoot/runbooks.md#child-runbook-object). That article shows you how to implement the logic to poll for the results by using the [Get-AzAutomationJobOutputRecord](/powershell/module/az.automation/get-azautomationjoboutputrecord) cmdlet.

You can use `Start-AzAutomationRunbook` to start a runbook, as described in [Start a runbook with Windows PowerShell](start-runbooks.md#start-a-runbook-with-powershell). There are two modes of use for this cmdlet:

- The cmdlet returns the job ID when the job is created for the child runbook. 
- The cmdlet waits until the child job finishes and returns the output from the child runbook. Your script enables this mode by specifying the `Wait` parameter.

The job from a child runbook started with a cmdlet runs separately from the parent runbook job. This behavior results in more jobs than starting the runbook inline, and makes the jobs more difficult to track. The parent can start more than one child runbook asynchronously without waiting for each to finish. For this parallel execution calling the child runbooks inline, the parent runbook must use the [parallel keyword](automation-powershell-workflow.md#use-parallel-processing).

Child runbook output doesn't return to the parent runbook reliably because of timing. Also, `$VerbosePreference`, `$WarningPreference`, and other variables might not be propagated to the child runbooks. To avoid these problems, you can start the child runbooks as separate Automation jobs by using `Start-AzAutomationRunbook` with the `Wait` parameter. This technique blocks the parent runbook until the child runbook is finished.

If you don't want the parent runbook to be blocked on waiting, you can start the child runbook by using `Start-AzAutomationRunbook` without the `Wait` parameter. In this case, your runbook must use [Get-AzAutomationJob](/powershell/module/az.automation/get-azautomationjob) to wait for job completion. It must also use [Get-AzAutomationJobOutput](/powershell/module/az.automation/get-azautomationjoboutput) and [Get-AzAutomationJobOutputRecord](/powershell/module/az.automation/get-azautomationjoboutputrecord) to retrieve the results.

Parameters for a child runbook started with a cmdlet are provided as a hashtable, as described in [Runbook parameters](start-runbooks.md#work-with-runbook-parameters). You can use only simple data types. If the runbook has a parameter with a complex data type, it must be called inline.

The subscription context might be lost when you're starting child runbooks as separate jobs. For the child runbook to execute Az module cmdlets against a specific Azure subscription, the child must authenticate to this subscription independently of the parent runbook.

If jobs within the same Automation account work with more than one subscription, selecting a subscription in one job can change the currently selected subscription context for other jobs. To avoid this situation, use `Disable-AzContextAutosave -Scope Process` at the beginning of each runbook. This action only saves the context to that runbook execution.

### Example

The following example starts a child runbook with parameters and then waits for it to finish by using the `Start-AzAutomationRunbook` cmdlet with the `Wait` parameter. After the child runbook finishes, the example collects cmdlet output from the child runbook. To use `Start-AzAutomationRunbook`, the script must authenticate to your Azure subscription.

```powershell
# Ensure that the runbook does not inherit an AzContext
Disable-AzContextAutosave -Scope Process

# Connect to Azure with system-assigned managed identity
$AzureContext = (Connect-AzAccount -Identity).context

# set and store context
$AzureContext = Set-AzContext -SubscriptionName $AzureContext.Subscription -DefaultProfile $AzureContext

$params = @{"VMName"="MyVM";"RepeatCount"=2;"Restart"=$true}

Start-AzAutomationRunbook `
    -AutomationAccountName 'MyAutomationAccount' `
    -Name 'Test-ChildRunbook' `
    -ResourceGroupName 'LabRG' `
    -DefaultProfile $AzureContext `
    -Parameters $params -Wait
```

If you want the runbook to execute with the system-assigned managed identity, leave the code as-is. If you prefer to use a user-assigned managed identity, then:
1. From line 5, remove `$AzureContext = (Connect-AzAccount -Identity).context`,
1. Replace it with `$AzureContext = (Connect-AzAccount -Identity -AccountId <ClientId>).context`, and
1. Enter the Client ID.

## Next steps

* To run your runbook, see [Start a runbook in Azure Automation](start-runbooks.md).
* To monitor runbook operation, see [Runbook output and messages in Azure Automation](automation-runbook-output-and-messages.md).
