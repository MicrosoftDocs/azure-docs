---
title: Azure subscription transfer hub
description: This article helps you understand what's needed to transfer Azure subscriptions and provides links to other articles for more detailed information.
author: bandersmsft
ms.reviewer: jatracey
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 01/05/2021
ms.author: banders
ms.custom:
---

# Azure subscription transfer hub

This article helps you understand what's needed to transfer Azure subscriptions between different billing models and types and then provides links to other articles for more detailed information about specific transfers. Azure subscriptions are created upon different Azure agreement types and a transfer from a source agreement type to another varies depending on the source and destination agreement types. Subscription transfers can be an automatic or a manual process, depending on the source and destination subscription type. If it's a manual process, the subscription agreement types determine how much manual effort is needed.

This article also helps you understand the things you should know before you transfer billing ownership of an Azure subscription to another account. You might want to transfer billing ownership of your Azure subscription if you're leaving your organization, or you want your subscription to be billed to another account. Transferring billing ownership to another account provides the administrators in the new account permission for billing tasks. They can change the payment method, view charges, and cancel the subscription.

If you want to keep the billing ownership but change the type of your subscription, see [Switch your Azure subscription to another offer](../manage/switch-azure-offer.md). To control who can access resources in the subscription, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md).

If you're an Enterprise Agreement (EA) customer, your enterprise administrators can transfer billing ownership of your subscriptions between accounts.

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
  - Microsoft Cloud Solution Provider (CSP) v1
  - Microsoft Cloud Solution Provider (CSP) v2 (Azure Plan), also known as Microsoft Partner Agreement (MPA)
  - Enterprise Agreement (EA)
  - Microsoft Customer Agreement (MCA)
  - Others like MSDN, BizSpark, EOPEN, Azure Pass, and Free Trial
- Do you have the required permissions on the subscription to accomplish a transfer? Only the billing administrator of an account can transfer ownership of a subscription.

You should have an answer for each question before you continue with any transfer.

Answers help you to communicate early with others to set expectations and timelines. Subscription transfer effort varies greatly, but a transfer is likely to take longer than expected.

Answers for the source and destination offer type questions help define technical paths that you'll need to follow and identify limitations that a transfer combination might have. Limitations are covered in more detail in the next section.

## Subscription transfer support

The following table describes subscription transfer support between the different agreement types. Links are provided for more information about each type of transfer.

Currently transfer isn't supported for [Free Trial](https://azure.microsoft.com/offers/ms-azr-0044p/) or [Azure in Open (AIO)](https://azure.microsoft.com/offers/ms-azr-0111p/) subscriptions. For a workaround, see [Move resources to new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md). To transfer other subscriptions, like support plans, [contact Azure Support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

Dev/Test subscriptions aren't shown in the following table. Transfers for Dev/Test subscriptions are handled in the same way as other subscription types. For example, an EA Dev/Test subscription transfer is handled in the way an EA subscription transfer.


