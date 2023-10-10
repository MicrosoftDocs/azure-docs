---
title: Create, change, or delete an Azure virtual network peering
description: Learn how to create, change, or delete a virtual network peering. With virtual network peering, you connect virtual networks in the same region and across regions.
author: asudbring
tags: azure-resource-manager
ms.service: virtual-network
ms.topic: how-to
ms.date: 08/24/2023
ms.author: allensu
ms.custom: template-how-to, engagement-fy23, devx-track-azurepowershell
---

# Create, change, or delete a virtual network peering

Learn how to create, change, or delete a virtual network peering. Virtual network peering enables you to connect virtual networks in the same region and across regions (also known as Global Virtual Network Peering) through the Azure backbone network. Once peered, the virtual networks are still managed as separate resources. If you're new to virtual network peering, you can learn more about it in the [virtual network peering overview](virtual-network-peering-overview.md) or by completing the [virtual network peering tutorial](tutorial-connect-virtual-networks-portal.md).

## Prerequisites

If you don't have an Azure account with an active subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). Complete one of these tasks before starting the remainder of this article:

# [**Portal**](#tab/peering-portal)

Sign in to the [Azure portal](https://portal.azure.com) with an Azure account that has the [necessary permissions](#permissions) to work with peerings.

# [**PowerShell**](#tab/peering-powershell)

Either run the commands in the [Azure Cloud Shell](https://shell.azure.com/powershell), or run PowerShell locally from your computer. The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. In the Azure Cloud Shell browser tab, find the **Select environment** dropdown list, then pick **PowerShell** if it isn't already selected.

If you're running PowerShell locally, use Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az.Network` to find the installed version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). Run `Connect-AzAccount` to sign in to Azure with an account that has the [necessary permissions](#permissions) to work with VNet peerings.

# [**Azure CLI**](#tab/peering-cli)

Either run the commands in the [Azure Cloud Shell](https://shell.azure.com/bash), or run Azure CLI locally from your computer. The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. In the Azure Cloud Shell browser tab, find the **Select environment** dropdown list, then pick **Bash** if it isn't already selected.

If you're running Azure CLI locally, use Azure CLI version 2.0.31 or later. Run `az --version` to find the installed version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). Run `az login` to sign in to Azure with an account that has the [necessary permissions](#permissions) to work with VNet peerings.

The account you use connect to Azure must be assigned to the [network contributor](../role-based-access-control/built-in-roles.md#network-contributor) role or to a [custom role](../role-based-access-control/custom-roles.md) that gets assigned the appropriate actions listed in [Permissions](#permissions).

---

## Create a peering

Before creating a peering, familiarize yourself with the [requirements and constraints](#requirements-and-constraints) and [necessary permissions](#permissions).

# [**Portal**](#tab/peering-portal)

1. In the search box at the top of the Azure portal, enter **Virtual network**. Select **Virtual networks** in the search results. 

1. In **Virtual networks**, select the network you want to create a peering for.

1. Select **Peerings** in **Settings**. 

1. Select **+ Add**.

1. <a name="add-peering"></a>Enter or select values for the following settings, and then select **Add**.

    | Settings | Description |
    | -------- | ----------- |
    | **This virtual network** | |
    | Peering link name | The name of the peering from the local virtual network. The name must be unique within the virtual network. |
    | Allow 'vnet-1' to access 'vnet-2' | By **default**, this option is selected. </br></br> - To enable communication between the two virtual networks through the default `VirtualNetwork` flow, select **Allow 'vnet-1' to access 'vnet-2' (default)**. This allows resources connected to either virtual network to communicate with each other over the Azure private network. The **VirtualNetwork** service tag for network security groups includes the virtual network and peered virtual network when this setting is selected. To learn more about service tags, see [Azure service tags](./service-tags-overview.md). |
    | Allow 'vnet-1' to receive forwarded traffic from 'vnet-2' | This option **isn't selected by default.** </br></br> -To allow forwarded traffic from the peered virtual network, select **Allow 'vnet-1' to receive forwarded traffic from 'vnet-2'**. This setting can be selected if you want to allow traffic that doesn't originate from **vnet-2** to reach **vnet-1**. For example, if **vnet-2** has an NVA that receives traffic from outside of **vnet-2** that gets forwards to **vnet-1**, you can select this setting to allow that traffic to reach **vnet-1** from **vnet-2**. While enabling this capability allows the forwarded traffic through the peering, it doesn't create any user-defined routes or network virtual appliances. User-defined routes and network virtual appliances are created separately. Learn about [user-defined routes](virtual-networks-udr-overview.md#user-defined). </br></br> **NOTE:** *Not selecting the **Allow 'vnet-1' to receive forwarded traffic from 'vnet-2'** setting only changes the definition of the **VirtualNetwork** service tag. It *doesn't* fully prevent traffic flow across the peer connection, as explained in this setting description.* | 
    | Allow gateway in 'vnet-1' to forward traffic to 'vnet-2' | This option **isn't selected by default**. </br></br> - Select **Allow gateway in 'vnet-1' to forward traffic to 'vnet-2'** if you want **vnet-2** to receive traffic from **vnet-1**'s gateway/Route Server. **vnet-1** must contain a gateway in order for this option to be enabled. |
    | Enable 'vnet-1' to use 'vnet-2' remote gateway | This option **isn't selected by default.**  </br></br> - Select **Enable 'vnet-1' to use 'vnet-2' remote gateway** if you want **vnet-1** to use **vnet-2**'s gateway or Route Server. **vnet-1** can only use a remote gateway or Route Server from one peering connection. **vnet-2** has to have a gateway or Route Server in order for you to select this option. For example, the virtual network you're peering with has a VPN gateway that enables communication to an on-premises network. Selecting this setting allows traffic from this virtual network to flow through the VPN gateway in the peered virtual network. </br></br> You can also select this option, if you want this virtual network to use the remote Route Server to exchange routes, see [Azure Route Server](../route-server/overview.md). </br></br> **NOTE:** *You can't use remote gateways if you already have a gateway configured in your virtual network. To learn more about using a gateway for transit, see [Configure a VPN gateway for transit in a virtual network peering](../vpn-gateway/vpn-gateway-peering-gateway-transit.md)*.| 
    | **Remote virtual network** | |
    | Peering link name | The name of the peering from the remote virtual network. The name must be unique within the virtual network. |
    | Virtual network deployment model | Select which deployment model the virtual network you want to peer with was deployed through. |
    | I know my resource ID | If you have read access to the virtual network you want to peer with, leave this checkbox unchecked. If you don't have read access to the virtual network or subscription you want to peer with, select this checkbox. |
    | Resource ID | This field appears when you check **I know my resource ID** checkbox. The resource ID you enter must be for a virtual network that exists in the same, or [supported different](#requirements-and-constraints) Azure [region](https://azure.microsoft.com/regions) as this virtual network. </br></br> The full resource ID looks similar to `/subscriptions/<Id>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/virtualNetworks/<virtual-network-name>`. </br></br> You can get the resource ID  for a virtual network by viewing the properties for a virtual network. To learn how to view the properties for a virtual network, see [Manage virtual networks](manage-virtual-network.md#view-virtual-networks-and-settings). User permissions must be assigned if the subscription is associated to a different Azure Active Directory tenant than the subscription with the virtual network you're peering. Add a user from each tenant as a [guest user](../active-directory/external-identities/add-users-administrator.md#add-guest-users-to-the-directory) in the opposite tenant.
    | Subscription | Select the [subscription](../azure-glossary-cloud-terminology.md#subscription) of the virtual network you want to peer with. One or more subscriptions are listed, depending on how many subscriptions your account has read access to. If you checked the **I know my resource ID** checkbox, this setting isn't available. |
    | Virtual network | Select the virtual network you want to peer with. You can select a virtual network created through either Azure deployment model. If you want to select a virtual network in a different region, you must select a virtual network in a [supported region](#cross-region). You must have read access to the virtual network for it to be visible in the list. If a virtual network is listed, but grayed out, it may be because the address space for the virtual network overlaps with the address space for this virtual network. If virtual network address spaces overlap, they can't be peered. If you checked the **I know my resource ID** checkbox, this setting isn't available. |
    | Allow 'vnet-2' to access 'vnet-1' | By **default**, this option is selected. </br></br>  - Select **Allow 'vnet-2' to access 'vnet-1'** if you want to enable communication between the two virtual networks through the default `VirtualNetwork` flow. Enabling communication between virtual networks allows resources that are connected to either virtual network to communicate with each other over the Azure private network. The **VirtualNetwork** service tag for network security groups encompasses the virtual network and peered virtual network when this setting is set to **Selected**. To learn more about service tags, see [Azure service tags](./service-tags-overview.md). |
    | Allow 'vnet-2' to receive forwarded traffic from 'vnet-1' | This option **isn't selected by default**. </br></br> -To allow forwarded traffic from the peered virtual network, select **Allow 'vnet-2' to receive forwarded traffic from 'vnet-1'**. This setting can be selected if you want to allow traffic that doesn't originated from **vnet-1** to reach **vnet-2**. For example, if **vnet-1** has an NVA that receives traffic from outside of **vnet-1** that gets forwards to **vnet-2**, you can select this setting to allow that traffic to reach **vnet-2** from **vnet-1**. While enabling this capability allows the forwarded traffic through the peering, it doesn't create any user-defined routes or network virtual appliances. User-defined routes and network virtual appliances are created separately. Learn about [user-defined routes](virtual-networks-udr-overview.md#user-defined). </br></br> **NOTE:** *Not selecting the **Allow 'vnet-1' to receive forwarded traffic from 'vnet-2'** setting only changes the definition of the **VirtualNetwork** service tag. It *doesn't* fully prevent traffic flow across the peer connection, as explained in this setting description.*  |
    | Allow gateway in 'vnet-2' to forward traffic to 'vnet-1' | This option **isn't selected by default**. </br></br> - Select **Allow gateway in 'vnet-2' to forward traffic to 'vnet-1'** if you want **vnet-1** to receive traffic from **vnet-2**'s gateway/Route Server. **vnet-2** must contain a gateway in order for this option to be enabled. |
    | Enable 'vnet-2' to use 'vnet-1's' remote gateway |  This option **isn't selected by default.**  </br></br> - Select **Enable 'vnet-2' to use 'vnet-1' remote gateway** if you want **vnet-2** to use **vnet-1**'s gateway or Route Server. **vnet-2** can only use a remote gateway or Route Server from one peering connection. **vnet-1** has to have a gateway or Route Server in order for you to select this option. For example, the virtual network you're peering with has a VPN gateway that enables communication to an on-premises network. Selecting this setting allows traffic from this virtual network to flow through the VPN gateway in the peered virtual network. </br></br> You can also select this option, if you want this virtual network to use the remote Route Server to exchange routes, see [Azure Route Server](../route-server/overview.md). </br></br> This scenario requires implementing user-defined routes that specify the virtual network gateway as the next hop type. Learn about [user-defined routes](virtual-networks-udr-overview.md#user-defined). You can only specify a VPN gateway as a next hop type in a user-defined route, you can't specify an ExpressRoute gateway as the next hop type in a user-defined route. </br></br> **NOTE:** *You can't use remote gateways if you already have a gateway configured in your virtual network. To learn more about using a gateway for transit, see [Configure a VPN gateway for transit in a virtual network peering](../vpn-gateway/vpn-gateway-peering-gateway-transit.md)*. |
    
    :::image type="content" source="./media/virtual-network-manage-peering/add-peering.png" alt-text="Screenshot of peering configuration page.":::

    > [!NOTE]
    > If you use a Virtual Network Gateway to send on-premises traffic transitively to a peered virtual network, the peered virtual network IP range for the on-premises VPN device must be set to 'interesting' traffic. You may need to add all Azure virtual network's CIDR addresses to the Site-2-Site IPSec VPN Tunnel configuration on the on-premises VPN device. CIDR addresses include resources like such as **Hub**, Spokes, and Point-2-Site IP address pools. Otherwise, your on-premises resources won't be able to communicate with resources in the peered VNet.
    > Interesting traffic is communicated through Phase 2 security associations. The security association creates a dedicated VPN tunnel for each specified subnet. The on-premises and Azure VPN Gateway tier have to support the same number of Site-2-Site VPN tunnels and Azure VNet subnets. Otherwise, your on-premises resources won't be able to communicate with resources in the peered VNet.  Consult your on-premises VPN documentation for instructions to create Phase 2 security associations for each specified Azure VNet subnet. 

1. Select the **Refresh** button after a few seconds, and the peering status will change from **Updating** to **Connected**.

    :::image type="content" source="./media/virtual-network-manage-peering/vnet-peering-connected.png" alt-text="Screenshot of virtual network peering status on peerings page.":::

For step-by-step instructions for implementing peering between virtual networks in different subscriptions and deployment models, see [next steps](#next-steps).

# [**PowerShell**](#tab/peering-powershell)

Use [Add-AzVirtualNetworkPeering](/powershell/module/az.network/add-azvirtualnetworkpeering) to create virtual network peerings.

```azurepowershell-interactive
## Place the virtual network vnet-1 configuration into a variable. ##
$net-1 = @{
        Name = 'vnet-1'
        ResourceGroupName = 'test-rg'
}
$vnet-1 = Get-AzVirtualNetwork @net-1

## Place the virtual network vnet-2 configuration into a variable. ##
$net-2 = @{
        Name = 'vnet-2'
        ResourceGroupName = 'test-rg-2'
}
$vnet-2 = Get-AzVirtualNetwork @net-2

## Create peering from vnet-1 to vnet-2. ##
$peer1 = @{
        Name = 'vnet-1-to-vnet-2'
        VirtualNetwork = $vnet-1
        RemoteVirtualNetworkId = $vnet-2.Id
}
Add-AzVirtualNetworkPeering @peer1

## Create peering from vnet-2 to vnet-1. ##
$peer2 = @{
        Name = 'vnet-2-to-vnet-1'
        VirtualNetwork = $vnet-2
        RemoteVirtualNetworkId = $vnet-1.Id
}
Add-AzVirtualNetworkPeering @peer2
```

# [**Azure CLI**](#tab/peering-cli)

1. Use [az network vnet peering create](/cli/azure/network/vnet/peering#az-network-vnet-peering-create) to create virtual network peerings.

```azurecli-interactive
## Create peering from vnet-1 to vnet-2. ##
az network vnet peering create \
    --name vnet-1-to-vnet-2 \
    --vnet-name vnet-1 \
    --remote-vnet vnet-2 \
    --resource-group test-rg \
    --allow-vnet-access \
    --allow-forwarded-traffic

## Create peering from vnet-2 to vnet-1. ##
az network vnet peering create \
    --name vnet-2-to-vnet-1 \
    --vnet-name vnet-2 \
    --remote-vnet vnet-1 \
    --resource-group test-rg-2 \
    --allow-vnet-access \
    --allow-forwarded-traffic
```

---

## View or change peering settings

Before changing a peering, familiarize yourself with the [requirements and constraints](#requirements-and-constraints) and [necessary permissions](#permissions).

# [**Portal**](#tab/peering-portal)

1. In the search box at the top of the Azure portal, enter **Virtual network**. Select **Virtual networks** in the search results. 

1. Select the virtual network that you would like to view or change its peering settings in **Virtual networks**.

1. Select **Peerings** in **Settings** and then select the peering you want to view or change settings for.

    :::image type="content" source="./media/virtual-network-manage-peering/select-peering.png" alt-text="Screenshot of select a peering to change settings from the virtual network.":::

1. Change the appropriate setting. Read about the options for each setting in [step 4](#add-peering) of create a peering. Then select **Save** to complete the configuration changes.

    :::image type="content" source="./media/virtual-network-manage-peering/change-peering-settings.png" alt-text="Screenshot of changing virtual network peering settings.":::

# [**PowerShell**](#tab/peering-powershell)

Use [Get-AzVirtualNetworkPeering](/powershell/module/az.network/get-azvirtualnetworkpeering) to list peerings of a virtual network and their settings.

```azurepowershell-interactive
$peer = @{
        VirtualNetworkName = 'vnet-1'
        ResourceGroupName = 'test-rg'
}
Get-AzVirtualNetworkPeering @peer
```

Use [Set-AzVirtualNetworkPeering](/powershell/module/az.network/set-azvirtualnetworkpeering) to change peering settings.

```azurepowershell-interactive
## Place the virtual network peering configuration into a variable. ##
$peer = @{
        Name = 'vnet-1-to-vnet-2'
        ResourceGroupName = 'test-rg'
}
$peering = Get-AzVirtualNetworkPeering @peer

# Allow traffic forwarded from remote virtual network. ##
$peering.AllowForwardedTraffic = $True

## Update the peering with changes made. ##
Set-AzVirtualNetworkPeering -VirtualNetworkPeering $peering
```

# [**Azure CLI**](#tab/peering-cli)

Use [az network vnet peering list](/cli/azure/network/vnet/peering#az-network-vnet-peering-list) to list peerings of a virtual network.

```azurecli-interactive
az network vnet peering list \
    --resource-group test-rg \
    --vnet-name vnet-1 \
    --out table
```

Use [az network vnet peering show](/cli/azure/network/vnet/peering#az-network-vnet-peering-show) to show settings for a specific peering.

```azurecli-interactive
az network vnet peering show \
    --resource-group test-rg \
    --name vnet-1-to-vnet-2 \
    --vnet-name vnet-1
```

Use [az network vnet peering update](/cli/azure/network/vnet/peering#az-network-vnet-peering-update) to change peering settings.

```azurecli-interactive
## Block traffic forwarded from remote virtual network. ##
az network vnet peering update \
    --resource-group test-rg \
    --name vnet-1-to-vnet-2 \
    --vnet-name vnet-1 \
    --set allowForwardedTraffic=false
```

---

## Delete a peering

Before deleting a peering, familiarize yourself with the [requirements and constraints](#requirements-and-constraints) and [necessary permissions](#permissions).

# [**Portal**](#tab/peering-portal)

When a peering between two virtual networks is deleted, traffic can no longer flow between the virtual networks. If you want virtual networks to communicate sometimes, but not always, rather than deleting a peering,
deselect the **Allow traffic to remote virtual network** setting if you want to block traffic to the remote virtual network. You may find disabling and enabling network access easier than deleting and recreating peerings.

1. In the search box at the top of the Azure portal, enter **Virtual network**. Select **Virtual networks** in the search results. 

1. Select the virtual network that you would like to view or change its peering settings in **Virtual networks**.

1. Select **Peerings** in **Settings**.

    :::image type="content" source="./media/virtual-network-manage-peering/select-peering.png" alt-text="Screenshot of select a peering to delete from the virtual network.":::

1. On the right side of the peering you want to delete, select the **...** and then select **Delete**.

    :::image type="content" source="./media/virtual-network-manage-peering/delete-peering.png" alt-text="Screenshot of deleting a peering from the virtual network.":::

1.  Select **Yes** to confirm that you want to delete the peering and the corresponding peer.

    :::image type="content" source="./media/virtual-network-manage-peering/confirm-deletion.png" alt-text="Screenshot of peering delete confirmation.":::

    > [!NOTE]
    > When you delete a virtual network peering from a virtual network, the peering from the remote virtual network will also be deleted. 

# [**PowerShell**](#tab/peering-powershell)

Use [Remove-AzVirtualNetworkPeering](/powershell/module/az.network/remove-azvirtualnetworkpeering) to delete virtual network peerings

```azurepowershell-interactive
## Delete vnet-1 to vnet-2 peering. ##
$peer1 = @{
        Name = 'vnet-1-to-vnet-2'
        ResourceGroupName = 'test-rg'
}
Remove-AzVirtualNetworkPeering @peer1

## Delete vnet-2 to vnet-1 peering. ##
$peer2 = @{
        Name = 'vnet-2-to-vnet-1'
        ResourceGroupName = 'test-rg-2'
}
Remove-AzVirtualNetworkPeering @peer2
```

# [**Azure CLI**](#tab/peering-cli)

Use [az network vnet peering delete](/cli/azure/network/vnet/peering#az-network-vnet-peering-delete) to delete virtual network peerings.

```azurecli-interactive
## Delete vnet-1 to vnet-2 peering. ##
az network vnet peering delete \
    --resource-group test-rg \
    --name vnet-1-to-vnet-2 \
    --vnet-name vnet-1

## Delete vnet-2 to vnet-1 peering. ##
az network vnet peering delete \
    --resource-group test-rg-2 \
    --name vnet-2-to-vnet-1 \
    --vnet-name vnet-2
```

---

## Requirements and constraints

- <a name="cross-region"></a>You can peer virtual networks in the same region, or different regions. Peering virtual networks in different regions is also referred to as **Global Virtual Network Peering**.

- When creating a global peering, the peered virtual networks can exist in any Azure public cloud region or China cloud regions or Government cloud regions. You can't peer across clouds. For example, a virtual network in Azure public cloud can't be peered to a virtual network in Microsoft Azure operated by 21Vianet cloud.

- Resources in one virtual network can't communicate with the front-end IP address of a basic load balancer (internal or public) in a globally peered virtual network. Support for basic load balancer only exists within the same region. Support for standard load balancer exists for both, Virtual Network Peering and Global Virtual Network Peering. Some services that use a basic load balancer don't work over global virtual network peering. For more information, see [Constraints related to Global Virtual Network Peering and Load Balancers](virtual-networks-faq.md#what-are-the-constraints-related-to-global-virtual-network-peering-and-load-balancers).

- You can use remote gateways or allow gateway transit in globally peered virtual networks and locally peered virtual networks.

- The virtual networks can be in the same, or different [subscriptions](#next-steps). When you peer virtual networks in different subscriptions, both subscriptions can be associated to the same or different Azure Active Directory tenant. If you don't already have an AD tenant, you can [create one](../active-directory/develop/quickstart-create-new-tenant.md).

- The virtual networks you peer must have nonoverlapping IP address spaces.

- You can peer two virtual networks deployed through Resource Manager or a virtual network deployed through Resource Manager with a virtual network deployed through the classic deployment model. You can't peer two virtual networks created through the classic deployment model. If you're not familiar with Azure deployment models, read the [Understand Azure deployment models](../azure-resource-manager/management/deployment-models.md) article. You can use a [VPN Gateway](../vpn-gateway/design.md#V2V) to connect two virtual networks created through the classic deployment model.

- When you peer two virtual networks created through Resource Manager, a peering must be configured for each virtual network in the peering. You see one of the following types for peering status:

  - **Initiated:** When you create the first peering, its status is *Initiated*. 
  
  - **Connected:** When you create the second peering, peering status becomes **Connected** for both peerings. The peering isn't successfully established until the peering status for both virtual network peerings is **Connected**.

- When peering a virtual network created through Resource Manager with a virtual network created through the classic deployment model, you only configure a peering for the virtual network deployed through Resource Manager. You can't configure peering for a virtual network (classic), or between two virtual networks deployed through the classic deployment model. When you create the peering from the virtual network (Resource Manager) to the virtual network (Classic), the peering status is **Updating**, then shortly changes to **Connected**.

- A peering is established between two virtual networks. Peerings by themselves aren't transitive. If you create peerings between:

  - VirtualNetwork1 and VirtualNetwork2 

  - VirtualNetwork2 and VirtualNetwork3
    
    There's no connectivity between VirtualNetwork1 and VirtualNetwork3 through VirtualNetwork2. If you want VirtualNetwork1 and VirtualNetwork3 to directly communicate, you have to create an explicit peering between VirtualNetwork1 and VirtualNetwork3, or go through an NVA in the **Hub** network. To learn more, see [**Hub**-spoke network topology in Azure](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke).
 
- You can't resolve names in peered virtual networks using default Azure name resolution. To resolve names in other virtual networks, you must use [Azure Private DNS](../dns/private-dns-overview.md) or a custom DNS server. To learn how to set up your own DNS server, see [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server).

- Resources in peered virtual networks in the same region can communicate with each other with the same latency as if they were within the same virtual network. The network throughput is based on the bandwidth that's allowed for the virtual machine, proportionate to its size. There isn't any extra restriction on bandwidth within the peering. Each virtual machine size has its own maximum network bandwidth. To learn more about maximum network bandwidth for different virtual machine sizes, see [Sizes for virtual machines in Azure](../virtual-machines/sizes.md).

- A virtual network can be peered to another virtual network, and also be connected to another virtual network with an Azure virtual network gateway. When virtual networks are connected through both peering and a gateway, traffic between the virtual networks flows through the peering configuration, rather than the gateway.

- Point-to-Site VPN clients must be downloaded again after virtual network peering has been successfully configured to ensure the new routes are downloaded to the client.

- There's a nominal charge for ingress and egress traffic that utilizes a virtual network peering. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/virtual-network).

## Permissions

The accounts you use to work with virtual network peering must be assigned to the following roles:

- [Network Contributor](../role-based-access-control/built-in-roles.md#network-contributor): For a virtual network deployed through Resource Manager.

- [Classic Network Contributor](../role-based-access-control/built-in-roles.md#classic-network-contributor): For a virtual network deployed through, the classic deployment model.

If your account isn't assigned to one of the previous roles, it must be assigned to a [custom role](../role-based-access-control/custom-roles.md) that is assigned the necessary actions from the following table:

| Action                                                          | Name |
|---                                                              |---   |
| **Microsoft.Network/virtualNetworks/virtualNetworkPeerings/write**  | Required to create a peering from virtual network A to virtual network B. Virtual network A must be a virtual network (Resource Manager)          |
| **Microsoft.Network/virtualNetworks/peer/action**                   | Required to create a peering from virtual network B (Resource Manager) to virtual network A                                                       |
| **Microsoft.ClassicNetwork/virtualNetworks/peer/action**                   | Required to create a peering from virtual network B (classic) to virtual network A                                                                |
| **Microsoft.Network/virtualNetworks/virtualNetworkPeerings/read**   | Read a virtual network peering   |
| **Microsoft.Network/virtualNetworks/virtualNetworkPeerings/delete** | Delete a virtual network peering |

## Next steps

- A virtual network peering can be created between virtual networks created through the same, or different deployment models that exist in the same, or different subscriptions. Complete a tutorial for one of the following scenarios:

  |Azure deployment model             | Subscription  |
  |---------                          |---------|
  |Both Resource Manager              |[Same](tutorial-connect-virtual-networks-portal.md)|
  |                                   |[Different](create-peering-different-subscriptions.md)|
  |One Resource Manager, one classic  |[Same](create-peering-different-deployment-models.md)|
  |                                   |[Different](create-peering-different-deployment-models-subscriptions.md)|

- Learn how to create a [**hub** and spoke network topology](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke)

- Create a virtual network peering using [PowerShell](powershell-samples.md) or [Azure CLI](cli-samples.md) sample scripts, or using Azure [Resource Manager templates](template-samples.md)

- Create and assign [Azure Policy definitions](./policy-reference.md) for virtual networks
