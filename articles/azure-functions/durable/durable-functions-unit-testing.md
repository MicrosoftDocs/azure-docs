---
title: Azure Durable Functions unit testing
description: Learn how to unit test Durable Functions.
ms.topic: conceptual
ms.date: 11/03/2019
---

# Durable Functions unit testing (C#)

Unit testing is an important part of modern software development practices. Unit tests verify business logic behavior and protect from introducing unnoticed breaking changes in the future. Durable Functions can easily grow in complexity so introducing unit tests will help to avoid breaking changes. The following sections explain how to unit test the three function types - Orchestration client, orchestrator, and activity functions.

> [!NOTE]
> This article provides guidance for unit testing for Durable Functions apps written in C# for the .NET in-process worker and targeting Durable Functions 2.x. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

## Prerequisites

The examples in this article require knowledge of the following concepts and frameworks:

* Unit testing

* Durable Functions

* [xUnit](https://github.com/xunit/xunit) - Testing framework

* [moq](https://github.com/moq/moq4) - Mocking framework

## Base classes for mocking

Mocking is supported via the following interface:

* [IDurableOrchestrationClient](/dotnet/api/microsoft.azure.webjobs.extensions.durabletask.idurableorchestrationclient), [IDurableEntityClient](/dotnet/api/microsoft.azure.webjobs.extensions.durabletask.idurableentityclient) and [IDurableClient](/dotnet/api/microsoft.azure.webjobs.extensions.durabletask.idurableclient)

* [IDurableOrchestrationContext](/dotnet/api/microsoft.azure.webjobs.extensions.durabletask.idurableorchestrationcontext)

* [IDurableActivityContext](/dotnet/api/microsoft.azure.webjobs.extensions.durabletask.idurableactivitycontext)

* [IDurableEntityContext](/dotnet/api/microsoft.azure.webjobs.extensions.durabletask.idurableentitycontext)

These interfaces can be used with the various trigger and bindings supported by Durable Functions. When executing your Azure Functions, the functions runtime will run your function code with a concrete implementation of these interfaces. For unit testing, you can pass in a mocked version of these interfaces to test your business logic.

## Unit testing trigger functions

In this section, the unit test will validate the logic of the following HTTP trigger function for starting new orchestrations.

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/HttpStart.cs)]

The unit test task will be to verify the value of the `Retry-After` header provided in the response payload. So the unit test will mock some of `IDurableClient` methods to ensure predictable behavior.

First, we use a mocking framework ([moq](https://github.com/moq/moq4) in this case) to mock `IDurableClient`:

```csharp
// Mock IDurableClient
var durableClientMock = new Mock<IDurableClient>();
```

> [!NOTE]
> While you can mock interfaces by directly implementing the interface as a class, mocking frameworks simplify the process in various ways. For instance, if a new method is added to the interface across minor releases, moq will not require any code changes unlike concrete implementations.

Then `StartNewAsync` method is mocked to return a well-known instance ID.

```csharp
// Mock StartNewAsync method
durableClientMock.
    Setup(x => x.StartNewAsync(functionName, It.IsAny<object>())).
    ReturnsAsync(instanceId);
```

Next `CreateCheckStatusResponse` is mocked to always return an empty HTTP 200 response.

```csharp
// Mock CreateCheckStatusResponse method
durableClientMock
    // Notice that even though the HttpStart function does not call IDurableClient.CreateCheckStatusResponse() 
    // with the optional parameter returnInternalServerErrorOnFailure, moq requires the method to be set up
    // with each of the optional parameters provided. Simply use It.IsAny<> for each optional parameter
    .Setup(x => x.CreateCheckStatusResponse(It.IsAny<HttpRequestMessage>(), instanceId, returnInternalServerErrorOnFailure: It.IsAny<bool>()))
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
    durableClientMock.Object,
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
var durableOrchestrationContextMock = new Mock<IDurableOrchestrationContext>();
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

And the unit tests will verify the format of the output. The unit tests can use the parameter types directly or mock `IDurableActivityContext` class:

[!code-csharp[Main](~/samples-durable-functions/samples/VSSample.Tests/HelloSequenceActivityTests.cs)]

## Next steps

> [!div class="nextstepaction"]
> [Learn more about xUnit](https://xunit.net/docs/getting-started/netcore/cmdline)
>
> [Learn more about moq](https://github.com/Moq/moq4/wiki/Quickstart)
