---
title: Manage Azure Backup vaults and servers Azure using the classic deployment model | Microsoft Docs
description: Use this tutorial to learn how to manage Azure Backup vaults and servers.
services: backup
documentationcenter: ''
author: markgalioto
manager: carmonm
editor: tysonn

ms.assetid: f175eb12-0905-437f-91fd-eaee03ab6e81
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/14/2017
ms.author: markgal;

---
# Manage Azure Backup vaults and servers using the classic deployment model
> [!div class="op_single_selector"]
> * [Resource Manager](backup-azure-manage-windows-server.md)
> * [Classic](backup-azure-manage-windows-server-classic.md)
>
>

In this article you'll find an overview of the backup management tasks available through the Azure classic portal and the Microsoft Azure Backup agent.

> [!IMPORTANT]
> Azure has two different deployment models for creating and working with resources: [Resource Manager and Classic](../azure-resource-manager/resource-manager-deployment-model.md). This article covers using the Classic deployment model. Microsoft recommends that most new deployments use the Resource Manager model.

> [!IMPORTANT]
> You can now upgrade your Backup vaults to Recovery Services vaults. For details, see the article [Upgrade a Backup vault to a Recovery Services vault](backup-azure-upgrade-backup-to-recovery-services.md). Microsoft encourages you to upgrade your Backup vaults to Recovery Services vaults.<br/> **Starting November 1, 2017**:
>- Any remaining Backup vaults will be automatically upgraded to Recovery Services vaults.
>- You won't be able to access your backup data in the classic portal. Instead, use the Azure portal to access your backup data in Recovery Services vaults.
>

