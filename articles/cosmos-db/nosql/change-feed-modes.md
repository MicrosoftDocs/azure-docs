---
title: Change feed modes in Azure Cosmos DB 
description: Overview of Azure Cosmos DB change feed modes  
author: jcocchi
ms.author: jucocchi
ms.reviewer: jucocchi
ms.service: cosmos-db
ms.custom: build-2023
ms.topic: conceptual
ms.date: 05/09/2023
---
# Change feed modes in Azure Cosmos DB
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

There are two change feed modes in Azure Cosmos DB. Each mode offers the same core functionality with differences including the operations captured in the feed, metadata available for each change, and retention period of changes. You can consume the change feed in different modes across multiple applications for the same Azure Cosmos DB container to fit the requirements of each workload.

> [!Note]
> Do you have any feedback about change feed modes? We want to hear it! Feel free to share feedback directly with the Azure Cosmos DB engineering team: cosmoschangefeed@microsoft.com

## Latest version change feed mode

Latest version mode is a persistent record of changes to items from creates and updates. You get the latest version of each item in the container. For example, if an item is created and then updated before you read the change feed, only the updated version appears in the change feed. Deletes aren't captured as changes, and when an item is deleted it's no longer be available in the feed. Latest version change feed mode is enabled by default and is compatible with all Azure Cosmos DB accounts except API for Table and API for PostgreSQL. This mode was previously the default way to consume the change feed.

## All versions and deletes change feed mode (preview)

