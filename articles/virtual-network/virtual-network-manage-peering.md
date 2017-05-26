---
title: Create, change, or delete Azure virtual network peerings | Microsoft Docs
description: Learn how to create, change, or delete virtual network peerings.
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
ms.date: 05/15/2017
ms.author: jdial

---
# Create, change, or delete virtual network peerings

Learn how to create, change, or delete virtual network (VNet) peerings. Virtual network peering enables you to connect two VNets in the same Azure location through the Azure backbone network. Once peered, the two VNets are still managed as separate resources. Resources connected to either VNet communicate with the same latency and bandwidth as if the resources were connected to the same VNet. If you're not familiar with VNets, we recommend reading the [Virtual network overview](virtual-networks-overview.md) article before creating, changing, or deleting peerings.

## <a name="before"></a>Before you begin

Complete the following tasks before completing steps in any section of this article:

- If you're new to VNets in Azure, we recommend completing the exercise in the [Create your first Azure Virtual Network](virtual-network-get-started-vnet-subnet.md) before reading this article. The exercise helps familiarize you with VNets.
- Review the [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) article to learn about limits for peering.
- Log in to the Azure portal, Azure command-line interface (CLI), or Azure PowerShell with an Azure account. If you don't already have an Azure account, sign up for a [free trial account](https://azure.microsoft.com/free).
- If using PowerShell commands to complete tasks in this article, [install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs?toc=%2fazure%2fvirtual-network%2ftoc.json). Ensure you have the most recent version of the Azure PowerShell cmdlets installed. To get help for PowerShell commands, with examples, type `get-help <command> -full`.
- If using Azure Command-line interface (CLI) commands to complete tasks in this article, [install and configure the Azure CLI](/cli/azure/install-azure-cli?toc=%2fazure%2fvirtual-network%2ftoc.json). Ensure you have the most recent version of the Azure CLI installed. To get help for CLI commands, type `az <command> --help`.

## <a name="about-peering"></a>About peering 

Consider the following constraints before peering VNets:
- The VNets you peer must have non-overlapping IP address spaces.
- You can peer two VNets deployed through Resource Manager or a VNet deployed through Resource Manager with a VNet deployed through the classic deployment model. You cannot peer two VNets created through the classic deployment model. If you're not familiar with Azure deployment models, read the [Understand Azure deployment models](../azure-resource-manager/resource-manager-deployment-model.md?toc=%2fazure%2fvirtual-network%2ftoc.json) article.
- When peering two VNets created through Resource Manager, a peering must be configured for each VNet in the peering. When you create the peering to the second VNet from the first VNet, the peering status is *Initiated*.  When you create the peering from the second VNet to the first VNet, its peering status is *Connected*. If you view the peering status for the first VNet, you see its status changed from *Initiated* to *Connected*. The peering is not successfully established until the peering status for both VNet peerings is *Connected*. 
- When peering a VNet created through Resource Manager with a VNet created through the classic deployment model, you only configure a peering for the VNet deployed through Resource Manager. You cannot configure peering for a VNet (classic), or between two VNets deployed through the classic deployment model. When you create the peering from the VNet (Resource Manager) to the VNet (Classic), the peering status is *Updating*, then shortly changes to *Connected*.   
- A peering is established between two VNets. Peerings are not transitive. If you create peerings between:
    - VNet1 & VNet2
    - VNet2 & VNet3
    There is no peering between VNet1 and VNet3 through VNet2. If you want to set up a peering between VNet1 and VNet3, you have to create a peering between VNet1 and VNet3.
