---
title: Trusted launch VMs with Azure Site Recovery (preview)
description: Describes how to use trusted launch virtual machines with Azure Site Recovery for disaster recovery and migration.
services: site-recovery
author: ankitaduttaMSFT
ms.service: site-recovery
ms.topic: conceptual
ms.date: 05/09/2024
ms.author: ankitadutta

---
# Azure Site Recovery support for Azure trusted launch virtual machines (preview)

[Trusted launch](../virtual-machines/trusted-launch.md) protects against advanced and persistent attack techniques. It is composed of several coordinated infrastructure technologies that can be enabled independently. Each technology provides another layer of defense against sophisticated threats. To deploy an Azure trusted launch VM, follow [these steps](../virtual-machines/trusted-launch-portal.md).


## Support matrix

Find the support matrix for Azure trusted launch virtual machines with Azure Site Recovery:

- **Region**: Available in all [Azure Site Recovery supported regions](./azure-to-azure-support-matrix.md#region-support). 
    > [!NOTE]
    > For [Azure government regions](../azure-government/documentation-government-overview-dod.md), both source and target location should either be in `US Gov` regions or both should be in `US DoD` regions. Setting source location of US Gov regions and target location of US DoD regions or vice versa isn't supported.
- **Operating system**: Support available only for Windows OS. Linux OS is currently not supported.
- **Private endpoints**: Azure trusted virtual machines can be protected using private endpoint configured recovery services vault with the following conditions:
    - You can create a new recovery services vault and [configure private endpoints on it](./azure-to-azure-how-to-enable-replication-private-endpoints.md). Then you can start protecting Azure Trusted VMs using it. 
    - You can't protect Azure Trusted VMs using recovery services vault which are already created before public preview and have private endpoints configured.
- **Migration**: Migration of Azure Site Recovery protected existing Generation 1 Azure VMs to trusted VMs and [Generation 2 Azure virtual machines to trusted VMs](../virtual-machines/trusted-launch-existing-vm.md) isn't supported. [Learn more](#migrate-azure-site-recovery-protected-azure-generation-2-vm-to-trusted-vm) about migration of Generation 2 Azure VMs.
- **Disk Network Access**: Azure Site Recovery creates disks (replica and target disks) with public access enabled by default. To disable public access for these disks follow [these steps](./azure-to-azure-common-questions.md#disk-network-access).
- **Boot integrity monitoring**: Replication of [Boot integrity monitoring](../virtual-machines/boot-integrity-monitoring-overview.md) state isn't supported. If you want to use it, enable it explicitly on the failed over virtual machine.
- **Shared disks**: Trusted virtual machines with attached shared disks aren't currently supported.
- **Scenario**: Available only for Azure-to-Azure scenario. 
- **Create a new VM flow**: Enabling **Management** > **Site Recovery** option in *Create a new Virtual machine* flow is currently not supported.


## Azure Site Recovery for trusted VMs 

You can follow the same steps for Azure Site Recovery with trusted virtual machines as for Azure Site Recovery with standard Azure virtual machines. 

- To configure Azure Site Recovery on trusted virtual machines to another region, [follow these steps](./azure-to-azure-tutorial-enable-replication.md). To enable replication to another zone within the same region, [follow these steps](./azure-to-azure-how-to-enable-zone-to-zone-disaster-recovery.md).
- To failover and failback trusted virtual machines, [follow these steps](./azure-to-azure-tutorial-failover-failback.md).


## Migrate Azure Site Recovery protected Azure Generation 2 VM to trusted VM 

Azure Generation 2 VMs protected by Azure Site Recovery cannot be migrated to trusted launch. While the portal blocks this migration, other channels like PowerShell and CLI do not. Before proceeding, review the migration [prerequisites](../virtual-machines/trusted-launch-existing-vm.md) and plan accordingly. If you still wish to migrate your Generation 2 Azure VM protected by Azure Site Recovery to Trusted Launch, follow these steps:

1. [Disable](./site-recovery-manage-registration-and-protection.md#disable-protection-for-a-azure-vm-azure-to-azure) Azure Site Recovery replication. 
1. Uninstall Azure Site Recovery agent from the VM. To do this, follow these steps:
    1. On the Azure portal, go to the virtual machine.
    1. Select **Settings** > **Extensions**.
    1. Select Site Recovery extension.
    1. Select **Uninstall**.
    1. Uninstall Azure Site Recovery mobility service using these [commands](./vmware-physical-manage-mobility-service.md#uninstall-mobility-service).
1.	Trigger the migration of [Generation 2 VM to trusted launch VM](../virtual-machines/trusted-launch-existing-vm.md).

> [!NOTE]
> After migrating the virtual machine, the existing protection is disabled, deleting the existing recovery points. The migrated virtual machine is no longer protected by Azure Site Recovery. You must re-enable Azure Site Recovery protection on the trusted virtual machine, if needed.


## Next steps

To learn more about trusted virtual machines, see [trusted launch for Azure virtual machines](../virtual-machines/trusted-launch.md).