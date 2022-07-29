---
title: 'Quickstart: Create a mesh network with Azure Virtual Network Manager using Azure PowerShell'
description: Use this quickstart to learn how to create a mesh network with Virtual Network Manager using Azure PowerShell.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: quickstart
ms.date: 06/27/2022
ms.custom: template-quickstart, ignite-fall-2021, mode-api
---

# Quickstart: Create a mesh network with Azure Virtual Network Manager using Azure PowerShell

Get started with Azure Virtual Network Manager by using the Azure PowerShell to manage connectivity for your virtual networks.

In this quickstart, you'll deploy three virtual networks and use Azure Virtual Network Manager to create a mesh network topology.

> [!IMPORTANT]
> Azure Virtual Network Manager is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* During preview, the `4.15.1-preview` version of `Az.Network` is required to access the required cmdlets.
* If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

> [!IMPORTANT]
> Perform this quickstart using Powershell locally, not through Azure Cloud Shell. The version of `Az.Network` in Azure Cloud Shell does not currently support the Azure Virtual Network Manager cmdlets.

## Install Azure PowerShell module

Install the latest *Az.Network* Azure PowerShell module using this command:

```azurepowershell-interactive
 Install-Module -Name Az.Network -RequiredVersion 4.15.1-preview -AllowPrerelease
```

## Create a resource group

Before you can create an Azure Virtual Network Manager, you have to create a resource group to host the Network Manager. Create a resource group with [New-AzResourceGroup](/powershell/module/az.Resources/New-azResourceGroup). This example creates a resource group named **myAVNMResourceGroup** in the **WestUS** location.

```azurepowershell-interactive
$rg = @{
    Name = 'myAVNMResourceGroup'
    Location = 'WestUS'
}
New-AzResourceGroup @rg
```

## Create Virtual Network Manager

1. Define the scope and access type this Azure Virtual Network Manager instance will have. You can choose to create the scope with subscriptions group or management group or a combination of both. Create the scope by using New-AzNetworkManagerScope.

    ```azurepowershell-interactive
    Import-Module -Name Az.Network -RequiredVersion "4.15.1"
    
    [System.Collections.Generic.List[string]]$subGroup = @()  
    $subGroup.Add("/subscriptions/abcdef12-3456-7890-abcd-ef1234567890")
    [System.Collections.Generic.List[string]]$mgGroup = @()  
    $mgGroup.Add("/providers/Microsoft.Management/managementGroups/abcdef12-3456-7890-abcd-ef1234567890")
    
    [System.Collections.Generic.List[String]]$access = @()  
    $access.Add("Connectivity");  
    $access.Add("SecurityAdmin"); 
 
    $scope = New-AzNetworkManagerScope -Subscription $subGroup  -ManagementGroup $mgGroup
    ```

1. Create the Virtual Network Manager with New-AzNetworkManager. This example creates an Azure Virtual Network Manager named **myAVNM** in the West US location.

    ```azurepowershell-interactive
    $avnm = @{
        Name = 'myAVNM'
        ResourceGroupName = 'myAVNMResourceGroup'
        NetworkManagerScope = $scope
        NetworkManagerScopeAccess = $access
        Location = 'West US'
    }
    $networkmanager = New-AzNetworkManager @avnm
    ```

## Create three virtual networks

Create three virtual networks with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). This example creates virtual networks named **VNetA**, **VNetB** and **VNetC** in the **West US** location. If you already have virtual networks you want create a mesh network with, you can skip to the next section.

```azurepowershell-interactive
$vnetA = @{
    Name = 'VNetA'
    ResourceGroupName = 'myAVNMResourceGroup'
    Location = 'West US'
    AddressPrefix = '10.0.0.0/16'    
}
$virtualNetworkA = New-AzVirtualNetwork @vnetA

$vnetB = @{
    Name = 'VNetB'
    ResourceGroupName = 'myAVNMResourceGroup'
    Location = 'West US'
    AddressPrefix = '10.1.0.0/16'    
}
$virtualNetworkB = New-AzVirtualNetwork @vnetB

$vnetC = @{
    Name = 'VNetC'
    ResourceGroupName = 'myAVNMResourceGroup'
    Location = 'West US'
    AddressPrefix = '10.2.0.0/16'    
}
$virtualNetworkC = New-AzVirtualNetwork @vnetC
```

### Add a subnet to each virtual network

To complete the configuration of the virtual networks add a /24 subnet to each one. Create a subnet configuration named **default** with [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig).

