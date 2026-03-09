---
title: Enable Marketplace Purchases in Azure
description: This article shows you how to enable Marketplace private offer purchases.
author: echung
ms.reviewer: echung
ms.service: cost-management-billing
ms.subservice: microsoft-customer-agreement
ms.topic: conceptual
ms.date: 01/22/2025
ms.author: nicholak
ms.custom: sfi-ga-nochange
---

# Enable Marketplace purchases in Azure

You can use Microsoft Marketplace in the Azure portal to buy non-Microsoft software to use with Azure.

To use Marketplace, you need to set up and configure Marketplace policy settings. Then, you assign the required user access permissions to billing accounts and subscriptions.

This article explains how to set up and enable Marketplace purchases, and specifically how to enable Marketplace private offer purchases.

To enable Marketplace private offer purchase, first: 

1. Enable Marketplace in the Azure portal.
1. Set user permissions to allow individuals to make Marketplace purchases.
1. Set user permissions to allow individuals to accept Marketplace private offers.
1. Optionally, if you have Private Marketplace enabled, then you can enable private offer purchases in Private Marketplace.

## Prerequisites

Before you begin, make sure you know your billing account type, because the process to enable marketplace purchases varies based on your account type. [Learn how to determine your billing account type](manage-billing-access.md#check-the-type-of-your-billing-account).

## Enable Marketplace purchases

To enable Marketplace purchases, you need to enable the Marketplace policy setting.

Depending on your billing account type, the process and required permissions vary.

You can enable Marketplace purchases with the following account types:

- [Microsoft Customer Agreement](#mca--enable-the-marketplace-policy-setting)
- [Enterprise Agreement](#ea--enable-the-marketplace-policy-setting)

At a high level, here's how the process works.

:::image type="content" source="./media/enable-marketplace-purchases/diagram-steps-enable-purchases.svg" alt-text="Diagram that shows the steps to enable purchases." lightbox="./media/enable-marketplace-purchases/diagram-steps-enable-purchases.svg":::

### <a name = "mca--enable-the-marketplace-policy-setting"></a> Enable the Marketplace policy setting with a Microsoft Customer Agreement account

Users with the following permissions can enable the policy setting:

- **Billing account owner** or **Billing account contributor**
- **Billing profile owner** or **Billing profile contributor**

The policy setting applies to all users with access to all Azure subscriptions under the billing account's billing profile.

To enable the policy setting on the billing account profile:

1. Sign in to the Azure portal.
1. Go to or search for **Cost Management + Billing**.
1. On the left menu, select **Billing scopes**.
1. Select the appropriate billing account scope.
1. On the left menu, select **Billing profile**.
1. On the left menu, select **Policies**.
1. Set the Marketplace policy to **On**.
1. Select **Save**.

For more information about the Marketplace policy setting, see [Purchase control through the billing profile under a Microsoft Customer Agreement](/marketplace/purchase-control-options#purchase-control-through-the-billing-profile) .

### <a name = "ea--enable-the-marketplace-policy-setting"></a> Enable the Marketplace policy setting with an Enterprise Agreement account

Only enterprise admins can enable the policy setting. Enterprise admins who have read-only permissions can't enable the proper policies to buy from Marketplace.

The policy setting applies to all users with access to the Azure subscriptions in the billing account (Enterprise Agreement enrollment).

To enable the policy setting on the billing account (Enterprise Agreement enrollment):

1. Sign in to the Azure portal.
1. Go to or search for **Cost Management + Billing**.
1. On the left menu, select **Billing scopes**.
1. Select the billing account scope.
1. On the left menu, select **Policies**.
1. Under Marketplace, set the policy to **On**.
1. Select **Save**.

For more information about Marketplace policy setting, see [Purchase control through Enterprise Agreement billing administration under an EA](/marketplace/purchase-control-options#purchase-control-through-ea-billing-administration-under-an-enterprise-agreement-ea).

## Set user permissions on the Azure subscription

To purchase a Marketplace private offer, a private plan, or a public plan, customers (with both Enterprise Agreement and Microsoft Customer Agreement accounts) need to set user permissions on their Azure subscription.

When you grant permission, it applies only to the individual users that you select.

To set permission for a subscription:

1. Sign in to the Azure portal.
1. Go to **Subscriptions** and then search for the name of the subscription.
1. Search for and then select the subscription that you want to manage access for.
1. Select **Access control (IAM)** from the left menu.
1. To give a user access, select **Add** from the top of the page.
1. In the **Role** dropdown list, select the owner or contributor role.
1. Enter the email address of the user to whom you want to give access.
1. Select **Save** to assign the role.

For more information about assigning roles, see [Assign Azure roles by using the Azure portal](/azure/role-based-access-control/role-assignments-portal) and [Privileged administrator roles](../../role-based-access-control/role-assignments-steps.md#privileged-administrator-roles).

## Set user permissions to accept private offers

The permission (billing role) that you need to accept private offers and how you grant the permission varies, based on your agreement type.

### Set permissions to accept private offers with a Microsoft Customer Agreement account

Only the billing account owner can set user permissions. The permissions granted apply to only the individual users that you select.

To set user permissions:

1. Sign in to the Azure portal.
1. Go to or search for **Cost Management + Billing**.
1. Select the billing account that you want to manage access for.
1. Select **Access control (IAM)** from the left pane.
1. To give access to a user, select **Add** from the top of the page.
1. In the **Role** list, select either **Billing account owner** or **contributor**.
1. Enter the email address of the user to whom you want to give access.
1. Select **Save** to assign the role.

For more information about setting user permissions for a billing role, see [Manage billing roles in the Azure portal](understand-mca-roles.md#manage-billing-roles-in-the-azure-portal).

### Set permissions to accept private offers with an Enterprise Agreement account

Only Enterprise Agreement administrators can set user permissions. Enterprise administrators with read-only permissions can't set user permissions. The permissions granted apply to only the individual users that you select.

To set user permissions:

1. Sign in to the Azure portal.
1. Go to or search for **Cost Management + Billing**.
1. On the left menu, select **Billing scopes** and then select the billing account that contains the Azure subscription that you want to use for Marketplace purchase.
1. On the left menu, select **Access Control (IAM)**.
1. On the top menu, select **+ Add**, and then select **Enterprise administrator**.
1. Complete the **Add role assignment** form, and then select **Add**.

For more information, see [Add another enterprise administrator](direct-ea-administration.md#add-another-enterprise-administrator).

## (Optional) Enable private offer purchases in Azure Private Marketplace

If Azure Private Marketplace is enabled, you need a Private Marketplace admin to enable and configure a Private Marketplace. To enable Azure Private Marketplace in the Azure portal, a global administrator assigns the Marketplace admin role to specific users. The process to assign the Marketplace admin role is the same for Enterprise Agreement and Microsoft Customer Agreement customers.

To assign the Marketplace admin role:

1. Sign in to the Azure portal.
1. Go to or search for **Marketplace**.
1. Select **Private Marketplace** from the left menu.
1. Select **Access control (IAM)**.
1. Select **+ Add** > **Add role assignment**.
1. Under **Role**, select **Marketplace Admin**.
1. Select the desired user from the dropdown list, and then select **Done**.

For more information about assigning the Marketplace admin role, see [Assign the Marketplace admin role](/marketplace/create-manage-private-azure-marketplace-new#assign-the-marketplace-admin-role).

### Enable private offer purchasing in Private Marketplace

Marketplace admins can enable private offer and private plan purchases in Private Marketplace. The Marketplace admin can also enable individual private offers or private plans.

After you enable private offer purchasing in Private Marketplace, all users in the organization (the Microsoft Entra tenant) can purchase products in enabled collections.

#### Enable private offers and private plans

1. Sign in to the Azure portal.
1. Go to or search for **Marketplace**.
1. Select **Private Marketplace** from the left menu.
1. Select **Get Started** to use Azure Private Marketplace. You only have to do this action once.
1. Select **Settings** from the left menu.
1. Select the radio option for the desired status (**Enabled** or **Disabled**).
1. Select **Apply** at the bottom of the page.
1. Update Private Marketplace **Rules** to enable private offers and private plans.

#### Add individual private products to a Private Marketplace collection

We generally recommend that a Marketplace admin should enable private offers in Private Marketplace for all users in the organization by using the previous procedure.

We don't recommend it, but if necessary, Marketplace admins can use the following procedures to avoid enabling private offers in Private Marketplace for all users in the organization. The Marketplace admin can add individual private offers on a purchase-by-purchase basis.

#### Set up a collection

1. Sign in to the Azure portal.
1. Go to or search for **Marketplace**.
1. Select **Private Marketplace** from the left menu.
1. If no collections were created, select **Get started**.
1. If collections exist, select an existing collection or add a new collection.

#### Add a private offer or a private plan to a collection

1. Select the collection name.
1. Select **Add items**.
1. Browse the gallery or use the search field to find the item you want.
1. Select **Done**.

For more information about setting up and configuring Marketplace product collections, see [Collections overview](/marketplace/create-manage-private-azure-marketplace-new#collections-overview).

:::image type="content" source="./media/enable-marketplace-purchases/azure-portal-private-marketplace-manage-collection-rules-select.png" alt-text="Screenshot that shows collection items." lightbox="./media/enable-marketplace-purchases/azure-portal-private-marketplace-manage-collection-rules-select.png" :::

## Related content

- To learn more, see [Use Azure Private Marketplace](/marketplace/create-manage-private-azure-marketplace-new#create-private-azure-marketplace).
- To learn more about setting up and configuring Marketplace product collections, see [Collections overview](/marketplace/create-manage-private-azure-marketplace-new#collections-overview).
- Read more about [Microsoft Marketplace](/marketplace/).
