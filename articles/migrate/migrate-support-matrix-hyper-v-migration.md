---
title: Support for Hyper-V migration in Azure Migrate
description: Learn about support for Hyper-V migration with Azure Migrate.
ms.topic: conceptual
ms.date: 01/08/2020
---

# Support matrix for Hyper-V migration

This article summarizes support settings and limitations for migrating Hyper-V VMs with [Azure Migrate: Server Migration](migrate-services-overview.md#azure-migrate-server-migration-tool) . If you're looking for information about assessing Hyper-V VMs for migration to Azure, review the [assessment support matrix](migrate-support-matrix-hyper-v.md).

## Migration limitations

You can select up to 10 VMs at once for replication. If you want to migrate more machines, replicate in groups of 10.


## Hyper-V hosts

| **Support**                | **Details**               
| :-------------------       | :------------------- |
| **Deployment**       | The Hyper-V host can be standalone or deployed in a cluster. |
| **Permissions**           | You need administrator permissions on the Hyper-V host. |
| **Host operating system** | Windows Server 2019, Windows Server 2016, or Windows Server 2012 R2. |
| **URL access** | Hyper-V hosts need access to these URLS:<br/><br/> - login.microsoftonline.com: Access control and identity management using Active Directory.<br/><br/> - *.backup.windowsazure.com: Replication data transfer and coordination. Migrate service URLs.<br/><br/> - *.blob.core.windows.net: Upload data to storage accounts.<br/><br/> - dc.services.visualstudio.com: Upload app logs used for internal monitoring.<br/><br/> - time.windows.com | Verifies time synchronization between system and global time.
| **Port access** |  Outbound connections on HTTPS port 443 to send VM replication data.

## Hyper-V VMs

| **Support**                  | **Details**               
| :----------------------------- | :------------------- |
| **Operating system** | All [Windows](https://support.microsoft.com/help/2721672/microsoft-server-software-support-for-microsoft-azure-virtual-machines) and [Linux](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros) operating systems that are supported by Azure. |
| **Permissions**           | You need administrator permissions on each Hyper-V VM you want to assess. |
| **Integration Services**       | [Hyper-V Integration Services](https://docs.microsoft.com/virtualization/hyper-v-on-windows/reference/integration-services) must be running on VMs that you assess, in order to capture operating system information. |
| **Required changes for Azure** | Some VMs might require changes so that they can run in Azure. Azure Migrate makes these changes automatically for the following operating systems:<br/> - Red Hat Enterprise Linux 6.5+, 7.0+<br/> - CentOS 6.5+, 7.0+</br> - SUSE Linux Enterprise Server 12 SP1+<br/> - Ubuntu 14.04LTS, 16.04LTS, 18.04LTS<br/> - Debian 7, 8<br/><br/> For other operating systems, you need to make adjustments manually before migration. The relevant articles contain instructions about how to do this. |
| **Linux boot**                 | If /boot is on a dedicated partition, it should reside on the OS disk, and not be spread across multiple disks.<br/> If /boot is part of the root (/) partition, then the ‘/’ partition should be on the OS disk, and not span other disks. |
| **UEFI boot**                  | The migrated VM in Azure will be automatically converted to a BIOS boot VM. The VM should be running Windows Server 2012 and later only. The OS disk should have up to five partitions or fewer and the size of OS disk should be less than 300 GB.
  |
| **Disk size**                  | 2 TB for the OS disk, 4 TB for data disks.
| **Disk number** | A maximum of 16 disks per VM.
| **Encrypted disks/volumes**    | Not supported for migration. |
| **RDM/passthrough disks**      | Not supported for migration. |
| **Shared disk** | VMs using shared disks aren't supported for migration.
| **NFS**                        | NFS volumes mounted as volumes on the VMs won't be replicated. |
| **ISCSI**                      | VMs with iSCSI targets aren't supported for migration.
| **Target disk**                | You can migrate to Azure VMs with managed disks only. |
| **IPv6** | Not supported.
| **NIC teaming** | Not supported.
| **Azure Site Recovery** | You can't replicate using Azure Migrate Server Migration if the VM is enabled for replication with Azure Site Recovery.
| **Ports** | Outbound connections on HTTPS port 443 to send VM replication data.



## Next steps

[Migrate Hyper-V VMs](tutorial-migrate-hyper-v.md) for migration.
