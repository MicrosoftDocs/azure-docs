---
title: Use New-AzVM to create an IIS VM | Microsoft Docs
description: Azure PowerShell Script Sample - create a VM running IIS using New-AzVM.
services: virtual-machines-windows
documentationcenter: virtual-machines
author: cynthn
manager: timlt
editor: tysonn
tags: azure-resource-management

ms.assetid:
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: sample
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 09/15/2017
ms.author: cynthn

---

# Create an IIS VM using the New-AzVM PowerShell cmdlet

This script creates an Azure Virtual Machine running Windows Server 2016, and then uses the Azure Virtual Machine Custom Script Extension to install IIS. After running the script, you can access the default IIS website on the public IP address of the virtual machine.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-powershell.md](../../../includes/cloud-shell-powershell.md)]

## Sample script

```powershell-interactive

New-AzVM -ResourceGroupName myResourceGroup `
    -Name myVM `
	-VirtualNetworkName myVNet `
	-Location westeurope `
	-SecurityGroupName myNSG `
	-PublicIpAddressName myPIP


# Create an inbound network security group rule for port 80

$nsgRuleHTTP = New-AzureRmNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleHTTP  -Protocol Tcp `
  -Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
  -DestinationPortRange 80 -Access Allow

$nsg = Get-AzureRmNetworkSecurityGroup -Name myNSG -ResourceGroupName westeurope
$nsg | Add-AzureRmNetworkSecurityRuleConfig -Name $nsgRuleHTTP -NetworkSecurityGroup myNSG 
$nsg | Set-AzureRmNetworkSecurityGroup

# Install IIS

Set-AzureRmVMExtension -ExtensionName "IIS" -ResourceGroupName myResourceGroup -VMName myVM `
  -Publisher "Microsoft.Compute" -ExtensionType "CustomScriptExtension" -TypeHandlerVersion 1.4 `
  -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server"}' -Location westeurope
  
```

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources.

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup
```

## Script explanation

This script uses the following commands to create the deployment. Each item in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzureRmNetworkSecurityRuleConfig](/powershell/module/azurerm.network/new-azurermnetworksecurityruleconfig) | Creates a network security group rule configuration. This configuration is used to create an NSG rule when the NSG is created. |
| [Get-AzureRmNetworkSecurityGroup](/powershell/module/azurerm.network/get-azurermnetworksecuritygroup) | Gets NSG information. |
| [Add-AzureRmNetworkSecurityRuleConfig](/powershell/module/azurerm.network/add-azurermnetworksecurityruleconfig) | Adds the new rule to the configuration. |
| [Set-AzureRmNetworkSecurityGroup](/powershell/module/azurerm.network/Set-AzureRmNetworkSecurityGroup) | Updates the NSG with the new rule. |
| [Set-AzureRmVMExtension](/powershell/module/azurerm.compute/set-azurermvmextension) | Add a VM extension to the virtual machine. In this sample, the custom script extension is used to install IIS. |
|[Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) | Removes a resource group and all resources contained within. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional virtual machine PowerShell script samples can be found in the [Azure Windows VM documentation](../windows/powershell-samples.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
