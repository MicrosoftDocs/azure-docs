---
title: Back up SQL Server databases to Azure | Microsoft Docs
description: This tutorial explains how to back up SQL Server to Azure. The article also explains SQL Server recovery.
services: backup
author: rayne-wiselman
manager: carmonm
ms.service: backup
ms.topic: tutorial
ms.date: 02/19/2018
ms.author: raynew


---
# Back up SQL Server databases on Azure VMs 

SQL Server databases are critical workloads that require a low recovery point objective (RPO) and long-term retention. You can backup SQL Server databases running on Azure VM using [Azure Backup](backup-overview.md). 

This article shows you how to back up a SQL Server database running on an Azure VM to an Azure Backup Recovery Services vault. In this article, you learn how to:

> [!div class="checklist"]
> * Verify the prerequisites for backing up a SQL Server instance.
> * Create and configure a vault.
> * Discover databases, and set up backups.
> * Set up auto-protection for databases.

> [!NOTE]
> This feature is currently in public preview.

## Before you start

Before you start, verify the following:

1. Make sure you have a SQL Server instance running in Azure. You can [quickly create a SQL Server instance](../sql-database/sql-database-get-started-portal.md) in the marketplace.
2. Review the public preview limitations below.
3. Review the support for this scenario.
4. [Review common questions](faq-backup-sql-server.md) about this scenario.


## Preview limitations

This public preview has a number of limitations.

- The VM running SQL Server requires internet connectivity to access Azure public IP addresses. 
- You can back up up to 2000 SQL Server databases in a vault. If you have more, create another vault. 
- Backups of [distributed availability groups](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/distributed-availability-groups?view=sql-server-2017) don't fully work.
- SQL Server Always On Failover Cluster Instances (FCIs) aren't supported for backup.
- SQL Server backup should be configured in the portal. You can't currently configure backup with Azure PowerShell, CLI, or the REST APIs.
- Backup and restore operations for FCI mirror databases, database snapshots and databases aren't supported.
- Databases with large number of files can't be protected. The maximum number of files supported isn't deterministic. It not only depends on the number of files, but also depends on the path length of the files. 

