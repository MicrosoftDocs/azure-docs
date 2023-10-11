---
title: Storage considerations for Azure Functions
description: Learn about the storage requirements of Azure Functions and about encrypting stored data. 
ms.topic: conceptual
ms.date: 06/13/2023
---

# Storage considerations for Azure Functions

Azure Functions requires an Azure Storage account when you create a function app instance. The following storage services may be used by your function app:

|Storage service  | Functions usage  |
|---------|---------|
| [Azure Blob Storage](../storage/blobs/storage-blobs-introduction.md)     | Maintain bindings state and function keys<sup>1</sup>.  <br/>Used by default for [task hubs in Durable Functions](durable/durable-functions-task-hubs.md). <br/>May be used to store function app code for [Linux Consumption remote build](functions-deployment-technologies.md#remote-build) or as part of [external package URL deployments](functions-deployment-technologies.md#external-package-url). |
| [Azure Files](../storage/files/storage-files-introduction.md)<sup>2</sup>  | File share used to store and run your function app code in a [Consumption Plan](consumption-plan.md) and [Premium Plan](functions-premium-plan.md). <br/> |
| [Azure Queue Storage](../storage/queues/storage-queues-introduction.md)     | Used by default for [task hubs in Durable Functions](durable/durable-functions-task-hubs.md). Used for failure and retry handling in [specific Azure Functions triggers](./functions-bindings-storage-blob-trigger.md). Used for object tracking by the [Blob Storage trigger](functions-bindings-storage-blob-trigger.md). |
| [Azure Table Storage](../storage/tables/table-storage-overview.md)  |  Used by default for [task hubs in Durable Functions](durable/durable-functions-task-hubs.md).       |

<sup>1</sup> Blob storage is the default store for function keys, but you can [configure an alternate store](./security-concepts.md#secret-repositories).

<sup>2</sup> Azure Files is set up by default, but you can [create an app without Azure Files](#create-an-app-without-azure-files) under certain conditions.

## Important considerations

You must strongly consider the following facts regarding the storage accounts used by your function apps:

+ When your function app is hosted on the Consumption plan or Premium plan, your function code and configuration files are stored in Azure Files in the linked storage account. When you delete this storage account, the content is deleted and can't be recovered. For more information, see [Storage account was deleted](functions-recover-storage-account.md#storage-account-was-deleted)

+ Important data, such as function code, [access keys](functions-bindings-http-webhook-trigger.md#authorization-keys), and other important service-related data, may be persisted in the storage account. You must carefully manage access to the storage accounts used by function apps in the following ways: 

    + Audit and limit the access of apps and users to the storage account based on a least-privilege model. Permissions to the storage account can come from [data actions in the assigned role](../role-based-access-control/role-definitions.md#control-and-data-actions) or through permission to perform the [listKeys operation].

    + Monitor both control plane activity (such as retrieving keys) and data plane operations (such as writing to a blob) in your storage account. Consider maintaining storage logs in a location other than Azure Storage. For more information, see [Storage logs](#storage-logs). 

## Storage account requirements

Storage accounts created as part of the function app create flow in the Azure portal are guaranteed to work with the new function app. In the portal, unsupported accounts are filtered out when choosing an existing storage account while creating a function app. You can also use an existing storage account with your function app. The following restrictions apply to storage accounts used by your function app, so you must make sure an existing storage account meets these requirements: 

+ The account type must support Blob, Queue, and Table storage. Some storage accounts don't support queues and tables. These accounts include blob-only storage accounts and Azure Premium Storage. To learn more about storage account types, see [Storage account overview](../storage/common/storage-account-overview.md).

+ Storage accounts already secured by using firewalls or virtual private networks can't be used in the portal creation flow. For more information, see [Restrict your storage account to a virtual network](configure-networking-how-to.md#restrict-your-storage-account-to-a-virtual-network).

+ When creating your function app in the portal, you're only allowed to choose an existing storage account in the same region as the function app you're creating. This is a performance optimization and not a strict limitation. To learn more, see [Storage account location](#storage-account-location).

+ When creating your function app on a plan with [availability zone support](../reliability/reliability-functions.md#availability-zone-support) enabled, only [zone-redundant storage accounts](../storage/common/storage-redundancy.md#zone-redundant-storage) are supported.

## Storage account guidance

Every function app requires a storage account to operate. When that account is deleted, your function app won't run. To troubleshoot storage-related issues, see [How to troubleshoot storage-related issues](functions-recover-storage-account.md). The following other considerations apply to the Storage account used by function apps.

### Storage account location

For best performance, your function app should use a storage account in the same region, which reduces latency. The Azure portal enforces this best practice. If for some reason you need to use a storage account in a region different than your function app, you must create your function app outside of the portal. 

The storage account must be accessible to the function app. If you need to use a secured storage account, consider [restricting your storage account to a virtual network](./functions-networking-options.md#restrict-your-storage-account-to-a-virtual-network).

### Storage account connection setting

By default, function apps configure the `AzureWebJobsStorage` connection as a connection string stored in the [AzureWebJobsStorage application setting](./functions-app-settings.md#azurewebjobsstorage), but you can also [configure AzureWebJobsStorage to use an identity-based connection](functions-reference.md#connecting-to-host-storage-with-an-identity) without a secret.

Function apps running in a Consumption plan (Windows only) or an Elastic Premium plan (Windows or Linux) can use Azure Files to store the images required to enable dynamic scaling. For these plans, set the connection string for the storage account in the [WEBSITE_CONTENTAZUREFILECONNECTIONSTRING](./functions-app-settings.md#website_contentazurefileconnectionstring) setting and the name of the file share in the [WEBSITE_CONTENTSHARE](./functions-app-settings.md#website_contentshare) setting. This is usually the same account used for `AzureWebJobsStorage`. You can also [create a function app that doesn't use Azure Files](#create-an-app-without-azure-files), but scaling might be limited.

> [!NOTE]
> A storage account connection string must be updated when you regenerate storage keys. [Read more about storage key management here](../storage/common/storage-account-create.md).

### Shared storage accounts

It's possible for multiple function apps to share the same storage account without any issues. For example, in Visual Studio you can develop multiple apps using the [Azurite storage emulator](functions-develop-local.md#local-storage-emulator). In this case, the emulator acts like a single storage account. The same storage account used by your function app can also be used to store your application data. However, this approach isn't always a good idea in a production environment.

You may need to use separate storage accounts to [avoid host ID collisions](#avoiding-host-id-collisions).

### Lifecycle management policy considerations

You shouldn't apply [lifecycle management policies](../storage/blobs/lifecycle-management-overview.md) to your Blob Storage account used by your function app. Functions uses Blob storage to persist important information, such as [function access keys](functions-bindings-http-webhook-trigger.md#authorization-keys), and policies may remove blobs (such as keys) needed by the Functions host. If you must use policies, exclude containers used by Functions, which are prefixed with `azure-webjobs` or `scm`.

### Storage logs

Because function code and keys may be persisted in the storage account, logging of activity against the storage account is a good way to monitor for unauthorized access. Azure Monitor resource logs can be used to track events against the storage data plane. See [Monitoring Azure Storage](../storage/blobs/monitor-blob-storage.md) for details on how to configure and examine these logs.

The [Azure Monitor activity log](../azure-monitor/essentials/activity-log.md) shows control plane events, including the [listKeys operation]. However, you should also configure resource logs for the storage account to track subsequent use of keys or other identity-based data plane operations. You should have at least the [StorageWrite log category](../storage/blobs/monitor-blob-storage.md#collection-and-routing) enabled to be able to identify modifications to the data outside of normal Functions operations. 

To limit the potential impact of any broadly scoped storage permissions, consider using a nonstorage destination for these logs, such as Log Analytics. For more information, see [Monitoring Azure Blob Storage](../storage/blobs/monitor-blob-storage.md).

### Optimize storage performance

[!INCLUDE [functions-shared-storage](../../includes/functions-shared-storage.md)]

## Working with blobs 

A key scenario for Functions is file processing of files in a blob container, such as for image processing or sentiment analysis. To learn more, see [Process file uploads](./functions-scenarios.md#process-file-uploads). 

### Trigger on a blob container

There are several ways to execute your function code based on changes to blobs in a storage container. Use the following table to determine which function trigger best fits your needs:

| Consideration | Blob Storage (standard) | Blob Storage (event-based) | Queue Storage | Event Grid | 
| ----- | ----- | ----- | ----- | ---- |
| Latency | High (up to 10 min) | Low | Medium  | Low | 
| [Storage account](../storage/common/storage-account-overview.md#types-of-storage-accounts) limitations | Blob-only accounts not supported¹  | general purpose v1 not supported  | none | general purpose v1 not supported |
| Extension version |Any | Storage v5.x+ |Any |Any |
| Processes existing blobs | Yes | No | No | No |
| Filters | [Blob name pattern](./functions-bindings-storage-blob-trigger.md#blob-name-patterns)  | [Event filters](../storage/blobs/storage-blob-event-overview.md#filtering-events) | n/a | [Event filters](../storage/blobs/storage-blob-event-overview.md#filtering-events) |
| Requires [event subscription](../event-grid/concepts.md#event-subscriptions) | No | Yes | No | Yes |
| Supports high-scale² | No | Yes | Yes | Yes |
| Description | Default trigger behavior, which relies on polling the container for updates. For more information, see the examples in the [Blob storage trigger reference](./functions-bindings-storage-blob-trigger.md#example). | Consumes blob storage events from an event subscription. Requires a `Source` parameter value of `EventGrid`. For more information, see [Tutorial: Trigger Azure Functions on blob containers using an event subscription](./functions-event-grid-blob-trigger.md). | Blob name string is manually added to a storage queue when a blob is added to the container. This value is passed directly by a Queue Storage trigger to a Blob Storage input binding on the same function. | Provides the flexibility of triggering on events besides those coming from a storage container. Use when need to also have nonstorage events trigger your function. For more information, see [How to work with Event Grid triggers and bindings in Azure Functions](event-grid-how-tos.md). |

<sup>1</sup> Blob Storage input and output bindings support blob-only accounts.  
<sup>2</sup> High scale can be loosely defined as containers that have more than 100,000 blobs in them or storage accounts that have more than 100 blob updates per second.

## Storage data encryption

[!INCLUDE [functions-storage-encryption](../../includes/functions-storage-encryption.md)]

### In-region data residency

When all customer data must remain within a single region, the storage account associated with the function app must be one with [in-region redundancy](../storage/common/storage-redundancy.md). An in-region redundant storage account also must be used with [Azure Durable Functions](./durable/durable-functions-azure-storage-provider.md#storage-account-selection).

Other platform-managed customer data is only stored within the region when hosting in an internally load-balanced App Service Environment (ASE). To learn more, see [ASE zone redundancy](../app-service/environment/zone-redundancy.md#in-region-data-residency).

## Host ID considerations

Functions uses a host ID value as a way to uniquely identify a particular function app in stored artifacts. By default, this ID is autogenerated from the name of the function app, truncated to the first 32 characters. This ID is then used when storing per-app correlation and tracking information in the linked storage account. When you have function apps with names longer than 32 characters and when the first 32 characters are identical, this truncation can result in duplicate host ID values. When two function apps with identical host IDs use the same storage account, you get a host ID collision because stored data can't be uniquely linked to the correct function app. 

>[!NOTE]
>This same kind of host ID collison can occur between a function app in a production slot and the same function app in a staging slot, when both slots use the same storage account.

Starting with version 3.x of the Functions runtime, host ID collision is detected and a warning is logged. In version 4.x, an error is logged and the host is stopped, resulting in a hard failure. More details about host ID collision can be found in [this issue](https://github.com/Azure/azure-functions-host/issues/2015).

### Avoiding host ID collisions

You can use the following strategies to avoid host ID collisions:

+ Use a separated storage account for each function app or slot involved in the collision.
+ Rename one of your function apps to a value fewer than 32 characters in length, which changes the computed host ID for the app and removes the collision.
+ Set an explicit host ID for one or more of the colliding apps. To learn more, see [Host ID override](#override-the-host-id).

> [!IMPORTANT]
> Changing the storage account associated with an existing function app or changing the app's host ID can impact the behavior of existing functions. For example, a Blob Storage trigger tracks whether it's processed individual blobs by writing receipts under a specific host ID path in storage. When the host ID changes or you point to a new storage account, previously processed blobs may be reprocessed. 

### Override the host ID

You can explicitly set a specific host ID for your function app in the application settings by using the `AzureFunctionsWebHost__hostid` setting. For more information, see [AzureFunctionsWebHost__hostid](functions-app-settings.md#azurefunctionswebhost__hostid). 

When the collision occurs between slots, you must set a specific host ID for each slot, including the production slot. You must also mark these settings as [deployment settings](functions-deployment-slots.md#create-a-deployment-setting) so they don't get swapped. To learn how to create app settings, see [Work with application settings](functions-how-to-use-azure-function-app-settings.md#settings).

## Azure Arc-enabled clusters

When your function app is deployed to an Azure Arc-enabled Kubernetes cluster, a storage account may not be required by your function app. In this case, a storage account is only required by Functions when your function app uses a trigger that requires storage. The following table indicates which triggers may require a storage account and which don't. 

| Not required | May require storage |
| --- | --- | 
| • [Azure Cosmos DB](functions-bindings-cosmosdb-v2.md)<br/>• [HTTP](functions-bindings-http-webhook.md)<br/>• [Kafka](functions-bindings-kafka.md)<br/>• [RabbitMQ](functions-bindings-rabbitmq.md)<br/>• [Service Bus](functions-bindings-service-bus.md) | • [Azure SQL](functions-bindings-azure-sql.md)<br/>• [Blob storage](functions-bindings-storage-blob.md)<br/>• [Event Grid](functions-bindings-event-grid.md)<br/>• [Event Hubs](functions-bindings-event-hubs.md)<br/>• [IoT Hub](functions-bindings-event-iot.md)<br/>• [Queue storage](functions-bindings-storage-queue.md)<br/>• [SendGrid](functions-bindings-sendgrid.md)<br/>• [SignalR](functions-bindings-signalr-service.md)<br/>• [Table storage](functions-bindings-storage-table.md)<br/>• [Timer](functions-bindings-timer.md)<br/>• [Twilio](functions-bindings-twilio.md)

To create a function app on an Azure Arc-enabled Kubernetes cluster without storage, you must use the Azure CLI command [az functionapp create](/cli/azure/functionapp#az-functionapp-create). The version of the Azure CLI must include version 0.1.7 or a later version of the [appservice-kube extension](/cli/azure/appservice/kube). Use the `az --version` command to verify that the extension is installed and is the correct version.

Creating your function app resources using methods other than the Azure CLI requires an existing storage account. If you plan to use any triggers that require a storage account, you should create the account before you create the function app. 

## Create an app without Azure Files

Azure Files is set up by default for Elastic Premium and non-Linux Consumption plans to serve as a shared file system in high-scale scenarios. The file system is used by the platform for some features such as log streaming, but it primarily ensures consistency of the deployed function payload. When an app is [deployed using an external package URL](./run-functions-from-deployment-package.md), the app content is served from a separate read-only file system. This means that you can create your function app without Azure Files. If you create your function app with Azure Files, a writeable file system is still provided. However, this file system may not be available for all function app instances.  

When Azure Files isn't used, you must meet the following requirements:

* You must deploy from an external package URL.
* Your app can't rely on a shared writeable file system.
* The app can't use version 1.x of the Functions runtime.
* Log streaming experiences in clients such as the Azure portal default to file system logs. You should instead rely on Application Insights logs.

If the above are properly accounted for, you may create the app without Azure Files. Create the function app without specifying the `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` and `WEBSITE_CONTENTSHARE` application settings. You can avoid these settings by generating an ARM template for a standard deployment, removing the two settings, and then deploying the template. 

Because Functions use Azure Files during parts of the dynamic scale-out process, scaling could be limited when running without Azure Files on Consumption and Elastic Premium plans.

## Mount file shares

_This functionality is current only available when running on Linux._ 

You can mount existing Azure Files shares to your Linux function apps. By mounting a share to your Linux function app, you can use existing machine learning models or other data in your functions. You can use the following command to mount an existing share to your Linux function app. 

# [Azure CLI](#tab/azure-cli)

[`az webapp config storage-account add`](/cli/azure/webapp/config/storage-account#az-webapp-config-storage-account-add)

In this command, `share-name` is the name of the existing Azure Files share, and `custom-id` can be any string that uniquely defines the share when mounted to the function app. Also, `mount-path` is the path from which the share is accessed in your function app. `mount-path` must be in the format `/dir-name`, and it can't start with `/home`.

For a complete example, see the scripts in [Create a Python function app and mount a Azure Files share](scripts/functions-cli-mount-files-storage-linux.md). 

# [Azure PowerShell](#tab/azure-powershell)

[`New-AzWebAppAzureStoragePath`](/powershell/module/az.websites/new-azwebappazurestoragepath)

In this command, `-ShareName` is the name of the existing Azure Files share, and `-MountPath` is the path from which the share is accessed in your function app. `-MountPath` must be in the format `/dir-name`, and it can't start with `/home`. After you create the path, use the `-AzureStoragePath` parameter of [`Set-AzWebApp`](/powershell/module/az.websites/set-azwebapp) to add the share to the app.

For a complete example, see the script in [Create a serverless Python function app and mount file share](create-resources-azure-powershell.md#create-a-serverless-python-function-app-and-mount-file-share). 

---

Currently, only a `storage-type` of `AzureFiles` is supported. You can only mount five shares to a given function app. Mounting a file share may increase the cold start time by at least 200-300 ms, or even more when the storage account is in a different region.

The mounted share is available to your function code at the `mount-path` specified. For example, when `mount-path` is `/path/to/mount`, you can access the target directory by file system APIs, as in the following Python example:

```python
import os
...

files_in_share = os.listdir("/path/to/mount")
```

## Next steps

Learn more about Azure Functions hosting options.

> [!div class="nextstepaction"]
> [Azure Functions scale and hosting](functions-scale.md)

[listKeys operation]: /rest/api/storagerp/storage-accounts/list-keys
