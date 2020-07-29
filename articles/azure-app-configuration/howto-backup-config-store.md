---
title: Automatically backup key values from Azure App Configuration store
description: Learn how to set up an automatic backup of key values between App Configuration stores
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

# Backup App Configuration stores automatically

In this article, you will learn how to set up an automatic backup of key values from a primary App Configuration store to a secondary store. It leverages the integration of Azure Event Grid with App Configuration. Once set up, App Configuration will publish events to Event Grid for any changes made to key-values in a configuration store. Event Grid supports a variety of Azure services from which users can subscribe to the events emitted whenever key-values are created, updated, or deleted.

## Overview

In this tutorial, you will use an Azure Storage Queue to receive events from Event Grid and use a timer-trigger of Azure Functions to process events in the Storage Queue in batches. When triggered, based on the events, the function will fetch the latest values of the keys that have changed from the primary App Configuration store and update the secondary store accordingly. This setup helps to combine multiple changes occurring in a short period in one backup operation and avoid excessive requests made to your App Configuration stores.

![App Configuration store backup architecture](./media/config-store-backup-architecture.png)

## Resource Provisioning

The motivation behind backing up App Configuration stores is to use multiple configuration stores across different Azure regions to increase the geo-resiliency of your application. To achieve this, your primary and secondary stores should be in different Azure regions. All other resources created in this tutorial can be provisioned in any region of your choice. This is because if primary region is down, there will be nothing new to backup until primary region is accessible again.

