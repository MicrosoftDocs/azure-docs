---
title: Azure subscription migration
description: This article helps you understand what's needed to migrate Azure subscriptions and provides links to other articles for more detailed information.
author: bandersmsft
ms.reviewer: jatracey
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 12/08/2020
ms.author: banders
ms.custom: 
---

# Azure subscription migration hub

This article helps you understand what's needed to migrate Azure subscriptions between different billing models and types and then provides links to other articles for more detailed information about specific migrations or transfers. Azure subscriptions are created upon different Azure agreement types and a migration from a source agreement type to another varies depending on the source and destination agreement types. Subscription migrations can be an automatic or a manual process, depending on the source and destination subscription type. If it's a manual process, the subscription agreement types determine how much manual effort is needed.

This article focuses on subscription migrations. However, resource migration is also discussed as this is required for some susbcription migration scenarios. 

For subscription migrations between different Azure AD tenants please follow this [documentation.](https://docs.microsoft.com/en-us/azure/role-based-access-control/transfer-subscription)

> [!NOTE]
> The rest of this page refers to subscription migrations within the same Azure AD tenant, unless otherwise specified.

## Subscription migration planning

As you begin to plan your subscription migration, consider the information needed to answer to the following questions:

- Why is the subscription migration required?
- What are the desired timelines for the subscription migration?
- What is the subscriptions current offer type and what do you want to migrate it too?
  - Microsoft Online Service Program (MOSP), also known as Pay-As-You-Go (PAYG).
  - Microsoft Cloud Solution Provider (CSP) v1
  - Microsoft Cloud Solution Provider (CSP) v2 (Azure Plan), also known as Microsoft Partner Agreement (MPA).
  - Enterprise Agreement (EA)
  - Microsoft Customer Agreement (MCA)
  - Others like MSDN, BizSpark, EOPEN, Azure Pass and Free Trial.
- Do you have the required permissions on the subscription to perform a migration?

You should have an answer for each question before you start a migration.

The first two questions help you help understand the reasons why the migration is necessary. Answers help you to communicate early with others to set expectations and timelines. Subscription migration effort varies greatly, but a migration is likely to take longer than expected.

Answers for the last two questions help define technical paths that you'll need to follow and identify limitations that a migration combination might have. Limitations are covered more fully in the next section.

## Subscription migration support

The following table describes subscription migration support and the considerations for subscription agreement types. Links are provided for more information about each type of migration.

| **Source Subscription Type** | **Destination Subscription Type** | **Considerations** |
| --- | --- | --- |
| MOSP (pay-as-you-go) | EA | There's no subscription or resource downtime. The migration is an Azure billing change. For more information, see [LINKNAME](URL). |
| MOSP (pay-as-you-go) | CSP v1 | Manually migrate resources between subscriptions. Downtime is possible and there are some limitations. Verify that the services that are currently in-use are available in CSP. Azure classic (ASM) resources aren't supported in CSP v1. For more information, see [LINKNAME](URL). |
| MOSP (pay-as-you-go) | CSP v2 (Azure plan) | Manually migrate resources between subscriptions. Downtime is possible and there are some limitations. Verify that the services that are currently in-use are available in CSP. For more information, see [LINKNAME](URL). |
| MOSP (pay-as-you-go) | MCA | Manually migrate resources between subscriptions. Downtime is possible and there are some limitations. For more information, see [LINKNAME](URL). |
| MOSP (pay-as-you-go) | MSDN or BizSpark | Manually migrate resources between subscriptions. Downtime is possible and there are some limitations. For more information, see [LINKNAME](URL). |
| MOSP (pay-as-you-go) | MOSP (pay-as-you-go) | Manually migrate resources between subscriptions. Downtime is possible and there are some limitations. For more information, see [LINKNAME](URL). |
| EA | MOSP (pay-as-you-go) | Manually migrate resources between subscriptions. Downtime is possible and there are some limitations. For more information, see [Transfer an Enterprise subscription to a Pay-As-You-Go subscription](ea-transfers.md#transfer-an-enterprise-subscription-to-a-pay-as-you-go-subscription). |
| EA | CSP v1 | Manually migrate resources between subscriptions. Downtime is possible and there are some limitations. Verify that the services that are currently in-use are available in CSP. Azure classic (ASM) resources aren't supported in CSP v1. For more information, see [LINKNAME](URL). |
| EA | CSP v2 (Azure plan) | The migration is an Azure billing change. There are some limitations with reservations and some Azure Marketplace items. Marketplace items must be available in the CSP Marketplace to transfer. There's no subscription or resource downtime. The migration is only available to CSP Direct Bill Partners who are Azure Expert MSPs. For more information, see [Transfer an EA subscription to CSP v2](transfer-enterprise-subscription-partner.md) and [Get billing ownership of Azure subscriptions to your MPA account](mpa-request-ownership.md). |
| EA | MCA | The migration is an Azure billing change. There's no subscription or resource downtime. For more information, see [Set up your billing account for a Microsoft Customer Agreement]( https://docs.microsoft.com/azure/cost-management-billing/manage/mca-setup-account). |
| EA | MSDN or BizSpark | Manually migrate resources between subscriptions. Downtime is possible and there are some limitations. For more information, see [LINKNAME](URL). |
| EA | EA | If you want to migrate to a different Azure AD tenant, then must manually migrate resources between subscriptions and downtime is possible. There are some limitations. For more information, see [Azure Enterprise transfers](ea-transfers.md). <p> If you want to migrate to the same Azure AD Tenant, there's no need to migrate the subscription. Instead, just change the subscription owner. For more information, see [Change Azure subscription or account ownership](ea-portal-administration.md#change-azure-subscription-or-account-ownership). |
| MSDN | MCA | The migration is an Azure billing change. There's no subscription or resource downtime. For more information, see [Transfer billing ownership of an Azure subscription to another account](billing-subscription-transfer.md). |
| BizSpark | MCA | Manually migrate resources between subscriptions. Downtime is possible and there are some limitations. Not all offer types can migrate to MCA. For more information, see [Supported subscription types](../understand/subscription-transfer.md#supported-subscription-types). |
| MSDN or BizSpark | EA | The migration is an Azure billing change. There's no subscription or resource downtime. For more information, see [LINKNAME](URL). |
| MSDN or BizSpark | MOSP (pay-as-you-go) | Manually migrate resources between subscriptions. Downtime is possible and there are some limitations. For more information, see [LINKNAME](URL). |
| MSDN or BizSpark | CSP v1 | Manually migrate resources between subscriptions. Downtime is possible and there are some limitations. For more information, see [LINKNAME](URL). |
| MSDN or BizSpark | CSP v2 (Azure plan) | Manually migrate resources between subscriptions. Downtime is possible and there are some limitations. For more information, see [LINKNAME](URL). |
| MSDN or BizSpark | MSDN or BizSpark | Manually migrate resources between subscriptions. Downtime is possible and there are some limitations. For more information, see [LINKNAME](URL). |
| CSP v1 | MSDN or BizSpark | Manually migrate resources between subscriptions. Downtime is possible and there are some limitations. For more information, see [LINKNAME](URL). |
| CSP v1 | MOSP (pay-as-you-go) | Manually migrate resources between subscriptions. Downtime is possible and there are some limitations. For more information, see [LINKNAME](URL). |
| CSP v1 | EA | Manually migrate resources between subscriptions. Downtime is possible and there are some limitations. For more information, see [LINKNAME](URL). |
| CSP v1 | CSP v1 | The migration is an Azure billing change. However, the migration is initiated by a customer. For more information, see [Learn how to transfer a customer's Azure subscriptions to another partner](/partner-center/switch-azure-subscriptions-to-a-different-partner). |
| CSP v1 | CSP v2 (Azure plan) | Can only be done by the CSP partner who provides Azure Subscriptions to you. Can't be done when transferring between CSP partners as above. First change your CSP partner. Your new partner completes the migration. For more information, see [Transition customers to Azure plan from existing CSP Azure offers](/partner-center/azure-plan-transition). |
| CSP v2 (Azure plan) | MSDN or BizSpark | Manually migrate resources between subscriptions. Downtime is possible and there are some limitations. For more information, see [LINKNAME](URL). |
| CSP v2 (Azure plan) | EA | Manually migrate resources between subscriptions. Downtime is possible and there are some limitations. For more information, see [LINKNAME](URL). |
| CSP v2 (Azure plan) | MOSP (pay-as-you-go) | Manually migrate resources between subscriptions. Downtime is possible and there are some limitations. For more information, see [LINKNAME](URL). |
| CSP v2 (Azure plan) | CSP v2 (Azure plan) | Partners can migrate subscriptions, but the customer must initiate the process. For more information, see [Transfer subscriptions under an Azure plan from one partner to another](azure-plan-subscription-transfer-partners.md). |

## Perform resource migrations

As you might have noted, most subscription migrations require you to manually migrate Azure resources between subscriptions. Moving resources can incur downtime and there are various limitations to migrate Azure resource types such as VMs, NSGs, App Services, and others.

Microsoft doesn't provide a tool to automatically move resources between subscriptions. Manually migrate Azure resources between subscriptions. If you have a small amount of resources to move, see [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md). When you have a large amount of resources to move, continue to the next section.

### Azure Resource Migration Support tool

There's a third-party tool named [Azure Resource Migration Support tool v10](https://jtjsacpublic.blob.core.windows.net/blogsharedfiles/AzureResourceMigrationSupportV10.xlsx) that can help you plan a large resource migration. It's an Excel workbook that helps you track and compare resource information for the source and destination subscription and resource types.

For more information about using the tool, see [Azure Subscription Migrations](https://jacktracey.co.uk/migration/azure-subscription-migrations/). Instructions to use the tool are on the Intro Page sheet in the workbook.

## Next steps

- Read about the [Azure Resource Migration Support tool v10](https://jtjsacpublic.blob.core.windows.net/blogsharedfiles/AzureResourceMigrationSupportV10.xlsx).
- [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md).
