---
title: Manage Azure Web Application Firewall policies
description: Learn how to use Azure Firewall Manager to manage Azure Web Application Firewall policies
author: duau
ms.author: duau
ms.service: azure-firewall-manager
ms.topic: how-to
ms.date: 07/29/2024
---

# Manage Web Application Firewall policies

You can centrally create and associate Web Application Firewall (WAF) policies for your application delivery platforms, including Azure Front Door and Azure Application Gateway.

## Prerequisites 

- A deployed [Azure Front Door](../frontdoor/quickstart-create-front-door.md) or [Azure Application Gateway](../application-gateway/quick-create-portal.md)

## Associate a WAF policy

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the Azure portal search bar, type **Firewall Manager** and press **Enter**.
1. On the Azure Firewall Manager page, under **Deployments**, select **Application Delivery Platforms**.

1. Select your application delivery platform (Front Door or Application Gateway) to associate a WAF policy. In this example, a WAF policy is associated to a Front Door.
1. Select **Manage Security** and then select **Add a new policy association**.
1. Select either an existing policy or **Create New**.
1. Select the domain(s) that you want the WAF policy to protect with your Azure Front Door profile.
1. Select **Associate**.

## View and manage WAF policies

1. On the Azure Firewall Manager page, under **Security**, select **Web application firewall policies** to view all your policies.
1. Select **Add** to create a new WAF policy or import settings from an existing WAF policy.

## Next steps

- [Configure WAF policies using Azure Firewall Manager](../web-application-firewall/shared/manage-policies.md)
