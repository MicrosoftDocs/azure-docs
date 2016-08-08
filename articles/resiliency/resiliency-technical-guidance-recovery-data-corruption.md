<properties
   pageTitle="Resiliency technical guidance for recovering from data corruption or accidental deletion | Microsoft Azure"
   description="Article on understanding how to recover from data corruption of data or accidental data deletion to and designing resilient, highly available, fault tolerant applications as well as planning for disaster recovery"
   services=""
   documentationCenter="na"
   authors="adamglick"
   manager="hongfeig"
   editor=""/>

<tags
   ms.service="resiliency"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/01/2016"
   ms.author="aglick"/>

#Azure resiliency technical guidance: recovery from data corruption or accidental deletion

Part of a robust business continuity plan is having a plan if your data gets corrupted or accidentally deleted. The following is information about recovery after data has been corrupted or accidentally deleted, due to application errors or operator error.

##Virtual Machines

To protect your Azure Virtual Machines (sometimes called infrastructure-as-a-service VMs) from application errors or accidental deletion, use [Azure Backup](https://azure.microsoft.com/services/backup/). Azure Backup enables the creation of backups that are consistent across multiple VM disks. In addition, the Backup Vault can be replicated across regions to provide recovery from region loss.

##Storage

Note that while Azure Storage provides data resiliency through automated replicas, this does not prevent your application code (or developers/users) from corrupting data through accidental or unintended deletion, update, and so on. Maintaining data fidelity in the face of application or user error requires more advanced techniques, such as copying the data to a secondary storage location with an audit log. Developers can take advantage of the blob [snapshot capability](https://msdn.microsoft.com/library/azure/ee691971.aspx), which can create read-only point-in-time snapshots of blob contents. This can be used as the basis of a data-fidelity solution for Azure Storage blobs.

###Blob and Table Storage Backup

While blobs and tables are highly durable, they always represent the current state of the data. Recovery from unwanted modification or deletion of data may require restoring data to a previous state. This can be achieved by taking advantage of the capabilities provided by Azure to store and retain point-in-time copies.

For Azure Blobs, you can perform point-in-time backups using the [blob snapshot feature](https://msdn.microsoft.com/library/ee691971.aspx). For each snapshot, you are only charged for the storage required to store the differences within the blob since the last snapshot state. The snapshots are dependent on the existence of the original blob they are based on, so a copy operation to another blob or even another storage account is advisable. This ensures that backup data is properly protected against accidental deletion. For Azure Tables, you can make point-in-time copies to a different table or to Azure Blobs. More detailed guidance and examples of performing application-level backups of tables and blobs can be found here:

  * [Protecting Your Tables Against Application Errors](https://blogs.msdn.microsoft.com/windowsazurestorage/2010/05/03/protecting-your-tables-against-application-errors/)
  * [Protecting Your Blobs Against Application Errors](https://blogs.msdn.microsoft.com/windowsazurestorage/2010/04/29/protecting-your-blobs-against-application-errors/)

##Database

There are several [business continuity](../sql-database/sql-database-business-continuity.md) (backup, restore) options available for Azure SQL Database. Databases can be copied by using the [Database Copy](../sql-database/sql-database-copy.md) functionality, or by  [exporting](../sql-database/sql-database-export.md) and [importing](https://msdn.microsoft.com/library/hh710052.aspx) a SQL Server bacpac file. Database Copy provides transactionally consistent results, while a bacpac (through the import/export service) does not. Both of these options run as queue-based services within the data center, and they do not currently provide a time-to-completion SLA.

>[AZURE.NOTE]The database copy and import/export options place a significant degree of load on the source database. They can trigger resource contention or throttling events.

###SQL Database Backup

Point-in-time backups for Microsoft Azure SQL Database are achieved by [copying your Azure SQL database](../sql-database/sql-database-copy.md). You can use this command to create a transactionally consistent copy of a database on the same logical database server or to a different server. In either case, the database copy is fully functional and completely independent of the source database. Each copy you create represents a point-in-time recovery option. You can recover the database state completely by renaming the new database with the source database name. Alternatively, you can recover a specific subset of data from the new database by using Transact-SQL queries. For additional details about SQL Database, see [Cloud business continuity and database disaster recovery with SQL Database](../sql-database/sql-database-business-continuity.md).

###SQL Server on Virtual Machines Backup

For SQL Server used with Azure infrastructure as a service virtual machines (often called IaaS or IaaS VMs), there are two options: traditional backups and log shipping. Using traditional backups enables you to restore to a specific point in time, but the recovery process is slow. Restoring traditional backups requires starting with an initial full backup, and then applying any backups taken after that. The second option is to configure a log shipping session to delay the restore of log backups (for example, by two hours). This provides a window to recover from errors made on the primary.

##Other Azure platform services

Some Azure platform services store information in a user-controlled storage account or Azure SQL Database. If the account or storage resource is deleted or corrupted, this could cause serious errors with the service. In these cases, it is important to maintain backups that would enable you to re-create these resources if they were deleted or corrupted.

For Azure Web Sites and Azure Mobile Services, you must backup and maintain the associated databases. For Azure Media Service and Virtual Machines, you must maintain the associated Azure Storage account and all resources in that account. For example, for Virtual Machines, you must back up and manage the VM disks in Azure blob storage.

##Checklists for data corruption or accidental deletion

##Virtual Machines checklist
  1. Review the [Virtual Machines](#virtual-machines) section of this document.
  2. Back up and maintain the VM disks with Azure Backup (or your own backup system by using Azure blob storage and VHD snapshots).

##Storage checklist
  1. Review the [Storage](#storage) section of this document.
  2. Regularly back up critical storage resources.
  3. Consider using the snapshot feature for blobs.

##Database checklist
  1. Review the [Database](#database) section of this document.
  2. Create point-in-time backups by using the Database Copy command.

##SQL Server on Virtual Machines Backup checklist
  1. Review the [SQL Server on Virtual Machines Backup](#sql-server-on-virtual-machines-backup) section of this document.
  2. Use traditional backup and restore techniques.
  3. Create a delayed log shipping session.

##Web Apps checklist
  1. Back up and maintain the associated database, if any.

##Media Services checklist
  1. Back up and maintain the associated storage resources.

##More information

For more information about backup and restore features in Azure, see [Storage, backup and recovery scenarios](https://azure.microsoft.com/documentation/scenarios/storage-backup-recovery/).

##Next steps

This article is part of a series focused on [Azure resiliency technical guidance](./resiliency-technical-guidance.md). If you are looking for more resiliency, disaster recovery, and high availability resources, see the Azure resiliency technical guidance [additional resources](./resiliency-technical-guidance.md#additional-resources).
