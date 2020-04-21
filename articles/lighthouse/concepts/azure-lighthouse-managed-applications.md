---
title: Azure Lighthouse and Azure managed applications
description: Azure Lighthouse and Azure managed applications ... 
ms.date: 04/21/2020
ms.topic: conceptual
---

# Azure Lighthouse and Azure managed applications

Both Azure managed applications and Azure Lighthouse work by enabling a service provider to access resources that reside in the customer's tenant. It can be helpful to understand the differences in the way that they work and the scenarios that they help to enable, as well as how they can be used together.

## Comparing Azure Lighthouse and Azure managed applications

### Azure Lighthouse

With [Azure Lighthouse](../overview.md), a service provider to perform a wide range of management tasks directly on a customer's subscription (or resource group). This access is achieved through a logical projection, allowing service providers to sign in to their own tenant and access resources that belong to the customer's tenant. The customer can determine which subscriptions or resource groups to delegate to the service provider, and the customer maintains full access to those resources. They can also remove the service provider's access at any time.

To use Azure Lighthouse, customers are onboarded for [Azure delegated resource management](azure-delegated-resource-management.md) either by [deploying ARM templates](../how-to/onboard-customer.md) or through a [Managed Service offer in  Azure Marketplace](managed-services-offers.md).

Azure Lighthouse is typically used when a service provider will perform management tasks for a customer on an ongoing basis.

### Azure managed applications

[Azure managed applications](../../azure-resource-manager/managed-applications/overview.md) allow a service provider or ISV to offer cloud solutions that are easy for customers to deploy and use in their own subscriptions.

In a managed application, the resources used by the application are bundled together and deployed to a resource group that's managed by the publisher. This resource group is present in the customer's subscription, but an identity in the publisher's tenant has access to it. The ISV continues to manage and maintain the managed application, while the customer does not have direct access to work in its resource group or any access to its resources.

Managed applications can be [published to Azure Marketplace](../../azure-resource-manager/managed-applications/publish-marketplace-app.md), either as a private offer for a specific customer's use, or as public offers that multiple customers can purchase. They can also be delivered to users within your organization by [publishing managed applications to your service catalog](../../azure-resource-manager/managed-applications/publish-service-catalog-app.md).

Azure managed applications are typically used for a specific customer need that can be achieved through a turnkey solution that is fully managed by the service provider.

## Using Azure Lighthouse and Azure managed applications together

While Azure Lighthouse and Azure managed applications use different access mechanisms to achieve different goals, there may be scenarios where it makes sense for a service provider to use both of them with the same customer. For example **(would be great to have an example or two here! Plus any caveats or gotchas)**.

## Next steps

- Learn about [Azure managed applications](../../azure-resource-manager/managed-applications/overview.md).
- Learn how to [onboard a subscription to Azure delegated resource management](../how-to/onboard-customer.md).