## Management portal tasks
1. Sign in to the [Management Portal](https://manage.windowsazure.com).
2. Click **Recovery Services**, then click the name of backup vault to view the Quick Start page.

    ![Recovery services](./media/backup-azure-manage-windows-server-classic/rs-left-nav.png)

By selecting the options at the top of the Quick Start page, you can see the available management tasks.

![Manage tabs](./media/backup-azure-manage-windows-server-classic/qs-page.png)

### Dashboard
Select **Dashboard** to see the usage overview for the server. The **usage overview** includes:

* The number of Windows Servers registered to cloud
* The number of Azure virtual machines protected in cloud
* The total storage consumed in Azure
* The status of recent jobs

At the bottom of the Dashboard you can perform the following tasks:

* **Manage certificate** - If a certificate was used to register the server, then use this to update the certificate. If you are using vault credentials, do not use **Manage certificate**.
* **Delete** - Deletes the current backup vault. If a backup vault is no longer being used, you can delete it to free up storage space. **Delete** is only enabled after all registered servers have been deleted from the vault.

![Backup dashboard tasks](./media/backup-azure-manage-windows-server-classic/dashboard-tasks.png)

## Registered items
Select **Registered Items** to view the names of the servers that are registered to this vault.

![Registered items](./media/backup-azure-manage-windows-server-classic/registered-items.png)

The **Type** filter defaults to Azure Virtual Machine. To view the names of the servers that are registered to this vault, select **Windows server** from the drop down menu.

From here you can perform the following tasks:

* **Allow Re-registration** - When this option is selected for a server you can use the **Registration Wizard** in the on-premises Microsoft Azure Backup agent to register the server with the backup vault a second time. You might need to re-register due to an error in the certificate or if a server had to be rebuilt.
* **Delete** - Deletes a server from the backup vault. All of the stored data associated with the server is deleted immediately.

    ![Registered items tasks](./media/backup-azure-manage-windows-server-classic/registered-items-tasks.png)

## Protected items
Select **Protected Items** to view the items that have been backed up from the servers.

![Protected items](./media/backup-azure-manage-windows-server-classic/protected-items.png)

## Configure
From the **Configure** tab you can select the appropriate storage redundancy option. The best time to select the storage redundancy option is right after creating a vault and before any machines are registered to it.

> [!WARNING]
> Once an item has been registered to the vault, the storage redundancy option is locked and cannot be modified.
>
>

![Configure](./media/backup-azure-manage-windows-server-classic/configure.png)

See this article for more information about [storage redundancy](../storage/storage-redundancy.md).

## Microsoft Azure Backup agent tasks
### Console
Open the **Microsoft Azure Backup agent** (you can find it by searching your machine for *Microsoft Azure Backup*).

![Backup agent](./media/backup-azure-manage-windows-server-classic/snap-in-search.png)

From the **Actions** available at the right of the backup agent console you can perform the following management tasks:

* Register Server
* Schedule Backup
* Back Up now
* Change Properties

![Agent console actions](./media/backup-azure-manage-windows-server-classic/console-actions.png)

> [!NOTE]
> To **Recover Data**, see [Restore files to a Windows server or Windows client machine](backup-azure-restore-windows-server.md).
>
>

### Modify an existing backup
1. In the Microsoft Azure Backup agent click **Schedule Backup**.

    ![Schedule a Windows Server Backup](./media/backup-azure-manage-windows-server-classic/schedule-backup.png)
2. In the **Schedule Backup Wizard** leave the **Make changes to backup items or times** option selected and click **Next**.

    ![Modify a scheduled backup](./media/backup-azure-manage-windows-server-classic/modify-or-stop-a-scheduled-backup.png)
3. If you want to add or change items, on the **Select Items to Backup** screen click **Add Items**.

    You can also set **Exclusion Settings** from this page in the wizard. If you want to exclude files or file types read the procedure for adding [exclusion settings](#exclusion-settings).
4. Select the files and folders you want to back up and click **Okay**.

    ![Add items](./media/backup-azure-manage-windows-server-classic/add-items-modify.png)
5. Specify the **backup schedule** and click **Next**.

    You can schedule daily (at a maximum of 3 times per day) or weekly backups.

    ![Specify your Backup schedule](./media/backup-azure-manage-windows-server-classic/specify-backup-schedule-modify-close.png)

   > [!NOTE]
   > Specifying the backup schedule is explained in detail in this [article](backup-azure-backup-cloud-as-tape.md).
   >
   >
6. Select the **Retention Policy** for the backup copy and click **Next**.

    ![Select your retention policy](./media/backup-azure-manage-windows-server-classic/select-retention-policy-modify.png)
7. On the **Confirmation** screen review the information and click **Finish**.
8. Once the wizard finishes creating the **backup schedule**, click **Close**.

    After modifying protection, you can confirm that backups are triggering correctly by going to the **Jobs** tab and confirming that changes are reflected in the backup jobs.

### Enable Network Throttling
The Azure Backup agent provides a Throttling tab which allows you to control how network bandwidth is used during data transfer. This control can be helpful if you need to back up data during work hours but do not want the backup process to interfere with other internet traffic. Throttling of data transfer applies to back up and restore activities.  

To enable throttling:

1. In the **Backup agent**, click **Change Properties**.
2. Select the **Enable internet bandwidth usage throttling for backup operations** checkbox.

    ![Network throttling](./media/backup-azure-manage-windows-server-classic/throttling-dialog.png)
3. Once you have enabled throttling, specify the allowed bandwidth for backup data transfer during **Work hours** and **Non-work hours**.

    The bandwidth values begin at 512 kilobytes per second (Kbps) and can go up to 1023 megabytes per second (Mbps). You can also designate the start and finish for **Work hours**, and which days of the week are considered Work days. The time outside of the designated Work hours is considered to be non-work hours.
4. Click **OK**.

## Exclusion settings
1. Open the **Microsoft Azure Backup agent** (you can find it by searching your machine for *Microsoft Azure Backup*).

    ![Open backup agent](./media/backup-azure-manage-windows-server-classic/snap-in-search.png)
2. In the Microsoft Azure Backup agent click **Schedule Backup**.

    ![Schedule a Windows Server Backup](./media/backup-azure-manage-windows-server-classic/schedule-backup.png)
3. In the Schedule Backup Wizard leave the **Make changes to backup items or times** option selected and click **Next**.

    ![Modify a schedule](./media/backup-azure-manage-windows-server-classic/modify-or-stop-a-scheduled-backup.png)
4. Click **Exclusions Settings**.

    ![Select items to exclude](./media/backup-azure-manage-windows-server-classic/exclusion-settings.png)
5. Click **Add Exclusion**.

    ![Add exclusions](./media/backup-azure-manage-windows-server-classic/add-exclusion.png)
6. Select the location and then, click **OK**.

    ![Select a location for exclusion](./media/backup-azure-manage-windows-server-classic/exclusion-location.png)
7. Add the file extension in the **File Type** field.

    ![Exclude by file type](./media/backup-azure-manage-windows-server-classic/exclude-file-type.png)

    Adding an .mp3 extension

    ![File type example](./media/backup-azure-manage-windows-server-classic/exclude-mp3.png)

    To add another extension, click **Add Exclusion** and enter another file type extension (adding a .jpeg extension).

    ![Another file type example](./media/backup-azure-manage-windows-server-classic/exclude-jpg.png)
8. When you've added all the extensions, click **OK**.
9. Continue through the Schedule Backup Wizard by clicking **Next** until the **Confirmation page**, then click **Finish**.

    ![Exclusion confirmation](./media/backup-azure-manage-windows-server-classic/finish-exclusions.png)

## Next steps
* [Restore Windows Server or Windows Client from Azure](backup-azure-restore-windows-server.md)
* To learn more about Azure Backup, see [Azure Backup Overview](backup-introduction-to-azure-backup.md)
* Visit the [Azure Backup Forum](http://go.microsoft.com/fwlink/p/?LinkId=290933)
