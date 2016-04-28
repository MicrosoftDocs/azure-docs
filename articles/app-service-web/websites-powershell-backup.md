<properties
	pageTitle="Use PowerShell to back up and restore App Service apps"
	description="Learn how to use PowerShell to back up and restore an app in Azure App Service"
	services="app-service"
	documentationCenter=""
	authors="nking92"
	manager="aelnably"
    editor="" />

<tags
	ms.service="app-service"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/28/2016"
	ms.author="nicking"/>


> [AZURE.SELECTOR]
- [PowerShell](websites-powershell-backup.md)
- [REST API](websites-csm-backup.md)

Learn how to use Azure PowerShell to back up and restore [App Service apps](https://azure.microsoft.com/services/app-service/web/). For more information about web app backups, including requirements and restrictions, see [Back up a web app in Azure App Service](./web-sites-backup.md).

## Prerequisites
In order to use PowerShell to manage your app backups, you will need the following:

- **A SAS URL** that allows read and write access to an Azure Storage container. See [Understanding the SAS model](../storage/storage-dotnet-shared-access-signature-part-1.md) for more information on SAS URLs.
- **A database connection string** if you want to back up a database along with your web app.

##Install Azure PowerShell 1.3.2 or greater

See [Using Azure PowerShell with Azure Resource Manager](../powershell-install-configure.md) for instructions on installing and using Azure PowerShell.

## Get web app backups

To get information about your web app backups, use either Get-AzureRmWebAppBackup or Get-AzureRmWebAppBackupList.

To get a list of all backups for a web app, use Get-AzureRmWebAppBackupList. You must supply the name of the web app and its resource group.

		$resourceGroupName = "Default-Web-WestUS"
		$appName = "ContosoApp"
		$backups = Get-AzureRmWebAppBackupList -Name $appName -ResourceGroupName $resourceGroupName

 An array of backup objects will be returned to you.

 ```
ResourceGroupName  : Default-Web-WestUS
Name               : ConsotoApp
Slot               : StagingSlot
StorageAccountUrl  : <your SAS URL>
Databases          : { ContosoDB }
BackupId           : 10101
BackupName         : ContosoBackup
BackupStatus       : Succeeded
Scheduled          : True
BackupSizeInBytes  : 30923339
WebsiteSizeInBytes : 228352
Created            : 4/26/2016 12:17:17 AM
LastRestored       :
Finished           : 4/26/2016 12:28:38 AM
Log                :
CorrelationId      : 1511111a-d9eb-4bcb-8568-c1131b176150

ResourceGroupName  : Default-Web-WestUS
Name               : ConsotoApp
Slot               : StagingSlot
StorageAccountUrl  : <your SAS URL>
Databases          : { ContosoDB }
BackupId           : 10102
BackupName         : ContosoBackup2
BackupStatus       : Succeeded
Scheduled          : True
BackupSizeInBytes  : 30923339
WebsiteSizeInBytes : 228352
Created            : 4/27/2016 12:17:18 AM
LastRestored       :
Finished           : 4/27/2016 12:28:59 AM
Log                :
CorrelationId      : 1511111a-d8e7-4bcb-8568-c1131b176150
 ```

To get a specific backup, use the Get-AzureRmWebAppBackup command.

		$backup = Get-AzureRmWebAppBackup -Name $appName -ResourceGroupName $resourceGroupName -BackupId 10102

You can pipe a web app object into any of the backup management cmdlets for convenience.

		$app = Get-AzureRmWebApp -Name ContosoApp -ResourceGroupName Default-Web-WestUS
		$app | Get-AzureRmWebAppBackupList
		$app | Get-AzureRmWebAppBackup -BackupId 10102

## Create a backup

Use the New-AzureRmWebAppBackup command to create a backup of a web app.

		$sasUrl = "<your SAS URL>"
		$resourceGroupName = "<name of the resource group containing your app>"
		$appName = "<name of your app>"

		$backup = New-AzureRmWebAppBackup -ResourceGroupName $resourceGroupName -Name $appName -StorageAccountUrl $sasUrl

This will create a backup with an automatically generated name. If you would like to provide a name for your backup, use the BackupName optional parameter.

		$backup = New-AzureRmWebAppBackup -ResourceGroupName $resourceGroupName -Name $appName -StorageAccountUrl $sasUrl -BackupName MyBackup

If you would like to include a database as part of your backup, first create a database backup setting using the New-AzureRmWebAppDatabaseBackupSetting command, then supply that setting in the Databases parameter of the New-AzureRmWebAppBackup command. The Databases parameter accepts an array of database settings, allowing you to back up more than one database.

		$dbSetting1 = New-AzureRmWebAppDatabaseBackupSetting -Name DB1 -DatabaseType SqlAzure -ConnectionString "<connection_string>"
		$dbSetting2 = New-AzureRmWebAppDatabaseBackupSetting -Name DB2 -DatabaseType SqlAzure -ConnectionString "<connection_string>"
		$dbBackup = New-AzureRmWebAppBackup -ResourceGroupName $resourceGroupName -Name $appName -BackupName MyBackup -StorageAccountUrl $sasUrl -Databases $dbSetting1,$dbSetting2

The New-AzureRmWebAppBackup command will return an object to you containing information about the backup that has been created.
