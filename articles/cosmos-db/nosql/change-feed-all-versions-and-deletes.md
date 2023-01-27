---
title: Change feed mode all versions and deletes in Azure Cosmos DB 
description: Use Azure Cosmos DB change feed mode all versions and deletes to track changes in documents from create, update, or delete operations  
author: jcocchi
ms.author: jucocchi
ms.reviewer: jucocchi
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 01/27/2023
---
# Change feed mode all versions and deletes in Azure Cosmos DB (preview)
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

All versions and deletes (preview) mode for the Azure Cosmos DB change feed is a persistent record of all changes to items from create, update, and delete operations. You'll get a record of each change to items in the order that it occurred, including intermediate changes to an item between change feed reads. To read from the change feed in all versions and deletes mode, you must have [continuous backups](../continuous-backup-restore-introduction.md) configured for your Azure Cosmos DB account. Turning on continuous backups creates Azure Cosmos DB’s all versions and deletes change log, and you'll only be able to read changes that occurred within the continuous backup period when using this change feed mode.

## Use cases for all versions and deletes change feed mode

The all versions and deletes change feed mode enables new scenarios for change feed, and simplifies others. You'll be able to read every change that occurred to items even in cases where multiple changes occurred between change feed reads, identify the operation type of changes being processed, and get changes resulting from deletes. 

A few common scenarios this mode will enhance/ enable are: 

* Real-time transfer of data between two locations (ex. writing a copy of data to cold storage) without having to implement a soft delete.

* Triggering logic based on incremental changes if multiple change operations for a given item are expected between change feed polls.

* Triggering alerts on delete operations, for example, auditing scenarios.

* The ability to process item creates, updates, and deletes differently based on operation type.

## Features of all versions and deletes change feed mode

In addition to the [common features across all change feed modes](../change-feed.md#features-of-change-feed), all versions and deletes mode has the following characteristics:

* The change feed includes insert, update and delete operations made to items within the container. Deletes from TTL expirations are also captured.

* Metadata is provided to determine the change type, including if a delete was due to a TTL expiration or not.

* Change feed items come in the order of their modification time. Deletes from TTL expirations aren't guaranteed to appear in the feed immediately after the item expires. They'll appear when the item is purged from the container. 

* All changes that occurred within the retention window set for continuous backups on the account will be able to be read. Attempting to read changes that occurred outside of the retention window will result in an error. For example, if your container was created eight days ago and your continuous backup period retention period is seven days, you'll only be able to read changes from the last seven days. You won't be able to read changes from the beginning of the container in this mode.

## Getting started

To get started using all versions and deletes change feed mode, enroll in the preview via the [Preview Features page](../../azure-resource-manager/management/preview-features.md) in your Azure Subscription overview page. Search for the **All versions and deletes change feed mode** feature and select **Register**.

:::image type="content" source="media/change-feed-all-versions-and-deletes/enroll-in-preview.png" alt-text="Screenshot of All versions and deletes change feed mode feature in Preview Features page in Subscriptions overview in Azure portal.":::

Before submitting your request, ensure that you have at least one Azure Cosmos DB account in the subscription. This account may be an existing account or a new one you've created to try out the preview feature. If you have no accounts in the subscription when the Azure Cosmos DB team receives your request, it will be declined, as there are no accounts to apply the feature to.

The Azure Cosmos DB team will review your request and contact you via email to confirm which account(s) in the subscription you want to enroll in the preview. To use the preview, you must have [continuous backups](../continuous-backup-restore-introduction.md) configured for your Azure Cosmos DB account. Continuous backups can be enabled either before or after being admitted to the preview, but must be enabled before attempting to read from the change feed in all versions and deletes mode.

## Working with all versions and deletes change feed mode

During the preview, the following methods to read the change feed are available for each client SDK:

| **Method to read change feed** | **.NET** | **Java** | **Python** | **Node/JS** |
| --- | --- | --- | --- | --- | --- | --- |
| [Change feed pull model](change-feed-pull-model.md) | [>= 3.31.0-preview](https://www.nuget.org/packages/Microsoft.Azure.Cosmos/3.17.0-preview) | [>= 4.37.0](https://mvnrepository.com/artifact/com.azure/azure-cosmos/4.37.0) |  No  |  No  |
| [Change feed processor](change-feed-processor.md) | No | [>= 4.37.0](https://mvnrepository.com/artifact/com.azure/azure-cosmos/4.37.0) | No | No |
| Azure Functions trigger | No | No | No | No |

> [!NOTE]
> Regardless of the [connection mode](sdk-connection-modes.md#available-connectivity-modes) configured in your application, all requests made with all versions and deletes change feed will use Gateway mode.

### Parsing the response object

The response object will be an array of items representing each change with the following shape:

```json
[
    {  
        "current": { 
            <This is the current version of the item that changed. All of the properties of your item will appear here. This will be    empty for delete operations.>
         },  
        "previous" : { 
            <This is the previous version of the item that changed. If the change was a delete operation, the item that was deleted will appear here. This will be empty for create and replace operations.>
         },  
        "metadata": {
            "lsn": <This is a number representing the batch id. Many items may have the same lsn.>, 
            "changeType": <The type of change. Options: “create”, “replace”, “delete”>, 
            "previousImageLSN" : <This is a number representing the batch id of the change prior to this one.>, 
            "timeToLiveExpired" : <For delete changes, was it because of a TTL expiration or not? Options: “true”, “false”>, 
            "crts": <This is a number representing the Conflict Resolved Timestamp. It has the same format as _ts.> 
        } 
    }
]
```

## Limitations

* Supported for Azure Cosmos DB for NoSQL accounts. Other Azure Cosmos DB account types are not supported.

* Continuous backups are required to use this change feed mode, the limitations of which can be found [here](../continuous-backup-restore-introduction.md#current-limitations).

* Reading changes on a container that existed before continuous backups were enabled on the account is not supported.

* The ability to select a start time based on a past timestamp isn't currently supported. You may either start from "now" or from a previous [lease](change-feed-processor.md#components-of-the-change-feed-processor) or [continuation token](change-feed-pull-model.md#saving-continuation-tokens).

* Receiving the previous version of items that have been changed is not currently available.

* Accounts using [Private Endpoints](../how-to-configure-private-endpoints.md) aren't supported.

* Accounts using [attachments](../attachments.md) aren't supported.

## Next steps

You can now proceed to learn more about change feed in the following articles:

* [Change feed overview](../change-feed.md)
* [Options to read change feed](read-change-feed.md)
* [Latest version change feed mode](change-feed-latest-version.md)
