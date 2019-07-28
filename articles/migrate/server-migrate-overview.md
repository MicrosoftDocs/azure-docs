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

- **Simultaneous replication**: A maximum of 50 VMs can be simultaneously replicated from a vCenter Server.<br/> If you have more than 50 VMs for migration, create multiple batches of VMs.<br/> Replicating more at a single time will impact performance.
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

**Task** | **Details** |**Agentless** | **Agent-based**
--- | --- | --- | ---
**Prepare VMware servers and VMs for migration** | Configure a number of settings on VMware servers and VMs. | Required | Required
**Add the Server Migration tool** | Add the Azure Migrate Server Migration tool in the Azure Migrate project. | Required | Required
**Deploy the Azure Migrate appliance** | Set up a lightweight appliance on a VMware VM for VM discovery and assessment. | Required | Not required.
**Install the Mobility service on VMs** | Install the Mobility service on each VM you want to replicate | Not required | Required
**Deploy the Azure Migrate Server Migration replication appliance** | Set up an appliance on a VMware VM to discover VMs, and bridge between the Mobility service running on VMs and Azure Migrate Server Migration | Not required | Required
**Replicate VMs**. Enable VM replication. | Configure replication settings and select VMs to replicate | Required | Required
**Run a test migration** | Run a test migration to make sure everything's working as expected. | Required | Required
**Run a full migration** | Migrate the VMs. | Required | Required




## Next steps

[Migrate VMware VMs](tutorial-migrate-vmware.md) using agentless migration.



