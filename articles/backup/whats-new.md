---
title: What's new in Azure Backup
description: Learn about new features in Azure Backup.
ms.topic: conceptual
ms.date: 11/11/2020
---

# What's new in Azure Backup

Azure Backup is constantly improving and releasing new features that enhance the protection of your data in Azure. These new features expand your data protection to new workload types, enhance security, and improve the availability of your backup data. They also add new management, monitoring, and automation capabilities.

You can learn more about the new releases by bookmarking this page or by [subscribing to updates here](https://azure.microsoft.com/updates/?query=backup).

## Updates summary

- November 2020
  - [Azure Resource Manager template for Azure file share (AFS) backup](#azure-resource-manager-template-for-afs-backup)
  - [Incremental backups for SAP HANA databases on Azure VMs](#incremental-backups-for-sap-hana-databases)
- September 2020
  - [Backup Center](#backup-center)
  - [Backup Azure Database for PostgreSQL](#backup-azure-database-for-postgresql)
  - [Selective disk backup and restore](#selective-disk-backup-and-restore)
  - [Cross Region Restore for SQL Server and SAP HANA databases on Azure VMs](#cross-region-restore-for-sql-server-and-sap-hana)
  - [Support for backup of VMs with up to 32 disks](#support-for-backup-of-vms-with-up-to-32-disks)
  - [Simplified backup configuration experience for SQL in Azure VMs](#simpler-backup-configuration-for-sql-in-azure-vms)
  - [Backup SAP HANA in RHEL Azure Virtual Machines](#backup-sap-hana-in-rhel-azure-virtual-machines)
  - [Zone redundant storage (ZRS) for backup data](#zone-redundant-storage-zrs-for-backup-data)
  - [Soft delete for SQL Server and SAP HANA workloads in Azure VMs](#soft-delete-for-sql-server-and-sap-hana-workloads)

## Azure Resource Manager template for AFS backup

Azure Backup now supports configuring backup for existing Azure file shares using an Azure Resource Manager (ARM) template. The template configures protection for an existing Azure file share by specifying appropriate details for the Recovery Services vault and backup policy. It optionally creates a new Recovery Services vault and backup policy, and registers the storage account containing the file share to the Recovery Services vault.

For more information, see [Azure Resource Manager templates for Azure Backup](backup-rm-template-samples.md).

## Incremental backups for SAP HANA databases

Azure Backup now supports incremental backups for SAP HANA databases hosted on Azure VMs. This allows for faster and more cost-efficient backups of your SAP HANA data.

For more information, see [various options available during creation of a backup policy](sap-hana-faq-backup-azure-vm.md#policy) and [how to create a backup policy for SAP HANA databases](tutorial-backup-sap-hana-db.md#creating-a-backup-policy).

## Backup Center

Azure Backup has enabled a new native management capability to manage your entire backup estate from a central console. Backup Center provides you with the capability to monitor, operate, govern, and optimize data protection at scale in a unified manner consistent with Azure’s native management experiences.

With Backup Center, you get an aggregated view of your inventory across subscriptions, locations, resource groups, vaults, and even tenants using Azure Lighthouse. Backup Center is also an action center from where you can trigger your backup related activities, such as configuring backup, restore, creation of policies or vaults, all from a single place. In addition, with seamless integration to Azure Policy, you can now govern your environment and track compliance from a backup perspective. In-built Azure Policies specific to Azure Backup also allow you to configure backups at scale.

For more information, see [Overview of Backup Center](backup-center-overview.md).

## Backup Azure Database for PostgreSQL

Azure Backup and Azure Database Services have come together to build an enterprise-class backup solution for Azure PostgreSQL (now in preview). Now you can meet your data protection and compliance needs with a customer-controlled backup policy that enables retention of backups for up to 10 years. With this, you have granular control to manage the backup and restore operations at the individual database level. Likewise, you can restore across PostgreSQL versions or to blob storage with ease.

For more information, see [Azure Database for PostgreSQL backup](backup-azure-database-postgresql.md).

## Selective disk backup and restore

Azure Backup supports backing up all the disks (operating system and data) in a VM together using the virtual machine backup solution. Now, using the selective disks backup and restore functionality, you can back up a subset of the data disks in a VM. This provides an efficient and cost-effective solution for your backup and restore needs. Each recovery point contains only the disks that are included in the backup operation.

For more information, see [Selective disk backup and restore for Azure virtual machines](selective-disk-backup-restore.md).

## Cross Region Restore for SQL Server and SAP HANA

With the introduction of cross-region restore, you can now initiate restores in a secondary region at will to mitigate real downtime issues in a primary region for your environment. This makes the secondary region restores completely customer controlled. Azure Backup uses the backed-up data replicated to the secondary region for such restores.

Now, in addition to support for cross-region restore for Azure virtual machines, the feature has been extended to restoring SQL and SAP HANA databases in Azure virtual machines as well.

For more information, see [Cross Region Restore for SQL databases](restore-sql-database-azure-vm.md#cross-region-restore) and [Cross Region Restore for SAP HANA databases](sap-hana-db-restore.md#cross-region-restore).

## Support for backup of VMs with up to 32 disks

Until now, Azure Backup has supported 16 managed disks per VM. Now, Azure Backup supports backup of up to 32 managed disks per VM.

For more information, see the [VM storage support matrix](backup-support-matrix-iaas.md#vm-storage-support).

## Simpler backup configuration for SQL in Azure VMs

Configuring backups for your SQL Server in Azure VMs is now even easier with inline backup configuration integrated into the VM pane of the Azure portal. In just a few steps, you can enable backup of your SQL Server to protect all the existing databases as well as the ones that get added in the future.

For more information, see [Back up a SQL Server from the VM pane](backup-sql-server-vm-from-vm-pane.md).

## Backup SAP HANA in RHEL Azure virtual machines

Azure Backup is the native backup solution for Azure and is BackInt certified by SAP. Azure Backup has now added support for Red Hat Enterprise Linux (RHEL), one of the most widely used Linux operating systems running SAP HANA.

For more information, see the [SAP HANA database backup scenario support matrix](sap-hana-backup-support-matrix.md#scenario-support).

## Zone redundant storage (ZRS) for backup data

Azure Storage provides a great balance of high performance, high availability, and high data resiliency with its varied redundancy options. Azure Backup allows you to extend these benefits to backup data as well, with options to store your backups in locally redundant storage (LRS) and geo-redundant storage (GRS). Now, there are additional durability options with the added support for zone redundant storage (ZRS).

For more information, see [Set storage redundancy for the Recovery Services vault](backup-create-rs-vault.md#set-storage-redundancy).

## Soft delete for SQL Server and SAP HANA workloads

Concerns about security issues, like malware, ransomware, and intrusion, are increasing. These security issues can be costly, in terms of both money and data. To guard against such attacks, Azure Backup provides security features to help protect backup data even after deletion.

One such feature is soft delete. With soft delete, even if a malicious actor deletes a backup (or backup data is accidentally deleted), the backup data is retained for 14 additional days, allowing the recovery of that backup item with no data loss. The additional 14 days of retention for backup data in the "soft delete" state don't incur any cost to you.

Now, in addition to soft delete support for Azure VMs, SQL Server and SAP HANA workloads in Azure VMs are also protected with soft delete.

For more information, see [Soft delete for SQL server in Azure VM and SAP HANA in Azure VM workloads](soft-delete-sql-saphana-in-azure-vm.md).

## Next steps

- [Azure Backup guidance and best practices](guidance-best-practices.md)
