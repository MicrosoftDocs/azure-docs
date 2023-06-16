---
title: Azure Lighthouse architecture
description: Learn about the relationship between tenants in Azure Lighthouse, and the resources created in the customer's tenant that enable that relationship.
ms.date: 05/10/2023
ms.topic: conceptual
---

# Azure Lighthouse architecture

Azure Lighthouse helps service providers simplify customer engagement and onboarding experiences, while managing delegated resources at scale with agility and precision. Authorized users, groups, and service principals can work directly in the context of a customer subscription without having an account in that customer's Azure Active Directory (Azure AD) tenant or being a co-owner of the customer's tenant. The mechanism used to support this access is called Azure delegated resource management.

:::image type="content" source="../media/delegation.jpg" alt-text="Diagram illustrating Azure delegated resource management.":::

> [!TIP]
> Azure Lighthouse can also be used [within an enterprise which has multiple Azure AD tenants of its own](enterprise.md) to simplify cross-tenant management.

This topic discusses the relationship between tenants in Azure Lighthouse, and the resources created in the customer's tenant that enable that relationship.

> [!NOTE]
> Onboarding a customer to Azure Lighthouse requires a deployment by a non-guest account in the customer's tenant who has a role with the `Microsoft.Authorization/roleAssignments/write` permission, such as [Owner](../../role-based-access-control/built-in-roles.md#owner), for the subscription being onboarded (or which contains the resource groups that are being onboarded).

## Delegation resources created in the customer tenant

When a customer’s subscription or resource group is onboarded to Azure Lighthouse, two resources are created: the **registration definition** and the **registration assignment**. You can use [APIs and management tools](cross-tenant-management-experience.md#apis-and-management-tool-support) to access these resources, or work with them [in the Azure portal](../how-to/view-manage-customers.md).

### Registration definition

The registration definition contains the details of the Azure Lighthouse offer (the managing tenant ID and the authorizations that assign built-in roles to specific users, groups, and/or service principals in the managing tenant.

A registration definition is created at the subscription level for each delegated subscription, or in each subscription that contains a delegated resource group. When using APIs to create a registration definition, you’ll need to work at the subscription level. For instance, using Azure PowerShell, you’ll need to use New-AzureRmDeployment before you create a new registration definition ([New-AzManagedServicesDefinition](/powershell/module/az.managedservices/new-azmanagedservicesdefinition)), rather than using New-AzureRmResourceGroupDeployment.

### Registration assignment

The registration assignment assigns the registration definition to a specific scope—that is, the onboarded subscription(s) and/or resource group(s).

A registration assignment is created in each delegated scope, so it will either be at the subscription group level or the resource group level, depending on what was onboarded.

Each registration assignment must reference a valid registration definition at the subscription level, tying the authorizations for that service provider to the delegated scope and thus granting access.

## Logical projection

Azure Lighthouse creates a logical projection of resources from one tenant onto another tenant. This lets authorized service provider users sign in to their own tenant with authorization to work in delegated customer subscriptions and resource groups. Users in the service provider's tenant can then perform management operations on behalf of their customers, without having to sign in to each individual customer tenant.

Whenever a user, group, or service principal in the service provider tenant accesses resources in a customer's tenant, Azure Resource Manager receives a request. Resource Manager authenticates these requests, just as it does for requests made by users within the customer's own tenant. For Azure Lighthouse, it does this by confirming that two resources—the registration definition and the registration assignment—are present in the customer's tenant. If so, Resource Manager authorizes the access according to the information defined by those resources.

:::image type="content" source="../media/logical-projection.jpg" alt-text="Diagram illustrating the logical projection in Azure Lighthouse.":::

Activity from users in the service provider's tenant is tracked in the activity log, which is stored in the customer's tenant. This allows the customer to [see what changes were made and by whom](../how-to/view-service-provider-activity.md).

## How Azure Lighthouse works

At a high level, here's how Azure Lighthouse works for the managing tenant:

1. Identify the [roles](tenants-users-roles.md#role-support-for-azure-lighthouse) that your groups, service principals, or users will need to manage the customer's Azure resources.
2. Specify this access and onboard the customer to Azure Lighthouse either by [publishing a Managed Service offer to Azure Marketplace](../how-to/publish-managed-services-offers.md), or by [deploying an Azure Resource Manager template](../how-to/onboard-customer.md). This onboarding process creates the two resources described above (registration definition and registration assignment) in the customer's tenant.
3. Once the customer has been onboarded, authorized users sign in to your managing tenant and perform tasks at the specified customer scope (subscription or resource group) per the access that you defined. Customers can review all actions taken, and they can remove access at any time.

While in most cases only one service provider will be managing specific resources for a customer, it’s possible for the customer to create multiple delegations for the same subscription or resource group, allowing multiple service providers to have access. This scenario also enables ISV scenarios that [project resources from the service provider’s tenant to multiple customers](isv-scenarios.md#saas-based-multi-tenant-offerings).

## Next steps

- Review [Azure CLI](/cli/azure/managedservices) and [Azure PowerShell](/powershell/module/az.managedservices) commands for working with registration definitions and registration assignments.
- Learn about [enhanced services and scenarios](cross-tenant-management-experience.md#enhanced-services-and-scenarios) for Azure Lighthouse.
- Learn more about how [tenants, users, and roles](tenants-users-roles.md) work with Azure Lighthouse.
