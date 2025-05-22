---
title: Restore guest files and folders using Cloud Backup for Virtual Machines 
description: Learn how to restore files or folders from a virtual machine disk (VMDK) on a Windows guest OS. 
ms.topic: how-to
ms.author: anfdocs
ms.service: azure-vmware
ms.date: 12/03/2024
ms.custom: engagement-fy24
---

# Restore guest files and folders using Cloud Backup for Virtual Machines (preview)

You can restore files or folders from a virtual machine disk (VMDK) on a Windows guest OS.

## Prerequisites to restore guest files and folders

* VMware tools must be installed and running.

  Cloud Backup for Virtual Machines uses information from VMware tools to establish a connection to the VMware Guest OS.

* The Windows Guest OS must be running Windows Server 2008 R2 or later.
* Credentials for the target virtual machine (VM) must specify the built-in domain administrator account or the built-in local administrator account. The username must be "Administrator." Before starting the restore operation, you must configure the credentials for the VM to which you want to attach the virtual disk. The credentials are required for both attaching the VM and the subsequent restore operation. Workgroup users can use the built-in local administrator account.

  >[!NOTE]
  > If you need to use an account other than the built-in administrator account and that account has administrative privileges within the VM, you must disable user account control (UAC) on the guest VM.
  
* You must know the location of the backup snapshot and VMDK to restore from.

  Cloud Backup for Virtual Machines doesn't support searching of files or folders to restore. Before you begin, you must know the location of the files or folders with respect to the snapshot and the corresponding VMDK.

* The virtual disk to be attached must be in a Cloud Backup for Virtual Machines backup.

  The virtual disk that contains the file or folder you want to restore must be in a VM backup that was performed using the virtual appliance for Cloud Backup for Virtual Machines.

* To use a proxy VM, the proxy VM must be configured.

  If you want to attach a virtual disk to a proxy VM, the proxy VM must be configured before the attach and restore operation begins.

* For files with non-English alphabet names, you must restore them in a directory, not as a single file.

  You can restore files with non-alphabetic names, such as Japanese Kanji, by restoring the directory in which the files are located.

* Restoring from a Linux guest OS is not supported.

  You can't restore files and folders from a VM that is running Linux guest OS. You can attach a VMDK then manually restore the files and folders. 

## Considerations for restoring guest files and folders

Before you restore a file or folder from a guest OS, be aware of unsupported operations.

* You can't restore dynamic disk types inside a guest OS.
* If you restore an encrypted file or folder, the encryption attribute is not retained. You can't restore files or folders to an encrypted folder.
* The Guest File Browse page displays the hidden files and folder, which you can't filter.
* You can't restore from a Linux guest OS.
  
  You can't restore files and folders from a VM that is running Linux guest OS. However, you can attach a VMDK then manually restore the files and folders.

* You can't restore from an NTFS file system to a FAT file system.

  When you try to restore from NTFS-format to FAT-format, the NTFS security descriptor is not copied because the FAT file system does not support Windows security attributes.

* You can't restore guest files from a cloned VMDK or an uninitialized VMDK.
* You can't restore the directory structure for a file.

  If a file in a nested directory is selected to be restored, the file is not restored with the same directory structure. The directory tree is not restored, only the file. If you want to restore a directory tree, you can copy the directory itself at the top of the structure.

* You can't restore encrypted guest files.

## Restore guest files and folders from VMDKs

You can restore one or more files or folders from a VMDK on a Windows guest OS.

By default, the attached virtual disk is available for 24 hours. After 24 hours, it's automatically detached. You can choose in the wizard to have the session automatically deleted when the restore operation completes, or you can manually delete the Guest File Restore session at any time, or you can extend the time in the Guest Configuration page.

 >[!NOTE]
 > Only one attach or restore operation can run at the same time on a VM. You can't run parallel attach or restore operations on the same VM.

 >[!NOTE]
 > The guest restore feature allows you to view and restore system and hidden files and to view encrypted files. Do not attempt to overwrite an existing system file or to restore encrypted files to an encrypted folder. During the restore operation, the hidden, system, and encrypted attributes of guest files are not retained in the restored file. Viewing or browsing reserved partitions might cause an error.

