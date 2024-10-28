---
title: Enable marketplace purchases in Azure
description: This article covers the steps used to enable marketplace private offer purchases.
author: bandersmsft
ms.reviewer: echung
ms.service: cost-management-billing
ms.subservice: enterprise
ms.topic: conceptual
ms.date: 02/13/2024
ms.author: banders
---

# Enable marketplace purchases in Azure

In the Azure portal, you buy non-Microsoft (third-party) software for use in Azure with the Microsoft commercial marketplace. To use the marketplace, you must first set up and configure marketplace policy settings and then assign required user access permissions to billing accounts and subscriptions. This article explains the tasks needed to set up and enable marketplace purchases, with an emphasis on setup steps required for private offers.

This article covers the following steps that are used to enable marketplace private offer purchases:

1. Enable the Azure Marketplace in the Azure portal
1. Set user permissions to allow individuals to make Marketplace purchases
1. Set user permissions to allow individuals to accept Marketplace private offers
1. Optionally, if you have private marketplace enabled, then you can enable private offer purchases in the private marketplace

## Prerequisites

Before you begin, make sure you know your billing account type because the steps needed to enable marketplace purchases vary based on your account type.

If you don't know your billing account type, [check the type of your billing account](manage-billing-access.md#check-the-type-of-your-billing-account).

## Enable marketplace purchase

You enable the marketplace policy setting to enable marketplace purchases. How you navigate to the setting depends on your billing account type. The required permissions also differ. Marketplace purchases support the following account types:

