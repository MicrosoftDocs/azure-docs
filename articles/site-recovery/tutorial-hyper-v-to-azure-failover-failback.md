---
title: Fail over and fail back Hyper-V VMs replicated to Azure with Site Recovery | Microsoft Docs
description: Learn how to fail over Hyper-V VMs to Azure, and fail back to the on-premises site, with Azure Site Recovery
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 72065d01-ed0f-430e-b117-a5885cecd1db
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 09/15/2017
ms.author: raynew

---

# Fail over and fail back Hyper-V VMs replicated to Azure

The [Azure Site Recovery](site-recovery-overview.md) service manages and orchestrates replication, failover, and failback of on-premises machines, and Azure virtual machines (VMs).

This tutorial describes how to fail over a Hyper-V VM to Azure. After you've failed over, you fail back to your on-premises site when it's available. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Fail over Hyper-V VMs from on-premises to Azure
> * Fail back from Azure to on-premises, and start replicating to Azure again

## Overview
Failover and failback has two stages:

1. **Fail over to Azure**: Fail machines over from the on-premises site to Azure.
2. **Fail back from Azure to on-premises**: Run a planned failover from Azure to on-premises. After the planned failover, you enable reverse replication, to start replicating from on-premises to Azure again. 


## Fail over to Azure

### Failover prerequisites

To complete failover:

- Make sure you've completed a [disaster recovery drill](tutorial-dr-drill-azure.md) to check that everything's working as expected.
- Optionally prepare to connect to Azure VMs before you fail over.
- Verify the VM properties before you run the failover.

#### Prepare to connect to Azure VMs after failover

If you want to connect to Azure VMs using RDP after failover, do the following:

##### Azure VMs running Windows

1. To access Azure VMs over the internet, enable RDP on the on-premises VM before failover. Make sure that TCP, and UDP rules are added for the **Public** profile, and that RDP is allowed in **Windows Firewall** > **Allowed Apps** for all profiles.
2. To access over site-to-site VPN, enable RDP on the on-premises machine. RDP should be allowed in the **Windows Firewall** -> **Allowed apps and features** for **Domain and Private** networks. Check that the operating system's SAN policy is set to **OnlineAll**. [Learn more](https://support.microsoft.com/kb/3031135). There should be no Windows updates pending on the VM when you trigger a failover. If there are, you won't be able to log in to the virtual machine until the update completes. 
3. On the Windows Azure VM after failover, check **Boot diagnostics** to view a screenshot of the VM. If you can't connect, check that the VM is running and review these [troubleshooting tips](http://social.technet.microsoft.com/wiki/contents/articles/31666.troubleshooting-remote-desktop-connection-after-failover-using-asr.aspx).


##### Azure VMs running Linux

1. On the on-premises machine before failover, check that the Secure Shell service is set to start automatically on system boot. Check that firewall rules allow an SSH connection.
2. On the Azure VM after failover, allow incoming connections to the SSH port for the network security group rules on the failed over VM, and for the Azure subnet to which it's connected.  [Add a public IP address](site-recovery-monitoring-and-troubleshooting.md#adding-a-public-ip-on-a-resource-manager-virtual-machine) for the VM. You can check **Boot diagnostics** to view a screenshot of the VM.


#### Verify VM properties

