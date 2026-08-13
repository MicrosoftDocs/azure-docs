---
title: Upgrade CRS or DRS Ruleset Version
titleSuffix: Azure Web Application Firewall
description: Learn how to upgrade CRS or DRS ruleset version on Application Gateway Web Application Firewall.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: how-to 
ms.date: 06/27/2026
---

# Upgrade CRS or DRS ruleset version

**Applies to:** :heavy_check_mark: Application Gateway V2

The Azure-managed **Default Rule Set (DRS)** in Azure Application Gateway Web Application Firewall (WAF) protects web applications against common vulnerabilities and exploits, including the OWASP top 10 attack types. The default rule set also incorporates the Microsoft Threat Intelligence Collection rules. Always run the **latest ruleset version**, which includes the most recent security updates, rule enhancements, and fixes.

The Azure-managed Default Rule Set (DRS) is the latest generation of rulesets in Azure WAF, replacing all previous Core Rule Set (CRS) versions. Among DRS releases, always use the highest available version (**DRS 2.2**) to ensure you have the most up-to-date protections.

This article provides PowerShell examples for upgrading your Azure WAF policy to **DRS 2.2** from CRS 3.0, CRS 3.1, CRS 3.2, or DRS 2.1.

> [!NOTE]
> PowerShell snippets are examples only. Replace all placeholders with values from your environment.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- An existing Azure WAF policy with a Core Rule Set (CRS) or Default Rule Set (DRS) applied. If you don't have a WAF policy yet, see [Create Web Application Firewall policies for Application Gateway](create-waf-policy-ag.md).

- Latest version of [Azure PowerShell installed locally](/powershell/azure/install-azure-powershell). This article requires the [Az.Network Module](/powershell/module/az.network).

## Key considerations when upgrading

When upgrading your Azure WAF ruleset version, make sure to:

- **Preserve existing customizations**: carry over your rule action overrides, rule status (enabled or disabled) overrides, and exclusions.

- **Drop customizations for removed rules**: don't carry over overrides or exclusions for rules that no longer exist in DRS 2.2. Carrying over an override for a rule that DRS 2.2 doesn't contain causes the policy update to fail with an error such as `The override Rule '<id>' is unknown for RuleGroup '<group>'`.

- **Account for the Paranoia Level baseline**: DRS 2.2 operates at Paranoia Level 1 (PL1) by default, and all PL2 rules are disabled by default. In CRS 3.2 and DRS 2.1, PL2 rules were active. Any PL2 rules you previously customized are disabled by default in DRS 2.2 until you explicitly re-enable them.

- **Validate new rules safely**: newly added rules that are enabled by default (PL1) are initially set to **log mode**, so you can monitor their impact and fine-tune them before enabling blocking.

## Prepare your environment and variables

1. Set the context for your selected subscription, resource group, and Azure WAF policy.

   ```powershell
   Import-Module Az.Network
   Set-AzContext -SubscriptionId "<subscription_id>"
   $resourceGroupName = "<resource_group>"
   $wafPolicyName = "<policy_name>"
   ```

1. Get the WAF policy object and retrieve its definitions. The current managed ruleset can be a CRS (`OWASP`) or a DRS (`Microsoft_DefaultRuleSet`) type.

   ```powershell
   $wafPolicy = Get-AzApplicationGatewayFirewallPolicy `
       -Name $wafPolicyName `
       -ResourceGroupName $resourceGroupName

   $currentExclusions = $wafPolicy.ManagedRules.Exclusions
   $currentManagedRuleset = $wafPolicy.ManagedRules.ManagedRuleSets |
       Where-Object { $_.RuleSetType -eq "OWASP" -or $_.RuleSetType -eq "Microsoft_DefaultRuleSet" }
   $currentVersion = $currentManagedRuleset.RuleSetVersion
   ```

## Preserve existing customizations

