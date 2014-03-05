<properties linkid="web-sites-backup" urlDisplayName="Windows Azure Web Sites Backups" pageTitle="Windows Azure Web Sites Backups" metaKeywords="Windows Azure Web Sites, Backups" description="Learn how to create backups of your Windows Azure web sites." metaCanonical="" services="web-sites" documentationCenter="" title="Windows Azure Web Sites Backups" authors=""  solutions="" writer="timamm" manager="paulettm" editor="mollybos"  />

#Windows Azure Web Sites Backups

The Windows Azure Web Sites Backup and Restore feature lets you easily create web site backups manually or automatically. You can restore your web site to a previous state, or create a new web site based on one of your original site's backups. 


For information on restoring a Windows Azure web site from backup, see [Restore a Windows Azure web site](http://www.windowsazure.com/en-us/documentation/articles/web-sites-restore/).

##What gets backed Up 
Windows Azure Web Sites backs up the following information:

* Web site configuration
* Web site file content
* Any SQL Server or MySQL databases connected to your site (you can choose which ones to include in the backup)

This information is backed up to the Windows Azure storage account that you specify. 

> [WACOM.NOTE] Each backup is a complete offline copy of your web site, not an incremental update.

##Requirements and Restrictions
<<<<<<< HEAD
* The Backup and Restore feature requires Standard mode. In the portal, click **Scale your site now** on the Backups tab to use the Scale tab to scale your site..

* The Backups and Restore feature requires an associated Windows Azure storage account. If you do not yet have a storage account, you can create one by selecting the **Storage** button (grid icon) in the left pane of the Windows Azure portal, and then choosing **New** in the command bar at the bottom.

## To Make a Manual Backup

1. In the Windows Azure portal for your web site, choose the **Backups** tab.
	
	![Backups page][ChooseBackupsPage]
	
2. Select the storage account to which you want to back up your web site. The storage account must belong to the same subscription as the web site that you are going to back up.
	
	![Choose storage account][ChooseStorageAccount]
	
3. In the **Included Databases** option, select the databases that are connected to your web site (SQL Server or MySQL) that you want to back up. 
	
	![Choose databases to include][IncludedDatabases]

	> [WACOM.NOTE] 	For a database to appear in this list, its connection string must exist in the **Connection Strings** section of the Configure tab in the portal.
	
4. In the command bar, click **Backup Now**.
	
	![BackUpNow button][BackUpNow]
	
	You will see a progress message during the backup process:
	
	![Backup progress message][BackupProgress]
	
You can make a manual backup at any time. At the beginning of Preview, no more than 2 manual backups can be made in a 24-hour period (subject to change).  

## To Configure Automated Backups

1. On the Backups page, set **Automated Backup** to ON.
	
	![Enable automated backups][SetAutomatedBackupOn]
	
2. Select the storage account to which you want to back up your web site. The storage account must belong to the same subscription as the web site that you are going to back up.
	
	![Choose storage account][ChooseStorageAccount]
	
3. In the **Frequency** box, specify how often you want automated backups to be made. (During Preview, the number of days is the only time unit available.)
	
	![Choose backup frequency][Frequency]
	
	The number of days must be between 1 and 90, inclusive (from once a day to once every 90 days).
	
4. Use the **Start Date** option to specify a date and time when you want the automated backups to begin. 
	
	![Choose start date][StartDate]
	
	Times are available in half-hour increments.
	
	![Choose start time][StartTime]
	
	> [WACOM.NOTE] Windows Azure stores backup times in UTC format, but displays them in accordance with the system time on the computer that you are using to display the portal.
	
5. In the **Included Databases** section, select the databases that are connected to your web site (SQL Server or MySQL) that you want to back up. For a database to appear in the list, its connection string must exist in the **Connection Strings** section of the Configure tab in the portal.
	
	![Choose databases to include][IncludedDatabases]
	
	> [WACOM.NOTE] If you choose to include one or more databases in the backup and have specified a Frequency of less than 7 days, you will be warned that frequent backups can increase your database costs.
	
6. In the command bar, click the **Save** button to save your configuration changes (or choose **Discard** if you decide not to save them).
	
	![Save button][SaveIcon]

## How backups are stored

After you have made one or more backups, they will be visible on the Containers tab of your storage account. Your backups will be in a container called **websitebackups**. Each backup consists of a .zip file that contains the backed up data and an .xml file that contains a manifest of the .zip file contents. 

The .zip and .xml backup file names consist of your web site name followed by an underscore and a time stamp of when the backup was taken. The time stamp contains the date in the format YYYYMMDD (in digits with no spaces) plus the 24-hour time in UTC format (for example, fabrikam_201402152300.zip). The content of these files can be unzipped and browsed in case you want to access your backups without actually performing a web site restore.

> [WACOM.NOTE] Altering any of the files in your **websitebackups** container can cause the backup to become invalid and therefore non-restorable.

## Notes

* Make sure that you set up the connection strings for each of your databases properly on the Configure tab of the web site so that the Backup and Restore feature can include your databases.
* During Preview, you are responsible for managing the backed up content saved to your storage account. If you delete a backup from your storage account and have not made a copy elsewhere, you will not be able to restore the backup later. 
* Although you can back up more than one web site to the same storage account, for ease of maintenance, consider creating a separate storage account for each web site.
* During Preview, backup and restore operations are available only through the Windows Azure Management Portal.


## Next Steps
For information on restoring a Windows Azure web site from backup, see [Restore a Windows Azure web site](http://www.windowsazure.com/en-us/documentation/articles/web-sites-restore/).

=======
* The Backup and Restore feature requires requires the site to be in a Standard tier. For more information about scaling your web site use a Standard tier, see [How to Scale Web Sites](http://www.windowsazure.com/en-us/documentation/articles/web-sites-scale/). 

* The Backup and Restore feature requires an Windows Azure storage account that must belong to the same subscription as the web site that you are going to back up. If you do not yet have a storage account, you can create one by clicking the **Storage** button (grid icon) in the left pane of the Windows Azure portal, and then choosing **New** in the command bar at the bottom. For more information on Windows Azure storage accounts, see the links at the end of this article.

## To Create a Manual Backup

1. In the Windows Azure portal for your web site, choose the **Backups** tab.
	
	![Backups page][ChooseBackupsPage]
	
2. Select the storage account to which you want to back up your web site. The storage account must belong to the same subscription as the web site that you are going to back up.
	
	![Choose storage account][ChooseStorageAccount]
	
3. In the **Included Databases** option, select the databases that are connected to your web site (SQL Server or MySQL) that you want to back up. 
	
	![Choose databases to include][IncludedDatabases]

	> [WACOM.NOTE] 	For a database to appear in this list, its connection string must exist in the **Connection Strings** section of the Configure tab in the portal.
	
4. In the command bar, click **Backup Now**.
	
	![BackUpNow button][BackUpNow]
	
	You will see a progress message during the backup process:
	
	![Backup progress message][BackupProgress]
	
You can make a manual backup at any time. During Preview, no more than 2 manual backups can be made in a 24-hour period (subject to change).  

## To Configure Automated Backups

1. On the Backups page, set **Automated Backup** to ON.
	
	![Enable automated backups][SetAutomatedBackupOn]
	
2. Select the storage account to which you want to back up your web site. The storage account must belong to the same subscription as the web site that you are going to back up.
	
	![Choose storage account][ChooseStorageAccount]
	
3. In the **Frequency** box, specify how often you want automated backups to be made. (During Preview, the number of days is the only time unit available.)
	
	![Choose backup frequency][Frequency]
	
	The number of days must be between 1 and 90, inclusive (from once a day to once every 90 days).
	
4. Use the **Start Date** option to specify a date and time when you want the automated backups to begin. 
	
	![Choose start date][StartDate]
	
	Times are available in half-hour increments.
	
	![Choose start time][StartTime]
	
	> [WACOM.NOTE] Windows Azure stores backup times in UTC format, but displays them in accordance with the system time on the computer that you are using to display the portal.
	
5. In the **Included Databases** section, select the databases that are connected to your web site (SQL Server or MySQL) that you want to back up. For a database to appear in the list, its connection string must exist in the **Connection Strings** section of the Configure tab in the portal.
	
	![Choose databases to include][IncludedDatabases]
	
	> [WACOM.NOTE] If you choose to include one or more databases in the backup and have specified a Frequency of less than 7 days, you will be warned that frequent backups can increase your database costs.
	
6. In the command bar, click the **Save** button to save your configuration changes (or choose **Discard** if you decide not to save them).
	
	![Save button][SaveIcon]

## How backups are stored

After you have made one or more backups, they will be visible on the Containers tab of your storage account. Your backups will be in a container called **websitebackups**. Each backup consists of a .zip file that contains the backed up data and an .xml file that contains a manifest of the .zip file contents. 

The .zip and .xml backup file names consist of your web site name followed by an underscore and a time stamp of when the backup was taken. The time stamp contains the date in the format YYYYMMDD (in digits with no spaces) plus the 24-hour time in UTC format (for example, fabrikam_201402152300.zip). The content of these files can be unzipped and browsed in case you want to access your backups without actually performing a web site restore.

> [WACOM.NOTE] Altering any of the files in your **websitebackups** container can cause the backup to become invalid and therefore non-restorable.

## Notes

* Make sure that you set up the connection strings for each of your databases properly on the Configure tab of the web site so that the Backup and Restore feature can include your databases.
* During Preview, you are responsible for managing the backed up content saved to your storage account. If you delete a backup from your storage account and have not made a copy elsewhere, you will not be able to restore the backup later. 
* Although you can back up more than one web site to the same storage account, for ease of maintenance, consider creating a separate storage account for each web site.
* During Preview, backup and restore operations are available only through the Windows Azure Management Portal.


## Next Steps
For information on restoring a Windows Azure web site from backup, see [Restore a Windows Azure web site](http://www.windowsazure.com/en-us/documentation/articles/web-sites-restore/).

### More about storage accounts

[What is a Storage Account?](http://www.windowsazure.com/en-us/documentation/articles/storage-whatis-account/)

[How to: Create a storage account](http://www.windowsazure.com/en-us/documentation/articles/storage-create-storage-account/)

[How To Monitor a Storage Account](http://www.windowsazure.com/en-us/documentation/articles/storage-monitor-storage-account/)

[Understanding Windows Azure Storage Billing](http://blogs.msdn.com/b/windowsazurestorage/archive/2010/07/09/understanding-windows-azure-storage-billing-bandwidth-transactions-and-capacity.aspx)


>>>>>>> AUX41
<!-- IMAGES -->
[ChooseBackupsPage]: ./media/web-sites-backup/01ChooseBackupsPage.png
[ChooseStorageAccount]: ./media/web-sites-backup/02ChooseStorageAccount.png
[IncludedDatabases]: ./media/web-sites-backup/03IncludedDatabases.png
[BackUpNow]: ./media/web-sites-backup/04BackUpNow.png
[BackupProgress]: ./media/web-sites-backup/05BackupProgress.png
[SetAutomatedBackupOn]: ./media/web-sites-backup/06SetAutomatedBackupOn.png
[Frequency]: ./media/web-sites-backup/07Frequency.png
[StartDate]: ./media/web-sites-backup/08StartDate.png
[StartTime]: ./media/web-sites-backup/09StartTime.png
[SaveIcon]: ./media/web-sites-backup/10SaveIcon.png