| **Source Subscription Type** | **Destination Subscription Type** | **Supported** | **transfer Type** | **Considerations** |
| :---: | :---: | :---: | :---: | :---: |
| EA | EA | Yes | Billing | The transfer has no downtime because it's just a billing change. Transferring between EA enrollments requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). |
| EA | MCA | Yes | Billing | The transfer is completed as part of the MCA transition process from an EA. For more information, see [Complete Enterprise Agreement tasks in your billing account for a Microsoft Customer Agreement](mca-enterprise-operations.md). |
| EA | MOSP (PAYG) | Yes | Billing | The transfer has no downtime because it's just a billing change. Changing from an EA to a MOSP (PAYG) subscription requires a [support ticket](https://azure.microsoft.com/support/create-ticket/). |
| EA | CSP v1 | Yes | Resource | The transfer requires resources to move from the existing EA subscription to a newly created or an existing CSP v1 subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| EA | CSP v2 (Azure Plan/MPA) | Yes | Billing | The transfer has no downtime because it's just a billing change. There are some limitations and restrictions. For more information, see [Transfer an EA subscription to CSP v2 (Azure Plan/MPA)](transfer-enterprise-subscription-partner.md). |
| MCA | MCA | Yes | Billing | The transfer has no downtime because it's just a billing change. Transferring between MCA billing profiles requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). |
| MCA | EA | No | N/A | MCAs are the new modern commerce experience. MCAs are replacing EAs. |
| MCA | MOSP (PAYG) | Yes | Billing | The transfer has no downtime because it's just a billing change. Changing from an MCA to a MOSP (PAYG) subscription requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). |
| MCA | CSP v1 | Yes | Resource | The transfer requires resources to move from the existing MCA subscription to a newly created or an existing CSP v1 subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| MCA | CSP v2 (Azure Plan/MPA) | Yes | Resource | The transfer requires resources to move from the existing MCA subscription to a newly created or an existing CSP v2 subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| CSP v1 | CSP v1 (Different Partner) | Yes | Billing | The transfer has no downtime because it's just a billing change between CSP partners, managed by Microsoft. For more information about the process, see [Learn how to transfer a customer's Azure subscriptions to another partner](/partner-center/switch-azure-subscriptions-to-a-different-partner). |
| CSP v1 | CSP v2 (Azure Plan/MPA) (Same Partner) | Yes | Billing | The transfer has no downtime because it's just a billing change made by CSP partners. For more information about the process, see [Transition customers to Azure plan from existing CSP Azure offers](/partner-center/azure-plan-transition). |
| CSP v1 | EA | Yes | Resource | The transfer requires resources to move from the existing CSP v1 subscription to a newly created or an existing EA subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| CSP v1 | MCA | Yes | Resource | The transfer requires resources to move from the existing CSP v1 subscription to a newly created or an existing MCA subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| CSP v1 | MOSP (PAYG) | Yes | Resource | The transfer requires resources to move from the existing CSP v1 subscription to a newly created or an existing MOSP (PAYG) subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| CSP v2 (Azure Plan/MPA) | CSP v1 | No | N/A | CSP v1 is being phased out and partners are advised to transition their CSP customers from CSP v1 to CSP v2 (Azure Plan/MPA). Transfer to CSP v2 (Azure Plan/MPA) is recommended. |
| CSP v2 (Azure Plan/MPA) | CSP v2 (Azure Plan/MPA) (Different Partner) | Yes | Billing | The transfer has no downtime because it's just a billing change between CSP partners, managed by Microsoft. For more information about the process, see [Learn how to transfer a customer's Azure subscriptions to another partner](/partner-center/switch-azure-subscriptions-to-a-different-partner) and [Transfer subscriptions under an Azure plan from one partner to another (Preview)](azure-plan-subscription-transfer-partners.md). |
| CSP v2 (Azure Plan/MPA) | EA | Yes | Resource | The transfer requires resources to move from the existing CSP v2 (Azure Plan/MPA) subscription to a newly created or an existing EA subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| CSP v2 (Azure Plan/MPA) | MCA | Yes | Resource | The transfer requires resources to move from the existing CSP v2 (Azure Plan/MPA) subscription to a newly created or an existing MCA subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| CSP v2 (Azure Plan/MPA) | MOSP (PAYG) | Yes | Resource | The transfer requires resources to move from the existing CSP v2 (Azure Plan/MPA) subscription to a newly created or an existing MOSP (PAYG) subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| MOSP (PAYG) | MCA | Yes | Billing | The transfer has no downtime. Changing an MOSP (PAYG) subscription to an MCA subscription offer requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). |
| MOSP (PAYG) | EA | Yes | Billing | The transfer has no downtime because it's just a billing change, however there is a detailed process to follow as documented at [MOSP to EA Subscription transfer](mosp-ea-transfer.md). |
| MOSP (PAYG) | MOSP (PAYG) | Yes | Billing | The transfer has no downtime. If you're changing the billing owner of the subscription, see [Transfer billing ownership of an Azure subscription to another account](billing-subscription-transfer.md). If you're changing a payment method, see [Add or update a credit card for Azure](change-credit-card.md). |
| MOSP (PAYG) | CSP v1 | Yes | Resource | The transfer requires resources to move from the existing MOSP (PAYG) subscription to a newly created or an existing CSP v1 subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| MOSP (PAYG) | CSP v2 (Azure Plan/MPA) | Yes | Resource | The transfer requires resources to move from the existing MOSP (PAYG) subscription to a newly created or an existing CSP v2 subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |

## Perform resource transfers

As you might have noted, most subscription transfers require you to manually move Azure resources between subscriptions. Moving resources can incur downtime and there are various limitations to move Azure resource types such as VMs, NSGs, App Services, and others.

Microsoft doesn't provide a tool to automatically move resources between subscriptions. Manually move Azure resources between subscriptions. If you have a small amount of resources to move, see [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md). When you have a large amount of resources to move, continue to the next section.

### Azure Resource transfer Support tool

There's a third-party tool named [Azure Resource transfer Support tool v10](https://jtjsacpublic.blob.core.windows.net/blogsharedfiles/AzureResourcetransferSupportV10.xlsx) that can help you plan a large resource transfer. It's an Excel workbook that helps you track and compare resource information for the source and destination subscription and resource types. This workbook is based upon the data documented at [Move operation support for resources](../../azure-resource-manager/management/move-support-resources.md).

For more information about using the tool, see [Azure Subscription transfers](https://jacktracey.co.uk/transfer/azure-subscription-transfers/). Instructions to use the tool are on the Intro Page sheet in the workbook.

## Other planning considerations

Read the following sections to learn more about other considerations before you start a subscription transfer.

### Resources transferred with subscriptions

All your resources like VMs, disks, and websites normally transfer to the new account. However, if you transfer a subscription to an account in another Azure AD tenant, any [administrator roles](../manage/add-change-subscription-administrator.md) and [Azure role assignments](../../role-based-access-control/role-assignments-portal.md) on the subscription don't transfer. Also, [app registrations](../../active-directory/develop/quickstart-register-app.md) and other tenant-specific services don't transfer along with the subscription.

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

- Read about the [Azure Resource transfer Support tool v10](https://jtjsacpublic.blob.core.windows.net/blogsharedfiles/AzureResourcetransferSupportV10.xlsx).
- [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md).
