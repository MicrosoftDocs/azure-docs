---
title: Fail over and fail back Hyper-V VMs replicated to a secondary data center with Site Recovery | Microsoft Docs
description: Learn how to fail over Hyper-V VMs to your secondary on-premises site and fail back to primary site, with Azure Site Recovery
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 44a662fa-2e7a-4996-86df-fdd6d6f5dedf
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 09/16/2017
ms.author: raynew

---

# Fail over and fail back Hyper-V VMs replicated to your secondary on-premises site

The [Azure Site Recovery](site-recovery-overview.md) service manages and orchestrates replication, failover, and failback of on-premises machines, and Azure virtual machines (VMs).

This tutorial describes how to fail over a Hyper-V VM managed in a System Center Virtual Machine Manager (VMM) cloud, to a secondary VMM site. After you've failed over, you fail back to your on-premises site when it's available. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Fail over a Hyper-V VM from a primary VMM cloud to a secondary VMM cloud
> * Reprotect from the secondary site to the primary, and fail back
> * Optionally start replicating from primary to secondary again

## Overview

Failover and failback has three stages:

1. **Fail over to secondary site**: Fail machines over from the primary site to the secondary.
2. **Fail back from the secondary site**: Replicate VMs from secondary to primary, and run a planned failover to fail back.
3. After the planned failover, optionally start replicating from the primary site to the secondary again.


## Fail over to a secondary site

### Failover prerequisites

Make sure you've completed a [disaster recovery drill](tutorial-dr-drill-secondary.md) to check that everything's working as expected.


### Run a failover from primary to secondary

You can run a regular or planned failover for Hyper-V VMs.

- Use a regular failover for unexpected outages. When you run this failover, Site Recovery creates a VM in the secondary site, and powers it up. You run the failover against a specific recovery point. Data loss can occur depending on the recovery point you use.
- A planned failover can be used for maintenance, or during expected outage. This option provides zero data loss. When a planned failover is triggered, the source VMs are shut down. Unsynchronized data is synchronized, and the failover is triggered. 
- 
This procedure describes how to run a regular failover.


1. In **Settings** > **Replicated items** click the VM > **Failover**.
2. In **Failover** select a **Recovery Point** to fail over to. You can use one of the following options:
	- **Latest** (default): This option first processes all the data sent to Site Recovery. It provides the lowest RPO (Recovery Point Objective) because the replica VM created after failover has all the data that was replicated to Site Recovery when the failover was triggered.
	- **Latest processed**: This option fails over the VM to the latest recovery point processed by Site Recovery. This option provides a low RTO (Recovery Time Objective), because no time is spent processing unprocessed data.
	- **Latest app-consistent**: This option fails over the VM to the latest app-consistent recovery point processed by Site Recovery. 
3. The encryption key isn't relevant in this scenario.
4. Select **Shut down machine before beginning failover** if you want Site Recovery to attempt to do a shutdown of source VMs before triggering the failover. Site Recovery will also try to synchronize on-premises data that hasn't yet been sent to the secondary site, before triggering the failover. Note that failover continues even if shutdown fails. You can follow the failover progress on the **Jobs** page.
5. You should now be able to see the VM in the secondary VMM cloud.
6. After you verify the VM, **Commit** the failover. This deletes all the available recovery points.

> [!WARNING]
> **Don't cancel a failover in progress**: Before failover is started, VM replication is stopped. If you cancel a failover in progress, failover stops, but the VM won't replicate again.  


## Reprotect and fail back from secondary to primary

### Prerequisites for failback

To complete failback, make sure that the primary and secondary VMM servers are connected to Site Recovery.


### Reprotect and fail back

Start replicating from the secondary site to the primary, and fail back to the primary site. After VMs are running in the primary site again, you can replicate them to the secondary site again.  

1. In **Settings** > **Replicated items** click the VM  and enable **Reverse Replicate**. The VM starts replicating back to the primary site.
2. Click the VM > **Planned Failover**.
3. In **Confirm Planned Failover**, verify the failover direction (from secondary VMM cloud), and select the source and target locations. 
4. In **Data Synchronization**, specify how you want to synchronize:
    - **Synchronize data before failover (synchronize delta changes only)**—This option minimizes VM downtime because it synchronizes without shutting down the VM. Here's what it does:
        - Takes a snapshot of the replica VM, and copies it to the primary Hyper-V host. The replica VM keeps running.
        - Shuts down the replica VM, so that no new changes occur there. The final set of delta changes are transferred to the primary site, and the VM in the primary site is started.
    - **Synchronize data during failover only (full download)**—Use this option if you've been running in the secondary site for a long time. This option is faster, because we expect multiple disk changes, and don't spend time on checksum calculations. This option performs a disk download. It's also useful when the primary VM has been deleted.
5. The encryption key isn't relevant in this scenario.
6. Initiate the failover. You can follow the failover progress on the **Jobs** tab.
7. If you selected to synchronize data before the failover, after the initial data synchronization is done and you're ready to shut down the replica VM in the secondary site, click **Jobs** > planned failover job name > **Complete Failover**. This shuts down the secondary VM, transfers the latest changes to the primary site, and starts the primary VM.
8. In the primary VMM cloud, check that the VM is available.
9. The primary VM is now in a Commit Pending state. Click **Commit**, to commit the failover.
10. If you want to start replicating the primary VM back to the secondary site again, enable **Reverse Replicate**.


> [!NOTE]
> Reverse replication only replicates changes that have occurred since the replica VM was turned off, and only delta changes are sent.

