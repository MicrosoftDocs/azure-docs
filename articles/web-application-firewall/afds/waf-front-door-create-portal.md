---
title: 'Tutorial: Create WAF policy for Azure Front Door - Azure portal'
description: In this tutorial, you learn how to create a Web Application Firewall (WAF) policy by using the Azure portal.
author: vhorne
ms.service: web-application-firewall
services: web-application-firewall
ms.topic: tutorial
ms.date: 03/10/2020
ms.author: victorh
---

# Tutorial: Create a Web Application Firewall policy on Azure Front Door using the Azure portal

This tutorial show you how to create a basic Azure Web Application Firewall (WAF) policy and apply it to a front-end host at Azure Front Door.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a WAF policy
> * Associate it with a frontend host
> * Configure WAF rules

## Prerequisites

Create a Front Door profile by following the instructions described in [Quickstart: Create a Front Door profile](../../frontdoor/quickstart-create-front-door.md). 

## Create a Web Application Firewall policy

First, create a basic WAF policy with managed Default Rule Set (DRS) by using the portal. 

1. On the top left-hand side of the screen, select **Create a resource**>search for **WAF**>select **Web application firewall (Preview)** > select **Create**.
2. In the **Basics** tab of the **Create a WAF policy** page, enter or select the following information, accept the defaults for the remaining settings, and then select **Review + create**:

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Subscription            |Select your Front Door subscription name.|
    | Resource group          |Select your Front Door resource group name.|
    | Policy name             |Enter a unique name for your WAF policy.|

   ![Create a WAF policy](../media/waf-front-door-create-portal/basic.png)

3. In the **Association** tab of the **Create a WAF policy** page, select **Add frontend host**, enter the following settings, and then select **Add**:

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Front door              | Select your Front Door profile name.|
    | Frontend host           | Select the name of your front door host, then select **Add**.|
    
    > [!NOTE]
    > If the frontend host is associated to a WAF policy, it is shown as grayed out. You must first remove the frontend host from the associated policy, and then re-associate the frontend host to a new WAF policy.
1. Select **Review + create**, then select **Create**.

## Configure Web Application Firewall rules (optional)

### Change mode

When you create a WAF policy, by the default WAF policy is in **Detection** mode. In **Detection** mode, WAF does not block any requests, instead, requests matching the WAF rules are logged at WAF logs.
To see WAF in action, you can change the mode settings from **Detection** to **Prevention**. In **Prevention** mode, requests that match rules that are defined in Default Rule Set (DRS) are blocked and logged at WAF logs.

 ![Change WAF policy mode](../media/waf-front-door-create-portal/policy.png)

### Custom rules

You can create a custom rule by selecting **Add custom rule** under the **Custom rules** section. This launches the custom rule configuration page. Below is an example of configuring a custom rule to block a request if the query string contains **blockme**.

![Change WAF policy mode](../media/waf-front-door-create-portal/customquerystring2.png)

### Default Rule Set (DRS)

Azure-managed Default Rule Set is enabled by default. To disable an individual rule within a rule group, expand the rules within that rule group,  select the **check box** in front of the rule number, and select **Disable** on the tab above. To change actions types for individual rules within the rule set, select the check box in front of the rule number, and then select the **Change action** tab above.

 ![Change WAF Rule Set](../media/waf-front-door-create-portal/managed2.png)

## Next steps

> [!div class="nextstepaction"]
> [Learn about Azure Web Application Firewall](../overview.md)
> [Learn more about Azure Front Door](../../frontdoor/front-door-overview.md)