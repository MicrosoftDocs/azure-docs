---
title: How to mask sensitive data on Azure Web Application Firewall on Azure Front Door
description: Learn how to mask sensitive data on Azure Web Application Firewall on Azure Front Door.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: how-to
ms.date: 06/24/2024
---

# How to mask sensitive data on Azure Web Application Firewall on Azure Front Door

The Web Application Firewall's (WAF) Log Scrubbing tool helps you remove sensitive data from your WAF logs. It works by using a rules engine that allows you to build custom rules to identify specific portions of a request that contain sensitive data. Once identified, the tool scrubs that information from your logs and replaces it with _*******_.

> [!NOTE]
> When you enable the log scrubbing feature, Microsoft still retains IP addresses in our internal logs to support critical security features.

The following table shows examples of log scrubbing rules that can be used to protect your sensitive data:

| Match Variable | Operator | Selector | What gets scrubbed |
| --- | --- | --- | --- |
| Request Header Names | Equals | keytoblock | {"matchVariableName":"HeaderValue:keytoblock","matchVariableValue":"****"} |
| Request Cookie Names | Equals | cookietoblock | {"matchVariableName":"CookieValue:cookietoblock","matchVariableValue":"****"} |
| Request Post Arg Names | Equals | var | {"matchVariableName":"PostParamValue:var","matchVariableValue":"****"} |
| Request Body JSON Arg Names | Equals | JsonValue | {"matchVariableName":"JsonValue:key","matchVariableValue":"****"} |
| Query String Arg Names | Equals | foo | {"matchVariableName":"QueryParamValue:foo","matchVariableValue":"****"} |
| Request IP Address* | Equals Any | NULL | {"matchVariableName":"ClientIP","matchVariableValue":"****"} |
| Request URI | Equals Any | NULL | {"matchVariableName":"URI","matchVariableValue":"****"} |

\* Request IP Address and Request URI rules only support the *equals any* operator and scrubs all instances of the requestor's IP address that appears in the WAF logs.

For more information, see [What is Azure Web Application Firewall on Azure Front Door Sensitive Data Protection?](waf-sensitive-data-protection-frontdoor.md)

## Enable Sensitive Data Protection

Use the following information to enable and configure Sensitive Data Protection.

#### [Portal](#tab/browser)

To enable Sensitive Data Protection:

1. Open an existing Front Door WAF policy.
1. Under **Settings**, select **Sensitive data**.
1. On the **Sensitive data** page, select **Enable log scrubbing**.

To configure Log Scrubbing rules for Sensitive Data Protection:

1. Under **Log scrubbing rules**, select a **Match variable**.
1. Select an **Operator** (if applicable).
1. Type a **Selector** (if applicable).
1. Select **Save**.

Repeat to add more rules.

#### [PowerShell](#tab/powershell)

Use the following Azure PowerShell commands to create and configure Log Scrubbing rules for Sensitive Data Protection:

```azurepowershell
New-AzFrontDoorWafLogScrubbingRuleObject -MatchVariable <String> -SelectorMatchOperator <String>
 -State <String> [-Selector <String>] [-DefaultProfile <IAzureContextContainer>]
 [<CommonParameters>]

New-AzFrontDoorWafLogScrubbingSettingObject -ScrubbingRule <PSFrontDoorWafLogScrubbingRule[]> -State <String>
 [-DefaultProfile <IAzureContextContainer>] [<CommonParameters>]
```

#### [CLI](#tab/cli)

Use the following Command Line Interface commands to [create and configure](/cli/azure/network/front-door/waf-policy) Log Scrubbing rules for Sensitive Data Protection:

```CLI
az network front-door waf-policy update -g <MyResourceGroup> -n <MyPolicyName> --log-scrubbing "{scrubbing-rules:[{match-variable:<MatchVariable>,selector-match-operator:<Operator>}],state:<Enabled/Disabled>}"
```


---

## Verify Sensitive Data Protection

To verify your Sensitive Data Protection rules, open the Front Door firewall log and search for _******_ in place of the sensitive fields.

## Next steps

- [Azure Web Application Firewall monitoring and logging](../afds/waf-front-door-monitor.md)
- [A Closer Look at Azure WAF’s Data Masking Capabilities for Azure Front Door](https://techcommunity.microsoft.com/t5/azure-network-security-blog/a-closer-look-at-azure-waf-s-data-masking-capabilities-for-azure/ba-p/4167558)

