<properties
	pageTitle="Manage Azure Backup vaults and servers | Microsoft Azure"
	description="Use this tutorial to learn how to manage Azure Backup vaults and servers."
	services="backup"
	documentationCenter=""
	authors="Jim-Parker"
	manager="jwhit"
	editor="tysonn"/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/01/2016"
	ms.author="jimpark;markgal"/>


# Manage Azure Backup vaults and servers
In this article you'll find an overview of the backup management tasks available through the management portal and the Microsoft Azure Backup agent.

>[AZURE.NOTE] This article provides the procedures for working in the classic deployment model.

## Management portal tasks
1. Sign in to the [Management Portal](https://manage.windowsazure.com).

2. Click **Recovery Services**, then click the name of backup vault to view the Quick Start page.

    ![Manage Azure Backup tabs](./media/backup-azure-manage-windows-server/rs-left-nav.png)

By selecting the options at the top of the Quick Start page, you can see the available management tasks.

![Manage Azure Backup tabs](./media/backup-azure-manage-windows-server/qs-page.png)

### Dashboard
Select **Dashboard** to see the usage overview for the server. The **usage overview** includes:

- The number of Windows Servers registered to cloud
- The number of Azure virtual machines protected in cloud
- The total storage consumed in Azure
- The status of recent jobs

At the bottom of the Dashboard you can perform the following tasks:

- **Manage certificate** - If a certificate was used to register the server, then use this to update the certificate. If you are using vault credentials, do not use **Manage certificate**.
- **Delete** - Deletes the current backup vault. If a backup vault is no longer being used, you can delete it to free up storage space. **Delete** is only enabled after all registered servers have been deleted from the vault.

![Backup dashboard tasks](./media/backup-azure-manage-windows-server/dashboard-tasks.png)

## Registered items
Select **Registered Items** to view the names of the servers that are registered to this vault.

![Registered items](./media/backup-azure-manage-windows-server/registered-items.png)

The **Type** filter defaults to Azure Virtual Machine. To view the names of the servers that are registered to this vault, select **Windows server** from the drop down menu.

From here you can perform the following tasks:

- **Allow Re-registration** - When this option is selected for a server you can use the **Registration Wizard** in the on-premises Microsoft Azure Backup agent to register the server with the backup vault a second time. You might need to re-register due to an error in the certificate or if a server had to be rebuilt.
- **Delete** - Deletes a server from the backup vault. All of the stored data associated with the server is deleted immediately.

    ![Registered items](./media/backup-azure-manage-windows-server/registered-items-tasks.png)

## Protected items
Select **Protected Items** to view the items that have been backed up from the servers.

![Protected items](./media/backup-azure-manage-windows-server/protected-items.png)

## Configure

From the **Configure** tab you can select the appropriate storage redundancy option. The best time to select the storage redundancy option is right after creating a vault and before any machines are registered to it.

>[AZURE.WARNING] Once an item has been registered to the vault, the storage redundancy option is locked and cannot be modified.

![Configure](./media/backup-azure-manage-windows-server/configure.png)

See this article for more information about [storage redundancy](../storage/storage-redundancy.md).

## Microsoft Azure Backup agent tasks

### Console

Open the **Microsoft Azure Backup agent** (you can find it by searching your machine for *Microsoft Azure Backup*).

![Schedule a Windows Server Backup](./media/backup-azure-manage-windows-server/snap-in-search.png)

From the **Actions** available at the right of the backup agent console you can perform the following management tasks:

- Register Server
- Schedule Backup
- Back Up now
- Change Properties

![Microsoft Azure Backup agent console actions](./media/backup-azure-manage-windows-server/console-actions.png)

>[AZURE.NOTE] To **Recover Data**, see [Restore files to a Windows server or Windows client machine](backup-azure-restore-windows-server.md).

### Modify an existing backup

1. In the Microsoft Azure Backup agent click **Schedule Backup**.

    ![Schedule a Windows Server Backup](./media/backup-azure-manage-windows-server/schedule-backup.png)

2. In the **Schedule Backup Wizard** leave the **Make changes to backup items or times** option selected and click **Next**.

    ![Schedule a Windows Server Backup](./media/backup-azure-manage-windows-server/modify-or-stop-a-scheduled-backup.png)

3. If you want to add or change items, on the **Select Items to Backup** screen click **Add Items**.

    You can also set **Exclusion Settings** from this page in the wizard. If you want to exclude files or file types read the procedure for adding [exclusion settings](#exclusion-settings).

4. Select the files and folders you want to back up and click **Okay**.

    ![Schedule a Windows Server Backup](./media/backup-azure-manage-windows-server/add-items-modify.png)

5. Specify the **backup schedule** and click **Next**.

    You can schedule daily (at a maximum of 3 times per day) or weekly backups.

    ![Items for Windows Server Backup](./media/backup-azure-manage-windows-server/specify-backup-schedule-modify-close.png)

    >[AZURE.NOTE] Specifying the backup schedule is explained in detail in this [article](backup-azure-backup-cloud-as-tape.md).

6. Select the **Retention Policy** for the backup copy and click **Next**.

    ![Items for Windows Server Backup](./media/backup-azure-manage-windows-server/select-retention-policy-modify.png)

7. On the **Confirmation** screen review the information and click **Finish**.

8. Once the wizard finishes creating the **backup schedule**, click **Close**.

    After modifying protection, you can confirm that backups are triggering correctly by going to the **Jobs** tab and confirming that changes are reflected in the backup jobs.

### Enable Network Throttling  
The Azure Backup agent provides a Throttling tab which allows you to control how network bandwidth is used during data transfer. This control can be helpful if you need to back up data during work hours but do not want the backup process to interfere with other internet traffic. Throttling of data transfer applies to back up and restore activities.  

To enable throttling:

1. In the **Backup agent**, click **Change Properties**.

2. Select the **Enable internet bandwidth usage throttling for backup operations** checkbox.

    ![Network throttling](./media/backup-azure-manage-windows-server/throttling-dialog.png)

3. Once you have enabled throttling, specify the allowed bandwidth for backup data transfer during **Work hours** and **Non-work hours**.

    The bandwidth values begin at 512 kilobytes per second (Kbps) and can go up to 1023 megabytes per second (Mbps). You can also designate the start and finish for **Work hours**, and which days of the week are considered Work days. The time outside of the designated Work hours is considered to be non-work hours.

4. Click **OK**.

## Exclusion settings

1. Open the **Microsoft Azure Backup agent** (you can find it by searching your machine for *Microsoft Azure Backup*).

    ![Schedule a Windows Server Backup](./media/backup-azure-manage-windows-server/snap-in-search.png)

2. In the Microsoft Azure Backup agent click **Schedule Backup**.

    ![Schedule a Windows Server Backup](./media/backup-azure-manage-windows-server/schedule-backup.png)

3. In the Schedule Backup Wizard leave the **Make changes to backup items or times** option selected and click **Next**.

    ![Schedule a Windows Server Backup](./media/backup-azure-manage-windows-server/modify-or-stop-a-scheduled-backup.png)

4. Click **Exclusions Settings**.

    ![Schedule a Windows Server Backup](./media/backup-azure-manage-windows-server/exclusion-settings.png)

5. Click **Add Exclusion**.

    ![Schedule a Windows Server Backup](./media/backup-azure-manage-windows-server/add-exclusion.png)

6. Select the location and then, click **OK**.

    ![Schedule a Windows Server Backup](./media/backup-azure-manage-windows-server/exclusion-location.png)

7. Add the file extension in the **File Type** field.

    ![Schedule a Windows Server Backup](./media/backup-azure-manage-windows-server/exclude-file-type.png)

    Adding an .mp3 extension

    ![Schedule a Windows Server Backup](./media/backup-azure-manage-windows-server/exclude-mp3.png)

    To add another extension, click **Add Exclusion** and enter another file type extension (adding a .jpeg extension).

    ![Schedule a Windows Server Backup](./media/backup-azure-manage-windows-server/exclude-jpg.png)

8. When you've added all the extensions, click **OK**.

9. Continue through the Schedule Backup Wizard by clicking **Next** until the **Confirmation page**, then click **Finish**.

    ![Schedule a Windows Server Backup](./media/backup-azure-manage-windows-server/finish-exclusions.png)

## Next steps
- [Restore Windows Server or Windows Client from Azure](backup-azure-restore-windows-server.md)
- To learn more about Azure Backup, see [Azure Backup Overview](backup-introduction-to-azure-backup.md)
- Visit the [Azure Backup Forum](http://go.microsoft.com/fwlink/p/?LinkId=290933)
