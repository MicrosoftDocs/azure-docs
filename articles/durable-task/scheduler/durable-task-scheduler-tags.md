---
author: hhunter-ms
ms.author: hannahhunter
title: Add Tags to Orchestrations and Activities in Durable Task Scheduler
titleSuffix: Durable Task
description: Learn how to use tags to attach custom key-value metadata to orchestrations, activities, and sub-orchestrations in Durable Task Scheduler.
ms.topic: how-to
ms.service: durable-task
ms.subservice: durable-task-scheduler
ms.date: 06/10/2026
---

# Add Tags to Orchestrations and Activities in Durable Task Scheduler

Tags are key-value pairs that you can attach to orchestrations and activities to add custom metadata. Use tags to categorize, correlate, and query your work as it runs.

You can add tags to:

- **Orchestration instances** — when you start a new orchestration from the client.
- **Activities** — when an orchestrator schedules an activity.
- **Sub-orchestrations** — when an orchestrator schedules a child orchestration.

## SDK and extension support

| SDK/Extension | Orchestration tags | Activity/suborchestration tags | Read tags back |
|---|---|---|---|
| **Durable Task .NET SDK** (`durabletask-dotnet`) | ✅ | ✅ | ✅ |
| **Durable Task JavaScript SDK** (`durabletask-js`) | ✅ | ✅ | ✅ |
| **Durable Task Python SDK** (`durabletask-python`) | ✅ | ✅ | ❌ (not surfaced in `OrchestrationState`) |
| **Durable Task Java SDK** (`durabletask-java`) | ✅ (v1.6.0+) | ❌ (`TaskOptions` is retry-only) | ✅ |
| **Durable Functions: .NET isolated** | ✅ | ✅ | ✅ |
| **Durable Functions: .NET in-process** | ❌ | ❌ | ❌ |
| **Durable Functions: JavaScript** | ❌ | ❌ | ❌ |
| **Durable Functions: Python** | ❌ | ❌ | ❌ |
| **Durable Functions: Java** | ✅ | ❌ | ✅ |

## How tags work

When you schedule an orchestration or activity, you can supply a dictionary of string key-value pairs as tags. The Durable Task Scheduler stores these tags as part of the instance metadata, where they can be used to:

- **Categorize work** — Group related orchestrations and activities by attributes meaningful to your application (environment, tenant, workflow type).
- **Correlate and trace** — Attach identifiers (request ID, customer ID) to follow a unit of work across instances.
- **Filter and query** — Retrieve orchestrations that match a specific set of tags.

Tags are set when the instance is scheduled and don't change after creation.

## Add tags to an orchestration instance

# [C#](#tab/csharp)

```csharp
var options = new StartOrchestrationOptions
{
    InstanceId = "order-12345",
    Tags = new Dictionary<string, string>
    {
        { "environment", "production" },
        { "tenant", "contoso" },
    },
};

string instanceId = await client.ScheduleNewOrchestrationInstanceAsync(
    "ProcessOrderOrchestration", input: order, options: options);
```

# [JavaScript](#tab/javascript)

```typescript
const instanceId = await client.scheduleNewOrchestration(
    "ProcessOrderOrchestration",
    order,
    {
        instanceId: "order-12345",
        tags: {
            environment: "production",
            tenant: "contoso",
        },
    }
);
```

# [Python](#tab/python)

```python
instance_id = client.schedule_new_orchestration(
    "process_order_orchestration",
    input=order,
    instance_id="order-12345",
    tags={
        "environment": "production",
        "tenant": "contoso",
    },
)
```

# [Java](#tab/java)

```java
NewOrchestrationInstanceOptions options = new NewOrchestrationInstanceOptions()
    .setInstanceId("order-12345")
    .setTags(Map.of(
        "environment", "production",
        "tenant", "contoso"
    ));

String instanceId = client.scheduleNewOrchestrationInstance(
    "ProcessOrderOrchestration", order, options);
```

---

## Add tags to an activity

# [C#](#tab/csharp)

