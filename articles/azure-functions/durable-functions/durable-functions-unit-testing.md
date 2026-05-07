---
title: "Unit testing Durable Functions and Durable Task SDKs"
description: "Learn how to unit test orchestrator, activity, and client functions for Azure Durable Functions and Durable Task SDKs. Catch bugs early and prevent regressions with these testing patterns."
author: cgillum
ms.topic: how-to
ms.date: 04/27/2026
ms.author: cgillum
ms.service: azure-functions
ms.subservice: durable
zone_pivot_groups: azure-durable-approach
#Customer intent: As a developer, I want to learn how to write unit tests for my durable orchestrations and activities so that I can catch bugs early and prevent regressions.
---

# Unit test Durable Functions and Durable Task SDKs

Unit testing durable orchestrations helps you verify business logic and catch errors early. Orchestrations coordinate multiple activities and can grow complex quickly, so tests protect against regressions as your workflow evolves.

Select the tab that matches your project: **Durable Functions** if you use Azure Functions, or **Durable Task SDKs** if you use the standalone SDK without Azure Functions.

::: zone pivot="durable-functions"

With Durable Functions, you test orchestrators, activities, and client (trigger) functions by **mocking the framework-provided context objects** and calling your functions directly. This approach isolates your business logic from the Azure Functions runtime.

Here's a minimal C# orchestrator test to show the pattern:

```csharp
[Fact]
public async Task MyOrchestrator_CallsActivity()
{
    var contextMock = new Mock<TaskOrchestrationContext>();
    contextMock.Setup(x => x.CallActivityAsync<string>(
        It.IsAny<TaskName>(), It.IsAny<string>(), It.IsAny<TaskOptions>()))
        .ReturnsAsync("result");

    var result = await MyOrchestrator.Run(contextMock.Object);

    Assert.Equal("result", result);
}
```

The rest of this article covers this pattern in detail for C# and Python.

::: zone-end

::: zone pivot="durable-task-sdks"

The standalone Durable Task SDKs provide **built-in test infrastructure** that runs orchestrations in-memory without external dependencies. You register orchestrators and activities with a test worker, schedule orchestrations through a test client, and assert on the results. No mocking is required for C# and JavaScript. Python uses a generator-based approach with manual result injection.

Here's a minimal C# test to show the pattern:

```csharp
[Fact]
public async Task MyOrchestrator_Completes()
{
    await using var host = await DurableTaskTestHost.StartAsync(tasks =>
    {
        tasks.AddOrchestrator<MyOrchestrator>();
        tasks.AddActivity<MyActivity>();
    });

    string id = await host.Client.ScheduleNewOrchestrationInstanceAsync(nameof(MyOrchestrator));
    var result = await host.Client.WaitForInstanceCompletionAsync(id, getInputsAndOutputs: true);

    Assert.Equal(OrchestrationRuntimeStatus.Completed, result.RuntimeStatus);
}
```

The rest of this article covers this pattern in detail for C#, Python, and JavaScript.

::: zone-end

## Prerequisites

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

