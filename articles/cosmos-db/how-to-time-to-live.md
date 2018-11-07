---
title: Learn how to manage Time to Live in Azure Cosmos DB
description: Learn how to manage time to live in Azure Cosmos DB
keywords: how-to-live, TTL, azure cosmos db, azure, Microsoft azure
services: cosmos-db
author: markjbrown

ms.service: cosmos-db
ms.topic: sample
ms.date: 11/14/2018
ms.author: mjbrown
---

# How to manage Time to Live

In Azure Cosmos DB, you can choose configure Time to Live (TTL) at the Container level, or you can override it at item level, if set for the Container. TTL can be configured for a Container using Azure Portal or SDK's. Item level overrides can be configured by the SDKs.

## Enable Time to live on a container using Azure Portal

Use the following steps to enable Time to live on a container with no expiration. Enable this to allow TTL to be overridden at the item level. You can also set the TTL by entering a non-zero value for seconds.

1. Sign in to [Azure portal](https://portal.azure.com/).

2. Create or select an existing account.

3. Open the **Data Explorer**

4. Select an existing container to modify.
   * Select **Scale & Settings**.
   * Under **Setting** find, **Time to Live**.
   * Select **On (no default)** or set a TTL value
   * Click **Save** at the top.

![Configure Time to live in Azure Portal](./media/how-to-time-to-live/how-to-time-to-live-portal.png)

## Enable Time to live on a container using SDK

### <a id="dotnet-enable-noexpiry"></a>.NET

```csharp
// Create a new collection with TTL enabled and no expiration
DocumentCollection collectionDefinition = new DocumentCollection();
collectionDefinition.Id = "myContainer";
collectionDefinition.PartitionKey.Paths.Add("/myPartitionKey");
collectionDefinition.DefaultTimeToLive = -1; //(never expire by default)

DocumentCollection ttlEnabledCollection = await client.CreateDocumentCollectionAsync(
    UriFactory.CreateDatabaseUri("myDatabaseName"),
    collectionDefinition,
    new RequestOptions { OfferThroughput = 20000 });
```

## Set Time to live on a container using SDK

### <a id="dotnet-enable-withexpiry"></a>.NET

To set the time to live on a container, you need to provide a non-zero positive number that indicates the period, in seconds, to expire all items in the container after the last modified timestamp of the item `_ts`.

```csharp
// Create a new collection with TTL enabled and a 90 day expiration
DocumentCollection collectionDefinition = new DocumentCollection();
collectionDefinition.Id = "myContainer";
collectionDefinition.PartitionKey.Paths.Add("/myPartitionKey");
collectionDefinition.DefaultTimeToLive = 90 * 60 * 60 * 24; // expire all documents after 90 days

DocumentCollection ttlEnabledCollection = await client.CreateDocumentCollectionAsync(
    UriFactory.CreateDatabaseUri("myDatabaseName"),
    collectionDefinition,
    new RequestOptions { OfferThroughput = 20000 });
```

## Set time to live on an item

In addition to setting a default time to live on a container, you can set a time to live at an item level. Doing this will override the default TTL of the container that the item belongs to.

* To set the TTL on an item, you need to provide a non-zero positive number, which indicates the period, in seconds, to expire the item after the last modified timestamp of the item `_ts`.
* If an item has no TTL field, then the default of the container will apply.
* If TTL is disabled at the container level, the TTL field on the item will be ignored until TTL is enabled again on the container.

### <a id="dotnet-set-ttl-item"></a>.NET

```csharp
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
```

## Extend time to live on an item

You can reset the time to live on an item by doing any write/update operation on the item. Doing this will set the `_ts` to the current time, and the countdown to the item expiry, as set by the TTL, will begin again. If you wish to change the TTL of an item, you can update the field as you can do with any other field.

### <a id="dotnet-extend-ttl-item"></a>.NET

```csharp
// This examples leverages the Sales Order class above.
// Read a document, update its TTL, save it.
response = await client.ReadDocumentAsync(
    "/dbs/salesdb/colls/orders/docs/SO05"),
    new RequestOptions { PartitionKey = new PartitionKey("CO18009186470") });

Document readDocument = response.Resource;
readDocument.TimeToLive = 60 * 30 * 30; // update time to live
response = await client.ReplaceDocumentAsync(readDocument);
```

## Turn off time to live for an item

If a time to live has been set on an item and you no longer want that item to expire, then you can retrieve the item, remove the TTL field and replace the item on the server. When the TTL field is removed from the item, the default of the container that this item belongs to will be applied. To stop an item from expiring and not inherit from the container you need to set the TTL value to -1.

### <a id="dotnet-turn-off-ttl-item"></a>.NET

```csharp
// This examples leverages the Sales Order class above.
// Read a document, turn off its override TTL, save it.
response = await client.ReadDocumentAsync(
    "/dbs/salesdb/colls/orders/docs/SO05"),
    new RequestOptions { PartitionKey = new PartitionKey("CO18009186470") });

Document readDocument = response.Resource;
readDocument.TimeToLive = null; // inherit the default TTL of the collection

response = await client.ReplaceDocumentAsync(readDocument);
```

## Disable time to live

To disable time to live entirely on a container and stop the background process from looking for expired items, the `DefaultTimeToLive` property on the container should be deleted. Deleting this property is different from setting it to -1. Setting it to -1 means new items added to the container will live forever, but you can override this on specific items in the container. Removing this property entirely from the container means that no items will expire, even if there are items that have explicitly overridden a previous default.

### <a id="dotnet-disable-ttl"></a>.NET

```csharp
// Retrieve collection, update DefaultTimeToLive to null
DocumentCollection collection = await client.ReadDocumentCollectionAsync("/dbs/salesdb/colls/orders");
// Disable TTL
collection.DefaultTimeToLive = null;
await client.ReplaceDocumentCollectionAsync(collection);
```

## Next Steps

Learn more about time to live in the following articles:

* [Time to live](time-to-live.md)