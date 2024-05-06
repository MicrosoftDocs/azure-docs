---
title: Trusted launch VMs with Azure Site Recovery (preview)
description: Describes how to use trusted launch virtual machines with Azure Site Recovery for disaster recovery and migration.
services: site-recovery
author: ankitaduttaMSFT
ms.service: site-recovery
ms.topic: conceptual
ms.date: 05/06/2024
ms.author: ankitadutta

---
# Azure Site Recovery support for Azure trusted launch virtual machines (preview)

Trusted launch protects against advanced and persistent attack techniques. It is composed of several coordinated infrastructure technologies that can be enabled independently. Each technology provides another layer of defense against sophisticated threats. Learn more about [trusted virtual machines](../virtual-machines/trusted-launch.md).


## Deploy an Azure trusted launch virtual machine

To deploy an Azure trusted launch virtual machine, [follow these steps](../virtual-machines/trusted-launch-portal.md#deploy-a-trusted-launch-vm). 


## Support matrix

Find the support matrix for Azure trusted launch virtual machines with Azure Site Recovery:

- **Availability**: Available only for Azure-to-Azure scenario. 
- **Region**: Available in all [Azure Site Recovery supported public regions](./azure-to-azure-support-matrix.md#region-support). 
    > [!IMPORTANT]
    > For [Azure government regions](../azure-government/documentation-government-overview-dod.md), both source and target location should either be in `US Gov` regions or both should be in `US DoD` regions. Setting source location of US Gov regions and target location of US DoD regions or vice versa isn't supported.
- **Operating system**: Support available only for Windows OS. Linux OS is not supported.
- **Private endpoints**: Azure trusted virtual machines can be protected using private endpoint configured recovery services vault with [these conditions](#protect-azure-trusted-vms-using-recovery-services-vault-with-private-endpoint). 
- **Migration**: Migration of Gen 1 and Gen 2 Azure virtual machines to trusted virtual machines isn't supported.
- **Access**: Azure Site Recovery creates disks with public access enabled by default. To disable public access, follow [these steps](./azure-to-azure-common-questions.md#disk-network-access).
- **Boot integrity monitoring**: Replication of [Boot integrity monitoring](../virtual-machines/boot-integrity-monitoring-overview.md) state isn't supported. If you want to use it, enable it explicitly on the failed over virtual machine.
- **Shared disks**: Trusted virtual machines with attached shared disks aren't supported.

> [!NOTE]
> Enabling **Management** > **Site Recovery** option in *Create a new Virtual machine* flow isn't supported.



## Protect Azure trusted VMs using recovery services vault with private endpoint

You can't protect Azure trusted virtual machines using a recovery services vault that was created before the public preview and already has private endpoints configured. To protect Azure trusted virtual machines using a recovery services vault, you need to configure a private endpoint. 

Review the following conditions for public preview:

| Recovery services vault creation | Pre-configured vault with private endpoint | Pre-existing protection | Eligibility for Azure trusted VM protection |
| --- | --- | --- | --- |
| Created before public preview release | Yes, vault is pre-configured | Yes, items are already protected in vault | **No** |
| Created before public preview release | Yes, vault is pre-configured | No, items aren't protected in vault  | **No** |
| Created before public preview release |  No, vault isn't pre-configured | Yes, items are already protected in vault | **No**, [private endpoints can only be configured on new recovery services vault](./azure-to-azure-how-to-enable-replication-private-endpoints.md#prerequisites-and-caveats) that doesn't have any item already added to it.  |
| Created before public preview release |  No, vault isn't pre-configured | No, items aren't protected in vault  | **Yes**, you can configure private endpoints on the vault and start protecting virtual machines.  |
| Created after public preview release | No, vault isn't pre-configured | No, items aren't protected in vault | **Yes** |

> [!IMPORTANT]
- You can use an existing recovery services vault created before the public preview but without private endpoints already configured and without any items added to the vault. Configure private endpoints on this vault to begin protecting trusted virtual machines using it.
- Alternatively, you can create a new recovery services vault, configure private endpoints on it, and start protecting Azure trusted virtual machines using it.


## Azure Site Recovery for trusted VMs 

You can follow the same steps for Azure Site Recovery with trusted virtual machines as for Azure Site Recovery with standard Azure virtual machines. To configure Azure Site Recovery on trusted virtual machines to another region, [follow the steps]() in the [Azure Site Recovery documentation]( ./azure-to-azure-tutorial-enable-replication.md).



## Next steps

- To failover and failback trusted virtual machines, [follow the steps](./azure-to-azure-tutorial-failover-failback.md).
- To learn more about trusted virtual machines, see [trusted launch for Azure virtual machines](../virtual-machines/trusted-launch.md).