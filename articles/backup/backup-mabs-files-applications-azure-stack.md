---
title: 'Back up Azure Stack files and applications | Microsoft Docs'
description: Use Azure Backup to back up and recover Azure Stack files and applications to your Azure Stack environment.
services: backup
documentationcenter: ''
author: adiganmsft
manager: shivamg
editor: ''
keyword: 

ms.assetid: 
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/20/2018
ms.author: adigan,markgal

---
# Back up files and applications on Azure Stack
You can use Azure Backup to protect (or back up) files and applications on Azure Stack. To back up files and applications, install Microsoft Azure Backup server as a virtual machine running on Azure Stack. Once you have installed Azure Backup Server, add Azure disks to increase the local storage available for short-term backup data. Azure Backup Server uses Azure storage for long-term retention.

## Azure Backup server protection matrix
Azure Backup Server protects the following Azure Stack virtual machine workloads.

| Protected data source | Protection and recovery |
| --------------------- | ----------------------- |
| Windows Server Semi Annual Channel - Datacenter/Enterprise/Standard | Volumes, files, folders |
| Windows Server 2016 - Datacenter/Enterprise/Standard | Volumes, files, folders |
| Windows Server 2012 R2 - Datacenter/Enterprise/Standard | Volumes, files, folders |
| Windows Server 2012 - Datacenter/Entprise/Standard | Volumes, files, folders |
| Windows Server 2008 R2 - Datacenter/Enterprise/Standard | Volumes, files, folders |
| SQL Server 2016 | Database |
| SQL Server 2014 | Database |
| SQL Server 2012 SP1 | Database |
| SharePoint 2013 | Farm, database, frontend, web server |
| SharePoint 2010 | Farm, database, frontend, web server |
| System State | System State |
| Bare metal recovery (BMR) | BMR, System State, files, folders | 

## Install Azure Backup server
To install Azure Backup server on an Azure Stack virtual machine, use the [Preparing to back up workloads using Azure Backup server](backup-azure-microsoft-azure-backup.md) article. This article provides the steps for installation. Before installing and configuring Azure Backup server, be aware of the following:

