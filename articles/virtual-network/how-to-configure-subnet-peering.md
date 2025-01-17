---
title: How to configure subnet peering - Preview
titleSuffix: Azure Virtual Network
description: Learn how to configure subnet peering for an Azure virtual network.
author: amit916new
ms.author: amitmishra
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 12/03/2024

#customer intent: As a network administrator, I want to configure subnet peering between two virtual networks in azure

---

# How to configure subnet peering - Preview


<!-- descriptive text here. Search engine optimization crawls the first few sentences. You'll want to make this first area something that will help a customer find this article in Google search.-->

Subnet peering refers to a method of connecting two Virtual Networks (VNets) by linking only the subnet address spaces rather than the entire VNet address spaces. It lets users specify which subnets are supposed to participate in the peering across the local and remote VNet.

It is an added flexibility built on top of VNet peering, where users get an option to choose specific subnets that need to be peered across VNets. User can select or is prompted to enter the list of subnets across the VNets that they want to peer. In contrast, in the case of regular VNet peering, entire address space/subnets across the VNets get peered.

> [!IMPORTANT]
> Subnet peering is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The following limitations apply during the public preview:

- Subscription whitelisitng: To use this feature, you must have the subscription on which you want to configure subnet peering be whitelisted.

- Availability: The feature is available in all regions, however, it can be configured via TF, PS, API, CLI and ARM only. Portal experience will be made available soon in future.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).


## Configure subnet peering

<update this for your feature.>

- The how-to article requires version 2.31.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

- To access the subnet peering preview feature you'll need to register it in your Azure subscription. For more information about registering preview features in your subscription, see [Set up preview features in Azure subscription](/azure/azure-resource-manager/management/preview-features).

    - Azure Feature Exposure Control (AFEC) is available through the Microsoft.Features namespace. For this feature, below AFEC flag will need to be registered in your subscription:
        
        - **Microsoft.Features/providers/Microsoft.Network/features/AllowMultiplePeeringLinksBetweenVnets**

    - To register the feature, use the following commands:
    
    ```azurecli
    az feature register --namespace Microsoft.Network --name AllowMultiplePeeringLinksBetweenVnets

   az feature show --name AllowMultiplePeeringLinksBetweenVnets --namespace Microsoft.Network --query 'properties.state' -o tsv

It would show ‘registering’

Check again till it shows “Registered”

Subnet peering allows you to control system routes programmed in the NIC. For instance, you can restrict communication between the VNet and specific subnets.

In the existing Vnet peering create process, few new optional parameters are introduced. Below is the description/reference of each:

New Optional Parameters:

A.
--peer-complete-vnet  
This parameter would let user exercise and option to select subnet peering. By default the value for this parameter is set to true, which means entire Vnets are peered (all address spaces/subnets). To use subnet peering, this parameter needs to be set to false. 

Accepted values: 0, 1, f, false, n, no, t, true, y, yes  
Default value: True

B.
 --local-subnet-names  
This parameter lets user enter local subnet names they want to peer with the remote subnets, in case subnet peering is enabled by setting “peer-complete-vnet’ parameter as 0

C.
 --remote-subnet-names  
This parameter would let user enter remote subnet names they want to peer with the remote subnets in case subnet peering is enabled by setting “peer-complete-vnet’ parameter as 0

D.
--is-ipv6-only-peering  
This parameter would let user exercise an option to select subnet peering with only IPv6 peering functionality. By default, the value for this parameter is set to false, which means peering would be done over IPv4 addresses by default. If set to true, peering would be done over IPv6 in case of dual stack subnets

Accepted values: 0, 1, f, false, n, no, t, true, y, yes

```azurecli
az network vnet peering create --name
                               --remote-vnet
                               --resource-group
                               --vnet-name
                               [--allow-forwarded-traffic {0, 1, f, false, n, no, t, true, y, yes}]
                               [--allow-gateway-transit {0, 1, f, false, n, no, t, true, y, yes}]
                               [--allow-vnet-access {0, 1, f, false, n, no, t, true, y, yes}]
                               [--no-wait {0, 1, f, false, n, no, t, true, y, yes}]
                               [--use-remote-gateways {0, 1, f, false, n, no, t, true, y, yes}]
	                           [--peer-complete-vnet {0, 1(default), f, false, n, no, t, true, y, yes}]
                               [--is-ipv6-only-peering {0(default), 1, f, false, n, no, t, true, y, yes}]  
                               [--local-subnet-names] 
                               [--remote-subnet-names] 

```

1. Use [az group create](/cli/azure/group#az_group_create) to create a resource group named **test-rg** in the **eastus2** location.

    ```azurecli
    az group create \
        --name test-rg \
        --location eastus2
    ```

1. Use [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create) to create two virtual networks vnet-1 and vnet-2.

    ```azurecli
    az network vnet create \
        --name vnet-1 \
        --resource-group test-rg \
        --location eastus2 \
        --address-prefix 10.0.0.0/16 && \
    az network vnet create \
        --name vnet-2 \
        --resource-group test-rg \
        --location eastus2 \
        --address-prefix 10.1.0.0/16
    ```

1. Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_create) to create a subnet with multiple prefixes.

    ```azurecli
    az network vnet subnet create \
    --name subnet-1 \
    --resource-group test-rg \
    --vnet-name vnet-1 \
    --address-prefix 10.0.1.0/24 && \
    az network vnet subnet create \
        --name subnet-2 \
        --resource-group test-rg \
        --vnet-name vnet-1 \
        --address-prefix 10.0.2.0/24 && \
    az network vnet subnet create \
        --name subnet-3 \
        --resource-group test-rg \
        --vnet-name vnet-2 \
        --address-prefix 10.1.1.0/24 && \
    az network vnet subnet create \
        --name subnet-4 \
        --resource-group test-rg \
        --vnet-name vnet-2 \
        --address-prefix 10.1.2.0/24
    ```

1. After creating the required subnets, let's say we want to connect only subnet-1 from vnet-1 and subnet-3 from vnet-2, instead of peering the entire vnet. For this we use the optional parameters described above to achieve this.

For this we run the vnet peering create command with the optional parameters.

```azurecli
az network vnet peering create -n vnet-1_to_vnet-2
                               -g test-rg
                               -o none
                               --allow-forwarded-traffic 
                               --allow-gateway-transit 
                               --allow-vnet-access 
                               --peer-complete-vnet fasle
                               --local-subnet-names subnet-1
                               --remote-subnet-names subnet-3

```
## Next steps

Subnet peering helps you have better conservation of IPv4 space,  by letting you re-use address spaces across subnets that need not be peered. It also prevents unnecessary exposure of entire VNet address space through gatways to On-prem environments. With IPv6 only peering, you can further configure peering pver IPv6 only for dual-stack subnets or IPv6 only subnets. Explore these capabilities and let us know if you have feedback and suggestions here. Your feedback on the overall feature would help us make Azure netowrking more powerful and enabling!

To learn more about subnet peering, see [Virtual network peering](/azure/virtual-network/virtual-network-peering-overview.md).
