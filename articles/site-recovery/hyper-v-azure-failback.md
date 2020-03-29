---
title: Fail back Hyper-V VMs from Azure with Azure Site Recovery 
description: How to fail back Hyper-V VMs to an on-premises site from Azure with Azure Site Recovery.
services: site-recovery
author: rajani-janaki-ram
manager: gauravd
ms.service: site-recovery
ms.topic: article
ms.date: 09/12/2019
ms.author: rajanaki

---

# Run a failback for Hyper-V VMs

This article describes how to fail back Azure VMs that were created after failover of Hyper-V VMs from an on-premises site to Azure, with [Azure Site Recovery](site-recovery-overview.md).

- You fail back Hyper-V VMs from Azure by running a planned failover from Azure to the on-premises site. If the failover direction is from Azure to on-premises, it's considered a failback.
- Since Azure is a highly available environment and VMs are always available, failback from Azure is a planned activity. You can plan for a small downtime so that workloads can start running on-premises again. 
- Planned failback turns off the VMs in Azure, and downloads the latest changes. No data loss is expected.

## Before you start

1. [Review the types of failback](failover-failback-overview.md#hyper-v-reprotectionfailback) you can use - original location recovery and alternate location recovery.
2. Ensure that the Azure VMs are using a storage account and not managed disks. Failback of Hyper-V VMs replicated using managed disks isn't supported.
3. Check that the on-premises Hyper-V host (or System Center VMM server if you're using with Site Recovery) is running and connected to Azure. 
4. Make sure that failover and commit are complete for the VMs. You don't need to set up any specific Site Recovery components for failback of Hyper-V VMs from Azure.
5. The time needed to complete data synchronization and start the on-premises VM will depend on a number of factors. To speed up data download, you can configure the Microsoft Recovery Services agent to use more threads to parallelize the download. [Learn more](https://support.microsoft.com/help/3056159/how-to-manage-on-premises-to-azure-protection-network-bandwidth-usage).


## Fail back to the original location

To fail back Hyper-V VMs in Azure to the original on-premises VM, run a planned failover from Azure to the on-premises site as follows:

1. In the vault > **Replicated items**, select the VM. Right-click the VM > **Planned Failover**. If you're failing back a recovery plan, select the plan name and click **Failover** > **Planned Failover**.
2. In **Confirm Planned Failover**, choose the source and target locations. Note the failover direction. If the failover from primary worked as expected and all virtual machines are in the secondary location this is for information only.
3. In **Data Synchronization**, select an option:
	- **Synchronize data before failover (synchronize delta changes only)**—This option minimizes downtime for VMs as it synchronizes without shutting them down.
		- **Phase 1**: Takes a snapshot of Azure VM and copies it to the on-premises Hyper-V host. The machine continues running in Azure.
		- **Phase 2**: Shuts down the Azure VM so that no new changes occur there. The final set of delta changes is transferred to the on-premises server and the on-premises VM is started.
	- **Synchronize data during failover only (full download)**—This option is faster because we presume that most of the disk has changed, and don't want to spend time calculating checksums. This option doesn't perform any checksum calculations.
	    - It performs a download of the disk. 
		- We recommend you use this option if you've been running Azure for a while (a month or more) or if the on-premises VM is deleted.

4. For VMM only, if data encryption is enabled for the cloud, in **Encryption Key**, select the certificate that was issued when you enabled data encryption during Provider installation on the VMM server.
5. Initiate the failover. You can follow the failover progress on the **Jobs** tab.
6. If you selected the option to synchronize the data before the failover, after the initial data synchronization is complete and you're ready to shut down the virtual machines in Azure, click **Jobs** > job name > **Complete Failover**. This does the following:
    - Shuts down the Azure machine.
	- Transfers the latest changes to the on-premises VM.
	- Starts the on-premises VM.
7. You can now sign into the on-premises VM machine to check that it's available as expected.
8. The virtual machine is in a commit pending state. Click **Commit** to commit the failover.
9. To complete the failback, click **Reverse Replicate** to start replicating the on-premises VM to Azure again.



## Fail back to an alternate location 

Fail back to an alternate location as follows:

1. If you're setting up new hardware, install a [supported version of Windows](hyper-v-azure-support-matrix.md#replicated-vms), and the Hyper-V role on the machine.
2. Create a virtual network switch with the same name that you had on the original server.
3. In **Protected Items** > **Protection Group** > \<ProtectionGroupName> -> \<VirtualMachineName>, select the VM you want to fail back, and then select **Planned Failover**.
4. In **Confirm Planned Failover**s, elect **Create on-premises virtual machine if it does not exist**.
5. In **Host Name**, select the new Hyper-V host server on which you want to place the VM.
6. In **Data Synchronization**, we recommend you select the option to synchronize the data before the failover. This minimizes downtime for VMs as it synchronizes without shutting them down. It does the following:
	- **Phase 1**: Takes snapshot of the Azure VM and copies it to the on-premises Hyper-V host. The machine continues running in Azure.
	- **Phase 2**: Shuts down the Azure VM so that no new changes occur there. The final set of changes is transferred to the on-premises server and the on-premises virtual machine is started up.
	
7. Click the checkmark to begin the failover (failback).
8. After the initial synchronization finishes and you're ready to shut down the Azure VM, click **Jobs** > \<planned failover job> > **Complete Failover**. This shuts down the Azure machine, transfers the latest changes to the on-premises VM, and starts it.
9. You can sign into the on-premises VM to verify that everything is working as expected.
10. Click **Commit** to finish the failover. Commit deletes the Azure VM and its disks, and prepares the on-premises VM to be protected again.
10. Click **Reverse Replicate** to start replicating the on-premises VM to Azure. Only the delta changes since the VM was turned off in Azure will be replicated.

    > [!NOTE]
    > If you cancel the failback job during data synchronization, the on-premises VM will be in a corrupted state. This is because data synchronization copies the latest data from Azure VM disks to the on-premises data disks, and until the synchronization completes, the disk data may not be in a consistent state. If the on-premises VM starts after data synchronization is canceled, it might not boot. In this case, rerun the failover to complete data synchronization.


## Next steps
After the on-premises VM is replicating to Azure, you can [run another failover](site-recovery-failover.md) to Azure as needed.
