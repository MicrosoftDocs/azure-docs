---
title: Perform a failover in Site Recovery
description: How to failover Azure VMs from the primary region to a secondary region
services: site-recovery
author: rajani-janaki-ram
manager: carmonm

ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 08/04/2017
ms.author: rajanaki
ms.custom: mvc
---
# Perform a failover in Site Recovery

This tutorial describes how to fail over a single virtual machine from **Replicated items** in the
Azure portal. This tutorial assumes that you have practiced a
[Disaster Recovery drill](azure-to-azure-tutorial-dr-drill.md) and everything is working as
expected.

## Run a failover

1. Go to the **Replicated items** page

   ![Failover](./media/azure-to-azure-tutorial-failover-failback/failover.png)

2. Select the virtual machine that you want to fail over. Click **Failover**

3. Under **Failover**, select a **Recovery Point** to fail over to. You can use one of the
   following options:

   * **Latest** (default): This option processes all the data in the Site Recovery service and
     provides the lowest Recovery Point Objective (RPO).
   * **Latest processed**: This option reverts the virtual machine to the latest recovery point that
     has been processed by Site Recovery service.
   * **Custom**: Use this option to fail over to a particular recovery point. This option is useful
     for performing a test failover.

4. Select **Shut down machine before beginning failover** if you want Site Recovery to attempt to
   do a shutdown of source virtual machines before triggering the failover. Failover continues even
   if shutdown fails.

5. Follow the failover progress on the **Jobs** page.

6. After the failover, validate the virtual machine by logging in to it. If you want to go another
   recovery point for the virtual machine, then you can use **Change recovery point** option.

7. Once you are satisfied with the failed over virtual machine, you can **Commit** the failover.
   Committing deletes all the recovery points available with the service. The **Change recovery
   point** option is no longer available.

## Reprotect post failover

After failover of your virtual machines, you should **Reprotect** machines back to the primary
region. Before reprotecting, ensure that the VMs are in the Failover committed state. The target
site (primary region) must be available and have the ability to create and access new resources.

Following the steps can be used to reprotect a virtual machine using the default settings:

1. In **Vault** > **Replicated items**, right-click the virtual machine that's been failed over,
   and then select **Re-Protect**. You can also click the machine and select **Re-Protect** from
   the command buttons.

   ![Right-click to reprotect](./media/azure-to-azure-tutorial-failover-failback/reprotect.png)

2. Notice that the direction of protection, secondary to primary region, is already selected.

3. Review the **Resource group, Network, Storage, and Availability sets** information. Any
resources marked (new) are created as part of the reprotect operation.

4. Click OK to trigger a reprotect job. This job seeds the target site with the latest data. Next,
   the job replicates the deltas to the primary region. The virtual machine is now in a protected
   state.

## Failback to the primary region in Site Recovery

Once your virtual machines are reprotected, you may fail back to the primary region. Follow the same
steps mentioned in previous [failover](#run-a-failover) section.
