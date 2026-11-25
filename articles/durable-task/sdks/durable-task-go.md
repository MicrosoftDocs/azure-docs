---
title: "Develop with the Durable Task SDK for Go"
description: Build self-hosted Go workflows with Durable Task Scheduler. Learn SDK setup, deterministic orchestration APIs, connection options, and beta limitations.
author: torosent
ms.author: torosent
ms.topic: how-to
ms.service: durable-task
ms.subservice: durable-task-sdks
ms.date: 10/12/2026
ai-usage: ai-assisted
---

# Develop with the Durable Task SDK for Go

By using the [Durable Task SDK for Go](https://github.com/microsoft/durabletask-go), you can define orchestrations, activities, and durable entities as Go functions. Host the application on your own compute platform. The [Durable Task Scheduler](../scheduler/durable-task-scheduler.md) stores execution history and dispatches work to your Go workers.

> [!IMPORTANT]
> The Go SDK is in **beta**. This article and the [Go quickstart](quickstart-portable-durable-task-sdks.md?pivots=go) use **v1.0.0-beta3**. The beta isn't a drop-in replacement for v0.6.0: it doesn't support embedded SQLite and PostgreSQL backends or the standalone gRPC host. Go isn't a Durable Functions language.

## Prerequisites and installation

- Go 1.25 or later.
- Docker or a compatible container runtime for the [Durable Task Scheduler emulator](../scheduler/develop-with-durable-task-scheduler.md#durable-task-scheduler-emulator).
- For Azure, an existing scheduler and task hub, and an identity with the **Durable Task Data Contributor** role. See [Identity-based access](../scheduler/durable-task-scheduler-identity.md).

Install the released beta from an existing Go module:

```bash
go get github.com/microsoft/durabletask-go@v1.0.0-beta3
```

After adding SDK imports to your code, run `go mod tidy` to record transitive dependencies and checksums.

For a complete application that starts a worker, schedules parallel activities, reads their results, and shuts down, see [Create an app with Durable Task SDKs - Go](quickstart-portable-durable-task-sdks.md?pivots=go).

## Programming model

The SDK ships as one Go module. Its main packages are:

| Package | Purpose |
| --- | --- |
| `task` | Orchestration, activity, and entity contexts; task registration; durable workflow primitives. |
| `durabletaskscheduler` | Connection options, and separate client and worker connections to Durable Task Scheduler. |
| `client` | Worker configuration, including concurrency, versioning, and work item filters. |
| `api` | Instance and entity IDs, orchestration metadata, and management request options. |

An orchestrator has the signature `func(*task.OrchestrationContext) (any, error)`. An activity has the signature `func(task.ActivityContext) (any, error)`. A function-based entity has the signature `func(*task.EntityContext) (any, error)`. Read typed input with `GetInput`, and return a serializable result or an error. JSON is the default data format.

### Register and execute tasks

Create a registry with `task.NewTaskRegistry`. Register stable names with `AddOrchestratorN`, `AddActivityN`, and `AddEntityN`, and check registration errors. The names used in activity calls and client scheduling must match the registrations.

Parse the connection string with `durabletaskscheduler.NewOptionsFromConnectionString`. Pass the options to:

- `durabletaskscheduler.NewClient` to start and manage orchestration instances.
- `durabletaskscheduler.NewWorker` to execute registered tasks.

Call `Start` on the worker to begin processing work items. Use `client.WithAutoWorkItemFilters()` to derive worker routing filters from the registry. Don't let a worker consume tasks registered only by another application.

The client and worker own separate connections. Close the client when finished. Drain the worker with `Shutdown`, using a fresh, bounded context if the application's run context expired. The quickstart checks errors from both operations.

### Write deterministic orchestrators

Use the orchestration context for durable operations:

| Operation | Go API | Learn more |
| --- | --- | --- |
| Sequence activities | `ctx.CallActivity(...).Await(&result)` | [Function chaining](../common/durable-task-sequence.md?pivots=durable-task-sdks&tabs=go) |
| Fan out and fan in | Schedule all tasks, then `ctx.WhenAll(tasks...)` and read results with `Await` | [Fan-out/fan-in](../common/durable-task-fan-in-fan-out.md?pivots=durable-task-sdks&tabs=go) |
| Delay | `ctx.CreateTimer(duration).Await(nil)` | [Durable timers](../common/durable-task-timers.md?pivots=durable-task-sdks&tabs=go) |
| Wait for an event | `ctx.WaitForSingleEvent(name, timeout).Await(&result)` | [External events](../common/durable-task-external-events.md?pivots=durable-task-sdks&tabs=go) |
| Call a child workflow | `ctx.CallSubOrchestrator(...).Await(&result)` | [Sub-orchestrations](../common/durable-task-sub-orchestrations.md?pivots=durable-task-sdks&tabs=go) |
| Retry an activity | `task.WithActivityRetryPolicy` | [Error handling and retries](../common/durable-task-error-handling.md?pivots=durable-task-sdks&tabs=go) |
| Start a fresh history | `ctx.ContinueAsNew` | [Eternal orchestrations](../common/durable-task-eternal-orchestrations.md?pivots=durable-task-sdks&tabs=go) |
| Report progress | `ctx.SetCustomStatusValue` | [Custom status](../common/durable-task-custom-orchestration-status.md?pivots=durable-task-sdks) |
| Call or signal an entity | `ctx.CallEntity` and `ctx.SignalEntity` | [Durable entities](../common/durable-task-entities.md?pivots=durable-task-sdks&tabs=go) |

Don't perform network calls, file I/O, environment-variable reads, or other nondeterministic work in an orchestrator. Put that work in activities. Use the SDK's durable concurrency primitives instead of native goroutines, channels, `sync.WaitGroup`, or `time.Sleep` in orchestrator code. Use `ctx.Logger()` for replay-aware logging. For details, see [Orchestrator code constraints](../common/durable-task-code-constraints.md?pivots=durable-task-sdks#go-orchestrators).

Activities can perform ordinary Go I/O, but they can execute more than once. Make external side effects idempotent.

### Read completion results

`WaitForOrchestrationCompletion` returning without an error means the instance reached a terminal state, not necessarily that the workflow succeeded. Request payloads with `api.WithFetchPayloads(true)`, check that `RuntimeStatus` is `api.RUNTIME_STATUS_COMPLETED`, and then decode output with `ReadOutput`.

For failed instances, inspect `FailureDetails`. Don't report a failed or terminated orchestration as a successful result. See [Instance management](../common/durable-task-instance-management.md?pivots=durable-task-sdks#go-instance-management).

## Connect to the emulator or Azure

The quickstart uses the connection string `Endpoint=http://localhost:8080;TaskHub=default;Authentication=None`. Use `Authentication=None` for local emulator development, not for authenticated Azure access.

For Azure, use your scheduler's HTTPS endpoint and task hub name. Select `Authentication=DefaultAzure` for the Azure Identity credential chain, or `Authentication=AzureCLI` for a development identity signed in through Azure CLI. The Go SDK also supports managed identity and workload identity. For configuration details and supported authentication modes, see the [Go SDK connection guide](https://github.com/microsoft/durabletask-go/blob/main/durabletaskscheduler/README.md#configuration).

The quickstart reads the connection string from the `DTS_CONNECTION_STRING` environment variable and passes it to `NewOptionsFromConnectionString`. The SDK doesn't read this variable automatically.

## Samples

The Go SDK repository includes runnable samples for its feature areas, including activity sequences, fan-out/fan-in, external events, retries, durable entities, schedules, large payloads, history export, and distributed tracing. For the full list, prerequisites, and run instructions, see the [Go SDK samples](https://github.com/microsoft/durabletask-go/tree/main/samples).

## Test orchestrations

The SDK doesn't include a storage backend, so orchestrations run only against Durable Task Scheduler or its emulator. Test activities and other business logic with ordinary Go unit tests. To verify orchestration behavior, including replay, run integration tests against the emulator or a dedicated task hub.

## Beta compatibility considerations

- **Schedules:** Go schedules don't share their persisted state format with other SDKs. Use a Go-only task hub for scheduled tasks.
- **Entity locks:** Go and Python use a different multi-entity lock ordering from .NET. Don't acquire overlapping lock sets concurrently across Go/Python and .NET orchestrations.
- **Rewind:** The Go worker conservatively rejects histories with additional non-lifecycle events after a failed activity or child operation. An accepted rewind request doesn't prove recovery; verify a new execution ID and successful output.
- **Emulator management APIs:** Instance listing and filtered purge have documented emulator limitations. Prefer instance-scoped cleanup for examples, and don't clear a shared hub.
- **History export (preview):** Use an isolated, Go-only task hub and export destination so export jobs can't export or delete unrelated application data.

See the [Go SDK feature matrix and transport guide](https://github.com/microsoft/durabletask-go/blob/main/durabletaskscheduler/README.md) for detailed compatibility and lifecycle behavior.

## Related content

- [Go API reference](https://pkg.go.dev/github.com/microsoft/durabletask-go@v1.0.0-beta3)
- [Go SDK release notes](https://github.com/microsoft/durabletask-go/releases/tag/v1.0.0-beta3)
- [Runnable samples included with the Go SDK](https://github.com/microsoft/durabletask-go/tree/main/samples)
- [Durable Task SDK troubleshooting](durable-task-sdk-troubleshooting.md)
- [Durable Task Scheduler dashboard](../scheduler/durable-task-scheduler-dashboard.md)
