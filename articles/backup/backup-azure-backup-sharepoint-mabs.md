---
title: Back up a SharePoint farm to Azure with MABS
description: Use Azure Backup Server to back up and restore your SharePoint data. This article provides the information to configure your SharePoint farm so that desired data can be stored in Azure. You can restore protected SharePoint data from disk or from Azure.
ms.topic: how-to
ms.date: 07/22/2024
ms.service: azure-backup
ms.custom: engagement-fy24
author: jyothisuri
ms.author: jsuri
---

# Back up a SharePoint farm to Azure using Microsoft Azure Backup Server

This article describes how to back up SharePoint farm using Microsoft Azure Backup Server (MABS).

Microsoft Azure Backup Server (MABS) enables you to back up a SharePoint farm to Microsoft Azure, which gives an experience similar to back up of other data sources. Azure Backup provides flexibility in the backup schedule to create daily, weekly, monthly, or yearly backup points, and gives you retention policy options for various backup points. It also provides the capability to store local disk copies for quick recovery-time objectives (RTO) and to store copies to Azure for economical, long-term retention.

>[!Note]
>The backup process for SharePoint to Azure using MABS is similar to back up of SharePoint to Data Protection Manager (DPM) locally. Particular considerations for Azure are noted in this article.

## SharePoint supported scenarios

You need to confirm the following supported scenarios before you back up a SharePoint farm to Azure.

### Supported scenarios

For information on the supported SharePoint versions and the MABS versions required to back them up, see [the MABS protection matrix](./backup-mabs-protection-matrix.md).

### Unsupported scenarios

* MABS that protects a SharePoint farm doesn't protect search indexes or application service databases. You need to configure the protection of these databases separately.
* MABS doesn't provide backup of SharePoint SQL Server databases that are hosted on scale-out file server (SOFS) shares.

### Limitations

* You can't protect SharePoint databases as a SQL Server data source. You can recover individual databases from a farm backup.

* Protecting application store items isn't supported with SharePoint 2013.

* MABS doesn't support protecting remote FILESTREAM. The FILESTREAM should be part of the database.

## Prerequisites

Before you continue, ensure that you've met all the [prerequisites for using Microsoft Azure Backup](backup-azure-dpm-introduction.md#prerequisites-and-limitations) to protect workloads. The tasks for prerequisites also include: create a backup vault, download vault credentials, install Azure Backup Agent, and register the Azure Backup Server with the vault.

Additional prerequisites:

* By default when you protect SharePoint, all content databases (and the SharePoint_Config and SharePoint_AdminContent* databases) are protected. If you want to add customizations (such as search indexes, templates or application service databases, or the user profile service) you need to configure these for protection separately. Ensure that you enable protection for all folders that include these types of features or customization files.

* Remember that MABS runs as **Local System**, and it needs *sysadmin* privileges on that account for the SQL server to back up SQL Server databases. On the SQL Server you want to back up, set *NT AUTHORITY\SYSTEM* to **sysadmin**.

* For every 10 million items in the farm, there must be at least 2 GB of space on the volume where the MABS folder is located. This space is required for catalog generation. To enable you to use MABS to perform a specific recovery of items (site collections, sites, lists, document libraries, folders, individual documents, and list items), catalog generation creates a list of the URLs contained within each content database. You can view the list of URLs in the recoverable item blade in the Recovery task area of the MABS Administrator Console.

* In the SharePoint farm, if you've SQL Server databases that are configured with SQL Server aliases, install the SQL Server client components on the front-end Web server that MABS will protect.

## Configure the backup

To back up the SharePoint farm, configure protection for SharePoint by using *ConfigureSharePoint.exe* and then create a protection group in MABS.

Follow these steps:

