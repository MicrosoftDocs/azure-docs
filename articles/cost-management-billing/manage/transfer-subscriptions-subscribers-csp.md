---
title: Transfer Azure subscriptions between subscribers and CSPs
description: Learn how you can transfer Azure subscriptions between subscribers and CSPs.
author: bandersmsft
ms.reviewer: dhgandhi
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 05/04/2020
ms.author: banders
---

# Transfer Azure subscriptions between subscribers and CSPs

This article provides high-level steps used to transfer Azure subscriptions between Cloud Solution Provider (CSP) partners and their customers.

## Transfer EA subscriptions

CSP direct bill partners certified as an [Azure Expert Managed Services Provider (MSP)](https://partner.microsoft.com/membership/azure-expert-msp) can request to transfer Azure subscriptions for their customers that have a Direct Enterprise Agreement (EA). Subscription transfers are allowed only for customers who have accepted a Microsoft Customer Agreement (MCA) and purchased an Azure plan.

When the request is approved, the CSP can then provide a combined invoice to their customers. To learn more about CSPs transferring subscriptions, see [Get billing ownership of Azure subscriptions for your MPA account](mpa-request-ownership.md).

## Other subscription transfers to a CSP partner

To transfer any other Azure subscriptions to a CSP partner, the subscriber needs to move resources from source subscriptions to CSP subscriptions. Use the following guidance to move resources between subscriptions.

1. Work with your CSP partner to create target Azure CSP subscriptions.
1. Ensure that the source and target CSP subscriptions are in the same Azure Active Directory (Azure AD) tenant.  
    You can't change the Azure AD tenant for an Azure CSP subscription. Instead, you must add or associate the source subscription to the CSP Azure AD tenant. For more information, see [Associate or add an Azure subscription to your Azure Active Directory tenant](../../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md).
    > [!IMPORTANT]
    > - When you associate a subscription to a different Azure AD directory, users that have roles assigned using [role-based access control (RBAC)](../../role-based-access-control/role-assignments-portal.md) lose their access. Classic subscription administrators, including Service Administrator and Co-Administrators, also lose access.
    > - Policy Assignments are also removed from a subscription when the subscription is associated with a different directory.
1. The user account that you use to do the transfer must have [RBAC](add-change-subscription-administrator.md) owner access on both subscriptions.
1. Before you begin, [validate](/rest/api/resources/resources/validatemoveresources) that all Azure resources can move from the source subscription to the destination subscription.  
    Some Azure resources can't move between subscriptions. To view the complete list of Azure resource that can move, see [Move operation support for resources](../../azure-resource-manager/management/move-support-resources.md).
    > [!IMPORTANT]
    >  - Azure CSP supports only Azure Resource Manager resources. If any Azure resources in the source subscription were created using the Azure classic deployment model, you must migrate them to [Azure Resource Manager](https://docs.microsoft.com/azure/cloud-solution-provider/migration/ea-payg-to-azure-csp/ea-open-direct-asm-to-arm) before migration. You must be a partner in order to view the web page.

1. Verify that all source subscription services use the Azure Resource Manager model. Then, transfer resources from source subscription to destination subscription using [Azure Resource Move](../../azure-resource-manager/management/move-resource-group-and-subscription.md).
    > [!IMPORTANT]
    >  - Moving Azure resources between subscriptions might result in service downtime, based on resources in the subscriptions.

## All subscription transfers from a CSP Partner

To transfer any other subscriptions from a CSP Partner to any other Azure offer, the subscriber needs to move resources between source CSP subscriptions and target subscriptions.

1. Create target Azure subscriptions.
1. Ensure that the source and target subscriptions are in the same Azure Active Directory (Azure AD) tenant. For more information about changing an Azure AD tenant, see [Associate or add an Azure subscription to your Azure Active Directory tenant](../../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md).
    Note that the change directory isn't the CSP subscription. For example, you're transferring from a CSP to a pay-as-you-go subscription. You need change the directory of the pay-as-you-go subscription to match the directory.

    > [!IMPORTANT]
    >  - When you associate a subscription to a different directory, users that have roles assigned using [RBAC](../../role-based-access-control/role-assignments-portal.md) lose their access. Classic subscription administrators, including Service Administrator and Co-Administrators, also lose access.
    >  - Policy Assignments are also removed from a subscription when the subscription is associated with a different directory.

1. The user account that you use to do the transfer must have [RBAC](add-change-subscription-administrator.md) owner access on both subscriptions.
1. Before you begin, [validate](/rest/api/resources/resources/validatemoveresources) that all Azure resources can move from the source subscription to the destination subscription.
    > [!IMPORTANT]
    >  - Some Azure resources can't move between subscriptions. To view the complete list of Azure resource that can move, see [Move operation support for resources](../../azure-resource-manager/management/move-support-resources.md).

1. Transfer resources from the source subscription to the destination subscription using [Azure Resource Move](../../azure-resource-manager/management/move-resource-group-and-subscription.md).
    > [!IMPORTANT]
    >  - Moving Azure resources between subscriptions might result in service downtime, based on resources in the subscriptions.

## Next steps
- [Get billing ownership of Azure subscriptions for your MPA account](mpa-request-ownership.md).
- Read about how to [Manage accounts and subscriptions with Azure Billing](index.yml).
