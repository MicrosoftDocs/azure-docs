---
author: hhunter-ms
ms.author: hannahhunter
title: Add Tags to Orchestrations and Activities in Durable Task Scheduler
titleSuffix: Durable Task
description: Learn how to use tags to attach custom key-value metadata to orchestrations, activities, and sub-orchestrations in Durable Task Scheduler.
ms.topic: how-to
ms.service: durable-task
ms.subservice: durable-task-scheduler
ms.date: 07/24/2026
---

# Add Tags to Orchestrations and Activities in Durable Task Scheduler

[!INCLUDE [functions-in-process-model-retirement-note](../includes/functions-in-process-model-retirement-note.md)]

Tags are key-value pairs that you can attach to orchestrations, activities, and sub-orchestrations to add custom metadata. Use tags to categorize and correlate work as it runs. You can also use orchestration tags to query orchestration instances.

You can add tags to:

- **Orchestration instances** — when you start a new orchestration from the client.
- **Activities** — when an orchestrator schedules an activity.
- **Sub-orchestrations** — when an orchestrator schedules a child orchestration.

## SDK and extension support

| SDK/Extension | Orchestration tags | Activity tags | Sub-orchestration tags | Read orchestration tags |
|---|---|---|---|---|
| **Durable Task .NET SDK** (`durabletask-dotnet`) | ✅ | ✅ | ✅ | ✅ |
| **Durable Task JavaScript SDK** (`durabletask-js`) | ✅ | ✅ | ✅ | ✅ |
| **Durable Task Python SDK** (`durabletask-python`) | ✅ | ✅ | ❌ | ❌ (not surfaced in `OrchestrationState`) |
| **Durable Task Java SDK** (`durabletask-java`) | ✅ (v1.6.0+) | ❌ (`TaskOptions` is retry-only) | ❌ | ✅ |
| **Durable Functions: .NET isolated** | ✅ | ✅ | ✅ | ✅ |
| **Durable Functions: .NET in-process** | ❌ | ❌ | ❌ | ❌ |
| **Durable Functions: JavaScript** | ❌ | ❌ | ❌ | ❌ |
| **Durable Functions: Python** | ❌ | ❌ | ❌ | ❌ |
| **Durable Functions: Java** | ✅ | ❌ | ❌ | ✅ |

## How tags work

When you schedule an orchestration, activity, or sub-orchestration, you can supply a dictionary of string key-value pairs as tags. The Durable Task Scheduler stores and exposes tags differently depending on what you tag:

- **Orchestration tags** are stored as metadata on the orchestration instance. Tags you supply when calling a sub-orchestration become metadata on the child orchestration instance. You can read these tags and filter orchestration instances by tag.
- **Activity tags** are stored on the activity's scheduled event in the parent orchestration history. You can inspect them in orchestration history, but they aren't indexed or available in orchestration tag queries. Activity tags also aren't passed to the activity function.

Set tags when you schedule the orchestration, activity, or sub-orchestration. You can't change tags afterward.

## Set a custom display name

Use the well-known `durabletask.displayName` tag to give an orchestration, sub-orchestration, or activity a name intended for people viewing a run. When this tag has a nonempty value, the Durable Task Scheduler dashboard shows that value wherever it would otherwise show the registered name, including the orchestration list, flow and sequence views, and detail panels.

The registered name isn't discarded or changed. It remains available in the dashboard tooltip and details, and the custom display name doesn't affect what code runs. If the tag is missing or empty, the dashboard shows the registered name as usual.

> [!IMPORTANT]
> The `durabletask.` prefix is reserved for the platform. The dashboard hides tags whose keys start with `durabletask.` from the normal tag list so platform tags, such as `durabletask.displayName`, don't appear both as interpreted metadata and as raw tags. Don't create your own tag keys under the `durabletask.` prefix.

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
var options = new SubOrchestrationOptions
{
    Tags = new Dictionary<string, string>
    {
        { "workflowType", "order-processing" },
    },
};

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

The Python SDK doesn't support sub-orchestration tags.

# [Java](#tab/java)

Sub-orchestration tags aren't supported in the Java SDK. `TaskOptions` supports retry policies only.

---

## Read orchestration tags

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

The Python SDK doesn't support reading orchestration tags. `OrchestrationState` doesn't surface tags.

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

In the [Durable Task Scheduler dashboard](durable-task-scheduler-dashboard.md), use the **Tag filter** to filter orchestration instances by orchestration tag. The filter matches on tag key or value. The orchestration list also shows orchestration tags as a column.  

Activity tags appear in the activity's scheduled event in orchestration history. They aren't included in the orchestration list's **Tag filter**.

:::image type="content" source="media/durable-task-scheduler-dashboard/dashboard-tag-filter.png" alt-text="Screenshot of the Durable Task Scheduler dashboard showing the tag filter and tags column in the orchestration list.":::

## Tag guidelines

- **Use consistent keys** — Follow a naming convention so you can reliably filter orchestration instances and correlate activities.
- **Keep tags meaningful** — Use values that provide context.
- **Use string values** — Keys and values are strings.
- **Mind orchestration tag size** — The complete JSON-serialized orchestration tag dictionary can be up to **1,000 bytes**. This limit includes all keys and values, and multibyte UTF-8 characters count as more than one byte each. Activity tags don't use this orchestration instance metadata limit, but they contribute to orchestration history size.

## Limitations

- Tags are immutable after the orchestration, activity, or sub-orchestration is scheduled.
- Tag keys and values are strings.
- You can inspect activity tags in orchestration history, but you can't query them. You also can't pass them to activity functions.

## Next steps

> [!div class="nextstepaction"]
> [Instance management](../common/durable-task-instance-management.md)

- [Develop with Durable Task Scheduler](develop-with-durable-task-scheduler.md)
- [Auto-purge orchestration data](durable-task-scheduler-auto-purge.md)
- [Export orchestration history](durable-task-scheduler-export-history.md)
