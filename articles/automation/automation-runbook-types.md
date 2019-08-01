---
title: Azure Automation Runbook Types
description: 'Describes the different types of runbooks that you can use in Azure Automation and considerations that you should take into account when determining which type to use. '
services: automation
ms.service: automation
ms.subservice: process-automation
author: bobbytreed
ms.author: robreed
ms.date: 03/05/2019
ms.topic: conceptual
manager: carmonm
---
# Azure Automation runbook types

Azure Automation supports several types of runbooks that are  briefly described in the following table.  The sections below provide further information about each type including considerations on when to use each.

| Type | Description |
|:--- |:--- |
| [Graphical](#graphical-runbooks)|Based on Windows PowerShell and created and edited completely in graphical editor in Azure portal. |
| [Graphical PowerShell Workflow](#graphical-runbooks)|Based on Windows PowerShell Workflow and created and edited completely in the graphical editor in Azure portal. |
| [PowerShell](#powershell-runbooks) |Text runbook based on Windows PowerShell script. |
| [PowerShell Workflow](#powershell-workflow-runbooks)|Text runbook based on Windows PowerShell Workflow. |
| [Python](#python-runbooks) |Text runbook based on Python. |

## Graphical runbooks

[Graphical](automation-runbook-types.md#graphical-runbooks) and Graphical PowerShell Workflow runbooks are created and edited with the graphical editor in the Azure portal.  You can export them to a file and then import them into another automation account. But you can't create or edit them with another tool. Graphical runbooks generate PowerShell code, but you can't directly view or modify the code. Graphical runbooks can't be converted to one of the [text formats](automation-runbook-types.md), nor can a text runbook be converted to graphical format. Graphical runbooks can be converted to Graphical PowerShell Workflow runbooks during import and the other way around.

### Advantages

* Visual insert-link-configure authoring model  
* Focus on how data flows through the process  
* Visually represent management processes  
* Include other runbooks as child runbooks to create high-level workflows  
* Encourages modular programming  

### Limitations

* Can't edit runbook outside of Azure portal.
* May require a Code activity containing PowerShell code to execute complex logic.
* Can't view or directly edit the PowerShell code that is created by the graphical workflow. You can view the code you create in any Code activities.
* Can't be ran on a Linux Hybrid Runbook Worker

## PowerShell runbooks

PowerShell runbooks are based on Windows PowerShell.  You directly edit the code of the runbook using the text editor in the Azure portal.  You can also use any offline text editor and [import the runbook](manage-runbooks.md) into Azure Automation.

### Advantages

* Implement all complex logic with PowerShell code without the additional complexities of PowerShell Workflow.
* Runbook starts faster than PowerShell Workflow runbooks since it doesn't need to be compiled before running.
* Can be ran in Azure or on both Linux and Windows Hybrid Runbook Workers

### Limitations

* Must be familiar with PowerShell scripting.
* Can't use [parallel processing](automation-powershell-workflow.md#parallel-processing) to execute multiple actions in parallel.
* Can't use [checkpoints](automation-powershell-workflow.md#checkpoints) to resume runbook if there is an error.
* PowerShell Workflow runbooks and Graphical runbooks can only be included as child runbooks by using the Start-AzureAutomationRunbook cmdlet, which creates a new job.

### Known Issues

Following are current known issues with PowerShell runbooks.

* PowerShell runbooks cannot retrieve an unencrypted [variable asset](automation-variables.md) with a null value.
* PowerShell runbooks can't retrieve a [variable asset](automation-variables.md) with *~* in the name.
* Get-Process in a loop in a PowerShell runbook may crash after about 80 iterations.
* A PowerShell runbook may fail if it attempts to write a large amount of data to the output stream at once.   You can typically work around this issue by outputting just the information you need when working with large objects.  For example, instead of outputting something like *Get-Process*, you can output just the required fields with *Get-Process | Select ProcessName, CPU*.

## PowerShell Workflow runbooks

PowerShell Workflow runbooks are text runbooks based on [Windows PowerShell Workflow](automation-powershell-workflow.md).  You directly edit the code of the runbook using the text editor in the Azure portal.  You can also use any offline text editor and [import the runbook](manage-runbooks.md) into Azure Automation.

### Advantages

* Implement all complex logic with PowerShell Workflow code.
* Use [checkpoints](automation-powershell-workflow.md#checkpoints) to resume runbook if there is an error.
* Use [parallel processing](automation-powershell-workflow.md#parallel-processing) to perform multiple actions in parallel.
* Can include other Graphical runbooks and PowerShell Workflow runbooks as child runbooks to create high-level workflows.

### Limitations

* Author must be familiar with PowerShell Workflow.
* Runbook must deal with the additional complexity of PowerShell Workflow such as [deserialized objects](automation-powershell-workflow.md#code-changes).
* Runbook takes longer to start than PowerShell runbooks since it needs to be compiled before running.
* PowerShell runbooks can only be included as child runbooks by using the Start-AzureAutomationRunbook cmdlet, which creates a new job.
* Can't be ran on a Linux Hybrid Runbook Worker

## Python runbooks

Python runbooks compile under Python 2.  You can directly edit the code of the runbook using the text editor in the Azure portal, or with an offline text editor and [import the runbook](manage-runbooks.md) into Azure Automation.

### Advantages

* Utilize the robust Python libraries.
* Can be ran in Azure or on both Linux Hybrid Runbook Workers. Windows Hybrid Runbook Workers are supported with [python2.7](https://www.python.org/downloads/release/latest/python2) installed.

### Limitations

* Must be familiar with Python scripting.
* Only Python 2 is supported at the moment, meaning Python 3 specific functions will fail.
* To use third-party libraries, you must [import the package](python-packages.md) into the Automation Account for it to be used.

## Considerations

Take into account the following additional considerations when determining which type to use for a particular runbook.

* You can't convert runbooks from graphical to textual type or the other way around.
* There are limitations using runbooks of different types as a child runbook. For more information, see [Child runbooks in Azure Automation](automation-child-runbooks.md).

## Next steps

* To learn more about Graphical runbook authoring, see [Graphical authoring in Azure Automation](automation-graphical-authoring-intro.md)
* To understand the differences between PowerShell and PowerShell workflows for runbooks, see [Learning Windows PowerShell Workflow](automation-powershell-workflow.md)
* For more information on how to create or import a Runbook, see [Creating or Importing a Runbook](manage-runbooks.md)

