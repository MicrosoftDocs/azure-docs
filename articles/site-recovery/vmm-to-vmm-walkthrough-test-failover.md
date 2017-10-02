---
title: Run a test failover for Hyper-V VM replication to a secondary site with Azure Site Recovery | Microsoft Docs
description: Describes how to run a test failover for Hyper-V VM replication to a secondary System Center VMM site with Azure Site Recovery.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: a3fd11ce-65a1-4308-8435-45cf954353ef
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/30/2017
ms.author: raynew

---
# Step 10: Run a test failover for Hyper-V replication to a secondary site


After you enable replication for Hyper-V virtual machines (VMs) with [Azure Site Recovery](site-recovery-overview.md), use this article to run a test failover. A test failover verifies that replication is working, without impacting your production environment. 


After reading this article, post any comments at the bottom, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Before you start

- When you're triggering a test failover, you can specify the network to which the test replica VMs will connect. [Learn more](site-recovery-test-failover-vmm-to-vmm.md#network-options-in-site-recovery) about the network options.
- We recommend that you don't choose a network that you selected during network mapping.
- The instructions in this article describe how to fail over a single VM. Read about [creating recovery plans](site-recovery-create-recovery-plans.md) if you want to fail over multiple VMs together.
- Read about [limitations for test failovers](site-recovery-test-failover-vmm-to-vmm.md#things-to-note).
- The IP address given to a VM during test failover is the same IP address that the VM would receive for a planned or unplanned failover (presuming that the IP address is available in the test failover network). If the IP address isn't available in the test failover network, the VM receives another IP address that is available in the test failover network.
- If you do want to do a test failover in your production network, for full validatation of end-to-end network connectivity machine, note that:
    - The primary VM should be shut down when you're doing the test failover. Otherwise, two VMs with the same identity will be running in the same network at the same time. 
    - If you make changes to test VMs, those changes are lost when you clean up the test failover. These changes aren't replicated back to the primary VM.
    - Testing a a production network leads to downtime for your production workloads. Ask users not to use the app when the disaster recovery drill is in progress.  


## Run a test failover for a VM

1. To fail over a single VM, in **Replicated Items**, click the VM > **Test Failover**.
2. In **Test Failover**, specify how test VMs will be connected to networks after the test failover. 
3. Click **OK** to begin the failover. Track progress on the **Jobs** tab.
5. After failover is complete, verify that the test VMs start successfully.
6. When you're done, click **Cleanup test failover** on the recovery plan.
7. In **Notes**, record and save any observations associated with the test failover. This step deletes the virtual machines and networks that were created during test failover.


## Next steps

After you've tested the deployment, learn more about other types of [failover](site-recovery-failover.md).
