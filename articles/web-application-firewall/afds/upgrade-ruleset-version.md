---
title: Upgrade DRS Ruleset Version on Azure Front Door
titleSuffix: Azure Web Application Firewall
description: Learn how to upgrade the Default Rule Set (DRS) version of an Azure Front Door Web Application Firewall policy to DRS 2.2 while keeping your rule overrides, exclusions, and exceptions.
author: gunjanj
ms.author: gunjanj
ms.service: azure-web-application-firewall
ms.topic: how-to
ms.date: 11/19/2026
---

# Upgrade the Default Rule Set version for Azure WAF on Azure Front Door

**Applies to:** :heavy_check_mark: Front Door Premium

The Azure-managed **Default Rule Set (DRS)** in Azure Web Application Firewall (WAF) on Azure Front Door protects web applications against common vulnerabilities and exploits, including the OWASP top 10 attack types. The DRS also includes the Microsoft Threat Intelligence Collection rules. Always run the **latest ruleset version**, which includes the most recent security updates, rule enhancements, and fixes.

The latest DRS version available on Front Door is **DRS 2.2**, which is baselined on OWASP Core Rule Set (CRS) 3.3.4. This article explains what changes for your policy in DRS 2.2, and provides Azure PowerShell examples for upgrading a Front Door WAF policy to **DRS 2.2** from DRS 1.0, DRS 1.1, DRS 2.0, or DRS 2.1 while keeping your rule overrides, exclusions, and exceptions.

> [!NOTE]
> PowerShell snippets are examples only. Replace all placeholders with values from your environment.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- An existing Front Door WAF policy on the Premium SKU (`Premium_AzureFrontDoor`) with a Default Rule Set assigned. DRS 2.0 and later are available only on Front Door Premium, and Front Door Standard supports custom rules only. If you don't have a policy yet, see [Create a WAF policy for Azure Front Door](waf-front-door-create-portal.md).

- If your policy is a Front Door (classic) policy (`Classic_AzureFrontDoor`), it can't use DRS 2.x. [Migrate the profile to Front Door Premium](/azure/frontdoor/tier-migration) first. Front Door (classic) retires on March 31, 2027.

- The latest version of [Azure PowerShell installed locally](/powershell/azure/install-azure-powershell), including the [Az.FrontDoor module](/powershell/module/az.frontdoor) version 2.0.0 or later. The scripts use the object model introduced in Az.FrontDoor 2.0.0 (`ManagedRuleSet`, `RuleGroupOverride`, `ManagedRuleOverride`). Migrating exceptions requires version 2.3.0 or later.

## Key considerations when upgrading

When you upgrade the DRS version of a Front Door WAF policy, make sure to:

- **Preserve existing customizations**: carry over your rule action overrides, rule state (enabled or disabled) overrides, and exclusions at the rule set, rule group, and rule level. If you use [exceptions](front-door-exceptions.md), re-scope the exceptions that reference your current DRS version to DRS 2.2.

- **Account for the Paranoia Level baseline**: DRS 2.2 operates at Paranoia Level 1 (PL1) by default, and all PL2 rules are disabled by default. DRS 2.1 runs 65 rules that DRS 2.2 disables by default, including the Microsoft Threat Intelligence CVE, web shell, and AppSec rules. Overrides you carry over keep their explicit state; rules you never customized take the DRS 2.2 defaults.

- **Validate new rules safely**: newly added rules that are enabled by default are set to **log mode** first, so you can monitor their impact and fine-tune them before they contribute to blocking.

- **Use PowerShell, the CLI, the REST API, or a template, not the portal**: when you assign a new ruleset version in the Azure portal, Front Door resets rule states, rule actions, and rule-level exclusions to the new version's defaults. Custom rules and policy settings aren't affected.

