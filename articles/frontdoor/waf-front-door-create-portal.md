---
title: 'Quickstart: Create a web application firewall policy for Azure Front Door by using the Azure portal'
titlesuffix: Azure web application firewall
description: This how to guide shows how to create a web application firewall (WAF) policy by using the Azure portal.
services: frontdoor
documentationcenter: na
author: KumudD
manager: twooley
Customer intent: I want to create a WAF policy for my Front Door front-ends 
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/3/2019
ms.author: kumud, tyao
ms.custom: seodec18
---

# Create a WAF policy for Azure Front Door by using the Azure portal

This article describes how to create a basic Azure web application firewall (WAF) policy and apply it to a front-end host at Azure Front Door.

## Prerequisites

Create a Front Door profile by following the instructions described in [Quickstart: Create a Front Door profile](quickstart-create-front-door.md). 

## Create a WAF policy

First, create a basic WAF policy with managed Default Rule Set (DRS) by using the portal. 

1. On the top left-hand side of the screen, click **Create a resource** >
**search for "WAF"**> **select: Web application firewall policies (Preview)** > .
2. In the **Basics** tab of the **Create a WAF policy** page, enter or select the following information, accept the defaults for the remaining settings, and then select **Review + create**:

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Subscription               | Select your front door subscription name|
    | Resource group         | Select your front door resource group or create new in the text box.|
    | Resource location                | auto populated for your Resource Group  |
    | Policy Name                               |Enter *yourpolicyname*|
    | Policy for                              |Front Door is auto-populated |
    | Policy state                              |Enabled|

3. In the **Review + create** tab, click **Create**
   ![Create a WAF policy](.\media\waf-front-door-create-portal\basic.png)

## Association

Next, associate created WAF policy to your front-end host.
In the **Association** tab of the **Create a WAF policy** page, select **Add frontend host**:

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Front door                | Select your front door subscription name|
    | Frontend host       | Select *MyResourceGroupFD1* in the text box.|

## Rules (optional)

### Change mode

When you create a WAF policy, by Default WAF is in "Detection" mode.
In Detection mode, WAF does not block any requests, instead, requests matching WAF rules are logged at WAF logs.
You may change the mode setting from "Detection" to "Prevention" to see WAF in action. In "Prevention" mode, requests that match rules defined in Default Ruse Set (DRS) are blocked and logged at WAF logs.

 ![Change WAF policy mode](.\media\waf-front-door-create-portal\policy.png)

### Default Rule Set (DRS)

Azure managed Default Rule Set is enabled by default. To disable an individual rule within a rule group, **expand** the rules within that rule group,  click the **check box** in front of the rule number and click on **Disable** tab above. To change actions types for individual rules within the rule set, click the check box in front of the rule number and click on **Change action** tab above.

 ![Change WAF Rule Set](.\media\waf-front-door-create-portal\\managed.png)

### Custom rules

You may create custom rules to allow access to your web application for requests that may otherwise match a pre-configured rule. Follow (waf-frontdoor-custom-ps.md) guide to configure custom rules.

## Next steps

- Learn about [ Azure web application firewall](waf-overview.md).
- Learn more about [Azure Front Door](front-door-overview.md).




