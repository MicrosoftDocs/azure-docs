---
title: Azure Lighthouse samples and templates
description: These samples and Azure Resource Manager templates show you how to onboard customers for Azure delegated resource management and support Azure Lighthouse scenarios.
author: JnHs
manager: carmonm
ms.service: lighthouse
ms.topic: sample
ms.date: 10/15/2019
ms.author: jenhayes
---
# Azure Lighthouse samples

The following table includes links to key Azure Resource Manager templates for Azure Lighthouse. These files and more can also be found in the [Azure Lighthouse samples repository](https://github.com/Azure/Azure-Lighthouse-samples/).

## Onboarding customers to Azure delegated resource management

We provide different templates to address specific onboarding scenarios. Choose the option that works best, and be sure to modify the parameter file to reflect your environment. For more info about how to use these files in your deployment, see [Onboard a customer to Azure delegated resource management](../how-to/onboard-customer.md).

| [delegated-resource-management](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/delegated-resource-management) | Onboard a customer's subscription to Azure delegated resource management. A separate deployment must be performed for each subscription. |
| [rg-delegated-resource-management](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/rg-delegated-resource-management) | Onboard one or more of a customer's resource groups to Azure delegated resource management. Use **rgDelegatedResourceManagement** for a single resource group, or **multipleRgDelegatedResourceManagement** to onboard multiple resource groups in the same subscription. |
| [marketplace-delegated-resource-management](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/marketplace-delegated-resource-management) | If you've [published a managed services offer to Azure Marketplace](../how-to/publish-managed-services-offers.md), you can optionally use this template to onboard resources for customers who have accepted the offer. The marketplace values in the parameters file must match the values that you used when publishing your offer. |

## Another section or two 

| **Template** | **Description** |
|---------|---------|
| [create-multiple-rgs](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/create-multiple-rgs) | Creates multiple resource groups using a single Azure Resource Manager template. |
| [cross-rg-deployment](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/cross-rg-deployment) | Deploy storage accounts into two different resource groups. |
| [cross-subscription-deployment](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/cross-subscription-deployment) | Deploy Azure Resource Manager templates across multiple subscriptions. |
| [deploy-azure-mgmt-services](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/deploy-azure-mgmt-services) | Creates Azure management services, links them together, and deploys additional solutions. |
| [deploy-azure-security-center](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/deploy-azure-security-center) | Enables and configures Azure Security Center within the targeted Azure subscription. |

## Next steps

- Learn about [Azure delegated resource management](../concepts/azure-delegated-resource-management.md).
- Explore these samples in the [Azure Lighthouse samples repository](https://github.com/Azure/Azure-Lighthouse-samples/).
