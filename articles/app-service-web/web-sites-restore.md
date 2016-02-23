<properties 
	pageTitle="Restore an app in Azure App Service" 
	description="Learn how to restore your app from a backup." 
	services="app-service" 
	documentationCenter="" 
	authors="cephalin" 
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="app-service" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="01/26/2016" 
	ms.author="cephalin"/>

# Restore an app in Azure App Service

This article shows you how to restore an App Service app that you have previously backed up by using the [App Service](app-service-value-prop-what-is) Backup feature. For more information, see [App Service Backups](web-sites-backup.md). 

The App Service Restore feature lets you restore your app with its linked databases (SQL Database or MySQL) on-demand to a previous state, or create a new app based on one of your original app's backup. Creating a new app that runs in parallel to the latest version can be useful for A/B testing.

The App Service Restore feature, available on the **Backups** blade in the [Azure Portal](https://portal.azure.com), is available only in Standard and Premium pricing tiers. For information about scaling your app using Standard or Premium tier, see [Scale an app in Azure App Service](web-sites-scale.md). Note that the Premium tier allows a greater number of daily backups to be performed over the Standard tier.

<a name="PreviousBackup"></a>
## To Restore an app from a previously made backup

1. On the **Settings** blade of your app in the Azure Portal, click **Backups** to display the **Backups** blade. Then click **Restore Now** in the command bar. 
	
	![Choose restore now][ChooseRestoreNow]

3. In the **Restore** blade, first select the backup source. 

	![](./media/web-sites-restore/021ChooseSource.png)
	
	The **App backup** option shows you all the backups that are created directly by the app itself, since these are the only ones that the apps are aware of. You can easily select one. 
	The **Storage** option lets you select the actual backup ZIP file from the storage account and container that's configured in your **Backups** blade. If there are backup files from any other apps in 
	the container, then you can select them to restore as well.  

4. Then, specify the destination for the app restore in **Restore destination**.

	![](./media/web-sites-restore/022ChooseDestination.png)
	
	>[AZURE.WARNING] If you choose **Overwrite**, all data related to your existing app will be erased. Before you click **OK**,
	make sure that it is exactly what you want to do.
	
	You can select **Existing App** to restore the app backup to another app in the same resoure group. Before you use this option, 
	you should have already created another app in your resource group with mirroring database configuration to the one defined
	in the app backup. 
	
5. Click **OK**.

<a name="StorageAccount"></a>
## Download or delete a backup from a storage account
	
1. From the main **Browse** blade of the Azure Portal, select **Storage Accounts**.
	
	A list of your existing storage accounts will be displayed. 
	
2. Select the storage account that contains the backup that you want to download or delete.
	
	The **STORAGE** blade will be displayed.

3. Select the **Containers** part in the **STORAGE** blade to display the **Containers** blade.
	
	A list of containers will be displayed. This list will also show the URL and the date of when this container was last modified.
	
	![View Containers][ViewContainers]

4. In the list, select the container and display the blade that shows a list of file names, along with the size of each file.
	
5. By selecting a file, you can either choose to **Download** or **Delete** the file. Note that there are two primary file types, .zip files and .xml files. 

<a name="OperationLogs"></a>
## View the Audit Logs
	
1. To see details about the success or failure of the app restore operation, select the **Audit Log** part of the main **Browse** blade. 
	
	The **Audit log** blade displays all of your operations, along with level, status, resource, and time details.
	
2. Scroll the blade to find operations related to your app.
3. To view additional details about an operation, select the operation in the list.
	
The details blade will display the available information related to the operation.
	
>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

## Next Steps

You can also backup and restore App Service apps using REST API (see [Use REST to back up and restore App Service apps](websites-csm-backup.md)).

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)

<!-- IMAGES -->
[ChooseRestoreNow]: ./media/web-sites-restore/02ChooseRestoreNow.png
[ViewContainers]: ./media/web-sites-restore/03ViewContainers.png
[StorageAccountFile]: ./media/web-sites-restore/02StorageAccountFile.png
[BrowseCloudStorage]: ./media/web-sites-restore/03BrowseCloudStorage.png
[StorageAccountFileSelected]: ./media/web-sites-restore/04StorageAccountFileSelected.png
[ChooseRestoreSettings]: ./media/web-sites-restore/05ChooseRestoreSettings.png
[ChooseDBServer]: ./media/web-sites-restore/06ChooseDBServer.png
[RestoreToNewSQLDB]: ./media/web-sites-restore/07RestoreToNewSQLDB.png
[NewSQLDBConfig]: ./media/web-sites-restore/08NewSQLDBConfig.png
[RestoredContosoWebSite]: ./media/web-sites-restore/09RestoredContosoWebSite.png
[DashboardOperationLogsLink]: ./media/web-sites-restore/10DashboardOperationLogsLink.png
[ManagementServicesOperationLogsList]: ./media/web-sites-restore/11ManagementServicesOperationLogsList.png
[DetailsButton]: ./media/web-sites-restore/12DetailsButton.png
[OperationDetails]: ./media/web-sites-restore/13OperationDetails.png
 
