---
title: "Durable Task SDKs Overview: Portable Orchestration Libraries"
description: "Learn about the portable Durable Task SDKs for .NET, Python, Java, JavaScript/TypeScript, and Go. Build durable orchestrations on any compute platform."
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: azfuncdf
ms.date: 10/12/2026
ai-usage: ai-assisted
ms.topic: get-started
ms.service: durable-task
ms.subservice: durable-task-sdks
---

# Durable Task SDKs overview

The Durable Task SDKs are portable, open-source libraries for building durable orchestrations, activities, and entities using ordinary code. They work on any compute platform—Azure Container Apps, Kubernetes, or VMs. Each SDK connects to the [Durable Task Scheduler](../scheduler/durable-task-scheduler.md) as its managed backend.

Use the Durable Task SDKs when you need to:

- **Orchestrate multi-step workflows** that survive process restarts and infrastructure failures.
- **Fan out work in parallel** and aggregate results reliably.
- **Wait for external events** (human approvals, webhooks, timers) without consuming compute.
- **Run on any compute platform** without being locked to Azure Functions.

> [!TIP]
> Not sure whether to use the Durable Task SDKs or Durable Functions? See [Choose your orchestration framework](../common/choose-orchestration-framework.md). For a broader overview of the Durable Task ecosystem, see [What is Durable Task?](../common/what-is-durable-task.md).

## Available Durable Task SDKs

The following table summarizes the available Durable Task SDKs, their packages, and where to find source code and samples.

| Language | Packages | Status | Source | Samples |
| -------- | -------- | ------ | ------ | ------- |
| **.NET** | `Microsoft.DurableTask.Worker.AzureManaged`<br/>`Microsoft.DurableTask.Client.AzureManaged` | GA | [durabletask-dotnet](https://github.com/microsoft/durabletask-dotnet) | [.NET samples](https://github.com/Azure-Samples/Durable-Task-Scheduler/tree/main/samples/durable-task-sdks/dotnet) |
| **Python** | `durabletask-azuremanaged` | GA | [durabletask-python](https://github.com/microsoft/durabletask-python) | [Python samples](https://github.com/Azure-Samples/Durable-Task-Scheduler/tree/main/samples/durable-task-sdks/python) |
| **Java** | `durabletask-client`<br/>`durabletask-azure-managed` | GA | [durabletask-java](https://github.com/microsoft/durabletask-java) | [Java samples](https://github.com/Azure-Samples/Durable-Task-Scheduler/tree/main/samples/durable-task-sdks/java) |
| **JavaScript / TypeScript** | `@microsoft/durabletask-js`<br/>`@microsoft/durabletask-js-azuremanaged` | Preview | [durabletask-js](https://github.com/microsoft/durabletask-js) | [JS samples](https://github.com/Azure-Samples/Durable-Task-Scheduler/tree/main/samples/durable-task-sdks/javascript) |
| **Go** | `github.com/microsoft/durabletask-go` | Beta | [durabletask-go](https://github.com/microsoft/durabletask-go) | [Go samples](https://github.com/microsoft/durabletask-go/tree/main/samples) |

## Installation

Each SDK provides a **worker** for running orchestrations, activities, and entities, and a **client** for scheduling and managing instances. Depending on the language, these components ship in separate packages or in one package or module. Install the packages shown for your language.

# [C#](#tab/csharp)

```bash
dotnet add package Microsoft.DurableTask.Worker.AzureManaged
dotnet add package Microsoft.DurableTask.Client.AzureManaged
```

The .NET SDK works with any .NET hosting model: ASP.NET Core, console apps, or worker services. It supports type-safe orchestration and activity definitions with source generators, and integrates with dependency injection.

# [Python](#tab/python)

```bash
pip install durabletask-azuremanaged
```

The Python SDK works with any Python 3.9+ hosting. It supports generator-based orchestrations with async activities.

# [Java](#tab/java)

```xml
<dependency>
    <groupId>com.microsoft</groupId>
    <artifactId>durabletask-client</artifactId>
    <version>1.9.0</version>
</dependency>
<dependency>
    <groupId>com.microsoft</groupId>
    <artifactId>durabletask-azure-managed</artifactId>
    <version>1.9.0</version>
</dependency>
```

The Java SDK works with any Java 8+ hosting, including Spring Boot applications.

# [JavaScript](#tab/javascript)

```bash
npm install @microsoft/durabletask-js @microsoft/durabletask-js-azuremanaged
```

The JavaScript or TypeScript SDK requires Node.js 22 or higher. It supports generator-based orchestrations and durable entities.

> [!NOTE]
> The JavaScript or TypeScript SDK is currently in preview. It isn't compatible with the Azure Durable Functions JavaScript SDK ([durable-functions](https://github.com/Azure/azure-functions-durable-js)).

# [Go](#tab/go)

From a Go module, install the SDK:

```bash
go get github.com/microsoft/durabletask-go@v1.0.0-beta3
```

The Go SDK requires Go 1.25 or later. One module contains the `task`, `api`, `client`, and `durabletaskscheduler` packages. It supports function-based orchestrators, activities, and entities in self-hosted Go applications.

> [!NOTE]
> The Go SDK is in beta. It connects to Durable Task Scheduler or the local emulator, not the embedded SQLite or PostgreSQL backends in earlier Go SDK versions. Go isn't a Durable Functions language. See [Develop with the Durable Task SDK for Go](durable-task-go.md) for programming guidance and compatibility considerations.

---

## Get started

All SDKs follow the same pattern:

1. **Install** the SDK packages or module for your language. See [Installation](#installation).
1. **Start the emulator** for local development using Docker:

   ```bash
   docker run --name dtsemulator -d -p 8080:8080 -p 8082:8082 mcr.microsoft.com/dts/dts-emulator:latest
   ```

1. **Define** orchestrations and activities in your application code.
1. **Start a worker** to process orchestration and activity work items.
1. **Use the client** to schedule new orchestration instances and query their status.

For a walkthrough with working code, see [Quickstart: Create an app with Durable Task SDKs](quickstart-portable-durable-task-sdks.md).

## Feature comparison

The following table shows the features each SDK supports.

| Feature | .NET | Python | Java | JavaScript | Go (beta) |
| ------- | :--: | :----: | :--: | :--------: | :-------: |
| **Orchestrations** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Activities** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Sub-orchestrations** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Durable timers** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **External events** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Durable entities** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Retry policies** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Continue-as-new** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Suspend/Resume** | ✅ | ✅ | ✅ | ✅ | ✅ |

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Create an app with Durable Task SDKs](quickstart-portable-durable-task-sdks.md)

- [Durable Task Scheduler overview](../scheduler/durable-task-scheduler.md)
- [Develop with the Durable Task SDK for Go](durable-task-go.md)
- [Choose your orchestration framework](../common/choose-orchestration-framework.md)
- [What is Durable Task?](../common/what-is-durable-task.md)
