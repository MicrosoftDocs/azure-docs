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

## Create a backup

Use the New-AzureRmWebAppBackup command to create a backup of a web app.

		$sasUrl = "<your SAS URL>"
		$resourceGroupName = "<name of the resource group containing your app>"
		$appName = "<name of your app>"

		$backup = New-AzureRmWebAppBackup -ResourceGroupName $resourceGroupName -Name $appName -StorageAccountUrl $sasUrl

This will create a backup with an automatically generated name. If you would like to provide a name for your backup, use the BackupName optional parameter.

		$backup = New-AzureRmWebAppBackup -ResourceGroupName $resourceGroupName -Name $appName -StorageAccountUrl $sasUrl -BackupName MyBackup

If you would like to include a database as part of your backup, first create a database backup setting using the New-AzureRmWebAppDatabaseBackupSetting command, then supply that setting in the Databases parameter of the New-AzureRmWebAppBackup command. The Databases parameter accepts an array of database settings, allowing you to include more than one database backup.

		$dbSetting1 = New-AzureRmWebAppDatabaseBackupSetting -Name DB1 -DatabaseType SqlAzure -ConnectionString "<connection_string>"
		$dbSetting2 = New-AzureRmWebAppDatabaseBackupSetting -Name DB2 -DatabaseType SqlAzure -ConnectionString "<connection_string>"
		$dbBackup = New-AzureRmWebAppBackup -ResourceGroupName $resourceGroupName -Name $appName -BackupName MyBackup -StorageAccountUrl $sasUrl -Databases $dbSetting1,$dbSetting2
