---
title: Web application firewall exclusion lists in Azure Application Gateway - Azure portal
description: This article provides information on Web Application Firewall exclusion lists configuration in Application Gateway with the Azure portal.
services: web-application-firewall
author: vhorne
ms.service: web-application-firewall
ms.date: 05/17/2023
ms.author: victorh
ms.topic: conceptual 
ms.custom: devx-track-azurepowershell
---

# Web Application Firewall exclusion lists

The Azure Application Gateway Web Application Firewall (WAF) provides protection for web applications. This article describes the configuration for WAF exclusion lists. These settings are located in the WAF policy associated to your Application Gateway. To learn more about WAF policies, see [Azure Web Application Firewall on Azure Application Gateway](ag-overview.md) and [Create Web Application Firewall policies for Application Gateway](create-waf-policy-ag.md).

Sometimes WAF might block a request that you want to allow for your application. WAF exclusion lists allow you to omit certain request attributes from a WAF evaluation. The rest of the request is evaluated as normal.

For example, Active Directory inserts tokens that are used for authentication. When used in a request header, these tokens can contain special characters that might trigger a false positive detection from the WAF rules. By adding the header to an exclusion list, you can configure WAF to ignore the header, but WAF still evaluates the rest of the request.

You can configure exclusions to apply when specific WAF rules are evaluated, or to apply globally to the evaluation of all WAF rules. Exclusion rules apply to your whole web application.

## Identify request attributes to exclude

When you configure a WAF exclusion, you must specify the attributes of the request that should be excluded from the WAF evaluation. You can configure a WAF exclusion for the following request attributes:

* Request headers
* Request cookies
* Request attribute name (args) can be added as an exclusion element, such as:
   * Form field name
   * JSON entity
   * URL query string args

You can specify an exact request header, body, cookie, or query string attribute match. Or, you can specify partial matches. Use the following operators to configure the exclusion:

- **Equals**:  This operator is used for an exact match. As an example, for selecting a header named **bearerToken**, use the equals operator with the selector set as **bearerToken**.
- **Starts with**: This operator matches all fields that start with the specified selector value.
- **Ends with**:  This operator matches all request fields that end with the specified selector value.
- **Contains**: This operator matches all request fields that contain the specified selector value.
- **Equals any**: This operator matches all request fields. * will be the selector value. For example, you would use this operator when you don't know the exact values for a given match variable but want to make sure that the request traffic still gets excluded from rules evaluation.

When processing exclusions the WAF engine performs a case sensitive/insensitive match based on the below table. Additionally, regular expressions aren't allowed as selectors and XML request bodies aren't supported.

| Request Body Part | CRS 3.1 and Earlier | CRS 3.2 and Later |
|-|-|-|
| Header* | Case Insensitive | Case Insensitive |
| Cookie* | Case Insensitive | Case Sensitive |
| Query String* | Case Insensitive | Case Sensitive |
| URL-Encoded Body | Case Insensitive | Case Sensitive |
| JSON Body | Case Insensitive | Case Sensitive |
| XML Body | Not Supported | Not Supported |
| Multipart Body | Case Insensitive | Case Sensitive |

*Depending on your application, the names, and values, of your headers, cookies and query args can be case sensitive or insensitive.

> [!NOTE]
> For more information and troubleshooting help, see [WAF troubleshooting](web-application-firewall-troubleshoot.md).

### Request attributes by keys and values

When you configure an exclusion, you need to determine whether you want to exclude the key or the value from WAF evaluation.

For example, suppose your requests include this header:

```
My-Header: 1=1
```

The value of the header (`1=1`) might be detected as an attack by the WAF. But if you know this is a legitimate value for your scenario, you can configure an exclusion for the *value* of the header. To do so, you use the **RequestHeaderValues** match variable, the operator **contains**, and the selector (`My-Header`). This configuration stops evaluation of all values for the header `My-Header`.

> [!NOTE]
> Request attributes by key and values are only available in CRS 3.2 or newer and Bot Manager 1.0 or newer.
>
> Request attributes by names work the same way as request attributes by values, and are included for backward compatibility with CRS 3.1 and earlier versions. We recommend you use request attributes by values instead of attributes by names. For example, use **RequestHeaderValues** instead of **RequestHeaderNames**.

In contrast, if your WAF detects the header's name (`My-Header`) as an attack, you could configure an exclusion for the header *key* by using the **RequestHeaderKeys** request attribute. The **RequestHeaderKeys** attribute is only available in CRS 3.2 or newer and Bot Manager 1.0 or newer.

