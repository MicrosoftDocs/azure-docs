---
title: Bot Protection for web application firewall with Azure Front Door (Preview)
description: Learn web application firewall (WAF).
services: frontdoor
author: KumudD
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/31/2019
ms.author: tyao;kumud

---

## Bot protection (Public Preview)

A managed Bot protection rule set can be enabled for your WAF to take custom actions on requests from known malicious IP addresses. The IP addresses are sourced from the Microsoft Threat Intelligence feed. [Intelligent Security Graph](https://www.microsoft.com/security/operations/intelligence) powers Microsoft threat intelligence and is used by multiple services including Azure Security Center.

![Bot Protection Rule Set](./media/waf-front-door-bot-protection/BotProtect.png)

> [!IMPORTANT]
> Bot protection rule set is currently in public preview and is provided with a preview service level agreement. Certain features may not be supported or may have constrained capabilities.  See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.

If Bot Protection is enabled, incoming requests that match Malicious Bots client IPs are logged at FrontdoorWebApplicationFirewallLog log. You may access WAF logs from storage account, event hub or log analytics. 

## Next steps

- Learn how to [monitor](waf-front-door-monitor.md) WAF.