1.	From the vSphere client shortcuts window, select **Hosts and Clusters** and select a VM.
2.	Right-click on the VM and select **Cloud Backup for Virtual Machines > Guest File Restore**.
3.	On the **Restore Scope** page, specify the backup that contains the virtual disk you want to attach by doing the following:
    1.	In the **Backup Name** table, select the backup that contains the virtual disk that you want attach.
    2.	In the **VMDK table**, select the virtual disk that contains the files or folders you want to restore.
    3.	In the **Locations** table, select the location (primary or Azure NetApp Files backup) of the virtual disk that you want to attach.
4.	On the Guest Details page:
    1.	Choose where to attach the virtual disk:
       
        | Select this option… | If... |
        | ------ | ----- |
        | Use Guest VM | You want to attach the virtual disk to the VM that you right-clicked before you started the wizard. Then select the credential for the VM that you right-clicked.<br /><br /> Ensure that the credentials have been created for the VM.|
        | Use Guest File Restore proxy VM | You want to attach the virtual disk to a proxy VM then select the proxy VM.<br /><br /> Ensure that the proxy VM is configured before the attach and restore operation begins. |

5.	Review the summary. Select **Finish**.

  	Before you select Finish, you can go back to any page in the wizard and change the information.	

6.	Wait until the attach operation completes.
   
    You can view the progress of the operation in the Dashboard job monitor.

7.	To find the files that you want to restore from the attached virtual disk, select Cloud Backup for Virtual Machines from the vSphere client shortcuts window.
8.	In the left navigator pane, select **Guest File Restore > Guest Configuration**.

    In the Guest Session Monitor table, you can display additional information about a session by selecting *… *in the right column.

9.	Select the guest file restore session for the virtual machine.
    
    All partitions are assigned a drive letter, including system reserved partitions. If a VMDK has multiple partitions, you can select a specific drive by 
    selecting the drive in the drop-down list in the drive field at the top of the Guest File Browse page.

10.	Select the **Browse Files** icon to view a list of files and folders on the virtual disk.

    When you select a folder to browse and select individual files, you can experience latency while fetching the list of files. The fetch 
    operation is performed at run time.

    For easier browsing, you can use filters in your search string. The filters are case-sensitive Perl expressions without spaces. The default search string is `.*`.
    The Guest File Browse page displays all hidden files and folders in addition to all other files and folders.

11.	Select one or more files or folders that you want to restore, then select **Select Restore Location**.
    
    The files and folders to be restored are listed in the Selected File(s) table.

12.	In the **Select Restore Location** page, specify the following:
    
    | Option | Description |
    | ------ | ----- |
    | Restore to path | Enter the UNC share path to the guest where the selected files should be restored.<br /><br />IPv4 example: `\\10.60.136.65\c$<br` />IPv6 example: `\\fd20-8b1e-b255-832e—61.ipv6-literal.net\C\restore` |
    | If original file(s) exist | Select the action to be taken if the file or folder to be restored already exists on the restore destination: Always overwrite or Always skip. <br /> <br /> If the folder already exists, then the contents of the folder are merged with the existing folder. |
    | Disconnect Guest Session after successful restore | Select this option if you want the guest file restore session to be deleted when the restore operation completes. |

13.	Select **Restore**.

    You can view the progress of the restore operation in the Dashboard job monitor.

## Set up proxy VMs for restore operations

If you want to use a proxy VM for attaching a virtual disk for guest file restore operations, you must set up the proxy VM before you begin the restore operation. Although you can set up a proxy VM at any time, it might be more convenient to set it up immediately after the plug-in deployment completes.

