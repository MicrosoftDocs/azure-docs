---
title: AI Bot Ruleset (Preview) - Front Door WAF
description: Learn how the AI bot ruleset (preview) in Azure Front Door WAF identifies AI crawlers and agents by category, and how to allow, block, log, or challenge them.
author: joeolerich
ms.author: joeolerich
ms.service: azure-web-application-firewall
ms.topic: concept-article
ms.date: 11/06/2026
# Customer intent: As a web platform owner, I want to control how AI crawlers and AI agents access my applications behind Azure Front Door, so that I can protect my content while still supporting the AI experiences I choose.
---

# AI bot ruleset in Azure Front Door WAF (preview)

**Applies to:** ✔️ Front Door Premium

> [!IMPORTANT]
> The AI bot ruleset is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

AI crawlers and agents are a fast-growing share of automated web traffic. Some collect public content to train AI models, some index content for AI-powered search and answers, and others fetch pages in real time when a person asks an AI assistant a question. Many site owners want to support some of these uses and not others. Robots.txt directives depend on each bot choosing to honor them, and some bots falsely claim to be a well-known AI crawler.

The AI bot ruleset is an Azure-managed ruleset for Azure Web Application Firewall (WAF) on Azure Front Door. It identifies requests from AI bots, groups them by purpose, and lets you choose an action for each group. Because Azure WAF enforces your choices at the edge, they apply whether or not a bot follows your robots.txt file.

## How the AI bot ruleset works

When you assign the AI bot ruleset to a WAF policy, Azure WAF classifies requests from AI bots into four categories. Each category is a rule in the ruleset, so you can set a different action for each one. For example, you can block AI training crawlers while you continue to allow AI search crawlers and AI assistants that fetch pages for users.

Keep the following behaviors in mind:

- **Identity verification**: For rules 800101, 800102, and 800103, Azure WAF verifies that a request comes from the operator of the AI bot that it claims to be. A request that identifies itself as one of these bots but fails verification matches only rule 800104.
- **Managed signatures**: Microsoft manages the AI bot signatures and updates them as AI bots change. You don't need to change the ruleset version to get updated signatures.
- **Log by default**: When you assign the ruleset, all of its rules are enabled with the **Log** action. Matching requests are recorded in the WAF logs, but no traffic is blocked until you change a rule's action.
- **Evaluation order**: Azure WAF evaluates the [HTTP DDoS ruleset](http-ddos-ruleset.md) first, then custom rules, and then managed rulesets in the order that they appear in the policy. The AI bot ruleset is evaluated immediately after the Bot Manager ruleset. In a policy that uses all of these rulesets, the default order is the HTTP DDoS ruleset, custom rules, the Default Rule Set, the Bot Manager ruleset, and then the AI bot ruleset.
- **Detection mode**: If your WAF policy is in detection mode, requests that match the AI bot ruleset are logged, and the configured action isn't taken.

## Ruleset rules

The AI bot ruleset appears as **Microsoft_AIBotRuleSet_1.0** in the managed rules of your WAF policy. It has one rule group, **AIBotAccess**, with four rules.

| Rule ID | Rule | What it matches | Default action |
|---|---|---|---|
| 800101 | AI training | Verified crawlers that collect public web content to train or fine-tune AI models. | Log |
| 800102 | AI search | Verified crawlers that index content to power AI search, answers, or summaries. This category includes search crawlers that also feed AI experiences. | Log |
| 800103 | AI Interactive agents | Verified AI agents that retrieve pages or perform tasks in real time when a user asks an AI assistant to. | Log |
| 800104 | Miscellaneous AI agents | AI bots and agents that Azure WAF can't verify. This category includes bots from known AI operators that don't publish IP address or reverse DNS information for verification, and requests that claim to be a known AI bot but fail verification. | Log |

A single AI company can operate bots in more than one category. For example, a company might use one crawler to collect training data and a separate agent to fetch a page when a user asks about it. Each request is classified by the purpose of the bot that sent it.

Consider the following points when you choose an action for each rule:

