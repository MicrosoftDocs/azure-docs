---
title: Upgrade CRS or DRS Ruleset Version
titleSuffix: Azure Web Application Firewall
description: Learn how to upgrade CRS or DRS ruleset version on Application Gateway Web Application Firewall.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: how-to 
ms.date: 08/28/2025
---

# Upgrade CRS or DRS ruleset version

The Azure-managed **Default Rule Set (DRS)** in Azure Application Gateway Web Application Firewall (WAF) protects web applications against common vulnerabilities and exploits, including the OWASP top 10 attack types. The default rule set also incorporates the Microsoft Threat Intelligence Collection rules. We recommend always running the **latest ruleset version**, which includes the most recent security updates, rule enhancements, and fixes.

The Azure-managed Default Rule Set (DRS) is the latest generation of rulesets in Azure WAF, replacing all previous Core Rule Set (CRS) versions. Among DRS releases, always use the highest available version (for example, DRS 2.2 when released) to ensure you have the most up-to-date protections.

This article provides PowerShell examples for upgrading your Azure WAF policy to DRS 2.1. While the examples reference DRS 2.1 specifically, you should always upgrade to the latest available DRS version to ensure maximum protection. 

> [!NOTE]
> PowerShell snippets are examples only. Replace all placeholders with values from your environment.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- An existing Azure WAF policy with a Core Rule Set (CRS) or Default Rule Set (DRS) applied. If you don't have a WAF policy yet, see [Create Web Application Firewall policies for Application Gateway](create-waf-policy-ag.md).

- Latest version of [Azure PowerShell installed locally](/powershell/azure/install-azure-powershell). This article requires the [Az.Network Module](/powershell/module/az.network).

## Key considerations when upgrading

When upgrading your Azure WAF ruleset version, make sure to:

- **Preserve existing customizations**: carry over your rule action overrides, rule status (enabled/disabled) overrides, and exclusions.

- **Validate new rules safely**: ensure newly added rules are initially set to **log mode**, so you can monitor their impact and fine-tune them before enabling blocking.

## Prepare your environment and variables

1.  Set context of your selected subscription, resource group, and Azure WAF policy.

    ```powershell
    Import-Module Az.Network
    Set-AzContext -SubscriptionId "<subscription_id>"
    $resourceGroupName = "<resource_group>"
    $wafPolicyName = "<policy_name>"
    ```
1.	Get the WAF policy object and retrieve its definitions.

    ```powershell
    $wafPolicy = Get-AzApplicationGatewayFirewallPolicy ` 
    -Name $wafPolicyName ` 
    -ResourceGroupName $resourceGroupName 
    $currentExclusions = $wafPolicy.ManagedRules.Exclusions 
    $currentManagedRuleset = $wafPolicy.ManagedRules.ManagedRuleSets 
    | Where-Object { $_.RuleSetType -eq "OWASP" } 
    $currentVersion = $currentManagedRuleset.RuleSetVersion
    ```

## Preserve existing customizations

1.  Don't copy overrides or exclusions that apply to rules removed in **DRS 2.1**.  The following function checks if a rule has been removed:

    ```powershell
    function Test-RuleIsRemovedFromDRS21 { 
        param ( 
            [string]$RuleId, 
            [string]$CurrentRulesetVersion 
        ) 
        $removedRulesByCrsVersion = @{ 
            "3.0" = @( "200004", "913100", "913101", "913102", "913110", "913120", "920130", "920140", "920250", "921100", "800100", "800110", "800111", "800112", "800113" ) 
            "3.1" = @( "200004", "913100", "913101", "913102", "913110", "913120", "920130", "920140", "920250", "800100", "800110", "800111", "800112", "800113", "800114" ) 
            "3.2" = @( "200004", "913100", "913101", "913102", "913110", "913120", "920250", "800100", "800110", "800111", "800112", "800113", "800114" ) 
            } 
        # If the version isn't known, assume rule has not been removed 
        if (-not $removedRulesByCrsVersion.ContainsKey($CurrentRulesetVersion)) { 
            return $false 
            } 
        return $removedRulesByCrsVersion[$CurrentRulesetVersion] -contains $RuleId }
    ```