1. Carry over an override or exclusion only if the rule still exists in **DRS 2.2**. The following function validates a rule ID against the complete set of DRS 2.2 rules and returns `$true` for any rule that was removed (including legacy and inactive rules such as `920460`, `942130`, and `920250`). Using an allowlist of valid rule IDs avoids per-rule maintenance and prevents the policy update from failing on an unknown rule.

   ```powershell
   function Test-RuleIsRemovedFromDRS22 {
       param (
           [string]$RuleId,
           [string]$CurrentRulesetVersion  # Retained for compatibility; not used
       )

       # Complete set of rule IDs that exist in DRS 2.2.
       # Any override or exclusion for a rule NOT in this set is dropped during migration.
       $drs22RuleIds = @(
           "200002","200003",
           "911100",
           "920100","920120","920121","920160","920170","920171","920180","920181","920190","920200","920201","920210","920220","920230","920240","920260","920270","920271","920280","920290","920300","920310","920311","920320","920330","920340","920341","920350","920420","920430","920440","920450","920470","920480","920500","920530","920620",
           "921110","921120","921130","921140","921150","921151","921160","921190","921200","921422",
           "930100","930110","930120","930130",
           "931100","931110","931120","931130",
           "932100","932105","932110","932115","932120","932130","932140","932150","932160","932170","932171","932180",
           "933100","933110","933120","933130","933140","933150","933151","933160","933170","933180","933200","933210",
           "934100",
           "941100","941101","941110","941120","941130","941140","941150","941160","941170","941180","941190","941200","941210","941220","941230","941240","941250","941260","941270","941280","941290","941300","941310","941320","941330","941340","941350","941360","941370","941380",
           "942100","942110","942120","942140","942150","942160","942170","942180","942190","942200","942210","942220","942230","942240","942250","942260","942270","942280","942290","942300","942310","942320","942330","942340","942350","942360","942361","942370","942380","942390","942400","942410","942430","942440","942450","942470","942480","942500","942510",
           "943100","943110","943120",
           "944100","944110","944120","944130","944200","944210","944240","944250",
           "99005002","99005003","99005004","99005005","99005006",
           "99030001","99030002","99030003","99030004","99030005","99030006",
           "99031001","99031002","99031003","99031004","99031005","99031006",
           "99001001","99001002","99001003","99001004","99001005","99001006","99001007","99001008","99001009","99001010","99001011","99001012","99001013","99001014","99001015","99001016","99001017","99001018",
           "99032001","99032002"
       )

       return -not ($drs22RuleIds -contains $RuleId)
   }
   ```

1. When creating new override objects, use the **DRS 2.2 group names**. The following function maps legacy CRS group names to DRS groups. DRS source group names that aren't in the map (for example, when upgrading from DRS 2.1) are returned unchanged:

   ```powershell
   function Get-DrsRuleGroupName {
       param (
           [Parameter(Mandatory = $true)]
           [string]$SourceGroupName
       )
       $groupMap = @{
           "REQUEST-930-APPLICATION-ATTACK-LFI"             = "LFI"
           "REQUEST-931-APPLICATION-ATTACK-RFI"             = "RFI"
           "REQUEST-932-APPLICATION-ATTACK-RCE"             = "RCE"
           "REQUEST-933-APPLICATION-ATTACK-PHP"             = "PHP"
           "REQUEST-941-APPLICATION-ATTACK-XSS"             = "XSS"
           "REQUEST-942-APPLICATION-ATTACK-SQLI"            = "SQLI"
           "REQUEST-943-APPLICATION-ATTACK-SESSION-FIXATION" = "FIX"
           "REQUEST-944-APPLICATION-ATTACK-JAVA"            = "JAVA"
           "REQUEST-921-PROTOCOL-ATTACK"                    = "PROTOCOL-ATTACK"
           "REQUEST-911-METHOD-ENFORCEMENT"                 = "METHOD-ENFORCEMENT"
           "REQUEST-920-PROTOCOL-ENFORCEMENT"               = "PROTOCOL-ENFORCEMENT"
           "REQUEST-913-SCANNER-DETECTION"                  = $null  # No direct mapping
           "Known-CVEs"                                     = "MS-ThreatIntel-CVEs"
           "General"                                        = "General"
       }
       if ($groupMap.ContainsKey($SourceGroupName)) {
           return $groupMap[$SourceGroupName]
       } else {
           return $SourceGroupName  # No known mapping; pass through (DRS source group names)
       }
   }
   ```

