---
title: Configure Cloud Backup for Virtual Machines 
description: Configure Cloud Backup for Virtual Machines enables you to mount and unmount datastores, and attach and detach VMDKs.
ms.topic: how-to
ms.service: azure-vmware
ms.author: anfdocs
ms.date: 12/03/2024
ms.custom: engagement-fy24
---

# Configure Cloud Backup for Virtual Machines (preview)

Learn how to mount and unmount datastores and attach and detach virtual machine disks (VMDKs) using Cloud Backup for Virtual Machines.

## Mount a backup

You can mount a traditional datastore from a backup if you want to access files in the backup. You can either mount the backup to the same ESXi host where the backup was created or to an alternate ESXi host that has the same type of VM and host configurations. You can mount a datastore multiple times on a host.

1.	In the left navigation of the vCenter web client page, select **Storage**.
2.	Right-click a datastore then go to **Cloud Backup for Virtual Machines > Mount Backup**.
3.	On the **Mount Datastore** page, select a backup and a backup location (primary or Azure NetApp Files backup), then select **Finish**.
4.	Optional: To verify that the datastore is mounted, perform the following:
    1.	Select **Menu** in the toolbar, and then select Storage from the drop-down list.
    2.	The left navigator pane displays the datastore you mounted.

## Unmount a backup

You can unmount a backup when you no longer need to access the files in the datastore.

If a backup is listed as mounted in the VMware vSphere client GUI, but it's not listed in the unmount backup screen, you need to use the REST API endpoint `/backup/{backup-Id}/cleanup` to clean up the out-of-bound datastores. After cleanup, try the unmount procedure again.

1.	In the left navigation of the vCenter web client page, select **Storage**.
2.	Right-click a datastore and then go to **Cloud Backup for Virtual Machines > Unmount**.

    >[!NOTE]
    > Ensure that you have selected the correct datastore to unmount. Choosing the incorrect datastore can cause an impact on production work.
    
3.	In the **Unmount Cloned Datastore** dialog box, select a datastore, select the Unmount the cloned datastore checkbox, then select **Unmount**.

## Attach VMDKs to a VM 

You can attach one or more VMDKs from a backup to the parent VM, or to an alternate VM on the same ESXi host, or to an alternate VM on an alternate ESXi host managed by the same vCenter. 

You have the following attach options:
* You can attach virtual disks from a primary or an Azure NetApp Files backup.
* You can attach virtual disks to the parent VM (the same VM that the virtual disk was originally associated with) or to an alternate VM on the same ESXi host.
  
### Considerations for attaching VMDKs

* Attach and detach operations aren't supported for Virtual Machine Templates.
* You cannot manually attach a virtual disk that was attached or mounted as part of a guest file restore operation.

### Attach VMDKs

1.	In the VMware vSphere client GUI, select **Menu** in the toolbar then **Hosts and clusters** from the drop-down list.
2.	In the left navigation pane, right-click a VM, then select **Cloud Backup for Virtual Machines > Attach virtual disk(s)**.
3.	On the **Attach Virtual Disk** window, in the Backup section, select a backup.

  	Filter the backup list by selecting the filter icon and choosing a date and time range, selecting whether you want backups that contain VMware Snapshots, whether you want mounted backups, and the location. Select OK.
  
4.	In the **Select Disks** section, select one or more disks you want to attach and the location you want to attach from (primary or Azure NetApp Files backup).
   
    Change the filter to display primary and Azure NetApp Files backup locations.
  
5.	By default, the selected virtual disks are attached to the parent VM. To attach the selected virtual disks to an alternate VM in the same ESXi host, select **Click here to attach to alternate VM** and specify the alternate VM.
6.	Select **Attach**.
7.	Optional: Monitor the operation progress in the Recent Tasks section.
    
    Refresh the screen to display updated information.
   	
8.	Verify that the virtual disk is attached by performing the following:
    1.	Select **Menu** in the toolbar then **VMs and Templates** from the drop-down list.
    2.	In the left navigator pane right-click a VM, then select **Edit settings** in the drop-down list.
    3.	In the **Edit Settings** window, expand the list for each hard disk to display the list of disk files.
       
        The Edit Settings page lists the disks on the VM. You can expand the details for each hard disk to display the list of attached virtual disks.

## Detach a virtual disk
After you have attached a virtual disk to restore individual files, you can detach the virtual disk from the parent VM.

1.	In the VMware vSphere client GUI, select **Menu** in the toolbar. Select **VMs and Templates** from the drop-down list.
2.	In the left navigator pane, select a VM.
3.	In the left navigation pane, right-click the VM, then select **Cloud Backup for Virtual Machines** in the drop-down list, and then select **Detach virtual disk** in the secondary drop-down list.
4.	On the **Detach Virtual Disk** screen, select one or more disks you want to detach, then select the **Detach the selected disk(s)** checkbox, and click **Detach**.
 
    >[!NOTE]
    > Ensure that you select the correct virtual disk. Selecting the wrong disk might affect production work.

5.	Optional: Monitor the operation progress in the Recent Tasks section.
   
     Refresh the screen to display updated information.
  	
6.	Verify that the virtual disk is detached by performing the following:
    1.	Select **Menu** in the toolbar then **VMs and Templates** from the drop-down list.
    2.	In the left navigator pane, right-click a VM, then select **Edit settings** in the drop-down list.
    3.	In the **Edit Settings** window, expand the list for each hard disk to display the list of disk files.

        The Edit Settings page lists the disks on the VM. You can expand the details for each hard disk to display the list of attached virtual disks.

## Next steps 

* [Back up Azure NetApp Files datastores and VMs using Cloud Backup for Virtual Machines](backup-azure-netapp-files-datastores-vms.md)
* [Restore VMs using Cloud Backup for Virtual Machines](restore-azure-netapp-files-vms.md)