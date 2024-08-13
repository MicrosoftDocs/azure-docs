---
title: Protect tenants and subscriptions from abuse and fraud attacks
description: Learn how to protect your tenants and subscriptions from abuse and fraud attacks.
author: bandersmsft
ms.reviewer: macyso
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 07/30/2024
ms.author: banders
---

# Protect tenants and subscriptions from abuse and fraud attacks

Due to a rise in unauthorized access and fraud targeting Microsoft's tenants and customers' unused tenants, we created this guide to help you protect your tenants and subscriptions. The primary actions to protect them are for you to:

- Delete unnecessary or unused tenants and subscriptions
- Transfer subscriptions to an active tenant

This article contains links to articles that explain transfer and cancellation actions that you can use to clean up any unnecessary or unused tenants or subscriptions.

## Azure subscriptions

Use the following information to help remove any unnecessary or unused subscriptions.

### Delete subscriptions and resources

To delete your Azure Subscription, see [Cancel and delete your Azure subscription](cancel-azure-subscription.md).

### Transfer subscription and resources

Use the following information to transfer your subscription to a different tenant, Enterprise Agreement account, or partner.

#### Transfer to a different tenant

If you bought your subscription directly from Microsoft, see [Azure product transfer hub](subscription-transfer.md).

#### Transfer to a different Enterprise Agreement account

If you have an Enterprise Agreement (EA) account and want to transfer an individual Microsoft Online Service Program (MOSP)) subscription (Azure offer MS-AZR-0003P pay-as-you-go) to your EA, see [Transfer an Azure subscription to an Enterprise Agreement](mosp-ea-transfer.md).

To transfer a different subscription type, like a Cloud Solution Provider (CSP) or an enterprise Microsoft Customer Agreement (MCA) subscription, to an EA, see [Product transfer support](subscription-transfer.md#product-transfer-support).

#### Transfer to a different partner

To transfer your subscription to a different partner, see [Transfer subscriptions under an Azure plan from one partner to another](azure-plan-subscription-transfer-partners.md).

#### Transfer a subscription to a different Microsoft Entra directory (Optional)

To transfer your subscription to a different Microsoft Entra directory, see [Transfer an Azure subscription to a different Microsoft Entra directory](../../role-based-access-control/transfer-subscription.md#overview).

### Delete a tenant

When a tenant is deleted in Microsoft Entra ID, all resources within the tenant are also deleted. You can’t delete a tenant until it passes several checks. These checks are to reduce accidental deletion, which negatively affects user access in the Microsoft 365 Admin Center and the Azure portal.

To delete a tenant, see [Delete a Microsoft Entra tenant](/entra/identity/users/directory-delete-howto).

## Microsoft 365 subscriptions

To cancel or delete a Microsoft 365 subscription, see the following articles:

- If you bought your subscription directly from Microsoft and have an MCA billing account, see [Cancel subscription when you have an MCA account type](/microsoft-365/commerce/subscriptions/cancel-your-subscription#cancel-your-subscription-when-you-have-an-mca-billing-account-type).
- If you bought your subscription directly from Microsoft and have a Microsoft Online Subscription Agreement (MOSA) billing account, see [Cancel your subscription when you have an MOSA billing account type](/microsoft-365/commerce/subscriptions/cancel-your-subscription#cancel-your-subscription-when-you-have-an-mosa-billing-account-type).
- If you bought subscriptions from a third-party app, see [Cancel a third-party app subscription](/microsoft-365/commerce/manage-saas-apps#cancel-a-third-party-app-subscription).
- If you bought your subscription from a CSP, see [Cancel a subscription](/partner-center/customers/create-a-new-subscription#cancel-a-subscription).
- If you bought your subscription through Volume Licensing (VL), see [How do I cancel a Reservation order](/microsoft-365/commerce/licenses/manage-license-requests-faq?#how-do-i-cancel-reservation-order-).

To learn more, see [Cancel your Microsoft business subscription in the Microsoft 365 admin center](/microsoft-365/commerce/subscriptions/cancel-your-subscription#steps-to-cancel-your-subscription).

## Related Content

- [Move resources to a new subscription or resource group](/azure/azure-resource-manager/management/move-resource-group-and-subscription#checklist-before-moving-resources)
- [Transfer Azure subscriptions between subscribers and Cloud Solution Providers](/azure/cost-management-billing/manage/transfer-subscriptions-subscribers-csp)
- [Delete resource group and resources](/azure/azure-resource-manager/management/delete-resource-group?source=recommendations&tabs=azure-powershell)
- [Cancel and delete your Azure subscription](/azure/cost-management-billing/manage/cancel-azure-subscription)
- [Cancel your Microsoft business subscription in the Microsoft 365 admin center](/microsoft-365/commerce/subscriptions/cancel-your-subscription#steps-to-cancel-your-subscription)