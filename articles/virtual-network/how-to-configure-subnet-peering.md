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

Subnet peering refers to a method of connecting two Virtual Networks (VNETs) by linking only the subnet address spaces rather than the entire VNET address spaces. It lets users specify which subnets are supposed to participate in the peering across the local and remote VNET.

It's an added flexibility built on top of VNET peering, where users get an option to choose specific subnets that need to be peered across VNETs. User can select or is prompted to enter the list of subnets across the VNETs that they want to peer. In contrast, if regular VNET peering, entire address space/subnets across the VNETs get peered.

> [!IMPORTANT]
> Subnet peering is currently in public preview.
> This preview version is provided without a service level agreement, and it is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The following limitations apply during the public preview:

- Subscription whitelisting: To use this feature, you must have the subscription on which you want to configure subnet peering be registered.

- Availability: The feature is available in all regions, however, it can be configured via TF, PS, API, CLI, and ARM template only. Portal experience will be made available soon in future.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 

## Configure subnet peering

<update this for your feature.>

- The how-to article requires version 2.31.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

- To access the subnet peering preview feature, you'll need to register it in your Azure subscription. 

- **Note:** The feature is in preview currently, and it's advised that you test the feature on nonproduction workloads. To use it, you would need to allowlist your subscription. Fill this [form](https://forms.office.com/r/99J2fSfd9L) to get your subscription registered. For more information about registering preview features in your subscription, see [Set up preview features in Azure subscription](/azure/azure-resource-manager/management/preview-features).

In the existing Vnet peering create process, few new optional parameters are introduced. Below is the description/reference of each:

### New Optional Parameters Introduced:

A.
**--peer-complete-vnet**  
This parameter would let user exercise and option to select subnet peering. By default the value for this parameter is set to true, which means entire Vnets are peered (all address spaces/subnets). To use subnet peering, this parameter needs to be set to false. 

Accepted values: 0, 1, f, false, n, no, t, true, y, yes  
Default value: True

B.
**--local-subnet-names**  
This parameter lets user enter local subnet names they want to peer with the remote subnets, in case subnet peering is enabled by setting “peer-complete-vnet’ parameter as 0

C.
**--remote-subnet-names**  
This parameter would let user enter remote subnet names they want to peer with the remote subnets in case subnet peering is enabled by setting “peer-complete-vnet’ parameter as 0

D.
**--enable-only-ipv6** 
This parameter would let user exercise an option to select subnet peering with only IPv6 peering functionality. By default, the value for this parameter is set to false, which means peering would be done over IPv4 addresses by default. If set to true, peering would be done over IPv6 in dual stack subnets

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

1. After creating the required subnets, let's say we want to connect only subnet-1 from vnet-1 and subnet-3 from vnet-2, instead of peering the entire vnet. For this, we use the optional parameters described above to achieve this.

For this, we run the vnet peering create command with the optional parameters.

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

## Subnet Peering Checks and Limitations

Refer the below figure to understand the checks performed while configuring subnet peering and current limitations.

:::image type="content" source=".\media\how-to-configure-subnet-peering\subnet-peering.png" alt-text="Diagram that shows subnet peering.":::

1. The participating subnets **must be unique** and **must belong to unique address spaces**.
    - For example, in the VNET A and VNET C peering (illustrated in the above figure by black arrow headed line) VNET A cannot subnet peer over Subnet 1, Subnet 2 and Subnet 3 with any of the subnets in VNET C as VNET C, as these subnets of VNET A belong to 10.1.0.0/16 Address space which is also present in VNET C.
    - However, VNET A’s Subnet 4 (10.0.1.0/24) can subnet peer with Subnet 5 in VNET C (10.6.1.0/24) as these subnets are unique across the VNETS and they belong to unique address spaces across VNETS. Note that Subnet 4 belongs to 10.0.0.0/16 address space in VNET A and Subnet 5 belongs to 10.6.0.0/16 address space in VNET C.

1. There can be **only one peering link between any two VNETS**. If you want to add or remove subnets from the peering link, then the same peering link will be required to be updated. This also means **multiple exclusive peering between set of subnets are not possible**. <br>
Also, **a given peering link type cannot be changed**. That means, if there's a VNET peering between VNET A and VNET B, and user wants to change that to subnet peering, the existing VNET peering link needs to be deleted, and new peering needs to be created with the required parameters for subnet peering and vice versa.

1. **Number of subnets that can be part of a peering link should be less than or equal to 200.**
    - For example, in the VENT A and VNET B peering link (illustrated by blue arrow headed line), total number of subnets participating in the peering here's 4 (two from VNET A and two from VNET B side). This number should be <=200.

1. In the present release (Public preview and GA March 2025, feature remains behind subscription flag), **forward route from non-peered subnet to peered subnet exists** - i.e. in the current scenario VNET A and VNET B peering, even though Subnet 2 from VNET A side isn't peered, but it will still have route for Subnet 1 and Subnet 2 in VNET B.
    - To clarify more, in the subnet peering for VNET A and VNET B above, customer would expect only Subnet 1 and Subnet 3 from VNET A to have route for Subnet 1 and Subnet 2 in remote VENT B, however, Subnet 2 and Subnet 4 (from local side VNET A which aren't peered) also have route for Subnet 1 and Subnet 2 in remote side (VNET B), meaning the nonpeered subnets can send packet to destination node in the peered subnet, although the packet gets dropped and don't reach VM.

    - We're recommending users to apply NSGs on the participating subnets to allow traffic from only peered subnets/address spaces. This limitation is removed in the post GA release.

1. Subnet Peering and AVNM
    - Connected Group<br>
    If two VNETs are connected in 'Connected Group', and if Subnet peering is configured over these two VNETS, subnet peering takes preference and the connectivity between nonpeered subnets gets dropped.
    - AVNM Connectivity Configuration<br>
    AVNM today can't differentiate between VNET peering and Subnet peering. So let's say if Subnet peering exists between VNET A and VNET B, and later an AVNM user tries to establish a VNET peering between VNET A and VNET B through some connectivity configuration (say Hub and Spoke deployment), AVNM would assume that peering between VNET A and VNET B already exists and would ignore the new peering request. We recommend users to exercise caution in such conflicting scenarios while using AVNM and Subnet peering

## Next steps

Subnet peering helps you have better conservation of IPv4 space,  by letting you reuse address spaces across subnets that need not be peered. It also prevents unnecessary exposure of entire VNet address space through gateways to on-premises environments. With IPv6 only peering, you can further configure peering over IPv6 only for dual-stack subnets or IPv6 only subnets. Explore these capabilities and let us know if you have feedback and suggestions here. Your feedback on the overall feature would help us make Azure networking more powerful and enabling!

To learn more about subnet peering, see [Virtual network peering](/azure/virtual-network/virtual-network-peering-overview.md).
