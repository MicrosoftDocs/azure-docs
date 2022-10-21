---
title: MAU billing model for Azure AD External Identities
description: Learn about Azure AD External Identities monthly active users (MAU) billing model for guest user collaboration (B2B) in Azure AD. Learn how to link your Azure AD  tenant to an Azure subscription.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 03/29/2022

ms.author: mimart
author: msmimart
manager: celestedg
ms.workload: identity
ms.collection: M365-identity-device-management
---

# Billing model for Azure AD External Identities

Azure Active Directory (Azure AD) External Identities pricing is based on monthly active users (MAU), which is the count of unique users with authentication activity within a calendar month. This billing model applies to both Azure AD guest user collaboration (B2B) and [Azure AD B2C tenants](../../active-directory-b2c/billing.md). MAU billing helps you reduce costs by offering a free tier and flexible, predictable pricing. In this article, learn about MAU billing and linking your Azure AD tenants to a subscription.

> [!IMPORTANT]
> This article does not contain pricing details. For the latest information about usage billing and pricing, see [Azure Active Directory pricing](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).

## What do I need to do?

To take advantage of MAU billing, your Azure AD tenant must be linked to an Azure subscription.

|If your tenant is:  |You need to:  |
|---------|---------|
| An Azure AD tenant already linked to a subscription     | Do nothing. When you use External Identities features to collaborate with guest users, you'll be automatically billed using the MAU model.        |
| An Azure AD tenant not yet linked to a subscription     | [Link your Azure AD tenant to a subscription](#link-your-azure-ad-tenant-to-a-subscription) to activate MAU billing.        |
|  |  |

## About monthly active users (MAU) billing

In your Azure AD tenant, guest user collaboration usage is billed based on the count of unique guest users with authentication activity within a calendar month. This model replaces the 1:5 ratio billing model, which allowed up to five guest users for each Azure AD Premium license in your tenant. When your tenant is linked to a subscription and you use External Identities features to collaborate with guest users, you'll be automatically billed using the MAU-based billing model.

Your first 50,000 MAUs per month are free for both Premium P1 and Premium P2 features. To determine the total number of MAUs, we combine MAUs from all your tenants (both Azure AD and Azure AD B2C) that are linked to the same subscription.

The pricing tier that applies to your guest users is based on the highest pricing tier assigned to your Azure AD tenant. For more information, see [Azure Active Directory External Identities Pricing](https://azure.microsoft.com/pricing/details/active-directory/external-identities/).

## Link your Azure AD tenant to a subscription

An Azure AD tenant must be linked to a resource group within an Azure subscription for proper billing and access to features.

1. Sign in to the [Azure portal](https://portal.azure.com/) with an Azure account that's been assigned at least the [Contributor](../../role-based-access-control/built-in-roles.md) role within the subscription or a resource group within the subscription.

2. Select the directory you want to link: In the Azure portal toolbar, select the **Directories + subscriptions** icon in the portal toolbar. Then on the **Portal settings | Directories + subscriptions** page, find your directory in the **Directory name** list, and then select **Switch**.

3. Under **Azure Services**, select **Azure Active Directory**.

4. In the left menu, select **External Identities**.

5. Under **Subscriptions**, select **Linked subscriptions**.

6. In the tenant list, select the checkbox next to the tenant, and then select **Link subscription**.

    ![Select the tenant and link a subscription](media/external-identities-pricing/linked-subscriptions.png)

7. In the **Link a subscription** pane, select a **Subscription** and a **Resource group**. Then select **Apply**. (If there are no subscriptions listed, see [What if I can't find a subscription?](#what-if-i-cant-find-a-subscription).)

    ![Select a subscription and resource group](media/external-identities-pricing/link-subscription-resource.png)

After you complete these steps, your Azure subscription is billed based on your Azure Direct or Enterprise Agreement details, if applicable.

## What if I can't find a subscription?

If no subscriptions are available in the **Link a subscription** pane, here are some possible reasons:

- You don't have the appropriate permissions. Be sure to sign in with an Azure account that's been assigned at least the [Contributor](../../role-based-access-control/built-in-roles.md) role within the subscription or a resource group within the subscription.

- A subscription exists, but it hasn't been associated with your directory yet. You can [associate an existing subscription to your tenant](../fundamentals/active-directory-how-subscriptions-associated-directory.md) and then repeat the steps for [linking it to your tenant](#link-your-azure-ad-tenant-to-a-subscription).

- No subscription exists. In the **Link a subscription** pane, you can create a subscription by selecting the link **if you don't already have a subscription you may create one here**. After you create a new subscription, you'll need to [create a resource group](../../azure-resource-manager/management/manage-resource-groups-portal.md) in the new subscription, and then repeat the steps for [linking it to your tenant](#link-your-azure-ad-tenant-to-a-subscription).

## Next steps

For the latest pricing information, see [Azure Active Directory pricing](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).
Learn more about [managing Azure resources](../../azure-resource-manager/management/overview.md).
