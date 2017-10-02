---
title: Prepare Azure resources to replicate Hyper-V VMs (with System Center VMM) to Azure using Azure Site Recovery| Microsoft Docs
description: Describes what you need in place in Azure before you start replicating Hyper-V VMs (with VMM) to Azure, using Azure Site Recovery
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 1568bdc3-e767-477b-b040-f13699ab5644
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 07/23/2017
ms.author: raynew
---

# Step 5: Prepare Azure resources for Hyper-V replication (with VMM) to Azure

After verifying [network requirements](vmm-to-azure-walkthrough-network.md), use the instructions in this article to prepare Azure resources so that you can replicate on-premises Hyper-V VMs in System Center Virtual Machine Manager (VMM) clouds to Azure, using the [Azure Site Recovery](site-recovery-overview.md) service.

After reading this article, post any comments at the bottom, or ask technical questions on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Set up an Azure account

- Get a [Microsoft Azure account](http://azure.microsoft.com/).
- You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/).
- Check the supported regions for Site Recovery, Under Geographic Availability in [Azure Site Recovery Pricing Details](https://azure.microsoft.com/pricing/details/site-recovery/).
- Learn about [Site Recovery pricing](site-recovery-faq.md#pricing), and get the [pricing details](https://azure.microsoft.com/pricing/details/site-recovery/).
- Make sure your Azure account has the correct [permissions](site-recovery-role-based-linked-access-control.md#permissions-required-to-enable-replication-for-new-virtual-machines)to create Azure VMs. [Learn more](../active-directory/role-based-access-built-in-roles.md) about Azure role-based access control.


## Set up an Azure network

- Set up an [Azure network](../virtual-network/virtual-network-get-started-vnet-subnet.md). Azure VMs are placed in this network when they're created after failover.
- The network should be in the same region as the Recovery Services vault
- Site Recovery in the Azure portal can use networks set up in [Resource Manager](../resource-manager-deployment-model.md), or in classic mode.
- We recommend you set up a network before you begin. If you don't, you need to do it during Site Recovery deployment.
- Learn about [virtual network pricing](https://azure.microsoft.com/pricing/details/virtual-network/).


## Set up an Azure storage account

- Site Recovery replicates on-premises machines to Azure storage. Azure VMs are created from the storage after failover occurs.
- Set up a standard/premium [Azure storage account](../storage/common/storage-create-storage-account.md#create-a-storage-account) to hold data replicated to Azure.
- [Premium storage](../storage/common/storage-premium-storage.md) is typically used for virtual machines that need a consistently high IO performance, and low latency to host IO intensive workloads.
- If you want to use a premium account to store replicated data, you also need a standard storage account to store replication logs that capture ongoing changes to on-premises data.
- Depending on the resource model you want to use for failed over Azure VMs, you set up an account in [Resource Manager mode](../storage/common/storage-create-storage-account.md), or [classic mode](../storage/common/storage-create-storage-account.md).
- We recommend that you set up a storage account before you begin. If you don't you need to do it during Site Recovery deployment. The accounts must be in the same region as the Recovery Services vault.
- You can't move storage accounts used by Site Recovery across resource groups within the same subscription, or across different subscriptions.


## Next steps

Go to [Step 6: Prepare VMM](vmm-to-azure-walkthrough-vmm-hyper-v.md)
