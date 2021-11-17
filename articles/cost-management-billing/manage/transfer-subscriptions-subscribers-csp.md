---
title: Transfer Azure subscriptions between subscribers and CSPs
description: Learn how you can transfer Azure subscriptions between subscribers and CSPs.
author: bandersmsft
ms.reviewer: dhgandhi
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 04/15/2021
ms.author: banders
---

# Transfer Azure subscriptions between subscribers and CSPs

This article provides high-level steps used to transfer Azure subscriptions to and from Cloud Solution Provider (CSP) partners and their customers. The information here is intended for the Azure subscriber to help them coordinate with their partner. Information that Microsoft partners use for the transfer process is documented at [Learn how to transfer a customer's Azure subscriptions to another partner](/partner-center/switch-azure-subscriptions-to-a-different-partner).

Before you start a transfer request, you should download or export any cost and billing information that you want to keep. Billing and utilization information doesn't transfer with the subscription. For more information about exporting cost management data, see [Create and manage exported data](../costs/tutorial-export-acm-data.md). For more information about downloading your invoice and usage data, see [Download or view your Azure billing invoice and daily usage data](download-azure-invoice-daily-usage-date.md).

If you have any existing reservations, they stop applying 90 days after you transfer a subscription. Be sure to [cancel any reservations and refund them](../reservations/exchange-and-refund-azure-reservations.md) before you transfer a subscription to avoid charges after the 90 day grace period.

## Transfer EA subscriptions to a CSP partner

CSP direct bill partners certified as an [Azure Expert Managed Services Provider (MSP)](https://partner.microsoft.com/membership/azure-expert-msp) can request to transfer Azure subscriptions for their customers that have a Direct Enterprise Agreement (EA). Subscription transfers are allowed only for customers who have accepted a Microsoft Customer Agreement (MCA) and purchased an Azure plan with the CSP Program.

When the request is approved, the CSP can then provide a combined invoice to their customers. To learn more about CSPs transferring subscriptions, see [Get billing ownership of Azure subscriptions for your MPA account](mpa-request-ownership.md).

>[!IMPORTANT]
> After transfering an EA subscription to a CSP partner, any quota increases previously applied to the EA subscription will be reset to the default value. If additional quota is required after the subscription transfer, have your CSP provider submit a [quota increase](../../azure-portal/supportability/regional-quota-requests.md) request. 

## Other subscription transfers to a CSP partner

To transfer any other Azure subscriptions to a CSP partner, the subscriber needs to move resources from source subscriptions to CSP subscriptions. Use the following guidance to move resources between subscriptions.

1. Establish a [reseller relationship](/partner-center/request-a-relationship-with-a-customer) with the customer. Review the [CSP Regional Authorization Overview](/partner-center/regional-authorization-overview) to ensure both customer and Partner tenant are within the same authorized regions.
1. Work with your CSP partner to create target Azure CSP subscriptions.
1. Ensure that the source and target CSP subscriptions are in the same Azure Active Directory (Azure AD) tenant.  
    You can't change the Azure AD tenant for an Azure CSP subscription. Instead, you must add or associate the source subscription to the CSP Azure AD tenant. For more information, see [Associate or add an Azure subscription to your Azure Active Directory tenant](../../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md).
    > [!IMPORTANT]
    > - When you associate a subscription to a different Azure AD directory, users that have roles assigned using [Azure role-based access control (Azure RBAC)](../../role-based-access-control/role-assignments-portal.md) lose their access. Classic subscription administrators, including Service Administrator and Co-Administrators, also lose access.
    > - Policy Assignments are also removed from a subscription when the subscription is associated with a different directory.
1. The user account that you use to do the transfer must have [Azure RBAC](add-change-subscription-administrator.md) owner access on both subscriptions.
1. Before you begin, [validate](/rest/api/resources/resources/validatemoveresources) that all Azure resources can move from the source subscription to the destination subscription.  
    Some Azure resources can't move between subscriptions. To view the complete list of Azure resource that can move, see [Move operation support for resources](../../azure-resource-manager/management/move-support-resources.md).
    > [!IMPORTANT]
    >  - Azure CSP supports only Azure Resource Manager resources. If any Azure resources in the source subscription were created using the Azure classic deployment model, you must migrate them to [Azure Resource Manager](/azure/cloud-solution-provider/migration/ea-payg-to-azure-csp/ea-open-direct-asm-to-arm) before migration. You must be a partner in order to view the web page.

1. Verify that all source subscription services use the Azure Resource Manager model. Then, transfer resources from source subscription to destination subscription using [Azure Resource Move](../../azure-resource-manager/management/move-resource-group-and-subscription.md).
    > [!IMPORTANT]
    >  - Moving Azure resources between subscriptions might result in service downtime, based on resources in the subscriptions.

## Transfer CSP subscription to other offer

To transfer any other subscriptions from a CSP Partner to any other Azure offer, the subscriber needs to move resources between source CSP subscriptions and target subscriptions. This is work done by a partner and a customer - it is not work done by a Microsoft representative.

1. The customer creates target Azure subscriptions.
1. Ensure that the source and target subscriptions are in the same Azure Active Directory (Azure AD) tenant. For more information about changing an Azure AD tenant, see [Associate or add an Azure subscription to your Azure Active Directory tenant](../../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md).
    Note that the change directory option isn't supported for the CSP subscription. For example, you're transferring from a CSP to a pay-as-you-go subscription. You need change the directory of the pay-as-you-go subscription to match the directory.

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
