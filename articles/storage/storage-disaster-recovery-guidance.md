<properties
	pageTitle="What to do in the event of an Azure Storage outage | Microsoft Azure"
	description="What to do in the event of an Azure Storage outage"
	services="storage"
	documentationCenter=".net"
	authors="robinsh"
	manager="carmonm"
	editor="tysonn"/>

<tags
	ms.service="storage"
	ms.workload="storage"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="08/03/2016"
	ms.author="robinsh"/>


# What to do if an Azure Storage outage occurs

At Microsoft, we work hard to make sure our services are always available. Sometimes, forces beyond our control impact us in ways that cause unplanned service outages in one or more regions. To help you handle these rare occurrences, we provide the following high-level guidance for Azure Storage services.

## How to prepare 

It is critical for every customer to prepare their own disaster recovery plan. The effort to recover from a storage outage typically involves both operations personnel and automated procedures in order to reactivate your applications in a functioning state. Please refer to the Azure documentation below to build your own disaster recovery plan:

-   [Disaster recovery and high availability for Azure applications](../resiliency/resiliency-disaster-recovery-high-availability-azure-applications.md)

-   [Azure resiliency technical guidance](../resiliency/resiliency-technical-guidance.md)

-   [Azure Site Recovery service](https://azure.microsoft.com/services/site-recovery/)

-   [Azure Storage replication](storage-redundancy.md)

-   [Azure Backup service](https://azure.microsoft.com/services/backup/)

## How to detect 

The recommended way to determine the Azure service status is to subscribe to the [Azure Service Health Dashboard](https://azure.microsoft.com/status/).

## What to do if a Storage outage occurs

If one or more Storage services are temporarily unavailable at one or more regions, there are two options for you to consider. If you desire immediate access to your data, please consider Option 2.

### Option 1: Wait for recovery

In this case, no action on your part is required. We are working diligently to restore the Azure service availability. You can monitor the service status on the [Azure Service Health Dashboard](https://azure.microsoft.com/status/).

### Option 2: Copy data from secondary

If you chose [Read-access geo-redundant storage (RA-GRS)](storage-redundancy.md#read-access-geo-redundant-storage) (recommended) for your storage accounts, you will have read access to your data from the secondary region. You can use tools such as [AzCopy](storage-use-azcopy.md), [Azure PowerShell](storage-powershell-guide-full.md), and the [Azure Data Movement library](https://azure.microsoft.com/blog/introducing-azure-storage-data-movement-library-preview-2/) to copy data from the secondary region into another storage account in an unimpacted region, and then point your applications to that storage account for both read and write availability.

## What to expect if a Storage failover occurs

If you chose [Geo-redundant storage (GRS)](storage-redundancy.md#geo-redundant-storage) or [Read-access geo-redundant storage (RA-GRS)](storage-redundancy.md#read-access-geo-redundant-storage) (recommended), Azure Storage will keep your data durable in two regions (primary and secondary). In both regions, Azure Storage constantly maintains multiple replicas of your data.

When a regional disaster affects your primary region, we will first try to restore the service in that region. Dependent upon the nature of the disaster and its impacts, in some rare occasions we may not be able to restore the primary region. At that point, we will perform a geo-failover. The cross-region data replication is an asynchronous process which can involve a delay, so it is possible that changes that have not yet been replicated to the secondary region may be lost. You can query the [“Last Sync Time” of your storage account](https://blogs.msdn.microsoft.com/windowsazurestorage/2013/12/11/windows-azure-storage-redundancy-options-and-read-access-geo-redundant-storage/) to get details on the replication status.

A couple of points regarding the storage geo-failover experience:

-   Storage geo-failover will only be triggered by the Azure Storage team – there is no customer action required.

-   Your existing storage service endpoints for blobs, tables, queues, and files will remain the same after the failover; the DNS entry will need to be updated to switch from the primary region to the secondary region.

-   Before and during the geo-failover, you won’t have write access to your storage account due to the impact of the disaster but you can still read from the secondary if your storage account has been configured as RA-GRS.

-   When the geo-failover has been completed and the DNS changes propagated, your read and write access to your storage account will be resumed. You can query [“Last Geo Failover Time” of your storage account](https://msdn.microsoft.com/library/azure/ee460802.aspx) to get more details.

-   After the failover, your storage account will be fully functioning, but in a “degraded” status, as it is actually hosted in a standalone region with no geo-replication possible. To mitigate this risk, we will restore the original primary region and then do a geo-failback to restore the original state. If the original primary region is unrecoverable, we will allocate another secondary region.
For more details on the infrastructure of Azure Storage geo replication, please refer to the article on the Storage team blog about [Redundancy Options and RA-GRS](https://blogs.msdn.microsoft.com/windowsazurestorage/2013/12/11/windows-azure-storage-redundancy-options-and-read-access-geo-redundant-storage/).

##Best Practices for protecting your data

There are some recommended approaches to back up your storage data on a regular basis.

-   VM Disks – Use the [Azure Backup service](https://azure.microsoft.com/services/backup/) to back up the VM disks used by your Azure virtual machines.

-   Block blobs –Create a [snapshot](https://msdn.microsoft.com/library/azure/hh488361.aspx) of each block blob, or copy the blobs to another storage account in another region using [AzCopy](storage-use-azcopy.md), [Azure PowerShell](storage-powershell-guide-full.md), or the [Azure Data Movement library](https://azure.microsoft.com/blog/introducing-azure-storage-data-movement-library-preview-2/).

-   Tables – use [AzCopy](storage-use-azcopy.md) to export the table data into another storage account in another region.

-   Files – use [AzCopy](storage-use-azcopy.md) or [Azure PowerShell](storage-powershell-guide-full.md) to copy your files to another storage account in another region.
