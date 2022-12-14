---
title: 'Create a hub and spoke topology with Azure Virtual Network Manager (Preview) - Azure PowerShell'
description: Learn how to create a hub and spoke network topology with Azure Virtual Network Manager using Azure PowerShell.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: how-to
ms.date: 11/02/2021
ms.custom: template-concept, ignite-fall-2021
---

# Create a hub and spoke topology with Azure Virtual Network Manager (Preview) - Azure PowerShell

In this article, you'll learn how to create a hub and spoke network topology with Azure Virtual Network Manager. With this configuration, you select a virtual network to act as a hub and all spoke virtual networks will have bi-directional peering with only the hub by default. You also can enable direct connectivity between spoke virtual networks and enable the spoke virtual networks to use the virtual network gateway in the hub.

> [!IMPORTANT]
> *Azure Virtual Network Manager* is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [**Supplemental Terms of Use for Microsoft Azure Previews**](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* Read about [Hub-and-spoke](concept-connectivity-configuration.md#hub-and-spoke-topology) network topology.
* Created a [Azure Virtual Network Manager instance](create-virtual-network-manager-powershell.md#create-virtual-network-manager).
* Identify virtual networks you want to use in the hub-and-spokes configuration or create new [virtual networks](../virtual-network/quick-create-powershell.md). 

## Create a network group

This section will help you create a network group containing the virtual networks you'll be using for the hub-and-spoke network topology.

### Static membership

1. Create a static virtual network member with New-AzNetworkManagerGroupMembersItem.

    ```azurepowershell-interactive
    $member = New-AzNetworkManagerGroupMembersItem –ResourceId "/subscriptions/abcdef12-3456-7890-abcd-ef1234567890/resourceGroups/myAVNMResourceGroup/providers/Microsoft.Network/virtualNetworks/VNetA"
    ```

1. Add the static member to the static membership group with the following commands:

    ```azurepowershell-interactive
    [System.Collections.Generic.List[Microsoft.Azure.Commands.Network.Models.NetworkManager.PSNetworkManagerGroupMembersItem]]$groupMembers = @()  
    $groupMembers.Add($member)
    ```

### Dynamic membership

1. Define the conditional statement and store it in a variable:

    ```azurepowershell-interactive
    $conditionalMembership = '{ 
        "allof":[ 
            { 
            "field": "name", 
            "contains": "VNet" 
            } 
        ] 
    }' 
    ```

1. Create the network group using either the static membership group (GroupMember) or the dynamic membership group (ConditionalMembership) defined previously using New-AzNetworkManagerGroup.

    ```azurepowershell-interactive
    $ng = @{
        Name = 'myNetworkGroup'
        ResourceGroupName = 'myAVNMResourceGroup'
        GroupMember = $groupMembers
        ConditionalMembership = $conditionalMembership
        NetworkManagerName = 'myAVNM'
        MemberType = 'Microsoft.Network/VirtualNetworks
    }
    $networkgroup = New-AzNetworkManagerGroup @ng
    ```

## Create a hub and spoke connectivity configuration

This section will guide you through how to create a hub-and-spoke configuration with the network group you created in the previous section.

1. Create a spokes connectivity group item to add a network group with New-AzNetworkManagerConnectivityGroupItem. You can enable direct connectivity with the `-GroupConnectivity` flag, global mesh with `-IsGlobal` flag, or `-UseHubGateway` flag to use the gateway in the hub virtual network:

    ```azurepowershell-interactive
    $spokes = @{
        NetworkGroupId = $networkgroup.Id
    }
    $spokesGroup = New-AzNetworkManagerConnectivityGroupItem @gi -UseHubGateway -GroupConnectivity 'None' -IsGlobal
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
        ResourceId = '/subscriptions/abcdef12-3456-7890-abcd-ef1234567890/resourceGroups/myAVNMResourceGroup/providers/Microsoft.Network/virtualNetworks/VNetA'
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

## Confirm deployment

1. Go to one of the virtual networks in the portal and select **Peerings** under *Settings*. You should see a new peering connection create between the hub and the spokes virtual network with *AVNM* in the name.

1. To test *direct connectivity* between spokes, deploy a virtual machine into each spokes virtual network. Then start an ICMP request from one virtual machine to the other.

## Next steps

- Learn about [Security admin rules](concept-security-admins.md)
- Learn how to block network traffic with a [SecurityAdmin configuration](how-to-block-network-traffic-powershell.md).
