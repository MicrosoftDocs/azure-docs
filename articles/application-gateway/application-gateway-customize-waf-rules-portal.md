---
title: Customize web application firewall rules in Azure Application Gateway - Azure portal | Microsoft Docs
description: This article provides information on how to customize web application firewall rules in Application Gateway with the Azure portal.
documentationcenter: na
services: application-gateway
author: vhorne
manager: jpconnock
editor: tysonn

ms.assetid: 1159500b-17ba-41e7-88d6-b96986795084
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.custom:
ms.workload: infrastructure-services
ms.date: 03/28/2017
ms.author: victorh

---

# Customize web application firewall rules through the Azure portal

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-customize-waf-rules-portal.md)
> * [PowerShell](application-gateway-customize-waf-rules-powershell.md)
> * [Azure CLI](application-gateway-customize-waf-rules-cli.md)

The Azure Application Gateway web application firewall (WAF) provides protection for web applications. These protections are provided by the Open Web Application Security Project (OWASP) Core Rule Set (CRS). Some rules can cause false positives and block real traffic. For this reason, Application Gateway provides the capability to customize rule groups and rules. For more information on the specific rule groups and rules, see [List of web application firewall CRS rule groups and rules](application-gateway-crs-rulegroups-rules.md).

>[!NOTE]
> If your application gateway is not using the WAF tier, the option to upgrade the application gateway to the WAF tier appears in the right pane. 

![Enable WAF][fig1]

## View rule groups and rules

**To view rule groups and rules**
   1. Browse to the application gateway, and then select **Web application firewall**.  
   2. Select **Advanced rule configuration**.  
   This view shows a table on the page of all the rule groups provided with the chosen rule set. All of the rule's check boxes are selected.

![Configure disabled rules][1]

## Search for rules to disable

The **Web application firewall settings** blade provides the capability to filter the rules through a text search. The result displays only the rule groups and rules that contain the text you searched for.

![Search for rules][2]

## Disable rule groups and rules

When your're disabling rules, you can disable an entire rule group or specific rules under one or more rule groups. 

**To disable rule groups or specific rules**

   1. Search for the rules or rule groups that you want to disable.
   2. Clear the check boxes for the rules that you want to disable. 
   2. Select **Save**. 

![Save changes][3]

## Next steps

After you configure your disabled rules, you can learn how to view your WAF logs. For more information, see [Application Gateway diagnostics](application-gateway-diagnostics.md#diagnostic-logging).

[fig1]: ./media/application-gateway-customize-waf-rules-portal/1.png
[1]: ./media/application-gateway-customize-waf-rules-portal/figure1.png
[2]: ./media/application-gateway-customize-waf-rules-portal/figure2.png
[3]: ./media/application-gateway-customize-waf-rules-portal/figure3.png
