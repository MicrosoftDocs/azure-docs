---
title: Collect details about all VMs in a subscription with PowerShell | Microsoft Docs
description: Collect details about all VMs in a subscription with PowerShell
services: virtual-machines-windows
documentationcenter: virtual-machines
author: v-miegge
manager: ???
editor: ???
tags: azure-service-management

ms.assetid:
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 07/01/2019
ms.author: v-miegge
ms.custom: mvc
---

# Collect details about all VMs in a subscription with PowerShell

This script creates a csv that contains the VM Name, Resource Group Name, Region, Virtual Network, Subnet, Private IP Address, OS Type, and Public IP Address of the VMs in the provided subscription.
If you don't have an [Azure subscription](https://docs.microsoft.com/azure/guides/developer/azure-developer-guide#understanding-accounts-subscriptions-and-billing), create a [free account](https://azure.microsoft.com/free) before you begin.

## Open Azure Cloud Shell

Azure Cloud Shell is an interactive shell environment hosted in Azure and used through your browser. Azure Cloud Shell allows you to use either bash or PowerShell shells to run a variety of tools to work with Azure services. Azure Cloud Shell comes pre-installed with the commands to allow you to run the content of this article without having to install anything on your local environment.

To run any code contained in this article on Azure Cloud Shell, open a Cloud Shell session, use the **Copy** button on a code block to copy the code, and paste it into the Cloud Shell session with **Ctrl+Shift+V** on Windows and Linux, or **Cmd+Shift+V** on macOS. Pasted text is not automatically executed, so press **Enter** to run code.

You can launch Azure Cloud Shell with:

|Option|Example/Link|
|-|-|
|Select **Try It** in the upper-right corner of a code block. This **does not** automatically copy text to Cloud Shell.|![Image](../../../includes/media/cloud-shell-try-it/cli-try-it.png)|
|Open [Azure Cloud Shell](https://shell.azure.com/) in your browser.|![](../../../includes/media/cloud-shell-try-it/launchcloudshell.png)|
|Select the **Cloud Shell** button on the menu in the upper-right corner of the [Azure portal](https://portal.azure.com/).|![](../../../includes/media/cloud-shell-try-it/cloud-shell-menu.png)|
 
> [!NOTE]
> This article has been updated to use the new Azure PowerShell Az module. You can still use the AzureRM module, which will continue to receive bug fixes until at least December 2020. To learn more about the new Az module and AzureRM compatibility, see [Introducing the new Azure PowerShell Az module](/powershell/azure/new-azureps-module-az). For Az module installation instructions, see [Install Azure PowerShell](/powershell/azure/install-az-ps).

## Sample script

```ps
#Provide the subscription Id where the VMs reside
$subscriptionId = "ea7ded4e-153a-4e65-ad70-25bf9f7b91bc"

#Provide the name of the csv file to be exported
$reportName = "myReport.csv"

Select-AzSubscription $subscriptionId
$report = @()
$vms = Get-AzVM
$publicIps = Get-AzPublicIpAddress 
$nics = Get-AzNetworkInterface | ?{ $_.VirtualMachine -NE $null} 
foreach ($nic in $nics) { 
    $info = "" | Select VmName, ResourceGroupName, Region, VirturalNetwork, Subnet, PrivateIpAddress, OsType, PublicIPAddress 
    $vm = $vms | ? -Property Id -eq $nic.VirtualMachine.id 
    foreach($publicIp in $publicIps) { 
        if($nic.IpConfigurations.id -eq $publicIp.ipconfiguration.Id) {
            $info.PublicIPAddress = $publicIp.ipaddress
            } 
        } 
        $info.OsType = $vm.StorageProfile.OsDisk.OsType 
        $info.VMName = $vm.Name 
        $info.ResourceGroupName = $vm.ResourceGroupName 
        $info.Region = $vm.Location 
        $info.VirturalNetwork = $nic.IpConfigurations.subnet.Id.Split("/")[-3] 
        $info.Subnet = $nic.IpConfigurations.subnet.Id.Split("/")[-1] 
        $info.PrivateIpAddress = $nic.IpConfigurations.PrivateIpAddress 
        $report+=$info 
    } 
$report | ft VmName, ResourceGroupName, Region, VirturalNetwork, Subnet, PrivateIpAddress, OsType, PublicIPAddress 
$report | Export-CSV "$home/$reportName"
```

## Script explanation
This script uses following commands to create a csv export of the details of VMs in a subscription. Each command in the table links to command specific documentation.

|Command|Notes|
|-|-|
|[Select-AzSubscription](https://docs.microsoft.com/powershell/module/Az.Accounts/Set-AzContext)|Sets the tenant, subscription, and environment for cmdlets to use in the current session.|
|[Get-AzVM](https://docs.microsoft.com/powershell/module/Az.Compute/Get-AzVM)|Gets the properties of a virtual machine.|
|[Get-AzPublicIpAddress](https://docs.microsoft.com/powershell/module/Az.Network/Get-AzPublicIpAddress)|Gets a public IP address.|
|[Get-AzNetworkInterface](https://docs.microsoft.com/powershell/module/Az.Network/Get-AzNetworkInterface)|Gets a network interface.|


## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/azure/overview).

Additional virtual machine PowerShell script samples can be found in the [Azure Windows VM documentation](https://docs.microsoft.com/azure/virtual-machines/windows/powershell-samples?toc=/azure/virtual-machines/windows/toc.json).


