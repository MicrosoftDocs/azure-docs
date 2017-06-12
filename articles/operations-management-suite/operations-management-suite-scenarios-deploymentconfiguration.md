---
title: Solution targeting in OMS | Microsoft Docs
description: Solution Targeting is a feature in Operations Management Suite (OMS) that allows you to limit management solutions to a specific set of agents.  This article describes how to create a scope configuration and apply it to a solution.
services: operations-management-suite
documentationcenter: ''
author: bwren
manager: carmonm
editor: tysonn

ms.assetid: 1f054a4e-6243-4a66-a62a-0031adb750d8
ms.service: operations-management-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/27/2017
ms.author: bwren

---
# Deploying and configuring virtual machines using Azure management tools

## Resource Manager templates
[Resource Manager]() templates should be the primary technology leveraged to deploy and configure Azure resources.  While you can create and configure most resources using more direct methods such as the Azure portal, [PowerShell](https://docs.microsoft.com/powershell/azure/overview), or [CLI](https://docs.microsoft.com/cli/azure/overview), templates have multiple attributes that make them ideal for the basis of a managed scalable deployment process.

- ARM templates are idempotent meaning that you define the end state of your desired configuration.  It can be installed multiple times without duplicating the install and will respect 
- You can generate an ARM template from an existing VM and then use it for subsequent deployments.
- ARM templates are easier to maintain and modify than scripts.  You can keep a library of templates for your different configurations.  
- ARM templates separate your required configuration from the process of applying that configuration.  You can have one script or runbook for VM deployment that leverages multiple ARM templates depending on the configuration being deployed. 


### Virtual machine extensions
When deploying virtual machines in Azure, you should leverage ARM templates ability to install extensions that add the VM to other management services.

- **PowerShell DSC VM extension**. adds the VM to [PowerShell DSC in Azure Automation](#powershell-dsc).  This is used to configure the operating system inside the VM.  As soon as the machine comes online, it will download the PowerShell DSC configuration.
- **Microsoft Monitoring Agent extension**.  This adds the OMS agent to the VM which connects it to a Log Analytics workspace.  As soon as the VM comes online, it will install the agent in the operating system, connect to the workspace, and download any management solutions in the workspace. 

### Questions
- Where would we keep a library of templates?
- Non-Azure resources
	- AWS
	- VMWare
	- Hyper-V
	- VMM

## PowerShell DSC
[PowerShell DSC](https://msdn.microsoft.com/powershell/dsc/overview) allows you to configure the operating system inside of your VM once it's been created.  Instead of a script, you define DSC configurations which define the end state of the operating system and applications to be installed on the VM.  Like ARM templates, this has the advantage of being idempotent so that a configuration can be applied multiple times to ensure that the VM configuration is maintains its configuration even if it's accidentally modified by an administrator.  You can centrally manage configurations and apply them to multiple VMs.

### Azure Automation DSC

Configurations for PowerShell DSC are centrally located on pull servers.  Clients connect to a pull server to load configurations.  Azure Automation manages DSC configurations and delivers them to agents precluding the requirement to maintain pull servers.  PowerShell DSC can be used without Azure Automation, but you would need to maintain configurations and pull servers on your own.


## Automating the deployment
You can deploy an ARM template using the Azure portal or one of multiple methods from a command line.  In a production environment though, you often require a complete workflow around a deployment.  Other requirements may include:

- Perform validations before running the deployment to ensure that other XXX.
- Look up configuration values from other systems.
- Log the deployment to a management system.


### PowerShell
PowerShell has cmdlets for all Azure services and many other systems.  You can use the [New-AzureRmResourceGroupDeployment]() to deploy an ARM template from a PowerShell script.   

### CLI
The Azure CLI lets you deploy and configure Azure resources from a Windows or Linux command line.  You can also launch a CLI command line from the Azure portal making it available from any browser.  Using the CLI, you can include commands in a batch or a bash script.


## Azure Automation


## Integrating with existing monitoring

### Virtual Machine Manager
System Center Virtual Machine Manager (VMM) is used by many customers for deployment of on-premise 

does allow you to [add an Azure subscription,](https://docs.microsoft.com/system-center/vmm/azure-subscription.md), but this has minimal functionality to expose Azure information in the VMM console.  It does not provide functionality such as deploying or managing Azure resources.

### SCCM


## Next steps
