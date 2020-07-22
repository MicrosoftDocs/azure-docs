---
title: External Identities linked subscriptions
description: Learn how to link an Azure Active Directory subscription to your tenant for External Identities monthly active user (MAU) based billing.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 7/22/2020

ms.author: mimart
author: msmimart
manager: celestedg
ms.collection: M365-identity-device-management
---

# Link External Identities to an Azure Active Directory subscription

Azure Active Directory (Azure AD) External Identities now offers pricing on a monthly active user (MAU) basis. With the new model, billing is based on usage per month rather than the number of Premium P1 or P2 licenses you have. The model includes a free tier, after which you're billed for the number of unique users who authenticate during the calendar month. You're not charged for inactive users or for multiple authentications by the same user within the month.

> [!NOTE]
> For details about the MAU pricing model, see [Azure AD External Identities pricing](link).

This article describes how to switch to the new pricing model by linking your External Identities tenant to your Azure AD subscription.

## Link your External Identities tenant to a subscription

1. Go to the [Azure portal](https://portal.azure.com/). In the left pane, select **Azure Active Directory**.

1. Sign in to the [Azure portal](https://portal.azure.com/) with an Azure account that's been assigned at least the [Contributor](../role-based-access-control/built-in-roles.md) role within the subscription or a resource group within the subscription.

1. Select the directory that contains your subscription.

    In the Azure portal toolbar, select the **Directory + Subscription** icon, and then select the directory that contains your subscription. This directory is different from the one that will contain your Azure AD B2C tenant.

    ![Subscription tenant, Directory + Subscription filter with subscription tenant selected](media/link-subscription/portal-01-pick-directory.png)

1. Select **External Identities**.
 
## Next steps

See the following resources on Azure AD B2B collaboration:

* [Azure Active Directory pricing](https://azure.microsoft.com/pricing/details/active-directory/)
