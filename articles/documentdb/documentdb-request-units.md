---
title: Request units & estimating throughput - Azure DocumentDB | Microsoft Docs
description: Learn about how to understand, specify, and estimate request unit requirements in DocumentDB.
services: documentdb
author: syamkmsft
manager: jhubbard
editor: mimig
documentationcenter: ''

ms.assetid: d0a3c310-eb63-4e45-8122-b7724095c32f
ms.service: documentdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/17/2017
ms.author: syamk

---
# Request Units in DocumentDB
Now available: DocumentDB [request unit calculator](https://www.documentdb.com/capacityplanner). Learn more in [Estimating your throughput needs](documentdb-request-units.md#estimating-throughput-needs).

![Throughput calculator][5]

## Introduction
[Azure DocumentDB](https://azure.microsoft.com/services/documentdb/) is a fully managed, scalable NoSQL database service for JSON documents. With DocumentDB, you don’t have to rent virtual machines, deploy software, or monitor databases. DocumentDB is operated and continuously monitored by Microsoft engineers to deliver world class availability, performance, and data protection. Data in DocumentDB is stored within collections, which are elastic, highly available containers. Instead of thinking about and managing hardware resources like CPU, memory, and IOPs for a collection, you can reserve throughput in terms of requests per second. DocumentDB will automatically manage the provisioning, transparent partitioning, and scaling of your collection in order to serve the provisioned number of requests. 

DocumentDB supports a number of APIs for reads, writes, queries, and stored procedure executions. Since not all requests are equal, they are assigned a normalized amount of **request units** based on the amount of computation required to serve the request. The number of request units for an operation is deterministic, and you can track the number of request units consumed by any operation in DocumentDB via a response header.

Each collection in DocumentDB can be reserved with throughput, also expressed in terms of request units. This is expressed in blocks of 100 request units per second, ranging from hundreds up to millions of request units per second. The provisioned throughput can be adjusted throughout the life of a collection to adapt to the changing processing needs and access patterns of your application. 

After reading this article, you'll be able to answer the following questions:  

* What are request units and request charges?
* How do I specify request unit capacity for a collection?
* How do I estimate my application's request unit needs?
* What happens if I exceed request unit capacity for a collection?

## Request units and request charges
DocumentDB and API for MongoDB delivers fast, predictable performance by *reserving* resources to satisfy your application's throughput needs.  Because application load and access patterns change over time, DocumentDB allows you to easily increase or decrease the amount of reserved throughput available to your application.

With DocumentDB, reserved throughput is specified in terms of request units processing per second.  You can think of request units as throughput currency, whereby you *reserve* an amount of guaranteed request units available to your application on per second basis.  Each operation in DocumentDB - writing a document, performing a query, updating a document - consumes CPU, memory, and IOPS.  That is, each operation incurs a *request charge*, which is expressed in *request units*.  Understanding the factors which impact request unit charges, along with your application's throughput requirements, enables you to run your application as cost effectively as possible. 

We recommend getting started by watching the following video, where Aravind Ramachandran explains request units and predictable performance with DocumentDB.

> [!VIDEO https://channel9.msdn.com/Shows/Azure-Friday/Predictable-Performance-with-DocumentDB/player]
> 
> 

## Specifying request unit capacity in DocumentDB
When creating a DocumentDB collection, you specify the number of request units per second (RU per second) you want reserved for the collection. Based on the provisioned throughput, DocumentDB allocates physical partitions to host your collection and splits/rebalances data across partitions as it grows.

DocumentDB requires a partition key to be specified when a collection is provisioned with 10,000 request units or higher. A partition key is also required to scale your collection's throughput beyond 10,000 request units in the future. Therefore, it is highly recommended to configure a [partition key](documentdb-partition-data.md) when creating a collection regardless of your initial throughput. Since your data might have to be split across multiple partitions, it is necessary to pick a partition key that has a high cardinality (100s to millions of distinct values) so that your collection and requests can be scaled uniformly by DocumentDB. 

> [!NOTE]
> A partition key is a logical boundary, and not a physical one. Therefore, you do not need to limit the number of distinct partition key values. It is in fact better to have more distinct partition key values than less, as DocumentDB has more load balancing options.

Here is a code snippet for creating a collection with 3,000 request units per second using the .NET SDK:

```csharp
DocumentCollection myCollection = new DocumentCollection();
myCollection.Id = "coll";
myCollection.PartitionKey.Paths.Add("/deviceId");

await client.CreateDocumentCollectionAsync(
    UriFactory.CreateDatabaseUri("db"),
    myCollection,
    new RequestOptions { OfferThroughput = 3000 });
```

DocumentDB operates on a reservation model on throughput. That is, you are billed for the amount of throughput *reserved* for the collection, regardless of how much of that throughput is actively *used*. As your application's load, data, and usage patterns change you can easily scale up and down the amount of reserved RUs through DocumentDB SDKs or using the [Azure Portal](https://portal.azure.com).

Each collection is mapped to an `Offer` resource in DocumentDB, which has metadata about the collection's provisioned throughput. You can change the allocated throughput by looking up the corresponding offer resource for a collection, then updating it with the new throughput value. Here is a code snippet for changing the throughput of a collection to 5,000 request units per second using the .NET SDK:

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

There is no impact to the availability of your collection when you change the throughput. Typically the new reserved throughput is effective within seconds on application of the new throughput.

## Specifying request unit capacity in API for MongoDB
API for MongoDB allows you to specify the number of request units per second (RU per second) you want reserved for the collection.

API for MongoDB operates on the same reservation model based on throughput as DocumentDB. That is, you are billed for the amount of throughput *reserved* for the collection, regardless of how much of that throughput is actively *used*. As your application's load, data, and usage patterns change you can easily scale up and down the amount of reserved RUs through the [Azure Portal](https://portal.azure.com).

There is no impact to the availability of your collection when you change the throughput. Typically the new reserved throughput is effective within seconds on application of the new throughput.

## Request unit considerations
When estimating the number of request units to reserve for your DocumentDB collection, it is important to take the following variables into consideration:

* **Document size**. As document sizes increase the units consumed to read or write the data will also increase.
* **Document property count**. Assuming default indexing of all properties, the units consumed to write a document will increase as the property count increases.
* **Data consistency**. When using data consistency levels of Strong or Bounded Staleness, additional units will be consumed to read documents.
* **Indexed properties**. An index policy on each collection determines which properties are indexed by default. You can reduce your request unit consumption by limiting the number of indexed properties or by enabling lazy indexing.
* **Document indexing**. By default each document is automatically indexed, you will consume fewer request units if you choose not to index some of your documents.
* **Query patterns**. The complexity of a query impacts how many Request Units are consumed for an operation. The number of predicates, nature of the predicates, projections, number of UDFs, and the size of the source data set all influence the cost of query operations.
* **Script usage**.  As with queries, stored procedures and triggers consume request units based on the complexity of the operations being performed. As you develop your application, inspect the request charge header to better understand how each operation is consuming request unit capacity.

## Estimating throughput needs
A request unit is a normalized measure of request processing cost. A single request unit represents the processing capacity required to read (via self link or id) a single 1KB JSON document consisting of 10 unique property values (excluding system properties). A request to create (insert), replace or delete the same document will consume more processing from the service and thereby more request units.   

> [!NOTE]
> The baseline of 1 request unit for a 1KB document corresponds to a simple GET by self link or id of the document.
> 
> 

For example, here's a table that shows how many request units to provision at three different document sizes (1KB, 4KB, and 64KB) and at two different performance levels (500 reads/second + 100 writes/second and 500 reads/second + 500 writes/second). The data consistency was configured at Session, and the indexing policy was set to None.

<table border="0" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td valign="top"><p><strong>Document size</strong></p></td>
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
To help customers fine tune their throughput estimations, there is a web based [request unit calculator](https://www.documentdb.com/capacityplanner) to help estimate the request unit requirements for typical operations, including:

* Document creates (writes)
* Document reads
* Document deletes
* Document updates

The tool also includes support for estimating data storage needs based on the sample documents you provide.

Using the tool is simple:

1. Upload one or more representative JSON documents.
   
    ![Upload documents to the request unit calculator][2]
2. To estimate data storage requirements, enter the total number of documents you expect to store.
3. Enter the number of document create, read, update, and delete operations you require (on a per-second basis). To estimate the request unit charges of document update operations, upload a copy of the sample document from step 1 above that includes typical field updates.  For example, if document updates typically modify two properties named lastLogin and userVisits, then simply copy the sample document, update the values for those two properties, and upload the copied document.
   
    ![Enter throughput requirements in the request unit calculator][3]
4. Click calculate and examine the results.
   
    ![Request unit calculator results][4]

> [!NOTE]
> If you have document types which will differ dramatically in terms of size and the number of indexed properties, then upload a sample of each *type* of typical document to the tool and then calculate the results.
> 
> 

### Use the DocumentDB request charge response header
Every response from the DocumentDB service includes a custom header (`x-ms-request-charge`) that contains the request units consumed for the request. This header is also accessible through the  DocumentDB SDKs. In the .NET SDK, RequestCharge is a property of the ResourceResponse object.  For queries, the DocumentDB Query Explorer in the Azure portal provides request charge information for executed queries.

![Examining RU charges in the Query Explorer][1]

With this in mind, one method for estimating the amount of reserved throughput required by your application is to record the request unit charge associated with running typical operations against a representative document used by your application and then estimating the number of operations you anticipate performing each second.  Be sure to measure and include typical queries and DocumentDB script usage as well.

> [!NOTE]
> If you have document types which will differ dramatically in terms of size and the number of indexed properties, then record the applicable operation request unit charge associated with each *type* of typical document.
> 
> 

For example:

1. Record the request unit charge of creating (inserting) a typical document. 
2. Record the request unit charge of reading a typical document.
3. Record the request unit charge of updating a typical document.
4. Record the request unit charge of typical, common document queries.
5. Record the request unit charge of any custom scripts (stored procedures, triggers, user-defined functions) leveraged by the application
6. Calculate the required request units given the estimated number of operations you anticipate to run each second.

### <a id="GetLastRequestStatistics"></a>Use API for MongoDB's GetLastRequestStatistics command
API for MongoDB supports a custom command, *getLastRequestStatistics*, for retrieving the request charge for specified operations.

For example, in the Mongo Shell, execute the operation you want to verify the request charge for.
```
> db.sample.find()
```

Next, execute the command *getLastRequestStatistics*.
```
> db.runCommand({getLastRequestStatistics: 1})
{
    "_t": "GetRequestStatisticsResponse",
    "ok": 1,
    "CommandName": "OP_QUERY",
    "RequestCharge": 2.48,
    "RequestDurationInMilliSeconds" : 4.0048
}
```

With this in mind, one method for estimating the amount of reserved throughput required by your application is to record the request unit charge associated with running typical operations against a representative document used by your application and then estimating the number of operations you anticipate performing each second.

> [!NOTE]
> If you have document types which will differ dramatically in terms of size and the number of indexed properties, then record the applicable operation request unit charge associated with each *type* of typical document.
> 
> 

## Use API for MongoDB's portal metrics
The simplest way to get a good estimation of request unit charges for your API for MongoDB database is to use the [Azure portal](https://portal.azure.com) metrics. With the *Number of requests* and *Request Charge* charts, you can get an estimation of how many request units each operation is consuming and how many request units they consume relative to one another.

![API for MongoDB portal metrics][6]

## A request unit estimation example
Consider the following ~1KB document:

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
> Documents are minified in DocumentDB, so the system calculated size of the document above is slightly less than 1KB.
> 
> 

The following table shows approximate request unit charges for typical operations on this document (the approximate request unit charge assumes that the account consistency level is set to “Session” and that all documents are automatically indexed):

| Operation | Request Unit Charge |
| --- | --- |
| Create document |~15 RU |
| Read document |~1 RU |
| Query document by id |~2.5 RU |

Additionally, this table shows approximate request unit charges for typical queries used in the application:

| Query | Request Unit Charge | # of Returned Documents |
| --- | --- | --- |
| Select food by id |~2.5 RU |1 |
| Select foods by manufacturer |~7 RU |7 |
| Select by food group and order by weight |~70 RU |100 |
| Select top 10 foods in a food group |~10 RU |10 |

> [!NOTE]
> RU charges vary based on the number of documents returned.
> 
> 

With this information, we can estimate the RU requirements for this application given the number of operations and queries we expect per second:

| Operation/Query | Estimated number per second | Required RUs |
| --- | --- | --- |
| Create document |10 |150 |
| Read document |100 |100 |
| Select foods by manufacturer |25 |175 |
| Select by food group |10 |700 |
| Select top 10 |15 |150 Total |

In this case, we expect an average throughput requirement of 1,275 RU/s.  Rounding up to the nearest 100, we would provision 1,300 RU/s for this application's collection.

## <a id="RequestRateTooLarge"></a> Exceeding reserved throughput limits in DocumentDB
Recall that request unit consumption is evaluated as a rate per second. For applications that exceed the provisioned request unit rate for a collection, requests to that collection will be throttled until the rate drops below the reserved level. When a throttle occurs, the server will preemptively end the request with RequestRateTooLargeException (HTTP status code 429) and return the x-ms-retry-after-ms header indicating the amount of time, in milliseconds, that the user must wait before reattempting the request.

    HTTP Status 429
    Status Line: RequestRateTooLarge
    x-ms-retry-after-ms :100

If you are using the .NET Client SDK and LINQ queries, then most of the time you never have to deal with this exception, as the current version of the .NET Client SDK implicitly catches this response, respects the server-specified retry-after header, and retries the request. Unless your account is being accessed concurrently by multiple clients, the next retry will succeed.

If you have more than one client cumulatively operating above the request rate, the default retry behavior may not suffice, and the client will throw a DocumentClientException with status code 429 to the application. In cases such as this, you may consider handling retry behavior and logic in your application's error handling routines or increasing the reserved throughput for the collection.

## <a id="RequestRateTooLargeAPIforMongoDB"></a> Exceeding reserved throughput limits in API for MongoDB
Applications that exceed the provisioned request units for a collection will be throttled until the rate drops below the reserved level. When a throttle occurs, the backend will preemptively end the request with a *16500* error code - *Too Many Requests*. By default, API for MongoDB will automatically retry up to 10 times before returning a *Too Many Requests* error code. If you are receiving many *Too Many Requests* error codes, you may consider either adding retry behavior in your application's error handling routines or [increasing the reserved throughput for the collection](documentdb-set-throughput.md).

## Next steps
To learn more about reserved throughput with Azure DocumentDB databases, explore these resources:

* [DocumentDB pricing](https://azure.microsoft.com/pricing/details/documentdb/)
* [Modeling data in DocumentDB](documentdb-modeling-data.md)
* [DocumentDB performance levels](documentdb-partition-data.md)

To learn more about DocumentDB, see the Azure DocumentDB [documentation](https://azure.microsoft.com/documentation/services/documentdb/). 

To get started with scale and performance testing with DocumentDB, see [Performance and Scale Testing with Azure DocumentDB](documentdb-performance-testing.md).

[1]: ./media/documentdb-request-units/queryexplorer.png 
[2]: ./media/documentdb-request-units/RUEstimatorUpload.png
[3]: ./media/documentdb-request-units/RUEstimatorDocuments.png
[4]: ./media/documentdb-request-units/RUEstimatorResults.png
[5]: ./media/documentdb-request-units/RUCalculator2.png
[6]: ./media/documentdb-request-units/api-for-mongodb-metrics.png
