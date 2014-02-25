<properties linkid="web-sites-backup" urlDisplayName="Windows Azure Web Sites Backups" pageTitle="Windows Azure Web Sites Backups" metaKeywords="Windows Azure Web Sites, Backups" description="Learn how to create backups of your Windows Azure web sites." metaCanonical="" services="web-sites" documentationCenter="" title="Windows Azure Web Sites Backups" authors=""  solutions="" writer="timamm" manager="paulettm" editor="mollybos"  />

#Windows Azure Web Sites Backups

The Windows Azure Web Sites Backup feature lets you easily create web site backups manually or automatically. You can restore your web site to a previous state, or create a new web site based on one of your original site's backups. 

For information on restoring a Windows Azure web site from backup, see [Restore a Windows Azure web site](http://www.windowsazure.com/en-us/documentation/articles/web-sites-restore/).

##What is Backed Up 
Windows Azure Web Sites backs up the following information:

* Web site configuration
* Web site file content
* Any SQL or MySQL databases connected to your site (you can choose which ones to include in the backup)

This information is backed up to the Windows Azure storage account that you specify. 

> [WACOM.NOTE] Each backup is a complete offline copy of your web site, not an incremental update.

##Requirements and Restrictions
* The Backup feature requires Standard mode. In the portal, you can click **Scale your site now** on the **Backups** tab to use the **Scale** tab to scale your site.
	
* The Backup feature requires an associated Windows Azure storage account. If you do not yet have a storage account, you can create one by selecting the Storage (grid) icon in the left pane of the Windows Azure portal, and then choosing **New** in the command bar at the bottom.
	
* During Preview, backup and restore operations are available only through the Windows Azure Management Portal.

## The Backups tab

To make a manual, on-demand backup, choose **Backup Now** in the command bar at the bottom of the portal page. The backup is made to the storage account that you specify in the **Storage Account** option, and will also include any databases that you specify in the **Included Databases** option. You can make a manual backup at any time. At the beginning of Preview, no more than 2 manual backups can be made in a 24-hour period (subject to change). 

**Automated Backup** - When Automated Backup is set to ON, the Frequency and Start Date options are enabled so that you can schedule automatic backups. When this option is set to OFF (the default), automated backups are disabled, but manual backup and restore are available. 

**Storage account** - Choose which of your Windows Azure storage accounts you want to use to store your backups for this web site. The storage account that you choose must be in the same subscription as the subscription for the web site that you are backing up. During Preview, you are responsible for managing the backed up content saved to your storage account. If you delete a backup from your storage account (and have not made a copy elsewhere), you will not be able to restore the backup  later. If you do not have a storage account, you can create one in the Windows Azure portal.

> [WACOM.NOTE] Although you can back up more than one web site to the same storage account, for ease of maintenance, consider creating a separate storage account for each web site.

**Frequency** - Choose how often you want automatic backups to be made. During Preview, the number of days is the only time unit available. The number of days must be between 1 and 90, inclusive. 

> [WACOM.NOTE] If you choose to include one or more databases in the backup and specify a frequency of less than 7 days, you will warned that frequent backups can increase your database costs.

**Start Date** - Specify a date and time for automated backups to start. Times are available in half-hour increments.

> [WACOM.NOTE] Windows Azure stores backup times in UTC format, but displays them in accordance with the system time on the computer that you are using to display the portal.

**Included Databases** - Optionally select one or more SQL or MySQL databases to include in your backup. For a database to appear in the list, its connection string must exist in the **Connection Strings** section of the **Configure** tab in the portal.

If you have no databases connected to your web site, you can click the link to go to the **Linked Resources** tab where you can specify or create a database to connect to your web site. 

> [WACOM.NOTE] Make sure that you set up the connection strings for each of your databases properly on the **Configure** tab of the web site so that the Backup feature can include your databases. 

##How backups are stored

After you have made one or more backups, they will be visible on the **Containers** tab of your storage account. Your backups will be in a container called **websitebackups**. Each backup consists of a .zip file that contains the backed up data and an .xml file that contains a manifest of the .zip file contents. 

The .zip and .xml backup file names consist of your web site name followed by an underscore and a time stamp of when the backup was taken. The time stamp contains the date in the format YYYYMMDD (in digits with no spaces) plus the 24-hour time in UTC format (for example, contoso_201402152300.zip). The content of these files can be unzipped and browsed in case you want to access your backups without actually performing a web site restore.

> [WACOM.NOTE] Altering any of the files in your **websitebackups** container can cause the backup to become invalid and therefore non-restorable.

## Next Steps
For information on restoring a Windows Azure web site from backup, see [Restore a Windows Azure web site](http://www.windowsazure.com/en-us/documentation/articles/web-sites-restore/).