#### Request attribute examples

The below table shows some examples of how you might structure your exclusion for a given match variable.

| Attribute to Exclude | matchVariable | selectorMatchOperator | Example selector | Example request | What gets excluded |
|-|-|-|-|-|-|
| Query string | RequestArgKeys | Equals | `/etc/passwd` | Uri: `http://localhost:8080/?/etc/passwd=test` | `/etc/passwd` |
| Query string | RequestArgKeys | EqualsAny | N/A | Uri: `http://localhost:8080/?/etc/passwd=test&.htaccess=test2` | `/etc/passwd` and `.htaccess` |
| Query string | RequestArgNames | Equals | `text` | Uri: `http://localhost:8080/?text=/etc/passwd` | `/etc/passwd` |
| Query string | RequestArgNames | EqualsAny | N/A | Uri: `http://localhost:8080/?text=/etc/passwd&text2=.cshrc` | `/etc/passwd` and `.cshrc` |
| Query string | RequestArgValues | Equals | `text` | Uri: `http://localhost:8080/?text=/etc/passwd` | `/etc/passwd` |
| Query string | RequestArgValues | EqualsAny | N/A | Uri: `http://localhost:8080/?text=/etc/passwd&text2=.cshrc` | `/etc/passwd` and `.cshrc` |
| Request body | RequestArgKeys | Contains | `sleep` | Request body: `{"sleep(5)": "test"}` | `sleep(5)` |
| Request body | RequestArgKeys | EqualsAny | N/A | Request body: `{".zshrc": "value", "sleep(5)":"value2"}` | `.zshrc` and `sleep(5)` |
| Request body | RequestArgNames | Equals | `test` | Request body: `{"test": ".zshrc"}` | `.zshrc` |
| Request body | RequestArgNames | EqualsAny | N/A | Request body: `{"key1": ".zshrc", "key2":"sleep(5)"}` | `.zshrc` and `sleep(5)` |
| Request body | RequestArgValues | Equals | `test` | Request body: `{"test": ".zshrc"}` | `.zshrc` |
| Request body | RequestArgValues | EqualsAny | N/A | Request body: `{"key1": ".zshrc", "key2":"sleep(5)"}` | `.zshrc` and `sleep(5)` |
| Header | RequestHeaderKeys | Equals | `X-Scanner` | Header: `{"X-Scanner": "test"}` | `X-scanner` |
| Header | RequestHeaderKeys | EqualsAny | N/A | Header: `{"X-Scanner": "test", "x-ratproxy-loop": "value"}` | `X-Scanner` and `x-ratproxy-loop` |
| Header | RequestHeaderNames | Equals | `head1` | Header: `{"head1": "X-Scanner"}` | `X-scanner` |
| Header | RequestHeaderNames | EqualsAny | N/A | Header: `{"head1": "myvar=1234", "User-Agent": "(hydra)"}` | `myvar=1234` and `(hydra)` |
| Header | RequestHeaderValues | Equals | `head1` | Header: `{"head1": "X-Scanner"}` | `X-scanner` |
| Header | RequestHeaderValues | EqualsAny | N/A | Header: `{"head1": "myvar=1234", "User-Agent": "(hydra)"}` | `myvar=1234` and `(hydra)` |
| Cookie | RequestCookieKeys | Contains | `/etc/passwd` | Header: `{"Cookie": "/etc/passwdtest=hello1"}` | `/etc/passwdtest` |
| Cookie | RequestCookieKeys | EqualsAny | N/A | Header: `{"Cookie": "/etc/passwdtest=hello1", "Cookie": ".htaccess=test1"}` | `/etc/passwdtest` and `.htaccess` |
| Cookie | RequestCookieNames | Equals | `arg1` | Header: `{"Cookie": "arg1=/etc/passwd"}` | `/etc/passwd` |
| Cookie | RequestCookieNames | EqualsAny | N/A | Header: `{"Cookie": "arg1=/etc/passwd", "Cookie": "arg1=.cshrc"}` | `/etc/passwd` and `.cshrc` |
| Cookie | RequestCookieValues | Equals | `arg1` | Header: `{"Cookie": "arg1=/etc/passwd"}` | `/etc/passwd` |
| Cookie | RequestCookieValues | EqualsAny | N/A | Header: `{"Cookie": "arg1=/etc/passwd", "Cookie": "arg1=.cshrc"}` | `/etc/passwd` and `.cshrc` |