- **AI training (800101)**: Block this category if you don't want your public content collected to train AI models.
- **AI search (800102)**: Blocking this category can reduce how often your content appears in AI-powered search and answer experiences.
- **AI Interactive agents (800103)**: These requests are made on behalf of a person in real time. Because a person starts the request, these agents might not follow robots.txt directives. Blocking this category prevents AI assistants from retrieving your pages when users ask about them.
- **Miscellaneous AI agents (800104)**: This category includes AI bots that Azure WAF can't verify. Many of these bots come from known AI operators that don't publish verification information, and some impersonate a well-known AI crawler. Consider the **Block**, **JS challenge**, or **CAPTCHA** action for this rule.

> [!IMPORTANT]
> Rule 800104 also matches the user agents of the verified bots in rules 800101, 800102, and 800103. The **Log** action doesn't stop rule evaluation, so a verified request that matches a rule set to **Log** is then evaluated by rule 800104. If you set rule 800104 to **Block**, **JS challenge**, or **CAPTCHA**, set the rules for the categories that you want to permit to **Allow** instead of **Log**. Otherwise, rule 800104 blocks or challenges the verified bots in those categories.

## Supported actions

You can set any of the following actions on each rule in the AI bot ruleset:

- **Allow**: Forward the request to the origin, and prevent lower priority rules from evaluating it.
- **Block**: Block the request, and have Azure WAF send the block response to the client.
- **Log**: Log the request, and have Azure WAF continue to evaluate lower priority rules.
- **Redirect**: Redirect the request to the redirect URL that you configure in your [policy settings](waf-front-door-policy-settings.md).
- **JS challenge**: Require the client to complete a [JavaScript challenge](../waf-javascript-challenge.md) before forwarding the request. Clients that can't run JavaScript, which includes most crawlers, can't complete the challenge.
- **CAPTCHA**: Require the client to complete a [CAPTCHA challenge](captcha-challenge.md) before forwarding the request. Most automated clients can't complete the challenge.

