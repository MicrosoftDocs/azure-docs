---
title: Create, change, or delete an Azure virtual network peering | Microsoft Docs
description: Learn how to create, change, or delete a virtual network peering.
services: virtual-network
documentationcenter: na
author: jimdial
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/06/2017
ms.author: jdial

---
# Create, change, or delete a virtual network peering

Learn how to create, change, or delete a virtual network peering. Virtual network peering enables you to connect two virtual networks in the same Azure location through the Azure backbone network. Once peered, the two virtual networks are still managed as separate resources. Resources connected to either virtual network communicate with the same latency and bandwidth as if the resources were connected to the same virtual network. If you're not familiar with virtual network peering, we recommend reading the [Virtual network peering overview](virtual-network-peering-overview.md) article and completing the [Create a virtual network peering tutorial](virtual-network-create-peering.md), before completing the tasks in this article.

## <a name="before"></a>Before you begin

Complete the following tasks before completing steps in any section of this article:

- If you're new to virtual network peering in Azure, we recommend completing the [Create a virtual network peering](virtual-network-create-peering.md) tutorial before reading this article.
- Review the [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) article to learn about limits for peering.
- Log in to the Azure portal, Azure command-line interface (CLI), or Azure PowerShell with an Azure account. If you don't already have an Azure account, sign up for a [free trial account](https://azure.microsoft.com/free).
- If using PowerShell commands to complete tasks in this article, [install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs?toc=%2fazure%2fvirtual-network%2ftoc.json). Ensure you have the most recent version of the Azure PowerShell cmdlets installed. To get help for PowerShell commands, with examples, type `get-help <command> -full`.
- If using Azure Command-line interface (CLI) commands to complete tasks in this article, [install and configure the Azure CLI](/cli/azure/install-azure-cli?toc=%2fazure%2fvirtual-network%2ftoc.json). Ensure you have the most recent version of the Azure CLI installed. To get help for CLI commands, type `az <command> --help`.

## <a name="about-peering"></a>About peering 

Consider the following constraints before peering virtual networks:
- The virtual networks you peer must have non-overlapping IP address spaces. 
- You can't add address spaces to, or delete address spaces from a virtual network once a virtual network is peered with another virtual network. To add or remove address spaces, delete the peering, add or remove the address spaces, then re-create the peering. To add address spaces to, or remove address spaces from virtual networks, read the [Create, change, or delete virtual networks](virtual-network-manage-network.md#add-address-spaces) article. 
- You can peer two virtual networks deployed through Resource Manager or a virtual network deployed through Resource Manager with a virtual network deployed through the classic deployment model. You cannot peer two virtual networks created through the classic deployment model. If you're not familiar with Azure deployment models, read the [Understand Azure deployment models](../azure-resource-manager/resource-manager-deployment-model.md?toc=%2fazure%2fvirtual-network%2ftoc.json) article.
- When peering two virtual networks created through Resource Manager, a peering must be configured for each virtual network in the peering. When you create the peering to the second virtual network from the first virtual network, the peering status is *Initiated*.  When you create the peering from the second virtual network to the first virtual network, its peering status is *Connected*. If you view the peering status for the first virtual network, you see its status changed from *Initiated* to *Connected*. The peering is not successfully established until the peering status for both virtual network peerings is *Connected*. 
- When peering a virtual network created through Resource Manager with a virtual network created through the classic deployment model, you only configure a peering for the virtual network deployed through Resource Manager. You cannot configure peering for a virtual network (classic), or between two virtual networks deployed through the classic deployment model. When you create the peering from the virtual network (Resource Manager) to the virtual network (Classic), the peering status is *Updating*, then shortly changes to *Connected*.   
- A peering is established between two virtual networks. Peerings are not transitive. If you create peerings between:
    - Virtual network 1 & virtual network 2
    - Virtual network 2 & virtual network 3

  There is no peering between virtual network 1 and virtual network 3 through virtual network 2. If you want to set up a peering between virtual network 1 and virtual network 3, you have to create a peering between virtual network 1 and virtual network 3.
