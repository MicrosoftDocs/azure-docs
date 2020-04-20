---
title: Azure Lighthouse and Azure Managed Applications
description: Azure Lighthouse and Azure Managed Applications ... 
ms.date: 04/20/2020
ms.topic: conceptual
---

# Azure Lighthouse and Azure Managed Applications

Both [Azure managed applications](../../azure-resource-manager/managed-applications/overview.md) and Azure Lighthouse work by enabling a service provider to access resources that reside in the customer's tenant. However, there are differences in the way that they work and the scenarios that they help to enable.

## Differences

- **Azure Lighthouse** allows a service provider to perform a wide range of management tasks directly on a customer's subscription (or resource group). This access is achieved through a logical projection, allowing the service provider's to log into their own tenant and access resources that reside in the customer's tenant. The customer can determine which subscriptions or resource groups to delegate to the service provider, and the customer maintains access.
- **Azure managed applications** allow a service provider to offer cloud solutions through the Azure marketplace that are easy for customers to deploy and use in their own subscriptions. In a managed application, the resources used by the application are deployed to a resource group that's managed by the publisher. This resource group is present in the customer's subscription, but an identity in the publisher's tenant has access to it. The service provider continues to manage and maintain the managed application, while the customer does not have direct access to work in its resource group.

## Using together

More stuff

## Next steps

- Learn about [Azure managed applications](../../azure-resource-manager/managed-applications/overview.md).
- Learn how to [onboard a subscription to Azure delegated resource management](../how-to/onboard-customer.md).
