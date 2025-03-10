---
title: Support for physical server migration in Azure Migrate and Modernize
description: Learn about support for physical server migration in Azure Migrate and Modernize.
author: vijain
ms.author: vijain
ms.manager: kmadnani
ms.topic: conceptual
ms.service: azure-migrate
ms.date: 01/27/2025
ms.custom: engagement-fy25
---

# Support matrix for migration of physical servers, AWS VMs, and GCP VMs

This article summarizes support settings and limitations for migrating physical servers, Amazon Web Services (AWS) virtual machines (VMs), and Google Cloud Platform (GCP) VMs to Azure with [Migration and modernization](migrate-services-overview.md) . If you're looking for information about assessing physical servers for migration to Azure, see the [assessment support matrix](migrate-support-matrix-physical.md).

## Migrate machines as physical

You can migrate on-premises machines as physical servers by using agent-based replication. By using this tool, you can migrate a wide range of machines to Azure, such as:

- On-premises physical servers.
- VMs virtualized by platforms, such as Xen and KVM.
- Hyper-V VMs or VMware VMs, if for some reason you don't want to use the standard [Hyper-V](tutorial-migrate-hyper-v.md) or [VMware](server-migrate-overview.md) flows.
- VMs running in private clouds.
- VMs running in public clouds, including AWS or GCP.

## Migration limitations

You can select up to 10 machines at once for replication. If you want to migrate more machines, replicate them in groups of 10.

## Physical server requirements

The following table summarizes support for physical servers, AWS VMs, and GCP VMs that you want to migrate by using agent-based migration.

Support | Details
--- | ---
Machine workload | Azure Migrate and Modernize supports migration of any workload (such as Microsoft Entra ID or SQL Server) running on a supported machine.
Operating systems | For the latest information, see the [operating system (OS) support](../site-recovery/vmware-physical-azure-support-matrix.md#replicated-machines) for Azure Site Recovery. Azure Migrate and Modernize provides identical OS support.
Linux file system/guest storage | For the latest information, see the [Linux file system support](../site-recovery/vmware-physical-azure-support-matrix.md#linux-file-systemsguest-storage) for Site Recovery. Azure Migrate and Modernize provides identical Linux file system support.
Network/Storage | For the latest information, see the [network](../site-recovery/vmware-physical-azure-support-matrix.md#network) and [storage](../site-recovery/vmware-physical-azure-support-matrix.md#storage) prerequisites for Site Recovery. Azure Migrate and Modernize provides identical network/storage requirements.
Azure requirements | For the latest information, see the [Azure network](../site-recovery/vmware-physical-azure-support-matrix.md#azure-vm-network-after-failover), [storage](../site-recovery/vmware-physical-azure-support-matrix.md#azure-storage), and [compute](../site-recovery/vmware-physical-azure-support-matrix.md#azure-compute) requirements for Site Recovery. Azure Migrate and Modernize has identical requirements for physical server migration.
Mobility service | Install the Mobility service agent on each machine you want to migrate.
UEFI boot | Supported. <br/><br/> Windows : NTFS  <br/><br/> Linux: The following filesystem types are supported: ext4, xfs, btrfs. Some filesystems such as ZFS, UFS, ReiserFS, and DazukoFS may not be supported subject to additional command requirements to mount them.
UEFI - Secure boot         | Not supported for migration.
Target disk | Machines can be migrated only to managed disks (standard HDD, standard SSD, premium SSD) in Azure.
Ultra disk | Ultra disk migration isn't supported from the Azure Migrate and Modernize portal. You have to do an out-of-band migration for the disks that are recommended as Ultra disks. That is, you can migrate selecting it as premium disk type and change it to Ultra disk after migration.
Disk size | Up to 2-TB OS disk for gen 1 VM. Up to 4-TB OS disk for gen 2 VM and 32 TB for data disks.
Disk limits |  Up to 63 disks per machine.
Encrypted disks/volumes |  Machines with encrypted disks/volumes aren't supported for migration.
Shared disk cluster | Not supported.
Independent disks | Supported.
Passthrough disks | Supported.
NFS | NFS volumes mounted as volumes on the machines aren't replicated.
ReiserFS | Not supported.
iSCSI targets | Machines with iSCSI targets aren't supported for agentless migration.
Multipath IO | Supported for Windows servers with Microsoft or vendor-specific Device-Specific Module installed.
Teamed NICs | Not supported.
IPv6 | Not supported.
PV drivers / XenServer tools | Not supported.

## Replication appliance requirements

If you set up the replication appliance manually, make sure that it complies with the requirements summarized in the table. When you set up the Azure Migrate replication appliance as a VMware VM by using the Open Virtual Appliance template provided in the Azure Migrate and Modernize hub, the appliance is set up with Windows Server 2016 and complies with the support requirements.

- Learn about [replication appliance requirements](migrate-replication-appliance.md#appliance-requirements).
- Install MySQL on the appliance. Learn about [installation options](migrate-replication-appliance.md#mysql-installation).
- Learn about [URLs](migrate-replication-appliance.md#url-access) the replication appliance needs to access.

## Azure VM requirements

All on-premises VMs replicated to Azure must meet the Azure VM requirements summarized in this table. When Site Recovery runs a prerequisites check for replication, the check fails if some of the requirements aren't met.

Component | Requirements | Details
--- | --- | ---
Guest operating system | Verifies supported operating systems.<br/> You can migrate any workload running on a supported OS. | Check fails if unsupported.
Guest operating system architecture | 64 bit. | Check fails if unsupported.
Operating system disk size | Up to 2TB for Gen1 VM and 4TB for Gen2 VM. | Check fails if unsupported.
Operating system disk count | 1. | Check fails if unsupported.
Data disk count | 64 or less. | Check fails if unsupported.
Data disk size | Up to 32 TB. | Check fails if unsupported.
Network adapters | Multiple adapters are supported.
Shared VHD | Not supported. | Check fails if unsupported.
FC disk | Not supported. | Check fails if unsupported.
BitLocker | Not supported. | Disable BitLocker before you enable replication for a machine.
VM name | From 1 to 63 characters.<br/> Restricted to letters, numbers, and hyphens.<br/><br/> The machine name must start and end with a letter or number. |  Update the value in the machine properties in Site Recovery.
Connect after migration-Windows | To connect to Azure VMs running Windows after migration:<br/> - Before migration enables Remote Desktop Protocol (RDP) on the on-premises VM. Make sure that TCP and UDP rules are added for the **Public** profile, and that RDP is allowed in **Windows Firewall** > **Allowed Apps** for all profiles.<br/> - For site-to-site virtual private network access, enable RDP and allow RDP in **Windows Firewall** > **Allowed apps and features** for **Domain and Private** networks. Also check that the OS storage area network policy is set to **OnlineAll**. [Learn more](prepare-for-migration.md).
Connect after migration-Linux | To connect to Azure VMs after migration by using Secure Shell (SSH):<br/> - Before migration, on the on-premises machine, check that the SSH service is set to **Start** and that firewall rules allow an SSH connection.<br/> - After failover, on the Azure VM, allow incoming connections to the SSH port for the network security group rules on the failed over VM, and for the Azure subnet to which it's connected. Also add a public IP address for the VM.

## Next steps

[Migrate](tutorial-migrate-physical-virtual-machines.md) physical servers.
