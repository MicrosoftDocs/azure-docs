---
title: Unit Testing Durable Functions in .NET Isolated
description: Learn about unit testing best practices for Durable functions written in .NET Isolated for Azure Functions.
author: nytian
ms.topic: conceptual
ms.date: 05/19/2025
ms.author: azfuncdf
---

# Durable Functions unit testing (C# Isolated)

Unit testing is an important part of modern software development practices. Unit tests verify business logic behavior and protect from introducing unnoticed breaking changes in the future. Durable Functions can easily grow in complexity so introducing unit tests helps avoid breaking changes. The following sections explain how to unit test the three function types - Orchestration client, orchestrator, and activity functions.

> [!NOTE]
> - This article provides guidance for unit testing for Durable Functions apps written in C# for the .NET isolated worker. For more information about Durable Functions in the .NET isolated worker, see the [Durable Functions in the .NET isolated worker](durable-functions-dotnet-isolated-overview.md) article.
> - **The complete sample code for this unit testing guide can be found in [the sample code repository](https://github.com/Azure/azure-functions-durable-extension/tree/dev/samples/isolated-unit-tests)**.
> - For Durable Functions using C# in-process, refer to [unit testing guide](durable-functions-unit-testing.md).

## Prerequisites

The examples in this article require knowledge of the following concepts and frameworks:

* Unit testing
* Durable Functions
* [xUnit](https://github.com/xunit/xunit) - Testing framework
* [moq](https://github.com/moq/moq4) - Mocking framework

## Base classes for mocking

Mocking is supported via the following interfaces and classes:

* `DurableTaskClient` - For orchestrator client operations
* `TaskOrchestrationContext` - For orchestrator function execution
* `FunctionContext` - For function execution context
* `HttpRequestData` and `HttpResponseData` - For HTTP trigger functions

These classes can be used with the various trigger and bindings supported by Durable Functions. While it's executing your Azure Functions, the functions runtime runs your function code with concrete implementations of these classes. For unit testing, you can pass in a mocked version of these classes to test your business logic.

## Unit testing trigger functions

In this section, the unit test validates the logic of the following HTTP trigger function for starting new orchestrations.

```csharp
[Function("HelloCitiesOrchestration_HttpStart")]
public static async Task<HttpResponseData> HttpStart(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req,
    [DurableClient] DurableTaskClient client,
    FunctionContext executionContext)
{
    // Function input comes from the request content.
    string instanceId = await client.ScheduleNewOrchestrationInstanceAsync(
        nameof(HelloCitiesOrchestration));

    // Returns an HTTP 202 response with an instance management payload.
    return await client.CreateCheckStatusResponseAsync(req, instanceId);
}
```

The unit test verifies the HTTP response status code and the instance ID in the response payload. The test mocks the `DurableTaskClient` to ensure predictable behavior.

First, we use a mocking framework (Moq in this case) to mock `DurableTaskClient` and FunctionContext:

```csharp
// Mock DurableTaskClient
var durableClientMock = new Mock<DurableTaskClient>("testClient");
var functionContextMock = new Mock<FunctionContext>();
```

Then `ScheduleNewOrchestrationInstanceAsync` method is mocked to return an instance ID:

```csharp
var instanceId = Guid.NewGuid().ToString();

// Mock ScheduleNewOrchestrationInstanceAsync method
durableClientMock
    .Setup(x => x.ScheduleNewOrchestrationInstanceAsync(
        It.IsAny<TaskName>(),
        It.IsAny<object>(),
        It.IsAny<StartOrchestrationOptions>(),
        It.IsAny<CancellationToken>()))
    .ReturnsAsync(instanceId);
```

Next, we need to mock the HTTP request and response data:

```csharp
// Mock HttpRequestData that sent to the http trigger
var mockRequest = MockHttpRequestAndResponseData();

var responseMock = new Mock<HttpResponseData>(functionContextMock.Object);
responseMock.SetupGet(r => r.StatusCode).Returns(HttpStatusCode.Accepted);
```

Here's the complete helper method for mocking HttpRequestData:

```csharp
private HttpRequestData MockHttpRequestAndResponseData(HttpHeadersCollection? headers = null)
{
    var mockObjectSerializer = new Mock<ObjectSerializer>();

    // Setup the SerializeAsync method
    mockObjectSerializer.Setup(s => s.SerializeAsync(It.IsAny<Stream>(), It.IsAny<object?>(), It.IsAny<Type>(), It.IsAny<CancellationToken>()))
        .Returns<Stream, object?, Type, CancellationToken>(async (stream, value, type, token) =>
        {
            await System.Text.Json.JsonSerializer.SerializeAsync(stream, value, type, cancellationToken: token);
        });

    var workerOptions = new WorkerOptions
    {
        Serializer = mockObjectSerializer.Object
    };
    var mockOptions = new Mock<IOptions<WorkerOptions>>();
    mockOptions.Setup(o => o.Value).Returns(workerOptions);

    // Mock the service provider
    var mockServiceProvider = new Mock<IServiceProvider>();

    // Set up the service provider to return the mock IOptions<WorkerOptions>
    mockServiceProvider.Setup(sp => sp.GetService(typeof(IOptions<WorkerOptions>)))
        .Returns(mockOptions.Object);

    // Set up the service provider to return the mock ObjectSerializer
    mockServiceProvider.Setup(sp => sp.GetService(typeof(ObjectSerializer)))
        .Returns(mockObjectSerializer.Object);

    // Create a mock FunctionContext and assign the service provider
    var mockFunctionContext = new Mock<FunctionContext>();
    mockFunctionContext.SetupGet(c => c.InstanceServices).Returns(mockServiceProvider.Object);
    var mockHttpRequestData = new Mock<HttpRequestData>(mockFunctionContext.Object);

    // Set up the URL property
    mockHttpRequestData.SetupGet(r => r.Url).Returns(new Uri("https://localhost:7075/orchestrators/HelloCities"));

    // If headers are provided, use them, otherwise create a new empty HttpHeadersCollection
    headers ??= new HttpHeadersCollection();

    // Setup the Headers property to return the empty headers
    mockHttpRequestData.SetupGet(r => r.Headers).Returns(headers);

    var mockHttpResponseData = new Mock<HttpResponseData>(mockFunctionContext.Object)
    {
        DefaultValue = DefaultValue.Mock
    };

    // Enable setting StatusCode and Body as mutable properties
    mockHttpResponseData.SetupProperty(r => r.StatusCode, HttpStatusCode.OK);
    mockHttpResponseData.SetupProperty(r => r.Body, new MemoryStream());

    // Setup CreateResponse to return the configured HttpResponseData mock
    mockHttpRequestData.Setup(r => r.CreateResponse())
        .Returns(mockHttpResponseData.Object);

    return mockHttpRequestData.Object;
}
```

Finally, we call the function and verify the results:

```csharp
var result = await HelloCitiesOrchestration.HttpStart(mockRequest, durableClientMock.Object, functionContextMock.Object);

// Verify the status code
Assert.Equal(HttpStatusCode.Accepted, result.StatusCode);

// Reset stream position for reading
result.Body.Position = 0;
var serializedResponseBody = await System.Text.Json.JsonSerializer.DeserializeAsync<dynamic>(result.Body);

// Verify the response returned contains the right data
Assert.Equal(instanceId, serializedResponseBody!.GetProperty("Id").GetString());
```

> [!NOTE]
> Currently, loggers created via FunctionContext in trigger functions aren't supported for mocking in unit tests.


## Unit testing orchestrator functions

Orchestrator functions manage the execution of multiple activity functions. To test an orchestrator:

* Mock the `TaskOrchestrationContext` to control function execution
* Replace `TaskOrchestrationContext` methods needed for orchestrator execution like `CallActivityAsync` with mock functions
* Call the orchestrator directly with the mocked context
* Verify the orchestrator results using assertions

In this section, the unit test validates the behavior of the `HelloCities` orchestrator function:

```csharp
[Function(nameof(HelloCitiesOrchestration))]
public static async Task<List<string>> HelloCities(
    [OrchestrationTrigger] TaskOrchestrationContext context)
{
    ILogger logger = context.CreateReplaySafeLogger(nameof(HelloCities));
    logger.LogInformation("Saying hello.");
    var outputs = new List<string>();

    outputs.Add(await context.CallActivityAsync<string>(nameof(SayHello), "Tokyo"));
    outputs.Add(await context.CallActivityAsync<string>(nameof(SayHello), "Seattle"));
    outputs.Add(await context.CallActivityAsync<string>(nameof(SayHello), "London"));

    return outputs;
}
```

The unit test verifies that the orchestrator calls the correct activity functions with the expected parameters and returns the expected results. The test mocks the `TaskOrchestrationContext` to ensure predictable behavior.

First, we use a mocking framework (Moq in this case) to mock `TaskOrchestrationContext`:

```csharp
// Mock TaskOrchestrationContext and setup logger
var contextMock = new Mock<TaskOrchestrationContext>();
```

Then we mock the `CreateReplaySafeLogger` method to return our test logger:

```csharp
testLogger = new Mock<ILogger>();
contextMock.Setup(x => x.CreateReplaySafeLogger(It.IsAny<string>()))
    .Returns(testLogger.Object);
```

Next, we mock the activity function calls with specific return values for each city:

```csharp
// Mock the activity function calls
contextMock.Setup(x => x.CallActivityAsync<string>(
    It.Is<TaskName>(n => n.Name == nameof(HelloCitiesOrchestration.SayHello)),
    It.Is<string>(n => n == "Tokyo"),
    It.IsAny<TaskOptions>()))
    .ReturnsAsync("Hello Tokyo!");
contextMock.Setup(x => x.CallActivityAsync<string>(
    It.Is<TaskName>(n => n.Name == nameof(HelloCitiesOrchestration.SayHello)),
    It.Is<string>(n => n == "Seattle"),
    It.IsAny<TaskOptions>()))
    .ReturnsAsync("Hello Seattle!");
contextMock.Setup(x => x.CallActivityAsync<string>(
    It.Is<TaskName>(n => n.Name == nameof(HelloCitiesOrchestration.SayHello)),
    It.Is<string>(n => n == "London"),
    It.IsAny<TaskOptions>()))
    .ReturnsAsync("Hello London!");
```

Then we call the orchestrator function with the mocked context:

```csharp
var result = await HelloCitiesOrchestration.HelloCities(contextMock.Object);
```

Finally, we verify the orchestration result and logging behavior:

```csharp
// Verify the orchestration result
Assert.Equal(3, result.Count);
Assert.Equal("Hello Tokyo!", result[0]);
Assert.Equal("Hello Seattle!", result[1]);
Assert.Equal("Hello London!", result[2]);

// Verify logging
testLogger.Verify(
    x => x.Log(
        It.Is<LogLevel>(l => l == LogLevel.Information),
        It.IsAny<EventId>(),
        It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Saying hello")),
        It.IsAny<Exception>(),
        It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
    Times.Once);
```

## Unit testing activity functions

Activity functions require no Durable-specific modifications to be tested. The guidance found in the Azure Functions unit testing overview is sufficient for testing these functions.

In this section, the unit test validates the behavior of the `SayHello` Activity function:

```csharp
[Function(nameof(SayHello))]
public static string SayHello([ActivityTrigger] string name, FunctionContext executionContext)
{
    return $"Hello {name}!";
}
```

The unit test verifies the format of the output:

```csharp
[Fact]
public void SayHello_ReturnsExpectedGreeting()
{
    var functionContextMock = new Mock<FunctionContext>();
    
    const string name = "Tokyo";

    var result = HelloCitiesOrchestration.SayHello(name, functionContextMock.Object);

    // Verify the activity function SayHello returns the right result
    Assert.Equal($"Hello {name}!", result);
}
```

> [!NOTE]
> Currently, loggers created via FunctionContext in activity functions aren't supported for mocking in unit tests.

## Next steps

* Learn more about [xUnit](https://xunit.net/)
* Learn more about [Moq](https://github.com/moq/moq4)
* Learn more about [Azure Functions isolated worker model](../dotnet-isolated-process-guide.md)