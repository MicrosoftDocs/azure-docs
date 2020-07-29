---
title: Create, change, or delete an Azure virtual network peering | Microsoft Docs
description: Learn how to create, change, or delete a virtual network peering.
services: virtual-network
documentationcenter: na
author: KumudD
manager: twooley
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: NA
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/01/2019
ms.author: altambaw
---

# Create, change, or delete a virtual network peering

Learn how to create, change, or delete a virtual network peering. Virtual network peering enables you to connect virtual networks in the same region and across regions (also known as Global VNet Peering) through the Azure backbone network. Once peered, the virtual networks are still managed as separate resources. If you're new to virtual network peering, you can learn more about it in the [virtual network peering overview](virtual-network-peering-overview.md) or by completing a [tutorial](tutorial-connect-virtual-networks-portal.md).

## Before you begin

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Complete the following tasks before completing steps in any section of this article:

- If you don't already have an Azure account, sign up for a [free trial account](https://azure.microsoft.com/free).
- If using the portal, open https://portal.azure.com, and log in with an account that has the [necessary permissions](#permissions) to work with peerings.
- If using PowerShell commands to complete tasks in this article, either run the commands in the [Azure Cloud Shell](https://shell.azure.com/powershell), or by running PowerShell from your computer. The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. This tutorial requires the Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you are running PowerShell locally, you also need to run `Connect-AzAccount` with an account that has the [necessary permissions](#permissions) to work with peering, to create a connection with Azure.
- If using Azure Command-line interface (CLI) commands to complete tasks in this article, either run the commands in the [Azure Cloud Shell](https://shell.azure.com/bash), or by running the CLI from your computer. This tutorial requires the Azure CLI version 2.0.31 or later. Run `az --version` to find the installed version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). If you are running the Azure CLI locally, you also need to run `az login` with an account that has the [necessary permissions](#permissions) to work with peering, to create a connection with Azure.

The account you log into, or connect to Azure with, must be assigned to the [network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that is assigned the appropriate actions listed in [Permissions](#permissions).

## Create a peering

Before creating a peering, familiarize yourself with the requirements and constraints and [necessary permissions](#permissions).

1. In the search box at the top of the Azure portal, enter *virtual networks* in the search box. When **Virtual networks** appear in the search results, select it. Do not select **Virtual networks (classic)** if it appears in the list, as you cannot create a peering from a virtual network deployed through the classic deployment model.
2. Select the virtual network in the list that you want to create a peering for.
3. Under **SETTINGS**, select **Peerings**.
4. Select **+ Add**. 
5. <a name="add-peering"></a>Enter or select values for the following settings:
    - **Name:** The name for the peering must be unique within the virtual network.
    - **Virtual network deployment model:** Select which deployment model the virtual network you want to peer with was deployed through.
    - **I know my resource ID:** If you have read access to the virtual network you want to peer with, leave this checkbox unchecked. If you don't have read access to the virtual network or subscription you want to peer with, check this box. Enter the full resource ID of the virtual network you want to peer with in the **Resource ID** box that appeared when you checked the box. The resource ID you enter must be for a virtual network that exists in the same, or [supported different](#requirements-and-constraints) Azure [region](https://azure.microsoft.com/regions) as this virtual network. The full resource ID looks similar to `/subscriptions/<Id>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/virtualNetworks/<virtual-network-name>`. You can get the resource ID  for a virtual network by viewing the properties for a virtual network. To learn how to view the properties for a virtual network, see [Manage virtual networks](manage-virtual-network.md#view-virtual-networks-and-settings). If the subscription is associated to a different Azure Active Directory tenant than the subscription with the virtual network you're creating the peering from, first add a user from each tenant as a [guest user](../active-directory/b2b/add-users-administrator.md?toc=%2fazure%2fvirtual-network%2ftoc.json#add-guest-users-to-the-directory) in the opposite tenant.
    - **Subscription:** Select the [subscription](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#subscription) of the virtual network you want to peer with. One or more subscriptions are listed, depending on how many subscriptions your account has read access to. If you checked the **Resource ID** checkbox, this setting isn't available.
    - **Virtual network:** Select the virtual network you want to peer with. You can select a virtual network created through either Azure deployment model. If you want to select a virtual network in a different region, you must select a virtual network in a [supported region](#cross-region). You must have read access to the virtual network for it to be visible in the list. If a virtual network is listed, but grayed out, it may be because the address space for the virtual network overlaps with the address space for this virtual network. If virtual network address spaces overlap, they cannot be peered. If you checked the **Resource ID** checkbox, this setting isn't available.
    - **Allow virtual network access:** Select **Enabled** (default) if you want to enable communication between the two virtual networks. Enabling communication between virtual networks allows resources connected to either virtual network to communicate with each other with the same bandwidth and latency as if they were connected to the same virtual network. All communication between resources in the two virtual networks is over the Azure private network. The **VirtualNetwork** service tag for network security groups encompasses the virtual network and peered virtual network. To learn more about network security group service tags, see [Network security groups overview](security-overview.md#service-tags). Select **Disabled** if you don't want traffic to flow to the peered virtual network. You might select **Disabled** if you've peered a virtual network with another virtual network, but occasionally want to disable traffic flow between the two virtual networks. You may find enabling/disabling is more convenient than deleting and re-creating peerings. When this setting is disabled, traffic doesn't flow between the peered virtual networks.
    - **Allow forwarded traffic:** Check this box to allow traffic *forwarded* by a network virtual appliance in a virtual network (that didn't originate from the virtual network) to flow to this virtual network through a peering. For example, consider three virtual networks named Spoke1, Spoke2, and Hub. A peering exists between each spoke virtual network and the Hub virtual network, but peerings don't exist between the spoke virtual networks. A network virtual appliance is deployed in the Hub virtual network, and user-defined routes are applied to each spoke virtual network that route traffic between the subnets through the network virtual appliance. If this checkbox is not checked for the peering between each spoke virtual network and the hub virtual network, traffic doesn't flow between the spoke virtual networks because the hub is not forwarding the traffic between the virtual networks. While enabling this capability allows the forwarded traffic through the peering, it does not create any user-defined routes or network virtual appliances. User-defined routes and network virtual appliances are created separately. Learn about [user-defined routes](virtual-networks-udr-overview.md#user-defined). You don't need to check this setting if traffic is forwarded between virtual networks through an Azure VPN Gateway.
    - **Allow gateway transit:** Check this box if you have a virtual network gateway attached to this virtual network and want to allow traffic from the peered virtual network to flow through the gateway. For example, this virtual network may be attached to an on-premises network through a virtual network gateway. The gateway can be an ExpressRoute or VPN gateway. Checking this box allows traffic from the peered virtual network to flow through the gateway attached to this virtual network to the on-premises network. If you check this box, the peered virtual network cannot have a gateway configured. The peered virtual network must have the **Use remote gateways** checkbox checked when setting up the peering from the other virtual network to this virtual network. If you leave this box unchecked (default), traffic from the peered virtual network still flows to this virtual network, but cannot flow through a virtual network gateway attached to this virtual network. If the peering is between a virtual network (Resource Manager) and a virtual network (classic), the gateway must be in the virtual network (Resource Manager).

       In addition to forwarding traffic to an on-premises network, a VPN gateway can forward network traffic between virtual networks that are peered with the virtual network the gateway is in, without the virtual networks needing to be peered with each other. Using a VPN gateway to forward traffic is useful when you want to use a VPN gateway in a hub (see the hub and spoke example described for **Allow forwarded traffic**) virtual network to route traffic between spoke virtual networks that aren't peered with each other. To learn more about allowing use of a gateway for transit, see [Configure a VPN gateway for transit in a virtual network peering](../vpn-gateway/vpn-gateway-peering-gateway-transit.md?toc=%2fazure%2fvirtual-network%2ftoc.json). This scenario requires implementing user-defined routes that specify the virtual network gateway as the next hop type. Learn about [user-defined routes](virtual-networks-udr-overview.md#user-defined). You can only specify a VPN gateway as a next hop type in a user-defined route, you cannot specify an ExpressRoute gateway as the next hop type in a user-defined route.

    - **Use remote gateways:** Check this box to allow traffic from this virtual network to flow through a virtual network gateway attached to the virtual network you're peering with. For example, the virtual network you're peering with has a VPN gateway attached that enables communication to an on-premises network.  Checking this box allows traffic from this virtual network to flow through the VPN gateway attached to the peered virtual network. If you check this box, the peered virtual network must have a virtual network gateway attached to it and must have the **Allow gateway transit** checkbox checked. If you leave this box unchecked (default), traffic from the peered virtual network can still flow to this virtual network, but cannot flow through a virtual network gateway attached to this virtual network.
    
      Only one peering for this virtual network can have this setting enabled.

      You can't use remote gateways if you already have a gateway configured in your virtual network. To learn more about using a gateway for transit, see [Configure a VPN gateway for transit in a virtual network peering](../vpn-gateway/vpn-gateway-peering-gateway-transit.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
        
    > [!NOTE]
    > If you use a Virtual Network Gateway to send on-premises traffic transitively to a peered VNet, the peered VNet IP range for the on-premises VPN device must be set to 'interesting' traffic. Otherwise, your on-premises resources won't be able to communicate with resources in the peered VNet.

6. Select **OK** to add the peering to the virtual network you selected.

For step-by-step instructions for implementing peering between virtual networks in different subscriptions and deployment models, see [next steps](#next-steps).

### Commands

- **Azure CLI**: [az network vnet peering create](/cli/azure/network/vnet/peering)
- **PowerShell**: [Add-AzVirtualNetworkPeering](/powershell/module/az.network/add-azvirtualnetworkpeering)

## View or change peering settings

Before changing a peering, familiarize yourself with the requirements and constraints and [necessary permissions](#permissions).

1. In the search box at the top of the portal, enter *virtual networks* in the search box. When **Virtual networks** appear in the search results, select it. Do not select **Virtual networks (classic)** if it appears in the list, as you cannot create a peering from a virtual network deployed through the classic deployment model.
2. Select the virtual network in the list that you want to change peering settings for.
3. Under **SETTINGS**, select **Peerings**.
4. Select the peering you want to view or change settings for.
5. Change the appropriate setting. Read about the options for each setting in [step 5](#add-peering) of Create a peering.
6. Select **Save**.

**Commands**

- **Azure CLI**: [az network vnet peering list](/cli/azure/network/vnet/peering) to list peerings for a virtual network, [az network vnet peering show](/cli/azure/network/vnet/peering) to show settings for a specific peering, and [az network vnet peering update](/cli/azure/network/vnet/peering) to change peering settings.|
- **PowerShell**: [Get-AzVirtualNetworkPeering](/powershell/module/az.network/get-azvirtualnetworkpeering) to retrieve view peering settings and [Set-AzVirtualNetworkPeering](/powershell/module/az.network/set-azvirtualnetworkpeering) to change settings.

## Delete a peering

Before deleting a peering, ensure your account has the [necessary permissions](#permissions).

When a peering is deleted, traffic from a virtual network no longer flows to the peered virtual network. When virtual networks deployed through Resource Manager are peered, each virtual network has a peering to the other virtual network. Though deleting the peering from one virtual network disables the communication between the virtual networks, it does not delete the peering from the other virtual network. The peering status for the peering that exists in the other virtual network is **Disconnected**. You cannot recreate the peering until you re-create the peering in the first virtual network and the peering status for both virtual networks changes to *Connected*.

If you want virtual networks to communicate sometimes, but not always, rather than deleting a peering, you can set the **Allow virtual network access** setting to **Disabled** instead. To learn how, read step 6 of the Create a peering section of this article. You may find disabling and enabling network access easier than deleting and recreating peerings.

1. In the search box at the top of the portal, enter *virtual networks* in the search box. When **Virtual networks** appear in the search results, select it. Do not select **Virtual networks (classic)** if it appears in the list, as you cannot create a peering from a virtual network deployed through the classic deployment model.
2. Select the virtual network in the list that you want to delete a peering for.
3. Under **SETTINGS**, select **Peerings**.
4. On the right side of the peering you want to delete, select **...**, select **Delete**, then select **Yes** to delete the peering from the first virtual network.
5. Complete the previous steps to delete the peering from the other virtual network in the peering.

**Commands**

- **Azure CLI**: [az network vnet peering delete](/cli/azure/network/vnet/peering)
- **PowerShell**: [Remove-AzVirtualNetworkPeering](/powershell/module/az.network/remove-azvirtualnetworkpeering)

## Requirements and constraints

- <a name="cross-region"></a>You can peer virtual networks in the same region, or different regions. Peering virtual networks in different regions is also referred to as *Global VNet Peering*. 
- When creating a global peering, the peered virtual networks can exist in any Azure public cloud region or China cloud regions or Government cloud regions. You cannot peer across clouds. For example, a VNet in Azure public cloud cannot be peered to a VNet in Azure China cloud.
- Resources in one virtual network cannot communicate with the front-end IP address of a Basic internal load balancer in a globally peered virtual network. Support for Basic Load Balancer only exists within the same region. Support for Standard Load Balancer exists for both, VNet Peering and Global VNet Peering. Services that use a Basic load balancer which will not work over Global VNet Peering are documented [here.](virtual-networks-faq.md#what-are-the-constraints-related-to-global-vnet-peering-and-load-balancers)
- You can use remote gateways or allow gateway transit in globally peered virtual networks and locally peered virtual networks.
- The virtual networks can be in the same, or different subscriptions. When you peer virtual networks in different subscriptions, both subscriptions can be associated to the same or different Azure Active Directory tenant. If you don't already have an AD tenant, you can [create one](../active-directory/develop/quickstart-create-new-tenant.md?toc=%2fazure%2fvirtual-network%2ftoc.json-a-new-azure-ad-tenant). Support for peering across virtual networks from subscriptions associated to different Azure Active Directory tenants is not available in Portal. You can use CLI, PowerShell, or Templates.
- The virtual networks you peer must have non-overlapping IP address spaces.
- You can't add address ranges to, or delete address ranges from a virtual network's address space once a virtual network is peered with another virtual network. To add or remove address ranges, delete the peering, add or remove the address ranges, then re-create the peering. To add address ranges to, or remove address ranges from virtual networks, see [Manage virtual networks](manage-virtual-network.md).
- You can peer two virtual networks deployed through Resource Manager or a virtual network deployed through Resource Manager with a virtual network deployed through the classic deployment model. You cannot peer two virtual networks created through the classic deployment model. If you're not familiar with Azure deployment models, read the [Understand Azure deployment models](../azure-resource-manager/management/deployment-models.md?toc=%2fazure%2fvirtual-network%2ftoc.json) article. You can use a [VPN Gateway](../vpn-gateway/design.md?toc=%2fazure%2fvirtual-network%2ftoc.json#V2V) to connect two virtual networks created through the classic deployment model.
- When peering two virtual networks created through Resource Manager, a peering must be configured for each virtual network in the peering. You see one of the following types for peering status: 
  - *Initiated:* When you create the peering to the second virtual network from the first virtual network, the peering status is *Initiated*. 
  - *Connected:* When you create the peering from the second virtual network to the first virtual network, its peering status is *Connected*. If you view the peering status for the first virtual network, you see its status changed from *Initiated* to *Connected*. The peering is not successfully established until the peering status for both virtual network peerings is *Connected*.
- When peering a virtual network created through Resource Manager with a virtual network created through the classic deployment model, you only configure a peering for the virtual network deployed through Resource Manager. You cannot configure peering for a virtual network (classic), or between two virtual networks deployed through the classic deployment model. When you create the peering from the virtual network (Resource Manager) to the virtual network (Classic), the peering status is *Updating*, then shortly changes to *Connected*.
- A peering is established between two virtual networks. Peerings are not transitive. If you create peerings between:
  - VirtualNetwork1 & VirtualNetwork2
  - VirtualNetwork2 & VirtualNetwork3

  There is no peering between VirtualNetwork1 and VirtualNetwork3 through VirtualNetwork2. If you want to create a virtual network peering between VirtualNetwork1 and VirtualNetwork3, you have to create a peering between VirtualNetwork1 and VirtualNetwork3.
- You can't resolve names in peered virtual networks using default Azure name resolution. To resolve names in other virtual networks, you must use [Azure DNS for private domains](../dns/private-dns-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or a custom DNS server. To learn how to set up your own DNS server, see [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server).
- Resources in peered virtual networks in the same region can communicate with each other with the same bandwidth and latency as if they were in the same virtual network. Each virtual machine size has its own maximum network bandwidth however. To learn more about maximum network bandwidth for different virtual machine sizes, see [Windows](../virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine sizes.
- A virtual network can be peered to another virtual network, and also be connected to another virtual network with an Azure virtual network gateway. When virtual networks are connected through both peering and a gateway, traffic between the virtual networks flows through the peering configuration, rather than the gateway.
- Point-to-Site VPN clients must be downloaded again after virtual network peering has been successfully configured to ensure the new routes are downloaded to the client.
- There is a nominal charge for ingress and egress traffic that utilizes a virtual network peering. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/virtual-network).

## Permissions

The accounts you use to work with virtual network peering must be assigned to the following roles:

- [Network Contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor): For a virtual network deployed through Resource Manager.
- [Classic Network Contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#classic-network-contributor): For a virtual network deployed through the classic deployment model.

If your account is not assigned to one of the previous roles, it must be assigned to a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that is assigned the necessary actions from the following table:

| Action                                                          | Name |
|---                                                              |---   |
| Microsoft.Network/virtualNetworks/virtualNetworkPeerings/write  | Required to create a peering from virtual network A to virtual network B. Virtual network A must be a virtual network (Resource Manager)          |
| Microsoft.Network/virtualNetworks/peer/action                   | Required to create a peering from virtual network B (Resource Manager) to virtual network A                                                       |
| Microsoft.ClassicNetwork/virtualNetworks/peer/action                   | Required to create a peering from virtual network B (classic) to virtual network A                                                                |
| Microsoft.Network/virtualNetworks/virtualNetworkPeerings/read   | Read a virtual network peering   |
| Microsoft.Network/virtualNetworks/virtualNetworkPeerings/delete | Delete a virtual network peering |

## Next steps

- A virtual network peering is created between virtual networks created through the same, or different deployment models that exist in the same, or different subscriptions. Complete a tutorial for one of the following scenarios:

  |Azure deployment model             | Subscription  |
  |---------                          |---------|
  |Both Resource Manager              |[Same](tutorial-connect-virtual-networks-portal.md)|
  |                                   |[Different](create-peering-different-subscriptions.md)|
  |One Resource Manager, one classic  |[Same](create-peering-different-deployment-models.md)|
  |                                   |[Different](create-peering-different-deployment-models-subscriptions.md)|

- Learn how to create a [hub and spoke network topology](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?toc=%2fazure%2fvirtual-network%2ftoc.json)
- Create a virtual network peering using [PowerShell](powershell-samples.md) or [Azure CLI](cli-samples.md) sample scripts, or using Azure [Resource Manager templates](template-samples.md)
- Create and assign [Azure Policy definitions](policy-samples.md) for virtual networks
