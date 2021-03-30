---
title: About transferring billing ownership for an Azure subscription
description: This article explains the things you need to know before you transfer billing ownership of an Azure subscription to another account.
keywords: transfer azure subscription, azure transfer subscription, move azure subscription to another account,azure change subscription owner, transfer azure subscription to another account, azure transfer billing
author: bandersmsft
ms.reviewer: amberb
tags: billing,top-support-issue
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 09/22/2020
ms.author: banders
ms.custom: contperf-fy21q1
---

# About transferring billing ownership for an Azure subscription

This article helps you understand the things you should know before you transfer billing ownership of an Azure subscription to another account. 

You might want to transfer billing ownership of your Azure subscription if you're leaving your organization, or you want your subscription to be billed to another account. Transferring billing ownership to another account provides the administrators in the new account permission for billing tasks. They can change the payment method, view charges, and cancel the subscription.

If you want to keep the billing ownership but change the type of your subscription, see [Switch your Azure subscription to another offer](../manage/switch-azure-offer.md). To control who can access resources in the subscription, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md).

If you're an Enterprise Agreement (EA) customer, your enterprise administrators can transfer billing ownership of your subscriptions between accounts.

Only the billing administrator of an account can transfer ownership of a subscription.

## Determine if you are a billing administrator

<a name="whoisaa"></a>

In effort to do the transfer, locate the person who has access to manage billing for an account. They're authorized to access billing on the [Azure portal](https://portal.azure.com) and do various billing tasks like create subscriptions, view and pay invoices, or update payment methods.

### Check if you have billing access

1. To identify accounts for which you have billing access, visit the [Cost Management + Billing page in Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/ModernBillingMenuBlade/Overview).

2. Select **Billing accounts** from the left-hand menu.

3. The **Billing scope** listing page shows all the subscriptions where you have access to the billing details.

### Check by subscription

1. If you're not sure who the account administrator is for a subscription, visit the [Subscriptions page in Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade). 

2. Select the subscription you want to check.

3. Under the **Settings** heading, select **Properties**. See the **Account Admin** box to understand who is the account administrator of the subscription.

   > [!NOTE]
   > Not all subscription types show the Properties.

## Supported subscription types

Subscription transfer in the Azure portal is available for the subscription types listed below. Currently transfer isn't supported for [Free Trial](https://azure.microsoft.com/offers/ms-azr-0044p/) or [Azure in Open (AIO)](https://azure.microsoft.com/offers/ms-azr-0111p/) subscriptions. For a workaround, see [Move resources to new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md). To transfer other subscriptions, like support plans, [contact Azure Support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

