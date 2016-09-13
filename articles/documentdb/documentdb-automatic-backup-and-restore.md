<properties
	pageTitle="Automatic backup and restore with DocumentDB | Microsoft Azure"
	description="Learn how to perform automatic backup and restore of NoSQL databases with Azure DocumentDB."
	keywords="backup and restore, automatic backup"
	services="documentdb"
	documentationCenter=""
	authors="mimig1"
	manager="jhubbard"
	editor="monicar"/>

<tags
	ms.service="documentdb"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="multiple"
	ms.topic="article"
	ms.date="09/13/2016"
	ms.author="raprasa"/>

# Automatic backup and restore with DocumentDB 

Azure DocumentDB automatically takes backups of all your data at regular intervals. The automatic backups are taken without affecting the performance or availability of your NoSQL database operations. All your backups are stored separately in another storage service, and those backups are globally replicated for resiliency against regional disasters. The automatic backups are intended for scenarios when you accidentally delete your DocumentDB collection and later want to restore it.  

This article starts with a quick recap of the data redundancy and availability in DocumentDB, and then discusses backups. 

## High availability with DocumentDB - a quick recap 

DocumentDB is designed to be [globally distributed](documentdb-distribute-data-globally.md) – it allows you to scale throughput across multiple Azure regions along with policy driven failover and transparent multi-homing APIs. As a database system offering [99.99% availability SLAs](https://azure.microsoft.com/support/legal/sla/documentdb/v1_0/), all the writes in DocumentDB are durably committed by a quorum of replicas within a local data center. Additionally, if your database account is associated with more than one Azure region, your writes are replicated across other regions as well. To scale your throughput and access data at low latencies, you can have as many read regions associated with your database account as you like. In each read region, the (replicated) data is durably persisted across a replica set.  

As illustrated in the following diagram, a single DocumentDB collection is [horizontally partitioned](documentdb-partition-data.md). A “partition” is denoted by a circle in the following diagram, and each partition is made highly available via a replica set. This is the local distribution within a single Azure region (denoted by the X axis). Further, each partition (with its corresponding replica set) is then globally distributed across multiple regions associated with your database account (for example, in this illustration the three regions – East US, West US and Central India). The “partition set” is a globally distributed entity comprising of multiple copies of your data in each region (denoted by the Y axis). You can assign priority to the regions associated with your database account and DocumentDB will transparently failover to the next region in case of disaster. You can also manually simulate failover to test the end-to-end availability of your application.  

The following images illustrate the high degree of redundancy with DocumentDB.

![High degree of redundancy with DocumentDB](./media/documentdb-automatic-backup-and-restore/azure-documentdb-nosql-database-redundancy.png)


![High degree of redundancy with DocumentDB](./media/documentdb-automatic-backup-and-restore/azure-documentdb-nosql-database-global-distribution.png)

## Full backups for “Oops I deleted my collection or database” scenario

With DocumentDB, not only your data, but the backups of your data are also made highly redundant and resilient to regional disasters. For this, DocumentDB automatically takes backups of all your data periodically. Internally, the frequency of backup is configurable on a per database account basis. Currently, full backups are taken approximately every four hours but this is subject to change. 

The backups are taken without affecting the performance or availability of your database operations. DocumentDB takes the backup in the background without consuming your provisioned RUs or affecting the performance and without affecting the availability of your NoSQL database. 

Unlike your data that is stored inside DocumentDB, the automatic backups are stored in Azure Blob Storage service. To guarantee the low latency/efficient upload, the snapshot of your backup is uploaded to an instance of Azure Blob storage in the same region as the current write region of your DocumentDB database account. For resiliency against regional disaster, each snapshot of your backup data in Azure Blob Storage is again replicated via geo-redundant storage (GRS) to another region. The following diagram shows that the entire DocumentDB collection (with all three primary partitions in West US, in this example) is backed up in a remote Azure Blob Storage account in West US and then GRS replicated to East US. 

The following image illustrates periodic full backups of all DocumentDB entities in GRS Azure Storage.

![Periodic full backups of all DocumentDB entities in GRS Azure Storage](./media/documentdb-automatic-backup-and-restore/azure-documentdb-nosql-database-automatic-backup.png)


## Retention period for a given snapshot

While we periodically take snapshots of your data for automatic backup, for compliance reasons, each snapshot of data is stored for at least 30 days and up to 90 days before we eventually purge it. Internally, this retention interval is configurable on a per database account basis. 

## Restoring your data from the backup

In case you accidentally delete your data, you can file a support ticket or call support to restore the data from the last automatic backup. For a specific snapshot of your backup to be restored, we require that the data was at least available with us for the duration of the backup cycle for that snapshot.

## Next steps

To replicate your data NoSQL database in multiple data centers, see [globally distributed](documentdb-distribute-data-globally.md). 

To file contact Azure Support, [file a ticket from the Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).