- **Expect a different action model when you upgrade from DRS 1.0 or 1.1**: in DRS 1.0 and 1.1, each rule match takes the rule's action, which is Block by default. In DRS 2.2, matches add to an anomaly score, and the rule set action (Block, Log, or Redirect) applies when the score reaches 5. DRS 2.2 rule overrides accept only `AnomalyScoring` and `Log`, so the script changes carried-over Block and Redirect overrides to `AnomalyScoring` and Allow overrides to `Log`.

- **Keep your other managed rule sets**: `Update-AzFrontDoorWafPolicy -ManagedRuleSet` replaces the policy's whole list of managed rule sets. Pass the Bot Manager rule set, and any other managed rule set, together with the upgraded DRS, as the script in this article does.

- **Plan for a global rollout**: a policy update applies at once to every domain associated with the policy. To stage the change, upgrade a copy of the policy and associate it with a test domain first.

### Rules added and enabled by default

These rules are new to your policy and enabled by default in DRS 2.2. The script in this article sets them to log mode first. A check mark means the rule is new when you upgrade from that version.

| Rule group | Rules | From DRS 2.1 | From DRS 2.0 | From DRS 1.1 | From DRS 1.0 |
|---|---|:-:|:-:|:-:|:-:|
| PROTOCOL-ENFORCEMENT | 920530, 920620 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| PROTOCOL-ATTACK | 921421 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| MS-ThreatIntel-XSS | 99032001 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| PROTOCOL-ENFORCEMENT | 920181, 920500 | | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| PROTOCOL-ATTACK | 921190, 921200 | | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| General | 200002, 200003 | | | :heavy_check_mark: | :heavy_check_mark: |
| METHOD-ENFORCEMENT | 911100 | | | :heavy_check_mark: | :heavy_check_mark: |
| PROTOCOL-ENFORCEMENT | 920100, 920120, 920160, 920170, 920171, 920180, 920190, 920210, 920220, 920240, 920260, 920270, 920280, 920290, 920310, 920311, 920330, 920340, 920350, 920430, 920440, 920450, 920470, 920480 | | | :heavy_check_mark: | :heavy_check_mark: |
| PHP | 933200, 933210 | | | :heavy_check_mark: | :heavy_check_mark: |
| NODEJS | 934100 | | | :heavy_check_mark: | :heavy_check_mark: |
| XSS | 941360, 941370 | | | :heavy_check_mark: | :heavy_check_mark: |
| SQLI | 942500 | | | :heavy_check_mark: | :heavy_check_mark: |
| MS-ThreatIntel-CVEs | 99001018 | | | | :heavy_check_mark: |
| MS-ThreatIntel-Response-CVEs | 99006001 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |

### Other changes by the version you upgrade from

#### From DRS 2.0 or 2.1

- **Rule 920450 matches more headers.** The rule (HTTP header is restricted by policy) also matches requests that carry an `Accept-Charset` or `Content-Encoding` header. One match reaches the anomaly threshold, so in Prevention mode, requests from clients that compress their request bodies are blocked. The script in this article sets 920450 to log mode during validation. From DRS 2.0, the rule also stops matching the `Translate` header.

- **Rule 920420 allows fewer content types.** The rule (Request content type is not allowed by policy) is disabled by default in DRS 2.2. If you enable it, `application/octet-stream`, `text/plain`, `application/x-amf`, `application/csp-report`, and `application/xss-auditor-report` request bodies match it. From DRS 2.0, `multipart/related`, `application/cloudevents+json`, and `application/cloudevents-batch+json` request bodies stop matching it.

- **One rule group is added**: MS-ThreatIntel-XSS.

#### From DRS 1.0 or 1.1

- **Anomaly scoring replaces traditional mode.** The script changes carried-over Block and Redirect overrides to `AnomalyScoring` and Allow overrides to `Log`.

- **Request bodies are parsed.** DRS 2.2 inspects JSON, XML, `multipart/form-data`, and `application/x-www-form-urlencoded` bodies. DRS 1.0 and 1.1 inspect `application/x-www-form-urlencoded` and `text/plain` bodies.

