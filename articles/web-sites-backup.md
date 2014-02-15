<properties linkid="web-sites-backup" urlDisplayName="Windows Azure Web Sites Backups" pageTitle="Windows Azure Web Sites Backups" metaKeywords="Windows Azure Web Sites, Backups" description="Learn how to create backups of your Windows Azure web sites." metaCanonical="" services="web-sites" documentationCenter="" title="Windows Azure Web Sites Backups" authors=""  solutions="" writer="timamm" manager="paulettm" editor="mollybos"  />

#Windows Azure Web Sites Backups

The Windows Azure Web Sites Backups feature lets you easily create web site backups manually or automatically. You can restore your web site to a previous state, or create a new web site based on one of your original site's backups. The Backups feature is available only in Standard mode. 

> [WACOM.NOTE] During Preview, backup and restore operations are available only through the Windows Azure Management Portal.

For information on restoring a Windows Azure web site from backup, see [Restore a Windows Azure web site](./web-sites-restore).

##What is Backed Up 
Windows Azure Web Sites backs up the following information:

* Web site configuration
* Web site file content
* The linked SQL or MySQL databases that you specify

This information is backed up to the Windows Azure storage account that you specify.

##Requirements and Restrictions
* The Backups feature requires Standard mode. In the portal, use the **Scale** tab to scale your site to Standard mode, or click **Scale your site now** on the **Backups** tab.

* The Backups feature requires an associated Windows Azure storage account. If you do not yet have a storage account, you can create one by selecting the Storage (grid) icon in the left pane of the Windows Azure portal, and then choosing **New** in the command bar at the bottom.

* Backups can only be made to the same region that the web site is in.

## The Backups tab

To make a manual, on-demand backup, choose **Backup Now** in the command bar at the bottom of the portal page. You can make a manual backup at any time, but no more than 2 manual backups can be made in a 24-hour period.

**Automated Backup** - When this option is set to OFF, automated backups are disabled, but manual backup and restore are available. When Automated Backup is set to ON, the **Frequency** and **Start Date** options are enabled so that you can schedule backups.

> [WACOM.NOTE] The **Storage Account** and **Included Databases** options are always on, regardless of whether **Automated Backup** is On or Off.

**Storage account** - Choose which of your Windows Azure storage accounts you want to use to store your backups for this web site. If you do not have a storage account, you can create one in the Windows Azure portal.

> [WACOM.NOTE] Although you can back up more than one web site to the same storage account, for ease of maintenance, consider creating a separate storage account for each web site.

After you have made one or more backups, they will be visible on the **Containers** tab of your storage account. Manual backups will be in a container called **websitebackups**; automated backups will be in a container called **automatedwebsitebackups**. Each backup consists of a .zip file that contains the backed up data and an .xml file that contains a manifest of the .zip file contents.

**Frequency** - Choose how often you want automatic backups to be made. During Preview, the number of days is the only time unit available. The number of days must be between 1 and 90, inclusive. 

> [WACOM.NOTE] If you choose to include one or more databases in the backup and specify a frequency of less than 7 days, you will warned that frequent backups can increase your database costs.

**Start Date** - Specify a date and time for automated backups to start. Times are available in half-hour increments.

> [WACOM.NOTE] Windows Azure stores backup times in UTC format, but displays them in accordance with the system time on the computer that you are using to display the portal.

**Included Databases** - Optionally select one or more SQL or MySQL databases to include in your backup. For a database to appear in the list, its connection string must exist in the **Connection Strings** section of the **Configure** tab in the portal.

If you have no databases linked to your web site, you can click the link to go to the **Linked Resources** tab where you can specify or create a database to link to your web site. 

## Next Steps
For information on restoring a Windows Azure web site from backup, see [Restore a Windows Azure web site](./web-sites-restore).