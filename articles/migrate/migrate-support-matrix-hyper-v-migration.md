---
title: Support for Hyper-V migration in Azure Migrate
description: Learn about support for Hyper-V migration with Azure Migrate.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: conceptual
ms.service: azure-migrate
ms.date: 10/16/2023
ms.custom: engagement-fy24
---

# Support matrix for Hyper-V migration

This article summarizes support settings and limitations for migrating Hyper-V VMs with [Migration and modernization](migrate-services-overview.md#migration-and-modernization-tool) . If you're looking for information about assessing Hyper-V VMs for migration to Azure, review the [assessment support matrix](migrate-support-matrix-hyper-v.md).

## Migration limitations

You can select up to 10 VMs at once for replication. If you want to migrate more machines, replicate in groups of 10.


## Hyper-V host requirements

| **Support**                | **Details**               
| :-------------------       | :------------------- |
| **Deployment**       | The Hyper-V host can be standalone or deployed in a cluster. <br>Azure Migrate replication software (Hyper-V Replication provider) is installed on the Hyper-V hosts.|
| **Permissions**           | You need administrator permissions on the Hyper-V host. |
| **Host operating system** | Windows Server 2022, Windows Server 2019, or Windows Server 2012 R2 with latest updates. Note that Server core installation of these operating systems is also supported. |
| **Other Software requirements** | .NET Framework 4.7 or later |
| **Port access** |  Outbound connections on HTTPS port 443 to send VM replication data.



## Hyper-V VMs

| **Support**                  | **Details**               
| :----------------------------- | :------------------- |
| **Operating system** | All [Windows](https://support.microsoft.com/help/2721672/microsoft-server-software-support-for-microsoft-azure-virtual-machines) and [Linux](../virtual-machines/linux/endorsed-distros.md) operating systems that are supported by Azure. |
**Windows Server 2003** | For VMs running Windows Server 2003, you need to [install Hyper-V Integration Services](prepare-windows-server-2003-migration.md) before migration. | 
**Linux VMs in Azure** | Some VMs might require changes so that they can run in Azure.<br><br> For Linux, Azure Migrate makes the changes automatically for these operating systems:<br> - Red Hat Enterprise Linux 9.x, 8.x, 7.9, 7.8, 7.7, 7.6, 7.5, 7.4, 7.0, 6.x<br> - CentOS  9.x (Release and Stream), 8.x (Release and Stream), 7.9, 7.7, 7.6, 7.5, 7.4, 6.x</br> - SUSE Linux Enterprise Server 15 SP4, 15 SP3, 15 SP2, 15 SP1, 15 SP0, 12, 11 SP4, 11 SP3 <br>- Ubuntu 22.04, 21.04, 20.04, 19.04, 19.10, 18.04LTS, 16.04LTS, 14.04LTS<br> - Debian 11, 10, 9, 8, 7<br> - Oracle Linux 9, 8, 7.7-CI, 7.7, 6<br> - Kali Linux (2016, 2017, 2018, 2019, 2020, 2021, 2022) <br> - For other operating systems, you make the [required changes](prepare-for-migration.md#verify-required-changes-before-migrating) manually.
| **Required changes for Azure** | Some VMs might require changes so that they can run in Azure. Make adjustments manually before migration. The relevant articles contain instructions about how to do this. |
| **Linux boot**                 | If /boot is on a dedicated partition, it should reside on the OS disk, and not be spread across multiple disks.<br> If /boot is part of the root (/) partition, then the '/' partition should be on the OS disk, and not span other disks. |
| **UEFI boot**                  | Supported. UEFI-based VMs will be migrated to Azure generation 2 VMs.  |
| **UEFI - Secure boot**         | Not supported for migration.|
| **Disk size**                  | Up to 2 TB OS disk for gen 1 VM; up to 4 TB OS disk for gen 2 VM; 32 TB for data disks. </br></br> For existing Azure Migrate projects, you may need to upgrade the replication provider on the Hyper-V host to the latest version to replicate large disks up to 32 TB.|
| **Disk number** | A maximum of 16 disks per VM.|
| **Encrypted disks/volumes**    | Not supported for migration.|
| **RDM/passthrough disks**      | Not supported for migration.|
| **Shared disk** | VMs using shared disks aren't supported for migration.|
| **Ultra disk** | Ultra disk migration is not supported from the Azure Migrate portal. You have to do an out-of-band migration for the disks that are recommended as Ultra disks. That is, you can migrate selecting it as premium type and change it to Ultra disk after migration.|
| **NFS**                        | NFS volumes mounted as volumes on the VMs won't be replicated.|
| **ReiserFS**                   | Not supported.
| **ISCSI**                      | VMs with iSCSI targets aren't supported for migration.
| **Target disk**                | You can migrate to Azure VMs with managed disks only. |
| **IPv6** | Not supported.|
| **NIC teaming** | Not supported.|
| **Azure Site Recovery and/or Hyper-V** | You can't replicate using Migration and modernization if the VM is enabled for replication with Azure Site Recovery or with Hyper-V replica.|
| **Ports** | Outbound connections on HTTPS port 443 to send VM replication data.|


### URL access (public cloud)

The replication provider software on the Hyper-V hosts will need access to these URLs.

**URL** | **Details**
--- | ---
login.microsoftonline.com | Access control and identity management using Active Directory.
backup.windowsazure.com | Replication data transfer and coordination.
*.hypervrecoverymanager.windowsazure.com | Used for replication management.
*.blob.core.windows.net | Upload data to storage accounts. 
dc.services.visualstudio.com | Upload app logs used for internal monitoring.
time.windows.com | Verifies time synchronization between system and global time.

### URL access (Azure Government)

The replication provider software on the Hyper-V hosts will need access to these URLs.

**URL** | **Details**
--- | ---
login.microsoftonline.us | Access control and identity management using Active Directory.
backup.windowsazure.us | Replication data transfer and coordination.
*.hypervrecoverymanager.windowsazure.us | Used for replication management.
*.blob.core.usgovcloudapi.net | Upload data to storage accounts.
dc.services.visualstudio.com | Upload app logs used for internal monitoring.
time.nist.gov | Verifies time synchronization between system and global time.   

>[!Note]
> If your Migrate project has **private endpoint connectivity**, the replication provider software on the Hyper-V hosts will need access to these URLs for private link support. 
> - *.blob.core.windows.com - To access storage account that stores replicated data. This is optional and is not required if the storage account has a private endpoint attached. 
> - login.windows.net for access control and identity management using Active Directory.

## Replication storage account requirements

This table summarizes support for the replication storage account for Hyper-V VM migrations.

**Setting** | **Support** | **Details**
--- | --- | ---
General purpose V2 storage accounts (Hot and Cool tier) | Supported | GPv2 storage accounts may incur higher transaction costs than V1 storage accounts.
Premium storage | Supported | However, standard storage accounts are recommended to help optimize costs.
Region | Same region as virtual machine | Storage account should be in the same region as the virtual machine being protected.
Subscription | Can be different from source virtual machines | The Storage account need not be in the same subscription as the source virtual machine(s).
Azure Storage firewalls for virtual networks | Supported | If you are using firewall enabled replication storage account or target storage account, ensure you [Allow trusted Microsoft services](../storage/common/storage-network-security.md#exceptions). Also, ensure that you allow access to at least one subnet of source VNet. **You should allow access from All networks for public endpoint connectivity.** 
Soft delete | Not supported | Soft delete is not supported because once it is enabled on replication storage account, it increases cost. Azure Migrate performs very frequent creates/deletes of log files while replicating causing costs to increase.
Private endpoint | Supported | Follow the guidance to [set up Azure Migrate with private endpoints](migrate-servers-to-azure-using-private-link.md?pivots=hyperv).

## Azure VM requirements

All on-premises VMs replicated to Azure must meet the Azure VM requirements summarized in this table.

**Component** | **Requirements** | **Details**
--- | --- | ---
Operating system disk size | Up to 2,048 GB. | Check fails if unsupported.
Operating system disk count | 1 | Check fails if unsupported.
Data disk count | 16 or less. | Check fails if unsupported.
Data disk size | Up to 4,095 GB | Check fails if unsupported.
Network adapters | Multiple adapters are supported. |
Shared VHD | Not supported. | Check fails if unsupported.
FC disk | Not supported. | Check fails if unsupported.
BitLocker | Not supported. | BitLocker must be disabled before you enable replication for a machine.
VM name | From 1 to 63 characters.<br> Restricted to letters, numbers, and hyphens.<br><br> The machine name must start and end with a letter or number. |  Update the value in the machine properties in Site Recovery.
Connect after migration-Windows | To connect to Azure VMs running Windows after migration:<br><br> - Before migration, enable RDP on the on-premises VM. Make sure that TCP, and UDP rules are added for the **Public** profile, and that RDP is allowed in **Windows Firewall** > **Allowed Apps**, for all profiles.<br><br> - For site-to-site VPN access, enable RDP and allow RDP in **Windows Firewall** -> **Allowed apps and features** for **Domain and Private** networks. In addition, check that the operating system's SAN policy is set to **OnlineAll**. [Learn more](prepare-for-migration.md). |
Connect after migration-Linux | To connect to Azure VMs after migration using SSH:<br><br> - Before migration, on the on-premises machine, check that the Secure Shell service is set to Start, and that firewall rules allow an SSH connection.<br><br> - After migration, on the Azure VM, allow incoming connections to the SSH port for the network security group rules on the failed over VM, and for the Azure subnet to which it's connected. In addition, add a public IP address for the VM. |  

## Next steps

[Migrate Hyper-V VMs](tutorial-migrate-hyper-v.md) for migration.