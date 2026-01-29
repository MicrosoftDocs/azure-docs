---
title: Understand Azure NetApp Files zone-redundant storage service level
description: Understand the unique qualities of Elastic zone-redundant storage, which delivers built-in local redundancy is designed as a more affordable alternative. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: article
ms.date: 01/29/2026
ms.author: anfdocs
ms.custom: references-regions 
---

# Understand Azure NetApp Files zone-redundant storage service level (preview)

Azure NetApp Files Elastic zone-redundant storage is a high-availability storage service level for Azure NetApp Files that synchronously replicates your data across multiple Azure Availability Zones in a single region. This means if one zone experiences an outage, your data and applications remain available from the other zones with zero data loss. Azure NetApp Files Elastic zone-redundant storage delivers similar enterprise-grade features as other Azure NetApp Files service levels (support for NFSv3, NFSv4.1, SMB, snapshots, clones, encryption, backup) but with built-in multi-availability zone redundancy. It eliminates single points of failure, ensuring continuous data access even during an entire zone outage.

>[!NOTE]
>When creating your NetApp account, you must designate that the [account is for Elastic zone-redundant storage](elastic-zone-redundant-concept.md). An Elastic NetApp account can only be used for Elastic zone-redundant storage.

## High availability storage 

Modern enterprises need strong in-region resiliency for data and applications, as even one Availability Zone failure can disrupt operations. Previously, Azure NetApp Files customers relied on duplicate volumes or cross-region replication to protect against outages, which increased cost and complexity.

Azure NetApp Files Elastic zone-redundant storage now offers built-in multi-AZ high availability by protecting against zone failures within the service itself, eliminating external replication or secondary volume management. Organizations in industries such as finance, healthcare, and government can now get transparent, always-on storage availability without custom DR scripts or moving data out of the region.

Azure NetApp Files Elastic zone-redundant storage synchronously replicates data across zones and automates failover, so a zone outage doesn't affect application availability. Customers get zero data loss, minimal downtime, and simplified operations all managed natively, making Azure NetApp Files Elastic zone-redundant storage a strategic choice for continuous data access in Azure.

## Zone-redundant architecture and synchronous replication 

Azure NetApp Files Elastic zone-redundant storage delivers uncompromising, enterprise-grade high availability by leveraging Azure’s Zone-Redundant Storage architecture at the file storage layer. Here’s how it works:

* **Synchronous multi-availability zone replication**: When your application writes data, Azure NetApp Files simultaneously writes that data across availability zones within one region before acknowledging the write-back. This simultaneous mirroring guarantees that each zone’s copy is always identical.  

* **Automatic, transparent failover**: If a zone fails, failover is triggered automatically with no action required on your part. The storage endpoint doesn't change, so applications resume I/O using the same mount path after a brief interruption without needing remounts or reconfiguration. RTO approaches zero, ensuring critical workloads stay online.

* **Zone preference for performance**: Choose your preferred zone for active data, aligning storage with compute to minimize read latency. Failover remains seamless with always-on resilience built in to the service level.

* **Operational simplicity**: High availability is a one-click setup. Azure manages everything from replication to synchronization and failover. No scripts, no manual steps, no complexity. You can manage Elastic zone-redundant storage volumes just like any other with confidence.

:::image type="content" source="./media/elastic-zone-redundant-concept/elastic-architecture.png" alt-text="Diagram of Elastic zone-redundant regions and availability zones." lightbox="./media/elastic-zone-redundant-concept/elastic-architecture.png":::

## Benefits 

Elastic zone-redundant storage offers several key benefits for resiliency, operations, and cost-efficiency.

