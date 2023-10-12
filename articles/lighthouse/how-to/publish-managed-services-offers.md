---
title: Publish a Managed Service offer to Azure Marketplace
description: Learn how to publish a Managed Service offer that onboards customers to Azure Lighthouse.
ms.date: 03/28/2023
ms.topic: how-to
---

# Publish a Managed Service offer to Azure Marketplace

In this article, you'll learn how to publish a public or private Managed Service offer to [Azure Marketplace](https://azuremarketplace.microsoft.com) using the [commercial marketplace](/partner-center/marketplace/overview) program in Partner Center. Customers who purchase the offer will then delegate subscriptions or resource groups, allowing you to manage them through [Azure Lighthouse](../overview.md).

## Publishing requirements

You must have a valid [account in Partner Center](/partner-center/marketplace/create-account) to create and publish offers. If you don't have an account already, the [sign-up process](https://aka.ms/joinmarketplace) will lead you through the steps of creating an account in Partner Center and enrolling in the commercial marketplace program.

Per the [Managed Service offer certification requirements](/legal/marketplace/certification-policies#700-managed-services), you must have a [Silver or Gold Cloud Platform competency level](/partner-center/learn-about-competencies) or be an [Azure Expert MSP](https://partner.microsoft.com/membership/azure-expert-msp) in order to publish a Managed Service offer.

If you don't want to publish an offer to Azure Marketplace, or if you don't meet all the requirements, you can [onboard customers manually by using Azure Resource Manager templates](onboard-customer.md).

The following table can help determine whether to onboard customers by publishing a Managed Service offer or by using Azure Resource Manager templates.

|**Consideration**  |**Managed Service offer**  |**ARM templates**  |
|---------|---------|---------|
|Requires [Partner Center account](/partner-center/marketplace/create-account)   |Yes         |No        |
|Requires [Silver or Gold Cloud Platform competency level](/partner-center/learn-about-competencies) or [Azure Expert MSP](https://partner.microsoft.com/membership/azure-expert-msp)      |Yes         |No         |
|Available to new customers through Azure Marketplace     |Yes     |No       |
|Can limit offer to specific customers     |Yes (only with private plans, which can't be used with subscriptions established through a reseller of the Cloud Solution Provider (CSP) program)         |Yes         |
|Can [automatically connect customers to your CRM system](/partner-center/marketplace/plan-managed-service-offer#customer-leads) |Yes  |No   |
|Requires customer acceptance in Azure portal     |Yes     |No   |
|Can use automation to onboard multiple subscriptions, resource groups, or customers |No     |Yes    |
|Immediate access to new built-in roles and Azure Lighthouse features     |Not always (generally available after some delay)         |Yes         |
|Customers can review and accept updated offers in the Azure portal | Yes | No |

> [!NOTE]
> Managed Service offers may not be available in Azure Government and other national clouds.

## Create your offer

For detailed instructions about how to create your offer, including all of the information and assets you'll need to provide, see [Create a Managed Service offer](/partner-center/marketplace/create-managed-service-offer).

To learn about the general publishing process, review the [commercial marketplace documentation](/partner-center/marketplace/overview). You should also review the [commercial marketplace certification policies](/legal/marketplace/certification-policies), particularly the [Managed Services](/legal/marketplace/certification-policies#700-managed-services) section.

Once a customer adds your offer, they will be able to delegate one or more subscriptions or resource groups, which will then be [onboarded to Azure Lighthouse](#the-customer-onboarding-process).

> [!IMPORTANT]
> Each plan in a Managed Service offer includes a **Manifest Details** section, where you define the Microsoft Entra entities in your tenant that will have access to the delegated resource groups and/or subscriptions for customers who purchase that plan. It's important to be aware that any group (or user or service principal) that you include will have the same permissions for every customer who purchases the plan. To assign different groups to work with each customer, you can publish a separate [private plan](/partner-center/marketplace/private-plans) that is exclusive to each customer. These private plans are not supported with subscriptions established through a reseller of the Cloud Solution Provider (CSP) program.

## Publish your offer

Once you've completed all of the sections, your next step is to publish the offer. After you initiate the publishing process, your offer will go through several validation and publishing steps. For more information, see [Review and publish an offer to the commercial marketplace](/partner-center/marketplace/review-publish-offer).

You can [publish an updated version of your offer](/partner-center/marketplace/update-existing-offer) at any time. For example, you may want to add a new role definition to a previously published offer. When you do so, customers who have already added the offer will see an icon in the **Service providers** page in the Azure portal that lets them know an update is available. Each customer will be able to [review the changes and update to the new version](view-manage-service-providers.md#update-service-provider-offers).

## The customer onboarding process

After a customer adds your offer, they can [delegate one or more specific subscriptions or resource groups](view-manage-service-providers.md#delegate-resources), which will be onboarded to Azure Lighthouse. If a customer has accepted an offer but has not yet delegated any resources, they'll see a note at the top of the **Service provider offers** section of the **Service providers** page in the Azure portal.

> [!IMPORTANT]
> Delegation must be done by a non-guest account in the customer's tenant who has a role with the `Microsoft.Authorization/roleAssignments/write` permission, such as [Owner](../../role-based-access-control/built-in-roles.md#owner), for the subscription being onboarded (or which contains the resource groups that are being onboarded). To find users who can delegate the subscription, a user in the customer's tenant can select the subscription in the Azure portal, open **Access control (IAM)**, and [view all users with the Owner role](../../role-based-access-control/role-assignments-list-portal.md#list-owners-of-a-subscription).

Once the customer delegates a subscription (or one or more resource groups within a subscription), the **Microsoft.ManagedServices** resource provider is registered for that subscription, and users in your tenant will be able to access the delegated resources according to the authorizations that you defined in your offer.

> [!NOTE]
> To delegate additional subscriptions or resource groups to the same offer at a later time, the customer must [manually register the **Microsoft.ManagedServices** resource provider](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider) on each subscription before delegating.

If you publish an updated version of your offer, the customer can [review the changes in the Azure portal and accept the new version](view-manage-service-providers.md#update-service-provider-offers).

## Next steps

- Learn about the [commercial marketplace](/partner-center/marketplace/overview).
- [Link your partner ID](partner-earned-credit.md) to track your impact across customer engagements.
- Learn about [cross-tenant management experiences](../concepts/cross-tenant-management-experience.md).
- [View and manage customers](view-manage-customers.md) by going to **My customers** in the Azure portal.
