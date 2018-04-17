---
title: Request units & estimating throughput - Azure Cosmos DB | Microsoft Docs
description: Learn about how to understand, specify, and estimate request unit requirements in Azure Cosmos DB.
services: cosmos-db
author: SnehaGunda
manager: kfile
documentationcenter: ''

ms.assetid: d0a3c310-eb63-4e45-8122-b7724095c32f
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/09/2018
ms.author: rimman

---
# Request Units in Azure Cosmos DB

[Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) is Microsoft's globally distributed multi-model database. With Azure Cosmos DB, you don't have to rent virtual machines, deploy software, or monitor databases. Azure Cosmos DB is operated and continuously monitored by Microsoft top engineers to deliver world class availability, performance, and data protection. You can access your data using APIs of your choice, such as the [SQL API](documentdb-introduction.md), [MongoDB API](mongodb-introduction.md), [Table API](table-introduction.md), and graph via the [Gremlin API](graph-introduction.md) - are all natively supported. 

The currency of Azure Cosmos DB is the **Request Unit (RU)**. With RUs, you do not need to reserve read/write capacities or provision CPU, memory, and IOPS. Azure Cosmos DB supports a number of APIs with different operations ranging from simple reads and writes to complex graph queries. Since not all requests are equal, they are assigned a normalized quantity of **request units** based on the amount of computation required to serve the request. The number of request units for an operation is deterministic, and you can track the number of request units consumed by any operation in Azure Cosmos DB via a response header. 

