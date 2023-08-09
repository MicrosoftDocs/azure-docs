---
title: How to reuse an existing virtual network for an Azure Payment HSM
description: How to reuse an existing virtual network for an Azure Payment HSM
services: payment-hsm
author: msmbaldwin
ms.service: payment-hsm
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.topic: overview
ms.date: 09/12/2022
ms.author: mbaldwin
---
# How to reuse an existing virtual network

You can create a payment HSM on an existing virtual network by skipping the "Create a resource group" and "Create a virtual network" steps of [Create a payment HSM with host and management port in same VNet](create-payment-hsm.md), and jumping directly to the creation of a subnet.

## Create a subnet on an existing virtual network

# [Azure CLI](#tab/azure-cli)

To create a subnet, you must know the name, resource group, and address space of the existing virtual network.  To find them, use the Azure CLI [az network vnet list](/cli/azure/network/vnet#az-network-vnet-list) command. You will find the output easier to read if you format it as a table using the -o flag:

```azurecli-interactive
az network vnet list -o table
```

The value returned in the "Prefixes" column, before the backslash, is the address space.

Now use the Azure CLI [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) command to create a new subnet with a delegation of "Microsoft.HardwareSecurityModules/dedicatedHSMs". The address prefixes must fall within the VNet's address space:

```azurecli-interactive
az network vnet subnet create -g "myResourceGroup" --vnet-name "myVNet" -n "myPHSMSubnet" --delegations "Microsoft.HardwareSecurityModules/dedicatedHSMs" --address-prefixes "10.0.0.0/24"
```

To verify that the VNet and subnet were created correctly, use the Azure CLI [az network vnet subnet show](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-show) command:

```azurecli-interactive
az network vnet subnet show -g "myResourceGroup" --vnet-name "myVNet" -n myPHSMSubnet
```

Make note of the subnet's ID, as you will need it for the next step.  The ID of the subnet will end with the name of the subnet:

```json
"id": "/subscriptions/<subscriptionID>/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVNet/subnets/myPHSMSubnet",
```

# [Azure PowerShell](#tab/azure-powershell)

To create a subnet, you must know the name, resource group, and address space of the existing virtual network.  To find them, use the Azure PowerShell [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) cmdlet

```azurepowershell-interactive
Get-AzVirtualNetwork
```

Run [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) again, this time providing the names of the resource group and the virtual network, and save the output to the `$vnet` variable:

```azurepowershell-interactive
$vnet = Get-AzVirtualNetwork -Name "myVNet" -ResourceGroupName "myResourceGroup" 
```

Use the Azure PowerShell [New-AzDelegation](/powershell/module/az.network/new-azdelegation) cmdlet to create a service delegation to be added to your new subnet, and save the output to the `$myDelegation` variable:

```azurepowershell-interactive
$myDelegation = New-AzDelegation -Name "myHSMDelegation" -ServiceName "Microsoft.HardwareSecurityModules/dedicatedHSMs"
```

Use the Azure PowerShell [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) cmdlet to create a virtual network subnet configuration, and save the output to the `$myPHSMSubnet` variable. The address prefixes must fall within the VNet's address space:

```azurepowershell-interactive
$myPHSMSubnetConfig = New-AzVirtualNetworkSubnetConfig -Name "myPHSMSubnet" -AddressPrefix "10.0.0.0/24" -Delegation $myDelegation
```

> [!NOTE]
> The New-AzVirtualNetworkSubnetConfig cmdlet will generate a warning, which you can safely ignore.

Add the new subnet, along with the 'fastpathenabled="True"' tag, to the $vnet variable:

```azurepowershell-interactive
$vnet.Subnets.Add($myPHSMSubnetConfig)
$vnet.Tag = @{fastpathenabled="True"}                      
```

Lastly, update your virtual machine with the Azure PowerShell [Set-AzVirtualNetwork](/powershell/module/az.network/set-AzVirtualNetwork) cmdlet, passing to it the $vnet variable:

```azurepowershell-interactive
Set-AzVirtualNetwork -VirtualNetwork $vnet
```

To verify that the subnet was added correctly, use the Azure PowerShell [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) cmdlet:

```azurepowershell-interactive
Get-AzVirtualNetwork -Name "myVNet" -ResourceGroupName "myResourceGroup"
```

Make note of the subnet's ID, as you will need it for the next step.  The ID of the subnet will end with the name of the subnet:

```json
"Id": "/subscriptions/<subscriptionID>/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVNet/subnets/myPHSMSubnet",
```

---

## Create a payment HSM

Now that you've added a subnet to your existing virtual network, you can create a payment HSM by following the steps in [Create a payment HSM](create-payment-hsm.md#create-a-payment-hsm).  You will need the resource group; name and address space of the virtual network; and name, address space, and ID of the subnet.

## Next steps

- Read an [Overview of Payment HSM](overview.md)
- Find out how to [get started with Azure Payment HSM](getting-started.md)
- See the [Azure Payment HSM frequently asked questions](faq.yml)
