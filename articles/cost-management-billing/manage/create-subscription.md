---
title: Create an additional Azure subscription
description: Learn how to add a new Azure subscription in the Azure portal. See information about billing account forms and view additional available resources.
author: bandersmsft
ms.reviewer: amberb
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 05/17/2021
ms.author: banders
---

# Create an additional Azure subscription

This article helps you create an additional subscription for your [Enterprise Agreement (EA)](https://azure.microsoft.com/pricing/enterprise-agreement/), [Microsoft Customer Agreement](https://azure.microsoft.com/pricing/purchase-options/microsoft-customer-agreement/) or [Microsoft Partner Agreement](https://www.microsoft.com/licensing/news/introducing-microsoft-partner-agreement) billing account in the Azure portal. You may want an additional subscription to avoid hitting subscription limits, to create separate environments for security, or to isolate data for compliance reasons.

If you have a Microsoft Online Service Program (MOSP) billing account, also called pay-as-you-go, you can create additional subscriptions starting in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) and then you complete the process at https://signup.azure.com/.

To learn more about billing accounts and identify your billing account type, see [View billing accounts in Azure portal](view-all-accounts.md).

## Permission required to create Azure subscriptions

You need the following permissions to create subscriptions:

|Billing account  |Permission  |
|---------|---------|
|Enterprise Agreement (EA) |  Account Owner role on the Enterprise Agreement enrollment. For more information, see [Understand Azure Enterprise Agreement administrative roles in Azure](understand-ea-roles.md).    |
|Microsoft Customer Agreement (MCA) |  Owner or contributor role on the invoice section, billing profile or billing account. Or Azure subscription creator role on the invoice section.  For more information, see [Subscription billing roles and task](understand-mca-roles.md#subscription-billing-roles-and-tasks).    |
|Microsoft Partner Agreement (MPA) |   Global Admin and Admin Agent role in the CSP partner organization. To learn more, see [Partner Center - Assign users roles and permissions](/partner-center/permissions-overview).  The user needs to sign in to the partner tenant to create Azure subscriptions.   |

## Create a Microsoft Customer Agreement subscription

Use the information in the following sections to create a subscription, create a subscription request, and to accept a subscription request.

### Create a subscription

Use the following procedure to create a subscription for yourself or for someone in the current Azure Active Directory. When you're done, the new subscription is created immediately.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Subscriptions** and then select **Add**.  
    :::image type="content" source="./media/create-subscription/subscription-add.png" alt-text="Screenshot showing the Subscription page where you Add a subscription." lightbox="./media/create-subscription/subscription-add.png" :::
1. On the Create a subscription page, on the **Basics** tab, type a **Subscription name**.
1. Select the **Billing account** where the new subscription will get created.
1. Select the **Billing profile** where the subscription will get created.
1. Select the **Invoice section** where the subscription will get created.
1. Next to **Plan**, select **Microsoft Azure Plan** for DevTest if the subscription will be used for development or testing workloads. Otherwise, select **Microsoft Azure Plan**.  
    :::image type="content" source="./media/create-subscription/create-subscription-basics-tab.png" alt-text="Screenshot showing the Basics tab where you enter basic information about the subscription." lightbox="./media/create-subscription/create-subscription-basics-tab.png" :::
1. Select the **Advanced** tab.
1. Select your **Subscription directory**. It's the Azure Active Directory (Azure AD) where the new subscription will get created.
1. Select a **Management group**. It's the Azure AD management group that the new subscription is associated with. You can only select management groups in the current directory.
1. Select more or more **Subscription owners**. You can select only users or service principals in the selected subscription directory. You can't select guest directory users. If you select a service principal, enter its App ID.   
    :::image type="content" source="./media/create-subscription/create-subscription-advanced-tab.png" alt-text="Screenshot showing the Advanced tab where you can specify the directory, management group, and owner. " lightbox="./media/create-subscription/create-subscription-advanced-tab.png" :::
1. Select the **Tags** tab.
1. Enter tag pairs for **Name** and **Value**.  
    :::image type="content" source="./media/create-subscription/create-subscription-tags-tab.png" alt-text="Screenshot showing the tags tab where you enter tag and value pairs." lightbox="./media/create-subscription/create-subscription-tags-tab.png" :::
1. Select **Review + create**. You should see a message stating `Validation passed`.
1. Verify that the subscription information is correct, then select **Create**. You'll see a notification that the subscription is getting created.  

After the new subscription is created, you'll see it in on the **Subscriptions** page.

### Create a subscription request

The subscription creator uses the following procedure to create a subscription request for a person in a different Azure Active Directory (Azure AD). After creation, the request is sent to the subscription acceptor (recipient) by email. 

A link to the subscription request is also created. The creator can manually share the link with the acceptor.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Subscriptions** and then select **Add**.  
    :::image type="content" source="./media/create-subscription/subscription-add.png" alt-text="Screenshot showing the Subscription page where you Add a subscription." lightbox="./media/create-subscription/subscription-add.png" :::
1. On the Create a subscription page, on the **Basics** tab, type a **Subscription name**.
1. Select the **Billing account** where the new subscription will get created.
1. Select the **Billing profile** where the subscription will get created.
1. Select the **Invoice section** where the subscription will get created.
1. Next to **Plan**, select **Microsoft Azure Plan** for DevTest if the subscription will be used for development or testing workloads. Otherwise, select **Microsoft Azure Plan**.  
    :::image type="content" source="./media/create-subscription/create-subscription-basics-tab.png" alt-text="Screenshot showing the Basics tab where you enter basic information about the subscription." lightbox="./media/create-subscription/create-subscription-basics-tab.png" :::
1. Select the **Advanced** tab.
1. Select your **Subscription directory**. It's the Azure Active Directory (Azure AD) where the new subscription will get created.
1. The **Management group** option is unavailable because you can only select management groups in the current directory.
1. Select more or more **Subscription owners**. You can select only users or service principals in the selected subscription directory. You can't select guest directory users. If you select a service principal, enter its App ID.   
    :::image type="content" source="./media/create-subscription/create-subscription-advanced-tab-external.png" alt-text="Screenshot showing the Advanced tab where you can specify the directory, management group, and owner. " lightbox="./media/create-subscription/create-subscription-advanced-tab-external.png" :::
1. Select the **Tags** tab.
1. Enter tag pairs for **Name** and **Value**.  
    :::image type="content" source="./media/create-subscription/create-subscription-tags-tab.png" alt-text="Screenshot showing the tags tab where you enter tag and value pairs." lightbox="./media/create-subscription/create-subscription-tags-tab.png" :::
1. Select **Review + create**. You should see a message stating `The subscription will be created once the subscription owner accepts this request in the target directory.`
1. Verify that the subscription information is correct, then select **Request**. You'll see a notification that the request is getting created and sent to the acceptor.

After the new subscription is sent, the acceptor receives an email with subscription acceptance information with a link where they can accept the new subscription.

The subscription creator can also view the subscription request details from **Subscriptions** > **View Requests**. There they can open the subscription request to view its details and copy the **Accept ownership URL**. Then they can manually send the link to the subscription acceptor.

:::image type="content" source="./media/create-subscription/view-requests-accept-url.png" alt-text="Screenshot showing the Accept ownership URL that you can copy to manually send to the acceptor." lightbox="./media/create-subscription/view-requests-accept-url.png" :::

### Accept subscription ownership

The subscription acceptor receives an email inviting them to accept subscription ownership. Select the **Accept ownership** get started.

:::image type="content" source="./media/create-subscription/accept-subscription-ownership-email.png" alt-text="ALTTEXT" lightbox="./media/create-subscription/accept-subscription-ownership-email.png" :::

Or, the subscription creator might have manually sent the acceptor an **Accept ownership URL** link. The acceptor uses the following steps to review and accept subscription ownership.

1. In either case above, select the link to open the Accept subscription ownership page in the Azure portal.
1. On the Basics tab, you can optionally change the subscription name.
1. Select the Advanced tab where you can optionally change the Azure AD management group that the new subscription is associated with. You can only select management groups in the current directory.
1. Select the Tags tab to optionally enter tag pairs for **Name** and **Value**.
1. Select the Review + accept tab. You should see a message stating `Validation passed. Click on the Accept button below to initiate subscription creation`.
1. Select **Accept**. You'll see a status message stating that the subscription is being created. Then you'll see another status message stating th the subscription was successfully created.

After the new subscription is created, you'll see it in on the **Subscriptions** page.

## Create an EA subscription

Use the following information to create an EA subscription.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Subscriptions** and then select **Add**.  
    :::image type="content" source="./media/create-subscription/subscription-add.png" alt-text="Screenshot showing the Subscription page where you Add a subscription." lightbox="./media/create-subscription/subscription-add.png" :::
1. On the Create a subscription page, on the **Basics** tab, type a **Subscription name**.
1. Select the **Billing account** where the new subscription will get created.
1. Select the **Enrollment account** where the subscription will get created.
1. Select an **Offer type**, select **Enterprise Dev/Test** if the subscription will be used for development or testing workloads. Otherwise, select **Microsoft Azure Enterprise**.  
    :::image type="content" source="./media/create-subscription/create-subscription-basics-tab-enterprise-agreement.png" alt-text="Screenshot showing the Basics tab where you enter basic information about the enterprise subscription." lightbox="./media/create-subscription/create-subscription-basics-tab-enterprise-agreement.png" :::
1. Select the **Advanced** tab.
1. Select your **Subscription directory**. It's the Azure Active Directory (Azure AD) where the new subscription will get created.
1. Select a **Management group**. It's the Azure AD management group that the new subscription is associated with. You can only select management groups in the current directory.
1. Select more or more **Subscription owners**. You can select only users or service principals in the selected subscription directory. You can't select guest directory users. If you select a service principal, enter its App ID.   
    :::image type="content" source="./media/create-subscription/create-subscription-advanced-tab.png" alt-text="Screenshot showing the Advanced tab where you can specify the directory, management group, and owner. " lightbox="./media/create-subscription/create-subscription-advanced-tab.png" :::
1. Select the **Tags** tab.
1. Enter tag pairs for **Name** and **Value**.  
    :::image type="content" source="./media/create-subscription/create-subscription-tags-tab.png" alt-text="Screenshot showing the tags tab where you enter tag and value pairs." lightbox="./media/create-subscription/create-subscription-tags-tab.png" :::
1. Select **Review + create**. You should see a message stating `Validation passed`.
1. Verify that the subscription information is correct, then select **Create**. You'll see a notification that the subscription is getting created.  

After the new subscription is created, you'll see it in on the **Subscriptions** page.

## Create a subscription as a partner for a customer

Partners with a Microsoft Partner Agreement use the following steps to create a new Microsoft Azure Plan subscription for their customers. The subscription is created under the partner’s billing account and billing profile.

1.	Sign in to the Azure portal using your Partner Center account.
Make sure you are in your Partner Center directory (tenant), not a customer’s tenant.
1.	Navigate to **Cost Management + Billing**.
1.	Select the Billing scope for the billing account where the customer account resides.
1.	In the left menu under **Billing**, select **Customers**.
1.	On the Customers page, select the customer. If you have only one customer, the selection is unavailable.
1.	In the left menu, under **Products + services**, select **Azure Subscriptions**.
1.	On the Azure subscription page, select **+ Add** to create a subscription.
1.	Enter details about the subscription and when complete, select **Review + create**.

## Create an additional Azure subscription programmatically

You can also create additional subscriptions programmatically. For more information, see:

- [Create EA subscriptions programmatically with latest API](programmatically-create-subscription-enterprise-agreement.md)
- [Create MCA subscriptions programmatically with latest API](programmatically-create-subscription-microsoft-customer-agreement.md)
- [Create MPA subscriptions programmatically with latest API](Programmatically-create-subscription-microsoft-customer-agreement.md)

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- [Add or change Azure subscription administrators](add-change-subscription-administrator.md)
- [Move resources to new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Create management groups for resource organization and management](../../governance/management-groups/create-management-group-portal.md)
- [Cancel your subscription for Azure](cancel-azure-subscription.md)

