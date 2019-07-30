---
title: Common questions about Azure Site Recovery monitoring | Microsoft Docs'
description: Get answers to common questions about Azure Site Recovery monitoring.
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
services: site-recovery
ms.date: 07/30/2019
ms.topic: conceptual
ms.author: raynew
---
# Common questions about Site Recovery monitoring

This article answers common questions about monitoring Azure [Site Recovery](site-recovery-overview.md).

## General

### How is the RPO value logged different from the latest available recovery point?

Site Recovery uses a multi-step, asynchronous process to replicate machines to Azure.

- In the penultimate step of replication, recent changes on the machine, along with metadata, are copied into a log/cache storage account.
- These changes, along with the tag to identify a recoverable point, are written to the storage account/managed disk in the target region.
- Site Recovery can now generate a recoverable point for the machine.
- At this point, the RPO has been met for the changes uploaded to the storage account thus far. In other words, the machine RPO at this point is equal to amount of time elapsed from the timestamp corresponding to the recoverable point.
- Now, Site Recovery picks the uploaded data from the storage account, and applies it to the replica disks created for the machine.
- Site Recovery then generates a recovery point, and makes this point available for recovery at failover.
- Thus the latest available recovery point indicates the timestamp corresponding to the latest recovery point that has already been processed and applied to the replica disks.


An incorrect system time on the replicating source machine, or on on-premises infrastructure servers, will skew the computed RPO value. For accurate RPO reporting, make sure that the system clock is accurate on all servers and machines.



## Inbuild Site Recovery logging


### Why is the VM count in the vault infrastructure view different from the total count shown in the replicated items?

The vault infrastructure view is scoped by replication scenarios. Only machines in currently selected replication scenario are included in the count for the view. In addition, we only count VMs that are configured to replicate to Azure. Failed over machines, or machines replicating back to an on-premises site aren't counted in the view.

### Why is the count of replicated items in the Essentials drawer different from the total count of replicated items on the dashboard?

Only machines for which initial replication has completed are included in the count shown in the Essentials drawer. On the replicated items the total includes all the machines in the vault, including those for which initial replication is currently in progress.

## Azure Monitor logging

### How often does Site Recovery send the diagnostic logs sent to Log Analytics? 

- AzureSiteRecoveryReplicationStats and AzureSiteRecoveryRecoveryPoints are sent every 15 minutes.  
- AzureSiteRecoveryReplicationDataUploadRate and AzureSiteRecoveryProtectedDiskDataChurn are sent every 5 minutes. 
- AzureSiteRecoveryJobs is sent at the trigger and completion of a job 
- AzureSiteRecoveryEvents is sent whenever an event is generated 
- AzureSiteRecoveryReplicatedItems is sent whenever there is any environment change. Typically the data refresh time is 15 minutes post a change. 

### How log is data kept in Log Analytics? 

By default, the retention is for 31 days. You can increase it by going to Usage and Estimated Cost section within your workspace. Click on Data Retention and choose the range suited to your needs. 

### What's the size of the diagnostic logs? 

Typically the size of a log is 15-20 KB. 


## Next steps

Learn how to monitor with [Site Recovery inbuilt monitoring](site-recovery-monitor-and-troubleshoot.md), or [Azure Monitor](monitor-log-analytics.md).


