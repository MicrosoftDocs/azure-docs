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

This article helps you understand what's needed to transfer Azure subscriptions between different billing models and types and then provides links to other articles for more detailed information about specific transfers or transfers. Azure subscriptions are created upon different Azure agreement types and a transfer from a source agreement type to another varies depending on the source and destination agreement types. Subscription transfers can be an automatic or a manual process, depending on the source and destination subscription type. If it's a manual process, the subscription agreement types determine how much manual effort is needed.

This article focuses on subscription transfers. However, resource transfer is also discussed because it's required for some subscription transfer scenarios.

For more information about subscription transfers between different Azure AD tenants, see [Transfer an Azure subscription to a different Azure AD directory](../../role-based-access-control/transfer-subscription.md).

> [!NOTE]
> The rest of this page refers to subscription transfers in the same Azure AD tenant, unless otherwise specified.

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
- Do you have the required permissions on the subscription to accomplish a transfer?

You should have an answer for each question before you continue with any transfer.

Answers help you to communicate early with others to set expectations and timelines. Subscription transfer effort varies greatly, but a transfer is likely to take longer than expected.

Answers for the source and destination offer type questions help define technical paths that you'll need to follow and identify limitations that a transfer combination might have. Limitations are covered in more detail in the next section.

## Subscription transfer support

The following table describes subscription transfer support between the different agreement types. Links are provided for more information about each type of transfer.