All versions and deletes mode (preview) is a persistent record of all changes to items from create, update, and delete operations. You get a record of each change to items in the order that it occurred, including intermediate changes to an item between change feed reads. For example, if an item is created and then updated before you read the change feed, both the create and the update versions of the item appear in the change feed. To read from the change feed in all versions and deletes mode, you must have [continuous backups](../continuous-backup-restore-introduction.md) configured for your Azure Cosmos DB account. Turning on continuous backups creates the all versions and deletes change feed. You can only read changes that occurred within the continuous backup period when using this change feed mode. This mode is only compatible with Azure Cosmos DB for NoSQL accounts. Learn more about how to [sign up for the preview](#getting-started).

## Change feed use cases

### [Latest version mode](#tab/latest-version)

 Latest version mode provides an easy way to process both real time and historic changes to items in a container with the ability to go back to changes from the beginning of the container. 

The following are scenarios well suited to this mode:

* Migrations of an entire container to a secondary location.

* Ability to reprocess changes from the beginning of the container.

* Real time processing of changes to items in a container resulting from create and update operations.

* Workloads that don't need to capture deletes or intermediate changes between reads.

### [All versions and deletes mode (preview)](#tab/all-versions-and-deletes)

The all versions and deletes change feed mode enables new scenarios for change feed, and simplifies others. You can read every change that occurred to items even in cases where multiple changes occurred between change feed reads, identify the operation type of changes being processed, and get changes resulting from deletes. 

A few common scenarios this mode enables and enhances are: 

* Real-time transfer of data between two locations without having to implement a soft delete.

* Triggering logic based on incremental changes if multiple change operations for a given item are expected between change feed polls.

* Triggering alerts on delete operations, for example, auditing scenarios.

* The ability to process item creates, updates, and deletes differently based on operation type.

---

## Features of each mode

In addition to the [common features across all change feed modes](../change-feed.md#features-of-change-feed), each change feed mode has the following characteristics:

### [Latest version mode](#tab/latest-version)

* The change feed includes insert and update operations made to items within the container.

* This mode of change feed doesn't log deletes. You can capture deletes by setting a "soft-delete" flag within your items instead of deleting them directly. For example, you can add an attribute in the item called "deleted" with the value "true" and then set a TTL on the item. The change feed captures it as an update and the item is automatically deleted when the TTL expires. Alternatively, you can set a finite expiration period for your items with the [TTL capability](time-to-live.md). With this solution, you have to process the changes within a shorter time interval than the TTL expiration period.

* Only the most recent change for a given item is included in the change feed. Intermediate changes may not be available.

* When an item is deleted, it's no longer available in the change feed.

* Changes can be synchronized from any point-in-time, and there's no fixed data retention period for which changes are available.

* You can't filter the change feed for a specific type of operation. One possible alternative, is to add a "soft marker" on the item for updates and filter based on that when processing items in the change feed.

* The starting point to read change feed can be from the beginning of the container, from a point in time, from "now", or from a specific checkpoint. The precision of the start time is ~5 secs.

### [All versions and deletes mode (preview)](#tab/all-versions-and-deletes)

* The change feed includes insert, update and delete operations made to items within the container. Deletes from TTL expirations are also captured.

* Metadata is provided to determine the change type, including if a delete was due to a TTL expiration or not.

* Change feed items come in the order of their modification time. Deletes from TTL expirations aren't guaranteed to appear in the feed immediately after the item expires. They appear when the item is purged from the container. 

* All changes that occurred within the retention window set for continuous backups on the account are able to be read. Attempting to read changes that occurred outside of the retention window results in an error. For example, if your container was created eight days ago and your continuous backup period retention period is seven days, then you can only read changes from the last seven days. 

* The change feed starting point can be from "now" or from a specific checkpoint within your retention period. You can't read changes from the beginning of the container or from a specific point in time using this mode.

---

## Working with the change feed

Each mode is compatible with different methods to read the change feed for each language.

### [Latest version mode](#tab/latest-version)

You can use the following ways to consume changes from change feed in latest version mode:

| **Method to read change feed** | **.NET** | **Java** | **Python** | **Node/JS** |
| --- | --- | --- | --- | --- | --- | --- |
| [Change feed pull model](change-feed-pull-model.md) | Yes | Yes |  Yes  |  Yes  |
| [Change feed processor](change-feed-processor.md) | Yes | Yes | No | No |
| [Azure Functions trigger](change-feed-functions.md) | Yes | Yes | Yes | Yes |

### Parsing the response object

In latest version mode, the default response object is an array of items that have changed. Each item contains the standard metadata for any Azure Cosmos DB item including `_etag` and `_ts` with the addition of a new property `_lsn`.

The `_etag` format is internal and you shouldn't take dependency on it because it can change anytime. `_ts` is a modification or a creation timestamp. You can use `_ts` for chronological comparison. `_lsn` is a batch ID that is added for change feed only that represents the transaction ID. Many items may have same `_lsn`. ETag on FeedResponse is different from the `_etag` you see on the item. `_etag` is an internal identifier and it's used for concurrency control. The `_etag` property represents the version of the item, whereas the ETag property is used for sequencing the feed.

### [All versions and deletes mode (preview)](#tab/all-versions-and-deletes)

During the preview, the following methods to read the change feed are available for each client SDK:

| **Method to read change feed** | **.NET** | **Java** | **Python** | **Node/JS** |
| --- | --- | --- | --- | --- | --- | --- |
| [Change feed pull model](change-feed-pull-model.md) | [>= 3.32.0-preview](https://www.nuget.org/packages/Microsoft.Azure.Cosmos/3.32.0-preview) | [>= 4.42.0](https://mvnrepository.com/artifact/com.azure/azure-cosmos/4.37.0) |  No  |  No  |
| [Change feed processor](change-feed-processor.md) | No | [>= 4.42.0](https://mvnrepository.com/artifact/com.azure/azure-cosmos/4.42.0) | No | No |
| Azure Functions trigger | No | No | No | No |

> [!NOTE]
> Regardless of the [connection mode](sdk-connection-modes.md#available-connectivity-modes) configured in your application, all requests made with all versions and deletes change feed will use Gateway mode.

### Getting started

To get started using all versions and deletes change feed mode, enroll in the preview via the [Preview Features page](../../azure-resource-manager/management/preview-features.md) in your Azure Subscription overview page. Search for the **AllVersionsAndDeletesChangeFeed** feature and select **Register**.

:::image type="content" source="media/change-feed-modes/enroll-in-preview.png" alt-text="Screenshot of All versions and deletes change feed mode feature in Preview Features page in Subscriptions overview in Azure portal.":::

Before submitting your request, ensure that you have at least one Azure Cosmos DB account in the subscription. This account may be an existing account or a new one you've created to try out the preview feature. If you have no accounts in the subscription when the Azure Cosmos DB team receives your request, it will be declined, as there are no accounts to apply the feature to.

The Azure Cosmos DB team will review your request and contact you via email to confirm which account(s) in the subscription you want to enroll in the preview. To use the preview, you must have [continuous backups](../continuous-backup-restore-introduction.md) configured for your Azure Cosmos DB account. Continuous backups can be enabled either before or after being admitted to the preview, but they must be enabled before attempting to read from the change feed in all versions and deletes mode.

### Parsing the response object

The response object is an array of items representing each change with the following shape:

```json
[
    {  
        "current": { 
            <This is the current version of the item that changed. All of the properties of your item will appear here. This will be empty for delete operations.>
         },  
        "previous" : { 
            <This is the previous version of the item that changed. If the change was a delete operation, the item that was deleted will appear here. This will be empty for create and replace operations.>
         },  
        "metadata": {
            "lsn": <This is a number representing the batch id. Many items may have the same lsn.>, 
            "changeType": <The type of change, either 'create', 'replace', or 'delete'.>, 
            "previousImageLSN" : <This is a number representing the batch id of the change prior to this one.>, 
            "timeToLiveExpired" : <For delete changes, it will be 'true' if it was deleted due to a TTL expiration or 'false' if not.>, 
            "crts": <This is a number representing the Conflict Resolved Timestamp. It has the same format as _ts.> 
        } 
    }
]
```

### Limitations

* Supported for Azure Cosmos DB for NoSQL accounts. Other Azure Cosmos DB account types aren't supported.

* Continuous backups are required to use this change feed mode, the [limitations](../continuous-backup-restore-introduction.md#current-limitations) of which can be found in the documentation.

* Reading changes on a container that existed before continuous backups were enabled on the account isn't supported.

* The ability to start reading the change feed from the beginning or select a start time based on a past timestamp isn't currently supported. You may either start from "now" or from a previous [lease](change-feed-processor.md#components-of-the-change-feed-processor) or [continuation token](change-feed-pull-model.md#saving-continuation-tokens).

* Receiving the previous version of items that have been updated isn't currently available.

* Accounts using [Private Endpoints](../how-to-configure-private-endpoints.md) aren't supported.

* Accounts that have enabled [merging partitions](../merge.md) aren't supported.

---

## Next steps

You can now proceed to learn more about change feed in the following articles:

* [Change feed overview](../change-feed.md)
* [Change feed design patterns](./change-feed-design-patterns.md)
* [Options to read change feed](read-change-feed.md)
