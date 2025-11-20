---
title: Create multiple prefixes for a subnet
titleSuffix: Azure Virtual Network
description: Learn how to configure multiple prefixes for a subnet in an Azure Virtual Network to increase address space capacity.
author: asudbring
ms.author: allensu
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 08/29/2025

#customer intent: As a network administrator, I want to configure multiple prefixes on a subnet in my Azure Virtual Network so that I can expand my address space capacity.

# Customer intent: "As a network administrator, I want to configure multiple address prefixes on a subnet in my virtual network so that I can efficiently manage address space and scale my applications without downtime."
---

# Create multiple prefixes for a subnet in an Azure Virtual Network

Application deployments that need dynamic scaling within a virtual network are at risk of subnet address space exhaustion. Subnets in your virtual networks can host many applications that need the ability to scale out. The `Multiple Address Prefixes on Subnet` capability allows you to scale your virtual machines and Azure Virtual Machine Scale Sets in subnets with ease. The feature eliminates the need to remove all resources from a subnet as a prerequisite for modifying its address prefixes. 

Currently, there isn't a capability to extend subnet space or cross subnet boundaries, which limits the Virtual Machine Scale Set to the available address space in a subnet. But with this feature, Virtual Machine Scale Sets can now take advantage of additional subnet address spaces when scaling up. If the first subnet is full, additional virtual machines or Virtual Machine Scale Sets can spill over to the new address space prefix within the same subnet.

The following limitations still apply as of now:

- The feature only supports virtual machines and virtual machine scale sets and doesn't support Bare Metal or VNet injection for Containers, especially PodSubnet IPAM mode in AKS clusters. Any delegated subnet can't use this feature (except for GatewaySubnets delegated to ExpressRoute Gateway services).

- This feature doesn't support multiple customer address (CA) configurations. When using multiple prefixes on a subnet, you're only able to use a single customer address (CA) configuration. A single IPv4 (Internet Protocol version 4) and single IPv6 (Internet Protocol Version 6) address per NIC (network interface card) is supported.

- This feature is only available currently via command line (PowerShell, CLI) or Azure Resource Manager Templates. Azure portal support is limited. Once additional address prefixes are added, under the `Subnets` blade, you'll be able to see the correct count of `Available IPs` from all the prefixes, but only the first prefix is listed. 
    - You can get the details of subnet configuration and all subnet prefixes by navigating to Virtual Network `Overview` page and selecting `JSON View`.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

> [!CAUTION]
> Subnet properties **addressPrefixes** and **addressPrefix** aren't to be used interchangeably. For best results, use only **addressPrefixes** for both a single address prefix and for multiple address prefixes. If you're already using **addressPrefixes** in your workflows, continue to use this property.

# [PowerShell](#tab/powershell)

- Azure PowerShell installed locally or Azure Cloud Shell.

- Sign in to Azure PowerShell and ensure you select the subscription with which you want to use this feature. For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

- Ensure your `Az.Network` module is 4.3.0 or later. To verify the installed module, use the command Get-InstalledModule -Name `Az.Network`. If the module requires an update, use the command Update-Module -Name `Az.Network` if necessary.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.


# [CLI](#tab/cli)

- The how-to article requires version 2.31.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.


---

## Create a subnet with multiple prefixes

In this section, you create a subnet with multiple prefixes.

# [PowerShell](#tab/powershell)

1. Use [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) to create a resource group named **test-rg** in the **eastus2** location.

    ```azurepowershell
    $rg = @{
        Name = 'test-rg'
        Location = 'eastus2'
    }
    New-AzResourceGroup @rg
    ```

1. Use [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) to create a subnet with multiple prefixes.

    ```azurepowershell
    $subnet = @{
        Name = 'subnet-1'
        AddressPrefix = '10.0.0.0/24', '10.0.1.0/24'
    }
    $subnetConfig = New-AzVirtualNetworkSubnetConfig @subnet 
    ```

1. Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) to create a virtual network with the subnet.

    ```azurepowershell
    $net = @{
        Name = 'vnet-1'
        ResourceGroupName = 'test-rg'
        Location = 'eastus2'
        AddressPrefix = '10.0.0.0/16'
        Subnet = $subnetConfig
    }
    New-AzVirtualNetwork @net
    ```

# [CLI](#tab/cli)