1. Use the following PowerShell code to define the rules' overrides, duplicating overrides from the existing ruleset version:

   ```powershell
   $groupOverrides = @()
   foreach ($group in $currentManagedRuleset.RuleGroupOverrides) {
       $mappedGroupName = Get-DrsRuleGroupName $group.RuleGroupName
       if (-not $mappedGroupName) { continue }  # Skip groups with no DRS equivalent
       foreach ($existingRule in $group.Rules) {
           if (-not (Test-RuleIsRemovedFromDRS22 $existingRule.RuleId $currentVersion)) {
               $existingGroup = $groupOverrides | Where-Object { $_.RuleGroupName -eq $mappedGroupName }
               if ($existingGroup) {
                   if (-not ($existingGroup.Rules | Where-Object { $_.RuleId -eq $existingRule.RuleId })) {
                       $existingGroup.Rules.Add($existingRule)
                   }
               } else {
                   $newGroup = New-AzApplicationGatewayFirewallPolicyManagedRuleGroupOverride `
                       -RuleGroupName $mappedGroupName `
                       -Rule @($existingRule)
                   $groupOverrides += $newGroup
               }
           }
       }
   }
   ```

1. Use the following PowerShell code to duplicate your existing exclusions and apply them on DRS 2.2:

   ```powershell
   # Create new exclusion objects
   $newRuleSetExclusions = @()

   if ($currentExclusions -ne $null -and $currentExclusions.Count -gt 0) {
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
                       if ($drsGroupName) {
                           $exclusionRules = @()
                           foreach ($rule in $group.Rules) {
                               if (-not (Test-RuleIsRemovedFromDRS22 $rule.RuleId $currentVersion)) {
                                   $exclusionRules += New-AzApplicationGatewayFirewallPolicyExclusionManagedRule `
                                       -RuleId $rule.RuleId
                               }
                           }
                           if ($exclusionRules -ne $null -and $exclusionRules.Count -gt 0) {
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
                           -Version "2.2" `
                           -RuleGroup $ruleGroups

                       # Add to the new exclusion object
                       $newExclusion.ExclusionManagedRuleSets += $newRuleSetScope
                   }
               }
           }

           if (-not $newExclusion.ExclusionManagedRuleSets) {
               $newExclusion.ExclusionManagedRuleSets = @()
           }

           $newRuleSetExclusions += $newExclusion
       }
   }
   ```

## Validate new rules safely

When you upgrade, new DRS 2.2 rules that belong to Paranoia Level 1 are enabled by default. If your WAF is in *Prevention* mode, set these new rules to *log* mode first so you can review logs before enabling blocking.

Rules that belong to Paranoia Level 2 are disabled by default in DRS 2.2 and don't block traffic, so they don't require this step. If you want to operate at Paranoia Level 2, enable the relevant PL2 rules explicitly and follow the same validate-in-log approach.

1. Use the definition that matches the version you're upgrading **from**. Each definition lists the rules that are introduced and enabled by default in DRS 2.2 compared to that version.

   ```powershell
   # Added and enabled by default in DRS 2.2 compared to CRS 3.0
   $rulesAddedInThisVersionByGroup = @{
       "General"              = @("200002", "200003")
       "PROTOCOL-ENFORCEMENT" = @("920171", "920181", "920470", "920480", "920500", "920530", "920620")
       "PROTOCOL-ATTACK"      = @("921190", "921200")
       "RCE"                  = @("932180")
       "PHP"                  = @("933200", "933210")
       "NODEJS"               = @("934100")
       "XSS"                  = @("941360", "941370")
       "SQLI"                 = @("942500")
       "JAVA"                 = @("944100", "944110", "944120", "944130")
       "MS-ThreatIntel-CVEs"  = @("99001018")
       "MS-ThreatIntel-XSS"   = @("99032001")
   }
   ```

   ```powershell
   # Added and enabled by default in DRS 2.2 compared to CRS 3.1
   $rulesAddedInThisVersionByGroup = @{
       "General"              = @("200002", "200003")
       "PROTOCOL-ENFORCEMENT" = @("920181", "920500", "920530", "920620")
       "PROTOCOL-ATTACK"      = @("921190", "921200")
       "PHP"                  = @("933200", "933210")
       "NODEJS"               = @("934100")
       "XSS"                  = @("941360", "941370")
       "SQLI"                 = @("942500")
       "MS-ThreatIntel-CVEs"  = @("99001018")
       "MS-ThreatIntel-XSS"   = @("99032001")
   }
   ```

   ```powershell
   # Added and enabled by default in DRS 2.2 compared to CRS 3.2
   $rulesAddedInThisVersionByGroup = @{
       "PROTOCOL-ENFORCEMENT" = @("920181", "920500", "920530", "920620")
       "PROTOCOL-ATTACK"      = @("921190", "921200")
       "NODEJS"               = @("934100")
       "XSS"                  = @("941370")
       "MS-ThreatIntel-CVEs"  = @("99001018")
       "MS-ThreatIntel-XSS"   = @("99032001")
   }
   ```

   ```powershell
   # Added and enabled by default in DRS 2.2 compared to DRS 2.1
   $rulesAddedInThisVersionByGroup = @{
       "PROTOCOL-ENFORCEMENT" = @("920530", "920620")
       "MS-ThreatIntel-XSS"   = @("99032001")
   }
   ```

1. Use the following PowerShell code to add the new rule overrides to the existing `$groupOverrides` object defined previously:

   ```powershell
   foreach ($groupName in $rulesAddedInThisVersionByGroup.Keys) {
       $ruleOverrides = @()
       foreach ($ruleId in $rulesAddedInThisVersionByGroup[$groupName]) {
           $existingGroup = $groupOverrides | Where-Object { $_.RuleGroupName -eq $groupName }
           $alreadyExists = $false
           if ($existingGroup) {
               $alreadyExists = $existingGroup.Rules | Where-Object { $_.RuleId -eq $ruleId }
           }
           if (-not $alreadyExists) {
               $ruleOverrides += New-AzApplicationGatewayFirewallPolicyManagedRuleOverride `
                   -RuleId $ruleId `
                   -Action "Log" `
                   -State "Enabled"
           }
       }
       # Only create or update the group override if we added rules to it
       if ($ruleOverrides.Count -gt 0) {
           $existingGroup = $groupOverrides | Where-Object { $_.RuleGroupName -eq $groupName }
           if ($existingGroup) {
               foreach ($ruleOverride in $ruleOverrides) {
                   $existingGroup.Rules.Add($ruleOverride)
               }
           } else {
               $groupOverrides += New-AzApplicationGatewayFirewallPolicyManagedRuleGroupOverride `
                   -RuleGroupName $groupName `
                   -Rule $ruleOverrides
           }
       }
   }
   ```

## Apply customizations and upgrade

Define your updated Azure WAF policy object, incorporating the duplicated and updated rule overrides and exclusions:

```powershell
$managedRuleSet = New-AzApplicationGatewayFirewallPolicyManagedRuleSet `
    -RuleSetType "Microsoft_DefaultRuleSet" `
    -RuleSetVersion "2.2" `
    -RuleGroupOverride $groupOverrides

# Replace the existing CRS (OWASP) or DRS (Microsoft_DefaultRuleSet) managed rule set
for ($i = 0; $i -lt $wafPolicy.ManagedRules.ManagedRuleSets.Count; $i++) {
    if ($wafPolicy.ManagedRules.ManagedRuleSets[$i].RuleSetType -eq "OWASP" -or
        $wafPolicy.ManagedRules.ManagedRuleSets[$i].RuleSetType -eq "Microsoft_DefaultRuleSet") {
        $wafPolicy.ManagedRules.ManagedRuleSets[$i] = $managedRuleSet
        break
    }
}

# Assign the migrated exclusions to the policy
$wafPolicy.ManagedRules.Exclusions = $newRuleSetExclusions

# Apply the updated WAF policy
Set-AzApplicationGatewayFirewallPolicy -InputObject $wafPolicy
```

## Related content

- [Web Application Firewall DRS and CRS rule groups and rules](application-gateway-crs-rulegroups-rules.md)
- [Customize Web Application Firewall rules using the Azure portal](application-gateway-customize-waf-rules-portal.md)