> [!NOTE]
> If you create an exclusion using the selectorMatchOperator `EqualsAny`, anything you put in the selector field gets converted to "*" by the backend when the exclusion is created.

## Exclusion scopes

Exclusions can be configured to apply to a specific set of WAF rules, to rulesets, or globally across all rules.

> [!TIP]
> It's a good practice to make exclusions as narrow and specific as possible, to avoid accidentally leaving room for attackers to exploit your system. When you need to add an exclusion rule, use per-rule exclusions wherever possible.

### Per-rule exclusions

You can configure an exclusion for a specific rule, group of rules, or rule set. You must specify the rule or rules that the exclusion applies to. You also need to specify the request attribute that should be excluded from the WAF evaluation. To exclude a complete group of rules, only provide the `ruleGroupName` parameter, the `rules` parameter is only useful when you want to limit the exclusion to specific rules of a group.

Per-rule exclusions are available when you use the OWASP (CRS) ruleset version 3.2 or later or Bot Manager ruleset version 1.0 or later.

#### Example

Suppose you want the WAF to ignore the value of the `User-Agent` request header. The `User-Agent` header contains a characteristic string that allows the network protocol peers to identify the application type, operating system, software vendor, or software version of the requesting software user agent. For more information, see [User-Agent](https://developer.mozilla.org/docs/Web/HTTP/Headers/User-Agent).

There can be any number of reasons to disable evaluating this header. There could be a string that the WAF detects and assumes it’s malicious. For example, the `User-Agent` header might include the classic SQL injection attack `x=x` in a string. In some cases, this can be legitimate traffic. So you might need to exclude this header from WAF evaluation.

You can use the following approaches to exclude the `User-Agent` header from evaluation by all of the SQL injection rules:

# [Azure portal](#tab/portal)

To configure a per-rule exclusion by using the Azure portal, follow these steps:

1. Navigate to the WAF policy, and select **Managed rules**.

1. Select **Add exclusions**.

   :::image type="content" source="../media/application-gateway-waf-configuration/waf-policy-exclusions-rule-add.png" alt-text="Screenshot of the Azure portal that shows how to add a new per-rule exclusion for the W A F policy.":::

1. In **Applies to**, select the CRS ruleset to apply the exclusion to, such as **OWASP_3.2**.

   :::image type="content" source="../media/application-gateway-waf-configuration/waf-policy-exclusions-rule-edit.png" alt-text="Screenshot of the Azure portal that shows the per-rule exclusion configuration for the W A F policy.":::

1. Select **Add rules**, and select the rules you want to apply exclusions to.

1. Configure the match variable, operator, and selector. Then select **Save**.

You can configure multiple exclusions.

# [Azure PowerShell](#tab/powershell)

```azurepowershell
$ruleGroupEntry = New-AzApplicationGatewayFirewallPolicyExclusionManagedRuleGroup `
  -RuleGroupName 'REQUEST-942-APPLICATION-ATTACK-SQLI'

$exclusionManagedRuleSet = New-AzApplicationGatewayFirewallPolicyExclusionManagedRuleSet `
  -RuleSetType 'OWASP' `
  -RuleSetVersion '3.2' `
  -RuleGroup $ruleGroupEntry

$exclusionEntry = New-AzApplicationGatewayFirewallPolicyExclusion `
  -MatchVariable "RequestHeaderValues" `
  -SelectorMatchOperator 'Equals' `
  -Selector 'User-Agent' `
  -ExclusionManagedRuleSet $exclusionManagedRuleSet

$wafPolicy = Get-AzApplicationGatewayFirewallPolicy `
  -Name $wafPolicyName `
  -ResourceGroupName $resourceGroupName
$wafPolicy.ManagedRules[0].Exclusions.Add($exclusionEntry)
$wafPolicy | Set-AzApplicationGatewayFirewallPolicy
```

# [Azure CLI](#tab/cli)

```azurecli
az network application-gateway waf-policy managed-rule exclusion rule-set add \
  --resource-group $resourceGroupName \
  --policy-name $wafPolicyName \
  --type OWASP \
  --version 3.2 \
  --group-name 'REQUEST-942-APPLICATION-ATTACK-SQLI' \
  --match-variable 'RequestHeaderValues' \
  --match-operator 'Equals' \
  --selector 'User-Agent'
```

# [Bicep](#tab/bicep)

```bicep
resource wafPolicy 'Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies@2021-08-01' = {
  name: wafPolicyName
  location: location
  properties: {
    managedRules: {
      managedRuleSets: [
        {
          ruleSetType: 'OWASP'
          ruleSetVersion: '3.2'
        }
      ]
      exclusions: [
        {
          matchVariable: 'RequestHeaderValues'
          selectorMatchOperator: 'Equals'
          selector: 'User-Agent'
          exclusionManagedRuleSets: [
            {
              ruleSetType: 'OWASP'
              ruleSetVersion: '3.2'
              ruleGroups: [
                {
                  ruleGroupName: 'REQUEST-942-APPLICATION-ATTACK-SQLI'
                  rules: [
                    {
                      ruleId: '942150'
                    }
                    {
                      ruleId: '942410'
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

# [ARM template](#tab/armtemplate)

```json
{
  "type": "Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies",
  "apiVersion": "2021-08-01",
  "name": "[parameters('wafPolicyName')]",
  "location": "[parameters('location')]",
  "properties": {
    "managedRules": {
      "managedRuleSets": [
        {
          "ruleSetType": "OWASP",
          "ruleSetVersion": "3.2"
        }
      ],
      "exclusions": [
        {
          "matchVariable": "RequestHeaderValues",
          "selectorMatchOperator": "Equals",
          "selector": "User-Agent",
          "exclusionManagedRuleSets": [
            {
              "ruleSetType": "OWASP",
              "ruleSetVersion": "3.2",
              "ruleGroups": [
                {
                  "ruleGroupName": "REQUEST-942-APPLICATION-ATTACK-SQLI",
                  "rules": [
                    {
                      "ruleId": "942150"
                    },
                    {
                      "ruleId": "942410"
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


---

You can also exclude the `User-Agent` header from evaluation just by rule 942270:

# [Azure portal](#tab/portal)

Follow the steps described in the preceding example, and select rule 942270 in step 4.

# [Azure PowerShell](#tab/powershell)

```azurepowershell
$ruleEntry = New-AzApplicationGatewayFirewallPolicyExclusionManagedRule `
  -Rule '942270'

$ruleGroupEntry = New-AzApplicationGatewayFirewallPolicyExclusionManagedRuleGroup `
  -RuleGroupName 'REQUEST-942-APPLICATION-ATTACK-SQLI' `
  -Rule $ruleEntry

$exclusionManagedRuleSet = New-AzApplicationGatewayFirewallPolicyExclusionManagedRuleSet `
  -RuleSetType 'OWASP' `
  -RuleSetVersion '3.2' `
  -RuleGroup $ruleGroupEntry

$exclusionEntry = New-AzApplicationGatewayFirewallPolicyExclusion `
  -MatchVariable "RequestHeaderValues" `
  -SelectorMatchOperator 'Equals' `
  -Selector 'User-Agent' `
  -ExclusionManagedRuleSet $exclusionManagedRuleSet

$wafPolicy = Get-AzApplicationGatewayFirewallPolicy `
  -Name $wafPolicyName `
  -ResourceGroupName $resourceGroupName
$wafPolicy.ManagedRules[0].Exclusions.Add($exclusionEntry)
$wafPolicy | Set-AzApplicationGatewayFirewallPolicy
```

# [Azure CLI](#tab/cli)

```azurecli
az network application-gateway waf-policy managed-rule exclusion rule-set add \
  --resource-group $resourceGroupName \
  --policy-name $wafPolicyName \
  --type OWASP \
  --version 3.2 \
  --group-name 'REQUEST-942-APPLICATION-ATTACK-SQLI' \
  --rule-ids 942270 \
  --match-variable 'RequestHeaderValues' \
  --match-operator 'Equals' \
  --selector 'User-Agent'
```

# [Bicep](#tab/bicep)

```bicep
resource wafPolicy 'Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies@2021-08-01' = {
  name: wafPolicyName
  location: location
  properties: {
    managedRules: {
      managedRuleSets: [
        {
          ruleSetType: 'OWASP'
          ruleSetVersion: '3.2'
        }
      ]
      exclusions: [
        {
          matchVariable: 'RequestHeaderValues'
          selectorMatchOperator: 'Equals'
          selector: 'User-Agent'
          exclusionManagedRuleSets: [
            {
              ruleSetType: 'OWASP'
              ruleSetVersion: '3.2'
              ruleGroups: [
                {
                  ruleGroupName: 'REQUEST-942-APPLICATION-ATTACK-SQLI'
                  rules: [
                    {
                      ruleId: '942270'
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

# [ARM template](#tab/armtemplate)

```json
{
  "type": "Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies",
  "apiVersion": "2021-08-01",
  "name": "[parameters('wafPolicyName')]",
  "location": "[parameters('location')]",
  "properties": {
    "managedRules": {
      "managedRuleSets": [
        {
          "ruleSetType": "OWASP",
          "ruleSetVersion": "3.2"
        }
      ],
      "exclusions": [
        {
          "matchVariable": "RequestHeaderValues",
          "selectorMatchOperator": "Equals",
          "selector": "User-Agent",
          "exclusionManagedRuleSets": [
            {
              "ruleSetType": "OWASP",
              "ruleSetVersion": "3.2",
              "ruleGroups": [
                {
                  "ruleGroupName": "REQUEST-942-APPLICATION-ATTACK-SQLI",
                  "rules": [
                    {
                      "ruleId": "942270"
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


---

### Global exclusions

You can configure an exclusion to apply across all WAF rules.

#### Example

Suppose you want to exclude the value in the *user* parameter that is passed in the request via the URL. For example, say it’s common in your environment for the `user` query string argument to contain a string that the WAF views as malicious content, so it blocks it. You can exclude all query string arguments where the name begins with the word `user`, so that the WAF doesn't evaluate the field's value.

The following example shows how you can exclude the `user` query string argument from evaluation:

# [Azure portal](#tab/portal)

To configure a global exclusion by using the Azure portal, follow these steps:

1. Navigate to the WAF policy, and select **Managed rules**.

1. Select **Add exclusions**.

   :::image type="content" source="../media/application-gateway-waf-configuration/waf-policy-exclusions-rule-add.png" alt-text="Screenshot of the Azure portal that shows how to add a new global exclusion for the W A F policy.":::

1. In **Applies to**, select **Global**

   :::image type="content" source="../media/application-gateway-waf-configuration/waf-policy-exclusions-global-edit.png" alt-text="Screenshot of the Azure portal that shows the global exclusion configuration for the W A F policy.":::

1. Configure the match variable, operator, and selector. Then select **Save**.

You can configure multiple exclusions.

# [Azure PowerShell](#tab/powershell)

```azurepowershell
$exclusion = New-AzApplicationGatewayFirewallExclusionConfig `
   -MatchVariable 'RequestArgNames' `
   -SelectorMatchOperator 'StartsWith' `
   -Selector 'user'
```

# [Azure CLI](#tab/cli)

```azurecli
az network application-gateway waf-policy managed-rule exclusion add \
  --resource-group $resourceGroupName \
  --policy-name $wafPolicyName \
  --match-variable 'RequestArgNames' \
  --selector-match-operator 'StartsWith' \
  --selector 'user'
```

# [Bicep](#tab/bicep)

```bicep
resource wafPolicy 'Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies@2021-08-01' = {
  name: wafPolicyName
  location: location
  properties: {
    managedRules: {
      managedRuleSets: [
        {
          ruleSetType: 'OWASP'
          ruleSetVersion: '3.2'
        }
      ]
      exclusions: [
        {
          matchVariable: 'RequestArgNames'
          selectorMatchOperator: 'StartsWith'
          selector: 'user'
        }
      ]
    }
  }
}
```

# [ARM template](#tab/armtemplate)

```json
{
  "type": "Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies",
  "apiVersion": "2021-08-01",
  "name": "[parameters('wafPolicyName')]",
  "location": "[parameters('location')]",
  "properties": {
    "managedRules": {
      "managedRuleSets": [
        {
          "ruleSetType": "OWASP",
          "ruleSetVersion": "3.2"
        }
      ],
      "exclusions": [
        {
          "matchVariable": "RequestArgNames",
          "selectorMatchOperator": "StartsWith",
          "selector": "user"
        }
      ]
    }
  }
}
```


---

So if the URL `http://www.contoso.com/?user%3c%3e=joe` is scanned by the WAF, it won't evaluate the string **joe**, but it still evaluates the parameter name **user%3c%3e**. 

## Next steps

- After you configure your WAF settings, you can learn how to view your WAF logs. For more information, see [Application Gateway diagnostics](../../application-gateway/application-gateway-diagnostics.md#diagnostic-logging).
- [Learn more about Azure network security](../../networking/security/index.yml)