1. Use [az group create](/cli/azure/group#az_group_create) to create a resource group named **test-rg** in the **eastus2** location.

    ```azurecli
    az group create \
        --name test-rg \
        --location eastus2
    ```

1. Use [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create) to create a virtual network.

    ```azurecli
    az network vnet create \
        --name vnet-1 \
        --resource-group test-rg \
        --location eastus2 \
        --address-prefix 10.0.0.0/16
    ```
1. Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_create) to create a subnet with multiple prefixes.

    ```azurecli
    az network vnet subnet create \
        --name subnet-1 \
        --vnet-name vnet-1 \
        --resource-group test-rg \
        --address-prefixes 10.0.0.0/24 10.0.1.0/24
    ```
---

## Update an existing subnet with multiple prefixes

In this section, you add a second prefix on an existing subnet to expand the address space.

# [PowerShell](#tab/powershell)

1. Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) to retrieve the target virtual network configuration in a variable.

    ```azurepowershell
    $vnet = Get-AzVirtualNetwork -ResourceGroupName 'test-rg' -Name 'vnet-1'
    ```

1. Use [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) to add a second address prefix to subnet configuration. Specify both the existing and new address prefixes in this step
  
    > [!IMPORTANT]
    > You must not skip listing the existing subnet prefixes in this step.
    > Only the address prefixes specified here will be applied in next step, all others will be removed if not in use, or result in an error if those are referenced by existing network interfaces.

    ```azurepowershell
    Set-AzVirtualNetworkSubnetConfig -Name 'subnet-1' -VirtualNetwork $vnet -AddressPrefix '10.0.0.0/24', '10.0.1.0/24'
    ```

1. Use [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to apply the updated virtual network configuration.

    ```azurepowershell
    $vnet | Set-AzVirtualNetwork
    ```

1. Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) and [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) to retrieve updated virtual network and subnet configuration. Verify that the subnet now has two address prefixes.

    ```azurepowershell
    Get-AzVirtualNetwork -ResourceGroupName 'test-rg' -Name 'vnet-1' | `
        Get-AzVirtualNetworkSubnetConfig -Name 'subnet-1' | `
        ConvertTo-Json
    ```



# [CLI](#tab/cli)

1. Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_update) to add a second address prefix to subnet configuration and apply the new configuration to the virtual network.

    > [!IMPORTANT]
    > You must not skip listing the existing subnet prefixes in this step.
    > Only the address prefixes specified here will be applied to subnet, all others will be removed if not in use, or result in an error if those are referenced by existing network interfaces.

    ```azurecli
    az network vnet subnet update \
        --name subnet-1 \
        --vnet-name vnet-1 \
        --resource-group test-rg \
        --address-prefixes 10.0.0.0/24 10.0.1.0/24
    ```
---

## Remove a prefix from the subnet

You can also remove the address prefixes from the subnet that aren't being actively used, that is, no existing network interfaces are referencing these address prefixes. In this section, you'll remove an `unused` address prefix.

# [PowerShell](#tab/powershell)

1. Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) to retrieve the target virtual network configuration in a variable.

    ```azurepowershell
    $vnet = Get-AzVirtualNetwork -ResourceGroupName 'test-rg' -Name 'vnet-1'
    ```

1. Use [Get-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) to list all the address prefixes on the target subnet. 

    ```azurepowershell
    Get-AzVirtualNetworkSubnetConfig -Name 'subnet-1' -VirtualNetwork $vnet 
    ```

1. Use [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) to update the list of address prefixes and remove the ones that aren't used.

    > [!IMPORTANT]
    > Only the address prefixes specified here will be applied in next step, all others will be removed if not in use, or result in an error if those are referenced by existing network interfaces.


    ```azurepowershell
    Set-AzVirtualNetworkSubnetConfig -Name 'subnet-1' -VirtualNetwork $vnet -AddressPrefix '10.0.1.0/24'
    ```

1. Use [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to apply the updated virtual network configuration.

    ```azurepowershell
    $vnet | Set-AzVirtualNetwork
    ```

1. Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) and [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) to retrieve updated virtual network and subnet configuration. Verify that the subnet now has two address prefixes.

    ```azurepowershell
    Get-AzVirtualNetwork -ResourceGroupName 'test-rg' -Name 'vnet-1' | `
        Get-AzVirtualNetworkSubnetConfig -Name 'subnet-1' | `
        ConvertTo-Json
    ```


# [CLI](#tab/cli)

1. Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_update) to update the list of address prefixes and remove the ones that aren't used.

    > [!IMPORTANT]
    > You must not skip listing all the required subnet prefixes in this step.
    > Only the address prefixes specified here will be applied to the subnet, all others will be removed if not in use, or result in an error if those are referenced by existing network interfaces

    ```azurecli
    az network vnet subnet update \
        --name subnet-1 \
        --vnet-name vnet-1 \
        --resource-group test-rg \
        --address-prefixes 10.0.1.0/24
    ```
---
