---
title: include file
description: include file
services: lighthouse
author: JnHs
ms.service: lighthouse
ms.topic: include
ms.date: 04/24/2020
ms.author: jenhayes
ms.custom: include file
---

These samples illustrate various tasks that can be performed in cross-tenant management scenarios.

| **Template** | **Description** |
|---------|---------|
| [create-keyvault-secret](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/create-keyvault-secret) | Creates a Key Vault in the customer's tenant and creates access policies.
| [cross-rg-deployment](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/cross-rg-deployment) | Deploys storage accounts into two different resource groups.|
| [deploy-azure-mgmt-services](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/deploy-azure-mgmt-services) | Creates Azure management services, links them together, and deploys additional solutions. For an end-to-end deployment, use the **rgWithAzureMgmt.json** template. |
| [deploy-azure-security-center](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/deploy-azure-security-center) | Enables and configures Azure Security Center within the targeted Azure subscription. |
| [deploy-azure-sentinel](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/deploy-azure-sentinel) | Deploys and enables Azure Sentinel on an existing Log Analytics workspace in a delegated subscription. |
| [deploy-log-analytics-vm-extensions](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/deploy-log-analytics-vm-extensions) | These templates let you deploy Log Analytics VM extensions to your Windows & Linux VMs, connecting them to the designated Log Analytics workspace |