- [Enterprise Agreement (EA)](https://azure.microsoft.com/pricing/enterprise-agreement/)<sup>1</sup>
- [Microsoft Partner Network](https://azure.microsoft.com/offers/ms-azr-0025p/)  
- [Visual Studio Enterprise (MPN) subscribers](https://azure.microsoft.com/offers/ms-azr-0029p/)
- [MSDN Platforms](https://azure.microsoft.com/offers/ms-azr-0062p/)  
- [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0003p/)
- [Pay-As-You-Go Dev/Test](https://azure.microsoft.com/offers/ms-azr-0023p/)
- [Visual Studio Enterprise](https://azure.microsoft.com/offers/ms-azr-0063p/)
- [Visual Studio Enterprise: BizSpark](https://azure.microsoft.com/offers/ms-azr-0064p/)
- [Visual Studio Professional](https://azure.microsoft.com/offers/ms-azr-0059p/)
- [Visual Studio Test Professional](https://azure.microsoft.com/offers/ms-azr-0060p/)
- [Microsoft Azure Plan](https://azure.microsoft.com/offers/ms-azr-0017g/)<sup>2</sup>

<sup>1</sup> Using the EA portal.

<sup>2</sup> Only supported for accounts that are created during sign-up on the Azure website.

## Resources transferred with subscriptions

All your resources like VMs, disks, and websites transfer to the new account. However, if you transfer a subscription to an account in another Azure AD tenant, any [administrator roles](../manage/add-change-subscription-administrator.md) and [Azure role assignments](../../role-based-access-control/role-assignments-portal.md) on the subscription don't transfer. Also, [app registrations](../../active-directory/develop/quickstart-register-app.md) and other tenant-specific services don't transfer along with the subscription.

## Transfer account ownership to another country/region

Unfortunately, you can't transfer subscriptions across countries or regions using the Azure portal. However they can get transferred if you open an Azure support request. To create a support request, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## Transfer a subscription from one account to another

If you're an administrator of two accounts, your can transfer a subscription between your accounts. Your accounts are conceptually considered accounts of two different users so you can transfer subscriptions between your accounts.
To view the steps needed to transfer your subscription, see [Transfer billing ownership of an Azure subscription](../manage/billing-subscription-transfer.md).

## Transferring a subscription shouldn't create downtime

If you transfer a subscription to an account in the same Azure AD tenant, there's no impact to the resources running in the subscription. However, context information saved in PowerShell isn't updated so you might have to clear it or change settings. If you transfer the subscription to an account in another tenant and decide to move the subscription to the tenant, all users, groups, and service principals who had [Azure role assignments](../../role-based-access-control/role-assignments-portal.md) to access resources in the subscription lose their access. Service downtime might result.

## New account usage and billing history

The only information available to the users for the new account is the last month's cost for your subscription. The rest of the usage and billing history doesn't transfer with the subscription.

## Manually migrate data and services

When you transfer a subscription, its resources stay with it. If you can't transfer subscription ownership, you can manually migrate its resources. For more information, see [Move resources to new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md).

## Remaining subscription credits 

If you have a Visual Studio or Microsoft Partner Network subscription, you get monthly credits. Your credit doesn't carry forward with the subscription in the new account. The user who accepts the transfer request needs to have a Visual Studio license to accept the transfer request. The subscription uses the Visual Studio credit that's available in the user's account. For more information, see [Transferring Visual Studio and Partner Network subscriptions](../manage/billing-subscription-transfer.md#transfer-visual-studio-and-partner-network-subscriptions).

## Users keep access to transferred resources

Keep in mind that users with access to resources in a subscription keep their access when ownership is transferred. However, [administrator roles](../manage/add-change-subscription-administrator.md) and [Azure role assignments](../../role-based-access-control/role-assignments-portal.md) might get removed. Losing access occurs when your account is in an Azure AD tenant other than the subscription's tenant and the user who sent the transfer request moves the subscription to your account's tenant. 

You can view the users who have Azure role assignments to access resources in the subscription in the Azure portal. Visit the [Subscription page in the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade). Then select the subscription you want to check, and then select **Access control (IAM)** from the left-hand pane. Next, select **Role assignments** from the top of the page. The role assignments page lists all users who have access on the subscription.

Even if the [Azure role assignments](../../role-based-access-control/role-assignments-portal.md) are removed during transfer, users in the original owner account might continue to have access to the subscription through other security mechanisms, including:

* Management certificates that grant the user admin rights to subscription resources. For more information, see [Create and Upload a Management Certificate for Azure](../../cloud-services/cloud-services-certs-create.md).
* Access keys for services like Storage. For more information, see [About Azure storage accounts](../../storage/common/storage-account-create.md).
* Remote Access credentials for services like Azure Virtual Machines.

If the recipient needs to restrict access to resources, they should consider updating any secrets associated with the service. Most resources can be updated. Sign in to the [Azure portal](https://portal.azure.com) and then on the Hub menu, select **All resources**. Next, Select the resource. Then in the resource page, select **Settings**. There you can view and update existing secrets.

## You pay for usage when you receive ownership

Your account is responsible for payment for any usage that is reported from the time of transfer onwards. There may be some usage that took place before transfer but was reported afterwards. The usage is included in your account's bill.

## Use a different payment method

While accepting the transfer request, you can select an existing payment method that's linked to your account or add a new payment method.

## Transfer Enterprise Agreement subscription ownership

The Enterprise Administrator can update account ownership for any account, even after an original account owner is no longer part of the organization. For more information about transferring Azure Enterprise Agreement accounts, see [Azure Enterprise transfers](../manage/ea-transfers.md).

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- [Transfer billing ownership of an Azure subscription](../manage/billing-subscription-transfer.md)
