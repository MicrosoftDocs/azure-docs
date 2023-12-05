---
title: Change feed modes in Azure Cosmos DB 
description: Get an overview of Azure Cosmos DB change feed modes.
author: jcocchi
ms.author: jucocchi
ms.reviewer: jucocchi
ms.service: cosmos-db
ms.custom: build-2023
ms.topic: conceptual
ms.date: 08/14/2023
---
# Change feed modes in Azure Cosmos DB

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Azure Cosmos DB offers two change feed modes. Each mode offers the same core functionality. Differences include the operations that are captured in the feed, the metadata that's available for each change, and the retention period of changes. You can consume the change feed in different modes across multiple applications for the same Azure Cosmos DB container to fit the requirements of each workload. Each individual change feed application can only be configured to read change feed in one mode. Consuming the change feed in one mode doesn't prohibit you from consuming the change feed in another mode in a different application.

> [!NOTE]
> Do you have any feedback about change feed modes? We want to hear it! Feel free to share feedback directly with the Azure Cosmos DB engineering team: [cosmoschangefeed@microsoft.com](mailto:cosmoschangefeed@microsoft.com).

## Latest version change feed mode

Latest version mode is a persistent record of changes made to items from creates and updates. You get the latest version of each item in the container. For example, if an item is created and then updated before you read the change feed, only the updated version appears in the change feed. Deletes aren't captured as changes, and when an item is deleted, it's no longer be available in the feed. Latest version change feed mode is enabled by default and is compatible with all Azure Cosmos DB accounts except the API for Table and the API for PostgreSQL. This mode was previously the default way to consume the change feed.

## All versions and deletes change feed mode (preview)

