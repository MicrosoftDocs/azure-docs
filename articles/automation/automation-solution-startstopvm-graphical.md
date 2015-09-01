<properties 
   pageTitle="Starting and stopping virtual machines | Microsoft Azure"
   description=""
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
   ms.date="08/25/2015"
   ms.author="bwren" />

# Azure Automation solution <br> Starting and stopping virtual machines <br> Graphical

This solution includes runbooks in Azure Automation that start and stop virtual machines.  You can install and use these runbooks in your environment or include them in a custom solution.  This solution is available using both graphical runbooks and textual workflow runbooks.

> [AZURE.SELECTOR]
- [Graphical](automation-solutions-startstopvm-graphical.md)
- [Textual](automation-solutions-startstopvm-textual.md)


## Getting the solution


## Installing the solution


## Detailed breakdown

This solution includes two runbooks, *StartAzureClassVM* and *StopAzureClassicVM*.

### Authentication

### Get VMs

One of two activities will retrieve the VMs that we want to start.  

If the *ServiceName* input parameter for the runbook contains a value, then we want to run 

### Merge VMs

The Merge VMs activity is required to provide input to *Start-AzureVM*.  *Start-AzureVM* needs the Name and Service name of the vm(s) to start.  That input could come from either *Get All VMs* or *Get VMs in Service*, but *Start-AzureVM* can only specify one activity for its input.  

The solution is to create *Merge VMs* which runs the *Write-Output* cmdlet.  The *InputObject* parameter for that cmdlet is a PowerShell Expression that that combines the input of the previous activities.  Only one of those activities will run, so only one set of output is expected.  *Start-AzureVM* can use that output for its input parameters.


## Using the solution


## Customizing the solution


## Related solutions


## Related articles

