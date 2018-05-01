---
title: Provision throughput for Azure Cosmos DB | Microsoft Docs
description: Learn  how to set provisioned throughput for your Azure Cosmos DB containsers, collections, graphs, and tables.
services: cosmos-db
author: SnehaGunda
manager: kfile
documentationcenter: ''

ms.assetid: f98def7f-f012-4592-be03-f6fa185e1b1e
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/23/2018
ms.author: sngun

---

# Set and get throughput for Azure Cosmos DB containers

You can set throughput for your Azure Cosmos DB containers in the Azure portal or by using the client SDKs. 

The following table lists the throughput available for containers:

<table border="0" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td valign="top"><p></p></td>
            <td valign="top"><p><strong>Single Partition Container</strong></p></td>
            <td valign="top"><p><strong>Partitioned Container</strong></p></td>
        </tr>
        <tr>
            <td valign="top"><p>Minimum Throughput</p></td>
            <td valign="top"><p>400 request units per second</p></td>
            <td valign="top"><p>1000 request units per second</p></td>
        </tr>
        <tr>
            <td valign="top"><p>Maximum Throughput</p></td>
            <td valign="top"><p>10,000 request units per second</p></td>
            <td valign="top"><p>Unlimited</p></td>
        </tr>
    </tbody>
</table>

## To set the throughput by using the Azure portal

1. In a new window, open the [Azure portal](https://portal.azure.com).
2. On the left bar, click **Azure Cosmos DB**, or click **All services** at the bottom, then scroll to **Databases**, and then click **Azure Cosmos DB**.
3. Select your Cosmos DB account.
4. In the new window, click **Data Explorer** in the navigation menu.
5. In the new window, expand your database and container and then click **Scale & Settings**.
6. In the new window, type the new throughput value in the **Throughput** box, and then click **Save**.

<a id="set-throughput-sdk"></a>

## To set the throughput by using the SQL API for .NET

The following code snippet retrieves the current throughput and changes it to 500 RU/s. For the complete code sample, see the [CollectionManagement](https://github.com/Azure/azure-documentdb-dotnet/blob/95521ff51ade486bb899d6913880995beaff58ce/samples/code-samples/CollectionManagement/Program.cs#L188-L216) project on GitHub.

```csharp
// Fetch the offer of the collection whose throughput needs to be updated
Offer offer = client.CreateOfferQuery()
    .Where(r => r.ResourceLink == collection.SelfLink)    
    .AsEnumerable()
    .SingleOrDefault();

// Set the throughput to the new value, for example 500 request units per second
offer = new OfferV2(offer, 500);

// Now persist these changes to the collection by replacing the original offer resource
await client.ReplaceOfferAsync(offer);
```

<a id="set-throughput-java"></a>

## To set the throughput by using the SQL API for Java

The following code snippet retrieves the current throughput and changes it to 500 RU/s. For a complete code sample, see the [OfferCrudSamples.java](https://github.com/Azure/azure-documentdb-java/blob/master/documentdb-examples/src/test/java/com/microsoft/azure/documentdb/examples/OfferCrudSamples.java) file on GitHub. 

```Java
// find offer associated with this collection
Iterator < Offer > it = client.queryOffers(
    String.format("SELECT * FROM r where r.offerResourceId = '%s'", collectionResourceId), null).getQueryIterator();
assertThat(it.hasNext(), equalTo(true));

Offer offer = it.next();
assertThat(offer.getString("offerResourceId"), equalTo(collectionResourceId));
assertThat(offer.getContent().getInt("offerThroughput"), equalTo(throughput));

// update the offer
int newThroughput = 500;
offer.getContent().put("offerThroughput", newThroughput);
client.replaceOffer(offer);
```

## <a id="GetLastRequestStatistics"></a>Get throughput by using MongoDB API's GetLastRequestStatistics command

The MongoDB API supports a custom command, *getLastRequestStatistics*, for retrieving the request charges for a given operation.

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

With this in mind, one method for estimating the amount of reserved throughput required by your application is to record the request unit charge associated with running typical operations against a representative item used by your application and then estimate the number of operations you anticipate to perform each second.

> [!NOTE]
> If you have item types which will differ dramatically in terms of size and the number of indexed properties, then record the applicable operation request unit charge associated with each *type* of typical item.
> 
> 

## Get throughput by using MongoDB API portal metrics

The simplest way to get a good estimate of request unit charges for your MongoDB API database is to use the [Azure portal](https://portal.azure.com) metrics. With the *Number of requests* and *Request Charge* charts, you can get an estimate of how many request units each operation is consuming and how many request units they consume relative to one another.

![MongoDB API portal metrics][1]

### <a id="RequestRateTooLargeAPIforMongoDB"></a> Exceeding reserved throughput limits in the MongoDB API
Applications that exceed the provisioned throughput for a container will be rate-limited until the consumption rate drops below the provisioned throughput rate. When a rate-limitation occurs, the backend will preemptively end the request with a `16500` error code - `Too Many Requests`. By default, the MongoDB API automatically retries up to 10 times before returning a `Too Many Requests` error code. If you are receiving many `Too Many Requests` error codes, you may want to consider either adding a retry logic in your application's error handling routines or [increase provisioned throughput for the container](set-throughput.md).

## Throughput FAQ

**Can I set my throughput to less than 400 RU/s?**

400 RU/s is the minimum throughput available on Cosmos DB single partition containers (1000 RU/s is the minimum for partitioned containers). Request units are set in 100 RU/s intervals, but throughput cannot be set to 100 RU/s or any value smaller than 400 RU/s. If you're looking for a cost effective method to develop and test Cosmos DB, you can use the free [Azure Cosmos DB Emulator](local-emulator.md), which you can deploy locally at no cost. 

**How do I set througput using the MongoDB API?**

There's no MongoDB API extension to set throughput. The recommendation is to use the SQL API, as shown in [To set the throughput by using the SQL API for .NET](#set-throughput-sdk).

## Next steps

To learn more about provisioning and going planet-scale with Cosmos DB, see [Partitioning and scaling with Cosmos DB](partition-data.md).

[1]: ./media/set-throughput/api-for-mongodb-metrics.png