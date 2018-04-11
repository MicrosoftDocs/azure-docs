---
title: Migrate on-premises VMs and physical servers to Azure with Site Recovery | Microsoft Docs
description: This article describes how to migrate on-premises VMs and physical servers to Azure with Azure Site Recovery
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: c413efcd-d750-4b22-b34b-15bcaa03934a
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 10/30/2017
ms.author: raynew

---
# Migrate to Azure with Site Recovery

Read this article to learn about using the [Azure Site Recovery](site-recovery-overview.md) service to migrate on-premises virtual machines (VMs) and physical servers, to Azure VMs.

## Before you start

Watch this video for a quick overview of the steps required to migrate to Azure.
>[!VIDEO https://channel9.msdn.com/Series/Azure-Site-Recovery/ASRHowTo-Video2-Migrate-Virtual-Machines-to-Azure/player]


## What do we mean by migration?

You can deploy Site Recovery to replication on-premises VMs and physical servers, and to migrate them.

- When you replicate, you configure on-premises machines to replicate on a regular basis to Azure. Then when an outage occurs, you fail the machines over from the on-premises site to Azure, and access them from there. When the on-premises site is available again, you fail back from Azure.
- When you use Site Recovery for migration, you replicate on-premises machines to Azure. Then you fail them over from your on-premises site to Azure, and finish up the migration process. There's no failback involved.  

## What can Site Recovery migrate?

You can:

- **Migrate from on-premises**: Migrate on-premises Hyper-V VMs, VMware VMs, and physical servers to Azure. After the migration, workloads running on the on-premises machines will be running on Azure VMs. 
- **Migrate within Azure**: Migrate Azure VMs between Azure regions. 
- **Migrate AWS**: Migrate AWS Windows instances to Azure IaaS VMs. 

## Migrate from on-premises to Azure

To migrate on-premises VMware VMs, Hyper-V VMs, and physical servers, you follow almost the same steps as you would for full replication. 


## Migrate between Azure regions

To migrate Azure VMs between regions, you follow almost the same steps as you would for full migration.

1. You [enable replication](azure-to-azure-tutorial-enable-replication.md)) for the machines you want to migrate.
2. You [run a quick test failover](azure-to-azure-tutorial-dr-drill.md) to make sure everything's working.
3. Then, you [run an unplanned failover](azure-to-azure-tutorial-failover-failback.md) with the **Complete Migration** option.
4. After you've completed the migration, you can [set up replication for disaster recovery](site-recovery-azure-to-azure-after-migration.md), from the Azure region to which you migrated, to a secondary region.



## Migrate AWS to Azure

You can migrate AWS instances to Azure VMs.
- In this scenario only migration is supported. In other words, you can replicate the AWS instances and fail them over to Azure, but you can't fail back.
- AWS instances are handled in the same way as physical servers for migration purposes. You set up a Recovery Services vault, deploy an on-premises configuration server to manage replication, add it to the vault, and specify replication settings.
- You enable replication for the machines you want to migrate, and run a quick test failover. Then you run an unplanned failover with the **Complete Migration** option.






## Next steps

- [Migrate on-premises machines to Azure](tutorial-migrate-on-premises-to-azure.md)
- [Migrate VMs from one Azure region to another](site-recovery-migrate-azure-to-azure.md)
- [Migrate AWS to Azure](tutorial-migrate-aws-to-azure.md)
