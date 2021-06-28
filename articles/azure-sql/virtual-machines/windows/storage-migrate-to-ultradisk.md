---
title: Migrate log disk to Ultra disk
description: Learn how to migrate your SQL Server on Azure Virtual Machine (VM) log disk to an Azure Ultradisk to take advantage of high performance and low latency. 
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
editor: ''
tags: azure-service-management
ms.assetid: 
ms.service: virtual-machines-sql
ms.subservice: management

ms.topic: how-to
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 07/09/2020
ms.author: mathoma
ms.reviewer: jroth

---
# Migrate log disk to Ultra disk
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

Azure ultra disks deliver high throughput, high IOPS, and consistently low latency disk storage for SQL Server on Azure Virtual Machine (VM). 

This article teaches you to migrate your log disk to an ultra SSD to take advantage of the performance benefits offered by ultra disks. 

## Back up database

Complete a [full backup](backup-restore.md) up of your database. 

## Attach disk

Attach the Ultra SSD to your virtual machine once you have enabled ultradisk compatibility on the VM. 

Ultra disk is supported on a subset of VM sizes and regions. Before proceeding, validate that your VM is in a region, zone, and size that supports ultra disk. You can [determine and validate VM size and region](../../../virtual-machines/disks-enable-ultra-ssd.md#determine-vm-size-and-region-availability) using the Azure CLI or PowerShell. 

### Enable compatibility

To enable compatibility, follow these steps:

1. Go to your virtual machine in the [Azure portal](https://portal.azure.com/). 
1. Stop/deallocate the virtual machine. 
1. Select **Disks** under **Settings** and then select **Additional settings**. 

   :::image type="content" source="media/storage-migrate-to-ultradisk/additional-disks-settings-azure-portal.png" alt-text="Select additional settings for Disks under Settings in the Azure portal":::

1. Select **Yes** to **Enable Ultra disk compatibility**. 

   :::image type="content" source="../../../virtual-machines/media/virtual-machines-disks-getting-started-ultra-ssd/enable-ultra-disks-existing-vm.png" alt-text="Screenshot that shows the Yes option.":::

1. Select **Save**. 



### Attach disk

Use the Azure portal to attach an ultra disk to your virtual machine. For details, see [Attach an ultra disk](../../../virtual-machines/disks-enable-ultra-ssd.md#attach-an-ultra-disk).

Once the disk is attached, start your VM once more using the Azure portal. 



## Format disk

Connect to your virtual machine and format your ultra disk.  

To format your ultra disk, follow these steps:

1. Connect to your VM by using Remote Desktop Protocol (RDP).
1. Use [Disk Management](/windows-server/storage/disk-management/overview-of-disk-management) to format and partition your newly attached ultra disk. 


## Use disk for log

Configure SQL Server to use the new log drive. You can do so using Transact-SQL (T-SQL) or SQL Server Management Studio (SSMS). The account used for the SQL Server service account must have full control of the new log file location. 

### Configure permissions

1. Verify the service account used by SQL Server. You can do so by using SQL Server Configuration Manager or Services.msc.
1. Navigate to your new disk. 
1. Create a folder (or multiple folders) to be used for your log file. 
1. Right-click the folder and select **Properties**.
1. On the **Security** tab, grant full control access to the SQL Server service account. 
1. Select **OK**  to save your settings. 
1. Repeat this for every root-level folder where you plan to have SQL data. 

### Use new log drive 

After permission has been granted, use either Transact-SQL (T-SQL) or SQL Server Management Studio (SSMS) to detach the database and move existing log files to the new location.

   > [!CAUTION]
   > Detaching the database will take it offline, closing connections and rolling back any transactions that are in-flight. Proceed with caution and during a down-time maintenance window. 



# [Transact-SQL (T-SQL)](#tab/tsql)

Use T-SQL to move the existing files to a new location:

1. Connect to your database in SQL Server Management Studio and open a **New Query** window. 
1. Get the existing files and locations:

   ```sql
   USE AdventureWorks
   GO

   sp_helpfile
   GO
   ```

1. Detach the database: 

   ```sql
   USE master
   GO

   sp_detach_db 'AdventureWorks'
   GO
   ```

1. Use file explorer to move the log file to the new location on the ultra disk. 

1. Attach the database, specifying the new file locations: 

   ```sql
    sp_attach_db 'AdventureWorks'
   'E:\Fixed_FG\AdventureWorks.mdf',
   'E:\Fixed_FG\AdventureWorks_2.ndf',
   'F:\New_Log\AdventureWorks_log.ldf'
   GO
   ```

At this point, the database comes online with the log in the new location. 



# [SQL Server Management Studio (SSMS)](#tab/ssms)

Use SSMS to move the existing files to a new location:

1. Connect to your database in SQL Server Management Studio (SSMS). 
1. Right-click the database, select **Properties** and then select **Files**. 
1. Note down the path of the existing files. 
1. Select **OK** to close the dialog box. 
1. Right-click the database, select **Tasks** > **Detach**. 
1. Follow the wizard to detach the database. 
1. Use File Explorer to manually move the log file to the new location.
1. Attach the database in SQL Server Management Studio
   1. Right-click **Databases** in **Object Explorer** and select **Attach database**. 
   1. Using the dialog box, add each file, including the log file in its new location. 
   1. Select **OK** to attach the database. 

At this point, the database comes online with the log in the new location.

---


## Next steps

Review the [performance best practices](./performance-guidelines-best-practices-checklist.md) for additional settings to improve performance. 

For an overview of SQL Server on Azure Virtual Machines, see the following articles:

- [Overview of SQL Server on Windows VMs](sql-server-on-azure-vm-iaas-what-is-overview.md)
- [Overview of SQL Server on Linux VMs](../linux/sql-server-on-linux-vm-what-is-iaas-overview.md)