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

**DCsv2 virtual machines are grayed out in the portal and I can't select one**

Based on the information bubble next to the VM, there are different actions to take:
   -	**UnsupportedGeneration**: Change the generation of the virtual machine image to “Gen2”.
   -	**NotAvailableForSubscription**: The region isn't yet available for your subscription. Select an available region.
   -	**InsufficientQuota**: [Create a support request to increase your quota](../azure-portal/supportability/per-vm-quota-requests.md). Free trial subscriptions don't have quota for confidential computing VMs. 

**What code we need to write to perform the remote attestation and verification **