To provide predictable performance, you need to reserve throughput in units of 100 RU/second. You can [estimate your throughput needs](request-units.md#estimating-throughput-needs) by using the Azure Cosmos DB [request unit calculator](https://www.documentdb.com/capacityplanner).

![Throughput calculator][5]

After reading this article, you'll be able to answer the following questions:  

* What are request units and request charges in Azure Cosmos DB?
* How do I specify request unit capacity for a container in Azure Cosmos DB?
* How do I estimate my application's request unit needs?
* What happens if I exceed request unit capacity for a container in Azure Cosmos DB?

As Azure Cosmos DB is a multi-model database; it is important to note that this article is applicable to all data models and APIs in Azure Cosmos DB. This article uses generic terms such as *container* and an *item* to refer generically to a collection, graph, or a table and a document, a node, or an entity, respectively.

## Request units and request charges
Azure Cosmos DB delivers fast, predictable performance by *reserving* resources to satisfy your application's throughput needs.  Because application load and access patterns change over time, Azure Cosmos DB allows you to easily increase or decrease the amount of reserved throughput available to your application.

With Azure Cosmos DB, reserved throughput is specified in terms of request units processing per second. You can think of request units as throughput currency, whereby you *reserve* an amount of guaranteed request units available to your application on per second basis.  Each operation in Azure Cosmos DB - writing a document, performing a query, updating a document - consumes CPU, memory, and IOPS.  That is, each operation incurs a *request charge*, which is expressed in *request units*.  Understanding the factors that impact request unit charges, along with your application's throughput requirements, enables you to run your application as cost effectively as possible. The Data Explorer in the Azure portal is also a wonderful tool to test the core of a query.

We recommend getting started by watching the following video, where Azure Cosmos DB Program Manager Andrew Liu discusses request units.

> [!VIDEO https://www.youtube.com/embed/stk5WSp5uX0]
> 
> 

## Specifying request unit capacity in Azure Cosmos DB
When starting a new container you specify the number of request units per second (RU per second) you want reserved. Based on the provisioned throughput, Azure Cosmos DB allocates physical partitions to host your container and splits/rebalances data across partitions as it grows.

Azure Cosmos DB containers can be created as fixed or unlimited. Fixed-size containers have a maximum limit of 10 GB and 10,000 RU/s throughput. To create an unlimited container you must specify a minimum throughput of 1,000 RU/s and a [partition key](partition-data.md). Since your data might have to be split across multiple partitions, it is necessary to pick a partition key that has a high cardinality (100 to millions of distinct values). By selecting a partition key with many distinct values you ensure that your container/table/graph and requests can be scaled uniformly by Azure Cosmos DB. 

> [!NOTE]
> A partition key is a logical boundary, and not a physical one. Therefore, you do not need to limit the number of distinct partition key values. It is in fact better to have more distinct partition key values than less, as Azure Cosmos DB has more load balancing options.

Here is a code snippet for creating a container with 3,000 request units per second using the .NET SDK:

```csharp
DocumentCollection myCollection = new DocumentCollection();
myCollection.Id = "coll";
myCollection.PartitionKey.Paths.Add("/deviceId");

await client.CreateDocumentCollectionAsync(
    UriFactory.CreateDatabaseUri("db"),
    myCollection,
    new RequestOptions { OfferThroughput = 3000 });
```

Azure Cosmos DB operates on a reservation model for throughput. That is, you are billed for the amount of throughput *reserved*, regardless of how much of that throughput is actively *used*. As your application's load, data, and usage patterns change you can easily scale up and down the amount of reserved RUs through SDKs or using the [Azure Portal](https://portal.azure.com).

Each container is mapped to an `Offer` resource in Azure Cosmos DB, which has metadata about the provisioned throughput. You can change the allocated throughput by looking up the corresponding offer resource for a container, then updating it with the new throughput value. Here is a code snippet for changing the throughput of a container to 5,000 request units per second using the .NET SDK:

```csharp
// Fetch the resource to be updated
Offer offer = client.CreateOfferQuery()
                .Where(r => r.ResourceLink == collection.SelfLink)    
                .AsEnumerable()
                .SingleOrDefault();

// Set the throughput to 5000 request units per second
offer = new OfferV2(offer, 5000);

// Now persist these changes to the database by replacing the original resource
await client.ReplaceOfferAsync(offer);
```

There is no impact to the availability of your container when you change the throughput. Typically the new reserved throughput is effective within seconds on application of the new throughput.

## Throughput isolation in globally distributed databases

When you have replicated your database to more than one region, Azure Cosmos DB provides throughput isolation to ensure that RU usage in one region does not impact RU usage in another region. For example, if you write data to one region, and read data from another region, the RUs used to perform the write operation in region *A* do not take away from the RUs used for the read operation in region *B*. RUs are not split across the regions in which you've deployed. Each region in which the database is replicated has the full amount of RUs provisioned. For more information about global replication, see [How to distribute data globally with Azure Cosmos DB](distribute-data-globally.md).

## Request unit considerations
When estimating the number of request units to provision for your Azure Cosmos DB container, it is important to take the following variables into consideration:

* **Item size**. As size increases the number of request units consumed to read or write the data also increases.
* **Item property count**. Assuming default indexing of all properties, the units consumed to write a document/node/entity increase as the property count increases.
* **Data consistency**. When using data consistency models such as Strong or Bounded Staleness, additional request units are consumed to read items.
* **Indexed properties**. An index policy on each container determines which properties are indexed by default. You can reduce your request unit consumption by limiting the number of indexed properties or by enabling lazy indexing.
* **Document indexing**. By default each item is automatically indexed. You consume fewer request units if you choose to not index some of your items.
* **Query patterns**. The complexity of a query impacts how many request units are consumed for an operation. The number of predicates, nature of the predicates, projections, number of UDFs, and the size of the source data - all influence the cost of query operations.
* **Script usage**.  As with queries, stored procedures and triggers consume request units based on the complexity of the operations being performed. As you develop your application, inspect the request charge header to better understand how each operation is consuming request unit capacity.

## Estimating throughput needs
A request unit is a normalized measure of request processing cost. A single request unit represents the processing capacity required to read (via self link or id) a single 1 KB item consisting of 10 unique property values (excluding system properties). A request to create (insert), replace or delete the same item will consume more processing from the service and thereby more request units.   

> [!NOTE]
> The baseline of 1 request unit for a 1 KB item corresponds to a simple GET by self link or id of the item.
> 
> 

For example, here's a table that shows how many request units to provision for items with three different sizes (1 KB, 4 KB, and 64 KB) and at two different performance levels (500 reads/second + 100 writes/second and 500 reads/second + 500 writes/second). The data consistency was configured at *Session*, and the indexing policy was set to *None*.

<table border="0" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td valign="top"><p><strong>Item size</strong></p></td>
            <td valign="top"><p><strong>Reads/second</strong></p></td>
            <td valign="top"><p><strong>Writes/second</strong></p></td>
            <td valign="top"><p><strong>Request units</strong></p></td>
        </tr>
        <tr>
            <td valign="top"><p>1 KB</p></td>
            <td valign="top"><p>500</p></td>
            <td valign="top"><p>100</p></td>
            <td valign="top"><p>(500 * 1) + (100 * 5) = 1,000 RU/s</p></td>
        </tr>
        <tr>
            <td valign="top"><p>1 KB</p></td>
            <td valign="top"><p>500</p></td>
            <td valign="top"><p>500</p></td>
            <td valign="top"><p>(500 * 1) + (500 * 5) = 3,000 RU/s</p></td>
        </tr>
        <tr>
            <td valign="top"><p>4 KB</p></td>
            <td valign="top"><p>500</p></td>
            <td valign="top"><p>100</p></td>
            <td valign="top"><p>(500 * 1.3) + (100 * 7) = 1,350 RU/s</p></td>
        </tr>
        <tr>
            <td valign="top"><p>4 KB</p></td>
            <td valign="top"><p>500</p></td>
            <td valign="top"><p>500</p></td>
            <td valign="top"><p>(500 * 1.3) + (500 * 7) = 4,150 RU/s</p></td>
        </tr>
        <tr>
            <td valign="top"><p>64 KB</p></td>
            <td valign="top"><p>500</p></td>
            <td valign="top"><p>100</p></td>
            <td valign="top"><p>(500 * 10) + (100 * 48) = 9,800 RU/s</p></td>
        </tr>
        <tr>
            <td valign="top"><p>64 KB</p></td>
            <td valign="top"><p>500</p></td>
            <td valign="top"><p>500</p></td>
            <td valign="top"><p>(500 * 10) + (500 * 48) = 29,000 RU/s</p></td>
        </tr>
    </tbody>
</table>

### Use the request unit calculator
To help customers fine-tune their throughput estimations, there is a web-based [request unit calculator](https://www.documentdb.com/capacityplanner) to help estimate the request unit requirements for typical operations, including:

* Item creates (writes)
* Item reads
* Item deletes
* Item updates

The tool also includes support for estimating data storage needs based on the sample items you provide.

Using the tool is simple:

1. Upload one or more representative items (e.g., a sample JSON document).
   
    ![Upload items to the request unit calculator][2]
2. To estimate the data storage requirements, enter the total number of items (e.g., documents, tables or graphs) you expect to store.
3. Enter the number of create, read, update, and delete operations you require (on a per-second basis). To estimate the request unit charges of item update operations, upload a copy of the sample item from step 1 above that includes typical field updates.  For example, if item updates typically modify two properties named *lastLogin* and *userVisits*, then simply copy a sample item, update the values for those two properties, and upload the copied item.
   
    ![Enter throughput requirements in the request unit calculator][3]
4. Click calculate and examine the results.
   
    ![Request unit calculator results][4]

> [!NOTE]
> If you have item types which will differ dramatically in terms of size and the number of indexed properties, then upload a sample of each *type* of typical item to the tool and then calculate the results.
> 
> 

### Use the Azure Cosmos DB request charge response header
Every response from the Azure Cosmos DB service includes a custom header (`x-ms-request-charge`) that contains the request units consumed for a given request. This header is also accessible through the Azure Cosmos DB SDKs. In the .NET SDK, `RequestCharge` is a property of the `ResourceResponse` object.  For queries, the Azure Cosmos DB Data Explorer in the Azure portal provides request charge information for executed queries.

With this in mind, one method for estimating the amount of reserved throughput required by your application is to record the request unit charge associated with running typical operations against a representative item used by your application and then estimate the number of operations you anticipate to perform each second.  Be sure to measure and include typical queries and Azure Cosmos DB script usage as well.

> [!NOTE]
> If you have item types that differ dramatically in terms of size and the number of indexed properties, then record the applicable operation request unit charge associated with each *type* of typical item.
> 
> 

For example:

1. Record the request unit charge of creating (inserting) a typical item. 
2. Record the request unit charge of reading a typical item.
3. Record the request unit charge of updating a typical item.
4. Record the request unit charge of typical, common item queries.
5. Record the request unit charge of any custom scripts (stored procedures, triggers, user-defined functions) leveraged by the application
6. Calculate the required request units given the estimated number of operations you anticipate to run each second.

## A request unit estimate example
Consider the following ~1 KB document:

```json
{
 "id": "08259",
  "description": "Cereals ready-to-eat, KELLOGG, KELLOGG'S CRISPIX",
  "tags": [
    {
      "name": "cereals ready-to-eat"
    },
    {
      "name": "kellogg"
    },
    {
      "name": "kellogg's crispix"
    }
  ],
  "version": 1,
  "commonName": "Includes USDA Commodity B855",
  "manufacturerName": "Kellogg, Co.",
  "isFromSurvey": false,
  "foodGroup": "Breakfast Cereals",
  "nutrients": [
    {
      "id": "262",
      "description": "Caffeine",
      "nutritionValue": 0,
      "units": "mg"
    },
    {
      "id": "307",
      "description": "Sodium, Na",
      "nutritionValue": 611,
      "units": "mg"
    },
    {
      "id": "309",
      "description": "Zinc, Zn",
      "nutritionValue": 5.2,
      "units": "mg"
    }
  ],
  "servings": [
    {
      "amount": 1,
      "description": "cup (1 NLEA serving)",
      "weightInGrams": 29
    }
  ]
}
```

> [!NOTE]
> Documents are minified in Azure Cosmos DB, so the system calculated size of the document above is slightly less than 1 KB.
> 
> 

The following table shows approximate request unit charges for typical operations on this item (the approximate request unit charge assumes that the account consistency level is set to *Session* and that all items are automatically indexed):

| Operation | Request Unit Charge |
| --- | --- |
| Create item |~15 RU |
| Read item |~1 RU |
| Query item by id |~2.5 RU |

Additionally, this table shows approximate request unit charges for typical queries used in the application:

| Query | Request Unit Charge | # of Returned Items |
| --- | --- | --- |
| Select food by id |~2.5 RU |1 |
| Select foods by manufacturer |~7 RU |7 |
| Select by food group and order by weight |~70 RU |100 |
| Select top 10 foods in a food group |~10 RU |10 |

> [!NOTE]
> RU charges will vary based on the number of items returned.
> 
> 

With this information, you can estimate the RU requirements for this application given the number of operations and queries you expect per second:

| Operation/Query | Estimated number per second | Required RUs |
| --- | --- | --- |
| Create item |10 |150 |
| Read item |100 |100 |
| Select foods by manufacturer |25 |175 |
| Select by food group |10 |700 |
| Select top 10 |15 |150 Total |

In this case, you expect an average throughput requirement of 1,275 RU/s.  Rounding up to the nearest 100, you would provision 1,300 RU/s for this application's container.

## <a id="RequestRateTooLarge"></a> Exceeding reserved throughput limits in Azure Cosmos DB
Recall that request unit consumption is evaluated at a rate per second. For applications that exceed the provisioned request unit rate, requests will be rate-limited until the rate drops below the provisioned throughput level. When a request gets rate-limited, the server preemptively ends the request with `RequestRateTooLargeException` (HTTP status code 429) and returns the `x-ms-retry-after-ms` header indicating the amount of time, in milliseconds, that the user must wait before retrying the request.

    HTTP Status 429
    Status Line: RequestRateTooLarge
    x-ms-retry-after-ms :100

If you are using the .NET Client SDK and LINQ queries, then most of the time you never have to deal with this exception, as the current version of the .NET Client SDK implicitly catches this response, respects the server-specified retry-after header, and retries the request automatically. Unless your account is being accessed concurrently by multiple clients, the next retry will succeed.

If you have more than one client cumulatively operating above the request rate, the default retry behavior may not suffice, and the client will throw a `DocumentClientException` with status code 429 to the application. In cases like this, you may want to consider handling the retry behavior and logic in your application's error handling routines or increase the provisioned throughput for the container.

## Next steps
To learn more about reserved throughput with Azure Cosmos DB databases, explore these resources:

* [Azure Cosmos DB pricing](https://azure.microsoft.com/pricing/details/cosmos-db/)
* [Partitioning data in Azure Cosmos DB](partition-data.md)

To learn more about Azure Cosmos DB, see the Azure Cosmos DB [documentation](https://azure.microsoft.com/documentation/services/cosmos-db/). 

To get started with scale and performance testing with Azure Cosmos DB, see [Performance and Scale Testing with Azure Cosmos DB](performance-testing.md).

[2]: ./media/request-units/RUEstimatorUpload.png
[3]: ./media/request-units/RUEstimatorDocuments.png
[4]: ./media/request-units/RUEstimatorResults.png
[5]: ./media/request-units/RUCalculator2.png
