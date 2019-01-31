---
title: Create a synthetic partition key in Azure Cosmos DB to distribute your data and workload evenly.
description: Learn how to use synthetic partition keys in your Azure Cosmos DB containers
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 10/30/2018
ms.author: mjbrown

---

# Create a synthetic partition key

It's a best practice to have a partition key with many distinct values, such as hundreds or thousands. The goal is to distribute your data and workload evenly across the items associated with these partition key values. If such a property doesn’t exist in your data, you can construct a synthetic partition key. The following sections describe several basic techniques for generating a synthetic partition key for your container.

## Concatenate multiple properties of an item

You can form a partition key by concatenating multiple property values into a single artificial `partitionKey` property. These keys are referred to as synthetic keys. For example, consider the following example document:

```JavaScript
{
"deviceId": "abc-123",
"date": 2018
}
```

For the previous document, one option is to set /deviceId or /date as the partition key. Use this option if you want to partition your container based on either device ID or date. Another option is to concatenate these two values into a synthetic `partitionKey` property that's used as the partition key.

```JavaScript
{
"deviceId": "abc-123",
"date": 2018,
"partitionKey": "abc-123-2018"
}
```

In real-time scenarios, you can have thousands of documents in a database. Instead of adding the synthetic key manually, define client-side logic to concatenate values and insert the synthetic key into the documents.

## Use a partition key with a random suffix

Another possible strategy to distribute the workload more evenly is to append a random number at the end of the partition key value. When you distribute items in this way, you can perform parallel write operations across partitions.

An example is if a partition key represents a date. You might choose a random number between 1 and 400 and concatenate it as a suffix to the date. This method results in partition key values like 2018-08-09.1, 2018-08-09.2, and so on, through 2018-08-09.400. Because you randomize the partition key, the write operations on the container on each day are spread evenly across multiple partitions. This method results in better parallelism and overall higher throughput.

## Use a partition key with precalculated suffixes 

The randomizing strategy can greatly improve write throughput, but it's difficult to read a specific item. You don't know the suffix value that's used when you write the item. To make it easier to read individual items, use the precalculated suffixes strategy. Instead of using a random number to distribute the items among partitions, use a number that calculates based on something that you want to query.

Consider the previous example, where a container uses a date in the partition key. Now suppose that each item has an accessible Vehicle-Identification-Number (VIN) attribute. Further suppose that you often run queries to find items by VIN, in addition to date. Before your application writes the item to the container, it can calculate a hash suffix based on the VIN and append it to the partition key date. The calculation might generate a number between 1 and 400 that's evenly distributed. This result is similar to the results produced by the random strategy method. The partition key value is then the date concatenated with the calculated result.

With this strategy, the writes are evenly spread across the partition key values, and across the partitions. You can easily read a particular item and date because you can calculate the partition key value for a specific Vehicle-Identification-Number. The benefit of this method is that you can avoid creating a single hot partition key. A hot partition key is the partition key that takes all the workload. 

## Next steps

You can learn more about the partitioning concept in the following articles:

* Learn more about [logical partitions](partition-data.md).
* Learn more about [provisioning throughput on Azure Cosmos DB containers and databases](set-throughput.md).
* Learn how to [provision throughput on an Azure Cosmos DB container](how-to-provision-container-throughput.md).
* Learn how to [provision throughput on an Azure Cosmos DB database](how-to-provision-database-throughput.md).
