---
title: Prepare Azure resources to replicate Hyper-V VMs (without System Center VMM) to Azure using Azure Site Recovery| Microsoft Docs
description: Describes what you need in place in Azure before you start replicating Hyper-V VMs (Without VMM) to Azure using Azure Site Recovery
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 28fa722c-675e-4637-98eb-7ccbf3806d69
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 06/21/2017
ms.author: raynew
---

# Step 5: Prepare Azure resources for Hyper-V replication to Azure

Use the instructions in this article to prepare Azure resources so that you can replicate on-premises Hyper-V VMs (without System Center VMM) to Azure using the [Azure Site Recovery](site-recovery-overview.md) service.

After reading this article, post any comments at the bottom, or ask technical questions on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Before you start

Make sure you've read the [prerequisites](hyper-v-site-walkthrough-prerequisites.md)

## Set up an Azure account

- Get a [Microsoft Azure account](http://azure.microsoft.com/).
- You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/).
- Check the supported regions for Site Recovery, Under Geographic Availability in [Azure Site Recovery Pricing Details](https://azure.microsoft.com/pricing/details/site-recovery/).
- Learn about [Site Recovery pricing](site-recovery-faq.md#pricing), and get the [pricing details](https://azure.microsoft.com/pricing/details/site-recovery/).


## Set up an Azure network

- Set up an Azure network. Azure VMs are placed in this network when they're created after failover.
- - The network should be in the same region as the Recovery Services vault
- Site Recovery in the Azure portal can use networks set up in [Resource Manager](../resource-manager-deployment-model.md), or in classic mode.
- We recommend you set up a network before you begin. If you don't, you need to do it during Site Recovery deployment.
- Learn about [virtual network pricing](https://azure.microsoft.com/pricing/details/virtual-network/).


## Set up an Azure storage account

- Site Recovery replicates on-premises machines to Azure storage. Azure VMs are created from the storage after failover occurs.
- Set up a standard/premium [Azure storage account](../storage/storage-create-storage-account.md#create-a-storage-account) to hold data replicated to Azure.
- [Premium storage](../storage/storage-premium-storage.md) is typically used for virtual machines that need a consistently high IO performance, and low latency to host IO intensive workloads.
- If you want to use a premium account to store replicated data, you also need a standard storage account to store replication logs that capture ongoing changes to on-premises data.
- Depending on the resource model you want to use for failed over Azure VMs, you set up an account in [Resource Manager mode](../storage/storage-create-storage-account.md), or [classic mode](../storage/storage-create-storage-account-classic-portal.md).
- We recommend that you set up a storage account before you begin. If you don't you need to do it during Site Recovery deployment. The accounts must be in the same region as the Recovery Services vault.
- You can't move storage accounts used by Site Recovery across resource groups within the same subscription, or across different subscriptions.


## Next steps

Go to [Step 6: Prepare Hyper-V resources](hyper-v-site-walkthrough-prepare-hyper-v.md)