---
title: Customize rules using portal - Azure Web Application Firewall
description: This article provides information on how to customize Web Application Firewall rules in Application Gateway with the Azure portal.
services: web-application-firewall
author: vhorne
ms.service: web-application-firewall
ms.date: 11/14/2019
ms.author: victorh
ms.topic: article
---

# Customize Web Application Firewall rules using the Azure portal

The Azure Application Gateway Web Application Firewall (WAF) provides protection for web applications. These protections are provided by the Open Web Application Security Project (OWASP) Core Rule Set (CRS). Some rules can cause false positives and block real traffic. For this reason, Application Gateway provides the capability to customize rule groups and rules. For more information on the specific rule groups and rules, see [List of Web Application Firewall CRS rule groups and rules](application-gateway-crs-rulegroups-rules.md).

>[!NOTE]
> If your application gateway is not using the WAF tier, the option to upgrade the application gateway to the WAF tier appears in the right pane. 

![Enable WAF][fig1]

## View rule groups and rules

**To view rule groups and rules**
1. Browse to the application gateway, and then select **Web application firewall**.  
2. Select your **WAF Policy**.
2. Select **Managed Rules**.

   This view shows a table on the page of all the rule groups provided with the chosen rule set. All of the rule's check boxes are selected.

## Disable rule groups and rules

> [!IMPORTANT]
> Use caution when disabling any rule groups or rules. This may expose you to increased security risks.

When you're disabling rules, you can disable an entire rule group or specific rules under one or more rule groups. 

**To disable rule groups or specific rules**

   1. Search for the rules or rule groups that you want to disable.
   2. Select the check boxes for the rules that you want to disable. 
   3. Select the action at the top of the page (enable/disable) for the selected rules.
   2. Select **Save**. 

![Save changes][3]

## Mandatory rules

The following list contains conditions that cause the WAF to block the request while in Prevention Mode. In Detection Mode, they're logged as exceptions.

These can't be configured or disabled:

* Failure to parse the request body results in the request being blocked, unless body inspection is turned off (XML, JSON, form data)
* Request body (with no files) data length is larger than the configured limit
* Request body (including files) is larger than the limit
* An internal error happened in the WAF engine

CRS 3.x specific:

* Inbound anomaly score exceeded threshold

## Next steps

After you configure your disabled rules, you can learn how to view your WAF logs. For more information, see [Application Gateway diagnostics](../../application-gateway/application-gateway-diagnostics.md#diagnostic-logging).

[fig1]: ../media/application-gateway-customize-waf-rules-portal/1.png
[3]: ../media/application-gateway-customize-waf-rules-portal/figure3.png
