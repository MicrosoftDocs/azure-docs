---
title: Restore VM using Cloud Backup for Virtual Machines
description: Learn how to restore virtual machines from a cloud backup to the vCenter. 
ms.topic: how-to
ms.service: azure-vmware
ms.date: 06/27/2022
---

# Restore VMs using Cloud Backup for Virtual Machines

Cloud Backup for Virtual Machines enables you to restore virtual machines (VMs) from the cloud backup to the vCenter. 

This topic covers how to:
* Restore VMs from backups
* Restore deleted VMs from backups
* Restore VM disks (VMDKs) from backups
* Recovery of Cloud Backup for Virtual Machines internal database

## Restore VMs from backups

When you restore a VM, you can overwrite the existing content with the backup copy that you select, or you can make a copy of the VM.

You can restore VMs to the original datastore mounted on the original ESXi host (this overwrites the original VM).

### Prerequisites

* A backup must exist.
You must have created a backup of the VM using the Cloud Backup for Virtual Machines before you can restore the VM.
>[!NOTE]
>Restore operations cannot finish successfully if there are snapshots of the VM that were performed by software other than the Cloud Backup for Virtual Machines.
* The VM must not be in transit.
The VM that you want to restore must not be in a state of vMotion or Storage vMotion.
* High Availability (HA) configuration errors
Ensure there are no HA configuration errors displayed on the vCenter ESXi Host Summary screen before restoring backups to a different location.
* Restoring to a different location

### Considerations for restoring VMs from backups

* VM is unregistered and registered again
    The restore operation for VMs unregisters the original VM, restores the VM from a backup snapshot, and registers the restored VM with the same name and configuration on the same ESXi server. You must manually add the VMs to resource groups after the restore.
* Restoring datastores
    You cannot restore a datastore, but you can restore any VM in the datastore.
* VMware consistency snapshot failures for a VM
    Even if a VMware consistency snapshot for a VM fails, the VM is nevertheless backed up. You can view the entities contained in the backup copy in the Restore wizard and use it for restore operations.

### Restore a VM from a backup

1.	In the VMware vSphere web client GUI, select **Menu** in the toolbar. Select **Inventory** and then  **Virtual Machines and Templates**.
2.	In the left navigation, right-click a Virtual Machine, then select **NetApp Cloud Backup** in the drop-down list. Select **Restore** to initiate the wizard.
3.	In the Restore wizard, on the **Select Backup** page, select the backup snapshot copy that you want to restore.
    You can search for a specific backup name or a partial backup name, or you can filter the backup list by selecting the filter icon and then choosing a date and time range, selecting whether you want backups that contain VMware snapshots, whether you want mounted backups, and the location. Select **OK** to return to the wizard.
1. On the **Select Scope** page, select **Entire Virtual Machine** in the **Restore scope** field, then select **Restore location**, and then enter the destination ESXi information where the backup should be mounted.
1. 
When restoring partial backups, the restore operation skips the Select Scope page.
1. Enable **Restart VM** checkbox if you want the VM to be powered on after the restore operation.
1. On the **Select Location** page, select the location for the restored datastore.
1. Review the **Summary** page and then select **Finish**.
1. **Optional:** Monitor the operation progress by clicking Recent Tasks at the bottom of the screen.
1. Although the VMs are restored, they are not automatically added to their former resource groups. Therefore, you must manually add the restored VMs to the appropriate resource groups.

## Restore deleted VMs from backups

You can restore a deleted VM from a datastore primary or secondary backup to an ESXi host that you select. You can also restore VMs to the original datastore mounted on the original ESXi host, which creates a clone of the VM.

### Prerequisites

* You must have added the Azure cloud Subscription account.
    The user account in vCenter must have the minimum vCenter privileges required for Cloud Backup for Virtual Machines.
* A backup must exist.
    You must have created a backup of the VM using the Cloud Backup for Virtual Machines before you can restore the VMDKs on that VM.

### Considerations for restoring deleted VMs

You cannot restore a datastore, but you can restore any VM in the datastore.

### Restore deleted VMs

1. Select **Menu** and then select the **Inventory** option.
1. Select a datastore, then select the **Configure** tab, and then select **Backups in the Cloud Backup for Virtual Machines** section.
1. Select (double-click) on a backup to see a list of all VMs that are included in the backup.
1. Select the deleted VM from the backup list and then select **Restore**.
1. On the **Select Scope** page, select **Entire Virtual Machine** in the **Restore scope field**, then select the restore location, and then enter the destination ESXi information where the backup should be mounted.
1. Enable **Restart VM** checkbox if you want the VM to be powered on after the restore operation.
1. On the **Select Location** page, select the location of the backup that you want to restore.
1. Review the Summary page and then click Finish.

## Restore VMDKs from backups

You can restore existing VMDKs or deleted or detached VMDKs from either a primary or secondary backup. You can restore one or more VMDKs on a VM to the same datastore.

### Prerequisites

* A backup must exist.
    You must have created a backup of the VM using the Cloud Backup for Virtual Machines.
* The VM must not be in transit.
    The VM that you want to restore must not be in a state of vMotion or Storage vMotion.

### Considerations for restoring VMDKs

* If the VMDK is deleted or detached from the VM, then the restore operation attaches the VMDK to the VM.
* Attach and restore operations connect VMDKs using the default SCSI controller. VMDKs that are attached to a VM with a NVME controller are backed up, but for attach and restore operations they are connected back using a SCSI controller.

### Restore VMDKs

1. In the VMware vSphere web client GUI, select Menu in the toolbar. Then select **Inventory** and then  **Virtual Machines and Templates**.
1. In the left navigation, right-click a VM, then select **NetApp Cloud Backup**. In the drop-down list, and then select **Restore**.
1. In the Restore wizard, on the **Select Backup** page, select the backup copy from which you want to restore. To find the backup, either:
    * Search for a specific backup name or a partial backup name
    * Filter the backup list by selecting the filter icon and selecting a date and time range, selecting whether you want backups that contain VMware snapshots, whether you want mounted backups, and primary location.
    Select **OK** to return to the wizard.
1. On the **Select Scope** page, select **Particular virtual disk** in the Restore scope field, then select the virtual disk and destination datastore
1. On the **Select Location** page, select the snapshot copy that you want to restore.
1. Review the **Summary** page and then select **Finish**.
1. **Optional:** Monitor the operation progress by clicking Recent Tasks at the bottom of the screen.

## Recovery of Cloud Backup for Virtual Machines internal database

You can use the maintenance console to restore a specific backup of the MySQL database (also called an NSM database) for Cloud Backup for Virtual Machines.

1. Open a maintenance console window.
1. From the main menu, enter option **1) Application Configuration**.
1. From the Application Configuration menu, enter option **6) MySQL backup and restore**.
1. From the MySQL Backup and Restore Configuration menu, enter option **2) List MySQL backups**. Make note of the backup you want to restore.
1. From the MySQL Backup and Restore Configuration menu, enter option **3) Restore MySQL backup**.
1. At the prompt “Restore using the most recent backup,” enter **n**.
1. At the prompt “Backup to restore from,” enter the backup name, and then select **Enter**.
    The selected backup MySQL database will be restored to its original location.
