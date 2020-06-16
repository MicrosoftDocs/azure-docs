---
title: include file
description: include file
services: lighthouse
author: JnHs
ms.service: lighthouse
ms.topic: include
ms.date: 12/19/2019
ms.author: jenhayes
ms.custom: include file
---

We provide different templates to address specific onboarding scenarios. Choose the option that works best, and be sure to modify the parameter file to reflect your environment. For more info about how to use these files in your deployment, see [Onboard a customer to Azure delegated resource management](../articles/lighthouse/how-to/onboard-customer.md).

| **Template** | **Description** |
|---------|---------|
| [delegated-resource-management](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/delegated-resource-management) | Onboard a customer's subscription to Azure delegated resource management. A separate deployment must be performed for each subscription. |
| [rg-delegated-resource-management](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/rg-delegated-resource-management) | Onboard one or more of a customer's resource groups to Azure delegated resource management. Use **rgDelegatedResourceManagement** for a single resource group, or **multipleRgDelegatedResourceManagement** to onboard multiple resource groups in the same subscription. |
| [marketplace-delegated-resource-management](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/marketplace-delegated-resource-management) | If you've [published a managed services offer to Azure Marketplace](../articles/lighthouse/how-to/publish-managed-services-offers.md), you can optionally use this template to onboard resources for customers who have accepted the offer. The marketplace values in the parameters file must match the values that you used when publishing your offer. |

Typically, a separate deployment is required for each subscription being onboarded, but you can also deploy templates across multiple subscriptions.

| **Template** | **Description** |
|---------|---------|
| [cross-subscription-deployment](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/cross-subscription-deployment) | Deploy Azure Resource Manager templates across multiple subscriptions. |
