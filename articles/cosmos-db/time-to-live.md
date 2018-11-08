---
title: Expire data in Azure Cosmos DB with time to live | Microsoft Docs
description: With TTL, Microsoft Azure Cosmos DB provides the ability to have documents automatically purged from the system after a period of time.
services: cosmos-db
keywords: time to live
author: SnehaGunda
manager: kfile

ms.service: cosmos-db
ms.devlang: na
ms.topic: conceptual
ms.date: 08/29/2017
ms.author: sngun

---
# Expire data in Azure Cosmos DB collections automatically with time to live
Applications can produce and store vast amounts of data. Some of this data, like machine generated event data, logs, and user session information is only useful for a finite period of time. Once the data becomes surplus to the needs of the application, it is safe to purge this data and reduce the storage needs of an application.

With "time to live" or TTL, Microsoft Azure Cosmos DB provides the ability to have documents automatically purged from the database after a period of time. The default time to live can be set at the collection level, and overridden on a per-document basis. Once TTL is set, either as a collection default or at a document level, Cosmos DB will automatically remove documents that exist after that period of time, in seconds, since they were last modified.

Time to live in Azure Cosmos DB uses an offset against when the document was last modified. To do this it uses the `_ts` field, which exists on every document. The _ts field is a unix-style epoch timestamp representing the date and time. The `_ts` field is updated every time a document is modified. 

## TTL behavior
The TTL feature is controlled by TTL properties at two levels - the collection level and the document level. The values are set in seconds and are treated as a delta from the `_ts` that the document was last modified at.

1. DefaultTTL for the collection
   
   * If missing (or set to null), documents are not deleted automatically.
   * If present and the value is set to "-1" = infinite – documents don’t expire by default
   * If present and the value is set to some number ("n") – documents expire "n" seconds after last modification
2. TTL for the documents: 
   
   * Property is applicable only if DefaultTTL is present for the parent collection.
   * Overrides the DefaultTTL value for the parent collection.

As soon as the document has expired (`ttl` + `_ts` <= current server time), the document is marked as "expired." No operation will be allowed on these documents after this time and they will be excluded from the results of any queries performed. The documents are physically deleted in the system, and are deleted in the background opportunistically at a later time. This does not consume any [Request Units (RUs)](request-units.md) from the collection budget.

The above logic can be shown in the following matrix:

|  | DefaultTTL missing/not set on the collection | DefaultTTL = -1 on collection | DefaultTTL = n' on collection |
| --- |:--- |:--- |:--- |
| TTL Missing on document |Nothing to override at document level since both the document and collection have no concept of TTL. |No documents in this collection will expire. |The documents in this collection will expire when interval n' elapses. |
| TTL = -1 on document |Nothing to override at the document level since the collection doesn’t define the DefaultTTL property that a document can override. TTL on a document is uninterpreted by the system. |No documents in this collection will expire. |The document with TTL=-1 in this collection will never expire. All other documents will expire after n' interval. |
| TTL = n on document |Nothing to override at the document level. TTL on a document is uninterpreted by the system. |The document with TTL = n will expire after interval n, in seconds. Other documents will inherit interval of -1 and never expire. |The document with TTL = n will expire after interval n, in seconds. Other documents will inherit n' interval from the collection. |

## Configuring TTL
By default, time to live is disabled by default in all Cosmos DB collections and on all documents. TTL can be set programmatically or by using the Azure portal. Use the following steps to configure TTL from Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/) and navigate to your Azure Cosmos DB account.  

2. Navigate to the collection you want to set the TTL value, Open the **Scale & Settings** pane. You can see that the Time to Live is by default set to **off**. You can change it to **on (no default)** or **on**.

   **off** - Documents are not deleted automatically.  
   **on (no default)** - This option sets the TTL value to "-1" (infinite) which means documents don’t expire by default.  
   **on** - Documents expire "n" seconds after last modification.  

   ![Set time to live](./media/time-to-live/set-ttl-in-portal.png)

## Enabling TTL
To enable TTL on a collection, or the documents within a collection, you need to set the DefaultTTL property of a collection to either -1 or a non-zero positive number. Setting the DefaultTTL to -1 means that by default all documents in the collection will live forever but the Cosmos DB service should monitor this collection for documents that have overridden this default.

    DocumentCollection collectionDefinition = new DocumentCollection();
    collectionDefinition.Id = "orders";
    collectionDefinition.PartitionKey.Paths.Add("/customerId");
    collectionDefinition.DefaultTimeToLive =-1; //never expire by default

    DocumentCollection ttlEnabledCollection = await client.CreateDocumentCollectionAsync(
        UriFactory.CreateDatabaseUri(databaseName),
        collectionDefinition,
        new RequestOptions { OfferThroughput = 20000 });

## Configuring default TTL on a collection
You are able to configure a default time to live at a collection level. To set the TTL on a collection, you need to provide a non-zero positive number that indicates the period, in seconds, to expire all documents in the collection after the last modified timestamp of the document (`_ts`). Or, you can set the default to -1, which implies that all documents inserted in to the collection will live indefinitely by default.

    DocumentCollection collectionDefinition = new DocumentCollection();
    collectionDefinition.Id = "orders";
    collectionDefinition.PartitionKey.Paths.Add("/customerId");
    collectionDefinition.DefaultTimeToLive = 90 * 60 * 60 * 24; // expire all documents after 90 days
    
    DocumentCollection ttlEnabledCollection = await client.CreateDocumentCollectionAsync(
        "/dbs/salesdb",
        collectionDefinition,
        new RequestOptions { OfferThroughput = 20000 });


