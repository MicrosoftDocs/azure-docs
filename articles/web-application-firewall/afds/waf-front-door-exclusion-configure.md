---
title: Configure WAF exclusion lists for Front Door
description: Learn how to configure a WAF exclusion list for an existing Front Door endpoint.
services: web-application-firewall
author: johndowns
ms.service: web-application-firewall
ms.custom: devx-track-azurepowershell, devx-track-bicep
ms.date: 10/18/2022
ms.author: jodowns
ms.topic: conceptual
zone_pivot_groups: web-application-firewall-configuration
---

# Configure Web Application Firewall exclusion lists

Sometimes the Front Door Web Application Firewall (WAF) might block a legitimate request. As part of tuning your WAF, you can configure the WAF to allow the request for your application. WAF exclusion lists allow you to omit specific request attributes from a WAF evaluation. The rest of the request is evaluated as normal. For more information about exclusion lists, see [Web Application Firewall (WAF) with Front Door exclusion lists](waf-front-door-exclusion.md).

An exclusion list can be configured by using [Azure PowerShell](/powershell/module/az.frontdoor/New-AzFrontDoorWafManagedRuleExclusionObject), the [Azure CLI](/cli/azure/network/front-door/waf-policy/managed-rules/exclusion#az-network-front-door-waf-policy-managed-rules-exclusion-add), the [REST API](/rest/api/frontdoorservice/webapplicationfirewall/policies/createorupdate), Bicep, ARM templates, and the Azure portal.

## Scenario

Suppose you've created an API. Your clients send requests to your API that include headers with names like `userid` and `user-id`.

While tuning your WAF, you've noticed that some legitimate requests have been blocked because the user headers included character sequences that the WAF detected as SQL injection attacks. Specifically, rule ID 942230 detects the request headers and blocks the requests. [Rule 942230 is part of the SQLI rule group.](waf-front-door-drs.md#drs942-20)

You decide to create an exclusion to allow these legitimate requests to pass through without the WAF blocking them.

::: zone pivot="portal"

## Create an exclusion

1. Open your Front Door WAF policy.

1. Select **Managed rules**, and then select **Manage exclusions** on the toolbar.

   :::image type="content" source="../media/waf-front-door-exclusion-configure/managed-rules-exclusion.png" alt-text="Screenshot of the Azure portal showing the WAF policy's managed rules page, with the 'Manage exclusions' button highlighted." :::

1. Select the **Add** button.

   :::image type="content" source="../media/waf-front-door-exclusion-configure/exclusion-add.png" alt-text="Screenshot of the Azure portal showing the exclusion list, with the Add button highlighted." :::

1. Configure the exclusion's **Applies to** section as follows:

   | Field | Value |
   |-|-|
   | Rule set | Microsoft_DefaultRuleSet_2.0 |
   | Rule group | SQLI |
   | Rule | 942230 Detects conditional SQL injection attempts |

1. Configure the exclusion match conditions as follows:

   | Field | Value |
   |-|-|
   | Match variable | Request header name |
   | Operator | Starts with |
   | Selector | user |

1. Review the exclusion, which should look like the following screenshot:

   :::image type="content" source="../media/waf-front-door-exclusion-configure/exclusion-details.png" alt-text="Screenshot of the Azure portal showing the exclusion configuration." :::

   This exclusion applies to any request headers that start with the word `user`. The match condition is case insensitive, so headers that start with `User` are also covered by the exclusion. If WAF rule 942230 detects a risk in these header values, it ignores the header and moves on.

1. Select **Save**.

::: zone-end

::: zone pivot="powershell"

## Define an exclusion selector

Use the [New-AzFrontDoorWafManagedRuleExclusionObject](/powershell/module/az.frontdoor/new-azfrontdoorwafmanagedruleexclusionobject) cmdlet to define a new exclusion selector.

The following example identifies request headers that start with the word `user`. The match condition is case insensitive, so headers that start with `User` are also covered by the exclusion.

```azurepowershell
$exclusionSelector = New-AzFrontDoorWafManagedRuleExclusionObject `
  -Variable RequestHeaderNames `
  -Operator StartsWith `
  -Selector 'user'
```

## Define a per-rule exclusion

Use the [New-AzFrontDoorWafManagedRuleOverrideObject](/powershell/module/az.frontdoor/new-azfrontdoorwafmanagedruleoverrideobject) cmdlet to define a new per-rule exclusion, which includes the selector you created in the previous step.

The following example creates an exclusion for rule ID 942230.

```azurepowershell
$exclusion = New-AzFrontDoorWafManagedRuleOverrideObject `
  -RuleId '942230' `
  -Exclusion $exclusionSelector
```

## Apply the exclusion to the rule group

Use the [New-AzFrontDoorWafRuleGroupOverrideObject](/powershell/module/az.frontdoor/new-azfrontdoorwafrulegroupoverrideobject) cmdlet to create a rule group override, which applies the exclusion to the appropriate rule group.

The example below uses the SQLI rule group, because that group contains rule ID 942230.

```azurepowershell
$ruleGroupOverride = New-AzFrontDoorWafRuleGroupOverrideObject `
  -RuleGroupName 'SQLI' `
  -ManagedRuleOverride $exclusion
```

## Configure the managed rule set

Use the [New-AzFrontDoorWafManagedRuleObject](/powershell/module/az.frontdoor/new-azfrontdoorwafmanagedruleobject) cmdlet to configure the managed rule set, including the rule group override that you created in the previous step.

The example below configures the DRS 2.0 rule set with the rule group override and its exclusion.

```azurepowershell
$managedRuleSet = New-AzFrontDoorWafManagedRuleObject `
  -Type 'Microsoft_DefaultRuleSet' `
  -Version '2.0' `
  -Action Block `
  -RuleGroupOverride $ruleGroupOverride
```

## Apply the managed rule set configuration to the WAF profile

Use the [Update-AzFrontDoorWafPolicy](/powershell/module/az.frontdoor/update-azfrontdoorwafpolicy) cmdlet to update your WAF policy to include the configuration you created above. Ensure that you use the correct resource group name and WAF policy name for your own environment.

```azurepowershell
Update-AzFrontDoorWafPolicy `
  -ResourceGroupName 'FrontDoorWafPolicy' `
  -Name 'WafPolicy'
  -ManagedRule $managedRuleSet
```

::: zone-end

::: zone pivot="cli"

## Create an exclusion

Use the [`az network front-door waf-policy managed-rules exclusion add`](/cli/azure/network/front-door/waf-policy/managed-rules/exclusion) command to update your WAF policy to add a new exclusion. 

The exclusion identifies request headers that start with the word `user`. The match condition is case insensitive, so headers that start with `User` are also covered by the exclusion.

Ensure that you use the correct resource group name and WAF policy name for your own environment.

```azurecli
az network front-door waf-policy managed-rules exclusion add \
  --resource-group FrontDoorWafPolicy \
  --policy-name WafPolicy \
  --type Microsoft_DefaultRuleSet \
  --rule-group-id SQLI \
  --rule-id 942230 \
  --match-variable RequestHeaderNames \
  --operator StartsWith \
  --value user
```

::: zone-end

::: zone pivot="bicep"

## Example Bicep file

The following example Bicep file shows how to do the following steps:

- Create a Front Door WAF policy.
- Enable the DRS 2.0 rule set.
- Configure an exclusion for rule 942230, which exists within the SQLI rule group. This exclusion applies to any request headers that start with the word `user`. The match condition is case insensitive, so headers that start with `User` are also covered by the exclusion. If WAF rule 942230 detects a risk in these header values, it ignores the header and moves on.

```bicep
param wafPolicyName string = 'WafPolicy'

@description('The mode that the WAF should be deployed using. In "Prevention" mode, the WAF will block requests it detects as malicious. In "Detection" mode, the WAF will not block requests and will simply log the request.')
@allowed([
  'Detection'
  'Prevention'
])
param wafMode string = 'Prevention'

resource wafPolicy 'Microsoft.Network/frontDoorWebApplicationFirewallPolicies@2022-05-01' = {
  name: wafPolicyName
  location: 'Global'
  sku: {
    name: 'Premium_AzureFrontDoor'
  }
  properties: {
    policySettings: {
      enabledState: 'Enabled'
      mode: wafMode
    }
    managedRules: {
      managedRuleSets: [
        {
          ruleSetType: 'Microsoft_DefaultRuleSet'
          ruleSetVersion: '2.0'
          ruleSetAction: 'Block'
          ruleGroupOverrides: [
            {
              ruleGroupName: 'SQLI'
              rules: [
                {
                  ruleId: '942230'
                  enabledState: 'Enabled'
                  action: 'AnomalyScoring'
                  exclusions: [
                    {
                      matchVariable: 'RequestHeaderNames'
                      selectorMatchOperator: 'StartsWith'
                      selector: 'user'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
```

::: zone-end

## Next steps

- Learn more about [Front Door](../../frontdoor/front-door-overview.md).
