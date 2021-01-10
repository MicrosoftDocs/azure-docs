---
title: Restore Azure Managed Disks
description: Learn how to restore Azure Managed Disks from the Azure portal.
ms.topic: conceptual
ms.date: 01/07/2021
---

**Restore Azure Disk**

This article explains how to restore [Azure Managed Disk](https://docs.microsoft.com/azure/virtual-machines/managed-disks-overview) from a restore point created by Azure Backup.

**Currently, Original-Location Recovery (OLR) option to restore by replacing existing source disk from** where the backups were taken **is not supported. You can restore from recovery point** to create a new disk either in the same resource group as that of the source disk from where the backups were taken or in any other resource group. This is known as Alternate-Location Recovery (ALR) and this helps to keep both the source disk as well as restored (new) disk.

In this article, you'll learn how to:

·     Restore to create new Disk

·     Track restore operation status 

 

## Restore to create new disk

Backup Vault uses Managed Identity to access other Azure resources. To restore from backup, Backup vault’s managed identity requires set of permissions on the resource group where the disk is to be restored. 

Backup vault uses a system assigned managed identity which is restricted to one per resource and is tied to the lifecycle of this resource. You can grant permissions to the managed identity by using Azure role-based access control (Azure RBAC). Managed identity is a service principal of a special type that may only be used with Azure resources. Learn more about [Managed Identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview). 

Following pre-requisites are required to perform restore operation. 

\1.  Assign **Disk Restore Operator** role to Backup Vault’s managed identity on the Resource group where the disk is to be restored by Azure Backup service.

·     You can choose same resource group as that of source disk from where backups are taken or to any other resource group within the same or different subscription. 

Go to the Resource group where the disk is to be restored to (for example, resource group is TargetRG).

Go to **Access control (IAM)** and select **Add role assignments**

On the right context blade, select **Disk Restore Operator** in the **Role** dropdown list, select backup vault’s managed identity and **Save**.

Tip: type the backup vault name to select the vault’s managed identity. 

![img](file:///C:/Users/dacurwin/AppData/Local/Temp/msohtmlclip1/01/clip_image002.jpg)

\2.  Verify that backup vault managed identity has right set of role assignments on the resource group where disk is to be restored.

Go to **Backup vault - > Identity** and select **Azure role assignments**

![img](file:///C:/Users/dacurwin/AppData/Local/Temp/msohtmlclip1/01/clip_image004.jpg)

Verify the Role, resource name and resource type are correctly reflected.

![img](file:///C:/Users/dacurwin/AppData/Local/Temp/msohtmlclip1/01/clip_image006.jpg)

Note:

While the role assignments are reflected correctly on the portal, it may take few minutes (15 minutes, approximately) for the permission to be applied on backup vault’s managed identity. 

During schedule backups or on-demand backup operation, Azure Backup stores the disk incremental snapshots in the Snapshot Resource Group provided during the time of configuring backup of the disk. Azure Backup uses these incremental snapshots during restore operation. For restore operation will fail, if the snapshots are deleted or moved from the Snapshot Resource Group or if the Backup vault role assignments are revoked on the Snapshot Resource Group.

Upon pre-requisites are met, follow these steps to perform restore operation.

\1.  In the [Azure portal](https://portal.azure.com/), go to **Backup center**, select **Backup instances** under the **Manage** section. From the list of backup instances, select the disk backup instance for which you want to perform the restore operation. ![img](file:///C:/Users/dacurwin/AppData/Local/Temp/msohtmlclip1/01/clip_image008.jpg)

Alternately, you can perform this operation from the Backup vault you used to configure backup for the disk.

\2.  In the **backup instance** screen, select the restore point which you want to use to perform the restore operation and click **Restore**.

![img](file:///C:/Users/dacurwin/AppData/Local/Temp/msohtmlclip1/01/clip_image010.jpg)

1. In     the Restore workflow, review the **Basics** and **Select recovery     point** tab information and click **Next: Restore parameters**

![img](file:///C:/Users/dacurwin/AppData/Local/Temp/msohtmlclip1/01/clip_image012.jpg)

 

1. In     the **Restore parameters** tab, select **Target subscription** and **Target     resource group** where you want to restore the backup to. Provide the     name of the disk to be restored. Click **Next: Review + restore>** 

![img](file:///C:/Users/dacurwin/AppData/Local/Temp/msohtmlclip1/01/clip_image014.jpg)

 

Tip: 

Disk being backed up by Azure Backup using Disk backup solution can also be backed up by Azure Backup using Azure VM backup solution using Recovery Services vault. If you have configured protection of the Azure VM to which this disk is attached to, you can also use Azure VM restore operation, you can choose to restore VM or Disks or File/Folder from the recovery point of the corresponding Azure VM backup instance. For more details, refer to [Azure VM backup](https://docs.microsoft.com/azure/backup/about-azure-vm-restore)

 

1. Once     the validation is successful, click **Restore** to initiate restore     operation.

![img](file:///C:/Users/dacurwin/AppData/Local/Temp/msohtmlclip1/01/clip_image016.jpg)

 

Note:

Validation might take few minutes to complete before you can trigger restore operation. Validation may fail if,

·     a disk with the same name provided in **Restored disk name** already exists in the **Target resource group**

·     Backup vault managed identity does not have valid role assignments on the **Target resource group**

·     Backup vault managed identity role assignments are revoked on the **Snapshot resource group** where incremental snapshots are stored

·     If incremental snapshot(s) are deleted or moved from Snapshot resource group 

 

Restore will create new disk from the selected recovery point in the Target resource group provided during restore operation. To use the restored disk on an existing virtual machine, you will require to perform additional steps. 

 

If the restored disk is a data disk, you can attach an existing disk to a virtual machine and if the restore disk is OS disk, you can swap OS disk of a virtual machine from Azure portal under **Virtual machine** blade - > **Disks** menu in the **Settings** section

![img](file:///C:/Users/dacurwin/AppData/Local/Temp/msohtmlclip1/01/clip_image018.jpg)

 

 

For Windows Virtual Machine, if the restored disk is a data disk, follow the instruction to [detach the original data disk](https://docs.microsoft.com/azure/virtual-machines/windows/detach-disk#detach-a-data-disk-using-the-portal) from the virtual machine and then [attach the restored disk](https://docs.microsoft.com/azure/virtual-machines/windows/attach-managed-disk-portal) to the virtual machine. Follow the instruction to [swap the OS disk](https://docs.microsoft.com/azure/virtual-machines/windows/os-disk-swap) of virtual machine with the restored disk.

 

For Linux Virtual Machine, if the restored disk is a data disk, follow the instruction to [detach the original data disk](https://docs.microsoft.com/azure/virtual-machines/linux/detach-disk#detach-a-data-disk-using-the-portal) from the virtual machine and then [attach the restored disk](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/attach-disk-portal#attach-an-existing-disk) to the virtual machine. Follow the instruction to [swap the OS disk](https://docs.microsoft.com/azure/virtual-machines/linux/os-disk-swap) of virtual machine with the restored disk.

 

It is recommended that you revoke the **Disk Restore Operator** role assignment to Backup vault managed identity on the **Target resource group** after successful completion of restore operation.

 

## Track a restore operation

After you trigger the restore operation, the backup service creates a job for tracking. Azure Backup displays notifications about the job in the portal. To view the restore job progress, 

\1.  Go to Backup instance screen. It show jobs dashboard with operation and status for past 7 days. 

![img](file:///C:/Users/dacurwin/AppData/Local/Temp/msohtmlclip1/01/clip_image020.jpg)

\2.  To view status of restore operation, click on **View all** to show ongoing and past jobs of this backup instance.

![img](file:///C:/Users/dacurwin/AppData/Local/Temp/msohtmlclip1/01/clip_image022.jpg)

\3.  Review the list of backup & restore jobs and their status. Select a job from the list of jobs to view job details.

![img](file:///C:/Users/dacurwin/AppData/Local/Temp/msohtmlclip1/01/clip_image024.jpg)

 

 

 



 



## Next steps


