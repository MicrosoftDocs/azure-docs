---
title: Prerequisites for replication to Azure by using Azure Site Recovery | Microsoft Docs
description: This article summarizes prerequisites for replicating VMs and physical machines to Azure by using the Azure Site Recovery service.
services: site-recovery
documentationcenter: ''
author: rajani-janaki-ram
manager: jwhit
editor: tysonn

ms.assetid: e24eea6c-50a7-4cd5-aab4-2c5c4d72ee2d
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 03/27/2017
ms.author: rajanaki
---

#  Prerequisites for replicating Azure virtual machines to another region by using Azure Site Recovery

> [!div class="op_single_selector"]
> * [Replicate from Azure to Azure](site-recovery-azure-to-azure-prereq.md)
> * [Replicate from on-premises to Azure](site-recovery-prereq.md)

The Azure Site Recovery service contributes to your business continuity and disaster recovery (BCDR) strategy by orchestrating:
* Replication of Azure virtual machines to another Azure region.
* Replication of on-premises physical servers and virtual machines to Azure or to a secondary datacenter. 

When outages occur in your primary location, you can fail over to a secondary location to keep apps and workloads available. You can fail back to your primary location when it returns to normal operations. For more about Site Recovery, see [What is Site Recovery?](site-recovery-overview.md).

This article summarizes the prerequisites required to begin Site Recovery replication from on-premises to Azure.

Post any comments at the bottom of the article, or ask technical questions on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Azure requirements

**Requirement** | **Details**
--- | ---
**Azure account** | A [Microsoft Azure](http://azure.microsoft.com/) account.<br/><br/> You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/).
**Site Recovery service** | For more about Site Recovery pricing, see [Site Recovery pricing](https://azure.microsoft.com/pricing/details/site-recovery/). We recommend that you create a Recovery Services vault in the target Azure region that you want to use as a disaster recovery location. For example, if your source VMs are running in East US, and you want to replicate to Central US, we recommend that you create the vault in Central US.|
**Azure capacity** | For the target Azure region that you want to use as your disaster recovery location, you need to have a subscription with sufficient capacity for virtual machines, storage accounts, and network components. You can contact support to add more capacity.
**Storage guidance** | Ensure that you follow the [storage guidance](../storage/storage-scalability-targets.md#scalability-targets-for-virtual-machine-disks) for your source Azure virtual machines to avoid any performance issues. If you follow the default settings, Site Recovery creates the required storage accounts based on the source configuration. If you customize and select your own settings, ensure that you follow the [scalability targets for virtual machine disks](../storage/storage-scalability-targets.md#scalability-targets-for-virtual-machine-disks).
**Networking guidance** | You need to whitelist the outbound connectivity from your Azure VM for specific URLs or IP ranges. For more details, refer to the [networking guidance for replicating Azure virtual machines](site-recovery-azure-to-azure-networking-guidance.md) article.
**Azure VM** | Ensure that all the latest root certificates are present on the Windows or Linux VM. If the latest root certificates are not present, the VM cannot be registered to Site Recovery due to security constraints.

>[!NOTE]
>For more details about support for specific configurations, read the [support matrix](site-recovery-support-matrix-azure-to-azure.md).

## Next steps
- Learn more about [networking guidance for replicating Azure virtual machines](site-recovery-azure-to-azure-networking-guidance.md).
- Start protecting your workloads by [replicating Azure virtual machines](site-recovery-azure-to-azure.md).
