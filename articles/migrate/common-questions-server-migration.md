---
title: Common questions about Azure Migrate Server Migration
description: Get answers to common questions about Azure Migrate Server Migration
ms.topic: conceptual
ms.date: 06/03/2020
---

# Azure Migrate Server Migration: Common questions

This article answers common questions about the Azure Migrate: Server Migration. If you have further queries after reading this article, post them on the [Azure Migrate forum](https://aka.ms/AzureMigrateForum). If you have other questions, review these articles:

- [General questions](resources-faq.md) about Azure Migrate.
- [Questions](common-questions-appliance.md) about the Azure Migrate appliance.
- [Questions](common-questions-discovery-assessment.md) about the discovery, assessment, and dependency visualization.


## How does agentless VMware replication work?

The agentless replication method for VMware uses VMware snapshots, and VMware changed block tracking (CBT). An initial replication cycle is scheduled when the user starts replication. In the initial replication cycle, a snapshot of the VM is taken, and this snapshot is used to replicate the VMs VMDKs (disks). 
After the initial replication cycle is completed, delta replication cycles are scheduled periodically. In the delta replication cycle, a snapshot is taken, and data blocks that have changed since the previous replication cycle are replicated. VMware changed block tracking is used to determine blocks that have changed since the last cycle.
The frequency of the periodic replication cycles is automatically managed by the service depending on how many other VMs/disks are concurrently replicating off the same datastore and in ideal conditions will eventually converge to 1 cycle per hour per VM.

When you migrate, an on-demand replication cycle is scheduled for the VM to capture any remaining data. You can choose to Shut down the VM as part of the migration to ensure zero data loss and application consistency.

## Why is the resynchronization option not exposed in agentless stack?

In agentless stack, in every delta cycle, we transfer the diff between the current snapshot and the previous snapshot that we had taken. Since it is always a diff between snapshots, this gives the advantage of folding the data (i.e. if a particular sector is written 'n' times between the snapshots, we only need to transfer the last write, as we are interested only in the last sync). This is different from the agent-based stack in which we track every write and apply them. This means every delta cycle is a resynchronization. Hence, there is no resynchronization option exposed. 

If ever the disks are out of sync because of a failure, it is fixed in the next cycle. 

## What is the impact of churn rate if I use agentless replication?

Since the stack is dependent on the data being folded, more than the churn rate, the churn pattern is what matters in this stack. A pattern in which a file is being written again and again doesn’t have much impact. However, a pattern in which every other sector is written will cause high churn in the next cycle. Since we minimize the amount of data we transfer, we allow the data to fold as much as possible before scheduling the next cycle.  

## How frequently is a replication cycle scheduled?

The formula to schedule the next replication cycle is this: (Previous cycle time / 2) or 1 hour whichever is higher. For example, if a VM took four hours for a delta cycle, we'll schedule its next cycle in 2 hours and not in the next hour. This is different when the cycle is immediately after IR, where we schedule the first delta cycle immediately.

## What is the impact on performance of vCenter Server or ESXi host while using agentless replication?

Since agentless replication uses snapshots, there will be IOPs consumption on storage, and customers will need some IOPs headroom on the storage. We don’t recommend using this stack on storage/IOPs constrained environment.

## Does agentless migration stack support migration of UEFI VMs to Azure Gen 2 VMs?

No, you must use ASR to migrate these VMs to Gen 2 Azure VMs. 

## Can I pin my VMs to Azure Availability Zones when I migrate?

No, support for Azure Availability Zones is not there.

## Which transport protocol is used by Azure Migrate during replication?

Azure Migrate uses Network Block Device (NBD) protocol with SSL encryption.

## What is the minimum vCenter Server version required for migration?

You need to have at least vCenter Server 5.5 and VMware vSphere ESXi host version 5.5.

## Can customers migrate their VMs to unmanaged disks?

No. Azure Migrate supports migration only to managed disks (standard HDD, premium SSD).

## How many VMs can replicate simultaneously using agentless VMware stack?

Currently, customers can migrate 100 VMs per vCenter Server simultaneously. This can be done in batches of 10 VMs.




