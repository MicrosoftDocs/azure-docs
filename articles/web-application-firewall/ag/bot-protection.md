---
title: Configure bot protection for Azure Web Application Firewall (WAF)
description: Learn how to configure bot protection for Web Application Firewall (WAF) on Azure Application Gateway.
services: web-application-firewall
ms.topic: article
author: vhorne
ms.service: web-application-firewall
ms.date: 06/01/2023
ms.author: victorh
---

# Configure bot protection for Web Application Firewall on Azure Application Gateway

This article shows you how to configure a bot protection rule in Azure Web Application Firewall (WAF) for Application Gateway  using the Azure portal. 

You can enable a managed bot protection rule set for your WAF to block or log requests from known malicious IP addresses. The IP addresses are sourced from the Microsoft Threat Intelligence feed. Intelligent Security Graph powers Microsoft threat intelligence and is used by multiple services including Microsoft Defender for Cloud.

## Prerequisites

Create a WAF policy for Application Gateway by following the instructions described in [Create Web Application Firewall policies for Application Gateway](create-waf-policy-ag.md).

## Enable bot protection rule set

1. In the Application Gateway WAF policy that you created previously, under **Settings**, select **Managed Rules**.

2. Select **Assign**.
1. On the **Assign managed rule sets** page, under **Additional rule set**, select the desired Bot Manager rule set.
1. Select **Save**.

:::image type="content" source="../media/bot-protection/managed-rule-sets.png" alt-text="Screenshot show WAF managed rule sets.":::


## Next steps

For more information about the Bot Manager rule set, see [Web Application Firewall CRS rule groups and rules](application-gateway-crs-rulegroups-rules.md?tabs=bot).