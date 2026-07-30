---
title: 'How to block network traffic with Azure Virtual Network Manager - Azure PowerShell'
description: Learn how to block network traffic using security rules in Azure Virtual Network Manager with the Azure PowerShell.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: how-to
ms.date: 07/29/2026
ms.custom: template-how-to, devx-track-azurepowershell
---

# How to block network traffic with Azure Virtual Network Manager - Azure PowerShell

This article shows you how to create a security rule to block outbound network traffic to ports 80 and 443 that you can add to your rule collections. For more information, see [Security admin rules](concept-security-admins.md).

## Prerequisites

Before you start configuring security rules, confirm the following steps:

* You understand each element in a [Security admin rule](concept-security-admins.md).
* You've created an [Azure Virtual Network Manager instance](create-virtual-network-manager-powershell.md).
* Installed version of `Az.Network` of `5.3.0` or higher is required to access the required cmdlets.

## Create the security admin configuration

Create a security admin configuration by using `New-AzNetworkManagerSecurityAdminConfiguration`. The configuration holds the rule collections and rules you create in the following sections.

```azurepowershell-interactive
$config = @{
    Name = 'SecurityConfig'
    ResourceGroupName = 'myAVNMResourceGroup'
    NetworkManagerName = 'myAVNM'
}
$securityconfig = New-AzNetworkManagerSecurityAdminConfiguration @config

```

## Add the network group to a configuration group

A security admin configuration applies to one or more network groups. These steps store the network group in a variable and add it to a configuration group.

1. Store the network group in a variable by using `Get-AzNetworkManagerGroup`.

    ```azurepowershell-interactive
    $ng = @{
        Name = 'myNetworkGroup'
        ResourceGroupName = 'myAVNMResourceGroup'
        NetworkManagerName = 'myAVNM'
    }
    $networkgroup = Get-AzNetworkManagerGroup @ng   
    ```

1. Create a security group item for the network group by using `New-AzNetworkManagerSecurityGroupItem`.

    ```azurepowershell-interactive
    $groupItem = New-AzNetworkManagerSecurityGroupItem -NetworkGroupId $networkgroup.id
    ```

1. Create a configuration group and add the group item from the previous step.

    ```azurepowershell-interactive
    [System.Collections.Generic.List[Microsoft.Azure.Commands.Network.Models.PSNetworkManagerSecurityGroupItem]]$configGroup = @()  
    $configGroup.Add($groupItem) 
    ```

## Create the rule collection

Create a security admin rule collection by using `New-AzNetworkManagerSecurityAdminRuleCollection`. The collection applies to the configuration group you created in the previous section.

```azurepowershell-interactive
$collection = @{
    Name = 'myRuleCollection'
    ResourceGroupName = 'myAVNMResourceGroup'
    NetworkManagerName = 'myAVNM'
    ConfigName = 'SecurityConfig'
}
$rulecollection = New-AzNetworkManagerSecurityAdminRuleCollection @collection -AppliesToGroup $configGroup
```

## Create the deny rule for ports 80 and 443

These steps define the address prefixes and ports for the rule, and then create a rule named `Block_HTTP_HTTPS` that denies outbound traffic to ports 80 and 443.

1. Define the source and destination address prefixes and ports by using `New-AzNetworkManagerAddressPrefixItem`.

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
    $sourcePortList.Add("65500") 

    [System.Collections.Generic.List[string]]$destinationPortList = @() 
    $destinationPortList.Add("80")
    $destinationPortList.Add("443")
    ```

1. Create the security rule by using `New-AzNetworkManagerSecurityAdminRule`.

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

Commit the security configuration to target regions by using `Deploy-AzNetworkManagerCommit`. Build the `$configIds` list from the security admin configuration you created earlier, and then pass it to the commit.

```azurepowershell-interactive
[System.Collections.Generic.List[string]]$configIds = @()
$configIds.Add($securityconfig.Id)

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

If you no longer need the security configuration, make sure the following criteria are true so you can delete the security configuration itself:

* There are no deployments of configurations to any region.
* Delete all security rules in a rule collection associated to the security configuration.

### Remove security configuration deployment

Remove the security deployment by deploying a configuration with `Deploy-AzNetworkManagerCommit`.

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

Remove the security rule you created earlier by using `Remove-AzNetworkManagerSecurityAdminRule`.

```azurepowershell-interactive
$removerule = @{
    Name = 'Block_HTTP_HTTPS'
    ResourceGroupName = 'myAVNMResourceGroup'
    NetworkManagerName = 'myAVNM'
    SecurityAdminConfigurationName = 'SecurityConfig'
    RuleCollectionName = 'myRuleCollection'
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

Delete the security configuration with `Remove-AzNetworkManagerSecurityAdminConfiguration`.

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
