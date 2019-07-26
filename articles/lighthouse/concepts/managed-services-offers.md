---
title: Managed services offers in Azure Marketplace
description: Managed services offers allow service providers to sell resource management offers to customers in Azure Marketplace.
author: JnHs
ms.service: lighthouse
ms.author: jenhayes
ms.date: 07/11/2019
ms.topic: overview
manager: carmonm
---

# Managed services offers in Azure Marketplace

This article describes the new **Managed Services** offer type in [Azure Marketplace](https://azuremarketplace.microsoft.com). Managed services offers allow you to offer resource management services to customers with Azure delegated resource management. You can make these offers available to all potential customers or only to one or more specific customers. Since you bill customers directly for costs related to these managed services, there are no fees charged by Microsoft.

## Understand managed services offers

Managed services offers streamline the process of onboarding customers for Azure delegated resource management. Once a customer purchases an offer in Azure Marketplace, they'll be able to specify which subscriptions and/or resource groups should be onboarded so that specified users in your organization can perform administration tasks for the customer from within your organization's tenant.

After that, no further action is required by either the customer or the service provider to get the customer onboarded. This is because when you define the offer in the [Cloud Partner Portal](https://cloudpartner.azure.com/), you create a manifest that specifies the Azure AD users, groups, and service principles that will have access to customer resources using Azure delegated resource management. along with roles that define their level of access. By assigning permissions to an Azure AD group rather than a series of individual user or application accounts, you can add or remove individual users when your access requirements change.

## Public and private offers

Each managed services offer includes one or more plans. These plans can be either private or public.

If you want to limit your offer to specific customers, you can publish a private plan. When you do so, the plan can only be purchased for the specific] subscription IDs that you provide. For more info, see [Private offers](https://docs.microsoft.com/azure/marketplace/private-offers).

Public plans let you promote your services to new customers. These are usually more appropriate when you only require limited access to the customer's tenant. Once you've established a relationship with a customer, if they decide to grant your organization additional access, you can do so either by publishing a new private plan for that customer only, or by [onboarding them for further access using Azure Resource Manager templates](../how-to/onboard-customer.md).

Keep in mind that once a plan has been published as public, you can't change it to private. Additionally, you can't restrict a public plan's availability to certain customers or even to a certain number of customers, although you can stop selling the plan completely if you choose to do so.

If appropriate, you can include both public and private plans in the same offer.

## Publish managed service offers

To learn how to publish a managed services offer, see [Publish a Managed Services offer to Azure Marketplace](../how-to/publish-managed-services-offers.md). For general info about publishing to Azure Marketplace using the Cloud Partner Portal, see [Azure Marketplace and AppSource Publishing Guide](https://docs.microsoft.com/azure/marketplace/marketplace-publishers-guide) and [Manage Azure and AppSource Marketplace offers](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/manage-offers/cpp-manage-offers).

## Next steps

- Learn about [Azure delegated resource management](azure-delegated-resource-management.md) and [cross-tenant management experiences](cross-tenant-management-experience.md).
- [Publish managed services offers](../how-to/publish-managed-services-offers.md) to Azure Marketplace.
