---
title: Restore Virtual Machines using Cloud Backup
description: Restore Virtual Machines enable you to restore Virtual Machines from the cloud backup to the vCenter. 
ms.topic: how-to
ms.service: azure-vmware
ms.date: 06/20/2022
---

# Restore Virtual Machines using Cloud Backup

Restore Virtual Machines enable you to restore Virtual Machines from the cloud backup to the vCenter. 

This topic covers how to:
* Restore Virtual Machines from backups
* Restore deleted Virtual Machines from backups
* Restore VMDKs from backups
* Recovery of Cloud Backup for Virtual Machines internal database

## Restore Virtual Machines from backups

When you restore a Virtual Machine, you can overwrite the existing content with the backup copy that you select, or you can make a copy of the Virtual Machine.

You can restore Virtual Machines to the original datastore mounted on the original ESXi host (this overwrites the original Virtual Machine).

### Before you begin

* A backup must exist.
You must have created a backup of the Virtual Machine using the Cloud Backup for Virtual Machines before you can restore the Virtual Machine.
NOTE: Restore operations cannot finish successfully if there are snapshots of the Virtual Machine that were performed by software other than the Cloud Backup for Virtual Machines.
* The Virtual Machine must not be in transit.
The Virtual Machine that you want to restore must not be in a state of vMotion or Storage vMotion.
* HA configuration errors
Ensure there are no HA configuration errors displayed on the vCenter ESXi Host Summary screen before restoring backups to a different location.
* Restoring to a different location

### About this task

* Virtual Machine is unregistered and registered again
    The restore operation for Virtual Machines unregisters the original Virtual Machine, restores the Virtual Machine from a backup snapshot, and registers the restored Virtual Machine with the same name and configuration on the same ESXi server. You must manually add the Virtual Machines to resource groups after the restore.
* Restoring datastores
    You cannot restore a datastore, but you can restore any Virtual Machine in the datastore.
* VMware consistency snapshot failures for a Virtual Machine
    Even if a VMware consistency snapshot for a Virtual Machine fails, the Virtual Machine is nevertheless backed up. You can view the entities contained in the backup copy in the Restore wizard and use it for restore operations.

### Steps

1.	In the VMware vSphere web client GUI, select **Menu** in the toolbar. Select **Inventory** and then  **Virtual Machines and Templates**.
2.	In the left navigation, right-click a Virtual Machine, then select **NetApp Cloud Backup** in the drop-down list. Select **Restore** to initiate the wizard.
3.	In the Restore wizard, on the **Select Backup** page, select the backup snapshot copy that you want to restore.
    You can search for a specific backup name or a partial backup name, or you can filter the backup list by selecting the filter icon and then choosing a date and time range, selecting whether you want backups that contain VMware snapshots, whether you want mounted backups, and the location. Select **OK** to return to the wizard.
1. On the **Select Scope** page, select Entire Virtual Machine in the Restore scope field, then select the restore location, and then enter the destination ESXi information where the backup should be mounted.
When restoring partial backups, the restore operation skips the Select Scope page.
1. Enable **Restart VM** checkbox if you want the Virtual Machine to be powered on after the restore operation.
1. On the **Select Location** page, select the location for the restored datastore.
1. Review the **Summary** page and then select **Finish**.
1. **Optional:** Monitor the operation progress by clicking Recent Tasks at the bottom of the screen.

### After you finish

* Add restored Virtual Machines to resource groups

    Although the Virtual Machines are restored, they are not automatically added to their former resource groups. Therefore, you must manually add the restored Virtual Machines to the appropriate resource groups.

## Restore deleted Virtual Machines from backups

You can restore a deleted Virtual Machine from a datastore primary or secondary backup to an ESXi host that you select. You can also restore Virtual Machines to the original datastore mounted on the original ESXi host, which creates a clone of the Virtual Machine.

### Before you begin

* You must have added the Azure cloud Subscription account.
    The user account in vCenter must have the minimum vCenter privileges required for Cloud Backup for Virtual Machines.
* A backup must exist.
    You must have created a backup of the Virtual Machine using the Cloud Backup for Virtual Machines before you can restore the VMDKs on that Virtual Machine.

### About this task

You cannot restore a datastore, but you can restore any Virtual Machine in the datastore.

### Steps

1. Select **Menu** and then select the **Inventory** option.
1. Select a datastore, then select the **Configure** tab, and then select **Backups in the Cloud Backup for Virtual Machines** section.
1. Select (double-click) on a backup to see a list of all Virtual Machines that are included in the backup.
1. Select the deleted Virtual Machine from the backup list and then select **Restore**.
1. On the **Select Scope** page, select **Entire Virtual Machine** in the **Restore scope field**, then select the restore location, and then enter the destination ESXi information where the backup should be mounted.
1. Enable **Restart VM** checkbox if you want the Virtual Machine to be powered on after the restore operation.
1. On the **Select Location** page, select the location of the backup that you want to restore.
1. Review the Summary page and then click Finish.

## Restore VMDKs from backups

You can restore existing Virtual Machine disks (VMDKs) or deleted or detached VMDKs from either a primary or secondary backup. You can restore one or more VMDKs on a Virtual Machine to the same datastore.

### Before you begin 

* A backup must exist.
    You must have created a backup of the Virtual Machine using the Cloud Backup for Virtual Machines.
* The Virtual Machine must not be in transit.
    The Virtual Machine that you want to restore must not be in a state of vMotion or Storage vMotion.

### About this task 

* If the VMDK is deleted or detached from the Virtual Machine, then the restore operation attaches the VMDK to the Virtual Machine.
* Attach and restore operations connect VMDKs using the default SCSI controller. VMDKs that are attached to a Virtual Machine with a NVME controller are backed up, but for attach and restore operations they are connected back using a SCSI controller.

### Steps 

1. In the VMware vSphere web client GUI, select Menu in the toolbar. Then select **Inventory** and then  **Virtual Machines and Templates**.
1. In the left navigation, right-click a Virtual Machine, then select **NetApp Cloud Backup**. In the drop-down list, and then select **Restore**.
1. In the Restore wizard, on the **Select Backup** page, select the backup copy from which you want to restore. There are multiple ways to find the backup you.
    * Search for a specific backup name or a partial backup name
    * Filter the backup list by selecting the filter icon and selecting a date and time range, selecting whether you want backups that contain VMware snapshots, whether you want mounted backups, and primary location.
    Select **OK** to return to the wizard.
1. On the **Select Scope** page, select **Particular virtual disk** in the Restore scope field, then select the virtual disk and destination datastore
1. On the **Select Location** page, select the snapshot copy that you want to restore.
1. Review the **Summary** page and then select **Finish**.
1. **Optional:** Monitor the operation progress by clicking Recent Tasks at the bottom of the screen.

## Recovery of Cloud Backup for Virtual Machines internal database

You can use the maintenance console to restore a specific backup of the MySQL database (also called an NSM database) for Cloud Backup for Virtual Machines.

### Steps
1. Open a maintenance console window.
1. From the main menu, enter option **1) Application Configuration**.
1. From the Application Configuration menu, enter option **6) MySQL backup and restore**.
1. From the MySQL Backup and Restore Configuration menu, enter option **2) List MySQL backups**. Make note of the backup you want to restore.
1. From the MySQL Backup and Restore Configuration menu, enter option **3) Restore MySQL backup**.
1. At the prompt “Restore using the most recent backup,” enter **n**.
1. At the prompt “Backup to restore from,” enter the backup name, and then select **Enter**.
    The selected backup MySQL database will be restored to its original location.