1. **Run ConfigureSharePoint.exe**: This tool configures the SharePoint VSS Writer service \(WSS\) and provides the protection agent with credentials for the SharePoint farm. After you've deployed the protection agent, the ConfigureSharePoint.exe file can be found in the `<MABS Installation Path\>\bin` folder on the front\-end Web server.
   
   If you've multiple WFE servers, you only need to install it on one of them.

   Run as follows:

   1. On the WFE server, at a command prompt navigate to `\<MABS installation location\>\\bin\\` and run `ConfigureSharePoint \[\-EnableSharePointProtection\] \[\-EnableSPSearchProtection\] \[\-ResolveAllSQLAliases\] \[\-SetTempPath <path>\]`, where:

      1. **EnableSharePointProtection** enables protection of the SharePoint farm, enables the VSS writer, and registers the identity of the DCOM application WssCmdletsWrapper to run as a user whose credentials are entered with this option. This account should be a farm admin and also local admin on the front\-end Web Server.

         * **EnableSPSearchProtection** enables the protection of WSS 3.0 SP Search by using the registry key SharePointSearchEnumerationEnabled under HKLM\\Software\\Microsoft\\ Microsoft Data Protection Manager\\Agent\\2.0\\ on the front\-end Web Server, and registers the identity of the DCOM application WssCmdletsWrapper to run as a user whose credentials are entered with this option. This account should be a farm admin and also local admin on the front\-end Web Server.

         * **ResolveAllSQLAliases** displays all the aliases reported by the SharePoint VSS writer and resolves them to the corresponding SQL server. It also displays their resolved instance names. If the servers are mirrored, it will also display the mirrored server. It reports all the aliases that aren't being resolved to a SQL Server.

         * **SetTempPath** sets the environment variable TEMP and TMP to the specified path. Item level recovery fails if a large site collection, site, list, or item is being recovered and there's insufficient space in the farm admin Temporary folder. This option allows you to change the folder path of the temporary files to a volume that has sufficient space to store the site collection or site being recovered.

   1. Enter the farm administrator credentials. This account should be a member of the local Administrator group on the WFE server. If the farm administrator isn't a local admin, grant the following permissions on the WFE server:

      * Grant the **WSS_Admin_WPG** group full control to the MABS folder (`%Program Files%\Data Protection Manager\DPM\`).

      * Grant the **WSS_Admin_WPG** group read access to the MABS Registry key (`HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Microsoft Data Protection Manager`).

     After running ConfigureSharePoint.exe, you'll need to rerun it if there's a change in the SharePoint farm administrator credentials.

1. To create a protection group, select **Protection** > **Actions** > **Create Protection Group** to open the **Create New Protection Group** wizard in the MABS console.

1. On **Select Protection Group Type**, select **Servers**.

1. On **Select Group Members**, expand the server that holds the WFE role.

   If there's more than one WFE server, select the one on which you installed *ConfigureSharePoint.exe*.

   When you expand the computer running SharePoint, MABS queries VSS to see what data MABS can protect. If the SharePoint database is remote, MABS connects to it. If SharePoint data sources don't appear, check that the VSS writer is running on the computer that's running SharePoint and on any remote instance of SQL Server. Then, ensure that the MABS agent is installed both on the computer running SharePoint and on the remote instance of SQL Server. Also, ensure that SharePoint databases aren't being protected elsewhere as SQL Server databases.

1. On **Select data protection method**,  specify how you want to handle short and long\-term backup. Short\-term backup is always to disk first, with the option of backing up from the disk to the Azure cloud with Azure Backup \(for short or long\-term\).

1. On **Select short\-term goals**, specify how you want to back up to short\-term storage on disk.   In **Retention range** you specify how long you want to keep the data on disk. In **Synchronization frequency**, you specify how often you want to run an incremental backup to disk. 

   If you don't want to set a backup interval, you can check just before  a recovery point so that MABS will run an express full backup just before each recovery point is scheduled.

1. On the **Review disk allocation** page, review the storage pool disk space allocated for the protection group.

   **Total Data size** is the size of the data you want to back up, and **Disk space to be provisioned on MABS** is the space that MABS recommends for the protection group. MABS chooses the ideal backup volume, based on the settings. However, you can edit the backup volume choices in the **Disk allocation details**. For the workloads, select the preferred storage in the dropdown menu. Your edits change the values for **Total Storage** and **Free Storage** in the **Available Disk Storage** blade. Underprovisioned space is the amount of storage MABS suggests you add to the volume, to continue with backups smoothly in the future.

1. On **Choose replica creation method**, select how you want to handle the initial full data replication.

   If you select to replicate over the network, we recommended you choose an off-peak time. For large amounts of data or less than optimal network conditions, consider replicating the data offline using removable media.

1. On **Choose consistency check options**, select how you want to automate consistency checks.

   You can enable a check to run only when replica data becomes inconsistent, or according to a schedule. If you don't want to configure automatic consistency checking, you can run a manual check at any time by right-clicking the protection group in the **Protection** area of the MABS console, and selecting **Perform Consistency Check**.

1. If you've selected to back up to the cloud with Azure Backup, on the **Specify online protection data** page make sure the workloads you want to back up to Azure are selected.

1. On **Specify online backup schedule**, specify how often incremental backups to Azure should occur.

   You can schedule backups to run every day/week/month/year and the time/date at which they should run. Backups can occur up to twice a day. Each time a backup runs, a data recovery point is created in Azure from the copy of the backed-up data stored on the MABS disk.

1. On **Specify online retention policy**, you can specify how the recovery points created from the daily/weekly/monthly/yearly backups are retained in Azure.

1. On **Choose online replication**, specify how the initial full replication of data will occur.

   You can replicate over the network, or do an offline backup (offline seeding). Offline backup uses the Azure Import feature. [Read more](./backup-azure-backup-import-export.md).

1. On the **Summary** page, review your settings. After you select **Create Group**, initial replication of the data occurs.

   When it finishes, the protection group status will show as **OK** on the **Status** page. Backup then takes place in line with the protection group settings.

## Monitor the operations

After the protection group creation is complete, the initial replication happens and MABS starts backing up and synchronizing the SharePoint data. MABS monitors the initial synchronization and subsequent backups. You can monitor the SharePoint data in a couple of ways:

* Using default MABS monitoring, you can set up notifications for proactive monitoring by publishing alerts and configuring notifications. You can send notifications by e-mail for critical, warning, or informational alerts, and for the status of instantiated recoveries.

* If you use Operations Manager, you can centrally publish alerts.

### Set up monitoring notifications

To set up monitoring notifications, follow these steps:

1. On the **MABS Administrator Console**, select **Monitoring** > **Action** > **Options**.

2. Select **SMTP Server**, enter the server name, port, and email address from which notifications will be sent. The address must be valid.

3. On **Authenticated SMTP server**, enter a user name and password.

   The user name and password must be the domain account name of the person whose "From" address is described in the previous step. Otherwise, the notification delivery fails.

4. To test the SMTP server settings, select **Send Test E-mail**, enter the e-mail address where you want MABS to send the test message, and then select **OK**. Select **Options** > **Notifications**, and then select the types of alerts about which recipients want to be notified. In **Recipients** type the e-mail address for each recipient to whom you want MABS to send copies of the notifications.

### Publish Operations Manager alerts

To publish Operations Manager alerts, follow these steps:

1. On the **MABS Administrator Console**, select **Monitoring** > **Action** > **Options** > **Alert Publishing** > **Publish Active Alerts**.

2. After you enable **Alert Publishing**, all existing MABS alerts that might require a user action are published to the **MABS Alerts** event log.

   The Operations Manager agent that's installed on the MABS server then publishes these alerts to the Operations Manager and continues to update the console as new alerts are generated.

## Restore a SharePoint item from disk using MABS

In the following example, the *Recovering SharePoint item* is accidentally deleted and needs to be recovered.

![Diagram shows MABS SharePoint Protection item recovery that's accidentally deleted.](./media/backup-azure-backup-sharepoint/dpm-sharepoint-protection5.png)

To restore a SharePoint item from disk using MABS, follow these steps:

1. Open the **MABS Administrator Console**.

   All SharePoint farms that are protected by MABS are shown in the **Protection** tab.

   ![Screenshot shows how to open the tMABS Administrator Console.](./media/backup-azure-backup-sharepoint/dpm-sharepoint-protection4.png)

2. To start recovering the item, select the **Recovery** tab.

   ![Screenshot shows how to start recovering deleted items.](./media/backup-azure-backup-sharepoint/dpm-sharepoint-protection6.png)

3. You can search SharePoint for *Recovering SharePoint item* using a wildcard-based search within a recovery point range.

   ![Screenshot shows how to search SharePoint for Recovering SharePoint item.](./media/backup-azure-backup-sharepoint/dpm-sharepoint-protection7.png)

4. Select the appropriate recovery point from the search results, right-click the item, and then select **Recover**.
5. You can also browse through various recovery points and select a database or item to recover. Select **Date > Recovery time**, and then select the correct **Database > SharePoint farm > Recovery point > Item**.

    ![Screenshot shows how to browse through various recovery points and select a database or item for recovery.](./media/backup-azure-backup-sharepoint/dpm-sharepoint-protection8.png)

6. Right-click the item, and then select **Recover** to open the **Recovery Wizard**, and then select **Next**.

   ![Screenshot shows how to open the Recovery Wizard.](./media/backup-azure-backup-sharepoint/review-recovery-selection.png)

7. Select the type of recovery that you want to perform, and then select **Next**.

   ![Screenshot shows how to select recovery type to perform.](./media/backup-azure-backup-sharepoint/select-recovery-type.png)

   > [!NOTE]
   > The selection of **Recover to original** in the example recovers the item to the original SharePoint site.

8. Select the **Recovery Process** that you want to use.

   * Select **Recover without using a recovery farm** if the SharePoint farm hasn't changed and is the same as the recovery point that's being restored.
   * Select **Recover using a recovery farm** if the SharePoint farm has changed since the recovery point was created.

     ![Screenshot shows how to select the recovery process.](./media/backup-azure-backup-sharepoint/recovery-process.png)

9. Provide a staging SQL Server instance location to recover the database temporarily, and provide a staging file share on MABS and the server hat's running SharePoint to recover the item.

   ![Screenshot shows how to provide a staging SQL Server instance location to recover the database temporarily.](./media/backup-azure-backup-sharepoint/staging-location1.png)

   MABS attaches the content database that's hosting the SharePoint item to the temporary SQL Server instance. From the content database, it recovers the item and puts it on the staging file location on MABS. The recovered item that's on the staging location now needs to be exported to the staging location on the SharePoint farm.

   ![Screenshot shows the recovery of item and placing it on the staging file location on MABS.](./media/backup-azure-backup-sharepoint/staging-location2.png)

10. Select **Specify recovery options**, and apply security settings to the SharePoint farm or apply the security settings of the recovery point, and then select **Next**.

    ![Screenshot shows how to apply security settings to the SharePoint farm.](./media/backup-azure-backup-sharepoint/recovery-options.png)

    > [!NOTE]
    > You can choose to throttle the network bandwidth usage. This minimizes impact to the production server during production hours.

11. Review the summary information, and then select **Recover** to begin recovery of the file.

    ![Screenshot how to review recovery summary.](./media/backup-azure-backup-sharepoint/recovery-summary.png)
12. Now select the **Monitoring** tab in the **MABS Administrator Console** to view the **Status** of the recovery.

    ![Screenshot shows the recovery status.](./media/backup-azure-backup-sharepoint/recovery-monitoring.png)

    > [!NOTE]
    > The file is now restored. You can refresh the SharePoint site to check the restored file.


## Restore a SharePoint database from Azure using MABS

To restore a SharePoint database from Azure using MABS, follow these steps:

1. Browse through various recovery points (as shown previously), and select the recovery point that you want to restore.

   ![Screenshot shows how to browse through recovery points.](./media/backup-azure-backup-sharepoint/dpm-sharepoint-protection9.png)

2. Double-click the SharePoint recovery point to show the available SharePoint catalog information.

   > [!NOTE]
   > Because the SharePoint farm is protected for long-term retention in Azure, no catalog information (metadata) is available on the MABS server. As a result, whenever a point-in-time SharePoint content database needs to be recovered, you need to catalog the SharePoint farm again.

3. Select **Re-catalog**.

   ![Screenshot shows how to select re-catalog.](./media/backup-azure-backup-sharepoint/dpm-sharepoint-protection12.png)

   The **Cloud Recatalog** status window opens.

   ![Screenshot shows the Cloud Recatalog status window.](./media/backup-azure-backup-sharepoint/dpm-sharepoint-protection13.png)

   After cataloging is finished, the status changes to *Success*. Select **Close**.

    ![Screenshot shows the status as Success.](./media/backup-azure-backup-sharepoint/dpm-sharepoint-protection14.png)

4. On the MABS **Recovery** tab, select the SharePoint object to get the content database structure. Right-click the item, and then select **Recover**.

    ![Screenshot shows how to select the SharePoint object.](./media/backup-azure-backup-sharepoint/dpm-sharepoint-protection15.png)

5. Now, [recover a SharePoint content database from disk](#restore-a-sharepoint-item-from-disk-using-mabs).

## Switch the front-end Web server

If you've more than one front-end web server, you can switch the server that MABS uses to protect the farm.

The following sections use the example of a server farm with two front-end Web servers - *Server1* and *Server2*. MABS uses *Server1* to protect the farm. Change the front-end Web server that MABS uses to *Server2* so that you can remove *Server1* from the farm.

> [!NOTE]
> If the front-end Web server that MABS uses to protect the farm is unavailable, use the following procedure to change the front-end Web server by starting at *step 4*.

### Change the front-end Web server used by MABS

To change the front-end Web server that MABS uses to protect the farm, follow these steps:

1. Stop the SharePoint VSS Writer service on *Server1* by running the following command at a command prompt:

    ```CMD
    stsadm -o unregisterwsswriter
    ```

1. On *Server1*, open the Registry Editor and go to the following key:

   **HKLM\System\CCS\Services\VSS\VssAccessControl**

1. Check all values listed in the *VssAccessControl subkey*.

   If any entry has a value data of 0 and another VSS writer is running under the associated account credentials, change the value data to 1.

1. Install a protection agent on *Server2*.

   > [!WARNING]
   > You can only switch Web front-end servers if both the servers are on the same domain.

1. On *Server2*, at a command prompt, change the directory to `_MABS installation location_\bin\` and run **ConfigureSharepoint**.

   For more information about ConfigureSharePoint, see [Configure backup](#configure-the-backup).

1. Select the protection group that the server farm belongs to, and then select **Modify protection group**.

1. On the *Modify Group Wizard*, on the **Select Group Members** page, expand *Server2* and select the server farm, and then complete the wizard.

   A consistency check will start.

1. If you do *step 6*, you can now remove the volume from the protection group.

## Remove a database from a SharePoint farm

When a database is removed from a SharePoint farm, MABS will skip the backup of that database, continue to back up other databases in the SharePoint farm, and alert the backup administrator.

### MABS Alert - Farm Configuration Changed

This is a warning alert that is generated in Microsoft Azure Backup Server (MABS) when automatic protection of a SharePoint database fails. See the alert **Details** blade for more information about the cause of this alert.

To resolve this alert, follow these steps:

1. Verify with the SharePoint administrator if the database has actually been removed from the farm. If the database has been removed from the farm, then it must be removed from active protection in MABS.
1. To remove the database from active protection:
   1. In **MABS Administrator Console**, click **Protection** on the navigation bar.
   1. In the **Display** blade, right-click the protection group for the SharePoint farm, and then click **Stop Protection of member**.
   1. In the **Stop Protection** dialog box, click **Retain Protected Data**.
   1. Select **Stop Protection**.

You can add the SharePoint farm back for protection by using the **Modify Protection Group** wizard. During re-protection, select the SharePoint front-end server and click **Refresh** to update the SharePoint database cache, then select the SharePoint farm and proceed.

## Next step

- [Back up Exchange server](backup-azure-exchange-mabs.md)
- [Back up SQL Server](backup-azure-sql-mabs.md)
