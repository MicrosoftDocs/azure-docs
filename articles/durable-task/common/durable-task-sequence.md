---
title: Function chaining
description: Learn how to run a sample that executes a sequence of functions using Durable Functions or Durable Task SDKs.
author: hhunter-ms
ms.topic: concept-article
ms.service: durable-task
ms.date: 02/04/2026
ms.author: hannahhunter
ms.devlang: csharp
# ms.devlang: csharp, javascript, python
ms.custom: devx-track-js, devx-track-python
zone_pivot_groups: azure-durable-approach
---

# Function chaining

::: zone pivot="durable-functions"

Function chaining is a pattern where you run a sequence of functions in order. It's common to pass the output of one function to the input of the next. This article describes the chaining sequence you build when you complete the Durable Functions quickstart ([C#](../../azure-functions/durable-functions/durable-functions-isolated-create-first-csharp.md), [JavaScript](../../azure-functions/durable-functions/quickstart-js-vscode.md), [TypeScript](../../azure-functions/durable-functions/quickstart-ts-vscode.md), [Python](../../azure-functions/durable-functions/quickstart-python-vscode.md), [PowerShell](../../azure-functions/durable-functions/quickstart-powershell-vscode.md), or [Java](../../azure-functions/durable-functions/quickstart-java.md)). Learn more in [Durable Functions overview](what-is-durable-task.md).

[!INCLUDE [durable-functions-prerequisites](../../../includes/durable-functions-prerequisites.md)]

::: zone-end

::: zone pivot="durable-task-sdks"

Function chaining is a pattern where you run a sequence of activities in order. It's common to pass the output of one activity to the input of the next. This article describes the chaining sequence for the Durable Task SDKs for .NET, JavaScript, Python, and Java.

::: zone-end

## Functions

::: zone pivot="durable-functions"

This article describes these functions in the sample app:

