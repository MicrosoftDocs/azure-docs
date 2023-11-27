---
title: Add, change, or delete a subnet
titlesuffix: Azure Virtual Network
description: Learn how to add, change, or delete virtual network subnets by using the Azure portal, Azure CLI, or Azure PowerShell.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.topic: how-to
ms.workload: infrastructure-services
ms.custom:
  - devx-track-azurecli
  - devx-track-azurepowershell
  - ignite-2023
ms.date: 11/15/2023
ms.author: allensu
---

# Add, change, or delete a virtual network subnet

All Azure resources in a virtual network are deployed into subnets within the virtual network. This article explains how to add, change, or delete virtual network subnets by using the Azure portal, Azure CLI, or Azure PowerShell.

## Prerequisites

# [Portal](#tab/azure-portal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An existing Azure virtual network. To create one, see [Quickstart: Create a virtual network by using the Azure portal](quick-create-portal.md).
- To run the procedures, sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

# [Azure CLI](#tab/azure-cli)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An existing Azure virtual network. To create one, see [Quickstart: Create a virtual network by using Azure CLI](quick-create-cli.md).

You can run the commands either in the [Azure Cloud Shell](/azure/cloud-shell/overview) or from Azure CLI on your computer.

- Azure Cloud Shell is a free interactive shell that has common Azure tools preinstalled and configured to use with your account. To run the commands in the Cloud Shell, select **Open Cloudshell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

