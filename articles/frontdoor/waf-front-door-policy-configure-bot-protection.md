---
title: Configure bot protection for web application firewall with Azure Front Door (Preview)
description: Learn web application firewall (WAF).
services: frontdoor
author: KumudD
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/31/2019
ms.author: kumud
ms.reviewer: tyao
---

# Configure bot protection for web application firewall (Preview)
This article shows you how to configure bot protection rule in Azure web application firewall (WAF) for Front Door by using Azure CLI, Azure PowerShell, or Azure Resource Manager template.

A managed Bot protection rule set can be enabled for your WAF to take custom actions on requests from known malicious IP addresses. The IP addresses are sourced from the Microsoft Threat Intelligence feed. [Intelligent Security Graph](https://www.microsoft.com/security/operations/intelligence) powers Microsoft threat intelligence and is used by multiple services including Azure Security Center.

> [!IMPORTANT]
> Bot protection rule set is currently in public preview and is provided with a preview service level agreement. Certain features may not be supported or may have constrained capabilities.  See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.

## Prerequisites

Create a basic WAF policy for Front Door by following the instructions described in [Create a WAF policy for Azure Front Door by using the Azure portal](waf-front-door-create-portal.md).

## Enable bot protection rule set

1. In the basic policy page that you created in the preceding section, under **Settings**, click **Rules**.
2. In the details page, under the **Manage rules** section, from the drop-down menu, select the check box in front of the rule **BotProtection-preview-0.1**, and then select **Save** above.
    
   ![Bot protection rule](./media/waf-front-door-configure-bot-protection/botprotect2.png)

## Next steps

- Learn how to [monitor WAF](waf-front-door-monitor.md).
