---
title: Select a VMware migration option with Azure Migrate Server Migration | Microsoft Docs
description: Provides an overview of options for migrating VMware VMs to Azure with Azure Migrate Server Migration
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 07/09/2019
ms.author: raynew
---


# Select a VMware migration option

You can migrate VMware VMs to Azure using the Azure Migrate Server Migration tool. This tool offers a couple of options for VMware VM migration:

- Migration using agentless replication. Migrate VMs without needing to install anything on them.
- Migration with an agent for replication. Install an agent on the VM for replication.

Although agentless replication is easier from a deployment perspective, it currently has a number of limitations.

## Agentless migration limitations

Limitations are as follows:

- **Simulaneous replication**: A maximum of 50 VMs can be simultaneously replicated from a vCenter Server.<br/> If you have more than 50 VMs for migration, create multiple batches of VMs.<br/> Replicating more at a single time will impact performance.
- **VM disks**: A VM that you want to migrate must have 60 or less disks.
- **VM operating systems**: In general, Azure Migrate can migrate any Windows Server or Linux operating system, but it might require changes on VMs so that they can run in Azure. Azure Migrate makes the changes automatically for these operating systems:
    - Red Hat Enterprise Linux 6.5+, 7.0+
    - CentOS 6.5+, 7.0+
    - SUSE Linux Enterprise Server 12 SP1+
    - Ubuntu 14.04LTS, 16.04LTS, 18.04LTS
    - Debian 7,8
    - For other operating systems, you need to make adjustments manually before migration. The [migrate tutorial](tutorial-migrate-vmware.md) explains how to do this.
- **Linux boot**: If /boot is on a dedicated partition, it should reside on the OS disk, and not be spread across multiple disks.<br/> If /boot is part of the root (/) partition, then the ‘/’ partition should be on the OS disk, and not span other disks.
- **UEFI boot**: VMs with UEFI boot aren't supported for migration.
- **Encrypted disks/volumes (BitLocker, cryptfs)**: VMs with encrypted disks/volumes aren't supported for migration.
- **RDM/passthrough disks**: If VMs have RDM or passthrough disks, these disks won't be replicated to Azure
- **NFS**: NFS volumes mounted as volumes on the VMs won't be replicated.
- **Target storage**: You can only migrate VMware VMs to Azure VMs with managed disks (Standard HDD, Premium
SSD).



## Deployment steps comparison

After reviewing the limitations, understanding the steps involved in deploying each solution might help you decide which option to choose.

**Agentless** | **With agent**
--- | ---
**1. Prepare Windows/Linux VMs**.<br/>You need to configure a number of settings on Windows and Linux VMs. | NA
**2. Server Migration**: Add the server migration tool in the Azure Migrate project. | NA
**3. Set up vCenter accounts**: Configure specific account permissions for migration. | NA
**4. Replicate VMs**. Start VM replication. Azure Migrate can use Azure Migrate assessments for replication settings.<br/> After the initial replication, delta replication continues for VMs. | NA
**5. Deploy the Azure Migrate appliance on-premises**. If you've already run Azure Migrate Server Assessment, then the appliance is already deployed. | NA
**6. Run a test migration**. A test migration simulates a migration by creating an Azure VM using replicated data. Migration is usually to a different (non-production) Azure VNet, and doesn't impact on-premises servers operations or replication. | NA
**7. Run a full migration**. After a full migration, you can manage the migrated VM as an Azure VM in the portal. You complete migration by stopping VM replication. This cleans up associated replication state information for the machine. | NA




## Next steps

[Migrate VMware VMs](tutorial-migrate-vmware.md) using agentless migration.



