---
title: 'Add or modify multiple Azure Firewall rules using Azure PowerShell'
description: In this article, you learn how to add or modify multiple Azure Firewall rules using the Azure PowerShell. 
services: firewall
author: vhorne
ms.service: firewall
ms.custom: devx-track-azurepowershell
ms.date: 02/23/2022
ms.author: victorh
ms.topic: how-to
---

# Add or modify multiple Azure Firewall rules using Azure PowerShell

When you add new rules to Azure Firewall or Azure Firewall policy, you should use the following steps to reduce the total update time:

1. Retrieve the Azure Firewall or Azure Firewall Policy object.
1. Add all new rules and perform other desired modifications in the local object. You can add them to an existing rule collection or create new ones as needed.
1. Push the Firewall or the Firewall Policy updates only when all modifications are done.

The following example shows how to add multiple new DNAT rules to an existing firewall policy using Azure PowerShell. You should follow these same principles also when:

- You update Application or Network rules.
- You update a firewall managed with classic rules.

Carefully review the following steps. You should first try it on a test policy to ensure it works as expected for your needs.

## Connect to your Azure account and set the context to your subscription

```azurepowershell
Connect-AzAccount
Set-AzContext -Subscription "<Subscritpion ID>"

```

## Create local objects of the firewall policy, rule collection group, and rule collection

```azurepowershell
$policy = Get-AzFirewallPolicy -Name "<Policy Name>" -ResourceGroupName "<Resource Group Name>"
$natrulecollectiongroup = Get-AzFirewallPolicyRuleCollectionGroup -Name "<Rule Collection Group Name>" -ResourceGroupName "<Resource Group Name>" -AzureFirewallPolicyName "<Firewall Policy Name>"
$existingrulecollection = $natrulecollectiongroup.Properties.RuleCollection | where {$_.Name -eq "<rule collection name"}
```

## Define new rules to add

```azurepowershell
$newrule1 = New-AzFirewallPolicyNatRule -Name "dnat-rule1" -Protocol "TCP" -SourceAddress "<Source Address>" -DestinationAddress "<Destination>" -DestinationPort "<Destination Port>" -TranslatedAddress "<Translated Address>" -TranslatedPort "<Translated Port>"
$newrule2 = New-AzFirewallPolicyNatRule -Name "dnat-rule1" -Protocol "TCP" -SourceAddress "<Source Address>" -DestinationAddress "<Destination>" -DestinationPort "<Destination Port>" -TranslatedAddress "<Translated Address>" -TranslatedPort "<Translated Port>"
```

## Add the new rules to the local rule collection object

```azurepowershell
$existingrulecollection.Rules.Add($newrule1)
$existingrulecollection.Rules.Add($newrule2)
```

Use this step to add any more rules, or perform any modifications to existing rules in the same rule collection group.

## Update the rule collection on Azure

```azurepowershell
Set-AzFirewallPolicyRuleCollectionGroup -Name " <Rule Collection Group Name> " -FirewallPolicyObject $policy -Priority 200 -RuleCollection $natrulecollectiongroup.Properties.rulecollection
```

## Next steps

- [Azure Firewall Policy rule sets](policy-rule-sets.md)
