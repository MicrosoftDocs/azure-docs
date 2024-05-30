---
title: Create an Enterprise Agreement subscription
titleSuffix: Azure Cost Management + Billing
description: Learn how to add a new Enterprise Agreement subscription in the Azure portal. See information about billing account forms and view other available resources.
author: bandersmsft
ms.reviewer: amberb
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 04/16/2024
ms.author: banders
---

# Create an Enterprise Agreement subscription

This article helps you create an [Enterprise Agreement (EA)](https://azure.microsoft.com/pricing/enterprise-agreement/) subscription for yourself or for someone else in your current Microsoft Entra directory/tenant. You can create another subscription to avoid hitting subscription quota limits, to create separate environments for security, or to isolate data for compliance reasons.

If you want to create subscriptions for Microsoft Customer Agreements, see [Create a Microsoft Customer Agreement subscription](create-subscription.md). If you're a Microsoft Partner and you want to create a subscription for a customer, see [Create a subscription for a partner's customer](create-customer-subscription.md). Or, if you have a Microsoft Online Service Program (MOSP) billing account, also called pay-as-you-go, you can create subscriptions starting in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) and then you complete the process at https://signup.azure.com/.

[!INCLUDE [cost-management-billing-subscription-b2b-b2c-note](../../../includes/cost-management-billing-subscription-b2b-b2c-note.md)]

To learn more about billing accounts and identify your billing account type, see [View billing accounts in Azure portal](view-all-accounts.md).

## Permission required to create Azure subscriptions

You need the following permissions to create subscriptions for an EA:

- An Enterprise Administrator can create a new subscription under any active enrollment account.
- Account Owner role on the Enterprise Agreement enrollment.

For more information, see [Understand Azure Enterprise Agreement administrative roles in Azure](understand-ea-roles.md).

## Create an EA subscription

A user with Enterprise Administrator or Account Owner permissions can use the following steps to create a new EA subscription for themselves or for another user. If the subscription is for another user, the user is sent a notification that they must approve.

>[!NOTE]
> If you want to create an Enterprise Dev/Test subscription, an enterprise administrator must enable account owners to create them. Otherwise, the option to create them isn't available. To enable the dev/test offer for an enrollment, see [Enable the enterprise dev/test offer](direct-ea-administration.md#enable-the-enterprise-devtest-offer).

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Subscriptions** and then select **Add**.  
    :::image type="content" source="./media/create-enterprise-subscription/subscription-add.png" alt-text="Screenshot showing the Subscription page where you Add a subscription." lightbox="./media/create-enterprise-subscription/subscription-add.png" :::
1. On the Create a subscription page, on the **Basics** tab, type a **Subscription name**.
1. Select the **Billing account** where the new subscription gets created.
1. Select the **Enrollment account** where the subscription gets created.
1. Select an **Offer type**, select **Enterprise Dev/Test** if the subscription is for development or testing workloads. Otherwise, select **Microsoft Azure Enterprise**.  
    :::image type="content" source="./media/create-enterprise-subscription/create-subscription-basics-tab-enterprise-agreement.png" alt-text="Screenshot showing the Basics tab where you enter basic information about the enterprise subscription." lightbox="./media/create-enterprise-subscription/create-subscription-basics-tab-enterprise-agreement.png" :::
1. Select the **Advanced** tab.
1. Select your **Subscription directory**. It's the Microsoft Entra ID where the new subscription gets created.
1. Select a **Management group**. It's the Microsoft Entra management group that the new subscription is associated with. You can only select management groups in the current directory.
1. Select more or more **Subscription owners**. You can select only users or service principals in the selected subscription directory. You can't select guest directory users. If you select a service principal, enter its App ID.   
    :::image type="content" source="./media/create-enterprise-subscription/create-subscription-advanced-tab.png" alt-text="Screenshot showing the Advanced tab where you specify the directory, management group, and owner for the EA subscription." lightbox="./media/create-enterprise-subscription/create-subscription-advanced-tab.png" :::
1. Select the **Tags** tab.
1. Enter tag pairs for **Name** and **Value**.  
    :::image type="content" source="./media/create-enterprise-subscription/create-subscription-tags-tab.png" alt-text="Screenshot showing the tags tab where you enter tag and value pairs." lightbox="./media/create-enterprise-subscription/create-subscription-tags-tab.png" :::
