---
title: Use the change feed estimator - Azure Cosmos DB
description: Learn how to use the change feed estimator to analyze the progress of your change feed processor
author: ealsur
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 05/11/2023
ms.author: maquaran
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Use the change feed estimator
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This article describes how you can monitor the progress of your [change feed processor](./change-feed-processor.md) instances as they read the change feed.

## Why is monitoring progress important?

The change feed processor acts as a pointer that moves forward across your [change feed](../change-feed.md) and delivers the changes to a delegate implementation.

Your change feed processor deployment can process changes at a particular rate based on its available resources like CPU, memory, network, and so on.

If this rate is slower than the rate at which your changes happen in your Azure Cosmos DB container, your processor will start to lag behind.

Identifying this scenario helps understand if we need to scale our change feed processor deployment.

## Implement the change feed estimator

### [.NET](#tab/dotnet)

#### As a push model for automatic notifications

Like the [change feed processor](./change-feed-processor.md), the change feed estimator can work as a push model. The estimator will measure the difference between the last processed item (defined by the state of the leases container) and the latest change in the container, and push this value to a delegate. The interval at which the measurement is taken can also be customized with a default value of 5 seconds.

As an example, if your change feed processor is defined like this:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=StartProcessorEstimator)]

The correct way to initialize an estimator to measure that processor would be using `GetChangeFeedEstimatorBuilder` like so:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=StartEstimator)]

Where both the processor and the estimator share the same `leaseContainer` and the same name.

The other two parameters are the delegate, which will receive a number that represents **how many changes are pending to be read** by the processor, and the time interval at which you want this measurement to be taken.

An example of a delegate that receives the estimation is:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=EstimationDelegate)]

You can send this estimation to your monitoring solution and use it to understand how your progress is behaving over time.

#### As an on-demand detailed estimation

In contrast with the push model, there's an alternative that lets you obtain the estimation on demand. This model also provides more detailed information:

* The estimated lag per lease.
* The instance owning and processing each lease, so you can identify if there's an issue on an instance.

If your change feed processor is defined like this:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=StartProcessorEstimatorDetailed)]

You can create the estimator with the same lease configuration:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=StartEstimatorDetailed)]

And whenever you want it, with the frequency you require, you can obtain the detailed estimation:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=GetIteratorEstimatorDetailed)]

Each `ChangeFeedProcessorState` will contain the lease and lag information, and also who is the current instance owning it.

#### Estimator deployment

The change feed estimator does not need to be deployed as part of your change feed processor, nor be part of the same project. We recommend deploying the estimator on an independent and completely different instance from your processors. A single estimator instance can track the progress for the all the leases and instances in your change feed processor deployment.

Each estimation will consume [request units](../request-units.md) from your [monitored and lease containers](change-feed-processor.md#components-of-the-change-feed-processor). A frequency of 1 minute in-between is a good starting point, the lower the frequency, the higher the request units consumed.

### [Java](#tab/java)

The provided example represents a sample Java application that demonstrates the implementation of the Change Feed Processor with the estimation of the lag in processing change feed events. In the application - documents are being inserted into one container (the "feed container"), and meanwhile another worker thread or worker application is pulling inserted documents from the feed container's Change Feed and operating on them in some way.

The change Feed Processor is built and started like this:
[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeed/SampleChangeFeedEstimator.java?name=ChangeFeedProcessorBuilder)]

Change Feed Processor lag checking can be performed on a separate application (like a health monitor) as long as the same input containers (feedContainer and leaseContainer) and the exact same lease prefix (```CONTAINER_NAME + "-lease"```) are used. The estimator code requires that the Change Feed Processor had an opportunity to fully initialize the leaseContainer's documents.

The estimator calculates the accumulated lag by retrieving the current state of the Change Feed Processor and summing up the estimated lag values for each event being processed:
[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeed/SampleChangeFeedEstimator.java?name=EstimatedLag)]

The total lag initially should be zero and finally should be greater or equal to the number of documents created. The total lag value can be logged or used for further analysis, allowing to monitor the performance of the change feed processing and identify any potential bottlenecks or delays in the system:
[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeed/SampleChangeFeedEstimator.java?name=FinalLag)]

An example of a delegate that receives changes and handles them with a lag is:
[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeed/SampleChangeFeedEstimator.java?name=HandleChangesWithLag)]

---

## Additional resources

* [Azure Cosmos DB SDK](sdk-dotnet-v3.md)
* [Usage samples on GitHub (.NET)](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed)
* [Usage samples on GitHub (Java)](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/tree/main/src/main/java/com/azure/cosmos/examples/changefeed)
* [Additional samples on GitHub](https://github.com/Azure-Samples/cosmos-dotnet-change-feed-processor)

## Next steps

You can now proceed to learn more about change feed processor in the following articles:

* [Overview of change feed processor](change-feed-processor.md)