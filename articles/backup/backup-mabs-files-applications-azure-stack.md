---
title: Back up Azure Stack files and applications'
description: Use Azure Backup to back up and recover Azure Stack files and applications to your Azure Stack environment.
services: backup
author: adiganmsft
manager: shivamg
ms.service: backup
ms.topic: conceptual
ms.date: 5/18/2018
ms.author: adigan
---
# Back up files and applications on Azure Stack
You can use Azure Backup to protect (or back up) files and applications on Azure Stack. To back up files and applications, install Microsoft Azure Backup Server as a virtual machine running on Azure Stack. You can protect any applications, running on any Azure Stack server in the same virtual network. Once you have installed Azure Backup Server, add Azure disks to increase the local storage available for short-term backup data. Azure Backup Server uses Azure storage for long-term retention.

> [!NOTE]
> Though Azure Backup Server and System Center Data Protection Manager (DPM) are similar, DPM is not supported for use with Azure Stack.
>


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


## Install Azure Backup Server
To install Azure Backup Server on an Azure Stack virtual machine, see the article, [Preparing to back up workloads using Azure Backup Server](backup-mabs-install-azure-stack.md). Before installing and configuring Azure Backup Server, be aware of the following:

### Determining size of virtual machine
To run Azure Backup Server on an Azure Stack virtual machine, use size A2 or larger. For assistance in choosing a virtual machine size, download the [Azure Stack VM size calculator](https://www.microsoft.com/download/details.aspx?id=56832).

### Virtual Networks on Azure Stack virtual machines
All virtual machines used in an Azure Stack workload must belong to the same Azure virtual network and Azure Subscription.

### Storing backup data on local disk and in Azure
Azure Backup Server stores backup data on Azure disks attached to the virtual machine, for operational recovery. Once the disks and storage space are attached to the virtual machine, Azure Backup Server manages storage for you. The amount of backup data storage depends on the number and size of disks attached to each [Azure Stack virtual machine](../azure-stack/user/azure-stack-storage-overview.md). Each size of Azure Stack VM has a maximum number of disks that can be attached to the virtual machine. For example, A2 is four disks. A3 is eight disks. A4 is 16 disks. Again, the size and number of disks determines the total backup storage pool.

> [!IMPORTANT]
> You should **not** retain operational recovery (backup) data on Azure Backup Server-attached disks for more than five days.
>

Storing backup data in Azure reduces backup infrastructure on Azure Stack. If data is more than five days old, it should be stored in Azure.

To store backup data in Azure, create or use a Recovery Services vault. When preparing to back up the Azure Backup Server workload, you [configure the Recovery Services vault](backup-azure-microsoft-azure-backup.md#create-a-recovery-services-vault). Once configured, each time a backup job runs, a recovery point is created in the vault. Each Recovery Services vault holds up to 9999 recovery points. Depending on the number of recovery points created, and how long they are retained, you can retain backup data for many years. For example, you could create monthly recovery points, and retain them for five years.
 
### Using SQL Server
If you want to use a remote SQL Server for the Azure Backup Server database, select only an Azure Stack VM running SQL Server.

### Azure Backup Server VM performance
If shared with other virtual machines, the storage account size and IOPS limits can impact the Azure Backup Server virtual machine performance. For this reason, you should use a separate storage account for the Azure Backup Server virtual machine. The Azure Backup agent running on the Azure Backup Server needs temporary storage for:
    - its own use (a cache location),
    - data restored from the cloud (local staging area)
  
### Configuring Azure Backup temporary disk storage
Each Azure Stack virtual machine comes with temporary disk storage, which is available to the user as volume `D:\`. The local staging area needed by Azure Backup can be configured to reside in `D:\`, and the cache location can be placed on `C:\`. In this way, no storage needs to be carved away from the data disks attached to the Azure Backup Server virtual machine.

### Scaling deployment
If you want to scale your deployment, you have the following options:
  - Scale up - Increase the size of the Azure Backup Server virtual machine from A series to D series, and increase the local storage [per the Azure Stack virtual machine instructions](../azure-stack/user/azure-stack-manage-vm-disks.md).
  - Offload data - send older data to Azure Backup Server and retain only the newest data on the storage attached to the Azure Backup Server.
  - Scale out - Add more Azure Backup Servers to protect the workloads.

## See also
For information on using Azure Backup Server to protect other workloads, see one of the following articles:
- [Back up SharePoint farm](backup-azure-backup-sharepoint-mabs.md)
- [Back up SQL server](backup-azure-sql-mabs.md)
