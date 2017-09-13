---
title: Azure Cosmos DB Logging | Microsoft Docs
description: Use this tutorial to help you get started with Azure Cosmos DB logging.
services: cosmos-db
documentationcenter: ''
author: mimig1
manager: jhubbard
tags: azure-resource-manager

ms.assetid: 
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/12/2017
ms.author: mimig

---
# Azure Cosmos DB logging

Once you've started using one or more Azure Cosmos DB databases, you will likely want to monitor how and when your databases are accessed, and by whom. You can monitor your databases by enabling diagnostic logging for Azure Cosmos DB, and collecting those logs in an Azure Storage account, streaming them to EventHubs, and/or exporting them into an OMS workspace.

Use this tutorial to get started with Azure Cosmos DB logging via the Azure portal, PowerShell, or CLI.  

## What is logged?

* All authenticated REST API requests are logged, which includes failed requests as a result of access permissions, system errors or bad requests.
* Operations on the database itself, which includes CRUD operations on all documents, containers, and databases.
* Operations on account keys, which include creating, modifying, or deleting these keys; operations such as sign, verify, encrypt, decrypt, wrap and unwrap keys, get secrets, list keys and secrets and their versions.
* Unauthenticated requests that result in a 401 response. For example, requests that do not have a bearer token, or are malformed or expired, or have an invalid token.  

## Prerequisites
To complete this tutorial, you must have the following resources:

