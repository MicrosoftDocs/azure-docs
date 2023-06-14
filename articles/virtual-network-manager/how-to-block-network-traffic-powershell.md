---
title: 'How to block network traffic with Azure Virtual Network Manager - Azure PowerShell'
description: Learn how to block network traffic using security rules in Azure Virtual Network Manager with the Azure PowerShell.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: how-to
ms.date: 03/22/2023
ms.custom: template-how-to, devx-track-azurepowershell
---

# How to block network traffic with Azure Virtual Network Manager - Azure PowerShell

This article shows you how to create a security rule to block outbound network traffic to port 80 and 443 that you can add to your rule collections. For more information, see [Security admin rules](concept-security-admins.md).

> [!IMPORTANT]
> Azure Virtual Network Manager is generally available for Virtual Network Manager and hub and spoke connectivity configurations. 
>
> Mesh connectivity configurations and security admin rules remain in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

Before you start configuring security rules, confirm the following steps:

* You understand each element in a [Security admin rule](concept-security-admins.md).
* You've created an [Azure Virtual Network Manager instance](create-virtual-network-manager-powershell.md).
* Installed version of `Az.Network` of `5.3.0` or higher is required to access the required cmdlets.

## Create a SecurityAdmin configuration

1. Create a new SecurityAdmin configuration with New-AzNetworkManagerSecurityAdminConfiguration.

    ```azurepowershell-interactive
    $config = @{
        Name = 'SecurityConfig'
        ResourceGroupName = 'myAVNMResourceGroup'
        NetworkManagerName = 'myAVNM'
    }
    $securityconfig = New-AzNetworkManagerSecurityAdminConfiguration @config

    ```

1. Store network group to a variable with Get-AzNetworkManagerGroup.

    ```azurepowershell-interactive
    $ng = @{
        Name = 'myNetworkGroup'
        ResourceGroupName = 'myAVNMResourceGroup'
        NetworkManagerName = 'myAVNM'
    }
    $networkgroup = Get-AzNetworkManagerGroup @ng   
    ```

1. Create a connectivity group item to add a network group to with New-AzNetworkManagerSecurityGroupItem.

    ```azurepowershell-interactive
    $gi = @{
        NetworkGroupId = "$networkgroup.Id"
    }
    
    $groupItem = New-AzNetworkManagerSecurityGroupItem -NetworkGroupId $networkgroup.id
    ```

1. Create a configuration group and add the group item from the previous step.

    ```azurepowershell-interactive
    [System.Collections.Generic.List[Microsoft.Azure.Commands.Network.Models.PSNetworkManagerSecurityGroupItem]]$configGroup = @()  
    $configGroup.Add($groupItem) 

    $configGroup = @($groupItem)
    ```

1. Create a security admin rules collection with New-AzNetworkManagerSecurityAdminRuleCollection.

    ```azurepowershell-interactive
    $collection = @{
        Name = 'myRuleCollection'
        ResourceGroupName = 'myAVNMResourceGroup'
        NetworkManager = 'myAVNM'
        ConfigName = 'SecurityConfig'
        AppliesToGroup = "$configGroup"
    }
    $rulecollection = New-AzNetworkManagerSecurityAdminRuleCollection @collection -AppliesToGroup $configGroup
    ```

1. Define the variables for the source and destination address prefixes and ports with New-AzNetworkManagerAddressPrefixItem.

    ```azurepowershell-interactive
    $sourceip = @{
        AddressPrefix = 'Internet'
        AddressPrefixType = 'ServiceTag'
    }
    $sourceprefix = New-AzNetworkManagerAddressPrefixItem @sourceip

    $destinationip = @{
        AddressPrefix = '10.0.0.0/24'
        AddressPrefixType = 'IPPrefix'
    }
    $destinationprefix = New-AzNetworkManagerAddressPrefixItem @destinationip

    [System.Collections.Generic.List[string]]$sourcePortList = @() 
    $sourcePortList.Add("65500”) 

    [System.Collections.Generic.List[string]]$destinationPortList = @() 
    $destinationPortList.Add("80”)
    $destinationPortList.Add("443”)
    ```

1. Create a security rule with New-AzNetworkManagerSecurityAdminRule.

    ```azurepowershell-interactive
    $rule = @{
        Name = 'Block_HTTP_HTTPS'
        ResourceGroupName = 'myAVNMResourceGroup'
        NetworkManagerName = 'myAVNM'
        SecurityAdminConfigurationName = 'SecurityConfig'
        RuleCollectionName = 'myRuleCollection'
        Protocol = 'TCP'
        Access = 'Deny'
        Priority = '100'
        Direction = 'Outbound'
        SourceAddressPrefix = $sourceprefix
        SourcePortRange = $sourcePortList
        DestinationAddressPrefix = $destinationprefix
        DestinationPortRange = $destinationPortList
    }
    $securityrule = New-AzNetworkManagerSecurityAdminRule @rule
    ```

## Commit deployment

Commit the security configuration to target regions with Deploy-AzNetworkManagerCommit.

```azurepowershell-interactive
$regions = @("westus")
$deployment = @{
    Name = 'myAVNM'
    ResourceGroupName = 'myAVNMResourceGroup'
    ConfigurationId = $configIds
    TargetLocation = $regions
    CommitType = 'SecurityAdmin'
}
Deploy-AzNetworkManagerCommit @deployment 
```

## Delete security configuration

If you no longer need the security configuration, make sure the following criteria is true so you can delete the security configuration itself:

* There are no deployments of configurations to any region.
* Delete all security rules in a rule collection associated to the security configuration.

### Remove security configuration deployment

Remove the security deployment by deploying a configuration with Deploy-AzNetworkManagerCommit.

```azurepowershell-interactive
[System.Collections.Generic.List[string]]$configIds = @()
[System.Collections.Generic.List[string]]$regions = @()   
$regions.Add("westus")     
$removedeployment = @{
    Name = 'myAVNM'
    ResourceGroupName = 'myAVNMResourceGroup'
    ConfigurationId = $configIds
    TargetLocation = $regions
    CommitType = 'SecurityAdmin'
}
Deploy-AzNetworkManagerCommit @removedeployment
```

### Remove security rules

Remove security rules with Remove-AzNetworkManagerSecurityAdminRule.

```azurepowershell-interactive
$removerule = @{
    Name = 'Block80'
    ResourceGroupName = 'myAVNMResourceGroup'
    NetworkManagerName = 'myAVNM'
    SecurityAdminConfigurationName = 'SecurityConfig'
}
Remove-AzNetworkManagerSecurityAdminRule @removerule
```

### Remove security rule collections

```azurepowershell-interactive
$removecollection = @{
    Name = 'myRuleCollection'
    ResourceGroupName = 'myAVNMResourceGroup'
    NetworkManagerName = 'myAVNM'
    SecurityAdminConfigurationName = 'SecurityConfig'
}
Remove-AzNetworkManagerSecurityAdminRuleCollection @removecollection
```

### Delete configuration

Delete the security configuration with Remove-AzNetworkManagerSecurityAdminConfiguration.

```azurepowershell-interactive
$removeconfig = @{
    Name = 'SecurityConfig'
    ResourceGroupName = 'myAVNMResourceGroup'
    NetworkManagerName = 'myAVNM'
}
Remove-AzNetworkManagerSecurityAdminConfiguration @removeconfig
```

## Next steps

Learn more about [Security admin rules](concept-security-admins.md).
