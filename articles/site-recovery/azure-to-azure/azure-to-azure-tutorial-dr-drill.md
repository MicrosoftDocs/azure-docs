---
title: How to test failover for Azure VMs with Azure Site Recovery
description: Summarizes the steps you need for performing  a disaster recovery drill for Azure VMs using the Azure Site Recovery service.
services: site-recovery
author: rajani-janaki-ram
manager: rochakm

ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/01/2017
ms.author: rajanaki
ms.custom: mvc
---

# Run a test failover for Azure VM replication

This tutorial explains the steps to run a test failover from one Azure region to another using the
[Azure Site Recovery](../site-recovery-overview.md) service in the Azure portal. These steps assume
that you have already [enabled replication for Azure virtual machines (VMs)](azure-to-azure-tutorial-enable-replication.md).

> [!NOTE]
>
> Azure VM replication is currently in preview.

## Before you start

- Before you run a test failover, verify the VM properties, and make any changes you need to.
  Access the VM properties in **Replicated items**. The **Essentials** section shows information
  about VM settings and status.

- We recommended that you do a test failover using a different network from your production
  recovery site network. If you must test failover in your production network, be aware of the
  following items:

  1. The primary virtual machine must be shutdown when you are doing the test failover. Otherwise,
     there will be two VMs with the same identity running in the same network at the same time. That
     duplication can cause to undesired consequences.

  2. Any changes made in the test failover VMs are lost when you cleanup the test VMs. These
     changes are not replicated back to the primary VM.

  3. Testing in your production environment requires downtime of your production application. Users
     of the application should be asked to not use the application when the Disaster Recovery drill
     is in progress.

- If you want to access replicated VMs after failover from an on-premises site, you need to prepare
  to connect to these VMs. On-premises machines need to be configured to allow outbound network
  traffic for RDP or SSH so that you can connect to the remote VMs. The VMs must have public
  interfaces so that your on-premises machines have something to connect to.

## Run a test failover

1. In **Settings** > **Replicated Items**, click the VM **+Test Failover** icon.

2. In **Test Failover**, Select a recovery point to use for the failover:

   - **Latest processed**: Fails the VM over to the latest recovery point that was processed by the
     Site Recovery service. The time stamp is shown. With this option, no time is spent processing
     data, so it provides a low RTO (Recovery Time Objective).
   - **Latest app-consistent**: This option fails over all VMs to the latest app-consistent
     recovery point. The time stamp is shown.
   - **Custom**: Select any recovery point.

3. Select the target Azure virtual network to which Azure VMs in the secondary region will be
   connected, after the failover occurs.

4. To start the failover, click **OK**. To track progress, click the VM to open its properties. Or,
   you can click the **Test Failover** job in the vault name > **Settings** > **Jobs** > **Site
   Recovery jobs**.

5. After the failover finishes, the replica Azure VM appears in the Azure portal > **Virtual
   Machines**. Make sure that the VM is running, sized appropriately, and connected to the
   appropriate network.

6. To delete the VMs that were created during the test failover, click **Cleanup test failover** on
   the replicated item or the recovery plan. In **Notes**, record and save any observations
   associated with the test failover.

## Next steps

Learn more about different types of [failovers](../site-recovery-failover.md), and how to run them.

Get help and ask questions in the
[Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).
