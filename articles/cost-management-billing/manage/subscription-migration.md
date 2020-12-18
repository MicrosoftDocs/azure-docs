---
title: Azure subscription migration hub
description: This article helps you understand what's needed to migrate Azure subscriptions and provides links to other articles for more detailed information.
author: bandersmsft
ms.reviewer: jatracey
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 12/18/2020
ms.author: banders
ms.custom:
---

# Azure subscription migration hub

This article helps you understand what's needed to migrate Azure subscriptions between different billing models and types and then provides links to other articles for more detailed information about specific migrations or transfers. Azure subscriptions are created upon different Azure agreement types and a migration from a source agreement type to another varies depending on the source and destination agreement types. Subscription migrations can be an automatic or a manual process, depending on the source and destination subscription type. If it's a manual process, the subscription agreement types determine how much manual effort is needed.

This article focuses on subscription migrations. However, resource migration is also discussed because it's required for some subscription migration scenarios.

For more information about subscription migrations between different Azure AD tenants, see [Transfer an Azure subscription to a different Azure AD directory](../../role-based-access-control/transfer-subscription.md).

> [!NOTE]
> The rest of this page refers to subscription migrations in the same Azure AD tenant, unless otherwise specified.

## Subscription migration planning

As you begin to plan your subscription migration, consider the information needed to answer to the following questions:

- Why is the subscription migration required?
- What are the wanted timelines for the subscription migration?
- What is the subscription's current offer type and what do you want to migrate it too?
  - Microsoft Online Service Program (MOSP), also known as Pay-As-You-Go (PAYG)
  - Microsoft Cloud Solution Provider (CSP) v1
  - Microsoft Cloud Solution Provider (CSP) v2 (Azure Plan), also known as Microsoft Partner Agreement (MPA)
  - Enterprise Agreement (EA)
  - Microsoft Customer Agreement (MCA)
  - Others like MSDN, BizSpark, EOPEN, Azure Pass, and Free Trial
- Do you have the required permissions on the subscription to accomplish a migration?

You should have an answer for each question before you continue with any migration.

Answers help you to communicate early with others to set expectations and timelines. Subscription migration effort varies greatly, but a migration is likely to take longer than expected.

Answers for the source and destination offer type questions help define technical paths that you'll need to follow and identify limitations that a migration combination might have. Limitations are covered in more detail in the next section.

## Subscription migration support

The following table describes subscription migration support between the different agreement types. Links are provided for more information about each type of migration.