* `E1_HelloSequence`: An [orchestrator function](../../azure-functions/durable-functions/durable-functions-bindings.md#orchestration-trigger) that calls `E1_SayHello` multiple times in sequence. It stores each output and records the results.
* `E1_SayHello`: An [activity function](../../azure-functions/durable-functions/durable-functions-bindings.md#activity-trigger) that adds "Hello" to the start of a string.
* `HttpStart`: An HTTP-triggered [durable client](../../azure-functions/durable-functions/durable-functions-bindings.md#orchestration-client) function that starts an instance of the orchestrator.

::: zone-end

::: zone pivot="durable-task-sdks"

This article describes these components in the sample app:

* `GreetingOrchestration`, `greetingOrchestrator`, `function_chaining_orchestrator`, or `ActivityChaining`: An orchestrator that calls multiple activities in sequence. It stores each output and records the results.
* Activity functions: Activities that process input and return results. Each activity performs a simple transformation on the input.
* Client: A client app that starts an instance of the orchestrator and waits for the result.

::: zone-end

## Orchestrator

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/HelloSequence.cs?range=13-25)]

All C# orchestration functions must have a parameter of type `DurableOrchestrationContext`, which exists in the `Microsoft.Azure.WebJobs.Extensions.DurableTask` assembly. This context object lets you call other *activity* functions and pass input parameters using its `CallActivityAsync` method.

The code calls `E1_SayHello` three times in sequence with different parameter values. The return value of each call is added to the `outputs` list, which is returned at the end of the function.

# [JavaScript](#tab/javascript)

<details>
<summary><b>V3 programming model</b></summary>

#### function.json

If you develop in Visual Studio Code or the Azure portal, here's the orchestrator *function.json* file.

:::code language="javascript" source="~/azure-functions-durable-js/samples/E1_HelloSequence/function.json":::

The key setting is the `orchestrationTrigger` binding type. All orchestrator functions must use this trigger type.

> [!WARNING]
> To follow the "no I/O" rule for orchestrator functions, don't use input or output bindings with the `orchestrationTrigger` trigger binding. If you need other input or output bindings, use them in `activityTrigger` functions that the orchestrator calls. For more information, see [orchestrator function code constraints](durable-task-code-constraints.md).

#### index.js

Here is the orchestrator function:

:::code language="javascript" source="~/azure-functions-durable-js/samples/E1_HelloSequence/index.js":::

All JavaScript orchestration functions must include the [`durable-functions` module](https://www.npmjs.com/package/durable-functions). It's a library that enables you to write Durable Functions in JavaScript. Three key differences between an orchestrator function and other JavaScript functions:

1. The orchestrator function is a [generator function](/scripting/javascript/advanced/iterators-and-generators-javascript).
1. The function is wrapped in a call to the `durable-functions` module's `orchestrator` method (here `df`).
1. The function is synchronous. Because the `orchestrator` method calls `context.done`, the function returns.

The `context` object contains a `df` durable orchestration context object that lets you call other *activity* functions and pass input parameters using its `callActivity` method. The code calls `E1_SayHello` three times in sequence with different parameter values, using `yield` to indicate the execution should wait on the async activity function calls to be returned. The return value of each call is added to the `outputs` array, which is returned at the end of the function.

</details>

<br>

<details>
<summary><b>V4 programming model</b></summary>

:::code language="javascript" source="~/azure-functions-durable-js-v3/samples-js/functions/sayHello.js" range="1-14":::

All JavaScript orchestration functions must include the [`durable-functions` module](https://www.npmjs.com/package/durable-functions). This module enables you to write Durable Functions in JavaScript. To use the V4 node programming model, you need to install the `v3.x` version of `durable-functions`.

Two key differences between an orchestrator function and other JavaScript functions:

1. The orchestrator function is a [generator function](/scripting/javascript/advanced/iterators-and-generators-javascript).
1. The function is synchronous. The function returns.

The `context` object contains a `df` durable orchestration context object that lets you call other *activity* functions and pass input parameters using its `callActivity` method. The code calls `sayHello` three times in sequence with different parameter values, using `yield` to indicate the execution should wait on the async activity function calls to be returned. The return value of each call is added to the `outputs` array, which is returned at the end of the function.

</details>

# [Python](#tab/python)

> [!NOTE]
> Python Durable Functions are available for the Functions 3.0 runtime only.


#### function.json

If you use Visual Studio Code or the Azure portal for development, here's the content of the *function.json* file for the orchestrator function. Most orchestrator *function.json* files look almost exactly like this.

[!code-json[Main](~/samples-durable-functions-python/samples/function_chaining/E1_HelloSequence/function.json)]

The important thing is the `orchestrationTrigger` binding type. All orchestrator functions must use this trigger type.

> [!WARNING]
> To abide by the "no I/O" rule of orchestrator functions, don't use any input or output bindings when using the `orchestrationTrigger` trigger binding.  If other input or output bindings are needed, they should instead be used in the context of `activityTrigger` functions, which are called by the orchestrator. For more information, see the [orchestrator function code constraints](durable-task-code-constraints.md) article.

#### \_\_init\_\_.py

Here is the orchestrator function:

[!code-python[Main](~/samples-durable-functions-python/samples/function_chaining/E1_HelloSequence/\_\_init\_\_.py)]

All Python orchestration functions must include the [`durable-functions` package](https://pypi.org/project/azure-functions-durable). It's a library that enables you to write Durable Functions in Python. Two key differences between an orchestrator function and other Python functions:

1. The orchestrator function is a [generator function](https://wiki.python.org/moin/Generators).
1. The _file_ registers the orchestrator function by stating `main = df.Orchestrator.create(<orchestrator function name>)` at the end of the file. This helps distinguish it from other helper functions declared in the file.

The `context` object lets you call other *activity* functions and pass input parameters using its `call_activity` method. The code calls `E1_SayHello` three times in sequence with different parameter values, using `yield` to indicate the execution should wait on the async activity function calls to be returned. The return value of each call is returned at the end of the function.

# [PowerShell](#tab/powershell)

PowerShell sample isn't available yet.

# [Java](#tab/java)

Java sample isn't available yet.

---

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

This code shows an orchestrator that calls three activities in sequence and passes each output to the next activity:

```csharp
using System.Threading.Tasks;
using Microsoft.DurableTask;

[DurableTask]
public class GreetingOrchestration : TaskOrchestrator<string, string>
{
    public override async Task<string> RunAsync(TaskOrchestrationContext context, string name)
    {
        // Step 1: Say hello to the person
        string greeting = await context.CallActivityAsync<string>(nameof(SayHelloActivity), name);

        // Step 2: Process the greeting
        string processedGreeting = await context.CallActivityAsync<string>(nameof(ProcessGreetingActivity), greeting);

        // Step 3: Finalize the response
        string finalResponse = await context.CallActivityAsync<string>(nameof(FinalizeResponseActivity), processedGreeting);

        return finalResponse;
    }
}
```

All .NET orchestrators inherit from `TaskOrchestrator<TInput, TOutput>`. The `TaskOrchestrationContext` lets you call activities using `CallActivityAsync`. The code calls three activities in sequence, where each activity receives the output of the previous activity.

# [JavaScript](#tab/javascript)

The following code shows an orchestrator that calls three activities in sequence:

```typescript
import {
  OrchestrationContext,
  TOrchestrator,
} from "@microsoft/durabletask-js";

const greetingOrchestrator: TOrchestrator = async function* (
  ctx: OrchestrationContext,
  name: string
): any {
  // Step 1: Say hello to the person
  const greeting: string = yield ctx.callActivity(sayHello, name);

  // Step 2: Process the greeting
  const processedGreeting: string = yield ctx.callActivity(processGreeting, greeting);

  // Step 3: Finalize the response
  const finalResponse: string = yield ctx.callActivity(finalizeResponse, processedGreeting);

  return finalResponse;
};
```

All JavaScript orchestrators are generator functions (`async function*`) that use `yield` to call activities. The orchestration context's `callActivity` method schedules activity execution. The code calls three activities in sequence, passing each activity's output to the next.

# [Python](#tab/python)

The following code shows an orchestrator that calls three activities in sequence:

```python
from durabletask import task

# Orchestrator function
def function_chaining_orchestrator(ctx: task.OrchestrationContext, name: str) -> str:
    """Orchestrator that demonstrates function chaining pattern."""

    # Call first activity
    greeting = yield ctx.call_activity(say_hello, input=name)

    # Call second activity with the result from first activity
    processed_greeting = yield ctx.call_activity(process_greeting, input=greeting)

    # Call third activity with the result from second activity
    final_response = yield ctx.call_activity(finalize_response, input=processed_greeting)

    return final_response
```

All Python orchestrators are generator functions that use `yield` to call activities. The orchestration context's `call_activity` method schedules activity execution. The code calls three activities in sequence, passing each activity's output to the next.

# [PowerShell](#tab/powershell)

This sample is shown for .NET, JavaScript, Java, and Python.

# [Java](#tab/java)

The following code shows an orchestrator that calls three activities in sequence:

```java
import com.microsoft.durabletask.DurableTaskGrpcWorker;
import com.microsoft.durabletask.DurableTaskSchedulerWorkerExtensions;
import com.microsoft.durabletask.TaskOrchestration;
import com.microsoft.durabletask.TaskOrchestrationFactory;

DurableTaskGrpcWorker worker = DurableTaskSchedulerWorkerExtensions.createWorkerBuilder(connectionString)
    .addOrchestration(new TaskOrchestrationFactory() {
        @Override
        public String getName() { return "ActivityChaining"; }

        @Override
        public TaskOrchestration create() {
            return ctx -> {
                String input = ctx.getInput(String.class);

                // Call activities in sequence, passing output from one to the next
                String x = ctx.callActivity("Reverse", input, String.class).await();
                String y = ctx.callActivity("Capitalize", x, String.class).await();
                String z = ctx.callActivity("ReplaceWhitespace", y, String.class).await();

                ctx.complete(z);
            };
        }
    })
    .build();
```

In Java, orchestrators are defined using `TaskOrchestrationFactory`. The context's `callActivity` method schedules activity execution, and `await()` waits for the result. The code calls three activities in sequence, passing each activity's output to the next.

---

::: zone-end

## Activity

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/HelloSequence.cs?range=27-32)]

Activities use the `ActivityTrigger` attribute. Use `IDurableActivityContext` for activity actions, like reading input with `GetInput<T>`.

`E1_SayHello` formats a greeting string.

Instead of binding to `IDurableActivityContext`, bind directly to the type passed into the activity function. For example:

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/HelloSequence.cs?range=34-38)]

# [JavaScript](#tab/javascript)

<details>
<summary><b>V3 programming model</b></summary>

#### E1_SayHello/function.json

The *function.json* file for the activity function `E1_SayHello` is similar to that of `E1_HelloSequence` except that it uses an `activityTrigger` binding type instead of an `orchestrationTrigger` binding type.

:::code language="javascript" source="~/azure-functions-durable-js/samples/E1_SayHello/function.json":::

> [!NOTE]
> Use the `activityTrigger` binding for all activity functions that an orchestration function calls.

The implementation of `E1_SayHello` is a relatively trivial string formatting operation.

#### E1_SayHello/index.js

:::code language="javascript" source="~/azure-functions-durable-js/samples/E1_SayHello/index.js":::

Unlike the orchestration function, an activity function doesn't need special setup. The orchestrator passes input on the `context.bindings` object under the name of the `activityTrigger` binding—in this case, `context.bindings.name`. Set the binding name as a parameter of the exported function to access it directly, as the sample does.

</details>

<br>

<details>
<summary><b>V4 programming model</b></summary>

`sayHello` formats a greeting string.

:::code language="javascript" source="~/azure-functions-durable-js-v3/samples-js/functions/sayHello.js" range="1-4, 37-41":::

Unlike the orchestration function, an activity function doesn't need special setup. The orchestrator passes input as the first argument to the function. The second argument is the invocation context, which this example doesn't use.

</details>

# [Python](#tab/python)

#### E1_SayHello/function.json

The *function.json* file for the activity function `E1_SayHello` is similar to that of `E1_HelloSequence` except that it uses an `activityTrigger` binding type instead of an `orchestrationTrigger` binding type.

[!code-json[Main](~/samples-durable-functions-python/samples/function_chaining/E1_SayHello/function.json)]

> [!NOTE]
> All activity functions called by an orchestration function must use the `activityTrigger` binding.

The implementation of `E1_SayHello` is a relatively trivial string formatting operation.

#### E1_SayHello/\_\_init\_\_.py

[!code-python[Main](~/samples-durable-functions-python/samples/function_chaining/E1_SayHello/\_\_init\_\_.py)]

Unlike the orchestrator function, an activity function needs no special setup. The input passed to it by the orchestrator function is directly accessible as the parameter to the function.

# [PowerShell](#tab/powershell)

PowerShell sample coming soon.

# [Java](#tab/java)

Java sample coming soon.

---

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

Activities in the Durable Task SDK inherit from `TaskActivity<TInput, TOutput>`:

```csharp
using System.Threading.Tasks;
using Microsoft.DurableTask;
using Microsoft.Extensions.Logging;

[DurableTask]
public class SayHelloActivity : TaskActivity<string, string>
{
    private readonly ILogger<SayHelloActivity> _logger;

    public SayHelloActivity(ILogger<SayHelloActivity> logger)
    {
        _logger = logger;
    }

    public override Task<string> RunAsync(TaskActivityContext context, string name)
    {
        _logger.LogInformation("Activity SayHello called with name: {Name}", name);
        return Task.FromResult($"Hello {name}!");
    }
}

[DurableTask]
public class ProcessGreetingActivity : TaskActivity<string, string>
{
    public override Task<string> RunAsync(TaskActivityContext context, string greeting)
    {
        return Task.FromResult($"{greeting} How are you today?");
    }
}

[DurableTask]
public class FinalizeResponseActivity : TaskActivity<string, string>
{
    public override Task<string> RunAsync(TaskActivityContext context, string response)
    {
        return Task.FromResult($"{response} I hope you're doing well!");
    }
}
```

Use dependency injection to get services like `ILogger`. Add the `[DurableTask]` attribute to register the activity with the worker.

# [JavaScript](#tab/javascript)

Activities in the Durable Task SDK are simple functions:

```typescript
import { ActivityContext } from "@microsoft/durabletask-js";

const sayHello = async (_ctx: ActivityContext, name: string): Promise<string> => {
  return `Hello ${name}!`;
};

const processGreeting = async (_ctx: ActivityContext, greeting: string): Promise<string> => {
  return `${greeting} How are you today?`;
};

const finalizeResponse = async (_ctx: ActivityContext, response: string): Promise<string> => {
  return `${response} I hope you're doing well!`;
};
```

Unlike orchestrators, activities can perform I/O operations like HTTP calls, database queries, and file access. The input is passed directly as a parameter.

# [Python](#tab/python)

Activities in the Durable Task SDK are simple functions:

```python
from durabletask import task

