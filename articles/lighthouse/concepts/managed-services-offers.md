---
title: Managed Service offers in Azure Marketplace
description: Offer your Azure Lighthouse management services to customers through Managed Services offers in Azure Marketplace.
ms.date: 03/28/2023
ms.topic: conceptual
---

# Managed Service offers in Azure Marketplace

This article describes the **Managed Service** offer type in [Azure Marketplace](https://azuremarketplace.microsoft.com). Managed Service offers allow you to offer resource management services to customers through [Azure Lighthouse](../overview.md). You can make these offers available to all potential customers, or only to one or more specific customers. Since you bill customers directly for costs related to these managed services, there are no fees charged by Microsoft.

## Understand Managed Service offers

Managed Service offers streamline the process of onboarding customers to Azure Lighthouse. When a customer purchases an offer in Azure Marketplace, they'll be able to specify which subscriptions and/or resource groups should be onboarded.

For each offer, you define the access that users in your organization will have to work on resources in the customer tenant. This is done through a manifest that specifies the Microsoft Entra users, groups, and service principals that will have access to customer resources, along with [roles that define their level of access](tenants-users-roles.md#role-support-for-azure-lighthouse).

> [!NOTE]
> Managed Service offers may not be available in Azure Government and other national clouds.

## Public and private plans

Each Managed Service offer includes one or more plans. Plans can be either private or public.

If you want to limit your offer to specific customers, you can publish a private plan. When you do so, the plan can only be purchased for the specific subscription IDs that you provide. For more info, see [Private plans](/partner-center/marketplace/private-plans).

> [!NOTE]
> Private plans are not supported with subscriptions established through a reseller of the Cloud Solution Provider (CSP) program.

Public plans let you promote your services to new customers. These are usually more appropriate when you only require limited access to the customer's tenant. Once you've established a relationship with a customer, if they decide to grant your organization additional access, you can do so either by publishing a new private plan for that customer only, or by [onboarding them for further access using Azure Resource Manager templates](../how-to/onboard-customer.md).

If appropriate, you can include both public and private plans in the same offer.

> [!IMPORTANT]
> Once a plan has been published as public, you can't change it to private. To control which customers can accept your offer and delegate resources, use a private plan. With a public plan, you can't restrict availability to certain customers or even to a certain number of customers (although you can stop selling the plan completely if you choose to do so). After a customer accepts an offer, you can [remove access to a delegation](../how-to/remove-delegation.md) only if you included an **Authorization** with the **Role Definition** set to [Managed Services Registration Assignment Delete Role](../../role-based-access-control/built-in-roles.md#managed-services-registration-assignment-delete-role) when you published the offer. You can also reach out to the  customer and ask them to [remove your access](../how-to/view-manage-service-providers.md#remove-service-provider-offers).

## Publish Managed Service offers

To learn how to publish a Managed Service offer, see [Publish a Managed Service offer to Azure Marketplace](../how-to/publish-managed-services-offers.md).

## Next steps

- Learn about Azure Lighthouse [architecture](architecture.md) and [cross-tenant management experiences](cross-tenant-management-experience.md).
- Learn about the [commercial marketplace](/partner-center/marketplace/overview).
- [Publish Managed Service offers](../how-to/publish-managed-services-offers.md) to Azure Marketplace.
