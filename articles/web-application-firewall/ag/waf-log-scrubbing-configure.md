---
title: Configure Azure Web Application Firewall log scrubbing
description: Learn how to configure Azure Web Application Firewall log scrubbing
author: vhorne
ms.author: victorh
ms.service: web-application-firewall
ms.topic: how-to
ms.date: 06/08/2023
---

# Configure Azure Web Application Firewall log scrubbing

Log scrubbing is a tool that helps you remove sensitive information from your logs. It works by using a rules engine that allows you to build custom rules to identify specific portions of a request that are sensitive. Once identified, the tool scrubs that information from your logs and replaces it with _*******_.

The following table shows examples of sensitive data that can be scrubbed from your logs:

| Match Variable | Operator | Selector | What gets scrubbed |
| --- | --- | --- | --- |
| Request Header Names | Equals | X-Forwarded-For | REQUEST_HEADERS:x-forwarded-for.","data":"******" |
| Request Cookie Names | Equals | cookie1 | "Matched Data: ****** found within REQUEST_COOKIES:cookie1: ******" |
| Request Arg Names | Equals | arg1 | "requestUri":"\/?arg1=******" |
| Request Post Arg Names | Equals | Post1 | "data":"Matched Data: ****** found within ARGS:post1: ******" |
| Request JSON Arg Names | Equals | Jsonarg | "data":"Matched Data: ****** found within ARGS:jsonarg: ******" |
| Request IP Address* | Equals Any | NULL | "clientIp":"******" |

\* Request IP Address log scrubbing rules only support the *equals any* operator and scrubs all instances of the requestor's IP address that appears in the WAF logs.

For more information, see [What is Azure Web Application Firewall log scrubbing?](waf-log-scrubbing.md)

## Enable log scrubbing

Use the following information to enable and configure log scrubbing.

#### [Portal](#tab/browser)

To enable log scrubbing:

1. Open an existing Application Gateway WAF policy.
1. Under **Settings**, select **Log scrubbing rules**.
1. On the **Log scrubbing rules** page, select **Enable log scrubbing**.

To configure log scrubbing rules:

1. Under **Log scrubbing rules**, select a **Match variable**.
1. Select an **Operator** (if applicable).
1. Type a **Selector** (if applicable).
1. Select **Save**.

Repeat to add more rules.

#### [PowerShell](#tab/powershell)

Use the following Azure PowerShell commands to enable and configure log scrubbing:

```azurepowershell
$logScrubbingRule1 = New-AzApplicationGatewayFirewallPolicyLogScrubbingRule `
  -State Enabled -MatchVariable RequestArgNames `
  -SelectorMatchOperator Equals -Selector test

$logScrubbingRuleConfig = New-AzApplicationGatewayFirewallPolicyLogScrubbingConfiguration `
  -State Enabled -ScrubbingRule $logScrubbingRule1
```
#### [CLI](#tab/cli)

The Azure CLI commands to enable and configure log scrubbing are coming soon.



---

## Verify log scrubbing

To verify your log scrubbing rules, open the firewall log and search for _******_ in place of the sensitive fields.

## Next steps

- [Use Log Analytics to examine Application Gateway Web Application Firewall (WAF) logs](../ag/log-analytics.md)
