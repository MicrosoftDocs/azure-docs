---
title: Run a failback during disaster of  Hyper-v VMs from Azure to on-premises | Microsoft Docs
description: Learn how to fail back Hyper-V VMs to an on-premises site during disaster recovery to Azure with the Azure Site Recovery service.
services: site-recovery
author: rajani-janaki-ram
manager: gauravd
ms.service: site-recovery
ms.topic: article
ms.date: 11/27/2018
ms.author: rajanaki

---

# Run a failback for Hyper-V VMs

This article describes how to fail back Hyper-V virtual machines protected by Site Recovery.

## Prerequisites
1. Ensure that you have read the details about the [different types of failback](concepts-types-of-failback.md) and corresponding caveats.
1. Ensure that the primary site VMM server or Hyper-V host server is connected to Azure.
2. You should have performed **Commit** on the virtual machine.

## Perform failback
After failover from the primary to secondary location, replicated virtual machines aren't protected by Site Recovery, and the secondary location is now acting as the active location. To fail back VMs in a recovery plan, run a planned failover from the secondary site to the primary, as follows. 
1. Select **Recovery Plans** > *recoveryplan_name*. Click **Failover** > **Planned Failover**.
2. On the **Confirm Planned Failover** page, choose the source and target locations. Note the failover direction. If the failover from primary worked as expect and all virtual machines are in the secondary location this is for information only.
3. If you're failing back from Azure select settings in **Data Synchronization**:
	- **Synchronize data before failover(Synchronize delta changes only)**—This option minimizes downtime for virtual machines as it synchronizes without shutting them down. It does the following steps:
		- Phase 1: Takes snapshot of the virtual machine in Azure and copies it to the on-premises Hyper-V host. The machine continues running in Azure.
		- Phase 2: Shuts down the virtual machine in Azure so that no new changes occur there. The final set of delta changes is transferred to the on-premises server and the on-premises virtual machine is started up.

	- **Synchronize data during failover only(full download)**—This option is faster.
		- This option is faster because we expect that most of the disk has changed and we don't want to spend time in checksum calculation. It performs a download of the disk. It is also useful when the on-prem virtual machine has been deleted.
		- We recommend you use this option if you've been running Azure for a while (a month or more) or the on-prem virtual machine has been deleted. This option doesn't perform any checksum calculations.


4. If data encryption is enabled for the cloud, in **Encryption Key** select the certificate that was issued when you enabled data encryption during Provider installation on the VMM server.
5. Initiate the failover. You can follow the failover progress on the **Jobs** tab.
6. If you selected the option to synchronize the data before the failover, once the initial data synchronization is complete and you're ready to shut down the virtual machines in Azure, click **Jobs** > job name > **Complete Failover**. This shuts down the Azure machine, transfers the latest changes to the on-premises virtual machine, and starts the VM on-premises.
7. You can now log into the virtual machine to validate it's available as expected.
8. The virtual machine is in a commit pending state. Click **Commit** to commit the failover.
9. To complete the failback, click **Reverse Replicate** to start protecting the virtual machine in the primary site.


Follow these procedures to fail back to the original primary site. This procedure describes how to run a planned failover for a recovery plan. Alternatively you can run the failover for a single virtual machine on the **Virtual Machines** tab.


## Failback to an alternate location in Hyper-V environment
If you've deployed protection between a [Hyper-V site and Azure](site-recovery-hyper-v-site-to-azure.md) you have to ability to failback from Azure to an alternate on-premises location. This is useful if you need to set up new on-premises hardware. Here's how you do it.

1. If you're setting up new hardware install Windows Server 2012 R2 and the Hyper-V role on the server.
2. Create a virtual network switch with the same name that you had on the original server.
3. Select **Protected Items** -> **Protection Group** -> \<ProtectionGroupName> -> \<VirtualMachineName> you want to fail back, and select **Planned Failover**.
4. In **Confirm Planned Failover** select **Create on-premises virtual machine if it does not exist**.
5. In Host Name,** select the new Hyper-V host server on which you want to place the virtual machine.
6. In Data Synchronization, we recommend you select  the option to synchronize the data before the failover. This minimizes downtime for virtual machines as it synchronizes without shutting them down. It does the following:

	- Phase 1: Takes snapshot of the virtual machine in Azure and copies it to the on-premises Hyper-V host. The machine continues running in Azure.
	- Phase 2: Shuts down the virtual machine in Azure so that no new changes occur there. The final set of changes is transferred to the on-premises server and the on-premises virtual machine is started up.
	
7. Click the checkmark to begin the failover (failback).
8. After the initial synchronization finishes and you're ready to shut down the virtual machine in Azure, click **Jobs** > \<planned failover job> > **Complete Failover**. This shuts down the Azure machine, transfers the latest changes to the on-premises virtual machine, and starts it.
9. You can log into the on-premises virtual machine to verify everything is working as expected. Then click **Commit** to finish the failover. Commit deletes the Azure virtual machine and its disks and prepares the VM to be protected again.
10. Click **Reverse Replicate** to start protecting the on-premises virtual machine.

    > [!NOTE]
    > If you cancel the failback job while it is in Data Synchronization step, the on-premises VM will be in a corrupted state. This is because Data Synchronization copies the latest data from Azure VM disks to the on-prem data disks, and until the synchronization completes, the disk data may not be in a consistent state. If the On-prem VM is booted after Data Synchronization is canceled, it may not boot. Retrigger failover to complete the Data Synchronization.


## Why is there no button called failback?
On the portal, there is no explicit gesture called failback. Failback is a step where you come back to the primary site. By definition, failback is when you failover the virtual machines from recovery back to primary.

When you initiate a failover, the blade informs you about the direction in which the virtual machines is to be moved, if the direction is from Azure to On-premises, it is a failback.

## Why is there only a planned failover gesture to failback?
Azure is a highly available environment and your virtual machines are always available. Failback is a planned activity where you decide to take a small downtime so that the workloads can start running on-premises again. This expects no data loss. Hence only a planned failover gesture is available, that will turn off the VMs in Azure, download the latest changes and ensure there is no data loss.

## Do I need a process server in Azure to failback to Hyper-v?
No, a process server is required only when you are protecting VMware virtual machines. No additional components are required to be deployed when protecting/failback of Hyper-v virtual machines.


## Time taken to failback
The time taken to complete the data synchronization and boot the virtual machine depends on various factors. To give an insight into the time taken, we explain what happens during data synchronization.

Data synchronization takes a snapshot of the virtual machine's disks and starts checking block by block and calculates its checksum. This calculated checksum is sent to on-premises to compare with the on-premises checksum of the same block. In case the checksums match, the data block is not transferred. If it does not match, the data block is transferred to on-premises. This transfer time depends on the bandwidth available. The speed of the checksum is a few GBs per min. 

To speed up the download of data, you can configure your MARS agent to use more threads to parallelize the download. Refer to the [document here](https://support.microsoft.com/en-us/help/3056159/how-to-manage-on-premises-to-azure-protection-network-bandwidth-usage) on how to change the download threads in the agent.


## Next Steps

After **Commit**, you can initiate the *Reverse Replicate*. This starts protecting the virtual machine from on-premises back to Azure. This will only replicate the changes since the VM has been turned off in Azure and hence sends differential changes only.
