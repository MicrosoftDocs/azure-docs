---
title: IP restriction rule for Azure web application firewall
description: This article describes IP restriction rules for web application firewall policy
services: frontdoor
documentationcenter: ''
author: KumudD
manager: twooley
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/24/2019
ms.author: kumud;tyao

---

# IP restriction rules in Azure web application firewall

> [!IMPORTANT]
> The WAF IP restriction feature for Azure Front Door is currently in public preview. This preview version is provided without a Service Level Agreement, and it is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can configure a WAF policy and associate that policy to one or more Front Door front-ends for protection. A WAF policy consists of two types of security rules: (1) custom rules, authored by the customer, and (2) managed rulesets, a collection of Azure-managed pre-configured set of rules. When both are present, custom rules are executed before executing rules in a managed rule set. A custom rule is made of a match condition, a priority, and an action. Action types supported are: ALLOW, BLOCK, LOG, and REDIRECT. You can create a fully customized policy that meets your specific application protection requirements by combining managed and custom rules.

An IP address based access control rule is a custom WAF rule that allows you to control access to your web applications by specifying a list of IP addresses or IP address ranges in Classless Inter-Domain Routing (CIDR) form.

##  IP allow rule

By default, your web application is accessible from internet. If you want to limit access to your web applications only to clients from a list of known IP addresses or IP address ranges, you need to create two IP matching rules. First IP matching rule contains the list of IP addresses as matching values and set the action to "ALLOW". The second one with lower priority, is to block all other IP addresses by using the "All" operator and set the action to "BLOCK". Once an IP restriction rule is applied, any requests originating from addresses outside this allowed list receives a 403 (Forbidden) response.

## IP block rule

IP block list is often used to block access to your web applications from a list of known bad actors. You need to provide the list of IP addresses or IP address ranges as the match values to your IP match rule and set the action to “BLOCK”. Once this IP restriction rule is applied, any requests originating from addresses in this blocked list receives a 403 (Forbidden) response.

## Next steps

- Learn how to [configure WAF IP restriction rules for Front Door end-points](waf-front-door-configure-ip-restriction.md).

