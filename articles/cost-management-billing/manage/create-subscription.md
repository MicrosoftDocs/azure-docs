---
title: Create a Microsoft Customer Agreement subscription
titleSuffix: Azure Cost Management + Billing
description: Learn how to add a new Microsoft Customer Agreement subscription in the Azure portal. See information about billing account forms and view other available resources.
author: bandersmsft
ms.reviewer: amberb
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 05/25/2022
ms.author: banders
---

# Create a Microsoft Customer Agreement subscription

This article helps you create a [Microsoft Customer Agreement](https://azure.microsoft.com/pricing/purchase-options/microsoft-customer-agreement/) subscription for yourself or for someone else in your current Azure Active Directory (Azure AD) directory/tenant. You may want another subscription to avoid hitting subscription quota limits, to create separate environments for security, or to isolate data for compliance reasons.

If you want to create a Microsoft Customer Agreement subscription in a different Azure AD tenant, see [Create an MCA subscription request](create-subscription-request.md). 

If you want to create subscriptions for Enterprise Agreements, see [Create an EA subscription](create-enterprise-subscription.md). If you're a Microsoft Partner and you want to create a subscription for a customer, see [Create a subscription for a partner's customer](create-customer-subscription.md). Or, if you have a Microsoft Online Service Program (MOSP) billing account, also called pay-as-you-go, you can create subscriptions starting in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) and then you complete the process at https://signup.azure.com/.

To learn more about billing accounts and identify your billing account type, see [View billing accounts in Azure portal](view-all-accounts.md).

## Permission required to create Azure subscriptions

You need the following permissions to create subscriptions for a Microsoft Customer Agreement (MCA):

- Owner or contributor role on the invoice section, billing profile or billing account. Or Azure subscription creator role on the invoice section.  

For more information, see [Subscription billing roles and task](understand-mca-roles.md#subscription-billing-roles-and-tasks).

## Create a subscription

Use the following procedure to create a subscription for yourself or for someone in the current Azure Active Directory. When you're done, the new subscription is created immediately.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Subscriptions** and then select **Add**.  
    :::image type="content" source="./media/create-subscription/subscription-add.png" alt-text="Screenshot showing the Subscription page where you Add a subscription." lightbox="./media/create-subscription/subscription-add.png" :::
1. On the Create a subscription page, on the **Basics** tab, type a **Subscription name**.
1. Select the **Billing account** where the new subscription will get created.
1. Select the **Billing profile** where the subscription will get created.
1. Select the **Invoice section** where the subscription will get created.
1. Next to **Plan**, select **Microsoft Azure Plan for DevTest** if the subscription will be used for development or testing workloads. Otherwise, select **Microsoft Azure Plan**.  
    :::image type="content" source="./media/create-subscription/create-subscription-basics-tab.png" alt-text="Screenshot showing the Basics tab where you enter basic information about the subscription." lightbox="./media/create-subscription/create-subscription-basics-tab.png" :::
1. Select the **Advanced** tab.
1. Select your **Subscription directory**. It's the Azure Active Directory (Azure AD) where the new subscription will get created.
1. Select a **Management group**. It's the Azure AD management group that the new subscription is associated with. You can only select management groups in the current directory.
1. Select one or more **Subscription owners**. You can select only users or service principals in the selected subscription directory. You can't select guest directory users. If you select a service principal, enter its App ID.   
    :::image type="content" source="./media/create-subscription/create-subscription-advanced-tab.png" alt-text="Screenshot showing the Advanced tab where you can specify the directory, management group, and owner. " lightbox="./media/create-subscription/create-subscription-advanced-tab.png" :::
1. Select the **Tags** tab.
1. Enter tag pairs for **Name** and **Value**.  
    :::image type="content" source="./media/create-subscription/create-subscription-tags-tab.png" alt-text="Screenshot showing the tags tab where you enter tag and value pairs." lightbox="./media/create-subscription/create-subscription-tags-tab.png" :::
1. Select **Review + create**. You should see a message stating `Validation passed`.
1. Verify that the subscription information is correct, then select **Create**. You'll see a notification that the subscription is getting created.  

After the new subscription is created, the owner of the subscription can see it in on the **Subscriptions** page.

## Create an Azure subscription programmatically

You can also create subscriptions programmatically. For more information, see [Create Azure subscriptions programmatically](programmatically-create-subscription.md).

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- [Add or change Azure subscription administrators](add-change-subscription-administrator.md)
- [Move resources to new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Create management groups for resource organization and management](../../governance/management-groups/create-management-group-portal.md)
- [Cancel your Azure subscription](cancel-azure-subscription.md)
