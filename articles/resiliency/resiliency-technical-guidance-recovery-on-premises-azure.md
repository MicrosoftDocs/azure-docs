<properties
   pageTitle="Resiliency for recovery from on-premises to Azure technical guidance | Microsoft Azure"
   description="Whitepaper on understanding and designing recovery systems from on-premises infrastructure to Azure"
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
   ms.date="05/13/2016"
   ms.author="patw;jroth;aglick"/>

#Azure Resiliency Technical Guidance - Recovery from on-premises to Azure

Azure provides a comprehensive set of services for enabling extension of an on-premises datacenter to Azure for high availability and disaster recovery purposes:

  * __Networking__: With virtual private network you securely extend your on-premises network to the cloud.
  * __Compute__: Customers using Hyper-V on-premises can “lift and shift” existing virtual machines to Azure.
  * __Storage__: StorSimple extends your file system to Azure Storage. The Azure Backup service provides backup for files and Azure SQL Databases to Azure Storage.
  * __Database Replication__: With SQL 2014 Availability Groups you can implement high availability and disaster recovery for your on-premises data.

##Networking

Azure Virtual Network enables you to create a logically isolated section in Azure and securely connect it to your on-premises datacenter or a single client machine using an IPsec connection. Virtual Network makes it easy for you to take advantage of Azure’s scalable, on-demand infrastructure while providing connectivity to data and applications on-premises, including systems running on Windows Server, mainframes and UNIX. See [Azure Networking Documentation](../virtual-network/) for more information.

##Compute

If you're using Hyper-V on-premises can “lift and shift” existing virtual machines(VMs) to Azure & service providers running Windows Server 2012 (or later), without making changes to the VM or converting VM formats. For more information, see [About disks and VHDs for Azure virtual machines](../virtual-machines/virtual-machines-linux-about-disks-vhds/).

##Azure Site Recovery
If you would like disaster recovery as a service (DRaaS), Azure provides [Azure Site Recovery](https://azure.microsoft.com/services/site-recovery/). Azure Site Recovery offers comprehensive protection for VMware, Hyper-V, and physical servers. Azure Site Recovery allows you to leverage another on-premises server or Azure as your recovery site. For more information on Azure Site Recovery please see the [Azure Site Recovery Documentation](../site-recovery/).

##Storage

There are several options for using Azure as a backup site for on-premises data.

###StorSimple

StorSimple securely and transparently integrates cloud storage for on-premises applications and offers a single appliance that delivers high-performance tiered local and cloud storage, live archiving, cloud-based data protection and disaster recovery. For more information, see the [StorSimple product page](https://azure.microsoft.com/services/storsimple/).

###Azure Backup

Azure Backup enables cloud backups using the familiar backup tools in Windows Server 2012 (or later), Windows Server 2012 Essentials (or later), and System Center 2012 Data Protection Manager (or later). These tools provide a workflow for backup management that is independent of the storage location of the backups, whether a local disk or Azure Storage. After data is backed up to the cloud, authorized users can easily recover backups to any server.

With incremental backups, only changes to files are transferred to the cloud. This helps to efficiently use storage space, reduce bandwidth consumption, and support point-in-time recovery of multiple versions of the data. You can also choose to use additional features, such as data retention policies, data compression, and data transfer throttling. Using Azure as the backup location has the obvious advantage that the backups are automatically “offsite”. This eliminates the extra requirements to secure and protect on-site backup media. For more information, see [What is Azure Backup?](../backup/backup-introduction-to-azure-backup.md) and [Configure Azure Backup for DPM data](https://technet.microsoft.com/library/jj728752(v=sc.12).aspx).

##Database

You can have a disaster recovery solution for your SQL Server databases in a hybrid-IT environment using AlwaysOn Availability Groups, database mirroring, log shipping, and backup and restore with Azure blog storage. All of these solutions use SQL Server running on Azure Virtual Machines.
AlwaysOn Availability Groups can be used in a hybrid-IT environment where database replicas exist both on-premises and in the cloud. This is shown in the following diagram, taken from the depth topic [High availability and disaster recovery for SQL Server in Azure Virtual Machines](../virtual-machines/virtual-machines-windows-sql-high-availability-dr/).

![SQL AlwaysOn Availability Groups in a hybrid cloud architecture](./media/resiliency-technical-guidance-recovery-on-premises-azure/SQL_Server_Disaster_Recovery-3.png "SQL AlwaysOn Availability Groups in a hybrid cloud architecture")

Database Mirroring can also span on-premises servers and the cloud in a certificate-based setup. The following diagram illustrates this concept.

![SQL Database Mirroring in a hybrid cloud architecture](./media/resiliency-technical-guidance-recovery-on-premises-azure/SQL_Server_Disaster_Recovery-4.png "SQL Database Mirroring in a hybrid cloud architecture")

Log shipping can be used to synchronize an on-premises database with a SQL Server database in an Azure Virtual Machine.

![SQL Log Shipping in a hybrid cloud architecture](./media/resiliency-technical-guidance-recovery-on-premises-azure/SQL_Server_Disaster_Recovery-5.png "SQL Log Shipping in a hybrid cloud architecture")

Finally, you can backup an on-premises database directly to Azure Blob Storage.

![Backup SQL Server to an Azure Storage Blob in a hybrid cloud architecture](./media/resiliency-technical-guidance-recovery-on-premises-azure/SQL_Server_Disaster_Recovery-6.png "Backup SQL Server to an Azure Storage Blob in a hybrid cloud architecture")

For more information, see [High availability and disaster recovery for SQL Server in Azure Virtual Machines](../virtual-machines/virtual-machines-windows-sql-high-availability-dr/) and [Backup and Restore for SQL Server in Azure Virtual Machines](../virtual-machines/virtual-machines-windows-sql-backup-recovery/).

##Checklists for on-premises recovery in Microsoft Azure 
 
##[Networking](#networking) Checklist
  1. Use Virtual Network to securely connect on-premises to the Cloud

##[Compute](#compute) Checklist
  2. Relocate VMs between Hyper-V and Azure

##[Storage](#storage) Checklist
  1. Take advantage of StorSimple services for using Cloud storage
  2. Use Azure Backup Services

##[Database](#database) Checklist
  1. Consider using SQL Server on Azure VMs as the backup
  2. Setup AlwaysOn Availability Groups
  3. Configure certificate-based Database Mirroring
  4. Use log shipping
  5. Backup on-premises database to Azure blob storage
