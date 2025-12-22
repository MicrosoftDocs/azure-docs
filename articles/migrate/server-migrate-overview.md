---
title: Agentless and Agent-based Migration Methods in Azure Migrate
description: Learn agentless and agent-based migration methods for VMware, Hyper-V, and cloud platforms. Choose the right approach for seamless Azure migration.
author: piyushdhore-microsoft 
ms.author: piyushdhore
ms.manager: vijain
ms.topic: concept-article
ms.service: azure-migrate
ms.reviewer: v-uhabiba
ms.date: 05/09/2025
ms.custom: vmware-scenario-422, engagement-fy23
# Customer intent: As an IT administrator, I want to select a VMware migration option using the Migration and modernization tool, so that I can effectively migrate my VMware VMs to Azure while considering the best method for my environment.
---

# Agentless and Agent-based migration methods 

This article provides migration methods across major fabrics and provides guidance for choosing between **Agentless** and **Agent-based** approaches.

Comparing migration methods 

| **Fabric** |  **Recommended method**  | **Alternate method(s)**|
| --- | --- | --- |
| VMware vSphere  | Use **Agentless** replication with the Azure Migrate appliance. This method doesn’t require in-guest agents and is recommended for most VMware scenarios.    | Use **Agent-based** replication with the Replication appliance and the Mobility service agent (one agent per VM). Choose this method when agentless prerequisites or limits aren’t met.   | 
| Hyper-V  | Use **Agentless** replication. Providers run on Hyper-V hosts or cluster nodes, so no installation is required inside individual VMs.   | Use **Agent-based** replication (treat the VM as a physical server) when host access isn’t available or agentless requirements can’t be met    | 
| **Physical & other platforms** (AWS/GCP VMs, Xen, KVM, private clouds)  | Use **Agent-based** replication with the Replication appliance and the Mobility service agent (one agent per VM). This method is recommended for non-VMware and non-Hyper-V sources  |  | 


## Criteria for selecting Agent-based migration

Choose agent-based migration when one or more of the following conditions apply:

- **Agentless prerequisites aren’t met**: For example, VMware snapshots or Changed Block Tracking (CBT) are unavailable, vCenter API access is restricted, or snapshots must be avoided. Agentless replication depends on vSphere snapshots and CBT.

- **Guest operating system isn’t supported by agentless hydration**: This includes older or uncommon OS or kernel versions. Agent-based replication supports a broader range of operating systems.

- **Disk or boot configurations require agent-based support**: Certain passthrough disk scenarios are supported only with agent-based replication.

- **The source isn’t VMware or Hyper-V**: This includes physical servers, bare-metal servers, other hypervisors, or servers hosted on public cloud platforms such as AWS or GCP.

## Migrating VMware vSphere servers 

Migrating VMware vSphere servers refers to the process of moving virtual machines (VMs) hosted on VMware vSphere infrastructure to Microsoft Azure using the Azure Migrate: Migration and Modernization tool.

### Available migration methods

**Agentless (recommended)**: Use agentless replication with the Azure Migrate appliance to perform discovery, replication (using snapshots based on Changed Block Tracking), test migration, and final migration. This method doesn’t require installing agents inside guest operating systems. An automated hydration process prepares supported operating systems for successful boot in Azure. For more information, see [Migrate VMware vSphere servers](tutorial-migrate-vmware.md). 

**Agent-based**: Use agent-based replication with the Replication appliance and the Mobility service agent (installed per virtual machine) to enable replication and migration.
For more information, see [migrate VMware physical](tutorial-migrate-vmware.md)

## Migrating Hyper-V servers 

Migrating Hyper-V servers refers to the process of moving virtual machines (VMs) hosted on Hyper-V infrastructure to Microsoft Azure, typically using the Azure Migrate: Migration and Modernization tool. This process supports both agentless and agent-based migration methods depending on the environment and requirements.

### Available migration methods

**Agentless**: Install the Azure Site Recovery provider and Recovery Services agent directly on Hyper-V hosts or cluster nodes. No agents are required inside the virtual machines.

**Agent-based**: Use this method when host-level protection or connectivity requirements aren’t met. Treat the virtual machines as physical machines and install the Mobility service agent inside each VM to enable replication and migration.

Learn more about [Migrating Hyper-V servers](tutorial-migrate-hyper-v.md).
 
## Migrating Physical and Cloud-based Servers (AWS, GCP, Xen, KVM)

Migrating physical servers and non-traditional platforms (such as AWS, GCP, Xen, KVM, and private clouds) to Microsoft Azure involves treating these machines as physical servers and using agent-based replication via the Azure Migrate: Migration and Modernization tool.

### Available migration methods

**Agent-based**: Deploy the Replication appliance and install the Mobility service agent on each virtual machine to enable replication and migration. Use this method for VMware or Hyper-V workloads that don’t meet the requirements for agentless migration.

Learn more about [Migrating Physical and Cloud-based Servers (AWS, GCP, Xen, KVM)](tutorial-migrate-physical-virtual-machines.md).

## Next steps

- Learn more about [architecture overview for VMware Agentless migration](concepts-vmware-agentless-migration.md).
- Learn more about [architecture overview for Hyper-V migration](hyper-v-migration-architecture.md).
- Learn more about [architecture overview for Agent-based (physical or other) migration](../site-recovery/vmware-azure-architecture-modernized.md).