- You can't resolve names in peered virtual networks using default Azure name resolution. To resolve names in other virtual networks, you must use a custom DNS server. To learn how to set up your own DNS server, read the [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-using-your-own-dns-server) article.
- Resources in both virtual networks in the peering can communicate with each other with the same bandwidth and latency as if they were in the same virtual network. Each virtual machine size has its own maximum network bandwidth however. To learn more about maximum network bandwidth for different virtual machine sizes, read the [Windows](../virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine sizes articles.
- You can peer virtual networks deployed through Resource Manager that are in the same, or different subscriptions.
- You can peer virtual networks deployed through different deployment models that are in the same subscription. The ability to peer virtual networks deployed through different deployment models in different subscriptions is in preview release.
- The subscriptions that both virtual networks are in must be associated to the same Azure Active Directory tenant. If you don't already have an AD tenant, you can quickly [create one](../active-directory/develop/active-directory-howto-tenant.md?toc=%2fazure%2fvirtual-network%2ftoc.json#start-from-scratch). 
- <a name="roles-permissions"></a>Your account must have the necessary role or permissions to create a peering. For example, if you were peering two virtual networks named *Vnet1* and *VNet2*, your account must be assigned the following minimum role or permissions for each virtual network:
    
    |Virtual network|Deployment model|Role|Permissions|
    |---|---|---|---|
    |VNet1|Resource Manager|[Network Contributor](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor)|Microsoft.Network/virtualNetworks/virtualNetworkPeerings/write|
    | |Classic|[Classic Network Contributor](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#classic-network-contributor)|N/A|
    |VNet2|Resource Manager|[Network Contributor](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor)|Microsoft.Network/virtualNetworks/peer|
    ||Classic|[Classic Network Contributor](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#classic-network-contributor)|Microsoft.ClassicNetwork/virtualNetworks/peer|

  Learn more about [built-in roles](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) and assigning specific permissions to [custom roles](../active-directory/role-based-access-control-custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) (Resource Manager only).
- A virtual network can be peered to another virtual network, and also be connected to another virtual network with an Azure virtual network gateway. When virtual networks are connected through both peering and a gateway, traffic between the virtual networks flows through the peering configuration, rather than the gateway.
- There is a nominal charge for ingress and egress traffic that utilizes a virtual network peering. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/virtual-network).

## <a name="create-peering"></a>Create a peering

>[!NOTE]
>There are several requirements, constraints, and considerations to successfully create a peering. Before creating a peering, ensure you've familiarized yourself with the list of consideration in the [About peering](#about-peering) section of this article.
>

1. Log in to the [portal](https://portal.azure.com) with an account that has the necessary [roles and permissions](#roles-permissions).
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *virtual networks*. When **Virtual networks** appears in the search results, click it. Do not select **Virtual networks (classic)** if it appears in the list, as you cannot create a peering from a virtual network deployed through the classic deployment model.
3. In the **Virtual networks** blade that appears, click the virtual network you want to create a peering for.
4. In the pane that appears for the virtual network you selected, click **Peerings** in the **SETTINGS** section.
5. Click **+ Add**. 
6. <a name="add-peering"></a>In the **Add peering** blade, enter or select values for the following settings:
	- **Name:** The name for the peering must be unique within the virtual network.
	- **Virtual network deployment model:** Select which deployment model the virtual network you want to peer with was deployed through.
	- **I know my resource ID:** If you have read access to the virtual network you want to peer with, leave this checkbox unchecked. If you don't have read access to the virtual network or subscription you want to peer with, check this box. Enter the full resource ID of the virtual network you want to peer with in the **Resource ID** box that appeared when you checked the box. The resource ID you enter must be for a virtual network that exists in the same Azure [location](https://azure.microsoft.com/regions) as this virtual network. The full resource ID looks similar to /subscriptions/<Id>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/virtualNetworks/<virtual-network-name>. You can get the resource ID  for a virtual network by viewing the properties for a virtual network. To learn how to view the properties for a virtual network, read the [Create, change, or delete virtual networks](virtual-network-manage-network.md#view-vnet) article.
	- **Subscription:** Select the [subscription](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#subscription) of the virtual network you want to peer with. One or more subscriptions are listed, depending on how many subscriptions your account has read access to. If you checked the **Resource ID** checkbox, this setting isn't available. You can peer virtual networks in different subscriptions as long as both virtual networks were created through Resource Manager. The ability to peer across subscriptions created through different deployment models is in preview release. Register for the preview before creating a peering between virtual networks deployed through different deployment models that exist in different subscriptions. Learn more about how to register for the preview and [peer virtual networks created through different deployment models in different subscriptions](virtual-network-create-peering.md#different-subscriptions-different-deployment-models).
	- **Virtual network:** Select the virtual network you want to peer with. You can select a virtual network created through either Azure deployment model, but the virtual network must be in the same location as the virtual network you're initiating the peering from. You must have read access to the virtual network for it to be visible in the list. If a virtual network is listed, but grayed out, it may be because the address space for the virtual network overlaps with the address space for this virtual network. If virtual network address spaces overlap, they cannot be peered. If you checked the **Resource ID** checkbox, this setting isn't available.
	- **Allow virtual network access:** Select **Enabled** (default) if you want to enable communication between the two virtual networks. Enabling communication between virtual networks allows resources connected to either virtual network to communicate with each other with the same bandwidth and latency as if they were connected to the same virtual network. All communication between resources in the two virtual networks is over the Azure private network. The **VirtualNetwork** default tag for network security groups encompasses the virtual network and peered virtual network. To learn more about network security group default tags, read the [Network security groups overview](virtual-networks-nsg.md#default-tags) article.  Select **Disabled** if you don't want traffic to flow to the peered virtual network. You might select **Disabled** if you've peered a virtual network with another virtual network, but occasionally want to disable traffic flow between the two virtual networks. You may find enabling/disabling is more convenient than deleting and re-creating peerings. When this setting is disabled, traffic doesn't flow between the peered virtual networks.
	- **Allow forwarded traffic:** Check this box to allow traffic forwarded to the peered virtual network (traffic not originating in the peered virtual network) to flow to this virtual network. Traffic forwarding is common when you've deployed a network virtual appliance in the virtual network you're peering with and created user-defined routes to forward traffic through the network virtual appliance. If you leave this box unchecked (default), traffic forwarded from the peered virtual network cannot flow to this virtual network. While enabling this capability allows the forwarded traffic through the peering, it does not create any user-defined routes or network virtual appliances. User-defined routes and network virtual appliances are created separately. Learn about [user-defined routes](virtual-networks-udr-overview.md).
	- **Allow gateway transit:** Check this box if you have a virtual network gateway attached to this virtual network and want to allow traffic from the peered virtual network to flow through the gateway. For example, this virtual network may be attached to an on-premises network through a virtual network gateway. Checking this box allows traffic from the peered virtual network to flow through the gateway attached to this virtual network. If you check this box, the peered virtual network cannot have a gateway configured. The peered virtual network must have the **Use remote gateway** checkbox checked when setting up the peering from the other virtual network to this virtual network. If you leave this box unchecked (default), traffic from the peered virtual network still flows to this virtual network, but cannot flow through a virtual network gateway attached to this virtual network. Learn more about [virtual network gateways](../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-network%2ftoc.json#site-to-site-and-multi-site-ipsecike-vpn-tunnel). 
	
    You cannot enable this option if you're peering a virtual network (Resource Manager) with a virtual network (classic). Though the traffic flows between the two virtual networks, the virtual network (classic) traffic cannot flow through a network gateway attached to the virtual network (Resource Manager).
	- **Use remote gateways:** Check this box to allow traffic from this virtual network to flow through a virtual network gateway attached to the virtual network you're peering with. For example, the virtual network you're peering with has a VPN gateway attached that enables communication to an on-premises network.  Checking this box allows traffic from this virtual network to flow through the VPN gateway attached to the peered virtual network. If you check this box, the peered virtual network must have a virtual network gateway attached to it and must have the **Allow gateway transit** checkbox checked. If you leave this box unchecked (default), traffic from the peered virtual network can still flow to this virtual network, but cannot flow through a virtual network gateway attached to this virtual network. 
	
    You cannot enable this option if you're peering a virtual network (Resource Manager) with a virtual network (classic). Though the traffic flows between the two virtual networks, the virtual network (Resource Manager) traffic cannot flow through a network gateway attached to the virtual network (classic).
7. Click the **OK** button to add the subnet to the virtual network you selected.

**Commands**

|Tool|Command|
|---|---|
|CLI|[az network vnet peering create](/cli/azure/network/vnet/peering#create?toc=%2fazure%2fvirtual-network%2ftoc.json#create)|
|PowerShell|[Add-​Azure​Rm​Virtual​Network​Peering](/powershell/module/azurerm.network/add-azurermvirtualnetworkpeering?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name="change-subnet"></a>View or change peering settings

1. Log in to the [portal](https://portal.azure.com) with an account that has the necessary [roles and permissions](#roles-permissions).
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *virtual networks*. When **Virtual networks** appears in the search results, click it.
3. In the **Virtual networks** blade that appears, click the virtual network you want to create a peering for.
4. In the pane that appears for the virtual network you selected, click **Peerings** in the **SETTINGS** section.
5. Click the peering you want to view or change settings for.
6. Change the appropriate setting. Read about the options for each setting in [step 6](#add-peering) of the Create a peering section of this article. 

    >[!NOTE]
    >There are several requirements, constraints, and considerations to successfully create a peering. Before creating a peering, ensure you've familiarized yourself with the list of consideration in the [About peering](#about-peering) section of this article.
    >

7. Click **Save**.

**Commands**

|Tool|Command|
|---|---|
|CLI|[az network vnet peering list](/cli/azure/network/vnet/peering?toc=%2fazure%2fvirtual-network%2ftoc.json#list) to list peerings for a virtual network, [az network vnet peering show](/cli/azure/network/vnet/peering?toc=%2fazure%2fvirtual-network%2ftoc.json#show) to show settings for a specific peering, and [az network vnet peering update](/cli/azure/network/vnet/peering?toc=%2fazure%2fvirtual-network%2ftoc.json#update) to change peering settings.|
|PowerShell|[Get-​Azure​Rm​Virtual​Network​Peering](/powershell/module/azurerm.network/get-azurermvirtualnetworkpeering?toc=%2fazure%2fvirtual-network%2ftoc.json) to retrieve view peering settings and [Set-​Azure​Rm​Virtual​Network​Peering](/powershell/module/azurerm.network/set-azurermvirtualnetworkpeering?toc=%2fazure%2fvirtual-network%2ftoc.json) to change settings.|

## <a name="delete-subnet"></a>Delete a peering
When a peering is deleted, traffic from a virtual network no longer flows to the peered virtual network. When virtual networks deployed through Resource Manager are peered, each virtual network has a peering to the other virtual network. Though deleting the peering from one virtual network disables the communication between the virtual networks, it does not delete the peering from the other virtual network. The peering status for the peering that exists in the other virtual network is **Disconnected**. You cannot recreate the peering until you re-create the peering in the first virtual network and the peering status for both virtual networks changes to *Connected*. 

If you want virtual networks to communicate sometimes, but not always, rather than deleting a peering, you can set the **Allow virtual network access** setting to **Disabled** instead. To learn how, read step 6 of the [Create a peering](#create-peering) section of this article. You may find disabling and enabling network access easier than deleting and recreating peerings.

1. Log in to the [portal](https://portal.azure.com) with an account that has the necessary [roles and permissions](#roles-permissions).
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *virtual networks*. When **Virtual networks** appears in the search results, click it.
3. In the **Virtual networks** blade that appears, click the virtual network you want to delete a peering from.
4. In the blade that appears for the virtual network you selected, click **Peerings** under **Settings**.
5. In the list of peerings that appears in the peerings blade, right-click the peering you want to delete, click **Delete**, then **Yes** to delete the peering from the first virtual network.
6. Complete the previous steps to delete the peering from the other virtual network in the peering.

**Commands**

|Tool|Command|
|---|---|
|CLI|[az network vnet peering delete](/cli/azure/network/vnet/peering?toc=%2fazure%2fvirtual-network%2ftoc.json#delete)|
|PowerShell|[Remove-​Azure​Rm​Virtual​Network​Peering](/powershell/module/azurerm.network/remove-azurermvirtualnetworkpeering?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name="next-steps"></a>Next steps

- Complete the [virtual network peering tutorial](virtual-network-create-peering.md)
- Create a hub and spoke network topology|[Multiple](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?toc=%2fazure%2fvirtual-network%2ftoc.json#vnet-peering)|



