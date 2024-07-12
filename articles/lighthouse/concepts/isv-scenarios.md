---
title: Azure Lighthouse in ISV scenarios
description: ISVs can use the capabilities of Azure Lighthouse for more flexibility with customer offerings.
ms.date: 07/10/2024
ms.topic: conceptual
---

# Azure Lighthouse in ISV scenarios

A typical scenario for [Azure Lighthouse](../overview.md) involves a service provider that manages resources in its customers' Microsoft Entra tenants. Independent Software Vendors (ISVs) using SaaS-based offerings with their customers may also benefit from the capabilities of Azure Lighthouse. Using Azure Lighthouse can be especially helpful for ISVs who offer managed services that require access to a customer's subscription scope.

## Managed Service offers in Azure Marketplace

As an ISV, you may already have published solutions to the Azure Marketplace. If you offer managed services to your customers, you can do so by publishing a Managed Service offer. These offers streamline the onboarding process and make your services more scalable to as many customers as needed. Azure Lighthouse supports a wide range of [management tasks and scenarios](cross-tenant-management-experience.md#enhanced-services-and-scenarios) that can be used to provide value to your customers.

For more information, see [Publish a Managed Service offer to Azure Marketplace](../how-to/publish-managed-services-offers.md).

## Using Azure Lighthouse with Azure managed applications

[Azure managed applications](../../azure-resource-manager/managed-applications/overview.md) are another way that ISVs can provide services to their customers. You can use Azure Lighthouse along with your Azure managed applications to enable enhanced scenarios.

For more information, see [Azure Lighthouse and Azure managed applications](managed-applications.md).

## SaaS-based multitenant offerings

An additional scenario is where the ISV hosts resources in a subscription in their own tenant, then uses Azure Lighthouse to let customers access those specific resources. Once this access is granted, the customer can log in to their own tenant and access the resources as needed. The ISV maintains their IP in their own tenant, and can use their own support plan to raise tickets related to the solution hosted in their tenant, rather than the customer's plan. Since the resources are in the ISV's tenant, all actions can be performed directly by the ISV, such as logging into VMs, installing apps, and performing maintenance tasks.

In this scenario, users in the customer's tenant are essentially granted access as a "managing tenant," even though the customer isn't managing the ISV's resources. Because the customer is directly accessing the ISV's tenant, it's important to grant only the minimum permissions necessary, so that they can't make changes to the solution or access other ISV resources.

To enable this architecture, the ISV needs to obtain the object ID for a user group in the customer's Microsoft Entra tenant, along with their tenant ID. The ISV then builds an ARM template granting this user group the appropriate permissions, and [deploys it on the ISV's subscription](../how-to/onboard-customer.md) that contains the resources that the customer will access.

## Next steps

- Learn about [cross-tenant management experiences](cross-tenant-management-experience.md).
- Learn more about [Azure Lighthouse architecture](architecture.md).
