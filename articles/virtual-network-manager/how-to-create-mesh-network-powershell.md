---
title: 'Create a mesh network topology with Azure Virtual Network Manager - Azure PowerShell'
description: Learn how to create a mesh network topology with Azure Virtual Network Manager using Azure PowerShell.
author: mbender-ms    
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: how-to
ms.date: 03/22/2023
ms.custom: ignite-fall-2021, devx-track-azurepowershell
---

# Create a mesh network topology with Azure Virtual Network Manager - Azure PowerShell

In this article, you'll learn how to create a mesh network topology with Azure Virtual Network Manager using Azure PowerShell. With this configuration, all the virtual networks of the same region in the same network group can communicate with one another. You can enable cross region connectivity by enabling the global mesh setting in the connectivity configuration.

> [!IMPORTANT]
> Azure Virtual Network Manager is generally available for Virtual Network Manager and hub and spoke connectivity configurations. 
>
> Mesh connectivity configurations and security admin rules remain in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* Read about [mesh](concept-connectivity-configuration.md#mesh-network-topology) network topology.
* Created a [Azure Virtual Network Manager instance](create-virtual-network-manager-powershell.md#create-virtual-network-manager).
* Identify virtual networks you want to use in the mesh configuration or create new [virtual networks](../virtual-network/quick-create-powershell.md).
* Version `5.3.0` of `Az.Network` is required to access the required cmdlets for Azure Virtual Network Manager.
* If you're running PowerShell locally, you need to run `Connect-AzAccount` to create a connection with Azure.

## Create a network group and add members

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

## Create a mesh connectivity configuration

This section will guide you through how to create a mesh configuration with the network group you created in the previous section.

1. Create a connectivity group item to add a network group to with New-AzNetworkManagerConnectivityGroupItem.

    ```azurepowershell-interactive
    $gi = @{
        NetworkGroupId = $networkgroup.Id
    }
    $groupItem = New-AzNetworkManagerConnectivityGroupItem @gi
    ```

1. Create a configuration group and add the group item from the previous step.

    ```azurepowershell-interactive
    [System.Collections.Generic.List[Microsoft.Azure.Commands.Network.Models.PSNetworkManagerConnectivityGroupItem]]$configGroup = @()
    $configGroup.Add($groupItem)
    ```

1. Create the connectivity configuration with New-AzNetworkManagerConnectivityConfiguration.

    ```azurepowershell-interactive
    $config = @{
        Name = 'connectivityconfig'
        ResourceGroupName = 'myAVNMResourceGroup'
        NetworkManagerName = 'myAVNM'
        ConnectivityTopology = 'Mesh'
        AppliesToGroup = $configGroup
    }
    $connectivityconfig = New-AzNetworkManagerConnectivityConfiguration @config
     ```

## Deploy the mesh configuration

Commit the configuration to the target regions with Deploy-AzNetworkManagerCommit.

```azurepowershell-interactive
[System.Collections.Generic.List[string]]$configIds = @()  
$configIds.add($connectivityconfig.id) 
[System.Collections.Generic.List[string]]$target = @()   
$target.Add("westus")     

$deployment = @{
    Name = 'myAVNM'
    ResourceGroupName = 'myAVNMResourceGroup'
    ConfigurationId = $configIds
    TargetLocation = $target
    CommitType = 'Connectivity'
}
Deploy-AzNetworkManagerCommit @deployment
```

## Confirm deployment

1. Go to one of the virtual networks in the portal and select **Network Manager** under *Settings*. You should see the configuration listed on that page.

1. To test connectivity between virtual networks, deploy a test virtual machine into each virtual network and start an ICMP request between them.

## Next steps

- Learn about [Security admin rules](concept-security-admins.md)
- Learn how to block network traffic with a [SecurityAdmin configuration](how-to-block-network-traffic-powershell.md).
