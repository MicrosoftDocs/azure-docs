---
title: Trusted launch VMs with Azure Site Recovery 
description: Describes how to use trusted launch virtual machines with Azure Site Recovery for disaster recovery and migration.
services: site-recovery
author: jyothisuri
ms.service: azure-site-recovery
ms.topic: concept-article
ms.date: 06/05/2025
ms.author: jsuri

---
# Azure Site Recovery support for Azure trusted launch virtual machines 

[Trusted launch](/azure/virtual-machines/trusted-launch) protects against advanced and persistent attack techniques. It is composed of several coordinated infrastructure technologies that can be enabled independently. Each technology provides another layer of defense against sophisticated threats. To deploy an Azure trusted launch VM, follow [these steps](/azure/virtual-machines/trusted-launch-portal). 


## Support matrix

Find the support matrix for Azure trusted launch virtual machines with Azure Site Recovery:

- **Operating system**: Support for Windows and Linux OS is generally available. [Learn more](#supported-linux-distributions-and-kernels) on supported Linux distributions and kernels.
- **Region**: Available in all [Azure Site Recovery supported regions](./azure-to-azure-support-matrix.md#region-support).
    
    > [!NOTE]
    > For [Azure Government regions](../azure-government/documentation-government-overview-dod.md), both source and target location should either be in `US Gov` regions or both should be in `US DoD` regions. Setting source location of US Gov regions and target location of US DoD regions or vice versa isn't supported.
- **Private endpoints**: Azure trusted virtual machines can be protected using private endpoint configured recovery services vault
- **Migration**: Migration of Azure Site Recovery protected existing Generation 1 Azure VMs to trusted VMs and [Generation 2 Azure virtual machines to trusted VMs](/azure/virtual-machines/trusted-launch-existing-vm) isn't supported. [Learn more](#migrate-azure-site-recovery-protected-azure-generation-2-vm-to-trusted-vm) about migration of Generation 2 Azure VMs.
- **Disk Network Access**: Azure Site Recovery creates disks (replica and target disks) with public access enabled by default. To disable public access for these disks follow [these steps](./azure-to-azure-common-questions.md#disk-network-access).
- **Boot integrity monitoring**: Replication of [Boot integrity monitoring](/azure/virtual-machines/boot-integrity-monitoring-overview) state isn't supported. If you want to use it, enable it explicitly on the failed over virtual machine.
- **Shared disks**: Trusted virtual machines with attached shared disks are currently supported only for Windows OS.
- **Scenario**: Available only for Azure-to-Azure scenario. 
- **Create a new VM flow**: Enabling **Management** > **Site Recovery** option in *Create a new Virtual machine* flow is currently  supported for Windows OS only. Linux OS is not yet supported.
- **VM creation time**: Only Linux Trusted VMs created after `1-Apr-2024` are supported. Linux Trusted VMs created prior to this date are not supported.

## Supported Linux distributions and kernels

The following Linux distributions and kernels are supported for trusted launch virtual machines:

Following are the supported distros:
- **Ubuntu**: 18.04, 20.04, 22.04, 24.04
- **RHEL**: 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.10, 9.0, 9.1, 9.2, 9.3, 9.4, 9.5
- **SUSE 15**: SP3, SP4, SP5, SP6
- **Alma Linux**: 8.10, 9.4, 9.5
- **Debian**: 12

Azure Site Recovery supports the same kernels for Azure Trusted VMs as for Azure Standard VMs across the listed Linux distributions. For SUSE, however, Azure Site Recovery support only the following kernels for Azure Trusted launch VMs, provided these kernels are also supported for Azure Standard VMs by Azure Site Recovery:
- **SUSE 15 SP3**: 5.3.18-150300.59.179.1 and later 
- **SUSE 15 SP4**: 5.14.21-150400.24.141.1 and later 
- **SUSE 15 SP5**: 5.14.21-150500.55.83.1 and later 
- **SUSE 15 SP6**: 6.4.0-150600.23.25.1 and later 

## Azure Site Recovery for trusted VMs 

You can follow the same steps for Azure Site Recovery with trusted virtual machines as for Azure Site Recovery with standard Azure virtual machines. 

- To configure Azure Site Recovery on trusted virtual machines to another region, [follow these steps](./azure-to-azure-tutorial-enable-replication.md). To enable replication to another zone within the same region, [follow these steps](./azure-to-azure-how-to-enable-zone-to-zone-disaster-recovery.md).
- To failover and failback trusted virtual machines, [follow these steps](./azure-to-azure-tutorial-failover-failback.md).


## Migrate Azure Site Recovery protected Azure Generation 2 VM to trusted VM 

Azure Generation 2 VMs protected by Azure Site Recovery cannot be migrated to trusted launch. While the portal blocks this migration, other channels like PowerShell and CLI do not. Before proceeding, review the migration [prerequisites](/azure/virtual-machines/trusted-launch-existing-vm) and plan accordingly. If you still wish to migrate your Generation 2 Azure VM protected by Azure Site Recovery to Trusted Launch, follow these steps:

1. [Disable](./site-recovery-manage-registration-and-protection.md#disable-protection-for-a-azure-vm-azure-to-azure) Azure Site Recovery replication. 
1. Uninstall Azure Site Recovery agent from the VM. To do this, follow these steps:
    1. On the Azure portal, go to the virtual machine.
    1. Select **Settings** > **Extensions**.
    1. Select Site Recovery extension.
    1. Select **Uninstall**.
    1. Uninstall Azure Site Recovery mobility service using these [commands](./vmware-physical-manage-mobility-service.md#uninstall-mobility-service).
1.	Trigger the migration of [Generation 2 VM to trusted launch VM](/azure/virtual-machines/trusted-launch-existing-vm).

> [!NOTE]
> After migrating the virtual machine, the existing protection is disabled, deleting the existing recovery points. The migrated virtual machine is no longer protected by Azure Site Recovery. You must re-enable Azure Site Recovery protection on the trusted virtual machine, if needed.


## Next steps

To learn more about trusted virtual machines, see [trusted launch for Azure virtual machines](/azure/virtual-machines/trusted-launch).