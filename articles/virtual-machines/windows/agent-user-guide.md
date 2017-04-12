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

The Microsoft Azure Virtual Machine Agent (AM Agent) is a secured, lightweight process that manages VM interaction with the Azure Fabric Controller. The VM Agent has a primary role in enabling and executing Azure virtual machine extensions. VM Extensions enabling post deployment configuration of virtual machines, such as installing and configuring software. Virtual machine extensions also enable recovery features such as resetting the administrative password of a virtual machine. Without the Azure VM Agent, virtual machine extensions cannot be run.

This document details installation, detection, and removal of the Azure Virtual Machine Agent.

## Install the VM Agent

### Azure gallery image

The Azure VM Agent is installed by default on any Windows virtual machine deployed from an Azure Gallery image. When deploying an Azure gallery image from the Portal, PowerShell, Command Line Interface, or an Azure Resource Manager template, the Azure VM Agent is also be installed. 

### Manual installation

The Windows VM agent can be manually installed using a Windows installer package. Manual installation may be necessary when creating a custom virtual machine image that will be deployed in Azure. To manually install the Windows VM Agent, download the VM Agent installer from this location [Windows Azure VM Agent Download](http://go.microsoft.com/fwlink/?LinkID=394789). 

The VM Agent can be installed by double-clicking the windows installer file. For an automated or unattended installation of the VM agent, run the following command.

```cmd
msiexec.exe /i WindowsAzureVmAgent.2.7.1198.778.rd_art_stable.160617-1120.fre /quiet
```

## Detect the VM Agent

### PowerShell

The Azure Resource Manager PowerShell module can be used to retrieve information about Azure Virtual Machines. Running `Get-AzureRmVM` returns quite a bit of information including the provisioning state for the Azure VM Agent.

```PowerShell
Get-AzureRmVM
```

The following is just a subset of the `Get-AzureRmVM` output. Notice the `ProvisionVMAgent` property nested inside `OSProfile`, this property can be used to determine if the VM agent has been deployed to the virtual machine.

```PowerShell
OSProfile                  :
  ComputerName             : myVM
  AdminUsername            : muUserName
  WindowsConfiguration     :
    ProvisionVMAgent       : True
    EnableAutomaticUpdates : True
```

The following script can be used to return a concise list of virtual machine names and the state of the VM Agent.

```PowerShell
$vms = Get-AzureRmVM

foreach ($vm in $vms) {
    $agent = $vm | Select -ExpandProperty OSProfile | Select -ExpandProperty Windowsconfiguration | Select ProvisionVMAgent
    Write-Host $vm.Name $agent.ProvisionVMAgent
}
```

### Manual Detection

When logged in to a Windows Azure VM, task manager can be used to examine running processes. To check for the Azure VM Agent, open Task Manager > click the details tab, and look for a process name `WindowsAzureGuestAgent.exe`. The presence of this process indicates that the VM agent is installed.

## Upgrade the VM Agent

The Azure VM Agent for Windows is automatically upgraded. As new virtual machines are deployed to Azure, they receive the latest VM agent. Custom VM images should be manually updated to include the new VM agent.