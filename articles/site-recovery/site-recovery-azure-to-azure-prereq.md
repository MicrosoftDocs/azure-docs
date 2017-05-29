---
title: Prerequisites for replication to Azure using Azure Site Recovery | Microsoft Docs
description: This article summarizes prerequisites for replicating VMs and physical machines to Azure using the Azure Site Recovery service.
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

#  Prerequisites for replicating Azure virtual machines to another region using Azure Site Recovery

> [!div class="op_single_selector"]
> * [Replicate from Azure to Azure](site-recovery-azure-to-azure-prereq.md)
> * [Replicate from on-premises to Azure](site-recovery-prereq.md)

The Azure Site Recovery service contributes to your business continuity and disaster recovery (BCDR) strategy by orchestrating replication of Azure virtiual machine to another Azure region and on-premises physical servers and virtual machines to the cloud (Azure), or to a secondary datacenter. When outages occur in your primary location, you can fail over to a secondary location to keep apps and workloads available. You can fail back to your primary location when it returns to normal operations. For more about Site Recovery, see [What is Site Recovery?](site-recovery-overview.md).

This article summarizes the prerequisites required to begin Site Recovery replication from on-premises to Azure.

Post any comments at the bottom of the article, or ask technical questions on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Azure requirements

**Requirement** | **Details**
--- | ---
**Azure account** | A [Microsoft Azure](http://azure.microsoft.com/) account.<br/><br/> You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/).
**Site Recovery service** | For more about Site Recovery pricing, see [Site Recovery pricing](https://azure.microsoft.com/pricing/details/site-recovery/). It is recommended that you create Recovery services vault in the target Azure region you want to use as disaster recovery location. For example, if your source VMs are running in East US and you want to replicate to 'Central US', it is recommended that you create the vault in 'Central US'.|
**Azure quota** | You need to have sufficient quota for virtual machines, storage account and network components in your subscription in the target Azure region you want to use as disaster recovery location. You can contact support to add sufficient quota.
**Storage guidance** | Ensure that you follow the [storage guidance](../storage/storage-scalability-targets.md#scalability-targets-for-virtual-machine-disks) for your source Azure virtual machines to avoid any performance issues. If you follow the default settings, Site Recovery will create the required storage accounts based on the source configuration. If you customize and select your own settings, ensure you follow the (../storage/storage-scalability-targets.md#scalability-targets-for-virtual-machine-disks) as your source VMs.
**Networking guidance** | You need to whitelist the outbound connectivity from your Azure VM for specific URLs or IP-ranges. For more details, refer to [networking guidance for replicating Azure virtual machines](site-recovery-azure-to-azure-networking-guidance.md) document.
**Azure VM** | Ensure that all the latest root certificates are present on the Windows or Linux VM. Due to security constraints, the VM cannot be registered to Site Recovery if the latest root certificates are not present.

>[!NOTE]
>For more details about support for specific configurations, read the [support matrix](site-recovery-support-matrix-azure-to-azure.md).

## Next steps
- Learn more about [networking guidance for replicating Azure virtual machines.](site-recovery-azure-to-azure-networking-guidance.md)

- Start protecting your workloads by [replicating Azure virtual machines.](site-recovery-azure-to-azure.md)