def say_hello(ctx: task.ActivityContext, name: str) -> str:
    """First activity that greets the user."""
    return f"Hello {name}!"

def process_greeting(ctx: task.ActivityContext, greeting: str) -> str:
    """Second activity that processes the greeting."""
    return f"{greeting} How are you today?"

def finalize_response(ctx: task.ActivityContext, response: str) -> str:
    """Third activity that finalizes the response."""
    return f"{response} I hope you're doing well!"
```

Unlike orchestrators, activities can perform I/O operations like HTTP calls, database queries, and file access. The input is passed directly as a parameter.

# [PowerShell](#tab/powershell)

This sample is shown for .NET, JavaScript, Java, and Python.

# [Java](#tab/java)

Activities in Java are defined using `TaskActivityFactory`:

```java
import com.microsoft.durabletask.TaskActivity;
import com.microsoft.durabletask.TaskActivityFactory;

.addActivity(new TaskActivityFactory() {
    @Override
    public String getName() { return "Reverse"; }

    @Override
    public TaskActivity create() {
        return ctx -> {
            String input = ctx.getInput(String.class);
            StringBuilder builder = new StringBuilder(input);
            builder.reverse();
            return builder.toString();
        };
    }
})
.addActivity(new TaskActivityFactory() {
    @Override
    public String getName() { return "Capitalize"; }

    @Override
    public TaskActivity create() {
        return ctx -> ctx.getInput(String.class).toUpperCase();
    }
})
.addActivity(new TaskActivityFactory() {
    @Override
    public String getName() { return "ReplaceWhitespace"; }

    @Override
    public TaskActivity create() {
        return ctx -> {
            String input = ctx.getInput(String.class);
            return input.trim().replaceAll("\\s", "-");
        };
    }
})
```

Register each activity with the worker builder by using `addActivity`. Activities can perform I/O operations and return results to the orchestrator.

---

::: zone-end

## Client

::: zone pivot="durable-functions"

Start an orchestrator function instance from a client function. Use the `HttpStart` HTTP-triggered function to start instances of `E1_HelloSequence`.

# [C#](#tab/csharp)

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/HttpStart.cs?range=13-30)]

To interact with orchestrators, add a `DurableClient` input binding. Use the client to start an orchestration and return an HTTP response that includes URLs to check the status of the new orchestration.

# [JavaScript](#tab/javascript)

<details>
<summary><b>V3 programming model</b></summary>

#### HttpStart/function.json

:::code language="javascript" source="~/azure-functions-durable-js/samples/HttpStart/function.json?highlight=16-20":::

To interact with orchestrators, add a `durableClient` input binding.

#### HttpStart/index.js

:::code language="javascript" source="~/azure-functions-durable-js/samples/HttpStart/index.js":::

Use `df.getClient` to get a `DurableOrchestrationClient` object. Use the client to start an orchestration and return an HTTP response that includes URLs to check the status of the new orchestration.

</details>

<br>

<details>
<summary><b>V4 programming model</b></summary>

:::code language="javascript" source="~/azure-functions-durable-js-v3/samples-js/functions/httpStart.js":::

To manage and interact with orchestrators, add a `durableClient` input binding. Specify the binding in the `extraInputs` argument when you register the function. Get the `durableClient` input by calling `df.input.durableClient()`.

Use `df.getClient` to get a `DurableClient` object. Use the client to start an orchestration and return an HTTP response that includes URLs to check the status of the new orchestration.

</details>

# [Python](#tab/python)

#### HttpStart/function.json

[!code-json[Main](~/samples-durable-functions-python/samples/function_chaining/HttpStart/function.json)]

To interact with orchestrators, the function must include a `durableClient` input binding.

#### HttpStart/\_\_init\_\_.py

[!code-python[Main](~/samples-durable-functions-python/samples/function_chaining/HttpStart/\_\_init\_\_.py)]

Use the `DurableOrchestrationClient` constructor to create a Durable Functions client. Use the client to start an orchestration and return an HTTP response that includes URLs to check the status of the new orchestration.

# [PowerShell](#tab/powershell)

PowerShell sample coming soon.

# [Java](#tab/java)

Java sample coming soon.

---

::: zone-end

::: zone pivot="durable-task-sdks"

Start an orchestration from a client application. The client schedules the orchestration and can wait for completion.

# [C#](#tab/csharp)

```csharp
using System;
using Microsoft.DurableTask.Client;

