---
title: Customize web application firewall rules in Azure Application Gateway - Portal | Microsoft Docs
description: This page provides information on how to customize web application firewall rules in Application Gateway with the portal.
documentationcenter: na
services: application-gateway
author: georgewallace
manager: timlt
editor: tysonn

ms.assetid: 1159500b-17ba-41e7-88d6-b96986795084
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.custom:
ms.workload: infrastructure-services
ms.date: 03/28/2017
ms.author: gwallace

---

# Customize web application firewall rules through the portal

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-customize-waf-rules-portal.md)
> * [Azure CLI 2.0](application-gateway-customize-waf-rules-cli.md)

Application Gateway web application firewall provides protection for web applications. These protections are provided by OWASP CRS rulesets. Some rules can cause false positives and block real traffic.  For this reason application gateway provides the capability to customize rulegroups and rules on a web application firewall enabled application gateway. For more information on the specific rule groups and rules, visit [web application firewall CRS Rule groups and rules](application-gateway-crs-rulegroups-rules.md)

>[!NOTE]
> If your application gateway is not using the WAF tier, you are presented the option to upgrade the application gateway to the WAF tier as shown in the following image:

![enable waf][fig1]

## View rule groups and rules

Navigate to an application gateway and select **Web application firewall**.  Click **Advanced rule configuration**.  This shows a table on the page of all the rule groups provided with the rule set chosen.

![configure disabled rules][1]

## Search for rules to disable

The web application firewall settings blade provides the capability to filter the rules by a text search. The result displays only rule groups and rules that contain the text that is being searched for.

![search for rules][2]

## Disable rule groups and rules

When disabling rules you can disable an entire rule group, or specific rules under one or more rule groups.  Once the rules that you want to disable are unchecked, click **Save**.  This saves the changes to the application gateway.

![save changes][3]

## Next steps

Once you configure your disabled rules, learn how to view your WAF logs by visiting [Application Gateway Diagnostics](application-gateway-diagnostics.md#diagnostic-logging)

[fig1]: ./media/application-gateway-customize-waf-rules-portal/1.png
[1]: ./media/application-gateway-customize-waf-rules-portal/figure1.png
[2]: ./media/application-gateway-customize-waf-rules-portal/figure2.png
[3]: ./media/application-gateway-customize-waf-rules-portal/figure3.png
