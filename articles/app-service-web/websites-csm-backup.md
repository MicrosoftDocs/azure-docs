<properties
	pageTitle="Use REST to back up and restore App Service apps"
	description="Learn how to use RESTful API calls to back up and restore an app in Azure App Service"
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
	ms.date="05/17/2016"
	ms.author="nicking"/>
# Use REST to back up and restore App Service apps

> [AZURE.SELECTOR]
- [PowerShell](../app-service/app-service-powershell-backup.md)
- [REST API](websites-csm-backup.md)

[App Service apps](https://azure.microsoft.com/services/app-service/web/) can be backed up as blobs in Azure storage. The backup can also contain the app’s databases. If the app is ever accidentally deleted, or if the app needs to be reverted to a previous version, it can be restored from any previous backup. Backups can be done at any time on demand, or backups can be scheduled at suitable intervals.

This article will explain how to backup and restore an app with RESTful API requests. If you would like to create and manage app backups graphically through the Azure portal, see [Back up a web app in Azure App Service](web-sites-backup.md)

<a name="gettingstarted"></a>
## Getting Started
To send REST requests, you will need to know your app’s **name**, **resource group**, and **subscription id**. This information can be found by clicking on your app in the **App Service** blade of the [Azure portal](https://portal.azure.com). For the examples in this article, we will be configuring the website **backuprestoreapiexamples.azurewebsites.net**. It is stored in the Default-Web-WestUS resource group and is running on a subscription with the ID 00001111-2222-3333-4444-555566667777.

![Sample Website Information][SampleWebsiteInformation]

<a name="backup-restore-rest-api"></a>
## Backup and restore REST API
We will now cover several examples of how to use the REST API to backup and restore an app. Each example will include a URL and HTTP request body. The sample URL will contain placeholders wrapped in curly braces, such as {subscription-id}. You should replace these with the corresponding information for your app. For reference, here is an explanation of each placeholder that appears in the example URLs.

* subscription-id – ID of the Azure subscription containing the app
* resource-group-name – Name of the resource group containing the app
* name – Name of the app
* backup-id – ID of the app backup

For the complete documentation of the API, including several optional parameters that can be included in the HTTP request, see the [Azure Resource Explorer](https://resources.azure.com/).

<a name="backup-on-demand"></a>
## Backup an app on demand
To back up an app immediately, send a **POST** request to **https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Web/sites/{name}/backup/**.

Here is what the URL looks like using our example website. **https://management.azure.com/subscriptions/00001111-2222-3333-4444-555566667777/resourceGroups/Default-Web-WestUS/providers/Microsoft.Web/sites/backuprestoreapiexamples/backup/**

You must supply a JSON object in the body of your request to specify which storage account to use to store the backup. The JSON object must have a property named **storageAccountUrl**, which holds a [SAS URL](../storage/storage-dotnet-shared-access-signature-part-1.md) granting write access to the Azure Storage container that will hold the backup blob. If you want to back up your databases, you must also supply a list containing the names, types, and connection strings of the databases to be backed up.

```
{
    "properties":
    {
        "storageAccountUrl": “https://account.blob.core.windows.net/backups?sv=2015-02-21&sr=c&sig=DzlkBl7h32C8qCv%2BifdBRxE63r4iv0kZ9L7E0qP16sY%3D&se=2016-09-15T22%3A46%3A54Z&sp=rwdl”,
        “databases”: [
            {
                “databaseType”: “SqlAzure”,
                “name”: “MyDatabase1”,
                "connectionString": "<your database connection string>"
            }
        ]
    }
}
```

A backup of the app will begin immediately when the request is received. The backup process may take a long time to complete. The HTTP response will contain an ID that you can use in another request to see the status of the backup. Here is an example of the body of the HTTP response to our backup request.

```
{
    "id": "/subscriptions/00001111-2222-3333-4444-555566667777/resourceGroups/Default-Web-WestUS/providers/Microsoft.Web/sites/backuprestoreapiexamples",
    "name": " backuprestoreapiexamples ",
    "type": "Microsoft.Web/sites",
    "location": "WestUS",
    "properties":    {
        "id": 1,
        "storageAccountUrl": “https://account.blob.core.windows.net/backups?sv=2015-02-21&sr=c&sig=DzlkBl7h32C8qCv%2BifdBRxE63r4iv0kZ9L7E0qP16sY%3D&se=2016-09-15T22%3A46%3A54Z&sp=rwdl”,
        "blobName": “backup_201509291825.zip”,
        "name": "backup_201509291825",
        "status": 4,
        "sizeInBytes": 0,
        "created": "2015-09-29T18:25:26.3992707Z",
        "log": null,
        "databases": [
            {
                "databaseType": "SqlAzure",
                "name": "MyDatabase1",
                "connectionString": "<your database connection string>"
            }
        ],
        "scheduled": false,
        "correlationId": "ea730f4d-dd06-4f7f-a090-9aa09k662h36",
    }
}
```

>[AZURE.NOTE] Error messages can be found in the log property of the HTTP response.

<a name="schedule-automatic-backups"></a>
## Schedule automatic backups
In addition to backing up an app on demand, you can also schedule a backup to happen automatically.

### Set up a new automatic backup schedule
To set up a backup schedule, send a **PUT** request to **https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Web/sites/{name}/config/backup**.

Here is what the URL looks like for our example website. **https://management.azure.com/subscriptions/00001111-2222-3333-4444-555566667777/resourceGroups/Default-Web-WestUS/providers/Microsoft.Web/sites/backuprestoreapiexamples/config/backup**

The request body must have a JSON object that specifies the backup configuration. Here is an example with all of the required parameters.

```
{
    "location": "WestUS",
    "properties": // Represents an app restore request
    {
        "backupSchedule": { // Required for automatically scheduled backups
            "frequencyInterval": "7",
            "frequencyUnit": "Day",
            "keepAtLeastOneBackup": "True",
            "retentionPeriodInDays": "10",
        },
        "enabled": "True", // Must be set to true to enable automatic backups
        "name": “mysitebackup”,
        "storageAccountUrl": "https://account.blob.core.windows.net/backups?sv=2015-02-21&sr=c&sig=DzlkBl7h32C8qCv%2BifdBRxE63r4iv0kZ9L7E0qP16sY%3D&se=2016-09-15T22%3A46%3A54Z&sp=rwdl"
    }
}
```

This example configures the app to be automatically backed up every 7 days. The parameters **frequencyInterval** and **frequencyUnit** together determine how often the backups will happen. Valid values for **frequencyUnit** are **hour** and **day**. For example, to back up an app every 12 hours, set frequencyInterval to 12 and frequencyUnit to hour.

Old backups will automatically be removed from the storage account. You can control how old the backups can be by setting the **retentionPeriodInDays** parameter. If you want to always have at least one backup saved, regardless of how old it is, set **keepAtLeastOneBackup** to true.

### Get the automatic backup schedule
To get an app’s backup configuration, send a **POST** request to the URL **https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Web/sites/{name}/config/backup/list**.

The URL for our example site is **https://management.azure.com/subscriptions/00001111-2222-3333-4444-555566667777/resourceGroups/Default-Web-WestUS/providers/Microsoft.Web/sites/backuprestoreapiexamples/config/backup/list**.

<a name="get-backup-status"></a>
## Get the status of a backup
Depending on how large the app is, a backup may take a while to complete. Backups might also fail, time out, or partially succeed. To see the status of all of an app’s backups, send a **GET** request to the URL **https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Web/sites/{name}/backups**.

To see the status of a specific backup, send a GET request to the URL **https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Web/sites/{name}/backups/{backup-id}**.

Here is what the URL looks like for our example website. **https://management.azure.com/subscriptions/00001111-2222-3333-4444-555566667777/resourceGroups/Default-Web-WestUS/providers/Microsoft.Web/sites/backuprestoreapiexamples/backups/1**

The response body will contain a JSON object similar to this example.

```
{
    "properties":  {
        "id": 1,
        "storageAccountUrl": "https://account.blob.core.windows.net/backups?sv=2015-02-21&sr=c&sig=DzlkBl7h32C8qCv%2BifdBRxE63r4iv0kZ9L7E0qP16sY%3D&se=2016-09-15T22%3A46%3A54Z&sp=rwdl",
        "blobName": "backup_201509291734.zip",
        "name": "backup_201509291734",
        "status": 2,
        "sizeInBytes": 151973,
        "created": "2015-09-29T17:34:57.2091605",
        "scheduled": false,
        "lastRestoreTimeStamp": null,
        "finishedTimeStamp": "2015-09-29T17:35:11.3293602",
        "correlationId": "2379fc13-418a-4b9c-920d-d06e73c5028d",
        "websiteSizeInBytes": 209920
    }
}
```

The status of a backup is an enumerated type. Here is every possible state.

* 0 – InProgress: The backup has been started but has not yet completed.
* 1 – Failed: The backup was unsuccessful.
* 2 – Succeeded: The backup completed successfully.
* 3 – TimedOut: The backup did not finish in time and was cancelled.
* 4 – Created: The backup request is queued but has not been started.
* 5 – Skipped: The backup did not proceed due to a schedule triggering too many backups.
* 6 – PartiallySucceeded: The backup succeeded, but some files were not backed up because they could not be read. This usually happens because an exclusive lock was placed on the files.
* 7 – DeleteInProgress: The backup has been requested to be deleted, but has not yet been deleted.
* 8 – DeleteFailed: The backup could not be deleted. This might happen because the SAS URL that was used to create the backup has expired.
* 9 – Deleted: The backup was deleted successfully.

<a name="restore-app"></a>
## Restore an app from a backup
If your app has been deleted, or if you want to revert your app to a previous version, you can restore the app from a backup. To invoke a restore, send a **POST** request to the URL **https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Web/sites/{name}/backups/{backup-id}/restore**.

Here is what the URL looks like for our example website. **https://management.azure.com/subscriptions/00001111-2222-3333-4444-555566667777/resourceGroups/Default-Web-WestUS/providers/Microsoft.Web/sites/backuprestoreapiexamples/backups/1/restore**

In the request body, send a JSON object that contains the properties for the restore operation. Here is an example containing all required properties:

```
{
    "location": "WestUS",
    "properties":
    {
        "blobName": "backup_201509280431.zip",
        "databases": [ // Not required unless you’re restoring databases
            {
                “databaseType”: “SqlAzure”,
                “name”: “MyDatabase1”
        }],
        "overwrite": "true",
        "storageAccountUrl": "https://account.blob.core.windows.net/backups?sv=2015-02-21&sr=c&sig=DzlkBl7h32C8qCv%2BifdBRxE63r4iv0kZ9L7E0qP16sY%3D&se=2016-09-15T22%3A46%3A54Z&sp=rwdl" // SAS URL to storage container containing your website backup
    }
}
```

### Restore to a new app
Sometimes you might want to create a new app when you restore a backup, instead of overwriting an already existing app. To do this, change the request URL to point to the new app you want to create, and change the **overwrite** property in the JSON to **false**.

<a name="delete-app-backup"></a>
## Delete an app backup
If you would like to delete a backup, send a **DELETE** request to the URL **https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Web/sites/{name}/backups/{backup-id}**.

Here is what the URL looks like for our example website. **https://management.azure.com/subscriptions/00001111-2222-3333-4444-555566667777/resourceGroups/Default-Web-WestUS/providers/Microsoft.Web/sites/backuprestoreapiexamples/backups/1**

<a name="manage-sas-url"></a>
## Manage a backup’s SAS URL
Azure App Service will attempt to delete your backup from Azure Storage using the SAS URL that was provided when the backup was created. If this SAS URL is no longer valid, the backup cannot be deleted through the REST API. However, you can update the SAS URL associated with a backup by sending a **POST** request to the URL **https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Web/sites/{name}/backups/{backup-id}/list**.

Here is what the URL looks like for our example website. **https://management.azure.com/subscriptions/00001111-2222-3333-4444-555566667777/resourceGroups/Default-Web-WestUS/providers/Microsoft.Web/sites/backuprestoreapiexamples/backups/1/list**

In the request body, send a JSON object that contains the new SAS URL. Here is an example.

```
{
    "properties":
    {
        "storageAccountUrl": "https://account.blob.core.windows.net/backups?sv=2015-02-21&sr=c&sig=DzlkBl7h32C8qCv%2BifdBRxE63r4iv0kZ9L7E0qP16sY%3D&se=2016-09-15T22%3A46%3A54Z&sp=rwdl"
    }
}
```

>[AZURE.NOTE] For security reasons, the SAS URL associated with a backup is not returned when sending a GET request for a specific backup. If you want to view the SAS URL associated with a backup, send a POST request to the same URL above, and just include an empty JSON object in the request body. The response from the sever will contain all of that backup’s information, including its SAS URL.

<!-- IMAGES -->
[SampleWebsiteInformation]: ./media/websites-csm-backup/01siteconfig.png