## Setting TTL on a document
In addition to setting a default TTL on a collection, you can set specific TTL at a document level. Doing this will override the default of the collection.

* To set the TTL on a document, you need to provide a non-zero positive number, which indicates the period, in seconds, to expire the document after the last modified timestamp of the document (`_ts`).
* If a document has no TTL field, then the default of the collection will apply.
* If TTL is disabled at the collection level, the TTL field on the document will be ignored until TTL is enabled again on the collection.

Here's a snippet showing how to set the TTL expiration on a document:

    // Include a property that serializes to "ttl" in JSON
    public class SalesOrder
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }
        
        [JsonProperty(PropertyName="cid")]
        public string CustomerId { get; set; }
        
        // used to set expiration policy
        [JsonProperty(PropertyName = "ttl", NullValueHandling = NullValueHandling.Ignore)]
        public int? TimeToLive { get; set; }
        
        //...
    }
    
    // Set the value to the expiration in seconds
    SalesOrder salesOrder = new SalesOrder
    {
        Id = "SO05",
        CustomerId = "CO18009186470",
        TimeToLive = 60 * 60 * 24 * 30;  // Expire sales orders in 30 days 
    };


## Extending TTL on an existing document
You can reset the TTL on a document by doing any write operation on the document. Doing this will set the `_ts` to the current time, and the countdown to the document expiry, as set by the `ttl`, will begin again. If you wish to change the `ttl` of a document, you can update the field as you can do with any other settable field.

    response = await client.ReadDocumentAsync(
        "/dbs/salesdb/colls/orders/docs/SO05"), 
        new RequestOptions { PartitionKey = new PartitionKey("CO18009186470") });
    
    Document readDocument = response.Resource;
    readDocument.TimeToLive = 60 * 30 * 30; // update time to live
    
    response = await client.ReplaceDocumentAsync(readDocument);

## Removing TTL from a document
If a TTL has been set on a document and you no longer want that document to expire, then you can retrieve the document, remove the TTL field and replace the document on the server. When the TTL field is removed from the document, the default of the collection will be applied. To stop a document from expiring and not inherit from the collection then you need to set the TTL value to -1.

    response = await client.ReadDocumentAsync(
        "/dbs/salesdb/colls/orders/docs/SO05"), 
        new RequestOptions { PartitionKey = new PartitionKey("CO18009186470") });
    
    Document readDocument = response.Resource;
    readDocument.TimeToLive = null; // inherit the default TTL of the collection
    
    response = await client.ReplaceDocumentAsync(readDocument);

## Disabling TTL
To disable TTL entirely on a collection and stop the background process from looking for expired documents the DefaultTTL property on the collection should be deleted. Deleting this property is different from setting it to -1. Setting to -1 means new documents added to the collection will live forever but you can override this on specific documents in the collection. Removing this property entirely from the collection means that no documents will expire, even if there are documents that have explicitly overridden a previous default.

    DocumentCollection collection = await client.ReadDocumentCollectionAsync("/dbs/salesdb/colls/orders");
    
    // Disable TTL
    collection.DefaultTimeToLive = null;
    
    await client.ReplaceDocumentCollectionAsync(collection);

<a id="ttl-and-index-interaction"></a> 
## TTL and index interaction
Adding or changing the TTL setting on a collection changes the underlying index. When the TTL value is changed from Off to On, the collection is reindexed. When making changes to the indexing policy when the indexing mode is consistent, users will not notice a change to the index. When the indexing mode is set to lazy, the index is always catching up and if the TTL value is changed, the index is recreated from scratch. When the TTL value is changed and the index mode is set to lazy, queries done during the index rebuild do not return complete or correct results.

If you need exact data returned, do not change the TTL value when the indexing mode is set to lazy. Ideally consistent index should be chosen to ensure consistent query results. 

## FAQ
**What will TTL cost me?**

There is no additional cost to setting a TTL on a document.

**How long will it take to delete my document once the TTL is up?**

The documents are expired immediately once the TTL is up, and will not be accessible via CRUD or query APIs. 

**Will TTL on a document have any impact on RU charges?**

No, there will be no impact on RU charges for deletions of expired documents via TTL in Cosmos DB.

**Does the TTL feature only apply to entire documents, or can I expire individual document property values?**

TTL applies to the entire document. If you would like to expire just a portion of a document, then it is recommended that you extract the portion from the main document into a separate "linked" document and then use TTL on that extracted document.

**Does the TTL feature have any specific indexing requirements?**

Yes. The collection must have [indexing policy set](indexing-policies.md) to either Consistent or Lazy. Trying to set DefaultTTL on a collection with indexing set to None will result in an error, as will trying to turn off indexing on a collection that has a DefaultTTL already set.

## Next steps
To learn more about Azure Cosmos DB, refer to the service [*documentation*](https://azure.microsoft.com/documentation/services/cosmos-db/) page.