- **Rule groups are added.** From DRS 1.1: General, METHOD-ENFORCEMENT, PROTOCOL-ENFORCEMENT, NODEJS, and MS-ThreatIntel-XSS. From DRS 1.0: General, METHOD-ENFORCEMENT, PROTOCOL-ENFORCEMENT, NODEJS, MS-ThreatIntel-AppSec, MS-ThreatIntel-SQLI, and MS-ThreatIntel-XSS.

## Prepare your environment and variables

1. Set the context for your subscription, resource group, and Front Door WAF policy, and set the target ruleset version.

   ```powershell
   Import-Module Az.FrontDoor
   Set-AzContext -SubscriptionId "<subscription_id>"
   $resourceGroupName = "<resource_group>"
   $wafPolicyName = "<policy_name>"
   $targetType = "Microsoft_DefaultRuleSet"
   $targetVersion = "2.2"
   ```

1. Get the WAF policy object and its current Default Rule Set. On Front Door, the current ruleset type is `DefaultRuleSet` (DRS 1.0) or `Microsoft_DefaultRuleSet` (DRS 1.1 and later). The script also keeps the current managed rule sets and exceptions so that you can roll back.

   ```powershell
   $wafPolicy = Get-AzFrontDoorWafPolicy `
       -Name $wafPolicyName `
       -ResourceGroupName $resourceGroupName

   if ($wafPolicy.SkuName -ne "Premium_AzureFrontDoor") {
       throw "DRS $targetVersion requires a Premium_AzureFrontDoor policy. This policy's SKU is $($wafPolicy.SkuName)."
   }

   $currentManagedRuleset = $wafPolicy.ManagedRuleSet |
       Where-Object { $_.Type -eq "DefaultRuleSet" -or $_.Type -eq "Microsoft_DefaultRuleSet" }
   if (-not $currentManagedRuleset) {
       throw "The policy doesn't have a Default Rule Set assigned."
   }
   $currentType = $currentManagedRuleset.Type
   $currentVersion = $currentManagedRuleset.Version

   # Keep the current configuration so you can review it or roll back
   $backupManagedRuleSets = $wafPolicy.ManagedRuleSet
   $backupExceptions = $wafPolicy.ExceptionListException
   $wafPolicy | ConvertTo-Json -Depth 20 | Out-File "./$wafPolicyName-before-upgrade.json"
   ```

1. Get the rules of your current version and of DRS 2.2. The following function reads them from Front Door with `Get-AzFrontDoorWafManagedRuleSetDefinition` and returns each rule's group and default state. The validation steps use them to find the rules that are new to your policy or disabled by default in DRS 2.2.

   ```powershell
   $ruleSetDefinitions = Get-AzFrontDoorWafManagedRuleSetDefinition

   function Get-AfdRuleSetRules {
       param (
           [Parameter(Mandatory = $true)]
           [string]$RuleSetType,
           [Parameter(Mandatory = $true)]
           [string]$RuleSetVersion
       )

       $definition = $ruleSetDefinitions |
           Where-Object { $_.Name -eq "$($RuleSetType)_$($RuleSetVersion)" }
       if (-not $definition) {
           throw "Managed rule set $RuleSetType $RuleSetVersion isn't available in this subscription."
       }

       # Map each rule ID to its rule group and default state
       $rules = @{}
       foreach ($group in $definition.RuleGroup) {
           foreach ($rule in $group.Rule) {
               $rules[$rule.RuleId] = [pscustomobject]@{
                   RuleGroupName = $group.RuleGroupName
                   DefaultState  = $rule.DefaultState
               }
           }
       }
       if ($rules.Count -eq 0) {
           throw "No rule definitions were returned for $RuleSetType $RuleSetVersion."
       }
       return $rules
   }

   $currentRules = Get-AfdRuleSetRules -RuleSetType $currentType -RuleSetVersion $currentVersion
   $targetRules = Get-AfdRuleSetRules -RuleSetType $targetType -RuleSetVersion $targetVersion
   ```

## Preserve existing customizations

