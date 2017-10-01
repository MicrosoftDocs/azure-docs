---
title: Function chaining in Durable Functions for Azure Functions
description: Learn how to develop a Durable Functions implementation that executes a sequence of functions.
services: functions
author: cgillum
manager: cfowler
editor: ''
tags: ''
keywords:
ms.service: functions
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 09/29/2017
ms.author: cgillum
---

# Function chaining in Durable Functions - Hello sequence example
The simplest use case for Durable Functions is function chaining. Function chaining means calling one function after another, and may or may not involve passing state between them. This is an extremely simple and trivial example intended to show a very small slice of the features supported by Durable Functions.

## Before you begin
If you haven't done so already, make sure to read the [overview](~/articles/overview.md) before jumping into samples. It will really help ensure everything you read below makes sense.

All samples are combined into a single function app package. To get started with the samples, follow the setup steps below that are relevant for your development environment:

### For Visual Studio Development (Windows Only)
1. Download the [VSDFSampleApp.zip](~/files/VSDFSampleApp.zip) package, unzip the contents, and open in Visual Studio 2017 (version 15.3).
2. Install and run the [Azure Storage Emulator](https://docs.microsoft.com/en-us/azure/storage/storage-use-emulator) (Version 5.2 or later is required). Alternatively, you can update the `local.appsettings.json` file with real Azure Storage connection strings.
3. The sample can now be run locally via F5. It can also be published directly to Azure and run in the cloud.

### For Azure Portal Development
1. Create a new function app at https://functions.azure.com/signin.
2. Follow the [installation instructions](~/articles/installation.md) to configure Durable Functions.
3. Download the [DFSampleApp.zip](~/files/DFSampleApp.zip) package.
4. Unzip the sample package file into `D:\home\site\wwwroot` using Kudu or FTP.

The code snippets and binding references below are specific to the portal experience, but have a direct mapping to the equivalent Visual Studio development experience.

This article will specifically walk through the following functions in the sample app:

* **E1_HelloSequence**: An orchestrator function which calls **E1_SayHello** multiple times in a sequence and records the results.
* **E1_SayHello**: An activity function which basically prepends a string with "Hello".

## The functions
The purpose of the **E1_HelloSequence** orchestrator function is to call **E1_SayHello** multiple times in sequence, store the outputs, and return them.

Here is the content of the `function.json` file for this orchestrator function. Most orchestrator function.json files will look almost exactly like this.

[!code-json[Main](~/../samples/csx/E1_HelloSequence/function.json)]

The important thing is the `orchestrationTrigger` binding type. All orchestrator functions must use this trigger type.

> [!WARNING]
> An orchestration function should never use any input or output bindings when using the `orchestrationTrigger` trigger binding in order to abide by the "no I/O" rule of orchestrator functions. If other input or output bindings are needed, they should instead be used in the context of `activityTrigger` functions.

Here is the source code:

[!code-csharp[Main](~/../samples/csx/E1_HelloSequence/run.csx)]

All C# orchestration functions must have a **DurableOrchestrationContext** parameter, which exists in the **Microsoft.Azure.WebJobs.Extensions.DurableTask** assembly. If authoring the function using C# scripting syntax, it can be referenced using the `#r` notation. This context object allows calling other *activity* functions and passing input parameters using its <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.CallActivityAsync*> method.

The code is very simple in that it calls **E1_SayHello** three times in a sequence with different parameter values. The return value of each call is added to the `outputs` list, which is returned at the end of the function.

The function.json for **E1_SayHello** is similar to to that of **E1_HelloSequence** except that it uses an `activityTrigger` binding type instead of an `orchestrationTrigger` binding type.

[!code-json[Main](~/../samples/csx/E1_SayHello/function.json)]

> [!NOTE]
Any function called by an orchestration function must use the `activityTrigger` binding.

The implementation of **E1_SayHello** is a relatively trivial string formatting operation.

[!code-csharp[Main](~/../samples/csx/E1_SayHello/run.csx)]

Note that this function has a corresponding <xref:Microsoft.Azure.WebJobs.DurableActivityContext>, which it uses to get to input that was passed to it by the orchestrator function's call to <xref:Microsoft.Azure.WebJobs.DurableOrchestrationContext.CallActivityAsync*>.

## Running the orchestration
The simplest way to execute the **E1_HelloSequence** orchestration is to make the following HTTP call.

```plaintext
POST http://{app-name}.azurewebsites.net/orchestrators/E1_HelloSequence
```
The result will be an HTTP 202 response, like this (trimmed for brevity):

```plaintext
HTTP/1.1 202 Accepted
Content-Length: 719
Content-Type: application/json; charset=utf-8
Location: http://{host}/admin/extensions/DurableTaskExtension/instances/96924899c16d43b08a536de376ac786b?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}

(...trimmed...)
```

At this point, the orchestration is queued up and should begin running immediately. The URL in the `Location` header above can be used to check the status of the execution.

```plaintext
GET http://{host}/admin/extensions/DurableTaskExtension/instances/96924899c16d43b08a536de376ac786b?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}
```

The result is the status of the orchestration. It should run and complete quickly, so you should expect to see it in the *Completed* state with a response that looks like this (trimmed for brevity):

```plaintext
HTTP/1.1 200 OK
Content-Length: 179
Content-Type: application/json; charset=utf-8

{"runtimeStatus":"Completed","input":null,"output":["Hello Tokyo!","Hello Seattle!","Hello London!"],"createdTime":"2017-06-29T05:24:57Z","lastUpdatedTime":"2017-06-29T05:24:59Z"}
```

As you can see, the `runtimeStatus` of the instance is *Completed* and the `output` contains the JSON-serialized result of the orchestrator function execution.

> [!NOTE]
> The HTTP POST endpoint which started the orchestrator function is implemented in the sample app as an HTTP trigger function named "HttpStart". You may find that you want to implement similar starter logic for other trigger types, like `queueTrigger`, `eventHubTrigger`, or `timerTrigger`.

Also, be sure to take a look at the function execution logs. You should notice that **E1_HelloSequence** started and completed multiple times due to the replay behavior described in the [overview](~/articles/overview.md). On the other hand, you should see exactly three executions of **E1_SayHello** since those function executions do not get replayed.

## Wrapping up
At this point, you should have a basic understanding of the core mechanics for Durable Functions. This sample was quite trivial and only showed a small number of features available. Subsequent samples, however, are more "real world" and will display a greater breadth of functionality.

## Full Sample Code
Here is the full orchestration as a single C# file using the Visual Studio project syntax:

[!code-csharp[Main](~/../samples/precompiled/HelloSequence.cs)]
