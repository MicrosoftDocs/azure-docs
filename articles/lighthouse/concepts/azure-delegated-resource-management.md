---
title: Azure delegated resource management
description: Azure delegated resource management is a key part of Azure Lighthouse, allowing service providers to manage delegated resources at scale with agility and precision.
ms.date: 10/19/2020
ms.topic: conceptual
---

# Azure delegated resource management

Azure delegated resource management is one of the key components of [Azure Lighthouse](../overview.md). With Azure delegated resource management, service providers can simplify customer engagement and onboarding experiences, while managing delegated resources at scale with agility and precision. Customers maintain control over who can access their tenant, what resources they can access, and what actions can be taken.

## What is Azure delegated resource management?

Azure delegated resource management enables logical projection of resources from one tenant onto another tenant. This lets authorized users in one Azure Active Directory (Azure AD) tenant perform management operations across different Azure AD tenants belonging to their customers. Service providers can sign in to their own Azure AD tenant and have authorization to work in delegated customer subscriptions and resource groups. This lets them perform management operations on behalf of their customers, without having to sign in to each individual customer tenant.

> [!TIP]
> Azure delegated resource management can also be used [within an enterprise which has multiple Azure AD tenants of its own](enterprise.md) to simplify cross-tenant management.

With Azure delegated resource management, authorized users can work directly in the context of a customer subscription without having an account in that customer's tenant or being a co-owner of the customer's tenant.

The [cross-tenant management experience](cross-tenant-management-experience.md) lets you work more efficiently with Azure management services like Azure Policy, Azure Security Center, and more. All service provider activity is tracked in the activity log, which is stored in the customer's tenant (and can be viewed by users in the managing tenant). This means that users in both the managing and the managed tenant can easily identify the user associated with any changes.

You can [publish the new Managed Service offer type to Azure Marketplace](../how-to/publish-managed-services-offers.md) to easily onboard customers to Azure Lighthouse. Alternatively, you can [complete the onboarding process by deploying Azure Resource Manager templates](../how-to/onboard-customer.md).

## How Azure delegated resource management works

At a high level, here's how Azure delegated resource management works:

1. First, you identify the access (roles) that your groups, service principals, or users will need to manage the customer's Azure resources. The access definition contains the managing tenant ID along with **principalId** identities from your tenant mapped to [built-in **roleDefinition** values](../../role-based-access-control/built-in-roles.md) (Contributor, VM Contributor, Reader, etc.).
2. You specify this access and onboard the customer to Azure Lighthouse in one of two ways:
   - [Publish an Azure Marketplace managed service offer](../how-to/publish-managed-services-offers.md) (private or public) that the customer will accept
   - [Deploy an Azure Resource Manager template to the customer's tenant](../how-to/onboard-customer.md) for one or more specific subscriptions or resource groups

3. Once the customer has been onboarded, authorized users can sign in to your managing tenant and perform tasks at the given customer scope, based on the access that you defined. Customers can review service provider actions and have the option to remove access if needed.

> [!NOTE]
> You can manage delegated resources that are located in different [regions](../../availability-zones/az-overview.md#regions). However, delegation of subscriptions across a [national cloud](../../active-directory/develop/authentication-national-cloud.md) and the Azure public cloud, or across two separate national clouds, isn't supported.

## Support for Azure delegated resource management

If you need help related to Azure delegated resource management, you can open a support request in the Azure portal. For **Issue type**, choose **Technical**. Select a subscription, then select **Lighthouse** (under **Monitoring & Management**).

## Next steps

- Learn about [cross-tenant management experiences](cross-tenant-management-experience.md).
- Learn about [managed services offers in Azure Marketplace](managed-services-offers.md).
