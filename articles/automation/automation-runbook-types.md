<properties 
   pageTitle="Azure Automation Runbook Types"
   description="Describes the difference types of runbooks that you can use in Azure Automation and considerations that you should take into account when determining which type to use. "
   services="automation"
   documentationCenter=""
   authors="bwren"
   manager="stevenka"
   editor="tysonn" />
<tags 
   ms.service="automation"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="09/17/2015"
   ms.author="bwren" />

# Azure Automation runbook types

Azure Automation supports three types of runbooks that are  briefly described in the following table.  The sections below provide further information about each type including considerations on when to use each.


| Type |  Description |
|:---|:---|
| [Graphical](#graphical-runbooks) | Based on Windows PowerShell Workflow and created and edited completely in graphical editor in Azure portal. | 
| [PowerShell Workflow](#powershell-workflow-runbooks) | Text runbook based on Windows PowerShell Workflow. |
| [PowerShell](#powershell-runbooks) | Text runbook based on Windows PowerShell script. |

## Graphical runbooks

[Graphical runbooks](automation-runbook-types.md#graphical-runbooks) are created and edited with the graphical editor in the Azure portal.  You can export them to a file and then import them into another automation account, but you cannot create or edit them with another tool.  Graphical runbooks generate PowerShell Workflow code, but you can't directly view or modify the code. Graphical runbooks cannot be converted to one of the [text formats](automation-runbook-types.md), nor can a text runbook be converted to graphical format.

### Advantages

- Create runbooks with minimal knowledge of [PowerShell Workflow](automation-powershell-workflow.md).
- Visually represent management processes.
- Use [checkpoints](automation-powershell-workflow.md#checkpoints) to resume runbook in case of error.
- Use [parallel processing](automation-powershell-workflow.md#parallel-processing) to perform multiple actions in parallel.
- Other Graphical or PowerShell Workflow runbooks can be included as child runbooks to create high-level workflows.

### Limitations

- Can't edit runbook outside of Azure portal.
- May require a [Workflow Script Control](automation-powershell-workflow.md#activities) containing PowerShell Workflow code to perform some complex logic.
- Runbook takes longer to start than PowerShell runbooks since it needs to be compiled before running.
- PowerShell runbooks can be included only by using the Start-AzureAutomationRunbook cmdlet which creates a new job.

## PowerShell Workflow runbooks

PowerShell Workflow runbooks are text runbooks based on [Windows PowerShell Workflow](automation-powershell-workflow.md).  You directly edit the code of the runbook using the text editor in the Azure portal.  You can also use any offline text editor and [import the runbook](http://msdn.microsoft.com/library/azure/dn643637.aspx) into Azure Automation.

### Advantages

- Implement all complex logic with PowerShell Workflow code.
- Use [checkpoints](automation-powershell-workflow.md#checkpoints) to resume runbook in case of error.
- Use [parallel processing](automation-powershell-workflow.md#parallel-processing) to perform multiple actions in parallel.
- Other PowerShell Workflow or Graphical runbooks can be included as child runbooks to create high-level workflows.

### Limitations

- Author must be familiar with PowerShell Workflow.
- Runbook must deal with the additional complexity of PowerShell Workflow such as [deserialized objects](automation-powershell-workflow.md#code-changes).
- Runbook takes longer to start than PowerShell runbooks since it needs to be compiled before running.
- PowerShell runbooks can be included only by using the Start-AzureAutomationRunbook cmdlet which creates a new job.

## PowerShell runbooks

PowerShell runbooks are based on Windows PowerShell.  You directly edit the code of the runbook using the text editor in the Azure portal.  You can also use any offline text editor and [import the runbook](http://msdn.microsoft.com/library/azure/dn643637.aspx) into Azure Automation.

### Advantages

- Implement all complex logic with PowerShell code without the additional complexities of PowerShell Workflow. 
- Runbook starts faster than Graphical or PowerShell Workflow runbooks since it doesn't need to be compiled before running.

### Limitations

- Must be familiar with PowerShell scripting.
- Can't use [parallel processing](automation-powershell-workflow.md#parallel-processing) to perform multiple actions in parallel.
- Can't use [checkpoints](automation-powershell-workflow.md#checkpoints) to resume runbook in case of error.
- Can't run runbooks on [Hybrid Runbook Worker](automation-hybrid-runbook-worker.md).
- PowerShell Workflow and Graphical runbooks can be included only by using the Start-AzureAutomationRunbook cmdlet which creates a new job.

### Known Issues
Following are current known issues with PowerShell runbooks.

- PowerShell runbooks cannot cannot retrieve an unencrypted [variable asset](automation-variables.md) with a null value.
- PowerShell runbooks cannot retrieve a [variable asset](automation-variables.md) with *~* in the name.
- Get-Process in a loop in a PowerShell runbook may crash after about 80 iterations. 
- A PowerShell runbook may fail if it attempts to write a very large amount of data to the output stream at once.   You can typically work around this issue by outputting just the information you need when working with large objects.  For example, instead of outputting something like *Get-Process*, you can output just the required fields with *Get-Process | Select ProcessName, CPU*.

## Considerations

You should take into account the following additional considerations when determining which type to use for a particular runbook.

- You can't convert runbooks from one type to another.
- There are limitations using runbooks of different types as a child runbook.  See [Child runbooks in Azure Automation](automation-child-runbooks.md) for more information.



  
## Related articles

- [Graphical authoring in Azure Automation](automation-graphical-authoring-intro.md)
- [Learning Windows PowerShell Workflow](automation-powershell-workflow.md)
- [Creating or Importing a Runbook](http://msdn.microsoft.com/library/azure/dn643637.aspx)


