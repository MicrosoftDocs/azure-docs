---
title: Learn how to configure and manage Time to Live in Azure Cosmos DB
description: Learn how to configure and manage time to live in Azure Cosmos DB
author: markjbrown
ms.service: cosmos-db
ms.topic: sample
ms.date: 05/23/2019
ms.author: mjbrown
---

# Configure time to live in Azure Cosmos DB

In Azure Cosmos DB, you can choose to configure Time to Live (TTL) at the container level, or you can override it at an item level after setting for the container. You can configure TTL for a container by using Azure portal or the language-specific SDKs. Item level TTL overrides can be configured by using the SDKs.

## Enable time to live on a container using Azure portal

Use the following steps to enable time to live on a container with no expiration. Enable this to allow TTL to be overridden at the item level. You can also set the TTL by entering a non-zero value for seconds.

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Create a new Azure Cosmos account or select an existing account.

3. Open the **Data Explorer** pane.

4. Select an existing container, expand it and modify the following values:

   * Open the **Scale & Settings** window.
   * Under **Setting** find, **Time to Live**.
   * Select **On (no default)** or select **On** and set a TTL value
   * Click **Save** to save the changes.

   ![Configure Time to live in Azure portal](./media/how-to-time-to-live/how-to-time-to-live-portal.png)


- When DefaultTimeToLive is null then your Time to Live is Off
- When DefaultTimeToLive is -1 then your Time to Live setting is On (No default)
- When DefaultTimeToLive has any other Int value (except 0) your Time to Live setting is On

## Enable time to live on a container using SDK

### <a id="dotnet-enable-noexpiry"></a>.NET SDK

```csharp
// Create a new collection with TTL enabled and without any expiration value
DocumentCollection collectionDefinition = new DocumentCollection();
collectionDefinition.Id = "myContainer";
collectionDefinition.PartitionKey.Paths.Add("/myPartitionKey");
collectionDefinition.DefaultTimeToLive = -1; //(never expire by default)

DocumentCollection ttlEnabledCollection = await client.CreateDocumentCollectionAsync(
    UriFactory.CreateDatabaseUri("myDatabaseName"),
    collectionDefinition,
    new RequestOptions { OfferThroughput = 20000 });
```

## Set time to live on a container using SDK

### <a id="dotnet-enable-withexpiry"></a>.NET SDK

To set the time to live on a container, you need to provide a non-zero positive number that indicates the time period in seconds. Based on the configured TTL value, all items in the container after the last modified timestamp of the item `_ts` are deleted.

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

### <a id="nodejs-enable-withexpiry"></a>NodeJS SDK

```javascript
const containerDefinition = {
          id: "sample container1",
        };

async function createcontainerWithTTL(db: Database, containerDefinition: ContainerDefinition, collId: any, defaultTtl: number) {
      containerDefinition.id = collId;
      containerDefinition.defaultTtl = defaultTtl;
      await db.containers.create(containerDefinition);
}
```

## Set time to live on an item

In addition to setting a default time to live on a container, you can set a time to live for an item. Setting time to live at the item level will override the default TTL of the item in that container.

* To set the TTL on an item, you need to provide a non-zero positive number, which indicates the period, in seconds, to expire the item after the last modified timestamp of the item `_ts`.

* If the item doesn't have a TTL field, then by default, the TTL set to the container will apply to the item.

* If TTL is disabled at the container level, the TTL field on the item will be ignored until TTL is re-enabled on the container.

### <a id="portal-set-ttl-item"></a>Azure portal

Use the following steps to enable time to live on an item:

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Create a new Azure Cosmos account or select an existing account.

3. Open the **Data Explorer** pane.

4. Select an existing container, expand it and modify the following values:

   * Open the **Scale & Settings** window.
   * Under **Setting** find, **Time to Live**.
   * Select **On (no default)** or select **On** and set a TTL value. 
   * Click **Save** to save the changes.

5. Next navigate to the item for which you want to set time to live, add the `ttl` property and select **Update**. 

   ```json
   {
    "id": "1",
    "_rid": "Jic9ANWdO-EFAAAAAAAAAA==",
    "_self": "dbs/Jic9AA==/colls/Jic9ANWdO-E=/docs/Jic9ANWdO-EFAAAAAAAAAA==/",
    "_etag": "\"0d00b23f-0000-0000-0000-5c7712e80000\"",
    "_attachments": "attachments/",
    "ttl": 10,
    "_ts": 1551307496
   }
   ```

### <a id="dotnet-set-ttl-item"></a>.NET SDK

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
    public int? ttl { get; set; }

    //...
}
// Set the value to the expiration in seconds
SalesOrder salesOrder = new SalesOrder
{
    Id = "SO05",
    CustomerId = "CO18009186470",
    ttl = 60 * 60 * 24 * 30;  // Expire sales orders in 30 days
};
```

### <a id="nodejs-set-ttl-item"></a>NodeJS SDK

```javascript
const itemDefinition = {
          id: "doc",
          name: "sample Item",
          key: "value", 
          ttl: 2
        };
```


## Reset time to live

You can reset the time to live on an item by performing a write or update operation on the item. The write or update operation will set the `_ts` to the current time, and the TTL for the item to expire  will begin again. If you wish to change the TTL of an item, you can update the field just as you update any other field.

### <a id="dotnet-extend-ttl-item"></a>.NET SDK

```csharp
// This examples leverages the Sales Order class above.
// Read a document, update its TTL, save it.
response = await client.ReadDocumentAsync(
    "/dbs/salesdb/colls/orders/docs/SO05"),
    new RequestOptions { PartitionKey = new PartitionKey("CO18009186470") });

Document readDocument = response.Resource;
readDocument.ttl = 60 * 30 * 30; // update time to live
response = await client.ReplaceDocumentAsync(readDocument);
```

## Turn off time to live

If time to live has been set on an item and you no longer want that item to expire, then you can get the item, remove the TTL field, and replace the item on the server. When the TTL field is removed from the item, the default TTL value assigned to the container is applied to the item. Set the TTL value to -1 to prevent an item from expiring and to not inherit the TTL value from the container.

### <a id="dotnet-turn-off-ttl-item"></a>.NET SDK

```csharp
// This examples leverages the Sales Order class above.
// Read a document, turn off its override TTL, save it.
response = await client.ReadDocumentAsync(
    "/dbs/salesdb/colls/orders/docs/SO05"),
    new RequestOptions { PartitionKey = new PartitionKey("CO18009186470") });

Document readDocument = response.Resource;
readDocument.ttl = null; // inherit the default TTL of the collection

response = await client.ReplaceDocumentAsync(readDocument);
```

## Disable time to live

To disable time to live on a container and stop the background process from checking for expired items, the `DefaultTimeToLive` property on the container should be deleted. Deleting this property is different from setting it to -1. When you set it to -1, new items added to the container will live forever, however you can override this value on specific items in the container. When you remove the TTL property from the container the items will never expire, even if there are they have explicitly overridden the previous default TTL value.

### <a id="dotnet-disable-ttl"></a>.NET SDK

```csharp
// Get the collection, update DefaultTimeToLive to null
DocumentCollection collection = await client.ReadDocumentCollectionAsync("/dbs/salesdb/colls/orders");
// Disable TTL
collection.DefaultTimeToLive = null;
await client.ReplaceDocumentCollectionAsync(collection);
```

## Next steps

Learn more about time to live in the following article:

* [Time to live](time-to-live.md)