The **Anomaly score** action isn't supported for this ruleset. The rules don't use sensitivity levels. For more information about each action, see [WAF actions](afds-overview.md#waf-actions).

## Configure the AI bot ruleset

To use the AI bot ruleset, you need an Azure Front Door Premium profile and a WAF policy with the Premium tier. To create a policy, see [Create a WAF policy for Azure Front Door by using the Azure portal](waf-front-door-create-portal.md).

Assign the ruleset with its default **Log** actions, review the WAF logs to understand your AI bot traffic, and then change the actions for the categories that you want to block or challenge.

# [Azure portal](#tab/portal)

1. In the Azure portal, go to your WAF policy.

1. Select **Managed rules**, and then select **Assign**.

1. Select the AI bot ruleset from the list of available rulesets, and then select **Save**.

1. To change the action for a category, select the rules that you want to change in the managed rules list, select **Change action**, choose an action, and then save your changes.

# [Azure PowerShell](#tab/powershell)

Use the [Get-AzFrontDoorWafPolicy](/powershell/module/az.frontdoor/get-azfrontdoorwafpolicy) cmdlet to retrieve your WAF policy. Use the [New-AzFrontDoorWafManagedRuleOverrideObject](/powershell/module/az.frontdoor/new-azfrontdoorwafmanagedruleoverrideobject) and [New-AzFrontDoorWafRuleGroupOverrideObject](/powershell/module/az.frontdoor/new-azfrontdoorwafrulegroupoverrideobject) cmdlets to set rule actions, and the [New-AzFrontDoorWafManagedRuleObject](/powershell/module/az.frontdoor/new-azfrontdoorwafmanagedruleobject) cmdlet to add the ruleset. Then apply the configuration by using the [Update-AzFrontDoorWafPolicy](/powershell/module/az.frontdoor/update-azfrontdoorwafpolicy) cmdlet.

The following example adds the AI bot ruleset, blocks AI training crawlers (rule 800101), and leaves the other rules at their default **Log** action. Ensure that you use the correct resource group name and WAF policy name for your environment.

```azurepowershell
$frontDoorWafPolicy = Get-AzFrontDoorWafPolicy `
  -ResourceGroupName 'FrontDoorWafPolicy' `
  -Name 'WafPolicy'

$aiTrainingOverride = New-AzFrontDoorWafManagedRuleOverrideObject `
  -RuleId '800101' `
  -Action Block

$aiBotRuleGroupOverride = New-AzFrontDoorWafRuleGroupOverrideObject `
  -RuleGroupName 'AIBotAccess' `
  -ManagedRuleOverride $aiTrainingOverride

$aiBotRuleSet = New-AzFrontDoorWafManagedRuleObject `
  -Type 'Microsoft_AIBotRuleSet' `
  -Version '1.0' `
  -RuleGroupOverride $aiBotRuleGroupOverride

$frontDoorWafPolicy.ManagedRules.Add($aiBotRuleSet)

$frontDoorWafPolicy | Update-AzFrontDoorWafPolicy
```

# [Azure CLI](#tab/cli)

Use the [az network front-door waf-policy managed-rules add](/cli/azure/network/front-door/waf-policy/managed-rules#az-network-front-door-waf-policy-managed-rules-add) command to add the AI bot ruleset to your WAF policy. Ensure that you use the correct resource group name and WAF policy name for your environment.

```azurecli
az network front-door waf-policy managed-rules add \
  --resource-group FrontDoorWafPolicy \
  --policy-name WafPolicy \
  --type Microsoft_AIBotRuleSet \
  --version 1.0
```

To change the action for a rule, use the [az network front-door waf-policy managed-rules override add](/cli/azure/network/front-door/waf-policy/managed-rules/override#az-network-front-door-waf-policy-managed-rules-override-add) command. The following example blocks AI training crawlers (rule 800101).

```azurecli
az network front-door waf-policy managed-rules override add \
  --resource-group FrontDoorWafPolicy \
  --policy-name WafPolicy \
  --type Microsoft_AIBotRuleSet \
  --rule-group-id AIBotAccess \
  --rule-id 800101 \
  --action Block
```

# [Bicep](#tab/bicep)

The following example Bicep file creates a Front Door Premium WAF policy with the AI bot ruleset. It blocks AI training crawlers (rule 800101), allows verified AI search crawlers and AI interactive agents (rules 800102 and 800103), and sends a JavaScript challenge to miscellaneous AI agents (rule 800104). Rules 800102 and 800103 use the **Allow** action instead of **Log** so that rule 800104 doesn't also challenge the verified bots in those categories.

```bicep
param wafPolicyName string = 'WafPolicy'

resource wafPolicy 'Microsoft.Network/frontDoorWebApplicationFirewallPolicies@2024-02-01' = {
  name: wafPolicyName
  location: 'Global'
  sku: {
    name: 'Premium_AzureFrontDoor'
  }
  properties: {
    policySettings: {
      enabledState: 'Enabled'
      mode: 'Prevention'
    }
    managedRules: {
      managedRuleSets: [
        {
          ruleSetType: 'Microsoft_AIBotRuleSet'
          ruleSetVersion: '1.0'
          ruleGroupOverrides: [
            {
              ruleGroupName: 'AIBotAccess'
              rules: [
                {
                  ruleId: '800101'
                  enabledState: 'Enabled'
                  action: 'Block'
                }
                {
                  ruleId: '800102'
                  enabledState: 'Enabled'
                  action: 'Allow'
                }
                {
                  ruleId: '800103'
                  enabledState: 'Enabled'
                  action: 'Allow'
                }
                {
                  ruleId: '800104'
                  enabledState: 'Enabled'
                  action: 'JSChallenge'
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

---

## Allow trusted AI bots and agents

To allow specific AI bots while you block or challenge the rest of a category, create an [exception](front-door-exceptions.md) for the AI bot ruleset that uses the **AIProvider** match variable. This match variable matches the AI operator that Azure WAF attributes a request to, such as `OpenAI` or `Google`. Azure WAF maintains the mapping between AI bots and their operators and verifies it daily, so you don't need to track the IP address ranges that each operator uses.

To create the exception, follow the steps in [Apply an exception to your WAF policy](front-door-exceptions.md#apply-an-exception-to-your-waf-policy), and use the following settings:

- **Applies to**: Select *Microsoft_AIBotRuleSet_1.0*, and scope the exception to the rule, rule group, or ruleset that you want the trusted bots to bypass. Use the narrowest scope that works, such as a single rule.
- **Match variable**: *AIProvider*
- **Operator**: *Equals*
- **Values**: The names of the AI operators that you trust, exactly as they appear in the `provider_s` field of your WAF logs. Match values are case-sensitive.

A request that matches the exception bypasses only the AI bot rules in the exception's scope. Your custom rules, the Default Rule Set, and the Bot Manager ruleset still evaluate the request.

The AI bot ruleset doesn't support exclusions. Use exceptions instead.

Avoid using a custom rule with the **Allow** action to allow AI bots. A request that matches an **Allow** custom rule isn't evaluated by any managed ruleset in the policy, including the Default Rule Set and the Bot Manager ruleset, so the allowed traffic isn't inspected for attacks. You also have to maintain each operator's IP address ranges yourself. If you need to allow an AI agent that Azure WAF doesn't attribute to a known operator, such as an agent that a partner operates, scope the [custom rule](waf-front-door-custom-rules.md) as narrowly as possible. Match on the IP address ranges that the agent uses instead of on the `User-Agent` header, which any client can set.

## Use with the Bot Manager ruleset

You can assign the AI bot ruleset to the same WAF policy as the [Bot Manager ruleset](afds-overview.md#bot-protection-rule-set) and the Default Rule Set. The AI bot ruleset is evaluated immediately after the Bot Manager ruleset, and by default the Default Rule Set is evaluated before both bot rulesets. If a request matches an earlier rule with the **Allow** or **Block** action, such as a Bot Manager rule, the AI bot ruleset doesn't evaluate that request.

Some bots, such as verified search engine or social media crawlers, can match rules in both rulesets. If you want the AI bot ruleset to decide how to handle these bots, set the matching Bot Manager rules to **Log**.

## Monitor the AI bot ruleset

Azure Front Door WAF logs record requests that match the AI bot ruleset. The rule name in each log entry identifies the ruleset, rule group, and rule ID, for example `Microsoft_AIBotRuleSet-1.0-AIBotAccess-800101`. When Azure WAF attributes a request to a known AI operator, the `provider_s` field contains the operator name, such as `OpenAI`, `Google`, `Anthropic`, `Amazon`, `Meta`, or `Perplexity`. The operator name also appears in the `details_data_s` field.

The following Log Analytics query shows how many requests each AI operator sent, the AI bot rule that they matched, and the action that Azure WAF took:

```kusto
AzureDiagnostics
| where Category == "FrontDoorWebApplicationFirewallLog"
| where ruleName_s startswith "Microsoft_AIBotRuleSet"
| summarize RequestCount = count() by provider_s, ruleName_s, action_s
| order by RequestCount desc
```

You can also monitor AI bot traffic by using Azure Monitor metrics. To track matches for each AI bot rule, use the **Web Application Firewall Request Count** metric and filter by rule name. AI bot request metrics also include an **AIProvider** dimension that you can use to track traffic from each AI operator. For more information, see [Azure Web Application Firewall monitoring and logging](waf-front-door-monitor.md).

To review AI bot traffic without writing queries, use WAF insights in the Azure portal. It shows AI bot traffic by category and by operator, the top AI bot operators, and the URLs that AI bots request most.

## Related content

- [Bot protection rule set](afds-overview.md#bot-protection-rule-set)
- [Configure bot protection for Web Application Firewall](waf-front-door-policy-configure-bot-protection.md)
- [HTTP DDoS ruleset in Azure Front Door WAF](http-ddos-ruleset.md)
- [Custom rules for Azure Front Door WAF](waf-front-door-custom-rules.md)
- [Azure Front Door WAF exceptions list](front-door-exceptions.md)
- [Azure Web Application Firewall JavaScript challenge](../waf-javascript-challenge.md)
- [Azure Front Door Web Application Firewall CAPTCHA](captcha-challenge.md)
- [Azure Web Application Firewall monitoring and logging](waf-front-door-monitor.md)