Verify the VM properties, and make sure that the VM complies with [Azure requirements](site-recovery-support-matrix-to-azure.md#failed-over-azure-vm-requirements).

1. In **Protected Items**, click **Replicated Items** > VM.
2. In the **Replicated item** pane, there's a summary of VM information, health status, and the latest available recovery points. Click **Properties** to view more details.
3. In **Compute and Network**, you can modify the Azure name, resource group, target size, [availability set](../virtual-machines/windows/tutorial-availability-sets.md), and [managed disk settings](#managed-disk-considerations)
4. You can view and modify network settings, including the network/subnet in which the Azure VM will be located after failover, and the IP address that will be assigned to it.
5. In **Disks**, you can see information about the operating system and data disks on the VM.


### Run a failover from on-premises to Azure

You can run a regular or planned failover for Hyper-V VMs

- Use a regular failover for unexpected outages. When you run this failover, Site Recovery creates an Azure VM, and powers it up. You run the failover against a specific recovery point. Data loss can occur depending on the recovery point you use.
- A planned failover can be used for maintenance, or during expected outage. This option provides zero data loss. When a planned failover is triggered, the source VMs are shut down. Unsynchronized data is synchronized, and the failover is triggered.

This procedure describes how to run a regular failover.


1. In **Settings** > **Replicated items** click the VM > **Failover**.
2. In **Failover** select a **Recovery Point** to fail over to. You can use one of the following options:
	- **Latest** (default): This option first processes all the data sent to Site Recovery. It provides the lowest RPO (Recovery Point Objective) because the Azure VM created after failover has all the data that was replicated to Site Recovery when the failover was triggered.
	- **Latest processed**: This option fails over the VM to the latest recovery point processed by Site Recovery. This option provides a low RTO (Recovery Time Objective), because no time is spent processing unprocessed data.
	- **Latest app-consistent**: This option fails over the VM to the latest app-consistent recovery point processed by Site Recovery. 
	- **Custom**: Specify a recovery point.
3. If you're failing over Hyper-V VMs in System Center VMM clouds, to Azure, and data encryption is enabled for the cloud, in **Encryption Key**, select the certificate that was issued when you enabled data encryption during Provider setup on the VMM server..
4. Select **Shut down machine before beginning failover** if you want Site Recovery to attempt to do a shutdown of source virtual machines before triggering the failover. Site Recovery will also try to synchronize on-premises data that hasn't yet been sent to Azure, before triggering the failover. Note that failover continues even if shutdown fails. You can follow the failover progress on the **Jobs** page.
5. If you prepared to connect to the Azure VM, connect to validate it after the failover.
6. After you verify, **Commit** the failover. This deletes all the available recovery points.

> [!WARNING]
> **Don't cancel a failover in progress**: Before failover is started, VM replication is stopped. If you cancel a failover in progress, failover stops, but the VM won't replicate again.  


## Fail back from Azure to on-premises

### Prerequisites for failback

To complete failback, make sure that the primary site VMM server/Hyper-V server is connected to Site Recovery.


### Run a failback and reprotect on-premises VMs

Fail over from Azure to the on-premises site, and start replicating VMs from the on-premises site to Azure.

1. In **Settings** > **Replicated items** click the VM > **Planned Failover**.
2. In **Confirm Planned Failover**, verify the failover direction (from Azure), and select the source and target locations. 
3. In **Data Synchronization**, specify how you want to synchronize:
    - **Synchronize data before failover (synchronize delta changes only)**—This option minimizes VM downtime because it synchronizes without shutting down the VM. Here's what it does:
        1. Takes a snapshot of the Azure VM, and copies it to the on-premises Hyper-V host. The VM keeps running in Azure.
        2. Shuts down the Azure VM, so that no new changes occur there. The final set of delta changes are transferred to the on-premises server, and the on-premises VM is started.
    - **Synchronize data during failover only (full download)**—Use this option if you've been running in Azure for a long time. This option is faster, because we expect multiple disk changes, and don't spend time on checksum calculations. This option performs a disk download. It's also useful when the on-premises VM has been deleted.
4. If you're failing over Hyper-V VMs in System Center VMM clouds, to Azure, and data encryption is enabled for the cloud, in **Encryption Key**, select the certificate that was issued when you enabled data encryption during Provider setup on the VMM server.
5. Initiate the failover. You can follow the failover progress on the **Jobs** tab.
6. If you selected to synchronize data before the failover, after the initial data synchronization is done and you're ready to shut down the Azure VMs click **Jobs** > planned failover job name > **Complete Failover**. This shuts down the Azure VM, transfers the latest changes on-premises, and starts the on-premises VM.
7. Log on to the on-premises VM to check it's available as expected.
8. The on-premises VM is now in a Commit Pending state. Click **Commit**, to commit the failover. This deletes the Azure VMs and its disks, and prepares the on-premises VM for reverse replication.
9. To start replicating the on-premises VM to Azure, enable **Reverse Replicate**.


> [!NOTE]
> Reverse replication only replicates changes that have occurred since the Azure VM was turned off, and only delta changes are sent.

