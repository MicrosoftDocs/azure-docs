---
title: Create, change, or delete an Azure virtual network peering | Microsoft Docs
description: Create, change, or delete a virtual network peering. With virtual network peering, you connect virtual networks in the same region and across regions.
services: virtual-network
documentationcenter: na
author: asudbring
manager: twooley
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/01/2021
ms.author: allensu
---

# Create, change, or delete a virtual network peering

Learn how to create, change, or delete a virtual network peering. Virtual network peering enables you to connect virtual networks in the same region and across regions (also known as Global VNet Peering) through the Azure backbone network. Once peered, the virtual networks are still managed as separate resources. If you're new to virtual network peering, you can learn more about it in the [virtual network peering overview](virtual-network-peering-overview.md) or by completing the [virtual network peering tutorial](tutorial-connect-virtual-networks-portal.md).

## Before you begin

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Complete the following tasks before completing steps in any section of this article:

- If you don't already have an Azure account, sign up for a [free trial account](https://azure.microsoft.com/free).
- If using the portal, open [Azure portal](https://portal.azure.com), and sign in with an account that has the [necessary permissions](#permissions) to work with peerings.
- If using PowerShell commands to complete tasks in this article, either run the commands in the [Azure Cloud Shell](https://shell.azure.com/powershell), or by running PowerShell from your computer. The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. This tutorial requires the Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` with an account that has the [necessary permissions](#permissions) to work with peering, to create a connection with Azure.
- If using Azure CLI commands to complete tasks in this article, run the commands via either the [Azure Cloud Shell](https://shell.azure.com/bash) or the Azure CLI running locally. This tutorial requires the Azure CLI version 2.0.31 or later. Run `az --version` to find the installed version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). If you're running the Azure CLI locally, you also need to run `az login` with an account that has the [necessary permissions](#permissions) to work with peering, to create a connection with Azure.

The account you log into, or connect to Azure with, must be assigned to the [network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that gets assigned the appropriate actions listed in [Permissions](#permissions).

## Create a peering

Before creating a peering, familiarize yourself with the requirements and constraints and [necessary permissions](#permissions).

1. In the search box at the top of the Azure portal, enter *Virtual networks* in the search box. When **Virtual networks** appear in the search results, select it. Don't select **Virtual networks (classic)**, as you can't create a peering from a virtual network deployed through the classic deployment model.

    :::image type="content" source="./media/virtual-network-manage-peering/search-vnet.png" alt-text="Screenshot of searching for virtual networks.":::

1. Select the virtual network in the list that you want to create a peering for.

    :::image type="content" source="./media/virtual-network-manage-peering/select-vnet.png" alt-text="Screenshot of selecting VNetA from the virtual networks page.":::

1. Select **Peerings** under *Settings* and then select **+ Add**.

    :::image type="content" source="./media/virtual-network-manage-peering/vneta-peerings.png" alt-text="Screenshot of peerings page for VNetA.":::

1. <a name="add-peering"></a>Enter or select values for the following settings:

    :::image type="content" source="./media/virtual-network-manage-peering/add-peering.png" alt-text="Screenshot of peering configuration page." lightbox="./media/virtual-network-manage-peering/add-peering-expanded.png":::

    | Settings | Description |
    | -------- | ----------- |
    | Peering link name (This virtual network) | The name for the peering must be unique within the virtual network. |
    | Traffic to remote virtual network | Select **Allow (default)** if you want to enable communication between the two virtual networks through the default `VirtualNetwork` flow. Enabling communication between virtual networks allows resources that are connected to either virtual network to communicate with each other with the same bandwidth and latency as if they were connected to the same virtual network. All communication between resources in the two virtual networks is over the Azure private network. The **VirtualNetwork** service tag for network security groups encompasses the virtual network and peered virtual network when this setting is **Allowed**. To learn more about network security group service tags, see [Network security groups overview](./network-security-groups-overview.md#service-tags). Select **Block all traffic to the remote virtual network** if you don't want traffic to flow to the peered virtual network by default. You can select this setting if you have peering between two virtual networks but occasionally want to disable default traffic flow between the two. You may find enabling/disabling is more convenient than deleting and re-creating peerings. When this setting is disabled, traffic doesn't flow between the peered virtual networks by default; however, traffic may still flow if explicitly allowed through a [network security group](./network-security-groups-overview.md) rule that includes the appropriate IP addresses or application security groups. </br></br> **NOTE:** *Disabling the **Block all traffic to remote virtual network** setting only changes the definition of the **VirtualNetwork** service tag. It *doesn't* fully prevent traffic flow across the peer connection, as explained in this setting description.* |
    | Traffic forwarded from remote virtual network | Select **Allowed (default)** if you want traffic *forwarded* by a network virtual appliance in a virtual network (that didn't originate from the virtual network) to flow to this virtual network through a peering. For example, consider three virtual networks named Spoke1, Spoke2, and Hub. A peering exists between each spoke virtual network and the Hub virtual network, but peerings doesn't exist between the spoke virtual networks. A network virtual appliance gets deployed in the Hub virtual network, and user-defined routes gets applied to each spoke virtual network that route traffic between the subnets through the network virtual appliance. If this setting isn't set for the peering between each spoke virtual network and the hub virtual network, traffic doesn't flow between the spoke virtual networks because the hub isn't forwarding the traffic between the virtual networks. While enabling this capability allows the forwarded traffic through the peering, it does not create any user-defined routes or network virtual appliances. User-defined routes and network virtual appliances are created separately. Learn about [user-defined routes](virtual-networks-udr-overview.md#user-defined). You don't need to check this setting if traffic is forwarded between virtual networks through an Azure VPN Gateway. |
    | Virtual network gateway or Route Server | Select **Use this virtual network's gateway or Route Server**: </br> - If you have a virtual network gateway deployed in this virtual network and want to allow traffic from the peered virtual network to flow through the gateway. For example, this virtual network may be attached to an on-premises network through a virtual network gateway. The gateway can be an ExpressRoute or VPN gateway. Checking this box allows traffic from the peered virtual network to flow through the gateway attached to this virtual network to the on-premises network. If you check this box, the peered virtual network cannot have a gateway configured. </br> - If you have a Route Server deployed in this virtual network and you want the peered virtual network to communicate with the Route Server to exchange routes. For more information, see [Azure Route Server](../route-server/overview.md). </br></br> The peered virtual network must have the **Use the remote virtual network's gateway or Route Server** select when setting up the peering from the other virtual network to this virtual network. If you leave this setting as **None (default)**, traffic from the peered virtual network still flows to this virtual network, but cannot flow through a virtual network gateway attached to this virtual network or able to learn routes from the Route Server. If the peering is between a virtual network (Resource Manager) and a virtual network (classic), the gateway must be in the virtual network (Resource Manager). |
    | Remote virtual network peering link name | The name for the remote virtual network peer. |
    | Virtual network deployment model | Select which deployment model the virtual network you want to peer with was deployed through. |
    | I know my resource ID | If you have read access to the virtual network you want to peer with, leave this checkbox unchecked. If you don't have read access to the virtual network or subscription you want to peer with, check this box. Enter the full resource ID of the virtual network you want to peer with in the **Resource ID** box that appeared when you checked the box. The resource ID you enter must be for a virtual network that exists in the same, or [supported different](#requirements-and-constraints) Azure [region](https://azure.microsoft.com/regions) as this virtual network. The full resource ID looks similar to `/subscriptions/<Id>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/virtualNetworks/<virtual-network-name>`. You can get the resource ID  for a virtual network by viewing the properties for a virtual network. To learn how to view the properties for a virtual network, see [Manage virtual networks](manage-virtual-network.md#view-virtual-networks-and-settings). If the subscription is associated to a different Azure Active Directory tenant than the subscription with the virtual network you're creating the peering from, first add a user from each tenant as a [guest user](../active-directory/external-identities/add-users-administrator.md?toc=%2fazure%2fvirtual-network%2ftoc.json#add-guest-users-to-the-directory) in the opposite tenant. |
    | Resource ID | This field appears when you checked the box . The resource ID you enter must be for a virtual network that exists in the same, or [supported different](#requirements-and-constraints) Azure [region](https://azure.microsoft.com/regions) as this virtual network. The full resource ID looks similar to `/subscriptions/<Id>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/virtualNetworks/<virtual-network-name>`. You can get the resource ID  for a virtual network by viewing the properties for a virtual network. To learn how to view the properties for a virtual network, see [Manage virtual networks](manage-virtual-network.md#view-virtual-networks-and-settings). If the subscription is associated to a different Azure Active Directory tenant than the subscription with the virtual network you're creating the peering from, first add a user from each tenant as a [guest user](../active-directory/external-identities/add-users-administrator.md?toc=%2fazure%2fvirtual-network%2ftoc.json#add-guest-users-to-the-directory) in the opposite tenant.
    | Subscription | Select the [subscription](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#subscription) of the virtual network you want to peer with. One or more subscriptions are listed, depending on how many subscriptions your account has read access to. If you checked the **Resource ID** checkbox, this setting isn't available. |
    | Virtual network | Select the virtual network you want to peer with. You can select a virtual network created through either Azure deployment model. If you want to select a virtual network in a different region, you must select a virtual network in a [supported region](#cross-region). You must have read access to the virtual network for it to be visible in the list. If a virtual network is listed, but grayed out, it may be because the address space for the virtual network overlaps with the address space for this virtual network. If virtual network address spaces overlap, they cannot be peered. If you checked the **Resource ID** checkbox, this setting isn't available. |
    | Traffic to remote virtual network | Select **Allow (default)** if you want to enable communication between the two virtual networks through the default `VirtualNetwork` flow. Enabling communication between virtual networks allows resources connected to either virtual network to communicate with each other with the same bandwidth and latency as if they were connected to the same virtual network. All communication between resources in the two virtual networks is over the Azure private network. The **VirtualNetwork** service tag for network security groups encompasses the virtual network and peered virtual network when this setting is **Allowed**. (To learn more about network security group service tags, see [Network security groups overview](./network-security-groups-overview.md#service-tags).) Select **Block all traffic to the remote virtual network** if you don't want traffic to flow to the peered virtual network by default. You might select **Block all traffic to the remote virtual network** if you've peered a virtual network with another virtual network, but occasionally want to disable default traffic flow between the two virtual networks. You may find enabling/disabling is more convenient than deleting and re-creating peerings. When this setting is disabled, traffic doesn't flow between the peered virtual networks by default; however, traffic may still flow if explicitly allowed through a [network security group](./network-security-groups-overview.md) rule that includes the appropriate IP addresses or application security groups. </br></br> **NOTE:** *Disabling the **Block all traffic to remote virtual network** setting only changes the definition of the **VirtualNetwork** service tag. It *doesn't* fully prevent traffic flow across the peer connection, as explained in this setting description.* |
    | Traffic forwarded from remote virtual network | Leave as **Allow (default)** to allow traffic *forwarded* by a network virtual appliance in a virtual network (that didn't originate from the virtual network) to flow to this virtual network through a peering. For example, consider three virtual networks named Spoke1, Spoke2, and Hub. A virtual network peering exists between each spoke virtual network and the Hub virtual network, but virtual network peering doesn't exist between the spoke virtual networks. A network virtual appliance gets deployed in the Hub virtual network, and user-defined routes gets applied to each spoke virtual network to route traffic between the subnets through the network virtual appliance. If this setting isn't selected for the peering between each spoke virtual network and the hub virtual network, traffic doesn't flow between the spoke virtual networks because the hub isn't forwarding the traffic between the virtual networks. While enabling this capability allows the forwarded traffic through the peering, it doesn't create any user-defined routes or network virtual appliances. User-defined routes and network virtual appliances are created separately. Learn about [user-defined routes](virtual-networks-udr-overview.md#user-defined). You don't need to check this setting if traffic is forwarded between virtual networks through an Azure VPN Gateway. |
    | Virtual network gateway or Route Server | Select **Use this virtual network's gateway or Route Server**: </br>- If you have a virtual network gateway attached to this virtual network and want to allow traffic from the peered virtual network to flow through the gateway. For example, this virtual network may be attached to an on-premises network through a virtual network gateway. The gateway can be an ExpressRoute or VPN gateway. Selecting this setting allows traffic from the peered virtual network to flow through the gateway attached to this virtual network to the on-premises network. </br>- If you have a Route Server deployed in this virtual network and you want the peered virtual network to communicate with the Route Server to exchange routes. For more information, see [Azure Route Server](../route-server/overview.md). </br></br> If you select *Use **this** virtual network's gateway or Router Server*, the peered virtual network can't have a gateway configured. The peered virtual network must have the *Use the **remote** virtual network's gateway or Route Server* selected when setting up the peering from the other virtual network to this virtual network. If you leave this setting as **None (default)**, traffic from the peered virtual network still flows to this virtual network, but can't flow through a virtual network gateway attached to this virtual network. If the peering is between a virtual network (Resource Manager) and a virtual network (classic), the gateway must be in the virtual network (Resource Manager).</br></br> In addition to forwarding traffic to an on-premises network, a VPN gateway can forward network traffic between virtual networks that are peered with the virtual network the gateway is in, without the virtual networks needing to be peered with each other. Using a VPN gateway to forward traffic is useful when you want to use a VPN gateway in a hub (see the hub and spoke example described for **Allow forwarded traffic**) virtual network to route traffic between spoke virtual networks that aren't peered with each other. To learn more about allowing use of a gateway for transit, see [Configure a VPN gateway for transit in a virtual network peering](../vpn-gateway/vpn-gateway-peering-gateway-transit.md?toc=%2fazure%2fvirtual-network%2ftoc.json). This scenario requires implementing user-defined routes that specify the virtual network gateway as the next hop type. Learn about [user-defined routes](virtual-networks-udr-overview.md#user-defined). You can only specify a VPN gateway as a next hop type in a user-defined route, you can't specify an ExpressRoute gateway as the next hop type in a user-defined route. </br></br> Select **Use the remote virtual network gateway or Route Server**: </br>- If you want to allow traffic from this virtual network to flow through a virtual network gateway attached to the virtual network you're peering with. For example, the virtual network you're peering with has a VPN gateway attached that enables communication to an on-premises network. Selecting this setting allows traffic from this virtual network to flow through the VPN gateway attached to the peered virtual network. </br>- If you want this virtual network to use the remote Route Server to exchange routes. For more information, see [Azure Route Server](../route-server/overview.md). </br></br> If you select this setting, the peered virtual network must have a virtual network gateway attached to it and must have the **Use this virtual network's gateway or Route Server** option selected. If you leave this setting as **None (default)**, traffic from the peered virtual network can still flow to this virtual network, but can't flow through a virtual network gateway attached to this virtual network. Only one peering for this virtual network can have this setting enabled. </br></br> **NOTE:** *You can't use remote gateways if you already have a gateway configured in your virtual network. To learn more about using a gateway for transit, see [Configure a VPN gateway for transit in a virtual network peering](../vpn-gateway/vpn-gateway-peering-gateway-transit.md?toc=%2fazure%2fvirtual-network%2ftoc.json)* |
    
    
    > [!NOTE]
    > If you use a Virtual Network Gateway to send on-premises traffic transitively to a peered VNet, the peered VNet IP range for the on-premises VPN device must be set to 'interesting' traffic. Otherwise, your on-premises resources won't be able to communicate with resources in the peered VNet.

1. Select **Add** to configure the peering to the virtual network you selected. After a few seconds, select the **Refresh** button and the peering status will change from *Updating* to *Connected*.

    :::image type="content" source="./media/virtual-network-manage-peering/vnet-peering-connected.png" alt-text="Screenshot of virtual network peering status on peerings page.":::

For step-by-step instructions for implementing peering between virtual networks in different subscriptions and deployment models, see [next steps](#next-steps).

### Commands

- **Azure CLI**: [az network vnet peering create](/cli/azure/network/vnet/peering)
- **PowerShell**: [Add-AzVirtualNetworkPeering](/powershell/module/az.network/add-azvirtualnetworkpeering)

## View or change peering settings

Before changing a peering, familiarize yourself with the requirements and constraints and [necessary permissions](#permissions).

1. Select the virtual network that you would like to view or change the virtual network peering settings.

    :::image type="content" source="./media/virtual-network-manage-peering/vnet-list.png" alt-text="Screenshot of the list of virtual networks in the subscription.":::

1. Select **Peerings** under *Settings* and then select the peering you want to view or change settings for.

    :::image type="content" source="./media/virtual-network-manage-peering/select-peering.png" alt-text="Screenshot of select a peering to change settings from the virtual network.":::

1. Change the appropriate setting. Read about the options for each setting in [step 4](#add-peering) of create a peering. Then select **Save** to complete the configuration changes.

    :::image type="content" source="./media/virtual-network-manage-peering/change-peering-settings.png" alt-text="Screenshot of changing virtual network peering settings.":::

**Commands**

- **Azure CLI**: [az network vnet peering list](/cli/azure/network/vnet/peering) to list peerings for a virtual network, [az network vnet peering show](/cli/azure/network/vnet/peering) to show settings for a specific peering, and [az network vnet peering update](/cli/azure/network/vnet/peering) to change peering settings.|
- **PowerShell**: [Get-AzVirtualNetworkPeering](/powershell/module/az.network/get-azvirtualnetworkpeering) to retrieve view peering settings and [Set-AzVirtualNetworkPeering](/powershell/module/az.network/set-azvirtualnetworkpeering) to change settings.

## Delete a peering

Before deleting a peering, ensure your account has the [necessary permissions](#permissions).

When a peering is deleted, traffic can no longer flow between two virtual networks. When deleting a virtual networking peering, the corresponding peering will also be removed. If you want virtual networks to communicate sometimes, but not always, rather than deleting a peering, you can set the **Traffic to remote virtual network** setting to **Block all traffic to the remote virtual network** instead. You may find disabling and enabling network access easier than deleting and recreating peerings.

1. Select the virtual network in the list that you want to delete a peering for.

    :::image type="content" source="./media/virtual-network-manage-peering/vnet-list.png" alt-text="Screenshot of selecting a virtual network in the subscription.":::

1. Select **Peerings** under *Settings*.

    :::image type="content" source="./media/virtual-network-manage-peering/select-peering.png" alt-text="Screenshot of select a peering to delete from the virtual network.":::

1. On the right side of the peering you want to delete, select the **...** and then select **Delete**.

    :::image type="content" source="./media/virtual-network-manage-peering/delete-peering.png" alt-text="Screenshot of deleting a peering from the virtual network.":::

1.  Select **Yes** to confirm that you want to delete the peering and the corresponding peer.

    :::image type="content" source="./media/virtual-network-manage-peering/confirm-deletion.png" alt-text="Screenshot of peering delete confirmation.":::

1. Complete the previous steps to delete the peering from the other virtual network in the peering.

**Commands**

- **Azure CLI**: [az network vnet peering delete](/cli/azure/network/vnet/peering)
- **PowerShell**: [Remove-AzVirtualNetworkPeering](/powershell/module/az.network/remove-azvirtualnetworkpeering)

## Requirements and constraints

- <a name="cross-region"></a>You can peer virtual networks in the same region, or different regions. Peering virtual networks in different regions is also referred to as *Global VNet Peering*. 
- When creating a global peering, the peered virtual networks can exist in any Azure public cloud region or China cloud regions or Government cloud regions. You can't peer across clouds. For example, a VNet in Azure public cloud cannot be peered to a VNet in Azure China cloud.
- Resources in one virtual network can't communicate with the front-end IP address of a Basic internal load balancer in a globally peered virtual network. Support for Basic Load Balancer only exists within the same region. Support for Standard Load Balancer exists for both, VNet Peering and Global VNet Peering. Services that use a Basic load balancer won't work over Global VNet Peering are documented [here.](virtual-networks-faq.md#what-are-the-constraints-related-to-global-vnet-peering-and-load-balancers)
- You can use remote gateways or allow gateway transit in globally peered virtual networks and locally peered virtual networks.
- The virtual networks can be in the same, or different subscriptions. When you peer virtual networks in different subscriptions, both subscriptions can be associated to the same or different Azure Active Directory tenant. If you don't already have an AD tenant, you can [create one](../active-directory/develop/quickstart-create-new-tenant.md?toc=%2fazure%2fvirtual-network%2ftoc.json-a-new-azure-ad-tenant).
- The virtual networks you peer must have non-overlapping IP address spaces.
- You can't add address ranges to, or delete address ranges from a virtual network's address space once a virtual network is peered with another virtual network. To add or remove address ranges, delete the peering, add or remove the address ranges, then re-create the peering. To add address ranges to, or remove address ranges from virtual networks, see [Manage virtual networks](manage-virtual-network.md).
- You can peer two virtual networks deployed through Resource Manager or a virtual network deployed through Resource Manager with a virtual network deployed through the classic deployment model. You can't peer two virtual networks created through the classic deployment model. If you're not familiar with Azure deployment models, read the [Understand Azure deployment models](../azure-resource-manager/management/deployment-models.md?toc=%2fazure%2fvirtual-network%2ftoc.json) article. You can use a [VPN Gateway](../vpn-gateway/design.md?toc=%2fazure%2fvirtual-network%2ftoc.json#V2V) to connect two virtual networks created through the classic deployment model.
- When peering two virtual networks created through Resource Manager, a peering must be configured for each virtual network in the peering. You see one of the following types for peering status: 
  - *Initiated:* When you create the peering to the second virtual network from the first virtual network, the peering status is *Initiated*. 
  - *Connected:* When you create the peering from the second virtual network to the first virtual network, its peering status is *Connected*. If you view the peering status for the first virtual network, you see its status changed from *Initiated* to *Connected*. The peering is not successfully established until the peering status for both virtual network peerings is *Connected*.
- When peering a virtual network created through Resource Manager with a virtual network created through the classic deployment model, you only configure a peering for the virtual network deployed through Resource Manager. You cannot configure peering for a virtual network (classic), or between two virtual networks deployed through the classic deployment model. When you create the peering from the virtual network (Resource Manager) to the virtual network (Classic), the peering status is *Updating*, then shortly changes to *Connected*.
- A peering is established between two virtual networks. Peerings by itself are not transitive. If you create peerings between:
  - VirtualNetwork1 & VirtualNetwork2	  - VirtualNetwork1 & VirtualNetwork2
  - VirtualNetwork2 & VirtualNetwork3	  - VirtualNetwork2 & VirtualNetwork3


  There is no peering between VirtualNetwork1 and VirtualNetwork3 through VirtualNetwork2. If you want to create a virtual network peering between VirtualNetwork1 and VirtualNetwork3, you have to create a peering between VirtualNetwork1 and VirtualNetwork3. There is no peering between VirtualNetwork1 and VirtualNetwork3 through VirtualNetwork2. If you want VirtualNetwork1 and VirtualNetwork3 to directly communicate, you have to create an explicit peering between VirtualNetwork1 and VirtualNetwork3 or go through an NVA in the Hub network.  
- You can't resolve names in peered virtual networks using default Azure name resolution. To resolve names in other virtual networks, you must use [Azure DNS for private domains](../dns/private-dns-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or a custom DNS server. To learn how to set up your own DNS server, see [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server).
- Resources in peered virtual networks in the same region can communicate with each other with the same bandwidth and latency as if they were in the same virtual network. Each virtual machine size has its own maximum network bandwidth however. To learn more about maximum network bandwidth for different virtual machine sizes, see [Windows](../virtual-machines/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../virtual-machines/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine sizes.
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
- Create and assign [Azure Policy definitions](./policy-reference.md) for virtual networks
