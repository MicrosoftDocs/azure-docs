---
title: How to Reprotect from failed over Azure virtual machines back to primary Azure region | Microsoft Docs
description: After failover of VMs from one Azure region to another, you can use Azure Site Recovery to protect the machines in reverse direction. Learn the steps how to do a reprotect before a failover again.
services: site-recovery
documentationcenter: ''
author: ruturaj
manager: gauravd
editor: ''

ms.assetid: 44813a48-c680-4581-a92e-cecc57cc3b1e
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 08/11/2017
ms.author: ruturajd

---
# Reprotect Azure VMs back to the primary region



>[!NOTE]
>
> Site Recovery replication for Azure virtual machines (VMs) is currently in preview.


When you [fail over](../site-recovery-failover.md) VMs from one Azure region to another, the failed over VMs are in an unprotected state. If you want to bring them back to the primary region, you need to first start replicating the VMs, and then fail over again. There is no difference in failover in one direction or other. Similarly, after you enable VM replication, there is no difference between reprotection post-failover, or post-failback.

To explain the reprotection process, as an example we assume that the primary site of the protected VMs is East Asia region, and the recovery site is South East Asia. During failover, you fail over the VMs to the South East Asia region. Before you fail back, you need to replicate the VMs from South East Asia, back to East Asia. This article describes the steps needed for reprotection.

> [!WARNING]
> If you have completed migration and moved the virtual machine to another resource group (or deleted the Azure virtual machine) you cannot fail back.

After reprotection finishes, and the VMs are replicating, you can initiate a failover on the VMs, to bring them back to the East Asia region.

## Prerequisites
1. The VM should have been committed.
2. The target site (East Asia) should be available, and you should be able to access/create new resources in that region.

## Reprotect

Follow these steps to reprotect a VM using the default settings.

1. In **Vault** > **Replicated items**, right-click the VM that failed over, and then select **Re-Protect**. You can also click the machine and select **Re-Protect** from the command buttons.

  ![Reprotection](./media/site-recovery-how-to-reprotect-azure-to-azure/reprotect.png)

2. Verify that the replication direction **Southeast Asia to East Asia**, is selected.

  ![Reprotect](./media/site-recovery-how-to-reprotect-azure-to-azure/reprotectblade.png)

3. Review the **Resource group, Network, Storage, and Availability sets** information, and click **OK**. If there are any resources marked (new), they are created during reprotection.

This triggers a reprotection job that seeds the target site with the latest data, and once that completes, replicates the deltas before you fail back to Southeast Asia.

### Reprotect customization
If you want to choose the extract storage account or the network during reprotect, you can do so using the customize option provided on the reprotection page.

![Customize option](./media/site-recovery-how-to-reprotect-azure-to-azure/customize.png)

You can customize the following properties of the target virtual machine during reprotection.

![Customize](./media/site-recovery-how-to-reprotect-azure-to-azure/customizeblade.png)

|Property |Notes  |
|---------|---------|
|Target resource group     | You can choose to change the target resource group in which th virtual machine will be created. As the part of reprotect, the target virtual machine will be deleted, hence you can choose a new resource group under which you can create the VM post failover         |
|Target Virtual Network     | Network cannot be changed during reprotection. To change the network, redo the network mapping.         |
|Target Storage     | You can change the storage account to which the virtual machine will be created post failover.         |
|Cache Storage     | You can specify a cache storage account which will be used during replication. If you go with the defaults, a new cache storage account will be created, if it does not already exist.         |
|Availability Set     |If the virtual machine in East Asia is part of an availability set, you can choose an availability set for the target virtual machine in Southeast Asia. Defaults will find the existing SEA availability set and try to use it. During customization, you can specify a completely new AV set.         |


### What happens during reprotect?

Just like after the first enable protection, following are the artifacts that get created if you use the defaults.
1. A cache storage account gets created in the East Asia region.
2. If the target storage account (the original storage account of the Southeast Asia VM) does not exist, a new one is created. The name is the East Asia virtual machine's storage account suffixed with "asr".
3. If the target AV set does not exist, and the defaults detect that it needs to create a new AV set, then it will be created as part of the reprotection job. If you have customized reprotection, then the selected AV set will be used.


The following are the list of steps that happen when you trigger a reprotection job. This is in the case the target side virtual machine exists.

1. The required artifacts are created as part of reprotect. If they already exist, then they are reused.
2. The target side (Southeast Asia) virtual machine is first turned off, if it is running.
3. The target side virtual machine's disk is copied by Azure Site Recovery into a container as a seed blob.
4. The target side virtual machine is then deleted.
5. The seed blob is used by the current source side (East Asia) virtual machine to replicate. This ensures that only deltas are replicated.
6. The major changes between the source disk and the seed blob are synchronized. This can take some time to complete.
7. Once the reprotection job completes, the delta replication begins that creates a recovery point as per the policy.

> [!NOTE]
> You cannot protect at a recovery plan level. You can only reprotect at a per VM level.

After the reprotection succeeds, the virtual machine will enter a protected state.

## Next steps

After the virtual machine has entered a protected state, you can initiate a failover. The failover will shut down the virtual machine in East Asia Azure region and then create and boot the Southeast Asia region virtual machine. Hence there is a small downtime for the application. So, choose the time for failover when your application can tolerate a downtime. It is recommended that you run a test failover of the virtual machine first, to make sure it is coming up correctly, before initiating a failover.

-	[Steps to initiate test failover of the virtual machine](../site-recovery-test-failover-to-azure.md)

-	[Steps to initiate failover of the virtual machine](../site-recovery-failover.md)
