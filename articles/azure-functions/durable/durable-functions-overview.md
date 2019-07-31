---
title: Durable Functions Overview - Azure
description: Introduction to the Durable Functions extension for Azure Functions.
services: functions
author: ggailey777
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: overview
ms.date: 12/22/2018
ms.author: glenga
ms.reviewer: azfuncdf
#Customer intent: As a < type of user >, I want < what? > so that < why? >.
---

# What are Durable Functions?

*Durable Functions* are an extension of [Azure Functions](../functions-overview.md) that lets you write stateful functions in a serverless environment. The extension manages state, checkpoints, and restarts for you.

## Benefits

The extension lets you define stateful workflows using an [*orchestrator function*](durable-functions-types-features-overview.md#orchestrator-functions), which can provide the following benefits:

* You can define your workflows in code. No JSON schemas or designers are needed.
* Other functions can be called both synchronously and asynchronously. Output from called functions can be saved to local variables.
* Progress is automatically checkpointed when the function awaits. Local state is never lost when the process recycles or the VM reboots.

## Application patterns

The primary use case for Durable Functions is simplifying complex, stateful coordination requirements in serverless applications. The following are some typical application patterns that can benefit from Durable Functions:

* [Chaining](durable-functions-concepts.md#chaining)
* [Fan-out/fan-in](durable-functions-concepts.md#fan-in-out)
* [Async HTTP APIs](durable-functions-concepts.md#async-http)
* [Monitoring](durable-functions-concepts.md#monitoring)
* [Human interaction](durable-functions-concepts.md#human)

## <a name="language-support"></a>Supported languages

Durable Functions currently supports the following languages:

* **C#**: both [precompiled class libraries](../functions-dotnet-class-library.md) and [C# script](../functions-reference-csharp.md).
* **F#**: precompiled class libraries and F# script. F# script is only supported for version 1.x of the Azure Functions runtime.
* **JavaScript**: supported only for version 2.x of the Azure Functions runtime. Requires version 1.7.0 of the Durable Functions extension, or a later version. 

Durable Functions has a goal of supporting all [Azure Functions languages](../supported-languages.md). See the [Durable Functions issues list](https://github.com/Azure/azure-functions-durable-extension/issues) for the latest status of work to support additional languages.

Like Azure Functions, there are templates to help you develop Durable Functions using [Visual Studio 2019](durable-functions-create-first-csharp.md), [Visual Studio Code](quickstart-js-vscode.md), and the [Azure portal](durable-functions-create-portal.md).

## Billing

Durable Functions are billed the same as Azure Functions. For more information, see [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/).

## Jump right in

You can get started with Durable Functions in under 10 minutes by completing one of these language-specific quickstart tutorials:

* [C# using Visual Studio 2019](durable-functions-create-first-csharp.md)
* [JavaScript using Visual Studio Code](quickstart-js-vscode.md)

In both quickstarts, you locally create and test a "hello world" durable function. You then publish the function code to Azure. The function you create orchestrates and chains together calls to other functions.

## Learn more

The following video highlights the benefits of Durable Functions:

> [!VIDEO https://channel9.msdn.com/Shows/Azure-Friday/Durable-Functions-in-Azure-Functions/player] 

Because Durable Functions is an advanced extension for [Azure Functions](../functions-overview.md), it isn't appropriate for all applications. To learn more about Durable Functions, see [Durable Functions patterns and technical concepts](durable-functions-concepts.md). For a comparison with other Azure orchestration technologies, see [Compare Azure Functions and Azure Logic Apps](../functions-compare-logic-apps-ms-flow-webjobs.md#compare-azure-functions-and-azure-logic-apps).

## Next steps

> [!div class="nextstepaction"]
> [Durable Functions patterns and technical concepts](durable-functions-concepts.md)
