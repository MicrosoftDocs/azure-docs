---
title: Azure Delegated Resource Management
description: Managed services offers allow service providers to sell resource management offers to customers in Azure Marketplace.
author: JnHs
ms.service: service-provider-toolkit
ms.author: jenhayes
ms.date: 04/03/2019
ms.topic: overview
manager: carmonm
---
# Azure Delegated Resource Management

Azure Delegated Resource Management is one of the key components of the Microsoft Azure Service Provider Management Toolkit. With Azure Delegated Resource Management, service providers can  simplify customer engagement and onboarding experiences, while managing delegated resources at scale with agility and precision.

> [!IMPORTANT]
> Azure Delegated Resource Management is currently in limited public preview. The info in this topic may change before general availability.

## What is Azure Delegated Resource Management?

Azure Delegated Resource Management lets authorized users in one Azure Active Directory (Azure AD) tenant perform management operations across different Azure AD tenants belonging to their customers. Service providers can sign in to their own Azure AD tenant and have authorization to work in delegated customer subscriptions and resource groups. This lets them perform management operations on behalf of their customers, without having to sign in to each individual customer tenant.

> [!NOTE]
> Azure Delegated Resource Management can also be used within an enterprise which has multiple Azure AD tenants of its own to simplify cross-tenant administration.

With Azure Delegated Resource Management, authorized users can work directly in the context of a customer subscription without needing an account in that customer's tenant. They can also [view and manage all delegated customer subscriptions in the new **My customers** page](../how-to/view-manage-customers.md) in the Azure portal.

The [cross-tenant management experience](cross-tenant-management-experience.md) helps you work more efficiently with Azure management services like Azure Policy, Azure Security Center, and more. All service provider activity is tracked in the activity log, which is stored in the customer's tenant. This means that both the customer and service provider can easily identify the user associated with any changes.

When you onboard a customer to Azure Delegated Resource Management, they’ll have access to the new **Service providers** page in the Azure portal, where they can [confirm and manage their offers, service providers, and delegated resources](../how-to/view-manage-service-providers.md). If the customer ever wants to revoke access for a service provider, they can do so here at any time.

You can [publish the new Managed Services offer type to Azure Marketplace](../how-to/publish-managed-services-offers.md) to easily onboard customers to Azure Delegated Resource Management. Alternatively, you can [complete the onboarding process by deploying Azure Resource Manager templates](../how-to/onboard-customer.md).

## How Azure Delegated Resource Management works

At a high level, here's how Azure Delegated Resource Management works:

1. As a service provider, you identify the access (roles) that your groups, service principals, or users will need to manage the customer's Azure resources. The access definition contains the service provider's tenant ID along with the required access for the offer, defined using **principalId** identities from your tenant mapped to [built-in **roleDefinition** values](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles) (Contributor, VM Contributor, Reader, etc.)
2. You specify this access and onboard the customer to Azure Delegated Resource Management in one of two ways:
   - [Publish an Azure Marketplace managed services offer](../how-to/publish-managed-services-offers.md) (private or public) that the customer will accept
   - [Deploy an Azure Resource Manager template to the customer's tenant](../how-to/onboard-customer.md) for one or more specific subscriptions or resource groups
3. Once the customer has been onboarded, authorized users can sign in to your service provider tenant and perform management tasks at the given customer scope, based on the access that you defined.

## Next steps

- Learn about the [cross-tenant management experience](cross-tenant-management-experience.md).
- Learn about [managed services offers in Azure Marketplace](managed-services-offers.md).