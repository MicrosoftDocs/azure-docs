---
title: 'Create a hub and spoke topology in Azure - PowerShell'
description: Learn how to create a hub and spoke network topology for multiple virtual networks with Azure Virtual Network Manager using Azure PowerShell.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: how-to
ms.date: 05/01/2023
ms.custom: template-concept, engagement-fy23, devx-track-azurepowershell
---

# Create a hub and spoke topology in Azure - PowerShell

In this article, you'll learn how to create a hub and spoke network topology with Azure Virtual Network Manager. With this configuration, you select a virtual network to act as a hub and all spoke virtual networks will have bi-directional peering with only the hub by default. You also can enable direct connectivity between spoke virtual networks and enable the spoke virtual networks to use the virtual network gateway in the hub.

> [!IMPORTANT]
> Azure Virtual Network Manager is generally available for Virtual Network Manager and hub and spoke connectivity configurations. 
>
> Mesh connectivity configurations and security admin rules remain in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* Read about [Hub-and-spoke](concept-connectivity-configuration.md#hub-and-spoke-topology) network topology.
* Created a [Azure Virtual Network Manager instance](create-virtual-network-manager-powershell.md#create-a-virtual-network-manager-instance).
* Identify virtual networks you want to use in the hub-and-spokes configuration or create new [virtual networks](../virtual-network/quick-create-powershell.md).
* Version `5.3.0` of `Az.Network` is required to access the required cmdlets for Azure Virtual Network Manager.
* If you're running PowerShell locally, you need to run `Connect-AzAccount` to create a connection with Azure.

## Create a virtual network group and add members

This section will help you create a network group containing the virtual networks you'll be using for the hub-and-spoke network topology.

1. Create a network group for virtual networks with New-AzNetworkManagerGroup.

    ```azurepowershell-interactive
    $ng = @{
            Name = 'myNetworkGroup'
            ResourceGroupName = 'myAVNMResourceGroup'
            NetworkManagerName = 'myAVNM'
        }
        $networkgroup = New-AzNetworkManagerGroup @ng
    ```

1. Add the static member to the static membership group with New-AzNetworkManagerStaticMember:

    ```azurepowershell-interactive
        $vnet = get-AZVirtualNetwork -ResourceGroupName 'myAVNMResourceGroup' -Name 'VNetA'
        $sm = @{
        NetworkGroupName = $networkgroup.name
        ResourceGroupName = 'myAVNMResourceGroup'
        NetworkManagerName = 'myAVNM'
        Name = 'statiMember'
        ResourceId = $vnet.id
        }
        $staticmember = New-AzNetworkManagerStaticMember @sm
    ```

## Create a hub and spoke connectivity configuration

This section will guide you through how to create a hub-and-spoke configuration with the network group you created in the previous section.

1. Create a spokes connectivity group item to add a network group with New-AzNetworkManagerConnectivityGroupItem. You can enable direct connectivity with the `-GroupConnectivity` flag, global mesh with `-IsGlobal` flag, or `-UseHubGateway` flag to use the gateway in the hub virtual network:

    ```azurepowershell-interactive
    $spokes = @{
        NetworkGroupId = $networkgroup.Id
    }
    $spokesGroup = New-AzNetworkManagerConnectivityGroupItem @spokes -UseHubGateway -GroupConnectivity 'DirectlyConnected' -IsGlobal
    ```

1. Create a spokes connectivity group and add the group item from the previous step.

    ```azurepowershell-interactive
    [System.Collections.Generic.List[Microsoft.Azure.Commands.Network.Models.NetworkManager.PSNetworkManagerConnectivityGroupItem]]$configGroup = @()
    $configGroup.Add($spokesGroup) 
    ```

1. Create a hub connectivity group item and define the virtual network you'll use as the hub with New-AzNetworkManagerHub.

    ```azurepowershell-interactive
    [System.Collections.Generic.List[Microsoft.Azure.Commands.Network.Models.NetworkManager.PSNetworkManagerHub]]$hubList = @()
    
    $hub = @{
        ResourceId = '/subscriptions/6a5f35e9-6951-499d-a36b-83c6c6eed44a/resourceGroups/myAVNMResourceGroup/providers/Microsoft.Network/virtualNetworks/VNetA'
        ResourceType = 'Microsoft.Network/virtualNetworks'
    } 
    $hubvnet = New-AzNetworkManagerHub @hub

    $hubList.Add($hubvnet)
    ```

1. Create the connectivity configuration with New-AzNetworkManagerConnectivityConfiguration.

    ```azurepowershell-interactive
    $config = @{
        Name = 'connectivityconfig'
        ResourceGroupName = 'myAVNMResourceGroup'
        NetworkManagerName = 'myAVNM'
        ConnectivityTopology = 'HubAndSpoke'
        Hub = $hubList
        AppliesToGroup = $configGroup
    }
    $connectivityconfig = New-AzNetworkManagerConnectivityConfiguration @config -DeleteExistingPeering -IsGlobal
     ```

> [!NOTE]
> If you're currently using peering and want to manage topology and connectivity with Azure Virtual Network Manager, you can migrate without any downtime to your network. Virtual network manager instances are fully compatible with pre-existing hub and spoke topology deployment using peering. This means that you won't need to delete any existing peered connections between the spokes and the hub as the network manager will automatically detect and manage them.

## Deploy the hub-and-spoke configuration

Commit the configuration to the target regions with Deploy-AzNetworkManagerCommit.

```azurepowershell-interactive
[System.Collections.Generic.List[string]]$configIds = @()  
$configIds.add($connectivityconfig.id) 
[System.Collections.Generic.List[string]]$regions = @()   
$regions.Add("westus")     

$deployment = @{
    Name = 'myAVNM'
    ResourceGroupName = 'myAVNMResourceGroup'
    ConfigurationId = $configIds
    TargetLocation = $regions
    CommitType = 'Connectivity'
}
Deploy-AzNetworkManagerCommit @deployment
```

## Confirm configuration deployment

1. Go to one of the virtual networks in the Azure portal and select **Peerings** under **Settings**. You should see a new peering connection created between the hub and the spoke virtual networks with *AVNM* in the name.

1. To test *direct connectivity* between spokes, deploy a virtual machine into each spokes virtual network. Then start an ICMP request from one virtual machine to the other.

## Next steps

- Learn about [Security admin rules](concept-security-admins.md)
- Learn how to block network traffic with a [SecurityAdmin configuration](how-to-block-network-traffic-powershell.md).
