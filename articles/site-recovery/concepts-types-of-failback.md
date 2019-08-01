---
title: Failback during disaster recovery with Azure Site Recovery | Microsoft Docs
description: This article provides an overview of various types of failback and caveats to be considered while failing back to on-premises during disaster recovery with the Azure Site Recovery service.
services: site-recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 05/19/2019
ms.author: raynew
---

# Failback after disaster recovery of VMware VMs

After you have failed over to Azure as part of your disaster recovery process, you can fail back to your on-premises site. There are two different types of failback that are possible with Azure Site Recovery: 

- Fail back to the original location 
- Fail back to an alternate location

If you failed over a VMware virtual machine, you can fail back to the same source on-premises virtual machine if it still exists. In this scenario, only the changes are replicated back. This scenario is known as **original location recovery**. If the on-premises virtual machine does not exist, the scenario is an **alternate location recovery**.

> [!NOTE]
> You can only fail back to the original vCenter and Configuration server. You cannot deploy a new Configuration server and fail back using it. Also, you cannot add a new vCenter to the existing Configuration server and failback into the new vCenter.

## Original Location Recovery (OLR)
If you choose to fail back to the original virtual machine, the following conditions need to be met:

* If the virtual machine is managed by a vCenter server, then the master target's ESX host should have access to the virtual machine's datastore.
* If the virtual machine is on an ESX host but isn’t managed by vCenter, then the hard disk of the virtual machine must be in a datastore that the master target's host can access.
* If your virtual machine is on an ESX host and doesn't use vCenter, then you should complete discovery of the ESX host of the master target before you reprotect. This applies if you're failing back physical servers, too.
* You can fail back to a virtual storage area network (vSAN) or a disk that based on raw device mapping (RDM) if the disks already exist and are connected to the on-premises virtual machine.

> [!IMPORTANT]
> It is important to enable disk.enableUUID= TRUE so that during failback, the Azure Site Recovery service is able to identify the original VMDK on the virtual machine to which the pending changes will be written. If this value is not set to be TRUE, then the service tries to identify the corresponding on-premises VMDK on a best effort basis. If the right VMDK is not found, it creates an extra disk and the data gets written on to that.

## Alternate location recovery (ALR)
If the on-premises virtual machine does not exist before reprotecting the virtual machine, the scenario is called an alternate location recovery. The reprotect workflow creates the on-premises virtual machine again. This will also cause a full data download.

* When you fail back to an alternate location, the virtual machine is recovered to the same ESX host on which the master target server is deployed. The datastore that's used to create the disk will be the same datastore that was selected when reprotecting the virtual machine.
* You can fail back only to a virtual machine file system (VMFS) or vSAN datastore. If you have an RDM, reprotect and failback will not work.
* Reprotect involves one large initial data transfer that's followed by the changes. This process exists because the virtual machine does not exist on premises. The complete data has to be replicated back. This reprotect will also take more time than an original location recovery.
* You cannot fail back to RDM-based disks. Only new virtual machine disks (VMDKs) can be created on a VMFS/vSAN datastore.

> [!NOTE]
> A physical machine, when failed over to Azure, can be failed back only as a VMware virtual machine. This follows the same workflow as the alternate location recovery. Ensure that you discover at least one master target server and the necessary ESX/ESXi hosts to which you need to fail back.

## Next steps

Follow the steps to perform the [failback operation](vmware-azure-failback.md).

