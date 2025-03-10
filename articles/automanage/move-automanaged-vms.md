---
title: Move an Azure Automanage virtual machine across regions
description: Learn how to move an Automanaged virtual machine across regions
ms.service: azure-automanage
ms.topic: how-to
ms.date: 12/10/2021
ms.custom: subject-moving-resources
# Customer intent: As a sysadmin, I want move my Automanaged VM to a different region.
---

# Move an Azure Automanage virtual machine to a different region

> [!CAUTION]
> On September 30, 2027, the Azure Automanage Best Practices service will be retired. As a result, attempting to create a new configuration profile or onboarding a new subscription to the service will result in an error. Learn more [here](https://aka.ms/automanagemigration/) about how to migrate to Azure Policy before that date. 

> [!CAUTION]
> Starting February 1st 2025, Azure Automanage will begin rolling out changes to halt support and enforcement for all services dependent on the deprecated Microsoft Monitoring Agent (MMA). To continue using Change Tracking and Management, VM Insights, Update Management, and Azure Automation, [migrate to the new Azure Monitor Agent (AMA)](https://aka.ms/mma-to-ama/).

This article describes how to keep Automanage enabled on a virtual machine (VM) when you move it to a different region. You might want to move your virtual machines to another region for a number of reasons. For example, to take advantage of a new Azure region, to meet internal policy and governance requirements, or in response to capacity planning requirements. Those VMs that you move may be currently Automanaged, and you may want them to remain Automanaged after your move.

## Prerequisites
* Ensure that your target region is [supported by Automanage](./overview-about.md#prerequisites).
* Ensure that your Log Analytics workspace region, Automation account region, and your target region are all regions supported by the region mappings [here](../automation/how-to/region-mappings.md).

## Prepare your Automanaged VMs for moving
Disable Automanage on your Automanaged VMs. You can do this by selecting your VMs in the Automanage blade and clicking **Disable automanagement** in the Automanage blade.

## Move your Automanaged VMs and re-enable Automanage
For details on how to move your VMs, see this [article](../resource-mover/tutorial-move-region-virtual-machines.md).

Once you have moved your VMs across regions, you may re-enable Automanage on them again. Details are available [here](./quick-create-virtual-machines-portal.md).

## Next steps
* [Learn more about Azure Automanage](./overview-about.md)
* [View frequently asked questions about Azure Automanage](./faq.yml)
