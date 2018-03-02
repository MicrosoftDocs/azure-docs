---
title: Durable Functions Unit Testing
description: Learn how to unit test Durable Functions.
services: functions
author: kadimitr
manager: cfowler
editor: ''
tags: ''
keywords:
ms.service: functions
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 02/28/2018
ms.author: kadimitr
---

# Durable Functions Unit Testing


## Introduction

Unit testing is an important part of modern software development practices. Unit tests verifies business logic behavior and protects from introducing unnoticed breaking changes in future. Every single unit test is focused on testing specific behavior. That requires Durable Functions core methods to return expected output when provided pre-defined input. This process is called mocking and Durable Functions supports it via two abstract classes:

* [DurableOrchestrationClientBase](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClientBase.html) 

* [DurableOrchestrationContextBase](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContextBase.html)

These classes are base classes for [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) and [DurableOrchestrationContext](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html) that define Orchestration Client and Orchestrator methods. The mocks will set expectable behavior for all base class methods so the unit test can verify the business logic. There is 2-step workflow for unit testing the business logic in the Orchestration Client and Orchestrator:

1. Use the base classes instead of the concrete implementation when defining Orchestration Client and Orchestrator's signatures
2. In the unit tests mock the behavior of the base classes and verify the business logic 

Find more details in the following paragraphs for testing Orchestration Client and Orchestrator.

### Prerequisites

The examples below are using the following frameworks: 

* [xUnit](https://xunit.github.io/) - Testing framework

* [moq](https://github.com/moq/moq4) - Mocking framework

* [FluentAssertions](http://fluentassertions.com/) - .NET extension for more natural assertions 


## Unit testing trigger functions

In this secion, the unit test will validate the value set to `Retry-After` header in the response of the sample function defined below. The sample is using C# 

1. First, use [DurableOrchestrationClientBase](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClientBase.html)  instead of  [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) in the signature of the Orchestration client function:

```csharp

public static class HttpStart
{
    [FunctionName("HttpStart")]
    public static async Task<HttpResponseMessage> Run(
        [HttpTrigger(AuthorizationLevel.Function, methods: "post", Route = "orchestrators/{functionName}")] HttpRequestMessage req,
        [OrchestrationClient] DurableOrchestrationClientBase starter,
        string functionName,
        TraceWriter log)
    {
        // Function input comes from the request content.
        dynamic eventData = await req.Content.ReadAsAsync<object>();
        string instanceId = await starter.StartNewAsync(functionName, eventData);

        log.Info($"Started orchestration with ID = '{instanceId}'.");

        var res = starter.CreateCheckStatusResponse(req, instanceId);
        res.Headers.RetryAfter = new RetryConditionHeaderValue(TimeSpan.FromSeconds(10));
        return res;
    }
}

```

2. Then, mock the behavior of [DurableOrchestrationClientBase](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClientBase.html) in your unit tests :

```csharp

public class HttpStartTests
{
    [Fact]
    public async Task HttpStart_returns_retryafter_header()
    {
        // Define constants
        const string functionName = "SampleFunction";
        const string instanceId = "7E467BDB-213F-407A-B86A-1954053D3C24";

        // Mock TraceWriter
        var traceWriterMock = new Mock<TraceWriter>(TraceLevel.Info);

        // Mock DurableOrchestrationClientBase
        var durableOrchestrationClientBaseMock = new Mock<DurableOrchestrationClientBase>();

        // Mock StartNewAsync method
        durableOrchestrationClientBaseMock.
            Setup(x => x.StartNewAsync(functionName, It.IsAny<object>())).
            ReturnsAsync(instanceId);

        // Mock CreateCheckStatusResponse method
        durableOrchestrationClientBaseMock
            .Setup(x => x.CreateCheckStatusResponse(It.IsAny<HttpRequestMessage>(), instanceId))
            .Returns(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(string.Empty),
            });

        // Call Orchestration trigger function
        var result = await HttpStart.Run(
            new HttpRequestMessage()
            {
                Content = new StringContent(JsonConvert.SerializeObject(string.Empty), Encoding.UTF8, "application/json"),
                RequestUri = new Uri("https://www.microsoft.com/"),
            },
            durableOrchestrationClientBaseMock.Object, 
            functionName,
            traceWriterMock.Object);

        // Validate output
        result.Headers.RetryAfter.Should().NotBeNull();

        // Validate output's Retry-After header value
        result.Headers.RetryAfter.Delta.Should().Be(TimeSpan.FromSeconds(10));
     }
}

```

## Unit testing orchestrator functions

Orchestrator functions are even more interesting for unit testing since they usually contain a lot more business logic. Currently, Orchestrator functions can be implemented only in C#.

In this section the unit tests will validate the output of the following Orchestrator function:

```csharp

[FunctionName("E1_HelloSequence")]
public static async Task<List<string>> Run(
    [OrchestrationTrigger] DurableOrchestrationContextBase context)
{
    var outputs = new List<string>();

    outputs.Add(await context.CallActivityAsync<string>("E1_SayHello", "Tokyo"));
    outputs.Add(await context.CallActivityAsync<string>("E1_SayHello", "Seattle"));
    outputs.Add(await context.CallActivityAsync<string>("E1_SayHello", "London"));

    // returns ["Hello Tokyo!", "Hello Seattle!", "Hello London!"]
    return outputs;
}

```

And the unit test for this function is below:

 ```csharp

[Fact]
public async Task Run_retuns_multiple_greetings()
{
    // Setup DurableOrchestrationContextBase mock
    var durableOrchestrationContextMock = new Mock<DurableOrchestrationContextBase>();
    durableOrchestrationContextMock.Setup(x => x.CallActivityAsync<string>("E1_SayHello", "Tokyo")).ReturnsAsync("Hello Tokyo!");
    durableOrchestrationContextMock.Setup(x => x.CallActivityAsync<string>("E1_SayHello", "Seattle")).ReturnsAsync("Hello Seattle!");
    durableOrchestrationContextMock.Setup(x => x.CallActivityAsync<string>("E1_SayHello", "London")).ReturnsAsync("Hello London!");

    // Call Orchestrator function
    var result = await HelloSequence.Run(durableOrchestrationContextMock.Object);

    // Verify business logic
    Assert.Equal(3, result.Count);
    Assert.Equal("Hello Tokyo!", result[0]);
    Assert.Equal("Hello Seattle!", result[1]);
    Assert.Equal("Hello London!", result[2]);
}

  ```

## Unit testing activity functions

Activity function can be unit tested in the same way as non-durable functions. Base classes for mocking are not available for unit testing Activity functions.
So, avoid using [DurableActivityContext](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableActivityContext.html) because its methods can not be mocked. 

In this section the unit tests will validate the behavior of the following Activity function:

```csharp

[FunctionName("E1_SayHello")]
public static string SayHello([ActivityTrigger] string name)
{
    return $"Hello {name}!";
}

```

And the unit test will verify the format of the output:

```csharp

[Fact]
public void SayHello_returns_greeting()
{
    var result = HelloSequence.SayHello("John");
    Assert.Equal("Hello John!", result);
}

```

## Next steps

> [!div class="nextstepaction"]
> [Run the function chaining sample](durable-functions-sequence.md)
