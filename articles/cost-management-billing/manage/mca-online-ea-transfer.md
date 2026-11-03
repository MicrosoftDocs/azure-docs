---
title: Transfer MCA-Online subscriptions to an Enterprise Agreement
description: Learn how to transfer Azure subscriptions from an MCA-Online billing account to an Enterprise Agreement. The transfer is supported only for Individual billing accounts.
author: CLodwigDocs
ms.author: clodwig
ms.reviewer: sakulkar
ms.date: 10/13/2026
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
---

# Transfer MCA-Online subscriptions to an Enterprise Agreement

This article explains how to move Azure subscriptions from a Microsoft Customer Agreement online (MCA-Online) billing account to an existing Enterprise Agreement (EA) enrollment. The transfer is supported only when the source MCA-Online billing account is an **Individual** account. You can't transfer subscriptions in any other type of MCA-Online account to an EA. For alternatives, see [Unsupported account types](#unsupported-account-types). Before you begin, review the [warnings about the conversion](#transfer-subscriptions-from-an-individual-billing-account).

> [!IMPORTANT]
> This article covers billing ownership transfer. It doesn't change the Microsoft Entra directory associated with a subscription. For directory changes, see [Transfer an Azure subscription to a different Microsoft Entra directory](/azure/role-based-access-control/transfer-subscription).

To transfer subscriptions, complete these tasks:

1. [Confirm that the source billing account is an Individual account](#determine-your-account-type) and meet the prerequisites.
1. Review how reservations, savings plans, and other products and benefits behave. See the [Azure product transfer hub](subscription-transfer.md#transfer-reservations-and-savings-plans-with-currency-change).
1. Have an Enterprise Administrator or Department Administrator add you as an account owner in the destination EA enrollment, and then activate the account.
1. Verify that the subscriptions are billed under the intended EA enrollment.

## Prerequisites

### Determine your account type

Your billing account's type determines whether you can move subscriptions to an existing EA. Microsoft sets the account type when it creates the account, based on how you bought or signed up for Azure. You can't change the type. An **Individual** account belongs to one person and is linked to that person's Microsoft account. Any other account type belongs to a company or institution. These types include Standard accounts, which an administrator creates by purchasing Microsoft 365 with a credit card.

To check your account type, use the [Azure Billing REST API](/rest/api/billing/) to list your billing accounts. An Individual account returns `"accountType": "Individual"`. If you don't have access to the API, contact [Azure billing support](https://azure.microsoft.com/support/create-ticket/) to confirm your account type before you start.

> [!NOTE]
> The agreement name, payment method, email domain, sign-in identity, and administrator's job title aren't reliable indicators of account type.

### Required access

To transfer subscriptions from an Individual billing account, you need access in both the source billing account and the destination EA enrollment.

- You must sign in as the identity that originated the source MCA-Online billing account, which is the identity that the account refers to. Only that identity can complete this transfer. Users who were added to the billing account later, such as guests, can't use this process, even if they have the Billing Account Owner role.
- At the time of the transfer, that identity must have the Billing Account Owner role permissions on the source Individual billing account. To learn how to view and manage billing roles, see [Manage billing roles in the Azure portal](understand-mca-roles.md#manage-billing-roles-in-the-azure-portal).
- An Enterprise Administrator, or a Department Administrator for the department that contains your account, must add you as an account owner in the destination EA enrollment. A Department Administrator can only add accounts in their own department. For more information, see [Understand admin roles for Enterprise Agreements in Azure](understand-ea-roles.md).
- The destination EA enrollment must have a department for your account, and the enrollment's authorization level must allow your sign-in type. For more information, see [Authorization levels allowed](direct-ea-administration.md#authorization-levels-allowed).

### Validate reservations, savings plans, and other products

Reservations and savings plans don't necessarily transfer automatically. Because the whole account moves to the EA, you can't leave any products behind. Before you start, create an inventory of the reservations, savings plans, and other products and benefits in the account, and review the product behaviors in the [Azure product transfer hub](subscription-transfer.md#transfer-reservations-and-savings-plans-with-currency-change).

## Transfer subscriptions from an Individual billing account

When an EA administrator adds the identity that originated an Individual billing account as an EA account owner, and that identity activates the account, all subscriptions associated with that identity's Individual billing account move to EA billing. Each identity can have only one Individual MCA-Online billing account.

> [!WARNING]
> The Individual billing account is keyed to your identity. The conversion to EA moves the whole account, including every subscription, billing profile, and invoice section that it contains. You can't select which subscriptions or products move, and you can't reverse the conversion. When you activate the account:
>
> - All subscriptions that include a monthly credit, such as Visual Studio, MPN, and BizSpark, lose the monthly credit.
> - All subscriptions based on a Visual Studio subscriber offer, such as monthly credit for Visual Studio subscribers or pay-as-you-go Dev/Test, are converted to the Enterprise Dev/Test offer.
> - Ensure that you meet all the prerequisites and that you activate the account in the correct enterprise enrollment.

### Process

1. An Enterprise Administrator or Department Administrator adds the identity that originated the Individual billing account, which has the Billing Account Owner role permissions on it, as an account owner in the destination EA enrollment.
1. The new account owner confirms account ownership by using the account ownership email or by signing in to the Azure portal. The EA account status changes from **Pending** to **Active**. For details, see [Add an account and account owner](direct-ea-administration.md#add-an-account-and-account-owner).
1. Follow the enrollment-change steps in [Transfer an Azure subscription to an Enterprise Agreement](mosp-ea-transfer.md).
1. Verify that every eligible subscription from the Individual billing account is billed under the intended EA enrollment.

## Unsupported account types

Transferring subscriptions from an MCA-Online billing account that isn't an Individual account to an EA enrollment isn't supported, including accounts that a company or institution owns.

> [!IMPORTANT]
> Adding the Billing Account Owner of one of these accounts as an EA account owner doesn't transfer the subscriptions that the account owns.

If you need subscriptions from one of these accounts in an EA enrollment, you must move the resources yourself. For more information, see [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md).

## After the transfer

- The person who activated the account is now an EA account owner and can create subscriptions in their EA enrollment account. For more information, see [Create a subscription](direct-ea-administration.md#create-a-subscription).
- Software as a service (SaaS) products that you buy through Azure Marketplace are billed through an Azure subscription but don't move with it. You must transfer them separately. For more information, see [Product transfer planning](subscription-transfer.md#product-transfer-planning).

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Related content

- [Azure billing product transfer hub](subscription-transfer.md)
- [Transfer an Azure subscription to an Enterprise Agreement](mosp-ea-transfer.md)
- [Transfer an Azure subscription to a different Microsoft Entra directory](/azure/role-based-access-control/transfer-subscription)