All versions and deletes mode (preview) is a persistent record of all changes to items from create, update, and delete operations. You get a record of each change to items in the order that it occurred, including intermediate changes to an item between change feed reads. For example, if an item is created and then updated before you read the change feed, both the create and the update versions of the item appear in the change feed. To read from the change feed in all versions and deletes mode, you must have [continuous backups](../continuous-backup-restore-introduction.md) configured for your Azure Cosmos DB account. Turning on continuous backups creates the all versions and deletes change feed. You can only read changes that occurred within the continuous backup period when using this change feed mode. This mode is only compatible with Azure Cosmos DB for NoSQL accounts. Learn more about how to [sign up for the preview](#get-started).

## Change feed use cases

### [Latest version mode](#tab/latest-version)

Latest version mode provides an easy way to process both real-time and historic changes to items in a container with the ability to go back to changes from the beginning of the container.

The following are scenarios well-suited to this mode:

* Migrations of an entire container to a secondary location.

* Ability to reprocess changes from the beginning of the container.

* Real-time processing of changes to items in a container resulting from create and update operations.

* Workloads that don't need to capture deletes or intermediate changes between reads.

### [All versions and deletes mode (preview)](#tab/all-versions-and-deletes)

The all versions and deletes change feed mode enables new scenarios for change feed, and simplifies others. You can read every change that occurred to items (even in cases in which multiple changes occurred between change feed reads), identify the operation type of changes being processed, and get changes that result from deletes.

A few common scenarios this mode enables and enhances are:

* Real-time transfer of data between two locations without implementing a soft delete.

* Triggering logic based on incremental changes if multiple change operations for a given item are expected between change feed polls.

* Triggering alerts on delete operations, like in auditing scenarios.

* The ability to process item creates, updates, and deletes differently based on operation type.

---

## Features of each mode

In addition to the [common features across all change feed modes](../change-feed.md#features-of-change-feed), each change feed mode has the following characteristics:

### [Latest version mode](#tab/latest-version)

* The change feed includes insert and update operations that are made to items in the container.

* This mode of change feed doesn't log deletes. You can capture deletes by setting a "soft-delete" flag within your items instead of deleting them directly. For example, you can add an attribute in the item called `deleted` with the value `true`, and then set a Time to Live (TTL) on the item. The change feed captures it as an update and the item is automatically deleted when the TTL expires. Alternatively, you can set a finite expiration period for your items by using the [TTL capability](time-to-live.md). With this solution, you have to process the changes within a shorter time interval than the TTL expiration period.

* Only the most recent change for a specific item is included in the change feed. Intermediate changes might not be available.

* When an item is deleted, it's no longer available in the change feed.

* Changes can be synchronized from any point in time, and there's no fixed data retention period for which changes are available.

* You can't filter the change feed for a specific type of operation. One possible alternative, is to add a "soft marker" on the item for updates and filter based on the marker when you process items in the change feed.

* The starting point to read change feed can be from the beginning of the container, from a point in time, from "now," or from a specific checkpoint. The precision of the start time is approximately five seconds.

### [All versions and deletes mode (preview)](#tab/all-versions-and-deletes)

* The change feed includes insert, update, and delete operations made to items within the container. Deletes from TTL expirations are also captured.

* Metadata is provided to determine the change type, including whether a delete was due to a TTL expiration.

* Change feed items come in the order of their modification time. Deletes from TTL expirations aren't guaranteed to appear in the feed immediately after the item expires. They appear when the item is purged from the container.

* All changes that occurred within the retention window that's set for continuous backups on the account can be read. Attempting to read changes that occurred outside of the retention window results in an error. For example, if your container was created eight days ago and your continuous backup period retention period is seven days, then you can only read changes from the last seven days.

* The change feed starting point can be from "now" or from a specific checkpoint within your retention period. You can't read changes from the beginning of the container or from a specific point in time by using this mode.

---

## Work with the change feed

Each mode is compatible with different methods to read the change feed for each language.

### [Latest version mode](#tab/latest-version)

You can use the following ways to consume changes from change feed in latest version mode:

| **Method to read change feed** | **.NET** | **Java** | **Python** | **Node.js** |
| --- | --- | --- | --- | --- |
| [Change feed pull model](change-feed-pull-model.md) | Yes | Yes |  Yes  |  Yes  |
| [Change feed processor](change-feed-processor.md) | Yes | Yes | No | No |
| [Azure Functions trigger](change-feed-functions.md) | Yes | Yes | Yes | Yes |

### Parse the response object

In latest version mode, the default response object is an array of items that have changed. Each item contains the standard metadata for any Azure Cosmos DB item, including `_etag` and `_ts`, with the addition of a new property, `_lsn`.

The `_etag` format is internal and you shouldn't take dependency on it because it can change anytime. `_ts` is a modification or a creation time stamp. You can use `_ts` for chronological comparison. `_lsn` is a batch ID that is added for change feed only that represents the transaction ID. Many items can have same `_lsn`.

`ETag` on `FeedResponse` is different from the `_etag` you see on the item. `_etag` is an internal identifier, and it's used for concurrency control. The `_etag` property represents the version of the item, whereas the `ETag` property is used to sequence the feed.

### [All versions and deletes mode (preview)](#tab/all-versions-and-deletes)

During the preview, the following methods to read the change feed are available for each client SDK:

| **Method to read change feed** | **.NET** | **Java** | **Python** | **Node.js** |
| --- | --- | --- | --- | --- |
| [Change feed pull model](change-feed-pull-model.md) | [>= 3.32.0-preview](https://www.nuget.org/packages/Microsoft.Azure.Cosmos/3.32.0-preview) | [>= 4.42.0](https://mvnrepository.com/artifact/com.azure/azure-cosmos/4.37.0) |  No  |  No  |
| [Change feed processor](change-feed-processor.md) | No | [>= 4.42.0](https://mvnrepository.com/artifact/com.azure/azure-cosmos/4.42.0) | No | No |
| Azure Functions trigger | No | No | No | No |

> [!NOTE]
> Regardless of the [connection mode](sdk-connection-modes.md#available-connectivity-modes) that's configured in your application, all requests made with all versions and deletes change feed will use Gateway mode.

### Get started

To get started using all versions and deletes change feed mode, enroll in the preview via the [Preview Features page](../../azure-resource-manager/management/preview-features.md) in your Azure Subscription overview page. Search for the **AllVersionsAndDeletesChangeFeed** feature and select **Register**.

:::image type="content" source="media/change-feed-modes/enroll-in-preview.png" alt-text="Screenshot of All versions and deletes change feed mode feature in Preview Features page in Subscriptions overview in Azure portal.":::

Before you submit your request, ensure that you have at least one Azure Cosmos DB account in the subscription. This account can be an existing account or a new account that you created to try out the preview feature. If you have no accounts in the subscription when the Azure Cosmos DB team receives your request, the request is declined because there are no accounts to apply the feature to.

The Azure Cosmos DB team reviews your request and contacts you via email to confirm which Azure Cosmos DB accounts in the subscription you want to enroll in the preview. To use the preview, you must have [continuous backups](../continuous-backup-restore-introduction.md) configured for your Azure Cosmos DB account. Continuous backups can be enabled either before or after being admitted to the preview, but continuous backups must be enabled before you attempt to read from the change feed in all versions and deletes mode.

### Parse the response object

The response object is an array of items that represent each change. The array looks like the following example:

```json
[
    {  
        "current": { 
            <The current version of the item that changed. All the properties of your item will appear here. This will be empty for delete operations.>
         },  
        "previous" : { 
            <The previous version of the item that changed. If the change was a delete operation, the item that was deleted will appear here. This will be empty for create and replace operations.>
         },  
        "metadata": {
            "lsn": <A number that represents the batch ID. Many items can have the same lsn.>, 
            "changeType": <The type of change, either 'create', 'replace', or 'delete'.>, 
            "previousImageLSN" : <A number that represents the batch ID of the change prior to this one.>, 
            "timeToLiveExpired" : <For delete changes, it will be 'true' if it was deleted due to a TTL expiration and 'false' if it wasn't.>, 
            "crts": <A number that represents the Conflict Resolved Timestamp. It has the same format as _ts.> 
        } 
    }
]
```

### Limitations

* Supported for Azure Cosmos DB for NoSQL accounts. Other Azure Cosmos DB account types aren't supported.

* Continuous backups are required to use this change feed mode. The [limitations](../continuous-backup-restore-introduction.md#current-limitations) of using continuous backup can be found in the documentation.

* Reading changes on a container that existed before continuous backups were enabled on the account isn't supported.

* The ability to start reading the change feed from the beginning or to select a start time based on a past time stamp isn't currently supported. You can either start from "now" or from a previous [lease](change-feed-processor.md#components-of-the-change-feed-processor) or [continuation token](change-feed-pull-model.md#save-continuation-tokens).

* Receiving the previous version of items that have been updated isn't currently available.

* Accounts that have enabled [merging partitions](../merge.md) aren't supported.

---

## Next steps

Learn more about change feed in the following articles:

* [Change feed overview](../change-feed.md)
* [Change feed design patterns](./change-feed-design-patterns.md)
* [Options to read change feed](read-change-feed.md)
