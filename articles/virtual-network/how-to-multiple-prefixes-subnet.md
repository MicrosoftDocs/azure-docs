---
title: Create multiple prefixes for a subnet - Preview
titleSuffix: Azure Virtual Network
description: Learn how to configure multiple prefixes for a subnet in an Azure Virtual Network to increase address space capacity.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.topic: how-to
ms.date: 05/06/2024

#customer intent: As a network administrator, I want to configure multiple prefixes on a subnet in my Azure Virtual Network so that I can expand my address space capacity.

---

# Create multiple prefixes for a subnet in an Azure Virtual Network - Preview

Large deployments of multiple scale apps within a virtual network are at risk of subnet address space exhaustion. Subnets in your virtual networks can host many applications that need the ability to scale out. This feature `AllowMultipleAddressPrefixesOnSubnet` allows you to scale your virtual machines and Azure Virtual Machine Scale Sets in subnets with ease. The feature eliminates the need to remove all resources from a subnet as a prerequisite for modifying its address prefixes. 

Currently, Virtual Machine Scale Sets allows you to specify only one subnet. There isn't capability to extend subnet space or cross subnet boundaries. Virtual Machine Scale Sets can now take advantage of multiple address spaces when scaling up. If the first subnet is full, extra virtual machines spill over to subsequent subnets.

The following limitations apply during the public preview:

- The feature only supports virtual machines and virtual machine scale sets and doesn't support Bare Metal or SWIFT resources. Any delegated subnet can't use this feature.

- This feature doesn't support multiple customer address (CA) configurations. When using multiple prefixes on a subnet, you're only able to use a single customer address (CA) configuration. A single IPv4 (Internet Protocol version 4) and single IPv6 (Internet Protocol Version 6) address per NIC (network interface card) is supported.

> [!IMPORTANT]
> Multiple prefix support for Azure Virtual Network subnets is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

# [PowerShell](#tab/powershell)

- Azure PowerShell installed locally or Azure Cloud Shell.

- Sign in to Azure PowerShell and ensure you select the subscription with which you want to use this feature. For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

- Ensure your `Az.Network` module is 4.3.0 or later. To verify the installed module, use the command Get-InstalledModule -Name `Az.Network`. If the module requires an update, use the command Update-Module -Name `Az.Network` if necessary.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

- To access the multiple subnet prefix preview feature you'll need to register it in your Azure subscription. For more information about registering preview features in your subscription, see [Set up preview features in Azure subscription](/azure/azure-resource-manager/management/preview-features).

    - Azure Feature Exposure Control (AFEC) is available through the Microsoft.Features namespace. For this feature, two AFEC flags will need to be registered in your subscription:
        
        - **Microsoft.Features/providers/Microsoft.Network/features/AllowMultipleAddressPrefixesOnSubnet**
        
        - **Microsoft.Features/providers/Microsoft.Network/features/AllowDeletionOfIpPrefixFromSubnet**
    
    - To register the feature, use the following commands:
    
    ```azurepowershell
    Register-AzProviderFeature -FeatureName AllowMultipleAddressPrefixesOnSubnet -ProviderNamespace Microsoft.Network

    Register-AzProviderFeature -FeatureName AllowDeletionOfIpPrefixFromSubnet -ProviderNamespace Microsoft.Network
    ```

# [CLI](#tab/cli)

- The how-to article requires version 2.31.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

- To access the multiple subnet prefix preview feature you'll need to register it in your Azure subscription. For more information about registering preview features in your subscription, see [Set up preview features in Azure subscription](/azure/azure-resource-manager/management/preview-features).

    - Azure Feature Exposure Control (AFEC) is available through the Microsoft.Features namespace. For this feature, two AFEC flags will need to be registered in your subscription:
        
        - **Microsoft.Features/providers/Microsoft.Network/features/AllowMultipleAddressPrefixesOnSubnet**
        
        - **Microsoft.Features/providers/Microsoft.Network/features/AllowDeletionOfIpPrefixFromSubnet**
    
    - To register the feature, use the following commands:
    
    ```azurecli
    az feature register --namespace Microsoft.Network --name AllowMultipleAddressPrefixesOnSubnet

    az feature register --namespace Microsoft.Network --name AllowDeletionOfIpPrefixFromSubnet
    ```

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
