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
ms.date: 12/06/2018
ms.author: azfuncdf, glenga
#Customer intent: As a < type of user >, I want < what? > so that < why? >.

---

# What is Durable Functions?

*Durable Functions* is an extension of [Azure Functions](../functions-overview.md) and [Azure WebJobs](../../app-service/web-sites-create-web-jobs.md) that lets you write stateful functions in a serverless environment. The extension manages state, checkpoints, and restarts for you.

The extension lets you define stateful workflows using an [*orchestrator function*](durable-functions-types-features-overview.md#orchestrator-functions), which can provide the following benefits:

* You can define your workflows in code. No JSON schemas or designers are needed.
* Other functions can be called both synchronously and asynchronously. Output from called functions can be saved to local variables.
* Progress is automatically checkpointed when the function awaits. Local state is never lost when the process recycles or the VM reboots.

The primary use case for Durable Functions is simplifying complex, stateful coordination requirements in serverless applications. The following are some typical application patterns that can benefit from Durable Functions:

* [Chaining](durable-functions-concepts.md#chaining)
* [Fan-out/fan-in](durable-functions-concepts.md#fan-in-out)
* [Async HTTP APIs](durable-functions-concepts.md#async-http)
* [Monitoring](durable-functions-concepts.md#monitoring)
* [Human interaction](durable-functions-concepts.md#human)

The following video highlights the benefits of Durable Functions:

> [!VIDEO https://channel9.msdn.com/Shows/Azure-Friday/Durable-Functions-in-Azure-Functions/player] 

Durable Functions currently supports function development in both C# and JavaScript. Like Azure Functions, there are templates to help you develop Durable Functions using [Visual Studio 2017](durable-functions-create-first-csharp.md), [Visual Studio Code](quickstart-js-vscode.md), and the [Azure portal](durable-functions-create-portal.md).

Because Durable Functions is an advanced extension for [Azure Functions](../functions-overview.md), it isn't appropriate for all applications. To learn more about Durable Functions, see [Durable Functions patterns and technical concepts](durable-functions-concepts.md). For a comparison with other Azure orchestration technologies, see [Compare Azure Functions and Azure Logic Apps](../functions-compare-logic-apps-ms-flow-webjobs.md#compare-azure-functions-and-azure-logic-apps).

Durable Functions are billed the same as Azure Functions. For more information, see [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/).

## Next steps

To jump right in using Durable Functions, **Create your first durable function** ([C#](durable-functions-create-first-csharp.md) / [JavaScript](quickstart-js-vscode.md)). 

> [!div class="nextstepaction"]
> [Learn more about Durable Functions](durable-functions-concepts.md)