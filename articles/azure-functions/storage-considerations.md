---
title: Storage considerations for Azure Functions
description: Learn about the storage requirements of Azure Functions and about encrypting stored data, including important considerations for your function app instances.
ms.topic: concept-article
ms.date: 01/20/2026
ms.custom:
  - ignite-2024
  - sfi-ropc-nochange
#customer intent: As a function app developer, I want to know the storage options for my apps, including guidance and best practices.
---

# Storage considerations for Azure Functions

When you create a function app instance in Azure, you must provide access to a default Azure Storage account. The following diagram and table detail how Azure Functions uses services in the default storage account:

:::image type="content" source="media/storage-considerations/functions-storage-services.png" alt-text="Diagram showing how Azure Functions uses different storage services within an Azure Storage account, including Blob storage, Files share, Queue storage, and Table storage.":::

|Storage service  | Functions usage  |
|---------|---------|
| [Azure Blob storage](../storage/blobs/storage-blobs-introduction.md)     | Maintain bindings state and function keys<sup>1</sup>.<br/>Deployment source for apps that run in a [Flex Consumption plan](flex-consumption-plan.md).<br/>Used by default for [task hubs in Durable Functions](durable/durable-functions-task-hubs.md). <br/>Can be used to store function app code for [Linux Consumption remote build](functions-deployment-technologies.md#remote-build) or as part of [external package URL deployments](functions-deployment-technologies.md#external-package-url). |
| [Azure Files](../storage/files/storage-files-introduction.md)<sup>2</sup>  | File share used to store and run your function app code in a [Consumption Plan](consumption-plan.md) and [Premium Plan](functions-premium-plan.md). <br/> Maintain [extension bundles](./extension-bundles.md).<br/>Store deployment logs.<br/>Supports [Managed dependencies in PowerShell](./functions-reference-powershell.md#managed-dependencies-feature). |
| [Azure Queue storage](../storage/queues/storage-queues-introduction.md)     | Used by default for [task hubs in Durable Functions](durable/durable-functions-task-hubs.md). Used for failure and retry handling in [specific Azure Functions triggers](./functions-bindings-storage-blob-trigger.md). Used for object tracking by the [Blob storage trigger](functions-bindings-storage-blob-trigger.md). |
| [Azure Table storage](../storage/tables/table-storage-overview.md)  |  Used by default for [task hubs in Durable Functions](durable/durable-functions-task-hubs.md).<br/>Used for tracking [diagnostic events](./functions-diagnostics.md).  |

1. Blob storage is the default store for function keys, but you can [configure an alternate store](function-keys-how-to.md#manage-key-storage).
1. Azure Files is set up by default, but you can [create an app without Azure Files](#create-an-app-without-azure-files) under certain conditions.

## Important considerations

You must strongly consider the following facts regarding the storage accounts used by your function apps:

- When your function app is hosted on the Consumption plan or Premium plan, your function code and configuration files are stored in Azure Files in the linked storage account. When you delete this storage account, the content is deleted and can't be recovered. For more information, see [Storage account was deleted](functions-recover-storage-account.md#storage-account-was-deleted).

- Important data, such as function code, [access keys](function-keys-how-to.md), and other important service-related data, persist in the storage account. You must carefully manage access to the storage accounts used by function apps in the following ways: 

  - Audit and limit the access of apps and users to the storage account based on a least-privilege model. Permissions to the storage account can come from [data actions in the assigned role](../role-based-access-control/role-definitions.md#control-and-data-actions) or through permission to perform the [listKeys operation].

  - Monitor both control plane activity (such as retrieving keys) and data plane operations (such as writing to a blob) in your storage account. Consider maintaining storage logs in a location other than Azure Storage. For more information, see [Storage logs](#storage-logs). 

## Storage account requirements

Storage accounts that you create during the function app creation process in the Azure portal work with the new function app. When you choose to use an existing storage account, the list provided doesn't include certain unsupported storage accounts. The following restrictions apply to storage accounts used by your function app. Make sure an existing storage account meets these requirements:

- The account type must support Blob, Queue, and Table storage. Some storage accounts don't support queues and tables. These accounts include blob-only storage accounts and Azure Premium Storage. To learn more about storage account types, see [Storage account overview](../storage/common/storage-account-overview.md).

- You can't use a network-secured storage account when your function app is hosted in the [Consumption plan](consumption-plan.md).

- When you create your function app in the Azure portal, you can only choose an existing storage account in the same region as the function app that you create. This requirement is a performance optimization and not a strict limitation. To learn more, see [Storage account location](#storage-account-location).

- When you create your function app on a plan with [availability zone support](/azure/reliability/reliability-functions#availability-zone-support) enabled, only [zone-redundant storage accounts](../storage/common/storage-redundancy.md#zone-redundant-storage) are supported.

When you use deployment automation to create your function app with a network-secured storage account, you must include specific networking configurations in your ARM template or Bicep file. If you don't include these settings and resources, your automated deployment might fail in validation. For ARM template and Bicep guidance, see [Secured deployments](functions-infrastructure-as-code.md#secured-deployments). For an overview on configuring storage accounts with networking, see [How to use a secured storage account with Azure Functions](configure-networking-how-to.md).

## Storage account guidance

Every function app requires a storage account to operate. When you delete that account, your function app stops running. To troubleshoot storage-related issues, see [How to troubleshoot storage-related issues](functions-recover-storage-account.md). The following considerations apply to the storage account used by function apps.

### Storage account location

For best performance, your function app should use a storage account in the same region, which reduces latency. The Azure portal enforces this best practice. If you need to use a storage account in a region different from your function app, you must create your function app outside of the Azure portal. 

The storage account must be accessible to the function app. If you need to use a secured storage account, consider [restricting your storage account to a virtual network](./functions-networking-options.md#restrict-your-storage-account-to-a-virtual-network).

### Storage account connection setting

By default, function apps configure the `AzureWebJobsStorage` connection as a connection string stored in the [AzureWebJobsStorage application setting](./functions-app-settings.md#azurewebjobsstorage). You can also [configure AzureWebJobsStorage to use an identity-based connection](functions-reference.md#connecting-to-host-storage-with-an-identity) without a secret.

Function apps running in a Consumption plan (Windows only) or an Elastic Premium plan (Windows or Linux) can use Azure Files to store the images required to enable dynamic scaling. For these plans, set the connection string for the storage account in the [WEBSITE_CONTENTAZUREFILECONNECTIONSTRING](./functions-app-settings.md#website_contentazurefileconnectionstring) setting and the name of the file share in the [WEBSITE_CONTENTSHARE](./functions-app-settings.md#website_contentshare) setting. This value is usually the same account used for `AzureWebJobsStorage`. You can also [create a function app that doesn't use Azure Files](#create-an-app-without-azure-files), but scaling might be limited.

> [!NOTE]
> You must update a storage account connection string when you regenerate storage keys. For more information, see [Create an Azure storage account](../storage/common/storage-account-create.md).

### Shared storage accounts

Multiple function apps can share the same storage account without any problems. For example, in Visual Studio, you can develop multiple apps by using the [Azurite storage emulator](functions-develop-local.md#local-storage-emulator). In this case, the emulator acts like a single storage account. The same storage account that your function app uses can also store your application data. However, this approach isn't always a good idea in a production environment.

You might need to use separate storage accounts to [avoid host ID collisions](#avoiding-host-id-collisions).

### Lifecycle management policy considerations

Don't apply [lifecycle management policies](../storage/blobs/lifecycle-management-overview.md) to your Blob Storage account used by your function app. Functions uses Blob storage to persist important information, such as [function access keys](function-keys-how-to.md). Policies could remove blobs, such as keys, needed by the Functions host. If you must use policies, exclude containers used by Functions, which are prefixed with `azure-webjobs` or `scm`.

### Storage logs

Because function code and keys might be persisted in the storage account, logging of activity against the storage account is a good way to monitor for unauthorized access. Azure Monitor resource logs can be used to track events against the storage data plane. See [Monitoring Azure Storage](../storage/blobs/monitor-blob-storage.md) for details on how to configure and examine these logs.

The [Azure Monitor activity log](/azure/azure-monitor/essentials/activity-log) shows control plane events, including the [listKeys operation]. However, you should also configure resource logs for the storage account to track subsequent use of keys or other identity-based data plane operations. You should have at least the [StorageWrite log category](../storage/blobs/monitor-blob-storage.md#collection-and-routing) enabled to be able to identify modifications to the data outside of normal Functions operations.

To limit the potential impact of any broadly scoped storage permissions, consider using a nonstorage destination for these logs, such as Log Analytics. For more information, see [Monitoring Azure Blob Storage](../storage/blobs/monitor-blob-storage.md).

### Optimize storage performance

[!INCLUDE [functions-shared-storage](../../includes/functions-shared-storage.md)]

### Consistent routing through virtual networks

Multiple function apps hosted in the same plan can also use the same storage account for the Azure Files content share, defined by `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`. When you secure this storage account by using a virtual network, all of these apps (including slots) should use the same value for `vnetContentShareEnabled` (formerly `WEBSITE_CONTENTOVERVNET`) and the same virtual network integration configuration to ensure that traffic routes consistently through the intended virtual network. A mismatch in this setting between apps that use the same Azure Files storage account might result in traffic routing through public networks. In this configuration, storage account network rules block access.

## Working with blobs 

A key scenario for Functions is file processing of files in a blob container, such as for image processing or sentiment analysis. To learn more, see [Process file uploads](./functions-scenarios.md#process-file-uploads). 

### Trigger on a blob container

There are several ways to run your function code based on changes to blobs in a storage container, as indicated by this diagram: 

:::image type="content" source="media/storage-considerations/functions-blob-storage-trigger-options.png" alt-text="Diagram that shows the various options for triggering a function when items are added or updated in a Blob Storage container in Azure.":::

Use the following table to determine which function trigger best fits your needs for processing added or updated blobs in a container:

| Strategy | Blob trigger (polling) | Blob trigger (event-driven) | Queue trigger | Event Grid trigger | 
| ----- | ----- | ----- | ----- | ---- |
| Latency | High (up to 10 min) | Low | Medium  | Low | 
| [Storage account](../storage/common/storage-account-overview.md#types-of-storage-accounts) limitations | Blob-only accounts not supported¹  | general purpose v1 not supported  | none | general purpose v1 not supported |
| Trigger type | [Blob storage](functions-bindings-storage-blob-trigger.md) | [Blob storage](functions-bindings-storage-blob-trigger.md) | [Queue storage](functions-bindings-storage-queue-trigger.md) | [Event Grid](functions-bindings-event-grid-trigger.md) |
| Extension version | Any | Storage v5.x+ |Any |Any |
| Processes existing blobs | Yes | No | No | No |
| Filters | [Blob name pattern](./functions-bindings-storage-blob-trigger.md#blob-name-patterns)  | [Event filters](../storage/blobs/storage-blob-event-overview.md#filtering-events) | n/a | [Event filters](../storage/blobs/storage-blob-event-overview.md#filtering-events) |
| Requires [event subscription](../event-grid/concepts.md#event-subscriptions) | No | Yes | No | Yes |
| Supports [Flex Consumption plan](flex-consumption-plan.md) | No | Yes | Yes | Yes |
| Supports high-scale² | No | Yes | Yes | Yes |
| Works with [inbound access restrictions](./functions-networking-options.md#inbound-access-restrictions) | Yes | No | Yes | Yes<sup>3</sup> | 
| Description | Default trigger behavior, which relies on polling the container for updates. For more information, see the examples in the [Blob storage trigger reference](./functions-bindings-storage-blob-trigger.md#example). | Consumes blob storage events from an event subscription. Requires a `Source` parameter value of `EventGrid`. For more information, see [Tutorial: Trigger Azure Functions on blob containers using an event subscription](./functions-event-grid-blob-trigger.md). | Blob name string is manually added to a storage queue when a blob is added to the container. A Queue storage trigger passes this value directly to a Blob storage input binding on the same function. | Provides the flexibility of triggering on events besides those events that come from a storage container. Use when need to also have nonstorage events trigger your function. For more information, see [How to work with Event Grid triggers and bindings in Azure Functions](event-grid-how-tos.md). |

1. Blob storage input and output bindings support blob-only accounts.
2. High scale can be loosely defined as containers that have more than 100,000 blobs in them or storage accounts that have more than 100 blob updates per second.
3. You can work around inbound access restrictions by having the event subscription deliver events over an encrypted channel in public IP space using a known user identity. For more information, see [Deliver events securely using managed identities](../event-grid/deliver-events-using-managed-identity.md).

## Storage data encryption

[!INCLUDE [functions-storage-encryption](../../includes/functions-storage-encryption.md)]

### In-region data residency

When all customer data must remain within a single region, the storage account associated with the function app must be one with [in-region redundancy](../storage/common/storage-redundancy.md). An in-region redundant storage account also must be used with [Azure Durable Functions](./durable/durable-functions-azure-storage-provider.md#storage-account-selection).

Other platform-managed customer data is only stored within the region when hosting in an internally load-balanced App Service Environment (ASE). To learn more, see [ASE zone redundancy](../app-service/environment/zone-redundancy.md#in-region-data-residency).

## Host ID considerations

>[!NOTE]
>The Host ID considerations in this section don't apply when your app runs in a [Flex Consumption plan](./flex-consumption-plan.md). In this hosting plan, the Host ID value is created in a way that avoids these potential issues.

Functions uses a host ID value as a way to uniquely identify a particular function app in stored artifacts. By default, this ID is autogenerated from the name of the function app, truncated to the first 32 characters. This ID is then used when storing per-app correlation and tracking information in the linked storage account. When you have function apps with names longer than 32 characters and when the first 32 characters are identical, this truncation can result in duplicate host ID values. When two function apps with identical host IDs use the same storage account, you get a host ID collision because stored data can't be uniquely linked to the correct function app. 

>[!NOTE]
>This same kind of host ID collision can occur between a function app in a production slot and the same function app in a staging slot, when both slots use the same storage account.

In version 4.x of the Functions runtime, an error is logged and the host is stopped, resulting in a hard failure. For more information, see [HostID Truncation can cause collisions](https://github.com/Azure/azure-functions-host/issues/2015).

### Avoiding host ID collisions

You can use the following strategies to avoid host ID collisions:

- Use a separate storage account for each function app or slot involved in the collision.
- Rename one of your function apps to a value fewer than 32 characters in length, which changes the computed host ID for the app and removes the collision.
- Set an explicit host ID for one or more of the colliding apps. To learn more, see [Override the host ID](#override-the-host-id).

> [!IMPORTANT]
> Changing the storage account associated with an existing function app or changing the app's host ID can affect the behavior of existing functions. For example, a Blob storage trigger tracks whether it's processed individual blobs by writing receipts under a specific host ID path in storage. When the host ID changes or you point to a new storage account, previously processed blobs could be reprocessed. 

### Override the host ID

You can explicitly set a specific host ID for your function app in the application settings by using the `AzureFunctionsWebHost__hostid` setting. For more information, see [AzureFunctionsWebHost__hostid](functions-app-settings.md#azurefunctionswebhost__hostid). 

When the collision occurs between slots, you must set a specific host ID for each slot, including the production slot. You must also mark these settings as [deployment settings](functions-deployment-slots.md#create-a-deployment-setting) so they don't get swapped. To learn how to create app settings, see [Work with application settings](functions-how-to-use-azure-function-app-settings.md#settings).

## Azure Arc-enabled clusters

When your function app is deployed to an Azure Arc-enabled Kubernetes cluster, your function app might not require a storage account. In this case, functions only require a storage account when your function app uses a trigger that requires storage. The following table indicates which triggers might require a storage account and which don't.

| Not required | might require storage |
| --- | --- | 
| • [Azure Cosmos DB](functions-bindings-cosmosdb-v2.md)<br/>• [HTTP](functions-bindings-http-webhook.md)<br/>• [Kafka](functions-bindings-kafka.md)<br/>• [RabbitMQ](functions-bindings-rabbitmq.md)<br/>• [Service Bus](functions-bindings-service-bus.md) | • [Azure SQL](functions-bindings-azure-sql.md)<br/>• [Blob storage](functions-bindings-storage-blob.md)<br/>• [Event Grid](functions-bindings-event-grid.md)<br/>• [Event Hubs](functions-bindings-event-hubs.md)<br/>• [IoT Hub](functions-bindings-event-iot.md)<br/>• [Queue storage](functions-bindings-storage-queue.md)<br/>• [SendGrid](functions-bindings-sendgrid.md)<br/>• [SignalR](functions-bindings-signalr-service.md)<br/>• [Table storage](functions-bindings-storage-table.md)<br/>• [Timer](functions-bindings-timer.md)<br/>• [Twilio](functions-bindings-twilio.md)

To create a function app on an Azure Arc-enabled Kubernetes cluster without storage, you must use the Azure CLI command [az functionapp create](/cli/azure/functionapp#az-functionapp-create). The version of the Azure CLI must include version 0.1.7 or a later version of the [appservice-kube extension](/cli/azure/appservice/kube). Use the `az --version` command to verify that the extension is installed and is the correct version.

Creating your function app resources using methods other than the Azure CLI requires an existing storage account. If you plan to use any triggers that require a storage account, you should create the account before you create the function app. 

## Create an app without Azure Files

The Azure Files service provides a shared file system that supports high-scale scenarios. When your function app runs in an Elastic Premium plan or on Windows in a Consumption plan, an Azure Files share is created by default in your storage account. Functions use that share is used to enable certain features, like log streaming. It's also used as a shared package deployment location, which guarantees the consistency of your deployed function code across all instances.

By default, function apps hosted in Premium and Consumption plans use [zip deployment](./deployment-zip-push.md), with deployment packages stored in this Azure file share. This section is only relevant to these hosting plans.

Using Azure Files requires the use of a connection string, which is stored in your app settings as [`WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`](functions-app-settings.md#website_contentazurefileconnectionstring). Azure Files doesn't currently support identity-based connections. If your scenario requires you to not store any secrets in app settings, you must remove your app's dependency on Azure Files. You can do avoid dependencies by creating your app without the default Azure Files dependency.

> [!NOTE]
> You should also consider running your function app in the Flex Consumption plan, which provides greater control over the deployment package, including the ability use managed identity connections. For more information, see [Configure deployment settings](flex-consumption-how-to.md#configure-deployment-settings).

To run your app without the Azure file share, you must meet the following requirements:

- You must [deploy your package to a remote Azure Blob storage container](./run-functions-from-deployment-package.md) and then set the URL that provides access to that package as the [`WEBSITE_RUN_FROM_PACKAGE`](functions-app-settings.md#website_run_from_package) app setting. This approach lets you store your app content in Blob storage instead of Azure Files, which does support [managed identities](./run-functions-from-deployment-package.md#fetch-a-package-from-azure-blob-storage-using-a-managed-identity). 

You must manually update the deployment package and maintain the deployment package URL, which likely contains a shared access signature (SAS).

You should also note the following considerations:

- The app can't use version 1.x of the Functions runtime.
- Your app can't rely on a shared writeable file system.
- Portal editing isn't supported.
- Log streaming experiences in clients such as the Azure portal default to file system logs. You should instead rely on Application Insights logs.

If the preceding requirements suit your scenario, you can proceed to create a function app without Azure Files. Create an app without the `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` and `WEBSITE_CONTENTSHARE` app settings in one of these ways: 

- Bicep/ARM templates: remove the two app settings from the ARM template or Bicep file and then deploy the app using the modified template. 
- The Azure portal: unselect **Add an Azure Files connection** in the **Storage** tab when you create the app in the Azure portal.

Azure Files is used to enable dynamic scale-out for Functions. Scaling could be limited when you run your app without Azure Files in the Elastic Premium plan and Consumption plans running on Windows. 

## Mount file shares

_This functionality is current only available when running on Linux._ 

You can mount existing Azure Files shares to your Linux function apps. By mounting a share to your Linux function app, you can use existing machine learning models or other data in your functions. 

[!INCLUDE [functions-linux-consumption-retirement](../../includes/functions-linux-consumption-retirement.md)]

You can use the following command to mount an existing share to your Linux function app. 

# [Azure CLI](#tab/azure-cli)

[az webapp config storage-account add](/cli/azure/webapp/config/storage-account#az-webapp-config-storage-account-add)

In this command, `share-name` is the name of the existing Azure Files share. `custom-id` can be any string that uniquely defines the share when mounted to the function app. Also, `mount-path` is the path from which the share is accessed in your function app. `mount-path` must be in the format `/dir-name`, and it can't start with `/home`.

For a complete example, see [Create a Python function app and mount an Azure Files share](scripts/functions-cli-mount-files-storage-linux.md). 

# [Azure PowerShell](#tab/azure-powershell)

[New-AzWebAppAzureStoragePath](/powershell/module/az.websites/new-azwebappazurestoragepath)

In this command, `-ShareName` is the name of the existing Azure Files share. `-MountPath` is the path from which the share is accessed in your function app. `-MountPath` must be in the format `/dir-name`, and it can't start with `/home`. After you create the path, use the `-AzureStoragePath` parameter of [Set-AzWebApp](/powershell/module/az.websites/set-azwebapp) to add the share to the app.

For a complete example, see [Create a serverless Python function app and mount file share](create-resources-azure-powershell.md#create-a-serverless-python-function-app-and-mount-file-share). 

---

Currently, only a `storage-type` of `AzureFiles` is supported. You can only mount five shares to a given function app. Mounting a file share can increase the cold start time by at least 200-300 ms, or even more when the storage account is in a different region.

The mounted share is available to your function code at the `mount-path` specified. For example, when `mount-path` is `/path/to/mount`, you can access the target directory by file system APIs, as in the following Python example:

```python
import os
...

files_in_share = os.listdir("/path/to/mount")
```

## Related article

Learn more about Azure Functions hosting options.

> [!div class="nextstepaction"]
> [Azure Functions scale and hosting](functions-scale.md)

[listKeys operation]: /rest/api/storagerp/storage-accounts/list-keys
