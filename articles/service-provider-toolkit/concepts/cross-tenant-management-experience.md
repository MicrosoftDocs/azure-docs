---
title: Cross-tenant management experience with Azure Delegated Resource Management
description: Azure Delegated Resource Management enables a cross-tenant management experience.
author: JnHs
ms.service: service-provider-toolkit
ms.author: jenhayes
ms.date: 04/03/2019
ms.topic: overview
manager: carmonm
---
# Cross-tenant management experience

> [!IMPORTANT]
> Azure Delegated Resource Management is currently in limited public preview. The info in this topic may change before general availability.

This article describes the scenarios that you, as a service provider, can use with [Azure Delegated Resource Management](../concepts/azure-delegated-resource-management.md) to manage Azure resources for multiple customers from within your own tenant in the [Azure portal](https://portal.azure.com).

> [!NOTE]
> Azure Delegated Resource Management can also be used within an enterprise which has multiple tenants of its own to simplify cross-tenant administration.

## Understanding customer tenants

An Azure Active Directory (Azure AD) tenant is a representation of an organization. It's a dedicated instance of Azure AD that an organization receives when they create a relationship with Microsoft by signing up for Azure, Microsoft 365, or other services. Each Azure AD tenant is distinct and separate from other Azure AD tenants, and has its own tenant ID (a GUID). For more info, see [What is Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-whatis)

Typically, in order to manage Azure resources for a customer, service providers would have to sign in to the Azure portal using an account associated with that customer's tenant, requiring an administrator in the customer's tenant to create and manage user accounts for the service provider.

With Azure Delegated Resource Management, the onboarding process specifies users within the service provider's tenant who will be able to access and manage subscriptions and resources in the customer's tenant. These users can then sign in to the Azure portal using their own credentials. Within the Azure portal, they can manage resources belonging to all customers to which they have access, either by visiting the [My customers](../how-to/view-manage-customers.md) page, or by working from within the context of that customer's subscription. This allows greater flexibility to manage resources for multiple customers, without having to sign in to different accounts in different tenants.

For example, a service provider may have three customers, with different responsibilities and access levels, as shown here:

![Three customer tenants showing service provider responsibilities](../media/azure-delegated-resource-management-customer-tenants.jpg)

Using Azure Delegated Resource Management, authorized users can sign in to the service provider’s tenant to access these resources, as shown here:

![Customer resources managed through one service provider tenant](../media/azure-delegated-resource-management-service-provider-tenant.jpg)

## Supported services and scenarios

Currently, the cross-tenant management experience supports the following scenarios with delegated customer resources:

[Azure Automation](https://docs.microsoft.com/azure/automation/):

- Use automation accounts to access and work with delegated customer resources

[Azure Backup](https://docs.microsoft.com/azure/backup/):

- Back up and restore customer data in customer tenants

[Azure Kubernetes Service (AKS)](https://docs.microsoft.com//azure/aks/):

- Manage hosted Kubernetes environments and deploy and manage containerized applications within customer tenants

[Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/):

- View alerts for delegated subscriptions and filter on up to 20 subscriptions
- View activity log details for delegated subscriptions
- Log analytics: Query data from remote customer workspaces

[Azure Policy](https://docs.microsoft.com/azure/governance/policy/):

- Compliance snapshots show details for assigned policies within delegated subscriptions
- Create and edit policy definitions within a delegated subscription
- Assign customer-defined policy definitions within the delegated subscription
- Customers see policies authored by the service provider alongside any policies they've authored themselves
- Can remediate deployIfNotExists assignments within the customer tenants if the customer has configured the managed identity and *roleDefinitionIds* for that policy assignment

[Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/):

- Now includes the tenant ID in returned query results, allowing you to identify which tenant a subscription belongs to in the results 

[Azure Security Center](https://docs.microsoft.com/azure/security-center/):

- Ability to filter and see all info for delegated subscriptions

[Azure Service Health](https://docs.microsoft.com/azure/service-health/):

- Monitor the health of customer resources with Azure Resource Health
- Track the health of the Azure services used by your customers

[Azure Site Recovery](https://docs.microsoft.com/azure/site-recovery/):

- Manage disaster recovery options for Azure virtual machines in customer tenants (note that you can't use RunAs accounts to copy VM extensions)

[Azure Virtual Machines](https://docs.microsoft.com/azure/virtual-machines/):

- Use virtual machine extensions to provide post-deployment configuration and automation tasks on Azure VMs in customer tenants
- Use boot diagnostics to troubleshoot Azure VMs in customer tenants
- Access VMs with serial console in customer tenants
- Note that you can't use Azure Active Directory for remote login to a VM, and you can't integrate a VM with a Key Vault for passwords, secrets or cryptographic keys for disk encryption

[Azure Virtual Network](https://docs.microsoft.com/azure/virtual-network/):

- Deploy and manage virtual networks and virtual network interface cards (vNICs) within customer tenants

With all scenarios, please be aware of the following current limitations:

- While Azure Resource Manager operations are supported, Resource Provider operations (such as KeyVault secrets access, storage data access, VM login, etc.) can’t be performed using Azure Delegated Resource Management.
- Role assignments with managed identities for Azure resources are not supported in the cross-tenant management experience.
- Role assignments must use role-based access control (RBAC) [built-in roles](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles). Custom roles and [classic subscription administrator roles](https://docs.microsoft.com/azure/role-based-access-control/classic-administrators) aren't supported.
- If a customer has deployed any Azure managed applications to a subscription, that subscription can't be onboarded for Azure Delegated Resource Management.

## Next steps

- Onboard your customers to Azure Delegated Resource Management, either by [using Azure Resource Manager templates](../how-to/onboard-customer.md) or by [publishing a managed services offer to Azure Marketplace](../how-to/publish-managed-services-offers.md).
- [View and manage customers](view-manage-customers.md) by going to **My customers** in the Azure portal.