```azurepowershell-interactive
$subnetA = @{
    Name = 'default'
    VirtualNetwork = $virtualNetworkA
    AddressPrefix = '10.0.0.0/24'
}
$subnetConfigA = Add-AzVirtualNetworkSubnetConfig @subnetA
$virtualnetworkA | Set-AzVirtualNetwork

$subnetB = @{
    Name = 'default'
    VirtualNetwork = $virtualNetworkB
    AddressPrefix = '10.0.0.0/24'
}
$subnetConfigC = Add-AzVirtualNetworkSubnetConfig @subnetB
$virtualnetworkB | Set-AzVirtualNetwork

$subnetC = @{
    Name = 'default'
    VirtualNetwork = $virtualNetworkC
    AddressPrefix = '10.0.0.0/24'
}
$subnetConfigC = Add-AzVirtualNetworkSubnetConfig @subnetC
$virtualnetworkC | Set-AzVirtualNetwork
```

## Create a network group

### Static membership

1. Create a static virtual network member with New-AzNetworkManagerGroupMembersItem.

    ```azurepowershell-interactive
    $ng = @{
         Name = 'myNetworkGroup'
         ResourceGroupName = 'myAVNMResourceGroup'
         NetworkManagerName = 'myAVNM'
         MemberType = 'Microsoft.Network/VirtualNetwork'
     }
     $networkgroup = New-AzNetworkManagerGroup @ng
    ```
    
1. Add the static member to the static membership group with the following commands:

    ```azurepowershell-interactive
    $sm = @{
         Name = 'myStaticMember'
         ResourceGroupName = 'myAVNMResourceGroup'
         NetworkGroupName = 'myNetworkGroup'
         NetworkManagerName = 'myAVNM'
         ResourceId = '/subscriptions/abcdef12-3456-7890-abcd-ef1234567890/resourceGroups/myAVNMResourceGroup/providers/Microsoft.Network/virtualNetworks/VNetA'
     }
     $statimember = New-AzNetworkManagerStaticMember @sm
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

1. Create the network group using the conditional statement defined in the last step using New-AzNetworkManagerGroup.

    ```azurepowershell-interactive
    $ng = @{
        Name = 'myNetworkGroup'
        ResourceGroupName = 'myAVNMResourceGroup'
        GroupMember = $groupMembers
        ConditionalMembership = $conditionalMembership
        NetworkManagerName = 'myAVNM'
        MemberType = 'Microsoft.Network/VirtualNetwork'
    }
    $networkgroup = New-AzNetworkManagerGroup @ng
    ```

## Create a configuration

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

## Commit deployment

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

## Clean up resources

If you no longer need the Azure Virtual Network Manager, you'll need to make sure all of following is true before you can delete the resource:

* There are no deployments of configurations to any region.
* All configurations have been deleted.
* All network groups have been deleted.

1. Remove the connectivity deployment by deploying an empty configuration with Deploy-AzNetworkManagerCommit.

    ```azurepowershell-interactive
    [System.Collections.Generic.List[string]]$configIds = @()
    [System.Collections.Generic.List[string]]$target = @()   
    $target.Add("westus")     
    $removedeployment = @{
        Name = 'myAVNM'
        ResourceGroupName = 'myAVNMResourceGroup'
        ConfigurationId = $configIds
        Target = $target
        CommitType = 'Connectivity'
    }
    Deploy-AzNetworkManagerCommit @removedeployment
    ```

1. Remove the connectivity configuration with Remove-AzNetworkManagerConnectivityConfiguration

    ```azurepowershell-interactive
    $removeconfig = @{
        Name = 'connectivityconfig'
        ResourceGroupName = 'myAVNMResourceGroup'
        NetworkManagerName = 'myAVNM'
    }
    Remove-AzNetworkManagerConnectivityConfiguration @removeconfig   
    ```

1. Remove the network group with Remove-AzNetworkManagerGroup.

    ```azurepowershell-interactive
    $removegroup = @{
        Name = 'myNetworkGroup'
        ResourceGroupName = 'myAVNMResourceGroup'
        NetworkManagerName = 'myAVNM'
    }
    Remove-AzNetworkManagerGroup @removegroup
    ```

1. Delete the network manager instance with Remove-AzNetworkManager.

    ```azurepowershell-interactive
    $removenetworkmanager = @{
        Name = 'myAVNM'
        ResourceGroupName = 'myAVNMResourceGroup'
    }
    Remove-AzNetworkManager @removenetworkmanager
    ```

1. If you no longer need the resource created, delete the resource group with [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup).

    ```azurepowershell-interactive
    Remove-AzResourceGroup -Name 'myAVNMResourceGroup'
    ```

## Next steps

After you've created the Azure Virtual Network Manager, continue on to learn how to block network traffic by using the security admin configuration:

> [!div class="nextstepaction"]
> [Block network traffic with security admin rules](how-to-block-network-traffic-powershell.md)