// Create the client
var client = DurableTaskClientBuilder.UseDurableTaskScheduler(connectionString).Build();

// Schedule a new orchestration instance
string instanceId = await client.ScheduleNewOrchestrationInstanceAsync(
    nameof(GreetingOrchestration),
    input: "World");

Console.WriteLine($"Started orchestration with ID: {instanceId}");

// Wait for the orchestration to complete
OrchestrationMetadata result = await client.WaitForInstanceCompletionAsync(
    instanceId,
    getInputsAndOutputs: true);

Console.WriteLine($"Orchestration completed with result: {result.ReadOutputAs<string>()}");
```

Create the `DurableTaskClient` by using a connection string to the Durable Task Scheduler. Use `ScheduleNewOrchestrationInstanceAsync` to start an orchestration and `WaitForInstanceCompletionAsync` to wait for completion.

# [JavaScript](#tab/javascript)

```typescript
import {
  DurableTaskAzureManagedClientBuilder,
} from "@microsoft/durabletask-js-azuremanaged";

const connectionString =
  process.env.DURABLE_TASK_SCHEDULER_CONNECTION_STRING ||
  "Endpoint=http://localhost:8080;Authentication=None;TaskHub=default";

const client = new DurableTaskAzureManagedClientBuilder()
  .connectionString(connectionString)
  .build();

