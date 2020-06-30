---
title: Migrate Azure Firewall configurations to Azure Firewall policy using PowerShell
description: Learn How to migrate Azure Firewall configurations to Azure Firewall policy
author: vhorne
ms.service: firewall-manager
services: firewall-manager
ms.topic: conceptual
ms.date: 06/30/2020
ms.author: victorh
---

# Migrate Azure Firewall configurations to Azure Firewall policy using Powershell

You can use an Azure PowerShell script to migrate existing Azure Firewall configurations to an Azure Firewall policy resource. You can then use Azure Firewall Manager to deploy the policy.

The `AZFWMigrationScript.ps1` script  creates a FirewallPolicy with three RuleCollectionGroup objects for ApplicationRuleCollections, NetworkRuleCollections, and NatRuleCollections respectively. 

A RuleCollectionGroup is a new top-level grouping for rule collections for future extensibility. Using the above defaults is recommended and is done automatically from the Portal.

The beginning of the script defines the source firewall name and resource group and the target policy name and location. Change these values as appropriate for your organization.

## Migration script

Modify the following script to migrate your firewall configuration.

```azurepowershell
#Input params to be modified as needed
$FirewallName = "AZFW"
$ResourceGroupName = "AzFWMigrateRG"
$PolicyName = "fwp9"
$Location = "WestUS"


$DefaultAppRuleCollectionGroupName = "ApplicationRuleCollectionGroup"
$DefaultNetRuleCollectionGroupName = "NetworkRuleCollectionGroup"
$DefaultNatRuleCollectionGroupName = "NatRuleCollectionGroup"
$ApplicationRuleGroupPriority = 300
$NetworkRuleGroupPriority = 200
$NatRuleGroupPriority = 100

#Helper functions for tanslatating ApplicationProtocol and ApplicationRule
Function GetApplicationProtocolsString
{
	Param([Object[]] $Protocols)
	$output = ""
	ForEach ($protocol in $Protocols) {
		$output += $protocol.ProtocolType + ":" + $protocol.Port + ","
	}
	return $output.Substring(0, $output.Length - 1)
}

Function GetApplicationRuleCmd
{
	Param([Object] $ApplicationRule)
	
	$cmd = "New-AzFirewallPolicyApplicationRule"
	$cmd = $cmd + " -Name " + $ApplicationRule.Name
	$cmd = $cmd + " -SourceAddress " + $ApplicationRule.SourceAddresses
	
	if ($ApplicationRule.Description) {
		$cmd = $cmd + " -Description " + $ApplicationRule.Description
	}
	if ($ApplicationRule.TargetFqdns) {
		$protocols = GetApplicationProtocolsString($ApplicationRule.Protocols)
		$cmd = $cmd + " -Protocol " + $protocols
		$cmd = $cmd + " -TargetFqdn  " + $ApplicationRule.TargetFqdns
	}
	if ($ApplicationRule.FqdnTags) {
		$cmd = $cmd + " -FqdnTag  " + $ApplicationRule.FqdnTags
	}
	
	return $cmd
}


$azfw = Get-AzFirewall -Name $FirewallName -ResourceGroupName $ResourceGroupName
Write-Host "creating empty firewall policy"
$fwp = New-AzFirewallPolicy -Name $PolicyName -ResourceGroupName $ResourceGroupName -Location $Location -ThreatIntelMode $azfw.ThreatIntelMode
Write-Host $fwp.Name "created"
Write-Host "creating " $azfw.ApplicationRuleCollections.Count " application rule collections"

#Translate ApplicationRuleCollection
If ($azfw.ApplicationRuleCollections.Count -gt 0) {
	$firewallPolicyAppRuleCollections = @()
	ForEach ($appRc in $azfw.ApplicationRuleCollections) {
		If ($appRc.Rules.Count -gt 0) {
			Write-Host "creating " $appRc.Rules.Count " application rules for collection " $appRc.Name
			$firewallPolicyAppRules = @()
			ForEach ($appRule in $appRc.Rules) {
				$cmd = GetApplicationRuleCmd($appRule)
				$firewallPolicyAppRule = Invoke-Expression $cmd
				Write-Host "Created appRule " $firewallPolicyAppRule.Name
				$firewallPolicyAppRules += $firewallPolicyAppRule
			}
			$fwpAppRuleCollection = New-AzFirewallPolicyFilterRuleCollection -Name $appRC.Name -Priority $appRC.Priority -ActionType $appRC.Action.Type -Rule $firewallPolicyAppRules
			Write-Host "Created appRuleCollection "  $fwpAppRuleCollection.Name
		}
		$firewallPolicyAppRuleCollections += $fwpAppRuleCollection
	}
	$appRuleGroup = New-AzFirewallPolicyRuleCollectionGroup -Name $DefaultAppRuleCollectionGroupName -Priority $ApplicationRuleGroupPriority -RuleCollection $firewallPolicyAppRuleCollections -FirewallPolicyObject $fwp 
	Write-Host "Created ApplicationRuleCollectionGroup "  $appRuleGroup.Name
}

#Translate NetworkRuleCollection
Write-Host "creating " $azfw.NetworkRuleCollections.Count " network rule collections"
If ($azfw.NetworkRuleCollections.Count -gt 0) {
	$firewallPolicyNetRuleCollections = @()
	ForEach ($rc in $azfw.NetworkRuleCollections) {
		If ($rc.Rules.Count -gt 0) {
			Write-Host "creating " $rc.Rules.Count " network rules for collection "  $rc.Name
			$firewallPolicyNetRules = @()
			ForEach ($rule in $rc.Rules) {
				$firewallPolicyNetRule = New-AzFirewallPolicyNetworkRule -Name $rule.Name -SourceAddress $rule.SourceAddresses -DestinationAddress $rule.DestinationAddresses -DestinationPort $rule.DestinationPorts -Protocol $rule.Protocols
				Write-Host "Created network rule " $firewallPolicyNetRule.Name
				$firewallPolicyNetRules += $firewallPolicyNetRule
			}
			$fwpNetRuleCollection = New-AzFirewallPolicyFilterRuleCollection -Name $rc.Name -Priority $rc.Priority -ActionType $rc.Action.Type -Rule $firewallPolicyNetRules
			Write-Host "Created NetworkRuleCollection "  $fwpNetRuleCollection.Name
		}
		$firewallPolicyNetRuleCollections += $fwpNetRuleCollection
	}
	$netRuleGroup = New-AzFirewallPolicyRuleCollectionGroup -Name $DefaultNetRuleCollectionGroupName -Priority $NetworkRuleGroupPriority -RuleCollection $firewallPolicyNetRuleCollections -FirewallPolicyObject $fwp 
	Write-Host "Created NetworkRuleCollectionGroup "  $netRuleGroup.Name
}

#Translate NatRuleCollection
# Hierarchy for NAT rule collection is different for AZFW and FirewallPOlicy. In AZFW you can have a NatRuleCollection with multiple NatRules
# where each NatRule will have its own set of source , dest, tranlated IPs and ports. 
# In FirewallPolicy a NatRuleCollection has a a set of rules which has one condition (source and dest IPs and Ports) and the translated IP and ports 
# as part of NatRuleCollection.
# So when translating NAT rules we will have to create separate ruleCollection for each rule in AZFW and every ruleCollection will have only 1 rule.

Write-Host "creating " $azfw.NatRuleCollections.Count " network rule collections"
If ($azfw.NatRuleCollections.Count -gt 0) {
	$firewallPolicyNatRuleCollections = @()
	$priority = 100
	ForEach ($rc in $azfw.NatRuleCollections) {
		If ($rc.Rules.Count -gt 0) {
			Write-Host "creating " $rc.Rules.Count " nat rules for collection "  $rc.Name
			ForEach ($rule in $rc.Rules) {
				$firewallPolicyNatRule = New-AzFirewallPolicyNetworkRule -Name $rule.Name -SourceAddress $rule.SourceAddresses -DestinationAddress $rule.DestinationAddresses -DestinationPort $rule.DestinationPorts -Protocol $rule.Protocols
				Write-Host "Created nat rule " $firewallPolicyNatRule.Name
				$natRuleCollectionName = $rc.Name+$rule.Name
				$fwpNatRuleCollection = New-AzFirewallPolicyNatRuleCollection -Name $natRuleCollectionName -Priority $priority -ActionType $rc.Action.Type -Rule $firewallPolicyNatRule -TranslatedAddress $rule.TranslatedAddress -TranslatedPort $rule.TranslatedPort
				$priority += 1
				Write-Host "Created NatRuleCollection "  $fwpNatRuleCollection.Name
				$firewallPolicyNatRuleCollections += $fwpNatRuleCollection
			}
		}	
	}
	$natRuleGroup = New-AzFirewallPolicyRuleCollectionGroup -Name $DefaultNatRuleCollectionGroupName -Priority $NatRuleGroupPriority -RuleCollection $firewallPolicyNatRuleCollections -FirewallPolicyObject $fwp 
	Write-Host "Created NatRuleCollectionGroup "  $natRuleGroup.Name
}
```
## Next steps

Learn more about Azure Firewall Manager deployment: [Azure Firewall Manager deployment overview](deployment-overview.md).