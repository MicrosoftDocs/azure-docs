---
title: Azure subscription transfer hub
description: This article helps you understand what's needed to transfer Azure subscriptions and provides links to other articles for more detailed information.
author: bandersmsft
ms.reviewer: jatracey
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 07/27/2021
ms.author: banders
ms.custom:
---

# Azure subscription transfer hub

This article describes the types of supported Azure subscription transfers. It also helps you understand what's needed to transfer Azure subscriptions between different billing models and types and then provides links to other articles for more detailed information about specific transfers. Azure subscriptions are created upon different Azure agreement types and a transfer from a source agreement type to another varies depending on the source and destination agreement types. Subscription transfers can be an automatic or a manual process, depending on the source and destination subscription type. If it's a manual process, the subscription agreement types determine how much manual effort is needed.

>[!NOTE]
>There are many types of Azure subscriptions, however not every subscription can be transferred from one type to another. Only supported subscription transfers are documented in this article. If you need help with a situation that isn't addressed in this article, you can create an [Azure support request](https://go.microsoft.com/fwlink/?linkid=2083458) for assistance.

This article also helps you understand the things you should know *before* you transfer billing ownership of an Azure subscription to another account. You might want to transfer billing ownership of your Azure subscription if you're leaving your organization, or you want your subscription to be billed to another account. Transferring billing ownership to another account provides the administrators in the new account permission for billing tasks. They can change the payment method, view charges, and cancel the subscription.

If you want to keep the billing ownership but change the type of your subscription, see [Switch your Azure subscription to another offer](../manage/switch-azure-offer.md). To control who can access resources in the subscription, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md).

If you're an Enterprise Agreement (EA) customer, your enterprise administrators can transfer billing ownership of your subscriptions between accounts in the EA portal. For more information, see [Change Azure subscription or account ownership](ea-portal-administration.md#change-azure-subscription-or-account-ownership).

This article focuses on subscription transfers. However, resource transfer is also discussed because it's required for some subscription transfer scenarios.

For more information about subscription transfers between different Azure AD tenants, see [Transfer an Azure subscription to a different Azure AD directory](../../role-based-access-control/transfer-subscription.md).


> [!NOTE]
> The rest of this article refers to subscription transfers in the same Azure AD tenant, unless otherwise specified.

## Subscription transfer planning

As you begin to plan your subscription transfer, consider the information needed to answer to the following questions:

- Why is the subscription transfer required?
- What are the wanted timelines for the subscription transfer?
- What is the subscription's current offer type and what do you want to transfer it too?
  - Microsoft Online Service Program (MOSP), also known as Pay-As-You-Go (PAYG)
  - Azure in CSP (Microsoft Cloud Solution Provider)
  - Azure Plan with a Microsoft Partner Agreement (MPA)
  - Enterprise Agreement (EA)
  - Microsoft Customer Agreement (MCA)
  - Others like MSDN, BizSpark, EOPEN, Azure Pass, and Free Trial
- Do you have the required permissions on the subscription to accomplish a transfer? Only the billing administrator of an account can transfer ownership of a subscription.
- Does the source subscription have reservations? If so, will the reservation transfer to the destination subscription?

You should have an answer for each question before you continue with any transfer.

Answers help you to communicate early with others to set expectations and timelines. Subscription transfer effort varies greatly, but a transfer is likely to take longer than expected.

Answers for the source and destination offer type questions help define technical paths that you'll need to follow and identify limitations that a transfer combination might have. Limitations are covered in more detail in the next section.

## Subscription transfer support

The following table describes subscription transfer support between the different agreement types. Links are provided for more information about each type of transfer.

Currently transfer isn't supported for [Free Trial](https://azure.microsoft.com/offers/ms-azr-0044p/) or [Azure in Open (AIO)](https://azure.microsoft.com/offers/ms-azr-0111p/) subscriptions. For a workaround, see [Move resources to new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md). To transfer other subscriptions, like support plans, [contact Azure Support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

Dev/Test subscriptions aren't shown in the following table. Transfers for Dev/Test subscriptions are handled in the same way as other subscription types. For example, an EA Dev/Test subscription transfer is handled in the way an EA subscription transfer.

>[!NOTE]
>Reservations transfer for most supported subscription transfers. However, there are some transfers where reservations won't transfer, as noted in the following table.

