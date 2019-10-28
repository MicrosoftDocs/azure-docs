---
title: Azure Lighthouse samples and templates
description: These samples and Azure Resource Manager templates show you how to onboard customers for Azure delegated resource management and support Azure Lighthouse scenarios.
author: JnHs
manager: carmonm
ms.service: lighthouse
ms.topic: sample
ms.date: 10/17/2019
ms.author: jenhayes
---
# Azure Lighthouse samples

The following table includes links to key Azure Resource Manager templates for Azure Lighthouse. These files and more can also be found in the [Azure Lighthouse samples repository](https://github.com/Azure/Azure-Lighthouse-samples/).

## Onboarding customers to Azure delegated resource management

We provide different templates to address specific onboarding scenarios. Choose the option that works best, and be sure to modify the parameter file to reflect your environment. For more info about how to use these files in your deployment, see [Onboard a customer to Azure delegated resource management](../how-to/onboard-customer.md).

| **Template** | **Description** |
|---------|---------|
| [delegated-resource-management](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/delegated-resource-management) | Onboard a customer's subscription to Azure delegated resource management. A separate deployment must be performed for each subscription. |
| [rg-delegated-resource-management](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/rg-delegated-resource-management) | Onboard one or more of a customer's resource groups to Azure delegated resource management. Use **rgDelegatedResourceManagement** for a single resource group, or **multipleRgDelegatedResourceManagement** to onboard multiple resource groups in the same subscription. |
| [marketplace-delegated-resource-management](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/marketplace-delegated-resource-management) | If you've [published a managed services offer to Azure Marketplace](../how-to/publish-managed-services-offers.md), you can optionally use this template to onboard resources for customers who have accepted the offer. The marketplace values in the parameters file must match the values that you used when publishing your offer. |

Typically, a separate deployment is required for each subscription being onboarded, but you can also deploy templates across multiple subscriptions.

| **Template** | **Description** |
|---------|---------|
| [cross-subscription-deployment](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/cross-subscription-deployment) | Deploy Azure Resource Manager templates across multiple subscriptions. |

## Azure Policy

These samples show how to use Azure Policy with subscriptions that have been onboarded for Azure delegated resource management.

| **Template** | **Description** |
|---------|---------|
| [policy-add-or-replace-tag](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/policy-add-or-replace-tag) | Assigns a policy that adds or removes a tag (using the modify effect) to a delegated subscription. For more info, see [Deploy a policy that can be remediated within a delegated subscription](../how-to/deploy-policy-remediation.md). |
| [policy-audit-delegation](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/policy-audit-delegation) | Assigns a policy that will audit for delegation assignments. |
| [policy-enforce-keyvault-monitoring](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/policy-enforce-keyvault-monitoring) | Assigns a policy that enables diagnostics on Azure Key Vault resources in a delegated subscriptions (using the deployIfNotExists effect). For more info, see [Deploy a policy that can be remediated within a delegated subscription](../how-to/deploy-policy-remediation.md). |
| [policy-enforce-sub-monitoring](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/policy-enforce-sub-monitoring) | Assigns several policies to enable diagnostics on a delegated subscription, and connects all Windows & Linux VMs to the Log Analytics workspace created by the policy. For more info, see [Deploy a policy that can be remediated within a delegated subscription](../how-to/deploy-policy-remediation.md). |
| [policy-initiative](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/policy-initiative) | Applies an initiative (multiple related policy definitions) to a delegated subscription. |

## Azure Monitor

These samples show how to use Azure Monitor to create alerts for subscriptions that have been onboarded for Azure delegated resource management.

| **Template** | **Description** |
|---------|---------|
| [alert-using-actiongroup](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/alert-using-actiongroup) | This template creates an Azure alert and connects to an existing Action Group.|
| [multiple-loganalytics-alerts](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/multiple-loganalytics-alerts) | Creates multiple Log alerts based on Kusto queries.|
| [delegation-alert-for-customer](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/delegation-alert-for-customer) | Deploys an alert in a tenant when a user delegates a subscription to a managing tenant.|

## Additional cross-tenant scenarios

These samples illustrate various tasks that can be performed in cross-tenant management scenarios.

| **Template** | **Description** |
|---------|---------|
| [cross-rg-deployment](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/cross-rg-deployment) | Deploys storage accounts into two different resource groups.|
| [deploy-azure-mgmt-services](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/deploy-azure-mgmt-services) | Creates Azure management services, links them together, and deploys additional solutions. For an end-to-end deployment, use the **rgWithAzureMgmt.json** template. |
| [deploy-azure-security-center](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/deploy-azure-security-center) | Enables and configures Azure Security Center within the targeted Azure subscription. |
| [deploy-azure-sentinel](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/deploy-azure-sentinel) | Deploys and enables Azure Sentinel on an existing Log Analytics workspace in a delegated subscription. |
| [deploy-log-analytics-vm-extensions](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/deploy-log-analytics-vm-extensions) | These templates let you deploy Log Analytics VM extensions to your Windows & Linux VMs, connecting them to the designated Log Analytics workspace |

## Next steps

- Learn about [Azure delegated resource management](../concepts/azure-delegated-resource-management.md).
- Explore the [Azure Lighthouse samples repository](https://github.com/Azure/Azure-Lighthouse-samples/).
