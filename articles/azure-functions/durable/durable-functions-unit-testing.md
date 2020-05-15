---
title: Azure Durable Functions unit testing
description: Learn how to unit test Durable Functions.
ms.topic: conceptual
ms.date: 11/03/2019
---

# Durable Functions unit testing

Unit testing is an important part of modern software development practices. Unit tests verify business logic behavior and protect from introducing unnoticed breaking changes in the future. Durable Functions can easily grow in complexity so introducing unit tests will help to avoid breaking changes. The following sections explain how to unit test the three function types - Orchestration client, orchestrator, and activity functions.

> [!NOTE]
> This article provides guidance for unit testing for Durable Functions apps targeting Durable Functions 1.x. It has not yet been updated to account for changes introduced in Durable Functions 2.x. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

## Prerequisites

The examples in this article require knowledge of the following concepts and frameworks:

* Unit testing

* Durable Functions

* [xUnit](https://xunit.github.io/) - Testing framework

* [moq](https://github.com/moq/moq4) - Mocking framework

## Base classes for mocking

Mocking is supported via three abstract classes in Durable Functions 1.x:

* `DurableOrchestrationClientBase`

* `DurableOrchestrationContextBase`

* `DurableActivityContextBase`

These classes are base classes for `DurableOrchestrationClient`, `DurableOrchestrationContext`, and `DurableActivityContext` that define Orchestration Client, Orchestrator, and Activity methods. The mocks will set expected behavior for base class methods so the unit test can verify the business logic. There is a two-step workflow for unit testing the business logic in the Orchestration Client and Orchestrator:

1. Use the base classes instead of the concrete implementation when defining orchestration client and orchestrator function signatures.
2. In the unit tests mock the behavior of the base classes and verify the business logic.

Find more details in the following paragraphs for testing functions that use the orchestration client binding and the orchestrator trigger binding.

## Unit testing trigger functions

In this section, the unit test will validate the logic of the following HTTP trigger function for starting new orchestrations.

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/HttpStart.cs)]

The unit test task will be to verify the value of the `Retry-After` header provided in the response payload. So the unit test will mock some of `DurableOrchestrationClientBase` methods to ensure predictable behavior.

First, a mock of the base class is required, `DurableOrchestrationClientBase`. The mock can be a new class that implements `DurableOrchestrationClientBase`. However, using a mocking framework like [moq](https://github.com/moq/moq4) simplifies the process:

```csharp
    // Mock DurableOrchestrationClientBase
    var durableOrchestrationClientBaseMock = new Mock<DurableOrchestrationClientBase>();
```

Then `StartNewAsync` method is mocked to return a well-known instance ID.

```csharp
    // Mock StartNewAsync method
    durableOrchestrationClientBaseMock.
        Setup(x => x.StartNewAsync(functionName, It.IsAny<object>())).
        ReturnsAsync(instanceId);
```

Next `CreateCheckStatusResponse` is mocked to always return an empty HTTP 200 response.

```csharp
    // Mock CreateCheckStatusResponse method
    durableOrchestrationClientBaseMock
        .Setup(x => x.CreateCheckStatusResponse(It.IsAny<HttpRequestMessage>(), instanceId))
        .Returns(new HttpResponseMessage
        {
            StatusCode = HttpStatusCode.OK,
            Content = new StringContent(string.Empty),
            Headers =
            {
                RetryAfter = new RetryConditionHeaderValue(TimeSpan.FromSeconds(10))
            }
        });
```

`ILogger` is also mocked:

```csharp
    // Mock ILogger
    var loggerMock = new Mock<ILogger>();
```  

Now the `Run` method is called from the unit test:

```csharp
    // Call Orchestration trigger function
    var result = await HttpStart.Run(
        new HttpRequestMessage()
        {
            Content = new StringContent("{}", Encoding.UTF8, "application/json"),
            RequestUri = new Uri("http://localhost:7071/orchestrators/E1_HelloSequence"),
        },
        durableOrchestrationClientBaseMock.Object,
        functionName,
        loggerMock.Object);
 ```

 The last step is to compare the output with the expected value:

```csharp
    // Validate that output is not null
    Assert.NotNull(result.Headers.RetryAfter);

    // Validate output's Retry-After header value
    Assert.Equal(TimeSpan.FromSeconds(10), result.Headers.RetryAfter.Delta);
```

After combining all steps, the unit test will have the following code:

[!code-csharp[Main](~/samples-durable-functions/samples/VSSample.Tests/HttpStartTests.cs)]

## Unit testing orchestrator functions

Orchestrator functions are even more interesting for unit testing since they usually have a lot more business logic.

In this section the unit tests will validate the output of the `E1_HelloSequence` Orchestrator function:

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/HelloSequence.cs)]

The unit test code will start with creating a mock:

```csharp
    var durableOrchestrationContextMock = new Mock<DurableOrchestrationContextBase>();
```

Then the activity method calls will be mocked:

```csharp
    durableOrchestrationContextMock.Setup(x => x.CallActivityAsync<string>("E1_SayHello", "Tokyo")).ReturnsAsync("Hello Tokyo!");
    durableOrchestrationContextMock.Setup(x => x.CallActivityAsync<string>("E1_SayHello", "Seattle")).ReturnsAsync("Hello Seattle!");
    durableOrchestrationContextMock.Setup(x => x.CallActivityAsync<string>("E1_SayHello", "London")).ReturnsAsync("Hello London!");
```

Next the unit test will call `HelloSequence.Run` method:

```csharp
    var result = await HelloSequence.Run(durableOrchestrationContextMock.Object);
```

And finally the output will be validated:

```csharp
    Assert.Equal(3, result.Count);
    Assert.Equal("Hello Tokyo!", result[0]);
    Assert.Equal("Hello Seattle!", result[1]);
    Assert.Equal("Hello London!", result[2]);
```

After combining all steps, the unit test will have the following code:

[!code-csharp[Main](~/samples-durable-functions/samples/VSSample.Tests/HelloSequenceOrchestratorTests.cs)]

## Unit testing activity functions

Activity functions can be unit tested in the same way as non-durable functions.

In this section the unit test will validate the behavior of the `E1_SayHello` Activity function:

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/HelloSequence.cs)]

And the unit tests will verify the format of the output. The unit tests can use the parameter types directly or mock `DurableActivityContextBase` class:

[!code-csharp[Main](~/samples-durable-functions/samples/VSSample.Tests/HelloSequenceActivityTests.cs)]

## Next steps

> [!div class="nextstepaction"]
> [Learn more about xUnit](https://xunit.github.io/docs/getting-started-dotnet-core)
> 
> [Learn more about moq](https://github.com/Moq/moq4/wiki/Quickstart)
