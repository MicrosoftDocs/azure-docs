---
title: Durable Functions Unit Testuing
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

This page shows how to unit test Durable Functions. Two abstract classes are available that allow mocking:

* [DurableOrchestrationClientBase](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClientBase.html) 

* [DurableOrchestrationContextBase](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContextBase.html)

These classes are base classes for [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) and [DurableOrchestrationContext](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html) that define Orchestration Client and Orchestrator methods. The mocks will set expectable behavior for all base class methods so the unit test can verify the business logic. There is 2-step workflow for unit testing the business logic in the Orchestration Client and Orchestrator:

1. Use the base classes instead of the concrete implementation when defining Orchestration Client and Orchestrator's signatures
2. In the unit tests mock the behavior of the base classes and verify the business logic 

Find more details in the following paragraphs for testing Orchestration Client and Orchestrator.

## Unit testing

Visual Studio currently provides the best experience for developing apps that use Durable Functions. Run your functions locally and also publish them to Azure. You can start with an empty project or with a set of sample functions.

### Prerequisites

* Install the [latest version of Visual Studio](https://www.visualstudio.com/downloads/) (version 15.3 or greater). Include the **Azure development** workload in your setup options.

* Set up [xUnit](http://xunit.github.io/docs/getting-started-dotnet-core) in Visual Studio  

* Add [moq](https://www.nuget.org/packages/moq/) NuGet package to your project

* Add [FluentAssertions](https://www.nuget.org/packages/FluentAssertions/) NuGet package

### Unit test Orchestration Client

1. First, use [DurableOrchestrationClientBase](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClientBase.html)  instead of  [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) in the signature of the Orchestration client function:

```csharp
[FunctionName("HttpSyncStart")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(
            AuthorizationLevel.Function, methods: "post", Route = "orchestrators/{functionName}/wait")]
            HttpRequestMessage req,
            [OrchestrationClient] DurableOrchestrationClientBase starter,
            string functionName,
            TraceWriter log)
        {
            ...
        }
```

2. Mock the behavior of [DurableOrchestrationClientBase](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClientBase.html) in your unit tests. The following sample uses [xUnit](https://xunit.github.io/) and the popular mocking library [moq](https://github.com/moq/moq4):

 ```csharp

 var durableOrchestrationClientBaseMock = new Mock<DurableOrchestrationClientBase> { CallBase = true };
            durableOrchestrationClientBaseMock.
                Setup(x => x.StartNewAsync(FunctionName, It.IsAny<object>())).
                ReturnsAsync(InstanceId);
            durableOrchestrationClientBaseMock
                .Setup(x => x.WaitForCompletionOrCreateCheckStatusResponseAsync(request, InstanceId, timeout, retryInterval))
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(EventData)
                });

 ```

The goal will be to verify the behavior defined in this Orchestration client:

```csharp
using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;

namespace VSSample
{
    public static class HttpSyncStart
    {
        private const string Timeout = "timeout";
        private const string RetryInterval = "retryInterval";


        [FunctionName("HttpSyncStart")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(
            AuthorizationLevel.Function, methods: "post", Route = "orchestrators/{functionName}/wait")]
            HttpRequestMessage req,
            [OrchestrationClient] DurableOrchestrationClientBase starter,
            string functionName,
            TraceWriter log)
        {
            // Function input comes from the request content.
            dynamic eventData = await req.Content.ReadAsAsync<object>();
            string instanceId = await starter.StartNewAsync(functionName, eventData);

            log.Info($"Started orchestration with ID = '{instanceId}'.");

            TimeSpan? timeout = GetTimeSpan(req, Timeout);
            TimeSpan? retryInterval = GetTimeSpan(req, RetryInterval);
            
            return await starter.WaitForCompletionOrCreateCheckStatusResponseAsync(
                req,
                instanceId,
                timeout,
                retryInterval);
        }

        private static TimeSpan? GetTimeSpan(HttpRequestMessage request, string queryParameterName)
        {
            var queryParameterStringValue = request.GetQueryNameValuePairs()?
                .FirstOrDefault(x => x.Key == queryParameterName)
                .Value;
            if (string.IsNullOrEmpty(queryParameterStringValue)) { return null; }
            return TimeSpan.FromSeconds(double.Parse(queryParameterStringValue));
        }
    }
}

```

Complete sample with a helper method used by several tests can be found in the following snippet: The original Orchestration client function has minimal business logic. So, the unit tests are demonstrating the mocking:

```csharp
using System;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Moq;
using FluentAssertions;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;

namespace VSSample.Tests
{
    public class HttpSyncStartTests
    {
        private const string FunctionName = "SampleFunction";
        private const string EventData = "EventData";
        private const string InstanceId = "7E467BDB-213F-407A-B86A-1954053D3C24";

        [Fact]
        public async Task Run_uses_default_values_when_query_parameters_missing()
        {
            await Check_behavior_based_on_query_parameters("https://www.microsoft.com/", null, null);
        }

        [Fact]
        public async Task Run_uses_default_value_for_timeout()
        {
            await Check_behavior_based_on_query_parameters("https://www.microsoft.com/?retryInterval=2", null, TimeSpan.FromSeconds(2));
        }

        [Fact]
        public async Task Run_uses_default_value_for_retryInterval()
        {
            await Check_behavior_based_on_query_parameters("https://www.microsoft.com/?timeout=6", TimeSpan.FromSeconds(6), null);
        }

        [Fact]
        public async Task Run_uses_query_parameters()
        {
            await Check_behavior_based_on_query_parameters("https://www.microsoft.com/?timeout=6&retryInterval=2", TimeSpan.FromSeconds(6), TimeSpan.FromSeconds(2));
        }

        private static async Task Check_behavior_based_on_query_parameters(string url, TimeSpan? timeout, TimeSpan? retryInterval)
        {
            var name = new Name { First = "John", Last = "Smith" };
            var request = new HttpRequestMessage
            {
                Content = new StringContent(JsonConvert.SerializeObject(name), Encoding.UTF8, "application/json"),
                RequestUri = new Uri(url)
            };
            var traceWriterMock = new Mock<TraceWriter>(TraceLevel.Info);
            var durableOrchestrationClientBaseMock = new Mock<DurableOrchestrationClientBase> { CallBase = true };
            durableOrchestrationClientBaseMock.
                Setup(x => x.StartNewAsync(FunctionName, It.IsAny<object>())).
                ReturnsAsync(InstanceId);
            durableOrchestrationClientBaseMock
                .Setup(x => x.WaitForCompletionOrCreateCheckStatusResponseAsync(request, InstanceId, timeout, retryInterval))
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(EventData)
                });
            var result = await HttpSyncStart.Run(request, durableOrchestrationClientBaseMock.Object, FunctionName, traceWriterMock.Object);
            result.StatusCode.Should().Be(HttpStatusCode.OK);
            (await result.Content.ReadAsStringAsync()).Should().Be(EventData);
        }
    }

    public class Name
    {
        public string First { get; set; }
        public string Last { get; set; }
    }
}

```

### Unit test Orchestrator

Orchestrator functions have more business logic so unit testing them is more common scenario.

1. First, use [DurableOrchestrationContextBase](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContextBase.html)  instead of  [DurableOrchestrationContext](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html) in the signature of the Orchestrator function:

```csharp
[FunctionName("E1_HelloSequence")]
        public static async Task<List<string>> Run(
            [OrchestrationTrigger] DurableOrchestrationContextBase context)
        {
            ...
        }
```

2. Mock the behavior of [DurableOrchestrationContextBase](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContextBase.html) in your unit tests. The following sample uses [xUnit](https://xunit.github.io/) and the popular mocking library [moq](https://github.com/moq/moq4):

The goal will be to verify the behavior defined in this Orchestrator:

```csharp
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;

namespace VSSample
{
    public static class HelloSequence
    {
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

        [FunctionName("E1_SayHello")]
        public static string SayHello([ActivityTrigger] string name)
        {
            return $"Hello {name}!";
        }
    }
 }
```

Next, the mocked behavior will be set up:

```csharp

 var durableOrchestrationContextMock = new Mock<DurableOrchestrationContextBase>();
            durableOrchestrationContextMock.Setup(x => x.CallActivityAsync<string>("E1_SayHello", "Tokyo")).ReturnsAsync("Hello Tokyo!");
            durableOrchestrationContextMock.Setup(x => x.CallActivityAsync<string>("E1_SayHello", "Seattle")).ReturnsAsync("Hello Seattle!");
            durableOrchestrationContextMock.Setup(x => x.CallActivityAsync<string>("E1_SayHello", "London")).ReturnsAsync("Hello London!");

```

Complete sample with two tests is available in the following snippet:

```csharp

using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Moq;
using Xunit;

namespace VSSample.Tests
{
    public class HelloSequenceTests
    {
        [Fact]
        public void SayHello_returns_greeting()
        {
            var result = HelloSequence.SayHello("Tokyo");
            Assert.Equal("Hello Tokyo!", result);
        }

        [Fact]
        public async Task Run_retuns_multiple_greetings()
        {
            var durableOrchestrationContextMock = new Mock<DurableOrchestrationContextBase>();
            durableOrchestrationContextMock.Setup(x => x.CallActivityAsync<string>("E1_SayHello", "Tokyo")).ReturnsAsync("Hello Tokyo!");
            durableOrchestrationContextMock.Setup(x => x.CallActivityAsync<string>("E1_SayHello", "Seattle")).ReturnsAsync("Hello Seattle!");
            durableOrchestrationContextMock.Setup(x => x.CallActivityAsync<string>("E1_SayHello", "London")).ReturnsAsync("Hello London!");

            var result = await HelloSequence.Run(durableOrchestrationContextMock.Object);

            Assert.Equal(3, result.Count);
            Assert.Equal("Hello Tokyo!", result[0]);
            Assert.Equal("Hello Seattle!", result[1]);
            Assert.Equal("Hello London!", result[2]);
        }
    }
}

```

## Next steps

> [!div class="nextstepaction"]
> [Run the function chaining sample](durable-functions-sequence.md)