| **Source Subscription Type** | **Destination Subscription Type** | **Supported** | **Migration Type** | **Considerations** |
| :---: | :---: | :---: | :---: | :---: |
| EA | EA | Yes | Billing | The migration has no downtime because it's just a billing change. Transferring between EA enrollments requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). |
| EA | EA Dev/Test | Yes | Billing | The migration has no downtime. Changing an EA subscription to an EA Dev/Test subscription offer requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). |
| EA Dev/Test | EA | Yes | Billing | The migration has no downtime because it's just a billing change. Changing an EA subscription to an EA Dev/Test subscription offer requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). |
| EA | MCA | Yes | Billing | The migration is completed as part of the MCA transition process from an EA. For more information, see [Complete Enterprise Agreement tasks in your billing account for a Microsoft Customer Agreement](mca-enterprise-operations.md). |
| EA Dev/Test | MCA Dev/Test | Yes | Billing | The migration is completed as part of the MCA transition process from an EA. For more information, see [Complete Enterprise Agreement tasks in your billing account for a Microsoft Customer Agreement](mca-enterprise-operations.md). |
| EA | MOSP (PAYG) | Yes | Billing | The migration has no downtime because it's just a billing change. Changing from an EA to a MOSP (PAYG) subscription requires a [support ticket](https://azure.microsoft.com/support/create-ticket/). |
| EA Dev/Test | MOSP Dev/Test (PAYG Dev/Test) | Yes | Billing | The migration has no downtime because it's just a billing change. Changing from an EA Dev/Test to a MOSP Dev/Test (PAYG Dev/Test) subscription requires a [support ticket](https://azure.microsoft.com/support/create-ticket/). |
| EA | CSP v1 | Yes | Resource | The migration requires resources to migrate from the existing EA subscription to a newly created or an existing CSP v1 subscription. Use the information in the [Perform resource migrations](#perform-resource-migrations) section. There may be downtime involved in the migration process. |
| EA | CSP v2 (Azure Plan/MPA) | Yes | Billing | The migration has no downtime because it's just a billing change. There are some limitations and restrictions. For more information, see [Transfer an EA subscription to CSP v2 (Azure Plan/MPA)](transfer-enterprise-subscription-partner.md). |
| MCA | MCA | Yes | Billing | The migration has no downtime because it's just a billing change. Transferring between MCA billing profiles requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). |
| MCA | MCA Dev/Test | Yes | Billing | The migration has no downtime. Changing an MCA subscription to an MCA Dev/Test subscription offer requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). |
| MCA | EA | No | N/A | MCAs are the new modern commerce experience. MCAs are replacing EAs. |
| MCA | EA Dev/Test | No | N/A | MCAs are the new modern commerce experience. MCAs are replacing EAs. |
| MCA Dev/Test | EA | No | N/A | MCAs are the new modern commerce experience. MCAs are replacing EAs. |
| MCA | MOSP (PAYG) | Yes | Billing | The migration has no downtime because it's just a billing change. Changing from an MCA to a MOSP (PAYG) subscription requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). |
| MCA | MOSP Dev/Test (PAYG) | Yes | Billing | The migration has no downtime because it's just a billing change. Changing from an MCA to a MOSP Dev/Test (PAYG Dev/Test) subscription requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). |
| MCA | CSP v1 | Yes | Resource | The migration requires resources to migrate from the existing MCA subscription to a newly created or an existing CSP v1 subscription. Use the information in the [Perform resource migrations](#perform-resource-migrations) section. There may be downtime involved in the migration process. |
| MCA | CSP v2 (Azure Plan/MPA) | Yes | Resource | The migration requires resources to migrate from the existing MCA subscription to a newly created or an existing CSP v2 subscription. Use the information in the [Perform resource migrations](#perform-resource-migrations) section. There may be downtime involved in the migration process. |
| CSP v1 | CSP v1 (Different Partner) | Yes | Billing | The migration has no downtime because it's just a billing change between CSP partners, managed by Microsoft. For more information about the process, see [Learn how to transfer a customer's Azure subscriptions to another partner](/partner-center/switch-azure-subscriptions-to-a-different-partner). |
| CSP v1 | CSP v2 (Azure Plan/MPA) (Same Partner) | Yes | Billing | The migration has no downtime because it's just a billing change made by CSP partners. For more information about the process, see [Transition customers to Azure plan from existing CSP Azure offers](/partner-center/azure-plan-transition). |
| CSP v1 | EA | Yes | Resource | The migration requires resources to migrate from the existing CSP v1 subscription to a newly created or an existing EA subscription. Use the information in the [Perform resource migrations](#perform-resource-migrations) section. There may be downtime involved in the migration process. |
| CSP v1 | EA Dev/Test | Yes | Resource | The migration requires resources to migrate from the existing CSP v1 subscription to a newly created or an existing EA Dev/Test subscription. Use the information in the [Perform resource migrations](#perform-resource-migrations) section. There may be downtime involved in the migration process. |
| CSP v1 | MCA | Yes | Resource | The migration requires resources to migrate from the existing CSP v1 subscription to a newly created or an existing MCA subscription. Use the information in the [Perform resource migrations](#perform-resource-migrations) section. There may be downtime involved in the migration process. |
| CSP v1 | MCA Dev/Test | Yes | Resource | The migration requires resources to migrate from the existing CSP v1 subscription to a newly created or an existing MCA Dev/Test subscription. Use the information in the [Perform resource migrations](#perform-resource-migrations) section. There may be downtime involved in the migration process. |
| CSP v1 | MOSP (PAYG) | Yes | Resource | The migration requires resources to migrate from the existing CSP v1 subscription to a newly created or an existing MOSP (PAYG) subscription. Use the information in the [Perform resource migrations](#perform-resource-migrations) section. There may be downtime involved in the migration process. |
| CSP v1 | MOSP Dev/Test (PAYG Dev/Test) | Yes | Billing | The migration requires resources to migrate from the existing CSP v1 subscription to a newly created or an existing MOSP Dev/Test (PAYG Dev/Test) subscription. Use the information in the [Perform resource migrations](#perform-resource-migrations) section. There may be downtime involved in the migration process. |
| CSP v2 (Azure Plan/MPA) | CSP v1 | No | N/A | CSP v1 is being phased out and partners are advised to transition their CSP customers from CSP v1 to CSP v2 (Azure Plan/MPA). Migration to CSP v2 (Azure Plan/MPA) is recommended. |
| CSP v2 (Azure Plan/MPA) | CSP v2 (Azure Plan/MPA) (Different Partner) | Yes | Billing | The migration has no downtime because it's just a billing change between CSP partners, managed by Microsoft. For more information about the process, see [Learn how to transfer a customer's Azure subscriptions to another partner](/partner-center/switch-azure-subscriptions-to-a-different-partner) and [Transfer subscriptions under an Azure plan from one partner to another (Preview)](azure-plan-subscription-transfer-partners.md). |
| CSP v2 (Azure Plan/MPA) | EA | Yes | Resource | The migration requires resources migrate from the existing CSP v2 (Azure Plan/MPA) subscription to a newly created or an existing EA subscription. Use the information in the [Perform resource migrations](#perform-resource-migrations) section. There may be downtime involved in the migration process. |
| CSP v2 (Azure Plan/MPA) | EA Dev/Test | Yes | Resource | The migration requires resources to migrate from the existing CSP v2 (Azure Plan/MPA) subscription to a newly created or an existing EA Dev/Test subscription. Use the information in the [Perform resource migrations](#perform-resource-migrations) section. There may be downtime involved in the migration process. |
| CSP v2 (Azure Plan/MPA) | MCA | Yes | Resource | The migration requires resources to migrate from the existing CSP v2 (Azure Plan/MPA) subscription to a newly created or an existing MCA subscription. Use the information in the [Perform resource migrations](#perform-resource-migrations) section. There may be downtime involved in the migration process. |
| CSP v2 (Azure Plan/MPA) | MCA Dev/Test | Yes | Resource | The migration requires resources to migrate from the existing CSP v2 (Azure Plan/MPA) subscription to a newly created or an existing MCA Dev/Test subscription. Use the information in the [Perform resource migrations](#perform-resource-migrations) section. There may be downtime involved in the migration process. |
| CSP v2 (Azure Plan/MPA) | MOSP (PAYG) | Yes | Resource | The migration requires resources to migrate from the existing CSP v2 (Azure Plan/MPA) subscription to a newly created or an existing MOSP (PAYG) subscription. Use the information in the [Perform resource migrations](#perform-resource-migrations) section. There may be downtime involved in the migration process. |
| CSP v2 (Azure Plan/MPA) | MOSP Dev/Test (PAYG Dev/Test) | Yes | Resource | The migration requires resources to migrate from the existing CSP v2 (Azure Plan/MPA) subscription to a newly created or an existing MOSP Dev/Test (PAYG (Dev/Test)) subscription. Use the information in the [Perform resource migrations](#perform-resource-migrations) section. There may be downtime involved in the migration process. |
| MOSP (PAYG) | MCA | Yes | Billing | The migration has no downtime. Changing an MOSP (PAYG) subscription to an MCA subscription offer requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). |
| MOSP (PAYG) | MCA Dev/Test | Yes | Billing | The migration has no downtime. Changing an MOSP (PAYG) subscription to an MCA Dev/Test subscription offer requires a [billing support ticket](https://azure.microsoft.com/support/create-ticket/). |
| MOSP (PAYG) | EA | Yes | Billing | The migration has no downtime. An EA administrator adds the billing admin of the subscription to be migrated to the EA as an EA Account Owner to the EA and then when they sign in to the [EA portal](https://ea.azure.com) they will be prompted to migrate the subscription to the EA billing. Further information is detailed below on this process. THIS INFORMATION NEEDS TO BE SIMPLIFIED AS SMALLER DIGESTIBLE SENTENCES. TRY TO REMOVE "BE" AND WORDS ENDING IN "ED". INSTEAD OF SAYING "IS DETAILED BELOW", ADD A LINK TO WHERE THE READER SHOULD GO NEXT. |
| MOSP (PAYG) | EA Dev/Test | Yes | Billing | The migration has no downtime, but it requires multiple steps. First, migrate from MOSP (PAYG) to a normal EA subscription type. Then migrate from an EA subscription to an EA Dev/Test subscription type. |
| MOSP Dev/Test (PAYG Dev/Test) | EA | Yes | Billing | The migration has no downtime, but it requires multiple steps. First, migrate from MOSP Dev/Test (PAYG) to a normal MOSP (PAYG) subscription type. Then migrate from an MOSP (PAYG) subscription to an EA subscription type. |
| MOSP (PAYG) | MOSP (PAYG) | Yes | Billing | The migration has no downtime. If you're changing the billing owner of the subscription, see [Transfer billing ownership of an Azure subscription to another account](billing-subscription-transfer.md). If you're changing a payment method, see [Add or update a credit card for Azure](change-credit-card.md). |
| MOSP Dev/Test (PAYG Dev/Test) | MOSP (PAYG) | Yes | Billing | The migration has no downtime because it's just an offer change. For more information, see [Change your Azure subscription to a different offer](switch-azure-offer.md). |
| MOSP (PAYG) | MOSP Dev/Test (PAYG Dev/Test) | Yes | Billing | The migration has no downtime because it's just an offer change. For more information, see [Change your Azure subscription to a different offer](switch-azure-offer.md). |
| MOSP (PAYG) | CSP v1 | Yes | Resource | The migration requires resources to migrate from the existing MOSP (PAYG) subscription to a newly created or an existing CSP v1 subscription. Use the information in the [Perform resource migrations](#perform-resource-migrations) section. There may be downtime involved in the migration process. |
| MOSP Dev/Test (PAYG Dev/Test)  | CSP v1 | Yes | Resource | The migration requires resources to migrate from the existing MOSP Dev/Test (PAYG Dev/Test) subscription to a newly created or an existing CSP v1 subscription. Use the information in the [Perform resource migrations](#perform-resource-migrations) section. There may be downtime involved in the migration process. |
| MOSP (PAYG) | CSP v2 (Azure Plan/MPA) | Yes | Resource | The migration requires resources to migrate from the existing MOSP (PAYG) subscription to a newly created or an existing CSP v2 subscription. Use the information in the [Perform resource migrations](#perform-resource-migrations) section. There may be downtime involved in the migration process. |
| MOSP Dev/Test (PAYG Dev/Test) | CSP v2 (Azure Plan/MPA) | Yes | Resource | The migration requires resources to migrate from the existing MOSP Dev/Test (PAYG Dev/Test) subscription to a newly created or an existing CSP v2 subscription. Use the information in the [Perform resource migrations](#perform-resource-migrations) section. There may be downtime involved in the migration process. |

## Perform resource migrations

As you might have noted, most subscription migrations require you to manually migrate Azure resources between subscriptions. Moving resources can incur downtime and there are various limitations to migrate Azure resource types such as VMs, NSGs, App Services, and others.

Microsoft doesn't provide a tool to automatically move resources between subscriptions. Manually migrate Azure resources between subscriptions. If you have a small amount of resources to move, see [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md). When you have a large amount of resources to move, continue to the next section.

### Azure Resource Migration Support tool

There's a third-party tool named [Azure Resource Migration Support tool v10](https://jtjsacpublic.blob.core.windows.net/blogsharedfiles/AzureResourceMigrationSupportV10.xlsx) that can help you plan a large resource migration. It's an Excel workbook that helps you track and compare resource information for the source and destination subscription and resource types. This workbook is based upon the data documented at [Move operation support for resources](azure/azure-resource-manager/management/move-support-resources).

For more information about using the tool, see [Azure Subscription Migrations](https://jacktracey.co.uk/migration/azure-subscription-migrations/). Instructions to use the tool are on the Intro Page sheet in the workbook.

## Next steps

- Read about the [Azure Resource Migration Support tool v10](https://jtjsacpublic.blob.core.windows.net/blogsharedfiles/AzureResourceMigrationSupportV10.xlsx).
- [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md).