Please refer to [FAQ section](https://docs.microsoft.com/azure/backup/backup-azure-sql-database#faq) for more details on support/not supported scenarios.

## Scenario support

**Support** | **Details**
--- | ---
**Supported deployments** | SQL Marketplace Azure VMs and non-Marketplace (SQL Server manuallly installed) VMs are supported.
**Supported geos** | Australia South East (ASE); Brazil South (BRS); Canada Central (CNC); Canada East (CE); Central US (CUS); East Asia (EA); East Australia (AE); East US (EUS); East US 2 (EUS2); India Central (INC); India South (INS); Japan East (JPE); Japan West (JPW); Korea Central (KRC); Korea South (KRS); North Central US (NCUS); North Europe (NE); South Central US (SCUS); South East Asia (SEA); UK South (UKS); UK West (UKW); West Central US (WCUS); West Europe (WE); West US (WUS); West US 2 (WUS 2)
**Supported operating systems** | Windows Server 2016, Windows Server 2012 R2, Windows Server 2012<br/><br/> Linux isn't currently supported.
**Supported SQL Server versions** | SQL Server 2017; SQL Server 2016, SQL Server 2014, SQL Server 2012.<br/><br/> Enterprise, Standard, Web, Developer, Express.


## Prerequisites

Before you back up your SQL Server database, check the following conditions:

1. Identify or [create](backup-azure-sql-database.md#create-a-recovery-services-vault) a Recovery Services vault in the same region or locale as the VM hosting the SQL Server instance.V
2. [Check the VM permissions](backup-azure-sql-database.md#set-permissions-for-non-marketplace-sql-vms) needed to back up the SQL databases.
3. Verify that the  VM has [network connectivity](backup-azure-sql-database.md#establish-network-connectivity).
4. Check that the SQL Server databases are named in accordance with [naming guidelines](backup-azure-sql-database.md#sql-database-naming-guidelines-for-azure-backup) for Azure Backup.
5. Verify that you don't have any other backup solutions enabled for the database. Disable all other SQL Server backups before you set up this scenario. You can enable Azure Backup for an Azure VM along with Azure Backup for a SQL Server database running on the VM without any conflict.


### Establish network connectivity

For all operations, the SQL Server VM virtual machine needs connectivity to Azure public IP addresses. VM operations (database discovery, configure backups, schedule backups, restore recovery points etc) fail without connectivity to the public IP addresses. Establish connectivity with one of these options:

- **Allow the Azure datacenter IP ranges**: Allow the [IP ranges](https://www.microsoft.com/download/details.aspx?id=41653) in the download. For access in an network security group (NSG), use the **Set-AzureNetworkSecurityRule** cmdlet.
- **Deploy an HTTP proxy server to route traffic**: When you back up a SQL Server database on an Azure VM, the backup extension on the VM uses the HTTPS APIs to send management commands to Azure Backup, and data to Azure Storage. The backup extension also uses Azure Active Directory (Azure AD) for authentication. Route the backup extension traffic for these three services through the HTTP proxy. The extension's the only component that's configured for access to the public internet.

Each options has advantages and disadvantages

**Option** | **Advantages** | **Disadvantages**
--- | --- | ---
Allow IP ranges | No additional costs. | Complex to manage because the IP address ranges change over time. <br/><br/> Provides access to the whole of Azure, not just Azure Storage.
Use an HTTP proxy   | Granular control in the proxy over the storage URLs is allowed. <br/><br/> Single point of internet access to VMs. <br/><br/> Not subject to Azure IP address changes. | Additional costs to run a VM with the proxy software. 

### Set VM permissions

Azure Backup does a number of things when you configure backup for a SQL Server database:

- Adds the **AzureBackupWindowsWorkload** extension.
- To discover databases on the virtual machine, Azure Backup creates the account **NT SERVICE\AzureWLBackupPluginSvc**. This account is used for backup and restore, and requires SQL sysadmin permissions.
- Azure Backup leverages the **NT AUTHORITY\SYSTEM** account for database discovery/inquiry, so this account need to be a public login on SQL.

If you didn't create the SQL Server VM from the Azure Marketplace, you might receive an error **UserErrorSQLNoSysadminMembership**. If this occurs follow the instructions in this article to fix it.

### Verify database naming guidelines for Azure Backup

Avoid the following for database names:

  * Trailing/Leading spaces
  * Trailing ‘!’
  * Close square bracket ‘]’

We do have aliasing for Azure table unsupported characters, but we recommend avoiding them. [Learn more](https://docs.microsoft.com/rest/api/storageservices/Understanding-the-Table-Service-Data-Model?redirectedfrom=MSDN).

[!INCLUDE [How to create a Recovery Services vault](../../includes/backup-create-rs-vault.md)]

## Discover SQL Server databases

Discover databases running on the VM. 
1. In the [Azure portal](https://portal.azure.com), open the Recovery Services vault you use to back up the database.

2. On the **Recovery Services vault** dashboard, select **Backup**. 

   ![Select Backup to open the Backup Goal menu](./media/backup-azure-sql-database/open-backup-menu.png)

3. In **Backup Goal**, set **Where is your workload running** to **Azure** (the default).

4. In **What do you want to backup**, select **SQL Server in Azure VM**.

    ![Select SQL Server in Azure VM for the backup](./media/backup-azure-sql-database/choose-sql-database-backup-goal.png)


5. In **Backup Goal** > **Discover DBs in VMs**, select **Start Discovery** to search for unprotected VMs in the subscription. It can take a while, depending on the number of unprotected virtual machines in the subscription.

    ![Backup is pending during search for DBs in VMs](./media/backup-azure-sql-database/discovering-sql-databases.png)

6. In the VM list, select the VM running the SQL Server database > **Discover DBs**.

7. Track database discovery in the **Notifications** area. It can take a while for the job to complete, depending on how many databases are on the VM. When the selected databases are discovered, a success message appears.

    ![Deployment success message](./media/backup-azure-sql-database/notifications-db-discovered.png)

    - Unprotected VMs should appear in the list after discovery, listed by name and resource group.
    - If a VM isn't listed as you expect, check whether it's already backed up in a vault.
    - Multiple VMs can have the same name but they'll belong to different resource groups. 

9. Select the VM running the SQL Server database > **Discover DBs**. 
10. Azure Backup discovers all SQL Server databases on the VM. During discovery the following occurs in the background:

    - Azure Backup register the VM with the vault for workload backup. All databases on the registered VM can only be backed up to this vault.
    - Azure Backup installs the **AzureBackupWindowsWorkload** extension on the VM. No agent is installed on the SQL database.
    - Azure Backup creates the service account **NT Service\AzureWLBackupPluginSvc** on the VM.
        - All backup and restore operations use the service account.
        - **NT Service\AzureWLBackupPluginSvc** needs SQL sysadmin permissions. All SQL Server VMs created in the Azure MArkplace come with the **SqlIaaSExtension** installed. The **AzureBackupWindowsWorkload** extension uses the **SQLIaaSExtension** to automatically get the required permissions.
    - If you didn't create the VM from the marketplace, then the VM doesn't have the **SqlIaaSExtension** installed, and the discovery operation fails with the error message **UserErrorSQLNoSysAdminMembership**. Follow the instructions in [#fix-sql-sysadmin-permissions] to fix this issue.

        ![Select the VM and database](./media/backup-azure-sql-database/registration-errors.png)



## Configure a backup policy 

To optimize backup loads, Azure Backup sets a maximum number of databases in one backup job to 50.

    - To protect more than 50 databases, configure multiplel backups.
    - Alternatily, you can enable auto-protection. Auto-protection protects existing databases in one go, and automatically protects new databases added to the instance of availability group.


Configure backup as follows:

1. On the vault dashboard, select **Backup**. 

   ![Select Backup to open the Backup Goal menu](./media/backup-azure-sql-database/open-backup-menu.png)

3. In **Backup Goal** menu, set **Where is your workload running** to **Azure**.

4. In **What do you want to back up**, select **SQL Server in Azure VM**.

    ![Select SQL Server in Azure VM for the backup](./media/backup-azure-sql-database/choose-sql-database-backup-goal.png)

    
5. In **Backup Goal** menu, select **Configure Backup**.

    ![Select Configure Backup](./media/backup-azure-sql-database/backup-goal-configure-backup.png)


      ![Displaying all SQL Server instances with standalone databases](./media/backup-azure-sql-database/list-of-sql-databases.png)

6. Select all the databases you want to protect > **OK**.

    ![Protecting the database](./media/backup-azure-sql-database/select-database-to-protect.png)

    - All SQL Server instances are shown (standalone and availability groups).
    - Select the down arrow on the left of the instance name/availability group to filter.

7. On the **Backup** menu, select **Backup policy**. 

    ![Select Backup policy](./media/backup-azure-sql-database/select-backup-policy.png)

8. In **Choose backup policy**, select a policy, then click **OK**.

    - Select the default policy: **HourlyLogBackup**.
    - Choose an existing backup policy previously created for SQL.
    - [Define a new policy](backup-azure-sql-database.md#define-a-backup-policy) based on your RPO and retention range.
    - During Preview, you can't edit an existing Backup policy.
    
9. On **Backup menu**, select **Enable backup**.

    ![Enable the chosen backup policy](./media/backup-azure-sql-database/enable-backup-button.png)

10. Track the configuration progress in the **Notifications** area of the portal.

    ![Notification area](./media/backup-azure-sql-database/notifications-area.png)

### Create a backup policy

A backup policy defines when backups are taken and how long they're retained. 

- A policy is created at the vault level.
- Multiple vaults can use the same backup policy, but you must apply the backup policy to each vault.
- When you create a backup policy, a daily full backup is the default.
- You can add a differential backup, but only if you configure full backups to occur weekly.
- [Learn about](backup-architecture.md#sql-server-backup-types) different types of backup policies.


To create a backup policy:

1. In the vault, click **Backup policies** > **Add**.
2. In **Add** menu, click **SQL Server in Azure VM**. This defines the policy type.

   ![Choose a policy type for the new backup policy](./media/backup-azure-sql-database/policy-type-details.png)

3. In **Policy name**, enter a name for the new policy. 
4. In **Full Backup policy**, select a **Backup Frequency**, choose **Daily** or **Weekly**.

    - For **Daily**, select the hour and time zone when the backup job begins.
    - You must run a full backup, you can't turn off the **Full Backup** option.
    - Click **Full Backup** to view the policy. 
    - You can't create differential backups for daily full backups.
    - For **Weekly**, select the day of the week, hour, and time zone when the backup job begins.

    ![New backup policy fields](./media/backup-azure-sql-database/full-backup-policy.png)  

5. For **Retention Range**, by default all options are selected. Clear any undesired retention range limits you don't want to use, and set the intervals to use. 

    - Recovery points are tagged for retention based on their retention range. For example, if you select a daily full backup, only one full backup is triggered each day.
    - The backup for a specific day is tagged and retained based on the weekly retention range and your weekly retention setting.
    - The monthly and yearly retention ranges behave in a similar way.

   ![Retention range interval settings](./media/backup-azure-sql-database/retention-range-interval.png)

    

6. In the **Full Backup policy** menu, select **OK** to accept the settings.
7. To add a differential backup policy, select **Differential Backup**. 

   ![Open the differential backup policy menu](./media/backup-azure-sql-database/backup-policy-menu-choices.png)

8. In **Differential Backup policy**, select **Enable** to open the frequency and retention controls. 

    - At most, you can trigger one differential backup per day.
    - Differential backups can be retained for a maximum of 180 days. If you need longer retention, you must use full backups.
   

   ![Edit the differential backup policy](./media/backup-azure-sql-database/enable-differential-backup-policy.png)

9. Select **OK** to save the policy and return to the main **Backup policy** menu.

10. To add a transactional log backup policy, select **Log Backup**. 
11. In **Log Backup**, select **Enable**, and then set the frequency and retention controls. Log backups can occur as often as every 15 minutes, and can be retained for up to 35 days.
12. Select **OK** to save the policy and return to the main **Backup policy** menu.

   ![Edit the log backup policy](./media/backup-azure-sql-database/log-backup-policy-editor.png)

8. On the **Backup policy** menu, choose whether to enable **SQL Backup Compression**.
    - Compression is disabled by default.
    - On the back end, Azure Backup uses SQL native backup compression.

9. After you complete the edits to the backup policy, select **OK**.



## Enable auto-protection  

Enable auto-protection to automatically back up all existing databases, and databases that are added in the future to a standalone SQL Server instance or a SQL Server Always On Availability group. 

- When you turn on auto-protection and select a policy, the pexisting protected databases will continue to use previous policy.
- There's no limit on the number of databases you can select for auto-protection in one go.

Enable auto-protection as follows:

1. In **Items to backup**, select the instance for which you want to enable auto-protection.
2. Select the dropdown under **Autoprotect**, and set to **On**. Then click **OK**.

    ![Enable auto-protection on the Always On availability group](./media/backup-azure-sql-database/enable-auto-protection.png)

 3. Backup is configured for all the databases together and can be tracked in **Backup Jobs**.


If you need to disable auto-protection, click the instance name under **Configure Backup**, and select **Disable Autoprotect** for the instance. All databases will continue to back up. But future databases won't be automatically protected.

![Disable auto protection on that instance](./media/backup-azure-sql-database/disable-auto-protection.png)


## Restore a SQL database
Azure Backup provides functionality to restore individual databases to a specific date or time (to the second) by using transaction log backups. Azure Backup automatically determines the appropriate full differential and the chain of log backups that are required to restore your data based on your restore times.

You can also select a specific full or differential backup to restore to a specific recovery point, rather than a specific time.

### Pre-requisite before triggering a restore

1. You can restore the database to an instance of a SQL Server in the same Azure region. The destination server must be registered to the same Recovery Services vault as the source.  
2. To restore a TDE encrypted database to another SQL Server, please first restore the certificate to the destination server by following steps documented [here](https://docs.microsoft.com/sql/relational-databases/security/encryption/move-a-tde-protected-database-to-another-sql-server?view=sql-server-2017).
3. Before you trigger a restore of the "master" database, start the SQL Server instance in single-user mode with startup option `-m AzureWorkloadBackup`. The argument to the `-m` option is the name of the client. Only this client is allowed to open the connection. For all system databases (model, master, msdb), stop the SQL Agent service before you trigger the restore. Close any applications that might try to steal a connection to any of these databases.

### Steps to restore a database:

1. Open the Recovery Services vault that's registered with the SQL virtual machine.

2. On the **Recovery Services vault** dashboard, under **Usage**, select **Backup Items** to open the **Backup Items** menu.

    ![Open the Backup Items menu](./media/backup-azure-sql-database/restore-sql-vault-dashboard.png).

3. On the **Backup Items** menu, under **Backup Management Type**, select **SQL in Azure VM**.

    ![Select SQL in Azure VM](./media/backup-azure-sql-database/sql-restore-backup-items.png)

    The **Backup Items** menu shows the list of SQL databases.

4. In the list of SQL databases, select the database to restore.

    ![Select the database to restore](./media/backup-azure-sql-database/sql-restore-sql-in-vm.png)

    When you select the database, its menu opens. The menu provides the backup details for the database, including:

    * The oldest and latest restore points.
    * Log backup status for the last 24 hours (for databases in full and bulk-logged recovery model, if configured for transactional log backups).

5. On the menu for the selected database, select **Restore DB**. The **Restore** menu opens.

    ![Select Restore DB](./media/backup-azure-sql-database/restore-db-button.png)

    When the **Restore** menu opens, the **Restore Configuration** menu also opens. The **Restore Configuration** menu is the first step to configure the restoration. Use this menu to select where to restore the data. The options are:
    - **Alternate Location**: Restore the database to an alternate location and retain the original source database.
    - **Overwrite DB**: Restore the data to the same SQL Server instance as the original source. The effect of this option is to overwrite the original database.

    > [!Important]
    > If the selected database belongs to an Always On Availability group, SQL Server doesn't allow the database to be overwritten. In this case, only the **Alternate Location** option is enabled.
    >

    ![Restore Configuration menu](./media/backup-azure-sql-database/restore-restore-configuration-menu.png)

### Restore to an alternate location

This procedure walks you through restoring data to an alternate location. To overwrite the database during the restore, continue to [Restore and overwrite the database](backup-azure-sql-database.md#restore-and-overwrite-the-database). At this stage, your Recovery Services vault is open and the **Restore Configuration** menu is visible. If you're not at this stage, start by [restoring a SQL database](backup-azure-sql-database.md#restore-a-sql-database).

> [!NOTE]
> You can restore the database to an instance of a SQL Server in the same Azure region. The destination server needs to be registered to the Recovery Services vault.
>

On the **Restore Configuration** menu, the **Server** drop-down list box shows only the SQL Server instances that are registered with the Recovery Services vault. If the server that you want isn't in the list, see [Discover SQL Server databases](backup-azure-sql-database.md#discover-sql-server-databases) to find the server. During the discovery process, new servers are registered to the Recovery Services vault.<br>
In order to restore a SQL DB, you would need the following permissions:

* **Backup Operator** permissions on Recovery Services **Vault** in which you are doing the restore.
* **Contributor(write)** access to the **source SQL VM** (the VM that is backed up and you are trying to restore from).
* **Contributor (write)** access to the target SQL VM (the VM that you are restoring to; will be the same VM as the source VM in case of Original Location Recovery(OLR)).

To restore to an alternate location:

1. In the **Restore Configuration** menu:

    * Under **Where to Restore**, select **Alternate Location**.
    * Open the **Server** drop-down list box and choose the SQL Server instance to restore the database.
    * Open the **Instance** drop-down list box and choose a SQL Server instance.
    * In the **Restored DB Name** box, enter the name of the target database.
    * As applicable, select **Overwrite if the DB with the same name already exists on selected SQL instance**.
    * Select **OK** to complete the configuration of the destination and continue to choose a restore point.

    ![Provide values for the Restore Configuration menu](./media/backup-azure-sql-database/restore-configuration-menu.png)

2. On the **Select restore point** menu, choose **Logs (Point in Time)** or **Full & Differential** as the restore point. To restore to a specific point-in-time log, continue with this step. To restore a full and differential restore point, continue to step 3.

    ![Select restore point menu](./media/backup-azure-sql-database/recovery-point-menu.png)

    The point-in-time restore is available only for log backups for databases with a full and bulk-logged recovery model. To restore to a specific point in time:

    1. Select **Logs (Point in Time)** as the restore type.

        ![Choose the restore point type](./media/backup-azure-sql-database/recovery-point-logs.png)

    2. Under **Restore Date/Time**, select the mini calendar to open the **Calendar**. On the **Calendar**, the bold dates have recovery points and the current date is highlighted. Select a date with recovery points. Dates without recovery points can't be selected.

        ![Open the Calendar](./media/backup-azure-sql-database/recovery-point-logs-calendar.png)

        After you select a date, the timeline graph displays the available recovery points in a continuous range.

    3. Use the timeline graph or the **Time** dialog box to specify a specific time for the recovery point. Select **OK** to complete the restore point step.

       ![Open the Calendar](./media/backup-azure-sql-database/recovery-point-logs-graph.png)

        The **Select restore point** menu closes, and the **Advanced Configuration** menu opens.

       ![Advanced configuration menu](./media/backup-azure-sql-database/restore-point-advanced-configuration.png)

    4. On the **Advanced Configuration** menu:

        * To keep the database non-operational after the restore, set **Restore with NORECOVERY** to **Enabled**.
        * To change the restore location on the destination server, enter a new path in the **Target** column.
        * Select **OK** to approve the settings. Close the **Advanced Configuration** menu.

    5. On the **Restore** menu, select **Restore** to start the restore job. Track the progress of the restore in the **Notifications** area or select **Restore jobs** on the database menu.

       ![Restore job progress](./media/backup-azure-sql-database/restore-job-notification.png)

3. On the **Select restore point** menu, choose **Logs (Point in Time)** or **Full & Differential** as the restore point. To restore a point-in-time log, go back to step 2. This step restores a specific full or differential restore point. You can see all of the full and differential recovery points for the last 30 days. To see recovery points older than 30 days, select **Filter** to open the **Filter restore points** menu. For a differential recovery point, Azure Backup first restores the appropriate full recovery point, and then applies the selected differential recovery point.

    ![Select restore point menu](./media/backup-azure-sql-database/recovery-point-menu.png)

    1. In the **Select restore point** menu, select **Full & Differential**.

       ![Select full and differential](./media/backup-azure-sql-database/recovery-point-logs-fd.png)

        The menu shows the list of available recovery points.

    2. Select a recovery point from the list, and select **OK** to complete the restore point procedure.

        ![Choose a full recovery point](./media/backup-azure-sql-database/choose-fd-recovery-point.png)

        The **Restore Point** menu closes, and the **Advanced Configuration** menu opens.

        ![Advanced Configuration menu](./media/backup-azure-sql-database/restore-point-advanced-configuration.png)

    3. On the **Advanced Configuration** menu:

        * To keep the database non-operational after the restore, set **Restore with NORECOVERY** to **Enabled**. **Restore with NORECOVERY** is disabled by default.
        * To change the restore location on the destination server, enter a new path in the **Target** column.
        * Select **OK** to approve the settings. Close the **Advanced Configuration** menu.

    4. On the **Restore** menu, select **Restore** to start the restore job. Track the progress of the restore in the **Notifications** area or select **Restore jobs** on the database menu.

       ![Restore job progress](./media/backup-azure-sql-database/restore-job-notification.png)

### Restore and overwrite the database

This procedure walks you through restoring data and overwriting a database. To restore to an alternate location, continue to [Restore to an alternate location](backup-azure-sql-database.md#restore-to-an-alternate-location). At this stage, your Recovery Services vault is open and the **Restore Configuration** menu is visible (see the following image). If you're not at this stage, start by [restoring a SQL database](backup-azure-sql-database.md#restore-a-sql-database).

![Restore Configuration menu](./media/backup-azure-sql-database/restore-overwrite-db.png)

On the **Restore Configuration** menu, the **Server** drop-down list box shows only the SQL Server instances that are registered with the Recovery Services vault. If the server that you want isn't in the list, see [Discover SQL Server databases](backup-azure-sql-database.md#discover-sql-server-databases) to find the server. During the discovery process, new servers are registered to the Recovery Services vault.

1. In the **Restore Configuration** menu, select **Overwrite DB**, and then select **OK** to complete the configuration of the destination.

   ![Select Overwrite DB](./media/backup-azure-sql-database/restore-configuration-overwrite-db.png)

    The **Server**, **Instance**, and **Restored DB Name** settings aren't necessary.

2. On the **Select restore point** menu, choose **Logs (Point in Time)** or **Full & Differential** as the restore point. To restore to a specific point-in-time log, continue with this step. To restore a full and differential restore point, continue to step 3.

    ![select restore point menu](./media/backup-azure-sql-database/recovery-point-menu.png)

    The point-in-time restore is available only for log backups for databases with a full and bulk-logged recovery model. To restore to a specific second:

    1. Select **Logs (Point in Time)** as the restore point.

        ![Choose the restore point type](./media/backup-azure-sql-database/recovery-point-logs.png)

    2. Under **Restore Date/Time**, select the mini calendar to open the **Calendar**. On the **Calendar**, the bold dates have recovery points and the current date is highlighted. Select a date with recovery points. Dates without recovery points can't be selected.

        ![Open the Calendar](./media/backup-azure-sql-database/recovery-point-logs-calendar.png)

        After you select a date, the timeline graph displays the available recovery points.

    3. Use the timeline graph or the **Time** dialog box to specify a specific time for the recovery point. Select **OK** to complete the restore point step.

       ![Open the Calendar](./media/backup-azure-sql-database/recovery-point-logs-graph.png)

        The **Select restore point** menu closes, and the **Advanced Configuration** menu opens.

       ![Advanced configuration menu](./media/backup-azure-sql-database/restore-point-advanced-configuration.png)

    4. On the **Advanced Configuration** menu:

        * To keep the database non-operational after the restore, set **Restore with NORECOVERY** to **Enabled**.
        * To change the restore location on the destination server, enter a new path in the **Target** column.
        * Select **OK** to approve the settings. Close the **Advanced Configuration** menu.

    5. On the **Restore** menu, select **Restore** to start the restore job. Track the progress of the restore in the **Notifications** area or select **Restore jobs** on the database menu.

       ![Restore job progress](./media/backup-azure-sql-database/restore-job-notification.png)

3. On the **Select restore point** menu, choose **Logs (Point in Time)** or **Full & Differential** as the restore point. To restore a point-in-time log, go back to step 2. This step restores a specific full or differential restore point. You can see all of the full and differential recovery points for the last 30 days. To see recovery points older than 30 days, select **Filter** to open the **Filter restore points** menu. For a differential recovery point, Azure Backup first restores the appropriate full recovery point, and then applies the selected differential recovery point.

    ![Select restore point menu](./media/backup-azure-sql-database/recovery-point-menu.png)

    1. In the **Select restore point** menu, select **Full & Differential**.

       ![Select full and differential](./media/backup-azure-sql-database/recovery-point-logs-fd.png)

        The menu shows the list of available recovery points.

    2. Select a recovery point from the list, and select **OK** to complete the restore point procedure.

        ![Choose a full recovery point](./media/backup-azure-sql-database/choose-fd-recovery-point.png)

        The **Restore Point** menu closes, and the **Advanced Configuration** menu opens.

        ![Advanced Configuration menu](./media/backup-azure-sql-database/restore-point-advanced-configuration.png)

    3. On the **Advanced Configuration** menu:

        * To keep the database non-operational after the restore, set **Restore with NORECOVERY** to **Enabled**. **Restore with NORECOVERY** is disabled by default.
        * To change the restore location on the destination server, enter a new path in the **Target** column.
        * Select **OK** to approve the settings. Close the **Advanced Configuration** menu.

    4. On the **Restore** menu, select **Restore** to start the restore job. Track the progress of the restore in the **Notifications** area or by selecting **Restore jobs** on the database menu.

       ![Restore job progress](./media/backup-azure-sql-database/restore-job-notification.png)

## Manage Azure Backup operations for SQL on Azure VMs

This section provides information about the various Azure Backup management operations that are available for SQL on Azure virtual machines. The following high-level operations exist:

* Monitor jobs
* Backup alerts
* Stop protection on a SQL database
* Resume protection for a SQL database
* Trigger an adhoc backup job
* Unregister a server that's running SQL Server

### Monitor backup jobs
Azure Backup is an enterprise class solution that provides advanced backup alerts and notifications for any failures. (See [View backup alerts](backup-azure-sql-database.md#view-backup-alerts).) To monitor specific jobs, use any of the following options according to your requirements.

#### Use the Azure portal for adhoc operations
Azure Backup shows all manually triggered, or adhoc, jobs in the **Backup jobs** portal. The jobs that are available in the **Backup jobs** portal include:
- All configure backup operations.
- Manually triggered backup operations.
- Restore operations.
- Registration and discover database operations.
- Stop backup operations.

![Backup jobs portal](./media/backup-azure-sql-database/jobs-list.png)

> [!NOTE]
> All scheduled backup jobs, including full, differential, and log backup, aren't shown in the **Backup jobs** portal. Use SQL Server Management Studio to monitor scheduled backup jobs, as described in the next section.
>

#### Use SQL Server Management Studio for backup jobs
Azure Backup uses SQL native APIs for all backup operations. Use the native APIs to fetch all job information from the [SQL backupset table](https://docs.microsoft.com/sql/relational-databases/system-tables/backupset-transact-sql?view=sql-server-2017) in the msdb database.

The following example is a query that fetches all backup jobs for a database named **DB1**. Customize the query for advanced monitoring.

```
select CAST (
Case type
                when 'D' 
                                 then 'Full'
                when  'I'
                               then 'Differential' 
                ELSE 'Log'
                END         
                AS varchar ) AS 'BackupType',
database_name, 
server_name,
machine_name,
backup_start_date,
backup_finish_date,
DATEDIFF(SECOND, backup_start_date, backup_finish_date) AS TimeTakenByBackupInSeconds,
backup_size AS BackupSizeInBytes
  from msdb.dbo.backupset where user_name = 'NT SERVICE\AzureWLBackupPluginSvc' AND database_name =  <DB1>  

```

### View backup alerts

Because log backups occur every 15 minutes, occasionally, monitoring backup jobs can be tedious. Azure Backup provides help in this situation. Email alerts are triggered for all backup failures. Alerts are consolidated at the database level by error code. An email alert is sent only for the first backup failure for a database. Sign in to the Azure portal to monitor all failures for a database.

To monitor backup alerts:

1. Sign in to your Azure subscription in the [Azure portal](https://portal.azure.com).

2. Open the Recovery Services vault that's registered with the SQL virtual machine.

3. On the **Recovery Services vault** dashboard, select **Alerts and Events**.

   ![Select Alerts and Events](./media/backup-azure-sql-database/vault-menu-alerts-events.png)

4. On the **Alerts and Events** menu, select **Backup Alerts** to view the list of alerts.

   ![Select Backup Alerts](./media/backup-azure-sql-database/backup-alerts-dashboard.png)

### Stop protection for a SQL Server database

When you stop protection for a SQL Server database, Azure Backup requests whether to retain the recovery points. There are two ways to stop protection for a SQL database:

* Stop all future backup jobs and delete all recovery points.
* Stop all future backup jobs, but leave the recovery points.

If you choose Stop backup with retain data, recovery points will be cleaned up as per the backup policy. You will incur the SQL protected instance pricing charge, plus the storage consumed till all recovery points are cleaned. For more information about Azure Backup pricing for SQL, see the [Azure Backup pricing page](https://azure.microsoft.com/pricing/details/backup/).

Whenever you Stop Backup with retain data, recovery points will expire as per the retention policy but Azure Backup will always keep one last recovery point till you explicitly delete backup data. Similarly if you delete a data source without performing Stop Backup, new backups will start failing and old recovery points will expire as per retention policy but one last recovery point will always be retained till you perform Stop Backup with delete data.

To stop protection for a database:

1. Open the Recovery Services vault that's registered with the SQL virtual machine.

2. On the **Recovery Services vault** dashboard, under **Usage**, select **Backup Items** to open the **Backup Items** menu.

    ![Open the Backup Items menu](./media/backup-azure-sql-database/restore-sql-vault-dashboard.png).

3. On the **Backup Items** menu, under **Backup Management Type**, select **SQL in Azure VM**.

    ![Select SQL in Azure VM](./media/backup-azure-sql-database/sql-restore-backup-items.png)

    The **Backup Items** menu shows the list of SQL databases.

4. In the list of SQL databases, select the database to stop protection.

    ![Select the database to stop protection](./media/backup-azure-sql-database/sql-restore-sql-in-vm.png)

    When you select the database, its menu opens.

5. On the menu for the selected database, select **Stop backup**.

    ![Select Stop backup](./media/backup-azure-sql-database/stop-db-button.png)

    The **Stop Backup** menu opens.

6. On the **Stop Backup** menu, choose to **Retain Backup Data** or **Delete Backup Data**. As an option, provide a reason for stopping the protection and a comment.

    ![Stop Backup menu](./media/backup-azure-sql-database/stop-backup-button.png)

7. Select **Stop backup** to stop protection on the database.

  Please note that **Stop Backup** option will not work for a database in an [auto-protection](backup-azure-sql-database.md#auto-protect-sql-server-in-azure-vm) instance. The only way to stop protecting this database is to disable the [auto-protection](backup-azure-sql-database.md#auto-protect-sql-server-in-azure-vm) on the instance for the time being and then choose the **Stop Backup** option under **Backup Items** for that database.<br>
  After you have disabled auto-protection, you can **Stop Backup** for the database under **Backup Items**. The instance can again be enabled for auto-protection now.


### Resume protection for a SQL database

If the **Retain Backup Data** option was selected when protection for the SQL database was stopped, you can resume protection. If the backup data wasn't retained, protection can't resume.

1. To resume protection for the SQL database, open the backup item and select **Resume backup**.

    ![Select Resume backup to resume database protection](./media/backup-azure-sql-database/resume-backup-button.png)

   The **Backup policy** menu opens.

2. On the **Backup policy** menu, select a policy, and then select **Save**.

### Trigger an adhoc backup

Trigger adhoc backups as needed. There are four types of adhoc backups:

* Full backup
* Copy-only full backup
* Differential backup
* Log backup

For details on each type, see [Types of SQL backups](https://docs.microsoft.com/sql/relational-databases/backup-restore/backup-overview-sql-server?view=sql-server-2017#types-of-backups).

### Unregister a SQL Server instance

To unregister a SQL Server instance after you remove protection, but before you delete the vault:

1. Open the Recovery Services vault that's registered with the SQL virtual machine.

2. On the **Recovery Services vault** dashboard, under  **Manage**, select **Backup Infrastructure**.  

   ![Select Backup Infrastructure](./media/backup-azure-sql-database/backup-infrastructure-button.png)

3. Under **Management Servers**, select **Protected Servers**.

   ![Select Protected Servers](./media/backup-azure-sql-database/protected-servers.png)

    The **Protected Servers** menu opens.

4. On the **Protected Servers** menu, select the server to unregister. To delete the vault, you must unregister all servers.

5. On the **Protected Servers** menu, right-click the protected server, and select **Delete**.

   ![Select Delete](./media/backup-azure-sql-database/delete-protected-server.png)


## Next steps

To learn more about Azure Backup, see the Azure PowerShell sample to back up encrypted virtual machines.

> [!div class="nextstepaction"]
> [Back up an encrypted VM](./scripts/backup-powershell-sample-backup-encrypted-vm.md)

### Fix SQL sysadmin permissions

If you need to fix permissions because of an **UserErrorSQLNoSysadminMembership** error, do the following:

1. Use an account with SQL Server sysadmin permissions to sign in to SQL Server Management Studio (SSMS). Unless you need special permissions, Windows authentication should work.
2. On the SQL Server, open the **Security/Logins** folder.

    ![Open the Security/Logins folder to see accounts](./media/backup-azure-sql-database/security-login-list.png)

3. Right-click the **Logins** folder and select **New Login**. In **Login - New**, select **Search**.

    ![In the Login - New dialog box, select Search](./media/backup-azure-sql-database/new-login-search.png)

3. The Windows virtual service account **NT SERVICE\AzureWLBackupPluginSvc** was created during the virtual machine registration and SQL discovery phase. Enter the account name as shown in **Enter the object name to select**. Select **Check Names** to resolve the name. Click **OK**.

    ![Select Check Names to resolve the unknown service name](./media/backup-azure-sql-database/check-name.png)


4. In **Server Roles**, make sure the **sysadmin** role is selected. Click **OK**. The required permissions should now exist.

    ![Make sure the sysadmin server role is selected](./media/backup-azure-sql-database/sysadmin-server-role.png)

5. Now associate the database with the Recovery Services vault. In the Azure portal, in the **Protected Servers** list, right-click the server that's in an error state > **Rediscover DBs**.

    ![Verify the server has appropriate permissions](./media/backup-azure-sql-database/check-erroneous-server.png)

6. Check progress in the **Notifications** area. When the selected databases are found, a success message appears.

    ![Deployment success message](./media/backup-azure-sql-database/notifications-db-discovered.png)

Alternatively, you can enable [auto-protection](backup-azure-sql-database.md#auto-protect-sql-server-in-azure-vm) on the entire instance or Always On Availability group by selecting the **ON** option in the corresponding dropdown in the **AUTOPROTECT** column. The [auto-protection](backup-azure-sql-database.md#auto-protect-sql-server-in-azure-vm) feature not only enables protection on all the existing databases in one go but also automatically protects any new databases that will be added to that instance or the availability group in future.  

      ![Enable auto-protection on the Always On availability group](./media/backup-azure-sql-database/enable-auto-protection.png)