---
title: Frequently asked questions about Azure Disk Backup
description: Get answers to frequently asked questions about Azure Disk Backup
ms.topic: conceptual
ms.date: 01/07/2021
---



**Frequently asked question on Azure Disk Backup**

This article answers frequently asked questions about Azure Disk Backup. For more information on the [Azure Disk backup](https://aka.ms/diskbackupdoc-overview) region availability, supported scenarios and limitations, see the [support matrix](https://aka.ms/diskbackupdoc-supportmatrix).

 

## Frequently asked questions 

 

Can I backup the disk using Azure Disk Backup solution given the same disk is backed up using Azure virtual machine Backup?

Azure Backup offers side-by-side support for backup of managed disk using Disk backup as well as [Azure VM backup](https://docs.microsoft.com/azure/backup/backup-azure-vms-introduction) solutions. This is useful where you need once-a-day application consistent backup of virtual machine and additionally, more frequent backups of OS disk or a specific data disk that are crash consistent without impacting the production application performance. 

 

How to find the Snapshot Resource Group which I used to configure backup for a disk?

In the Backup Instance screen, you can find the Snapshot Resource Group field on the essentials section. you can search and select your backup instance of corresponding disk from Backup center or Backup vault.

![img](file:///C:/Users/dacurwin/AppData/Local/Temp/msohtmlclip1/01/clip_image002.jpg)

 

What is a Snapshot Resource Group?

Azure Disk Backup offers operational tier backup for managed disk i.e., the snapshots that are created during the scheduled and on-demand backup operations are stored in a resource group within your subscription. Azure Backup offers instant restore given the incremental snapshots are stored within your subscription. This resource group is known as Snapshot Resource Group. For more information, refer to configure backup - https://aka.ms/diskbackupdoc-backup 

 

Why should the snapshot resource group must be in same subscription as that of the disk being backed up?

You cannot create an incremental snapshot for a particular disk outside of that disk's subscription. So, choose the resource group within the same subscription as that of the disk to be backed up. Learn more about [incremental snapshot](https://docs.microsoft.com/azure/virtual-machines/windows/disks-incremental-snapshots-portal#restrictions) for managed disk.

 

Why do I need to provide role assignments to be able to configure backup, perform scheduled & on-demand backup and restore operation?

Azure Disk Backup uses least privilege approach to discover, protect, and restore the managed disk in your subscriptions. To achieve this, Azure Backup uses Managed Identity of [Backup vault](https://docs.microsoft.com/azure/backup/backup-vault-overview) to access other Azure resources. A system assigned managed identity is restricted to one per resource and is tied to the lifecycle of this resource. You can grant permissions to the managed identity by using Azure role-based access control (Azure RBAC). Managed identity is a service principal of a special type that may only be used with Azure resources. Learn more about [Managed Identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview). By default, Backup vault will not have permission to access the disk to be backed up, create periodic snapshots, delete snapshots after retention period and to restore a disk from backup. By explicitly granting role assignments to Backup vault managed identity, you are in control of managing permissions to the resources on the subscriptions. 

 

Why is backup policy limiting the retention duration?

Azure Disk Backup uses incremental snapshot which are limited to 200 snapshots per disk. To allow customer to take on-demand backup apart from scheduled backups, Backup policy limits the total backups to 180. Learn more about [incremental snapshot](https://docs.microsoft.com/azure/virtual-machines/windows/disks-incremental-snapshots-portal#restrictions) for managed disk. 

 

How does the hourly and daily backup frequency work in the backup policy?

Azure Disk Backup offers multiple backups per day. If you require more frequent backups, choose **Hourly** backup frequency. The backups are scheduled based on the **Time** interval selected. For example, if you select **Every 4 hours**, then the backups are taken at approximately in the interval of every 4 hours such that the backups are distributed equally across the day. If once a day backup is sufficient enough, then choose **Daily** backup frequency. In the Daily backup frequency, you have option to specify the Time of the day when your backups are to be taken. Its important to note that the Time of the day indicates the backup start time and the time when the backup completes. Time required for completing backup operation is dependent on various factors including the churn rate between consecutive backups. However, Azure Disk backup is agentless backup that uses [incremental snapshots](https://docs.microsoft.com/azure/virtual-machines/windows/disks-incremental-snapshots-portal) that does not impact the production application performance.

 

Why does the backup vault’s redundancy setting not apply to the backups stored in operational tier (i.e., Snapshot resource group)?

Azure Backup leverages [incremental snapshot](https://docs.microsoft.com/azure/virtual-machines/windows/disks-incremental-snapshots-portal#restrictions) of managed disk that stores only the delta changes to disk since the last snapshot on Standard HDD storage irrespective of the storage type of the parent disk. For additional reliability, incremental snapshots are stored on Zone Redundant Storage (ZRS) by default in regions that support ZRS. Currently Azure Disk Backup supports operational backup of managed disk that does not copy the backups to Backup vault storage. Hence the backup storage redundancy setting of Backup vault does not apply to the recovery points. 

 

Can I use Backup Center to configure backup and manage backup instances for Azure Disk?

Yes, Azure Disk Backup is integrated into [Backup Center](https://docs.microsoft.com/azure/backup/backup-center-overview) that provides a **single unified management experience** in Azure for enterprises to govern, monitor, operate, and analyze backups at scale. You can also use Backup vault to backup, restore and manage the backup instances that are protected within the vault. 

 

Why do I need to create Backup vault and not use Recovery Services vault?

A Backup vault is a storage entity in Azure that houses backup data for certain newer workloads that Azure Backup supports. You can use Backup vaults to hold backup data for various Azure services, such Azure Database for PostgreSQL servers, Azure Disk and newer workloads that Azure Backup will support. Backup vaults make it easy to organize your backup data, while minimizing management overhead. Refer [Backup vault](https://docs.microsoft.com/azure/backup/backup-vault-overview) to know more. 

 

Can the disk to-be backed up and Backup vault be in different subscriptions?

Yes, the source Managed disk to-be backed up and the Backup vault can be in different subscriptions. 

 

Can the disk to-be backed up and Backup vault be in different region?

No, currently the source Managed disk to-be backed up and the Backup vault should be in same region.

 

Can I restore a disk into a different subscription?

Yes, you can restore the disk onto a different subscription than that of the source Managed disk from which backup is taken. 

 

Can I backup multiple disks together?

No, point in time snapshot of multiple disks attached to a virtual machine is not supported. For more information, refer to configure backup - https://aka.ms/diskbackupdoc-backup and to know more about limitations refer the support matrix - https://aka.ms/diskbackupdoc-supportmatrix 

 

What are my options to backup disks across multiple subscriptions? 

Currently, the Azure portal experience to configure backup of disk is limited to maximum of 20 disks from the same subscription. Support to configure disks at scale and across subscription will be enabled through PowerShell, CLI or SDK during GA.

 

What is a Target resource group?

During restore operation, you can choose the subscription and a resource group where you want to restore the disk to. Azure Backup will create new disk from the recovery point in the selected resource group. This is referred to as Target Resource Group. Note that the Backup vault managed identity requires role assignment on the Target resource group to be able to perform restore operation successfully. For more details refer to - https://aka.ms/diskbackupdoc-restore 

 

What are the permissions used by Azure Backup during backup and restore operation?

Following are the actions used in the **Disk Backup Reader** role assigned on **disk** to be backed up:

"Microsoft.Compute/disks/read",

"Microsoft.Compute/disks/beginGetAccess/action"

Following are the actions used in the **Disk Snapshot Contributor** role assigned on the **Snapshot resource group**:

"Microsoft.Compute/snapshots/delete",

"Microsoft.Compute/snapshots/write",

“Microsoft.Compute/snapshots/read",

"Microsoft.Storage/storageAccounts/write",

"Microsoft.Storage/storageAccounts/read",

"Microsoft.Storage/storageAccounts/delete",

"Microsoft.Resources/subscriptions/resourceGroups/read",

"Microsoft.Storage/storageAccounts/listkeys/action",

"Microsoft.Compute/snapshots/beginGetAccess/action",

"Microsoft.Compute/snapshots/endGetAccess/action",

"Microsoft.Compute/disks/beginGetAccess/action"

Following are the actions used in the **Disk Restore Operator** role assigned on **Target Resource Group**:

​         "Microsoft.Compute/disks/write",

​         "Microsoft.Compute/disks/read",

​      "Microsoft.Resources/subscriptions/resourceGroups/read"

Note that the permissions on these roles can change in the future based on the features being added by Azure Backup service.

 

## Next steps