1. DRS 2.2 accepts only `AnomalyScoring` and `Log` as rule actions, so the script changes the DRS 1.x actions Block and Redirect to `AnomalyScoring`, and Allow to `Log`. Each rule group keeps its group-level exclusions, and exclusions on the whole rule set carry over as they are.

   ```powershell
   # DRS 2.2 accepts only AnomalyScoring and Log as rule actions. Change the actions that DRS 1.x overrides can use.
   $actionMap = @{ Block = "AnomalyScoring"; Redirect = "AnomalyScoring"; Allow = "Log" }

   # Rule group name -> rule overrides and group-level exclusions to carry over
   $groupOverrideMap = [ordered]@{}

   foreach ($group in $currentManagedRuleset.RuleGroupOverride) {
       $rules = [System.Collections.Generic.List[object]]::new()
       foreach ($existingRule in $group.ManagedRuleOverride) {
           if (-not $actionMap.ContainsKey([string]$existingRule.Action)) {
               $rules.Add($existingRule)
               continue
           }
           # Create a new override so the saved backup keeps the original action
           $newAction = $actionMap[[string]$existingRule.Action]
           "Rule $($existingRule.RuleId): $($existingRule.Action) becomes $newAction"
           $overrideParams = @{
               RuleId   = $existingRule.RuleId
               Action   = $newAction
               Disabled = ($existingRule.EnabledState -ne "Enabled")
           }
           if ($existingRule.Exclusion) {
               $overrideParams.Exclusion = $existingRule.Exclusion
           }
           $rules.Add((New-AzFrontDoorWafManagedRuleOverrideObject @overrideParams))
       }
       $groupOverrideMap[$group.RuleGroupName] = [pscustomobject]@{
           Rules     = $rules
           Exclusion = $group.Exclusion
       }
   }

   # Exclusions that apply to the whole rule set carry over as they are
   $ruleSetExclusions = $currentManagedRuleset.Exclusion
   ```

1. If you use exceptions, re-scope the exceptions that reference your current DRS version. Exceptions require DRS 2.1 or later, so this step applies when you upgrade from DRS 2.1. Scopes for other managed rule sets, such as Bot Manager, stay as they are.

   ```powershell
   $models = "Microsoft.Azure.PowerShell.Cmdlets.FrontDoor.Models"
   $newExceptions = @()

   foreach ($exception in $wafPolicy.ExceptionListException) {
       $scopes = New-Object "System.Collections.Generic.List[$models.IManagedRuleSetScope]"
       foreach ($scope in $exception.Scope) {
           if ($scope.RuleSetType -ne $currentType -or $scope.RuleSetVersion -ne $currentVersion) {
               $scopes.Add($scope)  # Scope for another managed rule set, such as Bot Manager
               continue
           }
           $newScope = New-Object "$models.ManagedRuleSetScope"
           $newScope.RuleSetType = $targetType
           $newScope.RuleSetVersion = $targetVersion
           if ($scope.RuleGroupScope) {
               $newScope.RuleGroupScope = $scope.RuleGroupScope
           }
           $scopes.Add($newScope)
       }
       # Create new objects so the saved backup keeps the current scopes
       $newException = New-Object "$models.ManagedRuleSetException"
       $newException.MatchVariable = $exception.MatchVariable
       $newException.ValueMatchOperator = $exception.ValueMatchOperator
       $newException.MatchValue = $exception.MatchValue
       $newException.Scope = $scopes
       if ($exception.Selector) {
           $newException.Selector = $exception.Selector
           $newException.SelectorMatchOperator = $exception.SelectorMatchOperator
       }
       $newExceptions += $newException
   }
   ```

## Validate new rules safely

When you upgrade, the DRS 2.2 rules that are enabled by default start adding to the anomaly score. If your WAF policy is in *Prevention* mode, set the rules that are new to you to *log* mode first, so you can review their matches before they contribute to blocking.

