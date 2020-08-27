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
   
   
**Is it possible for the relying party to share secrets with the validated Trusted Execution Environemnts (TEEs) **

Public key generated within an enclave can be expressed in the “Enclave Held Data” (EHD) property of the attestation request object sent by the client to Azure Attestation. Azure Attestation validates if SHA256 hash of EHD matches the first 32 bytes in reportData field of the enclave quote. Azure Attestation includes “Enclave Held Data” in its attestation response. Relying party can use the enclave held data from the verified attestation response to encrypt the secrets beforing sharing with the enclave.




