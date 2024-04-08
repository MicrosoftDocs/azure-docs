---
title: Transfer Azure subscriptions between subscribers and CSPs
description: Learn how you can transfer Azure subscriptions between subscribers and CSPs.
author: bandersmsft
ms.reviewer: sgautam
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 03/21/2024
ms.author: banders
---

# Transfer Azure subscriptions between subscribers and CSPs

This article provides high-level steps used to transfer Azure subscriptions to and from Cloud Solution Provider (CSP) partners and their customers. This information is intended for the Azure subscriber to help them coordinate with their partner. Information that Microsoft partners use for the transfer process is documented at [Transfer subscriptions under an Azure plan from one partner to another](azure-plan-subscription-transfer-partners.md).

Download or export cost and billing information that you want to keep before you start a transfer request. Billing and utilization information doesn't transfer with the subscription. For more information about exporting cost management data, see [Create and manage exported data](../costs/tutorial-export-acm-data.md). For more information about downloading your invoice and usage data, see [Download or view your Azure billing invoice and daily usage data](download-azure-invoice-daily-usage-date.md).

[!INCLUDE [cost-management-billing-subscription-b2b-b2c-transfer-note](../../../includes/cost-management-billing-subscription-b2b-b2c-transfer-note.md)]

## Transfer EA or MCA enterprise subscriptions to a CSP partner

CSP direct bill partners certified as an [Azure Expert Managed Services Provider (MSP)](https://partner.microsoft.com/membership/azure-expert-msp) can request to transfer Azure subscriptions for their customers. The customers must have a Direct Enterprise Agreement (EA) or a Microsoft account team (Microsoft Customer Agreement enterprise). Subscription transfers are allowed only for customers who have accepted an MCA and purchased an Azure plan with the CSP Program.

When the request is approved, the CSP can then provide a combined invoice to their customers. To learn more about CSPs transferring subscriptions, see [Get billing ownership of Azure subscriptions for your MPA account](mpa-request-ownership.md).

>[!IMPORTANT]
> After transfering an EA or MCA enterprise subscription to a CSP partner, any quota increases previously applied to the EA subscription will be reset to the default value. If additional quota is required after the subscription transfer, have your CSP provider submit a [quota increase](../../azure-portal/supportability/regional-quota-requests.md) request. 

## Other subscription transfers to a CSP partner

To transfer any other Azure subscriptions that aren't supported for billing transfer to MPA as documented in the [Azure subscription transfer hub](subscription-transfer.md#product-transfer-support) article, the subscriber needs to move resources from source subscriptions to CSP subscriptions. Use the following guidance to move resources between subscriptions.

1. Establish a [reseller relationship](/partner-center/request-a-relationship-with-a-customer) with the customer. Review the [CSP Regional Authorization Overview](/partner-center/regional-authorization-overview) to ensure both customer and Partner tenant are within the same authorized regions.
1. Work with your CSP partner to create target Azure CSP subscriptions.
1. Ensure that the source and target CSP subscriptions are in the same Microsoft Entra tenant.  
    You can't change the Microsoft Entra tenant for an Azure CSP subscription. Instead, you must add or associate the source subscription to the CSP Microsoft Entra tenant. For more information, see [Associate or add an Azure subscription to your Microsoft Entra tenant](../../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md).
    > [!IMPORTANT]
    > - When you associate a subscription to a different Microsoft Entra directory, users that have roles assigned using [Azure role-based access control (Azure RBAC)](../../role-based-access-control/role-assignments-portal.md) lose their access. Classic subscription administrators, including Service Administrator and Co-Administrators, also lose access.
    > - Policy Assignments are also removed from a subscription when the subscription is associated with a different directory.
1. The user account that you use to do the transfer must have [Azure RBAC](add-change-subscription-administrator.md) owner access on both subscriptions.
1. Before you begin, [validate](/rest/api/resources/resources/validatemoveresources) that all Azure resources can move from the source subscription to the destination subscription.  
    Some Azure resources can't move between subscriptions. To view the complete list of Azure resource that can move, see [Move operation support for resources](../../azure-resource-manager/management/move-support-resources.md).
    > [!IMPORTANT]
    >  - Azure CSP supports only Azure Resource Manager resources. If any Azure resources in the source subscription were created using the Azure classic deployment model, you must migrate them to [Azure Resource Manager](/azure/cloud-solution-provider/migration/ea-payg-to-azure-csp/ea-open-direct-asm-to-arm) before migration. You must be a partner in order to view the web page.

1. Verify that all source subscription services use the Azure Resource Manager model. Then, transfer resources from source subscription to destination subscription using [Azure Resource Move](../../azure-resource-manager/management/move-resource-group-and-subscription.md).
    > [!IMPORTANT]
    >  - Moving Azure resources between subscriptions might result in service downtime, based on resources in the subscriptions.

## Transfer CSP subscription to other offers

It's possible to transfer other subscriptions from a CSP Partner to other Azure offers that aren't supported for billing transfer from MPA as documented in the [Azure subscription transfer hub](subscription-transfer.md#product-transfer-support) article. However, the subscriber needs to manually move resources between source CSP subscriptions and target subscriptions. All work done by a partner and a customer - it isn't work done by a Microsoft representative.

1. The customer creates target Azure subscriptions.
1. Ensure that the source and target subscriptions are in the same Microsoft Entra tenant. For more information about changing a Microsoft Entra tenant, see [Associate or add an Azure subscription to your Microsoft Entra tenant](../../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md).
    The change directory option isn't supported for the CSP subscription. For example, you're transferring from a CSP to a pay-as-you-go subscription. You need to change the directory of the pay-as-you-go subscription to match the directory.

    > [!IMPORTANT]
    >  - When you associate a subscription to a different directory, users that have roles assigned using [Azure RBAC](../../role-based-access-control/role-assignments-portal.md) lose their access. Classic subscription administrators, including Service Administrator and Co-Administrators, also lose access.
    >  - Policy Assignments are also removed from a subscription when the subscription is associated with a different directory.

1. The customer user account that you use to do the transfer must have [Azure RBAC](add-change-subscription-administrator.md) owner access on both subscriptions.
1. Before you begin, [validate](/rest/api/resources/resources/validatemoveresources) that all Azure resources can move from the source subscription to the destination subscription.
    > [!IMPORTANT]
    >  - Some Azure resources can't move between subscriptions. To view the complete list of Azure resource that can move, see [Move operation support for resources](../../azure-resource-manager/management/move-support-resources.md).

1. Transfer resources from the source subscription to the destination subscription using [Azure Resource Move](../../azure-resource-manager/management/move-resource-group-and-subscription.md).
    > [!IMPORTANT]
    >  - Moving Azure resources between subscriptions might result in service downtime, based on resources in the subscriptions.

## Next steps

- [Get billing ownership of Azure subscriptions for your MPA account](mpa-request-ownership.md).
- Read about how to [Manage accounts and subscriptions with Azure Billing](../index.yml).
