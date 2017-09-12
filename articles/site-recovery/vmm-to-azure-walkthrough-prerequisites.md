---
title: Review the prerequisites for Hyper-V to Azure replication (with System Center VMM) using Azure Site Recovery | Microsoft Docs
description: Describes the prerequisites for setting up replication, failover and recovery of on-premises Hyper-V VMs in VMM clouds to Azure, with Azure Site Recovery
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: a1c30fd5-c979-473c-af44-4f725ad3e3ba
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 07/24/2017
ms.author: raynew
---



# Step 2: Review the prerequisites for Hyper-V (with VMM) to Azure replication

After you're reviewed the [scenario architecture](vmm-to-azure-walkthrough-architecture.md), read this article to make sure you understand the deployment prerequisites. 

## Prerequisites and limitations

**Requirement** | **Details**
--- | ---
**Azure account** | You need a [Microsoft Azure account](http://azure.microsoft.com/).
**Azure storage** | You need an Azure storage account to store replicated data.<br/><br/> The storage account must be in the same region as the Azure Recovery Services vault.<br/><br/>You can use [geo-redundant storage](../storage/common/storage-redundancy.md#geo-redundant-storage) or locally redundant storage. We recommend geo-redundant storage. With geo-redundant storage, data is resilient if a regional outage occurs, or if the primary region can't be recovered.<br/><br/> You can use a standard Azure storage account, or you can use Azure [premium storage](../storage/common/storage-premium-storage.md). Premium storage can host I/O intensive workloads, and is typically is used for VMs that need a consistently high I/O performance and low latency. If you use premium storage for replicated data, you also need a standard storage account. A standard storage account stores replication logs that capture ongoing changes to on-premises data.
**Azure network** | You need an [Azure network](../virtual-network/virtual-network-get-started-vnet-subnet.md), to which Azure VMs connect after failover. The Azure network must be in the same region as the Recovery Services vault.
**On-premises VMM servers** | You need one or more VMM servers running System Center 2012 R2 or later.<br/><br/> Each VMM server must have one or more private clouds. Each cloud needs one or most host groups.<br/><br/> The VMM server needs internet access.
**On-premises Hyper-V** | Hyper-V host servers must be running at least Windows Server 2012 R2 with the Hyper-V role enabled, or Microsoft Hyper-V Server 2012 R2. The latest updates must be installed.<br/><br/> The Hyper-V host must be located in a VMM host group (located in a VMM cloud).<br/><br/> A host must have one or more VMs that you want to replicated.<br/><br/> Hyper-V hosts must be connected to the internet for replication to Azure, directly or with a proxy. Hyper-V servers must have the fixes described in article [2961977](https://support.microsoft.com/kb/2961977).
**On-premises Hyper-V VMs** | VMs you want to replicate should be running a [supported operating system](site-recovery-support-matrix-to-azure.md#support-for-replicated-machine-os-versions), and conform with [Azure prerequisites](site-recovery-support-matrix-to-azure.md#failed-over-azure-vm-requirements). The VM name can be modified after replication is enabled. 




## Next steps

Go to [Step 3: Plan capacity](vmm-to-azure-walkthrough-capacity.md)
