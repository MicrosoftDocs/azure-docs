---
title: Deprecation of Azure Site Recovery data encryption feature
description: Get details about the Azure Site Recovery data encryption feature. 
services: site-recovery
author: ankitaduttaMSFT
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 03/02/2023
ms.author: ankitadutta  
ms.custom: engagement-fy23

---
# Deprecation of the Site Recovery data encryption feature

This article describes the deprecation details and the remediation action that you need to take if you're using the Azure Site Recovery data encryption feature while configuring disaster recovery of Hyper-V virtual machines (VMs) to Azure.

## Deprecation information

The Site Recovery data encryption feature was available for customers who wanted to protect replicated data for Hyper-V VMs against security threats. This feature was deprecated on *April 30, 2022*. It was replaced by the [encryption at rest](https://azure.microsoft.com/blog/azure-site-recovery-encryption-at-rest/) feature, which uses [service-side encryption](../storage/common/storage-service-encryption.md) (SSE).

With SSE, data is encrypted before persisting to storage and decrypted on retrieval. Upon failover to Azure, your VMs will run from the encrypted storage accounts to help improve recovery time objective (RTO).

If you're an existing customer who's using this feature, you should have received communications with the deprecation details and remediation steps.

## What are the implications?

As of *April 30, 2022*, any VMs that still use the retired encryption feature can't perform failover.

## Required action

To continue successful failover operations and replications, follow these steps for each VM:

1. [Disable replication](./site-recovery-manage-registration-and-protection.md#disable-protection-for-a-hyper-v-virtual-machine-replicating-to-azure-using-the-system-center-vmm-to-azure-scenario).
2. [Create a new replication policy](./hyper-v-azure-tutorial.md#replication-policy).
3. [Enable replication](./hyper-v-vmm-azure-tutorial.md#enable-replication) and select a storage account with SSE enabled.

After you complete the initial replication to storage accounts with SSE enabled, your VMs will use encryption at rest with Azure Site Recovery.

## Next steps

Plan for performing the remediation steps, and execute them as soon as possible. If you have any questions about this deprecation, contact Microsoft Support. To read more about the scenario of Hyper-V replication to Azure, see [this article](hyper-v-vmm-architecture.md).