- If you [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands, you need Azure CLI version 2.31.0 or later. Run [az version](/cli/azure/reference-index?#az-version) to find your installed version, and run [az upgrade](/cli/azure/reference-index?#az-upgrade) to upgrade.

  Run `az login` to connect to Azure.

# [PowerShell](#tab/azure-powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An existing Azure virtual network. To create one, see [Quickstart: Create a virtual network by using Azure PowerShell](quick-create-powershell.md).

You can run the commands either in the [Azure Cloud Shell](/azure/cloud-shell/overview) or from PowerShell on your computer.

- Azure Cloud Shell is a free interactive shell that has common Azure tools preinstalled and configured to use with your account. To run the commands in the Cloud Shell, select **Open Cloudshell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

- If you [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the commands, you need Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find your installed version. If you need to upgrade, see [Update the Azure PowerShell module](/powershell/azure/install-Az-ps#update-the-azure-powershell-module).

  Also make sure your `Az.Network` module is 4.3.0 or later. To verify the installed module, use `Get-InstalledModule -Name Az.Network`. To update, use the command `Update-Module -Name Az.Network`.

  Run `Connect-AzAccount` to connect to Azure.


---

### Permissions

To do tasks on subnets, your account must be assigned to the [Network contributor role](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) or to a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that's assigned the appropriate actions in the following list:

|Action                                                                   |   Name                                       |
|-----------------------------------------------------------------------  |   -----------------------------------------  |
|Microsoft.Network/virtualNetworks/subnets/read                           |   Read a virtual network subnet.              |
|Microsoft.Network/virtualNetworks/subnets/write                          |   Create or update a virtual network subnet.  |
|Microsoft.Network/virtualNetworks/subnets/delete                         |   Delete a virtual network subnet.            |
|Microsoft.Network/virtualNetworks/subnets/join/action                    |   Join a virtual network.                     |
|Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action  |   Enable a service endpoint for a subnet.     |
|Microsoft.Network/virtualNetworks/subnets/virtualMachines/read           |   Get the virtual machines in a subnet.       |

## Add a subnet

# [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), search for and select *virtual networks*.
1. On the **Virtual networks** page, select the virtual network you want to add a subnet to.
1. On the virtual network page, select **Subnets** from the left navigation.
1. On the **Subnets** page, select **+ Subnet**.
1. On the **Add subnet** screen, enter or select values for the subnet settings.
1. Select **Save**.

# [Azure CLI](#tab/azure-cli)

Run the [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) command with the options you want to configure.

```azurecli-interactive
az network vnet subnet create --name <subnetName> --resource-group <resourceGroupName> --vnet-name <virtualNetworkName>
```

# [PowerShell](#tab/azure-powershell)

1. Use the [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig) command to configure the subnet.

   ```azurepowershell-interactive
   $vnet = Get-AzVirtualNetwork -Name <virtualNetworkName> -ResourceGroupName <resourceGroupName>
   Add-AzVirtualNetworkSubnetConfig -Name <subnetName> -VirtualNetwork $vnet -AddressPrefix <String[]>
   ```

1. Then associate the subnet configuration to the virtual network with [Set-AzVirtualNetwork](/powershell/module/az.network/Set-azVirtualNetwork).

   ```azurepowershell-interactive
   Set-AzVirtualNetwork -VirtualNetwork $vnet
   ```

---

You can configure the following settings for a subnet:

   | Setting | Description |
   | --- | --- |
   | **Name** | The name must be unique within the virtual network. For maximum compatibility with other Azure services, use a letter as the first character of the name. For example, Azure Application Gateway can't deploy into a subnet whose name starts with a number. |
   | **Subnet address range** | The range must be unique within the address space and can't overlap with other subnet address ranges in the virtual network. You must specify the address space by using Classless Inter-Domain Routing (CIDR) notation.<br><br>For example, in a virtual network with address space `10.0.0.0/16`, you might define a subnet address space of `10.0.0.0/22`. The smallest range you can specify is `/29`, which provides eight IP addresses for the subnet. Azure reserves the first and last address in each subnet for protocol conformance, and three more addresses for Azure service usage. So defining a subnet with a */29* address range gives three usable IP addresses in the subnet.<br><br>If you plan to connect a virtual network to a virtual private network (VPN) gateway, you must create a gateway subnet. For more information, see [Gateway subnet](../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md?toc=%2fazure%2fvirtual-network%2ftoc.json#gwsub).|
   | **Add IPv6 address space** | You can create a dual-stack virtual network that supports IPv4 and IPv6 by adding an existing IPv6 address space. Currently, IPv6 isn't fully supported for all services in Azure. For more information, see [Overview of IPv6 for Azure Virtual Network](ip-services/ipv6-overview.md)|
   | **Private Subnet** | Setting a subnet as private prevents the use of [default outbound access](ip-services/default-outbound-access.md) for any virtual machines created in the subnet. This feature is in Preview. |
   | **NAT gateway** | To provide network address translation (NAT) to resources on a subnet, you can associate an existing NAT gateway to a subnet. The NAT gateway must exist in the same subscription and location as the virtual network. For more information, see [Virtual network NAT](./nat-gateway/nat-overview.md) and [Quickstart: Create a NAT gateway by using the Azure portal](./nat-gateway/quickstart-create-nat-gateway-portal.md). |
   | **Network security group** | To filter inbound and outbound network traffic for the subnet, you can associate an existing network security group (NSG) to a subnet. The NSG must exist in the same subscription and location as the virtual network. For more information, see [Network security groups](./network-security-groups-overview.md) and [Tutorial: Filter network traffic with a network security group by using the Azure portal](tutorial-filter-network-traffic.md). |
   | **Route table** | To control network traffic routing to other networks, you can optionally associate an existing route table to a subnet. The route table must exist in the same subscription and location as the virtual network. For more information, see [Virtual network traffic routing](virtual-networks-udr-overview.md) and [Tutorial: Route network traffic with a route table by using the Azure portal](tutorial-create-route-table-portal.md). |
   | **Service endpoints** | You can optionally enable one or more service endpoints for a subnet. To enable a service endpoint for a service during portal subnet setup, select the service or services that you want service endpoints for from the popup list under **Services**. Azure configures the location automatically for an endpoint. To remove a service endpoint, deselect the service you want to remove the service endpoint for. For more information, see [Virtual network service endpoints](virtual-network-service-endpoints-overview.md).<br><br>By default, Azure configures the service endpoints for the virtual network's region. To support regional failover scenarios, Azure automatically configures endpoints to [Azure paired regions](../availability-zones/cross-region-replication-azure.md?toc=%2fazure%2fvirtual-network%2ftoc.json) for Azure Storage.<br><br>Once you enable a service endpoint, you must also enable subnet access for resources the service creates. For example, if you enable the service endpoint for **Microsoft.Storage**, you must also enable network access to all Azure Storage accounts you want to grant network access to. To enable network access to subnets that a service endpoint is enabled for, see the documentation for the individual service.<br><br>To validate that a service endpoint is enabled for a subnet, view the [effective routes](diagnose-network-routing-problem.md) for any network interface in the subnet. When you configure an endpoint, you see a default route with the address prefixes of the service, and a next hop type of **VirtualNetworkServiceEndpoint**. For more information, see [Virtual network traffic routing](virtual-networks-udr-overview.md).|
   | **Subnet delegation** | You can optionally enable one or more delegations for a subnet. Subnet delegation gives explicit permissions to the service to create service-specific resources in the subnet by using a unique identifier during service deployment. To delegate for a service during portal subnet setup, select the service you want to delegate to from the popup list. |
   | **Network policy for private endpoints**| To control traffic going to a private endpoint, you can use **Network security groups** or **Route tables**. During portal subnet setup, select either or both of these options under **Private endpoint network policy** to use these controls on a subnet. Once enabled, network policy applies to all private endpoints on the subnet. For more information, see [Manage network policies for private endpoints](../private-link/disable-private-endpoint-network-policy.md). |

## Change subnet settings

# [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), search for and select *virtual networks*.
1. On the **Virtual networks** page, select the virtual network you want to change subnet settings for.
1. On the virtual network's page, select **Subnets** from the left navigation.
1. On the **Subnets** page, select the subnet you want to change settings for.
1. On the subnet screen, change the subnet settings, and then select **Save**.

# [Azure CLI](#tab/azure-cli)

Run the [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) command with the options you want to change.

```azurecli-interactive
az network vnet subnet update
```

# [PowerShell](#tab/azure-powershell)

Run the [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) command with the options you want to change. Then set the configuration with `Set-AzVirtualNetwork`.

---

You can change the following subnet settings after the subnet is created:

| Setting | Description |
| --- | --- |
| **Subnet address range** | If no resources are deployed within the subnet, you can change the address range. If any resources exist in the subnet, you must first either move the resources to another subnet or delete them from the subnet. The steps you take to move or delete a resource vary depending on the resource. To learn how to move or delete resources that are in subnets, read the documentation for each resource type.|
| **Add IPv6 address space**, **NAT gateway**, **Network security group**, and **Route table** | You can add IPv6, NAT gateway, NSG, or route table support after you create the subnet.|
| **Service endpoints** | To enable a service endpoint for an existing subnet, ensure that no critical tasks are running on any resource in the subnet. Service endpoints switch routes on every network interface in the subnet. The service endpoints change from using the default route with the `0.0.0.0/0` address prefix and next hop type of `Internet` to using a new route with the address prefix of the service and a next hop type of `VirtualNetworkServiceEndpoint`.<br><br>During the switch, any open TCP connections may be terminated. The service endpoint isn't enabled until traffic to the service for all network interfaces updates with the new route. For more information, see [Virtual network traffic routing](virtual-networks-udr-overview.md).|
| **Subnet delegation** | You can modify subnet delegation to enable zero or multiple delegations. If a resource for a service is already deployed in the subnet, you can't add or remove subnet delegations until you remove all the resources for the service. To delegate for a different service in the portal, select the service you want to delegate to from the popup list. |
| **Network policy for private endpoints**| You can change private endpoint network policy after subnet creation.|

## Delete a subnet

# [Portal](#tab/azure-portal)

You can delete a subnet only if there are no resources in the subnet. If resources are in the subnet, you must delete those resources before you can delete the subnet. The steps you take to delete a resource vary depending on the resource. To learn how to delete the resources, see the documentation for each resource type.

1. In the [Azure portal](https://portal.azure.com), search for and select *virtual networks*.
1. On the **Virtual networks** page, select the virtual network you want to delete a subnet from.
1. On the virtual network's page, select **Subnets** from the left navigation.
1. On the **Subnets** page, select the subnet you want to delete.
1. Select **Delete**, and then select **Yes** in the confirmation dialog box.

# [Azure CLI](#tab/azure-cli)

Run the [az network vnet subnet delete](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-delete) command.

```azurecli-interactive
az network vnet subnet delete --name <subnetName> --resource-group <resourceGroupName> --vnet-name <virtualNetworkName>
```

# [PowerShell](#tab/azure-powershell)

Run the [Remove-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/remove-azvirtualnetworksubnetconfig?toc=%2fazure%2fvirtual-network%2ftoc.json) command and then set the configuration.

```azurepowershell-interactive
Remove-AzVirtualNetworkSubnetConfig -Name <subnetName> -VirtualNetwork $vnet | Set-AzVirtualNetwork
```

---

## Next steps

- [Create, change, or delete a virtual network](manage-virtual-network.md).
- [PowerShell sample scripts](powershell-samples.md)
- [Azure CLI sample scripts](cli-samples.md)
- [Azure Resource Manager template samples](template-samples.md)
- [Azure Policy built-in definitions for Azure Virtual Network](./policy-reference.md)