In this tutorial, you will be creating secondary store in `centralus` region and all other resources in `westus` region.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/). You can optionally use the Azure Cloud Shell.
- [Visual Studio 2019](https://visualstudio.microsoft.com/vs) with the Azure development workload.
- Download and install the [.NET Core SDK](https://dotnet.microsoft.com/download).
- Latest version of Azure CLI (2.3.1 or later). To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). If you are using Azure CLI, you must first sign in using `az login`. You can optionally use the Azure Cloud Shell.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Create a resource group

The resource group is a logical collection into which Azure resources are deployed and managed.

Create a resource group with the [az group create](/cli/azure/group) command.

The following example creates a resource group named `<resource_group_name>` in the `westus` location.  Replace `<resource_group_name>` with a unique name for your resource group.

```azurecli-interactive
resourceGroupName="<resource_group_name>"
az group create --name $resourceGroupName --location westus
```

## Create App Configuration stores

Create your primary and secondary App Configuration stores in different regions.
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

## Create Azure Storage Queue

Create a storage account and a storage queue for receiving the events published by Event Grid.

```azurecli-interactive
storageName="<unique_storage_name>"
queueName="<queue_name>"
az storage account create -n $storageName -g $resourceGroupName -l westus --sku Standard_LRS
az storage queue create --name $queueName --account-name $storageName --auth-mode login
```

[!INCLUDE [event-grid-register-provider-cli.md](../../includes/event-grid-register-provider-cli.md)]

## Subscribe to your App Configuration store events

You subscribe to these two events from the primary App Configuration store:

- `Microsoft.AppConfiguration.KeyValueModified`
- `Microsoft.AppConfiguration.KeyValueDeleted`

The following command creates an Event Grid subscription for the two events sent to your Storage Queue, where the endpoint type is set to `storagequeue` and the endpoint is set to the queue ID. Replace `<event_subscription_name>` with the name of your choice for the event subscription.

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

## Create Azure Functions for handling events from Storage Queue

### Setup with ready-to-use Azure Functions

In this tutorial, you will be working with C# Azure Functions with the following properties:
- Runtime stack .NET Core 3.1
- Azure Functions runtime version 3.x
- Function triggered by timer every 10 minutes

To make it easier for you to start backing up your data, we have tested and published [Azure Functions](https://github.com/Azure/AppConfiguration/tree/master/examples/ConfigurationStoreBackup) that you can use without making any changes to the code. Download the project files and [publish it to your own Azure Function App from Visual Studio.](/azure/azure-functions/functions-develop-vs#publish-to-azure)

> [!IMPORTANT]
> Do not make any changes to the environment variables in the code you have downloaded. You will be creating the required app settings in the next section.
>

### Build your own Azure Functions

If the sample code provided above does not meet your requirements, you can also create your own Azure Functions. Your function must be able to perform the following tasks in order to complete the backup:
- Periodically read contents of your storage queue to see if it contains any notifications from Event Grid. Refer to the [Storage Queue SDK](/azure/storage/queues/storage-quickstart-queues-dotnet) for implementation details.
- If your storage queue contains [event notifications from Event Grid](/azure/azure-app-configuration/concept-app-configuration-event?branch=pr-en-us-112982#event-schema), extract all the unique <key, label> from event messages. Key and label combination is the unique identifier for key-value changes in primary store.
- Read all settings from primary store. Update only those settings in secondary store that have a corresponding event in the storage queue. Delete all settings from secondary store that were present in storage queue but not in primary store. You can leverage the [App Configuration SDK](https://github.com/Azure/AppConfiguration#sdks) to access your configuration stores programmatically.
- Delete messages from the storage queue if there were no exceptions during processing.
- Make sure to implement error handling according to your needs. You can refer to the code sample above to see some common exceptions that you may want to handle.

To learn more about creating Azure Functions, see: [Create a function in Azure that is triggered by a timer](/azure/azure-functions/functions-create-scheduled-function) and [Develop Azure Functions using Visual Studio](/azure/azure-functions/functions-develop-vs).


> [!IMPORTANT]
> Use your best judgement to choose the timer schedule based on how frequently you make changes to your primary config store. Remember, running the function too frequently could end up throttling requests for your store.
>


## Create Azure Function App settings

If you are using the Azure Functions we have provided, you need the following app settings in your Azure Function App:
- `PrimaryStoreEndpoint`: Endpoint for the primary App Configuration store. For example, `https://{primary_appconfig_name}.azconfig.io`
- `SecondaryStoreEndpoint`: Endpoint for the secondary App Configuration store. For example, `https://{secondary_appconfig_name}.azconfig.io`
- `StorageQueueUri`: Storage Queue URI. For example, `https://{unique_storage_name}.queue.core.windows.net/{queue_name}`

The following command creates the required app settings in your Azure Function App. Replace `<function_app_name>` with the name of your Azure Function App.

```azurecli-interactive
functionAppName="<function_app_name>"
primaryStoreEndpoint="https://$primaryAppConfigName.azconfig.io"
secondaryStoreEndpoint="https://$secondaryAppConfigName.azconfig.io"
storageQueueUri="https://$storageName.queue.core.windows.net/$queueName"
az functionapp config appsettings set --name $functionAppName --resource-group $resourceGroupName --settings StorageQueueUri=$storageQueueUri PrimaryStoreEndpoint=$primaryStoreEndpoint SecondaryStoreEndpoint=$secondaryStoreEndpoint
```


## Grant access to the managed identity of Azure Function App

Use the following command or [Azure portal](/azure/app-service/overview-managed-identity#add-a-system-assigned-identity) to add a system-assigned managed identity for your Azure Function App.

```azurecli-interactive
az functionapp identity assign --name $functionAppName --resource-group $resourceGroupName
```

> [!NOTE]
> To perform the required resource creation and role management, your account needs `'Owner'` permissions at the appropriate scope (your subscription or resource group). If you need assistance with role assignment, learn [how to add or remove Azure role assignments using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

Use the following commands or [Azure portal](/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity#grant-access-to-app-configuration) to grant the managed identity of your Azure Function App access to your App Configuration stores.
- Assign `App Configuration Data Reader` role in the primary App Configuration store.
- Assign `App Configuration Data Owner` role in the secondary App Configuration store.

```azurecli-interactive
functionPrincipalId=$(az functionapp identity show --name $functionAppName --resource-group  $resourceGroupName --query principalId --output tsv)
primaryAppConfigId=$(az appconfig show -n $primaryAppConfigName --query id --output tsv)
secondaryAppConfigId=$(az appconfig show -n $secondaryAppConfigName --query id --output tsv)

az role assignment create \
    --role "App Configuration Data Reader" \
    --assignee $functionPrincipalId \
    --scope $primaryAppConfigId

az role assignment create \
    --role "App Configuration Data Owner" \
    --assignee $functionPrincipalId \
    --scope $secondaryAppConfigId
```

Use the following command or [Azure portal](/azure/storage/common/storage-auth-aad-rbac-portal#assign-rbac-roles-using-the-azure-portal) to grant the managed identity of your Azure Function App access to your Storage Queue. 
- Assign `Storage Queue Data Contributor` role in the Storage Queue.

```azurecli-interactive
az role assignment create \
    --role "Storage Queue Data Contributor" \
    --assignee $functionPrincipalId \
    --scope $queueId
```

## Trigger an App Configuration event

To test that everything works, you can create/update/delete a key value from primary store. You should automatically see this change in the secondary store a few seconds after Azure Functions is triggered by the timer.

```azurecli-interactive
az appconfig kv set --name $primaryAppConfigName --key Foo --value Bar --yes
```

You've triggered the event, and in a few moments Event Grid will send the event notification to your Azure Storage Queue. ***After the next scheduled run of your Azure Functions***, view configuration settings in your secondary store to see if it contains the updated key value from primary store.

> [!NOTE]
> You can [trigger your Azure Functions manually](/azure/azure-functions/functions-manually-run-non-http) during the testing and troubleshooting without waiting for the scheduled timer-trigger.

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

## Troubleshooting

If you don't see the new setting in your secondary store:

- Make sure the backup function was triggered ***after*** you created the setting in your primary store.
- It's possible that Event Grid was not able to send the event notification to the storage queue in time. Check if your storage queue still contains the event notification from your primary store, and if it does, trigger the backup function again.
- Check [Azure Functions logs](/azure/azure-functions/functions-create-scheduled-function#test-the-function) for any errors or warnings.
- Use [Azure portal](/azure/azure-functions/functions-how-to-use-azure-function-app-settings#get-started-in-the-azure-portal) to ensure that the Azure Function App contains correct values for the Application Settings that your Azure Functions is trying to read.
- You can also set up monitoring and alerting for your Azure Functions using [Azure Application Insights.](/azure/azure-functions/functions-monitoring?tabs=cmd) 


## Clean up resources
If you plan to continue working with this App Configuration and event subscription, do not clean up the resources created in this article. If you do not plan to continue, use the following command to delete the resources you created in this article.

```azurecli-interactive
az group delete --name $resourceGroupName
```

## Next steps

Now that you know how to set up automatic backup of your key values, learn more about how you can increase the geo-resiliency of your application:

- [Resiliency and disaster recovery](concept-disaster-recovery.md)
