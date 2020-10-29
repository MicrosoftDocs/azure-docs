---
title: Use the change feed estimator - Azure Cosmos DB
description: Learn how to use the change feed estimator to analyze the progress of your change feed processor
author: ealsur
ms.service: cosmos-db
ms.topic: how-to
ms.date: 08/15/2019
ms.author: maquaran
ms.custom: devx-track-csharp
---

# Use the change feed estimator
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

This article describes how you can monitor the progress of your [change feed processor](./change-feed-processor.md) instances as they read the change feed.

## Why is monitoring progress important?

The change feed processor acts as a pointer that moves forward across your [change feed](./change-feed.md) and delivers the changes to a delegate implementation. 

Your change feed processor deployment can process changes at a particular rate based on its available resources like CPU, memory, network, and so on.

If this rate is slower than the rate at which your changes happen in your Azure Cosmos container, your processor will start to lag behind.

Identifying this scenario helps understand if we need to scale our change feed processor deployment.

## Implement the change feed estimator

Like the [change feed processor](./change-feed-processor.md), the change feed estimator works as a push model. The estimator will measure the difference between the last processed item (defined by the state of the leases container) and the latest change in the container, and push this value to a delegate. The interval at which the measurement is taken can also be customized with a default value of 5 seconds.

As an example, if your change feed processor is defined like this:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=StartProcessorEstimator)]

The correct way to initialize an estimator to measure that processor would be using `GetChangeFeedEstimatorBuilder` like so:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=StartEstimator)]

Where both the processor and the estimator share the same `leaseContainer` and the same name.

The other two parameters are the delegate, which will receive a number that represents **how many changes are pending to be read** by the processor, and the time interval at which you want this measurement to be taken.

An example of a delegate that receives the estimation is:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=EstimationDelegate)]

You can send this estimation to your monitoring solution and use it to understand how your progress is behaving over time.

> [!NOTE]
> The change feed estimator does not need to be deployed as part of your change feed processor, nor be part of the same project. It can be independent and run in a completely different instance. It just needs to use the same name and lease configuration.

## Additional resources

* [Azure Cosmos DB SDK](sql-api-sdk-dotnet.md)
* [Usage samples on GitHub](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed)
* [Additional samples on GitHub](https://github.com/Azure-Samples/cosmos-dotnet-change-feed-processor)

## Next steps

You can now proceed to learn more about change feed processor in the following articles:

* [Overview of change feed processor](change-feed-processor.md)
* [Change feed processor start time](./change-feed-processor.md#starting-time)