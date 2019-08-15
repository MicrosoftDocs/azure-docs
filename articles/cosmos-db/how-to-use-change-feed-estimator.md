---
title: Using the change feed estimator
description: Learn how to use the change feed estimator to analyze the progress of your change feed processor
author: ealsur
ms.service: cosmos-db
ms.topic: sample
ms.date: 08/15/2019
ms.author: maquaran
---

# Using the change feed estimator

This article describes how you can monitor the progress of your [change feed processor](./change-feed-processor.md) instances as they read the change feed.

## Why is monitoring progress important?

The change feed processor acts as a pointer that moves forward across your [change feed](./change-feed.md) and delivers the changes to a delegate implementation. 

Your change feed processor deployment, based on its available resources (like CPU, memory, network, and so on) can process changes at a particular rate.

If this rate is slower than the rate at which your changes happen in your Azure Cosmos container, your processor will start to lag behind.

Identifying this scenario helps understand if we need to scale our change feed processor deployment.

## Implementing the change feed estimator

Like the [change feed processor](./change-feed-processor.md), the change feed estimator works as a push model. The estimator will measure the difference between the last processed item (defined by the state of the leases container) and the latest change in the container, and push this value to a delegate. The interval at which the measurement is taken can also be customized, with a default value of 5 seconds.

As an example, if your change feed processor is defined and started like this:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=StartProcessorEstimator)]

The correct way to initialize an estimator to measure that processor would be:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=StartEstimator)]

Where both, the processor and the estimator, share the same `leaseContainer` and same name.

The other two parameters are, the delegate, which will receive a number that represents **how many changes are pending to be read** by the processor, and the time interval at which you want this measurement to be taken.

An example of a delegate that receives the estimation is:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=EstimationDelegate)]

You can send this estimation to your monitoring solution and use it to understand how is your progress behaving over time.

> [!NOTE]
> The change feed estimator does not need to be deployed as part of your change feed processor. It can be independent, running in a completely different instance.

## Additional resources

* [Azure Cosmos DB SDK](sql-api-sdk-dotnet.md)
* [Usage samples on GitHub](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/usage/changefeed)
* [Additional samples on GitHub](https://github.com/Azure-Samples/cosmos-dotnet-change-feed-processor)

## Next steps

You can now proceed to learn more about change feed in the following articles:

* [Overview of change feed](change-feed.md)
* [Ways to read change feed](read-change-feed.md)
* [Using change feed processor](change-feed-processor.md)