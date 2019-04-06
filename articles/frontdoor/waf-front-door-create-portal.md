---
title: 'Quickstart: Create a web application firewall policy for Azure Front Door by using the Azure portal'
titlesuffix: Azure web application firewall
description: This how to guide shows how to create a web application firewall (WAF) policy by using the Azure portal.
services: frontdoor
documentationcenter: na
author: KumudD
manager: twooley
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

1. On the top left-hand side of the screen, select **Create a resource**>search for **Web application firewall**>select **Web application firewall (Preview)** > select **Create**.
2. In the **Basics** tab of the **Create a WAF policy** page, enter or select the following information, accept the defaults for the remaining settings, and then select **Review + create**:

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Subscription            |Select your Front Door subscription name.|
    | Resource group          |Select your Front Door resource group *myResourceGroupFD1*.|
    | Resource location       |Auto-filled for your Resource Group.  |
    | Policy name             |Enter *yourpolicyname*. The policy name needs to be unique.|
    | Policy for              |Front Door is auto-populated. |
    | Policy state            |Enabled|

   ![Create a WAF policy](.\media\waf-front-door-create-portal\basic.png)

3. Select **Review + Create**, and then select **Create**.

## Associate a policy to a Front Door front-end
1. In the **Association** tab of the **Create a WAF policy** page, select **Add frontend host**:

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Front door              | Select your Front Door profile name.|
    | Frontend host           | Select *MyResourceGroupFD1* in the text box.|

## Configure WAF rules (optional)

### Change mode

When you create a WAF policy, by the default WAF policy is in **Detection"** mode.
In **Detection** mode, WAF does not block any requests, instead, requests matching the WAF rules are logged at WAF logs.You can change the mode settings from **Detection** to **Prevention** to see WAF in action. In **Prevention** mode, requests that match rules defined in Default Ruse Set (DRS) are blocked and logged at WAF logs.

 ![Change WAF policy mode](.\media\waf-front-door-create-portal\policy.png)

### Default Rule Set (DRS)

Azure managed Default Rule Set is enabled by default. To disable an individual rule within a rule group, **expand** the rules within that rule group,  select the **check box** in front of the rule number, and click on **Disable** tab above. To change actions types for individual rules within the rule set, select the check box in front of the rule number, and seelct the **Change action** tab above.

 ![Change WAF Rule Set](.\media\waf-front-door-create-portal\\managed.png)

## Next steps

- Learn about [ Azure web application firewall](waf-overview.md).
- Learn more about [Azure Front Door](front-door-overview.md).




