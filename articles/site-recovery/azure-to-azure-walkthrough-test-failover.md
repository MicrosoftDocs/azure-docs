---
title: Run a test failover for Azure VM replication with Azure Site Recovery | Microsoft Docs
description: Summarizes the steps you need for running a test failover for Azure VMs replicating to another Azure region using the Azure Site Recovery service.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmon
editor: ''

ms.assetid: e15c1b0c-5d75-4fdf-acb0-e61def9e9339
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/01/2017
ms.author: raynew

---

# Step 6: Run a test failover for Azure VM replication

After you've enabled replication for Azure virtual machine (VMs), follow the steps in this article, to run test failover from one Azure region to another, using the [Azure Site Recovery](site-recovery-overview.md) service in the Azure portal.

- When you finish the article, you should have verified with a test failover, that at least one Azure VM can fail over to your secondary Azure region. 
- Post any comments at the bottom of this article, or ask questions in the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr)

>[!NOTE]
>
> Azure VM replication is currently in preview.


## Before you start

- Before you run a test failover, we recommend that you verify the VM properties, and make any changes you need to. You can access the VM properties in **Replicated items**. The **Essentials** blade shows information about machines settings and status.
- We recommend you use a separate Azure VM network for the test failover, and not the network (default or customized) that was set up for production failover.
- The test failover fails over Azure VMs (and their storage) to the secondary Azure region. It doesn't replicate any dependent apps or resources. If apps running on failed over VMs are dependent on other resources, such as Active Directory or DNS, you need to replicate these too, if they're not already available in your secondary region. [Learn more](site-recovery-test-failover-to-azure.md#prepare-active-directory-and-dns)
- If you want to access replicated VMs after failover from an on-premises site, you need to [prepare to connect](site-recovery-test-failover-to-azure.md#prepare-to-connect-to-azure-vms-after-failover) to these VMs.

## Run a test failover

1. In **Settings** > **Replicated Items**, click the VM **+Test Failover** icon. 

2. In **Test Failover**, Select a recovery point to use for the failover:

    - **Latest processed**: Fails the VM over to the latest recovery point that was processed by the Site Recovery service. The time stamp is shown. With this option, no time is spent processing data, so it provides a low RTO (Recovery Time Objective).
    - **Latest app-consistent**: This option fails over all VMs to the latest app-consistent recovery point. The time stamp is shown. 
    - **Custom**: Select any recovery point.
 
3. Select the target Azure virtual network to which Azure VMs in the secondary region will be connected, after the failover occurs.
4. To start the failover, click **OK**. To track progress, click the VM to open its properties. Or, you can click the **Test Failover** job in the vault name > **Settings** > **Jobs** > **Site Recovery jobs**.
5. After the failover finishes, the replica Azure VM appears in the Azure portal > **Virtual Machines**. Make sure that the VM is the appropriate size, that it's connected to the appropriate network, and that it's running.
6. To delete the VMs that were created during the test failover, click **Cleanup test failover** on the replicated item or the recovery plan. In **Notes**, record and save any observations associated with the test failover. 

[Learn more](site-recovery-test-failover-to-azure.md) about test failovers.

## Next steps

After you've tested failover, this walkthrough is complete. Now, learn about running failovers in production:

- [Learn more](site-recovery-failover.md) about different types of failovers, and how to run them.
- Learn more about failing over multiple VMs [using a recovery plan](site-recovery-create-recovery-plans.md).
- Learn more about [using recovery plans](site-recovery-create-recovery-plans.md).
- Learn more about [reprotecting Azure  VMs](site-recovery-how-to-reprotect.md) after failover.

