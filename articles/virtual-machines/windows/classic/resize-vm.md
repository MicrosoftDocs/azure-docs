---
title: Resize a Windows VM in the classic deployment model - Azure | Microsoft Docs
description: Resize a Windows virtual machine created in the classic deployment model, using Azure Powershell.
services: virtual-machines-windows
documentationcenter: ''
author: Drewm3
manager: timlt
editor: ''
tags: azure-service-management

ms.assetid: e3038215-001c-406e-904d-e0f4e326a4c7
ms.service: virtual-machines-windows
ms.workload: na
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 10/19/2016
ms.author: drewm

---
# Resize a Windows VM created in the classic deployment model
This article shows you how to resize a Windows VM, created in the classic deployment model using Azure Powershell.

When considering the ability to resize a VM, there are two concepts which control the range of sizes available to resize the virtual machine. The first concept is the region in which your VM is deployed. The list of VM sizes available in region is under the Services tab of the Azure Regions web page. The second concept is the physical hardware currently hosting your VM. The physical servers hosting VMs are grouped together in clusters of common physical hardware. The method of changing a VM size differs depending on if the desired new VM size is supported by the hardware cluster currently hosting the VM.

> [!IMPORTANT] 
> Azure has two different deployment models for creating and working with resources: [Resource Manager and Classic](../../../resource-manager-deployment-model.md). This article covers using the Classic deployment model. Microsoft recommends that most new deployments use the Resource Manager model. You can also [resize a VM created in the Resource Manager deployment model](../resize-vm.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

## Add your account
You must configure Azure PowerShell to work with classic Azure resources. Follow the steps below to configure Azure PowerShell to manage classic resources.

1. At the PowerShell prompt, type `Add-AzureAccount` and click **Enter**. 
2. Type in the email address associated with your Azure subscription and click **Continue**. 
3. Type in the password for your account. 
4. Click **Sign in**. 

## Resize in the same hardware cluster
To resize a VM to a size available in the hardware cluster hosting the VM, perform the following steps.

1. Run the following PowerShell command to list the VM sizes available in the hardware cluster hosting the cloud service which contains the VM.
   
    ```powershell
    Get-AzureService | where {$_.ServiceName -eq "<cloudServiceName>"}
    ```
2. Run the following commands to resize the VM.
   
    ```powershell
    Get-AzureVM -ServiceName <cloudServiceName> -Name <vmName> | Set-AzureVMSize -InstanceSize <newVMSize> | Update-AzureVM
    ```

## Resize on a new hardware cluster
To resize a VM to a size not available in the hardware cluster hosting the VM, the cloud service and all VMs in the cloud service must be recreated. Each cloud service is hosted on a single hardware cluster so all VMs in the cloud service must be a size that is supported on a hardware cluster. The following steps will describe how to resize a VM by deleting and then recreating the cloud service.

1. Run the following PowerShell command to list the VM sizes available in the region. 
   
    ```powershell
    Get-AzureLocation | where {$_.Name -eq "<locationName>"}
    ```
2. Make note of all configuration settings for each VM in the cloud service which contains the VM to be resized. 
3. Delete all VMs in the cloud service selecting the option to retain the disks for each VM.
4. Recreate the VM to be resized using the desired VM size.
5. Recreate all other VMs which were in the cloud service using a VM size available in the hardware cluster now hosting the cloud service.

A sample script for deleting and recreating a cloud service using a new VM size can be found [here](https://github.com/Azure/azure-vm-scripts). 

## Next steps
* [Resize a VM created in the Resource Manager deployment model](../resize-vm.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