// Schedule a new orchestration instance
const instanceId = await client.scheduleNewOrchestration(greetingOrchestrator, "World");
console.log(`Started orchestration with ID: ${instanceId}`);

// Wait for the orchestration to complete
const state = await client.waitForOrchestrationCompletion(instanceId, true, 30);
console.log(`Orchestration completed with result: ${state?.serializedOutput}`);
```

Create the `DurableTaskAzureManagedClientBuilder` by using a connection string to the Durable Task Scheduler. Use `scheduleNewOrchestration` to start an orchestration and `waitForOrchestrationCompletion` to wait for completion.

# [Python](#tab/python)

```python
from durabletask.azuremanaged.client import DurableTaskSchedulerClient

# Create the client
client = DurableTaskSchedulerClient(
    host_address=endpoint,
    secure_channel=endpoint != "http://localhost:8080",
    taskhub=taskhub_name,
    token_credential=credential
)

# Schedule a new orchestration instance
instance_id = client.schedule_new_orchestration(
    function_chaining_orchestrator,
    input="World"
)

print(f"Started orchestration with ID: {instance_id}")

# Wait for the orchestration to complete
result = client.wait_for_orchestration_completion(instance_id, timeout=60)

if result and result.runtime_status == "COMPLETED":
    print(f"Orchestration completed with result: {result.serialized_output}")
