---
title: "Durable Functions in-process to isolated worker API mapping (.NET)"
description: Complete API reference mapping between the in-process 2.x SDK and the isolated worker SDK for Durable Functions, including client, orchestration, entity, and behavioral changes.
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: azfuncdf
ms.date: 04/27/2026
ms.topic: reference
ms.service: azure-functions
ms.subservice: durable
# CustomerIntent: As a .NET developer migrating Durable Functions from in-process to isolated worker, I want a comprehensive API mapping reference so that I can quickly find the isolated worker equivalent of any in-process API.
---

# Durable Functions: in-process to isolated worker API mapping

This reference provides a comprehensive mapping between the in-process (2.x) SDK and the isolated worker SDK for Durable Functions. Use this page alongside the [migration guide](./durable-functions-migrate.md) when updating your code.

## Client APIs

| In-process (2.x) | Isolated worker |
| ---- | ---- |
| `IDurableOrchestrationClient` | `DurableTaskClient` |
| `IDurableOrchestrationClient.StartNewAsync` | `DurableTaskClient.ScheduleNewOrchestrationInstanceAsync` |
| `IDurableOrchestrationClient.GetStatusAsync` | `DurableTaskClient.GetInstanceAsync` |
| `IDurableOrchestrationClient.ListInstancesAsync` | `DurableTaskClient.GetAllInstancesAsync` |
| `IDurableOrchestrationClient.TerminateAsync` | `DurableTaskClient.TerminateInstanceAsync` |
| `IDurableOrchestrationClient.SuspendAsync` | `DurableTaskClient.SuspendInstanceAsync` |
| `IDurableOrchestrationClient.ResumeAsync` | `DurableTaskClient.ResumeInstanceAsync` |
| `IDurableOrchestrationClient.RaiseEventAsync` | `DurableTaskClient.RaiseEventAsync` |
| `IDurableOrchestrationClient.RewindAsync` | `DurableTaskClient.RewindInstanceAsync` |
| `IDurableOrchestrationClient.RestartAsync` | `DurableTaskClient.RestartAsync` |
| `IDurableOrchestrationClient.PurgeInstanceHistoryAsync` | `DurableTaskClient.PurgeInstanceAsync` or `PurgeAllInstancesAsync` |
| `IDurableOrchestrationClient.CreateCheckStatusResponse` | `DurableTaskClient.CreateCheckStatusResponseAsync` (extension method, takes `HttpRequestData`) |
| `IDurableOrchestrationClient.WaitForCompletionOrCreateCheckStatusResponseAsync` | `DurableTaskClient.WaitForCompletionOrCreateCheckStatusResponseAsync` (extension method, `timeout` replaced by `CancellationToken`) |
| `IDurableOrchestrationClient.CreateHttpManagementPayload` | `DurableTaskClient.CreateHttpManagementPayload` (extension method) |
| `DurableOrchestrationStatus` | `OrchestrationMetadata` |
| `DurableOrchestrationStatus.History` | Removed from status object. Use `DurableTaskClient.GetOrchestrationHistoryAsync` instead. |
| `PurgeHistoryResult` | `PurgeResult` |
| `OrchestrationStatusQueryCondition` | `OrchestrationQuery` |
| `OrchestrationStatusQueryResult` | `AsyncPageable<OrchestrationMetadata>` |

### Removed client APIs

The following in-process APIs don't have equivalents in the isolated worker SDK:

| Removed API | Workaround |
| ---- | ---- |
| `IDurableOrchestrationClient.MakeCurrentAppPrimaryAsync` | No equivalent |
| `IDurableOrchestrationClient.GetStatusAsync(IEnumerable<string>)` | Use `GetInstanceAsync` in a loop or `GetAllInstancesAsync` with a query filter |
| `IDurableOrchestrationClient.PurgeInstanceHistoryAsync(IEnumerable<string>)` | Use `PurgeInstanceAsync` in a loop or `PurgeAllInstancesAsync` with a filter |
| Cross-task-hub overloads (`RaiseEventAsync`, `SignalEntityAsync`, `ReadEntityStateAsync` with `taskHubName`/`connectionName`) | Only same-task-hub operations are supported |

### Entity client APIs

| In-process (2.x) | Isolated worker |
| ---- | ---- |
| `IDurableEntityClient.SignalEntityAsync` | `DurableTaskClient.Entities.SignalEntityAsync` |
| `IDurableEntityClient.ReadEntityStateAsync` | `DurableTaskClient.Entities.GetEntityAsync` |
| `IDurableEntityClient.ListEntitiesAsync` | `DurableTaskClient.Entities.GetAllEntitiesAsync` |
| `IDurableEntityClient.CleanEntityStorageAsync` | `DurableTaskClient.Entities.CleanEntityStorageAsync` (takes `CleanEntityStorageRequest` object instead of bool parameters) |