| **Source Subscription Type** | **Destination Subscription Type** | **Supported** | **transfer Type** | **Considerations** |
| :---: | :---: | :---: | :---: | :---: |
| EA | EA | Yes | Billing | The transfer has no downtime because it's just a billing change. Transferring between EA enrollments requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). |
| EA | EA Dev/Test | Yes | Billing | The transfer has no downtime. Changing an EA subscription to an EA Dev/Test subscription offer requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). |
| EA Dev/Test | EA | Yes | Billing | The transfer has no downtime because it's just a billing change. Changing an EA subscription to an EA Dev/Test subscription offer requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). |
| EA | MCA | Yes | Billing | The transfer is completed as part of the MCA transition process from an EA. For more information, see [Complete Enterprise Agreement tasks in your billing account for a Microsoft Customer Agreement](mca-enterprise-operations.md). |
| EA Dev/Test | MCA Dev/Test | Yes | Billing | The transfer is completed as part of the MCA transition process from an EA. For more information, see [Complete Enterprise Agreement tasks in your billing account for a Microsoft Customer Agreement](mca-enterprise-operations.md). |
| EA | MOSP (PAYG) | Yes | Billing | The transfer has no downtime because it's just a billing change. Changing from an EA to a MOSP (PAYG) subscription requires a [support ticket](https://azure.microsoft.com/support/create-ticket/). |
| EA Dev/Test | MOSP Dev/Test (PAYG Dev/Test) | Yes | Billing | The transfer has no downtime because it's just a billing change. Changing from an EA Dev/Test to a MOSP Dev/Test (PAYG Dev/Test) subscription requires a [support ticket](https://azure.microsoft.com/support/create-ticket/). |
| EA | CSP v1 | Yes | Resource | The transfer requires resources to move from the existing EA subscription to a newly created or an existing CSP v1 subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| EA | CSP v2 (Azure Plan/MPA) | Yes | Billing | The transfer has no downtime because it's just a billing change. There are some limitations and restrictions. For more information, see [Transfer an EA subscription to CSP v2 (Azure Plan/MPA)](transfer-enterprise-subscription-partner.md). |
| MCA | MCA | Yes | Billing | The transfer has no downtime because it's just a billing change. Transferring between MCA billing profiles requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). |
| MCA | MCA Dev/Test | Yes | Billing | The transfer has no downtime. Changing an MCA subscription to an MCA Dev/Test subscription offer requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). |
| MCA | EA | No | N/A | MCAs are the new modern commerce experience. MCAs are replacing EAs. |
| MCA | EA Dev/Test | No | N/A | MCAs are the new modern commerce experience. MCAs are replacing EAs. |
| MCA Dev/Test | EA | No | N/A | MCAs are the new modern commerce experience. MCAs are replacing EAs. |
| MCA | MOSP (PAYG) | Yes | Billing | The transfer has no downtime because it's just a billing change. Changing from an MCA to a MOSP (PAYG) subscription requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). |
| MCA | MOSP Dev/Test (PAYG) | Yes | Billing | The transfer has no downtime because it's just a billing change. Changing from an MCA to a MOSP Dev/Test (PAYG Dev/Test) subscription requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). |
| MCA | CSP v1 | Yes | Resource | The transfer requires resources to move from the existing MCA subscription to a newly created or an existing CSP v1 subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| MCA | CSP v2 (Azure Plan/MPA) | Yes | Resource | The transfer requires resources to move from the existing MCA subscription to a newly created or an existing CSP v2 subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| CSP v1 | CSP v1 (Different Partner) | Yes | Billing | The transfer has no downtime because it's just a billing change between CSP partners, managed by Microsoft. For more information about the process, see [Learn how to transfer a customer's Azure subscriptions to another partner](/partner-center/switch-azure-subscriptions-to-a-different-partner). |
| CSP v1 | CSP v2 (Azure Plan/MPA) (Same Partner) | Yes | Billing | The transfer has no downtime because it's just a billing change made by CSP partners. For more information about the process, see [Transition customers to Azure plan from existing CSP Azure offers](/partner-center/azure-plan-transition). |
| CSP v1 | EA | Yes | Resource | The transfer requires resources to move from the existing CSP v1 subscription to a newly created or an existing EA subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| CSP v1 | EA Dev/Test | Yes | Resource | The transfer requires resources to move from the existing CSP v1 subscription to a newly created or an existing EA Dev/Test subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| CSP v1 | MCA | Yes | Resource | The transfer requires resources to move from the existing CSP v1 subscription to a newly created or an existing MCA subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| CSP v1 | MCA Dev/Test | Yes | Resource | The transfer requires resources to move from the existing CSP v1 subscription to a newly created or an existing MCA Dev/Test subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| CSP v1 | MOSP (PAYG) | Yes | Resource | The transfer requires resources to move from the existing CSP v1 subscription to a newly created or an existing MOSP (PAYG) subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| CSP v1 | MOSP Dev/Test (PAYG Dev/Test) | Yes | Billing | The transfer requires resources to move from the existing CSP v1 subscription to a newly created or an existing MOSP Dev/Test (PAYG Dev/Test) subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| CSP v2 (Azure Plan/MPA) | CSP v1 | No | N/A | CSP v1 is being phased out and partners are advised to transition their CSP customers from CSP v1 to CSP v2 (Azure Plan/MPA). transfer to CSP v2 (Azure Plan/MPA) is recommended. |
| CSP v2 (Azure Plan/MPA) | CSP v2 (Azure Plan/MPA) (Different Partner) | Yes | Billing | The transfer has no downtime because it's just a billing change between CSP partners, managed by Microsoft. For more information about the process, see [Learn how to transfer a customer's Azure subscriptions to another partner](/partner-center/switch-azure-subscriptions-to-a-different-partner) and [Transfer subscriptions under an Azure plan from one partner to another (Preview)](azure-plan-subscription-transfer-partners.md). |
| CSP v2 (Azure Plan/MPA) | EA | Yes | Resource | The transfer requires resources to move from the existing CSP v2 (Azure Plan/MPA) subscription to a newly created or an existing EA subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| CSP v2 (Azure Plan/MPA) | EA Dev/Test | Yes | Resource | The transfer requires resources to move from the existing CSP v2 (Azure Plan/MPA) subscription to a newly created or an existing EA Dev/Test subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| CSP v2 (Azure Plan/MPA) | MCA | Yes | Resource | The transfer requires resources to move from the existing CSP v2 (Azure Plan/MPA) subscription to a newly created or an existing MCA subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| CSP v2 (Azure Plan/MPA) | MCA Dev/Test | Yes | Resource | The transfer requires resources to move from the existing CSP v2 (Azure Plan/MPA) subscription to a newly created or an existing MCA Dev/Test subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| CSP v2 (Azure Plan/MPA) | MOSP (PAYG) | Yes | Resource | The transfer requires resources to move from the existing CSP v2 (Azure Plan/MPA) subscription to a newly created or an existing MOSP (PAYG) subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| CSP v2 (Azure Plan/MPA) | MOSP Dev/Test (PAYG Dev/Test) | Yes | Resource | The transfer requires resources to move from the existing CSP v2 (Azure Plan/MPA) subscription to a newly created or an existing MOSP Dev/Test (PAYG (Dev/Test)) subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| MOSP (PAYG) | MCA | Yes | Billing | The transfer has no downtime. Changing an MOSP (PAYG) subscription to an MCA subscription offer requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). |
| MOSP (PAYG) | MCA Dev/Test | Yes | Billing | The transfer has no downtime. Changing an MOSP (PAYG) subscription to an MCA Dev/Test subscription offer requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). |
| MOSP (PAYG) | EA | Yes | Billing | The transfer has no downtime because it's just a billing change, however there is a detailed process to follow as documented at [MOSP to EA Subscription transfer](mosp-ea-transfer.md). |
| MOSP (PAYG) | EA Dev/Test | Yes | Billing | The transfer has no downtime, but it requires multiple steps. First, transfer from MOSP (PAYG) to a normal EA subscription type as documented at [MOSP to EA Subscription transfer](mosp-ea-transfer.md). Then transfer from an EA subscription to an EA Dev/Test subscription type. |
| MOSP Dev/Test (PAYG Dev/Test) | EA | Yes | Billing | The transfer has no downtime, but it requires multiple steps. First, transfer from MOSP Dev/Test (PAYG) to a normal MOSP (PAYG) subscription type as documented at [MOSP to EA Subscription transfer](mosp-ea-transfer.md). Then transfer from an MOSP (PAYG) subscription to an EA subscription type. |
| MOSP (PAYG) | MOSP (PAYG) | Yes | Billing | The transfer has no downtime. If you're changing the billing owner of the subscription, see [Transfer billing ownership of an Azure subscription to another account](billing-subscription-transfer.md). If you're changing a payment method, see [Add or update a credit card for Azure](change-credit-card.md). |
| MOSP Dev/Test (PAYG Dev/Test) | MOSP (PAYG) | Yes | Billing | The transfer has no downtime because it's just an offer change. For more information, see [Change your Azure subscription to a different offer](switch-azure-offer.md). |
| MOSP (PAYG) | MOSP Dev/Test (PAYG Dev/Test) | Yes | Billing | The transfer has no downtime because it's just an offer change. For more information, see [Change your Azure subscription to a different offer](switch-azure-offer.md). |
| MOSP (PAYG) | CSP v1 | Yes | Resource | The transfer requires resources to move from the existing MOSP (PAYG) subscription to a newly created or an existing CSP v1 subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| MOSP Dev/Test (PAYG Dev/Test)  | CSP v1 | Yes | Resource | The transfer requires resources to move from the existing MOSP Dev/Test (PAYG Dev/Test) subscription to a newly created or an existing CSP v1 subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| MOSP (PAYG) | CSP v2 (Azure Plan/MPA) | Yes | Resource | The transfer requires resources to move from the existing MOSP (PAYG) subscription to a newly created or an existing CSP v2 subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |
| MOSP Dev/Test (PAYG Dev/Test) | CSP v2 (Azure Plan/MPA) | Yes | Resource | The transfer requires resources to move from the existing MOSP Dev/Test (PAYG Dev/Test) subscription to a newly created or an existing CSP v2 subscription. Use the information in the [Perform resource transfers](#perform-resource-transfers) section. There may be downtime involved in the transfer process. |

## Perform resource transfers

As you might have noted, most subscription transfers require you to manually move Azure resources between subscriptions. Moving resources can incur downtime and there are various limitations to move Azure resource types such as VMs, NSGs, App Services, and others.

Microsoft doesn't provide a tool to automatically move resources between subscriptions. Manually move Azure resources between subscriptions. If you have a small amount of resources to move, see [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md). When you have a large amount of resources to move, continue to the next section.

### Azure Resource transfer Support tool

There's a third-party tool named [Azure Resource transfer Support tool v10](https://jtjsacpublic.blob.core.windows.net/blogsharedfiles/AzureResourcetransferSupportV10.xlsx) that can help you plan a large resource transfer. It's an Excel workbook that helps you track and compare resource information for the source and destination subscription and resource types. This workbook is based upon the data documented at [Move operation support for resources](../../azure-resource-manager/management/move-support-resources.md).

For more information about using the tool, see [Azure Subscription transfers](https://jacktracey.co.uk/transfer/azure-subscription-transfers/). Instructions to use the tool are on the Intro Page sheet in the workbook.

## Next steps

- Read about the [Azure Resource transfer Support tool v10](https://jtjsacpublic.blob.core.windows.net/blogsharedfiles/AzureResourcetransferSupportV10.xlsx).
- [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md).
