---
title: Azure Virtual Machine Agent Overview | Microsoft Docs
description: Azure Virtual Machine Agent Overview
services: virtual-machines-windows
documentationcenter: virtual-machines
author: roiyz-msft
manager: gwallace
editor: tysonn
tags: azure-resource-manager

ms.assetid: 0a1f212e-053e-4a39-9910-8d622959f594
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 03/30/2018
ms.author: roiyz
---

# Azure Virtual Machine Agent overview
The Microsoft Azure Virtual Machine Agent (VM Agent) is a secure, lightweight process that manages virtual machine (VM) interaction with the Azure Fabric Controller. The VM Agent has a primary role in enabling and executing Azure virtual machine extensions. VM Extensions enable post-deployment configuration of VM, such as installing and configuring software. VM extensions also enable recovery features such as resetting the administrative password of a VM. Without the Azure VM Agent, VM extensions cannot be run.

This article details installation, detection, and removal of the Azure Virtual Machine Agent.

## Install the VM Agent

### Azure Marketplace image

The Azure VM Agent is installed by default on any Windows VM deployed from an Azure Marketplace image. When you deploy an Azure Marketplace image from the portal, PowerShell, Command Line Interface, or an Azure Resource Manager template, the Azure VM Agent is also installed.

The Windows Guest Agent Package is broken into two parts:

- Provisioning Agent (PA)
- Windows Guest Agent (WinGA)

To boot a VM you must have the PA installed on the VM, however the WinGA does not need to be installed. At VM deploy time, you can select not to install the WinGA. The following example shows how to select the *provisionVmAgent* option with an Azure Resource Manager template:

```json
"resources": [{
"name": "[parameters('virtualMachineName')]",
"type": "Microsoft.Compute/virtualMachines",
"apiVersion": "2016-04-30-preview",
"location": "[parameters('location')]",
"dependsOn": ["[concat('Microsoft.Network/networkInterfaces/', parameters('networkInterfaceName'))]"],
"properties": {
    "osProfile": {
    "computerName": "[parameters('virtualMachineName')]",
    "adminUsername": "[parameters('adminUsername')]",
    "adminPassword": "[parameters('adminPassword')]",
    "windowsConfiguration": {
        "provisionVmAgent": "false"
}
```

If you do not have the Agents installed, you cannot use some Azure services, such as Azure Backup or Azure Security. These services require an extension to be installed. If you have deployed a VM without the WinGA, you can install the latest version of the agent later.

### Manual installation
The Windows VM agent can be manually installed with a Windows installer package. Manual installation may be necessary when you create a custom VM image that is deployed to Azure. To manually install the Windows VM Agent, [download the VM Agent installer](https://go.microsoft.com/fwlink/?LinkID=394789).

The VM Agent can be installed by double-clicking the Windows installer file. For an automated or unattended installation of the VM agent, run the following command:

```cmd
msiexec.exe /i WindowsAzureVmAgent.2.7.1198.778.rd_art_stable.160617-1120.fre /quiet
```

## Detect the VM Agent

### PowerShell

The Azure Resource Manager PowerShell module can be used to retrieve information about Azure VMs. To see information about a VM, such as the provisioning state for the Azure VM Agent, use [Get-AzVM](https://docs.microsoft.com/powershell/module/az.compute/get-azvm):

```powershell
Get-AzVM
```

The following condensed example output shows the *ProvisionVMAgent* property nested inside *OSProfile*. This property can be used to determine if the VM agent has been deployed to the VM:

```powershell
OSProfile                  :
  ComputerName             : myVM
  AdminUsername            : myUserName
  WindowsConfiguration     :
    ProvisionVMAgent       : True
    EnableAutomaticUpdates : True
```

The following script can be used to return a concise list of VM names and the state of the VM Agent:

```powershell
$vms = Get-AzVM

foreach ($vm in $vms) {
    $agent = $vm | Select -ExpandProperty OSProfile | Select -ExpandProperty Windowsconfiguration | Select ProvisionVMAgent
    Write-Host $vm.Name $agent.ProvisionVMAgent
}
```

### Manual Detection

When logged in to a Windows VM, Task Manager can be used to examine running processes. To check for the Azure VM Agent, open Task Manager, click the *Details* tab, and look for a process name **WindowsAzureGuestAgent.exe**. The presence of this process indicates that the VM agent is installed.


## Upgrade the VM Agent
The Azure VM Agent for Windows is automatically upgraded. As new VMs are deployed to Azure, they receive the latest VM agent at VM provision time. Custom VM images should be manually updated to include the new VM agent at image creation time.


## Next steps
For more information about VM extensions, see [Azure virtual machine extensions and features overview](overview.md).