* An existing Azure Cosmos DB account, database, and container. For instructions on creating these, see [Create a database account using the Azure portal](create-documentdb-dotnet.md#create-a-database-account), [CLI samples](cli-samples.md), or [PowerShell samples](powershell-samples.md).


## Turn on logging in the Azure portal

1. In the Azure portal, in your Azure Cosmos DB account, click **Diagnostic logs** in the left navigation, and then click **Turn on diagnostics**.

    ![Turn on diagnostic logging for Azure Cosmos DB in the Azure portal](./media/logging/turn-on-portal-logging.png)

2. In the **Diagnostic settings** page, do the following: 

    * **Name**. Enter a name for the logs to create.

    * **Archive to a storage account**. To use this option, you need an existing storage account to connect to. To create a new storage account in the portal, see [Create a storage account](../storage/storage-create-storage-account.md#create-a-storage-account) and follow instructions to create a resource manager, general purpose account. Then return to this page in the portal to select your storage account. It may take a few minutes for newly created storage accounts to appear in the drop down menu.
    * **Stream to an event hub**. To use this option, you need an existing Event Hub namespace and event hub to connect to. To create an Event Hubs namespace, see [Create an Event Hubs namespace and an event hub using the Azure portal](../event-hubs/event-hubs-create.md). Then return to this page in the portal to select the Event Hub namespace and policy name.
    * **Send to Log Analytics**. To use this option, either use one of the existing workspaces or create a new OMS workspace by following the prompts in the portal.
    * **Log DataPlaneRequests**. If you are archiving to a storage account, you can select the retention period for the diagnostic logs by selecting **DataPlaneRequests** and choosing the number of days to retain logs. Logs are autodeleted after the retention period expires. 

3. Click **Save**.

    You can return to this page at anytime to modify the diagnostic log settings for your account.

## Turn on logging using CLI

Information to be provided.

## Turn on logging using PowerShell

To turn on logging using PowerShell, you need Azure Powershell, with a minimum version of 1.0.1.

To install Azure PowerShell and associate it with your Azure subscription, see [How to install and configure Azure PowerShell](/powershell/azure/overview).

If you have already installed Azure PowerShell and do not know the version, from the PowerShell console, type `(Get-Module azure -ListAvailable).Version`.  

### <a id="connect"></a>Connect to your subscriptions
Start an Azure PowerShell session and sign in to your Azure account with the following command:  

```powershell
Login-AzureRmAccount
```

In the pop-up browser window, enter your Azure account user name and password. Azure PowerShell gets all the subscriptions that are associated with this account and by default, uses the first one.

If you have multiple subscriptions, you might have to specify a specific one that was used to create your Azure Key Vault. Type the following to see the subscriptions for your account:

```powershell
Get-AzureRmSubscription
```

Then, to specify the subscription that's associated with the Azure Cosmos DB account you are logging, type:

    Set-AzureRmContext -SubscriptionId <subscription ID>

> [!NOTE]
> It is important to specify the subscription if you have multiple subscriptions associated with your account.
>   
>

For more information about configuring Azure PowerShell, see [How to install and configure Azure PowerShell](/powershell/azure/overview).

### <a id="storage"></a>Create a new storage account for your logs
Although you can use an existing storage account for your logs, in this tutorial we create a new storage account dedicated to Azure Cosmos DB logs. For convenience, we are storing the storage account details into a variable named **sa**.

For additional ease of management, in this tutorial we use the same resource group as the one that contains our Azure Cosmos DB database. Substitute values for ContosoResourceGroup, contosocosmosdblogs, and 'North Central US' for your own values, as applicable:

    $sa = New-AzureRmStorageAccount -ResourceGroupName ContosoResourceGroup `
    -Name contosocosmosdblogs -Type Standard_LRS -Location 'North Central US'


> [!NOTE]
> If you decide to use an existing storage account, it must use the same subscription as your Azure Cosmos DB subscription and it must use the Resource Manager deployment model, rather than the Classic deployment model.
>
>

### <a id="identify"></a>Identify the Azure Cosmos DB account for your logs
Set the Cosmos DB account name to a variable named **account**:

    $account = Get-AzureRmResource -ResourceGroupName ContosoResourceGroup`
     -ResourceName contosocosmosdb -ResourceType "Microsoft.DocumentDb/databaseAccounts"


### <a id="enable"></a>Enable logging
To enable logging for Azure Cosmos DB, use the Set-AzureRmDiagnosticSetting cmdlet, together with the variables for our new storage account and our Azure Cosmos DB account. Run the following command, setting the **-Enabled** flag to **$true**:

   Set-AzureRmDiagnosticSetting  -ResourceId $account.ResourceId -StorageAccountId $sa.Id -Enabled $true -Categories DataPlaneRequests

The output for this includes:

    StorageAccountId : /subscriptions/<subscription-ID>/resourceGroups/ContosoResourceGroup/providers/Microsoft.S
                       torage/storageAccounts/contosocosmosdblogs
    ServiceBusRuleId :
    Metrics          : {}
    Logs             : {Microsoft.Azure.Management.Insights.Models.LogSettings}
    WorkspaceId      : /subscriptions/<subscription-ID>/resourcegroups/HealthService/providers/Microsoft
                       .OperationalInsights/workspaces/shoeboxtest
    Id               : /subscriptions/<subscription-ID>/resourcegroups/ContosoResourceGroup/providers/microsoft.d
                       ocumentdb/databaseaccounts/contosocosmosdb/providers/microsoft.insights/diagnosticSettings/service
    Name             : service
    Type             :
    Location         :
    Tags             :

This confirms that logging is now enabled for your database, saving information to your storage account.

Optionally you can also set retention policy for your logs such that older logs will be automatically deleted. For example, set retention policy using **-RetentionEnabled** flag to **$true** and set **-RetentionInDays** parameter to **90** so that logs older than 90 days will be automatically deleted.

    Set-AzureRmDiagnosticSetting -ResourceId $account.ResourceId`
     -StorageAccountId $sa.Id -Enabled $true -Categories DataPlaneRequests`
      -RetentionEnabled $true -RetentionInDays 90

### <a id="access"></a>Access your logs
Azure Cosmos DB logs are stored in the **data-plane-requets** container in the storage account you provided. 

First, create a variable for the container name. This will be used throughout the rest of the walk-through.

    $container = 'insights-logs-dataplanerequests'

To list all the blobs in this container, type:

    Get-AzureStorageBlob -Container $container -Context $sa.Context

The output will look something similar to this:

    ICloudBlob        : Microsoft.WindowsAzure.Storage.Blob.CloudBlockBlob
    BlobType          : BlockBlob
    Length            : 10510193
    ContentType       : application/octet-stream
    LastModified      : 6/28/2017 7:49:04 PM +00:00
    SnapshotTime      :
    ContinuationToken :
    Context           : Microsoft.WindowsAzure.Commands.Common.Storage.`
                        LazyAzureStorageContext
    Name              : resourceId=contosocosmosdb/y=2017/m=06/d=28/h=19/`
                        m=00/PT1H.json

As you can see from this output, the blobs follow a naming convention: **resourceId=<Database Account Name>/y=<year>/m=<month>/d=<day of month>/h=<hour>/m=<minute>/filename.json**

The date and time values use UTC.

Because the same storage account can be used to collect logs for multiple resources, the full resource ID in the blob name is very useful to access or download just the blobs that you need. But before we do that, we'll first cover how to download all the blobs.

First, create a folder to download the blobs. For example:

    New-Item -Path 'C:\Users\username\ContosoCosmosDBLogs'`
     -ItemType Directory -Force

Then get a list of all blobs:  

    $blobs = Get-AzureStorageBlob -Container $container -Context $sa.Context

Pipe this list through 'Get-AzureStorageBlobContent' to download the blobs into our destination folder:

    $blobs | Get-AzureStorageBlobContent`
     -Destination 'C:\Users\username\ContosoCosmosDBLogs'

When you run this second command, the **/** delimiter in the blob names creates a full folder structure under the destination folder, and this structure will be used to download and store the blobs as files.

To selectively download blobs, use wildcards. For example:

* If you have multiple databases and want to download logs for just one database, named CONTOSOCOSMOSDB3:

        Get-AzureStorageBlob -Container $container`
         -Context $sa.Context -Blob '*/VAULTS/CONTOSOCOSMOSDB3
* If you have multiple resource groups and want to download logs for just one resource group,`
         use -Blob '*/RESOURCEGROUPS/<resource group name>/*'`:

        Get-AzureStorageBlob -Container $container`
         -Context $sa.Context -Blob '*/RESOURCEGROUPS/CONTOSORESOURCEGROUP3/*'
* If you want to download all the logs for the month of July 2017, use `-Blob '*/year=2017/m=07/*'`:

        Get-AzureStorageBlob -Container $container`
         -Context $sa.Context -Blob '*/year=2017/m=07/*'

You're now ready to start looking at what's in the logs. But before moving onto that, two more parameters for Get-AzureRmDiagnosticSetting that you might need to know:

* To query the  status of diagnostic settings for your database resource: `Get-AzureRmDiagnosticSetting -ResourceId $account.ResourceId`
* To disable logging for your database vault resource: `Set-AzureRmDiagnosticSetting -ResourceId $account.ResourceId -StorageAccountId $sa.Id -Enabled $false -Categories DataPlaneRequests`

## <a id="interpret"></a>Interpret your Azure Cosmos DB logs
Individual blobs are stored as text, formatted as a JSON blob. This is an example log entry:

    {
        "records":
        [
            {
               "time": "Fri, 23 Jun 2017 19:29:50.266 GMT",
			   "resourceId": "contosocosmosdb",
			   "category": "DataPlaneRequests",
			   "operationName": "Query",
			   "resourceType": "Database",
			   "properties": {"activityId": "05fcf607-6f64-48fe-81a5-f13ac13dd1eb",`
               "userAgent": "documentdb-dotnet-sdk/1.12.0 Host/64-bit MicrosoftWindowsNT/6.2.9200.0 AzureSearchIndexer/1.0.0",`
               "resourceType": "Database","statusCode": "200","documentResourceId": "",`
               "clientIpAddress": "13.92.241.0","requestCharge": "2.260","collectionRid": "",`
               "duration": "9250","requestLength": "72","responseLength": "209"}
            }
        ]
    }


The following table lists the field names and descriptions.

| Field name | Description |
| --- | --- |
| time |The date and time (UTC) when the operation occured. |
| resourceId |The Azure Cosmos DB account for which logs are enabled.|
| category |For Azure Cosmos DB logs, DataPlaneRequests is the only available value. |
| operationName |Name of the operation. This can be any of the following operations: Create, Update, Read, ReadFeed, Delete, Replace, Execute, SqlQuery, Query, JSQuery, Head, HeadFeed, or Upsert.   |
| properties |The contents of this field are described in the table below. |

The following table lists the fields logged inside the properties field.

| Property field name | Description |
| --- | --- |
| activityId | The unique GUID for the logged operation. |
| userAgent |A string that specifies the client user agent performing the request. The format is {user agent name}/{version}.|
| resourceType | The type of the resource accessed, this can be any of the following resource types: Database, Collection, Document, Attachment, User, Permission, StoredProcedure, Trigger, UserDefinedFunction, or Offer. |
| statusCode |The response status of the operation. |
| documentResourceId | The unique ID for the document.|
| clientIpAddress |The client's IP address. |
| requestCharge | The number of RUs used by the operation |
| collectionRid | The unique ID for the collection.|
| duration | The duration of operation, in ticks. |
| requestLength |The length of the request, in bytes. |
| responseLength | The length of the response, in bytes.|

## Managing your logs

Logs are made available in your account two hours from the time the Azure Cosmos DB operation was made. It's up to you to manage your logs in your storage account:

* Use standard Azure access control methods to secure your logs by restricting who can access them.
* Delete logs that you no longer want to keep in your storage account.
* The retention period for data plane requests archived to a 
Storage account is configured in the portal when **Log DataPlaneRequests** is selected. See [Turn on logging in the Azure portal](#turn-on-logging-in-the-azure-portal) to change that setting. Retention for Event hub and Log Analytics is set...?(where?)

