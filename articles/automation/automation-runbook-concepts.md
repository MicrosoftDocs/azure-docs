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

## Types of runbook

There are two types of runbook in Azure Automation, *textual* and *graphical*.  Textual runbooks are for users who prefer to work directly with the PowerShell workflow code either using the textual editor in Azure Automation or an offline editor such as 


### Textual runbooks

### Graphical runbooks

Runbooks in Azure Automation are implemented as Windows PowerShell Workflows. 




### Naming

The name of the workflow should conform to the Verb-Noun format that is standard with Windows PowerShell. You can refer to [Approved Verbs for Windows PowerShell Commands](http://msdn.microsoft.com/library/windows/desktop/ms714428(v=vs.85).aspx) for a list of approved verbs to use. The name of the workflow must match the name of the Automation runbook. If the runbook is being imported, then the filename must match the workflow name and must end in .ps1.

### Limitations

For a complete list of limitations and syntax differences between Windows PowerShell Workflows and Windows PowerShell, see [Syntactic Differences Between Script Workflows and Scripts](http://technet.microsoft.com/library/jj574140.aspx).



## Integration modules

An *Integration Module* is a package that contains a Windows PowerShell Module and can be imported into Azure Automation. Cmdlets in integration modules that are imported into Azure Automation are automatically available to all runbooks in the same Automation account. Since Azure Automation is based on Windows PowerShell 4.0, it supports auto loading of modules meaning that cmdlets from installed modules can be used without importing them into the script with [Import-Module](http://technet.microsoft.com/library/hh849725.aspx).

## Parallel processing

NOTE:  We do not recommend running child runbooks in parallel since this has been shown to give unreliable results.  The output from the child runbook sometimes will not show up, and settings in one child runbook can affect the other parallel child runbooks 


## Related articles

- [Creating or Importing a Runbook](http://technet.microsoft.com/library/dn919921.aspx) 