```csharp
var options = new TaskOptions(tags: new Dictionary<string, string>
{
    { "scheduleId", scheduleId },
});

await context.CallActivityAsync(nameof(CacheClearingActivity), options);
```

# [JavaScript](#tab/javascript)

```typescript
const result: string = yield ctx.callActivity(
    cacheClearingActivity,
    input,
    {
        tags: {
            scheduleId: scheduleId,
        },
    }
);
```

# [Python](#tab/python)

```python
result = yield ctx.call_activity(
    "cache_clearing_activity",
    input=input_data,
    tags={
        "scheduleId": schedule_id,
    },
)
```

# [Java](#tab/java)

Activity tags aren't supported in the Java SDK. `TaskOptions` supports retry policies only.

---

## Add tags to a sub-orchestration

# [C#](#tab/csharp)

```csharp
var options = new TaskOptions(tags: new Dictionary<string, string>
{
    { "workflowType", "order-processing" },
});

await context.CallSubOrchestratorAsync(
    "ValidateOrderOrchestration", input: order, options: options);
```

# [JavaScript](#tab/javascript)

```typescript
const result = yield ctx.callSubOrchestrator(
    validateOrderOrchestration,
    order,
    {
        tags: {
            workflowType: "order-processing",
        },
    }
);
```

# [Python](#tab/python)

```python
result = yield ctx.call_sub_orchestrator(
    "validate_order_orchestration",
    input=order,
    tags={
        "workflowType": "order-processing",
    },
)
```

# [Java](#tab/java)

Sub-orchestration tags aren't supported in the Java SDK. `TaskOptions` supports retry policies only.

---

## Read tags

# [C#](#tab/csharp)

```csharp
OrchestrationMetadata? instance = await client.GetInstanceAsync(instanceId);

if (instance is not null)
{
    foreach (KeyValuePair<string, string> tag in instance.Tags)
    {
        Console.WriteLine($"{tag.Key} = {tag.Value}");
    }
}
```

# [JavaScript](#tab/javascript)

```typescript
const state = await client.getOrchestrationState(instanceId);

if (state) {
    for (const [key, value] of Object.entries(state.tags)) {
        console.log(`${key} = ${value}`);
    }
}
```

# [Python](#tab/python)

Reading tags isn't supported in the Python SDK. Tags aren't surfaced in `OrchestrationState`.

# [Java](#tab/java)

```java
OrchestrationMetadata metadata = client.getInstanceMetadata(instanceId, false);

if (metadata != null) {
    Map<String, String> tags = metadata.getTags();
    for (Map.Entry<String, String> tag : tags.entrySet()) {
        System.out.println(tag.getKey() + " = " + tag.getValue());
    }
}
```

---

## Query tags

You can filter orchestrations by tag in the [Durable Task Scheduler dashboard](durable-task-scheduler-dashboard.md) using the **Tag filter**, which matches on tag key or value; tags also appear as a column in the orchestration list. 

:::image type="content" source="media/durable-task-scheduler-dashboard/dashboard-tag-filter.png" alt-text="Screenshot of the Durable Task Scheduler dashboard showing the tag filter and tags column in the orchestration list.":::

## Tag guidelines

- **Use consistent keys** — Follow a naming convention so you can reliably filter and query.
- **Keep tags meaningful** — Use values that provide context.
- **Use string values** — Keys and values are strings.
- **Mind tag size** — Each tag value can be up to **1,000 bytes**. Multi-byte UTF-8 characters count as more than one byte each. There's no fixed limit on the number of tags, but they're bounded by the per-value size and the overall instance metadata payload.

## Limitations

- Tags are set when an instance is scheduled and are immutable afterward.
- Tag keys and values are strings.

## Next steps

> [!div class="nextstepaction"]
> [Instance management](../common/durable-task-instance-management.md)

- [Develop with Durable Task Scheduler](develop-with-durable-task-scheduler.md)
- [Auto-purge orchestration data](durable-task-scheduler-auto-purge.md)
- [Export orchestration history](durable-task-scheduler-export-history.md)
