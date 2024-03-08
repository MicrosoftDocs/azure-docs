---
title: How to mask sensitive data on Azure Web Application Firewall
description: Learn how to mask sensitive data on Azure Web Application Firewall
author: vhorne
ms.author: victorh
ms.service: web-application-firewall
ms.topic: how-to
ms.date: 09/05/2023
---

# How to mask sensitive data on Azure Web Application Firewall

The Web Application Firewall's (WAF's) Log Scrubbing tool helps you remove sensitive data from your WAF logs. It works by using a rules engine that allows you to build custom rules to identify specific portions of a request that contain sensitive data. Once identified, the tool scrubs that information from your logs and replaces it with _*******_.

The following table shows examples of log scrubbing rules that can be used to protect your sensitive data:

| Match Variable | Operator | Selector | What gets scrubbed |
| --- | --- | --- | --- |
| Request Header Names | Equals | X-Forwarded-For | REQUEST_HEADERS:x-forwarded-for.","data":"******" |
| Request Cookie Names | Equals | cookie1 | "Matched Data: ****** found within REQUEST_COOKIES:cookie1: ******" |
| Request Arg Names | Equals | arg1 | "requestUri":"\/?arg1=******" |
| Request Post Arg Names | Equals | Post1 | "data":"Matched Data: ****** found within ARGS:post1: ******" |
| Request JSON Arg Names | Equals | Jsonarg | "data":"Matched Data: ****** found within ARGS:jsonarg: ******" |
| Request IP Address* | Equals Any | NULL | "clientIp":"******" |

\* Request IP Address rules only support the *equals any* operator and scrubs all instances of the requestor's IP address that appears in the WAF logs.

For more information, see [What is Azure Web Application Firewall Sensitive Data Protection?](waf-sensitive-data-protection.md)

## Enable Sensitive Data Protection

Use the following information to enable and configure Sensitive Data Protection.

#### [Portal](#tab/browser)

To enable Sensitive Data Protection:

1. Open an existing Application Gateway WAF policy.
1. Under **Settings**, select **Sensitive data**.
1. On the **Sensitive data** page, select **Enable log scrubbing**.

To configure Log Scrubbing rules for Sensitive Data Protection:

1. Under **Log scrubbing rules**, select a **Match variable**.
1. Select an **Operator** (if applicable).
1. Type a **Selector** (if applicable).
1. Select **Save**.

Repeat to add more rules.

#### [PowerShell](#tab/powershell)

Use the following Azure PowerShell commands to [create](/powershell/module/az.network/new-azapplicationgatewayfirewallpolicylogscrubbingrule) and [configure](/powershell/module/az.network/new-azapplicationgatewayfirewallpolicylogscrubbingconfiguration) Log Scrubbing rules for Sensitive Data Protection:

```azurepowershell
$logScrubbingRule1 = New-AzApplicationGatewayFirewallPolicyLogScrubbingRule `
  -State <String> -MatchVariable <String> `
  -SelectorMatchOperator <String> -Selector <String>

$logScrubbingRuleConfig = New-AzApplicationGatewayFirewallPolicyLogScrubbingConfiguration `
  -State <String> -ScrubbingRule $logScrubbingRule1
```
#### [CLI](#tab/cli)

Use the following Command Line Interface commands to [create and configure](/cli/azure/network/application-gateway/waf-policy/policy-setting) Log Scrubbing rules for Sensitive Data Protection:

```CLI
az network application-gateway waf-policy policy-setting update -g <MyResourceGroup> --policy-name <MyPolicySetting> --log-scrubbing-state <Enabled/Disabled> --scrubbing-rules "[{state:<Enabled/Disabled>,match-variable:<MatchVariable>,selector-match-operator:<Operator>,selector:<Selector>}]"
```


---

## Verify Sensitive Data Protection

To verify your Sensitive Data Protection rules, open the Application Gateway firewall log and search for _******_ in place of the sensitive fields.

## Next steps

- [Use Log Analytics to examine Application Gateway Web Application Firewall (WAF) logs](../ag/log-analytics.md)