1. Select **Review + create**. You should see a message stating `Validation passed`.
1. Verify that the subscription information is correct, then select **Create**. You get a notification that the subscription is getting created.  

After the new subscription is created, the account owner can see it in on the **Subscriptions** page.

## View the new subscription

When you created the subscription, Azure created a notification stating **Successfully created the subscription**. The notification also had a link to **Go to subscription**, which allows you to view the new subscription. If you missed the notification, you can view select the bell symbol in the upper-right corner of the portal to view the notification that has the link to **Go to subscription**. Select the link to view the new subscription.

Here's an example of the notification:

:::image type="content" source="./media/create-enterprise-subscription/subscription-create-notification.png" alt-text="Screenshot showing the Successfully created the subscription notification." lightbox="./media/create-enterprise-subscription/subscription-create-notification.png" :::

Or, if you're already on the Subscriptions page, you can refresh your browser's view to see the new subscription.

## Create subscription in other tenant and view transfer requests

A user with the following permission can create subscriptions in their customer's directory if they're allowed or exempted with subscription policy. For more information, see [Setting subscription policy](manage-azure-subscription-policy.md#setting-subscription-policy).

- Enterprise Administrator
- Account Owner

When you try to create a subscription for someone in a directory outside of the current directory (such as a customer's tenant), a _subscription creation request_ is created. You specify the subscription directory and subscription owner details on the Advanced tab when creating the subscription. The subscription owner must accept the subscription ownership request before the subscription is created. The subscription owner is the customer in the target tenant where the subscription is being provisioned.

:::image type="content" source="./media/create-enterprise-subscription/create-subscription-other-directory.png" alt-text="Screenshot showing Create a subscription outside the current directory." lightbox="./media/create-enterprise-subscription/create-subscription-other-directory.png" :::

When the request is created, the subscription owner (the customer) is sent an email letting them know that they need to accept subscription ownership. The email contains a link used to accept ownership in the Azure portal. The customer must accept the request within seven days. If not accepted within seven days, the request expires. The person that created the request can also manually send their customer the ownership URL to accept the subscription.

After the request is created, it's visible in the Azure portal at **Subscriptions** > **View Requests** by the following people:

- The tenant global administrator of the source tenant where the subscription provisioning request is made.
- The user who made the subscription creation request for the subscription being provisioned in the other tenant.
- The user who made the request to provision the subscription in a different tenant than where they make the [Subscription – Alias REST API](/rest/api/subscription/) call instead of the Azure portal.

The subscription owner in the request who resides in the target tenant doesn't see this subscription creation request on the View requests page. Instead, they receive an email with the link to accept ownership of the subscription in the target tenant.

:::image type="content" source="./media/create-enterprise-subscription/view-requests.png" alt-text="Screenshot showing View Requests page that lists all subscription creation requests." lightbox="./media/create-enterprise-subscription/view-requests.png" :::

Anyone with access to view the request can view its details. In the request details, the **Accept ownership URL** is visible. You can copy it to manually share it with the subscription owner in the target tenant for subscription ownership acceptance.

## Can't view subscription

If you created a subscription but can't find it in the Subscriptions list view, a view filter might be applied.

To clear the filter and view all subscriptions:

1. In the Azure portal, navigate to **Subscriptions**.
2. At the top of the list, select the Subscriptions filter item.
3. At the top of the subscriptions filter box, select **All**. At the bottom of the subscriptions filter box, clear **Show only subscriptions selected in the global subscriptions filter**.  
    :::image type="content" source="./media/create-enterprise-subscription/subscriptions-filter-item.png" alt-text="Screenshot showing the Subscriptions filter box with options." lightbox="./media/create-enterprise-subscription/subscriptions-filter-item.png" :::
4. Select **Apply** to close the box and refresh the list of subscriptions.

## Create an Azure subscription programmatically

You can also create subscriptions programmatically. For more information, see [Create Azure subscriptions programmatically](programmatically-create-subscription.md).

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Related content

- [Add or change Azure subscription administrators](add-change-subscription-administrator.md)
- [Move resources to new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Create management groups for resource organization and management](../../governance/management-groups/create-management-group-portal.md)
- [Cancel your subscription for Azure](cancel-azure-subscription.md)
