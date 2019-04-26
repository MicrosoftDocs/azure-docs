---
title: Create a VM with a static private IP address - Azure PowerShell | Microsoft Docs
description: Learn how to create a virtual machine with a private IP address using PowerShell.
services: virtual-network
documentationcenter: na
author: KumudD
manager: twooley
editor: ''
tags: azure-resource-manager

ms.assetid: d5f18929-15e3-40a2-9ee3-8188bc248ed8
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/07/2019
ms.author: kumud
ms.custom: 
---

# Create a virtual machine with a static private IP address using PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

You can create a virtual machine (VM) with a static private IP address. Assign a static private IP address, rather than a dynamic address, if you want to select which address from a subnet is assigned to a VM. Learn more about [static private IP addresses](virtual-network-ip-addresses-overview-arm.md#allocation-method). To change a private IP address assigned to an existing VM from dynamic to static, or to work with public IP addresses, see [Add, change, or remove IP addresses](virtual-network-network-interface-addresses.md).

## Create a virtual machine

You can complete the following steps from your local computer or by using the Azure Cloud Shell. To use your local computer, ensure you have the [Azure PowerShell installed](/powershell/azure/install-az-ps?toc=%2fazure%2fvirtual-network%2ftoc.json). To use the Azure Cloud Shell, select **Try It** in the top right corner of any command box that follows. The Cloud Shell signs you into Azure.

1. If using the Cloud Shell, skip to step 2. Open a command session and sign into Azure with `Connect-AzAccount`.
2. Create a resource group with the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command. The following example creates a resource group in the East US Azure region:

   ```azurepowershell-interactive
   $RgName = "myResourceGroup"
   $Location = "eastus"
   New-AzResourceGroup -Name $RgName -Location $Location
   ```

3. Create a subnet configuration and virtual network with the [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) and [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) commands:

   ```azurepowershell-interactive
   # Create a subnet configuration
   $SubnetConfig = New-AzVirtualNetworkSubnetConfig `
   -Name MySubnet `
   -AddressPrefix 10.0.0.0/24

   # Create a virtual network
   $VNet = New-AzVirtualNetwork `
   -ResourceGroupName $RgName `
   -Location $Location `
   -Name MyVNet `
   -AddressPrefix 10.0.0.0/16 `
   -Subnet $subnetConfig

   # Get the subnet object for use in a later step.
   $Subnet = Get-AzVirtualNetworkSubnetConfig -Name $SubnetConfig.Name -VirtualNetwork $VNet
   ```

4. Create a network interface in the virtual network and assign a private IP address from the subnet to the network interface with the [New-AzNetworkInterfaceIpConfig](/powershell/module/Az.Network/New-AzNetworkInterfaceIpConfig) and [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) commands:

   ```azurepowershell-interactive
   $IpConfigName1 = "IPConfig-1"
   $IpConfig1     = New-AzNetworkInterfaceIpConfig `
     -Name $IpConfigName1 `
     -Subnet $Subnet `
     -PrivateIpAddress 10.0.0.4 `
     -Primary

   $NIC = New-AzNetworkInterface `
     -Name MyNIC `
     -ResourceGroupName $RgName `
     -Location $Location `
     -IpConfiguration $IpConfig1
   ```

5. Create a VM configuration with [New-AzVMConfig](/powershell/module/Az.Compute/New-AzVMConfig), and then create the VM with [New-AzVM](/powershell/module/az.Compute/New-azVM). When prompted, provide a username and password to be used as the sign in credentials for the VM:

   ```azurepowershell-interactive
   $VirtualMachine = New-AzVMConfig -VMName MyVM -VMSize "Standard_DS3"
   $VirtualMachine = Set-AzVMOperatingSystem -VM $VirtualMachine -Windows -ComputerName MyServerVM -ProvisionVMAgent -EnableAutoUpdate
   $VirtualMachine = Add-AzVMNetworkInterface -VM $VirtualMachine -Id $NIC.Id
   $VirtualMachine = Set-AzVMSourceImage -VM $VirtualMachine -PublisherName 'MicrosoftWindowsServer' -Offer 'WindowsServer' -Skus '2012-R2-Datacenter' -Version latest
   New-AzVM -ResourceGroupName $RgName -Location $Location -VM $VirtualMachine -Verbose
   ```

> [!WARNING]
> Though you can add private IP address settings to the operating system, we recommend not doing so until after reading [Add a private IP address to an operating system](virtual-network-network-interface-addresses.md#private).
> 
> 
> <a name = "change-the-allocation-method-for-a-private-ip-address-assigned-to-a-network-interface"></a>
> 
> [!IMPORTANT]
> To access the VM from the internet, you must assign a public IP address to the VM. You can also change a dynamic private IP address assignment to a static assignment. For details, see [Add or change IP addresses](virtual-network-network-interface-addresses.md). Additionally, it's recommended that you limit the network traffic to your VM by associating a network security group to the network interface, the subnet you created the network interface in, or both. For details, see [Manage network security groups](manage-network-security-group.md).

## Clean up resources

When no longer needed, you can use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all of the resources it contains:

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup -Force
```

## Next steps

- Learn more about [private IP addresses](virtual-network-ip-addresses-overview-arm.md#private-ip-addresses) and assigning a [static private IP address](virtual-network-network-interface-addresses.md#add-ip-addresses) to an Azure virtual machine.
- Learn more about creating [Linux](../virtual-machines/windows/tutorial-manage-vm.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and [Windows](../virtual-machines/windows/tutorial-manage-vm.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machines.
