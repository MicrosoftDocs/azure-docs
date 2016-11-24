---
title: Azure Virtual Machine Agent Overview | Microsoft Docs
description: Azure Virtual Machine Agent Overview
services: virtual-machines-windows
documentationcenter: virtual-machines
author: neilpeterson
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 0a1f212e-053e-4a39-9910-8d622959f594
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 11/17/2016
ms.author: nepeters

---
# Azure Virtual Machine Agent overview

The Microsoft Azure Virtual Machine Agent (AM Agent) is a secured, light weight process that manages VM interaction with the Azure Fabric Controller. The VM Agent performs many deployment and management activities such as initial credential management, enabling configuration automation, and bootstrapping virtual machine monitoring. In most cases the VM agent is preinstalled on Azure virtual machines, however there may be cases where manual or scripted installation is necessary.

This document will detail core functionality, installation, and configuration of the Azure Virtual Machine Agent.

## VM Agent functionality

## Install the VM Agent

### Azure gallery image

The Azure VM Agent is installed by default on any Windows VM deployed from an Azure Gallery image. 

### Manual installation

The Windows VM agent can be manually installed using a Windows installer package. This is useful when creating a custom virtual machine image that will be deployed in Azure. To manually install the Windows VM Agent, download the VM Agent installer from this location [Windows Azure VM Agent Download](http://go.microsoft.com/fwlink/?LinkID=394789). 

Once downloaded this can be installed by manually running this Windows installer file.

The VM Agent installation can also be automated by running the following command. This will provide an unattended installation of the agent.

```cmd
msiexec.exe /i WindowsAzureVmAgent.2.7.1198.778.rd_art_stable.160617-1120.fre /quiet
```

## Upgrade the VM Agent

The Azure VM Agent for Windows is automatically upgraded.

## Detect the VM Agent

## Remove the VM Agent

It is not recommended to uninstall existing Azure VM Agents. If the VM agent should not be installed on an Azure virtual machine, the recommendation is to deploy the VM without the VM agent. The VM agent can be removed from a deployment though several methods.

### Azure Resource Manager template

When using a Resource Manager template, the VM Agent can be disabled in the VM resources OS profile. The following JSON shows an example of this.

```json
"osProfile": {
    "computerName": "[variables('vmName')]",
    "adminUsername": "[parameters('adminUsername')]",
    "adminPassword": "[parameters('adminPassword')]",
    "windowsConfiguration": {
    "provisionVMAgent": "false"
    }
},  
```

### PowerShell

When using PowerShell to deploy a new Azure virtual machine, the `Set-AzureRmVMOperatingSystem` command includes a `-ProvisionVMAgnet` switch parameter. This means that if the parameter is present the VM Agent will be installed, if not, the VM Agent is not installed. The following command will configure the VM deployment operation so that the VM Agent is not installed. For a complete walkthrough on deploying Azure virtual machines with PowerShell, see [Create a Windows VM using PowerShell](./virtual-machines-windows-ps-create/md).

```PowerShell
Set-AzureRmVMOperatingSystem -VM $myVM -Windows -ComputerName "myVM" -Credential $cred -EnableAutoUpdate
```

### Custom VM image

If using a custom VM image in Azure, the VM Agent can be excluded from the image.


## Troubleshoot the VM Agent

<Notes>

- Classic Doc - https://docs.microsoft.com/en-us/azure/virtual-machines/virtual-machines-linux-classic-agents-and-extensions
- Linux Reference - https://github.com/Azure/WALinuxAgent / https://docs.microsoft.com/en-us/azure/virtual-machines/virtual-machines-linux-agent-user-guide
- Linux Update Agent - https://docs.microsoft.com/en-us/azure/virtual-machines/virtual-machines-linux-update-agent
