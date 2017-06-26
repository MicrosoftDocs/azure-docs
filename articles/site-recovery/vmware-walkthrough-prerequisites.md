---
title: Prerequisites for VMware to Azure replication using Azure Site Recovery | Microsoft Docs
description: Summarizes the prerequisites for replicating workloads running on VMware VMs to Azure, using the Azure Site Recovery service.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 318156ba-793b-48d0-98d4-cc5436bf28a3
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 06/13/2017
ms.author: raynew
---

# Step 2: Review the prerequisites for VMware to Azure replication


**Prerequisite** | **Details**
--- | ---
**Azure** | Learn about [Azure requirements](site-recovery-prereq.md#azure-requirements)
**On-premises configuration server** | You need a VMware VM running Windows Server 2012 R2 or later. You set up this server during Site Recovery deployment.<br/><br/> By default the process server and master target server are also installed on this VM. When you scale up, you might need a separate process server, and it has the same requirements as the configuration server.<br/><br/> Learn more about these components [here](site-recovery-set-up-vmware-to-azure.md#configuration-server-minimum-requirements)
**On-premises VMware servers** | One or more VMware vSphere servers, running 6.0, 5.5, 5.1 with latest updates. Servers should be located in the same network as the configuration server (or separate process server).<br/><br/> We recommend a vCenter server to manage hosts, running 6.0 or 5.5 with the latest updates. Only features that are available in 5.5 are supported when you deploy version 6.0.
**On-premises VMs** | VMs you want to replicate should be running a [supported operating system](site-recovery-support-matrix-to-azure.md#support-for-replicated-machine-os-versions), and conform with [Azure prerequisites](site-recovery-support-matrix-to-azure.md#failed-over-azure-vm-requirements). VM should have VMware tools running.
**URLs** | The configuration server needs access to these URLs:<br/><br/> [!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)]<br/><br/> If you have IP address-based firewall rules, ensure they allow communication to Azure.<br/></br> Allow the [Azure Datacenter IP Ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653), and the HTTPS (443) port.<br/></br> Allow IP address ranges for the Azure region of your subscription, and for West US (used for Access Control and Identity Management).<br/><br/> Allow this URL for the MySQL download: http://cdn.mysql.com/archives/mysql-5.5/mysql-5.5.37-win32.msi.
**Mobility service** | Installed on every replicated VM.




## Limitations

**Limitation** | **Details**
--- | ---
**Azure** | Storage and network accounts must be in the same region as the vault<br/><br/> If you use a premium storage account, you also need a standard store account to store replication logs<br/><br/> You can't replicate to premium accounts in Central and South India.
**On-premises configuration server** | VMware VM adapter type should be VMXNET3. If it isn't, [install this update](https://kb.vmware.com/selfservice/microsites/search.do?cmd=displayKC&docType=kc&externalId=2110245&sliceId=1&docTypeID=DT_KB_1_1&dialogID=26228401&stateId=1)<br/><br/> vSphere PowerCLI 6.0 should be installed.<br/><br> The machine shouldn't be a domain controller. The machine should have a static IP address.<br/><br/> The host name should be 15 characters or less, and operating system should be in English.
**VMware** | Only 5.5 features are supported in vCenter 6.0. Site Recovery doesn't support new vCenter and vSphere 6.0 features such as cross vCenter vMotion, virtual volumes, and storage DRS.
**VMs** | Verify [Azure VM limitations](site-recovery-prereq.md#azure-requirements)<br/><br/> You can't replicate VMs with encrypted disks, or VMs with UEFI/EFI boot.<br/><br> Shared disk clusters aren't supported. If the source VM has NIC teaming, it's converted to a single NIC after failover.<br/><br/> If VMs have an iSCSI disk, Site Recovery converts it to a VHD file after failover. If the iSCSI target can be reached by the Azure VM, it connects to it, and sees both it and the VHD. If this happens, disconnect the iSCSI target.<br/><br/> If you want to enable multi-VM consistency, which enables VMs running the same workload to be recovered together to a consistent data point, open port 20004 on the VM.<br/><br/> Windows must be installed on the C drive. The OS disk should be basic, and not dynamic. The data disk can be dynamic.<br/><br/> Linux /etc/hosts files on VMs should contain entries that map the local host name to IP addresses associated with all network adapters. The host name, mount points, device name, system paths, and file names (/etc; /usr) should be in English only.<br/><br/> Specific types of [Linux storage](site-recovery-support-matrix-to-azure.md#support-for-storage) are supported.<br/><br/>Create or set **disk.enableUUID=true** in the VM settings. This provides a consistent UUID to the VMDK, so that it mounts correctly, and ensures that only delta changes are transferred back to on-premises during failback, without full replication.


## Next steps

- If you're doing a full deployment, go to [Step 3: Plan capacity](vmware-walkthrough-capacity.md)
- If you're doing a simple test deployment, go to [Step 4: Plan networking](site-recovery-network-design.md).
