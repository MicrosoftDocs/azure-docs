---
title: include file
description: include file
services: virtual-network
author: asudbring
ms.service: azure-virtual-network
ms.topic: include
ms.date: 03/26/2026
ms.author: allensu
ms.custom: include file
---

## Deploy Azure Bastion

Azure Bastion uses your browser to connect to virtual machines in your virtual network over Secure Shell (SSH) or Remote Desktop Protocol (RDP) by using their private IP addresses. The virtual machines don't need public IP addresses, client software, or special configuration. For more information about Azure Bastion, see [What is Azure Bastion?](/azure/bastion/bastion-overview).

 [!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

1. Configure a Bastion subnet for your virtual network. This subnet is reserved exclusively for Bastion resources and must be named **AzureBastionSubnet**.

    ```azurepowershell-interactive
    $subnet = @{
        Name = 'AzureBastionSubnet'
        VirtualNetwork = $virtualNetwork
        AddressPrefix = '10.0.1.0/26'
    }
    $subnetConfig = Add-AzVirtualNetworkSubnetConfig @subnet
    ```

1. Set the configuration:

    ```azurepowershell-interactive
    $virtualNetwork | Set-AzVirtualNetwork
    ```

1. Create a public IP address for Bastion. The Bastion host uses the public IP to access SSH and RDP over port 443.

    ```azurepowershell-interactive
    # Variable declarations
    $resourceGroupName = 'test-rg'       # <resource-group>
    $location = 'eastus2'                # <region>

    $ip = @{
            ResourceGroupName = $resourceGroupName
            Name = 'public-ip'
            Location = $location
            AllocationMethod = 'Static'
            Sku = 'Standard'
            Zone = 1,2,3
    }
    New-AzPublicIpAddress @ip
    ```

1. Use the [New-AzBastion](/powershell/module/az.network/new-azbastion) command to create a new Basic SKU Bastion host in **AzureBastionSubnet**:

    ```azurepowershell-interactive
    # Variable declarations
    $bastionName = 'bastion'             # <bastion>
    $resourceGroupName = 'test-rg'       # <resource-group>
    $virtualNetworkName = 'vnet-1'       # <virtual-network>

    $bastion = @{
        Name = $bastionName
        ResourceGroupName = $resourceGroupName
        PublicIpAddressRgName = $resourceGroupName
        PublicIpAddressName = 'public-ip'
        VirtualNetworkRgName = $resourceGroupName
        VirtualNetworkName = $virtualNetworkName
        Sku = 'Basic'
    }
    New-AzBastion @bastion
    ```

It takes about 10 minutes to deploy the Bastion resources. You can create virtual machines in the next section while Bastion deploys to your virtual network.
