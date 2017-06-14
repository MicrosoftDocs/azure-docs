---
title: How to Failback from Azure to Hyper-v | Microsoft Docs
description: After failover of VMs to Azure, you can initiate a failback to bring VMs back to on-premises. Learn the steps how to failback.
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
ms.workload: 
ms.date: 02/13/2017
ms.author: ruturajd

---
# Failback from Azure to on-premises
This article describes how to fail back Azure virtual machines from Azure to the on-premises site. Follow the instructions in this article, when you're ready to fail back your VMware virtual machines or Windows/Linux physical servers, after they've failed over from the on-premises site to Azure using this [tutorial](site-recovery-vmware-to-azure-classic.md).

## Overview of failback
Here’s how failback works - After you’ve failed over to Azure, you fail back to your on-premises site in a few stages:

1. [Reprotect](site-recovery-how-to-reprotect.md) the Azure VMs so that they start replicating back to VMware VMs running in your on-premises site. For this you also need to 
	1. Setup an on-premises Master target - Windows MT for Windows VMs and [Linux MT](site-recovery-how-to-install-linux-master-target.md) for Linux VMs
	2. Setup a [Process server](site-recovery-vmware-setup-azure-ps-resource-manager.md)
	3. And then initiate [Reprotect](site-recovery-how-to-reprotect.md)
5. After your Azure VMs are replicating to your on-premises site, you initiate a fail over from Azure to On-premises.
  
After your data has failed back, you reprotect the on-premises VMs that you failed back to, so that they start replicating to Azure.

For a quick video overview, you can also go through the video here.
> [!VIDEO https://channel9.msdn.com/Series/Azure-Site-Recovery/VMware-to-Azure-with-ASR-Video5-Failback-from-Azure-to-On-premises/player]

### Failback to the original or alternate location
	
If you failed over a VMware VM, you can fail back to the same source VM if it still exists on-premises. In this scenario only the delta changes are replicated back. This scenario is known as original location recovery. If the on-premises VM does not exist, it is an alternate location recovery.

#### Original location recovery

If you fail back to the original VM the following conditions required:
* If the VM is managed by a vCenter server then the Master Target's ESX host should have access to the VMs datastore.
* If the VM is on an ESX host but isn’t managed by vCenter, then the hard disk of the VM must be in a datastore accessible by the MT's host.
* If your VM is on an ESX host and doesn't use vCenter, then you should complete discovery of the ESX host of the MT before you reprotect. This applies if you're failing back physical servers too.
* You can failback to a vSAN or RDM based disks if the disks already exist and are connected to the on-premises VM.

#### Alternate location recovery
If the on-premises VM does not exist before reprotecting the VM, then it is called alternate location recovery. Here the reprotect workflow re-creates the on-premises VM. This will also cause a full data download.

* When you failback to an alternate location the VM will be recovered to the same ESX host as on which the master target server is deployed. The datastore used to create the disk will be the same datastore selected when reprotecting the VM.
* You can only failback to a VMFS datastore. If you have a vSAN or RDM, Reprotect and Failback will not work.
* Reprotect involves one large initial data transfer followed by the delta changes. This is because the VM does not exist on-premises, the complete data needs to be replicated back. This reprotect will also take more time than the original location recovery.
* You cannot failback to a vSAN or RDM based disks. Only new VMDK's can be created on a VMFS datastore.

A physical machine when failed over to Azure can only be failed back as a VMware virtual machine (also referred to as P2A2V). This flow falls under the alternate location recovery.

* A Windows Server 2008 R2 SP1 machine if protected and failed over to Azure cannot be failed back.
* Ensure that you discover at least one Master Target server along with the necessary ESX/ESXi hosts to which you need to failback.

## Have you completed Reprotection?
Before you proceed further, complete the Reprotect steps so that the virtual machines are in replicated state and you can initiate a failover back to on-premises.
[How to Reprotect from Azure to On-premises](site-recovery-how-to-reprotect.md).

## Pre-requisites
 
* Configuration server is required on-premises when you do a failback. During failback, the virtual machine must exist in the Configuration server database, failing which failback won't be successful. Hence ensure that you take regular scheduled backup of your server. If there was a disaster, you will need to restore it with the same IP address so that failback works.
* Master target server should not have any snapshots before triggering failback.

## Steps to failback

Before initiating failback, **ensure that you have completed the reprotection of the virtual machines**. The virtual machines should be in protected state with their health as OK. To Reprotect the virtual machines, read more on [how to reprotect](site-recovery-how-to-reprotect.md).

1. In the replicated items page select the virtual machine and right click to select **Unplanned Failover**.
2. In **Confirm Failover** verify the failover direction (from Azure) and select the recovery point you want to use for the failover (latest, or the latest app consistent). App consistent point would be behind the latest point in time and causes some data loss.
3. During failover Site Recovery will shut down the Azure VMs. After you check that failback has completed as expected, you can check that the Azure VMs have been shut down.

### To what recovery point can I failback the VMs to?

During failback, you have two options to failback the VM/Recovery plan.

If you select the the latest processed point in time, all virtual machines will be failed over to their latest available point in time. In case there is a replication group within the recovery plan, then each VM of the replication group will fail over to its independent latest point in time.

You cannot failback a VM untill it has atleast one recovery point. You cannot failback a recovery plan untill all its VMs have atleast one recovery point.

> [!NOTE]
> A latest recovery point is a crash consistent recovery point.

If you select the application consistent recovery point, a single VM failback will recover to its latest available application consistent recovery point. In case of a recovery plan with a replication group, each replication group will recover to ts common available recovery point.
Note that application consistent recovery points can be behind in time and there might be loss in data.

## Next steps

After failback completes, you will need to commit the virtual machine to ensure the VMs recovered in Azure are deleted.

### Commit
Commit is required to remove the failed over virtual machine from Azure.
Right click the protected item and click Commit. A job will trigger that will remove the failed over virtual machines in Azure.

### Reprotect from on-premises to Azure

After commit completes your VM will be back on the on-premises site, but won’t be protected. To start replicating to Azure again do the following:

1. In the Vault > Setting > Replicated items, select the VMs that have failed back and click **Re-Protect**.
2. Give the value of Process server that needs to be used to send data back to Azure.
3. Click OK to begin the re-protect job.

> [!NOTE]
> After a VM boots up on-premises, it takes some time for the agent to register back to the configuration server (upto 15 mins). During this time you will find reprotect to fail and the error message stating that the agent is not installed. Wait for a few minutes and then try Reprotect again.

Once the reprotect job completes, the VM is replicating back to Azure and you can do a failover.

## Common issues
* Make sure that the vCenter is in a connected state before you do a failback, else the disconnecting the disks and attaching it back to the VM will fail.

