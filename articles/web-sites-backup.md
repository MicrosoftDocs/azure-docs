<properties 
	pageTitle="Azure Websites Backups" 
	description="Learn how to create backups of your Azure websites." 
	services="web-sites" 
	documentationCenter="" 
	authors="cephalin" 
	manager="wpickett" 
	editor="mollybos"/>

<tags 
	ms.service="web-sites" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/12/2015" 
	ms.author="cephalin"/>

# Azure Websites Backups

The Azure Websites Backup and Restore feature lets you easily create website backups manually or automatically. You can restore your website to a previous state, or create a new website based on one of your original site's backups. 


For information on restoring an Azure website from backup, see [Restore an Azure web site](../web-sites-restore/).

<a name="video"></a>
## Automatic and Easy Backup (Video)

In this video, Eduardo Laureano and Scott Hanselman introduce Azure websites backups. (Duration: 11:43)  

> [AZURE.VIDEO azure-websites-automatic-and-easy-backup]

<a name="whatsbackedup"></a>
## What Gets Backed Up 
Azure Websites backs up the following information:

* Website configuration
* Website file content
* Any SQL Server or MySQL databases connected to your site (you can choose which ones to include in the backup)

This information is backed up to the Azure storage account that you specify. 

> [AZURE.NOTE] Each backup is a complete offline copy of your website, not an incremental update.

<a name="requirements"></a>
## Requirements and Restrictions

* The Backup and Restore feature requires the site to be in a Standard tier. For more information about scaling your website use a Standard tier, see [How to Scale Web Sites](../web-sites-scale/). 

* The Backup and Restore feature requires an Azure storage account that must belong to the same subscription as the website that you are going to back up. If you do not yet have a storage account, you can create one by clicking the **Storage** button (grid icon) in the left pane of the Azure portal, and then choosing **New** in the command bar at the bottom. For more information on Azure storage accounts, see the [links](#moreaboutstorage) at the end of this article.

<a name="manualbackup"></a>
## To Create a Manual Backup

1. In the Azure portal for your website, choose the **Backups** tab.
	
	![Backups page][ChooseBackupsPage]
	
2. Select the storage account to which you want to back up your website. The storage account must belong to the same subscription as the website that you are going to back up.
	
	![Choose storage account][ChooseStorageAccount]
	
3. In the **Included Databases** option, select the databases that are connected to your website (SQL Server or MySQL) that you want to back up. 
	
	![Choose databases to include][IncludedDatabases]

	> [AZURE.NOTE] 	For a database to appear in this list, its connection string must exist in the **Connection Strings** section of the Configure tab in the portal.
	
4. In the command bar, click **Backup Now**.
	
	![BackUpNow button][BackUpNow]
	
	You will see a progress message during the backup process:
	
	![Backup progress message][BackupProgress]
	
You can make a manual backup at any time. During Preview, no more than 2 manual backups can be made in a 24-hour period (subject to change).  

<a name="automatedbackups"></a>
## To Configure Automated Backups

1. On the Backups page, set **Automated Backup** to ON.
	
	![Enable automated backups][SetAutomatedBackupOn]
	
2. Select the storage account to which you want to back up your website. The storage account must belong to the same subscription as the website that you are going to back up.
	
	![Choose storage account][ChooseStorageAccount]
	
3. In the **Frequency** box, specify how often you want automated backups to be made. (During Preview, the number of days is the only time unit available.)
	
	![Choose backup frequency][Frequency]
	
	The number of days must be between 1 and 90, inclusive (from once a day to once every 90 days).
	
4. Use the **Start Date** option to specify a date and time when you want the automated backups to begin. 
	
	![Choose start date][StartDate]
	
	Times are available in half-hour increments.
	
	![Choose start time][StartTime]
	
	> [AZURE.NOTE] Azure stores backup times in UTC format, but displays them in accordance with the system time on the computer that you are using to display the portal.
	
5. In the **Included Databases** section, select the databases that are connected to your website (SQL Server or MySQL) that you want to back up. For a database to appear in the list, its connection string must exist in the **Connection Strings** section of the Configure tab in the portal.
	
	![Choose databases to include][IncludedDatabases]
	
	> [AZURE.NOTE] If you choose to include one or more databases in the backup and have specified a Frequency of less than 7 days, you will be warned that frequent backups can increase your database costs.
	
6. In the command bar, click the **Save** button to save your configuration changes (or choose **Discard** if you decide not to save them).
	
	![Save button][SaveIcon]

<a name="aboutbackups"></a>
## How Backups Are Stored

After you have made one or more backups, they will be visible on the Containers tab of your storage account. Your backups will be in a container called **websitebackups**. Each backup consists of a .zip file that contains the backed up data and an .xml file that contains a manifest of the .zip file contents. 

The .zip and .xml backup file names consist of your website name followed by an underscore and a time stamp of when the backup was taken. The time stamp contains the date in the format YYYYMMDD (in digits with no spaces) plus the 24-hour time in UTC format (for example, fabrikam_201402152300.zip). The content of these files can be unzipped and browsed in case you want to access your backups without actually performing a website restore.

The XML file that is stored with the zip file indicates the database file name under *backupdescription* > *databases* > *databasebackupdescription* > *filename*.

The database backup file itself is stored in the root of the .zip file. For a SQL database, this is a BACPAC file (no file extension) and can be imported. To create a new SQL database based on the BACPAC export, you can follow the steps in the article [Import a BACPAC File to Create a New User Database](http://technet.microsoft.com/library/hh710052.aspx).

For information on restoring an Azure website (including databases) by using the Azure management portal, see [Restore a Microsoft Azure web site](../web-sites-restore/).

> [AZURE.NOTE] Altering any of the files in your **websitebackups** container can cause the backup to become invalid and therefore non-restorable.

<a name="notes"></a>
## Notes

* Make sure that you set up the connection strings for each of your databases properly on the Configure tab of the website so that the Backup and Restore feature can include your databases.
* During Preview, you are responsible for managing the backed up content saved to your storage account. If you delete a backup from your storage account and have not made a copy elsewhere, you will not be able to restore the backup later. 
* Although you can back up more than one website to the same storage account, for ease of maintenance, consider creating a separate storage account for each website.
* During Preview, backup and restore operations are available only through the Azure Management Portal.

<a name="nextsteps"></a>
## Next Steps
For information on restoring an Azure website from backup, see [Restore an Azure web site](../web-sites-restore/).

To get started with Azure, see [Microsoft Azure Free Trial](/pricing/free-trial/).


<a name="moreaboutstorage"></a>
### More about storage accounts

[What is a Storage Account?](../storage-whatis-account/)

[How to: Create a storage account](../storage-create-storage-account/)

[How To Monitor a Storage Account](../storage-monitor-storage-account/)

[Understanding Winidows Azure Storage Billing](http://blogs.msdn.com/b/windowsazurestorage/archive/2010/07/09/understanding-windows-azure-storage-billing-bandwidth-transactions-and-capacity.aspx)

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
