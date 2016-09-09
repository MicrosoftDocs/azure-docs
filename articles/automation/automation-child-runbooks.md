<properties 
   pageTitle="Child runbooks in Azure Automation | Microsoft Azure"
   description="Describes the different methods for starting a runbook in Azure Automation from another runbook and sharing information between them."
   services="automation"
   documentationCenter=""
   authors="mgoedtel"
   manager="jwhit"
   editor="tysonn" />
<tags 
   ms.service="automation"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="05/31/2016"
   ms.author="magoedte;bwren" />

# Child runbooks in Azure Automation


It is a best practice in Azure Automation to write reusable, modular runbooks with a discrete function that can be used by other runbooks. A parent runbook will often call one or more child runbooks to perform required functionality. There are two ways to call a child runbook, and each has distinct differences that you should understand so that you can determine which will be best for your different scenarios.

##  Invoking a child runbook using inline execution

To invoke a runbook inline from another runbook, you use the name of the runbook and provide values for its parameters exactly like you would use an activity or cmdlet.  All runbooks in the same Automation account are available to all others to be used in this manner. The parent runbook will wait for the child runbook to complete before moving to the next line, and any output is returned directly to the parent.

When you invoke a runbook inline, it runs in the same job as the parent runbook. There will be no indication in the job history of the child runbook that it ran. Any exceptions and any stream output from the child runbook will be associated with the parent. This results in fewer jobs and makes them easier to track and to troubleshoot since any exceptions thrown by the child runbook and any of its stream output are associated with the parent job.

When a runbook is published, any child runbooks that it calls must already be published. This is because Azure Automation builds an association with any child runbooks when a runbook is compiled. If they aren’t, the parent runbook will appear to publish properly, but will generate an exception when it’s started. If this happens, you can republish the parent runbook in order to properly reference the child runbooks. You do not need to republish the parent runbook if any of the child runbooks are changed because the association will have already been created.

The parameters of a child runbook called inline can be any data type including complex objects, and there is no [JSON serialization](automation-starting-a-runbook.md#runbook-parameters) as there is when you start the runbook using the Azure Management Portal or with the Start-AzureRmAutomationRunbook cmdlet.


### Runbook types

Which types can call each other:

- A [PowerShell runbook](automation-runbook-types.md#powershell-runbooks)and [Graphical runbooks](automation-runbook-types.md#graphical-runbooks) can call each other inline (both are PowerShell based).
- A [PowerShell Workflow runbook](automation-runbook-types.md#powershell-workflow-runbooks) and Graphical PowerShell Workflow runbooks can call each other inline (both are PowerShell Workflow based)
- The PowerShell types and the PowerShell Workflow types can’t call each other inline, and must use Start-AzureRmAutomationRunbook.
	
When does publish order matter:

- The publish order of runbooks only matters for PowerShell Workflow and Graphical PowerShell Workflow runbooks.


When you call a Graphical or PowerShell Workflow child runbook using inline execution, you just use the name of the runbook.  When you call a PowerShell child runbook, you must preceded its name with *.\\* to specify that the script is located in the local directory. 

### Example

The following example invokes a test child runbook that accepts three parameters, a complex object, an integer, and a boolean. The output of the child runbook is assigned to a variable.  In this case, the child runbook is a PowerShell Workflow runbook

	$vm = Get-AzureRmVM –ResourceGroupName "LabRG" –Name "MyVM"
    $output = PSWF-ChildRunbook –VM $vm –RepeatCount 2 –Restart $true

Following is the same example using a PowerShell runbook as the child.

	$vm = Get-AzureRmVM –ResourceGroupName "LabRG" –Name "MyVM"
    $output = .\PS-ChildRunbook –VM $vm –RepeatCount 2 –Restart $true



##  Starting a child runbook using cmdlet

You can use the [Start-AzureRmAutomationRunbook](https://msdn.microsoft.com/library/mt603661.aspx) cmdlet to start a runbook as described in [To start a runbook with Windows PowerShell](../automation-starting-a-runbook.md#starting-a-runbook-with-windows-powershell). There are two modes of use for this cmdlet.  In one mode, the cmdlet returns the job id as soon as the child job is created for the child runbook.  In the other mode, which you enable by specifying the **-wait** parameter, the cmdlet will wait until the child job finishes and will return the output from the child runbook.

The job from a child runbook started with a cmdlet will run in a separate job from the parent runbook. This results in more jobs than invoking the runbook inline and makes them more difficult to track. The parent can start multiple child runbooks asynchronously without waiting for each to complete. For that same kind of parallel execution calling the child runbooks inline, the parent runbook would need to use the [parallel keyword](automation-powershell-workflow.md#parallel-processing).

Parameters for a child runbook started with a cmdlet are provided as a hashtable as described in [Runbook Parameters](automation-starting-a-runbook.md#runbook-parameters). Only simple data types can be used. If the runbook has a parameter with a complex data type, then it must be called inline.

### Example

The following example starts a child runbook with parameters and then waits for it to complete using the Start-AzureRmAutomationRunbook -wait parameter. Once completed, its output is collected from the child runbook.

	$params = @{"VMName"="MyVM";"RepeatCount"=2;"Restart"=$true} 
    $joboutput = Start-AzureRmAutomationRunbook –AutomationAccountName "MyAutomationAccount" –Name "Test-ChildRunbook" -ResouceGroupName "LabRG" –Parameters $params –wait


## Comparison of methods for calling a child runbook

The following table summarizes the differences between the two methods for calling a runbook from another runbook.

| | Inline| Cmdlet|
|:---|:---|:---|
|Job|Child runbooks run in the same job as the parent.|A separate job is created for the child runbook.|
|Execution|Parent runbook waits for the child runbook to complete before continuing.|Parent runbook continues immediately after child runbook is started *or* parent runbook waits for the child job to finish.|
|Output|Parent runbook can directly get output from child runbook.|Parent runbook must retrieve output from child runbook job *or* parent runbook can directly get output from child runbook.|
|Parameters|Values for the child runbook parameters are specified separately and can use any data type.|Values for the child runbook parameters must be combined into a single hashtable and can only include simple, array, and object data types that leverage JSON serialization.|
|Automation Account|Parent runbook can only use child runbook in the same automation account.|Parent runbook can use child runbook from any automation account from the same Azure subscription and even a different subscription if you have a connection to it.|
|Publishing|Child runbook must be published before parent runbook is published.|Child runbook must be published any time before parent runbook is started.|

## Next Steps

- [Starting a runbook in Azure Automation](automation-starting-a-runbook.md)
- [Runbook output and messages in Azure Automation](automation-runbook-output-and-messages.md)
