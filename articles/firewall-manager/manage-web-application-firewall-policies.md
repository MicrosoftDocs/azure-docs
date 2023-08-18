---
title: Manage Azure Web Application Firewall policies
description: Learn how to use Azure Firewall Manager to manage Azure Web Application Firewall policies
author: vhorne
ms.author: victorh
ms.service: firewall-manager
ms.topic: how-to
ms.date: 06/15/2022
---

# Manage Web Application Firewall policies

You can centrally create and associate Web Application Firewall (WAF) policies for your application delivery platforms, including Azure Front Door and Azure Application Gateway.

## Prerequisites 

- A deployed [Azure Front Door](../frontdoor/quickstart-create-front-door.md) or [Azure Application Gateway](../application-gateway/quick-create-portal.md)

## Associate a WAF policy

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the Azure portal search bar, type **Firewall Manager** and press **Enter**.
3. On the Azure Firewall Manager page, select **Application Delivery Platforms**.
   :::image type="content" source="media/manage-web-application-firewall-policies/application-delivery-platforms.png" alt-text="Screenshot of Firewall Manager application delivery platforms.":::
1. Select your application delivery platform (Front Door or Application Gateway) to associate a WAF policy. In this example, we'll associate a WAF policy to a Front Door.
1. Select **Manage Security** and then select **Associate WAF policy**.
   :::image type="content" source="media/manage-web-application-firewall-policies/associate-waf-policy.png" alt-text="Screenshot of Firewall Manager associate WAF policy.":::
1. Select either an existing policy or **Create New**.
1. Select the domain(s) that you want the WAF policy to protect with your Azure Front Door profile.
1. Select **Associate**.

## View and manage WAF policies

1. On the Azure Firewall Manager page, under **Security**, select **Web application firewall policies** to view all your policies.
1. Select **Add** to create a new WAF policy or import settings from an existing WAF policy.
   :::image type="content" source="media/manage-web-application-firewall-policies/web-application-firewall-policies.png" alt-text="Screenshot of Firewall Manager Web Application Firewall policies.":::

## Next steps

- [Configure WAF policies using Azure Firewall Manager](../web-application-firewall/shared/manage-policies.md)
