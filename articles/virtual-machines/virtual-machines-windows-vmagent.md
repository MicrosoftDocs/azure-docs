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

The Microsoft Azure Virtual Machine Agent (AM Agent) is a secured, light weight process that manages VM interaction with the Azure Fabric Controller. The VM Agent has a primary role in enabling and executing Azure virtual machine extensions. VM Extensions enabling post deployment configuration of virtual machines such as installing and configuring software. Virtual machine extensions also enable recovery features such as resetting the administrative password of a virtual machine. Without the Azure VM Agent, virtual machine extensions cannot be run.

This document details installation, detection, and removal of the Azure Virtual Machine Agent.

## Install the VM Agent

### Azure gallery image

The Azure VM Agent is installed by default on any Windows VM deployed from an Azure Gallery image. When deploying an Azure gallery image from the Portal, PowerShell, Command Line Interface, or an Azure Resource Manager template, the Azure VM Agent is also be installed. 

### Manual installation

The Windows VM agent can be manually installed using a Windows installer package. This is necessary when creating a custom virtual machine image that will be deployed in Azure. To manually install the Windows VM Agent, download the VM Agent installer from this location [Windows Azure VM Agent Download](http://go.microsoft.com/fwlink/?LinkID=394789). 

The VM Agent installation can be installed by double clicking on the windows installer file or by running the following command. This command provides an unattended installation of the agent.

```cmd
msiexec.exe /i WindowsAzureVmAgent.2.7.1198.778.rd_art_stable.160617-1120.fre /quiet
```

## Upgrade the VM Agent

The Azure VM Agent for Windows is automatically upgraded.

## Detect the VM Agent

### PowerShell

The Azure Resource Manager PowerShell module can be used to retrieve information about Azure Virtual Machines. Running `Get-AzureRmVM` returns quite a bit of information including the provisioning state for the Azure VM Agent.

```PowerShell
Get-AzureRmVM
```

The output looks similar to the following. Notice the `ProvisionVMAgent` property nested inside `OSProfile`.

```PowerShell
RequestId                  : 04b7bf64-91d4-4de9-928d-fe18f6cc2f7c
StatusCode                 : OK
ResourceGroupName          : myResourceGroup
Id                         :
Name                       : myVM
Type                       : Microsoft.Rest.Azure.AzureOperationResponse`1[Microsoft.Rest.Azure.IPage`1[Microsoft.Azure
.Management.Compute.Models.VirtualMachine]]
Location                   : eastus
Tags                       : {}
DiagnosticsProfile         :
  BootDiagnostics          :
    Enabled                : True
    StorageUri             : 
Extensions[0]              :
  Id                       : 
HardwareProfile            :
  VmSize                   : Standard_DS1_v2
NetworkProfile             :
  NetworkInterfaces[0]     :
    Id                     : 
OSProfile                  :
  ComputerName             : myVM
  AdminUsername            : muUserName
  WindowsConfiguration     :
    ProvisionVMAgent       : True
    EnableAutomaticUpdates : True
ProvisioningState          : Succeeded
StorageProfile             :
  ImageReference           :
    Publisher              : MicrosoftWindowsServer
    Offer                  : WindowsServer
    Sku                    : 2016-Datacenter
    Version                : latest
  OsDisk                   :
    OsType                 : Windows
    Name                   : myOsDisk1
    Vhd                    :
      Uri                  : 
    Caching                : ReadWrite
    CreateOption           : FromImage
NetworkInterfaceIDs[0]     : 
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

When logged into an Azure VM, task manager can be used to examine running processes. To check for the Azure VM Agent, open Task Manager > click on the details tab, and look for a process name `WindowsAzureGuestAgent.exe`. The presence of this process indicates that the VM agent is installed.

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

When using PowerShell to deploy a new Azure virtual machine, the `Set-AzureRmVMOperatingSystem` command includes a `-ProvisionVMAgnet` switch parameter. This means that if the parameter is present the VM Agent is installed, if not, the VM Agent is not installed. The following command configures the VM deployment operation so that the VM Agent is not installed. For a complete walkthrough on deploying Azure virtual machines with PowerShell, see [Create a Windows VM using PowerShell](./virtual-machines-windows-ps-create.md).

```PowerShell
Set-AzureRmVMOperatingSystem -VM $myVM -Windows -ComputerName "myVM" -Credential $cred -EnableAutoUpdate
```

### Custom VM image

If using a custom VM image in Azure, the VM Agent can be excluded from the image.