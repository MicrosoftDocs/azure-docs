---
title: 'Tutorial: Create WAF policy for Azure CDN - Azure portal'
description: In this tutorial, you learn how to create a Web Application Firewall (WAF) policy by using the Azure portal.
author: vhorne
ms.service: web-application-firewall
services: web-application-firewall
ms.topic: tutorial
ms.date: 03/09/2020
ms.author: victorh
---

# Tutorial: Create a Web Application Firewall policy with Azure CDN using the Azure portal

This tutorial show you how to create a basic Azure Web Application Firewall (WAF) policy and apply it to a endpoint at Azure CDN.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a WAF policy
> * Associate it with a CDN endpoint
> * Configure WAF rules

## Prerequisites

Create a Front Door profile by following the instructions described in [Quickstart: Create a Front Door profile](../../cdn/cdn-create-new-endpoint.md). 

## Create a Web Application Firewall policy

First, create a basic WAF policy with managed Default Rule Set (DRS) by using the portal.

1. On the top left-hand side of the screen, select **Create a resource**>search for **WAF**>select **Web application firewall** > select **Create**.
2. In the **Basics** tab of the **Create a WAF policy** page, enter or select the following information, accept the defaults for the remaining settings, and then select **Review + create**:

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Policy For            |Select Azure CDN (Preview).|
    | Subscription            |Select your Front Door subscription name.|
    | Resource group          |Select your Front Door resource group name.|
    | Policy name             |Enter a unique name for your WAF policy.|

   ![Create a WAF policy](../media/waf-cdn-create-portal/basic.png)

3. In the **Association** tab of the **Create a WAF policy** page, select **Add CDN Endpoint**, enter the following settings, and then select **Add**:

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | CDN Profile              | Select your CDN profile name.|
    | Endpoint           | Select the name of your endpoint, then select **Add**.|
    
    > [!NOTE]
    > If the endpoint is associated to a WAF policy, it is shown as grayed out. You must first remove the Endpoint from the associated policy, and then re-associate the endpoint to a new WAF policy.
1. Select **Review + create**, then select **Create**.

## Configure Web Application Firewall policy (optional)

### Change mode

When you create a WAF policy, by the default WAF policy is in **Detection** mode. In **Detection** mode, WAF does not block any requests, instead, requests matching the WAF rules are logged at WAF logs.
To see WAF in action, you can change the mode settings from **Detection** to **Prevention**. In **Prevention** mode, requests that match rules that are defined in Default Rule Set (DRS) are blocked and logged at WAF logs.

 ![Change WAF policy mode](../media/waf-cdn-create-portal/policy.png)

### Custom rules

You can create a custom rule by selecting **Add custom rule** under the **Custom rules** section. This launches the custom rule configuration page. There are two types of custom rules, **match rule** and **rate limit** rule.
Below is an example of configuring a custom match rule to block a request if the query string contains **blockme**.

![Change WAF policy mode](../media/waf-cdn-create-portal/custommatch.png)

Rate limit rule requires two additional fields: Rate limit duration and threshold as shown in below example:

![Change WAF policy mode](../media/waf-cdn-create-portal/customrate.png)

### Default Rule Set (DRS)

Azure-managed Default Rule Set is enabled by default. To disable an individual rule within a rule group, expand the rules within that rule group,  select the **check box** in front of the rule number, and select **Disable** on the tab above. To change actions types for individual rules within the rule set, select the check box in front of the rule number, and then select the **Change action** tab above.

 ![Change WAF Rule Set](../media/waf-cdn-create-portal/managed2.png)

## Next steps

> [!div class="nextstepaction"]
> [Learn about Azure Web Application Firewall](../overview.md)
> [Learn more about Azure Front Door](../../frontdoor/front-door-overview.md)