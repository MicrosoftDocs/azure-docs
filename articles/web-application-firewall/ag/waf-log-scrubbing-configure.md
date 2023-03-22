---
title: Configure Azure Web Application Firewall log scrubbing
description: Learn how to configure Azure Web Application Firewall log scrubbing
author: vhorne
ms.author: victorh
ms.service: web-application-firewall
ms.topic: how-to
ms.date: 03/20/2023
---

# Configure Azure Web Application Firewall log scrubbing

Log scrubbing is a rules engine that allows you to build custom rules to identify specific portions of a request that are sensitive, so you can scrub that information from your logs. The sensitive data is replaced with _*******_. 

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

Repeat to add additional rules.

#### [PowerShell](#tab/powershell)

Use the following Azure PowerShell command to enable and configure log scrubbing:

```azurepowershell
xxxxxx
```
#### [CLI](#tab/cli)

Use the following Azure CLI command to enable and configure log scrubbing:

```azurecli
xxxxxxxx
```

---

## Verify log scrubbing

To verify your log scrubbing rules, open the firewall log and search for _******_ in place of the sensitive fields.

## Next steps

- [Use Log Analytics to examine Application Gateway Web Application Firewall (WAF) logs](../ag/log-analytics.md)
