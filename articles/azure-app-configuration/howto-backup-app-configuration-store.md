---
title: Automatically backup key values from Azure App Configuration store
description: Learn to set up automatic backup of key values from Azure App Configuration store
services: azure-app-configuration
author: avanigupta
ms.assetid: 
ms.service: azure-app-configuration
ms.devlang: csharp
ms.topic: how-to
ms.date: 04/27/2020
ms.author: avgupta


#Customer intent: I want to backup all key-values to a secondary App Configuration store and keep them up to date with any changes in the primary store.
---

# Automatically backup key values from Azure App Configuration store

In this article, you will learn how to set up automatic backup of key values from one Azure App Configuration store to another.
Azure App Configuration users can subscribe to events emitted whenever key-values are modified or deleted. These events can trigger any event handler that is supported by Azure Event Grid. Typically, you send events to an endpoint that processes the event data and takes actions. 

In this tutorial, we are going to send Azure App Configuration events to an Azure Storage Queue, which will be batch processed at a later time by a timer-triggered Azure Function. The Azure Function will consume these events to fetch the latest key values from primary App Configuration store and update or delete them from the secondary App Configuration store.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/). You can optionally use the Azure Cloud Shell.
- [Visual Studio 2019](https://visualstudio.microsoft.com/vs) with the Azure development workload.
- Download and install the [.NET Core SDK](https://dotnet.microsoft.com/download).


[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you're running the latest version of Azure CLI (2.3.1 or later). To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

If you aren't using Cloud Shell, you must first sign in using `az login`.

## Create a resource group

The resource group is a logical collection into which Azure resources are deployed and managed.

Create a resource group with the [az group create](/cli/azure/group) command.

The following example creates a resource group named `<resource_group_name>` in the *westus* location.  Replace `<resource_group_name>` with a unique name for your resource group.

```azurecli-interactive
resourceGroupName="<resource_group_name>"
az group create --name $resourceGroupName --location westus
```

## Create App Configuration stores

Create two app configuration stores, primary and secondary store, preferably in different regions to achieve resilience to regional failures.
Replace `<primary_appconfig_name>` and `<secondary_appconfig_name>` with unique names for your configuration stores. The store name must be unique because it's used as a DNS name.

```azurecli-interactive
primaryAppConfigName="<primary_appconfig_name>"
secondaryAppConfigName="<secondary_appconfig_name>"
az appconfig create \
  --name $primaryAppConfigName \
  --location westus \
  --resource-group $resourceGroupName\
  --sku standard

az appconfig create \
  --name $secondaryAppConfigName \
  --location centralus \
  --resource-group $resourceGroupName\
  --sku standard
```

[!INCLUDE [event-grid-register-provider-cli.md](../../includes/event-grid-register-provider-cli.md)]

## Create Azure Storage Queue

Create a storage account and a storage queue for collecting the events published by Event Grid.

```azurecli-interactive
storageName="<unique_storage_name>"
queueName="<queue_name>"
az storage account create -n $storageName -g $resourceGroupName -l centralus --sku Standard_LRS
az storage queue create --name $queueName --account-name $storageName --auth-mode login
```

## Subscribe to your App Configuration store

You subscribe to a topic to tell Event Grid which events you want to track and where to send those events. Subscribe to these two events from Azure App Configuration:

- Microsoft.AppConfiguration.KeyValueModified
- Microsoft.AppConfiguration.KeyValueDeleted

The following script subscribes to these two events from primary App Configuration store, sets the endpoint type to `storagequeue` and uses queue ID as the endpoint. Replace `<event_subscription_name>` with a name for your event subscription.

```azurecli-interactive
storageId=$(az storage account show --name $storageName --resource-group  $resourceGroupName --query id --output tsv)
queueId="$storageId/queueservices/default/queues/$queueName"
appconfigId=$(az appconfig show --name $primaryAppConfigName --resource-group $resourceGroupName --query id --output tsv)
eventSubscriptionName="<event_subscription_name>"
az eventgrid event-subscription create \
  --source-resource-id $appconfigId \
  --name $eventSubscriptionName \
  --endpoint-type storagequeue \
  --endpoint $queueId \
  --included-event-types Microsoft.AppConfiguration.KeyValueModified Microsoft.AppConfiguration.KeyValueDeleted 
```

## Create Azure Function for handling events from Storage Queue

We need to create a function which will update the secondary store with any key value changes in the primary store. You can leverage the Azure App Configuration SDK to read updated key values from the primary store and write them to the secondary store. 

In this tutorial, we are working with a C# Azure Function which has the following properties:
- Runtime stack .NET Core 3.1
- Azure Functions runtime version 3.x
- Function triggered by timer

To learn more about creating Azure Functions, see: [Create a function in Azure that is triggered by a timer](/azure/azure-functions/functions-create-scheduled-function) and [Develop Azure Functions using Visual Studio](/azure/azure-functions/functions-develop-vs).

For a quickstart, you can download the project files for a sample function and publish it to your own Azure Function App:
- [Azure Function sample code](https://github.com/Azure/AppConfiguration/tree/master/examples/ConfigurationStoreBackup)
- Learn how to [publish to Azure from Visual Studio](/azure/azure-functions/functions-develop-vs#publish-to-azure)

> [!IMPORTANT]
> The sample Azure Function will run every 10 minutes. Use your best judgement to adjust this schedule based on how frequently you make changes to your primary config store. Remember, running the function too frequently could end up throttling requests for your store.
>

> [!NOTE]
> In this code sample, we have used `ConfigurationStoreBackup` as the Azure Function App name and `BackupAppConfigurationStore` as the Azure Function name. 

## Update Azure Function App settings

We recommend storing the following settings in the App Settings of your Azure Function app:
- `PrimaryStoreEndpoint`: Endpoint for the primary App Configuration store. For example, `https://{primary_appconfig_name}.azconfig.io`
- `SecondaryStoreEndpoint`: Endpoint for the secondary App Configuration store. For example, `https://{secondary_appconfig_name}.azconfig.io`
- `StorageQueueUri`: Storage queue URI. For example, `https://{unique_storage_name}.queue.core.windows.net/{queue_name}`

```azurecli-interactive
primaryStoreEndpoint="https://$primaryAppConfigName.azconfig.io"
secondaryStoreEndpoint="https://$secondaryAppConfigName.azconfig.io"
storageQueueUri="https://$storageName.queue.core.windows.net/$queueName"
az functionapp config appsettings set --name ConfigurationStoreBackup --resource-group $resourceGroupName --settings StorageQueueUri=$storageQueueUri PrimaryStoreEndpoint=$primaryStoreEndpoint SecondaryStoreEndpoint=$secondaryStoreEndpoint
```

> [!IMPORTANT]
> The sample Azure Function will crash if any of the app settings above are missing or in invalid format.
>

## Integrate with Azure Managed Identities

Create a system-assigned managed identity for your Azure Function app. For more information, see [Add a system-assigned identity](/azure/app-service/overview-managed-identity?tabs=dotnet#add-a-system-assigned-identity).

```azurecli-interactive
az functionapp identity assign --name ConfigurationStoreBackup --resource-group $resourceGroupName
```

Grant access to primary and secondary App Configuration stores by following instructions here: [Grant access to App Configuration](/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity?tabs=core3x#grant-access-to-app-configuration). 
- Primary store should grant `App Configuration Data Reader` access to your Function App.
- Secondary store should grant `App Configuration Data Owner` access to your Function App.

Repeat the process for granting access to the storage queue by following instructions here: [Assign RBAC roles using the Azure portal](/azure/storage/common/storage-auth-aad-rbac-portal#assign-rbac-roles-using-the-azure-portal).
- Assign `Storage Queue Data Contributor` role to your Function App.

## Trigger an App Configuration event

To test that everything works, you can create/update/delete a key value from primary store. You should automatically see this change in the backup store a few seconds after your Azure Function is triggered by the timer.

```azurecli-interactive
az appconfig kv set --name $primaryAppConfigName --key Foo --value Bar --yes
```

You've triggered the event, and in a few moments Event Grid will send the event notification to your Azure Storage Queue. ***After the next scheduled run of your Azure Function***, view configuration settings in your secondary store to see if it contains the updated key value from primary store.

Alternatively, you can manually trigger your Azure Function to start the backup process if you don't want to wait for the scheduled trigger. Learn how to [manually run a non HTTP-triggered function](/azure/azure-functions/functions-manually-run-non-http). 

After making sure that the backup function ran successfully, you can see that the key is now present in your secondary store.

```azurecli-interactive
az appconfig kv show --name $secondaryAppConfigName --key Foo
```

```json
{
  "contentType": null,
  "etag": "eVgJugUUuopXnbCxg0dB63PDEJY",
  "key": "Foo",
  "label": null,
  "lastModified": "2020-04-27T23:25:08+00:00",
  "locked": false,
  "tags": {},
  "value": "Bar"
}
```

> [!NOTE]
> If you don't see the new setting in your secondary store even after making sure the backup function was triggered ***after*** creating the setting in your primary store, it's possible that Event Grid was not able to send the event notification to your storage queue in time. Trigger the backup function again if your storage queue still contains the event notification from your primary store.


## Clean up resources
If you plan to continue working with this App Configuration and event subscription, do not clean up the resources created in this article. If you do not plan to continue, use the following command to delete the resources you created in this article.

```azurecli-interactive
az group delete --name $resourceGroupName
```

## Next steps

Now that you know how to set up automatic backup of your key values, learn more about how you can increase the geo-resiliency of your application:

- [Resiliency and disaster recovery](concept-disaster-recovery.md)
