---
title: Common questions about Azure Migrate Server Migration
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

1. When you start replication, an initial replication cycle is scheduled. In the initial cycle, a snapshot of the VM is taken. This snapshot is used to replicate the VMs VMDKs (disks). 
2. After the initial replication cycle finishes, delta replication cycles are scheduled periodically.
    - During delta replication, a snapshot is taken, and data blocks that have changed since the previous replication cycle are replicated.
    - VMware CBT is used to determine blocks that have changed since the last cycle.
    - The frequency of the periodic replication cycles is automatically managed by the Azure Migrate, depending on how many other VMs/disks are concurrently replicating from the same datastore. In ideal conditions, replication eventually converges to one cycle per hour for each VM.

When you migrate, an on-demand replication cycle is scheduled for the machine to capture any remaining data. To ensure zero data loss and application consistency, you can choose to shut down the machine during migration.

## Why isn't resynchronization exposed?

During agentless migration, in every delta cycle, the difference between the current snapshot and the previously taken snapshot is written. It's always the difference between snapshots, folding data in. If a specific sector is written *N* times between snapshots, only the last write needs to be transferred because we are interested only in the last sync. The process is different from agent-based replication, where we track and apply every write. In this process, every delta cycle is a resynchronization. So, no resynchronization option exposed. If ever the disks aren't synchronized because of a failure, it's fixed in the next cycle. 

## How does churn rate affect agentless replication?

Because agentless replication folds date, the *churn pattern* is more important that the *churn rate*. When a file is written again and again, the rate doesn’t have much impact. However, a pattern in which every other sector is written causes high churn in the next cycle. Because we minimize the amount of data we transfer, we allow the data to fold as much as possible before we schedule the next cycle.  

## How frequently is a replication cycle scheduled?

The formula to schedule the next replication cycle is (Previous cycle time / 2) or 1 hour, whichever is higher.

For example, if a VM takes four hours for a delta cycle, the next cycle is scheduled in two hours, and not in the next hour. The process is different immediately after initial replication, where the first delta cycle is scheduled immediately.

## How does agentless replication affect VMware servers?

Agentless replication results in some performance impact on vCenter Server and ESXi hosts. Because agentless replication uses snapshots, it consumes IOPS on storage, and some IOPS storage bandwidth is required. We don’t recommend using agentless replication if you have constraints on storage/IOPs in your environment.

## Can I do agentless migration of UEFI VMs to Azure Gen 2?

No. Use Azure Site Recovery to migrate these VMs to Gen 2 Azure VMs. 

## Can I pin VMs to Azure Availability Zones when I migrate?

No. Azure Availability Zones aren't supported for Azure Migrate migration.

## What transport protocol does Azure Migrate use during replication?

Azure Migrate uses the Network Block Device (NBD) protocol with SSL encryption.

## What is the minimum vCenter Server version required for migration?

You must have at least VMware vCenter Server 5.5 and VMware vSphere ESXi host version 5.5.

## Can customers migrate their VMs to unmanaged disks?

No. Azure Migrate supports migration only to managed disks (Standard HDD, Premium SSD).

## How many VMs can I replicate at one time by using agentless migration?

Currently, you can migrate 100 VMs per instance of vCenter Server simultaneously. Migrate in batches of 10 VMs.
 