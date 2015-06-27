<properties 
   pageTitle="Aure Automation runbook concepts"
   description="Describes basic concepts that you should understand for creating runbooks in Azure Automation. "
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
   ms.date="04/13/2015"
   ms.author="bwren" />

# Azure Automation runbook concepts

Runbooks in Azure Automation are implemented as Windows PowerShell Workflows. 



This section provides a brief overview of critical features of workflows that are common to Automation runbooks. Complete details on workflows are available in [Getting Started with Windows PowerShell Workflow](http://technet.microsoft.com/library/jj134242.aspx).


## Windows PowerShell Workflows

A workflow is a sequence of programmed, connected steps that perform long-running tasks or require the coordination of multiple steps across multiple devices or managed nodes. The benefits of a workflow over a normal script include the ability to simultaneously perform an action against multiple devices and the ability to automatically recover from failures. A Windows PowerShell Workflow is a Windows PowerShell script that leverages Windows Workflow Foundation. While the workflow is written with Windows PowerShell syntax and launched by Windows PowerShell, it is processed by Windows Workflow Foundation.



### Naming

The name of the workflow should conform to the Verb-Noun format that is standard with Windows PowerShell. You can refer to [Approved Verbs for Windows PowerShell Commands](http://msdn.microsoft.com/library/windows/desktop/ms714428(v=vs.85).aspx) for a list of approved verbs to use. The name of the workflow must match the name of the Automation runbook. If the runbook is being imported, then the filename must match the workflow name and must end in .ps1.

### Limitations

For a complete list of limitations and syntax differences between Windows PowerShell Workflows and Windows PowerShell, see [Syntactic Differences Between Script Workflows and Scripts](http://technet.microsoft.com/library/jj574140.aspx).

## Activities

An activity is a specific task in a workflow. Just as a script is composed of one or more commands, a workflow is composed of one or more activities that are carried out in a sequence. Windows PowerShell Workflow automatically converts many of the Windows PowerShell cmdlets to activities when it runs a workflow. When you specify one of these cmdlets in your runbook, the corresponding activity is actually run by Windows Workflow Foundation. For those cmdlets without a corresponding activity, Windows PowerShell Workflow automatically runs the cmdlet within an [InlineScript](#inlinescript) activity. There is a set of cmdlets that are excluded and cannot be used in a workflow unless you explicitly include them in an InlineScript block. For further details on these concepts, see [Using Activities in Script Workflows](http://technet.microsoft.com/library/jj574194.aspx).

Workflow activities share a set of common parameters to configure their operation. For details about the workflow common parameters, see [about_WorkflowCommonParameters](http://technet.microsoft.com/library/jj129719.aspx).

## Integration modules

An *Integration Module* is a package that contains a Windows PowerShell Module and can be imported into Azure Automation. Cmdlets in integration modules that are imported into Azure Automation are automatically available to all runbooks in the same Automation account. Since Azure Automation is based on Windows PowerShell 4.0, it supports auto loading of modules meaning that cmdlets from installed modules can be used without importing them into the script with [Import-Module](http://technet.microsoft.com/library/hh849725.aspx).

## Parallel processing

NOTE:  We do not recommend running child runbooks in parallel since this has been shown to give unreliable results.  The output from the child runbook sometimes will not show up, and settings in one child runbook can affect the other parallel child runbooks 


## Related articles

- [Creating or Importing a Runbook](http://technet.microsoft.com/library/dn919921.aspx) 