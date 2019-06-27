---
title: What is Azure Lighthouse?
description: Azure Lighthouse lets service providers deliver managed services for their customers with higher automation and efficiency at scale.
author: JnHs
ms.author: jenhayes
ms.date: 06/26/2019
ms.topic: overview
ms.service: lighthouse
manager: carmonm
---
# What is Azure Lighthouse?

Azure Lighthouse provides comprehensive and robust management tooling, allowing service providers to deliver managed services on behalf of their customers with higher automation and efficiency at scale, using functionality built into the Azure platform. This offering can also benefit enterprise IT organizations managing resources across multiple tenants.

![Overview diagram of Azure Lighthouse](media/azure-service-provider-management-toolkit-overview.jpg)

## Benefits

Azure Lighthouse helps you to profitably and efficiently build and deliver managed services for your customers. The benefits include:

- **Management at scale**: Customer engagement and management experiences are easier and more scalable.
- **Greater visibility and enhanced security for customers**: Customers whose resources you're managing will have greater visibility, enhanced security, and IP protection.
- **Comprehensive and unified platform tooling**: Our tooling experience addresses key service provider scenarios, including multiple licensing models. The new capabilities work with existing tools, licensing models, and partner programs such as the [Cloud Solution Provider program (CSP)](https://docs.microsoft.com/partner-center/csp-overview). The Azure Lighthouse options you choose are ready to be integrated into your existing workflows, and you can track your impact on customer engagements by [linking your partner ID](https://docs.microsoft.com/azure/billing/billing-partner-admin-link-started).

## Capabilities

Azure Lighthouse includes multiple ways to help streamline customer engagement and management:

- **Azure Delegated Resource Management**: Manage your customers' Azure resources securely from within your own tenant. For more info, see [Azure Delegated Resource Management](./concepts/azure-delegated-resource-management.md).
- **New Azure portal experiences**: View cross-tenant info in the new **My customers** page in the [Azure portal](https://portal.azure.com). A corresponding **Service providers** blade lets your customers view and manage service provider access. For more info, see [View and manage customers](./how-to/view-manage-customers.md) and [View and manage service providers](./how-to/view-manage-service-providers.md).
- **Managed Services offers in Azure Marketplace**: Offer your services to customers and have them automatically onboarded to Azure Delegated Resource Management. For more info, see [Managed services offers in Azure Marketplace](./concepts/managed-services-offers.md).
- **Azure Resource Manager templates**: Perform management tasks more easily. For more info, see our [samples repo](https://github.com/Azure/Azure-Service-Provider-Management-Toolkit-samples/tree/master/Azure-Delegated-Resource-Management/templates) and [Onboard a customer to Azure Delegated Resource Management](how-to/onboard-customer.md).
- **Azure managed applications**: Package and ship applications that are easy for your customers to deploy and use in their own subscriptions. The application is deployed into a resource group that you access from your tenant, letting you manage the service. For more info, see [Azure managed applications overview](https://docs.microsoft.com/azure/managed-applications/overview).

> [!NOTE]
> The capabilities described above are available in public clouds. For regional availability of individual services, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/).