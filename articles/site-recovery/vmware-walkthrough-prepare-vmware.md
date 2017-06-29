---
title: Prepare on-premises VMware resources for replication to Azure with Azure Site Recovery | Microsoft Docs
description: Summarizes the steps you need for replicating workloads running on VMware VMs to Azure storage
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 6aba0e89-ad7c-467e-9db2-cfb3bfe4c7d6
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/27/2017
ms.author: raynew

---
# Step 6: Prepare on-premises VMware replication to Azure

Use the instructions in this article to prepare on-premises VMware servers to interact with Azure Site Recovery, and prepare VMWare VMs for installation of the Mobility service. The Mobility service agent must be installed on all on-premises VMs that you want to replicate to Azure.

## Prepare for automatic discovery

Site Recovery automatically discovers VMs located and vSphere ESXi hosts, and/or managed by vCenter servers.  To do this, Site Recovery needs credentials that can access vCenter servers and vSphere ESXi hosts. Create those as follows:

1. To use a dedicated account, create a role (at the vCenter level, with the permissions described in the table below. Give it a name such as **Azure_Site_Recovery**.
2. Then, create a user on the vSphere host/vCenter server, and assign the role to the user. You specify this user account during Site Recovery deployment.


### VMware account permissions

Site Recovery needs access to VMware for the process server to automatically discover VMs, and for failover and failback of VMs.

- **Migrate**: If you only want to migrate VMware VMs to Azure, without ever failing them back, you can use a VMware account with a read-only role. Such a role can run failover, but can't shut down protected source machines. This isn't necessary for migration.
- **Replicate/Recover**: If you want to deploy full replication (replicate, failover, failback) the account must be able to run operations such as creating and removing disks, powering on VMs etc.
- **Automatic discovery**: At least a read-only account is required.


**Task** | **Required account/role** | **Permissions** | **Details**
--- | --- | --- | ---
**Process server automatically discovers VMware VMs** | You need at least a read-only user | Data Center object –> Propagate to Child Object, role=Read-only | User assigned at datacenter level, and has access to all the objects in the datacenter.<br/><br/> To restrict access, assign the **No access** role with the **Propagate to child** object, to the child objects (vSphere hosts, datastores, VMs and networks).
**Failover** | You need at least a read-only user | Data Center object –> Propagate to Child Object, role=Read-only | User assigned at datacenter level, and has access to all the objects in the datacenter.<br/><br/> To restrict access, assign the **No access** role with the **Propagate to child** object to the child objects (vSphere hosts, datastores, VMs and networks).<br/><br/> Useful for migration purposes, but not full replication, failover, failback.
**Failover and failback** | We suggest you create a role (Azure_Site_Recovery) with the required permissions, and then assign the role to a VMware user or group | Data Center object –> Propagate to Child Object, role=Azure_Site_Recovery<br/><br/> Datastore -> Allocate space, browse datastore, low-level file operations, remove file, update virtual machine files<br/><br/> Network -> Network assign<br/><br/> Resource -> Assign VM to resource pool, migrate powered off VM, migrate powered on VM<br/><br/> Tasks -> Create task, update task<br/><br/> Virtual machine -> Configuration<br/><br/> Virtual machine -> Interact -> answer question, device connection, configure CD media, configure floppy media, power off, power on, VMware tools install<br/><br/> Virtual machine -> Inventory -> Create, register, unregister<br/><br/> Virtual machine -> Provisioning -> Allow virtual machine download, allow virtual machine files upload<br/><br/> Virtual machine -> Snapshots -> Remove snapshots | User assigned at datacenter level, and has access to all the objects in the datacenter.<br/><br/> To restrict access, assign the **No access** role with the **Propagate to child** object, to the child objects (vSphere hosts, datastores, VMs and networks).


## Prepare for push installation of the Mobility service

The Mobility service must be installed on all VMs you want to replicate. There are a number of ways to install the service, including manual installation, push installation from the Site Recovery process server, and installation using methods such as System Center Configuration Manager.

If you want to use push installation, you need to prepare an account that Site Recovery can use to access the VM.

- You can use a domain or local account
- For Windows, if you're not using a domain account, you need to disable Remote User Access control on the local machine. To do this, in the register under **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System**, add the DWORD entry **LocalAccountTokenFilterPolicy**, with a value of 1.
- If you want to add the registry entry for Windows from a CLI, type:
        ``REG ADD HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 1.``
- For Linux, the account should be root on the source Linux server.



## Next steps

Go to [Step 7: Create a vault](vmware-walkthrough-create-vault.md)
