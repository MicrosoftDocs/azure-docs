---
title: Troubleshooting the web application firewall for Azure Application Gateway
description: This article provides troubleshooting information for web application firewall (WAF) for Application Gateway
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.date: 4/17/2019
ms.author: ant
ms.topic: conceptual
---

# Troubleshooting web application firewall for Azure Application Gateway

There are a few things you can do if requests that should pass through your WAF  are blocked. 

First, ensure you’ve looked through the [WAF overview](waf-overview.md) and the [WAF configuration](application-gateway-waf-configuration.md) documents. Also, make sure you’ve enabled [WAF monitoring](application-gateway-diagnostics.md) These articles explain how the WAF functions, how the WAF rule sets work, and how to access WAF logs.

## Understanding WAF logs

When you have WAF logs available, you can do a few things with them.

For example, say you have a legitimate traffic containing the string “1=1” that you want to pass through your WAF. If you try the request, the WAF blocks traffic that contains your “1=1” string in any parameter or field. You can look through the logs and see the timestamp of the request and the rules that blocked/matched. In the following example, you can see that we hit four rules during the same request (using the TransactionId field). The first one says it matched because the user used a numeric/IP URL for the request, which increases the anomaly score. The next rule that matched is 942130, which is the one we’re looking for. You can see the **1=1** in the details.data field. This further increases the anomaly score. Generally, every rule that has the action **Matched** increases the anomaly score. For more information, see [Anomaly scoring mode](waf-overview.md#anomaly-scoring-mode).

The final two log entries show that the request was blocked because the anomaly score was high enough. These entries have a different action than the other two. They show that they actually *blocked* the request. These rules are mandatory and can’t be disabled. They shouldn’t be thought of as rules, but more as core infrastructure of <Drew, please complete this sentence>

<Screen shot of log>

With this information, and the knowledge that rule 942130 is the one that matched the “1=1” string, you can do a few things to stop this from blocking your traffic. You can use an Exclusion List, or you can disable this rule. See [WAF configuration](application-gateway-waf-configuration.md#waf-exclusion-lists) for more information about exclusion lists.

## Fixing false positives using an exclusion list

To make an informed decision about handling a false positive, it’s important to familiarize yourself with the technologies your application uses. For example, say there isn't a SQL server in your technology stack, and you are getting false positives related to those rules. Disabling those rules doesn't necessarily weaken your security.

One benefit of using an exclusion list is that only a very specific part of a request is being disabled. However, this means that a specific exclusion is applicable to all traffic passing through your WAF because it is a global setting. For example, this could lead to an issue if **1=1** is a valid request in the body for a certain app, but not for others. Another benefit is that you can choose between body, headers, and cookies to be excluded if a certain condition is met, as opposed to the whole request being excluded.

In this example, you’ll want to exclude the *request attribute name* that equals **text1**. This is apparent because you can see the attribute name in the firewall logs **data: Matched Data: 1=1 found within ARGS:text1: 1=1**. The *attribute* is **text1**. You can also find this attribute name a few other ways, see [Finding request attribute names](#finding-request-attribute-names).

[screenshot of exclusion list]

## Fixing false positives by disabling rules

One benefit of disabling a rule is that if you know all traffic that contains a certain condition that will normally be blocked is actually valid traffic, you can disable that rule for the entirety of your WAF. However, if it’s only real traffic in a specific use case, you open up a vulnerability by disabling that rule for the entirety of your WAF since it is a global setting.

## Finding request attribute names

## Next steps

See [How to configure web application firewall on Application Gateway](tutorial-restrict-web-traffic-powershell.md).
