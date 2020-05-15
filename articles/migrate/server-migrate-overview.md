---
title: Select a VMware migration option with Azure Migrate Server Migration | Microsoft Docs
description: Provides an overview of options for migrating VMware VMs to Azure with Azure Migrate Server Migration
ms.topic: conceptual
ms.date: 07/09/2019
---


# Select a VMware migration option

You can migrate VMware VMs to Azure using the Azure Migrate Server Migration tool. This tool offers a couple of options for VMware VM migration:

- Migration using agentless replication. Migrate VMs without needing to install anything on them.
- Migration with an agent for replication. Install an agent on the VM for replication.




## Compare migration methods

Use these selected comparisons to help you decide which method to use. You can also review full support requirements for [agentless](migrate-support-matrix-vmware-migration.md#agentless-vmware-servers) and [agent-based](migrate-support-matrix-vmware-migration.md#agent-based-vmware-servers) migration.

**Setting** | **Agentless** | **Agent-based**
--- | --- | ---
**Azure permissions** | You need permissions to create an Azure Migrate project, and to register Azure AD apps created when you deploy the Azure Migrate appliance. | You need Contributor permissions on the Azure subscription. 
**Simultaneous replication** | A maximum of 100 VMs can be simultaneously replicated from a vCenter Server.<br/> If you have more than 50 VMs for migration, create multiple batches of VMs.<br/> Replicating more at a single time will impact performance. | NA
**Appliance deployment** | The [Azure Migrate appliance](migrate-appliance.md) is deployed on-premises. | The [Azure Migrate Replication appliance](migrate-replication-appliance.md) is deployed on-premises.
**Site Recovery compatibility** | Compatible. | You can't replicate with Azure Migrate Server Migration if you've set up replication for a machine using Site Recovery.
**Target disk** | Managed disks | Managed disks
**Disk limits** | OS disk: 2 TB<br/><br/> Data disk: 4 TB<br/><br/> Maximum disks: 60 | OS disk: 2 TB<br/><br/> Data disk: 8 TB<br/><br/> Maximum disks: 63
**Passthrough disks** | Not supported | Supported
**UEFI boot** | Not supported | The migrated VM in Azure will be automatically converted to a BIOS boot VM.<br/><br/> The OS disk should have up to four partitions, and volumes should be formatted with NTFS.


## Deployment steps comparison

After reviewing the limitations, understanding the steps involved in deploying each solution might help you decide which option to choose.

**Task** | **Details** |**Agentless** | **Agent-based**
--- | --- | --- | ---
**Assessment** | Assess servers before migration.  Assessment is optional. We suggest that you assess machines before you migrate them, but you don't have to. <br/><br/> For assessment, Azure Migrate sets up a lightweight appliance to discover and assess VMs. | If you run an agentless migration after assessment, the same Azure Migrate appliance set up for assessment is used for agentless migration.  |  If you run an agent-based migration after assessment, the appliance set up for assessment isn't used during agentless migration. You can leave the appliance in place, or remove it if you don't want to do further discovery and assessment.
**Prepare VMware servers and VMs for migration** | Configure a number of settings on VMware servers and VMs. | Required | Required
**Add the Server Migration tool** | Add the Azure Migrate Server Migration tool in the Azure Migrate project. | Required | Required
**Deploy the Azure Migrate appliance** | Set up a lightweight appliance on a VMware VM for VM discovery and assessment. | Required | Not required.
**Install the Mobility service on VMs** | Install the Mobility service on each VM you want to replicate | Not required | Required
**Deploy the Azure Migrate Server Migration replication appliance** | Set up an appliance on a VMware VM to discover VMs, and bridge between the Mobility service running on VMs and Azure Migrate Server Migration | Not required | Required
**Replicate VMs**. Enable VM replication. | Configure replication settings and select VMs to replicate | Required | Required
**Run a test migration** | Run a test migration to make sure everything's working as expected. | Required | Required
**Run a full migration** | Migrate the VMs. | Required | Required




## Next steps

[Migrate VMware VMs](tutorial-migrate-vmware.md) with agentless migration.



