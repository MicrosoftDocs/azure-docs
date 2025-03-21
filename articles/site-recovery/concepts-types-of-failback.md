---
title: Failback during disaster recovery with Azure Site Recovery
description: This article provides an overview of different types of failback and important considerations for failing back to on-premises during disaster recovery with Azure Site Recovery.
ms.service: azure-site-recovery
ms.topic: overview
ms.date: 08/07/2019
ms.author: ankitadutta
author: ankitaduttaMSFT

---

# Failback of VMware virtual machines after disaster recovery to Azure

After failing over to Azure as part of your disaster recovery process, you can fail back to your on-premises site. With Azure Site Recovery, two types of failback are possible: 

- Fail back to the original location 
- Fail back to an alternate location

If you failed over a VMware virtual machine, you can fail back to the same source on-premises virtual machine if it still exists. In this scenario, only the changes are replicated back. This scenario is known as **original location recovery**. If the on-premises virtual machine doesn't exist, the scenario is an **alternate location recovery**.

> [!NOTE]
> You can only fail back to the original vCenter and Configuration server. You can't deploy a new Configuration server and fail back using it. Also, you cannot add a new vCenter to the existing Configuration server and failback into the new vCenter.

## Original Location Recovery (OLR)
If you choose to fail back to the original virtual machine, the following conditions need to be met:

* If the virtual machine is managed by a vCenter server, then the master target's ESX host should have access to the virtual machine's datastore.
* If the virtual machine is on an ESX host but isn’t managed by vCenter, its hard disk must reside in a datastore accessible to the master target's host.
* If your virtual machine is on an ESX host and doesn't use vCenter, then you should complete discovery of the ESX host of the master target before you reprotect. This applies if you're failing back physical servers, too.
* You can fail back to a virtual storage area network (vSAN) or a disk that based on raw device mapping (RDM) if the disks already exist and are connected to the on-premises virtual machine.

> [!IMPORTANT]
> It is important to enable disk.enableUUID= TRUE so that during failback, the Azure Site Recovery service is able to identify the original VMDK on the virtual machine to which the pending changes are written. If this value is not set to be TRUE, then the service tries to identify the corresponding on-premises VMDK on a best effort basis. If the right VMDK is not found, it creates an extra disk and the data gets written on to that.

## Alternate location recovery (ALR)
If the on-premises virtual machine doesn't exist before reprotecting the virtual machine, the scenario is called an alternate location recovery. The reprotected workflow creates the on-premises virtual machine again. This also causes a full data download.

* When you fail back to an alternate location, the virtual machine is recovered to the same ESX host on which the master target server is deployed. The datastore that's used to create the disk is the same datastore that was selected when reprotecting the virtual machine.
* You can fail back only to a virtual machine file system (VMFS) or vSAN datastore. If you have an RDM, reprotect and failback won't work.
* Reprotect involves one large initial data transfer that's followed by the changes. This process exists because the virtual machine doesn't exist on premises. The complete data has to be replicated back. This reprotect also takes more time than an original location recovery.
* You can't fail back to RDM-based disks. Only new virtual machine disks (VMDKs) can be created on a VMFS/vSAN datastore.

> [!NOTE]
> A physical machine, when failed over to Azure, can be failed back only as a VMware virtual machine. This follows the same workflow as the alternate location recovery. Ensure that you discover at least one master target server and the necessary ESX/ESXi hosts to which you need to fail back.

## Next steps

Follow the steps to perform the [failback operation](vmware-azure-failback.md).

