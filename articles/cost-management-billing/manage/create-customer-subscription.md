---
title: Create a subscription for a partner's customer
titleSuffix: Azure Cost Management + Billing
description: Learn how a Microsoft Partner creates a subscription for a customer in the Azure portal. 
author: bandersmsft
ms.reviewer: amberb
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 03/29/2023
ms.author: banders
---

# Create a subscription for a partner's customer

This article helps a Microsoft Partner with a [Microsoft Partner Agreement](https://www.microsoft.com/licensing/news/introducing-microsoft-partner-agreement) create a [Microsoft Customer Agreement](https://azure.microsoft.com/pricing/purchase-options/microsoft-customer-agreement/) subscription for their customer. 

To learn more about billing accounts and identify your billing account type, see [View billing accounts in Azure portal](view-all-accounts.md).

[!INCLUDE [cost-management-billing-subscription-b2b-b2c-note](../../../includes/cost-management-billing-subscription-b2b-b2c-note.md)]

## Permission required to create Azure subscriptions

You need the following permissions to create customer subscriptions:

- Global Admin and Admin Agent role in the CSP partner organization.

For more information, see [Partner Center - Assign users roles and permissions](/partner-center/permissions-overview). The user needs to sign in to the partner tenant to create Azure subscriptions.

## Create a subscription as a partner for a customer

Partners with a Microsoft Partner Agreement use the following steps to create a new Microsoft Azure Plan subscription for their customers. The subscription is created under the partner’s billing account and billing profile.

1.	Sign in to the Azure portal using your Partner Center account.  
    Make sure you are in your Partner Center directory (tenant), not a customer’s tenant.
1.	Navigate to **Cost Management + Billing**.
1.	Select the Billing scope for your billing account where the customer account resides.
1.	In the left menu under **Billing**, select **Customers**.  
    :::image type="content" source="./media/create-customer-subscription/customers-list.png" alt-text="Screenshot showing the Customers list where you see your list of customers." lightbox="./media/create-customer-subscription/customers-list.png" :::
1.	On the Customers page, select the customer. If you have only one customer, the selection is unavailable.
1.	In the left menu, under **Products + services**, select **All billing subscriptions**.
1.	On the Azure subscription page, select **+ Add** to create a subscription. Then select the type of subscription to add. For example, **Usage based/ Azure subscription**.  
    :::image type="content" source="./media/create-customer-subscription/all-billing-subscriptions-add.png" alt-text="Screenshot showing navigation to Add where you create a customer subscription." lightbox="./media/create-customer-subscription/all-billing-subscriptions-add.png" :::
1. On the Basics tab, enter a subscription name.
1. Select the partner's billing account.
1. Select the partner's billing profile.
1. Select the customer that you're creating the subscription for.
1. If applicable, select a reseller.
1. Next to **Plan**, select **Microsoft Azure Plan**.  
    :::image type="content" source="./media/create-customer-subscription/create-customer-subscription-basics-tab.png" alt-text="Screenshot showing the Basics tab where you enter basic information about the customer subscription." lightbox="./media/create-customer-subscription/create-customer-subscription-basics-tab.png" :::
1. Optionally, select the Tags tab and then enter tag pairs for **Name** and **Value**.
1. Select **Review + create**. You should see a message stating `Validation passed`.
1. Verify that the subscription information is correct, then select **Create**. You'll see a notification that the subscription is getting created.  

After the new subscription is created, the customer can see it in on the **Subscriptions** page.

## Create an Azure subscription programmatically

You can also create subscriptions programmatically. For more information, see [Create Azure subscriptions programmatically](programmatically-create-subscription.md).

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- [Add or change Azure subscription administrators](add-change-subscription-administrator.md)
- [Move resources to new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Create management groups for resource organization and management](../../governance/management-groups/create-management-group-portal.md)
- [Cancel your subscription for Azure](cancel-azure-subscription.md)