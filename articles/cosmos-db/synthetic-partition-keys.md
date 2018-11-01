---
title: Synthetic partition keys in Azure Cosmos DB
description: Learn how to use synthetic partition keys in your Azure Cosmos DB containers
services: cosmos-db
keywords: partition key, partition
author: rafats
manager: kfile
editor: monicar

ms.service: cosmos-db
ms.devlang: na
ms.topic: conceptual
ms.date: 10/30/2018
ms.author: rafats

---

# Create a synthetic partition key

It's a best practice to have a partition key with many distinct values (hundreds or thousands). The goal is to distribute your data and workload evenly across the items associated with these partition key values. If such a property doesn’t exist, a synthetic partition key can be constructed. The following sections describe several basic techniques for generating a synthetic partition key for your container.

## Concatenating multiple properties of an item

You can form a partition key by concatenating multiple property values into a single artificial `partitionKey` property. These keys are referred to as synthetic keys. For example, consider the following example document:

```JavaScript
{
"deviceId": "abc-123",
"date": 2018
}
```

One option is to set /deviceId or /date as the partition key, if you want to partition your container based on either device ID or date. Another option is to concatenate these two values into a synthetic `partitionKey` property that is used as the partition key.

```JavaScript
{
"deviceId": "abc-123",
"date": 2018,
"partitionKey": "abc-123-2018"
}
```

In real-time scenarios, you can have thousands of documents, so instead of adding the synthetic key manually, you should define client-side logic to concatenate values and insert the synthetic key into the documents.

## Using a partition key with random suffix

Another possible strategy for distributing loads more evenly is to append a random number to the end of the partition key values. Distributing items in this way enables you perform writes in parallel across partitions.

For example, if a partition key represents a date, you might choose a random number between 1 and 400 and concatenate it as a suffix to the date. This yields partition key values like 2018-08-09.1, 2018-08-09.2, and so on, through 2018-08-09.400. Because you are randomizing the partition key, the writes to the container on each day are spread evenly across multiple partitions. This results in better parallelism and overall higher throughput.

## Using a partition key with pre-calculated suffixes 

A randomizing strategy can greatly improve write throughput. But it's difficult to read a specific item because you don't know which suffix value was used when writing the item. To make it easier to read individual items, you can use a different strategy. Instead of using a random number to distribute the items among partitions, use a number that you can calculate based upon something that you want to query on.

Consider the previous example, in which a container uses a date in the partition key. Now suppose that each item has an accessible VIN (Vehicle-Identification-Number) attribute, and that you most often need to find items by VIN, in addition to date. Before your application writes the item to the container, it could calculate a hash suffix based on the VIN and append it to the partition key date. The calculation might generate a number between 1 and 400 that is fairly evenly distributed, similar to what the random strategy produces. The partition key value would then be the date concatenated with the calculated result.

With this strategy, the writes are spread evenly across the partition key values, and thus across the partitions. You can easily perform a read for a particular item and date, because you can calculate the partition key value for a specific VIN value. The benefit is that you avoid having a single "hot" partition key value taking all of the workload.

## Next steps

* Learn more about [logical partitions](partition-data.md)
* Learn more about [designing a partition key](TBD)
* Learn more about [provisioning throughput on Cosmos containers and databases](set-throughput.md)
* Learn [how to configure provisioned throughput on a Cosmos container](TBD)
* Learn [how to configure provisioned throughput on a Cosmos database](TBD)
