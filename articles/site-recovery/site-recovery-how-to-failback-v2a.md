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
This articles describes how to fail back Azure virtual machines from Azure to the on-premises site. Follow the instructions in this article when you're ready to fail back your VMware virtual machines or Windows/Linux physical servers after they've failed over from the on-premises site to Azure using this [tutorial](site-recovery-vmware-to-azure-classic.md).

## Overview
Here’s how failback works:

* After you’ve failed over to Azure, you fail back to your on-premises site in a few stages:
  * **Stage 1**: You reprotect the Azure VMs so that they start replicating back to VMware VMs running in your on-premises site. Read more about [how to reprotect](site-recovery-how-to-reprotect.md).
  * **Stage 2**: After your Azure VMs are replicating to your on-premises site, you run a fail over to fail back from Azure.
  * **Stage 3**: After your data has failed back, you reprotect the on-premises VMs that you failed back to, so that they start replicating to Azure.

### Failback to the original or alternate location

	
If you failed over a VMware VM you can fail back to the same source VM if it still exists on-premises. In this scenario only the delta changes will be failed back. This is known as original location recovery.

* If you fail back to the original VM the following is required:
  
  * If the VM is managed by a vCenter server then the Master Target's ESX host should have access to the VMs datastore.
  * If the VM is on an ESX host but isn’t managed by vCenter then the hard disk of the VM must be in a datastore accessible by the MT's host.
  * If your VM is on an ESX host and doesn't use vCenter then you should complete discovery of the ESX host of the MT before you reprotect. This applies if you're failing back physical servers too.
  * Another option (if the on-premises VM exists) is to delete it before you do a failback. Then failback will then create a new VM on the same host as the master target ESX host.
  
If the on-premises VM does not exist before reprotecting the VM, then it is called alternate location recovery. Here the reprotect workflow will re-create the on-premises VM.

* When you failback to an alternate location the data will be recovered to the same datastore and the same ESX host as that used by the on-premises master target server.

A physical machine when failed over to Azure can only be failback as a VMware virtual machine (also referred to as P2A2V). This flow falls under the alternate location recovery.

* A Windows Server 2008 R2 SP1 machine if protected and failed over to Azure cannot be failed back.
* Ensure that you discover at least one Master Target server along with the necessary ESX/ESXi hosts to which you need to failback.


## Pre-requisites

* You'll need a VMware environment in order to fail back VMware VMs and physical servers. Failing back to a physical server isn’t supported.
* In order to fail back you should have created an Azure network when you initially set up protection. Failback needs a VPN or ExpressRoute connection from the Azure network in which the Azure VMs are located to the on-premises site.
* If the VMs you want to fail back to are managed by a vCenter server, you'll need to make sure you have the required permissions for discovery of VMs on vCenter servers. [Read more](site-recovery-vmware-to-azure-classic.md#vmware-permissions-for-vcenter-access).
* If snapshots are present on a VM then reprotection will fail. You can delete the snapshots or the disks.
* Before you fail back you’ll need to create a number of components:
  * **Create a process server in Azure**. This is an Azure VM that you’ll need to create and keep running during failback. You can delete the machine after failback is complete.
  * **Create a master target server**: The master target server sends and receives failback data. The management server you created on-premises has a master target server installed by default. However, depending on the volume of failed back traffic you might need to create a separate master target server for failback.
  * if you want to create an additional master target server running on Linux, you’ll need to set up the Linux VM before you install the master target server, as described below.
* Configuration server is required on-premises when you do a failback. During failback, the virtual machine must exist in the Configuration server database, failing which failback won't be successful. Hence ensure that you take regular scheduled backup of your server. In case of a disaster, you will need to restore it with the same IP address so that failback will work.
* Ensure that you set the disk.enableUUID=true setting in Configuration Parameters of the Master target VM in VMware. If this row does not exist, add it. This is required to provide a consistent UUID to the VMDK so that it mounts correctly.
* **Master target server cannot be storage vMotioned**. This can cause the failback to fail. The VM will not come up since the disks will not be made available to it.
* You need a new drive added onto the Master target server. This drive is called a retention drive. Add a new disk and format the drive.


## Steps to failback

You fail over virtual machines to a secondary on-premises site or to Azure, depending on your deployment. 

* **Route client requests**—Site Recovery works with Azure Traffic Manager to route client requests to your application after failover.

## Common issues
## Next steps
 T
