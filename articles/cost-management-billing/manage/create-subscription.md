---
title: Create a Microsoft Customer Agreement subscription
titleSuffix: Azure Cost Management + Billing
description: Learn how to add a new Microsoft Customer Agreement subscription in the Azure portal. See information about billing account forms and view other available resources.
author: bandersmsft
ms.reviewer: amberb
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 03/21/2024
ms.author: banders
---

# Create a Microsoft Customer Agreement subscription

This article helps you create a [Microsoft Customer Agreement](https://azure.microsoft.com/pricing/purchase-options/microsoft-customer-agreement/) subscription for yourself or for someone else in your current Microsoft Entra directory/tenant. You may want another subscription to avoid hitting subscription quota limits, to create separate environments for security, or to isolate data for compliance reasons.

If you want to create a Microsoft Customer Agreement subscription in a different Microsoft Entra tenant, see [Create an MCA subscription request](create-subscription-request.md). 

If you want to create subscriptions for Enterprise Agreements, see [Create an EA subscription](create-enterprise-subscription.md). If you're a Microsoft Partner and you want to create a subscription for a customer, see [Create a subscription for a partner's customer](create-customer-subscription.md). Or, if you have a Microsoft Online Service Program (MOSP) billing account, also called pay-as-you-go, you can create subscriptions starting in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) and then you complete the process at https://signup.azure.com/.

[!INCLUDE [cost-management-billing-subscription-b2b-b2c-note](../../../includes/cost-management-billing-subscription-b2b-b2c-note.md)]

To learn more about billing accounts and identify your billing account type, see [View billing accounts in Azure portal](view-all-accounts.md).

## Permission required to create Azure subscriptions

You need the following permissions to create subscriptions for a Microsoft Customer Agreement (MCA):

- Owner or contributor role on the invoice section, billing profile or billing account. Or Azure subscription creator role on the invoice section.  