```

The `DurableTaskSchedulerClient` connects to the Durable Task Scheduler. Use `schedule_new_orchestration` to start an orchestration and `wait_for_orchestration_completion` to wait for completion.

# [PowerShell](#tab/powershell)

This sample is shown for .NET, JavaScript, Java, and Python.

# [Java](#tab/java)

```java
import java.time.Duration;

import com.microsoft.durabletask.DurableTaskClient;
import com.microsoft.durabletask.NewOrchestrationInstanceOptions;
import com.microsoft.durabletask.OrchestrationMetadata;
import com.microsoft.durabletask.azuremanaged.DurableTaskSchedulerClientExtensions;

// Create the client
DurableTaskClient client = DurableTaskSchedulerClientExtensions
    .createClientBuilder(connectionString)
    .build();

// Schedule a new orchestration instance
String instanceId = client.scheduleNewOrchestrationInstance(
    "ActivityChaining",
    new NewOrchestrationInstanceOptions().setInput("Hello, world!"));

System.out.println("Started orchestration with ID: " + instanceId);

// Wait for the orchestration to complete
OrchestrationMetadata result = client.waitForInstanceCompletion(
    instanceId,
    Duration.ofSeconds(30),
    true);

System.out.println("Orchestration completed with result: " + result.readOutputAs(String.class));
```

Create the `DurableTaskClient` by using a connection string. Use `scheduleNewOrchestrationInstance` to start an orchestration and `waitForInstanceCompletion` to wait for completion.

---

::: zone-end

## Run the sample

::: zone pivot="durable-functions"

To run the `E1_HelloSequence` orchestration, send this HTTP POST request to the `HttpStart` function.

```http
POST http://{host}/orchestrators/E1_HelloSequence
```

> [!NOTE]
> The previous HTTP snippet assumes the sample's *host.json* file removes the default `api/` prefix from all HTTP trigger function URLs. Find this configuration in the sample's *host.json* file.

For example, if you're running the sample in a function app named `myfunctionapp`, replace `{host}` with `myfunctionapp.azurewebsites.net`.

The request returns HTTP 202 (trimmed for brevity):

```http
HTTP/1.1 202 Accepted
Content-Length: 719
Content-Type: application/json; charset=utf-8
Location: http://{host}/runtime/webhooks/durabletask/instances/96924899c16d43b08a536de376ac786b?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}

