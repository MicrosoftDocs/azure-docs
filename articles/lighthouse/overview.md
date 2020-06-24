---
title: What is Azure Lighthouse?
description: Azure Lighthouse lets service providers deliver managed services for their customers with higher automation and efficiency at scale.
ms.date: 05/28/2020
ms.topic: overview
---
# What is Azure Lighthouse?

Azure Lighthouse offers service providers a single control plane to view and manage Azure across all their customers with higher automation, scale, and enhanced governance. With Azure Lighthouse, service providers can deliver managed services using comprehensive and robust management tooling built into the Azure platform. This offering can also benefit enterprise IT organizations managing resources across multiple tenants.

![Overview diagram of Azure Lighthouse](media/azure-lighthouse-overview.jpg)

## Benefits

Azure Lighthouse helps you to profitably and efficiently build and deliver managed services for your customers. The benefits include:

- **Management at scale**: Customer engagement and life-cycle operations to manage customer resources are easier and more scalable. Existing APIs, management tools, and workflows can be used with delegated customer resources, regardless of the regions in which they’re located.
- **Greater visibility and precision for customers**: Customers will have greater visibility into your actions and precise control over the scope they delegate for management, including the ability to remove access completely, while your IP is preserved.
- **Comprehensive and unified platform tooling**: Our tooling experience addresses key service provider scenarios, including multiple licensing models such as EA, CSP and pay-as-you-go. The new capabilities work with existing tools and APIs, licensing models, and partner programs such as the [Cloud Solution Provider program (CSP)](https://docs.microsoft.com/partner-center/csp-overview). Azure Lighthouse can be integrated into your existing workflows and applications, and you can track your impact on customer engagements by [linking your partner ID](../billing/billing-partner-admin-link-started.md).

There are no additional costs associated with using Azure Lighthouse to manage your customers' Azure resources. Any Azure customer or partner can use Azure Lighthouse.

## Capabilities

Azure Lighthouse includes multiple ways to help streamline customer engagement and management:

- **Azure delegated resource management**: Manage your customers' Azure resources securely from within your own tenant, without having to switch context and control planes. Subscriptions and resource groups can be delegated to specified users and roles in the managing tenant, with the ability to remove access as needed. For more info, see [Azure delegated resource management](concepts/azure-delegated-resource-management.md).
- **New Azure portal experiences**: View cross-tenant info in the new **My customers** page in the [Azure portal](https://portal.azure.com). A corresponding **Service providers** blade lets your customers view and manage service provider access. For more info, see [View and manage customers](./how-to/view-manage-customers.md) and [View and manage service providers](how-to/view-manage-service-providers.md).
- **Azure Resource Manager templates**: Perform management tasks more easily, including onboarding customers for Azure delegated resource management. For more info, see our [samples repo](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates) and [Onboard a customer to Azure delegated resource management](how-to/onboard-customer.md).
- **Managed Service offers in Azure Marketplace**: Offer your services to customers through private or public offers, and have them automatically onboarded to Azure delegated resource management, as an alternate to onboarding using Azure Resource Manager templates. For more info, see [Managed Service offers in Azure Marketplace](concepts/managed-services-offers.md).

## Next steps

- Learn about [Azure delegated resource management](concepts/azure-delegated-resource-management.md).
- Learn about [cross-tenant management experiences](concepts/cross-tenant-management-experience.md).
