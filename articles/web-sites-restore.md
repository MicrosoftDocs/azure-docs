<properties 
	pageTitle="Restore a web app in Azure App Service" 
	description="Learn how to restore your web app from a backup." 
	services="app-service\web" 
	documentationCenter="" 
	authors="cephalin" 
	writer="cephalin" 
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

# Restore a web app in Azure App Service

This article shows you how to restore a web app that you have previously backed up by using the [App Service Web Apps](http://go.microsoft.com/fwlink/?LinkId=529714) Backup feature. For more information, see [App Service Web Apps Backups](web-sites-backup.md). 

The Web Apps Restore feature lets you restore your web app on-demand to a previous state, or create a new web app based on one of your original web app's backups. Creating a new web app that runs in parallel to the latest version can be useful for A/B testing.

The Web Apps Restore feature, available on the **Backups** blade in the [Azure Portal](http://go.microsoft.com/fwlink/?LinkId=529715), is available only in Standard and Premium modes. For information about scaling your app use  Standard or Premium mode, see [Scale a web app in Azure App Service](web-sites-scale.md). 
Note that the Premium mode allows a greater number of daily backups to be performed over the Standard mode.

<a name="PreviousBackup"></a>
## To Restore a web app from a previously made backup

1. On the **Settings** blade of your web app in the Azure portal, click the **Backups** option to display the **Backups** blade. Scroll in this blade and select one of the backup item based on the **BACKUP TIME** and the **STATUS** from the backup list.
	
	![Choose backup source][ChooseBackupSource]
	
2. Select **Restore Now** at the top of the **Backups** blade. 

	![Choose restore now][ChooseRestoreNow]

3. In the **Restore** blade, to restore the existing web app, verify all the displayed details and then click **OK**. 
	
You can also restore your web app to a new web app by selecting the **WEB APP** part from the **Restore** blade and selecting the **Create a new web app** part.
	
<a name="StorageAccount"></a>
## Download or delete a backup from a storage account
	
1. From the main **Browse** blade of the Azure portal, select **Storage Accounts**.
	
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
	
1. To see details about the success or failure of the web app restore operation, select the **Audit Log** part of the main **Browse** blade. 
	
	The **Audio log** blade displays all of your operations, along with level, status, resource, and time details.
	
2. Scroll the blade to find operations related to your web app.
3. To view additional details about an operation, select the operation in the list.
	
The details blade will display the available information related to the operation.
	
>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.
	
## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
* For a guide to the change of the old portal to the new portal see: [Reference for navigating the preview portal](http://go.microsoft.com/fwlink/?LinkId=529715)

<!-- IMAGES -->
[ChooseBackupSource]: ./media/web-sites-restore/01ChooseBackupSource.png
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