1. Add the following helper. It adds a rule override with the action you choose, unless you already have an override for that rule. On Front Door, a rule override without a state disables the rule, so the helper passes `-Disabled:$false` to keep the rule enabled.

   ```powershell
   function Add-RuleOverrideIfMissing {
       param (
           [Parameter(Mandatory = $true)]
           [string]$RuleId,
           [Parameter(Mandatory = $true)]
           [string]$Action
       )

       $groupName = $targetRules[$RuleId].RuleGroupName
       if (-not $groupOverrideMap.Contains($groupName)) {
           $groupOverrideMap[$groupName] = [pscustomobject]@{
               Rules     = [System.Collections.Generic.List[object]]::new()
               Exclusion = $null
           }
       }
       $groupEntry = $groupOverrideMap[$groupName]

       # Keep any override that you already have for this rule
       if ($groupEntry.Rules | Where-Object { $_.RuleId -eq $RuleId }) {
           return
       }

       # -Disabled:$false sets the rule state to Enabled. An override without a state disables the rule.
       $groupEntry.Rules.Add((New-AzFrontDoorWafManagedRuleOverrideObject `
           -RuleId $RuleId `
           -Action $Action `
           -Disabled:$false))
   }
   ```

1. Set the new rules to log mode. The script selects the rules that are enabled by default in DRS 2.2 and don't exist in your current version, as listed in [Rules added and enabled by default](#rules-added-and-enabled-by-default). If you upgrade from DRS 2.0 or 2.1, it also sets rule 920450 to log mode, because that rule matches more request headers in DRS 2.2.

   ```powershell
   # Rules that are new in the target version and enabled by default
   $rulesToValidate = @($targetRules.Keys | Where-Object {
       $targetRules[$_].DefaultState -eq "Enabled" -and -not $currentRules.ContainsKey($_)
   })

   # Rule 920450 matches two more request headers in DRS 2.2, so validate it too
   if ($targetVersion -eq "2.2" -and $currentRules.ContainsKey("920450")) {
       $rulesToValidate += "920450"
   }

   foreach ($ruleId in $rulesToValidate) {
       Add-RuleOverrideIfMissing -RuleId $ruleId -Action "Log"
   }
   "Rules set to log mode for validation: $(($rulesToValidate | Sort-Object) -join ', ')"
   ```

## Apply customizations and upgrade

Build the DRS 2.2 rule set from the carried-over and new overrides, and then update the policy. `Update-AzFrontDoorWafPolicy -ManagedRuleSet` replaces the policy's whole list of managed rule sets, so the script swaps only the Default Rule Set and passes every other rule set as it is. Set the rule set action, which applies when the anomaly score reaches 5, with the `-RuleSetAction` parameter.

```powershell
# Build the rule group overrides for the target version
$groupOverrides = @(foreach ($groupName in $groupOverrideMap.Keys) {
    $groupEntry = $groupOverrideMap[$groupName]
    $groupParams = @{ RuleGroupName = $groupName }
    if ($groupEntry.Rules.Count -gt 0) {
        $groupParams.ManagedRuleOverride = $groupEntry.Rules.ToArray()
    }
    if ($groupEntry.Exclusion) {
        $groupParams.Exclusion = $groupEntry.Exclusion
    }
    New-AzFrontDoorWafRuleGroupOverrideObject @groupParams
})

# DRS 1.x has no rule set action. Keep the current action, or use Block.
$ruleSetAction = if ($currentManagedRuleset.RuleSetAction) { $currentManagedRuleset.RuleSetAction } else { "Block" }

$managedRuleSetParams = @{
    Type          = $targetType
    Version       = $targetVersion
    RuleSetAction = $ruleSetAction
}
if ($groupOverrides.Count -gt 0) {
    $managedRuleSetParams.RuleGroupOverride = $groupOverrides
}
if ($ruleSetExclusions) {
    $managedRuleSetParams.Exclusion = $ruleSetExclusions
}
$managedRuleSet = New-AzFrontDoorWafManagedRuleObject @managedRuleSetParams

