---
title: Durable Task SDKs overview
description: Learn about the portable Durable Task SDKs for .NET, Python, Java, and JavaScript/TypeScript. Build durable orchestrations on any compute platform.
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: azfuncdf
ms.date: 02/27/2026
ms.topic: get-started
ms.service: durable-task
ms.subservice: durable-task-sdks
---

# Durable Task SDKs overview

The Durable Task SDKs are portable, open-source libraries for building durable orchestrations, activities, and entities using ordinary code. They work on any compute platform—Azure Container Apps, Kubernetes, or VMs. Each SDK connects to the [Durable Task Scheduler](../scheduler/durable-task-scheduler.md) as its managed backend.

> [!TIP]
> Not sure whether to use the Durable Task SDKs or Durable Functions? See [Choose your orchestration framework](../common/choose-orchestration-framework.md). For a broader overview of the Durable Task ecosystem, see [What is Durable Task?](../common/what-is-durable-task.md).

## Available SDKs

The following table summarizes the available Durable Task SDKs, their packages, and where to find source code and samples.

| Language | Packages | Status | Source | Samples |
| -------- | -------- | ------ | ------ | ------- |
| **.NET** | `Microsoft.DurableTask.Worker.AzureManaged`<br/>`Microsoft.DurableTask.Client.AzureManaged` | GA | [durabletask-dotnet](https://github.com/microsoft/durabletask-dotnet) | [.NET samples](https://github.com/Azure-Samples/Durable-Task-Scheduler/tree/main/samples/durable-task-sdks/dotnet) |
| **Python** | `durabletask-azuremanaged` | GA | [durabletask-python](https://github.com/microsoft/durabletask-python) | [Python samples](https://github.com/Azure-Samples/Durable-Task-Scheduler/tree/main/samples/durable-task-sdks/python) |
| **Java** | `durabletask-client`<br/>`durabletask-azure-managed` | GA | [durabletask-java](https://github.com/microsoft/durabletask-java) | [Java samples](https://github.com/Azure-Samples/Durable-Task-Scheduler/tree/main/samples/durable-task-sdks/java) |
| **JavaScript / TypeScript** | `@microsoft/durabletask-js`<br/>`@microsoft/durabletask-js-azuremanaged` | Preview | [durabletask-js](https://github.com/microsoft/durabletask-js) | [JS samples](https://github.com/Azure-Samples/Durable-Task-Scheduler/tree/main/samples/durable-task-sdks/javascript) |

## Installation

Each SDK ships two packages: 
- A **worker** package for defining orchestrations and activities
- A **client** package for scheduling and managing orchestration instances. 

Install *both* packages to get started.

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

The Python SDK works with any Python 3.9+ hosting. It supports generator-based orchestrations and async or await.

# [Java](#tab/java)

```xml
<dependency>
    <groupId>com.microsoft</groupId>
    <artifactId>durabletask-client</artifactId>
    <version>1.7.0</version>
</dependency>
<dependency>
    <groupId>com.microsoft</groupId>
    <artifactId>durabletask-azure-managed</artifactId>
    <version>1.7.0</version>
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

---

## Get started

All SDKs follow the same pattern:

1. **Install** the worker and client packages for your language. See [Installation](#installation).
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

| Feature | .NET | Python | Java | JavaScript |
| ------- | :--: | :----: | :--: | :--------: |
| **Orchestrations** | ✅ | ✅ | ✅ | ✅ |
| **Activities** | ✅ | ✅ | ✅ | ✅ |
| **Sub-orchestrations** | ✅ | ✅ | ✅ | ✅ |
| **Durable timers** | ✅ | ✅ | ✅ | ✅ |
| **External events** | ✅ | ✅ | ✅ | ✅ |
| **Durable entities** | ✅ | ✅ | ❌ | ✅ |
| **Retry policies** | ✅ | ✅ | ✅ | ✅ |
| **Continue-as-new** | ✅ | ✅ | ✅ | ✅ |
| **Suspend/Resume** | ✅ | ✅ | ✅ | ✅ |

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Create an app with Durable Task SDKs](quickstart-portable-durable-task-sdks.md)

- [Durable Task Scheduler overview](../scheduler/durable-task-scheduler.md)
- [Choose your orchestration framework](../common/choose-orchestration-framework.md)
- [What is Durable Task?](../common/what-is-durable-task.md)