## Orchestration context APIs

| In-process (2.x) | Isolated worker |
| ---- | ---- |
| `IDurableOrchestrationContext` | `TaskOrchestrationContext` |
| `IDurableOrchestrationContext.InstanceId` | `TaskOrchestrationContext.InstanceId` |
| `IDurableOrchestrationContext.Name` | `TaskOrchestrationContext.Name` |
| `IDurableOrchestrationContext.CurrentUtcDateTime` | `TaskOrchestrationContext.CurrentUtcDateTime` |
| `IDurableOrchestrationContext.IsReplaying` | `TaskOrchestrationContext.IsReplaying` |
| `IDurableOrchestrationContext.NewGuid` | `TaskOrchestrationContext.NewGuid` |
| `IDurableOrchestrationContext.GetInput<T>()` | `TaskOrchestrationContext.GetInput<T>()` or inject input as a parameter: `MyOrchestration([OrchestrationTrigger] TaskOrchestrationContext context, T input)` |
| `IDurableOrchestrationContext.SetOutput` | Removed. Use the return value from the orchestrator function. |
| `IDurableOrchestrationContext.CallActivityAsync` | `TaskOrchestrationContext.CallActivityAsync` |
| `IDurableOrchestrationContext.CallActivityWithRetryAsync` | `TaskOrchestrationContext.CallActivityAsync` with a `TaskOptions` parameter for retry details |
| `IDurableOrchestrationContext.CallSubOrchestratorAsync` | `TaskOrchestrationContext.CallSubOrchestratorAsync` |
| `IDurableOrchestrationContext.CallSubOrchestratorWithRetryAsync` | `TaskOrchestrationContext.CallSubOrchestratorAsync` with a `TaskOptions` parameter for retry details |
| `IDurableOrchestrationContext.ContinueAsNew` | `TaskOrchestrationContext.ContinueAsNew` (see [behavioral changes](#behavioral-changes) for default differences) |
| `IDurableOrchestrationContext.CallHttpAsync` | `TaskOrchestrationContext.CallHttpAsync` |
| `IDurableOrchestrationContext.CreateTimer<T>(DateTime, T, CancellationToken)` | `TaskOrchestrationContext.CreateTimer(DateTime, CancellationToken)`. State parameter removed. |
| `IDurableOrchestrationContext.WaitForExternalEvent(string)` (non-generic) | Removed. Use `WaitForExternalEvent<T>(string, CancellationToken)`. |
| `IDurableOrchestrationContext.WaitForExternalEvent<T>(string, TimeSpan, T)` (with `defaultValue`) | Removed. Use `WaitForExternalEvent<T>(string, TimeSpan, CancellationToken)`, which throws `TaskCanceledException` on timeout. |
| `IDurableOrchestrationContext.ParentInstanceId` | `TaskOrchestrationContext.Parent.InstanceId` |
| `IDurableOrchestrationContext.CreateReplaySafeLogger(ILogger)` | `TaskOrchestrationContext.CreateReplaySafeLogger<T>()` or `TaskOrchestrationContext.CreateReplaySafeLogger(string)` |
| `IDurableOrchestrationContext.CreateEntityProxy<T>` | Removed. Use `Entities.CallEntityAsync` or `Entities.SignalEntityAsync` directly. |
| `IDurableOrchestrationContext.CallEntityAsync` | `TaskOrchestrationContext.Entities.CallEntityAsync` |
| `IDurableOrchestrationContext.SignalEntity` | `TaskOrchestrationContext.Entities.SignalEntityAsync` |
| `IDurableOrchestrationContext.LockAsync` | `TaskOrchestrationContext.Entities.LockEntitiesAsync` |
| `IDurableOrchestrationContext.IsLocked` | `TaskOrchestrationContext.Entities.InCriticalSection()` |
| `RetryOptions` | `TaskOptions` with `TaskRetryOptions` |
| `DurableActivityContext` | No equivalent |
| `DurableActivityContext.GetInput<T>()` | Inject input as a parameter: `MyActivity([ActivityTrigger] T input)` |
| `DurableHttpRequest` (WebJobs namespace) | `DurableHttpRequest` (`Microsoft.Azure.Functions.Worker.Extensions.DurableTask.Http` namespace) |
| `DurableHttpResponse` (WebJobs namespace) | `DurableHttpResponse` (`Microsoft.Azure.Functions.Worker.Extensions.DurableTask.Http` namespace) |

## Entity APIs

| In-process (2.x) | Isolated worker |
| ---- | ---- |
| `IDurableEntityContext` | `TaskEntityContext` |
| `IDurableEntityContext.EntityName` | `TaskEntityContext.Id.Name` |
| `IDurableEntityContext.EntityKey` | `TaskEntityContext.Id.Key` |
| `IDurableEntityContext.OperationName` | `TaskEntityOperation.Name` |
| `IDurableEntityContext.FunctionBindingContext` | Removed. Add `FunctionContext` as an input parameter. |
| `IDurableEntityContext.HasState` | `TaskEntityOperation.State.HasState` |
| `IDurableEntityContext.GetState` | `TaskEntityOperation.State.GetState` |
| `IDurableEntityContext.SetState` | `TaskEntityOperation.State.SetState` |
| `IDurableEntityContext.DeleteState` | `TaskEntityOperation.State.SetState(null)` |
| `IDurableEntityContext.GetInput` | `TaskEntityOperation.GetInput` |
| `IDurableEntityContext.Return` | Removed. Use the method return value instead. |
| `IDurableEntityContext.SignalEntity` | `TaskEntityContext.SignalEntity`. Scheduled signals use `SignalEntityOptions.SignalTime` instead of a `DateTime` parameter overload. |
| `IDurableEntityContext.StartNewOrchestration` | `TaskEntityContext.ScheduleNewOrchestration`. Instance ID is set via `StartOrchestrationOptions.InstanceId` instead of a string parameter. |
| `IDurableEntityContext.DispatchAsync` | `TaskEntityDispatcher.DispatchAsync`. Constructor params removed; use standard DI instead. |
| `IDurableEntityContext.BatchSize` | Removed |
| `IDurableEntityContext.BatchPosition` | Removed |

## Behavioral changes

Review these breaking behavior changes before testing your migrated app.

### Serialization default changed

The default serializer changed from `Newtonsoft.Json` to `System.Text.Json`. For configuration options, see [Serialization and persistence in Durable Functions](./durable-functions-serialization-and-persistence.md).

> [!WARNING]
> **ContinueAsNew default change**: The `preserveUnprocessedEvents` parameter default changed from `false` (2.x) to `true` (isolated). If your orchestration uses `ContinueAsNew` and relies on unprocessed events being discarded, explicitly pass `preserveUnprocessedEvents: false`.

> [!NOTE]
> **RestartAsync default change**: The `restartWithNewInstanceId` parameter default changed from `true` (2.x) to `false` (isolated). If your code calls `RestartAsync` and depends on a new instance ID being generated, explicitly pass `restartWithNewInstanceId: true`.

### Other behavioral changes

- **Entity proxy removal**: `CreateEntityProxy<T>` and the typed `SignalEntityAsync<TEntityInterface>(Action<T>)` delegate overloads aren't available in the isolated worker. Call `Entities.CallEntityAsync` or `Entities.SignalEntityAsync` directly with string-based operation names instead of using typed proxy interfaces.
- **WaitForCompletionOrCreateCheckStatusResponseAsync**: The `timeout` parameter was removed. Use a `CancellationToken` with a cancellation timeout instead.
- **Cross-task-hub operations removed**: The in-process overloads that accepted `taskHubName` and `connectionName` parameters aren't available in isolated worker. Only same-task-hub operations are supported.
- **Batch operations by ID removed**: The in-process `GetStatusAsync(IEnumerable<string>)` and `PurgeInstanceHistoryAsync(IEnumerable<string>)` overloads aren't available. Use `GetAllInstancesAsync` with an `OrchestrationQuery` filter or call `GetInstanceAsync`/`PurgeInstanceAsync` individually.
- **Orchestration history moved**: `DurableOrchestrationStatus.History` (the embedded `JArray`) is no longer part of the status object. Use the separate `DurableTaskClient.GetOrchestrationHistoryAsync` API.
- **Entity DispatchAsync constructor params removed**: Entity classes are activated through standard dependency injection. Register your entity's dependencies in `Program.cs`.
- **Entity query filter changes**: `EntityQuery.EntityName` is replaced by `EntityQuery.InstanceIdStartsWith`, and `EntityQuery.IncludeDeleted` is replaced by `EntityQuery.IncludeTransient`.
- **CleanEntityStorageAsync signature change**: Takes a `CleanEntityStorageRequest` object with `RemoveEmptyEntities` and `ReleaseOrphanedLocks` properties instead of bool parameters.
- **New APIs in isolated worker**: `DurableTaskClient.GetOrchestrationHistoryAsync` and the `TaskOrchestrationContext.GetFunctionContext()` extension method have no in-process equivalent.

## Related content

- [Migration guide: Durable Functions from in-process to isolated worker](./durable-functions-migrate.md)
- [Serialization and persistence in Durable Functions](./durable-functions-serialization-and-persistence.md)
- [In-process SDK API reference (`Microsoft.Azure.WebJobs.Extensions.DurableTask`)](/dotnet/api/microsoft.azure.webjobs.extensions.durabletask?view=azure-dotnet&preserve-view=true)
- [Isolated worker SDK API reference (`Microsoft.DurableTask`)](/dotnet/api/microsoft.durabletask?view=durabletask-dotnet-1.x&preserve-view=true)
