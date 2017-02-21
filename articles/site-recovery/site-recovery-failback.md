---
title: Failback in Site Recovery for Hyper-v virtual machines | Microsoft Docs
description: Azure Site Recovery coordinates the replication, failover and recovery of virtual machines and physical servers. Learn about failback from Azure to on-premises datacenter.
services: site-recovery
documentationcenter: ''
author: ruturaj
manager: gauravd
editor: ''

ms.assetid: 44813a48-c680-4581-a92e-cecc57cc3b1e
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 2/15/2017
ms.author: raynew

---
# Failback in Site Recovery
This article describes how to failback virtual machines protected by Site Recovery. 

## Prerequisites



## Initiate failback
After failover from the primary to secondary location, replicated virtual machines aren't protected by Site Recovery, and the secondary location is now acting as the primary. Follow these procedures to fail back to the original primary site. This procedure describes how to run a planned failover for a recovery plan. Alternatively you can run the failover for a single virtual machine on the **Virtual Machines** tab.

1. Select **Recovery Plans** > *recoveryplan_name*. Click **Failover** > **Planned Failover**.
2. On the **Confirm Planned Failover **page, choose the source and target locations. Note the failover direction. If the failover from primary worked as expect and all virtual machines are in the secondary location this is for information only.
3. If you're failing back from Azure select settings in **Data Synchronization**:

   * **Synchronize data before failover(Synchonize delta changes only)**—This option minimizes downtime for virtual machines as it synchronizes without shutting them down. It does the following:
     * Phase 1: Takes snapshot of the virtual machine in Azure and copies it to the on-premises Hyper-V host. The machine continues running in Azure.
     * Phase 2: Shuts down the virtual machine in Azure so that no new changes occur there. The final set of changes are transferred to the on-premises server and the on-premises virtual machine is started up.

    - **Synchronize data during failover only(full download)**—Use this option if you've been running on Azure for a long time. This option is faster because we expect that most of the disk has changed and we dont want to spend time in checksum calculation. It performs a download of the disk. It is also useful when the on-prem virtual machine has been deleted.

    > [!NOTE] 
    > We recommend you use this option if you've been running Azure for a while (a month or more) or the on-prem VM has been deleted.This option doesn't perform any checksum calculations.
	>
	>


1. If you're failing over to Azure and data encryption is enabled for the cloud, in **Encryption Key** select the certificate that was issued when you enabled data encryption during Provider installation on the VMM server.
2. By default the last recovery point is used, but in **Change Recovery Point** you can specify a different recovery point.
3. Click the checkmark to start the failback.  You can follow the failover progress on the **Jobs** tab.
4. f you selected the option to synchronize the data before the failover, once the initial data synchronization is complete and you're ready to shut down the virtual machines in Azure, click **Jobs** > <planned failover job name> **Complete Failover**. This shuts down the Azure machine, transfers the latest changes to the on-premises virtual machine, and starts it.
5. You can now log onto the virtual machine to validate it's available as expected.
6. The virtual machine is in a commit pending state. Click **Commit** to commit the failover.
7. Now in order to complete the failback click **Reverse Replicate** to start protecting the virtual machine in the primary site.

## Failback to an alternate location
If you've deployed protection between a [Hyper-V site and Azure](site-recovery-hyper-v-site-to-azure.md) you have to ability to failback from Azure to an alternate on-premises location. This is useful if you need to set up new on-premises hardware. Here's how you do it.

1. If you're setting up new hardware install Windows Server 2012 R2 and the Hyper-V role on the server.
2. Create a virtual network switch with the same name that you had on the original server.
3. Select **Protected Items** -> **Protection Group** -> <ProtectionGroupName> -> <VirtualMachineName> you want to fail back, and select **Planned Failover**.
4. In **Confirm Planned Failover** select **Create on-premises virtual machine if it does not exist**.
5. In **Host Name** select the new Hyper-V host server on which you want to place the virtual machine.
6. In Data Synchronization we recommend you select  the option **Synchronize the data before the failover**. This minimizes downtime for virtual machines as it synchronizes without shutting them down. It does the following:

   * Phase 1: Takes snapshot of the virtual machine in Azure and copies it to the on-premises Hyper-V host. The machine continues running in Azure.
   * Phase 2: Shuts down the virtual machine in Azure so that no new changes occur there. The final set of changes are transferred to the on-premises server and the on-premises virtual machine is started up.
7. Click the checkmark to begin the failover (failback).
8. After the initial synchronization finishes and you're ready to shut down the virtual machine in Azure, click **Jobs** > <planned failover job> > **Complete Failover**. This shuts down the Azure machine, transfers the latest changes to the on-premises virtual machine and starts it.
9. You can log onto the on-premises virtual machine to verify everything is working as expected. Then click **Commit** to finish the failover.
10. Click **Reverse Replicate** to start protecting the on-premises virtual machine.

    > [!NOTE]
    > If you cancel the failback job while it is in Data Synchronization step, the on-premises VM will be in a currupted state. This is because Data Synchonization copies the latest data from Azure VM disks to the on-prem data disks, and untill the synchronization completes, the disk data may not be in a consistent state. If the On-prem VM is booted after Data Synchonization is cancelled, it may not boot. Re-trigger failover to complete the Data Synchonization.
    >
    >



## Next Steps
Once you have failed over virtual machines and the on-premises data center is available, you should [re-protect](site-recovery-how-to-reprotect.md) VMware virutal machines back to the on-premises data center.

Use [**Planned failover**](site-recovery-failback.md) option to **Failback** Hyper-v virtual machines back to on-premises from Azure.

If you have failed over a Hyper-v virtual machine to another on-premises data center managed by a VMM server and the primary data center is available then use **Reverse replicate** option to start the replication back to the primary data center. 
