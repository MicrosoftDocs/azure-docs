<properties
	pageTitle="Use PowerShell to back up and restore App Service apps"
	description="Learn how to use PowerShell to back up and restore an app in Azure App Service"
	services="app-service"
	documentationCenter=""
	authors="NKing92"
	manager="wpickett"
    editor="" />

<tags
	ms.service="app-service"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/10/2016"
	ms.author="nicking"/>
# Use PowerShell to back up and restore App Service apps

> [AZURE.SELECTOR]
- [PowerShell](app-service-powershell-backup.md)
- [REST API](../app-service-web/websites-csm-backup.md)

Learn how to use Azure PowerShell to back up and restore [App Service apps](https://azure.microsoft.com/services/app-service/web/). For more information about web app backups, including requirements and restrictions, see [Back up a web app in Azure App Service](../app-service-web/web-sites-backup.md).

## Prerequisites
In order to use PowerShell to manage your app backups, you will need the following:

- **A SAS URL** that allows read and write access to an Azure Storage container. See [Understanding the SAS model](../storage/storage-dotnet-shared-access-signature-part-1.md) for an explanation of SAS URLs. See [Using Azure PowerShell with Azure Storage](../storage/storage-powershell-guide-full.md) for examples of managing Azure Storage using PowerShell.
- **A database connection string** if you want to back up a database along with your web app.

### How to generate a SAS URL to use with the web app backup cmdlets
A SAS URL can be generated with PowerShell. Here is an example of how to generate one that can be used with the cmdlets discussed in this article.

		$storageAccountName = "<your storage account's name>"
		$storageAccountRg = "<your storage account's resource group>"

		# This returns an array of keys for your storage account. Be sure to select the appropriate key. Here we select the first key as a default.
		$storageAccountKey = Get-AzureRmStorageAccountKey -ResourceGroupName $storageAccountRg -Name $storageAccountName
		$context = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey[0].Value

		$blobContainerName = "<name of blob container for app backups>"
		$token = New-AzureStorageContainerSASToken -name $blobContainerName -permission rwdl -Context $context -ExpiryTime (Get-Date).AddMonths(1)
		$sasUrl = $context.BlobEndPoint + $blobContainerName + $token

## Install Azure PowerShell 1.3.2 or greater

See [Using Azure PowerShell with Azure Resource Manager](../powershell-install-configure.md) for instructions on installing and using Azure PowerShell.

## Create a backup

Use the New-AzureRmWebAppBackup cmdlet to create a backup of a web app.

		$sasUrl = "<your SAS URL>"
		$resourceGroupName = "Default-Web-WestUS"
		$appName = "ContosoApp"

		$backup = New-AzureRmWebAppBackup -ResourceGroupName $resourceGroupName -Name $appName -StorageAccountUrl $sasUrl

This will create a backup with an automatically generated name. If you would like to provide a name for your backup, use the BackupName optional parameter.

		$backup = New-AzureRmWebAppBackup -ResourceGroupName $resourceGroupName -Name $appName -StorageAccountUrl $sasUrl -BackupName MyBackup

If you would like to include a database as part of your backup, first create a database backup setting using the New-AzureRmWebAppDatabaseBackupSetting cmdlet, then supply that setting in the Databases parameter of the New-AzureRmWebAppBackup cmdlet. The Databases parameter accepts an array of database settings, allowing you to back up more than one database.

		$dbSetting1 = New-AzureRmWebAppDatabaseBackupSetting -Name DB1 -DatabaseType SqlAzure -ConnectionString "<connection_string>"
		$dbSetting2 = New-AzureRmWebAppDatabaseBackupSetting -Name DB2 -DatabaseType SqlAzure -ConnectionString "<connection_string>"
		$dbBackup = New-AzureRmWebAppBackup -ResourceGroupName $resourceGroupName -Name $appName -BackupName MyBackup -StorageAccountUrl $sasUrl -Databases $dbSetting1,$dbSetting2

## Get backups

The Get-AzureRmWebAppBackupList cmdlet will return an array of all backups for a web app. You must supply the name of the web app and its resource group.

		$resourceGroupName = "Default-Web-WestUS"
		$appName = "ContosoApp"
		$backups = Get-AzureRmWebAppBackupList -Name $appName -ResourceGroupName $resourceGroupName

To get a specific backup, use the Get-AzureRmWebAppBackup cmdlet.

		$backup = Get-AzureRmWebAppBackup -Name $appName -ResourceGroupName $resourceGroupName -BackupId 10102

You can also pipe a web app object into any of the backup management cmdlets for convenience.

		$app = Get-AzureRmWebApp -Name ContosoApp -ResourceGroupName Default-Web-WestUS
		$backupList = $app | Get-AzureRmWebAppBackupList
		$backup = $app | Get-AzureRmWebAppBackup -BackupId 10102

## Schedule automatic backups

You can schedule backups to happen automatically at a specified interval. To configure a backup schedule, use the Edit-AzureRmWebAppBackupConfiguration cmdlet. This cmdlet takes several parameters:

- **Name** - The name of the web app.
- **ResourceGroupName** - The name of the resource group containing the web app.
- **Slot** - Optional. The name of the web app slot.
- **StorageAccountUrl** - The SAS URL for the Azure Storage container used to store the backups.
- **FrequencyInterval** - Numeric value for how often the backups should be made. Must be a positive integer.
- **FrequencyUnit** - Unit of time for how often the backups should be made. Options are Hour and Day.
- **RetentionPeriodInDays** - How many days the automatic backups should be saved before being automatically deleted.
- **StartTime** - Optional. The time when the automatic backups should begin. Backups will begin immediately if this is null. Must be a DateTime.
- **Databases** - Optional. An array of DatabaseBackupSettings for the databases to backup.
- **KeepAtLeastOneBackup** - Optional switched parameter. Supply this if one backup should always be kept in the storage account, regardless of how old it is.

Below is an example of how to use this cmdlet.

		$resourceGroupName = "Default-Web-WestUS"
		$appName = "ContosoApp"
		$slotName = "StagingSlot"
		$dbSetting1 = New-AzureRmWebAppDatabaseBackupSetting -Name DB1 -DatabaseType SqlAzure -ConnectionString "<connection_string>"
		$dbSetting2 = New-AzureRmWebAppDatabaseBackupSetting -Name DB2 -DatabaseType SqlAzure -ConnectionString "<connection_string>"
		Edit-AzureRmWebAppBackupConfiguration -Name $appName -ResourceGroupName $resourceGroupName -Slot $slotName `
		  -StorageAccountUrl "<your SAS URL>" -FrequencyInterval 6 -FrequencyUnit Hour -Databases $dbSetting1,$dbSetting2 `
		  -KeepAtLeastOneBackup -StartTime (Get-Date).AddHours(1)

To get the current backup schedule, use the Get-AzureRmWebAppBackupConfiguration cmdlet. This can be useful for modifying a schedule that has already been configured.

		$configuration = Get-AzureRmWebAppBackupConfiguration -Name $appName -ResourceGroupName $resourceGroupName

		# Modify the configuration slightly
		$configuration.FrequencyInterval = 2
		$configuration.FrequencyUnit = "Day"

		# Apply the new configuration by piping it into the Edit-AzureRmWebAppBackupConfiguration cmdlet
		$configuration | Edit-AzureRmWebAppBackupConfiguration

## Restore a web app from a backup

To restore a web app from a backup, use the Restore-AzureRmWebAppBackup cmdlet. The easiest way to use this cmdlet is to pipe in a backup object retrieved from the Get-AzureRmWebAppBackup cmdlet or Get-AzureRmWebAppBackupList cmdlet.

Once you have a backup object, you can pipe it into the Restore-AzureRmWebAppBackup cmdlet. You must specify the Overwrite switch parameter to indicate that you intend to overwrite the contents of your web app with the contents of the backup. If the backup contains databases, those databases will be restored as well.

		$backup | Restore-AzureRmWebAppBackup -Overwrite

Below is an example of how to use the Restore-AzureRmWebAppBackup by specifying all of the parameters.

		$resourceGroupName = "Default-Web-WestUS"
		$appName = "ContosoApp"
		$slotName = "StagingSlot"
		$blobName = "ContosoBackup.zip"
		$dbSetting1 = New-AzureRmWebAppDatabaseBackupSetting -Name DB1 -DatabaseType SqlAzure -ConnectionString "<connection_string>"
		$dbSetting2 = New-AzureRmWebAppDatabaseBackupSetting -Name DB2 -DatabaseType SqlAzure -ConnectionString "<connection_string>"
		Restore-AzureRmWebAppBackup -ResourceGroupName $resourceGroupName -Name $appName -Slot $slotName -StorageAccountUrl "<your SAS URL>" -BlobName $blobName -Databases $dbSetting1,$dbSetting2 -Overwrite

## Delete a backup

To delete a backup, use the Remove-AzureRmWebAppBackup cmdlet. This will remove the backup from your storage account. You must specify your app name, its resouce group, and the ID of the backup you want to delete.

		$resourceGroupName = "Default-Web-WestUS"
		$appName = "ContosoApp"
		Remove-AzureRmWebAppBackup -ResourceGroupName $resourceGroupName -Name $appName -BackupId 10102

You can also pipe a backup object into the Remove-AzureRmWebAppBackup cmdlet to delete it.

		$backup = Get-AzureRmWebAppBackup -Name $appName -ResourceGroupName $resourceGroupName -BackupId 10102
		$backup | Remove-AzureRmWebAppBackup -Overwrite