- [xUnit](https://xunit.net/) — test framework
- [Moq](https://github.com/moq/moq4) — mocking framework
- Familiarity with the [.NET isolated worker model](../dotnet-isolated-process-guide.md)

# [Python](#tab/python)

- Python [unittest](https://docs.python.org/3/library/unittest.html) — test framework
- [unittest.mock](https://docs.python.org/3/library/unittest.mock.html) — mocking library
- Familiarity with the [Python v2 programming model](../functions-reference-python.md)

# [JavaScript](#tab/javascript)

JavaScript unit testing for Durable Functions requires the standalone Durable Task SDK. Switch to the **Durable Task SDKs** tab at the top of this page for JavaScript testing examples with built-in test infrastructure.

---

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

- [xUnit](https://xunit.net/) — test framework
- The [`Microsoft.DurableTask.InProcessTestHost`](https://www.nuget.org/packages/Microsoft.DurableTask.InProcessTestHost) NuGet package (v1.0.0 or later)

# [Python](#tab/python)

- [pytest](https://docs.pytest.org/) — test framework (or `unittest`)
- The [`durabletask`](https://pypi.org/project/durabletask/) PyPI package

# [JavaScript](#tab/javascript)

- [Jest](https://jestjs.io/) — test framework
- The [`@microsoft/durabletask-js`](https://www.npmjs.com/package/@microsoft/durabletask-js) npm package

---

::: zone-end

## Test orchestrator functions

Orchestrator functions coordinate activities, timers, and external events. They typically contain the most business logic and benefit the most from unit testing.

::: zone pivot="durable-functions"

Mock the orchestration context to control the return values of activity calls. Then call your orchestrator directly and verify the output.

# [C#](#tab/csharp)

Consider this orchestrator that calls an activity three times:

```csharp
[Function(nameof(HelloCitiesOrchestration))]
public static async Task<List<string>> HelloCities(
    [OrchestrationTrigger] TaskOrchestrationContext context)
{
    var outputs = new List<string>
    {
        await context.CallActivityAsync<string>(nameof(SayHello), "Tokyo"),
        await context.CallActivityAsync<string>(nameof(SayHello), "Seattle"),
        await context.CallActivityAsync<string>(nameof(SayHello), "London")
    };

    return outputs;
}
```

Use Moq to mock `TaskOrchestrationContext` and set up expected return values for each activity call.

> [!NOTE]
> The `It.Is<TaskName>(...)` pattern is required because `CallActivityAsync` accepts a `TaskName` struct, not a plain string. Moq needs the explicit type match.

```csharp
[Fact]
public async Task HelloCities_ReturnsExpectedGreetings()
{
    var contextMock = new Mock<TaskOrchestrationContext>();

    // Mock each activity call to return a known value
    contextMock.Setup(x => x.CallActivityAsync<string>(
        It.Is<TaskName>(n => n.Name == nameof(SayHello)),
        It.Is<string>(n => n == "Tokyo"),
        It.IsAny<TaskOptions>())).ReturnsAsync("Hello Tokyo!");

    contextMock.Setup(x => x.CallActivityAsync<string>(
        It.Is<TaskName>(n => n.Name == nameof(SayHello)),
        It.Is<string>(n => n == "Seattle"),
        It.IsAny<TaskOptions>())).ReturnsAsync("Hello Seattle!");

    contextMock.Setup(x => x.CallActivityAsync<string>(
        It.Is<TaskName>(n => n.Name == nameof(SayHello)),
        It.Is<string>(n => n == "London"),
        It.IsAny<TaskOptions>())).ReturnsAsync("Hello London!");

    var result = await HelloCitiesOrchestration.HelloCities(contextMock.Object);

    Assert.Equal(3, result.Count);
    Assert.Equal("Hello Tokyo!", result[0]);
    Assert.Equal("Hello Seattle!", result[1]);
    Assert.Equal("Hello London!", result[2]);
}
```

# [Python](#tab/python)

Consider this orchestrator that chains three activity calls:

```python
import azure.durable_functions as df

def my_orchestrator(context: df.DurableOrchestrationContext):
    result1 = yield context.call_activity("say_hello", "Tokyo")
    result2 = yield context.call_activity("say_hello", "Seattle")
    result3 = yield context.call_activity("say_hello", "London")
    return [result1, result2, result3]
```

Mock the context and use `orchestrator_generator_wrapper` to process the generator.

> [!NOTE]
> The Azure Durable Functions SDK provides `orchestrator_generator_wrapper` to simulate the replay mechanism that drives Python orchestrator generators. The standalone Durable Task SDK doesn't include this utility, so the [Durable Task SDKs](#test-orchestrator-functions) tab uses manual `gen.send()` calls instead.

```python
import unittest
from unittest.mock import Mock, call
from azure.durable_functions.testing import orchestrator_generator_wrapper

from function_app import my_orchestrator


def mock_activity(activity_name, input_value):
    mock_task = Mock()
    mock_task.result = f"Hello {input_value}!"
    return mock_task


class TestOrchestrator(unittest.TestCase):
    def test_chaining_orchestrator(self):
        # Extract the raw orchestrator function from the Azure Functions decorator wrapper
        func_call = my_orchestrator.build().get_user_function().orchestrator_function

        context = Mock()
        context.call_activity = Mock(side_effect=mock_activity)

        user_orchestrator = func_call(context)
        values = list(orchestrator_generator_wrapper(user_orchestrator))

        expected_calls = [
            call("say_hello", "Tokyo"),
            call("say_hello", "Seattle"),
            call("say_hello", "London"),
        ]
        self.assertEqual(context.call_activity.call_args_list, expected_calls)
        self.assertEqual(values[-1], ["Hello Tokyo!", "Hello Seattle!", "Hello London!"])
```

# [JavaScript](#tab/javascript)

For JavaScript unit testing, switch to the **Durable Task SDKs** tab at the top of this page.

---

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

Use `DurableTaskTestHost` to run orchestrations in-memory. Register your production orchestrator and activity classes, schedule an orchestration, and assert on the result.

Given these production classes:

```csharp
class HelloCitiesOrchestrator : TaskOrchestrator<string, List<string>>
{
    public override async Task<List<string>> RunAsync(
        TaskOrchestrationContext context, string input)
    {
        var outputs = new List<string>
        {
            await context.CallActivityAsync<string>(nameof(SayHelloActivity), "Tokyo"),
            await context.CallActivityAsync<string>(nameof(SayHelloActivity), "Seattle"),
            await context.CallActivityAsync<string>(nameof(SayHelloActivity), "London")
        };
        return outputs;
    }
}

class SayHelloActivity : TaskActivity<string, string>
{
    public override Task<string> RunAsync(TaskActivityContext context, string name)
    {
        return Task.FromResult($"Hello {name}!");
    }
}
```

Register them directly in the test host:

```csharp
[Fact]
public async Task HelloCities_ReturnsExpectedGreetings()
{
    await using var host = await DurableTaskTestHost.StartAsync(tasks =>
    {
        tasks.AddOrchestrator<HelloCitiesOrchestrator>();
        tasks.AddActivity<SayHelloActivity>();
    });

    string instanceId = await host.Client.ScheduleNewOrchestrationInstanceAsync(
        nameof(HelloCitiesOrchestrator));
    OrchestrationMetadata result = await host.Client.WaitForInstanceCompletionAsync(
        instanceId, getInputsAndOutputs: true);

    Assert.Equal(OrchestrationRuntimeStatus.Completed, result.RuntimeStatus);

    var output = result.ReadOutputAs<List<string>>();
    Assert.Equal(3, output.Count);
    Assert.Equal("Hello Tokyo!", output[0]);
    Assert.Equal("Hello Seattle!", output[1]);
    Assert.Equal("Hello London!", output[2]);
}
```

`DurableTaskTestHost` runs a complete in-memory orchestration engine. No external services or sidecar processes are required.

# [Python](#tab/python)

The Python Durable Task SDK doesn't yet provide a built-in test harness like C# and JavaScript. Use standard mocking to test orchestrator logic. Mock the `OrchestrationContext` and drive the generator by sending simulated activity results back for each `yield`.

> [!NOTE]
> Unlike the Azure Durable Functions SDK (which provides `orchestrator_generator_wrapper`), the standalone Durable Task SDK requires you to manually advance the generator with `gen.send()`. This gives you explicit control over the simulated activity results.

```python
from unittest.mock import Mock, call
from durabletask import task


def hello(ctx: task.ActivityContext, name: str) -> str:
    return f"Hello {name}!"


def hello_cities(ctx: task.OrchestrationContext, _):
    result1 = yield ctx.call_activity(hello, input="Tokyo")
    result2 = yield ctx.call_activity(hello, input="Seattle")
    result3 = yield ctx.call_activity(hello, input="London")
    return [result1, result2, result3]


def test_hello_cities():
    ctx = Mock(spec=task.OrchestrationContext)

    # Each call_activity returns a mock task; collect them to send results back
    mock_tasks = []
    def fake_call_activity(activity, *, input):
        t = Mock()
        t._input = input
        mock_tasks.append(t)
        return t

    ctx.call_activity = Mock(side_effect=fake_call_activity)

    # Start the generator
    gen = hello_cities(ctx, None)
    yielded = next(gen)  # first yield: call_activity(hello, input="Tokyo")

    # Send simulated results back for each yield
    try:
        yielded = gen.send("Hello Tokyo!")
        yielded = gen.send("Hello Seattle!")
        gen.send("Hello London!")
    except StopIteration as e:
        result = e.value

    # Verify the orchestrator called the right activities
    assert ctx.call_activity.call_count == 3
    assert result == ["Hello Tokyo!", "Hello Seattle!", "Hello London!"]
```

This approach tests the orchestrator's control flow without depending on SDK internals.

# [JavaScript](#tab/javascript)

Use `TestOrchestrationWorker` and `TestOrchestrationClient` to run orchestrations in-memory:

```javascript
const {
    InMemoryOrchestrationBackend,
    TestOrchestrationClient,
    TestOrchestrationWorker,
    OrchestrationStatus,
} = require("@microsoft/durabletask-js");

test("helloCities returns expected greetings", async () => {
    const backend = new InMemoryOrchestrationBackend();
    const client = new TestOrchestrationClient(backend);
    const worker = new TestOrchestrationWorker(backend);

    const sayHello = async (_, name) => `Hello ${name}!`;

    const helloCities = async function* (ctx) {
        const outputs = [];
        outputs.push(yield ctx.callActivity(sayHello, "Tokyo"));
        outputs.push(yield ctx.callActivity(sayHello, "Seattle"));
        outputs.push(yield ctx.callActivity(sayHello, "London"));
        return outputs;
    };

    worker.addOrchestrator(helloCities);
    worker.addActivity(sayHello);
    await worker.start();

    const id = await client.scheduleNewOrchestration(helloCities);
    const state = await client.waitForOrchestrationCompletion(id, true, 10);

    expect(state.runtimeStatus).toEqual(OrchestrationStatus.COMPLETED);
    expect(JSON.parse(state.serializedOutput)).toEqual([
        "Hello Tokyo!",
        "Hello Seattle!",
        "Hello London!",
    ]);

    await worker.stop();
});
```

The test infrastructure runs the full orchestration engine in-process. No sidecar or external services are required.

---

::: zone-end

## Test activity functions

Activity functions contain the actual work — calling APIs, processing data, or interacting with external systems. They're the simplest function type to test because they have no framework-specific replay behavior.

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

Activity functions in Azure Functions receive an input and optionally a `FunctionContext`. Test them like any other function:

```csharp
[Function(nameof(SayHello))]
public static string SayHello(
    [ActivityTrigger] string name, FunctionContext executionContext)
{
    return $"Hello {name}!";
}
```

```csharp
[Fact]
public void SayHello_ReturnsExpectedGreeting()
{
    var result = HelloCitiesOrchestration.SayHello("Tokyo", Mock.Of<FunctionContext>());
    Assert.Equal("Hello Tokyo!", result);
}
```

# [Python](#tab/python)

Activity functions in Azure Functions are regular Python functions. Test them directly. For more information, see [Azure Functions Python unit testing](../functions-reference-python.md#unit-testing).

```python
def say_hello(name: str) -> str:
    return f"Hello {name}!"

def test_say_hello():
    result = say_hello("Tokyo")
    assert result == "Hello Tokyo!"
```

# [JavaScript](#tab/javascript)

For JavaScript activity testing, switch to the **Durable Task SDKs** tab at the top of this page.

---

::: zone-end

::: zone pivot="durable-task-sdks"

Activity functions receive a context object and an input. The context provides metadata like the orchestration ID and task ID, but most tests don't need it.

# [C#](#tab/csharp)

Using the `SayHelloActivity` class from the orchestrator example, call `RunAsync` directly with a mock context:

```csharp
[Fact]
public async Task SayHello_ReturnsExpectedGreeting()
{
    var activity = new SayHelloActivity();
    var contextMock = new Mock<TaskActivityContext>();

    var result = await activity.RunAsync(contextMock.Object, "Tokyo");

    Assert.Equal("Hello Tokyo!", result);
}
```

When you use `DurableTaskTestHost`, activities also run as part of the orchestration test. You don't need separate activity tests unless the activity has complex logic.

# [Python](#tab/python)

Test the activity function directly — no special setup is required:

```python
from durabletask import task


def hello(ctx: task.ActivityContext, name: str) -> str:
    return f"Hello {name}!"


def test_hello():
    ctx = Mock(spec=task.ActivityContext)
    result = hello(ctx, "Tokyo")
    assert result == "Hello Tokyo!"
```

# [JavaScript](#tab/javascript)

Test the activity function directly:

```javascript
const sayHello = async (_, name) => `Hello ${name}!`;

test("sayHello returns expected greeting", async () => {
    const result = await sayHello(undefined, "Tokyo");
    expect(result).toBe("Hello Tokyo!");
});
```

---

::: zone-end

::: zone pivot="durable-functions"

## Test client functions

Client functions (also called trigger functions) start orchestrations and manage instances. They use the durable client binding to interact with the orchestration engine.

# [C#](#tab/csharp)

Consider this HTTP trigger that starts an orchestration:

```csharp
[Function("HelloCitiesOrchestration_HttpStart")]
public static async Task<HttpResponseData> HttpStart(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req,
    [DurableClient] DurableTaskClient client,
    FunctionContext executionContext)
{
    string instanceId = await client.ScheduleNewOrchestrationInstanceAsync(
        nameof(HelloCitiesOrchestration));
    return await client.CreateCheckStatusResponseAsync(req, instanceId);
}
```

Mock `DurableTaskClient` to return a known instance ID:

```csharp
[Fact]
public async Task HttpStart_ReturnsAccepted()
{
    var durableClientMock = new Mock<DurableTaskClient>("testClient");
    var functionContextMock = new Mock<FunctionContext>();
    var instanceId = "test-instance-id";

    durableClientMock
        .Setup(x => x.ScheduleNewOrchestrationInstanceAsync(
            It.IsAny<TaskName>(),
            It.IsAny<object>(),
            It.IsAny<StartOrchestrationOptions>(),
            It.IsAny<CancellationToken>()))
        .ReturnsAsync(instanceId);

    var mockRequest = CreateMockHttpRequest(functionContextMock.Object);

    var responseMock = new Mock<HttpResponseData>(functionContextMock.Object);
    responseMock.SetupGet(r => r.StatusCode).Returns(HttpStatusCode.Accepted);

    durableClientMock
        .Setup(x => x.CreateCheckStatusResponseAsync(
            It.IsAny<HttpRequestData>(),
            It.IsAny<string>(),
            It.IsAny<CancellationToken>()))
        .ReturnsAsync(responseMock.Object);

    var result = await HelloCitiesOrchestration.HttpStart(
        mockRequest, durableClientMock.Object, functionContextMock.Object);

    Assert.Equal(HttpStatusCode.Accepted, result.StatusCode);
}
```

# [Python](#tab/python)

Consider this HTTP trigger that starts an orchestration:

```python
@app.route(route="start")
@app.durable_client_input(client_name="client")
async def http_start(req: func.HttpRequest, client):
    instance_id = await client.start_new("my_orchestrator")
    return client.create_check_status_response(req, instance_id)
```

Mock the durable client:

```python
import asyncio
import unittest
import azure.functions as func
from unittest.mock import AsyncMock, Mock

from function_app import http_start


class TestClientFunction(unittest.TestCase):
    def test_http_start(self):
        # Extract the raw client function from the Azure Functions decorator wrapper
        func_call = http_start.build().get_user_function().client_function

        req = func.HttpRequest(
            method="GET",
            body=b"{}",
            url="/api/start",
        )

        client = Mock()
        client.start_new = AsyncMock(return_value="test-instance-id")
        client.create_check_status_response = Mock(return_value="check_status_response")

        result = asyncio.run(func_call(req, client))

        client.start_new.assert_called_once_with("my_orchestrator")
        client.create_check_status_response.assert_called_once_with(req, "test-instance-id")
```

# [JavaScript](#tab/javascript)

For JavaScript client testing, switch to the **Durable Task SDKs** tab at the top of this page.

---

::: zone-end

::: zone pivot="durable-task-sdks"

## Test client operations

With the standalone Durable Task SDKs, client operations (scheduling orchestrations, querying status, raising events) use the same `TestOrchestrationClient` already shown in the orchestrator tests. No separate client function exists — you call the client API directly.

# [C#](#tab/csharp)

`DurableTaskTestHost` exposes `host.Client`, which is a fully functional `DurableTaskClient`. Use it to test client-level operations like scheduling, querying, or terminating orchestrations:

```csharp
[Fact]
public async Task Client_CanQueryOrchestrationStatus()
{
    await using var host = await DurableTaskTestHost.StartAsync(tasks =>
    {
        tasks.AddOrchestrator<HelloCitiesOrchestrator>();
        tasks.AddActivity<SayHelloActivity>();
    });

    string instanceId = await host.Client.ScheduleNewOrchestrationInstanceAsync(
        nameof(HelloCitiesOrchestrator));

    // Query status while the orchestration runs
    OrchestrationMetadata metadata = await host.Client.WaitForInstanceCompletionAsync(
        instanceId, getInputsAndOutputs: true);

    Assert.Equal(OrchestrationRuntimeStatus.Completed, metadata.RuntimeStatus);
    Assert.Equal(instanceId, metadata.InstanceId);
}
```

# [Python](#tab/python)

The Python Durable Task SDK doesn't yet provide a built-in test client. Test client-level logic (scheduling, querying) by mocking the `TaskHubGrpcClient`:

```python
from unittest.mock import AsyncMock, Mock


def test_schedule_orchestration():
    client = Mock()
    client.schedule_new_orchestration = AsyncMock(return_value="test-id")

    # Call your application code that uses the client
    import asyncio
    instance_id = asyncio.run(client.schedule_new_orchestration("my_orchestrator"))

    assert instance_id == "test-id"
    client.schedule_new_orchestration.assert_called_once_with("my_orchestrator")
```

# [JavaScript](#tab/javascript)

`TestOrchestrationClient` supports the same operations as the production client. Use it to test scheduling, status queries, and event raising:

```javascript
const {
    InMemoryOrchestrationBackend,
    TestOrchestrationClient,
    TestOrchestrationWorker,
    OrchestrationStatus,
} = require("@microsoft/durabletask-js");

test("client can schedule and query orchestration", async () => {
    const backend = new InMemoryOrchestrationBackend();
    const client = new TestOrchestrationClient(backend);
    const worker = new TestOrchestrationWorker(backend);

    const myOrchestrator = async function* (ctx) {
        return "done";
    };

    worker.addOrchestrator(myOrchestrator);
    await worker.start();

    const id = await client.scheduleNewOrchestration(myOrchestrator);
    const state = await client.waitForOrchestrationCompletion(id, true, 10);

    expect(state.runtimeStatus).toEqual(OrchestrationStatus.COMPLETED);
    expect(JSON.parse(state.serializedOutput)).toBe("done");

    await worker.stop();
});
```

---

::: zone-end

## Related content

::: zone pivot="durable-functions"

- [Durable Functions overview](../../durable-task/common/what-is-durable-task.md)
- [Orchestrator function code constraints](../../durable-task/common/durable-task-code-constraints.md)
- [Migrate from in-process to isolated worker (.NET)](./durable-functions-migrate.md)
- [Serialization and persistence in Durable Functions](./durable-functions-serialization-and-persistence.md)

::: zone-end

::: zone pivot="durable-task-sdks"

- [What is Durable Task?](../../durable-task/common/what-is-durable-task.md)
- [Orchestrator function code constraints](../../durable-task/common/durable-task-code-constraints.md)
- [Develop with the Durable Task Scheduler](../../durable-task/scheduler/develop-with-durable-task-scheduler.md)

::: zone-end