- You can't resolve names in peered VNets using default Azure name resolution. To resolve names in other VNets, you must use a custom DNS server. To learn how to set up your own DNS server, read the [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-using-your-own-dns-server) article.
- Resources in both VNets in the peering can communicate with each other with the same bandwidth and latency as if they were in the same VNet. Each VM size has its own maximum network bandwidth however. To learn more about maximum network bandwidth for different VM sizes, read the [Windows](../virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) VM sizes articles.
- You can peer VNets deployed through Resource Manager that are in the same, or different subscriptions.
- You can peer VNets deployed through different deployment models that are in the same subscription. The ability to peer VNets deployed through different deployment models in different subscriptions is in preview release.
- The subscriptions that both VNets are in must be associated to the same Azure Active Directory tenant. If you don't already have an AD tenant, you can quickly [create one](../active-directory/develop/active-directory-howto-tenant.md?toc=%2fazure%2fvirtual-network%2ftoc.json#start-from-scratch). 
- <a name="roles-permissions"></a>Your account must have the necessary role or permissions to create a peering. For example, if you were peering two VNets named VNet1 and VNet2, your account must be assigned the following minimum role or permissions for each VNet:
    
    |VNet|Deployment model|Role|Permissions|
    |---|---|---|---|
    |VNet1|Resource Manager|[Network Contributor](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor)|Microsoft.Network/virtualNetworks/virtualNetworkPeerings/write|
    | |Classic|[Classic Network Contributor](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#classic-network-contributor)|N/A|
    |VNet2|Resource Manager|[Network Contributor](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor)|Microsoft.Network/virtualNetworks/peer|
    ||Classic|[Classic Network Contributor](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#classic-network-contributor)| N/A|
 Learn more about [built-in roles](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) and assigning specific permissions to [custom roles](../active-directory/role-based-access-control-custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) (Resource Manager only).
- A VNet can be peered to another VNet, and also be connected to another VNet with an Azure virtual network gateway. When VNets are connected through both peering and a gateway, traffic between the VNets flows through the peering configuration, rather than the gateway.
- There is a nominal charge for ingress and egress traffic that utilizes a VNet peering. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/virtual-network).

## <a name="create-peering"></a>Create a peering

>[!NOTE]
>There are several requirements, constraints, and considerations to successfully create a peering. Before creating a peering, ensure you've familiarized yourself with the list of consideration in the [About peering](#about-peering) section of this article.
>

1. Log in to the [portal](https://portal.azure.com) with an account that has the necessary [roles and permissions](#roles-permissions).
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *virtual networks*. When **Virtual networks** appears in the search results, click it. Do not select **Virtual networks (classic)** if it appears in the list, as you cannot create a peering from a VNet deployed through the classic deployment model.
3. In the **Virtual networks** blade that appears, click the virtual network you want to create a peering for.
4. In the pane that appears for the virtual network you selected, click **Peerings** in the **SETTINGS** section.
5. Click **+ Add**. 
6. <a name="add-peering"></a>In the **Add peering** blade, enter or select values for the following settings:
	- **Name:** The name for the peering must be unique within the VNet.
	- **Virtual network deployment model:** Select which deployment model the VNet you want to peer with was deployed through.
	- **I know my resource ID:** If you have read access to the VNet you want to peer with, leave this checkbox unchecked. If you don't have read access to the VNet or subscription you want to peer with, check this box. Enter the full resource ID of the VNet you want to peer with in the **Resource ID** box that appeared when you checked the box. The resource ID you enter must be for a VNet that exists in the same Azure [location](https://azure.microsoft.com/regions) as this VNet. The full resource ID looks similar to /subscriptions/<Id>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/virtualNetworks/<vnet-name>. You can get the resource ID  for a VNet by viewing the properties for a VNet. To learn how to view the properties for a VNet, read the [Create, change, or delete virtual networks](virtual-network-manage-network.md#view-vnet) article.
	- **Subscription:** Select the [subscription](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#subscription) of the VNet you want to peer with. One or more subscriptions are listed, depending on how many subscriptions your account has read access to. If you checked the **Resource ID** checkbox, this setting isn't available. You can peer VNets in different subscriptions as long as both VNets were created through Resource Manager. The ability to peer across subscriptions created through different deployment models is in preview release. Register for the preview before creating a peering between VNets deployed through different deployment models that exist in different subscriptions. Learn more about how to register for the preview and [peer VNets created through different deployment models in different subscriptions](virtual-networks-create-vnetpeering-arm-portal.md#a-namex-modelapeering-virtual-networks-created-through-different-deployment-models).
	- **Virtual network:** Select the VNet you want to peer with. You can select a VNet created through either Azure deployment model, but the VNet must be in the same location as the VNet you're initiating the peering from. You must have read access to the VNet for it to be visible in the list. If a VNet is listed, but grayed out, it may be because the address space for the VNet overlaps with the address space for this VNet. If VNet address spaces overlap, they cannot be peered. If you checked the **Resource ID** checkbox, this setting isn't available.
	- **Allow virtual network access:** Select **Enabled** (default) if you want to enable communication between the two VNets. Enabling communication between VNets allows resources connected to either VNet to communicate with each other with the same bandwidth and latency as if they were connected to the same VNet. All communication between resources in the two VNets is over the Azure private network. The **VirtualNetwork** default tag for network security groups (NSG) encompasses the VNet and peered VNet. To learn more about NSG default tags, read the [Network security groups overview](virtual-networks-nsg.md#default-tags) article.  Select **Disabled** if you don't want traffic to flow to the peered VNet. You might select **Disabled** if you've peered a VNet with another VNet, but occasionally want to disable traffic flow between the two VNets. You may find enabling/disabling is more convenient than deleting and re-creating peerings. When this setting is disabled, traffic doesn't flow between the peered VNets.
	- **Allow forwarded traffic:** Check this box to allow traffic forwarded to the peered VNet (traffic not originating in the peered VNet) to flow to this VNet. Traffic forwarding is common when you've deployed a network virtual appliance (NVA) in the VNet you're peering with and created user-defined routes (UDR) to forward traffic through the NVA. If you leave this box unchecked (default), traffic forwarded from the peered VNet cannot flow to this VNet. While enabling this capability allows the forwarded traffic through the peering, it does not create any UDRs or NVAs. UDRs and NVAs are created separately. Learn about [user-defined routes](virtual-networks-udr-overview.md).
	- **Allow gateway transit:** Check this box if you have a virtual network gateway attached to this VNet and want to allow traffic from the peered VNet to flow through the gateway. For example, this VNet may be attached to an on-premises network through a virtual network gateway. Checking this box allows traffic from the peered VNet to flow through the gateway attached to this VNet. If you check this box, the peered VNet cannot have a gateway configured. The peered VNet must have the **Use remote gateway** checkbox checked when setting up the peering from the other VNet to this VNet. If you leave this box unchecked (default), traffic from the peered VNet still flows to this VNet, but cannot flow through a virtual network gateway attached to this VNet. Learn more about [virtual network gateways](../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-network%2ftoc.json#site-to-site-and-multi-site-ipsecike-vpn-tunnel). 
	
    You cannot enable this option if you're peering a VNet (Resource Manager) with a VNet (classic). Though the traffic flows between the two VNets, the VNet (classic) traffic cannot flow through a network gateway attached to the VNet (Resource Manager).
	- **Use remote gateways:** Check this box to allow traffic from this VNet to flow through a virtual network gateway attached to the VNet you're peering with. For example, the VNet you're peering with has a VPN gateway attached that enables communication to an on-premises network.  Checking this box allows traffic from this VNet to flow through the VPN gateway attached to the peered VNet. If you check this box, the peered VNet must have a virtual network gateway attached to it and must have the **Allow gateway transit** checkbox checked. If you leave this box unchecked (default), traffic from the peered VNet can still flow to this VNet, but cannot flow through a virtual network gateway attached to this VNet. 
	
    You cannot enable this option if you're peering a VNet (Resource Manager) with a VNet (classic). Though the traffic flows between the two VNets, the VNet (Resource Manager) traffic cannot flow through a network gateway attached to the VNet (classic).
7. Click the **OK** button to add the subnet to the VNet you selected.

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
|CLI|[az network vnet peering list](/cli/azure/network/vnet/peering?toc=%2fazure%2fvirtual-network%2ftoc.json#list) to list peerings for a VNet, [az network vnet peering show](/cli/azure/network/vnet/peering?toc=%2fazure%2fvirtual-network%2ftoc.json#show) to show settings for a specific peering, and [az network vnet peering update](/cli/azure/network/vnet/peering?toc=%2fazure%2fvirtual-network%2ftoc.json#update) to change peering settings.|
|PowerShell|[Get-​Azure​Rm​Virtual​Network​Peering](/powershell/module/azurerm.network/get-azurermvirtualnetworkpeering?toc=%2fazure%2fvirtual-network%2ftoc.json) to retrieve view peering settings and [Set-​Azure​Rm​Virtual​Network​Peering](/powershell/module/azurerm.network/set-azurermvirtualnetworkpeering?toc=%2fazure%2fvirtual-network%2ftoc.json) to change settings.|

## <a name="delete-subnet"></a>Delete a peering
When a peering is deleted, traffic from a VNet no longer flows to the peered VNet. When VNets deployed through Resource Manager are peered, each VNet has a peering to the other VNet. Though deleting the peering from one VNet disables the communication between the VNets, it does not delete the peering from the other VNet. The peering status for the peering that exists in the other VNet is **Disconnected**. You cannot recreate the peering until you re-create the peering in the first VNet and the peering status for both VNets changes to *Connected*. 

If you want VNets to communicate sometimes, but not always, rather than deleting a peering, you can set the **Allow virtual network access** setting to **Disabled** instead. To learn how, read step 6 of the [Create a peering](#create-peering) section of this article. You may find disabling and enabling network access easier than deleting and recreating peerings.

1. Log in to the [portal](https://portal.azure.com) with an account that has the necessary [roles and permissions](#roles-permissions).
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *virtual networks*. When **Virtual networks** appears in the search results, click it.
3. In the **Virtual networks** blade that appears, click the VNet you want to delete a peering from.
4. In the blade that appears for the VNet you selected, click **Peerings** under **Settings**.
5. In the list of peerings that appears in the peerings blade, right-click the peering you want to delete, click **Delete**, then **Yes** to delete the peering from the first VNet.
6. Complete the previous steps to delete the peering from the other VNet in the peering.

**Commands**

|Tool|Command|
|---|---|
|CLI|[az network vnet peering delete](/cli/azure/network/vnet/peering?toc=%2fazure%2fvirtual-network%2ftoc.json#delete)|
|PowerShell|[Remove-​Azure​Rm​Virtual​Network​Peering](/powershell/module/azurerm.network/remove-azurermvirtualnetworkpeering?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name="next-steps"></a>Next steps

Complete one of the following tutorials to peer VNets in the same Azure location:

|Scenario|Deployment tool|
|---|---|
|Peer VNets created through Resource Manager that both exist in the same subscription|[Portal](virtual-networks-create-vnetpeering-arm-portal.md#peering-vnets-in-the-same-subscription), [PowerShell](virtual-networks-create-vnetpeering-arm-ps.md#peering-vnets-in-the-same-subscription)|
|Peer VNets created through Resource Manager that exist in different subscriptions|[Portal](virtual-networks-create-vnetpeering-arm-portal.md#a-namex-subapeering-across-subscriptions), [PowerShell](virtual-networks-create-vnetpeering-arm-ps.md#a-namex-subapeering-across-subscriptions)|
|Peer a VNets created through different deployment models|[Portal](virtual-networks-create-vnetpeering-arm-portal.md#a-namex-modelapeering-virtual-networks-created-through-different-deployment-models), [PowerShell](virtual-networks-create-vnetpeering-arm-ps.md#a-namex-modelapeering-virtual-networks-created-through-different-deployment-models)|
|Create a hub and spoke network topology|[Multiple](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?toc=%2fazure%2fvirtual-network%2ftoc.json#vnet-peering)|