- Use Azure Stack virtual machines size A2 or larger to run Azure Backup server. If you would like help choosing a size for the virtual machine, download the [DPM IaaS VM calculator](http://go.microsoft.com/fwlink/?linkid=512026). System Center DPM and Azure Backup server are similar, and the calculator helps determine the size of VM needed.
- To ensure Azure Backup server can protect workloads that run across multiple Azure Stack VMs, all VMs used in a workload must belong to the same Azure virtual network and Azure Subscription.
- Azure Backup server stores backup data on Azure disks attached to the virtual machine, for operational recovery. Once the disks and storage space are attached to the virtual machine, Azure Backup server manages storage for you. The amount of backup data you can store, depends on the number and size of disks attached to each [Azure Stack virtual machine](../azure-stack/user/azure-stack-storage-overview.md). There is a maximum number of disks that can be attached to each Azure Stack virtual machine. For example, A2 is four disks. A3 is eight disks. A4 is 16 disks. The size and number of disks determines the total backup storage pool.
- You should not retain operational recovery (backup) data on Azure Backup server-attached disks for more than five days. Store data older than five days, in Azure. Storing backup data in Azure reduces backup infrastructure on Azure Stack.
- To store backup data in Azure, you create or use a Recovery Services vault. When preparing to back up the Azure Backup server workload, you will configure the Recovery Services vault. Once you configure the workload to the vault, each time a backup job runs, a recovery point is created in the vault. Recovery Services vaults hold up to 9999 recovery points. Depending on the number of recovery points created, and how long they are retained, you can retain backup data for many years. For example, you could create monthly recovery points, and retain them for five years.
- If you want to use a remote SQL Server for the Azure Backup server database, select only an Azure Stack VM running SQL Server.
- Storage account size and IOPS limits can impact the Azure Backup server virtual machine performance, if shared with other running virtual machines. For this reason, you should use a separate storage account for the Azure Backup server virtual machine.
- The Azure Backup agent running on the Azure Backup server needs temporary storage for:
    - its own use (a cache location),
    - data restored from the cloud (local staging area)
  
  Each Azure Stack virtual machine comes with temporary disk storage, which is available to the user as volume D:`\`. The local staging area needed by Azure Backup can be configured to reside in D:`\`, and the cache location can be placed on C:`\`. In this way, no storage needs to be carved away from the data disks attached to the Azure Backup serer virtual machine.
- If you want to scale your deployment, you have the following options:
    - Scale up - Increase the size of the Azure Backup server virtual machine from A series to D series, and increase the local storage [per the Azure Stack virtual machine instructions](../azure-stack/user/azure-stack-manage-vm-disks.md).
    - Offload data - send older data to Azure Backup server and retain only the newest data on the storage attached to the Azure Backup server.
    - Scale out - Add more Azure Backup servers to protect the workloads.

- For more information on using Azure Backup server to protect workloads, see one of the following articles:
-     -[Back up SharePoint farm](backup-azure-backup-sharepoint-mabs.md)
-     -[Back up SQL server](backup-azure-sql-mabs.md)
 
- 

## Bare Metal Recovery for Azure Stack VM

When you back up to bare metal recovery (BMR), you back up operating system files and all data except user data on critical volumes. A BMR backup includes a system state backup. The following procedures explain how to restore the BMR data. 

### Run Recovery on the Azure Backup server 

Open the Azure Backup server console.

1. In the console, click **Recovery**, find the machine you want to recover, and click **Bare Metal Recovery**.
2. Available recovery points appear in bold on the calendar. Select the date and time for the recovery point you want to use.
3. In **Select Recovery Type**, select **Copy to a network folder**.
4. In **Specify Destination**, select where you want to copy the data. Remember the selected destination must have enough room for the recovery point. It is suggested you create a new folder.
5. In **Specify Recovery Options**, select the security settings to apply and choose whether to use SAN-based hardware snapshots for quicker recovery. (SAN-based hardware snapshots are an option only if you have a SAN with this functionality enabled, and the ability to create and split a clone to make it writable. In addition, the protected machine and Azure Backup server must be connected to the same network.)
6. Set up notification options, and click **Recover** on the **Summary** page.

### Set up the share location
In the Azure Backup server console:
1. In the restore location, navigate to the folder containing the backup.
2. Share the folder above WindowsImageBackup so that the root of the shared folder is the WindowsImageBackup folder. If the WindowsImageBackup folder isn't shared, the restore operation won't find the backup. To connect using WinRE, you need a WinRE-accessible share and the correct IP address and credentials.

### Restore the machine

1. On the virtual machine where you want to restore BMR, open an elevated cmd prompt to boot the machine into the recovery environment. At the cmd prompt, enter the following commands:
  ``C:\>reagent /boottore``<br/>
  ``C:\>shutdown /r /t 0``

2. In the opening dialog, select the language and locale settings. On the **Install** screen, select **Repair your computer**.
3. On the **System Recovery Options** page, select **Restore your computer using a system image you created earlier**.
4. On the **Select a system image backup** page, choose **Select a System image** > **Advanced** > **Search for a system image on the network**. If a warning appears, select **Yes**. To choose the image, go to the network share, enter the credentials, and select the recovery point. This scans for specific backups available in that recovery point. Select the recovery point.
5. In **Choose how to restore the backup**, select **Format and repartition disks**. In the next screen, verify settings and click **Finish** to begin the restore job. A Restart as required.

## Next steps
Use the following articles for:</br>
[Back up an IaaS VM](backup-azure-arm-vms-prepare.md)</br>
[Back up an Azure Backup Server](backup-azure-microsoft-azure-backup.md)</br>
[Back up a Windows Server](backup-configure-vault.md)
