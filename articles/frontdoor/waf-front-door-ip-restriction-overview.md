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
ms.date: 03/22/2019
ms.author: kumud;tyao

---

# IP restriction rules in Azure web application firewall
Azure web application firewall (WAF) for Azure Front Door stops malicious attacks at Azure network edge, close to the attack sources, far away from your web applications or virtual networks.

> [!IMPORTANT]
> The WAF IP restriction feature for Azure Front Door is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).  

You can configure a WAF policy and associate that policy to one or more Front Door front-ends for protection. A WAF policy may consist of two types of security rules: Azure managed pre-configured rules and customer authored rules. Custom rules are executed before managed rule sets. A rule is made of a match condition, a priority and an action. Action types of allow, block, monitor or redirect are supported. You can create a fully customized policy that meets you specific application protection requirements combining managed and custom rules.

An IP address based access control rule is a custom WAF rule. it allows you to control access to your web applications by specifying a list of IP addresses or IP address ranges in (Classless Inter-Domain Routing) form.

## <a id="ip-access-control-ip-allow-list"></a> IP allow list

IP deny list is often used to block a list of known bad actors.

By default, your web application is accessible from internet. If you want to limit access to your web applications from a list of known IP addresses or IP address ranges only, you need to create two IP matching rules.  First IP matching rule contains the list of IP addresses as matching values and with "Allow" action. The second one with lower priority, is to block all other IP addresses by using operator "All".

Once an IP restriction rule is applied, any requests originating from addresses outside this allowed list receive 403 (Forbidden) response. 

## <a id="ip-access-control-ip-match-rule"></a> IP match rule

By default, your web application is accessible from internet. If you want to limit access to your web applications from a list of known IP addresses or IP address ranges only, you need to create two IP matching rules.  First IP matching rule contains the list of IP addresses as matching values and with "Allow" action. The second one with lower priority, is to block all other IP addresses by using operator "All".


## <a id="ip-access-control-ip-block-list"></a> IP block list

IP block list is often used to block access to your web applications from a list of known bad actors. You need to provide the list of IP addresses or IP address ranges as the match values to your IP match rule. Once IP restriction rule is applied, any requests originating from addresses outside this allowed list receive 403 (Forbidden) response.

## Next steps

- Learn how to [configure WAF IP restriction rules for Front Door end-points](front-door-waf-configure-ip-restriction.md).

