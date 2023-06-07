---
title: Set up failover and failback for physical servers with Site Recovery 
description: Learn how to fail over physical servers to Azure, and fail back to the on-premises site for disaster recovery with Azure Site Recovery
services: site-recovery
ms.service: site-recovery
ms.topic: article
ms.date: 12/17/2019
ms.author: ankitadutta
author: ankitaduttaMSFT
---

# Fail over and fail back physical servers replicated to Azure

This tutorial describes how to fail over on-premises physical servers that are replicating to Azure with [Azure Site Recovery](site-recovery-overview.md). After you've failed over, you fail back from Azure to your on-premises site when it's available.

## Before you start

- [Learn](failover-failback-overview.md) about the failover process in disaster recovery.
- If you want to fail over multiple machines, [learn](recovery-plan-overview.md) how to gather machines together in a recovery plan.
- Before you do a full failover, run a [disaster recovery drill](site-recovery-test-failover-to-azure.md) to ensure that everything is working as expected.
- Follow [these instructions](site-recovery-failover.md#prepare-to-connect-after-failover) to prepare to connect to Azure VMs after failover.



## Run a failover

### Verify server properties

Verify the server properties, and make sure that it complies with [Azure requirements](vmware-physical-azure-support-matrix.md#replicated-machines) for Azure VMs.

1. In **Protected Items**, click **Replicated Items**, and select the machine.
2. In the **Replicated item** pane, there's a summary of machine information, health status, and the
   latest available recovery points. Click **Properties** to view more details.
3. In **Compute and Network**, you can modify the Azure name, resource group, target size, [availability set](../virtual-machines/windows/tutorial-availability-sets.md), and managed disk settings
4. You can view and modify network settings, including the network/subnet in which the Azure VM will be located after failover, and the IP address that will be assigned to it.
5. In **Disks**, you can see information about the machine operating system and data disks.

### Fail over to Azure

1. In **Settings** > **Replicated items** click the machine > **Failover**.
2. In **Failover** select a **Recovery Point** to fail over to. You can use one of the following options:
   - **Latest**: This option first processes all the data sent to Site Recovery. It
     provides the lowest RPO (Recovery Point Objective) because the Azure VM created after failover
     has all the data that was replicated to Site Recovery when the failover was triggered.
   - **Latest processed**: This option fails over the machine to the latest recovery point processed by
     Site Recovery. This option provides a low RTO (Recovery Time Objective), because no time is
     spent processing unprocessed data.
   - **Latest app-consistent**: This option fails over the machine to the latest app-consistent recovery
     point processed by Site Recovery.
   - **Custom**: Specify a recovery point.

3. Select **Shut down machine before beginning failover** if you want Site Recovery to try to shut down source
   machine before triggering the failover. Failover continues even if shutdown fails. You
   can follow the failover progress on the **Jobs** page.
4. If you prepared to connect to the Azure VM, connect to validate it after the failover.
5. After you verify, **Commit** the failover. This deletes all the available recovery points.

> [!WARNING]
> Don't cancel a failover in progress. Before failover begins, machine replication stops. If you cancel the failover, it stops, but the machine won't replicate again.
> For physical servers, additional failover processing can take around eight to ten minutes to complete.

## Automate actions during failover

You might want to automate actions during failover. To do this, you can use scripts or Azure automation runbooks in recovery plans.

- [Learn](site-recovery-create-recovery-plans.md) about creating and customizing recovery plans, including adding scripts.
- [Learn](site-recovery-runbook-automation.md) abut adding Azure Automation runbooks to recovery plans.

## Configure settings after failover

After failover you need to [configure Azure settings](site-recovery-failover.md#prepare-in-azure-to-connect-after-failover) to connect to the replicated Azure VMs. In addition, set up [internal and public](site-recovery-failover.md#set-up-ip-addressing) IP addressing.

## Prepare for reprotection and failback

After failing over to Azure, you reprotect Azure VMs by replicating them to the on-premises site. Then after they're replicating, you can fail them back to on-premises, by running a failover from Azure to your on-premises site.

1. Physical servers replicated to Azure using Site Recovery can only fail back as VMware VMs. You need a VMware infrastructure in order to fail back. Follow the steps in [this article](vmware-azure-prepare-failback.md) to prepare for reprotection and failback, including setting up a process server in Azure, and an on-premises master target server, and configuring a site-to-site VPN, or ExpressRoute private peering, for failback.
2. Make sure that the on-premises configuration server is running and connected to Azure. During failover to Azure, the on-premises site might not be accessible, and the configuration server might be unavailable or shut down. During failback, the VM must exist in the configuration server database. Otherwise, failback is unsuccessful.
3. Delete any snapshots on the on-premises master target server. Reprotection won't work if there are snapshots.  The snapshots on the VM are automatically merged during a reprotect job.
4. If you're reprotecting VMs gathered into a replication group for multi-VM consistency, make sure they all have the same operating system (Windows or Linux) and make sure that the master target server you deploy has the same type of operating system. All VMs in a replication group must use the same master target server.
5. Open [the required ports](vmware-azure-prepare-failback.md#ports-for-reprotectionfailback) for failback.
6. Ensure that the vCenter Server is connected before failback. Otherwise, disconnecting disks and attaching them back to the virtual machine fails.
7. If a vCenter server manages the VMs to which you'll fail back, make sure that you have the required permissions. If you perform a read-only user vCenter discovery and protect virtual machines, protection succeeds, and failover works. However, during reprotection, failover fails because the datastores can't be discovered, and aren't listed during reprotection. To resolve this problem, you can update the vCenter credentials with an [appropriate account/permissions](vmware-azure-tutorial-prepare-on-premises.md#prepare-an-account-for-automatic-discovery), and then retry the job. 
8. If you used a template to create your virtual machines, ensure that each VM has its own UUID for the disks. If the on-premises VM UUID clashes with the UUID of the master target server because both were created from the same template, reprotection fails. Deploy from a different template.
9. If you're failing back to an alternate vCenter Server, make sure that the new vCenter Server and the master target server are discovered. Typically if they're not the datastores aren't accessible, or aren't visible in **Reprotect**.
10. Verify the following scenarios in which you can't fail back:
    - If you're using either the ESXi 5.5 free edition or the vSphere 6 Hypervisor free edition. Upgrade to a different version.
    - If you have a Windows Server 2008 R2 SP1 physical server.
    - VMs that have been migrated.
    - A VM that's been moved to another resource group.
    - A replica Azure VM that's been deleted.
    - A replica Azure VM that isn't protected (replicating to the on-premises site).
10. [Review the types of failback](concepts-types-of-failback.md) you can use - original location recovery and alternate location recovery.


## Reprotect Azure VMs to an alternate location

This procedure presumes that the on-premises VM isn't available.

1. In the vault > **Settings** > **Replicated items**, right-click the machine that was failed over > **Re-Protect**.
2. In **Re-protect**, verify that **Azure to On-premises**, is selected.
3. Specify the on-premises master target server, and the process server.
4. In **Datastore**, select the master target datastore to which you want to recover the disks
   on-premises.
       - Use this option if the on-premises VM has been deleted or doesn't exist, and you need to create
   new disks.
       - This setting is ignored if the disks already exists, but you do need to specify a
   value.
5. Select the master target retention drive. The failback policy is automatically selected.
6. Click **OK** to begin reprotection. A job begins to replicate the Azure VM to
   the on-premises site. You can track the progress on the **Jobs** tab.

> [!NOTE]
> If you want to recover the Azure VM to an existing on-premises VM, mount the on-premises virtual
> machine's datastore with read/write access, on the master target server's ESXi host.


## Fail back from Azure

Run the failover as follows:

1. On the **Replicated Items** page, right-click the machine > **Unplanned Failover**.
2. In **Confirm Failover**, verify that the failover direction is from Azure.
3.Select the recovery point that you want to use for the failover.
    - We recommend that you use the **Latest** recovery point. The app-consistent point is behind the latest point in time, and causes some data loss.
    - **Latest** is a crash-consistent recovery point.
    - When failover runs, Site Recovery shuts down the Azure VMs, and boots up the on-premises VM. There will be some downtime, so choose an appropriate time.
4. Right-click the machine, and click **Commit**. This triggers a job that removes the Azure VMs.
5. Verify that Azure VMs have been shut down as expected.


## Reprotect on-premises machines to Azure

Data should now be back on your on-premises site, but it isn't replicating to Azure. You can start replicating to Azure again as follows:

1. In the vault > **Settings** >**Replicated Items**, select the failed back VMs that have failed
   back, and click **Re-Protect**.
2. Select the process server that is used to send the replicated data to Azure, and click **OK**.


## Next steps

After the reprotect job finishes, the on-premises VM is replicating to Azure. As needed, you can [run another failover](site-recovery-failover.md) to Azure.
