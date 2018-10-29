---
title: Fail over and fail back Hyper-V VMs replicated to a secondary data center with Site Recovery | Microsoft Docs
description: Learn how to fail over Hyper-V VMs to your secondary on-premises site and fail back to primary site, with Azure Site Recovery
services: site-recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 10/10/2018
ms.author: raynew

---

# Fail over and fail back Hyper-V VMs replicated to your secondary on-premises site

The [Azure Site Recovery](site-recovery-overview.md) service manages and orchestrates replication, failover, and failback of on-premises machines, and Azure virtual machines (VMs).

This article describes how to fail over a Hyper-V VM managed in a System Center Virtual Machine Manager (VMM) cloud, to a secondary VMM site. After you've failed over, you fail back to your on-premises site when it's available. In this article, you learn how to:

> [!div class="checklist"]
> * Fail over a Hyper-V VM from a primary VMM cloud to a secondary VMM cloud
> * Reprotect from the secondary site to the primary, and fail back
> * Optionally start replicating from primary to secondary again

## Failover and failback

Failover and failback has three stages:

1. **Fail over to secondary site**: Fail machines over from the primary site to the secondary.
2. **Fail back from the secondary site**: Replicate VMs from secondary to primary, and run a planned failover to fail back.
3. After the planned failover, optionally start replicating from the primary site to the secondary again.


## Prerequisites

- Make sure you've completed a [disaster recovery drill](hyper-v-vmm-test-failover.md) to check that everything's working as expected.
- To complete failback, make sure that the primary and secondary VMM servers are connected to Site Recovery.



## Run a failover from primary to secondary

You can run a regular or planned failover for Hyper-V VMs.

- Use a regular failover for unexpected outages. When you run this failover, Site Recovery creates a VM in the secondary site, and powers it up. Data loss can occur depending on pending data that hasn't been synchronized.
- A planned failover can be used for maintenance, or during expected outage. This option provides zero data loss. When a planned failover is triggered, the source VMs are shut down. Unsynchronized data is synchronized, and the failover is triggered. 
- 
This procedure describes how to run a regular failover.


1. In **Settings** > **Replicated items** click the VM > **Failover**.
1. Select **Shut down machine before beginning failover** if you want Site Recovery to attempt to do a shutdown of source VMs before triggering the failover. Site Recovery will also try to synchronize on-premises data that hasn't yet been sent to the secondary site, before triggering the failover. Note that failover continues even if shutdown fails. You can follow the failover progress on the **Jobs** page.
2. You should now be able to see the VM in the secondary VMM cloud.
3. After you verify the VM, **Commit** the failover. This deletes all the available recovery points.

> [!WARNING]
> **Don't cancel a failover in progress**: Before failover is started, VM replication is stopped. If you cancel a failover in progress, failover stops, but the VM won't replicate again.  


## Reverse replicate and failover

Start replicating from the secondary site to the primary, and fail back to the primary site. After VMs are running in the primary site again, you can replicate them to the secondary site.  

 
1. Click the VM > click on **Reverse Replicate**.
2. Once the job is complete, click the VM >In **Failover**, verify the failover direction (from secondary VMM cloud), and select the source and target locations. 
4. Initiate the failover. You can follow the failover progress on the **Jobs** tab.
5. In the primary VMM cloud, check that the VM is available.
6. If you want to start replicating the primary VM back to the secondary site again, click on **Reverse Replicate**.

## Next steps
[Review the step](hyper-v-vmm-disaster-recovery.md) for replicating Hyper-V VMs to a secondary site.