# Replace the Default Rule Set and keep every other managed rule set, such as Bot Manager
$managedRuleSets = @(foreach ($ruleSet in $wafPolicy.ManagedRuleSet) {
    if ($ruleSet.Type -eq "DefaultRuleSet" -or $ruleSet.Type -eq "Microsoft_DefaultRuleSet") {
        $managedRuleSet
    } else {
        $ruleSet
    }
})

$updateParams = @{
    Name              = $wafPolicyName
    ResourceGroupName = $resourceGroupName
    ManagedRuleSet    = $managedRuleSets
}
if ($wafPolicy.ExceptionListException) {
    $updateParams.ExceptionListException = $newExceptions
}

Update-AzFrontDoorWafPolicy @updateParams
```

Confirm the versions and rule set actions on the policy:

```powershell
(Get-AzFrontDoorWafPolicy -Name $wafPolicyName -ResourceGroupName $resourceGroupName).ManagedRuleSet |
    Select-Object Type, Version, RuleSetAction
```

**To roll back**, apply the managed rule sets and exceptions that you saved in [Prepare your environment and variables](#prepare-your-environment-and-variables):

```powershell
$rollbackParams = @{
    Name              = $wafPolicyName
    ResourceGroupName = $resourceGroupName
    ManagedRuleSet    = @($backupManagedRuleSets)
}
if ($backupExceptions) {
    $rollbackParams.ExceptionListException = @($backupExceptions)
}
Update-AzFrontDoorWafPolicy @rollbackParams
```

## Review the new rules and turn on scoring

Rules in log mode record their matches but don't add to the anomaly score. Review their matches, tune them, and then move them to anomaly scoring.

1. In the Log Analytics workspace that receives your Front Door logs, list the DRS 2.2 rules that matched in log mode. The rule name format is `<rule set type>-<version>-<rule group>-<rule ID>`.

   ```kusto
   AzureDiagnostics
   | where ResourceProvider == "MICROSOFT.CDN" and Category == "FrontDoorWebApplicationFirewallLog"
   | where policy_s == "<policy_name>"
   | where ruleName_s startswith "Microsoft_DefaultRuleSet-2.2-"
   | where action_s == "Log"
   | summarize Matches = count(), SampleUri = take_any(requestUri_s) by ruleName_s
   | order by Matches desc
   ```

   If a rule matches legitimate requests, add an exclusion for the request attribute it matched. To trace a single request, search on `trackingReference_s`, which holds the value of the `X-Azure-Ref` response header.

1. Move the rules that you reviewed from log mode to anomaly scoring. The script changes only the overrides that you list and keeps every other managed rule set.

   ```powershell
   # Rules you reviewed and want to return to anomaly scoring
   $validatedRuleIds = @("<rule_id>", "<rule_id>")

   $wafPolicy = Get-AzFrontDoorWafPolicy -Name $wafPolicyName -ResourceGroupName $resourceGroupName
   $drs = $wafPolicy.ManagedRuleSet | Where-Object { $_.Type -eq $targetType }

   foreach ($rule in $drs.RuleGroupOverride.ManagedRuleOverride) {
       if ($rule.RuleId -in $validatedRuleIds -and $rule.Action -eq "Log") {
           $rule.Action = "AnomalyScoring"
       }
   }

   Update-AzFrontDoorWafPolicy `
       -Name $wafPolicyName `
       -ResourceGroupName $resourceGroupName `
       -ManagedRuleSet $wafPolicy.ManagedRuleSet
   ```

## Related content

- [Azure Front Door WAF DRS rule groups and rules](waf-front-door-drs.md)
- [Web application firewall exclusion lists in Azure Front Door](waf-front-door-exclusion.md)
- [Azure Front Door WAF exceptions list](front-door-exceptions.md)
- [Tune Azure Web Application Firewall for Azure Front Door](waf-front-door-tuning.md)
- [Monitoring and logging for Azure Web Application Firewall on Azure Front Door](waf-front-door-monitor.md)
- [Upgrade CRS or DRS ruleset version on Application Gateway](../ag/upgrade-ruleset-version.md)
