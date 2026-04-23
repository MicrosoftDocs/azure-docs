---
title: "Durable Functions Overview: Stateful Serverless Workflows"
description: "Learn how Durable Functions extends Azure Functions to build reliable, stateful workflows in a serverless environment. Get started with supported languages, storage providers, and quickstarts."
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: azfuncdf
ms.date: 04/22/2026
ms.topic: get-started
ms.service: azure-functions
ms.subservice: durable
---

# Durable Functions overview

Durable Functions is an extension of [Azure Functions](../functions-overview.md) that lets you build stateful workflows in a serverless environment by writing orchestrator, activity, and entity functions in code. The Durable Functions runtime manages state, checkpoints, retries, and recovery so your workflows can run reliably for long periods.

> [!TIP]
> Not sure whether to use Durable Functions or the standalone Durable Task SDKs? See [Choose your hosting model](../../durable-task/common/choose-orchestration-framework.md).

## Supported languages

The following table summarizes languages with Durable Functions support and links to language-specific quickstarts.

| Language | Durable Functions support | Quickstart |
| -------- | ------------------------- | ---------- |
| **.NET (C#)** | Supported | [Create your first durable function (C#)](durable-functions-isolated-create-first-csharp.md) |
| **JavaScript** | Supported | [Create your first durable function (JavaScript)](quickstart-js-vscode.md) |
| **TypeScript** | Supported | [Create your first durable function (TypeScript)](quickstart-ts-vscode.md) |
| **Python** | Supported | [Create your first durable function (Python)](quickstart-python-vscode.md) |
| **PowerShell** | Supported | [Create your first durable function (PowerShell)](quickstart-powershell-vscode.md) |
| **Java** | Supported | [Create your first durable function (Java)](quickstart-java.md) |

For language-specific requirements and package details, see [Durable Functions bindings](durable-functions-bindings.md).

## How to get started

1. Create a new Azure Functions app by using one of the language quickstarts in [Supported languages](#supported-languages).
1. Add an orchestrator function and one or more activity functions.
1. Choose and configure your backend in [Durable Functions storage providers](../../durable-task/common/durable-task-storage-providers.md). The recommended option is [Durable Task Scheduler](../../durable-task/scheduler/durable-task-scheduler.md).
1. Run and test locally with Azure Functions Core Tools.
1. Deploy to Azure and monitor orchestration instances.

After your first workflow is running, explore [Task hubs](../../durable-task/common/durable-task-hubs.md), [HTTP features](durable-functions-http-features.md), and [orchestrator code constraints](../../durable-task/common/durable-task-code-constraints.md).

## Next steps

> [!div class="nextstepaction"]
> [Create your first durable function (C#)](durable-functions-isolated-create-first-csharp.md)

- [Durable Task Scheduler overview](../../durable-task/scheduler/durable-task-scheduler.md)
- [Durable Functions storage providers](../../durable-task/common/durable-task-storage-providers.md)
- [What is Durable Task?](../../durable-task/common/what-is-durable-task.md)
- [Choose your hosting model](../../durable-task/common/choose-orchestration-framework.md)