1.	From the vSphere client shortcuts window, select **Cloud Backup for Virtual Machines** under plug-ins.
2.	In the left navigation select **Guest File Restore**.
3.	In the **Run As Credentials** section, do one of the following:
   
    | To do this… | Do this... |
    | ------ | ----- |
    | Use existing credentials | Select any of the configured credentials. |
    | Add new credentials | 1.	Select **Add**.<br /><br /> 2.	In the Run As Credentials dialog box, enter the credentials.<br /><br /> 3.	Select Select VM, then select a VM in the Proxy VM dialog box. Select **Save** to return to the Run As Credentials dialog box.<br /><br /> 4.	Enter the credentials.<br /> For Username, you must enter “Administrator”. |
    
Cloud Backup for Virtual Machines uses the selected credentials to log into the selected proxy VM.

The Run As credentials must be the default domain administrator that is provided by Windows or the built-in local administrator. Workgroup users can use the built-in local administrator account.

4.	In the **Proxy Credentials** section, select **Add** to add a VM to use as a proxy.
5.	In the **Proxy VM dialog** box, complete the information, then select **Save**.

    >[!NOTE]
    > You need to delete the proxy VM from the Cloud Backup for Virtual Machines UI before you can delete it from ESXi host.

## Configure credentials for VM guest file restores
When you attach a virtual disk for guest file or folder restore operations, the target VM for the attach must have credentials configured before you restore.

The following table lists the credential requirements for guest restore operations.

| User | User access control enabled | User access control disabled |
| ------ | ----- | ------ |
| Domain user | A domain user with “administrator” as the username works fine. For example, “NetApp\administrator”. However, a domain user with “xyz” as the username that belongs to a local administrator group doesn't work. For example, you can't use “NetApp\xyz”. | Either a domain user with “administrator” as the username or a domain user with “xyz” as the username that belongs to a local administrator group, works fine. For example, “NetApp\administrator” or “NetApp\xyz”. |
| Workgroup user | A local user with “administrator” as the username works fine. However, a local user with “xyz” as the username that belongs to a local administrator group doesn't work. | Either a local user with “administrator” as the username or a local user with “xyz” as the username that belongs to a local administrator group, works fine. However, a local user with “xyz” as the username that does not belong to local administrator group doesn't work. |

In the preceding examples, “NetApp” is the dummy domain name and “xyz” is the dummy local username.

1.	From the vSphere client shortcuts window, select **Cloud Backup for Virtual Machines** under plug-ins.
2.	In the left navigation select **Guest File Restore**.
3.	In the **Run As Credentials** section, do one of the following:

    | To do this… | Do this... |
    | ------ | ----- |
    | Use existing credentials | Select any of the configured credentials. |
    | Add new credentials | 1.	Select **Add**.<br /><br /> 2.	In the Run As Credentials dialog box, enter the credentials. For Username, you must enter “Administrator”.<br /><br /> 3.	Select Select VM, then select a VM in the Proxy VM dialog box. Select **Save** to return to the Run As Credentials dialog box.<br /><br /> 4. Select the VM that should be used to authenticate the credentials. |

Cloud Backup for Virtual Machines uses the selected credentials to sign into to the selected VM.

4.	Select **Save**.

## Extend the time of a guest file restore session

By default, an attached Guest File Restore VMDK is available for 24 hour. After 24 hours, it's automatically detached. You can extend the time in the Guest Configuration page.

 >[!NOTE]
 > You might want to extend a guest file restore session if you want to restore additional files or folders from the attached VMDK at a later time. However, because guest file restore sessions use a lot of resources, extending the session time should be performed only occasionally.

1.	In the Cloud Backup for Virtual Machines, select **Guest File Restore**.
2.	Select a guest file restore session then select the **Extend Selected Guest Session** icon in the Guest Session Monitor title bar.

  	The session is extended for another 24 hours.
