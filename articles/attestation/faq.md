---
title: Frequently asked questions
description: Answers to frequently asked questions about Microsoft Azure Attestation
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: reference
ms.date: 07/20/2020
ms.author: mbaldwin


---

# Frequently asked questions for Microsoft Azure Attestation

This article provides answers to some of the most common questions about [Azure Attestation](overview.md).

If your Azure issue is not addressed in this article, you can also submit an Azure support request on the [Azure support page](https://azure.microsoft.com/support/options/).

**How can I deploy DCsv2 series VMs on Azure?**

Here are some ways you can deploy a DCsv2 VM:
   - Using an [Azure Resource Manager Template](../virtual-machines/windows/template-description.md)
   - From the [Azure portal](https://portal.azure.com/#create/hub)
   - In the [Azure Confidential Computing (Virtual Machine)](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-azure-compute.acc-virtual-machine-v2?tab=overview) marketplace solution template. The marketplace solution template will help constrain a customer to the supported scenarios (regions, images, availability, disk encryption). 

**Will all OS images work with Azure confidential computing?**

No. The virtual machines can only be deployed on Generation 2 operating machines with Ubuntu Server 18.04, Ubuntu Server 16.04, Windows Server 2019 Datacenter, and Windows Server 2016 Datacenter. Read more about Gen 2 VMs on [Linux](../virtual-machines/linux/generation-2.md) and [Windows](../virtual-machines/windows/generation-2.md)

**DCsv2 virtual machines are grayed out in the portal and I can't select one**

Based on the information bubble next to the VM, there are different actions to take:
   -	**UnsupportedGeneration**: Change the generation of the virtual machine image to “Gen2”.
   -	**NotAvailableForSubscription**: The region isn't yet available for your subscription. Select an available region.
   -	**InsufficientQuota**: [Create a support request to increase your quota](../azure-portal/supportability/per-vm-quota-requests.md). Free trial subscriptions don't have quota for confidential computing VMs. 
