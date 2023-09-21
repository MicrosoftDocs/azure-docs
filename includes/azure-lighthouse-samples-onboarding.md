---
title: include file
description: include file
services: lighthouse
author: JnHs
ms.service: lighthouse
ms.topic: include
ms.date: 01/26/2023
ms.author: jenhayes
ms.custom: include file
---

We provide different templates to address specific onboarding scenarios. Choose the option that works best, and be sure to modify the parameter file to reflect your environment. For more info about how to use these files in your deployment, see [Onboard a customer to Azure Lighthouse](../articles/lighthouse/how-to/onboard-customer.md).

| **Template** | **Description** |
|---------|---------|
| [subscription](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/delegated-resource-management/subscription) | Onboard a customer's subscription to Azure Lighthouse. A separate deployment must be performed for each subscription. |
| [rg and multi-rg](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/delegated-resource-management/rg) | Onboard one or more of a customer's resource groups to Azure Lighthouse. Use rg.json to onboard a single resource group, or multi-rg.json to onboard multiple resource groups within a subscription. |
| [marketplace-delegated-resource-management](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/marketplace-delegated-resource-management) | If you've [published a managed services offer to Azure Marketplace](../articles/lighthouse/how-to/publish-managed-services-offers.md), you can optionally use this template to onboard resources for customers who have accepted the offer. The marketplace values in the parameters file must match the values that you used when publishing your offer. |

To include [eligible authorizations](../articles/lighthouse/how-to/create-eligible-authorizations.md), select the corresponding template from the [delegated-resource-management-eligible-authorizations](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/delegated-resource-management-eligible-authorizations) section of our samples repo.

Typically, a separate deployment is required for each subscription being onboarded, but you can also deploy templates across multiple subscriptions.

| **Template** | **Description** |
|---------|---------|
| [cross-subscription-deployment](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/cross-subscription-deployment) | Deploy Azure Resource Manager templates across multiple subscriptions. |

> [!TIP]
> While you can't onboard an entire management group in one deployment, you can deploy a policy to [onboard each subscription in a management group](../articles/lighthouse/how-to/onboard-management-group.md).