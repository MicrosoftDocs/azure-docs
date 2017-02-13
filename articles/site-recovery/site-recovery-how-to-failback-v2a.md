---
title: Hot to Failback from Azure to On-premises | Microsoft Docs
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
ms.date: 12/15/2016
ms.author: ruturajd

---
# Failback from Azure to On-premises
This article describes how to fail back Azure virtual machines from Azure to the on-premises site. Follow the instructions in this article, when you're ready to fail back your VMware virtual machines or Windows/Linux physical servers, after they've failed over from the on-premises site to Azure using this [tutorial](site-recovery-vmware-to-azure-classic.md).

## Overview
Here’s how failback works:

* After you’ve failed over to Azure, you fail back to your on-premises site in a few stages:
  * **Stage 1**: You reprotect the Azure VMs so that they start replicating back to VMware VMs running in your on-premises site. For this you also need to 
		1. Setup an on-premises Master target
		2. Setup a Process server
		3. And then initiate Reprotect
  * **Stage 2**: After your Azure VMs are replicating to your on-premises site, you run a fail over to fail back from Azure.
  * **Stage 3**: After your data has failed back, you reprotect the on-premises VMs that you failed back to, so that they start replicating to Azure.

### Failback to the original or alternate location

	
If you failed over a VMware VM, you can fail back to the same source VM if it still exists on-premises. In this scenario only the delta changes are replicated back. This scenario is known as original location recovery.

* If you fail back to the original VM the following conditions required:
  * If the VM is managed by a vCenter server then the Master Target's ESX host should have access to the VMs datastore.
  * If the VM is on an ESX host but isn’t managed by vCenter, then the hard disk of the VM must be in a datastore accessible by the MT's host.
  * If your VM is on an ESX host and doesn't use vCenter, then you should complete discovery of the ESX host of the MT before you reprotect. This applies if you're failing back physical servers too.

  
If the on-premises VM does not exist before reprotecting the VM, then it is called alternate location recovery. Here the reprotect workflow re-creates the on-premises VM.

* When you failback to an alternate location the VM will be recovered to the same ESX host as on which the master target server is deployed. The datastore used to create the disk will be the same datastore selected when reprotecting the VM.
* You can only failback to a VMFS datastore. If you have a vSAN or RDM, Reprotect and Failback will not work.
* Reprotect involves one large initial data transfer followed by the delta changes. This is because the VM does not exist on-premises, the complete data needs to be replicated back. This reprotect will also take more time than the original location recovery.

A physical machine when failed over to Azure can only be failed back as a VMware virtual machine (also referred to as P2A2V). This flow falls under the alternate location recovery.

* A Windows Server 2008 R2 SP1 machine if protected and failed over to Azure cannot be failed back.
* Ensure that you discover at least one Master Target server along with the necessary ESX/ESXi hosts to which you need to failback.


## Pre-requisites

* If the VMs you want to fail back to are managed by a vCenter server, you need to make sure you have the required permissions for discovery of VMs on vCenter servers. [Read more](site-recovery-vmware-to-azure-classic.md#vmware-permissions-for-vcenter-access).
* If snapshots are present on the on-premises VM, then reprotection will fail. You can delete the snapshots before proceeding to reprotect.
* Before you fail back you’ll need to create two additional components:
  * **Create a process server**. Process server is used to receive the data from the protected VM in Azure and send the data on-premises. This requires it to be on a low latency network between the process server and the protected VM. Hence the process server can be on-premises (if you are using an express route connection) or on Azure if you are using a VPN.
  * **Create a master target server**: The master target server receives failback data. The management server you created on-premises has a master target server installed by default. However, depending on the volume of failed back traffic you might need to create a separate master target server for failback. 
		* A linux VM needs a Linux master target server. 
		* A windows VM needs a windows master target.
* Configuration server is required on-premises when you do a failback. During failback, the virtual machine must exist in the Configuration server database, failing which failback won't be successful. Hence ensure that you take regular scheduled backup of your server. If there was a disaster, you will need to restore it with the same IP address so that failback works.
* Ensure that you set the disk.enableUUID=true setting in Configuration Parameters of the Master target VM in VMware. If this row does not exist, add it. This is required to provide a consistent UUID to the VMDK so that it mounts correctly.
* **Master target server cannot be storage vMotioned**. This can cause the failback to fail. The VM will not come up since the disks will not be made available to it.
* You need a new drive added onto the Master target server. This drive is called a retention drive. Add a new disk and format the drive.


## Steps to failback

Before initiating failback, **ensure that you have completed the reprotection of the virtual machines**. The virtual machines should be in protected state with their health as OK. To Reprotect the virtual machines, read more on [how to reprotect](site-recovery-how-to-reprotect.md).


1. In the replicated items page select the virtual machine and right click to select **Unplanned Failover**.
2. In **Confirm Failover** verify the failover direction (from Azure) and select the recovery point you want to use for the failover (latest, or the latest app consistent). App consistent point would be behind the latest point in time and causes some data loss.
3. During failover Site Recovery will shut down the Azure VMs. After you check that failback has completed as expected, you can check that the Azure VMs have been shut down.

## Next steps

After failback completes, you will need to commit the virtual machine to ensure the VMs recovered in Azure are deleted.

1. Right click the protected item and click Commit. A job will trigger that will remove the failed over virtual machines in Azure.

After commit completes your VM will be back on the on-premises site, but won’t be protected. To start replicating to Azure again do the following:

1. In the Vault > Setting > Replicated items, select the VMs that have failed back and click **Re-Protect**.
2. Give the value of Process server that needs to be used to send data back to Azure.
3. Click OK to begin the re-protect job.

Once the reprotect job completes, the VM is replicating back to Azure and you can do a failover.

## Common issues


