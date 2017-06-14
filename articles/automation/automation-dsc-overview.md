---
title: Azure Automation DSC Overview | Microsoft Docs
description: An Overview of Azure Automation Desired State Configuration (DSC), its terms, and known issues
services: automation
documentationcenter: dev-center-name
author: eslesar
manager: carmonm
keywords: powershell dsc, desired state configuration, powershell dsc azure

ms.assetid: fd40cb68-c1a6-48c3-bba2-710b607d1555
ms.service: automation
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: powershell
ms.workload: TBD
ms.date: 02/02/2017
ms.author: eslesar
---

# Azure Automation DSC Overview

Azure Automation DSC is an Azure service that allows you to write, manage, and compile PowerShell Desired State Configuration (DSC)
[configurations](https://msdn.microsoft.com/powershell/dsc/configurations), import [DSC Resources](https://msdn.microsoft.com/powershell/dsc/resources),
and assign configurations to target nodes, all in the cloud.

Azure Automation also provides a [DSC pull server](https://msdn.microsoft.com/en-us/powershell/dsc/pullserver) so that target nodes automatically receive configurations, conform to the desired state, and report back on their compliance.
Azure Automation can target virtual or physical Windows or Linux machines, in the cloud or on-premises.

Azure Automation DSC builds on top of the fundamentals introduced in PowerShell DSC to provide an even easier configuration management experience. Azure Automation DSC brings the same management layer to [PowerShell Desired State Configuration](https://msdn.microsoft.com/powershell/dsc/overview) as Azure Automation offers for PowerShell scripting.

Prefer watching to reading? Have a look at the following video from May 2015, when Azure Automation DSC was first announced. **Note:** While the concepts and life cycle discussed in this video are correct, Azure Automation DSC has progressed a lot since this video was recorded. It is now generally available, has a much more extensive UI in the Azure portal, and supports many additional capabilities.

> [!VIDEO https://channel9.msdn.com/Events/Ignite/2015/BRK3467/player]

## Azure Automation DSC LifeCycle

Going from an empty automation account to a managed set of correctly configured nodes involves a set of processes for defining configurations, turning those configurations into node configurations, and onboarding nodes to Azure Automation DSC and to those node configurations. The following diagram illustrates the Azure Automation DSC lifecycle:

![alt text](./media/automation-dsc-overview/DSCLifecycle.png)

The following image illustrates detailed step-by-step process in the life cycle of DSC. It includes different ways a configuration is imported and applied to nodes in Azure Automation, components required for an on-premises machine to support DSC and interactions between different components.

![DSC Architecture](./media/automation-dsc-overview/dsc-architecture.png)

## Next steps

* To learn how to onboard nodes to be managed with Azure Automation DSC, see [Onboarding machines for management by Azure Automation DSC](automation-dsc-onboarding.md)
* To get started using Azure Automation DSC, see [Getting started with Azure Automation DSC](automation-dsc-getting-started.md)
* To learn about compiling DSC configurations so that you can assign them to target nodes, see [Compiling configurations in Azure Automation DSC](automation-dsc-compile.md)
* For PowerShell cmdlet reference for Azure Automation DSC, see [Azure Automation DSC cmdlets](/powershell/module/azurerm.automation/#automation)
* For pricing information, see [Azure Automation DSC pricing](https://azure.microsoft.com/pricing/details/automation/)
* To see an example of using Azure Automation DSC in a continuous deployment pipeline, see 
   [Continuous Deployment to IaaS VMs Using Azure Automation DSC and Chocolatey](automation-dsc-cd-chocolatey.md)