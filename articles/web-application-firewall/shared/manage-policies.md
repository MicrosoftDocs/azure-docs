---
title: Use Azure Firewall Manager to manage Web Application Firewall policies
description: Learn about managing Azure Web Application Firewall policies using Azure Firewall Manager
author: vhorne
ms.author: victorh
ms.service: web-application-firewall
ms.topic: conceptual
ms.date: 06/15/2022
---

# Configure WAF policies using Azure Firewall Manager

Azure Firewall Manager is a platform to manage and protect your network security resources at scale. You can associate your WAF policies to an Application Gateway or Azure Front Door within Azure Firewall Manager, all in a single place.

## View and manage WAF policies

In Azure Firewall Manager, you can create and view all WAF policies in one central place across subscriptions and regions. 

To navigate to WAF policies, select the **Web Application Firewall Policies** tab on the left, under **Security**.

:::image type="content" source="../media/manage-policies/policies.png" alt-text="Screenshot showing Web Application Firewall policies in Firewall Manager." lightbox="../media/manage-policies/policies.png":::

## Associate or dissociate WAF policies

In Azure Firewall Manager, you can create and view all WAF policies in your subscriptions. These policies can be associated or dissociated with an application delivery platform. Select the service and then select **Manage Security**.

:::image type="content" source="../media/manage-policies/manage-security.png" alt-text="Screenshot showing Manage Security in Firewall Manager.":::

## Upgrade Application Gateway WAF configuration to WAF policy

For Application Gateway with WAF configuration, you can upgrade the WAF configuration to a WAF policy associated with Application Gateway. 

The WAF policy can be shared to multiple application gateways. Also, a WAF policy allows you to take advantage of advanced and new features like bot protection, newer rule sets, and reduced false positives. New features are only released on WAF policies.

To upgrade a WAF configuration to a WAF policy, select **Upgrade from WAF configuration** from the desired application gateway.

:::image type="content" source="../media/manage-policies/upgrade-policy.png" alt-text="Screenshot showing upgrade from WAF configuration.":::

## Next steps

- [Manage Azure Web Application Firewall policies](../../firewall-manager/manage-web-application-firewall-policies.md)
