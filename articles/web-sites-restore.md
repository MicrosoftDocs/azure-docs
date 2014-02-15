<properties linkid="web-sites-restore" urlDisplayName="Restore a Windows Azure web site" pageTitle="Restore a Windows Azure web site" metaKeywords="Windows Azure Web Sites, Restore, restoring" description="Learn how to restore your Windows Azure web sites from backup." metaCanonical="" services="web-sites" documentationCenter="" title="Restore a Windows Azure web site" authors=""  solutions="" writer="timamm" manager="paulettm" editor="mollybos"  />

#Restore a Windows Azure web site

This article shows you how to restore a web site that you have previously backed up by using the Windows Azure Web Sites Backup feature. For more information, see [Windows Azure Web Sites Backups](./web-sites-backup). 

The Windows Azure Web Sites Restore feature lets restore your web site on-demand to a previous state, or create a new web site based on one of your original site's backups. Creating a new web site that runs in parallel to the latest version can be useful for A/B testing.

The Restore feature, available on the Backups tab in the Windows Azure Web Sites portal, is available only in Standard mode.

## Table of Contents ##
- [To Restore a Windows Azure web site from a previously made backup](#PreviousBackup)
- [To Restore a Windows Azure web site directly from a storage account](#StorageAccount)
- [Choose Your Web Site Restore Settings](#RestoreSettings)

<a name="PreviousBackup"></a>
##To Restore a Windows Azure web site from a previously made backup

1. On the **Backups** tab, click **Restore Now** in the command bar at the bottom of the portal page. The **Restore Now** dialog box appears.
	
	![Choose backup source][ChooseBackupSource]
	
2. Under **Choose backup source**, select **Previous Backup for this Web Site**.
3. Select the date of the backup that you want to restore, and then click the right arrow to continue.
4. Follow the steps in the [Choose Your Web Site Restore Settings](#RestoreSettings) section later in this article.

<a name="StorageAccount"></a>
##To Restore a Windows Azure web site directly from a storage account

1. On the **Backups** tab, click **Restore Now** in the command bar at the bottom of the portal page. The **Restore Now** dialog box appears.
	
	![Choose backup source][ChooseBackupSource]
	
2. Under **Choose backup source**, select **Storage Account File**. Here you can directly specify the URL for the storage account file, or click the folder icon to navigate to blob storage and specify the backup file. This example chooses the folder icon.
	
	![Storage Account File][StorageAccountFile]
	
3. Click the folder icon to open the **Browse Cloud Storage** dialog box.
	
	![Browse Cloud Storage][BrowseCloudStorage]
	

4. Expand the name of the storage account that you want to use, and then select **websitebackups** (which contains manual backups) or **automatedwebsitebackups** (which contains scheduled backups) depending on the container that you will be using.
5. Select the zip file containing the backup that you want to restore, and then click **Open**.
6. The Storage account file has been selected and shows in the storage account box. Click the right arrow to continue.
	
	![Storage Account File Selected][StorageAccountFileSelected]
	
7. Continue with the [Choose Your Web Site Restore Settings](#RestoreSettings) section that follows.

<a name="RestoreSettings"></a>
##Choose Your Web Site Restore Settings
1. Under **Choose your web site restore settings**, **Restore To**, select either **Current web site** or **New web site instance**.
	
	![Choose your web site restore settings][ChooseRestoreSettings]
	
	If you select **Current web site**, your existing web site will be overwritten by the backup that you selected (destructive restore). During the restore operation, your current web site will be temporarily unavailable, and you will be warned to this effect.
	
	If you select **New web site instance**, a new web site will be created in the same region with the name that you specify. (By default, the new name is **restored**-***oldWebSiteName***.) 
	
	The site that you restore will contain the same content, databases, and configuration that were made in the portal for the original site.
2. If you want to include a database in your restore, under **Included Databases**, **Restore To**, select the database server host that you want to restore the database to. You can also choose to create a new database server to restore to, or choose **Don't Restore** to not restore the database, which is the default. 
	
	![Choose database server host][ChooseDBServer]
	
	> [WACOM.NOTE] You cannot restore a SQL database with the same name to the same SQL Server. You must choose either a different database name or a different SQL Server host to restore the database to.	
	
3. If your restore includes one or more databases, you can select **Automatically adjust connection strings** to update your web site settings to use the connection strings for the new databases. You should verify that all functionality related to databases works as expected after the restore completes.
4. If you choose to restore an existing database, you will need to provide a user name and password. If you choose to restore to a new database, you will need to provide a new database name:
	
	![Restore to a new SQL database][RestoreToNewSQLDB]
	
	Click the right arrow to continue.	
5. If you chose to create a new database, you will need to provide credentials and other initial configuration information for the database in the next dialog:
	
	![New SQL database settings][NewSQLDBConfig]
	
6. Click the check mark to start the restore operation. When it completes, the new web site instance (if that is the restore option you chose) will be visible in the list of web sites in the portal.
	
	![Restored Contoso web site][RestoredContosoWebSite]

[ChooseBackupSource]: ./media/web-sites-restore/01ChooseBackupSource.png
[StorageAccountFile]: ./media/web-sites-restore/02StorageAccountFile.png
[BrowseCloudStorage]: ./media/web-sites-restore/03BrowseCloudStorage.png
[StorageAccountFileSelected]: ./media/web-sites-restore/04StorageAccountFileSelected.png
[ChooseRestoreSettings]: ./media/web-sites-restore/05ChooseRestoreSettings.png
[ChooseDBServer]: ./media/web-sites-restore/06ChooseDBServer.png
[RestoreToNewSQLDB]: ./media/web-sites-restore/07RestoreToNewSQLDB.png
[NewSQLDBConfig]: ./media/web-sites-restore/08NewSQLDBConfig.png
[RestoredContosoWebSite]: ./media/web-sites-restore/09RestoredContosoWebSite.png
