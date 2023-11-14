---
title: Create, change, or delete an Azure virtual network
titlesuffix: Azure Virtual Network
description: Create and delete a virtual network and change settings, like DNS servers and IP address spaces, for an existing virtual network.
author: asudbring
ms.service: virtual-network
ms.topic: how-to
ms.date: 08/23/2023
ms.author: allensu
ms.custom: template-how-to, engagement-fy23, devx-track-azurecli, devx-track-azurepowershell
---

# Create, change, or delete a virtual network

Learn how to create and delete a virtual network and change settings, like DNS servers and IP address spaces, for an existing virtual network. If you're new to virtual networks, you can learn more about them in the [Virtual network overview](virtual-networks-overview.md) or by completing a [tutorial](quick-create-portal.md). A virtual network contains subnets. To learn how to create, change, and delete subnets, see [Manage subnets](virtual-network-manage-subnet.md).

## Prerequisites

If you don't have an Azure account with an active subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). Complete one of these tasks before starting the remainder of this article:

- **Portal users**: Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

- **PowerShell users**: Either run the commands in the [Azure Cloud Shell](https://shell.azure.com/powershell), or run PowerShell locally from your computer. The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. In the Azure Cloud Shell browser tab, find the **Select environment** dropdown list, then pick **PowerShell** if it isn't already selected.

    If you're running PowerShell locally, use Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az.Network` to find the installed version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). Run `Connect-AzAccount` to sign in to Azure.

- **Azure CLI users**: Either run the commands in the [Azure Cloud Shell](https://shell.azure.com/bash), or run Azure CLI locally from your computer. The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. In the Azure Cloud Shell browser tab, find the **Select environment** dropdown list, then pick **Bash** if it isn't already selected.

    If you're running Azure CLI locally, use Azure CLI version 2.0.31 or later. Run `az --version` to find the installed version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). Run `az login` to sign in to Azure.

The account you log into, or connect to Azure with, must be assigned to the [network contributor](../role-based-access-control/built-in-roles.md#network-contributor) role or to a [custom role](../role-based-access-control/custom-roles.md) that is assigned the appropriate actions listed in [Permissions](#permissions).

## Create a virtual network

### Create a virtual network using the Azure portal

1. In the search box at the top of the portal, enter *Virtual networks*. Select **Virtual networks** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create virtual network**, enter or select values for the following settings:

    | Setting | Value | Details |
    | --- | --- | --- |
    | **Project details** |  |  |
    | Subscription | Select your subscription. | You can't use the same virtual network in more than one Azure subscription. However, you can connect a virtual network in one subscription to virtual networks in other subscriptions using [virtual network peering](virtual-network-peering-overview.md). <br> Any Azure resource that you connect to the virtual network must be in the same subscription as the virtual network. |
    |Resource group| Select an existing [resource group](../azure-resource-manager/management/overview.md#resource-groups) or create a new one by selecting **Create new**. | An Azure resource that you connect to the virtual network can be in the same resource group as the virtual network or in a different resource group. |
    | **Instance details** | |
    | Name | Enter a name for the virtual network you're creating. | The name must be unique in the resource group that you select to create the virtual network in. <br> You can't change the name after the virtual network is created. <br> For naming suggestions, see [Naming conventions](/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging#naming-and-tagging-resources). Following a naming convention can help make it easier to manage multiple virtual networks. |
    | Region | Select an Azure [region](https://azure.microsoft.com/regions/). | A virtual network can be in only one Azure region. However, you can connect a virtual network in one region to a virtual network in another region using [virtual network peering](virtual-network-peering-overview.md). <br> Any Azure resource that you connect to the virtual network must be in the same region as the virtual network. |
    
1. Select **IP Addresses** tab or **Next: Security >**, **Next: IP Addresses >** and enter the following IP address information:
   
   - **IPv4 Address space**: The address space for a virtual network is composed of one or more non-overlapping address ranges that are specified in CIDR notation. The address range you define can be public or private (RFC 1918). Whether you define the address range as public or private, the address range is reachable only from within the virtual network, from interconnected virtual networks, and from any on-premises networks that you've connected to the virtual network.

     You can't add the following address ranges:
     - 224.0.0.0/4 (Multicast)
     - 255.255.255.255/32 (Broadcast)
     - 127.0.0.0/8 (Loopback)
     - 169.254.0.0/16 (Link-local)
     - 168.63.129.16/32 (Internal DNS, DHCP, and Azure Load Balancer [health probe](../load-balancer/load-balancer-custom-probe-overview.md#probe-source-ip-address))
    
     The portal requires that you define at least one IPv4 address range when you create a virtual network. You can change the address space after the virtual network is created, under specific conditions.

     > [!WARNING]
     > If a virtual network has address ranges that overlap with another virtual network or on-premises network, the two networks can't be connected. Before you define an address range, consider whether you might want to connect the virtual network to other virtual networks or on-premises networks in the future. Microsoft recommends configuring virtual network address ranges with private address space or public address space owned by your organization.

    - **Add IPv6 address space**: IPv6 address space of an Azure Virtual Network enables you to host applications in Azure with IPv6 and IPv4 connectivity within the virtual network and to and from the Internet. 

    - **Subnet name**: The subnet name must be unique within the virtual network. You can't change the subnet name after the subnet is created. The portal requires that you define one subnet when you create a virtual network, even though a virtual network isn't required to have any subnets. In the portal, you can define one or more subnets when you create a virtual network. You can add more subnets to the virtual network later, after the virtual network is created. To add a subnet to a virtual network, see [Manage subnets](virtual-network-manage-subnet.md).

      >[!TIP]
      >Sometimes, administrators create different subnets to filter or control traffic routing between the subnets. Before you define subnets, consider how you might want to filter and route traffic between your subnets. To learn more about filtering traffic between subnets, see [Network security groups](./network-security-groups-overview.md). Azure automatically routes traffic between subnets, but you can override Azure default routes. To learn more about Azures default subnet traffic routing, see [Routing overview](virtual-networks-udr-overview.md).

     - **Subnet address range**: The range must be within the address space you entered for the virtual network. The smallest range you can specify is /29, which provides eight IP addresses for the subnet. Azure reserves the first and last address in each subnet for protocol conformance. Three more addresses are reserved for Azure service usage. As a result, a virtual network with a subnet address range of /29 has only three usable IP addresses. If you plan to connect a virtual network to a VPN gateway, you must create a gateway subnet. Learn more about [specific address range considerations for gateway subnets](../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md#gwsub). You can change the address range after the subnet is created, under specific conditions. To learn how to change a subnet address range, see [Manage subnets](virtual-network-manage-subnet.md).

### Create a virtual network using PowerShell

Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) to create a virtual network.

```azurepowershell-interactive
## Create myVNet virtual network. ##
New-AzVirtualNetwork -ResourceGroupName myResourceGroup -Name myVNet -Location eastus -AddressPrefix 10.0.0.0/16
```

### Create a virtual network using the Azure CLI

Use [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) to create a virtual network.

```azurecli-interactive
## Create myVNet virtual network with the default address space: 10.0.0.0/16. ##
az network vnet create --resource-group myResourceGroup --name myVNet
```

## View virtual networks and settings

### View virtual networks and settings using the Azure portal

1. In the search box at the top of the portal, enter *Virtual networks*. Select **Virtual networks** in the search results.

1. From the list of virtual networks, select the virtual network that you want to view settings for.

1. The following settings are listed for the virtual network you selected:

   - **Overview**: Provides information about the virtual network, including address space and DNS servers. The following screenshot shows the overview settings for a virtual network named **MyVNet**:

     :::image type="content" source="media/manage-virtual-network/vnet-overview-inline.png" alt-text="Screenshot of the Virtual Network overview page. It includes essential information including resource group, subscription info, and DNS information." lightbox="media/manage-virtual-network/vnet-overview-expanded.png":::

     You can move a virtual network to a different subscription, region, or resource group by selecting **Move** next to **Resource group**, **Location**, or **Subscription**. To learn how to move a virtual network, see [Move resources to a different resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md). The article lists prerequisites, and how to move resources by using the Azure portal, PowerShell, and Azure CLI. All resources that are connected to the virtual network must move with the virtual network.

   - **Address space**: The address spaces that are assigned to the virtual network are listed. To learn how to add and remove an address range to the address space, complete the steps in [Add or remove an address range](#add-or-remove-an-address-range).

   - **Connected devices**: Any resources that are connected to the virtual network are listed. Any new resources that you create and connect to the virtual network are added to the list. If you delete a resource that was connected to the virtual network, it no longer appears in the list.

   - **Subnets**: A list of subnets that exist within the virtual network is shown. To learn how to add and remove a subnet, see [Manage subnets](virtual-network-manage-subnet.md).

   - **DNS servers**: You can specify whether the Azure internal DNS server or a custom DNS server provides name resolution for devices that are connected to the virtual network. When you create a virtual network by using the Azure portal, Azure's DNS servers are used for name resolution within a virtual network, by default. To learn how to modify the DNS servers, see the steps in [Change DNS servers](#change-dns-servers) in this article.

   - **Peerings**: If there are existing peerings in the subscription, they're listed here. You can view settings for existing peerings, or create, change, or delete peerings. To learn more about peerings, see [Virtual network peering](virtual-network-peering-overview.md) and [Manage virtual network peerings](virtual-network-manage-peering.md).

   - **Properties**: Displays settings about the virtual network, including the virtual network's resource ID and Azure subscription.

   - **Diagram**: Provides a visual representation of all devices that are connected to the virtual network. The diagram has some key information about the devices. To manage a device in this view, in the diagram, select the device.

   - **Common Azure settings**: To learn more about common Azure settings, see the following information:
     - [Activity log](../azure-monitor/essentials/platform-logs-overview.md)
     - [Access control (IAM)](../role-based-access-control/overview.md)
     - [Tags](../azure-resource-manager/management/tag-resources.md)
     - [Locks](../azure-resource-manager/management/lock-resources.md)
     - [Automation script](../azure-resource-manager/management/manage-resource-groups-portal.md#export-resource-groups-to-templates)

### View virtual networks and settings using PowerShell

Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) to list all virtual networks in a resource group.

```azurepowershell-interactive
Get-AzVirtualNetwork -ResourceGroupName myResourceGroup | format-table Name, ResourceGroupName, Location 
```

Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) to view the settings of a virtual network.

```azurepowershell-interactive
Get-AzVirtualNetwork -ResourceGroupName myResourceGroup -Name myVNet
```

### View virtual networks and settings using the Azure CLI

Use [az network vnet list](/cli/azure/network/vnet#az-network-vnet-list) to list all virtual networks in a resource group.

```azurecli-interactive
az network vnet list --resource-group myResourceGroup
```

Use [az network vnet show](/cli/azure/network/vnet#az-network-vnet-show) to view the settings of a virtual network.

```azurecli-interactive
az network vnet show --resource-group myResourceGroup --name myVNet
```

## Add or remove an address range

You can add and remove address ranges for a virtual network. An address range must be specified in CIDR notation, and can't overlap with other address ranges within the same virtual network. The address ranges you define can be public or private (RFC 1918). Whether you define the address range as public or private, the address range is reachable only from within the virtual network, from interconnected virtual networks, and from any on-premises networks that you've connected to the virtual network. 

You can decrease the address range for a virtual network as long as it still includes the ranges of any associated subnets. Additionally, you can extend the address range, for example, changing a /16 to /8. 

<!-- the above statement has been edited to reflect the most recent comments on the reopened issue: https://github.com/MicrosoftDocs/azure-docs/issues/20572 -->

You can't add the following address ranges:

- 224.0.0.0/4 (Multicast)
- 255.255.255.255/32 (Broadcast)
- 127.0.0.0/8 (Loopback)
- 169.254.0.0/16 (Link-local)
- 168.63.129.16/32 (Internal DNS, DHCP, and Azure Load Balancer [health probe](../load-balancer/load-balancer-custom-probe-overview.md#probe-source-ip-address))

> [!NOTE]
> If the virtual network is peered with another virtual network or connected with on-premises network, the new address range can't overlap with the address space of the peered virtual networks or on-premises network. To learn more, see [Update the address space for a peered virtual network](update-virtual-network-peering-address-space.md).

### Add or remove an address range using the Azure portal

1. In the search box at the top of the portal, enter *Virtual networks*. Select **Virtual networks** in the search results.

2. From the list of virtual networks, select the virtual network for which you want to add or remove an address range.

3. Select **Address space**, under **Settings**.

4. Complete one of the following options:

	- **Add an address range**: Enter the new address range. The address range can't overlap with an existing address range that is defined for the virtual network.

	- **Modify an address range**: Modify an existing address range. You can change the address range prefix to decrease or increase the address range. You can decrease the address range as long as it still includes the ranges of any associated subnets. Additionally, you can extend the address range as long as it doesn't overlap with an existing address range that is defined for the virtual network.

	- **Remove an address range**: On the right of the address range you want to remove, select **Delete**. If a subnet exists in the address range, you can't remove the address range. To remove an address range, you must first delete any subnets (and any resources in the subnets) that exist in the address range.

5. Select **Save**.

### Add or remove an address range using PowerShell

Use [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to update the address space of a virtual network.

```azurepowershell-interactive
## Place the virtual network configuration into a variable. ##
$virtualNetwork = Get-AzVirtualNetwork -ResourceGroupName myResourceGroup -Name myVNet
## Remove the old address range. ##
$virtualNetwork.AddressSpace.AddressPrefixes.Remove("10.0.0.0/16")
## Add the new address range. ##
$virtualNetwork.AddressSpace.AddressPrefixes.Add("10.1.0.0/16")
## Update the virtual network. ##
Set-AzVirtualNetwork -VirtualNetwork $virtualNetwork
```

### Add or remove an address range using the Azure CLI

Use [az network vnet update](/cli/azure/network/vnet#az-network-vnet-update) to update the address space of a virtual network.

```azurecli-interactive
## Update the address space of myVNet virtual network with 10.1.0.0/16 address range (10.1.0.0/16 overrides any previous address ranges set in this virtual network). ## 
az network vnet update --resource-group myResourceGroup --name myVNet --address-prefixes 10.1.0.0/16
```

## Change DNS servers

All VMs that are connected to the virtual network register with the DNS servers that you specify for the virtual network. They also use the specified DNS server for name resolution. Each network interface (NIC) in a VM can have its own DNS server settings. If a NIC has its own DNS server settings, they override the DNS server settings for the virtual network. To learn more about NIC DNS settings, see [Network interface tasks and settings](virtual-network-network-interface.md#change-dns-servers). To learn more about name resolution for VMs and role instances in Azure Cloud Services, see [Name resolution for VMs and role instances](virtual-networks-name-resolution-for-vms-and-role-instances.md). To add, change, or remove a DNS server:

### Change DNS servers of a virtual network using the Azure portal

1. In the search box at the top of the portal, enter *Virtual networks*. Select **Virtual networks** in the search results.

2. From the list of virtual networks, select the virtual network for which you want to change DNS servers.

3. Select **DNS servers**, under **Settings**.

4. Select one of the following options:

   - **Default (Azure-provided)**: All resource names and private IP addresses are automatically registered to the Azure DNS servers. You can resolve names between any resources that are connected to the same virtual network. You can't use this option to resolve names across virtual networks. To resolve names across virtual networks, you must use a custom DNS server.

   - **Custom**: You can add one or more servers, up to the Azure limit for a virtual network. To learn more about DNS server limits, see [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md). You have the following options:

       - **Add an address**: Adds the server to your virtual network DNS servers list. This option also registers the DNS server with Azure. If you've already registered a DNS server with Azure, you can select that DNS server in the list.

       - **Remove an address**: Next to the server that you want to remove, select **Delete**. Deleting the server removes the server only from this virtual network list. The DNS server remains registered in Azure for your other virtual networks to use.

       - **Reorder DNS server addresses**: It's important to verify that you list your DNS servers in the correct order for your environment. DNS servers are used in the order that they're specified in the list. They don't work as a round-robin setup. If the first DNS server in the list can be reached, the client uses that DNS server, regardless of whether the DNS server is functioning properly. Remove all the DNS servers that are listed, and then add them back in the order that you want.

       - **Change an address**: Highlight the DNS server in the list, and then enter the new address.

5. Select **Save**.

6. Restart the VMs that are connected to the virtual network, so they're assigned the new DNS server settings. VMs continue to use their current DNS settings until they're restarted.

### Change DNS servers of a virtual network using PowerShell

Use [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to update a virtual network with new address space.

```azurepowershell-interactive
## Place the virtual network configuration into a variable. ##
$virtualNetwork = Get-AzVirtualNetwork -ResourceGroupName myResourceGroup -Name myVNet
## Add the IP address of the DNS server. ##
$virtualNetwork.DhcpOptions.DnsServers.Add("10.0.0.10")
## Update the virtual network. ##
Set-AzVirtualNetwork -VirtualNetwork $virtualNetwork
```

### Change DNS servers of a virtual network using the Azure CLI

Use [az network vnet update](/cli/azure/network/vnet#az-network-vnet-update) to update the address space of a virtual network.

```azurecli-interactive
## Update the virtual network with IP address of the DNS server. ## 
az network vnet update --resource-group myResourceGroup --name myVNet --dns-servers 10.0.0.10
```

## Delete a virtual network

You can delete a virtual network only if there are no resources connected to it. If there are resources connected to any subnet within the virtual network, you must first delete the resources that are connected to all subnets within the virtual network. The steps you take to delete a resource vary depending on the resource. To learn how to delete resources that are connected to subnets, read the documentation for each resource type you want to delete. To delete a virtual network:

### Delete a virtual network using the Azure portal 

1. In the search box at the top of the portal, enter *Virtual networks*. Select **Virtual networks** in the search results.

2. From the list of virtual networks, select the virtual network you want to delete.

3. Confirm that there are no devices connected to the virtual network by selecting **Connected devices**, under **Settings**. If there are connected devices, you must delete them before you can delete the virtual network. If there are no connected devices, select **Overview**.

4. Select **Delete**.

5. To confirm the deletion of the virtual network, select **Yes**.

### Delete a virtual network using PowerShell 

Use [Remove-AzVirtualNetwork](/powershell/module/az.network/remove-azvirtualnetwork) to delete a virtual network.

```azurepowershell-interactive 
Remove-AzVirtualNetwork -ResourceGroupName myResourceGroup -Name myVNet
```

### Delete a virtual network using the Azure CLI 

Use [az network vnet delete](/cli/azure/network/vnet#az-network-vnet-delete) to delete a virtual network.

```azurecli-interactive 
az network vnet delete --resource-group myResourceGroup --name myVNet
```

## Permissions

To perform tasks on virtual networks, your account must be assigned to the [network contributor](../role-based-access-control/built-in-roles.md#network-contributor) role or to a [custom](../role-based-access-control/custom-roles.md) role that is assigned the appropriate actions listed in the following table:

| Action                                  |   Name                                |
|---------------------------------------- |   --------------------------------    |
|Microsoft.Network/virtualNetworks/read   |   Read a virtual Network              |
|Microsoft.Network/virtualNetworks/write  |   Create or update a virtual network  |
|Microsoft.Network/virtualNetworks/delete |   Delete a virtual network            |

## Next steps

- Create a virtual network using [PowerShell](powershell-samples.md) or [Azure CLI](cli-samples.md) sample scripts, or using Azure [Resource Manager templates](template-samples.md)
- Add, change, or delete [a virtual network subnet](virtual-network-manage-subnet.md)
- Create and assign [Azure Policy definitions](./policy-reference.md) for virtual networks
