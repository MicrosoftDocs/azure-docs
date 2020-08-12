---
title: Retired Azure Cosmos DB performance levels
description: Learn about the S1, S2, and S3 performance levels previously available in Azure Cosmos DB.
author: SnehaGunda
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 06/04/2018
ms.author: sngun

---
# Retiring the S1, S2, and S3 performance levels

> [!IMPORTANT] 
> The S1, S2, and S3 performance levels discussed in this article are being retired and are no longer available for new Azure Cosmos DB accounts.

This article provides an overview of S1, S2, and S3 performance levels, and discusses how the collections that use these performance levels can be migrated to single partitioned collections. After reading this article, you'll be able to answer the following questions:

- [Why are the S1, S2, and S3 performance levels are being retired?](#why-retired)
- [How do single partition collections and partitioned collections compare to the S1, S2, S3 performance levels?](#compare)
- [What do I need to do to ensure uninterrupted access to my data?](#uninterrupted-access)
- [How will my collection change after the migration?](#collection-change)
- [How will my billing change after I’m migrated to single partition collections?](#billing-change)
- [What if I need more than 20 GB of storage?](#more-storage-needed)
- [Can I change between the S1, S2, and S3 performance levels before the planned migration?](#change-before)
- [How do I migrate from the S1, S2, S3 performance levels to single partition collections on my own?](#migrate-diy)
- [How am I impacted if I'm an EA customer?](#ea-customer)

<a name="why-retired"></a>

## Why are the S1, S2, and S3 performance levels being retired?

The S1, S2, and S3 performance levels do not offer the flexibility that the standard Azure Cosmos DB offer provides. With the S1, S2, S3 performance levels, both the throughput and storage capacity were pre-set and did not offer elasticity. Azure Cosmos DB now offers the ability to customize your throughput and storage, offering you much more flexibility in your ability to scale as your needs change.

<a name="compare"></a>

## How do single partition collections and partitioned collections compare to the S1, S2, S3 performance levels?

The following table compares the throughput and storage options available in single partition collections, partitioned collections, and S1, S2, S3 performance levels. Here is an example for US East 2 region:

| Quota name  |Partitioned collection|Single partition collection|S1|S2|S3|
|---|---|---|---|---|---|
|Maximum throughput|Unlimited|10K RU/s|250 RU/s|1 K RU/s|2.5 K RU/s|
|Minimum throughput|2.5 K RU/s|400 RU/s|250 RU/s|1 K RU/s|2.5 K RU/s|
|Maximum storage|Unlimited|20 GB|20 GB|20 GB|20 GB|
|Price (monthly)|Throughput: $6 / 100 RU/s<br><br>Storage: $0.25/GB|Throughput: $6 / 100 RU/s<br><br>Storage: $0.25/GB|$25 USD|$50 USD|$100 USD|

Are you an EA customer? If so, see [How am I impacted if I'm an EA customer?](#ea-customer)

<a name="uninterrupted-access"></a>

## What do I need to do to ensure uninterrupted access to my data?

If you have an S1, S2, or S3 collection, you should migrate the collection to a single partition collection programmatically [by using the .NET SDK](#migrate-diy). 

<a name="collection-change"></a>

## How will my collection change after the migration?

If you have an S1 collection, you can migrate them to a single partition collection with 400 RU/s throughput. 400 RU/s is the lowest throughput available with single partition collections. However, the cost for 400 RU/s in a single partition collection is approximately the same as you were paying with your S1 collection and 250 RU/s – so you are not paying for the extra 150 RU/s available to you.

If you have an S2 collection, you can migrate them to a single partition collection with 1 K RU/s. You will see no change to your throughput level.

If you have an S3 collection, you can migrate them to a single partition collection with 2.5 K RU/s. You will see no change to your throughput level.

In each of these cases, after you migrate the collection, you will be able to customize your throughput level, or scale it up and down as needed to provide low-latency access to your users. 

<a name="billing-change"></a>

## How will my billing change after I migrated to the single partition collections?

Assuming you have 10 S1 collections, 1 GB of storage for each, in the US East region, and you migrate these 10 S1 collections to 10 single partition collections at 400 RU/sec (the minimum level). Your bill will look as follows if you keep the 10 single partition collections for a full month:

:::image type="content" source="./media/performance-levels/s1-vs-standard-pricing.png" alt-text="How S1 pricing for 10 collections compares to 10 collections using pricing for a single partition collection" border="false":::

<a name="more-storage-needed"></a>

## What if I need more than 20 GB of storage?

Whether you have a collection with S1, S2, or S3 performance level, or have a single partition collection, all of which have 20 GB of storage available, you can use the Azure Cosmos DB Data Migration tool to migrate your data to a partitioned collection with virtually unlimited storage. For information about the benefits of a partitioned collection, see [Partitioning and scaling in Azure Cosmos DB](sql-api-partition-data.md). 

<a name="change-before"></a>

## Can I change between the S1, S2, and S3 performance levels before the planned migration?

Only existing accounts with S1, S2, and S3 performance can be changed and alter performance level tiers programmatically [by using the .NET SDK](#migrate-diy). If you change from S1, S3, or S3 to a single partition collection, you cannot return to the S1, S2, or S3 performance levels.

<a name="migrate-diy"></a>

## How do I migrate from the S1, S2, S3 performance levels to single partition collections on my own?

You can migrate from the S1, S2, and S3 performance levels to single partition collections programmatically [by using the .NET SDK](#migrate-diy). You can do this on your own before the planned migration to benefit from the flexible throughput options available with single partition collections.

### Migrate to single partition collections by using the .NET SDK

This section only covers changing a collection's performance level using the [SQL .NET API](sql-api-sdk-dotnet.md), but the process is similar for our other SDKs.

Here is a code snippet for changing the collection throughput to 5,000 request units per second:
    
```csharp
    //Fetch the resource to be updated
    Offer offer = client.CreateOfferQuery()
                      .Where(r => r.ResourceLink == collection.SelfLink)    
                      .AsEnumerable()
                      .SingleOrDefault();

    // Set the throughput to 5000 request units per second
    offer = new OfferV2(offer, 5000);

    //Now persist these changes to the database by replacing the original resource
    await client.ReplaceOfferAsync(offer);
```

Visit [MSDN](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.aspx) to view additional examples and learn more about our offer methods:

* [**ReadOfferAsync**](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.readofferasync.aspx)
* [**ReadOffersFeedAsync**](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.readoffersfeedasync.aspx)
* [**ReplaceOfferAsync**](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.replaceofferasync.aspx)
* [**CreateOfferQuery**](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createofferquery.aspx)

<a name="ea-customer"></a>

## How am I impacted if I'm an EA customer?

EA customers will be price protected until the end of their current contract.

## Next steps
To learn more about pricing and managing data with Azure Cosmos DB, explore these resources:

1.	[Partitioning data in Cosmos DB](sql-api-partition-data.md). Understand the difference between single partition container and partitioned containers, as well as tips on implementing a partitioning strategy to scale seamlessly.
2.	[Cosmos DB pricing](https://azure.microsoft.com/pricing/details/cosmos-db/). Learn about the cost of provisioning throughput and consuming storage.
3.	[Request units](request-units.md). Understand the consumption of throughput for different operation types, for example Read, Write, Query.
