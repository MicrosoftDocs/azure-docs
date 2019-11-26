---
title: Deprecation of Azure Site Recovery data encryption feature | Microsoft Docs
description: Details regarig Azure Site Recovery data encryption feature 
services: site-recovery
author: rajani-janaki-ram 
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 11/15/2019
ms.author: rajanaki  

---
# Deprecation of Site Recovery data encryption feature

This document describes the deprecation details and the remediation action you need to take if you are using the Site Recovery data encryption feature while configuring disaster recovery of Hyper-V virtual machines to Azure. 

## Deprecation information


The Site Recovery data encryption feature was available for customers protecting Hyper-V vms to ensure that the replicated data was protected against security threats. this feature will be deprecated by **December 30, 2019**. It is being replaced by the more advanced [Encryption at Rest](https://azure.microsoft.com/blog/azure-site-recovery-encryption-at-rest/) feature, which uses [Storage Service Encryption](https://docs.microsoft.com/azure/storage/common/storage-service-encryption) (SSE). With SSE, data is encrypted before persisting to storage and decrypted on retrieval, and, upon failover to Azure, your VMs will run from the encrypted storage accounts, allowing for an improved recovery time objective (RTO).

Please note that if you are an existing customer using this feature, you would have received communications with the deprecation details and remediation steps. 


## What are the implications?

After **December 30, 2019**, any VMs that still use the retired encryption feature will not be allowed to perform failover. 

## Required action
To continue successful failover operations, and replications follow the steps mentioned below:

Follow these steps for each VM: 
1.	[Disable replication](https://docs.microsoft.com/azure/site-recovery/site-recovery-manage-registration-and-protection#disable-protection-for-a-hyper-v-virtual-machine-replicating-to-azure-using-the-system-center-vmm-to-azure-scenario).
2.	[Create a new replication policy](https://docs.microsoft.com/azure/site-recovery/hyper-v-azure-tutorial#set-up-a-replication-policy).
3.	[Enable replication](https://docs.microsoft.com/azure/site-recovery/hyper-v-vmm-azure-tutorial#enable-replication) and select a storage account with SSE enabled.

After completing the initial replication to storage accounts with SSE enabled, your VMs will be using Encryption at Rest with Azure Site Recovery.


## Next steps
Plan for performing the remediation steps, and execute them at the earliest. In case you have any queries regarding this deprecation, please reach out to Microsoft Support. To read more about Hyper-V to Azure scenario, refer [here](hyper-v-vmm-architecture.md).

