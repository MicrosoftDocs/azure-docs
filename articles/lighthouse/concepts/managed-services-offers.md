---
title: Managed services offers in Azure Marketplace
description: Managed services offers allow service providers to sell resource management offers to customers in Azure Marketplace.
author: JnHs
ms.service: lighthouse
ms.author: jenhayes
ms.date: 06/26/2019
ms.topic: overview
manager: carmonm
---

# Managed services offers in Azure Marketplace

This article describes the new **Managed Services** offer type in [Azure Marketplace](https://azuremarketplace.microsoft.com). Managed services offers allow you to offer resource management services to customers with Azure Delegated Resource Management. You can make these offers available to all potential customers or only to one or more specific customers. Since you bill customers directly for costs related to these managed services, there are no fees charged by Microsoft.

## Understand managed services offers

Managed services offers streamline the process of onboarding customers for Azure Delegated Resource Management. Once a customer purchases an offer in Azure Marketplace, they'll be able to specify which subscriptions and/or resource groups should be onboarded so that specified users in your organization can perform administration tasks for the customer from within your organization's tenant. After that, no further action is required by either the customer or the service provider to get the customer onboarded. This is because when you define the offer in the [Cloud Partner Portal](https://cloudpartner.azure.com/), you create a manifest that specifies the users and roles who will have access to customer resources using Azure Delegated Resource Management. By assigning permissions to an Azure AD group rather than a series of individual user or application accounts, you can add or remove individual users when your access requirements change.

By creating a public managed services offer in Azure Marketplace, you can promote your services to new customers. (Public offers are not supported during the limited public preview period.) Public offers targeting new customers are usually appropriate when you only require limited access to the customer's tenant. Once you've established a relationship with that customer, if they decide to grant your organization additional access, you can do so either by publishing a new private plan for that customer only, or by onboarding them for further access using Azure Resource Manager templates.

To learn how to publish a managed services offer, see [Publish a Managed Services offer to Azure Marketplace](../how-to/publish-managed-services-offers.md). For general info about publishing to Azure Marketplace using the Cloud Partner Portal, see [Azure Marketplace and AppSource Publishing Guide](https://docs.microsoft.com/azure/marketplace/marketplace-publishers-guide) and [Manage Azure and AppSource Marketplace offers](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/manage-offers/cpp-manage-offers).

## Next steps

- Learn about [Azure Delegated Resource Management](azure-delegated-resource-management.md) and the [cross-tenant management experience](cross-tenant-management-experience.md).
- [Publish managed services offers](../how-to/publish-managed-services-offers.md) to Azure Marketplace.