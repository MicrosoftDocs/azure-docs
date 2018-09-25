---
title: What to do in the event of an Azure Storage outage | Microsoft Docs
description: What to do in the event of an Azure Storage outage
services: storage
author: tamram
ms.service: storage
ms.devlang: dotnet
ms.topic: article
ms.date: 09/13/2018
ms.author: tamram
ms.component: common
---

# What to do if an Azure Storage outage occurs
At Microsoft, we work hard to make sure our services are always available. Sometimes, forces beyond our control impact us in ways that cause unplanned service outages in one or more regions. To help you handle these rare occurrences, we provide the following high-level guidance for Azure Storage services.

## How to prepare
It is critical for every customer to prepare their own disaster recovery plan. The effort to recover from a storage outage typically involves both operations personnel and automated procedures in order to reactivate your applications in a functioning state. Please refer to the Azure documentation below to build your own disaster recovery plan:

* [Availability checklist](https://docs.microsoft.com/azure/architecture/checklist/availability)
* [Designing resilient applications for Azure](https://docs.microsoft.com/azure/architecture/resiliency/)
* [Azure Site Recovery service](https://azure.microsoft.com/services/site-recovery/)
* [Azure Storage replication](https://docs.microsoft.com/azure/storage/common/storage-redundancy)
* [Azure Backup service](https://azure.microsoft.com/services/backup/)

## How to detect
The recommended way to determine the Azure service status is to subscribe to the [Azure Service Health Dashboard](https://azure.microsoft.com/status/).

## What to do if a Storage outage occurs
If one or more Storage services are temporarily unavailable at one or more regions, there are two options for you to consider. If you desire immediate access to your data, please consider Option 2.

### Option 1: Wait for recovery
In this case, no action on your part is required. We are working diligently to restore the Azure service availability. You can monitor the service status on the [Azure Service Health Dashboard](https://azure.microsoft.com/status/).

### Option 2: Copy data from secondary
If you chose [Read-access geo-redundant storage (RA-GRS)](storage-redundancy-grs.md#read-access-geo-redundant-storage) (recommended) for your storage accounts, you will have read access to your data from the secondary region. You can use tools such as [AzCopy](storage-use-azcopy.md), [Azure PowerShell](storage-powershell-guide-full.md), and the [Azure Data Movement library](https://azure.microsoft.com/blog/introducing-azure-storage-data-movement-library-preview-2/) to copy data from the secondary region into another storage account in an unimpacted region, and then point your applications to that storage account for both read and write availability.

## What to expect if a Storage failover occurs
If you chose [Geo-redundant storage (GRS)](storage-redundancy-grs.md) or [Read-access geo-redundant storage (RA-GRS)](storage-redundancy-grs.md#read-access-geo-redundant-storage) (recommended), Azure Storage will keep your data durable in two regions (primary and secondary). In both regions, Azure Storage constantly maintains multiple replicas of your data.

When a regional disaster affects your primary region, we will first try to restore the service in that region to provides the best combination of RTO and RPO. Dependent upon the nature of the disaster and its impacts, in some rare occasions we may not be able to restore the primary region. At that point, we will perform a geo-failover. Cross-region data replication is an asynchronous process that involves a delay, so it is possible that changes which have not yet been replicated to the secondary region may be lost.

A couple of points regarding the storage geo-failover experience:

* Storage geo-failover will only be triggered by the Azure Storage team – there is no customer action required. The failover is triggered when the Azure Storage team has exhausted all options of restoring data in the same region, which provides the best combination of RTO and RPO.
* Your existing storage service endpoints for blobs, tables, queues, and files will remain the same after the failover; the Microsoft-supplied DNS entry will need to be updated to switch from the primary region to the secondary region. Microsoft will perform this update automatically as part of the geo-failover process.
* Before and during the geo-failover, you won't have write access to your storage account due to the impact of the disaster but you can still read from the secondary if your storage account has been configured as RA-GRS.
* When the geo-failover has been completed and the DNS changes propagated, read and write access to your storage account are restored if you have GRS or RA-GRS. The endpoint that was previously your secondary endpoint becomes your primary endpoint. 
* You can check the status of the primary location and query the last geo-failover time for your storage account. For more information, see [Storage Accounts - Get Properties](https://docs.microsoft.com/rest/api/storagerp/storageaccounts/getproperties).
* After the failover, your storage account will be fully functioning, but in a "degraded" state, as it is hosted in a standalone region with no geo-replication possible. To mitigate this risk, we will restore the original primary region and then do a geo-failback to restore the original state. If the original primary region is unrecoverable, we will allocate another secondary region.

## Best Practices for protecting your data
There are some recommended approaches to back up your storage data on a regular basis.

* VM Disks – Use the [Azure Backup service](https://azure.microsoft.com/services/backup/) to back up the VM disks used by your Azure virtual machines.
* Block blobs – Turn on [soft delete](../blobs/storage-blob-soft-delete.md) to protect against object-level deletions and overwrites, or copy the blobs to another storage account in another region using [AzCopy](storage-use-azcopy.md), [Azure PowerShell](storage-powershell-guide-full.md), or the [Azure Data Movement library](https://azure.microsoft.com/blog/introducing-azure-storage-data-movement-library-preview-2/).
* Tables – use [AzCopy](storage-use-azcopy.md) to export the table data into another storage account in another region.
* Files – use [AzCopy](storage-use-azcopy.md) or [Azure PowerShell](storage-powershell-guide-full.md) to copy your files to another storage account in another region.

For information about creating applications that take full advantage of the RA-GRS feature, please check out [Designing Highly Available Applications using RA-GRS Storage](../storage-designing-ha-apps-with-ragrs.md)
