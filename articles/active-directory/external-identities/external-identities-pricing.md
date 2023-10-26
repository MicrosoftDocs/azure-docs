---
title: MAU billing model for Microsoft Entra External ID
description: Learn about Microsoft Entra External ID monthly active users (MAU) billing model for guest user collaboration (B2B) in Microsoft Entra External ID. Learn how to link your Microsoft Entra tenant to an Azure subscription.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 10/05/2023

ms.author: mimart
author: msmimart
manager: celestedg
ms.workload: identity
ms.collection: engagement-fy23, M365-identity-device-management
---

# Billing model for Microsoft Entra External ID

Microsoft Entra External ID pricing is based on monthly active users (MAU), which is the count of unique users with authentication activity within a calendar month. This billing model applies to both Microsoft Entra guest user collaboration (B2B) and [Azure AD B2C tenants](/azure/active-directory-b2c/billing). MAU billing helps you reduce costs by offering a free tier and flexible, predictable pricing. In this article, learn about MAU billing and linking your Microsoft Entra tenants to a subscription.

> [!IMPORTANT]
> This article does not contain pricing details. For the latest information about usage billing and pricing, see [Microsoft Entra pricing](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).
>
> In Azure Government, the External ID billing model doesn't apply because the service is available through Preview only.

## What do I need to do?

To take advantage of MAU billing, your Microsoft Entra tenant must be linked to an Azure subscription.

|If your tenant is:  |You need to:  |
|---------|---------|
| A Microsoft Entra tenant already linked to a subscription     | Do nothing. When you use External Identities features to collaborate with guest users, you'll be automatically billed using the MAU model.        |
| A Microsoft Entra tenant not yet linked to a subscription     | [Link your Microsoft Entra tenant to a subscription](#link-your-azure-ad-tenant-to-a-subscription) to activate MAU billing.        |

## About monthly active users (MAU) billing

In your Microsoft Entra tenant, guest user collaboration usage is billed based on the count of unique guest users with authentication activity within a calendar month. This model replaces the 1:5 ratio billing model, which allowed up to five guest users for each Microsoft Entra ID P1 or P2 license in your tenant. When your tenant is linked to a subscription and you use External Identities features to collaborate with guest users, you'll be automatically billed using the MAU-based billing model.

Your first 50,000 MAUs per month are free for both Premium P1 and Premium P2 features. To determine the total number of MAUs, we combine MAUs from all your tenants (both External ID and Azure AD B2C) that are linked to the same subscription.

The pricing tier that applies to your guest users is based on the highest pricing tier assigned to your Microsoft Entra tenant. For more information, see [Microsoft Entra External ID Pricing](https://azure.microsoft.com/pricing/details/active-directory/external-identities/).

<a name='link-your-azure-ad-tenant-to-a-subscription'></a>

## Link your Microsoft Entra tenant to a subscription

A Microsoft Entra tenant must be linked to a resource group within an Azure subscription for proper billing and access to features.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/) with an account that's been assigned at least the Contributor role within the subscription or a resource group within the subscription.

2. Select the directory you want to link: In the Microsoft Entra admin center toolbar, select the **Directories + subscriptions** icon in the portal toolbar. Then on the **Portal settings | Directories + subscriptions** page, find your directory in the **Directory name** list, and then select **Switch**.

3. Browse to **Identity** > **External identities** > **Overview**.

5. Under **Subscriptions**, select **Linked subscriptions**.

6. In the tenant list, select the checkbox next to the tenant, and then select **Link subscription**.

    :::image type="content" source="media/external-identities-pricing/linked-subscriptions.png" alt-text="Screenshot of the link a subscription option.":::

7. In the **Link a subscription** pane, select a **Subscription** and a **Resource group**. Then select **Apply**. (If there are no subscriptions listed, see [What if I can't find a subscription?](#what-if-i-cant-find-a-subscription).)

    :::image type="content" source="media/external-identities-pricing/link-subscription-resource.png" alt-text="Screenshot of how to link a subscription.":::

After you complete these steps, your Azure subscription is billed based on your Azure Direct or Enterprise Agreement details, if applicable.

## What if I can't find a subscription?

If no subscriptions are available in the **Link a subscription** pane, here are some possible reasons:

- You don't have the appropriate permissions. Be sure to sign in with an Azure account that's been assigned at least the Contributor role within the subscription or a resource group within the subscription.

- A subscription exists, but it hasn't been associated with your directory yet. You can [associate an existing subscription to your tenant](../fundamentals/how-subscriptions-associated-directory.md) and then repeat the steps for [linking it to your tenant](#link-your-azure-ad-tenant-to-a-subscription).

- No subscription exists. In the **Link a subscription** pane, you can create a subscription by selecting the link **if you don't already have a subscription you may create one here**. After you create a new subscription, you'll need to [create a resource group](/azure/azure-resource-manager/management/manage-resource-groups-portal) in the new subscription, and then repeat the steps for [linking it to your tenant](#link-your-azure-ad-tenant-to-a-subscription).

## Next steps

For the latest pricing information, see [Microsoft Entra pricing](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).
