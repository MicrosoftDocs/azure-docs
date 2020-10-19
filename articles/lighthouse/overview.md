---
title: What is Azure Lighthouse?
description: Azure Lighthouse lets service providers deliver managed services for their customers with higher automation and efficiency at scale.
ms.date: 10/19/2020
ms.topic: overview
---

# What is Azure Lighthouse?

Azure Lighthouse enables cross- and multi-tenant management, allowing for higher automation, scalability, and enhanced governance across resources and tenants. With Azure Lighthouse, service providers can deliver managed services using comprehensive and robust management tooling built into the Azure platform. Customers maintain control over who can access their tenant, what resources they can access, and what actions can be taken. This offering can also benefit [enterprise IT organizations](concepts/enterprise.md) managing resources across multiple tenants.

![Overview diagram of Azure Lighthouse](media/azure-lighthouse-overview.jpg)

## Benefits

Azure Lighthouse helps service providers efficiently build and deliver managed services. Benefits include:

- **Management at scale**: Customer engagement and life-cycle operations to manage customer resources are easier and more scalable. Existing APIs, management tools, and workflows can be used with delegated resources, including machines hosted outside of Azure, regardless of the regions in which they’re located.
- **Greater visibility and control for customers**: Customers have precise control over the scopes they delegate for management and the permissions that are allowed. They can audit service provider actions and remove access completely if desired.
- **Comprehensive and unified platform tooling**: Our tooling experience addresses key service provider scenarios, including multiple licensing models such as EA, CSP and pay-as-you-go. Azure Lighthouse works with existing tools and APIs, licensing models, [Azure managed applications](concepts/managed-applications.md), and partner programs such as the [Cloud Solution Provider program (CSP)](/partner-center/csp-overview). You can integrate Azure Lighthouse into your existing workflows and applications, and track your impact on customer engagements by [linking your partner ID](./how-to/partner-earned-credit.md).

There are no additional costs associated with using Azure Lighthouse to manage Azure resources. Any Azure customer or partner can use Azure Lighthouse.

## Capabilities

Azure Lighthouse includes multiple ways to help streamline engagement and management:

- **Azure delegated resource management**: [Manage your customers' Azure resources securely from within your own tenant](concepts/azure-delegated-resource-management.md), without having to switch context and control planes. Customer subscriptions and resource groups can be delegated to specified users and roles in the managing tenant, with the ability to remove access as needed.
- **New Azure portal experiences**: View cross-tenant information in the [**My customers** page](how-to/view-manage-customers.md) in the Azure portal. A corresponding [**Service providers** page](how-to/view-manage-service-providers.md) lets customers view and manage their service provider access.
- **Azure Resource Manager templates**: Use ARM templates to [onboard delegated customer resources](how-to/onboard-customer.md) and [perform cross-tenant management tasks](samples/index.md).
- **Managed Service offers in Azure Marketplace**: [Offer your services to customers](concepts/managed-services-offers.md) through private or public offers, and automatically onboard them to Azure Lighthouse.

## Next steps

- Learn about [Azure delegated resource management](concepts/azure-delegated-resource-management.md).
- Explore [cross-tenant management experiences](concepts/cross-tenant-management-experience.md).
- See how to [use Azure Lighthouse within an enterprise](concepts/enterprise.md).
