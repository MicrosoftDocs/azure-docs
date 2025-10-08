---
title: 'Add or modify multiple Azure Firewall rules using Azure PowerShell'
description: In this article, you learn how to add or modify multiple Azure Firewall rules using Azure PowerShell. 
services: firewall
author: duongau
ms.service: azure-firewall
ms.custom: devx-track-azurepowershell
ms.date: 09/29/2025
ms.author: duau
ms.topic: how-to
# Customer intent: As a network administrator, I want to add or modify multiple Azure Firewall rules using PowerShell, so that I can efficiently manage firewall policies and reduce update times for better network security.
---

# Add or modify multiple Azure Firewall rules using Azure PowerShell

This article shows you how to efficiently add and modify multiple Azure Firewall rules using Azure PowerShell. By following the steps in this article, you can reduce update time and avoid configuration conflicts.

## Prerequisites

Before you begin, make sure you have:

- An Azure subscription with an existing Azure Firewall or Azure Firewall Policy
- Azure PowerShell installed and configured
- Appropriate permissions to modify firewall policies
- A test environment to validate changes before applying to production

## Overview

When you add new rules to Azure Firewall or Azure Firewall Policy, use the following approach to reduce the total update time and avoid potential conflicts:

1. Retrieve the Azure Firewall or Azure Firewall Policy object.
1. Add all new rules and perform other desired modifications in the local object. You can add them to an existing rule collection or create new ones as needed.
1. Push the Firewall or Firewall Policy updates only when all modifications are completed.

This approach ensures atomic updates and reduces the risk of configuration conflicts.

The following sections show you how to add new DNAT rules and update existing rules in a firewall policy. You should follow these same principles when you:

- Update Application or Network rules
- Update a firewall managed with classic rules
- Modify existing rule configurations

> [!IMPORTANT]
> Always test these procedures on a test policy first to ensure they work as expected for your specific requirements.

## Connect to Azure and set context

Connect to your Azure account and set the context to your target subscription:

```azurepowershell-interactive
Connect-AzAccount
Set-AzContext -Subscription "<Subscription ID>"
```

## Retrieve firewall policy objects

Create local objects for the firewall policy, rule collection group, and the specific rule collection you want to modify:

```azurepowershell-interactive
$policy = Get-AzFirewallPolicy -Name "<Policy Name>" -ResourceGroupName "<Resource Group Name>"
$natrulecollectiongroup = Get-AzFirewallPolicyRuleCollectionGroup -Name "<Rule Collection Group Name>" -ResourceGroupName "<Resource Group Name>" -AzureFirewallPolicyName "<Firewall Policy Name>"
$existingrulecollection = $natrulecollectiongroup.Properties.RuleCollection | Where-Object {$_.Name -eq "<rule collection name>"}
```

## Add new rules

### Define new rules

Define the new DNAT rules you want to add to the rule collection:

```azurepowershell-interactive
$newrule1 = New-AzFirewallPolicyNatRule -Name "dnat-rule1" -Protocol "TCP" -SourceAddress "<Source Address>" -DestinationAddress "<Destination Address>" -DestinationPort "<Destination Port>" -TranslatedAddress "<Translated Address>" -TranslatedPort "<Translated Port>"
$newrule2 = New-AzFirewallPolicyNatRule -Name "dnat-rule2" -Protocol "TCP" -SourceAddress "<Source Address>" -DestinationAddress "<Destination Address>" -DestinationPort "<Destination Port>" -TranslatedAddress "<Translated Address>" -TranslatedPort "<Translated Port>"
```

### Add rules to rule collection

Add the new rules to the local rule collection object:

```azurepowershell-interactive
$existingrulecollection.Rules.Add($newrule1)
$existingrulecollection.Rules.Add($newrule2)
```

> [!NOTE]
> You can add as many rules as needed in this step. All changes are made to the local object until you update Azure in the final step.

## Update existing rules

To modify existing rules in the rule collection:

### Find and modify existing rules

Locate an existing rule by name and modify its properties:

```azurepowershell-interactive
# Find the existing rule
$existingRule = $existingrulecollection.Rules | Where-Object {$_.Name -eq "existing-rule-name"}

# Modify rule properties
if ($existingRule) {
    $existingRule.SourceAddresses = @("10.0.0.0/8", "192.168.0.0/16")
    $existingRule.DestinationPorts = @("80", "443")
    $existingRule.TranslatedAddress = "10.1.1.100"
    $existingRule.TranslatedPort = "8080"
    Write-Host "Rule '$($existingRule.Name)' updated successfully."
} else {
    Write-Warning "Rule 'existing-rule-name' not found."
}
```

### Remove existing rules

To remove a rule from the collection:

```azurepowershell-interactive
# Find and remove the rule
$ruleToRemove = $existingrulecollection.Rules | Where-Object {$_.Name -eq "rule-to-delete"}
if ($ruleToRemove) {
    $existingrulecollection.Rules.Remove($ruleToRemove)
    Write-Host "Rule '$($ruleToRemove.Name)' removed successfully."
} else {
    Write-Warning "Rule 'rule-to-delete' not found."
}
```

### List all rules in collection

To view all current rules in the collection:

```azurepowershell-interactive
# Display all rules
$existingrulecollection.Rules | Select-Object Name, Protocol, SourceAddresses, DestinationAddresses, DestinationPorts, TranslatedAddress, TranslatedPort | Format-Table
```

## Apply changes to Azure

After you make all your changes to the local objects, update the rule collection group in Azure:

```azurepowershell-interactive
try {
    Set-AzFirewallPolicyRuleCollectionGroup -Name "<Rule Collection Group Name>" -FirewallPolicyObject $policy -Priority 200 -RuleCollection $natrulecollectiongroup.Properties.RuleCollection
    Write-Host "Firewall policy updated successfully."
} catch {
    Write-Error "Failed to update firewall policy: $($_.Exception.Message)"
}
```

> [!IMPORTANT]
> This step applies all changes to Azure. Ensure you have tested your configuration thoroughly before running this command in production.

## Verify changes

After you update the policy, verify that your changes were applied correctly:

```azurepowershell-interactive
# Refresh the policy object and verify changes
$updatedPolicy = Get-AzFirewallPolicy -Name "<Policy Name>" -ResourceGroupName "<Resource Group Name>"
$updatedRuleGroup = Get-AzFirewallPolicyRuleCollectionGroup -Name "<Rule Collection Group Name>" -ResourceGroupName "<Resource Group Name>" -AzureFirewallPolicyName "<Firewall Policy Name>"

# Display the updated rules
$updatedRuleCollection = $updatedRuleGroup.Properties.RuleCollection | Where-Object {$_.Name -eq "<rule collection name>"}
$updatedRuleCollection.Rules | Select-Object Name, Protocol, SourceAddresses, DestinationAddresses | Format-Table
```

## Clean up resources

If you created test resources for this tutorial, you can remove them to avoid charges. When you delete the resource group, you also delete the firewall and all related resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name "<Resource Group Name>" -Force
```

> [!CAUTION]
> Only run this command if you want to delete all resources in the resource group. This action cannot be undone.

## Next steps

To learn more about Azure Firewall policies and rule management, see the following articles:

- [Azure Firewall Policy rule sets](policy-rule-sets.md)
- [Azure Firewall features](features.md)
- [Azure Firewall FAQ](firewall-faq.yml)
