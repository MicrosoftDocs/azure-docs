---
title: Storage considerations for Azure Functions
description: Learn about the storage requirements of Azure Functions and about encrypting stored data. 
ms.topic: conceptual
ms.date: 03/21/2023
---

# Storage considerations for Azure Functions

Azure Functions requires an Azure Storage account when you create a function app instance. The following storage services may be used by your function app:

|Storage service  | Functions usage  |
|---------|---------|
| [Azure Blob Storage](../storage/blobs/storage-blobs-introduction.md)     | Maintain bindings state and function keys<sup>1</sup>.  <br/>Used by default for [task hubs in Durable Functions](durable/durable-functions-task-hubs.md). <br/>May be used to store function app code for [Linux Consumption remote build](functions-deployment-technologies.md#remote-build) or as part of [external package URL deployments](functions-deployment-technologies.md#external-package-url). |
| [Azure Files](../storage/files/storage-files-introduction.md)<sup>2</sup>  | File share used to store and run your function app code in a [Consumption Plan](consumption-plan.md) and [Premium Plan](functions-premium-plan.md). <br/> |
| [Azure Queue Storage](../storage/queues/storage-queues-introduction.md)     | Used by default for [task hubs in Durable Functions](durable/durable-functions-task-hubs.md). Used for failure and retry handling in [specific Azure Functions triggers](./functions-bindings-storage-blob-trigger.md).   |
| [Azure Table Storage](../storage/tables/table-storage-overview.md)  |  Used by default for [task hubs in Durable Functions](durable/durable-functions-task-hubs.md).       |

<sup>1</sup> Blob storage is the default store for function keys, but you can [configure an alternate store](./security-concepts.md#secret-repositories).

<sup>2</sup> Azure Files is set up by default, but you can [create an app without Azure Files](#create-an-app-without-azure-files) under certain conditions.

> [!IMPORTANT]
> Access to storage accounts used by function apps should be carefully managed, as the account may store function code and other important data. You should audit what apps and users have access to the storage account and limit access as appropriate. Note that permissions can come from [data actions in the assigned role](../role-based-access-control/role-definitions.md#control-and-data-actions) or through permission to perform the [listKeys operation]. In addition, you can configure [logging for data plane operations](#storage-logs).

[listKeys operation]: /rest/api/storagerp/storage-accounts/list-keys

## Storage account requirements

When creating a function app, you must create or link to a general-purpose Azure Storage account that supports Blob, Queue, and Table storage. This requirement exists because Functions relies on Azure Storage for operations such as managing triggers and logging function executions. Some storage accounts don't support queues and tables. These accounts include blob-only storage accounts and Azure Premium Storage.

To learn more about storage account types, see [Storage account overview](../storage/common/storage-account-overview.md).

While you can use an existing storage account with your function app, you must make sure that it meets these requirements. Storage accounts created as part of the function app create flow in the Azure portal are guaranteed to meet these storage account requirements. In the portal, unsupported accounts are filtered out when choosing an existing storage account while creating a function app. In this flow, you're only allowed to choose existing storage accounts in the same region as the function app you're creating. To learn more, see [Storage account location](#storage-account-location).

Storage accounts secured by using firewalls or virtual private networks also can't be used in the portal creation flow. For more information, see [Restrict your storage account to a virtual network](functions-networking-options.md#restrict-your-storage-account-to-a-virtual-network).

<!-- JH: Does using a Premium Storage account improve perf? -->

> [!IMPORTANT]
> When using the Consumption/Premium hosting plan, your function code and binding configuration files are stored in Azure Files in the main storage account. When you delete the main storage account, this content is deleted and cannot be recovered.

## Storage account guidance

Every function app requires a storage account to operate. When that account is deleted, your function app won't run. To troubleshoot storage-related issues, see [How to troubleshoot storage-related issues](functions-recover-storage-account.md). The following other considerations apply to the Storage account used by function apps.

### Storage account location

For best performance, your function app should use a storage account in the same region, which reduces latency. The Azure portal enforces this best practice. If for some reason you need to use a storage account in a region different than your function app, you must create your function app outside of the portal. 

The storage account must be accessible to the function app. If you need to use a secured storage account, consider [restricting your storage account to a virtual network](./functions-networking-options.md#restrict-your-storage-account-to-a-virtual-network).

### Storage account connection setting

By default, Functions clients will configure the AzureWebJobsStorage connection as a connection string stored in the [AzureWebJobsStorage application setting](./functions-app-settings.md#azurewebjobsstorage), but you can also [configure AzureWebJobsStorage to use an identity-based connection](functions-reference.md#connecting-to-host-storage-with-an-identity) without a secret.

Function apps are configured to use Azure Files by storing a connection string in the [WEBSITE_CONTENTAZUREFILECONNECTIONSTRING application setting](./functions-app-settings.md#website_contentazurefileconnectionstring) and providing the name of the file share in the [WEBSITE_CONTENTSHARE application setting](./functions-app-settings.md#website_contentshare).

> [!NOTE]
> A storage account connection string must be updated when you regenerate storage keys. [Read more about storage key management here](../storage/common/storage-account-create.md).

### Shared storage accounts

It's possible for multiple function apps to share the same storage account without any issues. For example, in Visual Studio you can develop multiple apps using the [Azurite storage emulator](functions-develop-local.md#local-storage-emulator). In this case, the emulator acts like a single storage account. The same storage account used by your function app can also be used to store your application data. However, this approach isn't always a good idea in a production environment.

You may need to use separate storage accounts to [avoid host ID collisions](#avoiding-host-id-collisions).

### Lifecycle management policy considerations

Functions uses Blob storage to persist important information, such as [function access keys](functions-bindings-http-webhook-trigger.md#authorization-keys). When you apply a [lifecycle management policy](../storage/blobs/lifecycle-management-overview.md) to your Blob Storage account, the policy may remove blobs needed by the Functions host. Because of this fact, you shouldn't apply such policies to the storage account used by Functions. If you do need to apply such a policy, remember to exclude containers used by Functions, which are prefixed with `azure-webjobs` or `scm`.


### Storage logs

Azure Monitor resource logs can be used to track events against the storage data plane. See [Monitoring Azure Storage](../storage/blobs/monitor-blob-storage.md) for details on how to configure and examine these logs.

> [!IMPORTANT]
> Important data such as function code and keys may be persisted in the storage account, and while you should limit access to prevent modification or deletion of this data, you may wish to additionally monitor for unintended access. The [Azure Monitor activity log](../azure-monitor/essentials/activity-log.md) will only show data plane events, including the [listKeys operation], but later use of the key or any identity-based data plane operations will only be visible if you have configured resource logs for the storage account. Having at least the [StorageWrite log category](../storage/blobs/monitor-blob-storage.md#collection-and-routing) enabled can help you identify modifications to the data outside of normal Functions operation. To limit the potential impact of any broadly scoped storage permissions, consider using a non-Storage destination for these logs, such as Log Analytics.

### Optimize storage performance

[!INCLUDE [functions-shared-storage](../../includes/functions-shared-storage.md)]

## Storage data encryption

[!INCLUDE [functions-storage-encryption](../../includes/functions-storage-encryption.md)]

### In-region data residency

When all customer data must remain within a single region, the storage account associated with the function app must be one with [in-region redundancy](../storage/common/storage-redundancy.md). An in-region redundant storage account also must be used with [Azure Durable Functions](./durable/durable-functions-azure-storage-provider.md#storage-account-selection).

Other platform-managed customer data is only stored within the region when hosting in an internally load-balanced App Service Environment (ASE). To learn more, see [ASE zone redundancy](../app-service/environment/zone-redundancy.md#in-region-data-residency).

## Host ID considerations

Functions uses a host ID value as a way to uniquely identify a particular function app in stored artifacts. By default, this ID is auto-generated from the name of the function app, truncated to the first 32 characters. This ID is then used when storing per-app correlation and tracking information in the linked storage account. When you have function apps with names longer than 32 characters and when the first 32 characters are identical, this truncation can result in duplicate host ID values. When two function apps with identical host IDs use the same storage account, you get a host ID collision because stored data can't be uniquely linked to the correct function app. 

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

Azure Files is set up by default for Premium and non-Linux Consumption plans to serve as a shared file system in high-scale scenarios. The file system is used by the platform for some features such as log streaming, but it primarily ensures consistency of the deployed function payload. When an app is [deployed using an external package URL](./run-functions-from-deployment-package.md), the app content is served from a separate read-only file system. This means that you can create your function app without Azure Files. If you create your function app with Azure Files, a writeable file system is still provided. However, this file system may not be available for all function app instances.  

When Azure Files isn't used, you must meet the following requirements:

* You must deploy from an external package URL.
* Your app can't rely on a shared writeable file system.
* The app can't use version 1.x of the Functions runtime.
* Log streaming experiences in clients such as the Azure portal default to file system logs. You should instead rely on Application Insights logs.

If the above are properly accounted for, you may create the app without Azure Files. Create the function app without specifying the `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` and `WEBSITE_CONTENTSHARE` application settings. You can avoid these settings by generating an ARM template for a standard deployment, removing the two settings, and then deploying the template. 

Because Functions use Azure Files during parts of the dynamic scale-out process, scaling could be limited when running without Azure Files on Consumption and Premium plans.

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
