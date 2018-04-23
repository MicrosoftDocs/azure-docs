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
You can use Azure Backup to protect (or back up) files and applications on Azure Stack. To back up files and applications, install Microsoft Azure Backup Server as a virtual machine running on Azure Stack. Once you have installed Azure Backup Server, add Azure disks to increase the local storage available for short-term backup data. Azure Backup Server uses Azure storage for long-term retention.

## Azure Backup Server protection matrix
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

## Install Azure Backup Server
To install Azure Backup Server on an Azure Stack virtual machine, see the article, [Preparing to back up workloads using Azure Backup Server](backup-azure-microsoft-azure-backup.md). Before installing and configuring Azure Backup Server, be aware of the following:

### Determining size of virtual machine
To run Azure Backup Server on an Azure Stack virtual machine, use size A2 or larger. For assistance in choosing a virtual machine size, download the [DPM IaaS VM calculator](http://go.microsoft.com/fwlink/?linkid=512026). System Center DPM and Azure Backup Server are similar, and the calculator helps determine the needed VM size.

### Virtual Networks on Azure Stack virtual machines
All virtual machines used in an Azure Stack workload must belong to the same Azure virtual network and Azure Subscription. 

### Storing backup data on local disk and in Azure
Azure Backup Server stores backup data on Azure disks attached to the virtual machine, for operational recovery. Once the disks and storage space are attached to the virtual machine, Azure Backup Server manages storage for you. The amount of backup data storage depends on the number and size of disks attached to each [Azure Stack virtual machine](../azure-stack/user/azure-stack-storage-overview.md). Each size of Azure Stack VM has a maximum number of disks that can be attached to the virtual machine. For example, A2 is four disks. A3 is eight disks. A4 is 16 disks. Again, the size and number of disks determines the total backup storage pool.

> [!IMPORTANT]
> You should **not** retain operational recovery (backup) data on Azure Backup Server-attached disks for more than five days.
>

Storing backup data in Azure reduces backup infrastructure on Azure Stack. If data is more than five days old, it should be stored in Azure.

To store backup data in Azure, create or use a Recovery Services vault. When preparing to back up the Azure Backup Server workload, you will [configure the Recovery Services vault](backup-azure-microsoft-azure-backup.md#recovery-services-vault). Once configured, each time a backup job runs, a recovery point is created in the vault. Each Recovery Services vault holds up to 9999 recovery points. Depending on the number of recovery points created, and how long they are retained, you can retain backup data for many years. For example, you could create monthly recovery points, and retain them for five years.
 
### Using SQL Server
If you want to use a remote SQL Server for the Azure Backup Server database, select only an Azure Stack VM running SQL Server.

### Azure Backup Server VM performance
If shared with other virtual machines, the storage account size and IOPS limits can impact the Azure Backup Server virtual machine performance. For this reason, you should use a separate storage account for the Azure Backup Server virtual machine. The Azure Backup agent running on the Azure Backup Server needs temporary storage for:
    - its own use (a cache location),
    - data restored from the cloud (local staging area)
  
### Configuring Azure Backup temporary disk storage
Each Azure Stack virtual machine comes with temporary disk storage, which is available to the user as volume D:`\`. The local staging area needed by Azure Backup can be configured to reside in D:`\`, and the cache location can be placed on C:`\`. In this way, no storage needs to be carved away from the data disks attached to the Azure Backup Server virtual machine.

### Scaling deployment
If you want to scale your deployment, you have the following options:
  - Scale up - Increase the size of the Azure Backup Server virtual machine from A series to D series, and increase the local storage [per the Azure Stack virtual machine instructions](../azure-stack/user/azure-stack-manage-vm-disks.md).
  - Offload data - send older data to Azure Backup Server and retain only the newest data on the storage attached to the Azure Backup Server.
  - Scale out - Add more Azure Backup Servers to protect the workloads.


## Bare Metal Recovery for Azure Stack VM

A bare metal recovery (BMR) backup protects operating system files and all Critical volume data, except user data. A BMR backup includes a system state backup. The following procedures explain how to restore the BMR data. 

### Run Recovery on the Azure Backup Server 

Open the Azure Backup Server console.

1. In the console, click **Recovery**, find the machine you want to recover, and click **Bare Metal Recovery**.
2. Available recovery points appear in bold on the calendar. Select the date and time for the recovery point you want to use.
3. In **Select Recovery Type**, select **Copy to a network folder**.
4. In **Specify Destination**, select where you want to copy the data. Remember the selected destination must have enough room for the recovery point. It is suggested you create a new folder.
5. In **Specify Recovery Options**, select the security settings to apply, and choose whether to use SAN-based hardware snapshots for quicker recovery.     SAN-based hardware snapshots are an option only if you have a SAN with this functionality enabled, and the ability to create and split a clone to make it writable. Also for SAN-based hardware snapshots to work, the protected machine and Azure Backup Server must be connected to the same network.
6. Set up notification options, and click **Recover** on the **Summary** page.

### Set up the share location
In the Azure Backup Server console:
1. In the restore location, navigate to the folder containing the backup.
2. Share the folder above WindowsImageBackup so that the root of the shared folder is the WindowsImageBackup folder. If the WindowsImageBackup folder isn't shared, the restore operation won't find the backup. To connect using WinRE, you need a WinRE-accessible share and the correct IP address and credentials.

### Restore the machine

1. On the virtual machine where you want to restore BMR, open an elevated cmd prompt and type the following commands. **/bootore** specifies that Windows RE starts automatically the next time the system start.
```
Reagent /boottore
shutdown /r /t 0
```

2. In the opening dialog, select the language and locale settings. On the **Install** screen, select **Repair your computer**.
3. On the **System Recovery Options** page, select **Restore your computer using a system image you created earlier**.
4. On the **Select a system image backup** page, choose **Select a System image** > **Advanced** > **Search for a system image on the network**. If a warning appears, select **Yes**. To choose the image, go to the network share, enter the credentials, and select the recovery point. This scans for specific backups available in that recovery point. Select the recovery point.
5. In **Choose how to restore the backup**, select **Format and repartition disks**. In the next screen, verify settings and click **Finish** to begin the restore job. A Restart as required.

## See also
For information on using Azure Backup Server to protect other workloads, see one of the following articles:
- [Back up SharePoint farm](backup-azure-backup-sharepoint-mabs.md)
- [Back up SQL server](backup-azure-sql-mabs.md)
