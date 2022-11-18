---
title: Common questions about Azure Site Recovery monitoring 
description: Get answers to common questions about Azure Site Recovery monitoring, using inbuilt monitoring and Azure Monitor (Log Analytics)
ms.service: site-recovery
services: site-recovery
ms.date: 07/31/2019
ms.topic: conceptual
ms.author: ankitadutta
author: ankitaduttaMSFT
---
# Common questions about Site Recovery monitoring

This article answers common questions about monitoring Azure [Site Recovery](site-recovery-overview.md), using inbuilt Site Recovery monitoring, and Azure Monitor (Log Analytics).

## General

### How is the RPO value logged different from the latest available recovery point?

Site Recovery uses a multi-step, asynchronous process to replicate machines to Azure.

- In the penultimate step of replication, recent changes on the machine, along with metadata, are copied into a log/cache storage account.
- These changes, along with the tag that identifies a recoverable point, are written to the storage account/managed disk in the target region.
- Site Recovery can now generate a recoverable point for the machine.
- At this point, the RPO has been met for the changes uploaded to the storage account so far. In other words, the machine RPO at this point is equal to amount of time that's elapsed from the timestamp corresponding to the recoverable point.
- Now, Site Recovery picks the uploaded data from the storage account, and applies it to the replica disks created for the machine.
- Site Recovery then generates a recovery point, and makes this point available for recovery at failover.
- Thus, the latest available recovery point indicates the timestamp corresponding to the latest recovery point that has already been processed, and applied to the replica disks.


An incorrect system time on the replicating source machine, or on on-premises infrastructure servers, will skew the computed RPO value. For accurate RPO reporting, make sure that the system clock is accurate on all servers and machines.



## Inbuilt Site Recovery logging


### Why is the VM count in the vault infrastructure view different from the total count shown in Replicated Items?

The vault infrastructure view is scoped by replication scenarios. Only machines in the currently selected replication scenario are included in the count for the view. In addition, we only count VMs that are configured to replicate to Azure. Failed over machines, or machines replicating back to an on-premises site, aren't counted in the view.

### Why is the count of replicated items in Essentials different from the total count of replicated items on the dashboard?

Only machines for which initial replication has completed are included in the count shown in Essentials. The replicated items total includes all the machines in the vault, including those for which initial replication is currently in progress.

## Azure Monitor logging


### How often does Site Recovery send resource logs to Azure Monitor Log? 

- AzureSiteRecoveryReplicationStats and AzureSiteRecoveryRecoveryPoints are sent every 15 minutes.  
- AzureSiteRecoveryReplicationDataUploadRate and AzureSiteRecoveryProtectedDiskDataChurn are sent every five minutes. 
- AzureSiteRecoveryJobs is sent at the trigger and completion of a job.
- AzureSiteRecoveryEvents is sent whenever an event is generated. 
- AzureSiteRecoveryReplicatedItems is sent whenever there is any environment change. Typically, the data refresh time is 15 minutes after a change. 

### How long is data kept in Azure Monitor logs? 

By default, retention is for 31 days. You can increase the period in the **Usage and Estimated Cost** section in the Log Analytics workspace. Click on **Data Retention**, and choose the range.

### What's the size of the resource logs? 

Typically the size of a log is 15-20 KB. 


## Next steps

Learn how to monitor with [Site Recovery inbuilt monitoring](site-recovery-monitor-and-troubleshoot.md), or [Azure Monitor](monitor-log-analytics.md).


