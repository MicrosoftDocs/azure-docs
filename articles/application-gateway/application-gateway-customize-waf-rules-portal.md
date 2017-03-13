---
title: Customize Web Application Firewall rules in Azure Application Gateway - Portal | Microsoft Docs
description: This page provides information on how to customize Web Application Firewall rules in Application Gateway with the portal.
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
ms.date: 03/08/2017
ms.author: gwallace

---

# Customize Web Application Firewall rules through the portal

Application Gateway Web Application Firewall provides protection for web applications. These protections are provided by OWASP CRS rulesets. Some rules can cause false positives and block unnecessary traffic.  For this reason application gateway provides the capability to disable rulegroups and rules on a web application firewall enabled application gateway.

## View rule groups and rules

Navigate to an application gateway and select **Web application firewall**.  Click **Configure disabled rules**.  This will shown a table on the page of all the rule groups provided with the rule set chosen.

![configure disabled rules][1]

## Search for rules to disable

The web application firewall settings blade provides the capability to filter the rules by a text search. The results will display only rule groups and rules that contain the text that is being searched for.

![search for rules][2]

## Disable rulegroups and rules

When disabling rules you can disable an entire rule group, or specific rules under one or more rule groups.  Once the rules that you want to disable are selected, click **Save**.  This will save the changes to the application gateway.

![save changes][3]

[1]: ./media/application-gateway-customize-waf-rules-portal/figure1.png
[2]: ./media/application-gateway-customize-waf-rules-portal/figure2.png
[3]: ./media/application-gateway-customize-waf-rules-portal/figure3.png