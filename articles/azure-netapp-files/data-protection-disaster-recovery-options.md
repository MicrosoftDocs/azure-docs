---
title: Understand data protection and disaster recovery options in Azure NetApp Files
description: Learn about data protection and disaster recovery options available in Azure NetApp Files, including snapshots, backups, cross-zone replication, and cross-region replication.
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 07/11/2023
ms.author: anfdocs
---
# Understand data protection and disaster recovery options in Azure NetApp Files

Learn about the different data protection and disaster recovery features in Azure NetApp Files to understand what solutions best serve your needs.  

## Snapshots 

The foundation of data protection solutions including volume restores and clones and cross-region replication, Azure NetApp Files snapshot technology delivers stability, scalability, and swift recoverability without impacting performance.  

### Benefits 

- Efficient and frequent primary data protection for fast recovery from data corruption or loss 
- Revert a complete volume to a point-in-time snapshot in seconds 
- Restore a snapshot to new volume (clone) in seconds to test or develop with current data  
- Application-consistent snapshots with [AzAcSnap integration](azacsnap-introduction.md) and third party backup tools 

To learn more, see [How Azure NetApp Files Snapshots work](snapshots-introduction.md) and [Ways to restore data from snapshots](snapshots-introduction.md#ways-to-restore-data-from-snapshots). To create a Snapshot policy, see [Manage Snapshot policies in Azure NetApp Files](snapshots-manage-policy.md). 

## Backups

Azure NetApp Files supports a fully managed backup solution for long-term recovery, archive, and compliance. Backups can be restored to new volumes in the same region as the backup. Backups created by Azure NetApp Files are stored in Azure storage, independent of volume snapshots that are available for near-term recovery or cloning.   

### Benefits 

- Increased productivity, reliably integrated service that is easy to manage and can be set once 
- Application-consistent backups with [AzAcSnap integration](azacsnap-introduction.md)
- Retain daily, weekly, monthly backups for extended periods of time on cost-efficient cloud storage without media management 

To learn more, see [How snapshots can be vaulted for long-term retention and cost savings](snapshots-introduction.md#how-snapshots-can-be-vaulted-for-long-term-retention-and-cost-savings). To get started with backups, see [Configure policy-based backups for Azure NetApp Files](backup-configure-policy-based.md).  

## Cross-region replication 

Using snapshot technology, you can replicate your Azure NetApp Files across designated Azure regions to protect your data from unforeseeable regional failures. Cross-region replication minimizes data transfer costs, replicating only changed blocks across regions while also enabling a lower restore point objective.   

### Benefits 

- Provides disaster recovery across regions 
- Data availability and redundancy for remote data processing and user access 
- Efficient storage-based data replication without load on compute infrastructure 

To learn more, see [How volumes and snapshots are replicated cross-region for DR](snapshots-introduction.md#how-volumes-and-snapshots-are-replicated-cross-region-for-dr). To get started with cross-region replication, see [Create cross-region replication for Azure NetApp Files](cross-region-replication-create-peering.md). 

## Cross-zone replication 

Cross-zone replication leverages [availability zones](use-availability-zones.md) and the same replication engine as cross-region replication. This technology creating a fast and cost-effective solution for you to asynchronously replicate volumes from availability zone to another without the need for host-based data replication.  

### Benefits 

- Data availability and redundancy across zones within regions 
- Bring data into same zone as compute for lowest latency-envelope 
- Efficient storage-based data replication without load on compute infrastructure  
- Lower TCO due to absence of data transfer fees

To learn more, see [Understand cross-zone replication](cross-zone-replication-introduction.md). To get started with cross-zone replication, see [Create cross-zone replication relationships for Azure NetApp Files](create-cross-zone-replication.md). 

## Choose a data protection solution

Choosing the best data protection option for your Azure NetApp Files deployment depends on your configuration and needs. The following table can help you choose the best option for your use case.  

| Use case | In-region solution | Cross-region solution | 
| --- | --- | --- | 
| Ad hoc backup | On-demand snapshots | - | 
| Application consistent data protection | AzAcSnap | - | 
| Data corruption and ransomware protection | Scheduled snapshots | Cross-region replication | 
| Disaster recovery | - | Cross-region replication |
Fast data recovery (whole volume) | Revert volume from snapshot | Revert volume from snapshot | 
| Feed current production data to test or development environment | Restore snapshot to new volume (clone) | Restore snapshot to new volume (clone) |
| High availability and resiliency | Cross-zone replication | - | 
| Long-term data protection (greater than one week) | Azure NetApp Files backup | Azure NetApp Files backup | 
| Move volume to different zone | Cross-zone replication | - | 
| Primary data protection (up to one week) | Scheduled snapshots | - | 
| Remote data access | - | Cross-region replication |
| Selective (single-file) restore | Single-file snapshot restore | Single-file snapshot restore |
| Selective (single-file) restore from backup | Restore backup to new volume | - |

## Next steps

* [How Azure NetApp Files snapshots work](snapshots-introduction.md)
* [Understand Azure NetApp Files backup](backup-introduction.md)
* [Understand cross-region replication](cross-region-replication-introduction.md)
* [Understand cross-zone replication](cross-zone-replication-introduction.md)
* [What is Azure Application Consistent Snapshot tool](azacsnap-introduction.md)
* [Restore individual files using single-file snapshot restore](snapshots-restore-file-single.md)
* [Restore a snapshot to a new volume](snapshots-restore-new-volume.md)
* [Restore a volume using snapshot revert](snapshots-revert-volume.md)
