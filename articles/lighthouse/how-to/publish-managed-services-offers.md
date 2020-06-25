---
title: Publish a Managed Service offer to Azure Marketplace
description: Learn how to publish a Managed Service offer that onboards customers to Azure delegated resource management.
ms.date: 05/04/2020
ms.topic: how-to
---

# Publish a Managed Service offer to Azure Marketplace

In this article, you'll learn how to publish a public or private Managed Service offer to [Azure Marketplace](https://azuremarketplace.microsoft.com) using the [Commercial Marketplace](../../marketplace/partner-center-portal/commercial-marketplace-overview.md) program in Partner Center. Customers who purchase the offer are then able to to onboard subscriptions and resource groups for [Azure delegated resource management](../concepts/azure-delegated-resource-management.md).

## Publishing requirements

You need to have a valid [account in Partner Center](../../marketplace/partner-center-portal/create-account.md) to create and publish offers. If you don't have an account already, the [sign-up process](https://aka.ms/joinmarketplace) will lead you through the steps of creating an account in Partner Center and enrolling in the Commercial Marketplace program.

Per the [Managed Service offer certification requirements](https://docs.microsoft.com/legal/marketplace/certification-policies#7004-business-requirements), you must have a [Silver or Gold Cloud Platform competency level](https://docs.microsoft.com/partner-center/learn-about-competencies) or be an [Azure Expert MSP](https://partner.microsoft.com/membership/azure-expert-msp) in order to publish a Managed Service offer.

Your Microsoft Partner Network (MPN) ID will be [automatically associated](../../billing/billing-partner-admin-link-started.md) with the offers you publish to track your impact across customer engagements.

> [!NOTE]
> If you don't want to publish an offer to Azure Marketplace, you can onboard customers manually by using Azure Resource Manager templates. For more info, see [Onboard a customer to Azure delegated resource management](onboard-customer.md).

## Create your offer

For detailed instructions about how to create your offer, including all of the information and assets you'll need to provide, see  [Create a Managed Service offer](../../marketplace/partner-center-portal/create-new-managed-service-offer.md).

To learn about the general publishing process, see [Azure Marketplace and AppSource Publishing Guide](../../marketplace/marketplace-publishers-guide.md). You should also review the [commercial marketplace certification policies](https://docs.microsoft.com/legal/marketplace/certification-policies), particularly the [Managed Services](https://docs.microsoft.com/legal/marketplace/certification-policies#700-managed-services) section.

Once a customer adds your offer, they will be able to delegate one or more subscriptions or resource groups, which will then be [onboarded for Azure delegated resource management](#the-customer-onboarding-process).

> [!IMPORTANT]
> Each plan in a Managed Service offer includes a **Manifest Details** section, where you define the Azure Active Directory (Azure AD) entities in your tenant that will have access to the delegated resource groups and/or subscriptions for customers who purchase that plan. It's important to be aware that any group (or user or service principal) that you include will have the same permissions for every customer who purchases the plan. To assign different groups to work with each customer, you'll need to publish a separate [private plan](../../marketplace/private-offers.md) that is exclusive to each customer.

## Publish your offer

Once you've completed all of the sections, your next step is to publish the offer to Azure Marketplace. Select the **Publish** button to initiate the process of making your offer live. More info about this process, can be found [here](../../marketplace/partner-center-portal/create-new-managed-service-offer.md#publish). 

You can [publish an updated version of your offer](../..//marketplace/partner-center-portal/update-existing-offer.md) at any time. For example, you may want to add a new role definition to a previously-published offer. When you do so, customers who have already added the offer will see an icon in the [**Service providers**](view-manage-service-providers.md) page in the Azure portal that lets them know an update is available. Each customer will be able to [review the changes](view-manage-service-providers.md#update-service-provider-offers) and decide whether they want to update to the new version. 

## The customer onboarding process

After a customer adds your offer, they'll be able to [delegate one or more specific subscriptions or resource groups](view-manage-service-providers.md#delegate-resources), which will then be onboarded for Azure delegated resource management. If a customer has accepted an offer but has not yet delegated any resources, they'll see a note at the top of the **Provider offers** section of the [**Service providers**](view-manage-service-providers.md) page in the Azure portal.

> [!IMPORTANT]
> Delegation must be done by a non-guest account in the customer's tenant which has the [Owner built-in role](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#owner) for the subscription being onboarded (or which contains the resource groups that are being onboarded). To see all users who can delegate the subscription, a user in the customer's tenant can select the subscription in the Azure portal, open **Access control (IAM)**, and [view all users with the Owner role](../../role-based-access-control/role-assignments-list-portal.md#list-owners-of-a-subscription).

Once the customer delegates a subscription (or one or more resource groups within a subscription), the **Microsoft.ManagedServices** resource provider will be registered for that subscription, and users in your tenant will be able to access the delegated resources according to the authorizations in your offer.

## Next steps

- Learn about the [Commercial Marketplace](../../marketplace/partner-center-portal/commercial-marketplace-overview.md).
- Learn about [cross-tenant management experiences](../concepts/cross-tenant-management-experience.md).
- [View and manage customers](view-manage-customers.md) by going to **My customers** in the Azure portal.
