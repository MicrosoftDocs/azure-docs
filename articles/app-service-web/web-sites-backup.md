<properties 
	pageTitle="Back up a web app in Azure App Service" 
	description="Learn how to create backups of your web apps in Azure App Service." 
	services="app-service\web" 
	documentationCenter="" 
	authors="cephalin" 
	manager="wpickett" 
	editor="mollybos"/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/24/2015" 
	ms.author="cephalin"/>

# Back up a web app in Azure App Service


The Backup and Restore feature in [Azure App Service Web Apps](http://go.microsoft.com/fwlink/?LinkId=529714) lets you easily create web app backups manually or automatically. You can restore your web app to a previous state, or create a new web app based on one of your original app's backups. 

For information on restoring an Azure web app from backup, see [Restore a web app](web-sites-restore.md).

<a name="whatsbackedup"></a>
## What gets backed up 
Web Apps can back up the following information:

* Web app configuration
* Web app file content
* Any SQL Server or MySQL databases connected to your app (you can choose which ones to include in the backup)

This information is backed up to the Azure storage account and container that you specify. 

> [AZURE.NOTE] Each backup is a complete offline copy of your app, not an incremental update.

<a name="requirements"></a>
## Requirements and restrictions

* The Backup and Restore feature requires the site to be in Standard mode. For more information about scaling your web app to use Standard mode, see [Scale a web app in Azure App Service](web-sites-scale.md). Note that Premium mode allows a greater number of daily backups to be performed over the Standard mode.

* The Backup and Restore feature requires an Azure storage account and container that must belong to the same subscription as the web app that you are going to back up. If you do not yet have a storage account, you can create one by clicking the **Storage Account** in the **Backups** blade of the [Azure Portal](http://go.microsoft.com/fwlink/?LinkId=529715), and then choosing the **Storage Account** and the **Container** from the **Destination** blade. For more information on Azure storage accounts, see the [links](#moreaboutstorage) at the end of this article.

* The Backup and Restore feature supports up to 10GB of website and database content. An error will be indicated in the Operation Logs if the backup feature cannot proceed because the payload exceeds this limit. 

<a name="manualbackup"></a>
## Create a manual backup

1. In the Azure portal, choose your web app from the Web Apps blade. This will display the details of your web app in a new blade.
2. Select **Settings** option. The **Settings** blade will be displayed allowing you to modify your web app.
	
	![Backups page][ChooseBackupsPage]

3. Choose the **Backups** option in the **Settings** blade. The **Backups** blade will be displayed.
	
4. From the **Backups** blade, choose your backup destination by selecting a **Storage Account** and **Container**. The storage account must belong to the same subscription as the web app that you are going to back up.
	
	![Choose storage account][ChooseStorageAccount]
	
5. In the **Included databases** option in the **Backups** blade, select the databases that are connected to your web app (SQL Server or MySQL) that you want to back up. 

	> [AZURE.NOTE] 	For a database to appear in this list, its connection string must exist in the **Connection strings** section of the **Web app settings** blade in the portal.
	
6. In the **Backups** blade, select the **Backup destination**. You must choose an existing storage account and container.
7. In the command bar, click **Backup Now**.
	
	![BackUpNow button][BackUpNow]
	
	You will see a progress message during the backup process.
	

You can make a manual backup at any time.  

<a name="automatedbackups"></a>
## Configure automated backups

1. On the **Backups** blade, set **Scheduled Backup** to ON.
	
	![Enable automated backups][SetAutomatedBackupOn]
	
2. Select the storage account to which you want to back up your web app. The storage account must belong to the same subscription as the web app that you are going to back up.
	
	![Choose storage account][ChooseStorageAccount]
	
3. In the **Frequency** box, specify how often you want automated backups to be made. 
	The number of days must be between 1 and 90, inclusive (from once a day to once every 90 days).
	
4. Use the **Begin** option to specify a date and time when you want the automated backups to begin. 
	
	> [AZURE.NOTE] Azure stores backup times in UTC format, but displays them in accordance with the system time on the computer that you are using to display the portal.
	
5. In the **Included Databases** section, select the databases that are connected to your web app (SQL Server or MySQL) that you want to back up. For a database to appear in the list, its connection string must exist in the **Connection strings** section of the **Web app settings** blade in the portal.
	
	> [AZURE.NOTE] If you choose to include one or more databases in the backup and have specified a Frequency of less than 7 days, you will be warned that frequent backups can increase your database costs.
	
6. Additionally, set the **Retention (Days)** value to the number of days you wish to retain the backup.
7. In the command bar, click the **Save** button to save your configuration changes (or choose **Discard** if you decide not to save them).
	
	![Save button][SaveIcon]

<a name="notes"></a>
## Notes

* Make sure that you set up the connection strings for each of your databases properly on the **Web app settings** blade within **Settings** of the web app so that the Backup and Restore feature can include your databases.
* Although you can back up more than one web app to the same storage account, for ease of maintenance, consider creating a separate storage account for each web app.

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

<a name="partialbackups"></a>
## Backup just part of your site

Sometimes you don't want to backup everything on your site, especially if you backup your site regularly, or if your site has over 10GB of content (that's the max amount you can backup at a time).

For example, you probably don't want to back up the log files. Or if you [setup weekly backups](https://azure.microsoft.com/en-us/documentation/articles/web-sites-backup/#configure-automated-backups) you won't want to fill up your storage account with static content that never changes like old blog posts or images.

Partial backups will let you choose exactly which files you want to back up.

###Specify the files you don't want to backup
You can create a list of files and folders to exclude from the backup.  

You save the list as a text file called _backup.filter in the wwwroot folder of your site. An easy way to access this is through the [Kudu Console](https://github.com/projectkudu/kudu/wiki/Kudu-console) at `http://{yoursite}.scm.azurewebsites.net/DebugConsole`.  

The instructions below will be using the Kudu Console to create the _backup.filter file, but you can use your favorite deployment method to put the file there.

###What to do
I've got a site that contains log files and static images from past years that are never going to change.

I already have a full backup of the site which includes the old images. Now I want to backup the site every day, but I don't want to pay for storing log files or the static image files that never change.

![Logs Folder][LogsFolder]
![Images Folder][ImagesFolder]
	
The below steps show how I'd exclude those files from the backup.

####Identify the files and folders you don't want to backup
This is easy. I already know I don't want to backup any log files, so I want to exclude `D:\home\site\wwwroot\Logs`.  

There's another log file folder that all Azure Web Apps have at `D:\home\LogFiles`. Let's exclude that too.

I also don't want to backup the images from previous years over and over again. So lets add `D:\home\site\wwwroot\Images\2013` and `D:\home\site\wwwroot\Images\2014` to the list as well.

Finally, let's not backup the brand.png file in the Images folder either, just to show we can blacklist individual files as well. It's located at `D:\home\site\wwwroot\Images\brand.png` 

This gives us the following folders that we don't want to backup:

* D:\home\site\wwwroot\Logs
* D:\home\LogFiles
* D:\home\site\wwwroot\Images\2013
* D:\home\site\wwwroot\Images\2014
* D:\home\site\wwwroot\Images\brand.png

#### Create the exclusion list
You save the blacklist of files and folders that you don't want to backup in  a special file called _backup.filter.  Create the file and place it at `D:\home\site\wwwroot\_backup.filter`.

List all the files and folders you don't want to backup in the _backup.filter file. You add the full path relative to D:\home of the folder or file that you want to exclude from the backup, one path per line.

So for my site, `D:\home\site\wwwroot\Logs` becomes `\site\wwwroot\Logs`, `D:\home\LogFiles` becomes `\LogFiles`, so on and so forth, resulting in the following contents for my _backup.filter:

    \site\wwwroot\Logs
    \LogFiles
    \site\wwwroot\Images\2013
    \site\wwwroot\Images\2014
    \site\wwwroot\Images\brand.png

Note the starting `\` at the beginning of each line. That's important.

###Run a backup
Now you can run backups the same way you would normally do it. [Manually](https://azure.microsoft.com/en-us/documentation/articles/web-sites-backup/#create-a-manual-backup), [automatically](https://azure.microsoft.com/en-us/documentation/articles/web-sites-backup/#configure-automated-backups), either way is fine.

Any files and folders that fall under the filters listed in the _backup.filter will be excluded from the backup. This means now the log files and the 2013 and 2014 image files will no longer be backed up.

###Restoring your backed up site
You restore partial backups of your site the same way you would [restore a regular backup](https://azure.microsoft.com/en-us/documentation/articles/web-sites-restore/). It'll do the right thing.

####The technical details
With full (non-partial) backups normally all content on the site is replaced with whatever is in the backup.  If a file is on the site but not in the backup it gets deleted.

But when restoring partial backups though any content that is located in one of the blacklisted folders (like `D:\home\site\wwwroot\images\2014` for my site) will be left as is. And if individual files were black listed then they'll also be left alone during the restore.

<a name="aboutbackups"></a>
## How backups are stored

After you have made one or more backups, the backups will be visible on the **Containers** blade of your **Storage Account**, as well as your web app. From the **Storage Account**, each backup consists of a .zip file that contains the backed up data and an .xml file that contains a manifest of the .zip file contents. 

The .zip and .xml backup file names consist of your web app name followed by an underscore and a time stamp of when the backup was taken. The time stamp contains the date in the format YYYYMMDD (in digits with no spaces) plus the 24-hour time in UTC format (for example, fabrikam_201402152300.zip). The content of these files can be unzipped and browsed in case you want to access your backups without actually performing a web app restore.

The XML file that is stored with the zip file indicates the database file name under *backupdescription* > *databases* > *databasebackupdescription* > *filename*.

The database backup file itself is stored in the root of the .zip file. For a SQL database, this is a BACPAC file (no file extension) and can be imported. To create a new SQL database based on the BACPAC export, you can follow the steps in the article [Import a BACPAC File to Create a New User Database](http://technet.microsoft.com/library/hh710052.aspx).

For information on restoring a web app (including databases) by using the Azure Portal, see [Restore a web app in Azure App Service](web-sites-restore.md).

> [AZURE.NOTE] Altering any of the files in your **websitebackups** container can cause the backup to become invalid and therefore non-restorable.

<a name="bestpractices"></a>
##Best Practices
What do you do when disaster strikes and you have to restore your site?  Make sure you're prepared beforehand.

Yeah, you can have partial backups, but take at least one full backup of the site first so that you have all your site's contents backed up (this is worst case scenario planning).  Then when you're restoring your backups you can first restore the full backup of the site, and then restore the latest partial backup on top of it.

Here's why: it lets you use [Deployment Slots](https://azure.microsoft.com/en-us/documentation/articles/web-sites-staged-publishing/) to test your restored site. You can even test the restore process without ever touching your production site. And testing your restore process is a [Very Good Thing](http://axcient.com/blog/one-thing-can-derail-disaster-recovery-plan/).  You never know when you might run into some subtle gotcha like I did when I tried restoring my blog and end up losing half your content.

###A horror story

My blog is powered by the [Ghost](https://ghost.org/) blogging platform.  Like a responsible dev I created a backup of my site and everything was great. Then one day I got a message saying that there was a new version of Ghost available and I could upgrade my blog to it. Great!

I created one more backup of my site to backup the latest blog posts, and proceeded to upgrade Ghost. 

On my production site. 

Bad mistake.  

Something went wrong with the upgrade, my home screen just showed a blank screen.  "No problem" I thought, "I'll simply restore the backup I just took."

I restored the upgrade, saw everything come back...except the blog posts.

WHAT???

Turns out, in the [Ghost upgrade notes](http://support.ghost.org/how-to-upgrade/) there's this warning:

![You can take a copy of your database from content/data but you  should not do this while Ghost is runing. Please stop it first][GhostUpgradeWarning]

If you try to backup the data while Ghost is running...the data doesn't actually get backed up.

Bummer.

If I had tried the restore on a test slot first I would have seen this issue and not lost all my posts.

Such is life. It can happen to [the best of us](http://blog.codinghorror.com/international-backup-awareness-day/). 

Test your backups.

<a name="nextsteps"></a>
## Next Steps
For information on restoring an Azure web app from backup, see [Restore a web app in Azure App Service](web-sites-restore.md).

To get started with Azure, see [Microsoft Azure Free Trial](/pricing/free-trial/).


<a name="moreaboutstorage"></a>
### More about storage accounts

[What is a Storage Account?](../storage-whatis-account.md)

[How to: Create a storage account](../storage-create-storage-account/)

[How To Monitor a Storage Account](../storage-monitor-storage-account.md)

[Understanding Azure Storage Billing](http://blogs.msdn.com/b/windowsazurestorage/archive/2010/07/09/understanding-windows-azure-storage-billing-bandwidth-transactions-and-capacity.aspx)

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
* For a guide to the change of the old portal to the new portal see: [Reference for navigating the preview portal](http://go.microsoft.com/fwlink/?LinkId=529715)

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
[ImagesFolder]: ./media/web-sites-backup/11Images.png
[LogsFolder]: ./media/web-sites-backup/12Logs.png
[GhostUpgradeWarning]: ./media/web-sites-backup/13GhostUpgradeWarning.png
 