(...trimmed...)
```

The orchestration queues and starts running immediately. Use the URL in the `Location` header to check execution status.

```http
GET http://{host}/runtime/webhooks/durabletask/instances/96924899c16d43b08a536de376ac786b?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}
```

The response shows the orchestration status. Because it finishes quickly, the instance is often in the *Completed* state and returns a response like this (trimmed for brevity):

```
HTTP/1.1 200 OK
Content-Length: 179
Content-Type: application/json; charset=utf-8

{"runtimeStatus":"Completed","input":null,"output":["Hello Tokyo!","Hello Seattle!","Hello London!"],"createdTime":"2017-06-29T05:24:57Z","lastUpdatedTime":"2017-06-29T05:24:59Z"}
```

The instance `runtimeStatus` is *Completed*, and `output` contains the JSON-serialized result of the orchestrator function execution.

> [!NOTE]
> Implement similar starter logic for other trigger types, like `queueTrigger`, `eventHubTrigger`, or `timerTrigger`.

Review the function execution logs. The `E1_HelloSequence` function starts and completes multiple times because of the replay behavior described in [orchestration reliability](durable-task-orchestrations.md#reliability). But `E1_SayHello` runs only three times because activity function executions don't replay.

::: zone-end

::: zone pivot="durable-task-sdks"

To run the sample, you need:

1. **Start the Durable Task Scheduler emulator** (for local development):

   ```bash
   docker run -d -p 8080:8080 -p 8082:8082 --name dts-emulator mcr.microsoft.com/dts/dts-emulator:latest
   ```

2. **Start the worker** to register the orchestrator and activities.

3. **Run the client** to schedule an orchestration and wait for the result.

The client output shows the chained orchestration result:

```text
Started orchestration with ID: abc123
Orchestration completed with result: "Hello World! How are you today? I hope you're doing well!"
```

The worker logs show each activity runs in sequence and passes its output to the next activity.

::: zone-end

## Next steps

::: zone pivot="durable-functions"

This sample demonstrates a simple function chaining orchestration. Next, implement the fan-out/fan-in pattern.

> [!div class="nextstepaction"]
> [Run the Fan-out/fan-in sample](durable-task-fan-in-fan-out.md)

::: zone-end

::: zone pivot="durable-task-sdks"

This sample demonstrates a simple function chaining orchestration. Next, explore more patterns.

> [!div class="nextstepaction"]
> [Get started with Durable Task SDKs](../sdks/quickstart-portable-durable-task-sdks.md)

For complete JavaScript SDK examples, see the [Durable Task JavaScript SDK samples](https://github.com/microsoft/durabletask-js/tree/main/examples/azure-managed).

::: zone-end
