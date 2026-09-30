---
title: 'Tutorial: Create a WAF Policy for Azure Front Door - Azure Portal'
titleSuffix: Azure Web Application Firewall
description: Learn how to create an Azure Front Door WAF policy in the Azure portal, associate it at profile, domain, or route scope, and configure WAF rules.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: tutorial
ms.date: 09/01/2026
ms.custom: sfi-image-nochange

# Customer intent: As a security administrator, I want to create and configure a web application firewall policy for Azure Front Door, so that I can protect my applications from web vulnerabilities and control traffic effectively.
---

# Tutorial: Create a WAF policy on Azure Front Door by using the Azure portal

**Applies to:** :heavy_check_mark: Front Door Standard/Premium :heavy_check_mark: Front Door (classic)

This tutorial shows you how to create a basic web application firewall (WAF) policy and apply it to a front-end host at Azure Front Door.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create a WAF policy.
> - Associate it at profile, domain, or route scope.
> - Configure WAF rules.

## Prerequisites

Create an Azure [Front Door](../../frontdoor/quickstart-create-front-door.md) instance or an [Azure Front Door Standard or Premium](../../frontdoor/standard-premium/create-front-door-portal.md) profile.

## Create a WAF policy

First, create a basic WAF policy by using the Azure portal.

1. In the upper-left corner of the screen, select **Create a resource**. Search for **WAF**, select **Web Application Firewall (WAF)**, and select **Create**.

1. On the **Basics** tab of the **Create a WAF policy** page, enter or select the following information and accept the defaults for the remaining settings.

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Policy for              | Select **Global WAF (Front Door)**. |
    | Front door tier         | Select between **Classic**, **Standard**, and **Premium** tiers. |
    | Subscription            | Select your Azure subscription.|
    | Resource group          | Select your Azure Front Door resource group name.|
    | Policy name             | Enter a unique name for your WAF policy.|
    | Policy state            | Set as **Enabled**. |

   :::image type="content" source="../media/waf-front-door-create-portal/basic.png" alt-text="Screenshot that shows the Create a W A F policy page, with the Review + create button and list boxes for the subscription, resource group, and policy name.":::

1. On the **Association** tab, select **Associate a Front door profile**, enter the following settings, and select **Add**.

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Front door profile              | Select your Azure Front Door profile name. |
    | Association scope | Select **Profile**, **Domain**, or **Route**. |
    | Domains | If you selected **Domain** or **Route**, select the domains to associate. |
    | Routes | If you selected **Route**, select the routes to associate. |

    When needed, repeat these steps to add additional associations.
    
    > [!NOTE]
    > If multiple policy scopes apply to a request, route-level policy takes precedence over domain-level policy, and domain-level policy takes precedence over profile-level policy.

    > [!NOTE]
    > If you associate a domain with a WAF policy, it appears grayed out. Remove the domain from the existing association before associating it to a different policy.

1. Select **Review + create** > **Create**.

## Configure WAF rules (optional)

Follow these steps to configure WAF rules.

### Change mode

When you create a WAF policy, the default mode is **Detection**. In **Detection** mode, the WAF doesn't block any requests. Instead, it logs requests that match the WAF rules.
To see the WAF in action, change the mode settings from **Detection** to **Prevention**. In **Prevention** mode, the WAF blocks and logs requests that match defined rules.

 :::image type="content" source="../media/waf-front-door-create-portal/policy.png" alt-text="Screenshot that shows the Overview page of the Azure Front Door WAF policy that shows how to switch to Prevention mode.":::

### Custom rules

To create a custom rule, under the **Custom rules** section, select **Add custom rule** to open the custom rule configuration page.

:::image type="content" source="../media/waf-front-door-create-portal/custom-rules.png" alt-text="Screenshot that shows the Custom rules page.":::

The following example shows how to configure a custom rule to block a request if the query string contains **blockme**.

:::image type="content" source="../media/waf-front-door-create-portal/customquerystring2.png" alt-text="Screenshot that shows how to add a custom rule.":::

### Default Rule Set

The Azure-managed Default Rule Set is enabled by default for the Premium and Classic tiers of Azure Front Door. The current DRS for the Premium tier of Azure Front Door is Microsoft_DefaultRuleSet_2.1. Microsoft_DefaultRuleSet_1.1 is the current DRS for the Classic tier of Azure Front Door. On the **Managed rules** page, select **Assign** to assign a different DRS.

To disable an individual rule, select the checkbox in front of the rule number and select **Disable** at the top of the page. To change action types for individual rules within the rule set, select the checkbox in front of the rule number and select **Change action** at the top of the page.

> [!NOTE]
> Managed rules are only supported in the Azure Front Door Premium tier and Azure Front Door Classic tier policies.

## Clean up resources

When you no longer need the resources, delete the resource group and all related resources.

## Next step

> [!div class="nextstepaction"]
> [Learn more about Azure Front Door tiers](../../frontdoor/standard-premium/tier-comparison.md)