| Benefit | Description | 
| - | - | 
| Multi-availability zone resilience with zero data loss | Your storage volume is protected against zone failures with synchronous writes across all availability zones, delivering an RPO of zero and ensuring no data loss during an availability zone outage. Elastic zone-redundant storage provides high resilience for mission-critical workloads. |
| Operational simplicity | Azure manages replication and failover automatically, eliminating the need for duplicate volumes or cross‑zone replication. High availability becomes a one‑click setup, simplifying operations and reducing configuration risk.|
| Extensive feature support | Elastic zone-redundant storage volumes support a growing set of Azure NetApp Files features, including NFSv3, NFSv4.1, and SMB, along with capabilities including snapshots, backups, customer‑managed keys, and Active Directory integration, delivering enhanced resiliency as feature coverage continues to expand. |
| Cost-effective high availability | Azure NetApp Files Elastic zone-redundant storage delivers multi‑availability zone redundancy more cost‑effectively than duplicate standby volumes by using all provisioned capacity with no idle replicas. You pay for a single resilient volume, improving utilization, lowering TCO, and avoiding the added egress and administrative costs of external replication solutions. |
| Metadata performance | Beyond consistent throughput, Azure NetApp Files Elastic zone-redundant storage redefines performance for metadata-heavy workloads. This is critical for SAP shared files and similar environments where metadata operations drive application responsiveness. The shared QoS architecture dynamically allocates IOPS across volumes to maintain low-latency, metadata-intensive operations consistently, even across multiple availability zones. |

## Supported regions

* Australia East
* Canada Central 
* Central US 
* South Central US
* UK South 
* West Europe

### Best practice

* Because some regions only have two availability zones, confirm supported availability zones in the region before deploying zone-redundant storage. Use the REST API call: 

```
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.NetApp/locations/{location}/elasticRegionInfo?api-version=2025-09-01-preview
```

## Comparison of service levels

>[!IMPORTANT]
>Elastic zone-redundant storage has [dedicated endpoints](#api-endpoints). Workflows for this service level are different than other service levels. Ensure you follow the correct guidelines for your service level. 

| Feature | Flexible, Standard, Premium, and Ultra service levels | Elastic zone-redundant service level | 
| - | - | - | 
| Performance | High performance storage optimized for enterprise workloads | Optimized for workloads that require continuous in‑region availability across multiple availability zones. | 
| Data management | Snapshots, cross-zone and cross-region replication, backups | Snapshots and backups | 
| Protocol support | NFS, SMB, and dual-protocol (NFS and SMB) | NFS and SMB | 
| Integrated backup | Integrated backup and recovery | Integrated backup and recovery | 
| Price | Premium pricing for enterprise features | Cost-optimized for smaller workloads |

### API endpoints

The Elastic zone-redundant service level has dedicated API endpoints. This table identifies the different endpoints for service levels. 

| Resource type | Elastic zone-redundant endpoint | Flexible, Standard, Premium, and Ultra endpoint |
|-|---|---|
| Accounts | /elasticAccounts | /netAppAccounts |
| Backups | /elasticAccounts/{accountName}/elasticBackupVaults/{vaultName}/elasticBackups | /netAppAccounts/{accountName}/backupVaults/{vaultName}/backups |
| Backup policies | /elasticAccounts/{accountName}/elasticBackupPolicies | /netAppAccounts/{accountName}/backupPolicies |
| Backup vaults | /elasticAccounts/{accountName}/elasticBackupVaults | /netAppAccounts/{accountName}/backupVaults | 
| Capacity pools | /elasticAccounts/{accountName}/elasticCapacityPools | /netAppAccounts/{accountName}/capacityPools |
| Change zone | /elasticCapacityPools/{poolName}/changeZone | N/A |
| Region info | /locations/{location}/elasticRegionInfos | /locations/{location}/regionInfo
| Snapshots | /elasticAccounts/{accountName}/elasticCapacityPools/{poolName}/elasticVolumes/{volumeName}/elasticSnapshots | /netAppAccounts/{accountName}/capacityPools/{poolName}/volumes/{volumeName}/snapshots |
| Snapshot policies | /elasticAccounts/{accountName}/elasticSnapshotPolicies | /netAppAccounts/{accountName}/snapshotPolicies/{snapshotPolicyName} |
| Volumes | /elasticAccounts/{accountName}/elasticCapacityPools/{poolName}/elasticVolumes | /netAppAccounts/{accountName}/capacityPools/{poolName}/volumes/{volumeName} |
| Volume file path availability | /elasticAccounts/{accountName}/elasticCapacityPools/{poolName}/checkVolumeFilePathAvailability | /locations/{location}/checkFilePathAvailability |

For more detailed information, see [Azure NetApp Files REST API](/rest/api/netapp).

## Next steps 

- [Storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
- [Create a NetApp account](azure-netapp-files-create-netapp-account.md)
- [Set up a capacity pool](azure-netapp-files-set-up-capacity-pool.md)
- [Azure NetApp Files resource limits](azure-netapp-files-resource-limits.md)