For more information, see [Subscription billing roles and task](understand-mca-roles.md#subscription-billing-roles-and-tasks).

## Create a subscription

Use the following procedure to create a subscription for yourself or for someone in the current Microsoft Entra ID. When you're done, the new subscription is created immediately.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Subscriptions** and then select **Add**.  
    :::image type="content" source="./media/create-subscription/subscription-add.png" alt-text="Screenshot showing the Subscription page where you Add a subscription." lightbox="./media/create-subscription/subscription-add.png" :::
1. On the Create a subscription page, on the **Basics** tab, type a **Subscription name**.
1. Select the **Billing account** where the new subscription gets created.
1. Select the **Billing profile** where the subscription gets created.
1. Select the **Invoice section** where the subscription gets created.
1. Next to **Plan**, select **Microsoft Azure Plan for DevTest** if the subscription is used for development or testing workloads. Otherwise, select **Microsoft Azure Plan**.  
    :::image type="content" source="./media/create-subscription/create-subscription-basics-tab.png" alt-text="Screenshot showing the Basics tab where you enter basic information about the subscription." lightbox="./media/create-subscription/create-subscription-basics-tab.png" :::
1. Select the **Advanced** tab.
1. Select your **Subscription directory**. It's the Microsoft Entra ID where the new subscription gets created.
1. Select a **Management group**. It's the Microsoft Entra management group that the new subscription is associated with. You can only select management groups in the current directory.
1. Select one or more **Subscription owners**. You can select only users or service principals in the selected subscription directory. You can't select guest directory users. If you select a service principal, enter its App ID.   
    :::image type="content" source="./media/create-subscription/create-subscription-advanced-tab.png" alt-text="Screenshot showing the Advanced tab where you can specify the directory, management group, and owner." lightbox="./media/create-subscription/create-subscription-advanced-tab.png" :::
1. Select the **Tags** tab.
1. Enter tag pairs for **Name** and **Value**.  
    :::image type="content" source="./media/create-subscription/create-subscription-tags-tab.png" alt-text="Screenshot showing the tags tab where you enter tag and value pairs." lightbox="./media/create-subscription/create-subscription-tags-tab.png" :::
1. Select **Review + create**. You should see a message stating `Validation passed`.
1. Verify that the subscription information is correct, then select **Create**. A notification that the subscription is getting created is shown.  

After the new subscription is created, the owner of the subscription can see it in on the **Subscriptions** page.

## View the new subscription

When you created the subscription, Azure created a notification stating **Successfully created the subscription**. The notification also had a link to **Go to subscription**, which allows you to view the new subscription. If you missed the notification, you can view select the bell symbol in the upper-right corner of the portal to view the notification that has the link to **Go to subscription**. Select the link to view the new subscription.

Here's an example of the notification:

:::image type="content" source="./media/create-subscription/subscription-create-notification.png" alt-text="Screenshot showing the Successfully created the subscription notification." lightbox="./media/create-subscription/subscription-create-notification.png" :::

Or, if you're already on the Subscriptions page, you can refresh your browser's view to see the new subscription.

## View all subscriptions

If you created a subscription but can't find it in the Subscriptions list view, a view filter might be applied.

To clear the filter and view all subscriptions:

1. In the Azure portal, navigate to **Subscriptions**.
2. At the top of the list, select the Subscriptions filter item.  
3. At the top of the subscriptions filter box, select **All**. At the bottom of the subscriptions filter box, clear **Show only subscriptions selected in the global subscriptions filter**.  
    :::image type="content" source="./media/create-subscription/subscriptions-filter-item.png" alt-text="Screenshot showing the Subscriptions filter box with options." lightbox="./media/create-subscription/subscriptions-filter-item.png" :::
4. Select **Apply** to close the box and refresh the list of subscriptions.

## Create subscription in other tenant and view transfer requests

A user with the following permission can create subscriptions in their customer's directory if they're allowed or exempted with subscription policy. For more information, see [Setting subscription policy](manage-azure-subscription-policy.md#setting-subscription-policy).

- Billing account owner or contributor
- Billing profile owner or contributor
- Invoice section owner

When you try to create a subscription for someone in a directory outside of the current directory (such as a customer's tenant), a _subscription creation request_ is created.

:::image type="content" source="./media/create-subscription/create-subscription-other-directory.png" alt-text="Screenshot showing Create a subscription outside the current directory." lightbox="./media/create-subscription/create-subscription-other-directory.png" :::

When the request is created, the subscription owner (the customer) is sent an email letting them know that they need to accept subscription ownership. The email contains a link used to accept ownership in the Azure portal. The customer must accept the request within seven days. If not accepted within seven days, the request expires. The person that created the request can also manually send their customer the ownership URL to accept the subscription.

After the request is created, it's visible in the Azure portal at **Subscriptions** > **View Requests** by the following people:

- The tenant global administrator of the source tenant where the subscription provisioning request is made.
- The user who made the subscription creation request for the subscription being provisioned in the other tenant.
- The user who made the request to provision the subscription in a different tenant than where they make the [Subscription – Alias REST API](/rest/api/subscription/) call instead of the Azure portal.

The subscription owner in the request who resides in the target tenant doesn't see this subscription creation request on the View requests page. Instead, they receive an email with the link to accept ownership of the subscription in the target tenant.

:::image type="content" source="./media/create-subscription/view-requests.png" alt-text="Screenshot showing View Requests page that lists all subscription creation requests." lightbox="./media/create-subscription/view-requests.png" :::

Anyone with access to view the request can view its details. In the request details, the **Accept ownership URL** is visible. You can copy it to manually share it with the subscription owner in the target tenant for subscription ownership acceptance.

:::image type="content" source="./media/create-subscription/request-details.png" alt-text="Screenshot showing request details to view Accept ownership URL." lightbox="./media/create-subscription/request-details.png" :::

## Create an Azure subscription programmatically

You can also create subscriptions programmatically. For more information, see [Create Azure subscriptions programmatically](programmatically-create-subscription.md).

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- [Add or change Azure subscription administrators](add-change-subscription-administrator.md)
- [Move resources to new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Create management groups for resource organization and management](../../governance/management-groups/create-management-group-portal.md)
- [Cancel your Azure subscription](cancel-azure-subscription.md)
