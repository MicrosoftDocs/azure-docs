---
title: Create Web Application Firewall (WAF) policies for Application Gateway  
description: Learn how to create Web Application Firewall policies for Application Gateway.
services: web-application-firewall
ms.topic: conceptual
author: vhorne
ms.service: web-application-firewall
ms.date: 10/17/2019
ms.author: victorh
---

# Create Web Application Firewall policies for Application Gateway

An introduction to WAF policies goes here.

## Create a policy

First, create a basic WAF policy with a managed Default Rule Set (DRS) using the Azure portal.

1. On the upper left side of the portal, select **Create a resource**. Search for **WAF**, select **Web Application Firewall**, then select **Create**.
2. On **Create a WAF policy** page, **Basics** tab, enter or select the following information, accept the defaults for the remaining settings, and then select **Review + create**:

   |Setting  |Value  |
   |---------|---------|
   |Policy for     |Regional WAF (Application Gateway)|
   |Subscription     |Select your subscription name|
   |Resource group     |Select your resource group|
   |Policy name     |Type a unique name for your WAF policy.|
3. On the **Association** tab, enter one of the following settings, then select **Add**:

   |Setting  |Value  |
   |---------|---------|
   |Associate Application Gateway     |Select your Application Gateway profile name.|
   |Associate Listeners     |Select the name of your Application Gateway Listener, then select **Add**.|

   > [!NOTE]
   > If you assign a policy to your Application Gateway (or listener) that already has a policy in place, the original policy is overwritten and replaced by the new policy.
4. Select **Review + create**, then select **Create**.

![WAF policy basics](../media/create-waf-policy-ag/waf-policy-basics.png)

## Configure WAF rules (optional)

When you create a WAF policy, by default it is in *Detection* mode. In Detection mode, WAF does not block any requests. Instead, the matching WAF rules are logged in the WAF logs. To see WAF in action, you can change the mode settings to *Prevention*. In Prevention mode, matching rules defined in the CRS Ruleset you selected are blocked and/or logged in the WAF logs.

## Managed rules

Azure-managed OWASP rules are enabled by default. To disable an individual rule within a rule group, expand the rules within that rule group, select the check box in front of the rule number, and select **Disable** on the tab above.

![Managed rules](../media/create-waf-policy-ag/managed-rules.png)

## Custom rules

To create a custom rule, select **Add custom rule** under the **Custom rules** tab. This opens the custom rule configuration page. The following screenshot shows an example custom rule configured to block a request if the query string contains the text *blockme*.

![Edit custom rule](../media/create-waf-policy-ag/edit-custom-rule.png)

## Next steps

Learn more about [Web Application Firewall CRS rule groups and rules](application-gateway-crs-rulegroups-rules.md).