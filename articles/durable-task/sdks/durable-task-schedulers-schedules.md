---
author: hhunter-ms
title: Automate recurring orchestrations with schedules
description: Learn how to create, manage, and monitor recurring orchestrations using the schedules feature in the Durable Task Scheduler
ms.topic: concept-article
ms.service: durable-task
ms.subservice: durable-task-sdks
ms.date: 03/03/2026
ms.author: torosent
---

# Automate recurring orchestrations with schedules

Schedules trigger orchestrations automatically at regular intervals without requiring you to write your own polling or timer logic. Instead of building [eternal orchestrations](../common/durable-task-eternal-orchestrations.md) or external cron jobs, you simply define a schedule. The Durable Task Scheduler handles the rest, executing your orchestration at the specified frequency with built-in pause, resume, and update support.

> [!NOTE]
> Schedules are currently supported only in the **Durable Task SDK for .NET**. 

## When to use schedules

Use schedules when you need to run an orchestration repeatedly on a fixed interval. Common scenarios include:

- **Cache clearing**: Periodically invalidate or refresh cached data.
- **Data synchronization**: Pull data from external systems at regular intervals.
- **Report generation**: Produce daily, hourly, or weekly reports.
- **Health checks**: Run diagnostic orchestrations on a recurring basis.
- **Resource cleanup**: Purge stale resources or expired data on a regular cadence.

### Schedules vs. eternal orchestrations

Both schedules and [eternal orchestrations](../common/durable-task-eternal-orchestrations.md) support recurring work, but they differ in important ways.

| Aspect | Schedules | Eternal orchestrations |
| ------ | --------- | -------------------- |
| **Interval control** | Configured declaratively. The scheduler handles timing. | You write explicit timer and `ContinueAsNew` logic. |
| **Pause and resume** | Built-in API support | Requires custom implementation through external events |
| **Update at runtime** | Update the interval, input, or target orchestration without redeploying | Requires code changes and redeployment |
| **Management** | Create, list, describe, update, and delete through `ScheduledTaskClient` | Manage through `DurableTaskClient` instance management APIs |
| **Orchestration history** | Each trigger creates a separate orchestration instance | Single long-running instance with `ContinueAsNew` |

