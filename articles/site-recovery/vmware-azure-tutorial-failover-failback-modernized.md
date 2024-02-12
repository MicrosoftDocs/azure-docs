---
title: Run VMware VMs failover to Azure
description: Learn how to fail over VMware VMs to Azure in Azure Site Recovery - Modernized
ms.service: site-recovery
ms.topic: tutorial
ms.date: 09/29/2023
ms.custom: MVC
ms.author: ankitadutta
author: ankitaduttaMSFT
---
# Fail over VMware VMs - Modernized

This article describes how to fail over an on-premises VMware virtual machine (VM) to Azure with [Azure Site Recovery](site-recovery-overview.md) - Modernized.

For information about failover in Classic releases, see [this article](vmware-azure-tutorial-failover-failback.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Verify that the VMware VM properties conform with Azure requirements.
> * Fail over specific VMs to Azure.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario. They use default options where possible and don't show all possible settings and paths. If you want to learn about failover in detail, see [Fail over VMs and physical servers](site-recovery-failover.md).

[Learn about](failover-failback-overview.md#types-of-failover) different types of failover. If you want to fail over multiple VMs in a recovery plan, review [this article](site-recovery-failover.md).

## Prerequisites

Complete the previous tutorials:

1. Make sure you've [set up Azure](tutorial-prepare-azure.md) for on-premises disaster recovery of VMware VMs.
2. Prepare your on-premises [VMware](vmware-azure-tutorial-prepare-on-premises.md) environment for disaster recovery.
3. Set up disaster recovery for [VMware VMs](vmware-azure-set-up-replication-tutorial-modernized.md).
4. Run a [disaster recovery drill](tutorial-dr-drill-azure.md) to make sure that everything's working as expected.

## Verify VM properties

Before you run a failover, check the VM properties to make sure that the VMs meet [Azure requirements](vmware-physical-azure-support-matrix.md#replicated-machines).

Follow these steps to verify VM properties:

1. In **Protected Items**, select **Replicated Items**, and then select the VM you want to verify.

2. In the **Replicated item** pane, there's a summary of VM information, health status, and the latest available recovery points. Select **Properties** to view more details.

3. In **Compute and Network**, you can modify these properties as needed:
    * Azure name
    * Resource group
    * Target size
    * Managed disk settings

4. You can view and modify network settings, including:

    * The network and subnet in which the Azure VM will be located after failover.
    * The IP address that will be assigned to it.

5. In **Disks**, you can see information about the operating system and data disks on the VM.

## Run a failover to Azure

1. In **Settings** > **Replicated items**, select the VM you want to fail over, and then select **Failover**.
2. In **Failover**, select a **Recovery Point** to fail over to. You can use one of the following options:
   * **Latest**: This option first processes all the data sent to Site Recovery. It provides the lowest Recovery Point Objective (RPO) because the Azure VM that's created after failover has all the data that was replicated to Site Recovery when the failover was triggered.
   * **Latest processed**: This option fails the VM over to the latest recovery point processed by Site Recovery. This option provides a low RTO (Recovery Time Objective) because no time is spent processing unprocessed data.
   * **Latest app-consistent**: This option fails the VM over to the latest app-consistent recovery point processed by Site Recovery.
   * **Custom**: This option lets you specify a recovery point.

3. Select **Shut down machine before beginning failover** to attempt to shut down source VMs before triggering the failover. Failover continues even if the shutdown fails. You can follow the failover progress on the **Jobs** page.

  In some scenarios, failover requires additional processing that takes around 8 to 10 minutes to complete. You might notice longer test failover times for:

  * VMware Linux VMs.
  * VMware VMs that don't have the DHCP service enabled.
  * VMware VMs that don't have the following boot drivers: storvsc, vmbus, storflt, intelide, atapi.

  > [!WARNING]
  > Don't cancel a failover in progress. Before failover is started, VM replication is stopped. If you cancel a failover in progress, failover stops, but the VM won't replicate again.

## Connect to failed-over VM

1. If you want to connect to Azure VMs after failover by using Remote Desktop Protocol (RDP) and Secure Shell (SSH), [verify that the requirements have been met](failover-failback-overview.md#connect-to-azure-after-failover).
2. After failover, go to the VM and validate by [connecting](../virtual-machines/windows/connect-logon.md) to it.
3. Use **Change recovery point** if you want to use a different recovery point after failover. After you commit the failover in the next step, this option will no longer be available.
4. After validation, select **Commit** to finalize the recovery point of the VM after failover.
5. After you commit, all the other available recovery points are deleted. This step completes the failover.

>[!TIP]
> If you encounter any connectivity issues after failover, follow the [troubleshooting guide](site-recovery-failover-to-azure-troubleshoot.md).

## Planned failover from Azure to on-premises

You can perform a planned failover from Azure to on-premises. Since it is a planned failover activity, the recovery point is generated after the planned failover job is triggered.

>[!NOTE]
> Before proceeding, ensure that the replication health of the machine is healthy. Also ensure that the appliance and all its components are healthy too.

When the planned failover is triggered, pending changes are copied to on-premises, a latest recovery point of the VM is generated and Azure VM is shut down. Post this, on-premises machine is turned on.

After a successful planned failover, the machine will be active in your on-premises environment.

> [!NOTE]
> If protected machine has iSCSI disks, the configuration is retained in Azure upon failover. After planned failover from Azure to on-premises, the iSCSI configuration cannot be retained. So, vmdk disks are created on the on-premises machine. To remove duplicate disks, delete the iSCSI disk as the data is replaced with vmdk disks.


### Failed over VM to Azure - requirements

Ensure the following for the VM,  after it is failed over to Azure:

1. The VM in Azure should always be switched on.
2. Ensure mobility agent services *service 1* and *service 2* are running on the VM. This is to ensure mobility agent in the VM can communicate with Azure Site Recovery services in Azure.
3. The URLs mentioned [here](vmware-azure-architecture-modernized.md#set-up-outbound-network-connectivity) are accessible from the VM.

## Cancel planned failover

If your on-premises environment is not ready or in case of any challenges, you can cancel the planned failover. You can perform a planned failover any time later, once your on-premises conditions turn favorable.

**To cancel a planned failover**:

1. Navigate to the machine in recovery services vault and select **Cancel Failover**.
2. Click **OK**.
3. Ensure that you read the information about  how the *cancel failover* operation proceeds.

If there are any issues preventing Azure Site Recovery from successfully canceling the failed job, follow the recommended steps provided in the job. After following the recommended action, retry the cancel job.

The previous planned failover operation will be canceled. The machine in Azure will be returned to the state just before *planned failover* was triggered.

For planned failover, after we detach the VM disks from the appliance, we take its snapshot before powering on.

If the VM does not boot properly or some application does not come up properly, or for some reason you decide to cancel the planned failover and try again, then:

1. We would revert all the changes made.

2. Bring back the disks to the same state as they were before powering, by using the snapshots taken earlier.

3. Finally, attach the disks back to the appliance and resume the replication.

This behavior is different from what was present in the Classic architecture.

- In Modernized architecture, you can do the failback operation again at a later point of time.

- In Classic architecture, you cannot cancel and retry the failback - if the VM does not boot up or the application does not come up or for any other reason.  


> [!NOTE]
> Only planned failover from Azure to on-premises can be canceled. Failover from on-premises to Azure cannot be canceled.

### Planned failover - failure

If the planned failover fails, Azure Site Recovery automatically initiates a job to cancel the failed job and retrieves the state of the machine that was just before the planned failover.

In case cancellation of last planned failover job fails, Azure Site Recovery prompts you to initiate the cancellation manually.

This information is provided as part of failed planned failover operation and as a health issue of the replicated item.

If issue persists, contact Microsoft support. **Do not** disable replication.

## Re-protect the on-premises machine to Azure after successful planned failover

After successful planned failover, the machine is active in your on-premises. To protect your machine  in the future, ensure that the machine is replicated to Azure (re-protected).

To do this, go to the machine > **Re-protect**, select the appliance of your choice, select the cache storage account and proceed. When selecting the appliance, ensure that the target datastore where the source machine is located, is accessible by the appliance. The datastore of the source machine should always be accessible by the appliance. Even if the machine and appliance are located in different ESX servers, as long as the data store is shared between them, reprotection will succeed. 

  > [!NOTE]
  > When selecting the appliance, ensure that the target datastore where the source machine is located, is accessible by the appliance.

After successfully enabling replication and initial replication, recovery points will be generated to offer business continuity from unwanted disruptions.

## Next steps

After failover, reprotect the Azure VMs to on-premises. After the VMs are reprotected and replicating to the on-premises site, fail back from Azure when you're ready.

- [Reprotect Azure VMs](failover-failback-overview-modernized.md)
- [Fail back from Azure](failover-failback-overview-modernized.md)
