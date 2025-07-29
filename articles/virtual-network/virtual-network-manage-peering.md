---
title: Create, Change, or Delete Azure Virtual Network Peering
description: Learn how to create, change, or delete Azure virtual network peering to connect virtual networks across regions. Improve connectivity with Azure backbone.
author: asudbring
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 05/08/2025
ms.author: allensu
ms.custom:
  - template-how-to
  - engagement-fy23
  - devx-track-azurepowershell
  - devx-track-azurecli
  - build-2025
# Customer intent: As a network administrator, I want to create, modify, or delete virtual network peerings, so that I can improve connectivity and manage traffic flow between virtual networks across regions using the Azure backbone network.
---

# Create, Change, or Delete Azure Virtual Network Peering

This article explains how to create, change, or delete Azure virtual network peering. Virtual network peering connects virtual networks across regions using the Azure backbone network. Learn more in the [virtual network peering overview](virtual-network-peering-overview.md) or the [virtual network peering tutorial](tutorial-connect-virtual-networks-portal.md).

## Prerequisites

If you don't have an Azure account with an active subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). Complete one of these tasks before starting the remainder of this article:

# [**Portal**](#tab/peering-portal)

Sign in to the [Azure portal](https://portal.azure.com) with an Azure account that has the [necessary permissions](#permissions) to work with peerings.

# [**PowerShell**](#tab/peering-powershell)

Either run the commands in the [Azure Cloud Shell](https://shell.azure.com/powershell), or run PowerShell locally from your computer. The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. In the Azure Cloud Shell browser tab, find the **Select environment** dropdown list, then pick **PowerShell** if it isn't already selected.

If you're running PowerShell locally, use Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az.Network` to find the installed version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). Run `Connect-AzAccount` to sign in to Azure with an account that has the [necessary permissions](#permissions) to work with virtual network peerings.

# [**Azure CLI**](#tab/peering-cli)

Either run the commands in the [Azure Cloud Shell](https://shell.azure.com/bash), or run Azure CLI locally from your computer. The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. In the Azure Cloud Shell browser tab, find the **Select environment** dropdown list, then pick **Bash** if it isn't already selected.

If you're running Azure CLI locally, use Azure CLI version 2.0.31 or later. Run `az --version` to find the installed version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). Run `az login` to sign in to Azure with an account that has the [necessary permissions](#permissions) to work with virtual network peerings.

The account you use connect to Azure must be assigned to the [network contributor](../role-based-access-control/built-in-roles.md#network-contributor) role or to a [custom role](../role-based-access-control/custom-roles.md) that gets assigned the appropriate actions listed in [Permissions](#permissions).

---

<a name="create-a-peering"></a>
## Create a virtual network peering 

Before creating a peering, familiarize yourself with the [requirements and constraints](#requirements-and-constraints) and [necessary permissions](#permissions).

# [**Portal**](#tab/peering-portal)

1. In the search box at the top of the Azure portal, enter **Virtual network**. Select **Virtual networks** in the search results. 

1. In **Virtual networks**, select the network you want to create a peering for.

1. Select **Peerings** in **Settings**. 

1. Select **+ Add**.

1. <a name="add-peering"></a>Enter or select values for the following settings, and then select **Add**.

    | Settings | Description |
    | -------- | ----------- |
    | **Remote virtual network summary** | |
    | Peering link name | The name of the peering from the local virtual network. The name must be unique within the virtual network. |
    | Virtual network deployment model | Select which deployment model the virtual network you want to peer with was deployed through. |
    | I know my resource ID | If you have read access to the virtual network you want to peer with, leave this checkbox unchecked. If you lack read access to the virtual network or subscription you want to peer with, select this checkbox. |
    | Resource ID | This field appears when you check **I know my resource ID** checkbox. The resource ID you enter must be for a virtual network that exists in the same, or [supported different](#requirements-and-constraints) Azure [region](https://azure.microsoft.com/regions) as this virtual network.</br></br> The full resource ID looks similar to `/subscriptions/<Id>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/virtualNetworks/<virtual-network-name>`.</br></br> You can get the resource ID for a virtual network by viewing the properties for a virtual network. To learn how to view the properties for a virtual network, see [Manage virtual networks](manage-virtual-network.yml#view-virtual-networks-and-settings). User permissions must be assigned if the subscription is associated to a different Microsoft Entra tenant than the subscription with the virtual network you're peering. Add a user from each tenant as a [guest user](../active-directory/external-identities/add-users-administrator.md#add-guest-users-to-the-directory) in the opposite tenant. |
    | Subscription | Select the [subscription](../azure-glossary-cloud-terminology.md#subscription) of the virtual network you want to peer with. One or more subscriptions are listed, depending on how many subscriptions your account has access to. |
    | Virtual network | Select the remote virtual network. |
    | **Remote virtual network peering settings** | |
    | Allow the peered virtual network to access 'vnet-1' | By **default**, this option is selected.</br></br> - Select this option to allow traffic from the peered virtual network to 'vnet-1.' This setting enables communication between hub and spoke in hub-spoke network topology and allows a VM in the peered virtual network to communicate with a VM in 'vnet-1.' The **VirtualNetwork** service tag for network security groups includes the virtual network and peered virtual network when this setting is selected. To learn more about service tags, see [Azure service tags](./service-tags-overview.md). |
    | Allow the peered virtual network to receive forwarded traffic from 'vnet-1` | This option **isn't selected by default.** </br></br> - Enabling this option allows the peered virtual network to receive traffic from virtual networks peered to 'vnet-1.' For example, if vnet-2 has an NVA that receives traffic from outside of vnet-2 that forwards to vnet-1, you can select this setting to allow that traffic to reach vnet-1 from vnet-2. While enabling this capability allows the forwarded traffic through the peering, it doesn't create any user-defined routes or network virtual appliances. User-defined routes and network virtual appliances are created separately. | 
    | Allow gateway or route server in the peered virtual network to forward traffic to 'vnet-1' | This option **isn't selected by default**.</br></br> - Enabling this setting allows 'vnet-1' to receive traffic from the peered virtual networks' gateway or route server. In order for this option to be enabled, the peered virtual network must contain a gateway or route server. |
    | Enable the peered virtual network to use 'vnet-1's' remote gateway or route server | This option **isn't selected by default.**  </br></br> - This option can be enabled only if 'vnet-1' has a remote gateway or route server and 'vnet-1' enables "Allow gateway in 'vnet-1' to forward traffic to the peered virtual network." This option can be enabled in only one of the peered virtual networks' peerings.</br></br> You can also select this option, if you want this virtual network to use the remote Route Server to exchange routes, see [Azure Route Server](../route-server/overview.md).</br></br> **NOTE:** *You can't use remote gateways if you already have a gateway configured in your virtual network. To learn more about using a gateway for transit, see [Configure a VPN gateway for transit in a virtual network peering](../vpn-gateway/vpn-gateway-peering-gateway-transit.md)*.| 
    | **Local virtual network summary** | |
    | Peering link name | The name of the peering from the remote virtual network. The name must be unique within the virtual network. |
    | **Local virtual network peering settings** |
    | Allow 'vnet-1' to access the peered virtual network | By **default**, this option is selected.</br></br> - Select this option to allow traffic from 'vnet-1' to the peered virtual network. This setting enables communication between hub and spoke in hub-spoke network topology and allows a VM in 'vnet-1' to communicate with a VM in the peered virtual network. |
    | Allow 'vnet-1' to receive forwarded traffic from the peered virtual network | This option **isn't selected by default.** </br></br> - Enabling this option allows 'vnet-1' to receive traffic from virtual networks peered to the peered virtual network. For example, if vnet-2 has an NVA that receives traffic from outside of vnet-2 that gets forwards to vnet-1, you can select this setting to allow that traffic to reach vnet-1 from vnet-2. While enabling this capability allows the forwarded traffic through the peering, it doesn't create any user-defined routes or network virtual appliances. User-defined routes and network virtual appliances are created separately. |
    | Allow gateway or route server in 'vnet-1' to forward traffic to the peered virtual network | This option **isn't selected by default**.</br></br> - Enabling this setting allows the peered virtual network to receive traffic from 'vnet-1's' gateway or route server. In order for this option to be enabled, 'vnet-1' must contain a gateway or route server. |
    | Enable 'vnet-1' to use the peered virtual networks' remote gateway or route server | This option **isn't selected by default.**  </br></br> - This option can be enabled only if the peered virtual network has a remote gateway or route server and the peered virtual network enables "Allow gateway in the peered virtual network to forward traffic to 'vnet-1.'" This option can be enabled in only one of 'vnet-1's' peerings. |

:::image type="content" source="./media/virtual-network-manage-peering/add-peering.png" alt-text="Screenshot of the Azure portal showing the virtual network peering configuration page.":::

> [!NOTE]
> If you use a Virtual Network Gateway to send on-premises traffic transitively to a peered virtual network, the peered virtual network IP range for the on-premises VPN device must be set to 'interesting' traffic. You might need to add all Azure virtual network's CIDR addresses to the Site-2-Site IPsec VPN Tunnel configuration on the on-premises VPN device. CIDR addresses include resources like such as **Hub**, Spokes, and Point-2-Site IP address pools. Otherwise, your on-premises resources can't communicate with resources in the peered virtual network.
> Interesting traffic is communicated through Phase 2 security associations. The security association creates a dedicated VPN tunnel for each specified subnet. The on-premises and Azure VPN Gateway tier must support the same number of Site-2-Site VPN tunnels and Azure virtual network subnets. Otherwise, your on-premises resources can't communicate with resources in the peered virtual network. Consult your on-premises VPN documentation for instructions to create Phase 2 security associations for each specified Azure virtual network subnet. 

1. Select the **Refresh** button after a few seconds, and the peering status will change from **Updating** to **Connected**.

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

1. Use [az network virtual network peering create](/cli/azure/network/vnet/peering#az-network-vnet-peering-create) to create virtual network peerings.

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
deselect the **Allow traffic to remote virtual network** setting if you want to block traffic to the remote virtual network. You might find disabling and enabling network access easier than deleting and recreating peerings.

1. In the search box at the top of the Azure portal, enter **Virtual network**. Select **Virtual networks** in the search results. 

1. Select the virtual network that you would like to view or change its peering settings in **Virtual networks**.

1. Select **Peerings** in **Settings**.

    :::image type="content" source="./media/virtual-network-manage-peering/select-peering.png" alt-text="Screenshot of select a peering to delete from the virtual network.":::

1. Select the box next to the peering you want to delete, and then select **Delete**.

    :::image type="content" source="./media/virtual-network-manage-peering/delete-peering.png" alt-text="Screenshot of deleting a peering from the virtual network.":::

1.  In **Delete Peerings**, enter **delete** in the confirmation box, and then select **Delete**.

    :::image type="content" source="./media/virtual-network-manage-peering/confirm-deletion.png" alt-text="Screenshot of peering delete confirmation entry box.":::

    > [!NOTE]
    > When you delete a virtual network peering from a virtual network, the peering from the remote virtual network is also deleted.

1. Select **Delete** to confirm the deletion in **Delete confirmation**.

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

- When you create a global peering, the peered virtual networks can exist in any Azure public cloud region, China cloud region, or Government cloud region. However, you can't peer virtual networks across different clouds. For example, a virtual network in Azure public cloud can't connect to a virtual network in Microsoft Azure operated by 21Vianet cloud.
  
- You can't move a virtual network while it's part of a peering. To move a virtual network to a different resource group or subscription, first delete the peering, then move the virtual network, and finally recreate the peering.

- Resources in one virtual network can't communicate with the front-end IP address of a basic load balancer (internal or public) in a globally peered virtual network. Support for basic load balancer only exists within the same region. Support for standard load balancer exists for both, Virtual Network Peering and Global Virtual Network Peering. Some services that use a basic load balancer don't work over global virtual network peering. For more information, see [Constraints related to Global Virtual Network Peering and Load Balancers](virtual-networks-faq.md#what-are-the-constraints-related-to-global-virtual-network-peering-and-load-balancers).

- You can use remote gateways or allow gateway transit in globally peered virtual networks and locally peered virtual networks.

- The virtual networks can be in the same, or different [subscriptions](#next-steps). When you peer virtual networks in different subscriptions, both subscriptions can be associated to the same or different Microsoft Entra tenant. If you don't already have an AD tenant, you can [create one](../active-directory/develop/quickstart-create-new-tenant.md).

- The virtual networks you peer must have nonoverlapping IP address spaces.

- When you peer two virtual networks created through Resource Manager, a peering must be configured for each virtual network in the peering. You see one of the following types for peering status:

  - **Initiated:** When you create the first peering, its status is *Initiated*. 
  
  - **Connected:** When you create the second peering, peering status becomes **Connected** for both peerings. The peering isn't successfully established until the peering status for both virtual network peerings is **Connected**.

- A peering is established between two virtual networks. Peerings by themselves aren't transitive. If you create peerings between:

  - VirtualNetwork1 and VirtualNetwork2 

  - VirtualNetwork2 and VirtualNetwork3
    
    There's no connectivity between VirtualNetwork1 and VirtualNetwork3 through VirtualNetwork2. If you want VirtualNetwork1 and VirtualNetwork3 to directly communicate, you have to create an explicit peering between VirtualNetwork1 and VirtualNetwork3, or go through an NVA in the **Hub** network. To learn more, see [**Hub**-spoke network topology in Azure](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke).
 
- You can't resolve names in peered virtual networks using default Azure name resolution. To resolve names in other virtual networks, you must use [Azure Private DNS](../dns/private-dns-overview.md) or a custom DNS server. To learn how to set up your own DNS server, see [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server).

- Resources in peered virtual networks in the same region can communicate with each other with the same latency as if they were within the same virtual network. The network throughput is based on the bandwidth allowed for the virtual machine, proportionate to its size. There isn't any extra restriction on bandwidth within the peering. Each virtual machine size has its own maximum network bandwidth. To learn more about maximum network bandwidth for different virtual machine sizes, see [Sizes for virtual machines in Azure](/azure/virtual-machines/sizes).

- A virtual network can be peered to another virtual network, and also be connected to another virtual network with an Azure virtual network gateway. When virtual networks are connected through both peering and a gateway, traffic between the virtual networks flows through the peering configuration, rather than the gateway.

- Point-to-Site VPN clients must be downloaded again after virtual network peering is successfully configured to ensure the new routes are downloaded to the client.

- There's a nominal charge for ingress and egress traffic that utilizes a virtual network peering. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/virtual-network).

- Application Gateways that don't have [Network Isolation](../application-gateway/application-gateway-private-deployment.md?tabs=portal) enabled don't allow traffic to be sent between peered VNETs when **Allow traffic to remote virtual network** is disabled.

## Permissions

The accounts you use to work with virtual network peering must be assigned to the following role:

- [Network Contributor](../role-based-access-control/built-in-roles.md#network-contributor)

If your account isn't assigned to the previous role, it must be assigned to a [custom role](../role-based-access-control/custom-roles.md) that is assigned the necessary actions from the following table:

| Action                                                          | Name |
|---                                                              |---   |
| **Microsoft.Network/virtualNetworks/virtualNetworkPeerings/write**  | Required to create a peering from virtual network A to virtual network B.         |
| **Microsoft.Network/virtualNetworks/virtualNetworkPeerings/read**   | Read a virtual network peering   |
| **Microsoft.Network/virtualNetworks/virtualNetworkPeerings/delete** | Delete a virtual network peering |

> [!IMPORTANT]  
> You must have **Network Contributor** or the custom roles of **Microsoft.Network/virtualNetworks/virtualNetworkPeerings/read** and **Microsoft.Network/virtualNetworks/virtualNetworkPeerings/delete** assigned to the remote virtual network to remove the remote virtual network peering.

## Next steps

- A virtual network peering can be created between virtual networks that exist in the same, or different subscriptions. Complete a tutorial for one of the following scenarios:

  |Azure deployment model             | Subscription  |
  |---------                          |---------|
  |Resource Manager              |[Same](tutorial-connect-virtual-networks-portal.md)|
  |                                   |[Different](create-peering-different-subscriptions.md)|

- Learn how to create a [**hub** and spoke network topology](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke)

- Create a virtual network peering using [PowerShell](powershell-samples.md) or [Azure CLI](cli-samples.md) sample scripts, or using Azure [Resource Manager templates](template-samples.md)

- Create and assign [Azure Policy definitions](./policy-reference.md) for virtual networks
