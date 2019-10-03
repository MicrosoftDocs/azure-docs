---
title: Windows Remote Management over HTTPS for Azure | Azure Marketplace
description: Explains how to configure an Azure-hosted, Windows-based VM so that it can be managed remotely with PowerShell.
services: Azure, Marketplace, Cloud Partner Portal, 
author: v-miclar
ms.service: marketplace
ms.topic: conceptual
ms.date: 11/26/2018
ms.author: pabutler
---

# Windows Remote Management over HTTPS

This section explains how to configure an Azure-hosted, Windows-based VM so that it can be managed and deployed remotely with PowerShell.  To enable PowerShell remoting, the target VM must expose a Windows Remote Management (WinRM) HTTPS endpoint.  For more information about PowerShell remoting, see [Running Remote Commands](https://docs.microsoft.com/powershell/scripting/core-powershell/running-remote-commands?view=powershell-6).  For more information about WinRM, see [Windows Remote Management](https://docs.microsoft.com/windows/desktop/WinRM/portal).

If you created a VM using one of the "classic" Azure approaches—either the Azure Service Manager Portal or the deprecated [Azure Service Management API](https://docs.microsoft.com/previous-versions/azure/ee460799(v=azure.100))—then it is automatically configured with a WinRM endpoint.  However, if you create a VM using any of the following "modern" Azure approaches, then your VM will *not* be configured for WinRM over HTTPS.  

- Using the [Azure portal](https://portal.azure.com/), typically from an approved base, as described in the section [Create an Azure-compatible VHD](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/virtual-machine/cpp-create-vhd)
- [Using the Azure Resource Manager templates](https://docs.microsoft.com/azure/virtual-machines/windows/ps-template)
- Using either the Azure PowerShell or Azure CLI command shell.  For examples, see [Quickstart: Create a Windows virtual machine in Azure with PowerShell](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-powershell) and [Quickstart: Create a Linux virtual machine with the Azure CLI](https://docs.microsoft.com/azure/virtual-machines/linux/quick-create-cli).

This WinRM endpoint is also required to run the Certification tool kit for onboarding the VM, as described in [Certify your VM image](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/virtual-machine/cpp-certify-vm).

In contrast, typically Linux VMs are remotely managed using either [Azure CLI](https://docs.microsoft.com/cli/azure) or Linux commands from an SSH console.  Azure also provides several alternative methods to [run scripts in your Linux VM](https://docs.microsoft.com/azure/virtual-machines/linux/run-scripts-in-vm).  For more complex scenarios, there are a number of automation and integration solutions available for Windows- or Linux-based VMs.


## Configure and deploy with WinRM

The WinRM endpoint for a windows-based VM can be configured during two different stages of its development:

- During creation - during the deployment of a VM to an existing VHD.  This is the preferred approach for new offers.  This approach requires the creation of an Azure certificate, using supplied Azure Resource Manager templates, and running customized PowerShell scripts. 
- After deployment - on an existing VM hosted on Azure.  Use this approach if you already have a VM solution deployed on Azure, and need to enable Window Remote Management for it.  This approach requires manual changes in the Azure portal and the execution of a script on the target VM. 


## Next steps
If you are creating a new VM, you can enable WinRM during [deployment of your VM from its VHDs](./cpp-deploy-vm-vhd.md).  Otherwise, WinRM can be enabled in an existing VM  
