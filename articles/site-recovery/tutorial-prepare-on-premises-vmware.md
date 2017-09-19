---
title: Prepare on-premises VMware servers for disaster recovery of VMware VMs to Azure| Microsoft Docs
description: Learn how to prepare on-premises VMware servers for disaster recovery to Azure using the Azure Site Recovery service.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 90a4582c-6436-4a54-a8f8-1fee806b8af7
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/18/2017
ms.author: raynew

---
# Prepare on-premises VMware servers for disaster recovery to Azure

The [Azure Site Recovery](site-recovery-overview.md) service contributes to your business continuity and disaster recovery (BCDR) strategy by keeping your business apps up and running available during planned and unplanned outages. Site Recovery manages and orchestrates disaster recovery of on-premises machines and Azure virtual machines (VMs), including replication, failover, and recovery.

This tutorial shows you how to prepare your on-premises VMware infrastructure when you want to replicate VMware VMs to Azure. In this tutorial you'll learn how to:

> [!div class="checklist"]
> * Prepare an account on the vCenter server or vSphere ESXi host, to automate VM discovery
> * Prepare an account for automatic installation of the Mobility service on VMware VMs
> * Review VMware server requirements
> * Review VMware VM requirements
> * Figure out capacity requirements

Before you begin, [set up the Azure components](tutorial-prepare-azure.md), including an Azure subscription, Azure storage, and an Azure network.

## Prepare an account for automatic discovery

Site Recovery needs access to VMware servers to:

- Automatically discovers VMs. At least a read-only account is required.
- Orchestrate replication, failover, and failback. You need an account that can run operations such as creating and removing disks, and powering on VMs.

Create the account as follows:

1. To use a dedicated account, create a role at the vCenter level. Give the role a name such as **Azure__Site_Recovery**.
2. Assign the role the permissions summarized in the table below. 
3. Create a user on the vCenter server. or vSphere host. Assign the role to the user. 

### VMware account permissions

**Task** | **Role/Permissions** | **Details** 
--- | --- | --- 
**VM discovery** | At least a read-only user<br/><br/> Data Center object –> Propagate to Child Object, role=Read-only | User assigned at datacenter level, and has access to all the objects in the datacenter.<br/><br/> To restrict access, assign the **No access** role with the **Propagate to child** object, to the child objects (vSphere hosts, datastores, VMs and networks).
**Full replication, failover, failback** |  Create a role (Azure_Site_Recovery) with the required permissions, and then assign the role to a VMware user or group<br/><br/> Data Center object –> Propagate to Child Object, role=Azure_Site_Recovery<br/><br/> Datastore -> Allocate space, browse datastore, low-level file operations, remove file, update virtual machine files<br/><br/> Network -> Network assign<br/><br/> Resource -> Assign VM to resource pool, migrate powered off VM, migrate powered on VM<br/><br/> Tasks -> Create task, update task<br/><br/> Virtual machine -> Configuration<br/><br/> Virtual machine -> Interact -> answer question, device connection, configure CD media, configure floppy media, power off, power on, VMware tools install<br/><br/> Virtual machine -> Inventory -> Create, register, unregister<br/><br/> Virtual machine -> Provisioning -> Allow virtual machine download, allow virtual machine files upload<br/><br/> Virtual machine -> Snapshots -> Remove snapshots | User assigned at datacenter level, and has access to all the objects in the datacenter.<br/><br/> To restrict access, assign the **No access** role with the **Propagate to child** object, to the child objects (vSphere hosts, datastores, VMs and networks).


## Prepare an account for Mobility service installation

The Mobility service must be installed on the VM you want to replicate.
- Site Recovery installs this service automatically when you enable replication for the VM.
- For automatic installation, you need to prepare an account that Site Recovery will use to access the VM.
- You'll specify this account when you set up disaster recovery in the Azure console.

1. Prepare a domain or local account with permissions to install on the VM.
2. To install on Windows VMs, if you're not using a domain account, disable Remote User Access control on the local machine.
    - From the registry, under e register under **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System**, add the DWORD entry **LocalAccountTokenFilterPolicy**, with a value of 1.
    - Using the CLI, type:
        ``REG ADD HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 1.``
3. To install on Linux VMs, prepare a root account on the source Linux server.


## Check VMware server requirements

Make sure VMware servers meet the following requirements.

**Component** | **Requirement**
--- | ---
**vCenter server** | vCenter 6.5, 6.0 or 5.5Windows Server 2016 isn't currently supported.<br/><br/> Linux requirements().
**vSphere host** | vSphere 6.5, 6.0, 5.5

## Check VMware VM requirements

1. For this tutorial, make sure that the VMware VM is running one of the following operating systems: 64-bit Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2 with at least SP1.
2. Make sure that the VM complies with the Azure requirements summarized in the following table.

**Requirement** | **Details**
--- | ---
**Operating system disk size** | Up to 2048 GB.
**Operating system disk count** | 1 
**Data disk count** | 64 or less
**Data disk VHD size** | Up to 4095 GB
**Network adapters** | Multiple adapters are supported
**Shared VHD** | Not supported 
**FC disk** | Not supported 
**Hard disk format** | VHD or VHDX.<br/><br/> Although VHDX isn't currently supported in Azure, Site Recovery automatically converts VHDX to VHD when you fail over to Azure. When you fail back to on-premises VMs continue to use the VHDX format.
**Bitlocker** | Not supported. Disable before you enable replication for a VM.
**VM name** | Between 1 and 63 characters.<br/><br/> Restricted to letters, numbers, and hyphens. The VM name must start and end with a letter or number. 

## Figure out capacity requirements

1. Download the [Deployment Planner tool](https://aka.ms/asr-deployment-planner) for VMware replication. [Learn more](site-recovery-deployment-planner.md) about running the tool.
2. You can use the tool you gather information about compatible and incompatible VMs, disks per VM, and data churn per disk. The tool also covers network bandwidth requirements, and the Azure infrastructure needed for successful replication and test failover.

### Example

Typically, you use the tool to collect profile information about your environment, and generate a profile report. [Learn more](site-recovery-deployment-planner.md#profiling) about profiling and profile parameters.

1. This example shows how to profile VMs for the last 30 days, and find out the throughput from on-premises to Azure.

    ``` ASRDeploymentPlanner.exe -Operation StartProfiling -Directory “E:\vCenter1_ProfiledData” -Server vCenter1.contoso.com -VMListFile “E:\vCenter1_ProfiledData\ProfileVMList1.txt”  -NoOfDaysToProfile  30  -User vCenterUser1 -StorageAccountName  asrspfarm1 -StorageAccountKey Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw== ```
    ```
2. Then, generate a profile report:

    ``` ASRDeploymentPlanner.exe -Operation GenerateReport -Server vCenter1.contoso.com -Directory “\\PS1-W2K12R2\vCenter1_ProfiledData” -VMListFile \\PS1-W2K12R2\vCenter1_ProfiledData\ProfileVMList1.txt ```


## Next steps

[Set up disaster recovery to Azure for VMware VMs](tutorial-vmware-to-azure.md)