1.  When creating new override objects, use the **DRS 2.1 group names**. The following function maps legacy CRS group names to DRS 2.1
groups:

    ```powershell
    function Get-DrsRuleGroupName {
        param ( 
            [Parameter(Mandatory = $true)]
            [string]$SourceGroupName )
        $groupMap = @{ 
        "REQUEST-930-APPLICATION-ATTACK-LFI" = "LFI" 
        "REQUEST-931-APPLICATION-ATTACK-RFI" = "RFI" 
        "REQUEST-932-APPLICATION-ATTACK-RCE" = "RCE" 
        "REQUEST-933-APPLICATION-ATTACK-PHP" = "PHP" 
        "REQUEST-941-APPLICATION-ATTACK-XSS" = "XSS" 
        "REQUEST-942-APPLICATION-ATTACK-SQLI" = "SQLI" 
        "REQUEST-943-APPLICATION-ATTACK-SESSION-FIXATION" = "FIX" 
        "REQUEST-944-APPLICATION-ATTACK-JAVA" = "JAVA" 
        "REQUEST-921-PROTOCOL-ATTACK" = "PROTOCOL-ATTACK" 
        "REQUEST-911-METHOD-ENFORCEMENT" = "METHOD-ENFORCEMENT" 
        "REQUEST-920-PROTOCOL-ENFORCEMENT" = "PROTOCOL-ENFORCEMENT" 
        "REQUEST-913-SCANNER-DETECTION" = $null # No direct mapping 
        "Known-CVEs" = "MS-ThreatIntel-CVEs" 
        "General" = "General" 
        } 
        if ($groupMap.ContainsKey($SourceGroupName)) { 
            return $groupMap[$SourceGroupName] 
        } else { 
            return $SourceGroupName # No known mapping 
            } 
        }
    ```

