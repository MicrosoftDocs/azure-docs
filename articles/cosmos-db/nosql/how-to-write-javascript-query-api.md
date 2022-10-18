---
title: Write stored procedures and triggers using the JavaScript query API in Azure Cosmos DB 
description: Learn how to write stored procedures and triggers using the JavaScript Query API in Azure Cosmos DB 
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 05/07/2020
ms.author: sidandrews
ms.reviewer: jucocchi
ms.devlang: javascript
ms.custom: devx-track-js
---

# How to write stored procedures and triggers in Azure Cosmos DB by using the JavaScript query API
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Azure Cosmos DB allows you to perform optimized queries by using a fluent JavaScript interface without any knowledge of SQL language that can be used to write stored procedures or triggers. To learn more about JavaScript Query API support in Azure Cosmos DB, see [Working with JavaScript language integrated query API in Azure Cosmos DB](javascript-query-api.md) article.

## <a id="stored-procedures"></a>Stored procedure using the JavaScript query API

The following code sample is an example of how the JavaScript query API is used in the context of a stored procedure. The stored procedure inserts an Azure Cosmos DB item that is specified by an input parameter, and updates a metadata document by using the `__.filter()` method, with minSize, maxSize, and totalSize based upon the input item's size property.

> [!NOTE]
> `__` (double-underscore) is an alias to `getContext().getCollection()` when using the JavaScript query API.

```javascript
/**
 * Insert an item and update metadata doc: minSize, maxSize, totalSize based on item.size.
 */
function insertDocumentAndUpdateMetadata(item) {
  // HTTP error codes sent to our callback function by CosmosDB server.
  var ErrorCode = {
    RETRY_WITH: 449,
  }

  var isAccepted = __.createDocument(__.getSelfLink(), item, {}, function(err, item, options) {
    if (err) throw err;

    // Check the item (ignore items with invalid/zero size and metadata itself) and call updateMetadata.
    if (!item.isMetadata && item.size > 0) {
      // Get the metadata. We keep it in the same container. it's the only item that has .isMetadata = true.
      var result = __.filter(function(x) {
        return x.isMetadata === true
      }, function(err, feed, options) {
        if (err) throw err;

        // We assume that metadata item was pre-created and must exist when this script is called.
        if (!feed || !feed.length) throw new Error("Failed to find the metadata item.");

        // The metadata item.
        var metaItem = feed[0];

        // Update metaDoc.minSize:
        // for 1st document use doc.Size, for all the rest see if it's less than last min.
        if (metaItem.minSize == 0) metaItem.minSize = item.size;
        else metaItem.minSize = Math.min(metaItem.minSize, item.size);

        // Update metaItem.maxSize.
        metaItem.maxSize = Math.max(metaItem.maxSize, item.size);

        // Update metaItem.totalSize.
        metaItem.totalSize += item.size;

        // Update/replace the metadata item in the store.
        var isAccepted = __.replaceDocument(metaItem._self, metaItem, function(err) {
          if (err) throw err;
          // Note: in case concurrent updates causes conflict with ErrorCode.RETRY_WITH, we can't read the meta again
          //       and update again because due to Snapshot isolation we will read same exact version (we are in same transaction).
          //       We have to take care of that on the client side.
        });
        if (!isAccepted) throw new Error("replaceDocument(metaItem) returned false.");
      });
      if (!result.isAccepted) throw new Error("filter for metaItem returned false.");
    }
  });
  if (!isAccepted) throw new Error("createDocument(actual item) returned false.");
}
```

## Next steps

See the following articles to learn about stored procedures, triggers, and user-defined functions in Azure Cosmos DB:

* [How to work with stored procedures, triggers, user-defined functions in Azure Cosmos DB](how-to-use-stored-procedures-triggers-udfs.md)

* [How to register and use stored procedures in Azure Cosmos DB](how-to-use-stored-procedures-triggers-udfs.md#how-to-run-stored-procedures)

* How to register and use [pre-triggers](how-to-use-stored-procedures-triggers-udfs.md#how-to-run-pre-triggers) and [post-triggers](how-to-use-stored-procedures-triggers-udfs.md#how-to-run-post-triggers) in Azure Cosmos DB

* [How to register and use user-defined functions in Azure Cosmos DB](how-to-use-stored-procedures-triggers-udfs.md#how-to-work-with-user-defined-functions)

* [Synthetic partition keys in Azure Cosmos DB](synthetic-partition-keys.md)
