---
title: Managed services offers in Azure Marketplace
description: Managed services offers allow service providers to sell resource management offers to customers in Azure Marketplace.
author: JnHs
ms.author: jenhayes
ms.date: 04/03/2019
ms.topic: overview
manager: carmonm
---
# Managed services offers in Azure Marketplace

This article describes the new **Managed Services** offer type in [Azure Marketplace](https://azuremarketplace.microsoft.com), which allow service providers to sell resource management offers to customers (either broadly to all potential customers, or to a specific set of one or more customers that the service provider defines).

Managed services offers streamline the process of onboarding customers for Azure Delegated Resource Management. Once a customer purchases an offer in Azure Marketplace they will be onboarded so that designated users in your organization can perform administration tasks for the customer from within your organization's tenant; no further action is required by either the customer or the service provider. This is because when defining the offer in the [Cloud Partner Portal](https://cloudpartner.azure.com/), you create a manifest that specifies the users and roles who will have access to customer resources using Azure Delegated Resource Management. By assigning permissions to an Azure AD group rather than a series of individual user or application accounts, you can add or remove individual users when your access requirements change.

By creating a public managed services offer in Azure Marketplace, you can promote your services to new customers. Public offers targeting new customers are usually appropriate when you only require limited access to the customer’s tenant. Once you’ve established a relationship with that customer, if they decide they'd like to grant your organization additional access, you can publish a private plan for that customer only, or you can onboard the customer by using Azure Resource Manager templates.

For general info about publishing to Azure Marketplace using the Cloud Partner Portal, see [Azure Marketplace and AppSource Publishing Guide](https://docs.microsoft.com/azure/marketplace/marketplace-publishers-guide). Info about creating and publishing offers can be found in [Manage Azure and AppSource Marketplace offers](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/manage-offers/cpp-manage-offers). To learn how to publish a managed services offer, see [Publish a Managed Services offer to Azure Marketplace](../how-to/publish-managed-services-offers.md).  