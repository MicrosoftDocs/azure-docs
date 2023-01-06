---
title: Add, change, or delete an Azure virtual network subnet
titlesuffix: Azure Virtual Network
description: Learn where to find information about virtual networks and how to add, change, or delete a virtual network subnet in Azure.
services: virtual-network
documentationcenter: na
author: asudbring
ms.service: virtual-network
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/27/2022
ms.author: allensu
---

# Add, change, or delete a virtual network subnet

Learn how to add, change, or delete a virtual network subnet. All Azure resources deployed into a virtual network are deployed into a subnet within a virtual network. If you're new to virtual networks, you can learn more about them in the [Virtual network overview](virtual-networks-overview.md) or by completing a [quickstart](quick-create-portal.md). To learn more about managing a virtual network, see [Create, change, or delete a virtual network](manage-virtual-network.md).

## Before you begin

If you don't have one, set up an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio). Then complete one of these tasks before starting steps in any section of this article: 

- **Portal users**: Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

- **PowerShell users**: Either run the commands in the [Azure Cloud Shell](https://shell.azure.com/powershell), or run PowerShell from your computer. The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. In the Azure Cloud Shell browser tab, find the **Select environment** dropdown list, then choose **PowerShell** if it isn't already selected.

    If you're running PowerShell locally, use Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az.Network` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). Also run `Connect-AzAccount` to create a connection with Azure.

- **Azure CLI users**: Run the commands via either the [Azure Cloud Shell](https://shell.azure.com/bash) the Azure CLI running locally. Use Azure CLI version 2.0.31 or later if you're running the Azure CLI locally. Run `az --version` to find the installed version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). Also run `az login` to create a connection with Azure.

The account you sign in to, or connect to Azure with, must be assigned to the [Network contributor role](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [Custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that's assigned the appropriate actions listed in [Permissions](#permissions).

## Add a subnet

1. Go to the [Azure portal](https://portal.azure.com) to view your virtual networks. Search for and select **Virtual networks**.

2. Select the name of the virtual network you want to add a subnet to.

3. From **Settings**, select **Subnets** > **Subnet**.

4. In the **Add subnet** dialog box, enter values for the following settings:

    | Setting | Description |
    | --- | --- |
    | **Name** | The name must be unique within the virtual network. For maximum compatibility with other Azure services, we recommend using a letter as the first character of the name. For example, Azure Application Gateway won't deploy into a subnet that has a name that starts with a number. |
    | **Subnet address range** | <p>The range must be unique within the address space for the virtual network. The range can't overlap with other subnet address ranges within the virtual network. The address space must be specified by using Classless Inter-Domain Routing (CIDR) notation.</p><p>For example, in a virtual network with address space *10.0.0.0/16*, you might define a subnet address space of *10.0.0.0/22*. The smallest range you can specify is */29*, which provides eight IP addresses for the subnet. Azure reserves the first and last address in each subnet for protocol conformance. Three more addresses are reserved for Azure service usage. As a result, defining a subnet with a */29* address range results in three usable IP addresses in the subnet.</p><p>If you plan to connect a virtual network to a VPN gateway, you must create a gateway subnet. Learn more about [specific address range considerations for gateway subnets](../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md?toc=%2fazure%2fvirtual-network%2ftoc.json#gwsub). You can change the address range after the subnet is added, under specific conditions. To learn how to change a subnet address range, see [Change subnet settings](#change-subnet-settings).</p> |
    | **Add IPv6 address space** | You can create a virtual network that's dual-stack (supports IPv4 and IPv6) by adding an existing IPv6 address space. You can also add IPv6 support later, after creating the virtual network. Currently, IPv6 isn't fully supported for all services in Azure. To learn more about IPv6 and its limitations, see [Overview of IPv6 for Azure Virtual Network](ip-services/ipv6-overview.md)|
    | **NAT gateway** | To provide Network Address Translation (NAT) to resources on a subnet, you may associate an existing NAT gateway to a subnet. The NAT gateway must exist in the same subscription and location as the virtual network. Learn more about [Virtual Network NAT](./nat-gateway/nat-overview.md) and [how to create a NAT gateway](./nat-gateway/quickstart-create-nat-gateway-portal.md)
    | **Network security group** | To filter inbound and outbound network traffic for the subnet, you may associate an existing network security group to a subnet. The network security group must exist in the same subscription and location as the virtual network. Learn more about [network security groups](./network-security-groups-overview.md) and [how to create a network security group](tutorial-filter-network-traffic.md). |
    | **Route table** | To control network traffic routing to other networks, you may optionally associate an existing route table to a subnet. The route table must exist in the same subscription and location as the virtual network. Learn more about [Azure routing](virtual-networks-udr-overview.md) and [how to create a route table](tutorial-create-route-table-portal.md). |
    | **Service endpoints** | <p>A subnet may optionally have one or more service endpoints enabled for it. To enable a service endpoint for a service, select the service or services that you want to enable service endpoints for from the **Services** list. Azure configures the location automatically for an endpoint. By default, Azure configures the service endpoints for the virtual network's region. To support regional failover scenarios, Azure automatically configures endpoints to [Azure paired regions](../availability-zones/cross-region-replication-azure.md?toc=%2fazure%2fvirtual-network%2ftoc.json) for Azure Storage.</p><p>To remove a service endpoint, unselect the service you want to remove the service endpoint for. To learn more about service endpoints, and the services they can be enabled for, see [Virtual network service endpoints](virtual-network-service-endpoints-overview.md). Once you enable a service endpoint for a service, you must also enable network access for the subnet for a resource created with the service. For example, if you enable the service endpoint for **Microsoft.Storage**, you must also enable network access to all Azure Storage accounts you want to grant network access to. To enable network access to subnets that a service endpoint is enabled for, see the documentation for the individual service you enabled the service endpoint for.</p><p>To validate that a service endpoint is enabled for a subnet, view the [effective routes](diagnose-network-routing-problem.md) for any network interface in the subnet. When you configure an endpoint, you see a *default* route with the address prefixes of the service, and a next hop type of **VirtualNetworkServiceEndpoint**. To learn more about routing, see [Virtual network traffic routing](virtual-networks-udr-overview.md).</p> |
    | **Subnet delegation** | A subnet may optionally have one or more delegations enabled for it. Subnet delegation gives explicit permissions to the service to create service-specific resources in the subnet using a unique identifier during service deployment. To delegate for a service, select the service you want to delegate to from the **Services** list. |
    | **Network policy for private endpoints**| To control traffic going to a private endpoint, you can use network security groups, application security groups, or user defined routes. Set the private endpoint network policy to *Enabled* to use these controls on a subnet. Once enabled, network policy applies to all private endpoints on the subnet. To learn more, see [Manage network policies for private endpoints](../private-link/disable-private-endpoint-network-policy.md). |

5. To add the subnet to the virtual network that you selected, select **OK**.

### Commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) |
| PowerShell | [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig) |

## Change subnet settings

1. Go to the [Azure portal](https://portal.azure.com) to view your virtual networks. Search for and select **Virtual networks**.

2. Select the name of the virtual network containing the subnet you want to change.

3. From **Settings**, select **Subnets**.

4. In the list of subnets, select the subnet you want to change settings for.

5. In the subnet page, change any of the following settings:

    | Setting | Description |
    | --- | --- |
    | **Subnet address range** | If no resources are deployed within the subnet, you can change the address range. If any resources exist in the subnet, you must either move the resources to another subnet, or delete them from the subnet first. The steps you take to move or delete a resource vary depending on the resource. To learn how to move or delete resources that are in subnets, read the documentation for each of those resource types. See the constraints for **Address range** in step 4 of [Add a subnet](#add-a-subnet). |
    | **Add IPv6 address space**, **NAT Gateway**, **Network security group**, and **Route table** | See step 4 of [Add a subnet](#add-a-subnet). |
    | **Service endpoints** | <p>See service endpoints in step 4 of [Add a subnet](#add-a-subnet). When enabling a service endpoint for an existing subnet, ensure that no critical tasks are running on any resource in the subnet. Service endpoints switch routes on every network interface in the subnet. The service endpoints go from using the default route with the *0.0.0.0/0* address prefix and next hop type of *Internet*, to using a new route with the address prefixes of the service and a next hop type of *VirtualNetworkServiceEndpoint*.</p><p>During the switch, any open TCP connections may be terminated. The service endpoint isn't enabled until traffic flows to the service for all network interfaces are updated with the new route. To learn more about routing, see [Virtual network traffic routing](virtual-networks-udr-overview.md).</p> |
    | **Subnet delegation** | Subnet delegation can be modified to zero or multiple delegations enabled for it. If a resource for a service is already deployed in the subnet, subnet delegation can't be added or removed until all the resources for the service are removed. To delegate for a different service, select the service you want to delegate to from the **Services** list. |
    | **Network policy for private endpoints**| See step 4 of [Add a subnet](#add-a-subnet). |

6. Select **Save**.

### Commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) |
| PowerShell | [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) |

## Delete a subnet

You can delete a subnet only if there are no resources in the subnet. If resources are in the subnet, you must delete those resources before you can delete the subnet. The steps you take to delete a resource vary depending on the resource. To learn how to delete resources that are in subnets, read the documentation for each of those resource types.

1. Go to the [Azure portal](https://portal.azure.com) to view your virtual networks. Search for and select **Virtual networks**.

2. Select the name of the virtual network containing the subnet you want to delete.

3. From **Settings**, select **Subnets**.

4. In the list of subnets, select the subnet you want to delete.

5. Select **Delete**, and then select **Yes** in the confirmation dialog box.

### Commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network vnet subnet delete](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-delete) |
| PowerShell | [Remove-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/remove-azvirtualnetworksubnetconfig?toc=%2fazure%2fvirtual-network%2ftoc.json) |

## Permissions

To do tasks on subnets, your account must be assigned to the [Network contributor role](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) or to a [Custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that's assigned the appropriate actions in the following table:

|Action                                                                   |   Name                                       |
|-----------------------------------------------------------------------  |   -----------------------------------------  |
|Microsoft.Network/virtualNetworks/subnets/read                           |   Read a virtual network subnet              |
|Microsoft.Network/virtualNetworks/subnets/write                          |   Create or update a virtual network subnet  |
|Microsoft.Network/virtualNetworks/subnets/delete                         |   Delete a virtual network subnet            |
|Microsoft.Network/virtualNetworks/subnets/join/action                    |   Join a virtual network                     |
|Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action  |   Enable a service endpoint for a subnet     |
|Microsoft.Network/virtualNetworks/subnets/virtualMachines/read           |   Get the virtual machines in a subnet       |

## Next steps

- Create a virtual network and subnets using [PowerShell](powershell-samples.md) or [Azure CLI](cli-samples.md) sample scripts, or using Azure [Resource Manager templates](template-samples.md)
- Create and assign [Azure Policy definitions](./policy-reference.md) for virtual networks
