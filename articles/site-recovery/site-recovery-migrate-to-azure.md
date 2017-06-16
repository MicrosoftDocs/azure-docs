---
title: Migrate to Azure with Site Recovery | Microsoft Docs
description: This article provides an overview of migrating VMs and physical servers to Azure with Azure Site Recovery
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: jwhit
editor: ''

ms.assetid: c413efcd-d750-4b22-b34b-15bcaa03934a
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 04/05/2017
ms.author: raynew

---
# Migrate to Azure with Site Recovery

Read this article for an overview of using the Azure Site Recovery service for migration of virtual machines and physical servers.

Site Recovery is an Azure service that contributes to your BCDR strategy, by orchestrating replication of on-premises physical servers and virtual machines to the cloud (Azure), or to a secondary datacenter. When outages occur in your primary location, you fail over to the secondary location to keep apps and workloads available. You fail back to your primary location when it returns to normal operations. Learn more in [What is Site Recovery?](site-recovery-overview.md) You can also use Site Recovery to migrate your existing on-premises workloads to Azure to expedite your cloud journey and avail the array of features that Azure offers.

For a quick overview of how to perform migration, please refer to this video.
>[!VIDEO https://channel9.msdn.com/Series/Azure-Site-Recovery/ASRHowTo-Video2-Migrate-Virtual-Machines-to-Azure/player]

This article describes deployment in the [Azure portal](https://portal.azure.com). The [Azure classic portal](https://manage.windowsazure.com/) can be used to maintain existing Site Recovery vaults, but you can't create new vaults.

Post any comments at the bottom of this article. Ask technical questions on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## What do we mean by migration?

You can deploy Site Recovery for replication of on-premises VMs and physical servers, to Azure or to a secondary site. You replicate machines, fail them over from the primary site when outages occur, and fail them back to the primary site when it recovers. In addition to this, you can use Site Recovery to migrate VMs and physical servers to Azure, so that users can access them as Azure VMs. Migration entails replication, and failover from the primary site to Azure, and a complete migration gesture.

## What can Site Recovery migrate?

You can:

- Migrate workloads running on on-premises Hyper-V VMs, VMware VMs, and physical servers, to run on Azure VMs. You can also do full replication and failback in this scenario.
- Migrate [Azure IaaS VMs](site-recovery-migrate-azure-to-azure.md) between Azure regions. Currently only migration is supported in this scenario, which means failback isn't supported.
- Migrate [AWS Windows instances](site-recovery-migrate-aws-to-azure.md) to Azure IaaS VMs. Currently only migration is supported in this scenario, which means failback isn't supported.

## Migrate on-premises VMs and physical servers

To migrate on-premises Hyper-V VMs, VMware VMs, and physical servers, you follow almost the same steps as those used for regular replication.

1. Set up a Recovery Services vault
2. Configure the required management servers (VMware, VMM, Hyper-V - depending on what you want to migrate), add them to the vault, and specify replication settings.
3. Enable replication for the machines you want to migrate
4. After the initial migration, run a quick test failover to ensure that everything's working as it should.
5. After you verify that your replication environment is working, you use a planned or unplanned failover depending on [what's supported](site-recovery-failover.md) for your scenario. We recommend you use a planned failover when possible.
6. For migration, you don't need to commit a failover, or delete it. Instead, you select the **Complete Migration** option for each machine you want to migrate.
     - In **Replicated Items**, right-click the VM, and click **Complete Migration**. Click **OK** to complete. You can track progress in the VM properties, in by monitoring the Complete Migration job in **Site Recovery jobs**.
     - The **Complete Migration** action finishes up the migration process, removes replication for the machine, and stops Site Recovery billing for the machine.

![completemigration](./media/site-recovery-hyper-v-site-to-azure/migrate.png)

## Migrate between Azure regions

You can migrate Azure VMs between regions using Site Recovery. In this scenario only migration is supported. In other words, you can replicate the Azure VMs and fail them over to another region, but you can't fail back. In this scenario you set up a Recovery Services vault, deploy an on-premises configuration server to manage replication, add it to the vault, and specify replication settings. You enable replication for the machines you want to migrate, and run a quick test failover. Then you run an unplanned failover with the **Complete Migration** option.

## Migrate AWS to Azure

You can migrate AWS instances to Azure VMs. In this scenario only migration is supported. In other words, you can replicate the AWS instances and fail them over to Azure, but you can't fail back. AWS instances are handled in the same way as physical servers for migration purposes. You set up a Recovery Services vault, deploy an on-premises configuration server to manage replication, add it to the vault, and specify replication settings. You enable replication for the machines you want to migrate, and run a quick test failover. Then you run an unplanned failover with the **Complete Migration** option.




## Next steps

- [Migrate VMware VMs to Azure](site-recovery-vmware-to-azure.md)
- [Migrate Hyper-V VMs in VMM clouds to Azure](site-recovery-vmm-to-azure.md)
- [Migrate Hyper-V VMs without VMM to Azure](site-recovery-hyper-v-site-to-azure.md)
- [Migrate Azure VMs between Azure regions](site-recovery-migrate-azure-to-azure.md)
- [Migrate AWS instances to Azure](site-recovery-migrate-aws-to-azure.md)
- [Prepare migrated machines to enable replication](site-recovery-azure-to-azure-after-migration.md) to another region for disaster recovery needs.
- Start protecting your workloads by [replicating Azure virtual machines.](site-recovery-azure-to-azure.md)
