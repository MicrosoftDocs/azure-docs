---
title: Manage multiple tenants in Microsoft Sentinel as a Managed Security Service Provider | Microsoft Docs
description: How to onboard and manage multiple tenants in Microsoft Sentinel as a Managed Security Service Provider (MSSP) using Azure Lighthouse.
author: yelevin
ms.topic: how-to
ms.date: 11/11/2024
ms.author: yelevin


#Customer intent: As an MSSP, I want to manage multiple Microsoft Sentinel tenants from my own Azure tenant so that I can efficiently provide SOC services to my customers.

---

# Manage multiple tenants in Microsoft Sentinel as an MSSP

If you're a managed security service provider (MSSP) and you're using [Azure Lighthouse](/azure/lighthouse/overview) to offer security operations center (SOC) services to your customers, you can manage your customers' Microsoft Sentinel resources directly from your own Azure tenant, without having to connect to the customer's tenant.

## Prerequisites

- [Onboard Azure Lighthouse](/azure/lighthouse/how-to/onboard-customer)

## Verify registration of Microsoft Sentinel resource providers

To manage multiple tenants properly, your MSSP tenant must have the Microsoft Sentinel resource providers registered on at least one subscription, and each of your customers' tenants must have the resource providers registered. 

If you have registered Microsoft Sentinel in your tenant, and your customers in theirs, you're ready to get started and can continue with [Access Microsoft Sentinel in managed tenants](#access-microsoft-sentinel-in-managed-tenants).

**To verify registration**:

1. Select **Subscriptions** from the Azure portal, and then select a relevant subscription from the menu.

1. From the navigation menu on the subscription screen, under **Settings**, select **Resource providers**.

1. From the ***subscription name* | Resource providers** screen, search for and select *Microsoft.OperationalInsights* and *Microsoft.SecurityInsights*, and check the **Status** column. If the provider's status is *NotRegistered*, select **Register**.

    :::image type="content" source="media/multiple-tenants-service-providers/check-resource-provider.png" alt-text="Screenshot of checking resource providers.":::

## Access Microsoft Sentinel in managed tenants

1. Under **Directory + subscription**, select the delegated directories (directory = tenant), and the subscriptions where your customer's Microsoft Sentinel workspaces are located.

    :::image type="content" source="media/multiple-tenants-service-providers/directory-subscription.png" alt-text="Choose tenants and subscriptions":::

1. Open Microsoft Sentinel, where you'll see all the workspaces in the selected subscriptions and can work with them seamlessly, just like any workspace in your own tenant.

> [!NOTE]
> You will not be able to deploy connectors in Microsoft Sentinel from within a managed workspace. To deploy a connector, you must directly sign into the tenant on which you want to deploy a connector, and authenticate there with the required permissions.

## Related content

In this document, you learned how to manage multiple Microsoft Sentinel tenants seamlessly. To learn more about Microsoft Sentinel, see the following articles:

- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
