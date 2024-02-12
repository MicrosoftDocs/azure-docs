---
title: Create a Microsoft Customer Agreement subscription request
titleSuffix: Azure Cost Management + Billing
description: Learn how to create an Azure subscription request in the Azure portal. See information about billing account forms and view other available resources.
author: bandersmsft
ms.reviewer: amberb
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 04/05/2023
ms.author: banders
---

# Create a Microsoft Customer Agreement subscription request

This article helps you create a [Microsoft Customer Agreement](https://azure.microsoft.com/pricing/purchase-options/microsoft-customer-agreement/) subscription for someone else that's in a different Microsoft Entra directory/tenant. After the request is created, the recipient accepts the subscription request. You may want another subscription to avoid hitting subscription quota limits, to create separate environments for security, or to isolate data for compliance reasons. 

If you instead want to create a subscription for yourself or for someone else in your current Microsoft Entra directory/tenant, see [Create a Microsoft Customer Agreement subscription](create-subscription.md). If you want to create subscriptions for Enterprise Agreements, see [Create an EA subscription](create-enterprise-subscription.md). If you're a Microsoft Partner and you want to create a subscription for a customer, see [Create a subscription for a partner's customer](create-customer-subscription.md). Or, if you have a Microsoft Online Service Program (MOSP) billing account, also called pay-as-you-go, you can create subscriptions starting in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) and then you complete the process at https://signup.azure.com/.

To learn more about billing accounts and identify your billing account type, see [View billing accounts in Azure portal](view-all-accounts.md).

## Permission required to create Azure subscriptions

You need one of the following permissions to create a Microsoft Customer Agreement (MCA) subscription request.

- Owner or contributor role on the invoice section, billing profile or billing account. 
- Azure subscription creator role on the invoice section.

For more information, see [Subscription billing roles and task](understand-mca-roles.md#subscription-billing-roles-and-tasks).

## Create a subscription request

The subscription creator uses the following procedure to create a subscription request for a person in a different Microsoft Entra ID. After creation, the request is sent to the subscription acceptor (recipient) by email.

A link to the subscription request is also created. The creator can manually share the link with the acceptor.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Subscriptions** and then select **Add**.  
    :::image type="content" source="./media/create-subscription-request/subscription-add.png" alt-text="Screenshot showing the Subscription page where you Add a subscription." lightbox="./media/create-subscription-request/subscription-add.png" :::
1. On the Create a subscription page, on the **Basics** tab, type a **Subscription name**.
1. Select the **Billing account** where the new subscription will get created.
1. Select the **Billing profile** where the subscription will get created.
1. Select the **Invoice section** where the subscription will get created.
1. Next to **Plan**, select **Microsoft Azure Plan for DevTest** if the subscription will be used for development or testing workloads. Otherwise, select **Microsoft Azure Plan**.  
    :::image type="content" source="./media/create-subscription-request/create-subscription-basics-tab.png" alt-text="Screenshot showing the Basics tab where you enter basic information about the subscription." lightbox="./media/create-subscription-request/create-subscription-basics-tab.png" :::
1. Select the **Advanced** tab.
1. Select your **Subscription directory**. It's the Microsoft Entra ID where the new subscription will get created.
1. The **Management group** option is unavailable because you can only select management groups in the current directory.
1. Select more or more **Subscription owners**. You can select only users or service principals in the selected subscription directory. You can't select guest directory users. If you select a service principal, enter its App ID.   
    :::image type="content" source="./media/create-subscription-request/create-subscription-advanced-tab-external.png" alt-text="Screenshot showing the Advanced tab where you specify the directory, management group, and owner. " lightbox="./media/create-subscription-request/create-subscription-advanced-tab-external.png" :::
1. Select the **Tags** tab.
1. Enter tag pairs for **Name** and **Value**.  
    :::image type="content" source="./media/create-subscription-request/create-subscription-tags-tab.png" alt-text="Screenshot showing the tags tab where you enter tag and value pairs." lightbox="./media/create-subscription-request/create-subscription-tags-tab.png" :::
1. Select **Review + create**. You should see a message stating `The subscription will be created once the subscription owner accepts this request in the target directory.`
1. Verify that the subscription information is correct, then select **Request**. You'll see a notification that the request is getting created and sent to the acceptor.

After the new subscription is sent, the acceptor receives an email with subscription acceptance information with a link where they can accept the new subscription.

The subscription creator can also view the subscription request details from **Subscriptions** > **View Requests**. There they can open the subscription request to view its details and copy the **Accept ownership URL**. Then they can manually send the link to the subscription acceptor.

:::image type="content" source="./media/create-subscription-request/view-requests-accept-url.png" alt-text="Screenshot showing the Accept ownership URL that you can copy to manually send to the acceptor." lightbox="./media/create-subscription-request/view-requests-accept-url.png" :::

## Accept subscription ownership

The subscription acceptor receives an email inviting them to accept subscription ownership. Select the **Accept ownership** get started.

:::image type="content" source="./media/create-subscription-request/accept-subscription-ownership-email.png" alt-text="Screenshot showing the email with the Accept Ownership link." lightbox="./media/create-subscription-request/accept-subscription-ownership-email.png" :::

Or, the subscription creator might have manually sent the acceptor an **Accept ownership URL** link. The acceptor uses the following steps to review and accept subscription ownership.

1. In either case above, select the link to open the Accept subscription ownership page in the Azure portal.
1. On the Basics tab, you can optionally change the subscription name.
1. Select the Advanced tab where you can optionally change the Microsoft Entra management group that the new subscription is associated with. You can only select management groups in the current directory.
1. Select the Tags tab to optionally enter tag pairs for **Name** and **Value**.
1. Select the Review + accept tab. You should see a message stating `Validation passed. Click on the Accept button below to initiate subscription creation`.
1. Select **Accept**. You'll see a status message stating that the subscription is being created. Then you'll see another status message stating th the subscription was successfully created. The acceptor becomes the subscription owner.

After the new subscription is created, the acceptor can see it in on the **Subscriptions** page.

## Create an Azure subscription programmatically

You can also create subscriptions programmatically. For more information, see [Create Azure subscriptions programmatically](programmatically-create-subscription.md).

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- [Add or change Azure subscription administrators](add-change-subscription-administrator.md)
- [Move resources to new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Create management groups for resource organization and management](../../governance/management-groups/create-management-group-portal.md)
- [Cancel your subscription for Azure](cancel-azure-subscription.md)