Choose schedules when you want declarative, manageable recurring execution. Choose eternal orchestrations when your recurrence logic is dynamic or depends on the output of previous iterations.

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) or later
- [Docker](https://www.docker.com/products/docker-desktop/) for running the [Durable Task Scheduler emulator](../scheduler/durable-task-scheduler.md#emulator-for-local-development)
- The `Microsoft.DurableTask.Worker.AzureManaged` and `Microsoft.DurableTask.Client.AzureManaged` NuGet packages

## Enable scheduled tasks

To use schedules, call `UseScheduledTasks()` on both the worker and client builders during host setup. This method registers the internal schedule entity and the `ScheduledTaskClient` service in your dependency injection container.

```csharp
using Microsoft.DurableTask.Client.AzureManaged;
using Microsoft.DurableTask.ScheduledTasks;
using Microsoft.DurableTask.Worker.AzureManaged;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

HostApplicationBuilder builder = Host.CreateApplicationBuilder(args);

string connectionString = builder.Configuration
    .GetValue<string>("DURABLE_TASK_SCHEDULER_CONNECTION_STRING")
    ?? throw new InvalidOperationException(
        "Missing required configuration 'DURABLE_TASK_SCHEDULER_CONNECTION_STRING'");

// Configure the worker
builder.Services.AddDurableTaskWorker(b =>
{
    b.AddTasks(r => r.AddAllGeneratedTasks());
    b.UseDurableTaskScheduler(connectionString);
    b.UseScheduledTasks();
});

// Configure the client
builder.Services.AddDurableTaskClient(b =>
{
    b.UseDurableTaskScheduler(connectionString);
    b.UseScheduledTasks();
});

IHost host = builder.Build();
await host.StartAsync();
```

After setup, inject `ScheduledTaskClient` to create and manage schedules.

## Create a schedule

Define the schedule's ID, target orchestration, and recurrence interval with `ScheduleCreationOptions`. Then call `CreateScheduleAsync` to register it.

```csharp
using Microsoft.DurableTask.ScheduledTasks;

ScheduleCreationOptions options = new(
    scheduleId: "stock-price-check",
    orchestrationName: nameof(StockPriceOrchestrator),
    interval: TimeSpan.FromSeconds(30))
{
    OrchestrationInput = "MSFT",
    StartAt = DateTimeOffset.UtcNow,
    StartImmediatelyIfLate = true
};

ScheduleClient scheduleClient = await scheduledTaskClient.CreateScheduleAsync(options);
```

The following table describes `ScheduleCreationOptions` properties.

| Property | Type | Required | Description |
| -------- | ---- | -------- | ----------- |
| `ScheduleId` | `string` | Yes | Unique identifier for the schedule. |
| `OrchestrationName` | `string` | Yes | Name of the orchestrator to trigger on each interval. |
| `Interval` | `TimeSpan` | Yes | Time between each orchestration execution. |
| `OrchestrationInput` | `object?` | No | Input data passed to the orchestration on each run. |
| `StartAt` | `DateTimeOffset?` | No | When the schedule becomes active. Defaults to immediately. |
| `EndAt` | `DateTimeOffset?` | No | When the schedule stops triggering. No default (runs indefinitely). |
| `StartImmediatelyIfLate` | `bool` | No | If `true`, runs the orchestration immediately when the schedule misses its trigger time. |

## Manage a schedule

After you create a schedule, use the `ScheduleClient` handle to pause, resume, update, describe, or delete it.

### Get schedule details

Get the current state and configuration of a schedule.

```csharp
ScheduleDescription description = await scheduleClient.DescribeAsync();

Console.WriteLine($"Schedule ID: {description.ScheduleId}");
Console.WriteLine($"Status: {description.Status}");
Console.WriteLine($"Interval: {description.Interval}");
```

### Pause and resume

Temporarily stop a schedule from triggering new orchestrations, and then resume it later.

```csharp
// Pause the schedule
await scheduleClient.PauseAsync();

// Resume the schedule
await scheduleClient.ResumeAsync();
```

Pausing a schedule doesn't affect orchestration instances that already run.

### Update a schedule

Change the interval, target orchestration, input, or time window of an existing schedule without deleting and recreating it.

```csharp
ScheduleUpdateOptions updateOptions = new()
{
    Interval = TimeSpan.FromMinutes(5),
    OrchestrationInput = "AAPL",
    EndAt = DateTimeOffset.UtcNow.AddDays(7)
};

await scheduleClient.UpdateAsync(updateOptions);
```

### Delete a schedule

Permanently remove a schedule. This action doesn't affect orchestration instances that are already triggered.

```csharp
await scheduleClient.DeleteAsync();
```

## List schedules

Use `ListSchedulesAsync` to list all schedules registered on the task hub.

```csharp
AsyncPageable<ScheduleDescription> schedules = scheduledTaskClient.ListSchedulesAsync();

await foreach (ScheduleDescription schedule in schedules)
{
    Console.WriteLine($"{schedule.ScheduleId}: {schedule.Status}");
}
```

Pass a `ScheduleQuery` to control the page size.

```csharp
ScheduleQuery query = new() { PageSize = 50 };
AsyncPageable<ScheduleDescription> schedules = scheduledTaskClient.ListSchedulesAsync(query);
```

## Get a schedule by ID

Retrieve a specific schedule by its ID without the original `ScheduleClient` handle.

```csharp
ScheduleDescription? schedule = await scheduledTaskClient.GetScheduleAsync("stock-price-check");
```

You can also get a `ScheduleClient` handle for an existing schedule:

```csharp
ScheduleClient existingClient = scheduledTaskClient.GetScheduleClient("stock-price-check");
ScheduleDescription description = await existingClient.DescribeAsync();
```

## Monitor schedules

Monitor scheduled orchestrations using the [Durable Task Scheduler dashboard](../scheduler/durable-task-scheduler-dashboard.md). The dashboard shows each orchestration instance that a schedule triggers, including status, duration, input, and output.

## Samples

Explore complete working examples that demonstrate schedule operations.

- [Schedule console app](https://github.com/microsoft/durabletask-dotnet/tree/main/samples/ScheduleConsoleApp): Demonstrates how to create, pause, resume, delete, and list schedules in a console application.

## Next steps

> [!div class="nextstepaction"]
> [Get started with the Durable Task SDKs](./quickstart-portable-durable-task-sdks.md)