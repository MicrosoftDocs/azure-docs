---
title: Configure subnet peering
titleSuffix: Azure Virtual Network
description: Learn how to configure subnet peering for an Azure virtual network.
author: amit916new
ms.author: amitmishra
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 12/09/2025

#customer intent: As a network administrator, I want to configure subnet peering between two virtual networks in azure

# Customer intent: "As a network administrator, I want to configure subnet peering between specific subnets in Azure virtual networks, so that I can optimize connectivity and resource sharing while maintaining control over which subnets participate in the peering."
---

# How to configure subnet peering

Subnet peering connects two virtual networks by linking specific subnets instead of entire virtual network address spaces. This approach gives you granular control over which subnets participate in the peering relationship between local and remote virtual networks.

Subnet peering adds flexibility to virtual network peering. You can choose specific subnets to peer across virtual networks. You specify or enter the list of subnets across the virtual networks that you want to peer. In contrast, regular virtual network peering connects entire address spaces and subnets across the virtual networks.

The following limitations apply when using subnet peering:

- Subscription allowlisting: To use this feature, you must register the subscription on which you want to configure subnet peering. Fill this [form](https://forms.office.com/r/99J2fSfd9L) to get your subscription registered.

- Availability: The feature is available in all regions. However, you can configure it only through Terraform, PowerShell, API, CLI, and ARM template.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- To enable access to this feature, register your subscription through the allowlisting process

## Configure subnet peering

- This article requires version 2.31.0 or later of the Azure CLI. If you use Azure Cloud Shell, the latest version is already installed.

In the existing virtual network peering creation process, a few new optional parameters are introduced. This section describes each parameter:

### New optional parameters

- **--peer-complete-vnet**  
Select subnet peering. By default, the value for this parameter is set to true, which means the entire virtual networks are peered (all address spaces and subnets). To use subnet peering, set this parameter to false.  
Accepted values: 0, 1, f, false, n, no, t, true, y, yes  
Default value: True

- **--local-subnet-names**  
Enter local subnet names you want to peer with the remote subnets when subnet peering is enabled by setting the `peer-complete-vnet` parameter to 0.

- **--remote-subnet-names**  
Enter remote subnet names you want to peer with the local subnets when subnet peering is enabled by setting the `peer-complete-vnet` parameter to 0.

- **--enable-only-ipv6**  
Configure subnet peering over IPv6 address space only (for dual stack subnets). By default, the value for this parameter is set to false. Peering is done over IPv4 addresses by default. If set to true, peering is done over IPv6 in dual stack subnets.  
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
                               [--enable-only-ipv6 {0(default), 1, f, false, n, no, t, true, y, yes}]  
                               [--local-subnet-names] 
                               [--remote-subnet-names] 

```

1. Use [az group create](/cli/azure/group#az_group_create) to create a resource group named **test-rg** in the **eastus2** location.

    ```azurecli
    az group create \
        --name test-rg \
        --location eastus2
    ```

1. Use [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create) to create two virtual networks named vnet-1 and vnet-2.

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

1. After creating the required subnets, you might want to connect only subnet-1 from vnet-1 and subnet-3 from vnet-2, instead of peering the entire virtual network. To achieve this configuration, use the optional parameters described earlier.  
Run the virtual network peering create command with the optional parameters.  
    ```azurecli
    az network vnet peering create --name vnet-1_to_vnet-2
                                   --resource-group test-rg
                                   --vnet-name vnet-1
                                   --remote-vnet vnet-2
                                   --allow-forwarded-traffic 
                                   --allow-gateway-transit 
                                   --allow-vnet-access 
                                   --peer-complete-vnet false
                                   --local-subnet-names subnet-1
                                   --remote-subnet-names subnet-3
    az network vnet peering create --name vnet-2_to_vnet-1
                                   --resource-group test-rg
                                   --vnet-name vnet-2
                                   --remote-vnet vnet-1
                                   --allow-forwarded-traffic 
                                   --allow-gateway-transit 
                                   --allow-vnet-access 
                                   --peer-complete-vnet false
                                   --local-subnet-names subnet-3
                                   --remote-subnet-names subnet-1
    ```  
    **Add a new subnet to peering**
    ```azurecli
    az network vnet peering update --name vnet-1_to_vnet-2
                                   --resource-group test-rg
                                   --vnet-name vnet-1
                                   --local-subnet-names subnet-1 subnet-2
    az network vnet peering update --name vnet-2_to_vnet-1
                                   --resource-group test-rg
                                   --vnet-name vnet-2
                                   --remote-subnet-names subnet-3 subnet-4
    ```  
    **Remove subnets from peering**
    ```azurecli
    az network vnet peering update --name vnet-1_to_vnet-2
                                   --resource-group test-rg
                                   --vnet-name vnet-1
                                   --local-subnet-names subnet-1
    az network vnet peering update --name vnet-2_to_vnet-1
                                   --resource-group test-rg
                                   --vnet-name vnet-2
                                   --remote-subnet-names subnet-3
    ```  
    **Sync peerings**
    ```azurecli
    az network vnet peering sync --name vnet-1_to_vnet-2
                                 --resource-group test-rg
                                 --vnet-name vnet-1
    az network vnet peering sync --name vnet-2_to_vnet-1
                                 --resource-group test-rg
                                 --vnet-name vnet-2
    ```  
    **Show peerings**
    ```azurecli
    az network vnet peering show --name vnet-1_to_vnet-2
                                 --resource-group test-rg
                                 --vnet-name vnet-1
    az network vnet peering show --name vnet-2_to_vnet-1
                                 --resource-group test-rg
                                 --vnet-name vnet-2
    ```

## Subnet peering checks and limitations

The following diagram displays the checks performed while configuring subnet peering and current limitations.

:::image type="content" source=".\media\how-to-configure-subnet-peering\subnet-peering.png" alt-text="Diagram that shows subnet peering.":::

1. The participating subnets **must be unique** and **must belong to unique address spaces**.
    - For example, in the virtual network A and virtual network C peering (illustrated in the figure by black arrow headed line) virtual network A can't subnet peer over Subnet 1, Subnet 2, and Subnet 3 with any of the subnets in virtual network C, as these subnets of virtual network A belong to the 10.1.0.0/16 address space, which is also present in virtual network C.
    - However, virtual network A’s Subnet 4 (10.0.1.0/24) can subnet peer with Subnet 5 in virtual network C (10.6.1.0/24) as these subnets are unique across the virtual networks and they belong to unique address spaces across virtual networks. Subnet 4 belongs to 10.0.0.0/16 address space in virtual network A and Subnet 5 belongs to 10.6.0.0/16 address space in virtual network C.

1. There can be **only one peering link between any two virtual networks**. If you want to add or remove subnets from the peering link, then you need to update the same peering link. **Multiple exclusive peering between set of subnets aren't possible**.<br>
**You can't change a given peering link type**. If there's a virtual network peering between virtual network A and virtual network B, and you want to change that peering to subnet peering, you must delete the existing virtual network peering link and create a new peering with the required parameters for subnet peering and vice versa.

1. **The number of subnets participating in a single peering link is limited to 200 per side** (200 from the local virtual network and 200 from the remote virtual network). Additionally, **the total number of subnets that can be peered across all peering links for a given virtual network shouldn't exceed 1,000**.
    - For example, in the virtual network A and virtual network B peering link (illustrated by blue arrow headed line), the total number of subnets participating in the peering from VNET A should be <=200 and likewise from the VNET B side should be <= 200.
    - The total number of subnets across all the spokes (VNET B and VNET C) that can be peered with VNET A should be <= 1000. In the figure above it's 3 in total (2 from VNET B side, 1 from VNET C side)

1. In the present release (feature remains behind subscription flag), **forward route from non-peered subnet to peered subnet exists** - In the current scenario virtual network A and virtual network B peering, even though Subnet 2 from virtual network A side isn't peered, it still has route for Subnet 1 and Subnet 2 in virtual network B.
    - In the subnet peering for virtual network A and virtual network B, you would expect only Subnet 1 and Subnet 3 from virtual network A to have route for Subnet 1 and Subnet 2 in remote virtual network B. However, Subnet 2 and Subnet 4 (from local side virtual network A isn't peered) also have route for Subnet 1 and Subnet 2 in remote side (virtual network B), meaning the nonpeered subnets can send packet to destination node in the peered subnet, although the packet is dropped and doesn't reach the virtual machine.

    - We recommend that you apply NSGs on the participating subnets to allow traffic from only the peered subnets and address spaces. This limitation is removed in the post GA release.

1. Subnet Peering and AVNM
    - Connected Group<br>
    If two virtual networks are connected in 'Connected Group', and if you configure Subnet peering over these two virtual networks, subnet peering takes preference and the connectivity between nonpeered subnets gets dropped.
    - AVNM Connectivity Configuration<br>
    AVNM today can't differentiate between virtual network peering and subnet peering. If Subnet peering exists between virtual network A and virtual network B, and later an AVNM user tries to establish a virtual network peering between virtual network A and virtual network B through some AVNM connectivity configuration (Hub and Spoke deployment), AVNM assumes that peering between virtual network A and virtual network B already exists and ignores the new peering request. Exercise caution in such conflicting scenarios while using AVNM and Subnet peering.

1. **Hard limitation**: If you are planning to use the feature in production, **you must use Intel based V5 SKUs/migrate to V5 SKUs (Intel based 5th generation of VM SKUs, or AMD Genoa or Cobalt 100 based SKUs)** to avoid possible outage due to a bug seen on older gen SKUs.

## Next steps

Subnet peering helps you conserve IPv4 space by letting you reuse address spaces across subnets that don't need to be connected. It also prevents unnecessary exposure of the entire virtual network address space through gateways to on-premises environments. With IPv6-only peering, you can configure peering over IPv6-only for dual-stack subnets or IPv6-only subnets. Explore these capabilities and share your feedback and suggestions.

To learn more about peering, see [Virtual network peering](./virtual-network-peering-overview.md).