1.  Use the following PowerShell code to define the rules’ overrides, duplicating overrides from existing ruleset version:

    ```powershell
    $groupOverrides = @() 
    foreach ($group in $currentManagedRuleset.RuleGroupOverrides) {
      $mappedGroupName = Get-DrsRuleGroupName $group.RuleGroupName 
        foreach ($existingRule in $group.Rules) { 
    if (-not (Test-RuleIsRemovedFromDRS21 $existingRule.RuleId $currentVersion)) 
      { 
       `$existingGroup = $groupOverrides | 
    Where-Object { $_.RuleGroupName -eq $mappedGroupName } 
    if ($existingGroup) { 
    if (-not ($existingGroup.Rules | 
    Where-Object { $_.RuleId -eq $existingRule.RuleId })) { 
    $existingGroup.Rules.Add($existingRule) } } 
    else { 
      $newGroup = New-AzApplicationGatewayFirewallPolicyManagedRuleGroupOverride ` -RuleGroupName $mappedGroupName ` -Rule @($existingRule) $groupOverrides += $newGroup } } } }

    ```

1. Use the following PowerShell code to duplicate your existing exclusions and apply them on DRS 2.1:

    ```powershell
    # Create new exclusion objects
    $newRuleSetExclusions = @()
    
    if ($currentExclusions -ne $null -and $currentExclusions.Count -gt 0)
    {
    	foreach ($exclusion in $currentExclusions) {
    		$newExclusion = New-AzApplicationGatewayFirewallPolicyExclusion `
    			-MatchVariable $exclusion.MatchVariable `
    			-SelectorMatchOperator $exclusion.SelectorMatchOperator `
    			-Selector $exclusion.Selector
    
    		# Migrate scopes: RuleSet, RuleGroup, or individual Rules
    		if ($exclusion.ExclusionManagedRuleSets) {
    			foreach ($scope in $exclusion.ExclusionManagedRuleSets) {
    				# Create RuleGroup objects from existing RuleGroups
    				$ruleGroups = @()
    				foreach ($group in $scope.RuleGroups) {
    					$drsGroupName = Get-DrsRuleGroupName $group.RuleGroupName
    					if ($drsGroupName)
    					{
    							$exclusionRules = @()
    							foreach ($rule in $group.Rules) 
    							{
    								if (-not (Test-RuleIsRemovedFromDRS21 $rule.RuleId "3.2"))
    								{
    								$exclusionRules += New-AzApplicationGatewayFirewallPolicyExclusionManagedRule `
    									-RuleId $rule.RuleId
    								}
    							}
    						if ($exclusionRules -ne $null -and $exclusionRules.Count -gt 0)
    						{
    							$ruleGroups += New-AzApplicationGatewayFirewallPolicyExclusionManagedRuleGroup `
    							-Name $drsGroupName `
    							-Rule $exclusionRules
    						} else {
    							$ruleGroups += New-AzApplicationGatewayFirewallPolicyExclusionManagedRuleGroup `
    							-Name $drsGroupName
    						}
    					}
    				}
    
    				# Create the ManagedRuleSet scope object with the updated RuleGroups
    				if ($ruleGroups.Count -gt 0) {
    					$newRuleSetScope = New-AzApplicationGatewayFirewallPolicyExclusionManagedRuleSet `
    						-Type "Microsoft_DefaultRuleSet" `
    						-Version "2.1" `
    						-RuleGroup $ruleGroups
    				}
    
    				# Add to the new exclusion object
    				$newExclusion.ExclusionManagedRuleSets += $newRuleSetScope
    			}
    		}
    		
    		if (-not $newExclusion.ExclusionManagedRuleSets)
    		{
    			$newExclusion.ExclusionManagedRuleSets = @()
    		}
    		
    		$newRuleSetExclusions += $newExclusion
    	}
    }
    ```

## Validate new rules safely

When you upgrade, new DRS 2.1 rules are active by default. If your WAF is in ***Prevention*** mode, set new rules to ***log*** mode first. The *log* mode allows you to review logs before enabling blocking.

1. The following PowerShell definitions are for rules introduced in DRS 2.1 compared to each CRS version:

    ```powershell
    # Added in DRS 2.1 compared to CRS 3.0 
    $rulesAddedInThisVersionByGroup = @{ 
        "General" = @("200002", "200003") 
        "PROTOCOL-ENFORCEMENT" = @("920121", "920171", "920181", "920341", "920470", "920480", "920500") 
        "PROTOCOL-ATTACK" = @("921190", "921200") 
        "RCE" = @("932180") 
        "PHP" = @("933200", "933210") 
        "NODEJS" = @("934100") 
        "XSS" = @("941101", "941360", "941370", "941380") 
        "SQLI" = @("942361", "942470", "942480", "942500", "942510") 
        "JAVA" = @("944100", "944110", "944120", "944130", "944200", "944210", "944240", "944250") 
        "MS-ThreatIntel-WebShells" = @("99005002", "99005003", "99005004", "99005005", "99005006") 
        "MS-ThreatIntel-AppSec" = @("99030001", "99030002") 
        "MS-ThreatIntel-SQLI" = @("99031001", "99031002", "99031003", "99031004") 
        "MS-ThreatIntel-CVEs" = @( "99001001","99001002","99001003","99001004","99001005","99001006", "99001007","99001008","99001009","99001010","99001011","99001012", "99001013","99001014","99001015","99001016","99001017" ) 
    }
    ```

    ```powershell
    # Added in DRS 2.1 compared to CRS 3.1 
        $rulesAddedInThisVersionByGroup = @{ 
        "General" = @("200002", "200003") 
        "PROTOCOL-ENFORCEMENT" = @("920181", "920500") 
        "PROTOCOL-ATTACK" = @("921190", "921200") 
        "PHP" = @("933200", "933210") 
        "NODEJS" = @("934100") 
        "XSS" = @("941360", "941370", "941380") 
        "SQLI" = @("942500", "942510") 
        "MS-ThreatIntel-WebShells" = @("99005002", "99005003", "99005004", "99005005", "99005006") 
        "MS-ThreatIntel-AppSec" = @("99030001", "99030002") 
        "MS-ThreatIntel-SQLI" = @("99031001", "99031002", "99031003", "99031004") "MS-ThreatIntel-CVEs" = @( "99001001","99001002","99001003","99001004","99001005","99001006", "99001007","99001008","99001009","99001010","99001011","99001012", "99001013","99001014","99001015","99001016","99001017" ) 
    }
    ```

    ```powershell
    # Added in DRS 2.1 compared to CRS 3.2 
    $rulesAddedInThisVersionByGroup = @{ 
        "General" = @("200002", "200003") 
        "PROTOCOL-ENFORCEMENT" = @("920181", "920500") 
        "PROTOCOL-ATTACK" = @("921190", "921200") 
        "PHP" = @("933200", "933210") 
        "NODEJS" = @("934100") 
        "XSS" = @("941360", "941370", "941380") 
        "SQLI" = @("942100", "942500", "942510") 
        "MS-ThreatIntel-WebShells" = @("99005002", "99005003", "99005004", "99005005", "99005006") 
        "MS-ThreatIntel-AppSec" = @("99030001", "99030002") 
        "MS-ThreatIntel-SQLI" = @("99031001", "99031002", "99031003", "99031004") 
        "MS-ThreatIntel-CVEs" = @( "99001001","99001002","99001003","99001004","99001005","99001006", "99001007","99001008","99001009","99001010","99001011","99001012", "99001013","99001014","99001015","99001016","99001017" ) 
    }
    
    ```

1. Use the following PowerShell code to add new rule overrides to the existing `$groupOverrides` object defined previously:

    ```powershell
    foreach ($groupName in $rulesAddedInDRS21.Keys) { 
        $ruleOverrides = @() 
        foreach ($ruleId in $rulesAddedInDRS21[$groupName]) { 
            $alreadyExists = $existingOverrides | 
                Where-Object { $_.RuleId -eq $ruleId } 
            if (-not $alreadyExists) { 
                $ruleOverrides += New-AzApplicationGatewayFirewallPolicyManagedRuleOverride ` 
                -RuleId $ruleId ` 
                -Action "Log" ` 
                -State "Enabled" 
                } 
            } # Only create group override if we added rules to it 
        if ($ruleOverrides.Count -gt 0) { 
            $groupOverrides += New-AzApplicationGatewayFirewallPolicyManagedRuleGroupOverride ` 
                -RuleGroupName $groupName ` 
                -Rule $ruleOverrides } 
                }
    ```

## Apply customizations and upgrade

Define your updated Azure WAF policy object, incorporating the duplicated and updated rule overrides and exclusions:

```powershell
$managedRuleSet = New-AzApplicationGatewayFirewallPolicyManagedRuleSet ` 
    -RuleSetType "Microsoft_DefaultRuleSet" ` 
    -RuleSetVersion "2.1" ` 
    -RuleGroupOverride $groupOverrides 
for ($i = 0; $i -lt $wafPolicy.ManagedRules.ManagedRuleSets.Count; $i++) { 
    if ($wafPolicy.ManagedRules.ManagedRuleSets[$i].RuleSetType -eq "OWASP") { 
    $wafPolicy.ManagedRules.ManagedRuleSets[$i] = $managedRuleSet 
    break 
    } 
} 
# Assign to policy
if ($newRuleSetExclusions) {
    $wafPolicy.ManagedRules.Exclusions = $currentExclusions + $newRuleSetExclusions 
}
# Apply the updated WAF policy 
Set-AzApplicationGatewayFirewallPolicy -InputObject $wafPolicy
```

## Related content

- [Web Application Firewall DRS and CRS rule groups and rules](/azure/web-application-firewall/ag/application-gateway-crs-rulegroups-rules)
- [Customize Web Application Firewall rules using the Azure portal](/azure/web-application-firewall/ag/application-gateway-customize-waf-rules-portal)
