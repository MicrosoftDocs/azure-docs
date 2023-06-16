---
title: Function chaining in Durable Functions - Azure
description: Learn how to run a Durable Functions sample that executes a sequence of functions.
author: cgillum
ms.topic: conceptual
ms.date: 06/16/2022
ms.author: azfuncdf
ms.devlang: csharp, javascript, python
ms.custom: devx-track-js
---

# Function chaining in Durable Functions - Hello sequence sample

Function chaining refers to the pattern of executing a sequence of functions in a particular order. Often the output of one function needs to be applied to the input of another function. This article describes the chaining sequence that you create when you complete the Durable Functions quickstart ([C#](durable-functions-create-first-csharp.md),  [JavaScript](quickstart-js-vscode.md), [TypeScript](quickstart-ts-vscode.md), [Python](quickstart-python-vscode.md), [PowerShell](quickstart-powershell-vscode.md), or [Java](quickstart-java.md)). For more information about Durable Functions, see [Durable Functions overview](durable-functions-overview.md).

[!INCLUDE [durable-functions-prerequisites](../../../includes/durable-functions-prerequisites.md)]

[!INCLUDE [functions-nodejs-durable-model-description](../../../includes/functions-nodejs-durable-model-description.md)]

## The functions

This article explains the following functions in the sample app:

* `E1_HelloSequence`: An [orchestrator function](durable-functions-bindings.md#orchestration-trigger) that calls `E1_SayHello` multiple times in a sequence. It stores the outputs from the `E1_SayHello` calls and records the results.
* `E1_SayHello`: An [activity function](durable-functions-bindings.md#activity-trigger) that prepends a string with "Hello".
* `HttpStart`: An HTTP triggered [durable client](durable-functions-bindings.md#orchestration-client) function that starts an instance of the orchestrator.

## E1_HelloSequence orchestrator function

# [C#](#tab/csharp)

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/HelloSequence.cs?range=13-25)]

All C# orchestration functions must have a parameter of type `DurableOrchestrationContext`, which exists in the `Microsoft.Azure.WebJobs.Extensions.DurableTask` assembly. This context object lets you call other *activity* functions and pass input parameters using its `CallActivityAsync` method.

The code calls `E1_SayHello` three times in sequence with different parameter values. The return value of each call is added to the `outputs` list, which is returned at the end of the function.

# [JavaScript (PM3)](#tab/javascript-v3)

#### function.json

If you use Visual Studio Code or the Azure portal for development, here's the content of the *function.json* file for the orchestrator function. Most orchestrator *function.json* files look almost exactly like this.

:::code language="javascript" source="~/azure-functions-durable-js/samples/E1_HelloSequence/function.json":::

The important thing is the `orchestrationTrigger` binding type. All orchestrator functions must use this trigger type.

> [!WARNING]
> To abide by the "no I/O" rule of orchestrator functions, don't use any input or output bindings when using the `orchestrationTrigger` trigger binding.  If other input or output bindings are needed, they should instead be used in the context of `activityTrigger` functions, which are called by the orchestrator. For more information, see the [orchestrator function code constraints](durable-functions-code-constraints.md) article.

#### index.js

Here is the orchestrator function:

:::code language="javascript" source="~/azure-functions-durable-js/samples/E1_HelloSequence/index.js":::

All JavaScript orchestration functions must include the [`durable-functions` module](https://www.npmjs.com/package/durable-functions). It's a library that enables you to write Durable Functions in JavaScript. There are three significant differences between an orchestrator function and other JavaScript functions:

1. The orchestrator function is a [generator function](/scripting/javascript/advanced/iterators-and-generators-javascript).
2. The function is wrapped in a call to the `durable-functions` module's `orchestrator` method (here `df`).
3. The function must be synchronous. Because the 'orchestrator' method handles the final call to 'context.done', the function should simply 'return'.

The `context` object contains a `df` durable orchestration context object that lets you call other *activity* functions and pass input parameters using its `callActivity` method. The code calls `E1_SayHello` three times in sequence with different parameter values, using `yield` to indicate the execution should wait on the async activity function calls to be returned. The return value of each call is added to the `outputs` array, which is returned at the end of the function.

# [JavaScript (PM4)](#tab/javascript-v4)

:::code language="javascript" source="~/azure-functions-durable-js-v3/samples-js/functions/sayHello.js" range="1-14":::

All JavaScript orchestration functions must include the [`durable-functions` module](https://www.npmjs.com/package/durable-functions). This module enables you to write Durable Functions in JavaScript. To use the V4 node programming model, you need to install the preview `v3.x` version of `durable-functions`. 

There are two significant differences between an orchestrator function and other JavaScript functions:

1. The orchestrator function is a [generator function](/scripting/javascript/advanced/iterators-and-generators-javascript).
2. The function must be synchronous. The function should simply 'return'.

The `context` object contains a `df` durable orchestration context object that lets you call other *activity* functions and pass input parameters using its `callActivity` method. The code calls `sayHello` three times in sequence with different parameter values, using `yield` to indicate the execution should wait on the async activity function calls to be returned. The return value of each call is added to the `outputs` array, which is returned at the end of the function.

# [Python](#tab/python)

> [!NOTE]
> Python Durable Functions are available for the Functions 3.0 runtime only.


#### function.json

If you use Visual Studio Code or the Azure portal for development, here's the content of the *function.json* file for the orchestrator function. Most orchestrator *function.json* files look almost exactly like this.

[!code-json[Main](~/samples-durable-functions-python/samples/function_chaining/E1_HelloSequence/function.json)]

The important thing is the `orchestrationTrigger` binding type. All orchestrator functions must use this trigger type.

> [!WARNING]
> To abide by the "no I/O" rule of orchestrator functions, don't use any input or output bindings when using the `orchestrationTrigger` trigger binding.  If other input or output bindings are needed, they should instead be used in the context of `activityTrigger` functions, which are called by the orchestrator. For more information, see the [orchestrator function code constraints](durable-functions-code-constraints.md) article.

#### \_\_init\_\_.py

Here is the orchestrator function:

[!code-python[Main](~/samples-durable-functions-python/samples/function_chaining/E1_HelloSequence/\_\_init\_\_.py)]

All Python orchestration functions must include the [`durable-functions` package](https://pypi.org/project/azure-functions-durable). It's a library that enables you to write Durable Functions in Python. There are two significant differences between an orchestrator function and other Python functions:

1. The orchestrator function is a [generator function](https://wiki.python.org/moin/Generators).
2. The _file_ should register the orchestrator function as an orchestrator by stating `main = df.Orchestrator.create(<orchestrator function name>)` at the end of the file. This helps distinguish it from other, helper, functions declared in the file.

The `context` object lets you call other *activity* functions and pass input parameters using its `call_activity` method. The code calls `E1_SayHello` three times in sequence with different parameter values, using `yield` to indicate the execution should wait on the async activity function calls to be returned. The return value of each call is returned at the end of the function.

---

## E1_SayHello activity function

# [C#](#tab/csharp)

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/HelloSequence.cs?range=27-32)]

Activities use the `ActivityTrigger` attribute. Use the provided `IDurableActivityContext` to perform activity related actions, such as accessing the input value using `GetInput<T>`.

The implementation of `E1_SayHello` is a relatively trivial string formatting operation.

Instead of binding to an `IDurableActivityContext`, you can bind directly to the type that is passed into the activity function. For example:

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/HelloSequence.cs?range=34-38)]

# [JavaScript (PM3)](#tab/javascript-v3)

#### E1_SayHello/function.json

The *function.json* file for the activity function `E1_SayHello` is similar to that of `E1_HelloSequence` except that it uses an `activityTrigger` binding type instead of an `orchestrationTrigger` binding type.

:::code language="javascript" source="~/azure-functions-durable-js/samples/E1_SayHello/function.json":::

> [!NOTE]
> All activity functions called by an orchestration function must use the `activityTrigger` binding.

The implementation of `E1_SayHello` is a relatively trivial string formatting operation.

#### E1_SayHello/index.js

:::code language="javascript" source="~/azure-functions-durable-js/samples/E1_SayHello/index.js":::

Unlike the orchestration function, an activity function needs no special setup. The input passed to it by the orchestrator function is located on the `context.bindings` object under the name of the `activityTrigger` binding - in this case, `context.bindings.name`. The binding name can be set as a parameter of the exported function and accessed directly, which is what the sample code does.

# [JavaScript (PM4)](#tab/javascript-v4)

The implementation of `sayHello` is a relatively trivial string formatting operation.

:::code language="javascript" source="~/azure-functions-durable-js-v3/samples-js/functions/sayHello.js" range="1-4, 37-41":::

Unlike the orchestration function, an activity function needs no special setup. The input passed to it by the orchestrator function is the first argument to the function. The second argument is the invocation context, which is not used in this example.


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

---

## HttpStart client function

You can start an instance of orchestrator function using a client function. You will use the `HttpStart` HTTP triggered function to start instances of `E1_HelloSequence`.

# [C#](#tab/csharp)

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/HttpStart.cs?range=13-30)]

To interact with orchestrators, the function must include a `DurableClient` input binding. You use the client to start an orchestration. It can also help you return an HTTP response containing URLs for checking the status of the new orchestration.

# [JavaScript (PM3)](#tab/javascript-v3)

#### HttpStart/function.json

:::code language="javascript" source="~/azure-functions-durable-js/samples/HttpStart/function.json?highlight=16-20":::

To interact with orchestrators, the function must include a `durableClient` input binding.

#### HttpStart/index.js

:::code language="javascript" source="~/azure-functions-durable-js/samples/HttpStart/index.js":::

Use `df.getClient` to obtain a `DurableOrchestrationClient` object. You use the client to start an orchestration. It can also help you return an HTTP response containing URLs for checking the status of the new orchestration.

# [JavaScript (PM4)](#tab/javascript-v4)

:::code language="javascript" source="~/azure-functions-durable-js-v3/samples-js/functions/httpStart.js":::

To manage and interact with orchestrators, the function needs a `durableClient` input binding. This binding needs to be specified in the `extraInputs` argument when registering the function. A `durableClient` input can be obtained by calling `df.input.durableClient()`.

Use `df.getClient` to obtain a `DurableClient` object. You use the client to start an orchestration. It can also help you return an HTTP response containing URLs for checking the status of the new orchestration.

# [Python](#tab/python)

#### HttpStart/function.json

[!code-json[Main](~/samples-durable-functions-python/samples/function_chaining/HttpStart/function.json)]

To interact with orchestrators, the function must include a `durableClient` input binding.

#### HttpStart/\_\_init\_\_.py

[!code-python[Main](~/samples-durable-functions-python/samples/function_chaining/HttpStart/\_\_init\_\_.py)]

Use the `DurableOrchestrationClient` constructor to obtain a Durable Functions client. You use the client to start an orchestration. It can also help you return an HTTP response containing URLs for checking the status of the new orchestration.

---

## Run the sample

To execute the `E1_HelloSequence` orchestration, send the following HTTP POST request to the `HttpStart` function.

```
POST http://{host}/orchestrators/E1_HelloSequence
```

> [!NOTE]
> The previous HTTP snippet assumes there is an entry in the `host.json` file which removes the default `api/` prefix from all HTTP trigger functions URLs. You can find the markup for this configuration in the `host.json` file in the samples.

For example, if you're running the sample in a function app named "myfunctionapp", replace "{host}" with "myfunctionapp.azurewebsites.net".

The result is an HTTP 202 response, like this (trimmed for brevity):

```
HTTP/1.1 202 Accepted
Content-Length: 719
Content-Type: application/json; charset=utf-8
Location: http://{host}/runtime/webhooks/durabletask/instances/96924899c16d43b08a536de376ac786b?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}

(...trimmed...)
```

At this point, the orchestration is queued up and begins to run immediately. The URL in the `Location` header can be used to check the status of the execution.

```
GET http://{host}/runtime/webhooks/durabletask/instances/96924899c16d43b08a536de376ac786b?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}
```

The result is the status of the orchestration. It runs and completes quickly, so you see it in the *Completed* state with a response that looks like this (trimmed for brevity):

```
HTTP/1.1 200 OK
Content-Length: 179
Content-Type: application/json; charset=utf-8

{"runtimeStatus":"Completed","input":null,"output":["Hello Tokyo!","Hello Seattle!","Hello London!"],"createdTime":"2017-06-29T05:24:57Z","lastUpdatedTime":"2017-06-29T05:24:59Z"}
```

As you can see, the `runtimeStatus` of the instance is *Completed* and the `output` contains the JSON-serialized result of the orchestrator function execution.

> [!NOTE]
> You can implement similar starter logic for other trigger types, like `queueTrigger`, `eventHubTrigger`, or `timerTrigger`.

Look at the function execution logs. The `E1_HelloSequence` function started and completed multiple times due to the replay behavior described in the [orchestration reliability](durable-functions-orchestrations.md#reliability) topic. On the other hand, there were only three executions of `E1_SayHello` since those function executions do not get replayed.

## Next steps

This sample has demonstrated a simple function-chaining orchestration. The next sample shows how to implement the fan-out/fan-in pattern.

> [!div class="nextstepaction"]
> [Run the Fan-out/fan-in sample](durable-functions-cloud-backup.md)
