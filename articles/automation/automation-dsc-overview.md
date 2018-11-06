---
title: Azure Automation State Configuration Overview
description: An Overview of Azure Automation State Configuration (DSC), its terms, and known issues
keywords: powershell dsc, desired state configuration, powershell dsc azure
services: automation
ms.service: automation
ms.component: dsc
author: bobbytreed
ms.author: robreed
ms.date: 08/08/2018
ms.topic: conceptual
manager: carmonm
---
# Azure Automation State Configuration Overview

Azure Automation State Configuration is an Azure service that allows you to write, manage, and
compile PowerShell Desired State Configuration (DSC)
[configurations](/powershell/dsc/configurations), import [DSC Resources](/powershell/dsc/resources),
and assign configurations to target nodes, all in the cloud.

## Why use Azure Automation State Configuration

Azure Automation State Configuration provides several advantages over using DSC outside of Azure.

### Built-in pull server

Azure Automation State Configuration provides a DSC pull server similar to the
[Windows Feature DSC-Service](/powershell/dsc/pullserver) so that target nodes automatically receive
configurations, conform to the desired state, and report back on their compliance. The built-in pull
server in Azure Automation eliminates the need to set up and maintain your own pull server. Azure
Automation can target virtual or physical Windows or Linux machines, in the cloud or on-premises.

### Management of all your DSC artifacts

Azure Automation State Configuration brings the same management layer to
[PowerShell Desired State Configuration](/powershell/dsc/overview) as Azure Automation offers for PowerShell scripting.

From the Azure portal, or from PowerShell, you can manage all your DSC configurations, resources,
and target nodes.

![Screen shot of the Azure Automation blade](./media/automation-dsc-overview/azure-automation-blade.png)

### Import reporting data into Log Analytics

Nodes that are managed with Azure Automation State Configuration send detailed reporting status
data to the built-in pull server. You can configure Azure Automation State Configuration to send
this data to your Log Analytics workspace. To learn how to send State Configuration status data to
your Log Analytics workspace, see [Forward Azure Automation State Configuration reporting data to Log nalytics](automation-dsc-diagnostics.md).

## Introduction video

Prefer watching to reading? Have a look at the following video from May 2015, when Azure Automation
State Configuration was first announced.

> [!NOTE]
> While the concepts and life cycle discussed in this video are correct, Azure Automation State
> Configuration has progressed a lot since this video was recorded. It is now generally available,
> has a much more extensive UI in the Azure portal, and supports many additional capabilities.

[!VIDEO https://channel9.msdn.com/Events/Ignite/2015/BRK3467/player]

## Next steps

- To get started, see [Getting started with Azure Automation State Configuration](automation-dsc-getting-started.md)
- To learn how to onboard nodes, see [Onboarding machines for management by Azure Automation State Configuration](automation-dsc-onboarding.md)
- To learn about compiling DSC configurations so that you can assign them to target nodes, see [Compiling configurations in Azure Automation State Configuration](automation-dsc-compile.md)
- For PowerShell cmdlet reference, see [Azure Automation State Configuration cmdlets](/powershell/module/azurerm.automation/#automation)
- For pricing information, see [Azure Automation State Configuration pricing](https://azure.microsoft.com/pricing/details/automation/)
- To see an example of using Azure Automation State Configuration in a continuous deployment pipeline, see [Continuous Deployment Using Azure Automation State Configuration and Chocolatey](automation-dsc-cd-chocolatey.md)