- [Microsoft Customer Agreement (MCA)](#mca--enable-the-marketplace-policy-setting)
- [Enterprise Agreement (EA)](#ea--enable-the-marketplace-policy-setting)

At a high level, here's how the process to enable purchases works.

:::image type="content" source="./media/enable-marketplace-purchases/diagram-steps-enable-purchases.svg" alt-text="Diagram showing the enable purchase steps." border="false" lightbox="./media/enable-marketplace-purchases/diagram-steps-enable-purchases.svg":::

### MCA – Enable the marketplace policy setting

People with the following permission can enable the policy setting:

- Billing Account owner or contributor
- Billing Profile owner or contributor

The policy setting applies to all users with access to all Azure subscriptions under the billing account's billing profile.

To enable the policy setting on the Billing Account Profile:

1. Sign in to the Azure portal.
1. Navigate to or search for **Cost Management + Billing**.
1. In the left menu, select **Billing scopes**.
1. Select the appropriate billing account scope.
1. In the left menu, select **Billing profile**.
1. In the left menu, select **Policies**.
1. Set the Azure Marketplace policy to **On**.
1. Select the **Save** option.

For more information about the Azure Marketplace policy setting, see [purchase control through the billing profile under a Microsoft Customer Agreement (MCA)](/marketplace/purchase-control-options#purchase-control-through-the-billing-profile) .

### EA – Enable the marketplace policy setting

Only an Enterprise administrator can enable the policy setting. Enterprise administrators with read only permissions can't enable the proper policies to buy from the marketplace.

The policy setting applies to all users with access to the Azure subscriptions in the billing account (EA enrollment).

To enable the policy setting on the billing account (EA enrollment):

1. Sign in to the Azure portal.
1. Navigate to or search for **Cost Management + Billing**.
1. In the left menu, select **Billing scopes**.
1. Select the billing account scope.
1. In the left menu, select **Policies**.
1. Under Azure Marketplace, set the policy to **On**.
1. Select **Save**.

For more information about the Azure Marketplace policy setting, see [Purchase control through EA billing administration under an Enterprise Agreement (EA)](/marketplace/purchase-control-options#purchase-control-through-ea-billing-administration-under-an-enterprise-agreement-ea) .

## Set user permissions on the Azure subscription

Setting permission for a subscription is needed for both EA or MCA customers to purchase a marketplace private offer, a private plan, or a public plan. The permission granted applies to only the individual users that you select.

To set permission for a subscription:

1. Sign in to the Azure portal.
1. Navigate to **Subscriptions** and then search for the name of the subscription.
1. Search for and then select the subscription that you want to manage access for.
1. Select **Access control (IAM)** from the left-hand pane.
1. To give access to a user, select **Add** from the top of the page.
1. In the **Role** drop-down list, select the owner or contributor role.
1. Enter the email address of the user to whom you want to give access.
1. Select **Save** to assign the role.

For more information about assigning roles, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.yml) and [Privileged administrator roles](../../role-based-access-control/role-assignments-steps.md#privileged-administrator-roles).


## Set user permission to accept private offers

The permission (billing role) required to accept private offers and how you grant the permission varies, based on your agreement type.

### MCA – Set permission to accept private offers for a user

Only the billing account owner can set user permission. The permission granted applies to only the individual users that you select.

To set user permission for a user:

1. Sign in to the Azure portal.
1. Navigate to or search for **Cost Management + Billing**.
1. Select the billing account that you want to manage access for.
1. Select **Access control (IAM)** from the left-hand pane.
1. To give access to a user, select **Add** from the top of the page.
1. In the **Role** list, select either **Billing account owner** or **contributor**.
1. Enter the email address of the user to whom you want to give access.
1. Select **Save** to assign the role.

For more information about setting user permission for a billing role, see [Manage billing roles in the Azure portal](understand-mca-roles.md#manage-billing-roles-in-the-azure-portal).

### EA – Set permission to accept private offers for a user

Only the EA administrator can set user permission. Enterprise administrators with read only permissions can't set user permission. The permission granted applies to only the individual users that you select.

To set user permission for a user:

1. Sign in to the Azure portal.
1. Navigate to or search for **Cost Management + Billing**.
1. In the left menu, select **Billing scopes** and then select the billing account that contains the Azure subscription used for Marketplace purchase.
1. In the left menu, select **Access Control (IAM)**.
1. In the top menu, select **+ Add**, and then select **Enterprise administrator**.
1. Complete the Add role assignment form and then select **Add**.

For more information about adding another enterprise administrator, see [Add another enterprise administrator](direct-ea-administration.md#add-another-enterprise-administrator).

## Optionally enable private offer purchases in the private Azure Marketplace

If you have the private Azure Marketplace enabled, then a private Marketplace admin is required to enable and configure the private Marketplace. To enable Azure private Marketplace in the Azure portal, a global administrator assigns the Marketplace admin role to specific users. The steps to assign the Marketplace admin role is the same for EA and MCA customers.

To assign the Marketplace admin role:

1. Sign in to the Azure portal.
1. Navigate to or search for **Marketplace**.
1. Select **Private Marketplace** from the left navigation menu.
1. Select **Access control (IAM)** to assign the Marketplace admin role.
1. Select **+ Add** > **Add role assignment**.
1. Under **Role**, choose **Marketplace Admin**.
1. Select the desired user from the dropdown list, then select **Done**.

For more information about assigning the Marketplace admin role, see [Assign the Marketplace admin role](/marketplace/create-manage-private-azure-marketplace-new#assign-the-marketplace-admin-role).

### Enable the private offer purchase in the private Marketplace

The Marketplace admin enables the private offer and private plan purchases in the private Marketplace. The Marketplace admin can also enable individual private offers or private plans.

After the private offer purchase is enabled in the private Marketplace, all users in the organization (the Microsoft Entra tenant) can purchase products in enabled collections.

#### To enable private offers and private plans

1. Sign in to the Azure portal.
1. Navigate to or search for **Marketplace**.
1. Select **Private Marketplace** from the left-nav menu.
1. Select **Get Started** to create the private Azure Marketplace. You only have to do this action once.
1. Select **Settings** from the left-nav menu.
1. Select the radio button for the desired status (Enabled or Disabled).
1. Select **Apply** on the bottom of the page.
1. Update Private Marketplace **Rules** to enable private offers and private plans.

#### To add individual private products to private Marketplace collection

>[!NOTE]
> - We generally recommend that a Marketplace admin should enable private offers in the Private Marketplace for all users in the organization, using the previous procedure.
> - Although not recommended, and only if necessary, the following procedures are used by a Marketplace admin to avoid enabling private offers in the Private Marketplace for all users in the organization. The Marketplace admin can add individual private offers on a purchase-by-purchase basis.

#### Set up a collection

1. Sign in to the Azure portal.
1. Navigate to or search for **Marketplace**.
1. Select **Private Marketplace** from the left menu.
1. If no collections were created, select **Get started**.
1. If collections exist, then select an existing collection or add a new collection.

#### Add a private offer or a private plan to a collection

1. Select the collection name.
1. Select **Add items**.
1. Browse the Gallery or use the search field to find the item you want.
1. Select **Done**.

For more information about setting up and configuring Marketplace product collections, see [Collections overview](/marketplace/create-manage-private-azure-marketplace-new#collections-overview).

:::image type="content" source="./media/enable-marketplace-purchases/azure-portal-private-marketplace-manage-collection-rules-select.png" alt-text="Screenshot showing the Collection items." lightbox="./media/enable-marketplace-purchases/azure-portal-private-marketplace-manage-collection-rules-select.png" :::

## Related content

- To learn more about creating the private marketplace, see [Create private Azure Marketplace](/marketplace/create-manage-private-azure-marketplace-new#create-private-azure-marketplace).
- To learn more about setting up and configuring Marketplace product collections, see [Collections overview](/marketplace/create-manage-private-azure-marketplace-new#collections-overview).
- To read more about the Marketplace in the [Microsoft commercial marketplace customer documentation](/marketplace/).