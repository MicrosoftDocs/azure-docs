---
title: Azure Migrate Server Migration FAQ
description: Get answers to common questions about using Azure Migrate Server Migration to migrate machines.
ms.topic: conceptual
ms.date: 02/17/2020
---

# Azure Migrate Server Migration: Common questions

This article answers common questions about the Azure Migrate: Server Migration tool. If you have other questions, check these resources:

- [General questions](resources-faq.md) about Azure Migrate
- Questions about the [Azure Migrate appliance](common-questions-appliance.md)
- Questions about [discovery, assessment, and dependency visualization](common-questions-discovery-assessment.md)
- Get questions answered in the [Azure Migrate forum](https://aka.ms/AzureMigrateForum)

## How does agentless VMware replication work?

The agentless replication method for VMware uses VMware snapshots and VMware Changed Block Tracking (CBT).

Here's the process:

1. When you start replication, an initial replication cycle is scheduled. In the initial cycle, a snapshot of the VM is taken. The snapshot is used to replicate the VMs VMDKs (disks). 
2. After the initial replication cycle finishes, delta replication cycles are scheduled periodically.
    - During delta replication, a snapshot is taken, and data blocks that have changed since the previous replication cycle are replicated.
    - VMware CBT is used to determine blocks that have changed since the last cycle.
    - The frequency of the periodic replication cycles is automatically managed by Azure Migrate and depends on how many other VMs and disks are concurrently replicating from the same datastore. In ideal conditions, replication eventually converges to one cycle per hour for each VM.

When you migrate, an on-demand replication cycle is scheduled for the machine to capture any remaining data. To ensure zero data loss and application consistency, you can choose to shut down the machine during migration.

## Why isn't resynchronization exposed?

During agentless migration, in every delta cycle, the difference between the current snapshot and the previously taken snapshot is written. It's always the difference between snapshots, folding data in. If a specific sector is written *N* times between snapshots, only the last write needs to be transferred because we are interested only in the last sync. The process is different from agent-based replication, during which we track and apply every write. In this process, every delta cycle is a resynchronization. So, no resynchronization option exposed. If the disks ever are not synchronized because of a failure, it's fixed in the next cycle. 

## How does churn rate affect agentless replication?

Because agentless replication folds in data, the *churn pattern* is more important than the *churn rate*. When a file is written again and again, the rate doesn't have much impact. However, a pattern in which every other sector is written causes high churn in the next cycle. Because we minimize the amount of data we transfer, we allow the data to fold as much as possible before we schedule the next cycle.  

## How frequently is a replication cycle scheduled?

The formula to schedule the next replication cycle is (previous cycle time / 2) or one hour, whichever is higher.

For example, if a VM takes four hours for a delta cycle, the next cycle is scheduled in two hours, and not in the next hour. The process is different immediately after initial replication, when the first delta cycle is scheduled immediately.

## How does agentless replication affect VMware servers?

Agentless replication results in some performance impact on VMware vCenter Server and VMware ESXi hosts. Because agentless replication uses snapshots, it consumes IOPS on storage, so some IOPS storage bandwidth is required. We don't recommend using agentless replication if you have constraints on storage or IOPs in your environment.

## Can I do agentless migration of UEFI VMs to Azure Gen 2?

No. Use Azure Site Recovery to migrate these VMs to Gen 2 Azure VMs. 

## Can I pin VMs to Azure Availability Zones when I migrate?

No. Azure Availability Zones aren't supported for Azure Migrate migration.

## What transport protocol does Azure Migrate use during replication?

Azure Migrate uses the Network Block Device (NBD) protocol with SSL encryption.

## What is the minimum vCenter Server version required for migration?

You must have at least vCenter Server 5.5 and vSphere ESXi host version 5.5.

## Can customers migrate their VMs to unmanaged disks?

No. Azure Migrate supports migration only to managed disks (Standard HDD, Premium SSD).

## How many VMs can I replicate at one time by using agentless migration?

Currently, you can migrate 100 VMs per instance of vCenter Server simultaneously. Migrate in batches of 10 VMs.

## How do I throttle replication in using Azure Migrate appliance for agentless VMware replication?  

You can throttle using NetQosPolicy. For example:

The AppNamePrefix to use in the NetQosPolicy is "GatewayWindowsService.exe". You could create a policy on the Azure Migrate appliance to throttle replication traffic from the appliance by creating a policy such as this one:
 
New-NetQosPolicy -Name "ThrottleReplication" -AppPathNameMatchCondition "GatewayWindowsService.exe" -ThrottleRateActionBitsPerSecond 1MB

## When do I migrate machines as physical servers?

Migrating machines by treating them as physical servers is useful in a number of scenarios:

- When you're migrating on-premises physical servers.
- If you're migrating VMs virtualized by platforms such as Xen, KVM.
- To migrate Hyper-V or VMware VMs, if for some reason you're unable to use the standard migration process for [Hyper-V](tutorial-migrate-hyper-v.md), or [VMware](server-migrate-overview.md) migration. For example if you're not running VMware vCenter, and are using ESXi hosts only.
- To migrate VMs that are currently running in private clouds to Azure
- If you want to migrate VMs running in public clouds such as Amazon Web Services (AWS) or Google Cloud Platform (GCP), to Azure.

## Do I need VMware vCenter to migrate VMware VMs?
To [migrate VMware VMs](server-migrate-overview.md) using VMware agent-based or agentless migration, ESXi hosts on which VMs are located must be managed by vCenter Server. If you don't have vCenter Server, you can migrate VMware VMs by migrating them as physical servers. [Learn more](migrate-support-matrix-physical-migration.md).
 
## Next steps

Read the [Azure Migrate overview](migrate-services-overview.md).
