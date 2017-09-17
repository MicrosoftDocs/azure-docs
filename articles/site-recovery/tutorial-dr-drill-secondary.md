---
title: Run a disaster recovery drill to a secondary System Center VMM cloud with Azure Site Recovery | Microsoft Docs
description: Learn about running a disaster recovery drill between System Center VMM sites with Azure Site Recovery
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 445878e2-6682-49ba-914d-4c6824ab08a6
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 09/14/2017
ms.author: raynew

---
# Run a disaster recovery drill to a secondary VMM cloud

The [Azure Site Recovery](site-recovery-overview.md) service contributes to your disaster recovery strategy by managing and orchestrating replication, failover, and failback of on-premises machines, and Azure virtual machines (VMs).

This tutorial shows you how to run a disaster recovery drill to a secondary System Center Virtual Machine Manager (VMM) cloud, for Hyper-V hosts residing in a primary VMM cloud. A drill validates your replication strategy without data loss or downtime, and doesn't affect affecting your production environment. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Prepare prerequisites for test failover
> * Run a test failover for a single machine


## Prerequisites

- When you run a test failover you can do the failover without a network, with an existing network, or let Site Recovery automatically create a test network. If you want to use an existing production network, note that:
    - The primary VM should be shut down when you're doing the test failover. Otherwise, two VMs with the same identity will be running in the same network, at the same time. 
    - If you make changes to test VMs, the changes are lost when you clean up the test failover. Changes aren't replicated back to the primary VM.
    - Testing a production network causes downtime for production workloads. Ask your users not to use related apps when the disaster recovery drill is in progress. 
- The replica network doesn't need to match the VMM logical network type used for test failover. But, some combinations don't work. For example if the replica uses DHCP and VLAN-based isolation, you can't use Windows Network Virtualization for the test failover network, because it needs IP address pools. 
- We recommend that you don't use the network you selected for network mapping, for test failover.


## Run a test failover for a VM

1. In **Replicated Items**, click the VM > **Test Failover**.
2. In **Test Failover**, specify how test VMs will be connected to networks after the test failover. We recommend that for the purpose of this tutorial, you let Site Recovery automatically create a test network. [Learn more](site-recovery-test-failover-vmm-to-vmm.md#network-options-in-site-recovery).
3. Click **OK** to begin the failover. Track progress on the **Jobs** tab.
4. After failover is complete, verify that the test VMs start successfully.
5. When you're done, click **Cleanup test failover**. This deletes the test VMs, and any networks created during test failover.
6. In **Notes**, record and save any observations associated with the test failover. 


## Next steps

[Learn](site-recovery-failover.md) about running production failovers.






