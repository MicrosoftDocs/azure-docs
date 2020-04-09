---
title: Azure Automation runbook types
description: Describes the different types of runbooks that you can use in Azure Automation and considerations that you should take into account when determining which type to use.
services: automation
ms.subservice: process-automation
ms.date: 03/05/2019
ms.topic: conceptual
---
# Azure Automation runbook types

The Azure Automation process automation service supports several types of runbooks. The types are briefly defined in the following table and described in more detail in the sections below. To learn about the process automation environment, see [Runbook execution in Azure Automation](automation-runbook-execution.md).

| Type | Description |
|:--- |:--- |
| [Graphical](#graphical-runbooks)|Graphical runbook based on Windows PowerShell and created and edited completely in the graphical editor in Azure portal. |
| [Graphical PowerShell Workflow](#graphical-runbooks)|Graphical runbook based on Windows PowerShell Workflow and created and edited completely in the graphical editor in Azure portal. |
| [PowerShell](#powershell-runbooks) |Text runbook based on Windows PowerShell scripting. |
| [PowerShell Workflow](#powershell-workflow-runbooks)|Text runbook based on Windows PowerShell Workflow scripting. |
| [Python](#python-runbooks) |Text runbook based on Python scripting. |

## Graphical runbooks

You can create and edit graphical and graphical PowerShell Workflow runbooks using the graphical editor in the Azure portal. However, you can't create or edit this type of runbook with another tool.

A graphical runbook has the following main features:

* Can be exported to a file in your Automation account and then imported into another Automation account. 
* Generates PowerShell code. 
* Can be converted to or from a graphical PowerShell Workflow runbook during import. 

### Advantages

* Uses visual insert-link-configure authoring model.
* Focuses on how data flows through the process.
* Visually represents management processes.
* Includes other runbooks as child runbooks to create high-level workflows.
* Encourages modular programming.

### Limitations

* Can't be created or edited outside of the Azure portal.
* Might require a code activity containing PowerShell code to execute complex logic.
* Can't be converted to one of the [text formats](automation-runbook-types.md), nor can a text runbook be converted to graphical format. 
* Doesn't allow you to view or directly edit the PowerShell code that the graphical workflow creates. You can view the code you create in any code activities.
* Doesn't run on a Linux Hybrid Runbook Worker. See [Automate resources in your datacenter or cloud by using Hybrid Runbook Worker](automation-hybrid-runbook-worker.md).

## PowerShell runbooks

PowerShell runbooks are based on Windows PowerShell. You directly edit the code of the runbook using the text editor in the Azure portal.  You can also use any offline text editor and [import the runbook](manage-runbooks.md) into Azure Automation.

### Advantages

* Implement all complex logic with PowerShell code without the additional complexities of PowerShell Workflow.
* Runbook starts faster than PowerShell Workflow runbooks since it doesn't need to be compiled before running.
* Can run in Azure or on both Linux and Windows Hybrid Runbook Workers

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
* Can't run on a Linux Hybrid Runbook Worker.

## Python runbooks

Python runbooks compile under Python 2. You can directly edit the code of the runbook using the text editor in the Azure portal, or with an offline text editor and [import the runbook](manage-runbooks.md) into Azure Automation.

### Advantages

* Utilize the robust Python libraries.
* Can run in Azure or on both Linux Hybrid Runbook Workers. Windows Hybrid Runbook Workers are supported with [python2.7](https://www.python.org/downloads/release/latest/python2) installed.

### Limitations

* Must be familiar with Python scripting.
* Only Python 2 is supported at the moment, meaning Python 3 specific functions will fail.
* To use third-party libraries, you must [import the package](python-packages.md) into the Automation account for it to be used.

## Considerations

Take into account the following additional considerations when determining which type to use for a particular runbook.

* You can't convert runbooks from graphical to textual type or the other way around.
* There are limitations using runbooks of different types as a child runbook. For more information, see [Child runbooks in Azure Automation](automation-child-runbooks.md).

## Next steps

* To learn more about Graphical runbook authoring, see [Graphical authoring in Azure Automation](automation-graphical-authoring-intro.md)
* To understand the differences between PowerShell and PowerShell workflows for runbooks, see [Learning Windows PowerShell Workflow](automation-powershell-workflow.md)
* For more information on how to create or import a Runbook, see [Creating or Importing a Runbook](manage-runbooks.md)
* For more information on PowerShell, including language reference and learning modules, refer to the [PowerShell Docs](https://docs.microsoft.com/powershell/scripting/overview).
