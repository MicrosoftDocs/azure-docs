---
title: View Azure virtual network topology
description: Learn how to view the resources in a virtual network and the relationships between them using the Azure portal, PowerShell, or the Azure CLI.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 07/20/2023
ms.custom: template-how-to, devx-track-azurecli, engagement-fy23
---

# View the topology of an Azure virtual network

In this article, you learn how to view resources and the relationships between them in an Azure virtual network. For example, a virtual network contains subnets. Subnets contain resources, such as Azure Virtual Machines (VM). VMs have one or more network interfaces. Each subnet can have a network security group and a route table associated to it. The topology tool of Azure Network Watcher enables you to view all of the resources in a virtual network, the resources associated to resources in a virtual network, and the relationships between the resources.

> [!NOTE]
> Try the new [Topology (Preview)](network-insights-topology.md) experience which offers visualization of Azure resources across multiple subscriptions and regions. Use this [Azure portal link](https://portal.azure.com/#view/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/~/overview) to try Topology (Preview).

## Prerequisites

# [**Portal**](#tab/portal)

- An Azure account with an active subscription and the necessary [permissions](required-rbac-permissions.md). [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure Virtual network with some resources connected to it. For more information, see [Create a virtual network using the Azure portal](../virtual-network/quick-create-portal.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json).

- Network Watcher enabled in the virtual network region. For more information, see [Enable Network Watcher for your region](network-watcher-create.md?tabs=portal#enable-network-watcher-for-your-region).

- Sign in to the [Azure portal](https://portal.azure.com/?WT.mc_id=A261C142F) with your Azure account.

# [**PowerShell**](#tab/powershell)

- An Azure account with an active subscription and the necessary [permissions](required-rbac-permissions.md). [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure Virtual network with some resources connected to it. For more information, see [Create a virtual network using the Azure portal](../virtual-network/quick-create-powershell.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json).

- Network Watcher enabled in the virtual network region. For more information, see [Enable Network Watcher for your region](network-watcher-create.md?tabs=powershell#enable-network-watcher-for-your-region).

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

  You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

# [**Azure CLI**](#tab/cli)

- An Azure account with an active subscription and the necessary [permissions](required-rbac-permissions.md). [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure Virtual network with some resources connected to it. For more information, see [Create a virtual network using the Azure portal](../virtual-network/quick-create-cli.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json).

- Network Watcher enabled in the virtual network region. For more information, see [Enable Network Watcher for your region](network-watcher-create.md?tabs=cli#enable-network-watcher-for-your-region).

- Azure Cloud Shell or Azure CLI.
    
    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.
    
    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

---

## View topology

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter ***network watcher***. Select **Network Watcher** from the search results.

    :::image type="content" source="./media/view-network-topology/portal-search.png" alt-text="Screenshot shows how to search for Network Watcher in the Azure portal." lightbox="./media/view-network-topology/portal-search.png":::

1. Under **Monitoring**, select **Topology**.

1. Select the subscription and resource group of the virtual network that you want to view its topology, and then select the virtual network. 

    :::image type="content" source="./media/view-network-topology/topology.png" alt-text="Screenshot shows the topology of a virtual network in the Azure portal." lightbox="./media/view-network-topology/topology.png":::

    The virtual network in this example has two subnets: **mySubnet** and **GatewaySubnet**. **mySubnet** has three virtual machines (VMs), two of them are in the backend pool of **myLoadBalancer** public load balancer. There are two network security groups: **mySubnet-nsg** is associated to **mySubnet** subnet and **myVM-nsg** is associated to **myVM** virtual machine. **GatewaySubnet** has **VNetGW** virtual network gateway (VPN gateway).
    
    Topology information is only shown for resources that are:

    - in the same resource group and region as the **myVNet** virtual network. For example, a network security group that exists in a resource group other than **myResourceGroup**, isn't shown, even if the network security group is associated to a subnet in the **myVNet** virtual network.
    - in the **myVNet** virtual network, or associated to resources in it. For example, a network security group that isn't associated to a subnet or network interface in the **myVNet** virtual network isn't shown, even if the network security group is in the **myResourceGroup** resource group.

1. Select **Download topology** to download the diagram as an editable image file in svg format.

> [!NOTE]
> The resources shown in the diagram are a subset of the networking components in the virtual network. For example, while a network security group is shown, the security rules within it are not shown in the diagram. Though not differentiated in the diagram, the lines represent one of two relationships: *Containment* or *associated*. To see the full list of resources in the virtual network, and the type of relationship between the resources, generate the topology with [PowerShell](?tabs=powershell#view-topology) or the [Azure CLI](?tabs=cli#view-topology).

# [**PowerShell**](#tab/powershell)

Retrieve the topology of a resource group using [Get-AzNetworkWatcherTopology](/powershell/module/az.network/get-aznetworkwatchertopology). The following example retrieves the network topology of a virtual network in East US region listing the resources that are in the **myResourceGroup** resource group:

```azurepowershell-interactive
# Get a network level view of resources and their relationships in "myResourceGroup" resource group.
Get-AzNetworkWatcherTopology -Location 'eastus' -TargetResourceGroupName 'myResourceGroup'
```

Topology information is only returned for resources that are in the same resource group and region as the **myVNet** virtual network. For example, a network security group that exists in a resource group other than **myResourceGroup**, isn't listed, even if the network security group is associated to a subnet in the **myVNet** virtual network.

Learn more about the relationships and [properties](#properties) in the returned output.

# [**Azure CLI**](#tab/cli)

Retrieve the topology of a resource group using [az network watcher show-topology](/cli/azure/network/watcher#az-network-watcher-show-topology). The following example retrieves the network topology for **myResourceGroup** resource group:

```azurecli-interactive
# Get a network level view of resources and their relationships in "myResourceGroup" resource group.
az network watcher show-topology --resource-group 'myResourceGroup'
```

Topology information is only returned for resources that are in the same resource group and region as the **myVNet** virtual network. For example, a network security group that exists in a resource group other than **myResourceGroup**, isn't listed, even if the network security group is associated to a subnet in the **myVNet** virtual network.

Learn more about the relationships and [properties](#properties) in the returned output.

---

## Relationships

All resources returned in a topology have one of the following types of relationship to another resource:

| Relationship type | Example                                                                                                |
| ---               | ---                                                                                                    |
| Containment       | A virtual network contains a subnet. A subnet contains a network interface.                            |
| Associated        | A network interface is associated with a VM. A public IP address is associated to a network interface. |

## Properties

All resources returned in a topology have the following properties:

- **Name**: The name of the resource
- **ID**: The URI of the resource.
- **Location**: The Azure region that the resource exists in.
- **ResourceGroup**: The resource group that the resource exists in.
- **Associations**: A list of associations to the referenced object. Each association has the following properties:
    - **AssociationType**: The relationship between the child and the parent object. Valid values are **Contains** or **Associated**.
    - **Name**: The name of the resource referenced in the association.
    - **ResourceId**: The URI of the resource referenced in the association.

## Supported resources

Topology supports the following resources:

- Virtual networks and subnets
- Virtual network peerings
- Network interfaces
- Network security groups
- Load balancers and their health probes
- Public IP
- Virtual network gateways
- VPN gateway connections
- Virtual machines
- Virtual machine scale sets.

## Next steps

- Learn how to [diagnose a network traffic filter problem to or from a VM](diagnose-vm-network-traffic-filtering-problem.md) using Network Watcher's IP flow verify.
- Learn how to [diagnose a network traffic routing problem from a VM](diagnose-vm-network-routing-problem.md) using Network Watcher's next hop.