| **Source subscription type** | **Destination subscription type** | **Notes** |
| :---: | :---: | :---: |
| EA | MOSP (PAYG) |  <ul> <li>Transfer to an EA enrollment requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). <li>Reservations don't automatically transfer and transferring them isn't supported.</ul> |
| EA | MCA - individual |  <ul> <li>For details, see [Transfer Azure subscription billing ownership for a Microsoft Customer Agreement](mca-request-billing-ownership.md). <li>Reservations don't automatically transfer so you must open a [billing support ticket](https://azure.microsoft.com/support/create-ticket/) to transfer them. </ul>  |
| EA | EA |  <ul> <li>Transferring between EA enrollments requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). <li>Reservations don't automatically transfer between enrollments so you must open a [billing support ticket](https://azure.microsoft.com/support/create-ticket/) to transfer them.<li> Transfer within the same enrollment is the same action as changing the account owner. For details, see [Change EA subscription or account ownership](ea-portal-administration.md#change-azure-subscription-or-account-ownership). </ul>|
| EA | MCA - Enterprise |  <ul><li>Transferring all enrollment subscriptions is completed as part of the MCA transition process from an EA. For more information, see [Complete Enterprise Agreement tasks in your billing account for a Microsoft Customer Agreement](mca-enterprise-operations.md). <li>If you want to transfer specific subscriptions, not all of the subscriptions in an enrollment, see [Transfer Azure subscription billing ownership for a Microsoft Customer Agreement](mca-request-billing-ownership.md). </ul>|
| EA | MPA |  <ul><li>Only CSP direct bill partners certified as an [Azure Expert Managed Services Provider (MSP)](https://partner.microsoft.com/membership/azure-expert-msp) can request to transfer Azure subscriptions for their customers that have a Direct Enterprise Agreement (EA). Subscription transfers are allowed only for customers who have accepted a Microsoft Customer Agreement (MCA) and purchased an Azure plan with the CSP Program. <li>There are limitations and restrictions. For more information, see [Transfer EA subscriptions to a CSP partner](transfer-subscriptions-subscribers-csp.md#transfer-ea-subscriptions-to-a-csp-partner). </ul>|
| MCA - individual | MOSP (PAYG) |   <ul> <li>For details, see [Transfer billing ownership of an Azure subscription to another account](billing-subscription-transfer.md). <li>Reservations don't automatically transfer and transferring them isn't supported. </ul>|
| MCA - individual | MCA - individual |   For details, see [Transfer Azure subscription billing ownership for a Microsoft Customer Agreement](mca-request-billing-ownership.md).  |
| MCA - individual | EA | For details, see [Transfer a subscription to an EA](mosp-ea-transfer.md#transfer-the-subscription-to-the-ea).  |
| MCA - individual | MCA - Enterprise |  For details, see [Transfer Azure subscription billing ownership for a Microsoft Customer Agreement](mca-request-billing-ownership.md). |
| MCA - Enterprise | MOSP |  <ul> <li>Requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). <li>Reservations don't automatically transfer and transferring them isn't supported.</ul> |
| MCA - Enterprise | MCA - individual |   <ul> <li>For details, see [Transfer Azure subscription billing ownership for a Microsoft Customer Agreement](mca-request-billing-ownership.md). <li>Reservations don't automatically transfer so you must open a [billing support ticket](https://azure.microsoft.com/support/create-ticket/) to transfer them. </ul>|
| MCA - Enterprise | EA |  <ul><li> Requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). <li>Reservations don't automatically transfer so you must open a [billing support ticket](https://azure.microsoft.com/support/create-ticket/) to transfer them. </ul>|
| MCA - Enterprise | MCA - Enterprise |   <ul> <li>For details, see [Transfer Azure subscription billing ownership for a Microsoft Customer Agreement](mca-request-billing-ownership.md). </ul>|
| Azure in CSP | Azure in CSP | <ul><li>Requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). <li>Reservations don't automatically transfer and transferring them isn't supported. |
| Azure in CSP | MPA | For details, see [Transfer a customer's Azure subscriptions to a different CSP (under an Azure plan)](/partner-center/transfer-azure-subscriptions-under-azure-plan).  |
| MPA | EA |  <ul><li>Requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). <li>The transfer requires resources to move from the existing MPA subscription to a newly created or an existing EA subscription. <li>Use the information in the [Perform resource transfers](#perform-resource-transfers) section. <li>Reservations don't automatically transfer and transferring them isn't supported.</ul> </ul>|
| MPA | MPA |   <ul><li>For details, see [Transfer a customer's Azure subscriptions to a different CSP (under an Azure plan)](/partner-center/transfer-azure-subscriptions-under-azure-plan). <li>Reservations don't automatically transfer and transferring them isn't supported. </ul>|
| MOSP (PAYG) | MOSP (PAYG) |   <ul><li> If you're changing the billing owner of the subscription, see [Transfer billing ownership of an Azure subscription to another account](billing-subscription-transfer.md). <li>If you're changing a payment method, see [Add or update a credit card for Azure](change-credit-card.md). <li>Reservations don't automatically transfer so you must open a [billing support ticket](https://azure.microsoft.com/support/create-ticket/) to transfer them.</ul> |
| MOSP (PAYG) | MCA - individual |   For details, see [Transfer Azure subscription billing ownership for a Microsoft Customer Agreement](mca-request-billing-ownership.md). |
| MOSP (PAYG) | EA |  For details, see [Transfer a subscription to an EA](mosp-ea-transfer.md#transfer-the-subscription-to-the-ea). |
| MOSP (PAYG) | MCA - Enterprise | For details, see [Transfer Azure subscription billing ownership for a Microsoft Customer Agreement](mca-request-billing-ownership.md). |

## Perform resource transfers

Some subscription transfers require you to manually move Azure resources between subscriptions. Moving resources can incur downtime and there are various limitations to move Azure resource types such as VMs, NSGs, App Services, and others.

Microsoft doesn't provide a tool to automatically move resources between subscriptions. When needed, you must manually move Azure resources between subscriptions. For details, see [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md). Extra time and planning is needed when you have a large amount of resources to move.

## Other planning considerations

Read the following sections to learn more about other considerations before you start a subscription transfer.

### Resources transferred with subscriptions

All your resources like VMs, disks, and websites normally transfer to the new account. However, if you transfer a subscription to an account in another Azure AD tenant (directory), any [administrator roles](../manage/add-change-subscription-administrator.md) and [Azure role assignments](../../role-based-access-control/role-assignments-portal.md) on the subscription don't transfer. Also, [app registrations](../../active-directory/develop/quickstart-register-app.md) and other tenant-specific services don't transfer along with the subscription.

### Transfer account ownership to another country/region

Unfortunately, you can't transfer subscriptions across countries or regions using the Azure portal. However they can get transferred if you open an Azure support request. To create a support request, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

### Transfer a subscription from one account to another

If you're an administrator of two accounts, your can transfer a subscription between your accounts. Your accounts are conceptually considered accounts of two different users so you can transfer subscriptions between your accounts.

To view the steps needed to transfer your subscription, see [Transfer billing ownership of an Azure subscription](../manage/billing-subscription-transfer.md).

### Transferring a subscription shouldn't create downtime

If you transfer a subscription to an account in the same Azure AD tenant, there's no impact to the resources running in the subscription. However, context information saved in PowerShell isn't updated so you might have to clear it or change settings. If you transfer the subscription to an account in another tenant and decide to move the subscription to the tenant, all users, groups, and service principals who had [Azure role assignments](../../role-based-access-control/role-assignments-portal.md) to access resources in the subscription lose their access. Service downtime might result.

### New account usage and billing history

The only information available to the users for the new account is the last month's cost for your subscription. The rest of the usage and billing history doesn't transfer with the subscription.

### Manually migrate data and services

When you transfer a subscription, its resources stay with it. If you can't transfer subscription ownership, you can manually migrate its resources. For more information, see [Move resources to new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md).

### Remaining subscription credits 

If you have a Visual Studio or Microsoft Partner Network subscription, you get monthly credits. Your credit doesn't carry forward with the subscription in the new account. The user who accepts the transfer request needs to have a Visual Studio license to accept the transfer request. The subscription uses the Visual Studio credit that's available in the user's account. For more information, see [Transferring Visual Studio and Partner Network subscriptions](../manage/billing-subscription-transfer.md#transfer-visual-studio-and-partner-network-subscriptions).

### Users keep access to transferred resources

Keep in mind that users with access to resources in a subscription keep their access when ownership is transferred. However, [administrator roles](../manage/add-change-subscription-administrator.md) and [Azure role assignments](../../role-based-access-control/role-assignments-portal.md) might get removed. Losing access occurs when your account is in an Azure AD tenant other than the subscription's tenant and the user who sent the transfer request moves the subscription to your account's tenant. 

You can view the users who have Azure role assignments to access resources in the subscription in the Azure portal. Visit the [Subscription page in the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade). Then select the subscription you want to check, and then select **Access control (IAM)** from the left-hand pane. Next, select **Role assignments** from the top of the page. The role assignments page lists all users who have access on the subscription.

Even if the [Azure role assignments](../../role-based-access-control/role-assignments-portal.md) are removed during transfer, users in the original owner account might continue to have access to the subscription through other security mechanisms, including:

* Management certificates that grant the user admin rights to subscription resources. For more information, see [Create and Upload a Management Certificate for Azure](../../cloud-services/cloud-services-certs-create.md).
* Access keys for services like Storage. For more information, see [About Azure storage accounts](../../storage/common/storage-account-create.md).
* Remote Access credentials for services like Azure Virtual Machines.

When the recipient needs to restrict access to resources, they should consider updating any secrets associated with the service. Most resources can be updated. Sign in to the [Azure portal](https://portal.azure.com) and then on the Hub menu, select **All resources**. Next, Select the resource. Then in the resource page, select **Settings**. There you can view and update existing secrets.

### You pay for usage when you receive ownership

Your account is responsible for payment for any usage that is reported from the time of transfer onwards. There may be some usage that took place before transfer but was reported afterwards. The usage is included in your account's bill.

### Use a different payment method

While accepting the transfer request, you can select an existing payment method that's linked to your account or add a new payment method.

### Transfer Enterprise Agreement subscription ownership

The Enterprise Administrator can update account ownership for any account, even after an original account owner is no longer part of the organization. For more information about transferring Azure Enterprise Agreement accounts, see [Azure Enterprise transfers](../manage/ea-transfers.md).

## Next steps

- [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md).
